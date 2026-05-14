@echo off
setlocal

cd /d "%~dp0"

set "PYTHON_LAUNCHER="

for %%V in (3.13 3.12 3.11 3.10) do (
  py -%%V -c "import sys; print(sys.version)" >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_LAUNCHER=py -%%V"
    goto :python_found
  )
)

echo [ERROR] No supported Windows Python found.
echo [ERROR] Install Python 3.10, 3.11, 3.12, or 3.13.
echo [ERROR] Python 3.14 is not supported by pythonnet, which pywebview uses on Windows.
exit /b 1

:python_found
echo Using Windows runtime interpreter: %PYTHON_LAUNCHER%

if not exist "venv\Scripts\python.exe" (
  %PYTHON_LAUNCHER% -m venv venv
  if errorlevel 1 exit /b 1
)

call "venv\Scripts\activate.bat"
python -m pip install --upgrade pip
if errorlevel 1 exit /b 1

python -m pip install -r requirements.txt
if errorlevel 1 exit /b 1

python main.py
