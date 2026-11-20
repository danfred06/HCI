# Pinned to a PHP2Shell-patched release (CVE-2026-109618 / CVE-2026-109619).
# Patched branches: 8.5.12, 8.4.27, 8.3.36, 8.2.35 — do not downgrade.
FROM php:8.4.27-fpm-alpine

# Runtime packages + PHP extensions required by Laravel 12 and PostgreSQL.
RUN apk add --no-cache bash nginx supervisor libpq libzip icu-libs \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS postgresql-dev libzip-dev icu-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql intl zip opcache \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP, php-fpm, nginx and supervisor configuration.
RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini
COPY render/php/docker-vars.ini /usr/local/etc/php/conf.d/docker-vars.ini
COPY render/php/www-overrides.conf /usr/local/etc/php-fpm.d/zz-overrides.conf
COPY render/nginx/nginx-site.conf /etc/nginx/http.d/default.conf
COPY render/supervisor/supervisord.conf /etc/supervisord.conf
COPY render/start.sh /start.sh

WORKDIR /var/www/html
COPY . .

# Install production dependencies at build time so cold starts stay fast.
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN chmod +x /start.sh \
    && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    COMPOSER_ALLOW_SUPERUSER=1

EXPOSE 80

CMD ["/start.sh"]
