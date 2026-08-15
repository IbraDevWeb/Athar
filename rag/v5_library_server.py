from __future__ import annotations

import argparse
import json
import threading
from http import HTTPStatus
from pathlib import Path
from typing import Any

from v5_library import get_book, read_book
from v5_server import (
    DEFAULT_DB,
    AtharThreadingHTTPServer,
    Handler as BaseHandler,
    allowed_origins,
    env_port,
    open_connection,
    validate_db,
)


class Handler(BaseHandler):
    server_version = "AtharRAG/5.3-library-lowmem"

    def _library_acquire(self) -> bool:
        gate = getattr(self.server, "library_gate", None)
        return True if gate is None else bool(gate.acquire(timeout=10))

    def _library_release(self) -> None:
        gate = getattr(self.server, "library_gate", None)
        if gate is not None:
            gate.release()

    @staticmethod
    def _positive_int(value: Any, default: int | None = None) -> int | None:
        if value in (None, ""):
            return default
        try:
            parsed = int(value)
        except (TypeError, ValueError) as exc:
            raise ValueError("Paramètre numérique invalide.") from exc
        if parsed <= 0:
            raise ValueError("Le paramètre doit être positif.")
        return parsed

    @staticmethod
    def _offset(value: Any) -> int:
        try:
            parsed = int(value or 0)
        except (TypeError, ValueError) as exc:
            raise ValueError("Offset invalide.") from exc
        return max(0, min(parsed, 2_000_000))

    def do_GET(self) -> None:
        path, params = self.parse_path()
        if path not in {"/api/rag/v5/book", "/api/rag/v5/read"}:
            super().do_GET()
            return

        try:
            book_id = self._first(params, "id") or self._first(params, "book_id")
            book_id = str(book_id or "").strip()
            if not book_id:
                raise ValueError("Identifiant d'ouvrage requis.")
            if len(book_id) > 180:
                raise ValueError("Identifiant d'ouvrage invalide.")
            if not self._library_acquire():
                self.send_json(
                    self._compat_payload({"error": "Le lecteur est occupé. Réessaie dans quelques secondes."}),
                    HTTPStatus.SERVICE_UNAVAILABLE,
                )
                return
            try:
                with open_connection(self.db_path) as connection:
                    if path == "/api/rag/v5/book":
                        payload = {"book": get_book(connection, book_id)}
                    else:
                        payload = read_book(
                            connection,
                            book_id,
                            offset=self._offset(self._first(params, "offset", "0")),
                            limit=self._positive_int(self._first(params, "limit", "8"), 8),
                            page=self._positive_int(self._first(params, "page"), None),
                        )
            finally:
                self._library_release()
            self.send_json(self._compat_payload(payload))
        except LookupError as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.NOT_FOUND)
        except ValueError as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.BAD_REQUEST)
        except Exception as exc:
            self.send_json(
                self._compat_payload({"error": f"{type(exc).__name__}: {exc}"}),
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )


def main() -> int:
    parser = argparse.ArgumentParser(description="Serveur Athar RAG V5 avec lecteur de bibliothèque.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=env_port())
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--api-only", action="store_true")
    args = parser.parse_args()

    validate_db(args.db)
    server = AtharThreadingHTTPServer((args.host, args.port), Handler)
    server.db_path = args.db
    server.cors_origins = allowed_origins()
    server.heavy_gate = threading.BoundedSemaphore(1)
    server.library_gate = threading.BoundedSemaphore(4)
    server.status_lock = threading.Lock()
    server.books_lock = threading.Lock()
    server.status_payload = None
    server.books_payload = None
    print(
        json.dumps(
            {
                "server": "athar-rag-v5-library",
                "engine": "rag-v5-hybrid-multilingual",
                "runtime_profile": "low-memory",
                "host": args.host,
                "port": args.port,
                "db": str(args.db),
                "library_read_limit": 12,
            },
            ensure_ascii=False,
        ),
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
