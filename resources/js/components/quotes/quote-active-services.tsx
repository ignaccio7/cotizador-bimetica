import { Check, Trash2 } from 'lucide-react';
import { ServiceItem } from '@/lib/quote-services';

interface QuoteActiveServicesProps {
    services: ServiceItem[];
    serviceM2Values?: Record<number, number>;
    onRemoveService?: (serviceId: number) => void;
}

/**
 * Lista de Tarjetas Resumen de Servicios Activos en el Sidebar (Paso 7.3)
 */
export function QuoteActiveServices({
    services,
    serviceM2Values = {},
    onRemoveService,
}: QuoteActiveServicesProps) {
    if (services.length === 0) {
        return (
            <p className="text-xs text-muted-foreground text-center py-2 italic">
                No hay servicios agregados todavía.
            </p>
        );
    }

    return (
        <div className="space-y-2 pt-1 max-h-[300px] overflow-y-auto pr-0.5">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="group relative flex items-start justify-between gap-2 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/50 shadow-2xs"
                >
                    <div className="flex-1 min-w-0">
                        {/* Nombre del servicio con check */}
                        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{service.name}</span>
                        </div>

                        {/* Descripción técnica */}
                        {service.description && (
                            <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                                {service.description}
                            </div>
                        )}

                        {/* Superficie computada */}
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 dark:text-secondary font-medium">
                            <span>Computado:</span>
                            <span className="font-bold">
                                {serviceM2Values[service.id] ?? 0} m²
                            </span>
                        </div>
                    </div>

                    {/* Botón para quitar servicio */}
                    <button
                        type="button"
                        onClick={() => onRemoveService?.(service.id)}
                        className="size-5 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer shrink-0"
                        title="Quitar servicio de la cotización"
                    >
                        <Trash2 className="size-3" />
                    </button>
                </div>
            ))}
        </div>
    );
}
