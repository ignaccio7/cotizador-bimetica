/**
 * Evaluador matemático seguro para fórmulas del cotizador Bimetica.
 * Soporta operadores lógicos, ternarios (? :), comparaciones (==, !=, <, >)
 * y funciones de redondeo (ceil, floor, round, abs, min, max).
 */

export function evaluateFormula(expression: string, scope: Record<string, any>): number | null {
    if (!expression || !expression.trim()) return null;

    try {
        const mathHelpers = {
            ceil: Math.ceil,
            floor: Math.floor,
            round: (val: number, decimals: number = 0) => {
                const factor = Math.pow(10, decimals);
                return Math.round(val * factor) / factor;
            },
            abs: Math.abs,
            min: Math.min,
            max: Math.max,
        };

        const fullScope = { ...mathHelpers, ...scope };
        const keys = Object.keys(fullScope);
        const values = Object.values(fullScope);

        // Evaluación segura en modo estricto
        const fn = new Function(...keys, `"use strict"; return (${expression});`);
        const result = fn(...values);

        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            return result;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Convierte un nombre de fórmula a un identificador seguro para referenciarlo
 * en fórmulas posteriores dentro de la misma cascada (ej: "BS /M2" -> "bs_m2", "INVERSIÓN BS." -> "inversion_bs").
 */
export function slugifyFormulaName(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}
