<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@bimetica.bo'],
            [
                'name' => 'Admin Bimetica',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'nestorignaciorg@gmail.com'],
            [
                'name' => 'Nestor Rojas',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            ServiceSeeder::class,
            VariableSeeder::class,
        ]);
    }
}
