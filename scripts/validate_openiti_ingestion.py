from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"
if str(RAG) not in sys.path:
    sys.path.insert(0, str(RAG))

from core import ensure_database  # noqa: E402
from openiti import ingest_book, parse  # noqa: E402

SAMPLE = """######OpenITI#
#META# 020.BookTITLE :: مثال
#META#Header#End#

### | كتاب الطهارة
# هذا نص عربي تجريبي طويل بما يكفي لاختبار الفهرسة والبحث في الصفحة الأولى.
~~ وهذه تتمة الفقرة نفسها دون أن تضيع بنية النص أو عنوان الباب.
PageV01P002
### || باب الوضوء
# هذا نص الصفحة التالية وفيه حكم آخر للاختبار مع المحافظة على رقم الصفحة والمجلد.
PageV01P003
"""


def main() -> int:
    rows = parse(SAMPLE)
    assert len(rows) == 2, rows
    assert rows[0]["volume"] == 1 and rows[0]["page"] == 2
    assert rows[0]["chapter"] == "كتاب الطهارة"
    assert rows[1]["page"] == 3 and rows[1]["chapter"] == "باب الوضوء"
    assert "~~" not in rows[0]["text"] and "PageV" not in rows[0]["text"]

    manifest = {
        "release_commit": "test-release",
        "source_repository": "https://github.com/OpenITI/RELEASE",
        "license": "CC BY-NC-SA 4.0",
        "license_url": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    }
    book = {
        "book_id": "openiti-test-book",
        "kutub_id": None,
        "title": "Livre test OpenITI",
        "title_ar": "كتاب تجريبي",
        "author": "Auteur test",
        "discipline": "Fiqh",
        "madhhab": "Mālikite",
        "openiti_uri": "0001Test.Book.Test-ara1",
        "path": "data/test/test",
        "quality_status": "PRIMARY_VERSION,CLEANED_VERSION",
        "known_issues": "",
    }
    with tempfile.TemporaryDirectory() as directory:
        db_path = Path(directory) / "openiti.sqlite"
        with ensure_database(db_path) as connection:
            stats = ingest_book(connection, manifest, book, SAMPLE)
            assert stats == {"chunks": 2, "pages": 2}, stats
            chunks = connection.execute(
                "SELECT page, chapter, text_ar, translation_status, metadata_json "
                "FROM chunks WHERE book_id=? ORDER BY page",
                (book["book_id"],),
            ).fetchall()
            assert len(chunks) == 2, len(chunks)
            assert chunks[0]["translation_status"] == "openiti_arabic_source"
            metadata = json.loads(chunks[0]["metadata_json"])
            assert metadata["volume"] == 1 and metadata["printed_page"] == 2
            assert metadata["license"] == "CC BY-NC-SA 4.0"
            assert metadata["openiti_uri"] == "0001Test.Book.Test-ara1"

    configured = json.loads((RAG / "openiti_books.json").read_text(encoding="utf-8"))
    enabled = [book for book in configured["books"] if book.get("enabled", True)]
    assert len(enabled) >= 6
    assert all("PRIMARY_VERSION" in book.get("quality_status", "") for book in enabled)
    assert len({book["openiti_uri"] for book in enabled}) == len(enabled)
    print(f"OpenITI ingestion validated: {len(enabled)} configured primary texts, page-aware parsing and SQLite provenance.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
