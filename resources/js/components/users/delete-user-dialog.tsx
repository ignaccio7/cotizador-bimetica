import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { UserItem } from './user-dialog';

interface DeleteUserDialogProps {
    user: UserItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    currentUserId: number;
    processing?: boolean;
}

export function DeleteUserDialog({
    user,
    open,
    onOpenChange,
    onConfirm,
    currentUserId,
    processing = false,
}: DeleteUserDialogProps) {
    if (!user) return null;

    const isSelf = user.id === currentUserId;
    const hasQuotes = (user.quotes_count ?? 0) > 0;
    const canDelete = !isSelf && !hasQuotes;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                        {canDelete ? (
                            'Eliminar Usuario'
                        ) : (
                            <>
                                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                                <span>Acción no permitida</span>
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {isSelf ? (
                            <span>
                                No puedes eliminar tu propia cuenta de usuario (<strong className="text-foreground">{user.email}</strong>).
                                Para dar de baja este usuario, solicita a otro administrador que lo realice.
                            </span>
                        ) : hasQuotes ? (
                            <span>
                                El usuario <strong className="text-foreground">{user.name}</strong> tiene{' '}
                                <strong className="text-primary font-semibold">{user.quotes_count} cotización(es)</strong>{' '}
                                registradas en el sistema. Por motivos de auditoría y trazabilidad comercial, no es posible eliminarlo.
                            </span>
                        ) : (
                            <span>
                                ¿Estás seguro de que deseas eliminar al usuario{' '}
                                <strong className="text-foreground">"{user.name}"</strong> (
                                <span className="font-mono text-primary">{user.email}</span>)?
                                Esta acción eliminará su acceso al sistema y no se puede deshacer.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-3 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        {canDelete ? 'Cancelar' : 'Entendido'}
                    </Button>
                    {canDelete && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onConfirm}
                            disabled={processing}
                        >
                            {processing ? 'Eliminando...' : 'Eliminar Usuario'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

