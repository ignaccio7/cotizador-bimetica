<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractTemplateController extends Controller
{
    /**
     * Display a listing of contract templates with editable HTML and placeholders.
     */
    public function index(): Response
    {
        $templates = [
            [
                'id' => 1,
                'name' => 'Plantilla Maestra de Prestación de Servicios Arquitectónicos',
                'description' => 'Plantilla oficial BIMETICA para proyectos de arquitectura, diseño de interiores y cálculo estructural.',
                'version' => '2.4',
                'is_active' => true,
                'available_placeholders' => [
                    '{{cliente_nombre}}',
                    '{{cliente_ci}}',
                    '{{cliente_direccion}}',
                    '{{cliente_telefono}}',
                    '{{codigo_cliente}}',
                    '{{proyecto_nombre}}',
                    '{{direccion_proyecto}}',
                    '{{monto_total}}',
                    '{{modalidad_pago}}',
                    '{{servicios_contratados}}',
                    '{{plazo_entrega}}',
                    '{{fecha_actual}}',
                    '{{vendedor_nombre}}',
                ],
                'sample_clause' => 'CONTRATO PRIVADO DE PRESTACIÓN DE SERVICIOS PROFESIONALES DE ARQUITECTURA E INGENIERÍA que celebran, por una parte, BIMETICA DISEÑO Y CONSTRUCCIÓN, y por otra parte el/la Sr.(a) {{cliente_nombre}}, con documento de identidad {{cliente_ci}}...',
                'updated_at' => '2026-10-02',
            ],
        ];

        return Inertia::render('admin/contract-templates/index', [
            'templates' => $templates,
        ]);
    }
}
