import {
    Building2,
    HelpCircle,
    Info,
    Plus,
    TableProperties,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FloorGroupItem, FloorItem } from '@/types/quotes';
import type { ServiceItem } from '@/types/services';
import { QuoteFloorGroupCard } from './quote-floor-group-card';

interface QuoteFloorGroupManagerProps {
    floorGroups: FloorGroupItem[];
    onAddFloorGroup: () => void;
    onDeleteFloorGroup: (groupId: string) => void;
    onUpdateTableName: (groupId: string, name: string) => void;
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

export function QuoteFloorGroupManager({
    floorGroups,
    onAddFloorGroup,
    onDeleteFloorGroup,
    onUpdateTableName,
    onAddFloor,
    onRemoveFloor,
    onUpdateFloor,
    activeServices,
    onToggleServiceAssignment,
}: QuoteFloorGroupManagerProps) {
    return (
        <div className="space-y-4">
            {/* Header del Gestor de Tablas de Pisos */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-[#003e65] text-white">
                        <Building2 className="size-4 text-[#fbad03]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#003e65] dark:text-[#fbad03]">
                                Tablas de Superficies y Plantas Arquitectónicas
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {floorGroups.length} {floorGroups.length === 1 ? 'tabla' : 'tablas'}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Gestiona las superficies de la edificación. Puedes asignar 1 tabla a varios servicios, o 1 tabla exclusiva por servicio.
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={onAddFloorGroup}
                    className="h-8 gap-1.5 bg-[#003e65] hover:bg-[#002f4d] text-white font-bold text-xs shadow-xs"
                >
                    <Plus className="size-3.5 text-[#fbad03]" />
                    <span>Nueva Tabla de Superficie</span>
                </Button>
            </div>

            {/* Aviso explicativo de las reglas de contexto */}
            <div className="flex items-start gap-2.5 rounded-lg border border-blue-200/80 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                <Info className="size-4 shrink-0 text-[#2684a8] mt-0.5" />
                <div className="space-y-1">
                    <p className="font-semibold text-[11px]">
                        Regla de Asignación de Pisos (Cotizador Bimetica):
                    </p>
                    <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                        • <strong>1 Tabla Compartida</strong>: Si seleccionas <em>Diseño Arquitectónico</em> y <em>Cálculo Estructural</em>, ambos pueden vincularse a la misma tabla (ej. 300 m²).<br />
                        • <strong>Tablas Independientes</strong>: Puedes crear una segunda tabla (ej. <em>"Ampliación"</em> con 80 m²) y asignarla exclusivamente a otro servicio.<br />
                        • <strong>Servicios sin tabla</strong>: Servicios como <em>Estudio de Suelos</em> (que se cotiza por pozos) no requieren tabla de pisos.
                    </p>
                </div>
            </div>

            {/* Listado de Tarjetas de Tablas de Pisos */}
            <div className="space-y-4">
                {floorGroups.map((group, index) => (
                    <QuoteFloorGroupCard
                        key={group.id}
                        group={group}
                        groupIndex={index}
                        canDelete={floorGroups.length > 1}
                        onUpdateTableName={onUpdateTableName}
                        onDeleteGroup={onDeleteFloorGroup}
                        onAddFloor={onAddFloor}
                        onRemoveFloor={onRemoveFloor}
                        onUpdateFloor={onUpdateFloor}
                        activeServices={activeServices}
                        onToggleServiceAssignment={onToggleServiceAssignment}
                    />
                ))}
            </div>
        </div>
    );
}
