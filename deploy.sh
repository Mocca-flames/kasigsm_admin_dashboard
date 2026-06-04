#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="kasigsm-admin"
BUILD_DIR="dist"

echo "Building project..."
npm run build

echo "Ensuring Cloudflare Pages project exists..."
if ! npx wrangler pages project list | grep -q "$PROJECT_NAME"; then
  npx wrangler pages project create "$PROJECT_NAME" --production-branch main
fi

echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy "$BUILD_DIR" --project-name "$PROJECT_NAME" --commit-dirty=true

echo "Cache-busting: touching deployment to invalidate old browser cache..."
FUZZ=$(date +%s | sha256sum | head -c 8)
HASH=$(cd "$BUILD_DIR" && find . -type f -exec sha256sum {} \; | sha256sum | head -c 3)
echo "https://$PROJECT_NAME.pages.dev/?_cb=${FUZZ}${HASH}"

echo "Done!"
