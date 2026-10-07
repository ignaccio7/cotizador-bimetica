<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InitialFormController extends Controller
{
    /**
     * Display a listing of initial forms (Formulario Inicial).
     */
    public function index(): Response
    {
        $initialForms = [
            [
                'id' => 1,
                'quote_code' => 'COT-2026-0042',
                'client_code' => '014/2026',
                'client_name' => 'Arq. Carlos Meneses',
                'project_name' => 'Residencia Calacoto Unifamiliar',
                'project_address' => 'Av. Ballivián #1230 entre calles 18 y 19, Calacoto, La Paz',
                'agreed_amount' => 4850.00,
                'payment_mode' => '50% Anticipo, 30% Entrega Preliminar, 20% Entrega Final',
                'attention_type' => 'Presencial en Oficina Central',
                'marketing_source' => 'Recomendación de Cliente',
                'status' => 'signed',
                'signed_date' => '2026-10-05',
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
            [
                'id' => 2,
                'quote_code' => 'COT-2026-0041',
                'client_code' => '012/2026',
                'client_name' => 'Ing. Valeria Prado',
                'project_name' => 'Edificio Residencial Las Palmas',
                'project_address' => 'Barrio Las Palmas, Calle Los Tajibos #45, Santa Cruz',
                'agreed_amount' => 12400.00,
                'payment_mode' => '40% Firma, 30% Hito Estructura, 30% Planos Finales',
                'attention_type' => 'Videollamada / Virtual',
                'marketing_source' => 'Campaña Redes Sociales',
                'status' => 'pending_signature',
                'signed_date' => null,
                'seller_name' => 'Nestor Ignacio Rojas',
            ],
        ];

        return Inertia::render('initial-forms/index', [
            'initialForms' => $initialForms,
        ]);
    }
}
