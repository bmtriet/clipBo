import tkinter as tk
import sys

root = tk.Tk()
root.title("AI Assistant")
root.overrideredirect(True)
root.attributes('-topmost', True)
root.configure(bg="#cccccc") # Viền mỏng 1px

def on_enter(e, row_frame, elements):
    row_frame.configure(bg="#f4f6f8")
    for el in elements:
        el.configure(bg="#f4f6f8")

def on_leave(e, row_frame, elements):
    row_frame.configure(bg="white")
    for el in elements:
        el.configure(bg="white")

main_frame = tk.Frame(root, bg="white", padx=20, pady=20)
main_frame.pack(padx=1, pady=1, fill="both", expand=True)

# Header
header_frame = tk.Frame(main_frame, bg="white")
header_frame.pack(fill="x", pady=(0, 20))

icon_label = tk.Label(header_frame, text="✨", font=("Segoe UI Emoji", 20), bg="#eef6fc", fg="#1075d2", width=3, height=1)
icon_label.pack(side="left", padx=(0, 15))

title_frame = tk.Frame(header_frame, bg="white")
title_frame.pack(side="left", fill="both", expand=True)

tk.Label(title_frame, text="Chọn chức năng", font=("Arial", 16, "bold"), bg="white", fg="#202124", anchor="w").pack(fill="x")
tk.Label(title_frame, text="Bấm phím 1-6 hoặc ESC để hủy", font=("Arial", 10), bg="white", fg="#5f6368", anchor="w").pack(fill="x")

options = {
    '1': ("Thêm dấu tiếng Việt", "á", "add_marks"),
    '2': ("Dịch sang Tiếng Anh", "A文", "trans_en"),
    '3': ("Dịch sang Tiếng Hoa Phồn thể", "繁", "trans_zhtw"),
    '4': ("Dịch sang Tiếng Khmer", "យ", "trans_khmer"),
    '5': ("Dịch sang Tiếng Việt", "Vi", "trans_vi"),
    '6': ("Hỏi đáp AI", "💬", "qa")
}

def trigger_action(action):
    print(action)
    root.destroy()
    sys.exit(0)

# Render các dòng
for key, (text, icon, action) in options.items():
    row = tk.Frame(main_frame, bg="white", pady=6, padx=8)
    row.pack(fill="x", pady=2)
    
    badge = tk.Label(row, text=key, font=("Arial", 11, "bold"), bg="#008298", fg="white", width=3, pady=2)
    badge.pack(side="left", padx=(0, 12))
    
    ic = tk.Label(row, text=icon, font=("Arial", 11, "bold"), bg="#e1f3f8", fg="#0078d4", width=4, pady=2)
    ic.pack(side="left", padx=(0, 12))
    
    lbl = tk.Label(row, text=text, font=("Arial", 11, "bold"), bg="white", fg="#202124")
    lbl.pack(side="left")
    
    chev = tk.Label(row, text="›", font=("Arial", 16), bg="white", fg="#dadce0")
    chev.pack(side="right")
    
    els = [lbl, chev]
    for el in [row, badge, ic, lbl, chev]:
        el.bind("<Enter>", lambda e, r=row, els=els: on_enter(e, r, els))
        el.bind("<Leave>", lambda e, r=row, els=els: on_leave(e, r, els))
        el.bind("<Button-1>", lambda e, act=action: trigger_action(act))

# Thêm đường phân cách mờ
separator = tk.Frame(main_frame, bg="#f0f0f0", height=1)
separator.pack(fill="x", pady=(15, 10))

footer = tk.Label(main_frame, text="ⓘ Mẹo: Bấm phím 1-6 để chọn nhanh chức năng tương ứng.", font=("Arial", 9), bg="white", fg="#80868b", anchor="w")
footer.pack(fill="x")

def on_key(event):
    if event.keysym == 'Escape':
        root.destroy()
        sys.exit(0)
    elif event.char in options:
        trigger_action(options[event.char][2])

root.bind('<Key>', on_key)
root.focus_force()

# Tính toán vị trí chuột & Corner-aware
root.update_idletasks()
w = root.winfo_width()
h = root.winfo_height()
x = root.winfo_pointerx() - 40
y = root.winfo_pointery() - 40

sw = root.winfo_screenwidth()
sh = root.winfo_screenheight()

if x + w > sw:
    x = sw - w
if y + h > sh:
    y = sh - h
if x < 0:
    x = 0
if y < 0:
    y = 0

root.geometry(f"+{x}+{y}")
# Exit automatically after 1 sec so it doesn't hang the terminal
root.after(1000, root.destroy)
root.mainloop()
