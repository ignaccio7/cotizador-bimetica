<?php

namespace Database\Factories;

use App\Models\Variable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Variable>
 */
class VariableFactory extends Factory
{
    protected $model = Variable::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'type' => 'dynamic',
            'default_value' => fake()->randomFloat(2, 10, 500),
        ];
    }
}
