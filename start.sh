#!/usr/bin/env bash
set -e

# 1) VA Server
echo "[VA] build+start..."
npm --prefix apps/va-server ci
npm --prefix apps/va-server run build
nohup node apps/va-server/dist/server.js > va.log 2>&1 &

# 2) Manos Agent
echo "[MANOS] agent start..."
export VA_BASE="http://127.0.0.1:8080"
# Ensure MANOS_TOKEN is the same as in apps/va-server/.env
export MANOS_TOKEN="<replace_with_your_manos_token>"
# If you are using an external Manus API, uncomment and set these:
# export MANUS_API_URL="https://api.manus.im/v1"
# export MANOS_API_KEY="<your_manos_api_key>"

nohup node manos-agent.mjs > manos.log 2>&1 &

echo "All started. Check va.log & manos.log"

