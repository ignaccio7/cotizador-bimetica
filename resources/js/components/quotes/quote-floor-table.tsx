import { Check, Layers, Trash2 } from 'lucide-react';
import { QuoteFloorTabs } from './quote-floor-tabs';
import type { ServiceItem } from './quote-services-selector';

export interface FloorItem {
    id: string;
    name: string;
    description: string;
    area: number | string;
    isActive: boolean;
}

export interface FloorGroupItem {
    id: string;
    table_name: string;
    assigned_service_ids: number[];
    floors: FloorItem[];
}

/**
 * Genera el nombre correlativo arquitectónico para un nuevo nivel
 */
export function createFloorName(
    type: 'planta' | 'subsuelo' | 'terraza',
    existingFloors: FloorItem[]
): string {
    if (type === 'planta') {
        const hasPlantaBaja = existingFloors.some((f) => f.name.includes('PLANTA BAJA'));
        if (!hasPlantaBaja && existingFloors.length === 0) {
            return 'PLANTA BAJA';
        }
        const plantCount = existingFloors.filter(
            (f) =>
                f.name.includes('PLANTA') &&
                !f.name.includes('BAJA') &&
                !f.name.includes('SUBSUELO') &&
                !f.name.includes('TERRAZA')
        ).length;
        const nextNum = plantCount + 1;
        return `${String(nextNum).padStart(2, '0')}° PLANTA`;
    }

    if (type === 'subsuelo') {
        const subCount = existingFloors.filter((f) => f.name.includes('SUBSUELO')).length;
        return `${String(subCount + 1).padStart(2, '0')}° SUBSUELO`;
    }

    const terrCount = existingFloors.filter((f) => f.name.includes('TERRAZA')).length;
    return `${String(terrCount + 1).padStart(2, '0')}° TERRAZA`;
}

/**
 * Descripción técnica por defecto según el tipo de nivel
 */
export function getFloorDefaultDescription(
    type: 'planta' | 'subsuelo' | 'terraza',
    name: string
): string {
    if (type === 'planta') {
        return name.includes('BAJA')
            ? 'Acceso peatonal, vehicular y ambientes sociales'
            : 'Ambientes proyectados';
    }
    if (type === 'subsuelo') {
        return 'Estacionamiento subterráneo / Bodega';
    }
    return 'Terraza / Azotea accesible';
}

/**
 * Inserta un nivel en su posición arquitectónica correspondiente:
 * - Terrazas: Arriba de todo (inicio)
 * - Subsuelos: Abajo de todo (final)
 * - Plantas: Al medio (debajo de terrazas y encima de plantas/Planta Baja)
 */
export function insertFloorInOrder(
    floors: FloorItem[],
    newFloor: FloorItem,
    type: 'planta' | 'subsuelo' | 'terraza'
): FloorItem[] {
    if (type === 'terraza') {
        return [newFloor, ...floors];
    }
    if (type === 'subsuelo') {
        return [...floors, newFloor];
    }

    // Para plantas, buscamos el primer elemento que no sea terraza
    const firstNonTerrazaIdx = floors.findIndex((f) => !f.name.includes('TERRAZA'));
    if (firstNonTerrazaIdx === -1) {
        return [...floors, newFloor];
    }

    return [
        ...floors.slice(0, firstNonTerrazaIdx),
        newFloor,
        ...floors.slice(firstNonTerrazaIdx),
    ];
}

interface QuoteFloorTableProps {
    groups: FloorGroupItem[];
    activeGroupId: string;
    activeServices?: ServiceItem[];
    onSelectGroup: (groupId: string) => void;
    onUpdateTableName: (groupId: string, name: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onToggleFloor: (floorId: string) => void;
    onUpdateFloor: (
        floorId: string,
        field: keyof FloorItem,
        value: string | number | boolean
    ) => void;
    onRemoveFloor: (floorId: string) => void;
    onToggleServiceAssignment: (serviceId: number) => void;
}

export function QuoteFloorTable({
    groups,
    activeGroupId,
    activeServices = [{ id: 1, name: 'PLANOS 2D' }],
    onSelectGroup,
    onUpdateTableName,
    onDeleteGroup,
    onToggleFloor,
    onUpdateFloor,
    onRemoveFloor,
    onToggleServiceAssignment,
}: QuoteFloorTableProps) {
    // Tabla activa seleccionada
    const group = groups.find((g) => g.id === activeGroupId) ?? groups[0];
    const groupIndex = groups.indexOf(group);
    const totalGroups = groups.length;

    // Suma de superficies computables de la tabla activa
    const totalGroupM2 = group.floors.reduce((sum, f) => {
        if (!f.isActive) return sum;
        const val = parseFloat(String(f.area)) || 0;
        return sum + val;
    }, 0);

    return (
        <div className="space-y-0 print-break-inside-avoid">
            {/* Barra de Pestañas (Tabs) aislada en su propio componente */}
            <QuoteFloorTabs
                groups={groups}
                activeGroupId={activeGroupId}
                onSelectGroup={onSelectGroup}
                onUpdateTableName={onUpdateTableName}
            />

            {/* Contenedor de la Tabla Activa */}
            <div className="rounded-b-lg rounded-tr-lg overflow-hidden border border-border shadow-2xs">
            {/* Cabecera Dorada Arquitectónica */}
            <div className="bg-secondary text-secondary-foreground font-black px-4 py-2 flex items-center gap-3 text-xs uppercase tracking-wider">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-black shrink-0">
                        {totalGroups > 1
                            ? `TABLA #${groupIndex + 1}:`
                            : 'PLANTAS:'}
                    </span>
                    <input
                        type="text"
                        value={group.table_name}
                        onChange={(e) => onUpdateTableName(group.id, e.target.value)}
                        placeholder="Nombre de tabla"
                        title="Editar nombre de la tabla activa"
                        className="bg-transparent border-b border-secondary-foreground/40 text-secondary-foreground font-black text-xs uppercase focus:border-secondary-foreground focus:outline-hidden p-0 max-w-[200px]"
                    />
                </div>
                <span className="font-bold w-16 sm:w-20 shrink-0 text-right">M2</span>
                {totalGroups > 1 ? (
                    <button
                        type="button"
                        onClick={() => onDeleteGroup(group.id)}
                        className="w-6 shrink-0 print:hidden text-secondary-foreground hover:text-destructive transition-colors p-0.5 cursor-pointer flex items-center justify-end"
                        title={`Eliminar ${group.table_name}`}
                    >
                        <Trash2 className="size-3.5" />
                    </button>
                ) : (
                    <span className="w-6 shrink-0" aria-hidden="true" />
                )}
            </div>

            {/* Filas de Plantas de la Tabla */}
            <div className="divide-y divide-border text-xs bg-card">
                {group.floors.length === 0 ? (
                    <div className="py-8 px-4 text-center text-muted-foreground">
                        <p className="font-bold text-foreground text-xs">
                            Esta tabla aún no tiene niveles ni plantas registradas.
                        </p>
                        <p className="text-[11px] mt-1 text-muted-foreground">
                            Usa los botones <span className="font-bold text-secondary-700 dark:text-secondary">+ Planta</span>, <span className="font-bold text-foreground">+ Subsuelo</span> o <span className="font-bold text-[#2684a8]">+ Terraza</span> en el panel derecho para agregar superficies.
                        </p>
                    </div>
                ) : (
                    group.floors.map((floor) => (
                        <div
                            key={floor.id}
                            className={`flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40 ${
                                !floor.isActive ? 'opacity-50' : ''
                            }`}
                        >
                            {/* 1. Checkbox */}
                            <input
                                type="checkbox"
                                checked={floor.isActive}
                                onChange={() => onToggleFloor(floor.id)}
                                className="size-4 shrink-0 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                                title={floor.isActive ? 'Desactivar nivel' : 'Activar nivel'}
                            />

                            {/* 2. Nombre del Nivel */}
                            <input
                                type="text"
                                value={floor.name}
                                onChange={(e) =>
                                    onUpdateFloor(floor.id, 'name', e.target.value)
                                }
                                placeholder="Nombre del nivel"
                                className="w-28 sm:w-36 shrink-0 font-black text-foreground text-sm uppercase bg-transparent border-none p-0 focus:outline-hidden"
                            />

                            {/* 3. Descripción */}
                            <input
                                type="text"
                                value={floor.description}
                                onChange={(e) =>
                                    onUpdateFloor(floor.id, 'description', e.target.value)
                                }
                                placeholder="Descripción del nivel (ej. Acceso peatonal, vehicular y ambientes sociales)"
                                className="flex-1 min-w-0 text-foreground text-sm bg-transparent border-none p-0 focus:outline-hidden"
                            />

                            {/* 4. Input M2 */}
                            <div className="w-16 sm:w-20 shrink-0 flex justify-end">
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={floor.area}
                                    onChange={(e) =>
                                        onUpdateFloor(floor.id, 'area', e.target.value)
                                    }
                                    placeholder="-"
                                    className="w-full text-right font-bold text-foreground text-xs bg-transparent border-b border-border/50 focus:border-primary focus:outline-hidden p-0"
                                />
                            </div>

                            {/* 5. Botón Eliminar fila */}
                            <button
                                type="button"
                                onClick={() => onRemoveFloor(floor.id)}
                                className="w-6 shrink-0 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer print:hidden"
                                title="Eliminar este nivel"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pie de Tabla: Total M2 de la tabla activa */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-t border-border font-black text-xs uppercase tracking-wider">
                <span className="text-foreground">
                    {totalGroups > 1
                        ? `TOTAL M2 (${group.table_name.toUpperCase()})`
                        : 'TOTAL M2 EDIFICACIÓN'}
                </span>
                <div className="flex items-center gap-3">
                    <span className="w-16 sm:w-20 text-right font-black text-foreground">
                        {totalGroupM2} m²
                    </span>
                    <span className="w-6 shrink-0" aria-hidden="true" />
                </div>
            </div>

            {/* Asignación de Servicios que computan esta tabla */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-muted/40 border-t border-border text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <Layers className="size-3 text-secondary shrink-0" />
                    <span>Computan esta tabla ({totalGroupM2} m²):</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    {activeServices && activeServices.length > 0 ? (
                        activeServices.map((service) => {
                            const isAssigned = group.assigned_service_ids.includes(service.id);
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => onToggleServiceAssignment(service.id)}
                                    className={`inline-flex items-center gap-1.5 h-6 rounded-md px-2 text-[10px] font-bold uppercase transition-all cursor-pointer select-none border ${
                                        isAssigned
                                            ? 'border-primary-950 bg-primary-950 text-white shadow-2xs'
                                            : 'border-border bg-card text-muted-foreground hover:border-border/80'
                                    }`}
                                    title={
                                        isAssigned
                                            ? 'Quitar este servicio de esta tabla'
                                            : 'Vincular este servicio a esta tabla'
                                    }
                                >
                                    <div
                                        className={`size-2.5 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                                            isAssigned
                                                ? 'bg-secondary text-primary-950'
                                                : 'bg-muted-foreground/30'
                                        }`}
                                    >
                                        {isAssigned && <Check className="size-2 stroke-[3]" />}
                                    </div>
                                    <span className="leading-none">{service.name}</span>
                                </button>
                            );
                        })
                    ) : (
                        <span className="text-[10px] text-muted-foreground italic">
                            Ningún servicio activo
                        </span>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
}
