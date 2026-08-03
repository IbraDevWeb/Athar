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
echo.
if not "%ATHAR_EXIT%"=="0" (
  echo [Athar RAG] Le demarrage a echoue. Consultez le message ci-dessus et rag\server.log.
  pause
  exit /b %ATHAR_EXIT%
)

echo [Athar RAG] Le serveur fonctionne maintenant en arriere-plan.
echo [Athar RAG] Vous pouvez fermer cette fenetre sans interrompre la Bibliotheque.
echo [Athar RAG] Pour l'arreter plus tard, utilisez stop-athar-rag.bat.
pause
exit /b 0
