import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Plus,
    Printer,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { QuoteFloorTable } from '@/components/quotes/quote-floor-table';
import { QuoteServiceSheetBlock } from '@/components/quotes/quote-service-sheet-block';
import { QuoteSidebarCalculation } from '@/components/quotes/quote-sidebar-calculation';
import { Button } from '@/components/ui/button';
import { evaluateFormula, slugifyFormulaName } from '@/lib/formula-evaluator';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';
import type {
    CityItem,
    ClientItem,
    FloorGroupItem,
    FloorItem,
    QuoteCreateProps,
} from '@/types/quotes';
import type { ServiceItem, VariableItem } from '@/types/services';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cotizaciones',
        href: quotesRoute.create(),
    },
    {
        title: 'Nueva Cotización',
        href: quotesRoute.create(),
    },
];

// Datos Mock de respaldo si no vienen por props (Paso 1: UI Primero)
const DEFAULT_CLIENTS: ClientItem[] = [
    {
        id: 1,
        code: '084/2026',
        full_name: 'JANETH / EUNICE MIRANDA NAVIA',
        ci: '76734409 LP',
        phone: '76734409',
        address: 'BAJO SAN ANTONIO',
        occupation: 'COMERCIANTE',
    },
    {
        id: 2,
        code: '085/2026',
        full_name: 'CARLOS ALBERTO MAMANI FLORES',
        ci: '4839201 LP',
        phone: '71548923',
        address: 'ACHUMANI, CALLE 22',
        occupation: 'INGENIERO CIVIL',
    },
];

const DEFAULT_VARIABLES: VariableItem[] = [
    {
        id: 1,
        name: 'm2',
        type: 'dynamic',
        value_type: 'decimal',
        default_value: '300',
        options: null,
        description: 'Superficie total computable',
    },
    {
        id: 2,
        name: 'complejidad',
        type: 'dynamic',
        value_type: 'string',
        default_value: 'medio',
        options: ['bajo', 'medio', 'alto'],
        description: 'Factor de dificultad proyectual',
    },
    {
        id: 3,
        name: 'pozos',
        type: 'dynamic',
        value_type: 'integer',
        default_value: '3',
        options: null,
        description: 'Número de sondeos / pozos',
    },
    {
        id: 4,
        name: 'cambiodolar',
        type: 'static',
        value_type: 'decimal',
        default_value: '12.11',
        options: null,
        description: 'Tipo de cambio referencial USD/BOB',
    },
];

const DEFAULT_SERVICES: ServiceItem[] = [
    {
        id: 1,
        name: 'PLANOS 2D',
        description: 'Planos en autoCAD y PDF, esquema de fundaciones, plantas, cortes, elevaciones, sitio y techo. No incluye visado.',
        formulas: [
            {
                name: 'ARANCEL /M2',
                expression: 'm2 < 30 ? 19 : 12',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 <= 20 ? 600 : ceil(m2 * arancel_m2)',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
        ],
    },
    {
        id: 2,
        name: 'DISEÑO ARQUITECTÓNICO 3D',
        description: 'Modelado volumétrico BIM espacial, vistas y renders fotorrealistas de alta resolución. No incluye visado.',
        formulas: [
            {
                name: 'BS /M2',
                expression: 'm2 < 30 ? 65 : 56',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 < 30 ? 1800 : ceil(m2 * bs_m2)',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
        ],
    },
    {
        id: 3,
        name: 'CÁLCULO ESTRUCTURAL',
        description: 'Análisis y memoria de cálculo estructural según norma CBH, planos de fundaciones, vigas, columnas y planillas de fierros. No incluye visado.',
        formulas: [
            {
                name: 'BS /M2',
                expression: 'm2 < 50 ? 25 : 22',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 < 50 ? 1500 : ceil(m2 * bs_m2)',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
        ],
    },
    {
        id: 4,
        name: 'ESTUDIO DE SUELOS',
        description: 'Sondeos de penetración estándar (SPT) en terreno, ensayos de laboratorio y determinación de capacidad portante.',
        formulas: [
            {
                name: 'INVERSIÓN BS.',
                expression: 'pozos * 450 + 200',
                is_visible: true,
                variable_ids: [2],
                variable_names: ['pozos'],
            },
        ],
    },
    {
        id: 5,
        name: 'TRÁMITES Y APROBACIÓN MUNICIPAL',
        description: 'Armado de carpeta técnica para visado institucional, seguimiento ante Colegio de Arquitectos y Gobierno Municipal.',
        formulas: [
            {
                name: 'ARANCEL /M2',
                expression: '4.5',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'm2 < 100 ? 500 : ceil(m2 * arancel_m2)',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
        ],
    },
    {
        id: 6,
        name: 'DISEÑO DE INTERIORES',
        description: 'Propuesta de distribución y diseño de mobiliario a medida, especificaciones de iluminación, paleta y acabados.',
        formulas: [
            {
                name: 'BS /M2',
                expression: 'm2 < 50 ? 40 : 35',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
            {
                name: 'INVERSIÓN BS.',
                expression: 'ceil(m2 * bs_m2)',
                is_visible: true,
                variable_ids: [1],
                variable_names: ['m2'],
            },
        ],
    },
];

const DEFAULT_CITIES: CityItem[] = [
    { id: 1, name: 'La Paz (Área Metropolitana)', viatico: 0 },
    { id: 2, name: 'El Alto (Urbana)', viatico: 0 },
    { id: 3, name: 'Cochabamba (Centro / Valles)', viatico: 450 },
    { id: 4, name: 'Santa Cruz de la Sierra', viatico: 600 },
    { id: 5, name: 'Sucre / Chuquisaca', viatico: 500 },
];

export default function QuoteCreate({
    clients = [],
    servicesCatalog = DEFAULT_SERVICES,
    availableVariables = DEFAULT_VARIABLES,
    cities = DEFAULT_CITIES,
    nextQuoteCode = 'COT-2026-001',
}: QuoteCreateProps) {
    // 1. Cliente y Expediente (Inicia limpio o seleccionable de BD)
    const [clientData, setClientData] = useState<ClientItem>({
        id: 0,
        code: '',
        full_name: '',
        ci: '',
        phone: '',
        address: '',
        occupation: '',
    });
    const quoteCode = nextQuoteCode || 'COT-2026-001';

    // 2. Selección Multiselect de Servicios (Inicia VACÍO para que el vendedor elija)
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

    // 4. Tablas de Plantas de la Edificación (Inicia con 1 tabla VACÍA sin plantas)
    const [floorGroups, setFloorGroups] = useState<FloorGroupItem[]>([
        {
            id: 'group-1',
            table_name: 'Edificación Principal',
            total_area: 0,
            assigned_service_ids: [],
            floors: [],
        },
    ]);

    // Tab activa de tablas de pisos (id del FloorGroup visible)
    const [activeGroupId, setActiveGroupId] = useState<string>('group-1');

    // 5. Variables Dinámicas por Servicio (Inicia vacío y se alimenta según interacción)
    const [filledVariablesByService, setFilledVariablesByService] = useState<
        Record<number, Record<string, any>>
    >({});

    // 6. Viáticos y Acciones
    const [selectedCityId, setSelectedCityId] = useState<number>(cities[0]?.id || 1);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Servicios Activos
    const activeServices = useMemo(() => {
        return servicesCatalog.filter((s) => selectedServiceIds.includes(s.id));
    }, [servicesCatalog, selectedServiceIds]);

    // MAPEO: servicio -> id de grupo de pisos al que está asignado
    const serviceToFloorGroupMap = useMemo(() => {
        const map: Record<number, string | null> = {};
        for (const sId of selectedServiceIds) {
            const foundGroup = floorGroups.find((g) => g.assigned_service_ids.includes(sId));
            map[sId] = foundGroup ? foundGroup.id : null;
        }
        return map;
    }, [selectedServiceIds, floorGroups]);

    // Suma total de M2 de todas las tablas
    const totalFloorsM2 = useMemo(() => {
        return floorGroups.reduce((sum, g) => {
            const groupArea = g.floors.reduce(
                (fSum, f) => (f.isActive ? fSum + (Number(f.area) || 0) : fSum),
                0
            );
            return sum + groupArea;
        }, 0);
    }, [floorGroups]);

    // M2 o unidad computada por cada servicio
    const serviceM2Values = useMemo(() => {
        const values: Record<number, number | string> = {};
        for (const s of activeServices) {
            const hasPozos =
                s.formulas?.some(
                    (f) =>
                        f.expression.includes('pozos') ||
                        (f.variable_names && f.variable_names.includes('pozos'))
                ) || s.name.toLowerCase().includes('suelo');

            if (hasPozos) {
                values[s.id] = filledVariablesByService[s.id]?.pozos ?? 3;
            } else {
                const assignedGroupId = serviceToFloorGroupMap[s.id];
                const assignedGroup = floorGroups.find((g) => g.id === assignedGroupId);
                if (assignedGroup) {
                    const groupArea = assignedGroup.floors.reduce(
                        (sum, f) => (f.isActive ? sum + (Number(f.area) || 0) : sum),
                        0
                    );
                    values[s.id] = groupArea;
                } else {
                    values[s.id] = filledVariablesByService[s.id]?.m2 ?? 300;
                }
            }
        }
        return values;
    }, [activeServices, serviceToFloorGroupMap, floorGroups, filledVariablesByService]);

    // Subtotales evaluados por servicio con Math.js
    const serviceSubtotals = useMemo(() => {
        const subtotals: Record<number, number> = {};

        for (const service of activeServices) {
            const assignedGroupId = serviceToFloorGroupMap[service.id];
            const assignedGroup = floorGroups.find((g) => g.id === assignedGroupId);
            const assignedArea = assignedGroup
                ? assignedGroup.floors.reduce(
                      (sum, f) => (f.isActive ? sum + (Number(f.area) || 0) : sum),
                      0
                  )
                : null;

            const filledVars = filledVariablesByService[service.id] || {};
            const scope: Record<string, any> = {
                m2: assignedArea !== null ? assignedArea : Number(filledVars.m2) || 0,
                pozos: Number(filledVars.pozos) || 3,
                cambiodolar: 12.11,
                ...filledVars,
            };

            if (assignedArea !== null) {
                scope.m2 = assignedArea;
            }

            if (!service.formulas || service.formulas.length === 0) {
                subtotals[service.id] = Math.ceil((scope.m2 || 0) * 25);
                continue;
            }

            const cascadeScope = { ...scope };
            let sub = 0;
            for (const f of service.formulas) {
                const val = evaluateFormula(f.expression, cascadeScope);
                const slug = slugifyFormulaName(f.name);
                if (val !== null) {
                    cascadeScope[slug] = val;
                    sub = val;
                }
            }
            subtotals[service.id] = Math.ceil(sub || 0);
        }

        return subtotals;
    }, [activeServices, serviceToFloorGroupMap, floorGroups, filledVariablesByService]);

    const totalServicesBs = useMemo(() => {
        return Object.values(serviceSubtotals).reduce((sum, s) => sum + s, 0);
    }, [serviceSubtotals]);

    const viaticoBs = useMemo(() => {
        const city = cities.find((c) => c.id === selectedCityId);
        return city ? city.viatico : 0;
    }, [cities, selectedCityId]);

    const grandTotalBs = useMemo(() => {
        return Math.ceil(totalServicesBs + viaticoBs);
    }, [totalServicesBs, viaticoBs]);

    // --- ACCIONES DE MULTISELECT ---
    const handleToggleService = (serviceId: number) => {
        if (selectedServiceIds.includes(serviceId)) {
            handleRemoveService(serviceId);
        } else {
            setSelectedServiceIds((prev) => [...prev, serviceId]);
            // Asignar al primer grupo por defecto si usa superficie
            const s = servicesCatalog.find((srv) => srv.id === serviceId);
            if (s && !s.name.toLowerCase().includes('suelo') && floorGroups.length > 0) {
                setFloorGroups((prev) =>
                    prev.map((g, idx) =>
                        idx === 0
                            ? { ...g, assigned_service_ids: [...g.assigned_service_ids, serviceId] }
                            : g
                    )
                );
            }
        }
    };

    const handleRemoveService = (serviceId: number) => {
        setSelectedServiceIds((prev) => prev.filter((id) => id !== serviceId));
        setFloorGroups((prev) =>
            prev.map((g) => ({
                ...g,
                assigned_service_ids: g.assigned_service_ids.filter((id) => id !== serviceId),
            }))
        );
    };

    // --- ACCIONES DE TABLAS DE PISOS ---
    const handleAddFloorGroup = () => {
        const newId = `group-${Date.now()}`;
        const newIndex = floorGroups.length + 1;
        const newGroup: FloorGroupItem = {
            id: newId,
            table_name: `Ampliación / Bloque #${newIndex}`,
            total_area: 80,
            assigned_service_ids: [],
            floors: [
                {
                    id: `floor-${Date.now()}-1`,
                    name: 'PLANTA ÚNICA',
                    description: 'Ambientes complementarios proyectados',
                    area: 80,
                    isActive: true,
                },
            ],
        };
        setFloorGroups((prev) => [...prev, newGroup]);
        setActiveGroupId(newId);
    };

    const handleDeleteFloorGroup = (groupId: string) => {
        setFloorGroups((prev) => {
            const remaining = prev.filter((g) => g.id !== groupId);
            // If we deleted the active tab, switch to first remaining
            if (groupId === activeGroupId && remaining.length > 0) {
                setActiveGroupId(remaining[0].id);
            }
            return remaining;
        });
    };

    const handleUpdateTableName = (groupId: string, name: string) => {
        setFloorGroups((prev) =>
            prev.map((g) => (g.id === groupId ? { ...g, table_name: name } : g))
        );
    };

    const handleAddFloorType = (groupId: string, type: 'planta' | 'subsuelo' | 'terraza') => {
        setFloorGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g;

                let name = '';
                let description = '';

                if (type === 'planta') {
                    const hasPlantaBaja = g.floors.some((f) => f.name.includes('PLANTA BAJA'));
                    if (!hasPlantaBaja && g.floors.length === 0) {
                        name = 'PLANTA BAJA';
                        description = 'Acceso peatonal, vehicular y ambientes sociales';
                    } else {
                        // Cuenta las plantas numeradas (excluye Planta Baja, subsuelos y terrazas)
                        const existing = g.floors.filter(
                            (f) =>
                                f.name.includes('PLANTA') &&
                                !f.name.includes('BAJA') &&
                                !f.name.includes('SUBSUELO') &&
                                !f.name.includes('TERRAZA')
                        );
                        const nextNum = existing.length + 1;
                        const padded = String(nextNum).padStart(2, '0');
                        name = `${padded}° PLANTA`;
                        description = 'Ambientes proyectados';
                    }
                } else if (type === 'subsuelo') {
                    const existing = g.floors.filter((f) => f.name.includes('SUBSUELO'));
                    const nextNum = existing.length + 1;
                    const padded = String(nextNum).padStart(2, '0');
                    name = `${padded}° SUBSUELO`;
                    description = 'Estacionamiento subterráneo / Bodega';
                } else {
                    const existing = g.floors.filter((f) => f.name.includes('TERRAZA'));
                    const nextNum = existing.length + 1;
                    const padded = String(nextNum).padStart(2, '0');
                    name = `${padded}° TERRAZA`;
                    description = 'Terraza / Azotea accesible';
                }

                const newFloor: FloorItem = {
                    id: String(Date.now()),
                    name,
                    description,
                    area: 0,
                    isActive: true,
                };
                return { ...g, floors: [newFloor, ...g.floors] };
            })
        );
    };

    const handleRemoveFloor = (groupId: string, floorId: string) => {
        setFloorGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g;
                return { ...g, floors: g.floors.filter((f) => f.id !== floorId) };
            })
        );
    };

    const handleUpdateFloor = (
        groupId: string,
        floorId: string,
        field: keyof FloorItem,
        value: string | number | boolean
    ) => {
        setFloorGroups((prev) =>
            prev.map((g) => {
                if (g.id !== groupId) return g;
                const updatedFloors = g.floors.map((f) => {
                    if (f.id === floorId) {
                        const updated = { ...f, [field]: value };
                        if (field === 'area') {
                            updated.isActive = Number(value) > 0;
                        }
                        return updated;
                    }
                    return f;
                });
                const totalArea = updatedFloors.reduce(
                    (sum, fl) => (fl.isActive ? sum + (Number(fl.area) || 0) : sum),
                    0
                );
                return { ...g, floors: updatedFloors, total_area: totalArea };
            })
        );
    };

    const handleToggleServiceAssignment = (groupId: string, serviceId: number) => {
        setFloorGroups((prev) =>
            prev.map((g) => {
                if (g.id === groupId) {
                    const isAssigned = g.assigned_service_ids.includes(serviceId);
                    return {
                        ...g,
                        assigned_service_ids: isAssigned
                            ? g.assigned_service_ids.filter((id) => id !== serviceId)
                            : [...g.assigned_service_ids, serviceId],
                    };
                } else {
                    return {
                        ...g,
                        assigned_service_ids: g.assigned_service_ids.filter((id) => id !== serviceId),
                    };
                }
            })
        );
    };

    const handleAssignFloorGroup = (serviceId: number, floorGroupId: string | null) => {
        setFloorGroups((prev) =>
            prev.map((g) => {
                if (floorGroupId && g.id === floorGroupId) {
                    if (!g.assigned_service_ids.includes(serviceId)) {
                        return { ...g, assigned_service_ids: [...g.assigned_service_ids, serviceId] };
                    }
                    return g;
                } else {
                    return {
                        ...g,
                        assigned_service_ids: g.assigned_service_ids.filter((id) => id !== serviceId),
                    };
                }
            })
        );
    };

    const handleChangeVariable = (serviceId: number, varName: string, value: any) => {
        setFilledVariablesByService((prev) => ({
            ...prev,
            [serviceId]: {
                ...(prev[serviceId] || {}),
                [varName]: value,
            },
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }, 500);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `Hola ${clientData.full_name}, le comparto la cotización ${quoteCode} de BIMETICA para su proyecto en ${clientData.address}. Total M2 edificación: ${totalFloorsM2} m². Inversión estimada: Bs. ${grandTotalBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}. Saludos cordiales.`
        );
        window.open(`https://api.whatsapp.com/send?phone=591${clientData.phone}&text=${text}`, '_blank');
    };

    return (
        <>
            <Head title={`Nueva Cotización - ${quoteCode} | BIMETICA`} />

            {/* CONTENIDO PRINCIPAL: 2 COLUMNAS (HOJA DE COTIZACIÓN IZQUIERDA + SIDEBAR DERECHO) */}
            <main className="mx-auto max-w-7xl w-full flex-1 p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* COLUMNA IZQUIERDA: HOJA DE COTIZACIÓN ARQUITECTÓNICA (8 COLUMNAS) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 print:p-0 print:border-none print:shadow-none">
                        {/* Cabecera de la Hoja Estilo demo/v1 */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                            {/* Logo Oficial Bimetica */}
                            <div className="flex items-center gap-3">
                                <img
                                    src="/bimetica_logo.png"
                                    alt="Bimetica — Diseño y Construcción"
                                    className="h-11 sm:h-12 w-auto object-contain dark:hidden print:block"
                                />
                                <img
                                    src="/bimetica_logo_blanco.png"
                                    alt="Bimetica — Diseño y Construcción"
                                    className="h-11 sm:h-12 w-auto object-contain hidden dark:block print:hidden"
                                />
                            </div>

                            {/* Expediente y Vigencia */}
                            <div className="text-right">
                                <div className="text-xs font-black uppercase tracking-wider text-[#b8860b] dark:text-[#fbad03]">
                                    EXPEDIENTE Nº {quoteCode}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    La Paz, Bolivia · Vigencia 7 días
                                </div>
                            </div>
                        </div>

                        {/* Título Central */}
                        <div className="text-center py-1">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-[#00253d] dark:text-white">
                                COTIZACIÓN
                            </h1>
                        </div>

                        {/* Selector de Cliente Registrado o Nuevo */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/90 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/60 text-xs">
                            <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                                Expediente del Cliente:
                            </span>
                            <div className="flex items-center gap-2">
                                <select
                                    value={clientData.id || ''}
                                    onChange={(e) => {
                                        const cId = Number(e.target.value);
                                        const found = clients.find((c) => c.id === cId);
                                        if (found) {
                                            setClientData({ ...found });
                                        } else {
                                            setClientData({
                                                id: 0,
                                                code: '',
                                                full_name: '',
                                                ci: '',
                                                phone: '',
                                                address: '',
                                                occupation: '',
                                            });
                                        }
                                    }}
                                    className="h-7 text-[11px] rounded border border-slate-300 bg-white px-2.5 font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
                                >
                                    <option value="">-- Escribir cliente nuevo directamente --</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.code} · {c.full_name}
                                        </option>
                                    ))}
                                </select>
                                {clientData.code && (
                                    <span className="text-[10px] font-mono font-bold bg-[#00253d] text-[#fbad03] px-2 py-1 rounded">
                                        {clientData.code}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ficha del Cliente (2x2 Grid de Cajas Totalmente Editables para el Vendedor) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            {/* PROPIETARIO/S */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    PROPIETARIO/S:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.full_name}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, full_name: e.target.value }))
                                    }
                                    placeholder="Nombre del comitente o propietario"
                                    className="mt-0.5 w-full bg-transparent font-bold text-slate-900 dark:text-slate-100 text-xs border-none p-0 focus:outline-hidden"
                                />
                            </div>

                            {/* Nº CELULAR */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    Nº CELULAR:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.phone}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, phone: e.target.value }))
                                    }
                                    placeholder="Número de celular"
                                    className="mt-0.5 w-full font-bold text-slate-900 dark:text-slate-100 text-xs bg-transparent border-none p-0 focus:outline-hidden"
                                />
                            </div>

                            {/* C.I. / NIT */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    C.I. / NIT:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.ci}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, ci: e.target.value }))
                                    }
                                    placeholder="Cédula de Identidad"
                                    className="mt-0.5 w-full font-bold text-slate-900 dark:text-slate-100 text-xs bg-transparent border-none p-0 focus:outline-hidden"
                                />
                            </div>

                            {/* CIUDAD / DIRECCIÓN */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    CIUDAD / UBICACIÓN:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.address}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, address: e.target.value }))
                                    }
                                    placeholder="Ubicación del predio"
                                    className="mt-0.5 w-full font-bold text-slate-900 dark:text-slate-100 text-xs bg-transparent border-none p-0 focus:outline-hidden"
                                />
                            </div>
                        </div>

                        {/* SECCIÓN TAB BAR DE SUPERFICIES / PLANTAS ARQUITECTÓNICAS */}
                        <div className="space-y-0">
                            {/* Tab bar de tablas */}
                            {floorGroups.length > 0 && (
                                <div className="flex items-end flex-wrap gap-0 border-b border-slate-200 dark:border-slate-700 print:hidden">
                                    {floorGroups.map((group, index) => {
                                        const isActive = group.id === activeGroupId;
                                        const tabArea = group.floors
                                            .filter((f) => f.isActive)
                                            .reduce((s, f) => s + (Number(f.area) || 0), 0);
                                        return (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() => setActiveGroupId(group.id)}
                                                className={`relative flex flex-col items-start px-3.5 py-2 text-xs font-semibold transition-colors shrink-0 border-t border-l border-r cursor-pointer ${
                                                    isActive
                                                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-[#003e65] dark:text-[#fbad03] -mb-px rounded-t-lg z-10'
                                                        : 'bg-slate-50 dark:bg-slate-800/60 border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-t-lg'
                                                }`}
                                            >
                                                <span className="font-bold text-[11px] leading-none">
                                                    {floorGroups.length > 1
                                                        ? group.table_name
                                                        : 'PLANTAS'}
                                                </span>
                                                <span className={`text-[10px] font-mono leading-none mt-0.5 ${isActive ? 'text-[#fbad03]' : 'text-slate-400'}`}>
                                                    {tabArea} m²
                                                </span>
                                                {isActive && (
                                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fbad03] rounded-t" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Tabla activa */}
                            {(() => {
                                const activeGroup = floorGroups.find((g) => g.id === activeGroupId) ?? floorGroups[0];
                                if (!activeGroup) return null;
                                return (
                                    <QuoteFloorTable
                                        key={activeGroup.id}
                                        group={activeGroup}
                                        groupIndex={floorGroups.indexOf(activeGroup)}
                                        totalGroups={floorGroups.length}
                                        onUpdateTableName={handleUpdateTableName}
                                        onDeleteGroup={handleDeleteFloorGroup}
                                        onRemoveFloor={handleRemoveFloor}
                                        onUpdateFloor={handleUpdateFloor}
                                        activeServices={activeServices}
                                        onToggleServiceAssignment={handleToggleServiceAssignment}
                                    />
                                );
                            })()}
                        </div>

                        {/* Separador Central Estilo demo/v1 */}
                        <div className="text-center text-xs italic text-slate-500 dark:text-slate-400 py-1">
                            La empresa BIMETICA, ofrece sus servicios en:
                        </div>

                        {/* BLOQUES DE SERVICIOS COTIZADOS (ESTILO demo/v1) */}
                        <div className="space-y-5">
                            {activeServices.length > 0 ? (
                                activeServices.map((service) => (
                                    <QuoteServiceSheetBlock
                                        key={service.id}
                                        service={service}
                                        availableVariables={availableVariables}
                                        floorGroups={floorGroups}
                                        assignedFloorGroupId={serviceToFloorGroupMap[service.id]}
                                        onAssignFloorGroup={handleAssignFloorGroup}
                                        filledVariables={filledVariablesByService[service.id] || {}}
                                        onChangeVariable={handleChangeVariable}
                                        onRemoveService={handleRemoveService}
                                    />
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 dark:border-slate-700">
                                    <p className="text-xs font-semibold">
                                        No has seleccionado ningún servicio para esta cotización.
                                    </p>
                                    <p className="text-[11px] mt-1 text-slate-500">
                                        Usa el panel de la derecha (Motor de Cálculo) para agregar los servicios que requiera el proyecto.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: MOTOR DE CÁLCULO EN VIVO & MULTISELECT DE SERVICIOS (4 COLUMNAS) */}
                    <div className="lg:col-span-4">
                        <QuoteSidebarCalculation
                            totalFloorsM2={totalFloorsM2}
                            activeServices={activeServices}
                            servicesCatalog={servicesCatalog}
                            selectedServiceIds={selectedServiceIds}
                            onToggleService={handleToggleService}
                            onRemoveService={handleRemoveService}
                            serviceSubtotals={serviceSubtotals}
                            serviceM2Values={serviceM2Values}
                            floorGroups={floorGroups}
                            activeGroupId={activeGroupId}
                            onSetActiveGroup={setActiveGroupId}
                            onAddFloorGroup={handleAddFloorGroup}
                            onAddFloorType={handleAddFloorType}
                            cities={cities}
                            selectedCityId={selectedCityId}
                            onChangeCity={setSelectedCityId}
                            viaticoBs={viaticoBs}
                            grandTotalBs={grandTotalBs}
                            onSave={handleSave}
                            isSaving={isSaving}
                            savedSuccess={savedSuccess}
                            onWhatsApp={handleWhatsApp}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

QuoteCreate.layout = {
    breadcrumbs,
};
