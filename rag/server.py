from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from core import DEFAULT_DB, answer_question, database_status, ensure_database, import_seed, search_chunks
from ingestion import ingestion_status
from v2 import answer_question_v2, corpus_status_v2, evaluation_status_v2, retrieve_evidence

ROOT = Path(__file__).resolve().parents[1]
STARTER_CORPUS = ROOT / "rag" / "starter_corpus.json"
SERVER_MARKER = "athar-rag-v2"
LOCAL_ORIGIN_PATTERN = re.compile(r"^https?://(?:127\.0\.0\.1|localhost)(?::\d{1,5})?$")
DEFAULT_CORS_ORIGINS = {"https://ibradevweb.github.io"}
TRUTHY = {"1", "true", "yes", "on"}


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in TRUTHY


def env_port(default: int = 8000) -> int:
    for name in ("PORT", "ATHAR_PORT"):
        value = str(os.getenv(name) or "").strip()
        if not value:
            continue
        try:
            port = int(value)
        except ValueError:
            continue
        if 0 < port < 65536:
            return port
    return default


def allowed_origins_from_env() -> set[str]:
    origins = set(DEFAULT_CORS_ORIGINS)
    raw = str(os.getenv("ATHAR_CORS_ORIGINS") or "")
    for item in raw.split(","):
        origin = item.strip().rstrip("/")
        if origin:
            origins.add(origin)
    return origins


def bootstrap_corpus(connection: Any) -> None:
    if STARTER_CORPUS.exists():
        import_seed(connection, STARTER_CORPUS)


class AtharRagHandler(SimpleHTTPRequestHandler):
    server_version = "AtharRAG/2.2"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    @property
    def db_path(self) -> Path:
        return Path(getattr(self.server, "db_path", DEFAULT_DB))

    @property
    def api_only(self) -> bool:
        return bool(getattr(self.server, "api_only", False))

    def allowed_cors_origin(self) -> str:
        origin = str(self.headers.get("Origin") or "").strip().rstrip("/")
        if not origin:
            return ""
        if LOCAL_ORIGIN_PATTERN.fullmatch(origin):
            return origin
        allowed = set(getattr(self.server, "allowed_origins", DEFAULT_CORS_ORIGINS))
        return origin if origin in allowed else ""

    def end_headers(self) -> None:
        path = urllib.parse.urlsplit(self.path).path
        is_api = path.startswith("/api/rag/") or path == "/healthz"
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin" if is_api else "same-origin")
        origin = self.allowed_cors_origin()
        if is_api and origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Expose-Headers", "X-Athar-RAG")
            self.send_header("Vary", "Origin")
        super().end_headers()

    def send_json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Athar-RAG", "v2")
        self.end_headers()
        self.wfile.write(body)

    def parse_query(self) -> tuple[str, dict[str, list[str]]]:
        parsed = urllib.parse.urlsplit(self.path)
        return parsed.path, urllib.parse.parse_qs(parsed.query)

    @staticmethod
    def _limit(params: dict[str, list[str]], default: int = 8) -> int:
        try:
            return max(1, min(int((params.get("limit") or [str(default)])[0]), 20))
        except ValueError:
            return default

    def do_OPTIONS(self) -> None:
        path, _ = self.parse_query()
        if not (path.startswith("/api/rag/") or path == "/healthz"):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:
        path, params = self.parse_query()

        if path == "/healthz":
            try:
                with ensure_database(self.db_path) as connection:
                    connection.execute("SELECT 1").fetchone()
                self.send_json({"ok": True, "server": SERVER_MARKER, "api_version": 2, "mode": "api" if self.api_only else "local"})
            except Exception as error:
                self.send_json({"ok": False, "server": SERVER_MARKER, "error": str(error)}, HTTPStatus.SERVICE_UNAVAILABLE)
            return

        if path == "/api/rag/status":
            with ensure_database(self.db_path) as connection:
                self.send_json({"ok": True, "server": SERVER_MARKER, "api_version": 2, **database_status(connection)})
            return

        if path == "/api/rag/v2/status":
            with ensure_database(self.db_path) as connection:
                corpus = corpus_status_v2(connection)
                ingestion = ingestion_status(connection)
                self.send_json({
                    "ok": True,
                    "server": SERVER_MARKER,
                    "api_version": 2,
                    "deployment": "hosted" if self.api_only else "local",
                    **corpus,
                    "ingestion": {
                        "tracked_pages": ingestion["tracked_pages"],
                        "imported_pages": ingestion["imported_pages"],
                        "error_pages": ingestion["error_pages"],
                        "blocked_pages": ingestion["blocked_pages"],
                        "average_quality": ingestion["average_quality"],
                    },
                })
            return

        if path == "/api/rag/v2/ingestion":
            with ensure_database(self.db_path) as connection:
                self.send_json({
                    "ok": True,
                    "server": SERVER_MARKER,
                    "api_version": 2,
                    "ingestion": ingestion_status(connection),
                })
            return

        if path == "/api/rag/v2/evaluation":
            self.send_json({"ok": True, "server": SERVER_MARKER, "api_version": 2, **evaluation_status_v2()})
            return

        if path == "/api/rag/v2/corpus":
            with ensure_database(self.db_path) as connection:
                payload = corpus_status_v2(connection)
                self.send_json({
                    "ok": True,
                    "server": SERVER_MARKER,
                    "api_version": 2,
                    "corpus": payload["corpus"],
                    "translation_statuses": payload["translation_statuses"],
                    "ingestion": ingestion_status(connection),
                })
            return

        if path in {"/api/rag/v2/search", "/api/rag/v2/ask"}:
            query = (params.get("q") or [""])[0].strip()
            if len(query) < 2:
                self.send_json({"ok": False, "error": "La question doit contenir au moins deux caractères."}, HTTPStatus.BAD_REQUEST)
                return
            madhhab = (params.get("madhhab") or ["Mālikite"])[0]
            discipline = (params.get("discipline") or [""])[0]
            limit = self._limit(params, 12)
            with ensure_database(self.db_path) as connection:
                if path.endswith("/ask"):
                    payload = answer_question_v2(connection, query, madhhab=madhhab, discipline=discipline, limit=limit)
                else:
                    analysis, sources = retrieve_evidence(connection, query, madhhab=madhhab, discipline=discipline, limit=limit)
                    payload = {"query": query, "analysis": analysis, "sources": sources, "count": len(sources)}
                self.send_json({"ok": True, "server": SERVER_MARKER, "api_version": 2, **payload})
            return

        if path in {"/api/rag/search", "/api/rag/ask"}:
            query = (params.get("q") or [""])[0].strip()
            if len(query) < 2:
                self.send_json({"ok": False, "error": "La question doit contenir au moins deux caractères."}, HTTPStatus.BAD_REQUEST)
                return
            madhhab = (params.get("madhhab") or [""])[0]
            discipline = (params.get("discipline") or [""])[0]
            limit = self._limit(params, 8)
            with ensure_database(self.db_path) as connection:
                if path.endswith("/ask"):
                    payload = answer_question(connection, query, madhhab=madhhab, discipline=discipline, limit=limit)
                else:
                    results = search_chunks(connection, query, madhhab=madhhab, discipline=discipline, limit=limit)
                    payload = {"query": query, "results": results, "count": len(results)}
                self.send_json({"ok": True, "server": SERVER_MARKER, "api_version": 2, **payload})
            return

        if self.api_only:
            self.send_json({"ok": False, "error": "Route introuvable."}, HTTPStatus.NOT_FOUND)
            return

        super().do_GET()

    def do_POST(self) -> None:
        path, _ = self.parse_query()
        if path not in {"/api/rag/ask", "/api/rag/v2/ask"}:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 64_000)
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            query = str(payload.get("query") or "").strip()
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_json({"ok": False, "error": "Corps JSON invalide."}, HTTPStatus.BAD_REQUEST)
            return
        if len(query) < 2:
            self.send_json({"ok": False, "error": "La question est trop courte."}, HTTPStatus.BAD_REQUEST)
            return
        try:
            limit = max(1, min(int(payload.get("limit") or (12 if path.startswith("/api/rag/v2") else 8)), 20))
        except (TypeError, ValueError):
            limit = 12 if path.startswith("/api/rag/v2") else 8

        with ensure_database(self.db_path) as connection:
            if path == "/api/rag/v2/ask":
                result = answer_question_v2(
                    connection,
                    query,
                    madhhab=str(payload.get("madhhab") or "Mālikite"),
                    discipline=str(payload.get("discipline") or ""),
                    limit=limit,
                )
            else:
                result = answer_question(
                    connection,
                    query,
                    madhhab=str(payload.get("madhhab") or ""),
                    discipline=str(payload.get("discipline") or ""),
                    limit=limit,
                )
            self.send_json({"ok": True, "server": SERVER_MARKER, "api_version": 2, **result})

    def log_message(self, format_string: str, *args: Any) -> None:
        sys.stdout.write(f"[Athar RAG] {self.address_string()} — {format_string % args}\n")


def main() -> int:
    default_host = str(os.getenv("ATHAR_HOST") or "127.0.0.1")
    default_db = Path(os.getenv("ATHAR_DB_PATH") or DEFAULT_DB)

    parser = argparse.ArgumentParser(description="Sert Athar Pro et les API RAG V1/V2.")
    parser.add_argument("--host", default=default_host)
    parser.add_argument("--port", type=int, default=env_port())
    parser.add_argument("--db", type=Path, default=default_db)
    parser.add_argument("--api-only", action="store_true", default=env_flag("ATHAR_API_ONLY"))
    args = parser.parse_args()

    with ensure_database(args.db) as connection:
        bootstrap_corpus(connection)
        status = database_status(connection)
        v2_status = corpus_status_v2(connection)
        pipeline = ingestion_status(connection)

    server = ThreadingHTTPServer((args.host, args.port), AtharRagHandler)
    server.db_path = args.db
    server.api_only = bool(args.api_only)
    server.allowed_origins = allowed_origins_from_env()

    if args.api_only:
        print(f"Athar RAG API V2 : http://{args.host}:{args.port}")
        print(f"Origines CORS autorisées : {', '.join(sorted(server.allowed_origins)) or 'aucune'}")
    else:
        print(f"Athar Pro + Bibliothèque Savante V2 : http://{args.host}:{args.port}/?v=34&server=rag-v2&ragPort={args.port}")

    print(
        f"Corpus : {status['books']} livre(s), {status['chunks']} passage(s), "
        f"dont {v2_status['substantive_passages']} passage(s) substantiel(s)."
    )
    print(
        f"Ingestion : {pipeline['imported_pages']} page(s) suivie(s), "
        f"qualité moyenne {pipeline['average_quality']} %, {pipeline['error_pages']} erreur(s)."
    )
    if status["mode"] == "demo":
        print("Conseil : exécutez sync-kutub.bat pour enrichir la bibliothèque locale.")
    if status["ollama_enabled"]:
        print(f"Synthèse citation-first activée avec le modèle {os.getenv('ATHAR_OLLAMA_MODEL')}.")
    else:
        print("Mode citation-first extractif actif. Définissez ATHAR_OLLAMA_MODEL pour une synthèse locale structurée.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt du serveur Athar RAG.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
