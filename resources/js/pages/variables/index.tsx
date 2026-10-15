import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Edit2,
    Plus,
    Search,
    Sliders,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { DeleteVariableDialog } from '@/components/variables/delete-variable-dialog';
import {
    VariableDialog,
    type VariableItem,
} from '@/components/variables/variable-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import variablesRoute from '@/routes/variables';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Variables del Sistema',
        href: variablesRoute.index(),
    },
];

interface Props {
    variables?: VariableItem[];
}

export default function VariablesIndex({ variables = [] }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'dynamic' | 'static'>('all');

    // Estado de modales
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [variableToEdit, setVariableToEdit] = useState<VariableItem | null>(null);
    const [variableToDelete, setVariableToDelete] = useState<VariableItem | null>(null);

    // Filtrado interactivo
    const filteredVariables = useMemo(() => {
        return variables.filter((v) => {
            const matchesSearch =
                v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (v.description && v.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesType = filterType === 'all' || v.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [variables, searchTerm, filterType]);

    const handleOpenCreate = () => {
        setVariableToEdit(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (item: VariableItem) => {
        setVariableToEdit(item);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!variableToDelete) return;

        router.delete(variablesRoute.destroy({ variable: variableToDelete.id }).url, {
            onSuccess: () => {
                setVariableToDelete(null);
            },
        });
    };

    const dynamicCount = variables.filter((v) => v.type === 'dynamic').length;
    const staticCount = variables.filter((v) => v.type === 'static').length;

    return (
        <>
            <Head title="Variables del Sistema" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200">
                {/* Cabecera Superior */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sliders className="size-6 text-primary" />
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Variables del Sistema
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Catálogo maestro de variables para usar en las fórmulas de cálculo de todos los servicios.
                        </p>
                    </div>

                    <Button
                        onClick={handleOpenCreate}
                        className="bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer self-start sm:self-auto"
                    >
                        <Plus className="mr-1.5 size-4" />
                        Nueva Variable
                    </Button>
                </div>

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

                {/* Filtros y Buscador */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar variable o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ps-9 h-9 text-xs"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto border rounded-lg p-1 bg-muted/30">
                        <button
                            type="button"
                            onClick={() => setFilterType('all')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                filterType === 'all'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Todas ({variables.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType('dynamic')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                filterType === 'dynamic'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Dinámicas ({dynamicCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType('static')}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                                filterType === 'static'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Estáticas ({staticCount})
                        </button>
                    </div>
                </div>

                {/* Tabla de Variables */}
                <Card className="border shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    <th className="px-4 py-3">Variable (Identificador)</th>
                                    <th className="px-4 py-3">Naturaleza</th>
                                    <th className="px-4 py-3">Tipo de Dato</th>
                                    <th className="px-4 py-3">Valor por Defecto / Opciones</th>
                                    <th className="px-4 py-3">Descripción de Uso</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredVariables.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            No se encontraron variables con los filtros aplicados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVariables.map((v) => (
                                        <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <code className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                                                        {v.name}
                                                    </code>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                {v.type === 'dynamic' ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/60 text-[10px] font-medium">
                                                        Dinámica (Input)
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-slate-600 bg-slate-50 dark:bg-slate-900 text-[10px] font-medium">
                                                        Estática (Constante)
                                                    </Badge>
                                                )}
                                            </td>

                                            <td className="px-4 py-3 font-mono text-muted-foreground uppercase text-[11px]">
                                                {v.value_type}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 font-mono">
                                                        <span className="text-[10px] text-muted-foreground">defecto:</span>
                                                        <strong className="text-foreground">{v.default_value}</strong>
                                                    </div>
                                                    {v.options && v.options.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {v.options.map((opt) => (
                                                                <span
                                                                    key={opt}
                                                                    className="rounded bg-muted px-1 py-0.2 text-[9px] font-mono text-muted-foreground"
                                                                >
                                                                    "{opt}"
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={v.description}>
                                                {v.description || '—'}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenEdit(v)}
                                                        className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                                        title="Editar variable"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setVariableToDelete(v)}
                                                        className="size-7 text-muted-foreground hover:text-red-600 cursor-pointer"
                                                        title="Eliminar variable"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modal Crear / Editar con Wayfinder Form */}
            <VariableDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                variableToEdit={variableToEdit}
            />

            {/* Diálogo Eliminar */}
            <DeleteVariableDialog
                variable={variableToDelete}
                open={!!variableToDelete}
                onOpenChange={(open) => !open && setVariableToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

VariablesIndex.layout = {
    breadcrumbs,
};
