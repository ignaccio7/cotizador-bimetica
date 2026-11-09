import { SlidersHorizontal } from 'lucide-react';
import type { DesignParameters, ParameterItem } from '@/lib/quote-services';

export type { DesignParameters, ParameterItem };

interface QuoteDesignParametersProps {
    values?: DesignParameters;
    availableParameters?: ParameterItem[];
    onChange: (key: string, value: string) => void;
}

interface ParameterGroup {
    group: string;
    group_label: string;
    items: ParameterItem[];
}

export function QuoteDesignParameters({
    values = {},
    availableParameters = [],
    onChange,
}: QuoteDesignParametersProps) {
    // 1. Agrupar los parámetros dinámicamente por su columna 'group' de la base de datos
    const groupsMap = new Map<string, ParameterGroup>();

    availableParameters.forEach((param) => {
        if (!groupsMap.has(param.group)) {
            groupsMap.set(param.group, {
                group: param.group,
                group_label: param.group_label ?? param.group,
                items: [],
            });
        }
        groupsMap.get(param.group)!.items.push(param);
    });

    // 2. Extraer los grupos como lista para renderizar en la vista
    const dynamicGroups = Array.from(groupsMap.values());

    if (dynamicGroups.length === 0) {
        return null;
    }

    return (
        <section aria-label="Parámetros de Diseño" className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <SlidersHorizontal className="size-3.5 text-secondary" />
                <span>PARÁMETROS DE DISEÑO:</span>
            </div>

            {/* Tabla compacta y adaptable al ancho del contenedor */}
            <div className="w-full border border-border rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-xs border-collapse">
                    <tbody>
                        {/* Filas dinámicas generadas estrictamente a partir de los grupos existentes en la BD */}
                        {dynamicGroups.map((group, index) => {
                            const isLast = index === dynamicGroups.length - 1;
                            const currentId = values[`${group.group}_id`] ?? '';

                            return (
                                <tr key={group.group} className={!isLast ? 'border-b border-border' : ''}>
                                    <td className="bg-muted/70 text-muted-foreground font-bold px-3 py-2 text-center uppercase tracking-wider w-1/3 border-r border-border text-[11px]">
                                        {group.group_label.toUpperCase()}
                                    </td>
                                    <td className="bg-card px-3 py-1.5 w-2/3">
                                        <div className="flex items-center justify-center">
                                            <select
                                                value={String(currentId)}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    const selected = group.items.find(
                                                        (item) => String(item.id) === selectedId
                                                    );
                                                    if (selected) {
                                                        onChange(`${group.group}_id`, String(selected.id));
                                                        onChange(group.group, String(selected.value));
                                                        onChange(`${group.group}_label`, selected.name);
                                                    } else {
                                                        onChange(`${group.group}_id`, '');
                                                        onChange(group.group, '');
                                                        onChange(`${group.group}_label`, '');
                                                    }
                                                }}
                                                className="w-full text-center font-bold text-foreground text-xs bg-transparent border-none p-0 focus:outline-hidden cursor-pointer"
                                            >
                                                <option value="" className="bg-card text-muted-foreground">
                                                    Seleccionar...
                                                </option>
                                                {group.items.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={String(item.id)}
                                                        className="bg-card text-foreground"
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
