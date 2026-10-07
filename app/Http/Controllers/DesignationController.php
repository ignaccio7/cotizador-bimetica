<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DesignationController extends Controller
{
    /**
     * Display a listing of technical project designations.
     */
    public function index(): Response
    {
        $designations = [
            [
                'id' => 1,
                'code' => 'DSG-2026-0014',
                'quote_code' => 'COT-2026-0042',
                'client_code' => '014/2026',
                'client_name' => 'Arq. Carlos Meneses',
                'project_name' => 'Residencia Calacoto Unifamiliar',
                'designated_date' => '2026-10-06',
                'delivery_deadline' => '2026-11-20',
                'seller_coordinator' => 'Nestor Ignacio Rojas',
                'technical_notes' => 'Priorizar estudio de asoleamiento en fachada oeste. Entregar primer borrador de plantas 2D antes del 20 de octubre.',
                'status' => 'in_progress',
                'status_label' => 'En Ejecución Técnica',
            ],
            [
                'id' => 2,
                'code' => 'DSG-2026-0012',
                'quote_code' => 'COT-2026-0035',
                'client_code' => '005/2026',
                'client_name' => 'Constructora Alianza S.R.L.',
                'project_name' => 'Condominio Campestre Los Álamos',
                'designated_date' => '2026-09-25',
                'delivery_deadline' => '2026-12-15',
                'seller_coordinator' => 'Nestor Ignacio Rojas',
                'technical_notes' => 'El suelo presenta arcillas expansivas en estrato superior. Coordinar con laboratorio de mecánica de suelos antes del prediseño de zapatas.',
                'status' => 'in_progress',
                'status_label' => 'En Ejecución Técnica',
            ],
        ];

        return Inertia::render('designations/index', [
            'designations' => $designations,
        ]);
    }
}
