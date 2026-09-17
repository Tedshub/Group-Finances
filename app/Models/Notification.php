<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    // Tipe notifikasi
    const TYPE_TRANSACTION   = 'transaction';
    const TYPE_SAVINGS       = 'savings';
    const TYPE_SAVINGS_GOAL  = 'savings_goal';
    const TYPE_JOIN_REQUEST  = 'join_request';
    const TYPE_JOIN_APPROVED = 'join_approved';
    const TYPE_JOIN_REJECTED = 'join_rejected';
    const TYPE_CONTRIBUTION  = 'contribution';

    protected $fillable = [
        'user_id',
        'actor_id',
        'relation_id',
        'type',
        'title',
        'body',
        'url',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class);
    }

    // ── Scopes ────────────────────────────────────────────────────────────────

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->update(['read_at' => now()]);
        }
    }
}
