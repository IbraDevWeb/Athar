from __future__ import annotations

import argparse
import json
import os
import sqlite3
import urllib.parse
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from v5_engine import ask, corpus_status, list_books, search

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
    connection = sqlite3.connect(f"file:{resolved}?mode=ro", uri=True, timeout=30)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    connection.execute("PRAGMA temp_store=MEMORY")
    connection.execute("PRAGMA cache_size=-32768")
    return connection


def validate_db(path: Path) -> None:
    if not path.exists():
        raise RuntimeError(f"Base introuvable: {path}")
    with path.open("rb") as handle:
        header = handle.read(16)
    if header != b"SQLite format 3\x00":
        raise RuntimeError(f"Le corpus n'est pas un SQLite brut: {path}")
    with open_connection(path) as connection:
        corpus_status(connection)


class Handler(BaseHTTPRequestHandler):
    server_version = "AtharRAG/5.0"

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

    def send_json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Athar-RAG", "v4-compatible")
        self.send_header("X-Athar-Engine", "v5")
        self.end_headers()
        self.wfile.write(body)

    def parse_path(self) -> tuple[str, dict[str, list[str]]]:
        parsed = urllib.parse.urlsplit(self.path)
        return parsed.path.rstrip("/") or "/", urllib.parse.parse_qs(parsed.query)

    @staticmethod
    def _limit(value: Any, default: int = 8) -> int:
        try:
            return max(1, min(int(value), 20))
        except (TypeError, ValueError):
            return default

    @staticmethod
    def _first(params: dict[str, list[str]], key: str, default: str = "") -> str:
        values = params.get(key) or []
        return str(values[0] if values else default)

    def _compat_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {"ok": True, "server": COMPAT_SERVER_MARKER, "api_version": 4, "engine": ENGINE_MARKER, "engine_version": 5, **payload}

    def do_OPTIONS(self) -> None:
        path, _ = self.parse_path()
        if path != "/healthz" and not (path.startswith("/api/rag/v4/") or path.startswith("/api/rag/v5/")):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
        self.send_header("Access-Control-Max-Age", "600")
        self.end_headers()

    def do_GET(self) -> None:
        path, params = self.parse_path()
        try:
            if path == "/healthz":
                with open_connection(self.db_path) as connection:
                    status = corpus_status(connection)
                self.send_json(self._compat_payload({"status": "ready", **status}))
                return
            if path in {"/api/rag/v4/status", "/api/rag/v5/status"}:
                with open_connection(self.db_path) as connection:
                    status = corpus_status(connection)
                self.send_json(self._compat_payload(status))
                return
            if path in {"/api/rag/v4/books", "/api/rag/v5/books"}:
                with open_connection(self.db_path) as connection:
                    books = list_books(connection)
                self.send_json(self._compat_payload({"books": books, "count": len(books)}))
                return
            if path in {"/api/rag/v4/search", "/api/rag/v5/search"}:
                query = self._first(params, "q").strip()
                if not query:
                    self.send_json(self._compat_payload({"error": "Paramètre q requis."}), HTTPStatus.BAD_REQUEST)
                    return
                limit = self._limit(self._first(params, "limit", "8"))
                madhhab = self._first(params, "madhhab")
                discipline = self._first(params, "discipline")
                with open_connection(self.db_path) as connection:
                    result = search(connection, query, limit=limit, madhhab=madhhab, discipline=discipline)
                self.send_json(self._compat_payload(result))
                return
            self.send_json(self._compat_payload({"error": "Route introuvable."}), HTTPStatus.NOT_FOUND)
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
            limit = self._limit(payload.get("limit"), 8)
            madhhab = str(payload.get("madhhab") or "")
            discipline = str(payload.get("discipline") or "")
            with open_connection(self.db_path) as connection:
                result = ask(connection, query, limit=limit, madhhab=madhhab, discipline=discipline)
            self.send_json(self._compat_payload(result))
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.BAD_REQUEST)
        except Exception as exc:
            self.send_json(self._compat_payload({"error": f"{type(exc).__name__}: {exc}"}), HTTPStatus.INTERNAL_SERVER_ERROR)

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"[Athar RAG V5] {self.address_string()} - {fmt % args}", flush=True)


def main() -> int:
    parser = argparse.ArgumentParser(description="Athar RAG V5 hybrid multilingual server")
    parser.add_argument("--host", default=os.getenv("ATHAR_HOST") or "127.0.0.1")
    parser.add_argument("--port", type=int, default=env_port())
    parser.add_argument("--db", type=Path, default=Path(os.getenv("ATHAR_DB_PATH") or DEFAULT_DB))
    parser.add_argument("--api-only", action="store_true")
    args = parser.parse_args()
    validate_db(args.db)
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    server.db_path = args.db
    server.cors_origins = allowed_origins()
    print(f"[Athar RAG V5] listening on http://{args.host}:{args.port} with {args.db} ({ENGINE_MARKER})", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
