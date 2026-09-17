<?php
// app/Models/SavingsContribution.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $savings_goal_id
 * @property int $user_id
 * @property string $user_name
 * @property float $amount
 * @property string|null $note
 * @property \Carbon\Carbon $date
 */
class SavingsContribution extends Model
{
    use HasFactory;

    protected $fillable = [
        'savings_goal_id',
        'user_id',
        'user_name',
        'amount',
        'note',
        'date',
    ];

    protected $casts = [
        'amount'     => 'decimal:2',
        'date'       => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== Relationships ==========

    public function savingsGoal(): BelongsTo
    {
        return $this->belongsTo(SavingsGoal::class, 'savings_goal_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ========== Scopes ==========

    public function scopeForGoal($query, $goalId)
    {
        return $query->where('savings_goal_id', $goalId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ========== Model Events ==========

    protected static function boot()
    {
        parent::boot();

        // Saat kontribusi dibuat, update current_amount di savings_goal
        static::created(function ($contribution) {
            $contribution->savingsGoal->addContribution($contribution->amount);
        });

        // Saat kontribusi dihapus, kurangi current_amount di savings_goal
        static::deleted(function ($contribution) {
            $contribution->savingsGoal->removeContribution($contribution->amount);
        });
    }
}
