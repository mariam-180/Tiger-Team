#!/bin/bash

# Function to remove duplicate cron jobs
remove_duplicate_cron_jobs() {
    local user=$1
    crontab -l -u "$user" | awk '!x[$0]++' | crontab -u "$user" -
}

# Remove duplicate cron jobs for the current user
remove_duplicate_cron_jobs "$(whoami)"

# If you want to remove duplicate cron jobs for the root user, uncomment the following line
# remove_duplicate_cron_jobs "root"

echo "Duplicate cron jobs removed successfully!"
