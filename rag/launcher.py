from __future__ import annotations

import argparse
import json
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VENV_DIR = ROOT / ".venv-rag"
VENV_PYTHON = VENV_DIR / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
REQUIREMENTS = ROOT / "rag" / "requirements.txt"
SERVER_SCRIPT = ROOT / "rag" / "server.py"
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


def choose_port(preferred: int, span: int = 10) -> tuple[int, bool]:
    for port in range(preferred, preferred + span + 1):
        if test_rag_api(port):
            return port, True
        if port_is_free(port):
            return port, False
        log(f"Le port {port} est occupé par un autre serveur ; essai du port suivant.")
    raise RuntimeError(f"Aucun port libre trouvé entre {preferred} et {preferred + span}.")


def ensure_environment() -> Path:
    if not VENV_PYTHON.exists():
        log("Création de l’environnement Python local…")
        subprocess.run(
            [sys.executable, "-m", "venv", str(VENV_DIR)],
            cwd=ROOT,
            check=True,
        )

    if not VENV_PYTHON.exists():
        raise RuntimeError("L’environnement Python local n’a pas été créé correctement.")

    log("Vérification des dépendances…")
    subprocess.run(
        [
            str(VENV_PYTHON),
            "-m",
            "pip",
            "install",
            "--disable-pip-version-check",
            "-q",
            "-r",
            str(REQUIREMENTS),
        ],
        cwd=ROOT,
        check=True,
    )
    return VENV_PYTHON


def wait_until_ready(process: subprocess.Popen[bytes], port: int, timeout: float = 30.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        return_code = process.poll()
        if return_code is not None:
            raise RuntimeError(f"Le serveur RAG s’est arrêté pendant son démarrage (code {return_code}).")
        if test_rag_api(port):
            return
        time.sleep(0.5)
    raise RuntimeError("Le serveur RAG n’a pas répondu après 30 secondes.")


def stop_process(process: subprocess.Popen[bytes]) -> None:
    if process.poll() is not None:
        return
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def open_athar(port: int, no_browser: bool) -> str:
    url = f"http://127.0.0.1:{port}/?v=34&server=rag-v2&ragPort={port}"
    log(f"Bibliothèque Savante V2 prête : {url}")
    if not no_browser:
        webbrowser.open(url, new=2)
    return url


def run(preferred_port: int = 8000, no_browser: bool = False) -> int:
    python_executable = ensure_environment()
    port, existing = choose_port(preferred_port)

    if existing:
        log(f"Un serveur RAG V2 fonctionne déjà sur le port {port}.")
        open_athar(port, no_browser)
        return 0

    log(f"Démarrage du serveur RAG V2 sur le port {port}…")
    process = subprocess.Popen(
        [
            str(python_executable),
            str(SERVER_SCRIPT),
            "--host",
            "127.0.0.1",
            "--port",
            str(port),
        ],
        cwd=ROOT,
    )

    try:
        wait_until_ready(process, port)
        open_athar(port, no_browser)
        log("Fermez cette fenêtre ou utilisez Ctrl+C pour arrêter le serveur.")
        return process.wait()
    except KeyboardInterrupt:
        log("Arrêt demandé.")
        return 0
    finally:
        stop_process(process)


def main() -> int:
    parser = argparse.ArgumentParser(description="Démarre Athar Pro avec la Bibliothèque Savante V2.")
    parser.add_argument("--preferred-port", type=int, default=8000)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    try:
        return run(preferred_port=args.preferred_port, no_browser=args.no_browser)
    except (OSError, RuntimeError, subprocess.SubprocessError) as error:
        print(f"[Athar RAG] Échec du démarrage : {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
