<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuoteRequest;
use App\Models\Client;
use App\Models\Parameter;
use App\Models\Quote;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    /**
     * Display a listing of quotes with search and pagination.
     */
    public function index(Request $request): Response
    {
        $query = Quote::with([
            'client:id,code,full_name,ci,phone',
            'seller:id,name',
            'quoteServices.service:id,name',
        ])
            ->latest('id');

        // Búsqueda por código de cotización, nombre del cliente, CI o código del cliente
        if ($search = $request->input('search')) {
            $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

            $query->where(function ($q) use ($search, $like) {
                $q->where('code', $like, "%{$search}%")
                    ->orWhereHas('client', function ($clientQ) use ($search, $like) {
                        $clientQ->where('full_name', $like, "%{$search}%")
                            ->orWhere('ci', $like, "%{$search}%")
                            ->orWhere('code', $like, "%{$search}%");
                    });
            });
        }

        $quotes = $query->paginate(10)->withQueryString();

        return Inertia::render('quotes/index', [
            'quotes' => $quotes,
            'filters' => [
                'search' => $request->input('search', ''),
            ],
        ]);
    }

    /**
     * Show the form for creating a new quote.
     */
    public function create(): Response
    {
        $services = Service::with([
            'formulas' => function ($query) {
                $query->with('variables:id,name,type,value_type,default_value,options')->orderBy('id', 'asc');
            },
        ])
            ->orderBy('id', 'asc')
            ->get(['id', 'name', 'category', 'description']);

        // Mapear fórmulas y variables para consumo directo en el cotizador
        $services->each(function ($service) {
            $service->formulas->transform(function ($formula) {
                return [
                    'id' => $formula->id,
                    'service_id' => $formula->service_id,
                    'name' => $formula->name,
                    'code' => $formula->code,
                    'expression' => $formula->expression,
                    'is_visible' => (bool) $formula->is_visible,
                    'is_subtotal' => (bool) $formula->is_subtotal,
                    'variables' => $formula->variables->map(function ($v) {
                        return [
                            'id' => $v->id,
                            'name' => $v->name,
                            'type' => $v->type,
                            'value_type' => $v->value_type,
                            'default_value' => $v->default_value,
                            'options' => $v->options,
                        ];
                    })->values()->all(),
                ];
            });
        });

        $parameters = Parameter::active()
            ->orderBy('group', 'asc')
            ->orderBy('name', 'asc')
            ->get(['id', 'group', 'group_label', 'name', 'type', 'value']);

        // Generar correlativo estimado anual NNN/AAAA (ej. COT-2026-00001)
        $nextQuoteCode = Quote::generateNextCode();

        return Inertia::render('quotes/create', [
            'services' => $services,
            'parameters' => $parameters,
            'nextQuoteCode' => $nextQuoteCode,
        ]);
    }

    /**
     * Store a newly created quote in storage.
     */
    public function store(StoreQuoteRequest $request): RedirectResponse
    {
        $quote = DB::transaction(function () use ($request) {
            // 1. Identificar o registrar al cliente
            $clientId = $request->input('client_id');

            if (!$clientId) {
                $clientData = $request->input('client', []);
                $client = Client::create([
                    'code' => Client::generateNextCode(),
                    'full_name' => $clientData['full_name'] ?? 'Cliente Sin Nombre',
                    'ci' => $clientData['ci'] ?? null,
                    'phone' => $clientData['phone'] ?? null,
                    'address' => $clientData['address'] ?? null,
                ]);
                $clientId = $client->id;
            }

            // 2. Crear el encabezado de la cotización
            $quote = Quote::create([
                'code' => Quote::generateNextCode(),
                'client_id' => $clientId,
                'seller_id' => auth()->id() ?? 1,
                'status' => $request->input('status', 'draft'),
                'total_amount' => $request->input('total_amount'),
                'filled_parameters' => $request->input('filled_parameters', []),
            ]);

            // 3. Persistir grupos de pisos (tablas) y niveles/plantas
            $createdGroupMap = []; // Mapa ['temp_id' => real_id] para asociar con servicios

            if ($request->has('floor_groups') && is_array($request->input('floor_groups'))) {
                foreach ($request->input('floor_groups') as $groupData) {
                    $tempId = $groupData['id'] ?? null;
                    $floorGroup = $quote->floorGroups()->create([
                        'table_name' => $groupData['table_name'],
                        'total_area' => $groupData['total_area'] ?? 0,
                    ]);

                    if ($tempId) {
                        $createdGroupMap[$tempId] = $floorGroup->id;
                    }

                    if (!empty($groupData['floors']) && is_array($groupData['floors'])) {
                        foreach ($groupData['floors'] as $floorData) {
                            $floorGroup->floors()->create([
                                'name' => $floorData['name'],
                                'area' => $floorData['area'] ?? 0,
                                'description' => $floorData['description'] ?? null,
                            ]);
                        }
                    }
                }
            }

            // 4. Persistir los servicios cotizados con su subtotal y snapshot de variables
            if ($request->has('services') && is_array($request->input('services'))) {
                foreach ($request->input('services') as $serviceData) {
                    $rawGroupId = $serviceData['quote_floor_group_id']
                        ?? $serviceData['floor_group_id']
                        ?? $serviceData['table_id']
                        ?? null;

                    $realGroupId = null;
                    if ($rawGroupId) {
                        $realGroupId = $createdGroupMap[$rawGroupId]
                            ?? (is_numeric($rawGroupId) ? (int) $rawGroupId : null);
                    }

                    $quote->quoteServices()->create([
                        'service_id' => $serviceData['service_id'],
                        'quote_floor_group_id' => $realGroupId,
                        'subtotal' => $serviceData['subtotal'] ?? 0,
                        'filled_variables' => $serviceData['filled_variables'] ?? [],
                    ]);
                }
            }

            return $quote;
        });

        return redirect()->route('quotes.index')
            ->with('success', "Cotización {$quote->code} guardada exitosamente en borrador.");
    }

    /**
     * Display the specified quote with all related data.
     */
    public function show(Quote $quote): Response
    {
        $quote->load([
            'client',
            'seller:id,name,email',
            'floorGroups.floors',
            'quoteServices.service' => function ($query) {
                $query->select(['id', 'name', 'category', 'description'])
                    ->with([
                        'formulas' => function ($fq) {
                            $fq->with('variables:id,name,type,value_type,default_value,options')
                                ->orderBy('id', 'asc');
                        },
                    ]);
            },
            'quoteServices.floorGroup:id,table_name',
        ]);

        $parameters = Parameter::active()
            ->orderBy('group', 'asc')
            ->orderBy('name', 'asc')
            ->get(['id', 'group', 'group_label', 'name', 'type', 'value']);

        return Inertia::render('quotes/show', [
            'quote' => $quote,
            'parameters' => $parameters,
        ]);
    }
}
