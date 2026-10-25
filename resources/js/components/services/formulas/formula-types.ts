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

export interface ParameterItem {
    id: number;
    group: string;
    group_label?: string | null;
    name: string;
    type: 'number' | 'percentage';
    value: string | number;
}

