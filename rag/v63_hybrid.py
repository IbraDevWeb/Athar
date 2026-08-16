from __future__ import annotations

"""Athar Research V6.3-A: guarded multilingual semantic reranking.

The production V6.1 retriever remains authoritative for candidate generation,
book routing, strict madhhab filtering and abstention. V6.3 only reorders the
already accepted candidate pool with multilingual dense embeddings and a
weighted Reciprocal Rank Fusion (RRF). This keeps the experiment reversible and
prevents the embedding model from inventing citations or bypassing safety gates.
"""

from dataclasses import dataclass
from typing import Any, Iterable

import numpy as np

from v5_sharded import ShardedCorpusRuntime

DEFAULT_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def _trim(value: Any, limit: int = 1800) -> str:
    text = " ".join(str(value or "").split())
    return text if len(text) <= limit else text[:limit].rstrip()


def _candidate_text(source: dict[str, Any]) -> str:
    parts = [
        str(source.get("title") or "").strip(),
        str(source.get("chapter") or "").strip(),
        str(source.get("text_fr") or "").strip(),
        str(source.get("text_ar") or "").strip(),
    ]
    return _trim("\n".join(part for part in parts if part), 2200)


def _cosine(query: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    query = np.asarray(query, dtype=np.float32)
    matrix = np.asarray(matrix, dtype=np.float32)
    qnorm = float(np.linalg.norm(query))
    dnorm = np.linalg.norm(matrix, axis=1)
    denom = np.maximum(dnorm * max(qnorm, 1e-12), 1e-12)
    return (matrix @ query) / denom


@dataclass(frozen=True)
class FusionConfig:
    candidate_limit: int = 20
    rrf_k: int = 60
    lexical_weight: float = 2.0
    semantic_weight: float = 1.0
    anchor_lexical_top1: bool = True


class HybridSemanticRuntime:
    """Experimental semantic reranker around the stable sharded runtime."""

    def __init__(
        self,
        base: ShardedCorpusRuntime,
        *,
        model_name: str = DEFAULT_MODEL,
        config: FusionConfig | None = None,
    ) -> None:
        self.base = base
        self.model_name = model_name
        self.config = config or FusionConfig()
        self._model: Any | None = None

    def validate(self) -> None:
        self.base.validate()
        if self.config.candidate_limit < 2 or self.config.candidate_limit > 20:
            raise ValueError("candidate_limit doit être compris entre 2 et 20.")
        if self.config.rrf_k < 1:
            raise ValueError("rrf_k doit être positif.")
        if self.config.lexical_weight <= 0 or self.config.semantic_weight <= 0:
            raise ValueError("Les poids RRF doivent être positifs.")

    @property
    def model(self):
        if self._model is None:
            from fastembed import TextEmbedding

            self._model = TextEmbedding(model_name=self.model_name)
        return self._model

    def _embed_query(self, query: str) -> np.ndarray:
        vectors = list(self.model.query_embed([query]))
        if len(vectors) != 1:
            raise RuntimeError("Le modèle sémantique n'a pas retourné un embedding de requête unique.")
        return np.asarray(vectors[0], dtype=np.float32)

    def _embed_passages(self, texts: Iterable[str]) -> np.ndarray:
        values = list(texts)
        vectors = list(self.model.passage_embed(values))
        if len(vectors) != len(values):
            raise RuntimeError("Nombre d'embeddings de passages incohérent.")
        return np.asarray(vectors, dtype=np.float32)

    def _rerank(self, query: str, sources: list[dict[str, Any]]) -> list[dict[str, Any]]:
        if len(sources) <= 1:
            return [dict(item) for item in sources]

        texts = [_candidate_text(item) for item in sources]
        qvec = self._embed_query(query)
        dvecs = self._embed_passages(texts)
        similarities = _cosine(qvec, dvecs)

        semantic_order = sorted(range(len(sources)), key=lambda i: float(similarities[i]), reverse=True)
        semantic_rank = {index: rank for rank, index in enumerate(semantic_order, 1)}
        cfg = self.config

        scored: list[dict[str, Any]] = []
        for index, raw in enumerate(sources):
            lexical_rank = index + 1
            sem_rank = semantic_rank[index]
            score = (
                cfg.lexical_weight / (cfg.rrf_k + lexical_rank)
                + cfg.semantic_weight / (cfg.rrf_k + sem_rank)
            )
            item = dict(raw)
            item["lexical_rank"] = lexical_rank
            item["semantic_rank"] = sem_rank
            item["semantic_similarity"] = round(float(similarities[index]), 6)
            item["rrf_score"] = round(float(score), 8)
            scored.append(item)

        if cfg.anchor_lexical_top1:
            anchor = scored[0]
            tail = sorted(
                scored[1:],
                key=lambda item: (
                    float(item.get("rrf_score") or 0.0),
                    float(item.get("semantic_similarity") or 0.0),
                    -int(item.get("lexical_rank") or 9999),
                ),
                reverse=True,
            )
            return [anchor, *tail]

        return sorted(
            scored,
            key=lambda item: (
                float(item.get("rrf_score") or 0.0),
                float(item.get("semantic_similarity") or 0.0),
                -int(item.get("lexical_rank") or 9999),
            ),
            reverse=True,
        )

    def search(
        self,
        query: str,
        *,
        limit: int = 8,
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        parsed_limit = max(1, min(int(limit), 20))
        candidate_limit = max(parsed_limit, min(self.config.candidate_limit, 20))
        base = self.base.search(
            query,
            limit=candidate_limit,
            madhhab=madhhab,
            discipline=discipline,
        )
        candidates = [dict(item) for item in base.get("sources") or []]

        # Crucial safety property: embeddings never rescue a query that V6.1
        # abstained on. Global semantic recall comes later in V6.3-B, after a
        # dedicated ANN benchmark and human qrels exist.
        if not candidates:
            analysis = dict(base.get("analysis") or {})
            analysis.update(
                {
                    "engine": "rag-v6.3a-hybrid-semantic-rerank",
                    "semantic_embeddings": True,
                    "semantic_model": self.model_name,
                    "semantic_stage": "candidate_rerank_only",
                    "fusion": "weighted_rrf",
                    "semantic_candidate_count": 0,
                    "semantic_skipped": "base_abstention_or_no_candidates",
                }
            )
            return {**base, "analysis": analysis}

        reranked = self._rerank(query, candidates)[:parsed_limit]
        for index, item in enumerate(reranked, 1):
            item["citation_id"] = f"S{index}"

        analysis = dict(base.get("analysis") or {})
        analysis.update(
            {
                "engine": "rag-v6.3a-hybrid-semantic-rerank",
                "semantic_embeddings": True,
                "semantic_model": self.model_name,
                "semantic_stage": "candidate_rerank_only",
                "fusion": "weighted_rrf",
                "rrf_k": self.config.rrf_k,
                "rrf_lexical_weight": self.config.lexical_weight,
                "rrf_semantic_weight": self.config.semantic_weight,
                "anchor_lexical_top1": self.config.anchor_lexical_top1,
                "semantic_candidate_count": len(candidates),
            }
        )
        return {
            **base,
            "analysis": analysis,
            "sources": reranked,
            "count": len(reranked),
        }

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
            summary = "Aucun passage suffisamment pertinent n'a été retrouvé pour cette formulation. Le moteur ne fabrique pas de réponse sans preuve."
            verdict = "insufficient"
        elif result.get("analysis", {}).get("routed_book"):
            summary = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans l'ouvrage demandé."
            verdict = "evidence_found"
        else:
            summary = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans le corpus sharded."
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


__all__ = ["DEFAULT_MODEL", "FusionConfig", "HybridSemanticRuntime"]
