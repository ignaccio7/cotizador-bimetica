<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            // ──────────────────────────────────────────────
            // Servicios de Diseño Arquitectónico e Ingeniería
            // ──────────────────────────────────────────────
            [
                'name' => 'PLANOS 2D',
                'category' => 'design',
                'description' => 'Planos en AutoCAD y PDF, 2) Esquema de Fundaciones, 3) Planos de Plantas, 4) Planos de Cortes, 5) Planos de Elevaciones, 6) Planos de Sitio y Techo con Sistema de desalojo de aguas pluviales y servidas. No incluye Visado.',
            ],
            [
                'name' => 'DISEÑO ARQUITECTÓNICO',
                'category' => 'design',
                'description' => 'Catálogo físico, 2) Planos en AutoCAD y PDF, 3) Modelador Digital en BIMX, 4) Planos Arquitectónicos de: Esquema de Fundaciones, Planos de Plantas, Planos de Cortes, Planos de Elevaciones, Plano de Sitio y Techo con Sistema de desalojo de aguas pluviales o servidas, 5) Renders 3D de Interiores y Exteriores, 6) Recorrido 360°, 7) Presupuesto Tentativo de Construcción. No incluye Visado.',
            ],
            [
                'name' => 'DISEÑO DE FACHADA',
                'category' => 'design',
                'description' => 'Catálogo físico, 2) Planos en AutoCAD y PDF, 3) Planos de Cortes, 4) Planos de Elevaciones, 5) Tabiquería y detalles constructivos de acuerdo a los requerimientos del proyecto, 6) Corte de Borde, 7) Renders 3D de exteriores, 8) Modelador Digital en BIMX.',
            ],
            [
                'name' => 'DISEÑO DE INTERIORES',
                'category' => 'design',
                'description' => 'Catálogo Físico, 2) Planos en PDF: a) Elevaciones; b) Planta en general; c) Plano Layout; d) Plano de iluminaciones; e) Plano de cielo falso, 3) Moodboard, 4) Detalle constructivo mobiliario, 5) Detalle de acabado, 6) Esquema eléctrico / sanitario, 7) Video Recorrido, 8) Render 3D (6/+), 9) Presupuesto tentativo.',
            ],
            [
                'name' => 'PLANOS ELÉCTRICOS',
                'category' => 'design',
                'description' => 'Circuito de Iluminación y Tomacorrientes, 2) Diagrama Unifilar, 3) Cuadro de cargas, 4) Resumen de cargas, 5) Instalaciones Especiales (domótica, sonido, etc.), 6) Memoria de Cálculo, 7) Cómputos métricos. No incluye Visado.',
            ],
            [
                'name' => 'PLANOS HIDROSANITARIOS',
                'category' => 'design',
                'description' => 'Planos de Desagües, 2) Planos de Agua Caliente, 3) Planos de Agua Fría, 4) Memoria de cálculo, 5) Planos Isométricos, 6) Cómputos métricos. No incluye Visado.',
            ],
            [
                'name' => 'CÁLCULO ESTRUCTURAL',
                'category' => 'design',
                'description' => 'Planos estructurales de: Vigas de fundación, Losas de fundación, Zapatas, Muros, Escaleras, Losas y Columnas, 2) Memorias de Cálculo Estructural, 3) Plan de contingencias, 4) Formulario Resumen de Cálculo Estructural (Alcaldía), 5) Formulario Resumen de Plan de Contingencias (Alcaldía), 6) Fotocopia de la credencial del profesional a cargo (Alcaldía). No incluye Visado.',
            ],
            [
                'name' => 'CÓMPUTO Y PRESUPUESTO DE OBRA',
                'category' => 'design',
                'description' => 'Cómputos métricos, 2) Presupuesto general de obra, 3) Cronograma de obra. No incluye Visado.',
            ],
            [
                'name' => 'ESTUDIO DE SUELOS GEOLÓGICO - GEOTÉCNICO',
                'category' => 'design',
                'description' => 'Ejemplar Original del Informe del Laboratorio de suelos, 2) Formulario Resumen Estudio Geológico – Geotécnico, 3) Fotocopia de la credencial del profesional a cargo (Alcaldía). No incluye Tapado de Pozos, No incluye picado de Hormigón. No incluye Visado.',
            ],
            [
                'name' => 'TRÁMITES',
                'category' => 'design',
                'description' => 'Llenado de formularios, 2) Subido al Sistema de la Alcaldía, 3) Subsanación de observaciones en planos, 4) Seguimiento y Control del proceso de trámite, 5) Entrega del permiso de construcción.',
            ],
            [
                'name' => 'LEVANTAMIENTO TOPOGRÁFICO GEOREFERENCIADO',
                'category' => 'design',
                'description' => 'Informe técnico en formato para la alcaldía con todos los respaldos que se van a necesitar para el trámite, en formato físico y digital.',
            ],

            // ──────────────────────────────────────────────
            // Servicios de Construcción
            // ──────────────────────────────────────────────
            [
                'name' => 'CONSTRUCCIÓN EN OBRA GRUESA',
                'category' => 'construction',
                'description' => 'Incluye: Construcción de toda la estructura de la casa (Fundación de zapatas, columnas, losas, gradas), tabiquería, techado.',
            ],
            [
                'name' => 'CONSTRUCCIÓN EN OBRA FINA',
                'category' => 'construction',
                'description' => 'OBRA FINA Incluye: Construcción en revoque de yeso y/o estuco en paredes y techos, revestimientos de porcelanatos y/o cerámica, contrapiso. Instalaciones Eléctricas y Sanitarias.',
            ],
            [
                'name' => 'CONSTRUCCIÓN TOTAL',
                'category' => 'construction',
                'description' => 'OBRA COMPLETA Incluye: Construcción de toda la estructura de la casa (Fundación de zapatas, columnas, losas, gradas), tabiquería, techado. Construcción en revoque de yeso y/o estuco en paredes y techos, revestimientos de porcelanatos y/o cerámica, contrapiso. Instalaciones Eléctricas y Sanitarias, Fachada de toda la casa.',
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['name' => $service['name']],
                [
                    'category' => $service['category'],
                    'description' => $service['description'],
                ]
            );
        }
    }
}
