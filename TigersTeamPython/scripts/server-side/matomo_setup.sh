#!/bin/bash

# Variables
MATOMO_DIR="/var/www/html/matomo"
MATOMO_DB="matomo_db"
MATOMO_USER="matomo_user"
MATOMO_PASS="matomo_password"
SITE_ID="1" # You need to update this after setting up Matomo

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

# Function to check if a package is installed
is_installed() {
  dpkg -l | grep -q "$1"
}

# Update and install necessary packages
sudo apt-get update

# Install Nginx if not installed
if ! is_installed "nginx"; then
  sudo apt-get install nginx -y
fi

# Install PHP and required extensions if not installed
if ! is_installed "php-fpm"; then
  sudo apt-get install php-fpm php-mysql php-gd php-xml php-mbstring -y
fi

# Install MySQL if not installed
if ! is_installed "mysql-server"; then
  sudo apt-get install mysql-server -y
  sudo systemctl start mysql
  sudo systemctl enable mysql
fi

# Install GoAccess if not installed
if ! is_installed "goaccess"; then
  sudo apt-get install goaccess -y
fi

# Install unzip if not installed
if ! is_installed "unzip"; then
  sudo apt-get install unzip -y
fi

# Create /var/www/html if it does not exist
if [ ! -d "/var/www/html" ]; then
  sudo mkdir -p /var/www/html
fi

# Download and set up Matomo
if [ ! -d "$MATOMO_DIR" ]; then
  cd /var/www/html
  wget https://builds.matomo.org/matomo-latest.zip
  unzip matomo-latest.zip
  rm matomo-latest.zip
  sudo chown -R www-data:www-data matomo
  sudo chmod -R 755 matomo
fi

# Create MySQL database and user for Matomo
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${MATOMO_DB};"
mysql -u root -e "CREATE USER IF NOT EXISTS '${MATOMO_USER}'@'localhost' IDENTIFIED BY '${MATOMO_PASS}';"
mysql -u root -e "GRANT ALL PRIVILEGES ON ${MATOMO_DB}.* TO '${MATOMO_USER}'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"

# Configure Nginx for Matomo in a subdirectory
NGINX_CONF="/etc/nginx/sites-available/tigers-team.com"
if [ ! -f "$NGINX_CONF" ]; then
  cat >"$NGINX_CONF" <<EOL
server {
    server_name tigers-team.com www.tigers-team.com;

    location / {
        root /var/www/html/TigersTeamReact/build;
        try_files \$uri \$uri/ =404;
    }

    location /api/ {
        proxy_pass http://localhost:8081/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /access/reports {
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;  # Create this file

        alias /var/www/html/GoAccessReports/;
        index index.html;
    }

    location /matomo/ {
        alias ${MATOMO_DIR}/;
        index index.php;
        try_files \$uri \$uri/ /matomo/index.php?\$args;

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            try_files \$uri /matomo/index.php?\$args;
            expires max;
            log_not_found off;
        }
    }

    location ~ /.well-known/acme-challenge {
        allow all;
    }

    error_page 404 /;
    location = / {
        root /var/www/html/TigersTeamReact/build;
        try_files \$uri \$uri/ =404;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/tigers-team.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/tigers-team.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN:-example.com};

    location / {
        root /var/www/html/TigersTeamReact/build;
        try_files \$uri \$uri/ =404;
    }

    location /api/ {
        proxy_pass http://localhost:8081/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
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
EOL

  ln -s "$NGINX_CONF" /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx
fi

# Display message to complete Matomo setup via web interface
echo "Matomo setup script completed."
echo "Please complete the setup by visiting http://tigers-team.com/matomo"

# Reminder to manually update the site ID in the React app after completing Matomo setup
echo "Remember to update the SITE_ID in your React app's Matomo tracking code after completing the setup."

# Function to add tracking code to React app (optional, if app is on the same server)
add_tracking_code_to_react_app() {
  REACT_APP_DIR="/path/to/your/react/app"
  if [ -d "$REACT_APP_DIR" ]; then
    TRACKING_CODE=$(
      cat <<'EOF'
(function() {
  var _paq = window._paq = window._paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['enableHeartBeatTimer']); // Optional: track users’ activity by sending requests periodically
  _paq.push(['setTrackerUrl', 'https://tigers-team.com/matomo/matomo.php']);
  _paq.push(['setSiteId', 'YOUR_SITE_ID']); // Update with actual site ID
  var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
  g.type = 'text/javascript';
  g.async = true;
  g.defer = true;
  g.src = 'https://tigers-team.com/matomo/matomo.js';
  s.parentNode.insertBefore(g, s);
})();
EOF
    )
    echo "$TRACKING_CODE" >"${REACT_APP_DIR}/public/matomo.js"
    echo "Tracking code added to React app."
  else
    echo "React app directory not found. Please add the tracking code manually."
  fi
}

# Call the function to add tracking code (optional)
# add_tracking_code_to_react_app

# Set up GoAccess cron job
CRON_FILE="/etc/cron.hourly/goaccess_update"
if [ ! -f "$CRON_FILE" ]; then
  cat >"$CRON_FILE" <<EOL
#!/bin/bash
goaccess /var/log/nginx/access.log -o /var/www/html/report.html --log-format=COMBINED
EOL
  chmod +x "$CRON_FILE"
  echo "GoAccess cron job created."
fi

echo "Setup complete. Please complete the Matomo setup through the web interface and update your React app with the correct site ID."
