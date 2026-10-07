<?php

namespace App\Http\Controllers;

use App\Models\Client;
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
        $dbClients = Client::all();
        $clients = $dbClients->isNotEmpty()
            ? $dbClients->map(fn ($c) => [
                'id' => $c->id,
                'code' => $c->code,
                'name' => $c->full_name,
                'ci' => $c->ci ?? '',
                'phone' => $c->phone ?? '',
                'address' => $c->address ?? '',
                'occupation' => $c->occupation ?? '',
            ])->toArray()
            : [
                [
                    'id' => 1,
                    'code' => '084/2026',
                    'name' => 'JANETH / EUNICE MIRANDA NAVIA',
                    'ci' => '76734409 LP',
                    'phone' => '76734409',
                    'address' => 'BAJO SAN ANTONIO',
                    'occupation' => 'COMERCIANTE',
                ],
                [
                    'id' => 2,
                    'code' => '014/2026',
                    'name' => 'Arq. Carlos Meneses',
                    'ci' => '4829103 LP',
                    'phone' => '+591 76543210',
                    'address' => 'Av. Ballivián #1230, Calacoto, La Paz',
                    'occupation' => 'Arquitecto Independiente',
                ],
            ];

        $servicesCatalog = [
            [
                'id' => 1,
                'name' => 'Planos 2D',
                'description' => 'Esquema hidrosanitario y eléctrico ampliado.',
                'rate_bs' => 18.00,
                'scope' => [
                    '1) Levantamiento planimétrico y distribución funcional 2D detallada.',
                    '2) Planos completos en formato AutoCAD (DWG) y PDF listos para replanteo.',
                    '3) Esquemas de instalaciones sanitarias y eléctricas básicas ampliadas.',
                    '4) Memoria técnica descriptiva y especificaciones generales de replanteo.',
                ],
                'note' => 'NOTA: NO INCLUYE VISADO MUNICIPAL.',
            ],
            [
                'id' => 2,
                'name' => 'Diseño Arquitectónico',
                'description' => 'Estudio bioclimático de asoleamiento y materiales.',
                'rate_bs' => 24.00,
                'scope' => [
                    '1) Catálogo físico encuadernado de presentación.',
                    '2) Planos completos en formato AutoCAD (DWG) y PDF listos para replanteo.',
                    '3) Modelador Digital en BIMX para visualización interactiva móvil/tablet.',
                    '4) Planos Arquitectónicos de: Esquema de Fundaciones, Planos de Plantas acotadas, Planos de Cortes técnicos, Planos de Elevaciones de Fachadas, Plano de Sitio y Techo con Sistema de desalojo de aguas pluviales o servidas.',
                    '5) Renders 3D fotorrealistas de Interiores y Exteriores en alta resolución.',
                    '6) Recorrido Virtual 360° Inmersivo.',
                    '7) Presupuesto Tentativo y Cómputos Métricos de Construcción.',
                ],
                'note' => 'NOTA: NO INCLUYE VISADO MUNICIPAL.',
            ],
            [
                'id' => 3,
                'name' => 'Cálculo Estructural',
                'description' => 'Cálculo de armaduras, zapatas y memorias sísmicas.',
                'rate_bs' => 23.50,
                'scope' => [
                    '1) Planos estructurales de: Vigas de fundación, Losas de fundación, Zapatas, Muros, Escaleras, Losas y Columnas.',
                    '2) Memorias de Cálculo Estructural con modelado analítico y combinaciones de cargas NB 1225001.',
                    '3) Plan de contingencias y verificación de cargas sísmicas y de viento.',
                    '4) Formulario Resumen de Cálculo Estructural (Alcaldía).',
                    '5) Especificaciones técnicas y recomendaciones de resistencia de hormigón y aceros.',
                ],
                'note' => 'NOTA: NO INCLUYE VISADO COLEGIAL NI TRÁMITES MUNICIPALES.',
            ],
            [
                'id' => 4,
                'name' => 'Diseño de Interiores',
                'description' => 'Ambientación interior, especificaciones de iluminación y mobiliario.',
                'rate_bs' => 20.00,
                'scope' => [
                    '1) Planos de distribución funcional interior y circulaciones.',
                    '2) Especificaciones de iluminación técnica, acabados y paleta de color.',
                    '3) Planos de detalle constructivo de mobiliario fijo a medida.',
                    '4) Renders interiores 3D fotorrealistas de alta resolución.',
                ],
                'note' => 'NOTA: NO INCLUYE COMPRA DIRECTA DE MOBILIARIO.',
            ],
            [
                'id' => 5,
                'name' => 'Estudio de Suelos (Geotecnia)',
                'description' => 'Sondeos SPT, ensayos de laboratorio y capacidad portante.',
                'rate_bs' => 15.00,
                'scope' => [
                    '1) Perforaciones y sondeos SPT en sitio según área de emplazamiento.',
                    '2) Ensayos de laboratorio de mecánica de suelos y granulometría.',
                    '3) Determinación de capacidad portante admisible del terreno.',
                    '4) Memoria de recomendaciones geotécnicas para zapatas y losas.',
                ],
                'note' => 'NOTA: INCLUYE TRASLADO DE EQUIPO DE PERFORACIÓN.',
            ],
            [
                'id' => 6,
                'name' => 'Trámites y Aprobación Municipal',
                'description' => 'Gestión y visado ante Colegio de Arquitectos y Alcaldía.',
                'rate_bs' => 10.00,
                'scope' => [
                    '1) Armado y visado técnico de carpetas ante el Colegio de Arquitectos.',
                    '2) Ingreso formal del expediente ante el Gobierno Autónomo Municipal.',
                    '3) Seguimiento de observaciones y subsanaciones técnicas.',
                    '4) Entrega final de planos aprobados y resolución administrativa.',
                ],
                'note' => 'NOTA: NO INCLUYE VALORES NI TASAS FISCALES MUNICIPALES.',
            ],
        ];

        $cities = [
            ['id' => 1, 'name' => 'URBANA CENTRAL (INCLUIDO)', 'viatico' => 0],
            ['id' => 2, 'name' => 'La Paz / El Alto', 'viatico' => 0],
            ['id' => 3, 'name' => 'Santa Cruz', 'viatico' => 350],
            ['id' => 4, 'name' => 'Cochabamba', 'viatico' => 280],
            ['id' => 5, 'name' => 'Tarija', 'viatico' => 420],
            ['id' => 6, 'name' => 'Sucre', 'viatico' => 380],
        ];

        return Inertia::render('quotes/create', [
            'clients' => $clients,
            'servicesCatalog' => $servicesCatalog,
            'cities' => $cities,
        ]);
    }
}
