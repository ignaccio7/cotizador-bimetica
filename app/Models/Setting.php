<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'value',
        'type',
        'label',
        'description',
    ];

    /**
     * Retrieve a setting value by key with optional fallback default.
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    /**
     * Set or update a setting value by key.
     */
    public static function set(string $key, ?string $value, ?string $label = null, ?string $type = 'string'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            array_filter([
                'value' => $value,
                'label' => $label,
                'type' => $type,
            ], fn ($v) => $v !== null)
        );
    }
}

