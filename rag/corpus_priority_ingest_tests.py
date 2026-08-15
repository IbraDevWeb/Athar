from __future__ import annotations

from corpus_priority_ingest import build_priority_manifest


def main() -> None:
    targets = {
        "release_commit": "abc123",
        "targets": [{"id": "hanafi-test", "title": "Livre prioritaire", "title_ar": "كتاب", "author": "Auteur", "discipline": "Fiqh", "subject": "fiqh", "madhhab": "Ḥanafite", "priority": "P1", "work_markers": ["0123Author.Work"]}],
    }
    policy = {
        "promotion": {"require_primary": True, "require_cleaned": True, "exclude_uncorrected_ocr": True, "excluded_source_markers": ["Shia"]},
        "curation": {"priority_max_source_chars_per_book": 5000000},
    }
    header = "\t".join(["version_uri","language","uncorrected_OCR","status","char_length","local_path","tags","book","title_lat","title_ar","author_lat","author_ar","date","id","tok_length","subcorpus"])
    blocked = "\t".join(["0123Author.Work.Shia0001-ara1","ara","False","pri","200000","data/bad","PRIMARY_VERSION, CLEANED_VERSION","0123Author.Work","Bad","كتاب","Auteur","المؤلف","123","bad","1000","Shia"])
    good = "\t".join(["0123Author.Work.JK0001-ara1","ara","False","pri","180000","data/good","PRIMARY_VERSION, CLEANED_VERSION, NO_MAJOR_ISSUES","0123Author.Work","Good","كتاب","Auteur","المؤلف","123","good","900","JK"])
    manifest, report = build_priority_manifest("\n".join([header, blocked, good]), targets_payload=targets, policy=policy, existing_books=[])
    assert len(manifest["books"]) == 1
    book = manifest["books"][0]
    assert book["madhhab"] == "Ḥanafite"
    assert book["openiti_uri"].endswith("JK0001-ara1")
    assert book["metadata"]["classification_status"] == "reviewed_reference_checklist"
    assert report["resolved"] == 1
    print("Priority ingestion tests: OK")


if __name__ == "__main__":
    main()
