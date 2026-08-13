from __future__ import annotations

import gzip
import os
import shutil
import sys
from pathlib import Path
from typing import Any

from fetch_hosted_corpus import (
    build_fallback,
    download_release,
    install as install_uncompressed,
    load_manifest,
    validate_database,
)


def install(destination: Path, *, fallback_starter: bool = False) -> dict[str, object]:
    manifest = load_manifest()
    if str(manifest.get("compression") or "").lower() != "gzip":
        return install_uncompressed(destination, fallback_starter=fallback_starter)

    url = str(manifest.get("url") or "")
    expected_sha = str(manifest.get("sha256") or "").strip()
    min_openiti_books = int(manifest.get("min_openiti_books") or 0)
    archive = destination.with_suffix(destination.suffix + ".gz")
    inflated = destination.with_suffix(destination.suffix + ".inflate")

    try:
        download = download_release(url, archive, expected_sha256=expected_sha)
        if inflated.exists():
            inflated.unlink()
        with gzip.open(archive, "rb") as source, inflated.open("wb") as target:
            shutil.copyfileobj(source, target, length=1024 * 1024)
        os.replace(inflated, destination)
        archive.unlink(missing_ok=True)
        validated = validate_database(destination, min_openiti_books=min_openiti_books)
        return {
            "mode": "prebuilt_release",
            "release": manifest,
            "download": download,
            "validated": validated,
            "database_bytes": destination.stat().st_size,
        }
    except Exception as error:
        archive.unlink(missing_ok=True)
        inflated.unlink(missing_ok=True)
        if not fallback_starter:
            raise
        print(
            f"[Corpus] archive préconstruite indisponible ({error}). Démarrage avec le corpus de secours.",
            file=sys.stderr,
            flush=True,
        )
        fallback = build_fallback(destination)
        fallback["release_error"] = str(error)
        return fallback
