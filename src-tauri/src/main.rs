#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod lamp;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            lamp::get_lamp_state,
            lamp::set_power,
            lamp::set_color_rgb,
        ])
        .run(tauri::generate_context!())
        .expect("Erreur au lancement de l'app");
}