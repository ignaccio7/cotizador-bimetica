import {
    Calculator,
    Check,
    Hash,
    HelpCircle,
    Layers,
    Lock,
    Sliders,
    Table,
    Trash2,
} from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { evaluateFormula, slugifyFormulaName } from '@/lib/formula-evaluator';
import type { FloorGroupItem } from '@/types/quotes';
import type { ServiceItem, VariableItem } from '@/types/services';

interface QuoteServiceCardProps {
    service: ServiceItem;
    availableVariables: VariableItem[];
    floorGroups: FloorGroupItem[];
    assignedFloorGroupId: string | null;
    onAssignFloorGroup: (serviceId: number, floorGroupId: string | null) => void;
    filledVariables: Record<string, any>;
    onChangeVariable: (serviceId: number, varName: string, value: any) => void;
    onRemoveService: (serviceId: number) => void;
}

export function QuoteServiceCard({
    service,
    availableVariables,
    floorGroups,
    assignedFloorGroupId,
    onAssignFloorGroup,
    filledVariables,
    onChangeVariable,
    onRemoveService,
}: QuoteServiceCardProps) {
    // Buscar la tabla de pisos asignada (si existe)
    const assignedGroup = useMemo(() => {
        if (!assignedFloorGroupId) return null;
        return floorGroups.find((g) => g.id === assignedFloorGroupId) ?? null;
    }, [floorGroups, assignedFloorGroupId]);

    // Superficie calculada de la tabla asignada
    const assignedArea = useMemo(() => {
        if (!assignedGroup) return null;
        return assignedGroup.floors.reduce(
            (sum, f) => (f.isActive ? sum + (Number(f.area) || 0) : sum),
            0
        );
    }, [assignedGroup]);

    // Detectar qué variables dinámicas intervienen en las fórmulas de este servicio
    const dynamicVariablesList = useMemo(() => {
        // Obtenemos los nombres de variables referenciados en las fórmulas
        const referencedNames = new Set<string>();
        if (service.formulas) {
            for (const f of service.formulas) {
                // Agregar variables declaradas en la relación
                if (f.variable_names) {
                    f.variable_names.forEach((name) => referencedNames.add(name));
                }
                // Detección por expresión de variables comunes si no están explícitamente en la relación
                for (const v of availableVariables) {
                    if (new RegExp(`\\b${v.name}\\b`).test(f.expression)) {
                        referencedNames.add(v.name);
                    }
                }
            }
        }

        // Si no se detectaron fórmulas pero es un servicio estándar, sugerimos variables base
        if (referencedNames.size === 0) {
            if (service.name.toLowerCase().includes('suelo')) {
                referencedNames.add('pozos');
            } else {
                referencedNames.add('m2');
                referencedNames.add('complejidad');
            }
        }

        return availableVariables.filter(
            (v) => v.type === 'dynamic' && referencedNames.has(v.name)
        );
    }, [service.formulas, availableVariables, service.name]);

    // Ámbito de cálculo actual para las fórmulas
    const currentScope = useMemo(() => {
        const scope: Record<string, any> = {
            m2: assignedArea !== null ? assignedArea : Number(filledVariables.m2) || 0,
            complejidad: filledVariables.complejidad || 'medio',
            pozos: Number(filledVariables.pozos) || 3,
            cambiodolar: 12.11,
            ...filledVariables,
        };

        // Si hay una tabla asignada, forzar m2 de esa tabla
        if (assignedArea !== null) {
            scope.m2 = assignedArea;
        }

        return scope;
    }, [filledVariables, assignedArea]);

    // Evaluación en cascada de las fórmulas del servicio
    const formulaCalculations = useMemo(() => {
        if (!service.formulas || service.formulas.length === 0) {
            // Cálculo fallback si no hay fórmulas configuradas
            const m2 = currentScope.m2 || 0;
            const subtotal = Math.ceil(m2 * 25);
            return {
                steps: [{ name: 'INVERSIÓN BS.', value: subtotal, is_visible: true }],
                subtotal,
            };
        }

        const cascadeScope: Record<string, any> = { ...currentScope };
        const steps: { name: string; value: number | null; is_visible: boolean }[] = [];
        let finalSubtotal = 0;

        for (const f of service.formulas) {
            const val = evaluateFormula(f.expression, cascadeScope);
            const slug = slugifyFormulaName(f.name);
            if (val !== null) {
                cascadeScope[slug] = val;
                finalSubtotal = val;
            }
            steps.push({
                name: f.name,
                value: val,
                is_visible: f.is_visible,
            });
        }

        return {
            steps,
            subtotal: Math.ceil(finalSubtotal || 0),
        };
    }, [service.formulas, currentScope]);

    return (
        <Card className="border-slate-200/90 shadow-xs dark:border-slate-800 overflow-hidden">
            {/* Header del Servicio */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-md bg-[#003e65] text-white">
                        <Layers className="size-4 text-[#fbad03]" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                            {service.name}
                        </h4>
                        {service.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {service.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Subtotal en Bolivianos */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#003e65] px-3 py-1 text-white shadow-xs">
                        <span className="text-[10px] font-bold uppercase text-slate-200">
                            Subtotal:
                        </span>
                        <span className="font-mono text-xs font-extrabold text-[#fbad03]">
                            Bs. {formulaCalculations.subtotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveService(service.id)}
                        className="size-7 p-0 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                        title="Quitar este servicio de la cotización"
                    >
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            </div>

            <CardContent className="p-4 space-y-4">
                {/* Selector de Tabla de Pisos Asignada */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Table className="size-4 text-[#003e65] dark:text-[#fbad03]" />
                            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Origen de Superficie (Tabla de Pisos):
                            </Label>
                        </div>

                        <select
                            value={assignedFloorGroupId || ''}
                            onChange={(e) =>
                                onAssignFloorGroup(
                                    service.id,
                                    e.target.value ? e.target.value : null
                                )
                            }
                            className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-[#003e65] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            <option value="">-- Sin tabla de pisos (Manual / No aplica) --</option>
                            {floorGroups.map((g, idx) => (
                                <option key={g.id} value={g.id}>
                                    Tabla #{idx + 1}: {g.table_name} ({g.total_area} m²)
                                </option>
                            ))}
                        </select>
                    </div>

                    {assignedGroup ? (
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md p-1.5 px-2.5">
                            <Lock className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>
                                Vinculado a: <strong>{assignedGroup.table_name}</strong>. Área computada en tiempo real: <strong>{assignedArea} m²</strong>.
                            </span>
                        </div>
                    ) : (
                        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            Este servicio no está vinculado a ninguna tabla de superficies; sus variables se ingresan libremente.
                        </p>
                    )}
                </div>

                {/* Variables Dinámicas Llenables */}
                <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <Sliders className="size-3 text-slate-400" />
                        <span>Variables del Servicio</span>
                    </h5>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {/* Variable m2 */}
                        {dynamicVariablesList.some((v) => v.name === 'm2') && (
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                        Superficie m²
                                    </Label>
                                    {assignedGroup && (
                                        <Badge variant="outline" className="text-[9px] py-0 px-1 border-emerald-300 text-emerald-700 bg-emerald-50">
                                            Auto (Tabla)
                                        </Badge>
                                    )}
                                </div>
                                <div className="relative mt-1">
                                    {assignedGroup && (
                                        <Lock className="pointer-events-none absolute right-2.5 top-2.5 size-3.5 text-slate-400" />
                                    )}
                                    <Input
                                        type="number"
                                        min="0"
                                        value={assignedArea !== null ? assignedArea : filledVariables.m2 ?? 300}
                                        disabled={assignedGroup !== null}
                                        onChange={(e) =>
                                            onChangeVariable(service.id, 'm2', Number(e.target.value) || 0)
                                        }
                                        className={`h-8 font-mono text-xs font-bold ${
                                            assignedGroup ? 'bg-slate-100/70 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300' : ''
                                        }`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Variable complejidad */}
                        {dynamicVariablesList.some((v) => v.name === 'complejidad') && (
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Nivel de Complejidad
                                </Label>
                                <select
                                    value={filledVariables.complejidad || 'medio'}
                                    onChange={(e) =>
                                        onChangeVariable(service.id, 'complejidad', e.target.value)
                                    }
                                    className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-[#003e65] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    <option value="bajo">Bajo (Factor 0.9 / 1.0)</option>
                                    <option value="medio">Medio (Factor Estándar 1.0)</option>
                                    <option value="alto">Alto (Factor Especial 1.25 / 1.3)</option>
                                </select>
                            </div>
                        )}

                        {/* Variable pozos */}
                        {dynamicVariablesList.some((v) => v.name === 'pozos') && (
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Cantidad de Pozos (Suelos)
                                </Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={filledVariables.pozos ?? 3}
                                    onChange={(e) =>
                                        onChangeVariable(service.id, 'pozos', Number(e.target.value) || 1)
                                    }
                                    className="mt-1 h-8 font-mono text-xs font-bold"
                                />
                            </div>
                        )}

                        {/* Otras variables dinámicas adicionales */}
                        {dynamicVariablesList
                            .filter((v) => !['m2', 'complejidad', 'pozos'].includes(v.name))
                            .map((v) => (
                                <div key={v.id}>
                                    <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                        {v.name} {v.description ? `(${v.description})` : ''}
                                    </Label>
                                    {v.value_type === 'string' && v.options ? (
                                        <select
                                            value={filledVariables[v.name] || v.options[0]}
                                            onChange={(e) =>
                                                onChangeVariable(service.id, v.name, e.target.value)
                                            }
                                            className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold"
                                        >
                                            {v.options.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            type="number"
                                            value={filledVariables[v.name] ?? v.default_value ?? 0}
                                            onChange={(e) =>
                                                onChangeVariable(service.id, v.name, Number(e.target.value) || 0)
                                            }
                                            className="mt-1 h-8 font-mono text-xs font-bold"
                                        />
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Desglose de Fórmulas y Columnas Calculadas */}
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Calculator className="size-3 text-[#2684a8]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            Evaluación Matemática en Vivo:
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {formulaCalculations.steps
                            .filter((s) => s.is_visible)
                            .map((step, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs shadow-2xs dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                                        {step.name}:
                                    </span>
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                                        {step.value !== null
                                            ? typeof step.value === 'number'
                                                ? step.value.toLocaleString('es-BO', {
                                                      minimumFractionDigits: 2,
                                                      maximumFractionDigits: 2,
                                                  })
                                                : step.value
                                            : '—'}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
