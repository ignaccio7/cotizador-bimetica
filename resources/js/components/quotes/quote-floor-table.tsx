import { Check, Layers, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import type { FloorGroupItem, FloorItem } from '@/types/quotes';
import type { ServiceItem } from '@/types/services';

interface QuoteFloorTableProps {
    group: FloorGroupItem;
    groupIndex: number;
    totalGroups: number;
    onUpdateTableName: (groupId: string, name: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onRemoveFloor: (groupId: string, floorId: string) => void;
    onUpdateFloor: (
        groupId: string,
        floorId: string,
        field: keyof FloorItem,
        value: string | number | boolean
    ) => void;
    activeServices: ServiceItem[];
    onToggleServiceAssignment: (groupId: string, serviceId: number) => void;
}

export function QuoteFloorTable({
    group,
    groupIndex,
    totalGroups,
    onUpdateTableName,
    onDeleteGroup,
    onRemoveFloor,
    onUpdateFloor,
    activeServices,
    onToggleServiceAssignment,
}: QuoteFloorTableProps) {
    const totalGroupM2 = useMemo(() => {
        return group.floors.reduce(
            (sum, f) => (f.isActive ? sum + (Number(f.area) || 0) : sum),
            0
        );
    }, [group.floors]);

    return (
        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs">
            {/* Cabecera Amarilla Arquitectónica Estilo demo/v1 — limpia, sin botones */}
            <div className="bg-[#fbad03] text-slate-950 font-black px-4 py-2 flex items-center justify-between text-xs uppercase tracking-wider gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-black">
                        {totalGroups > 1 ? `TABLA #${groupIndex + 1}:` : 'PLANTAS'}
                    </span>
                    {totalGroups > 1 && (
                        <input
                            type="text"
                            value={group.table_name}
                            onChange={(e) => onUpdateTableName(group.id, e.target.value)}
                            className="bg-transparent border-b border-slate-900/40 text-slate-950 font-black text-xs focus:outline-hidden p-0 max-w-[180px]"
                            placeholder="Nombre de tabla"
                        />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className="font-bold">M2</span>
                    {totalGroups > 1 && (
                        <button
                            type="button"
                            onClick={() => onDeleteGroup(group.id)}
                            className="print:hidden text-slate-900 hover:text-red-700 transition-colors p-0.5 cursor-pointer"
                            title="Eliminar esta tabla de superficies"
                        >
                            <Trash2 className="size-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filas de la Tabla con Inputs Transparentes como demo/v1 */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs bg-white dark:bg-slate-900">
                {group.floors.length === 0 ? (
                    <div className="py-8 px-4 text-center text-slate-400 dark:text-slate-500">
                        <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                            Esta tabla aún no tiene niveles ni plantas registradas.
                        </p>
                        <p className="text-[11px] mt-1 text-slate-400">
                            Haz clic en <span className="font-bold text-amber-700 dark:text-amber-400">+ Planta</span>, <span className="font-bold text-slate-700 dark:text-slate-200">+ Subsuelo</span> o <span className="font-bold text-[#2684a8]">+ Terraza</span> en el panel derecho para comenzar a cargar superficies.
                        </p>
                    </div>
                ) : (
                    group.floors.map((row) => (
                        <div
                            key={row.id}
                            className={`flex items-center justify-between gap-3 px-4 py-2 transition-colors ${
                                row.isActive
                                    ? 'bg-white dark:bg-slate-900'
                                    : 'bg-slate-50/60 dark:bg-slate-900/40 text-slate-400'
                            }`}
                        >
                            <div className="flex flex-1 items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={row.isActive}
                                    onChange={(e) =>
                                        onUpdateFloor(group.id, row.id, 'isActive', e.target.checked)
                                    }
                                    className="size-3.5 rounded border-slate-300 text-[#003e65] focus:ring-[#003e65]"
                                />

                                {/* Nivel editable */}
                                <input
                                    type="text"
                                    value={row.name}
                                    disabled={!row.isActive}
                                    onChange={(e) =>
                                        onUpdateFloor(group.id, row.id, 'name', e.target.value)
                                    }
                                    className="w-28 font-bold text-slate-800 dark:text-slate-200 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#003e65] focus:outline-hidden text-xs p-0"
                                />

                                {/* Descripción editable */}
                                <input
                                    type="text"
                                    value={row.description}
                                    disabled={!row.isActive}
                                    onChange={(e) =>
                                        onUpdateFloor(group.id, row.id, 'description', e.target.value)
                                    }
                                    placeholder="Descripción de la planta"
                                    className="flex-1 text-slate-600 dark:text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#003e65] focus:outline-hidden text-xs p-0"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                {/* M2 editable de la planta */}
                                <input
                                    type="number"
                                    min="0"
                                    value={row.area === 0 ? '' : row.area}
                                    disabled={!row.isActive}
                                    onChange={(e) =>
                                        onUpdateFloor(group.id, row.id, 'area', Number(e.target.value) || 0)
                                    }
                                    placeholder="-"
                                    className="w-16 text-right font-mono font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#003e65] focus:outline-hidden text-xs p-0"
                                />

                                {/* Botón eliminar fila */}
                                <button
                                    type="button"
                                    onClick={() => onRemoveFloor(group.id, row.id)}
                                    className="print:hidden text-slate-300 hover:text-red-600 p-0.5 transition-colors cursor-pointer"
                                    title="Eliminar esta planta"
                                >
                                    <Trash2 className="size-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Total M2 de la edificación */}
                <div className="bg-slate-100/90 dark:bg-slate-800/90 px-4 py-2.5 flex items-center justify-between font-black text-xs">
                    <span className="tracking-wider text-slate-700 dark:text-slate-300">
                        {totalGroups > 1 ? `TOTAL M2 (${group.table_name.toUpperCase()})` : 'TOTAL M2 EDIFICACIÓN'}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-[#00253d] dark:text-[#fbad03]">
                        {totalGroupM2.toLocaleString('es-BO')} m²
                    </span>
                </div>

                {/* Asignación de Servicios que computan esta tabla */}
                <div className="bg-slate-50/70 dark:bg-slate-950/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                        <Layers className="size-3 text-[#fbad03]" />
                        <span>Computan esta tabla ({totalGroupM2} m²):</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                        {activeServices.length > 0 ? (
                            activeServices.map((service) => {
                                const isAssigned = group.assigned_service_ids.includes(service.id);
                                return (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => onToggleServiceAssignment(group.id, service.id)}
                                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                            isAssigned
                                                ? 'bg-[#00253d] text-white shadow-2xs'
                                                : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                        title={isAssigned ? 'Quitar este servicio de esta tabla' : 'Vincular este servicio a esta tabla'}
                                    >
                                        <div
                                            className={`size-2.5 rounded-full flex items-center justify-center ${
                                                isAssigned ? 'bg-[#fbad03] text-slate-950' : 'bg-slate-200 dark:bg-slate-600'
                                            }`}
                                        >
                                            {isAssigned && <Check className="size-2 stroke-[3]" />}
                                        </div>
                                        <span>{service.name}</span>
                                    </button>
                                );
                            })
                        ) : (
                            <span className="text-slate-400 italic">No hay servicios seleccionados</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
