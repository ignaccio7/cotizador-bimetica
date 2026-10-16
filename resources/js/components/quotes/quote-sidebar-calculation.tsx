import {
    Check,
    ChevronDown,
    ChevronUp,
    Layers,
    MapPin,
    MessageCircle,
    Plus,
    Save,
    Search,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CityItem, FloorGroupItem } from '@/types/quotes';
import type { ServiceItem } from '@/types/services';

interface QuoteSidebarCalculationProps {
    totalFloorsM2: number;
    activeServices: ServiceItem[];
    servicesCatalog: ServiceItem[];
    selectedServiceIds: number[];
    onToggleService: (serviceId: number) => void;
    onRemoveService: (serviceId: number) => void;
    serviceSubtotals: Record<number, number>;
    serviceM2Values: Record<number, number | string>;
    // Tablas de pisos
    floorGroups: FloorGroupItem[];
    activeGroupId: string | null;
    onSetActiveGroup: (groupId: string) => void;
    onAddFloorGroup: () => void;
    onAddFloorType: (groupId: string, type: 'planta' | 'subsuelo' | 'terraza') => void;
    // Ciudad / viáticos
    cities: CityItem[];
    selectedCityId: number;
    onChangeCity: (cityId: number) => void;
    viaticoBs: number;
    grandTotalBs: number;
    onSave: () => void;
    isSaving: boolean;
    savedSuccess: boolean;
    onWhatsApp: () => void;
}

export function QuoteSidebarCalculation({
    totalFloorsM2,
    activeServices,
    servicesCatalog,
    selectedServiceIds,
    onToggleService,
    onRemoveService,
    serviceSubtotals,
    serviceM2Values,
    floorGroups,
    activeGroupId,
    onSetActiveGroup,
    onAddFloorGroup,
    onAddFloorType,
    cities,
    selectedCityId,
    onChangeCity,
    viaticoBs,
    grandTotalBs,
    onSave,
    isSaving,
    savedSuccess,
    onWhatsApp,
}: QuoteSidebarCalculationProps) {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
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

    const availableServicesToAdd = useMemo(() => {
        return servicesCatalog.filter((s) => !selectedServiceIds.includes(s.id));
    }, [servicesCatalog, selectedServiceIds]);

    const activeGroup = floorGroups.find((g) => g.id === activeGroupId) ?? floorGroups[0] ?? null;

    return (
        <div className="space-y-4 sticky top-6 print:hidden">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
                {/* Cabecera del Widget */}
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[#fbad03] text-slate-950 font-black text-sm">
                        ∑
                    </div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        Motor de Cálculo en Vivo
                    </h2>
                </div>

                {/* Tarjeta de M2 Evaluado */}
                <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 dark:bg-slate-800/60 dark:border-slate-700/60 space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        M2 EVALUADO (PLANTAS)
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                            {totalFloorsM2.toLocaleString('es-BO')}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">m²</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                        Suma computable de superficies
                    </span>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Inversión Total:</span>
                        <span className="font-mono font-black text-slate-900 dark:text-[#fbad03] text-sm">
                            Bs. {grandTotalBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* ─── SELECTOR MULTISELECT DE SERVICIOS ─── */}
                <div className="space-y-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>SERVICIOS DISPONIBLES:</span>
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                            {activeServices.length} activos
                        </span>
                    </div>

                    {/* Botón trigger para desplegar u ocultar el multiselect */}
                    <button
                        type="button"
                        onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#003e65] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
                    >
                        <span className="flex items-center gap-1.5 truncate">
                            <Plus className="size-3.5 text-[#fbad03]" />
                            {isSelectorOpen
                                ? 'Cerrar selector'
                                : availableServicesToAdd.length > 0
                                  ? '+ Seleccionar servicios para cotizar...'
                                  : '✓ Todos los servicios seleccionados'}
                        </span>
                        <span className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold">
                            {selectedServiceIds.length} / {servicesCatalog.length}
                        </span>
                    </button>

                    {/* Panel Multiselect Desplegable */}
                    {isSelectorOpen && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/90 space-y-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-2 top-2 size-3 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Filtrar servicios..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-7 pl-6.5 text-[11px] bg-white dark:bg-slate-800"
                                />
                            </div>

                            <div className="max-h-48 overflow-y-auto space-y-1 pr-0.5">
                                {filteredServices.map((service) => {
                                    const isSelected = selectedServiceIds.includes(service.id);
                                    return (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => onToggleService(service.id)}
                                            className={`w-full flex items-center justify-between rounded p-1.5 text-left text-xs transition-colors cursor-pointer ${
                                                isSelected
                                                    ? 'bg-[#00253d] text-white'
                                                    : 'bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div
                                                    className={`size-3.5 rounded flex items-center justify-center shrink-0 ${
                                                        isSelected
                                                            ? 'bg-[#fbad03] text-slate-950'
                                                            : 'border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                                                </div>
                                                <span className="truncate font-semibold text-[11px]">
                                                    {service.name}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Lista de servicios seleccionados */}
                    <div className="space-y-2 pt-1 max-h-[300px] overflow-y-auto pr-0.5">
                        {activeServices.map((service) => {
                            const serviceM2 = serviceM2Values[service.id] ?? 0;
                            const subtotal = serviceSubtotals[service.id] ?? 0;

                            return (
                                <div
                                    key={service.id}
                                    className="group relative flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/80"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                                            <Check className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            <span className="truncate">{service.name}</span>
                                        </div>

                                        {service.description && (
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                {service.description}
                                            </div>
                                        )}

                                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                                            <span>Computado:</span>
                                            <span className="font-bold">
                                                {service.name.toLowerCase().includes('suelo')
                                                    ? `${serviceM2} pozos`
                                                    : `${serviceM2} m²`}
                                            </span>
                                        </div>

                                        <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-200/60 dark:border-slate-700/60 pt-1">
                                            <span className="text-slate-500 text-[10px]">
                                                Subtotal servicio:
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-[#fbad03]">
                                                Bs. {subtotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onRemoveService(service.id)}
                                        className="size-5 rounded flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                                        title="Quitar servicio de la cotización"
                                    >
                                        <Trash2 className="size-3" />
                                    </button>
                                </div>
                            );
                        })}

                        {activeServices.length === 0 && (
                            <p className="text-xs text-slate-400 text-center py-2 italic">
                                No hay servicios agregados todavía.
                            </p>
                        )}
                    </div>
                </div>

                {/* ─── CONTROLES DE TABLAS DE PLANTAS ─── */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <Layers className="size-3.5 text-[#fbad03]" />
                            <span>TABLAS DE PLANTAS:</span>
                        </div>
                        <button
                            type="button"
                            onClick={onAddFloorGroup}
                            className="text-[10px] bg-[#00253d] hover:bg-[#003e65] text-white px-2 py-1 rounded font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Crear una nueva tabla de superficies independiente"
                        >
                            <Plus className="size-2.5 text-[#fbad03]" />
                            <span>Nueva tabla</span>
                        </button>
                    </div>

                    {/* Información de tabla activa */}
                    {activeGroup && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            Tabla activa:{' '}
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                                {floorGroups.length > 1 ? activeGroup.table_name : 'Edificación Principal'}
                            </span>
                            {' · '}
                            <span className="font-mono font-bold text-[#003e65] dark:text-[#fbad03]">
                                {activeGroup.floors
                                    .filter((f) => f.isActive)
                                    .reduce((s, f) => s + (Number(f.area) || 0), 0)} m²
                            </span>
                        </div>
                    )}

                    {/* Botones de nivel: Planta / Subsuelo / Terraza */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                            type="button"
                            onClick={() => activeGroup && onAddFloorType(activeGroup.id, 'planta')}
                            disabled={!activeGroup}
                            className="flex-1 min-w-0 text-[11px] bg-[#fbad03] text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title="Agregar planta (numeración automática)"
                        >
                            <Plus className="size-3 shrink-0" />
                            <span>Planta</span>
                            <ChevronUp className="size-3 shrink-0" />
                        </button>

                        <button
                            type="button"
                            onClick={() => activeGroup && onAddFloorType(activeGroup.id, 'subsuelo')}
                            disabled={!activeGroup}
                            className="flex-1 min-w-0 text-[11px] bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title="Agregar subsuelo / sótano"
                        >
                            <Plus className="size-3 shrink-0" />
                            <span>Subsuelo</span>
                            <ChevronDown className="size-3 shrink-0" />
                        </button>

                        <button
                            type="button"
                            onClick={() => activeGroup && onAddFloorType(activeGroup.id, 'terraza')}
                            disabled={!activeGroup}
                            className="w-full text-[11px] bg-[#2684a8] text-white hover:bg-[#1f6b8a] disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-md font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title="Agregar terraza / azotea"
                        >
                            <Plus className="size-3 shrink-0" />
                            <span>Terraza</span>
                        </button>
                    </div>
                </div>

                {/* ─── SELECTOR DE CIUDAD / VIÁTICOS ─── */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="size-3.5 text-[#2684a8]" />
                        <span>Ciudad / Viático:</span>
                    </div>

                    <select
                        value={selectedCityId}
                        onChange={(e) => onChangeCity(Number(e.target.value))}
                        className="w-full h-8 rounded border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name} {city.viatico > 0 ? `(+Bs. ${city.viatico.toFixed(2)})` : '(Sin recargo)'}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Viático de viaje:</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            Bs. {viaticoBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* ─── BOTONES DE ACCIÓN ─── */}
                <div className="space-y-2 pt-2">
                    <Button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || activeServices.length === 0}
                        className="w-full bg-[#00253d] hover:bg-[#003e65] text-white font-bold h-9 text-xs shadow-xs gap-2 cursor-pointer"
                    >
                        <Save className="size-3.5" />
                        <span>{isSaving ? 'Guardando...' : 'Guardar y Sincronizar Cotización'}</span>
                    </Button>

                    {savedSuccess && (
                        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-2 text-center text-xs font-semibold text-emerald-800">
                            ✓ Cotización guardada en el sistema
                        </div>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onWhatsApp}
                        disabled={activeServices.length === 0}
                        className="w-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80 font-semibold h-9 text-xs gap-2 cursor-pointer"
                    >
                        <MessageCircle className="size-3.5 text-emerald-600" />
                        <span>Compartir por WhatsApp</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
