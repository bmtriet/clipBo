#!/usr/bin/env python3
"""
Popup UI cho AI Text Assistant - chạy như subprocess độc lập.
In ra stdout: action được chọn, hoặc rỗng nếu user hủy.
Nhận argument: đường dẫn thư mục gốc (để tìm icons/)
"""
import sys
import os
import io
import tkinter as tk

BASE_DIR = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(__file__)
ICONS_DIR = os.path.join(BASE_DIR, "icons")

# Cố gắng import các thư viện SVG/Image
try:
    import cairosvg
    from PIL import Image, ImageTk
    HAS_SVG = True
except ImportError:
    HAS_SVG = False

def load_svg_icon(name, color="#0078d4", size=22):
    """Load SVG và trả về PhotoImage, hoặc None nếu không hỗ trợ."""
    if not HAS_SVG:
        return None
    path = os.path.join(ICONS_DIR, f"{name}.svg")
    if not os.path.exists(path):
        return None
    try:
        with open(path, "rb") as f:
            svg = f.read().decode()
        svg = svg.replace("currentColor", color)
        png = cairosvg.svg2png(bytestring=svg.encode(), output_width=size, output_height=size)
        img = Image.open(io.BytesIO(png)).convert("RGBA")
        return ImageTk.PhotoImage(img)
    except Exception:
        return None

OPTIONS = [
    ("1", "Thêm dấu tiếng Việt",       "type",           "add_marks"),
    ("2", "Dịch sang Tiếng Anh",         "languages",      "trans_en"),
    ("3", "Dịch sang Tiếng Hoa Phồn thể","globe",          "trans_zhtw"),
    ("4", "Dịch sang Tiếng Khmer",       "globe",          "trans_khmer"),
    ("5", "Dịch sang Tiếng Việt",        "globe",          "trans_vi"),
    ("6", "Hỏi đáp AI",                  "message-circle", "qa"),
]

FALLBACK_ICONS = {
    "type": "á",
    "languages": "A文",
    "globe": "🌐",
    "message-circle": "💬",
}

def main():
    root = tk.Tk()
    root.withdraw()  # Ẩn trước để setup xong mới show

    # Không dùng overrideredirect để tránh mất focus trên GNOME
    root.title("KoDauKoVui")
    root.attributes("-topmost", True)
    root.resizable(False, False)

    # Xóa viền nhưng giữ focus với wm_attributes thay vì overrideredirect
    root.configure(bg="#e8e8e8")  # bg ngoài = viền giả

    COLORS = {
        "bg": "#ffffff",
        "header_bg": "#f8fafc",
        "badge": "#0d7a8a",
        "badge_fg": "#ffffff",
        "icon_bg": "#e6f4f8",
        "icon_fg": "#0078d4",
        "text": "#1a1a2e",
        "subtitle": "#6b7280",
        "hover": "#f0f7fa",
        "sep": "#e5e7eb",
        "footer": "#9ca3af",
        "chevron": "#d1d5db",
        "accent": "#0d7a8a",
    }

    outer = tk.Frame(root, bg=COLORS["bg"], padx=1, pady=1)
    outer.pack(fill="both", expand=True)

    # ── Header ──────────────────────────────────────────
    hdr = tk.Frame(outer, bg=COLORS["header_bg"], padx=16, pady=14)
    hdr.pack(fill="x")

    spark_img = load_svg_icon("sparkles", color=COLORS["accent"], size=28)
    if spark_img:
        spark_lbl = tk.Label(hdr, image=spark_img, bg=COLORS["icon_bg"],
                             width=40, height=40, padx=6, pady=6)
        spark_lbl.image = spark_img  # giữ reference
    else:
        spark_lbl = tk.Label(hdr, text="✨", font=("Segoe UI Emoji", 18),
                             bg=COLORS["icon_bg"], fg=COLORS["accent"],
                             width=3, height=1)
    spark_lbl.pack(side="left", padx=(0, 14))

    title_col = tk.Frame(hdr, bg=COLORS["header_bg"])
    title_col.pack(side="left")
    tk.Label(title_col, text="Chọn chức năng",
             font=("Arial", 15, "bold"), bg=COLORS["header_bg"],
             fg=COLORS["text"], anchor="w").pack(fill="x")
    tk.Label(title_col, text="Bấm phím 1–6 hoặc ESC để hủy",
             font=("Arial", 9), bg=COLORS["header_bg"],
             fg=COLORS["subtitle"], anchor="w").pack(fill="x")

    # Separator
    tk.Frame(outer, bg=COLORS["sep"], height=1).pack(fill="x")

    # ── Rows ─────────────────────────────────────────────
    photo_refs = []  # giữ references tránh GC

    def make_row(parent, num, label, icon_name, action):
        row = tk.Frame(parent, bg=COLORS["bg"], pady=4, padx=14, cursor="hand2")
        row.pack(fill="x")

        # Badge số
        badge = tk.Label(row, text=num, font=("Arial", 10, "bold"),
                         bg=COLORS["badge"], fg=COLORS["badge_fg"],
                         width=3, pady=3)
        badge.pack(side="left", padx=(0, 10))

        # Icon SVG hoặc fallback emoji
        svg_img = load_svg_icon(icon_name, color=COLORS["icon_fg"], size=20)
        if svg_img:
            photo_refs.append(svg_img)
            ic_w = tk.Label(row, image=svg_img, bg=COLORS["icon_bg"],
                            padx=6, pady=6)
        else:
            ic_w = tk.Label(row, text=FALLBACK_ICONS.get(icon_name, "•"),
                            font=("Arial", 11), bg=COLORS["icon_bg"],
                            fg=COLORS["icon_fg"], width=3, pady=3)
        ic_w.pack(side="left", padx=(0, 12))

        # Label
        lbl = tk.Label(row, text=label, font=("Arial", 11, "bold"),
                       bg=COLORS["bg"], fg=COLORS["text"], anchor="w")
        lbl.pack(side="left", fill="x", expand=True)

        # Chevron
        chev = tk.Label(row, text="›", font=("Arial", 18),
                        bg=COLORS["bg"], fg=COLORS["chevron"])
        chev.pack(side="right")

        hover_els = [row, lbl, chev, ic_w]

        def on_enter(e):
            for el in hover_els:
                el.configure(bg=COLORS["hover"])

        def on_leave(e):
            for el in hover_els:
                el.configure(bg=COLORS["bg"])

        def on_click(e, act=action):
            print(act, flush=True)
            root.destroy()
            sys.exit(0)

        for el in [row, badge, ic_w, lbl, chev]:
            el.bind("<Enter>", on_enter)
            el.bind("<Leave>", on_leave)
            el.bind("<Button-1>", on_click)

        return row

    rows_frame = tk.Frame(outer, bg=COLORS["bg"], pady=6)
    rows_frame.pack(fill="x")

    for num, label, icon_name, action in OPTIONS:
        make_row(rows_frame, num, label, icon_name, action)

    # ── Footer ───────────────────────────────────────────
    tk.Frame(outer, bg=COLORS["sep"], height=1).pack(fill="x")
    tk.Label(outer, text="ⓘ  Bấm phím 1–6 để chọn nhanh.",
             font=("Arial", 9), bg=COLORS["bg"],
             fg=COLORS["footer"], anchor="w", padx=16, pady=8).pack(fill="x")

    # ── Keybinds ─────────────────────────────────────────
    key_map = {opt[0]: opt[3] for opt in OPTIONS}

    def on_key(event):
        if event.keysym == "Escape":
            root.destroy()
            sys.exit(1)
        elif event.char in key_map:
            print(key_map[event.char], flush=True)
            root.destroy()
            sys.exit(0)

    root.bind("<Key>", on_key)

    # ── Positioning (cursor-aware, corner-aware) ──────────
    root.update_idletasks()
    w = root.winfo_reqwidth()
    h = root.winfo_reqheight()
    mx = root.winfo_pointerx() - 40
    my = root.winfo_pointery() - 40
    sw = root.winfo_screenwidth()
    sh = root.winfo_screenheight()
    if mx + w > sw: mx = sw - w - 10
    if my + h > sh: my = sh - h - 10
    if mx < 0: mx = 10
    if my < 0: my = 10
    root.geometry(f"{w}x{h}+{mx}+{my}")

    root.deiconify()  # Hiện window
    root.lift()
    root.focus_force()
    root.mainloop()


if __name__ == "__main__":
    main()
