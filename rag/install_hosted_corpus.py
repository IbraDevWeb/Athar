from __future__ import annotations

import hashlib
import json
import os
import sys
import time
import zlib
from pathlib import Path

import requests

from fetch_hosted_corpus import build_fallback, install as install_uncompressed, load_manifest, validate_database

ROOT = Path(__file__).resolve().parents[1]
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


def write_state(destination: Path, manifest: dict[str, object]) -> None:
    payload = {
        "tag": str(manifest.get("tag") or ""),
        "sha256": str(manifest.get("sha256") or ""),
        "min_openiti_books": int(manifest.get("min_openiti_books") or 0),
        "source_sha": str(manifest.get("source_sha") or ""),
    }
    state_path(destination).write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")


def reusable_database(destination: Path, manifest: dict[str, object]) -> dict[str, int] | None:
    marker = state_path(destination)
    if not destination.exists() or not marker.exists():
        return None
    try:
        cached = json.loads(marker.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    expected = {
        "tag": str(manifest.get("tag") or ""),
        "sha256": str(manifest.get("sha256") or ""),
        "min_openiti_books": int(manifest.get("min_openiti_books") or 0),
        "source_sha": str(manifest.get("source_sha") or ""),
    }
    if cached != expected:
        return None
    try:
        return validate_database(destination, min_openiti_books=int(manifest.get("min_openiti_books") or 0))
    except Exception:
        return None


def inflate_gzip_archive(source: Path, destination: Path, *, expected_sha256: str = "") -> dict[str, object]:
    if not source.exists() or not source.is_file():
        raise RuntimeError(f"Archive corpus locale absente: {source}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    part = destination.with_suffix(destination.suffix + ".part")
    part.unlink(missing_ok=True)
    digest = hashlib.sha256()
    compressed_bytes = 0
    sqlite_bytes = 0
    inflater = zlib.decompressobj(16 + zlib.MAX_WBITS)
    try:
        with source.open("rb") as raw, part.open("wb") as target:
            for block in iter(lambda: raw.read(1024 * 1024), b""):
                digest.update(block)
                compressed_bytes += len(block)
                payload = inflater.decompress(block)
                if payload:
                    target.write(payload)
                    sqlite_bytes += len(payload)
            tail = inflater.flush()
            if tail:
                target.write(tail)
                sqlite_bytes += len(tail)
        if not inflater.eof:
            raise RuntimeError("Archive gzip corpus tronquée ou incomplète.")
        actual_sha = digest.hexdigest()
        if expected_sha256 and actual_sha.lower() != expected_sha256.lower():
            raise RuntimeError(f"SHA-256 invalide: {actual_sha}, attendu {expected_sha256}.")
        os.replace(part, destination)
        return {"compressed_bytes": compressed_bytes, "database_bytes": sqlite_bytes, "sha256": actual_sha, "compression": "gzip", "source": "local_build_archive", "archive": str(source)}
    except Exception:
        part.unlink(missing_ok=True)
        raise


def stream_gzip_release(url: str, destination: Path, *, expected_sha256: str = "", attempts: int = 3) -> dict[str, object]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    part = destination.with_suffix(destination.suffix + ".part")
    last_error: Exception | None = None
    for attempt in range(1, max(1, attempts) + 1):
        try:
            part.unlink(missing_ok=True)
            digest = hashlib.sha256()
            compressed_bytes = 0
            sqlite_bytes = 0
            inflater = zlib.decompressobj(16 + zlib.MAX_WBITS)
            print(f"[Corpus] téléchargement+décompression en flux ({attempt}/{attempts})…", flush=True)
            with requests.get(url, stream=True, timeout=(10, 300), headers={"User-Agent": "AtharResearch/1.0"}) as response:
                response.raise_for_status()
                with part.open("wb") as target:
                    for block in response.iter_content(chunk_size=1024 * 1024):
                        if not block:
                            continue
                        digest.update(block)
                        compressed_bytes += len(block)
                        payload = inflater.decompress(block)
                        if payload:
                            target.write(payload)
                            sqlite_bytes += len(payload)
                    tail = inflater.flush()
                    if tail:
                        target.write(tail)
                        sqlite_bytes += len(tail)
            if not inflater.eof:
                raise RuntimeError("Archive gzip corpus distante tronquée ou incomplète.")
            actual_sha = digest.hexdigest()
            if expected_sha256 and actual_sha.lower() != expected_sha256.lower():
                raise RuntimeError(f"SHA-256 invalide: {actual_sha}, attendu {expected_sha256}.")
            os.replace(part, destination)
            return {"compressed_bytes": compressed_bytes, "database_bytes": sqlite_bytes, "sha256": actual_sha, "compression": "gzip", "source": "remote_release", "url": url}
        except Exception as error:
            last_error = error
            part.unlink(missing_ok=True)
            if attempt < attempts:
                delay = 2 ** (attempt - 1)
                print(f"[Corpus] échec: {error}; nouvelle tentative dans {delay}s.", file=sys.stderr, flush=True)
                time.sleep(delay)
    assert last_error is not None
    raise last_error


def install(destination: Path, *, fallback_starter: bool = False) -> dict[str, object]:
    manifest = load_manifest()
    minimum = int(manifest.get("min_openiti_books") or 0)
    existing = reusable_database(destination, manifest)
    if existing is not None:
        return {"mode": "prebuilt_release_reused", "release": manifest, "validated": existing, "database_bytes": destination.stat().st_size}
    if str(manifest.get("compression") or "").lower() != "gzip":
        return install_uncompressed(destination, fallback_starter=fallback_starter)
    expected_sha = str(manifest.get("sha256") or "").strip()
    errors: list[str] = []
    archive = archive_from_env()
    if archive is not None:
        try:
            print(f"[Corpus] activation depuis l'archive de build: {archive}", flush=True)
            download = inflate_gzip_archive(archive, destination, expected_sha256=expected_sha)
            validated = validate_database(destination, min_openiti_books=minimum)
            write_state(destination, manifest)
            if env_flag("ATHAR_DELETE_CORPUS_ARCHIVE_AFTER_INSTALL", False):
                try:
                    archive.unlink(missing_ok=True)
                except OSError:
                    pass
            return {"mode": "prebuilt_release", "release": manifest, "download": download, "validated": validated, "database_bytes": destination.stat().st_size}
        except Exception as error:
            errors.append(f"archive locale: {error}")
            print(f"[Corpus] archive de build inutilisable ({error}); essai de la Release distante.", file=sys.stderr, flush=True)
    try:
        download = stream_gzip_release(str(manifest.get("url") or ""), destination, expected_sha256=expected_sha)
        validated = validate_database(destination, min_openiti_books=minimum)
        write_state(destination, manifest)
        return {"mode": "prebuilt_release", "release": manifest, "download": download, "validated": validated, "database_bytes": destination.stat().st_size}
    except Exception as error:
        errors.append(f"release distante: {error}")
        destination.with_suffix(destination.suffix + ".part").unlink(missing_ok=True)
        state_path(destination).unlink(missing_ok=True)
        if not fallback_starter:
            raise RuntimeError("; ".join(errors)) from error
        print(f"[Corpus] base préconstruite indisponible ({'; '.join(errors)}). Démarrage avec le corpus de secours.", file=sys.stderr, flush=True)
        fallback = build_fallback(destination)
        fallback["release_error"] = "; ".join(errors)
        return fallback
