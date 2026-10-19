<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFormulaRequest;
use App\Http\Requests\UpdateFormulaRequest;
use App\Models\Formula;
use App\Models\Service;
use App\Models\Variable;
use Illuminate\Http\RedirectResponse;

class FormulaController extends Controller
{
    /**
     * Store a newly created formula for the specified service.
     */
    public function store(StoreFormulaRequest $request, Service $service): RedirectResponse
    {
        $formula = $service->formulas()->create([
            'name' => $request->validated('name'),
            'code' => $request->validated('code'),
            'expression' => $request->validated('expression'),
            'is_visible' => $request->boolean('is_visible'),
        ]);

        if ($request->filled('variable_names')) {
            $variableIds = Variable::whereIn('name', $request->input('variable_names'))->pluck('id');
            $formula->variables()->sync($variableIds);
        }

        return redirect()->back()->with('success', 'Fórmula creada correctamente.');
    }

    /**
     * Update the specified formula in storage.
     */
    public function update(UpdateFormulaRequest $request, Service $service, Formula $formula): RedirectResponse
    {
        $formula->update([
            'name' => $request->validated('name'),
            'code' => $request->validated('code'),
            'expression' => $request->validated('expression'),
            'is_visible' => $request->boolean('is_visible'),
        ]);

        if ($request->has('variable_names')) {
            $variableNames = $request->input('variable_names') ?? [];
            $variableIds = Variable::whereIn('name', $variableNames)->pluck('id');
            $formula->variables()->sync($variableIds);
        }

        return redirect()->back()->with('success', 'Fórmula actualizada correctamente.');
    }

    /**
     * Remove the specified formula from storage.
     */
    public function destroy(Service $service, Formula $formula): RedirectResponse
    {
        $formula->delete();

        return redirect()->back()->with('success', 'Fórmula eliminada correctamente.');
    }
}
