from __future__ import annotations

from corpus_curator import build_curation


def main() -> None:
    header = "\t".join(
        [
            "version_uri",
            "book",
            "local_path",
            "status",
            "tags",
            "char_length",
            "tok_length",
            "title_lat",
            "title_ar",
            "author_lat",
            "author_ar",
            "date",
            "id",
        ]
    )
    row_unknown = "\t".join(
        [
            "0123A.Work.JK-ara1",
            "0123A.Work",
            "data/work",
            "pri",
            "PRIMARY_VERSION, CLEANED_VERSION",
            "20000",
            "5000",
            "Titre",
            "عنوان",
            "Ibn Taymiyya",
            "ابن تيمية",
            "728",
            "src1",
        ]
    )
    row_jassas = "\t".join(
        [
            "0370IbnCaliJassas.AhkamQuran.JK-ara1",
            "0370IbnCaliJassas.AhkamQuran",
            "data/jassas",
            "pri",
            "PRIMARY_VERSION, CLEANED_VERSION",
            "25000",
            "6000",
            "Ahkam al-Quran",
            "أحكام القرآن",
            "Abu Bakr al-Jassas",
            "أبو بكر الجصاص",
            "370",
            "src2",
        ]
    )
    books = [
        {
            "book_id": "book-1",
            "openiti_uri": "0123A.Work.JK-ara1",
            "path": "data/work",
            "title": "Titre",
            "title_ar": "",
            "author": "Ibn Taymiyya",
            "discipline": "Usul al-fiqh",
            "madhhab": "",
            "enabled": True,
            "_manifest": "openiti_books_auto.json",
            "metadata": {"classification_status": "automatic_title_terms"},
        },
        {
            "book_id": "book-2",
            "openiti_uri": "0370IbnCaliJassas.AhkamQuran.JK-ara1",
            "work_uri": "0370IbnCaliJassas.AhkamQuran",
            "path": "data/jassas",
            "title": "Ahkam al-Quran",
            "title_ar": "",
            "author": "Abu Bakr al-Jassas",
            "discipline": "",
            "madhhab": "",
            "enabled": True,
            "_manifest": "openiti_books_auto.json",
            "metadata": {"classification_status": "automatic_title_terms"},
        },
    ]
    rules = {
        "author_aliases": {"Ibn Taymiyya": "Ibn Taymiyyah"},
        "discipline_aliases": {"Usul al-fiqh": "Uṣūl al-fiqh"},
        "title_overrides": {},
    }
    targets = {
        "targets": [
            {
                "id": "hanafi-jassas",
                "title": "Aḥkām al-Qurʾān",
                "author": "Abū Bakr al-Jaṣṣāṣ",
                "discipline": "Tafsīr et fiqh",
                "madhhab": "Ḥanafite",
                "priority": "P2",
                "author_markers": ["Jassas", "الجصاص"],
                "title_markers": ["AhkamQuran", "أحكام القرآن"],
            }
        ]
    }

    overlay, report, markdown = build_curation(
        "\n".join([header, row_unknown, row_jassas]),
        books=books,
        rules=rules,
        targets_payload=targets,
    )
    unknown = overlay["books"]["book-1"]
    assert unknown["author"] == "Ibn Taymiyyah"
    assert unknown["discipline"] == "Uṣūl al-fiqh"
    assert unknown["title_ar"] == "عنوان"
    assert unknown["madhhab"] == ""
    assert unknown["metadata"]["curation"]["madhhab_status"] == "unresolved"

    jassas = overlay["books"]["book-2"]
    assert jassas["madhhab"] == "Ḥanafite"
    assert jassas["discipline"] == "Tafsīr et fiqh"
    assert jassas["metadata"]["curation"]["madhhab_status"] == "reviewed_priority_target"
    assert jassas["metadata"]["curation"]["madhhab_reference_id"] == "hanafi-jassas"

    assert report["coverage"]["source_metadata_matched"] == 2
    assert report["coverage"]["madhhab_from_priority_target"] == 1
    assert "n'invente pas" in markdown
    print("Corpus curator tests: OK — unresolved stays unresolved; reviewed author+title can restore madhhab.")


if __name__ == "__main__":
    main()
