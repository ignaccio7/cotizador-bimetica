import { Head } from '@inertiajs/react';
import {
    Code2,
    Copy,
    FileText,
    Plus,
    Save,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface TemplateItem {
    id: number;
    name: string;
    description: string;
    version: string;
    is_active: boolean;
    available_placeholders: string[];
    sample_clause: string;
    updated_at: string;
}

export default function AdminContractTemplatesIndex({
    templates = [],
}: {
    templates: TemplateItem[];
}) {
    const [selectedTemplate] = useState<TemplateItem>(templates[0]);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Plantillas de Contrato - Admin Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Plantillas de Contrato
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Plantilla global con placeholders automáticos inyectados a partir del Formulario Inicial.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
                        <Save className="mr-2 size-4" />
                        Guardar Plantilla
                    </Button>
                </div>
            </div>

            {selectedTemplate && (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Placeholders disponibles */}
                    <Card className="border shadow-xs">
                        <CardHeader className="border-b bg-muted/20 pb-4">
                            <CardTitle className="text-base font-bold text-foreground">
                                Placeholders Disponibles
                            </CardTitle>
                            <CardDescription>
                                Se sustituyen automáticamente con los datos de la cotización y el cliente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            <div className="flex flex-col gap-1.5">
                                {selectedTemplate.available_placeholders.map((ph) => (
                                    <div
                                        key={ph}
                                        className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-xs font-mono"
                                    >
                                        <span className="font-semibold text-primary">{ph}</span>
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:text-foreground"
                                            title="Copiar placeholder"
                                        >
                                            <Copy className="size-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editor de Contrato */}
                    <Card className="lg:col-span-2 border shadow-xs">
                        <CardHeader className="border-b bg-muted/20 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-foreground">
                                    {selectedTemplate.name}
                                </CardTitle>
                                <CardDescription>
                                    Versión {selectedTemplate.version} • {selectedTemplate.description}
                                </CardDescription>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300">
                                Plantilla Oficial Activa
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                                    Cuerpo del Documento HTML con Placeholders
                                </label>
                                <textarea
                                    defaultValue={selectedTemplate.sample_clause}
                                    rows={12}
                                    className="w-full rounded-xl border border-input bg-card p-4 font-mono text-xs leading-relaxed focus-visible:outline-none"
                                />
                            </div>

                            <div className="rounded-xl border border-dashed p-4 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    * El vendedor no edita las cláusulas legales, únicamente los datos específicos del cliente.
                                </span>
                                <Button size="sm" className="bg-primary text-primary-foreground font-semibold">
                                    Actualizar Plantilla
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plantillas de Contrato',
        href: admin.contractTemplates.index(),
    },
];

AdminContractTemplatesIndex.layout = {
    breadcrumbs,
};
