mod actions;
mod commands;
mod platform;
mod settings;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(settings::AppState::load())
        .invoke_handler(tauri::generate_handler![
            commands::get_settings_snapshot,
            commands::save_settings_snapshot,
            commands::set_ui_language,
            commands::submit_ask,
            commands::cancel_ask,
            commands::submit_popup,
            commands::cancel_popup,
            commands::open_settings,
            commands::close_settings,
            commands::choose_image_source,
            commands::cancel_image_source,
            commands::bootstrap_chat,
            commands::send_chat_message,
            commands::insert_latest_reply,
            commands::close_chat,
            commands::platform_summary,
        ])
        .run(tauri::generate_context!())
        .expect("error while running KoDauKoVui");
}
