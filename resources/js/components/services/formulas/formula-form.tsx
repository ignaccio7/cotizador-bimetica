import { Form } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, X } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import formulasRoute from '@/routes/services/formulas';
import { FormulaAssistant } from './formula-assistant';
import { resolveFormulaDependencies } from '@/lib/formula-validator';
import { FormulaItem } from './formula-types';

interface FormulaFormProps {
    serviceId: number;
    initialFormula?: FormulaItem | null;
    availableVariableNames?: string[];
    allFormulas?: FormulaItem[];
    onSuccess: () => void;
    onCancel: () => void;
}

function toSnakeCase(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

export function FormulaForm({
    serviceId,
    initialFormula = null,
    availableVariableNames = ['m2', 'pozos', 'complejidad', 'cambiodolar'],
    allFormulas = [],
    onSuccess,
    onCancel,
}: FormulaFormProps) {
    const isEditing = Boolean(initialFormula);

    const [name, setName] = useState(initialFormula?.name ?? '');
    const [code, setCode] = useState(initialFormula?.code ?? '');
    const [isCodeCustomized, setIsCodeCustomized] = useState(Boolean(initialFormula?.code));
    const [expression, setExpression] = useState(initialFormula?.expression ?? '');
    const [isVisible, setIsVisible] = useState(initialFormula?.is_visible ?? true);

    // Otras fórmulas del servicio (excluyendo la que estamos editando si es edición)
    const otherFormulas = allFormulas.filter((f) => !initialFormula || f.id !== initialFormula.id);
    const otherFormulaCodes = otherFormulas.map((f) => f.code).filter(Boolean);

    // Fórmulas que usan directamente este código en su expresión
    const disabledFormulaCodes = !code.trim()
        ? []
        : otherFormulas
            .filter((of) => of.code && new RegExp(`\\b${code}\\b`, 'i').test(of.expression))
            .map((of) => of.code);

    // Para detectar si la expresión actual cierra un ciclo, el conjunto total de fórmulas
    // del servicio debe incluir la fórmula que estamos editando en tiempo real
    const currentEditingFormula = {
        id: initialFormula?.id ?? 'temp',
        code: code.trim(),
        expression: expression.trim(),
    };
    const allServiceFormulas = [currentEditingFormula, ...otherFormulas];

    const circularError = (!code.trim() || !expression.trim())
        ? undefined
        : resolveFormulaDependencies(currentEditingFormula, allServiceFormulas).circularError;

    // Todas las variables posibles que pueden intervenir en la expresión
    const allAvailableIdentifiers = Array.from(new Set([...availableVariableNames, ...otherFormulaCodes]));

    // Detección automática en tiempo real de variables presentes en la expresión
    const detectedVariables = !expression.trim()
        ? []
        : allAvailableIdentifiers.filter((varName) => {
            const regex = new RegExp(`\\b${varName}\\b|\\{${varName}\\}`, 'i');
            return regex.test(expression);
        });

    // Al tipear el nombre, auto-sugerir el código/variable en snake_case si no fue personalizado
    const handleNameChange = (val: string) => {
        setName(val);
        if (!isEditing && !isCodeCustomized) {
            setCode(toSnakeCase(val));
        }
    };

    // Al editar manualmente el código, forzar solo caracteres válidos: a-z, 0-9 y _
    const handleCodeChange = (val: string) => {
        setIsCodeCustomized(true);
        setCode(val.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    };

    // Función para insertar variable en la expresión activa
    const handleInsertVariable = (varName: string) => {
        setExpression((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return varName;
            const lastChar = trimmed.slice(-1);
            if (['+', '-', '*', '/', '?', ':', '(', '<', '>', '=', ','].includes(lastChar)) {
                return `${trimmed} ${varName}`;
            }
            return `${trimmed} * ${varName}`;
        });
    };

    // Función para insertar operadores matemáticos y comparaciones
    const handleInsertOperator = (op: string) => {
        setExpression((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) {
                if (op === '-' || op === '(') return op;
                return '';
            }
            const lastChar = trimmed.slice(-1);
            if (['+', '-', '*', '/', '<', '>', '=', '?', ':'].includes(lastChar)) {
                return `${trimmed.slice(0, -1)} ${op} `;
            }
            return `${trimmed} ${op} `;
        });
    };

    // Función para envolver o insertar paréntesis
    const handleInsertParentheses = () => {
        setExpression((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return '( )';
            return `(${trimmed})`;
        });
    };

    // Función para insertar condición de rango if/else ternario
    const handleInsertTernary = () => {
        setExpression((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) {
                return 'condicion ? si : no';
            }
            return `${trimmed} ?  : `;
        });
    };

    // Función para insertar o envolver en funciones matemáticas (ceil, floor, round, fix)
    const handleInsertFunction = (fn: 'ceil' | 'floor' | 'round' | 'fix') => {
        setExpression((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) {
                if (fn === 'round') return 'round( , 2)';
                return `${fn}()`;
            }
            if (fn === 'round') {
                return `round(${trimmed}, 2)`;
            }
            return `${fn}(${trimmed})`;
        });
    };

    const formAction = isEditing && initialFormula
        ? formulasRoute.update.form({ service: serviceId, formula: initialFormula.id })
        : formulasRoute.store.form({ service: serviceId });

    return (
        <div className="rounded-xl border border-secondary-500/40 bg-secondary-50/30 dark:bg-secondary-950/20 p-4 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-secondary-500/20 pb-2">
                <span className="text-xs font-bold tracking-wider text-secondary-950 dark:text-secondary-100 flex items-center gap-1.5">
                    {isEditing ? (
                        <>
                            <Pencil className="size-3.5 text-secondary-600" />
                            Editar Fórmula de Cotización
                        </>
                    ) : (
                        <>
                            <Plus className="size-3.5 text-secondary-600" />
                            Configurar Nueva Fórmula de Cotización
                        </>
                    )}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    <X className="size-3.5" />
                </Button>
            </div>

            <Form
                key={isEditing ? `edit-formula-${initialFormula?.id}` : 'create-formula'}
                {...formAction}
                onSubmit={(e) => {
                    if (circularError) {
                        e.preventDefault();
                    }
                }}
                onSuccess={() => onSuccess()}
                className="space-y-3.5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                            {/* Nombre / Cabecera Visual */}
                            <div className="sm:col-span-5">
                                <div className="h-5 flex items-center">
                                    <Label htmlFor="formula-name-input" className="text-xs">
                                        Nombre / Cabecera de la Columna
                                    </Label>
                                </div>
                                <Input
                                    id="formula-name-input"
                                    name="name"
                                    value={name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="ej. Bs / m2, Inversión Bs."
                                    className="mt-1 h-8 text-xs font-medium"
                                    autoFocus
                                    required
                                />
                                <InputError message={errors.name} className="mt-1 text-[11px]" />
                            </div>

                            {/* Identificador / Variable para fórmulas siguientes */}
                            <div className="sm:col-span-4">
                                <div className="h-5 flex items-center justify-between">
                                    <Label htmlFor="formula-code-input" className="text-xs">
                                        Identificador (Variable)
                                    </Label>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        [a-z0-9_]
                                    </span>
                                </div>
                                <Input
                                    id="formula-code-input"
                                    name="code"
                                    value={code}
                                    onChange={(e) => handleCodeChange(e.target.value)}
                                    placeholder="ej. bs_m2, inversion_bs"
                                    className="mt-1 h-8 font-mono text-xs font-medium placeholder:font-sans placeholder:font-normal text-secondary-900 dark:text-secondary-100 bg-background"
                                    required
                                />
                                <InputError message={errors.code} className="mt-1 text-[11px]" />
                            </div>

                            {/* Visibilidad en Cotización */}
                            <div className="sm:col-span-3">
                                <div className="h-5 flex items-center">
                                    <Label className="text-xs">Visibilidad</Label>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsVisible(!isVisible)}
                                        className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                                            isVisible
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold'
                                                : 'border-border bg-background text-muted-foreground'
                                        }`}
                                    >
                                        {isVisible ? (
                                            <>
                                                <Eye className="size-3.5 text-emerald-600" />
                                                Visible
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="size-3.5 text-slate-500" />
                                                Interno
                                            </>
                                        )}
                                    </button>
                                </div>
                                <input type="hidden" name="is_visible" value={isVisible ? 1 : 0} />
                            </div>
                        </div>

                        {/* Campo de Expresión */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <Label htmlFor="formula-expr-input" className="text-xs">
                                    Expresión Matemática de Cálculo
                                </Label>
                                <span className="text-[10px] text-muted-foreground">
                                    Usa nombres de variables globales o fórmulas previas
                                </span>
                            </div>
                            <Input
                                id="formula-expr-input"
                                name="expression"
                                value={expression}
                                onChange={(e) => setExpression(e.target.value)}
                                placeholder="ej. m2 < 30 ? 1600 : ceil(m2 * bs_m2)"
                                className="h-9 font-mono text-xs font-bold text-primary bg-background"
                                required
                            />
                            <InputError message={errors.expression} className="mt-1 text-[11px]" />
                            {circularError && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive space-y-0.5 mt-1.5">
                                    <span className="font-bold flex items-center gap-1">
                                        ⚠️ Dependencia circular detectada:
                                    </span>
                                    <p className="text-[11px] opacity-90 font-mono">{circularError}</p>
                                </div>
                            )}
                        </div>

                        {/* Variables detectadas serializadas para el backend */}
                        {detectedVariables.map((varName, idx) => (
                            <input
                                key={varName}
                                type="hidden"
                                name={`variable_names[${idx}]`}
                                value={varName}
                            />
                        ))}

                        {/* Asistente Modular de Inserción Rápida con soporte a Fórmulas Previas */}
                        <FormulaAssistant
                            availableVariableNames={availableVariableNames}
                            otherFormulaCodes={otherFormulaCodes}
                            disabledFormulaCodes={disabledFormulaCodes}
                            detectedVariables={detectedVariables}
                            onInsertVariable={handleInsertVariable}
                            onInsertOperator={handleInsertOperator}
                            onInsertParentheses={handleInsertParentheses}
                            onInsertTernary={handleInsertTernary}
                            onInsertFunction={handleInsertFunction}
                        />

                        {/* Botones de Confirmación */}
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-secondary-500/20">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                                className="text-xs h-8 cursor-pointer"
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={processing || Boolean(circularError) || !name.trim() || !code.trim() || !expression.trim()}
                                className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold text-xs h-8 cursor-pointer"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : isEditing
                                    ? 'Guardar Cambios'
                                    : 'Guardar Fórmula'}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
