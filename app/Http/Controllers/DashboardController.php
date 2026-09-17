<?php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard utama dengan data aktual dari database
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Ambil semua relation ID yang diikuti oleh user
        $userRelations = $user->relations()->withCount('users')->get();
        $userRelationIds = $userRelations->pluck('id')->toArray();

        // 1. Ringkasan Keuangan (Summary Cards)
        $totalPemasukan = 0;
        $totalPengeluaran = 0;
        $jumlahTransaksi = 0;
        $jumlahPemasukan = 0;
        $jumlahPengeluaran = 0;

        if (!empty($userRelationIds)) {
            $totalPemasukan = (float) Transaction::whereIn('relation_id', $userRelationIds)
                ->where('jenis', Transaction::JENIS_PEMASUKAN)
                ->sum('jumlah');

            $totalPengeluaran = (float) Transaction::whereIn('relation_id', $userRelationIds)
                ->where('jenis', Transaction::JENIS_PENGELUARAN)
                ->sum('jumlah');

            $jumlahTransaksi = Transaction::whereIn('relation_id', $userRelationIds)->count();
            $jumlahPemasukan = Transaction::whereIn('relation_id', $userRelationIds)
                ->where('jenis', Transaction::JENIS_PEMASUKAN)
                ->count();
            $jumlahPengeluaran = Transaction::whereIn('relation_id', $userRelationIds)
                ->where('jenis', Transaction::JENIS_PENGELUARAN)
                ->count();
        }

        $saldo = $totalPemasukan - $totalPengeluaran;

        $summary = [
            'saldo' => [
                'raw' => $saldo,
                'formatted' => 'Rp ' . number_format($saldo, 0, ',', '.'),
                'label' => 'Saldo Saat Ini',
                'transaksi_count' => $jumlahTransaksi,
            ],
            'pemasukan' => [
                'raw' => $totalPemasukan,
                'formatted' => 'Rp ' . number_format($totalPemasukan, 0, ',', '.'),
                'label' => 'Total Pemasukan',
                'transaksi_count' => $jumlahPemasukan,
            ],
            'pengeluaran' => [
                'raw' => $totalPengeluaran,
                'formatted' => 'Rp ' . number_format($totalPengeluaran, 0, ',', '.'),
                'label' => 'Total Pengeluaran',
                'transaksi_count' => $jumlahPengeluaran,
            ],
            'total_relations' => $userRelations->count(),
        ];

        // 2. Tren Arus Kas 6 Bulan Terakhir (Area Chart)
        $areaData = [];
        $monthsMap = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'Mei', 6 => 'Jun',
            7 => 'Jul', 8 => 'Agu', 9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des'
        ];

        $now = Carbon::now();
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = (clone $now)->subMonths($i);
            $year = $monthDate->year;
            $month = $monthDate->month;
            $monthName = $monthsMap[$month];

            $monthlyPemasukan = 0;
            $monthlyPengeluaran = 0;

            if (!empty($userRelationIds)) {
                $monthlyPemasukan = (float) Transaction::whereIn('relation_id', $userRelationIds)
                    ->where('jenis', Transaction::JENIS_PEMASUKAN)
                    ->whereYear('waktu_transaksi', $year)
                    ->whereMonth('waktu_transaksi', $month)
                    ->sum('jumlah');

                $monthlyPengeluaran = (float) Transaction::whereIn('relation_id', $userRelationIds)
                    ->where('jenis', Transaction::JENIS_PENGELUARAN)
                    ->whereYear('waktu_transaksi', $year)
                    ->whereMonth('waktu_transaksi', $month)
                    ->sum('jumlah');
            }

            $areaData[] = [
                'month' => $monthName,
                'year' => $year,
                'pemasukan' => $monthlyPemasukan,
                'pengeluaran' => $monthlyPengeluaran,
                'value' => $monthlyPemasukan + $monthlyPengeluaran, // Total perputaran arus kas
            ];
        }

        // Tanggal transaksi terlama atau tanggal user bergabung
        $firstTransaction = !empty($userRelationIds)
            ? Transaction::whereIn('relation_id', $userRelationIds)->oldest('waktu_transaksi')->first()
            : null;

        $startDateFormatted = $firstTransaction && $firstTransaction->waktu_transaksi
            ? Carbon::parse($firstTransaction->waktu_transaksi)->format('d.m.Y')
            : Carbon::parse($user->created_at)->format('d.m.Y');

        // Rata-rata transaksi
        $avgTransaction = $jumlahTransaksi > 0
            ? ($totalPemasukan + $totalPengeluaran) / $jumlahTransaksi
            : 0;

        $chartStats = [
            'start_date' => $startDateFormatted,
            'total_transaksi' => $jumlahTransaksi,
            'avg_transaksi' => 'Rp ' . number_format($avgTransaction, 0, ',', '.'),
        ];

        // 3. Distribusi Aktivitas Keuangan Per Relasi Grup
        $colors = ['#c5ffbc', '#7c98ff', '#FDBB4E', '#FF6B7A', '#E2E8F0', '#F3E5F5'];
        $relationBreakdown = [];
        $totalVolume = $totalPemasukan + $totalPengeluaran;

        foreach ($userRelations as $idx => $rel) {
            $relPemasukan = (float) Transaction::where('relation_id', $rel->id)
                ->where('jenis', Transaction::JENIS_PEMASUKAN)
                ->sum('jumlah');

            $relPengeluaran = (float) Transaction::where('relation_id', $rel->id)
                ->where('jenis', Transaction::JENIS_PENGELUARAN)
                ->sum('jumlah');

            $relVolume = $relPemasukan + $relPengeluaran;
            $relPercent = $totalVolume > 0 ? round(($relVolume / $totalVolume) * 100, 1) : 0;

            $relationBreakdown[] = [
                'id' => $rel->id,
                'name' => $rel->nama,
                'kode' => $rel->kode,
                'members_count' => $rel->users_count,
                'value' => $relVolume,
                'formatted_value' => 'Rp ' . number_format($relVolume, 0, ',', '.'),
                'percent' => $relPercent,
                'color' => $colors[$idx % count($colors)],
            ];
        }

        // 4. Riwayat Transaksi Terbaru (Recent Transactions)
        $recentTransactions = [];
        if (!empty($userRelationIds)) {
            $recent = Transaction::whereIn('relation_id', $userRelationIds)
                ->with(['relation:id,nama,kode', 'user:id,name'])
                ->latest('waktu_transaksi')
                ->take(5)
                ->get();

            $categoryIcons = ['#c5ffbc', '#FF6B7A', '#7c98ff', '#FDBB4E', '#E2E8F0'];

            foreach ($recent as $idx => $trx) {
                $isIncome = $trx->jenis === Transaction::JENIS_PEMASUKAN;
                $formattedAmount = ($isIncome ? '+Rp ' : '-Rp ') . number_format((float) $trx->jumlah, 0, ',', '.');

                // Judul / teks transaksi
                $text = !empty(trim($trx->catatan ?? ''))
                    ? $trx->catatan
                    : ($isIncome ? 'Pemasukan' : 'Pengeluaran') . ' (' . ($trx->relation->nama ?? 'Grup') . ')';

                $dateFormatted = Carbon::parse($trx->waktu_transaksi)->locale('id')->isoFormat('D MMMM Y');

                $recentTransactions[] = [
                    'id' => $trx->id,
                    'text' => $text,
                    'relation_name' => $trx->relation->nama ?? 'Grup',
                    'relation_kode' => $trx->relation->kode ?? '',
                    'user_name' => $trx->user->name ?? $trx->user_name ?? 'User',
                    'amount' => $formattedAmount,
                    'date' => $dateFormatted,
                    'type' => $isIncome ? 'income' : 'expense',
                    'color' => $categoryIcons[$idx % count($categoryIcons)],
                ];
            }
        }

        return Inertia::render('DashboardPage', [
            'summary' => $summary,
            'areaData' => $areaData,
            'chartStats' => $chartStats,
            'relationBreakdown' => $relationBreakdown,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
