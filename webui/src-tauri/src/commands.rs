use serde::Serialize;
use tauri::State;

use crate::{
    platform,
    settings::{AppState, SaveSnapshotResponse, SettingsSnapshot},
};

#[derive(Debug, Serialize)]
pub struct ChatResponse {
    pub ok: bool,
    pub error: Option<String>,
    pub session: Option<serde_json::Value>,
}

#[tauri::command]
pub fn get_settings_snapshot(state: State<'_, AppState>) -> SettingsSnapshot {
    state.snapshot()
}

#[tauri::command]
pub fn save_settings_snapshot(state: State<'_, AppState>, payload: String) -> SaveSnapshotResponse {
    match serde_json::from_str::<SettingsSnapshot>(&payload)
        .map_err(|err| err.to_string())
        .and_then(|snapshot| state.save_snapshot(snapshot).map_err(|err| err.to_string()))
    {
        Ok(snapshot) => SaveSnapshotResponse {
            ok: true,
            error: None,
            smart_actions: Some(snapshot.smart_actions),
            builtin_actions: Some(snapshot.builtin_actions),
        },
        Err(error) => SaveSnapshotResponse {
            ok: false,
            error: Some(error),
            smart_actions: None,
            builtin_actions: None,
        },
    }
}

#[tauri::command]
pub fn set_ui_language(_lang: String) {}

#[tauri::command]
pub fn submit_ask(prompt: String, response_mode: Option<String>) {
    println!("submit_ask stub: prompt={prompt:?}, response_mode={response_mode:?}");
}

#[tauri::command]
pub fn cancel_ask() {}

#[tauri::command]
pub fn submit_popup(action_id: String) {
    println!("submit_popup stub: action_id={action_id}");
}

#[tauri::command]
pub fn cancel_popup() {}

#[tauri::command]
pub fn open_settings() {}

#[tauri::command]
pub fn close_settings(_saved: bool) {}

#[tauri::command]
pub fn choose_image_source(source: String) {
    println!("choose_image_source stub: source={source}");
}

#[tauri::command]
pub fn cancel_image_source() {}

#[tauri::command]
pub fn bootstrap_chat() -> ChatResponse {
    ChatResponse {
        ok: false,
        error: Some("Chat runtime is not ported to Rust yet.".to_string()),
        session: None,
    }
}

#[tauri::command]
pub fn send_chat_message(_prompt: String) -> ChatResponse {
    ChatResponse {
        ok: false,
        error: Some("Chat runtime is not ported to Rust yet.".to_string()),
        session: None,
    }
}

#[tauri::command]
pub fn insert_latest_reply() -> serde_json::Value {
    serde_json::json!({
        "ok": false,
        "error": "Paste-back runtime is not ported to Rust yet."
    })
}

#[tauri::command]
pub fn close_chat() {}

#[tauri::command]
pub fn platform_summary() -> platform::PlatformSummary {
    platform::summary()
}
