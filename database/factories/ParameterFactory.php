<?php

namespace Database\Factories;

use App\Models\Parameter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Parameter>
 */
class ParameterFactory extends Factory
{
    protected $model = Parameter::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'type' => 'numeric',
            'default_value' => '100',
            'description' => fake()->sentence(),
        ];
    }
}
