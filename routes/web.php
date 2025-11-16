<?php
// routes/web.php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RelationController;
use App\Http\Controllers\TransactionController;
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

    // Relation routes //
    Route::resource('relations', RelationController::class);

    // Join & Leave
    Route::post('/relations/join', [RelationController::class, 'join'])->name('relations.join');
    Route::delete('/relations/{relation}/leave', [RelationController::class, 'leave'])->name('relations.leave');
    Route::post('/relations/search', [RelationController::class, 'search'])->name('relations.search');

    // Members
    Route::get('/relations/{relation}/members', [RelationController::class, 'members'])->name('relations.members');
    Route::delete('/relations/{relation}/kick/{user}', [RelationController::class, 'kickMember'])->name('relations.kick-member');

    // Join Requests - Full Page (Optional)
    Route::get('/relations/{relation}/pending-requests', [RelationController::class, 'pendingRequests'])
        ->name('relations.pending-requests');

    // Join Requests - JSON untuk AJAX (Required for Modal)
    Route::get('/relations/{relation}/pending-requests-json', [RelationController::class, 'pendingRequestsJson'])
        ->name('relations.pending-requests-json');

    Route::post('/relations/{relation}/requests/{request}/approve', [RelationController::class, 'approveRequest'])
        ->name('relations.approve-request');

    Route::post('/relations/{relation}/requests/{request}/approve-json', [RelationController::class, 'approveRequestJson'])
        ->name('relations.approve-request-json');

    Route::post('/relations/{relation}/requests/{request}/reject', [RelationController::class, 'rejectRequest'])
        ->name('relations.reject-request');

    Route::post('/relations/{relation}/requests/{request}/reject-json', [RelationController::class, 'rejectRequestJson'])
        ->name('relations.reject-request-json');

    // Cancel own request
    Route::delete('/relation-requests/{request}/cancel', [RelationController::class, 'cancelRequest'])
        ->name('relation-requests.cancel');

            // User's own pending requests (JSON untuk AJAX)
    Route::get('/api/user/pending-requests', [RelationController::class, 'getUserPendingRequests'])
        ->name('user.pending-requests');

    // Transactions routes //

    // Route untuk halaman transaksi utama
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

        // Destroy - Hapus transaksi (soft delete)
        Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])
            ->name('transactions.destroy');

        // Force Destroy - Hapus permanen (admin/owner only)
        Route::delete('/transactions/{transaction}/force', [TransactionController::class, 'forceDestroy'])
            ->name('transactions.force-destroy');

        // Restore - Restore soft deleted transaction
        Route::post('/transactions/{transaction}/restore', [TransactionController::class, 'restore'])
            ->name('transactions.restore');

        // Download bukti transaksi
        Route::get('/transactions/{transaction}/download-bukti', [TransactionController::class, 'downloadBukti'])
            ->name('transactions.download-bukti');
    });

    // API routes untuk AJAX (optional)
    Route::prefix('api/relations/{relation}')->group(function () {
        // Get transactions as JSON
        Route::get('/transactions-json', [TransactionController::class, 'getTransactionsJson'])
            ->name('api.transactions.json');
    });
});

require __DIR__.'/auth.php';

//okee
