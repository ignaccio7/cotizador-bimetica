import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Eye, FileSpreadsheet, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import quotesRoute from '@/routes/quotes';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cotizaciones',
        href: quotesRoute.index(),
    },
];

interface ClientSummary {
    id: number;
    code: string;
    full_name: string;
    ci?: string | null;
    phone?: string | null;
}

interface SellerSummary {
    id: number;
    name: string;
}

interface QuotedServiceItem {
    id: number;
    service_id: number;
    service?: {
        id: number;
        name: string;
    };
}

interface QuoteListItem {
    id: number;
    code: string;
    client_id: number;
    seller_id: number;
    status: 'draft' | 'formalized' | 'signed' | 'cancelled';
    total_amount: string | number;
    created_at: string;
    client?: ClientSummary;
    seller?: SellerSummary;
    quote_services?: QuotedServiceItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedQuotes {
    data: QuoteListItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Props {
    quotes: PaginatedQuotes;
    filters?: {
        search?: string;
    };
}

const STATUS_LABELS: Record<QuoteListItem['status'], { label: string; badgeClass: string }> = {
    draft: {
        label: 'Borrador',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    },
    formalized: {
        label: 'Formalizado',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    },
    signed: {
        label: 'Firmado',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    },
    cancelled: {
        label: 'Anulado',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    },
};

export default function QuotesIndex({ quotes, filters }: Props) {
    const { auth, flash } = usePage<{ auth: Auth; flash?: { success?: string; error?: string } }>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            quotesRoute.index.url(),
            { search: searchTerm.trim() || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        router.get(quotesRoute.index.url(), {}, { preserveState: true, replace: true });
    };

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
                month: 'short',
                year: 'numeric',
            }).format(date);
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <Head title="Cotizaciones — Bimetica" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200">
                {/* Cabecera Principal */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FileSpreadsheet className="size-5" />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Cotizaciones
                            </h1>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Listado comercial con buscador y paginación.
                        </p>
                    </div>

                    <Link href={quotesRoute.create()}>
                        <Button className="bg-primary font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer self-start sm:self-auto gap-1.5">
                            <Plus className="size-4" />
                            Nueva Cotización
                        </Button>
                    </Link>
                </div>

                {/* Mensajes Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                        <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Buscador Simple */}
                <div className="flex items-center justify-between gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por código (COT-...), cliente o CI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-8 text-xs bg-card"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Limpiar búsqueda"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Tabla de Cotizaciones */}
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="py-3 px-4">Código</th>
                                    <th className="py-3 px-4">Cliente</th>
                                    {isAdmin && <th className="py-3 px-4">Vendedor</th>}
                                    <th className="py-3 px-4">Servicios</th>
                                    <th className="py-3 px-4 text-right">Total Acordado</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Fecha</th>
                                    <th className="py-3 px-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {quotes.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 8 : 7} className="py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileSpreadsheet className="size-8 text-muted-foreground/40 stroke-1" />
                                                <p className="font-medium text-foreground text-sm">
                                                    No se encontraron cotizaciones
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {searchTerm
                                                        ? 'No hay resultados que coincidan con la búsqueda.'
                                                        : 'Aún no se ha registrado ninguna cotización comercial.'}
                                                </p>
                                                {searchTerm ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleClearSearch}
                                                        className="mt-2 text-xs"
                                                    >
                                                        Restablecer búsqueda
                                                    </Button>
                                                ) : (
                                                    <Link href={quotesRoute.create()}>
                                                        <Button size="sm" className="mt-2 bg-primary text-xs gap-1">
                                                            <Plus className="size-3.5" />
                                                            Crear primera cotización
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    quotes.data.map((quote) => {
                                        const statusCfg = STATUS_LABELS[quote.status] || STATUS_LABELS.draft;

                                        return (
                                            <tr key={quote.id} className="hover:bg-muted/30 transition-colors">
                                                {/* Código */}
                                                <td className="py-3.5 px-4 font-mono font-semibold text-primary">
                                                    <Link
                                                        href={quotesRoute.show({ quote: quote.id })}
                                                        className="bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded border border-primary/20 transition-colors inline-block"
                                                        title="Ver detalle de la cotización"
                                                    >
                                                        {quote.code}
                                                    </Link>
                                                </td>

                                                {/* Cliente */}
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-foreground">
                                                        {quote.client?.full_name || 'Sin nombre'}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                                                        {quote.client?.ci && <span>CI: {quote.client.ci}</span>}
                                                        {quote.client?.phone && <span>Tel: {quote.client.phone}</span>}
                                                    </div>
                                                </td>

                                                {/* Vendedor (Solo visible para Admin) */}
                                                {isAdmin && (
                                                    <td className="py-3.5 px-4 text-muted-foreground">
                                                        {quote.seller?.name || 'Administrador'}
                                                    </td>
                                                )}

                                                {/* Servicios Cotizados */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {quote.quote_services && quote.quote_services.length > 0 ? (
                                                            quote.quote_services.map((qs) => (
                                                                <span
                                                                    key={qs.id}
                                                                    className="inline-flex items-center rounded bg-secondary/15 text-secondary-foreground text-[10px] font-medium px-1.5 py-0.5"
                                                                >
                                                                    {qs.service?.name || `Servicio #${qs.service_id}`}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[11px] text-muted-foreground italic">
                                                                Sin servicios
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Total Acordado */}
                                                <td className="py-3.5 px-4 font-mono font-bold text-right text-foreground">
                                                    {formatCurrency(quote.total_amount)}
                                                </td>

                                                {/* Estado */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusCfg.badgeClass}`}
                                                    >
                                                        {statusCfg.label}
                                                    </span>
                                                </td>

                                                {/* Fecha */}
                                                <td className="py-3.5 px-4 text-right text-muted-foreground text-[11px]">
                                                    {formatDate(quote.created_at)}
                                                </td>

                                                {/* Acciones */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <Link
                                                        href={quotesRoute.show({ quote: quote.id })}
                                                        className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                                                        title="Ver detalle de la propuesta"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {quotes.total > quotes.per_page && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                            <div>
                                Mostrando{' '}
                                <span className="font-medium text-foreground">{quotes.from || 0}</span> a{' '}
                                <span className="font-medium text-foreground">{quotes.to || 0}</span> de{' '}
                                <span className="font-medium text-foreground">{quotes.total}</span> cotizaciones
                            </div>

                            <div className="flex items-center gap-1">
                                {quotes.links.map((link, idx) => {
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '← Ant')
                                        .replace('Next &raquo;', 'Sig →')
                                        .replace('&laquo; Anterior', '← Ant')
                                        .replace('Siguiente &raquo;', 'Sig →');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 text-xs text-muted-foreground/50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveState
                                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

QuotesIndex.layout = {
    breadcrumbs,
};
