<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteFloorGroup extends Model
{
    use HasFactory;

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
     * Get the quote that owns this floor group.
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Get the individual floors belonging to this group.
     */
    public function floors(): HasMany
    {
        return $this->hasMany(QuoteFloor::class);
    }

    /**
     * Get the services assigned to this floor group.
     */
    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }
}
