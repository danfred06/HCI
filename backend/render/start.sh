#!/usr/bin/env bash
set -e

# Render has no pre-deploy command on the free plan, so deploy tasks run here
# on every container start (idempotent and safe to repeat).
echo "Running Laravel deploy scripts..."
for script in /var/www/html/scripts/*; do
    [ -f "$script" ] || continue
    echo "  -> $(basename "$script")"
    bash "$script"
done

echo "Starting PHP-FPM and nginx..."
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
