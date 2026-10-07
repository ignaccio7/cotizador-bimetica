import { Head, Link } from '@inertiajs/react';
import {
    CirclePlus,
    FileSpreadsheet,
    FileText,
    FolderKanban,
    Search,
    TrendingUp,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    Filter,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import initialFormsRoute from '@/routes/initial-forms';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

interface QuoteItem {
    id: number;
    code: string;
    client_code: string;
    client_name: string;
    project_name: string;
    status: 'draft' | 'initial_form' | 'contract_generated' | 'designated';
    status_label: string;
    total_amount: number;
    currency: string;
    services_count: number;
    services: string[];
    created_at: string;
    seller_name: string;
}

interface QuotesIndexProps {
    quotes: QuoteItem[];
    stats: {
        total_quoted: number;
        active_quotes: number;
        in_draft: number;
        formalized: number;
    };
}

export default function QuotesIndex({ quotes = [], stats }: QuotesIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredQuotes = quotes.filter((q) => {
        const matchesSearch =
            q.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.client_code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            selectedStatus === 'all' || q.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: QuoteItem['status'], label: string) => {
        switch (status) {
            case 'draft':
                return (
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                        <Clock className="mr-1 size-3" />
                        {label}
                    </Badge>
                );
            case 'initial_form':
                return (
                    <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300">
                        <FileText className="mr-1 size-3" />
                        {label}
                    </Badge>
                );
            case 'contract_generated':
                return (
                    <Badge variant="outline" className="border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                        <CheckCircle2 className="mr-1 size-3" />
                        {label}
                    </Badge>
                );
            case 'designated':
                return (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <FolderKanban className="mr-1 size-3" />
                        {label}
                    </Badge>
                );
            default:
                return <Badge>{label}</Badge>;
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Mis Cotizaciones - Bimetica" />

            {/* Cabecera Principal */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Mis Cotizaciones
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Seguimiento comercial de propuestas, clientes y proyectos arquitectónicos.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold">
                        <Link href={quotesRoute.create()}>
                            <CirclePlus className="mr-2 size-4" />
                            Nueva Cotización
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Tarjetas KPI */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Total Cotizado
                        </CardTitle>
                        <TrendingUp className="size-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">
                            ${stats?.total_quoted?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '39,250.00'}{' '}
                            <span className="text-xs font-normal text-muted-foreground">USD</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Volumen comercial del periodo
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#fbad03] shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Propuestas Activas
                        </CardTitle>
                        <FileSpreadsheet className="size-4 text-[#fbad03]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">
                            {stats?.active_quotes ?? quotes.length}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            En distintas fases comerciales
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            En Borrador
                        </CardTitle>
                        <Clock className="size-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">
                            {stats?.in_draft ?? 1}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Pendientes de formalización
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-xs">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Formalizadas / Contrato
                        </CardTitle>
                        <CheckCircle2 className="size-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-foreground">
                            {stats?.formalized ?? 3}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Con formulario o contrato listo
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Barra de Filtros y Búsqueda */}
            <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por cliente, código o proyecto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    <Filter className="size-4 text-muted-foreground shrink-0 hidden sm:inline" />
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedStatus === 'all'
                                ? 'bg-primary text-primary-foreground font-semibold'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Todos ({quotes.length})
                    </button>
                    <button
                        onClick={() => setSelectedStatus('draft')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedStatus === 'draft'
                                ? 'bg-amber-600 text-white font-semibold'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Borradores
                    </button>
                    <button
                        onClick={() => setSelectedStatus('initial_form')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedStatus === 'initial_form'
                                ? 'bg-sky-600 text-white font-semibold'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Form. Inicial
                    </button>
                    <button
                        onClick={() => setSelectedStatus('contract_generated')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedStatus === 'contract_generated'
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Contrato
                    </button>
                    <button
                        onClick={() => setSelectedStatus('designated')}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedStatus === 'designated'
                                ? 'bg-emerald-600 text-white font-semibold'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        Designados
                    </button>
                </div>
            </div>

            {/* Listado de Cotizaciones */}
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-5 py-3.5">Código</th>
                                <th className="px-5 py-3.5">Cliente</th>
                                <th className="px-5 py-3.5">Proyecto</th>
                                <th className="px-5 py-3.5">Servicios Cotizados</th>
                                <th className="px-5 py-3.5 text-right">Monto Total</th>
                                <th className="px-5 py-3.5 text-center">Estado</th>
                                <th className="px-5 py-3.5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredQuotes.length > 0 ? (
                                filteredQuotes.map((quote) => (
                                    <tr
                                        key={quote.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4 font-mono font-bold text-primary">
                                            {quote.code}
                                            <div className="text-[11px] font-normal text-muted-foreground">
                                                {quote.created_at}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-foreground">
                                                {quote.client_name}
                                            </div>
                                            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
                                                <span>Cód:</span>
                                                <span className="font-semibold text-foreground/80">
                                                    {quote.client_code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-medium text-foreground">
                                            {quote.project_name}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {quote.services.map((srv, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-block rounded bg-secondary/15 px-2 py-0.5 text-[11px] font-semibold text-secondary-900 dark:text-secondary-200"
                                                    >
                                                        {srv}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right font-mono font-bold text-base text-foreground">
                                            ${quote.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                                            <span className="text-xs text-muted-foreground font-sans">
                                                {quote.currency}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            {getStatusBadge(quote.status, quote.status_label)}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs font-medium"
                                                >
                                                    <Link href={initialFormsRoute.index()}>
                                                        Formulario
                                                        <ArrowUpRight className="ml-1 size-3.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        No se encontraron cotizaciones con el filtro aplicado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis Cotizaciones',
        href: quotesRoute.index(),
    },
];

QuotesIndex.layout = {
    breadcrumbs,
};
