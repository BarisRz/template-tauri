mod lamp;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            lamp::get_lamp_state,
            lamp::set_power,
            lamp::set_bright,
            lamp::set_ct,
            lamp::set_rgb
        ])
        .run(tauri::generate_context!())
        .expect("Erreur au lancement de l'app");
}
