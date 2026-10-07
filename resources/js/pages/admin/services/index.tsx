import { Head, Link } from '@inertiajs/react';
import {
    Calculator,
    Check,
    Code2,
    Layers,
    Plus,
    Sliders,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface ServiceItem {
    id: number;
    name: string;
    description: string;
    formula: string;
    variables: string[];
    is_active: boolean;
    updated_at: string;
}

export default function AdminServicesIndex({
    services = [],
}: {
    services: ServiceItem[];
}) {
    const [selectedService, setSelectedService] = useState<ServiceItem>(services[0]);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Servicios y Fórmulas - Admin Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Servicios y Fórmulas de Cotización
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Configuración del catálogo maestro y evaluación de fórmulas condicionales en Math.js.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
                        <Plus className="mr-2 size-4" />
                        Nuevo Servicio
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Lista lateral de Servicios */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Catálogo de Servicios ({services.length})
                    </div>
                    {services.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedService(item)}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                selectedService?.id === item.id
                                    ? 'border-primary bg-primary/5 shadow-xs'
                                    : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-bold text-foreground text-sm">
                                    {item.name}
                                </h3>
                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300">
                                    Activo
                                </Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                            </p>
                            <div className="mt-3 pt-2.5 border-t flex flex-wrap gap-1">
                                {item.variables.map((v) => (
                                    <span
                                        key={v}
                                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                                    >
                                        ${'{' + v + '}'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor y Fórmulas */}
                <div className="lg:col-span-2">
                    {selectedService ? (
                        <Card className="border shadow-xs">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-foreground">
                                            {selectedService.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {selectedService.description}
                                        </CardDescription>
                                    </div>
                                    <Badge className="bg-primary text-primary-foreground font-mono">
                                        ID #{selectedService.id}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {/* Expresión de la Fórmula */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                            <Code2 className="size-4 text-primary" />
                                            Expresión de Cálculo (Math.js)
                                        </label>
                                        <span className="text-[11px] text-muted-foreground">
                                            Condicionales directos mediante operador ternario
                                        </span>
                                    </div>
                                    <div className="rounded-xl border bg-slate-950 p-4 font-mono text-sm text-emerald-400 shadow-inner">
                                        <code>{selectedService.formula}</code>
                                    </div>
                                </div>

                                {/* Variables Utilizadas */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                                        Variables Vinculadas a este Servicio
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedService.variables.map((v) => (
                                            <Badge
                                                key={v}
                                                variant="outline"
                                                className="px-2.5 py-1 font-mono text-xs border-primary/30 bg-primary/5 text-primary"
                                            >
                                                variable: {v}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Simulador interactivo de prueba de fórmula */}
                                <div className="rounded-xl border border-dashed p-4 bg-muted/20 space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                                        <Sparkles className="size-3.5 text-[#fbad03]" />
                                        Simulador en Vivo de Fórmula
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Pruebe el resultado instantáneo con valores de ejemplo para verificar el redondeo y las condiciones de monto mínimo.
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                        <div>
                                            <span className="text-[11px] font-semibold text-muted-foreground block">
                                                m2 de prueba
                                            </span>
                                            <Input defaultValue={250} type="number" className="h-8 text-xs font-mono mt-1" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-semibold text-muted-foreground block">
                                                Resultado Simulado
                                            </span>
                                            <div className="h-8 rounded-md border bg-background px-3 flex items-center font-mono font-bold text-sm text-primary mt-1">
                                                $6,000.00 USD
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex justify-end gap-2">
                                    <Button variant="outline" size="sm">
                                        Descartar
                                    </Button>
                                    <Button size="sm" className="bg-primary text-primary-foreground font-semibold">
                                        Guardar Fórmula
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servicios & Fórmulas',
        href: admin.services.index(),
    },
];

AdminServicesIndex.layout = {
    breadcrumbs,
};
