#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

BUILD_VENV=".build-venv"
DIST_DIR="dist/kodaukovui"
ARCHIVE="dist/KoDauKoVui-linux-x64.tar.gz"

if [ ! -d "$BUILD_VENV" ]; then
    python3 -m venv "$BUILD_VENV"
fi

source "$BUILD_VENV/bin/activate"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt pyinstaller
python -m pip install -r requirements-linux.txt

pushd webui >/dev/null
npm ci
npm run build
popd >/dev/null

python -m PyInstaller --noconfirm kodaukovui.spec

rm -f "$ARCHIVE"
tar -C dist -czf "$ARCHIVE" kodaukovui

echo
echo "Build completed: $DIST_DIR/kodaukovui"
echo "Release archive: $ARCHIVE"
