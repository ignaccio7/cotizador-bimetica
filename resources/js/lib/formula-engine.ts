import { create, all } from 'mathjs';

/**
 * Motor de Cálculo Math.js — Cotizador Bimetica
 * Evaluación matemática con soporte a operadores lógicos (and, or),
 * sobrecarga de igualdad para texto y soporte de resultados especiales ('AF').
 */

const math = create(all);

// 1. Sobrecarga controlada de los operadores 'equal' (==) y 'unequal' (!=)
// para permitir comparaciones de texto (ej. complejidad == 'alto') sin romper
// las comparaciones numéricas de Math.js.
const originalEqual = math.equal;
const originalUnequal = math.unequal;

math.import(
    {
        equal: function (a: unknown, b: unknown) {
            if (typeof a === 'string' || typeof b === 'string') {
                return String(a) === String(b);
            }
            return (originalEqual as (x: unknown, y: unknown) => unknown)(a, b);
        },
        unequal: function (a: unknown, b: unknown) {
            if (typeof a === 'string' || typeof b === 'string') {
                return String(a) !== String(b);
            }
            return (originalUnequal as (x: unknown, y: unknown) => unknown)(a, b);
        },
    },
    { override: true }
);

export interface SingleEvaluationResult {
    success: boolean;
    isNumeric: boolean;
    value: number | string | boolean;
    error?: string;
}

export interface EvaluationResult {
    success: boolean;
    isNumeric: boolean;
    result: number | string | boolean;
    formattedResult: string;
    intermediateResults: Record<string, number | string | boolean>;
    error?: string;
}

/**
 * Evalúa una sola expresión matemática con su scope de variables.
 */
export function evaluateFormula(
    expression: string,
    scope: Record<string, number | string | boolean> = {}
): SingleEvaluationResult {
    const trimmed = expression.trim();
    if (!trimmed) {
        return { success: false, isNumeric: false, value: 0, error: 'La expresión está vacía' };
    }

    try {
        const rawResult = math.evaluate(trimmed, scope);

        // Caso 1: Resultado de texto explícito (ej: fórmulas que retornan 'AF')
        if (typeof rawResult === 'string') {
            return {
                success: true,
                isNumeric: false,
                value: rawResult,
            };
        }

        // Caso 2: Booleano nativo (preserva true/false intacto para encadenamiento lógico)
        if (typeof rawResult === 'boolean') {
            return {
                success: true,
                isNumeric: false,
                value: rawResult,
            };
        }

        // Caso 3: Evaluación numérica estricta (protege contra Infinity, -Infinity y NaN)
        const numericValue = Number(rawResult);

        if (!Number.isFinite(numericValue)) {
            return {
                success: false,
                isNumeric: false,
                value: 0,
                error: 'El cálculo resultó en un valor no numérico o división entre cero',
            };
        }

        return {
            success: true,
            isNumeric: true,
            value: numericValue,
        };
    } catch (err: unknown) {
        return {
            success: false,
            isNumeric: false,
            value: 0,
            error: err instanceof Error ? err.message : 'Error al evaluar la fórmula',
        };
    }
}

/**
 * Motor Encadenado en Cascada.
 * Evalúa las fórmulas previas en orden de dependencias, inyecta sus resultados
 * en el scope acumulativo y finalmente evalúa la fórmula objetivo.
 */
export function evaluateFormulaChain(
    targetExpression: string,
    referencedFormulas: Array<{ code: string; expression: string }> = [],
    scope: Record<string, number | string | boolean | undefined | null> = {}
): EvaluationResult {
    // 1. Sanitizar el scope preservando textos, booleanos y convirtiendo números
    const cleanScope: Record<string, number | string | boolean> = {};
    for (const [key, val] of Object.entries(scope)) {
        if (val === undefined || val === null || val === '') {
            cleanScope[key] = 0; // Si no hay nada, asume 0 para no romper operaciones
        } else if (typeof val === 'boolean') {
            cleanScope[key] = val; // Preserva true o false intacto
        } else if (typeof val === 'string' && isNaN(Number(val))) {
            cleanScope[key] = val; // Preserva palabras como 'alto', 'medio', 'AF'
        } else {
            cleanScope[key] = Number(val) || 0; // Convierte "150" al número puro 150
        }
    }

    const intermediateResults: Record<string, number | string | boolean> = {};

    // 2. Evaluar cada fórmula previa en el orden secuencial de dependencias
    for (const prev of referencedFormulas) {
        const prevEval = evaluateFormula(prev.expression, cleanScope);
        if (!prevEval.success) {
            return {
                success: false,
                isNumeric: false,
                result: 0,
                formattedResult: '--',
                intermediateResults,
                error: `Error en fórmula previa [${prev.code}]: ${prevEval.error}`,
            };
        }

        // Guardar resultado intermedio e inyectar al scope para las fórmulas posteriores
        intermediateResults[prev.code] = prevEval.value;
        cleanScope[prev.code] = prevEval.value;
    }

    // 3. Evaluar la fórmula raíz final con el scope enriquecido
    const finalEval = evaluateFormula(targetExpression, cleanScope);

    let formattedResult = '--';
    if (finalEval.success) {
        if (typeof finalEval.value === 'boolean') {
            formattedResult = finalEval.value ? 'Sí' : 'No';
        } else {
            formattedResult = String(finalEval.value);
        }
    }

    return {
        success: finalEval.success,
        isNumeric: finalEval.isNumeric,
        result: finalEval.value,
        formattedResult,
        intermediateResults,
        error: finalEval.error,
    };
}
