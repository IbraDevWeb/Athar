from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

from core import connect, initialize_database
from ingest_openiti import fetch_with_retry
from openiti import ingest_book, load_manifest, urls

ROOT = Path(__file__).resolve().parents[1]
TAFSIR_MANIFEST = ROOT / "rag" / "openiti_books_tafsir.json"


def sync(db_path: Path, min_books: int | None = None) -> dict[str, object]:
    source = load_manifest()
    extra = json.loads(TAFSIR_MANIFEST.read_text(encoding="utf-8"))
    books = [item for item in extra.get("books", []) if isinstance(item, dict) and item.get("enabled", True)]
    minimum = len(books) if min_books is None else max(1, min(int(min_books), len(books)))
    connection = connect(db_path)
    initialize_database(connection)
    chunks = 0
    imported = 0
    errors: list[str] = []
    try:
        for book in books:
            raw_url, _ = urls(source, book)
            try:
                stats = ingest_book(connection, source, book, fetch_with_retry(raw_url))
                chunks += int(stats["chunks"])
                imported += 1
            except Exception as error:
                message = f"{book.get('title', book.get('openiti_uri'))}: {error}"
                errors.append(message)
                print(f"[OpenITI tafsir] {message}", flush=True)
    finally:
        connection.close()

    final = sqlite3.connect(db_path)
    try:
        final.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        final.execute("PRAGMA journal_mode=DELETE")
        final.execute("VACUUM")
    finally:
        final.close()

    if imported < minimum:
        raise RuntimeError(f"Tafsir import below minimum: {imported}/{len(books)}, minimum {minimum}; errors={errors}")
    return {"requested_books": len(books), "books": imported, "minimum_books": minimum, "chunks": chunks, "errors": errors}


def main() -> int:
    parser = argparse.ArgumentParser(description="Add the OpenITI tafsir batch to the Athar corpus")
    parser.add_argument("--db", type=Path, default=Path("rag/data/athar_hosted.sqlite"))
    parser.add_argument("--min-books", type=int, default=None)
    args = parser.parse_args()
    print(json.dumps(sync(args.db, args.min_books), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
