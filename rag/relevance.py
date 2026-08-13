from __future__ import annotations

import re
import sqlite3
from typing import Any

import core

ARABIC = re.compile(r"[\u0600-\u06FF]")

# Normalized French concepts -> Arabic retrieval vocabulary.
EXPANSIONS = {
    "tafsir": ["تفسير", "مفسر", "المفسرون", "exegese"],
    "exegese": ["تفسير", "مفسر", "المفسرون", "tafsir"],
    "exegete": ["تفسير", "مفسر"],
    "exegetes": ["تفسير", "مفسر", "المفسرون"],
    "coran": ["قرآن", "القرآن"],
    "verset": ["آية", "الآية"],
    "versets": ["آية", "آيات"],
    "sourate": ["سورة", "السورة"],
    "basmala": ["بسملة", "بسم", "بسم الله", "الرحمن", "الرحيم"],
    "misericorde": ["رحمة", "الرحمة", "رحم", "الرحمن", "الرحيم"],
    "hadith": ["حديث", "الأحاديث", "سنة"],
    "sunna": ["سنة", "السنة", "حديث"],
    "prophete": ["نبي", "النبي", "رسول"],
    "isnad": ["إسناد", "سند"],
    "consensus": ["إجماع", "الاجماع"],
    "divergence": ["اختلاف", "خلاف"],
    "ablution": ["وضوء", "الوضوء", "wudu", "purification"],
    "ablutions": ["وضوء", "الوضوء", "wudu", "purification"],
    "wudu": ["وضوء", "الوضوء", "ablution"],
    "ghusl": ["غسل", "الغسل"],
    "tayammum": ["تيمم", "التيمم"],
    "purification": ["طهارة", "وضوء", "غسل", "تيمم"],
    "priere": ["صلاة", "الصلاة", "salat"],
    "prieres": ["صلاة", "الصلوات"],
    "dhuhr": ["ظهر", "الظهر"],
    "asr": ["عصر", "العصر"],
    "isha": ["عشاء", "العشاء"],
    "fajr": ["فجر", "الفجر", "صبح"],
    "jumu": ["جمعة", "الجمعة"],
    "witr": ["وتر", "الوتر"],
    "regrouper": ["جمع", "الجمع", "regroupement"],
    "regroupement": ["جمع", "الجمع", "regrouper"],
    "raccourcir": ["قصر", "القصر"],
    "voyage": ["سفر", "السفر", "مسافر"],
    "voyageur": ["سفر", "مسافر", "المسافر"],
    "pluie": ["مطر", "المطر"],
    "intention": ["نية", "النية"],
    "jeune": ["صيام", "صوم", "الصيام"],
    "ramadan": ["رمضان", "صيام"],
    "zakat": ["زكاة", "الزكاة"],
    "sadaqa": ["صدقة", "الصدقة"],
    "mariage": ["نكاح", "زواج"],
    "divorce": ["طلاق", "الطلاق"],
    "vente": ["بيع", "البيع"],
    "riba": ["ربا", "الربا"],
    "coutume": ["عرف", "العرف"],
    "maslaha": ["مصلحة", "المصلحة"],
    "chien": ["كلب", "الكلب"],
    "chiens": ["كلب", "كلاب"],
    "sang": ["دم", "الدم"],
    "sommeil": ["نوم", "النوم"],
    "malikite": ["مالكي", "مالك"],
    "hanafite": ["حنفي", "أبو حنيفة"],
    "shafiite": ["شافعي", "الشافعي"],
    "hanbalite": ["حنبلي", "أحمد بن حنبل"],
}

STOPWORDS = {
    "a", "au", "aux", "avec", "ce", "ces", "comment", "comme", "dans", "de", "des", "du",
    "elle", "en", "est", "et", "il", "ils", "la", "le", "les", "leur", "mais", "ne", "nous",
    "on", "ou", "par", "pas", "peut", "pour", "pourquoi", "qu", "que", "qui", "se", "selon",
    "si", "son", "sont", "sur", "un", "une", "vous", "explique", "expliquer", "expliquent", "dit",
    "disent", "avis", "considere", "considerent", "في", "من", "على", "عن", "ما", "كيف", "هل",
}


def _terms(query: str) -> list[str]:
    return [t for t in core.normalize_text(query).split() if len(t) > 1 and t not in STOPWORDS and not t.isdigit()]


def _group(term: str) -> list[str]:
    values = [term]
    for extra in EXPANSIONS.get(term, []):
        values.extend(core.normalize_text(extra).split())
    if ARABIC.search(term):
        values.append(term[2:] if term.startswith("ال") and len(term) > 3 else f"ال{term}")
    return list(dict.fromkeys(v for v in values if v and v not in STOPWORDS))


def concept_groups(query: str) -> list[list[str]]:
    return [_group(term) for term in _terms(query)]


def expand_query(query: str) -> list[str]:
    return list(dict.fromkeys(term for group in concept_groups(query) for term in group))


def _fts(terms: list[str]) -> str:
    safe = []
    for term in terms:
        token = re.sub(r"[^\w\u0600-\u06FF]", "", term)
        if token:
            safe.append(f'"{token}"*')
    return " OR ".join(safe)


def _variants(value: str) -> list[str]:
    normalized = core.normalize_text(value)
    variants = [str(value or "").lower(), normalized]
    if "malik" in normalized: variants += ["malik", "mālik"]
    if "shafi" in normalized: variants += ["shafi", "shāfi"]
    if "hanaf" in normalized: variants += ["hanaf", "ḥanaf"]
    if "hanbal" in normalized: variants += ["hanbal", "ḥanbal"]
    if "tafsir" in normalized: variants += ["tafsir", "tafsīr"]
    return list(dict.fromkeys(v for v in variants if v))


def _filter(column: str, value: str, filters: list[str], params: list[Any]) -> None:
    variants = _variants(value)
    filters.append("(" + " OR ".join(f"LOWER({column}) LIKE ?" for _ in variants) + ")")
    params.extend(f"%{v}%" for v in variants)


def search_chunks(connection: sqlite3.Connection, query: str, *, madhhab: str = "", discipline: str = "", limit: int = 8) -> list[dict[str, Any]]:
    groups = concept_groups(query)
    terms = list(dict.fromkeys(t for group in groups for t in group))
    if not terms:
        return []
    filters: list[str] = []
    params: list[Any] = []
    if madhhab and core.normalize_text(madhhab) not in {"all", "tous", "toutes", "toutes les ecoles"}:
        _filter("b.madhhab", madhhab, filters, params)
    if discipline and core.normalize_text(discipline) not in {"all", "tous", "toutes", "recherche generale", "fiqh compare"}:
        _filter("b.discipline", discipline, filters, params)
    extra = (" AND " + " AND ".join(filters)) if filters else ""
    requested = max(1, min(limit, 25))
    rows = connection.execute(
        f"""SELECT c.*, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
                   bm25(chunks_fts,4.0,4.0,2.8,1.8,1.5,1.3,1.0) AS rank
            FROM chunks_fts JOIN chunks c ON c.id=chunks_fts.chunk_id JOIN books b ON b.id=c.book_id
            WHERE chunks_fts MATCH ? {extra} ORDER BY rank ASC LIMIT ?""",
        [_fts(terms), *params, max(80, min(300, requested * 15))],
    ).fetchall()
    required = 1 if len(groups) <= 2 else 2 if len(groups) <= 5 else 3
    results = []
    for index, row in enumerate(rows):
        haystack = core.normalize_text(" ".join(str(row[k] or "") for k in ("title","title_ar","author","discipline","madhhab","chapter","text_ar","text_fr")))
        hits = sum(1 for group in groups if any(term in haystack for term in group))
        if hits < required:
            continue
        coverage = hits / max(1, len(groups))
        term_hits = sum(1 for term in terms if term in haystack)
        score = max(1, min(100, round(18 + coverage * 52 + min(18, term_hits * 3) + max(0, 12-index//8))))
        results.append({
            "id": row["id"], "book_id": row["book_id"], "title": row["title"], "title_ar": row["title_ar"],
            "author": row["author"], "discipline": row["discipline"], "madhhab": row["madhhab"], "page": row["page"],
            "chapter": row["chapter"], "text_ar": row["text_ar"], "text_fr": row["text_fr"],
            "translation_status": row["translation_status"], "source_url": row["source_url"], "score": score,
            "matched_concepts": hits, "concept_count": len(groups), "concept_coverage": round(coverage,3),
        })
    results.sort(key=lambda x: (x["concept_coverage"], x["matched_concepts"], x["score"]), reverse=True)
    return results[:requested]


def install() -> None:
    core.expand_query = expand_query
    core.search_chunks = search_chunks
    import v2
    v2.expand_query = expand_query
    v2.search_chunks = search_chunks
    if getattr(v2, "_athar_relevance_installed", False):
        return
    original = v2.analyze_question
    def analyze(query: str, requested_madhhab: str = "", requested_discipline: str = "") -> dict[str, Any]:
        result = original(query, requested_madhhab, requested_discipline)
        normalized = core.normalize_text(query)
        if any(x in normalized for x in ("tafsir","exegese","exegete","basmala","verset","sourate","coran")):
            result["discipline"] = "Tafsīr"
            if not any(x in normalized for x in ("malik","hanaf","shafi","hanbal","madhhab")):
                result["madhhab"] = "Toutes les écoles"
        result["query_terms"] = expand_query(query)
        return result
    v2.analyze_question = analyze
    v2._athar_relevance_installed = True
