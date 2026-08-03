from __future__ import annotations

import argparse
import json
import os
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SERVER_SCRIPT = ROOT / "rag" / "server.py"
RUNTIME_FILE = ROOT / "rag" / "runtime.json"
LOG_FILE = ROOT / "rag" / "server.log"
SERVER_MARKER = "athar-rag-v2"


def log(message: str) -> None:
    print(f"[Athar RAG] {message}", flush=True)


def test_rag_api(port: int, timeout: float = 1.5) -> bool:
    url = f"http://127.0.0.1:{port}/api/rag/v2/status"
    try:
        with urllib.request.urlopen(url, timeout=timeout) as response:
            if response.status != 200:
                return False
            payload = json.loads(response.read().decode("utf-8"))
            return bool(payload.get("ok") and payload.get("server") == SERVER_MARKER)
    except (OSError, ValueError, urllib.error.URLError, json.JSONDecodeError):
        return False


def port_is_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            return False
    return True


def choose_port(preferred: int, span: int = 20) -> tuple[int, bool]:
    for port in range(preferred, preferred + span + 1):
        if test_rag_api(port):
            return port, True
        if port_is_free(port):
            return port, False
        log(f"Le port {port} est occupé par un autre serveur ; essai du port suivant.")
    raise RuntimeError(f"Aucun port libre trouvé entre {preferred} et {preferred + span}.")


def read_runtime(path: Path = RUNTIME_FILE) -> dict[str, object]:
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        return payload if isinstance(payload, dict) else {}
    except (OSError, ValueError, json.JSONDecodeError):
        return {}


def write_runtime(port: int, pid: int, path: Path = RUNTIME_FILE) -> dict[str, object]:
    payload: dict[str, object] = {
        "ok": True,
        "server": SERVER_MARKER,
        "api_version": 2,
        "host": "127.0.0.1",
        "port": port,
        "origin": f"http://127.0.0.1:{port}",
        "pid": pid,
        "started_at": datetime.now(timezone.utc).isoformat(),
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    temporary.replace(path)
    return payload


def remove_runtime(path: Path = RUNTIME_FILE) -> None:
    try:
        path.unlink(missing_ok=True)
    except OSError:
        pass


def wait_until_ready(process: subprocess.Popen[bytes], port: int, timeout: float = 30.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        return_code = process.poll()
        if return_code is not None:
            raise RuntimeError(
                f"Le serveur RAG s’est arrêté pendant son démarrage (code {return_code}). "
                f"Consultez {LOG_FILE.name}."
            )
        if test_rag_api(port):
            return
        time.sleep(0.4)
    raise RuntimeError(f"Le serveur RAG n’a pas répondu après 30 secondes. Consultez {LOG_FILE.name}.")


def detached_process_kwargs() -> dict[str, object]:
    if os.name == "nt":
        flags = int(getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0))
        flags |= int(getattr(subprocess, "DETACHED_PROCESS", 0))
        flags |= int(getattr(subprocess, "CREATE_NO_WINDOW", 0))
        return {"creationflags": flags, "close_fds": True}
    return {"start_new_session": True, "close_fds": True}


def start_server(port: int) -> subprocess.Popen[bytes]:
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    log_stream = LOG_FILE.open("ab", buffering=0)
    try:
        process = subprocess.Popen(
            [
                sys.executable,
                str(SERVER_SCRIPT),
                "--host",
                "127.0.0.1",
                "--port",
                str(port),
            ],
            cwd=ROOT,
            stdin=subprocess.DEVNULL,
            stdout=log_stream,
            stderr=subprocess.STDOUT,
            **detached_process_kwargs(),
        )
    except Exception:
        log_stream.close()
        raise
    wait_until_ready(process, port)
    write_runtime(port, int(process.pid))
    return process


def open_athar(port: int, no_browser: bool) -> str:
    stamp = int(time.time())
    url = f"http://127.0.0.1:{port}/?v=34&server=rag-v2&ragPort={port}&runtime={stamp}"
    log(f"Bibliothèque Savante V2 prête : {url}")
    if not no_browser:
        webbrowser.open(url, new=2)
    return url


def run(preferred_port: int = 8765, no_browser: bool = False) -> int:
    port, existing = choose_port(preferred_port)

    if existing:
        log(f"Un serveur RAG V2 fonctionne déjà sur le port {port}.")
        current = read_runtime()
        known_pid = int(current.get("pid") or 0) if int(current.get("port") or 0) == port else 0
        write_runtime(port, known_pid)
        open_athar(port, no_browser)
        return 0

    remove_runtime()
    log(f"Démarrage du serveur RAG V2 sur le port {port}…")
    process = start_server(port)
    log(f"Serveur démarré en arrière-plan (PID {process.pid}).")
    log(f"Journal : {LOG_FILE}")
    open_athar(port, no_browser)
    log("Le serveur reste actif après la fermeture de cette fenêtre.")
    log("Utilisez stop-athar-rag.bat pour l’arrêter proprement.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Démarre Athar Pro avec la Bibliothèque Savante V2.")
    parser.add_argument("--preferred-port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    try:
        return run(preferred_port=args.preferred_port, no_browser=args.no_browser)
    except (OSError, RuntimeError, subprocess.SubprocessError) as error:
        remove_runtime()
        print(f"[Athar RAG] Échec du démarrage : {error}", file=sys.stderr)
        print(f"[Athar RAG] Journal éventuel : {LOG_FILE}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
