#!/bin/bash
# Post-merge setup for SEEN by Creova.
# Runs automatically after a task is merged into main.
#
# - Installs root deps (web app + npm overrides for vulnerability pins).
# - Installs mobile deps only when mobile/package.json changed,
#   to keep the common case fast.
set -e

echo "[post-merge] Installing root dependencies..."
npm install --no-audit --no-fund --prefer-offline

if git --no-optional-locks diff --name-only HEAD~1 HEAD 2>/dev/null | grep -q '^mobile/package.json$'; then
  echo "[post-merge] mobile/package.json changed — installing mobile dependencies..."
  (cd mobile && npm install --no-audit --no-fund --prefer-offline)
else
  echo "[post-merge] mobile/package.json unchanged — skipping mobile install."
fi

echo "[post-merge] Done."
