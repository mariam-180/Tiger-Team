#!/bin/bash

# Define MySQL credentials
MYSQL_ROOT_PASSWORD="secret-root-pw"
MYSQL_USER="user"
MYSQL_PASSWORD="password"
MYSQL_DATABASE="tigersTeam"

# Run commands inside the MySQL container
docker exec -i tigers-team-db mysql -u root -p${MYSQL_ROOT_PASSWORD} <<EOF
-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;

-- Create the user if it doesn't exist
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';

-- If the user already exists, update the password
ALTER USER '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
EOF

# Restart the Docker Compose services to apply changes
docker-compose down
docker-compose up -d

# Check the logs for the tigers-team-alembic service
docker-compose logs -f tigers-team-alembic
