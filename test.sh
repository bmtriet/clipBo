#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "=== Rust backend tests ==="
(cd webui/src-tauri && cargo test --lib)

echo ""
echo "=== React frontend tests ==="
(cd webui && npm test)
