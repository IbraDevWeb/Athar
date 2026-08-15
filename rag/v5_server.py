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

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "rag" / "data" / "athar_hosted.sqlite.gz"
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
    # The hosted corpus is immutable for the lifetime of one Render deploy.
    # immutable=1 avoids locking/journal work and keeps the read-only path cheap.
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
    # Startup validation is intentionally cheap. /healthz must never trigger a
    # full corpus scan on a 512 MiB instance.
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


class AtharThreadingHTTPServer(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 16


class Handler(BaseHTTPRequestHandler):
    server_version = "AtharRAG/5.1-lowmem"

    @property
    def db_path(self) -> Path:
        return Path(getattr(self.server, "db_path", DEFAULT_DB))

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
            # Render health probes and browsers may close a socket after their
            # timeout. That is not an application error and must not trigger a
            # second 500 response on the already-closed connection.
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
            **payload,
        }

    def _acquire_heavy(self) -> bool:
        gate = getattr(self.server, "heavy_gate", None)
        return True if gate is None else bool(gate.acquire(timeout=30))

    def _release_heavy(self) -> None:
        gate = getattr(self.server, "heavy_gate", None)
        if gate is not None:
            gate.release()

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
                # Constant-time liveness check: DB integrity was validated before
                # the socket started listening. Never scan the 1.9 GB corpus here.
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
        if path not in {"/api/rag/v4/ask", "/api/rag/v5/ask"}:
            self.send_json(self._compat_payload({"error": "Route introuvable."}), HTTPStatus.NOT_FOUND)
            return
        try:
            length = max(0, min(int(self.headers.get("Content-Length") or "0"), 64000))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw.decode("utf-8") or "{}")
            if not isinstance(payload, dict):
                raise ValueError("Corps JSON invalide.")
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
                with open_connection(self.db_path) as connection:
                    result = ask(connection, query, limit=limit, madhhab=madhhab, discipline=discipline)
            finally:
                self._release_heavy()
            self.send_json(self._compat_payload(result))
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True
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
    parser.add_argument("--api-only", action="store_true")
    args = parser.parse_args()

    validate_db(args.db)
    server = AtharThreadingHTTPServer((args.host, args.port), Handler)
    server.db_path = args.db
    server.cors_origins = allowed_origins()
    server.heavy_gate = threading.BoundedSemaphore(1)
    server.status_lock = threading.Lock()
    server.books_lock = threading.Lock()
    server.status_payload = None
    server.books_payload = None

    print(
        f"[Athar RAG V5] listening on http://{args.host}:{args.port} with {args.db} "
        f"({ENGINE_MARKER}, low-memory profile)",
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
