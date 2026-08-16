from __future__ import annotations

"""Download and verify the compact corpus-scoped V6.5.2 i8 ANN release."""

import argparse
import json
import os
import time
from pathlib import Path
from typing import Any

import requests

from v652_quantized_ann import ANN_VERSION, sha256

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_OUTPUT_DIR = ROOT / "rag" / "data" / "v652-ann"
DEFAULT_REPOSITORY = "IbraDevWeb/Athar"


def _rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _download(url: str, target: Path, *, expected_size: int | None = None, attempts: int = 10) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    temp = target.with_name(target.name + ".part")
    expected = int(expected_size) if expected_size is not None else None
    last_error: Exception | None = None
    for attempt in range(1, max(1, int(attempts)) + 1):
        if expected is not None and temp.exists() and temp.stat().st_size > expected:
            temp.unlink(missing_ok=True)
        start = temp.stat().st_size if temp.exists() else 0
        headers = {"Accept-Encoding": "identity", "User-Agent": "Athar-RAG-V6.5.2"}
        if start > 0:
            headers["Range"] = f"bytes={start}-"
        try:
            with requests.get(url, headers=headers, stream=True, timeout=(20, 180), allow_redirects=True) as response:
                response.raise_for_status()
                resumed = start > 0 and response.status_code == 206
                if start > 0 and not resumed:
                    start = 0
                    temp.unlink(missing_ok=True)
                with temp.open("ab" if resumed else "wb") as handle:
                    for chunk in response.iter_content(chunk_size=4 * 1024 * 1024):
                        if chunk:
                            handle.write(chunk)
            size = temp.stat().st_size if temp.exists() else 0
            if expected is not None and size != expected:
                if size > expected:
                    temp.unlink(missing_ok=True)
                raise RuntimeError(f"Téléchargement incomplet pour {target.name}: {size}/{expected} octets")
            temp.replace(target)
            return
        except (requests.RequestException, OSError, RuntimeError) as exc:
            last_error = exc
            if attempt >= attempts:
                break
            delay = min(2 ** (attempt - 1), 20)
            current = temp.stat().st_size if temp.exists() else 0
            print(f"[ANN-i8] reprise {target.name}: {current}/{expected or '?'} · tentative {attempt+1}/{attempts}", flush=True)
            time.sleep(delay)
    raise RuntimeError(f"Échec téléchargement ANN i8: {target.name}: {last_error}") from last_error


def _release_tag(corpus: dict[str, Any]) -> str:
    override = str(os.getenv("ATHAR_ANN_I8_RELEASE_TAG") or "").strip()
    if override:
        return override
    source_sha = str(corpus.get("source_sha") or "").strip()
    if len(source_sha) < 12:
        raise RuntimeError("source_sha corpus invalide.")
    return f"rag-ann-v652-i8-{source_sha[:12]}"


def cache_release(corpus_manifest: Path, output_dir: Path) -> dict[str, Any]:
    corpus_manifest = _rooted(corpus_manifest).resolve()
    output_dir = _rooted(output_dir).resolve()
    corpus = json.loads(corpus_manifest.read_text(encoding="utf-8"))
    tag = _release_tag(corpus)
    repository = str(os.getenv("ATHAR_ANN_RELEASE_REPOSITORY") or DEFAULT_REPOSITORY).strip()
    base = str(os.getenv("ATHAR_ANN_I8_RELEASE_BASE_URL") or f"https://github.com/{repository}/releases/download/{tag}").rstrip("/")
    output_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = output_dir / "athar-v652-global-i8.ann.json"
    _download(f"{base}/{manifest_path.name}", manifest_path)
    ann = json.loads(manifest_path.read_text(encoding="utf-8"))
    if ann.get("version") != ANN_VERSION:
        raise RuntimeError(f"Version ANN i8 inattendue: {ann.get('version')!r}")
    if ann.get("dtype") != "i8":
        raise RuntimeError("La release ANN n'est pas quantifiée i8.")
    if str(ann.get("corpus_source_sha") or "") != str(corpus.get("source_sha") or ""):
        raise RuntimeError("La release ANN i8 ne correspond pas au corpus.")
    if int(ann.get("vectors") or 0) != int(corpus.get("chunks") or 0):
        raise RuntimeError("Le nombre de vecteurs ANN i8 ne correspond pas au corpus.")

    for name, expected_size, expected_sha in [
        (str(ann["index_file"]), int(ann["index_size_bytes"]), str(ann["index_sha256"])),
        (str(ann["metadata_file"]), int(ann["metadata_size_bytes"]), str(ann["metadata_sha256"])),
    ]:
        target = output_dir / name
        valid = target.exists() and target.stat().st_size == expected_size and sha256(target) == expected_sha
        if not valid:
            target.unlink(missing_ok=True)
            _download(f"{base}/{name}", target, expected_size=expected_size)
        actual_sha = sha256(target)
        if actual_sha != expected_sha:
            raise RuntimeError(f"SHA-256 ANN i8 invalide pour {name}: {actual_sha} != {expected_sha}")

    payload = {
        "status": "ready",
        "tag": tag,
        "repository": repository,
        "manifest": str(manifest_path),
        "vectors": int(ann["vectors"]),
        "dtype": str(ann["dtype"]),
        "corpus_source_sha": str(ann["corpus_source_sha"]),
        "index_bytes": int(ann["index_size_bytes"]),
        "metadata_bytes": int(ann["metadata_size_bytes"]),
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus-manifest", type=Path, default=DEFAULT_CORPUS_MANIFEST)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    args = parser.parse_args()
    cache_release(args.corpus_manifest, args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
