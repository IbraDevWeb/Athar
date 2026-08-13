from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
sys.path.insert(0, str(RAG_DIR))

from core import DEFAULT_DB, ensure_database, import_seed, upsert_book  # noqa: E402

BOOKS_PATH = RAG_DIR / "books.json"
STARTER_CORPUS = RAG_DIR / "starter_corpus.json"
KUTUB_CORPUS = RAG_DIR / "kutub_corpus.json"


def load_catalog(path: Path = BOOKS_PATH) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    books = payload.get("books", [])
    if not isinstance(books, list):
        raise RuntimeError("rag/books.json doit contenir une liste books.")
    return [book for book in books if isinstance(book, dict) and book.get("enabled", True)]


def import_catalog(connection: Any, path: Path = BOOKS_PATH) -> int:
    imported = 0
    for configured in load_catalog(path):
        kutub_id = int(configured["kutub_id"])
        source_url = str(configured.get("source_url") or f"https://kutub.io/fr/book/{kutub_id}")
        metadata = configured.get("metadata") if isinstance(configured.get("metadata"), dict) else {}
        upsert_book(
            connection,
            {
                **configured,
                "id": f"kutub-{kutub_id}",
                "source_url": source_url,
                "metadata": {
                    **metadata,
                    "catalogue": "rag/books.json",
                    "catalogue_enabled": True,
                },
            },
        )
        imported += 1
    connection.commit()
    return imported


def prepare_database(db_path: Path) -> dict[str, int]:
    connection = ensure_database(db_path)
    try:
        catalog_books = import_catalog(connection)
        bundled_corpora = 0
        for corpus_path in (STARTER_CORPUS, KUTUB_CORPUS):
            if corpus_path.exists():
                import_seed(connection, corpus_path)
                bundled_corpora += 1
        books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
        chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
        return {
            "catalog_books": catalog_books,
            "bundled_corpora": bundled_corpora,
            "books": books,
            "chunks": chunks,
        }
    finally:
        connection.close()


def main() -> int:
    default_db = Path(os.getenv("ATHAR_DB_PATH") or DEFAULT_DB)
    parser = argparse.ArgumentParser(description="Prépare la base Athar avec le catalogue et les corpus Kutub versionnés.")
    parser.add_argument("--db", type=Path, default=default_db)
    args = parser.parse_args()
    status = prepare_database(args.db)
    print(
        "Base Athar préparée : "
        f"{status['catalog_books']} ouvrage(s) du catalogue, "
        f"{status['books']} ouvrage(s) en base, {status['chunks']} passage(s)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
