from __future__ import annotations

import sqlite3
import tempfile
import unittest
from pathlib import Path

import numpy as np

from v63_semantic_index import (
    INDEX_VERSION,
    SemanticIndexCollection,
    SemanticShardIndex,
    build_index,
)


class FakeEmbeddingModel:
    def passage_embed(self, values):
        for text in values:
            lowered = str(text).lower()
            if "wudu" in lowered or "وضوء" in lowered:
                yield np.array([1.0, 0.0, 0.0], dtype=np.float32)
            elif "fast" in lowered or "صيام" in lowered:
                yield np.array([0.0, 1.0, 0.0], dtype=np.float32)
            else:
                yield np.array([0.0, 0.0, 1.0], dtype=np.float32)


def create_shard(path: Path) -> None:
    db = sqlite3.connect(path)
    try:
        db.executescript(
            """
            CREATE TABLE books (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                discipline TEXT,
                madhhab TEXT
            );
            CREATE TABLE chunks (
                id TEXT PRIMARY KEY,
                book_id TEXT NOT NULL,
                chapter TEXT,
                text_ar TEXT,
                text_fr TEXT
            );
            """
        )
        db.execute("INSERT INTO books VALUES(?,?,?,?)", ("book-fiqh", "Fiqh Book", "Fiqh", "Mālikite"))
        db.executemany(
            "INSERT INTO chunks VALUES(?,?,?,?,?)",
            [
                ("chunk-a", "book-fiqh", "Wudu", "باب الوضوء", "wudu ablutions"),
                ("chunk-b", "book-fiqh", "Fasting", "باب الصيام", "fasting"),
                ("chunk-c", "book-fiqh", "Other", "نص آخر", "other text"),
            ],
        )
        db.commit()
    finally:
        db.close()


class SemanticIndexTests(unittest.TestCase):
    def test_build_lookup_and_exact_search(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shard = root / "shard.sqlite"
            out = root / "index"
            create_shard(shard)
            manifest = build_index(
                shard,
                out,
                shard_id="test-001",
                model_name="fake-model",
                batch_size=2,
                model=FakeEmbeddingModel(),
            )
            self.assertEqual(INDEX_VERSION, manifest["version"])
            self.assertTrue(manifest["complete"])
            self.assertEqual(3, manifest["indexed_count"])
            self.assertEqual(3, manifest["dimension"])
            self.assertEqual("float16", manifest["dtype"])

            index = SemanticShardIndex(out / "test-001.semantic.json")
            try:
                vectors = index.get_vectors(["chunk-a", "chunk-c", "missing"])
                self.assertEqual({"chunk-a", "chunk-c"}, set(vectors))
                np.testing.assert_allclose(vectors["chunk-a"], [1.0, 0.0, 0.0], atol=1e-3)
                hits = index.search(np.array([1.0, 0.0, 0.0], dtype=np.float32), top_k=2, block_size=2)
                self.assertEqual(2, len(hits))
                self.assertEqual(0, hits[0][0])
                self.assertGreater(hits[0][1], hits[1][1])
            finally:
                index.close()

    def test_collection_routes_candidate_ids_to_their_shard(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shard = root / "shard.sqlite"
            out = root / "index"
            create_shard(shard)
            build_index(
                shard,
                out,
                shard_id="test-001",
                model_name="fake-model",
                model=FakeEmbeddingModel(),
            )
            collection = SemanticIndexCollection(out, {"book-fiqh": "test-001"})
            try:
                values = collection.get_source_vectors(
                    [
                        {"id": "chunk-a", "book_id": "book-fiqh"},
                        {"id": "chunk-b", "book_id": "book-fiqh"},
                    ]
                )
                self.assertEqual({"chunk-a", "chunk-b"}, set(values))
            finally:
                collection.close()

    def test_resume_validates_the_same_target(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shard = root / "shard.sqlite"
            out = root / "index"
            create_shard(shard)
            first = build_index(
                shard,
                out,
                shard_id="test-001",
                model_name="fake-model",
                max_chunks=2,
                model=FakeEmbeddingModel(),
            )
            second = build_index(
                shard,
                out,
                shard_id="test-001",
                model_name="fake-model",
                max_chunks=2,
                resume=True,
                model=FakeEmbeddingModel(),
            )
            self.assertEqual(2, first["indexed_count"])
            self.assertEqual(first["vectors_sha256"], second["vectors_sha256"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
