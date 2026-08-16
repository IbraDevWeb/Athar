from __future__ import annotations

import v63c_benchmark as benchmark
from v653_sharded_ann import ShardedF16AnnIndex

benchmark.GlobalAnnIndex = ShardedF16AnnIndex


if __name__ == "__main__":
    raise SystemExit(benchmark.main())
