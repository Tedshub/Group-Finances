<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RelationController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SavingsController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\StatementController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// resources/js/routes/web.php
Route::get('/coming-soon', function () {
    $feature = request('feature', 'default');

    $title = "Segera Hadir";
    $description = "Kami sedang mempersiapkan sesuatu yang luar biasa untuk Anda. Fitur baru yang akan merevolusi cara Anda mengelola keuangan kelompok.";
    $featureTitle = "Apa yang Akan Datang?";
    $features = [
        'Integrasi dengan bank lokal Indonesia',
        'Notifikasi real-time untuk setiap transaksi',
        'Dashboard analytics yang lebih powerful',
        'Mobile app untuk iOS & Android'
    ];

    if ($feature === 'transactions') {
        $title = "Fitur Transaksi Segera Hadir";
        $description = "Kami sedang mengembangkan fitur transaksi yang akan memudahkan Anda melacak semua pemasukan dan pengeluaran kelompok dengan lebih efisien.";
        $featureTitle = "Fitur Transaksi Akan Memiliki:";
        $features = [
            'Pencatatan transaksi otomatis dan manual',
            'Kategorisasi transaksi yang mudah',
            'Laporan transaksi harian, mingguan, dan bulanan',
            'Filter dan pencarian transaksi yang canggih'
        ];
    } else if ($feature === 'savings') {
        $title = "Fitur Tabungan Segera Hadir";
        $description = "Kami sedang mempersiapkan fitur tabungan yang akan membantu kelompok Anda mencapai tujuan keuangan bersama.";
        $featureTitle = "Fitur Tabungan Akan Memiliki:";
        $features = [
            'Target tabungan kelompok yang dapat disesuaikan',
            'Kontribusi otomatis dari anggota',
            'Visualisasi progres tabungan yang menarik',
            'Notifikasi pencapaian milestone'
        ];
    } else if ($feature === 'saving-goals') {
        $title = "Fitur Penganggaran Segera Hadir";
        $description = "Kami sedang mengembangkan fitur penganggaran yang akan membantu kelompok Anda merencanakan dan mengelola anggaran dengan lebih baik.";
        $featureTitle = "Fitur Penganggaran Akan Memiliki:";
        $features = [
            'Pembuatan anggaran kategori yang fleksibel',
            'Perbandingan anggaran vs realisasi',
            'Sistem persetujuan untuk pengeluaran besar',
            'Rekomendasi penghematan berdasarkan pola pengeluaran'
        ];
    } else if ($feature === 'statements') {
        $title = "Fitur Laporan Keuangan Segera Hadir";
        $description = "Kami sedang mempersiapkan fitur laporan keuangan yang akan memberikan insight mendalam tentang kondisi finansial kelompok Anda.";
        $featureTitle = "Fitur Laporan Keuangan Akan Memiliki:";
        $features = [
            'Laporan keuangan bulanan dan tahunan',
            'Visualisasi data dengan grafik interaktif',
            'Ekspor laporan ke format PDF dan Excel',
            'Analisis tren pengeluaran dan pemasukan'
        ];
    } else if ($feature === 'settings') {
        $title = "Fitur Pengaturan Segera Hadir";
        $description = "Kami sedang mengembangkan fitur pengaturan yang akan memungkinkan Anda menyesuaikan aplikasi sesuai kebutuhan kelompok Anda.";
        $featureTitle = "Fitur Pengaturan Akan Memiliki:";
        $features = [
            'Manajemen profil kelompok dan anggota',
            'Pengaturan preferensi notifikasi',
            'Kustomisasi tema dan tampilan',
            'Pengaturan privasi dan keamanan data'
        ];
    }

    return inertia('ComingSoonPage', [
        'title' => $title,
        'description' => $description,
        'featureTitle' => $featureTitle,
        'features' => $features
    ]);
});
// })->middleware('auth');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\DashboardController;

// Dashboard menampilkan laporan aktual
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Semua route di bawah ini hanya untuk user login
Route::middleware('auth')->group(function () {
    // Broadcasting auth route (untuk private channel WebSocket)
    \Illuminate\Support\Facades\Broadcast::routes();
    // ==================== PROFILE ROUTES ====================
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ==================== RELATION ROUTES ====================
    // Halaman utama relation - menampilkan owned & joined relations
    Route::get('/relations', [RelationController::class, 'index'])->name('relations.index');

    // Membuat relation baru
    Route::post('/relations', [RelationController::class, 'store'])->name('relations.store');

    // Search relation
    Route::get('/relations-search', [RelationController::class, 'search'])->name('relations.search');

    // Join relation berdasarkan kode
    Route::post('/relations/join', [RelationController::class, 'join'])->name('relations.join');

    // Search relation by code (untuk AJAX search)
    Route::post('/relations/search-by-code', [RelationController::class, 'searchByCode'])->name('relations.search-by-code');

    // Batalkan join request
    Route::delete('/relations/join-requests/{joinRequest}', [RelationController::class, 'cancelJoinRequest'])
        ->name('relations.join-requests.cancel');

    // ==================== RELATION SPECIFIC ROUTES ====================
    // Menampilkan detail relation (dengan statistik)
    Route::get('/relations/{relation}', [RelationController::class, 'show'])->name('relations.show');

    // Menampilkan halaman edit relation
    Route::get('/relations/{relation}/edit', [RelationController::class, 'edit'])->name('relations.edit');

    // Update relation
    Route::patch('/relations/{relation}', [RelationController::class, 'update'])->name('relations.update');
    Route::put('/relations/{relation}', [RelationController::class, 'update'])->name('relations.update.alt');

    // Hapus relation
    Route::delete('/relations/{relation}', [RelationController::class, 'destroy'])->name('relations.destroy');

    // Keluar dari relation
    Route::post('/relations/{relation}/leave', [RelationController::class, 'leave'])
        ->name('relations.leave');

    // ==================== RELATION MEMBERS ROUTES ====================
    // Menampilkan daftar member relation
    Route::get('/relations/{relation}/members', [RelationController::class, 'members'])
        ->name('relations.members');

    // Get members data via JSON (untuk modal)
    Route::get('/relations/{relation}/members-data', [RelationController::class, 'getMembersData'])
        ->name('relations.members-data');

    // Kick member dari relation (owner only)
    Route::delete('/relations/{relation}/members/{user}', [RelationController::class, 'kickMember'])
        ->name('relations.kick-member');

    // ==================== RELATION JOIN REQUESTS ROUTES ====================
    // Get pending requests via JSON (untuk modal)
    Route::get('/relations/{relation}/pending-requests', [RelationController::class, 'getPendingRequests'])
        ->name('relations.pending-requests-json');

    // Approve join request (owner only) - menggunakan POST untuk Inertia
    Route::post('/relations/{relation}/requests/{request}/approve', [RelationController::class, 'approveRequest'])
        ->name('relations.approve-request');

    // Reject join request (owner only) - menggunakan POST untuk Inertia
    Route::post('/relations/{relation}/requests/{request}/reject', [RelationController::class, 'rejectRequest'])
        ->name('relations.reject-request');

    // Approve join request (alternatif route)
    Route::post('/relations/join-requests/{joinRequest}/approve', [RelationController::class, 'approveJoinRequest'])
        ->name('relations.join-requests.approve');

    // Reject join request (alternatif route)
    Route::post('/relations/join-requests/{joinRequest}/reject', [RelationController::class, 'rejectJoinRequest'])
        ->name('relations.join-requests.reject');

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


// ==================== CHAT ROUTES ====================
// Chat main page
Route::get('/chat/{relationId?}', [ChatController::class, 'index'])
    ->name('chat.index');

// Get messages untuk relation tertentu
Route::get('/chat/{relationId}/messages', [ChatController::class, 'getMessages'])
    ->name('chat.messages');

// Send message
Route::post('/chat/send', [ChatController::class, 'sendMessage'])
    ->name('chat.send');

// Mark as read
Route::post('/chat/mark-read', [ChatController::class, 'markAsRead'])
    ->name('chat.mark-read');

Route::post('/chat/{relationId}/mark-all-read', [ChatController::class, 'markAllAsRead'])
    ->name('chat.mark-all-read');

// Get unread count
Route::get('/chat/{relationId}/unread-count', [ChatController::class, 'getUnreadCount'])
    ->name('chat.unread-count');

// Delete message
Route::delete('/chat/message/{message}', [ChatController::class, 'deleteMessage'])
    ->name('chat.message.delete');

Route::delete('/chat/message/{message}/force', [ChatController::class, 'forceDeleteMessage'])
    ->name('chat.message.force-delete');

// File handling
Route::get('/chat/file/{message}/download', [ChatController::class, 'downloadFile'])
    ->name('chat.file.download');

Route::get('/chat/file/{message}/display', [ChatController::class, 'displayFile'])
    ->name('chat.file.display');

Route::get('/chat/file/{message}/thumbnail', [ChatController::class, 'thumbnail'])
    ->name('chat.file.thumbnail');

// Reactions
Route::post('/chat/message/{message}/reaction', [ChatController::class, 'toggleReaction'])
    ->name('chat.reaction.toggle');

Route::get('/chat/message/{message}/reactions', [ChatController::class, 'getReactions'])
    ->name('chat.reactions.get');

// Get relations with unread
Route::get('/chat/relations', [ChatController::class, 'getRelationsWithUnread'])
    ->name('chat.relations');

// Search messages
Route::get('/chat/{relationId}/search', [ChatController::class, 'searchMessages'])
    ->name('chat.search');

    // ==================== CATEGORIES ROUTES ====================
    Route::prefix('relations/{relation}')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

    // ==================== TOP-LEVEL REDIRECTS FOR GROUP CONTEXT ====================
    Route::get('/savings', function () {
        $relation = Auth::user()->relations()->first();
        if (!$relation) {
            return redirect()->route('relations.index')->with('info', 'Silakan buat atau gabung ke grup relasi terlebih dahulu untuk menggunakan fitur Tabungan.');
        }
        return redirect()->route('savings.index', $relation->id);
    })->name('savings.landing');

    Route::get('/budgeting', function () {
        $relation = Auth::user()->relations()->first();
        if (!$relation) {
            return redirect()->route('relations.index')->with('info', 'Silakan buat atau gabung ke grup relasi terlebih dahulu untuk menggunakan fitur Penganggaran.');
        }
        return redirect()->route('budgeting.index', $relation->id);
    })->name('budgeting.landing');

    Route::get('/saving-goals', fn () => redirect()->route('budgeting.landing'));

    Route::get('/statements', function () {
        $relation = Auth::user()->relations()->first();
        if (!$relation) {
            return redirect()->route('relations.index')->with('info', 'Silakan buat atau gabung ke grup relasi terlebih dahulu untuk menggunakan fitur Laporan Keuangan.');
        }
        return redirect()->route('statements.index', $relation->id);
    })->name('statements.landing');

    // ==================== SAVINGS ROUTES ====================
    Route::prefix('relations/{relation}')->group(function () {
        Route::get('/savings', [SavingsController::class, 'index'])->name('savings.index');
        Route::post('/savings', [SavingsController::class, 'store'])->name('savings.store');
        Route::get('/savings/{goal}', [SavingsController::class, 'show'])->name('savings.show');
        Route::put('/savings/{goal}', [SavingsController::class, 'update'])->name('savings.update');
        Route::delete('/savings/{goal}', [SavingsController::class, 'destroy'])->name('savings.destroy');

        // Kontribusi / setoran
        Route::post('/savings/{goal}/contribute', [SavingsController::class, 'contribute'])->name('savings.contribute');
        Route::delete('/savings/{goal}/contributions/{contribution}', [SavingsController::class, 'deleteContribution'])
             ->name('savings.contributions.destroy');
    });

    // ==================== BUDGETING ROUTES ====================
    Route::prefix('relations/{relation}')->group(function () {
        Route::get('/budgeting', [BudgetController::class, 'index'])->name('budgeting.index');
        Route::post('/budgeting', [BudgetController::class, 'store'])->name('budgeting.store');
        Route::put('/budgeting/{budget}', [BudgetController::class, 'update'])->name('budgeting.update');
        Route::delete('/budgeting/{budget}', [BudgetController::class, 'destroy'])->name('budgeting.destroy');

        // API data (JSON)
        Route::get('/budgeting/api-data', [BudgetController::class, 'apiData'])->name('budgeting.api-data');
    });

    // ==================== STATEMENTS (LAPORAN) ROUTES ====================
    Route::prefix('relations/{relation}')->group(function () {
        Route::get('/statements', [StatementController::class, 'index'])->name('statements.index');
        Route::get('/statements/api-data', [StatementController::class, 'apiData'])->name('statements.api-data');
        Route::get('/statements/export-csv', [StatementController::class, 'exportCsv'])->name('statements.export-csv');
    });

    // ==================== SETTINGS ROUTES ====================
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::match(['post', 'patch'], '/settings/profile', [SettingsController::class, 'updateProfile'])->name('settings.profile.update');
    Route::patch('/settings/password', [SettingsController::class, 'updatePassword'])->name('settings.password.update');
    Route::get('/users/{user}/avatar', [SettingsController::class, 'avatar'])->name('user.avatar');

    // Relation settings (owner only)
    Route::get('/settings/relations/{relation}', [SettingsController::class, 'showRelationSettings'])
         ->name('settings.relation.show');
    Route::patch('/settings/relations/{relation}', [SettingsController::class, 'updateRelation'])
         ->name('settings.relation.update');
    Route::patch('/settings/relations/{relation}/preferences', [SettingsController::class, 'updateRelationSettings'])
         ->name('settings.relation.preferences');
    Route::post('/settings/relations/{relation}/regenerate-code', [SettingsController::class, 'regenerateCode'])
         ->name('settings.relation.regenerate-code');
    Route::patch('/settings/relations/{relation}/notifications', [SettingsController::class, 'updateNotificationPrefs'])
         ->name('settings.relation.notifications');

    // ==================== NOTIFICATION ROUTES ====================
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::get('/notifications/{notification}/read-and-go', [NotificationController::class, 'readAndGo'])->name('notifications.read-and-go');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

require __DIR__.'/auth.php';
