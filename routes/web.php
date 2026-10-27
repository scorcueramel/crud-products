<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('products', ProductController::class)->except(['show']);
    Route::resource('users', UserController::class)->except(['show']);
});

require __DIR__.'/settings.php';
