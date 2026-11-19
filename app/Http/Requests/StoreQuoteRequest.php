<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
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
            // Identificación del cliente (existente o nuevo)
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'client' => ['nullable', 'array'],
            'client.full_name' => ['required_without:client_id', 'nullable', 'string', 'max:255'],
            'client.phone' => ['nullable', 'string', 'max:50'],
            'client.address' => ['nullable', 'string', 'max:255'],
            'client.ci' => ['nullable', 'string', 'max:30'],

            // Datos generales de la cotización
            'status' => ['nullable', 'string', 'in:draft,formalized,signed,cancelled'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'filled_parameters' => ['nullable', 'array'],
            'filled_settings' => ['nullable', 'array'],

            // Tablas de grupos de pisos / niveles (obligatorio al menos una tabla)
            'floor_groups' => ['required', 'array', 'min:1'],
            'floor_groups.*.id' => ['required'],
            'floor_groups.*.table_name' => ['required', 'string', 'max:100'],
            'floor_groups.*.total_area' => ['nullable', 'numeric', 'min:0'],
            'floor_groups.*.floors' => ['nullable', 'array'],
            'floor_groups.*.floors.*.name' => ['required_with:floor_groups.*.floors', 'string', 'max:100'],
            'floor_groups.*.floors.*.area' => ['nullable', 'numeric', 'min:0'],
            'floor_groups.*.floors.*.description' => ['nullable', 'string', 'max:255'],

            // Servicios seleccionados en la cotización (obligatorio al menos uno)
            'services' => ['required', 'array', 'min:1'],
            'services.*.service_id' => ['required', 'integer', 'exists:services,id'],
            'services.*.quote_floor_group_id' => ['nullable'],
            'services.*.subtotal' => ['required', 'numeric', 'min:0'],
            'services.*.filled_variables' => ['nullable', 'array'],
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
            'client_id' => 'cliente',
            'client' => 'datos del cliente',
            'client.full_name' => 'nombre del cliente',
            'client.phone' => 'teléfono del cliente',
            'client.address' => 'dirección del cliente',
            'client.ci' => 'cédula de identidad',
            'total_amount' => 'monto total',
            'status' => 'estado',
            'filled_parameters' => 'parámetros de la cotización',
            'filled_settings' => 'configuraciones de la cotización',
            'services' => 'servicios cotizados',
            'services.*.service_id' => 'servicio',
            'services.*.quote_floor_group_id' => 'tabla de plantas asignada',
            'services.*.subtotal' => 'subtotal del servicio',
            'services.*.filled_variables' => 'variables del servicio',
            'floor_groups' => 'tablas de plantas',
            'floor_groups.*.id' => 'identificador de la tabla de plantas',
            'floor_groups.*.table_name' => 'nombre de la tabla de plantas',
            'floor_groups.*.total_area' => 'área total de la tabla',
            'floor_groups.*.floors' => 'niveles/plantas',
            'floor_groups.*.floors.*.name' => 'nombre del nivel/piso',
            'floor_groups.*.floors.*.area' => 'área del piso',
            'floor_groups.*.floors.*.description' => 'descripción del nivel/piso',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client.full_name.required_without' => 'El nombre del cliente es obligatorio cuando no se selecciona un cliente registrado.',
            'total_amount.required' => 'El monto total acordado de la cotización es obligatorio.',
            'total_amount.numeric' => 'El monto total debe ser un valor numérico.',
            'total_amount.min' => 'El monto total no puede ser negativo.',
            'status.in' => 'El estado de la cotización debe ser: borrador, formalizado, firmado o cancelado.',
            'filled_parameters.array' => 'Los parámetros de la cotización deben ser un conjunto de datos válido.',
            'filled_settings.array' => 'Las configuraciones de la cotización deben ser un conjunto de datos válido.',
            'services.required' => 'Debe incluir al menos un servicio en la cotización.',
            'services.min' => 'Debe incluir al menos un servicio en la cotización.',
            'services.*.service_id.required' => 'Cada servicio seleccionado debe tener un identificador válido.',
            'services.*.service_id.exists' => 'Uno de los servicios seleccionados no existe en el catálogo.',
            'services.*.subtotal.required' => 'El subtotal del servicio es obligatorio.',
            'services.*.subtotal.numeric' => 'El subtotal de cada servicio debe ser un número válido.',
            'services.*.subtotal.min' => 'El subtotal del servicio no puede ser negativo.',
            'services.*.filled_variables.array' => 'Las variables de cada servicio deben ser un conjunto de datos válido.',
            'floor_groups.required' => 'Debe incluir al menos una tabla de plantas en la cotización.',
            'floor_groups.min' => 'Debe incluir al menos una tabla de plantas en la cotización.',
            'floor_groups.*.id.required' => 'Cada tabla de plantas debe contar con un identificador válido.',
            'floor_groups.*.table_name.required' => 'Cada tabla de plantas debe tener un nombre asignado.',
            'floor_groups.*.floors.*.name.required_with' => 'Cada nivel o piso debe tener un nombre asignado.',
            'floor_groups.*.floors.*.area.numeric' => 'El área de cada piso debe ser un valor numérico.',
            'floor_groups.*.floors.*.area.min' => 'El área de cada piso no puede ser negativa.',
        ];
    }
}
