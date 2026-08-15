from __future__ import annotations

from corpus_curator import build_curation


def main() -> None:
    header = "\t".join(["version_uri","book","local_path","status","tags","char_length","tok_length","title_lat","title_ar","author_lat","author_ar","date","id"])
    row = "\t".join(["0123A.Work.JK-ara1","0123A.Work","data/work","pri","PRIMARY_VERSION, CLEANED_VERSION","20000","5000","Titre","عنوان","Ibn Taymiyya","ابن تيمية","728","src1"])
    books = [{"book_id": "book-1", "openiti_uri": "0123A.Work.JK-ara1", "path": "data/work", "title": "Titre", "title_ar": "", "author": "Ibn Taymiyya", "discipline": "Usul al-fiqh", "madhhab": "", "enabled": True, "_manifest": "openiti_books_auto.json", "metadata": {"classification_status": "automatic_title_terms"}}]
    rules = {"author_aliases": {"Ibn Taymiyya": "Ibn Taymiyyah"}, "discipline_aliases": {"Usul al-fiqh": "Uṣūl al-fiqh"}, "title_overrides": {}}
    overlay, report, markdown = build_curation("\n".join([header, row]), books=books, rules=rules)
    curated = overlay["books"]["book-1"]
    assert curated["author"] == "Ibn Taymiyyah"
    assert curated["discipline"] == "Uṣūl al-fiqh"
    assert curated["title_ar"] == "عنوان"
    assert curated["madhhab"] == ""
    assert curated["metadata"]["curation"]["madhhab_status"] == "unresolved"
    assert report["coverage"]["source_metadata_matched"] == 1
    assert "n'invente pas" in markdown
    print("Corpus curator tests: OK")


if __name__ == "__main__":
    main()
