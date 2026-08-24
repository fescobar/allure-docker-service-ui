#!/bin/bash
set -e

# Restore fresh UI build assets from template if available
if [ -d "$ROOT/ui-template" ]; then
    cp -r $ROOT/ui-template/* $ROOT/ui/
fi

# Sanitize URL_PREFIX:
# e.g., "my-prefix" -> "/my-prefix", "/my-prefix/" -> "/my-prefix", "" -> "", "/" -> ""
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

exec "$@"
