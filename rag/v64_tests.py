from __future__ import annotations

"""Deterministic adapter tests that do not require the 574k production index."""

import tempfile
from pathlib import Path
from typing import Any

from v64_production import V64ProductionRuntime


class FakeBase:
    def __init__(self) -> None:
        self.validated = False

    def validate(self) -> None:
        self.validated = True

    def search(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        return {
            "query": query,
            "analysis": {"engine": "fake-v61"},
            "sources": [{"id": "v61-source", "citation_id": "S1", "madhhab": madhhab}],
            "count": 1,
        }

    def ask(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        result = self.search(query, limit=limit, madhhab=madhhab, discipline=discipline)
        result["answer"] = {"mode": "evidence_only", "verdict": "evidence_found"}
        return result

    def status(self) -> dict[str, Any]:
        return {"books": 215, "chunks": 574461}

    def list_books(self):
        return [{"id": "book"}]


class FakePromoted:
    def search(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        return {
            "query": query,
            "analysis": {"engine": "rag-v6.3-c-global-ann-shadow", "ann_shadow_mode": True},
            "sources": [{"id": "fused-source", "citation_id": "S1", "madhhab": madhhab}],
            "count": 1,
            "shadow_ann_sources": [{"id": "debug"}],
            "shadow_ann_only_sources": [{"id": "debug"}],
        }

    def ask(self, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
        result = self.search(query, limit=limit, madhhab=madhhab, discipline=discipline)
        result["answer"] = {"mode": "evidence_only", "verdict": "evidence_found"}
        return result


class InjectedRuntime(V64ProductionRuntime):
    def _ensure_runtime(self):
        if self.configured_engine == "v61":
            return None
        return FakePromoted()


def main() -> int:
    base = FakeBase()
    with tempfile.TemporaryDirectory() as td:
        missing = Path(td) / "missing.json"

        v61 = V64ProductionRuntime(base, configured_engine="v61", ann_manifest=missing)
        result = v61.search("test")
        assert result["sources"][0]["id"] == "v61-source"
        assert result["analysis"]["retrieval_engine_active"] == v61.FALLBACK_ENGINE
        assert result["analysis"]["retrieval_fallback"] is False

        fail_open = V64ProductionRuntime(base, configured_engine="v63c", ann_manifest=missing, fail_open=True)
        result = fail_open.search("test")
        assert result["sources"][0]["id"] == "v61-source"
        assert result["analysis"]["retrieval_fallback"] is True
        assert "missing" in result["analysis"]["retrieval_fallback_reason"].lower() or result["analysis"]["retrieval_fallback_reason"]

        promoted = InjectedRuntime(base, configured_engine="v63c", ann_manifest=missing, debug_ann=False)
        result = promoted.search("test", madhhab="maliki")
        assert result["sources"][0]["id"] == "fused-source"
        assert result["analysis"]["retrieval_engine_active"] == promoted.ENGINE
        assert result["analysis"]["ann_shadow_mode"] is False
        assert result["analysis"]["retrieval_fallback"] is False
        assert "shadow_ann_sources" not in result
        assert "shadow_ann_only_sources" not in result
        assert promoted.list_books() == [{"id": "book"}]

    print("V6.4 production adapter tests: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
