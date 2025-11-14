<?php
// app/Models/Relation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Relation extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'id_creator',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== Relationships ==========

    /**
     * User yang MEMBUAT relation ini (creator)
     *
     * @return BelongsTo
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_creator');
    }

    /**
     * Semua users yang BERGABUNG di relation ini (owner + member)
     * Many-to-Many relationship via user_relation table
     *
     * @return BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_relation',    // nama pivot table
            'relation_id',      // foreign key di pivot table untuk Relation
            'user_id'           // foreign key di pivot table untuk User
        )
        ->withPivot('is_owner', 'join_at')
        ->withTimestamps()
        ->orderByPivot('is_owner', 'desc')  // owner dulu, baru member
        ->orderByPivot('join_at', 'asc');   // sort by join date (terlama dulu)
    }

    /**
     * Users yang adalah OWNER dari relation ini
     *
     * @return BelongsToMany
     */
    public function owners(): BelongsToMany
    {
        return $this->users()->wherePivot('is_owner', true);
    }

    /**
     * Users yang adalah MEMBER (bukan owner) dari relation ini
     *
     * @return BelongsToMany
     */
    public function members(): BelongsToMany
    {
        return $this->users()->wherePivot('is_owner', false);
    }

    // ========== Helper Methods ==========

    /**
     * Generate kode unik untuk relation
     *
     * @param int $length
     * @return string
     */
    public static function generateUniqueCode(int $length = 8): string
    {
        do {
            $kode = strtoupper(Str::random($length));
        } while (self::where('kode', $kode)->exists());

        return $kode;
    }

    /**
     * Hitung total member (termasuk owner)
     *
     * @return int
     */
    public function getTotalMembersAttribute(): int
    {
        return $this->users()->count();
    }

    /**
     * Cek apakah user tertentu adalah owner
     *
     * @param int|User $user
     * @return bool
     */
    public function isOwnedBy($user): bool
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $this->users()
            ->where('users.id', $userId)
            ->wherePivot('is_owner', true)
            ->exists();
    }

    /**
     * Cek apakah user sudah join
     *
     * @param int|User $user
     * @return bool
     */
    public function hasUser($user): bool
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $this->users()->where('users.id', $userId)->exists();
    }

    /**
     * Boot method untuk auto-generate kode
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate kode saat creating (jika belum ada)
        static::creating(function ($relation) {
            if (empty($relation->kode)) {
                $relation->kode = self::generateUniqueCode();
            }
        });
    }
}
