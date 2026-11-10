<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'category',
        'description',
    ];

    /**
     * Get the formulas for this service.
     */
    public function formulas(): HasMany
    {
        return $this->hasMany(Formula::class);
    }

    /**
     * Get the quotes where this service is included.
     */
    public function quoteServices(): HasMany
    {
        return $this->hasMany(QuoteService::class);
    }
}
