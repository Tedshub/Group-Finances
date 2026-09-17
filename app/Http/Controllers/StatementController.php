<?php
// app/Http/Controllers/StatementController.php
namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class StatementController extends Controller
{
    /**
     * Halaman laporan keuangan.
     */
    public function index(Request $request, Relation $relation)
    {
        $this->authorizeMember($relation);

        [$startDate, $endDate, $period] = $this->resolvePeriod($request);

        $data = $this->buildStatementData($relation->id, $startDate, $endDate);

        return Inertia::render('StatementsPage', [
            'relation'   => $relation->only(['id', 'nama', 'kode']),
            'relations'  => Auth::user()->relations()->select('relations.id', 'relations.nama', 'relations.kode')->get(),
            'period'     => $period,
            'summary'   => $data['summary'],
            'byCategory'=> $data['by_category'],
            'byMonth'   => $data['by_month'],
            'byMember'  => $data['by_member'],
            'isOwner'   => $relation->isOwnedBy(Auth::id()),
        ]);
    }

    /**
     * API: ambil data laporan sebagai JSON (untuk grafik live update filter).
     */
    public function apiData(Request $request, Relation $relation)
    {
        $this->authorizeMember($relation);

        [$startDate, $endDate, $period] = $this->resolvePeriod($request);
        $data = $this->buildStatementData($relation->id, $startDate, $endDate);

        return response()->json(array_merge($data, ['period' => $period]));
    }

    /**
     * Export laporan sebagai CSV.
     */
    public function exportCsv(Request $request, Relation $relation)
    {
        $this->authorizeMember($relation);

        [$startDate, $endDate] = $this->resolvePeriod($request);

        $transactions = Transaction::where('relation_id', $relation->id)
            ->whereBetween('waktu_transaksi', [$startDate, $endDate])
            ->with('category:id,name')
            ->orderBy('waktu_transaksi', 'desc')
            ->get();

        $filename = 'laporan-keuangan-' . $relation->nama . '-' . now()->format('Ymd') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');
            // BOM untuk Excel UTF-8
            fputs($file, "\xEF\xBB\xBF");
            fputcsv($file, ['Tanggal', 'Jenis', 'Kategori', 'Jumlah (Rp)', 'Dibuat Oleh', 'Catatan']);

            foreach ($transactions as $t) {
                fputcsv($file, [
                    $t->waktu_transaksi->format('d/m/Y H:i'),
                    ucfirst($t->jenis),
                    $t->category->name ?? '-',
                    number_format($t->jumlah, 0, ',', '.'),
                    $t->user_name,
                    $t->catatan ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // ========== Private Helpers ==========

    private function resolvePeriod(Request $request): array
    {
        $preset = $request->get('preset', 'this_month');
        $now    = now();

        switch ($preset) {
            case 'today':
                $start = $now->copy()->startOfDay();
                $end   = $now->copy()->endOfDay();
                break;
            case 'this_week':
                $start = $now->copy()->startOfWeek();
                $end   = $now->copy()->endOfWeek();
                break;
            case 'last_3_months':
                $start = $now->copy()->subMonths(3)->startOfMonth();
                $end   = $now->copy()->endOfMonth();
                break;
            case 'this_year':
                $start = $now->copy()->startOfYear();
                $end   = $now->copy()->endOfYear();
                break;
            case 'custom':
                $start = Carbon::parse($request->get('start_date', $now->copy()->startOfMonth()));
                $end   = Carbon::parse($request->get('end_date', $now->copy()->endOfMonth()));
                break;
            default: // this_month
                $start = $now->copy()->startOfMonth();
                $end   = $now->copy()->endOfMonth();
                $preset = 'this_month';
                break;
        }

        $period = [
            'preset'     => $preset,
            'start_date' => $start->toDateString(),
            'end_date'   => $end->toDateString(),
        ];

        return [$start, $end, $period];
    }

    private function buildStatementData(int $relationId, $startDate, $endDate): array
    {
        $baseQuery = fn () => Transaction::where('relation_id', $relationId)
            ->whereBetween('waktu_transaksi', [$startDate, $endDate]);

        // Summary
        $totalPemasukan   = (float) $baseQuery()->where('jenis', 'pemasukan')->sum('jumlah');
        $totalPengeluaran = (float) $baseQuery()->where('jenis', 'pengeluaran')->sum('jumlah');
        $surplus          = $totalPemasukan - $totalPengeluaran;

        // Saldo kumulatif (dari awal waktu sampai end date)
        $saldoKumulatif = (float) Transaction::where('relation_id', $relationId)
            ->where('waktu_transaksi', '<=', $endDate)
            ->selectRaw("SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE -jumlah END) as saldo")
            ->value('saldo');

        // Pengeluaran per kategori (untuk donut chart)
        $byCategory = $baseQuery()
            ->where('jenis', 'pengeluaran')
            ->whereNotNull('category_id')
            ->select('category_id', DB::raw('SUM(jumlah) as total'))
            ->groupBy('category_id')
            ->with('category:id,name,icon,color')
            ->get()
            ->map(fn ($t) => [
                'category_id'   => $t->category_id,
                'category_name' => $t->category->name ?? 'Tanpa Kategori',
                'category_icon' => $t->category->icon ?? 'tag',
                'category_color'=> $t->category->color ?? '#6B7280',
                'total'         => (float) $t->total,
                'percent'       => $totalPengeluaran > 0 ? round(($t->total / $totalPengeluaran) * 100, 1) : 0,
            ])
            ->sortByDesc('total')
            ->values();

        // Tren per bulan (untuk bar/line chart)
        $byMonth = Transaction::where('relation_id', $relationId)
            ->whereBetween('waktu_transaksi', [$startDate, $endDate])
            ->select(
                DB::raw('YEAR(waktu_transaksi) as year'),
                DB::raw('MONTH(waktu_transaksi) as month'),
                'jenis',
                DB::raw('SUM(jumlah) as total')
            )
            ->groupBy('year', 'month', 'jenis')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->groupBy(fn ($t) => "{$t->year}-{$t->month}")
            ->map(fn ($group, $key) => [
                'period'      => $key,
                'label'       => Carbon::createFromDate($group->first()->year, $group->first()->month, 1)
                                       ->translatedFormat('M Y'),
                'pemasukan'   => (float) ($group->firstWhere('jenis', 'pemasukan')->total ?? 0),
                'pengeluaran' => (float) ($group->firstWhere('jenis', 'pengeluaran')->total ?? 0),
            ])
            ->values();

        // Kontribusi per anggota
        $byMember = $baseQuery()
            ->select('user_id', 'user_name', 'jenis', DB::raw('SUM(jumlah) as total'))
            ->groupBy('user_id', 'user_name', 'jenis')
            ->get()
            ->groupBy('user_id')
            ->map(fn ($group) => [
                'user_id'     => $group->first()->user_id,
                'user_name'   => $group->first()->user_name,
                'pemasukan'   => (float) ($group->firstWhere('jenis', 'pemasukan')->total ?? 0),
                'pengeluaran' => (float) ($group->firstWhere('jenis', 'pengeluaran')->total ?? 0),
            ])
            ->sortByDesc('pengeluaran')
            ->values();

        return [
            'summary' => [
                'total_pemasukan'   => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'surplus'           => $surplus,
                'saldo_kumulatif'   => $saldoKumulatif,
            ],
            'by_category' => $byCategory,
            'by_month'    => $byMonth,
            'by_member'   => $byMember,
        ];
    }

    private function authorizeMember(Relation $relation): void
    {
        abort_unless($relation->hasUser(Auth::id()), 403, 'Anda bukan anggota relasi ini.');
    }
}
