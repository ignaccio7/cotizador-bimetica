import { Head } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Layers,
    Plus,
    Printer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { QuoteClientCard } from '@/components/quotes/quote-client-card';
import { QuoteDesignParameters } from '@/components/quotes/quote-design-parameters';
import { QuoteFinancialPanel } from '@/components/quotes/quote-financial-panel';
import {
    QuoteFloorTable,
    type FloorGroupItem,
} from '@/components/quotes/quote-floor-table';
import { QuoteHeader } from '@/components/quotes/quote-header';
import { QuotePrintSheet } from '@/components/quotes/quote-print-sheet';
import { QuoteServiceSheetBlock } from '@/components/quotes/quote-service-sheet-block';
import { QuoteServicesSelector } from '@/components/quotes/quote-services-selector';
import { QuoteShareWhatsappButton } from '@/components/quotes/quote-share-whatsapp-button';
import { QuoteSheetFooter } from '@/components/quotes/quote-sheet-footer';
import type { ParameterItem, ServiceItem } from '@/lib/quote-services';
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
    services?: ServiceItem[];
    parameters?: ParameterItem[];
    quoteCode?: string;
    nextQuoteCode?: string;
}

export default function QuoteCreate({
    services = [],
    parameters = [],
    quoteCode: propQuoteCode,
    nextQuoteCode,
}: QuoteCreateProps) {
    const quoteCode = propQuoteCode || nextQuoteCode || 'COT-2026-00001';
    const availableServices = services;
    const availableParameters = parameters;

    // ── Estado y Acciones desde Zustand ──
    const clientData = useQuoteStore((state) => state.clientData);
    const updateClientField = useQuoteStore((state) => state.updateClientField);

    const designParameters = useQuoteStore((state) => state.designParameters);
    const updateDesignParameter = useQuoteStore((state) => state.updateDesignParameter);

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

    const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

    // Servicios activos seleccionados para la cotización
    const activeServices = availableServices.filter((s) => selectedServiceIds.includes(s.id));

    // Parámetros clasificados: Tipo de Proyecto para la ficha del cliente y el resto para diseño
    const projectCategoryParameters = availableParameters.filter(
        (p) => p.group === 'project_category'
    );
    const otherParameters = availableParameters.filter(
        (p) => p.group !== 'project_category'
    );

    // Tabla activa seleccionada
    const activeGroup =
        floorGroups.find((g) => g.id === activeGroupId) ??
        floorGroups[0] ?? {
            id: 'group-1',
            table_name: 'Tabla 1',
            assigned_service_ids: [],
            floors: [],
        };

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

                        {/* Ficha del Cliente (4 Cajas Editables: Propietario, Celular, Dirección y Categoría de Proyecto) */}
                        <QuoteClientCard
                            clientData={clientData}
                            onChange={updateClientField}
                            projectCategoryParameters={projectCategoryParameters}
                            selectedProjectCategoryId={designParameters['project_category_id']}
                            onProjectCategoryChange={(id, val, label) => {
                                updateDesignParameter('project_category_id', id);
                                updateDesignParameter('project_category', val);
                                updateDesignParameter('project_category_label', label);
                            }}
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
                            {availableServices.map((s) => s.name).join(', ')}.
                        </div>

                        {/* BLOQUES DE SERVICIOS EN HOJA CENTRAL (PASO 8.2 & 8.3) */}
                        <div className="space-y-4">
                            {activeServices.map((service) => (
                                <QuoteServiceSheetBlock
                                    key={service.id}
                                    service={service}
                                    designParameters={designParameters}
                                    variablesValues={serviceVariables[service.id] || {}}
                                    onChangeVariable={setServiceVariable}
                                    onRemoveService={toggleService}
                                />
                            ))}
                        </div>

                        {/* DESGLOSE DE LA PROPUESTA (PASO 7.6.4) */}
                        {showBreakdown && (
                            <QuoteFinancialPanel
                                activeServices={activeServices}
                                serviceVariables={serviceVariables}
                                designParameters={designParameters}
                                onClose={() => setShowBreakdown(false)}
                            />
                        )}

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
                                    servicesCatalog={availableServices}
                                    selectedServiceIds={selectedServiceIds}
                                    onToggleService={toggleService}
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

                                {/* Listado de todas las tablas registradas con sus m² */}
                                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                                    {floorGroups.map((group) => {
                                        const isCurrentActive = group.id === activeGroup.id;
                                        const groupArea = group.floors.reduce((sum, f) => {
                                            if (!f.isActive) return sum;
                                            return sum + (parseFloat(String(f.area)) || 0);
                                        }, 0);

                                        return (
                                            <button
                                                key={group.id}
                                                type="button"
                                                onClick={() => setActiveGroupId(group.id)}
                                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer text-left border ${isCurrentActive
                                                    ? 'bg-primary-950 text-white border-primary-950 shadow-2xs font-bold'
                                                    : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                                                    }`}
                                                title={`Seleccionar ${group.table_name} como tabla activa`}
                                            >
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <span
                                                        className={`size-1.5 rounded-full ${isCurrentActive
                                                            ? 'bg-secondary'
                                                            : 'bg-muted-foreground/50'
                                                            }`}
                                                    />
                                                    <span className="truncate">{group.table_name}</span>
                                                    {isCurrentActive && (
                                                        <span className="text-[9px] text-secondary font-black uppercase tracking-wider ml-1">
                                                            (Activa)
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`font-mono font-bold shrink-0 ml-2 ${isCurrentActive
                                                        ? 'text-secondary'
                                                        : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    {groupArea} m²
                                                </span>
                                            </button>
                                        );
                                    })}
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

                            {/* PARÁMETROS DE DISEÑO RESTANTES (VIÁTICOS, DESCUENTOS, ETC. - PASO 7.6.2) */}
                            {otherParameters.length > 0 && (
                                <div className="border-t border-border pt-4">
                                    <QuoteDesignParameters
                                        values={designParameters}
                                        availableParameters={otherParameters}
                                        onChange={updateDesignParameter}
                                    />
                                </div>
                            )}

                            {/* BOTÓN DE IMPRESIÓN Y ACCIÓN DE WHATSAPP (PASO 7.6.5 / 7.6.6) */}
                            <div className="border-t border-border pt-4 space-y-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="w-full bg-[#00253d] hover:bg-[#003e65] text-white font-bold h-9.5 text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                    title="Imprimir cotización o guardar como PDF"
                                >
                                    <Printer className="size-4 text-secondary" />
                                    <span>Imprimir / Guardar como PDF</span>
                                </button>

                                <QuoteShareWhatsappButton
                                    quoteCode={quoteCode}
                                    clientData={clientData}
                                    activeServices={activeServices}
                                    serviceVariables={serviceVariables}
                                    designParameters={designParameters}
                                />

                                {/* ENLACE SUTIL PARA DESGLOSAR/OCULTAR PROPUESTA */}
                                <div className="text-center pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setShowBreakdown((prev) => !prev)}
                                        className="text-[11px] text-muted-foreground/70 hover:text-foreground/60 inline-flex items-center gap-1.5 transition-colors cursor-pointer font-medium py-0.5"
                                        title={
                                            showBreakdown
                                                ? 'Ocultar desglose de la propuesta'
                                                : 'Desglosar propuesta'
                                        }
                                    >
                                        {showBreakdown ? (
                                            <>
                                                <EyeOff className="size-3.5" />
                                                <span>Ocultar desglose</span>
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="size-3.5" />
                                                <span>Desglosar propuesta</span>
                                            </>
                                        )}
                                    </button>
                                </div>
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
                    designParameters={designParameters}
                    availableParameters={availableParameters}
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
