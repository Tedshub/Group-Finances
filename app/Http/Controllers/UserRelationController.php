<?php
// app/Http/Controllers/UserRelationController.php
namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\User;
use App\Models\UserRelation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserRelationController extends Controller
{
    /**
     * Display a listing of user relations (admin only).
     * Menampilkan semua user-relation untuk monitoring
     */
    public function index(Request $request): Response
    {
        // Cek apakah user adalah admin
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $query = UserRelation::with(['user:id,name,email', 'relation:id,kode,nama'])
            ->latest('join_at');

        // Filter by relation
        if ($request->has('relation_id')) {
            $query->where('id_relation', $request->relation_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('id_user', $request->user_id);
        }

        // Filter by role (owner/member)
        if ($request->has('is_owner')) {
            $query->where('is_owner', $request->boolean('is_owner'));
        }

        $userRelations = $query->paginate(15)->through(function ($userRelation) {
            return [
                'id' => $userRelation->id,
                'user' => [
                    'id' => $userRelation->user->id,
                    'name' => $userRelation->user->name,
                    'email' => $userRelation->user->email,
                ],
                'relation' => [
                    'id' => $userRelation->relation->id,
                    'kode' => $userRelation->relation->kode,
                    'nama' => $userRelation->relation->nama,
                ],
                'is_owner' => $userRelation->is_owner,
                'join_at' => $userRelation->join_at->format('d M Y H:i'),
            ];
        });

        return Inertia::render('Admin/UserRelations/Index', [
            'userRelations' => $userRelations,
            'filters' => $request->only(['relation_id', 'user_id', 'is_owner']),
        ]);
    }

    /**
     * Get members of a specific relation
     */
    public function members(Relation $relation): Response
    {
        /** @var User $user */
        $user = Auth::user();

        // Cek apakah user sudah join relation ini
        if (!$user->hasJoinedRelation($relation)) {
            abort(403, 'Anda belum bergabung di relation ini.');
        }

        $members = $relation->users()
            ->withPivot('is_owner', 'join_at')
            ->orderByPivot('is_owner', 'desc')
            ->orderByPivot('join_at', 'asc')
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'is_owner' => $member->pivot->is_owner,
                    'join_at' => $member->pivot->join_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('Relations/Members', [
            'relation' => [
                'id' => $relation->id,
                'kode' => $relation->kode,
                'nama' => $relation->nama,
            ],
            'members' => $members,
            'is_owner' => $user->isOwnerOf($relation),
        ]);
    }

    /**
     * Kick member from relation (owner only)
     */
    public function kick(Relation $relation, User $user): RedirectResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        // Cek apakah current user adalah owner
        if (!$currentUser->isOwnerOf($relation)) {
            abort(403, 'Hanya owner yang bisa kick member.');
        }

        // Tidak bisa kick diri sendiri
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'Tidak bisa kick diri sendiri!');
        }

        // Tidak bisa kick owner lain
        if ($user->isOwnerOf($relation)) {
            return back()->with('error', 'Tidak bisa kick owner!');
        }

        // Cek apakah user tergabung di relation
        if (!$user->hasJoinedRelation($relation)) {
            return back()->with('error', 'User tidak tergabung di relation ini!');
        }

        $userName = $user->name;
        $user->leaveRelation($relation);

        return back()->with('success', "{$userName} berhasil dikeluarkan dari relation!");
    }

    /**
     * Promote member to owner (owner only)
     */
    public function promote(Relation $relation, User $user): RedirectResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        // Cek apakah current user adalah owner
        if (!$currentUser->isOwnerOf($relation)) {
            abort(403, 'Hanya owner yang bisa promote member.');
        }

        // Cek apakah user sudah owner
        if ($user->isOwnerOf($relation)) {
            return back()->with('error', 'User sudah menjadi owner!');
        }

        // Cek apakah user tergabung di relation
        if (!$user->hasJoinedRelation($relation)) {
            return back()->with('error', 'User tidak tergabung di relation ini!');
        }

        // Update pivot
        $user->relations()->updateExistingPivot($relation->id, [
            'is_owner' => true,
        ]);

        return back()->with('success', "{$user->name} berhasil dipromote menjadi owner!");
    }

    /**
     * Demote owner to member (owner only)
     */
    public function demote(Relation $relation, User $user): RedirectResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        // Cek apakah current user adalah owner
        if (!$currentUser->isOwnerOf($relation)) {
            abort(403, 'Hanya owner yang bisa demote owner lain.');
        }

        // Tidak bisa demote diri sendiri
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'Tidak bisa demote diri sendiri!');
        }

        // Cek apakah user adalah owner
        if (!$user->isOwnerOf($relation)) {
            return back()->with('error', 'User bukan owner!');
        }

        // Update pivot
        $user->relations()->updateExistingPivot($relation->id, [
            'is_owner' => false,
        ]);

        return back()->with('success', "{$user->name} berhasil didemote menjadi member!");
    }

    /**
     * Get user's relations (API endpoint)
     */
    public function userRelations(Request $request): \Illuminate\Http\JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $relations = $user->relations()
            ->withPivot('is_owner', 'join_at')
            ->withCount('users')
            ->get()
            ->map(function ($relation) {
                return [
                    'id' => $relation->id,
                    'kode' => $relation->kode,
                    'nama' => $relation->nama,
                    'deskripsi' => $relation->deskripsi,
                    'users_count' => $relation->users_count,
                    'is_owner' => $relation->pivot->is_owner,
                    'join_at' => $relation->pivot->join_at->format('d M Y H:i'),
                ];
            });

        return response()->json([
            'relations' => $relations,
        ]);
    }

    /**
     * Get statistics (admin only)
     */
    public function statistics(): Response
    {
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $stats = [
            'total_relations' => Relation::count(),
            'total_users' => User::count(),
            'total_connections' => UserRelation::count(),
            'total_owners' => UserRelation::where('is_owner', true)->count(),
            'total_members' => UserRelation::where('is_owner', false)->count(),
            'avg_members_per_relation' => round(UserRelation::count() / max(Relation::count(), 1), 2),
            'most_popular_relations' => Relation::withCount('users')
                ->orderBy('users_count', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($relation) {
                    return [
                        'id' => $relation->id,
                        'nama' => $relation->nama,
                        'kode' => $relation->kode,
                        'users_count' => $relation->users_count,
                    ];
                }),
            'most_active_users' => User::withCount('relations')
                ->orderBy('relations_count', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'relations_count' => $user->relations_count,
                    ];
                }),
        ];

        return Inertia::render('Admin/Statistics', [
            'statistics' => $stats,
        ]);
    }
}
