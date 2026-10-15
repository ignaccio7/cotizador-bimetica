import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { VariableItem } from './variable-dialog';

interface DeleteVariableDialogProps {
    variable: VariableItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function DeleteVariableDialog({
    variable,
    open,
    onOpenChange,
    onConfirm,
}: DeleteVariableDialogProps) {
    if (!variable) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground">
                        Eliminar Variable del Sistema
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        ¿Estás seguro de que deseas eliminar la variable{' '}
                        <code className="font-mono font-bold text-destructive bg-destructive/10 px-1 py-0.5 rounded">
                            {variable.name}
                        </code>
                        ? Las fórmulas que dependan de esta variable podrían dejar de calcularse correctamente.
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
                        Eliminar Variable
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
