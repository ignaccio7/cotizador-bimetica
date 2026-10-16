<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'client_id',
        'seller_id',
        'status',
        'filled_parameters',
        'total_amount',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'filled_parameters' => 'array',
            'total_amount'      => 'decimal:2',
        ];
    }

    /**
     * The client this quote belongs to.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The seller (User) who created this quote.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * The floor-surface groups (tables) associated with this quote.
     */
    public function floorGroups(): HasMany
    {
        return $this->hasMany(QuoteFloorGroup::class);
    }

    /**
     * The services included in this quote.
     */
    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }
}
