import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, Check, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DeleteServiceDialog } from '@/components/services/delete-service-dialog';
import { ServiceForm } from '@/components/services/service-form';
import {
    ServicesList,
    type ServiceItem,
} from '@/components/services/services-list';
import { Button } from '@/components/ui/button';
import servicesRoute from '@/routes/services';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios',
        href: servicesRoute.index(),
    },
];

interface Props {
    services?: ServiceItem[];
    selectedId?: number | null;
}

export default function ServicesIndex({ services = [], selectedId = null }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
        selectedId ?? services[0]?.id ?? null
    );
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);

    // Sincronizar selección cuando se recibe un selectedId o cuando la lista cambia
    useEffect(() => {
        if (selectedId) {
            setSelectedServiceId(selectedId);
            setIsCreating(false);
        } else if (!isCreating && selectedServiceId === null && services.length > 0) {
            setSelectedServiceId(services[0].id);
        }
    }, [selectedId, services, isCreating, selectedServiceId]);

    const selectedService = useMemo(() => {
        return services.find((s) => s.id === selectedServiceId) ?? null;
    }, [services, selectedServiceId]);

    const handleStartCreate = () => {
        setIsCreating(true);
        setSelectedServiceId(null);
    };

    const handleSuccessCreate = (page?: any) => {
        setIsCreating(false);
        const newId = page?.props?.selectedId ?? page?.props?.services?.[0]?.id;
        if (newId) {
            setSelectedServiceId(newId);
        } else if (services.length > 0) {
            setSelectedServiceId(services[0].id);
        }
    };

    const handleSelectService = (service: ServiceItem) => {
        setIsCreating(false);
        setSelectedServiceId(service.id);
    };

    const confirmDelete = () => {
        if (!deletingService) return;

        router.delete(servicesRoute.destroy({ service: deletingService.id }).url, {
            onSuccess: () => {
                setDeletingService(null);
                if (selectedServiceId === deletingService.id) {
                    const remaining = services.filter((s) => s.id !== deletingService.id);
                    setSelectedServiceId(remaining[0]?.id ?? null);
                }
            },
        });
    };

    return (
        <>
            <Head title="Servicios de Cotización" />

            <div
                className={`flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200`}
            >
                {/* Encabezado Superior */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Servicios
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configura los servicios arquitectónicos y sus alcances detallados para las cotizaciones.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleStartCreate}
                            className={`font-semibold shadow-xs transition-colors cursor-pointer ${isCreating
                                ? 'bg-secondary-600 hover:bg-secondary-700'
                                : 'bg-primary hover:bg-primary/90'
                                }`}
                        >
                            <Plus className="mr-1.5 size-4" />
                            Nuevo Servicio
                        </Button>
                    </div>
                </div>

                {/* Mensajes Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                        <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Layout Maestro - Detalle */}
                <div className="grid items-start gap-6 lg:grid-cols-12">
                    {/* Columna Izquierda: Catálogo de Servicios (4 Cols) */}
                    <div className="lg:col-span-4">
                        <ServicesList
                            services={services}
                            selectedServiceId={selectedServiceId}
                            isCreating={isCreating}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onSelectService={handleSelectService}
                            onDeleteService={setDeletingService}
                        />
                    </div>

                    {/* Columna Derecha: Visor y Editor de Detalle (8 Cols) */}
                    <div id="service-editor-panel" className="lg:col-span-8 scroll-mt-6">
                        <ServiceForm
                            selectedService={selectedService}
                            isCreating={isCreating}
                            onCancelCreate={() => {
                                setIsCreating(false);
                                setSelectedServiceId(services[0]?.id ?? null);
                            }}
                            onSuccessCreate={handleSuccessCreate}
                        />
                    </div>
                </div>
            </div>

            {/* Modal Confirmar Eliminación */}
            <DeleteServiceDialog
                service={deletingService}
                open={!!deletingService}
                onOpenChange={(open) => !open && setDeletingService(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
}

ServicesIndex.layout = {
    breadcrumbs,
};
