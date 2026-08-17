from __future__ import annotations

"""Athar V6.5.3 public server.

The public process keeps the proven V6.5.1 remote-fusion/fail-open behavior,
while the semantic sidecar is V6.5.3 sharded f16. This wrapper updates the
operational engine identity without changing retrieval or fallback semantics.
"""

import v651_library_server as server
from v651_remote_fusion import V651RemoteFusionRuntime

V651RemoteFusionRuntime.ENGINE = "athar-v6.5.3-remote-semantic-fusion"
server.Handler.server_version = "AtharRAG/6.5.3-remote-sharded-semantic"


if __name__ == "__main__":
    raise SystemExit(server.main())
