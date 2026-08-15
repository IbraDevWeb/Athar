from __future__ import annotations

import argparse
import csv
import io
import json
from collections import Counter
from pathlib import Path
from typing import Any

import requests

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
SOURCES_PATH = RAG_DIR / "corpus_sources.json"
POLICY_PATH = RAG_DIR / "corpus_policy.json"

REQUIRED_COLUMNS = {
    "version_uri",
    "language",
    "uncorrected_OCR",
    "author_ar",
    "author_lat",
    "book",
    "title_ar",
    "title_lat",
    "status",
    "char_length",
    "local_path",
    "tags",
}

SUBJECT_RULES: dict[str, dict[str, Any]] = {
    "fiqh": {
        "label": "Fiqh",
        "weight": 8,
        "terms": (
            "fiqh", "فقه", "الفقه", "ahkam", "aḥkām", "احكام", "أحكام", "fatawa", "fatāwā", "فتاوى",
            "masa il", "masail", "مسائل", "faraid", "فرائض", "nikah", "نكاح", "zakat", "زكاة", "salat", "صلاة",
        ),
    },
    "hadith": {
        "label": "Hadith",
        "weight": 7,
        "terms": (
            "hadith", "حديث", "sahih", "ṣaḥīḥ", "صحيح", "sunan", "سنن", "musnad", "مسند", "muwatta", "موطأ",
            "jami", "jāmi", "جامع", "athar", "آثار", "asar", "riwaya", "رواية",
        ),
    },
    "tafsir": {
        "label": "Tafsīr",
        "weight": 7,
        "terms": ("tafsir", "tafsīr", "تفسير", "ta wil", "taʾwil", "تأويل", "ulum quran", "علوم القرآن"),
    },
    "usul": {
        "label": "Uṣūl et qawāʿid",
        "weight": 6,
        "terms": (
            "usul", "uṣūl", "اصول", "أصول", "qawaid", "qawāid", "قواعد", "maqasid", "maqāṣid", "مقاصد",
            "furuq", "furūq", "فروق", "ijma", "ijmā", "إجماع", "qiyas", "قياس",
        ),
    },
    "aqida": {
        "label": "ʿAqīda",
        "weight": 5,
        "terms": (
            "aqida", "aqīda", "عقيدة", "tawhid", "tawḥid", "توحيد", "iman", "īmān", "ايمان", "إيمان",
            "sifat", "صفات", "itiqad", "اعتقاد",
        ),
    },
    "sira": {
        "label": "Sīra et histoire",
        "weight": 3,
        "terms": ("sira", "sīra", "سيرة", "maghazi", "maghāzī", "مغازي", "tarikh", "tārīkh", "تاريخ", "tabaqat", "طبقات"),
    },
}


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def source_config() -> dict[str, Any]:
    source = (load_json(SOURCES_PATH).get("sources") or {}).get("openiti") or {}
    if not isinstance(source, dict) or not source.get("enabled"):
        raise RuntimeError("La source OpenITI n'est pas activée dans corpus_sources.json.")
    return source


def metadata_url(config: dict[str, Any] | None = None) -> str:
    config = config or source_config()
    repository = str(config["repository"]).rstrip("/")
    ref = str(config["release_ref"])
    path = str(config["metadata_path"]).lstrip("/")
    if repository != "https://github.com/OpenITI/RELEASE":
        raise RuntimeError("Dépôt OpenITI inattendu dans le registre des sources.")
    return f"https://raw.githubusercontent.com/OpenITI/RELEASE/{ref}/{path}"


def fetch_metadata(url: str | None = None) -> str:
    target = url or metadata_url()
    response = requests.get(
        target,
        timeout=(10, 120),
        headers={"User-Agent": "AtharResearchCorpus/2.0", "Accept": "text/tab-separated-values,text/plain"},
    )
    response.raise_for_status()
    if len(response.content) > 32 * 1024 * 1024:
        raise RuntimeError("Le catalogue OpenITI dépasse la limite de sécurité de 32 MiB.")
    return response.content.decode("utf-8-sig")


def _clean(value: Any) -> str:
    return " ".join(str(value or "").replace("\u00a0", " ").split()).strip()


def _bool(value: Any) -> bool:
    return _clean(value).lower() in {"1", "true", "yes", "y"}


def _int(value: Any) -> int:
    try:
        return max(0, int(_clean(value) or 0))
    except ValueError:
        return 0


def _first_variant(value: Any) -> str:
    return _clean(str(value or "").split("::", 1)[0])


def quality_flags(tags: str) -> list[str]:
    upper = tags.upper()
    return [flag for flag in ("PRIMARY_VERSION", "CLEANED_VERSION", "NO_MAJOR_ISSUES", "PAGINATION") if flag in upper]


def classify_subject(row: dict[str, Any]) -> tuple[str, str, int]:
    haystack = " ".join(
        [
            str(row.get("book") or ""),
            str(row.get("title_ar") or ""),
            str(row.get("title_lat") or ""),
            str(row.get("tags") or ""),
        ]
    ).casefold()
    best_key = ""
    best_label = ""
    best_score = 0
    for key, rule in SUBJECT_RULES.items():
        hits = sum(1 for term in rule["terms"] if str(term).casefold() in haystack)
        if not hits:
            continue
        score = int(rule["weight"]) * 10 + min(hits, 5)
        if score > best_score:
            best_key = key
            best_label = str(rule["label"])
            best_score = score
    return best_key, best_label, best_score


def parse_metadata(text: str, *, policy: dict[str, Any] | None = None) -> dict[str, Any]:
    policy = policy or load_json(POLICY_PATH)
    promotion = policy.get("promotion") or {}
    reader = csv.DictReader(io.StringIO(text), delimiter="\t")
    fields = set(reader.fieldnames or [])
    missing = sorted(REQUIRED_COLUMNS - fields)
    if missing:
        raise RuntimeError("Colonnes OpenITI manquantes: " + ", ".join(missing))

    rows_seen = 0
    candidates: list[dict[str, Any]] = []
    rejected = Counter()
    for raw in reader:
        rows_seen += 1
        language = _clean(raw.get("language"))
        version_uri = _clean(raw.get("version_uri"))
        tags = _clean(raw.get("tags"))
        status = _clean(raw.get("status")).lower()
        char_length = _int(raw.get("char_length"))
        if language != "ara" or not version_uri.endswith("-ara1"):
            rejected["not_ara1"] += 1
            continue
        if promotion.get("exclude_uncorrected_ocr", True) and _bool(raw.get("uncorrected_OCR")):
            rejected["uncorrected_ocr"] += 1
            continue
        if promotion.get("require_primary", True) and status != "pri":
            rejected["not_primary"] += 1
            continue
        if promotion.get("require_cleaned", True) and "CLEANED_VERSION" not in tags.upper():
            rejected["not_cleaned"] += 1
            continue
        if char_length < int(promotion.get("min_source_chars") or 0):
            rejected["too_small"] += 1
            continue
        max_chars = int(promotion.get("max_source_chars_per_book") or 0)
        if max_chars and char_length > max_chars:
            rejected["too_large"] += 1
            continue
        subject, discipline, subject_score = classify_subject(raw)
        if not subject:
            rejected["outside_priority_subjects"] += 1
            continue
        local_path = _clean(raw.get("local_path"))
        work_uri = _clean(raw.get("book"))
        if not local_path or not work_uri:
            rejected["missing_path_or_work"] += 1
            continue
        flags = quality_flags(tags)
        candidates.append(
            {
                "version_uri": version_uri,
                "work_uri": work_uri,
                "path": local_path,
                "title": _first_variant(raw.get("title_lat")) or work_uri.rsplit(".", 1)[-1],
                "title_ar": _first_variant(raw.get("title_ar")),
                "author": _first_variant(raw.get("author_lat")) or _first_variant(raw.get("author_ar")),
                "author_ar": _first_variant(raw.get("author_ar")),
                "date_ah": _clean(raw.get("date")),
                "source_id": _clean(raw.get("id")),
                "status": status,
                "tags": tags,
                "quality_flags": flags,
                "char_length": char_length,
                "token_length": _int(raw.get("tok_length")),
                "subject": subject,
                "discipline": discipline,
                "subject_score": subject_score,
            }
        )

    # One deterministic primary version per work. Prefer explicit quality markers,
    # then the richest text, then URI lexical order for reproducibility.
    by_work: dict[str, list[dict[str, Any]]] = {}
    for row in candidates:
        by_work.setdefault(str(row["work_uri"]), []).append(row)
    selected: list[dict[str, Any]] = []
    for work_uri, versions in by_work.items():
        versions.sort(
            key=lambda item: (
                "PRIMARY_VERSION" in item["quality_flags"],
                "CLEANED_VERSION" in item["quality_flags"],
                "NO_MAJOR_ISSUES" in item["quality_flags"],
                int(item["char_length"]),
                str(item["version_uri"]),
            ),
            reverse=True,
        )
        selected.append(versions[0])
    selected.sort(key=lambda item: (str(item["subject"]), -int(item["subject_score"]), -int(item["char_length"]), str(item["version_uri"])))

    return {
        "version": 1,
        "source": "OpenITI/RELEASE",
        "release_ref": source_config()["release_ref"],
        "metadata_path": source_config()["metadata_path"],
        "rows_seen": rows_seen,
        "candidate_versions": len(candidates),
        "candidate_works": len(selected),
        "rejected": dict(sorted(rejected.items())),
        "subjects": dict(sorted(Counter(str(item["subject"]) for item in selected).items())),
        "candidates": selected,
    }


def write_catalog(payload: dict[str, Any], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Construit le catalogue de croissance OpenITI pour Athar.")
    parser.add_argument("--metadata", type=Path, help="TSV local facultatif (tests/offline).")
    parser.add_argument("--output", type=Path, default=RAG_DIR / "data" / "openiti_catalog.json")
    parser.add_argument("--stats-only", action="store_true")
    args = parser.parse_args()
    text = args.metadata.read_text(encoding="utf-8-sig") if args.metadata else fetch_metadata()
    payload = parse_metadata(text)
    if not args.stats_only:
        write_catalog(payload, args.output)
    summary = {key: payload[key] for key in ("source", "release_ref", "rows_seen", "candidate_versions", "candidate_works", "subjects", "rejected")}
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
