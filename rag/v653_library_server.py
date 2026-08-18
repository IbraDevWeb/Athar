from __future__ import annotations

"""Stable production launcher for the Athar V6.5 server family.

Render and older validation contracts historically invoke this filename.
The active implementation is V6.5.4; importing it installs the V6.5.4 Handler
and engine identity before the shared server main loop starts.
"""

from v654_library_server import Handler, server

__all__ = ["Handler", "server"]


if __name__ == "__main__":
    raise SystemExit(server.main())
