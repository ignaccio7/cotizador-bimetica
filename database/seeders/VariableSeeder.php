<?php

namespace Database\Seeders;

use App\Models\Variable;
use Illuminate\Database\Seeder;

class VariableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $variables = [
            [
                'name' => 'm2',
                'type' => 'dynamic',
                'value_type' => 'decimal',
                'default_value' => '0',
                'options' => null,
                'description' => 'Superficie en m² construidos del piso o grupo de pisos',
            ],
            [
                'name' => 'pozos',
                'type' => 'dynamic',
                'value_type' => 'integer',
                'default_value' => '0',
                'options' => null,
                'description' => 'Cantidad de pozos SPT para estudio de suelos geotécnico',
            ],
            [
                'name' => 'complejidad',
                'type' => 'dynamic',
                'value_type' => 'string',
                'default_value' => 'medio',
                'options' => ['bajo', 'medio', 'alto'],
                'description' => 'Factor arquitectónico de complejidad técnica',
            ],
            [
                'name' => 'cambiodolar',
                'type' => 'static',
                'value_type' => 'decimal',
                'default_value' => '12.11',
                'options' => null,
                'description' => 'Tipo de cambio referencial oficial USD a BOB',
            ],
        ];

        foreach ($variables as $var) {
            Variable::updateOrCreate(
                ['name' => $var['name']],
                $var
            );
        }
    }
}
