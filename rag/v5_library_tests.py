from __future__ import annotations

import sqlite3
import unittest

from v5_library import get_book, get_toc, list_library_books, read_book, search_book


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
                4,
                "Description",
                "https://example.test/book",
                '{"source":"fixture","edition":"Édition test"}',
            ),
        )
        fixtures = (
            (1, "Kitāb al-ṭahāra", "نص عربي في الطهارة 1", "Texte français sur la purification 1"),
            (1, "Kitāb al-ṭahāra", "نص عربي في الوضوء 2", ""),
            (2, "Kitāb al-ṣalāh", "نص عربي في الصلاة 3", "Texte français sur la prière 3"),
            (2, "Kitāb al-ṣalāh", "نص عربي في الصلاة والجماعة 4", ""),
            (4, "Kitāb al-safar", "نص عربي في السفر والقصر 5", "Texte français sur le voyage 5"),
        )
        for index, (page, chapter, text_ar, text_fr) in enumerate(fixtures, start=1):
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
                    chapter,
                    text_ar,
                    text_fr,
                    "kutub_ai_unreviewed" if text_fr else "arabic_original",
                    f"https://example.test/book/{page}",
                    f"hash-{index}",
                ),
            )
        self.connection.commit()

    def tearDown(self) -> None:
        self.connection.close()

    def test_library_catalog_exposes_language_and_section_coverage(self) -> None:
        books = list_library_books(self.connection)
        self.assertEqual(len(books), 1)
        book = books[0]
        self.assertEqual(book["chunks"], 5)
        self.assertEqual(book["indexed_pages"], 3)
        self.assertEqual(book["indexed_sections"], 3)
        self.assertEqual(book["arabic_passages"], 5)
        self.assertEqual(book["french_passages"], 3)
        self.assertTrue(book["has_arabic"])
        self.assertTrue(book["has_french"])

    def test_book_summary_counts_languages_pages_and_sections(self) -> None:
        book = get_book(self.connection, "book-1")
        self.assertEqual(book["chunks"], 5)
        self.assertEqual(book["indexed_pages"], 3)
        self.assertEqual(book["first_page"], 1)
        self.assertEqual(book["last_page"], 4)
        self.assertEqual(book["arabic_passages"], 5)
        self.assertEqual(book["french_passages"], 3)
        self.assertEqual(book["indexed_sections"], 3)
        self.assertTrue(book["has_arabic"])
        self.assertTrue(book["has_french"])
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

    def test_reader_can_jump_and_exposes_real_page_neighbors(self) -> None:
        page = read_book(self.connection, "book-1", page=2, limit=12)
        self.assertEqual(page["page"], 2)
        self.assertEqual(page["total"], 2)
        self.assertEqual(page["previous_page"], 1)
        self.assertEqual(page["next_page"], 4)
        self.assertTrue(all(item["page"] == 2 for item in page["passages"]))

    def test_table_of_contents_is_ordered_and_bounded(self) -> None:
        toc = get_toc(self.connection, "book-1", limit=2)
        self.assertEqual(toc["total"], 3)
        self.assertEqual(len(toc["items"]), 2)
        self.assertTrue(toc["truncated"])
        self.assertEqual(toc["items"][0]["chapter"], "Kitāb al-ṭahāra")
        self.assertEqual(toc["items"][0]["first_page"], 1)
        self.assertEqual(toc["items"][1]["first_page"], 2)

    def test_search_is_scoped_to_the_open_book(self) -> None:
        result = search_book(self.connection, "book-1", "الصلاة", limit=10)
        self.assertEqual(result["book"]["id"], "book-1")
        self.assertEqual(result["count"], 2)
        self.assertTrue(all(hit["page"] == 2 for hit in result["hits"]))
        french = search_book(self.connection, "book-1", "voyage", limit=10)
        self.assertEqual(french["count"], 1)
        self.assertEqual(french["hits"][0]["page"], 4)

    def test_reader_never_returns_unbounded_batches(self) -> None:
        payload = read_book(self.connection, "book-1", limit=999)
        self.assertLessEqual(payload["limit"], 12)

    def test_missing_book_page_and_empty_search_are_explicit(self) -> None:
        with self.assertRaises(LookupError):
            get_book(self.connection, "missing")
        with self.assertRaises(LookupError):
            read_book(self.connection, "book-1", page=99)
        with self.assertRaises(ValueError):
            search_book(self.connection, "book-1", "")


if __name__ == "__main__":
    unittest.main()
