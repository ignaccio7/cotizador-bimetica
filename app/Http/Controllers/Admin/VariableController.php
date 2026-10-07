<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VariableController extends Controller
{
    /**
     * Display a listing of system variables (static and dynamic).
     */
    public function index(): Response
    {
        $variables = [
            [
                'id' => 1,
                'name' => 'm2',
                'label' => 'Superficie en Metros Cuadrados',
                'type' => 'dynamic',
                'data_type' => 'number',
                'default_value' => null,
                'description' => 'Área total o cubierta ingresada por el vendedor o derivada de los grupos de pisos.',
                'used_in_formulas' => ['Planos 2D', 'Diseño Arquitectónico 3D', 'Cálculo Estructural'],
            ],
            [
                'id' => 2,
                'name' => 'complejidad',
                'label' => 'Factor de Complejidad Geométrica',
                'type' => 'dynamic',
                'data_type' => 'number',
                'default_value' => 1.0,
                'description' => 'Multiplicador entre 1.0 (regular) y 1.5 (irregular/terreno con pendiente pronunciada).',
                'used_in_formulas' => ['Planos 2D'],
            ],
            [
                'id' => 3,
                'name' => 'pisos_altura',
                'label' => 'Cantidad de Pisos / Niveles',
                'type' => 'dynamic',
                'data_type' => 'integer',
                'default_value' => 2,
                'description' => 'Número de plantas del proyecto para cálculo de esfuerzo sísmico.',
                'used_in_formulas' => ['Cálculo Estructural'],
            ],
            [
                'id' => 4,
                'name' => 'pozos',
                'label' => 'Cantidad de Pozos SPT',
                'type' => 'dynamic',
                'data_type' => 'integer',
                'default_value' => 3,
                'description' => 'Puntos de ensayo geotécnico para el estudio de suelos.',
                'used_in_formulas' => ['Estudio de Suelos'],
            ],
            [
                'id' => 5,
                'name' => 'factor_seguridad_obra',
                'label' => 'Factor de Contingencia Técnico',
                'type' => 'static',
                'data_type' => 'number',
                'default_value' => 1.05,
                'description' => 'Margen del 5% aplicado como constante del catálogo.',
                'used_in_formulas' => [],
            ],
        ];

        return Inertia::render('admin/variables/index', [
            'variables' => $variables,
        ]);
    }
}
