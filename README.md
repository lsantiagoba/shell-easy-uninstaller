# Shell Easy Uninstaller

A GNOME Shell extension that adds a quick and convenient "Uninstall" option to the right-click menu of applications in the Dash and App Grid.

## Features

- **Quick Uninstallation:** Remove applications directly from the GNOME Shell Dash and App Grid by right-clicking on their icons.
- **Multi-Package Support:** Seamlessly detects and uninstalls **Flatpak** and **Snap** apps, plus native packages via **APT/dpkg** (Debian, Ubuntu), **DNF/RPM** (Fedora, RHEL), **rpm-ostree** (Fedora Silverblue/Kinoite), **Zypper** (openSUSE) and **Pacman** (Arch, Manjaro). **AppImage** launchers are removed by moving the AppImage and its `.desktop` file to the Trash (or deleting them permanently).
- **Confirmation Dialog:** Shows the package type and name before uninstalling, with an option to also remove configuration files (Flatpak, Snap, APT/dpkg and Pacman). It can be turned off in the extension's settings.
- **Native Integration:** Blends perfectly with the default GNOME Shell UI.
- **Localized UI:** Uses standard gettext catalogs and follows the system language automatically.

## Supported GNOME Shell Versions

- GNOME 45
- GNOME 46
- GNOME 47
- GNOME 48
- GNOME 49
- GNOME 50

## Installation

### From Source

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/lsantiagoba/shell-easy-uninstaller.git
   cd shell-easy-uninstaller
   ```

2. Run the provided installation script:
   ```bash
   # Debian/Ubuntu: sudo apt install gettext
   ./install.sh
   ```

3. Restart GNOME Shell:
   - **X11:** Press `Alt` + `F2`, type `r`, and press `Enter`.
   - **Wayland:** Log out and log back in.

4. Enable the extension:
   You can enable it using the "Extensions" app, "Extension Manager", or via the command line:
   ```bash
   gnome-extensions enable shell-easy-uninstaller@lsantiagoba
   ```

## Uninstallation

To remove the extension from your system, simply navigate to the cloned repository folder and run the provided uninstall script:

```bash
./uninstall.sh
```

## License

This project is open-source and available under the terms of the LICENSE included in this repository.
