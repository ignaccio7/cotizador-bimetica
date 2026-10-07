import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Edit2,
    Hash,
    Plus,
    Sliders,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
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
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface VariableItem {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    default_value: number | null;
    used_in_services: string[];
    used_count: number;
    created_at?: string;
}

export default function AdminVariablesIndex({
    variables = [],
    flash = {},
}: {
    variables: VariableItem[];
    flash?: { success?: string; error?: string };
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingVariable, setEditingVariable] = useState<VariableItem | null>(null);
    const [deletingVariable, setDeletingVariable] = useState<VariableItem | null>(null);

    // Formulario Crear
    const createForm = useForm({
        name: '',
        type: 'dynamic',
        default_value: '',
    });

    // Formulario Editar
    const editForm = useForm({
        name: '',
        type: 'dynamic',
        default_value: '',
    });

    const handleOpenCreate = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (item: VariableItem) => {
        editForm.clearErrors();
        setEditingVariable(item);
        editForm.setData({
            name: item.name,
            type: item.type,
            default_value: item.default_value !== null ? String(item.default_value) : '',
        });
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(admin.variables.store().url, {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVariable) return;
        editForm.put(admin.variables.update(editingVariable.id).url, {
            onSuccess: () => {
                setEditingVariable(null);
                editForm.reset();
            },
        });
    };

    const confirmDelete = () => {
        if (!deletingVariable) return;
        router.delete(admin.variables.destroy(deletingVariable.id).url, {
            onSuccess: () => {
                setDeletingVariable(null);
            },
        });
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Variables del Sistema - Admin Bimetica" />

            {/* Encabezado */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Variables del Sistema
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Catálogo de variables para cálculo en fórmulas. Las <strong>dinámicas</strong> las completa el vendedor en cada cotización y las <strong>estáticas</strong> funcionan como constantes fijas.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleOpenCreate}
                        className="bg-primary text-primary-foreground font-semibold shadow-xs"
                    >
                        <Plus className="mr-1.5 size-4" />
                        Nueva Variable
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

            {/* Tabla de Variables */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-5 py-3.5">Identificador</th>
                            <th className="px-5 py-3.5">Naturaleza</th>
                            <th className="px-5 py-3.5">Valor por Defecto / Sugerido</th>
                            <th className="px-5 py-3.5">Servicios Vinculados</th>
                            <th className="px-5 py-3.5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {variables.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-primary text-sm">
                                            {item.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            item.type === 'dynamic'
                                                ? 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
                                                : 'border-purple-300 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                                        }
                                    >
                                        {item.type === 'dynamic' ? 'Dinámica (Vendedor)' : 'Estática (Constante)'}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4 font-mono font-semibold text-foreground">
                                    {item.default_value !== null ? item.default_value : (
                                        <span className="text-muted-foreground text-xs italic">
                                            Sin valor fijo
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.used_in_services.length > 0 ? (
                                            item.used_in_services.map((serviceName, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="text-[11px] font-medium"
                                                >
                                                    {serviceName}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                Sin fórmulas asignadas
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                            onClick={() => handleOpenEdit(item)}
                                            title="Editar variable"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={() => setDeletingVariable(item)}
                                            title="Eliminar variable"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {variables.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                                    No hay variables registradas en el catálogo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear Variable */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nueva Variable del Sistema</DialogTitle>
                        <DialogDescription>
                            Define un identificador en minúsculas para usar en las fórmulas de cálculo.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="space-y-4 pt-2">
                        <div>
                            <Label htmlFor="create-name">Identificador (Código de Variable)</Label>
                            <Input
                                id="create-name"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.target.value.toLowerCase().trim())}
                                placeholder="ej. m2, complejidad, ambientes"
                                className="font-mono mt-1"
                                autoFocus
                            />
                            {createForm.errors.name && (
                                <p className="mt-1 text-xs text-red-600">{createForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="create-type">Naturaleza de la Variable</Label>
                            <select
                                id="create-type"
                                value={createForm.data.type}
                                onChange={(e) => createForm.setData('type', e.target.value as 'static' | 'dynamic')}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                            >
                                <option value="dynamic">Dinámica (Llenada por el vendedor en la cotización)</option>
                                <option value="static">Estática (Constante fija de catálogo)</option>
                            </select>
                            {createForm.errors.type && (
                                <p className="mt-1 text-xs text-red-600">{createForm.errors.type}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="create-default">Valor por Defecto / Sugerido</Label>
                            <Input
                                id="create-default"
                                type="number"
                                step="any"
                                value={createForm.data.default_value}
                                onChange={(e) => createForm.setData('default_value', e.target.value)}
                                placeholder="ej. 1.0, 18.0, 250"
                                className="font-mono mt-1"
                            />
                            {createForm.errors.default_value && (
                                <p className="mt-1 text-xs text-red-600">{createForm.errors.default_value}</p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="bg-primary text-primary-foreground font-semibold"
                            >
                                Guardar Variable
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Editar Variable */}
            <Dialog open={!!editingVariable} onOpenChange={(open) => !open && setEditingVariable(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Variable</DialogTitle>
                        <DialogDescription>
                            Modifica las propiedades de la variable <strong>{editingVariable?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 pt-2">
                        <div>
                            <Label htmlFor="edit-name">Identificador</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value.toLowerCase().trim())}
                                className="font-mono mt-1"
                            />
                            {editForm.errors.name && (
                                <p className="mt-1 text-xs text-red-600">{editForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-type">Naturaleza de la Variable</Label>
                            <select
                                id="edit-type"
                                value={editForm.data.type}
                                onChange={(e) => editForm.setData('type', e.target.value as 'static' | 'dynamic')}
                                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                            >
                                <option value="dynamic">Dinámica (Llenada por el vendedor en la cotización)</option>
                                <option value="static">Estática (Constante fija de catálogo)</option>
                            </select>
                            {editForm.errors.type && (
                                <p className="mt-1 text-xs text-red-600">{editForm.errors.type}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-default">Valor por Defecto / Sugerido</Label>
                            <Input
                                id="edit-default"
                                type="number"
                                step="any"
                                value={editForm.data.default_value}
                                onChange={(e) => editForm.setData('default_value', e.target.value)}
                                className="font-mono mt-1"
                            />
                            {editForm.errors.default_value && (
                                <p className="mt-1 text-xs text-red-600">{editForm.errors.default_value}</p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingVariable(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="bg-primary text-primary-foreground font-semibold"
                            >
                                Actualizar Variable
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Confirmar Eliminación */}
            <Dialog open={!!deletingVariable} onOpenChange={(open) => !open && setDeletingVariable(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Eliminar Variable</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar la variable{' '}
                            <strong>{deletingVariable?.name}</strong>?
                            {deletingVariable && deletingVariable.used_count > 0 && (
                                <span className="block mt-2 text-red-600 font-semibold">
                                    Esta variable está siendo utilizada en {deletingVariable.used_count} servicio(s). No podrá ser eliminada hasta desvincularla de las fórmulas.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingVariable(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Eliminar Variable
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Variables del Sistema',
        href: admin.variables.index(),
    },
];

AdminVariablesIndex.layout = {
    breadcrumbs,
};
