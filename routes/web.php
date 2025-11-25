<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RelationController;
use App\Http\Controllers\TransactionController;
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
    // Route::delete('/relations/join-requests/{joinRequest}', [RelationController::class, 'cancelJoinRequest'])
    //     ->name('relations.join-requests.cancel');
    Route::delete('/relations/join-requests/{request}', [RelationController::class, 'cancelJoinRequest'])
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
    // Tambahkan route untuk TransactionController di sini jika sudah dibuat
});

require __DIR__.'/auth.php';
