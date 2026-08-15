from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator

from v5_engine import detect_book, normalize_text
from v5_lowmem import search as search_one_shard

SQLITE_HEADER = b"SQLite format 3\x00"


def open_readonly(path: Path) -> sqlite3.Connection:
    resolved = path.resolve().as_posix()
    connection = sqlite3.connect(
        f"file:{resolved}?mode=ro&immutable=1",
        uri=True,
        timeout=15,
    )
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    connection.execute("PRAGMA temp_store=FILE")
    connection.execute("PRAGMA cache_size=-4096")
    connection.execute("PRAGMA mmap_size=0")
    connection.execute("PRAGMA threads=1")
    return connection


def _validate_sqlite(path: Path, required_tables: set[str]) -> None:
    if not path.exists() or path.stat().st_size < len(SQLITE_HEADER):
        raise RuntimeError(f"Base shard introuvable ou vide: {path}")
    with path.open("rb") as handle:
        if handle.read(len(SQLITE_HEADER)) != SQLITE_HEADER:
            raise RuntimeError(f"En-tête SQLite invalide: {path}")
    with open_readonly(path) as connection:
        tables = {
            str(row[0])
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        }
        missing = sorted(required_tables - tables)
        if missing:
            raise RuntimeError(f"Tables manquantes dans {path.name}: {', '.join(missing)}")


def _trim(value: str, limit: int = 700) -> str:
    clean = " ".join(str(value or "").split())
    return clean if len(clean) <= limit else clean[:limit].rstrip() + "…"


class ShardedCorpusRuntime:
    def __init__(self, manifest_path: Path, shard_dir: Path):
        self.manifest_path = manifest_path
        self.shard_dir = shard_dir
        payload = json.loads(manifest_path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict) or payload.get("storage_mode") != "sharded":
            raise RuntimeError("Le manifeste de corpus n'est pas un release sharded.")
        self.manifest: dict[str, Any] = payload
        catalog = payload.get("catalog")
        shards = payload.get("shards")
        if not isinstance(catalog, dict) or not isinstance(shards, list) or not shards:
            raise RuntimeError("Manifeste sharded incomplet: catalogue ou shards manquants.")
        self.catalog_entry = catalog
        self.catalog_path = shard_dir / str(catalog.get("database") or "")
        self.shard_entries: dict[str, dict[str, Any]] = {}
        self.shard_paths: dict[str, Path] = {}
        for entry in shards:
            if not isinstance(entry, dict):
                continue
            shard_id = str(entry.get("id") or "").strip()
            database = str(entry.get("database") or "").strip()
            if not shard_id or not database or shard_id in self.shard_entries:
                raise RuntimeError("Identifiant ou fichier de shard invalide/dupliqué.")
            self.shard_entries[shard_id] = entry
            self.shard_paths[shard_id] = shard_dir / database
        raw_mapping = payload.get("book_to_shard") or {}
        if not isinstance(raw_mapping, dict):
            raise RuntimeError("book_to_shard doit être un objet.")
        self.book_to_shard = {str(key): str(value) for key, value in raw_mapping.items()}

    def validate(self) -> None:
        _validate_sqlite(self.catalog_path, {"books", "book_stats", "shard_stats", "corpus_meta"})
        for shard_id, path in self.shard_paths.items():
            _validate_sqlite(path, {"books", "chunks", "chunks_fts"})
            if shard_id not in self.shard_entries:
                raise RuntimeError(f"Shard non déclaré: {shard_id}")
        with open_readonly(self.catalog_path) as connection:
            books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
            chunks = int(connection.execute("SELECT COALESCE(SUM(chunks),0) FROM book_stats").fetchone()[0])
            mapped = int(connection.execute("SELECT COUNT(*) FROM book_stats").fetchone()[0])
        expected_books = int(self.manifest.get("books") or 0)
        expected_chunks = int(self.manifest.get("chunks") or 0)
        if books != expected_books or mapped != books or chunks != expected_chunks:
            raise RuntimeError(
                f"Catalogue sharded incohérent: books={books}/{expected_books}, mapped={mapped}, chunks={chunks}/{expected_chunks}"
            )
        unknown = sorted(set(self.book_to_shard.values()) - set(self.shard_paths))
        if unknown:
            raise RuntimeError(f"Le routage référence des shards inconnus: {unknown}")

    def status(self) -> dict[str, Any]:
        return {
            "engine": "rag-v5-hybrid-multilingual",
            "books": int(self.manifest.get("books") or 0),
            "chunks": int(self.manifest.get("chunks") or 0),
            "substantive_passages": int(self.manifest.get("substantive_passages") or 0),
            "fts_ready": True,
            "read_only": True,
            "semantic_embeddings": False,
            "storage_mode": "sharded",
            "shards": len(self.shard_paths),
            "openiti_books": int(self.manifest.get("openiti_books") or 0),
        }

    def list_books(self) -> list[dict[str, Any]]:
        with open_readonly(self.catalog_path) as connection:
            rows = connection.execute(
                """
                SELECT
                    b.id, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
                    b.pages, b.source_url, s.chunks, s.indexed_pages, s.shard_id
                FROM books b
                JOIN book_stats s ON s.book_id=b.id
                ORDER BY b.title COLLATE NOCASE, b.author COLLATE NOCASE
                """
            ).fetchall()
        return [dict(row) for row in rows]

    def list_library_books(self) -> list[dict[str, Any]]:
        with open_readonly(self.catalog_path) as connection:
            rows = connection.execute(
                """
                SELECT
                    b.id, b.kutub_id, b.title, b.title_ar, b.author, b.discipline,
                    b.madhhab, b.pages, b.description, b.source_url,
                    s.chunks, s.indexed_pages, s.arabic_passages,
                    s.french_passages, s.indexed_sections, s.shard_id
                FROM books b
                JOIN book_stats s ON s.book_id=b.id
                ORDER BY b.title COLLATE NOCASE, b.author COLLATE NOCASE
                """
            ).fetchall()
        books: list[dict[str, Any]] = []
        for row in rows:
            item = dict(row)
            for key in ("chunks", "indexed_pages", "arabic_passages", "french_passages", "indexed_sections"):
                item[key] = int(item.get(key) or 0)
            item["has_arabic"] = item["arabic_passages"] > 0
            item["has_french"] = item["french_passages"] > 0
            books.append(item)
        return books

    def shard_for_book(self, book_id: str) -> str:
        clean = str(book_id or "").strip()
        if not clean:
            raise ValueError("Identifiant d'ouvrage requis.")
        shard_id = self.book_to_shard.get(clean)
        if shard_id:
            return shard_id
        with open_readonly(self.catalog_path) as connection:
            row = connection.execute("SELECT shard_id FROM book_stats WHERE book_id=?", (clean,)).fetchone()
        if row is None:
            raise LookupError("Ouvrage introuvable dans le corpus.")
        shard_id = str(row[0])
        if shard_id not in self.shard_paths:
            raise RuntimeError(f"Shard introuvable pour {clean}: {shard_id}")
        self.book_to_shard[clean] = shard_id
        return shard_id

    @contextmanager
    def book_connection(self, book_id: str) -> Iterator[sqlite3.Connection]:
        shard_id = self.shard_for_book(book_id)
        connection = open_readonly(self.shard_paths[shard_id])
        try:
            yield connection
        finally:
            connection.close()

    def _route_book(self, query: str) -> dict[str, Any] | None:
        with open_readonly(self.catalog_path) as connection:
            return detect_book(connection, query)

    def search(
        self,
        query: str,
        *,
        limit: int = 8,
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        query = str(query or "").strip()
        if len(query) < 2:
            raise ValueError("La question est trop courte.")
        parsed_limit = max(1, min(int(limit), 20))
        routed_book = self._route_book(query)
        if routed_book:
            shard_ids = [self.shard_for_book(str(routed_book["id"]))]
        else:
            shard_ids = list(self.shard_paths)

        merged: list[dict[str, Any]] = []
        analyses: list[dict[str, Any]] = []
        shard_errors: list[str] = []
        per_shard_limit = max(parsed_limit, min(12, parsed_limit * 2))
        for shard_id in shard_ids:
            try:
                with open_readonly(self.shard_paths[shard_id]) as connection:
                    result = search_one_shard(
                        connection,
                        query,
                        limit=per_shard_limit,
                        madhhab=madhhab,
                        discipline=discipline,
                    )
                analysis = dict(result.get("analysis") or {})
                analysis["shard_id"] = shard_id
                analyses.append(analysis)
                for source in result.get("sources") or []:
                    item = dict(source)
                    item.pop("citation_id", None)
                    item["shard_id"] = shard_id
                    merged.append(item)
            except Exception as exc:
                shard_errors.append(f"{shard_id}: {type(exc).__name__}: {exc}")

        merged.sort(
            key=lambda item: (
                int(item.get("relevance") or 0),
                len(item.get("matched_concepts") or []),
                len(item.get("matched_terms") or []),
            ),
            reverse=True,
        )
        selected: list[dict[str, Any]] = []
        seen: set[tuple[Any, ...]] = set()
        for item in merged:
            key = (
                item.get("book_id"),
                item.get("page"),
                normalize_text(item.get("chapter", "")),
                normalize_text((item.get("text_ar") or item.get("text_fr") or "")[:180]),
            )
            if key in seen:
                continue
            seen.add(key)
            selected.append(item)
            if len(selected) >= parsed_limit:
                break
        for index, item in enumerate(selected, 1):
            item["citation_id"] = f"S{index}"

        base_analysis = next((dict(item) for item in analyses if item), {})
        if routed_book:
            base_analysis["routed_book"] = {
                "id": routed_book.get("id"),
                "title": routed_book.get("title"),
                "author": routed_book.get("author"),
                "reason": routed_book.get("route_reason"),
                "score": routed_book.get("route_score"),
            }
        base_analysis.update(
            {
                "engine": "rag-v5-hybrid-multilingual",
                "storage_mode": "sharded",
                "shards_queried": shard_ids,
                "shard_count": len(shard_ids),
                "candidate_count": sum(int(item.get("candidate_count") or 0) for item in analyses),
                "errors": [
                    error
                    for item in analyses
                    for error in (item.get("errors") or [])
                ]
                + shard_errors,
                "semantic_embeddings": False,
            }
        )
        return {
            "query": query,
            "analysis": base_analysis,
            "sources": selected,
            "count": len(selected),
        }

    def ask(
        self,
        query: str,
        *,
        limit: int = 8,
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        result = self.search(
            query,
            limit=limit,
            madhhab=madhhab,
            discipline=discipline,
        )
        sources = result["sources"]
        claims: list[dict[str, Any]] = []
        for source in sources[:4]:
            text = source.get("text_fr") or source.get("text_ar") or ""
            if text:
                claims.append(
                    {
                        "id": f"C{len(claims) + 1}",
                        "text": _trim(text),
                        "source_ids": [source["citation_id"]],
                        "kind": "direct_excerpt",
                        "relevance": source.get("relevance"),
                    }
                )
        if not sources:
            summary = "Aucun passage suffisamment pertinent n'a été retrouvé pour cette formulation. Le moteur ne fabrique pas de réponse sans preuve."
            verdict = "insufficient"
        elif result["analysis"].get("routed_book"):
            summary = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans l'ouvrage demandé."
            verdict = "evidence_found"
        else:
            summary = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans le corpus sharded."
            verdict = "evidence_found"
        return {
            **result,
            "answer": {
                "mode": "evidence_only",
                "summary": summary,
                "verdict": verdict,
                "claims": claims,
                "warning": "Les scores indiquent une pertinence documentaire, pas un degré de certitude religieuse.",
            },
        }
