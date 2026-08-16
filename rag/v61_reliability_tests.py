from __future__ import annotations

import sqlite3
import unittest

import v5_engine as engine
from v5_sharded import ShardedCorpusRuntime, _madhhab_matches


class ReliabilityV61Tests(unittest.TestCase):
    def test_reviewed_french_synonyms_are_detected(self) -> None:
        cases = {
            "Que disent les sources sur Fatihat al-Kitab ?": "fatiha",
            "Que disent les textes sur les takbirat ?": "takbir",
            "Que disent les sources sur le salam qui termine la salat ?": "taslim",
            "Que disent les juristes sur l'intérêt usuraire ?": "riba",
            "Que disent les exégètes sur le verset du Trône ?": "ayat_al_kursi",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                names = {item["name"] for item in engine.detect_concepts(query)}
                self.assertIn(expected, names)

    def test_arabic_source_vocabulary_is_a_query_trigger(self) -> None:
        cases = {
            "ماذا تقول المصادر عن الفاتحة؟": "fatiha",
            "ماذا ورد في الكتب عن القنوت؟": "qunut",
            "ما الذي تقوله المصادر عن السجود؟": "sujud",
            "ماذا تقول المصادر عن الغسل؟": "ghusl",
            "ماذا تقول كتب الفقه عن النكاح؟": "marriage",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                names = {item["name"] for item in engine.detect_concepts(query)}
                self.assertIn(expected, names)

    def test_sunan_nasai_routes_to_the_curated_book(self) -> None:
        db = sqlite3.connect(":memory:")
        db.row_factory = sqlite3.Row
        db.execute(
            "CREATE TABLE books (id TEXT PRIMARY KEY, title TEXT, title_ar TEXT, author TEXT, discipline TEXT, madhhab TEXT, pages INTEGER, source_url TEXT)"
        )
        db.execute(
            "INSERT INTO books VALUES(?,?,?,?,?,?,?,?)",
            (
                "openiti-sunan-nasai",
                "Sunan al-Nasai",
                "سنن النسائي",
                "Al-Nasai",
                "Hadith",
                "Transversal",
                None,
                "https://example.invalid/nasai",
            ),
        )
        db.execute(
            "INSERT INTO books VALUES(?,?,?,?,?,?,?,?)",
            (
                "other-nasai",
                "Kitab Fadail al-Sahaba",
                "فضائل الصحابة",
                "Al-Nasai",
                "Hadith",
                "Transversal",
                None,
                "https://example.invalid/other",
            ),
        )
        db.commit()
        try:
            routed = engine.detect_book(db, "Que rapporte Sunan al-Nasai sur la prière ?")
            self.assertIsNotNone(routed)
            self.assertEqual("openiti-sunan-nasai", routed["id"])
            self.assertEqual("canonical_alias_v61", routed["route_reason"])
        finally:
            db.close()

    def test_madhhab_filter_requires_explicit_matching_metadata(self) -> None:
        self.assertTrue(_madhhab_matches({"madhhab": "Mālikite · Comparatif"}, "Mālikite"))
        self.assertFalse(_madhhab_matches({"madhhab": "Shafiite"}, "Mālikite"))
        self.assertFalse(_madhhab_matches({"madhhab": ""}, "Mālikite"))
        self.assertTrue(_madhhab_matches({"madhhab": ""}, "all"))

    def test_real_book_plus_out_of_domain_topic_is_abstained(self) -> None:
        selected = [{"id": "accidental", "matched_terms": ["100"]}]
        analyses = [
            {
                "concepts": [],
                "raw_terms": ["protocole", "ethernet", "100", "gigabits"],
            }
        ]
        guarded, applied = ShardedCorpusRuntime._apply_raw_abstention_guard(
            selected,
            analyses,
            {"id": "openiti-sahih-bukhari"},
        )
        self.assertTrue(applied)
        self.assertEqual([], guarded)

    def test_short_routed_raw_lookup_is_not_over_blocked(self) -> None:
        selected = [{"id": "turban", "matched_terms": ["turban"]}]
        analyses = [{"concepts": [], "raw_terms": ["turban"]}]
        guarded, applied = ShardedCorpusRuntime._apply_raw_abstention_guard(
            selected,
            analyses,
            {"id": "openiti-sahih-bukhari"},
        )
        self.assertFalse(applied)
        self.assertEqual(selected, guarded)


if __name__ == "__main__":
    unittest.main(verbosity=2)
