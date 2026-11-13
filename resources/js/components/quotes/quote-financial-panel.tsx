import { EyeOff } from 'lucide-react';
import type { ServiceItem } from '@/lib/quote-services';
import { evaluateFormulaChain } from '@/lib/formula-engine';
import {
    resolveFormulaDependencies,
    type FormulaDependencyItem,
} from '@/lib/formula-validator';

export interface ServiceBreakdownItem {
    service: ServiceItem;
    subtotal: number;
}

export interface QuoteBreakdownResult {
    serviceBreakdown: ServiceBreakdownItem[];
    servicesSubtotal: number;
    discountPercent: number;
    discountAmount: number;
    discountLabel?: string;
    viaticoAmount: number;
    viaticoLabel?: string;
    totalAmount: number;
}

/**
 * Calcula de forma determinista y topológica el desglose de subtotales
 * de cada servicio activo y el monto total ajustado con descuento y viáticos.
 * 
 * Regla de negocio (Paso 7C.1):
 * - La Categoría del Proyecto (project_category) y parámetros adicionales siguen entrando al scope de fórmulas.
 * - Descuentos (discount) y Viáticos (viatico) se excluyen de las fórmulas y se calculan sobre el Total:
 *   Total = max(0, Subtotal Servicios - Descuento) + Viáticos
 */
export function calculateQuoteBreakdown(
    activeServices: ServiceItem[],
    serviceVariables: Record<number, Record<string, string>>,
    designParameters: Record<string, string> = {}
): QuoteBreakdownResult {
    // 1. Filtrar los parámetros para las fórmulas de servicio:
    // Categoría del proyecto (project_category) y cualquier parámetro futuro siguen entrando a Math.js.
    // Únicamente excluimos 'discount' y 'viatico' para que no contaminen las fórmulas individuales.
    const formulaParameters: Record<string, string | number> = {};
    Object.entries(designParameters).forEach(([key, val]) => {
        if (!key.startsWith('viatico') && !key.startsWith('discount')) {
            formulaParameters[key] = val;
        }
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

        // Construir el scope con: parámetros de fórmula (incluyendo project_category) + variables ingresadas por el usuario
        const scope: Record<string, string | number> = {
            ...formulaParameters,
            ...(serviceVariables[service.id] || {}),
        };

        // Si alguna variable aún no fue editada por el usuario, inyectar su valor por defecto (default_value)
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

    // 2. Descuento comercial (porcentaje sobre el subtotal de servicios)
    const rawDiscount = parseFloat(String(designParameters['discount'] || '0')) || 0;
    const discountPercent = rawDiscount > 0 ? rawDiscount : 0;
    const discountAmount =
        discountPercent > 0
            ? Math.round(servicesSubtotal * (discountPercent / 100) * 100) / 100
            : 0;
    const discountLabel = designParameters['discount_label'] || '';

    // 3. Viáticos por ciudad (monto fijo en Bs.)
    const rawViatico = parseFloat(String(designParameters['viatico'] || '0')) || 0;
    const viaticoAmount = rawViatico > 0 ? Math.round(rawViatico * 100) / 100 : 0;
    const viaticoLabel = designParameters['viatico_label'] || '';

    // 4. Monto Total Final: max(0, Subtotal - Descuento) + Viáticos
    const totalAmount = Math.max(
        0,
        Math.round((servicesSubtotal - discountAmount + viaticoAmount) * 100) / 100
    );

    return {
        serviceBreakdown,
        servicesSubtotal,
        discountPercent,
        discountAmount,
        discountLabel,
        viaticoAmount,
        viaticoLabel,
        totalAmount,
    };
}

export interface QuoteFinancialPanelProps {
    activeServices: ServiceItem[];
    serviceVariables: Record<number, Record<string, string>>;
    designParameters?: Record<string, string>;
    onClose?: () => void;
}

export function QuoteFinancialPanel({
    activeServices,
    serviceVariables,
    designParameters = {},
    onClose,
}: QuoteFinancialPanelProps) {
    const {
        serviceBreakdown,
        servicesSubtotal,
        discountPercent,
        discountAmount,
        discountLabel,
        viaticoAmount,
        viaticoLabel,
        totalAmount,
    } = calculateQuoteBreakdown(
        activeServices,
        serviceVariables,
        designParameters
    );

    const hasAdjustments = discountAmount > 0 || viaticoAmount > 0;

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

                    {/* Subtotal Servicios (visible cuando existen ajustes de descuento o viático) */}
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

                    {/* Fila de Descuento (si aplica) */}
                    {discountAmount > 0 && (
                        <div className="py-2 flex items-center justify-between gap-4 font-semibold text-rose-600 dark:text-rose-400">
                            <span className="truncate">
                                Descuento ({discountLabel || `${discountPercent}%`}):
                            </span>
                            <span className="font-mono shrink-0">
                                - Bs.{' '}
                                {discountAmount.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    )}

                    {/* Fila de Viático por Ciudad (si aplica) */}
                    {viaticoAmount > 0 && (
                        <div className="py-2 flex items-center justify-between gap-4 font-semibold text-foreground">
                            <span className="truncate">
                                Viáticos ({viaticoLabel || 'Ciudad'}):
                            </span>
                            <span className="font-mono shrink-0">
                                + Bs.{' '}
                                {viaticoAmount.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    )}

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
