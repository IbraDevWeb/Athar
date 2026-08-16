from __future__ import annotations

"""Athar V6.5.1 safe remote semantic fusion.

This thin production wrapper keeps the accepted V6.5 remote RRF behaviour when
the semantic sidecar is available, while enforcing the caller's requested
result limit when the sidecar is unavailable and V6.1 fail-open is used.
"""

import os
from typing import Any

from v5_sharded import ShardedCorpusRuntime
from v65_remote_fusion import (
    RemoteFusionConfig,
    RemoteSemanticClient,
    V65RemoteFusionRuntime as _V65RemoteFusionRuntime,
)


class V651RemoteFusionRuntime(_V65RemoteFusionRuntime):
    ENGINE = "rag-v6.5.1-remote-semantic-fused"

    @staticmethod
    def _enforce_limit(result: dict[str, Any], limit: int) -> dict[str, Any]:
        result = dict(result)
        sources = [dict(item) for item in (result.get("sources") or [])][:limit]
        for rank, source in enumerate(sources, 1):
            source["citation_id"] = f"S{rank}"
        result["sources"] = sources
        result["count"] = len(sources)
        return result

    def search(
        self,
        query: str,
        *,
        limit: int = 8,
        madhhab: str = "",
        discipline: str = "",
    ) -> dict[str, Any]:
        requested_limit = max(1, min(int(limit), 20))
        result = super().search(
            query,
            limit=requested_limit,
            madhhab=madhhab,
            discipline=discipline,
        )
        analysis = dict(result.get("analysis") or {})
        if analysis.get("semantic_remote_fallback") is True:
            result = self._enforce_limit(result, requested_limit)
            analysis = dict(result.get("analysis") or {})
            analysis["fail_open_limit_enforced"] = True
            result["analysis"] = analysis
        return result


def build_remote_runtime(base: ShardedCorpusRuntime) -> V651RemoteFusionRuntime:
    url = str(os.getenv("ATHAR_SEMANTIC_URL") or "").strip()
    if not url:
        raise RuntimeError("ATHAR_SEMANTIC_URL est requis pour V6.5.1.")
    client = RemoteSemanticClient(
        url,
        token=str(os.getenv("ATHAR_SEMANTIC_TOKEN") or ""),
        connect_timeout=float(os.getenv("ATHAR_SEMANTIC_CONNECT_TIMEOUT") or "2.0"),
        read_timeout=float(os.getenv("ATHAR_SEMANTIC_READ_TIMEOUT") or "8.0"),
    )
    return V651RemoteFusionRuntime(
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


# Compatibility name used by the existing V6.5 benchmark harness.
V65RemoteFusionRuntime = V651RemoteFusionRuntime


__all__ = [
    "RemoteFusionConfig",
    "RemoteSemanticClient",
    "V651RemoteFusionRuntime",
    "V65RemoteFusionRuntime",
    "build_remote_runtime",
]
