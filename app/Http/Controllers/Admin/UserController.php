<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of system users (Admin & Vendedores).
     */
    public function index(): Response
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Nestor Ignacio Rojas Guarachi',
                'email' => 'nestorignaciorg@gmail.com',
                'role' => 'seller',
                'role_label' => 'Ejecutivo Comercial / Vendedor',
                'status' => 'active',
                'quotes_count' => 12,
                'created_at' => '2026-10-06',
            ],
            [
                'id' => 2,
                'name' => 'Administrador BIMETICA',
                'email' => 'admin@bimetica.bo',
                'role' => 'admin',
                'role_label' => 'Administrador General',
                'status' => 'active',
                'quotes_count' => 0,
                'created_at' => '2026-10-01',
            ],
            [
                'id' => 3,
                'name' => 'Mariana Salazar Soliz',
                'email' => 'msalazar@bimetica.bo',
                'role' => 'seller',
                'role_label' => 'Ejecutiva Comercial / Vendedora',
                'status' => 'active',
                'quotes_count' => 8,
                'created_at' => '2026-10-03',
            ],
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }
}
