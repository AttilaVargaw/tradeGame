// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[tauri::command]
fn my_custom_command(argument: String) {
    println!("{}", argument);
}

fn main() {
  tauri::Builder
  ::default()
  .plugin(tauri_plugin_sql::Builder::default().build())
  .invoke_handler(tauri::generate_handler![my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}