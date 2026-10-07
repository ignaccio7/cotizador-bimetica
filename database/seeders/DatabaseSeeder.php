<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Usuario Administrador BIMETICA
        User::updateOrCreate(
            ['email' => 'admin@bimetica.bo'],
            [
                'name' => 'Administrador BIMETICA',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Usuario Ejecutivo Comercial (Vendedor)
        User::updateOrCreate(
            ['email' => 'nestorignaciorg@gmail.com'],
            [
                'name' => 'Nestor Ignacio Rojas Guarachi',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'email_verified_at' => now(),
            ]
        );

        // 3. Catálogo del Sistema (Parámetros, Variables, Servicios, Fórmulas, Plantilla y Clientes)
        $this->call(CatalogSeeder::class);
    }
}
