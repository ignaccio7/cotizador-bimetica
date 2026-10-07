<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['client_id', 'seller_id', 'status', 'filled_parameters', 'total_amount'])]
class Quote extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'filled_parameters' => 'array',
            'total_amount' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function floorGroups(): HasMany
    {
        return $this->hasMany(QuoteFloorGroup::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }

    public function initialForm(): HasOne
    {
        return $this->hasOne(InitialForm::class);
    }
}
