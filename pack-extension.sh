#!/bin/bash

# Script to create the .zip package for uploading to GNOME Extensions
# Usage: ./pack-extension.sh
set -e

EXTENSION_UUID="shell-easy-uninstaller@lsantiagoba"
PACK_DIR="pack"
OUTPUT_FILE="${EXTENSION_UUID}.zip"
SOURCE_DIR="src/v45-46-47-48-49-50"
PO_DIR="po"
GETTEXT_DOMAIN="shell-easy-uninstaller"

echo -e "\n\n\t~~~~~~~~~~~~~~~~ Shell Easy Uninstaller ~~~~~~~~~~~~~~~~\n"
echo -e "\t📦 Packaging GNOME extension...\n"

# Clean temporary directory if it exists
if [ -d "$PACK_DIR" ]; then
    echo -e "\t1. Cleaning temporary directory..."
    rm -rf "$PACK_DIR"
fi

# Create temporary directory
echo -e "\t2. Creating package directory..."
mkdir -p "$PACK_DIR"

# List of files to include
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

# Copy necessary files from source directory
echo -e "\t3. Copying extension files..."
for file in "${FILES[@]}"; do
    if [ -e "$SOURCE_DIR/$file" ]; then
        cp "$SOURCE_DIR/$file" "$PACK_DIR/$file"
        echo -e "\t   ✓ $file"
    else
        echo -e "\t   ⚠️  Warning: $file not found"
        exit 1
    fi
done

# Compile gettext catalogs in the layout expected by GNOME Shell.
echo -e "\t4. Compiling translations..."
if ! command -v msgfmt > /dev/null 2>&1; then
    echo -e "\t   ❌ gettext (msgfmt) is required to package translations"
    exit 1
fi
for language in $(cat "$PO_DIR/LINGUAS"); do
    locale_dir="$PACK_DIR/locale/$language/LC_MESSAGES"
    mkdir -p "$locale_dir"
    msgfmt "$PO_DIR/$language.po" -o "$locale_dir/$GETTEXT_DOMAIN.mo"
done
echo -e "\t   ✓ translations compiled"

# Create the .zip file
echo -e "\t5. Creating ${OUTPUT_FILE}..."
rm -f "$OUTPUT_FILE"
cd "$PACK_DIR"
zip -r "../${OUTPUT_FILE}" . > /dev/null 2>&1
cd ..

if [ $? -eq 0 ]; then
    echo -e "\t   ✓ Package created successfully"
    echo -e "\t   File: ${OUTPUT_FILE}"
    echo -e "\t   Size: $(du -h ${OUTPUT_FILE} | cut -f1)"
else
    echo -e "\t   ❌ Error creating .zip file"
    rm -rf "$PACK_DIR"
    exit 1
fi

# Clean up
echo -e "\t6. Cleaning up temporary files..."
rm -rf "$PACK_DIR"

echo -e "\n\t--------------------------------------------------"
echo -e "\t| Package created successfully                   |"
echo -e "\t--------------------------------------------------"
echo -e "\n\t📝 Next steps:"
echo -e "\t   1. Go to https://extensions.gnome.org/upload/"
echo -e "\t   2. Upload the file: ${OUTPUT_FILE}"
echo -e "\t   3. Complete the required information"
echo -e "\t   4. Upload screenshots (minimum 1, recommended 3-4)"
echo -e "\t   5. Wait for review from the GNOME team"
echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n"

exit 0
