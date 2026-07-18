#!/bin/bash

# Installation script for Shell Easy Uninstaller
set -e

EXTENSION_UUID="shell-easy-uninstaller@lsantiagoba"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/src/v45-46-47-48-49-50"
PO_DIR="$SCRIPT_DIR/po"
GETTEXT_DOMAIN="shell-easy-uninstaller"

# Detect GNOME Shell version
SHELL_VERSION=$(gnome-shell --version | cut -d ' ' -f3 | cut -d '.' -f1)

if [[ $SHELL_VERSION -lt 45 ]]
then
    echo "This extension requires GNOME Shell 45 or higher."
    echo "Current version: $SHELL_VERSION"
    echo "Exiting with no changes."
    exit 1
fi

if ! command -v msgfmt > /dev/null 2>&1; then
    echo "gettext (msgfmt) is required to install translations."
    exit 1
fi

echo -e "\n\n\t~~~~~~~~~~~~~~~~ Shell Easy Uninstaller ~~~~~~~~~~~~~~~~\n"
echo -e "\tRunning installation script...\n"
echo -e "\t1. GNOME Shell version $SHELL_VERSION detected"

echo -e "\t2. Creating extension directory..."
mkdir -p "$EXTENSION_DIR"

# Remove files left by older packages before installing the current source.
echo -e "\t3. Copying extension files..."
find "$EXTENSION_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp "$SOURCE_DIR/metadata.json" "$EXTENSION_DIR/"
cp "$SOURCE_DIR"/*.js "$EXTENSION_DIR/"

# Compile gettext catalogs in the layout expected by GNOME Shell.
echo -e "\t4. Compiling translations..."
for language in $(cat "$PO_DIR/LINGUAS"); do
    locale_dir="$EXTENSION_DIR/locale/$language/LC_MESSAGES"
    mkdir -p "$locale_dir"
    msgfmt "$PO_DIR/$language.po" -o "$locale_dir/$GETTEXT_DOMAIN.mo"
done

echo -e "\t5. Enabling extension..."
if command -v gnome-extensions &> /dev/null; then
    gnome-extensions enable $EXTENSION_UUID || echo -e "\t   (Extension will be enabled after restart)"
else
    echo -e "\t   (Extension will be enabled after restart)"
fi

echo -e "\n\t--------------------------------------------------"
echo -e "\t| Shell Easy Uninstaller is installed successfully |"
echo -e "\t--------------------------------------------------"
echo -e "\n\tPlease restart GNOME Shell:"
echo -e "\t  - On X11: Press Alt+F2, type 'r' and press Enter"
echo -e "\t  - On Wayland: Log out and log back in"
echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n"

exit 0
