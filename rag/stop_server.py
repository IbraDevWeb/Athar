from __future__ import annotations

import json
import os
import signal
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME_FILE = ROOT / "rag" / "runtime.json"
SERVER_MARKER = "athar-rag-v2"


def api_alive(port: int, timeout: float = 1.0) -> bool:
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/rag/v2/status", timeout=timeout) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return response.status == 200 and payload.get("server") == SERVER_MARKER
    except (OSError, ValueError, urllib.error.URLError, json.JSONDecodeError):
        return False


def read_runtime() -> dict[str, object]:
    if not RUNTIME_FILE.exists():
        return {}
    try:
        return json.loads(RUNTIME_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError, json.JSONDecodeError):
        return {}


def stop_pid(pid: int) -> None:
    if pid <= 0:
        return
    if os.name == "nt":
        subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"], check=False, capture_output=True)
        return
    try:
        os.killpg(pid, signal.SIGTERM)
    except (ProcessLookupError, PermissionError):
        try:
            os.kill(pid, signal.SIGTERM)
        except (ProcessLookupError, PermissionError):
            pass


def main() -> int:
    runtime = read_runtime()
    port = int(runtime.get("port") or 0)
    pid = int(runtime.get("pid") or 0)

    if not runtime:
        print("[Athar RAG] Aucun manifeste d’exécution trouvé.")
        return 0

    if pid > 0:
        print(f"[Athar RAG] Arrêt du processus {pid}…")
        stop_pid(pid)
    elif port and api_alive(port):
        print(
            "[Athar RAG] Le serveur répond, mais son PID n’est pas connu. "
            "Fermez la fenêtre qui l’a lancé ou arrêtez le processus Python concerné."
        )
        return 1

    deadline = time.monotonic() + 8
    while port and time.monotonic() < deadline and api_alive(port):
        time.sleep(0.25)

    try:
        RUNTIME_FILE.unlink(missing_ok=True)
    except OSError:
        pass

    if port and api_alive(port):
        print(f"[Athar RAG] Le serveur répond encore sur le port {port}.")
        return 1

    print("[Athar RAG] Serveur arrêté.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
