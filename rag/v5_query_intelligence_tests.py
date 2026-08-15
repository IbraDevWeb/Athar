from __future__ import annotations

import os
import unittest
from unittest.mock import patch

from v5_query_intelligence import analyze_query, clear_query_intelligence_cache


class FakeResponse:
    def __init__(self, payload, status_error: Exception | None = None):
        self.payload = payload
        self.status_error = status_error

    def raise_for_status(self):
        if self.status_error:
            raise self.status_error

    def json(self):
        return self.payload


class QueryIntelligenceTests(unittest.TestCase):
    def setUp(self) -> None:
        clear_query_intelligence_cache()

    def test_without_api_key_falls_back_without_network(self) -> None:
        called = []

        def fake_post(*args, **kwargs):
            called.append((args, kwargs))
            raise AssertionError("network should not be called")

        with patch.dict(os.environ, {"GEMINI_API_KEY": ""}, clear=False):
            result = analyze_query("Que dit le Muwatta sur l'éclipse ?", http_post=fake_post, use_cache=False)
        self.assertFalse(result["used"])
        self.assertEqual("deterministic", result["fallback"])
        self.assertEqual("not_configured", result["error"])
        self.assertEqual([], called)

    def test_structured_eclipse_analysis_is_sanitized(self) -> None:
        captured = {}
        model_payload = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": '{"notions":["prière de l’éclipse"],"concepts":[{"label":"prière de l’éclipse","importance":"primary","terms":["صلاة الكسوف","الكسوف","كسوف الشمس","صلاة الخسوف","الخسوف","kusuf","khusuf"]}]}'
                            }
                        ]
                    }
                }
            ]
        }

        def fake_post(url, **kwargs):
            captured["url"] = url
            captured.update(kwargs)
            return FakeResponse(model_payload)

        result = analyze_query(
            "Que dit le Muwatta sur la prière de l'éclipse ?",
            api_key="test-secret",
            http_post=fake_post,
            use_cache=False,
        )
        self.assertTrue(result["used"])
        self.assertEqual("none", result["fallback"])
        self.assertEqual(["prière de l’éclipse"], result["notions"])
        self.assertEqual("primary", result["concepts"][0]["importance"])
        self.assertIn("صلاة الكسوف", result["concepts"][0]["terms"])
        self.assertIn("الخسوف", result["concepts"][0]["terms"])
        self.assertIn("gemini-3.5-flash:generateContent", captured["url"])
        self.assertEqual("test-secret", captured["headers"]["x-goog-api-key"])
        generation = captured["json"]["generationConfig"]
        self.assertEqual("application/json", generation["responseFormat"]["text"]["mimeType"])
        self.assertEqual("object", generation["responseFormat"]["text"]["schema"]["type"])

    def test_provider_failure_never_breaks_retrieval_path(self) -> None:
        def fake_post(*args, **kwargs):
            return FakeResponse({}, RuntimeError("quota"))

        result = analyze_query("question", api_key="test-secret", http_post=fake_post, use_cache=False)
        self.assertFalse(result["used"])
        self.assertEqual("deterministic", result["fallback"])
        self.assertEqual("RuntimeError", result["error"])

    def test_cache_avoids_second_provider_call(self) -> None:
        calls = []
        payload = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": '{"notions":["witr"],"concepts":[{"label":"witr","importance":"primary","terms":["الوتر","وتر","witr"]}]}'
                            }
                        ]
                    }
                }
            ]
        }

        def fake_post(*args, **kwargs):
            calls.append(1)
            return FakeResponse(payload)

        first = analyze_query("Que dit Tirmidhi sur le witr ?", api_key="test-secret", http_post=fake_post)
        second = analyze_query("Que dit Tirmidhi sur le witr ?", api_key="test-secret", http_post=fake_post)
        self.assertTrue(first["used"])
        self.assertTrue(second["cache_hit"])
        self.assertEqual(1, len(calls))


if __name__ == "__main__":
    unittest.main(verbosity=2)
