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
    totalAmount: number;
}

/**
 * Calcula de forma determinista y topológica el desglose de subtotales
 * de cada servicio activo y el monto total neto acordado.
 */
export function calculateQuoteBreakdown(
    activeServices: ServiceItem[],
    serviceVariables: Record<number, Record<string, string>>,
    designParameters: Record<string, string> = {}
): QuoteBreakdownResult {
    const serviceBreakdown = activeServices.map((service) => {
        const formulas = service.formulas || [];

        // 1. Identificar la fórmula que entrega el subtotal final:
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

        // 2. Construir el scope con: parámetros globales + variables ingresadas por el usuario
        const scope: Record<string, string | number> = {
            ...designParameters,
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

        // 3. Mapear todas las fórmulas del servicio para el árbol de dependencias
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

        // 4. resolveFormulaDependencies ordena matemáticamente según quién depende de quién:
        // Si 'inversion = arancel * 2' y 'arancel = m2 * 10', orderedFormulas pondrá 'arancel' ANTES.
        const { orderedFormulas } = resolveFormulaDependencies(
            targetDep,
            allFormulas
        );

        // 5. evaluateFormulaChain evalúa las fórmulas previas en orden y finalmente la fórmula objetivo
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

    // Monto Total Neto Acordado: suma de subtotales
    const totalAmount = serviceBreakdown.reduce(
        (sum, item) => sum + item.subtotal,
        0
    );

    return { serviceBreakdown, totalAmount };
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
    const { serviceBreakdown, totalAmount } = calculateQuoteBreakdown(
        activeServices,
        serviceVariables,
        designParameters
    );

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

            {/* Contenido: Únicamente los servicios y el total neto acordado */}
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

                    {/* Monto Total Neto Acordado */}
                    <div className="pt-2.5 flex items-center justify-between gap-4 font-bold">
                        <span className="uppercase text-primary text-xs">
                            Monto Total Neto Acordado:
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
