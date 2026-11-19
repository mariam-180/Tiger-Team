#!/bin/bash

set -e

# Define directories and server details
SERVER="${SERVER:?Set SERVER to the deployment SSH target}"
REMOTE_DIR_OLD="/var/www/html/streams/low/old"
REMOTE_DIR="/var/www/html/streams/low/old/processed"
LOCAL_DIR="${LOCAL_DIR:-./media}"
MEDIA_DIR="$LOCAL_DIR/var/www/html/streams/low/old"
PROCESSED_DIR="$LOCAL_DIR/Processed"

# Function to move files to the processed directory
move_files() {
    echo "Moving .zip files to $REMOTE_DIR..."
    ssh $SERVER "mkdir -p $REMOTE_DIR && mv $REMOTE_DIR_OLD/*.zip $REMOTE_DIR/"
}

# Function to download files
download_files() {
    echo "Downloading files from $REMOTE_DIR..."
    mkdir -p "$LOCAL_DIR"
    scp -r $SERVER:$REMOTE_DIR/*.zip "$LOCAL_DIR"
}

# Function to clear remote directory
clear_remote_dir() {
    echo "Clearing files in $REMOTE_DIR..."
    ssh $SERVER "rm -rf $REMOTE_DIR/*"
}

# Function to clear local directory
delete_uncombined_videos() {
    echo "Deleting combined videos..."

    for mp4_file in "$PROCESSED_DIR"/*; do
        if [ -e "$mp4_file" ]; then
            echo "Deleting $mp4_file"
            rm "$mp4_file"
            if [ $? -eq 0 ]; then
                echo "Successfully deleted $mp4_file"
            else
                echo "Failed to delete $mp4_file"
            fi
        fi
    done

    echo "Deletion of combined videos completed."
}

# Function to unzip files
unzip_files() {
    echo "Unzipping files in $LOCAL_DIR..."
    cd "$LOCAL_DIR"
    find . -type f -name '*.zip' -exec sh -c '
        for file; do
            unzip -o "$file" -d "$(dirname "$file")" && rm "$file"
        done
    ' sh {} +
}

# Function to convert .flv to .mp4
convert_flv_to_mp4() {
    echo "Converting .flv files to .mp4 in $MEDIA_DIR..."
    # Ensure the directory exists
    if [ ! -d "$MEDIA_DIR" ]; then
        echo "Directory $MEDIA_DIR does not exist."
        exit 1
    fi

    # Loop through all .flv files in the directory
    for flv_file in "$MEDIA_DIR"/*.flv; do
        # Skip if no .flv files are found
        if [ ! -e "$flv_file" ]; then
            echo "No .flv files found in $MEDIA_DIR."
            break
        fi

        # Define the output .mp4 file name
        mp4_file="${flv_file%}.mp4"

        # Convert .flv to .mp4
        echo "Converting $flv_file to $mp4_file"
        ffmpeg -i "$flv_file" -c:v libx264 -c:a aac "$mp4_file"

        # Check if conversion was successful
        if [ $? -eq 0 ]; then
            echo "Successfully converted $flv_file to $mp4_file"
            # Optionally, remove the original .flv file
            rm "$flv_file"
            mv "$mp4_file" "$PROCESSED_DIR"
        else
            echo "Failed to convert $flv_file"
        fi
    done
}

# Function to rename files
rename_files() {
    echo "Renaming files in $PROCESSED_DIR..."
    for mp4_file in "$PROCESSED_DIR"/*.mp4; do
        if [ ! -e "$mp4_file" ]; then
            echo "No .mp4 files found in $PROCESSED_DIR."
            break
        fi

        # Skip files that do not start with 'OBS_Stream'
        if [[ $(basename "$mp4_file") != OBS_Stream* ]]; then
            echo "Skipping $mp4_file as it does not start with 'OBS_Stream'"
            continue
        fi

        # Extract the timestamp from the filename using sed
        TIMESTAMP=$(echo "$mp4_file" | sed -n 's/.*-\([0-9]\{14\}\)\.flv\.mp4/\1/p')

        # Check if timestamp extraction was successful
        if [ -z "$TIMESTAMP" ]; then
            echo "Failed to extract timestamp from $mp4_file"
            continue
        fi

        # Convert timestamp to readable format
        YEAR=${TIMESTAMP:0:4}
        MONTH=${TIMESTAMP:4:2}
        DAY=${TIMESTAMP:6:2}
        HOURS=${TIMESTAMP:8:2}
        MINS=${TIMESTAMP:10:2}
        SECS=${TIMESTAMP:12:2}

        # Add 3 hours to the timestamp
        NEW_TIMESTAMP=$(date -j -f "%Y%m%d%H%M%S" "${YEAR}${MONTH}${DAY}${HOURS}${MINS}${SECS}" "+%Y%m%d%H%M%S" -v+3H)

        # Convert new timestamp to readable format
        NEW_YEAR=${NEW_TIMESTAMP:0:4}
        NEW_MONTH=${NEW_TIMESTAMP:4:2}
        NEW_DAY=${NEW_TIMESTAMP:6:2}
        NEW_HOURS=${NEW_TIMESTAMP:8:2}
        NEW_MINS=${NEW_TIMESTAMP:10:2}

        READABLE_TIMESTAMP="${NEW_YEAR}-${NEW_MONTH}-${NEW_DAY} @ ${NEW_HOURS}:${NEW_MINS}"

        # Define the new filename
        NEW_FILENAME="${PROCESSED_DIR}/Stream: ${READABLE_TIMESTAMP}.mp4"

        # Rename the file
        mv "$mp4_file" "$NEW_FILENAME"

        if [ $? -eq 0 ]; then
            echo "Successfully renamed $mp4_file"
        else
            echo "Failed to rename $mp4_file"
        fi
    done
}

# Function to combine videos into segments with max 30 minutes
combine_videos() {
    echo "Combining videos into 15-minute segments..."

    # List all .mp4 files in the directory
    mp4_files=("$PROCESSED_DIR"/*.mp4)

    # Check if there are any .mp4 files
    if [ ${#mp4_files[@]} -eq 0 ]; then
        echo "No .mp4 files found in $PROCESSED_DIR."
        return
    fi

    # Initialize variables
    combined_list=()
    current_duration=0
    segment_index=1

    for mp4_file in "${mp4_files[@]}"; do
        # Get the duration of the current file in seconds
        duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$mp4_file")
        duration=${duration%.*} # Convert to integer

        # Check if adding the current file exceeds 30 minutes
        if ((current_duration + duration > 900)); then
            # Extract the starting time from the first file in the combined list
            start_time=$(basename "$mp4_file" | sed -n 's/.*\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} @ [0-9]\{2\}:[0-9]\{2\}\)\.mp4/\1/p')
            if [ -z "$start_time" ]; then
                start_time="unknown"
            else
                # Convert start time to readable format
                readable_start_time=$(echo $start_time | sed 's/@/_/; s/:/-/g')
            fi

            # Convert start time to readable format
            start_year=${start_time:0:4}
            start_month=${start_time:5:2}
            start_day=${start_time:8:2}
            start_hours=${start_time:13:2}
            start_mins=${start_time:16:2}
            readable_start_time="${start_year}-${start_month}-${start_day}_${start_hours}-${start_mins}"
            # Format the total duration of the combined videos
            total_minutes=$((current_duration / 60))
            total_seconds=$((current_duration % 60))
            readable_duration=$(printf "%02d:%02d" $total_minutes $total_seconds)

            # Combine the current list of files
            output_file="${LOCAL_DIR}/${readable_start_time} * ${readable_duration}.mp4"
            echo "Combining into $output_file"
            ffmpeg -f concat -safe 0 -i <(for f in "${combined_list[@]}"; do echo "file '$f'"; done) -c copy "$output_file"

            # Reset variables
            combined_list=()
            current_duration=0
            segment_index=$((segment_index + 1))
        fi

        # Add the current file to the list
        combined_list+=("$mp4_file")
        current_duration=$((current_duration + duration))
    done

    # Combine any remaining files
    if [ ${#combined_list[@]} -gt 0 ]; then
        start_time=$(basename "$mp4_file" | sed -n 's/.*\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} @ [0-9]\{2\}:[0-9]\{2\}\)\.mp4/\1/p')
        if [ -z "$start_time" ]; then
            start_time="unknown"
        else
            # Convert start time to readable format
            readable_start_time=$(echo $start_time | sed 's/@/_/; s/:/-/g')
        fi

        start_year=${start_time:0:4}
        start_month=${start_time:5:2}
        start_day=${start_time:8:2}
        start_hours=${start_time:13:2}
        start_mins=${start_time:16:2}
        readable_start_time="${start_year}-${start_month}-${start_day}_${start_hours}-${start_mins}"

        total_minutes=$((current_duration / 60))
        total_seconds=$((current_duration % 60))
        readable_duration=$(printf "%02d:%02d" $total_minutes $total_seconds)

        output_file="${LOCAL_DIR}/${readable_start_time} * ${readable_duration}.mp4"
        echo "Combining into $output_file"
        ffmpeg -f concat -safe 0 -i <(for f in "${combined_list[@]}"; do echo "file '$f'"; done) -c copy "$output_file"
    fi

    echo "Video combination completed."
}

# Main function to run all tasks
main() {
    move_files
    download_files
    # unzip_files
    # convert_flv_to_mp4
    # rename_files
    if [ "$1" == "clean" ]; then
        clear_remote_dir
    fi
    if [ "$1" == "up" ] || [ "$2" == "up" ]; then
        combine_videos
    fi
    if [ "$1" == "all" ] || [ "$2" == "all" ] || [ "$3" == "all" ]; then
        delete_uncombined_videos
    fi
    echo "Operation completed successfully!"
}

main $1 $2 $3
