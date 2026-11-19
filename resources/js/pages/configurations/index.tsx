import { Form, Head, usePage } from '@inertiajs/react';
import { AlertCircle, Check, Calculator, DraftingCompass, Sparkles, Variable } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { evaluateFormula } from '@/lib/formula-engine';
import { cn } from '@/lib/utils';
import configurations from '@/routes/configurations';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración General',
        href: configurations.index(),
    },
];

export interface SettingItem {
    id: number;
    key: string;
    value: string;
    type: string;
    label: string;
    description?: string | null;
}

export interface AvailableParameterItem {
    id: number;
    group: string;
    group_label?: string | null;
    scope: 'total' | 'global';
    name: string;
    type: string;
    value: string | number;
}

interface Props {
    totalFormulaSetting?: SettingItem | null;
    availableParameters?: AvailableParameterItem[];
}

export default function ConfigurationsIndex({
    totalFormulaSetting,
    availableParameters = [],
}: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    // Valor reactivo de la fórmula para alimentar el simulador en tiempo real
    const initialFormula = totalFormulaSetting?.value ?? 'services_subtotal';

    const [formulaValue, setFormulaValue] = useState<string>(initialFormula);
    const inputRef = useRef<HTMLInputElement>(null);

    // Parámetros de prueba para el simulador interactivo
    const [simSubtotal, setSimSubtotal] = useState<number>(10000);
    const [simValues, setSimValues] = useState<Record<string, number>>({});

    // Agrupar los parámetros disponibles únicos (con scope 'total' o 'global')
    const parameterGroups = useMemo(() => {
        const map = new Map<
            string,
            { group: string; label: string; scope: 'total' | 'global'; defaultValue: number }
        >();
        availableParameters.forEach((p) => {
            if (!map.has(p.group)) {
                map.set(p.group, {
                    group: p.group,
                    label: p.group_label || p.group,
                    scope: p.scope,
                    defaultValue: parseFloat(String(p.value)) || 0,
                });
            }
        });
        return Array.from(map.values());
    }, [availableParameters]);

    // Scope de simulación dinámico
    const simScope = useMemo(() => {
        const scope: Record<string, number | string | boolean> = {
            services_subtotal: Number(simSubtotal) || 0,
        };
        parameterGroups.forEach((pg) => {
            scope[pg.group] = simValues[pg.group] ?? pg.defaultValue;
        });
        return scope;
    }, [simSubtotal, parameterGroups, simValues]);

    // Evaluación en vivo con Math.js para el simulador informativo
    const simResult = useMemo(() => {
        return evaluateFormula(formulaValue, simScope);
    }, [formulaValue, simScope]);

    // Función para insertar un chip (variable u operador) en la posición del cursor
    const handleInsertToken = (token: string) => {
        const input = inputRef.current;
        if (!input) {
            setFormulaValue((prev) => `${prev} ${token}`.trim());
            return;
        }

        const start = input.selectionStart ?? formulaValue.length;
        const end = input.selectionEnd ?? formulaValue.length;
        const before = formulaValue.substring(0, start);
        const after = formulaValue.substring(end);

        const needsSpaceBefore = before.length > 0 && !before.endsWith(' ');
        const needsSpaceAfter = after.length > 0 && !after.startsWith(' ');

        const insertText = `${needsSpaceBefore ? ' ' : ''}${token}${needsSpaceAfter ? ' ' : ''}`;
        const newFormula = `${before}${insertText}${after}`;

        setFormulaValue(newFormula);

        setTimeout(() => {
            const nextCursor = start + insertText.length;
            input.focus();
            input.setSelectionRange(nextCursor, nextCursor);
        }, 0);
    };

    return (
        <>
            <Head title="Configuración del Sistema" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200 max-w-7xl w-full">
                {/* Mensajes Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                        <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Cabecera Institucional */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/60">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                            <DraftingCompass className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                                Configuración del Sistema
                                <Badge variant="outline" className="text-[11px] font-semibold text-secondary-600 border-secondary-500/30 bg-secondary-500/5">
                                    Administración
                                </Badge>
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Gestiona las reglas de cálculo globales y parámetros institucionales del Cotizador Bimetica.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de la Fórmula del Total */}
                <Card className="border border-border shadow-xs overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calculator className="size-5 text-primary" />
                                <CardTitle className="text-base font-bold text-foreground">
                                    Fórmula del Total General de Cotización
                                </CardTitle>
                            </div>
                            <Badge className="bg-primary text-white text-[10px] font-mono tracking-wider">
                                Math.js Engine
                            </Badge>
                        </div>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                            {totalFormulaSetting?.description ??
                                'Expresión matemática utilizada para computar el valor final de la cotización en base al subtotal de servicios y los descuentos comerciales aplicados.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                        {/* Formulario conectado a Wayfinder */}
                        <Form
                            {...configurations.update.form({
                                key: totalFormulaSetting?.key ?? 'quote_total_formula',
                            })}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Campo de Entrada de la Expresión */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="formula-value" className="text-xs font-bold text-foreground">
                                                Expresión de Cálculo
                                            </Label>
                                            <span className="text-[11px] text-muted-foreground font-mono">
                                                Variable clave: {totalFormulaSetting?.key ?? 'quote_total_formula'}
                                            </span>
                                        </div>

                                        <Input
                                            ref={inputRef}
                                            id="formula-value"
                                            name="value"
                                            value={formulaValue}
                                            onChange={(e) => setFormulaValue(e.target.value)}
                                            placeholder="ej. services_subtotal - (services_subtotal * (discount / 100))"
                                            className="font-mono text-xs sm:text-sm tracking-wide bg-background border-input focus:ring-1 focus:ring-primary h-11"
                                            required
                                        />
                                        <InputError message={errors.value} />
                                    </div>

                                    {/* Paleta de Variables y Operadores (Chips Clickeables) */}
                                    <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/60">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                            <Variable className="size-4 text-primary" />
                                            <span>Variables y Operadores Disponibles</span>
                                            <span className="text-[11px] text-muted-foreground font-normal ml-1">
                                                (Haz clic en un chip para insertarlo en la fórmula)
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {/* Variables Principales (Generadas dinámicamente según scope 'total' y 'global') */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleInsertToken('services_subtotal')}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                                                    title="Suma total de todos los servicios cotizados (Base Obligatoria)"
                                                >
                                                    <span className="font-bold">+</span> services_subtotal
                                                    <span className="text-[10px] text-muted-foreground ml-1 font-sans">(Subtotal Servicios)</span>
                                                    <Badge variant="outline" className="text-[9px] px-1 py-0 uppercase font-sans tracking-wider border-primary/30 text-primary">
                                                        Base
                                                    </Badge>
                                                </button>

                                                {parameterGroups.map((pg) => {
                                                    const isTotal = pg.scope === 'total';
                                                    return (
                                                        <button
                                                            key={pg.group}
                                                            type="button"
                                                            onClick={() => handleInsertToken(pg.group)}
                                                            className={cn(
                                                                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-colors cursor-pointer',
                                                                isTotal
                                                                    ? 'bg-secondary-500/10 text-secondary-700 dark:text-secondary-400 border-secondary-500/20 hover:bg-secondary-500/20'
                                                                    : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20 hover:bg-sky-500/20'
                                                            )}
                                                            title={`Variable: ${pg.group} (${isTotal ? 'Ámbito Total' : 'Ámbito Global'})`}
                                                        >
                                                            <span className="font-bold">+</span> {pg.group}
                                                            <span className="text-[10px] font-sans opacity-80">
                                                                ({pg.label})
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    'text-[9px] px-1 py-0 uppercase font-sans tracking-wider',
                                                                    isTotal
                                                                        ? 'border-secondary-500/40 text-secondary-700 dark:text-secondary-300'
                                                                        : 'border-sky-500/40 text-sky-700 dark:text-sky-300'
                                                                )}
                                                            >
                                                                {isTotal ? 'Total' : 'Global'}
                                                            </Badge>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Operadores Matemáticos */}
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                {['+', '-', '*', '/', '(', ')', '/ 100'].map((op) => (
                                                    <button
                                                        key={op}
                                                        type="button"
                                                        onClick={() => handleInsertToken(op)}
                                                        className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-background border border-input text-foreground hover:bg-muted transition-colors cursor-pointer"
                                                    >
                                                        {op}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulador Interactivo Didáctico */}
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="size-4 text-secondary-500" />
                                                <h3 className="text-xs font-bold text-foreground">
                                                    Simulador de Cálculo en Vivo
                                                </h3>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">
                                                Prueba interactiva antes de guardar
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="sim-subtotal" className="text-[11px] font-medium text-muted-foreground">
                                                    Subtotal de Servicios de Prueba (Bs.)
                                                </Label>
                                                <Input
                                                    id="sim-subtotal"
                                                    type="number"
                                                    value={simSubtotal}
                                                    onChange={(e) => setSimSubtotal(Number(e.target.value))}
                                                    className="mt-1 h-9 text-xs font-mono"
                                                />
                                            </div>

                                            {parameterGroups.map((pg) => (
                                                <div key={pg.group}>
                                                    <Label htmlFor={`sim-${pg.group}`} className="text-[11px] font-medium text-muted-foreground">
                                                        {pg.label} ({pg.group})
                                                    </Label>
                                                    <Input
                                                        id={`sim-${pg.group}`}
                                                        type="number"
                                                        value={simValues[pg.group] ?? pg.defaultValue}
                                                        onChange={(e) =>
                                                            setSimValues((prev) => ({
                                                                ...prev,
                                                                [pg.group]: Number(e.target.value),
                                                            }))
                                                        }
                                                        className="mt-1 h-9 text-xs font-mono"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Resultado del Simulador */}
                                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div className="text-xs text-muted-foreground">
                                                Resultado proyectado del Total:
                                            </div>
                                            {simResult.success && simResult.isNumeric ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-black text-primary dark:text-sky-400 font-mono">
                                                        Bs. {Number(simResult.value).toLocaleString('es-BO', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                                    {simResult.error ?? 'La expresión matemática está incompleta o es inválida'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón Guardar */}
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 cursor-pointer"
                                        >
                                            {processing ? 'Guardando configuración...' : 'Guardar Configuración'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ConfigurationsIndex.layout = {
    breadcrumbs,
};
