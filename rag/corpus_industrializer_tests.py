from __future__ import annotations

import unittest

from corpus_industrializer import (
    discipline_override,
    existing_auto_rejection,
    manifest_book,
    prune_existing_auto_books,
    select_batch,
    stable_book_id,
)
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


def staged_book(
    book_id: str,
    uri: str,
    work_uri: str,
    *,
    title: str = "Livre",
    source_id: str = "Fixture",
) -> dict[str, object]:
    return {
        "book_id": book_id,
        "title": title,
        "title_ar": "كتاب",
        "author": "Auteur",
        "discipline": "Fiqh",
        "madhhab": "",
        "openiti_uri": uri,
        "work_uri": work_uri,
        "path": f"data/fixture/{uri}",
        "enabled": True,
        "metadata": {
            "source": "OpenITI",
            "source_id": source_id,
            "classification_subject": "fiqh",
            "classification_status": "automatic_metadata_hint",
        },
    }


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

    def test_reviewed_discipline_override_reclassifies_staged_book_without_madhhab(self) -> None:
        promotion = {
            "excluded_source_markers": [],
            "excluded_work_markers": [],
            "discipline_overrides": {
                "Nasai.FadailSahaba": {
                    "subject": "hadith",
                    "discipline": "Hadith",
                    "reason": "Reviewed hadith collection",
                }
            },
        }
        staged = staged_book(
            "nasai",
            "0303Nasai.FadailSahaba.JK000747-ara1",
            "0303Nasai.FadailSahaba",
        )
        normalized, detail = discipline_override(staged, promotion)
        self.assertEqual(normalized["discipline"], "Hadith")
        self.assertEqual(normalized["metadata"]["classification_subject"], "hadith")
        self.assertEqual(normalized["metadata"]["classification_status"], "reviewed_policy_override")
        self.assertEqual(normalized["madhhab"], "")
        self.assertEqual(detail["from"], "Fiqh")
        self.assertEqual(detail["to"], "Hadith")

    def test_prune_rewrites_kept_book_with_reviewed_discipline_override(self) -> None:
        promotion = {
            "excluded_source_markers": [],
            "excluded_work_markers": [],
            "discipline_overrides": {
                "AbuDharrSibtIbnCajami.KunuzDhahab": {
                    "subject": "sira",
                    "discipline": "Sīra et histoire",
                    "reason": "Reviewed historical chronicle",
                }
            },
        }
        staged = staged_book(
            "kunuz",
            "0884AbuDharrSibtIbnCajami.KunuzDhahab.Shamela0011786-ara1",
            "0884AbuDharrSibtIbnCajami.KunuzDhahab",
        )
        kept, removed = prune_existing_auto_books([staged], promotion)
        self.assertEqual(removed, [])
        self.assertEqual(kept[0]["discipline"], "Sīra et histoire")
        self.assertEqual(kept[0]["metadata"]["classification_subject"], "sira")

    def test_candidate_override_is_preserved_when_manifest_is_created(self) -> None:
        promotion = {
            "discipline_overrides": {
                "Nasai.FadailSahaba": {
                    "subject": "hadith",
                    "discipline": "Hadith",
                    "reason": "Reviewed hadith collection",
                }
            }
        }
        candidate = {
            "version_uri": "0303Nasai.FadailSahaba.JK000747-ara1",
            "work_uri": "0303Nasai.FadailSahaba",
            "path": "data/nasai",
            "title": "Fadail Sahaba",
            "title_ar": "فضائل الصحابة",
            "author": "Nasai",
            "discipline": "Fiqh",
            "subject": "fiqh",
            "char_length": 100000,
            "token_length": 20000,
            "quality_flags": ["PRIMARY_VERSION", "CLEANED_VERSION"],
        }
        normalized, _ = discipline_override(candidate, promotion)
        book = manifest_book(normalized, "release")
        self.assertEqual(book["discipline"], "Hadith")
        self.assertEqual(book["metadata"]["classification_subject"], "hadith")
        self.assertEqual(book["metadata"]["classification_status"], "reviewed_policy_override")
        self.assertEqual(book["madhhab"], "")

    def test_staged_shia_and_ibadiyya_sources_are_pruned_after_policy_hardening(self) -> None:
        promotion = {
            "excluded_source_markers": ["Zaydiyya", "Shia", "Ibadiyya"],
            "excluded_work_markers": [],
        }
        shia = staged_book(
            "shia",
            "0726CallamaHilli.QawacidAhkam.Shia000091Vols-ara1",
            "0726CallamaHilli.QawacidAhkam",
        )
        ibadi = staged_book(
            "ibadi",
            "1361SacidIbnNasirGhaythi.IdahTawhid.ShamIbadiyya0000279-ara1",
            "1361SacidIbnNasirGhaythi.IdahTawhid",
        )
        self.assertEqual(existing_auto_rejection(shia, promotion), "excluded_source:Shia")
        self.assertEqual(existing_auto_rejection(ibadi, promotion), "excluded_source:Ibadiyya")

    def test_staged_modern_work_marker_is_pruned(self) -> None:
        promotion = {
            "excluded_source_markers": [],
            "excluded_work_markers": ["HasanHanafi.MinCaqidaIlaThawra"],
        }
        row = staged_book(
            "modern",
            "1443HasanHanafi.MinCaqidaIlaThawraTawhid.Hindawi028173195-ara1",
            "1443HasanHanafi.MinCaqidaIlaThawraTawhid",
        )
        self.assertTrue(existing_auto_rejection(row, promotion).startswith("excluded_work:"))

    def test_policy_hardening_keeps_ordinary_staged_book_and_reports_removed_rows(self) -> None:
        promotion = {
            "excluded_source_markers": ["Zaydiyya", "Shia", "Ibadiyya"],
            "excluded_work_markers": ["HasanHanafi.MinCaqidaIlaThawra"],
        }
        ordinary = staged_book(
            "ordinary",
            "0189MuhammadShaybani.Asl.Sham19Y0014285-ara1",
            "0189MuhammadShaybani.Asl",
        )
        blocked = staged_book(
            "blocked",
            "0726CallamaHilli.QawacidAhkam.Shia000091Vols-ara1",
            "0726CallamaHilli.QawacidAhkam",
        )
        kept, removed = prune_existing_auto_books([ordinary, blocked], promotion)
        self.assertEqual([row["book_id"] for row in kept], ["ordinary"])
        self.assertEqual(len(removed), 1)
        self.assertEqual(removed[0]["book_id"], "blocked")
        self.assertEqual(removed[0]["reason"], "excluded_source:Shia")


if __name__ == "__main__":
    unittest.main()
