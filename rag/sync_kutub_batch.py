from __future__ import annotations

import argparse
import os
from pathlib import Path

from core import DEFAULT_DB, connect, initialize_database
from scrape_kutub import DEFAULT_DELAY, KutubClient, crawl_book, load_books


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Ajoute le prochain lot de pages publiques Kutub à la base RAG locale."
    )
    parser.add_argument("--batch-size", type=int, default=25, help="Nouvelles pages maximum par ouvrage.")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--book", action="append", type=int, help="Identifiant Kutub à limiter. Répétable.")
    parser.add_argument("--snapshots", action="store_true")
    args = parser.parse_args()

    batch_size = max(1, min(args.batch_size, 100))
    books = load_books()
    if args.book:
        selected = set(args.book)
        books = [book for book in books if int(book["kutub_id"]) in selected]
    if not books:
        print("Aucun ouvrage activé pour cette synchronisation.")
        return 2

    contact = os.getenv("ATHAR_BOT_CONTACT", "operator-contact-not-configured")
    user_agent = f"AtharResearchBot/1.0 (+{contact}; public pages; respectful rate limit)"
    client = KutubClient(args.delay, user_agent)
    connection = connect(args.db)
    initialize_database(connection)

    total_pages = 0
    total_chunks = 0
    try:
        for book in books:
            book_id = f"kutub-{int(book['kutub_id'])}"
            row = connection.execute(
                "SELECT COALESCE(MAX(page), 0) FROM chunks WHERE book_id = ? AND page IS NOT NULL",
                (book_id,),
            ).fetchone()
            last_page = int(row[0] or 0)
            target_page = last_page + batch_size
            print(
                f"\n[{book.get('title', book_id)}] prochain lot : "
                f"pages {last_page + 1} à {target_page} au maximum."
            )
            pages, chunks = crawl_book(
                client,
                connection,
                book,
                max_pages=target_page,
                skip_existing=True,
                snapshots=args.snapshots,
            )
            total_pages += pages
            total_chunks += chunks
    finally:
        connection.close()

    print(
        f"\nSynchronisation par lot terminée : {total_pages} nouvelle(s) page(s), "
        f"{total_chunks} passage(s) ajouté(s) ou mis à jour."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
