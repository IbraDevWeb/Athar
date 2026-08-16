from __future__ import annotations

"""Athar Research V6.3-B precomputed dense semantic indexes.

The index is deliberately stored next to, never inside, the immutable corpus
SQLite shards. Each shard produces three files:

- <shard>.vectors.f16.npy: L2-normalized dense vectors, memory-mappable;
- <shard>.meta.sqlite: chunk_id -> row_index plus routing metadata;
- <shard>.semantic.json: reproducibility/integrity manifest.

This first precomputed format is exact dense storage, not yet an ANN structure.
It removes repeated passage encoding from V6.3-A and gives us a deterministic
base from which an ANN layer can later be benchmarked without changing qrels.
"""

import argparse
import hashlib
import json
import math
import os
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Sequence

import numpy as np

from v63_hybrid import DEFAULT_MODEL, _candidate_text

INDEX_VERSION = "athar-semantic-f16-v1"
ROOT = Path(__file__).resolve().parents[1]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def open_readonly(path: Path) -> sqlite3.Connection:
    uri = f"file:{path.resolve().as_posix()}?mode=ro"
    connection = sqlite3.connect(uri, uri=True)
    connection.row_factory = sqlite3.Row
    return connection


def chunk_count(connection: sqlite3.Connection, max_chunks: int = 0) -> int:
    count = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
    if max_chunks > 0:
        return min(count, int(max_chunks))
    return count


def read_chunk_batch(connection: sqlite3.Connection, offset: int, limit: int) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT
            c.id AS id,
            c.book_id AS book_id,
            c.chapter AS chapter,
            c.text_ar AS text_ar,
            c.text_fr AS text_fr,
            b.title AS title,
            b.discipline AS discipline,
            b.madhhab AS madhhab
        FROM chunks c
        JOIN books b ON b.id = c.book_id
        ORDER BY c.id
        LIMIT ? OFFSET ?
        """,
        (int(limit), int(offset)),
    ).fetchall()
    return [dict(row) for row in rows]


def normalize_rows(vectors: np.ndarray) -> np.ndarray:
    matrix = np.asarray(vectors, dtype=np.float32)
    if matrix.ndim != 2 or matrix.shape[0] <= 0 or matrix.shape[1] <= 0:
        raise ValueError("Matrice d'embeddings invalide.")
    norms = np.linalg.norm(matrix, axis=1, keepdims=True)
    if np.any(~np.isfinite(norms)) or np.any(norms <= 1e-12):
        raise ValueError("Embedding nul ou non fini détecté.")
    return matrix / norms


def _atomic_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temp_name = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(handle, "w", encoding="utf-8") as stream:
            json.dump(payload, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        os.replace(temp_name, path)
    finally:
        try:
            os.unlink(temp_name)
        except FileNotFoundError:
            pass


def _meta_schema(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        PRAGMA journal_mode=WAL;
        PRAGMA synchronous=NORMAL;
        CREATE TABLE IF NOT EXISTS semantic_rows (
            row_index INTEGER PRIMARY KEY,
            chunk_id TEXT NOT NULL UNIQUE,
            book_id TEXT NOT NULL,
            discipline TEXT,
            madhhab TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_semantic_rows_chunk ON semantic_rows(chunk_id);
        CREATE INDEX IF NOT EXISTS idx_semantic_rows_book ON semantic_rows(book_id);
        CREATE INDEX IF NOT EXISTS idx_semantic_rows_discipline ON semantic_rows(discipline);
        CREATE INDEX IF NOT EXISTS idx_semantic_rows_madhhab ON semantic_rows(madhhab);
        """
    )


def _embed_passages(model: Any, texts: Sequence[str]) -> np.ndarray:
    vectors = list(model.passage_embed(list(texts)))
    if len(vectors) != len(texts):
        raise RuntimeError("Le modèle n'a pas retourné un vecteur par passage.")
    return normalize_rows(np.asarray(vectors, dtype=np.float32))


def _load_model(model_name: str):
    from fastembed import TextEmbedding

    return TextEmbedding(model_name=model_name)


def build_index(
    shard_db: Path,
    output_dir: Path,
    *,
    shard_id: str | None = None,
    model_name: str = DEFAULT_MODEL,
    batch_size: int = 64,
    max_chunks: int = 0,
    resume: bool = False,
    model: Any | None = None,
) -> dict[str, Any]:
    shard_db = shard_db.resolve()
    if not shard_db.exists():
        raise FileNotFoundError(shard_db)
    shard_id = str(shard_id or shard_db.stem).strip()
    if not shard_id:
        raise ValueError("shard_id vide.")
    batch_size = max(1, min(int(batch_size), 1024))
    output_dir.mkdir(parents=True, exist_ok=True)

    vectors_path = output_dir / f"{shard_id}.vectors.f16.npy"
    metadata_path = output_dir / f"{shard_id}.meta.sqlite"
    manifest_path = output_dir / f"{shard_id}.semantic.json"
    source_sha = sha256(shard_db)

    source = open_readonly(shard_db)
    meta: sqlite3.Connection | None = None
    try:
        total = chunk_count(source, max_chunks=max_chunks)
        if total <= 0:
            raise RuntimeError(f"Aucun chunk dans {shard_db.name}.")

        existing: dict[str, Any] = {}
        if resume and manifest_path.exists():
            existing = json.loads(manifest_path.read_text(encoding="utf-8"))
            if existing.get("source_database_sha256") != source_sha:
                raise RuntimeError("Impossible de reprendre: le shard source a changé.")
            if existing.get("model") != model_name:
                raise RuntimeError("Impossible de reprendre: le modèle a changé.")
            if int(existing.get("target_count") or 0) != total:
                raise RuntimeError("Impossible de reprendre: la taille cible a changé.")
        elif not resume:
            vectors_path.unlink(missing_ok=True)
            metadata_path.unlink(missing_ok=True)
            Path(f"{metadata_path}-wal").unlink(missing_ok=True)
            Path(f"{metadata_path}-shm").unlink(missing_ok=True)
            manifest_path.unlink(missing_ok=True)

        meta = sqlite3.connect(metadata_path)
        meta.row_factory = sqlite3.Row
        _meta_schema(meta)
        indexed = int(meta.execute("SELECT COUNT(*) FROM semantic_rows").fetchone()[0]) if resume else 0
        if indexed > total:
            raise RuntimeError("Index partiel incohérent: plus de lignes que la cible.")

        embedding_model = model or _load_model(model_name)
        matrix: np.memmap | None = None
        dimension = int(existing.get("dimension") or 0)

        if indexed > 0:
            if not vectors_path.exists() or dimension <= 0:
                raise RuntimeError("Index partiel incomplet: matrice ou dimension absente.")
            matrix = np.load(vectors_path, mmap_mode="r+")
            if matrix.shape != (total, dimension):
                raise RuntimeError(f"Shape index incompatible: {matrix.shape} != {(total, dimension)}")

        offset = indexed
        while offset < total:
            rows = read_chunk_batch(source, offset, min(batch_size, total - offset))
            if not rows:
                raise RuntimeError(f"Lecture interrompue à l'offset {offset}/{total}.")
            texts = [_candidate_text(row) for row in rows]
            embeddings = _embed_passages(embedding_model, texts)

            if matrix is None:
                dimension = int(embeddings.shape[1])
                matrix = np.lib.format.open_memmap(
                    vectors_path,
                    mode="w+",
                    dtype=np.float16,
                    shape=(total, dimension),
                )
            elif embeddings.shape[1] != dimension:
                raise RuntimeError("Dimension d'embedding instable entre les batches.")

            end = offset + len(rows)
            matrix[offset:end] = embeddings.astype(np.float16)
            matrix.flush()
            meta.executemany(
                "INSERT OR REPLACE INTO semantic_rows(row_index, chunk_id, book_id, discipline, madhhab) VALUES(?,?,?,?,?)",
                [
                    (
                        offset + i,
                        str(row["id"]),
                        str(row["book_id"]),
                        str(row.get("discipline") or ""),
                        str(row.get("madhhab") or ""),
                    )
                    for i, row in enumerate(rows)
                ],
            )
            meta.commit()
            offset = end
            payload = {
                "version": INDEX_VERSION,
                "shard_id": shard_id,
                "source_database": shard_db.name,
                "source_database_sha256": source_sha,
                "model": model_name,
                "dimension": dimension,
                "dtype": "float16",
                "normalized": True,
                "target_count": total,
                "indexed_count": offset,
                "complete": offset == total,
                "max_chunks": int(max_chunks),
                "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            }
            _atomic_json(manifest_path, payload)
            print(f"[{shard_id}] {offset}/{total} passages indexés")

        assert matrix is not None
        del matrix
        meta.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        meta.execute("PRAGMA journal_mode=DELETE")
        meta.commit()

        final_matrix = np.load(vectors_path, mmap_mode="r")
        if final_matrix.shape != (total, dimension):
            raise RuntimeError("Shape finale incohérente.")
        if not np.isfinite(np.asarray(final_matrix[: min(total, 32)], dtype=np.float32)).all():
            raise RuntimeError("Vecteurs non finis détectés dans l'échantillon de validation.")
        meta_count = int(meta.execute("SELECT COUNT(*) FROM semantic_rows").fetchone()[0])
        if meta_count != total:
            raise RuntimeError(f"Sidecar incomplet: {meta_count}/{total}")

        payload = json.loads(manifest_path.read_text(encoding="utf-8"))
        payload.update(
            {
                "complete": True,
                "indexed_count": total,
                "vectors_file": vectors_path.name,
                "vectors_size_bytes": vectors_path.stat().st_size,
                "vectors_sha256": sha256(vectors_path),
                "metadata_file": metadata_path.name,
                "metadata_size_bytes": metadata_path.stat().st_size,
                "metadata_sha256": sha256(metadata_path),
            }
        )
        _atomic_json(manifest_path, payload)
        return payload
    finally:
        if meta is not None:
            meta.close()
        source.close()


class SemanticShardIndex:
    def __init__(self, manifest_path: Path) -> None:
        self.manifest_path = manifest_path.resolve()
        self.manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        if self.manifest.get("version") != INDEX_VERSION or not self.manifest.get("complete"):
            raise RuntimeError(f"Index sémantique incomplet ou incompatible: {manifest_path}")
        self.directory = self.manifest_path.parent
        self.vectors_path = self.directory / str(self.manifest["vectors_file"])
        self.metadata_path = self.directory / str(self.manifest["metadata_file"])
        self.vectors = np.load(self.vectors_path, mmap_mode="r")
        self.metadata = open_readonly(self.metadata_path)
        expected = (int(self.manifest["indexed_count"]), int(self.manifest["dimension"]))
        if self.vectors.shape != expected:
            raise RuntimeError(f"Shape index invalide: {self.vectors.shape} != {expected}")

    def close(self) -> None:
        self.metadata.close()

    def get_vectors(self, chunk_ids: Sequence[str]) -> dict[str, np.ndarray]:
        ids = [str(value) for value in chunk_ids if str(value)]
        if not ids:
            return {}
        result: dict[str, np.ndarray] = {}
        step = 500
        for start in range(0, len(ids), step):
            batch = ids[start : start + step]
            marks = ",".join("?" for _ in batch)
            rows = self.metadata.execute(
                f"SELECT row_index, chunk_id FROM semantic_rows WHERE chunk_id IN ({marks})",
                batch,
            ).fetchall()
            for row in rows:
                result[str(row["chunk_id"])] = np.asarray(self.vectors[int(row["row_index"])], dtype=np.float32)
        return result

    def search(self, query_vector: np.ndarray, *, top_k: int = 10, block_size: int = 8192) -> list[tuple[int, float]]:
        query = np.asarray(query_vector, dtype=np.float32)
        qnorm = float(np.linalg.norm(query))
        if query.ndim != 1 or qnorm <= 1e-12 or not math.isfinite(qnorm):
            raise ValueError("Vecteur de requête invalide.")
        query = query / qnorm
        top_k = max(1, min(int(top_k), int(self.vectors.shape[0])))
        block_size = max(top_k, int(block_size))
        best: list[tuple[int, float]] = []
        for start in range(0, int(self.vectors.shape[0]), block_size):
            end = min(start + block_size, int(self.vectors.shape[0]))
            block = np.asarray(self.vectors[start:end], dtype=np.float32)
            scores = block @ query
            local_k = min(top_k, len(scores))
            indices = np.argpartition(scores, -local_k)[-local_k:]
            best.extend((start + int(i), float(scores[int(i)])) for i in indices)
            best = sorted(best, key=lambda item: item[1], reverse=True)[:top_k]
        return best


class SemanticIndexCollection:
    """Lazy collection of per-shard precomputed indexes."""

    def __init__(self, index_dir: Path, book_to_shard: dict[str, str]) -> None:
        self.index_dir = index_dir.resolve()
        self.book_to_shard = {str(k): str(v) for k, v in book_to_shard.items()}
        self._opened: dict[str, SemanticShardIndex] = {}

    def _open(self, shard_id: str) -> SemanticShardIndex:
        if shard_id not in self._opened:
            path = self.index_dir / f"{shard_id}.semantic.json"
            self._opened[shard_id] = SemanticShardIndex(path)
        return self._opened[shard_id]

    def get_source_vectors(self, sources: Sequence[dict[str, Any]]) -> dict[str, np.ndarray]:
        grouped: dict[str, list[str]] = {}
        for source in sources:
            chunk_id = str(source.get("id") or "")
            book_id = str(source.get("book_id") or "")
            shard_id = self.book_to_shard.get(book_id, "")
            if chunk_id and shard_id:
                grouped.setdefault(shard_id, []).append(chunk_id)
        result: dict[str, np.ndarray] = {}
        for shard_id, ids in grouped.items():
            path = self.index_dir / f"{shard_id}.semantic.json"
            if not path.exists():
                continue
            result.update(self._open(shard_id).get_vectors(ids))
        return result

    def close(self) -> None:
        for index in self._opened.values():
            index.close()
        self._opened.clear()


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    build = sub.add_parser("build")
    build.add_argument("--shard-db", type=Path, required=True)
    build.add_argument("--output-dir", type=Path, required=True)
    build.add_argument("--shard-id", default="")
    build.add_argument("--model", default=DEFAULT_MODEL)
    build.add_argument("--batch-size", type=int, default=64)
    build.add_argument("--max-chunks", type=int, default=0)
    build.add_argument("--resume", action="store_true")

    validate = sub.add_parser("validate")
    validate.add_argument("--manifest", type=Path, required=True)

    args = parser.parse_args()
    if args.command == "build":
        payload = build_index(
            args.shard_db,
            args.output_dir,
            shard_id=args.shard_id or None,
            model_name=args.model,
            batch_size=args.batch_size,
            max_chunks=args.max_chunks,
            resume=args.resume,
        )
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    index = SemanticShardIndex(args.manifest)
    try:
        print(json.dumps(index.manifest, ensure_ascii=False, indent=2))
    finally:
        index.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
