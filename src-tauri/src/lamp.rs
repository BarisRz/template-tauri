use std::io::{BufRead, BufReader, Write};
use std::net::TcpStream;
use serde::{Deserialize, Serialize};

const IP: &str = "192.168.1.85";
const PORT: u16 = 55443;

#[derive(Serialize, Deserialize, Debug)]
pub struct LampState {
    pub power: String,
    pub bright: u8,
    pub color_mode: u8,
    pub ct: u16,
    pub rgb: u32,
    pub hue: u16,
    pub sat: u8,
}

fn connect() -> Result<TcpStream, String> {
    TcpStream::connect(format!("{}:{}", IP, PORT))
        .map_err(|e| format!("Connexion échouée : {}", e))
}

fn send_and_receive(stream: &mut TcpStream, command: serde_json::Value) -> Result<serde_json::Value, String> {
    let mut payload = command.to_string();
    payload.push_str("\r\n");

    stream
        .write_all(payload.as_bytes())
        .map_err(|e| format!("Envoi échoué : {}", e))?;

    let mut reader = BufReader::new(stream.try_clone().map_err(|e| e.to_string())?);
    let mut response = String::new();

    reader
        .read_line(&mut response)
        .map_err(|e| format!("Lecture échouée : {}", e))?;

    serde_json::from_str(&response)
        .map_err(|e| format!("Parsing JSON échoué : {}", e))
}

pub fn send_command(method: &str, params: serde_json::Value) -> Result<(), String> {
    let mut stream = connect()?;

    let command = serde_json::json!({
        "id": 1,
        "method": method,
        "params": params
    });

    let response = send_and_receive(&mut stream, command)?;

    if response["result"][0] == "ok" {
        Ok(())
    } else {
        Err(format!("Erreur lampe : {}", response))
    }
}

#[tauri::command]
pub async fn get_lamp_state() -> Result<LampState, String> {
    let mut stream = TcpStream::connect(format!("{}:{}", IP, PORT))
        .map_err(|e| format!("Connexion échouée : {}", e))?;

    stream
        .set_read_timeout(Some(std::time::Duration::from_secs(5)))
        .map_err(|e| format!("Timeout config échoué : {}", e))?;

    let command = serde_json::json!({
        "id": 1,
        "method": "get_prop",
        "params": ["power", "bright", "color_mode", "ct", "rgb", "hue", "sat"]
    });

    let response = send_and_receive(&mut stream, command)?;

    let results = response["result"]
        .as_array()
        .ok_or("Réponse invalide")?;

    Ok(LampState {
        power:      results[0].as_str().unwrap_or("off").to_string(),
        bright:     results[1].as_str().unwrap_or("1").parse().unwrap_or(1),
        color_mode: results[2].as_str().unwrap_or("2").parse().unwrap_or(2),
        ct:         results[3].as_str().unwrap_or("4000").parse().unwrap_or(4000),
        rgb:        results[4].as_str().unwrap_or("0").parse().unwrap_or(0),
        hue:        results[5].as_str().unwrap_or("0").parse().unwrap_or(0),
        sat:        results[6].as_str().unwrap_or("0").parse().unwrap_or(0),
    })
}

#[tauri::command]
pub fn set_power(power: String) -> Result<(), String> {
    if power != "on" && power != "off" {
        return Err("Valeur invalide : utilise 'on' ou 'off'".to_string());
    }
    send_command("set_power", serde_json::json!([power, "smooth", 500]))
}

#[tauri::command]
pub fn set_bright_rgb(state: LampState) -> Result<(), String> {
    if state.bright < 1 || state.bright > 100 {
        return Err("Luminosité invalide : doit être entre 1 et 100".to_string());
    }
    send_command("set_bright", serde_json::json!([state.bright, "smooth", 500]))
}