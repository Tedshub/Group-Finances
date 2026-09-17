<?php
// app/Http/Controllers/BudgetController.php
namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BudgetController extends Controller
{
    /**
     * Halaman penganggaran untuk relasi & periode tertentu.
     */
    public function index(Request $request, Relation $relation)
    {
        $this->authorizeMember($relation);

        $month = (int) $request->get('month', now()->month);
        $year  = (int) $request->get('year',  now()->year);

        // Anggaran + realisasi
        $budgets = Budget::withRealisasi($relation->id, $month, $year);

        // Total
        $totalBudget    = $budgets->sum('amount');
        $totalRealisasi = $budgets->sum('realisasi_amount');

        // Kategori yang belum dianggarkan (untuk form tambah)
        $budgetedCategoryIds = $budgets->pluck('category_id');
        $availableCategories = Category::active()
            ->forType(Category::TYPE_PENGELUARAN)
            ->where(function ($q) use ($relation) {
                $q->whereNull('relation_id')->orWhere('relation_id', $relation->id);
            })
            ->whereNotIn('id', $budgetedCategoryIds)
            ->get(['id', 'name', 'icon', 'color']);

        return Inertia::render('BudgetingPage', [
            'relation'            => $relation->only(['id', 'nama', 'kode']),
            'relations'           => Auth::user()->relations()->select('relations.id', 'relations.nama', 'relations.kode')->get(),
            'budgets'             => $budgets->values(),
            'availableCategories' => $availableCategories,
            'period'              => compact('month', 'year'),
            'summary'             => [
                'total_budget'    => (float) $totalBudget,
                'total_realisasi' => (float) $totalRealisasi,
                'total_sisa'      => (float) ($totalBudget - $totalRealisasi),
                'usage_percent'   => $totalBudget > 0 ? round(($totalRealisasi / $totalBudget) * 100, 1) : 0,
            ],
            'isOwner' => $relation->isOwnedBy(Auth::id()),
        ]);
    }

    /**
     * Buat anggaran baru untuk kategori & periode tertentu.
     */
    public function store(Request $request, Relation $relation)
    {
        $this->authorizeOwner($relation);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount'      => 'required|numeric|min:0',
            'month'       => 'required|integer|between:1,12',
            'year'        => 'required|integer|min:2020|max:2099',
        ]);

        // Pastikan kategori memang untuk pengeluaran
        $category = Category::findOrFail($validated['category_id']);
        abort_if(
            $category->type === Category::TYPE_PEMASUKAN,
            422,
            'Kategori pemasukan tidak dapat dianggarkan.'
        );

        $budget = Budget::updateOrCreate(
            [
                'relation_id' => $relation->id,
                'category_id' => $validated['category_id'],
                'month'       => $validated['month'],
                'year'        => $validated['year'],
            ],
            [
                'amount'     => $validated['amount'],
                'created_by' => Auth::id(),
            ]
        );

        return back()->with('success', 'Anggaran berhasil disimpan.');
    }

    /**
     * Update plafon anggaran.
     */
    public function update(Request $request, Relation $relation, Budget $budget)
    {
        $this->authorizeOwner($relation);
        abort_if($budget->relation_id !== $relation->id, 403);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $budget->update($validated);

        return back()->with('success', 'Anggaran berhasil diperbarui.');
    }

    /**
     * Hapus anggaran.
     */
    public function destroy(Relation $relation, Budget $budget)
    {
        $this->authorizeOwner($relation);
        abort_if($budget->relation_id !== $relation->id, 403);

        $budget->delete();

        return back()->with('success', 'Anggaran berhasil dihapus.');
    }

    /**
     * API: ambil data anggaran per periode (JSON).
     */
    public function apiData(Request $request, Relation $relation)
    {
        $this->authorizeMember($relation);

        $month = (int) $request->get('month', now()->month);
        $year  = (int) $request->get('year',  now()->year);

        $budgets = Budget::withRealisasi($relation->id, $month, $year);

        return response()->json([
            'budgets' => $budgets->values(),
            'summary' => [
                'total_budget'    => (float) $budgets->sum('amount'),
                'total_realisasi' => (float) $budgets->sum('realisasi_amount'),
            ],
        ]);
    }

    // ========== Private Helpers ==========

    private function authorizeMember(Relation $relation): void
    {
        abort_unless($relation->hasUser(Auth::id()), 403, 'Anda bukan anggota relasi ini.');
    }

    private function authorizeOwner(Relation $relation): void
    {
        $this->authorizeMember($relation);
        abort_unless($relation->isOwnedBy(Auth::id()), 403, 'Hanya owner yang dapat mengelola anggaran.');
    }
}
