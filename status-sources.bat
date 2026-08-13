@echo off
setlocal
cd /d "%~dp0"
set "PYTHON=.venv-rag\Scripts\python.exe"
if not exist "%PYTHON%" set "PYTHON=python"
"%PYTHON%" rag\ingest_source.py status
set "ATHAR_EXIT=%ERRORLEVEL%"
pause
endlocal & exit /b %ATHAR_EXIT%
