#!/bin/bash

# Function to install a package if it does not exist
install_if_not_exists() {
  if ! command -v "$1" &> /dev/null; then
    echo "$1 not found. Installing..."
    brew install "$2"
  else
    echo "$1 is already installed."
  fi
}

# Ensure Homebrew is installed
if ! command -v brew &> /dev/null; then
  echo "Homebrew not found. Installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "Homebrew is already installed."
  brew update
fi

# Ensure necessary tools are installed
install_if_not_exists "magick" "imagemagick"
install_if_not_exists "jpegoptim" "jpegoptim"
install_if_not_exists "ffmpeg" "ffmpeg"

# Directories
INPUT_DIR="media"
OUTPUT_DIR="src/assets"

# Create output directories if they don't exist and set permissions
mkdir -p "$OUTPUT_DIR/images"
mkdir -p "$OUTPUT_DIR/videos"

# Set write permissions to the output directories
chmod +w "$OUTPUT_DIR/images"
chmod +w "$OUTPUT_DIR/videos"

# Log file for errors
LOG_FILE="local_logs/optimization_errors.log"
echo "Starting optimization at $(date)" > "$LOG_FILE"

# Function to create output directory for images
create_output_dir() {
  img_dir=$(dirname "$1")
  output_dir="$OUTPUT_DIR/${img_dir#$INPUT_DIR/}"
  mkdir -p "$output_dir"
  echo "$output_dir"
}

# Optimize JPG images using ImageMagick and JPEGoptim
find "$INPUT_DIR" -type f -name "*.jpg" | while read -r img; do
  echo "Optimizing $img" | tee -a "$LOG_FILE"
  output_img="$(create_output_dir "$img")/$(basename "$img")"
  if [ -f "$img" ]; then
    magick "$img" -quality 85 "$output_img" 2>> "$LOG_FILE"
    if [ $? -eq 0 ]; then
      jpegoptim --size=200k "$output_img" 2>> "$LOG_FILE"
      echo "$img optimized successfully" | tee -a "$LOG_FILE"
    else
      echo "Failed to optimize $img with ImageMagick" | tee -a "$LOG_FILE"
    fi
  else
    echo "File $img does not exist" | tee -a "$LOG_FILE"
  fi
done

# Optimize PNG images using ImageMagick
find "$INPUT_DIR" -type f -name "*.png" | while read -r img; do
  echo "Optimizing $img" | tee -a "$LOG_FILE"
  output_img="$(create_output_dir "$img")/$(basename "$img")"
  if [ -f "$img" ]; then
    magick "$img" -strip -resize 1920x1080 "$output_img" 2>> "$LOG_FILE"
    if [ $? -eq 0 ]; then
      echo "$img optimized successfully" | tee -a "$LOG_FILE"
    else
      echo "Failed to optimize $img with ImageMagick" | tee -a "$LOG_FILE"
    fi
  else
    echo "File $img does not exist" | tee -a "$LOG_FILE"
  fi
done

# Optimize WebP images using ImageMagick
find "$INPUT_DIR" -type f -name "*.webp" | while read -r img; do
  echo "Optimizing $img" | tee -a "$LOG_FILE"
  output_img="$(create_output_dir "$img")/$(basename "$img")"
  if [ -f "$img" ]; then
    magick "$img" -strip -resize 1920x1080 "$output_img" 2>> "$LOG_FILE"
    if [ $? -eq 0 ]; then
      echo "$img optimized successfully" | tee -a "$LOG_FILE"
    else
      echo "Failed to optimize $img with ImageMagick" | tee -a "$LOG_FILE"
    fi
  else
    echo "File $img does not exist" | tee -a "$LOG_FILE"
  fi
done

# Optimize videos using FFmpeg
find "$INPUT_DIR" -type f -name "*.mp4" | while read -r video; do
  echo "Processing video: $video" | tee -a $LOG_FILE
  output_video="$OUTPUT_DIR/videos/$(basename "$video")"
  echo "Output video path: $output_video" | tee -a $LOG_FILE
  if [ -f "$video" ]; then
    # Remove the existing file if it exists
    if [ -f "$output_video" ]; then
      rm "$output_video"
      echo "Existing file $output_video removed" | tee -a $LOG_FILE
    fi
    ffmpeg -i "$video" -vcodec h264 -acodec aac -strict -2 -b:v 1M -b:a 128k "$output_video" 2>> $LOG_FILE
    if [ $? -eq 0 ]; then
      echo "$video optimized successfully" | tee -a $LOG_FILE
    else
      echo "Failed to optimize $video with FFmpeg" | tee -a $LOG_FILE
    fi
  else
    echo "File $video does not exist" | tee -a $LOG_FILE
  fi
done

find "$INPUT_DIR" -type f -name "*.webm" | while read -r video; do
  echo "Processing video: $video" | tee -a $LOG_FILE
  output_video="$OUTPUT_DIR/videos/$(basename "$video")"
  echo "Output video path: $output_video" | tee -a $LOG_FILE
  if [ -f "$video" ]; then
    # Remove the existing file if it exists
    if [ -f "$output_video" ]; then
      rm "$output_video"
      echo "Existing file $output_video removed" | tee -a $LOG_FILE
    fi
    ffmpeg -i "$video" -c:v libvpx-vp9 -b:v 1M -c:a libvorbis "$output_video" 2>> $LOG_FILE
    if [ $? -eq 0 ]; then
      echo "$video optimized successfully" | tee -a $LOG_FILE
    else
      echo "Failed to optimize $video with FFmpeg" | tee -a $LOG_FILE
    fi
  else
    echo "File $video does not exist" | tee -a $LOG_FILE
  fi
done

echo "Optimization completed!" | tee -a $LOG_FILE
