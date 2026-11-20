<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Render terminates TLS at its edge, so the app only sees HTTP.
        // Force https when generating absolute URLs in production.
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
