#!/bin/bash

########################################################
# Usage: 
# ./server_scripts/handle_env.sh Non-Prod
# ./server_scripts/handle_env.sh Stage
# ./server_scripts/handle_env.sh Prod

########################################################

ENVIRONMENT=$1
ENV_FILE=".env"

# Define hostnames for each environment
HOST_NON_PROD="http://localhost:8081"
HOST_STAGE="http://139.59.174.109/api"
HOST_PROD="https://www.tigers-team.com/api"

# Common configuration values (without hostname)
CONFIG_KEYS=(
    "REACT_APP_USERS_ENDPOINT"
    "REACT_APP_CURRENT_USER_ENDPOINT"
    "REACT_APP_LOGIN_ENDPOINT"
    "REACT_APP_CHECK_TOKEN_ENDPOINT"
    "REACT_APP_NON_CUSTOMER_USERS_ENDPOINT"
    "REACT_APP_RESET_PASSWORD"
    "REACT_APP_REQUEST_RESET_PASSWORD"
    "REACT_APP_BRANCHES_ENDPOINT"
    "REACT_APP_PCS_ENDPOINT"
    "REACT_APP_PCS_AVAILABILITY_ENDPOINT"
    "REACT_APP_CREATE_RESERVATION_ENDPOINT"
    "REACT_APP_CREATE_RESERVATIONS_BULK_ENDPOINT"
    "REACT_APP_RESERVATION_ENDPOINT"
    "REACT_APP_USER_RESERVATIONS_ENDPOINT"
    "REACT_APP_REGISTRATION_FORM_ENDPOINT"
    "REACT_APP_REGISTRATION_BY_EMAIL_ENDPOINT"
    "REACT_APP_ACTIVITIES_ENDPOINT"
    "REACT_APP_SOCKET_SERVER_URL"
    "REACT_APP_SOCKET_ENDPOINT"
    "REACT_APP_STREAM_PASSWORD"
    "REACT_APP_ADMIN_REPORTS_URL"
    "REACT_APP_ADMIN_USERNAME"
    "REACT_APP_ADMIN_PASSWORD"
    "REACT_APP_PRODUCTS_ENDPOINT"
    "REACT_APP_PRODUCT_BY_ID_ENDPOINT"
    "REACT_APP_PRODUCT_BY_CATEGORY_ENDPOINT"
    "REACT_APP_PRODUCT_SEARCH_ENDPOINT"
    "REACT_APP_CATEGORIES_ENDPOINT"
    "REACT_APP_CATEGORY_BY_ID_ENDPOINT"
    "REACT_APP_ORDERS_ENDPOINT"
    "REACT_APP_ORDER_BY_ID_ENDPOINT"
    "REACT_APP_ORDER_ITEMS_ENDPOINT"
    "REACT_APP_ORDER_ITEM_BY_ID_ENDPOINT"
    "REACT_APP_ORDER_BY_USERNAME_ENDPOINT"
    "REACT_APP_CONTROLLERS_ENDPOINT"
    "REACT_APP_CONTROLLER_BY_ID_ENDPOINT"
)

CONFIG_VALUES=(
    "/users/"
    "/users/current"
    "/users/token"
    "/users/check-token"
    "/users/non-end-users"
    "/users/reset-password"
    "/users/request-password-reset"
    "/branches/"
    "/pcs/"
    "/pcs/availability"
    "/reservations/"
    "/reservations/bulk"
    "/reservations/"
    "/reservations/by-user/"
    "/event_registrations/"
    "/event_registrations/by_email/"
    "/reports/"
    "/"
    "/stream/"
    "Tigers@20\$24"
    "https://www.tigers-team.com/access/reports/"
    "admin"
    "Tiger@Team@20-0-4"
    "/products/"
    "/products/"
    "/products/category/"
    "/products/search/"
    "/categories/"
    "/categories/"
    "/orders/"
    "/orders/"
    "/order-items/"
    "/order-items/"
    "/orders/by-username/"
    "/controllers/"
    "/controllers/"
)

# Determine the host based on the environment
case $ENVIRONMENT in
    "Non-Prod")
        HOST=$HOST_NON_PROD
        ;;
    "Stage")
        HOST=$HOST_STAGE
        ;;
    "Prod")
        HOST=$HOST_PROD
        ;;
    *)
        echo "Invalid environment. Please specify Non-Prod, Stage, or Prod."
        exit 1
        ;;
esac

# Write configuration to .env file
echo "Writing configuration to $ENV_FILE for $ENVIRONMENT environment"
echo "########################## $ENVIRONMENT  ##########################" > $ENV_FILE

for i in "${!CONFIG_KEYS[@]}"; do
    KEY=${CONFIG_KEYS[$i]}
    VALUE=${CONFIG_VALUES[$i]}

    if [[ "$KEY" == "REACT_APP_STREAM_PASSWORD" || "$KEY" == "REACT_APP_ADMIN_REPORTS_URL" || "$KEY" == "REACT_APP_ADMIN_USERNAME" || "$KEY" == "REACT_APP_ADMIN_PASSWORD" ]]; then
        echo "$KEY=$VALUE" >> $ENV_FILE
    else
        echo "$KEY=$HOST$VALUE" >> $ENV_FILE
    fi
done

echo "Configuration for $ENVIRONMENT environment has been written to $ENV_FILE."
