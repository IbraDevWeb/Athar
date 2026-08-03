@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv-rag\Scripts\python.exe" (
  echo [Athar RAG] Creation de l'environnement Python...
  py -3 -m venv .venv-rag 2>nul || python -m venv .venv-rag
)

call ".venv-rag\Scripts\activate.bat"
python -m pip install --disable-pip-version-check -q -r rag\requirements.txt

start "" "http://127.0.0.1:8000/?v=34"
python rag\server.py --port 8000

endlocal
