@echo off
setlocal

cd /d "%~dp0"

set "BUILD_VENV=.build-venv"
set "DIST_DIR=dist\KoDauKoVui"
set "ARCHIVE=dist\KoDauKoVui-windows-x64.zip"
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
echo Using Windows build interpreter: %PYTHON_LAUNCHER%

if not exist "%BUILD_VENV%\Scripts\python.exe" (
  %PYTHON_LAUNCHER% -m venv "%BUILD_VENV%"
  if errorlevel 1 exit /b 1
)

call "%BUILD_VENV%\Scripts\activate.bat"
python -m pip install --upgrade pip
if errorlevel 1 exit /b 1

python -m pip install -r requirements.txt pyinstaller
if errorlevel 1 exit /b 1

pushd webui
call npm ci
if errorlevel 1 exit /b 1

call npm run build
if errorlevel 1 exit /b 1
popd

python -m PyInstaller --noconfirm kodaukovui.spec
if errorlevel 1 exit /b 1

if exist "%ARCHIVE%" del /f /q "%ARCHIVE%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%DIST_DIR%\*' -DestinationPath '%ARCHIVE%' -Force"
if errorlevel 1 exit /b 1

echo.
echo Build completed: %DIST_DIR%\KoDauKoVui.exe
echo Release archive: %ARCHIVE%
