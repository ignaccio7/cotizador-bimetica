<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'type', 'default_value'])]
class Variable extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'default_value' => 'decimal:2',
        ];
    }

    public function formulas(): BelongsToMany
    {
        return $this->belongsToMany(Formula::class, 'formula_variables');
    }
}
