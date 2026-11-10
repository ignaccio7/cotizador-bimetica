import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    FileText,
    Layers,
    MapPin,
    Phone,
    Printer,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

interface ClientData {
    id: number;
    code: string;
    full_name: string;
    ci?: string | null;
    phone?: string | null;
    address?: string | null;
}

interface SellerData {
    id: number;
    name: string;
    email?: string;
}

interface FloorItem {
    id: number;
    name: string;
    area: number | string;
    description?: string | null;
}

interface FloorGroupItem {
    id: number;
    table_name: string;
    total_area: number | string;
    floors: FloorItem[];
}

interface QuotedServiceItem {
    id: number;
    service_id: number;
    quote_floor_group_id?: number | null;
    subtotal: number | string;
    filled_variables?: Record<string, any>;
    service?: {
        id: number;
        name: string;
        category: string;
        description?: string | null;
    };
    floor_group?: {
        id: number;
        table_name: string;
    };
}

interface QuoteDetail {
    id: number;
    code: string;
    client_id: number;
    seller_id: number;
    status: 'draft' | 'formalized' | 'signed' | 'cancelled';
    total_amount: number | string;
    filled_parameters?: Record<string, string>;
    created_at: string;
    client?: ClientData;
    seller?: SellerData;
    floor_groups: FloorGroupItem[];
    quote_services: QuotedServiceItem[];
}

interface Props {
    quote: QuoteDetail;
}

const STATUS_CONFIG: Record<
    QuoteDetail['status'],
    { label: string; bg: string; text: string; border: string; icon: typeof Clock }
> = {
    draft: {
        label: 'Borrador',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        icon: Clock,
    },
    formalized: {
        label: 'Formalizado',
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        text: 'text-sky-700 dark:text-sky-300',
        border: 'border-sky-200 dark:border-sky-800',
        icon: Building2,
    },
    signed: {
        label: 'Firmado',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: CheckCircle2,
    },
    cancelled: {
        label: 'Anulado',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        icon: Clock,
    },
};

export default function QuoteShow({ quote }: Props) {
    const statusCfg = STATUS_CONFIG[quote.status] || STATUS_CONFIG.draft;
    const StatusIcon = statusCfg.icon;

    const formatCurrency = (amount: number | string) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(num)) return 'Bs. 0,00';
        return `Bs. ${num.toLocaleString('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('es-BO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Cotizaciones',
            href: quotesRoute.index(),
        },
        {
            title: quote.code,
            href: quotesRoute.show({ quote: quote.id }),
        },
    ];

    return (
        <>
            <Head title={`Cotización ${quote.code} — Bimetica`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200 print:p-0">
                {/* Cabecera Superior y Acciones (ocultas al imprimir) */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={quotesRoute.index()}
                                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
                                title="Volver al listado"
                            >
                                <ArrowLeft className="size-4" />
                            </Link>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
                                {quote.code}
                            </h1>
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                            >
                                <StatusIcon className="size-3.5" />
                                {statusCfg.label}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                            <Calendar className="size-3.5" />
                            <span>Registrada el {formatDate(quote.created_at)}</span>
                            {quote.seller && (
                                <>
                                    <span>•</span>
                                    <User className="size-3.5" />
                                    <span>Asesor: {quote.seller.name}</span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="text-xs cursor-pointer gap-1.5 shadow-2xs"
                        >
                            <Printer className="size-4 text-muted-foreground" />
                            Imprimir Propuesta
                        </Button>
                    </div>
                </div>

                {/* Contenido en Pantalla / Ficha Ejecutiva */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Izquierda: Ficha del Cliente y Parámetros */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Ficha del Cliente */}
                        <Card className="border-border/60 shadow-2xs">
                            <CardHeader className="p-4 pb-2 border-b border-border/40">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <User className="size-4 text-primary" />
                                    Ficha del Cliente / Propietario
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 text-xs">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                        Propietario / Comitente
                                    </span>
                                    <span className="font-bold text-sm text-foreground">
                                        {quote.client?.full_name || 'Sin nombre'}
                                    </span>
                                    {quote.client?.code && (
                                        <span className="block text-[11px] font-mono text-muted-foreground">
                                            Código: {quote.client.code}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                            Cédula (CI)
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {quote.client?.ci || 'Sin registrar'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                            Teléfono / Celular
                                        </span>
                                        <span className="font-medium text-foreground flex items-center gap-1">
                                            {quote.client?.phone ? (
                                                <>
                                                    <Phone className="size-3 text-muted-foreground" />
                                                    {quote.client.phone}
                                                </>
                                            ) : (
                                                'Sin registrar'
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {quote.client?.address && (
                                    <div className="pt-2 border-t border-border/40">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                            Dirección del Comitente
                                        </span>
                                        <span className="font-medium text-foreground flex items-center gap-1">
                                            <MapPin className="size-3 text-muted-foreground" />
                                            {quote.client.address}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Parámetros de Diseño y Viáticos */}
                        {quote.filled_parameters && Object.keys(quote.filled_parameters).length > 0 && (
                            <Card className="border-border/60 shadow-2xs">
                                <CardHeader className="p-4 pb-2 border-b border-border/40">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <Building2 className="size-4 text-secondary" />
                                        Parámetros de Diseño y Viáticos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2 text-xs">
                                    {Object.entries(quote.filled_parameters).map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between py-1 border-b border-border/30 last:border-none">
                                            <span className="text-muted-foreground capitalize font-medium">
                                                {key.replace(/_/g, ' ')}:
                                            </span>
                                            <span className="font-bold text-foreground">
                                                {String(val)}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Resumen Financiero Total */}
                        <Card className="border-primary/20 bg-primary/5 shadow-2xs">
                            <CardContent className="p-4 space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                                    Monto Total Acordado
                                </span>
                                <div className="text-2xl font-bold font-mono text-primary">
                                    {formatCurrency(quote.total_amount)}
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Propuesta comercial técnico-económica de diseño y construcción.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna Derecha: Tablas de Plantas y Servicios Cotizados */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Tablas de Plantas Arquitectónicas */}
                        <Card className="border-border/60 shadow-2xs">
                            <CardHeader className="p-4 pb-2 border-b border-border/40">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Layers className="size-4 text-primary" />
                                    Alcance Arquitectónico (Tablas de Plantas)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4 text-xs">
                                {quote.floor_groups.length === 0 ? (
                                    <p className="text-muted-foreground italic">No se registraron tablas de plantas.</p>
                                ) : (
                                    quote.floor_groups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="rounded-lg border border-border/60 overflow-hidden bg-card"
                                        >
                                            <div className="bg-muted/40 px-3.5 py-2 flex items-center justify-between border-b border-border/40">
                                                <span className="font-bold text-foreground uppercase tracking-wide">
                                                    {group.table_name}
                                                </span>
                                                <span className="font-mono font-bold text-xs bg-secondary/15 text-secondary-foreground px-2 py-0.5 rounded">
                                                    Superficie: {Number(group.total_area || 0).toFixed(2)} m²
                                                </span>
                                            </div>
                                            <div className="p-3">
                                                {group.floors && group.floors.length > 0 ? (
                                                    <table className="w-full text-xs">
                                                        <thead>
                                                            <tr className="border-b border-border/40 text-muted-foreground font-semibold text-[10px] uppercase">
                                                                <th className="pb-1 text-left">Nivel / Piso</th>
                                                                <th className="pb-1 text-right">Área (m²)</th>
                                                                <th className="pb-1 text-left pl-3">Descripción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border/30">
                                                            {group.floors.map((floor) => (
                                                                <tr key={floor.id} className="hover:bg-muted/20">
                                                                    <td className="py-1.5 font-medium text-foreground">
                                                                        {floor.name}
                                                                    </td>
                                                                    <td className="py-1.5 font-mono text-right font-bold text-foreground">
                                                                        {Number(floor.area || 0).toFixed(2)}
                                                                    </td>
                                                                    <td className="py-1.5 pl-3 text-muted-foreground text-[11px]">
                                                                        {floor.description || '—'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-muted-foreground italic text-[11px]">
                                                        Sin niveles registrados.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Servicios Cotizados */}
                        <Card className="border-border/60 shadow-2xs">
                            <CardHeader className="p-4 pb-2 border-b border-border/40">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <FileSpreadsheet className="size-4 text-primary" />
                                    Servicios Cotizados y Subtotales
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 text-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-border/40 text-muted-foreground font-semibold text-[10px] uppercase">
                                                <th className="pb-2">Servicio</th>
                                                <th className="pb-2">Tabla Asociada</th>
                                                <th className="pb-2 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                            {quote.quote_services.map((qs) => (
                                                <tr key={qs.id} className="hover:bg-muted/20">
                                                    <td className="py-2.5">
                                                        <div className="font-bold text-foreground">
                                                            {qs.service?.name || `Servicio #${qs.service_id}`}
                                                        </div>
                                                        {qs.service?.category && (
                                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                                                                {qs.service.category === 'design'
                                                                    ? 'Diseño Arquitectónico'
                                                                    : 'Construcción'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 text-muted-foreground">
                                                        {qs.floor_group?.table_name || 'General / Global'}
                                                    </td>
                                                    <td className="py-2.5 text-right font-mono font-bold text-foreground text-sm">
                                                        {formatCurrency(qs.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-border font-bold">
                                                <td colSpan={2} className="pt-3 text-right uppercase text-xs">
                                                    Total Cotización:
                                                </td>
                                                <td className="pt-3 text-right font-mono text-primary text-base">
                                                    {formatCurrency(quote.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

QuoteShow.layout = {
    breadcrumbs: [
        {
            title: 'Cotizaciones',
            href: quotesRoute.index(),
        },
    ],
};
