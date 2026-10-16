<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'full_name',
        'ci',
        'phone',
        'address',
        'occupation',
    ];

    /**
     * The quotes belonging to this client.
     */
    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }
}
