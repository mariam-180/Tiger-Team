#!/bin/bash

# Define the directory containing .flv files
MEDIA_DIR="${MEDIA_DIR:-./media/var/www/html/streams/low/old}"

# Ensure the directory exists
if [ ! -d "$MEDIA_DIR" ]; then
    echo "Directory $MEDIA_DIR does not exist."
    exit 1
fi

# Loop through all .flv files in the directory
for flv_file in "$MEDIA_DIR"/*.flv; do
    # Skip if no .flv files are found
    if [ ! -e "$flv_file" ]; then
        echo "No .flv files found in $MEDIA_DIR."
        break
    fi

    # Define the output .mp4 file name
    mp4_file="${flv_file%}.mp4"

    # Convert .flv to .mp4
    echo "Converting $flv_file to $mp4_file"
    ffmpeg -i "$flv_file" -c:v libx264 -c:a aac "$mp4_file"

    # Check if conversion was successful
    if [ $? -eq 0 ]; then
        echo "Successfully converted $flv_file to $mp4_file"
        # Optionally, remove the original .flv file
        rm "$flv_file"
    else
        echo "Failed to convert $flv_file"
    fi
done

echo "Conversion process completed."
