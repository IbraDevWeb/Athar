from __future__ import annotations

import argparse
import json
import os
import sqlite3
import threading
import urllib.parse
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from v5_lowmem import ask, corpus_status, list_books, search
from v5_scholar_translation import ScholarTranslationError, translate_passage
from v5_sharded import ShardedCorpusRuntime

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "rag" / "data" / "athar_hosted.sqlite.gz"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"
DEFAULT_CORPUS_MANIFEST = ROOT / "rag" / "corpus_release.json"
COMPAT_SERVER_MARKER = "athar-rag-v4"
ENGINE_MARKER = "rag-v5-hybrid-multilingual"
DEFAULT_CORS_ORIGINS = {"https://ibradevweb.github.io"}


def env_port(default: int = 8000) -> int:
    raw = str(os.getenv("PORT") or os.getenv("ATHAR_PORT") or "").strip()
    try:
        port = int(raw)
        return port if 0 < port < 65536 else default
    except ValueError:
        return default


def allowed_origins() -> set[str]:
    values = set(DEFAULT_CORS_ORIGINS)
    for item in str(os.getenv("ATHAR_CORS_ORIGINS") or "").split(","):
        item = item.strip().rstrip("/")
        if item:
            values.add(item)
    return values


def open_connection(path: Path) -> sqlite3.Connection:
    resolved = path.resolve().as_posix()
    connection = sqlite3.connect(
        f"file:{resolved}?mode=ro&immutable=1",
        uri=True,
        timeout=15,
    )
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    connection.execute("PRAGMA temp_store=FILE")
    connection.execute("PRAGMA cache_size=-8192")
    connection.execute("PRAGMA mmap_size=0")
    connection.execute("PRAGMA threads=1")
    return connection


def validate_db(path: Path) -> None:
    if not path.exists():
        raise RuntimeError(f"Base introuvable: {path}")
    with path.open("rb") as handle:
        header = handle.read(16)
    if header != b"SQLite format 3\x00":
        raise RuntimeError(f"Le corpus n'est pas un SQLite brut: {path}")
    with open_connection(path) as connection:
        tables = {
            row[0]
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        }
        missing = sorted({"books", "chunks"} - tables)
        if missing:
            raise RuntimeError(f"Tables manquantes: {', '.join(missing)}")
        if connection.execute("SELECT 1 FROM books LIMIT 1").fetchone() is None:
            raise RuntimeError("Le corpus ne contient aucun ouvrage.")
        if connection.execute("SELECT 1 FROM chunks LIMIT 1").fetchone() is None:
            raise RuntimeError("Le corpus ne contient aucun passage.")


def _repo_path(value: Path | str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


def configure_server_corpus(
    server: ThreadingHTTPServer,
    db_path: Path,
    *,
    shard_dir: Path | None = None,
    manifest_path: Path | None = None,
) -> None:
    mode = str(os.getenv("ATHAR_CORPUS_MODE") or "monolith").strip().lower()
    if mode == "sharded":
        resolved_dir = _repo_path(shard_dir or os.getenv("ATHAR_SHARD_DIR") or DEFAULT_SHARD_DIR)
        resolved_manifest = _repo_path(
            manifest_path or os.getenv("ATHAR_CORPUS_MANIFEST") or DEFAULT_CORPUS_MANIFEST
        )
        runtime = ShardedCorpusRuntime(resolved_manifest, resolved_dir)
        runtime.validate()
        server.shard_runtime = runtime
        server.storage_mode = "sharded"
        server.db_path = runtime.catalog_path
        return
    resolved_db = _repo_path(db_path)
    validate_db(resolved_db)
    server.shard_runtime = None
    server.storage_mode = "monolith"
    server.db_path = resolved_db


def load_translation_source(
    connection: sqlite3.Connection,
    source_id: str,
    *,
    book_id: str = "",
) -> dict[str, Any]:
    """Load one full indexed passage; never accept arbitrary Arabic from clients."""
    clean_source_id = str(source_id or "").strip()
    clean_book_id = str(book_id or "").strip()
    if not clean_source_id:
        raise ValueError("Identifiant de passage requis.")
    if len(clean_source_id) > 240 or len(clean_book_id) > 180:
        raise ValueError("Identifiant de passage invalide.")

    where = "c.id=?"
    params: list[Any] = [clean_source_id]
    if clean_book_id:
        where += " AND c.book_id=?"
        params.append(clean_book_id)
    row = connection.execute(
        f"""
        SELECT
            c.id, c.book_id, c.page, c.chapter, c.text_ar, c.text_fr,
            c.translation_status, c.source_url,
            b.title, b.title_ar, b.author, b.discipline, b.madhhab
        FROM chunks c
        JOIN books b ON b.id=c.book_id
        WHERE {where}
        LIMIT 1
        """,
        params,
    ).fetchone()
    if row is None:
        raise LookupError("Passage introuvable dans le corpus indexé.")
    source = dict(row)
    if not str(source.get("text_ar") or "").strip():
        raise ValueError("Ce passage ne contient pas de texte arabe à traduire.")
    return source


class AtharThreadingHTTPServer(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 16


class Handler(BaseHTTPRequestHandler):
    server_version = "AtharRAG/5.6-scholar-translation"

    @property
    def db_path(self) -> Path:
        return Path(getattr(self.server, "db_path", DEFAULT_DB))

    @property
    def shard_runtime(self) -> ShardedCorpusRuntime | None:
        return getattr(self.server, "shard_runtime", None)

    def _origin(self) -> str:
        return str(self.headers.get("Origin") or "").strip().rstrip("/")

    def _cors_origin(self) -> str:
        origin = self._origin()
        if not origin:
            return ""
        if origin in getattr(self.server, "cors_origins", DEFAULT_CORS_ORIGINS):
            return origin
        parsed = urllib.parse.urlsplit(origin)
        if parsed.hostname in {"127.0.0.1", "localhost", "::1"} and parsed.scheme in {"http", "https"}:
            return origin
        return ""

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        origin = self._cors_origin()
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Expose-Headers", "X-Athar-RAG, X-Athar-Engine")
            self.send_header("Vary", "Origin")
        super().end_headers()

    def send_json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> bool:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Athar-RAG", "v4-compatible")
            self.send_header("X-Athar-Engine", "v5-lowmem")
            self.end_headers()
            self.wfile.write(body)
            return True
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True
            return False

    def parse_path(self) -> tuple[str, dict[str, list[str]]]:
        parsed = urllib.parse.urlsplit(self.path)
        return parsed.path.rstrip("/") or "/", urllib.parse.parse_qs(parsed.query)

    @staticmethod
    def _limit(value: Any, default: int = 8) -> int:
        try:
            return max(1, min(int(value), 12))
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _first(params: dict[str, list[str]], key: str, default: str = "") -> str:
        values = params.get(key) or []
        return str(values[0] if values else default)

    def _compat_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "ok": True,
            "server": COMPAT_SERVER_MARKER,
            "api_version": 4,
            "engine": ENGINE_MARKER,
            "engine_version": 5,
            "runtime_profile": "low-memory",
            "storage_mode": str(getattr(self.server, "storage_mode", "monolith")),
            **payload,
        }

    def _acquire_heavy(self) -> bool:
        gate = getattr(self.server, "heavy_gate", None)
        return True if gate is None else bool(gate.acquire(timeout=30))

    def _release_heavy(self) -> None:
        gate = getattr(self.server, "heavy_gate", None)
        if gate is not None:
            gate.release()

    def _acquire_translation(self) -> bool:
        gate = getattr(self.server, "translation_gate", None)
        return True if gate is None else bool(gate.acquire(timeout=10))

    def _release_translation(self) -> None:
        gate = getattr(self.server, "translation_gate", None)
        if gate is not None:
            gate.release()

    def _translation_source(self, source_id: str, book_id: str) -> dict[str, Any]:
        if self.shard_runtime is not None:
            if not str(book_id or "").strip():
                raise ValueError("Identifiant d'ouvrage requis pour traduire ce passage.")
            with self.shard_runtime.book_connection(book_id) as connection:
                return load_translation_source(connection, source_id, book_id=book_id)
        with open_connection(self.db_path) as connection:
            return load_translation_source(connection, source_id, book_id=book_id)

    def _status_payload(self) -> dict[str, Any]:
        cached = getattr(self.server, "status_payload", None)
        if cached is not None:
            return cached
        lock = getattr(self.server, "status_lock")
        with lock:
            cached = getattr(self.server, "status_payload", None)
            if cached is not None:
                return cached
            if not self._acquire_heavy():
                raise RuntimeError("Le moteur est occupé. Réessaie dans quelques secondes.")
            try:
                if self.shard_runtime is not None:
                    cached = self.shard_runtime.status()
                else:
                    with open_connection(self.db_path) as connection:
                        cached = corpus_status(connection)
                self.server.status_payload = cached
                return cached
            finally:
                self._release_heavy()

    def _books_payload(self) -> list[dict[str, Any]]:
        cached = getattr(self.server, "books_payload", None)
        if cached is not None:
            return cached
        lock = getattr(self.server, "books_lock")
        with lock:
            cached = getattr(self.server, "books_payload", None)
            if cached is not None:
                return cached
            if not self._acquire_heavy():
                raise RuntimeError("Le moteur est occupé. Réessaie dans quelques secondes.")
            try:
                if self.shard_runtime is not None:
                    cached = self.shard_runtime.list_books()
                else:
                    with open_connection(self.db_path) as connection:
                        cached = list_books(connection)
                self.server.books_payload = cached
                return cached
            finally:
                self._release_heavy()

    def do_OPTIONS(self) -> None:
        path, _ = self.parse_path()
        if path != "/healthz" and not (path.startswith("/api/rag/v4/") or path.startswith("/api/rag/v5/")):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            self.send_response(HTTPStatus.NO_CONTENT)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
            self.send_header("Access-Control-Max-Age", "600")
            self.end_headers()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True

    def do_GET(self) -> None:
        path, params = self.parse_path()
        try:
            if path == "/healthz":
                self.send_json(self._compat_payload({"status": "ready"}))
                return
            if path in {"/api/rag/v4/status", "/api/rag/v5/status"}:
                self.send_json(self._compat_payload(self._status_payload()))
                return
            if path in {"/api/rag/v4/books", "/api/rag/v5/books"}:
                books = self._books_payload()
                self.send_json(self._compat_payload({"books": books, "count": len(books)}))
                return
            if path in {"/api/rag/v4/search", "/api/rag/v5/search"}:
                query = self._first(params, "q").strip()
                if not query:
                    self.send_json(self._compat_payload({"error": "Paramètre q requis."}), HTTPStatus.BAD_REQUEST)
                    return
                if not self._acquire_heavy():
                    self.send_json(self._compat_payload({"error": "Le moteur est occupé. Réessaie dans quelques secondes."}), HTTPStatus.SERVICE_UNAVAILABLE)
                    return
                try:
                    limit = self._limit(self._first(params, "limit", "8"))
                    madhhab = self._first(params, "madhhab")
                    discipline = self._first(params, "discipline")
                    if self.shard_runtime is not None:
                        result = self.shard_runtime.search(
                            query,
                            limit=limit,
                            madhhab=madhhab,
                            discipline=discipline,
                        )
                    else:
                        with open_connection(self.db_path) as connection:
                            result = search(connection, query, limit=limit, madhhab=madhhab, discipline=discipline)
                finally:
                    self._release_heavy()
                self.send_json(self._compat_payload(result))
                return
            self.send_json(self._compat_payload({"error": "Route introuvable."}), HTTPStatus.NOT_FOUND)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True
        except ValueError as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.BAD_REQUEST)
        except Exception as exc:
            self.send_json(self._compat_payload({"error": f"{type(exc).__name__}: {exc}"}), HTTPStatus.INTERNAL_SERVER_ERROR)

    def do_POST(self) -> None:
        path, _ = self.parse_path()
        if path not in {"/api/rag/v4/ask", "/api/rag/v5/ask", "/api/rag/v5/translate"}:
            self.send_json(self._compat_payload({"error": "Route introuvable."}), HTTPStatus.NOT_FOUND)
            return
        try:
            length = max(0, min(int(self.headers.get("Content-Length") or "0"), 64000))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw.decode("utf-8") or "{}")
            if not isinstance(payload, dict):
                raise ValueError("Corps JSON invalide.")

            if path == "/api/rag/v5/translate":
                source_id = str(payload.get("source_id") or "").strip()
                book_id = str(payload.get("book_id") or "").strip()
                mode = str(payload.get("mode") or "faithful").strip().lower()
                source = self._translation_source(source_id, book_id)
                if not self._acquire_translation():
                    self.send_json(
                        self._compat_payload({"error": "Le traducteur est occupé. Réessaie dans quelques secondes."}),
                        HTTPStatus.SERVICE_UNAVAILABLE,
                    )
                    return
                try:
                    translation = translate_passage(source, mode=mode)
                finally:
                    self._release_translation()
                self.send_json(
                    self._compat_payload(
                        {
                            "translation": translation,
                            "source": {
                                "id": source.get("id"),
                                "book_id": source.get("book_id"),
                                "title": source.get("title"),
                                "author": source.get("author"),
                                "chapter": source.get("chapter"),
                                "page": source.get("page"),
                            },
                        }
                    )
                )
                return

            query = str(payload.get("query") or payload.get("q") or "").strip()
            if not query:
                raise ValueError("Question requise.")
            if not self._acquire_heavy():
                self.send_json(self._compat_payload({"error": "Le moteur est occupé. Réessaie dans quelques secondes."}), HTTPStatus.SERVICE_UNAVAILABLE)
                return
            try:
                limit = self._limit(payload.get("limit"), 8)
                madhhab = str(payload.get("madhhab") or "")
                discipline = str(payload.get("discipline") or "")
                if self.shard_runtime is not None:
                    result = self.shard_runtime.ask(
                        query,
                        limit=limit,
                        madhhab=madhhab,
                        discipline=discipline,
                    )
                else:
                    with open_connection(self.db_path) as connection:
                        result = ask(connection, query, limit=limit, madhhab=madhhab, discipline=discipline)
            finally:
                self._release_heavy()
            self.send_json(self._compat_payload(result))
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True
        except LookupError as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.NOT_FOUND)
        except ScholarTranslationError as exc:
            status = HTTPStatus.SERVICE_UNAVAILABLE
            if exc.code == "quota":
                status = HTTPStatus.TOO_MANY_REQUESTS
            elif exc.code == "timeout":
                status = HTTPStatus.GATEWAY_TIMEOUT
            self.send_json(
                self._compat_payload({"error": str(exc), "translation_error": exc.code}),
                status,
            )
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.BAD_REQUEST)
        except Exception as exc:
            self.send_json(self._compat_payload({"error": f"{type(exc).__name__}: {exc}"}), HTTPStatus.INTERNAL_SERVER_ERROR)

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"[Athar RAG V5] {self.address_string()} - {fmt % args}", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Athar RAG V5 hybrid multilingual server — low-memory hosted profile")
    parser.add_argument("--host", default=os.getenv("ATHAR_HOST") or "127.0.0.1")
    parser.add_argument("--port", type=int, default=env_port())
    parser.add_argument("--db", type=Path, default=Path(os.getenv("ATHAR_DB_PATH") or DEFAULT_DB))
    parser.add_argument("--shard-dir", type=Path, default=None)
    parser.add_argument("--manifest", type=Path, default=None)
    parser.add_argument("--api-only", action="store_true")
    args = parser.parse_args()

    server = AtharThreadingHTTPServer((args.host, args.port), Handler)
    configure_server_corpus(
        server,
        args.db,
        shard_dir=args.shard_dir,
        manifest_path=args.manifest,
    )
    server.cors_origins = allowed_origins()
    server.heavy_gate = threading.BoundedSemaphore(1)
    server.translation_gate = threading.BoundedSemaphore(2)
    server.status_lock = threading.Lock()
    server.books_lock = threading.Lock()
    server.status_payload = None
    server.books_payload = None

    print(
        f"[Athar RAG V5] listening on http://{args.host}:{args.port} "
        f"({ENGINE_MARKER}, low-memory, {server.storage_mode})",
        flush=True,
    )
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
