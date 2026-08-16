from __future__ import annotations

"""Athar V6.5 remote semantic fusion for the lightweight corpus server.

The main process retains V6.1 as routing/abstention authority and never imports
FastEmbed, ONNX, NumPy or USearch. It asks a separate semantic sidecar only for
candidate IDs, hydrates canonical passages from its existing shards, then uses
the same weighted RRF policy as V6.3-C.
"""

import json
import os
import threading
import time
from collections import defaultdict
from dataclasses import dataclass
from typing import Any

import requests

from v5_engine import normalize_text
from v5_sharded import ShardedCorpusRuntime, open_readonly

_ALL = {"", "all", "tous", "toutes", "toutes les ecoles", "toutes les écoles", "auto", "automatique"}


def _strict(value: str) -> bool:
    wanted = normalize_text(value)
    return wanted not in {normalize_text(item) for item in _ALL}


def _trim(value: Any, limit: int = 1800) -> str:
    text = " ".join(str(value or "").split())
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


@dataclass(frozen=True)
class RemoteFusionConfig:
    lexical_limit: int = 20
    semantic_limit: int = 40
    semantic_oversample: int = 160
    rrf_k: int = 60
    lexical_weight: float = 1.0
    semantic_weight: float = 1.0
    anchor_lexical_top1: bool = True


class RemoteSemanticClient:
    def __init__(
        self,
        base_url: str,
        *,
        token: str = "",
        connect_timeout: float = 2.0,
        read_timeout: float = 8.0,
    ) -> None:
        self.base_url = str(base_url or "").strip().rstrip("/")
        if not self.base_url:
            raise ValueError("URL du sidecar sémantique requise.")
        self.token = str(token or "").strip()
        self.timeout = (max(0.2, float(connect_timeout)), max(0.5, float(read_timeout)))
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Athar-RAG-V6.5-main"})
        if self.token:
            self.session.headers.update({"Authorization": f"Bearer {self.token}"})

    def close(self) -> None:
        self.session.close()

    def status(self) -> dict[str, Any]:
        response = self.session.get(
            self.base_url + "/api/semantic/status",
            timeout=self.timeout,
            headers={"Cache-Control": "no-cache"},
        )
        response.raise_for_status()
        payload = response.json()
        if not isinstance(payload, dict):
            raise RuntimeError("Statut sidecar sémantique invalide.")
        return payload

    def search(
        self,
        query: str,
        *,
        limit: int,
        oversample: int,
        routed_book_id: str,
        madhhab: str,
        discipline: str,
    ) -> dict[str, Any]:
        payload = {
            "query": str(query),
            "limit": int(limit),
            "oversample": int(oversample),
            "routed_book_id": str(routed_book_id or ""),
            "madhhab": str(madhhab or ""),
            "discipline": str(discipline or ""),
        }
        response = self.session.post(
            self.base_url + "/api/semantic/search",
            json=payload,
            timeout=self.timeout,
            headers={"Cache-Control": "no-cache"},
        )
        response.raise_for_status()
        result = response.json()
        if not isinstance(result, dict) or result.get("ok") is not True:
            raise RuntimeError(f"Réponse sidecar invalide: {result!r}")
        candidates = result.get("candidates")
        if not isinstance(candidates, list):
            raise RuntimeError("`candidates` sémantiques doit être une liste.")
        return result


class V65RemoteFusionRuntime:
    ENGINE = "rag-v6.5-remote-semantic-fused"
    FALLBACK_ENGINE = "rag-v6.1-hybrid-multilingual"

    def __init__(
        self,
        base: ShardedCorpusRuntime,
        client: RemoteSemanticClient,
        *,
        config: RemoteFusionConfig | None = None,
        fail_open: bool = True,
    ) -> None:
        self.base = base
        self.client = client
        self.config = config or RemoteFusionConfig()
        self.fail_open = bool(fail_open)
        self._state_lock = threading.Lock()
        self._last_remote_error = ""
        self._last_remote_ms: float | None = None
        self._last_remote_ok_at: float | None = None
        self._remote_successes = 0
        self._remote_failures = 0

    def __getattr__(self, name: str) -> Any:
        return getattr(self.base, name)

    def validate(self, *, require_remote: bool = False) -> None:
        self.base.validate()
        cfg = self.config
        if cfg.lexical_limit < 1 or cfg.lexical_limit > 20:
            raise ValueError("lexical_limit doit être compris entre 1 et 20.")
        if cfg.semantic_limit < 1 or cfg.semantic_oversample < cfg.semantic_limit:
            raise ValueError("Fenêtre sémantique distante invalide.")
        if require_remote:
            status = self.client.status()
            if status.get("ready") is not True:
                raise RuntimeError(f"Sidecar sémantique non prêt: {status}")

    def _record_remote(self, *, elapsed_ms: float, error: str = "") -> None:
        with self._state_lock:
            self._last_remote_ms = elapsed_ms
            self._last_remote_error = error
            if error:
                self._remote_failures += 1
            else:
                self._remote_successes += 1
                self._last_remote_ok_at = time.time()

    @staticmethod
    def _allowed_candidate(
        row: dict[str, Any], *, routed_book_id: str, madhhab: str, discipline: str,
        shard_paths: dict[str, Any],
    ) -> bool:
        chunk_id = str(row.get("chunk_id") or "")
        book_id = str(row.get("book_id") or "")
        shard_id = str(row.get("shard_id") or "")
        if not chunk_id or not book_id or shard_id not in shard_paths:
            return False
        if routed_book_id and book_id != routed_book_id:
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
        try:
            int(row.get("ann_rank") or 0)
            float(row.get("ann_similarity") or 0.0)
        except (TypeError, ValueError):
            return False
        return True

    def _remote_candidates(
        self,
        query: str,
        *,
        routed_book_id: str,
        madhhab: str,
        discipline: str,
    ) -> tuple[list[dict[str, Any]], float]:
        cfg = self.config
        started = time.perf_counter()
        result = self.client.search(
            query,
            limit=cfg.semantic_limit,
            oversample=cfg.semantic_oversample,
            routed_book_id=routed_book_id,
            madhhab=madhhab,
            discipline=discipline,
        )
        elapsed = (time.perf_counter() - started) * 1000.0
        rows: list[dict[str, Any]] = []
        seen: set[str] = set()
        for raw in result.get("candidates") or []:
            if not isinstance(raw, dict):
                continue
            row = dict(raw)
            if not self._allowed_candidate(
                row,
                routed_book_id=routed_book_id,
                madhhab=madhhab,
                discipline=discipline,
                shard_paths=self.base.shard_paths,
            ):
                continue
            chunk_id = str(row["chunk_id"])
            if chunk_id in seen:
                continue
            seen.add(chunk_id)
            rows.append(row)
            if len(rows) >= cfg.semantic_limit:
                break
        self._record_remote(elapsed_ms=elapsed)
        return rows, elapsed

    def _hydrate(self, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for row in rows:
            grouped[str(row.get("shard_id") or "")].append(row)

        hydrated: dict[str, dict[str, Any]] = {}
        for shard_id, group in grouped.items():
            path = self.base.shard_paths.get(shard_id)
            if path is None:
                continue
            ids = [str(item["chunk_id"]) for item in group]
            with open_readonly(path) as conn:
                for start in range(0, len(ids), 400):
                    batch = ids[start:start + 400]
                    marks = ",".join("?" for _ in batch)
                    found = conn.execute(
                        f"""
                        SELECT c.id, c.book_id, c.page, c.chapter, c.text_ar, c.text_fr,
                               c.translation_status, c.source_url,
                               b.title, b.title_ar, b.author, b.discipline, b.madhhab
                        FROM chunks c JOIN books b ON b.id=c.book_id
                        WHERE c.id IN ({marks})
                        """,
                        batch,
                    ).fetchall()
                    for value in found:
                        hydrated[str(value["id"])] = dict(value)

        result: list[dict[str, Any]] = []
        for row in rows:
            chunk_id = str(row["chunk_id"])
            source = hydrated.get(chunk_id)
            if source is None:
                continue
            # Never trust remote metadata over the canonical shard row.
            if str(source.get("book_id") or "") != str(row.get("book_id") or ""):
                continue
            similarity = float(row.get("ann_similarity") or 0.0)
            result.append(
                {
                    "id": chunk_id,
                    "book_id": str(source.get("book_id") or ""),
                    "title": str(source.get("title") or ""),
                    "title_ar": str(source.get("title_ar") or ""),
                    "author": str(source.get("author") or ""),
                    "discipline": str(source.get("discipline") or ""),
                    "madhhab": str(source.get("madhhab") or ""),
                    "page": source.get("page"),
                    "chapter": str(source.get("chapter") or ""),
                    "text_ar": _trim(source.get("text_ar")),
                    "text_fr": _trim(source.get("text_fr")),
                    "translation_status": str(source.get("translation_status") or ""),
                    "source_url": str(source.get("source_url") or ""),
                    "relevance": max(1, min(98, int(round(similarity * 100)))),
                    "matched_concepts": [],
                    "matched_terms": [],
                    "shard_id": str(row.get("shard_id") or ""),
                    "ann_rank": int(row.get("ann_rank") or 0),
                    "ann_distance": round(float(row.get("ann_distance") or 0.0), 7),
                    "ann_similarity": round(similarity, 7),
                    "retrieval_origin": "ann_remote",
                }
            )
        return result

    def _fuse(
        self,
        lexical: list[dict[str, Any]],
        semantic: list[dict[str, Any]],
        *,
        limit: int,
    ) -> list[dict[str, Any]]:
        cfg = self.config
        merged: dict[str, dict[str, Any]] = {}
        lexical_rank: dict[str, int] = {}
        semantic_rank: dict[str, int] = {}

        for rank, source in enumerate(lexical, 1):
            chunk_id = str(source.get("id") or "")
            if not chunk_id:
                continue
            item = dict(source)
            item.pop("citation_id", None)
            item["retrieval_origin"] = "lexical"
            merged[chunk_id] = item
            lexical_rank[chunk_id] = rank

        for rank, source in enumerate(semantic, 1):
            chunk_id = str(source.get("id") or "")
            if not chunk_id:
                continue
            semantic_rank[chunk_id] = rank
            if chunk_id in merged:
                merged[chunk_id]["retrieval_origin"] = "lexical+ann_remote"
                merged[chunk_id]["ann_rank"] = source.get("ann_rank")
                merged[chunk_id]["ann_similarity"] = source.get("ann_similarity")
                merged[chunk_id]["ann_distance"] = source.get("ann_distance")
            else:
                merged[chunk_id] = dict(source)

        scored: list[dict[str, Any]] = []
        for chunk_id, item in merged.items():
            score = 0.0
            if chunk_id in lexical_rank:
                score += cfg.lexical_weight / (cfg.rrf_k + lexical_rank[chunk_id])
            if chunk_id in semantic_rank:
                score += cfg.semantic_weight / (cfg.rrf_k + semantic_rank[chunk_id])
            copy = dict(item)
            copy["lexical_rank"] = lexical_rank.get(chunk_id)
            copy["semantic_rank"] = semantic_rank.get(chunk_id)
            copy["rrf_score"] = round(score, 8)
            scored.append(copy)

        scored.sort(
            key=lambda item: (
                float(item.get("rrf_score") or 0.0),
                float(item.get("ann_similarity") or 0.0),
                -int(item.get("lexical_rank") or 999999),
            ),
            reverse=True,
        )
        if cfg.anchor_lexical_top1 and lexical:
            anchor_id = str(lexical[0].get("id") or "")
            anchor = next((item for item in scored if str(item.get("id") or "") == anchor_id), None)
            if anchor is not None:
                scored = [anchor] + [item for item in scored if item is not anchor]

        final = scored[: max(1, min(int(limit), 20))]
        for index, item in enumerate(final, 1):
            item["citation_id"] = f"S{index}"
        return final

    def _fallback_result(
        self,
        lexical_result: dict[str, Any],
        *,
        error: str,
        remote_ms: float | None,
    ) -> dict[str, Any]:
        result = dict(lexical_result)
        analysis = dict(result.get("analysis") or {})
        analysis.update(
            {
                "engine": self.ENGINE,
                "production_retrieval": True,
                "retrieval_engine_active": self.ENGINE,
                "semantic_mode": "remote",
                "semantic_remote_available": False,
                "semantic_remote_fallback": True,
                "semantic_remote_error": error,
                "semantic_remote_ms": round(remote_ms, 3) if remote_ms is not None else None,
                "semantic_promotion_policy": "preserve_v61_abstention",
            }
        )
        result["analysis"] = analysis
        return result

    def search(
        self,
        query: str,
        *,
        limit: int = 8,
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        limit = max(1, min(int(limit), 20))
        lexical_result = self.base.search(
            query,
            limit=max(limit, min(self.config.lexical_limit, 20)),
            madhhab=madhhab,
            discipline=discipline,
        )
        lexical = [dict(item) for item in lexical_result.get("sources") or []]
        analysis = dict(lexical_result.get("analysis") or {})
        routed = analysis.get("routed_book") or {}
        routed_book_id = str(routed.get("id") or "") if isinstance(routed, dict) else ""

        # Contract inherited from V6.3-C: remote semantic evidence can improve
        # ranking but can never reverse a deterministic V6.1 abstention.
        if not lexical:
            analysis.update(
                {
                    "engine": self.ENGINE,
                    "production_retrieval": True,
                    "retrieval_engine_active": self.ENGINE,
                    "semantic_mode": "remote",
                    "semantic_remote_called": False,
                    "semantic_remote_available": None,
                    "semantic_remote_fallback": False,
                    "semantic_remote_error": "",
                    "semantic_remote_ms": None,
                    "semantic_promotion_policy": "preserve_v61_abstention",
                    "semantic_skip_reason": "v61_abstention",
                }
            )
            return {**lexical_result, "analysis": analysis}

        remote_started = time.perf_counter()
        try:
            rows, remote_ms = self._remote_candidates(
                query,
                routed_book_id=routed_book_id,
                madhhab=madhhab,
                discipline=discipline,
            )
            semantic = self._hydrate(rows)
        except Exception as exc:
            remote_ms = (time.perf_counter() - remote_started) * 1000.0
            error = f"{type(exc).__name__}: {exc}"
            self._record_remote(elapsed_ms=remote_ms, error=error)
            if not self.fail_open:
                raise
            return self._fallback_result(lexical_result, error=error, remote_ms=remote_ms)

        sources = self._fuse(lexical, semantic, limit=limit)
        lexical_ids = {str(item.get("id") or "") for item in lexical}
        semantic_ids = {str(item.get("id") or "") for item in semantic}
        analysis.update(
            {
                "engine": self.ENGINE,
                "production_retrieval": True,
                "retrieval_engine_active": self.ENGINE,
                "semantic_embeddings": True,
                "semantic_mode": "remote",
                "semantic_remote_called": True,
                "semantic_remote_available": True,
                "semantic_remote_fallback": False,
                "semantic_remote_error": "",
                "semantic_remote_ms": round(remote_ms, 3),
                "semantic_candidate_count": len(semantic),
                "semantic_only_candidate_count": len(semantic_ids - lexical_ids),
                "semantic_promotion_policy": "human-gold-approved-preserve-v61-abstention",
                "fusion": "weighted_rrf",
            }
        )
        return {"query": str(query), "analysis": analysis, "sources": sources, "count": len(sources)}

    def ask(
        self,
        query: str,
        *,
        limit: int = 8,
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        result = self.search(query, limit=limit, madhhab=madhhab, discipline=discipline)
        sources = list(result.get("sources") or [])
        claims: list[dict[str, Any]] = []
        for source in sources[:4]:
            text = source.get("text_fr") or source.get("text_ar") or ""
            if text:
                claims.append(
                    {
                        "id": f"C{len(claims) + 1}",
                        "text": _trim(text, 700),
                        "source_ids": [source["citation_id"]],
                        "kind": "direct_excerpt",
                        "relevance": source.get("relevance"),
                    }
                )
        if not sources:
            summary = "Aucun passage V6.1 admissible ; la recherche sémantique distante ne renverse pas l'abstention."
            verdict = "insufficient"
        elif (result.get("analysis") or {}).get("semantic_remote_fallback"):
            summary = f"{len(sources)} passage(s) V6.1 retrouvé(s) ; le sidecar sémantique est temporairement indisponible."
            verdict = "evidence_found"
        else:
            summary = f"{len(sources)} passage(s) fusionné(s) V6.1 + recherche sémantique distante."
            verdict = "evidence_found"
        return {
            **result,
            "answer": {
                "mode": "evidence_only",
                "summary": summary,
                "verdict": verdict,
                "claims": claims,
                "warning": "Les scores indiquent une pertinence documentaire, pas un degré de certitude religieuse.",
            },
        }

    def operational_status(self) -> dict[str, Any]:
        with self._state_lock:
            return {
                "engine": self.ENGINE,
                "semantic_embeddings": True,
                "semantic_mode": "remote",
                "semantic_remote_url": self.client.base_url,
                "semantic_remote_last_error": self._last_remote_error,
                "semantic_remote_last_ms": round(self._last_remote_ms, 3) if self._last_remote_ms is not None else None,
                "semantic_remote_last_ok_at": self._last_remote_ok_at,
                "semantic_remote_successes": self._remote_successes,
                "semantic_remote_failures": self._remote_failures,
                "semantic_fail_open": self.fail_open,
            }

    def status(self) -> dict[str, Any]:
        payload = dict(self.base.status())
        payload.update(self.operational_status())
        return payload

    def close(self) -> None:
        self.client.close()


def build_remote_runtime(base: ShardedCorpusRuntime) -> V65RemoteFusionRuntime:
    url = str(os.getenv("ATHAR_SEMANTIC_URL") or "").strip()
    if not url:
        raise RuntimeError("ATHAR_SEMANTIC_URL est requis pour V6.5.")
    client = RemoteSemanticClient(
        url,
        token=str(os.getenv("ATHAR_SEMANTIC_TOKEN") or ""),
        connect_timeout=float(os.getenv("ATHAR_SEMANTIC_CONNECT_TIMEOUT") or "2.0"),
        read_timeout=float(os.getenv("ATHAR_SEMANTIC_READ_TIMEOUT") or "8.0"),
    )
    return V65RemoteFusionRuntime(
        base,
        client,
        config=RemoteFusionConfig(
            lexical_limit=20,
            semantic_limit=max(10, int(os.getenv("ATHAR_SEMANTIC_LIMIT") or "40")),
            semantic_oversample=max(80, int(os.getenv("ATHAR_SEMANTIC_OVERSAMPLE") or "160")),
        ),
        fail_open=str(os.getenv("ATHAR_SEMANTIC_FAIL_OPEN") or "1").strip().lower()
        in {"1", "true", "yes", "oui", "on"},
    )


__all__ = [
    "RemoteFusionConfig",
    "RemoteSemanticClient",
    "V65RemoteFusionRuntime",
    "build_remote_runtime",
]
