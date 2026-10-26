export interface VariableItem {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    value_type: 'integer' | 'decimal' | 'string';
    default_value: string | null;
    description?: string | null;
}

export const DEFAULT_VARIABLES: VariableItem[] = [
    {
        id: 1,
        name: 'm2',
        type: 'dynamic',
        value_type: 'decimal',
        default_value: '0',
        description: 'Superficie en m² construidos del piso o grupo de pisos',
    },
    {
        id: 2,
        name: 'pozos',
        type: 'dynamic',
        value_type: 'integer',
        default_value: '0',
        description: 'Cantidad de pozos SPT para estudio de suelos geotécnico',
    },
    {
        id: 3,
        name: 'complejidad',
        type: 'dynamic',
        value_type: 'string',
        default_value: 'medio',
        description: 'Factor arquitectónico de complejidad técnica',
    },
    {
        id: 4,
        name: 'cambiodolar',
        type: 'static',
        value_type: 'decimal',
        default_value: '12.11',
        description: 'Tipo de cambio referencial oficial USD a BOB',
    },
];

export interface FormulaItem {
    id?: number;
    name: string;
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

const varM2 = DEFAULT_VARIABLES[0];
const varPozos = DEFAULT_VARIABLES[1];

export const DEFAULT_SERVICES: ServiceItem[] = [
    {
        id: 1,
        name: 'PLANOS 2D',
        description:
            'Planos en AutoCAD y PDF, esquema de fundaciones, plantas, cortes, elevaciones, sitio y techo. No incluye visado.',
        formulas: [
            {
                name: 'ARANCEL /M2',
                expression: 'm2 < 30 ? 19 : 12',
                is_visible: true,
                variables: [varM2],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 <= 20 ? 600 : ceil(m2 * arancel_m2)',
                is_visible: true,
                variables: [varM2],
            },
        ],
    },
    {
        id: 2,
        name: 'DISEÑO ARQUITECTÓNICO 3D',
        description:
            'Modelado volumétrico BIM espacial, vistas y renders fotorrealistas de alta resolución. No incluye visado.',
        formulas: [
            {
                name: 'BS /M2',
                expression: 'm2 < 30 ? 65 : 56',
                is_visible: true,
                variables: [varM2],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 < 30 ? 1800 : ceil(m2 * bs_m2)',
                is_visible: true,
                variables: [varM2],
            },
        ],
    },
    {
        id: 3,
        name: 'CÁLCULO ESTRUCTURAL',
        description:
            'Análisis y memoria de cálculo estructural según norma CBH, planos de fundaciones, vigas, columnas y planillas de fierros. No incluye visado.',
        formulas: [
            {
                name: 'BS /M2',
                expression: 'm2 < 50 ? 25 : 22',
                is_visible: true,
                variables: [varM2],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 < 50 ? 1500 : ceil(m2 * bs_m2)',
                is_visible: true,
                variables: [varM2],
            },
        ],
    },
    {
        id: 4,
        name: 'ESTUDIO DE SUELOS',
        description:
            'Sondeos de penetración estándar (SPT) en terreno, ensayos de laboratorio y determinación de capacidad portante.',
        formulas: [
            {
                name: 'INVERSIÓN BS.',
                expression: 'pozos * 450 + 200',
                is_visible: true,
                variables: [varPozos],
            },
        ],
    },
    {
        id: 5,
        name: 'TRÁMITES Y APROBACIÓN MUNICIPAL',
        description:
            'Armado de carpeta técnica para visado institucional, seguimiento ante Colegio de Arquitectos y Gobierno Municipal.',
        formulas: [
            {
                name: 'ARANCEL /M2',
                expression: '4.5',
                is_visible: true,
                variables: [varM2],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 < 100 ? 500 : ceil(m2 * arancel_m2)',
                is_visible: true,
                variables: [varM2],
            },
        ],
    },
    {
        id: 6,
        name: 'DISEÑO DE INTERIORES',
        description:
            'Propuesta de distribución y diseño de mobiliario a medida, especificaciones de iluminación, paleta y acabados.',
        formulas: [
            {
                name: 'BS /M2',
                expression: 'm2 < 50 ? 40 : 35',
                is_visible: true,
                variables: [varM2],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'ceil(m2 * bs_m2)',
                is_visible: true,
                variables: [varM2],
            },
        ],
    },
];
