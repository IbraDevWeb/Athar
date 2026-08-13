from __future__ import annotations

import argparse
import json
import os
import sys
import time
from concurrent.futures import Future, ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
if str(RAG_DIR) not in sys.path:
    sys.path.insert(0, str(RAG_DIR))

from core import DEFAULT_DB, connect, initialize_database  # noqa: E402
from openiti import fetch_text, ingest_book, load_manifest, urls  # noqa: E402


def fetch_with_retry(raw_url: str, attempts: int = 3) -> str:
    last_error: Exception | None = None
    for attempt in range(1, max(1, attempts) + 1):
        try:
            return fetch_text(raw_url)
        except Exception as error:
            last_error = error
            if attempt >= attempts:
                break
            delay = 2 ** (attempt - 1)
            print(f"[OpenITI] téléchargement échoué, nouvelle tentative dans {delay}s…", file=sys.stderr, flush=True)
            time.sleep(delay)
    assert last_error is not None
    raise last_error


def sync(
    db_path: Path,
    max_books: int | None = None,
    best_effort: bool = False,
    workers: int | None = None,
) -> dict[str, object]:
    manifest = load_manifest()
    books = [book for book in manifest.get("books", []) if isinstance(book, dict) and book.get("enabled", True)]
    if max_books is not None:
        books = books[: max(0, max_books)]

    worker_count = max(1, min(int(workers or os.getenv("ATHAR_OPENITI_WORKERS", "4")), 8))
    connection = connect(db_path)
    initialize_database(connection)
    connection.execute("PRAGMA synchronous=NORMAL")
    connection.execute("PRAGMA temp_store=MEMORY")
    connection.execute("PRAGMA cache_size=-131072")

    imported_books = 0
    imported_chunks = 0
    imported_pages = 0
    errors: list[str] = []

    def download(book: dict[str, object]) -> tuple[dict[str, object], str]:
        raw_url, _ = urls(manifest, book)
        print(f"[OpenITI] {book['title']} : téléchargement…", flush=True)
        return book, fetch_with_retry(raw_url)

    try:
        with ThreadPoolExecutor(max_workers=worker_count, thread_name_prefix="openiti") as pool:
            futures: dict[Future[tuple[dict[str, object], str]], dict[str, object]] = {
                pool.submit(download, book): book for book in books
            }
            for future in as_completed(futures):
                book = futures[future]
                try:
                    downloaded_book, text = future.result()
                    stats = ingest_book(connection, manifest, downloaded_book, text)
                    imported_books += 1
                    imported_chunks += stats["chunks"]
                    imported_pages += stats["pages"]
                    print(f"[OpenITI] {downloaded_book['title']} : {stats['pages']} page(s), {stats['chunks']} passage(s).", flush=True)
                except Exception as error:
                    message = f"{book.get('title', book.get('openiti_uri'))}: {error}"
                    errors.append(message)
                    print(f"[OpenITI] {message}", file=sys.stderr, flush=True)
                    if not best_effort:
                        for pending in futures:
                            pending.cancel()
                        raise
    finally:
        connection.close()

    return {
        "requested_books": len(books),
        "imported_books": imported_books,
        "imported_pages": imported_pages,
        "imported_chunks": imported_chunks,
        "workers": worker_count,
        "errors": errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Importe les textes OpenITI configurés dans la base RAG Athar.")
    parser.add_argument("--db", type=Path, default=Path(os.getenv("ATHAR_DB_PATH") or DEFAULT_DB))
    parser.add_argument("--max-books", type=int, default=None)
    parser.add_argument("--workers", type=int, default=None)
    parser.add_argument("--best-effort", action="store_true")
    args = parser.parse_args()
    result = sync(args.db, max_books=args.max_books, best_effort=args.best_effort, workers=args.workers)
    print(json.dumps(result, ensure_ascii=False))
    return 0 if args.best_effort or not result["errors"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
