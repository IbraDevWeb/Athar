from __future__ import annotations

"""Athar V6.5.4 public server: expose the full 20-result V6 fusion window.

V6.5.3 already retrieves a broad candidate pool (lexical + remote semantic) and
its fusion runtime can rank up to 20 final passages. Older HTTP defaults still
clamped legacy clients to 8 or 12 results. V6.5.4 keeps the proven retrieval,
RRF ranking, abstention and fail-open behaviour unchanged, while mapping those
legacy Research depths to the full 20-result evidence window.

Grounded synthesis remains independently selective in v5_library_server.py:
it receives the expanded evidence set but chooses at most 10 passages for the
LLM synthesis context. All returned evidence remains available to the reader.
"""

from typing import Any

import v651_library_server as server
from v651_remote_fusion import V651RemoteFusionRuntime


LEGACY_RESEARCH_LIMITS = {8, 12}
MAX_EVIDENCE_RESULTS = 20


class Handler(server.Handler):
    server_version = "AtharRAG/6.5.4-expanded-evidence"

    @staticmethod
    def _limit(value: Any, default: int = 8) -> int:
        raw = default if value in (None, "") else value
        try:
            requested = int(raw)
        except (TypeError, ValueError):
            requested = int(default)
        requested = max(1, min(requested, MAX_EVIDENCE_RESULTS))
        # Existing Athar Research clients send 8 (evidence mode) or 12
        # (synthesis mode). Preserve client compatibility while exposing the
        # complete ranking window supported by the V6 fusion runtime.
        if requested in LEGACY_RESEARCH_LIMITS:
            return MAX_EVIDENCE_RESULTS
        return requested


V651RemoteFusionRuntime.ENGINE = "athar-v6.5.4-expanded-evidence-fusion"
server.Handler = Handler


if __name__ == "__main__":
    raise SystemExit(server.main())
