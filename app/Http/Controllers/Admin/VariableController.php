<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVariableRequest;
use App\Http\Requests\Admin\UpdateVariableRequest;
use App\Models\Variable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VariableController extends Controller
{
    /**
     * Display a listing of system variables (static and dynamic).
     */
    public function index(): Response
    {
        $variables = Variable::with(['formulas.service'])
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->map(function (Variable $variable) {
                $usedInServices = $variable->formulas
                    ->map(fn ($formula) => $formula->service?->name)
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();

                return [
                    'id' => $variable->id,
                    'name' => $variable->name,
                    'type' => $variable->type,
                    'default_value' => $variable->default_value !== null ? (float) $variable->default_value : null,
                    'used_in_services' => $usedInServices,
                    'used_count' => count($usedInServices),
                    'created_at' => $variable->created_at?->format('Y-m-d'),
                ];
            });

        return Inertia::render('admin/variables/index', [
            'variables' => $variables,
        ]);
    }

    /**
     * Store a newly created variable in storage.
     */
    public function store(StoreVariableRequest $request): RedirectResponse
    {
        Variable::create($request->validated());

        return redirect()->route('admin.variables.index')
            ->with('success', 'Variable creada correctamente.');
    }

    /**
     * Update the specified variable in storage.
     */
    public function update(UpdateVariableRequest $request, Variable $variable): RedirectResponse
    {
        $variable->update($request->validated());

        return redirect()->route('admin.variables.index')
            ->with('success', 'Variable actualizada correctamente.');
    }

    /**
     * Remove the specified variable from storage.
     */
    public function destroy(Variable $variable): RedirectResponse
    {
        if ($variable->formulas()->exists()) {
            return redirect()->route('admin.variables.index')
                ->with('error', 'No se puede eliminar la variable porque está vinculada a una o más fórmulas activas.');
        }

        $variable->delete();

        return redirect()->route('admin.variables.index')
            ->with('success', 'Variable eliminada correctamente.');
    }
}
