#!/bin/bash

# Build script - Copies source files from src/v45-46-47-48-49-50 into build/
# Usage: ./build.sh

SRC_DIR="src/v45-46-47-48-49-50"
PO_DIR="po"
BUILD_DIR="build"
GETTEXT_DOMAIN="shell-easy-uninstaller"

echo "🔨 Building extension..."
echo ""

if ! command -v msgfmt > /dev/null 2>&1; then
    echo "gettext (msgfmt) is required to build translations."
    exit 1
fi

# List of files to copy
FILES=(
    "extension.js"
    "prefs.js"
    "metadata.json"
    "AppUninstaller.js"
    "CommandExecutor.js"
    "NativePackageHandler.js"
    "FlatpakHandler.js"
    "SnapHandler.js"
    "UninstallDialog.js"
    "schemas/org.gnome.shell.extensions.shell-easy-uninstaller.gschema.xml"
)

# Start from a clean build directory so removed files do not linger.
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Copy files from source to the build directory
echo "📋 Copying files from ${SRC_DIR} to ${BUILD_DIR}/..."
for file in "${FILES[@]}"; do
    if [ -e "${SRC_DIR}/${file}" ]; then
        mkdir -p "${BUILD_DIR}/$(dirname "${file}")"
        cp "${SRC_DIR}/${file}" "${BUILD_DIR}/${file}"
        echo "  ✓ ${file}"
    else
        echo "  ⚠️  Warning: ${file} not found in ${SRC_DIR}"
    fi
done

if ! command -v glib-compile-schemas > /dev/null 2>&1; then
    echo "glib-compile-schemas is required to build the settings schema."
    exit 1
fi

echo "⚙️  Compiling settings schema..."
glib-compile-schemas "$BUILD_DIR/schemas"

echo "🌐 Compiling translations..."
for language in $(cat "$PO_DIR/LINGUAS"); do
    locale_dir="$BUILD_DIR/locale/$language/LC_MESSAGES"
    mkdir -p "$locale_dir"
    msgfmt "$PO_DIR/$language.po" -o "$locale_dir/$GETTEXT_DOMAIN.mo"
done

echo ""
echo "✅ Build complete! Files are in ${BUILD_DIR}/."
echo ""
echo "Next steps:"
echo "  - To install locally: ./install.sh"
echo "  - To create package: ./pack-extension.sh"
