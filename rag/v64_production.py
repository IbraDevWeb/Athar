from __future__ import annotations

"""Athar V6.4 production retrieval runtime.

V6.3-C fused is promoted behind a reversible adapter. V6.1 remains available
at all times as the deterministic fail-open fallback. The USearch index is
viewed from disk instead of loaded into process RAM.
"""

import json
import os
import sqlite3
import time
from pathlib import Path
from typing import Any, Iterable

import numpy as np

from v5_sharded import ShardedCorpusRuntime
from v63_hybrid import DEFAULT_MODEL
from v63c_ann_index import ANN_VERSION, DEFAULT_EXPANSION_SEARCH, sha256
from v63c_shadow import AnnFusionConfig, AnnShadowRuntime

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ANN_MANIFEST = ROOT / "rag" / "data" / "v63c-ann" / "athar-v63c-global.ann.json"


def _truthy(name: str, default: bool) -> bool:
    raw = str(os.getenv(name) or "").strip().lower()
    if not raw:
        return default
    return raw in {"1", "true", "yes", "oui", "on"}


def _repo_path(value: str | Path) -> Path:
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


def _open_ro(path: Path) -> sqlite3.Connection:
    # ThreadingHTTPServer may initialize the ANN sidecar on /status and query it
    # from another request thread. The sidecar is immutable/read-only and the
    # heavy retrieval path is serialized by the HTTP server gate.
    conn = sqlite3.connect(
        f"file:{path.resolve().as_posix()}?mode=ro&immutable=1",
        uri=True,
        timeout=15,
        check_same_thread=False,
    )
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA mmap_size=0")
    conn.execute("PRAGMA cache_size=-4096")
    return conn


class ViewedGlobalAnnIndex:
    """Read-only USearch index served directly from disk using `Index.view`."""

    def __init__(self, manifest_path: Path, *, verify_sha: bool = True) -> None:
        from usearch.index import Index

        self.manifest_path = manifest_path.resolve()
        self.manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        if self.manifest.get("version") != ANN_VERSION:
            raise RuntimeError("Version ANN production incompatible.")
        root = self.manifest_path.parent
        self.index_path = root / str(self.manifest["index_file"])
        self.meta_path = root / str(self.manifest["metadata_file"])
        if not self.index_path.exists() or not self.meta_path.exists():
            raise RuntimeError("Fichiers ANN production incomplets.")
        if self.index_path.stat().st_size != int(self.manifest["index_size_bytes"]):
            raise RuntimeError("Taille de l'index ANN production invalide.")
        if self.meta_path.stat().st_size != int(self.manifest["metadata_size_bytes"]):
            raise RuntimeError("Taille du sidecar ANN production invalide.")
        if verify_sha:
            if sha256(self.index_path) != str(self.manifest["index_sha256"]):
                raise RuntimeError("SHA de l'index ANN production invalide.")
            if sha256(self.meta_path) != str(self.manifest["metadata_sha256"]):
                raise RuntimeError("SHA du sidecar ANN production invalide.")

        self.index = Index(
            ndim=int(self.manifest["dimension"]),
            metric=str(self.manifest["metric"]),
            dtype="f16",
            expansion_search=max(
                16, int(self.manifest.get("expansion_search") or DEFAULT_EXPANSION_SEARCH)
            ),
        )
        self.index.view(str(self.index_path))
        self.meta = _open_ro(self.meta_path)
        mapped = int(self.meta.execute("SELECT COUNT(*) FROM ann_rows").fetchone()[0])
        if mapped != int(self.manifest["vectors"]):
            raise RuntimeError(f"Mapping ANN production incomplet: {mapped}/{self.manifest['vectors']}")

    def close(self) -> None:
        try:
            self.meta.close()
        except Exception:
            pass

    def rows_for_keys(self, keys: Iterable[int]) -> dict[int, dict[str, Any]]:
        values = [int(key) for key in keys]
        if not values:
            return {}
        result: dict[int, dict[str, Any]] = {}
        for start in range(0, len(values), 500):
            batch = values[start:start + 500]
            marks = ",".join("?" for _ in batch)
            for row in self.meta.execute(
                f"SELECT * FROM ann_rows WHERE ann_key IN ({marks})", batch
            ).fetchall():
                result[int(row["ann_key"])] = dict(row)
        return result

    def search(self, query_vector: np.ndarray, *, top_k: int = 40) -> list[dict[str, Any]]:
        query = np.asarray(query_vector, dtype=np.float32)
        if query.ndim != 1 or query.shape[0] != int(self.manifest["dimension"]):
            raise ValueError("Dimension de requête ANN production invalide.")
        norm = float(np.linalg.norm(query))
        if not np.isfinite(norm) or norm <= 1e-12:
            raise ValueError("Vecteur de requête ANN production nul ou non fini.")
        query = query / norm
        top_k = max(1, min(int(top_k), int(self.manifest["vectors"])))
        matches = self.index.search(query, top_k)
        keys = [int(match.key) for match in matches]
        rows = self.rows_for_keys(keys)
        result: list[dict[str, Any]] = []
        for rank, match in enumerate(matches, 1):
            row = rows.get(int(match.key))
            if not row:
                continue
            distance = float(match.distance)
            result.append(
                {
                    **row,
                    "ann_rank": rank,
                    "ann_distance": distance,
                    "ann_similarity": 1.0 - distance,
                }
            )
        return result


class ProductionAnnRuntime(AnnShadowRuntime):
    """Same validated V6.3-C fusion, with a build-cached FastEmbed model."""

    @property
    def model(self):
        if self._model is None:
            from fastembed import TextEmbedding

            cache = str(os.getenv("FASTEMBED_CACHE_PATH") or "").strip()
            kwargs: dict[str, Any] = {}
            if cache:
                kwargs["cache_dir"] = str(_repo_path(cache))
            if _truthy("ATHAR_FASTEMBED_LOCAL_ONLY", True):
                kwargs["local_files_only"] = True
            self._model = TextEmbedding(model_name=self.model_name, **kwargs)
        return self._model


class V64ProductionRuntime:
    """Proxy preserving the full ShardedCorpusRuntime API plus fused retrieval."""

    ENGINE = "rag-v6.4-v63c-fused-production"
    FALLBACK_ENGINE = "rag-v6.1-hybrid-multilingual"

    def __init__(
        self,
        base: ShardedCorpusRuntime,
        *,
        configured_engine: str = "v63c",
        ann_manifest: Path = DEFAULT_ANN_MANIFEST,
        fail_open: bool = True,
        debug_ann: bool = False,
    ) -> None:
        self.base = base
        requested = str(configured_engine or "v63c").strip().lower()
        if requested not in {"v61", "v63c", "auto"}:
            raise ValueError(f"ATHAR_RETRIEVAL_ENGINE invalide: {requested!r}")
        self.configured_engine = requested
        self.ann_manifest = ann_manifest.resolve()
        self.fail_open = bool(fail_open)
        self.debug_ann = bool(debug_ann)
        self._ann: ViewedGlobalAnnIndex | None = None
        self._runtime: ProductionAnnRuntime | None = None
        self._ann_error = ""
        self._warmup_ms: float | None = None
        self._warmup_complete = False

    def __getattr__(self, name: str) -> Any:
        return getattr(self.base, name)

    @property
    def active_engine(self) -> str:
        if self.configured_engine == "v61":
            return self.FALLBACK_ENGINE
        if self._runtime is not None:
            return self.ENGINE
        return self.FALLBACK_ENGINE if self._ann_error else "pending-v63c"

    def _ensure_runtime(self) -> ProductionAnnRuntime | None:
        if self.configured_engine == "v61":
            return None
        if self._runtime is not None:
            return self._runtime
        if self._ann_error:
            return None
        try:
            verify = _truthy("ATHAR_ANN_VERIFY_SHA", True)
            ann = ViewedGlobalAnnIndex(self.ann_manifest, verify_sha=verify)
            runtime = ProductionAnnRuntime(
                self.base,
                ann,
                model_name=str(os.getenv("ATHAR_SEMANTIC_MODEL") or DEFAULT_MODEL),
                config=AnnFusionConfig(
                    lexical_limit=20,
                    ann_limit=max(10, int(os.getenv("ATHAR_ANN_LIMIT") or "40")),
                    ann_oversample=max(80, int(os.getenv("ATHAR_ANN_OVERSAMPLE") or "160")),
                    rrf_k=60,
                    lexical_weight=1.0,
                    semantic_weight=1.0,
                    anchor_lexical_top1=True,
                ),
            )
            runtime.validate()
            self._ann = ann
            self._runtime = runtime
            return runtime
        except Exception as exc:
            self._ann_error = f"{type(exc).__name__}: {exc}"
            if not self.fail_open:
                raise
            return None

    def validate(self) -> None:
        self.base.validate()
        runtime = self._ensure_runtime()
        if self.configured_engine == "v63c" and runtime is None and not self.fail_open:
            raise RuntimeError(self._ann_error or "V6.3-C production indisponible.")

    def warmup(self) -> dict[str, Any]:
        """Load ONNX/FastEmbed and execute one real ANN lookup before HTTP readiness."""
        if self.configured_engine == "v61":
            self._warmup_complete = True
            self._warmup_ms = 0.0
            return {"engine": self.FALLBACK_ENGINE, "warmup_ms": 0.0, "fallback": False}
        runtime = self._ensure_runtime()
        if runtime is None:
            self._warmup_complete = True
            return {
                "engine": self.FALLBACK_ENGINE,
                "warmup_ms": self._warmup_ms,
                "fallback": True,
                "reason": self._ann_error,
            }
        started = time.perf_counter()
        try:
            qvec = runtime._embed_query("Athar semantic production warmup tayammum الصلاة")
            # Exercise both the disk-view graph and SQLite sidecar so the first
            # user request does not pay lazy initialization/page-fault costs.
            rows = runtime.ann.search(qvec, top_k=min(8, runtime.config.ann_oversample))
            if not rows:
                raise RuntimeError("Warmup ANN sans résultat.")
            self._warmup_ms = (time.perf_counter() - started) * 1000.0
            self._warmup_complete = True
            return {
                "engine": self.ENGINE,
                "warmup_ms": round(self._warmup_ms, 2),
                "fallback": False,
                "ann_hits": len(rows),
            }
        except Exception as exc:
            self._warmup_ms = (time.perf_counter() - started) * 1000.0
            self._warmup_complete = True
            self._ann_error = f"warmup {type(exc).__name__}: {exc}"
            self.close_ann(reset_error=False)
            if not self.fail_open:
                raise
            return {
                "engine": self.FALLBACK_ENGINE,
                "warmup_ms": round(self._warmup_ms, 2),
                "fallback": True,
                "reason": self._ann_error,
            }

    def _fallback(self, method: str, query: str, *, limit: int, madhhab: str, discipline: str) -> dict[str, Any]:
        call = getattr(self.base, method)
        result = call(query, limit=limit, madhhab=madhhab, discipline=discipline)
        analysis = dict(result.get("analysis") or {})
        analysis.update(
            {
                "production_retrieval": True,
                "retrieval_engine_configured": self.configured_engine,
                "retrieval_engine_active": self.FALLBACK_ENGINE,
                "retrieval_fallback": self.configured_engine != "v61",
                "retrieval_fallback_reason": self._ann_error,
                "ann_shadow_mode": False,
            }
        )
        result["analysis"] = analysis
        return result

    def _promoted(self, result: dict[str, Any]) -> dict[str, Any]:
        result = dict(result)
        analysis = dict(result.get("analysis") or {})
        analysis.update(
            {
                "engine": self.ENGINE,
                "production_retrieval": True,
                "retrieval_engine_configured": self.configured_engine,
                "retrieval_engine_active": self.ENGINE,
                "retrieval_fallback": False,
                "retrieval_fallback_reason": "",
                "ann_shadow_mode": False,
                "ann_promotion_policy": "human-gold-approved-preserve-v61-abstention",
            }
        )
        result["analysis"] = analysis
        if not self.debug_ann:
            result.pop("shadow_ann_sources", None)
            result.pop("shadow_ann_only_sources", None)
        return result

    def search(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        runtime = self._ensure_runtime()
        if runtime is None:
            return self._fallback("search", query, limit=limit, madhhab=madhhab, discipline=discipline)
        try:
            return self._promoted(
                runtime.search(query, limit=limit, madhhab=madhhab, discipline=discipline)
            )
        except Exception as exc:
            if not self.fail_open:
                raise
            self._ann_error = f"{type(exc).__name__}: {exc}"
            self.close_ann(reset_error=False)
            return self._fallback("search", query, limit=limit, madhhab=madhhab, discipline=discipline)

    def ask(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        runtime = self._ensure_runtime()
        if runtime is None:
            return self._fallback("ask", query, limit=limit, madhhab=madhhab, discipline=discipline)
        try:
            return self._promoted(
                runtime.ask(query, limit=limit, madhhab=madhhab, discipline=discipline)
            )
        except Exception as exc:
            if not self.fail_open:
                raise
            self._ann_error = f"{type(exc).__name__}: {exc}"
            self.close_ann(reset_error=False)
            return self._fallback("ask", query, limit=limit, madhhab=madhhab, discipline=discipline)

    def operational_status(self) -> dict[str, Any]:
        runtime = self._ensure_runtime()
        active = self.active_engine
        return {
            "engine": active,
            "semantic_embeddings": runtime is not None,
            "semantic_model": runtime.model_name if runtime is not None else "",
            "retrieval_engine_configured": self.configured_engine,
            "retrieval_engine_active": active,
            "retrieval_fallback": bool(self._ann_error),
            "retrieval_fallback_reason": self._ann_error,
            "ann_storage_mode": "disk_view" if runtime is not None else "unavailable",
            "ann_vectors": int(self._ann.manifest.get("vectors") or 0) if self._ann else 0,
            "semantic_warmup_complete": self._warmup_complete,
            "semantic_warmup_ms": round(self._warmup_ms, 2) if self._warmup_ms is not None else None,
        }

    def status(self) -> dict[str, Any]:
        payload = dict(self.base.status())
        payload.update(self.operational_status())
        return payload

    def close_ann(self, *, reset_error: bool = False) -> None:
        ann = self._ann
        self._runtime = None
        self._ann = None
        if reset_error:
            self._ann_error = ""
        if ann is not None:
            ann.close()


def build_production_runtime(base: ShardedCorpusRuntime) -> V64ProductionRuntime:
    configured = str(os.getenv("ATHAR_RETRIEVAL_ENGINE") or "v61").strip().lower()
    ann_manifest = _repo_path(os.getenv("ATHAR_ANN_MANIFEST") or DEFAULT_ANN_MANIFEST)
    return V64ProductionRuntime(
        base,
        configured_engine=configured,
        ann_manifest=ann_manifest,
        fail_open=_truthy("ATHAR_ANN_FAIL_OPEN", True),
        debug_ann=_truthy("ATHAR_ANN_DEBUG", False),
    )


__all__ = [
    "ViewedGlobalAnnIndex",
    "ProductionAnnRuntime",
    "V64ProductionRuntime",
    "build_production_runtime",
]
