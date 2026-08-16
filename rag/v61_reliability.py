from __future__ import annotations

"""Deterministic reliability patches shared by Athar RAG V5/V6.1.

This module deliberately does not generate answers. It only strengthens
query understanding and exact catalogue routing before the evidence retriever
runs. Keeping these rules isolated makes the V6.1 benchmark reproducible and
prevents one-off benchmark fixes from leaking into citation generation.
"""

import re
from typing import Any

_ARABIC = re.compile(r"[\u0600-\u06FF]")
_PATCH_FLAG = "_athar_v61_reliability_patched"

# Natural formulations that were valid user queries but absent from the
# deterministic ontology in the first V6.1 run.
_TRIGGER_EXTENSIONS: dict[str, tuple[str, ...]] = {
    "fatiha": (
        "fatihat al kitab",
        "fatihat al-kitab",
    ),
    "takbir": (
        "takbirat",
        "takbirat al ihram",
        "takbirat al-ihram",
    ),
    "taslim": (
        "salam qui termine la salat",
        "salam qui termine la priere",
        "salam final de la salat",
    ),
    "riba": (
        "interet usuraire",
        "interets usuraires",
    ),
    "ayat_al_kursi": (
        "verset du trone",
        "verset du trône",
    ),
}

# Exact catalogue aliases must point to one curated corpus book ID. This avoids
# author-only matching when the same author has several indexed works.
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
    if not alias_norm:
        return False
    return f" {alias_norm} " in f" {query_norm} "


def _extend_triggers(engine: Any) -> None:
    """Add reviewed natural-language synonyms to deterministic triggers."""
    for name, additions in _TRIGGER_EXTENSIONS.items():
        spec = engine.CONCEPTS.get(name)
        if not isinstance(spec, dict):
            continue
        current = list(spec.get("triggers") or ())
        seen = {engine.normalize_text(value) for value in current if str(value).strip()}
        for value in additions:
            key = engine.normalize_text(value)
            if not key or key in seen:
                continue
            seen.add(key)
            current.append(value)
        spec["triggers"] = tuple(current)


def _patch_detect_concepts(engine: Any) -> None:
    """Recognise curated Arabic retrieval vocabulary as Arabic query concepts.

    French/transliterated detection remains delegated to the V5 engine. For an
    Arabic query we additionally match Arabic terms already curated inside each
    concept specification. This avoids maintaining a second Arabic ontology and
    keeps retrieval vocabulary and query understanding aligned.
    """
    original = engine.detect_concepts

    def detect_concepts_v61(query: str):
        found = [dict(item) for item in original(query)]
        if not _ARABIC.search(str(query or "")):
            return found

        query_norm = engine.normalize_text(query)
        existing = {str(item.get("name") or "") for item in found}
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
            found.append(
                {
                    "name": name,
                    "terms": list(spec.get("terms") or ()),
                    "specificity": int(spec.get("specificity", 1)),
                    "matched_triggers": matched,
                    "source": "arabic_curated_vocabulary",
                }
            )
            existing.add(name)
        found.sort(
            key=lambda item: (
                int(item.get("specificity") or 1),
                len(str((item.get("matched_triggers") or [""])[0])),
            ),
            reverse=True,
        )
        return found

    engine.detect_concepts = detect_concepts_v61


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
    """Apply V6.1 deterministic patches once to the imported engine module."""
    if bool(getattr(engine, _PATCH_FLAG, False)):
        return
    _extend_triggers(engine)
    _patch_detect_concepts(engine)
    _patch_detect_book(engine)
    setattr(engine, _PATCH_FLAG, True)


__all__ = ["apply_engine_reliability_patches"]
