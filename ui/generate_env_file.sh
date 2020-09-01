#!/bin/bash

JS_CONFIG_FILE=./env-config.js
ENV_FILE=.env

rm -rf $JS_CONFIG_FILE
touch $JS_CONFIG_FILE

echo "window._env_ = {" >> $JS_CONFIG_FILE

while read -r LINE || [[ -n "$LINE" ]];
do
  if printf '%s\n' "$LINE" | grep -q -e '='; then
    VAR_NAME=$(printf '%s\n' "$LINE" | sed -e 's/=.*//')
    VAR_VALUE=$(printf '%s\n' "$LINE" | sed -e 's/^[^=]*=//')
  fi
  VALUE=$(printf '%s\n' "${!VAR_NAME}")
  [[ -z $VALUE ]] && VALUE=${VAR_VALUE}
  
  echo "  $VAR_NAME: \"$VALUE\"," >> $JS_CONFIG_FILE
done < $ENV_FILE

echo "}" >> $JS_CONFIG_FILE
