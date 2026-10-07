<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Formula;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of services and their calculation formulas.
     */
    public function index(): Response
    {
        $services = Service::with(['formulas.variables'])
            ->orderBy('id')
            ->get()
            ->map(function (Service $service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'formulas' => $service->formulas->map(function (Formula $formula) {
                        return [
                            'id' => $formula->id,
                            'name' => $formula->name,
                            'expression' => $formula->expression,
                            'is_visible' => (bool) $formula->is_visible,
                            'variables' => $formula->variables->map(fn ($v) => [
                                'id' => $v->id,
                                'name' => $v->name,
                                'type' => $v->type,
                                'default_value' => $v->default_value !== null ? (float) $v->default_value : null,
                            ])->values()->all(),
                            'variable_ids' => $formula->variables->pluck('id')->all(),
                        ];
                    })->values()->all(),
                    'created_at' => $service->created_at?->format('Y-m-d'),
                ];
            });

        $availableVariables = Variable::orderBy('type')
            ->orderBy('name')
            ->get(['id', 'name', 'type', 'default_value'])
            ->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'type' => $v->type,
                'default_value' => $v->default_value !== null ? (float) $v->default_value : null,
            ]);

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'availableVariables' => $availableVariables,
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $service = Service::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            foreach ($validated['formulas'] as $fData) {
                $formula = Formula::create([
                    'service_id' => $service->id,
                    'name' => $fData['name'],
                    'expression' => $fData['expression'],
                    'is_visible' => $fData['is_visible'] ?? true,
                ]);

                if (! empty($fData['variable_ids'])) {
                    $formula->variables()->sync($fData['variable_ids']);
                }
            }
        });

        return redirect()->route('admin.services.index')
            ->with('success', 'Servicio y fórmulas creados correctamente.');
    }

    /**
     * Update the specified service in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($service, $validated) {
            $service->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
            ]);

            $service->formulas()->delete();

            foreach ($validated['formulas'] as $fData) {
                $formula = Formula::create([
                    'service_id' => $service->id,
                    'name' => $fData['name'],
                    'expression' => $fData['expression'],
                    'is_visible' => $fData['is_visible'] ?? true,
                ]);

                if (! empty($fData['variable_ids'])) {
                    $formula->variables()->sync($fData['variable_ids']);
                }
            }
        });

        return redirect()->route('admin.services.index')
            ->with('success', 'Servicio y fórmulas actualizados correctamente.');
    }

    /**
     * Remove the specified service from storage.
     */
    public function destroy(Service $service): RedirectResponse
    {
        if ($service->quoteServices()->exists()) {
            return redirect()->route('admin.services.index')
                ->with('error', 'No se puede eliminar el servicio porque ya se encuentra registrado en cotizaciones existentes.');
        }

        $service->delete();

        return redirect()->route('admin.services.index')
            ->with('success', 'Servicio eliminado correctamente.');
    }
}
