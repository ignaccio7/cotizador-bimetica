import { Calculator, RotateCcw, Sparkles, Variable as VariableIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { evaluateFormulaChain } from '@/lib/formula-engine';
import { resolveFormulaDependencies } from '@/lib/formula-validator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormulaItem, VariableItem } from './formula-types';

interface FormulaSandboxModalProps {
    formula: FormulaItem | null;
    allFormulas?: FormulaItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FormulaSandboxModal({
    formula,
    allFormulas = [],
    open,
    onOpenChange,
}: FormulaSandboxModalProps) {
    if (!formula) return null;

    // 1. Resolver el árbol completo de dependencias y detectar ciclos en cualquier nivel
    const { orderedFormulas, circularError } = resolveFormulaDependencies(formula, allFormulas);

    console.log('orderedFormulas', orderedFormulas);


    // 2. Obtener variables de BD (de la fórmula actual y de todas las que necesita en la cadena)
    const allVariablesList: VariableItem[] = [
        ...(formula.variables ?? []),
        ...orderedFormulas.flatMap((of) => of.variables ?? []),
    ];

    // 3. Eliminar duplicados si varias fórmulas usan la misma variable (ej. m2)
    const varMap = new Map<string, VariableItem>();
    allVariablesList.forEach((v) => {
        if (!varMap.has(v.name.toLowerCase())) {
            varMap.set(v.name.toLowerCase(), v);
        }
    });

    // 4. Separar en: Dinámicas (inputs de prueba) y Estáticas (constantes de BD)
    const dynamicVariables: string[] = [];
    const staticVariables: { name: string; value: number }[] = [];

    varMap.forEach((v) => {
        if (v.type === 'static') {
            staticVariables.push({
                name: v.name,
                value: Number(v.default_value) || 0,
            });
        } else {
            dynamicVariables.push(v.name);
        }
    });

    const [values, setValues] = useState<Record<string, number | string>>({});

    // Inicializar: variables dinámicas en 0, y constantes fijas con su valor de BD
    useEffect(() => {
        if (open && formula) {
            const initial: Record<string, number> = {};
            dynamicVariables.forEach((v) => {
                initial[v] = 0;
            });
            staticVariables.forEach((s) => {
                initial[s.name] = s.value;
            });
            setValues(initial);
        }
    }, [formula.id, open]);

    const handleVariableChange = (name: string, value: string) => {
        setValues((prev) => ({
            ...prev,
            [name]: value === '' ? '' : Number(value),
        }));
    };

    const handleReset = () => {
        const initial: Record<string, number> = {};
        dynamicVariables.forEach((v) => {
            initial[v] = 0;
        });
        staticVariables.forEach((s) => {
            initial[s.name] = s.value;
        });
        setValues(initial);
    };

    // Evaluación en tiempo real con Math.js
    const evaluation = evaluateFormulaChain(formula.expression, orderedFormulas, values);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-secondary-500/10 text-secondary-600 border border-secondary-400/30">
                            <Calculator className="size-4 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-foreground">
                                Simulador de Cálculo
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Fórmula: <strong className="text-foreground">{formula.name}</strong>
                                {formula.code && (
                                    <span className="ml-1.5 font-mono text-[11px] font-bold text-secondary-700 dark:text-secondary-300">
                                        [{formula.code}]
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3.5 py-2">
                    {/* Expresión de la fórmula */}
                    <div className="rounded-lg border border-border/80 bg-muted/40 p-3 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Expresión:
                            </span>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-muted-foreground">
                                {formula.is_visible ? 'Visible' : 'Interno'}
                            </Badge>
                        </div>
                        <code className="text-xs font-mono font-bold text-primary break-all block bg-background/80 p-2 rounded border border-border/50">
                            {formula.expression}
                        </code>
                    </div>

                    {circularError ? (
                        /* Caso Error: Solo la advertencia de dependencia circular */
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive space-y-1.5">
                            <div className="font-bold flex items-center gap-1.5">
                                <span>⚠️ Dependencia circular detectada</span>
                            </div>
                            <p className="text-[11px] opacity-90 font-mono">
                                {circularError}
                            </p>
                        </div>
                    ) : (
                        /* Caso Normal: Inputs de prueba y resultado simulado */
                        <>
                            {/* Inputs de Variables Dinámicas de prueba */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <VariableIcon className="size-3.5 text-primary" />
                                        Variables de prueba
                                    </span>
                                    {dynamicVariables.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleReset}
                                            className="h-6 text-[11px] text-muted-foreground hover:text-foreground gap-1 px-1.5 cursor-pointer"
                                        >
                                            <RotateCcw className="size-3" />
                                            Restablecer a 0
                                        </Button>
                                    )}
                                </div>

                                {dynamicVariables.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                                        Esta fórmula no requiere variables de entrada manual.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {dynamicVariables.map((varName) => (
                                            <div
                                                key={varName}
                                                className="rounded-md border border-border/80 bg-background p-2 space-y-1"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor={`var-input-${varName}`}
                                                        className="text-[11px] font-mono font-bold text-primary flex items-center gap-1 cursor-pointer"
                                                    >
                                                        ${varName}
                                                    </Label>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        valor
                                                    </span>
                                                </div>
                                                <Input
                                                    id={`var-input-${varName}`}
                                                    type="number"
                                                    step="any"
                                                    value={values[varName] ?? 0}
                                                    onChange={(e) => handleVariableChange(varName, e.target.value)}
                                                    placeholder="0"
                                                    className="h-8 text-xs font-mono font-bold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Constantes fijas del sistema (ej. cambiodolar) */}
                                {staticVariables.length > 0 && (
                                    <div className="space-y-1 pt-0.5">
                                        {staticVariables.map((sv) => (
                                            <div
                                                key={sv.name}
                                                className="flex items-center justify-between rounded-md border border-border/70 bg-muted/40 px-2.5 py-1.5 text-xs"
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono font-bold text-primary">
                                                        ${sv.name}
                                                    </span>
                                                    <span className="text-muted-foreground text-[11px]">
                                                        (constante)
                                                    </span>
                                                </div>
                                                <span className="font-mono font-bold text-foreground bg-background px-2 py-0.5 rounded border border-border/50 text-[11px]">
                                                    {sv.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Fórmulas calculadas de las que depende (en orden secuencial de cálculo) */}
                                {orderedFormulas.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                        {orderedFormulas.map((of) => (
                                            <div
                                                key={of.id}
                                                className="rounded-md border border-secondary-400/30 bg-secondary-50/20 dark:bg-secondary-950/20 p-2 text-xs space-y-1"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono font-bold text-secondary-800 dark:text-secondary-200">
                                                            {of.code}
                                                        </span>
                                                        <span className="text-muted-foreground text-[11px]">
                                                            (fórmula calculada)
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-muted-foreground font-mono">
                                                        depende de:{' '}
                                                        <strong className="text-foreground">
                                                            {(of.variable_names && of.variable_names.length > 0) ? of.variable_names.join(', ') : 'constante'}
                                                        </strong>
                                                    </span>
                                                </div>

                                                {/* Expresión de cálculo de la fórmula previa */}
                                                <div className="text-[11px] font-mono text-muted-foreground bg-background/70 rounded px-2 py-1 border border-border/40 break-all flex items-center justify-between">
                                                    <div>
                                                        <span className="text-secondary-600 dark:text-secondary-400 font-bold mr-1">
                                                            {of.code} =
                                                        </span>
                                                        <span className="text-foreground font-medium">
                                                            {of.expression}
                                                        </span>
                                                    </div>
                                                    {evaluation.intermediateResults[of.code] !== undefined && (
                                                        <span className="text-secondary-700 dark:text-secondary-300 font-bold text-[11px] bg-secondary-100/70 dark:bg-secondary-900/40 px-1.5 py-0.5 rounded ml-2 shrink-0">
                                                            = {evaluation.intermediateResults[of.code]}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Panel de Resultado */}
                            <div className="rounded-xl border border-primary/25 bg-muted/20 p-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        <Sparkles className="size-3.5 text-secondary-500" />
                                        Resultado Simulado
                                    </span>
                                </div>

                                <div className="rounded-lg bg-background border border-primary/15 p-3 flex flex-col items-center justify-center text-center space-y-1">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Valor Calculado
                                    </span>
                                    {evaluation.success ? (
                                        <div className="text-2xl font-black font-mono tracking-tight text-primary">
                                            {evaluation.formattedResult}
                                        </div>
                                    ) : (
                                        <div className="text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1.5 rounded border border-destructive/20 mt-1 max-w-full">
                                            {evaluation.error}
                                        </div>
                                    )}
                                </div>

                                {/* Resumen de variables */}
                                <div className="text-[11px] text-muted-foreground flex flex-wrap gap-1.5 items-center justify-center font-mono pt-1 border-t border-border/40">
                                    {dynamicVariables.map((varName) => (
                                        <span
                                            key={varName}
                                            className="bg-muted px-1.5 py-0.5 rounded border border-border/60 text-[10px]"
                                        >
                                            {varName} = <strong>{values[varName] !== '' ? String(values[varName]) : '0'}</strong>
                                        </span>
                                    ))}
                                    {staticVariables.map((sv) => (
                                        <span
                                            key={sv.name}
                                            className="bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 text-[10px]"
                                        >
                                            {sv.name} = {sv.value}
                                        </span>
                                    ))}
                                    {orderedFormulas.map((of) => (
                                        <span
                                            key={of.code}
                                            className="bg-secondary-500/10 text-secondary-800 dark:text-secondary-300 px-1.5 py-0.5 rounded border border-secondary-400/30 text-[10px]"
                                        >
                                            {of.code} = {evaluation.intermediateResults[of.code] ?? 'calculando...'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="text-xs h-8 cursor-pointer"
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




