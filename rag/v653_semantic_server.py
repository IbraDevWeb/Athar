from __future__ import annotations

"""Athar V6.5.3 semantic sidecar using sequential sharded f16 HNSW views."""

import v65_semantic_server as server
from v653_sharded_ann import ShardedF16AnnIndex

server.ViewedGlobalAnnIndex = ShardedF16AnnIndex
server.SemanticRuntime.ENGINE = "athar-v6.5.3-semantic-sidecar-sharded-f16"
server.Handler.server_version = "AtharSemantic/6.5.3-sharded-f16"


if __name__ == "__main__":
    raise SystemExit(server.main())
