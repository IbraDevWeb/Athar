from __future__ import annotations

import unittest

from scrape_kutub import align_bilingual_blocks, extract_page_content, pair_chunks


class KutubFrenchExtractionTests(unittest.TestCase):
    def test_french_then_arabic_are_kept_together(self) -> None:
        html = """
        <html><body><main>
          <h1>Al-Majmūʿ</h1><h2>Chapitre du voyage</h2>
          <p>La nouvelle opinion n’autorise pas ce regroupement lors du voyage court, selon l’avis le plus correct retenu ici.</p>
          <div dir="rtl">
            <p>والأصح أن الجديد لا يجوز في السفر القصير، وهذا هو المعتمد في هذا الموضع من المذهب.</p>
            <p>وأما القصر فله شروط أخرى مذكورة في باب صلاة المسافر، والله أعلم.</p>
          </div>
          <nav><p>Cette navigation ne doit jamais entrer dans le corpus même si elle est suffisamment longue pour passer le filtre.</p></nav>
        </main></body></html>
        """
        chapter, arabic, french, structure = extract_page_content(html)
        pairs = pair_chunks(arabic, french)

        self.assertEqual(chapter, "Chapitre du voyage")
        self.assertEqual(len(pairs), 1)
        self.assertIn("nouvelle opinion", pairs[0][1])
        self.assertIn("القصر", pairs[0][0])
        self.assertNotIn("navigation", pairs[0][1])
        self.assertEqual(structure["bilingual_groups"], 1)

    def test_arabic_then_french_are_kept_together(self) -> None:
        blocks = [
            ("ar", "هذا نص عربي طويل بما يكفي لتمثيل فقرة فقهية أصلية في صفحة من صفحات الكتاب."),
            ("fr", "Voici un texte français assez long pour représenter la traduction publiée du passage sur la même page."),
            ("ar", "وهذا نص عربي ثان طويل بما يكفي لتمثيل فقرة أخرى مستقلة في نفس الصفحة من الكتاب."),
            ("fr", "Voici un second texte français assez long correspondant au second passage publié sur la même page."),
        ]
        pairs = align_bilingual_blocks(blocks)
        self.assertEqual(len(pairs), 2)
        self.assertTrue(pairs[0][0].startswith("هذا"))
        self.assertTrue(pairs[0][1].startswith("Voici"))
        self.assertTrue(pairs[1][0].startswith("وهذا"))

    def test_arabic_only_never_gets_fake_french(self) -> None:
        html = """
        <html><body><main>
          <h1>كتاب فقهي</h1>
          <p dir="rtl">هذا نص عربي أصلي طويل بما يكفي للاستخراج، ولا توجد له ترجمة فرنسية منشورة في هذه الصفحة.</p>
        </main></body></html>
        """
        _, arabic, french, _ = extract_page_content(html)
        pairs = pair_chunks(arabic, french)
        self.assertEqual(len(pairs), 1)
        self.assertTrue(pairs[0][0])
        self.assertEqual(pairs[0][1], "")

    def test_long_aligned_groups_remain_source_translation_pairs(self) -> None:
        arabic = [" ".join(["فقه"] * 700)]
        french = [" ".join(["jurisprudence"] * 700)]
        pairs = pair_chunks(arabic, french)
        self.assertGreaterEqual(len(pairs), 1)
        self.assertTrue(all(text_ar for text_ar, _ in pairs))
        self.assertTrue(all(text_fr for _, text_fr in pairs))
        self.assertEqual(" ".join(text_ar for text_ar, _ in pairs).count("فقه"), 700)
        self.assertEqual(" ".join(text_fr for _, text_fr in pairs).count("jurisprudence"), 700)


if __name__ == "__main__":
    unittest.main()
