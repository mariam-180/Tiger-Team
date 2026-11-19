#!/bin/bash

# Stop Nginx
echo "Stopping Nginx..."
sudo systemctl stop nginx

# Restore the backup Nginx binary
if [ -f /usr/sbin/nginx.backup ]; then
    echo "Restoring the backup Nginx binary..."
    sudo mv /usr/sbin/nginx.backup /usr/sbin/nginx
else
    echo "Backup Nginx binary not found. Exiting."
    exit 1
fi

# Remove RTMP configuration from Nginx config
NGINX_CONF="/etc/nginx/nginx.conf"
TMP_CONF="/tmp/nginx.conf.tmp"

echo "Removing RTMP configuration from $NGINX_CONF..."
sudo awk '
/^rtmp \{/ {skip=1} 
/^\}/ {if (skip) {skip=0; next}} 
!skip' $NGINX_CONF > $TMP_CONF && sudo mv $TMP_CONF $NGINX_CONF

# Check syntax Nginx
echo "Checking syntax Nginx..."
sudo nginx -t

# Start Nginx
echo "Starting Nginx..."
sudo systemctl start nginx

# Check Nginx status
echo "Checking Nginx status..."
sudo systemctl status nginx

echo "Nginx has been restored from the backup, RTMP configuration removed, and restarted."
