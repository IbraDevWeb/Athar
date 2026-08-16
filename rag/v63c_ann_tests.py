from __future__ import annotations

import json
import sqlite3
import tempfile
import unittest
from pathlib import Path

import numpy as np

from v63_hybrid import DEFAULT_MODEL
from v63_semantic_index import INDEX_VERSION
from v63c_ann_index import ANN_VERSION, GlobalAnnIndex, build_ann, sha256
from v63c_shadow import AnnFusionConfig, AnnShadowRuntime


class FakeQueryModel:
    def __init__(self, vector: np.ndarray) -> None:
        self.vector = np.asarray(vector, dtype=np.float32)

    def query_embed(self, values):
        return iter([self.vector.copy() for _ in values])


class FakeAnn:
    def __init__(self, rows):
        self.rows = rows
        self.manifest = {
            "version": ANN_VERSION,
            "corpus_source_sha": "corpus-sha",
            "semantic_model": DEFAULT_MODEL,
            "metric": "cos",
            "vectors": len(rows),
        }

    def search(self, query_vector, *, top_k=40):
        return [dict(row) for row in self.rows[:top_k]]


class FakeBase:
    def __init__(self, db_path: Path, sources):
        self.manifest = {"source_sha": "corpus-sha"}
        self.shard_paths = {"s1": db_path}
        self.sources = sources

    def validate(self):
        return None

    def search(self, query, *, limit=8, madhhab="", discipline=""):
        return {
            "query": query,
            "analysis": {"routed_book": None, "concepts": [], "madhhab_filter": "none"},
            "sources": [dict(x) for x in self.sources[:limit]],
            "count": min(len(self.sources), limit),
        }


def make_source(chunk_id: str, book_id: str = "b1", title: str = "Book"):
    return {
        "id": chunk_id,
        "book_id": book_id,
        "title": title,
        "title_ar": "",
        "author": "Author",
        "discipline": "fiqh",
        "madhhab": "maliki",
        "page": 1,
        "chapter": "chapter",
        "text_ar": f"text {chunk_id}",
        "text_fr": "",
        "translation_status": "",
        "source_url": "https://example.test",
        "relevance": 90,
        "matched_concepts": ["prayer"],
        "matched_terms": ["صلاة"],
        "shard_id": "s1",
    }


class AnnBuildTests(unittest.TestCase):
    def test_build_and_query_global_ann(self):
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            semantic = root / "semantic"
            semantic.mkdir()
            corpus_shards = []
            expected = []
            for shard_id, rows in (("s1", [("c1", [1, 0, 0, 0]), ("c2", [0, 1, 0, 0])]), ("s2", [("c3", [0, 0, 1, 0]), ("c4", [0, 0, 0, 1])])):
                vectors = np.asarray([v for _, v in rows], dtype=np.float16)
                vector_name = f"{shard_id}.vectors.f16.npy"
                np.save(semantic / vector_name, vectors)
                meta_name = f"{shard_id}.meta.sqlite"
                meta = sqlite3.connect(semantic / meta_name)
                meta.execute("CREATE TABLE semantic_rows(row_index INTEGER PRIMARY KEY, chunk_id TEXT UNIQUE, book_id TEXT, discipline TEXT, madhhab TEXT)")
                for idx, (chunk_id, _) in enumerate(rows):
                    meta.execute("INSERT INTO semantic_rows VALUES(?,?,?,?,?)", (idx, chunk_id, f"book-{shard_id}", "fiqh", "maliki"))
                    expected.append(chunk_id)
                meta.commit(); meta.close()
                source_sha = f"sha-{shard_id}"
                manifest = {
                    "version": INDEX_VERSION,
                    "shard_id": shard_id,
                    "source_database": f"{shard_id}.sqlite",
                    "source_database_sha256": source_sha,
                    "model": DEFAULT_MODEL,
                    "dimension": 4,
                    "dtype": "float16",
                    "normalized": True,
                    "target_count": len(rows),
                    "indexed_count": len(rows),
                    "complete": True,
                    "max_chunks": 0,
                    "vectors_file": vector_name,
                    "vectors_size_bytes": (semantic / vector_name).stat().st_size,
                    "metadata_file": meta_name,
                    "metadata_size_bytes": (semantic / meta_name).stat().st_size,
                }
                (semantic / f"{shard_id}.semantic.json").write_text(json.dumps(manifest), encoding="utf-8")
                corpus_shards.append({"id": shard_id, "chunks": len(rows), "database_sha256": source_sha})
            corpus = {"version": 3, "source_sha": "corpus-sha", "chunks": 4, "shards": corpus_shards}
            corpus_path = root / "corpus.json"
            corpus_path.write_text(json.dumps(corpus), encoding="utf-8")
            output = root / "ann"
            result = build_ann(corpus_path, semantic, output, batch_size=256)
            self.assertEqual(result["vectors"], 4)
            self.assertEqual(result["version"], ANN_VERSION)
            ann = GlobalAnnIndex(output / "athar-v63c-global.ann.json")
            try:
                found = ann.search(np.asarray([1, 0, 0, 0], dtype=np.float32), top_k=2)
                self.assertEqual(found[0]["chunk_id"], "c1")
                mapped = ann.rows_for_keys(range(4))
                self.assertEqual({row["chunk_id"] for row in mapped.values()}, set(expected))
            finally:
                ann.close()


class ShadowSafetyTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.db = self.root / "s1.sqlite"
        conn = sqlite3.connect(self.db)
        conn.execute("CREATE TABLE books(id TEXT PRIMARY KEY, title TEXT, title_ar TEXT, author TEXT, discipline TEXT, madhhab TEXT)")
        conn.execute("CREATE TABLE chunks(id TEXT PRIMARY KEY, book_id TEXT, page INTEGER, chapter TEXT, text_ar TEXT, text_fr TEXT, translation_status TEXT, source_url TEXT)")
        conn.execute("INSERT INTO books VALUES('b1','Book','','Author','fiqh','maliki')")
        for chunk_id in ("lex", "ann"):
            conn.execute("INSERT INTO chunks VALUES(?,?,?,?,?,?,?,?)", (chunk_id, "b1", 1, "chapter", f"text {chunk_id}", "", "", "https://example.test"))
        conn.commit(); conn.close()
        self.ann_rows = [
            {"ann_key": 0, "shard_id": "s1", "row_index": 1, "chunk_id": "ann", "book_id": "b1", "discipline": "fiqh", "madhhab": "maliki", "ann_rank": 1, "ann_distance": 0.05, "ann_similarity": 0.95}
        ]

    def tearDown(self):
        self.tmp.cleanup()

    def runtime(self, lexical):
        runtime = AnnShadowRuntime(
            FakeBase(self.db, lexical), FakeAnn(self.ann_rows),
            config=AnnFusionConfig(lexical_limit=20, ann_limit=10, ann_oversample=10),
        )
        runtime._model = FakeQueryModel(np.asarray([1, 0, 0, 0], dtype=np.float32))
        return runtime

    def test_ann_never_reverses_v61_abstention(self):
        result = self.runtime([]).search("out of domain", limit=10)
        self.assertEqual(result["sources"], [])
        self.assertEqual(result["shadow_ann_sources"][0]["id"], "ann")
        self.assertFalse(result["analysis"]["ann_promotion_allowed"])

    def test_ann_can_extend_existing_evidence(self):
        result = self.runtime([make_source("lex")]).search("prayer", limit=10)
        ids = [row["id"] for row in result["sources"]]
        self.assertEqual(ids[0], "lex")
        self.assertIn("ann", ids)
        self.assertTrue(result["analysis"]["ann_promotion_allowed"])
        self.assertEqual(result["analysis"]["ann_only_candidate_count"], 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
