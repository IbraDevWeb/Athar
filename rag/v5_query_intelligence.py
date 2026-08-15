from __future__ import annotations

"""LLM-assisted query understanding for Athar Research.

The model is deliberately kept outside the evidentiary answer path: it only
extracts scholarly notions and search vocabulary from the user's question.
Retrieved passages and citations still come exclusively from the indexed Athar
corpus.
"""

import copy
import json
import os
import threading
import time
from collections import OrderedDict
from typing import Any, Callable

import requests

DEFAULT_MODEL = "gemini-3.5-flash"
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
MAX_CACHE_ITEMS = 128
MAX_QUERY_CHARS = 1800
MAX_CONCEPTS = 3
MAX_TERMS_PER_CONCEPT = 12
MAX_TERM_CHARS = 90

_CACHE: OrderedDict[str, dict[str, Any]] = OrderedDict()
_CACHE_LOCK = threading.Lock()

_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "notions": {
            "type": "array",
            "items": {"type": "string"},
            "description": "One to three concise human-readable notions that are essential to the user's question.",
        },
        "concepts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "label": {
                        "type": "string",
                        "description": "Concise notion label in the user's language.",
                    },
                    "importance": {
                        "type": "string",
                        "enum": ["primary", "context"],
                        "description": "primary for the subject that must be present in retrieved evidence; context otherwise.",
                    },
                    "terms": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Precise search expressions: user-language variants, classical Arabic terms, common inflections and transliterations.",
                    },
                },
                "required": ["label", "importance", "terms"],
            },
        },
    },
    "required": ["notions", "concepts"],
}


def _enabled() -> bool:
    raw = str(os.getenv("ATHAR_QUERY_LLM_ENABLED") or "1").strip().lower()
    return raw not in {"0", "false", "no", "off"}


def _model() -> str:
    return str(os.getenv("ATHAR_QUERY_LLM_MODEL") or DEFAULT_MODEL).strip() or DEFAULT_MODEL


def _api_key(explicit: str | None = None) -> str:
    return str(explicit if explicit is not None else os.getenv("GEMINI_API_KEY") or "").strip()


def _clean_text(value: Any, *, limit: int = MAX_TERM_CHARS) -> str:
    text = " ".join(str(value or "").split()).strip()
    return text[:limit].rstrip()


def _dedupe(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        key = value.casefold()
        if not value or key in seen:
            continue
        seen.add(key)
        result.append(value)
    return result


def _sanitize_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("Gemini query analysis is not a JSON object.")

    notions = _dedupe(
        [_clean_text(item) for item in (payload.get("notions") or []) if _clean_text(item)]
    )[:MAX_CONCEPTS]
    concepts: list[dict[str, Any]] = []
    for raw in payload.get("concepts") or []:
        if not isinstance(raw, dict):
            continue
        label = _clean_text(raw.get("label"))
        if not label:
            continue
        importance = str(raw.get("importance") or "context").strip().lower()
        if importance not in {"primary", "context"}:
            importance = "context"
        terms = _dedupe(
            [_clean_text(item) for item in (raw.get("terms") or []) if _clean_text(item)]
        )[:MAX_TERMS_PER_CONCEPT]
        if label not in terms:
            terms.insert(0, label)
        terms = terms[:MAX_TERMS_PER_CONCEPT]
        if not terms:
            continue
        concepts.append({"label": label, "importance": importance, "terms": terms})
        if len(concepts) >= MAX_CONCEPTS:
            break

    if not notions:
        notions = [item["label"] for item in concepts][:MAX_CONCEPTS]
    return {"notions": notions, "concepts": concepts}


def _extract_response_json(response_payload: Any) -> dict[str, Any]:
    candidates = response_payload.get("candidates") if isinstance(response_payload, dict) else None
    if not isinstance(candidates, list) or not candidates:
        raise ValueError("Gemini returned no candidate.")
    content = candidates[0].get("content") if isinstance(candidates[0], dict) else None
    parts = content.get("parts") if isinstance(content, dict) else None
    if not isinstance(parts, list):
        raise ValueError("Gemini returned no content parts.")
    text = "".join(str(part.get("text") or "") for part in parts if isinstance(part, dict)).strip()
    if not text:
        raise ValueError("Gemini returned an empty analysis.")
    return _sanitize_payload(json.loads(text))


def _prompt(query: str) -> str:
    return (
        "You are the query-understanding component of Athar Research, a scholarly search engine for classical Islamic texts.\n"
        "Your task is ONLY to understand the user's search intent. Never answer the religious question, never state a ruling, "
        "never invent a quotation, source, author, book, madhhab or attribution.\n"
        "Extract the indispensable scholarly notions and produce vocabulary useful for retrieving the same notion in classical Arabic texts. "
        "Prefer technical Arabic expressions over generic words. Preserve distinctions such as صلاة الكسوف / الخسوف, قصر, جمع, جهر, etc. "
        "A generic context like 'prayer' must not replace a more precise subject.\n"
        "Return at most 3 concepts. Mark the exact subject of the question as primary and surrounding context as context. "
        "For each concept include concise French/English variants when useful, Arabic forms used in classical sources, and common transliterations.\n\n"
        f"USER QUERY:\n{query[:MAX_QUERY_CHARS]}"
    )


def _cache_key(query: str, model: str) -> str:
    return f"{model}\n{' '.join(str(query or '').casefold().split())}"


def _cache_get(key: str) -> dict[str, Any] | None:
    with _CACHE_LOCK:
        value = _CACHE.get(key)
        if value is None:
            return None
        _CACHE.move_to_end(key)
        return copy.deepcopy(value)


def _cache_put(key: str, value: dict[str, Any]) -> None:
    with _CACHE_LOCK:
        _CACHE[key] = copy.deepcopy(value)
        _CACHE.move_to_end(key)
        while len(_CACHE) > MAX_CACHE_ITEMS:
            _CACHE.popitem(last=False)


def clear_query_intelligence_cache() -> None:
    with _CACHE_LOCK:
        _CACHE.clear()


def analyze_query(
    query: str,
    *,
    api_key: str | None = None,
    http_post: Callable[..., Any] | None = None,
    use_cache: bool = True,
) -> dict[str, Any]:
    """Return bounded semantic search hints; fail closed to deterministic retrieval."""
    clean_query = " ".join(str(query or "").split()).strip()[:MAX_QUERY_CHARS]
    model = _model()
    key = _api_key(api_key)
    base = {
        "used": False,
        "provider": "google-gemini",
        "model": model,
        "notions": [],
        "concepts": [],
        "fallback": "deterministic",
        "latency_ms": 0,
        "error": "",
    }
    if not clean_query:
        return base
    if not _enabled() or not key:
        base["error"] = "not_configured"
        return base

    cache_key = _cache_key(clean_query, model)
    if use_cache:
        cached = _cache_get(cache_key)
        if cached is not None:
            cached["cache_hit"] = True
            return cached

    started = time.monotonic()
    post = http_post or requests.post
    try:
        request_payload = {
            "contents": [{"parts": [{"text": _prompt(clean_query)}]}],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 900,
                "responseFormat": {
                    "text": {
                        "mimeType": "application/json",
                        "schema": _RESPONSE_SCHEMA,
                    }
                },
            },
        }
        response = post(
            GEMINI_ENDPOINT.format(model=model),
            headers={"x-goog-api-key": key, "Content-Type": "application/json"},
            json=request_payload,
            timeout=(3.5, 8.0),
        )
        response.raise_for_status()
        parsed = _extract_response_json(response.json())
        if not parsed["concepts"]:
            raise ValueError("Gemini returned no usable concept.")
        result = {
            **base,
            **parsed,
            "used": True,
            "fallback": "none",
            "latency_ms": max(1, round((time.monotonic() - started) * 1000)),
            "cache_hit": False,
        }
        if use_cache:
            _cache_put(cache_key, result)
        return result
    except Exception as exc:
        base["latency_ms"] = max(1, round((time.monotonic() - started) * 1000))
        base["error"] = type(exc).__name__
        return base


def public_metadata(result: dict[str, Any]) -> dict[str, Any]:
    """Expose only operational metadata, never the API key or provider response."""
    return {
        "used": bool(result.get("used")),
        "provider": str(result.get("provider") or "google-gemini"),
        "model": str(result.get("model") or DEFAULT_MODEL),
        "fallback": str(result.get("fallback") or "deterministic"),
        "latency_ms": int(result.get("latency_ms") or 0),
        "cache_hit": bool(result.get("cache_hit")),
        "error": str(result.get("error") or ""),
    }


__all__ = [
    "DEFAULT_MODEL",
    "analyze_query",
    "clear_query_intelligence_cache",
    "public_metadata",
]
