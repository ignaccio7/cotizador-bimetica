<?php

namespace Database\Seeders;

use App\Models\Parameter;
use Illuminate\Database\Seeder;

class ParameterSeeder extends Seeder
{
    /**
     * Seed viático parameters by city for the quote calculator.
     * type = 'viatico', default_value = amount in Bs.
     */
    public function run(): void
    {
        $viaticosCities = [
            ['name' => 'La Paz (Área Metropolitana)',     'default_value' => '0',    'description' => 'Sin viático — sede principal'],
            ['name' => 'El Alto (Urbana)',                'default_value' => '0',    'description' => 'Sin viático — conurbación La Paz'],
            ['name' => 'Viacha / Patacamaya',             'default_value' => '200',  'description' => 'Viático zona altiplánica cercana'],
            ['name' => 'Oruro',                           'default_value' => '300',  'description' => 'Viático departamento Oruro'],
            ['name' => 'Cochabamba (Centro / Valles)',    'default_value' => '450',  'description' => 'Viático Cochabamba urbana'],
            ['name' => 'Sucre / Chuquisaca',             'default_value' => '500',  'description' => 'Viático Sucre y valles sur'],
            ['name' => 'Santa Cruz de la Sierra',        'default_value' => '600',  'description' => 'Viático Santa Cruz urbano'],
            ['name' => 'Beni / Trinidad',                'default_value' => '700',  'description' => 'Viático Beni / Amazonia'],
            ['name' => 'Potosí',                         'default_value' => '400',  'description' => 'Viático Potosí y alrededores'],
            ['name' => 'Tarija',                         'default_value' => '550',  'description' => 'Viático Tarija / Chaco'],
        ];

        foreach ($viaticosCities as $city) {
            Parameter::updateOrCreate(
                ['name' => $city['name'], 'type' => 'viatico'],
                [
                    'default_value' => $city['default_value'],
                    'description'   => $city['description'],
                ]
            );
        }
    }
}
