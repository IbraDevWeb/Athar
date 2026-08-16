from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from v63_semantic_index import INDEX_VERSION


def build_release(corpus_manifest: Path, index_dir: Path) -> dict[str, Any]:
    corpus = json.loads(corpus_manifest.read_text(encoding="utf-8"))
    shards = [row for row in corpus.get("shards") or [] if isinstance(row, dict)]
    if not shards:
        raise RuntimeError("Le manifeste corpus ne contient aucun shard.")

    semantic: list[dict[str, Any]] = []
    model = ""
    dimension = 0
    dtype = ""
    total_vectors = 0
    vector_bytes = 0
    metadata_bytes = 0

    for shard in shards:
        shard_id = str(shard.get("id") or "")
        path = index_dir / f"{shard_id}.semantic.json"
        if not path.exists():
            raise RuntimeError(f"Index sémantique absent: {shard_id}")
        entry = json.loads(path.read_text(encoding="utf-8"))
        if entry.get("version") != INDEX_VERSION or not entry.get("complete"):
            raise RuntimeError(f"Index sémantique incomplet/incompatible: {shard_id}")
        if entry.get("source_database_sha256") != shard.get("database_sha256"):
            raise RuntimeError(f"SHA du shard source incompatible: {shard_id}")
        expected_chunks = int(shard.get("chunks") or 0)
        if int(entry.get("target_count") or 0) != expected_chunks:
            raise RuntimeError(
                f"Nombre de passages incompatible pour {shard_id}: "
                f"{entry.get('target_count')} != {expected_chunks}"
            )
        if int(entry.get("indexed_count") or 0) != expected_chunks:
            raise RuntimeError(f"Index incomplet pour {shard_id}")
        if int(entry.get("max_chunks") or 0) != 0:
            raise RuntimeError(f"Un index partiel ne peut pas entrer dans une release: {shard_id}")

        current_model = str(entry.get("model") or "")
        current_dim = int(entry.get("dimension") or 0)
        current_dtype = str(entry.get("dtype") or "")
        if not model:
            model, dimension, dtype = current_model, current_dim, current_dtype
        elif (current_model, current_dim, current_dtype) != (model, dimension, dtype):
            raise RuntimeError(f"Configuration d'embedding hétérogène: {shard_id}")

        total_vectors += expected_chunks
        vector_bytes += int(entry.get("vectors_size_bytes") or 0)
        metadata_bytes += int(entry.get("metadata_size_bytes") or 0)
        semantic.append(entry)

    expected_total = int(corpus.get("chunks") or 0)
    if total_vectors != expected_total:
        raise RuntimeError(f"Total sémantique incohérent: {total_vectors} != {expected_total}")

    return {
        "version": 1,
        "semantic_index_version": INDEX_VERSION,
        "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "corpus_version": corpus.get("version"),
        "corpus_source_sha": corpus.get("source_sha"),
        "corpus_chunks": expected_total,
        "shard_count": len(semantic),
        "model": model,
        "dimension": dimension,
        "dtype": dtype,
        "normalized": True,
        "vector_bytes": vector_bytes,
        "metadata_bytes": metadata_bytes,
        "total_index_bytes": vector_bytes + metadata_bytes,
        "shards": semantic,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus-manifest", type=Path, required=True)
    parser.add_argument("--index-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    payload = build_release(args.corpus_manifest, args.index_dir)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
