@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if "%ERRORLEVEL%"=="0" (
  py -3 rag\stop_server.py
) else (
  where python >nul 2>nul
  if not "%ERRORLEVEL%"=="0" (
    echo [Athar RAG] Python 3 est introuvable.
    pause
    exit /b 1
  )
  python rag\stop_server.py
)

set "ATHAR_EXIT=%ERRORLEVEL%"
echo.
pause
exit /b %ATHAR_EXIT%
