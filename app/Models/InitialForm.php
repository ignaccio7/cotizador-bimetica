<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['quote_id', 'project_address', 'payment_method', 'discount_applied', 'agreed_amount', 'extra_data'])]
class InitialForm extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'discount_applied' => 'decimal:2',
            'agreed_amount' => 'decimal:2',
            'extra_data' => 'array',
        ];
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function designation(): HasOne
    {
        return $this->hasOne(Designation::class);
    }

    public function contract(): HasOne
    {
        return $this->hasOne(Contract::class);
    }
}
