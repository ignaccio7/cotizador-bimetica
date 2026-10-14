import { Layers, Search, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ServiceItem {
    id: number;
    name: string;
    description: string | null;
    created_at?: string;
}

interface ServicesListProps {
    services: ServiceItem[];
    selectedServiceId: number | null;
    isCreating: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSelectService: (service: ServiceItem) => void;
    onDeleteService: (service: ServiceItem) => void;
}

export function ServicesList({
    services,
    selectedServiceId,
    isCreating,
    searchTerm,
    onSearchChange,
    onSelectService,
    onDeleteService,
}: ServicesListProps) {
    const filteredServices = useMemo(() => {
        return services.filter((s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [services, searchTerm]);

    return (
        <div className="space-y-3">
            {/* Cabecera del Catálogo y Buscador */}
            <div className="flex items-center justify-between gap-2 pb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase shrink-0">
                    <Layers className="size-3.5 text-primary" />
                    Catálogo ({services.length})
                </span>
                <div className="relative w-44 shrink-0">
                    <Search className="absolute top-2.5 left-2.5 size-3.5 text-muted-foreground" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar servicio..."
                        className="h-8 pl-8 text-xs"
                    />
                </div>
            </div>

            {/* Lista de Cards con Scroll Limitado */}
            <div className="space-y-2 max-h-[300px] sm:max-h-[380px] lg:max-h-[calc(100vh-220px)] overflow-y-auto pr-1 focus:outline-none scroll-smooth">
                {filteredServices.map((item) => {
                    const isSelected = !isCreating && selectedServiceId === item.id;

                    return (
                        <div
                            key={item.id}
                            onClick={() => {
                                onSelectService(item);
                                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                                    document.getElementById('service-editor-panel')?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 ${
                                isSelected
                                    ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20'
                                    : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm leading-tight font-bold text-foreground">
                                    {item.name}
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="shrink-0 border-border font-mono text-[10px] font-medium text-muted-foreground"
                                >
                                    #{item.id}
                                </Badge>
                            </div>

                            {/* Extracto de la descripción multilínea */}
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {item.description || 'Sin descripción registrada.'}
                            </p>

                            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                                <span>
                                    {item.created_at
                                        ? `Creado: ${item.created_at.substring(0, 10)}`
                                        : 'Catálogo base'}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-1.5 text-[10px] text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteService(item);
                                    }}
                                >
                                    <Trash2 className="mr-1 size-3" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    );
                })}

                {filteredServices.length === 0 && (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                        No se encontraron servicios con ese criterio.
                    </div>
                )}
            </div>
        </div>
    );
}
