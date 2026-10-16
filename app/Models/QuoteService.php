<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteService extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quote_id',
        'service_id',
        'quote_floor_group_id',
        'filled_variables',
        'subtotal',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'filled_variables'   => 'array',
            'subtotal'           => 'decimal:2',
        ];
    }

    /**
     * The quote this service row belongs to.
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * The service (catalog entry) for this row.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * The optional floor group linked to this service.
     */
    public function floorGroup(): BelongsTo
    {
        return $this->belongsTo(QuoteFloorGroup::class, 'quote_floor_group_id');
    }
}
