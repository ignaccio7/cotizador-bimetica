<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150', 'unique:services,name'],
            'description' => ['required', 'string'],
            'formulas' => ['required', 'array', 'min:1'],
            'formulas.*.name' => ['required', 'string', 'max:100'],
            'formulas.*.expression' => ['required', 'string'],
            'formulas.*.is_visible' => ['required', 'boolean'],
            'formulas.*.variable_ids' => ['nullable', 'array'],
            'formulas.*.variable_ids.*' => ['integer', 'exists:variables,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del servicio es obligatorio.',
            'name.unique' => 'Ya existe un servicio con este nombre.',
            'description.required' => 'La descripción y entregables del servicio son obligatorios.',
            'formulas.required' => 'Debe registrar al menos una fórmula para el servicio.',
            'formulas.min' => 'Debe registrar al menos una fórmula para el servicio.',
            'formulas.*.name.required' => 'El nombre o etiqueta de cada fórmula es obligatorio.',
            'formulas.*.expression.required' => 'La expresión matemática de cálculo es obligatoria.',
        ];
    }
}
