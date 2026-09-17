<?php
// app/Models/Relation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Relation extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'creator_id',
        'last_message_at',
        'settings',
    ];

    protected $casts = [
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
        'last_message_at'=> 'datetime',
        'settings'       => 'array',
    ];

    // ========== Relationships ==========

    /**
     * User yang MEMBUAT relation ini (creator)
     *
     * @return BelongsTo
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
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
            'user_relation',
            'relation_id',
            'user_id'
        )
        ->using(UserRelation::class)
        ->withPivot('is_owner', 'join_at', 'notification_prefs')
        ->withTimestamps()
        ->orderByPivot('is_owner', 'desc')
        ->orderByPivot('join_at', 'asc');
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

    /**
     * Pesan-pesan dalam relation ini
     *
     * @return HasMany
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'relation_id');
    }

    /**
     * Pesan terakhir dalam relation ini
     *
     * @return HasMany
     */
    public function lastMessage()
    {
        return $this->hasOne(Message::class, 'relation_id')->latest();
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
     * Update last_message_at saat ada pesan baru
     *
     * @return void
     */
    public function updateLastMessageAt(): void
    {
        $this->update(['last_message_at' => now()]);
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

    // Tambahkan di dalam class Relation

    /**
     * Join requests untuk relation ini
     */
    public function joinRequests(): HasMany
    {
        return $this->hasMany(RelationJoinRequest::class, 'relation_id');
    }

    /**
     * Pending join requests
     */
    public function pendingJoinRequests(): HasMany
    {
        return $this->joinRequests()
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->with('user:id,name,email');
    }

    /**
     * Hitung jumlah pending requests
     */
    public function getPendingRequestsCountAttribute(): int
    {
        return $this->joinRequests()
            ->where('status', RelationJoinRequest::STATUS_PENDING)
            ->count();
    }

    /**
     * Target tabungan di relation ini
     */
    public function savingsGoals(): HasMany
    {
        return $this->hasMany(\App\Models\SavingsGoal::class, 'relation_id');
    }

    /**
     * Anggaran di relation ini
     */
    public function budgets(): HasMany
    {
        return $this->hasMany(\App\Models\Budget::class, 'relation_id');
    }

    /**
     * Kategori custom di relation ini
     */
    public function categories(): HasMany
    {
        return $this->hasMany(\App\Models\Category::class, 'relation_id');
    }

    /**
     * Transaksi yang ada di relation ini
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'relation_id');
    }

    /**
     * Transaksi pemasukan di relation ini
     */
    public function pemasukan(): HasMany
    {
        return $this->transactions()->where('jenis', Transaction::JENIS_PEMASUKAN);
    }

    /**
     * Transaksi pengeluaran di relation ini
     */
    public function pengeluaran(): HasMany
    {
        return $this->transactions()->where('jenis', Transaction::JENIS_PENGELUARAN);
    }

    /**
     * Get total pemasukan
     */
    public function getTotalPemasukan(): float
    {
        return $this->pemasukan()->sum('jumlah');
    }

    /**
     * Get total pengeluaran
     */
    public function getTotalPengeluaran(): float
    {
        return $this->pengeluaran()->sum('jumlah');
    }

    /**
     * Get saldo (pemasukan - pengeluaran)
     */
    public function getSaldo(): float
    {
        return $this->getTotalPemasukan() - $this->getTotalPengeluaran();
    }

    /**
     * Get statistik transaksi untuk relation ini
     */
    public function getStatistikTransaksi(): array
    {
        return Transaction::getStatistik($this->id);
    }

    /**
     * Scope untuk mengurutkan berdasarkan pesan terbaru
     */
    public function scopeWithLatestMessage($query)
    {
        return $query->orderByDesc('last_message_at');
    }
}
