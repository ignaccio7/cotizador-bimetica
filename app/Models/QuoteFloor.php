<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteFloor extends Model
{
    use HasFactory;

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
     * Get the floor group that owns this floor level.
     */
    public function floorGroup(): BelongsTo
    {
        return $this->belongsTo(QuoteFloorGroup::class, 'quote_floor_group_id');
    }
}
