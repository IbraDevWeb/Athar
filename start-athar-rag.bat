@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if "%ERRORLEVEL%"=="0" (
  py -3 rag\launcher.py %*
) else (
  where python >nul 2>nul
  if not "%ERRORLEVEL%"=="0" (
    echo [Athar RAG] Python 3 est introuvable. Installez Python puis relancez ce fichier.
    pause
    exit /b 1
  )
  python rag\launcher.py %*
)

set "ATHAR_EXIT=%ERRORLEVEL%"
if not "%ATHAR_EXIT%"=="0" (
  echo.
  echo [Athar RAG] Le demarrage a echoue. Consultez le message ci-dessus.
  pause
)

exit /b %ATHAR_EXIT%
