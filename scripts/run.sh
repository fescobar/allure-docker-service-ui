#!/bin/bash

# Ensure UI assets are restored and placeholder replaced
if [ -d "$ROOT/ui-template" ]; then
    cp -r $ROOT/ui-template/* $ROOT/ui/
fi

### Sanitize UI URL_PREFIX
SANITIZED_URL_PREFIX=""
if [ -n "$URL_PREFIX" ]; then
    URL_PREFIX=$(echo "$URL_PREFIX" | xargs)
    if [ -n "$URL_PREFIX" ] && [ "$URL_PREFIX" != "/" ]; then
        if [[ $URL_PREFIX != /* ]]; then
            URL_PREFIX="/$URL_PREFIX"
        fi
        URL_PREFIX="${URL_PREFIX%/}"
        SANITIZED_URL_PREFIX="$URL_PREFIX"
    fi
fi

# Replace /URL_PREFIX_PLACEHOLDER with SANITIZED_URL_PREFIX across all UI static files
if [ -d "$ROOT/ui" ]; then
    find "$ROOT/ui" -maxdepth 4 -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.json" \) ! -path "$ROOT/ui/node_modules/*" -exec sed -i "s|/URL_PREFIX_PLACEHOLDER|${SANITIZED_URL_PREFIX}|g" {} +
fi

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
if [ -n "$SANITIZED_URL_PREFIX" ]; then
    UI_URL_PREFIX="$SANITIZED_URL_PREFIX$UI_URL_PREFIX"
fi

echo """ALLURE_DOCKER_API_URL=${FULL_ALLURE_DOCKER_API_URL}
ROUTER_BASE_NAME=${UI_URL_PREFIX}""" > $ROOT/.env

$ROOT/generate_env_file.sh

mv $ROOT/env-config.js $ROOT/ui

VERSION=$(cat $ROOT/ui/ui_version 2>/dev/null || cat $ROOT/ui-template/ui_version 2>/dev/null || echo "na")
CONFIG_JSON=$(cat <<EOF
{
    "version": "$VERSION",
    "prefix": "$UI_URL_PREFIX",
    "full_allure_docker_api_url": "$FULL_ALLURE_DOCKER_API_URL"
}
EOF
)
echo "ALLURE_UI_VERSION: $VERSION"
cat $ROOT/.env
echo "$CONFIG_JSON" > $ROOT/ui/config.json

URL_PREFIX="${SANITIZED_URL_PREFIX}" node $ROOT/ui/server.js
