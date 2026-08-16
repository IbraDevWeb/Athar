from __future__ import annotations

import argparse
import json
import os
import sqlite3
import statistics
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

import v6_benchmark as v6
from v5_lowmem import ask as ask_monolithic
from v5_sharded import ShardedCorpusRuntime

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"


def clean_list(value: Any) -> list[str]:
    return [str(x).strip() for x in value] if isinstance(value, list) else []


def load_dataset(path: Path) -> dict[str, Any]:
    payload = v6.load_dataset(path)
    accepted = set((payload.get("gold_policy") or {}).get("accepted_statuses") or [])
    for case in payload["cases"]:
        chunks = clean_list(case.get("gold_chunk_ids"))
        if chunks and str(case.get("gold_status") or "") not in accepted:
            raise RuntimeError(f"{case['id']}: gold_chunk_ids sans gold_status valide")
    return payload


def snapshot(source: dict[str, Any], rank: int) -> dict[str, Any]:
    text = " ".join(str(source.get("text_fr") or source.get("text_ar") or "").split())
    return {
        "rank": rank, "chunk_id": str(source.get("id") or ""),
        "book_id": str(source.get("book_id") or ""),
        "title": str(source.get("title") or ""), "author": str(source.get("author") or ""),
        "madhhab": str(source.get("madhhab") or ""), "discipline": str(source.get("discipline") or ""),
        "page": source.get("page"), "chapter": str(source.get("chapter") or ""),
        "source_url": str(source.get("source_url") or ""), "excerpt": text[:420],
    }


def first_rank(values: list[str], gold: set[str]) -> int | None:
    return next((i for i, value in enumerate(values, 1) if value in gold), None)


def purity(sources: list[dict[str, Any]], field: str, expected: str) -> float | None:
    expected = str(expected or "").strip()
    if not expected:
        return None
    if not sources:
        return 0.0
    return round(sum(v6._matches(str(s.get(field) or ""), expected) for s in sources) / len(sources), 4)


def evaluate(case: dict[str, Any], ask_fn: Callable[..., dict[str, Any]], limit: int) -> dict[str, Any]:
    start = time.perf_counter()
    error = ""
    try:
        payload = ask_fn(
            str(case["question"]), limit=limit,
            madhhab=str(case.get("madhhab") or ""),
            discipline=str(case.get("discipline") or ""),
        )
    except Exception as exc:
        payload = {"sources": [], "analysis": {}, "answer": {}}
        error = f"{type(exc).__name__}: {exc}"
    latency = (time.perf_counter() - start) * 1000
    sources = list(payload.get("sources") or [])
    analysis = dict(payload.get("analysis") or {})
    groups = [g for g in case.get("expected_term_groups", []) if isinstance(g, list) and g]
    group_hits, group_ranks = v6._group_hits(sources, groups)
    group_recall = sum(group_hits) / len(group_hits) if group_hits else 1.0
    relevant_rank = v6._first_relevant_rank(sources, groups)
    concepts = clean_list(case.get("expected_concepts"))
    concept_recall, missing = v6._concept_recall(analysis, concepts)
    route_expected = str(case.get("expected_route_contains") or "")
    route_ok, routed_label = (True, "")
    if route_expected:
        route_ok, routed_label = v6._route_match(analysis, route_expected)
    citation_ok, citation_errors = v6._citation_integrity(payload)
    expect_none = bool(case.get("expect_no_evidence"))
    evidence_ok = (not sources) if expect_none else bool(sources)

    source_ids = [str(s.get("id") or "") for s in sources]
    book_ids = [str(s.get("book_id") or "") for s in sources]
    gold_chunks = set(clean_list(case.get("gold_chunk_ids")))
    gold_books = set(clean_list(case.get("gold_book_ids")))
    chunk_rank = first_rank(source_ids, gold_chunks) if gold_chunks else None
    book_rank = first_rank(book_ids, gold_books) if gold_books else None

    return {
        "id": case["id"], "category": case.get("category", "other"), "question": case["question"],
        "soft": bool(case.get("soft")), "error": error, "latency_ms": round(latency, 2),
        "source_count": len(sources), "source_ids": source_ids, "source_book_ids": book_ids,
        "top_sources": [snapshot(s, i) for i, s in enumerate(sources[:3], 1)],
        "evidence_ok": evidence_ok, "expect_no_evidence": expect_none,
        "group_recall": round(group_recall, 4), "group_hits": group_hits,
        "group_first_ranks": group_ranks, "first_relevant_rank": relevant_rank,
        "reciprocal_rank": round(1 / relevant_rank, 4) if relevant_rank else 0.0,
        "concept_recall": round(concept_recall, 4), "missing_concepts": missing,
        "route_expected": route_expected, "route_ok": route_ok, "routed_label": routed_label,
        "citation_integrity": citation_ok, "citation_errors": citation_errors,
        "provenance_rate": round(v6._provenance_rate(sources), 4),
        "retrieval_mode": analysis.get("retrieval_mode"), "storage_mode": analysis.get("storage_mode"),
        "candidate_count": int(analysis.get("candidate_count") or 0),
        "semantic_embeddings": bool(analysis.get("semantic_embeddings")),
        "gold_chunk_ids": sorted(gold_chunks), "gold_status": str(case.get("gold_status") or ""),
        "gold_chunk_recall_at_k": round(sum(x in gold_chunks for x in source_ids) / len(gold_chunks), 4) if gold_chunks else None,
        "gold_chunk_first_rank": chunk_rank, "gold_chunk_mrr": round(1 / chunk_rank, 4) if chunk_rank else (0.0 if gold_chunks else None),
        "gold_book_ids": sorted(gold_books), "gold_book_hit_at_k": book_rank is not None if gold_books else None,
        "gold_book_first_rank": book_rank, "gold_book_mrr": round(1 / book_rank, 4) if book_rank else (0.0 if gold_books else None),
        "madhhab_purity": purity(sources, "madhhab", case.get("expected_source_madhhab_contains", "")),
    }


def mean(values: list[float]) -> float | None:
    return round(statistics.fmean(values), 4) if values else None


def aggregate(results: list[dict[str, Any]]) -> dict[str, Any]:
    base = v6.aggregate(results)
    hard = [x for x in results if not x["soft"]]
    chunk = [x for x in hard if x["gold_chunk_ids"]]
    books = [x for x in hard if x["gold_book_ids"]]
    madhhab = [x for x in hard if x["madhhab_purity"] is not None]
    cats: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for x in hard:
        cats[x["category"]].append(x)
    base.update({
        "gold_chunk_cases": len(chunk),
        "gold_chunk_recall_at_k": mean([x["gold_chunk_recall_at_k"] for x in chunk]),
        "gold_chunk_mrr": mean([x["gold_chunk_mrr"] for x in chunk]),
        "gold_book_cases": len(books),
        "gold_book_hit_at_k": mean([1.0 if x["gold_book_hit_at_k"] else 0.0 for x in books]),
        "gold_book_mrr": mean([x["gold_book_mrr"] for x in books]),
        "madhhab_filter_cases": len(madhhab),
        "madhhab_purity_at_k": mean([x["madhhab_purity"] for x in madhhab]),
        "category_metrics": {
            cat: {
                "cases": len(rows),
                "failures": sum(
                    bool(r["error"] or not r["evidence_ok"] or r["group_recall"] < 1 or
                         not r["route_ok"] or not r["citation_integrity"] or
                         r["gold_book_hit_at_k"] is False or
                         (r["madhhab_purity"] is not None and r["madhhab_purity"] < 1))
                    for r in rows
                ),
            }
            for cat, rows in sorted(cats.items())
        },
    })
    return base


def markdown(report: dict[str, Any]) -> str:
    m = report["metrics"]
    pct = lambda x: "—" if x is None else f"{x:.1%}"
    lines = [
        "# Athar Research — Benchmark V6.1 étendu", "",
        f"- Dataset : `{report['dataset_version']}` — **{m['cases']} cas**",
        f"- Runtime : `{report['runtime']}`",
        f"- Score composite V6 : **{m['composite_score_100']} / 100**", "",
        "| Métrique | Valeur |", "|---|---:|",
        f"| Evidence rate | {pct(m['evidence_rate'])} |",
        f"| Abstention | {pct(m['abstention_rate'])} |",
        f"| Recall lexical@K | {pct(m['evidence_group_recall_at_k'])} |",
        f"| MRR lexical | {m['evidence_mrr']:.3f} |",
        f"| Routage ouvrage | {pct(m['route_accuracy'])} |",
        f"| Concepts | {pct(m['concept_recall'])} |",
        f"| Citations | {pct(m['citation_integrity_rate'])} |",
        f"| Provenance | {pct(m['provenance_rate'])} |",
        f"| Gold book Hit@K ({m['gold_book_cases']} cas) | {pct(m['gold_book_hit_at_k'])} |",
        f"| Gold chunk Recall@K ({m['gold_chunk_cases']} cas) | {pct(m['gold_chunk_recall_at_k'])} |",
        f"| Gold chunk MRR | {'—' if m['gold_chunk_mrr'] is None else f'{m['gold_chunk_mrr']:.3f}'} |",
        f"| Pureté madhhab@K ({m['madhhab_filter_cases']} cas) | {pct(m['madhhab_purity_at_k'])} |",
        f"| Latence p50 | {m['latency_ms']['p50']:.0f} ms |",
        f"| Latence p95 | {m['latency_ms']['p95']:.0f} ms |", "",
        "## Cas à examiner", "",
        "| Cas | Sources | Recall | Route | Gold book | Madhhab |",
        "|---|---:|---:|---:|---:|---:|",
    ]
    flagged = [r for r in report["results"] if (
        r["error"] or not r["evidence_ok"] or r["group_recall"] < 1 or not r["route_ok"] or
        not r["citation_integrity"] or r["gold_book_hit_at_k"] is False or
        (r["madhhab_purity"] is not None and r["madhhab_purity"] < 1) or
        (r["gold_chunk_recall_at_k"] is not None and r["gold_chunk_recall_at_k"] < 1)
    )]
    for r in flagged[:100]:
        gb = "—" if r["gold_book_hit_at_k"] is None else ("✓" if r["gold_book_hit_at_k"] else "✗")
        mp = "—" if r["madhhab_purity"] is None else f"{r['madhhab_purity']:.0%}"
        lines.append(f"| `{r['id']}` | {r['source_count']} | {r['group_recall']:.0%} | {'✓' if r['route_ok'] else '✗'} | {gb} | {mp} |")
    if not flagged:
        lines.append("| Aucun | — | — | — | — | — |")
    lines += ["", "Le score est technique. Le Recall académique n'est calculé que sur des `gold_chunk_ids` validés sémantiquement.", ""]
    return "\n".join(lines)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", type=Path, required=True)
    p.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    p.add_argument("--shard-dir", type=Path, default=DEFAULT_SHARD_DIR)
    p.add_argument("--db", type=Path, default=None)
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--output-json", type=Path)
    p.add_argument("--output-md", type=Path)
    p.add_argument("--require-citation-integrity", action="store_true")
    p.add_argument("--fail-under", type=float)
    args = p.parse_args()

    dataset_path = args.dataset if args.dataset.is_absolute() else ROOT / args.dataset
    dataset = load_dataset(dataset_path)
    limit = max(1, min(args.limit or int(dataset.get("default_limit") or 10), 20))

    conn: sqlite3.Connection | None = None
    if args.db:
        db = args.db if args.db.is_absolute() else ROOT / args.db
        conn = v6.open_readonly(db)
        def ask_fn(query: str, **kwargs: Any) -> dict[str, Any]:
            assert conn is not None
            return ask_monolithic(conn, query, **kwargs)
        runtime_name = f"monolithic:{db.name}"
    else:
        manifest = args.manifest if args.manifest.is_absolute() else ROOT / args.manifest
        shard_dir = args.shard_dir if args.shard_dir.is_absolute() else ROOT / args.shard_dir
        runtime = ShardedCorpusRuntime(manifest, shard_dir)
        runtime.validate()
        ask_fn = runtime.ask
        runtime_name = f"sharded:{len(runtime.shard_paths)}"

    results = []
    try:
        for i, case in enumerate(dataset["cases"], 1):
            r = evaluate(case, ask_fn, limit)
            r["_has_expected_concepts"] = bool(case.get("expected_concepts"))
            results.append(r)
            print(f"[{i:03d}/{len(dataset['cases']):03d}] {r['id']} sources={r['source_count']} recall={r['group_recall']:.0%} route={r['route_ok']}")
    finally:
        if conn is not None:
            conn.close()

    metrics = aggregate(results)
    for r in results:
        r.pop("_has_expected_concepts", None)
    report = {
        "version": "6.1", "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset_version": str(dataset.get("version") or ""), "runtime": runtime_name,
        "limit": limit, "metrics": metrics, "results": results,
    }
    print(json.dumps(metrics, ensure_ascii=False, indent=2))
    if args.output_json:
        out = args.output_json if args.output_json.is_absolute() else ROOT / args.output_json
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.output_md:
        out = args.output_md if args.output_md.is_absolute() else ROOT / args.output_md
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(markdown(report) + "\n", encoding="utf-8")

    failures = []
    if args.require_citation_integrity and metrics["citation_integrity_rate"] < 1:
        failures.append("citation integrity")
    if args.fail_under is not None and metrics["composite_score_100"] < args.fail_under:
        failures.append(f"score {metrics['composite_score_100']} < {args.fail_under}")
    if metrics["error_rate"] > 0:
        failures.append("runtime errors")
    if failures:
        print("BENCHMARK FAILED:", ", ".join(failures))
        return 1
    print("ATHAR RESEARCH BENCHMARK V6.1: COMPLETE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
