from __future__ import annotations

"""Athar V6.5 semantic sidecar.

This process owns only the multilingual query encoder and the global USearch
index. It never opens the 11 corpus shards. The public/library process can call
it for semantic candidate IDs and hydrate canonical citations locally.
"""

import argparse
import hmac
import json
import os
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

import numpy as np

from v5_engine import normalize_text
from v63_hybrid import DEFAULT_MODEL
from v64_production import ViewedGlobalAnnIndex

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ANN_MANIFEST = ROOT / "rag" / "data" / "v63c-ann" / "athar-v63c-global.ann.json"
_ALL = {"", "all", "tous", "toutes", "toutes les ecoles", "toutes les écoles", "auto", "automatique"}


def _rooted(value: str | Path) -> Path:
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


def _truthy(name: str, default: bool) -> bool:
    raw = str(os.getenv(name) or "").strip().lower()
    if not raw:
        return default
    return raw in {"1", "true", "yes", "oui", "on"}


def _strict(value: str) -> bool:
    wanted = normalize_text(value)
    return wanted not in {normalize_text(item) for item in _ALL}


def _meta_allowed(row: dict[str, Any], *, routed_book_id: str, madhhab: str, discipline: str) -> bool:
    if routed_book_id and str(row.get("book_id") or "") != routed_book_id:
        return False
    if _strict(madhhab):
        wanted = normalize_text(madhhab)
        actual = normalize_text(row.get("madhhab") or "")
        if not actual or wanted not in actual:
            return False
    if _strict(discipline):
        wanted = normalize_text(discipline)
        actual = normalize_text(row.get("discipline") or "")
        if not actual or wanted not in actual:
            return False
    return True


class SemanticRuntime:
    ENGINE = "athar-v6.5-semantic-sidecar"

    def __init__(self, ann_manifest: Path, *, model_name: str = DEFAULT_MODEL) -> None:
        self.ann_manifest = ann_manifest.resolve()
        self.model_name = model_name
        self.ann: ViewedGlobalAnnIndex | None = None
        self._model: Any | None = None
        self.warmup_ms: float | None = None
        self.ready = False
        self.error = ""

    @property
    def model(self):
        if self._model is None:
            from fastembed import TextEmbedding

            cache = str(os.getenv("FASTEMBED_CACHE_PATH") or "").strip()
            kwargs: dict[str, Any] = {}
            if cache:
                kwargs["cache_dir"] = str(_rooted(cache))
            if _truthy("ATHAR_FASTEMBED_LOCAL_ONLY", True):
                kwargs["local_files_only"] = True
            self._model = TextEmbedding(model_name=self.model_name, **kwargs)
        return self._model

    def initialize(self) -> dict[str, Any]:
        started = time.perf_counter()
        try:
            self.ann = ViewedGlobalAnnIndex(
                self.ann_manifest,
                verify_sha=_truthy("ATHAR_ANN_VERIFY_SHA", True),
            )
            vector = self.embed("Athar V6.5 semantic sidecar warmup tayammum الصلاة")
            hits = self.ann.search(vector, top_k=8)
            if not hits:
                raise RuntimeError("Warmup ANN sans résultat.")
            self.warmup_ms = (time.perf_counter() - started) * 1000.0
            self.ready = True
            self.error = ""
            return self.status()
        except Exception as exc:
            self.warmup_ms = (time.perf_counter() - started) * 1000.0
            self.ready = False
            self.error = f"{type(exc).__name__}: {exc}"
            raise

    def embed(self, query: str) -> np.ndarray:
        vectors = list(self.model.query_embed([query]))
        if len(vectors) != 1:
            raise RuntimeError("Embedding de requête sémantique invalide.")
        vector = np.asarray(vectors[0], dtype=np.float32)
        norm = float(np.linalg.norm(vector))
        if not np.isfinite(norm) or norm <= 1e-12:
            raise RuntimeError("Embedding de requête nul ou non fini.")
        return vector / norm

    def search(
        self,
        query: str,
        *,
        limit: int = 40,
        oversample: int = 160,
        routed_book_id: str = "",
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        if not self.ready or self.ann is None:
            raise RuntimeError(self.error or "Sidecar sémantique non prêt.")
        query = str(query or "").strip()
        if len(query) < 2:
            raise ValueError("Question trop courte.")
        limit = max(1, min(int(limit), 80))
        oversample = max(limit, min(int(oversample), 1000))
        started = time.perf_counter()
        qvec = self.embed(query)
        ann_rows = self.ann.search(qvec, top_k=oversample)
        filtered = [
            row
            for row in ann_rows
            if _meta_allowed(
                row,
                routed_book_id=str(routed_book_id or ""),
                madhhab=str(madhhab or ""),
                discipline=str(discipline or ""),
            )
        ][:limit]
        elapsed = (time.perf_counter() - started) * 1000.0
        return {
            "ok": True,
            "engine": self.ENGINE,
            "query": query,
            "count": len(filtered),
            "elapsed_ms": round(elapsed, 3),
            "filters": {
                "routed_book_id": str(routed_book_id or ""),
                "madhhab": str(madhhab or ""),
                "discipline": str(discipline or ""),
            },
            "candidates": [
                {
                    "chunk_id": str(row.get("chunk_id") or ""),
                    "book_id": str(row.get("book_id") or ""),
                    "shard_id": str(row.get("shard_id") or ""),
                    "discipline": str(row.get("discipline") or ""),
                    "madhhab": str(row.get("madhhab") or ""),
                    "ann_rank": int(row.get("ann_rank") or 0),
                    "ann_distance": round(float(row.get("ann_distance") or 0.0), 7),
                    "ann_similarity": round(float(row.get("ann_similarity") or 0.0), 7),
                }
                for row in filtered
                if str(row.get("chunk_id") or "")
            ],
        }

    def status(self) -> dict[str, Any]:
        manifest = self.ann.manifest if self.ann is not None else {}
        return {
            "ok": bool(self.ready),
            "engine": self.ENGINE,
            "ready": bool(self.ready),
            "error": self.error,
            "semantic_model": self.model_name,
            "semantic_warmup_ms": round(self.warmup_ms, 2) if self.warmup_ms is not None else None,
            "ann_storage_mode": "disk_view" if self.ann is not None else "unavailable",
            "ann_vectors": int(manifest.get("vectors") or 0),
            "ann_dimension": int(manifest.get("dimension") or 0),
            "ann_metric": str(manifest.get("metric") or ""),
            "corpus_source_sha": str(manifest.get("corpus_source_sha") or ""),
        }

    def close(self) -> None:
        if self.ann is not None:
            self.ann.close()
        self.ann = None
        self.ready = False


class SemanticHTTPServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True


class Handler(BaseHTTPRequestHandler):
    server_version = "AtharSemantic/6.5"

    @property
    def runtime(self) -> SemanticRuntime:
        return self.server.runtime  # type: ignore[attr-defined]

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"[semantic] {self.address_string()} - {fmt % args}", flush=True)

    def _json(self, payload: dict[str, Any], status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _authorized(self) -> bool:
        expected = str(getattr(self.server, "auth_token", "") or "")  # type: ignore[attr-defined]
        if not expected:
            return True
        header = str(self.headers.get("Authorization") or "")
        supplied = header[7:].strip() if header.lower().startswith("bearer ") else ""
        return bool(supplied and hmac.compare_digest(supplied, expected))

    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length") or "0")
        if length <= 0 or length > 64 * 1024:
            raise ValueError("Corps JSON absent ou trop grand.")
        payload = json.loads(self.rfile.read(length).decode("utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("Objet JSON requis.")
        return payload

    def do_GET(self) -> None:
        if self.path == "/healthz":
            status = self.runtime.status()
            self._json(status, HTTPStatus.OK if status["ready"] else HTTPStatus.SERVICE_UNAVAILABLE)
            return
        if self.path == "/api/semantic/status":
            if not self._authorized():
                self._json({"ok": False, "error": "unauthorized"}, HTTPStatus.UNAUTHORIZED)
                return
            self._json(self.runtime.status())
            return
        self._json({"ok": False, "error": "not_found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        if self.path != "/api/semantic/search":
            self._json({"ok": False, "error": "not_found"}, HTTPStatus.NOT_FOUND)
            return
        if not self._authorized():
            self._json({"ok": False, "error": "unauthorized"}, HTTPStatus.UNAUTHORIZED)
            return
        gate = self.server.semantic_gate  # type: ignore[attr-defined]
        if not gate.acquire(blocking=False):
            self._json({"ok": False, "error": "semantic_busy"}, HTTPStatus.SERVICE_UNAVAILABLE)
            return
        try:
            payload = self._read_json()
            result = self.runtime.search(
                str(payload.get("query") or ""),
                limit=int(payload.get("limit") or 40),
                oversample=int(payload.get("oversample") or 160),
                routed_book_id=str(payload.get("routed_book_id") or ""),
                madhhab=str(payload.get("madhhab") or ""),
                discipline=str(payload.get("discipline") or ""),
            )
            self._json(result)
        except ValueError as exc:
            self._json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except Exception as exc:
            self._json(
                {"ok": False, "error": f"{type(exc).__name__}: {exc}"},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )
        finally:
            gate.release()


def main() -> int:
    parser = argparse.ArgumentParser(description="Athar V6.5 isolated semantic ANN sidecar")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT") or "8765"))
    parser.add_argument(
        "--ann-manifest",
        type=Path,
        default=_rooted(os.getenv("ATHAR_ANN_MANIFEST") or DEFAULT_ANN_MANIFEST),
    )
    parser.add_argument("--model", default=str(os.getenv("ATHAR_SEMANTIC_MODEL") or DEFAULT_MODEL))
    args = parser.parse_args()

    runtime = SemanticRuntime(_rooted(args.ann_manifest), model_name=str(args.model))
    status = runtime.initialize()
    server = SemanticHTTPServer((args.host, args.port), Handler)
    server.runtime = runtime  # type: ignore[attr-defined]
    server.auth_token = str(os.getenv("ATHAR_SEMANTIC_TOKEN") or "").strip()  # type: ignore[attr-defined]
    server.semantic_gate = threading.BoundedSemaphore(1)  # type: ignore[attr-defined]
    print(
        json.dumps(
            {
                **status,
                "host": args.host,
                "port": args.port,
                "auth_required": bool(server.auth_token),  # type: ignore[attr-defined]
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
        runtime.close()
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
