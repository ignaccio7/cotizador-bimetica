<?php

namespace Database\Seeders;

use App\Models\Formula;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Database\Seeder;

class FormulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $m2 = Variable::where('name', 'm2')->first();
        $pozos = Variable::where('name', 'pozos')->first();
        $costo = Variable::where('name', 'costo')->first();

        $varsMap = [
            'm2' => $m2?->id,
            'pozos' => $pozos?->id,
            'costo' => $costo?->id,
        ];

        $servicesFormulas = [
            // 1. PLANOS 2D
            'PLANOS 2D' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 20.99) ? 'AF' : ((m2 >= 21 and m2 <= 29.99) ? 19 : ((m2 >= 30 and m2 <= 50.99) ? 22 : ((m2 >= 51 and m2 <= 200.99) ? 12 : ((m2 >= 201 and m2 <= 500.99) ? 12 : ((m2 >= 501 and m2 <= 1000.99) ? 10 : ((m2 >= 1001 and m2 <= 2000.99) ? 7 : ((m2 >= 2001 and m2 <= 6000.99) ? 5 : ((m2 >= 6001 and m2 <= 15000.99) ? 5 : 0))))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 20.99) ? 600 : ((m2 >= 21 and m2 <= 29.99) ? (m2 * 19) : ((m2 >= 30 and m2 <= 50.99) ? (m2 * 22) : ((m2 >= 51 and m2 <= 500.99) ? (m2 * 12) : ((m2 >= 501 and m2 <= 1000.99) ? (m2 * 10) : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 7) : ((m2 >= 2001 and m2 <= 6000.99) ? (m2 * 5) : 0)))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 2. DISEÑO ARQUITECTÓNICO
            'DISEÑO ARQUITECTÓNICO' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 20.99) ? 'AF' : ((m2 >= 21 and m2 <= 29.99) ? 'AF' : ((m2 >= 30 and m2 <= 50.99) ? 56 : ((m2 >= 51 and m2 <= 200.99) ? 38 : ((m2 >= 201 and m2 <= 500.99) ? 24.5 : ((m2 >= 501 and m2 <= 1000.99) ? 21 : ((m2 >= 1001 and m2 <= 2000.99) ? 16.5 : ((m2 >= 2001 and m2 <= 6000.99) ? 11.5 : ((m2 >= 6001 and m2 <= 15000.99) ? 10 : 0))))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 20.99) ? 1600 : ((m2 >= 21 and m2 <= 29.99) ? 1600 : ((m2 >= 30 and m2 <= 50.99) ? (m2 * 56) : ((m2 >= 51 and m2 <= 200.99) ? (m2 * 38) : ((m2 >= 201 and m2 <= 500.99) ? (m2 * 24.5) : ((m2 >= 501 and m2 <= 1000.99) ? (m2 * 21) : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 16.5) : ((m2 >= 2001 and m2 <= 6000.99) ? (m2 * 11.5) : ((m2 >= 6001 and m2 <= 12000.99) ? (m2 * 10) : 0)))))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 3. DISEÑO DE FACHADA
            'DISEÑO DE FACHADA' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 20.99) ? 'AF' : ((m2 >= 21 and m2 <= 29.99) ? 'AF' : ((m2 >= 30 and m2 <= 50.99) ? 'AF' : ((m2 >= 51 and m2 <= 200.99) ? 25 : ((m2 >= 201 and m2 <= 500.99) ? 19.5 : ((m2 >= 501 and m2 <= 1000.99) ? 14.5 : ((m2 >= 1001 and m2 <= 2000.99) ? 13 : ((m2 >= 2001 and m2 <= 6000.99) ? 10.5 : ((m2 >= 6001 and m2 <= 15000.99) ? 10.5 : 0))))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 20.99) ? 1200 : ((m2 >= 21 and m2 <= 29.99) ? 1200 : ((m2 >= 30 and m2 <= 50.99) ? 1200 : ((m2 >= 51 and m2 <= 200.99) ? (m2 * 25) : ((m2 >= 201 and m2 <= 500.99) ? (m2 * 19.5) : ((m2 >= 501 and m2 <= 1000.99) ? (m2 * 14.5) : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 13) : ((m2 > 2001 and m2 <= 6000.99) ? (m2 * 10.5) : ((m2 >= 6001 and m2 <= 15000.99) ? (m2 * 1.3 * 6.96) : 0)))))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 4. DISEÑO DE INTERIORES
            'DISEÑO DE INTERIORES' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 50.99) ? 'AF' : ((m2 >= 51 and m2 <= 100.99) ? 'AF' : ((m2 >= 101 and m2 <= 250.99) ? 'AF' : ((m2 >= 251 and m2 <= 500.99) ? 27 : ((m2 >= 501 and m2 <= 2000.99) ? 21 : ((m2 >= 2001 and m2 <= 6000.99) ? 14.5 : ((m2 >= 6001 and m2 <= 15000.99) ? 14.5 : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 50.99) ? 5770 : ((m2 >= 51 and m2 <= 100.99) ? 6830 : ((m2 >= 101 and m2 <= 250.99) ? 7890 : ((m2 >= 251 and m2 <= 500.99) ? (m2 * 27) : ((m2 >= 501 and m2 <= 2000.99) ? (m2 * 21) : ((m2 >= 2001 and m2 <= 6000.99) ? (m2 * 14.5) : ((m2 >= 6001 and m2 <= 15000.99) ? (m2 * 14.5) : 0)))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 5. PLANOS ELÉCTRICOS
            'PLANOS ELÉCTRICOS' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 50.99) ? 'AF' : ((m2 >= 51 and m2 <= 200.99) ? 30 : ((m2 >= 201 and m2 <= 500.99) ? 23.5 : ((m2 >= 501 and m2 <= 1000.99) ? 20 : ((m2 >= 1001 and m2 <= 2000.99) ? 15.5 : ((m2 >= 2001 and m2 <= 6000.99) ? 10.5 : ((m2 >= 6001 and m2 <= 15000.99) ? 1.4 : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 50.99) ? 1600 : ((m2 >= 51 and m2 <= 200.99) ? (m2 * 30) : ((m2 >= 201 and m2 <= 500.99) ? (m2 * 23.5) : ((m2 >= 501 and m2 <= 1000.99) ? (m2 * 20) : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 15.5) : ((m2 >= 2001 and m2 <= 6000.99) ? (m2 * 10.5) : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 6. PLANOS HIDROSANITARIOS
            'PLANOS HIDROSANITARIOS' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 50.99) ? 'AF' : ((m2 >= 51 and m2 <= 200.99) ? 30 : ((m2 >= 201 and m2 <= 500.99) ? 23.5 : ((m2 >= 501 and m2 <= 1000.99) ? 20 : ((m2 >= 1001 and m2 <= 2000.99) ? 15.5 : ((m2 >= 2001 and m2 <= 6000.99) ? 10.5 : ((m2 >= 6001 and m2 <= 15000.99) ? 10.5 : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 50.99) ? 1600 : ((m2 >= 51 and m2 <= 200.99) ? (m2 * 30) : ((m2 >= 201 and m2 <= 500.99) ? (m2 * 23.5) : ((m2 >= 501 and m2 <= 1000.99) ? (m2 * 20) : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 15.5) : ((m2 >= 2001 and m2 <= 15000.99) ? (m2 * 10.5) : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 7. CÁLCULO ESTRUCTURAL
            'CÁLCULO ESTRUCTURAL' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 50.99) ? 'AF' : ((m2 >= 51 and m2 <= 200.99) ? 30 : ((m2 >= 201 and m2 <= 500.99) ? 23.5 : ((m2 >= 501 and m2 <= 1000.99) ? 20 : ((m2 >= 1001 and m2 <= 2000.99) ? 15.5 : ((m2 >= 2001 and m2 <= 6000.99) ? 10.5 : ((m2 >= 6001 and m2 <= 15000.99) ? 10.5 : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 50.99) ? 1600 : ((m2 >= 51 and m2 <= 200.99) ? (m2 * 30) : ((m2 >= 201 and m2 <= 500.99) ? (m2 * 23.5) : ((m2 >= 501 and m2 <= 1000.99) ? (m2 * 20) : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 15.5) : ((m2 >= 2001 and m2 <= 15000.99) ? (m2 * 10.5) : 0))))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 8. CÓMPUTO Y PRESUPUESTO DE OBRA
            'CÓMPUTO Y PRESUPUESTO DE OBRA' => [
                [
                    'code' => 'bs_m2',
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 200.99) ? 'AF' : ((m2 >= 201 and m2 <= 500.99) ? 'AF' : ((m2 >= 501 and m2 <= 1000.99) ? 'AF' : ((m2 >= 1001 and m2 <= 2000.99) ? 5.5 : ((m2 >= 2001 and m2 <= 6000.99) ? 4 : ((m2 >= 6001 and m2 <= 15000.99) ? 4 : 0)))))",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 200.99) ? 4000 : ((m2 >= 201 and m2 <= 500.99) ? 4500 : ((m2 >= 501 and m2 <= 1000.99) ? 5500 : ((m2 >= 1001 and m2 <= 2000.99) ? (m2 * 5.5) : ((m2 >= 2001 and m2 <= 15000.99) ? (m2 * 4) : 0)))))",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 9. ESTUDIO DE SUELOS GEOLÓGICO - GEOTÉCNICO
            'ESTUDIO DE SUELOS GEOLÓGICO - GEOTÉCNICO' => [
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((pozos >= 1 and pozos <= 7) ? (pozos * 2500) : 0)",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['pozos'],
                ],
            ],

            // 10. TRÁMITES
            'TRÁMITES' => [
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "costo",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['costo'],
                ],
            ],

            // 11. LEVANTAMIENTO TOPOGRÁFICO GEOREFERENCIADO
            'LEVANTAMIENTO TOPOGRÁFICO GEOREFERENCIADO' => [
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "costo",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['costo'],
                ],
            ],

            // 12. CONSTRUCCIÓN EN OBRA GRUESA
            'CONSTRUCCIÓN EN OBRA GRUESA' => [
                [
                    'code' => 'mano_obra',
                    'name' => 'MANO DE OBRA',
                    'expression' => "m2 * 660",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "m2 * 1950",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 13. CONSTRUCCIÓN EN OBRA FINA
            'CONSTRUCCIÓN EN OBRA FINA' => [
                [
                    'code' => 'mano_obra',
                    'name' => 'MANO DE OBRA',
                    'expression' => "m2 * 760",
                    'is_visible' => true,
                    'is_subtotal' => false,
                    'variables' => ['m2'],
                ],
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "m2 * 3600",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],

            // 14. CONSTRUCCIÓN TOTAL
            'CONSTRUCCIÓN TOTAL' => [
                [
                    'code' => 'inversion_bs',
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "m2 * 5950",
                    'is_visible' => true,
                    'is_subtotal' => true,
                    'variables' => ['m2'],
                ],
            ],
        ];

        foreach ($servicesFormulas as $serviceName => $formulas) {
            $service = Service::where('name', $serviceName)
                ->when($serviceName === 'DISEÑO ARQUITECTÓNICO', fn ($q) => $q->orWhere('name', 'DISEÑO ARQUITECTÓNICO 3D'))
                ->first();

            if (! $service) {
                continue;
            }

            foreach ($formulas as $formulaData) {
                $varNames = $formulaData['variables'] ?? [];

                $formula = Formula::updateOrCreate(
                    [
                        'service_id' => $service->id,
                        'code' => $formulaData['code'],
                    ],
                    [
                        'name' => $formulaData['name'],
                        'expression' => $formulaData['expression'],
                        'is_visible' => $formulaData['is_visible'],
                        'is_subtotal' => $formulaData['is_subtotal'],
                    ]
                );

                $varIds = array_values(array_filter(array_map(fn ($v) => $varsMap[$v] ?? null, $varNames)));
                $formula->variables()->sync($varIds);
            }
        }
    }
}
