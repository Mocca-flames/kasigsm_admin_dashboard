#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="admin-kasigsm"
BUILD_DIR="dist"

echo "Building project..."
npm run build

echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy "$BUILD_DIR" --project-name "$PROJECT_NAME" --commit-dirty=true

echo "Done! Check https://$PROJECT_NAME.pages.dev for your deployed site."