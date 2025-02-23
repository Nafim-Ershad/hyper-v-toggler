// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

#[tauri::command]
fn enable_hyper_v() -> Result<String, String> {
    execute_command("bcdedit /set hypervisorlaunchtype auto")
}

#[tauri::command]
fn disable_hyper_v() -> Result<String, String> {
    execute_command("bcdedit /set hypervisorlaunchtype off")
}

#[tauri::command]
fn check_status() -> Result<String, String> {
    let output = Command::new("cmd")
        .args(["/C", "bcdedit"])
        .output()
        .map_err(|e| e.to_string())?;

    let output_str = String::from_utf8_lossy(&output.stdout);
    if output_str.contains("hypervisorlaunchtype") {
        if output_str.contains("auto") {
            Ok("Enabled".to_string())
        } else {
            Ok("Disabled".to_string())
        }
    } else {
        Ok("Status unknown".to_string())
    }
}

fn execute_command(command: &str) -> Result<String, String> {
    Command::new("cmd")
        .args(["/c", command])
        // .creation_flags(0x08000000) // CREATE_NO_WINDOW
        .output()
        .map_err(|e| e.to_string())?;

    Ok(format!("Command executed: {}", command))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![enable_hyper_v, disable_hyper_v, check_status])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}