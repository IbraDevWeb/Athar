from __future__ import annotations

import json
import sqlite3
from typing import Any

from core import utc_now

PAGE_STATES = {"pending", "imported", "empty", "duplicate", "error", "blocked", "skipped"}
RUN_STATES = {"running", "completed", "partial", "failed", "blocked"}
FINAL_PAGE_STATES = {"imported", "duplicate", "skipped"}


def initialize_ingestion(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS ingestion_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'running',
            started_at TEXT NOT NULL,
            finished_at TEXT,
            requested_books INTEGER NOT NULL DEFAULT 0,
            attempted_pages INTEGER NOT NULL DEFAULT 0,
            imported_pages INTEGER NOT NULL DEFAULT 0,
            imported_chunks INTEGER NOT NULL DEFAULT 0,
            duplicate_pages INTEGER NOT NULL DEFAULT 0,
            empty_pages INTEGER NOT NULL DEFAULT 0,
            failed_pages INTEGER NOT NULL DEFAULT 0,
            blocked_pages INTEGER NOT NULL DEFAULT 0,
            message TEXT,
            metadata_json TEXT NOT NULL DEFAULT '{}'
        );

        CREATE TABLE IF NOT EXISTS ingestion_pages (
            book_id TEXT NOT NULL,
            page INTEGER NOT NULL,
            run_id INTEGER REFERENCES ingestion_runs(id) ON DELETE SET NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            chunk_count INTEGER NOT NULL DEFAULT 0,
            quality_score INTEGER NOT NULL DEFAULT 0,
            arabic_chars INTEGER NOT NULL DEFAULT 0,
            french_chars INTEGER NOT NULL DEFAULT 0,
            content_hash TEXT,
            source_url TEXT,
            error TEXT,
            attempts INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL,
            metadata_json TEXT NOT NULL DEFAULT '{}',
            PRIMARY KEY (book_id, page)
        );

        CREATE INDEX IF NOT EXISTS idx_ingestion_pages_status ON ingestion_pages(status);
        CREATE INDEX IF NOT EXISTS idx_ingestion_pages_run ON ingestion_pages(run_id);
        CREATE INDEX IF NOT EXISTS idx_ingestion_runs_started ON ingestion_runs(started_at DESC);
        """
    )
    connection.commit()


def quality_score(arabic_chars: int, french_chars: int, chunks: int, chapter_detected: bool) -> int:
    score = 0
    if arabic_chars >= 120:
        score += 38
    elif arabic_chars >= 40:
        score += 20
    if french_chars >= 160:
        score += 30
    elif french_chars >= 60:
        score += 15
    if chunks >= 1:
        score += 18
    if chunks >= 2:
        score += 6
    if chapter_detected:
        score += 8
    return max(0, min(score, 100))


def bootstrap_legacy_state(connection: sqlite3.Connection) -> int:
    """Crée un état minimal pour les pages présentes avant le pipeline v3."""
    initialize_ingestion(connection)
    rows = connection.execute(
        """
        SELECT c.book_id, c.page, COUNT(*) AS chunk_count,
               SUM(LENGTH(COALESCE(c.text_ar, ''))) AS arabic_chars,
               SUM(LENGTH(COALESCE(c.text_fr, ''))) AS french_chars,
               MAX(c.scraped_at) AS updated_at
        FROM chunks c
        WHERE c.page IS NOT NULL AND c.page > 0
        GROUP BY c.book_id, c.page
        """
    ).fetchall()
    inserted = 0
    for row in rows:
        if connection.execute(
            "SELECT 1 FROM ingestion_pages WHERE book_id=? AND page=?",
            (row["book_id"], row["page"]),
        ).fetchone():
            continue
        arabic_chars = int(row["arabic_chars"] or 0)
        french_chars = int(row["french_chars"] or 0)
        connection.execute(
            """
            INSERT INTO ingestion_pages (
                book_id, page, status, chunk_count, quality_score, arabic_chars,
                french_chars, attempts, updated_at, metadata_json
            ) VALUES (?, ?, 'imported', ?, ?, ?, ?, 1, ?, ?)
            """,
            (
                row["book_id"],
                row["page"],
                row["chunk_count"],
                quality_score(arabic_chars, french_chars, int(row["chunk_count"] or 0), True),
                arabic_chars,
                french_chars,
                row["updated_at"] or utc_now(),
                json.dumps({"origin": "legacy_bootstrap"}, ensure_ascii=False),
            ),
        )
        inserted += 1
    connection.commit()
    return inserted


def start_run(
    connection: sqlite3.Connection,
    source: str,
    requested_books: int,
    metadata: dict[str, Any] | None = None,
) -> int:
    initialize_ingestion(connection)
    cursor = connection.execute(
        """
        INSERT INTO ingestion_runs (source, status, started_at, requested_books, metadata_json)
        VALUES (?, 'running', ?, ?, ?)
        """,
        (source, utc_now(), requested_books, json.dumps(metadata or {}, ensure_ascii=False)),
    )
    connection.commit()
    return int(cursor.lastrowid)


def mark_page(
    connection: sqlite3.Connection,
    *,
    book_id: str,
    page: int,
    run_id: int | None,
    status: str,
    chunk_count: int = 0,
    quality: int = 0,
    arabic_chars: int = 0,
    french_chars: int = 0,
    digest: str = "",
    source_url: str = "",
    error: str = "",
    metadata: dict[str, Any] | None = None,
) -> None:
    if status not in PAGE_STATES:
        raise ValueError(f"État de page invalide : {status}")
    initialize_ingestion(connection)
    connection.execute(
        """
        INSERT INTO ingestion_pages (
            book_id, page, run_id, status, chunk_count, quality_score,
            arabic_chars, french_chars, content_hash, source_url, error,
            attempts, updated_at, metadata_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(book_id, page) DO UPDATE SET
            run_id=excluded.run_id,
            status=excluded.status,
            chunk_count=excluded.chunk_count,
            quality_score=excluded.quality_score,
            arabic_chars=excluded.arabic_chars,
            french_chars=excluded.french_chars,
            content_hash=excluded.content_hash,
            source_url=excluded.source_url,
            error=excluded.error,
            attempts=ingestion_pages.attempts + 1,
            updated_at=excluded.updated_at,
            metadata_json=excluded.metadata_json
        """,
        (
            book_id,
            page,
            run_id,
            status,
            chunk_count,
            quality,
            arabic_chars,
            french_chars,
            digest,
            source_url,
            error[:1000],
            utc_now(),
            json.dumps(metadata or {}, ensure_ascii=False),
        ),
    )
    connection.commit()


def finish_run(
    connection: sqlite3.Connection,
    run_id: int,
    *,
    status: str,
    message: str = "",
    counters: dict[str, int] | None = None,
) -> None:
    if status not in RUN_STATES:
        raise ValueError(f"État d’exécution invalide : {status}")
    values = counters or {}
    connection.execute(
        """
        UPDATE ingestion_runs SET
            status=?, finished_at=?, attempted_pages=?, imported_pages=?,
            imported_chunks=?, duplicate_pages=?, empty_pages=?, failed_pages=?,
            blocked_pages=?, message=?
        WHERE id=?
        """,
        (
            status,
            utc_now(),
            int(values.get("attempted_pages", 0)),
            int(values.get("imported_pages", 0)),
            int(values.get("imported_chunks", 0)),
            int(values.get("duplicate_pages", 0)),
            int(values.get("empty_pages", 0)),
            int(values.get("failed_pages", 0)),
            int(values.get("blocked_pages", 0)),
            message[:1000],
            run_id,
        ),
    )
    connection.commit()


def first_missing_final_page(connection: sqlite3.Connection, book_id: str) -> int:
    """Retourne le premier trou, même si un extrait isolé existe sur une page éloignée."""
    rows = connection.execute(
        """
        SELECT page FROM ingestion_pages
        WHERE book_id=? AND status IN ('imported', 'duplicate', 'skipped') AND page > 0
        ORDER BY page ASC
        """,
        (book_id,),
    ).fetchall()
    expected = 1
    for row in rows:
        page = int(row["page"])
        if page < expected:
            continue
        if page > expected:
            break
        expected += 1
    return expected


def next_page(connection: sqlite3.Connection, book_id: str, retry_errors: bool = True) -> int:
    initialize_ingestion(connection)
    if retry_errors:
        row = connection.execute(
            """
            SELECT page FROM ingestion_pages
            WHERE book_id=? AND status IN ('error', 'empty') AND page > 0
            ORDER BY page ASC LIMIT 1
            """,
            (book_id,),
        ).fetchone()
        if row:
            return int(row["page"])
    return first_missing_final_page(connection, book_id)


def ingestion_status(connection: sqlite3.Connection) -> dict[str, Any]:
    initialize_ingestion(connection)
    bootstrap_legacy_state(connection)
    totals = connection.execute(
        """
        SELECT COUNT(*) AS tracked_pages,
               SUM(CASE WHEN status='imported' THEN 1 ELSE 0 END) AS imported,
               SUM(CASE WHEN status='duplicate' THEN 1 ELSE 0 END) AS duplicates,
               SUM(CASE WHEN status='empty' THEN 1 ELSE 0 END) AS empty_pages,
               SUM(CASE WHEN status='error' THEN 1 ELSE 0 END) AS errors,
               SUM(CASE WHEN status='blocked' THEN 1 ELSE 0 END) AS blocked,
               ROUND(AVG(CASE WHEN status='imported' THEN quality_score END), 1) AS average_quality
        FROM ingestion_pages
        """
    ).fetchone()
    books = connection.execute(
        """
        SELECT b.id, b.kutub_id, b.title, b.author, b.pages,
               COUNT(p.page) AS tracked_pages,
               SUM(CASE WHEN p.status='imported' THEN 1 ELSE 0 END) AS imported_pages,
               SUM(CASE WHEN p.status='duplicate' THEN 1 ELSE 0 END) AS duplicate_pages,
               SUM(CASE WHEN p.status='error' THEN 1 ELSE 0 END) AS error_pages,
               SUM(CASE WHEN p.status='blocked' THEN 1 ELSE 0 END) AS blocked_pages,
               ROUND(AVG(CASE WHEN p.status='imported' THEN p.quality_score END), 1) AS quality,
               MAX(p.updated_at) AS last_update
        FROM books b LEFT JOIN ingestion_pages p ON p.book_id=b.id
        GROUP BY b.id ORDER BY imported_pages DESC, b.title ASC
        """
    ).fetchall()
    runs = connection.execute("SELECT * FROM ingestion_runs ORDER BY id DESC LIMIT 10").fetchall()
    book_payload = []
    for row in books:
        item = dict(row)
        total_pages = int(item.get("pages") or 0)
        imported_pages = int(item.get("imported_pages") or 0)
        item["progress"] = round((imported_pages / total_pages) * 100) if total_pages else 0
        item["next_page"] = next_page(connection, item["id"], retry_errors=True)
        book_payload.append(item)
    return {
        "tracked_pages": int(totals["tracked_pages"] or 0),
        "imported_pages": int(totals["imported"] or 0),
        "duplicate_pages": int(totals["duplicates"] or 0),
        "empty_pages": int(totals["empty_pages"] or 0),
        "error_pages": int(totals["errors"] or 0),
        "blocked_pages": int(totals["blocked"] or 0),
        "average_quality": float(totals["average_quality"] or 0),
        "books": book_payload,
        "runs": [dict(row) for row in runs],
        "command": "sync-kutub.bat",
    }
