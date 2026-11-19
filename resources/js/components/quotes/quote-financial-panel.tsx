import { EyeOff } from 'lucide-react';
import type { ParameterItem, ServiceItem } from '@/lib/quote-services';
import { evaluateFormula, evaluateFormulaChain } from '@/lib/formula-engine';
import {
    resolveFormulaDependencies,
    type FormulaDependencyItem,
} from '@/lib/formula-validator';

export interface ServiceBreakdownItem {
    service: ServiceItem;
    subtotal: number;
}

export interface AppliedTotalParameter {
    group: string;
    label: string;
    name: string;
    value: string | number;
}

export interface QuoteBreakdownResult {
    serviceBreakdown: ServiceBreakdownItem[];
    servicesSubtotal: number;
    appliedTotalParameters: AppliedTotalParameter[];
    totalAmount: number;
}

/**
 * Calcula de forma determinista y topológica el desglose de subtotales
 * de cada servicio activo y el monto total evaluado dinámicamente con Math.js.
 */
export function calculateQuoteBreakdown(
    activeServices: ServiceItem[],
    serviceVariables: Record<number, Record<string, string>>,
    designParameters: Record<string, string> = {},
    availableParameters: ParameterItem[] = [],
    totalFormula: string = 'services_subtotal'
): QuoteBreakdownResult {
    // 1. Extraer los parámetros de ámbito 'global' (como project_category) para las fórmulas de servicio:
    // Solo leemos de designParameters los grupos que están definidos en la BD con scope === 'global'.
    const formulaParameters: Record<string, string | number> = {};
    const globalParams = availableParameters.filter((p) => p.scope === 'global');

    globalParams.forEach((param) => {
        const val = designParameters[param.group];
        if (val !== undefined && val !== '') {
            formulaParameters[param.group] = val;
        }
    });

    // Mapear parámetros de servicio disponibles para inyección de valores por defecto
    const serviceParams = availableParameters.filter((p) => p.scope === 'service');
    const serviceParamGroupsMap = new Map<string, { group: string; items: ParameterItem[] }>();
    serviceParams.forEach((p) => {
        if (!serviceParamGroupsMap.has(p.group)) {
            serviceParamGroupsMap.set(p.group, { group: p.group, items: [] });
        }
        serviceParamGroupsMap.get(p.group)!.items.push(p);
    });

    const serviceBreakdown = activeServices.map((service) => {
        const formulas = service.formulas || [];

        // Identificar la fórmula que entrega el subtotal final:
        // Prioridad 1: La fórmula marcada explícitamente como subtotal oficial (is_subtotal)
        // Prioridad 2 (Retrocompatible): Última fórmula visible
        // Prioridad 3 (Fallback): Última fórmula del servicio
        const targetFormula =
            formulas.find((f) => f.is_subtotal) ??
            [...formulas].reverse().find((f) => f.is_visible !== false) ??
            (formulas.length > 0 ? formulas[formulas.length - 1] : null);

        if (!targetFormula) {
            return { service, subtotal: 0 };
        }

        // Construir el scope con: parámetros globales de fórmula + variables ingresadas por el usuario
        const scope: Record<string, string | number> = {
            ...formulaParameters,
            ...(serviceVariables[service.id] || {}),
        };

        // Si el servicio tiene fórmulas que referencian parámetros de servicio (scope === 'service')
        // y el usuario aún no interactuó con el selector, inyectar el valor por defecto del primer ítem (defaultVal).
        const allExpressions = formulas.map((f) => f.expression).join(' ');
        serviceParamGroupsMap.forEach((pg) => {
            const regex = new RegExp(`\\b${pg.group}\\b`, 'i');
            if (regex.test(allExpressions)) {
                if (scope[pg.group] === undefined || scope[pg.group] === '') {
                    const defaultVal = pg.items[0]?.value ?? 0;
                    scope[pg.group] = defaultVal;
                }
            }
        });

        // Si alguna variable de fórmula aún no fue editada por el usuario, inyectar su valor por defecto (default_value)
        formulas.forEach((f) => {
            f.variables?.forEach((v) => {
                if (scope[v.name] === undefined && v.default_value !== null) {
                    scope[v.name] = v.default_value;
                }
            });
        });

        // Mapear todas las fórmulas del servicio para el árbol de dependencias
        const allFormulas: FormulaDependencyItem[] = formulas.map((f) => ({
            id: f.id ?? f.name,
            code: f.code || f.name,
            expression: f.expression,
            name: f.name,
        }));

        const targetDep = allFormulas.find(
            (f) => f.id === (targetFormula.id ?? targetFormula.name)
        ) ?? {
            id: targetFormula.id ?? targetFormula.name,
            code: targetFormula.code || targetFormula.name,
            expression: targetFormula.expression,
        };

        // resolveFormulaDependencies ordena matemáticamente según quién depende de quién
        const { orderedFormulas } = resolveFormulaDependencies(
            targetDep,
            allFormulas
        );

        // evaluateFormulaChain evalúa las fórmulas previas en orden y finalmente la fórmula objetivo
        const evalResult = evaluateFormulaChain(
            targetFormula.expression,
            orderedFormulas,
            scope
        );

        const subtotal =
            evalResult.success && evalResult.isNumeric
                ? Number(evalResult.result) || 0
                : 0;

        return { service, subtotal };
    });

    // 1. Subtotal de servicios (suma de subtotales individuales)
    const servicesSubtotal = serviceBreakdown.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    // 2. Construcción dinámica del scope para la fórmula del Total:
    // Contiene 'services_subtotal' y dinámicamente cualquier parámetro de la BD con scope === 'total' o scope === 'global'.
    const totalScope: Record<string, number | string | boolean> = {
        services_subtotal: servicesSubtotal,
    };

    const eligibleTotalParams = availableParameters.filter(
        (p) => p.scope === 'total' || p.scope === 'global'
    );
    const appliedTotalParameters: AppliedTotalParameter[] = [];
    const seenTotalGroups = new Set<string>();

    eligibleTotalParams.forEach((param) => {
        const val = designParameters[param.group];
        if (val !== undefined && val !== '') {
            totalScope[param.group] = parseFloat(String(val)) || 0;

            const isReferencedInFormula = new RegExp(`\\b${param.group}\\b`, 'i').test(totalFormula);
            if ((param.scope === 'total' || isReferencedInFormula) && !seenTotalGroups.has(param.group)) {
                seenTotalGroups.add(param.group);
                appliedTotalParameters.push({
                    group: param.group,
                    label: param.group_label || param.group,
                    name: designParameters[`${param.group}_label`] || String(val),
                    value: val,
                });
            }
        }
    });

    // 3. Evaluación de la fórmula del Total exclusivamente con Math.js
    const evalResult = evaluateFormula(totalFormula, totalScope);

    const calculatedTotal =
        evalResult.success && evalResult.isNumeric
            ? Number(evalResult.value)
            : servicesSubtotal;

    const totalAmount = Math.max(0, Math.round(calculatedTotal * 100) / 100);

    return {
        serviceBreakdown,
        servicesSubtotal,
        appliedTotalParameters,
        totalAmount,
    };
}

export interface QuoteFinancialPanelProps {
    activeServices: ServiceItem[];
    serviceVariables: Record<number, Record<string, string>>;
    designParameters?: Record<string, string>;
    availableParameters?: ParameterItem[];
    totalFormula?: string;
    onClose?: () => void;
}

export function QuoteFinancialPanel({
    activeServices,
    serviceVariables,
    designParameters = {},
    availableParameters = [],
    totalFormula = 'services_subtotal',
    onClose,
}: QuoteFinancialPanelProps) {
    const {
        serviceBreakdown,
        servicesSubtotal,
        appliedTotalParameters,
        totalAmount,
    } = calculateQuoteBreakdown(
        activeServices,
        serviceVariables,
        designParameters,
        availableParameters,
        totalFormula
    );

    const hasAdjustments = servicesSubtotal !== totalAmount || appliedTotalParameters.length > 0;

    return (
        <div className="rounded-lg border border-border bg-card shadow-2xs overflow-hidden print-break-inside-avoid">
            {/* Barra de Título sobria con botón sutil para cerrar */}
            <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide text-foreground">
                    Desglose de la Propuesta
                </span>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Ocultar desglose"
                        aria-label="Ocultar desglose"
                    >
                        <EyeOff className="size-3.5" />
                    </button>
                )}
            </div>

            {/* Contenido: Servicios, ajustes al total y monto final */}
            <div className="p-4 space-y-3">
                <div className="divide-y divide-border/60 text-xs">
                    {/* Subtotales por servicio activo */}
                    {activeServices.length === 0 ? (
                        <div className="py-2.5 text-center text-xs text-muted-foreground italic">
                            Sin servicios seleccionados
                        </div>
                    ) : (
                        serviceBreakdown.map(({ service, subtotal }) => (
                            <div
                                key={service.id}
                                className="py-2 flex items-center justify-between gap-4"
                            >
                                <span className="text-muted-foreground truncate">
                                    Subtotal {service.name}:
                                </span>
                                <span className="font-mono font-semibold text-foreground shrink-0">
                                    {subtotal > 0
                                        ? `Bs. ${subtotal.toLocaleString('en-US', {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                          })}`
                                        : 'Bs. 0.00'}
                                </span>
                            </div>
                        ))
                    )}

                    {/* Subtotal Servicios (visible cuando existen ajustes al total) */}
                    {hasAdjustments && activeServices.length > 0 && (
                        <div className="py-2 flex items-center justify-between gap-4 font-semibold text-muted-foreground">
                            <span>Subtotal Servicios:</span>
                            <span className="font-mono shrink-0">
                                Bs.{' '}
                                {servicesSubtotal.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    )}

                    {/* Parámetros de Ámbito Total aplicados dinámicamente */}
                    {appliedTotalParameters.map((param) => (
                        <div
                            key={param.group}
                            className="py-2 flex items-center justify-between gap-4 font-semibold text-secondary-600 dark:text-secondary-400"
                        >
                            <span className="truncate">
                                {param.label}:
                            </span>
                            <span className="font-mono shrink-0">
                                {param.name}
                            </span>
                        </div>
                    ))}

                    {/* Monto Total */}
                    <div className="pt-2.5 flex items-center justify-between gap-4 font-bold">
                        <span className="uppercase text-primary text-xs">
                            Monto Total:
                        </span>
                        <span className="font-mono text-primary text-sm">
                            Bs.{' '}
                            {totalAmount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
