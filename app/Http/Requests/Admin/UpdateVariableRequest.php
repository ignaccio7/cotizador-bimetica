<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVariableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $variableId = $this->route('variable')?->id ?? $this->route('variable');

        return [
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z_][a-zA-Z0-9_]*$/',
                Rule::unique('variables', 'name')->ignore($variableId),
            ],
            'type' => ['required', 'string', 'in:static,dynamic'],
            'default_value' => ['nullable', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El identificador de la variable es obligatorio.',
            'name.regex' => 'El identificador debe ser un nombre de variable válido (solo letras, números y guiones bajos, sin espacios).',
            'name.unique' => 'Ya existe una variable con este identificador.',
            'type.required' => 'El tipo de variable es obligatorio.',
            'type.in' => 'El tipo de variable debe ser estática o dinámica.',
            'default_value.numeric' => 'El valor por defecto debe ser numérico.',
        ];
    }
}
