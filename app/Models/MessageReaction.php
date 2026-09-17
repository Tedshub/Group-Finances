<?php
// app/Models/MessageReaction.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'user_id',
        'emoji',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== Relationships ==========

    /**
     * Pesan yang direact
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'message_id');
    }

    /**
     * User yang kasih reaction
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

    public function scopeByEmoji($query, string $emoji)
    {
        return $query->where('emoji', $emoji);
    }

    public function scopeGroupedByEmoji($query)
    {
        return $query->selectRaw('emoji, count(*) as count')
            ->groupBy('emoji');
    }

    // ========== Static Methods ==========

    /**
     * Toggle reaction (add/remove)
     */
    public static function toggle($messageId, $userId, string $emoji): bool
    {
        $reaction = self::where([
            'message_id' => $messageId,
            'user_id' => $userId,
            'emoji' => $emoji,
        ])->first();

        if ($reaction) {
            $reaction->delete();
            return false; // Reaction dihapus
        }

        self::create([
            'message_id' => $messageId,
            'user_id' => $userId,
            'emoji' => $emoji,
        ]);

        return true; // Reaction ditambahkan
    }

    /**
     * Get all reactions untuk pesan, grouped by emoji
     */
    public static function getGroupedForMessage($messageId)
    {
        return self::forMessage($messageId)
            ->with('user:id,name')
            ->get()
            ->groupBy('emoji')
            ->map(function ($reactions, $emoji) {
                return [
                    'emoji' => $emoji,
                    'count' => $reactions->count(),
                    'users' => $reactions->pluck('user'),
                ];
            })
            ->values();
    }

    /**
     * Cek apakah user sudah react dengan emoji tertentu
     */
    public static function hasReacted($messageId, $userId, string $emoji): bool
    {
        return self::where([
            'message_id' => $messageId,
            'user_id' => $userId,
            'emoji' => $emoji,
        ])->exists();
    }

    /**
     * Remove all reactions dari user pada message tertentu
     */
    public static function removeAllFromUser($messageId, $userId): void
    {
        self::where([
            'message_id' => $messageId,
            'user_id' => $userId,
        ])->delete();
    }

    /**
     * Get top 5 emoji paling banyak digunakan
     */
    public static function getTopEmojis($limit = 5)
    {
        return self::selectRaw('emoji, count(*) as total')
            ->groupBy('emoji')
            ->orderByDesc('total')
            ->limit($limit)
            ->pluck('total', 'emoji');
    }
}
