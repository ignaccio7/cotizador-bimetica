import { Head } from '@inertiajs/react';
import {
    Plus,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'seller';
    role_label: string;
    status: string;
    quotes_count: number;
    created_at: string;
}

export default function AdminUsersIndex({
    users = [],
}: {
    users: UserItem[];
}) {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Gestión de Usuarios - Admin Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Usuarios y Roles del Sistema
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gestión de accesos para Administradores y Ejecutivos Comerciales (Vendedores).
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
                        <Plus className="mr-2 size-4" />
                        Nuevo Usuario
                    </Button>
                </div>
            </div>

            {/* Aviso de Negocio */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/80 flex items-start gap-3">
                <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                    <strong className="text-foreground">Regla de Acceso Bimetica:</strong> Únicamente existen dos roles con login: <strong>Admin</strong> (configura catálogo, fórmulas y parámetros) y <strong>Vendedor</strong> (gestiona el ciclo integral de cotizaciones, formularios iniciales, contratos y designaciones). Los clientes no tienen cuenta en el sistema.
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                        <tr>
                            <th className="px-5 py-3.5">Nombre</th>
                            <th className="px-5 py-3.5">Correo Electrónico</th>
                            <th className="px-5 py-3.5">Rol en el Sistema</th>
                            <th className="px-5 py-3.5 text-center">Cotizaciones</th>
                            <th className="px-5 py-3.5 text-center">Estado</th>
                            <th className="px-5 py-3.5 text-right">Alta</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-muted/20">
                                <td className="px-5 py-4 font-bold text-foreground">
                                    {u.name}
                                </td>
                                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                                    {u.email}
                                </td>
                                <td className="px-5 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            u.role === 'admin'
                                                ? 'border-primary/40 bg-primary/10 text-primary font-bold'
                                                : 'border-amber-300 bg-amber-50 text-amber-800 font-semibold'
                                        }
                                    >
                                        {u.role === 'admin' ? 'Administrador' : 'Vendedor (Comercial)'}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4 text-center font-mono font-bold text-foreground">
                                    {u.quotes_count}
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                                        Activo
                                    </Badge>
                                </td>
                                <td className="px-5 py-4 text-right text-xs text-muted-foreground">
                                    {u.created_at}
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
        title: 'Gestión de Usuarios',
        href: admin.users.index(),
    },
];

AdminUsersIndex.layout = {
    breadcrumbs,
};
