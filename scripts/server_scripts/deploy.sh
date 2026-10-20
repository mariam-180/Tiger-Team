#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

SERVER="${SERVER:?Set SERVER to the deployment SSH target}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/html/TigersTeamReact}"

# Build the React application
echo "Building the React application..."
if npm run build; then
    echo "React application built successfully."
else
    echo "React application build failed." >&2
    exit 1
fi

# Zip the build directory
echo "Zipping the build directory..."
if zip -r build.zip build; then
    echo "Build directory zipped successfully."
else
    echo "Failed to zip the build directory." >&2
    exit 1
fi

# Navigate to the server directory and pull the latest changes
echo "Navigating to the server directory and pulling the latest changes..."
if ssh "$SERVER" << EOF
    cd "$REMOTE_DIR"

    # Configure the git pull strategy to use rebase by default
    git config pull.rebase true

    # Attempt to pull the latest changes
    if git pull; then
        echo "Pulled the latest changes successfully."
    else
        echo "Failed to pull the latest changes." >&2
        exit 1
    fi
EOF
then
    echo "Latest changes pulled successfully."
else
    echo "Failed to pull the latest changes." >&2
    exit 1
fi

# Remove existing build directory on the server
echo "Removing existing build directory on the server..."
if ssh "$SERVER" "rm -rf '$REMOTE_DIR/build'"; then
    echo "Removed existing build directory successfully."
else
    echo "Failed to remove existing build directory." >&2
    exit 1
fi

# Copy the zipped build file to the server
echo "Copying zipped build file to the server..."
if scp build.zip "$SERVER:$REMOTE_DIR/"; then
    echo "Copied zipped build file to the server successfully."
else
    echo "Failed to copy zipped build file to the server." >&2
    exit 1
fi

# Unzip the build file on the server
echo "Unzipping build file on the server..."
if ssh "$SERVER" "unzip '$REMOTE_DIR/build.zip' -d '$REMOTE_DIR/'"; then
    echo "Build file unzipped successfully on the server."
else
    echo "Failed to unzip build file on the server." >&2
    exit 1
fi

# Remove the zip file from the server
echo "Removing zip file from the server..."
if ssh "$SERVER" "rm '$REMOTE_DIR/build.zip'"; then
    echo "Zip file removed from the server successfully."
else
    echo "Failed to remove zip file from the server." >&2
    exit 1
fi

# Remove the local zip file
echo "Removing local zip file..."
if rm build.zip; then
    echo "Local zip file removed successfully."
else
    echo "Failed to remove local zip file." >&2
    exit 1
fi

# Reload Nginx on the server
echo "Reloading Nginx on the server..."
if ssh "$SERVER" 'sudo systemctl reload nginx'; then
    echo "Nginx reloaded successfully."
else
    echo "Failed to reload Nginx." >&2
    exit 1
fi

echo "Deployment completed successfully!"
