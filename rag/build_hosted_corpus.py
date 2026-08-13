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


def build(db_path: Path, max_books: int | None = None, min_books: int | None = None) -> dict[str, object]:
    reset_database(db_path)
    prepared = prepare_database(db_path)
    imported = sync(db_path, max_books=max_books, best_effort=True)
    finalized = finalize_database(db_path)
    requested = int(imported["requested_books"])
    imported_count = int(imported["imported_books"])
    if requested <= 0:
        raise RuntimeError("OpenITI manifest contains no enabled books.")
    if max_books is not None and requested < max_books:
        raise RuntimeError(f"OpenITI manifest incomplete: {requested}/{max_books} requested book(s).")
    minimum = requested if min_books is None else max(1, min(int(min_books), requested))
    if imported_count < minimum:
        raise RuntimeError(f"OpenITI import below minimum: {imported_count}/{requested}, minimum {minimum}; errors={imported.get('errors', [])}")
    if min_books is None and imported_count != requested:
        raise RuntimeError(f"OpenITI full-corpus build is incomplete: {imported_count}/{requested}; errors={imported.get('errors', [])}")
    if int(finalized["openiti_books"]) < minimum:
        raise RuntimeError(f"SQLite OpenITI corpus below minimum: {finalized['openiti_books']}, minimum {minimum}")
    if min_books is None and int(finalized["openiti_books"]) != requested:
        raise RuntimeError(f"SQLite OpenITI corpus does not contain every enabled book: {finalized['openiti_books']}/{requested}")
    if int(finalized["openiti_chunks"]) <= max(1, int(finalized["openiti_books"])):
        raise RuntimeError("OpenITI corpus has too few chunks")
    status = {"requested_openiti_books": requested, "minimum_openiti_books": minimum, "full_corpus_required": min_books is None, "prepared": prepared, "imported": imported, "finalized": finalized, "database_bytes": db_path.stat().st_size}
    db_path.with_suffix(".stats.json").write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8")
    return status


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the validated Athar corpus for the hosted RAG.")
    parser.add_argument("--db", type=Path, default=Path("rag/data/athar_hosted.sqlite"))
    parser.add_argument("--max-books", type=int, default=None, help="Optional development limit. Omit it to import every enabled OpenITI book.")
    parser.add_argument("--min-books", type=int, default=None, help="Optional partial-build threshold. Omit it to require every requested book.")
    args = parser.parse_args()
    print(json.dumps(build(args.db, args.max_books, args.min_books), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
