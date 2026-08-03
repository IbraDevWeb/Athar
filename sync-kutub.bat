@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv-rag\Scripts\python.exe" (
  echo [Athar RAG] Creation de l'environnement Python...
  py -3 -m venv .venv-rag 2>nul || python -m venv .venv-rag
)

call ".venv-rag\Scripts\activate.bat"
python -m pip install --disable-pip-version-check -q -r rag\requirements.txt

if "%ATHAR_BOT_CONTACT%"=="" (
  echo.
  echo [Information] ATHAR_BOT_CONTACT n'est pas configure.
  echo Le collecteur utilisera un identifiant generique. Vous pouvez definir une adresse de contact avant une synchronisation importante.
  echo.
)

python rag\scrape_kutub.py --max-pages 25

echo.
echo Synchronisation terminee. Relancez start-athar-rag.bat pour voir le corpus.
pause
endlocal
