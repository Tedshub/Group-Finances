<?php
// app/Http/Controllers/SavingsController.php
namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Relation;
use App\Models\SavingsGoal;
use App\Models\SavingsContribution;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SavingsController extends Controller
{
    /**
     * Halaman utama tabungan untuk relasi tertentu.
     */
    public function index(Relation $relation)
    {
        $this->authorizeMember($relation);

        $user = Auth::user();

        // Tabungan grup
        $groupGoals = SavingsGoal::forRelation($relation->id)
            ->group()
            ->with(['creator:id,name', 'contributions' => function ($q) {
                $q->with('user:id,name')->orderBy('date', 'desc')->limit(5);
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($g) => $this->formatGoal($g));

        // Tabungan pribadi milik user ini
        $personalGoals = SavingsGoal::forRelation($relation->id)
            ->personal($user->id)
            ->with(['contributions' => function ($q) {
                $q->orderBy('date', 'desc')->limit(5);
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($g) => $this->formatGoal($g));

        return Inertia::render('SavingsPage', [
            'relation'      => $relation->only(['id', 'nama', 'kode']),
            'relations'     => $user->relations()->select('relations.id', 'relations.nama', 'relations.kode')->get(),
            'groupGoals'    => $groupGoals,
            'personalGoals' => $personalGoals,
            'isOwner'       => $relation->isOwnedBy($user->id),
        ]);
    }

    /**
     * Buat target tabungan baru.
     */
    public function store(Request $request, Relation $relation)
    {
        $this->authorizeMember($relation);

        $validated = $request->validate([
            'title'         => 'required|string|max:150',
            'description'   => 'nullable|string|max:500',
            'target_amount' => 'required|numeric|min:1000',
            'deadline'      => 'nullable|date|after:today',
            'icon'          => 'nullable|string|max:50',
            'color'         => 'nullable|string|max:20',
            'scope'         => 'required|in:group,personal',
        ]);

        $goal = SavingsGoal::create(array_merge($validated, [
            'relation_id'    => $relation->id,
            'created_by'     => Auth::id(),
            'current_amount' => 0,
            'status'         => SavingsGoal::STATUS_ACTIVE,
        ]));

        if ($goal->scope === 'group') {
            NotificationService::sendToGroupMembers(
                $relation,
                Auth::id(),
                Notification::TYPE_SAVINGS,
                "Target Tabungan Baru: {$goal->title}",
                Auth::user()->name . " membuat target tabungan grup \"{$goal->title}\" di {$relation->nama}.",
                route('savings.index', $relation, false)
            );
        }

        return back()->with('success', 'Target tabungan berhasil dibuat.');
    }

    /**
     * Update target tabungan.
     */
    public function update(Request $request, Relation $relation, SavingsGoal $goal)
    {
        $this->authorizeGoalOwnerOrRelationOwner($relation, $goal);

        $validated = $request->validate([
            'title'         => 'sometimes|required|string|max:150',
            'description'   => 'nullable|string|max:500',
            'target_amount' => 'sometimes|required|numeric|min:1000',
            'deadline'      => 'nullable|date',
            'icon'          => 'nullable|string|max:50',
            'color'         => 'nullable|string|max:20',
            'status'        => 'sometimes|in:active,cancelled',
        ]);

        $goal->update($validated);

        return back()->with('success', 'Target tabungan berhasil diperbarui.');
    }

    /**
     * Hapus target tabungan.
     */
    public function destroy(Relation $relation, SavingsGoal $goal)
    {
        $this->authorizeGoalOwnerOrRelationOwner($relation, $goal);

        $goal->delete();

        return back()->with('success', 'Target tabungan berhasil dihapus.');
    }

    /**
     * Setor dana ke target tabungan.
     */
    public function contribute(Request $request, Relation $relation, SavingsGoal $goal)
    {
        $this->authorizeMember($relation);
        abort_if($goal->status !== SavingsGoal::STATUS_ACTIVE, 422, 'Target tabungan sudah tidak aktif.');

        $validated = $request->validate([
            'amount' => 'required|numeric|min:100',
            'note'   => 'nullable|string|max:255',
            'date'   => 'required|date|before_or_equal:today',
        ]);

        SavingsContribution::create([
            'savings_goal_id' => $goal->id,
            'user_id'         => Auth::id(),
            'user_name'       => Auth::user()->name,
            'amount'          => $validated['amount'],
            'note'            => $validated['note'] ?? null,
            'date'            => $validated['date'],
        ]);

        if ($goal->scope === 'group') {
            NotificationService::sendToGroupMembers(
                $relation,
                Auth::id(),
                Notification::TYPE_SAVINGS,
                "Setoran Tabungan: {$goal->title}",
                Auth::user()->name . " menyetor Rp " . number_format($validated['amount'], 0, ',', '.') . " ke \"{$goal->title}\".",
                route('savings.index', $relation, false)
            );
        }

        return back()->with('success', 'Setoran berhasil dicatat.');
    }

    /**
     * Hapus kontribusi.
     */
    public function deleteContribution(Relation $relation, SavingsGoal $goal, SavingsContribution $contribution)
    {
        abort_if($contribution->user_id !== Auth::id() && !$relation->isOwnedBy(Auth::id()), 403);

        $contribution->delete();

        return back()->with('success', 'Kontribusi berhasil dihapus.');
    }

    /**
     * Detail sebuah savings goal (JSON untuk modal).
     */
    public function show(Relation $relation, SavingsGoal $goal)
    {
        $this->authorizeMember($relation);

        $goal->load(['creator:id,name', 'contributions' => function ($q) {
            $q->with('user:id,name')->orderBy('date', 'desc');
        }]);

        return response()->json($this->formatGoal($goal, true));
    }

    // ========== Private Helpers ==========

    private function formatGoal(SavingsGoal $goal, bool $withContributions = false): array
    {
        $data = [
            'id'               => $goal->id,
            'title'            => $goal->title,
            'description'      => $goal->description,
            'target_amount'    => (float) $goal->target_amount,
            'current_amount'   => (float) $goal->current_amount,
            'progress_percent' => $goal->progress_percent_attribute ?? $goal->getProgressPercentAttribute(),
            'remaining_amount' => $goal->remaining_amount_attribute ?? $goal->getRemainingAmountAttribute(),
            'days_remaining'   => $goal->days_remaining_attribute ?? $goal->getDaysRemainingAttribute(),
            'deadline'         => $goal->deadline?->format('Y-m-d'),
            'icon'             => $goal->icon,
            'color'            => $goal->color,
            'scope'            => $goal->scope,
            'status'           => $goal->status,
            'completed_at'     => $goal->completed_at?->toISOString(),
            'created_at'       => $goal->created_at->toISOString(),
            'creator'          => $goal->creator ? ['id' => $goal->creator->id, 'name' => $goal->creator->name] : null,
        ];

        if ($withContributions) {
            $data['contributions'] = $goal->contributions->map(fn ($c) => [
                'id'        => $c->id,
                'user_id'   => $c->user_id,
                'user_name' => $c->user_name,
                'amount'    => (float) $c->amount,
                'note'      => $c->note,
                'date'      => $c->date->format('Y-m-d'),
            ])->values();
        } else {
            // Hanya ambil 5 kontribusi terbaru untuk listing
            $data['recent_contributions'] = $goal->contributions
                ? $goal->contributions->take(5)->map(fn ($c) => [
                    'user_name' => $c->user_name,
                    'amount'    => (float) $c->amount,
                    'date'      => $c->date->format('Y-m-d'),
                ])->values()
                : [];
        }

        return $data;
    }

    private function authorizeMember(Relation $relation): void
    {
        abort_unless($relation->hasUser(Auth::id()), 403, 'Anda bukan anggota relasi ini.');
    }

    private function authorizeGoalOwnerOrRelationOwner(Relation $relation, SavingsGoal $goal): void
    {
        $this->authorizeMember($relation);
        abort_if(
            $goal->created_by !== Auth::id() && !$relation->isOwnedBy(Auth::id()),
            403,
            'Anda tidak memiliki akses untuk mengelola target tabungan ini.'
        );
    }
}
