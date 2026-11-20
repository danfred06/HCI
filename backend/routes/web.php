<?php

use Illuminate\Support\Facades\Route;

// A controller-backed route (instead of a closure) keeps `route:cache` working.
Route::view('/', 'welcome');
