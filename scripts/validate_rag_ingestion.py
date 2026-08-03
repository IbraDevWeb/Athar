from __future__ import annotations

import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "rag"))

from core import connect, initialize_database, upsert_book, upsert_chunk, utc_now  # noqa: E402
from ingest_kutub import discover_pages, ingest_page  # noqa: E402
from ingestion import (  # noqa: E402
    bootstrap_legacy_state,
    finish_run,
    ingestion_status,
    mark_page,
    next_page,
    quality_score,
    start_run,
)


class FakeResponse:
    def __init__(self, text: str) -> None:
        self.text = text


class FakeClient:
    def __init__(self, html: str) -> None:
        self.html = html

    def get(self, _url: str) -> FakeResponse:
        return FakeResponse(self.html)


def fail(message: str) -> None:
    raise SystemExit(f"RAG ingestion validation failed: {message}")


HTML = """
<html><body><main>
  <h1>كتاب الاختبار</h1>
  <h2>باب الجمع بين الصلاتين في السفر</h2>
  <a href="/fr/book/999/1/">1</a>
  <a href="/fr/book/999/2/">2</a>
  <p dir="rtl">يجوز للمسافر جمع الظهر والعصر عند الحاجة إلى السير ويعتبر وقت الرحيل وحال السفر في تنزيل الحكم على النازلة.</p>
  <p>Ce passage explique que le regroupement de dhuhr et de asr dépend de la réalité du déplacement et du moment du départ du voyageur.</p>
</main></body></html>
"""


with tempfile.TemporaryDirectory() as temporary_directory:
    db = Path(temporary_directory) / "ingestion.sqlite"
    connection = connect(db)
    initialize_database(connection)
    upsert_book(
        connection,
        {
            "id": "kutub-999",
            "kutub_id": 999,
            "title": "Livre de test",
            "title_ar": "كتاب الاختبار",
            "author": "Auteur de test",
            "discipline": "Fiqh",
            "madhhab": "Mālikite",
            "pages": 200,
            "source_url": "https://kutub.io/fr/book/999",
            "metadata": {"source_type": "classical_reference"},
        },
    )
    # Simule un passage de démarrage isolé sur une page éloignée.
    upsert_chunk(
        connection,
        {
            "id": "legacy-page-175",
            "book_id": "kutub-999",
            "page": 175,
            "chapter": "Passage de démarrage",
            "text_ar": "نص عربي تجريبي طويل بما يكفي ليكون مقطعا مفيدا في قاعدة البيانات ولا يمثل اكتمال الصفحات السابقة.",
            "text_fr": "Un passage de démarrage isolé ne doit jamais faire croire que les cent soixante-quatorze pages précédentes ont déjà été traitées.",
            "translation_status": "athar_working_translation_unreviewed",
            "source_url": "https://kutub.io/fr/book/999/175",
            "scraped_at": utc_now(),
        },
    )
    connection.commit()

    if bootstrap_legacy_state(connection) != 1:
        fail("The existing page was not imported into ingestion state.")
    if next_page(connection, "kutub-999") != 1:
        fail("The cursor must select the first missing page, not max(page) + 1.")

    run_id = start_run(connection, "fixture", 1, {"purpose": "runtime validation"})
    mark_page(connection, book_id="kutub-999", page=1, run_id=run_id, status="imported", chunk_count=1, quality=90)
    mark_page(connection, book_id="kutub-999", page=2, run_id=run_id, status="duplicate")
    mark_page(connection, book_id="kutub-999", page=3, run_id=run_id, status="error", error="temporary")
    if next_page(connection, "kutub-999", retry_errors=True) != 3:
        fail("Failed pages must be retried before moving forward.")

    pages = discover_pages(HTML, 999)
    if pages != [1, 2]:
        fail(f"Page discovery returned {pages!r} instead of [1, 2].")

    result = ingest_page(
        client=FakeClient(HTML),
        connection=connection,
        run_id=run_id,
        book={
            "id": "kutub-999",
            "kutub_id": 999,
            "metadata": {"source_type": "classical_reference"},
        },
        page=4,
        snapshots=False,
    )
    if result["status"] != "imported" or int(result["chunks"]) < 1:
        fail(f"A bilingual page should be imported, got {result!r}.")

    duplicate = ingest_page(
        client=FakeClient(HTML),
        connection=connection,
        run_id=run_id,
        book={
            "id": "kutub-999",
            "kutub_id": 999,
            "metadata": {"source_type": "classical_reference"},
        },
        page=5,
        snapshots=False,
    )
    if duplicate["status"] != "duplicate":
        fail(f"A repeated page must be marked duplicate, got {duplicate!r}.")

    counters = {
        "attempted_pages": 2,
        "imported_pages": 1,
        "imported_chunks": int(result["chunks"]),
        "duplicate_pages": 1,
        "empty_pages": 0,
        "failed_pages": 0,
        "blocked_pages": 0,
    }
    finish_run(connection, run_id, status="completed", counters=counters)
    status = ingestion_status(connection)
    if status["imported_pages"] < 2 or status["duplicate_pages"] < 2:
        fail("The ingestion dashboard did not aggregate page states.")
    if not status["runs"] or status["runs"][0]["status"] != "completed":
        fail("The completed run is missing from ingestion history.")
    if quality_score(300, 300, 2, True) < 90:
        fail("A complete bilingual page should receive a high quality score.")

    connection.close()

print("RAG ingestion valid — gap-aware cursor, retry, parser, deduplication, quality scoring and run history.")
