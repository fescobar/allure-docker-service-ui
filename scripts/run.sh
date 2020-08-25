#!/bin/bash

### API Prefix
API_URL_PREFIX="/allure-docker-service"
if [ -n "$ALLURE_DOCKER_PUBLIC_API_URL_PREFIX" ]; then
    if [[ $ALLURE_DOCKER_PUBLIC_API_URL_PREFIX != /* ]]; then
        ALLURE_DOCKER_PUBLIC_API_URL_PREFIX="/$ALLURE_DOCKER_PUBLIC_API_URL_PREFIX"
    fi
    API_URL_PREFIX="$ALLURE_DOCKER_PUBLIC_API_URL_PREFIX$API_URL_PREFIX"
fi

FULL_ALLURE_DOCKER_API_URL="$ALLURE_DOCKER_PUBLIC_API_URL$API_URL_PREFIX"

### UI Prefix
UI_URL_PREFIX="/allure-docker-service-ui"
if [ -n "$URL_PREFIX" ]; then
    if [[ $URL_PREFIX != /* ]]; then
        URL_PREFIX="/$URL_PREFIX"
    fi
    UI_URL_PREFIX="$URL_PREFIX$UI_URL_PREFIX"
fi

echo """ALLURE_DOCKER_API_URL=${FULL_ALLURE_DOCKER_API_URL}
ROUTER_BASE_NAME=${UI_URL_PREFIX}""" > $ROOT/.env

cat $ROOT/.env

$ROOT/generate_env_file.sh

mv $ROOT/env-config.js $ROOT/ui

VERSION=$(cat $ROOT/ui/ui_version)
CONFIG_JSON=$(cat <<EOF
{
    "version": "$VERSION",
    "prefix": "$UI_URL_PREFIX",
    "full_allure_docker_api_url": "$FULL_ALLURE_DOCKER_API_URL"
}
EOF
)
echo $CONFIG_JSON > $ROOT/ui/config.json

URL_PREFIX="${URL_PREFIX}" node $ROOT/ui/server.js
