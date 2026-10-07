<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\ContractTemplate;
use App\Models\Formula;
use App\Models\Parameter;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Parámetros Globales
        $parameters = [
            [
                'name' => 'tipo_cambio',
                'type' => 'numeric',
                'default_value' => '6.96',
                'description' => 'Tipo de cambio oficial BOB por USD',
            ],
            [
                'name' => 'viatico_la_paz',
                'type' => 'numeric',
                'default_value' => '0',
                'description' => 'Viático fijo para La Paz / El Alto (USD)',
            ],
            [
                'name' => 'viatico_santa_cruz',
                'type' => 'numeric',
                'default_value' => '350',
                'description' => 'Viático fijo para Santa Cruz (USD)',
            ],
            [
                'name' => 'viatico_cochabamba',
                'type' => 'numeric',
                'default_value' => '280',
                'description' => 'Viático fijo para Cochabamba (USD)',
            ],
            [
                'name' => 'viatico_tarija',
                'type' => 'numeric',
                'default_value' => '420',
                'description' => 'Viático fijo para Tarija (USD)',
            ],
            [
                'name' => 'viatico_sucre',
                'type' => 'numeric',
                'default_value' => '380',
                'description' => 'Viático fijo para Sucre (USD)',
            ],
        ];

        foreach ($parameters as $param) {
            Parameter::updateOrCreate(['name' => $param['name']], $param);
        }

        // 2. Variables
        $variablesData = [
            ['name' => 'm2', 'type' => 'dynamic', 'default_value' => 250],
            ['name' => 'complejidad', 'type' => 'dynamic', 'default_value' => 1],
            ['name' => 'renders_extra', 'type' => 'dynamic', 'default_value' => 0],
            ['name' => 'pisos_altura', 'type' => 'dynamic', 'default_value' => 2],
            ['name' => 'ambientes', 'type' => 'dynamic', 'default_value' => 4],
            ['name' => 'pozos', 'type' => 'dynamic', 'default_value' => 3],
            ['name' => 'visado_colegio', 'type' => 'dynamic', 'default_value' => 1],
        ];

        $variablesMap = [];
        foreach ($variablesData as $var) {
            $created = Variable::updateOrCreate(['name' => $var['name']], $var);
            $variablesMap[$var['name']] = $created->id;
        }

        // 3. Servicios y Fórmulas
        $servicesData = [
            [
                'name' => 'PLANOS 2D',
                'description' => "1) Planos en autoCAD y PDF\n2) Esquema de Fundaciones,\n3) Planos de Plantas,\n4) Planos de Cortes,\n5) Planos de Elevaciones,\n6) Planos de Sitio y Techo con Sistema de desalojo de aguas pluviales y servidas,\nNo incluye Visado.",
                'formulas' => [
                    [
                        'name' => 'BS /M2',
                        'expression' => '18 * complejidad',
                        'is_visible' => true,
                        'variables' => ['complejidad'],
                    ],
                    [
                        'name' => 'INVERSIÓN BS.',
                        'expression' => 'm2 < 50 ? 1200 : (m2 * bs_m2)',
                        'is_visible' => true,
                        'variables' => ['m2'],
                    ],
                ],
            ],
            [
                'name' => 'DISEÑO ARQUITECTÓNICO 3D',
                'description' => "1) Modelado 3D BIM espacial y volumétrico del proyecto arquitectónico.\n2) Vistas axonométricas y perspectivas exteriores e interiores.\n3) Renderizado fotorrealista de alta resolución.\n4) Selección de materiales, texturas e iluminación natural.\nNo incluye Visado.",
                'formulas' => [
                    [
                        'name' => 'BS /M2',
                        'expression' => '56',
                        'is_visible' => true,
                        'variables' => [],
                    ],
                    [
                        'name' => 'INVERSIÓN BS.',
                        'expression' => 'm2 < 30 ? 1600 : (m2 * bs_m2 + renders_extra * 150)',
                        'is_visible' => true,
                        'variables' => ['m2', 'renders_extra'],
                    ],
                ],
            ],
            [
                'name' => 'CÁLCULO ESTRUCTURAL',
                'description' => "1) Análisis y memoria de cálculo estructural según norma CBH.\n2) Planos de fundaciones, zapatas, columnas, vigas y losas.\n3) Planillas de fierros y especificaciones de armado.\nNo incluye Visado.",
                'formulas' => [
                    [
                        'name' => 'BS /M2',
                        'expression' => '18 * (1 + (pisos_altura - 1) * 0.15)',
                        'is_visible' => true,
                        'variables' => ['pisos_altura'],
                    ],
                    [
                        'name' => 'INVERSIÓN BS.',
                        'expression' => 'm2 < 100 ? 1400 : (m2 * bs_m2)',
                        'is_visible' => true,
                        'variables' => ['m2'],
                    ],
                ],
            ],
            [
                'name' => 'DISEÑO DE INTERIORES',
                'description' => "1) Propuesta de distribución y diseño de mobiliario a medida.\n2) Especificaciones de iluminación, paleta cromática y acabados.\n3) Vistas 3D de ambientación interior de espacios clave.",
                'formulas' => [
                    [
                        'name' => 'INVERSIÓN BS.',
                        'expression' => 'ambientes * 300',
                        'is_visible' => true,
                        'variables' => ['ambientes'],
                    ],
                ],
            ],
            [
                'name' => 'ESTUDIO DE SUELOS',
                'description' => "1) Sondeos de penetración estándar (SPT) en terreno.\n2) Ensayos de laboratorio (clasificación, humedad y límites).\n3) Determinación de capacidad portante admisible y recomendaciones.",
                'formulas' => [
                    [
                        'name' => 'INVERSIÓN BS.',
                        'expression' => 'pozos * 450 + 200',
                        'is_visible' => true,
                        'variables' => ['pozos'],
                    ],
                ],
            ],
            [
                'name' => 'TRÁMITES Y APROBACIÓN MUNICIPAL',
                'description' => "1) Armado de carpeta técnica para visado institucional.\n2) Seguimiento ante el Colegio de Arquitectos y Gobierno Municipal.\n3) Gestión de observaciones y sello de aprobación final.",
                'formulas' => [
                    [
                        'name' => 'INVERSIÓN BS.',
                        'expression' => 'visado_colegio == 1 ? 500 : 250',
                        'is_visible' => true,
                        'variables' => ['visado_colegio'],
                    ],
                ],
            ],
        ];

        foreach ($servicesData as $serviceItem) {
            $service = Service::updateOrCreate(
                ['name' => $serviceItem['name']],
                ['description' => $serviceItem['description']]
            );

            // Eliminar fórmulas previas para regenerar limpiamente
            $service->formulas()->delete();

            foreach ($serviceItem['formulas'] as $fData) {
                $formula = Formula::create([
                    'service_id' => $service->id,
                    'name' => $fData['name'],
                    'expression' => $fData['expression'],
                    'is_visible' => $fData['is_visible'],
                ]);

                $varIds = array_filter(array_map(
                    fn ($varName) => $variablesMap[$varName] ?? null,
                    $fData['variables']
                ));
                $formula->variables()->sync($varIds);
            }
        }

        // 4. Plantilla de Contrato
        ContractTemplate::updateOrCreate(
            ['name' => 'Plantilla Oficial de Prestación de Servicios Arquitectónicos'],
            [
                'html_body' => <<<'HTML'
<div class="contract-document">
    <h1 style="text-align: center; color: #003e65;">CONTRATO DE SERVICIOS ARQUITECTÓNICOS Y DE INGENIERÍA</h1>
    <p>Conste por el presente documento privado de prestación de servicios profesionales, que se suscribe al tenor de las siguientes cláusulas:</p>
    <h3>PRIMERA. (PARTES CONTRATANTES)</h3>
    <p>Por una parte, <strong>BIMETICA DISEÑO Y CONSTRUCCIÓN S.R.L.</strong>, representada legalmente por su Ejecutivo Comercial responsable, y por otra parte el/la cliente <strong>{{cliente_nombre}}</strong>, con C.I. <strong>{{cliente_ci}}</strong>, domiciliado en <strong>{{cliente_direccion}}</strong>.</p>
    <h3>SEGUNDA. (OBJETO)</h3>
    <p>BIMETICA se compromete a elaborar los proyectos y estudios técnicos solicitados para el emplazamiento ubicado en: <strong>{{proyecto_direccion}}</strong>.</p>
    <h3>TERCERA. (MONTO Y FORMA DE PAGO)</h3>
    <p>El monto acordado por los servicios descritos asciende a la suma de <strong>${{monto_acordado}} USD</strong> (o su equivalente en moneda nacional al tipo de cambio acordado), pagadero bajo la modalidad acordada: <strong>{{modalidad_pago}}</strong>.</p>
    <h3>CUARTA. (PLAZOS Y CONFORMIDAD)</h3>
    <p>Los plazos de entrega se computarán a partir de la firma del presente documento y la entrega de antecedentes completos por parte del cliente.</p>
</div>
HTML,
            ]
        );

        // 5. Clientes de Ejemplo
        $clients = [
            [
                'code' => '084/2026',
                'full_name' => 'JANETH / EUNICE MIRANDA NAVIA',
                'ci' => '76734409 LP',
                'phone' => '76734409',
                'address' => 'BAJO SAN ANTONIO',
                'occupation' => 'COMERCIANTE',
            ],
            [
                'code' => '014/2026',
                'full_name' => 'Arq. Carlos Meneses',
                'ci' => '4829103 LP',
                'phone' => '+591 76543210',
                'address' => 'Av. Ballivián #1230, Calacoto, La Paz',
                'occupation' => 'Arquitecto Independiente',
            ],
            [
                'code' => '012/2026',
                'full_name' => 'Ing. Valeria Prado',
                'ci' => '5928192 SC',
                'phone' => '+591 78901234',
                'address' => 'Barrio Las Palmas, Calle 4 #12, Santa Cruz',
                'occupation' => 'Ingeniera Civil',
            ],
            [
                'code' => '009/2026',
                'full_name' => 'Dr. Marcelo Fernández',
                'ci' => '3920194 CB',
                'phone' => '+591 71234567',
                'address' => 'Av. América #450, Cochabamba',
                'occupation' => 'Médico Cirujano',
            ],
            [
                'code' => '005/2026',
                'full_name' => 'Constructora Alianza S.R.L.',
                'ci' => '10293847 NIT',
                'phone' => '+591 2 2789000',
                'address' => 'Calle 21 de Calacoto, Edif. Titanium Of. 5B, La Paz',
                'occupation' => 'Empresa Constructora',
            ],
        ];

        foreach ($clients as $clientData) {
            Client::updateOrCreate(['code' => $clientData['code']], $clientData);
        }
    }
}
