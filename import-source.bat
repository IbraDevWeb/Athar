@echo off
setlocal
cd /d "%~dp0"
set "PYTHON=.venv-rag\Scripts\python.exe"
if not exist "%PYTHON%" set "PYTHON=python"
if "%~1"=="" (
  echo Usage: import-source.bat ^<source^> ^<fichier-ou-dossier^>
  echo Exemple: import-source.bat local mes-documents
  exit /b 2
)
if "%~2"=="" (
  echo Le chemin du fichier ou dossier est obligatoire.
  exit /b 2
)
"%PYTHON%" rag\ingest_source.py ingest --source "%~1" --input "%~2"
set "ATHAR_EXIT=%ERRORLEVEL%"
pause
endlocal & exit /b %ATHAR_EXIT%
