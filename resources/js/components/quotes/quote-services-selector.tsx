import { AlertCircle, Check, Compass, HardHat, Plus, Search, XIcon } from 'lucide-react';
import { useState } from 'react';
import { ServiceCategoryBadge } from '@/components/services/service-category-badge';
import { QuoteActiveServices } from './quote-active-services';
import type { ServiceItem } from '@/lib/quote-services';

// Re-exportar tipos y componentes para compatibilidad
export type { ServiceItem } from '@/lib/quote-services';
export { QuoteActiveServices } from './quote-active-services';

interface QuoteServicesSelectorProps {
    servicesCatalog?: ServiceItem[];
    selectedServiceIds: number[];
    onToggleService?: (serviceId: number) => void;
    errorMessage?: string;
}

type CategoryTab = 'all' | 'design' | 'construction';

/**
 * Selector Multicheck de Servicios en Sidebar (Paso 7.6.3)
 * Organiza los servicios en dos categorías claras: Diseño Arquitectónico y Construcción.
 */
export function QuoteServicesSelector({
    servicesCatalog = [],
    selectedServiceIds,
    onToggleService,
    errorMessage,
}: QuoteServicesSelectorProps) {
    // 1. Estado para abrir/cerrar el panel acordeón
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // 2. Estado para el texto del buscador
    const [searchQuery, setSearchQuery] = useState('');

    // 3. Estado de pestaña activa de categoría
    const [activeTab, setActiveTab] = useState<CategoryTab>('all');

    // 4. Filtrar catálogo según búsqueda
    const q = searchQuery.trim().toLowerCase();
    const searchedServices = q
        ? servicesCatalog.filter((s) => s.name.toLowerCase().includes(q))
        : servicesCatalog;

    // 5. Separar por categorías
    const designServices = searchedServices.filter((s) => (s.category || 'design') === 'design');
    const constructionServices = searchedServices.filter((s) => s.category === 'construction');

    // 6. Servicios activos seleccionados (para las tarjetas resumen)
    const activeServices = servicesCatalog.filter((s) => selectedServiceIds.includes(s.id));

    // Renderizador de cada ítem de servicio
    const renderServiceButton = (service: ServiceItem) => {
        const isSelected = selectedServiceIds.includes(service.id);

        return (
            <button
                key={service.id}
                type="button"
                onClick={() => onToggleService?.(service.id)}
                className={`w-full flex items-center justify-between rounded p-1.5 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                        ? 'bg-primary-950 text-white shadow-2xs'
                        : 'bg-card hover:bg-muted text-foreground'
                }`}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <div
                        className={`size-3.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                                ? 'bg-secondary text-primary-950'
                                : 'border border-border bg-card'
                        }`}
                    >
                        {isSelected && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                    <span className="truncate font-semibold text-[11px]">
                        {service.name}
                    </span>
                </div>
                <ServiceCategoryBadge category={service.category} />
            </button>
        );
    };

    return (
        <div className="space-y-2.5">
            {/* Aviso de error de validación en servicios */}
            {errorMessage && (
                <div className="flex items-center gap-1.5 p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-[11px] font-medium leading-tight">
                    <AlertCircle className="size-3.5 shrink-0 text-red-600 dark:text-red-400" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Cabecera del Selector con Badge de Activos */}
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>SERVICIOS DISPONIBLES:</span>
                <span className="text-[10px] font-semibold text-amber-700 dark:text-secondary bg-secondary/15 px-1.5 py-0.5 rounded">
                    {selectedServiceIds.length} activos
                </span>
            </div>

            {/* Botón Trigger / Acordeón */}
            <button
                type="button"
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold shadow-2xs cursor-pointer transition-colors ${
                    errorMessage
                        ? 'border-2 border-red-500 bg-red-50/20 text-red-900 dark:text-red-200'
                        : 'border border-border bg-card text-foreground hover:border-primary'
                }`}
                title={isSelectorOpen ? 'Cerrar selector' : 'Seleccionar servicios para cotizar'}
            >
                <span className="flex items-center gap-1.5 truncate">
                    {isSelectorOpen ? (
                        <XIcon className="size-3.5 text-secondary shrink-0" />
                    ) : (
                        <Plus className="size-3.5 text-secondary shrink-0" />
                    )}
                    <span>
                        {isSelectorOpen ? 'Cerrar selector' : 'Elegir servicios para cotizar...'}
                    </span>
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                    {selectedServiceIds.length} / {servicesCatalog.length}
                </span>
            </button>

            {/* Panel Desplegable con Buscador, Filtro por Categorías y Lista */}
            {isSelectorOpen && (
                <div className="rounded-lg border border-border bg-muted/30 p-2.5 space-y-2 animate-in fade-in-50 duration-150">
                    {/* Buscador Rápido */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2 top-2 size-3 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filtrar servicios..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded border border-border bg-card h-7 pl-6.5 text-[11px] focus:outline-hidden focus:border-primary px-2 text-foreground"
                        />
                    </div>

                    {/* Selector de Pestañas de Categoría */}
                    <div className="grid grid-cols-3 gap-1 bg-muted/60 p-0.5 rounded-md text-[10px] font-bold">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`py-1 rounded transition-colors text-center cursor-pointer ${
                                activeTab === 'all'
                                    ? 'bg-card text-foreground shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('design')}
                            className={`py-1 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1 ${
                                activeTab === 'design'
                                    ? 'bg-card text-foreground shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Compass className="size-2.5 text-[#2684a8]" />
                            <span>Diseño</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('construction')}
                            className={`py-1 rounded transition-colors text-center cursor-pointer flex items-center justify-center gap-1 ${
                                activeTab === 'construction'
                                    ? 'bg-card text-foreground shadow-2xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <HardHat className="size-2.5 text-amber-500" />
                            <span>Construcción</span>
                        </button>
                    </div>

                    {/* Lista Agrupada o Filtrada */}
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-0.5">
                        {searchedServices.length === 0 ? (
                            <p className="text-[11px] text-muted-foreground text-center py-2 italic">
                                No se encontraron servicios
                            </p>
                        ) : activeTab === 'all' ? (
                            <>
                                {designServices.length > 0 && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 px-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <Compass className="size-3 text-[#2684a8]" />
                                            <span>Servicios de Diseño</span>
                                        </div>
                                        {designServices.map(renderServiceButton)}
                                    </div>
                                )}
                                {constructionServices.length > 0 && (
                                    <div className="space-y-1 pt-1">
                                        <div className="flex items-center gap-1 px-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <HardHat className="size-3 text-amber-500" />
                                            <span>Servicios de Construcción</span>
                                        </div>
                                        {constructionServices.map(renderServiceButton)}
                                    </div>
                                )}
                            </>
                        ) : activeTab === 'design' ? (
                            designServices.length === 0 ? (
                                <p className="text-[11px] text-muted-foreground text-center py-2 italic">
                                    No hay servicios de diseño
                                </p>
                            ) : (
                                designServices.map(renderServiceButton)
                            )
                        ) : (
                            constructionServices.length === 0 ? (
                                <p className="text-[11px] text-muted-foreground text-center py-2 italic">
                                    No hay servicios de construcción
                                </p>
                            ) : (
                                constructionServices.map(renderServiceButton)
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Tarjetas Resumen de Servicios Activos */}
            <QuoteActiveServices
                services={activeServices}
                onRemoveService={onToggleService}
            />
        </div>
    );
}
