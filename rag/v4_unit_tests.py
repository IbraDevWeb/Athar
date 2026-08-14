from __future__ import annotations

import sqlite3
import unittest

from v4_engine import ask, corpus_status, search


BOOKS = [
    ("bukhari", "Sahih al-Bukhari", "", "Al-Bukhari", "Hadith", "Transversal"),
    ("muslim", "Sahih Muslim", "", "Muslim ibn al-Hajjaj", "Hadith", "Transversal"),
    ("muwatta", "Al-Muwatta", "الموطأ", "Malik ibn Anas", "Hadith et fiqh", "Malikite"),
    ("bidayat", "Bidayat al-Mujtahid", "بداية المجتهد", "Ibn Rushd al-Hafid", "Fiqh compare", "Malikite"),
    ("tabari", "Jamic al-Bayan", "جامع البيان", "Al-Tabari", "Tafsir", "Transversal"),
    ("ibn-kathir-tafsir", "Tafsir al-Quran al-Azim", "تفسير القرآن العظيم", "Ibn Kathir", "Tafsir", "Shafiite"),
    ("tirmidhi", "Sunan al-Tirmidhi", "", "Al-Tirmidhi", "Hadith", "Transversal"),
    ("ibn-hisham", "Al-Sira al-Nabawiyya", "السيرة النبوية", "Ibn Hisham", "Sira et histoire", "Transversal"),
    ("qurtubi", "Tafsir al-Qurtubi", "الجامع لأحكام القرآن", "Al-Qurtubi", "Tafsir", "Malikite"),
]

PASSAGES = [
    ("c1", "bukhari", 1, "بدء الوحي", "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى", "", "openiti_arabic_source"),
    ("c2", "muslim", 2, "كتاب الطهارة", "باب الطهارة والوضوء وغسل أعضاء الوضوء", "", "openiti_arabic_source"),
    ("c3", "muwatta", 3, "كتاب الصلاة", "قال مالك في الصلاة وأوقاتها وما جاء فيها", "", "openiti_arabic_source"),
    ("c4", "bidayat", 4, "كتاب الصيام", "واختلفوا في صوم المسافر وهل يفطر المسافر في السفر", "", "openiti_arabic_source"),
    ("c5", "tabari", 5, "تفسير فاتحة الكتاب", "القول في تأويل الحمد لله رب العالمين من فاتحة الكتاب", "", "openiti_arabic_source"),
    ("c6", "ibn-kathir-tafsir", 6, "تفسير آية الكرسي", "الله لا إله إلا هو الحي القيوم وهذه آية الكرسي", "", "openiti_arabic_source"),
    ("c7", "tirmidhi", 7, "باب ما جاء في الوتر", "حدثنا في صلاة الوتر وأن النبي صلى الله عليه وسلم أوتر", "", "openiti_arabic_source"),
    ("c8", "ibn-hisham", 8, "غزوة بدر", "ثم كانت غزوة بدر ويوم بدر بين المسلمين وقريش", "", "openiti_arabic_source"),
    ("noise1", "qurtubi", 9, "فضائل القرآن", "ذكر فضائل القرآن وعلومه", "", "openiti_arabic_source"),
]


class RagV4Tests(unittest.TestCase):
    def setUp(self) -> None:
        self.db = sqlite3.connect(":memory:")
        self.db.row_factory = sqlite3.Row
        self.db.executescript(
            """
            CREATE TABLE books (
                id TEXT PRIMARY KEY, title TEXT NOT NULL, title_ar TEXT, author TEXT,
                discipline TEXT, madhhab TEXT, pages INTEGER, source_url TEXT
            );
            CREATE TABLE chunks (
                id TEXT PRIMARY KEY, book_id TEXT NOT NULL, page INTEGER, chapter TEXT,
                text_ar TEXT, text_fr TEXT, translation_status TEXT, source_url TEXT
            );
            CREATE VIRTUAL TABLE chunks_fts USING fts5(
                chunk_id UNINDEXED, title, title_ar, author, chapter, text_ar, text_fr, normalized,
                tokenize='unicode61 remove_diacritics 2'
            );
            """
        )
        for book in BOOKS:
            self.db.execute(
                "INSERT INTO books(id,title,title_ar,author,discipline,madhhab,pages,source_url) VALUES(?,?,?,?,?,?,?,?)",
                (*book, None, f"https://example.invalid/{book[0]}"),
            )
        for chunk in PASSAGES:
            chunk_id, book_id, page, chapter, text_ar, text_fr, status = chunk
            book = self.db.execute("SELECT * FROM books WHERE id=?", (book_id,)).fetchone()
            self.db.execute(
                "INSERT INTO chunks VALUES(?,?,?,?,?,?,?,?)",
                (chunk_id, book_id, page, chapter, text_ar, text_fr, status, f"https://example.invalid/{chunk_id}"),
            )
            normalized = " ".join(filter(None, [book["title"], book["title_ar"], book["author"], chapter, text_ar, text_fr]))
            self.db.execute(
                "INSERT INTO chunks_fts VALUES(?,?,?,?,?,?,?,?)",
                (chunk_id, book["title"], book["title_ar"], book["author"], chapter, text_ar, text_fr, normalized),
            )
        self.db.commit()

    def tearDown(self) -> None:
        self.db.close()

    def assert_targets_book(self, question: str, expected_book_id: str) -> None:
        result = search(self.db, question, limit=5)
        routed = result["analysis"]["routed_book"]
        self.assertIsNotNone(routed, question)
        self.assertEqual(expected_book_id, routed["id"], result["analysis"])
        self.assertGreater(result["count"], 0, result)
        self.assertTrue(all(source["book_id"] == expected_book_id for source in result["sources"]), result["sources"])
        self.assertEqual(expected_book_id, result["sources"][0]["book_id"])
        self.assertGreaterEqual(result["sources"][0]["relevance"], 70)

    def test_book_targeting_matrix(self) -> None:
        cases = [
            ("Que dit Sahih al-Bukhari sur les intentions ?", "bukhari"),
            ("Que dit Sahih Muslim sur la purification ?", "muslim"),
            ("Que rapporte le Muwatta de Malik sur la prière ?", "muwatta"),
            ("Que dit Bidayat al-Mujtahid sur le jeûne du voyageur ?", "bidayat"),
            ("Que dit le Tafsir al-Tabari sur la sourate al-Fatiha ?", "tabari"),
            ("Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?", "ibn-kathir-tafsir"),
            ("Que rapporte Sunan al-Tirmidhi sur la prière du witr ?", "tirmidhi"),
            ("Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?", "ibn-hisham"),
        ]
        for question, expected in cases:
            with self.subTest(question=question):
                self.assert_targets_book(question, expected)

    def test_no_unrelated_fallback(self) -> None:
        result = ask(self.db, "Que dit Sahih al-Bukhari sur les règles de la zakat des mines ?", limit=5)
        self.assertEqual("bukhari", result["analysis"]["routed_book"]["id"])
        self.assertEqual([], result["sources"])
        self.assertEqual("insufficient", result["answer"]["verdict"])

    def test_status_is_read_only_contract(self) -> None:
        status = corpus_status(self.db)
        self.assertEqual(9, status["books"])
        self.assertEqual(9, status["chunks"])
        self.assertTrue(status["fts_ready"])
        self.assertTrue(status["read_only"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
