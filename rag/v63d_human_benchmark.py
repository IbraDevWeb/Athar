from __future__ import annotations

"""Evaluate V6.1 and V6.3-C on blind human qrels.

Ranking metrics are averaged only on questions for which the pooled human
judgements contain at least one relevant passage. Questions with no relevant
judged passage are reported separately, and designed negative cases from the
private audit are used to measure abstention only after the human review is
frozen.
"""

import argparse
import json
import math
import random
from pathlib import Path
from statistics import mean
from typing import Any

SYSTEMS = ("v61", "v63c-ann", "v63c-fused")
RANKING_KEYS = ("precision_at_10", "recall_at_10", "direct_recall_at_10", "mrr", "ndcg_at_10")


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
        judgements: dict[str, int] = {}
        for item in case.get("judgements") or []:
            chunk_id = str(item.get("chunk_id") or "")
            grade = int(item.get("grade"))
            if not chunk_id or grade not in {0, 1, 2} or chunk_id in judgements:
                raise RuntimeError(f"jugement invalide: {case_id}/{chunk_id}/{grade}")
            judgements[chunk_id] = grade
        if not judgements:
            raise RuntimeError(f"{case_id}: aucun jugement humain")
        result[case_id] = judgements
    return result


def audit_map(payload: dict[str, Any]) -> dict[str, dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for case in payload.get("cases") or []:
        case_id = str(case.get("case_id") or "")
        if not case_id or case_id in result:
            raise RuntimeError(f"case_id audit invalide: {case_id!r}")
        systems = case.get("systems") or {}
        result[case_id] = {
            "category": str(case.get("category") or ""),
            "expect_no_evidence": bool(case.get("expect_no_evidence")),
            "systems": {
                name: [str(x) for x in systems.get(name) or [] if str(x)]
                for name in SYSTEMS
            },
        }
    return result


def dcg(grades: list[int]) -> float:
    return sum(
        (2.0 ** int(grade) - 1.0) / math.log2(idx + 1.0)
        for idx, grade in enumerate(grades, 1)
    )


def metrics_for(rank: list[str], judged: dict[str, int], k: int = 10) -> dict[str, float | None]:
    relevant = {chunk_id for chunk_id, grade in judged.items() if int(grade) >= 1}
    if not relevant:
        raise ValueError("metrics_for exige au moins un passage humain pertinent")
    direct = {chunk_id for chunk_id, grade in judged.items() if int(grade) >= 2}
    top = rank[:k]
    grades = [int(judged.get(chunk_id, 0)) for chunk_id in top]
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
        "recall_at_10": hit_relevant / len(relevant),
        "direct_recall_at_10": (hit_direct / len(direct)) if direct else None,
        "mrr": rr,
        "ndcg_at_10": dcg(grades) / ideal_dcg if ideal_dcg > 0 else 0.0,
    }


def aggregate(per_case: list[dict[str, float | None]]) -> dict[str, float | None]:
    result: dict[str, float | None] = {}
    for key in RANKING_KEYS:
        values = [float(row[key]) for row in per_case if row.get(key) is not None]
        result[key] = round(mean(values), 6) if values else None
    return result


def bootstrap_delta(
    left: list[float], right: list[float], *, samples: int = 5000, seed: int = 633
) -> dict[str, float] | None:
    if len(left) != len(right):
        raise RuntimeError("bootstrap: séries incompatibles")
    if not left:
        return None
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
    return {
        "delta": round(observed, 6),
        "ci95_low": round(lo, 6),
        "ci95_high": round(hi, 6),
        "samples": samples,
    }


def evaluate(qrels_path: Path, audit_path: Path, output_json: Path, output_md: Path) -> dict[str, Any]:
    qrels_payload = load_json(qrels_path)
    audit_payload = load_json(audit_path)
    qrels = qrel_map(qrels_payload)
    audit = audit_map(audit_payload)
    missing = sorted(set(qrels) - set(audit))
    if missing:
        raise RuntimeError(f"{len(missing)} cas qrels absents de l'audit: {missing[:8]}")

    ranking_cases = [
        case_id for case_id in sorted(qrels)
        if any(int(grade) >= 1 for grade in qrels[case_id].values())
    ]
    no_relevant_cases = [case_id for case_id in sorted(qrels) if case_id not in set(ranking_cases)]
    direct_cases = [
        case_id for case_id in ranking_cases
        if any(int(grade) >= 2 for grade in qrels[case_id].values())
    ]
    designed_negatives = [
        case_id for case_id in sorted(qrels) if bool(audit[case_id]["expect_no_evidence"])
    ]
    confirmed_designed_negatives = [
        case_id for case_id in designed_negatives if case_id in set(no_relevant_cases)
    ]
    invalidated_designed_negatives = [
        case_id for case_id in designed_negatives if case_id in set(ranking_cases)
    ]

    per_system: dict[str, list[dict[str, float | None]]] = {name: [] for name in SYSTEMS}
    per_case_lookup: dict[str, dict[str, dict[str, float | None]]] = {}
    for case_id in ranking_cases:
        row: dict[str, dict[str, float | None]] = {}
        for system in SYSTEMS:
            metrics = metrics_for(audit[case_id]["systems"].get(system, []), qrels[case_id])
            per_system[system].append(metrics)
            row[system] = metrics
        per_case_lookup[case_id] = row

    aggregates = {name: aggregate(rows) for name, rows in per_system.items()}

    abstention: dict[str, dict[str, float | int | None]] = {}
    for system in SYSTEMS:
        confirmed_empty = [
            len(audit[case_id]["systems"].get(system, [])) == 0
            for case_id in confirmed_designed_negatives
        ]
        no_relevant_empty = [
            len(audit[case_id]["systems"].get(system, [])) == 0
            for case_id in no_relevant_cases
        ]
        abstention[system] = {
            "confirmed_designed_negative_cases": len(confirmed_empty),
            "abstention_rate_on_confirmed_designed_negatives": (
                round(sum(confirmed_empty) / len(confirmed_empty), 6) if confirmed_empty else None
            ),
            "human_no_relevant_pool_cases": len(no_relevant_empty),
            "empty_result_rate_on_human_no_relevant_pool": (
                round(sum(no_relevant_empty) / len(no_relevant_empty), 6) if no_relevant_empty else None
            ),
        }

    base_ndcg = [float(per_case_lookup[c]["v61"]["ndcg_at_10"] or 0.0) for c in ranking_cases]
    fused_ndcg = [float(per_case_lookup[c]["v63c-fused"]["ndcg_at_10"] or 0.0) for c in ranking_cases]
    base_recall = [float(per_case_lookup[c]["v61"]["recall_at_10"] or 0.0) for c in ranking_cases]
    fused_recall = [float(per_case_lookup[c]["v63c-fused"]["recall_at_10"] or 0.0) for c in ranking_cases]

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
            "ranking_cases": len(ranking_cases),
            "ndcg_at_10": bootstrap_delta(base_ndcg, fused_ndcg),
            "recall_at_10": bootstrap_delta(base_recall, fused_recall, seed=634),
            "case_wins": wins,
            "case_losses": losses,
            "case_ties": ties,
        }
    }

    case_rows: list[dict[str, Any]] = []
    for case_id in sorted(qrels):
        human_relevant = sum(int(grade) >= 1 for grade in qrels[case_id].values())
        human_direct = sum(int(grade) >= 2 for grade in qrels[case_id].values())
        case_rows.append(
            {
                "case_id": case_id,
                "category": audit[case_id]["category"],
                "designed_negative": bool(audit[case_id]["expect_no_evidence"]),
                "human_relevant_candidates": human_relevant,
                "human_direct_candidates": human_direct,
                "ranking_metrics_included": human_relevant > 0,
                "systems": per_case_lookup.get(case_id, {}),
                "result_counts": {
                    name: len(audit[case_id]["systems"].get(name, [])) for name in SYSTEMS
                },
            }
        )

    payload = {
        "version": "6.3-d-human-eval-2",
        "cases": len(qrels),
        "ranking_cases": len(ranking_cases),
        "direct_evidence_cases": len(direct_cases),
        "human_no_relevant_pool_cases": len(no_relevant_cases),
        "designed_negative_cases": len(designed_negatives),
        "human_confirmed_designed_negatives": len(confirmed_designed_negatives),
        "human_invalidated_designed_negatives": invalidated_designed_negatives,
        "qrels_coverage": qrels_payload.get("coverage") or {},
        "agreement": qrels_payload.get("agreement") or {},
        "systems": aggregates,
        "abstention": abstention,
        "comparison": comparison,
        "per_case": case_rows,
    }

    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    c = comparison["v63c_fused_vs_v61"]
    ndcg_delta = c["ndcg_at_10"]
    recall_delta = c["recall_at_10"]
    ndcg_text = (
        f"{ndcg_delta['delta']:+.4f} (IC95 {ndcg_delta['ci95_low']:+.4f} à {ndcg_delta['ci95_high']:+.4f})"
        if ndcg_delta else "n/a"
    )
    recall_text = (
        f"{recall_delta['delta']:+.4f} (IC95 {recall_delta['ci95_low']:+.4f} à {recall_delta['ci95_high']:+.4f})"
        if recall_delta else "n/a"
    )
    def fmt(value: Any) -> str:
        return "n/a" if value is None else f"{float(value):.4f}"

    lines = [
        "# Athar V6.3-D — Human evaluation",
        "",
        f"- Cas annotés : **{len(qrels)}**",
        f"- Cas avec ≥1 passage humain pertinent : **{len(ranking_cases)}**",
        f"- Cas sans passage pertinent dans le pool : **{len(no_relevant_cases)}**",
        f"- Cas négatifs conçus puis confirmés par le review : **{len(confirmed_designed_negatives)}/{len(designed_negatives)}**",
        f"- NDCG@10 V6.1 : **{fmt(aggregates['v61']['ndcg_at_10'])}**",
        f"- NDCG@10 V6.3-C fused : **{fmt(aggregates['v63c-fused']['ndcg_at_10'])}**",
        f"- Δ NDCG@10 : **{ndcg_text}**",
        f"- Recall@10 V6.1 : **{fmt(aggregates['v61']['recall_at_10'])}**",
        f"- Recall@10 V6.3-C fused : **{fmt(aggregates['v63c-fused']['recall_at_10'])}**",
        f"- Δ Recall@10 : **{recall_text}**",
        f"- Cas gagnés / perdus / ex æquo sur NDCG : **{wins} / {losses} / {ties}**",
        f"- Abstention V6.1 sur négatifs humains confirmés : **{fmt(abstention['v61']['abstention_rate_on_confirmed_designed_negatives'])}**",
        f"- Abstention V6.3-C fused sur négatifs humains confirmés : **{fmt(abstention['v63c-fused']['abstention_rate_on_confirmed_designed_negatives'])}**",
        "",
        "Les métriques de ranking excluent les questions sans passage pertinent dans le pool. Ces dernières sont analysées séparément afin de ne pas confondre qualité de classement et abstention.",
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
    comparison = payload["comparison"]["v63c_fused_vs_v61"]
    print(json.dumps({"comparison": comparison, "abstention": payload["abstention"]}, ensure_ascii=False, indent=2))
    if args.min_ndcg_delta is not None:
        ndcg = comparison.get("ndcg_at_10")
        if not ndcg:
            raise SystemExit("V6.3-C non promue: aucune question humaine pertinente pour mesurer NDCG.")
        delta = float(ndcg["delta"])
        if delta < float(args.min_ndcg_delta):
            raise SystemExit(
                f"V6.3-C non promue: delta NDCG@10 {delta:+.6f} < seuil {args.min_ndcg_delta:+.6f}"
            )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
