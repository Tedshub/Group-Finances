<?php
// app/Models/Transaction.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $relation_id
 * @property int|null $user_id
 * @property string $user_name
 * @property string $jenis
 * @property float $jumlah
 * @property string|null $catatan
 * @property string|null $bukti
 * @property \Carbon\Carbon $waktu_transaksi
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 * @property-read Relation $relation
 * @property-read User|null $user
 */
class Transaction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'relation_id',
        'user_id',
        'user_name',
        'jenis',
        'jumlah',
        'catatan',
        'bukti',
        'waktu_transaksi',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'waktu_transaksi' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ========== Constants untuk Jenis Transaksi ==========
    const JENIS_PEMASUKAN = 'pemasukan';
    const JENIS_PENGELUARAN = 'pengeluaran';

    // ========== Relationships ==========

    /**
     * Relation tempat transaksi ini berada
     */
    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'relation_id');
    }

    /**
     * User yang membuat transaksi (nullable jika user dihapus)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ========== Accessors ==========

    /**
     * Get formatted jumlah dengan currency
     */
    public function getFormattedJumlahAttribute(): string
    {
        return 'Rp ' . number_format($this->jumlah, 0, ',', '.');
    }

    /**
     * Get bukti URL (jika ada)
     */
    public function getBuktiUrlAttribute(): ?string
    {
        if (!$this->bukti) {
            return null;
        }

        return Storage::url($this->bukti);
    }

    /**
     * Get nama user (dari user_name atau user relationship)
     */
    public function getCreatorNameAttribute(): string
    {
        return $this->user_name ?? 'User Dihapus';
    }

    // ========== Query Scopes ==========

    /**
     * Scope untuk transaksi pemasukan
     */
    public function scopePemasukan($query)
    {
        return $query->where('jenis', self::JENIS_PEMASUKAN);
    }

    /**
     * Scope untuk transaksi pengeluaran
     */
    public function scopePengeluaran($query)
    {
        return $query->where('jenis', self::JENIS_PENGELUARAN);
    }

    /**
     * Scope untuk transaksi dalam relation tertentu
     */
    public function scopeInRelation($query, $relationId)
    {
        return $query->where('relation_id', $relationId);
    }

    /**
     * Scope untuk transaksi yang dibuat oleh user tertentu
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope untuk search berdasarkan catatan atau user_name
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('catatan', 'like', "%{$search}%")
              ->orWhere('user_name', 'like', "%{$search}%");
        });
    }

    /**
     * Scope untuk filter berdasarkan rentang waktu
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('waktu_transaksi', [$startDate, $endDate]);
    }

    /**
     * Scope untuk order by waktu transaksi (terbaru)
     */
    public function scopeLatestTransaction($query)
    {
        return $query->orderBy('waktu_transaksi', 'desc');
    }

    // ========== Helper Methods ==========

    /**
     * Cek apakah transaksi adalah pemasukan
     */
    public function isPemasukan(): bool
    {
        return $this->jenis === self::JENIS_PEMASUKAN;
    }

    /**
     * Cek apakah transaksi adalah pengeluaran
     */
    public function isPengeluaran(): bool
    {
        return $this->jenis === self::JENIS_PENGELUARAN;
    }

    /**
     * Cek apakah user adalah pembuat transaksi ini
     */
    public function isOwnedBy($userId): bool
    {
        return $this->user_id === $userId;
    }

    /**
     * Delete file bukti dari storage
     */
    public function deleteBuktiFile(): bool
    {
        if ($this->bukti && Storage::exists($this->bukti)) {
            return Storage::delete($this->bukti);
        }

        return true;
    }

    // ========== Static Methods ==========

    /**
     * Get total pemasukan untuk relation
     */
    public static function getTotalPemasukan($relationId): float
    {
        return self::inRelation($relationId)
            ->pemasukan()
            ->sum('jumlah');
    }

    /**
     * Get total pengeluaran untuk relation
     */
    public static function getTotalPengeluaran($relationId): float
    {
        return self::inRelation($relationId)
            ->pengeluaran()
            ->sum('jumlah');
    }

    /**
     * Get saldo (pemasukan - pengeluaran) untuk relation
     */
    public static function getSaldo($relationId): float
    {
        $pemasukan = self::getTotalPemasukan($relationId);
        $pengeluaran = self::getTotalPengeluaran($relationId);

        return $pemasukan - $pengeluaran;
    }

    /**
     * Get statistik untuk relation
     */
    public static function getStatistik($relationId): array
    {
        return [
            'total_pemasukan' => self::getTotalPemasukan($relationId),
            'total_pengeluaran' => self::getTotalPengeluaran($relationId),
            'saldo' => self::getSaldo($relationId),
            'jumlah_transaksi' => self::inRelation($relationId)->count(),
            'jumlah_pemasukan' => self::inRelation($relationId)->pemasukan()->count(),
            'jumlah_pengeluaran' => self::inRelation($relationId)->pengeluaran()->count(),
        ];
    }

    // ========== Model Events ==========

    protected static function boot()
    {
        parent::boot();

        // Saat transaksi akan dihapus (hard delete), hapus juga file bukti
        static::deleting(function ($transaction) {
            // Hanya hapus file jika benar-benar di-hard delete (bukan soft delete)
            if ($transaction->isForceDeleting()) {
                $transaction->deleteBuktiFile();
            }
        });
    }
}
