import {
    Check,
    CheckSquare,
    Layers,
    Plus,
    Search,
    Square,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ServiceItem } from '@/types/services';

interface QuoteServicesMultiSelectProps {
    servicesCatalog: ServiceItem[];
    selectedServiceIds: number[];
    onToggleService: (serviceId: number) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
    onRemoveService: (serviceId: number) => void;
}

export function QuoteServicesMultiSelect({
    servicesCatalog,
    selectedServiceIds,
    onToggleService,
    onSelectAll,
    onClearAll,
    onRemoveService,
}: QuoteServicesMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return servicesCatalog;
        const q = searchQuery.toLowerCase();
        return servicesCatalog.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                (s.description && s.description.toLowerCase().includes(q))
        );
    }, [servicesCatalog, searchQuery]);

    const selectedServices = useMemo(() => {
        return servicesCatalog.filter((s) => selectedServiceIds.includes(s.id));
    }, [servicesCatalog, selectedServiceIds]);

    return (
        <Card className="border-slate-200/80 shadow-xs dark:border-slate-800">
            <CardContent className="p-4 sm:p-5">
                {/* Cabecera del Selector Multiselect */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-md bg-[#003e65] text-white dark:bg-[#003e65] dark:text-[#fbad03]">
                            <Layers className="size-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#003e65] dark:text-[#fbad03]">
                                    Catálogo y Selección de Servicios
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-100/80 text-amber-900 font-bold text-[10px] dark:bg-amber-950/60 dark:text-amber-300"
                                >
                                    {selectedServiceIds.length} {selectedServiceIds.length === 1 ? 'servicio cotizado' : 'servicios cotizados'}
                                </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Marca los servicios arquitectónicos y de ingeniería requeridos para este proyecto
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant={isOpen ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`h-8 gap-1.5 text-xs font-semibold ${
                                isOpen
                                    ? 'bg-[#003e65] text-white hover:bg-[#002f4d]'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200'
                            }`}
                        >
                            <Plus className="size-3.5" />
                            <span>{isOpen ? 'Ocultar Selector' : 'Modificar Selección de Servicios'}</span>
                        </Button>
                    </div>
                </div>

                {/* Panel Desplegable Multiselect */}
                {isOpen && (
                    <div className="mt-3.5 space-y-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 transition-all dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="relative flex-1 min-w-[200px] max-w-sm">
                                <Search className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar servicio por nombre..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8 pl-8 text-xs bg-white dark:bg-slate-800"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onSelectAll}
                                    className="h-7 text-[11px] text-[#003e65] hover:bg-[#003e65]/10 dark:text-[#fbad03]"
                                >
                                    <CheckSquare className="size-3 mr-1" />
                                    Seleccionar Todos
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClearAll}
                                    className="h-7 text-[11px] text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <Square className="size-3 mr-1" />
                                    Limpiar Selección
                                </Button>
                            </div>
                        </div>

                        {/* Cuadrícula de Opciones de Servicios */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-[280px] overflow-y-auto pr-1">
                            {filteredServices.map((service) => {
                                const isSelected = selectedServiceIds.includes(service.id);
                                return (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => onToggleService(service.id)}
                                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                                            isSelected
                                                ? 'border-[#003e65] bg-blue-50/60 shadow-2xs dark:border-[#2684a8] dark:bg-[#003e65]/30'
                                                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                                        }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                                                isSelected
                                                    ? 'border-[#003e65] bg-[#003e65] text-white dark:border-[#2684a8] dark:bg-[#2684a8]'
                                                    : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700'
                                            }`}
                                        >
                                            {isSelected && <Check className="size-3 stroke-[3]" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                                {service.name}
                                            </div>
                                            {service.description && (
                                                <p className="line-clamp-1 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {service.description}
                                                </p>
                                            )}
                                            {/* Preview de fórmulas */}
                                            {service.formulas && service.formulas.length > 0 && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {service.formulas
                                                        .filter((f) => f.is_visible)
                                                        .slice(0, 2)
                                                        .map((f, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-block rounded bg-slate-200/70 px-1.5 py-0.2 text-[9px] font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                                            >
                                                                {f.name}
                                                            </span>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Badges / Chips de Servicios Seleccionados */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                        Servicios Activos:
                    </span>
                    {selectedServices.length > 0 ? (
                        selectedServices.map((service) => (
                            <Badge
                                key={service.id}
                                variant="outline"
                                className="group flex items-center gap-1.5 border-slate-300 bg-white py-1 pl-2 pr-1.5 text-xs text-slate-800 shadow-2xs hover:border-[#003e65] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <span className="font-semibold">{service.name}</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveService(service.id);
                                    }}
                                    className="rounded-full p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                    title="Quitar este servicio"
                                >
                                    <X className="size-3" />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 italic">
                            Ningún servicio seleccionado todavía. Haz clic en "Modificar Selección de Servicios" para agregar.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
