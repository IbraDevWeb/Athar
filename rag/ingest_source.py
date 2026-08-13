from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from core import DEFAULT_DB, connect, content_hash, initialize_database, upsert_book, upsert_chunk, utc_now
from source_registry import (
    DEFAULT_REGISTRY,
    SourceConfig,
    get_source,
    initialize_source_registry,
    registry_status,
    sync_source_registry,
)

SUPPORTED_SUFFIXES = {".json", ".jsonl", ".ndjson", ".txt", ".md", ".markdown"}
SPACE = re.compile(r"[ \t]+")
BLANK_LINES = re.compile(r"\n\s*\n+")
SLUG = re.compile(r"[^a-z0-9_-]+")


@dataclass
class ImportCounters:
    attempted_documents: int = 0
    imported_documents: int = 0
    imported_passages: int = 0
    duplicate_documents: int = 0
    failed_documents: int = 0

    def as_dict(self) -> dict[str, int]:
        return {
            "attempted_documents": self.attempted_documents,
            "imported_documents": self.imported_documents,
            "imported_passages": self.imported_passages,
            "duplicate_documents": self.duplicate_documents,
            "failed_documents": self.failed_documents,
        }


def _slug(value: str, fallback: str = "document") -> str:
    clean = SLUG.sub("-", value.lower()).strip("-")
    return clean[:80] or fallback


def _text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.replace("\r\n", "\n").replace("\r", "\n").strip()
    return str(value).strip()


def split_text(text: str, *, max_chars: int = 1600, min_chars: int = 120) -> list[str]:
    clean = _text(text)
    if not clean:
        return []
    paragraphs = [SPACE.sub(" ", part.replace("\n", " ")).strip() for part in BLANK_LINES.split(clean)]
    paragraphs = [part for part in paragraphs if part]
    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        if len(paragraph) > max_chars:
            sentences = re.split(r"(?<=[.!?؟؛])\s+", paragraph)
        else:
            sentences = [paragraph]
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            candidate = f"{current}\n\n{sentence}".strip() if current else sentence
            if len(candidate) <= max_chars:
                current = candidate
                continue
            if current:
                chunks.append(current)
            if len(sentence) <= max_chars:
                current = sentence
            else:
                for start in range(0, len(sentence), max_chars):
                    piece = sentence[start : start + max_chars].strip()
                    if piece:
                        chunks.append(piece)
                current = ""
    if current:
        chunks.append(current)
    if len(chunks) > 1 and len(chunks[-1]) < min_chars:
        chunks[-2] = f"{chunks[-2]}\n\n{chunks[-1]}".strip()
        chunks.pop()
    return chunks


def _read_json(path: Path) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8-sig"))
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if not isinstance(payload, dict):
        raise ValueError(f"{path}: le JSON doit être un objet ou une liste d'objets.")
    documents = payload.get("documents")
    if isinstance(documents, list):
        return [item for item in documents if isinstance(item, dict)]
    return [payload]


def _read_jsonl(path: Path) -> list[dict[str, Any]]:
    documents: list[dict[str, Any]] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), start=1):
        if not line.strip():
            continue
        payload = json.loads(line)
        if not isinstance(payload, dict):
            raise ValueError(f"{path}:{line_number}: chaque ligne doit être un objet JSON.")
        documents.append(payload)
    return documents


def load_documents(path: Path) -> list[dict[str, Any]]:
    suffix = path.suffix.lower()
    if suffix == ".json":
        return _read_json(path)
    if suffix in {".jsonl", ".ndjson"}:
        return _read_jsonl(path)
    if suffix in {".txt", ".md", ".markdown"}:
        return [{"id": path.stem, "title": path.stem.replace("_", " ").replace("-", " ").title(), "text": path.read_text(encoding="utf-8-sig")}]
    if suffix == ".pdf":
        raise ValueError(
            "L'extraction PDF n'est pas activée automatiquement. Exportez d'abord le texte en JSONL/TXT afin de conserver une provenance contrôlable."
        )
    raise ValueError(f"Format non pris en charge : {path.suffix or '(sans extension)'}")


def iter_input_files(path: Path) -> Iterable[Path]:
    if path.is_file():
        yield path
        return
    if not path.is_dir():
        raise FileNotFoundError(path)
    for candidate in sorted(path.rglob("*")):
        if candidate.is_file() and candidate.suffix.lower() in SUPPORTED_SUFFIXES:
            yield candidate


def _metadata(document: dict[str, Any], source: SourceConfig, external_id: str, source_url: str) -> dict[str, Any]:
    provided = document.get("metadata") if isinstance(document.get("metadata"), dict) else {}
    fields = {
        "source_id": source.id,
        "source_label": source.label,
        "source_kind": source.kind,
        "external_id": external_id,
        "source_url": source_url,
        "rights_status": document.get("rights_status") or source.rights_status,
        "citation_policy": source.citation_policy,
        "edition": document.get("edition"),
        "version": document.get("version") or document.get("riwaya"),
        "volume": document.get("volume") or document.get("tome"),
        "book_number": document.get("book_number"),
        "chapter_number": document.get("chapter_number"),
        "hadith_number": document.get("hadith_number"),
        "verification_status": document.get("verification_status") or "imported_unreviewed",
        "primary_source": bool(document.get("primary_source", False)),
        "import_method": "athar-universal-source-v1",
    }
    return {**(source.metadata or {}), **provided, **{key: value for key, value in fields.items() if value not in (None, "")}}


def _passages(document: dict[str, Any], max_chars: int) -> list[dict[str, Any]]:
    raw = document.get("passages") or document.get("chunks")
    if isinstance(raw, list):
        passages = []
        for index, passage in enumerate(raw, start=1):
            if isinstance(passage, str):
                passage = {"text": passage}
            if not isinstance(passage, dict):
                continue
            passages.append({**passage, "_index": index})
        return passages

    text_ar = _text(document.get("text_ar"))
    text_fr = _text(document.get("text_fr") or document.get("text"))
    if text_ar and text_fr:
        ar_chunks = split_text(text_ar, max_chars=max_chars)
        fr_chunks = split_text(text_fr, max_chars=max_chars)
        size = max(len(ar_chunks), len(fr_chunks))
        return [
            {
                "text_ar": ar_chunks[index] if index < len(ar_chunks) else "",
                "text_fr": fr_chunks[index] if index < len(fr_chunks) else "",
                "_index": index + 1,
            }
            for index in range(size)
        ]
    chosen = text_fr or text_ar
    key = "text_fr" if text_fr else "text_ar"
    return [{key: value, "_index": index} for index, value in enumerate(split_text(chosen, max_chars=max_chars), start=1)]


def _document_digest(document: dict[str, Any], passages: list[dict[str, Any]]) -> str:
    serialized = [
        json.dumps(
            {
                "text_ar": _text(item.get("text_ar")),
                "text_fr": _text(item.get("text_fr") or item.get("text")),
                "page": item.get("page") or item.get("page_start"),
                "chapter": item.get("chapter"),
            },
            ensure_ascii=False,
            sort_keys=True,
        )
        for item in passages
    ]
    return content_hash(document.get("title"), *serialized)


def _start_run(connection: sqlite3.Connection, source_id: str, metadata: dict[str, Any]) -> int:
    cursor = connection.execute(
        "INSERT INTO source_runs (source_id, started_at, status, metadata_json) VALUES (?, ?, 'running', ?)",
        (source_id, utc_now(), json.dumps(metadata, ensure_ascii=False)),
    )
    connection.commit()
    return int(cursor.lastrowid)


def _finish_run(
    connection: sqlite3.Connection,
    run_id: int,
    counters: ImportCounters,
    *,
    status: str,
    message: str = "",
) -> None:
    connection.execute(
        """
        UPDATE source_runs SET
            finished_at=?, status=?, attempted_documents=?, imported_documents=?,
            imported_passages=?, duplicate_documents=?, failed_documents=?, message=?
        WHERE id=?
        """,
        (
            utc_now(),
            status,
            counters.attempted_documents,
            counters.imported_documents,
            counters.imported_passages,
            counters.duplicate_documents,
            counters.failed_documents,
            message,
            run_id,
        ),
    )
    connection.commit()


def ingest_document(
    connection: sqlite3.Connection,
    source: SourceConfig,
    document: dict[str, Any],
    *,
    origin: Path,
    max_chars: int = 1600,
    force: bool = False,
) -> dict[str, Any]:
    external_id = _text(document.get("external_id") or document.get("id") or origin.stem)
    if not external_id:
        external_id = content_hash(origin, document.get("title"))[:16]
    title = _text(document.get("title") or origin.stem)
    source_url = _text(document.get("source_url") or document.get("url") or source.base_url)
    passages = _passages(document, max_chars)
    if not passages:
        raise ValueError(f"{title}: aucun texte exploitable.")
    digest = _document_digest(document, passages)

    previous = connection.execute(
        "SELECT id, content_hash, passages FROM source_documents WHERE source_id=? AND external_id=?",
        (source.id, external_id),
    ).fetchone()
    if previous and previous["content_hash"] == digest and not force:
        return {"status": "duplicate", "passages": 0, "external_id": external_id}

    book_id = _text(document.get("book_id")) or f"{source.id}-{_slug(external_id)}"
    metadata = _metadata(document, source, external_id, source_url)
    upsert_book(
        connection,
        {
            "id": book_id,
            "kutub_id": document.get("kutub_id"),
            "title": title,
            "title_ar": _text(document.get("title_ar")),
            "author": _text(document.get("author")),
            "discipline": _text(document.get("discipline")),
            "madhhab": _text(document.get("madhhab")),
            "pages": document.get("pages"),
            "description": _text(document.get("description")),
            "source_url": source_url or f"urn:athar:{source.id}:{external_id}",
            "scraped_at": utc_now(),
            "metadata": metadata,
        },
    )

    imported = 0
    for passage in passages:
        text_ar = _text(passage.get("text_ar"))
        text_fr = _text(passage.get("text_fr") or passage.get("text"))
        passage_index = int(passage.get("_index") or imported + 1)
        page_start = passage.get("page_start") or passage.get("page") or document.get("page_start")
        page_end = passage.get("page_end") or page_start
        chunk_digest = content_hash(book_id, text_ar, text_fr, passage.get("chapter"), page_start)
        chunk_id = f"{book_id}-{passage_index}-{chunk_digest[:10]}"
        passage_metadata = {
            **metadata,
            **(passage.get("metadata") if isinstance(passage.get("metadata"), dict) else {}),
            "chunk_index": passage_index,
            "page_start": page_start,
            "page_end": page_end,
            "printed_page": passage.get("printed_page") or page_start,
            "volume": passage.get("volume") or metadata.get("volume"),
            "book_number": passage.get("book_number") or metadata.get("book_number"),
            "chapter_number": passage.get("chapter_number") or metadata.get("chapter_number"),
            "hadith_number": passage.get("hadith_number") or metadata.get("hadith_number"),
        }
        upsert_chunk(
            connection,
            {
                "id": chunk_id,
                "book_id": book_id,
                "page": page_start,
                "chapter": _text(passage.get("chapter") or document.get("chapter")),
                "text_ar": text_ar,
                "text_fr": text_fr,
                "translation_status": _text(
                    passage.get("translation_status")
                    or document.get("translation_status")
                    or ("arabic_original" if text_ar and not text_fr else "imported_unreviewed")
                ),
                "source_url": _text(passage.get("source_url")) or source_url or f"urn:athar:{source.id}:{external_id}",
                "content_hash": chunk_digest,
                "scraped_at": utc_now(),
                "metadata": {key: value for key, value in passage_metadata.items() if value not in (None, "")},
            },
        )
        imported += 1

    document_id = f"{source.id}:{external_id}"
    connection.execute(
        """
        INSERT INTO source_documents (
            id, source_id, external_id, book_id, title, source_url, content_hash,
            status, passages, imported_at, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'imported', ?, ?, ?)
        ON CONFLICT(source_id, external_id) DO UPDATE SET
            book_id=excluded.book_id,
            title=excluded.title,
            source_url=excluded.source_url,
            content_hash=excluded.content_hash,
            status='imported',
            passages=excluded.passages,
            imported_at=excluded.imported_at,
            metadata_json=excluded.metadata_json
        """,
        (
            document_id,
            source.id,
            external_id,
            book_id,
            title,
            source_url,
            digest,
            imported,
            utc_now(),
            json.dumps(metadata, ensure_ascii=False),
        ),
    )
    connection.commit()
    return {"status": "imported", "passages": imported, "external_id": external_id, "book_id": book_id}


def run_ingestion(args: argparse.Namespace) -> int:
    input_path = Path(args.input).resolve()
    connection = connect(args.db)
    initialize_database(connection)
    initialize_source_registry(connection)
    sync_source_registry(connection, args.registry)
    try:
        source = get_source(args.source, args.registry)
    except KeyError as error:
        connection.close()
        print(str(error), file=sys.stderr)
        return 2
    if not source.enabled and not args.allow_disabled:
        connection.close()
        print(f"La source {source.id!r} est désactivée dans le registre.", file=sys.stderr)
        return 2

    files = list(iter_input_files(input_path))
    if not files:
        connection.close()
        print("Aucun fichier compatible à importer.", file=sys.stderr)
        return 2

    counters = ImportCounters()
    run_id = _start_run(connection, source.id, {"input": str(input_path), "files": len(files), "force": args.force})
    final_status = "completed"
    message = ""
    try:
        for path in files:
            try:
                documents = load_documents(path)
            except Exception as error:
                counters.failed_documents += 1
                final_status = "partial"
                print(f"[erreur] {path.name}: {error}", file=sys.stderr)
                continue
            for document in documents:
                counters.attempted_documents += 1
                try:
                    result = ingest_document(
                        connection,
                        source,
                        document,
                        origin=path,
                        max_chars=max(400, min(args.max_chars, 5000)),
                        force=args.force,
                    )
                    if result["status"] == "duplicate":
                        counters.duplicate_documents += 1
                    else:
                        counters.imported_documents += 1
                        counters.imported_passages += int(result["passages"])
                    print(f"{path.name} · {result['external_id']}: {result['status']} ({result['passages']} passage(s))")
                except Exception as error:
                    counters.failed_documents += 1
                    final_status = "partial"
                    print(f"[erreur] {path.name}: {error}", file=sys.stderr)
    except KeyboardInterrupt:
        final_status = "partial"
        message = "Import interrompu par l'utilisateur."
    finally:
        _finish_run(connection, run_id, counters, status=final_status, message=message)
        connection.close()

    print(
        "Import terminé : "
        f"{counters.imported_documents} document(s), {counters.imported_passages} passage(s), "
        f"{counters.duplicate_documents} doublon(s), {counters.failed_documents} erreur(s)."
    )
    return 0 if final_status in {"completed", "partial"} else 1


def print_status(args: argparse.Namespace) -> int:
    connection = connect(args.db)
    initialize_database(connection)
    payload = registry_status(connection, args.registry)
    connection.close()
    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    print(
        f"Sources : {payload['enabled_sources']}/{payload['configured_sources']} activées · "
        f"{payload['documents']} document(s) · {payload['passages']} passage(s)"
    )
    for source in payload["sources"]:
        state = "active" if source["enabled"] else "préparée"
        print(f"- {source['label']} [{source['id']}] : {state}, {source['documents']} document(s), {source['passages']} passage(s)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Pipeline universel multi-source de la Bibliothèque Athar.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--registry", type=Path, default=DEFAULT_REGISTRY)
    subparsers = parser.add_subparsers(dest="command")

    status = subparsers.add_parser("status", help="Affiche le registre et les imports par source.")
    status.add_argument("--json", action="store_true")

    ingest = subparsers.add_parser("ingest", help="Importe un fichier ou un dossier JSON/JSONL/TXT/Markdown.")
    ingest.add_argument("--source", required=True, help="Identifiant présent dans rag/sources.json.")
    ingest.add_argument("--input", required=True, help="Fichier ou dossier à importer.")
    ingest.add_argument("--max-chars", type=int, default=1600, help="Taille maximale approximative d'un passage.")
    ingest.add_argument("--force", action="store_true", help="Réimporte même si l'empreinte documentaire est inchangée.")
    ingest.add_argument("--allow-disabled", action="store_true", help="Autorise explicitement une source préparée mais désactivée.")

    args = parser.parse_args()
    if args.command in {None, "status"}:
        if args.command is None:
            args.json = False
        return print_status(args)
    if args.command == "ingest":
        return run_ingestion(args)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
