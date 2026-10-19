import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import type { ServiceItem } from '@/components/services/services-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import servicesRoute from '@/routes/services';

interface ServiceFormProps {
    selectedService: ServiceItem | null;
    isCreating: boolean;
    onCancelCreate: () => void;
    onSuccessCreate: (page?: any) => void;
}

export function ServiceForm({
    selectedService,
    isCreating,
    onCancelCreate,
    onSuccessCreate,
}: ServiceFormProps) {
    if (isCreating) {
        return (
            <Card className="border-secondary-600/40 bg-secondary-50/50 shadow-xs ring-1 ring-secondary-500/20 dark:border-emerald-700/50 dark:bg-emerald-950/25">
                <CardHeader className="border-b border-secondary-600/20 bg-secondary-50/60 pb-4 dark:bg-secondary-900/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-foreground">
                                Nuevo Servicio Arquitectónico
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs text-muted-foreground">
                                Define el nombre comercial y el alcance de entregables numerados para las cotizaciones.
                            </CardDescription>
                        </div>
                        <Badge className="bg-secondary-600 text-white font-medium text-[11px] shadow-xs hover:bg-secondary-600">
                            Modo Creación
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <Form
                        key="create-service-form"
                        {...servicesRoute.store.form()}
                        onSuccess={(page) => onSuccessCreate(page)}
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Nombre */}
                                <div>
                                    <Label htmlFor="create-name">Nombre del Servicio</Label>
                                    <Input
                                        id="create-name"
                                        name="name"
                                        placeholder="ej. Planos 2D, Diseño Arquitectónico 3D"
                                        className="mt-1.5 font-bold text-sm tracking-wide bg-background"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-1.5" />
                                </div>

                                {/* Descripción y Entregables */}
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <Label htmlFor="create-description">
                                            Descripción y Entregables (Conserva saltos de línea)
                                        </Label>
                                        <span className="text-[11px] text-muted-foreground">
                                            Escribe los puntos numerados y notas de alcance
                                        </span>
                                    </div>
                                    <textarea
                                        id="create-description"
                                        name="description"
                                        rows={8}
                                        defaultValue={'1) \n2) \n3) \nNo incluye Visado.'}
                                        placeholder="1) Planos en autoCAD y PDF&#10;2) Esquema de Fundaciones,&#10;No incluye Visado."
                                        className="w-full rounded-md border border-input bg-background p-3 text-xs leading-relaxed font-sans shadow-xs whitespace-pre-wrap focus:ring-1 focus:ring-ring focus:outline-hidden"
                                    />
                                    <InputError message={errors.description} className="mt-1.5" />
                                </div>

                                {/* Botones */}
                                <div className="flex items-center justify-between border-t border-emerald-500/20 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCancelCreate}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-secondary-600 font-semibold text-white shadow-xs hover:bg-secondary-700"
                                    >
                                        Crear Servicio
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        );
    }

    if (!selectedService) {
        return (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                Selecciona un servicio del catálogo para ver o editar sus detalles.
            </div>
        );
    }

    return (
        <Card className="border shadow-xs bg-card">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-foreground">
                            {selectedService.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-xs">
                            Configuración de nombre comercial y alcance de entregables para cotizaciones.
                        </CardDescription>
                    </div>
                    <Badge className="bg-primary font-mono text-xs text-primary-foreground">
                        ID #{selectedService.id}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <Form
                    key={`edit-service-${selectedService.id}`}
                    {...servicesRoute.update.form({ service: selectedService.id })}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Nombre */}
                            <div>
                                <Label htmlFor={`edit-name-${selectedService.id}`}>
                                    Nombre del Servicio
                                </Label>
                                <Input
                                    id={`edit-name-${selectedService.id}`}
                                    name="name"
                                    defaultValue={selectedService.name}
                                    placeholder="ej. Planos 2D, Diseño Arquitectónico 3D"
                                    className="mt-1.5 font-bold text-sm tracking-wide"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1.5" />
                            </div>

                            {/* Descripción y Entregables */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <Label htmlFor={`edit-desc-${selectedService.id}`}>
                                        Descripción y Entregables (Conserva saltos de línea)
                                    </Label>
                                    <span className="text-[11px] text-muted-foreground">
                                        Escribe los puntos numerados y notas de alcance
                                    </span>
                                </div>
                                <textarea
                                    id={`edit-desc-${selectedService.id}`}
                                    name="description"
                                    rows={8}
                                    defaultValue={selectedService.description ?? ''}
                                    placeholder="1) Planos en autoCAD y PDF&#10;2) Esquema de Fundaciones,&#10;No incluye Visado."
                                    className="w-full rounded-md border border-input bg-background p-3 text-xs leading-relaxed font-sans shadow-xs whitespace-pre-wrap focus:ring-1 focus:ring-ring focus:outline-hidden"
                                />
                                <InputError message={errors.description} className="mt-1.5" />
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-between border-t border-border pt-4">
                                <span className="text-xs text-muted-foreground">
                                    Modifica los campos y haz clic en Guardar Cambios.
                                </span>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
