from __future__ import annotations

import json
import os
import sqlite3
import sys
from pathlib import Path

from relevance import install as install_relevance

install_relevance()

import server  # noqa: E402
from openiti import load_manifest  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
TRUTHY = {"1", "true", "yes", "on"}
DB_PATH = Path(os.getenv("ATHAR_DB_PATH") or "/tmp/athar_rag.sqlite")
TAFSIR_MANIFEST = ROOT / "rag" / "openiti_books_tafsir.json"
BOOKS_MANIFEST = ROOT / "rag" / "books.json"


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in TRUTHY


def expected_book_ids() -> tuple[set[str], set[str]]:
    base = load_manifest()
    openiti_ids = {
        str(book["book_id"])
        for book in base.get("books", [])
        if isinstance(book, dict) and book.get("enabled", True) and book.get("book_id")
    }
    if TAFSIR_MANIFEST.exists():
        tafsir = json.loads(TAFSIR_MANIFEST.read_text(encoding="utf-8"))
        openiti_ids.update(
            str(book["book_id"])
            for book in tafsir.get("books", [])
            if isinstance(book, dict) and book.get("enabled", True) and book.get("book_id")
        )
    catalog = json.loads(BOOKS_MANIFEST.read_text(encoding="utf-8"))
    catalog_ids = {
        f"kutub-{int(book['kutub_id'])}"
        for book in catalog.get("books", [])
        if isinstance(book, dict) and book.get("enabled", True) and book.get("kutub_id") is not None
    }
    return openiti_ids, catalog_ids


def verify_complete_database(path: Path) -> dict[str, int]:
    expected_openiti, expected_catalog = expected_book_ids()
    connection = sqlite3.connect(path)
    try:
        actual_openiti = {str(row[0]) for row in connection.execute("SELECT DISTINCT book_id FROM chunks WHERE translation_status='openiti_arabic_source'")}
        actual_books = {str(row[0]) for row in connection.execute("SELECT id FROM books")}
        chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
    finally:
        connection.close()
    missing_openiti = sorted(expected_openiti - actual_openiti)
    missing_catalog = sorted(expected_catalog - actual_books)
    if missing_openiti:
        raise RuntimeError(f"Corpus OpenITI incomplet: {len(actual_openiti)}/{len(expected_openiti)}; manquants={missing_openiti}")
    if missing_catalog:
        raise RuntimeError(f"Catalogue RAG incomplet; manquants={missing_catalog}")
    if chunks <= 0:
        raise RuntimeError("Le corpus complet ne contient aucun passage.")
    return {"configured_openiti_books": len(expected_openiti), "openiti_books": len(actual_openiti), "catalog_books": len(expected_catalog), "database_books": len(actual_books), "chunks": chunks}


def prepare_full_corpus() -> dict[str, object] | None:
    if not env_flag("ATHAR_PREBUILT_CORPUS", False):
        return None
    from install_hosted_corpus import install as install_corpus
    os.environ["ATHAR_CORPUS_READY"] = "0"
    status = install_corpus(DB_PATH, fallback_starter=False)
    release = status.get("release", {}) if isinstance(status, dict) else {}
    complete = verify_complete_database(DB_PATH)
    os.environ["ATHAR_CORPUS_READY"] = "1"
    os.environ["ATHAR_CORPUS_RELEASE_TAG"] = str(release.get("tag") or "")
    os.environ["ATHAR_CORPUS_OPENITI_BOOKS"] = str(complete["openiti_books"])
    os.environ["ATHAR_CORPUS_BOOKS"] = str(complete["database_books"])
    os.environ["ATHAR_CORPUS_CHUNKS"] = str(complete["chunks"])
    print(
        "[Corpus] base complète prête avant ouverture du serveur: "
        f"{complete['database_books']} livre(s), "
        f"{complete['openiti_books']}/{complete['configured_openiti_books']} OpenITI, "
        f"{complete['chunks']} passage(s).",
        flush=True,
    )
    return status


def main() -> int:
    try:
        prepare_full_corpus()
    except Exception as error:
        os.environ["ATHAR_CORPUS_READY"] = "0"
        print(f"[Corpus] activation du corpus complet impossible: {error}", file=sys.stderr, flush=True)
        return 2
    return server.main()


if __name__ == "__main__":
    raise SystemExit(main())
