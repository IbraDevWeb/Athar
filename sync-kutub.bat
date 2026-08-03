@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv-rag\Scripts\python.exe" (
  echo [Athar RAG] Creation de l'environnement Python du collecteur...
  py -3 -m venv .venv-rag 2>nul || python -m venv .venv-rag
)

call ".venv-rag\Scripts\activate.bat"
python -m pip install --disable-pip-version-check -q -r rag\requirements.txt
if errorlevel 1 (
  echo [Athar RAG] Impossible d'installer les dependances du collecteur.
  pause
  exit /b 1
)

if "%ATHAR_BOT_CONTACT%"=="" (
  echo.
  echo [Information] ATHAR_BOT_CONTACT n'est pas configure.
  echo Pour une synchronisation importante, definissez une adresse de contact :
  echo   set ATHAR_BOT_CONTACT=votre-adresse@email.com
  echo.
)

echo [Athar RAG] Verification de robots.txt, puis import du prochain lot...
python rag\ingest_kutub.py sync --batch-size 25 %*
set ATHAR_EXIT=%ERRORLEVEL%

echo.
python rag\ingest_kutub.py status

echo.
if "%ATHAR_EXIT%"=="0" (
  echo Synchronisation terminee. Les pages deja importees et les doublons ne sont pas telecharges inutilement.
) else (
  echo La synchronisation s'est arretee ou a rencontre un blocage. Consultez le resume ci-dessus.
)
echo Relancez ou actualisez Athar pour voir le corpus mis a jour.
pause
endlocal
exit /b %ATHAR_EXIT%
