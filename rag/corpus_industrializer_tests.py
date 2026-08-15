from __future__ import annotations

import unittest

from corpus_industrializer import manifest_book, select_batch, stable_book_id
from openiti_catalog import classify_subject, parse_metadata

HEADER = "\t".join(
    [
        "version_uri", "language", "subcorpus", "uncorrected_OCR", "date", "author_ar", "author_lat",
        "book", "title_ar", "title_lat", "ed_info", "id", "status", "tok_length", "char_length",
        "local_path", "tags", "author_from_uri", "author_lat_shuhra", "author_lat_full_name", "city_ar",
        "city_lat", "institution_ar", "institution_lat", "shelfmark", "catalog_ref", "parts",
    ]
)


def row(
    version: str,
    work: str,
    title_ar: str,
    title_lat: str,
    *,
    status: str = "pri",
    chars: int = 100_000,
    tags: str = "PRIMARY_VERSION :: CLEANED_VERSION",
    ocr: str = "False",
    subcorpus: str = "ara",
    source_id: str = "FIX1",
) -> str:
    values = [
        version, "ara", subcorpus, ocr, "0500", "مؤلف", "Fixture Author", work, title_ar, title_lat, "", source_id,
        status, "20000", str(chars), f"data/fixture/{version}", tags, "Fixture", "", "", "", "", "", "", "", "", "",
    ]
    return "\t".join(values)


class OpenITICatalogTests(unittest.TestCase):
    def fixture(self) -> str:
        return "\n".join(
            [
                HEADER,
                row("0999Fixture.FiqhBook.JK1-ara1", "0999Fixture.FiqhBook", "كتاب الفقه", "Kitab al-Fiqh", chars=120_000),
                row("0999Fixture.HadithBook.JK2-ara1", "0999Fixture.HadithBook", "صحيح الاختبار", "Sahih Fixture", chars=90_000),
                row("0999Fixture.Poetry.JK3-ara1", "0999Fixture.Poetry", "ديوان", "Diwan", chars=80_000),
                row("0999Fixture.OcrFiqh.JK4-ara1", "0999Fixture.OcrFiqh", "فقه ممسوح", "Fiqh OCR", chars=70_000, ocr="True"),
                row("0999Fixture.Secondary.JK5-ara1", "0999Fixture.Secondary", "مسائل الفقه", "Fiqh Secondary", chars=60_000, status="sec"),
                row("0999Fixture.Unclean.JK6-ara1", "0999Fixture.Unclean", "فقه", "Fiqh Unclean", chars=50_000, tags="PRIMARY_VERSION"),
                row(
                    "0999Fixture.ZaydiFiqh.Zaydiyya0001-ara1",
                    "0999Fixture.ZaydiFiqh",
                    "كتاب الفقه",
                    "Kitab al-Fiqh",
                    chars=75_000,
                    subcorpus="Zaydiyya",
                    source_id="Zaydiyya0001",
                ),
            ]
        ) + "\n"

    def test_catalog_filters_for_scholarly_primary_clean_arabic(self) -> None:
        payload = parse_metadata(self.fixture())
        self.assertEqual(payload["candidate_works"], 2)
        subjects = {item["subject"] for item in payload["candidates"]}
        self.assertEqual(subjects, {"fiqh", "hadith"})
        self.assertGreaterEqual(payload["rejected"].get("outside_priority_subjects", 0), 1)
        self.assertGreaterEqual(payload["rejected"].get("uncorrected_ocr", 0), 1)
        self.assertGreaterEqual(payload["rejected"].get("not_primary", 0), 1)
        self.assertGreaterEqual(payload["rejected"].get("not_cleaned", 0), 1)
        self.assertGreaterEqual(payload["rejected"].get("excluded_source:Zaydiyya", 0), 1)

    def test_subject_classification_is_metadata_based(self) -> None:
        key, label, score = classify_subject({"book": "X", "title_ar": "تفسير القرآن", "title_lat": "", "tags": ""})
        self.assertEqual(key, "tafsir")
        self.assertEqual(label, "Tafsīr")
        self.assertGreater(score, 0)

    def test_usul_does_not_match_fusul_medical_commentary(self) -> None:
        key, label, score = classify_subject(
            {
                "book": "0685IbnQuffKaraki.SharhFusulAbuqrat",
                "title_ar": "شرح فصول أبقراط",
                "title_lat": "Sharh Fusul Abuqrat",
                "tags": "PRIMARY_VERSION :: CLEANED_VERSION",
            }
        )
        self.assertEqual((key, label, score), ("", "", 0))

    def test_generic_qawaid_does_not_imply_usul_al_fiqh(self) -> None:
        key, _, _ = classify_subject(
            {
                "book": "0711Wasiti.QawacidFiSuluk",
                "title_ar": "قواعد في السلوك إلى الله تعالى",
                "title_lat": "Qawaid fi al-suluk ila Allah",
                "tags": "PRIMARY_VERSION :: CLEANED_VERSION",
            }
        )
        self.assertNotEqual(key, "usul")

    def test_real_usul_terms_still_match(self) -> None:
        key, label, score = classify_subject(
            {"book": "X", "title_ar": "المستصفى في أصول الفقه", "title_lat": "al-Mustasfa fi Usul al-Fiqh", "tags": ""}
        )
        self.assertEqual(key, "fiqh")
        self.assertTrue(label)
        self.assertGreater(score, 0)

    def test_batch_is_deduplicated_and_budget_bounded(self) -> None:
        payload = parse_metadata(self.fixture())
        selected = select_batch(
            payload,
            {"books": []},
            batch_size=2,
            char_budget=150_000,
            max_auto_books=10,
        )
        self.assertEqual(len(selected), 1)
        self.assertLessEqual(sum(int(item["char_length"]) for item in selected), 150_000)

    def test_manifest_never_invents_madhhab(self) -> None:
        payload = parse_metadata(self.fixture())
        book = manifest_book(payload["candidates"][0], payload["release_ref"])
        self.assertEqual(book["madhhab"], "")
        self.assertEqual(book["metadata"]["classification_status"], "automatic_metadata_hint")
        self.assertEqual(book["metadata"]["source"], "OpenITI")

    def test_book_ids_are_stable(self) -> None:
        uri = "0999Fixture.FiqhBook.JK1-ara1"
        self.assertEqual(stable_book_id(uri), stable_book_id(uri))
        self.assertTrue(stable_book_id(uri).startswith("openiti-auto-"))


if __name__ == "__main__":
    unittest.main()
