import {
    Check,
    CheckCircle2,
    Layers,
    Plus,
    Square,
    Table,
    Trash2,
} from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FloorGroupItem, FloorItem } from '@/types/quotes';
import type { ServiceItem } from '@/types/services';

interface QuoteFloorGroupCardProps {
    group: FloorGroupItem;
    groupIndex: number;
    canDelete: boolean;
    onUpdateTableName: (groupId: string, name: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onAddFloor: (groupId: string) => void;
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

export function QuoteFloorGroupCard({
    group,
    groupIndex,
    canDelete,
    onUpdateTableName,
    onDeleteGroup,
    onAddFloor,
    onRemoveFloor,
    onUpdateFloor,
    activeServices,
    onToggleServiceAssignment,
}: QuoteFloorGroupCardProps) {
    // Cálculo en tiempo real de los m2 totales activos de este grupo
    const totalGroupArea = useMemo(() => {
        return group.floors.reduce(
            (sum, floor) => (floor.isActive ? sum + (Number(floor.area) || 0) : sum),
            0
        );
    }, [group.floors]);

    return (
        <Card className="border-slate-200/90 shadow-xs dark:border-slate-800 overflow-hidden">
            {/* Header de la Tabla de Pisos */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#003e65] text-white">
                        <Table className="size-4 text-[#fbad03]" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                TABLA #{groupIndex + 1}
                            </span>
                            <Input
                                type="text"
                                value={group.table_name}
                                onChange={(e) => onUpdateTableName(group.id, e.target.value)}
                                className="h-7 max-w-xs font-bold text-xs text-[#003e65] dark:text-[#fbad03] bg-white dark:bg-slate-800 border-slate-200"
                                placeholder="Nombre de la tabla (ej. Edificación Principal)"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* Badge de Total m2 de esta tabla */}
                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300">
                        <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                            Total m²:
                        </span>
                        <span className="font-mono text-xs font-extrabold">
                            {totalGroupArea.toLocaleString('es-BO', { minimumFractionDigits: 2 })} m²
                        </span>
                    </div>

                    {canDelete && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteGroup(group.id)}
                            className="size-7 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                            title="Eliminar esta tabla de pisos"
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            <CardContent className="p-3.5 sm:p-4 space-y-3.5">
                {/* Filas de Pisos / Plantas */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/70 text-[11px] font-semibold text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                            <tr>
                                <th className="w-10 px-3 py-2 text-center">Uso</th>
                                <th className="w-36 px-3 py-2">Nivel / Planta</th>
                                <th className="px-3 py-2">Descripción de Ambientes</th>
                                <th className="w-32 px-3 py-2 text-right">Superficie (m²)</th>
                                <th className="w-10 px-2 py-2 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {group.floors.map((floor) => (
                                <tr
                                    key={floor.id}
                                    className={`transition-colors ${
                                        floor.isActive
                                            ? 'bg-white hover:bg-slate-50/70 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                                            : 'bg-slate-50/50 text-slate-400 dark:bg-slate-950/50 dark:text-slate-600'
                                    }`}
                                >
                                    <td className="px-3 py-1.5 text-center">
                                        <input
                                            type="checkbox"
                                            checked={floor.isActive}
                                            onChange={(e) =>
                                                onUpdateFloor(group.id, floor.id, 'isActive', e.target.checked)
                                            }
                                            className="size-3.5 rounded border-slate-300 text-[#003e65] focus:ring-[#003e65]"
                                        />
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <Input
                                            type="text"
                                            value={floor.name}
                                            disabled={!floor.isActive}
                                            onChange={(e) =>
                                                onUpdateFloor(group.id, floor.id, 'name', e.target.value)
                                            }
                                            className="h-7 text-xs font-semibold"
                                        />
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <Input
                                            type="text"
                                            value={floor.description}
                                            disabled={!floor.isActive}
                                            onChange={(e) =>
                                                onUpdateFloor(group.id, floor.id, 'description', e.target.value)
                                            }
                                            placeholder="Ambientes proyectados..."
                                            className="h-7 text-xs text-slate-600 dark:text-slate-400"
                                        />
                                    </td>
                                    <td className="px-3 py-1.5 text-right">
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={floor.area}
                                            disabled={!floor.isActive}
                                            onChange={(e) =>
                                                onUpdateFloor(
                                                    group.id,
                                                    floor.id,
                                                    'area',
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            className="h-7 text-right font-mono text-xs font-bold"
                                        />
                                    </td>
                                    <td className="px-2 py-1.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => onRemoveFloor(group.id, floor.id)}
                                            className="text-slate-400 hover:text-red-600 transition-colors"
                                            title="Quitar este piso"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Botón para agregar nueva planta */}
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onAddFloor(group.id)}
                        className="h-7 gap-1.5 text-[11px] font-semibold text-slate-700 hover:text-[#003e65] dark:text-slate-300"
                    >
                        <Plus className="size-3" />
                        <span>Agregar Nivel / Planta</span>
                    </Button>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {group.floors.filter((f) => f.isActive).length} niveles activos sumando al total
                    </span>
                </div>

                {/* SECCIÓN CRUCIAL: ASIGNACIÓN DE SERVICIOS A ESTA TABLA */}
                <div className="rounded-lg border border-dashed border-slate-200 bg-blue-50/30 p-2.5 dark:border-slate-800 dark:bg-[#003e65]/10">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <Layers className="size-3.5 text-[#003e65] dark:text-[#fbad03]" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#003e65] dark:text-[#fbad03]">
                                Servicios que computan esta superficie ({totalGroupArea} m²):
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                            {group.assigned_service_ids.length === 0
                                ? 'Sin servicios asociados'
                                : `${group.assigned_service_ids.length} servicio(s) vinculado(s)`}
                        </span>
                    </div>

                    {activeServices.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                            {activeServices.map((service) => {
                                const isAssigned = group.assigned_service_ids.includes(service.id);
                                return (
                                    <button
                                        key={service.id}
                                        type="button"
                                        onClick={() => onToggleServiceAssignment(group.id, service.id)}
                                        className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition-all ${
                                            isAssigned
                                                ? 'bg-[#003e65] text-white shadow-2xs dark:bg-[#2684a8]'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    >
                                        <div
                                            className={`size-3 rounded-full flex items-center justify-center ${
                                                isAssigned ? 'bg-[#fbad03] text-slate-900' : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        >
                                            {isAssigned && <Check className="size-2 stroke-[3]" />}
                                        </div>
                                        <span>{service.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-[11px] text-slate-400 italic">
                            Selecciona primero servicios en el catálogo arriba para asignarlos a esta tabla.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
