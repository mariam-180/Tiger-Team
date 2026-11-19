#!/bin/bash

# Define the media directory
MEDIA_DIR="${MEDIA_DIR:-./media}"

# Go to the media directory
cd "$MEDIA_DIR"

# Find and unzip all .zip files
find . -type f -name '*.zip' -exec sh -c '
    for file; do
        unzip -o "$file" -d "$(dirname "$file")" && rm "$file"
    done
' sh {} +

# Set permissions to ensure the files are playable
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

echo "All files have been unzipped and are now playable."
