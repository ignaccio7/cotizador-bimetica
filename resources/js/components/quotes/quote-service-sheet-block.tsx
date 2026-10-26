import type { FormulaItem, ServiceItem, VariableItem } from '@/lib/quote-services';

interface QuoteServiceSheetBlockProps {
    service: ServiceItem;
    variablesValues?: Record<string, string>;
    onChangeVariable: (serviceId: number, varName: string, value: string) => void;
    onRemoveService: (serviceId: number) => void;
}

type BlockColumn =
    | {
          kind: 'variable';
          variable: VariableItem;
      }
    | {
          kind: 'formula';
          formula: FormulaItem;
      };

export function QuoteServiceSheetBlock({
    service,
    variablesValues = {},
    onChangeVariable,
    onRemoveService,
}: QuoteServiceSheetBlockProps) {
    // Generar columnas ordenadas directamente desde las fórmulas y sus variables dinámicas:
    // [variables dinámicas de la fórmula] -> [fórmula visible] -> [siguiente fórmula...]
    const columns: BlockColumn[] = [];
    const seenVarNames = new Set<string>();

    service.formulas?.forEach((formula) => {
        // 1. Variables dinámicas asociadas a esta fórmula
        formula.variables
            ?.filter((v) => v.type === 'dynamic')
            .forEach((v) => {
                if (!seenVarNames.has(v.name)) {
                    seenVarNames.add(v.name);
                    columns.push({ kind: 'variable', variable: v });
                }
            });

        // 2. Si la fórmula está configurada como visible, agregar su columna de resultado
        if (formula.is_visible !== false) {
            columns.push({ kind: 'formula', formula });
        }
    });

    const totalRightCols = Math.max(1, columns.length);

    return (
        <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden print-break-inside-avoid">
            {/* CABECERA BICOLOR */}
            <div className="grid grid-cols-12 overflow-hidden border-b border-border shadow-2xs">
                {/* Bloque Izquierdo Dorado */}
                <div className="col-span-12 sm:col-span-6 bg-secondary text-secondary-foreground px-4 py-2.5 flex items-center justify-between">
                    <span className="font-black text-xs tracking-wider uppercase truncate">
                        {service.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemoveService(service.id)}
                        className="text-[10px] font-bold tracking-wider uppercase text-secondary-foreground/80 hover:text-secondary-foreground hover:underline transition-colors shrink-0 ml-2 cursor-pointer"
                        title="Quitar servicio de la cotización"
                    >
                        Quitar
                    </button>
                </div>

                {/* Bloque Derecho Bicolor (Variables en gris + Fórmulas en Navy según secuencia relacional) */}
                <div
                    className="col-span-12 sm:col-span-6 grid divide-x divide-border"
                    style={{
                        gridTemplateColumns: `repeat(${totalRightCols}, minmax(0, 1fr))`,
                    }}
                >
                    {columns.map((col) => {
                        if (col.kind === 'variable') {
                            return (
                                <div
                                    key={`hdr-var-${col.variable.name}`}
                                    className="min-w-0 bg-muted text-foreground px-2 py-2.5 text-center flex items-center justify-center font-black text-[11px] uppercase tracking-wide"
                                    title={col.variable.name.toUpperCase()}
                                >
                                    {col.variable.name}
                                </div>
                            );
                        }

                        return (
                            <div
                                key={`hdr-form-${col.formula.name}`}
                                className="min-w-0 px-2 py-2.5 text-center flex items-center justify-center font-black text-[10.5px] leading-tight uppercase bg-primary-950 text-white"
                                title={col.formula.name}
                            >
                                <span className="line-clamp-2">{col.formula.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CUERPO DEL SERVICIO: DESCRIPCIÓN + INPUTS Y FÓRMULAS */}
            <div className="grid grid-cols-12 bg-card divide-y sm:divide-y-0 sm:divide-x divide-border text-xs min-h-[72px]">
                {/* Columna Izquierda: Descripción Técnica */}
                <div className="col-span-12 sm:col-span-6 p-4 text-muted-foreground leading-relaxed text-[11px] flex flex-col justify-center">
                    {service.description ? (
                        <p className="font-medium text-foreground">
                            {service.description}
                        </p>
                    ) : (
                        <p className="text-muted-foreground italic">Sin descripción configurada.</p>
                    )}
                </div>

                {/* Columna Derecha: Columnas en secuencia relacional */}
                <div
                    className="col-span-12 sm:col-span-6 grid divide-x divide-border"
                    style={{
                        gridTemplateColumns: `repeat(${totalRightCols}, minmax(0, 1fr))`,
                    }}
                >
                    {columns.map((col, idx) => {
                        if (col.kind === 'variable') {
                            const v = col.variable;
                            const val = variablesValues[v.name] ?? v.default_value ?? '';

                            return (
                                <div
                                    key={`cell-var-${v.name}`}
                                    className="min-w-0 p-3 flex flex-col items-center justify-center gap-1 font-mono font-bold text-foreground text-center"
                                >
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={val}
                                        onChange={(e) =>
                                            onChangeVariable(service.id, v.name, e.target.value)
                                        }
                                        placeholder={v.default_value || '0'}
                                        className="w-full max-w-[5.5rem] text-center font-mono font-bold text-sm bg-transparent border-b-2 border-dashed border-border hover:border-primary/50 focus:border-primary focus:outline-hidden p-0.5 text-foreground transition-colors"
                                    />
                                    <span className="text-[9px] text-muted-foreground font-sans truncate max-w-full">
                                        {v.name.toLowerCase()} editable
                                    </span>
                                </div>
                            );
                        }

                        const f = col.formula;

                        return (
                            <div
                                key={`cell-form-${f.name}`}
                                className="min-w-0 p-3 flex flex-col items-center justify-center font-mono font-bold text-foreground text-center"
                            >
                                <span className="text-xs sm:text-sm truncate max-w-full">
                                    Bs. —
                                </span>
                                <span className="text-[9px] text-muted-foreground font-sans font-normal mt-0.5 truncate max-w-full">
                                    auto
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
