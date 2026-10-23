import { Check, Plus, Search, XIcon } from 'lucide-react';
import { useState } from 'react';
import { QuoteActiveServices } from './quote-active-services';
import { DEFAULT_SERVICES, ServiceItem } from '@/lib/quote-services';

// Re-exportar catálogo y tipos para compatibilidad
export { DEFAULT_SERVICES, type ServiceItem } from '@/lib/quote-services';
export { QuoteActiveServices } from './quote-active-services';

interface QuoteServicesSelectorProps {
    servicesCatalog?: ServiceItem[];
    selectedServiceIds: number[];
    onToggleService?: (serviceId: number) => void;
    serviceM2Values?: Record<number, number>;
}

/**
 * Selector Multicheck de Servicios en Sidebar (Pasos 7.1 y 7.2)
 * Integra las tarjetas activas modularizadas en QuoteActiveServices (Paso 7.3)
 */
export function QuoteServicesSelector({
    servicesCatalog = DEFAULT_SERVICES,
    selectedServiceIds,
    onToggleService,
    serviceM2Values = {},
}: QuoteServicesSelectorProps) {
    // 1. Estado para abrir/cerrar el panel acordeón
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // 2. Estado para el texto del buscador
    const [searchQuery, setSearchQuery] = useState('');

    // 3. Filtrar catálogo según búsqueda
    const q = searchQuery.trim().toLowerCase();
    const filteredServices = q
        ? servicesCatalog.filter((s) => s.name.toLowerCase().includes(q))
        : servicesCatalog;

    // 4. Servicios activos seleccionados (para las tarjetas resumen)
    const activeServices = servicesCatalog.filter((s) => selectedServiceIds.includes(s.id));

    return (
        <div className="space-y-2.5">
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
                className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-2xs hover:border-primary cursor-pointer transition-colors"
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

            {/* Panel Desplegable con Buscador y Lista de Checkboxes (Paso 7.2) */}
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

                    {/* Lista de Checkboxes */}
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
                        {filteredServices.length === 0 ? (
                            <p className="text-[11px] text-muted-foreground text-center py-2 italic">
                                No se encontraron servicios
                            </p>
                        ) : (
                            filteredServices.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.id);
                                return (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => onToggleService?.(service.id)}
                                        className={`w-full flex items-center justify-between rounded p-1.5 text-left text-xs transition-colors cursor-pointer ${isSelected
                                                ? 'bg-primary-950 text-white shadow-2xs'
                                                : 'bg-card hover:bg-muted text-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {/* Cajita Cuadrada de Check */}
                                            <div
                                                className={`size-3.5 rounded flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                        ? 'bg-secondary text-primary-950'
                                                        : 'border border-border bg-card'
                                                    }`}
                                            >
                                                {isSelected && <Check className="size-2.5 stroke-[3]" />}
                                            </div>
                                            {/* Nombre del Servicio */}
                                            <span className="truncate font-semibold text-[11px]">
                                                {service.name}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Tarjetas Resumen de Servicios Activos (Paso 7.3 - Componente Modular) */}
            <QuoteActiveServices
                services={activeServices}
                serviceM2Values={serviceM2Values}
                onRemoveService={onToggleService}
            />
        </div>
    );
}
