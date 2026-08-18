from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / "rag" / "v654_library_server.py"
SYNTHESIS_SERVER = ROOT / "rag" / "v5_library_server.py"
RENDER = ROOT / "render.yaml"


class BaseHandler:
    pass


class FusionRuntime:
    ENGINE = "before"


fake_server = types.ModuleType("v651_library_server")
fake_server.Handler = BaseHandler
fake_server.main = lambda: 0
fake_fusion = types.ModuleType("v651_remote_fusion")
fake_fusion.V651RemoteFusionRuntime = FusionRuntime
sys.modules["v651_library_server"] = fake_server
sys.modules["v651_remote_fusion"] = fake_fusion

spec = importlib.util.spec_from_file_location("v654_contract_target", MODULE)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

Handler = module.Handler
assert module.MAX_EVIDENCE_RESULTS == 20
assert module.LEGACY_RESEARCH_LIMITS == {8, 12}
assert Handler._limit(8) == 20
assert Handler._limit(12) == 20
assert Handler._limit(None, 8) == 20
assert Handler._limit(None, 12) == 20
assert Handler._limit(1) == 1
assert Handler._limit(7) == 7
assert Handler._limit(13) == 13
assert Handler._limit(20) == 20
assert Handler._limit(21) == 20
assert Handler._limit(200) == 20
assert Handler._limit("bad", 8) == 20
assert fake_server.Handler is Handler
assert FusionRuntime.ENGINE == "athar-v6.5.4-expanded-evidence-fusion"

synthesis_source = SYNTHESIS_SERVER.read_text(encoding="utf-8")
assert "select_synthesis_sources(sources, routed_book=routed, limit=10)" in synthesis_source

render_source = RENDER.read_text(encoding="utf-8")
assert "startCommand: python rag/v654_library_server.py" in render_source
assert "value: v6.5.4-expanded-evidence" in render_source

print("RAG V6.5.4 contract: PASS — legacy 8/12 depths expand to 20; synthesis remains capped at 10 selected sources.")
