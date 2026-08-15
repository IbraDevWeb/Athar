from __future__ import annotations

import argparse
import json
import threading
from http import HTTPStatus
from pathlib import Path
from typing import Any

from v5_library import get_book, get_toc, list_library_books, read_book, search_book
from v5_lowmem import ask
from v5_scholar_synthesis import (
    ScholarSynthesisError,
    select_synthesis_sources,
    synthesize_from_sources,
)
from v5_server import (
    DEFAULT_DB,
    AtharThreadingHTTPServer,
    Handler as BaseHandler,
    allowed_origins,
    configure_server_corpus,
    env_port,
    open_connection,
)


class Handler(BaseHandler):
    server_version = "AtharRAG/5.7-library-grounded-synthesis"

    def _library_acquire(self) -> bool:
        gate = getattr(self.server, "library_gate", None)
        return True if gate is None else bool(gate.acquire(timeout=10))

    def _library_release(self) -> None:
        gate = getattr(self.server, "library_gate", None)
        if gate is not None:
            gate.release()

    def _synthesis_acquire(self) -> bool:
        gate = getattr(self.server, "synthesis_gate", None)
        return True if gate is None else bool(gate.acquire(timeout=15))

    def _synthesis_release(self) -> None:
        gate = getattr(self.server, "synthesis_gate", None)
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

    def _library_books_payload(self) -> list[dict[str, Any]]:
        cached = getattr(self.server, "library_books_payload", None)
        if cached is not None:
            return cached
        lock = getattr(self.server, "library_books_lock")
        with lock:
            cached = getattr(self.server, "library_books_payload", None)
            if cached is not None:
                return cached
            if self.shard_runtime is not None:
                cached = self.shard_runtime.list_library_books()
            else:
                with open_connection(self.db_path) as connection:
                    cached = list_library_books(connection)
            self.server.library_books_payload = cached
            return cached

    def _retrieve_for_synthesis(
        self,
        query: str,
        *,
        limit: int,
        madhhab: str,
        discipline: str,
    ) -> dict[str, Any]:
        if not self._acquire_heavy():
            raise RuntimeError("Le moteur documentaire est occupé. Réessaie dans quelques secondes.")
        try:
            if self.shard_runtime is not None:
                return self.shard_runtime.ask(
                    query,
                    limit=limit,
                    madhhab=madhhab,
                    discipline=discipline,
                )
            with open_connection(self.db_path) as connection:
                return ask(
                    connection,
                    query,
                    limit=limit,
                    madhhab=madhhab,
                    discipline=discipline,
                )
        finally:
            self._release_heavy()

    def do_GET(self) -> None:
        path, params = self.parse_path()
        library_paths = {
            "/api/rag/v5/library-books",
            "/api/rag/v5/book",
            "/api/rag/v5/read",
            "/api/rag/v5/toc",
            "/api/rag/v5/book-search",
        }
        if path not in library_paths:
            super().do_GET()
            return

        try:
            if path == "/api/rag/v5/library-books":
                if not self._library_acquire():
                    self.send_json(
                        self._compat_payload({"error": "Le catalogue est occupé. Réessaie dans quelques secondes."}),
                        HTTPStatus.SERVICE_UNAVAILABLE,
                    )
                    return
                try:
                    books = self._library_books_payload()
                finally:
                    self._library_release()
                self.send_json(self._compat_payload({"books": books, "count": len(books)}))
                return

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
                if self.shard_runtime is not None:
                    context = self.shard_runtime.book_connection(book_id)
                else:
                    context = open_connection(self.db_path)
                with context as connection:
                    if path == "/api/rag/v5/book":
                        payload = {"book": get_book(connection, book_id)}
                    elif path == "/api/rag/v5/toc":
                        payload = {
                            "toc": get_toc(
                                connection,
                                book_id,
                                limit=self._positive_int(self._first(params, "limit", "360"), 360),
                            )
                        }
                    elif path == "/api/rag/v5/book-search":
                        payload = search_book(
                            connection,
                            book_id,
                            self._first(params, "q"),
                            limit=self._positive_int(self._first(params, "limit", "10"), 10),
                        )
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

    def do_POST(self) -> None:
        path, _ = self.parse_path()
        if path != "/api/rag/v5/synthesize":
            super().do_POST()
            return

        try:
            length = max(0, min(int(self.headers.get("Content-Length") or "0"), 64_000))
            raw = self.rfile.read(length) if length else b"{}"
            payload = json.loads(raw.decode("utf-8") or "{}")
            if not isinstance(payload, dict):
                raise ValueError("Corps JSON invalide.")

            query = str(payload.get("query") or payload.get("q") or "").strip()
            if len(query) < 3:
                raise ValueError("Question requise.")
            limit = self._limit(payload.get("limit"), 12)
            madhhab = str(payload.get("madhhab") or "")
            discipline = str(payload.get("discipline") or "")

            # Retrieval always happens on the server. The client cannot inject sources.
            result = self._retrieve_for_synthesis(
                query,
                limit=limit,
                madhhab=madhhab,
                discipline=discipline,
            )
            sources = list(result.get("sources") or [])
            retrieval_answer = dict(result.get("answer") or {})
            if not sources:
                retrieval_answer["mode"] = "evidence_only"
                retrieval_answer["synthesis"] = None
                retrieval_answer["synthesis_error"] = "Aucun passage suffisamment pertinent n’a été retrouvé pour produire une synthèse IA."
                result["answer"] = retrieval_answer
                self.send_json(self._compat_payload(result))
                return

            routed = bool((result.get("analysis") or {}).get("routed_book"))
            synthesis_sources = select_synthesis_sources(sources, routed_book=routed, limit=10)
            used_ids = [str(item.get("citation_id") or "") for item in synthesis_sources if item.get("citation_id")]

            if not self._synthesis_acquire():
                retrieval_answer["mode"] = "evidence_only_synthesis_unavailable"
                retrieval_answer["synthesis"] = None
                retrieval_answer["synthesis_error"] = "Le synthétiseur IA est occupé. Les passages RAG restent disponibles."
                result["answer"] = retrieval_answer
                result["synthesis_source_ids"] = used_ids
                self.send_json(self._compat_payload(result))
                return

            try:
                synthesis = synthesize_from_sources(query, synthesis_sources)
            except ScholarSynthesisError as exc:
                retrieval_answer["mode"] = "evidence_only_synthesis_unavailable"
                retrieval_answer["synthesis"] = None
                retrieval_answer["synthesis_error"] = str(exc)
                retrieval_answer["synthesis_error_code"] = exc.code
                result["answer"] = retrieval_answer
                result["synthesis_source_ids"] = used_ids
                self.send_json(self._compat_payload(result))
                return
            finally:
                self._synthesis_release()

            result["synthesis_source_ids"] = synthesis.get("source_ids") or used_ids
            result["answer"] = {
                "mode": "llm_grounded_synthesis",
                "summary": synthesis.get("overview") or retrieval_answer.get("summary") or "",
                "verdict": "synthesis_ready",
                "claims": retrieval_answer.get("claims") or [],
                "warning": synthesis.get("notice"),
                "retrieval_summary": retrieval_answer.get("summary") or "",
                "synthesis": synthesis,
            }
            self.send_json(self._compat_payload(result))
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.BAD_REQUEST)
        except RuntimeError as exc:
            self.send_json(self._compat_payload({"error": str(exc)}), HTTPStatus.SERVICE_UNAVAILABLE)
        except Exception as exc:
            self.send_json(
                self._compat_payload({"error": f"{type(exc).__name__}: {exc}"}),
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )


def main() -> int:
    parser = argparse.ArgumentParser(description="Serveur Athar RAG V5 avec lecteur et synthèse savante fondée sur les sources.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=env_port())
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
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
    server.library_gate = threading.BoundedSemaphore(4)
    server.translation_gate = threading.BoundedSemaphore(2)
    server.synthesis_gate = threading.BoundedSemaphore(1)
    server.status_lock = threading.Lock()
    server.books_lock = threading.Lock()
    server.library_books_lock = threading.Lock()
    server.status_payload = None
    server.books_payload = None
    server.library_books_payload = None
    print(
        json.dumps(
            {
                "server": "athar-rag-v5-library",
                "engine": "rag-v5-hybrid-multilingual",
                "runtime_profile": "low-memory",
                "storage_mode": server.storage_mode,
                "host": args.host,
                "port": args.port,
                "db": str(server.db_path),
                "library_read_limit": 12,
                "library_toc_limit": 360,
                "library_search_limit": 16,
                "translation_concurrency": 2,
                "synthesis_concurrency": 1,
                "synthesis_route": "/api/rag/v5/synthesize",
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
