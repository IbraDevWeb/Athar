from __future__ import annotations

"""Run the accepted V6.3-C benchmark methodology against the compact i8 ANN."""

import v63c_benchmark as benchmark
from v652_quantized_ann import QuantizedGlobalAnnIndex

benchmark.GlobalAnnIndex = QuantizedGlobalAnnIndex


if __name__ == "__main__":
    raise SystemExit(benchmark.main())
