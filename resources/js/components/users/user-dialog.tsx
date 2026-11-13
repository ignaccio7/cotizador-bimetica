import { Form } from '@inertiajs/react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
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
import usersRoute from '@/routes/users';
import type { UserRole } from '@/types';

export interface UserItem {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    quotes_count?: number;
    created_at: string;
}

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userToEdit?: UserItem | null;
    currentUserId: number;
}

export function UserDialog({
    open,
    onOpenChange,
    userToEdit,
    currentUserId,
}: UserDialogProps) {
    const isEditing = !!userToEdit;
    const isEditingSelf = isEditing && userToEdit.id === currentUserId;

    const [selectedRole, setSelectedRole] = useState<UserRole>('seller');

    useEffect(() => {
        if (userToEdit) {
            setSelectedRole(userToEdit.role);
        } else {
            setSelectedRole('seller');
        }
    }, [userToEdit, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground">
                        {isEditing ? `Editar Usuario: ${userToEdit.name}` : 'Nuevo Usuario'}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        {isEditing
                            ? 'Actualiza los datos de la cuenta o modifica el rol asignado en Bimetica.'
                            : 'Registra un nuevo miembro del equipo con acceso al sistema.'}
                    </DialogDescription>
                </DialogHeader>

                <Form
                    key={isEditing ? `edit-user-${userToEdit.id}` : `create-user-${open}`}
                    action={isEditing ? usersRoute.update({ user: userToEdit.id }).url : usersRoute.store().url}
                    method={isEditing ? 'put' : 'post'}
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4 pt-1"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Nombre Completo */}
                            <div>
                                <Label htmlFor="user-name" className="text-xs font-semibold">
                                    Nombre Completo <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="user-name"
                                    name="name"
                                    defaultValue={userToEdit?.name ?? ''}
                                    placeholder="ej. Arq. Carlos Mendoza"
                                    className="text-xs text-foreground mt-1"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Correo Electrónico */}
                            <div>
                                <Label htmlFor="user-email" className="text-xs font-semibold">
                                    Correo Electrónico <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="user-email"
                                    name="email"
                                    type="email"
                                    defaultValue={userToEdit?.email ?? ''}
                                    placeholder="ej. cmendoza@bimetica.bo"
                                    className="text-xs text-foreground mt-1"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Rol del Sistema */}
                            <div>
                                <Label htmlFor="user-role" className="text-xs font-semibold flex items-center justify-between">
                                    <span>Rol en el Sistema <span className="text-rose-500">*</span></span>
                                    {isEditingSelf && (
                                        <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400">
                                            (Tu cuenta - rol fijo)
                                        </span>
                                    )}
                                </Label>
                                <div className="mt-1 grid grid-cols-2 gap-2">
                                    <label
                                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-all ${
                                            selectedRole === 'seller'
                                                ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                                                : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                                        } ${isEditingSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="seller"
                                            checked={selectedRole === 'seller'}
                                            onChange={() => !isEditingSelf && setSelectedRole('seller')}
                                            disabled={isEditingSelf}
                                            className="sr-only"
                                        />
                                        <UserCheck className="size-4 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">Vendedor</span>
                                            <span className="text-[10px] text-muted-foreground">Cotizaciones propias</span>
                                        </div>
                                    </label>

                                    <label
                                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition-all ${
                                            selectedRole === 'admin'
                                                ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                                                : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                                        } ${isEditingSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={selectedRole === 'admin'}
                                            onChange={() => !isEditingSelf && setSelectedRole('admin')}
                                            disabled={isEditingSelf}
                                            className="sr-only"
                                        />
                                        <ShieldCheck className="size-4 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">Administrador</span>
                                            <span className="text-[10px] text-muted-foreground">Acceso total al sistema</span>
                                        </div>
                                    </label>
                                </div>
                                {isEditingSelf && (
                                    <input type="hidden" name="role" value="admin" />
                                )}
                                <InputError message={errors.role} className="mt-1" />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <Label htmlFor="user-password" className="text-xs font-semibold">
                                    Contraseña {isEditing ? <span className="font-normal text-muted-foreground">(Opcional)</span> : <span className="text-rose-500">*</span>}
                                </Label>
                                <Input
                                    id="user-password"
                                    name="password"
                                    type="password"
                                    placeholder={isEditing ? '•••••••• (Dejar en blanco para conservar actual)' : 'Mínimo 8 caracteres'}
                                    className="text-xs text-foreground mt-1"
                                    required={!isEditing}
                                    minLength={8}
                                />
                                <InputError message={errors.password} className="mt-1" />
                                {isEditing && (
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        Ingresa una nueva contraseña únicamente si deseas restablecerla.
                                    </p>
                                )}
                            </div>

                            <DialogFooter className="gap-2 pt-3 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    disabled={processing}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                    disabled={processing}
                                >
                                    {processing ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
