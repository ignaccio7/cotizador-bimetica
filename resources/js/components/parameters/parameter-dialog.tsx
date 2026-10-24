import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import parametersRoute from '@/routes/parameters';

export interface ParameterItem {
    id: number;
    group: string;
    group_label?: string | null;
    name: string;
    type: 'number' | 'percentage' | 'text';
    value: string | number;
    description?: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ParameterGroupOption {
    group: string;
    label: string;
}

interface ParameterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parameterToEdit?: ParameterItem | null;
    existingGroups: ParameterGroupOption[];
    defaultGroup?: string;
}

export function ParameterDialog({
    open,
    onOpenChange,
    parameterToEdit,
    existingGroups,
    defaultGroup,
}: ParameterDialogProps) {
    const isEditing = !!parameterToEdit;

    // Estado del grupo
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [customGroup, setCustomGroup] = useState<string>('');
    const [customGroupLabel, setCustomGroupLabel] = useState<string>('');

    // Tipo y estado activo
    const [paramType, setParamType] = useState<'number' | 'percentage' | 'text'>('number');
    const [isActive, setIsActive] = useState<boolean>(true);

    useEffect(() => {
        if (parameterToEdit) {
            setSelectedGroup(parameterToEdit.group);
            setCustomGroup(parameterToEdit.group);
            setCustomGroupLabel(parameterToEdit.group_label ?? '');
            setParamType(parameterToEdit.type ?? 'number');
            setIsActive(parameterToEdit.is_active);
        } else {
            const initialGroup = defaultGroup || (existingGroups[0]?.group ?? 'viatico');
            setSelectedGroup(initialGroup);
            const found = existingGroups.find((g) => g.group === initialGroup);
            setCustomGroup(initialGroup);
            setCustomGroupLabel(found ? found.label : '');
            setParamType(initialGroup === 'discount' ? 'percentage' : 'number');
            setIsActive(true);
        }
    }, [parameterToEdit, open, defaultGroup, existingGroups]);

    const isCreatingNewGroup = selectedGroup === '__new__';

    const handleGroupSelect = (groupValue: string) => {
        setSelectedGroup(groupValue);
        if (groupValue !== '__new__') {
            const found = existingGroups.find((g) => g.group === groupValue);
            setCustomGroup(groupValue);
            setCustomGroupLabel(found ? found.label : '');
            if (groupValue === 'discount') {
                setParamType('percentage');
            } else {
                setParamType('number');
            }
        } else {
            setCustomGroup('');
            setCustomGroupLabel('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground">
                        {isEditing ? `Editar Parámetro: ${parameterToEdit.name}` : 'Nuevo Parámetro Global'}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Configura valores de referencia para viáticos de ciudad, categorías arquitectónicas y descuentos comerciales.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    key={isEditing ? `edit-parameter-${parameterToEdit.id}` : `create-parameter-${open}`}
                    {...(isEditing
                        ? parametersRoute.update.form({ parameter: parameterToEdit.id })
                        : parametersRoute.store.form()
                    )}
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4 pt-1"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Selección de Grupo */}
                            <div>
                                <Label htmlFor="param-group-select" className="text-xs font-semibold">
                                    Grupo de Clasificación
                                </Label>
                                <select
                                    id="param-group-select"
                                    value={selectedGroup}
                                    onChange={(e) => handleGroupSelect(e.target.value)}
                                    disabled={isEditing}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
                                >
                                    {existingGroups.map((g) => (
                                        <option key={g.group} value={g.group}>
                                            {g.label} ({g.group})
                                        </option>
                                    ))}
                                    <option value="__new__">+ Crear nuevo grupo personalizado...</option>
                                </select>
                            </div>

                            {/* Inputs si es un grupo nuevo o personalizado */}
                            {isCreatingNewGroup && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg border border-dashed border-primary/30">
                                    <div>
                                        <Label htmlFor="custom-group" className="text-xs font-semibold">
                                            Clave Técnica del Grupo
                                        </Label>
                                        <Input
                                            id="custom-group"
                                            value={customGroup}
                                            onChange={(e) => setCustomGroup(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                                            placeholder="ej. modalidad_pago"
                                            className="font-mono text-xs mt-1"
                                            required
                                        />
                                        <span className="text-[10px] text-muted-foreground">
                                            En minúsculas con guión bajo.
                                        </span>
                                    </div>
                                    <div>
                                        <Label htmlFor="custom-group-label" className="text-xs font-semibold">
                                            Etiqueta Visible del Grupo
                                        </Label>
                                        <Input
                                            id="custom-group-label"
                                            value={customGroupLabel}
                                            onChange={(e) => setCustomGroupLabel(e.target.value)}
                                            placeholder="ej. Modalidades de Pago"
                                            className="text-xs mt-1"
                                            required
                                        />
                                        <span className="text-[10px] text-muted-foreground">
                                            Visible en tabs y cotizaciones.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Campos ocultos serializados para enviar el group y group_label correctos */}
                            <input type="hidden" name="group" value={customGroup} />
                            <input type="hidden" name="group_label" value={customGroupLabel} />
                            <InputError message={errors.group} className="mt-1" />

                            {/* Nombre del Parámetro / Opción */}
                            <div>
                                <Label htmlFor="param-name" className="text-xs font-semibold">
                                    Nombre de la Opción o Elemento
                                </Label>
                                <Input
                                    id="param-name"
                                    name="name"
                                    defaultValue={parameterToEdit?.name ?? ''}
                                    placeholder="ej. Santa Cruz de la Sierra, Residencial, Descuento 10%"
                                    className="text-xs font-medium text-foreground mt-1"
                                    required
                                    autoFocus={!isEditing}
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Tipo y Valor */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="param-type" className="text-xs font-semibold">
                                        Tipo de Valor
                                    </Label>
                                    <select
                                        id="param-type"
                                        name="type"
                                        value={paramType}
                                        onChange={(e) => setParamType(e.target.value as 'number' | 'percentage')}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus:border-primary focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="number">Numérico (Monto fijo o factor)</option>
                                        <option value="percentage">Porcentaje (%)</option>
                                    </select>
                                    <InputError message={errors.type} className="mt-1" />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="param-value" className="text-xs font-semibold">
                                            Valor
                                        </Label>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            {paramType === 'percentage' ? '%' : 'número'}
                                        </span>
                                    </div>
                                    <Input
                                        id="param-value"
                                        name="value"
                                        type="number"
                                        step="any"
                                        defaultValue={parameterToEdit?.value !== undefined ? String(parameterToEdit.value) : '0'}
                                        placeholder="0.00"
                                        className="text-xs font-mono font-bold text-primary mt-1"
                                        required
                                    />
                                    <InputError message={errors.value} className="mt-1" />
                                </div>
                            </div>

                            {/* Descripción Opcional */}
                            <div>
                                <Label htmlFor="param-description" className="text-xs font-semibold">
                                    Descripción o Alcance (Opcional)
                                </Label>
                                <Input
                                    id="param-description"
                                    name="description"
                                    defaultValue={parameterToEdit?.description ?? ''}
                                    placeholder="ej. Aplica para clientes con pago al contado o proyectos mayores a 300 m²"
                                    className="text-xs text-foreground mt-1"
                                />
                                <InputError message={errors.description} className="mt-1" />
                            </div>

                            {/* Toggle Activo */}
                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="param-is-active"
                                    checked={isActive}
                                    onCheckedChange={(checked) => setIsActive(!!checked)}
                                />
                                <Label htmlFor="param-is-active" className="text-xs text-foreground cursor-pointer font-normal">
                                    Habilitado para selección en cotizaciones
                                </Label>
                                <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
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
                                    disabled={processing || !customGroup.trim()}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                >
                                    {processing ? 'Guardando...' : isEditing ? 'Actualizar Parámetro' : 'Crear Parámetro'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
