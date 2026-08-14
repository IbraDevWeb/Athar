from __future__ import annotations

import re
import sqlite3
import unicodedata
from typing import Any

ARABIC_DIACRITICS = re.compile(r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]")
NON_WORD = re.compile(r"[^\w\u0600-\u06FF]+", re.UNICODE)
SPACE = re.compile(r"\s+")

STOPWORDS = {
    "a", "al", "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "dit", "du", "elle", "en", "est", "et",
    "il", "la", "le", "les", "leur", "leurs", "on", "ou", "par", "peut", "pour", "que", "quel", "quelle", "quels",
    "quelles", "rapporte", "retrouve", "selon", "son", "sur", "un", "une", "trouve", "concernant", "comment",
    "quand", "pourquoi", "faire", "fait", "faut", "doit", "dois", "the", "what", "does", "say", "about", "in",
    "of", "and", "from", "is", "can", "how", "when", "why",
}

GENERIC_BOOK_TOKENS = {
    "al", "ala", "fi", "kitab", "sharh", "tafsir", "sahih", "sunan", "jami", "jamic", "mukhtasar", "risala",
}

BOOK_KIND_MARKERS = {
    "tafsir": ("tafsir", "exegese"),
    "sira": ("sira", "sirah", "biographie"),
    "hadith": ("sahih", "sunan", "hadith", "muwatta"),
    "fiqh": ("fiqh", "madhhab", "jurisprudence"),
}

# Lightweight multilingual ontology. Each concept bridges natural French wording to
# vocabulary that actually occurs in Arabic/French source passages.
# "specificity" is used by the reranker: a precise concept such as jahr should
# outweigh a generic context such as prayer.
CONCEPTS: dict[str, dict[str, Any]] = {
    "intention": {
        "triggers": ("intention", "intentions", "niyya", "niyyah"),
        "terms": ("intention", "niyya", "نية", "النية", "نيات", "بالنيات", "نوى"),
        "specificity": 3,
    },
    "prayer": {
        "triggers": ("priere", "prieres", "prier", "prie", "prient", "salat", "salah"),
        "terms": ("priere", "prier", "salat", "صلاة", "الصلاة", "صلوات", "يصلي", "صلى"),
        "specificity": 1,
    },
    "recitation_aloud": {
        "triggers": (
            "voix haute", "a voix haute", "haute voix", "recitation a voix haute", "reciter a voix haute",
            "prier a voix haute", "jahr", "jahri", "jahriyya",
        ),
        "terms": (
            "voix haute", "a voix haute", "jahr", "جهر", "الجهر", "يجهر", "جهرا", "جهرية",
            "رفع الصوت", "يرفع صوته", "أسمعنا", "يسمعنا", "القراءة جهرا",
        ),
        "specificity": 5,
    },
    "recitation_silent": {
        "triggers": (
            "voix basse", "a voix basse", "silencieusement", "en silence", "priere silencieuse",
            "recitation silencieuse", "sirri", "sirriyya",
        ),
        "terms": (
            "voix basse", "silencieuse", "إسرار", "الإسرار", "يسر", "سرا", "سرية",
            "خافت", "يخافت", "خفض الصوت", "القراءة سرا",
        ),
        "specificity": 5,
    },
    "recitation": {
        "triggers": ("recitation", "reciter", "lecture du coran", "lire le coran", "qiraa", "qiraat"),
        "terms": ("recitation", "قراءة", "القراءة", "يقرأ", "قرأ", "القرآن"),
        "specificity": 2,
    },
    "fatiha": {
        "triggers": ("fatiha", "fatihah", "al fatiha"),
        "terms": ("fatiha", "الفاتحة", "فاتحة", "فاتحة الكتاب", "الحمد لله رب العالمين"),
        "specificity": 5,
    },
    "basmala": {
        "triggers": ("basmala", "bismillah", "bismi llah"),
        "terms": ("basmala", "بسملة", "البسملة", "بسم الله الرحمن الرحيم"),
        "specificity": 5,
    },
    "witr": {
        "triggers": ("witr",),
        "terms": ("witr", "وتر", "الوتر", "أوتر", "يوتر"),
        "specificity": 5,
    },
    "qunut": {
        "triggers": ("qunut", "qounout", "kunut"),
        "terms": ("qunut", "قنوت", "القنوت", "قنت", "يقنت"),
        "specificity": 5,
    },
    "ruku": {
        "triggers": ("ruku", "roukou", "inclinaison"),
        "terms": ("ruku", "ركوع", "الركوع", "ركع", "يركع"),
        "specificity": 4,
    },
    "sujud": {
        "triggers": ("sujud", "soujoud", "prosternation", "prosterner"),
        "terms": ("sujud", "سجود", "السجود", "سجد", "يسجد"),
        "specificity": 4,
    },
    "tashahhud": {
        "triggers": ("tashahhud", "tachahoud", "attahiyat"),
        "terms": ("tashahhud", "تشهد", "التشهد", "التحيات"),
        "specificity": 5,
    },
    "takbir": {
        "triggers": ("takbir", "takbeer", "allahu akbar"),
        "terms": ("takbir", "تكبير", "التكبير", "كبر", "الله أكبر"),
        "specificity": 4,
    },
    "taslim": {
        "triggers": ("taslim", "salam final", "salutation finale"),
        "terms": ("taslim", "تسليم", "التسليم", "السلام عليكم"),
        "specificity": 4,
    },
    "adhan": {
        "triggers": ("adhan", "appel a la priere", "appel a priere"),
        "terms": ("adhan", "أذان", "الاذان", "المؤذن", "يؤذن"),
        "specificity": 4,
    },
    "iqama": {
        "triggers": ("iqama", "iqamah"),
        "terms": ("iqama", "إقامة", "الاقامة", "أقام الصلاة"),
        "specificity": 4,
    },
    "congregation": {
        "triggers": ("en groupe", "en congregation", "jama a", "jamaa", "priere collective"),
        "terms": ("congregation", "جماعة", "الجماعة", "صلاة الجماعة"),
        "specificity": 3,
    },
    "imam": {
        "triggers": ("imam", "derriere l imam", "derriere imam"),
        "terms": ("imam", "إمام", "الامام", "ائتم", "المأموم"),
        "specificity": 3,
    },
    "friday_prayer": {
        "triggers": ("jumu a", "jumua", "vendredi", "priere du vendredi"),
        "terms": ("jumu", "جمعة", "الجمعة", "صلاة الجمعة"),
        "specificity": 4,
    },
    "prayer_times": {
        "triggers": ("heure de priere", "heures de priere", "temps de priere", "horaire de priere"),
        "terms": ("وقت الصلاة", "اوقات الصلاة", "مواقيت الصلاة", "الوقت"),
        "specificity": 3,
    },
    "fajr": {
        "triggers": ("fajr", "sobh", "subh", "aube"),
        "terms": ("fajr", "فجر", "الفجر", "صبح", "الصبح"),
        "specificity": 4,
    },
    "dhuhr": {
        "triggers": ("dhuhr", "dohr", "zuhr"),
        "terms": ("dhuhr", "ظهر", "الظهر"),
        "specificity": 4,
    },
    "asr": {
        "triggers": ("asr",),
        "terms": ("asr", "عصر", "العصر"),
        "specificity": 4,
    },
    "maghrib": {
        "triggers": ("maghrib",),
        "terms": ("maghrib", "مغرب", "المغرب"),
        "specificity": 4,
    },
    "isha": {
        "triggers": ("isha", "ichaa", "icha"),
        "terms": ("isha", "عشاء", "العشاء"),
        "specificity": 4,
    },
    "travel": {
        "triggers": ("voyage", "voyageur", "voyageurs", "safar", "en voyage"),
        "terms": ("voyage", "voyageur", "safar", "سفر", "السفر", "مسافر", "المسافر"),
        "specificity": 2,
    },
    "combine_prayers": {
        "triggers": ("regrouper les prieres", "regroupement des prieres", "regrouper dhuhr", "jam salat"),
        "terms": ("جمع الصلاة", "جمع الصلاتين", "يجمع", "الجمع بين الصلاتين", "جمع بين"),
        "specificity": 5,
    },
    "shorten_prayer": {
        "triggers": ("raccourcir la priere", "raccourcir les prieres", "qasr", "priere raccourcie"),
        "terms": ("قصر الصلاة", "القصر", "يقصر", "صلاة السفر"),
        "specificity": 5,
    },
    "purification": {
        "triggers": ("purification", "purete rituelle", "tahara"),
        "terms": ("purification", "طهارة", "الطهارة", "طهور"),
        "specificity": 2,
    },
    "wudu": {
        "triggers": ("wudu", "wudhu", "ablution", "ablutions"),
        "terms": ("wudu", "وضوء", "الوضوء", "توضأ", "يتوضأ"),
        "specificity": 5,
    },
    "ghusl": {
        "triggers": ("ghusl", "grande ablution", "bain rituel"),
        "terms": ("ghusl", "غسل", "الغسل", "اغتسل", "يغتسل"),
        "specificity": 5,
    },
    "tayammum": {
        "triggers": ("tayammum", "tayamum", "ablution seche"),
        "terms": ("tayammum", "تيمم", "التيمم"),
        "specificity": 5,
    },
    "menstruation": {
        "triggers": ("menstruation", "menstrues", "regles", "haid", "hayd"),
        "terms": ("menstruation", "حيض", "الحيض", "حائض"),
        "specificity": 5,
    },
    "fasting": {
        "triggers": ("jeune", "jeuner", "ramadan", "siyam", "sawm"),
        "terms": ("jeune", "ramadan", "صيام", "الصيام", "صوم", "الصوم", "يفطر", "فطر"),
        "specificity": 3,
    },
    "zakat": {
        "triggers": ("zakat", "aumone obligatoire"),
        "terms": ("zakat", "زكاة", "الزكاة", "صدقة"),
        "specificity": 4,
    },
    "marriage": {
        "triggers": ("mariage", "nikah", "epouser", "epouse"),
        "terms": ("mariage", "نكاح", "النكاح", "تزوج", "زوج"),
        "specificity": 3,
    },
    "divorce": {
        "triggers": ("divorce", "talaq", "repudiation"),
        "terms": ("divorce", "طلاق", "الطلاق", "طلق"),
        "specificity": 4,
    },
    "inheritance": {
        "triggers": ("heritage", "heritier", "succession", "faraid"),
        "terms": ("heritage", "ميراث", "الميراث", "فرائض", "الفرائض", "وارث"),
        "specificity": 4,
    },
    "riba": {
        "triggers": ("riba", "usure", "interet bancaire", "interets bancaires"),
        "terms": ("riba", "ربا", "الربا"),
        "specificity": 5,
    },
    "badr": {
        "triggers": ("badr", "bataille de badr"),
        "terms": ("badr", "بدر", "غزوة بدر", "يوم بدر"),
        "specificity": 5,
    },
    "ayat_al_kursi": {
        "triggers": ("ayat al kursi", "ayat al-kursi", "kursi"),
        "terms": ("kursi", "الكرسي", "آية الكرسي", "اية الكرسي", "الله لا إله إلا هو الحي القيوم"),
        "specificity": 5,
    },
}


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value or ""))
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = ARABIC_DIACRITICS.sub("", value)
    value = (
        value.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ٱ", "ا")
        .replace("ى", "ي").replace("ؤ", "و").replace("ئ", "ي").replace("ة", "ه").replace("ـ", "").lower()
    )
    value = NON_WORD.sub(" ", value)
    return SPACE.sub(" ", value).strip()


def tokens(value: str) -> list[str]:
    return [token for token in normalize_text(value).split() if token]


def _contains_phrase(haystack_norm: str, phrase: str) -> bool:
    phrase_norm = normalize_text(phrase)
    return bool(phrase_norm and re.search(rf"(?:^|\s){re.escape(phrase_norm)}(?:$|\s)", haystack_norm))


def _book_rows(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = connection.execute("SELECT id, title, title_ar, author, discipline, madhhab, pages, source_url FROM books ORDER BY title").fetchall()
    return [dict(row) for row in rows]


def list_books(connection: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = connection.execute("""
        SELECT b.id, b.title, b.title_ar, b.author, b.discipline, b.madhhab, b.pages, b.source_url,
               COUNT(c.id) AS chunks, COUNT(DISTINCT c.page) AS indexed_pages
        FROM books b LEFT JOIN chunks c ON c.book_id=b.id
        GROUP BY b.id ORDER BY b.title
    """).fetchall()
    return [dict(row) for row in rows]


def corpus_status(connection: sqlite3.Connection) -> dict[str, Any]:
    tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()}
    missing = sorted({"books", "chunks"} - tables)
    if missing:
        raise RuntimeError(f"Tables manquantes: {', '.join(missing)}")
    books = int(connection.execute("SELECT COUNT(*) FROM books").fetchone()[0])
    chunks = int(connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0])
    substantive = int(connection.execute("SELECT COUNT(*) FROM chunks WHERE LENGTH(COALESCE(text_ar,''))>=80 OR LENGTH(COALESCE(text_fr,''))>=120").fetchone()[0])
    fts_ready = bool(connection.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='chunks_fts'").fetchone())
    return {"engine": "rag-v5-hybrid-multilingual", "books": books, "chunks": chunks, "substantive_passages": substantive, "fts_ready": fts_ready, "read_only": True, "semantic_embeddings": False}


def _book_kind_matches(query_norm: str, book: dict[str, Any]) -> bool:
    discipline = normalize_text(book.get("discipline", ""))
    for kind, markers in BOOK_KIND_MARKERS.items():
        if any(_contains_phrase(query_norm, marker) for marker in markers):
            if kind == "tafsir" and "tafsir" in discipline: return True
            if kind == "sira" and ("sira" in discipline or "histoire" in discipline): return True
            if kind == "hadith" and "hadith" in discipline: return True
            if kind == "fiqh" and "fiqh" in discipline: return True
    return False


def detect_book(connection: sqlite3.Connection, query: str) -> dict[str, Any] | None:
    query_norm = normalize_text(query)
    query_tokens = set(query_norm.split())
    candidates: list[tuple[int, dict[str, Any], str]] = []
    alias_rules = (
        (("sahih bukhari", "sahih al bukhari"), "bukhari", "hadith"), (("sahih muslim",), "muslim", "hadith"),
        (("tafsir tabari", "tafsir al tabari"), "tabari", "tafsir"), (("tafsir ibn kathir",), "ibn kathir", "tafsir"),
        (("sira ibn hisham", "sirah ibn hisham"), "ibn hisham", "sira"), (("sunan tirmidhi", "sunan al tirmidhi"), "tirmidhi", "hadith"),
        (("muwatta malik", "muwatta de malik", "muwatta"), "malik", "hadith"), (("bidayat al mujtahid", "bidayat mujtahid"), "ibn rushd", "fiqh"),
    )
    for book in _book_rows(connection):
        title_norm, title_ar_norm, author_norm = normalize_text(book.get("title", "")), normalize_text(book.get("title_ar", "")), normalize_text(book.get("author", ""))
        discipline_norm = normalize_text(book.get("discipline", "")); score = 0; reason = ""
        if title_norm and _contains_phrase(query_norm, title_norm): score, reason = 100, "exact_title"
        elif title_ar_norm and _contains_phrase(query_norm, title_ar_norm): score, reason = 100, "exact_arabic_title"
        else:
            significant_title = [t for t in title_norm.split() if t not in GENERIC_BOOK_TOKENS and len(t) >= 4]
            if significant_title and all(t in query_tokens for t in significant_title): score, reason = (94 if len(significant_title) >= 2 else 89), "title_tokens"
            author_tokens = [t for t in author_norm.split() if t not in {"ibn", "abu", "al"} and len(t) >= 4]
            author_hits = sum(1 for t in author_tokens if t in query_tokens)
            if author_hits and _book_kind_matches(query_norm, book):
                author_score = min(92, 80 + author_hits * 4)
                if author_score > score: score, reason = author_score, "author_plus_book_kind"
        title_author = f"{title_norm} {author_norm}"
        for aliases, author_hint, discipline_hint in alias_rules:
            if any(alias in query_norm for alias in aliases) and normalize_text(author_hint) in title_author and normalize_text(discipline_hint) in discipline_norm:
                if 98 > score: score, reason = 98, "catalogue_alias"
        if score: candidates.append((score, book, reason))
    if not candidates: return None
    candidates.sort(key=lambda item: (item[0], len(normalize_text(item[1].get("title", "")))), reverse=True)
    score, book, reason = candidates[0]
    return {**book, "route_score": score, "route_reason": reason} if score >= 80 else None


def detect_concepts(query: str) -> list[dict[str, Any]]:
    query_norm = normalize_text(query); found: list[dict[str, Any]] = []
    for name, spec in CONCEPTS.items():
        matched = [trigger for trigger in spec["triggers"] if _contains_phrase(query_norm, trigger)]
        if matched: found.append({"name": name, "terms": list(spec["terms"]), "specificity": int(spec.get("specificity", 1)), "matched_triggers": matched})
    found.sort(key=lambda item: (item["specificity"], len(item["matched_triggers"][0])), reverse=True)
    return found


def _meaningful_terms(query: str, routed_book: dict[str, Any] | None, concepts: list[dict[str, Any]]) -> list[str]:
    ignored = set(STOPWORDS)
    for concept in concepts:
        for trigger in concept.get("matched_triggers", []): ignored.update(tokens(trigger))
    if routed_book:
        ignored.update(tokens(routed_book.get("title", ""))); ignored.update(tokens(routed_book.get("title_ar", ""))); ignored.update(tokens(routed_book.get("author", "")))
    result = []
    for term in tokens(query):
        if term not in ignored and len(term) >= 3 and term not in result: result.append(term)
    return result[:10]


def _fts_term(term: str) -> str:
    clean = normalize_text(term)
    if not clean: return ""
    parts = [re.sub(r"[^\w\u0600-\u06FF]", "", part) for part in clean.split()]; parts = [p for p in parts if p]
    if not parts: return ""
    return f'"{parts[0]}"*' if len(parts) == 1 else '"' + " ".join(parts) + '"'


def _group_expression(terms: list[str]) -> str:
    expressions = [e for e in (_fts_term(term) for term in terms) if e]
    return "(" + " OR ".join(dict.fromkeys(expressions)) + ")" if expressions else ""


def build_query_plan(concepts: list[dict[str, Any]], raw_terms: list[str]) -> list[tuple[str, str]]:
    plan: list[tuple[str, str]] = []
    if concepts:
        groups = [(g, c) for c in concepts if (g := _group_expression(c["terms"]))]
        if groups:
            plan.append(("concept_strict", " AND ".join(g for g, _ in groups[:min(2, len(groups))])))
            primary = [g for g, c in groups if c["specificity"] >= 4]
            if primary: plan.append(("concept_primary", " OR ".join(primary)))
            plan.append(("concept_relaxed", " OR ".join(g for g, _ in groups)))
    raw = [e for e in (_fts_term(term) for term in raw_terms[:6]) if e]
    if raw: plan.append(("raw_relaxed", " OR ".join(raw)))
    result = []; seen = set()
    for mode, expression in plan:
        if expression and expression not in seen: seen.add(expression); result.append((mode, expression))
    return result


def _passage_text(item: dict[str, Any]) -> str:
    return " ".join(str(item.get(field) or "") for field in ("chapter", "text_ar", "text_fr"))


def _term_matches(text_norm: str, term: str) -> bool:
    term_norm = normalize_text(term); return bool(term_norm and term_norm in text_norm)


def _trim(value: str, limit: int = 1800) -> str:
    clean = SPACE.sub(" ", str(value or "")).strip(); return clean if len(clean) <= limit else clean[:limit].rstrip() + "…"


def _fetch_fts_candidates(connection: sqlite3.Connection, fts_query: str, book_id: str, candidate_limit: int) -> list[dict[str, Any]]:
    if not fts_query: return []
    filters = " AND c.book_id=?" if book_id else ""; params: list[Any] = [fts_query]
    if book_id: params.append(book_id)
    params.append(candidate_limit)
    rows = connection.execute(f"""
        SELECT c.id, c.book_id, c.page, c.chapter, c.text_ar, c.text_fr, c.translation_status,
               c.source_url, b.title, b.title_ar, b.author, b.discipline, b.madhhab,
               bm25(chunks_fts, 0.0, 3.0, 3.0, 1.5, 3.0, 2.0, 1.0) AS bm25_rank
        FROM chunks_fts JOIN chunks c ON c.id=chunks_fts.chunk_id JOIN books b ON b.id=c.book_id
        WHERE chunks_fts MATCH ? {filters} ORDER BY bm25_rank ASC LIMIT ?
    """, params).fetchall()
    return [dict(row) for row in rows]


def search(connection: sqlite3.Connection, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
    query = str(query or "").strip()
    if len(query) < 2: raise ValueError("La question est trop courte.")
    routed_book = detect_book(connection, query); concepts = detect_concepts(query); raw_terms = _meaningful_terms(query, routed_book, concepts)
    book_id = str(routed_book.get("id") or "") if routed_book else ""; candidate_limit = max(100, min(max(1, int(limit)) * 35, 350))
    query_plan = build_query_plan(concepts, raw_terms); candidates = []; retrieval_mode = "none"; used_query = ""; errors = []
    for mode, expression in query_plan:
        try: batch = _fetch_fts_candidates(connection, expression, book_id, candidate_limit)
        except sqlite3.OperationalError as exc: errors.append(str(exc)); batch = []
        if batch: candidates, retrieval_mode, used_query = batch, mode, expression; break
    ranked = []; specific_names = {c["name"] for c in concepts if c["specificity"] >= 4}; total_weight = sum(c["specificity"] for c in concepts) or 1
    for index, candidate in enumerate(candidates):
        text_norm = normalize_text(_passage_text(candidate)); chapter_norm = normalize_text(candidate.get("chapter", "")); matched_concepts = []; matched_terms = []; matched_weight = 0; matched_specific = False
        for concept in concepts:
            concept_terms = [term for term in concept["terms"] if _term_matches(text_norm, term)]
            if concept_terms:
                matched_concepts.append(concept["name"]); matched_terms.extend(concept_terms); matched_weight += concept["specificity"]
                if concept["name"] in specific_names: matched_specific = True
        raw_hits = [term for term in raw_terms if _term_matches(text_norm, term)]; matched_terms.extend(raw_hits); matched_terms = list(dict.fromkeys(matched_terms))
        if concepts:
            if not matched_concepts or (specific_names and not matched_specific): continue
        elif raw_terms and not raw_hits: continue
        weighted_coverage = matched_weight / total_weight if concepts else (1.0 if raw_hits else 0.0); chapter_hits = sum(1 for term in matched_terms if _term_matches(chapter_norm, term)); rank_bonus = max(0, 16 - index // 10)
        relevance = 18 + round(50 * weighted_coverage) + min(16, len(matched_terms) * 2) + min(10, chapter_hits * 3) + rank_bonus + (6 if specific_names and matched_specific else 0)
        if discipline:
            wanted, actual = normalize_text(discipline), normalize_text(candidate.get("discipline", ""))
            if wanted and wanted not in {"auto", "automatique", "all", "tous", "toutes"} and wanted not in actual: relevance -= 10
        if madhhab and normalize_text(madhhab) not in {"", "all", "tous", "toutes", "toutes les ecoles"}:
            wanted, actual = normalize_text(madhhab), normalize_text(candidate.get("madhhab", ""))
            if wanted and wanted not in actual: relevance -= 8
        ranked.append({"id": candidate["id"], "book_id": candidate["book_id"], "title": candidate.get("title") or "", "title_ar": candidate.get("title_ar") or "", "author": candidate.get("author") or "", "discipline": candidate.get("discipline") or "", "madhhab": candidate.get("madhhab") or "", "page": candidate.get("page"), "chapter": candidate.get("chapter") or "", "text_ar": _trim(candidate.get("text_ar") or ""), "text_fr": _trim(candidate.get("text_fr") or ""), "translation_status": candidate.get("translation_status") or "", "source_url": candidate.get("source_url") or "", "relevance": max(1, min(98, relevance)), "matched_concepts": matched_concepts, "matched_terms": matched_terms[:16]})
    ranked.sort(key=lambda item: (item["relevance"], len(item["matched_concepts"]), len(item["matched_terms"])), reverse=True)
    selected = []; seen = set()
    for item in ranked:
        key = (item["book_id"], item.get("page"), normalize_text(item.get("chapter", "")), normalize_text((item.get("text_ar") or item.get("text_fr") or "")[:180]))
        if key in seen: continue
        seen.add(key); selected.append(item)
        if len(selected) >= max(1, min(int(limit), 20)): break
    for index, item in enumerate(selected, 1): item["citation_id"] = f"S{index}"
    analysis = {"engine": "rag-v5-hybrid-multilingual", "routed_book": ({"id": routed_book.get("id"), "title": routed_book.get("title"), "author": routed_book.get("author"), "reason": routed_book.get("route_reason"), "score": routed_book.get("route_score")} if routed_book else None), "concepts": [c["name"] for c in concepts], "concept_details": [{"name": c["name"], "specificity": c["specificity"], "matched_triggers": c["matched_triggers"]} for c in concepts], "raw_terms": raw_terms, "retrieval_mode": retrieval_mode, "fts_query": used_query, "candidate_count": len(candidates), "errors": errors, "semantic_embeddings": False}
    return {"query": query, "analysis": analysis, "sources": selected, "count": len(selected)}


def ask(connection: sqlite3.Connection, query: str, *, limit: int = 8, madhhab: str = "", discipline: str = "") -> dict[str, Any]:
    result = search(connection, query, limit=limit, madhhab=madhhab, discipline=discipline); sources = result["sources"]; claims = []
    for source in sources[:4]:
        text = source.get("text_fr") or source.get("text_ar") or ""
        if text: claims.append({"id": f"C{len(claims)+1}", "text": _trim(text, 700), "source_ids": [source["citation_id"]], "kind": "direct_excerpt", "relevance": source["relevance"]})
    if not sources: summary, verdict = "Aucun passage suffisamment pertinent n'a été retrouvé pour cette formulation. Le moteur ne fabrique pas de réponse sans preuve.", "insufficient"
    elif result["analysis"]["routed_book"]: summary, verdict = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans l'ouvrage demandé.", "evidence_found"
    else: summary, verdict = f"{len(sources)} passage(s) pertinent(s) retrouvé(s) dans le corpus.", "evidence_found"
    return {**result, "answer": {"mode": "evidence_only", "summary": summary, "verdict": verdict, "claims": claims, "warning": "Les scores indiquent une pertinence documentaire, pas un degré de certitude religieuse."}}
