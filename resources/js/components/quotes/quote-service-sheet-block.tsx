import { Lock } from 'lucide-react';
import { useMemo } from 'react';
import { evaluateFormula, slugifyFormulaName } from '@/lib/formula-evaluator';
import type { FloorGroupItem } from '@/types/quotes';
import type { FormulaItem, ServiceItem, VariableItem } from '@/types/services';

interface QuoteServiceSheetBlockProps {
    service: ServiceItem;
    availableVariables: VariableItem[];
    floorGroups: FloorGroupItem[];
    assignedFloorGroupId: string | null;
    onAssignFloorGroup: (serviceId: number, floorGroupId: string | null) => void;
    filledVariables: Record<string, any>;
    onChangeVariable: (serviceId: number, varName: string, value: any) => void;
    onRemoveService: (serviceId: number) => void;
}

export function QuoteServiceSheetBlock({
    service,
    availableVariables,
    floorGroups,
    assignedFloorGroupId,
    onAssignFloorGroup,
    filledVariables,
    onChangeVariable,
    onRemoveService,
}: QuoteServiceSheetBlockProps) {
    // 1. Detectar variables dinámicas vinculadas a este servicio (las que el usuario introduce)
    const dynamicVariables = useMemo(() => {
        const referencedNames = new Set<string>();

        for (const f of service.formulas) {
            if (f.variable_names) {
                f.variable_names.forEach((name) => referencedNames.add(name));
            }
            if (f.variable_ids) {
                f.variable_ids.forEach((id) => {
                    const found = availableVariables.find((v) => v.id === id);
                    if (found) referencedNames.add(found.name);
                });
            }
        }

        // Filtrar de availableVariables las dinámicas que estén referenciadas
        const matched = availableVariables.filter(
            (v) => v.type === 'dynamic' && referencedNames.has(v.name)
        );

        if (matched.length > 0) {
            return matched;
        }

        // Respaldo inteligente si la relación en BD no tiene pivote explícito
        const hasPozos =
            service.formulas.some((f) => f.expression.includes('pozos')) ||
            service.name.toLowerCase().includes('suelo');
        const fallbackName = hasPozos ? 'pozos' : 'm2';
        const fallbackVar = availableVariables.find((v) => v.name === fallbackName);

        if (fallbackVar) {
            return [fallbackVar];
        }

        return [
            {
                id: fallbackName === 'm2' ? 1 : 2,
                name: fallbackName,
                type: 'dynamic' as const,
                value_type: (fallbackName === 'm2' ? 'decimal' : 'integer') as 'decimal' | 'integer',
                default_value: fallbackName === 'm2' ? '300' : '3',
                options: null,
                description: null,
            },
        ];
    }, [service.formulas, availableVariables, service.name]);

    // 2. Fórmulas marcadas como visibles (is_visible === true) que se muestran como columnas
    const visibleFormulas = useMemo(() => {
        const visible = service.formulas.filter((f) => f.is_visible);
        if (visible.length > 0) return visible;

        // Si existen fórmulas pero ninguna marcada explícitamente, mostrar todas
        if (service.formulas.length > 0) return service.formulas;

        // Respaldo por defecto
        return [
            {
                name: 'INVERSIÓN BS.',
                expression: 'ceil(m2 * 25)',
                is_visible: true,
                variable_ids: [],
                variable_names: ['m2'],
            },
        ];
    }, [service.formulas]);

    // 3. Tabla de pisos asignada (si existe) y área total computable
    const assignedGroup = useMemo(() => {
        if (!assignedFloorGroupId) return null;
        return floorGroups.find((g) => g.id === assignedFloorGroupId) ?? null;
    }, [floorGroups, assignedFloorGroupId]);

    const assignedArea = useMemo(() => {
        if (!assignedGroup) return null;
        return assignedGroup.floors.reduce(
            (sum, f) => (f.isActive ? sum + (Number(f.area) || 0) : sum),
            0
        );
    }, [assignedGroup]);

    // 4. Ámbito de evaluación: variables estáticas + dinámicas + área vinculada
    const currentScope = useMemo(() => {
        const scope: Record<string, any> = {};

        // Variables estáticas del sistema (ej. cambiodolar)
        for (const v of availableVariables) {
            if (v.type === 'static') {
                scope[v.name] = Number(v.default_value) || 0;
            }
        }

        // Variables dinámicas con valor del usuario o default
        for (const v of dynamicVariables) {
            const rawVal = filledVariables[v.name];
            if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                scope[v.name] = Number(rawVal);
            } else {
                scope[v.name] = Number(v.default_value) || (v.name === 'pozos' ? 3 : 300);
            }
        }

        // Si la variable m2 está vinculada a una tabla de pisos activa, manda el área de la tabla
        if (assignedArea !== null) {
            scope.m2 = assignedArea;
        }

        return {
            ...scope,
            ...filledVariables,
            ...(assignedArea !== null ? { m2: assignedArea } : {}),
        };
    }, [availableVariables, dynamicVariables, filledVariables, assignedArea]);

    // 5. Evaluación en cascada de TODAS las fórmulas del servicio
    const evaluatedResults = useMemo(() => {
        const cascadeScope: Record<string, any> = { ...currentScope };
        const results: Record<string, number> = {};

        for (const f of service.formulas) {
            const val = evaluateFormula(f.expression, cascadeScope);
            const slug = slugifyFormulaName(f.name);
            const numVal = val !== null ? Number(val) : 0;
            cascadeScope[slug] = numVal;
            results[f.name] = numVal;
        }

        return { cascadeScope, results };
    }, [service.formulas, currentScope]);

    // 6. Configuración de grid idéntica para cabecera y cuerpo (garantiza alineación vertical matemática)
    const totalRightCols = Math.max(1, dynamicVariables.length + visibleFormulas.length);
    const rightColsGridStyle = useMemo(
        () => ({
            gridTemplateColumns: `repeat(${totalRightCols}, minmax(0, 1fr))`,
        }),
        [totalRightCols]
    );

    return (
        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs">
            {/* ── BARRA DE CABECERA: SERVICIO (COL IZQ) + VARIABLES & FÓRMULAS VISIBLES (COL DER) ── */}
            <div className="grid grid-cols-12 text-xs font-black uppercase tracking-wider">
                {/* Columna Izquierda: Nombre del Servicio */}
                <div className="col-span-12 sm:col-span-6 bg-[#fbad03] text-slate-950 px-4 py-2.5 flex items-center justify-between gap-2">
                    <span className="font-black tracking-wide text-xs sm:text-sm truncate">
                        {service.name}
                    </span>
                    <button
                        type="button"
                        onClick={() => onRemoveService(service.id)}
                        className="print:hidden text-[10px] text-slate-900 hover:text-red-700 font-bold uppercase underline transition-colors shrink-0 cursor-pointer"
                        title="Quitar este servicio"
                    >
                        Quitar
                    </button>
                </div>

                {/* Columna Derecha: Columnas de Variables Dinámicas + Fórmulas Visibles */}
                <div
                    className="col-span-12 sm:col-span-6 grid divide-x divide-slate-300 dark:divide-slate-800"
                    style={rightColsGridStyle}
                >
                    {/* Headers de Variables Dinámicas (ej. M2, M3, POZOS) */}
                    {dynamicVariables.map((v) => (
                        <div
                            key={v.name}
                            className="min-w-0 bg-slate-200 text-slate-900 px-2 py-2.5 text-center flex items-center justify-center font-black text-[11px] truncate uppercase"
                            title={v.name.toUpperCase()}
                        >
                            {v.name}
                        </div>
                    ))}

                    {/* Headers de Fórmulas Visibles (ej. BS /UNID, BS /M2, INVERSIÓN BS.) */}
                    {visibleFormulas.map((f, idx) => {
                        const isInvestment =
                            f.name.toLowerCase().includes('inversión') ||
                            f.name.toLowerCase().includes('inversion') ||
                            idx === visibleFormulas.length - 1;

                        return (
                            <div
                                key={f.name}
                                className={`min-w-0 px-1.5 py-2.5 text-center flex items-center justify-center font-black text-[10.5px] leading-tight break-words uppercase ${
                                    isInvestment
                                        ? 'bg-[#00253d] text-white'
                                        : 'bg-[#00253d] text-white'
                                }`}
                                title={f.name.toUpperCase()}
                            >
                                <span className="line-clamp-2">{f.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── CUERPO: DESCRIPCIÓN (COL IZQ) + INPUTS Y RESULTADOS (COL DER) ── */}
            <div className="grid grid-cols-12 bg-white dark:bg-slate-900 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 text-xs min-h-[75px]">
                {/* Columna Izquierda: Solo Descripción limpia */}
                <div className="col-span-12 sm:col-span-6 p-4 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] flex flex-col justify-center">
                    {service.description ? (
                        <p className="font-medium text-slate-700 dark:text-slate-200">
                            {service.description}
                        </p>
                    ) : (
                        <p className="text-slate-400 italic">Sin descripción configurada.</p>
                    )}
                </div>

                {/* Columna Derecha: Valores e Inputs alineados pixel-perfect con la cabecera */}
                <div
                    className="col-span-12 sm:col-span-6 grid divide-x divide-slate-200 dark:divide-slate-800"
                    style={rightColsGridStyle}
                >
                    {/* Celdas de Variables Dinámicas (Inputs o Auto si vinculadas a tabla) */}
                    {dynamicVariables.map((v) => {
                        const isM2Linked = v.name === 'm2' && assignedGroup !== null;
                        const currentVal =
                            v.name === 'm2' && assignedArea !== null
                                ? assignedArea
                                : (filledVariables[v.name] ??
                                  (v.name === 'pozos' ? 3 : Number(v.default_value) || 300));

                        return (
                            <div
                                key={v.name}
                                className="min-w-0 p-2 sm:p-3 flex flex-col items-center justify-center gap-1 font-mono font-bold text-slate-900 dark:text-slate-100 text-center"
                            >
                                {isM2Linked ? (
                                    <>
                                        <span className="text-sm font-black flex items-center justify-center gap-1 text-[#003e65] dark:text-[#fbad03] truncate max-w-full">
                                            {assignedArea}
                                            <Lock className="size-3 text-emerald-600 shrink-0" />
                                        </span>
                                        <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-sans font-semibold truncate max-w-full">
                                            m² tabla
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="number"
                                            min="0"
                                            value={currentVal === 0 ? '' : currentVal}
                                            onChange={(e) =>
                                                onChangeVariable(
                                                    service.id,
                                                    v.name,
                                                    Number(e.target.value) || 0
                                                )
                                            }
                                            placeholder="0"
                                            className="w-full max-w-[4.5rem] text-center font-mono font-bold text-sm bg-transparent border-b-2 border-dashed border-slate-300 hover:border-slate-400 focus:border-[#003e65] dark:focus:border-[#fbad03] focus:outline-hidden p-0"
                                        />
                                        <span className="text-[9px] text-slate-400 font-sans truncate max-w-full">
                                            {v.name === 'm2' ? 'm² editable' : v.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    {/* Celdas de Fórmulas Visibles Evaluadas */}
                    {visibleFormulas.map((f, idx) => {
                        const val = evaluatedResults.results[f.name] ?? 0;
                        const isInvestment =
                            f.name.toLowerCase().includes('inversión') ||
                            f.name.toLowerCase().includes('inversion') ||
                            idx === visibleFormulas.length - 1;

                        if (isInvestment) {
                            return (
                                <div
                                    key={f.name}
                                    className="min-w-0 p-2 sm:p-3 flex flex-col items-center justify-center font-mono font-black text-slate-950 dark:text-[#fbad03] text-center"
                                >
                                    <span className="text-xs sm:text-sm font-black truncate max-w-full">
                                        Bs. {Math.ceil(val).toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-sans font-normal mt-0.5 truncate max-w-full">
                                        auto
                                    </span>
                                </div>
                            );
                        }

                        // Fórmula intermedia (tarifa / arancel / costo unitario)
                        return (
                            <div
                                key={f.name}
                                className="min-w-0 p-2 sm:p-3 flex flex-col items-center justify-center font-mono font-bold text-slate-800 dark:text-slate-200 text-center"
                            >
                                <span className="text-xs sm:text-sm truncate max-w-full">
                                    Bs. {val.toFixed(2)}
                                </span>
                                <span className="text-[9px] text-slate-400 font-sans font-normal mt-0.5 truncate max-w-full">
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
