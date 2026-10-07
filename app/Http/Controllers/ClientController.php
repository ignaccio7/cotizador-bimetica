<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of clients and their history.
     */
    public function index(): Response
    {
        $clients = [
            [
                'id' => 1,
                'code' => '014/2026',
                'name' => 'Arq. Carlos Meneses',
                'ci' => '4829103 LP',
                'phone' => '+591 76543210',
                'email' => 'carlos.meneses@estudio.bo',
                'address' => 'Av. Ballivián #1230, Calacoto, La Paz',
                'quotes_count' => 2,
                'total_billed' => 4850.00,
                'created_at' => '2026-10-01',
            ],
            [
                'id' => 2,
                'code' => '012/2026',
                'name' => 'Ing. Valeria Prado',
                'ci' => '5928192 SC',
                'phone' => '+591 78901234',
                'email' => 'vprado@constructora.com',
                'address' => 'Barrio Las Palmas, Calle 4 #12, Santa Cruz',
                'quotes_count' => 1,
                'total_billed' => 12400.00,
                'created_at' => '2026-09-29',
            ],
            [
                'id' => 3,
                'code' => '009/2026',
                'name' => 'Dr. Marcelo Fernández',
                'ci' => '3920194 CB',
                'phone' => '+591 71234567',
                'email' => 'marcelo.f@clinica.com',
                'address' => 'Av. América #450, Cochabamba',
                'quotes_count' => 1,
                'total_billed' => 3100.00,
                'created_at' => '2026-09-15',
            ],
            [
                'id' => 4,
                'code' => '005/2026',
                'name' => 'Constructora Alianza S.R.L.',
                'ci' => '10293847 NIT',
                'phone' => '+591 2 2789000',
                'email' => 'proyectos@alianza.bo',
                'address' => 'Calle 21 de Calacoto, Edif. Titanium Of. 5B, La Paz',
                'quotes_count' => 3,
                'total_billed' => 18900.00,
                'created_at' => '2026-08-10',
            ],
        ];

        return Inertia::render('clients/index', [
            'clients' => $clients,
        ]);
    }
}
