from __future__ import annotations

import sqlite3
import unittest

from v5_library import get_book, read_book


class LibraryReaderTests(unittest.TestCase):
    def setUp(self) -> None:
        self.connection = sqlite3.connect(":memory:")
        self.connection.row_factory = sqlite3.Row
        self.connection.executescript(
            """
            CREATE TABLE books (
                id TEXT PRIMARY KEY,
                kutub_id INTEGER,
                title TEXT NOT NULL,
                title_ar TEXT,
                author TEXT,
                discipline TEXT,
                madhhab TEXT,
                pages INTEGER,
                description TEXT,
                source_url TEXT NOT NULL,
                scraped_at TEXT,
                metadata_json TEXT NOT NULL DEFAULT '{}'
            );
            CREATE TABLE chunks (
                id TEXT PRIMARY KEY,
                book_id TEXT NOT NULL,
                page INTEGER,
                chapter TEXT,
                text_ar TEXT,
                text_fr TEXT,
                translation_status TEXT NOT NULL,
                source_url TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                scraped_at TEXT NOT NULL,
                metadata_json TEXT NOT NULL DEFAULT '{}'
            );
            CREATE INDEX idx_chunks_book ON chunks(book_id);
            CREATE INDEX idx_chunks_page ON chunks(book_id, page);
            """
        )
        self.connection.execute(
            """
            INSERT INTO books (
                id, kutub_id, title, title_ar, author, discipline, madhhab,
                pages, description, source_url, metadata_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "book-1",
                123,
                "Livre de test",
                "كتاب الاختبار",
                "Auteur",
                "Fiqh",
                "Mālikite",
                2,
                "Description",
                "https://example.test/book",
                '{"source":"fixture"}',
            ),
        )
        for index, page in enumerate((1, 1, 2, 2, 2), start=1):
            self.connection.execute(
                """
                INSERT INTO chunks (
                    id, book_id, page, chapter, text_ar, text_fr,
                    translation_status, source_url, content_hash, scraped_at
                ) VALUES (?, 'book-1', ?, ?, ?, ?, ?, ?, ?, '2026-08-15T00:00:00Z')
                """,
                (
                    f"c{index}",
                    page,
                    f"Chapitre {page}",
                    f"نص عربي {index}",
                    f"Texte français {index}" if index % 2 else "",
                    "kutub_ai_unreviewed" if index % 2 else "arabic_original",
                    f"https://example.test/book/{page}",
                    f"hash-{index}",
                ),
            )
        self.connection.commit()

    def tearDown(self) -> None:
        self.connection.close()

    def test_book_summary_counts_languages_and_pages(self) -> None:
        book = get_book(self.connection, "book-1")
        self.assertEqual(book["chunks"], 5)
        self.assertEqual(book["indexed_pages"], 2)
        self.assertEqual(book["first_page"], 1)
        self.assertEqual(book["last_page"], 2)
        self.assertEqual(book["arabic_passages"], 5)
        self.assertEqual(book["french_passages"], 3)
        self.assertEqual(book["metadata"]["source"], "fixture")

    def test_reader_is_bounded_and_paginated(self) -> None:
        first = read_book(self.connection, "book-1", limit=2)
        self.assertEqual(first["total"], 5)
        self.assertEqual(len(first["passages"]), 2)
        self.assertEqual(first["next_offset"], 2)
        self.assertIsNone(first["previous_offset"])
        second = read_book(self.connection, "book-1", offset=2, limit=2)
        self.assertEqual(second["previous_offset"], 0)
        self.assertEqual(second["passages"][0]["sequence"], 3)

    def test_reader_can_jump_to_an_indexed_page(self) -> None:
        page = read_book(self.connection, "book-1", page=2, limit=12)
        self.assertEqual(page["page"], 2)
        self.assertEqual(page["total"], 3)
        self.assertTrue(all(item["page"] == 2 for item in page["passages"]))

    def test_reader_never_returns_unbounded_batches(self) -> None:
        payload = read_book(self.connection, "book-1", limit=999)
        self.assertLessEqual(payload["limit"], 12)

    def test_missing_book_and_page_are_explicit(self) -> None:
        with self.assertRaises(LookupError):
            get_book(self.connection, "missing")
        with self.assertRaises(LookupError):
            read_book(self.connection, "book-1", page=99)


if __name__ == "__main__":
    unittest.main()
