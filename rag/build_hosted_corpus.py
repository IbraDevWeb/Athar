from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

from ingest_openiti import sync
from prepare_hosted_db import prepare_database


def reset_database(path: Path) -> None:
    for candidate in (path, Path(f"{path}-wal"), Path(f"{path}-shm")):
        if candidate.exists():
            candidate.unlink()
    path.parent.mkdir(parents=True, exist_ok=True)


def finalize_database(path: Path) -> dict[str, int]:
    connection = sqlite3.connect(path)
    try:
        connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        connection.execute("PRAGMA journal_mode=DELETE")
        connection.execute("VACUUM")
        books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
        chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
        openiti_books = int(connection.execute("SELECT COUNT(DISTINCT book_id) FROM chunks WHERE translation_status='openiti_arabic_source'").fetchone()[0])
        openiti_chunks = int(connection.execute("SELECT COUNT(*) FROM chunks WHERE translation_status='openiti_arabic_source'").fetchone()[0])
        return {"books": books, "chunks": chunks, "openiti_books": openiti_books, "openiti_chunks": openiti_chunks}
    finally:
        connection.close()


def build(db_path: Path, max_books: int, min_books: int | None = None) -> dict[str, object]:
    minimum = max_books if min_books is None else max(1, min(int(min_books), max_books))
    reset_database(db_path)
    prepared = prepare_database(db_path)
    imported = sync(db_path, max_books=max_books, best_effort=True)
    finalized = finalize_database(db_path)
    if imported["requested_books"] != max_books:
        raise RuntimeError(f"OpenITI manifest incomplete: {imported['requested_books']}/{max_books}")
    if int(imported["imported_books"]) < minimum:
        raise RuntimeError(f"OpenITI import below minimum: {imported['imported_books']}/{max_books}, minimum {minimum}; errors={imported.get('errors', [])}")
    if finalized["openiti_books"] < minimum:
        raise RuntimeError(f"SQLite OpenITI corpus below minimum: {finalized['openiti_books']}, minimum {minimum}")
    if finalized["openiti_chunks"] <= max(1, finalized["openiti_books"]):
        raise RuntimeError("OpenITI corpus has too few chunks")
    status = {"requested_openiti_books": max_books, "minimum_openiti_books": minimum, "prepared": prepared, "imported": imported, "finalized": finalized, "database_bytes": db_path.stat().st_size}
    db_path.with_suffix(".stats.json").write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8")
    return status


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the validated Athar corpus for Render")
    parser.add_argument("--db", type=Path, default=Path("rag/data/athar_hosted.sqlite"))
    parser.add_argument("--max-books", type=int, default=30)
    parser.add_argument("--min-books", type=int, default=None)
    args = parser.parse_args()
    print(json.dumps(build(args.db, args.max_books, args.min_books), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
