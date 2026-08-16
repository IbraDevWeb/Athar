from __future__ import annotations

"""Evaluate V6.1, V6.3-C ANN and V6.3-C fused rankings on human qrels."""

import argparse
import json
import math
import random
from pathlib import Path
from statistics import mean
from typing import Any

SYSTEMS = ("v61", "v63c-ann", "v63c-fused")


def load_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise RuntimeError(f"JSON invalide: {path}")
    return data


def qrel_map(payload: dict[str, Any]) -> dict[str, dict[str, int]]:
    result: dict[str, dict[str, int]] = {}
    for case in payload.get("cases") or []:
        case_id = str(case.get("case_id") or "")
        if not case_id or case_id in result:
            raise RuntimeError(f"case_id qrels invalide: {case_id!r}")
        result[case_id] = {
            str(item.get("chunk_id") or ""): int(item.get("grade"))
            for item in case.get("judgements") or []
        }
    return result


def audit_map(payload: dict[str, Any]) -> dict[str, dict[str, list[str]]]:
    result: dict[str, dict[str, list[str]]] = {}
    for case in payload.get("cases") or []:
        case_id = str(case.get("case_id") or "")
        systems = case.get("systems") or {}
        result[case_id] = {
            name: [str(x) for x in systems.get(name) or [] if str(x)]
            for name in SYSTEMS
        }
    return result


def dcg(grades: list[int]) -> float:
    total = 0.0
    for idx, grade in enumerate(grades, 1):
        total += (2.0 ** int(grade) - 1.0) / math.log2(idx + 1.0)
    return total


def metrics_for(rank: list[str], judged: dict[str, int], k: int = 10) -> dict[str, float]:
    top = rank[:k]
    grades = [int(judged.get(chunk_id, 0)) for chunk_id in top]
    relevant = {chunk_id for chunk_id, grade in judged.items() if int(grade) >= 1}
    direct = {chunk_id for chunk_id, grade in judged.items() if int(grade) >= 2}
    hit_relevant = sum(chunk_id in relevant for chunk_id in top)
    hit_direct = sum(chunk_id in direct for chunk_id in top)
    ideal = sorted((int(g) for g in judged.values()), reverse=True)[:k]
    ideal_dcg = dcg(ideal)
    rr = 0.0
    for idx, chunk_id in enumerate(top, 1):
        if chunk_id in relevant:
            rr = 1.0 / idx
            break
    return {
        "precision_at_10": hit_relevant / max(1, len(top)),
        "recall_at_10": hit_relevant / max(1, len(relevant)),
        "direct_recall_at_10": hit_direct / max(1, len(direct)),
        "mrr": rr,
        "ndcg_at_10": dcg(grades) / ideal_dcg if ideal_dcg > 0 else 1.0,
    }


def aggregate(per_case: list[dict[str, float]]) -> dict[str, float]:
    keys = ("precision_at_10", "recall_at_10", "direct_recall_at_10", "mrr", "ndcg_at_10")
    return {key: round(mean(row[key] for row in per_case), 6) for key in keys}


def bootstrap_delta(
    left: list[float], right: list[float], *, samples: int = 5000, seed: int = 633
) -> dict[str, float]:
    if len(left) != len(right) or not left:
        raise RuntimeError("bootstrap impossible")
    rng = random.Random(seed)
    deltas: list[float] = []
    n = len(left)
    for _ in range(samples):
        idxs = [rng.randrange(n) for _ in range(n)]
        deltas.append(mean(right[i] - left[i] for i in idxs))
    deltas.sort()
    lo = deltas[int(0.025 * (samples - 1))]
    hi = deltas[int(0.975 * (samples - 1))]
    observed = mean(r - l for l, r in zip(left, right))
    return {"delta": round(observed, 6), "ci95_low": round(lo, 6), "ci95_high": round(hi, 6)}


def evaluate(qrels_path: Path, audit_path: Path, output_json: Path, output_md: Path) -> dict[str, Any]:
    qrels_payload = load_json(qrels_path)
    audit_payload = load_json(audit_path)
    qrels = qrel_map(qrels_payload)
    audit = audit_map(audit_payload)
    missing = sorted(set(qrels) - set(audit))
    if missing:
        raise RuntimeError(f"{len(missing)} cas qrels absents de l'audit: {missing[:8]}")

    per_system: dict[str, list[dict[str, float]]] = {name: [] for name in SYSTEMS}
    case_rows: list[dict[str, Any]] = []
    for case_id in sorted(qrels):
        row: dict[str, Any] = {"case_id": case_id}
        for system in SYSTEMS:
            metrics = metrics_for(audit[case_id].get(system, []), qrels[case_id])
            per_system[system].append(metrics)
            row[system] = metrics
        case_rows.append(row)

    aggregates = {name: aggregate(rows) for name, rows in per_system.items()}
    base_ndcg = [row["ndcg_at_10"] for row in per_system["v61"]]
    fused_ndcg = [row["ndcg_at_10"] for row in per_system["v63c-fused"]]
    base_recall = [row["recall_at_10"] for row in per_system["v61"]]
    fused_recall = [row["recall_at_10"] for row in per_system["v63c-fused"]]

    wins = losses = ties = 0
    for left, right in zip(base_ndcg, fused_ndcg):
        if right > left + 1e-12:
            wins += 1
        elif right < left - 1e-12:
            losses += 1
        else:
            ties += 1

    comparison = {
        "v63c_fused_vs_v61": {
            "ndcg_at_10": bootstrap_delta(base_ndcg, fused_ndcg),
            "recall_at_10": bootstrap_delta(base_recall, fused_recall, seed=634),
            "case_wins": wins,
            "case_losses": losses,
            "case_ties": ties,
        }
    }
    payload = {
        "version": "6.3-d-human-eval-1",
        "cases": len(qrels),
        "qrels_coverage": qrels_payload.get("coverage") or {},
        "agreement": qrels_payload.get("agreement") or {},
        "systems": aggregates,
        "comparison": comparison,
        "per_case": case_rows,
    }

    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    c = comparison["v63c_fused_vs_v61"]
    lines = [
        "# Athar V6.3-D — Human evaluation",
        "",
        f"- Cas évalués : **{len(qrels)}**",
        f"- NDCG@10 V6.1 : **{aggregates['v61']['ndcg_at_10']:.4f}**",
        f"- NDCG@10 V6.3-C fused : **{aggregates['v63c-fused']['ndcg_at_10']:.4f}**",
        f"- Δ NDCG@10 : **{c['ndcg_at_10']['delta']:+.4f}** "
        f"(IC95 {c['ndcg_at_10']['ci95_low']:+.4f} à {c['ndcg_at_10']['ci95_high']:+.4f})",
        f"- Recall@10 V6.1 : **{aggregates['v61']['recall_at_10']:.4f}**",
        f"- Recall@10 V6.3-C fused : **{aggregates['v63c-fused']['recall_at_10']:.4f}**",
        f"- Δ Recall@10 : **{c['recall_at_10']['delta']:+.4f}** "
        f"(IC95 {c['recall_at_10']['ci95_low']:+.4f} à {c['recall_at_10']['ci95_high']:+.4f})",
        f"- Cas gagnés / perdus / ex æquo : **{wins} / {losses} / {ties}**",
        "",
        "Le benchmark humain mesure la pertinence documentaire du retrieval, pas la justesse d'une conclusion religieuse.",
    ]
    output_md.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--qrels", type=Path, required=True)
    parser.add_argument("--audit", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-md", type=Path, required=True)
    parser.add_argument("--min-ndcg-delta", type=float)
    args = parser.parse_args()
    payload = evaluate(args.qrels, args.audit, args.output_json, args.output_md)
    delta = float(payload["comparison"]["v63c_fused_vs_v61"]["ndcg_at_10"]["delta"])
    print(json.dumps(payload["comparison"], ensure_ascii=False, indent=2))
    if args.min_ndcg_delta is not None and delta < float(args.min_ndcg_delta):
        raise SystemExit(
            f"V6.3-C non promue: delta NDCG@10 {delta:+.6f} < seuil {args.min_ndcg_delta:+.6f}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
