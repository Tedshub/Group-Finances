<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RelationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard menampilkan user + relasinya
Route::get('/dashboard', function () {
    return Inertia::render('DashboardPage');
})->middleware(['auth', 'verified'])->name('dashboard');

// Semua route di bawah ini hanya untuk user login
Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Relation routes
    // Route untuk search relation (harus di atas resource routes)
    Route::post('/relations/search', [RelationController::class, 'search'])->name('relations.search');

    // Route untuk join relation
    Route::post('/relations/join', [RelationController::class, 'join'])->name('relations.join');

    // Route untuk leave relation
    Route::delete('/relations/{relation}/leave', [RelationController::class, 'leave'])->name('relations.leave');

    // Route untuk get members of a relation
    Route::get('/relations/{relation}/members', [RelationController::class, 'members'])->name('relations.members');

    // Resource routes untuk CRUD relation
    Route::resource('relations', RelationController::class);
});

require __DIR__.'/auth.php';
