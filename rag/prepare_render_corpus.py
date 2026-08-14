from __future__ import annotations

import argparse
import json
from pathlib import Path

from cache_hosted_corpus import cache_release
from fetch_hosted_corpus import load_manifest, validate_database

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "rag" / "data" / "athar_hosted.sqlite"


def prepare(output: Path) -> dict[str, object]:
    manifest = load_manifest()
    cached = cache_release(output)
    validated = validate_database(
        output,
        min_openiti_books=int(manifest.get("min_openiti_books") or 0),
    )
    return {
        "mode": "render_build_prepared",
        "path": str(output),
        "database_bytes": output.stat().st_size,
        "release": {
            "tag": str(manifest.get("tag") or ""),
            "sha256": str(manifest.get("sha256") or ""),
            "size_bytes": int(manifest.get("size_bytes") or 0),
            "min_openiti_books": int(manifest.get("min_openiti_books") or 0),
        },
        "cached": cached,
        "validated": validated,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Prépare et valide le corpus SQLite complet pendant le build Render."
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    output = args.output if args.output.is_absolute() else ROOT / args.output
    print(json.dumps(prepare(output), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
