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
        $m2Variable = Variable::where('name', 'm2')->first();
        $variableIds = $m2Variable ? [$m2Variable->id] : [];

        // ─────────────────────────────────────────────────────────────
        // 1. Servicio: DISEÑO ARQUITECTÓNICO 3D
        // ─────────────────────────────────────────────────────────────
        $design3d = Service::where('name', 'DISEÑO ARQUITECTÓNICO 3D')->first();

        if ($design3d) {
            // #1 BS /M2
            $f1 = Formula::updateOrCreate(
                [
                    'service_id' => $design3d->id,
                    'code' => 'bs_m2',
                ],
                [
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 < 30) ? 'AF' : (m2 >= 30 and m2 <= 50.99) ? 56 : (m2 >= 51 and m2 <= 200.99) ? 38 : (m2 >= 201 and m2 <= 500.99) ? 24.5 : (m2 >= 501 and m2 <= 1000.99) ? 21 : (m2 >= 1001 and m2 <= 2000.99) ? 16.5 : (m2 >= 2001 and m2 <= 6000.99) ? 11.5 : (m2 >= 6001 and m2 <= 15000.99) ? 10 : 0",
                    'is_visible' => true,
                    'is_subtotal' => false,
                ]
            );
            $f1->variables()->sync($variableIds);

            // #2 INVERSIÓN BS. (Subtotal)
            $f2 = Formula::updateOrCreate(
                [
                    'service_id' => $design3d->id,
                    'code' => 'inversion_bs',
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 20.99) ? 1600 : (m2 >= 21 and m2 <= 29.99) ? 1600 : (m2 >= 30 and m2 <= 50.99) ? (m2 * 56) : (m2 >= 51 and m2 <= 200.99) ? (m2 * 38) : (m2 >= 201 and m2 <= 500.99) ? (m2 * 24.5) : (m2 >= 501 and m2 <= 1000.99) ? (m2 * 21) : (m2 >= 1001 and m2 <= 2000.99) ? (m2 * 16.5) : (m2 >= 2001 and m2 <= 6000.99) ? (m2 * 11.5) : (m2 >= 6001 and m2 <= 12000.99) ? (m2 * 10) : 0)",
                    'is_visible' => true,
                    'is_subtotal' => true,
                ]
            );
            $f2->variables()->sync($variableIds);
        }

        // ─────────────────────────────────────────────────────────────
        // 2. Servicio: CÁLCULO ESTRUCTURAL
        // ─────────────────────────────────────────────────────────────
        $calcEstructural = Service::where('name', 'CÁLCULO ESTRUCTURAL')->first();

        if ($calcEstructural) {
            // #1 BS /M2
            $f3 = Formula::updateOrCreate(
                [
                    'service_id' => $calcEstructural->id,
                    'code' => 'bs_m2',
                ],
                [
                    'name' => 'BS /M2',
                    'expression' => "(m2 >= 1 and m2 <= 50.99) ? 'AF' : (m2 >= 51 and m2 <= 200.99) ? 30 : (m2 >= 201 and m2 <= 500.99) ? 23.5 : (m2 >= 501 and m2 <= 1000.99) ? 20 : (m2 >= 1001 and m2 <= 2000.99) ? 15.5 : (m2 >= 2001 and m2 <= 6000.99) ? 10.5 : (m2 >= 6001 and m2 <= 15000.99) ? 10.5 : 0",
                    'is_visible' => true,
                    'is_subtotal' => false,
                ]
            );
            $f3->variables()->sync($variableIds);

            // #2 INVERSIÓN BS. (Subtotal)
            $f4 = Formula::updateOrCreate(
                [
                    'service_id' => $calcEstructural->id,
                    'code' => 'inversion_bs',
                ],
                [
                    'name' => 'INVERSIÓN BS.',
                    'expression' => "ceil((m2 >= 1 and m2 <= 50.99) ? 1600 : (m2 >= 51 and m2 <= 200.99) ? (m2 * 30) : (m2 >= 201 and m2 <= 500.99) ? (m2 * 23.5) : (m2 >= 501 and m2 <= 1000.99) ? (m2 * 20) : (m2 >= 1001 and m2 <= 2000.99) ? (m2 * 15.5) : (m2 >= 2001 and m2 <= 15000.99) ? (m2 * 10.5) : 0)",
                    'is_visible' => true,
                    'is_subtotal' => true,
                ]
            );
            $f4->variables()->sync($variableIds);
        }
    }
}
