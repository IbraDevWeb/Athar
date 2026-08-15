from __future__ import annotations

"""Memory guard and query-intelligence bridge for Athar RAG V5.

The public Render service has a 512 MiB RAM ceiling. The core V5 engine was
written to evaluate a comparatively large candidate set, which is useful in CI
but unnecessarily expensive for a single-user hosted service. This module
keeps the same ranking logic while bounding full passages and, when configured,
adds LLM-derived search concepts without allowing the model to generate the
answer or citations.
"""

import threading
from typing import Any

import v5_engine as _engine
from v5_query_intelligence import (
    analyze_query,
    deterministic_query_intelligence,
    public_metadata,
)

MAX_FULL_CANDIDATES = 72
_original_fetch_fts_candidates = _engine._fetch_fts_candidates
_original_detect_concepts = _engine.detect_concepts
_original_search = _engine.search
_QUERY_CONTEXT = threading.local()

# Safety net for the exact class of failure reported in production. This
# deterministic concept remains available even when Gemini is absent, down or
# rate-limited. The LLM is meant to generalise this behaviour to the long tail.
_engine.CONCEPTS.setdefault(
    "eclipse_prayer",
    {
        "triggers": (
            "eclipse",
            "eclipse solaire",
            "eclipse lunaire",
            "priere de l eclipse",
            "priere d eclipse",
            "salat al kusuf",
            "salat al khusuf",
            "kusuf",
            "khusuf",
        ),
        "terms": (
            "éclipse",
            "eclipse",
            "prière de l'éclipse",
            "صلاة الكسوف",
            "الكسوف",
            "كسوف",
            "كسوف الشمس",
            "صلاة الخسوف",
            "الخسوف",
            "خسوف",
            "خسوف القمر",
            "kusuf",
            "khusuf",
        ),
        "specificity": 5,
    },
)

_DISPLAY_LABELS = {
    "eclipse_prayer": "prière de l’éclipse",
    "prayer": "prière",
    "recitation_aloud": "récitation à voix haute",
    "recitation_silent": "récitation à voix basse",
    "combine_prayers": "regroupement des prières",
    "shorten_prayer": "raccourcissement de la prière",
}

# Tokens that can survive the deterministic trigger stripping even though the
# underlying notion is already unambiguous. They must not waste free-tier LLM
# quota. A genuinely new modifier (e.g. "vernis", "doute", "rakaat") still
# routes to Gemini.
_ROUTING_NOISE = {
    "recite",
    "recitent",
    "reciter",
    "recitation",
    "mentionne",
    "mentionnent",
    "parle",
    "parlent",
}


def _bounded_fetch_fts_candidates(connection, fts_query: str, book_id: str, candidate_limit: int):
    bounded = max(1, min(int(candidate_limit), MAX_FULL_CANDIDATES))
    return _original_fetch_fts_candidates(connection, fts_query, book_id, bounded)


def _current_hints() -> dict[str, Any]:
    value = getattr(_QUERY_CONTEXT, "hints", None)
    return value if isinstance(value, dict) else {}


def _query_intelligence_needed(connection, query: str) -> tuple[bool, str]:
    """Spend an LLM request only when deterministic parsing leaves real meaning unresolved."""
    deterministic = [dict(item) for item in _original_detect_concepts(query)]
    routed_book = _engine.detect_book(connection, query)
    raw_terms = _engine._meaningful_terms(query, routed_book, deterministic)
    unresolved = [term for term in raw_terms if _engine.normalize_text(term) not in _ROUTING_NOISE]

    if not deterministic:
        return True, "no_deterministic_concept"
    if unresolved:
        return True, "unresolved_modifiers"
    return False, "deterministic_sufficient"


def _query_hints(connection, query: str) -> dict[str, Any]:
    needed, reason = _query_intelligence_needed(connection, query)
    if not needed:
        return deterministic_query_intelligence(reason)
    return analyze_query(query)


def _augmented_detect_concepts(query: str) -> list[dict[str, Any]]:
    found = [dict(item) for item in _original_detect_concepts(query)]
    hints = _current_hints()
    existing_names = {str(item.get("name") or "").casefold() for item in found}
    for raw in hints.get("concepts") or []:
        if not isinstance(raw, dict):
            continue
        label = " ".join(str(raw.get("label") or "").split()).strip()[:90]
        if not label or label.casefold() in existing_names:
            continue
        terms: list[str] = []
        seen: set[str] = set()
        for value in raw.get("terms") or []:
            term = " ".join(str(value or "").split()).strip()[:90]
            key = term.casefold()
            if term and key not in seen:
                seen.add(key)
                terms.append(term)
            if len(terms) >= 12:
                break
        if label.casefold() not in seen:
            terms.insert(0, label)
        if not terms:
            continue
        importance = str(raw.get("importance") or "context").strip().lower()
        found.append(
            {
                "name": label,
                "terms": terms[:12],
                "specificity": 5 if importance == "primary" else 3,
                "matched_triggers": [label],
                "source": "llm_query_understanding",
            }
        )
        existing_names.add(label.casefold())
    found.sort(
        key=lambda item: (
            int(item.get("specificity") or 1),
            len(str((item.get("matched_triggers") or [""])[0])),
        ),
        reverse=True,
    )
    return found


def _analysis_notions(analysis: dict[str, Any], hints: dict[str, Any]) -> list[str]:
    if hints.get("used") and hints.get("notions"):
        return [str(item) for item in hints["notions"] if str(item).strip()][:3]
    values: list[str] = []
    for name in analysis.get("concepts") or []:
        label = _DISPLAY_LABELS.get(str(name), str(name).replace("_", " "))
        if label and label not in values:
            values.append(label)
    return values[:4]


def _attach_intelligence(result: dict[str, Any], hints: dict[str, Any]) -> dict[str, Any]:
    analysis = result.get("analysis")
    if not isinstance(analysis, dict):
        analysis = {}
        result["analysis"] = analysis
    analysis["query_intelligence"] = public_metadata(hints)
    analysis["notions"] = _analysis_notions(analysis, hints)
    if hints.get("used") and analysis["notions"]:
        # Keep technical concepts separately for debugging/backwards compatibility,
        # but expose human notions in the UI-facing `concepts` field.
        analysis["technical_concepts"] = list(analysis.get("concepts") or [])
        analysis["concepts"] = list(analysis["notions"])
    return result


def search(connection, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = ""):
    hints = _query_hints(connection, query)
    previous = getattr(_QUERY_CONTEXT, "hints", None)
    _QUERY_CONTEXT.hints = hints
    try:
        result = _original_search(
            connection,
            query,
            limit=limit,
            madhhab=madhhab,
            discipline=discipline,
        )
        return _attach_intelligence(result, hints)
    finally:
        if previous is None:
            try:
                delattr(_QUERY_CONTEXT, "hints")
            except AttributeError:
                pass
        else:
            _QUERY_CONTEXT.hints = previous


# search() resolves these helpers through v5_engine module globals. Patching them
# here preserves V5 retrieval/ranking semantics, adds bounded RAM use and lets a
# per-thread semantic concept packet participate in the existing deterministic
# FTS/reranking pipeline.
_engine._fetch_fts_candidates = _bounded_fetch_fts_candidates
_engine.detect_concepts = _augmented_detect_concepts
_engine.search = search
search = _engine.search

# v5_engine.ask resolves `search` dynamically, so after the patch above it uses
# the same LLM-assisted retrieval while still building evidence-only claims.
ask = _engine.ask
corpus_status = _engine.corpus_status
list_books = _engine.list_books
normalize_text = _engine.normalize_text

__all__ = [
    "MAX_FULL_CANDIDATES",
    "ask",
    "corpus_status",
    "list_books",
    "normalize_text",
    "search",
]
