import tkinter as tk
from tkinter import ttk
import sys
import json

root = tk.Tk()
root.title("KoDauKoVui")
root.attributes('-topmost', True)

root.update_idletasks()
w = 600
h = 400
x = root.winfo_screenwidth()//2 - w//2
y = root.winfo_screenheight()//2 - h//2
root.geometry(f"{w}x{h}+{x}+{y}")
root.configure(bg="#ffffff")

font_label = ("Segoe UI", 10, "bold")
font_text = ("Segoe UI", 10)

tk.Label(root, text="Nhập yêu cầu cho AI (Prompt):", font=font_label, bg="#ffffff", fg="#0d4a52").pack(anchor="w", padx=20, pady=(15, 5))

text_frame = tk.Frame(root, bg="#ffffff")
text_frame.pack(fill="both", expand=True, padx=20)

text_widget = tk.Text(text_frame, font=font_text, wrap="word", relief="solid", bd=1, highlightthickness=1, highlightcolor="#0d7a8a", highlightbackground="#e5e7eb")
text_widget.pack(fill="both", expand=True)

placeholder = "Nhập câu hỏi hoặc yêu cầu của bạn..."
text_widget.insert("1.0", placeholder)
text_widget.config(fg="#9ca3af")

def on_focus_in(e):
    if text_widget.get("1.0", "end-1c") == placeholder:
        text_widget.delete("1.0", "end")
        text_widget.config(fg="#1a1a2e")

def on_focus_out(e):
    if not text_widget.get("1.0", "end-1c").strip():
        text_widget.insert("1.0", placeholder)
        text_widget.config(fg="#9ca3af")

text_widget.bind("<FocusIn>", on_focus_in)
text_widget.bind("<FocusOut>", on_focus_out)

counter_lbl = tk.Label(text_frame, text="0/2000", bg="#ffffff", fg="#9ca3af", font=("Segoe UI", 9))
counter_lbl.place(relx=1.0, rely=1.0, anchor="se", x=-5, y=-5)

def on_type(e):
    root.after(10, update_counter)

def update_counter():
    content = text_widget.get("1.0", "end-1c")
    if content == placeholder:
        content = ""
    count = len(content)
    counter_lbl.config(text=f"{count}/2000")

text_widget.bind("<KeyRelease>", on_type)

frame = tk.Frame(root, bg="#ffffff")
frame.pack(fill="x", padx=20, pady=15)

# Left side: Language
left_frame = tk.Frame(frame, bg="#ffffff")
left_frame.pack(side="left")

tk.Label(left_frame, text="Ngôn ngữ trả lời:", bg="#ffffff", font=font_label, fg="#1a1a2e").pack(anchor="w", pady=(0,5))
lang_var = tk.StringVar(value="🌐 Auto")

style = ttk.Style()
style.theme_use('clam')
style.configure("TCombobox", background="#ffffff", fieldbackground="#ffffff", foreground="#1a1a2e", borderwidth=1, lightcolor="#e5e7eb", darkcolor="#e5e7eb", arrowcolor="#1a1a2e")

cb = ttk.Combobox(left_frame, textvariable=lang_var, values=["🌐 Auto", "🇻🇳 VI", "🇬🇧 EN", "🇹🇼 ZH-tw"], state="readonly", width=15, font=font_text)
cb.pack(anchor="w")

# Right side: Buttons
btn_frame = tk.Frame(frame, bg="#ffffff")
btn_frame.pack(side="right", anchor="s")

def submit(e=None):
    content = text_widget.get("1.0", "end-1c")
    if content == placeholder:
        content = ""
    lang = lang_var.get().split(" ")[-1]
    print(json.dumps({"prompt": content.strip(), "lang": lang}), flush=True)
    root.destroy()
    sys.exit(0)

def cancel(e=None):
    root.destroy()
    sys.exit(1)

btn_cancel = tk.Button(btn_frame, text="✕  Hủy (ESC)", command=cancel, bg="#ffffff", fg="#1a1a2e", font=("Segoe UI", 9), relief="solid", bd=1, padx=15, pady=6, cursor="hand2")
btn_cancel.pack(side="left", padx=(0, 10))

btn_submit = tk.Button(btn_frame, text="✈  Gửi (Enter)", command=submit, bg="#0d7a8a", fg="white", font=("Segoe UI", 9, "bold"), relief="flat", padx=15, pady=6, cursor="hand2")
btn_submit.pack(side="left")

btn_cancel.bind("<Enter>", lambda e: btn_cancel.config(bg="#f3f4f6"))
btn_cancel.bind("<Leave>", lambda e: btn_cancel.config(bg="#ffffff"))
btn_submit.bind("<Enter>", lambda e: btn_submit.config(bg="#0b6371"))
btn_submit.bind("<Leave>", lambda e: btn_submit.config(bg="#0d7a8a"))

def handle_return(e):
    if not e.state & 0x0001:  # Shift not pressed
        submit()
        return "break"

text_widget.bind('<Return>', handle_return)
root.bind('<Escape>', cancel)

update_counter()
root.mainloop()
