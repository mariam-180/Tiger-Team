#!/bin/bash

# Define variables
REPORT_DIR="/var/www/html/GoAccessReports"
CRON_FILE="/etc/cron.hourly/goaccess_update"
LOG_FILES="/var/log/nginx/access.log /var/log/nginx/access.log.*.gz /var/log/nginx/access.log.*"
FILTERED_LOG="/var/log/nginx/react_app_access.log"
BOTS_FILTER="/etc/nginx/bots.filter"

# Ensure GoAccess is installed
sudo apt-get update
sudo apt-get install goaccess -y

# Create directory if it doesn't exist
sudo mkdir -p $REPORT_DIR

# Change ownership and permissions
sudo chown -R www-data:www-data $REPORT_DIR
sudo chmod -R 755 $REPORT_DIR

# Create bots filter file
sudo tee $BOTS_FILTER > /dev/null <<EOF
bot
spider
crawl
EOF

# Filter logs for React app and generate initial GoAccess report
sudo zcat -f $LOG_FILES | grep 'GET /' | grep -v -f $BOTS_FILTER | sudo tee $FILTERED_LOG | sudo goaccess - -o $REPORT_DIR/index.html --log-format=COMBINED

# Create cron job to update GoAccess report hourly
sudo tee $CRON_FILE > /dev/null <<EOF
#!/bin/bash
LOG_FILES="/var/log/nginx/access.log /var/log/nginx/access.log.*.gz /var/log/nginx/access.log.*"
FILTERED_LOG="/var/log/nginx/react_app_access.log"
BOTS_FILTER="/etc/nginx/bots.filter"
zcat -f \$LOG_FILES | grep 'GET /' | grep -v -f \$BOTS_FILTER | tee \$FILTERED_LOG | goaccess - -o $REPORT_DIR/index.html --log-format=COMBINED >/dev/null 2>&1
EOF

# Ensure cron job is executable
sudo chmod +x $CRON_FILE

echo "Cron job for GoAccess report generation set up successfully."
