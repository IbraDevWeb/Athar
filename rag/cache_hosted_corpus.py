from __future__ import annotations

import argparse
import gzip
import json
import os
import shutil
from pathlib import Path
from typing import Any

from fetch_hosted_corpus import download_release, load_manifest, sha256_file

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "rag" / "data" / "athar_hosted.sqlite"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"
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


def _cache_entry(entry: dict[str, Any], output_dir: Path) -> dict[str, object]:
    database = str(entry.get("database") or "").strip()
    url = str(entry.get("url") or "").strip()
    expected_sha = str(entry.get("sha256") or "").strip().lower()
    expected_asset_size = int(entry.get("size_bytes") or 0)
    compression = str(entry.get("compression") or "gzip").strip().lower()
    if not database or Path(database).name != database:
        raise RuntimeError(f"Nom de base de shard invalide: {database!r}")
    if not url or not expected_sha:
        raise RuntimeError(f"Asset sharded incomplet pour {database}: URL/SHA manquant.")
    if compression != "gzip":
        raise RuntimeError(f"Les shards Athar doivent être publiés en gzip: {database}")

    output = output_dir / database
    if _reuse_matches(output, entry):
        return {
            "id": str(entry.get("id") or database),
            "mode": "build_cache_reused",
            "path": str(output),
            "bytes": output.stat().st_size,
            "database_sha256": sha256_file(output),
        }

    output.unlink(missing_ok=True)
    asset = output_dir / f".{database}.asset.gz"
    asset.unlink(missing_ok=True)
    try:
        download = download_release(url, asset, expected_sha256=expected_sha)
        if expected_asset_size and asset.stat().st_size != expected_asset_size:
            raise RuntimeError(
                f"Taille gzip invalide pour {database}: {asset.stat().st_size}, attendu {expected_asset_size}."
            )
        _decompress_gzip(asset, output)
        database_size = int(entry.get("database_size_bytes") or 0)
        database_sha = str(entry.get("database_sha256") or "").strip().lower()
        if database_size and output.stat().st_size != database_size:
            raise RuntimeError(
                f"Taille SQLite invalide pour {database}: {output.stat().st_size}, attendu {database_size}."
            )
        actual_database_sha = sha256_file(output).lower()
        if database_sha and actual_database_sha != database_sha:
            raise RuntimeError(
                f"SHA-256 SQLite invalide pour {database}: {actual_database_sha}, attendu {database_sha}."
            )
        return {
            "id": str(entry.get("id") or database),
            "mode": "build_cache_downloaded_gzip",
            "path": str(output),
            "bytes": output.stat().st_size,
            "asset_bytes": int(download["bytes"]),
            "asset_sha256": str(download["sha256"]),
            "database_sha256": actual_database_sha,
        }
    finally:
        asset.unlink(missing_ok=True)


def cache_sharded_release(output_dir: Path, manifest: dict[str, Any] | None = None) -> dict[str, object]:
    release = manifest or load_manifest()
    if str(release.get("storage_mode") or "").strip().lower() != "sharded":
        raise RuntimeError("Le manifeste demandé n'est pas un corpus sharded.")
    catalog = release.get("catalog")
    shards = release.get("shards")
    if not isinstance(catalog, dict) or not isinstance(shards, list) or not shards:
        raise RuntimeError("Le release sharded doit déclarer un catalogue et au moins un shard.")
    entries = [catalog, *[entry for entry in shards if isinstance(entry, dict)]]
    if len(entries) != len(shards) + 1:
        raise RuntimeError("Une entrée de shard est invalide.")

    output_dir.mkdir(parents=True, exist_ok=True)
    expected_databases = {str(entry.get("database") or "") for entry in entries}
    if "" in expected_databases:
        raise RuntimeError("Un asset sharded n'a pas de nom de base locale.")
    for existing in output_dir.glob("*.sqlite"):
        if existing.name not in expected_databases:
            existing.unlink(missing_ok=True)

    cached = [_cache_entry(entry, output_dir) for entry in entries]
    return {
        "mode": "sharded_build_cache",
        "storage_mode": "sharded",
        "path": str(output_dir),
        "books": int(release.get("books") or 0),
        "chunks": int(release.get("chunks") or 0),
        "openiti_books": int(release.get("openiti_books") or 0),
        "shards": len(shards),
        "files": cached,
        "release": release,
    }


def cache_release(output: Path, manifest: dict[str, Any] | None = None) -> dict[str, object]:
    release = manifest or load_manifest()
    url = str(release.get("url") or "").strip()
    expected_sha = str(release.get("sha256") or "").strip().lower()
    expected_asset_size = int(release.get("size_bytes") or 0)
    compression = str(release.get("compression") or "none").strip().lower()
    if not url or not expected_sha:
        raise RuntimeError("Le manifeste corpus doit fournir une URL et un SHA-256.")
    if compression not in {"none", "gzip"}:
        raise RuntimeError(f"Compression de corpus non prise en charge: {compression}.")

    output.parent.mkdir(parents=True, exist_ok=True)
    if _reuse_matches(output, release):
        return {
            "mode": "build_cache_reused",
            "path": str(output),
            "bytes": output.stat().st_size,
            "database_sha256": sha256_file(output),
            "release": release,
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
            "release": release,
        }

    asset = output.with_suffix(output.suffix + ".asset.gz")
    asset.unlink(missing_ok=True)
    try:
        download = download_release(url, asset, expected_sha256=expected_sha)
        if expected_asset_size and asset.stat().st_size != expected_asset_size:
            raise RuntimeError(f"Taille d'asset gzip invalide: {asset.stat().st_size}, attendu {expected_asset_size}.")
        _decompress_gzip(asset, output)
        database_size = int(release.get("database_size_bytes") or 0)
        database_sha = str(release.get("database_sha256") or "").strip().lower()
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
            "release": release,
        }
    finally:
        asset.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Cache et décompresse le corpus RAG dans l'artefact de build Render.")
    parser.add_argument("--manifest", type=Path, default=None)
    parser.add_argument("--output", type=Path, default=None)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_SHARD_DIR)
    args = parser.parse_args()
    manifest_path = None
    if args.manifest is not None:
        manifest_path = args.manifest if args.manifest.is_absolute() else ROOT / args.manifest
    manifest = load_manifest(manifest_path) if manifest_path is not None else load_manifest()
    if str(manifest.get("storage_mode") or "").strip().lower() == "sharded":
        output_dir = args.output_dir if args.output_dir.is_absolute() else ROOT / args.output_dir
        result = cache_sharded_release(output_dir, manifest)
    else:
        output = args.output or DEFAULT_OUTPUT
        output = output if output.is_absolute() else ROOT / output
        result = cache_release(output, manifest)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
