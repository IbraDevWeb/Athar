from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"


def load(name: str) -> dict:
    return json.loads((RAG / name).read_text(encoding="utf-8"))


def load_wave2() -> list[dict]:
    index = load("corpus_wave2_targets.json")
    rows: list[dict] = []
    for name in index.get("files") or []:
        payload = load(str(name))
        targets = [row for row in payload.get("targets") or [] if isinstance(row, dict)]
        assert int(payload.get("target_count") or 0) == len(targets) == 15
        rows.extend(targets)
    assert int(index.get("target_count") or 0) == len(rows) == 60
    return rows


def main() -> None:
    registry = load("madhhab_scholar_targets.json")
    targets = load("corpus_priority_targets.json")
    benchmark = load("topic_plurality_benchmark.json")
    wave2 = load_wave2()

    schools = registry.get("schools") or []
    assert len(schools) == 4
    expected = {"Ḥanafite", "Mālikite", "Shāfiʿite", "Ḥanbalite"}
    assert {school["madhhab"] for school in schools} == expected

    scholar_ids: list[str] = []
    scholar_school: dict[str, str] = {}
    for school in schools:
        scholars = school.get("scholars") or []
        assert school.get("target_count") == 25
        assert len(scholars) == 25
        assert all(row.get("name") for row in scholars)
        for row in scholars:
            scholar_id = str(row["id"])
            scholar_ids.append(scholar_id)
            scholar_school[scholar_id] = str(school["madhhab"])
    assert len(scholar_ids) == 100
    assert len(scholar_ids) == len(set(scholar_ids))

    rows = [row for row in targets.get("targets") or [] if isinstance(row, dict)]
    p1 = [row for row in rows if row.get("priority") == "P1"]
    p2 = [row for row in rows if row.get("priority") == "P2"]
    assert len(p1) == 13
    assert len(p2) >= 40
    p2_counts = Counter(row.get("madhhab") for row in p2)
    for madhhab in expected:
        assert p2_counts[madhhab] >= 10, (madhhab, p2_counts[madhhab])
    for row in p2:
        assert row.get("required") is False
        direct = bool(row.get("work_markers"))
        paired = bool(row.get("author_markers")) and bool(row.get("title_markers"))
        assert direct or paired, row["id"]

    p3_counts = Counter(row.get("madhhab") for row in wave2)
    assert p3_counts == Counter({madhhab: 15 for madhhab in expected})
    p3_ids = [str(row.get("id")) for row in wave2]
    assert len(p3_ids) == len(set(p3_ids)) == 60
    for row in wave2:
        assert row.get("priority") == "P3" and row.get("required") is False
        scholar_id = str(row.get("author_target_id") or "")
        assert scholar_id in scholar_school, row["id"]
        assert scholar_school[scholar_id] == row.get("madhhab"), row["id"]
        assert row.get("source_type") and row.get("focus_topics"), row["id"]
        direct = bool(row.get("work_markers"))
        paired = bool(row.get("author_markers")) and bool(row.get("title_markers"))
        assert direct or paired, row["id"]

    source_types = Counter(str(row.get("source_type")) for row in wave2)
    fatwa_like = sum(count for kind, count in source_types.items() if "fatwa" in kind or kind == "masa_il")
    commentary_like = sum(count for kind, count in source_types.items() if "commentary" in kind or kind == "hashiya")
    assert fatwa_like >= 10, source_types
    assert commentary_like >= 20, source_types
    assert any("mawlid" in (row.get("focus_topics") or []) for row in wave2)
    assert any("urf" in (row.get("focus_topics") or []) for row in wave2)

    topics = {row["id"]: row for row in benchmark.get("topics") or []}
    assert "mawlid" in topics
    assert len(topics) >= 10
    mawlid = topics["mawlid"]
    assert mawlid.get("queries_fr") and mawlid.get("queries_ar")
    assert "المولد" in " ".join(mawlid.get("lexical_hints_ar") or [])
    goals = mawlid.get("goals") or {}
    assert int(goals.get("min_unique_authors_when_available") or 0) >= 5
    assert int(goals.get("min_madhhabs_when_available") or 0) >= 3

    print(
        "Madhhab corpus expansion contract: OK — "
        f"100 scholar targets, {len(p2)} optional P2 works, {len(wave2)} balanced P3 works, "
        f"{len(topics)} plurality topics."
    )


if __name__ == "__main__":
    main()
