#!/bin/bash

set -e

echo "Starting RTMP setup..."

# Variables
NGINX_CONF="/etc/nginx/nginx.conf"
SITE_CONF="/etc/nginx/sites-available/tigers-team.com"
BACKUP_DIR="/etc/nginx/backup_$(date +'%Y%m%d%H%M%S')"
HLS_DIR="/tmp/hls"
HLS_LIVE_DIR="/tmp/hls/live"
HLS_LOW_DIR="/tmp/hls/low"
STREAM_LIVE_DIR="/var/www/html/streams/live"
STREAM_LOW_DIR="/var/www/html/streams/low"
ZIP_AND_REMOVE_SCRIPT="/usr/local/bin/zip_and_remove.sh"
MOVE_SCRIPT="/usr/local/bin/move_recorded_files.sh"
CRON_ZIP_AND_REMOVE="/etc/cron.d/compress_streams"
CRON_MOVE_FILES="/etc/cron.d/move_recorded_files"
NGINX_RTMP_MOD="libnginx-mod-rtmp"

# Function to check and install dependencies
install_dependencies() {
    echo "Checking and installing dependencies..."
    sudo apt update
    if ! dpkg -l | grep -q $NGINX_RTMP_MOD; then
        sudo apt install -y nginx $NGINX_RTMP_MOD
    else
        echo "$NGINX_RTMP_MOD is already installed. Skipping..."
    fi
    if ! dpkg -l | grep -q zip; then
        sudo apt install -y zip
    else
        echo "zip is already installed. Skipping..."
    fi
}

# Function to backup configuration files
backup_configs() {
    echo "Backing up configuration files to $BACKUP_DIR..."
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp "$NGINX_CONF" "$BACKUP_DIR/nginx.conf.bak"
    sudo cp "$SITE_CONF" "$BACKUP_DIR/tigers-team.com.bak"
}

# Function to create necessary directories
create_directories() {
    echo "Creating necessary directories..."
    sudo mkdir -p "$HLS_LIVE_DIR"
    sudo mkdir -p "$HLS_LOW_DIR"
    sudo mkdir -p "$STREAM_LIVE_DIR"
    sudo mkdir -p "$STREAM_LOW_DIR"
    sudo mkdir -p "$STREAM_LOW_DIR/old"
    sudo chown -R www-data:www-data "$HLS_DIR"
    sudo chown -R www-data:www-data "$STREAM_LIVE_DIR"
    sudo chown -R www-data:www-data "$STREAM_LOW_DIR"
}

# Function to update nginx.conf
update_nginx_conf() {
    echo "Updating $NGINX_CONF..."
    if ! grep -q "rtmp {" "$NGINX_CONF"; then
        sudo sed -i '/http {/i\
rtmp {\
    server {\
        listen 1935;\
\
        application live {\
            live on;\
            record all;\
            record_path /var/www/html/streams/live;\
            record_suffix -%Y%m%d%H%M%S.flv;\
            record_interval 5m;\
            record_unique on;\
            hls on;\
            hls_path /tmp/hls/live;\
            hls_fragment 1s;\
        }\
\
        application low {\
            live on;\
            record all;\
            record_path /var/www/html/streams/low;\
            record_suffix -%Y%m%d%H%M%S.flv;\
            record_interval 5m;\
            record_unique on;\
            hls on;\
            hls_path /tmp/hls/low;\
            hls_fragment 1s;\
            hls_variant _low BANDWIDTH=256000;\
            hls_variant _mid BANDWIDTH=512000;\
            hls_variant _hi BANDWIDTH=1024000;\
        }\
    }\
}\
' "$NGINX_CONF"
    else
        echo "RTMP configuration already exists in $NGINX_CONF. Skipping..."
    fi
}

# Function to update site configuration
update_site_conf() {
    echo "Updating $SITE_CONF..."
    if ! grep -q "location /hls" "$SITE_CONF"; then
        sudo sed -i '/server_name tigers-team.com www.tigers-team.com;/a\
    location /hls/live {\
        types {\
            application/vnd.apple.mpegurl m3u8;\
            video/mp2t ts;\
        }\
        alias /tmp/hls/live;\
        expires -1;\
        add_header Cache-Control no-cache;\
        add_header "Access-Control-Allow-Origin" "*";\
        add_header "Access-Control-Allow-Methods" "GET, OPTIONS";\
        add_header "Access-Control-Allow-Headers" "Range";\
        add_header "Access-Control-Expose-Headers" "Content-Length, Content-Range";\
    }\
\
    location /hls/low {\
        types {\
            application/vnd.apple.mpegurl m3u8;\
            video/mp2t ts;\
        }\
        alias /tmp/hls/low;\
        expires -1;\
        add_header Cache-Control no-cache;\
        add_header "Access-Control-Allow-Origin" "*";\
        add_header "Access-Control-Allow-Methods" "GET, OPTIONS";\
        add_header "Access-Control-Allow-Headers" "Range";\
        add_header "Access-Control-Expose-Headers" "Content-Length, Content-Range";\
    }\
' "$SITE_CONF"
    else
        echo "HLS configuration already exists in $SITE_CONF. Skipping..."
    fi
}

# Function to create zip_and_remove.sh script
create_zip_and_remove_script() {
    echo "Creating zip_and_remove.sh script..."
    sudo bash -c "cat > $ZIP_AND_REMOVE_SCRIPT <<EOL
#!/bin/bash

# Find files that are not .zip and compress them
find "/var/www/html/streams/low/old" -type f ! -name '*.zip' -exec sh -c '
    for file; do
        zip "$file.zip" "$file" && rm "$file"
    done
' sh {} +
EOL"
    sudo chmod +x $ZIP_AND_REMOVE_SCRIPT
}

# Function to create move_recorded_files.sh script
create_move_script() {
    echo "Creating move_recorded_files.sh script..."
    sudo bash -c "cat > $MOVE_SCRIPT <<EOL
#!/bin/bash

SOURCE_DIR="/var/www/html/streams/low"
DEST_DIR="/var/www/html/streams/low/old"

# Find and move files older than 5 minutes
find $SOURCE_DIR -maxdepth 1 -type f -mmin +5 -exec mv {} $DEST_DIR \;
EOL"
    sudo chmod +x $MOVE_SCRIPT
}

# Function to create cron jobs
create_cron_jobs() {
    echo "Setting up cron jobs..."
    CRON_JOB="/etc/cron.d/rtmp_cleanup"
    if [ ! -f "$CRON_JOB" ]; then
        sudo bash -c "cat > $CRON_JOB <<EOL
*/5 * * * * root find $STREAM_LIVE_DIR -type f -name '*.flv' -size +500M -exec rm {} \;
EOL"
        sudo chmod 0644 "$CRON_JOB"
    else
        echo "Cron job for cleanup already exists. Skipping..."
    fi

    CRON_JOB="$CRON_ZIP_AND_REMOVE"
    if [ ! -f "$CRON_ZIP_AND_REMOVE" ]; then
        sudo bash -c "cat > $CRON_ZIP_AND_REMOVE <<EOL
*/5 * * * * root $ZIP_AND_REMOVE_SCRIPT
EOL"
        sudo chmod 0644 "$CRON_ZIP_AND_REMOVE"
    else
        echo "Cron job for compressing and removing old streams already exists. Skipping..."
    fi

    CRON_JOB="$CRON_MOVE_FILES"
    if [ ! -f "$CRON_MOVE_FILES" ]; then
        sudo bash -c "cat > $CRON_MOVE_FILES <<EOL
*/5 * * * * root $MOVE_SCRIPT
EOL"
        sudo chmod 0644 "$CRON_MOVE_FILES"
    else
        echo "Cron job for moving recorded files already exists. Skipping..."
    fi
}

# Main execution
install_dependencies
backup_configs
create_directories
update_nginx_conf
update_site_conf
create_zip_and_remove_script
#!/bin/bash

set -e

echo "Starting RTMP setup..."

# Variables
NGINX_CONF="/etc/nginx/nginx.conf"
SITE_CONF="/etc/nginx/sites-available/tigers-team.com"
BACKUP_DIR="/etc/nginx/backup_$(date +'%Y%m%d%H%M%S')"
HLS_DIR="/tmp/hls"
HLS_LIVE_DIR="/tmp/hls/live"
HLS_LOW_DIR="/tmp/hls/low"
STREAM_LIVE_DIR="/var/www/html/streams/live"
STREAM_LOW_DIR="/var/www/html/streams/low"
ZIP_AND_REMOVE_SCRIPT="/usr/local/bin/zip_and_remove.sh"
MOVE_SCRIPT="/usr/local/bin/move_recorded_files.sh"
CRON_ZIP_AND_REMOVE="/etc/cron.d/compress_streams"
CRON_MOVE_FILES="/etc/cron.d/move_recorded_files"
NGINX_RTMP_MOD="libnginx-mod-rtmp"

# Function to check and install dependencies
install_dependencies() {
    echo "Checking and installing dependencies..."
    sudo apt update
    if ! dpkg -l | grep -q $NGINX_RTMP_MOD; then
        sudo apt install -y nginx $NGINX_RTMP_MOD
    else
        echo "$NGINX_RTMP_MOD is already installed. Skipping..."
    fi
    if ! dpkg -l | grep -q zip; then
        sudo apt install -y zip
    else
        echo "zip is already installed. Skipping..."
    fi
}

# Function to backup configuration files
backup_configs() {
    echo "Backing up configuration files to $BACKUP_DIR..."
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp "$NGINX_CONF" "$BACKUP_DIR/nginx.conf.bak"
    sudo cp "$SITE_CONF" "$BACKUP_DIR/tigers-team.com.bak"
}

# Function to create necessary directories
create_directories() {
    echo "Creating necessary directories..."
    sudo mkdir -p "$HLS_LIVE_DIR"
    sudo mkdir -p "$HLS_LOW_DIR"
    sudo mkdir -p "$STREAM_LIVE_DIR"
    sudo mkdir -p "$STREAM_LOW_DIR"
    sudo mkdir -p "$STREAM_LOW_DIR/old"
    sudo chown -R www-data:www-data "$HLS_DIR"
    sudo chown -R www-data:www-data "$STREAM_LIVE_DIR"
    sudo chown -R www-data:www-data "$STREAM_LOW_DIR"
}

# Function to update nginx.conf
update_nginx_conf() {
    echo "Updating $NGINX_CONF..."
    if ! grep -q "rtmp {" "$NGINX_CONF"; then
        sudo sed -i '/http {/i\
rtmp {\
    server {\
        listen 1935;\
\
        application live {\
            live on;\
            record all;\
            record_path /var/www/html/streams/live;\
            record_suffix -%Y%m%d%H%M%S.flv;\
            record_interval 5m;\
            record_unique on;\
            record_audio on;\
            hls on;\
            hls_path /tmp/hls/live;\
            hls_fragment 1s;\
        }\
\
        application low {\
            live on;\
            record all;\
            record_path /var/www/html/streams/low;\
            record_suffix -%Y%m%d%H%M%S.flv;\
            record_interval 5m;\
            record_unique on;\
            record_audio on;\
            hls on;\
            hls_path /tmp/hls/low;\
            hls_fragment 1s;\
            hls_variant _low BANDWIDTH=256000;\
            hls_variant _mid BANDWIDTH=512000;\
            hls_variant _hi BANDWIDTH=1024000;\
        }\
    }\
}\
' "$NGINX_CONF"
    else
        echo "RTMP configuration already exists in $NGINX_CONF. Skipping..."
    fi
}

# Function to update site configuration
update_site_conf() {
    echo "Updating $SITE_CONF..."
    if ! grep -q "location /hls" "$SITE_CONF"; then
        sudo sed -i '/server_name tigers-team.com www.tigers-team.com;/a\
    location /hls/live {\
        types {\
            application/vnd.apple.mpegurl m3u8;\
            video/mp2t ts;\
        }\
        alias /tmp/hls/live;\
        expires -1;\
        add_header Cache-Control no-cache;\
        add_header "Access-Control-Allow-Origin" "*";\
        add_header "Access-Control-Allow-Methods" "GET, OPTIONS";\
        add_header "Access-Control-Allow-Headers" "Range";\
        add_header "Access-Control-Expose-Headers" "Content-Length, Content-Range";\
    }\
\
    location /hls/low {\
        types {\
            application/vnd.apple.mpegurl m3u8;\
            video/mp2t ts;\
        }\
        alias /tmp/hls/low;\
        expires -1;\
        add_header Cache-Control no-cache;\
        add_header "Access-Control-Allow-Origin" "*";\
        add_header "Access-Control-Allow-Methods" "GET, OPTIONS";\
        add_header "Access-Control-Allow-Headers" "Range";\
        add_header "Access-Control-Expose-Headers" "Content-Length, Content-Range";\
    }\
' "$SITE_CONF"
    else
        echo "HLS configuration already exists in $SITE_CONF. Skipping..."
    fi
}

# Function to create zip_and_remove.sh script
create_zip_and_remove_script() {
    echo "Creating zip_and_remove.sh script..."
    sudo bash -c "cat > $ZIP_AND_REMOVE_SCRIPT <<EOL
#!/bin/bash

# Find files that are not .zip and compress them
find "/var/www/html/streams/low/old" -type f ! -name '*.zip' -exec sh -c '
    for file; do
        zip "\$file.zip" "\$file" && rm "\$file"
    done
' sh {} +
EOL"
    sudo chmod +x $ZIP_AND_REMOVE_SCRIPT
}

# Function to create move_recorded_files.sh script
create_move_script() {
    echo "Creating move_recorded_files.sh script..."
    sudo bash -c "cat > $MOVE_SCRIPT <<EOL
#!/bin/bash

SOURCE_DIR="/var/www/html/streams/low"
DEST_DIR="/var/www/html/streams/low/old"

# Find and move files older than 5 minutes
find "\$SOURCE_DIR" -maxdepth 1 -type f -mmin +5 -exec mv {} "\$DEST_DIR" \;
EOL"
    sudo chmod +x $MOVE_SCRIPT
}

# Function to create cron jobs
create_cron_jobs() {
    echo "Setting up cron jobs..."
    CRON_JOB="/etc/cron.d/rtmp_cleanup"
    if [ ! -f "$CRON_JOB" ]; then
        sudo bash -c "cat > $CRON_JOB <<EOL
*/5 * * * * root find $STREAM_LIVE_DIR -type f -name '*.flv' -size +500M -exec rm {} \;
EOL"
        sudo chmod 0644 "$CRON_JOB"
    else
        echo "Cron job for cleanup already exists. Skipping..."
    fi

    CRON_JOB="$CRON_ZIP_AND_REMOVE"
    if [ ! -f "$CRON_ZIP_AND_REMOVE" ]; then
        sudo bash -c "cat > $CRON_ZIP_AND_REMOVE <<EOL
*/5 * * * * root $ZIP_AND_REMOVE_SCRIPT
EOL"
        sudo chmod 0644 "$CRON_ZIP_AND_REMOVE"
    else
        echo "Cron job for compressing and removing old streams already exists. Skipping..."
    fi

    CRON_JOB="$CRON_MOVE_FILES"
    if [ ! -f "$CRON_MOVE_FILES" ]; then
        sudo bash -c "cat > $CRON_MOVE_FILES <<EOL
*/5 * * * * root $MOVE_SCRIPT
EOL"
        sudo chmod 0644 "$CRON_MOVE_FILES"
    else
        echo "Cron job for moving recorded files already exists. Skipping..."
    fi
}

# Main execution
install_dependencies
backup_configs
create_directories
update_nginx_conf
update_site_conf
create_zip_and_remove_script
create_move_script
create_cron_jobs

# Restart Nginx to apply changes
echo "Restarting Nginx..."
sudo nginx -t && sudo systemctl restart nginx

# Print OBS URL and Key information
OBS_URL="rtmp://$(hostname -I | awk '{print $1}')/live"
OBS_KEY="OBS_Stream"

echo "Setup completed successfully!"
echo "Use the following URL and Key in OBS:"
echo "URL: $OBS_URL"
echo "Stream Key: $OBS_KEY"
echo "HLS live streams are stored in: $HLS_LIVE_DIR"
echo "HLS low quality streams are stored in: $HLS_LOW_DIR"
echo "Recorded live streams are stored in: $STREAM_LIVE_DIR"
echo "Recorded low quality streams are stored in: $STREAM_LOW_DIR"

echo "RTMP setup process finished."

create_cron_jobs

# Restart Nginx to apply changes
echo "Restarting Nginx..."
sudo nginx -t && sudo systemctl restart nginx

# Print OBS URL and Key information
OBS_URL="rtmp://$(hostname -I | awk '{print $1}')/live"
OBS_KEY="OBS_Stream"

echo "Setup completed successfully!"
echo "Use the following URL and Key in OBS:"
echo "URL: $OBS_URL"
echo "Stream Key: $OBS_KEY"
echo "HLS live streams are stored in: $HLS_LIVE_DIR"
echo "HLS low quality streams are stored in: $HLS_LOW_DIR"
echo "Recorded live streams are stored in: $STREAM_LIVE_DIR"
echo "Recorded low quality streams are stored in: $STREAM_LOW_DIR"

echo "RTMP setup process finished."
