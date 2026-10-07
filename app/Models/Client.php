<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'full_name', 'ci', 'phone', 'address', 'occupation'])]
class Client extends Model
{
    use HasFactory;

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }
}
