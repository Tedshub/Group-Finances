<?php
// app/Models/RelationJoinRequest.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RelationJoinRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'relation_id',
        'status',
        'message',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    // Constants untuk status
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    // ========== Relationships ==========

    /**
     * User yang request join
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relation yang di-request
     */
    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'relation_id');
    }

    /**
     * Owner yang review request
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // ========== Status Methods ==========

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

/**
 * Approve request dan auto-join user ke relation
 */
public function approve(User $reviewer): bool
{
    if (!$this->isPending()) {
        throw new \Exception('Request sudah di-review sebelumnya.');
    }

    // Cek apakah user sudah join menggunakan relationship
    $alreadyJoined = $this->user->relations()
        ->where('relations.id', $this->relation_id)
        ->exists();

    if ($alreadyJoined) {
        throw new \Exception('User sudah bergabung di relation ini.');
    }

    // Update status request
    $this->update([
        'status' => self::STATUS_APPROVED,
        'reviewed_by' => $reviewer->id,
        'reviewed_at' => now(),
    ]);

    // Join user ke relation menggunakan attach
    $this->user->relations()->attach($this->relation_id, [
        'is_owner' => false,
        'join_at' => now(),
    ]);

    return true;
}

/**
 * Reject request
 */
public function reject(User $reviewer): bool
{
    if (!$this->isPending()) {
        throw new \Exception('Request sudah di-review sebelumnya.');
    }

    $this->update([
        'status' => self::STATUS_REJECTED,
        'reviewed_by' => $reviewer->id,
        'reviewed_at' => now(),
    ]);

    // Hapus request yang sudah direject
    $this->delete();

    return true;
}

    // ========== Scopes ==========

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    public function scopeForRelation($query, $relationId)
    {
        return $query->where('relation_id', $relationId);
    }
}
