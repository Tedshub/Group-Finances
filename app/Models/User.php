<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property-read BelongsToMany $relations
 * @property-read BelongsToMany $ownedRelations
 * @property-read BelongsToMany $memberRelations
 * @method bool isAdmin()
 * @method bool isGuest()
 * @method bool makeAdmin()
 * @method bool makeGuest()
 * @method bool hasJoinedRelation(Relation|int $relation)
 * @method bool isOwnerOf(Relation|int $relation)
 * @method int leaveRelation(Relation|int $relation)
 * @method void joinRelation(Relation|int $relation)
 * @method Relation createRelation(array $data)
 * @method int updateRelationPivot(Relation|int $relation, array $attributes)
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ========== Constants untuk Role ==========
    const ROLE_ADMIN = 'admin';
    const ROLE_GUEST = 'guest';

    // ========== Relationship dengan Relation ==========

    /**
     * Semua relations yang user ikuti (sebagai owner atau member)
     *
     * @return BelongsToMany
     */
    public function relations(): BelongsToMany
    {
        return $this->belongsToMany(
            Relation::class,
            'user_relation',
            'user_id',
            'relation_id'
        )
        ->using(UserRelation::class)
        ->withPivot('is_owner', 'join_at')
        ->withTimestamps()
        ->orderByPivot('is_owner', 'desc')
        ->orderByPivot('join_at', 'asc');
    }

    /**
     * Relations dimana user adalah owner
     *
     * @return BelongsToMany
     */
    public function ownedRelations(): BelongsToMany
    {
        return $this->relations()->wherePivot('is_owner', true);
    }

    /**
     * Relations dimana user adalah member (bukan owner)
     *
     * @return BelongsToMany
     */
    public function memberRelations(): BelongsToMany
    {
        return $this->relations()->wherePivot('is_owner', false);
    }

    // ========== Role Methods ==========

    /**
     * Cek apakah user adalah admin
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Cek apakah user adalah guest
     *
     * @return bool
     */
    public function isGuest(): bool
    {
        return $this->role === self::ROLE_GUEST;
    }

    /**
     * Set role menjadi admin
     *
     * @return bool
     */
    public function makeAdmin(): bool
    {
        return $this->update(['role' => self::ROLE_ADMIN]);
    }

    /**
     * Set role menjadi guest
     *
     * @return bool
     */
    public function makeGuest(): bool
    {
        return $this->update(['role' => self::ROLE_GUEST]);
    }

    // ========== Helper Methods ==========

    /**
     * Cek apakah user sudah join relation tertentu
     *
     * @param Relation|int $relation
     * @return bool
     */
    public function hasJoinedRelation($relation): bool
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        return $this->relations()
            ->where('relations.id', $relationId)
            ->exists();
    }

    /**
     * Cek apakah user adalah owner dari relation tertentu
     *
     * @param Relation|int $relation
     * @return bool
     */
    public function isOwnerOf($relation): bool
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        return $this->relations()
            ->where('relations.id', $relationId)
            ->wherePivot('is_owner', true)
            ->exists();
    }

    /**
     * Keluar dari relation (leave)
     *
     * @param Relation|int $relation
     * @return int
     */
    public function leaveRelation($relation): int
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        return $this->relations()->detach($relationId);
    }

    /**
     * Join relation sebagai member
     *
     * @param Relation|int $relation
     * @return void
     */
    public function joinRelation($relation): void
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        $this->relations()->attach($relationId, [
            'is_owner' => false,
            'join_at' => now(),
        ]);
    }

    /**
     * Buat relation baru dan auto-join sebagai owner
     *
     * @param array $data
     * @return Relation
     */
    public function createRelation(array $data): Relation
    {
        $relation = Relation::create([
            'kode' => $data['kode'] ?? Relation::generateUniqueCode(),
            'nama' => $data['nama'],
            'deskripsi' => $data['deskripsi'] ?? null,
            'creator_id' => $this->id,
        ]);

        // Auto-join sebagai owner
        $this->relations()->attach($relation->id, [
            'is_owner' => true,
            'join_at' => now(),
        ]);

        return $relation;
    }

    /**
     * Update pivot relation (untuk promote/demote)
     *
     * @param Relation|int $relation
     * @param array $attributes
     * @return int
     */
    public function updateRelationPivot($relation, array $attributes): int
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        return $this->relations()->updateExistingPivot($relationId, $attributes);
    }

    // ========== Scopes ==========

    /**
     * Scope untuk admin users
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    /**
     * Scope untuk guest users
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeGuests($query)
    {
        return $query->where('role', self::ROLE_GUEST);
    }

    /**
     * Scope untuk users yang aktif (punya relations)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->has('relations');
    }

    /**
     * Scope untuk users yang tidak punya relations
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInactive($query)
    {
        return $query->doesntHave('relations');
    }

    // Tambahkan method ini di class User (setelah method updateRelationPivot)

    /**
     * Keluarkan user lain dari relation (hanya untuk owner)
     *
     * @param Relation|int $relation
     * @param User|int $targetUser
     * @return int
     */
    public function kickUserFromRelation($relation, $targetUser): int
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;
        $targetUserId = $targetUser instanceof User ? $targetUser->id : $targetUser;

        // Cek apakah current user adalah owner
        if (!$this->isOwnerOf($relationId)) {
            throw new \Exception('Hanya owner yang dapat mengeluarkan member.');
        }

        // Cek apakah target user adalah member (bukan owner)
        $relationModel = $relation instanceof Relation ? $relation : Relation::findOrFail($relationId);
        $targetUserPivot = $relationModel->users()
            ->where('users.id', $targetUserId)
            ->first();

        if (!$targetUserPivot) {
            throw new \Exception('User tidak ditemukan di relation ini.');
        }

        if ($targetUserPivot->pivot->is_owner) {
            throw new \Exception('Tidak dapat mengeluarkan owner dari relation.');
        }

        // Keluarkan user
        return $relationModel->users()->detach($targetUserId);
    }

    // Tambahkan di dalam class User, setelah method-method yang sudah ada

    /**
     * Join requests yang dibuat user
     */
    public function joinRequests(): HasMany
    {
        return $this->hasMany(RelationJoinRequest::class, 'user_id');
    }

    /**
     * Pending join requests
     */
    public function pendingJoinRequests(): HasMany
    {
        return $this->joinRequests()->where('status', RelationJoinRequest::STATUS_PENDING);
    }

    /**
     * Request join ke relation (butuh approval)
     *
     * @param Relation|int $relation
     * @param string|null $message
     * @return RelationJoinRequest
     */
    public function requestJoinRelation($relation, ?string $message = null): RelationJoinRequest
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        // Cek apakah sudah join
        if ($this->hasJoinedRelation($relationId)) {
            throw new \Exception('Anda sudah bergabung di relation ini.');
        }

        // Cek apakah sudah punya pending request
        $pendingRequest = RelationJoinRequest::where('user_id', $this->id)
            ->where('relation_id', $relationId)
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->first();

        if ($pendingRequest) {
            throw new \Exception('Anda sudah memiliki request yang pending untuk relation ini.');
        }

        // SOLUSI: Hapus request lama yang rejected/approved
        RelationJoinRequest::where('user_id', $this->id)
            ->where('relation_id', $relationId)
            ->whereIn('status', [RelationJoinRequest::STATUS_REJECTED, RelationJoinRequest::STATUS_APPROVED])
            ->delete();

        // Buat request baru
        return RelationJoinRequest::create([
            'user_id' => $this->id,
            'relation_id' => $relationId,
            'message' => $message,
            'status' => RelationJoinRequest::STATUS_PENDING,
        ]);
    }

    /**
     * Cek apakah user punya pending request untuk relation
     */
    public function hasPendingRequestFor($relation): bool
    {
        $relationId = $relation instanceof Relation ? $relation->id : $relation;

        return $this->joinRequests()
            ->where('relation_id', $relationId)
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->exists();
    }
}
