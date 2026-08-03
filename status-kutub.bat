@echo off
setlocal
cd /d "%~dp0"

if exist ".venv-rag\Scripts\python.exe" (
  ".venv-rag\Scripts\python.exe" rag\ingest_kutub.py status
) else (
  py -3 rag\ingest_kutub.py status 2>nul || python rag\ingest_kutub.py status
)

pause
endlocal
