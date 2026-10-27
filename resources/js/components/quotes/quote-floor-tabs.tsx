import { useState } from 'react';
import type { FloorGroupItem } from './quote-floor-table';

interface QuoteFloorTabsProps {
    groups: FloorGroupItem[];
    activeGroupId: string;
    onSelectGroup: (groupId: string) => void;
    onUpdateTableName: (groupId: string, name: string) => void;
}

/**
 * Componente aislado para la barra de pestañas (Tabs) de las tablas de plantas.
 * Gestiona el cálculo parcial de m², selección de tabla activa y edición con doble clic.
 */
export function QuoteFloorTabs({
    groups,
    activeGroupId,
    onSelectGroup,
    onUpdateTableName,
}: QuoteFloorTabsProps) {
    // Estado local para permitir renombrar la pestaña con doble clic
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

    return (
        <div className="flex items-end flex-wrap gap-0 border-b border-border print:hidden">
            {groups.map((group) => {
                const isActive = group.id === activeGroupId;
                const tabArea = group.floors
                    .filter((f) => f.isActive)
                    .reduce(
                        (s, f) => s + (parseFloat(String(f.area)) || 0),
                        0
                    );

                return (
                    <button
                        key={group.id}
                        type="button"
                        onClick={() => onSelectGroup(group.id)}
                        className={`relative flex flex-col items-start px-3.5 py-2 text-xs font-semibold transition-colors shrink-0 border-t border-l border-r cursor-pointer select-none rounded-t-lg max-w-[140px] sm:max-w-[180px] ${
                            isActive
                                ? 'bg-card border-border text-primary-950 dark:text-secondary -mb-px z-10'
                                : 'bg-muted/40 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }`}
                    >
                        {editingGroupId === group.id ? (
                            <input
                                type="text"
                                autoFocus
                                value={group.table_name}
                                onChange={(e) =>
                                    onUpdateTableName(group.id, e.target.value)
                                }
                                onBlur={() => setEditingGroupId(null)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === 'Escape') {
                                        setEditingGroupId(null);
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-24 sm:w-32 font-bold text-[11px] leading-tight uppercase bg-transparent border-b border-primary-950 dark:border-secondary focus:outline-hidden p-0 text-foreground"
                            />
                        ) : (
                            <span
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setEditingGroupId(group.id);
                                }}
                                title={`${group.table_name} (Doble clic para cambiar nombre)`}
                                className="font-bold text-[11px] leading-tight uppercase cursor-pointer max-w-[110px] sm:max-w-[140px] truncate block"
                            >
                                {group.table_name}
                            </span>
                        )}
                        <span
                            className={`text-[10px] font-mono leading-none mt-0.5 ${
                                isActive
                                    ? 'text-secondary font-bold'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {tabArea} m²
                        </span>
                        {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-t" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
