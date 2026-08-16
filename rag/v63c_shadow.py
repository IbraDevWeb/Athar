from __future__ import annotations

"""Athar Research V6.3-C: global ANN retrieval in guarded shadow mode.

V6.1 remains the abstention/routing authority. ANN is always computed for
observation, but it is promoted into the experimental fused ranking only when
V6.1 already found evidence. Queries on which V6.1 abstains therefore stay
abstained while their ANN-only candidates can be exported for blind human review.
"""

import sqlite3
import time
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np

from v5_engine import normalize_text
from v5_sharded import ShardedCorpusRuntime, open_readonly
from v63_hybrid import DEFAULT_MODEL
from v63c_ann_index import GlobalAnnIndex

_ALL = {"", "all", "tous", "toutes", "toutes les ecoles", "toutes les écoles", "auto", "automatique"}


def _trim(value: Any, limit: int = 1800) -> str:
    text = " ".join(str(value or "").split())
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


def _strict_filter(value: str) -> bool:
    return normalize_text(value) not in {normalize_text(item) for item in _ALL}


@dataclass(frozen=True)
class AnnFusionConfig:
    lexical_limit: int = 20
    ann_limit: int = 40
    ann_oversample: int = 160
    rrf_k: int = 60
    lexical_weight: float = 1.0
    semantic_weight: float = 1.0
    anchor_lexical_top1: bool = True


class AnnShadowRuntime:
    def __init__(
        self,
        base: ShardedCorpusRuntime,
        ann: GlobalAnnIndex,
        *,
        model_name: str = DEFAULT_MODEL,
        config: AnnFusionConfig | None = None,
    ) -> None:
        self.base = base
        self.ann = ann
        self.model_name = model_name
        self.config = config or AnnFusionConfig()
        self._model: Any | None = None

    def validate(self) -> None:
        self.base.validate()
        corpus_sha = str(self.base.manifest.get("source_sha") or "")
        ann_sha = str(self.ann.manifest.get("corpus_source_sha") or "")
        if corpus_sha != ann_sha:
            raise RuntimeError(f"Corpus/ANN incompatibles: {corpus_sha} != {ann_sha}")
        if str(self.ann.manifest.get("semantic_model") or "") != self.model_name:
            raise RuntimeError("Le modèle de requête ne correspond pas au modèle de l'index ANN.")
        if self.config.lexical_limit < 1 or self.config.lexical_limit > 20:
            raise ValueError("lexical_limit doit être compris entre 1 et 20.")
        if self.config.ann_limit < 1 or self.config.ann_oversample < self.config.ann_limit:
            raise ValueError("Fenêtre ANN invalide.")

    @property
    def model(self):
        if self._model is None:
            from fastembed import TextEmbedding
            self._model = TextEmbedding(model_name=self.model_name)
        return self._model

    def _embed_query(self, query: str) -> np.ndarray:
        vectors = list(self.model.query_embed([query]))
        if len(vectors) != 1:
            raise RuntimeError("Embedding de requête ANN invalide.")
        vector = np.asarray(vectors[0], dtype=np.float32)
        norm = float(np.linalg.norm(vector))
        if not np.isfinite(norm) or norm <= 1e-12:
            raise RuntimeError("Embedding de requête nul ou non fini.")
        return vector / norm

    @staticmethod
    def _allowed_meta(
        row: dict[str, Any], *, routed_book_id: str, madhhab: str, discipline: str
    ) -> bool:
        if routed_book_id and str(row.get("book_id") or "") != routed_book_id:
            return False
        if _strict_filter(madhhab):
            wanted = normalize_text(madhhab)
            actual = normalize_text(row.get("madhhab", ""))
            if not actual or wanted not in actual:
                return False
        if _strict_filter(discipline):
            wanted = normalize_text(discipline)
            actual = normalize_text(row.get("discipline", ""))
            if not actual or wanted not in actual:
                return False
        return True

    def _ann_candidates(
        self, query: str, *, routed_book_id: str, madhhab: str, discipline: str
    ) -> tuple[list[dict[str, Any]], float]:
        started = time.perf_counter()
        qvec = self._embed_query(query)
        rows = self.ann.search(qvec, top_k=self.config.ann_oversample)
        filtered = [
            row for row in rows
            if self._allowed_meta(
                row, routed_book_id=routed_book_id, madhhab=madhhab, discipline=discipline
            )
        ][: self.config.ann_limit]
        elapsed = (time.perf_counter() - started) * 1000.0
        return filtered, elapsed

    def _hydrate(self, rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
        grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for row in rows:
            grouped[str(row.get("shard_id") or "")].append(row)
        hydrated: dict[str, dict[str, Any]] = {}
        for shard_id, group in grouped.items():
            path = self.base.shard_paths.get(shard_id)
            if not path:
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
            if not source:
                continue
            similarity = float(row.get("ann_similarity") or 0.0)
            result.append({
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
                "ann_distance": round(float(row.get("ann_distance") or 0.0), 6),
                "ann_similarity": round(similarity, 6),
                "retrieval_origin": "ann_global",
            })
        return result

    def _fuse(
        self, lexical: list[dict[str, Any]], semantic: list[dict[str, Any]], *, limit: int
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
            item["retrieval_origin"] = "lexical"
            merged[chunk_id] = item
            lexical_rank[chunk_id] = rank
        for rank, source in enumerate(semantic, 1):
            chunk_id = str(source.get("id") or "")
            if not chunk_id:
                continue
            semantic_rank[chunk_id] = rank
            if chunk_id in merged:
                merged[chunk_id]["retrieval_origin"] = "lexical+ann"
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
            if anchor:
                scored = [anchor] + [item for item in scored if item is not anchor]
        final = scored[:limit]
        for index, item in enumerate(final, 1):
            item["citation_id"] = f"S{index}"
        return final

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

        ann_rows, ann_ms = self._ann_candidates(
            query, routed_book_id=routed_book_id, madhhab=madhhab, discipline=discipline
        )
        semantic = self._hydrate(ann_rows)
        lexical_ids = {str(item.get("id") or "") for item in lexical}
        ann_only = [item for item in semantic if str(item.get("id") or "") not in lexical_ids]

        # Shadow-mode safety contract: an ANN hit cannot reverse a V6.1
        # abstention. Such candidates are still returned under shadow_ann_sources
        # so they can enter a blind human-gold pool.
        promotion_allowed = bool(lexical)
        sources = self._fuse(lexical, semantic, limit=limit) if promotion_allowed else []
        analysis.update({
            "engine": "rag-v6.3-c-global-ann-shadow",
            "semantic_embeddings": True,
            "semantic_model": self.model_name,
            "semantic_stage": "global_ann_shadow",
            "ann_version": self.ann.manifest.get("version"),
            "ann_library": "usearch",
            "ann_metric": self.ann.manifest.get("metric"),
            "ann_vectors": int(self.ann.manifest.get("vectors") or 0),
            "ann_candidate_count": len(semantic),
            "ann_only_candidate_count": len(ann_only),
            "ann_query_ms": round(ann_ms, 2),
            "ann_promotion_allowed": promotion_allowed,
            "ann_promotion_policy": "never_reverse_v61_abstention",
            "ann_shadow_mode": True,
            "fusion": "weighted_rrf" if promotion_allowed else "shadow_only",
        })
        return {
            "query": str(query),
            "analysis": analysis,
            "sources": sources,
            "count": len(sources),
            "shadow_ann_sources": semantic,
            "shadow_ann_only_sources": ann_only,
        }

    def ask(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        result = self.search(query, limit=limit, madhhab=madhhab, discipline=discipline)
        sources = list(result.get("sources") or [])
        claims: list[dict[str, Any]] = []
        for source in sources[:4]:
            text = source.get("text_fr") or source.get("text_ar") or ""
            if text:
                claims.append({
                    "id": f"C{len(claims)+1}", "text": _trim(text, 700),
                    "source_ids": [source["citation_id"]], "kind": "direct_excerpt",
                    "relevance": source.get("relevance"),
                })
        if not sources:
            summary = "Aucun passage V6.1 admissible ; les candidats ANN restent en shadow mode et ne sont pas promus."
            verdict = "insufficient"
        else:
            summary = f"{len(sources)} passage(s) fusionné(s) V6.1 + ANN en environnement expérimental."
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


__all__ = ["AnnFusionConfig", "AnnShadowRuntime"]
