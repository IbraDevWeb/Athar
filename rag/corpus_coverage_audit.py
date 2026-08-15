from __future__ import annotations

import argparse
import json
import math
import re
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any

from corpus_shards import load_shardable_manifest

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
CHECKLIST_PATH = RAG_DIR / "corpus_reference_checklist.json"
RELEASE_PATH = RAG_DIR / "corpus_release_v3.json"
DEFAULT_JSON = RAG_DIR / "corpus_coverage_audit.json"
DEFAULT_MARKDOWN = RAG_DIR / "CORPUS_COVERAGE.md"

SUBJECT_LABELS = {
    "fiqh": "Fiqh",
    "hadith": "Hadith",
    "tafsir": "Tafsīr",
    "usul": "Uṣūl et qawāʿid",
    "aqida": "ʿAqīda",
    "sira": "Sīra et histoire",
    "other": "Autres",
}
SUNNI_SCHOOLS = ("Mālikite", "Ḥanafite", "Shāfiʿite", "Ḥanbalite")


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def _fold(value: object) -> str:
    text = unicodedata.normalize("NFKD", str(value or "").replace("ʿ", " ").replace("ʾ", " "))
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    text = re.sub(r"[\u064B-\u065F\u0670\u06D6-\u06ED]", "", text)
    text = text.replace("ـ", "")
    text = "".join(char.lower() if char.isalnum() else " " for char in text)
    return " ".join(text.split())


def classify_subject(book: dict[str, Any]) -> str:
    metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
    hinted = _fold((metadata or {}).get("classification_subject"))
    if hinted in {"fiqh", "hadith", "tafsir", "usul", "aqida", "sira"}:
        return hinted

    discipline = _fold(book.get("discipline"))
    rules = (
        ("tafsir", ("tafsir", "exegese", "quran")),
        ("hadith", ("hadith", "rijal", "transmission")),
        ("usul", ("usul", "qawaid", "maqasid")),
        ("aqida", ("aqida", "kalam", "croyance", "milal")),
        ("sira", ("sira", "histoire", "tarikh", "tabaqat", "biograph")),
        ("fiqh", ("fiqh", "jurisprud")),
    )
    for subject, markers in rules:
        if any(marker in discipline for marker in markers):
            return subject
    return "other"


def school_tags(value: object) -> list[str]:
    text = _fold(value)
    tags: list[str] = []
    aliases = (
        ("Mālikite", ("malik", "malikite")),
        ("Ḥanafite", ("hanaf", "hanafite")),
        ("Shāfiʿite", ("shafi", "shafic", "shafiite")),
        ("Ḥanbalite", ("hanbal", "hanbalite")),
        ("Ẓāhirite", ("zahir", "zahirite")),
    )
    for label, markers in aliases:
        if any(marker in text for marker in markers):
            tags.append(label)
    if "compar" in text:
        tags.append("Comparatif")
    if "transversal" in text:
        tags.append("Transversal")
    if "linguist" in text:
        tags.append("Linguistique")
    return tags or ["Non renseigné"]


def fiqh_related(book: dict[str, Any]) -> bool:
    discipline = _fold(book.get("discipline"))
    return classify_subject(book) == "fiqh" or "fiqh" in discipline or "jurisprud" in discipline


def _book_haystack(book: dict[str, Any]) -> str:
    values = [
        book.get("book_id"),
        book.get("title"),
        book.get("title_ar"),
        book.get("author"),
        book.get("openiti_uri"),
        book.get("work_uri"),
    ]
    return " | ".join(_fold(value) for value in values if value)


def match_reference(reference: dict[str, Any], books: list[dict[str, Any]]) -> dict[str, Any] | None:
    markers = [_fold(marker) for marker in reference.get("match_any") or [] if _fold(marker)]
    if not markers:
        return None
    for book in books:
        haystack = _book_haystack(book)
        if any(marker in haystack for marker in markers):
            return book
    return None


def rows(counter: Counter[str], total: int) -> list[dict[str, Any]]:
    return [
        {
            "label": label,
            "books": count,
            "share_pct": round((100 * count / total), 2) if total else 0.0,
        }
        for label, count in sorted(counter.items(), key=lambda item: (-item[1], item[0]))
    ]


def _school_gap(fiqh_schools: Counter[str]) -> dict[str, Any]:
    counts = {school: int(fiqh_schools.get(school, 0)) for school in SUNNI_SCHOOLS}
    known = [value for value in counts.values() if value > 0]
    median = sorted(known)[len(known) // 2] if known else 0
    return {
        "counts": counts,
        "missing_schools": [school for school, count in counts.items() if count == 0],
        "below_known_median": [school for school, count in counts.items() if count < median],
        "known_median_books": median,
        "spread_books": (max(known) - min(known)) if known else 0,
    }


def build_audit(
    books: list[dict[str, Any]],
    checklist: dict[str, Any],
    release: dict[str, Any] | None = None,
) -> dict[str, Any]:
    enabled = [book for book in books if isinstance(book, dict) and book.get("enabled", True)]
    total = len(enabled)
    if not total:
        raise RuntimeError("Aucun ouvrage actif à auditer.")

    subjects = Counter(SUBJECT_LABELS[classify_subject(book)] for book in enabled)
    exact_disciplines = Counter(str(book.get("discipline") or "Non renseigné").strip() or "Non renseigné" for book in enabled)
    all_schools: Counter[str] = Counter()
    fiqh_schools: Counter[str] = Counter()
    unknown_madhhab = 0
    for book in enabled:
        tags = school_tags(book.get("madhhab"))
        if tags == ["Non renseigné"]:
            unknown_madhhab += 1
        for tag in tags:
            all_schools[tag] += 1
            if fiqh_related(book):
                fiqh_schools[tag] += 1

    author_display: dict[str, str] = {}
    author_counts: Counter[str] = Counter()
    for book in enabled:
        display = str(book.get("author") or "Auteur non renseigné").strip() or "Auteur non renseigné"
        key = _fold(display)
        author_display.setdefault(key, display)
        author_counts[key] += 1
    top_authors = [
        {
            "author": author_display[key],
            "books": count,
            "share_pct": round(100 * count / total, 2),
        }
        for key, count in author_counts.most_common(20)
    ]
    concentration_threshold = max(5, math.ceil(total * 0.04))
    concentrated_authors = [row for row in top_authors if int(row["books"]) >= concentration_threshold]

    reference_rows: list[dict[str, Any]] = []
    for reference in checklist.get("works") or []:
        if not isinstance(reference, dict):
            continue
        matched = match_reference(reference, enabled)
        reference_rows.append(
            {
                "id": str(reference.get("id") or ""),
                "title": str(reference.get("title") or ""),
                "title_ar": str(reference.get("title_ar") or ""),
                "discipline": str(reference.get("discipline") or ""),
                "madhhab": str(reference.get("madhhab") or ""),
                "priority": str(reference.get("priority") or "P2"),
                "present": bool(matched),
                "matched_book_id": str((matched or {}).get("book_id") or ""),
                "matched_title": str((matched or {}).get("title") or ""),
            }
        )

    present_refs = [row for row in reference_rows if row["present"]]
    missing_refs = [row for row in reference_rows if not row["present"]]
    missing_p1 = [row for row in missing_refs if row["priority"] == "P1"]
    missing_by_school = Counter(row["madhhab"] or "Transversal" for row in missing_refs)
    missing_by_discipline = Counter(row["discipline"] or "Autres" for row in missing_refs)

    metadata = {
        "madhhab_known_books": total - unknown_madhhab,
        "madhhab_unknown_books": unknown_madhhab,
        "madhhab_known_pct": round(100 * (total - unknown_madhhab) / total, 2),
        "automatic_classification_books": sum(
            1
            for book in enabled
            if _fold(((book.get("metadata") or {}) if isinstance(book.get("metadata"), dict) else {}).get("classification_status"))
            == "automatic metadata hint"
        ),
        "books_without_discipline": sum(1 for book in enabled if not str(book.get("discipline") or "").strip()),
    }

    school_gap = _school_gap(fiqh_schools)
    next_priorities: list[dict[str, Any]] = []
    if missing_p1:
        next_priorities.append(
            {
                "priority": 1,
                "action": "Rechercher en priorité les références P1 absentes dans le catalogue OpenITI avant toute promotion générique.",
                "missing_reference_books": len(missing_p1),
            }
        )
    if school_gap["below_known_median"]:
        next_priorities.append(
            {
                "priority": 2,
                "action": "Rééquilibrer le fiqh vers les écoles sous la médiane actuelle, à qualité documentaire comparable.",
                "schools": school_gap["below_known_median"],
            }
        )
    if metadata["madhhab_unknown_books"]:
        next_priorities.append(
            {
                "priority": 3,
                "action": "Enrichir les métadonnées de madhhab des ouvrages déjà présents avant d'utiliser le compteur d'école comme vérité exhaustive.",
                "books": metadata["madhhab_unknown_books"],
            }
        )

    release = release or {}
    release_books = int(release.get("books") or total)
    return {
        "version": 1,
        "scope": {
            "audited_openiti_books": total,
            "production_books": release_books,
            "production_chunks": int(release.get("chunks") or 0),
            "production_shards": int(release.get("shard_count") or 0),
            "complementary_non_openiti_books_excluded": max(0, release_books - total),
            "note": "L'audit de couverture savante porte sur les manifestes OpenITI shardables. Les ouvrages complémentaires du shard core ne sont pas utilisés pour mesurer les écoles juridiques.",
        },
        "subjects": rows(subjects, total),
        "exact_disciplines": rows(exact_disciplines, total),
        "madhhab_all_books": rows(all_schools, total),
        "fiqh_madhhab": rows(fiqh_schools, sum(fiqh_schools.values())),
        "fiqh_school_gap": school_gap,
        "authors_top": top_authors,
        "author_concentration": {
            "threshold_books": concentration_threshold,
            "threshold_share_pct": round(100 * concentration_threshold / total, 2),
            "flagged": concentrated_authors,
        },
        "metadata_quality": metadata,
        "reference_checklist": {
            "total": len(reference_rows),
            "present": len(present_refs),
            "missing": len(missing_refs),
            "coverage_pct": round(100 * len(present_refs) / len(reference_rows), 2) if reference_rows else 0.0,
            "present_works": present_refs,
            "missing_works": missing_refs,
            "missing_p1": missing_p1,
            "missing_by_madhhab": rows(missing_by_school, len(missing_refs)),
            "missing_by_discipline": rows(missing_by_discipline, len(missing_refs)),
            "method_note": str(checklist.get("purpose") or ""),
        },
        "next_batch_priorities": next_priorities,
    }


def _table(headers: list[str], table_rows: list[list[object]]) -> str:
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join("---" for _ in headers) + "|"]
    out.extend("| " + " | ".join(str(cell) for cell in row) + " |" for row in table_rows)
    return "\n".join(out)


def render_markdown(audit: dict[str, Any]) -> str:
    scope = audit["scope"]
    metadata = audit["metadata_quality"]
    checklist = audit["reference_checklist"]
    gap = audit["fiqh_school_gap"]

    lines = [
        "# Audit de couverture du corpus Athar",
        "",
        "> Rapport généré automatiquement à partir des manifestes OpenITI réellement routés vers les shards de production.",
        "",
        "## Vue d’ensemble",
        "",
        f"- **{scope['audited_openiti_books']} ouvrages OpenITI** audités.",
        f"- **{scope['production_books']} ouvrages** et **{scope['production_chunks']} passages** annoncés par le manifeste de production.",
        f"- **{scope['production_shards']} shards** en production.",
        f"- **{scope['complementary_non_openiti_books_excluded']} ouvrage(s) complémentaire(s)** hors OpenITI exclus du calcul des écoles juridiques.",
        "",
        "## Disciplines",
        "",
        _table(
            ["Discipline normalisée", "Ouvrages", "Part"],
            [[row["label"], row["books"], f"{row['share_pct']} %"] for row in audit["subjects"]],
        ),
        "",
        "## Écoles juridiques",
        "",
        "Les chiffres ci-dessous utilisent uniquement les métadonnées explicitement présentes dans les manifestes. Un champ vide reste **non renseigné** : l’audit n’invente pas le madhhab d’un auteur.",
        "",
        _table(
            ["École / statut", "Ouvrages de fiqh associés"],
            [[school, gap["counts"].get(school, 0)] for school in SUNNI_SCHOOLS]
            + [["Non renseigné (fiqh)", next((row["books"] for row in audit["fiqh_madhhab"] if row["label"] == "Non renseigné"), 0)]],
        ),
        "",
        f"Écoles sous la médiane connue actuelle : **{', '.join(gap['below_known_median']) if gap['below_known_median'] else 'aucune'}**.",
        "",
        "## Auteurs les plus représentés",
        "",
        _table(
            ["Auteur", "Ouvrages", "Part du corpus"],
            [[row["author"], row["books"], f"{row['share_pct']} %"] for row in audit["authors_top"][:15]],
        ),
        "",
        f"Seuil de concentration automatique : **{audit['author_concentration']['threshold_books']} ouvrages**. Les auteurs au-dessus de ce seuil sont signalés pour revue, pas automatiquement considérés comme indésirables.",
        "",
        "## Qualité des métadonnées",
        "",
        f"- Madhhab renseigné : **{metadata['madhhab_known_books']} / {scope['audited_openiti_books']} ({metadata['madhhab_known_pct']} %)**.",
        f"- Madhhab non renseigné : **{metadata['madhhab_unknown_books']}**.",
        f"- Classification issue d’un indice automatique : **{metadata['automatic_classification_books']}**.",
        f"- Discipline absente : **{metadata['books_without_discipline']}**.",
        "",
        "## Grille d’ouvrages de référence",
        "",
        f"La grille éditoriale contient **{checklist['total']} références** : **{checklist['present']} présentes**, **{checklist['missing']} absentes**, soit **{checklist['coverage_pct']} %** de couverture de cette grille.",
        "",
        "### Références P1 absentes",
        "",
    ]
    missing_p1 = checklist["missing_p1"]
    if missing_p1:
        lines.extend(
            f"- **{row['title']}** — {row['discipline']} — {row['madhhab']}"
            for row in missing_p1
        )
    else:
        lines.append("- Aucune référence P1 absente selon la grille actuelle.")

    lines.extend(["", "## Priorités proposées pour le prochain lot", ""])
    for item in audit["next_batch_priorities"]:
        detail = ""
        if item.get("schools"):
            detail = " — " + ", ".join(item["schools"])
        if item.get("missing_reference_books") is not None:
            detail = f" — {item['missing_reference_books']} référence(s) P1 manquante(s)"
        if item.get("books") is not None:
            detail = f" — {item['books']} ouvrage(s) concerné(s)"
        lines.append(f"{item['priority']}. {item['action']}{detail}")

    lines.extend(
        [
            "",
            "## Méthode et limites",
            "",
            "- Les disciplines sont normalisées à partir des métadonnées Athar/OpenITI ; les catégories mixtes sont ramenées à une catégorie principale pour mesurer la couverture globale.",
            "- Les écoles juridiques ne sont jamais déduites automatiquement de la biographie d’un auteur : seules les métadonnées explicites sont comptées.",
            "- La grille d’ouvrages de référence est un outil de planification éditoriale. Elle ne prétend pas définir un canon religieux ni classer l’autorité des œuvres.",
            "- Une œuvre est considérée présente lorsqu’un marqueur bibliographique explicite de la grille correspond à son identifiant, son titre ou son URI OpenITI.",
            "",
        ]
    )
    return "\n".join(lines)


def generate(json_path: Path = DEFAULT_JSON, markdown_path: Path = DEFAULT_MARKDOWN) -> dict[str, Any]:
    manifest = load_shardable_manifest()
    books = [book for book in manifest.get("books") or [] if isinstance(book, dict)]
    checklist = load_json(CHECKLIST_PATH)
    release = load_json(RELEASE_PATH) if RELEASE_PATH.exists() else {}
    audit = build_audit(books, checklist, release)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    markdown_path.write_text(render_markdown(audit), encoding="utf-8")
    return audit


def main() -> int:
    parser = argparse.ArgumentParser(description="Audite la couverture disciplinaire et bibliographique du corpus Athar.")
    parser.add_argument("--json", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--markdown", type=Path, default=DEFAULT_MARKDOWN)
    args = parser.parse_args()
    json_path = args.json if args.json.is_absolute() else ROOT / args.json
    markdown_path = args.markdown if args.markdown.is_absolute() else ROOT / args.markdown
    audit = generate(json_path, markdown_path)
    print(
        json.dumps(
            {
                "openiti_books": audit["scope"]["audited_openiti_books"],
                "subjects": {row["label"]: row["books"] for row in audit["subjects"]},
                "fiqh_schools": audit["fiqh_school_gap"]["counts"],
                "madhhab_unknown": audit["metadata_quality"]["madhhab_unknown_books"],
                "reference_coverage_pct": audit["reference_checklist"]["coverage_pct"],
                "missing_p1": len(audit["reference_checklist"]["missing_p1"]),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
