<?php
// app/Http/Controllers/RelationController.php
namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
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
                // 确保join_at是Carbon对象
                $joinAt = is_string($relation->pivot->join_at)
                    ? Date::parse($relation->pivot->join_at)
                    : $relation->pivot->join_at;

                // 确保created_at是Carbon对象
                $createdAt = is_string($relation->created_at)
                    ? Date::parse($relation->created_at)
                    : $relation->created_at;

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
                ];
            });

        return Inertia::render('Relations/Index', [
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
            'id_creator' => $user->id,
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

        // 确保created_at是Carbon对象
        $relationCreatedAt = is_string($relation->created_at)
            ? Date::parse($relation->created_at)
            : $relation->created_at;

        // Format users data
        $users = $relation->users->map(function ($user) {
            // 确保join_at是Carbon对象
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
                'debug' => [
                    'user_id' => $user->id,
                    'relation_id' => $relation->id,
                    'is_member' => $isMember
                ]
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
            // 确保join_at是Carbon对象
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

        return response()->json([
            'users' => $users,
            'debug' => [
                'relation_id' => $relation->id,
                'user_count' => $users->count(),
                'relation_name' => $relation->nama
            ]
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
     * Join relation dengan kode
     */
    public function join(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => 'required|string|exists:relations,kode',
        ]);

        /** @var User $user */
        $user = Auth::user();
        $relation = Relation::where('kode', $validated['kode'])->first();

        // Cek apakah sudah join dengan cara langsung
        $isMember = $user->relations()->where('relations.id', $relation->id)->exists();
        if ($isMember) {
            return back()->with('error', 'Anda sudah bergabung di relation ini!');
        }

        // Join sebagai member
        $user->relations()->attach($relation->id, [
            'is_owner' => false,
            'join_at' => now(),
        ]);

        return redirect()->route('relations.index')
            ->with('success', "Berhasil bergabung ke '{$relation->nama}'!");
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
        $alreadyJoined = $user->relations()->where('relations.id', $relation->id)->exists();

        return response()->json([
            'found' => true,
            'already_joined' => $alreadyJoined,
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
}
