<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteFloorGroup extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quote_id',
        'table_name',
        'total_area',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_area' => 'decimal:2',
        ];
    }

    /**
     * The quote this floor group belongs to.
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * The individual floors (plants/levels) in this group.
     */
    public function floors(): HasMany
    {
        return $this->hasMany(QuoteFloor::class);
    }

    /**
     * The quote services assigned to this floor group.
     */
    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }
}
