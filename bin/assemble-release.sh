#!/usr/bin/env bash

set -e -o pipefail

function __gg_assemble_release() {
    unset -f __gg_assemble_release

    if [[ -d bin ]]; then
        cd bin
    fi

    echo Assembling release...

    if [[ ! -e ../dist ]]; then
        mkdir -p ../dist
    fi
    . ./update-version-number.sh
    local VERSION_NUMBER
    VERSION_NUMBER=$(get-version-number.sh)
    ZIP_FILE="dist/grand-gesture-${VERSION_NUMBER?}.zip"
    cd ..
    if [[ -e ${ZIP_FILE?} ]]; then
        rm "${ZIP_FILE?}"
    fi
    zip -r -9 "${ZIP_FILE?}" _locales css html image js CHANGELOG.md LICENSE manifest.json README.md
    cd - >/dev/null
}

__gg_assemble_release "$@"
