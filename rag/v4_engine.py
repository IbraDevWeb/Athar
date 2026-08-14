from __future__ import annotations

import re
import sqlite3
import unicodedata
from typing import Any

ARABIC_DIACRITICS = re.compile(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]")
NON_WORD = re.compile(r"[^\w\u0600-\u06FF]+", re.UNICODE)
SPACE = re.compile(r"\s+")

STOPWORDS = {
    "a", "al", "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "dit", "du", "elle", "en", "et",
    "il", "la", "le", "les", "leur", "leurs", "on", "ou", "par", "pour", "que", "quel", "quelle", "quels",
    "quelles", "rapporte", "selon", "son", "sur", "un", "une", "trouve", "trouve-t-on", "concernant", "d",
    "the", "what", "does", "say", "about", "in", "of", "and", "from",
}

GENERIC_BOOK_TOKENS = {
    "al", "ala", "fi", "kitab", "sharh", "tafsir", "sahih", "sunan", "jami", "jamic", "mukhtasar", "risala",
}

BOOK_KIND_MARKERS = {
    "tafsir": {"tafsir", "exegese", "exégèse"},
    "sira": {"sira", "sīra", "sirah", "biographie"},
    "hadith": {"sahih", "sunan", "hadith", "muwatta", "muwatta"},
    "fiqh": {"fiqh", "madhhab", "jurisprudence"},
}

# Each concept contains user-language triggers and terms that actually occur in classical Arabic/French text.
CONCEPTS: dict[str, dict[str, tuple[str, ...]]] = {
    "intention": {
        "triggers": ("intention", "intentions", "niyya", "niyya"),
        "terms": ("intention", "intentions", "niyya", "نية", "النية", "نيات", "بالنيات"),
    },
    "purification": {
        "triggers": ("purification", "ablution", "ablutions", "wudu", "wudhu", "tahara", "طهارة"),
        "terms": ("purification", "ablution", "wudu", "وضوء", "الوضوء", "طهارة", "الطهارة", "غسل", "تيمم"),
    },
    "prayer": {
        "triggers": ("priere", "prière", "prieres", "prières", "salat", "salah", "صلاة"),
        "terms": ("priere", "prière", "salat", "صلاة", "الصلاة", "صلوات"),
    },
    "fasting": {
        "triggers": ("jeune", "jeûne", "jeuner", "jeûner", "ramadan", "صيام", "صوم"),
        "terms": ("jeune", "jeûne", "ramadan", "صيام", "الصيام", "صوم", "الصوم", "فطر", "يفطر"),
    },
    "travel": {
        "triggers": ("voyage", "voyageur", "voyageurs", "safar", "مسافر", "سفر"),
        "terms": ("voyage", "voyageur", "safar", "سفر", "السفر", "مسافر", "المسافر"),
    },
    "fatiha": {
        "triggers": ("fatiha", "fatiha", "fatihah", "الفاتحة"),
        "terms": ("fatiha", "الفاتحة", "فاتحة", "فاتحة الكتاب", "الحمد لله رب العالمين"),
    },
    "ayat_al_kursi": {
        "triggers": ("ayat al kursi", "ayat-al-kursi", "kursi", "آية الكرسي", "اية الكرسي"),
        "terms": ("kursi", "الكرسي", "آية الكرسي", "اية الكرسي", "الله لا إله إلا هو الحي القيوم"),
    },
    "witr": {
        "triggers": ("witr", "وتر", "الوتر"),
        "terms": ("witr", "وتر", "الوتر"),
    },
    "badr": {
        "triggers": ("badr", "بدر", "غزوة بدر"),
        "terms": ("badr", "بدر", "غزوة بدر", "يوم بدر"),
    },
    "tayammum": {
        "triggers": ("tayammum", "tayamum", "تيمم"),
        "terms": ("tayammum", "تيمم", "التيمم"),
    },
}


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value or ""))
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = ARABIC_DIACRITICS.sub("", value)
    value = (
        value.replace("أ", "ا")
        .replace("إ", "ا")
        .replace("آ", "ا")
        .replace("ٱ", "ا")
        .replace("ى", "ي")
        .replace("ؤ", "و")
        .replace("ئ", "ي")
        .replace("ة", "ه")
        .replace("ـ", "")
        .lower()
    )
    value = NON_WORD.sub(" ", value)
    return SPACE.sub(" ", value).strip()


def tokens(value: str) -> list[str]:
    return [token for token in normalize_text(value).split() if token]


def _book_rows(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = connection.execute(
        "SELECT id, title, title_ar, author, discipline, madhhab, pages, source_url FROM books ORDER BY title"
    ).fetchall()
    return [dict(row) for row in rows]


def list_books(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT b.id, b.title, b.title_ar, b.author, b.discipline, b.madhhab, b.pages, b.source_url,
               COUNT(c.id) AS chunks, COUNT(DISTINCT c.page) AS indexed_pages
        FROM books b LEFT JOIN chunks c ON c.book_id=b.id
        GROUP BY b.id ORDER BY b.title
        """
    ).fetchall()
    return [dict(row) for row in rows]


def corpus_status(connection: sqlite3.Connection) -> dict[str, Any]:
    tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
    required = {"books", "chunks"}
    missing = sorted(required - tables)
    if missing:
        raise RuntimeError(f"Tables manquantes: {', '.join(missing)}")
    books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
    chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
    substantive = int(connection.execute(
        "SELECT COUNT(*) FROM chunks WHERE LENGTH(COALESCE(text_ar,''))>=80 OR LENGTH(COALESCE(text_fr,''))>=120"
    ).fetchone()[0])
    fts_ready = bool(connection.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='chunks_fts'"
    ).fetchone())
    return {
        "engine": "rag-v4",
        "books": books,
        "chunks": chunks,
        "substantive_passages": substantive,
        "fts_ready": fts_ready,
        "read_only": True,
    }


def _contains_phrase(query_norm: str, phrase: str) -> bool:
    phrase_norm = normalize_text(phrase)
    return bool(phrase_norm and re.search(rf"(?:^|\s){re.escape(phrase_norm)}(?:$|\s)", query_norm))


def _book_kind_matches(query_norm: str, book: dict[str, Any]) -> bool:
    discipline = normalize_text(book.get("discipline", ""))
    for kind, markers in BOOK_KIND_MARKERS.items():
        if any(_contains_phrase(query_norm, marker) for marker in markers):
            if kind == "tafsir" and "tafsir" in discipline:
                return True
            if kind == "sira" and ("sira" in discipline or "histoire" in discipline):
                return True
            if kind == "hadith" and "hadith" in discipline:
                return True
            if kind == "fiqh" and "fiqh" in discipline:
                return True
    return False


def detect_book(connection: sqlite3.Connection, query: str) -> dict[str, Any] | None:
    query_norm = normalize_text(query)
    query_tokens = set(query_norm.split())
    candidates: list[tuple[int, dict[str, Any], str]] = []

    for book in _book_rows(connection):
        title_norm = normalize_text(book.get("title", ""))
        title_ar_norm = normalize_text(book.get("title_ar", ""))
        author_norm = normalize_text(book.get("author", ""))
        score = 0
        reason = ""

        if title_norm and _contains_phrase(query_norm, title_norm):
            score, reason = 100, "exact_title"
        elif title_ar_norm and _contains_phrase(query_norm, title_ar_norm):
            score, reason = 100, "exact_arabic_title"
        else:
            significant_title = [t for t in title_norm.split() if t not in GENERIC_BOOK_TOKENS and len(t) >= 4]
            if significant_title and all(t in query_tokens for t in significant_title):
                score = 94 if len(significant_title) >= 2 else 89
                reason = "title_tokens"

            author_tokens = [t for t in author_norm.split() if t not in {"ibn", "abu", "al"} and len(t) >= 4]
            distinctive_author_hits = sum(1 for t in author_tokens if t in query_tokens)
            if distinctive_author_hits and _book_kind_matches(query_norm, book):
                author_score = min(92, 80 + distinctive_author_hits * 4)
                if author_score > score:
                    score, reason = author_score, "author_plus_book_kind"

        # Common catalogue names that differ from the formal OpenITI title.
        title_author = f"{title_norm} {author_norm}"
        alias_rules = (
            (("sahih bukhari", "sahih al bukhari"), "bukhari", "hadith"),
            (("sahih muslim",), "muslim", "hadith"),
            (("tafsir tabari", "tafsir al tabari"), "tabari", "tafsir"),
            (("tafsir ibn kathir",), "ibn kathir", "tafsir"),
            (("sira ibn hisham", "sirah ibn hisham"), "ibn hisham", "sira"),
            (("sunan tirmidhi", "sunan al tirmidhi"), "tirmidhi", "hadith"),
            (("muwatta malik", "muwatta de malik", "muwatta"), "malik", "hadith"),
            (("bidayat al mujtahid", "bidayat mujtahid"), "ibn rushd", "fiqh"),
        )
        for aliases, author_hint, discipline_hint in alias_rules:
            if any(alias in query_norm for alias in aliases):
                discipline_norm = normalize_text(book.get("discipline", ""))
                if normalize_text(author_hint) in title_author and normalize_text(discipline_hint) in discipline_norm:
                    if 98 > score:
                        score, reason = 98, "catalogue_alias"

        if score:
            candidates.append((score, book, reason))

    if not candidates:
        return None
    candidates.sort(key=lambda item: (item[0], len(normalize_text(item[1].get("title", "")))), reverse=True)
    score, book, reason = candidates[0]
    if score < 80:
        return None
    return {**book, "route_score": score, "route_reason": reason}


def detect_concepts(query: str) -> list[dict[str, Any]]:
    query_norm = normalize_text(query)
    found: list[dict[str, Any]] = []
    for name, spec in CONCEPTS.items():
        if any(normalize_text(trigger) in query_norm for trigger in spec["triggers"]):
            found.append({"name": name, "terms": list(spec["terms"])})
    return found


def _meaningful_terms(query: str, routed_book: dict[str, Any] | None) -> list[str]:
    query_terms = tokens(query)
    ignored = set(STOPWORDS)
    if routed_book:
        ignored.update(tokens(routed_book.get("title", "")))
        ignored.update(tokens(routed_book.get("title_ar", "")))
        ignored.update(tokens(routed_book.get("author", "")))
    result: list[str] = []
    for term in query_terms:
        if term in ignored or len(term) < 3:
            continue
        if term not in result:
            result.append(term)
    return result[:8]


def _fts_term(term: str) -> str:
    clean = normalize_text(term)
    if not clean:
        return ""
    parts = [re.sub(r"[^\w\u0600-\u06FF]", "", part) for part in clean.split()]
    parts = [part for part in parts if part]
    if not parts:
        return ""
    if len(parts) == 1:
        return f'"{parts[0]}"*'
    return '"' + " ".join(parts) + '"'


def _group_expression(terms: list[str]) -> str:
    expressions = [_fts_term(term) for term in terms]
    expressions = [expr for expr in expressions if expr]
    return "(" + " OR ".join(dict.fromkeys(expressions)) + ")" if expressions else ""


def build_fts_query(concepts: list[dict[str, Any]], raw_terms: list[str], strict: bool = True) -> str:
    if concepts:
        groups = [_group_expression(list(concept["terms"])) for concept in concepts]
        groups = [group for group in groups if group]
        return (" AND " if strict else " OR ").join(groups)
    terms = [_fts_term(term) for term in raw_terms[:4]]
    terms = [term for term in terms if term]
    return (" AND " if strict else " OR ").join(terms)


def _passage_text(item: dict[str, Any]) -> str:
    return " ".join(
        str(item.get(field) or "")
        for field in ("chapter", "text_ar", "text_fr")
    )


def _concept_matches(text_norm: str, concept: dict[str, Any]) -> list[str]:
    matched = []
    for term in concept["terms"]:
        term_norm = normalize_text(term)
        if term_norm and term_norm in text_norm:
            matched.append(term)
    return matched


def _trim(value: str, limit: int = 1800) -> str:
    clean = SPACE.sub(" ", str(value or "")).strip()
    if len(clean) <= limit:
        return clean
    return clean[:limit].rstrip() + "…"


def _fetch_fts_candidates(
    connection: sqlite3.Connection,
    fts_query: str,
    book_id: str,
    candidate_limit: int,
) -> list[dict[str, Any]]:
    if not fts_query:
        return []
    filters = " AND c.book_id=?" if book_id else ""
    params: list[Any] = [fts_query]
    if book_id:
        params.append(book_id)
    params.append(candidate_limit)
    rows = connection.execute(
        f"""
        SELECT c.id, c.book_id, c.page, c.chapter, c.text_ar, c.text_fr, c.translation_status,
               c.source_url, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
               bm25(chunks_fts, 0.0, 3.0, 3.0, 1.5, 3.0, 2.0, 1.0) AS bm25_rank
        FROM chunks_fts
        JOIN chunks c ON c.id=chunks_fts.chunk_id
        JOIN books b ON b.id=c.book_id
        WHERE chunks_fts MATCH ? {filters}
        ORDER BY bm25_rank ASC
        LIMIT ?
        """,
        params,
    ).fetchall()
    return [dict(row) for row in rows]


def _fallback_candidates(
    connection: sqlite3.Connection,
    book_id: str,
    search_terms: list[str],
    candidate_limit: int,
) -> list[dict[str, Any]]:
    if not book_id or not search_terms:
        return []
    clauses = []
    params: list[Any] = [book_id]
    for term in search_terms[:6]:
        clauses.append("(c.text_ar LIKE ? OR c.text_fr LIKE ? OR c.chapter LIKE ?)")
        pattern = f"%{term}%"
        params.extend([pattern, pattern, pattern])
    if not clauses:
        return []
    params.append(candidate_limit)
    rows = connection.execute(
        f"""
        SELECT c.id, c.book_id, c.page, c.chapter, c.text_ar, c.text_fr, c.translation_status,
               c.source_url, b.title, b.title_ar, b.author, b.discipline, b.madhhab, 999.0 AS bm25_rank
        FROM chunks c JOIN books b ON b.id=c.book_id
        WHERE c.book_id=? AND ({' OR '.join(clauses)})
        LIMIT ?
        """,
        params,
    ).fetchall()
    return [dict(row) for row in rows]


def search(
    connection: sqlite3.Connection,
    query: str,
    *,
    limit: int = 8,
    madhhab: str = "",
    discipline: str = "",
) -> dict[str, Any]:
    query = str(query or "").strip()
    if len(query) < 2:
        raise ValueError("La question est trop courte.")

    routed_book = detect_book(connection, query)
    concepts = detect_concepts(query)
    raw_terms = _meaningful_terms(query, routed_book)
    book_id = str(routed_book.get("id") or "") if routed_book else ""
    candidate_limit = max(60, min(limit * 20, 240))

    strict_fts = build_fts_query(concepts, raw_terms, strict=True)
    relaxed_fts = build_fts_query(concepts, raw_terms, strict=False)
    retrieval_mode = "fts_strict"
    candidates: list[dict[str, Any]] = []

    try:
        candidates = _fetch_fts_candidates(connection, strict_fts, book_id, candidate_limit)
        if not candidates and relaxed_fts and relaxed_fts != strict_fts:
            candidates = _fetch_fts_candidates(connection, relaxed_fts, book_id, candidate_limit)
            retrieval_mode = "fts_relaxed"
    except sqlite3.OperationalError:
        candidates = []

    if not candidates and routed_book:
        fallback_terms = []
        for concept in concepts:
            fallback_terms.extend(concept["terms"])
        fallback_terms.extend(raw_terms)
        candidates = _fallback_candidates(connection, book_id, fallback_terms, candidate_limit)
        retrieval_mode = "book_sql_fallback"

    ranked: list[dict[str, Any]] = []
    for index, candidate in enumerate(candidates):
        text_norm = normalize_text(_passage_text(candidate))
        chapter_norm = normalize_text(candidate.get("chapter", ""))
        matched_concepts: list[str] = []
        matched_terms: list[str] = []

        for concept in concepts:
            matches = _concept_matches(text_norm, concept)
            if matches:
                matched_concepts.append(str(concept["name"]))
                matched_terms.extend(matches)

        raw_hits = [term for term in raw_terms if normalize_text(term) in text_norm]
        matched_terms.extend(raw_hits)
        matched_terms = list(dict.fromkeys(matched_terms))

        if concepts:
            concept_coverage = len(matched_concepts) / len(concepts)
            if concept_coverage == 0:
                continue
            if len(concepts) > 1 and retrieval_mode == "fts_strict" and concept_coverage < 1:
                continue
        else:
            concept_coverage = 1.0 if raw_hits else 0.0
            if raw_terms and not raw_hits:
                continue

        chapter_hits = sum(1 for term in matched_terms if normalize_text(term) in chapter_norm)
        rank_bonus = max(0, 12 - index // 8)
        relevance = 22
        relevance += round(52 * concept_coverage)
        relevance += min(14, len(matched_terms) * 3)
        relevance += min(8, chapter_hits * 4)
        relevance += rank_bonus
        relevance = max(1, min(98, relevance))

        if discipline:
            wanted = normalize_text(discipline)
            actual = normalize_text(candidate.get("discipline", ""))
            if wanted and wanted not in actual:
                relevance = max(1, relevance - 12)
        if madhhab and normalize_text(madhhab) not in {"", "all", "tous", "toutes", "toutes les ecoles"}:
            wanted = normalize_text(madhhab)
            actual = normalize_text(candidate.get("madhhab", ""))
            if wanted and wanted not in actual:
                relevance = max(1, relevance - 10)

        ranked.append({
            "id": candidate["id"],
            "book_id": candidate["book_id"],
            "title": candidate.get("title") or "",
            "title_ar": candidate.get("title_ar") or "",
            "author": candidate.get("author") or "",
            "discipline": candidate.get("discipline") or "",
            "madhhab": candidate.get("madhhab") or "",
            "page": candidate.get("page"),
            "chapter": candidate.get("chapter") or "",
            "text_ar": _trim(candidate.get("text_ar") or ""),
            "text_fr": _trim(candidate.get("text_fr") or ""),
            "translation_status": candidate.get("translation_status") or "",
            "source_url": candidate.get("source_url") or "",
            "relevance": relevance,
            "matched_concepts": matched_concepts,
            "matched_terms": matched_terms[:12],
        })

    ranked.sort(key=lambda item: (item["relevance"], len(item["matched_concepts"]), len(item["matched_terms"])), reverse=True)

    # Deduplicate near-identical passages while preserving different pages/chapters.
    selected: list[dict[str, Any]] = []
    seen = set()
    for item in ranked:
        key = (item["book_id"], item.get("page"), normalize_text(item.get("chapter", "")), normalize_text((item.get("text_ar") or item.get("text_fr") or "")[:180]))
        if key in seen:
            continue
        seen.add(key)
        selected.append(item)
        if len(selected) >= max(1, min(int(limit), 20)):
            break

    for index, item in enumerate(selected, start=1):
        item["citation_id"] = f"S{index}"

    analysis = {
        "engine": "rag-v4",
        "routed_book": ({
            "id": routed_book.get("id"),
            "title": routed_book.get("title"),
            "author": routed_book.get("author"),
            "reason": routed_book.get("route_reason"),
            "score": routed_book.get("route_score"),
        } if routed_book else None),
        "concepts": [concept["name"] for concept in concepts],
        "raw_terms": raw_terms,
        "retrieval_mode": retrieval_mode,
        "strict_query": strict_fts,
        "candidate_count": len(candidates),
    }
    return {"query": query, "analysis": analysis, "sources": selected, "count": len(selected)}


def ask(
    connection: sqlite3.Connection,
    query: str,
    *,
    limit: int = 8,
    madhhab: str = "",
    discipline: str = "",
) -> dict[str, Any]:
    result = search(connection, query, limit=limit, madhhab=madhhab, discipline=discipline)
    sources = result["sources"]
    claims = []
    for source in sources[:4]:
        text = source.get("text_fr") or source.get("text_ar") or ""
        if not text:
            continue
        claims.append({
            "id": f"C{len(claims)+1}",
            "text": _trim(text, 700),
            "source_ids": [source["citation_id"]],
            "kind": "direct_excerpt",
            "relevance": source["relevance"],
        })

    if not sources:
        summary = "Aucun passage suffisamment pertinent n'a été retrouvé. Athar ne fabrique pas de réponse de remplacement."
        verdict = "insufficient"
    elif result["analysis"]["routed_book"]:
        summary = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans l'ouvrage demandé."
        verdict = "evidence_found"
    else:
        summary = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans le corpus."
        verdict = "evidence_found"

    return {
        **result,
        "answer": {
            "mode": "evidence_only",
            "summary": summary,
            "verdict": verdict,
            "claims": claims,
            "warning": "Les scores indiquent une pertinence documentaire, pas un degré de certitude religieuse.",
        },
    }
