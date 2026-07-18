#!/bin/bash

# Build script - Copies source files from src/v45-46-47-48-49-50 to root for packaging
# Usage: ./build.sh

SRC_DIR="src/v45-46-47-48-49-50"
PO_DIR="po"
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
    "utils.js"
    "metadata.json"
    "AppUninstaller.js"
    "CommandExecutor.js"
    "DebAptHandler.js"
    "FlatpakHandler.js"
    "SnapHandler.js"
)

# Copy files from source to root
echo "📋 Copying files from ${SRC_DIR} to root..."
for file in "${FILES[@]}"; do
    if [ -e "${SRC_DIR}/${file}" ]; then
        cp "${SRC_DIR}/${file}" "./"
        echo "  ✓ ${file}"
    else
        echo "  ⚠️  Warning: ${file} not found in ${SRC_DIR}"
    fi
done

echo "🌐 Compiling translations..."
for language in $(cat "$PO_DIR/LINGUAS"); do
    locale_dir="locale/$language/LC_MESSAGES"
    mkdir -p "$locale_dir"
    msgfmt "$PO_DIR/$language.po" -o "$locale_dir/$GETTEXT_DOMAIN.mo"
done

echo ""
echo "✅ Build complete! Files are ready for installation or packaging."
echo ""
echo "Next steps:"
echo "  - To install locally: ./install.sh"
echo "  - To create package: ./pack-extension.sh"
