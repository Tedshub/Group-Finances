<?php
// app/Models/Message.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'relation_id',
        'user_id',
        'message',
        'type',
        'file_path',
        'file_name',
        'file_size',
        'reply_to_message_id',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Constants untuk type pesan
    const TYPE_TEXT = 'text';
    const TYPE_IMAGE = 'image';
    const TYPE_FILE = 'file';
    const TYPE_SYSTEM = 'system';

    // Accessor untuk has_bukti
    public function getHasBuktiAttribute()
    {
        return !is_null($this->file_path);
    }

    // ========== Relationships ==========

    /**
     * Relation/grup tempat pesan dikirim
     */
    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'relation_id');
    }

    /**
     * User pengirim pesan
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Pesan yang direply (parent message)
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to_message_id');
    }

    /**
     * Pesan-pesan yang mereply pesan ini (replies)
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'reply_to_message_id');
    }

    /**
     * Status baca pesan oleh users
     */
    public function reads(): HasMany
    {
        return $this->hasMany(MessageRead::class, 'message_id');
    }

    /**
     * Reactions pada pesan ini
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(MessageReaction::class, 'message_id');
    }

    // ========== Type Check Methods ==========

    public function isText(): bool
    {
        return $this->type === self::TYPE_TEXT;
    }

    public function isImage(): bool
    {
        return $this->type === self::TYPE_IMAGE;
    }

    public function isFile(): bool
    {
        return $this->type === self::TYPE_FILE;
    }

    public function isSystem(): bool
    {
        return $this->type === self::TYPE_SYSTEM;
    }

    public function hasAttachment(): bool
    {
        return !is_null($this->file_path);
    }

    public function isReply(): bool
    {
        return !is_null($this->reply_to_message_id);
    }

    // ========== Read Status Methods ==========

    /**
     * Cek apakah pesan sudah dibaca oleh user tertentu
     */
    public function isReadBy(User $user): bool
    {
        return $this->reads()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Mark pesan sebagai sudah dibaca oleh user
     */
    public function markAsReadBy(User $user): void
    {
        MessageRead::firstOrCreate([
            'message_id' => $this->id,
            'user_id' => $user->id,
        ]);
    }

    /**
     * Get jumlah user yang sudah baca pesan ini
     */
    public function getReadCountAttribute(): int
    {
        return $this->reads()->count();
    }

    // ========== Reaction Methods ==========

    /**
     * Toggle reaction pada pesan (jika ada hapus, jika tidak ada tambah)
     */
    public function toggleReaction(User $user, string $emoji): void
    {
        $reaction = $this->reactions()
            ->where('user_id', $user->id)
            ->where('emoji', $emoji)
            ->first();

        if ($reaction) {
            $reaction->delete();
        } else {
            MessageReaction::create([
                'message_id' => $this->id,
                'user_id' => $user->id,
                'emoji' => $emoji,
            ]);
        }
    }

    /**
     * Get reactions yang dikelompokkan per emoji
     */
    public function getGroupedReactions()
    {
        return $this->reactions()
            ->selectRaw('emoji, count(*) as count')
            ->groupBy('emoji')
            ->get()
            ->map(function ($reaction) {
                return [
                    'emoji' => $reaction->emoji,
                    'count' => $reaction->count,
                    'users' => $this->reactions()
                        ->where('emoji', $reaction->emoji)
                        ->with('user:id,name')
                        ->get()
                        ->pluck('user'),
                ];
            });
    }

    // ========== Scopes ==========

    public function scopeForRelation($query, $relationId)
    {
        return $query->where('relation_id', $relationId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeText($query)
    {
        return $query->where('type', self::TYPE_TEXT);
    }

    public function scopeImages($query)
    {
        return $query->where('type', self::TYPE_IMAGE);
    }

    public function scopeFiles($query)
    {
        return $query->where('type', self::TYPE_FILE);
    }

    public function scopeSystem($query)
    {
        return $query->where('type', self::TYPE_SYSTEM);
    }

    public function scopeWithAttachment($query)
    {
        return $query->whereNotNull('file_path');
    }

    public function scopeUnreadBy($query, $userId)
    {
        return $query->whereDoesntHave('reads', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeOldestFirst($query)
    {
        return $query->orderBy('created_at', 'asc');
    }

    // ========== Accessors ==========

    /**
     * Get file size dalam format human readable
     */
    public function getFileSizeFormattedAttribute(): ?string
    {
        if (!$this->file_size) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = $this->file_size;

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get full file path untuk attachment
     */
    public function getFilePath(): ?string
    {
        if (!$this->file_path) {
            return null;
        }
        return Storage::disk('local')->path($this->file_path);
    }

    /**
     * Get file URL untuk download/display
     */
    public function getFileUrl(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        // Untuk file private, gunakan route download
        return route('chat.file.download', [
            'message' => $this->id,
        ]);
    }

    /**
     * Store uploaded file ke storage
     */
    public static function storeFile($file, $relationId): array
    {
        // Generate nama file unik
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Path: private/file-chat/{relation_id}/{filename}
        $path = $file->storeAs(
            'private/file-chat/' . $relationId,
            $filename,
            'local'
        );

        return [
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }

    /**
     * Delete file dari storage
     */
    public function deleteFile(): bool
    {
        if (!$this->file_path) {
            return false;
        }

        if (Storage::disk('local')->exists($this->file_path)) {
            return Storage::disk('local')->delete($this->file_path);
        }

        return false;
    }

    /**
     * Check apakah file exists
     */
    public function fileExists(): bool
    {
        if (!$this->file_path) {
            return false;
        }

        return Storage::disk('local')->exists($this->file_path);
    }

    /**
     * Get file mime type
     */
    public function getFileMimeType(): ?string
    {
        if (!$this->fileExists()) {
            return null;
        }

        $fullPath = Storage::disk('local')->path($this->file_path);

        return mime_content_type($fullPath);
    }

    /**
     * Check apakah file adalah image
     */
    public function isImageFile(): bool
    {
        if (!$this->file_path) {
            return false;
        }

        $mimeType = $this->getFileMimeType();
        return $mimeType && str_starts_with($mimeType, 'image/');
    }

    /**
     * Get image thumbnail URL (jika file adalah image)
     */
    public function getThumbnailUrl(): ?string
    {
        if (!$this->isImageFile()) {
            return null;
        }

        return route('chat.file.thumbnail', [
            'message' => $this->id,
        ]);
    }

    // ========== Boot Method untuk Auto Delete File ==========

    protected static function boot()
    {
        parent::boot();

        // Auto delete file saat message dihapus permanent
        static::forceDeleting(function ($message) {
            $message->deleteFile();
        });

        // Update last_message_at pada relation saat ada pesan baru
        static::created(function ($message) {
            $message->relation()->update(['last_message_at' => $message->created_at]);
        });
    }

    /**
     * Get full file URL
     */
    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }
}
