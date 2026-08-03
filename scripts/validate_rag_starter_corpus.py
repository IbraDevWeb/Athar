from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "rag"))

from core import ensure_database, import_seed  # noqa: E402
from v2 import answer_question_v2, corpus_status_v2  # noqa: E402

STARTER_PATH = ROOT / "rag" / "starter_corpus.json"
TARGET_QUERY = "Peut-on regrouper dhuhr et asr à l’heure de dhuhr pendant le voyage ?"


def fail(message: str) -> None:
    raise SystemExit(f"Starter corpus validation failed: {message}")


payload = json.loads(STARTER_PATH.read_text(encoding="utf-8"))
books = payload.get("books", [])
chunks = payload.get("chunks", [])
if len(books) < 6:
    fail(f"expected at least 6 starter books, got {len(books)}")
if len(chunks) < 9:
    fail(f"expected at least 9 starter chunks, got {len(chunks)}")
if not all(item.get("source_url", "").startswith("https://kutub.io/") for item in chunks):
    fail("every starter passage must keep an exact Kutub source URL")
if not all(item.get("text_ar") or item.get("text_fr") for item in chunks):
    fail("every starter passage needs substantive source text")
if not all("unreviewed" in str(item.get("translation_status", "")) for item in chunks):
    fail("starter translations must remain explicitly marked as unreviewed")

with tempfile.TemporaryDirectory() as temp_dir:
    db_path = Path(temp_dir) / "starter.sqlite"
    connection = ensure_database(db_path)
    try:
        demo_before = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
        import_seed(connection, STARTER_PATH)
        total_after = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
        starter_after = int(
            connection.execute("SELECT COUNT(*) FROM chunks WHERE id LIKE 'starter-%'").fetchone()[0]
        )

        if demo_before < 10:
            fail("the migration fixture did not begin with the demo catalogue")
        if total_after <= demo_before:
            fail("the starter migration did not enrich the existing database")
        if starter_after != len(chunks):
            fail(f"expected {len(chunks)} starter chunks after migration, got {starter_after}")

        answer = answer_question_v2(
            connection,
            TARGET_QUERY,
            madhhab="Mālikite",
            discipline="Fiqh",
            limit=12,
        )
        claims = answer.get("answer", {}).get("claims", [])
        sources = answer.get("sources", [])
        coverage = answer.get("answer", {}).get("coverage", {})

        if not claims:
            fail("the real example question still produced no documented claim")
        if coverage.get("substantive_passages", 0) < 1:
            fail("the example question found no substantive passage")
        if coverage.get("verdict") == "insufficient":
            fail("the example question must no longer be classified as source-insufficient")
        if not answer.get("citation_audit", {}).get("all_claims_cited"):
            fail("the starter answer contains an uncited claim")
        if not answer.get("citation_audit", {}).get("valid_source_ids"):
            fail("the starter answer contains an invalid citation id")

        expected_source = next(
            (item for item in sources if item.get("source_url", "").endswith("/21739/175")),
            None,
        )
        if not expected_source:
            fail("Bidāyat al-Mujtahid page 175 was not retrieved for the travel-combination question")
        if expected_source.get("verification_status") == "Notice uniquement":
            fail("the substantive travel passage was incorrectly downgraded to a catalogue notice")
        if "malik" not in str(expected_source.get("madhhab", "")).lower().replace("ā", "a"):
            fail("the comparative Mālikite source is still excluded from the Mālikite profile")

        status = corpus_status_v2(connection)
        if status.get("substantive_passages", 0) < len(chunks):
            fail("corpus metrics did not count the bundled substantive passages")
    finally:
        connection.close()

print(
    "Starter corpus valid — existing demo DB enriched, Mālikite comparative source retained, "
    "travel-combination question answered with a cited substantive Kutub passage."
)
