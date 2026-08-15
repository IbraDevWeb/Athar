from __future__ import annotations

import json
import unittest

from v5_scholar_synthesis import (
    ScholarSynthesisError,
    clear_synthesis_cache,
    select_synthesis_sources,
    synthesize_from_sources,
)


SOURCES = [
    {
        "id": "chunk-1",
        "citation_id": "S1",
        "book_id": "maliki-book",
        "title": "Ouvrage mālikite",
        "title_ar": "كتاب مالكي",
        "author": "Auteur A",
        "discipline": "Fiqh",
        "madhhab": "Mālikite",
        "chapter": "باب الصلاة",
        "page": 10,
        "text_ar": "قول أول في المسألة.",
        "text_fr": "Premier avis sur la question.",
    },
    {
        "id": "chunk-2",
        "citation_id": "S2",
        "book_id": "hanafi-book",
        "title": "Ouvrage ḥanafite",
        "title_ar": "كتاب حنفي",
        "author": "Auteur B",
        "discipline": "Fiqh",
        "madhhab": "Ḥanafite",
        "chapter": "باب الصلاة",
        "page": 20,
        "text_ar": "قول ثان في المسألة.",
        "text_fr": "Deuxième avis sur la question.",
    },
    {
        "id": "chunk-3",
        "citation_id": "S3",
        "book_id": "maliki-book",
        "title": "Ouvrage mālikite",
        "author": "Auteur A",
        "discipline": "Fiqh",
        "madhhab": "Mālikite",
        "chapter": "تفصيل",
        "page": 11,
        "text_ar": "تفصيل القول الأول.",
        "text_fr": "Précision du premier avis.",
    },
]


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


def gemini_payload(body):
    return {
        "candidates": [
            {
                "content": {
                    "parts": [{"text": json.dumps(body, ensure_ascii=False)}]
                }
            }
        ]
    }


class ScholarSynthesisTests(unittest.TestCase):
    def setUp(self):
        clear_synthesis_cache()

    def test_prompt_is_strictly_grounded_and_contains_citation_ids(self):
        captured = {}

        def fake_post(url, **kwargs):
            captured.update(kwargs)
            return FakeResponse(
                gemini_payload(
                    {
                        "overview": "Les passages retrouvés présentent deux formulations distinctes.",
                        "position_status": "multiple",
                        "positions": [
                            {
                                "title": "Première position",
                                "school_or_tradition": "Mālikite",
                                "summary": "Le premier passage formule le premier avis.",
                                "source_ids": ["S1", "S3"],
                            },
                            {
                                "title": "Deuxième position",
                                "school_or_tradition": "Ḥanafite",
                                "summary": "Le deuxième passage formule un avis différent.",
                                "source_ids": ["S2"],
                            },
                        ],
                        "agreements": ["Les deux passages traitent de la même question."],
                        "differences": ["La formulation de la règle diffère."],
                        "limits": [],
                    }
                )
            )

        result = synthesize_from_sources(
            "Quelles sont les différentes positions ?",
            SOURCES,
            api_key="test-key",
            http_post=fake_post,
            use_cache=False,
        )
        prompt = captured["json"]["contents"][0]["parts"][0]["text"]
        self.assertIn("Use ONLY the supplied passages", prompt)
        self.assertIn("Do not use general knowledge", prompt)
        self.assertIn("[S1]", prompt)
        self.assertIn("[S2]", prompt)
        self.assertIn("Premier avis sur la question", prompt)
        self.assertEqual("multiple", result["position_status"])
        self.assertEqual(2, len(result["positions"]))
        self.assertEqual(["S1", "S3"], result["positions"][0]["source_ids"])
        self.assertIn("passages Athar", result["status"])

    def test_unknown_model_citations_are_removed_and_uncited_positions_are_dropped(self):
        def fake_post(url, **kwargs):
            return FakeResponse(
                gemini_payload(
                    {
                        "overview": "Synthèse.",
                        "position_status": "multiple",
                        "positions": [
                            {
                                "title": "Valide",
                                "school_or_tradition": "",
                                "summary": "Appuyée par une source réelle.",
                                "source_ids": ["S1", "S99"],
                            },
                            {
                                "title": "Hallucinée",
                                "school_or_tradition": "",
                                "summary": "Sans source autorisée.",
                                "source_ids": ["S404"],
                            },
                        ],
                        "agreements": [],
                        "differences": [],
                        "limits": [],
                    }
                )
            )

        result = synthesize_from_sources(
            "Question test",
            SOURCES,
            api_key="test-key",
            http_post=fake_post,
            use_cache=False,
        )
        self.assertEqual(1, len(result["positions"]))
        self.assertEqual(["S1"], result["positions"][0]["source_ids"])

    def test_diversity_selector_prioritizes_distinct_madhhabs_and_books(self):
        selected = select_synthesis_sources(SOURCES, routed_book=False, limit=2)
        self.assertEqual({"Mālikite", "Ḥanafite"}, {item["madhhab"] for item in selected})

    def test_routed_book_preserves_rag_order(self):
        selected = select_synthesis_sources(SOURCES, routed_book=True, limit=2)
        self.assertEqual(["S1", "S2"], [item["citation_id"] for item in selected])

    def test_missing_key_fails_closed(self):
        with self.assertRaises(ScholarSynthesisError) as ctx:
            synthesize_from_sources("Question test", SOURCES, api_key="", use_cache=False)
        self.assertEqual("not_configured", ctx.exception.code)

    def test_success_is_cached_by_question_and_evidence(self):
        calls = {"count": 0}

        def fake_post(url, **kwargs):
            calls["count"] += 1
            return FakeResponse(
                gemini_payload(
                    {
                        "overview": "Synthèse mise en cache.",
                        "position_status": "single",
                        "positions": [
                            {
                                "title": "Position",
                                "school_or_tradition": "",
                                "summary": "Résumé.",
                                "source_ids": ["S1"],
                            }
                        ],
                        "agreements": [],
                        "differences": [],
                        "limits": [],
                    }
                )
            )

        first = synthesize_from_sources("Question test", SOURCES, api_key="test-key", http_post=fake_post)
        second = synthesize_from_sources("Question test", SOURCES, api_key="test-key", http_post=fake_post)
        self.assertEqual(1, calls["count"])
        self.assertFalse(first["cache_hit"])
        self.assertTrue(second["cache_hit"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
