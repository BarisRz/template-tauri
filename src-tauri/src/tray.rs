use std::sync::Mutex;
use std::time::{Duration, Instant};

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, AppHandle, Manager, PhysicalPosition, Window, WindowEvent,
};

const TRAY_WINDOW: &str = "tray";
const MAIN_WINDOW: &str = "main";
const TRAY_ICON: &str = "main-tray";

// Moment où la mini-fenêtre a été cachée suite à une perte de focus.
// Évite qu'un clic sur l'icône (qui fait perdre le focus) la rouvre aussitôt.
pub struct TrayState {
    last_hidden: Mutex<Instant>,
}

// L'icône du tray n'est visible que quand la fenêtre principale est fermée
fn set_tray_visible(app: &AppHandle, visible: bool) {
    if let Some(tray) = app.tray_by_id(TRAY_ICON) {
        let _ = tray.set_visible(visible);
    }
}

pub fn show_main_window(app: &AppHandle) {
    if let Some(tray_window) = app.get_webview_window(TRAY_WINDOW) {
        let _ = tray_window.hide();
    }
    set_tray_visible(app, false);
    if let Some(window) = app.get_webview_window(MAIN_WINDOW) {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

#[tauri::command]
pub fn open_main_window(app: AppHandle) {
    show_main_window(&app);
}

#[tauri::command]
pub fn quit_app(app: AppHandle) {
    app.exit(0);
}

fn toggle_tray_window(app: &AppHandle, click: PhysicalPosition<f64>) {
    let Some(window) = app.get_webview_window(TRAY_WINDOW) else {
        return;
    };

    if window.is_visible().unwrap_or(false) {
        let _ = window.hide();
        return;
    }

    let last_hidden = *app.state::<TrayState>().last_hidden.lock().unwrap();
    if last_hidden.elapsed() < Duration::from_millis(250) {
        return;
    }

    // Place la fenêtre au-dessus (ou en dessous) de l'icône, dans la zone de travail de l'écran
    if let (Ok(size), Ok(Some(monitor))) = (
        window.outer_size(),
        window.monitor_from_point(click.x, click.y),
    ) {
        let area = monitor.work_area();
        let margin = (12.0 * monitor.scale_factor()) as i32;
        let (width, height) = (size.width as i32, size.height as i32);
        let (area_x, area_y) = (area.position.x, area.position.y);
        let (area_w, area_h) = (area.size.width as i32, area.size.height as i32);

        let x = (click.x as i32 - width / 2)
            .min(area_x + area_w - width - margin)
            .max(area_x + margin);
        let y = if (click.y as i32) < area_y {
            area_y + margin
        } else {
            area_y + area_h - height - margin
        };
        let _ = window.set_position(PhysicalPosition::new(x, y));
    }

    let _ = window.show();
    let _ = window.set_focus();
}

pub fn setup(app: &mut App) -> tauri::Result<()> {
    app.manage(TrayState {
        last_hidden: Mutex::new(Instant::now() - Duration::from_secs(1)),
    });

    let show = MenuItem::with_id(app, "show", "Afficher", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quitter", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    let tray = TrayIconBuilder::with_id(TRAY_ICON)
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Light Hub")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => show_main_window(app),
            "quit" => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                position,
                ..
            } = event
            {
                toggle_tray_window(tray.app_handle(), position);
            }
        })
        .build(app)?;

    // La fenêtre principale est ouverte au démarrage : l'icône reste cachée
    tray.set_visible(false)?;

    Ok(())
}

pub fn on_window_event(window: &Window, event: &WindowEvent) {
    match event {
        // Fermer une fenêtre la cache dans le system tray au lieu de quitter l'app
        WindowEvent::CloseRequested { api, .. } => {
            let _ = window.hide();
            api.prevent_close();
            if window.label() == MAIN_WINDOW {
                set_tray_visible(window.app_handle(), true);
            }
        }
        // La mini-fenêtre se cache dès qu'on clique ailleurs
        WindowEvent::Focused(false) if window.label() == TRAY_WINDOW => {
            let _ = window.hide();
            *window.state::<TrayState>().last_hidden.lock().unwrap() = Instant::now();
        }
        _ => {}
    }
}
