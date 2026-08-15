from __future__ import annotations

from corpus_coverage_audit import build_audit, classify_subject, match_reference, school_tags


def sample_books():
    return [
        {
            "book_id": "m1",
            "title": "Al-Muwatta",
            "title_ar": "الموطأ",
            "author": "Malik ibn Anas",
            "discipline": "Hadith et fiqh",
            "madhhab": "Malikite",
            "openiti_uri": "0179MalikIbnAnas.Muwatta.Test-ara1",
            "enabled": True,
        },
        {
            "book_id": "h1",
            "title": "Badai",
            "title_ar": "بدائع الصنائع",
            "author": "Kasani",
            "discipline": "Fiqh",
            "madhhab": "Hanafite",
            "openiti_uri": "0587Kasani.BadaicSanaic.Test-ara1",
            "enabled": True,
        },
        {
            "book_id": "t1",
            "title": "Tafsir",
            "author": "Mufassir",
            "discipline": "Tafsir",
            "madhhab": "",
            "openiti_uri": "0500Mufassir.Tafsir.Test-ara1",
            "metadata": {"classification_status": "automatic_metadata_hint", "classification_subject": "tafsir"},
            "enabled": True,
        },
    ]


def test_subject_and_school_normalization():
    assert classify_subject({"discipline": "Uṣūl al-fiqh"}) == "usul"
    assert classify_subject({"discipline": "Hadith et rijal"}) == "hadith"
    assert school_tags("Mālikite · Comparatif") == ["Mālikite", "Comparatif"]
    assert school_tags("") == ["Non renseigné"]


def test_reference_matching():
    books = sample_books()
    reference = {"match_any": ["MalikIbnAnas Muwatta"]}
    assert match_reference(reference, books)["book_id"] == "m1"
    assert match_reference({"match_any": ["ouvrage absent"]}, books) is None


def test_audit_counts_without_inference():
    books = sample_books()
    checklist = {
        "purpose": "test",
        "works": [
            {"id": "muwatta", "title": "Muwatta", "discipline": "Fiqh", "madhhab": "Mālikite", "priority": "P1", "match_any": ["MalikIbnAnas Muwatta"]},
            {"id": "missing", "title": "Missing", "discipline": "Fiqh", "madhhab": "Ḥanbalite", "priority": "P1", "match_any": ["Missing Work"]},
        ],
    }
    audit = build_audit(books, checklist, {"books": 5, "chunks": 100, "shard_count": 2})
    assert audit["scope"]["audited_openiti_books"] == 3
    assert audit["scope"]["complementary_non_openiti_books_excluded"] == 2
    assert audit["metadata_quality"]["madhhab_unknown_books"] == 1
    assert audit["reference_checklist"]["present"] == 1
    assert audit["reference_checklist"]["missing"] == 1
    assert audit["reference_checklist"]["missing_p1"][0]["id"] == "missing"
    assert audit["fiqh_school_gap"]["counts"]["Mālikite"] == 1
    assert audit["fiqh_school_gap"]["counts"]["Ḥanafite"] == 1
    assert audit["fiqh_school_gap"]["counts"]["Ḥanbalite"] == 0


def main():
    test_subject_and_school_normalization()
    test_reference_matching()
    test_audit_counts_without_inference()
    print("Corpus coverage audit tests: PASS")


if __name__ == "__main__":
    main()
