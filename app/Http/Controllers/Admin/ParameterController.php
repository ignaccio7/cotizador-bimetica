<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParameterController extends Controller
{
    /**
     * Display a listing of global parameters and city per diems (viáticos).
     */
    public function index(): Response
    {
        $parameters = [
            [
                'id' => 1,
                'key' => 'tipo_cambio_usd_bob',
                'label' => 'Tipo de Cambio Oficial (USD / BOB)',
                'value' => '6.96',
                'category' => 'Financiero',
                'description' => 'Tasa de conversión utilizada para presupuestos expresados en moneda nacional.',
            ],
            [
                'id' => 2,
                'key' => 'moneda_defecto',
                'label' => 'Moneda Base del Sistema',
                'value' => 'USD',
                'category' => 'Financiero',
                'description' => 'Moneda de referencia para cotizaciones y catálogo.',
            ],
            [
                'id' => 3,
                'key' => 'redondeo_alza',
                'label' => 'Redondeo Automático hacia arriba',
                'value' => 'true',
                'category' => 'Cálculo',
                'description' => 'Redondea los montos totales al entero o decena superior.',
            ],
        ];

        $cities = [
            ['id' => 1, 'city' => 'La Paz / El Alto', 'viatico' => 0.00, 'is_local' => true, 'notes' => 'Sede central — Sin viáticos adicionales'],
            ['id' => 2, 'city' => 'Santa Cruz de la Sierra', 'viatico' => 350.00, 'is_local' => false, 'notes' => 'Incluye pasajes aéreos y hospedaje técnico'],
            ['id' => 3, 'city' => 'Cochabamba', 'viatico' => 280.00, 'is_local' => false, 'notes' => 'Incluye traslado y viático de campo'],
            ['id' => 4, 'city' => 'Tarija', 'viatico' => 420.00, 'is_local' => false, 'notes' => 'Traslado aéreo e inspección de sitio'],
            ['id' => 5, 'city' => 'Sucre / Chuquisaca', 'viatico' => 380.00, 'is_local' => false, 'notes' => 'Inspección técnica preliminar'],
            ['id' => 6, 'city' => 'Oruro / Potosí', 'viatico' => 250.00, 'is_local' => false, 'notes' => 'Traslado terrestre e inspección'],
        ];

        return Inertia::render('admin/parameters/index', [
            'parameters' => $parameters,
            'cities' => $cities,
        ]);
    }
}
