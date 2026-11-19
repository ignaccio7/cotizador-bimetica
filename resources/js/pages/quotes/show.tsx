import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock,
    Eye,
    EyeOff,
    Printer,
} from 'lucide-react';
import { useState } from 'react';
import type { ClientData } from '@/components/quotes/quote-client-card';
import { QuoteFinancialPanel } from '@/components/quotes/quote-financial-panel';
import type { FloorGroupItem } from '@/components/quotes/quote-floor-table';
import { QuotePrintSheet } from '@/components/quotes/quote-print-sheet';
import { QuoteShareWhatsappButton } from '@/components/quotes/quote-share-whatsapp-button';
import type { DesignParameters, ParameterItem, ServiceItem } from '@/lib/quote-services';
import quotesRoute from '@/routes/quotes';

interface ClientPayload {
    id: number;
    code: string;
    full_name: string;
    ci?: string | null;
    phone?: string | null;
    address?: string | null;
}

interface SellerPayload {
    id: number;
    name: string;
    email?: string;
}

interface FloorPayload {
    id: number;
    name: string;
    area: number | string;
    description?: string | null;
}

interface FloorGroupPayload {
    id: number;
    table_name: string;
    total_area: number | string;
    floors: FloorPayload[];
}

interface QuotedServicePayload {
    id: number;
    service_id: number;
    quote_floor_group_id?: number | null;
    subtotal: number | string;
    filled_variables?: Record<string, unknown>;
    service?: ServiceItem;
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
    filled_parameters?: Record<string, unknown>;
    filled_settings?: Record<string, string>;
    created_at: string;
    client?: ClientPayload;
    seller?: SellerPayload;
    floor_groups: FloorGroupPayload[];
    quote_services: QuotedServicePayload[];
}

interface Props {
    quote: QuoteDetail;
    parameters?: ParameterItem[];
    totalFormula?: string;
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

export default function QuoteShow({ quote, parameters = [], totalFormula }: Props) {
    const [showBreakdown, setShowBreakdown] = useState(false);

    const statusCfg = STATUS_CONFIG[quote.status] || STATUS_CONFIG.draft;
    const StatusIcon = statusCfg.icon;

    // Snapshot histórico inmutable: fórmula congelada al momento de crear la cotización
    const formula =
        (quote.filled_settings?.total_formula as string) ||
        totalFormula ||
        'services_subtotal';

    // 1. Adaptar datos del cliente al formato del documento oficial
    const clientData: ClientData = {
        fullName: quote.client?.full_name || '',
        phone: quote.client?.phone || '',
        ci: quote.client?.ci || '',
        address: quote.client?.address || '',
    };

    // 2. Adaptar parámetros de diseño guardados en JSON
    const designParameters: DesignParameters = {};
    if (quote.filled_parameters) {
        Object.entries(quote.filled_parameters).forEach(([key, val]) => {
            designParameters[key] = val !== null && val !== undefined ? String(val) : '';
        });
    }

    // 3. Extraer servicios activos con sus fórmulas y variables cargadas desde BD
    const activeServices: ServiceItem[] = (quote.quote_services || [])
        .map((qs) => qs.service)
        .filter((s): s is ServiceItem => Boolean(s));

    // 4. Reconstruir el mapa de variables ingresadas por cada servicio
    const serviceVariables: Record<number, Record<string, string>> = {};
    (quote.quote_services || []).forEach((qs) => {
        const vars: Record<string, string> = {};
        if (qs.filled_variables) {
            Object.entries(qs.filled_variables).forEach(([key, val]) => {
                vars[key] = val !== null && val !== undefined ? String(val) : '';
            });
        }
        serviceVariables[qs.service_id] = vars;
    });

    // 5. Reconstruir tablas de plantas vinculando los servicios asociados a cada grupo
    const floorGroups: FloorGroupItem[] = (quote.floor_groups || []).map((fg) => {
        const assignedServiceIds = (quote.quote_services || [])
            .filter((qs) => Number(qs.quote_floor_group_id) === Number(fg.id))
            .map((qs) => qs.service_id);

        return {
            id: String(fg.id),
            table_name: fg.table_name,
            assigned_service_ids: assignedServiceIds,
            floors: (fg.floors || []).map((f) => ({
                id: String(f.id),
                name: f.name,
                description: f.description || '',
                area: f.area,
                isActive: true,
            })),
        };
    });

    const formattedQuoteDate = (() => {
        try {
            return new Date(quote.created_at).toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch {
            return quote.created_at;
        }
    })();

    const advisorName = quote.seller?.name || 'Asesor Bimetica';

    return (
        <>
            <Head title={`Cotización ${quote.code} — BIMETICA`} />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 transition-colors duration-200 print:p-0 print:gap-0">
                {/* BARRA DE ACCIONES SUPERIOR (SIN MOTOR DE CÁLCULO — OCULTA AL IMPRIMIR) */}
                <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div className="flex items-center gap-2.5">
                        <Link
                            href={quotesRoute.index()}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors shadow-2xs"
                            title="Volver al listado de cotizaciones"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold tracking-tight text-foreground font-mono">
                                    {quote.code}
                                </h1>
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                                >
                                    <StatusIcon className="size-3" />
                                    {statusCfg.label}
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Asesor: {advisorName} · Fecha: {formattedQuoteDate}
                            </p>
                        </div>
                    </div>

                    {/* Botones de Acción: Desglosar, Compartir por WhatsApp e Imprimir */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowBreakdown((prev) => !prev)}
                            className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            title={showBreakdown ? 'Ocultar desglose de la propuesta' : 'Desglosar propuesta'}
                        >
                            {showBreakdown ? (
                                <>
                                    <EyeOff className="size-3.5 text-muted-foreground" />
                                    <span>Ocultar desglose</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="size-3.5 text-primary" />
                                    <span>Desglosar propuesta</span>
                                </>
                            )}
                        </button>

                        <QuoteShareWhatsappButton
                            quoteCode={quote.code}
                            clientData={clientData}
                            activeServices={activeServices}
                            serviceVariables={serviceVariables}
                            designParameters={designParameters}
                            availableParameters={parameters}
                            advisorName={advisorName}
                            totalFormula={formula}
                            className="sm:w-auto px-3.5 h-9"
                        />

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="bg-[#00253d] hover:bg-[#003e65] text-white font-bold h-9 px-3.5 text-xs rounded-lg shadow-sm inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="Imprimir cotización o guardar como PDF"
                        >
                            <Printer className="size-4 text-secondary" />
                            <span>Imprimir / PDF</span>
                        </button>
                    </div>
                </div>

                {/* HOJA OFICIAL BIMETICA (ANCHO COMPLETO EN PANTALLA Y FORMATO CARTA EN IMPRESIÓN) */}
                <div className="w-full bg-white rounded-xl border border-border shadow-sm p-6 sm:p-8 text-black print:border-none print:shadow-none print:p-0 print:rounded-none">
                    <QuotePrintSheet
                        quoteCode={quote.code}
                        clientData={clientData}
                        floorGroups={floorGroups}
                        activeServices={activeServices}
                        serviceVariables={serviceVariables}
                        designParameters={designParameters}
                        availableParameters={parameters}
                        advisorName={advisorName}
                        quoteDate={formattedQuoteDate}
                        savedTotalAmount={Number(quote.total_amount)}
                        totalFormula={formula}
                        beforeFooterSlot={
                            showBreakdown ? (
                                <div className="my-4 print:hidden">
                                    <QuoteFinancialPanel
                                        activeServices={activeServices}
                                        serviceVariables={serviceVariables}
                                        designParameters={designParameters}
                                        availableParameters={parameters}
                                        totalFormula={formula}
                                        onClose={() => setShowBreakdown(false)}
                                    />
                                </div>
                            ) : undefined
                        }
                    />
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
