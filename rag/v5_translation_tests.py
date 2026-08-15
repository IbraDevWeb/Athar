from __future__ import annotations

import json
import urllib.parse
import unittest

from v5_translation import MAX_QUERY_BYTES, TranslationError, split_for_translation, translate_arabic_to_french


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def read(self):
        return json.dumps(self.payload, ensure_ascii=False).encode("utf-8")


class TranslationTests(unittest.TestCase):
    def test_split_respects_utf8_limit(self):
        text = " ".join(["الصلاة في السفر لها أحكام معلومة عند الفقهاء."] * 40)
        chunks = split_for_translation(text)
        self.assertGreater(len(chunks), 1)
        self.assertTrue(all(chunk.strip() for chunk in chunks))
        self.assertTrue(all(len(chunk.encode("utf-8")) <= MAX_QUERY_BYTES for chunk in chunks))

    def test_translation_uses_arabic_french_pair_and_combines_segments(self):
        seen = []

        def opener(request, timeout):
            self.assertEqual(timeout, 12.0)
            parsed = urllib.parse.urlsplit(request.full_url)
            params = urllib.parse.parse_qs(parsed.query)
            self.assertEqual(params.get("langpair"), ["ar|fr"])
            self.assertEqual(params.get("mt"), ["1"])
            source = params.get("q", [""])[0]
            self.assertLessEqual(len(source.encode("utf-8")), MAX_QUERY_BYTES)
            seen.append(source)
            return FakeResponse({
                "responseStatus": 200,
                "responseData": {"translatedText": f"Traduction française {len(seen)}"},
            })

        result = translate_arabic_to_french("هذا نص عربي للاختبار. " * 80, opener=opener)
        self.assertGreater(len(seen), 1)
        self.assertIn("Traduction française 1", result["text_fr"])
        self.assertEqual(result["translation_status"], "Traduction automatique")
        self.assertEqual(result["translation_provider"], "MyMemory")
        self.assertIn("texte arabe original", result["translation_notice"].lower())
        self.assertEqual(result["translated_segments"], len(seen))

    def test_translation_rejects_non_french_like_payload(self):
        def opener(request, timeout):
            return FakeResponse({
                "responseStatus": 200,
                "responseData": {"translatedText": "الصلاة"},
            })

        with self.assertRaises(TranslationError):
            translate_arabic_to_french("الصلاة", opener=opener)

    def test_translation_rejects_empty_source(self):
        with self.assertRaises(ValueError):
            translate_arabic_to_french("   ")


if __name__ == "__main__":
    unittest.main(verbosity=2)
