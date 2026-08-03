from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
import unicodedata
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "rag" / "data" / "athar_rag.sqlite"
SEED_PATH = ROOT / "rag" / "seed.json"

ARABIC_DIACRITICS = re.compile(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]")
NON_WORD = re.compile(r"[^\w\u0600-\u06FF]+", re.UNICODE)
SPACE = re.compile(r"\s+")

QUERY_EXPANSIONS = {
    "ablution": ["وضوء", "wudu", "purification"],
    "wudu": ["وضوء", "ablution", "purification"],
    "tayammum": ["تيمم", "purification sèche"],
    "voyage": ["سفر", "voyageur", "مسافر"],
    "voyageur": ["سفر", "مسافر", "voyage"],
    "prière": ["صلاة", "salat"],
    "regrouper": ["جمع", "regroupement"],
    "regroupement": ["جمع", "regrouper"],
    "jeûne": ["صيام", "صوم", "ramadan"],
    "intention": ["نية", "niyya"],
    "miséricorde": ["رحمة", "رحم"],
    "patience": ["صبر", "sabr"],
    "pardon": ["مغفرة", "غفران", "غفر"],
    "tafsir": ["تفسير", "exégèse"],
    "exégèse": ["تفسير", "tafsir"],
    "malikite": ["mālikite", "مالكي", "مالك"],
    "mālikite": ["malikite", "مالكي", "مالك"],
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def normalize_arabic(value: str) -> str:
    value = ARABIC_DIACRITICS.sub("", value or "")
    return (
        value.replace("أ", "ا")
        .replace("إ", "ا")
        .replace("آ", "ا")
        .replace("ٱ", "ا")
        .replace("ى", "ي")
        .replace("ؤ", "و")
        .replace("ئ", "ي")
        .replace("ة", "ه")
        .replace("ـ", "")
    )


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = normalize_arabic(value).lower()
    value = NON_WORD.sub(" ", value)
    return SPACE.sub(" ", value).strip()


def expand_query(query: str) -> list[str]:
    clean = normalize_text(query)
    terms = [term for term in clean.split() if len(term) > 1]
    expanded = list(terms)
    for term in terms:
        for extra in QUERY_EXPANSIONS.get(term, []):
            expanded.extend(normalize_text(extra).split())
    return list(dict.fromkeys(term for term in expanded if term))


def content_hash(*parts: Any) -> str:
    payload = "\n".join(str(part or "") for part in parts)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def connect(db_path: Path | str = DEFAULT_DB) -> sqlite3.Connection:
    path = Path(db_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")
    connection.execute("PRAGMA foreign_keys=ON")
    return connection


def initialize_database(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS books (
            id TEXT PRIMARY KEY,
            kutub_id INTEGER,
            title TEXT NOT NULL,
            title_ar TEXT,
            author TEXT,
            discipline TEXT,
            madhhab TEXT,
            pages INTEGER,
            description TEXT,
            source_url TEXT NOT NULL,
            scraped_at TEXT,
            metadata_json TEXT NOT NULL DEFAULT '{}'
        );

        CREATE TABLE IF NOT EXISTS chunks (
            id TEXT PRIMARY KEY,
            book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
            page INTEGER,
            chapter TEXT,
            text_ar TEXT,
            text_fr TEXT,
            translation_status TEXT NOT NULL DEFAULT 'unknown',
            source_url TEXT NOT NULL,
            content_hash TEXT NOT NULL,
            scraped_at TEXT NOT NULL,
            metadata_json TEXT NOT NULL DEFAULT '{}'
        );

        CREATE INDEX IF NOT EXISTS idx_chunks_book ON chunks(book_id);
        CREATE INDEX IF NOT EXISTS idx_chunks_page ON chunks(book_id, page);
        """
    )
    try:
        connection.execute(
            """
            CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
                chunk_id UNINDEXED,
                title,
                title_ar,
                author,
                chapter,
                text_ar,
                text_fr,
                normalized,
                tokenize='unicode61 remove_diacritics 2'
            )
            """
        )
    except sqlite3.OperationalError:
        # Quelques distributions SQLite anciennes peuvent être compilées sans FTS5.
        pass
    connection.commit()


def upsert_book(connection: sqlite3.Connection, book: dict[str, Any]) -> None:
    connection.execute(
        """
        INSERT INTO books (
            id, kutub_id, title, title_ar, author, discipline, madhhab, pages,
            description, source_url, scraped_at, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            kutub_id=excluded.kutub_id,
            title=excluded.title,
            title_ar=excluded.title_ar,
            author=excluded.author,
            discipline=excluded.discipline,
            madhhab=excluded.madhhab,
            pages=COALESCE(excluded.pages, books.pages),
            description=excluded.description,
            source_url=excluded.source_url,
            scraped_at=excluded.scraped_at,
            metadata_json=excluded.metadata_json
        """,
        (
            book["id"],
            book.get("kutub_id"),
            book.get("title", ""),
            book.get("title_ar", ""),
            book.get("author", ""),
            book.get("discipline", ""),
            book.get("madhhab", ""),
            book.get("pages"),
            book.get("description", ""),
            book.get("source_url", ""),
            book.get("scraped_at") or utc_now(),
            json.dumps(book.get("metadata", {}), ensure_ascii=False),
        ),
    )


def upsert_chunk(connection: sqlite3.Connection, chunk: dict[str, Any]) -> None:
    digest = chunk.get("content_hash") or content_hash(
        chunk.get("book_id"),
        chunk.get("page"),
        chunk.get("chapter"),
        chunk.get("text_ar"),
        chunk.get("text_fr"),
    )
    row = (
        chunk["id"],
        chunk["book_id"],
        chunk.get("page"),
        chunk.get("chapter", ""),
        chunk.get("text_ar", ""),
        chunk.get("text_fr", ""),
        chunk.get("translation_status", "unknown"),
        chunk.get("source_url", ""),
        digest,
        chunk.get("scraped_at") or utc_now(),
        json.dumps(chunk.get("metadata", {}), ensure_ascii=False),
    )
    connection.execute(
        """
        INSERT INTO chunks (
            id, book_id, page, chapter, text_ar, text_fr, translation_status,
            source_url, content_hash, scraped_at, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            page=excluded.page,
            chapter=excluded.chapter,
            text_ar=excluded.text_ar,
            text_fr=excluded.text_fr,
            translation_status=excluded.translation_status,
            source_url=excluded.source_url,
            content_hash=excluded.content_hash,
            scraped_at=excluded.scraped_at,
            metadata_json=excluded.metadata_json
        """,
        row,
    )
    try:
        book = connection.execute("SELECT * FROM books WHERE id = ?", (chunk["book_id"],)).fetchone()
        if book:
            normalized = normalize_text(
                " ".join(
                    filter(
                        None,
                        [
                            book["title"],
                            book["title_ar"],
                            book["author"],
                            chunk.get("chapter", ""),
                            chunk.get("text_ar", ""),
                            chunk.get("text_fr", ""),
                        ],
                    )
                )
            )
            connection.execute("DELETE FROM chunks_fts WHERE chunk_id = ?", (chunk["id"],))
            connection.execute(
                "INSERT INTO chunks_fts VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    chunk["id"],
                    book["title"],
                    book["title_ar"],
                    book["author"],
                    chunk.get("chapter", ""),
                    chunk.get("text_ar", ""),
                    chunk.get("text_fr", ""),
                    normalized,
                ),
            )
    except sqlite3.OperationalError:
        pass


def import_seed(connection: sqlite3.Connection, seed_path: Path | str = SEED_PATH) -> None:
    payload = json.loads(Path(seed_path).read_text(encoding="utf-8"))
    for book in payload.get("books", []):
        upsert_book(connection, book)
    for chunk in payload.get("chunks", []):
        upsert_chunk(connection, chunk)
    connection.commit()


def ensure_database(db_path: Path | str = DEFAULT_DB) -> sqlite3.Connection:
    connection = connect(db_path)
    initialize_database(connection)
    count = connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    if not count and SEED_PATH.exists():
        import_seed(connection)
    return connection


def _fts_query(terms: Iterable[str]) -> str:
    safe = []
    for term in terms:
        token = re.sub(r"[^\w\u0600-\u06FF]", "", term)
        if token:
            safe.append(f'"{token}"*')
    return " OR ".join(safe)


def search_chunks(
    connection: sqlite3.Connection,
    query: str,
    *,
    madhhab: str = "",
    discipline: str = "",
    limit: int = 8,
) -> list[dict[str, Any]]:
    terms = expand_query(query)
    if not terms:
        return []

    filters: list[str] = []
    params: list[Any] = []
    if madhhab and madhhab.lower() not in {"all", "tous", "toutes"}:
        filters.append("LOWER(b.madhhab) LIKE ?")
        params.append(f"%{madhhab.lower()}%")
    if discipline and discipline.lower() not in {"all", "tous", "toutes"}:
        filters.append("LOWER(b.discipline) LIKE ?")
        params.append(f"%{discipline.lower()}%")
    where_extra = (" AND " + " AND ".join(filters)) if filters else ""

    rows: list[sqlite3.Row] = []
    fts = _fts_query(terms)
    try:
        rows = connection.execute(
            f"""
            SELECT c.*, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
                   b.description, bm25(chunks_fts, 4.0, 4.0, 2.8, 1.8, 1.5, 1.3, 1.0) AS rank
            FROM chunks_fts
            JOIN chunks c ON c.id = chunks_fts.chunk_id
            JOIN books b ON b.id = c.book_id
            WHERE chunks_fts MATCH ? {where_extra}
            ORDER BY rank ASC
            LIMIT ?
            """,
            [fts, *params, max(1, min(limit, 25))],
        ).fetchall()
    except sqlite3.OperationalError:
        like = "%" + "%".join(terms[:4]) + "%"
        rows = connection.execute(
            f"""
            SELECT c.*, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
                   b.description, 99.0 AS rank
            FROM chunks c
            JOIN books b ON b.id = c.book_id
            WHERE LOWER(COALESCE(c.text_fr,'') || ' ' || COALESCE(c.text_ar,'') || ' ' ||
                        COALESCE(c.chapter,'') || ' ' || b.title || ' ' || COALESCE(b.title_ar,'')) LIKE ?
                  {where_extra}
            LIMIT ?
            """,
            [like, *params, max(1, min(limit, 25))],
        ).fetchall()

    clean_query = normalize_text(query)
    results: list[dict[str, Any]] = []
    for index, row in enumerate(rows):
        haystack = normalize_text(
            " ".join(
                [
                    row["title"] or "",
                    row["title_ar"] or "",
                    row["author"] or "",
                    row["chapter"] or "",
                    row["text_ar"] or "",
                    row["text_fr"] or "",
                ]
            )
        )
        exact_bonus = 24 if clean_query and clean_query in haystack else 0
        term_hits = sum(1 for term in terms if term in haystack)
        score = max(1, min(100, 48 + exact_bonus + term_hits * 7 - index * 2))
        results.append(
            {
                "id": row["id"],
                "book_id": row["book_id"],
                "title": row["title"],
                "title_ar": row["title_ar"],
                "author": row["author"],
                "discipline": row["discipline"],
                "madhhab": row["madhhab"],
                "page": row["page"],
                "chapter": row["chapter"],
                "text_ar": row["text_ar"],
                "text_fr": row["text_fr"],
                "translation_status": row["translation_status"],
                "source_url": row["source_url"],
                "score": score,
            }
        )
    return results


def extractive_answer(query: str, results: list[dict[str, Any]]) -> str:
    if not results:
        return "Aucun passage suffisamment pertinent n’a été retrouvé dans le corpus actuellement indexé."
    lines = [f"Voici les passages les plus proches de la question « {query.strip()} » :"]
    for index, result in enumerate(results[:4], start=1):
        text = (result.get("text_fr") or result.get("text_ar") or "").strip()
        text = SPACE.sub(" ", text)
        if len(text) > 320:
            text = text[:317].rstrip() + "…"
        location = result.get("chapter") or "Passage indexé"
        if result.get("page") is not None:
            location += f", page {result['page']}"
        lines.append(f"[{index}] {text} — {result['title']}, {location}.")
    lines.append("Cette synthèse est extractive : elle ne tranche pas une question religieuse au-delà des passages retrouvés.")
    return "\n\n".join(lines)


def ollama_answer(query: str, results: list[dict[str, Any]]) -> str | None:
    model = os.getenv("ATHAR_OLLAMA_MODEL", "").strip()
    if not model or not results:
        return None
    endpoint = os.getenv("ATHAR_OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/") + "/api/generate"
    sources = []
    for index, result in enumerate(results[:6], start=1):
        sources.append(
            "\n".join(
                [
                    f"[S{index}] {result['title']} — {result['author']}",
                    f"Chapitre: {result.get('chapter') or 'non indiqué'}; page: {result.get('page')}",
                    f"Arabe: {result.get('text_ar') or ''}",
                    f"Français: {result.get('text_fr') or ''}",
                ]
            )
        )
    prompt = f"""
Tu es le moteur RAG d'Athar Pro. Réponds en français uniquement à partir des sources ci-dessous.
Règles impératives :
- ne complète jamais avec une information absente des sources ;
- cite chaque affirmation avec [S1], [S2], etc. ;
- distingue clairement les divergences ;
- précise lorsqu'une traduction est générée par IA ;
- si les sources sont insuffisantes, dis-le explicitement.

Question : {query}

Sources :
{chr(10).join(sources)}
""".strip()
    request = urllib.request.Request(
        endpoint,
        data=json.dumps({"model": model, "prompt": prompt, "stream": False}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            payload = json.loads(response.read().decode("utf-8"))
            answer = str(payload.get("response") or "").strip()
            return answer or None
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None


def answer_question(
    connection: sqlite3.Connection,
    query: str,
    *,
    madhhab: str = "",
    discipline: str = "",
    limit: int = 8,
) -> dict[str, Any]:
    results = search_chunks(
        connection,
        query,
        madhhab=madhhab,
        discipline=discipline,
        limit=limit,
    )
    generated = ollama_answer(query, results)
    return {
        "query": query,
        "answer": generated or extractive_answer(query, results),
        "answer_mode": "ollama_grounded" if generated else "extractive",
        "results": results,
        "count": len(results),
    }


def database_status(connection: sqlite3.Connection) -> dict[str, Any]:
    books = connection.execute("SELECT COUNT(*) FROM books").fetchone()[0]
    chunks = connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    pages = connection.execute("SELECT COUNT(DISTINCT book_id || ':' || COALESCE(page, -1)) FROM chunks").fetchone()[0]
    latest = connection.execute("SELECT MAX(scraped_at) FROM chunks").fetchone()[0]
    demo = connection.execute("SELECT COUNT(*) FROM chunks WHERE translation_status = 'catalogue_public'").fetchone()[0]
    return {
        "books": books,
        "chunks": chunks,
        "pages": pages,
        "last_sync": latest,
        "demo_chunks": demo,
        "mode": "demo" if chunks and chunks == demo else "local_corpus",
        "ollama_enabled": bool(os.getenv("ATHAR_OLLAMA_MODEL", "").strip()),
    }
