<?php
// app/Models/Category.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int|null $relation_id
 * @property string $name
 * @property string $icon
 * @property string $color
 * @property string $type
 * @property bool $is_active
 */
class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'relation_id',
        'name',
        'icon',
        'color',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'relation_id' => 'integer',
    ];

    const TYPE_PEMASUKAN   = 'pemasukan';
    const TYPE_PENGELUARAN = 'pengeluaran';
    const TYPE_KEDUANYA    = 'keduanya';

    // ========== Relationships ==========

    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'relation_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'category_id');
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class, 'category_id');
    }

    // ========== Scopes ==========

    /** Kategori global (tidak terikat ke grup manapun) */
    public function scopeGlobal($query)
    {
        return $query->whereNull('relation_id');
    }

    /** Kategori milik relasi tertentu */
    public function scopeForRelation($query, $relationId)
    {
        return $query->where('relation_id', $relationId);
    }

    /** Kategori aktif */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /** Kategori yang bisa dipakai untuk jenis transaksi tertentu */
    public function scopeForType($query, string $type)
    {
        return $query->where(function ($q) use ($type) {
            $q->where('type', $type)
              ->orWhere('type', self::TYPE_KEDUANYA);
        });
    }

    // ========== Helpers ==========

    /** Apakah ini kategori global */
    public function isGlobal(): bool
    {
        return is_null($this->relation_id);
    }

    /**
     * Get semua kategori yang tersedia untuk sebuah relasi
     * (gabungan global + custom milik relasi)
     */
    public static function availableForRelation(int $relationId, ?string $type = null)
    {
        $query = self::active()
            ->where(function ($q) use ($relationId) {
                $q->whereNull('relation_id')
                  ->orWhere('relation_id', $relationId);
            });

        if ($type) {
            $query->forType($type);
        }

        return $query->orderByRaw('relation_id IS NULL DESC, name ASC')->get();
    }
}
