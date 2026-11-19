#!/bin/bash

# Check and install geoiplookup if not installed
if ! command -v geoiplookup &> /dev/null; then
    echo "geoiplookup not found, installing..."
    sudo apt-get update
    sudo apt-get install -y geoip-bin geoip-database
fi

log_path="/var/log/nginx"
dates=("20/Jul/2024")
page="/Live"

ip_file=$(mktemp)
country_file=$(mktemp)

cleanup() {
    rm -f "$ip_file" "$country_file"
}
trap cleanup EXIT

extract_info_from_file() {
    local file=$1
    if [ -z "$page" ]; then
        awk '{print $1, $4, $7}' "$file" >> "$ip_file"
    else
        grep "$page" "$file" | awk '{print $1, $4, $7}' >> "$ip_file"
    fi
}

if [ ${#dates[@]} -eq 0 ]; then
    for file in $log_path/access.log*; do
        if [[ $file == *.gz ]]; then
            zcat "$file" 2>/dev/null | extract_info_from_file -
        else
            extract_info_from_file "$file"
        fi
    done
else
    for date in "${dates[@]}"; do
        for file in $log_path/access.log*; do
            if [[ $file == *.gz ]]; then
                zgrep "$date" "$file" 2>/dev/null | extract_info_from_file -
            else
                grep "$date" "$file" | extract_info_from_file -
            fi
        done
    done
fi

total_hits=$(cat "$ip_file" | wc -l)
echo "Total hits: $total_hits"

unique_visitors=$(cat "$ip_file" | awk '{print $1}' | sort | uniq | wc -l)
echo "Unique visitors: $unique_visitors"

echo "Processing information:"
cat "$ip_file" | head

while read -r ip date page; do
    lookup_result=$(geoiplookup "$ip")
    country=$(echo "$lookup_result" | awk -F ": " '{print $2}' | awk -F ", " '{print $1}')
    echo "IP: $ip, Date: $date, Page: $page, Lookup Result: $lookup_result, Country: $country"
    if [ -z "$country" ]; then
        country="Unknown"
    fi
    echo "$country $date $page"
done < "$ip_file" | sort | uniq -c | sort -nr > "$country_file"

# Debugging: Print the country file content
echo "Country file content:"
cat "$country_file"

echo -e "\nCountry-wise hits and unique visitors, with pages and dates:"
awk '{print $2}' "$country_file" | sort | uniq | while read -r country; do
    country_hits=$(grep -w "$country" "$country_file" | awk '{sum += $1} END {print sum}')
    echo "$country: Hits: $country_hits"
    grep -w "$country" "$country_file" | while read -r count country date page; do
        echo "  Date: $date, Page: $page, Hits: $count"
    done
done

cleanup
