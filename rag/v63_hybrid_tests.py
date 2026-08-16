from __future__ import annotations

import unittest

import numpy as np

from v63_hybrid import FusionConfig, HybridSemanticRuntime


class FakeBase:
    def __init__(self, sources):
        self.sources = sources

    def validate(self):
        return None

    def search(self, query, *, limit=8, madhhab="", discipline=""):
        return {
            "query": query,
            "analysis": {
                "engine": "fake-v61",
                "semantic_embeddings": False,
                "routed_book": None,
                "abstention_guard": "none",
                "madhhab_filter": "strict_metadata" if madhhab else "none",
            },
            "sources": [dict(item) for item in self.sources[:limit]],
            "count": min(len(self.sources), limit),
        }


class FakeModel:
    def __init__(self, *, forbid_passages: bool = False):
        self.forbid_passages = forbid_passages

    def query_embed(self, values):
        for _ in values:
            yield np.array([1.0, 0.0], dtype=np.float32)

    def passage_embed(self, values):
        if self.forbid_passages:
            raise AssertionError("passage_embed ne doit pas être appelé avec un index pré-calculé complet")
        vectors = [
            np.array([0.1, 0.9], dtype=np.float32),
            np.array([0.2, 0.8], dtype=np.float32),
            np.array([1.0, 0.0], dtype=np.float32),
        ]
        for index, _ in enumerate(values):
            yield vectors[index % len(vectors)]


class FakeStore:
    def get_source_vectors(self, sources):
        vectors = {
            "chunk-1": np.array([0.1, 0.9], dtype=np.float32),
            "chunk-2": np.array([0.2, 0.8], dtype=np.float32),
            "chunk-3": np.array([1.0, 0.0], dtype=np.float32),
        }
        return {str(row["id"]): vectors[str(row["id"])] for row in sources if str(row["id"]) in vectors}


def source(i: int):
    return {
        "id": f"chunk-{i}",
        "book_id": "book-1",
        "title": "Book",
        "chapter": "Chapter",
        "text_ar": f"passage {i}",
        "text_fr": "",
        "relevance": 90 - i,
        "madhhab": "Mālikite",
        "discipline": "Fiqh",
        "source_url": "https://example.invalid/book",
        "citation_id": f"S{i}",
    }


class HybridSemanticTests(unittest.TestCase):
    def runtime(self, sources, *, store=None, forbid_passages=False):
        runtime = HybridSemanticRuntime(
            FakeBase(sources),
            config=FusionConfig(candidate_limit=3, anchor_lexical_top1=True),
            embedding_store=store,
        )
        runtime._model = FakeModel(forbid_passages=forbid_passages)
        return runtime

    def test_semantic_reranking_never_rescues_base_abstention(self):
        runtime = self.runtime([])
        result = runtime.search("question", limit=3)
        self.assertEqual([], result["sources"])
        self.assertEqual("base_abstention_or_no_candidates", result["analysis"]["semantic_skipped"])

    def test_lexical_top1_is_anchored(self):
        runtime = self.runtime([source(1), source(2), source(3)])
        result = runtime.search("question", limit=3)
        self.assertEqual("chunk-1", result["sources"][0]["id"])
        self.assertEqual(1, result["sources"][0]["lexical_rank"])
        self.assertTrue(result["analysis"]["anchor_lexical_top1"])

    def test_semantic_signal_can_reorder_the_tail(self):
        runtime = self.runtime([source(1), source(2), source(3)])
        result = runtime.search("question", limit=3)
        self.assertEqual("chunk-3", result["sources"][1]["id"])
        self.assertEqual(1, result["sources"][1]["semantic_rank"])

    def test_citation_ids_follow_final_order(self):
        runtime = self.runtime([source(1), source(2), source(3)])
        result = runtime.search("question", limit=3)
        self.assertEqual(["S1", "S2", "S3"], [x["citation_id"] for x in result["sources"]])

    def test_hybrid_metadata_is_explicit(self):
        runtime = self.runtime([source(1), source(2)])
        result = runtime.search("question", limit=2, madhhab="Mālikite")
        analysis = result["analysis"]
        self.assertTrue(analysis["semantic_embeddings"])
        self.assertEqual("candidate_rerank_only", analysis["semantic_stage"])
        self.assertEqual("weighted_rrf", analysis["fusion"])
        self.assertEqual("strict_metadata", analysis["madhhab_filter"])

    def test_precomputed_store_avoids_passage_encoding(self):
        runtime = self.runtime(
            [source(1), source(2), source(3)],
            store=FakeStore(),
            forbid_passages=True,
        )
        result = runtime.search("question", limit=3)
        self.assertEqual("precomputed", result["analysis"]["semantic_vector_source"])
        self.assertEqual(3, result["analysis"]["precomputed_embedding_hits"])
        self.assertEqual("chunk-3", result["sources"][1]["id"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
