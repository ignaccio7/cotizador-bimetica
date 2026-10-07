<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['quote_floor_group_id', 'name', 'description', 'area'])]
class QuoteFloor extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'area' => 'decimal:2',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(QuoteFloorGroup::class, 'quote_floor_group_id');
    }
}
