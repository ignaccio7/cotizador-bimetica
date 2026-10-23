import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Layers, Plus } from 'lucide-react';
import { useState } from 'react';
import { QuoteClientCard, type ClientData } from '@/components/quotes/quote-client-card';
import {
    QuoteFloorTable,
    createFloorName,
    getFloorDefaultDescription,
    insertFloorInOrder,
    type FloorGroupItem,
    type FloorItem,
} from '@/components/quotes/quote-floor-table';
import { QuoteHeader } from '@/components/quotes/quote-header';
import {
    QuoteServicesSelector,
    DEFAULT_SERVICES,
    type ServiceItem,
} from '@/components/quotes/quote-services-selector';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

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

interface QuoteCreateProps {
    nextQuoteCode?: string;
}

export default function QuoteCreate({ nextQuoteCode = 'COT-2026-001' }: QuoteCreateProps) {
    const quoteCode = nextQuoteCode || 'COT-2026-001';

    // Ficha del cliente editable directamente por el vendedor
    const [clientData, setClientData] = useState<ClientData>({
        fullName: 'JANETH / EUNICE MIRANDA NAVIA',
        phone: '76734409',
        ci: '76734409 LP',
        address: 'BAJO SAN ANTONIO, AV. PRINCIPAL #450',
    });

    const handleClientChange = (field: keyof ClientData, value: string) => {
        setClientData((prev) => ({ ...prev, [field]: value }));
    };

    // Estado multitabla de superficies / plantas (Paso 5.1 & 5.2)
    const [floorGroups, setFloorGroups] = useState<FloorGroupItem[]>([
        {
            id: 'group-1',
            table_name: 'Tabla 1',
            assigned_service_ids: [1],
            floors: [
                {
                    id: 'floor-1',
                    name: 'PLANTA BAJA',
                    description: 'Acceso peatonal, vehicular y ambientes sociales',
                    area: '',
                    isActive: true,
                },
            ],
        },
    ]);
    const [activeGroupId, setActiveGroupId] = useState<string>('group-1');
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([1]);

    const handleToggleService = (serviceId: number) => {
        setSelectedServiceIds((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    // Servicios activos seleccionados para la cotización
    const activeServices = DEFAULT_SERVICES.filter((s) => selectedServiceIds.includes(s.id));

    // Tabla activa seleccionada
    const activeGroup =
        floorGroups.find((g) => g.id === activeGroupId) ??
        floorGroups[0] ?? {
            id: 'group-1',
            table_name: 'Tabla 1',
            assigned_service_ids: [1],
            floors: [],
        };

    const handleUpdateTableName = (groupId: string, newName: string) => {
        setFloorGroups((prev) =>
            prev.map((g) => (g.id === groupId ? { ...g, table_name: newName } : g))
        );
    };

    // Crear nueva tabla garantizando nombre único no repetitivo (Tabla 1, Tabla 2, Tabla 3...)
    const handleAddFloorGroup = () => {
        // Encuentra el menor número correlativo que no colisione con nombres existentes
        let nextNumber = 1;
        while (
            floorGroups.some(
                (g) => g.table_name.trim().toLowerCase() === `tabla ${nextNumber}`
            )
        ) {
            nextNumber++;
        }

        const newId = `group-${Date.now()}`;
        const newGroup: FloorGroupItem = {
            id: newId,
            table_name: `Tabla ${nextNumber}`,
            assigned_service_ids: [1],
            floors: [
                {
                    id: 'floor-1',
                    name: 'PLANTA BAJA',
                    description: 'Acceso peatonal, vehicular y ambientes sociales',
                    area: '',
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
            if (groupId === activeGroupId && remaining.length > 0) {
                setActiveGroupId(remaining[0].id);
            }
            return remaining;
        });
    };

    // Función auxiliar: modifica la tabla activa en la lista maestra en un solo lugar
    const updateActiveGroup = (
        modifier: (currentGroup: FloorGroupItem) => FloorGroupItem
    ) => {
        setFloorGroups((prev) =>
            prev.map((g) => (g.id === activeGroupId ? modifier(g) : g))
        );
    };

    // Agregar nivel (Planta, Subsuelo o Terraza) con inserción arquitectónica ordenada
    const handleAddFloorType = (_groupId: string, type: 'planta' | 'subsuelo' | 'terraza') => {
        updateActiveGroup((group) => {
            const name = createFloorName(type, group.floors);
            const description = getFloorDefaultDescription(type, name);
            const newFloor: FloorItem = {
                id: `floor-${Date.now()}`,
                name,
                description,
                area: '',
                isActive: true,
            };

            return {
                ...group,
                floors: insertFloorInOrder(group.floors, newFloor, type),
            };
        });
    };

    // 1. Alternar computabilidad (checkbox) de un nivel
    const handleToggleFloor = (floorId: string) => {
        updateActiveGroup((group) => ({
            ...group,
            floors: group.floors.map((f) =>
                f.id === floorId ? { ...f, isActive: !f.isActive } : f
            ),
        }));
    };

    // 2. Modificar un campo (nombre, descripción, m2) de un nivel
    const handleUpdateFloor = (
        floorId: string,
        field: keyof FloorItem,
        value: string | number | boolean
    ) => {
        updateActiveGroup((group) => ({
            ...group,
            floors: group.floors.map((f) =>
                f.id === floorId ? { ...f, [field]: value } : f
            ),
        }));
    };

    // 3. Eliminar un nivel de la tabla activa
    const handleRemoveFloor = (floorId: string) => {
        updateActiveGroup((group) => ({
            ...group,
            floors: group.floors.filter((f) => f.id !== floorId),
        }));
    };

    // 4. Asignar o desasignar servicio que computa esta tabla
    const handleToggleServiceAssignment = (serviceId: number) => {
        updateActiveGroup((group) => ({
            ...group,
            assigned_service_ids: group.assigned_service_ids.includes(serviceId)
                ? group.assigned_service_ids.filter((id) => id !== serviceId)
                : [...group.assigned_service_ids, serviceId],
        }));
    };

    // Superficie total de la tabla activa
    const activeGroupArea = activeGroup.floors.reduce((sum, f) => {
        if (!f.isActive) return sum;
        const val = parseFloat(String(f.area)) || 0;
        return sum + val;
    }, 0);

    // Superficie total asignada a cada servicio
    const serviceM2Values: Record<number, number> = {};
    floorGroups.forEach((group) => {
        const groupArea = group.floors.reduce(
            (sum, f) => (f.isActive ? sum + (parseFloat(String(f.area)) || 0) : sum),
            0
        );
        group.assigned_service_ids.forEach((id) => {
            serviceM2Values[id] = (serviceM2Values[id] ?? 0) + groupArea;
        });
    });

    return (
        <>
            <Head title={`Nueva Cotización - ${quoteCode} | BIMETICA`} />

            {/* CONTENIDO PRINCIPAL: 2 COLUMNAS (HOJA DE COTIZACIÓN IZQUIERDA + SIDEBAR DERECHO) */}
            <main className="w-full flex-1 p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                    {/* COLUMNA IZQUIERDA: HOJA DE COTIZACIÓN ARQUITECTÓNICA (8 COLUMNAS) */}
                    <div className="order-2 lg:order-1 lg:col-span-8 bg-card rounded-xl shadow-xs border border-border p-6 sm:p-8 space-y-6 print:p-0 print:border-none print:shadow-none">
                        {/* Cabecera de la Hoja y Título Central */}
                        <QuoteHeader quoteCode={quoteCode} />

                        {/* Ficha del Cliente (4 Cajas Editables) */}
                        <QuoteClientCard
                            clientData={clientData}
                            onChange={handleClientChange}
                        />

                        {/* SECCIÓN TABLAS Y SUPERFICIES (PASO 5.1 & 5.2 - PESTAÑAS + TABLA MODULARIZADAS) */}
                        <QuoteFloorTable
                            groups={floorGroups}
                            activeGroupId={activeGroupId}
                            activeServices={activeServices}
                            onSelectGroup={setActiveGroupId}
                            onUpdateTableName={handleUpdateTableName}
                            onDeleteGroup={handleDeleteFloorGroup}
                            onToggleFloor={handleToggleFloor}
                            onUpdateFloor={handleUpdateFloor}
                            onRemoveFloor={handleRemoveFloor}
                            onToggleServiceAssignment={handleToggleServiceAssignment}
                        />
                    </div>

                    {/* COLUMNA DERECHA: MOTOR DE CÁLCULO (4 COLUMNAS - PASO 3.1 & 3.2) */}
                    <aside aria-label="Motor de Cálculo" className="order-1 lg:order-2 lg:col-span-4 sticky top-6 print:hidden space-y-4">
                        <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                            {/* Cabecera del Widget */}
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-black text-sm shadow-2xs">
                                    ∑
                                </div>
                                <h2 className="font-bold text-foreground text-sm tracking-tight">
                                    Motor de Cálculo
                                </h2>
                            </div>

                            {/* SELECTOR MULTISELECT DE SERVICIOS (PASO 7.1 & 7.3) */}
                            <div className="border-t border-border pt-4">
                                <QuoteServicesSelector
                                    servicesCatalog={DEFAULT_SERVICES}
                                    selectedServiceIds={selectedServiceIds}
                                    onToggleService={handleToggleService}
                                    serviceM2Values={serviceM2Values}
                                />
                            </div>

                            {/* CONTROLES DE TABLAS DE PLANTAS (ACCIONES DEL ASIDE) */}
                            <div className="border-t border-border pt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                        <Layers className="size-3.5 text-secondary" />
                                        <span>TABLAS DE PLANTAS:</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddFloorGroup}
                                        className="text-[10px] bg-primary-950 hover:bg-primary-900 text-white px-2 py-1 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                                        title="Crear una nueva tabla de superficies independiente"
                                    >
                                        <Plus className="size-2.5 text-secondary" />
                                        <span>Nueva tabla</span>
                                    </button>
                                </div>

                                {/* Información de tabla activa */}
                                <div className="text-[10px] text-muted-foreground">
                                    Tabla activa:{' '}
                                    <span className="font-bold text-foreground">
                                        {activeGroup.table_name}
                                    </span>
                                    {' · '}
                                    <span className="font-mono font-bold text-secondary">
                                        {activeGroupArea} m²
                                    </span>
                                </div>

                                {/* Botones de acción para insertar niveles en la tabla activa */}
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleAddFloorType(activeGroup.id, 'planta')}
                                        className="flex-1 min-w-0 text-[11px] bg-secondary text-secondary-foreground hover:bg-amber-400 px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Agregar planta a la tabla activa (ej. 01° PLANTA, 02° PLANTA...)"
                                    >
                                        <Plus className="size-3 shrink-0" />
                                        <span>Planta</span>
                                        <ChevronUp className="size-3 shrink-0" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAddFloorType(activeGroup.id, 'subsuelo')}
                                        className="flex-1 min-w-0 text-[11px] bg-slate-700 text-white hover:bg-slate-600 px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Agregar subsuelo a la tabla activa (ej. 01° SUBSUELO...)"
                                    >
                                        <Plus className="size-3 shrink-0" />
                                        <span>Subsuelo</span>
                                        <ChevronDown className="size-3 shrink-0" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAddFloorType(activeGroup.id, 'terraza')}
                                        className="w-full text-[11px] bg-[#2684a8] text-white hover:bg-[#1f6b8a] px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Agregar terraza a la tabla activa (ej. 01° TERRAZA...)"
                                    >
                                        <Plus className="size-3 shrink-0" />
                                        <span>Terraza</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
}

QuoteCreate.layout = {
    breadcrumbs,
};
