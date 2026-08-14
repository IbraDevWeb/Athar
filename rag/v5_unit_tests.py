from __future__ import annotations

import sqlite3
import unittest

from v5_engine import ask, corpus_status, detect_concepts, normalize_text, search

BOOKS = [
    ("bukhari", "Sahih al-Bukhari", "", "Al-Bukhari", "Hadith", "Transversal"),
    ("muslim", "Sahih Muslim", "", "Muslim ibn al-Hajjaj", "Hadith", "Transversal"),
    ("muwatta", "Al-Muwatta", "الموطأ", "Malik ibn Anas", "Hadith et fiqh", "Malikite"),
    ("bidayat", "Bidayat al-Mujtahid", "بداية المجتهد", "Ibn Rushd al-Hafid", "Fiqh compare", "Malikite"),
    ("tabari", "Jamic al-Bayan", "جامع البيان", "Al-Tabari", "Tafsir", "Transversal"),
    ("ibn-kathir-tafsir", "Tafsir al-Quran al-Azim", "تفسير القرآن العظيم", "Ibn Kathir", "Tafsir", "Shafiite"),
    ("tirmidhi", "Sunan al-Tirmidhi", "", "Al-Tirmidhi", "Hadith", "Transversal"),
    ("ibn-hisham", "Al-Sira al-Nabawiyya", "السيرة النبوية", "Ibn Hisham", "Sira et histoire", "Transversal"),
]

PASSAGES = [
    ("c1", "bukhari", 1, "بدء الوحي", "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى", "", "openiti_arabic_source"),
    ("c2", "muslim", 2, "كتاب الطهارة", "باب الطهارة والوضوء وغسل أعضاء الوضوء", "", "openiti_arabic_source"),
    ("c3", "muwatta", 3, "باب الجهر بالقراءة", "كان يجهر بالقراءة في صلاة الصبح ويسمع من خلفه", "", "openiti_arabic_source"),
    ("c4", "muwatta", 4, "باب القراءة", "وكان يسر بالقراءة في صلاة الظهر والعصر", "", "openiti_arabic_source"),
    ("c5", "bidayat", 5, "كتاب الصيام", "واختلفوا في صوم المسافر وهل يفطر المسافر في السفر", "", "openiti_arabic_source"),
    ("c6", "tabari", 6, "تفسير فاتحة الكتاب", "القول في تأويل الحمد لله رب العالمين من فاتحة الكتاب", "", "openiti_arabic_source"),
    ("c7", "ibn-kathir-tafsir", 7, "تفسير آية الكرسي", "الله لا إله إلا هو الحي القيوم وهذه آية الكرسي", "", "openiti_arabic_source"),
    ("c8", "tirmidhi", 8, "باب ما جاء في الوتر", "حدثنا في صلاة الوتر وأن النبي صلى الله عليه وسلم أوتر", "", "openiti_arabic_source"),
    ("c9", "ibn-hisham", 9, "غزوة بدر", "ثم كانت غزوة بدر ويوم بدر بين المسلمين وقريش", "", "openiti_arabic_source"),
]


class RagV5Tests(unittest.TestCase):
    def setUp(self) -> None:
        self.db = sqlite3.connect(":memory:")
        self.db.row_factory = sqlite3.Row
        self.db.executescript("""
            CREATE TABLE books (id TEXT PRIMARY KEY, title TEXT NOT NULL, title_ar TEXT, author TEXT, discipline TEXT, madhhab TEXT, pages INTEGER, source_url TEXT);
            CREATE TABLE chunks (id TEXT PRIMARY KEY, book_id TEXT NOT NULL, page INTEGER, chapter TEXT, text_ar TEXT, text_fr TEXT, translation_status TEXT, source_url TEXT);
            CREATE VIRTUAL TABLE chunks_fts USING fts5(chunk_id UNINDEXED, title, title_ar, author, chapter, text_ar, text_fr, normalized, tokenize='unicode61 remove_diacritics 2');
        """)
        for book in BOOKS:
            self.db.execute("INSERT INTO books VALUES(?,?,?,?,?,?,?,?)", (*book, None, f"https://example.invalid/{book[0]}"))
        for chunk in PASSAGES:
            chunk_id, book_id, page, chapter, text_ar, text_fr, status = chunk
            book = self.db.execute("SELECT * FROM books WHERE id=?", (book_id,)).fetchone()
            self.db.execute("INSERT INTO chunks VALUES(?,?,?,?,?,?,?,?)", (chunk_id, book_id, page, chapter, text_ar, text_fr, status, f"https://example.invalid/{chunk_id}"))
            normalized = normalize_text(" ".join(filter(None, [book["title"], book["title_ar"], book["author"], chapter, text_ar, text_fr])))
            self.db.execute("INSERT INTO chunks_fts VALUES(?,?,?,?,?,?,?,?)", (chunk_id, book["title"], book["title_ar"], book["author"], chapter, text_ar, text_fr, normalized))
        self.db.commit()

    def tearDown(self) -> None:
        self.db.close()

    def test_natural_french_prier_a_voix_haute(self) -> None:
        result = search(self.db, "prier à voix haute", limit=5)
        self.assertGreater(result["count"], 0, result["analysis"])
        self.assertEqual("c3", result["sources"][0]["id"], result["sources"])
        self.assertIn("prayer", result["analysis"]["concepts"])
        self.assertIn("recitation_aloud", result["analysis"]["concepts"])

    def test_natural_french_prier_a_voix_basse(self) -> None:
        result = search(self.db, "est-ce qu'on peut prier à voix basse ?", limit=5)
        self.assertGreater(result["count"], 0, result["analysis"])
        self.assertEqual("c4", result["sources"][0]["id"], result["sources"])
        self.assertIn("recitation_silent", result["analysis"]["concepts"])

    def test_morphology_prier_is_understood(self) -> None:
        concepts = [item["name"] for item in detect_concepts("comment prier en voyage ?")]
        self.assertIn("prayer", concepts)
        self.assertIn("travel", concepts)

    def test_book_targeting_still_works(self) -> None:
        cases = [
            ("Que dit Sahih al-Bukhari sur les intentions ?", "bukhari"),
            ("Que dit Sahih Muslim sur la purification ?", "muslim"),
            ("Que dit le Tafsir al-Tabari sur la sourate al-Fatiha ?", "tabari"),
            ("Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?", "ibn-kathir-tafsir"),
            ("Que rapporte Sunan al-Tirmidhi sur la prière du witr ?", "tirmidhi"),
            ("Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?", "ibn-hisham"),
        ]
        for question, expected in cases:
            with self.subTest(question=question):
                result = search(self.db, question, limit=5)
                self.assertEqual(expected, result["analysis"]["routed_book"]["id"])
                self.assertGreater(result["count"], 0)
                self.assertTrue(all(source["book_id"] == expected for source in result["sources"]))

    def test_unknown_question_does_not_invent(self) -> None:
        result = ask(self.db, "la couleur exacte du turban de telle personne inconnue", limit=5)
        self.assertEqual([], result["sources"])
        self.assertEqual("insufficient", result["answer"]["verdict"])

    def test_status_contract(self) -> None:
        status = corpus_status(self.db)
        self.assertEqual("rag-v5-hybrid-multilingual", status["engine"])
        self.assertTrue(status["fts_ready"])
        self.assertFalse(status["semantic_embeddings"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
