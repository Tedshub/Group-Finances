<?php
// app/Models/MessageRead.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageRead extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'message_id',
        'user_id',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->read_at) {
                $model->read_at = now();
            }
        });
    }

    // ========== Relationships ==========

    /**
     * Pesan yang dibaca
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'message_id');
    }

    /**
     * User yang membaca pesan
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ========== Scopes ==========

    public function scopeForMessage($query, $messageId)
    {
        return $query->where('message_id', $messageId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeReadToday($query)
    {
        return $query->whereDate('read_at', today());
    }

    public function scopeReadBetween($query, $start, $end)
    {
        return $query->whereBetween('read_at', [$start, $end]);
    }

    // ========== Static Methods ==========

    /**
     * Mark multiple messages as read sekaligus
     */
    public static function markMultipleAsRead(array $messageIds, User $user): void
    {
        foreach ($messageIds as $messageId) {
            self::firstOrCreate([
                'message_id' => $messageId,
                'user_id' => $user->id,
            ]);
        }
    }

    /**
     * Mark semua pesan dalam relation sebagai sudah dibaca
     */
    public static function markAllAsReadInRelation($relationId, User $user): void
    {
        $unreadMessages = Message::forRelation($relationId)
            ->unreadBy($user->id)
            ->pluck('id');

        foreach ($unreadMessages as $messageId) {
            self::firstOrCreate([
                'message_id' => $messageId,
                'user_id' => $user->id,
            ]);
        }
    }

    /**
     * Get unread count untuk user di relation tertentu
     */
    public static function getUnreadCount($relationId, $userId): int
    {
        return Message::forRelation($relationId)
            ->unreadBy($userId)
            ->count();
    }
}
