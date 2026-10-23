export interface ServiceItem {
    id: number;
    name: string;
    description?: string | null;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
    {
        id: 1,
        name: 'PLANOS 2D',
        description:
            'Planos en AutoCAD y PDF, esquema de fundaciones, plantas, cortes, elevaciones, sitio y techo. No incluye visado.',
    },
    {
        id: 2,
        name: 'DISEÑO ARQUITECTÓNICO 3D',
        description:
            'Modelado volumétrico BIM espacial, vistas y renders fotorrealistas de alta resolución. No incluye visado.',
    },
    {
        id: 3,
        name: 'CÁLCULO ESTRUCTURAL',
        description:
            'Análisis y memoria de cálculo estructural según norma CBH, planos de fundaciones, vigas, columnas y planillas de fierros. No incluye visado.',
    },
    {
        id: 4,
        name: 'ESTUDIO DE SUELOS',
        description:
            'Sondeos de penetración estándar (SPT) en terreno, ensayos de laboratorio y determinación de capacidad portante.',
    },
    {
        id: 5,
        name: 'TRÁMITES Y APROBACIÓN MUNICIPAL',
        description:
            'Armado de carpeta técnica para visado institucional, seguimiento ante Colegio de Arquitectos y Gobierno Municipal.',
    },
    {
        id: 6,
        name: 'DISEÑO DE INTERIORES',
        description:
            'Propuesta de distribución y diseño de mobiliario a medida, especificaciones de iluminación, paleta y acabados.',
    },
];
