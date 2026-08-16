from __future__ import annotations

"""Run the existing V6.5 equivalence harness against the V6.5.1 safe runtime."""

import v65_remote_smoke as smoke
from v651_remote_fusion import V65RemoteFusionRuntime


# The benchmark harness references this module global when instantiating the
# remote runtime. Replacing it preserves the exact 200-case methodology while
# testing the corrected fail-open contract.
smoke.V65RemoteFusionRuntime = V65RemoteFusionRuntime


if __name__ == "__main__":
    raise SystemExit(smoke.main())
