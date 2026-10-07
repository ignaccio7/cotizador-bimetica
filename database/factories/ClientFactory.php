<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'code' => sprintf('%03d/%d', fake()->numberBetween(1, 999), now()->year),
            'full_name' => fake()->name(),
            'ci' => fake()->numerify('#######').' LP',
            'phone' => '+591 '.fake()->numerify('7#######'),
            'address' => fake()->address(),
            'occupation' => fake()->jobTitle(),
        ];
    }
}
