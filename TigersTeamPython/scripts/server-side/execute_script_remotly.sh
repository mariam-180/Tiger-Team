#!/bin/bash

SERVER="${SERVER:?Set SERVER to the deployment SSH target}"

LOCAL_SCRIPT="scripts/server-side/analyze_traffic.sh"

ssh "$SERVER" 'bash -s' < "$LOCAL_SCRIPT"
