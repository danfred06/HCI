<?php

// FRONTEND_URL is set by render.yaml; env() is safe here because config files
// are evaluated before `config:cache` bakes the values into the cached config.
$allowedOrigins = array_values(array_filter([
    'http://localhost',
    'http://127.0.0.1',
    env('FRONTEND_URL'),
]));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Explicit production frontend plus any local dev port (Vite may fall back
    // to 5174, 5175, ... when busy).
    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [
        '/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/',
        '/^https:\/\/[a-z0-9-]+\.onrender\.com$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
