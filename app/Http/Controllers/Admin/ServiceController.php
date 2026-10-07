<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of services and their calculation formulas.
     */
    public function index(): Response
    {
        $services = [
            [
                'id' => 1,
                'name' => 'Planos 2D (Arquitectónico 2D)',
                'description' => 'Levantamiento planimétrico y diseño arquitectónico 2D.',
                'formula' => 'm2 < 50 ? 1200 : (m2 * 24 * complejidad)',
                'variables' => ['m2', 'complejidad'],
                'is_active' => true,
                'updated_at' => '2026-10-01',
            ],
            [
                'id' => 2,
                'name' => 'Diseño Arquitectónico 3D + Renders',
                'description' => 'Propuesta volumétrica, espacial y modelo BIM 3D con visualización.',
                'formula' => 'm2 < 30 ? 1600 : (m2 * 56 + renders_extra * 150)',
                'variables' => ['m2', 'renders_extra'],
                'is_active' => true,
                'updated_at' => '2026-10-01',
            ],
            [
                'id' => 3,
                'name' => 'Cálculo Estructural y Planos de Armado',
                'description' => 'Análisis estructural estático y dinámico según norma CBH.',
                'formula' => 'm2 < 100 ? 1400 : (m2 * 18 * (1 + (pisos_altura - 1) * 0.15))',
                'variables' => ['m2', 'pisos_altura'],
                'is_active' => true,
                'updated_at' => '2026-09-28',
            ],
            [
                'id' => 4,
                'name' => 'Diseño de Interiores',
                'description' => 'Ambientación interior, especificaciones de iluminación y acabados.',
                'formula' => 'ambientes * 300',
                'variables' => ['ambientes'],
                'is_active' => true,
                'updated_at' => '2026-09-15',
            ],
            [
                'id' => 5,
                'name' => 'Estudio de Suelos (Geotecnia)',
                'description' => 'Sondeos SPT, ensayos de laboratorio y capacidad portante.',
                'formula' => 'pozos * 450 + 200',
                'variables' => ['pozos'],
                'is_active' => true,
                'updated_at' => '2026-08-30',
            ],
        ];

        return Inertia::render('admin/services/index', [
            'services' => $services,
        ]);
    }
}
