import * as vscode from "vscode";
import { exec } from "child_process";
import * as os from "os";

const resolutions: any = {
  HD: { width: 1280, height: 720 },
  FullHD: { width: 1920, height: 1080 },
  "2K": { width: 2560, height: 1440 },
  "4K": { width: 3840, height: 2160 },
};

function resizeWindow(width: number, height: number) {
  const platform = os.platform();
  vscode.window.showInformationMessage(
    `Resizing to ${width}x${height} (${platform})`
  );

  if (platform === "darwin") {
    const appleScript = `
      osascript -e 'tell application "System Events"
        tell process "Code"
          set size of window 1 to {${width}, ${height}}
          set position of window 1 to {100, 100}
        end tell
      end tell'
    `;

    exec(appleScript, (err, stdout, stderr) => {
      if (err) {
        // Fallback to cliclick
        const cliclick = `cliclick w:100,100 cx:${width} cy:${height}`;
        exec(cliclick, (err2, stdout2, stderr2) => {
          if (err2) {
            vscode.window.showErrorMessage(
              `Failed to resize with cliclick: ${stderr2}`
            );
          }
        });
      }
    });
  } else if (platform === "win32") {
    const powershellScript = `
      Add-Type @"
      using System;
      using System.Runtime.InteropServices;
      public class WinAPI {
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")]
        public static extern bool MoveWindow(IntPtr hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
      }
"@
      $hwnd = [WinAPI]::GetForegroundWindow()
      [WinAPI]::MoveWindow($hwnd, 100, 100, ${width}, ${height}, $true)
    `.replace(/\n/g, " ");

    exec(`powershell -Command "${powershellScript}"`, (err, stdout, stderr) => {
      if (err) {
        vscode.window.showErrorMessage(`PowerShell error: ${stderr}`);
      }
    });
  } else if (platform === "linux") {
    exec(
      `wmctrl -r :ACTIVE: -e 0,100,100,${width},${height}`,
      (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(
            "wmctrl error: " + stderr + ". Try: sudo apt install wmctrl"
          );
        }
      }
    );
  } else {
    vscode.window.showErrorMessage(`Unsupported OS: ${platform}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  for (const key of Object.keys(resolutions)) {
    const { width, height } = resolutions[key];
    const disposable = vscode.commands.registerCommand(
      `resizeWindow.${key}`,
      () => {
        resizeWindow(width, height);
      }
    );
    context.subscriptions.push(disposable);
  }
}

export function deactivate() {}
