#!/bin/bash

# خروج از اسکریپت در صورت بروز خطا
set -e

PROJECT_DIR="/root/alinavigator"
BACKUP_DIR="/root/alinavigator_backup"

echo "➡️ [1/7] Navigating to project directory..."
cd "$PROJECT_DIR"

echo "➡️ [2/7] Pulling latest code from GitHub..."
git pull origin main

echo "➡️ [3/7] Installing dependencies safely..."
npm install --production=false

echo "➡️ [4/7] Backing up current working build..."
if [ -d ".next" ]; then
  rm -rf "$BACKUP_DIR"
  cp -r .next "$BACKUP_DIR"
fi

echo "➡️ [5/7] Building Next.js production bundle..."
if ! npm run build; then
  echo "❌ Build failed! Restoring previous build..."
  if [ -d "$BACKUP_DIR" ]; then
    rm -rf .next
    cp -r "$BACKUP_DIR" .next
  fi
  exit 1
fi

echo "➡️ [6/7] Preparing standalone output assets..."
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "➡️ [7/7] Safely restarting application via PM2..."
pm2 delete marketplace-app || true
pm2 start ecosystem.config.js
pm2 save

echo "🔍 Running Post-Deployment Health Check..."
sleep 3

# بررسی سلامت سایت روی پورت ۳۰۰۰
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ Deployment Successful! Application is healthy and responding with HTTP 200."
else
  echo "⚠️ Warning: Health check returned HTTP status: $HTTP_STATUS. Please inspect PM2 logs."
fi