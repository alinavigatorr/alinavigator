#!/bin/bash

cd /root/alinavigator

# ذخیره وضعیت فعلی و سالم کدها
OLD_HEAD=$(git rev-parse HEAD)

git fetch origin main
git pull origin main

if git diff --name-only $OLD_HEAD HEAD | grep -q 'package-lock.json'; then
    npm install
fi

# بررسی موفقیت یا شکست بیلد
if npm run build; then
    echo "Build successful! Restarting PM2..."
    pm2 restart marketplace-app
    pm2 save
else
    echo "Build failed! Aborting deployment and rolling back..."
    
    # بازگردانی کدها به حالت سالم قبلی
    git reset --hard $OLD_HEAD
    npm install
    npm run build
    
    echo "Rollback complete. PM2 was NOT restarted. Your site is still UP."
    exit 1
fi
