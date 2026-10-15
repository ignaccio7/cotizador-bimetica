<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVariableRequest;
use App\Http\Requests\UpdateVariableRequest;
use App\Models\Variable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VariableController extends Controller
{
    /**
     * Display a listing of variables.
     */
    public function index(): Response
    {
        $variables = Variable::orderBy('name', 'asc')->get();

        return Inertia::render('variables/index', [
            'variables' => $variables,
        ]);
    }

    /**
     * Store a newly created variable in storage.
     */
    public function store(StoreVariableRequest $request): RedirectResponse
    {
        Variable::create($request->validated());

        return redirect()->route('variables.index')
            ->with('success', 'Variable creada correctamente.');
    }

    /**
     * Update the specified variable in storage.
     */
    public function update(UpdateVariableRequest $request, Variable $variable): RedirectResponse
    {
        $variable->update($request->validated());

        return redirect()->route('variables.index')
            ->with('success', 'Variable actualizada correctamente.');
    }

    /**
     * Remove the specified variable from storage.
     */
    public function destroy(Variable $variable): RedirectResponse
    {
        if ($variable->formulas()->exists()) {
            return redirect()->route('variables.index')
                ->with('error', 'No se puede eliminar la variable porque está vinculada a fórmulas de servicios.');
        }

        $variable->delete();

        return redirect()->route('variables.index')
            ->with('success', 'Variable eliminada correctamente.');
    }
}
