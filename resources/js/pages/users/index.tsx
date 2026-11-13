import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UserDialog, type UserItem } from '@/components/users/user-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInitials } from '@/hooks/use-initials';
import usersRoute from '@/routes/users';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios del Sistema',
        href: usersRoute.index(),
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: UserItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    users: PaginatedUsers;
    filters?: {
        search?: string;
    };
}

export default function UsersIndex({ users, filters }: Props) {
    const { auth, flash } = usePage<{ auth: Auth; flash?: { success?: string; error?: string } }>().props;
    const currentUserId = auth.user.id;
    const getInitials = useInitials();

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            usersRoute.index.url(),
            { search: searchTerm.trim() || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        router.get(usersRoute.index.url(), {}, { preserveState: true, replace: true });
    };

    const handleOpenCreate = () => {
        setUserToEdit(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (user: UserItem) => {
        setUserToEdit(user);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        setIsDeleting(true);

        router.delete(usersRoute.destroy({ user: userToDelete.id }).url, {
            onSuccess: () => {
                setUserToDelete(null);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('es-BO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <Head title="Usuarios del Sistema — Bimetica" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200">
                {/* Cabecera Principal */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="size-5" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Usuarios del Sistema
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Gestión y administración de cuentas para administradores y vendedores de Bimetica.
                        </p>
                    </div>

                    <Button
                        onClick={handleOpenCreate}
                        className="bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer self-start sm:self-auto gap-1.5"
                    >
                        <Plus className="size-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                {/* Mensajes Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                        <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Buscador Simple */}
                <div className="flex items-center justify-between gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, correo o rol..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-8 text-xs bg-card"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Limpiar búsqueda"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Tabla de Usuarios */}
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="py-3 px-4">Usuario</th>
                                    <th className="py-3 px-4">Correo Electrónico</th>
                                    <th className="py-3 px-4 text-center">Rol en el Sistema</th>
                                    <th className="py-3 px-4 text-center">Cotizaciones</th>
                                    <th className="py-3 px-4 text-right">Fecha Registro</th>
                                    <th className="py-3 px-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="size-8 text-muted-foreground/40 stroke-1" />
                                                <p className="font-medium text-foreground text-sm">
                                                    No se encontraron usuarios
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {searchTerm
                                                        ? 'No hay usuarios que coincidan con la búsqueda.'
                                                        : 'Aún no hay usuarios registrados.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const isSelf = user.id === currentUserId;
                                        const isAdmin = user.role === 'admin';

                                        return (
                                            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                                {/* Usuario */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 rounded-full border border-border/40 bg-muted">
                                                            <AvatarFallback className="text-[11px] font-semibold text-primary">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-foreground">
                                                                    {user.name}
                                                                </span>
                                                                {isSelf && (
                                                                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                                                        Tú
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Correo Electrónico */}
                                                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                                                    {user.email}
                                                </td>

                                                {/* Rol */}
                                                <td className="py-3.5 px-4 text-center">
                                                    {isAdmin ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary dark:bg-primary/20">
                                                            <ShieldCheck className="size-3" />
                                                            Administrador
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
                                                            <UserCheck className="size-3" />
                                                            Vendedor
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Cotizaciones Asociadas */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
                                                        {user.quotes_count ?? 0}
                                                    </span>
                                                </td>

                                                {/* Fecha de Registro */}
                                                <td className="py-3.5 px-4 text-right text-muted-foreground">
                                                    {formatDate(user.created_at)}
                                                </td>

                                                {/* Acciones */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(user)}
                                                            className="size-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                            title="Editar usuario"
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setUserToDelete(user)}
                                                            disabled={isSelf}
                                                            className={`size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${
                                                                isSelf ? 'opacity-30 cursor-not-allowed' : ''
                                                            }`}
                                                            title={isSelf ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {users.links && users.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-3">
                            <p className="text-[11px] text-muted-foreground">
                                Mostrando del <span className="font-semibold">{users.from || 0}</span> al{' '}
                                <span className="font-semibold">{users.to || 0}</span> de{' '}
                                <span className="font-semibold">{users.total}</span> usuarios
                            </p>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-2.5 py-1 text-xs text-muted-foreground/40"
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground font-semibold'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Diálogos */}
            <UserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                userToEdit={userToEdit}
                currentUserId={currentUserId}
            />

            <DeleteUserDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
                user={userToDelete}
                onConfirm={handleConfirmDelete}
                currentUserId={currentUserId}
                processing={isDeleting}
            />
        </>
    );
}
