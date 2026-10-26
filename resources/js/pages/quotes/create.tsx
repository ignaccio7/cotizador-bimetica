import { Head } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Layers, Plus, Printer } from 'lucide-react';
import { useEffect } from 'react';
import { QuoteClientCard } from '@/components/quotes/quote-client-card';
import {
    QuoteFloorTable,
    type FloorGroupItem,
} from '@/components/quotes/quote-floor-table';
import { QuoteHeader } from '@/components/quotes/quote-header';
import { QuoteServiceSheetBlock } from '@/components/quotes/quote-service-sheet-block';
import {
    QuoteServicesSelector,
    DEFAULT_SERVICES,
} from '@/components/quotes/quote-services-selector';
import { QuotePrintSheet } from '@/components/quotes/quote-print-sheet';
import { QuoteSheetFooter } from '@/components/quotes/quote-sheet-footer';
import quotesRoute from '@/routes/quotes';
import { useQuoteStore } from '@/stores/use-quote-store';
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

    // ── Estado y Acciones desde Zustand ──
    const clientData = useQuoteStore((state) => state.clientData);
    const updateClientField = useQuoteStore((state) => state.updateClientField);

    const floorGroups = useQuoteStore((state) => state.floorGroups);
    const activeGroupId = useQuoteStore((state) => state.activeGroupId);
    const setActiveGroupId = useQuoteStore((state) => state.setActiveGroupId);
    const updateTableName = useQuoteStore((state) => state.updateTableName);
    const addFloorGroup = useQuoteStore((state) => state.addFloorGroup);
    const deleteFloorGroup = useQuoteStore((state) => state.deleteFloorGroup);

    const addFloorType = useQuoteStore((state) => state.addFloorType);
    const toggleFloor = useQuoteStore((state) => state.toggleFloor);
    const updateFloor = useQuoteStore((state) => state.updateFloor);
    const removeFloor = useQuoteStore((state) => state.removeFloor);
    const toggleServiceAssignment = useQuoteStore((state) => state.toggleServiceAssignment);

    const selectedServiceIds = useQuoteStore((state) => state.selectedServiceIds);
    const toggleService = useQuoteStore((state) => state.toggleService);
    const serviceVariables = useQuoteStore((state) => state.serviceVariables);
    const setServiceVariable = useQuoteStore((state) => state.setServiceVariable);

    const resetQuoteStore = useQuoteStore((state) => state.resetQuoteStore);

    // Reset del store al montar la página para asegurar ciclo de vida limpio en Inertia
    useEffect(() => {
        resetQuoteStore();
    }, [resetQuoteStore]);

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

            {/* CONTENIDO PRINCIPAL: 2 COLUMNAS (HOJA DE COTIZACIÓN IZQUIERDA + SIDEBAR DERECHO) — OCULTO AL IMPRIMIR */}
            <main className="w-full flex-1 p-4 md:p-6 print:hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                    {/* COLUMNA IZQUIERDA: HOJA DE COTIZACIÓN ARQUITECTÓNICA (8 COLUMNAS) */}
                    <div className="order-2 lg:order-1 lg:col-span-8 bg-card rounded-xl shadow-xs border border-border p-6 sm:p-8 space-y-6">
                        {/* Cabecera de la Hoja y Título Central */}
                        <QuoteHeader quoteCode={quoteCode} />

                        {/* Ficha del Cliente (4 Cajas Editables) */}
                        <QuoteClientCard
                            clientData={clientData}
                            onChange={updateClientField}
                        />

                        {/* SECCIÓN TABLAS Y SUPERFICIES (PASO 5.1 & 5.2 - PESTAÑAS + TABLA MODULARIZADAS) */}
                        <QuoteFloorTable
                            groups={floorGroups}
                            activeGroupId={activeGroupId}
                            activeServices={activeServices}
                            onSelectGroup={setActiveGroupId}
                            onUpdateTableName={updateTableName}
                            onDeleteGroup={deleteFloorGroup}
                            onToggleFloor={(floorId) => toggleFloor(activeGroup.id, floorId)}
                            onUpdateFloor={(floorId, field, value) =>
                                updateFloor(activeGroup.id, floorId, field, value)
                            }
                            onRemoveFloor={(floorId) => removeFloor(activeGroup.id, floorId)}
                            onToggleServiceAssignment={(serviceId) =>
                                toggleServiceAssignment(activeGroup.id, serviceId)
                            }
                        />

                        {/* SEPARADOR INSTITUCIONAL (PASO 8.1) */}
                        <div className="text-center text-xs italic text-muted-foreground py-1 font-serif tracking-wide">
                            La empresa BIMETICA, ofrece sus servicios en:{' '}
                            {DEFAULT_SERVICES.map((s) => s.name).join(', ')}.
                        </div>

                        {/* BLOQUES DE SERVICIOS EN HOJA CENTRAL (PASO 8.2 & 8.3) */}
                        <div className="space-y-4">
                            {activeServices.map((service) => (
                                <QuoteServiceSheetBlock
                                    key={service.id}
                                    service={service}
                                    variablesValues={serviceVariables[service.id] || {}}
                                    onChangeVariable={setServiceVariable}
                                    onRemoveService={toggleService}
                                />
                            ))}
                        </div>

                        {/* PIE DE COTIZACIÓN INSTITUCIONAL (PASO 8.4) */}
                        <QuoteSheetFooter />
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
                                    onToggleService={toggleService}
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
                                        onClick={addFloorGroup}
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
                                        onClick={() => addFloorType(activeGroup.id, 'planta')}
                                        className="flex-1 min-w-0 text-[11px] bg-secondary text-secondary-foreground hover:bg-amber-400 px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Agregar planta a la tabla activa (ej. 01° PLANTA, 02° PLANTA...)"
                                    >
                                        <Plus className="size-3 shrink-0" />
                                        <span>Planta</span>
                                        <ChevronUp className="size-3 shrink-0" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => addFloorType(activeGroup.id, 'subsuelo')}
                                        className="flex-1 min-w-0 text-[11px] bg-slate-700 text-white hover:bg-slate-600 px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Agregar subsuelo a la tabla activa (ej. 01° SUBSUELO...)"
                                    >
                                        <Plus className="size-3 shrink-0" />
                                        <span>Subsuelo</span>
                                        <ChevronDown className="size-3 shrink-0" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => addFloorType(activeGroup.id, 'terraza')}
                                        className="w-full text-[11px] bg-[#2684a8] text-white hover:bg-[#1f6b8a] px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                        title="Agregar terraza a la tabla activa (ej. 01° TERRAZA...)"
                                    >
                                        <Plus className="size-3 shrink-0" />
                                        <span>Terraza</span>
                                    </button>
                                </div>
                            </div>

                            {/* BOTÓN DE IMPRESIÓN Y EXPORTACIÓN A PDF (PASO 8.5) */}
                            <div className="border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="w-full bg-[#00253d] hover:bg-[#003e65] text-white font-bold h-10 text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                    title="Imprimir cotización o guardar como PDF"
                                >
                                    <Printer className="size-4 text-secondary" />
                                    <span>Imprimir / Guardar como PDF</span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* HOJA DE IMPRESIÓN ESTRICTA: SOLO VISIBLE AL IMPRIMIR (HIDDEN EN PANTALLA) */}
            <div className="hidden print:block w-full">
                <QuotePrintSheet
                    quoteCode={quoteCode}
                    clientData={clientData}
                    floorGroups={floorGroups}
                    activeServices={activeServices}
                    serviceVariables={serviceVariables}
                />
            </div>
        </>
    );
}

QuoteCreate.layout = {
    breadcrumbs,
};
