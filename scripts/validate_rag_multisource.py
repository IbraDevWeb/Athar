from __future__ import annotations

import json
import sqlite3
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "rag"))

from citations import attach_citations  # noqa: E402
from core import initialize_database  # noqa: E402
from ingest_source import ingest_document, split_text  # noqa: E402
from source_registry import get_source, initialize_source_registry, registry_status, sync_source_registry  # noqa: E402


def need(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    registry_path = ROOT / "rag" / "sources.json"
    local = get_source("local", registry_path)
    need(local.enabled, "La source locale doit être active.")
    need(not get_source("shamela", registry_path).enabled, "Shamela doit rester désactivée tant que l'adaptateur n'est pas validé.")

    chunks = split_text("Premier paragraphe documenté.\n\n" + "Deuxième paragraphe. " * 120, max_chars=500)
    need(len(chunks) >= 2, "Le découpage doit produire plusieurs passages.")
    need(all(len(chunk) <= 1000 for chunk in chunks), "Le découpage produit un passage anormalement long.")

    with tempfile.TemporaryDirectory() as temporary:
        db_path = Path(temporary) / "test.sqlite"
        connection = sqlite3.connect(db_path)
        connection.row_factory = sqlite3.Row
        initialize_database(connection)
        initialize_source_registry(connection)
        sync_source_registry(connection, registry_path)

        document = {
            "id": "muwatta-test",
            "title": "Al-Muwatta",
            "author": "Malik ibn Anas",
            "discipline": "Hadith",
            "madhhab": "Malikite",
            "edition": "Edition de test",
            "version": "Riwayat Yahya",
            "primary_source": True,
            "passages": [
                {
                    "chapter": "Livre de la priere",
                    "book_number": 8,
                    "chapter_number": 31,
                    "hadith_number": 45,
                    "printed_page": 287,
                    "text_ar": "نص عربي تجريبي طويل بما يكفي للاختبار",
                    "text_fr": "Passage français de validation du pipeline multi-source.",
                    "verification_status": "human_verified",
                }
            ],
        }
        first = ingest_document(connection, local, document, origin=Path("sample.jsonl"))
        second = ingest_document(connection, local, document, origin=Path("sample.jsonl"))
        need(first["status"] == "imported" and first["passages"] == 1, "Le document doit être importé.")
        need(second["status"] == "duplicate", "Le second import doit être dédupliqué.")

        row = connection.execute(
            """
            SELECT c.*, b.title, b.author, b.discipline, b.madhhab, c.metadata_json
            FROM chunks c JOIN books b ON b.id=c.book_id LIMIT 1
            """
        ).fetchone()
        item = dict(row)
        item["metadata"] = json.loads(item.pop("metadata_json"))
        attach_citations([item])
        citation = item["citation"]
        need(citation["hadith_number"] == 45, "Le numéro de hadith doit survivre à l'ingestion.")
        need(citation["page_start"] == 287, "La page imprimée doit survivre à l'ingestion.")
        need("hadith 45" in citation["label"], "Le libellé académique doit inclure le hadith.")

        status = registry_status(connection, registry_path)
        need(status["enabled_sources"] >= 2, "Kutub et les documents locaux doivent être actifs.")
        local_status = next(source for source in status["sources"] if source["id"] == "local")
        need(local_status["documents"] == 1 and local_status["passages"] == 1, "La télémétrie par source est incorrecte.")
        connection.close()

    print("RAG multi-source validated: registry, deterministic chunks, deduplication, provenance and academic citation metadata.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
