from __future__ import annotations

"""Deterministic reliability helpers shared by Athar RAG V5/V6.1.

This module never generates answers or citations. It strengthens deterministic
query understanding and exact catalogue routing before evidence retrieval.
"""

import re
from typing import Any

_ARABIC = re.compile(r"[\u0600-\u06FF]")
_PATCH_FLAG = "_athar_v61_reliability_patched"

_TRIGGER_EXTENSIONS: dict[str, tuple[str, ...]] = {
    "fatiha": ("fatihat al kitab", "fatihat al-kitab"),
    "takbir": ("takbirat", "takbirat al ihram", "takbirat al-ihram"),
    "taslim": (
        "salam qui termine la salat",
        "salam qui termine la priere",
        "salam final de la salat",
    ),
    "riba": ("interet usuraire", "interets usuraires"),
    "ayat_al_kursi": ("verset du trone", "verset du trône"),
}

_CANONICAL_BOOK_ALIASES: tuple[tuple[tuple[str, ...], str], ...] = (
    (
        (
            "sunan nasai",
            "sunan al nasai",
            "sunan an nasai",
            "sunan al-nasai",
            "sunan an-nasai",
            "sunan nasa'i",
            "sunan al nasa'i",
        ),
        "openiti-sunan-nasai",
    ),
)


def _contains_alias(engine: Any, query_norm: str, alias: str) -> bool:
    alias_norm = engine.normalize_text(alias)
    return bool(alias_norm and f" {alias_norm} " in f" {query_norm} ")


def _extend_triggers(engine: Any) -> None:
    for name, additions in _TRIGGER_EXTENSIONS.items():
        spec = engine.CONCEPTS.get(name)
        if not isinstance(spec, dict):
            continue
        current = list(spec.get("triggers") or ())
        seen = {engine.normalize_text(value) for value in current if str(value).strip()}
        for value in additions:
            key = engine.normalize_text(value)
            if key and key not in seen:
                seen.add(key)
                current.append(value)
        spec["triggers"] = tuple(current)


def enrich_deterministic_concepts(
    engine: Any,
    query: str,
    found: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Add concepts found through curated Arabic retrieval vocabulary.

    This is deliberately a pure enrichment step instead of a monkey-patch. It is
    called by v5_lowmem after the original V5 detector, which makes behaviour
    independent of module import order.
    """
    result = [dict(item) for item in found]
    if not _ARABIC.search(str(query or "")):
        return result

    query_norm = engine.normalize_text(query)
    existing = {str(item.get("name") or "") for item in result}
    for name, spec in engine.CONCEPTS.items():
        if name in existing:
            continue
        matched = [
            str(term)
            for term in (spec.get("terms") or ())
            if _ARABIC.search(str(term))
            and engine._contains_phrase(query_norm, str(term))
        ]
        if not matched:
            continue
        result.append(
            {
                "name": name,
                "terms": list(spec.get("terms") or ()),
                "specificity": int(spec.get("specificity", 1)),
                "matched_triggers": matched,
                "source": "arabic_curated_vocabulary",
            }
        )
        existing.add(name)

    result.sort(
        key=lambda item: (
            int(item.get("specificity") or 1),
            len(str((item.get("matched_triggers") or [""])[0])),
        ),
        reverse=True,
    )
    return result


def _patch_detect_book(engine: Any) -> None:
    original = engine.detect_book

    def detect_book_v61(connection, query: str):
        query_norm = engine.normalize_text(query)
        for aliases, book_id in _CANONICAL_BOOK_ALIASES:
            if not any(_contains_alias(engine, query_norm, alias) for alias in aliases):
                continue
            row = connection.execute(
                "SELECT id, title, title_ar, author, discipline, madhhab, pages, source_url "
                "FROM books WHERE id=?",
                (book_id,),
            ).fetchone()
            if row is not None:
                return {
                    **dict(row),
                    "route_score": 100,
                    "route_reason": "canonical_alias_v61",
                }
        return original(connection, query)

    engine.detect_book = detect_book_v61


def apply_engine_reliability_patches(engine: Any) -> None:
    """Apply stable deterministic trigger and catalogue patches once."""
    if bool(getattr(engine, _PATCH_FLAG, False)):
        return
    _extend_triggers(engine)
    _patch_detect_book(engine)
    setattr(engine, _PATCH_FLAG, True)


__all__ = ["apply_engine_reliability_patches", "enrich_deterministic_concepts"]
