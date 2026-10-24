import { Calculator, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormulaItem } from './formula-types';

interface FormulaCardProps {
    formula: FormulaItem;
    index: number;
    onEdit: (formula: FormulaItem) => void;
    onDelete: (id: number) => void;
    onTest: (formula: FormulaItem) => void;
}

export function FormulaCard({ formula, index, onEdit, onDelete, onTest }: FormulaCardProps) {
    return (
        <div className="rounded-lg border border-border/80 bg-background p-3 space-y-2 transition-all hover:border-primary/30">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground font-mono">
                        #{index + 1}
                    </span>
                    <span className="text-xs font-bold tracking-wider text-foreground">
                        {formula.name}
                    </span>
                    {formula.code && (
                        <span className="rounded bg-secondary-500/10 dark:bg-secondary-950/40 border border-secondary-400/30 px-1.5 py-0.2 font-mono text-[10px] font-bold text-secondary-800 dark:text-secondary-200" title="Identificador de variable para otras fórmulas">
                            {formula.code}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {formula.is_visible ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] gap-1 font-medium">
                            <Eye className="size-3" />
                            Visible en Cotización
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="text-slate-500 bg-slate-50 dark:bg-slate-900 text-[10px] gap-1 font-medium"
                        >
                            <EyeOff className="size-3" />
                            Cálculo Interno
                        </Badge>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onTest(formula)}
                        className="size-7 text-muted-foreground hover:text-secondary-600 dark:hover:text-secondary-400 cursor-pointer"
                        title="Simular / Probar cálculo (Sandbox)"
                    >
                        <Calculator className="size-3.5" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(formula)}
                        className="size-7 text-muted-foreground hover:text-primary cursor-pointer"
                        title="Editar fórmula"
                    >
                        <Pencil className="size-3.5" />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(formula.id)}
                        className="size-7 text-muted-foreground hover:text-red-600 cursor-pointer"
                        title="Eliminar fórmula"
                    >
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* Expresión Matemática */}
            <div className="rounded-md bg-muted/40 px-3 py-1.5 border border-border/50">
                <code className="text-xs font-mono font-bold text-primary break-all">
                    {formula.expression}
                </code>
            </div>

            {/* Variables Detectadas en esta Fórmula */}
            <div className="flex items-center gap-2 text-[11px] pt-0.5">
                <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                    Variables:
                </span>
                <div className="flex flex-wrap gap-1">
                    {(formula.variable_names ?? []).length === 0 ? (
                        <span className="text-[10px] text-muted-foreground italic">
                            Sin variables
                        </span>
                    ) : (
                        (formula.variable_names ?? []).map((varName) => (
                            <span
                                key={varName}
                                className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-primary"
                            >
                                {varName}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Alias para mantener compatibilidad si se importa con el nombre anterior
export { FormulaCard as FormulaItem };
