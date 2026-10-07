<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['quote_id', 'service_id', 'quote_floor_group_id', 'filled_variables', 'subtotal'])]
class QuoteService extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'filled_variables' => 'array',
            'subtotal' => 'decimal:2',
        ];
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function floorGroup(): BelongsTo
    {
        return $this->belongsTo(QuoteFloorGroup::class, 'quote_floor_group_id');
    }
}
