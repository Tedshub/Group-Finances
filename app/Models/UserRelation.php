<?php
// app/Models/UserRelation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserRelation extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_relation';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_user',
        'id_relation',
        'is_owner',
        'join_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_owner' => 'boolean',
        'join_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== Relationships ==========

    /**
     * User yang terhubung
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    /**
     * Relation yang terhubung
     *
     * @return BelongsTo
     */
    public function relation(): BelongsTo
    {
        return $this->belongsTo(Relation::class, 'id_relation');
    }

    // ========== Scopes ==========

    /**
     * Scope untuk filter hanya owner
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOwners($query)
    {
        return $query->where('is_owner', true);
    }

    /**
     * Scope untuk filter hanya member (bukan owner)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMembers($query)
    {
        return $query->where('is_owner', false);
    }
}
