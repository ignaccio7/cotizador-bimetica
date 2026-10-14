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
            [
                'name' => 'PLANOS 2D',
                'description' => "1) Planos en autoCAD y PDF\n2) Esquema de Fundaciones,\n3) Planos de Plantas,\n4) Planos de Cortes,\n5) Planos de Elevaciones,\n6) Planos de Sitio y Techo con Sistema de desalojo de aguas pluviales y servidas,\nNo incluye Visado.",
            ],
            [
                'name' => 'DISEÑO ARQUITECTÓNICO 3D',
                'description' => "1) Modelado 3D BIM espacial y volumétrico del proyecto arquitectónico.\n2) Vistas axonométricas y perspectivas exteriores e interiores.\n3) Renderizado fotorrealista de alta resolución.\n4) Selección de materiales, texturas e iluminación natural.\nNo incluye Visado.",
            ],
            [
                'name' => 'CÁLCULO ESTRUCTURAL',
                'description' => "1) Análisis y memoria de cálculo estructural según norma CBH.\n2) Planos de fundaciones, zapatas, columnas, vigas y losas.\n3) Planillas de fierros y especificaciones de armado.\nNo incluye Visado.",
            ],
            [
                'name' => 'DISEÑO DE INTERIORES',
                'description' => "1) Propuesta de distribución y diseño de mobiliario a medida.\n2) Especificaciones de iluminación, paleta cromática y acabados.\n3) Vistas 3D de ambientación interior de espacios clave.",
            ],
            [
                'name' => 'ESTUDIO DE SUELOS',
                'description' => "1) Sondeos de penetración estándar (SPT) en terreno.\n2) Ensayos de laboratorio (clasificación, humedad y límites).\n3) Determinación de capacidad portante admisible y recomendaciones.",
            ],
            [
                'name' => 'TRÁMITES Y APROBACIÓN MUNICIPAL',
                'description' => "1) Armado de carpeta técnica para visado institucional.\n2) Seguimiento ante el Colegio de Arquitectos y Gobierno Municipal.\n3) Gestión de observaciones y sello de aprobación final.",
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['name' => $service['name']],
                ['description' => $service['description']]
            );
        }
    }
}
