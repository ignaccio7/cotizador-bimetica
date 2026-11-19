<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(
            ['key' => 'quote_total_formula'],
            [
                'value' => 'services_subtotal - (services_subtotal * (discount / 100))',
                'type' => 'formula',
                'label' => 'Fórmula del Total de Cotización',
                'description' => 'Expresión matemática evaluada con Math.js para calcular el monto final acordado de la cotización.',
            ]
        );
    }
}

