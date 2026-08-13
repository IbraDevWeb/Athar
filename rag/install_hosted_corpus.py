from __future__ import annotations

import hashlib
import os
import sys
import time
import zlib
from pathlib import Path

import requests

from fetch_hosted_corpus import build_fallback, install as install_uncompressed, load_manifest, validate_database


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
            actual_sha = digest.hexdigest()
            if expected_sha256 and actual_sha.lower() != expected_sha256.lower():
                raise RuntimeError(f"SHA-256 invalide : {actual_sha}, attendu {expected_sha256}.")
            os.replace(part, destination)
            return {"compressed_bytes": compressed_bytes, "database_bytes": sqlite_bytes, "sha256": actual_sha, "compression": "gzip", "url": url}
        except Exception as error:
            last_error = error
            part.unlink(missing_ok=True)
            if attempt < attempts:
                delay = 2 ** (attempt - 1)
                print(f"[Corpus] échec : {error}; nouvelle tentative dans {delay}s.", file=sys.stderr, flush=True)
                time.sleep(delay)
    assert last_error is not None
    raise last_error


def install(destination: Path, *, fallback_starter: bool = False) -> dict[str, object]:
    manifest = load_manifest()
    if str(manifest.get("compression") or "").lower() != "gzip":
        return install_uncompressed(destination, fallback_starter=fallback_starter)
    try:
        download = stream_gzip_release(
            str(manifest.get("url") or ""),
            destination,
            expected_sha256=str(manifest.get("sha256") or "").strip(),
        )
        validated = validate_database(destination, min_openiti_books=int(manifest.get("min_openiti_books") or 0))
        return {"mode": "prebuilt_release", "release": manifest, "download": download, "validated": validated, "database_bytes": destination.stat().st_size}
    except Exception as error:
        destination.with_suffix(destination.suffix + ".part").unlink(missing_ok=True)
        if not fallback_starter:
            raise
        print(f"[Corpus] base préconstruite indisponible ({error}). Démarrage avec le corpus de secours.", file=sys.stderr, flush=True)
        fallback = build_fallback(destination)
        fallback["release_error"] = str(error)
        return fallback
