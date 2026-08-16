from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from v63_semantic_index import INDEX_VERSION
from v63_semantic_release import build_release


class SemanticReleaseTests(unittest.TestCase):
    def write_json(self, path: Path, payload) -> None:
        path.write_text(json.dumps(payload), encoding="utf-8")

    def semantic_entry(self, shard_id: str, sha: str, chunks: int) -> dict:
        return {
            "version": INDEX_VERSION,
            "shard_id": shard_id,
            "source_database_sha256": sha,
            "model": "fake-model",
            "dimension": 3,
            "dtype": "float16",
            "normalized": True,
            "target_count": chunks,
            "indexed_count": chunks,
            "complete": True,
            "max_chunks": 0,
            "vectors_size_bytes": chunks * 6,
            "metadata_size_bytes": chunks * 10,
        }

    def test_release_requires_all_exact_corpus_shards(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            corpus = {
                "version": 3,
                "source_sha": "corpus-sha",
                "chunks": 5,
                "shards": [
                    {"id": "s1", "database_sha256": "sha1", "chunks": 2},
                    {"id": "s2", "database_sha256": "sha2", "chunks": 3},
                ],
            }
            corpus_path = root / "corpus.json"
            self.write_json(corpus_path, corpus)
            self.write_json(root / "s1.semantic.json", self.semantic_entry("s1", "sha1", 2))
            self.write_json(root / "s2.semantic.json", self.semantic_entry("s2", "sha2", 3))
            release = build_release(corpus_path, root)
            self.assertEqual(5, release["corpus_chunks"])
            self.assertEqual(2, release["shard_count"])
            self.assertEqual(30, release["vector_bytes"])
            self.assertEqual("fake-model", release["model"])

    def test_release_rejects_source_sha_mismatch(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            corpus = {
                "version": 3,
                "source_sha": "corpus-sha",
                "chunks": 2,
                "shards": [{"id": "s1", "database_sha256": "sha1", "chunks": 2}],
            }
            corpus_path = root / "corpus.json"
            self.write_json(corpus_path, corpus)
            self.write_json(root / "s1.semantic.json", self.semantic_entry("s1", "wrong", 2))
            with self.assertRaisesRegex(RuntimeError, "SHA"):
                build_release(corpus_path, root)


if __name__ == "__main__":
    unittest.main(verbosity=2)
