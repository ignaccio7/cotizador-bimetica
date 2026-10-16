<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceFormulasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'formulas' => ['present', 'array'],
            'formulas.*.id' => ['nullable', 'integer', 'exists:formulas,id'],
            'formulas.*.name' => ['required', 'string', 'max:100'],
            'formulas.*.expression' => ['required', 'string', 'max:1000'],
            'formulas.*.is_visible' => ['boolean'],
            'formulas.*.variable_ids' => ['nullable', 'array'],
            'formulas.*.variable_ids.*' => ['integer', 'exists:variables,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'formulas' => 'fórmulas',
            'formulas.*.name' => 'nombre de la fórmula',
            'formulas.*.expression' => 'expresión de la fórmula',
            'formulas.*.is_visible' => 'visibilidad',
            'formulas.*.variable_ids' => 'variables vinculadas',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'formulas.present' => 'La lista de fórmulas es requerida.',
            'formulas.*.name.required' => 'El nombre de cada fórmula es obligatorio.',
            'formulas.*.expression.required' => 'La expresión de cada fórmula es obligatoria.',
        ];
    }
}
