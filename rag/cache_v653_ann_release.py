from __future__ import annotations

"""Download and verify the corpus-scoped V6.5.3 sharded f16 ANN release."""

import argparse
import json
import os
import time
from pathlib import Path
from typing import Any

import requests

from v653_sharded_ann import ANN_VERSION, sha256

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_OUTPUT_DIR = ROOT / "rag" / "data" / "v653-ann"
DEFAULT_REPOSITORY = "IbraDevWeb/Athar"


def _rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _download(url: str, target: Path, *, expected_size: int | None = None, attempts: int = 10) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    part = target.with_name(target.name + ".part")
    expected = int(expected_size) if expected_size is not None else None
    last: Exception | None = None
    for attempt in range(1, max(1, attempts) + 1):
        if expected is not None and part.exists() and part.stat().st_size > expected:
            part.unlink(missing_ok=True)
        start = part.stat().st_size if part.exists() else 0
        headers = {"Accept-Encoding":"identity", "User-Agent":"Athar-RAG-V6.5.3"}
        if start:
            headers["Range"] = f"bytes={start}-"
        try:
            with requests.get(url, headers=headers, stream=True, timeout=(20,180), allow_redirects=True) as response:
                response.raise_for_status()
                resumed = bool(start and response.status_code == 206)
                if start and not resumed:
                    part.unlink(missing_ok=True)
                with part.open("ab" if resumed else "wb") as handle:
                    for chunk in response.iter_content(chunk_size=4*1024*1024):
                        if chunk:
                            handle.write(chunk)
            size = part.stat().st_size
            if expected is not None and size != expected:
                if size > expected:
                    part.unlink(missing_ok=True)
                raise RuntimeError(f"Taille partielle {target.name}: {size}/{expected}")
            part.replace(target)
            return
        except (requests.RequestException,OSError,RuntimeError) as exc:
            last = exc
            if attempt >= attempts:
                break
            delay = min(2 ** (attempt-1), 20)
            print(f"[ANN-sharded] reprise {target.name} {attempt+1}/{attempts}", flush=True)
            time.sleep(delay)
    raise RuntimeError(f"Échec téléchargement {target.name}: {last}") from last


def _tag(corpus: dict[str, Any]) -> str:
    override = str(os.getenv("ATHAR_ANN_SHARDED_RELEASE_TAG") or "").strip()
    if override:
        return override
    source_sha = str(corpus.get("source_sha") or "")
    if len(source_sha) < 12:
        raise RuntimeError("source_sha corpus invalide")
    return f"rag-ann-v653-sharded-f16-{source_sha[:12]}"


def cache_release(corpus_manifest: Path, output_dir: Path) -> dict[str, Any]:
    corpus_manifest = _rooted(corpus_manifest).resolve()
    output_dir = _rooted(output_dir).resolve()
    corpus = json.loads(corpus_manifest.read_text(encoding="utf-8"))
    tag = _tag(corpus)
    repository = str(os.getenv("ATHAR_ANN_RELEASE_REPOSITORY") or DEFAULT_REPOSITORY).strip()
    base = str(os.getenv("ATHAR_ANN_SHARDED_RELEASE_BASE_URL") or f"https://github.com/{repository}/releases/download/{tag}").rstrip("/")
    output_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = output_dir / "athar-v653-sharded.ann.json"
    _download(f"{base}/{manifest_path.name}", manifest_path)
    ann = json.loads(manifest_path.read_text(encoding="utf-8"))
    if ann.get("version") != ANN_VERSION:
        raise RuntimeError(f"Version ANN sharded inattendue: {ann.get('version')}")
    if str(ann.get("corpus_source_sha") or "") != str(corpus.get("source_sha") or ""):
        raise RuntimeError("Release ANN sharded incompatible avec le corpus")
    if int(ann.get("vectors") or 0) != int(corpus.get("chunks") or 0):
        raise RuntimeError("Nombre de vecteurs ANN sharded incompatible")

    files = [
        (str(ann["metadata_file"]), int(ann["metadata_size_bytes"]), str(ann["metadata_sha256"])),
        *[
            (str(s["index_file"]), int(s["index_size_bytes"]), str(s["index_sha256"]))
            for s in ann.get("shard_indexes") or []
        ],
    ]
    if len(files) != 12:
        raise RuntimeError(f"Release ANN sharded incomplète: {len(files)-1}/11 index")
    for name, size, digest in files:
        target = output_dir / name
        valid = target.exists() and target.stat().st_size == size and sha256(target) == digest
        if not valid:
            target.unlink(missing_ok=True)
            _download(f"{base}/{name}", target, expected_size=size)
        actual = sha256(target)
        if actual != digest:
            raise RuntimeError(f"SHA invalide pour {name}: {actual} != {digest}")

    payload = {
        "status":"ready", "tag":tag, "repository":repository,
        "manifest":str(manifest_path), "vectors":int(ann["vectors"]),
        "shards":int(ann["shards"]), "dtype":str(ann["dtype"]),
        "index_bytes":int(ann["index_size_bytes"]),
        "metadata_bytes":int(ann["metadata_size_bytes"]),
        "largest_shard_index_bytes":int(ann["largest_shard_index_bytes"]),
    }
    print(json.dumps(payload,ensure_ascii=False,indent=2))
    return payload


def main() -> int:
    p=argparse.ArgumentParser()
    p.add_argument("--corpus-manifest",type=Path,default=DEFAULT_CORPUS_MANIFEST)
    p.add_argument("--output-dir",type=Path,default=DEFAULT_OUTPUT_DIR)
    args=p.parse_args()
    cache_release(args.corpus_manifest,args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
