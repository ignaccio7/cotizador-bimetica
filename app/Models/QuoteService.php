<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteService extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'quote_id',
        'service_id',
        'quote_floor_group_id',
        'subtotal',
        'filled_variables',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'filled_variables' => 'array',
        ];
    }

    /**
     * Get the quote that owns this quoted service.
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Get the service catalog item.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the floor group (table) assigned to this service, if any.
     */
    public function floorGroup(): BelongsTo
    {
        return $this->belongsTo(QuoteFloorGroup::class, 'quote_floor_group_id');
    }
}
