from __future__ import annotations

"""Grounded LLM synthesis for Athar Research.

The synthesis layer runs only *after* RAG retrieval. It receives a bounded set
of indexed Athar passages and must summarize only what those passages support.
It is not an independent religious answer engine and it never retrieves or
accepts arbitrary evidence from the client.
"""

import copy
import hashlib
import json
import os
import threading
import time
from collections import OrderedDict
from typing import Any, Callable

import requests

from v5_query_intelligence import DEFAULT_MODEL, GEMINI_ENDPOINT

MAX_SYNTHESIS_SOURCES = 10
MAX_SOURCE_CHARS = 4_200
MAX_CONTEXT_CHARS = 36_000
MAX_QUERY_CHARS = 1_800
MAX_POSITIONS = 6
MAX_LIST_ITEMS = 6
MAX_CACHE_ITEMS = 96
CACHE_TTL_SECONDS = 7_200

SYNTHESIS_STATUS = "Synthèse IA fondée sur les passages Athar — à vérifier dans les sources"
SYNTHESIS_NOTICE = (
    "Cette synthèse est générée uniquement à partir des passages retrouvés par Athar Research. "
    "Elle peut omettre des avis absents du corpus ou mal représentés par la recherche. "
    "Les textes cités restent la référence."
)

_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "overview": {
            "type": "string",
            "description": "Concise French answer summarizing only what the supplied evidence supports.",
        },
        "position_status": {
            "type": "string",
            "enum": ["multiple", "single", "not_applicable", "insufficient"],
            "description": "Whether the supplied passages establish multiple distinct positions, one position, no position-type question, or insufficient evidence.",
        },
        "positions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "school_or_tradition": {"type": "string"},
                    "summary": {"type": "string"},
                    "source_ids": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                },
                "required": ["title", "school_or_tradition", "summary", "source_ids"],
            },
        },
        "agreements": {"type": "array", "items": {"type": "string"}},
        "differences": {"type": "array", "items": {"type": "string"}},
        "limits": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["overview", "position_status", "positions", "agreements", "differences", "limits"],
}

_CACHE: OrderedDict[str, tuple[float, dict[str, Any]]] = OrderedDict()
_CACHE_LOCK = threading.Lock()


class ScholarSynthesisError(RuntimeError):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = str(code or "synthesis_error")


def _enabled() -> bool:
    raw = str(os.getenv("ATHAR_SYNTHESIS_LLM_ENABLED") or "1").strip().lower()
    return raw not in {"0", "false", "no", "off"}


def _model() -> str:
    return (
        str(os.getenv("ATHAR_SYNTHESIS_LLM_MODEL") or os.getenv("ATHAR_QUERY_LLM_MODEL") or DEFAULT_MODEL).strip()
        or DEFAULT_MODEL
    )


def _api_key(explicit: str | None = None) -> str:
    return str(explicit if explicit is not None else os.getenv("GEMINI_API_KEY") or "").strip()


def _clean(value: Any, limit: int) -> str:
    return " ".join(str(value or "").split()).strip()[:limit].rstrip()


def _dedupe(values: list[str], limit: int = MAX_LIST_ITEMS) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for raw in values:
        item = _clean(raw, 700)
        key = item.casefold()
        if not item or key in seen:
            continue
        seen.add(key)
        result.append(item)
        if len(result) >= limit:
            break
    return result


def _source_key(source: dict[str, Any]) -> str:
    return str(source.get("citation_id") or source.get("id") or "").strip()


def select_synthesis_sources(
    sources: list[dict[str, Any]],
    *,
    routed_book: bool = False,
    limit: int = MAX_SYNTHESIS_SOURCES,
) -> list[dict[str, Any]]:
    """Select a bounded, diversity-aware subset without creating new evidence."""
    clean_sources = [item for item in sources if isinstance(item, dict) and _source_key(item)]
    limit = max(1, min(int(limit or MAX_SYNTHESIS_SOURCES), MAX_SYNTHESIS_SOURCES))
    if routed_book:
        return clean_sources[:limit]

    selected: list[dict[str, Any]] = []
    selected_ids: set[str] = set()

    def take(source: dict[str, Any]) -> None:
        key = _source_key(source)
        if key and key not in selected_ids and len(selected) < limit:
            selected_ids.add(key)
            selected.append(source)

    # First expose distinct explicitly-labelled schools/traditions when the RAG found them.
    seen_madhhabs: set[str] = set()
    for source in clean_sources:
        madhhab = _clean(source.get("madhhab"), 100).casefold()
        if madhhab and madhhab not in seen_madhhabs:
            seen_madhhabs.add(madhhab)
            take(source)

    # Then expose distinct books, which helps avoid one large work monopolising the synthesis.
    seen_books: set[str] = set()
    for source in clean_sources:
        book = _clean(source.get("book_id") or source.get("title"), 220).casefold()
        if book and book not in seen_books:
            seen_books.add(book)
            take(source)

    # Finally preserve the RAG ranking for the remaining capacity.
    for source in clean_sources:
        take(source)
    return selected


def _context_sources(sources: list[dict[str, Any]]) -> tuple[list[dict[str, str]], bool]:
    prepared: list[dict[str, str]] = []
    total_chars = 0
    truncated = False
    for source in sources[:MAX_SYNTHESIS_SOURCES]:
        text_ar = str(source.get("text_ar") or "").strip()
        text_fr = str(source.get("text_fr") or "").strip()
        combined = (text_fr + "\n" + text_ar).strip()
        if not combined:
            continue
        remaining = MAX_CONTEXT_CHARS - total_chars
        if remaining <= 0:
            truncated = True
            break
        budget = min(MAX_SOURCE_CHARS, remaining)
        if len(combined) > budget:
            truncated = True
        excerpt = combined[:budget].rstrip()
        total_chars += len(excerpt)
        prepared.append(
            {
                "citation_id": _source_key(source),
                "title": _clean(source.get("title"), 220),
                "title_ar": _clean(source.get("title_ar"), 220),
                "author": _clean(source.get("author"), 180),
                "discipline": _clean(source.get("discipline"), 100),
                "madhhab": _clean(source.get("madhhab"), 100),
                "chapter": _clean(source.get("chapter"), 320),
                "page": _clean(source.get("page"), 30),
                "translation_status": _clean(source.get("translation_status"), 160),
                "excerpt": excerpt,
            }
        )
    if not prepared:
        raise ValueError("Aucun passage exploitable n’est disponible pour la synthèse.")
    return prepared, truncated


def _prompt(query: str, sources: list[dict[str, str]]) -> str:
    evidence = "\n\n".join(
        (
            f"[{source['citation_id']}]\n"
            f"Book: {source['title']}\nArabic title: {source['title_ar']}\nAuthor: {source['author']}\n"
            f"Discipline: {source['discipline']}\nMadhhab metadata: {source['madhhab']}\n"
            f"Chapter: {source['chapter']}\nPage: {source['page']}\nTranslation status: {source['translation_status']}\n"
            f"PASSAGE:\n{source['excerpt']}"
        )
        for source in sources
    )
    allowed = ", ".join(f"[{source['citation_id']}]" for source in sources)
    return (
        "You are Athar Research's grounded scholarly synthesis layer.\n"
        "You receive a user's question and ONLY passages that were retrieved from Athar's indexed library. "
        "Your task is to summarize the positions or findings present in those passages in French.\n\n"
        "ABSOLUTE EVIDENCE RULES:\n"
        "- Use ONLY the supplied passages. Do not use general knowledge, memory, web knowledge, or unstated doctrine.\n"
        "- Every position MUST cite one or more supplied source IDs. Allowed IDs are: " + allowed + ".\n"
        "- Never invent a source ID. Never cite a source for a claim it does not support.\n"
        "- Do not call something the official position of a madhhab merely because an author/book is associated with that school. "
        "Use school labels only when the supplied text or explicit metadata justifies the attribution; otherwise describe it as a position found in the cited work.\n"
        "- Distinguish disagreement from different wording. Do not manufacture multiple positions when the evidence only supports one.\n"
        "- If the passages are insufficient, contradictory, or too narrow to answer the question safely, say so in overview/limits.\n"
        "- If the user asks a legal/religious question, summarize the retrieved positions; do not issue a new fatwa or choose a winner unless the supplied passages themselves explicitly compare/prefer views.\n"
        "- Arabic passages may be understood directly, but your French synthesis must not pretend to be a published translation.\n"
        "- Keep the answer useful and concrete: explain the practical difference between positions when the passages establish one.\n\n"
        "STRUCTURE:\n"
        "overview = direct answer in 2-5 sentences; position_status = multiple/single/not_applicable/insufficient; "
        "positions = distinct evidence-backed positions; agreements = shared points actually supported; "
        "differences = genuine differences actually supported; limits = corpus/retrieval limitations visible from the evidence.\n\n"
        f"USER QUESTION:\n{query[:MAX_QUERY_CHARS]}\n\n"
        f"RETRIEVED ATHAR EVIDENCE:\n{evidence}"
    )


def _sanitize_response(payload: Any, allowed_ids: set[str]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ScholarSynthesisError("invalid_response", "Gemini a renvoyé une synthèse illisible.")
    overview = _clean(payload.get("overview"), 2_600)
    if not overview:
        raise ScholarSynthesisError("empty_synthesis", "Gemini n’a renvoyé aucune synthèse exploitable.")

    status = str(payload.get("position_status") or "insufficient").strip().lower()
    if status not in {"multiple", "single", "not_applicable", "insufficient"}:
        status = "insufficient"

    positions: list[dict[str, Any]] = []
    for raw in payload.get("positions") or []:
        if not isinstance(raw, dict):
            continue
        source_ids: list[str] = []
        seen: set[str] = set()
        for value in raw.get("source_ids") or []:
            source_id = str(value or "").strip().strip("[]")
            if source_id in allowed_ids and source_id not in seen:
                seen.add(source_id)
                source_ids.append(source_id)
        # An uncited model position is not allowed into the public response.
        if not source_ids:
            continue
        summary = _clean(raw.get("summary"), 1_600)
        if not summary:
            continue
        positions.append(
            {
                "title": _clean(raw.get("title"), 180) or f"Position {len(positions) + 1}",
                "school_or_tradition": _clean(raw.get("school_or_tradition"), 140),
                "summary": summary,
                "source_ids": source_ids[:6],
            }
        )
        if len(positions) >= MAX_POSITIONS:
            break

    if status in {"multiple", "single"} and not positions:
        status = "insufficient"

    return {
        "overview": overview,
        "position_status": status,
        "positions": positions,
        "agreements": _dedupe(list(payload.get("agreements") or [])),
        "differences": _dedupe(list(payload.get("differences") or [])),
        "limits": _dedupe(list(payload.get("limits") or [])),
    }


def _extract_response_json(response_payload: Any, allowed_ids: set[str]) -> dict[str, Any]:
    candidates = response_payload.get("candidates") if isinstance(response_payload, dict) else None
    if not isinstance(candidates, list) or not candidates:
        raise ScholarSynthesisError("invalid_response", "Gemini n’a renvoyé aucun candidat de synthèse.")
    content = candidates[0].get("content") if isinstance(candidates[0], dict) else None
    parts = content.get("parts") if isinstance(content, dict) else None
    if not isinstance(parts, list):
        raise ScholarSynthesisError("invalid_response", "Gemini n’a renvoyé aucun contenu de synthèse.")
    text = "".join(str(part.get("text") or "") for part in parts if isinstance(part, dict)).strip()
    if not text:
        raise ScholarSynthesisError("empty_synthesis", "Gemini n’a renvoyé aucune synthèse.")
    try:
        payload = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ScholarSynthesisError("invalid_json", "Gemini a renvoyé un format de synthèse invalide.") from exc
    return _sanitize_response(payload, allowed_ids)


def _cache_key(query: str, model: str, sources: list[dict[str, str]]) -> str:
    material = {
        "model": model,
        "query": " ".join(str(query or "").casefold().split()),
        "sources": [
            {
                "id": source["citation_id"],
                "title": source["title"],
                "page": source["page"],
                "excerpt_hash": hashlib.sha256(source["excerpt"].encode("utf-8")).hexdigest(),
            }
            for source in sources
        ],
    }
    return hashlib.sha256(json.dumps(material, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


def _cache_get(key: str) -> dict[str, Any] | None:
    now = time.monotonic()
    with _CACHE_LOCK:
        entry = _CACHE.get(key)
        if entry is None:
            return None
        created_at, value = entry
        if now - created_at > CACHE_TTL_SECONDS:
            _CACHE.pop(key, None)
            return None
        _CACHE.move_to_end(key)
        result = copy.deepcopy(value)
        result["cache_hit"] = True
        return result


def _cache_put(key: str, value: dict[str, Any]) -> None:
    with _CACHE_LOCK:
        _CACHE[key] = (time.monotonic(), copy.deepcopy(value))
        _CACHE.move_to_end(key)
        while len(_CACHE) > MAX_CACHE_ITEMS:
            _CACHE.popitem(last=False)


def clear_synthesis_cache() -> None:
    with _CACHE_LOCK:
        _CACHE.clear()


def synthesize_from_sources(
    query: str,
    sources: list[dict[str, Any]],
    *,
    api_key: str | None = None,
    http_post: Callable[..., Any] | None = None,
    use_cache: bool = True,
) -> dict[str, Any]:
    clean_query = _clean(query, MAX_QUERY_CHARS)
    if len(clean_query) < 3:
        raise ValueError("Question requise pour produire une synthèse.")
    prepared, context_truncated = _context_sources(sources)
    allowed_ids = {source["citation_id"] for source in prepared}
    model = _model()
    key = _api_key(api_key)
    if not _enabled() or not key:
        raise ScholarSynthesisError(
            "not_configured",
            "La synthèse assistée par IA n’est pas configurée sur le serveur.",
        )

    cache_key = _cache_key(clean_query, model, prepared)
    if use_cache:
        cached = _cache_get(cache_key)
        if cached is not None:
            return cached

    started = time.monotonic()
    post = http_post or requests.post
    try:
        response = post(
            GEMINI_ENDPOINT.format(model=model),
            headers={"x-goog-api-key": key, "Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": _prompt(clean_query, prepared)}]}],
                "generationConfig": {
                    "maxOutputTokens": 3_200,
                    "thinkingConfig": {"thinkingLevel": "minimal"},
                    "responseMimeType": "application/json",
                    "responseSchema": _RESPONSE_SCHEMA,
                },
            },
            timeout=(3.0, 22.0),
        )
        response.raise_for_status()
        parsed = _extract_response_json(response.json(), allowed_ids)
        result = {
            **parsed,
            "provider": "google-gemini",
            "model": model,
            "status": SYNTHESIS_STATUS,
            "notice": SYNTHESIS_NOTICE,
            "source_ids": [source["citation_id"] for source in prepared],
            "source_count": len(prepared),
            "context_truncated": context_truncated,
            "latency_ms": max(1, round((time.monotonic() - started) * 1000)),
            "cache_hit": False,
        }
        if context_truncated:
            result["limits"] = _dedupe(
                [*result.get("limits", []), "Le contexte transmis au modèle a été borné pour préserver la stabilité du service."]
            )
        if use_cache:
            _cache_put(cache_key, result)
        return result
    except ScholarSynthesisError:
        raise
    except requests.HTTPError as exc:
        status = getattr(getattr(exc, "response", None), "status_code", None)
        if status == 429:
            raise ScholarSynthesisError(
                "quota",
                "Le quota de synthèse IA est temporairement atteint. Les passages RAG restent consultables.",
            ) from exc
        raise ScholarSynthesisError(
            "provider_http",
            "Le service de synthèse IA est temporairement indisponible.",
        ) from exc
    except requests.Timeout as exc:
        raise ScholarSynthesisError(
            "timeout",
            "La synthèse IA a mis trop de temps à répondre. Les passages RAG restent consultables.",
        ) from exc
    except requests.RequestException as exc:
        raise ScholarSynthesisError(
            "network",
            "Impossible de joindre le service de synthèse IA.",
        ) from exc
    except Exception as exc:
        raise ScholarSynthesisError(
            "synthesis_error",
            "La synthèse IA n’a pas pu être produite.",
        ) from exc


__all__ = [
    "MAX_SYNTHESIS_SOURCES",
    "SYNTHESIS_NOTICE",
    "SYNTHESIS_STATUS",
    "ScholarSynthesisError",
    "clear_synthesis_cache",
    "select_synthesis_sources",
    "synthesize_from_sources",
]
