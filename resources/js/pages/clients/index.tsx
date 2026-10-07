import { Head, Link } from '@inertiajs/react';
import {
    CirclePlus,
    FolderKanban,
    Mail,
    MapPin,
    Phone,
    Plus,
    Search,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import clientsRoute from '@/routes/clients';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

interface ClientItem {
    id: number;
    code: string;
    name: string;
    ci: string;
    phone: string;
    email: string;
    address: string;
    quotes_count: number;
    total_billed: number;
    created_at: string;
}

export default function ClientsIndex({
    clients = [],
}: {
    clients: ClientItem[];
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);

    const filteredClients = clients.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.ci.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Clientes & Historial - Bimetica" />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Clientes & Historial
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Directorio de clientes con código correlativo anual NNN/AAAA e historial de proyectos.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setShowNewModal(true)}
                        className="bg-primary text-primary-foreground font-semibold shadow-sm"
                    >
                        <CirclePlus className="mr-2 size-4" />
                        Nuevo Cliente (015/2026)
                    </Button>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre, código NNN/AAAA o CI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Listado de Clientes */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {filteredClients.map((client) => (
                    <Card key={client.id} className="border shadow-xs hover:border-primary/40 transition-all">
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                                    Cód: {client.code}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">
                                    CI: {client.ci}
                                </span>
                            </div>
                            <CardTitle className="text-lg font-bold text-foreground mt-2">
                                {client.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3 text-sm">
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Phone className="size-3.5 text-primary shrink-0" />
                                    <span>{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="size-3.5 text-secondary-600 shrink-0" />
                                    <span>{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-3.5 text-tertiary-600 shrink-0" />
                                    <span>{client.address}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-muted-foreground">Cotizaciones: </span>
                                    <span className="font-bold text-foreground">{client.quotes_count}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Facturado: </span>
                                    <span className="font-mono font-bold text-primary">
                                        ${client.total_billed.toFixed(2)} USD
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <Button asChild size="sm" variant="outline" className="text-xs">
                                    <Link href={quotesRoute.create()}>
                                        Cotizar para este cliente
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal simulado de nuevo cliente */}
            {showNewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-lg border shadow-xl bg-card">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold">Registrar Nuevo Cliente</CardTitle>
                                <Badge className="bg-[#fbad03] text-primary-950 font-mono font-bold">
                                    Código: 015/2026
                                </Badge>
                            </div>
                            <CardDescription>
                                El código de cliente es autogenerado secuencialmente por año.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Nombre Completo o Razón Social
                                </label>
                                <Input placeholder="Ej: Arq. Alejandro Ramos" className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        C.I. / NIT
                                    </label>
                                    <Input placeholder="Ej: 6849201 LP" className="mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                                        Celular de Contacto
                                    </label>
                                    <Input placeholder="Ej: +591 70000000" className="mt-1" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Dirección Domiciliaria / Fiscal
                                </label>
                                <Input placeholder="Ej: Calle 21 de Calacoto #500" className="mt-1" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button variant="outline" onClick={() => setShowNewModal(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-primary text-primary-foreground font-semibold"
                                    onClick={() => setShowNewModal(false)}
                                >
                                    Guardar Cliente
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
        title: 'Clientes & Historial',
        href: clientsRoute.index(),
    },
];

ClientsIndex.layout = {
    breadcrumbs,
};
