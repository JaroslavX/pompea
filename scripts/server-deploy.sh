#!/usr/bin/env bash
# Run on the cPanel server (Terminal). Unpacks a release zip that was uploaded to ~/pompeya-next
# and refreshes the static copies nginx serves from public_html.
# Usage: bash ~/pompeya-next/scripts/server-deploy.sh pompeya-release-<id>.zip
set -euo pipefail

# Everything lives in a function and the file ends with one 'main; exit' line, so replacing this
# script (it ships inside the release zip) while it runs cannot confuse bash.
main() {

  APP="$HOME/pompeya-next"
  WEB="$HOME/public_html"
  MODULES="$HOME/pompeya-modules/node_modules"
  zip_name="${1:?usage: server-deploy.sh <release.zip>}"
  zip="$APP/$zip_name"

  [ -f "$zip" ] || { echo "Not found: $zip (upload it to $APP first)"; exit 1; }
  mkdir -p "$MODULES"

  # keep a copy of the previous build so a bad release can be rolled back
  cd "$APP"
  rm -rf "$HOME/pompeya-prev" && mkdir -p "$HOME/pompeya-prev"
  cp -a .next public server.js next.config.mjs "$HOME/pompeya-prev/" 2>/dev/null || true

  # replace the app files (node_modules is deliberately not touched)
  rm -rf .next public server.js next.config.*
  unzip -oq "$zip"
  rm -f "$zip"

  # dependencies: reinstall in ~/pompeya-modules only when package-lock.json changed
  if ! cmp -s "$APP/package-lock.json" "$MODULES/../package-lock.json"; then
    echo "package-lock.json changed -> reinstalling dependencies in ~/pompeya-modules (about a minute)"
    set +u
    # shellcheck disable=SC1091
    source "$HOME/nodevenv/pompeya-next/24/bin/activate"
    set -u
    cd "$MODULES/.."
    cp "$APP/package.json" "$APP/package-lock.json" .
    npm ci --omit=dev --no-audit --no-fund --cache "$HOME/.npm-tmp"
    rm -rf "$HOME/.npm-tmp" "$HOME/.npm"
    cd "$APP"
  fi

  # static copies served directly by nginx
  rm -rf "$WEB/_next/static"
  mkdir -p "$WEB/_next"
  cp -r "$APP/.next/static" "$WEB/_next/static"
  cp -rf "$APP/public/." "$WEB/"

  # restart Passenger
  mkdir -p "$APP/tmp"
  touch "$APP/tmp/restart.txt"

  echo "Deployed: $(grep -o 'deploymentId: "[^"]*"' next.config.mjs)"
  echo "Disk: $(du -sh "$HOME" | cut -f1) of 1000M. Restart the app in cPanel if the site does not update."
  echo "Rollback: cd ~/pompeya-next && rm -rf .next public && cp -a ~/pompeya-prev/. ."
  echo "If pages look stale, purge the nginx cache in cPanel / ask the host."
}
main "$@"; exit $?
