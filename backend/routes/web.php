<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Laravel's auth middleware redirects here for non-JSON requests. The API always
// responds with 401 JSON; this route keeps that fallback from throwing a 500.
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');
