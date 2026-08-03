#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================="
echo "Starting Marketplace Deployment..."
echo "=========================================="

# 1. Pull latest changes from the repository (uncomment if git is initialized on server)
# echo "Pulling latest code from Git..."
# git pull origin main

# 2. Install dependencies with clean cache for production
echo "Installing dependencies..."
npm ci --production=false

# 3. Build Next.js standalone application
echo "Building Next.js application..."
npm run build

# 4. Ensure logs directory exists for PM2
mkdir -p logs

# 5. Restart or start application with PM2
echo "Managing PM2 process..."
if pm2 describe marketplace-app > /dev/null 2>&1; then
  echo "Reloading existing PM2 process..."
  pm2 reload ecosystem.config.js --env production
else
  echo "Starting new PM2 process..."
  pm2 start ecosystem.config.js --env production
fi

echo "Save PM2 process list..."
pm2 save

echo "=========================================="
echo "Deployment Completed Successfully!"
echo "=========================================="