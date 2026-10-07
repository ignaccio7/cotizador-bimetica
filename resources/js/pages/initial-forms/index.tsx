import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    FileEdit,
    FileSignature,
    FileText,
    Plus,
    Printer,
    ScrollText,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import contractsRoute from '@/routes/contracts';
import designationsRoute from '@/routes/designations';
import initialFormsRoute from '@/routes/initial-forms';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

interface InitialFormItem {
    id: number;
    quote_code: string;
    client_code: string;
    client_name: string;
    project_name: string;
    project_address: string;
    agreed_amount: number;
    payment_mode: string;
    attention_type: string;
    marketing_source: string;
    status: 'signed' | 'pending_signature';
    signed_date: string | null;
    seller_name: string;
}

export default function InitialFormsIndex({
    initialForms = [],
}: {
    initialForms: InitialFormItem[];
}) {
    const [selectedForm, setSelectedForm] = useState<InitialFormItem>(initialForms[0]);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Formulario Inicial - Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Formularios Iniciales
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Formalización de cotizaciones como pseudo-contrato firmado entre vendedor y cliente.
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
                {/* Lista lateral de Formularios Iniciales */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Registros ({initialForms.length})
                    </div>
                    {initialForms.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedForm(item)}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                selectedForm?.id === item.id
                                    ? 'border-primary bg-primary/5 shadow-xs'
                                    : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="font-mono text-xs font-bold text-primary">
                                        {item.quote_code}
                                    </span>
                                    <h3 className="font-bold text-foreground text-sm mt-0.5">
                                        {item.client_name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {item.project_name}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] ${
                                        item.status === 'signed'
                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                            : 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                    }`}
                                >
                                    {item.status === 'signed' ? 'Firmado' : 'Pendiente'}
                                </Badge>
                            </div>

                            <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-foreground">
                                    ${item.agreed_amount.toFixed(2)} USD
                                </span>
                                <span className="text-muted-foreground font-mono">
                                    Cód: {item.client_code}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detalle y Documento del Formulario Inicial Seleccionado */}
                <div className="lg:col-span-2">
                    {selectedForm ? (
                        <Card className="border shadow-xs">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-primary text-primary-foreground font-mono">
                                                {selectedForm.quote_code}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                Cliente #{selectedForm.client_code}
                                            </span>
                                        </div>
                                        <CardTitle className="mt-2 text-xl font-bold text-foreground">
                                            {selectedForm.project_name}
                                        </CardTitle>
                                        <CardDescription>
                                            Cliente: {selectedForm.client_name} • Vendedor: {selectedForm.seller_name}
                                        </CardDescription>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-8 text-xs">
                                            <Printer className="mr-1.5 size-3.5" />
                                            Imprimir
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-6">
                                {/* Datos del Proyecto y Acuerdos */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Dirección del Emplazamiento
                                        </Label>
                                        <Input
                                            value={selectedForm.project_address}
                                            readOnly
                                            className="mt-1 bg-muted/30 font-medium text-sm"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Modalidad de Pago Acordada
                                        </Label>
                                        <div className="mt-1 p-2.5 rounded-lg border bg-muted/20 text-xs text-foreground font-medium">
                                            {selectedForm.payment_mode}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Monto Total Formalizado
                                        </Label>
                                        <div className="mt-1 p-2.5 rounded-lg border bg-primary/10 border-primary/20 text-base font-black font-mono text-primary">
                                            ${selectedForm.agreed_amount.toFixed(2)} USD
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Tipo de Atención
                                        </Label>
                                        <Input
                                            value={selectedForm.attention_type}
                                            readOnly
                                            className="mt-1 bg-muted/30 text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Origen Publicitario / Canal
                                        </Label>
                                        <Input
                                            value={selectedForm.marketing_source}
                                            readOnly
                                            className="mt-1 bg-muted/30 text-xs"
                                        />
                                    </div>
                                </div>

                                {/* Firma y Validación */}
                                <div className="rounded-xl border border-dashed p-4 bg-muted/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Constancia de Firma (Vendedor + Cliente)
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={
                                                selectedForm.status === 'signed'
                                                    ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                                                    : 'border-amber-300 text-amber-700 bg-amber-50'
                                            }
                                        >
                                            {selectedForm.status === 'signed'
                                                ? `Firmado el ${selectedForm.signed_date}`
                                                : 'Pendiente de firma física'}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center pt-8 border-t border-muted">
                                        <div className="border-t border-muted-foreground/40 pt-2">
                                            <p className="text-xs font-bold">{selectedForm.client_name}</p>
                                            <p className="text-[10px] text-muted-foreground">Firma Cliente</p>
                                        </div>
                                        <div className="border-t border-muted-foreground/40 pt-2">
                                            <p className="text-xs font-bold">{selectedForm.seller_name}</p>
                                            <p className="text-[10px] text-muted-foreground">Firma Ejecutivo Comercial</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones Siguientes del Flujo */}
                                <div className="border-t pt-4 flex flex-wrap gap-3 items-center justify-between">
                                    <div className="text-xs text-muted-foreground">
                                        Pasos siguientes desde este Formulario Inicial:
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild className="bg-primary text-primary-foreground text-xs font-semibold">
                                            <Link href={contractsRoute.index()}>
                                                <ScrollText className="mr-1.5 size-3.5" />
                                                Generar Contrato
                                            </Link>
                                        </Button>
                                        <Button asChild className="bg-[#fbad03] text-primary-950 hover:bg-[#e59d02] text-xs font-bold">
                                            <Link href={designationsRoute.index()}>
                                                <UserCheck className="mr-1.5 size-3.5" />
                                                Registrar Designación
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                            Seleccione un formulario inicial para visualizar su detalle.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Formularios Iniciales',
        href: initialFormsRoute.index(),
    },
];

InitialFormsIndex.layout = {
    breadcrumbs,
};
