# Window Resizer

A Visual Studio Code extension that resizes the main window to predefined resolutions:

- HD (1280x720)
- Full HD (1920x1080)
- 2K (2560x1440)
- 4K (3840x2160)

## Available Commands

Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run:

- `Resize Window: HD`
- `Resize Window: Full HD`
- `Resize Window: 2K`
- `Resize Window: 4K`

## Requirements

This extension works only on the **Desktop version of VSCode** (not in the web version).

### macOS

- Requires [`cliclick`](https://github.com/BlueM/cliclick):  
  Install it via Homebrew: `brew install cliclick`
- Or, allow **Accessibility permission** to VSCode in:  
  `System Preferences → Security & Privacy → Accessibility`

### Windows

- Requires **PowerShell** (default in Windows)
- Execution policy must allow scripts

### Linux

- Requires `wmctrl` installed:  
  `sudo apt install wmctrl`
- Works best on **X11** (may not work with Wayland)

## Disclaimer

This extension uses system-level commands to resize the window and may require permissions depending on your OS and configuration.

## License

MIT
