<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'description',
    ];

    /**
     * Get the formulas configured for this service.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Formula, $this>
     */
    public function formulas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Formula::class)->orderBy('id');
    }
}
