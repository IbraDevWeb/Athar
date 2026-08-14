from __future__ import annotations

import re
import sqlite3
from typing import Any

import v2
from core import expand_query, normalize_text, search_chunks

STOPWORDS = {
    "a", "au", "aux", "avec", "ce", "ces", "concernant", "d", "dans", "de", "des", "dit", "du",
    "en", "et", "l", "la", "le", "les", "on", "par", "pour", "que", "quel", "quelle", "quels",
    "quelles", "rapporte", "selon", "sur", "trouve", "trouve-t-on", "un", "une",
    "al", "ibn", "livre", "ouvrage", "sahih", "sunan", "tafsir", "sira", "kitab",
}

TITLE_NOISE = {
    "al", "ibn", "wa", "wal", "fi", "ala", "sharh", "kitab", "sahih", "sunan", "tafsir", "sira",
    "jami", "jamic",
}

SUBJECT_EXPANSIONS = {
    "intention": ["نية", "نيات"],
    "intentions": ["نية", "نيات"],
    "purification": ["طهارة", "وضوء", "تيمم"],
    "priere": ["صلاة", "صلوات"],
    "prieres": ["صلاة", "صلوات"],
    "jeune": ["صيام", "صوم", "فطر"],
    "voyage": ["سفر", "مسافر"],
    "voyageur": ["سفر", "مسافر"],
    "fatiha": ["الفاتحة", "فاتحة"],
    "kursi": ["كرسي", "الكرسي"],
    "ayat": ["آية", "اية"],
    "witr": ["وتر", "الوتر"],
    "badr": ["بدر"],
    "bataille": ["غزوة", "وقعة"],
}


def _tokens(value: str) -> list[str]:
    return [token for token in normalize_text(value).split() if token]


def _meaningful_title_tokens(value: str) -> list[str]:
    return [token for token in _tokens(value) if token not in TITLE_NOISE and len(token) > 2]


def _detect_target_books(connection: sqlite3.Connection, query: str) -> list[dict[str, Any]]:
    q = normalize_text(query)
    q_tokens = set(q.split())
    rows = connection.execute(
        "SELECT id, title, title_ar, author, discipline, madhhab FROM books ORDER BY title"
    ).fetchall()
    scored: list[tuple[int, dict[str, Any]]] = []

    wants_tafsir = "tafsir" in q_tokens or "exegese" in q_tokens
    wants_sira = "sira" in q_tokens
    wants_hadith = any(token in q_tokens for token in {"sahih", "sunan", "hadith"})

    for row in rows:
        item = dict(row)
        title = normalize_text(item.get("title") or "")
        title_ar = normalize_text(item.get("title_ar") or "")
        author = normalize_text(item.get("author") or "")
        discipline = normalize_text(item.get("discipline") or "")
        score = 0

        if title and len(title) >= 5 and title in q:
            score += 120
        if title_ar and len(title_ar) >= 4 and title_ar in q:
            score += 120

        title_terms = _meaningful_title_tokens(title)
        if title_terms:
            matched = sum(1 for token in title_terms if token in q_tokens)
            if matched == len(title_terms):
                score += 85 + min(20, matched * 5)
            elif matched >= 2:
                score += 55
            elif matched == 1 and len(title_terms) == 1:
                score += 58

        if author and len(author) >= 4 and author in q:
            score += 55
            if wants_tafsir and "tafsir" in discipline:
                score += 50
            if wants_sira and ("sira" in discipline or "histoire" in discipline):
                score += 50
            if wants_hadith and "hadith" in discipline:
                score += 30

        if score >= 70:
            scored.append((score, item))

    if not scored:
        return []
    scored.sort(key=lambda pair: pair[0], reverse=True)
    best = scored[0][0]
    # Conserver uniquement les correspondances réellement concurrentes.
    return [item for score, item in scored if score >= best - 12][:3]


def _subject_terms(query: str, targets: list[dict[str, Any]]) -> list[str]:
    remove = set(STOPWORDS)
    for target in targets:
        remove.update(_tokens(target.get("title") or ""))
        remove.update(_tokens(target.get("title_ar") or ""))
        remove.update(_tokens(target.get("author") or ""))

    base = []
    for token in _tokens(query):
        if token in remove or len(token) <= 2:
            continue
        base.append(token)

    expanded: list[str] = []
    for token in base:
        expanded.append(token)
        expanded.extend(SUBJECT_EXPANSIONS.get(token, []))
    # Les expansions historiques restent utiles pour les termes déjà supportés.
    for term in expand_query(" ".join(base)):
        normalized = normalize_text(term)
        if normalized and normalized not in remove:
            expanded.append(term)

    unique: list[str] = []
    seen: set[str] = set()
    for term in expanded:
        key = normalize_text(term)
        if key and key not in seen:
            seen.add(key)
            unique.append(term)
    return unique[:18]


def _fts_expression(terms: list[str]) -> str:
    safe: list[str] = []
    for term in terms:
        token = re.sub(r"[^\w\u0600-\u06FF]", "", normalize_text(term), flags=re.UNICODE)
        if token:
            safe.append(f'"{token}"*')
    return " OR ".join(dict.fromkeys(safe))


def _targeted_candidates(
    connection: sqlite3.Connection,
    targets: list[dict[str, Any]],
    terms: list[str],
    limit: int,
) -> list[dict[str, Any]]:
    if not targets or not terms:
        return []
    book_ids = [str(item["id"]) for item in targets]
    placeholders = ",".join("?" for _ in book_ids)
    fts = _fts_expression(terms)
    if not fts:
        return []

    rows = connection.execute(
        f"""
        SELECT c.*, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
               bm25(chunks_fts, 5.0, 5.0, 3.0, 2.5, 1.8, 1.8, 1.0) AS rank
        FROM chunks_fts
        JOIN chunks c ON c.id = chunks_fts.chunk_id
        JOIN books b ON b.id = c.book_id
        WHERE chunks_fts MATCH ? AND b.id IN ({placeholders})
        ORDER BY rank ASC
        LIMIT ?
        """,
        [fts, *book_ids, max(20, min(limit * 5, 80))],
    ).fetchall()

    normalized_terms = [normalize_text(term) for term in terms if normalize_text(term)]
    results: list[dict[str, Any]] = []
    for index, row in enumerate(rows):
        content = normalize_text(" ".join([
            row["chapter"] or "", row["text_ar"] or "", row["text_fr"] or ""
        ]))
        hits = sum(1 for term in normalized_terms if term in content)
        # Un passage du bon livre mais sans le sujet demandé ne doit pas être présenté comme pertinent.
        if hits == 0:
            continue
        score = min(98, 62 + min(hits, 5) * 7 - min(index, 8))
        results.append({
            "id": row["id"],
            "book_id": row["book_id"],
            "title": row["title"],
            "title_ar": row["title_ar"],
            "author": row["author"],
            "discipline": row["discipline"],
            "madhhab": row["madhhab"],
            "page": row["page"],
            "chapter": row["chapter"],
            "text_ar": row["text_ar"],
            "text_fr": row["text_fr"],
            "translation_status": row["translation_status"],
            "source_url": row["source_url"],
            "score": score,
            "topic_hits": hits,
        })
    results.sort(key=lambda item: (item.get("topic_hits", 0), item.get("score", 0)), reverse=True)
    return results[: max(limit * 2, 20)]


def retrieve_evidence_v3(
    connection: sqlite3.Connection,
    query: str,
    *,
    madhhab: str = "",
    discipline: str = "",
    limit: int = 12,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    analysis = v2.analyze_question(query, madhhab, discipline)
    targets = _detect_target_books(connection, query)
    terms = _subject_terms(query, targets)
    retrieval_query = " ".join(terms) if terms else query

    if targets:
        candidates = _targeted_candidates(connection, targets, terms, limit)
        analysis["target_books"] = [
            {"id": item["id"], "title": item["title"], "author": item["author"]}
            for item in targets
        ]
        analysis["retrieval_mode"] = "book_targeted"
    else:
        search_madhhab = "" if analysis["madhhab"] in {"Toutes les écoles", "Comparatif", "all"} else analysis["madhhab"]
        search_discipline = "" if analysis["discipline"] in {"Recherche générale", "Fiqh comparé"} else analysis["discipline"]
        candidates = search_chunks(
            connection,
            retrieval_query,
            madhhab=search_madhhab,
            discipline=search_discipline,
            limit=max(limit * 2, 20),
        )
        analysis["target_books"] = []
        analysis["retrieval_mode"] = "general"

    analysis["retrieval_terms"] = terms
    analysis["query_terms"] = terms or analysis.get("query_terms", [])

    enriched: list[dict[str, Any]] = []
    target_ids = {str(item["id"]) for item in targets}
    normalized_terms = [normalize_text(term) for term in terms if normalize_text(term)]

    for candidate in candidates:
        item = v2._enrich_result(connection, candidate)
        content = normalize_text(" ".join(str(item.get(field) or "") for field in ("chapter", "text_ar", "text_fr")))
        topic_hits = sum(1 for term in normalized_terms if term in content)
        if targets and str(item.get("book_id")) not in target_ids:
            continue
        if targets and normalized_terms and topic_hits == 0:
            continue

        base = int(candidate.get("score") or 0)
        semantic = min(18, topic_hits * 4)
        authority = min(8, max(0, int(item.get("authority_bonus") or 0)))
        target_bonus = 12 if targets else 0
        score = min(99, base + semantic + authority + target_bonus)
        item["score"] = max(1, score)
        item["topic_hits"] = topic_hits
        item["has_substantive_text"] = (
            len((item.get("text_ar") or "").strip()) >= 80
            or len((item.get("text_fr") or "").strip()) >= 120
        )
        enriched.append(item)

    enriched.sort(
        key=lambda item: (item.get("has_substantive_text", False), item.get("topic_hits", 0), item.get("score", 0)),
        reverse=True,
    )
    selected = enriched[: max(1, min(limit, 20))]
    for index, item in enumerate(selected, start=1):
        item["citation_id"] = f"S{index}"
    return analysis, selected
