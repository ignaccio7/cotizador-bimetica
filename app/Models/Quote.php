<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
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
            'total_amount' => 'decimal:2',
        ];
    }

    /**
     * Get the client for this quote.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the seller (user) for this quote.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the floor groups (tables) for this quote.
     */
    public function floorGroups(): HasMany
    {
        return $this->hasMany(QuoteFloorGroup::class);
    }

    /**
     * Get the active services in this quote.
     */
    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }

    /**
     * Generate the next annual correlative quote code (e.g. COT-2026-00001).
     */
    public static function generateNextCode(): string
    {
        $year = date('Y');
        $count = static::whereYear('created_at', $year)->count() + 1;

        return sprintf('COT-%s-%05d', $year, $count);
    }
}
