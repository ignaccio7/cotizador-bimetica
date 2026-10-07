import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Contact,
    FolderKanban,
    HardHat,
    Plus,
    Save,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import designationsRoute from '@/routes/designations';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

interface DesignationItem {
    id: number;
    code: string;
    quote_code: string;
    client_code: string;
    client_name: string;
    project_name: string;
    designated_date: string;
    delivery_deadline: string;
    seller_coordinator: string;
    technical_notes: string;
    status: string;
    status_label: string;
}

export default function DesignationsIndex({
    designations = [],
}: {
    designations: DesignationItem[];
}) {
    const [selectedDesignation, setSelectedDesignation] = useState<DesignationItem>(designations[0]);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Designación Proyectista - Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Designación de Proyectos
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Instrucciones técnicas, especificaciones de cálculo y plazos de entrega a cargo del ejecutivo comercial.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="text-xs">
                        <Link href={quotesRoute.index()}>
                            Ver Cotizaciones
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Lista lateral de Designaciones */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Proyectos Asignados ({designations.length})
                    </div>
                    {designations.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedDesignation(item)}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                selectedDesignation?.id === item.id
                                    ? 'border-primary bg-primary/5 shadow-xs'
                                    : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="font-mono text-xs font-bold text-primary">
                                        {item.code}
                                    </span>
                                    <h3 className="font-bold text-foreground text-sm mt-0.5">
                                        {item.project_name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {item.client_name}
                                    </p>
                                </div>
                                <Badge variant="outline" className="text-[10px] border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <Clock className="mr-1 size-3" />
                                    {item.status_label}
                                </Badge>
                            </div>

                            <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs text-muted-foreground">
                                <span>Plazo: {item.delivery_deadline}</span>
                                <span className="font-mono">Cotiz: {item.quote_code}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Formulario y Ficha Técnica de la Designación */}
                <div className="lg:col-span-2">
                    {selectedDesignation ? (
                        <Card className="border shadow-xs">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-[#fbad03] text-primary-950 font-bold font-mono">
                                                {selectedDesignation.code}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                Cotización {selectedDesignation.quote_code}
                                            </span>
                                        </div>
                                        <CardTitle className="mt-2 text-xl font-bold text-foreground">
                                            {selectedDesignation.project_name}
                                        </CardTitle>
                                        <CardDescription>
                                            Cliente: {selectedDesignation.client_name} (Cód: {selectedDesignation.client_code})
                                        </CardDescription>
                                    </div>

                                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-semibold text-xs py-1 px-2.5">
                                        <UserCheck className="mr-1.5 size-3.5" />
                                        Coordinador: {selectedDesignation.seller_coordinator}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-primary" />
                                            Fecha de Designación
                                        </Label>
                                        <Input
                                            value={selectedDesignation.designated_date}
                                            readOnly
                                            className="mt-1 bg-muted/30 font-medium text-sm"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Clock className="size-3.5 text-[#fbad03]" />
                                            Plazo Límite de Entrega Técnica
                                        </Label>
                                        <Input
                                            value={selectedDesignation.delivery_deadline}
                                            readOnly
                                            className="mt-1 bg-muted/30 font-medium text-sm font-mono text-primary"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Ejecutivo Comercial a Cargo (Coordinador)
                                        </Label>
                                        <Input
                                            value={selectedDesignation.seller_coordinator}
                                            readOnly
                                            className="mt-1 bg-muted/30 font-bold text-sm"
                                        />
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            * Nota del sistema: En Bimetica, la coordinación técnica y comercial es gestionada directamente por el mismo ejecutivo comercial.
                                        </p>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Instrucciones Técnicas y Notas del Proyecto
                                        </Label>
                                        <textarea
                                            value={selectedDesignation.technical_notes}
                                            readOnly
                                            rows={4}
                                            className="mt-1 w-full rounded-md border border-input bg-muted/30 p-3 text-sm font-sans focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex justify-end">
                                    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
                                        <Save className="mr-2 size-4" />
                                        Actualizar Instrucciones
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
        title: 'Designación Proyectista',
        href: designationsRoute.index(),
    },
];

DesignationsIndex.layout = {
    breadcrumbs,
};
