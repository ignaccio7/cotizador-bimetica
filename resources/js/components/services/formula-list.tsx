import { useState, useMemo } from 'react';
import {
    Calculator,
    Check,
    Code2,
    Eye,
    EyeOff,
    Info,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FormulaMock {
    id: number;
    name: string;
    expression: string;
    is_visible: boolean;
    variable_names: string[];
}

export const MOCK_FORMULAS: FormulaMock[] = [
    {
        id: 1,
        name: 'BS /M2',
        expression: '18 * (complejidad == "alto" ? 1.3 : 1.0)',
        is_visible: true,
        variable_names: ['complejidad'],
    },
    {
        id: 2,
        name: 'INVERSIÓN BS.',
        expression: 'm2 < 30 ? 1600 : ceil(m2 * 18)',
        is_visible: true,
        variable_names: ['m2'],
    },
    {
        id: 3,
        name: 'COSTO USD',
        expression: 'round(inversion_bs / cambiodolar, 2)',
        is_visible: false,
        variable_names: ['cambiodolar'],
    },
];

interface FormulaListProps {
    formulas?: FormulaMock[];
    serviceName?: string;
    availableVariableNames?: string[];
    onFormulaListChange?: (formulas: FormulaMock[]) => void;
}

export function FormulaList({
    formulas: initialFormulas = MOCK_FORMULAS,
    serviceName = 'Servicio',
    availableVariableNames = ['m2', 'pozos', 'complejidad', 'cambiodolar'],
}: FormulaListProps) {
    const [formulas, setFormulas] = useState<FormulaMock[]>(initialFormulas);
    const [isAddingFormula, setIsAddingFormula] = useState(false);

    // Estado del formulario de nueva fórmula (UI interactiva)
    const [newName, setNewName] = useState('');
    const [newExpression, setNewExpression] = useState('');
    const [newIsVisible, setNewIsVisible] = useState(true);

    // Detección automática en tiempo real de variables presentes en la expresión
    const detectedVariables = useMemo(() => {
        if (!newExpression.trim()) return [];
        // Busca palabras completas o patrones {variable} que coincidan con las variables del catálogo
        return availableVariableNames.filter((varName) => {
            const regex = new RegExp(`\\b${varName}\\b|\\{${varName}\\}`, 'i');
            return regex.test(newExpression);
        });
    }, [newExpression, availableVariableNames]);

    // Función para insertar variable en la expresión activa
    const handleInsertVariable = (varName: string) => {
        setNewExpression((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return varName;
            // Si el último caracter es un operador matemático, añadimos espacio
            const lastChar = trimmed.slice(-1);
            if (['+', '-', '*', '/', '?', ':', '(', '<', '>', '='].includes(lastChar)) {
                return `${trimmed} ${varName}`;
            }
            return `${trimmed} * ${varName}`;
        });
    };

    const handleSaveNewFormula = () => {
        if (!newName.trim() || !newExpression.trim()) return;

        const newFormula: FormulaMock = {
            id: Date.now(),
            name: newName.trim().toUpperCase(),
            expression: newExpression.trim(),
            is_visible: newIsVisible,
            variable_names: detectedVariables,
        };

        setFormulas([...formulas, newFormula]);
        setNewName('');
        setNewExpression('');
        setNewIsVisible(true);
        setIsAddingFormula(false);
    };

    const handleDeleteFormula = (id: number) => {
        setFormulas(formulas.filter((f) => f.id !== id));
    };

    return (
        <Card className="border shadow-xs bg-card">
            <CardHeader className="border-b bg-muted/20 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Calculator className="size-4 text-primary" />
                        <div>
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                                Fórmulas del Servicio: {serviceName} ({formulas.length})
                            </CardTitle>
                            <p className="text-[11px] text-muted-foreground">
                                Cada fórmula calcula un valor del servicio. Las visibles se muestran como columnas en la cotización.
                            </p>
                        </div>
                    </div>

                    {!isAddingFormula && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsAddingFormula(true)}
                            className="bg-primary text-primary-foreground font-semibold text-xs h-8 shadow-xs hover:bg-primary/90 cursor-pointer"
                        >
                            <Plus className="mr-1.5 size-3.5" />
                            Nueva Fórmula
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {/* Formulario Interactivo para Crear/Editar Fórmula */}
                {isAddingFormula && (
                    <div className="rounded-xl border border-secondary-500/40 bg-secondary-50/30 dark:bg-secondary-950/20 p-4 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between border-b border-secondary-500/20 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-secondary-950 dark:text-secondary-100 flex items-center gap-1.5">
                                <Plus className="size-3.5 text-secondary-600" />
                                Configurar Nueva Fórmula de Cotización
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsAddingFormula(false)}
                                className="size-6 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                                <Label htmlFor="new-formula-name" className="text-xs">
                                    Nombre / Cabecera de la Columna
                                </Label>
                                <Input
                                    id="new-formula-name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="ej. BS /M2, INVERSIÓN BS., METRADO BASE"
                                    className="mt-1 h-8 text-xs font-bold uppercase"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <Label className="text-xs">Visibilidad en Cotización</Label>
                                <div className="mt-1 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewIsVisible(!newIsVisible)}
                                        className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                                            newIsVisible
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold'
                                                : 'border-border bg-background text-muted-foreground'
                                        }`}
                                    >
                                        {newIsVisible ? (
                                            <>
                                                <Eye className="size-3.5 text-emerald-600" />
                                                Visible en Tabla
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="size-3.5 text-slate-500" />
                                                Cálculo Interno
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Campo de Expresión */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <Label htmlFor="new-formula-expr" className="text-xs">
                                    Expresión Matemática de Cálculo
                                </Label>
                                <span className="text-[10px] text-muted-foreground">
                                    Usa nombres de variable directamente (ej: <code>m2 * 20</code>)
                                </span>
                            </div>
                            <Input
                                id="new-formula-expr"
                                value={newExpression}
                                onChange={(e) => setNewExpression(e.target.value)}
                                placeholder="ej. m2 < 30 ? 1600 : m2 * 18"
                                className="h-9 font-mono text-xs font-bold text-primary bg-background"
                            />
                        </div>

                        {/* Asistente: Botonera de Inserción Rápida de Variables */}
                        <div className="rounded-lg border border-border/60 bg-background/80 p-2.5 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                                    <Info className="size-3 text-primary" />
                                    Haz clic para insertar una variable en la expresión:
                                </span>
                                {detectedVariables.length > 0 && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                        Detectadas: {detectedVariables.join(', ')}
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
                                            onClick={() => handleInsertVariable(varName)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-medium border transition-colors cursor-pointer ${
                                                isUsed
                                                    ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                                                    : 'bg-muted/50 hover:bg-muted text-foreground border-border hover:border-primary/40'
                                            }`}
                                        >
                                            <Plus className="size-3 text-muted-foreground" />
                                            <span>{varName}</span>
                                            {isUsed && <Check className="size-3 ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botones de Confirmación */}
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-secondary-500/20">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddingFormula(false)}
                                className="text-xs h-8"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleSaveNewFormula}
                                disabled={!newName.trim() || !newExpression.trim()}
                                className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold text-xs h-8 cursor-pointer"
                            >
                                Guardar Fórmula
                            </Button>
                        </div>
                    </div>
                )}

                {/* Lista de Fórmulas Existentes */}
                {formulas.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                        No hay fórmulas configuradas para este servicio. Haz clic en "Nueva Fórmula" para crear la primera.
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {formulas.map((formula, index) => (
                            <div
                                key={formula.id}
                                className="rounded-lg border border-border/80 bg-background p-3 space-y-2 transition-all hover:border-primary/30"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-muted-foreground font-mono">
                                            #{index + 1}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                            {formula.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {formula.is_visible ? (
                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] gap-1 font-medium">
                                                <Eye className="size-3" />
                                                Visible en Cotización
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-slate-500 bg-slate-50 dark:bg-slate-900 text-[10px] gap-1 font-medium">
                                                <EyeOff className="size-3" />
                                                Cálculo Interno
                                            </Badge>
                                        )}

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteFormula(formula.id)}
                                            className="size-7 text-muted-foreground hover:text-red-600 cursor-pointer"
                                            title="Eliminar fórmula"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Expresión Matemática */}
                                <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-1.5 border border-border/50">
                                    <Code2 className="size-3.5 text-primary shrink-0" />
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
                                        {formula.variable_names.map((varName) => (
                                            <span
                                                key={varName}
                                                className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-primary"
                                            >
                                                {varName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
