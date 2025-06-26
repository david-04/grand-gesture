#!/usr/bin/env bash

set -e -o pipefail

function __gg_update_version_number() {
    unset -f __gg_update_version_number

    if [[ -d bin ]]; then
        cd bin
    fi
    echo Updating version number...
    sed -i -E "s/\"version\"\\s*:\\s*\"[^\"]*\"/\"version\": \"$(get-version-number.sh)\"/g" ../manifest.json
}

__gg_update_version_number "$@"
