<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreParameterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('group') && is_string($this->input('group'))) {
            $cleaned = strtolower(trim($this->input('group')));
            $cleaned = preg_replace('/[\s\-]+/', '_', $cleaned);
            $cleaned = preg_replace('/[^a-z0-9_]/', '', $cleaned);
            $this->merge([
                'group' => $cleaned,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'group' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9_]+$/',
            ],
            'group_label' => ['nullable', 'string', 'max:100'],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('parameters', 'name')->where(fn ($query) => $query->where('group', $this->input('group'))),
            ],
            'type' => ['required', 'string', Rule::in(['number', 'percentage'])],
            'value' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'group.required' => 'El identificador de grupo es obligatorio.',
            'group.max' => 'El grupo no debe superar los 50 caracteres.',
            'group.regex' => 'La clave del grupo solo puede contener letras minúsculas, números y guiones bajos (sin espacios ni guiones medios).',
            'name.required' => 'El nombre del parámetro es obligatorio.',
            'name.max' => 'El nombre no debe superar los 100 caracteres.',
            'name.unique' => 'Ya existe un parámetro con este nombre en este grupo.',
            'type.required' => 'El tipo de parámetro es obligatorio.',
            'type.in' => 'El tipo de parámetro debe ser número o porcentaje.',
            'value.required' => 'El valor es obligatorio.',
            'value.numeric' => 'El valor debe ser numérico.',
            'value.min' => 'El valor no puede ser menor a 0.',
            'description.max' => 'La descripción no debe superar los 255 caracteres.',
            'is_active.boolean' => 'El estado activo debe ser verdadero o falso.',
        ];
    }
}
