import { ArrowRight, Folder, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ParameterGroupOption, ParameterItem } from './parameter-dialog';

interface ParameterGroupCardsProps {
    groups: ParameterGroupOption[];
    parameters: ParameterItem[];
    onSelectGroup: (groupKey: string) => void;
    onOpenCreate: () => void;
}

export function ParameterGroupCards({
    groups,
    parameters,
    onSelectGroup,
    onOpenCreate,
}: ParameterGroupCardsProps) {
    return (
        <div className="space-y-6">
            {/* Cabecera */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Parámetros del Sistema
                    </h1>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Selecciona un grupo para ver y configurar sus parámetros de cotización.
                    </p>
                </div>

                <Button
                    onClick={onOpenCreate}
                    className="bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer self-start sm:self-auto"
                >
                    <Plus className="mr-1.5 size-4" />
                    Nuevo Parámetro o Grupo
                </Button>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {groups.map((g) => {
                    const groupItems = parameters.filter((p) => p.group === g.group);
                    const preview = groupItems.slice(0, 3).map((item) => item.name).join(', ');

                    return (
                        <Card
                            key={g.group}
                            onClick={() => onSelectGroup(g.group)}
                            className="group relative flex flex-col justify-between p-5 border border-border/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer bg-card hover:bg-muted/10"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 rounded-lg bg-muted border border-border/60 group-hover:bg-primary/10 transition-colors">
                                        <Folder className="size-5 text-primary" />
                                    </div>
                                    <Badge variant="secondary" className="font-mono text-xs font-semibold px-2">
                                        {groupItems.length} {groupItems.length === 1 ? 'parámetro' : 'parámetros'}
                                    </Badge>
                                </div>

                                <div>
                                    <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                                        {g.label}
                                    </h2>
                                    <span className="text-[11px] font-mono text-muted-foreground">
                                        {g.group}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs">
                                <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                                    {preview ? `${preview}...` : 'Sin elementos'}
                                </span>
                                <span className="inline-flex items-center font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                                    Abrir tabla
                                    <ArrowRight className="ml-1 size-3.5" />
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
