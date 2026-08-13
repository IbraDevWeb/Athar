from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
if str(RAG_DIR) not in sys.path:
    sys.path.insert(0, str(RAG_DIR))

from core import DEFAULT_DB, connect, initialize_database  # noqa: E402
from openiti import fetch_text, ingest_book, load_manifest, urls  # noqa: E402


def sync(db_path: Path, max_books: int | None = None, best_effort: bool = False) -> dict[str, object]:
    manifest = load_manifest()
    books = [book for book in manifest.get("books", []) if isinstance(book, dict) and book.get("enabled", True)]
    if max_books is not None:
        books = books[: max(0, max_books)]
    connection = connect(db_path)
    initialize_database(connection)
    imported_books = 0
    imported_chunks = 0
    imported_pages = 0
    errors: list[str] = []
    try:
        for book in books:
            raw_url, _ = urls(manifest, book)
            try:
                print(f"[OpenITI] {book['title']} : téléchargement…", flush=True)
                stats = ingest_book(connection, manifest, book, fetch_text(raw_url))
                imported_books += 1
                imported_chunks += stats["chunks"]
                imported_pages += stats["pages"]
                print(f"[OpenITI] {book['title']} : {stats['pages']} page(s), {stats['chunks']} passage(s).", flush=True)
            except Exception as error:
                message = f"{book.get('title', book.get('openiti_uri'))}: {error}"
                errors.append(message)
                print(f"[OpenITI] {message}", file=sys.stderr, flush=True)
                if not best_effort:
                    raise
    finally:
        connection.close()
    return {
        "requested_books": len(books),
        "imported_books": imported_books,
        "imported_pages": imported_pages,
        "imported_chunks": imported_chunks,
        "errors": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Importe les textes OpenITI configurés dans la base RAG Athar.")
    parser.add_argument("--db", type=Path, default=Path(os.getenv("ATHAR_DB_PATH") or DEFAULT_DB))
    parser.add_argument("--max-books", type=int, default=None)
    parser.add_argument("--best-effort", action="store_true")
    args = parser.parse_args()
    result = sync(args.db, max_books=args.max_books, best_effort=args.best_effort)
    print(json.dumps(result, ensure_ascii=False))
    return 0 if args.best_effort or not result["errors"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
