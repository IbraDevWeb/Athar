from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import os
import shutil
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from core import initialize_database
from corpus_shards import load_shardable_manifest
from ingest_openiti import sync_books
from ingest_tafsir import compact_search_index
from prepare_hosted_db import prepare_database

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
DEFAULT_REGISTRY = RAG_DIR / "corpus_shards.json"
DEFAULT_OUTPUT_DIR = RAG_DIR / "data" / "sharded_build"
SQLITE_HEADER = b"SQLite format 3\x00"

BOOK_COLUMNS = (
    "id",
    "kutub_id",
    "title",
    "title_ar",
    "author",
    "discipline",
    "madhhab",
    "pages",
    "description",
    "source_url",
    "scraped_at",
    "metadata_json",
)
CHUNK_COLUMNS = (
    "id",
    "book_id",
    "page",
    "chapter",
    "text_ar",
    "text_fr",
    "translation_status",
    "source_url",
    "content_hash",
    "scraped_at",
    "metadata_json",
)
FTS_COLUMNS = (
    "chunk_id",
    "title",
    "title_ar",
    "author",
    "chapter",
    "text_ar",
    "text_fr",
    "normalized",
)


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _reset_database(path: Path) -> None:
    for candidate in (path, Path(f"{path}-wal"), Path(f"{path}-shm")):
        candidate.unlink(missing_ok=True)
    path.parent.mkdir(parents=True, exist_ok=True)


def _open_rw(path: Path) -> sqlite3.Connection:
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    connection.execute("PRAGMA synchronous=NORMAL")
    connection.execute("PRAGMA temp_store=FILE")
    return connection


def _validate_header(path: Path) -> None:
    if not path.exists() or path.stat().st_size < len(SQLITE_HEADER):
        raise RuntimeError(f"SQLite absent ou vide: {path}")
    with path.open("rb") as handle:
        if handle.read(len(SQLITE_HEADER)) != SQLITE_HEADER:
            raise RuntimeError(f"En-tête SQLite invalide: {path}")


def _finalize_database(path: Path) -> dict[str, int]:
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    try:
        compact_search_index(connection)
        connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        connection.execute("PRAGMA journal_mode=DELETE")
        connection.execute("VACUUM")
        check = connection.execute("PRAGMA quick_check").fetchone()
        if not check or str(check[0]).lower() != "ok":
            raise RuntimeError(f"PRAGMA quick_check a échoué pour {path.name}: {check}")
        books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
        chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
        openiti_books = int(
            connection.execute(
                "SELECT COUNT(DISTINCT book_id) FROM chunks WHERE translation_status='openiti_arabic_source'"
            ).fetchone()[0]
        )
        substantive = int(
            connection.execute(
                "SELECT COUNT(*) FROM chunks WHERE LENGTH(COALESCE(text_ar,''))>=80 OR LENGTH(COALESCE(text_fr,''))>=120"
            ).fetchone()[0]
        )
        fts_ready = bool(
            connection.execute(
                "SELECT 1 FROM sqlite_master WHERE type='table' AND name='chunks_fts'"
            ).fetchone()
        )
        if books <= 0 or chunks <= 0 or not fts_ready:
            raise RuntimeError(
                f"Shard incomplet {path.name}: books={books}, chunks={chunks}, fts_ready={fts_ready}"
            )
        return {
            "books": books,
            "chunks": chunks,
            "openiti_books": openiti_books,
            "substantive_passages": substantive,
        }
    finally:
        connection.close()


def _compress_database(path: Path) -> Path:
    asset = path.with_suffix(path.suffix + ".gz")
    asset.unlink(missing_ok=True)
    with path.open("rb") as source, gzip.open(asset, "wb", compresslevel=6) as destination:
        shutil.copyfileobj(source, destination, length=1024 * 1024)
    if asset.stat().st_size <= 0:
        raise RuntimeError(f"Asset gzip vide: {asset}")
    with gzip.open(asset, "rb") as handle:
        if handle.read(len(SQLITE_HEADER)) != SQLITE_HEADER:
            raise RuntimeError(f"Asset gzip invalide: {asset}")
    return asset


def _artifact_info(shard_id: str, database: Path, asset: Path, stats: dict[str, int]) -> dict[str, Any]:
    return {
        "id": shard_id,
        "database": database.name,
        "asset": asset.name,
        "compression": "gzip",
        "sha256": _sha256(asset),
        "size_bytes": asset.stat().st_size,
        "database_sha256": _sha256(database),
        "database_size_bytes": database.stat().st_size,
        **stats,
    }


def _placeholders(values: Iterable[Any]) -> str:
    rows = list(values)
    if not rows:
        raise ValueError("Une liste non vide est requise.")
    return ",".join("?" for _ in rows)


def _copy_subset(source: Path, destination: Path, book_ids: list[str]) -> None:
    if not book_ids:
        raise ValueError("Aucun ouvrage à extraire.")
    _reset_database(destination)
    connection = _open_rw(destination)
    try:
        initialize_database(connection)
        connection.execute("ATTACH DATABASE ? AS source_db", (str(source.resolve()),))
        placeholders = _placeholders(book_ids)
        book_columns = ", ".join(BOOK_COLUMNS)
        chunk_columns = ", ".join(CHUNK_COLUMNS)
        fts_columns = ", ".join(FTS_COLUMNS)
        connection.execute(
            f"INSERT INTO books ({book_columns}) SELECT {book_columns} FROM source_db.books WHERE id IN ({placeholders})",
            book_ids,
        )
        connection.execute(
            f"INSERT INTO chunks ({chunk_columns}) SELECT {chunk_columns} FROM source_db.chunks WHERE book_id IN ({placeholders})",
            book_ids,
        )
        source_fts = connection.execute(
            "SELECT 1 FROM source_db.sqlite_master WHERE type='table' AND name='chunks_fts'"
        ).fetchone()
        if source_fts:
            connection.execute(
                f"INSERT INTO chunks_fts ({fts_columns}) "
                f"SELECT {fts_columns} FROM source_db.chunks_fts "
                "WHERE chunk_id IN (SELECT id FROM chunks)"
            )
        connection.commit()
        connection.execute("DETACH DATABASE source_db")
    finally:
        connection.close()


def _create_catalog(path: Path) -> sqlite3.Connection:
    _reset_database(path)
    connection = _open_rw(path)
    connection.executescript(
        """
        CREATE TABLE books (
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
        CREATE TABLE book_stats (
            book_id TEXT PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
            shard_id TEXT NOT NULL,
            chunks INTEGER NOT NULL,
            indexed_pages INTEGER NOT NULL,
            first_page INTEGER,
            last_page INTEGER,
            arabic_passages INTEGER NOT NULL,
            french_passages INTEGER NOT NULL,
            indexed_sections INTEGER NOT NULL
        );
        CREATE INDEX idx_book_stats_shard ON book_stats(shard_id);
        CREATE TABLE shard_stats (
            shard_id TEXT PRIMARY KEY,
            books INTEGER NOT NULL,
            chunks INTEGER NOT NULL,
            openiti_books INTEGER NOT NULL,
            substantive_passages INTEGER NOT NULL
        );
        CREATE TABLE corpus_meta (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        """
    )
    return connection


def _record_shard(catalog: sqlite3.Connection, shard_db: Path, shard_id: str, stats: dict[str, int]) -> None:
    source = sqlite3.connect(shard_db)
    source.row_factory = sqlite3.Row
    try:
        books = source.execute("SELECT * FROM books ORDER BY title COLLATE NOCASE, id").fetchall()
        for book in books:
            values = tuple(book[column] for column in BOOK_COLUMNS)
            try:
                catalog.execute(
                    f"INSERT INTO books ({', '.join(BOOK_COLUMNS)}) VALUES ({', '.join('?' for _ in BOOK_COLUMNS)})",
                    values,
                )
            except sqlite3.IntegrityError as exc:
                raise RuntimeError(f"Ouvrage dupliqué entre shards: {book['id']}") from exc
            row = source.execute(
                """
                SELECT
                    COUNT(*) AS chunks,
                    COUNT(DISTINCT CASE WHEN page IS NOT NULL AND page > 0 THEN page END) AS indexed_pages,
                    MIN(CASE WHEN page IS NOT NULL AND page > 0 THEN page END) AS first_page,
                    MAX(CASE WHEN page IS NOT NULL AND page > 0 THEN page END) AS last_page,
                    SUM(CASE WHEN LENGTH(TRIM(COALESCE(text_ar, ''))) > 0 THEN 1 ELSE 0 END) AS arabic_passages,
                    SUM(CASE WHEN LENGTH(TRIM(COALESCE(text_fr, ''))) > 0 THEN 1 ELSE 0 END) AS french_passages,
                    COUNT(DISTINCT CASE WHEN LENGTH(TRIM(COALESCE(chapter, ''))) > 0 THEN TRIM(chapter) END) AS indexed_sections
                FROM chunks WHERE book_id=?
                """,
                (book["id"],),
            ).fetchone()
            catalog.execute(
                """
                INSERT INTO book_stats (
                    book_id, shard_id, chunks, indexed_pages, first_page, last_page,
                    arabic_passages, french_passages, indexed_sections
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    book["id"],
                    shard_id,
                    int(row["chunks"] or 0),
                    int(row["indexed_pages"] or 0),
                    row["first_page"],
                    row["last_page"],
                    int(row["arabic_passages"] or 0),
                    int(row["french_passages"] or 0),
                    int(row["indexed_sections"] or 0),
                ),
            )
        catalog.execute(
            "INSERT INTO shard_stats VALUES (?, ?, ?, ?, ?)",
            (
                shard_id,
                int(stats["books"]),
                int(stats["chunks"]),
                int(stats["openiti_books"]),
                int(stats["substantive_passages"]),
            ),
        )
        catalog.commit()
    finally:
        source.close()


def _build_openiti_shard(
    *,
    shard: dict[str, Any],
    source_manifest: dict[str, Any],
    books_by_id: dict[str, dict[str, Any]],
    output_dir: Path,
    workers: int,
) -> tuple[Path, dict[str, int]]:
    shard_id = str(shard["id"])
    book_ids = [str(row["book_id"]) for row in shard.get("books") or []]
    missing = [book_id for book_id in book_ids if book_id not in books_by_id]
    if missing:
        raise RuntimeError(f"Configuration source manquante pour {shard_id}: {missing}")
    selected = [books_by_id[book_id] for book_id in book_ids]
    database = output_dir / f"athar_{shard_id}.sqlite"
    _reset_database(database)
    result = sync_books(
        database,
        source_manifest,
        selected,
        best_effort=True,
        workers=workers,
    )
    if int(result["imported_books"]) != len(selected) or result.get("errors"):
        raise RuntimeError(
            f"Import incomplet du shard {shard_id}: {result['imported_books']}/{len(selected)}; errors={result.get('errors', [])}"
        )
    stats = _finalize_database(database)
    if stats["openiti_books"] != len(selected):
        raise RuntimeError(
            f"Le shard {shard_id} contient {stats['openiti_books']} ouvrages OpenITI au lieu de {len(selected)}."
        )
    return database, stats


def _build_core_shard(
    *,
    output_dir: Path,
    assigned_openiti_ids: set[str],
) -> tuple[Path, dict[str, int]] | None:
    prepared = output_dir / "athar_core_source.sqlite"
    _reset_database(prepared)
    prepare_database(prepared)
    source = sqlite3.connect(prepared)
    try:
        book_ids = [
            str(row[0])
            for row in source.execute("SELECT id FROM books ORDER BY id").fetchall()
            if str(row[0]) not in assigned_openiti_ids
        ]
    finally:
        source.close()
    if not book_ids:
        prepared.unlink(missing_ok=True)
        return None
    database = output_dir / "athar_core-001.sqlite"
    _copy_subset(prepared, database, book_ids)
    prepared.unlink(missing_ok=True)
    stats = _finalize_database(database)
    return database, stats


def build_sharded_corpus(
    output_dir: Path,
    *,
    registry_path: Path = DEFAULT_REGISTRY,
    minimum_openiti_books: int = 1,
    workers: int = 6,
) -> dict[str, Any]:
    output_dir.mkdir(parents=True, exist_ok=True)
    for path in output_dir.iterdir():
        if path.is_file():
            path.unlink()
        elif path.is_dir():
            shutil.rmtree(path)

    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    if not isinstance(registry, dict) or not isinstance(registry.get("shards"), list):
        raise RuntimeError("Registre de shards invalide.")
    source_manifest = load_shardable_manifest()
    source_books = [
        book
        for book in source_manifest.get("books") or []
        if isinstance(book, dict) and book.get("enabled", True)
    ]
    books_by_id = {str(book["book_id"]): book for book in source_books}
    expected_ids = set(books_by_id)
    registry_ids = set(str(key) for key in (registry.get("book_to_shard") or {}))
    if registry_ids != expected_ids:
        missing = sorted(expected_ids - registry_ids)
        extra = sorted(registry_ids - expected_ids)
        raise RuntimeError(f"Registre/source désynchronisés: missing={missing[:8]}, extra={extra[:8]}")

    catalog_path = output_dir / "athar_catalog.sqlite"
    catalog = _create_catalog(catalog_path)
    artifacts: list[dict[str, Any]] = []
    try:
        for shard in registry["shards"]:
            shard_id = str(shard["id"])
            print(f"[Shards] construction {shard_id} ({shard.get('book_count', 0)} ouvrages)…", flush=True)
            database, stats = _build_openiti_shard(
                shard=shard,
                source_manifest=source_manifest,
                books_by_id=books_by_id,
                output_dir=output_dir,
                workers=workers,
            )
            _record_shard(catalog, database, shard_id, stats)
            asset = _compress_database(database)
            artifacts.append(_artifact_info(shard_id, database, asset, stats))
            database.unlink(missing_ok=True)

        core = _build_core_shard(output_dir=output_dir, assigned_openiti_ids=expected_ids)
        if core is not None:
            database, stats = core
            shard_id = "core-001"
            print(f"[Shards] construction {shard_id} ({stats['books']} ouvrages complémentaires)…", flush=True)
            _record_shard(catalog, database, shard_id, stats)
            asset = _compress_database(database)
            artifacts.append(_artifact_info(shard_id, database, asset, stats))
            database.unlink(missing_ok=True)

        totals_row = catalog.execute(
            """
            SELECT
                COUNT(*) AS books,
                COALESCE(SUM(chunks), 0) AS chunks,
                COALESCE(SUM(arabic_passages), 0) AS arabic_passages,
                COALESCE(SUM(french_passages), 0) AS french_passages
            FROM book_stats
            """
        ).fetchone()
        shard_totals = catalog.execute(
            "SELECT COALESCE(SUM(openiti_books),0), COALESCE(SUM(substantive_passages),0) FROM shard_stats"
        ).fetchone()
        totals = {
            "books": int(totals_row["books"] or 0),
            "chunks": int(totals_row["chunks"] or 0),
            "openiti_books": int(shard_totals[0] or 0),
            "substantive_passages": int(shard_totals[1] or 0),
            "arabic_passages": int(totals_row["arabic_passages"] or 0),
            "french_passages": int(totals_row["french_passages"] or 0),
        }
        if totals["openiti_books"] < int(minimum_openiti_books):
            raise RuntimeError(
                f"Corpus sharded sous le minimum OpenITI: {totals['openiti_books']} < {minimum_openiti_books}"
            )
        for key, value in {
            "storage_mode": "sharded",
            "books": totals["books"],
            "chunks": totals["chunks"],
            "openiti_books": totals["openiti_books"],
            "substantive_passages": totals["substantive_passages"],
            "shard_count": len(artifacts),
        }.items():
            catalog.execute(
                "INSERT OR REPLACE INTO corpus_meta(key, value) VALUES (?, ?)",
                (str(key), str(value)),
            )
        catalog.commit()
        catalog.execute("VACUUM")
    finally:
        catalog.close()

    _validate_header(catalog_path)
    catalog_asset = _compress_database(catalog_path)
    catalog_stats = {
        "books": totals["books"],
        "chunks": totals["chunks"],
        "openiti_books": totals["openiti_books"],
        "substantive_passages": totals["substantive_passages"],
    }
    catalog_info = _artifact_info("catalog", catalog_path, catalog_asset, catalog_stats)
    catalog_path.unlink(missing_ok=True)

    mapping = {
        str(row["book_id"]): str(row["shard_id"])
        for row in _read_catalog_mapping_from_gzip(catalog_asset)
    }
    build_manifest = {
        "version": 3,
        "storage_mode": "sharded",
        "source_sha": str(os.getenv("GITHUB_SHA") or ""),
        "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        **totals,
        "shard_count": len(artifacts),
        "catalog": catalog_info,
        "shards": artifacts,
        "book_to_shard": mapping,
    }
    manifest_path = output_dir / "sharded_build.json"
    manifest_path.write_text(json.dumps(build_manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "books": totals["books"],
                "openiti_books": totals["openiti_books"],
                "chunks": totals["chunks"],
                "shards": len(artifacts),
                "compressed_bytes": sum(int(item["size_bytes"]) for item in artifacts) + int(catalog_info["size_bytes"]),
            },
            ensure_ascii=False,
        ),
        flush=True,
    )
    return build_manifest


def _read_catalog_mapping_from_gzip(asset: Path) -> list[sqlite3.Row]:
    raw = asset.with_suffix("")
    raw.unlink(missing_ok=True)
    try:
        with gzip.open(asset, "rb") as source, raw.open("wb") as destination:
            shutil.copyfileobj(source, destination, length=1024 * 1024)
        connection = sqlite3.connect(raw)
        connection.row_factory = sqlite3.Row
        try:
            return connection.execute("SELECT book_id, shard_id FROM book_stats ORDER BY book_id").fetchall()
        finally:
            connection.close()
    finally:
        raw.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Construit Athar en shards SQLite indépendants et bornés.")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--registry", type=Path, default=DEFAULT_REGISTRY)
    parser.add_argument("--min-openiti-books", type=int, default=1)
    parser.add_argument("--workers", type=int, default=int(os.getenv("ATHAR_OPENITI_WORKERS", "6")))
    args = parser.parse_args()
    output_dir = args.output_dir if args.output_dir.is_absolute() else ROOT / args.output_dir
    registry = args.registry if args.registry.is_absolute() else ROOT / args.registry
    build_sharded_corpus(
        output_dir,
        registry_path=registry,
        minimum_openiti_books=max(1, int(args.min_openiti_books)),
        workers=max(1, min(int(args.workers), 8)),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
