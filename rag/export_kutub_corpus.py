from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
sys.path.insert(0, str(RAG_DIR))

from core import DEFAULT_DB, connect, initialize_database, utc_now  # noqa: E402

DEFAULT_OUTPUT = RAG_DIR / "kutub_corpus.json"
DEFAULT_MAX_BYTES = 20 * 1024 * 1024


def decode_metadata(value: Any) -> dict[str, Any]:
    try:
        payload = json.loads(str(value or "{}"))
        return payload if isinstance(payload, dict) else {}
    except (TypeError, ValueError, json.JSONDecodeError):
        return {}


def export_books(connection: Any) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT * FROM books
        WHERE source_url LIKE 'https://kutub.io/%'
        ORDER BY COALESCE(kutub_id, 999999999), id
        """
    ).fetchall()
    result = []
    for row in rows:
        result.append(
            {
                "id": row["id"],
                "kutub_id": row["kutub_id"],
                "title": row["title"],
                "title_ar": row["title_ar"] or "",
                "author": row["author"] or "",
                "discipline": row["discipline"] or "",
                "madhhab": row["madhhab"] or "",
                "pages": row["pages"],
                "description": row["description"] or "",
                "source_url": row["source_url"],
                "scraped_at": row["scraped_at"],
                "metadata": decode_metadata(row["metadata_json"]),
            }
        )
    return result


def export_chunks(connection: Any) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT c.*
        FROM chunks c
        JOIN books b ON b.id = c.book_id
        WHERE b.source_url LIKE 'https://kutub.io/%'
          AND c.id LIKE 'kutub-%'
        ORDER BY c.book_id, COALESCE(c.page, 0), c.id
        """
    ).fetchall()
    result = []
    for row in rows:
        result.append(
            {
                "id": row["id"],
                "book_id": row["book_id"],
                "page": row["page"],
                "chapter": row["chapter"] or "",
                "text_ar": row["text_ar"] or "",
                "text_fr": row["text_fr"] or "",
                "translation_status": row["translation_status"],
                "source_url": row["source_url"],
                "content_hash": row["content_hash"],
                "scraped_at": row["scraped_at"],
                "metadata": decode_metadata(row["metadata_json"]),
            }
        )
    return result


def existing_semantic_payload(path: Path) -> tuple[list[Any], list[Any]]:
    if not path.exists():
        return [], []
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError, json.JSONDecodeError):
        return [], []
    return payload.get("books", []), payload.get("chunks", [])


def export_snapshot(db_path: Path, output: Path, max_bytes: int = DEFAULT_MAX_BYTES) -> bool:
    connection = connect(db_path)
    initialize_database(connection)
    try:
        books = export_books(connection)
        chunks = export_chunks(connection)
    finally:
        connection.close()

    previous_books, previous_chunks = existing_semantic_payload(output)
    if previous_books == books and previous_chunks == chunks:
        print(f"Corpus Kutub inchangé : {len(books)} livre(s), {len(chunks)} passage(s).")
        return False

    payload = {
        "meta": {
            "name": "Athar Kutub Corpus",
            "version": 1,
            "generated_at": utc_now(),
            "mode": "versioned_public_kutub_snapshot",
            "books": len(books),
            "chunks": len(chunks),
            "notice": "Pages publiques Kutub importées progressivement. Les traductions automatiques restent explicitement non relues.",
        },
        "books": books,
        "chunks": chunks,
    }
    encoded = (json.dumps(payload, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    if len(encoded) > max_bytes:
        raise RuntimeError(
            f"Le snapshot ferait {len(encoded) / 1024 / 1024:.1f} MiB, au-delà de la limite de {max_bytes / 1024 / 1024:.1f} MiB. "
            "Migrer le corpus vers un stockage persistant avant de poursuivre."
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".tmp")
    temporary.write_bytes(encoded)
    temporary.replace(output)
    print(f"Corpus Kutub exporté : {len(books)} livre(s), {len(chunks)} passage(s), {len(encoded) / 1024:.1f} KiB.")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Exporte les passages Kutub de SQLite vers un corpus versionné.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--max-mib", type=float, default=20.0)
    args = parser.parse_args()
    max_bytes = max(1, int(args.max_mib * 1024 * 1024))
    export_snapshot(args.db, args.output, max_bytes=max_bytes)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
