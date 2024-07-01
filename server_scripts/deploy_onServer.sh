#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Navigate to the server directory and pull the latest changes
echo "Navigating to the server directory and pulling the latest changes..."
ssh root@139.59.174.109 '
cd cd /var/www/html/TigersTeamReact && \
echo "Pulling the latest changes from git..." && \
git pull origin main && \
npm run build
'
# Reload Nginx on the server
echo "Reloading Nginx on the server..."
ssh root@139.59.174.109 'sudo systemctl reload nginx'

echo "Deployment completed successfully!"
