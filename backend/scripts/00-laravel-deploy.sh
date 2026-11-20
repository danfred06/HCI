#!/usr/bin/env bash
set -e
cd /var/www/html

# Render's generateValue creates a raw base64 string. Laravel expects the
# "base64:" prefix, so normalize it here before caching the configuration.
if [ -n "$APP_KEY" ] && [[ "$APP_KEY" != base64:* ]]; then
    export APP_KEY="base64:$APP_KEY"
fi

echo "Caching configuration and routes..."
php artisan config:cache
php artisan route:cache

echo "Ensuring the public storage link exists..."
php artisan storage:link --force || true

echo "Running database migrations..."
php artisan migrate --force
