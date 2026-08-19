from __future__ import annotations

import json
import tempfile
from pathlib import Path

from corpus_wave2_ingest import build_wave2, load_wave2


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        school = {
            "version": 1,
            "wave": "P3-wave2-applied-scholarly-corpus",
            "madhhab": "Ḥanafite",
            "target_count": 1,
            "targets": [
                {
                    "id": "wave2-test-fatwa",
                    "title": "Fatāwā Test",
                    "title_ar": "فتاوى الاختبار",
                    "author": "Auteur Test",
                    "author_target_id": "hanafi-test",
                    "discipline": "Fiqh appliqué",
                    "subject": "fiqh",
                    "madhhab": "Ḥanafite",
                    "priority": "P3",
                    "required": False,
                    "source_type": "fatwa",
                    "focus_topics": ["salah", "muamalat"],
                    "author_markers": ["AuthorTest"],
                    "title_markers": ["FatawaTest"],
                }
            ],
        }
        (root / "school.json").write_text(json.dumps(school, ensure_ascii=False), encoding="utf-8")
        index = {
            "version": 1,
            "wave": "P3-wave2-applied-scholarly-corpus",
            "release_commit": "abc123",
            "target_count": 1,
            "files": ["school.json"],
        }
        index_path = root / "index.json"
        index_path.write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")
        loaded_index, rows = load_wave2(index_path)
        assert loaded_index["target_count"] == 1 and len(rows) == 1

        header = "\t".join([
            "version_uri", "language", "uncorrected_OCR", "status", "char_length", "local_path",
            "tags", "book", "title_lat", "title_ar", "author_lat", "author_ar", "date", "id",
            "tok_length", "subcorpus",
        ])
        good = "\t".join([
            "0999AuthorTest.FatawaTest.JK0001-ara1", "ara", "False", "pri", "123456", "data/good",
            "PRIMARY_VERSION, CLEANED_VERSION, NO_MAJOR_ISSUES", "0999AuthorTest.FatawaTest", "Fatawa Test",
            "فتاوى الاختبار", "Author Test", "مؤلف الاختبار", "999", "good", "20000", "JK",
        ])
        decoy = "\t".join([
            "0999OtherAuthor.FatawaTest.JK0002-ara1", "ara", "False", "pri", "234567", "data/decoy",
            "PRIMARY_VERSION, CLEANED_VERSION, NO_MAJOR_ISSUES", "0999OtherAuthor.FatawaTest", "Fatawa Test",
            "فتاوى الاختبار", "Other Author", "مؤلف آخر", "999", "decoy", "30000", "JK",
        ])
        policy = {
            "promotion": {"require_primary": True, "require_cleaned": True, "exclude_uncorrected_ocr": True, "excluded_source_markers": []},
            "curation": {"priority_max_source_chars_per_book": 5000000},
        }
        manifest, report, merged = build_wave2(
            "\n".join([header, decoy, good]),
            index_path=index_path,
            policy=policy,
            existing=[],
            priority_manifest={"version": "2.0", "books": []},
        )
        assert report["targets"] == 1
        assert report["resolved_targets"] == 1
        assert report["new_books"] == 1
        assert not report["missing"]
        book = manifest["books"][0]
        assert book["openiti_uri"].endswith("JK0001-ara1")
        assert book["metadata"]["priority"] == "P3"
        assert book["metadata"]["corpus_wave"] == "wave2"
        assert book["metadata"]["source_type"] == "fatwa"
        assert book["metadata"]["author_target_id"] == "hanafi-test"
        assert merged["targets"][-1]["id"] == "wave2-test-fatwa"

        # P3 is optional: a missing target must be reported, not raise.
        manifest2, report2, _ = build_wave2(
            header,
            index_path=index_path,
            policy=policy,
            existing=[],
            priority_manifest={"version": "2.0", "books": []},
        )
        assert not manifest2["books"]
        assert report2["new_books"] == 0
        assert report2["missing"][0]["id"] == "wave2-test-fatwa"

    print("Wave 2 ingestion tests: OK — P3 optional, source type preserved, author+title boundary enforced.")


if __name__ == "__main__":
    main()
