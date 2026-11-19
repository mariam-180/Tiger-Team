#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Create or activate the virtual environment in .venv
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "Created a new virtual environment in .venv"
else
    echo "Using existing virtual environment in .venv"
fi

# Activate the virtual environment
source .venv/bin/activate

# Install pip-tools if not installed
pip install --upgrade pip-tools

# Generate the requirements.txt from requirements.top
pip-compile requirements.top

# Install the latest dependencies from requirements.txt
pip install --no-cache-dir -r requirements.txt

echo "Dependencies installed successfully inside the virtual environment."