from __future__ import annotations

"""Athar V6.4 server entrypoint: V5 API compatibility + promoted V6.3-C retrieval."""

import argparse
import json
import threading
from http import HTTPStatus
from pathlib import Path
from typing import Any

from v5_library_server import Handler as V5LibraryHandler
from v5_server import (
    DEFAULT_DB,
    AtharThreadingHTTPServer,
    allowed_origins,
    configure_server_corpus,
    env_port,
)
from v64_production import V64ProductionRuntime, build_production_runtime


class Handler(V5LibraryHandler):
    server_version = "AtharRAG/6.4-v63c-fused"

    def _active_engine(self) -> str:
        runtime = getattr(self.server, "shard_runtime", None)
        if isinstance(runtime, V64ProductionRuntime):
            return runtime.active_engine
        return "rag-v6.1-hybrid-multilingual"

    def _compat_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "ok": True,
            "server": "athar-rag-v4",
            "api_version": 4,
            "engine": self._active_engine(),
            "engine_version": 6,
            "runtime_profile": "low-memory-disk-view",
            "storage_mode": str(getattr(self.server, "storage_mode", "monolith")),
            **payload,
        }

    def send_json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> bool:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        try:
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Athar-RAG", "v4-compatible")
            self.send_header("X-Athar-Engine", self._active_engine())
            self.end_headers()
            self.wfile.write(body)
            return True
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            self.close_connection = True
            return False


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Serveur Athar V6.4: bibliothèque V5 compatible + retrieval V6.3-C fused promu."
    )
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
    if getattr(server, "shard_runtime", None) is None:
        raise RuntimeError("V6.4 production exige le corpus shardé.")
    base_runtime = server.shard_runtime
    production_runtime = build_production_runtime(base_runtime)
    production_runtime.validate()
    server.shard_runtime = production_runtime

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
                "server": "athar-rag-v6.4-library",
                "engine": production_runtime.active_engine,
                "configured_engine": production_runtime.configured_engine,
                "runtime_profile": "low-memory-disk-view",
                "storage_mode": server.storage_mode,
                "host": args.host,
                "port": args.port,
                "db": str(server.db_path),
                "ann_manifest": str(production_runtime.ann_manifest),
                "fallback_engine": production_runtime.FALLBACK_ENGINE,
                "fail_open": production_runtime.fail_open,
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
        production_runtime.close_ann()
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
