from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

from core import connect, initialize_database
from openiti import fetch_text, ingest_book, load_manifest, urls

ROOT = Path(__file__).resolve().parents[1]
TAFSIR_MANIFEST = ROOT / "rag" / "openiti_books_tafsir.json"


def sync(db_path: Path) -> dict[str, int]:
    source = load_manifest()
    extra = json.loads(TAFSIR_MANIFEST.read_text(encoding="utf-8"))
    books = [item for item in extra.get("books", []) if isinstance(item, dict) and item.get("enabled", True)]
    connection = connect(db_path)
    initialize_database(connection)
    chunks = 0
    try:
        for book in books:
            raw_url, _ = urls(source, book)
            stats = ingest_book(connection, source, book, fetch_text(raw_url))
            chunks += int(stats["chunks"])
    finally:
        connection.close()

    final = sqlite3.connect(db_path)
    try:
        final.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        final.execute("PRAGMA journal_mode=DELETE")
        final.execute("VACUUM")
    finally:
        final.close()
    return {"books": len(books), "chunks": chunks}


def main() -> int:
    parser = argparse.ArgumentParser(description="Ajoute le lot de tafsir OpenITI au corpus Athar.")
    parser.add_argument("--db", type=Path, default=Path("rag/data/athar_hosted.sqlite"))
    args = parser.parse_args()
    print(json.dumps(sync(args.db), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
