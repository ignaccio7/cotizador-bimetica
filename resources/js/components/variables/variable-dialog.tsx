import { Form } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
import variablesRoute from '@/routes/variables';

export interface VariableItem {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    value_type: 'integer' | 'decimal' | 'string';
    default_value: string;
    options?: string[] | null;
    description?: string;
    created_at?: string;
}

interface VariableDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variableToEdit?: VariableItem | null;
}

export function VariableDialog({
    open,
    onOpenChange,
    variableToEdit,
}: VariableDialogProps) {
    const isEditing = !!variableToEdit;
    const [currentValueType, setCurrentValueType] = useState<'integer' | 'decimal' | 'string'>('decimal');

    useEffect(() => {
        if (variableToEdit) {
            setCurrentValueType(variableToEdit.value_type);
        } else {
            setCurrentValueType('decimal');
        }
    }, [variableToEdit, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground">
                        {isEditing ? `Editar Variable: ${variableToEdit.name}` : 'Nueva Variable del Sistema'}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Las variables son utilizadas en las fórmulas de cálculo de todos los servicios arquitectónicos.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    key={isEditing ? `edit-variable-${variableToEdit.id}` : 'create-variable'}
                    {...(isEditing
                        ? variablesRoute.update.form({ variable: variableToEdit.id })
                        : variablesRoute.store.form()
                    )}
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4 pt-1"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Identificador / Nombre */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label htmlFor="var-name" className="text-xs font-semibold">
                                        Identificador de la Variable (en fórmulas)
                                    </Label>
                                    <span className="text-[10px] text-muted-foreground">
                                        Solo minúsculas y guiones bajos (ej: <code>m2</code>, <code>pozos</code>)
                                    </span>
                                </div>
                                <Input
                                    id="var-name"
                                    name="name"
                                    defaultValue={variableToEdit?.name ?? ''}
                                    placeholder="ej. m2, pozos, complejidad"
                                    className="font-mono text-xs font-bold text-primary"
                                    required
                                    autoFocus={!isEditing}
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Naturaleza y Tipo de Dato */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="var-type" className="text-xs font-semibold">
                                        Naturaleza
                                    </Label>
                                    <select
                                        id="var-type"
                                        name="type"
                                        defaultValue={variableToEdit?.type ?? 'dynamic'}
                                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus:ring-1 focus:ring-ring focus:outline-hidden"
                                        required
                                    >
                                        <option value="dynamic">Dinámica (Input para el vendedor)</option>
                                        <option value="static">Estática (Constante global)</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="var-value-type" className="text-xs font-semibold">
                                        Tipo de Dato
                                    </Label>
                                    <select
                                        id="var-value-type"
                                        name="value_type"
                                        value={currentValueType}
                                        onChange={(e) => setCurrentValueType(e.target.value as any)}
                                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs focus:ring-1 focus:ring-ring focus:outline-hidden"
                                        required
                                    >
                                        <option value="decimal">Decimal (ej. 12.11, 45.50)</option>
                                        <option value="integer">Entero (ej. 1, 2, 3 pozos)</option>
                                        <option value="string">Texto / Opciones (ej. bajo, medio, alto)</option>
                                    </select>
                                    <InputError message={errors.value_type} className="mt-1" />
                                </div>
                            </div>

                            {/* Valor por defecto */}
                            <div>
                                <Label htmlFor="var-default" className="text-xs font-semibold">
                                    Valor por Defecto / Sugerido
                                </Label>
                                <Input
                                    id="var-default"
                                    name="default_value"
                                    defaultValue={variableToEdit?.default_value ?? '0'}
                                    placeholder="ej. 0, 12.11, medio"
                                    className="mt-1 font-mono text-xs"
                                    required
                                />
                                <InputError message={errors.default_value} className="mt-1" />
                            </div>

                            {/* Opciones cuando es tipo string */}
                            {currentValueType === 'string' && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <Label htmlFor="var-options" className="text-xs font-semibold">
                                            Opciones Permitidas (separadas por coma)
                                        </Label>
                                        <span className="text-[10px] text-muted-foreground">
                                            Genera un desplegable al cotizar
                                        </span>
                                    </div>
                                    <Input
                                        id="var-options"
                                        name="options_text"
                                        defaultValue={variableToEdit?.options ? variableToEdit.options.join(', ') : ''}
                                        placeholder="ej. bajo, medio, alto"
                                        className="font-mono text-xs"
                                    />
                                    <InputError message={errors.options} className="mt-1" />
                                </div>
                            )}

                            {/* Descripción */}
                            <div>
                                <Label htmlFor="var-desc" className="text-xs font-semibold">
                                    Descripción de Uso (Ayuda para el Vendedor)
                                </Label>
                                <Input
                                    id="var-desc"
                                    name="description"
                                    defaultValue={variableToEdit?.description ?? ''}
                                    placeholder="ej. Superficie en m² construidos para el cálculo de aranceles"
                                    className="mt-1 text-xs"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            <DialogFooter className="gap-2 pt-2 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={processing}
                                    className="bg-primary text-primary-foreground font-semibold"
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Variable'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
