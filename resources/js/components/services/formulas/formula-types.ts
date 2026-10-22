export interface VariableItem {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    value_type: 'integer' | 'decimal' | 'string';
    default_value: string | null;
}

export interface FormulaItem {
    id: number;
    service_id?: number;
    name: string;
    code: string;
    expression: string;
    is_visible: boolean;
    variable_names: string[];
    variables?: VariableItem[];
}
