#!/bin/bash

# Environment variables
MYSQL_USER="${MYSQL_USER:?Set MYSQL_USER}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:?Set MYSQL_PASSWORD}"
MYSQL_DATABASE="${MYSQL_DATABASE:?Set MYSQL_DATABASE}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
SERVER="${SERVER:?Set SERVER to the deployment SSH target}"
MYSQL_HOST="${MYSQL_HOST:-127.0.0.1}"

# Backup-specific variables
BACKUP_DIR="/tmp"
LOCAL_BACKUP_DIR="./db_backups"

# Date-time label for backup file
DATE_LABEL=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="db_backup_${DATE_LABEL}.sql"

# SSH into the server, create a backup, and remove it
echo "Creating backup on the server..."
ssh ${SERVER} << EOF
  export MYSQL_PWD=${MYSQL_PASSWORD}
  mysqldump -h ${MYSQL_HOST} -P ${MYSQL_PORT} -u ${MYSQL_USER} ${MYSQL_DATABASE} > ${BACKUP_DIR}/${BACKUP_FILE}
EOF

# Create local directory if it doesn't exist
mkdir -p ${LOCAL_BACKUP_DIR}

# Download the backup from the server
echo "Downloading backup to local machine..."
scp ${SERVER}:${BACKUP_DIR}/${BACKUP_FILE} ${LOCAL_BACKUP_DIR}/

# Remove the backup from the server
echo "Removing backup from the server..."
ssh ${SERVER} "rm ${BACKUP_DIR}/${BACKUP_FILE}"

echo "Backup and download completed. File saved to ${LOCAL_BACKUP_DIR}/${BACKUP_FILE}"
