from __future__ import annotations

import argparse
import json
from pathlib import Path

from fetch_hosted_corpus import download_release, load_manifest, sha256_file

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "rag" / "data" / "athar_hosted.sqlite.gz"


def cache_release(output: Path) -> dict[str, object]:
    manifest = load_manifest()
    compression = str(manifest.get("compression") or "").strip().lower()
    if compression != "gzip":
        raise RuntimeError(f"Le corpus hébergé doit être publié en gzip pour Render, reçu: {compression or 'aucun'}.")
    url = str(manifest.get("url") or "").strip()
    expected_sha = str(manifest.get("sha256") or "").strip().lower()
    expected_size = int(manifest.get("size_bytes") or 0)
    if not url or not expected_sha:
        raise RuntimeError("Le manifeste corpus doit fournir une URL et un SHA-256.")
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        actual_size = output.stat().st_size
        if (not expected_size or actual_size == expected_size) and sha256_file(output).lower() == expected_sha:
            return {"mode": "build_cache_reused", "path": str(output), "bytes": actual_size, "sha256": expected_sha, "release": manifest}
        output.unlink()
    download = download_release(url, output, expected_sha256=expected_sha)
    actual_size = output.stat().st_size
    if expected_size and actual_size != expected_size:
        output.unlink(missing_ok=True)
        raise RuntimeError(f"Taille d'archive invalide: {actual_size}, attendu {expected_size}.")
    return {"mode": "build_cache_downloaded", "path": str(output), "bytes": actual_size, "sha256": str(download["sha256"]), "release": manifest}


def main() -> int:
    parser = argparse.ArgumentParser(description="Cache le corpus RAG compressé dans l'artefact de build Render.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    output = args.output if args.output.is_absolute() else ROOT / args.output
    print(json.dumps(cache_release(output), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
