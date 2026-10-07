import { Head } from '@inertiajs/react';
import {
    Hash,
    Plus,
    Sliders,
    ToggleLeft,
    Type,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface VariableItem {
    id: number;
    name: string;
    label: string;
    type: 'static' | 'dynamic';
    data_type: string;
    default_value: number | string | null;
    description: string;
    used_in_formulas: string[];
}

export default function AdminVariablesIndex({
    variables = [],
}: {
    variables: VariableItem[];
}) {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Variables del Sistema - Admin Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Variables del Sistema
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Variables estáticas (valores constantes) y variables dinámicas (llenadas por el vendedor en la cotización).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
                        <Plus className="mr-2 size-4" />
                        Nueva Variable
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-5 py-3.5">Identificador</th>
                            <th className="px-5 py-3.5">Etiqueta Visual</th>
                            <th className="px-5 py-3.5">Naturaleza</th>
                            <th className="px-5 py-3.5">Tipo de Dato</th>
                            <th className="px-5 py-3.5">Valor por Defecto</th>
                            <th className="px-5 py-3.5">Servicios Vinculados</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {variables.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/20">
                                <td className="px-5 py-4 font-mono font-bold text-primary">
                                    {item.name}
                                </td>
                                <td className="px-5 py-4 font-medium text-foreground">
                                    {item.label}
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {item.description}
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            item.type === 'dynamic'
                                                ? 'border-sky-300 bg-sky-50 text-sky-800'
                                                : 'border-purple-300 bg-purple-50 text-purple-800'
                                        }
                                    >
                                        {item.type === 'dynamic' ? 'Dinámica (Vendedor)' : 'Estática (Constante)'}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4 font-mono text-xs text-muted-foreground uppercase">
                                    {item.data_type}
                                </td>
                                <td className="px-5 py-4 font-mono font-semibold text-foreground">
                                    {item.default_value !== null ? String(item.default_value) : '— (Llenado requerido)'}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {item.used_in_formulas.length > 0 ? (
                                            item.used_in_formulas.map((s, idx) => (
                                                <span
                                                    key={idx}
                                                    className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                                                >
                                                    {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Sin uso</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
