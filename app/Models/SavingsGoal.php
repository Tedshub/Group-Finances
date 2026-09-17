<?php
// app/Models/SavingsGoal.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $relation_id
 * @property int $created_by
 * @property string $title
 * @property string|null $description
 * @property float $target_amount
 * @property float $current_amount
 * @property \Carbon\Carbon|null $deadline
 * @property string $icon
 * @property string $color
 * @property string $scope
 * @property string $status
 * @property \Carbon\Carbon|null $completed_at
 */
class SavingsGoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'relation_id',
        'created_by',
        'title',
        'description',
        'target_amount',
        'current_amount',
        'deadline',
        'icon',
        'color',
        'scope',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'target_amount'  => 'decimal:2',
        'current_amount' => 'decimal:2',
        'deadline'       => 'date',
        'completed_at'   => 'datetime',
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
    ];

    const SCOPE_GROUP    = 'group';
    const SCOPE_PERSONAL = 'personal';

    const STATUS_ACTIVE    = 'active';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // ========== Relationships ==========

    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'relation_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(SavingsContribution::class, 'savings_goal_id');
    }

    // ========== Scopes ==========

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeForRelation($query, $relationId)
    {
        return $query->where('relation_id', $relationId);
    }

    public function scopeGroup($query)
    {
        return $query->where('scope', self::SCOPE_GROUP);
    }

    public function scopePersonal($query, $userId)
    {
        return $query->where('scope', self::SCOPE_PERSONAL)
                     ->where('created_by', $userId);
    }

    // ========== Accessors ==========

    /** Persentase dana terkumpul (0-100) */
    public function getProgressPercentAttribute(): float
    {
        if ($this->target_amount <= 0) return 0;
        return min(100, round(($this->current_amount / $this->target_amount) * 100, 1));
    }

    /** Sisa dana yang dibutuhkan */
    public function getRemainingAmountAttribute(): float
    {
        return max(0, $this->target_amount - $this->current_amount);
    }

    /** Hari tersisa menuju deadline */
    public function getDaysRemainingAttribute(): ?int
    {
        if (!$this->deadline) return null;
        $diff = now()->startOfDay()->diffInDays($this->deadline->startOfDay(), false);
        return (int) $diff;
    }

    /** Apakah sudah melewati deadline */
    public function isOverdueAttribute(): bool
    {
        if (!$this->deadline) return false;
        return now()->isAfter($this->deadline) && $this->status === self::STATUS_ACTIVE;
    }

    // ========== Helpers ==========

    /** Tambah kontribusi & update current_amount */
    public function addContribution(float $amount): void
    {
        $this->increment('current_amount', $amount);
        $this->refresh();

        // Auto-complete jika target tercapai
        if ($this->current_amount >= $this->target_amount && $this->status === self::STATUS_ACTIVE) {
            $this->update([
                'status'       => self::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);
        }
    }

    /** Kurangi current_amount (saat kontribusi dihapus) */
    public function removeContribution(float $amount): void
    {
        $this->decrement('current_amount', $amount);
        $this->refresh();

        // Revert ke active jika sebelumnya completed tapi sekarang kurang
        if ($this->current_amount < $this->target_amount && $this->status === self::STATUS_COMPLETED) {
            $this->update([
                'status'       => self::STATUS_ACTIVE,
                'completed_at' => null,
            ]);
        }
    }
}
