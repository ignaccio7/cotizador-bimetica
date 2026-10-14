import type { ServiceItem } from '@/components/services/services-list';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface DeleteServiceDialogProps {
    service: ServiceItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteServiceDialog({
    service,
    open,
    onOpenChange,
    onConfirm,
}: DeleteServiceDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Eliminar Servicio</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar el servicio{' '}
                        <strong>{service?.name}</strong>? Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                    >
                        Eliminar Servicio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
