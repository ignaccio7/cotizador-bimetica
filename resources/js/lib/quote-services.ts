export interface VariableItem {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    value_type: 'integer' | 'decimal' | 'string';
    default_value: string | null;
    description?: string | null;
}

export interface FormulaItem {
    id?: number;
    service_id?: number;
    name: string;
    code?: string;
    expression: string;
    is_visible?: boolean;
    variables?: VariableItem[];
}

export interface ServiceItem {
    id: number;
    name: string;
    description?: string | null;
    formulas?: FormulaItem[];
}

// 1. Estado seleccionado en la cotización actual (clave-valor)
export type DesignParameters = Record<string, string>;

// 2. Registro del catálogo proveniente de la base de datos (tabla 'parameters')
export interface ParameterItem {
    id: number;
    group: string;
    group_label?: string | null;
    name: string;
    type: string;
    value: string | number;
}
