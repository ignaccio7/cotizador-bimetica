import { Head } from '@inertiajs/react';
import {
    DollarSign,
    Globe,
    MapPin,
    Plus,
    Save,
    Settings2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

interface ParameterItem {
    id: number;
    key: string;
    label: string;
    value: string;
    category: string;
    description: string;
}

interface CityViaticoItem {
    id: number;
    city: string;
    viatico: number;
    is_local: boolean;
    notes: string;
}

export default function AdminParametersIndex({
    parameters = [],
    cities = [],
}: {
    parameters: ParameterItem[];
    cities: CityViaticoItem[];
}) {
    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Parámetros Globales - Admin Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Parámetros Globales & Viáticos por Ciudad
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Tasas de conversión financiera y montos fijos de viáticos asignados automáticamente por ciudad.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="bg-primary text-primary-foreground font-semibold shadow-sm">
                        <Save className="mr-2 size-4" />
                        Guardar Parámetros
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Parámetros Generales */}
                <Card className="border shadow-xs">
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                            <Settings2 className="size-4 text-primary" />
                            Parámetros del Sistema
                        </CardTitle>
                        <CardDescription>
                            Configuración de moneda, tasa de cambio y directrices de redondeo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        {parameters.map((param) => (
                            <div key={param.id} className="rounded-lg border p-3.5 bg-card">
                                <div className="flex items-center justify-between">
                                    <Label className="font-bold text-foreground text-xs">
                                        {param.label}
                                    </Label>
                                    <Badge variant="outline" className="font-mono text-[10px]">
                                        {param.key}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {param.description}
                                </p>
                                <div className="mt-2.5 max-w-xs">
                                    <Input defaultValue={param.value} className="h-8 font-mono text-sm font-bold" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Viáticos Predefinidos por Ciudad */}
                <Card className="border shadow-xs">
                    <CardHeader className="border-b bg-muted/20 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                <MapPin className="size-4 text-secondary-600" />
                                Catálogo de Viáticos por Ciudad
                            </CardTitle>
                            <Badge className="bg-[#fbad03] text-primary-950 font-bold text-xs">
                                Automático en Cotizador
                            </Badge>
                        </div>
                        <CardDescription>
                            El vendedor selecciona la ciudad en la cotización; el sistema asigna el viático automáticamente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-muted/60 font-semibold uppercase text-muted-foreground border-b">
                                    <tr>
                                        <th className="px-4 py-2.5">Ciudad / Región</th>
                                        <th className="px-4 py-2.5">Viático Fijo (USD)</th>
                                        <th className="px-4 py-2.5">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {cities.map((c) => (
                                        <tr key={c.id} className="hover:bg-muted/20">
                                            <td className="px-4 py-3 font-semibold text-foreground">
                                                {c.city}
                                                {c.is_local && (
                                                    <Badge variant="outline" className="ml-2 text-[10px] text-emerald-700 bg-emerald-50">
                                                        Sede Local
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-bold text-primary">
                                                ${c.viatico.toFixed(2)} USD
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {c.notes}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parámetros Globales',
        href: admin.parameters.index(),
    },
];

AdminParametersIndex.layout = {
    breadcrumbs,
};
