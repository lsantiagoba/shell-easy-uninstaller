#!/bin/bash

# Installation script for Shell Easy Uninstaller
set -e

EXTENSION_UUID="shell-easy-uninstaller@lsantiagoba"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_UUID"

# Detect GNOME Shell version
SHELL_VERSION=$(gnome-shell --version | cut -d ' ' -f3 | cut -d '.' -f1)

if [[ $SHELL_VERSION -lt 45 ]]
then
    echo "This extension requires GNOME Shell 45 or higher."
    echo "Current version: $SHELL_VERSION"
    echo "Exiting with no changes."
    exit 1
fi

echo -e "\n\n\t~~~~~~~~~~~~~~~~ Shell Easy Uninstaller ~~~~~~~~~~~~~~~~\n"
echo -e "\tRunning installation script...\n"
echo -e "\t1. GNOME Shell version $SHELL_VERSION detected"

# All supported versions use the same codebase
cd src/v45-46-47-48-49

echo -e "\t2. Creating extension directory..."
mkdir -p "$EXTENSION_DIR"

# Copiar archivos
echo -e "\t3. Copying extension files..."
cp metadata.json "$EXTENSION_DIR/"
cp extension.js "$EXTENSION_DIR/"
cp utils.js "$EXTENSION_DIR/"

# Copiar schemas if they exist, else skip
if ls ../../schemas/*.xml 1> /dev/null 2>&1; then
    echo -e "\t4. Copying schema files..."
    mkdir -p "$EXTENSION_DIR/schemas"
    cp ../../schemas/*.xml "$EXTENSION_DIR/schemas/"

    # Compilar schemas
    echo -e "\t5. Compiling schemas..."
    glib-compile-schemas "$EXTENSION_DIR/schemas/"
else
    echo -e "\t4. No schemas found. Skipping..."
fi

echo -e "\t6. Enabling extension..."
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
