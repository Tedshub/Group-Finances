<?php
// app/Models/Budget.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property int $relation_id
 * @property int $category_id
 * @property int $created_by
 * @property float $amount
 * @property int $month
 * @property int $year
 */
class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'relation_id',
        'category_id',
        'created_by',
        'amount',
        'month',
        'year',
    ];

    protected $casts = [
        'amount'      => 'decimal:2',
        'month'       => 'integer',
        'year'        => 'integer',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    // ========== Relationships ==========

    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'relation_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ========== Scopes ==========

    public function scopeForRelation($query, $relationId)
    {
        return $query->where('relation_id', $relationId);
    }

    public function scopeForPeriod($query, int $month, int $year)
    {
        return $query->where('month', $month)->where('year', $year);
    }

    // ========== Accessors ==========

    /** Total realisasi pengeluaran untuk kategori & periode ini */
    public function getRealisasiAttribute(): float
    {
        return Transaction::where('relation_id', $this->relation_id)
            ->where('category_id', $this->category_id)
            ->where('jenis', Transaction::JENIS_PENGELUARAN)
            ->whereMonth('waktu_transaksi', $this->month)
            ->whereYear('waktu_transaksi', $this->year)
            ->sum('jumlah');
    }

    /** Persentase pemakaian budget (0-∞) */
    public function getUsagePercentAttribute(): float
    {
        if ($this->amount <= 0) return 0;
        return round(($this->realisasi / $this->amount) * 100, 1);
    }

    /** Sisa budget */
    public function getSisaBudgetAttribute(): float
    {
        return $this->amount - $this->realisasi;
    }

    /** Status: safe / warning / overbudget */
    public function getStatusAttribute(): string
    {
        $pct = $this->usage_percent;
        if ($pct >= 100) return 'overbudget';
        if ($pct >= 70)  return 'warning';
        return 'safe';
    }

    // ========== Static Helpers ==========

    /**
     * Ambil semua budget untuk relasi & periode tertentu, beserta realisasinya.
     * Return collection of Budget dengan appended attributes.
     */
    public static function withRealisasi(int $relationId, int $month, int $year)
    {
        $budgets = self::forRelation($relationId)
            ->forPeriod($month, $year)
            ->with('category:id,name,icon,color')
            ->get();

        // Ambil total pengeluaran per category untuk periode ini dalam satu query
        $realisasi = Transaction::where('relation_id', $relationId)
            ->where('jenis', Transaction::JENIS_PENGELUARAN)
            ->whereMonth('waktu_transaksi', $month)
            ->whereYear('waktu_transaksi', $year)
            ->whereNotNull('category_id')
            ->select('category_id', DB::raw('SUM(jumlah) as total'))
            ->groupBy('category_id')
            ->pluck('total', 'category_id');

        return $budgets->map(function ($budget) use ($realisasi) {
            $real = (float) ($realisasi[$budget->category_id] ?? 0);
            $pct  = $budget->amount > 0 ? round(($real / $budget->amount) * 100, 1) : 0;

            $budget->realisasi_amount = $real;
            $budget->usage_percent    = $pct;
            $budget->sisa_budget      = $budget->amount - $real;
            $budget->budget_status    = $pct >= 100 ? 'overbudget' : ($pct >= 70 ? 'warning' : 'safe');

            return $budget;
        });
    }
}
