from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
POLICY_PATH = RAG_DIR / "corpus_policy.json"

USUL_STRONG_MARKERS = (
    "usul al-fiqh",
    "uṣūl al-fiqh",
    "usul fiqh",
    "uṣūl fiqh",
    "أصول الفقه",
    "اصول الفقه",
    "qiyas",
    "qiyās",
    "قياس",
    "ijma",
    "ijmā",
    "إجماع",
    "furuq",
    "furūq",
    "فروق",
    "maqasid al-sharia",
    "maqasid al-shari",
    "maqāṣid al-sharī",
    "مقاصد الشريعة",
)


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def _compact(value: Any) -> str:
    text = str(value or "").casefold()
    return re.sub(r"[^\w\u0600-\u06ff]+", " ", text, flags=re.UNICODE).strip()


def _haystack(candidate: dict[str, Any]) -> str:
    return " ".join(
        _compact(candidate.get(key))
        for key in ("title", "title_ar", "author", "author_ar", "work_uri", "version_uri", "source_id", "tags")
    )


def has_strong_usul_context(candidate: dict[str, Any]) -> bool:
    haystack = _haystack(candidate)
    compact_identifier = re.sub(r"[^a-z0-9]+", "", str(candidate.get("work_uri") or "").casefold())
    for marker in USUL_STRONG_MARKERS:
        normalized = _compact(marker)
        if normalized and normalized in haystack:
            return True
        latin_compact = re.sub(r"[^a-z0-9]+", "", marker.casefold())
        if latin_compact and latin_compact in compact_identifier:
            return True
    return False


def blocked_work_marker(candidate: dict[str, Any], markers: Any) -> str:
    haystack = _haystack(candidate)
    for marker in markers if isinstance(markers, list) else []:
        normalized = _compact(marker)
        if normalized and normalized in haystack:
            return str(marker)
        compact_marker = re.sub(r"[^a-z0-9]+", "", str(marker).casefold())
        compact_work = re.sub(r"[^a-z0-9]+", "", str(candidate.get("work_uri") or "").casefold())
        if compact_marker and compact_marker in compact_work:
            return str(marker)
    return ""


def guard_candidate(candidate: dict[str, Any], policy: dict[str, Any]) -> tuple[bool, str]:
    promotion = policy.get("promotion") or {}
    blocked = blocked_work_marker(candidate, promotion.get("excluded_work_markers") or [])
    if blocked:
        return False, f"excluded_work:{blocked}"
    if str(candidate.get("subject") or "") == "usul" and not has_strong_usul_context(candidate):
        return False, "ambiguous_usul_context"
    return True, ""


def guard_catalog(catalog: dict[str, Any], policy: dict[str, Any] | None = None) -> dict[str, Any]:
    policy = policy or load_json(POLICY_PATH)
    accepted: list[dict[str, Any]] = []
    rejected = Counter()
    for candidate in catalog.get("candidates") or []:
        if not isinstance(candidate, dict):
            continue
        ok, reason = guard_candidate(candidate, policy)
        if ok:
            accepted.append(candidate)
        else:
            rejected[reason] += 1
    subjects = Counter(str(item.get("subject") or "") for item in accepted if item.get("subject"))
    payload = dict(catalog)
    payload["pre_guard_candidate_works"] = int(catalog.get("candidate_works") or len(catalog.get("candidates") or []))
    payload["candidate_versions"] = len(accepted)
    payload["candidate_works"] = len(accepted)
    payload["subjects"] = dict(sorted(subjects.items()))
    payload["guard_rejected"] = dict(sorted(rejected.items()))
    payload["candidates"] = accepted
    payload["guard"] = "athar-scholarly-candidate-guard-v1"
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description="Filtre conservateur avant promotion automatique OpenITI.")
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    guarded = guard_catalog(load_json(args.input))
    args.output.write_text(json.dumps(guarded, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "guard": guarded["guard"],
                "before": guarded["pre_guard_candidate_works"],
                "after": guarded["candidate_works"],
                "subjects": guarded["subjects"],
                "guard_rejected": guarded["guard_rejected"],
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
