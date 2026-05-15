#!/bin/bash

# Navigate to script directory just in case it's called from outside
cd "$(dirname "$0")"

cleanup_stuck_processes() {
    local repo_dir
    repo_dir="$(pwd)"

    mapfile -t stale_pids < <(
        pgrep -af "python.*(main\.py|webview_host\.py|roi_capture\.py)" | while read -r pid cmd; do
            if [[ "$cmd" == *"$repo_dir"* ]]; then
                echo "$pid"
            fi
        done
    )

    if [ "${#stale_pids[@]}" -gt 0 ]; then
        echo "Killing stuck KoDauKoVui processes: ${stale_pids[*]}"
        kill "${stale_pids[@]}" 2>/dev/null || true
        sleep 1
        for pid in "${stale_pids[@]}"; do
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null || true
            fi
        done
    fi
}

if [ ! -f "webui/dist/index.html" ]; then
    echo "Missing webui/dist/index.html. Please build the React UI first with:"
    echo "  cd webui && npm install && npm run build"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment 'venv'..."
    python3 -m venv --system-site-packages venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip and install dependencies
echo "Checking and installing dependencies..."
python -m pip install --quiet --upgrade pip
python -m pip install --quiet -r requirements.txt
if [ -f "requirements-linux.txt" ]; then
    python -m pip install --quiet -r requirements-linux.txt
fi

cleanup_stuck_processes

# Set IME environment variables before launching Python
# This ensures the broker subprocess inherits the correct fcitx5 config
if command -v fcitx5-remote &>/dev/null || command -v fcitx-remote &>/dev/null; then
    export QT_IM_MODULE=fcitx
    export GTK_IM_MODULE=fcitx
    export XMODIFIERS="@im=fcitx"
else
    export QT_IM_MODULE=ibus
    export GTK_IM_MODULE=ibus
    export XMODIFIERS="@im=ibus"
fi

# Point Qt to the venv's PyQt5 plugin directory (contains fcitx5 input context plugin)
VENV_QT_PLUGINS="$(pwd)/venv/lib/python3.10/site-packages/PyQt5/Qt5/plugins"
if [ -d "$VENV_QT_PLUGINS" ]; then
    export QT_PLUGIN_PATH="$VENV_QT_PLUGINS${QT_PLUGIN_PATH:+:$QT_PLUGIN_PATH}"
fi

# Run the application
echo "Starting the application..."
python main.py
