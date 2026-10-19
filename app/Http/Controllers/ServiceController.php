<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of services with their formulas and available variables.
     */
    public function index(): Response
    {
        $services = Service::with([
            'formulas' => function ($query) {
                $query->with('variables:id,name')->orderBy('id', 'asc');
            },
        ])
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'description', 'created_at']);

        // Mapear fórmulas para que el frontend reciba directamente el arreglo variable_names
        $services->each(function ($service) {
            $service->formulas->transform(function ($formula) {
                return [
                    'id' => $formula->id,
                    'service_id' => $formula->service_id,
                    'name' => $formula->name,
                    'code' => $formula->code,
                    'expression' => $formula->expression,
                    'is_visible' => (bool) $formula->is_visible,
                    'variable_names' => $formula->variables->pluck('name')->values()->all(),
                ];
            });
        });

        $availableVariables = Variable::orderBy('name', 'asc')->pluck('name')->values()->all();

        return Inertia::render('services/index', [
            'services' => $services,
            'availableVariables' => $availableVariables,
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::create($request->validated());

        return redirect()->route('services.index')
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
