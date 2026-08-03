from __future__ import annotations

import json
import os
import re
import sqlite3
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from core import SPACE, expand_query, normalize_text, search_chunks

ROOT = Path(__file__).resolve().parents[1]
EVALUATION_PATH = ROOT / "rag" / "evaluation_v2.json"

DISCIPLINE_RULES = {
    "Fiqh": ["statut", "autorisé", "interdit", "peut-on", "doit-on", "prière", "jeûne", "ablution", "tayammum", "voyage", "طهارة", "صلاة", "صيام", "حكم"],
    "Tafsīr": ["tafsir", "exégèse", "verset", "sourate", "coran", "تفسير", "آية", "سورة"],
    "Hadith": ["hadith", "sunna", "prophète", "حديث", "سنة"],
    "Sīra": ["sīra", "sira", "hégire", "badr", "hudaybiyya", "سيرة", "الهجرة"],
    "Uṣūl": ["uṣūl", "usul", "fondements", "coutume", "maslaha", "أصول", "العرف", "المصلحة"],
    "Langue arabe": ["racine", "mot arabe", "étymologie", "بلاغة", "جذر", "لغة"],
    "Sciences du hadith": ["isnad", "chaîne", "narrateur", "transmission", "إسناد", "راوي"],
}

TOPIC_RULES = {
    "voyage": ["voyage", "voyageur", "séjour", "safar", "سفر", "مسافر", "إقامة"],
    "prière": ["prière", "dhuhr", "asr", "isha", "sobh", "jumu", "salat", "صلاة", "ظهر", "عصر", "جمعة"],
    "purification": ["ablution", "wudu", "tayammum", "impureté", "طهارة", "وضوء", "تيمم", "نجاسة"],
    "jeûne": ["jeûne", "ramadan", "achoura", "صيام", "صوم", "فطر"],
    "intention": ["intention", "niyya", "نية"],
    "miséricorde": ["miséricorde", "rahma", "رحمة", "رحم"],
    "transmission": ["isnad", "chaîne", "narrateur", "transmission", "إسناد", "راوي"],
    "divergence": ["divergence", "différence", "quatre madhhabs", "compare", "اختلاف", "المذاهب"],
}

CONDITION_MARKERS = ["si ", "sauf", "à condition", "lorsque", "dans le cas", "إلا", "إذا", "بشرط", "عند"]
DIVERGENCE_MARKERS = ["diverge", "diffère", "contrairement", "cependant", "mais", "اختلاف", "خلاف", "وقيل", "أما"]


def _contains(text: str, values: list[str]) -> bool:
    normalized = normalize_text(text)
    return any(normalize_text(value) in normalized for value in values)


def analyze_question(query: str, requested_madhhab: str = "", requested_discipline: str = "") -> dict[str, Any]:
    normalized = normalize_text(query)
    language = "ar" if sum("\u0600" <= char <= "\u06ff" for char in query) >= 2 else "fr"

    discipline = requested_discipline.strip()
    if not discipline:
        scored = [(name, sum(1 for term in terms if normalize_text(term) in normalized)) for name, terms in DISCIPLINE_RULES.items()]
        discipline = max(scored, key=lambda item: item[1])[0] if max((score for _, score in scored), default=0) else "Recherche générale"

    madhhab = requested_madhhab.strip()
    if not madhhab:
        if _contains(query, ["malikite", "mālikite", "maliki", "مالكي", "مالك"]):
            madhhab = "Mālikite"
        elif _contains(query, ["quatre madhhabs", "comparer", "comparatif", "المذاهب", "اختلاف"]):
            madhhab = "Comparatif"
        else:
            madhhab = "Toutes les écoles"

    topics = [name for name, terms in TOPIC_RULES.items() if _contains(query, terms)]
    if not topics:
        topics = [term for term in expand_query(query)[:3]]

    question_type = "règle juridique" if discipline == "Fiqh" else "explication documentaire"
    if "divergence" in topics or madhhab == "Comparatif":
        question_type = "comparaison de positions"
    elif query.strip().lower().startswith(("qui ", "من ")):
        question_type = "identification"
    elif query.strip().lower().startswith(("pourquoi", "لماذا")):
        question_type = "explication causale"

    return {
        "language": language,
        "discipline": discipline,
        "madhhab": madhhab,
        "topics": topics,
        "question_type": question_type,
        "query_terms": expand_query(query),
    }


def _parse_json(value: Any) -> dict[str, Any]:
    if not value:
        return {}
    try:
        payload = json.loads(value) if isinstance(value, str) else value
        return payload if isinstance(payload, dict) else {}
    except (ValueError, TypeError):
        return {}


def _source_tier(item: dict[str, Any]) -> tuple[str, int]:
    discipline = normalize_text(item.get("discipline", ""))
    status = normalize_text(item.get("translation_status", ""))
    metadata = item.get("metadata", {})
    explicit = normalize_text(metadata.get("source_type", ""))

    if explicit in {"primary", "source primaire", "texte original"}:
        return "Source primaire", 12
    if "hadith" in discipline or "tafsir" in discipline or "fiqh" in discipline:
        return "Ouvrage classique", 9
    if status == "catalogue public":
        return "Notice de catalogue", -18
    return "Source documentaire", 4


def _verification_label(item: dict[str, Any]) -> tuple[str, int]:
    metadata = item.get("metadata", {})
    status = normalize_text(metadata.get("verification_status", "") or item.get("translation_status", ""))
    if any(term in status for term in ["valide", "verifie", "relue", "verified"]):
        return "Passage vérifié", 10
    if "catalogue" in status:
        return "Notice uniquement", -20
    if any(term in status for term in ["ai", "ia", "automatique", "unreviewed"]):
        return "Traduction non relue", -3
    return "Importé · à vérifier", 0


def _enrich_result(connection: sqlite3.Connection, result: dict[str, Any]) -> dict[str, Any]:
    row = connection.execute(
        """
        SELECT c.metadata_json AS chunk_metadata, b.metadata_json AS book_metadata,
               b.description, b.pages
        FROM chunks c JOIN books b ON b.id = c.book_id
        WHERE c.id = ?
        """,
        (result["id"],),
    ).fetchone()
    chunk_meta = _parse_json(row["chunk_metadata"] if row else "")
    book_meta = _parse_json(row["book_metadata"] if row else "")
    metadata = {**book_meta, **chunk_meta}
    enriched = {**result, "metadata": metadata}
    enriched["edition"] = metadata.get("edition", "Édition non renseignée")
    enriched["volume"] = metadata.get("volume")
    enriched["page_end"] = metadata.get("page_end") or result.get("page")
    enriched["source_type"], source_bonus = _source_tier(enriched)
    enriched["verification_status"], verification_bonus = _verification_label(enriched)
    enriched["authority_bonus"] = source_bonus + verification_bonus
    return enriched


def _semantic_bonus(query_terms: list[str], item: dict[str, Any]) -> int:
    fields = [item.get("title"), item.get("title_ar"), item.get("author"), item.get("chapter"), item.get("text_ar"), item.get("text_fr")]
    haystack = normalize_text(" ".join(str(value or "") for value in fields))
    hits = sum(1 for term in query_terms if term and term in haystack)
    phrase_bonus = 12 if len(query_terms) > 1 and " ".join(query_terms[:2]) in haystack else 0
    return min(28, hits * 4 + phrase_bonus)


def retrieve_evidence(
    connection: sqlite3.Connection,
    query: str,
    *,
    madhhab: str = "",
    discipline: str = "",
    limit: int = 12,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    analysis = analyze_question(query, madhhab, discipline)
    search_madhhab = "" if analysis["madhhab"] in {"Toutes les écoles", "Comparatif"} else analysis["madhhab"]
    search_discipline = "" if analysis["discipline"] in {"Recherche générale", "Fiqh comparé"} else analysis["discipline"]

    candidates = search_chunks(
        connection,
        query,
        madhhab=search_madhhab,
        discipline=search_discipline,
        limit=max(limit * 2, 20),
    )

    enriched: list[dict[str, Any]] = []
    for candidate in candidates:
        item = _enrich_result(connection, candidate)
        score = int(candidate.get("score") or 0)
        score += _semantic_bonus(analysis["query_terms"], item)
        score += int(item.get("authority_bonus") or 0)
        if analysis["madhhab"] == "Mālikite" and "malik" in normalize_text(item.get("madhhab", "")):
            score += 10
        if analysis["discipline"] != "Recherche générale" and normalize_text(analysis["discipline"]) in normalize_text(item.get("discipline", "")):
            score += 7
        item["score"] = max(1, min(100, score))
        item["has_substantive_text"] = len((item.get("text_ar") or "").strip()) >= 80 or len((item.get("text_fr") or "").strip()) >= 120
        enriched.append(item)

    enriched.sort(key=lambda item: (item["has_substantive_text"], item["score"]), reverse=True)
    selected = enriched[: max(1, min(limit, 20))]
    for index, item in enumerate(selected, start=1):
        item["citation_id"] = f"S{index}"
    return analysis, selected


def _sentences(text: str) -> list[str]:
    clean = SPACE.sub(" ", str(text or "")).strip()
    if not clean:
        return []
    pieces = re.split(r"(?<=[.!?؟؛])\s+|\n+", clean)
    return [piece.strip() for piece in pieces if len(piece.strip()) >= 45]


def _best_excerpt(item: dict[str, Any], terms: list[str]) -> str:
    text = item.get("text_fr") or item.get("text_ar") or ""
    sentences = _sentences(text)
    if not sentences:
        clean = SPACE.sub(" ", text).strip()
        return clean[:520] + ("…" if len(clean) > 520 else "")
    ranked = []
    for sentence in sentences:
        normalized = normalize_text(sentence)
        hits = sum(1 for term in terms if term in normalized)
        ranked.append((hits, min(len(sentence), 420), sentence))
    ranked.sort(key=lambda row: (row[0], row[1]), reverse=True)
    excerpt = ranked[0][2]
    return excerpt[:520] + ("…" if len(excerpt) > 520 else "")


def _coverage(results: list[dict[str, Any]]) -> dict[str, Any]:
    substantive = [item for item in results if item.get("has_substantive_text") and item.get("verification_status") != "Notice uniquement"]
    unique_books = len({item.get("book_id") for item in substantive})
    average = round(sum(item.get("score", 0) for item in substantive) / len(substantive)) if substantive else 0
    verified = sum(1 for item in substantive if item.get("verification_status") == "Passage vérifié")

    if len(substantive) >= 3 and unique_books >= 2 and average >= 68:
        verdict = "sufficient"
        label = "Couverture solide"
    elif substantive:
        verdict = "partial"
        label = "Couverture partielle"
    else:
        verdict = "insufficient"
        label = "Sources insuffisantes"

    score = min(100, len(substantive) * 15 + unique_books * 12 + max(0, average - 45) + verified * 5)
    return {
        "verdict": verdict,
        "label": label,
        "score": score,
        "substantive_passages": len(substantive),
        "unique_books": unique_books,
        "verified_passages": verified,
        "average_relevance": average,
    }


def _extractive_structure(query: str, analysis: dict[str, Any], results: list[dict[str, Any]]) -> dict[str, Any]:
    coverage = _coverage(results)
    substantive = [item for item in results if item.get("has_substantive_text") and item.get("verification_status") != "Notice uniquement"]
    claims = []
    for item in substantive[:4]:
        excerpt = _best_excerpt(item, analysis["query_terms"])
        if not excerpt:
            continue
        claims.append({
            "id": f"C{len(claims) + 1}",
            "title": "Passage documentaire" if len(claims) else "Passage principal",
            "text": excerpt,
            "kind": "direct_excerpt",
            "source_ids": [item["citation_id"]],
            "support": item["score"],
        })

    conditions = []
    divergences = []
    for claim in claims:
        normalized = normalize_text(claim["text"])
        if any(normalize_text(marker) in normalized for marker in CONDITION_MARKERS):
            conditions.append({**claim, "title": "Condition repérée"})
        if any(normalize_text(marker) in normalized for marker in DIVERGENCE_MARKERS):
            divergences.append({**claim, "title": "Divergence ou nuance repérée"})

    if coverage["verdict"] == "insufficient":
        summary = "Le corpus actuellement indexé ne contient pas encore de passage substantiel suffisant pour répondre à cette question sans extrapoler."
    elif coverage["verdict"] == "partial":
        summary = "Athar a retrouvé des passages utiles, mais la couverture reste partielle. La réponse ci-dessous doit être lue comme un dossier documentaire à vérifier dans les ouvrages."
    else:
        summary = "Plusieurs passages concordants ont été retrouvés. Athar les présente séparément afin que chaque affirmation reste vérifiable dans sa source."

    limits = []
    if not substantive:
        limits.append("Aucun texte substantiel n’est encore indexé pour cette question.")
    if coverage["unique_books"] < 2:
        limits.append("La réponse repose sur moins de deux ouvrages distincts.")
    if any(item.get("verification_status") == "Traduction non relue" for item in substantive):
        limits.append("Au moins une traduction utilisée n’a pas encore été relue par Athar.")
    if any(item.get("translation_status") == "catalogue_public" for item in results):
        limits.append("Certaines correspondances proviennent uniquement de notices de catalogue et ne soutiennent aucune conclusion juridique.")
    if not limits:
        limits.append("La synthèse reste documentaire et ne remplace pas la consultation du passage complet ni d’un enseignant qualifié.")

    return {
        "summary": summary,
        "claims": claims,
        "conditions": conditions[:3],
        "divergences": divergences[:3],
        "limits": limits,
        "coverage": coverage,
        "answer_mode": "citation_first_extractive",
    }


def _ollama_structure(query: str, analysis: dict[str, Any], results: list[dict[str, Any]]) -> dict[str, Any] | None:
    model = os.getenv("ATHAR_OLLAMA_MODEL", "").strip()
    if not model:
        return None
    substantive = [item for item in results if item.get("has_substantive_text")][:8]
    if not substantive:
        return None

    sources = []
    for item in substantive:
        sources.append({
            "id": item["citation_id"],
            "title": item.get("title"),
            "author": item.get("author"),
            "chapter": item.get("chapter"),
            "page": item.get("page"),
            "arabic": item.get("text_ar"),
            "french": item.get("text_fr"),
            "translation_status": item.get("translation_status"),
        })

    prompt = f"""
Tu es la couche de synthèse citation-first d'Athar Pro.
Réponds uniquement à partir des sources JSON fournies. Retourne strictement un objet JSON, sans markdown :
{{
  "summary": "résumé prudent",
  "claims": [{{"title":"...","text":"...","kind":"paraphrase|synthesis","source_ids":["S1"],"support":0-100}}],
  "conditions": [{{"title":"...","text":"...","source_ids":["S1"]}}],
  "divergences": [{{"title":"...","text":"...","source_ids":["S1","S2"]}}],
  "limits": ["..."]
}}
Règles : aucune information extérieure, aucune référence inventée, chaque claim doit avoir au moins une source_ids valide, ne masque aucune divergence, indique l'insuffisance du corpus.
Question : {query}
Analyse : {json.dumps(analysis, ensure_ascii=False)}
Sources : {json.dumps(sources, ensure_ascii=False)}
""".strip()

    endpoint = os.getenv("ATHAR_OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/") + "/api/generate"
    request = urllib.request.Request(
        endpoint,
        data=json.dumps({"model": model, "prompt": prompt, "stream": False, "format": "json"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            outer = json.loads(response.read().decode("utf-8"))
        payload = json.loads(str(outer.get("response") or "{}"))
    except (urllib.error.URLError, TimeoutError, ValueError, json.JSONDecodeError):
        return None

    valid_ids = {item["citation_id"] for item in substantive}
    claims = []
    for index, claim in enumerate(payload.get("claims") or []):
        source_ids = [source_id for source_id in claim.get("source_ids", []) if source_id in valid_ids]
        text = str(claim.get("text") or "").strip()
        if not text or not source_ids:
            continue
        claims.append({
            "id": f"C{index + 1}",
            "title": str(claim.get("title") or "Affirmation sourcée"),
            "text": text,
            "kind": str(claim.get("kind") or "synthesis"),
            "source_ids": source_ids,
            "support": max(1, min(int(claim.get("support") or 70), 100)),
        })
    if not claims:
        return None

    def clean_sections(name: str) -> list[dict[str, Any]]:
        cleaned = []
        for item in payload.get(name) or []:
            ids = [source_id for source_id in item.get("source_ids", []) if source_id in valid_ids]
            text = str(item.get("text") or "").strip()
            if text and ids:
                cleaned.append({"title": str(item.get("title") or name.title()), "text": text, "source_ids": ids})
        return cleaned[:4]

    return {
        "summary": str(payload.get("summary") or "Synthèse fondée sur les passages retrouvés."),
        "claims": claims[:6],
        "conditions": clean_sections("conditions"),
        "divergences": clean_sections("divergences"),
        "limits": [str(item) for item in (payload.get("limits") or []) if str(item).strip()][:5],
        "coverage": _coverage(results),
        "answer_mode": "ollama_citation_first",
    }


def answer_question_v2(
    connection: sqlite3.Connection,
    query: str,
    *,
    madhhab: str = "Mālikite",
    discipline: str = "",
    limit: int = 12,
) -> dict[str, Any]:
    analysis, results = retrieve_evidence(
        connection,
        query,
        madhhab=madhhab,
        discipline=discipline,
        limit=limit,
    )
    answer = _ollama_structure(query, analysis, results) or _extractive_structure(query, analysis, results)
    source_ids = {item["citation_id"] for item in results}
    cited_ids = {source_id for claim in answer["claims"] for source_id in claim.get("source_ids", [])}
    audit = {
        "all_claims_cited": bool(answer["claims"]) and all(claim.get("source_ids") for claim in answer["claims"]),
        "valid_source_ids": cited_ids.issubset(source_ids),
        "claim_count": len(answer["claims"]),
        "cited_source_count": len(cited_ids),
    }
    return {
        "query": query,
        "analysis": analysis,
        "answer": answer,
        "sources": results,
        "citation_audit": audit,
        "count": len(results),
    }


def corpus_status_v2(connection: sqlite3.Connection) -> dict[str, Any]:
    books = connection.execute("SELECT COUNT(*) FROM books").fetchone()[0]
    chunks = connection.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
    pages = connection.execute("SELECT COUNT(DISTINCT book_id || ':' || COALESCE(page, -1)) FROM chunks").fetchone()[0]
    substantive = connection.execute(
        "SELECT COUNT(*) FROM chunks WHERE LENGTH(COALESCE(text_ar,'')) >= 80 OR LENGTH(COALESCE(text_fr,'')) >= 120"
    ).fetchone()[0]
    catalogue = connection.execute("SELECT COUNT(*) FROM chunks WHERE translation_status = 'catalogue_public'").fetchone()[0]
    translations = connection.execute(
        "SELECT translation_status, COUNT(*) AS count FROM chunks GROUP BY translation_status ORDER BY count DESC"
    ).fetchall()
    book_rows = connection.execute(
        """
        SELECT b.id, b.title, b.title_ar, b.author, b.discipline, b.madhhab, b.pages,
               b.source_url, COUNT(c.id) AS chunks,
               COUNT(DISTINCT c.page) AS indexed_pages,
               MAX(c.scraped_at) AS last_sync
        FROM books b LEFT JOIN chunks c ON c.book_id = b.id
        GROUP BY b.id ORDER BY chunks DESC, b.title ASC
        """
    ).fetchall()
    return {
        "version": "2.0",
        "books": books,
        "chunks": chunks,
        "pages": pages,
        "substantive_passages": substantive,
        "catalogue_notices": catalogue,
        "translation_statuses": [{"status": row["translation_status"], "count": row["count"]} for row in translations],
        "corpus": [dict(row) for row in book_rows],
        "readiness": min(100, substantive * 2 + books * 4),
        "target_books": 25,
        "target_evaluation_questions": 200,
    }


def evaluation_status_v2() -> dict[str, Any]:
    try:
        payload = json.loads(EVALUATION_PATH.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        payload = {"version": "2.0", "cases": []}
    cases = payload.get("cases") or []
    disciplines: dict[str, int] = {}
    for case in cases:
        name = str(case.get("discipline") or "Autre")
        disciplines[name] = disciplines.get(name, 0) + 1
    return {
        "version": payload.get("version", "2.0"),
        "cases": len(cases),
        "target": 200,
        "progress": round((len(cases) / 200) * 100),
        "disciplines": disciplines,
        "items": cases,
    }
