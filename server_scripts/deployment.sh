#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the React application
echo "Building the React application..."
npm run build

# Copy the build files to the server
echo "Copying build files to the server..."
scp -r build/* root@139.59.174.109:/var/www/html/TigersTeamReact/

# Reload Nginx on the server
echo "Reloading Nginx on the server..."
ssh root@139.59.174.109 'sudo systemctl reload nginx'

echo "Deployment completed successfully!"
