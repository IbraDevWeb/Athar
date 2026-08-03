from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

import requests

from core import DEFAULT_DB, connect, content_hash, initialize_database, upsert_book, upsert_chunk, utc_now
from ingestion import (
    bootstrap_legacy_state,
    finish_run,
    ingestion_status,
    initialize_ingestion,
    mark_page,
    next_page,
    quality_score,
    start_run,
)
from scrape_kutub import (
    BASE_URL,
    DEFAULT_DELAY,
    KutubClient,
    extract_page_content,
    load_books,
    pair_chunks,
    parse_book_page,
    save_snapshot,
)

PAGE_LINK = re.compile(r"/fr/book/(?P<book>\d+)/(?P<page>\d+)(?:[/?#]|$)")
STOP_ERRORS = ("robots.txt interdit", "Accès refusé", "Protection anti-bot", "Limite de requêtes")


def discover_pages(html: str, kutub_id: int, declared_pages: int | None = None) -> list[int]:
    pages = {
        int(match.group("page"))
        for match in PAGE_LINK.finditer(html)
        if int(match.group("book")) == kutub_id and int(match.group("page")) > 0
    }
    if declared_pages and declared_pages > 0:
        pages.update(range(1, declared_pages + 1))
    return sorted(pages)


def page_digest(pairs: list[tuple[str, str]]) -> str:
    return content_hash(*[f"{arabic}\n{french}" for arabic, french in pairs])


def is_page_duplicate(connection: Any, book_id: str, page: int, digest: str) -> bool:
    if not digest:
        return False
    row = connection.execute(
        """
        SELECT page FROM ingestion_pages
        WHERE book_id=? AND content_hash=? AND page<>? AND status='imported'
        LIMIT 1
        """,
        (book_id, digest, page),
    ).fetchone()
    return bool(row)


def chunk_exists_by_hash(connection: Any, book_id: str, digest: str, chunk_id: str) -> bool:
    row = connection.execute(
        "SELECT id FROM chunks WHERE book_id=? AND content_hash=? AND id<>? LIMIT 1",
        (book_id, digest, chunk_id),
    ).fetchone()
    return bool(row)


def ingest_page(
    *,
    client: KutubClient,
    connection: Any,
    run_id: int,
    book: dict[str, Any],
    page: int,
    snapshots: bool,
) -> dict[str, int | str]:
    kutub_id = int(book["kutub_id"])
    book_id = str(book["id"])
    page_url = f"{BASE_URL}/fr/book/{kutub_id}/{page}"
    try:
        response = client.get(page_url)
    except Exception as error:
        message = str(error)
        state = "blocked" if any(marker in message for marker in STOP_ERRORS) else "error"
        mark_page(
            connection,
            book_id=book_id,
            page=page,
            run_id=run_id,
            status=state,
            source_url=page_url,
            error=message,
        )
        if state == "blocked":
            raise
        return {"status": state, "chunks": 0}

    if snapshots:
        save_snapshot(kutub_id, page, response.text)

    chapter, arabic, french, structure = extract_page_content(response.text)
    pairs = pair_chunks(arabic, french)
    arabic_chars = sum(len(text) for text in arabic)
    french_chars = sum(len(text) for text in french)
    digest = page_digest(pairs)

    if not pairs:
        mark_page(
            connection,
            book_id=book_id,
            page=page,
            run_id=run_id,
            status="empty",
            quality=quality_score(arabic_chars, french_chars, 0, bool(chapter)),
            arabic_chars=arabic_chars,
            french_chars=french_chars,
            digest=digest,
            source_url=page_url,
            metadata={"headings": structure.get("headings", []), "chapter": chapter},
        )
        return {"status": "empty", "chunks": 0}

    if is_page_duplicate(connection, book_id, page, digest):
        mark_page(
            connection,
            book_id=book_id,
            page=page,
            run_id=run_id,
            status="duplicate",
            arabic_chars=arabic_chars,
            french_chars=french_chars,
            digest=digest,
            source_url=page_url,
            metadata={"reason": "page_hash_already_indexed"},
        )
        return {"status": "duplicate", "chunks": 0}

    imported = 0
    duplicates = 0
    for index, (text_ar, text_fr) in enumerate(pairs, start=1):
        chunk_id = f"kutub-{kutub_id}-{page}-{index}"
        chunk_digest = content_hash(text_ar, text_fr)
        if chunk_exists_by_hash(connection, book_id, chunk_digest, chunk_id):
            duplicates += 1
            continue
        upsert_chunk(
            connection,
            {
                "id": chunk_id,
                "book_id": book_id,
                "page": page,
                "chapter": chapter,
                "text_ar": text_ar,
                "text_fr": text_fr,
                "translation_status": "kutub_ai_unreviewed" if text_fr else "arabic_original",
                "source_url": page_url,
                "content_hash": chunk_digest,
                "scraped_at": utc_now(),
                "metadata": {
                    "kutub_id": kutub_id,
                    "chunk_index": index,
                    "volume": structure.get("volume"),
                    "printed_page": structure.get("printed_page"),
                    "page_end": page,
                    "headings": structure.get("headings", []),
                    "chapter_detected": structure.get("chapter_detected", False),
                    "verification_status": "imported_unreviewed",
                    "arabic_present": bool(text_ar),
                    "french_present": bool(text_fr),
                    "source_type": book.get("metadata", {}).get("source_type", "classical_reference"),
                    "ingestion_pipeline": "kutub-v3",
                },
            },
        )
        imported += 1
    connection.commit()

    state = "imported" if imported else "duplicate"
    quality = quality_score(arabic_chars, french_chars, imported, bool(chapter))
    mark_page(
        connection,
        book_id=book_id,
        page=page,
        run_id=run_id,
        status=state,
        chunk_count=imported,
        quality=quality,
        arabic_chars=arabic_chars,
        french_chars=french_chars,
        digest=digest,
        source_url=page_url,
        metadata={
            "chapter": chapter,
            "headings": structure.get("headings", []),
            "volume": structure.get("volume"),
            "printed_page": structure.get("printed_page"),
            "duplicate_chunks": duplicates,
        },
    )
    return {"status": state, "chunks": imported}


def ingest_book(
    *,
    client: KutubClient,
    connection: Any,
    run_id: int,
    configured_book: dict[str, Any],
    batch_size: int,
    retry_errors: bool,
    snapshots: bool,
) -> dict[str, int]:
    kutub_id = int(configured_book["kutub_id"])
    source_url = configured_book.get("source_url") or f"{BASE_URL}/fr/book/{kutub_id}"
    response = client.get(source_url)
    if snapshots:
        save_snapshot(kutub_id, "book", response.text)

    metadata = parse_book_page(
        response.text,
        {**configured_book, "id": f"kutub-{kutub_id}", "source_url": source_url},
    )
    metadata["metadata"] = {
        **(configured_book.get("metadata") or {}),
        **(metadata.get("metadata") or {}),
        "ingestion_pipeline": "kutub-v3",
    }
    upsert_book(connection, metadata)
    connection.commit()

    book_id = str(metadata["id"])
    start = next_page(connection, book_id, retry_errors=retry_errors)
    declared_pages = int(metadata.get("pages") or configured_book.get("pages") or 0)
    discovered = discover_pages(response.text, kutub_id, declared_pages or None)
    available = [page for page in discovered if page >= start]
    if not available:
        available = list(range(start, start + batch_size))
    pages = available[:batch_size]

    counters = {
        "attempted_pages": 0,
        "imported_pages": 0,
        "imported_chunks": 0,
        "duplicate_pages": 0,
        "empty_pages": 0,
        "failed_pages": 0,
        "blocked_pages": 0,
    }
    print(f"\n[{metadata['title']}] pages prévues : {pages[0] if pages else '-'} à {pages[-1] if pages else '-'}")

    for page in pages:
        counters["attempted_pages"] += 1
        try:
            result = ingest_page(
                client=client,
                connection=connection,
                run_id=run_id,
                book=metadata,
                page=page,
                snapshots=snapshots,
            )
        except Exception:
            counters["blocked_pages"] += 1
            raise
        state = str(result["status"])
        if state == "imported":
            counters["imported_pages"] += 1
            counters["imported_chunks"] += int(result["chunks"])
        elif state == "duplicate":
            counters["duplicate_pages"] += 1
        elif state == "empty":
            counters["empty_pages"] += 1
        elif state == "error":
            counters["failed_pages"] += 1
        print(f"  page {page}: {state} ({result['chunks']} passage(s))")
    return counters


def merge_counters(target: dict[str, int], source: dict[str, int]) -> None:
    for key, value in source.items():
        target[key] = int(target.get(key, 0)) + int(value)


def run_sync(args: argparse.Namespace) -> int:
    books = load_books()
    if args.book:
        wanted = set(args.book)
        books = [book for book in books if int(book["kutub_id"]) in wanted]
    if not books:
        print("Aucun ouvrage activé ou sélectionné.", file=sys.stderr)
        return 2

    contact = os.getenv("ATHAR_BOT_CONTACT", "operator-contact-not-configured")
    user_agent = f"AtharResearchBot/3.0 (+{contact}; public pages; respectful rate limit)"
    client = KutubClient(args.delay, user_agent)
    connection = connect(args.db)
    initialize_database(connection)
    initialize_ingestion(connection)
    bootstrap_legacy_state(connection)

    counters = {
        "attempted_pages": 0,
        "imported_pages": 0,
        "imported_chunks": 0,
        "duplicate_pages": 0,
        "empty_pages": 0,
        "failed_pages": 0,
        "blocked_pages": 0,
    }
    run_id = start_run(
        connection,
        "kutub_public_pages",
        len(books),
        {"batch_size": args.batch_size, "delay": args.delay, "books": [book["kutub_id"] for book in books]},
    )
    final_status = "completed"
    message = ""
    try:
        for book in books:
            try:
                book_counters = ingest_book(
                    client=client,
                    connection=connection,
                    run_id=run_id,
                    configured_book=book,
                    batch_size=args.batch_size,
                    retry_errors=args.retry_errors,
                    snapshots=args.snapshots,
                )
                merge_counters(counters, book_counters)
            except Exception as error:
                message = str(error)
                if any(marker in message for marker in STOP_ERRORS):
                    final_status = "blocked"
                    break
                final_status = "partial"
                counters["failed_pages"] += 1
                print(f"[erreur] {book.get('title')}: {error}", file=sys.stderr)
    except KeyboardInterrupt:
        final_status = "partial"
        message = "Synchronisation interrompue par l’utilisateur."
    finally:
        if final_status == "completed" and counters["failed_pages"]:
            final_status = "partial"
        finish_run(connection, run_id, status=final_status, message=message, counters=counters)
        summary = ingestion_status(connection)
        connection.close()

    print(
        "\nSynchronisation terminée : "
        f"{counters['imported_pages']} page(s) importée(s), "
        f"{counters['imported_chunks']} passage(s), "
        f"{counters['duplicate_pages']} doublon(s), "
        f"{counters['empty_pages']} page(s) vide(s), "
        f"{counters['failed_pages']} erreur(s)."
    )
    if args.json:
        print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if final_status in {"completed", "partial"} else 1


def print_status(db: Path, as_json: bool) -> int:
    connection = connect(db)
    initialize_database(connection)
    payload = ingestion_status(connection)
    connection.close()
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    print(
        f"Pages suivies : {payload['tracked_pages']} · importées : {payload['imported_pages']} · "
        f"doublons : {payload['duplicate_pages']} · erreurs : {payload['error_pages']} · "
        f"qualité moyenne : {payload['average_quality']} %"
    )
    for book in payload["books"]:
        print(
            f"- {book['title']}: {book['imported_pages']}/{book.get('pages') or '?'} pages "
            f"({book['progress']} %), prochaine page {book['next_page']}, qualité {book.get('quality') or 0} %"
        )
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Pipeline durable d’ingestion des pages publiques Kutub.")
    subparsers = parser.add_subparsers(dest="command")

    sync = subparsers.add_parser("sync", help="Importe le prochain lot de pages.")
    sync.add_argument("--book", action="append", type=int, help="Identifiant Kutub. Répétable.")
    sync.add_argument("--batch-size", type=int, default=25)
    sync.add_argument("--delay", type=float, default=DEFAULT_DELAY)
    sync.add_argument("--db", type=Path, default=DEFAULT_DB)
    sync.add_argument("--snapshots", action="store_true")
    sync.add_argument("--no-retry-errors", dest="retry_errors", action="store_false")
    sync.add_argument("--json", action="store_true")
    sync.set_defaults(retry_errors=True)

    status = subparsers.add_parser("status", help="Affiche l’état des imports.")
    status.add_argument("--db", type=Path, default=DEFAULT_DB)
    status.add_argument("--json", action="store_true")

    args = parser.parse_args()
    if args.command in {None, "sync"}:
        if args.command is None:
            args.command = "sync"
            args.book = None
            args.batch_size = 25
            args.delay = DEFAULT_DELAY
            args.db = DEFAULT_DB
            args.snapshots = False
            args.retry_errors = True
            args.json = False
        args.batch_size = max(1, min(int(args.batch_size), 100))
        return run_sync(args)
    if args.command == "status":
        return print_status(args.db, args.json)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
