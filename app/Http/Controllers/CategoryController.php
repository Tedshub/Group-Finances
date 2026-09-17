<?php
// app/Http/Controllers/CategoryController.php
namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Ambil daftar kategori yang tersedia untuk sebuah relasi (JSON).
     * Global + custom milik relasi.
     */
    public function index(Request $request, Relation $relation)
    {
        $this->authorizeRelationMember($relation);

        $type = $request->get('type'); // 'pemasukan' | 'pengeluaran' | null

        $categories = Category::active()
            ->where(function ($q) use ($relation) {
                $q->whereNull('relation_id')
                  ->orWhere('relation_id', $relation->id);
            });

        if ($type) {
            $categories->forType($type);
        }

        $categories = $categories->orderByRaw('relation_id IS NULL ASC, name ASC')->get();

        return response()->json($categories);
    }

    /**
     * Buat kategori custom untuk grup.
     */
    public function store(Request $request, Relation $relation)
    {
        $this->authorizeRelationOwnerOrSetting($relation);

        $validated = $request->validate([
            'name'  => 'required|string|max:100',
            'icon'  => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'type'  => 'required|in:pemasukan,pengeluaran,keduanya',
        ]);

        $category = Category::create(array_merge($validated, [
            'relation_id' => $relation->id,
            'is_active'   => true,
        ]));

        return response()->json([
            'message'  => 'Kategori berhasil dibuat.',
            'category' => $category,
        ], 201);
    }

    /**
     * Update kategori custom milik grup.
     */
    public function update(Request $request, Relation $relation, Category $category)
    {
        $this->authorizeRelationOwnerOrSetting($relation);
        abort_if($category->relation_id !== $relation->id, 403, 'Kategori tidak ditemukan dalam relasi ini.');

        $validated = $request->validate([
            'name'      => 'sometimes|required|string|max:100',
            'icon'      => 'nullable|string|max:50',
            'color'     => 'nullable|string|max:20',
            'type'      => 'sometimes|required|in:pemasukan,pengeluaran,keduanya',
            'is_active' => 'sometimes|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'message'  => 'Kategori berhasil diperbarui.',
            'category' => $category->fresh(),
        ]);
    }

    /**
     * Nonaktifkan/hapus kategori custom.
     */
    public function destroy(Relation $relation, Category $category)
    {
        $this->authorizeRelationOwner($relation);
        abort_if($category->relation_id !== $relation->id, 403, 'Kategori tidak ditemukan dalam relasi ini.');
        abort_if($category->isGlobal(), 403, 'Kategori global tidak dapat dihapus.');

        // Soft-delete: nonaktifkan
        $category->update(['is_active' => false]);

        return response()->json(['message' => 'Kategori berhasil dinonaktifkan.']);
    }

    // ========== Private Helpers ==========

    private function authorizeRelationMember(Relation $relation): void
    {
        abort_unless($relation->hasUser(Auth::id()), 403, 'Anda bukan anggota relasi ini.');
    }

    private function authorizeRelationOwner(Relation $relation): void
    {
        abort_unless($relation->isOwnedBy(Auth::id()), 403, 'Hanya owner yang dapat melakukan ini.');
    }

    private function authorizeRelationOwnerOrSetting(Relation $relation): void
    {
        $this->authorizeRelationMember($relation);

        $settings = $relation->settings ?? [];
        $memberCanAdd = $settings['member_can_add_category'] ?? false;

        if (!$memberCanAdd) {
            $this->authorizeRelationOwner($relation);
        }
    }
}
