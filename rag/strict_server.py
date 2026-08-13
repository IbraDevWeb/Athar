from __future__ import annotations

from relevance import install

install()

import server  # noqa: E402


if __name__ == "__main__":
    raise SystemExit(server.main())
