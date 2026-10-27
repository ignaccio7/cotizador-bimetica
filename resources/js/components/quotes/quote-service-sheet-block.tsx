import { evaluateFormulaChain, type EvaluationResult } from '@/lib/formula-engine';
import {
    resolveFormulaDependencies,
    type FormulaDependencyItem,
} from '@/lib/formula-validator';
import type { FormulaItem, ServiceItem, VariableItem } from '@/lib/quote-services';

interface QuoteServiceSheetBlockProps {
    service: ServiceItem;
    designParameters?: Record<string, string>;
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
    designParameters = {},
    variablesValues = {},
    onChangeVariable,
    onRemoveService,
}: QuoteServiceSheetBlockProps) {
    // 1. Construir el scope con los valores de las variables para Math.js
    const values: Record<string, number> = {};

    service.formulas?.forEach((f) => {
        f.variables?.forEach((v) => {
            if (v.type === 'dynamic') {
                const userVal = variablesValues[v.name];
                values[v.name] =
                    userVal !== undefined && userVal !== ''
                        ? Number(userVal) || 0
                        : Number(v.default_value) || 0;
            } else {
                values[v.name] = Number(v.default_value) || 0;
            }
        });
    });

    if (designParameters) {
        Object.entries(designParameters).forEach(([k, val]) => {
            if (val !== undefined && val !== '') {
                values[k] = Number(val) || 0;
            }
        });
    }

    // 2. Mapear fórmulas del servicio para el resolutor de dependencias en cadena
    const allDependencyFormulas: FormulaDependencyItem[] = (service.formulas || []).map((f) => ({
        id: f.id ?? f.name,
        code: f.code ?? '',
        expression: f.expression,
        name: f.name,
        variables: f.variables,
    }));

    // 3. Generar columnas ordenadas directamente desde las fórmulas y sus variables dinámicas:
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

    // 4. Pre-calcular los resultados numéricos de las fórmulas resolviendo dependencias previas
    const formulaEvaluations: Record<number | string, EvaluationResult> = {};
    service.formulas?.forEach((f) => {
        const formulaKey = f.id ?? f.name;
        const dep = allDependencyFormulas.find((df) => df.id === formulaKey);
        if (dep) {
            const { orderedFormulas } = resolveFormulaDependencies(dep, allDependencyFormulas);
            formulaEvaluations[formulaKey] = evaluateFormulaChain(
                f.expression,
                orderedFormulas,
                values
            );
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
                {columns.length === 0 ? (
                    <div className="col-span-12 sm:col-span-6 bg-muted px-2 py-2.5 text-center flex items-center justify-center font-medium text-[11px] text-muted-foreground italic">
                        Sin fórmulas configuradas
                    </div>
                ) : (
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
                )}
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
                {columns.length === 0 ? (
                    <div className="col-span-12 sm:col-span-6 p-4 flex items-center justify-center text-xs text-muted-foreground italic">
                        Este servicio no cuenta con fórmulas configuradas en el sistema.
                    </div>
                ) : (
                    <div
                        className="col-span-12 sm:col-span-6 grid divide-x divide-border"
                        style={{
                            gridTemplateColumns: `repeat(${totalRightCols}, minmax(0, 1fr))`,
                        }}
                    >
                        {columns.map((col) => {
                            if (col.kind === 'variable') {
                                const v = col.variable;
                                const val = variablesValues[v.name] ?? v.default_value ?? '';

                                return (
                                    <div
                                        key={`cell-var-${v.name}`}
                                        className="min-w-0 p-3 flex flex-col items-center justify-center font-mono font-bold text-foreground text-center"
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
                                    </div>
                                );
                            }

                            const f = col.formula;
                            const evaluation = formulaEvaluations[f.id ?? f.name] ?? {
                                success: false,
                                result: 0,
                                formattedResult: '0',
                                intermediateResults: {},
                                error: 'Sin evaluar',
                            };

                            return (
                                <div
                                    key={`cell-form-${f.name}`}
                                    className="min-w-0 p-3 flex flex-col items-center justify-center font-mono font-bold text-foreground text-center"
                                    title={evaluation.error}
                                >
                                    <span
                                        className={`text-xs sm:text-sm truncate max-w-full ${!evaluation.success ? 'text-muted-foreground' : ''
                                            }`}
                                    >
                                        {evaluation.success
                                            ? `Bs. ${evaluation.result.toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`
                                            : 'Bs. —'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
