#!/bin/bash

# Check if the script is run as root
if [ "$(id -u)" != "0" ]; then
  echo "This script must be run as root. Please use sudo." 1>&2
  exit 1
fi

# Variables
DOMAIN="tigers-team.com"
EMAIL="info@tigers-team.com"

# Update package lists
echo "Updating package lists..."
apt update -y

# Install Certbot and NGINX plugin
echo "Installing Certbot and NGINX plugin..."
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate for root domain
echo "Obtaining SSL certificate for $DOMAIN..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Obtain SSL certificate for www subdomain
echo "Obtaining SSL certificate for www.$DOMAIN..."
certbot --nginx -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Reload NGINX to apply changes
echo "Reloading NGINX..."
systemctl reload nginx

# Verify NGINX configuration
if nginx -t; then
  echo "NGINX configuration is valid."
else
  echo "NGINX configuration is invalid. Please check the configuration." 1>&2
  exit 1
fi

# Ensure automatic renewal via cron
echo "Creating cron job for automatic renewal..."
(crontab -l 2>/dev/null; echo "0 0,12 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

echo "SSL setup is complete for $DOMAIN and www.$DOMAIN."