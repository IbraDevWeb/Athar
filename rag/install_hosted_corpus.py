from __future__ import annotations

import json
import os
import shutil
import sys
import zlib
from pathlib import Path

from fetch_hosted_corpus import download_release, load_manifest, sha256_file, validate_database

ROOT = Path(__file__).resolve().parents[1]
SQLITE_HEADER = b"SQLite format 3\x00"
GZIP_HEADER = b"\x1f\x8b"
TRUTHY = {"1", "true", "yes", "on"}


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in TRUTHY


def archive_from_env() -> Path | None:
    raw = str(os.getenv("ATHAR_CORPUS_ARCHIVE") or "").strip()
    if not raw:
        return None
    path = Path(raw)
    return path if path.is_absolute() else ROOT / path


def state_path(destination: Path) -> Path:
    return destination.with_suffix(destination.suffix + ".release.json")


def release_state(manifest: dict[str, object]) -> dict[str, object]:
    return {
        "tag": str(manifest.get("tag") or ""),
        "sha256": str(manifest.get("sha256") or ""),
        "min_openiti_books": int(manifest.get("min_openiti_books") or 0),
        "source_sha": str(manifest.get("source_sha") or ""),
    }


def write_state(destination: Path, manifest: dict[str, object]) -> None:
    state_path(destination).write_text(
        json.dumps(release_state(manifest), ensure_ascii=False),
        encoding="utf-8",
    )


def reusable_database(destination: Path, manifest: dict[str, object]) -> dict[str, int] | None:
    marker = state_path(destination)
    if not destination.exists() or not marker.exists():
        return None
    try:
        cached = json.loads(marker.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if cached != release_state(manifest):
        return None
    try:
        return validate_database(
            destination,
            min_openiti_books=int(manifest.get("min_openiti_books") or 0),
        )
    except Exception:
        return None


def asset_format(path: Path) -> str:
    with path.open("rb") as handle:
        prefix = handle.read(len(SQLITE_HEADER))
    if prefix.startswith(SQLITE_HEADER):
        return "sqlite"
    if prefix.startswith(GZIP_HEADER):
        return "gzip"
    raise RuntimeError("L'asset corpus n'est ni une base SQLite ni une archive gzip reconnue.")


def validate_asset(path: Path, manifest: dict[str, object]) -> dict[str, object]:
    if not path.exists() or not path.is_file():
        raise RuntimeError(f"Asset corpus absent: {path}")
    expected_size = int(manifest.get("size_bytes") or 0)
    actual_size = path.stat().st_size
    if expected_size and actual_size != expected_size:
        raise RuntimeError(f"Taille d'asset invalide: {actual_size}, attendu {expected_size}.")
    expected_sha = str(manifest.get("sha256") or "").strip().lower()
    actual_sha = sha256_file(path).lower()
    if expected_sha and actual_sha != expected_sha:
        raise RuntimeError(f"SHA-256 invalide: {actual_sha}, attendu {expected_sha}.")
    return {"bytes": actual_size, "sha256": actual_sha, "format": asset_format(path)}


def activate_sqlite(source: Path, destination: Path) -> dict[str, object]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    part = destination.with_suffix(destination.suffix + ".part")
    part.unlink(missing_ok=True)
    try:
        try:
            os.link(source, part)
            transfer = "hardlink"
        except OSError:
            shutil.copyfile(source, part)
            transfer = "copy"
        os.replace(part, destination)
        return {
            "source": "local_asset",
            "format": "sqlite",
            "transfer": transfer,
            "database_bytes": destination.stat().st_size,
        }
    except Exception:
        part.unlink(missing_ok=True)
        raise


def inflate_gzip(source: Path, destination: Path) -> dict[str, object]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    part = destination.with_suffix(destination.suffix + ".part")
    part.unlink(missing_ok=True)
    inflater = zlib.decompressobj(16 + zlib.MAX_WBITS)
    compressed_bytes = 0
    database_bytes = 0
    try:
        with source.open("rb") as raw, part.open("wb") as target:
            for block in iter(lambda: raw.read(1024 * 1024), b""):
                compressed_bytes += len(block)
                payload = inflater.decompress(block)
                if payload:
                    target.write(payload)
                    database_bytes += len(payload)
            tail = inflater.flush()
            if tail:
                target.write(tail)
                database_bytes += len(tail)
        if not inflater.eof:
            raise RuntimeError("Archive gzip corpus tronquée ou incomplète.")
        os.replace(part, destination)
        return {
            "source": "local_asset",
            "format": "gzip",
            "compressed_bytes": compressed_bytes,
            "database_bytes": database_bytes,
        }
    except Exception:
        part.unlink(missing_ok=True)
        raise


def activate_asset(source: Path, destination: Path, manifest: dict[str, object]) -> dict[str, object]:
    fingerprint = validate_asset(source, manifest)
    if fingerprint["format"] == "sqlite":
        activation = activate_sqlite(source, destination)
    else:
        activation = inflate_gzip(source, destination)
    activation["asset"] = fingerprint
    return activation


def install(destination: Path, *, fallback_starter: bool = False) -> dict[str, object]:
    del fallback_starter  # Hosted production never silently falls back to a starter corpus.
    manifest = load_manifest()
    minimum = int(manifest.get("min_openiti_books") or 0)

    existing = reusable_database(destination, manifest)
    if existing is not None:
        return {
            "mode": "prebuilt_release_reused",
            "release": manifest,
            "validated": existing,
            "database_bytes": destination.stat().st_size,
        }

    local_asset = archive_from_env()
    downloaded_asset: Path | None = None
    source = local_asset
    if source is None or not source.exists():
        downloaded_asset = destination.with_suffix(destination.suffix + ".asset")
        downloaded_asset.unlink(missing_ok=True)
        url = str(manifest.get("url") or "").strip()
        if not url:
            raise RuntimeError("Le manifeste corpus ne fournit aucune URL de Release.")
        print("[Corpus] asset de build absent; téléchargement de secours depuis la Release…", flush=True)
        download_release(
            url,
            downloaded_asset,
            expected_sha256=str(manifest.get("sha256") or "").strip(),
        )
        source = downloaded_asset

    assert source is not None
    try:
        print(f"[Corpus] activation de l'asset validé: {source}", flush=True)
        activation = activate_asset(source, destination, manifest)
        validated = validate_database(destination, min_openiti_books=minimum)
        write_state(destination, manifest)
        result = {
            "mode": "prebuilt_release",
            "release": manifest,
            "activation": activation,
            "validated": validated,
            "database_bytes": destination.stat().st_size,
        }
        if downloaded_asset is not None or env_flag("ATHAR_DELETE_CORPUS_ARCHIVE_AFTER_INSTALL", False):
            try:
                source.unlink(missing_ok=True)
            except OSError as error:
                print(f"[Corpus] nettoyage de l'asset impossible: {error}", file=sys.stderr, flush=True)
        return result
    except Exception:
        state_path(destination).unlink(missing_ok=True)
        destination.with_suffix(destination.suffix + ".part").unlink(missing_ok=True)
        if downloaded_asset is not None:
            downloaded_asset.unlink(missing_ok=True)
        raise
