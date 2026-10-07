<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'html_body'])]
class ContractTemplate extends Model
{
    use HasFactory;

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}
