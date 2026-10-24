<?php

namespace App\Http\Requests;

use App\Models\Parameter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateParameterRequest extends FormRequest
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
        $parameter = $this->route('parameter');
        $parameterId = $parameter instanceof Parameter ? $parameter->id : $parameter;
        $group = $this->input('group') ?? ($parameter instanceof Parameter ? $parameter->group : null);

        return [
            'group' => ['required', 'string', 'max:50'],
            'group_label' => ['nullable', 'string', 'max:100'],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('parameters', 'name')
                    ->where(fn ($query) => $query->where('group', $group))
                    ->ignore($parameterId),
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
