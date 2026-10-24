<?php

namespace Database\Seeders;

use App\Models\Parameter;
use Illuminate\Database\Seeder;

class ParameterSeeder extends Seeder
{
    /**
     * Run the database seeds for global system parameters.
     */
    public function run(): void
    {
        $parameters = [
            // ──────────────────────────────────────────────
            // 1. Viáticos por Ciudad (Bolivia)
            // ──────────────────────────────────────────────
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'La Paz (Área Metropolitana)',
                'type'        => 'number',
                'value'       => 0.00,
                'description' => 'Sin viático — sede principal',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'El Alto (Urbana)',
                'type'        => 'number',
                'value'       => 0.00,
                'description' => 'Sin viático — conurbación La Paz',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Viacha / Patacamaya',
                'type'        => 'number',
                'value'       => 200.00,
                'description' => 'Viático zona altiplánica cercana',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Oruro',
                'type'        => 'number',
                'value'       => 300.00,
                'description' => 'Viático departamento Oruro',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Cochabamba (Centro / Valles)',
                'type'        => 'number',
                'value'       => 450.00,
                'description' => 'Viático Cochabamba urbana y valles',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Sucre / Chuquisaca',
                'type'        => 'number',
                'value'       => 500.00,
                'description' => 'Viático Sucre y valles del sur',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Santa Cruz de la Sierra',
                'type'        => 'number',
                'value'       => 600.00,
                'description' => 'Viático Santa Cruz urbano',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Potosí',
                'type'        => 'number',
                'value'       => 400.00,
                'description' => 'Viático Potosí y alrededores',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Tarija',
                'type'        => 'number',
                'value'       => 550.00,
                'description' => 'Viático Tarija y Chaco',
            ],
            [
                'group'       => 'viatico',
                'group_label' => 'Viáticos por Ciudad',
                'name'        => 'Beni / Trinidad',
                'type'        => 'number',
                'value'       => 700.00,
                'description' => 'Viático Beni y región amazónica',
            ],

            // ──────────────────────────────────────────────
            // 2. Categorías de Proyecto Arquitectónico
            // ──────────────────────────────────────────────
            [
                'group'       => 'project_category',
                'group_label' => 'Categoría del Proyecto',
                'name'        => 'Residencial',
                'type'        => 'number',
                'value'       => 1.00,
                'description' => 'Viviendas unifamiliares, condominios y edificios residenciales',
            ],
            [
                'group'       => 'project_category',
                'group_label' => 'Categoría del Proyecto',
                'name'        => 'Comercial',
                'type'        => 'number',
                'value'       => 1.15,
                'description' => 'Locales, oficinas, centros comerciales y restaurantes',
            ],
            [
                'group'       => 'project_category',
                'group_label' => 'Categoría del Proyecto',
                'name'        => 'Industrial',
                'type'        => 'number',
                'value'       => 1.25,
                'description' => 'Naves industriales, almacenes, galpones y talleres',
            ],
            [
                'group'       => 'project_category',
                'group_label' => 'Categoría del Proyecto',
                'name'        => 'Salud',
                'type'        => 'number',
                'value'       => 1.30,
                'description' => 'Clínicas, centros médicos, consultorios y laboratorios',
            ],
            [
                'group'       => 'project_category',
                'group_label' => 'Categoría del Proyecto',
                'name'        => 'Educación',
                'type'        => 'number',
                'value'       => 1.10,
                'description' => 'Colegios, centros de formación, guarderías y bibliotecas',
            ],

            // ──────────────────────────────────────────────
            // 3. Descuentos Comerciales
            // ──────────────────────────────────────────────
            [
                'group'       => 'discount',
                'group_label' => 'Descuentos Comerciales',
                'name'        => 'Sin Descuento (0%)',
                'type'        => 'percentage',
                'value'       => 0.00,
                'description' => 'Tarifa regular estándar sin descuento',
            ],
            [
                'group'       => 'discount',
                'group_label' => 'Descuentos Comerciales',
                'name'        => 'Descuento 5%',
                'type'        => 'percentage',
                'value'       => 5.00,
                'description' => 'Descuento comercial básico del 5%',
            ],
            [
                'group'       => 'discount',
                'group_label' => 'Descuentos Comerciales',
                'name'        => 'Descuento 10%',
                'type'        => 'percentage',
                'value'       => 10.00,
                'description' => 'Descuento comercial preferencial del 10%',
            ],
            [
                'group'       => 'discount',
                'group_label' => 'Descuentos Comerciales',
                'name'        => 'Descuento 15%',
                'type'        => 'percentage',
                'value'       => 15.00,
                'description' => 'Descuento especial por paquete o volumen del 15%',
            ],
            [
                'group'       => 'discount',
                'group_label' => 'Descuentos Comerciales',
                'name'        => 'Descuento 20%',
                'type'        => 'percentage',
                'value'       => 20.00,
                'description' => 'Descuento corporativo máximo del 20%',
            ],
        ];

        foreach ($parameters as $param) {
            Parameter::updateOrCreate(
                [
                    'group' => $param['group'],
                    'name'  => $param['name'],
                ],
                [
                    'group_label' => $param['group_label'],
                    'type'        => $param['type'],
                    'value'       => $param['value'],
                    'description' => $param['description'],
                    'is_active'   => true,
                ]
            );
        }
    }
}
