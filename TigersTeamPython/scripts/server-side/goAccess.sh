#!/bin/bash

# Define variables
USERNAME="${USERNAME:?Set USERNAME for the report}"
PASSWORD="${PASSWORD:?Set PASSWORD for the report}"
REPORT_DIR="/var/www/html/GoAccessReports"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN:-example.com}"
NGINX_AUTH_FILE="/etc/nginx/.htpasswd"

# Install GoAccess
sudo apt-get update
sudo apt-get install goaccess apache2-utils -y

# Create directory if it doesn't exist
sudo mkdir -p $REPORT_DIR

# Change ownership and permissions
sudo chown -R www-data:www-data $REPORT_DIR
sudo chmod -R 755 $REPORT_DIR

# Generate GoAccess report
sudo goaccess /var/log/nginx/access.log -o $REPORT_DIR/index.html --log-format=COMBINED

# Create HTTP basic authentication file
sudo htpasswd -b -c $NGINX_AUTH_FILE $USERNAME $PASSWORD

# Secure the HTTP basic authentication file
sudo chown www-data:www-data $NGINX_AUTH_FILE
sudo chmod 600 $NGINX_AUTH_FILE

# Update Nginx configuration for GoAccess with authentication
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    server_name tigers-team.com www.tigers-team.com;

    location / {
        root /var/www/html/TigersTeamReact/build;
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://localhost:8081/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /access/reports {
        auth_basic "Restricted Access";
        auth_basic_user_file $NGINX_AUTH_FILE;

        alias $REPORT_DIR;
        index index.html;
    }

    location ~ /.well-known/acme-challenge {
        allow all;
    }

    error_page 404 /;
    location = / {
        root /var/www/html/TigersTeamReact/build;
        try_files $uri $uri/ =404;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/tigers-team.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/tigers-team.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if (\$host = www.tigers-team.com) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    if (\$host = tigers-team.com) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    listen 80;
    listen [::]:80;
    server_name tigers-team.com www.tigers-team.com;
    return 404; # managed by Certbot
}
EOF

# Restart Nginx to apply changes
sudo systemctl restart nginx

echo "GoAccess installed and configured successfully."
echo "Access GoAccess reports at https://tigers-team.com/access/reports"
echo "Username: $USERNAME"
echo "Password: $PASSWORD"
