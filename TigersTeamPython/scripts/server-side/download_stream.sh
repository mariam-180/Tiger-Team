#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables for the server and file paths
SERVER="${SERVER:?Set SERVER to the deployment SSH target}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/html/streams/low/old}"
LOCAL_DIR="./media"

# Create the local directory if it doesn't exist
mkdir -p $LOCAL_DIR

# Function to download files
download_files() {
    echo "Downloading files from $REMOTE_DIR..."
    scp -r $SERVER:$REMOTE_DIR/*.zip $LOCAL_DIR
}

# Function to clear remote directory
clear_remote_dir() {
    echo "Clearing files in $REMOTE_DIR..."
    ssh $SERVER "rm -rf $REMOTE_DIR/*"
}

# Check for the 'clear' argument
if [ "$1" == "clear" ]; then
    download_files
    clear_remote_dir
else
    download_files
fi

echo "Operation completed successfully!"
