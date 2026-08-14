"""Compatibility entry point for Render.

Render may retain an older manual Start Command that invokes rag/v4_server.py.
The public API paths remain V4-compatible, but all retrieval is now handled by
v5_server / v5_engine so the deployed process cannot silently fall back to the
obsolete lexical V4 engine.
"""

from v5_server import main


if __name__ == "__main__":
    raise SystemExit(main())
