@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-athar-rag.ps1" %*
set "ATHAR_EXIT=%ERRORLEVEL%"

if not "%ATHAR_EXIT%"=="0" (
  echo.
  echo [Athar RAG] Le demarrage a echoue. Consultez le message ci-dessus.
  pause
)

exit /b %ATHAR_EXIT%
