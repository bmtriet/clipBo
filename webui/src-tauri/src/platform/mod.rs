use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct PlatformSummary {
    pub os: &'static str,
    pub hotkey_backend: &'static str,
    pub clipboard_backend: &'static str,
    pub screen_capture_backend: &'static str,
}

pub fn summary() -> PlatformSummary {
    PlatformSummary {
        os: std::env::consts::OS,
        hotkey_backend: hotkey_backend(),
        clipboard_backend: clipboard_backend(),
        screen_capture_backend: screen_capture_backend(),
    }
}

#[cfg(target_os = "macos")]
fn hotkey_backend() -> &'static str {
    "macOS Accessibility APIs"
}

#[cfg(target_os = "windows")]
fn hotkey_backend() -> &'static str {
    "Windows native hotkey APIs"
}

#[cfg(target_os = "linux")]
fn hotkey_backend() -> &'static str {
    "Linux X11/Wayland adapter"
}

#[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
fn hotkey_backend() -> &'static str {
    "unsupported"
}

#[cfg(target_os = "macos")]
fn clipboard_backend() -> &'static str {
    "NSPasteboard"
}

#[cfg(target_os = "windows")]
fn clipboard_backend() -> &'static str {
    "Windows Clipboard"
}

#[cfg(target_os = "linux")]
fn clipboard_backend() -> &'static str {
    "X11/Wayland clipboard adapter"
}

#[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
fn clipboard_backend() -> &'static str {
    "unsupported"
}

#[cfg(target_os = "macos")]
fn screen_capture_backend() -> &'static str {
    "ScreenCaptureKit/CoreGraphics"
}

#[cfg(target_os = "windows")]
fn screen_capture_backend() -> &'static str {
    "Windows Graphics Capture"
}

#[cfg(target_os = "linux")]
fn screen_capture_backend() -> &'static str {
    "XDG Portal/X11 adapter"
}

#[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
fn screen_capture_backend() -> &'static str {
    "unsupported"
}
