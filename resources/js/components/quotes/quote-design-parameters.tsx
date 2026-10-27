import type { DesignParameters, ParameterItem } from '@/lib/quote-services';

export type { DesignParameters, ParameterItem };

interface QuoteDesignParametersProps {
    values?: DesignParameters;
    parameters?: DesignParameters;
    availableParameters?: ParameterItem[];
    onChange: (key: string, value: string) => void;
}

interface ParameterGroup {
    key: string;
    label: string;
    items: ParameterItem[];
}

export function QuoteDesignParameters({
    values,
    parameters,
    availableParameters = [],
    onChange,
}: QuoteDesignParametersProps) {
    const currentValues = values ?? parameters ?? {};

    // 1. Agrupar los parámetros dinámicamente por su grupo de base de datos usando un Map
    const groupsMap = new Map<string, ParameterGroup>();

    availableParameters.forEach((param) => {
        if (!groupsMap.has(param.group)) {
            groupsMap.set(param.group, {
                key: param.group,
                label: param.group_label || param.group.replace(/_/g, ' ').toUpperCase(),
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
        <section aria-label="Parámetros de Diseño" className="space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                PARAMETROS DE DISEÑO
            </h3>

            {/* Tabla compacta y centrada idéntica a Google Sheets */}
            <div className="w-full max-w-2xl border border-border rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-xs border-collapse">
                    <tbody>
                        {/* Filas dinámicas generadas estrictamente a partir de los grupos existentes en la BD */}
                        {dynamicGroups.map((group, index) => {
                            const isLast = index === dynamicGroups.length - 1;
                            const currentValue = currentValues[group.key] ?? '';

                            return (
                                <tr key={group.key} className={!isLast ? 'border-b border-border' : ''}>
                                    <td className="bg-muted/70 text-muted-foreground font-bold px-3 py-2 text-center uppercase tracking-wider w-1/3 border-r border-border text-[11px]">
                                        {group.label.toUpperCase()}
                                    </td>
                                    <td className="bg-card px-3 py-1.5 w-2/3">
                                        <div className="flex items-center justify-center">
                                            <select
                                                value={currentValue}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    onChange(group.key, val);
                                                    const selected = group.items.find(
                                                        (item) => String(item.value) === val
                                                    );
                                                    onChange(
                                                        `${group.key}_label`,
                                                        selected ? selected.name : ''
                                                    );
                                                }}
                                                className="w-full text-center font-bold text-foreground text-xs bg-transparent border-none p-0 focus:outline-hidden cursor-pointer"
                                            >
                                                <option value="" className="bg-card text-muted-foreground">
                                                    Seleccionar {group.label.toLowerCase()}...
                                                </option>
                                                {group.items.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={String(item.value)}
                                                        className="bg-card text-foreground"
                                                    >
                                                        {item.name}{' '}
                                                        {item.type === 'percentage'
                                                            ? `(${item.value}%)`
                                                            : Number(item.value) === 0
                                                              ? '(0 Bs.)'
                                                              : `(${item.value} Bs.)`}
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
