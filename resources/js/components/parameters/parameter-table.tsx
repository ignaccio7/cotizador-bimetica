import { ArrowLeft, Edit2, Folder, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ParameterGroupOption, ParameterItem } from './parameter-dialog';

interface ParameterTableProps {
    group: ParameterGroupOption;
    parameters: ParameterItem[];
    onBack: () => void;
    onOpenCreate: () => void;
    onOpenEdit: (item: ParameterItem) => void;
    onOpenDelete: (item: ParameterItem) => void;
}

export function ParameterTable({
    group,
    parameters,
    onBack,
    onOpenCreate,
    onOpenEdit,
    onOpenDelete,
}: ParameterTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = parameters.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Barra Superior con botón Volver y Acciones */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                        className="gap-1.5 text-xs h-9 cursor-pointer"
                    >
                        <ArrowLeft className="size-4" />
                        Volver a Grupos
                    </Button>

                    <div className="h-6 w-px bg-border" />

                    <div>
                        <div className="flex items-center gap-2">
                            <Folder className="size-5 text-primary" />
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                {group.label}
                            </h1>
                            <Badge variant="secondary" className="font-mono text-xs">
                                {parameters.length}
                            </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                            Identificador: <code className="font-mono font-semibold">{group.group}</code>
                        </p>
                    </div>
                </div>

                <Button
                    onClick={onOpenCreate}
                    className="bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer self-start sm:self-auto"
                >
                    <Plus className="mr-1.5 size-4" />
                    Agregar Parámetro
                </Button>
            </div>

            {/* Buscador */}
            <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder={`Buscar en ${group.label}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 text-xs"
                    />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                    {filtered.length} elemento(s)
                </span>
            </div>

            {/* Tabla */}
            <Card className="overflow-hidden border border-border/80 shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 border-b text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3 text-right">Valor</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Descripción</th>
                                <th className="px-4 py-3 text-center">Estado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No se encontraron elementos en este grupo.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-bold text-foreground">
                                            {p.name}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="font-mono font-bold text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {p.value} {p.type === 'percentage' ? '%' : ''}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                                {p.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-sm truncate">
                                            {p.description || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {p.is_active ? (
                                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                                                    Activo
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px] opacity-70">
                                                    Inactivo
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onOpenEdit(p)}
                                                    className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="size-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onOpenDelete(p)}
                                                    className="size-7 text-muted-foreground hover:text-destructive cursor-pointer"
                                                    title="Eliminar"
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
    );
}
