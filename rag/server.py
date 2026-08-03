from __future__ import annotations

import argparse
import json
import mimetypes
import os
import sqlite3
import sys
import urllib.parse
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from core import DEFAULT_DB, answer_question, database_status, ensure_database, search_chunks

ROOT = Path(__file__).resolve().parents[1]


class AtharRagHandler(SimpleHTTPRequestHandler):
    server_version = "AtharRAG/1.0"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    @property
    def db_path(self) -> Path:
        return Path(getattr(self.server, "db_path", DEFAULT_DB))

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def send_json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def parse_query(self) -> tuple[str, dict[str, list[str]]]:
        parsed = urllib.parse.urlsplit(self.path)
        return parsed.path, urllib.parse.parse_qs(parsed.query)

    def do_GET(self) -> None:
        path, params = self.parse_query()
        if path == "/api/rag/status":
            with ensure_database(self.db_path) as connection:
                self.send_json({"ok": True, **database_status(connection)})
            return
        if path in {"/api/rag/search", "/api/rag/ask"}:
            query = (params.get("q") or [""])[0].strip()
            if len(query) < 2:
                self.send_json({"ok": False, "error": "La question doit contenir au moins deux caractères."}, HTTPStatus.BAD_REQUEST)
                return
            madhhab = (params.get("madhhab") or [""])[0]
            discipline = (params.get("discipline") or [""])[0]
            try:
                limit = max(1, min(int((params.get("limit") or ["8"])[0]), 20))
            except ValueError:
                limit = 8
            with ensure_database(self.db_path) as connection:
                if path.endswith("/ask"):
                    payload = answer_question(
                        connection,
                        query,
                        madhhab=madhhab,
                        discipline=discipline,
                        limit=limit,
                    )
                else:
                    results = search_chunks(
                        connection,
                        query,
                        madhhab=madhhab,
                        discipline=discipline,
                        limit=limit,
                    )
                    payload = {"query": query, "results": results, "count": len(results)}
                self.send_json({"ok": True, **payload})
            return
        super().do_GET()

    def do_POST(self) -> None:
        path, _ = self.parse_query()
        if path != "/api/rag/ask":
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
        with ensure_database(self.db_path) as connection:
            result = answer_question(
                connection,
                query,
                madhhab=str(payload.get("madhhab") or ""),
                discipline=str(payload.get("discipline") or ""),
                limit=max(1, min(int(payload.get("limit") or 8), 20)),
            )
            self.send_json({"ok": True, **result})

    def log_message(self, format_string: str, *args: Any) -> None:
        sys.stdout.write(f"[Athar RAG] {self.address_string()} — {format_string % args}\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Sert Athar Pro et son API RAG locale sur le même port.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    args = parser.parse_args()

    with ensure_database(args.db) as connection:
        status = database_status(connection)

    server = ThreadingHTTPServer((args.host, args.port), AtharRagHandler)
    server.db_path = args.db
    print(f"Athar Pro + RAG : http://{args.host}:{args.port}/?v=34")
    print(
        f"Corpus : {status['books']} livre(s), {status['chunks']} passage(s), "
        f"mode {status['mode']}."
    )
    if status["mode"] == "demo":
        print("Conseil : exécutez sync-kutub.bat pour enrichir la bibliothèque locale.")
    if status["ollama_enabled"]:
        print(f"Synthèse locale activée avec le modèle {os.getenv('ATHAR_OLLAMA_MODEL')}.")
    else:
        print("Synthèse extractive active. Définissez ATHAR_OLLAMA_MODEL pour utiliser Ollama localement.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt du serveur Athar RAG.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
