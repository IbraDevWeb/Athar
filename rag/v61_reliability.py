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
    """Add reviewed synonyms and Arabic source vocabulary as query triggers."""
    for name, spec in engine.CONCEPTS.items():
        current = list(spec.get("triggers") or ())
        seen = {engine.normalize_text(value) for value in current if str(value).strip()}

        additions = list(_TRIGGER_EXTENSIONS.get(name, ()))
        # The corpus is overwhelmingly Arabic. Arabic terms already curated as
        # retrieval vocabulary are safe deterministic triggers for Arabic queries.
        additions.extend(
            str(term)
            for term in (spec.get("terms") or ())
            if _ARABIC.search(str(term))
        )
        for value in additions:
            key = engine.normalize_text(value)
            if not key or key in seen:
                continue
            seen.add(key)
            current.append(value)
        spec["triggers"] = tuple(current)


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
    _patch_detect_book(engine)
    setattr(engine, _PATCH_FLAG, True)


__all__ = ["apply_engine_reliability_patches"]
