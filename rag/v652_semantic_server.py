from __future__ import annotations

"""Athar V6.5.2 semantic sidecar using the compact cosine-i8 ANN."""

import v65_semantic_server as server
from v652_quantized_ann import QuantizedGlobalAnnIndex

# SemanticRuntime resolves this module global at initialization time, so the
# HTTP/auth/filtering implementation stays identical to V6.5 while only the
# ANN storage backend changes.
server.ViewedGlobalAnnIndex = QuantizedGlobalAnnIndex
server.SemanticRuntime.ENGINE = "athar-v6.5.2-semantic-sidecar-i8"
server.Handler.server_version = "AtharSemantic/6.5.2-i8"


if __name__ == "__main__":
    raise SystemExit(server.main())
