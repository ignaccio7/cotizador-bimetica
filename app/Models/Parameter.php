<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parameter extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'group',
        'group_label',
        'scope',
        'name',
        'type',
        'value',
        'description',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope a query to only include parameters of a given group.
     */
    public function scopeGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * Scope a query to only include active parameters.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include parameters affecting the quotation total.
     */
    public function scopeTotal(Builder $query): Builder
    {
        return $query->where('scope', 'total');
    }

    /**
     * Scope a query to only include global project calculation parameters.
     */
    public function scopeGlobal(Builder $query): Builder
    {
        return $query->where('scope', 'global');
    }

    /**
     * Scope a query to only include service-specific parameters.
     */
    public function scopeService(Builder $query): Builder
    {
        return $query->where('scope', 'service');
    }

    /**
     * Scope a query to only include parameters applicable to services and formulas.
     */
    public function scopeForServices(Builder $query): Builder
    {
        return $query->whereIn('scope', ['global', 'service']);
    }
}
