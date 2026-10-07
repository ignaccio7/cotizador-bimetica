<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    /**
     * Display a listing of quotes (Mis Cotizaciones).
     */
    public function index(): Response
    {
        $quotes = [
            [
                'id' => 1,
                'code' => 'COT-2026-0042',
                'client_code' => '014/2026',
                'client_name' => 'Arq. Carlos Meneses',
                'project_name' => 'Residencia Calacoto Unifamiliar',
                'status' => 'contract_generated',
                'status_label' => 'Contrato Generado',
                'total_amount' => 4850.00,
                'currency' => 'USD',
                'services_count' => 3,
                'services' => ['Planos 2D', 'Diseño Arquitectónico', 'Cálculo Estructural'],
                'created_at' => '2026-10-04',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
            [
                'id' => 2,
                'code' => 'COT-2026-0041',
                'client_code' => '012/2026',
                'client_name' => 'Ing. Valeria Prado',
                'project_name' => 'Edificio Residencial Las Palmas',
                'status' => 'initial_form',
                'status_label' => 'Formulario Inicial',
                'total_amount' => 12400.00,
                'currency' => 'USD',
                'services_count' => 4,
                'services' => ['Diseño Arquitectónico', 'Cálculo Estructural', 'Planos Eléctricos', 'Planos Hidrosanitarios'],
                'created_at' => '2026-10-02',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
            [
                'id' => 3,
                'code' => 'COT-2026-0039',
                'client_code' => '009/2026',
                'client_name' => 'Dr. Marcelo Fernández',
                'project_name' => 'Clínica Odontológica Miraflores',
                'status' => 'draft',
                'status_label' => 'Borrador',
                'total_amount' => 3100.00,
                'currency' => 'USD',
                'services_count' => 2,
                'services' => ['Diseño de Interiores', 'Diseño de Fachada'],
                'created_at' => '2026-09-28',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
            [
                'id' => 4,
                'code' => 'COT-2026-0035',
                'client_code' => '005/2026',
                'client_name' => 'Constructora Alianza S.R.L.',
                'project_name' => 'Condominio Campestre Los Álamos',
                'status' => 'designated',
                'status_label' => 'Designado a Proyecto',
                'total_amount' => 18900.00,
                'currency' => 'USD',
                'services_count' => 5,
                'services' => ['Diseño Arquitectónico', 'Estudio de Suelos', 'Cálculo Estructural', 'Cómputo y Presupuesto', 'Trámites'],
                'created_at' => '2026-09-22',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
        ];

        $stats = [
            'total_quoted' => 39250.00,
            'active_quotes' => count($quotes),
            'in_draft' => 1,
            'formalized' => 3,
        ];

        return Inertia::render('quotes/index', [
            'quotes' => $quotes,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new quote (Nueva Cotización).
     */
    public function create(): Response
    {
        $clients = [
            [
                'id' => 1,
                'code' => '014/2026',
                'name' => 'Arq. Carlos Meneses',
                'ci' => '4829103 LP',
                'phone' => '+591 76543210',
                'address' => 'Av. Ballivián #1230, Calacoto, La Paz',
            ],
            [
                'id' => 2,
                'code' => '012/2026',
                'name' => 'Ing. Valeria Prado',
                'ci' => '5928192 SC',
                'phone' => '+591 78901234',
                'address' => 'Barrio Las Palmas, Calle 4 #12, Santa Cruz',
            ],
            [
                'id' => 3,
                'code' => '009/2026',
                'name' => 'Dr. Marcelo Fernández',
                'ci' => '3920194 CB',
                'phone' => '+591 71234567',
                'address' => 'Av. América #450, Cochabamba',
            ],
        ];

        $servicesCatalog = [
            [
                'id' => 1,
                'name' => 'Planos 2D',
                'description' => 'Levantamiento planimétrico y distribución funcional 2D detallada.',
                'uses_floors' => true,
                'variables' => [
                    ['name' => 'm2', 'label' => 'Superficie Total (m²)', 'type' => 'number', 'default' => 250],
                    ['name' => 'complejidad', 'label' => 'Nivel de Complejidad (1-1.5)', 'type' => 'number', 'default' => 1],
                ],
                'base_price' => 850.00,
            ],
            [
                'id' => 2,
                'name' => 'Diseño Arquitectónico',
                'description' => 'Diseño integral conceptual, espacial y volumétrico 3D de alta gama.',
                'uses_floors' => true,
                'variables' => [
                    ['name' => 'm2', 'label' => 'Superficie Total (m²)', 'type' => 'number', 'default' => 250],
                    ['name' => 'renders_extra', 'label' => 'Renders adicionales', 'type' => 'number', 'default' => 0],
                ],
                'base_price' => 2400.00,
            ],
            [
                'id' => 3,
                'name' => 'Cálculo Estructural',
                'description' => 'Modelado estructural, memoria de cálculo sísmico y planos de armaduras.',
                'uses_floors' => true,
                'variables' => [
                    ['name' => 'm2', 'label' => 'Superficie Cubierta (m²)', 'type' => 'number', 'default' => 250],
                    ['name' => 'pisos_altura', 'label' => 'Número de Niveles', 'type' => 'number', 'default' => 2],
                ],
                'base_price' => 1600.00,
            ],
            [
                'id' => 4,
                'name' => 'Diseño de Interiores',
                'description' => 'Ambientación, materiales, iluminación y planos de detalle de mobiliario.',
                'uses_floors' => false,
                'variables' => [
                    ['name' => 'ambientes', 'label' => 'Cantidad de Ambientes', 'type' => 'number', 'default' => 4],
                ],
                'base_price' => 1200.00,
            ],
            [
                'id' => 5,
                'name' => 'Trámites y Aprobación Municipal',
                'description' => 'Gestión y visado ante el Colegio de Arquitectos y Gobierno Municipal.',
                'uses_floors' => false,
                'variables' => [
                    ['name' => 'visado_colegio', 'label' => 'Incluye sellos visados (1: Sí, 0: No)', 'type' => 'number', 'default' => 1],
                ],
                'base_price' => 500.00,
            ],
        ];

        $cities = [
            ['id' => 1, 'name' => 'La Paz / El Alto', 'viatico' => 0],
            ['id' => 2, 'name' => 'Santa Cruz', 'viatico' => 350],
            ['id' => 3, 'name' => 'Cochabamba', 'viatico' => 280],
            ['id' => 4, 'name' => 'Tarija', 'viatico' => 420],
            ['id' => 5, 'name' => 'Sucre', 'viatico' => 380],
        ];

        return Inertia::render('quotes/create', [
            'clients' => $clients,
            'servicesCatalog' => $servicesCatalog,
            'cities' => $cities,
        ]);
    }
}
