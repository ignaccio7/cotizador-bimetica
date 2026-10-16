<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Formula;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of services and their calculation formulas.
     */
    public function index(Request $request): Response
    {
        $services = Service::with(['formulas.variables'])
            ->orderBy('id')
            ->get()
            ->map(function (Service $service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'created_at' => $service->created_at?->format('Y-m-d'),
                    'formulas' => $service->formulas->map(function (Formula $formula) {
                        return [
                            'id' => $formula->id,
                            'name' => $formula->name,
                            'expression' => $formula->expression,
                            'is_visible' => (bool) $formula->is_visible,
                            'variable_ids' => $formula->variables->pluck('id')->all(),
                            'variable_names' => $formula->variables->pluck('name')->all(),
                        ];
                    })->values()->all(),
                ];
            });

        $availableVariables = Variable::orderBy('type')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'value_type', 'default_value', 'options', 'description'])
            ->map(fn (Variable $v) => [
                'id' => $v->id,
                'name' => $v->name,
                'type' => $v->type,
                'value_type' => $v->value_type,
                'default_value' => $v->default_value,
                'options' => $v->options,
                'description' => $v->description,
            ]);

        return Inertia::render('services/index', [
            'services' => $services,
            'availableVariables' => $availableVariables,
            'selectedId' => $request->integer('selected') ?: null,
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $service = Service::create($request->validated());

        return redirect()->route('services.index', ['selected' => $service->id])
            ->with('success', 'Servicio creado correctamente.');
    }

    /**
     * Update the specified service in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return redirect()->route('services.index')
            ->with('success', 'Servicio actualizado correctamente.');
    }

    /**
     * Remove the specified service from storage.
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Servicio eliminado correctamente.');
    }
}
