export interface FormulaMock {
    id: number;
    name: string;
    code: string;
    expression: string;
    is_visible: boolean;
    variable_names: string[];
}

export const MOCK_FORMULAS: FormulaMock[] = [
    {
        id: 1,
        name: 'Bs / m2',
        code: 'bs_m2',
        expression: '18 * (complejidad == "alto" ? 1.3 : 1.0)',
        is_visible: true,
        variable_names: ['complejidad'],
    },
    {
        id: 2,
        name: 'Inversión Bs.',
        code: 'inversion_bs',
        expression: 'm2 < 30 ? 1600 : ceil(m2 * bs_m2)',
        is_visible: true,
        variable_names: ['m2'],
    },
    {
        id: 3,
        name: 'Costo USD',
        code: 'costo_usd',
        expression: 'round(inversion_bs / cambiodolar, 2)',
        is_visible: false,
        variable_names: ['cambiodolar'],
    },
];
