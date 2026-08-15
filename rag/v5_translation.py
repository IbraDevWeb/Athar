from __future__ import annotations

import html
import json
import re
import urllib.parse
import urllib.request
from typing import Any, Callable

MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get"
MAX_QUERY_BYTES = 450
MAX_SOURCE_CHARS = 1800
SPACE = re.compile(r"\s+")
SENTENCE_BREAK = re.compile(r"(?<=[.!?؟؛])\s+|\n+")
LATIN_LETTER = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿ]")


class TranslationError(RuntimeError):
    """Raised when the external translation service cannot return usable French."""


def _clean(value: Any) -> str:
    return SPACE.sub(" ", str(value or "")).strip()


def _split_long_token(token: str, max_bytes: int) -> list[str]:
    chunks: list[str] = []
    current = ""
    for char in token:
        candidate = current + char
        if current and len(candidate.encode("utf-8")) > max_bytes:
            chunks.append(current)
            current = char
        else:
            current = candidate
    if current:
        chunks.append(current)
    return chunks


def _pack_words(text: str, max_bytes: int) -> list[str]:
    chunks: list[str] = []
    current = ""
    for word in text.split():
        if len(word.encode("utf-8")) > max_bytes:
            if current:
                chunks.append(current)
                current = ""
            chunks.extend(_split_long_token(word, max_bytes))
            continue
        candidate = word if not current else f"{current} {word}"
        if current and len(candidate.encode("utf-8")) > max_bytes:
            chunks.append(current)
            current = word
        else:
            current = candidate
    if current:
        chunks.append(current)
    return chunks


def split_for_translation(text: str, max_bytes: int = MAX_QUERY_BYTES) -> list[str]:
    """Split one source excerpt into API-safe sentence-sized UTF-8 chunks."""
    clean = _clean(text)
    if not clean:
        return []
    if max_bytes < 16:
        raise ValueError("max_bytes est trop faible.")

    sentences = [part.strip() for part in SENTENCE_BREAK.split(clean) if part.strip()]
    segments: list[str] = []
    current = ""
    for sentence in sentences:
        pieces = [sentence] if len(sentence.encode("utf-8")) <= max_bytes else _pack_words(sentence, max_bytes)
        for piece in pieces:
            candidate = piece if not current else f"{current} {piece}"
            if current and len(candidate.encode("utf-8")) > max_bytes:
                segments.append(current)
                current = piece
            else:
                current = candidate
    if current:
        segments.append(current)
    return segments


def _read_json_response(response: Any) -> dict[str, Any]:
    raw = response.read()
    if isinstance(raw, bytes):
        raw = raw.decode("utf-8", errors="replace")
    payload = json.loads(raw or "{}")
    if not isinstance(payload, dict):
        raise TranslationError("Réponse de traduction invalide.")
    return payload


def _translate_segment(
    segment: str,
    *,
    opener: Callable[..., Any],
    timeout: float,
) -> str:
    query = urllib.parse.urlencode({"q": segment, "langpair": "ar|fr", "mt": "1"})
    request = urllib.request.Request(
        f"{MYMEMORY_ENDPOINT}?{query}",
        headers={
            "Accept": "application/json",
            "User-Agent": "AtharResearch/5.1 (+https://github.com/IbraDevWeb/Athar)",
        },
        method="GET",
    )
    try:
        with opener(request, timeout=timeout) as response:
            payload = _read_json_response(response)
    except TranslationError:
        raise
    except Exception as exc:
        raise TranslationError(f"Service de traduction indisponible: {type(exc).__name__}") from exc

    status = payload.get("responseStatus", 200)
    try:
        status_code = int(status)
    except (TypeError, ValueError):
        status_code = 200
    translated = html.unescape(str((payload.get("responseData") or {}).get("translatedText") or "")).strip()
    if status_code >= 400 or not translated:
        details = _clean(payload.get("responseDetails")) or "aucune traduction reçue"
        raise TranslationError(f"Traduction refusée: {details}.")
    if not LATIN_LETTER.search(translated):
        raise TranslationError("Le service n'a pas renvoyé de traduction française exploitable.")
    return translated


def translate_arabic_to_french(
    text: str,
    *,
    opener: Callable[..., Any] | None = None,
    timeout: float = 12.0,
) -> dict[str, Any]:
    """Translate the same bounded Arabic excerpt Athar exposes in a citation."""
    source = _clean(text)
    if not source:
        raise ValueError("Le passage arabe est vide.")
    source = source if len(source) <= MAX_SOURCE_CHARS else source[:MAX_SOURCE_CHARS].rstrip() + "…"
    segments = split_for_translation(source)
    if not segments:
        raise ValueError("Le passage arabe est vide.")

    open_url = opener or urllib.request.urlopen
    translated_parts = [
        _translate_segment(segment, opener=open_url, timeout=timeout)
        for segment in segments
    ]
    translated = _clean(" ".join(translated_parts))
    if not translated:
        raise TranslationError("Aucune traduction française exploitable n'a été produite.")

    return {
        "text_fr": translated,
        "translation_status": "Traduction automatique",
        "translation_provider": "MyMemory",
        "translation_notice": (
            "Traduction automatique indicative via MyMemory. "
            "Le texte arabe original reste la référence à consulter."
        ),
        "translated_segments": len(segments),
    }


__all__ = [
    "MAX_QUERY_BYTES",
    "MAX_SOURCE_CHARS",
    "MYMEMORY_ENDPOINT",
    "TranslationError",
    "split_for_translation",
    "translate_arabic_to_french",
]
