<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractController extends Controller
{
    /**
     * Display a listing of generated contracts.
     */
    public function index(): Response
    {
        $contracts = [
            [
                'id' => 1,
                'contract_code' => 'CTR-2026-0018',
                'quote_code' => 'COT-2026-0042',
                'client_code' => '014/2026',
                'client_name' => 'Arq. Carlos Meneses',
                'client_ci' => '4829103 LP',
                'total_amount' => 4850.00,
                'template_name' => 'Contrato General de Servicios Arquitectónicos',
                'created_at' => '2026-10-05',
                'status' => 'active',
                'status_label' => 'Vigente / Firmado',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
            [
                'id' => 2,
                'contract_code' => 'CTR-2026-0015',
                'quote_code' => 'COT-2026-0035',
                'client_code' => '005/2026',
                'client_name' => 'Constructora Alianza S.R.L.',
                'client_ci' => '10293847 NIT',
                'total_amount' => 18900.00,
                'template_name' => 'Contrato Integral Diseño y Cálculo Estructural',
                'created_at' => '2026-09-24',
                'status' => 'active',
                'status_label' => 'Vigente / Firmado',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
        ];

        return Inertia::render('contracts/index', [
            'contracts' => $contracts,
        ]);
    }
}
