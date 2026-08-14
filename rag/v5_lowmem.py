from __future__ import annotations

"""Memory guard for the hosted Athar RAG V5 engine.

The public Render service has a 512 MiB RAM ceiling. The core V5 engine was
written to evaluate a comparatively large candidate set, which is useful in CI
but unnecessarily expensive for a single-user hosted service. This module
keeps the exact same ranking logic while bounding the number of full passages
materialised for one query.
"""

import v5_engine as _engine

MAX_FULL_CANDIDATES = 72
_original_fetch_fts_candidates = _engine._fetch_fts_candidates


def _bounded_fetch_fts_candidates(connection, fts_query: str, book_id: str, candidate_limit: int):
    bounded = max(1, min(int(candidate_limit), MAX_FULL_CANDIDATES))
    return _original_fetch_fts_candidates(connection, fts_query, book_id, bounded)


_engine._fetch_fts_candidates = _bounded_fetch_fts_candidates

ask = _engine.ask
corpus_status = _engine.corpus_status
list_books = _engine.list_books
normalize_text = _engine.normalize_text
search = _engine.search

__all__ = [
    "MAX_FULL_CANDIDATES",
    "ask",
    "corpus_status",
    "list_books",
    "normalize_text",
    "search",
]
