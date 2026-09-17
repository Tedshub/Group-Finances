<?php
// app/Http/Controllers/SettingsController.php
namespace App\Http\Controllers;

use App\Models\Relation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Halaman utama pengaturan (profil akun).
     */
    public function index()
    {
        $user = Auth::user()->load([
            'relations' => fn ($q) => $q->with(['users:id,name'])->withCount('users')
        ]);

        return Inertia::render('SettingsPage', [
            'user'      => $this->formatUser($user),
            'relations' => $user->relations->map(fn ($r) => [
                'id'           => $r->id,
                'nama'         => $r->nama,
                'kode'         => $r->kode,
                'is_owner'     => $r->isOwnedBy($user->id),
                'member_count' => $r->users_count,
                'settings'     => $r->settings ?? [],
            ]),
        ]);
    }

    /**
     * Update profil user (nama, email, avatar).
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'   => 'required|string|max:100',
            'email'  => 'required|email|unique:users,email,' . $user->id,
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            // Hapus avatar lama dari private storage jika ada
            if ($user->avatar && Storage::disk('local')->exists($user->avatar)) {
                Storage::disk('local')->delete($user->avatar);
            }
            // Simpan ke storage/app/private/profile_photos/
            $validated['avatar'] = $request->file('avatar')->store('profile_photos', 'local');
        }

        $user->update(array_filter($validated, fn ($v) => $v !== null));

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Update password user.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = Auth::user();

        abort_unless(Hash::check($validated['current_password'], $user->password), 422, 'Password saat ini salah.');

        $user->update(['password' => Hash::make($validated['password'])]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }

    /**
     * Pengaturan relasi grup (nama, deskripsi, hak akses anggota).
     */
    public function showRelationSettings(Relation $relation)
    {
        $this->authorizeOwner($relation);

        $members = $relation->users()->get()->map(fn ($u) => [
            'id'       => $u->id,
            'name'     => $u->name,
            'email'    => $u->email,
            'is_owner' => (bool) $u->pivot->is_owner,
            'join_at'  => $u->pivot->join_at,
        ]);

        return Inertia::render('RelationSettingsPage', [
            'relation' => [
                'id'          => $relation->id,
                'nama'        => $relation->nama,
                'kode'        => $relation->kode,
                'deskripsi'   => $relation->deskripsi,
                'settings'    => $relation->settings ?? [],
            ],
            'members'  => $members,
        ]);
    }

    /**
     * Update nama & deskripsi relasi.
     */
    public function updateRelation(Request $request, Relation $relation)
    {
        $this->authorizeOwner($relation);

        $validated = $request->validate([
            'nama'      => 'required|string|max:100',
            'deskripsi' => 'nullable|string|max:500',
        ]);

        $relation->update($validated);

        return back()->with('success', 'Relasi berhasil diperbarui.');
    }

    /**
     * Update pengaturan relasi (JSON settings: hak akses, dll).
     */
    public function updateRelationSettings(Request $request, Relation $relation)
    {
        $this->authorizeOwner($relation);

        $validated = $request->validate([
            'member_can_add_category' => 'boolean',
            'member_can_add_budget'   => 'boolean',
            'notification_new_trx'    => 'boolean',
            'notification_budget_warn'=> 'boolean',
        ]);

        $currentSettings = $relation->settings ?? [];
        $relation->update([
            'settings' => array_merge($currentSettings, $validated),
        ]);

        return back()->with('success', 'Pengaturan relasi berhasil diperbarui.');
    }

    /**
     * Regenerate kode undangan relasi.
     */
    public function regenerateCode(Relation $relation)
    {
        $this->authorizeOwner($relation);

        $newCode = Relation::generateUniqueCode();
        $relation->update(['kode' => $newCode]);

        return back()->with('success', "Kode undangan baru: {$newCode}");
    }

    /**
     * Update preferensi notifikasi anggota (per user per relasi).
     */
    public function updateNotificationPrefs(Request $request, Relation $relation)
    {
        abort_unless($relation->hasUser(Auth::id()), 403);

        $validated = $request->validate([
            'new_transaction' => 'boolean',
            'budget_warning'  => 'boolean',
        ]);

        // Update pivot table
        $relation->users()->updateExistingPivot(Auth::id(), [
            'notification_prefs' => json_encode($validated),
        ]);

        return back()->with('success', 'Preferensi notifikasi diperbarui.');
    }

    /**
     * Tampilkan foto avatar pengguna dari private storage.
     */
    public function avatar(User $user)
    {
        if (!$user->avatar || !Storage::disk('local')->exists($user->avatar)) {
            abort(404, 'Avatar tidak ditemukan.');
        }

        return Storage::disk('local')->response($user->avatar);
    }

    // ========== Private Helpers ==========

    private function formatUser(User $user): array
    {
        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'avatar'     => $user->avatar_url,
            'created_at' => $user->created_at->toDateString(),
        ];
    }

    private function authorizeOwner(Relation $relation): void
    {
        abort_unless($relation->isOwnedBy(Auth::id()), 403, 'Hanya owner yang dapat mengakses pengaturan relasi.');
    }
}
