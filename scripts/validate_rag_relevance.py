from __future__ import annotations

import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"
if str(RAG) not in sys.path:
    sys.path.insert(0, str(RAG))

import core  # noqa: E402
import relevance  # noqa: E402


def add_book(connection, *, book_id: str, title: str, discipline: str, madhhab: str, text_ar: str = "", text_fr: str = "", chapter: str = "") -> None:
    core.upsert_book(connection, {
        "id": book_id,
        "title": title,
        "title_ar": "",
        "author": "Auteur test",
        "discipline": discipline,
        "madhhab": madhhab,
        "source_url": f"https://example.test/{book_id}",
    })
    core.upsert_chunk(connection, {
        "id": f"chunk-{book_id}",
        "book_id": book_id,
        "chapter": chapter,
        "text_ar": text_ar,
        "text_fr": text_fr,
        "translation_status": "openiti_arabic_source" if text_ar else "test_translation",
        "source_url": f"https://example.test/{book_id}",
    })


def main() -> int:
    with tempfile.TemporaryDirectory() as directory:
        db_path = Path(directory) / "relevance.sqlite"
        connection = core.connect(db_path)
        core.initialize_database(connection)
        add_book(
            connection,
            book_id="irrelevant-fiqh",
            title="Al-Kafi",
            discipline="Fiqh",
            madhhab="Malikite",
            text_fr="Le voyageur accomplit la prière derrière un imam résident et complète alors sa prière.",
            chapter="Le voyageur et l'imam résident",
        )
        add_book(
            connection,
            book_id="relevant-tafsir",
            title="Jami al-Bayan",
            discipline="Tafsir",
            madhhab="Transversal",
            text_ar="بسم الله الرحمن الرحيم، الرحمن والرحيم اسمان مشتقان من الرحمة وفيهما بيان سعة رحمة الله بعباده.",
            chapter="تفسير بسم الله الرحمن الرحيم",
        )
        connection.commit()

        query = "Comment les exégètes expliquent-ils la miséricorde dans la basmala ?"
        results = relevance.search_chunks(connection, query, limit=8)
        assert results, "La recherche bilingue n'a retrouvé aucun tafsir."
        assert results[0]["book_id"] == "relevant-tafsir", results
        assert not any(item["book_id"] == "irrelevant-fiqh" for item in results), results
        assert results[0]["matched_concepts"] >= 2

        relevance.install()
        import v2
        analysis, evidence = v2.retrieve_evidence(connection, query, madhhab="Mālikite", limit=8)
        assert analysis["discipline"] == "Tafsīr", analysis
        assert analysis["madhhab"] == "Toutes les écoles", analysis
        assert evidence and evidence[0]["book_id"] == "relevant-tafsir", evidence
        assert not any(item["book_id"] == "irrelevant-fiqh" for item in evidence), evidence

        prayer = relevance.search_chunks(connection, "Que fait le voyageur derrière un imam résident pendant la prière ?", limit=8)
        assert prayer and prayer[0]["book_id"] == "irrelevant-fiqh", prayer
        connection.close()

    print("RAG relevance validated: bilingual concepts rank tafsir and reject unrelated fiqh evidence.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
