from __future__ import annotations

"""Athar V6.5.2 compact quantized ANN.

The accepted V6.3-B float16 embeddings remain the source of truth. This module
builds a disposable USearch HNSW using cosine i8 scalar quantization and a
minimal SQLite key map. The compact map intentionally has no secondary indexes:
semantic serving only resolves returned ANN keys, while all canonical passage
hydration still happens in the public corpus process.
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
from v63c_ann_index import (
    DEFAULT_CONNECTIVITY,
    DEFAULT_EXPANSION_ADD,
    DEFAULT_EXPANSION_SEARCH,
)

ANN_VERSION = "athar-global-ann-usearch-i8-v1"
ANN_DTYPE = "i8"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _usearch_version() -> str:
    try:
        return importlib.metadata.version("usearch")
    except importlib.metadata.PackageNotFoundError:
        return "unknown"


def _open_ro(path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(
        f"file:{path.resolve().as_posix()}?mode=ro&immutable=1",
        uri=True,
        timeout=15,
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA mmap_size=0")
    conn.execute("PRAGMA cache_size=-2048")
    return conn


def _create_compact_meta(path: Path) -> sqlite3.Connection:
    path.unlink(missing_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(
        """
        PRAGMA journal_mode=OFF;
        PRAGMA synchronous=OFF;
        PRAGMA temp_store=MEMORY;
        CREATE TABLE ann_rows (
            ann_key INTEGER PRIMARY KEY,
            shard_id TEXT NOT NULL,
            row_index INTEGER NOT NULL,
            chunk_id TEXT NOT NULL,
            book_id TEXT NOT NULL,
            discipline TEXT,
            madhhab TEXT
        );
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

    index_path = output_dir / "athar-v652-global-i8.usearch"
    meta_path = output_dir / "athar-v652-global-i8.meta.sqlite"
    manifest_path = output_dir / "athar-v652-global-i8.ann.json"
    index_path.unlink(missing_ok=True)
    manifest_path.unlink(missing_ok=True)

    # USearch handles the f32 -> i8 scalar quantization internally. For cosine
    # i8 it normalizes and scales components into the signed 8-bit range.
    index = Index(
        ndim=dim,
        metric="cos",
        dtype=ANN_DTYPE,
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

    global_meta = _create_compact_meta(meta_path)
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
            meta = sqlite3.connect(f"file:{sidecar_path.resolve().as_posix()}?mode=ro", uri=True)
            meta.row_factory = sqlite3.Row
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
                                offset + int(row["row_index"]),
                                shard_id,
                                int(row["row_index"]),
                                str(row["chunk_id"]),
                                str(row["book_id"]),
                                str(row["discipline"] or ""),
                                str(row["madhhab"] or ""),
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
        global_meta.execute("VACUUM")
        global_meta.commit()
        index.save(str(index_path))
    finally:
        global_meta.close()

    if first_vector is None:
        raise RuntimeError("Aucun vecteur n'a été indexé.")

    check = Index(
        ndim=dim,
        metric="cos",
        dtype=ANN_DTYPE,
        expansion_search=expansion_search,
    )
    check.load(str(index_path))
    matches = check.search(first_vector, 1)
    if not len(matches) or int(matches[0].key) != int(first_key):
        raise RuntimeError("L'index ANN i8 sérialisé ne retrouve pas son vecteur de contrôle.")

    payload = {
        "version": ANN_VERSION,
        "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "corpus_version": semantic_release.get("corpus_version"),
        "corpus_source_sha": semantic_release.get("corpus_source_sha"),
        "semantic_index_version": semantic_release.get("semantic_index_version"),
        "semantic_model": model,
        "dimension": dim,
        "dtype": ANN_DTYPE,
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
        "metadata_layout": "primary-key-only-v1",
    }
    manifest_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return payload


class QuantizedGlobalAnnIndex:
    """Thread-safe read-only disk-view index for the compact i8 release."""

    def __init__(self, manifest_path: Path, *, verify_sha: bool = True) -> None:
        from usearch.index import Index

        self.manifest_path = manifest_path.resolve()
        self.manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        if self.manifest.get("version") != ANN_VERSION:
            raise RuntimeError("Version ANN i8 incompatible.")
        if self.manifest.get("dtype") != ANN_DTYPE:
            raise RuntimeError("Type ANN i8 incompatible.")
        root = self.manifest_path.parent
        self.index_path = root / str(self.manifest["index_file"])
        self.meta_path = root / str(self.manifest["metadata_file"])
        if not self.index_path.exists() or not self.meta_path.exists():
            raise RuntimeError("Fichiers ANN i8 incomplets.")
        if self.index_path.stat().st_size != int(self.manifest["index_size_bytes"]):
            raise RuntimeError("Taille de l'index ANN i8 invalide.")
        if self.meta_path.stat().st_size != int(self.manifest["metadata_size_bytes"]):
            raise RuntimeError("Taille du mapping ANN i8 invalide.")
        if verify_sha:
            if sha256(self.index_path) != str(self.manifest["index_sha256"]):
                raise RuntimeError("SHA de l'index ANN i8 invalide.")
            if sha256(self.meta_path) != str(self.manifest["metadata_sha256"]):
                raise RuntimeError("SHA du mapping ANN i8 invalide.")

        self.index = Index(
            ndim=int(self.manifest["dimension"]),
            metric=str(self.manifest["metric"]),
            dtype=ANN_DTYPE,
            expansion_search=max(16, int(self.manifest.get("expansion_search") or DEFAULT_EXPANSION_SEARCH)),
        )
        self.index.view(str(self.index_path))
        with _open_ro(self.meta_path) as meta:
            mapped = int(meta.execute("SELECT COUNT(*) FROM ann_rows").fetchone()[0])
        if mapped != int(self.manifest["vectors"]):
            raise RuntimeError(f"Mapping ANN i8 incomplet: {mapped}/{self.manifest['vectors']}")

    def close(self) -> None:
        # USearch's disk view is released with the Python object. No persistent
        # SQLite connection is held, which keeps ThreadingHTTPServer safe.
        pass

    def rows_for_keys(self, keys: Iterable[int]) -> dict[int, dict[str, Any]]:
        values = [int(key) for key in keys]
        if not values:
            return {}
        result: dict[int, dict[str, Any]] = {}
        with _open_ro(self.meta_path) as meta:
            for start in range(0, len(values), 500):
                batch = values[start:start + 500]
                marks = ",".join("?" for _ in batch)
                for row in meta.execute(
                    f"SELECT * FROM ann_rows WHERE ann_key IN ({marks})",
                    batch,
                ).fetchall():
                    result[int(row["ann_key"])] = dict(row)
        return result

    def search(self, query_vector: np.ndarray, *, top_k: int = 40) -> list[dict[str, Any]]:
        query = np.asarray(query_vector, dtype=np.float32)
        if query.ndim != 1 or query.shape[0] != int(self.manifest["dimension"]):
            raise ValueError("Dimension de requête ANN i8 invalide.")
        norm = float(np.linalg.norm(query))
        if not np.isfinite(norm) or norm <= 1e-12:
            raise ValueError("Vecteur de requête ANN i8 nul ou non fini.")
        query = query / norm
        top_k = max(1, min(int(top_k), int(self.manifest["vectors"])))
        matches = self.index.search(query, top_k)
        keys = [int(match.key) for match in matches]
        rows = self.rows_for_keys(keys)
        result: list[dict[str, Any]] = []
        for rank, match in enumerate(matches, 1):
            row = rows.get(int(match.key))
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
    validate.add_argument("--skip-sha", action="store_true")
    args = parser.parse_args()

    if args.command == "build":
        build_ann(
            args.corpus_manifest,
            args.semantic_index_dir,
            args.output_dir,
            connectivity=args.connectivity,
            expansion_add=args.expansion_add,
            expansion_search=args.expansion_search,
            batch_size=args.batch_size,
        )
        return 0
    index = QuantizedGlobalAnnIndex(args.manifest, verify_sha=not args.skip_sha)
    try:
        print(json.dumps(index.manifest, ensure_ascii=False, indent=2))
    finally:
        index.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
