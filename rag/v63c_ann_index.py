from __future__ import annotations

"""Athar Research V6.3-C global ANN index built from V6.3-B embeddings.

The immutable corpus and the V6.3-B float16 vectors remain the source of truth.
This module adds a disposable HNSW/USearch acceleration layer plus a SQLite
sidecar mapping integer ANN keys back to canonical Athar chunk IDs.
"""

import argparse
import hashlib
import importlib.metadata
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import numpy as np

from v63_semantic_release import build_release

ANN_VERSION = "athar-global-ann-usearch-v1"
# The first real 574k-vector build used 16 / 128 / 128 and achieved only
# 78% mean Recall@10 against exact dense search. We intentionally keep the
# acceptance threshold at 95% and spend more of the available latency budget
# on graph quality and query depth instead of weakening the benchmark.
DEFAULT_CONNECTIVITY = 32
DEFAULT_EXPANSION_ADD = 256
DEFAULT_EXPANSION_SEARCH = 1024


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _open_ro(path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    return conn


def _create_meta(path: Path) -> sqlite3.Connection:
    path.unlink(missing_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(
        """
        PRAGMA journal_mode=OFF;
        PRAGMA synchronous=OFF;
        CREATE TABLE ann_rows (
            ann_key INTEGER PRIMARY KEY,
            shard_id TEXT NOT NULL,
            row_index INTEGER NOT NULL,
            chunk_id TEXT NOT NULL UNIQUE,
            book_id TEXT NOT NULL,
            discipline TEXT,
            madhhab TEXT
        );
        CREATE INDEX idx_ann_rows_chunk ON ann_rows(chunk_id);
        CREATE INDEX idx_ann_rows_book ON ann_rows(book_id);
        CREATE INDEX idx_ann_rows_shard ON ann_rows(shard_id);
        CREATE INDEX idx_ann_rows_madhhab ON ann_rows(madhhab);
        CREATE INDEX idx_ann_rows_discipline ON ann_rows(discipline);
        """
    )
    return conn


def _semantic_rows(meta: sqlite3.Connection, start: int, end: int) -> list[sqlite3.Row]:
    return meta.execute(
        """
        SELECT row_index, chunk_id, book_id, discipline, madhhab
        FROM semantic_rows
        WHERE row_index >= ? AND row_index < ?
        ORDER BY row_index
        """,
        (int(start), int(end)),
    ).fetchall()


def _usearch_version() -> str:
    try:
        return importlib.metadata.version("usearch")
    except importlib.metadata.PackageNotFoundError:
        return "unknown"


def build_ann(
    corpus_manifest: Path,
    semantic_index_dir: Path,
    output_dir: Path,
    *,
    connectivity: int = DEFAULT_CONNECTIVITY,
    expansion_add: int = DEFAULT_EXPANSION_ADD,
    expansion_search: int = DEFAULT_EXPANSION_SEARCH,
    batch_size: int = 8192,
) -> dict[str, Any]:
    from usearch.index import Index

    corpus_manifest = corpus_manifest.resolve()
    semantic_index_dir = semantic_index_dir.resolve()
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    batch_size = max(256, min(int(batch_size), 32768))

    semantic_release = build_release(corpus_manifest, semantic_index_dir)
    total = int(semantic_release["corpus_chunks"])
    dim = int(semantic_release["dimension"])
    model = str(semantic_release["model"])
    if total <= 0 or dim <= 0:
        raise RuntimeError("Release sémantique vide ou dimension invalide.")

    connectivity = max(4, int(connectivity))
    expansion_add = max(16, int(expansion_add))
    expansion_search = max(16, int(expansion_search))

    index_path = output_dir / "athar-v63c-global.usearch"
    meta_path = output_dir / "athar-v63c-global.meta.sqlite"
    manifest_path = output_dir / "athar-v63c-global.ann.json"
    index_path.unlink(missing_ok=True)
    manifest_path.unlink(missing_ok=True)

    index = Index(
        ndim=dim,
        metric="cos",
        dtype="f16",
        connectivity=connectivity,
        expansion_add=expansion_add,
        expansion_search=expansion_search,
        multi=False,
    )
    if hasattr(index, "reserve"):
        try:
            index.reserve(total)
        except Exception:
            pass

    global_meta = _create_meta(meta_path)
    offset = 0
    first_vector: np.ndarray | None = None
    first_key = 0
    try:
        for shard in semantic_release["shards"]:
            shard_id = str(shard["shard_id"])
            vector_path = semantic_index_dir / str(shard["vectors_file"])
            sidecar_path = semantic_index_dir / str(shard["metadata_file"])
            vectors = np.load(vector_path, mmap_mode="r")
            count = int(shard["indexed_count"])
            if vectors.shape != (count, dim):
                raise RuntimeError(f"Shape sémantique invalide pour {shard_id}: {vectors.shape}")
            meta = _open_ro(sidecar_path)
            try:
                meta_count = int(meta.execute("SELECT COUNT(*) FROM semantic_rows").fetchone()[0])
                if meta_count != count:
                    raise RuntimeError(f"Sidecar sémantique incomplet pour {shard_id}: {meta_count}/{count}")
                for start in range(0, count, batch_size):
                    end = min(start + batch_size, count)
                    block = np.asarray(vectors[start:end], dtype=np.float32)
                    if first_vector is None and len(block):
                        first_vector = np.asarray(block[0], dtype=np.float32).copy()
                        first_key = offset + start
                    keys = np.arange(offset + start, offset + end, dtype=np.uint64)
                    index.add(keys, block)
                    rows = _semantic_rows(meta, start, end)
                    if len(rows) != end - start:
                        raise RuntimeError(f"Mapping incomplet dans {shard_id}: {len(rows)}/{end-start}")
                    global_meta.executemany(
                        """
                        INSERT INTO ann_rows(ann_key, shard_id, row_index, chunk_id, book_id, discipline, madhhab)
                        VALUES(?,?,?,?,?,?,?)
                        """,
                        [
                            (
                                offset + int(row["row_index"]), shard_id, int(row["row_index"]),
                                str(row["chunk_id"]), str(row["book_id"]),
                                str(row["discipline"] or ""), str(row["madhhab"] or ""),
                            )
                            for row in rows
                        ],
                    )
                    global_meta.commit()
                    print(f"[{shard_id}] {end}/{count} · global={offset + end}/{total}")
            finally:
                meta.close()
            offset += count

        if offset != total:
            raise RuntimeError(f"Total ANN incohérent: {offset}/{total}")
        mapped = int(global_meta.execute("SELECT COUNT(*) FROM ann_rows").fetchone()[0])
        if mapped != total:
            raise RuntimeError(f"Métadonnées ANN incomplètes: {mapped}/{total}")
        global_meta.execute("PRAGMA optimize")
        global_meta.commit()
        index.save(str(index_path))
    finally:
        global_meta.close()

    if first_vector is None:
        raise RuntimeError("Aucun vecteur n'a été indexé.")

    # Reload from disk with the same query-depth contract used at runtime.
    # Without this explicit expansion_search, USearch falls back to its loader
    # default and the persisted manifest would not describe actual query behavior.
    check = Index(
        ndim=dim,
        metric="cos",
        dtype="f16",
        expansion_search=expansion_search,
    )
    check.load(str(index_path))
    matches = check.search(first_vector, 1)
    if not len(matches) or int(matches[0].key) != int(first_key):
        raise RuntimeError("L'index ANN sérialisé ne retrouve pas son vecteur de contrôle.")

    payload = {
        "version": ANN_VERSION,
        "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "corpus_version": semantic_release.get("corpus_version"),
        "corpus_source_sha": semantic_release.get("corpus_source_sha"),
        "semantic_index_version": semantic_release.get("semantic_index_version"),
        "semantic_model": model,
        "dimension": dim,
        "dtype": "f16",
        "metric": "cos",
        "vectors": total,
        "shards": int(semantic_release["shard_count"]),
        "usearch_version": _usearch_version(),
        "connectivity": connectivity,
        "expansion_add": expansion_add,
        "expansion_search": expansion_search,
        "index_file": index_path.name,
        "index_size_bytes": index_path.stat().st_size,
        "index_sha256": sha256(index_path),
        "metadata_file": meta_path.name,
        "metadata_size_bytes": meta_path.stat().st_size,
        "metadata_sha256": sha256(meta_path),
    }
    manifest_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return payload


class GlobalAnnIndex:
    def __init__(self, manifest_path: Path) -> None:
        from usearch.index import Index

        self.manifest_path = manifest_path.resolve()
        self.manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        if self.manifest.get("version") != ANN_VERSION:
            raise RuntimeError("Version ANN incompatible.")
        root = self.manifest_path.parent
        self.index_path = root / str(self.manifest["index_file"])
        self.meta_path = root / str(self.manifest["metadata_file"])
        if sha256(self.index_path) != self.manifest.get("index_sha256"):
            raise RuntimeError("SHA de l'index ANN invalide.")
        if sha256(self.meta_path) != self.manifest.get("metadata_sha256"):
            raise RuntimeError("SHA des métadonnées ANN invalide.")
        self.index = Index(
            ndim=int(self.manifest["dimension"]),
            metric=str(self.manifest["metric"]),
            dtype="f16",
            expansion_search=max(
                16, int(self.manifest.get("expansion_search") or DEFAULT_EXPANSION_SEARCH)
            ),
        )
        self.index.load(str(self.index_path))
        self.meta = _open_ro(self.meta_path)
        mapped = int(self.meta.execute("SELECT COUNT(*) FROM ann_rows").fetchone()[0])
        if mapped != int(self.manifest["vectors"]):
            raise RuntimeError(f"Mapping ANN incomplet: {mapped}/{self.manifest['vectors']}")

    def close(self) -> None:
        self.meta.close()

    def rows_for_keys(self, keys: Iterable[int]) -> dict[int, dict[str, Any]]:
        values = [int(key) for key in keys]
        if not values:
            return {}
        result: dict[int, dict[str, Any]] = {}
        for start in range(0, len(values), 500):
            batch = values[start:start + 500]
            marks = ",".join("?" for _ in batch)
            rows = self.meta.execute(
                f"SELECT * FROM ann_rows WHERE ann_key IN ({marks})", batch
            ).fetchall()
            for row in rows:
                result[int(row["ann_key"])] = dict(row)
        return result

    def search(self, query_vector: np.ndarray, *, top_k: int = 40) -> list[dict[str, Any]]:
        query = np.asarray(query_vector, dtype=np.float32)
        if query.ndim != 1 or query.shape[0] != int(self.manifest["dimension"]):
            raise ValueError("Dimension de requête ANN invalide.")
        norm = float(np.linalg.norm(query))
        if not np.isfinite(norm) or norm <= 1e-12:
            raise ValueError("Vecteur de requête ANN nul ou non fini.")
        query = query / norm
        top_k = max(1, min(int(top_k), int(self.manifest["vectors"])))
        matches = self.index.search(query, top_k)
        keys = [int(match.key) for match in matches]
        rows = self.rows_for_keys(keys)
        result: list[dict[str, Any]] = []
        for rank, match in enumerate(matches, 1):
            key = int(match.key)
            row = rows.get(key)
            if not row:
                continue
            distance = float(match.distance)
            result.append({
                **row,
                "ann_rank": rank,
                "ann_distance": distance,
                "ann_similarity": 1.0 - distance,
            })
        return result


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    build = sub.add_parser("build")
    build.add_argument("--corpus-manifest", type=Path, required=True)
    build.add_argument("--semantic-index-dir", type=Path, required=True)
    build.add_argument("--output-dir", type=Path, required=True)
    build.add_argument("--connectivity", type=int, default=DEFAULT_CONNECTIVITY)
    build.add_argument("--expansion-add", type=int, default=DEFAULT_EXPANSION_ADD)
    build.add_argument("--expansion-search", type=int, default=DEFAULT_EXPANSION_SEARCH)
    build.add_argument("--batch-size", type=int, default=8192)
    validate = sub.add_parser("validate")
    validate.add_argument("--manifest", type=Path, required=True)
    args = parser.parse_args()

    if args.command == "build":
        build_ann(
            args.corpus_manifest, args.semantic_index_dir, args.output_dir,
            connectivity=args.connectivity, expansion_add=args.expansion_add,
            expansion_search=args.expansion_search, batch_size=args.batch_size,
        )
        return 0
    index = GlobalAnnIndex(args.manifest)
    try:
        print(json.dumps(index.manifest, ensure_ascii=False, indent=2))
    finally:
        index.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
