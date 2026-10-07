import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Download,
    FileCheck,
    FileText,
    Printer,
    ScrollText,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import contractsRoute from '@/routes/contracts';
import initialFormsRoute from '@/routes/initial-forms';
import type { BreadcrumbItem } from '@/types';

interface ContractItem {
    id: number;
    contract_code: string;
    quote_code: string;
    client_code: string;
    client_name: string;
    client_ci: string;
    total_amount: number;
    template_name: string;
    created_at: string;
    status: string;
    status_label: string;
    seller_name: string;
}

export default function ContractsIndex({
    contracts = [],
}: {
    contracts: ContractItem[];
}) {
    const [selectedContract, setSelectedContract] = useState<ContractItem>(contracts[0]);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Contratos - Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Contratos Generados
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Documentos legales generados automáticamente a partir de la plantilla administrativa y datos del cliente.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="text-xs">
                        <Link href={initialFormsRoute.index()}>
                            Ver Formularios Iniciales
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Lista lateral de Contratos */}
                <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Contratos Activos ({contracts.length})
                    </div>
                    {contracts.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedContract(item)}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                selectedContract?.id === item.id
                                    ? 'border-primary bg-primary/5 shadow-xs'
                                    : 'border-border bg-card hover:border-muted-foreground/30'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="font-mono text-xs font-bold text-primary">
                                        {item.contract_code}
                                    </span>
                                    <h3 className="font-bold text-foreground text-sm mt-0.5">
                                        {item.client_name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Cotiz: {item.quote_code}
                                    </p>
                                </div>
                                <Badge variant="outline" className="text-[10px] border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <CheckCircle2 className="mr-1 size-3" />
                                    {item.status_label}
                                </Badge>
                            </div>

                            <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs">
                                <span className="font-mono font-bold text-foreground">
                                    ${item.total_amount.toFixed(2)} USD
                                </span>
                                <span className="text-muted-foreground font-mono">
                                    {item.created_at}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visor de Documento Legal */}
                <div className="lg:col-span-2">
                    {selectedContract ? (
                        <Card className="border shadow-sm">
                            <CardHeader className="border-b bg-muted/20 pb-4 flex flex-row items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-primary text-primary-foreground font-mono">
                                            {selectedContract.contract_code}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            Plantilla: {selectedContract.template_name}
                                        </span>
                                    </div>
                                    <CardTitle className="mt-2 text-xl font-bold text-foreground">
                                        Contrato Privado de Prestación de Servicios
                                    </CardTitle>
                                    <CardDescription>
                                        Cliente: {selectedContract.client_name} ({selectedContract.client_ci}) • Elaborado por: {selectedContract.seller_name}
                                    </CardDescription>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                        <Printer className="mr-1.5 size-3.5" />
                                        Imprimir
                                    </Button>
                                    <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground">
                                        <Download className="mr-1.5 size-3.5" />
                                        PDF
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                {/* Hoja de papel simulada con cláusulas */}
                                <div className="rounded-xl border bg-background p-8 font-serif text-sm leading-relaxed text-foreground/90 shadow-inner space-y-4">
                                    <div className="text-center pb-4 border-b">
                                        <h2 className="text-base font-bold uppercase tracking-wider text-foreground">
                                            CONTRATO DE PRESTACIÓN DE SERVICIOS ARQUITECTÓNICOS
                                        </h2>
                                        <p className="text-xs text-muted-foreground font-sans mt-1">
                                            BIMETICA DISEÑO Y CONSTRUCCIÓN • CÓDIGO DOCUMENTO: {selectedContract.contract_code}
                                        </p>
                                    </div>

                                    <p>
                                        Conste por el presente documento privado que surtirá efectos de instrumento público al solo reconocimiento de firmas y rúbricas, un <strong>CONTRATO DE SERVICIOS PROFESIONALES DE ARQUITECTURA E INGENIERÍA</strong>, que suscriben por una parte <strong>BIMETICA DISEÑO Y CONSTRUCCIÓN</strong> representada por su ejecutivo comercial <strong>{selectedContract.seller_name}</strong>, y por otra parte el/la Sr.(a) <span className="underline font-semibold">{selectedContract.client_name}</span> con C.I. <span className="font-mono font-semibold">{selectedContract.client_ci}</span>, de acuerdo a las siguientes cláusulas:
                                    </p>

                                    <div>
                                        <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-foreground">
                                            PRIMERA. (DEL OBJETO)
                                        </h4>
                                        <p className="mt-1">
                                            El profesional se compromete a elaborar y entregar los proyectos técnicos correspondientes a la cotización formal vinculada bajo código <strong>{selectedContract.quote_code}</strong>, respetando las normas constructivas municipales vigentes.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-foreground">
                                            SEGUNDA. (DE LOS HONORARIOS PROFESIONALES)
                                        </h4>
                                        <p className="mt-1">
                                            Por mutuo acuerdo entre las partes, el monto pactado por la totalidad de los servicios asciende a la suma de <span className="font-bold text-primary font-mono">${selectedContract.total_amount.toFixed(2)} USD</span> (Dólares Americanos), cancelables de acuerdo al cronograma de desembolsos establecido en el Formulario Inicial.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-foreground">
                                            TERCERA. (DE LA CONFORMIDAD)
                                        </h4>
                                        <p className="mt-1">
                                            Ambas partes expresan su entera conformidad con las cláusulas precedentes y firman al pie del presente en señal de aceptación.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 pt-10 text-center font-sans">
                                        <div className="border-t border-foreground/30 pt-2">
                                            <p className="text-xs font-bold">{selectedContract.client_name}</p>
                                            <p className="text-[10px] text-muted-foreground">EL CLIENTE</p>
                                        </div>
                                        <div className="border-t border-foreground/30 pt-2">
                                            <p className="text-xs font-bold">{selectedContract.seller_name}</p>
                                            <p className="text-[10px] text-muted-foreground">POR BIMETICA</p>
                                        </div>
                                    </div>
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
        title: 'Contratos',
        href: contractsRoute.index(),
    },
];

ContractsIndex.layout = {
    breadcrumbs,
};
