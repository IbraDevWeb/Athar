from __future__ import annotations

import json
import sys
import tempfile
import threading
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"
if str(RAG) not in sys.path:
    sys.path.insert(0, str(RAG))

from core import ensure_database  # noqa: E402
from fetch_hosted_corpus import build_fallback, load_manifest  # noqa: E402
from server import AtharRagHandler, SERVER_MARKER, bootstrap_corpus  # noqa: E402


def fail(message: str) -> None:
    raise AssertionError(message)


def request_json(url: str, *, origin: str = "") -> tuple[int, dict[str, object], dict[str, str]]:
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    if origin:
        request.add_header("Origin", origin)
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))
            headers = {key.lower(): value for key, value in response.headers.items()}
            return response.status, payload, headers
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8")
        payload = json.loads(raw) if raw else {}
        headers = {key.lower(): value for key, value in error.headers.items()}
        return error.code, payload, headers


def main() -> int:
    render = (ROOT / "render.yaml").read_text(encoding="utf-8")
    for token in [
        "name: athar-rag-ibradevweb",
        "runtime: python",
        "plan: free",
        "autoDeployTrigger: commit",
        "buildFilter:",
        "- rag/**",
        "ignoredPaths: []",
        "buildCommand: python -m pip install -r rag/requirements.txt",
        "startCommand: python rag/strict_server.py --host 0.0.0.0 --api-only",
        "healthCheckPath: /healthz",
        "ATHAR_CORS_ORIGINS",
        "ATHAR_DB_PATH",
        "ATHAR_PREBUILT_CORPUS",
    ]:
        if token not in render:
            fail(f"render.yaml incomplet : {token}")

    if "autoDeployTrigger: checksPass" in render:
        fail("Render ne doit plus attendre des checks CI pour le commit automatique du manifeste corpus")

    build_line = next((line.strip() for line in render.splitlines() if line.strip().startswith("buildCommand:")), "")
    if "build_hosted_corpus.py" in build_line or "ingest_tafsir.py" in build_line:
        fail("Render ne doit plus construire le corpus pendant le déploiement")

    workflow = (ROOT / ".github" / "workflows" / "build-rag-corpus.yml").read_text(encoding="utf-8")
    for token in [
        "python rag/build_hosted_corpus.py",
        "python rag/ingest_tafsir.py",
        "softprops/action-gh-release@v2",
        "tag_name: rag-corpus-v2",
        "group: athar-hosted-rag-corpus-v2",
        "cancel-in-progress: true",
        "athar_hosted.sqlite",
        "Refresh hosted RAG corpus v2",
        "git push origin HEAD:main",
    ]:
        if token not in workflow:
            fail(f"workflow corpus incomplet : {token}")

    release = load_manifest()
    release_url = str(release.get("url") or "")
    allowed_urls = {
        "https://github.com/IbraDevWeb/Athar/releases/download/rag-corpus-latest/athar_hosted.sqlite",
        "https://github.com/IbraDevWeb/Athar/releases/download/rag-corpus-v2/athar_hosted.sqlite",
    }
    if release_url not in allowed_urls:
        fail("Le manifeste corpus ne cible pas une Release GitHub Athar prévue")

    remote = json.loads((RAG / "remote.json").read_text(encoding="utf-8"))
    if remote.get("origin") != "https://athar-rag-ibradevweb.onrender.com":
        fail("rag/remote.json ne cible pas le service Render prévu")

    with tempfile.TemporaryDirectory() as directory:
        fallback_path = Path(directory) / "fallback.sqlite"
        fallback = build_fallback(fallback_path)
        if fallback.get("mode") != "starter_fallback":
            fail(f"fallback corpus invalide : {fallback}")
        if int(fallback["validated"]["chunks"]) <= 0:
            fail("Le corpus de secours doit rester exploitable")

        db_path = Path(directory) / "hosted.sqlite"
        with ensure_database(db_path) as connection:
            bootstrap_corpus(connection)

        server = ThreadingHTTPServer(("127.0.0.1", 0), AtharRagHandler)
        server.db_path = db_path
        server.api_only = True
        server.allowed_origins = {"https://ibradevweb.github.io"}
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            origin = "https://ibradevweb.github.io"
            base = f"http://127.0.0.1:{server.server_port}"
            status, health, headers = request_json(f"{base}/healthz", origin=origin)
            if status != 200 or health.get("ok") is not True or health.get("server") != SERVER_MARKER:
                fail(f"healthz invalide : {status} {health}")
            if headers.get("access-control-allow-origin") != origin:
                fail("CORS GitHub Pages absent sur /healthz")
            status, payload, headers = request_json(f"{base}/api/rag/v2/status", origin=origin)
            if status != 200 or payload.get("ok") is not True or payload.get("deployment") != "hosted":
                fail(f"status V2 invalide : {status} {payload}")
            if headers.get("access-control-allow-origin") != origin:
                fail("CORS GitHub Pages absent sur l'API")
            status, _, headers = request_json(f"{base}/api/rag/v2/status", origin="https://example.com")
            if status != 200 or "access-control-allow-origin" in headers:
                fail("gestion CORS d'une origine non autorisée invalide")
            status, payload, _ = request_json(f"{base}/README.md", origin=origin)
            if status != 404 or payload.get("ok") is not False:
                fail("le mode API-only expose encore les fichiers du dépôt")
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)

    print("Hosted RAG validated: corpus manifest commits redeploy Render, prebuilt v2 corpus stays isolated, and API-only mode remains operational.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
