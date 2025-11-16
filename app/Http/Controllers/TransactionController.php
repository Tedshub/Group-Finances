<?php
// app/Http/Controllers/TransactionController.php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{

/**
 * Landing page untuk transactions
 */
public function landing(): Response
{
    /** @var User $user */
    $user = Auth::user();

    $relations = $user->relations;

    return Inertia::render('Transactions/TransactionPage', [
        'relations' => [
            'data' => $relations,
        ],
        'currentRelation' => null,
        'pemasukan' => null,
        'pengeluaran' => null,
        'statistik' => null,
        'search' => null,
    ]);
}

    /**
     * Display transactions untuk relation tertentu
     * Menampilkan dua tabel terpisah: pemasukan dan pengeluaran
     */
public function index(Request $request, Relation $relation): Response
{
    /** @var User $user */
    $user = Auth::user();

    // Cek apakah user adalah member dari relation ini
    if (!$user->hasJoinedRelation($relation->id)) {
        abort(403, 'Anda tidak memiliki akses ke transaksi relation ini.');
    }

    // Get search query
    $search = $request->input('search');

    // Query dasar untuk pemasukan
    $pemasukanQuery = Transaction::inRelation($relation->id)
        ->pemasukan()
        ->with('user:id,name')
        ->latestTransaction();

    // Query dasar untuk pengeluaran
    $pengeluaranQuery = Transaction::inRelation($relation->id)
        ->pengeluaran()
        ->with('user:id,name')
        ->latestTransaction();

    // Apply search jika ada
    if ($search) {
        $pemasukanQuery->search($search);
        $pengeluaranQuery->search($search);
    }

    // Pagination dengan 5 data per page
    $pemasukan = $pemasukanQuery->paginate(5, ['*'], 'pemasukan_page')
        ->through(function ($transaction) use ($user) {
            return $this->formatTransaction($transaction, $user);
        });

    $pengeluaran = $pengeluaranQuery->paginate(5, ['*'], 'pengeluaran_page')
        ->through(function ($transaction) use ($user) {
            return $this->formatTransaction($transaction, $user);
        });

    // Get statistik
    $statistik = Transaction::getStatistik($relation->id);

    // Get all user's relations untuk dropdown
    $relations = $user->relations()->get();

    return Inertia::render('Transactions/TransactionPage', [
        'relations' => $relations,
        'currentRelation' => $relation,
        'pemasukan' => $pemasukan,
        'pengeluaran' => $pengeluaran,
        'statistik' => [
            'total_pemasukan' => 'Rp ' . number_format($statistik['total_pemasukan'], 0, ',', '.'),
            'total_pengeluaran' => 'Rp ' . number_format($statistik['total_pengeluaran'], 0, ',', '.'),
            'saldo' => 'Rp ' . number_format($statistik['saldo'], 0, ',', '.'),
            'jumlah_transaksi' => $statistik['jumlah_transaksi'],
            'jumlah_pemasukan' => $statistik['jumlah_pemasukan'],
            'jumlah_pengeluaran' => $statistik['jumlah_pengeluaran'],
            'saldo_raw' => $statistik['saldo'], // untuk conditional styling
        ],
        'search' => $search,
        'is_owner' => $user->isOwnerOf($relation->id),
    ]);
}

    /**
     * Store a newly created transaction
     */
    public function store(Request $request, Relation $relation): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        $validated = $request->validate([
            'jenis' => ['required', Rule::in([Transaction::JENIS_PEMASUKAN, Transaction::JENIS_PENGELUARAN])],
            'jumlah' => 'required|numeric|min:0.01',
            'catatan' => 'nullable|string|max:1000',
            'bukti' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // max 5MB
            'waktu_transaksi' => 'required|date',
        ]);

        // Upload bukti jika ada
        $buktiPath = null;
        if ($request->hasFile('bukti')) {
            $buktiPath = $request->file('bukti')->store('bukti-transaksi', 'public');
        }

        // Buat transaksi
        $transaction = Transaction::create([
            'relation_id' => $relation->id,
            'user_id' => $user->id,
            'user_name' => $user->name, // Simpan nama user untuk history
            'jenis' => $validated['jenis'],
            'jumlah' => $validated['jumlah'],
            'catatan' => $validated['catatan'] ?? null,
            'bukti' => $buktiPath,
            'waktu_transaksi' => $validated['waktu_transaksi'],
        ]);

        $jenisText = $transaction->isPemasukan() ? 'Pemasukan' : 'Pengeluaran';

        return redirect()->route('transactions.index', $relation)
            ->with('success', "{$jenisText} sebesar {$transaction->formatted_jumlah} berhasil ditambahkan!");
    }

    /**
     * Display the specified transaction
     */
    public function show(Relation $relation, Transaction $transaction): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            abort(404);
        }

        $transaction->load('user:id,name');

        return Inertia::render('Transactions/Show', [
            'relation' => [
                'id' => $relation->id,
                'nama' => $relation->nama,
            ],
            'transaction' => $this->formatTransaction($transaction, $user),
            'can_edit' => $transaction->isOwnedBy($user->id),
        ]);
    }

    /**
     * Update the specified transaction
     */
    public function update(Request $request, Relation $relation, Transaction $transaction): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            abort(404);
        }

        // Hanya pembuat transaksi yang bisa edit
        if (!$transaction->isOwnedBy($user->id)) {
            abort(403, 'Anda hanya bisa mengedit transaksi milik Anda sendiri.');
        }

        $validated = $request->validate([
            'jenis' => ['required', Rule::in([Transaction::JENIS_PEMASUKAN, Transaction::JENIS_PENGELUARAN])],
            'jumlah' => 'required|numeric|min:0.01',
            'catatan' => 'nullable|string|max:1000',
            'bukti' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'waktu_transaksi' => 'required|date',
            'remove_bukti' => 'nullable|boolean', // Flag untuk hapus bukti
        ]);

        // Handle bukti file
        $buktiPath = $transaction->bukti;

        // Hapus bukti lama jika ada flag remove_bukti
        if ($request->input('remove_bukti') && $buktiPath) {
            Storage::disk('public')->delete($buktiPath);
            $buktiPath = null;
        }

        // Upload bukti baru jika ada
        if ($request->hasFile('bukti')) {
            // Hapus bukti lama
            if ($buktiPath) {
                Storage::disk('public')->delete($buktiPath);
            }
            $buktiPath = $request->file('bukti')->store('bukti-transaksi', 'public');
        }

        // Update transaksi
        $transaction->update([
            'jenis' => $validated['jenis'],
            'jumlah' => $validated['jumlah'],
            'catatan' => $validated['catatan'] ?? null,
            'bukti' => $buktiPath,
            'waktu_transaksi' => $validated['waktu_transaksi'],
        ]);

        return redirect()->route('transactions.index', $relation)
            ->with('success', 'Transaksi berhasil diupdate!');
    }

    /**
     * Remove the specified transaction
     */
    public function destroy(Relation $relation, Transaction $transaction): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            abort(404);
        }

        // Hanya pembuat transaksi yang bisa delete
        if (!$transaction->isOwnedBy($user->id)) {
            abort(403, 'Anda hanya bisa menghapus transaksi milik Anda sendiri.');
        }

        $jenisText = $transaction->isPemasukan() ? 'Pemasukan' : 'Pengeluaran';
        $jumlah = $transaction->formatted_jumlah;

        // Soft delete (data tidak benar-benar dihapus)
        $transaction->delete();

        return redirect()->route('transactions.index', $relation)
            ->with('success', "{$jenisText} sebesar {$jumlah} berhasil dihapus!");
    }

    /**
     * Force delete transaction (untuk admin atau cleanup)
     */
    public function forceDestroy(Relation $relation, Transaction $transaction): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Hanya admin atau owner relation yang bisa force delete
        if (!$user->isAdmin() && !$user->isOwnerOf($relation->id)) {
            abort(403, 'Anda tidak memiliki akses untuk menghapus permanen transaksi ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            abort(404);
        }

        $jenisText = $transaction->isPemasukan() ? 'Pemasukan' : 'Pengeluaran';
        $jumlah = $transaction->formatted_jumlah;

        // Hard delete (data benar-benar dihapus, termasuk file bukti)
        $transaction->forceDelete();

        return redirect()->route('transactions.index', $relation)
            ->with('success', "{$jenisText} sebesar {$jumlah} berhasil dihapus permanen!");
    }

    /**
     * Restore soft deleted transaction
     */
    public function restore(Relation $relation, $transactionId): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        $transaction = Transaction::onlyTrashed()
            ->where('id', $transactionId)
            ->where('relation_id', $relation->id)
            ->firstOrFail();

        // Hanya pembuat transaksi yang bisa restore
        if (!$transaction->isOwnedBy($user->id)) {
            abort(403, 'Anda hanya bisa restore transaksi milik Anda sendiri.');
        }

        $transaction->restore();

        return redirect()->route('transactions.index', $relation)
            ->with('success', 'Transaksi berhasil dipulihkan!');
    }

    /**
     * Get transactions as JSON (untuk AJAX requests)
     */
    public function getTransactionsJson(Request $request, Relation $relation): \Illuminate\Http\JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            return response()->json(['error' => 'Anda tidak memiliki akses ke relation ini.'], 403);
        }

        $jenis = $request->input('jenis'); // 'pemasukan' atau 'pengeluaran'
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $query = Transaction::inRelation($relation->id)
            ->with('user:id,name')
            ->latestTransaction();

        // Filter by jenis
        if ($jenis && in_array($jenis, [Transaction::JENIS_PEMASUKAN, Transaction::JENIS_PENGELUARAN])) {
            $query->where('jenis', $jenis);
        }

        // Search
        if ($search) {
            $query->search($search);
        }

        $transactions = $query->paginate($perPage)
            ->through(function ($transaction) use ($user) {
                return $this->formatTransaction($transaction, $user);
            });

        return response()->json([
            'success' => true,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Download bukti transaksi
     */
    public function downloadBukti(Relation $relation, Transaction $transaction)
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            abort(404);
        }

        if (!$transaction->bukti || !Storage::disk('public')->exists($transaction->bukti)) {
            abort(404, 'Bukti transaksi tidak ditemukan.');
        }

        // Get full path
        $filePath = Storage::disk('public')->path($transaction->bukti);

        // Get original filename atau generate filename
        $filename = basename($transaction->bukti);
        $jenisText = $transaction->isPemasukan() ? 'Pemasukan' : 'Pengeluaran';
        $downloadName = "Bukti_{$jenisText}_{$transaction->id}_{$filename}";

        return response()->download($filePath, $downloadName);
    }

    /**
     * Helper method untuk format transaction data
     */
    private function formatTransaction(Transaction $transaction, User $user): array
    {
        $waktuTransaksi = is_string($transaction->waktu_transaksi)
            ? Date::parse($transaction->waktu_transaksi)
            : $transaction->waktu_transaksi;

        return [
            'id' => $transaction->id,
            'jenis' => $transaction->jenis,
            'jumlah' => $transaction->jumlah,
            'formatted_jumlah' => $transaction->formatted_jumlah,
            'catatan' => $transaction->catatan,
            'bukti' => $transaction->bukti,
            'bukti_url' => $transaction->bukti_url,
            'waktu_transaksi' => $waktuTransaksi->format('d M Y H:i'),
            'waktu_transaksi_human' => $waktuTransaksi->diffForHumans(),
            'user_name' => $transaction->creator_name,
            'user' => $transaction->user ? [
                'id' => $transaction->user->id,
                'name' => $transaction->user->name,
            ] : null,
            'can_edit' => $transaction->isOwnedBy($user->id),
            'can_delete' => $transaction->isOwnedBy($user->id),
            'created_at' => $transaction->created_at->format('d M Y H:i'),
        ];
    }
}
