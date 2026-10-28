import { Calculator, Check, Info, Layers, Plus, SlidersHorizontal, Sparkles } from 'lucide-react';

export interface ParameterGroupItem {
    group: string;
    group_label?: string | null;
}

interface FormulaAssistantProps {
    availableVariableNames: string[];
    otherFormulaCodes?: string[];
    disabledFormulaCodes?: string[];
    parameterGroups?: ParameterGroupItem[];
    detectedVariables: string[];
    onInsertVariable: (varName: string) => void;
    onInsertOperator: (op: string) => void;
    onInsertParentheses: () => void;
    onInsertTernary: () => void;
    onInsertFunction: (fn: 'ceil' | 'floor' | 'round' | 'fix') => void;
}

export function FormulaAssistant({
    availableVariableNames,
    otherFormulaCodes = [],
    disabledFormulaCodes = [],
    parameterGroups = [],
    detectedVariables,
    onInsertVariable,
    onInsertOperator,
    onInsertParentheses,
    onInsertTernary,
    onInsertFunction,
}: FormulaAssistantProps) {
    return (
        <div className="rounded-lg border border-border/70 bg-background/90 p-3 space-y-3">
            {/* 1. Variables Globales del Sistema */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1">
                        <Info className="size-3.5 text-primary" />
                        Variables del Sistema:
                    </span>
                    {detectedVariables.length > 0 && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            Detectadas en expresión: {detectedVariables.join(', ')}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {availableVariableNames.map((varName) => {
                        const isUsed = detectedVariables.includes(varName);

                        return (
                            <button
                                key={varName}
                                type="button"
                                onClick={() => onInsertVariable(varName)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors cursor-pointer ${isUsed
                                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                                        : 'bg-muted/40 hover:bg-muted text-foreground border-border hover:border-primary/40'
                                    }`}
                                title={`Insertar variable ${varName}`}
                            >
                                <Plus className="size-3 text-muted-foreground" />
                                <span>{varName}</span>
                                {isUsed && <Check className="size-3 ml-0.5" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Otras Fórmulas de este Servicio (Resultados Encadenados) */}
            {otherFormulaCodes.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-secondary-900 dark:text-secondary-200 flex items-center gap-1">
                            <Layers className="size-3.5 text-secondary-600" />
                            Fórmulas de este Servicio:
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            Usa el resultado de otras columnas del servicio
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {otherFormulaCodes.map((code) => {
                            const isUsed = detectedVariables.includes(code);
                            const isCircular = disabledFormulaCodes.includes(code);

                            return (
                                <button
                                    key={code}
                                    type="button"
                                    disabled={isCircular}
                                    onClick={() => onInsertVariable(code)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${isCircular
                                            ? 'opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-dashed border-border'
                                            : isUsed
                                                ? 'bg-secondary-600 text-white border-secondary-600 font-bold shadow-2xs cursor-pointer'
                                                : 'bg-secondary-500/10 hover:bg-secondary-500/20 text-secondary-900 dark:text-secondary-100 border-secondary-400/40 hover:border-secondary-500 cursor-pointer'
                                        }`}
                                    title={
                                        isCircular
                                            ? `Bloqueado: "${code}" ya depende de esta fórmula (causaría dependencia circular)`
                                            : `Insertar resultado de fórmula: ${code}`
                                    }
                                >
                                    <Plus className="size-3 text-secondary-600 dark:text-secondary-400" />
                                    <span className={isCircular ? 'line-through' : ''}>{code}</span>
                                    {isUsed && <Check className="size-3 ml-0.5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 3. Parámetros Globales del Sistema (Factores y Viáticos de BD) */}
            {parameterGroups.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-tertiary-800 dark:text-tertiary-200 flex items-center gap-1">
                            <SlidersHorizontal className="size-3.5 text-tertiary" />
                            Parámetros del Sistema:
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            Inserta parametros definidos en el sistema
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {parameterGroups.map((pg) => {
                            const isUsed = detectedVariables.includes(pg.group);

                            return (
                                <button
                                    key={pg.group}
                                    type="button"
                                    onClick={() => onInsertVariable(pg.group)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors cursor-pointer ${isUsed
                                            ? 'bg-tertiary text-white border-tertiary font-bold shadow-2xs'
                                            : 'bg-tertiary/10 hover:bg-tertiary/20 text-tertiary-900 dark:text-tertiary-100 border-tertiary/30 hover:border-tertiary/50'
                                        }`}
                                    title={
                                        pg.group_label
                                            ? `Insertar parámetro ${pg.group} (${pg.group_label})`
                                            : `Insertar parámetro ${pg.group}`
                                    }
                                >
                                    <Plus className="size-3 text-tertiary" />
                                    <span>{pg.group}</span>
                                    {pg.group_label && (
                                        <span className="text-[10px] opacity-75 font-sans font-normal ml-0.5">
                                            ({pg.group_label})
                                        </span>
                                    )}
                                    {isUsed && <Check className="size-3 ml-0.5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 4. Operadores Matemáticos y Comparaciones */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Calculator className="size-3 text-primary" />
                    Operadores Matemáticos & Comparaciones:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                    {/* Operadores básicos */}
                    {[
                        { label: '+', title: 'Suma', value: '+' },
                        { label: '-', title: 'Resta', value: '-' },
                        { label: '*', title: 'Multiplicación', value: '*' },
                        { label: '/', title: 'División', value: '/' },
                    ].map((op) => (
                        <button
                            key={op.label}
                            type="button"
                            onClick={() => onInsertOperator(op.value)}
                            className="px-2.5 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-bold text-foreground transition-colors cursor-pointer"
                            title={op.title}
                        >
                            {op.label}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={onInsertParentheses}
                        className="px-2.5 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-bold text-foreground transition-colors cursor-pointer"
                        title="Envolver o insertar paréntesis ( )"
                    >
                        ( )
                    </button>

                    <span className="text-border mx-1 font-light">|</span>

                    {/* Comparadores de rango */}
                    {[
                        { label: '<', title: 'Menor que', value: '<' },
                        { label: '<=', title: 'Menor o igual que', value: '<=' },
                        { label: '>', title: 'Mayor que', value: '>' },
                        { label: '>=', title: 'Mayor o igual que', value: '>=' },
                        { label: '==', title: 'Igual a', value: '==' },
                        { label: '!=', title: 'Diferente de', value: '!=' },
                    ].map((comp) => (
                        <button
                            key={comp.label}
                            type="button"
                            onClick={() => onInsertOperator(comp.value)}
                            className="px-2 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
                            title={comp.title}
                        >
                            {comp.label}
                        </button>
                    ))}

                    <span className="text-border mx-1 font-light">|</span>

                    {/* Operadores Lógicos */}
                    {[
                        { label: 'and', title: 'Y lógico: ambas condiciones deben cumplirse (ej. m2 >= 1 and m2 <= 20)', value: 'and' },
                        { label: 'or', title: 'O lógico: al menos una condición debe cumplirse', value: 'or' },
                    ].map((logOp) => (
                        <button
                            key={logOp.label}
                            type="button"
                            onClick={() => onInsertOperator(logOp.value)}
                            className="px-2.5 py-1 rounded border border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs font-mono font-bold text-primary transition-colors cursor-pointer"
                            title={logOp.title}
                        >
                            {logOp.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Funciones de Redondeo y Rango Ternario (Math.js) */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Sparkles className="size-3 text-secondary-600" />
                    Condición de Rango y Redondeos (Math.js):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                    {/* Condicional de rango if/else */}
                    <button
                        type="button"
                        onClick={onInsertTernary}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-secondary-400/50 bg-secondary-50/60 dark:bg-secondary-950/40 hover:bg-secondary-100 dark:hover:bg-secondary-900/50 text-xs font-medium text-secondary-950 dark:text-secondary-100 transition-colors cursor-pointer"
                        title="Rango / Condición ternaria: condición ? valor_si : valor_no (ej: m2 < 30 ? 1600 : m2 * 56)"
                    >
                        <span className="font-bold font-mono">? :</span>
                        <span>Condición if/else</span>
                    </button>

                    {/* Redondeo hacia arriba */}
                    <button
                        type="button"
                        onClick={() => onInsertFunction('ceil')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
                        title="Redondeo hacia arriba (ej: ceil(45.1) -> 46)"
                    >
                        <span className="font-bold">ceil( )</span>
                        <span className="text-[10px] text-muted-foreground font-sans">Redondeo arriba</span>
                    </button>

                    {/* Redondeo hacia abajo */}
                    <button
                        type="button"
                        onClick={() => onInsertFunction('floor')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
                        title="Redondeo hacia abajo (ej: floor(45.9) -> 45)"
                    >
                        <span className="font-bold">floor( )</span>
                        <span className="text-[10px] text-muted-foreground font-sans">Redondeo abajo</span>
                    </button>

                    {/* Redondeo decimal estándar */}
                    <button
                        type="button"
                        onClick={() => onInsertFunction('round')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
                        title="Redondeo clásico con 2 decimales (ej: round(12.3456, 2) -> 12.35)"
                    >
                        <span className="font-bold">round( , 2)</span>
                        <span className="text-[10px] text-muted-foreground font-sans">2 Decimales</span>
                    </button>

                    {/* Solo parte entera */}
                    <button
                        type="button"
                        onClick={() => onInsertFunction('fix')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
                        title="Extraer solo la parte entera sin decimales (ej: fix(12.8) -> 12)"
                    >
                        <span className="font-bold">fix( )</span>
                        <span className="text-[10px] text-muted-foreground font-sans">Parte entera</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
