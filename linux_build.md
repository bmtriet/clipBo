# Build KoDauKoVui on Linux

Repo này build Linux từ cùng codebase với Windows, nhưng artifact phải được đóng gói trên Linux.

## 1. Prerequisites

Cài sẵn:

- Python 3.10+
- Node.js 20+ và `npm`
- `xclip`
- `xdotool` nếu muốn focus restore và popup positioning đầy đủ
- các GUI/runtime dependency cần cho `pywebview` trên distro của bạn

Kiểm tra nhanh:

```bash
python3 --version
node --version
npm --version
xclip -version
```

## 2. Build bằng script

Từ root repo:

```bash
chmod +x build_linux.sh
./build_linux.sh
```

Script sẽ tự:

- tạo `.build-venv`
- cài Python dependencies + `pyinstaller`
- cài thêm Linux GUI backend từ `requirements-linux.txt`
- chạy `npm ci` và `npm run build` trong `webui/`
- build PyInstaller one-folder bằng `kodaukovui.spec`
- nén release thành `dist/KoDauKoVui-linux-x64.tar.gz`

## 3. Kết quả mong đợi

```text
dist/
  kodaukovui/
    kodaukovui
    _internal/...
  KoDauKoVui-linux-x64.tar.gz
```

## 4. Cấu hình runtime

App đọc `.env` cạnh executable/runtime folder:

```bash
cp .env.example dist/kodaukovui/.env
```

Điền ít nhất một API key hợp lệ trước khi chạy.

## 5. Chạy thử artifact

```bash
./dist/kodaukovui/kodaukovui
```

Nên verify:

1. app mở không lỗi thiếu module
2. `--webview qa` hoạt động
3. `--webview popup` hoạt động
4. hotkey + selection chạy được với `xclip`
5. popup positioning/focus restore hoạt động khi có `xdotool`
