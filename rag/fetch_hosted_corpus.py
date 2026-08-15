from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import os
import shutil
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any

import requests

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
if str(RAG_DIR) not in sys.path:
    sys.path.insert(0, str(RAG_DIR))

from prepare_hosted_db import prepare_database  # noqa: E402

MANIFEST_PATH = RAG_DIR / "corpus_release.json"
DEFAULT_RELEASE_URL = (
    "https://github.com/IbraDevWeb/Athar/releases/download/"
    "rag-corpus-latest/athar_hosted.sqlite"
)
SQLITE_HEADER = b"SQLite format 3\x00"


def load_manifest(path: Path = MANIFEST_PATH) -> dict[str, Any]:
    if not path.exists():
        return {"url": DEFAULT_RELEASE_URL, "sha256": "", "min_openiti_books": 1, "compression": "none"}
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError("rag/corpus_release.json doit contenir un objet JSON.")
    payload.setdefault("url", DEFAULT_RELEASE_URL)
    payload.setdefault("sha256", "")
    payload.setdefault("min_openiti_books", 1)
    payload.setdefault("compression", "none")
    return payload


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def validate_database(path: Path, *, min_openiti_books: int = 0) -> dict[str, int]:
    if not path.exists() or path.stat().st_size < len(SQLITE_HEADER):
        raise RuntimeError("Base SQLite absente ou vide.")
    with path.open("rb") as handle:
        if handle.read(len(SQLITE_HEADER)) != SQLITE_HEADER:
            raise RuntimeError("Le fichier téléchargé n'est pas une base SQLite valide.")

    connection = sqlite3.connect(path)
    try:
        quick_check = connection.execute("PRAGMA quick_check").fetchone()
        if not quick_check or str(quick_check[0]).lower() != "ok":
            raise RuntimeError(f"PRAGMA quick_check a échoué : {quick_check}")
        books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
        chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
        openiti_books = int(
            connection.execute(
                "SELECT COUNT(DISTINCT book_id) FROM chunks "
                "WHERE translation_status='openiti_arabic_source'"
            ).fetchone()[0]
        )
        if min_openiti_books and openiti_books < min_openiti_books:
            raise RuntimeError(
                f"Corpus préconstruit trop petit : {openiti_books} livre(s) OpenITI, "
                f"minimum attendu {min_openiti_books}."
            )
        if chunks <= 0:
            raise RuntimeError("La base préconstruite ne contient aucun passage.")
        return {"books": books, "chunks": chunks, "openiti_books": openiti_books}
    finally:
        connection.close()


def download_release(url: str, destination: Path, expected_sha256: str = "", attempts: int = 3) -> dict[str, object]:
    destination.parent.mkdir(parents=True, exist_ok=True)
    part = destination.with_suffix(destination.suffix + ".part")
    last_error: Exception | None = None

    for attempt in range(1, max(1, attempts) + 1):
        try:
            if part.exists():
                part.unlink()
            print(f"[Corpus] téléchargement de la base préconstruite ({attempt}/{attempts})…", flush=True)
            with requests.get(
                url,
                stream=True,
                timeout=(10, 300),
                headers={"User-Agent": "AtharResearch/2.0"},
            ) as response:
                response.raise_for_status()
                digest = hashlib.sha256()
                size = 0
                with part.open("wb") as handle:
                    for block in response.iter_content(chunk_size=1024 * 1024):
                        if not block:
                            continue
                        handle.write(block)
                        digest.update(block)
                        size += len(block)
            actual_sha = digest.hexdigest()
            if expected_sha256 and actual_sha.lower() != expected_sha256.lower():
                raise RuntimeError(
                    f"SHA-256 invalide : {actual_sha}, attendu {expected_sha256}."
                )
            os.replace(part, destination)
            return {"bytes": size, "sha256": actual_sha, "url": url}
        except Exception as error:
            last_error = error
            if part.exists():
                part.unlink()
            if attempt < attempts:
                delay = 2 ** (attempt - 1)
                print(f"[Corpus] échec : {error}; nouvelle tentative dans {delay}s.", file=sys.stderr, flush=True)
                time.sleep(delay)

    assert last_error is not None
    raise last_error


def materialize_gzip(asset: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    part = destination.with_suffix(destination.suffix + ".part")
    part.unlink(missing_ok=True)
    try:
        with gzip.open(asset, "rb") as source, part.open("wb") as output:
            shutil.copyfileobj(source, output, length=1024 * 1024)
        with part.open("rb") as handle:
            if handle.read(len(SQLITE_HEADER)) != SQLITE_HEADER:
                raise RuntimeError("Le contenu gzip n'est pas une base SQLite valide.")
        os.replace(part, destination)
    finally:
        part.unlink(missing_ok=True)


def validate_release_fingerprint(path: Path, manifest: dict[str, Any]) -> None:
    expected_size = int(manifest.get("database_size_bytes") or 0)
    expected_sha = str(manifest.get("database_sha256") or "").strip().lower()
    if expected_size and path.stat().st_size != expected_size:
        raise RuntimeError(f"Taille SQLite invalide : {path.stat().st_size}, attendu {expected_size}.")
    if expected_sha:
        actual_sha = sha256_file(path).lower()
        if actual_sha != expected_sha:
            raise RuntimeError(f"SHA-256 SQLite invalide : {actual_sha}, attendu {expected_sha}.")


def build_fallback(destination: Path) -> dict[str, object]:
    for candidate in (destination, Path(f"{destination}-wal"), Path(f"{destination}-shm")):
        if candidate.exists():
            candidate.unlink()
    status = prepare_database(destination)
    validated = validate_database(destination, min_openiti_books=0)
    return {"mode": "starter_fallback", "prepared": status, "validated": validated}


def install(destination: Path, *, fallback_starter: bool = False) -> dict[str, object]:
    manifest = load_manifest()
    url = str(manifest.get("url") or DEFAULT_RELEASE_URL)
    expected_sha = str(manifest.get("sha256") or "").strip()
    expected_asset_size = int(manifest.get("size_bytes") or 0)
    min_openiti_books = int(manifest.get("min_openiti_books") or 0)
    compression = str(manifest.get("compression") or "none").strip().lower()
    if compression not in {"none", "gzip"}:
        raise RuntimeError(f"Compression de corpus non prise en charge : {compression}.")

    asset = destination if compression == "none" else destination.with_suffix(destination.suffix + ".asset.gz")
    if compression == "gzip":
        asset.unlink(missing_ok=True)

    try:
        download = download_release(url, asset, expected_sha256=expected_sha)
        if expected_asset_size and int(download["bytes"]) != expected_asset_size:
            raise RuntimeError(f"Taille d'asset invalide : {download['bytes']}, attendu {expected_asset_size}.")
        if compression == "gzip":
            materialize_gzip(asset, destination)
            validate_release_fingerprint(destination, manifest)
        validated = validate_database(destination, min_openiti_books=min_openiti_books)
        return {
            "mode": "prebuilt_release_gzip" if compression == "gzip" else "prebuilt_release",
            "release": manifest,
            "download": download,
            "validated": validated,
            "database_bytes": destination.stat().st_size,
            "database_sha256": sha256_file(destination),
        }
    except Exception as error:
        destination.unlink(missing_ok=True)
        if not fallback_starter:
            raise
        print(
            f"[Corpus] base préconstruite indisponible ({error}). "
            "Démarrage avec le corpus de secours versionné.",
            file=sys.stderr,
            flush=True,
        )
        fallback = build_fallback(destination)
        fallback["release_error"] = str(error)
        return fallback
    finally:
        if compression == "gzip":
            asset.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Télécharge et matérialise la base RAG préconstruite publiée dans les Releases GitHub."
    )
    parser.add_argument("--output", type=Path, default=Path(os.getenv("ATHAR_DB_PATH") or "/tmp/athar_rag.sqlite"))
    parser.add_argument("--fallback-starter", action="store_true")
    args = parser.parse_args()
    result = install(args.output, fallback_starter=args.fallback_starter)
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
