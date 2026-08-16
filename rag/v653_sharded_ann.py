from __future__ import annotations

"""Athar V6.5.3 low-working-set sharded f16 ANN.

The accepted f16 embeddings stay unchanged. Instead of one ~526 MB HNSW view,
this format stores one HNSW per corpus shard and opens/searches them sequentially.
That keeps the semantic sidecar working set bounded by the largest shard while
preserving f16 vector precision. A single compact primary-key map rehydrates ANN
keys after the per-shard results are merged.
"""

import argparse
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import numpy as np

from v63_semantic_release import build_release
from v63c_ann_index import DEFAULT_EXPANSION_ADD, DEFAULT_EXPANSION_SEARCH
from v652_quantized_ann import _create_compact_meta, _open_ro, _semantic_rows, _usearch_version, sha256

ANN_VERSION = "athar-sharded-ann-usearch-f16-v1"
ANN_DTYPE = "f16"
DEFAULT_CONNECTIVITY = 16


def build_ann(
    corpus_manifest: Path,
    semantic_index_dir: Path,
    output_dir: Path,
    *,
    connectivity: int = DEFAULT_CONNECTIVITY,
    expansion_add: int = 256,
    expansion_search: int = 1024,
    batch_size: int = 8192,
) -> dict[str, Any]:
    from usearch.index import Index

    corpus_manifest = corpus_manifest.resolve()
    semantic_index_dir = semantic_index_dir.resolve()
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    batch_size = max(256, min(int(batch_size), 32768))
    release = build_release(corpus_manifest, semantic_index_dir)
    total = int(release["corpus_chunks"])
    dim = int(release["dimension"])
    connectivity = max(4, int(connectivity))
    expansion_add = max(16, int(expansion_add))
    expansion_search = max(16, int(expansion_search))

    meta_path = output_dir / "athar-v653-sharded.meta.sqlite"
    manifest_path = output_dir / "athar-v653-sharded.ann.json"
    manifest_path.unlink(missing_ok=True)
    meta = _create_compact_meta(meta_path)
    offset = 0
    built_shards: list[dict[str, Any]] = []
    try:
        for shard in release["shards"]:
            shard_id = str(shard["shard_id"])
            count = int(shard["indexed_count"])
            vectors_path = semantic_index_dir / str(shard["vectors_file"])
            source_meta_path = semantic_index_dir / str(shard["metadata_file"])
            vectors = np.load(vectors_path, mmap_mode="r")
            if vectors.shape != (count, dim):
                raise RuntimeError(f"Shape sémantique invalide pour {shard_id}: {vectors.shape}")
            index_path = output_dir / f"athar-v653-{shard_id}.f16.usearch"
            index_path.unlink(missing_ok=True)
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
                    index.reserve(count)
                except Exception:
                    pass
            source_meta = sqlite3.connect(f"file:{source_meta_path.resolve().as_posix()}?mode=ro", uri=True)
            source_meta.row_factory = sqlite3.Row
            first_vector: np.ndarray | None = None
            first_key = offset
            try:
                mapped = int(source_meta.execute("SELECT COUNT(*) FROM semantic_rows").fetchone()[0])
                if mapped != count:
                    raise RuntimeError(f"Sidecar sémantique incomplet pour {shard_id}: {mapped}/{count}")
                for start in range(0, count, batch_size):
                    end = min(start + batch_size, count)
                    block = np.asarray(vectors[start:end], dtype=np.float32)
                    if first_vector is None and len(block):
                        first_vector = block[0].copy()
                        first_key = offset + start
                    keys = np.arange(offset + start, offset + end, dtype=np.uint64)
                    index.add(keys, block)
                    rows = _semantic_rows(source_meta, start, end)
                    if len(rows) != end - start:
                        raise RuntimeError(f"Mapping incomplet dans {shard_id}: {len(rows)}/{end-start}")
                    meta.executemany(
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
                    meta.commit()
                index.save(str(index_path))
            finally:
                source_meta.close()

            if first_vector is None:
                raise RuntimeError(f"Shard ANN vide: {shard_id}")
            check = Index(ndim=dim, metric="cos", dtype=ANN_DTYPE, expansion_search=expansion_search)
            check.view(str(index_path))
            matches = check.search(first_vector, 1)
            if not len(matches) or int(matches[0].key) != int(first_key):
                raise RuntimeError(f"Contrôle de sérialisation ANN échoué: {shard_id}")
            del check
            del index

            built_shards.append({
                "shard_id": shard_id,
                "count": count,
                "global_offset": offset,
                "index_file": index_path.name,
                "index_size_bytes": index_path.stat().st_size,
                "index_sha256": sha256(index_path),
            })
            offset += count
            print(f"[{shard_id}] ANN f16 prêt · {count} vecteurs · global={offset}/{total}", flush=True)

        mapped_total = int(meta.execute("SELECT COUNT(*) FROM ann_rows").fetchone()[0])
        if mapped_total != total or offset != total:
            raise RuntimeError(f"Mapping sharded ANN incomplet: {mapped_total}/{total}, offset={offset}")
        meta.execute("VACUUM")
        meta.commit()
    finally:
        meta.close()

    payload = {
        "version": ANN_VERSION,
        "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "corpus_version": release.get("corpus_version"),
        "corpus_source_sha": release.get("corpus_source_sha"),
        "semantic_index_version": release.get("semantic_index_version"),
        "semantic_model": str(release["model"]),
        "dimension": dim,
        "dtype": ANN_DTYPE,
        "metric": "cos",
        "vectors": total,
        "shards": len(built_shards),
        "usearch_version": _usearch_version(),
        "connectivity": connectivity,
        "expansion_add": expansion_add,
        "expansion_search": expansion_search,
        "serving_mode": "sequential-shard-disk-view",
        "metadata_layout": "primary-key-only-v1",
        "metadata_file": meta_path.name,
        "metadata_size_bytes": meta_path.stat().st_size,
        "metadata_sha256": sha256(meta_path),
        "index_size_bytes": sum(int(s["index_size_bytes"]) for s in built_shards),
        "shard_indexes": built_shards,
        "largest_shard_index_bytes": max(int(s["index_size_bytes"]) for s in built_shards),
    }
    manifest_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return payload


class ShardedF16AnnIndex:
    def __init__(self, manifest_path: Path, *, verify_sha: bool = True) -> None:
        self.manifest_path = manifest_path.resolve()
        self.manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        if self.manifest.get("version") != ANN_VERSION or self.manifest.get("dtype") != ANN_DTYPE:
            raise RuntimeError("Manifest ANN sharded f16 incompatible.")
        root = self.manifest_path.parent
        self.meta_path = root / str(self.manifest["metadata_file"])
        if not self.meta_path.exists() or self.meta_path.stat().st_size != int(self.manifest["metadata_size_bytes"]):
            raise RuntimeError("Mapping ANN sharded absent ou invalide.")
        if verify_sha and sha256(self.meta_path) != str(self.manifest["metadata_sha256"]):
            raise RuntimeError("SHA mapping ANN sharded invalide.")
        self.shards: list[dict[str, Any]] = []
        total = 0
        for shard in self.manifest.get("shard_indexes") or []:
            row = dict(shard)
            path = root / str(row["index_file"])
            if not path.exists() or path.stat().st_size != int(row["index_size_bytes"]):
                raise RuntimeError(f"Index ANN shard invalide: {row.get('shard_id')}")
            if verify_sha and sha256(path) != str(row["index_sha256"]):
                raise RuntimeError(f"SHA ANN shard invalide: {row.get('shard_id')}")
            row["path"] = path
            total += int(row["count"])
            self.shards.append(row)
        if total != int(self.manifest["vectors"]):
            raise RuntimeError(f"Total ANN sharded incohérent: {total}/{self.manifest['vectors']}")
        with _open_ro(self.meta_path) as conn:
            mapped = int(conn.execute("SELECT COUNT(*) FROM ann_rows").fetchone()[0])
        if mapped != total:
            raise RuntimeError(f"Mapping ANN sharded incomplet: {mapped}/{total}")

    def close(self) -> None:
        pass

    def rows_for_keys(self, keys: Iterable[int]) -> dict[int, dict[str, Any]]:
        values = [int(x) for x in keys]
        if not values:
            return {}
        result: dict[int, dict[str, Any]] = {}
        with _open_ro(self.meta_path) as conn:
            for start in range(0, len(values), 500):
                batch = values[start:start + 500]
                marks = ",".join("?" for _ in batch)
                for row in conn.execute(f"SELECT * FROM ann_rows WHERE ann_key IN ({marks})", batch).fetchall():
                    result[int(row["ann_key"])] = dict(row)
        return result

    def search(self, query_vector: np.ndarray, *, top_k: int = 40) -> list[dict[str, Any]]:
        from usearch.index import Index

        query = np.asarray(query_vector, dtype=np.float32)
        if query.ndim != 1 or query.shape[0] != int(self.manifest["dimension"]):
            raise ValueError("Dimension de requête ANN sharded invalide.")
        norm = float(np.linalg.norm(query))
        if not np.isfinite(norm) or norm <= 1e-12:
            raise ValueError("Vecteur de requête ANN sharded nul ou non fini.")
        query = query / norm
        top_k = max(1, min(int(top_k), int(self.manifest["vectors"])))
        merged: list[tuple[int, float]] = []
        expansion_search = max(16, int(self.manifest.get("expansion_search") or DEFAULT_EXPANSION_SEARCH))
        for shard in self.shards:
            index = Index(
                ndim=int(self.manifest["dimension"]), metric="cos", dtype=ANN_DTYPE,
                expansion_search=expansion_search,
            )
            index.view(str(shard["path"]))
            matches = index.search(query, min(top_k, int(shard["count"])))
            merged.extend((int(match.key), float(match.distance)) for match in matches)
            del matches
            del index
        merged.sort(key=lambda item: item[1])
        merged = merged[:top_k]
        rows = self.rows_for_keys([key for key, _ in merged])
        result: list[dict[str, Any]] = []
        for rank, (key, distance) in enumerate(merged, 1):
            row = rows.get(key)
            if row:
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
    build.add_argument("--expansion-add", type=int, default=256)
    build.add_argument("--expansion-search", type=int, default=1024)
    build.add_argument("--batch-size", type=int, default=8192)
    validate = sub.add_parser("validate")
    validate.add_argument("--manifest", type=Path, required=True)
    validate.add_argument("--skip-sha", action="store_true")
    args = parser.parse_args()
    if args.command == "build":
        build_ann(
            args.corpus_manifest, args.semantic_index_dir, args.output_dir,
            connectivity=args.connectivity, expansion_add=args.expansion_add,
            expansion_search=args.expansion_search, batch_size=args.batch_size,
        )
        return 0
    index = ShardedF16AnnIndex(args.manifest, verify_sha=not args.skip_sha)
    try:
        print(json.dumps(index.manifest, ensure_ascii=False, indent=2))
    finally:
        index.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
