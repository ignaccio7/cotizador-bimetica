<?php

namespace App\Http\Controllers;

use App\Models\Parameter;
use App\Models\Quote;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
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
            ->get(['id', 'name', 'description']);

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

        // Generar correlativo estimado anual NNN/AAAA (ej. COT-2026-001)
        $year = date('Y');
        $count = Quote::whereYear('created_at', $year)->count() + 1;
        $nextQuoteCode = sprintf('COT-%s-%05d', $year, $count);

        return Inertia::render('quotes/create', [
            'services' => $services,
            'parameters' => $parameters,
            'nextQuoteCode' => $nextQuoteCode,
        ]);
    }
}
