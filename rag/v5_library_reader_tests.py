from __future__ import annotations

import sqlite3

from core import initialize_database, upsert_book, upsert_chunk
from v5_library import get_book, get_toc, read_book


def main() -> None:
    connection = sqlite3.connect(":memory:")
    connection.row_factory = sqlite3.Row
    initialize_database(connection)
    upsert_book(connection, {"id": "book-1", "title": "Livre", "title_ar": "كتاب", "author": "Auteur", "discipline": "Fiqh", "madhhab": "", "source_url": "https://example.test/source", "metadata": {"curation": {"phase": "quality-first-v1", "madhhab_status": "unresolved", "text_cleanup_version": "athar-openiti-reader-v2"}}})
    for index, (page, chapter, level, path, text) in enumerate([(1, "كتاب الطهارة", 1, ["كتاب الطهارة"], "النص الأول"), (1, "باب المياه", 2, ["كتاب الطهارة", "باب المياه"], "النص الثاني"), (2, "باب المياه", 2, ["كتاب الطهارة", "باب المياه"], "النص الثالث")], start=1):
        upsert_chunk(connection, {"id": f"c{index}", "book_id": "book-1", "page": page, "chapter": chapter, "text_ar": text, "translation_status": "openiti_arabic_source", "source_url": "https://example.test/source", "metadata": {"section_title": chapter, "section_level": level, "section_path": path, "volume": 1, "reader_parser_version": "athar-openiti-reader-v2"}})
    connection.commit()
    book = get_book(connection, "book-1")
    assert book["curation"]["phase"] == "quality-first-v1"
    toc = get_toc(connection, "book-1")
    assert toc["items"][0]["level"] == 1
    assert toc["items"][1]["path"] == ["كتاب الطهارة", "باب المياه"]
    payload = read_book(connection, "book-1", limit=3)
    assert payload["reader_mode"] == "structured-book-v2"
    assert len(payload["reader_pages"]) == 2
    assert payload["reader_pages"][0]["sections"][1]["title"] == "باب المياه"
    assert payload["passages"][1]["section_level"] == 2
    connection.close()
    print("V5 structured reader tests: OK")


if __name__ == "__main__":
    main()
