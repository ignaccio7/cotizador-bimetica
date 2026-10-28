<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesFormulaCycles;
use App\Models\Formula;
use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateFormulaRequest extends FormRequest
{
    use ValidatesFormulaCycles;
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
        $service = $this->route('service');
        $serviceId = $service instanceof Service ? $service->id : $service;

        $formula = $this->route('formula');
        $formulaId = $formula instanceof Formula ? $formula->id : $formula;

        return [
            'name' => ['required', 'string', 'max:100'],
            'code' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9_]+$/',
                Rule::notIn(['and', 'or', 'not', 'xor', 'true', 'false', 'null', 'undefined', 'ceil', 'floor', 'round', 'fix', 'mod', 'to', 'in']),
                Rule::unique('formulas', 'code')
                    ->where(fn ($query) => $query->where('service_id', $serviceId))
                    ->ignore($formulaId),
            ],
            'expression' => ['required', 'string'],
            'is_visible' => ['boolean'],
            'variable_names' => ['nullable', 'array'],
            'variable_names.*' => ['string'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validateFormulaCycles($validator);
        });
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la fórmula es obligatorio.',
            'name.max' => 'El nombre no debe superar los 100 caracteres.',
            'code.required' => 'El identificador de la fórmula es obligatorio.',
            'code.max' => 'El identificador no debe superar los 50 caracteres.',
            'code.regex' => 'El identificador solo puede contener letras minúsculas, números y guiones bajos (sin espacios ni acentos).',
            'code.not_in' => 'El identificador no puede ser una palabra reservada del motor matemático (and, or, not, ceil, etc.).',
            'code.unique' => 'Ya existe una fórmula con este identificador en este servicio.',
            'expression.required' => 'La expresión matemática de cálculo es obligatoria.',
            'is_visible.boolean' => 'El campo de visibilidad debe ser un valor booleano.',
            'variable_names.array' => 'La lista de variables debe ser un arreglo.',
        ];
    }
}
