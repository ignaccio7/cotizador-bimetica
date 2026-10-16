import { Form } from '@inertiajs/react';
import {
    Calculator,
    Check,
    Eye,
    EyeOff,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { slugifyFormulaName } from '@/lib/formula-evaluator';
import formulasRoute from '@/routes/services/formulas';
import type { FormulaItem, ServiceItem, VariableItem } from '@/types';

interface FormulaListProps {
    service: ServiceItem;
    availableVariables: VariableItem[];
}

export function FormulaList({ service, availableVariables }: FormulaListProps) {
    const [formulas, setFormulas] = useState<FormulaItem[]>([]);

    // Sincronizar fórmulas cuando cambia el servicio seleccionado
    useEffect(() => {
        if (service && service.formulas) {
            setFormulas(
                service.formulas.map((f) => ({
                    id: f.id,
                    name: f.name,
                    expression: f.expression,
                    is_visible: f.is_visible,
                    variable_ids: [...f.variable_ids],
                }))
            );
        } else {
            setFormulas([]);
        }
    }, [service.id, service.formulas]);

    const handleAddFormula = () => {
        const newFormula: FormulaItem = {
            name: `COLUMNA ${formulas.length + 1}`,
            expression: '',
            is_visible: true,
            variable_ids: [],
        };
        setFormulas([...formulas, newFormula]);
    };

    const handleRemoveFormula = (index: number) => {
        setFormulas(formulas.filter((_, idx) => idx !== index));
    };

    const handleUpdateField = <K extends keyof FormulaItem>(
        index: number,
        field: K,
        value: FormulaItem[K]
    ) => {
        setFormulas((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    // Insertar token (variable, operador o función) en la expresión activa
    const handleInsertToken = (formulaIndex: number, token: string) => {
        setFormulas((prev) => {
            const next = [...prev];
            const currentExpr = next[formulaIndex].expression.trim();

            const trimmed = currentExpr.trim();
            const lastChar = trimmed.slice(-1);

            const isOperator = ['+', '-', '*', '/', '?', ':', '<', '>', '<=', '==', '? :'].includes(token);
            let newExpr = '';

            if (!trimmed) {
                newExpr = token;
            } else if (isOperator) {
                // Si el token a insertar es un operador (+, -, *, /, <, etc.)
                if (['+', '-', '*', '/', '<', '>', '='].includes(lastChar)) {
                    // Si ya había un operador previo, lo sustituye limpiamente
                    newExpr = `${trimmed.slice(0, -1).trimEnd()} ${token} `;
                } else {
                    newExpr = `${trimmed} ${token} `;
                }
            } else if (token === 'ceil()' || token === 'round()') {
                // Funciones matemáticas
                if (['+', '-', '*', '/', '?', ':', '(', '<', '>', '='].includes(lastChar)) {
                    newExpr = `${trimmed} ${token}`;
                } else {
                    newExpr = `${trimmed} * ${token}`;
                }
            } else {
                // Es una variable (ej: m2, pozos, complejidad)
                if (['+', '-', '*', '/', '?', ':', '(', '<', '>', '='].includes(lastChar)) {
                    newExpr = `${trimmed} ${token}`;
                } else {
                    newExpr = `${trimmed} * ${token}`;
                }
            }

            next[formulaIndex] = {
                ...next[formulaIndex],
                expression: newExpr,
            };
            return next;
        });
    };

    // Detección automática en segundo plano de las variables presentes en la expresión
    const getDetectedVariableIds = (expression: string): number[] => {
        if (!expression) return [];
        return availableVariables
            .filter((v) => new RegExp(`\\b${v.name}\\b`, 'i').test(expression))
            .map((v) => v.id);
    };

    return (
        <Form
            key={`formulas-form-${service.id}`}
            {...formulasRoute.update.form({ service: service.id })}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <Card className="border-border bg-card shadow-xs">
                        <CardHeader className="border-b border-border/80 pb-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                        <Calculator className="size-4 text-primary" />
                                        Fórmulas y Columnas — {service.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                                        Define las columnas calculadas de la cotización usando variables matemáticas y operadores.
                                    </CardDescription>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleAddFormula}
                                    size="sm"
                                    variant="outline"
                                    className="border-primary/30 text-primary hover:bg-primary/5 cursor-pointer text-xs font-semibold shrink-0"
                                >
                                    <Plus className="mr-1.5 size-3.5" />
                                    Agregar Columna
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4">
                            <InputError message={errors.formulas} />

                            {formulas.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                                    <Calculator className="mx-auto size-8 text-muted-foreground/60 mb-2" />
                                    <p className="text-xs font-semibold text-foreground">
                                        No hay fórmulas configuradas para este servicio
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-1 mb-3">
                                        Agrega una columna calculada (ej. <code>ARANCEL /M2</code> o <code>INVERSIÓN BS.</code>).
                                    </p>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleAddFormula}
                                        className="bg-primary text-primary-foreground font-semibold text-xs cursor-pointer"
                                    >
                                        <Plus className="mr-1.5 size-3.5" />
                                        Agregar Primera Columna
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formulas.map((formula, idx) => {
                                        const detectedVarIds = getDetectedVariableIds(formula.expression);
                                        const thisSlug = slugifyFormulaName(formula.name);

                                        return (
                                            <div
                                                key={formula.id ? `formula-${formula.id}` : `new-formula-${idx}`}
                                                className="group relative rounded-xl border border-border bg-muted/10 p-4 space-y-3 transition-colors hover:border-primary/40"
                                            >
                                                {/* Campos ocultos serializados */}
                                                {formula.id && (
                                                    <input
                                                        type="hidden"
                                                        name={`formulas[${idx}][id]`}
                                                        value={formula.id}
                                                    />
                                                )}
                                                <input
                                                    type="hidden"
                                                    name={`formulas[${idx}][name]`}
                                                    value={formula.name}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`formulas[${idx}][expression]`}
                                                    value={formula.expression}
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`formulas[${idx}][is_visible]`}
                                                    value={formula.is_visible ? '1' : '0'}
                                                />
                                                {/* Vinculación automática en base a variables usadas */}
                                                {detectedVarIds.map((vId) => (
                                                    <input
                                                        key={`hidden-var-${idx}-${vId}`}
                                                        type="hidden"
                                                        name={`formulas[${idx}][variable_ids][]`}
                                                        value={vId}
                                                    />
                                                ))}

                                                {/* Cabecera de la Columna / Fórmula */}
                                                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-bold text-primary shrink-0">
                                                            #{idx + 1}
                                                        </span>
                                                        <div className="flex-1 space-y-1">
                                                            <Input
                                                                value={formula.name}
                                                                onChange={(e) =>
                                                                    handleUpdateField(idx, 'name', e.target.value)
                                                                }
                                                                placeholder="ej. ARANCEL /M2, INVERSIÓN BS."
                                                                className="h-8 font-bold text-xs uppercase"
                                                                required
                                                            />
                                                            {thisSlug && (
                                                                <span className="text-[10px] text-muted-foreground font-mono block">
                                                                    Identificador en fórmulas:{' '}
                                                                    <code className="text-primary font-bold bg-primary/10 px-1 py-0.5 rounded">
                                                                        {thisSlug}
                                                                    </code>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {/* Toggle Visibilidad en Tabla */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateField(
                                                                    idx,
                                                                    'is_visible',
                                                                    !formula.is_visible
                                                                )
                                                            }
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                                                                formula.is_visible
                                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                    : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                                                            }`}
                                                            title={
                                                                formula.is_visible
                                                                    ? 'Visible en la tabla de cotización del cliente'
                                                                    : 'Cálculo interno intermedio (oculto en la tabla)'
                                                            }
                                                        >
                                                            {formula.is_visible ? (
                                                                <>
                                                                    <Eye className="size-3.5 text-emerald-600" />
                                                                    <span>Visible en Tabla</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <EyeOff className="size-3.5 text-slate-500" />
                                                                    <span>Cálculo Interno</span>
                                                                </>
                                                            )}
                                                        </button>

                                                        {/* Botón Eliminar Fila */}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveFormula(idx)}
                                                            className="size-7 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 cursor-pointer"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expresión Matemática y Asistente Simple */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-semibold text-foreground">
                                                            Expresión Matemática
                                                        </Label>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            Usa condición if/else con <code>condición ? valor_si : valor_no</code>
                                                        </span>
                                                    </div>

                                                    <Input
                                                        value={formula.expression}
                                                        onChange={(e) =>
                                                            handleUpdateField(
                                                                idx,
                                                                'expression',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="ej. m2 < 30 ? 19 : 12   ó   m2 <= 20 ? 600 : ceil(m2 * arancel_m2)"
                                                        className="font-mono text-xs font-bold text-primary h-8 bg-background"
                                                        required
                                                    />

                                                    {/* Botonera de Inserción Rápida */}
                                                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                        <span className="text-[10px] font-medium text-muted-foreground mr-1">
                                                            Insertar variable:
                                                        </span>
                                                        {availableVariables.map((v) => (
                                                            <button
                                                                key={`btn-var-${idx}-${v.id}`}
                                                                type="button"
                                                                onClick={() => handleInsertToken(idx, v.name)}
                                                                className="inline-flex items-center gap-0.5 rounded bg-secondary-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary-900 border border-secondary-300 hover:bg-secondary-100 transition-colors cursor-pointer dark:bg-secondary-950/40 dark:text-secondary-200 dark:border-secondary-800"
                                                            >
                                                                <Plus className="size-2.5 text-secondary-600" />
                                                                {v.name}
                                                            </button>
                                                        ))}

                                                        <span className="text-[10px] font-medium text-muted-foreground mx-1">
                                                            Operadores y funciones:
                                                        </span>
                                                        {['ceil()', 'round()', '? :', '*', '/', '+', '-', '<', '>', '<=', '=='].map(
                                                            (op) => (
                                                                <button
                                                                    key={`btn-op-${idx}-${op}`}
                                                                    type="button"
                                                                    onClick={() => handleInsertToken(idx, op)}
                                                                    className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground border border-border hover:bg-muted/80 transition-colors cursor-pointer"
                                                                >
                                                                    {op}
                                                                </button>
                                                            )
                                                        )}
                                                    </div>

                                                    {/* Botones de Columnas Calculadas Anteriores */}
                                                    {idx > 0 && (
                                                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 mt-1 border-t border-border/40">
                                                            <span className="text-[10px] font-medium text-muted-foreground mr-1">
                                                                Usar resultado de columna anterior:
                                                            </span>
                                                            {formulas.slice(0, idx).map((prevF, pIdx) => {
                                                                const prevSlug = slugifyFormulaName(prevF.name);
                                                                if (!prevSlug) return null;
                                                                return (
                                                                    <button
                                                                        key={`btn-prev-formula-${idx}-${pIdx}`}
                                                                        type="button"
                                                                        onClick={() => handleInsertToken(idx, prevSlug)}
                                                                        className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary border border-primary/25 hover:bg-primary/20 transition-colors cursor-pointer"
                                                                        title={`Insertar el resultado calculado de la columna #${pIdx + 1}: ${prevF.name}`}
                                                                    >
                                                                        <Plus className="size-2.5 text-primary" />
                                                                        {prevSlug}
                                                                        <span className="text-[9px] font-normal opacity-70">
                                                                            (#{pIdx + 1} {prevF.name})
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botón de Guardado */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground">
                            Los cambios se guardarán y las variables se vincularán automáticamente.
                        </span>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs cursor-pointer"
                        >
                            <Check className="mr-1.5 size-4" />
                            {processing ? 'Guardando...' : 'Guardar Fórmulas'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
