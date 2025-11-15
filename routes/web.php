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
});

require __DIR__.'/auth.php';

//okee
