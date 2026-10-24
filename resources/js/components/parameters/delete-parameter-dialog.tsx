import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ParameterItem } from './parameter-dialog';

interface DeleteParameterDialogProps {
    parameter: ParameterItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteParameterDialog({
    parameter,
    open,
    onOpenChange,
    onConfirm,
}: DeleteParameterDialogProps) {
    if (!parameter) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground">
                        Eliminar Parámetro
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        ¿Estás seguro de que deseas eliminar el parámetro{' '}
                        <strong className="text-foreground">"{parameter.name}"</strong> perteneciente al grupo{' '}
                        <span className="font-semibold text-primary">{parameter.group_label || parameter.group}</span>?
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 pt-3 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={onConfirm}
                    >
                        Eliminar Parámetro
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
