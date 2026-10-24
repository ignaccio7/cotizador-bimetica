<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParameterRequest;
use App\Http\Requests\UpdateParameterRequest;
use App\Models\Parameter;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ParameterController extends Controller
{
    /**
     * Display a listing of parameters.
     */
    public function index(): Response
    {
        $parameters = Parameter::orderBy('group')
            ->orderBy('name')
            ->get();

        return Inertia::render('parameters/index', [
            'parameters' => $parameters,
        ]);
    }

    /**
     * Store a newly created parameter in storage.
     */
    public function store(StoreParameterRequest $request): RedirectResponse
    {
        Parameter::create($request->validated());

        return redirect()->route('parameters.index')
            ->with('success', 'Parámetro creado correctamente.');
    }

    /**
     * Update the specified parameter in storage.
     */
    public function update(UpdateParameterRequest $request, Parameter $parameter): RedirectResponse
    {
        $parameter->update($request->validated());

        return redirect()->route('parameters.index')
            ->with('success', 'Parámetro actualizado correctamente.');
    }

    /**
     * Remove the specified parameter from storage.
     */
    public function destroy(Parameter $parameter): RedirectResponse
    {
        $parameter->delete();

        return redirect()->route('parameters.index')
            ->with('success', 'Parámetro eliminado correctamente.');
    }
}
