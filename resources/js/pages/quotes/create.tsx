import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calculator,
    Check,
    CheckCircle2,
    Layers,
    MapPin,
    Plus,
    Save,
    Trash2,
    User,
    UserPlus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import initialFormsRoute from '@/routes/initial-forms';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem } from '@/types';

interface Client {
    id: number;
    code: string;
    name: string;
    ci: string;
    phone: string;
    address: string;
}

interface ServiceCatalogItem {
    id: number;
    name: string;
    description: string;
    uses_floors: boolean;
    variables: Array<{
        name: string;
        label: string;
        type: string;
        default: number;
    }>;
    base_price: number;
}

interface CityOption {
    id: number;
    name: string;
    viatico: number;
}

interface FloorRow {
    id: string;
    floor_name: string;
    description: string;
    area_m2: number;
}

export default function QuoteCreate({
    clients = [],
    servicesCatalog = [],
    cities = [],
}: {
    clients: Client[];
    servicesCatalog: ServiceCatalogItem[];
    cities: CityOption[];
}) {
    // 1. Cliente & Proyecto
    const [selectedClientId, setSelectedClientId] = useState<number>(clients[0]?.id || 1);
    const [projectName, setProjectName] = useState('Residencia Moderna Achumani');
    const [selectedCityId, setSelectedCityId] = useState<number>(cities[0]?.id || 1);

    // 2. Grupos de Pisos (Reutilizables según CONTEXT.md)
    const [floorGroupName, setFloorGroupName] = useState('Tabla General de Pisos');
    const [floors, setFloors] = useState<FloorRow[]>([
        { id: '1', floor_name: 'Subsuelo', description: 'Área de garaje y depósito', area_m2: 65 },
        { id: '2', floor_name: 'Planta Baja', description: 'Living, comedor, cocina y galería', area_m2: 120 },
        { id: '3', floor_name: 'Planta Alta 1', description: '3 Dormitorios en suite y estar', area_m2: 110 },
        { id: '4', floor_name: 'Terraza / Cubierta', description: 'Área de parrillero y lavandería', area_m2: 45 },
    ]);

    // 3. Servicios seleccionados
    const [selectedServices, setSelectedServices] = useState<Record<number, boolean>>({
        1: true, // Planos 2D
        2: true, // Diseño Arquitectónico
        3: false,
        4: false,
        5: false,
    });

    const [serviceInputs, setServiceInputs] = useState<Record<number, Record<string, number>>>({
        1: { m2: 340, complejidad: 1 },
        2: { m2: 340, renders_extra: 2 },
        3: { m2: 340, pisos_altura: 2 },
        4: { ambientes: 4 },
        5: { visado_colegio: 1 },
    });

    // Calcular área total de los pisos
    const totalFloorsM2 = useMemo(() => {
        return floors.reduce((acc, row) => acc + (Number(row.area_m2) || 0), 0);
    }, [floors]);

    // Manejar cambio en pisos
    const handleFloorChange = (id: string, field: keyof FloorRow, value: string | number) => {
        setFloors((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const addFloorRow = () => {
        const nextId = String(Date.now());
        setFloors((prev) => [
            ...prev,
            { id: nextId, floor_name: `Nuevo Nivel`, description: '', area_m2: 50 },
        ]);
    };

    const removeFloorRow = (id: string) => {
        setFloors((prev) => prev.filter((row) => row.id !== id));
    };

    // Toggle de servicio
    const toggleService = (serviceId: number) => {
        setSelectedServices((prev) => ({
            ...prev,
            [serviceId]: !prev[serviceId],
        }));
    };

    // Viático de la ciudad seleccionada
    const currentCity = cities.find((c) => c.id === selectedCityId);
    const cityViatico = currentCity?.viatico || 0;

    // Cálculo dinámico de subtotales por servicio evaluando variables
    const calculatedServices = useMemo(() => {
        return servicesCatalog.map((svc) => {
            const isChecked = !!selectedServices[svc.id];
            const inputs = serviceInputs[svc.id] || {};
            let subtotal = 0;

            if (isChecked) {
                // Cálculo de ejemplo respetando las reglas de CONTEXT.md
                if (svc.id === 1) {
                    // Planos 2D: m2 * 24 * complejidad (mínimo 1200)
                    const m2 = totalFloorsM2 || inputs.m2 || 200;
                    const comp = inputs.complejidad || 1;
                    subtotal = m2 < 50 ? 1200 : Math.round(m2 * 24 * comp);
                } else if (svc.id === 2) {
                    // Diseño 3D: m2 < 30 ? 1600 : m2 * 56 + renders
                    const m2 = totalFloorsM2 || inputs.m2 || 200;
                    const renders = inputs.renders_extra || 0;
                    subtotal = m2 < 30 ? 1600 : Math.round(m2 * 56 + renders * 150);
                } else if (svc.id === 3) {
                    // Estructural
                    const m2 = totalFloorsM2 || inputs.m2 || 200;
                    const niveles = inputs.pisos_altura || 2;
                    subtotal = m2 < 100 ? 1400 : Math.round(m2 * 18 * (1 + (niveles - 1) * 0.15));
                } else if (svc.id === 4) {
                    // Interiores
                    const amb = inputs.ambientes || 4;
                    subtotal = amb * 300;
                } else if (svc.id === 5) {
                    // Trámites
                    subtotal = 500;
                }
            }

            return {
                ...svc,
                isChecked,
                subtotal,
            };
        });
    }, [servicesCatalog, selectedServices, serviceInputs, totalFloorsM2]);

    const servicesSubtotal = useMemo(() => {
        return calculatedServices.reduce((sum, s) => sum + (s.isChecked ? s.subtotal : 0), 0);
    }, [calculatedServices]);

    const totalQuoteAmount = servicesSubtotal + cityViatico;
    const totalQuoteBob = Math.round(totalQuoteAmount * 6.96);

    const selectedClient = clients.find((c) => c.id === selectedClientId);

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Head title="Nueva Cotización - Bimetica" />

            {/* Cabecera con retorno */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="icon" className="size-9">
                        <Link href={quotesRoute.index()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Nueva Cotización
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configuración de grupos de pisos, catálogo de servicios y fórmulas en tiempo real.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="text-sm">
                        <Link href={quotesRoute.index()}>Cancelar</Link>
                    </Button>
                    <Button asChild className="bg-primary text-primary-foreground font-semibold shadow-sm">
                        <Link href={initialFormsRoute.index()}>
                            <Save className="mr-2 size-4" />
                            Guardar y Formalizar
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Columna Izquierda & Central (Formulario de Cotización) */}
                <div className="space-y-6 lg:col-span-2">
                    {/* 1. Datos del Cliente & Proyecto */}
                    <Card className="shadow-xs border">
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <User className="size-4 text-primary" />
                                    1. Cliente y Datos del Proyecto
                                </CardTitle>
                                <Badge variant="outline" className="font-mono text-xs font-semibold text-primary">
                                    {selectedClient ? `Cód: ${selectedClient.code}` : '015/2026'}
                                </Badge>
                            </div>
                            <CardDescription>
                                Seleccione el cliente registrado o asigne datos básicos del encargo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Label htmlFor="client-select" className="text-xs font-semibold uppercase text-muted-foreground">
                                    Cliente Registrado
                                </Label>
                                <select
                                    id="client-select"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
                                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} — Cód: {c.code} ({c.ci})
                                        </option>
                                    ))}
                                </select>
                                {selectedClient && (
                                    <div className="mt-2 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md flex flex-wrap gap-x-4 gap-y-1">
                                        <span><strong>Tel:</strong> {selectedClient.phone}</span>
                                        <span><strong>CI:</strong> {selectedClient.ci}</span>
                                        <span><strong>Dirección:</strong> {selectedClient.address}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="project-name" className="text-xs font-semibold uppercase text-muted-foreground">
                                    Nombre del Proyecto
                                </Label>
                                <Input
                                    id="project-name"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Ej: Residencia Unifamiliar Calacoto"
                                    className="mt-1.5"
                                />
                            </div>

                            <div>
                                <Label htmlFor="city-select" className="text-xs font-semibold uppercase text-muted-foreground">
                                    Ciudad (Viático automático)
                                </Label>
                                <select
                                    id="city-select"
                                    value={selectedCityId}
                                    onChange={(e) => setSelectedCityId(Number(e.target.value))}
                                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name} {city.viatico > 0 ? `(+$${city.viatico} USD viático)` : '(Sin viático)'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Grupo de Pisos Reutilizable (quote_floor_groups) */}
                    <Card className="shadow-xs border">
                        <CardHeader className="pb-3 border-b bg-muted/20 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Layers className="size-4 text-[#fbad03]" />
                                    2. Tabla de Pisos y Superficies Reutilizable
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Define la lista de plantas y metros cuadrados que vincularás a los servicios.
                                </CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold text-muted-foreground block">
                                    Superficie Total
                                </span>
                                <span className="text-lg font-black font-mono text-[#003e65] dark:text-[#fbad03]">
                                    {totalFloorsM2} m²
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="mb-3">
                                <Label className="text-xs font-semibold text-muted-foreground">
                                    Nombre del Grupo de Pisos
                                </Label>
                                <Input
                                    value={floorGroupName}
                                    onChange={(e) => setFloorGroupName(e.target.value)}
                                    className="mt-1 max-w-sm h-8 text-xs font-medium"
                                />
                            </div>

                            <div className="rounded-lg border overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-muted/60 font-semibold uppercase text-muted-foreground border-b">
                                        <tr>
                                            <th className="px-3 py-2">Nivel / Planta</th>
                                            <th className="px-3 py-2">Descripción Funcional</th>
                                            <th className="px-3 py-2 w-28 text-right">Área (m²)</th>
                                            <th className="px-2 py-2 w-10 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {floors.map((row) => (
                                            <tr key={row.id} className="hover:bg-muted/20">
                                                <td className="p-2">
                                                    <Input
                                                        value={row.floor_name}
                                                        onChange={(e) =>
                                                            handleFloorChange(row.id, 'floor_name', e.target.value)
                                                        }
                                                        className="h-7 text-xs font-semibold"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        value={row.description}
                                                        onChange={(e) =>
                                                            handleFloorChange(row.id, 'description', e.target.value)
                                                        }
                                                        placeholder="Detalle de áreas..."
                                                        className="h-7 text-xs"
                                                    />
                                                </td>
                                                <td className="p-2 text-right">
                                                    <Input
                                                        type="number"
                                                        value={row.area_m2}
                                                        onChange={(e) =>
                                                            handleFloorChange(row.id, 'area_m2', Number(e.target.value))
                                                        }
                                                        className="h-7 text-xs font-mono text-right font-bold"
                                                    />
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFloorRow(row.id)}
                                                        className="text-muted-foreground hover:text-destructive p-1"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFloorRow}
                                className="mt-3 text-xs font-medium"
                            >
                                <Plus className="mr-1.5 size-3.5" />
                                Añadir Planta / Nivel
                            </Button>
                        </CardContent>
                    </Card>

                    {/* 3. Catálogo de Servicios & Variables Dinámicas */}
                    <Card className="shadow-xs border">
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                <Calculator className="size-4 text-tertiary" />
                                3. Servicios Arquitectónicos y Variables
                            </CardTitle>
                            <CardDescription>
                                Active los servicios que integran la cotización. Cada uno evaluará su fórmula automáticamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {calculatedServices.map((svc) => (
                                <div
                                    key={svc.id}
                                    className={`rounded-xl border p-4 transition-all ${
                                        svc.isChecked
                                            ? 'border-primary/40 bg-primary/5 shadow-xs'
                                            : 'border-border bg-card opacity-80'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id={`service-${svc.id}`}
                                                checked={svc.isChecked}
                                                onChange={() => toggleService(svc.id)}
                                                className="mt-1 size-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <div>
                                                <Label
                                                    htmlFor={`service-${svc.id}`}
                                                    className="text-sm font-bold text-foreground cursor-pointer flex items-center gap-2"
                                                >
                                                    {svc.name}
                                                    {svc.uses_floors && (
                                                        <Badge variant="outline" className="text-[10px] font-semibold text-secondary-800 border-secondary/40 bg-secondary/10">
                                                            Usa {totalFloorsM2} m² de tabla
                                                        </Badge>
                                                    )}
                                                </Label>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {svc.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0 font-mono">
                                            <span className="text-xs text-muted-foreground block">
                                                Subtotal
                                            </span>
                                            <span className="text-base font-black text-foreground">
                                                ${svc.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                                                <span className="text-xs font-normal text-muted-foreground">USD</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Campos variables si está activo */}
                                    {svc.isChecked && svc.variables.length > 0 && (
                                        <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-3 gap-3 bg-background/60 p-2.5 rounded-lg">
                                            {svc.variables.map((v) => (
                                                <div key={v.name}>
                                                    <Label className="text-[11px] font-semibold text-muted-foreground">
                                                        {v.label}
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        value={
                                                            serviceInputs[svc.id]?.[v.name] ??
                                                            (v.name === 'm2' ? totalFloorsM2 : v.default)
                                                        }
                                                        onChange={(e) =>
                                                            setServiceInputs((prev) => ({
                                                                ...prev,
                                                                [svc.id]: {
                                                                    ...prev[svc.id],
                                                                    [v.name]: Number(e.target.value),
                                                                },
                                                            }))
                                                        }
                                                        className="h-7 text-xs font-mono mt-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Columna Derecha (Resumen Financiero en Vivo) */}
                <div className="space-y-6">
                    <Card className="sticky top-6 border-2 border-primary/20 shadow-md">
                        <CardHeader className="bg-primary text-primary-foreground rounded-t-xl pb-4">
                            <CardTitle className="text-lg font-black tracking-wide">
                                Resumen de Inversión
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/80 text-xs">
                                Cotización arquitectónica Bimetica
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-5 space-y-4">
                            <div className="space-y-2.5 text-xs divide-y divide-border/60">
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-muted-foreground">Servicios seleccionados:</span>
                                    <span className="font-bold text-foreground">
                                        {calculatedServices.filter((s) => s.isChecked).length} servicios
                                    </span>
                                </div>

                                {calculatedServices
                                    .filter((s) => s.isChecked)
                                    .map((s) => (
                                        <div key={s.id} className="flex justify-between items-center pt-2">
                                            <span className="text-muted-foreground truncate max-w-[160px]">
                                                {s.name}
                                            </span>
                                            <span className="font-mono font-semibold text-foreground">
                                                ${s.subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="size-3 text-secondary-600" />
                                        Viáticos ({currentCity?.name}):
                                    </span>
                                    <span className="font-mono font-semibold text-foreground">
                                        ${cityViatico.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Totalizador */}
                            <div className="rounded-xl bg-[#003e65]/10 dark:bg-[#003e65]/30 p-4 border border-primary/20">
                                <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                                    Monto Total Acordado
                                </div>
                                <div className="mt-1 flex items-baseline justify-between">
                                    <span className="text-3xl font-black font-mono text-primary">
                                        ${totalQuoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-sm font-semibold text-muted-foreground">
                                        USD
                                    </span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Equivalente BOB (T/C 6.96):</span>
                                    <span className="font-mono font-bold text-foreground">
                                        Bs. {totalQuoteBob.toLocaleString('es-BO')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Button asChild className="w-full bg-[#fbad03] text-primary-950 hover:bg-[#e59d02] font-bold shadow-sm">
                                    <Link href={initialFormsRoute.index()}>
                                        <CheckCircle2 className="mr-2 size-4" />
                                        Formalizar Formulario Inicial
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full text-xs">
                                    <Link href={quotesRoute.index()}>
                                        Guardar como Borrador
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
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
    {
        title: 'Nueva Cotización',
        href: quotesRoute.create(),
    },
];

QuoteCreate.layout = {
    breadcrumbs,
};
