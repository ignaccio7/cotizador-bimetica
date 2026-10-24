import { evaluate } from 'mathjs';

/**
 * Motor de Cálculo Math.js — Cotizador Bimetica
 * Sub-paso 3: Evaluación de una sola fórmula matemática directa.
 */

export interface SingleEvaluationResult {
    success: boolean;
    value: number;
    error?: string;
}

export interface EvaluationResult {
    success: boolean;
    result: number;
    formattedResult: string;
    intermediateResults: Record<string, number>;
    error?: string;
}

/**
 * Sub-paso 3: Evalúa una sola expresión matemática con su scope de variables.
 */
export function evaluateFormula(
    expression: string,
    scope: Record<string, number> = {}
): SingleEvaluationResult {
    const trimmed = expression.trim();
    if (!trimmed) {
        return { success: false, value: 0, error: 'La expresión está vacía' };
    }

    try {
        const rawResult = evaluate(trimmed, scope);
        const numericValue = Number(rawResult);

        if (!Number.isFinite(numericValue)) {
            return {
                success: false,
                value: 0,
                error: 'El cálculo resultó en un valor no numérico o división entre cero',
            };
        }

        return {
            success: true,
            value: numericValue,
        };
    } catch (err: unknown) {
        return {
            success: false,
            value: 0,
            error: err instanceof Error ? err.message : 'Error al evaluar la fórmula',
        };
    }
}

/**
 * Sub-paso 4: Motor Encadenado en Cascada.
 * Evalúa las fórmulas previas en orden de dependencias, inyecta sus resultados
 * en el scope acumulativo y finalmente evalúa la fórmula objetivo.
 */
export function evaluateFormulaChain(
    targetExpression: string,
    referencedFormulas: Array<{ code: string; expression: string }> = [],
    scope: Record<string, number | string | undefined | null> = {}
): EvaluationResult {
    // 1. Sanitizar el scope convirtiendo valores a números
    const numericScope: Record<string, number> = {};
    for (const [key, val] of Object.entries(scope)) {
        numericScope[key] = Number(val) || 0;
    }

    const intermediateResults: Record<string, number> = {};

    // 2. Evaluar cada fórmula previa en el orden secuencial de dependencias
    console.log('referencedFormulas', referencedFormulas);

    for (const prev of referencedFormulas) {

        const prevEval = evaluateFormula(prev.expression, numericScope);
        if (!prevEval.success) {
            return {
                success: false,
                result: 0,
                formattedResult: '--',
                intermediateResults,
                error: `Error en fórmula previa [${prev.code}]: ${prevEval.error}`,
            };
        }

        // Guardar resultado intermedio e inyectar al scope para las fórmulas posteriores
        intermediateResults[prev.code] = prevEval.value;
        numericScope[prev.code] = prevEval.value;
    }

    // 3. Evaluar la fórmula raíz final con el scope enriquecido
    const finalEval = evaluateFormula(targetExpression, numericScope);

    return {
        success: finalEval.success,
        result: finalEval.value,
        formattedResult: finalEval.success ? String(finalEval.value) : '--',
        intermediateResults,
        error: finalEval.error,
    };
}
