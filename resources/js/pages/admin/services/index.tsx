import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Calculator,
    Check,
    Code2,
    Eye,
    EyeOff,
    Layers,
    Plus,
    Search,
    Sliders,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface VariableOption {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    default_value: number | null;
}

interface FormulaItem {
    id?: number;
    name: string;
    expression: string;
    is_visible: boolean;
    variables?: VariableOption[];
    variable_ids: number[];
}

interface ServiceItem {
    id: number;
    name: string;
    description: string;
    formulas: FormulaItem[];
    created_at?: string;
}

function evaluateExpression(expression: string, scope: Record<string, number>): number | null {
    try {
        // Normalizamos nombres de variables en la expresión (ej. bs_m2)
        const keys = Object.keys(scope);
        const values = Object.values(scope);
        const fn = new Function(...keys, `"use strict"; return (${expression});`);
        const res = fn(...values);
        return typeof res === 'number' && !isNaN(res) ? res : null;
    } catch {
        return null;
    }
}

export default function AdminServicesIndex({
    services = [],
    availableVariables = [],
    flash = {},
}: {
    services: ServiceItem[];
    availableVariables: VariableOption[];
    flash?: { success?: string; error?: string };
}) {
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        services[0]?.id ?? null
    );
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);

    const selectedService = useMemo(() => {
        return services.find((s) => s.id === selectedServiceId) ?? null;
    }, [services, selectedServiceId]);

    // Formulario de Edición / Creación
    const form = useForm<{
        name: string;
        description: string;
        formulas: FormulaItem[];
    }>({
        name: '',
        description: '',
        formulas: [],
    });

    // Simulador: valores de prueba para variables dinámicas
    const [simulatedInputs, setSimulatedInputs] = useState<Record<string, number>>({
        m2: 300,
        complejidad: 1,
        renders_extra: 0,
        pisos_altura: 2,
        ambientes: 4,
        pozos: 3,
        visado_colegio: 1,
    });

    // Sincronizar formulario al cambiar de servicio seleccionado
    useEffect(() => {
        if (isCreating) return;

        if (selectedService) {
            form.setData({
                name: selectedService.name,
                description: selectedService.description,
                formulas: selectedService.formulas.map((f) => ({
                    id: f.id,
                    name: f.name,
                    expression: f.expression,
                    is_visible: f.is_visible,
                    variable_ids: f.variable_ids ?? [],
                })),
            });
            form.clearErrors();
        }
    }, [selectedServiceId, isCreating]);

    const handleStartCreate = () => {
        setIsCreating(true);
        setSelectedServiceId(null);
        form.reset();
        form.clearErrors();
        form.setData({
            name: '',
            description: "1) \n2) \n3) \nNo incluye Visado.",
            formulas: [
                {
                    name: 'BS /M2',
                    expression: '18 * complejidad',
                    is_visible: true,
                    variable_ids: availableVariables.filter((v) => v.name === 'complejidad').map((v) => v.id),
                },
                {
                    name: 'INVERSIÓN BS.',
                    expression: 'm2 * bs_m2',
                    is_visible: true,
                    variable_ids: availableVariables.filter((v) => v.name === 'm2').map((v) => v.id),
                },
            ],
        });
    };

    const handleSelectService = (service: ServiceItem) => {
        setIsCreating(false);
        setSelectedServiceId(service.id);
    };

    const addFormulaRow = () => {
        form.setData('formulas', [
            ...form.data.formulas,
            {
                name: 'NUEVA FÓRMULA',
                expression: 'm2 * 20',
                is_visible: true,
                variable_ids: [],
            },
        ]);
    };

    const removeFormulaRow = (index: number) => {
        if (form.data.formulas.length <= 1) return;
        const updated = [...form.data.formulas];
        updated.splice(index, 1);
        form.setData('formulas', updated);
    };

    const updateFormulaField = (
        index: number,
        field: keyof FormulaItem,
        value: string | boolean | number[]
    ) => {
        const updated = [...form.data.formulas];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        form.setData('formulas', updated);
    };

    const toggleVariableInFormula = (formulaIndex: number, variableId: number) => {
        const currentFormula = form.data.formulas[formulaIndex];
        const exists = currentFormula.variable_ids.includes(variableId);
        const newIds = exists
            ? currentFormula.variable_ids.filter((id) => id !== variableId)
            : [...currentFormula.variable_ids, variableId];

        updateFormulaField(formulaIndex, 'variable_ids', newIds);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isCreating) {
            form.post(admin.services.store().url, {
                onSuccess: () => {
                    setIsCreating(false);
                },
            });
        } else if (selectedService) {
            form.put(admin.services.update(selectedService.id).url, {
                onSuccess: () => {
                    // Actualizado
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!deletingService) return;
        router.delete(admin.services.destroy(deletingService.id).url, {
            onSuccess: () => {
                setDeletingService(null);
                if (selectedServiceId === deletingService.id) {
                    setSelectedServiceId(services.find((s) => s.id !== deletingService.id)?.id ?? null);
                }
            },
        });
    };

    // Evaluación en Cascada para el Simulador
    const simulationResults = useMemo(() => {
        const currentScope: Record<string, number> = { ...simulatedInputs };
        const results: { name: string; expression: string; is_visible: boolean; value: number | null }[] = [];

        for (const f of form.data.formulas) {
            const val = evaluateExpression(f.expression, currentScope);
            results.push({
                name: f.name,
                expression: f.expression,
                is_visible: f.is_visible,
                value: val,
            });

            // Se inyecta el valor calculado al scope para que las fórmulas siguientes puedan referenciarlo
            // Normalizamos nombres como "BS /M2" -> "bs_m2" o "inversion_bs"
            const slugKey = f.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');

            if (slugKey && val !== null) {
                currentScope[slugKey] = val;
            }
        }

        return results;
    }, [form.data.formulas, simulatedInputs]);

    // Filtrar servicios
    const filteredServices = services.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Servicios y Fórmulas - Admin Bimetica" />

            {/* Encabezado */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Servicios y Fórmulas de Cotización
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Configura los servicios arquitectónicos, sus entregables con viñetas y las fórmulas encadenadas que alimentan la cotización.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleStartCreate}
                        className="bg-primary text-primary-foreground font-semibold shadow-xs"
                    >
                        <Plus className="mr-1.5 size-4" />
                        Nuevo Servicio
                    </Button>
                </div>
            </div>

            {/* Mensajes Flash */}
            {flash?.success && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    <Check className="size-4 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-xs font-medium text-red-800 dark:text-red-300">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Layout Maestro - Detalle */}
            <div className="grid gap-6 lg:grid-cols-12 items-start">
                {/* Columna Izquierda: Catálogo de Servicios (4 Cols) */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Catálogo ({services.length})
                        </span>
                        <div className="relative w-44">
                            <Search className="size-3.5 absolute left-2 top-2.5 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar servicio..."
                                className="h-8 pl-7 text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {filteredServices.map((item) => {
                            const isSelected = !isCreating && selectedServiceId === item.id;
                            const visibleFormulasCount = item.formulas.filter((f) => f.is_visible).length;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelectService(item)}
                                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                        isSelected
                                            ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20'
                                            : 'border-border bg-card hover:border-muted-foreground/30'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-foreground text-sm leading-tight">
                                            {item.name}
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] shrink-0 font-medium bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                                        >
                                            {visibleFormulasCount} col. visible{visibleFormulasCount !== 1 ? 's' : ''}
                                        </Badge>
                                    </div>

                                    {/* Muestra previa de la descripción multilínea */}
                                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>{item.formulas.length} fórmula(s)</span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 px-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 text-[10px]"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingService(item);
                                            }}
                                        >
                                            <Trash2 className="size-3 mr-1" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredServices.length === 0 && (
                            <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                                No se encontraron servicios con ese criterio.
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Editor e Inspector de Fórmulas (8 Cols) */}
                <div className="lg:col-span-8">
                    {(selectedService || isCreating) ? (
                        <form onSubmit={handleSubmit}>
                            <Card className="border shadow-xs">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-foreground">
                                                {isCreating ? 'Nuevo Servicio Arquitectónico' : form.data.name}
                                            </CardTitle>
                                            <CardDescription className="mt-1 text-xs">
                                                {isCreating
                                                    ? 'Define el nombre comercial, entregables numerados y las fórmulas de cálculo.'
                                                    : 'Configuración detallada de entregables, variables y columnas de cotización.'}
                                            </CardDescription>
                                        </div>
                                        {!isCreating && selectedService && (
                                            <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                                                ID #{selectedService.id}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 space-y-6">
                                    {/* Nombre del Servicio */}
                                    <div>
                                        <Label htmlFor="service-name">Nombre del Servicio</Label>
                                        <Input
                                            id="service-name"
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            placeholder="ej. PLANOS 2D, DISEÑO ARQUITECTÓNICO 3D"
                                            className="mt-1 font-bold text-sm uppercase tracking-wide"
                                            required
                                        />
                                        {form.errors.name && (
                                            <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>
                                        )}
                                    </div>

                                    {/* Descripción y Entregables (Conserva saltos de línea) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <Label htmlFor="service-description">
                                                Descripción y Entregables (Conserva saltos de línea)
                                            </Label>
                                            <span className="text-[11px] text-muted-foreground">
                                                Escribe los puntos numerados y notas de alcance
                                            </span>
                                        </div>
                                        <textarea
                                            id="service-description"
                                            rows={6}
                                            value={form.data.description}
                                            onChange={(e) => form.setData('description', e.target.value)}
                                            placeholder="1) Planos en autoCAD y PDF&#10;2) Esquema de Fundaciones,&#10;3) Planos de Plantas,&#10;No incluye Visado."
                                            className="w-full rounded-md border border-input bg-background p-3 text-xs leading-relaxed font-sans shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring whitespace-pre-wrap"
                                            required
                                        />
                                        {form.errors.description && (
                                            <p className="mt-1 text-xs text-red-600">{form.errors.description}</p>
                                        )}
                                    </div>

                                    {/* Gestión de Múltiples Fórmulas */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <div>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                                    <Calculator className="size-4 text-primary" />
                                                    Fórmulas de Cálculo del Servicio ({form.data.formulas.length})
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Cada fórmula puede ser una <strong>columna visible</strong> en la cotización (ej. <code>BS /M2</code>, <code>INVERSIÓN BS.</code>) o un cálculo interno intermedio.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addFormulaRow}
                                                className="text-xs"
                                            >
                                                <Plus className="mr-1 size-3.5" />
                                                Agregar Fórmula
                                            </Button>
                                        </div>

                                        {form.errors.formulas && (
                                            <p className="text-xs text-red-600 font-medium">{form.errors.formulas}</p>
                                        )}

                                        <div className="space-y-4">
                                            {form.data.formulas.map((formula, idx) => (
                                                <div
                                                    key={idx}
                                                    className="rounded-xl border p-4 bg-muted/10 space-y-3 relative group"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        {/* Nombre de la Fórmula / Columna */}
                                                        <div className="flex-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                                                                Nombre / Cabecera de Columna #{idx + 1}
                                                            </span>
                                                            <Input
                                                                value={formula.name}
                                                                onChange={(e) =>
                                                                    updateFormulaField(idx, 'name', e.target.value)
                                                                }
                                                                placeholder="ej. BS /M2, INVERSIÓN BS., Costo Base"
                                                                className="h-8 font-bold text-xs"
                                                                required
                                                            />
                                                        </div>

                                                        {/* Switch / Toggle is_visible */}
                                                        <div className="flex items-center gap-2 pt-2 sm:pt-4">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateFormulaField(idx, 'is_visible', !formula.is_visible)
                                                                }
                                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${
                                                                    formula.is_visible
                                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                        : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                                                                }`}
                                                            >
                                                                {formula.is_visible ? (
                                                                    <>
                                                                        <Eye className="size-3.5 text-emerald-600" />
                                                                        <span>Columna Visible</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <EyeOff className="size-3.5 text-slate-500" />
                                                                        <span>Cálculo Interno (Oculto)</span>
                                                                    </>
                                                                )}
                                                            </button>

                                                            {form.data.formulas.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeFormulaRow(idx)}
                                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                    title="Eliminar esta fórmula"
                                                                >
                                                                    <Trash2 className="size-3.5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Expresión Matemática */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                                <Code2 className="size-3 text-primary" />
                                                                Expresión de Cálculo (Math.js)
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                Condicional ternario: <code>condición ? valor_si : valor_no</code>
                                                            </span>
                                                        </div>
                                                        <Input
                                                            value={formula.expression}
                                                            onChange={(e) =>
                                                                updateFormulaField(idx, 'expression', e.target.value)
                                                            }
                                                            placeholder="ej. 18 * complejidad, m2 < 50 ? 1200 : (m2 * bs_m2)"
                                                            className="font-mono text-xs text-primary font-bold h-9 bg-slate-50 dark:bg-slate-950"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Selección de Variables asociadas a esta fórmula */}
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                                                            Variables Vinculadas (Haz clic para activar o desactivar):
                                                        </span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {availableVariables.map((v) => {
                                                                const isSelected = formula.variable_ids.includes(v.id);
                                                                return (
                                                                    <button
                                                                        key={v.id}
                                                                        type="button"
                                                                        onClick={() => toggleVariableInFormula(idx, v.id)}
                                                                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                                                                            isSelected
                                                                                ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                                                                                : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                                                        }`}
                                                                    >
                                                                        {v.name}
                                                                        <span className="ml-1 text-[9px] opacity-75">
                                                                            ({v.type === 'dynamic' ? 'dinámica' : 'estática'})
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SIMULADOR EN VIVO (EVALUACIÓN EN CASCADA) */}
                                    <div className="rounded-xl border border-dashed p-4 bg-muted/20 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                                                <Sparkles className="size-3.5 text-[#fbad03]" />
                                                Simulador en Vivo de Fórmulas Encadenadas
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">
                                                Prueba interactiva antes de guardar
                                            </span>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Ingresa valores de prueba para las variables dinámicas para verificar cómo se calculan las columnas visibles y los subtotales.
                                        </p>

                                        {/* Inputs de Prueba para Variables */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                                            <div>
                                                <span className="text-[10px] font-semibold text-muted-foreground block">
                                                    m² prueba
                                                </span>
                                                <Input
                                                    type="number"
                                                    value={simulatedInputs.m2 ?? 300}
                                                    onChange={(e) =>
                                                        setSimulatedInputs((prev) => ({
                                                            ...prev,
                                                            m2: Number(e.target.value),
                                                        }))
                                                    }
                                                    className="h-8 text-xs font-mono mt-0.5"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-semibold text-muted-foreground block">
                                                    complejidad
                                                </span>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    value={simulatedInputs.complejidad ?? 1}
                                                    onChange={(e) =>
                                                        setSimulatedInputs((prev) => ({
                                                            ...prev,
                                                            complejidad: Number(e.target.value),
                                                        }))
                                                    }
                                                    className="h-8 text-xs font-mono mt-0.5"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-semibold text-muted-foreground block">
                                                    pisos_altura
                                                </span>
                                                <Input
                                                    type="number"
                                                    value={simulatedInputs.pisos_altura ?? 2}
                                                    onChange={(e) =>
                                                        setSimulatedInputs((prev) => ({
                                                            ...prev,
                                                            pisos_altura: Number(e.target.value),
                                                        }))
                                                    }
                                                    className="h-8 text-xs font-mono mt-0.5"
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-semibold text-muted-foreground block">
                                                    pozos SPT
                                                </span>
                                                <Input
                                                    type="number"
                                                    value={simulatedInputs.pozos ?? 3}
                                                    onChange={(e) =>
                                                        setSimulatedInputs((prev) => ({
                                                            ...prev,
                                                            pozos: Number(e.target.value),
                                                        }))
                                                    }
                                                    className="h-8 text-xs font-mono mt-0.5"
                                                />
                                            </div>
                                        </div>

                                        {/* Resultados de Cada Fórmula */}
                                        <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {simulationResults.map((res, i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded-lg border p-2.5 text-xs ${
                                                        res.is_visible
                                                            ? 'bg-background border-primary/30'
                                                            : 'bg-muted/40 border-dashed border-border'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-bold text-foreground">
                                                            {res.name}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[9px] ${
                                                                res.is_visible
                                                                    ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
                                                                    : 'text-slate-500 bg-slate-100 border-slate-300'
                                                            }`}
                                                        >
                                                            {res.is_visible ? 'Visible en Tabla' : 'Interno'}
                                                        </Badge>
                                                    </div>
                                                    <div className="font-mono text-base font-bold text-primary">
                                                        {res.value !== null
                                                            ? `Bs. ${res.value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                            : 'Error de sintaxis'}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-mono block mt-0.5 truncate">
                                                        expr: {res.expression}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="border-t pt-4 flex items-center justify-between">
                                        {isCreating ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsCreating(false);
                                                    setSelectedServiceId(services[0]?.id ?? null);
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                Modifica las fórmulas y haz clic en Guardar Cambios.
                                            </span>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                            className="bg-primary text-primary-foreground font-semibold"
                                        >
                                            {isCreating ? 'Crear Servicio' : 'Guardar Cambios'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    ) : (
                        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                            Selecciona un servicio del catálogo para ver o editar sus fórmulas.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Confirmar Eliminación */}
            <Dialog open={!!deletingService} onOpenChange={(open) => !open && setDeletingService(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar Servicio</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar el servicio{' '}
                            <strong>{deletingService?.name}</strong> y sus fórmulas asociadas?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingService(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Eliminar Servicio
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios & Fórmulas',
        href: admin.services.index(),
    },
];

AdminServicesIndex.layout = {
    breadcrumbs,
};
