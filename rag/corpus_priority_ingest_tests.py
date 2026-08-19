from __future__ import annotations

from corpus_priority_ingest import build_priority_manifest, marker_key, target_matches


def main() -> None:
    targets = {
        "release_commit": "abc123",
        "targets": [
            {
                "id": "hanafi-test",
                "title": "Livre prioritaire",
                "title_ar": "كتاب",
                "author": "Auteur",
                "discipline": "Fiqh",
                "subject": "fiqh",
                "madhhab": "Ḥanafite",
                "priority": "P1",
                "work_markers": ["0123Author.Work"],
            },
            {
                "id": "hanafi-jassas-test",
                "title": "Aḥkām al-Qurʾān",
                "title_ar": "أحكام القرآن",
                "author": "Abū Bakr al-Jaṣṣāṣ",
                "discipline": "Tafsīr et fiqh",
                "subject": "tafsir",
                "madhhab": "Ḥanafite",
                "priority": "P2",
                "required": False,
                "author_markers": ["Jassas", "الجصاص"],
                "title_markers": ["AhkamQuran", "أحكام القرآن"],
            },
            {
                "id": "optional-missing",
                "title": "Texte non numérisé",
                "author": "Auteur absent",
                "discipline": "Fiqh",
                "subject": "fiqh",
                "madhhab": "Shāfiʿite",
                "priority": "P2",
                "required": False,
                "author_markers": ["AuteurAbsent"],
                "title_markers": ["TexteAbsent"],
            },
        ],
    }
    policy = {
        "promotion": {
            "require_primary": True,
            "require_cleaned": True,
            "exclude_uncorrected_ocr": True,
            "excluded_source_markers": ["Shia"],
        },
        "curation": {"priority_max_source_chars_per_book": 5000000},
    }
    header = "\t".join(
        [
            "version_uri",
            "language",
            "uncorrected_OCR",
            "status",
            "char_length",
            "local_path",
            "tags",
            "book",
            "title_lat",
            "title_ar",
            "author_lat",
            "author_ar",
            "date",
            "id",
            "tok_length",
            "subcorpus",
        ]
    )
    blocked = "\t".join(
        [
            "0123Author.Work.Shia0001-ara1",
            "ara",
            "False",
            "pri",
            "200000",
            "data/bad",
            "PRIMARY_VERSION, CLEANED_VERSION",
            "0123Author.Work",
            "Bad",
            "كتاب",
            "Auteur",
            "المؤلف",
            "123",
            "bad",
            "1000",
            "Shia",
        ]
    )
    good = "\t".join(
        [
            "0123Author.Work.JK0001-ara1",
            "ara",
            "False",
            "pri",
            "180000",
            "data/good",
            "PRIMARY_VERSION, CLEANED_VERSION, NO_MAJOR_ISSUES",
            "0123Author.Work",
            "Good",
            "كتاب",
            "Auteur",
            "المؤلف",
            "123",
            "good",
            "900",
            "JK",
        ]
    )
    decoy = "\t".join(
        [
            "0370OtherAuthor.AhkamQuran.JK0002-ara1",
            "ara",
            "False",
            "pri",
            "220000",
            "data/decoy",
            "PRIMARY_VERSION, CLEANED_VERSION, NO_MAJOR_ISSUES",
            "0370OtherAuthor.AhkamQuran",
            "Ahkam al-Quran",
            "أحكام القرآن",
            "Other Author",
            "مؤلف آخر",
            "370",
            "decoy",
            "1200",
            "JK",
        ]
    )
    jassas = "\t".join(
        [
            "0370IbnCaliJassas.AhkamQuran.JK0003-ara1",
            "ara",
            "False",
            "pri",
            "280000",
            "data/jassas",
            "PRIMARY_VERSION, CLEANED_VERSION, NO_MAJOR_ISSUES",
            "0370IbnCaliJassas.AhkamQuran",
            "Ahkam al-Quran",
            "أحكام القرآن",
            "Abu Bakr al-Jassas",
            "أبو بكر الجصاص",
            "370",
            "jassas",
            "1500",
            "JK",
        ]
    )

    manifest, report = build_priority_manifest(
        "\n".join([header, blocked, good, decoy, jassas]),
        targets_payload=targets,
        policy=policy,
        existing_books=[],
    )
    assert len(manifest["books"]) == 2
    p1 = next(book for book in manifest["books"] if book["book_id"] == "openiti-priority-hanafi-test")
    p2 = next(book for book in manifest["books"] if book["book_id"] == "openiti-priority-hanafi-jassas-test")
    assert p1["madhhab"] == "Ḥanafite"
    assert p1["openiti_uri"].endswith("JK0001-ara1")
    assert p2["openiti_uri"].endswith("JK0003-ara1")
    assert p2["metadata"]["priority"] == "P2"
    assert report["resolved"] == 1
    assert report["resolved_total"] == 2
    assert report["optional_selected"] == 1
    assert len(report["optional_missing"]) == 1
    assert report["optional_missing"][0]["id"] == "optional-missing"
    assert not report["missing"]

    assert marker_key("Al-Jaṣṣāṣ") == marker_key("Al-Jassas")
    assert target_matches(
        targets["targets"][1],
        "0370IbnCaliJassas.AhkamQuran",
        "0370IbnCaliJassas.AhkamQuran.JK-ara1",
        title="Aḥkām al-Qurʾān",
        author="Abū Bakr al-Jaṣṣāṣ",
    )
    assert not target_matches(
        targets["targets"][1],
        "0370OtherAuthor.AhkamQuran",
        "0370OtherAuthor.AhkamQuran.JK-ara1",
        title="Aḥkām al-Qurʾān",
        author="Other Author",
    )

    # Regression: an author's name inside another author's work title must not
    # count as author evidence. This was caught by the real OpenITI PR gate.
    tahawi_target = {
        "author_markers": ["Tahawi", "الطحاوي"],
        "title_markers": ["MukhtasarTahawi", "مختصر الطحاوي"],
    }
    assert not target_matches(
        tahawi_target,
        "0370IbnCaliJassas.SharhMukhtasarTahawi",
        "0370IbnCaliJassas.SharhMukhtasarTahawi.Sham-ara1",
        title="Sharh Mukhtasar al-Tahawi",
        author="Abu Bakr al-Jassas",
    )
    print("Priority ingestion tests: OK — P1 required, P2 optional, author and title boundaries enforced.")


if __name__ == "__main__":
    main()
