from __future__ import annotations

"""Compare split-process V6.5 retrieval with the accepted local V6.4 fusion."""

import argparse
import json
import time
from pathlib import Path
from statistics import mean
from typing import Any

from v5_engine import normalize_text
from v5_sharded import ShardedCorpusRuntime
from v61_benchmark import load_dataset
from v64_production import V64ProductionRuntime
from v65_remote_fusion import RemoteSemanticClient, V65RemoteFusionRuntime

ROOT = Path(__file__).resolve().parents[1]


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def percentile(values: list[float], q: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    idx = min(len(ordered) - 1, max(0, int(round((len(ordered) - 1) * q))))
    return float(ordered[idx])


def strict(value: str) -> bool:
    return normalize_text(value) not in {"", "all", "tous", "toutes", "auto", "automatique"}


def run(
    *,
    dataset_path: Path,
    manifest_path: Path,
    shard_dir: Path,
    ann_manifest: Path,
    semantic_url: str,
    semantic_token: str,
    output_json: Path,
    output_md: Path,
) -> dict[str, Any]:
    dataset = load_dataset(dataset_path)
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()

    local = V64ProductionRuntime(
        base,
        configured_engine="v63c",
        ann_manifest=ann_manifest,
        fail_open=False,
        debug_ann=False,
    )
    local.validate()
    local.warmup()

    client = RemoteSemanticClient(
        semantic_url,
        token=semantic_token,
        connect_timeout=2.0,
        read_timeout=30.0,
    )
    remote = V65RemoteFusionRuntime(base, client, fail_open=False)
    remote.validate(require_remote=True)

    failures: list[str] = []
    local_ms: list[float] = []
    remote_ms: list[float] = []
    changed = 0
    negative_cases = 0
    routed_cases = 0
    madhhab_cases = 0
    rows: list[dict[str, Any]] = []

    try:
        cases = list(dataset.get("cases") or [])
        for index, case in enumerate(cases, 1):
            case_id = str(case.get("id") or f"case-{index}")
            query = str(case.get("question") or "")
            madhhab = str(case.get("madhhab") or "")
            discipline = str(case.get("discipline") or "")
            kwargs = {"madhhab": madhhab, "discipline": discipline}

            started = time.perf_counter()
            local_result = local.search(query, limit=10, **kwargs)
            local_elapsed = (time.perf_counter() - started) * 1000.0
            local_ms.append(local_elapsed)

            started = time.perf_counter()
            remote_result = remote.search(query, limit=10, **kwargs)
            remote_elapsed = (time.perf_counter() - started) * 1000.0
            remote_ms.append(remote_elapsed)

            local_sources = list(local_result.get("sources") or [])
            remote_sources = list(remote_result.get("sources") or [])
            local_ids = [str(item.get("id") or "") for item in local_sources]
            remote_ids = [str(item.get("id") or "") for item in remote_sources]
            case_failures: list[str] = []

            if local_ids != remote_ids:
                changed += 1
                case_failures.append("ranking_not_equivalent")
            if len(remote_sources) > 10:
                case_failures.append("remote_limit_exceeded")
            analysis = dict(remote_result.get("analysis") or {})
            if analysis.get("engine") != remote.ENGINE:
                case_failures.append("wrong_remote_engine")
            if analysis.get("semantic_remote_fallback") is True:
                case_failures.append("unexpected_remote_fallback")

            expected_negative = bool(case.get("expect_no_evidence"))
            if expected_negative:
                negative_cases += 1
                if local_sources or remote_sources:
                    case_failures.append("abstention_changed")
                if analysis.get("semantic_remote_called") is not False:
                    case_failures.append("semantic_called_on_v61_abstention")

            local_route = (local_result.get("analysis") or {}).get("routed_book") or {}
            remote_route = analysis.get("routed_book") or {}
            if isinstance(local_route, dict) and str(local_route.get("id") or ""):
                routed_cases += 1
                if not isinstance(remote_route, dict) or str(remote_route.get("id") or "") != str(local_route.get("id") or ""):
                    case_failures.append("route_changed")

            if strict(madhhab):
                madhhab_cases += 1
                wanted = normalize_text(madhhab)
                for source in remote_sources:
                    actual = normalize_text(source.get("madhhab") or "")
                    if not actual or wanted not in actual:
                        case_failures.append("madhhab_leak")
                        break

            for rank, source in enumerate(remote_sources, 1):
                if str(source.get("citation_id") or "") != f"S{rank}":
                    case_failures.append("citation_sequence_invalid")
                    break
                if not str(source.get("book_id") or "") or not str(source.get("title") or ""):
                    case_failures.append("canonical_metadata_missing")
                    break

            failures.extend(f"{case_id}: {failure}" for failure in case_failures)
            rows.append(
                {
                    "case_id": case_id,
                    "local_ms": round(local_elapsed, 3),
                    "remote_ms": round(remote_elapsed, 3),
                    "local_count": len(local_sources),
                    "remote_count": len(remote_sources),
                    "equivalent": local_ids == remote_ids,
                    "failures": case_failures,
                }
            )
            print(
                f"[{index:03d}/{len(cases):03d}] {case_id} "
                f"local={local_elapsed:.1f}ms remote={remote_elapsed:.1f}ms "
                f"equivalent={local_ids == remote_ids}",
                flush=True,
            )

        # Explicitly prove that a dead sidecar cannot break or widen V6.1 output.
        positive = next(case for case in cases if not bool(case.get("expect_no_evidence")))
        query = str(positive["question"])
        kwargs = {
            "madhhab": str(positive.get("madhhab") or ""),
            "discipline": str(positive.get("discipline") or ""),
        }
        expected = base.search(query, limit=8, **kwargs)
        dead_client = RemoteSemanticClient(
            "http://127.0.0.1:1",
            connect_timeout=0.2,
            read_timeout=0.5,
        )
        fallback = V65RemoteFusionRuntime(base, dead_client, fail_open=True)
        try:
            got = fallback.search(query, limit=8, **kwargs)
        finally:
            fallback.close()
        expected_ids = [str(item.get("id") or "") for item in expected.get("sources") or []]
        got_ids = [str(item.get("id") or "") for item in got.get("sources") or []]
        if got_ids != expected_ids:
            failures.append("fail_open: output differs from V6.1 requested limit")
        if (got.get("analysis") or {}).get("semantic_remote_fallback") is not True:
            failures.append("fail_open: fallback marker missing")
        if len(got_ids) > 8:
            failures.append("fail_open: requested limit exceeded")

    finally:
        remote.close()
        local.close_ann()

    report = {
        "version": "6.5-split-semantic-smoke-1",
        "cases": len(rows),
        "ranking_mismatches": changed,
        "negative_cases": negative_cases,
        "routed_cases": routed_cases,
        "madhhab_cases": madhhab_cases,
        "failure_count": len(failures),
        "failures": failures,
        "local_v64_latency_ms": {
            "mean": round(mean(local_ms), 3) if local_ms else 0.0,
            "p50": round(percentile(local_ms, 0.50), 3),
            "p95": round(percentile(local_ms, 0.95), 3),
        },
        "remote_v65_latency_ms": {
            "mean": round(mean(remote_ms), 3) if remote_ms else 0.0,
            "p50": round(percentile(remote_ms, 0.50), 3),
            "p95": round(percentile(remote_ms, 0.95), 3),
        },
        "per_case": rows,
    }
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    output_md.write_text(
        "\n".join(
            [
                "# Athar V6.5 — Split semantic smoke",
                "",
                f"- Cas comparés : **{report['cases']}**",
                f"- Rankings différents de V6.4 local : **{changed}**",
                f"- Échecs : **{report['failure_count']}**",
                f"- V6.4 local moyenne : **{report['local_v64_latency_ms']['mean']:.2f} ms**",
                f"- V6.5 remote moyenne : **{report['remote_v65_latency_ms']['mean']:.2f} ms**",
                f"- V6.5 remote p95 : **{report['remote_v65_latency_ms']['p95']:.2f} ms**",
                "",
                "Le gate exige une équivalence exacte des IDs/rangs avec V6.4 sur les 200 cas, plus un fallback V6.1 exact lorsque le sidecar est indisponible.",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    if failures:
        raise RuntimeError(f"V6.5 refusée: {len(failures)} échec(s). Premier: {failures[0]}")
    return report


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--shard-dir", type=Path, required=True)
    parser.add_argument("--ann-manifest", type=Path, required=True)
    parser.add_argument("--semantic-url", required=True)
    parser.add_argument("--semantic-token", default="")
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-md", type=Path, required=True)
    args = parser.parse_args()
    run(
        dataset_path=rooted(args.dataset),
        manifest_path=rooted(args.manifest),
        shard_dir=rooted(args.shard_dir),
        ann_manifest=rooted(args.ann_manifest),
        semantic_url=str(args.semantic_url),
        semantic_token=str(args.semantic_token),
        output_json=rooted(args.output_json),
        output_md=rooted(args.output_md),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
