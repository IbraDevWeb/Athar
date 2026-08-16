from __future__ import annotations

"""Download and verify the immutable V6.3-C ANN release for production.

The public GitHub release tag is derived from the corpus source SHA, so a corpus
change naturally produces a different ANN release URL. The internal ANN
manifest remains the authority for file sizes and SHA-256 digests.
"""

import argparse
import json
import os
import shutil
import tempfile
from pathlib import Path
from typing import Any

import requests

from v63c_ann_index import ANN_VERSION, sha256

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CORPUS_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_OUTPUT_DIR = ROOT / "rag" / "data" / "v63c-ann"
DEFAULT_REPOSITORY = "IbraDevWeb/Athar"


def _rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _download(url: str, target: Path, *, expected_size: int | None = None) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(prefix=target.name + ".", suffix=".part", dir=target.parent, delete=False) as tmp:
        temp = Path(tmp.name)
    try:
        with requests.get(url, stream=True, timeout=(15, 180), allow_redirects=True) as response:
            response.raise_for_status()
            with temp.open("wb") as handle:
                for chunk in response.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        handle.write(chunk)
        if expected_size is not None and temp.stat().st_size != int(expected_size):
            raise RuntimeError(
                f"Taille téléchargée invalide pour {target.name}: "
                f"{temp.stat().st_size}/{expected_size}"
            )
        temp.replace(target)
    finally:
        temp.unlink(missing_ok=True)


def _release_tag(corpus: dict[str, Any]) -> str:
    override = str(os.getenv("ATHAR_ANN_RELEASE_TAG") or "").strip()
    if override:
        return override
    source_sha = str(corpus.get("source_sha") or "").strip()
    if len(source_sha) < 12:
        raise RuntimeError("source_sha corpus invalide pour dériver le tag ANN.")
    return f"rag-ann-v63c-{source_sha[:12]}"


def cache_release(corpus_manifest: Path, output_dir: Path) -> dict[str, Any]:
    corpus_manifest = _rooted(corpus_manifest).resolve()
    output_dir = _rooted(output_dir).resolve()
    corpus = json.loads(corpus_manifest.read_text(encoding="utf-8"))
    tag = _release_tag(corpus)
    repository = str(os.getenv("ATHAR_ANN_RELEASE_REPOSITORY") or DEFAULT_REPOSITORY).strip()
    base = str(
        os.getenv("ATHAR_ANN_RELEASE_BASE_URL")
        or f"https://github.com/{repository}/releases/download/{tag}"
    ).rstrip("/")
    output_dir.mkdir(parents=True, exist_ok=True)

    manifest_path = output_dir / "athar-v63c-global.ann.json"
    _download(f"{base}/{manifest_path.name}", manifest_path)
    ann = json.loads(manifest_path.read_text(encoding="utf-8"))
    if ann.get("version") != ANN_VERSION:
        raise RuntimeError(f"Version ANN inattendue: {ann.get('version')!r}")
    if str(ann.get("corpus_source_sha") or "") != str(corpus.get("source_sha") or ""):
        raise RuntimeError("La release ANN ne correspond pas au corpus configuré.")
    if int(ann.get("vectors") or 0) != int(corpus.get("chunks") or 0):
        raise RuntimeError("Le nombre de vecteurs ANN ne correspond pas au corpus.")

    files = [
        (str(ann["index_file"]), int(ann["index_size_bytes"]), str(ann["index_sha256"])),
        (str(ann["metadata_file"]), int(ann["metadata_size_bytes"]), str(ann["metadata_sha256"])),
    ]
    for name, expected_size, expected_sha in files:
        target = output_dir / name
        valid = (
            target.exists()
            and target.stat().st_size == expected_size
            and sha256(target) == expected_sha
        )
        if not valid:
            target.unlink(missing_ok=True)
            _download(f"{base}/{name}", target, expected_size=expected_size)
        actual_sha = sha256(target)
        if actual_sha != expected_sha:
            raise RuntimeError(f"SHA-256 ANN invalide pour {name}: {actual_sha} != {expected_sha}")

    payload = {
        "status": "ready",
        "tag": tag,
        "repository": repository,
        "manifest": str(manifest_path),
        "vectors": int(ann["vectors"]),
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
