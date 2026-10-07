<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['name', 'description'])]
class Service extends Model
{
    use HasFactory;

    public function formulas(): HasMany
    {
        return $this->hasMany(Formula::class)->orderBy('id');
    }

    public function formula(): HasOne
    {
        return $this->hasOne(Formula::class)->latestOfMany();
    }

    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }
}
