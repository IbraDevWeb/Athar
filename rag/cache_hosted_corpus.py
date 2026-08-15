from __future__ import annotations

import argparse
import gzip
import json
import os
import shutil
from pathlib import Path

from fetch_hosted_corpus import download_release, load_manifest, sha256_file

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "rag" / "data" / "athar_hosted.sqlite"
SQLITE_HEADER = b"SQLite format 3\x00"


def _valid_sqlite(path: Path) -> bool:
    if not path.exists() or path.stat().st_size < len(SQLITE_HEADER):
        return False
    with path.open("rb") as handle:
        return handle.read(len(SQLITE_HEADER)) == SQLITE_HEADER


def _reuse_matches(output: Path, manifest: dict[str, object]) -> bool:
    if not _valid_sqlite(output):
        return False
    database_size = int(manifest.get("database_size_bytes") or 0)
    database_sha = str(manifest.get("database_sha256") or "").strip().lower()
    compression = str(manifest.get("compression") or "none").strip().lower()
    if database_size and output.stat().st_size != database_size:
        return False
    if database_sha:
        return sha256_file(output).lower() == database_sha
    if compression == "none":
        expected_sha = str(manifest.get("sha256") or "").strip().lower()
        return bool(expected_sha) and sha256_file(output).lower() == expected_sha
    return False


def _decompress_gzip(asset: Path, output: Path) -> None:
    part = output.with_suffix(output.suffix + ".part")
    part.unlink(missing_ok=True)
    try:
        with gzip.open(asset, "rb") as source, part.open("wb") as destination:
            shutil.copyfileobj(source, destination, length=1024 * 1024)
        if not _valid_sqlite(part):
            raise RuntimeError("Le corpus décompressé n'est pas un SQLite valide.")
        os.replace(part, output)
    finally:
        part.unlink(missing_ok=True)


def cache_release(output: Path) -> dict[str, object]:
    manifest = load_manifest()
    url = str(manifest.get("url") or "").strip()
    expected_sha = str(manifest.get("sha256") or "").strip().lower()
    expected_asset_size = int(manifest.get("size_bytes") or 0)
    compression = str(manifest.get("compression") or "none").strip().lower()
    if not url or not expected_sha:
        raise RuntimeError("Le manifeste corpus doit fournir une URL et un SHA-256.")
    if compression not in {"none", "gzip"}:
        raise RuntimeError(f"Compression de corpus non prise en charge: {compression}.")

    output.parent.mkdir(parents=True, exist_ok=True)
    if _reuse_matches(output, manifest):
        return {
            "mode": "build_cache_reused",
            "path": str(output),
            "bytes": output.stat().st_size,
            "database_sha256": sha256_file(output),
            "release": manifest,
        }
    output.unlink(missing_ok=True)

    if compression == "none":
        download = download_release(url, output, expected_sha256=expected_sha)
        actual_size = output.stat().st_size
        if expected_asset_size and actual_size != expected_asset_size:
            output.unlink(missing_ok=True)
            raise RuntimeError(f"Taille d'asset invalide: {actual_size}, attendu {expected_asset_size}.")
        if not _valid_sqlite(output):
            output.unlink(missing_ok=True)
            raise RuntimeError("L'asset corpus téléchargé n'est pas un SQLite valide.")
        return {
            "mode": "build_cache_downloaded",
            "path": str(output),
            "bytes": output.stat().st_size,
            "asset_sha256": str(download["sha256"]),
            "database_sha256": sha256_file(output),
            "release": manifest,
        }

    asset = output.with_suffix(output.suffix + ".asset.gz")
    asset.unlink(missing_ok=True)
    try:
        download = download_release(url, asset, expected_sha256=expected_sha)
        if expected_asset_size and asset.stat().st_size != expected_asset_size:
            raise RuntimeError(f"Taille d'asset gzip invalide: {asset.stat().st_size}, attendu {expected_asset_size}.")
        _decompress_gzip(asset, output)
        database_size = int(manifest.get("database_size_bytes") or 0)
        database_sha = str(manifest.get("database_sha256") or "").strip().lower()
        if database_size and output.stat().st_size != database_size:
            raise RuntimeError(f"Taille SQLite décompressée invalide: {output.stat().st_size}, attendu {database_size}.")
        actual_database_sha = sha256_file(output).lower()
        if database_sha and actual_database_sha != database_sha:
            raise RuntimeError(f"SHA-256 SQLite invalide: {actual_database_sha}, attendu {database_sha}.")
        return {
            "mode": "build_cache_downloaded_gzip",
            "path": str(output),
            "bytes": output.stat().st_size,
            "asset_bytes": int(download["bytes"]),
            "asset_sha256": str(download["sha256"]),
            "database_sha256": actual_database_sha,
            "release": manifest,
        }
    finally:
        asset.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Cache et décompresse le corpus RAG dans l'artefact de build Render.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    output = args.output if args.output.is_absolute() else ROOT / args.output
    print(json.dumps(cache_release(output), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
