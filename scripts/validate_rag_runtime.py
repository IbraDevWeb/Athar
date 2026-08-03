from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "rag"))

from core import answer_question, database_status, ensure_database, search_chunks  # noqa: E402


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
            fail("The answer pipeline returned no sources.")
        if "[1]" not in answer["answer"]:
            fail("The extractive answer is missing source markers.")
        if answer["answer_mode"] not in {"extractive", "ollama_grounded"}:
            fail("Unexpected answer mode.")

print("RAG runtime valid — temporary SQLite index, French/Arabic retrieval and grounded answer generation.")
