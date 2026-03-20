#!/bin/bash

# Build script - Copies source files from src/v45-46-47-48-49 to root for packaging
# Usage: ./build.sh

SRC_DIR="src/v45-46-47-48-49"

echo "🔨 Building extension..."
echo ""

# List of files to copy
FILES=(
    "extension.js"
    "utils.js"
    "metadata.json"
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

echo ""
echo "✅ Build complete! Files are ready for installation or packaging."
echo ""
echo "Next steps:"
echo "  - To install locally: ./install.sh"
echo "  - To create package: ./pack-extension.sh"
