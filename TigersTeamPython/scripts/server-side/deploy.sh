#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables for the server and file paths
SERVER="${SERVER:?Set SERVER to the deployment SSH target}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/html/TigersTeamPython/.env}"
LOCAL_ENV_PATH="${LOCAL_ENV_PATH:-.env}"
BUILD_FLAG=false

# Check if 'build' argument is passed
if [ "$1" == "build" ]; then
    BUILD_FLAG=true
fi

# Copy the .env file to the server
echo "Copying .env file to the server..."
scp $LOCAL_ENV_PATH $SERVER:$REMOTE_PATH

# Navigate to the backend directory on the server
echo "Navigating to the backend directory on the server..."
ssh $SERVER '
cd /var/www/html/TigersTeamPython/ && \
ls -ltr && \
echo "Pulling the latest changes from git..." && \
git pull origin main && \
echo "Bringing down the Docker containers..." && \
docker compose down tigers-team && \
if [ "'$BUILD_FLAG'" = true ]; then
    echo "Bringing up the Docker containers with build..." && \
    docker compose -f compose.yaml up --build -d tigers-team-alembic && \
    docker compose -f compose.yaml up --build -d tigers-team
else
    echo "Bringing -f compose.yaml up the Docker containers without build..." && \
    docker compose -f compose.yaml up -d tigers-team-alembic && \
    docker compose -f compose.yaml up -d tigers-team
fi
'

echo "Backend deployment completed successfully!"
