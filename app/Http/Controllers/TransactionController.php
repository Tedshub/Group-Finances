<?php
// app/Http/Controllers/TransactionController.php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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
     */
    public function index(Request $request, Relation $relation): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Log untuk debugging
        Log::info('Transaction index accessed', [
            'user_id' => $user->id,
            'relation_id' => $relation->id
        ]);

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
                'saldo_raw' => $statistik['saldo'],
            ],
            'search' => $search,
            'is_owner' => $user->isOwnerOf($relation->id),
            'current_user_id' => $user->id, // TAMBAHAN: Kirim user ID ke frontend
        ]);
    }

    /**
     * Store a newly created transaction
     */
    public function store(Request $request, Relation $relation): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Log untuk debugging
        Log::info('Store transaction attempt', [
            'user_id' => $user->id,
            'relation_id' => $relation->id
        ]);

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

        // Upload bukti ke private storage jika ada
        $buktiPath = null;
        if ($request->hasFile('bukti')) {
            try {
                $file = $request->file('bukti');
                $fileName = time() . '_' . $user->id . '_' . $file->getClientOriginalName();
                // Simpan ke storage/app/private/bukti-transaksi
                $buktiPath = $file->storeAs('bukti-transaksi', $fileName, 'private');

                Log::info('Bukti file uploaded', [
                    'path' => $buktiPath,
                    'user_id' => $user->id
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to upload bukti', [
                    'error' => $e->getMessage(),
                    'user_id' => $user->id
                ]);
                return back()->with('error', 'Gagal mengupload bukti transaksi.');
            }
        }

        // Buat transaksi
        $transaction = Transaction::create([
            'relation_id' => $relation->id,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'jenis' => $validated['jenis'],
            'jumlah' => $validated['jumlah'],
            'catatan' => $validated['catatan'] ?? null,
            'bukti' => $buktiPath,
            'waktu_transaksi' => $validated['waktu_transaksi'],
        ]);

        Log::info('Transaction created', [
            'transaction_id' => $transaction->id,
            'user_id' => $user->id
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
            'can_edit' => $transaction->user_id === $user->id, // PERUBAHAN: Lebih eksplisit
        ]);
    }

    /**
     * Update the specified transaction
     */
    public function update(Request $request, Relation $relation, Transaction $transaction): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Log untuk debugging
        Log::info('Update transaction attempt', [
            'user_id' => $user->id,
            'transaction_id' => $transaction->id,
            'transaction_user_id' => $transaction->user_id
        ]);

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            Log::warning('User not member of relation', [
                'user_id' => $user->id,
                'relation_id' => $relation->id
            ]);
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            Log::warning('Transaction not in relation', [
                'transaction_relation_id' => $transaction->relation_id,
                'url_relation_id' => $relation->id
            ]);
            abort(404);
        }

        // PERUBAHAN: Cek ownership secara eksplisit
        if ($transaction->user_id !== $user->id) {
            Log::warning('User not owner of transaction', [
                'user_id' => $user->id,
                'transaction_user_id' => $transaction->user_id
            ]);
            abort(403, 'Anda hanya bisa mengedit transaksi milik Anda sendiri.');
        }

        $validated = $request->validate([
            'jenis' => ['required', Rule::in([Transaction::JENIS_PEMASUKAN, Transaction::JENIS_PENGELUARAN])],
            'jumlah' => 'required|numeric|min:0.01',
            'catatan' => 'nullable|string|max:1000',
            'bukti' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'waktu_transaksi' => 'required|date',
            'remove_bukti' => 'nullable|boolean',
        ]);

        // Handle bukti file
        $buktiPath = $transaction->bukti;

        try {
            // Hapus bukti lama jika ada flag remove_bukti
            if ($request->input('remove_bukti') && $buktiPath) {
                Storage::disk('private')->delete($buktiPath);
                $buktiPath = null;
                Log::info('Old bukti removed', ['path' => $transaction->bukti]);
            }

            // Upload bukti baru jika ada
            if ($request->hasFile('bukti')) {
                // Hapus bukti lama
                if ($buktiPath) {
                    Storage::disk('private')->delete($buktiPath);
                    Log::info('Old bukti deleted before upload', ['path' => $buktiPath]);
                }

                $file = $request->file('bukti');
                $fileName = time() . '_' . $user->id . '_' . $file->getClientOriginalName();
                $buktiPath = $file->storeAs('bukti-transaksi', $fileName, 'private');

                Log::info('New bukti uploaded', ['path' => $buktiPath]);
            }
        } catch (\Exception $e) {
            Log::error('Bukti file handling error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            return back()->with('error', 'Gagal mengelola file bukti.');
        }

        // Update transaksi
        $transaction->update([
            'jenis' => $validated['jenis'],
            'jumlah' => $validated['jumlah'],
            'catatan' => $validated['catatan'] ?? null,
            'bukti' => $buktiPath,
            'waktu_transaksi' => $validated['waktu_transaksi'],
        ]);

        Log::info('Transaction updated', [
            'transaction_id' => $transaction->id,
            'user_id' => $user->id
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

        // Log untuk debugging
        Log::info('Delete transaction attempt', [
            'user_id' => $user->id,
            'transaction_id' => $transaction->id,
            'transaction_user_id' => $transaction->user_id
        ]);

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            Log::warning('User not member of relation on delete', [
                'user_id' => $user->id,
                'relation_id' => $relation->id
            ]);
            abort(403, 'Anda tidak memiliki akses ke relation ini.');
        }

        // Cek apakah transaction memang milik relation ini
        if ($transaction->relation_id !== $relation->id) {
            Log::warning('Transaction not in relation on delete', [
                'transaction_relation_id' => $transaction->relation_id,
                'url_relation_id' => $relation->id
            ]);
            abort(404);
        }

        // PERUBAHAN: Cek ownership secara eksplisit
        if ($transaction->user_id !== $user->id) {
            Log::warning('User not owner of transaction on delete', [
                'user_id' => $user->id,
                'transaction_user_id' => $transaction->user_id
            ]);
            abort(403, 'Anda hanya bisa menghapus transaksi milik Anda sendiri.');
        }

        $jenisText = $transaction->isPemasukan() ? 'Pemasukan' : 'Pengeluaran';
        $jumlah = $transaction->formatted_jumlah;

        // Hard delete (akan trigger event deleting yang hapus file)
        $transaction->delete();

        Log::info('Transaction deleted', [
            'transaction_id' => $transaction->id,
            'user_id' => $user->id
        ]);

        return redirect()->route('transactions.index', $relation)
            ->with('success', "{$jenisText} sebesar {$jumlah} berhasil dihapus!");
    }

    /**
     * Get transactions as JSON (untuk AJAX requests)
     */
    public function getTransactionsJson(Request $request, Relation $relation): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah member dari relation ini
        if (!$user->hasJoinedRelation($relation->id)) {
            return response()->json(['error' => 'Anda tidak memiliki akses ke relation ini.'], 403);
        }

        $jenis = $request->input('jenis');
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
     * Preview bukti transaksi (display inline)
     */
    public function previewBukti(Relation $relation, Transaction $transaction): BinaryFileResponse
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

        // Cek apakah bukti exists
        if (!$transaction->hasBukti()) {
            abort(404, 'Bukti transaksi tidak ditemukan.');
        }

        // Get file path dari private storage
        $filePath = $transaction->getBuktiPath();

        // Get mime type
        $mimeType = $transaction->getBuktiMimeType();

        // Return file dengan inline disposition (preview di browser)
        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline',
        ]);
    }

    /**
     * Download bukti transaksi
     */
    public function downloadBukti(Relation $relation, Transaction $transaction): BinaryFileResponse
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

        // Cek apakah bukti exists
        if (!$transaction->hasBukti()) {
            abort(404, 'Bukti transaksi tidak ditemukan.');
        }

        // Get file path dari private storage
        $filePath = $transaction->getBuktiPath();

        // Get original filename
        $originalName = basename($transaction->bukti);

        // Generate download name
        $jenisText = $transaction->isPemasukan() ? 'Pemasukan' : 'Pengeluaran';
        $downloadName = "Bukti_{$jenisText}_{$transaction->id}_{$originalName}";

        // Return file dengan proper headers untuk download
        return response()->download($filePath, $downloadName, [
            'Content-Type' => $transaction->getBuktiMimeType(),
        ]);
    }

    /**
     * Helper method untuk format transaction data
     * PERUBAHAN: Pengecekan ownership lebih eksplisit
     */
    private function formatTransaction(Transaction $transaction, User $user): array
    {
        $waktuTransaksi = is_string($transaction->waktu_transaksi)
            ? Date::parse($transaction->waktu_transaksi)
            : $transaction->waktu_transaksi;

        // PERUBAHAN: Pengecekan ownership lebih eksplisit dan di-log
        $canEdit = $transaction->user_id === $user->id;
        $canDelete = $transaction->user_id === $user->id;

        Log::debug('Format transaction permissions', [
            'transaction_id' => $transaction->id,
            'transaction_user_id' => $transaction->user_id,
            'current_user_id' => $user->id,
            'can_edit' => $canEdit,
            'can_delete' => $canDelete
        ]);

        return [
            'id' => $transaction->id,
            'jenis' => $transaction->jenis,
            'jumlah' => $transaction->jumlah,
            'formatted_jumlah' => $transaction->formatted_jumlah,
            'catatan' => $transaction->catatan,
            'has_bukti' => $transaction->hasBukti(),
            'bukti_preview_url' => $transaction->hasBukti()
                ? route('transactions.bukti.preview', [$transaction->relation_id, $transaction->id])
                : null,
            'bukti_download_url' => $transaction->hasBukti()
                ? route('transactions.bukti.download', [$transaction->relation_id, $transaction->id])
                : null,
            'bukti_url' => $transaction->hasBukti()
                ? route('transactions.bukti.download', [$transaction->relation_id, $transaction->id])
                : null,
            'bukti_size' => $transaction->getBuktiSize(),
            'bukti_type' => $transaction->hasBukti() ? $transaction->getBuktiMimeType() : null,
            'waktu_transaksi' => $waktuTransaksi->format('d M Y H:i'),
            'waktu_transaksi_human' => $waktuTransaksi->diffForHumans(),
            'user_name' => $transaction->creator_name,
            'user' => $transaction->user ? [
                'id' => $transaction->user->id,
                'name' => $transaction->user->name,
            ] : null,
            'user_id' => $transaction->user_id, // TAMBAHAN: Kirim user_id eksplisit
            'can_edit' => $canEdit,
            'can_delete' => $canDelete,
            'created_at' => $transaction->created_at->format('d M Y H:i'),
        ];
    }
}
