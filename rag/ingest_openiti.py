from __future__ import annotations

import argparse
import json
import os
import sys
import time
from concurrent.futures import Future, ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
if str(RAG_DIR) not in sys.path:
    sys.path.insert(0, str(RAG_DIR))

from core import DEFAULT_DB, connect, initialize_database  # noqa: E402
from openiti import fetch_text, ingest_book, load_manifest, urls  # noqa: E402

AUTO_MANIFEST = RAG_DIR / "openiti_books_auto.json"
PRIORITY_MANIFEST = RAG_DIR / "openiti_books_priority.json"
CURATION_PATH = RAG_DIR / "corpus_book_curation.json"


def _load_books(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    payload = json.loads(path.read_text(encoding="utf-8"))
    rows = payload.get("books", []) if isinstance(payload, dict) else []
    if not isinstance(rows, list):
        raise RuntimeError(f"{path.name} doit contenir une liste books.")
    return [book for book in rows if isinstance(book, dict)]


def _load_curation() -> dict[str, Any]:
    if not CURATION_PATH.exists():
        return {}
    payload = json.loads(CURATION_PATH.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError("corpus_book_curation.json doit contenir un objet JSON.")
    books = payload.get("books") or {}
    if not isinstance(books, dict):
        raise RuntimeError("corpus_book_curation.json doit contenir un objet books.")
    return books


def _apply_curation(book: dict[str, Any], curation: dict[str, Any]) -> dict[str, Any]:
    book_id = str(book.get("book_id") or "").strip()
    row = curation.get(book_id)
    if not isinstance(row, dict):
        return dict(book)
    curated = dict(book)
    for key in ("title", "title_ar", "author", "discipline", "madhhab"):
        value = row.get(key)
        if value is not None and str(value).strip():
            curated[key] = value
        elif key == "madhhab" and value == "":
            curated[key] = ""
    existing_meta = curated.get("metadata") if isinstance(curated.get("metadata"), dict) else {}
    curated_meta = row.get("metadata") if isinstance(row.get("metadata"), dict) else {}
    curated["metadata"] = {**existing_meta, **curated_meta}
    return curated


def load_industrialized_manifest(*, apply_curation: bool = True) -> dict[str, Any]:
    manifest = load_manifest()
    books = [book for book in manifest.get("books", []) if isinstance(book, dict)]
    auto_books = _load_books(AUTO_MANIFEST)
    priority_books = _load_books(PRIORITY_MANIFEST)
    books.extend(auto_books)
    books.extend(priority_books)

    ids = [str(book.get("book_id") or "") for book in books]
    uris = [str(book.get("openiti_uri") or "") for book in books]
    if not all(ids) or len(ids) != len(set(ids)):
        raise RuntimeError("Identifiants OpenITI industriels manquants ou dupliqués.")
    if not all(uris) or len(uris) != len(set(uris)):
        raise RuntimeError("URI OpenITI industriels manquantes ou dupliquées.")

    curation = _load_curation() if apply_curation else {}
    if apply_curation and curation:
        books = [_apply_curation(book, curation) for book in books]

    manifest["books"] = books
    manifest["industrialized_queue"] = str(AUTO_MANIFEST.relative_to(ROOT)) if AUTO_MANIFEST.exists() else ""
    manifest["priority_queue"] = str(PRIORITY_MANIFEST.relative_to(ROOT)) if PRIORITY_MANIFEST.exists() else ""
    manifest["curation_overlay"] = str(CURATION_PATH.relative_to(ROOT)) if apply_curation and CURATION_PATH.exists() else ""
    manifest["automatic_books"] = len(auto_books)
    manifest["priority_books"] = len(priority_books)
    return manifest


def persist_manifest_metadata(connection: Any, book: dict[str, object]) -> None:
    """Preserve promotion/curation provenance without overwriting source metadata set during ingestion."""
    configured = book.get("metadata")
    if not isinstance(configured, dict) or not configured:
        return
    book_id = str(book.get("book_id") or "").strip()
    if not book_id:
        return
    row = connection.execute("SELECT metadata_json FROM books WHERE id=?", (book_id,)).fetchone()
    if row is None:
        return
    try:
        existing = json.loads(str(row[0] or "{}"))
    except (TypeError, ValueError, json.JSONDecodeError):
        existing = {}
    if not isinstance(existing, dict):
        existing = {}
    merged = {**configured, **existing, "manifest_provenance_preserved": True}
    connection.execute(
        "UPDATE books SET metadata_json=? WHERE id=?",
        (json.dumps(merged, ensure_ascii=False), book_id),
    )
    connection.commit()


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


def apply_source_text_policy(book: dict[str, object], text: str) -> str:
    """Apply explicit, reviewed source boundaries before OpenITI chunking.

    Some otherwise valid digital editions append modern fatwas, introductions or
    other editorial material to a classical work. A manifest may declare an exact
    boundary string with ``source_text_end_before``. Athar then indexes only the
    text before that marker. Missing markers are fatal: silently ingesting the
    contaminated edition would be worse than skipping the book.
    """
    end_before = str(book.get("source_text_end_before") or "").strip()
    if not end_before:
        return text
    index = text.find(end_before)
    if index < 0:
        raise RuntimeError(
            f"source_text_end_before introuvable pour {book.get('book_id') or book.get('openiti_uri')}"
        )
    sliced = text[:index].rstrip()
    if len(sliced) < 1000:
        raise RuntimeError(
            f"source_text_end_before produit un texte anormalement court pour {book.get('book_id') or book.get('openiti_uri')}"
        )
    return sliced + "\n"


def sync_books(
    db_path: Path,
    manifest: dict[str, Any],
    books: list[dict[str, Any]],
    *,
    best_effort: bool = False,
    workers: int | None = None,
) -> dict[str, object]:
    selected = [book for book in books if isinstance(book, dict) and book.get("enabled", True)]
    ids = [str(book.get("book_id") or "").strip() for book in selected]
    if not selected or not all(ids) or len(ids) != len(set(ids)):
        raise RuntimeError("Le sous-ensemble OpenITI à ingérer est vide, invalide ou dupliqué.")

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
        text = fetch_with_retry(raw_url)
        return book, apply_source_text_policy(book, text)

    try:
        with ThreadPoolExecutor(max_workers=worker_count, thread_name_prefix="openiti") as pool:
            futures: dict[Future[tuple[dict[str, object], str]], dict[str, object]] = {
                pool.submit(download, book): book for book in selected
            }
            for future in as_completed(futures):
                book = futures[future]
                try:
                    downloaded_book, text = future.result()
                    stats = ingest_book(connection, manifest, downloaded_book, text)
                    persist_manifest_metadata(connection, downloaded_book)
                    imported_books += 1
                    imported_chunks += stats["chunks"]
                    imported_pages += stats["pages"]
                    print(
                        f"[OpenITI] {downloaded_book['title']} : {stats['pages']} page(s), {stats['chunks']} passage(s).",
                        flush=True,
                    )
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
        "requested_books": len(selected),
        "imported_books": imported_books,
        "imported_pages": imported_pages,
        "imported_chunks": imported_chunks,
        "workers": worker_count,
        "errors": errors,
    }


def sync(
    db_path: Path,
    max_books: int | None = None,
    best_effort: bool = False,
    workers: int | None = None,
) -> dict[str, object]:
    manifest = load_industrialized_manifest()
    books = [book for book in manifest.get("books", []) if isinstance(book, dict) and book.get("enabled", True)]
    total_enabled = len(books)
    if max_books is not None:
        books = books[: max(0, max_books)]
    if not books:
        return {
            "available_books": total_enabled,
            "requested_books": 0,
            "imported_books": 0,
            "imported_pages": 0,
            "imported_chunks": 0,
            "workers": max(1, min(int(workers or os.getenv("ATHAR_OPENITI_WORKERS", "4")), 8)),
            "industrialized_queue": AUTO_MANIFEST.exists(),
            "priority_queue": PRIORITY_MANIFEST.exists(),
            "curation_overlay": CURATION_PATH.exists(),
            "errors": [],
        }
    result = sync_books(
        db_path,
        manifest,
        books,
        best_effort=best_effort,
        workers=workers,
    )
    return {
        "available_books": total_enabled,
        **result,
        "industrialized_queue": AUTO_MANIFEST.exists(),
        "priority_queue": PRIORITY_MANIFEST.exists(),
        "curation_overlay": CURATION_PATH.exists(),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Importe les textes OpenITI configurés, prioritaires et promus dans la base RAG Athar.")
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
