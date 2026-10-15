<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVariableRequest extends FormRequest
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
        $name = $this->input('name');
        if (is_string($name)) {
            $this->merge([
                'name' => strtolower(trim(preg_replace('/[^a-z0-9_]/', '', $name))),
            ]);
        }

        if ($this->input('value_type') === 'string' && $this->filled('options_text')) {
            $options = array_values(array_filter(array_map('trim', explode(',', (string) $this->input('options_text')))));
            $this->merge([
                'options' => !empty($options) ? $options : null,
            ]);
        } else {
            $this->merge([
                'options' => null,
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
            'name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique('variables', 'name')->ignore($this->route('variable')),
            ],
            'type' => ['required', Rule::in(['static', 'dynamic'])],
            'value_type' => ['required', Rule::in(['integer', 'decimal', 'string'])],
            'default_value' => ['nullable', 'string', 'max:255'],
            'options' => ['nullable', 'array'],
            'options.*' => ['string', 'max:50'],
            'description' => ['nullable', 'string', 'max:255'],
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
            'name' => 'identificador de la variable',
            'type' => 'naturaleza de la variable',
            'value_type' => 'tipo de dato',
            'default_value' => 'valor por defecto',
            'options' => 'opciones permitidas',
            'description' => 'descripción de uso',
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
            'name.regex' => 'El identificador solo puede contener letras minúsculas, números y guiones bajos (sin espacios).',
            'name.unique' => 'Ya existe una variable con este identificador.',
        ];
    }
}
