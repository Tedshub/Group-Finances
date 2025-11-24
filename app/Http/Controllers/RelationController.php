<?php
// app/Http/Controllers/RelationController.php

namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\User;
use App\Models\RelationJoinRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/** @mixin User */

class RelationController extends Controller
{
    /**
     * Display a listing of relations.
     * Menampilkan semua relations yang user ikuti
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Ambil relations dengan pagination
        $relations = $user->relations()
            ->with(['creator:id,name,email', 'users:id,name'])
            ->withCount('users')
            ->latest('user_relation.join_at')
            ->paginate(10)
            ->through(function ($relation) use ($user) {
                // Pastikan join_at adalah Carbon object
                $joinAt = is_string($relation->pivot->join_at)
                    ? Date::parse($relation->pivot->join_at)
                    : $relation->pivot->join_at;

                // Pastikan created_at adalah Carbon object
                $createdAt = is_string($relation->created_at)
                    ? Date::parse($relation->created_at)
                    : $relation->created_at;

                // Hitung pending requests jika user adalah owner
                $pendingRequestsCount = 0;
                if ($relation->pivot->is_owner) {
                    $pendingRequestsCount = $relation->joinRequests()
                        ->where('status', RelationJoinRequest::STATUS_PENDING)
                        ->count();
                }

                return [
                    'id' => $relation->id,
                    'kode' => $relation->kode,
                    'nama' => $relation->nama,
                    'deskripsi' => $relation->deskripsi,
                    'creator' => [
                        'id' => $relation->creator->id,
                        'name' => $relation->creator->name,
                        'email' => $relation->creator->email,
                    ],
                    'users_count' => $relation->users_count,
                    'is_owner' => $relation->pivot->is_owner,
                    'join_at' => $joinAt->format('d M Y H:i'),
                    'created_at' => $createdAt->format('d M Y'),
                    'pending_requests_count' => $pendingRequestsCount,
                ];
            });

        return Inertia::render('Relations/RelationsPage', [
            'relations' => $relations,
        ]);
    }

    /**
     * Show the form for creating a new relation.
     */
    public function create(): Response
    {
        return Inertia::render('Relations/Create');
    }

    /**
     * Store a newly created relation in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'deskripsi' => 'nullable|string|max:1000',
            'kode' => [
                'nullable',
                'string',
                'max:20',
                'alpha_num',
                Rule::unique('relations', 'kode'),
            ],
        ]);

        /** @var User $user */
        $user = Auth::user();

        // Buat relation
        $relation = Relation::create([
            'kode' => $validated['kode'] ?? Relation::generateUniqueCode(),
            'nama' => $validated['nama'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'creator_id' => $user->id,
        ]);

        // Auto-join user sebagai owner
        $user->relations()->attach($relation->id, [
            'is_owner' => true,
            'join_at' => now(),
        ]);

        return redirect()->route('relations.index')
            ->with('success', "Relation {$relation->nama} berhasil dibuat! Kode: {$relation->kode}");
    }

    /**
     * Display the specified relation.
     */
    public function show(Relation $relation): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user sudah join relation ini dengan cara langsung
        $isMember = $user->relations()->where('relations.id', $relation->id)->exists();
        if (!$isMember) {
            abort(403, 'Anda belum bergabung di relation ini.');
        }

        // Load relations dengan data lengkap
        $relation->load([
            'creator:id,name,email',
            'users' => function ($query) {
                $query->withPivot('is_owner', 'join_at')
                    ->orderByPivot('is_owner', 'desc')
                    ->orderByPivot('join_at', 'asc');
            }
        ]);

        // Pastikan created_at adalah Carbon object
        $relationCreatedAt = is_string($relation->created_at)
            ? Date::parse($relation->created_at)
            : $relation->created_at;

        // Format users data
        $users = $relation->users->map(function ($user) {
            // Pastikan join_at adalah Carbon object
            $joinAt = is_string($user->pivot->join_at)
                ? Date::parse($user->pivot->join_at)
                : $user->pivot->join_at;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_owner' => $user->pivot->is_owner,
                'join_at' => $joinAt->format('d M Y H:i'),
            ];
        });

        return Inertia::render('Relations/Show', [
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'creator' => [
                    'id' => $relation->creator->id,
                    'name' => $relation->creator->name,
                    'email' => $relation->creator->email,
                ],
                'users' => $users,
                'created_at' => $relationCreatedAt->format('d M Y H:i'),
            ],
            'is_owner' => $user->relations()->where('relations.id', $relation->id)->wherePivot('is_owner', true)->exists(),
            'user_id' => $user->id,
        ]);
    }

    /**
     * Show the form for editing the specified relation.
     */
    public function edit(Relation $relation): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah owner dengan cara langsung
        $isOwner = $user->relations()
            ->where('relations.id', $relation->id)
            ->wherePivot('is_owner', true)
            ->exists();

        if (!$isOwner) {
            abort(403, 'Hanya owner yang bisa edit relation ini.');
        }

        return Inertia::render('Relations/Edit', [
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
            ],
        ]);
    }

    /**
     * Update the specified relation in storage.
     */
    public function update(Request $request, Relation $relation): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah owner dengan cara langsung
        $isOwner = $user->relations()
            ->where('relations.id', $relation->id)
            ->wherePivot('is_owner', true)
            ->exists();

        if (!$isOwner) {
            abort(403, 'Hanya owner yang bisa update relation ini.');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'deskripsi' => 'nullable|string|max:1000',
            'kode' => [
                'required',
                'string',
                'max:20',
                'alpha_num',
                Rule::unique('relations', 'kode')->ignore($relation->id),
            ],
        ]);

        $relation->update($validated);

        return redirect()->route('relations.index')
            ->with('success', 'Relation berhasil diupdate!');
    }

    /**
     * Remove the specified relation from storage.
     */
    public function destroy(Relation $relation): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user adalah owner dengan cara langsung
        $isOwner = $user->relations()
            ->where('relations.id', $relation->id)
            ->wherePivot('is_owner', true)
            ->exists();

        if (!$isOwner) {
            abort(403, 'Hanya owner yang bisa delete relation ini.');
        }

        $relationName = $relation->nama;
        $relation->delete();

        return redirect()->route('relations.index')
            ->with('success', "Relation '{$relationName}' berhasil dihapus!");
    }

    /**
     * Request join relation dengan kode (butuh approval dari owner)
     */
    public function join(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => 'required|string|exists:relations,kode',
            'message' => 'nullable|string|max:500',
        ]);

        /** @var User $user */
        $user = Auth::user();
        $relation = Relation::where('kode', $validated['kode'])->first();

        // Cek apakah sudah join
        if ($user->hasJoinedRelation($relation->id)) {
            return back()->with('error', 'Anda sudah bergabung di relation ini!');
        }

        // Cek apakah sudah punya pending request
        if ($user->hasPendingRequestFor($relation->id)) {
            return back()->with('error', 'Anda sudah memiliki request yang menunggu approval!');
        }

        try {
            // Buat join request
            $user->requestJoinRelation($relation->id, $validated['message'] ?? null);

            return redirect()->route('relations.index')
                ->with('success', "Permintaan bergabung ke '{$relation->nama}' berhasil dikirim. Menunggu persetujuan dari owner.");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Leave/keluar dari relation
     */
    public function leave(Relation $relation): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user join di relation ini dengan cara langsung
        $isMember = $user->relations()->where('relations.id', $relation->id)->exists();
        if (!$isMember) {
            abort(403, 'Anda tidak tergabung di relation ini.');
        }

        // Cek apakah user adalah owner dengan cara langsung
        $isOwner = $user->relations()
            ->where('relations.id', $relation->id)
            ->wherePivot('is_owner', true)
            ->exists();

        if ($isOwner) {
            return back()->with('error', 'Owner tidak bisa leave. Silakan delete relation jika ingin menghapus.');
        }

        $relationName = $relation->nama;
        $user->relations()->detach($relation->id);

        return redirect()->route('relations.index')
            ->with('success', "Berhasil keluar dari '{$relationName}'!");
    }

    /**
     * Search relation by code (untuk join form)
     */
    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'kode' => 'required|string',
        ]);

        $relation = Relation::where('kode', $validated['kode'])
            ->with('creator:id,name')
            ->withCount('users')
            ->first();

        if (!$relation) {
            return response()->json([
                'found' => false,
                'message' => 'Relation tidak ditemukan.',
            ], 404);
        }

        /** @var User $user */
        $user = Auth::user();
        $alreadyJoined = $user->hasJoinedRelation($relation->id);
        $hasPendingRequest = $user->hasPendingRequestFor($relation->id);

        return response()->json([
            'found' => true,
            'already_joined' => $alreadyJoined,
            'has_pending_request' => $hasPendingRequest,
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
                'deskripsi' => $relation->deskripsi,
                'creator' => [
                    'id' => $relation->creator->id,
                    'name' => $relation->creator->name,
                ],
                'users_count' => $relation->users_count,
            ],
        ]);
    }

    /**
     * Kick member dari relation (hanya untuk owner)
     */
    public function kickMember(Relation $relation, User $user): RedirectResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        // Cek apakah current user adalah owner
        $isOwner = $currentUser->relations()
            ->where('relations.id', $relation->id)
            ->wherePivot('is_owner', true)
            ->exists();

        if (!$isOwner) {
            abort(403, 'Hanya owner yang bisa mengeluarkan member.');
        }

        // Cek apakah target user adalah member di relation ini
        $isMember = $user->relations()
            ->where('relations.id', $relation->id)
            ->exists();

        if (!$isMember) {
            return back()->with('error', 'User tidak terdaftar di relation ini.');
        }

        // Cek apakah target user adalah owner
        $isTargetOwner = $user->relations()
            ->where('relations.id', $relation->id)
            ->wherePivot('is_owner', true)
            ->exists();

        if ($isTargetOwner) {
            return back()->with('error', 'Tidak dapat mengeluarkan owner dari relation.');
        }

        // Tidak boleh kick diri sendiri
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'Tidak dapat mengeluarkan diri sendiri. Gunakan fitur Leave jika ingin keluar.');
        }

        // Keluarkan user
        $user->relations()->detach($relation->id);

        return back()->with('success', "{$user->name} berhasil dikeluarkan dari relation.");
    }

    /**
     * Get members of a relation (for AJAX requests)
     */
    public function members(Relation $relation): \Illuminate\Http\JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user sudah join relation ini dengan cara langsung
        $isMember = $user->relations()->where('relations.id', $relation->id)->exists();
        if (!$isMember) {
            return response()->json([
                'error' => 'Anda belum bergabung di relation ini.',
            ], 403);
        }

        // Load users with pivot data
        $relation->load([
            'users' => function ($query) {
                $query->withPivot('is_owner', 'join_at')
                    ->orderByPivot('is_owner', 'desc')
                    ->orderByPivot('join_at', 'asc');
            }
        ]);

        // Format users data
        $users = $relation->users->map(function ($user) {
            // Pastikan join_at adalah Carbon object
            $joinAt = is_string($user->pivot->join_at)
                ? Date::parse($user->pivot->join_at)
                : $user->pivot->join_at;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_owner' => $user->pivot->is_owner,
                'join_at' => $joinAt->diffForHumans(),
            ];
        });

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    // ==================== JOIN REQUEST MANAGEMENT ====================

    /**
     * Get pending requests as JSON (untuk AJAX di modal)
     * Route: GET /relations/{relation}/pending-requests-json
     */
    public function pendingRequestsJson(Relation $relation): \Illuminate\Http\JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            // Cek apakah user adalah owner - gunakan Eloquent relationship
            $isOwner = $user->relations()
                ->where('relations.id', $relation->id)
                ->wherePivot('is_owner', true)
                ->exists();

            if (!$isOwner) {
                return response()->json([
                    'success' => false,
                    'error' => 'Hanya owner yang bisa melihat join requests.',
                    'requests' => []
                ], 403);
            }

            $requests = $relation->joinRequests()
                ->where('status', RelationJoinRequest::STATUS_PENDING)
                ->with('user:id,name,email')
                ->latest()
                ->get()
                ->map(function ($request) {
                    $createdAt = is_string($request->created_at)
                        ? Date::parse($request->created_at)
                        : $request->created_at;

                    return [
                        'id' => $request->id,
                        'user_id' => $request->user->id,
                        'user_name' => $request->user->name,
                        'user_email' => $request->user->email,
                        'message' => $request->message,
                        'created_at' => $createdAt->diffForHumans(),
                        'status' => $request->status,
                    ];
                });

            return response()->json([
                'success' => true,
                'requests' => $requests,
            ]);
        } catch (\Exception $e) {
            error_log('Error fetching pending requests: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Gagal memuat permintaan pending',
                'requests' => []
            ], 500);
        }
    }

    /**
     * Approve join request (REDIRECT version)
     * Route: POST /relations/{relation}/requests/{request}/approve
     */
    public function approveRequest(Relation $relation, RelationJoinRequest $request): RedirectResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            // Cek apakah user adalah owner
            $isOwner = $user->relations()
                ->where('relations.id', $relation->id)
                ->wherePivot('is_owner', true)
                ->exists();

            if (!$isOwner) {
                return back()->with('error', 'Hanya owner yang bisa approve request.');
            }

            // Cek apakah request untuk relation yang benar
            if ($request->relation_id !== $relation->id) {
                return back()->with('error', 'Request tidak valid.');
            }

            // Cek status pending
            if (!$request->isPending()) {
                return back()->with('error', 'Request sudah di-review sebelumnya.');
            }

            // Simpan nama user sebelum approve
            $userName = $request->user->name;

            // Approve request
            $request->approve($user);

            return back()->with('success', "{$userName} berhasil diterima sebagai member!");
        } catch (\Exception $e) {
            Log::error('Approve request error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menerima permintaan.');
        }
    }

    /**
     * Reject join request (REDIRECT version)
     * Route: POST /relations/{relation}/requests/{request}/reject
     */
    public function rejectRequest(Relation $relation, RelationJoinRequest $request): RedirectResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            // Cek apakah user adalah owner
            $isOwner = $user->relations()
                ->where('relations.id', $relation->id)
                ->wherePivot('is_owner', true)
                ->exists();

            if (!$isOwner) {
                return back()->with('error', 'Hanya owner yang bisa reject request.');
            }

            // Cek apakah request untuk relation yang benar
            if ($request->relation_id !== $relation->id) {
                return back()->with('error', 'Request tidak valid.');
            }

            // Cek status pending
            if (!$request->isPending()) {
                return back()->with('error', 'Request sudah di-review sebelumnya.');
            }

            // Simpan nama user sebelum reject
            $userName = $request->user->name;

            // Reject request
            $request->reject($user);

            return back()->with('success', "Request dari {$userName} ditolak.");
        } catch (\Exception $e) {
            Log::error('Reject request error: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menolak permintaan.');
        }
    }

    /**
     * Get user's own pending join requests (AJAX)
     * Route: GET /pending-requests
     */
    public function getUserPendingRequests(): \Illuminate\Http\JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            $requests = RelationJoinRequest::where('user_id', $user->id)
                ->where('status', RelationJoinRequest::STATUS_PENDING)
                ->with(['relation' => function ($query) {
                    $query->with('creator:id,name');
                }])
                ->latest()
                ->get()
                ->map(function ($request) {
                    $createdAt = is_string($request->created_at)
                        ? Date::parse($request->created_at)
                        : $request->created_at;

                    return [
                        'id' => $request->id,
                        'relation_id' => $request->relation->id,
                        'relation_name' => $request->relation->nama,
                        'relation_code' => $request->relation->kode,
                        'relation_owner' => $request->relation->creator->name ?? 'Unknown',
                        'message' => $request->message,
                        'status' => $request->status,
                        'created_at' => $createdAt->format('d M Y H:i'),
                        'created_at_human' => $createdAt->diffForHumans(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $requests,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat permintaan pending'
            ], 500);
        }
    }

    /**
     * Cancel join request (REDIRECT version)
     * Route: DELETE /pending-requests/{request}
     */
    public function cancelRequest(RelationJoinRequest $request): RedirectResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            // Cek apakah request milik user
            if ($request->user_id !== $user->id) {
                return back()->with('error', 'Anda tidak bisa cancel request orang lain.');
            }

            // Hanya bisa cancel jika masih pending
            if (!$request->isPending()) {
                return back()->with('error', 'Request sudah di-review dan tidak bisa dibatalkan.');
            }

            $relationName = $request->relation->nama;
            $request->delete();

            return back()->with('success', "Request join ke '{$relationName}' berhasil dibatalkan.");
        } catch (\Exception $e) {
            Log::error('Cancel request error: ' . $e->getMessage());
            return back()->with('error', 'Gagal membatalkan permintaan.');
        }
    }
}
