#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod lamp;
mod tray;

fn main() {
    tauri::Builder::default()
        // Doit rester le premier plugin : relancer l'app réaffiche la fenêtre existante
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            tray::show_main_window(app);
        }))
        .setup(|app| Ok(tray::setup(app)?))
        .on_window_event(tray::on_window_event)
        .invoke_handler(tauri::generate_handler![
            lamp::get_lamp_state,
            lamp::set_power,
            lamp::set_bright,
            lamp::set_ct,
            lamp::set_rgb,
            tray::open_main_window,
            tray::quit_app
        ])
        .run(tauri::generate_context!())
        .expect("Erreur au lancement de l'app");
}
