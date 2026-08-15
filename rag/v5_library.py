from __future__ import annotations

import json
import sqlite3
from typing import Any

DEFAULT_READ_LIMIT = 8
MAX_READ_LIMIT = 12
MAX_OFFSET = 2_000_000


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
            SUM(CASE WHEN LENGTH(TRIM(COALESCE(c.text_fr, ''))) > 0 THEN 1 ELSE 0 END) AS french_passages
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
    payload["metadata"] = _metadata(payload.pop("metadata_json", "{}"))
    return payload


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
    if page is not None:
        clauses.append("page=?")
        params.append(page)
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
        "passages": passages,
    }
