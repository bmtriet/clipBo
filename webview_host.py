import sys
import json
import webview
import os

page = "qa"
ui_lang = "en"
if len(sys.argv) > 1:
    page = sys.argv[1]
if len(sys.argv) > 2:
    ui_lang = sys.argv[2]

html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "webui", "dist", "index.html"))
url = f"file://{html_path}?page={page}&uilang={ui_lang}"

from dotenv import set_key
env_file = os.path.join(os.path.dirname(__file__), '.env')

class Api:
    def submitQa(self, prompt, lang, length="medium", append_question=False):
        print(json.dumps({"prompt": prompt, "lang": lang, "length": length, "append_question": append_question}), flush=True)
        if len(webview.windows) > 0:
            webview.windows[0].destroy()
        sys.exit(0)

    def cancelQa(self):
        if len(webview.windows) > 0:
            webview.windows[0].destroy()
        sys.exit(1)

    def submitPopup(self, action, targetLang=""):
        print(action, flush=True)
        if len(webview.windows) > 0:
            webview.windows[0].destroy()
        sys.exit(0)

    def cancelPopup(self):
        if len(webview.windows) > 0:
            webview.windows[0].destroy()
        sys.exit(1)

    def setUiLanguage(self, lang):
        try:
            set_key(env_file, "UI_LANGUAGE", lang)
            return True
        except Exception as e:
            print(f"Error saving language: {e}", flush=True)
            return False

import subprocess
import re

def get_mouse_position():
    try:
        res = subprocess.run(["xdotool", "getmouselocation"], capture_output=True, text=True, timeout=0.5)
        if res.returncode == 0:
            match = re.search(r"x:(\d+)\s+y:(\d+)", res.stdout)
            if match:
                return int(match.group(1)), int(match.group(2))
    except Exception:
        pass
    return None

if __name__ == '__main__':
    api = Api()
    
    width = 600 if page == "qa" else 350
    height = 250 if page == "qa" else 450
    title = "KoDauKoVui" if page == "qa" else "Chọn chức năng"

    active_screen = None
    mouse_pos = get_mouse_position()
    if mouse_pos:
        mx, my = mouse_pos
        for s in webview.screens:
            if s.x <= mx < (s.x + s.width) and s.y <= my < (s.y + s.height):
                active_screen = s
                break

    if active_screen:
        window = webview.create_window(title, url, js_api=api, width=width, height=height, resizable=False, frameless=True, transparent=True, easy_drag=False, screen=active_screen)
    else:
        window = webview.create_window(title, url, js_api=api, width=width, height=height, resizable=False, frameless=True, transparent=True, easy_drag=False)
    
    webview.start()
