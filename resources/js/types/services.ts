export interface VariableItem {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    value_type: 'integer' | 'decimal' | 'string';
    default_value: string | null;
    options: string[] | null;
    description: string | null;
}

export interface FormulaItem {
    id?: number;
    name: string;
    expression: string;
    is_visible: boolean;
    variable_ids: number[];
    variable_names?: string[];
}

export interface ServiceItem {
    id: number;
    name: string;
    description: string | null;
    formulas: FormulaItem[];
    created_at?: string;
}
