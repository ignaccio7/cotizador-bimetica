<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingRequest;
use App\Models\Parameter;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display a listing of system settings.
     */
    public function index(): Response
    {
        $totalFormulaSetting = Setting::where('key', 'quote_total_formula')->first();

        $availableParameters = Parameter::active()
            ->whereIn('scope', ['total', 'global'])
            ->orderBy('scope', 'asc')
            ->orderBy('group', 'asc')
            ->get(['id', 'group', 'group_label', 'scope', 'name', 'type', 'value']);

        return Inertia::render('configurations/index', [
            'totalFormulaSetting' => $totalFormulaSetting,
            'availableParameters' => $availableParameters,
        ]);
    }

    /**
     * Update the specified setting in storage.
     */
    public function update(UpdateSettingRequest $request, string $key): RedirectResponse
    {
        Setting::set($key, $request->input('value'));

        return redirect()->back()
            ->with('success', 'Configuración actualizada correctamente.');
    }
}
