from __future__ import annotations

import gzip
import hashlib
import json
import shutil
import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from build_sharded_corpus import (
    CRITICAL_BUILD_FILES,
    SHARD_BUILD_VERSION,
    _build_fingerprint,
    _create_catalog,
    _record_reused_shard,
    _record_shard,
    _reuse_plan,
    _source_signature,
)
from cache_hosted_corpus import cache_sharded_release
from core import initialize_database, upsert_book, upsert_chunk
from v5_library import get_book, read_book
from v5_sharded import ShardedCorpusRuntime


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def make_shard(path: Path, book_id: str, title: str, text_ar: str, text_fr: str) -> dict[str, int]:
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    initialize_database(connection)
    upsert_book(
        connection,
        {
            "id": book_id,
            "title": title,
            "title_ar": "كتاب " + title,
            "author": "Auteur " + title,
            "discipline": "Fiqh",
            "madhhab": "",
            "pages": 2,
            "description": "Fixture sharded",
            "source_url": f"https://example.test/{book_id}",
            "metadata": {"source": "fixture"},
        },
    )
    for index in range(1, 3):
        upsert_chunk(
            connection,
            {
                "id": f"{book_id}-c{index}",
                "book_id": book_id,
                "page": index,
                "chapter": "Kitāb al-safar",
                "text_ar": text_ar + f" {index}",
                "text_fr": text_fr + f" {index}",
                "translation_status": "fixture",
                "source_url": f"https://example.test/{book_id}/{index}",
            },
        )
    connection.commit()
    connection.close()
    return {"books": 1, "chunks": 2, "openiti_books": 0, "substantive_passages": 2}


def gzip_file(source: Path, destination: Path) -> None:
    with source.open("rb") as raw, gzip.open(destination, "wb", compresslevel=6) as compressed:
        shutil.copyfileobj(raw, compressed)


class ShardedRuntimeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.shard_a = self.root / "athar_openiti-001.sqlite"
        self.shard_b = self.root / "athar_openiti-002.sqlite"
        stats_a = make_shard(
            self.shard_a,
            "book-alpha",
            "Livre Alpha",
            "أحكام السفر وقصر الصلاة",
            "Règles du voyage et de la prière raccourcie",
        )
        stats_b = make_shard(
            self.shard_b,
            "book-beta",
            "Livre Beta",
            "مسائل السفر للمسافر",
            "Questions concernant le voyageur",
        )

        self.catalog_path = self.root / "athar_catalog.sqlite"
        catalog = _create_catalog(self.catalog_path)
        try:
            _record_shard(catalog, self.shard_a, "openiti-001", stats_a)
            _record_shard(catalog, self.shard_b, "openiti-002", stats_b)
            for key, value in {
                "storage_mode": "sharded",
                "books": 2,
                "chunks": 4,
                "openiti_books": 0,
                "substantive_passages": 4,
                "shard_count": 2,
            }.items():
                catalog.execute(
                    "INSERT OR REPLACE INTO corpus_meta(key, value) VALUES (?, ?)",
                    (key, str(value)),
                )
            catalog.commit()
        finally:
            catalog.close()

        manifest = {
            "version": 3,
            "storage_mode": "sharded",
            "books": 2,
            "chunks": 4,
            "openiti_books": 0,
            "substantive_passages": 4,
            "shard_count": 2,
            "catalog": {"id": "catalog", "database": self.catalog_path.name},
            "shards": [
                {"id": "openiti-001", "database": self.shard_a.name},
                {"id": "openiti-002", "database": self.shard_b.name},
            ],
            "book_to_shard": {
                "book-alpha": "openiti-001",
                "book-beta": "openiti-002",
            },
        }
        self.manifest_path = self.root / "manifest.json"
        self.manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
        self.runtime = ShardedCorpusRuntime(self.manifest_path, self.root)
        self.runtime.validate()

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_status_and_catalog_are_global(self) -> None:
        status = self.runtime.status()
        self.assertEqual(status["storage_mode"], "sharded")
        self.assertEqual(status["books"], 2)
        self.assertEqual(status["chunks"], 4)
        self.assertEqual(status["shards"], 2)
        books = self.runtime.list_library_books()
        self.assertEqual(len(books), 2)
        self.assertEqual({row["shard_id"] for row in books}, {"openiti-001", "openiti-002"})
        self.assertTrue(all(row["chunks"] == 2 for row in books))

    def test_book_reader_opens_only_routed_shard(self) -> None:
        self.assertEqual(self.runtime.shard_for_book("book-beta"), "openiti-002")
        with self.runtime.book_connection("book-beta") as connection:
            book = get_book(connection, "book-beta")
            page = read_book(connection, "book-beta", page=1, limit=2)
        self.assertEqual(book["title"], "Livre Beta")
        self.assertEqual(len(page["passages"]), 1)
        self.assertIn("السفر", page["passages"][0]["text_ar"])
        with self.assertRaises(LookupError):
            self.runtime.shard_for_book("missing")

    def test_global_search_merges_sources_from_multiple_shards(self) -> None:
        result = self.runtime.search("voyage", limit=4)
        self.assertEqual(result["analysis"]["storage_mode"], "sharded")
        self.assertEqual(result["analysis"]["shard_count"], 2)
        self.assertEqual(set(result["analysis"]["shards_queried"]), {"openiti-001", "openiti-002"})
        self.assertEqual({row["shard_id"] for row in result["sources"]}, {"openiti-001", "openiti-002"})
        self.assertEqual([row["citation_id"] for row in result["sources"]], [f"S{i}" for i in range(1, len(result["sources"]) + 1)])

    def test_named_book_query_routes_to_one_shard(self) -> None:
        result = self.runtime.search("Livre Alpha voyage", limit=3)
        self.assertEqual(result["analysis"]["shards_queried"], ["openiti-001"])
        self.assertEqual(result["analysis"]["routed_book"]["id"], "book-alpha")
        self.assertTrue(all(row["book_id"] == "book-alpha" for row in result["sources"]))

    def test_reused_shard_copies_catalog_rows_without_opening_shard_database(self) -> None:
        destination = self.root / "reused_catalog.sqlite"
        catalog = _create_catalog(destination)
        try:
            stats = _record_reused_shard(
                catalog,
                self.catalog_path,
                "openiti-001",
                ["book-alpha"],
            )
        finally:
            catalog.close()
        self.assertEqual(stats["books"], 1)
        self.assertEqual(stats["chunks"], 2)
        connection = sqlite3.connect(destination)
        try:
            self.assertEqual(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0], 1)
            self.assertEqual(
                connection.execute("SELECT shard_id FROM book_stats WHERE book_id='book-alpha'").fetchone()[0],
                "openiti-001",
            )
        finally:
            connection.close()


class IncrementalShardReuseTests(unittest.TestCase):
    @staticmethod
    def source_manifest(path: str = "data/book-a.completed") -> dict[str, object]:
        return {
            "release_commit": "release-123",
            "source_repository": "https://github.com/OpenITI/RELEASE",
            "books": [
                {
                    "book_id": "book-a",
                    "title": "Book A",
                    "openiti_uri": "0100Author.BookA.Source-ara1",
                    "path": path,
                    "quality_status": "PRIMARY_VERSION,CLEANED_VERSION",
                    "enabled": True,
                }
            ],
        }

    @staticmethod
    def registry() -> dict[str, object]:
        return {
            "shards": [
                {
                    "id": "openiti-001",
                    "books": [{"book_id": "book-a"}],
                }
            ],
            "book_to_shard": {"book-a": "openiti-001"},
        }

    def test_real_build_fingerprint_references_existing_files(self) -> None:
        fingerprint = _build_fingerprint()
        self.assertEqual(set(fingerprint), set(CRITICAL_BUILD_FILES))
        self.assertTrue(all(len(value) == 64 for value in fingerprint.values()))

    def test_source_signature_is_stable_but_changes_with_source_identity(self) -> None:
        fingerprint = {"rag/openiti.py": "abc"}
        first = _source_signature(self.source_manifest(), ["book-a"], build_fingerprint=fingerprint)
        second = _source_signature(self.source_manifest(), ["book-a", "book-a"], build_fingerprint=fingerprint)
        changed = _source_signature(
            self.source_manifest("data/book-a-other.completed"),
            ["book-a"],
            build_fingerprint=fingerprint,
        )
        self.assertEqual(first, second)
        self.assertNotEqual(first, changed)

    def test_signed_previous_shard_is_reused_only_when_signature_and_membership_match(self) -> None:
        fingerprint = {"critical": "same"}
        signature = _source_signature(self.source_manifest(), ["book-a"], build_fingerprint=fingerprint)
        previous = {
            "storage_mode": "sharded",
            "source_sha": "previous",
            "book_to_shard": {"book-a": "openiti-001"},
            "shards": [
                {
                    "id": "openiti-001",
                    "source_signature": signature,
                    "shard_build_version": SHARD_BUILD_VERSION,
                }
            ],
        }
        with patch("build_sharded_corpus._build_fingerprint", return_value=fingerprint):
            reusable, signatures = _reuse_plan(self.registry(), self.source_manifest(), previous)
        self.assertIn("openiti-001", reusable)
        self.assertEqual(signatures["openiti-001"], signature)

        changed_manifest = self.source_manifest("data/changed.completed")
        with patch("build_sharded_corpus._build_fingerprint", return_value=fingerprint):
            changed_reusable, _ = _reuse_plan(self.registry(), changed_manifest, previous)
        self.assertNotIn("openiti-001", changed_reusable)

        previous["book_to_shard"] = {"book-a": "openiti-002"}
        with patch("build_sharded_corpus._build_fingerprint", return_value=fingerprint):
            rerouted, _ = _reuse_plan(self.registry(), self.source_manifest(), previous)
        self.assertNotIn("openiti-001", rerouted)

    def test_legacy_release_is_reused_only_after_historical_signature_proof(self) -> None:
        fingerprint = {"critical": "same"}
        previous = {
            "storage_mode": "sharded",
            "source_sha": "previous-sha",
            "book_to_shard": {"book-a": "openiti-001"},
            "shards": [{"id": "openiti-001"}],
        }
        with (
            patch("build_sharded_corpus._build_fingerprint", return_value=fingerprint),
            patch("build_sharded_corpus._load_shardable_manifest_at_ref", return_value=self.source_manifest()),
        ):
            reusable, _ = _reuse_plan(self.registry(), self.source_manifest(), previous)
        self.assertIn("openiti-001", reusable)

        historical_changed = self.source_manifest("data/old-version.completed")
        with (
            patch("build_sharded_corpus._build_fingerprint", return_value=fingerprint),
            patch("build_sharded_corpus._load_shardable_manifest_at_ref", return_value=historical_changed),
        ):
            rejected, _ = _reuse_plan(self.registry(), self.source_manifest(), previous)
        self.assertNotIn("openiti-001", rejected)


class ShardedCacheTests(unittest.TestCase):
    def test_cache_materializes_catalog_and_multiple_shards(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source_dir = root / "source"
            output_dir = root / "runtime"
            source_dir.mkdir()
            files: dict[str, Path] = {}
            entries: list[dict[str, object]] = []
            for name in ("athar_catalog.sqlite", "athar_openiti-001.sqlite", "athar_openiti-002.sqlite"):
                raw = source_dir / name
                connection = sqlite3.connect(raw)
                connection.execute("CREATE TABLE fixture(value TEXT)")
                connection.execute("INSERT INTO fixture VALUES ('athar')")
                connection.commit()
                connection.close()
                asset = source_dir / f"{name}.gz"
                gzip_file(raw, asset)
                url = f"fixture://{asset.name}"
                files[url] = asset
                entries.append(
                    {
                        "id": "catalog" if name == "athar_catalog.sqlite" else name.removeprefix("athar_").removesuffix(".sqlite"),
                        "database": name,
                        "asset": asset.name,
                        "url": url,
                        "compression": "gzip",
                        "sha256": sha256(asset),
                        "size_bytes": asset.stat().st_size,
                        "database_sha256": sha256(raw),
                        "database_size_bytes": raw.stat().st_size,
                    }
                )

            manifest = {
                "version": 3,
                "storage_mode": "sharded",
                "books": 2,
                "chunks": 4,
                "openiti_books": 2,
                "catalog": entries[0],
                "shards": entries[1:],
            }

            def fake_download(url: str, destination: Path, expected_sha256: str = "", attempts: int = 3):
                source = files[url]
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, destination)
                actual = sha256(destination)
                if expected_sha256 and actual != expected_sha256:
                    raise RuntimeError("fixture SHA mismatch")
                return {"bytes": destination.stat().st_size, "sha256": actual, "url": url}

            with patch("cache_hosted_corpus.download_release", side_effect=fake_download):
                result = cache_sharded_release(output_dir, manifest)
            self.assertEqual(result["storage_mode"], "sharded")
            self.assertEqual(result["shards"], 2)
            self.assertEqual(len(result["files"]), 3)
            for entry in entries:
                raw = output_dir / str(entry["database"])
                self.assertTrue(raw.exists())
                self.assertEqual(sha256(raw), entry["database_sha256"])


if __name__ == "__main__":
    unittest.main()
