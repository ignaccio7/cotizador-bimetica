<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Parameter;
use App\Models\Quote;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    /**
     * Show the form for creating a new quote.
     * Provides all catalog data (clients, services with formulas+variables,
     * global variables, and city/viatico parameters) to the React page.
     */
    public function create(): Response
    {
        $clients = Client::orderBy('full_name')
            ->get(['id', 'code', 'full_name', 'ci', 'phone', 'address', 'occupation']);

        // Load services with their formulas and the variables each formula uses
        $servicesCatalog = Service::with([
            'formulas' => fn ($q) => $q->orderBy('id'),
            'formulas.variables',
        ])
        ->orderBy('id')
        ->get()
        ->map(function (Service $service) {
            return [
                'id'          => $service->id,
                'name'        => $service->name,
                'description' => $service->description,
                'formulas'    => $service->formulas->map(fn ($f) => [
                    'id'             => $f->id,
                    'name'           => $f->name,
                    'expression'     => $f->expression,
                    'is_visible'     => (bool) $f->is_visible,
                    'variable_ids'   => $f->variables->pluck('id')->toArray(),
                    'variable_names' => $f->variables->pluck('name')->toArray(),
                ]),
            ];
        });

        $availableVariables = Variable::orderBy('name')->get([
            'id', 'name', 'type', 'value_type', 'default_value', 'options', 'description',
        ]);

        // Parameters table stores viáticos as rows with type = 'viatico'
        // Each row: name = city label, default_value = amount in Bs.
        $cities = Parameter::where('type', 'viatico')
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id'      => $p->id,
                'name'    => $p->name,
                'viatico' => (float) ($p->default_value ?? 0),
            ]);

        // Generar correlativo oficial para la nueva cotización (COT-YYYY-NNN)
        $year = date('Y');
        $quoteCount = Quote::whereYear('created_at', $year)->count();
        $nextQuoteCode = sprintf('COT-%s-%03d', $year, $quoteCount + 1);

        return Inertia::render('quotes/create', [
            'clients'            => $clients,
            'servicesCatalog'    => $servicesCatalog,
            'availableVariables' => $availableVariables,
            'cities'             => $cities,
            'nextQuoteCode'      => $nextQuoteCode,
        ]);
    }

    /**
     * Display a listing of all quotes.
     */
    public function index(): Response
    {
        return Inertia::render('quotes/index');
    }
}
