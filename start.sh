#!/usr/bin/env bash
set -e

# 1) VA Server
echo "[VA] build+start..."
npm --prefix apps/va-server ci
npm --prefix apps/va-server run build
nohup node apps/va-server/dist/server.js > va.log 2>&1 &

# 2) Manos Agent
echo "[MANOS] agent start..."

# These environment variables must be set before running this script,
# either manually or via GitHub Secrets/CI/CD environment variables.
# Example:
# export VA_BASE="http://127.0.0.1:8080"
# export MANOS_TOKEN="<your_manos_token>"
# export MANOS_API_KEY="<your_manos_api_key>"
# export MANUS_API_URL="https://api.manus.im/v1"

# Check if required environment variables are set
if [ -z "$VA_BASE" ] || [ -z "$MANOS_TOKEN" ] || [ -z "$MANOS_API_KEY" ] || [ -z "$MANUS_API_URL" ]; then
  echo "Error: Required environment variables (VA_BASE, MANOS_TOKEN, MANOS_API_KEY, MANUS_API_URL) are not set."
  echo "Please set them before running start.sh."
  exit 1
fi

nohup node manos-agent.mjs > manos.log 2>&1 &

echo "All started. Check va.log & manos.log"

