<?php
// routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RelationController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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
    // ==================== PROFILE ROUTES ====================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ==================== RELATION ROUTES ====================
    // Resource routes (index, create, store, show, edit, update, destroy)
    Route::resource('relations', RelationController::class);

    // Join & Leave
    Route::post('/relations/join', [RelationController::class, 'join'])->name('relations.join');
    Route::delete('/relations/{relation}/leave', [RelationController::class, 'leave'])->name('relations.leave');
    Route::post('/relations/search', [RelationController::class, 'search'])->name('relations.search');

    // Members Management
    Route::get('/relations/{relation}/members', [RelationController::class, 'members'])->name('relations.members');
    Route::delete('/relations/{relation}/kick/{user}', [RelationController::class, 'kickMember'])->name('relations.kick-member');

    // ==================== JOIN REQUEST ROUTES ====================
    // AJAX JSON endpoint untuk fetch pending requests (tetap JSON karena hanya fetch data)
    Route::get('/relations/{relation}/pending-requests-json', [RelationController::class, 'pendingRequestsJson'])
        ->name('relations.pending-requests-json');

    // User's own pending requests - AJAX (tetap JSON karena hanya fetch data)
    Route::get('/pending-requests', [RelationController::class, 'getUserPendingRequests'])
        ->name('relations.user-pending-requests');

    // ⚠️ PERUBAHAN: Approve, Reject, Cancel menggunakan REDIRECT (bukan JSON)
    Route::post('/relations/{relation}/requests/{request}/approve', [RelationController::class, 'approveRequest'])
        ->name('relations.approve-request');

    Route::post('/relations/{relation}/requests/{request}/reject', [RelationController::class, 'rejectRequest'])
        ->name('relations.reject-request');

    Route::delete('/pending-requests/{request}', [RelationController::class, 'cancelRequest'])
        ->name('relations.cancel-request');

    // ==================== TRANSACTION ROUTES ====================
    // Landing page untuk memilih relation
    Route::get('/transactions', [TransactionController::class, 'landing'])
        ->name('transactions.landing');

    // Transaction CRUD untuk relation tertentu
    Route::prefix('relations/{relation}')->group(function () {
        // Index - Tampilkan semua transaksi (pemasukan & pengeluaran terpisah)
        Route::get('/transactions', [TransactionController::class, 'index'])
            ->name('transactions.index');

        // Store - Tambah transaksi baru
        Route::post('/transactions', [TransactionController::class, 'store'])
            ->name('transactions.store');

        // Show - Detail transaksi
        Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])
            ->name('transactions.show');

        // Update - Edit transaksi
        Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])
            ->name('transactions.update');

        // Destroy - Hapus transaksi
        Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])
            ->name('transactions.destroy');

        // Preview bukti transaksi (inline/preview di browser)
        Route::get('/transactions/{transaction}/bukti/preview', [TransactionController::class, 'previewBukti'])
            ->name('transactions.bukti.preview');

        // Download bukti transaksi
        Route::get('/transactions/{transaction}/bukti/download', [TransactionController::class, 'downloadBukti'])
            ->name('transactions.bukti.download');
    });

    // ==================== API ROUTES (AJAX) ====================
    Route::prefix('api/relations/{relation}')->group(function () {
        // Get transactions as JSON
        Route::get('/transactions-json', [TransactionController::class, 'getTransactionsJson'])
            ->name('api.transactions.json');
    });
});

require __DIR__.'/auth.php';
