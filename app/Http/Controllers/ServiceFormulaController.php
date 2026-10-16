<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateServiceFormulasRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ServiceFormulaController extends Controller
{
    /**
     * Update the formulas and their linked variables for the given service.
     */
    public function update(UpdateServiceFormulasRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();
        $formulasData = $validated['formulas'] ?? [];

        DB::transaction(function () use ($service, $formulasData) {
            $keptIds = [];

            foreach ($formulasData as $fData) {
                $formulaId = $fData['id'] ?? null;
                $formula = null;

                if ($formulaId) {
                    $formula = $service->formulas()->find($formulaId);
                }

                if ($formula) {
                    $formula->update([
                        'name' => trim($fData['name']),
                        'expression' => trim($fData['expression']),
                        'is_visible' => (bool) ($fData['is_visible'] ?? false),
                    ]);
                } else {
                    $formula = $service->formulas()->create([
                        'name' => trim($fData['name']),
                        'expression' => trim($fData['expression']),
                        'is_visible' => (bool) ($fData['is_visible'] ?? false),
                    ]);
                }

                $variableIds = $fData['variable_ids'] ?? [];
                $formula->variables()->sync($variableIds);

                $keptIds[] = $formula->id;
            }

            // Eliminar fórmulas desvinculadas en la interfaz
            $service->formulas()->whereNotIn('id', $keptIds)->delete();
        });

        return redirect()->route('services.index', ['selected' => $service->id])
            ->with('success', 'Fórmulas del servicio actualizadas correctamente.');
    }
}
