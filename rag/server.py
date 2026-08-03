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

from core import DEFAULT_DB, answer_question, database_status, ensure_database, search_chunks
from ingestion import ingestion_status
from v2 import answer_question_v2, corpus_status_v2, evaluation_status_v2, retrieve_evidence

ROOT = Path(__file__).resolve().parents[1]
SERVER_MARKER = "athar-rag-v2"
LOCAL_ORIGIN_PATTERN = re.compile(r"^https?://(?:127\.0\.0\.1|localhost)(?::\d{1,5})?$")


class AtharRagHandler(SimpleHTTPRequestHandler):
    server_version = "AtharRAG/2.2"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    @property
    def db_path(self) -> Path:
        return Path(getattr(self.server, "db_path", DEFAULT_DB))

    def allowed_cors_origin(self) -> str:
        origin = str(self.headers.get("Origin") or "").strip()
        return origin if LOCAL_ORIGIN_PATTERN.fullmatch(origin) else ""

    def end_headers(self) -> None:
        path = urllib.parse.urlsplit(self.path).path
        is_api = path.startswith("/api/rag/")
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
        if not path.startswith("/api/rag/"):
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
    parser = argparse.ArgumentParser(description="Sert Athar Pro et les API RAG V1/V2 sur le même port.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    args = parser.parse_args()

    with ensure_database(args.db) as connection:
        status = database_status(connection)
        v2_status = corpus_status_v2(connection)
        pipeline = ingestion_status(connection)

    server = ThreadingHTTPServer((args.host, args.port), AtharRagHandler)
    server.db_path = args.db
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
