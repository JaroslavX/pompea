#!/usr/bin/env bash
# Build the site locally and pack it into ~/Downloads/pompeya-release-<id>.zip
# Usage: scripts/build-release.sh
set -euo pipefail
cd "$(dirname "$0")/.."

id="d$(date +%m%d%H%M)"
# new id => new ?dpl= query on every asset URL, which bypasses stale nginx/browser caches
sed -i -E "s/deploymentId: \"[^\"]*\"/deploymentId: \"$id\"/" next.config.mjs
grep -q "deploymentId: \"$id\"" next.config.mjs

rm -rf .next
npm run build

out="$HOME/Downloads/pompeya-release-$id.zip"
rm -f "$HOME"/Downloads/pompeya-release-*.zip
zip -qry "$out" .next package.json package-lock.json server.js next.config.mjs public \
  scripts/server-deploy.sh -x ".next/cache/*" ".next/dev/*"

echo
echo "Release:  $out"
echo "Deploy id: $id"
echo "Upload it to ~/pompeya-next on the server, then run:"
echo "  bash ~/pompeya-next/scripts/server-deploy.sh pompeya-release-$id.zip"
