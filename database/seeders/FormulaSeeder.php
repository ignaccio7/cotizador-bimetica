<?php

namespace Database\Seeders;

use App\Models\Formula;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Database\Seeder;

class FormulaSeeder extends Seeder
{
    /**
     * Run the database seeds with official formulas for all Bimetica services.
     */
    public function run(): void
    {
        $variables = Variable::pluck('id', 'name');

        // Limpiamos todas las fórmulas previas para regenerar exactamente lo requerido
        Formula::query()->delete();

        $serviceFormulaConfigs = [
            'PLANOS 2D' => [
                [
                    'name' => 'ARANCEL /M2',
                    'expression' => 'm2 < 30 ? 19 : 12',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => 'm2 <= 20 ? 600 : ceil(m2 * arancel_m2)',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
            ],
            '3D' => [
                [
                    'name' => 'BS /M2',
                    'expression' => 'm2 < 30 ? 65 : 56',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => 'm2 < 30 ? 1800 : ceil(m2 * bs_m2)',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
            ],
            'ESTRUCTURAL' => [
                [
                    'name' => 'BS /M2',
                    'expression' => 'm2 < 50 ? 25 : 22',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => 'm2 < 50 ? 1500 : ceil(m2 * bs_m2)',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
            ],
            'INTERIORES' => [
                [
                    'name' => 'BS /M2',
                    'expression' => 'm2 < 50 ? 40 : 35',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => 'ceil(m2 * bs_m2)',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
            ],
            'SUELOS' => [
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => 'pozos * 450 + 200',
                    'is_visible' => true,
                    'variables' => ['pozos'],
                ],
            ],
            'MUNICIPAL' => [
                [
                    'name' => 'ARANCEL /M2',
                    'expression' => '4.5',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => 'm2 < 100 ? 500 : ceil(m2 * arancel_m2)',
                    'is_visible' => true,
                    'variables' => ['m2'],
                ],
            ],
        ];

        foreach ($serviceFormulaConfigs as $keyword => $formulas) {
            $service = Service::where('name', 'LIKE', "%{$keyword}%")->first();

            if (! $service) {
                continue;
            }

            foreach ($formulas as $fData) {
                $formula = Formula::create([
                    'service_id' => $service->id,
                    'name' => $fData['name'],
                    'expression' => $fData['expression'],
                    'is_visible' => $fData['is_visible'],
                ]);

                $varIds = array_filter(array_map(
                    fn ($varName) => $variables[$varName] ?? null,
                    $fData['variables']
                ));

                if (! empty($varIds)) {
                    $formula->variables()->sync($varIds);
                }
            }
        }
    }
}
