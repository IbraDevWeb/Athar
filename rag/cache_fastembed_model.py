from __future__ import annotations

"""Pre-cache and validate the production FastEmbed query encoder at build time."""

import argparse
import json
import os
from pathlib import Path

from v63_hybrid import DEFAULT_MODEL

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CACHE = ROOT / "rag" / "data" / "fastembed-cache"


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    args = parser.parse_args()

    cache_dir = rooted(args.cache_dir).resolve()
    cache_dir.mkdir(parents=True, exist_ok=True)
    os.environ["FASTEMBED_CACHE_PATH"] = str(cache_dir)

    from fastembed import TextEmbedding

    model = TextEmbedding(model_name=str(args.model), cache_dir=str(cache_dir))
    vectors = list(model.query_embed(["Athar production semantic warmup"]))
    if len(vectors) != 1 or len(vectors[0]) != 384:
        raise RuntimeError("Embedding de warmup production invalide.")

    payload = {
        "status": "ready",
        "model": str(args.model),
        "dimension": len(vectors[0]),
        "cache_dir": str(cache_dir),
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
