from __future__ import annotations

import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "rag"))

from core import (  # noqa: E402
    answer_question,
    database_status,
    ensure_database,
    search_chunks,
    upsert_book,
    upsert_chunk,
)
from v2 import answer_question_v2, corpus_status_v2, evaluation_status_v2  # noqa: E402


def fail(message: str) -> None:
    raise SystemExit(f"RAG runtime validation failed: {message}")


with tempfile.TemporaryDirectory() as temp_dir:
    db_path = Path(temp_dir) / "test.sqlite"
    with ensure_database(db_path) as connection:
        status = database_status(connection)
        if status["books"] != 5:
            fail(f"expected 5 books, got {status['books']}")
        if status["chunks"] < 10:
            fail(f"expected at least 10 chunks, got {status['chunks']}")

        french = search_chunks(connection, "tayammum", madhhab="Comparatif", limit=5)
        if not french or not any("Tayammum" in (item.get("chapter") or "") for item in french):
            fail("French retrieval did not find the tayammum chapter.")

        arabic = search_chunks(connection, "تفسير", limit=5)
        if not arabic or not any("Qurṭubī" in (item.get("title") or "") for item in arabic):
            fail("Arabic retrieval did not find Tafsir al-Qurtubi.")

        answer = answer_question(connection, "Quelle place l'intention occupe-t-elle dans le jeûne ?", limit=5)
        if not answer["results"]:
            fail("The V1 answer pipeline returned no sources.")
        if "[1]" not in answer["answer"]:
            fail("The V1 extractive answer is missing source markers.")

        upsert_book(
            connection,
            {
                "id": "v2-test-maliki",
                "kutub_id": 999999,
                "title": "Manuel mālikite de test",
                "title_ar": "كتاب اختبار مالكي",
                "author": "Auteur de test",
                "discipline": "Fiqh",
                "madhhab": "Mālikite",
                "pages": 120,
                "description": "Ouvrage synthétique utilisé uniquement par la CI.",
                "source_url": "https://example.invalid/book/test",
                "metadata": {"source_type": "primary", "edition": "Édition de test"},
            },
        )
        upsert_chunk(
            connection,
            {
                "id": "v2-test-travel-prayer",
                "book_id": "v2-test-maliki",
                "page": 42,
                "chapter": "Le regroupement des prières pendant le voyage",
                "text_ar": "يجوز للمسافر جمع الظهر والعصر عند الحاجة إلى السير، ويعتبر وقت الرحيل وحال السفر في تنزيل الحكم.",
                "text_fr": (
                    "Le passage traite du regroupement de dhuhr et de asr pendant le voyage. "
                    "Il précise que la situation réelle du déplacement et le moment du départ doivent être examinés. "
                    "Cette formulation de test sert à vérifier que chaque affirmation produite par Athar reste attachée à sa source."
                ),
                "translation_status": "traduction_relue",
                "source_url": "https://example.invalid/book/test/page/42",
                "metadata": {"verification_status": "verified", "volume": 1, "page_end": 42},
            },
        )
        connection.commit()

        v2_answer = answer_question_v2(
            connection,
            "Peut-on regrouper dhuhr et asr pendant le voyage selon les malikites ?",
            madhhab="Mālikite",
            discipline="Fiqh",
            limit=12,
        )
        if v2_answer["analysis"]["madhhab"] != "Mālikite":
            fail("V2 question analysis lost the requested madhhab.")
        if not v2_answer["sources"]:
            fail("V2 returned no evidence.")
        if not v2_answer["answer"]["claims"]:
            fail("V2 did not produce a cited claim from a substantive passage.")
        if not v2_answer["citation_audit"]["all_claims_cited"]:
            fail("V2 produced an uncited claim.")
        if not v2_answer["citation_audit"]["valid_source_ids"]:
            fail("V2 produced an invalid citation id.")
        source_ids = {item["citation_id"] for item in v2_answer["sources"]}
        for claim in v2_answer["answer"]["claims"]:
            if not set(claim["source_ids"]).issubset(source_ids):
                fail("A V2 claim references an unknown source.")

        insufficient = answer_question_v2(
            connection,
            "Question totalement absente sur un sujet artificiel xyzabc",
            madhhab="Mālikite",
            discipline="Fiqh",
            limit=8,
        )
        if insufficient["answer"]["coverage"]["verdict"] not in {"insufficient", "partial"}:
            fail("V2 should not claim solid coverage for an absent subject.")

        v2_status = corpus_status_v2(connection)
        if v2_status["substantive_passages"] < 1:
            fail("V2 corpus status did not count substantive passages.")
        if v2_status["target_books"] != 25:
            fail("V2 corpus target is incorrect.")

        evaluation = evaluation_status_v2()
        if evaluation["cases"] < 24 or evaluation["target"] != 200:
            fail("V2 evaluation baseline is incomplete.")

print("RAG runtime valid — V1 retrieval, V2 question analysis, cited claims, refusal behavior, corpus metrics and evaluation baseline.")
