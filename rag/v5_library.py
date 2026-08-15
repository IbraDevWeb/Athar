from __future__ import annotations

import json
import re
import sqlite3
from typing import Any

DEFAULT_READ_LIMIT = 8
MAX_READ_LIMIT = 12
MAX_SEARCH_LIMIT = 16
MAX_TOC_ITEMS = 360
MAX_OFFSET = 2_000_000
MAX_QUERY_CHARS = 180
TOKEN_RE = re.compile(r"[\w\u0600-\u06FF]+", re.UNICODE)


def _clean_id(value: Any) -> str:
    book_id = str(value or "").strip()
    if not book_id:
        raise ValueError("Identifiant d'ouvrage requis.")
    if len(book_id) > 180:
        raise ValueError("Identifiant d'ouvrage invalide.")
    return book_id


def _limit(value: Any) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return DEFAULT_READ_LIMIT
    return max(1, min(parsed, MAX_READ_LIMIT))


def _search_limit(value: Any) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return 10
    return max(1, min(parsed, MAX_SEARCH_LIMIT))


def _offset(value: Any) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return 0
    return max(0, min(parsed, MAX_OFFSET))


def _page(value: Any) -> int | None:
    if value in (None, ""):
        return None
    try:
        parsed = int(value)
    except (TypeError, ValueError) as exc:
        raise ValueError("Numéro de page invalide.") from exc
    if parsed <= 0:
        raise ValueError("Le numéro de page doit être positif.")
    return parsed


def _metadata(value: Any) -> dict[str, Any]:
    try:
        parsed = json.loads(str(value or "{}"))
    except (TypeError, ValueError, json.JSONDecodeError):
        return {}
    return parsed if isinstance(parsed, dict) else {}


def _query_tokens(value: Any) -> list[str]:
    query = str(value or "").strip()
    if not query:
        raise ValueError("Requête de recherche requise.")
    if len(query) > MAX_QUERY_CHARS:
        raise ValueError("La requête est trop longue.")
    tokens: list[str] = []
    seen: set[str] = set()
    for token in TOKEN_RE.findall(query):
        clean = token.strip()
        folded = clean.casefold()
        if len(clean) < 2 or folded in seen:
            continue
        seen.add(folded)
        tokens.append(clean)
        if len(tokens) >= 6:
            break
    if not tokens:
        raise ValueError("La requête ne contient aucun terme exploitable.")
    return tokens


def get_book(connection: sqlite3.Connection, book_id: Any) -> dict[str, Any]:
    book_id = _clean_id(book_id)
    row = connection.execute(
        """
        SELECT
            b.id, b.kutub_id, b.title, b.title_ar, b.author, b.discipline,
            b.madhhab, b.pages, b.description, b.source_url, b.metadata_json,
            COUNT(c.id) AS chunks,
            COUNT(DISTINCT CASE WHEN c.page IS NOT NULL AND c.page > 0 THEN c.page END) AS indexed_pages,
            MIN(CASE WHEN c.page IS NOT NULL AND c.page > 0 THEN c.page END) AS first_page,
            MAX(CASE WHEN c.page IS NOT NULL AND c.page > 0 THEN c.page END) AS last_page,
            SUM(CASE WHEN LENGTH(TRIM(COALESCE(c.text_ar, ''))) > 0 THEN 1 ELSE 0 END) AS arabic_passages,
            SUM(CASE WHEN LENGTH(TRIM(COALESCE(c.text_fr, ''))) > 0 THEN 1 ELSE 0 END) AS french_passages,
            COUNT(DISTINCT CASE WHEN LENGTH(TRIM(COALESCE(c.chapter, ''))) > 0 THEN TRIM(c.chapter) END) AS indexed_sections
        FROM books b
        LEFT JOIN chunks c ON c.book_id=b.id
        WHERE b.id=?
        GROUP BY b.id
        LIMIT 1
        """,
        (book_id,),
    ).fetchone()
    if row is None:
        raise LookupError("Ouvrage introuvable dans le corpus.")
    payload = dict(row)
    payload["chunks"] = int(payload.get("chunks") or 0)
    payload["indexed_pages"] = int(payload.get("indexed_pages") or 0)
    payload["arabic_passages"] = int(payload.get("arabic_passages") or 0)
    payload["french_passages"] = int(payload.get("french_passages") or 0)
    payload["indexed_sections"] = int(payload.get("indexed_sections") or 0)
    payload["metadata"] = _metadata(payload.pop("metadata_json", "{}"))
    payload["has_arabic"] = payload["arabic_passages"] > 0
    payload["has_french"] = payload["french_passages"] > 0
    return payload


def get_toc(connection: sqlite3.Connection, book_id: Any, *, limit: Any = MAX_TOC_ITEMS) -> dict[str, Any]:
    book_id = _clean_id(book_id)
    get_book(connection, book_id)
    try:
        parsed_limit = int(limit)
    except (TypeError, ValueError):
        parsed_limit = MAX_TOC_ITEMS
    parsed_limit = max(1, min(parsed_limit, MAX_TOC_ITEMS))

    total = int(
        connection.execute(
            """
            SELECT COUNT(*) FROM (
                SELECT 1
                FROM chunks
                WHERE book_id=? AND LENGTH(TRIM(COALESCE(chapter, ''))) > 0
                GROUP BY TRIM(chapter)
            )
            """,
            (book_id,),
        ).fetchone()[0]
    )
    rows = connection.execute(
        """
        SELECT
            TRIM(chapter) AS chapter,
            MIN(CASE WHEN page IS NOT NULL AND page > 0 THEN page END) AS first_page,
            MAX(CASE WHEN page IS NOT NULL AND page > 0 THEN page END) AS last_page,
            COUNT(*) AS passages,
            COUNT(DISTINCT CASE WHEN page IS NOT NULL AND page > 0 THEN page END) AS pages
        FROM chunks
        WHERE book_id=? AND LENGTH(TRIM(COALESCE(chapter, ''))) > 0
        GROUP BY TRIM(chapter)
        ORDER BY
            CASE WHEN MIN(CASE WHEN page IS NOT NULL AND page > 0 THEN page END) IS NULL THEN 1 ELSE 0 END,
            MIN(CASE WHEN page IS NOT NULL AND page > 0 THEN page END) ASC,
            MIN(rowid) ASC
        LIMIT ?
        """,
        (book_id, parsed_limit),
    ).fetchall()
    items: list[dict[str, Any]] = []
    for index, row in enumerate(rows, start=1):
        item = dict(row)
        item["chapter"] = str(item.get("chapter") or "")[:360]
        item["passages"] = int(item.get("passages") or 0)
        item["pages"] = int(item.get("pages") or 0)
        item["sequence"] = index
        items.append(item)
    return {
        "book_id": book_id,
        "total": total,
        "limit": parsed_limit,
        "truncated": total > len(items),
        "items": items,
    }


def search_book(
    connection: sqlite3.Connection,
    book_id: Any,
    query: Any,
    *,
    limit: Any = 10,
) -> dict[str, Any]:
    book_id = _clean_id(book_id)
    book = get_book(connection, book_id)
    tokens = _query_tokens(query)
    parsed_limit = _search_limit(limit)

    token_clauses: list[str] = []
    params: list[Any] = [book_id]
    for token in tokens:
        token_clauses.append(
            "(COALESCE(chapter, '') LIKE ? OR COALESCE(text_ar, '') LIKE ? OR COALESCE(text_fr, '') LIKE ?)"
        )
        pattern = f"%{token}%"
        params.extend((pattern, pattern, pattern))
    where = " AND ".join(["book_id=?", *token_clauses])

    rows = connection.execute(
        f"""
        SELECT id, page, chapter, text_ar, text_fr, translation_status, source_url
        FROM chunks
        WHERE {where}
        ORDER BY
            CASE WHEN page IS NULL OR page <= 0 THEN 1 ELSE 0 END,
            page ASC,
            rowid ASC
        LIMIT ?
        """,
        (*params, parsed_limit),
    ).fetchall()

    hits: list[dict[str, Any]] = []
    for row in rows:
        item = dict(row)
        item["text_ar"] = str(item.get("text_ar") or "")
        item["text_fr"] = str(item.get("text_fr") or "")
        item["chapter"] = str(item.get("chapter") or "")
        hits.append(item)
    return {
        "book": book,
        "query": str(query or "").strip(),
        "tokens": tokens,
        "count": len(hits),
        "limit": parsed_limit,
        "hits": hits,
    }


def read_book(
    connection: sqlite3.Connection,
    book_id: Any,
    *,
    offset: Any = 0,
    limit: Any = DEFAULT_READ_LIMIT,
    page: Any = None,
) -> dict[str, Any]:
    book_id = _clean_id(book_id)
    limit = _limit(limit)
    offset = _offset(offset)
    page = _page(page)

    book = get_book(connection, book_id)
    clauses = ["book_id=?"]
    params: list[Any] = [book_id]
    previous_page: int | None = None
    next_page: int | None = None
    if page is not None:
        clauses.append("page=?")
        params.append(page)
        previous_row = connection.execute(
            "SELECT MAX(page) FROM chunks WHERE book_id=? AND page IS NOT NULL AND page > 0 AND page < ?",
            (book_id, page),
        ).fetchone()
        next_row = connection.execute(
            "SELECT MIN(page) FROM chunks WHERE book_id=? AND page IS NOT NULL AND page > ?",
            (book_id, page),
        ).fetchone()
        previous_page = int(previous_row[0]) if previous_row and previous_row[0] is not None else None
        next_page = int(next_row[0]) if next_row and next_row[0] is not None else None
    where = " AND ".join(clauses)

    total = int(
        connection.execute(f"SELECT COUNT(*) FROM chunks WHERE {where}", tuple(params)).fetchone()[0]
    )
    if total == 0 and page is not None:
        raise LookupError("Cette page n'est pas indexée pour cet ouvrage.")
    if total and offset >= total:
        offset = max(0, ((total - 1) // limit) * limit)

    rows = connection.execute(
        f"""
        SELECT id, page, chapter, text_ar, text_fr, translation_status, source_url
        FROM chunks
        WHERE {where}
        ORDER BY
            CASE WHEN page IS NULL OR page <= 0 THEN 1 ELSE 0 END,
            page ASC,
            rowid ASC
        LIMIT ? OFFSET ?
        """,
        (*params, limit, offset),
    ).fetchall()

    passages: list[dict[str, Any]] = []
    for index, row in enumerate(rows, start=offset + 1):
        item = dict(row)
        item["sequence"] = index
        passages.append(item)

    next_offset = offset + len(passages)
    if next_offset >= total:
        next_offset = None
    previous_offset = max(0, offset - limit) if offset > 0 else None

    return {
        "book": book,
        "page": page,
        "offset": offset,
        "limit": limit,
        "total": total,
        "next_offset": next_offset,
        "previous_offset": previous_offset,
        "next_page": next_page,
        "previous_page": previous_page,
        "passages": passages,
    }
