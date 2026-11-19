#!/bin/bash

# Run as root check
if [ "$(id -u)" != "0" ]; then
    echo "Run this script as root or use sudo." 1>&2
    exit 1
fi

DOMAIN="${DOMAIN:?Set DOMAIN before configuring Nginx}"
SUBDOMAIN="${SUBDOMAIN:-www.$DOMAIN}"
IP_ADDRESS="${IP_ADDRESS:-}"
EMAIL="${EMAIL:?Set EMAIL before configuring Certbot}"
BACKEND_PORT="${BACKEND_PORT:-8081}"
FRONTEND_DIR="${FRONTEND_DIR:-/var/www/html/TigersTeamReact/build}"
NGINX_AUTH_FILE="/etc/nginx/.htpasswd"
REPORT_DIR="/var/www/html/TigersTeamReact/build"

echo "Updating package lists..."
apt-get update -y

echo "Installing required packages..."
apt-get install -y software-properties-common nginx certbot python3-certbot-nginx

# Allow HTTPS through firewall if UFW active
if ufw status | grep -qw active; then
    ufw allow 'Nginx Full'
fi

# Remove old NGINX configs
rm -f /etc/nginx/sites-available/$DOMAIN
rm -f /etc/nginx/sites-enabled/$DOMAIN

# Create NGINX config
cat >/etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $SUBDOMAIN ${IP_ADDRESS};

    root $FRONTEND_DIR;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /access/reports {
        auth_basic "Restricted Access";
        auth_basic_user_file $NGINX_AUTH_FILE;
        alias $REPORT_DIR;
        index index.html;
    }

    error_page 404 /;
    location = / {
        root $FRONTEND_DIR;
        try_files \$uri \$uri/ =404;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test and reload nginx
nginx -t && systemctl reload nginx

# Obtain SSL certificate for root domain
echo "Obtaining SSL certificate for $DOMAIN..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Obtain SSL certificate for www subdomain
echo "Obtaining SSL certificate for www.$DOMAIN..."
certbot --nginx -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

echo "Enabling automatic certificate renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo "Setup complete: NGINX configured and SSL installed for $DOMAIN and $SUBDOMAIN."
