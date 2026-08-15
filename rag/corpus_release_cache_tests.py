from __future__ import annotations

import gzip
import hashlib
import tempfile
import unittest
from pathlib import Path

from cache_hosted_corpus import _decompress_gzip, _reuse_matches, _valid_sqlite
from fetch_hosted_corpus import materialize_gzip, validate_release_fingerprint

SQLITE_FIXTURE = b"SQLite format 3\x00" + b"athar-corpus-test" * 64


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class CorpusReleaseCacheTests(unittest.TestCase):
    def test_gzip_is_materialized_as_raw_sqlite(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            asset = root / "corpus.sqlite.gz"
            output = root / "runtime.sqlite.gz"
            with gzip.open(asset, "wb") as handle:
                handle.write(SQLITE_FIXTURE)
            _decompress_gzip(asset, output)
            self.assertTrue(_valid_sqlite(output))
            self.assertEqual(output.read_bytes(), SQLITE_FIXTURE)

    def test_general_fetcher_materializes_and_checks_database_fingerprint(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            asset = root / "corpus.sqlite.gz"
            output = root / "runtime.sqlite"
            with gzip.open(asset, "wb") as handle:
                handle.write(SQLITE_FIXTURE)
            materialize_gzip(asset, output)
            validate_release_fingerprint(
                output,
                {
                    "database_size_bytes": len(SQLITE_FIXTURE),
                    "database_sha256": digest(SQLITE_FIXTURE),
                },
            )
            self.assertEqual(output.read_bytes(), SQLITE_FIXTURE)

    def test_reuse_checks_raw_database_fingerprint_for_gzip_release(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / "runtime.sqlite.gz"
            output.write_bytes(SQLITE_FIXTURE)
            manifest = {
                "compression": "gzip",
                "database_size_bytes": len(SQLITE_FIXTURE),
                "database_sha256": digest(SQLITE_FIXTURE),
                "sha256": "compressed-asset-hash-is-different",
            }
            self.assertTrue(_reuse_matches(output, manifest))
            output.write_bytes(SQLITE_FIXTURE + b"changed")
            self.assertFalse(_reuse_matches(output, manifest))

    def test_raw_release_remains_backward_compatible(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / "runtime.sqlite.gz"
            output.write_bytes(SQLITE_FIXTURE)
            manifest = {
                "compression": "none",
                "size_bytes": len(SQLITE_FIXTURE),
                "sha256": digest(SQLITE_FIXTURE),
            }
            self.assertTrue(_reuse_matches(output, manifest))

    def test_invalid_decompressed_payload_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            asset = root / "bad.gz"
            output = root / "bad.sqlite"
            with gzip.open(asset, "wb") as handle:
                handle.write(b"not sqlite")
            with self.assertRaises(RuntimeError):
                _decompress_gzip(asset, output)
            self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()
