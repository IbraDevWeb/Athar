from __future__ import annotations

import json
import sqlite3
import unittest

from v5_scholar_translation import (
    ScholarTranslationError,
    clear_translation_cache,
    translate_passage,
)
from v5_server import load_translation_source


SOURCE = {
    "id": "chunk-1",
    "book_id": "muwatta",
    "title": "Al-Muwaṭṭaʾ",
    "title_ar": "الموطأ",
    "author": "Mālik ibn Anas",
    "discipline": "Hadith et fiqh",
    "madhhab": "Mālikite",
    "chapter": "باب صلاة المسافر",
    "page": 123,
    "text_ar": "وإذا سافر قصر الصلاة ولم يجمع إلا لحاجة.",
}


class FakeResponse:
    def __init__(self, payload, *, status_code=200):
        self._payload = payload
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            import requests

            response = type("Response", (), {"status_code": self.status_code})()
            raise requests.HTTPError(response=response)

    def json(self):
        return self._payload


def gemini_payload(translation: str, terms=None, uncertainties=None):
    body = {
        "translation": translation,
        "terms": terms or [],
        "uncertainties": uncertainties or [],
    }
    return {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {"text": json.dumps(body, ensure_ascii=False)}
                    ]
                }
            }
        ]
    }


class ScholarTranslationTests(unittest.TestCase):
    def setUp(self):
        clear_translation_cache()

    def test_faithful_translation_uses_full_scholarly_context(self):
        captured = {}

        def fake_post(url, **kwargs):
            captured["url"] = url
            captured.update(kwargs)
            return FakeResponse(
                gemini_payload(
                    "Lorsqu’il voyage, il raccourcit la prière et ne regroupe les prières qu’en cas de besoin.",
                    [
                        {
                            "arabic": "قصر الصلاة",
                            "transliteration": "qaṣr al-ṣalāh",
                            "explanation": "Raccourcissement de la prière en contexte de voyage.",
                        }
                    ],
                )
            )

        result = translate_passage(
            dict(SOURCE),
            mode="faithful",
            api_key="test-key",
            http_post=fake_post,
            use_cache=False,
        )
        self.assertEqual("faithful", result["mode"])
        self.assertEqual("Fidèle", result["mode_label"])
        self.assertIn("raccourcit la prière", result["text_fr"])
        self.assertEqual("Traduction assistée par IA — non vérifiée", result["status"])
        prompt = captured["json"]["contents"][0]["parts"][0]["text"]
        self.assertIn("Al-Muwaṭṭaʾ", prompt)
        self.assertIn("Mālik ibn Anas", prompt)
        self.assertIn("باب صلاة المسافر", prompt)
        self.assertIn(SOURCE["text_ar"], prompt)
        self.assertIn("technical words from their scholarly context", prompt)
        self.assertIn("do not turn القصر in prayer context into a palace", prompt)

    def test_study_mode_returns_bounded_terms_and_uncertainties(self):
        terms = [
            {
                "arabic": f"مصطلح{i}",
                "transliteration": f"term-{i}",
                "explanation": f"Explication {i}",
            }
            for i in range(12)
        ]
        uncertainties = [f"Ambiguïté {i}" for i in range(8)]

        def fake_post(url, **kwargs):
            return FakeResponse(gemini_payload("Traduction d’étude.", terms, uncertainties))

        result = translate_passage(
            dict(SOURCE),
            mode="study",
            api_key="test-key",
            http_post=fake_post,
            use_cache=False,
        )
        self.assertEqual("Étude", result["mode_label"])
        self.assertEqual(8, len(result["terms"]))
        self.assertEqual(4, len(result["uncertainties"]))

    def test_literal_mode_is_supported(self):
        def fake_post(url, **kwargs):
            prompt = kwargs["json"]["contents"][0]["parts"][0]["text"]
            self.assertIn("TRANSLATION MODE: Littérale", prompt)
            self.assertIn("line-by-line", prompt)
            return FakeResponse(gemini_payload("Et lorsqu’il voyage, il raccourcit la prière."))

        result = translate_passage(
            dict(SOURCE),
            mode="literal",
            api_key="test-key",
            http_post=fake_post,
            use_cache=False,
        )
        self.assertEqual("literal", result["mode"])

    def test_invalid_mode_is_rejected_before_network(self):
        with self.assertRaisesRegex(ValueError, "Mode de traduction invalide"):
            translate_passage(dict(SOURCE), mode="freeform", api_key="test-key", use_cache=False)

    def test_missing_arabic_is_rejected(self):
        source = dict(SOURCE)
        source["text_ar"] = ""
        with self.assertRaisesRegex(ValueError, "texte arabe"):
            translate_passage(source, api_key="test-key", use_cache=False)

    def test_missing_key_fails_without_generic_translation_fallback(self):
        with self.assertRaises(ScholarTranslationError) as ctx:
            translate_passage(dict(SOURCE), api_key="", use_cache=False)
        self.assertEqual("not_configured", ctx.exception.code)

    def test_success_is_cached_by_source_and_mode(self):
        calls = {"count": 0}

        def fake_post(url, **kwargs):
            calls["count"] += 1
            return FakeResponse(gemini_payload("Traduction mise en cache."))

        first = translate_passage(dict(SOURCE), api_key="test-key", http_post=fake_post)
        second = translate_passage(dict(SOURCE), api_key="test-key", http_post=fake_post)
        self.assertEqual(1, calls["count"])
        self.assertFalse(first["cache_hit"])
        self.assertTrue(second["cache_hit"])


class IndexedSourceLoaderTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        self.db.row_factory = sqlite3.Row
        self.db.executescript(
            """
            CREATE TABLE books (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                title_ar TEXT,
                author TEXT,
                discipline TEXT,
                madhhab TEXT
            );
            CREATE TABLE chunks (
                id TEXT PRIMARY KEY,
                book_id TEXT NOT NULL,
                page INTEGER,
                chapter TEXT,
                text_ar TEXT,
                text_fr TEXT,
                translation_status TEXT,
                source_url TEXT
            );
            """
        )
        self.db.execute(
            "INSERT INTO books VALUES(?,?,?,?,?,?)",
            ("muwatta", "Al-Muwaṭṭaʾ", "الموطأ", "Mālik ibn Anas", "Hadith et fiqh", "Mālikite"),
        )
        self.db.execute(
            "INSERT INTO chunks VALUES(?,?,?,?,?,?,?,?)",
            (
                "chunk-1",
                "muwatta",
                123,
                "باب صلاة المسافر",
                SOURCE["text_ar"],
                "",
                "openiti_arabic_source",
                "https://example.invalid/source",
            ),
        )
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_loader_returns_only_indexed_passage_with_book_context(self):
        source = load_translation_source(self.db, "chunk-1", book_id="muwatta")
        self.assertEqual("chunk-1", source["id"])
        self.assertEqual("muwatta", source["book_id"])
        self.assertEqual("Al-Muwaṭṭaʾ", source["title"])
        self.assertEqual("Mālik ibn Anas", source["author"])
        self.assertEqual(SOURCE["text_ar"], source["text_ar"])

    def test_loader_rejects_unknown_or_wrong_book_source(self):
        with self.assertRaises(LookupError):
            load_translation_source(self.db, "does-not-exist", book_id="muwatta")
        with self.assertRaises(LookupError):
            load_translation_source(self.db, "chunk-1", book_id="another-book")

    def test_loader_rejects_empty_source_id(self):
        with self.assertRaisesRegex(ValueError, "Identifiant de passage requis"):
            load_translation_source(self.db, "")


if __name__ == "__main__":
    unittest.main(verbosity=2)
