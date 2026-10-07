<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['quote_id', 'table_name', 'total_area'])]
class QuoteFloorGroup extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'total_area' => 'decimal:2',
        ];
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function floors(): HasMany
    {
        return $this->hasMany(QuoteFloor::class);
    }

    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }
}
