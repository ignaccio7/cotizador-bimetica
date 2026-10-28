/**
 *  * Validador y Resolutor de Dependencias de Fórmulas — Cotizador Bimetica
 * Gestiona el árbol de dependencias y la detección de ciclos circulares.

 * Palabras reservadas de Math.js (operadores lógicos, funciones matemáticas y constantes).
 * Ninguna fórmula ni variable puede usar estos identificadores para no colisionar con el motor.
 */
export const MATHJS_RESERVED = [
    'and', 'or', 'not', 'xor',
    'true', 'false', 'null', 'undefined',
    'ceil', 'floor', 'round', 'fix',
    'mod', 'to', 'in',
] as const;

export function isReservedMathKeyword(word: string): boolean {
    return (MATHJS_RESERVED as readonly string[]).includes(word.toLowerCase().trim());
}

export interface FormulaDependencyItem {
    id: number | string;
    code: string;
    expression: string;
    name?: string;
    variable_names?: string[];
    variables?: Array<{
        id: number;
        name: string;
        type: 'static' | 'dynamic';
        value_type: 'integer' | 'decimal' | 'string';
        default_value: string | null;
        options?: string[] | null;
    }>;
}

export interface DependencyResult {
    orderedFormulas: FormulaDependencyItem[];
    circularError?: string;
}

/**
 * Resuelve el árbol completo de dependencias en cualquier nivel (A -> B -> C)
 * y detecta si existe un ciclo en cualquier punto de la cadena.
 */
export function resolveFormulaDependencies(
    rootFormula: FormulaDependencyItem,
    allFormulas: FormulaDependencyItem[]
): DependencyResult {
    const orderedFormulas: FormulaDependencyItem[] = [];
    const visited = new Set<string>();

    function walk(current: FormulaDependencyItem, currentPath: string[]): string | null {
        // 1. Si la fórmula ya está en el camino actual, ¡hay dependencia circular!
        if (currentPath.includes(current.code)) {
            return [...currentPath, current.code].join(' -> ');
        }

        // Si ya fue resuelta en otra rama sin problemas, no repetir
        if (visited.has(current.code)) return null;

        // 2. Buscar qué fórmulas del servicio están escritas en la expresión de 'current'
        const dependencies = allFormulas.filter(
            (f) => f.id !== current.id && f.code && !isReservedMathKeyword(f.code) && new RegExp(`\\b${f.code}\\b`, 'i').test(current.expression)
        );

        // 3. Recorrer cada dependencia pasando la ruta actualizada
        for (const dep of dependencies) {
            const cycle = walk(dep, [...currentPath, current.code]);
            if (cycle) return cycle;
        }

        // 4. Marcar como visitada y agregar al orden de cálculo
        visited.add(current.code);
        if (current.id !== rootFormula.id) {
            orderedFormulas.push(current);
        }

        return null;
    }

    const cyclePath = walk(rootFormula, []);

    return {
        orderedFormulas,
        circularError: cyclePath ? `Dependencia circular: ${cyclePath}` : undefined,
    };
}
