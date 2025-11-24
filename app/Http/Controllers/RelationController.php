<?php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\RelationJoinRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RelationController extends Controller
{
    /**
     * Menampilkan halaman utama Relation
     * Menampilkan daftar relation yang dimiliki dan yang di-join
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Relation yang dimiliki (sebagai owner)
        $ownedRelations = Relation::whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id)
                ->where('user_relation.is_owner', true);
        })
        ->withCount([
            'users as member_count',
            'joinRequests as pending_requests_count' => function ($query) {  // TAMBAHKAN INI
                $query->where('status', RelationJoinRequest::STATUS_PENDING);
            }
        ])
        ->with(['creator:id,name,email'])
        ->orderBy('created_at', 'desc')
        ->paginate(10, ['*'], 'owned_page');

        // Relation yang di-join (sebagai member, bukan owner)
        $joinedRelations = Relation::whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id)
                  ->where('user_relation.is_owner', false);
        })
        ->withCount('users as member_count')
        ->with(['creator:id,name,email'])
        ->orderBy('created_at', 'desc')
        ->paginate(10, ['*'], 'joined_page');

    // Pending join requests yang dibuat oleh user
    $myPendingRequests = RelationJoinRequest::where('user_id', $user->id)
        ->where('status', RelationJoinRequest::STATUS_PENDING)
        ->with(['relation:id,kode,nama,creator_id', 'relation.creator:id,name,email']) // TAMBAHKAN relation.creator
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($request) {
            return [
                'id' => $request->id,
                'relation' => [
                    'id' => $request->relation->id,
                    'kode' => $request->relation->kode,
                    'nama' => $request->relation->nama,
                    'owner' => $request->relation->creator ? [ // TAMBAHKAN OWNER INFO
                        'id' => $request->relation->creator->id,
                        'name' => $request->relation->creator->name,
                        'email' => $request->relation->creator->email,
                    ] : null,
                ],
                'pesan' => $request->pesan,
                'created_at' => $request->created_at->format('d M Y, H:i'),
                'created_at_human' => $request->created_at->diffForHumans(),
            ];
        });

        // Pending join requests untuk relation yang user sebagai owner
        $incomingRequests = RelationJoinRequest::whereHas('relation', function ($query) use ($user) {
            $query->whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id)
                  ->where('user_relation.is_owner', true);
            });
        })
        ->where('status', RelationJoinRequest::STATUS_PENDING)
        ->with(['user:id,name,email', 'relation:id,kode,nama'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($request) {
            return [
                'id' => $request->id,
                'user' => [
                    'id' => $request->user->id,
                    'name' => $request->user->name,
                    'email' => $request->user->email,
                ],
                'relation' => [
                    'id' => $request->relation->id,
                    'kode' => $request->relation->kode,
                    'nama' => $request->relation->nama,
                ],
                'pesan' => $request->pesan,
                'created_at' => $request->created_at->format('d M Y, H:i'),
                'created_at_human' => $request->created_at->diffForHumans(),
            ];
        });

        // Format owned relations
        $ownedRelations->getCollection()->transform(function ($relation) {
            return [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'member_count' => $relation->member_count,
                'pending_requests_count' => $relation->pending_requests_count, // TAMBAHKAN INI
                'creator' => [
                    'name' => $relation->creator->name,
                    'email' => $relation->creator->email,
                ],
                'created_at' => $relation->created_at->format('d M Y, H:i'),
                'created_at_human' => $relation->created_at->diffForHumans(),
            ];
        });

        // Format joined relations
        $joinedRelations->getCollection()->transform(function ($relation) {
            return [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'member_count' => $relation->member_count,
                'creator' => [
                    'name' => $relation->creator->name,
                    'email' => $relation->creator->email,
                ],
                'created_at' => $relation->created_at->format('d M Y, H:i'),
                'created_at_human' => $relation->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Relations/RelationsPage', [
            'ownedRelations' => $ownedRelations,
            'joinedRelations' => $joinedRelations,
            'myPendingRequests' => $myPendingRequests,
            'incomingRequests' => $incomingRequests,
        ]);
    }

    /**
     * Membuat Relation baru
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validasi input
        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                // Nama harus unik per user (sebagai creator)
                Rule::unique('relations', 'nama')->where(function ($query) use ($user) {
                    return $query->where('creator_id', $user->id);
                }),
            ],
            'deskripsi' => 'nullable|string|max:1000',
        ], [
            'nama.required' => 'Nama relation harus diisi.',
            'nama.unique' => 'Anda sudah memiliki relation dengan nama ini.',
            'nama.max' => 'Nama relation maksimal 255 karakter.',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter.',
        ]);

        DB::beginTransaction();

        try {
            // Buat relation baru
            $relation = Relation::create([
                'nama' => $validated['nama'],
                'deskripsi' => $validated['deskripsi'] ?? null,
                'creator_id' => $user->id,
            ]);

            // Set user sebagai owner
            $relation->users()->attach($user->id, [
                'is_owner' => true,
                'join_at' => now(),
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Relation "' . $relation->nama . '" berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal membuat relation. Silakan coba lagi.');
        }
    }

    /**
     * Menampilkan halaman edit Relation
     *
     * @param Relation $relation
     * @return Response
     */
    public function edit(Relation $relation): Response
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh mengedit
        if (!$relation->isOwnedBy($user)) {
            return Inertia::render('Error', [
                'status' => 403,
                'message' => 'Anda tidak memiliki akses untuk mengedit relation ini.',
            ]);
        }

        return Inertia::render('Relations/Edit', [
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'created_at' => $relation->created_at->format('d M Y, H:i'),
            ],
        ]);
    }

    /**
     * Mengupdate Relation
     *
     * @param Request $request
     * @param Relation $relation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Relation $relation)
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh mengupdate
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk mengupdate relation ini.');
        }

        // Validasi input
        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                // Nama harus unik per user (kecuali nama sendiri)
                Rule::unique('relations', 'nama')
                    ->where(function ($query) use ($user) {
                        return $query->where('creator_id', $user->id);
                    })
                    ->ignore($relation->id),
            ],
            'deskripsi' => 'nullable|string|max:1000',
        ], [
            'nama.required' => 'Nama relation harus diisi.',
            'nama.unique' => 'Anda sudah memiliki relation dengan nama ini.',
            'nama.max' => 'Nama relation maksimal 255 karakter.',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter.',
        ]);

        try {
            $relation->update([
                'nama' => $validated['nama'],
                'deskripsi' => $validated['deskripsi'] ?? null,
            ]);

            return redirect()->route('relations.index')->with('success', 'Relation "' . $relation->nama . '" berhasil diupdate.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengupdate relation. Silakan coba lagi.');
        }
    }

    /**
     * Menghapus Relation
     *
     * @param Relation $relation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Relation $relation)
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh menghapus
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menghapus relation ini.');
        }

        DB::beginTransaction();

        try {
            $relationName = $relation->nama;

            // Hapus semua join requests terkait
            RelationJoinRequest::where('relation_id', $relation->id)->delete();

            // Hapus semua membership (user_relation pivot)
            $relation->users()->detach();

            // Hapus relation
            $relation->delete();

            DB::commit();

            return redirect()->route('relations.index')->with('success', 'Relation "' . $relationName . '" berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menghapus relation. Silakan coba lagi.');
        }
    }

    /**
     * Join Relation berdasarkan kode
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function join(Request $request)
    {
        $user = Auth::user();

        // Validasi input
        $validated = $request->validate([
            'kode' => 'required|string|exists:relations,kode',
            'pesan' => 'nullable|string|max:500',
        ], [
            'kode.required' => 'Kode relation harus diisi.',
            'kode.exists' => 'Kode relation tidak ditemukan.',
            'pesan.max' => 'Pesan maksimal 500 karakter.',
        ]);

        // Cari relation berdasarkan kode
        $relation = Relation::where('kode', $validated['kode'])->first();

        // Cek apakah user adalah creator/owner
        if ($relation->creator_id === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa join relation milik sendiri.');
        }

        // Cek apakah user sudah menjadi member
        if ($relation->hasUser($user)) {
            return redirect()->back()->with('warning', 'Anda sudah menjadi member dari relation ini.');
        }

        // Cek apakah sudah pernah membuat request dan masih pending
        $existingRequest = RelationJoinRequest::where('relation_id', $relation->id)
            ->where('user_id', $user->id)
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->first();

        if ($existingRequest) {
            return redirect()->back()->with('warning', 'Anda sudah memiliki request join yang masih pending untuk relation ini.');
        }

        try {
            // Buat request join baru
            RelationJoinRequest::create([
                'relation_id' => $relation->id,
                'user_id' => $user->id,
                'pesan' => $validated['pesan'] ?? null,
                'status' => RelationJoinRequest::STATUS_PENDING,
            ]);

            return redirect()->route('relations.index')->with('success', 'Request join ke relation "' . $relation->nama . '" berhasil dikirim. Menunggu persetujuan owner.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengirim request join. Silakan coba lagi.');
        }
    }

    /**
     * Membatalkan request join
     *
     * @param RelationJoinRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancelJoinRequest(RelationJoinRequest $joinRequest)
    {
        $user = Auth::user();

        // Validasi: hanya user yang membuat request yang boleh membatalkan
        if ($joinRequest->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk membatalkan request ini.');
        }

        // Validasi: hanya pending request yang bisa dibatalkan
        if ($joinRequest->status !== RelationJoinRequest::STATUS_PENDING) {
            return redirect()->back()->with('error', 'Request ini sudah tidak bisa dibatalkan.');
        }

        try {
            $relationName = $joinRequest->relation->nama;
            $joinRequest->delete();

            return redirect()->back()->with('success', 'Request join ke relation "' . $relationName . '" berhasil dibatalkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membatalkan request join. Silakan coba lagi.');
        }
    }

    /**
     * Approve join request (owner only)
     *
     * @param RelationJoinRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approveJoinRequest(RelationJoinRequest $joinRequest)
    {
        $user = Auth::user();
        $relation = $joinRequest->relation;

        // Validasi: hanya owner yang boleh approve
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk approve request ini.');
        }

        // Validasi: hanya pending request yang bisa di-approve
        if ($joinRequest->status !== RelationJoinRequest::STATUS_PENDING) {
            return redirect()->back()->with('error', 'Request ini sudah tidak bisa di-approve.');
        }

        DB::beginTransaction();

        try {
            // Tambahkan user ke relation sebagai member
            $relation->users()->attach($joinRequest->user_id, [
                'is_owner' => false,
                'join_at' => now(),
            ]);

            // Update status request menjadi approved
            $joinRequest->update([
                'status' => RelationJoinRequest::STATUS_APPROVED,
                'processed_at' => now(),
                'processed_by' => $user->id,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Request join dari ' . $joinRequest->user->name . ' berhasil di-approve.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal approve request join. Silakan coba lagi.');
        }
    }

    /**
     * Reject join request (owner only)
     *
     * @param RelationJoinRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function rejectJoinRequest(RelationJoinRequest $joinRequest)
    {
        $user = Auth::user();
        $relation = $joinRequest->relation;

        // Validasi: hanya owner yang boleh reject
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk reject request ini.');
        }

        // Validasi: hanya pending request yang bisa di-reject
        if ($joinRequest->status !== RelationJoinRequest::STATUS_PENDING) {
            return redirect()->back()->with('error', 'Request ini sudah tidak bisa di-reject.');
        }

        try {
            // Update status request menjadi rejected
            $joinRequest->update([
                'status' => RelationJoinRequest::STATUS_REJECTED,
                'processed_at' => now(),
                'processed_by' => $user->id,
            ]);

            return redirect()->back()->with('success', 'Request join dari ' . $joinRequest->user->name . ' berhasil di-reject.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal reject request join. Silakan coba lagi.');
        }
    }

    /**
     * Menampilkan daftar member dari relation
     *
     * @param Relation $relation
     * @return Response
     */
    public function members(Relation $relation): Response
    {
        $user = Auth::user();

        // Validasi: user harus menjadi member dari relation ini
        if (!$relation->hasUser($user)) {
            return Inertia::render('Error', [
                'status' => 403,
                'message' => 'Anda tidak memiliki akses untuk melihat member relation ini.',
            ]);
        }

        // Ambil semua member dengan informasi lengkap
        $members = $relation->users()
            ->orderByPivot('is_owner', 'desc')
            ->orderByPivot('join_at', 'asc')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'is_owner' => (bool) $member->pivot->is_owner,
                    'join_at' => $member->pivot->join_at->format('d M Y, H:i'),
                    'join_at_human' => $member->pivot->join_at->diffForHumans(),
                ];
            });

        $isOwner = $relation->isOwnedBy($user);

        return Inertia::render('Relations/Members', [
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'is_owner' => $isOwner,
            ],
            'members' => $members,
        ]);
    }

    /**
     * Mengeluarkan member dari relation (owner only)
     *
     * @param Relation $relation
     * @param int $userId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function kickMember(Relation $relation, int $userId)
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh kick member
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk mengeluarkan member dari relation ini.');
        }

        // Validasi: tidak boleh kick diri sendiri
        if ($userId === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa mengeluarkan diri sendiri. Gunakan fitur "Keluar dari Relation" jika ingin keluar.');
        }

        // Cek apakah user yang akan di-kick ada di relation
        if (!$relation->hasUser($userId)) {
            return redirect()->back()->with('error', 'User tidak ditemukan di relation ini.');
        }

        try {
            $kickedUser = \App\Models\User::findOrFail($userId);

            // Hapus membership
            $relation->users()->detach($userId);

            return redirect()->back()->with('success', 'Member "' . $kickedUser->name . '" berhasil dikeluarkan dari relation.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengeluarkan member. Silakan coba lagi.');
        }
    }

    /**
     * Keluar dari relation
     *
     * @param Relation $relation
     * @return \Illuminate\Http\RedirectResponse
     */
    public function leave(Relation $relation)
    {
        $user = Auth::user();

        // Validasi: user harus menjadi member dari relation ini
        if (!$relation->hasUser($user)) {
            return redirect()->back()->with('error', 'Anda bukan member dari relation ini.');
        }

        $isOwner = $relation->isOwnedBy($user);
        $totalMembers = $relation->users()->count();

        // Jika user adalah owner dan masih ada member lain
        if ($isOwner && $totalMembers > 1) {
            return redirect()->back()->with('error', 'Anda adalah owner relation ini dan masih ada member lain. Silakan keluarkan semua member terlebih dahulu atau hapus relation jika ingin keluar.');
        }

        DB::beginTransaction();

        try {
            $relationName = $relation->nama;

            // Hapus membership
            $relation->users()->detach($user->id);

            // Jika user adalah owner dan satu-satunya member, hapus relation
            if ($isOwner && $totalMembers === 1) {
                // Hapus semua join requests terkait
                RelationJoinRequest::where('relation_id', $relation->id)->delete();

                // Hapus relation
                $relation->delete();

                DB::commit();

                return redirect()->route('relations.index')->with('success', 'Anda berhasil keluar dari relation "' . $relationName . '". Relation telah dihapus karena tidak ada member lagi.');
            }

            DB::commit();

            return redirect()->route('relations.index')->with('success', 'Anda berhasil keluar dari relation "' . $relationName . '".');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal keluar dari relation. Silakan coba lagi.');
        }
    }

    /**
     * Search Relation berdasarkan nama atau kode
     *
     * @param Request $request
     * @return Response
     */
    public function search(Request $request): Response
    {
        $user = Auth::user();

        // Validasi input
        $validated = $request->validate([
            'query' => 'required|string|min:2|max:255',
        ], [
            'query.required' => 'Kata kunci pencarian harus diisi.',
            'query.min' => 'Kata kunci pencarian minimal 2 karakter.',
            'query.max' => 'Kata kunci pencarian maksimal 255 karakter.',
        ]);

        $query = $validated['query'];

        // Search relation yang user ikuti (sebagai owner atau member)
        $results = Relation::whereHas('users', function ($q) use ($user) {
            $q->where('users.id', $user->id);
        })
        ->where(function ($q) use ($query) {
            $q->where('nama', 'like', '%' . $query . '%')
              ->orWhere('kode', 'like', '%' . $query . '%');
        })
        ->withCount('users as member_count')
        ->with(['creator:id,name,email'])
        ->orderBy('created_at', 'desc')
        ->paginate(15)
        ->through(function ($relation) use ($user) {
            $isOwner = $relation->isOwnedBy($user);

            return [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'member_count' => $relation->member_count,
                'is_owner' => $isOwner,
                'creator' => [
                    'name' => $relation->creator->name,
                    'email' => $relation->creator->email,
                ],
                'created_at' => $relation->created_at->format('d M Y, H:i'),
                'created_at_human' => $relation->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Relations/Search', [
            'query' => $query,
            'results' => $results,
        ]);
    }

    /**
     * Menampilkan detail relation beserta statistik
     *
     * @param Relation $relation
     * @return Response
     */
    public function show(Relation $relation): Response
    {
        $user = Auth::user();

        // Validasi: user harus menjadi member dari relation ini
        if (!$relation->hasUser($user)) {
            return Inertia::render('Error', [
                'status' => 403,
                'message' => 'Anda tidak memiliki akses untuk melihat detail relation ini.',
            ]);
        }

        $isOwner = $relation->isOwnedBy($user);

        // Ambil statistik transaksi
        $statistik = $relation->getStatistikTransaksi();

        // Ambil transaksi terbaru (10 terakhir)
        $recentTransactions = $relation->transactions()
            ->with(['user:id,name,email', 'kategori:id,nama'])
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'jenis' => $transaction->jenis,
                    'jumlah' => $transaction->jumlah,
                    'jumlah_formatted' => 'Rp ' . number_format($transaction->jumlah, 0, ',', '.'),
                    'keterangan' => $transaction->keterangan,
                    'tanggal' => $transaction->tanggal->format('d M Y'),
                    'user' => [
                        'name' => $transaction->user->name,
                    ],
                    'kategori' => $transaction->kategori ? [
                        'nama' => $transaction->kategori->nama,
                    ] : null,
                    'created_at' => $transaction->created_at->format('d M Y, H:i'),
                ];
            });

        // Ambil member count
        $memberCount = $relation->users()->count();

        // Pending requests count (untuk owner)
        $pendingRequestsCount = $isOwner ? $relation->pending_requests_count : 0;

        return Inertia::render('Relations/Show', [
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'is_owner' => $isOwner,
                'member_count' => $memberCount,
                'pending_requests_count' => $pendingRequestsCount,
                'creator' => [
                    'name' => $relation->creator->name,
                    'email' => $relation->creator->email,
                ],
                'created_at' => $relation->created_at->format('d M Y, H:i'),
                'created_at_human' => $relation->created_at->diffForHumans(),
            ],
            'statistik' => [
                'total_pemasukan' => $statistik['total_pemasukan'],
                'total_pengeluaran' => $statistik['total_pengeluaran'],
                'saldo' => $statistik['saldo'],
                'total_pemasukan_formatted' => 'Rp ' . number_format($statistik['total_pemasukan'], 0, ',', '.'),
                'total_pengeluaran_formatted' => 'Rp ' . number_format($statistik['total_pengeluaran'], 0, ',', '.'),
                'saldo_formatted' => 'Rp ' . number_format($statistik['saldo'], 0, ',', '.'),
                'jumlah_transaksi' => $statistik['jumlah_transaksi'],
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }

    /**
     * Mendapatkan pending requests untuk relation (owner only)
     * Digunakan oleh MembersModal untuk tab Requests
     *
     * @param Relation $relation
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPendingRequests(Relation $relation)
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh melihat pending requests
        if (!$relation->isOwnedBy($user)) {
            return response()->json([
                'error' => 'Anda tidak memiliki akses untuk melihat permintaan relation ini.'
            ], 403);
        }

        // Ambil pending requests
        $requests = RelationJoinRequest::where('relation_id', $relation->id)
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'user_id' => $request->user->id,
                    'user_name' => $request->user->name,
                    'user_email' => $request->user->email,
                    'message' => $request->pesan,
                    'created_at' => $request->created_at->diffForHumans(),
                    'created_at_formatted' => $request->created_at->format('d M Y, H:i'),
                ];
            });

        return response()->json([
            'requests' => $requests
        ]);
    }

    /**
     * Mendapatkan members untuk relation
     * Digunakan oleh MembersModal
     *
     * @param Relation $relation
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMembersData(Relation $relation)
    {
        $user = Auth::user();

        // Validasi: user harus menjadi member dari relation ini
        if (!$relation->hasUser($user)) {
            return response()->json([
                'error' => 'Anda tidak memiliki akses untuk melihat member relation ini.'
            ], 403);
        }

        // Ambil semua member dengan informasi lengkap
        $members = $relation->users()
            ->orderByPivot('is_owner', 'desc')
            ->orderByPivot('join_at', 'asc')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'is_owner' => (bool) $member->pivot->is_owner,
                    'join_at' => $member->pivot->join_at->diffForHumans(),
                    'join_at_formatted' => $member->pivot->join_at->format('d M Y, H:i'),
                ];
            });

        return response()->json([
            'members' => $members,
            'is_owner' => $relation->isOwnedBy($user)
        ]);
    }

    /**
     * Approve join request dengan POST request (untuk Inertia)
     *
     * @param Request $request
     * @param Relation $relation
     * @param RelationJoinRequest $joinRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approveRequest(Request $request, Relation $relation, RelationJoinRequest $joinRequest)
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh approve
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk approve request ini.');
        }

        // Validasi: request harus untuk relation ini
        if ($joinRequest->relation_id !== $relation->id) {
            return redirect()->back()->with('error', 'Request tidak valid untuk relation ini.');
        }

        // Validasi: hanya pending request yang bisa di-approve
        if ($joinRequest->status !== RelationJoinRequest::STATUS_PENDING) {
            return redirect()->back()->with('error', 'Request ini sudah tidak bisa di-approve.');
        }

        DB::beginTransaction();

        try {
            // Tambahkan user ke relation sebagai member
            $relation->users()->attach($joinRequest->user_id, [
                'is_owner' => false,
                'join_at' => now(),
            ]);

            // Update status request menjadi approved
            $joinRequest->update([
                'status' => RelationJoinRequest::STATUS_APPROVED,
                'processed_at' => now(),
                'processed_by' => $user->id,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Request dari ' . $joinRequest->user->name . ' berhasil diterima.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menerima request. Silakan coba lagi.');
        }
    }

    /**
     * Reject join request dengan POST request (untuk Inertia)
     *
     * @param Request $request
     * @param Relation $relation
     * @param RelationJoinRequest $joinRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function rejectRequest(Request $request, Relation $relation, RelationJoinRequest $joinRequest)
    {
        $user = Auth::user();

        // Validasi: hanya owner yang boleh reject
        if (!$relation->isOwnedBy($user)) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menolak request ini.');
        }

        // Validasi: request harus untuk relation ini
        if ($joinRequest->relation_id !== $relation->id) {
            return redirect()->back()->with('error', 'Request tidak valid untuk relation ini.');
        }

        // Validasi: hanya pending request yang bisa di-reject
        if ($joinRequest->status !== RelationJoinRequest::STATUS_PENDING) {
            return redirect()->back()->with('error', 'Request ini sudah tidak bisa ditolak.');
        }

        try {
            // Update status request menjadi rejected
            $joinRequest->update([
                'status' => RelationJoinRequest::STATUS_REJECTED,
                'processed_at' => now(),
                'processed_by' => $user->id,
            ]);

            return redirect()->back()->with('success', 'Request dari ' . $joinRequest->user->name . ' berhasil ditolak.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menolak request. Silakan coba lagi.');
        }
    }

    /**
     * Search relation by code for joining
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchByCode(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'kode' => 'required|string|exists:relations,kode'
        ]);

        $relation = Relation::where('kode', $request->kode)
            ->withCount('users as users_count')
            ->with(['creator:id,name,email'])
            ->first();

        if (!$relation) {
            return response()->json([
                'found' => false,
                'error' => 'Relation tidak ditemukan'
            ]);
        }

        // Check if user is already a member
        $alreadyJoined = $relation->hasUser($user);

        // Check if user has pending request
        $hasPendingRequest = RelationJoinRequest::where('relation_id', $relation->id)
            ->where('user_id', $user->id)
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->exists();

        return response()->json([
            'found' => true,
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'users_count' => $relation->users_count,
                'creator' => [
                    'name' => $relation->creator->name,
                    'email' => $relation->creator->email,
                ]
            ],
            'already_joined' => $alreadyJoined,
            'has_pending_request' => $hasPendingRequest
        ]);
    }
}
