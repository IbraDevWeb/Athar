from __future__ import annotations

"""Memory guard and query-intelligence bridge for Athar RAG V5.

The public Render service has a 512 MiB RAM ceiling. The core V5 engine was
written to evaluate a comparatively large candidate set, which is useful in CI
but unnecessarily expensive for a single-user hosted service. This module
keeps the same ranking logic while bounding full passages and, when configured,
adds LLM-derived search concepts without allowing the model to generate the
answer or citations.
"""

import re
import threading
import unicodedata
from typing import Any

import v5_engine as _engine
from v61_reliability import (
    apply_engine_reliability_patches,
    enrich_deterministic_concepts,
)
from v5_query_intelligence import (
    analyze_query,
    deterministic_query_intelligence,
    public_metadata,
)

# Apply stable synonym and exact-book patches before capturing deterministic
# helpers. Arabic enrichment itself is called explicitly below, so behaviour no
# longer depends on Python module import order.
apply_engine_reliability_patches(_engine)

MAX_FULL_CANDIDATES = 72
_original_fetch_fts_candidates = _engine._fetch_fts_candidates
_original_detect_concepts = _engine.detect_concepts
_original_search = _engine.search
_QUERY_CONTEXT = threading.local()
_ROUTE_KEY_NON_ALNUM = re.compile(r"[^a-z0-9]+")

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


def _deterministic_concepts(query: str) -> list[dict[str, Any]]:
    found = [dict(item) for item in _original_detect_concepts(query)]
    return enrich_deterministic_concepts(_engine, query, found)


def _route_key(value: Any) -> str:
    """Collapse scholarly Latin transliteration to an ASCII comparison key.

    This intentionally removes modifier letters such as ʾ/ʿ so a user-facing
    alias like ``Muwatta`` matches a catalogue title such as ``Al-Muwaṭṭaʾ``.
    It is used only to decide whether a residual query token is already explained
    by the routed book; it never changes retrieval text or citations.
    """
    text = unicodedata.normalize("NFKD", str(value or ""))
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = (
        text.casefold()
        .replace("ʾ", "")
        .replace("ʿ", "")
        .replace("’", "")
        .replace("'", "")
        .replace("`", "")
    )
    return _ROUTE_KEY_NON_ALNUM.sub("", text)


def _routed_book_noise(routed_book: dict[str, Any] | None) -> set[str]:
    """Return transliteration-tolerant keys already explained by book routing."""
    if not routed_book:
        return set()
    result: set[str] = set()
    for field in ("title", "author"):
        value = str(routed_book.get(field) or "")
        for token in re.split(r"\s+", value):
            key = _route_key(token)
            if len(key) < 3:
                continue
            result.add(key)
            if key.startswith("al") and len(key) >= 6:
                result.add(key[2:])
    return result


def _query_intelligence_needed(connection, query: str) -> tuple[bool, str]:
    """Spend an LLM request only when deterministic parsing leaves real meaning unresolved."""
    deterministic = _deterministic_concepts(query)
    routed_book = _engine.detect_book(connection, query)
    raw_terms = _engine._meaningful_terms(query, routed_book, deterministic)
    route_noise = _routed_book_noise(routed_book)
    unresolved: list[str] = []
    for term in raw_terms:
        if _engine.normalize_text(term) in _ROUTING_NOISE:
            continue
        route_key = _route_key(term)
        if route_key and route_key in route_noise:
            continue
        unresolved.append(term)

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
    found = _deterministic_concepts(query)
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
        analysis["technical_concepts"] = list(analysis.get("concepts") or [])
        analysis["concepts"] = list(analysis["notions"])
    return result


def _search_once(
    connection,
    query: str,
    *,
    hints: dict[str, Any],
    limit: int,
    madhhab: str,
    discipline: str,
) -> dict[str, Any]:
    """Run the core retriever with one isolated per-thread hint packet."""
    previous = getattr(_QUERY_CONTEXT, "hints", None)
    _QUERY_CONTEXT.hints = hints
    try:
        return _original_search(
            connection,
            query,
            limit=limit,
            madhhab=madhhab,
            discipline=discipline,
        )
    finally:
        if previous is None:
            try:
                delattr(_QUERY_CONTEXT, "hints")
            except AttributeError:
                pass
        else:
            _QUERY_CONTEXT.hints = previous


def search(connection, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = ""):
    hints = _query_hints(connection, query)
    result = _search_once(
        connection,
        query,
        hints=hints,
        limit=limit,
        madhhab=madhhab,
        discipline=discipline,
    )

    if hints.get("used") and not (result.get("sources") or []):
        rescue = _search_once(
            connection,
            query,
            hints={},
            limit=limit,
            madhhab=madhhab,
            discipline=discipline,
        )
        if rescue.get("sources"):
            result = rescue
            analysis = result.get("analysis")
            if isinstance(analysis, dict):
                analysis["retrieval_rescue"] = "deterministic"

    return _attach_intelligence(result, hints)


_engine._fetch_fts_candidates = _bounded_fetch_fts_candidates
_engine.detect_concepts = _augmented_detect_concepts
_engine.search = search
search = _engine.search

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
