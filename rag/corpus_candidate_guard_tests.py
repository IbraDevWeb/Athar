from __future__ import annotations

import unittest

from corpus_candidate_guard import guard_candidate, guard_catalog, has_strong_usul_context

POLICY = {
    "promotion": {
        "excluded_work_markers": ["IbnYacqubKulayni", "UsulMinKafi"],
    }
}


def candidate(**overrides):
    payload = {
        "version_uri": "0999Fixture.Book.JK1-ara1",
        "work_uri": "0999Fixture.Book",
        "title": "Fixture",
        "title_ar": "كتاب",
        "author": "Author",
        "author_ar": "مؤلف",
        "subject": "usul",
    }
    payload.update(overrides)
    return payload


class CorpusCandidateGuardTests(unittest.TestCase):
    def test_grammar_maqasid_is_rejected(self) -> None:
        item = candidate(
            work_uri="0855BadrDinCayni.MaqasidNahwiyya",
            title="Maqasid Nahwiyya",
            title_ar="المقاصد النحوية في شرح شواهد شروح الألفية",
        )
        self.assertFalse(has_strong_usul_context(item))
        self.assertEqual(guard_candidate(item, POLICY), (False, "ambiguous_usul_context"))

    def test_grammar_tawdih_maqasid_is_rejected(self) -> None:
        item = candidate(
            work_uri="0749BadrDinMisriMuradi.TawdihMaqasid",
            title="Tawdih Maqasid",
            title_ar="توضيح المقاصد والمسالك بشرح ألفية ابن مالك",
        )
        self.assertEqual(guard_candidate(item, POLICY), (False, "ambiguous_usul_context"))

    def test_kulayni_is_blocked_until_tradition_taxonomy_exists(self) -> None:
        item = candidate(
            work_uri="0329IbnYacqubKulayni.UsulMinKafi",
            version_uri="0329IbnYacqubKulayni.UsulMinKafi.Masaha000001Vols-ara1",
            title="Usul Min Kafi",
            author="Ibn Yacqub Kulayni",
        )
        ok, reason = guard_candidate(item, POLICY)
        self.assertFalse(ok)
        self.assertTrue(reason.startswith("excluded_work:"))

    def test_usul_al_fiqh_is_accepted(self) -> None:
        item = candidate(
            title="al-Mustasfa fi Usul al-Fiqh",
            title_ar="المستصفى في أصول الفقه",
        )
        self.assertTrue(has_strong_usul_context(item))
        self.assertEqual(guard_candidate(item, POLICY), (True, ""))

    def test_qiyas_is_accepted_as_strong_usul_context(self) -> None:
        item = candidate(
            work_uri="0999Fixture.KitabQiyas",
            title="Kitab al-Qiyas",
            title_ar="كتاب القياس",
        )
        self.assertTrue(has_strong_usul_context(item))
        self.assertEqual(guard_candidate(item, POLICY), (True, ""))

    def test_non_usul_subject_is_not_overfiltered(self) -> None:
        item = candidate(subject="hadith", title="Sunan Fixture", title_ar="سنن الاختبار")
        self.assertEqual(guard_candidate(item, POLICY), (True, ""))

    def test_catalog_reports_guard_rejections(self) -> None:
        catalog = {
            "candidate_works": 3,
            "candidates": [
                candidate(title="Maqasid Nahwiyya", title_ar="المقاصد النحوية"),
                candidate(title="Usul al-Fiqh", title_ar="أصول الفقه"),
                candidate(subject="hadith", title="Sahih Fixture", title_ar="صحيح الاختبار"),
            ],
        }
        guarded = guard_catalog(catalog, POLICY)
        self.assertEqual(guarded["candidate_works"], 2)
        self.assertEqual(guarded["guard_rejected"]["ambiguous_usul_context"], 1)
        self.assertEqual(guarded["guard"], "athar-scholarly-candidate-guard-v1")


if __name__ == "__main__":
    unittest.main()
