from __future__ import annotations

from ingest_openiti import apply_source_text_policy
from openiti import READER_PARSER_VERSION, clean, parse, split_text


def main() -> None:
    dirty = "حديث 123 <b>نص</b> [ص: 12] | | ms45 سنة 1445 ورقم ١٢٣"
    cleaned = clean(dirty)
    assert "<b>" not in cleaned
    assert "[ص: 12]" not in cleaned
    assert "ms45" not in cleaned
    assert "حديث 123" in cleaned
    assert "سنة 1445" in cleaned
    assert "١٢٣" in cleaned

    sample = """######OpenITI#
#META#Header#End#
### | كتاب الطهارة
~~هذا حديث 123 وفيه رقم ١٢٣ <i>زائد</i> [ص: 77].
PageV01P001
### || باب المياه
~~النص الثاني 456.
PageV01P002
"""
    rows = parse(sample)
    assert rows
    assert rows[0]["page"] == 1
    assert rows[0]["chapter"] == "كتاب الطهارة"
    assert rows[0]["section_level"] == 1
    assert rows[0]["section_path"] == ["كتاب الطهارة"]
    second = next(row for row in rows if row["chapter"] == "باب المياه")
    assert second["section_level"] == 2
    assert second["section_path"] == ["كتاب الطهارة", "باب المياه"]
    assert "456" in second["text"]
    assert all("PageV" not in row["text"] and "###" not in row["text"] for row in rows)

    text = "أ" * 900 + ". " + "ب" * 900 + ". " + "ج" * 900
    chunks = split_text(text, size=1000, overlap=220)
    assert len(chunks) >= 3
    joined = "".join(chunk.replace(" ", "") for chunk in chunks)
    source = clean(text).replace(" ", "")
    assert joined == source

    classical = "######OpenITI#\n#META#Header#End#\n" + ("نص المؤلف " * 200)
    editorial_marker = "قد رأيت أن الحق بهذه الرسالة التي هي في البدع سؤالين هامين"
    contaminated = classical + "\n" + editorial_marker + "\n" + ("فتوى حديثة " * 200)
    sliced = apply_source_text_policy(
        {
            "book_id": "openiti-abu-shama-baith-test",
            "source_text_end_before": editorial_marker,
        },
        contaminated,
    )
    assert editorial_marker not in sliced
    assert "فتوى حديثة" not in sliced
    assert "نص المؤلف" in sliced
    try:
        apply_source_text_policy(
            {"book_id": "missing-boundary", "source_text_end_before": "علامة غير موجودة"},
            contaminated,
        )
    except RuntimeError:
        pass
    else:
        raise AssertionError("A missing reviewed boundary must fail closed.")

    assert READER_PARSER_VERSION == "athar-openiti-reader-v2"
    print("OpenITI reader cleanup tests: OK — editorial source boundaries fail closed.")


if __name__ == "__main__":
    main()
