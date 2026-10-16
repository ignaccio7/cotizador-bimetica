<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteFloor extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quote_floor_group_id',
        'name',
        'description',
        'area',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'area' => 'decimal:2',
        ];
    }

    /**
     * The floor group this floor belongs to.
     */
    public function floorGroup(): BelongsTo
    {
        return $this->belongsTo(QuoteFloorGroup::class);
    }
}
