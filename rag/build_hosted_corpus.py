from __future__ import annotations

import argparse
import json
import os
import sqlite3
from pathlib import Path

from ingest_openiti import sync
from prepare_hosted_db import prepare_database

TRUTHY = {"1", "true", "yes", "on"}


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
    available = int(imported.get("available_books") or requested)
    imported_count = int(imported["imported_books"])
    if requested <= 0:
        raise RuntimeError("OpenITI manifest contains no enabled books.")
    if max_books is not None and available < max_books:
        raise RuntimeError(f"OpenITI industrial queue incomplete: {available}/{max_books} available book(s).")
    minimum = requested if min_books is None else max(1, min(int(min_books), requested))
    if imported_count < minimum:
        raise RuntimeError(f"OpenITI import below minimum: {imported_count}/{requested}, minimum {minimum}; errors={imported.get('errors', [])}")
    full_corpus_required = max_books is None and min_books is None
    if full_corpus_required and imported_count != requested:
        raise RuntimeError(f"OpenITI full-corpus build is incomplete: {imported_count}/{requested}; errors={imported.get('errors', [])}")
    if int(finalized["openiti_books"]) < minimum:
        raise RuntimeError(f"SQLite OpenITI corpus below minimum: {finalized['openiti_books']}, minimum {minimum}")
    if full_corpus_required and int(finalized["openiti_books"]) != requested:
        raise RuntimeError(f"SQLite OpenITI corpus does not contain every enabled book: {finalized['openiti_books']}/{requested}")
    if int(finalized["openiti_chunks"]) <= max(1, int(finalized["openiti_books"])):
        raise RuntimeError("OpenITI corpus has too few chunks")
    status = {
        "available_openiti_books": available,
        "requested_openiti_books": requested,
        "minimum_openiti_books": minimum,
        "full_corpus_required": full_corpus_required,
        "prepared": prepared,
        "imported": imported,
        "finalized": finalized,
        "database_bytes": db_path.stat().st_size,
    }
    db_path.with_suffix(".stats.json").write_text(json.dumps(status, ensure_ascii=False, indent=2), encoding="utf-8")
    return status


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the validated Athar corpus for the hosted RAG.")
    parser.add_argument("--db", type=Path, default=Path("rag/data/athar_hosted.sqlite"))
    parser.add_argument("--max-books", type=int, default=None, help="Optional production/development corpus cap.")
    parser.add_argument("--min-books", type=int, default=None, help="Optional partial-build threshold.")
    args = parser.parse_args()

    ci = str(os.getenv("GITHUB_ACTIONS") or "").strip().lower() in TRUTHY
    allow_bounded = str(os.getenv("ATHAR_ALLOW_BOUNDED_CORPUS") or "").strip().lower() in TRUTHY
    if ci and not allow_bounded:
        args.max_books = None
        args.min_books = None
        print("[Corpus] GitHub Actions strict mode: every enabled OpenITI book is mandatory.", flush=True)
    elif ci and allow_bounded:
        print(f"[Corpus] Industrial bounded mode: target={args.max_books}, minimum={args.min_books}.", flush=True)

    print(json.dumps(build(args.db, args.max_books, args.min_books), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
