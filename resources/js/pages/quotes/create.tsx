import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    Building,
    Check,
    Clock,
    DraftingCompass,
    HelpCircle,
    Lock,
    MessageCircle,
    Phone,
    Plus,
    Printer,
    Save,
    SlidersHorizontal,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import initialFormsRoute from '@/routes/initial-forms';
import quotesRoute from '@/routes/quotes';
import type { BreadcrumbItem, User } from '@/types';

interface ClientItem {
    id: number;
    code: string;
    name: string;
    ci: string;
    phone: string;
    address: string;
    occupation: string;
}

interface ServiceItem {
    id: number;
    name: string;
    description: string;
    rate_bs: number;
    scope: string[];
    note: string;
}

interface CityItem {
    id: number;
    name: string;
    viatico: number;
}

interface FloorRow {
    id: string;
    level: string;
    description: string;
    area_m2: number;
    isActive: boolean;
}

export default function QuoteCreate({
    clients = [],
    servicesCatalog = [],
    cities = [],
}: {
    clients: ClientItem[];
    servicesCatalog: ServiceItem[];
    cities: CityItem[];
}) {
    const { auth } = usePage<{ auth?: { user?: User } }>().props;
    const userRole = auth?.user?.role || 'seller';
    const userName = auth?.user?.name || 'Ing. Guadalupe / Janeth';

    // 1. Cliente & Expediente (Vendedor ingresa directamente)
    const [clientData, setClientData] = useState<ClientItem>({
        id: 1,
        code: '084/2026',
        name: 'JANETH / EUNICE MIRANDA NAVIA',
        ci: '76734409 LP',
        phone: '76734409',
        address: 'BAJO SAN ANTONIO',
        occupation: 'COMERCIANTE',
    });

    const quoteCode = 'COT-2026-084';

    // 2. Parámetros de Diseño
    const [terrainArea, setTerrainArea] = useState<number>(350);
    const [zoneType, setZoneType] = useState<string>('URBANA CENTRAL (INCLUIDO)');
    const [projectType, setProjectType] = useState<string>('VIVIENDA UNIFAMILIAR / 1');

    // 3. Tabla de Plantas de la Edificación (Arquitectura)
    const [floors, setFloors] = useState<FloorRow[]>([
        { id: '4', level: '04° PLANTA', description: '-', area_m2: 0, isActive: false },
        { id: '3', level: '03° PLANTA', description: '-', area_m2: 0, isActive: false },
        { id: '2', level: '02° PLANTA', description: '-', area_m2: 0, isActive: false },
        { id: '1', level: '01° PLANTA', description: 'DEPARTAMENTO DE 3 HABITACIONES', area_m2: 200, isActive: true },
        { id: '0', level: 'PLANTA BAJA', description: 'Estacionamiento, acceso peatonal y jardín', area_m2: 100, isActive: true },
    ]);

    const totalFloorsM2 = useMemo(() => {
        return floors.reduce(
            (sum, f) => (f.isActive ? sum + (Number(f.area_m2) || 0) : sum),
            0
        );
    }, [floors]);

    const addFloorRow = () => {
        const nextNum = floors.length;
        const newFloor: FloorRow = {
            id: String(Date.now()),
            level: `0${nextNum}° PLANTA`,
            description: 'Ambientes proyectados',
            area_m2: 50,
            isActive: true,
        };
        setFloors((prev) => [newFloor, ...prev]);
    };

    const removeFloorRow = (id: string) => {
        setFloors((prev) => prev.filter((f) => f.id !== id));
    };

    const updateFloorRow = (
        id: string,
        field: keyof FloorRow,
        value: string | number | boolean
    ) => {
        setFloors((prev) =>
            prev.map((f) => {
                if (f.id === id) {
                    const updated = { ...f, [field]: value };
                    if (field === 'area_m2') {
                        updated.isActive = Number(value) > 0;
                    }
                    return updated;
                }
                return f;
            })
        );
    };

    // 4. Servicios Seleccionados y Variables Dinámicas Llenables por Servicio
    // Por defecto marcados: Diseño Arquitectónico (2) y Cálculo Estructural (3)
    const [activeServiceIds, setActiveServiceIds] = useState<number[]>([2, 3]);

    // M2 Dinámicos por Servicio: El vendedor llena independientemente los m² que se calculan en cada servicio
    const [serviceM2Values, setServiceM2Values] = useState<Record<number, number>>({
        1: 300, // Planos 2D
        2: 300, // Diseño Arquitectónico
        3: 300, // Cálculo Estructural
        4: 150, // Diseño de Interiores
        5: 350, // Estudio de Suelos
        6: 300, // Trámites
    });

    const updateServiceM2 = (serviceId: number, value: number) => {
        setServiceM2Values((prev) => ({
            ...prev,
            [serviceId]: value,
        }));
    };

    // Variables dinámicas secundarias que el vendedor puede llenar por servicio
    const [dynamicVariables, setDynamicVariables] = useState<Record<number, Record<string, number>>>({
        1: { complejidad: 1 },
        2: { renders_extra: 0 },
        3: { pisos_altura: 2 },
        4: { ambientes: 4 },
        5: { pozos: 3 },
        6: { visado_colegio: 1 },
    });

    const updateDynamicVariable = (serviceId: number, varName: string, value: number) => {
        setDynamicVariables((prev) => ({
            ...prev,
            [serviceId]: {
                ...(prev[serviceId] || {}),
                [varName]: value,
            },
        }));
    };

    // Evaluación matemática de Fórmulas: toma variables dinámicas (m2 propio del servicio, extras) y estáticas (tarifas fijadas por admin)
    const evaluateServiceFormula = (service: ServiceItem, m2: number) => {
        const dynVars = dynamicVariables[service.id] || {};
        const rendersExtra = Number(dynVars.renders_extra) || 0;
        const complejidad = Number(dynVars.complejidad) || 1;

        let subtotal = 0;
        let rateBs = service.rate_bs;

        switch (service.id) {
            case 1: // Planos 2D: base 18 Bs * complejidad
                subtotal = m2 * 18 * complejidad;
                rateBs = 18 * complejidad;
                break;
            case 2: // Diseño Arquitectónico: base 24 Bs + renders extra * 150 Bs
                subtotal = m2 * 24 + rendersExtra * 150;
                rateBs = m2 > 0 ? subtotal / m2 : 24;
                break;
            case 3: // Cálculo Estructural: base 23.50 Bs / m2
                subtotal = m2 * 23.5;
                rateBs = 23.5;
                break;
            case 4: // Diseño de Interiores: base 20 Bs / m2
                subtotal = m2 * 20;
                rateBs = 20;
                break;
            case 5: // Estudio de Suelos: base 15 Bs / m2
                subtotal = m2 * 15;
                rateBs = 15;
                break;
            case 6: // Trámites: base 10 Bs / m2
                subtotal = m2 * 10;
                rateBs = 10;
                break;
            default:
                subtotal = m2 * service.rate_bs;
                rateBs = service.rate_bs;
                break;
        }

        return {
            m2,
            rateBs,
            subtotal,
        };
    };

    const addService = (id: number) => {
        if (!activeServiceIds.includes(id)) {
            setActiveServiceIds((prev) => [...prev, id]);
            if (serviceM2Values[id] === undefined) {
                setServiceM2Values((prev) => ({
                    ...prev,
                    [id]: totalFloorsM2 > 0 ? totalFloorsM2 : 100,
                }));
            }
        }
    };

    const removeService = (id: number) => {
        setActiveServiceIds((prev) => prev.filter((sId) => sId !== id));
    };

    // Servicios activos calculados
    const activeServices = useMemo(() => {
        return servicesCatalog.filter((s) => activeServiceIds.includes(s.id));
    }, [servicesCatalog, activeServiceIds]);

    // Servicios disponibles aún por agregar al cotizador
    const availableServicesToAdd = useMemo(() => {
        return servicesCatalog.filter((s) => !activeServiceIds.includes(s.id));
    }, [servicesCatalog, activeServiceIds]);

    // Inversión Total calculada sumando los servicios activos evaluados con sus fórmulas
    const totalQuoteBs = useMemo(() => {
        return activeServices.reduce((sum, service) => {
            const m2 = serviceM2Values[service.id] ?? 0;
            const { subtotal } = evaluateServiceFormula(service, m2);
            return sum + subtotal;
        }, 0);
    }, [activeServices, serviceM2Values, dynamicVariables]);

    const handlePrint = () => {
        window.print();
    };

    const [savedNotification, setSavedNotification] = useState(false);
    const handleSave = () => {
        setSavedNotification(true);
        setTimeout(() => setSavedNotification(false), 3000);
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(
            `Hola ${clientData.name}, le comparto la cotización ${quoteCode} de BIMETICA para su proyecto en ${clientData.address}. Total M2 edificación: ${totalFloorsM2} m². Inversión estimada: Bs. ${totalQuoteBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}. Saludos cordiales.`
        );
        window.open(`https://api.whatsapp.com/send?phone=591${clientData.phone}&text=${text}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#f4f7f9] text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
            <Head title="Nueva Cotización - COT-2026-084 | BIMETICA" />

            {/* TOP BAR / HEADER DE NAVEGACIÓN Y ESTADO */}
            <header className="border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900 print:hidden shadow-xs">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    {/* Tags a la izquierda */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50/70 px-2.5 py-1 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                                MEMBRETE
                            </span>
                            <span className="font-extrabold text-[11px]">OPERATIVO</span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            <Building className="size-3 text-slate-500" />
                            <span className="text-[10px] font-bold uppercase text-slate-500">ESTUDIO</span>
                            <span className="font-extrabold text-[11px]">CENTRAL</span>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <Clock className="size-3 text-slate-400" />
                            <span>Tasa UF/M2 Actualizada</span>
                        </div>
                    </div>

                    {/* Usuario y Rol a la derecha */}
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-500 text-[11px]">ROL :</span>
                            <span className="rounded-md bg-[#00253d] px-2.5 py-0.5 font-bold uppercase tracking-wider text-white text-[10px] shadow-xs">
                                {userRole === 'admin' ? 'Administrador' : 'Vendedor'}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="relative text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1"
                            title="Notificaciones"
                        >
                            <Bell className="size-4" />
                            <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-[#fbad03]" />
                        </button>

                        <button
                            type="button"
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 p-1"
                            title="Ayuda del sistema"
                        >
                            <HelpCircle className="size-4" />
                        </button>

                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                            <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs hidden md:inline">
                                {userName}
                            </span>
                            <div className="flex size-7 items-center justify-center rounded-full bg-[#003e65] text-white font-bold text-xs shadow-xs">
                                {userName.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SUB-HEADER / ACTION BAR */}
            <div className="border-b border-slate-200 bg-white/90 backdrop-blur-xs px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90 print:hidden shadow-xs">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                    {/* Migas y Expediente */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                            COTIZACIONES &gt; <strong className="text-slate-800 dark:text-slate-100">NUEVA COTIZACIÓN</strong>
                        </span>

                        <span className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {quoteCode}
                        </span>

                        <span className="flex items-center gap-1.5 rounded-md border border-amber-300/80 bg-amber-50 px-2 py-0.5 font-bold text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300 text-[11px]">
                            <span className="size-2 rounded-full bg-[#fbad03] shadow-[0_0_6px_#fbad03]" />
                            ESTADO: CALCULADA
                        </span>
                    </div>

                    {/* Acciones principales */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrint}
                            className="h-8 gap-1.5 text-xs font-semibold border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                            <Printer className="size-3.5" />
                            Imprimir Cotización (PDF)
                        </Button>

                        <Button
                            asChild
                            className="h-8 gap-1.5 bg-[#00253d] hover:bg-[#003e65] text-white text-xs font-bold shadow-xs"
                        >
                            <Link href={initialFormsRoute.index()}>
                                Avanzar a Formulario Inicial
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL: 2 COLUMNAS (HOJA DE COTIZACIÓN + PANEL DERECHO) */}
            <main className="mx-auto max-w-7xl w-full flex-1 p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* COLUMNA IZQUIERDA: HOJA DE COTIZACIÓN ARQUITECTÓNICA (8 COLUMNAS) */}
                    <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 print:p-0 print:border-none print:shadow-none">
                        {/* Cabecera de la Hoja */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                            {/* Logo Bimetica */}
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-lg bg-[#00253d] text-[#fbad03] shadow-xs">
                                    <DraftingCompass className="size-6" />
                                </div>
                                <div>
                                    <div className="text-xl font-black tracking-tight text-[#00253d] dark:text-white flex items-center gap-0.5">
                                        Bimetica<span className="text-[#fbad03] text-2xl leading-none">.</span>
                                    </div>
                                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        Diseño y Construcción
                                    </div>
                                </div>
                            </div>

                            {/* Expediente y Vigencia */}
                            <div className="text-right">
                                <div className="text-xs font-black uppercase tracking-wider text-[#b8860b] dark:text-[#fbad03]">
                                    EXPEDIENTE Nº {quoteCode}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    La Paz, Bolivia · Vigencia 7 días
                                </div>
                            </div>
                        </div>

                        {/* Título Central */}
                        <div className="text-center py-1">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-[#00253d] dark:text-white">
                                COTIZACIÓN
                            </h1>
                        </div>

                        {/* Ficha del Cliente (2x2 Grid de Cajas Totalmente Editables para el Vendedor) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            {/* PROPIETARIO/S */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    PROPIETARIO/S:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.name}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="Nombre del propietario o cliente"
                                    className="mt-0.5 w-full bg-transparent font-bold text-slate-900 dark:text-slate-100 text-xs border-none p-0 focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* Nº CELULAR */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    Nº CELULAR:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.phone}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, phone: e.target.value }))
                                    }
                                    placeholder="Número de celular / teléfono"
                                    className="mt-0.5 w-full font-bold text-slate-900 dark:text-slate-100 text-xs bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* DIRECCIÓN */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    DIRECCIÓN:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.address}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, address: e.target.value }))
                                    }
                                    placeholder="Dirección del inmueble o terreno"
                                    className="mt-0.5 w-full font-bold text-slate-900 dark:text-slate-100 text-xs bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* OCUPACIÓN */}
                            <div className="rounded-lg bg-slate-50/80 border border-slate-200/70 p-2.5 dark:bg-slate-800/50 dark:border-slate-700/60 focus-within:border-primary/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-colors">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                                    OCUPACIÓN:
                                </span>
                                <input
                                    type="text"
                                    value={clientData.occupation}
                                    onChange={(e) =>
                                        setClientData((prev) => ({ ...prev, occupation: e.target.value }))
                                    }
                                    placeholder="Ocupación / Profesión"
                                    className="mt-0.5 w-full font-bold text-slate-900 dark:text-slate-100 text-xs bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* PARÁMETROS DE DISEÑO */}
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs">
                            <div className="bg-[#071526] text-white px-3 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                <span>PARÁMETROS DE DISEÑO</span>
                                <SlidersHorizontal className="size-3.5 text-slate-300" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800 p-3 text-xs">
                                <div className="sm:pr-3 py-1">
                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        SUPERFICIE DE TERRENO
                                    </span>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <input
                                            type="number"
                                            min="0"
                                            value={terrainArea || ''}
                                            onChange={(e) => setTerrainArea(Number(e.target.value))}
                                            className="w-24 text-base font-black text-slate-900 dark:text-slate-100 bg-transparent border-b border-dashed border-slate-300 focus:border-primary focus:outline-none p-0"
                                        />
                                        <span className="text-xs font-bold text-slate-500">M2</span>
                                    </div>
                                </div>

                                <div className="sm:px-3 py-1">
                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        VIÁTICOS / ZONA
                                    </span>
                                    <input
                                        type="text"
                                        value={zoneType}
                                        onChange={(e) => setZoneType(e.target.value)}
                                        className="mt-1 w-full font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-dashed border-slate-300 focus:border-primary focus:outline-none text-xs p-0"
                                    />
                                </div>

                                <div className="sm:pl-3 py-1">
                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        TIPO DE PROYECTO
                                    </span>
                                    <input
                                        type="text"
                                        value={projectType}
                                        onChange={(e) => setProjectType(e.target.value)}
                                        className="mt-1 w-full font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-dashed border-slate-300 focus:border-primary focus:outline-none text-xs p-0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN DE PLANTAS DE LA EDIFICACIÓN (M2 de Plantas / Niveles Arquitectónicos) */}
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs">
                            {/* Cabecera Amarilla Arquitectónica */}
                            <div className="bg-[#fbad03] text-slate-950 font-black px-4 py-2 flex items-center justify-between text-xs uppercase tracking-wider">
                                <div className="flex items-center gap-3">
                                    <span>PLANTAS</span>
                                    <button
                                        type="button"
                                        onClick={addFloorRow}
                                        className="print:hidden text-[10px] bg-slate-950 text-white hover:bg-slate-800 px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-xs transition-colors"
                                        title="Agregar nuevo nivel o planta arquitectónica"
                                    >
                                        <Plus className="size-3" />
                                        Agregar Planta
                                    </button>
                                </div>
                                <span>M2</span>
                            </div>

                            {/* Filas de la Tabla */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs bg-white dark:bg-slate-900">
                                {floors.map((row) => (
                                    <div
                                        key={row.id}
                                        className={`flex items-center justify-between gap-3 px-4 py-2 transition-colors ${
                                            row.isActive
                                                ? 'bg-white dark:bg-slate-900'
                                                : 'bg-slate-50/60 dark:bg-slate-900/40 text-slate-400'
                                        }`}
                                    >
                                        <div className="flex flex-1 items-center gap-3">
                                            {/* Nivel editable */}
                                            <input
                                                type="text"
                                                value={row.level}
                                                onChange={(e) =>
                                                    updateFloorRow(row.id, 'level', e.target.value)
                                                }
                                                className="w-28 font-bold text-slate-800 dark:text-slate-200 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none text-xs p-0"
                                            />

                                            {/* Descripción editable */}
                                            <input
                                                type="text"
                                                value={row.description}
                                                onChange={(e) =>
                                                    updateFloorRow(row.id, 'description', e.target.value)
                                                }
                                                placeholder="Descripción de la planta"
                                                className="flex-1 text-slate-600 dark:text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none text-xs p-0"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* M2 editable de la planta */}
                                            <input
                                                type="number"
                                                min="0"
                                                value={row.area_m2 === 0 ? '' : row.area_m2}
                                                onChange={(e) =>
                                                    updateFloorRow(row.id, 'area_m2', Number(e.target.value))
                                                }
                                                placeholder="-"
                                                className="w-16 text-right font-mono font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary focus:outline-none text-xs p-0"
                                            />

                                            {/* Botón eliminar fila */}
                                            <button
                                                type="button"
                                                onClick={() => removeFloorRow(row.id)}
                                                className="print:hidden text-slate-300 hover:text-red-600 p-0.5 transition-colors"
                                                title="Eliminar esta planta"
                                            >
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Total M2 de la edificación */}
                                <div className="bg-slate-100/90 dark:bg-slate-800/90 px-4 py-2.5 flex items-center justify-between font-black text-xs">
                                    <span className="tracking-wider text-slate-700 dark:text-slate-300">
                                        TOTAL M2
                                    </span>
                                    <span className="font-mono text-sm text-[#00253d] dark:text-[#fbad03]">
                                        {totalFloorsM2}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Separador Central */}
                        <div className="text-center text-xs italic text-slate-500 dark:text-slate-400 py-1">
                            La empresa BIMETICA, ofrece sus servicios en:
                        </div>

                        {/* BLOQUES DE SERVICIOS COTIZADOS */}
                        <div className="space-y-5">
                            {activeServices.map((service) => {
                                // M2 propio de este servicio (Variable dinámica que llena el vendedor)
                                const serviceM2 = serviceM2Values[service.id] ?? 0;
                                const { rateBs, subtotal } = evaluateServiceFormula(service, serviceM2);

                                return (
                                    <div
                                        key={service.id}
                                        className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs"
                                    >
                                        {/* Barra de Título y Columnas */}
                                        <div className="grid grid-cols-12 text-xs font-black uppercase tracking-wider">
                                            <div className="col-span-6 sm:col-span-6 bg-[#fbad03] text-slate-950 px-4 py-2.5 flex items-center justify-between">
                                                <span className="font-black tracking-wide text-xs sm:text-sm">
                                                    {service.name}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => removeService(service.id)}
                                                    className="print:hidden text-[10px] text-slate-900 hover:text-red-700 font-bold uppercase underline transition-colors"
                                                    title="Quitar este servicio"
                                                >
                                                    Quitar
                                                </button>
                                            </div>

                                            <div className="col-span-2 bg-slate-200 text-slate-900 px-2 py-2.5 text-center flex items-center justify-center font-black">
                                                M2
                                            </div>
                                            <div className="col-span-2 bg-[#00253d] text-white px-2 py-2.5 text-center flex items-center justify-center font-black">
                                                BS /M2
                                            </div>
                                            <div className="col-span-2 bg-[#00253d] text-white px-2 py-2.5 text-center flex items-center justify-center font-black whitespace-nowrap">
                                                INVERSIÓN BS.
                                            </div>
                                        </div>

                                        {/* Cuerpo con Alcance y Costos */}
                                        <div className="grid grid-cols-12 bg-white dark:bg-slate-900 divide-x divide-slate-100 dark:divide-slate-800 text-xs">
                                            {/* Columna de Alcance Detallado y Variables Dinámicas Llenables */}
                                            <div className="col-span-6 sm:col-span-6 p-4 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                                {service.scope.map((item, idx) => (
                                                    <p key={idx}>{item}</p>
                                                ))}
                                                <p className="pt-0.5 font-bold text-red-600 dark:text-red-400 text-[10px] tracking-wide">
                                                    {service.note}
                                                </p>

                                                {/* Variables dinámicas secundarias que llena el vendedor */}
                                                {service.id === 2 && (
                                                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 bg-amber-50/70 dark:bg-amber-950/20 p-2 rounded-md">
                                                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                                            Renders 3D adicionales (Variable dinámica):
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={dynamicVariables[2]?.renders_extra ?? 0}
                                                                onChange={(e) =>
                                                                    updateDynamicVariable(
                                                                        2,
                                                                        'renders_extra',
                                                                        Math.max(0, Number(e.target.value))
                                                                    )
                                                                }
                                                                className="w-14 text-center font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 text-xs shadow-2xs"
                                                            />
                                                            <span className="text-[10px] text-slate-400 font-mono">(+150 Bs c/u)</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {service.id === 1 && (
                                                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 bg-amber-50/70 dark:bg-amber-950/20 p-2 rounded-md">
                                                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                                            Factor Complejidad (Variable dinámica):
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                step="0.1"
                                                                value={dynamicVariables[1]?.complejidad ?? 1}
                                                                onChange={(e) =>
                                                                    updateDynamicVariable(
                                                                        1,
                                                                        'complejidad',
                                                                        Math.max(1, Number(e.target.value))
                                                                    )
                                                                }
                                                                className="w-14 text-center font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 text-xs shadow-2xs"
                                                            />
                                                            <span className="text-[10px] text-slate-400 font-mono">(x18 Bs)</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Columna M2 (Variable dinámica que llena el vendedor para este servicio) */}
                                            <div className="col-span-2 p-3 flex flex-col items-center justify-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={serviceM2 === 0 ? '' : serviceM2}
                                                    onChange={(e) => updateServiceM2(service.id, Number(e.target.value))}
                                                    placeholder="0"
                                                    className="w-20 text-center font-mono font-black text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-slate-300 hover:border-slate-400 focus:border-[#fbad03] focus:ring-1 focus:ring-[#fbad03] rounded-md px-1 py-1 text-sm sm:text-base shadow-2xs transition-colors"
                                                    title="Variable dinámica: m² cotizados para este servicio"
                                                />
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mt-1">
                                                    m² dinámico
                                                </span>
                                            </div>

                                            {/* Columna BS / M2 (Fórmula evaluada - SOLO VISUALIZACIÓN) */}
                                            <div className="col-span-2 p-3 flex flex-col items-center justify-center">
                                                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                                                    {rateBs.toFixed(2).replace(/\.00$/, '')}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium mt-1">
                                                    Fórmula Bs/m²
                                                </span>
                                            </div>

                                            {/* Columna Inversión Bs (Fórmula evaluada - SOLO VISUALIZACIÓN) */}
                                            <div className="col-span-2 p-3 flex flex-col items-center justify-center font-mono">
                                                <span className="font-black text-slate-950 dark:text-[#fbad03] text-sm sm:text-base whitespace-nowrap">
                                                    Bs. {subtotal.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                                                    calculado
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {activeServices.length === 0 && (
                                <div className="rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400 space-y-2">
                                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                                        No has seleccionado ningún servicio para esta cotización.
                                    </p>
                                    <p>
                                        Usa el menú desplegable en el panel derecho para agregar servicios al cotizador.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* TÉRMINOS, CONDICIONES Y FIRMA */}
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-700/80 dark:bg-slate-800/40 text-xs space-y-4">
                            <p className="italic text-slate-500 dark:text-slate-400 text-[11px]">
                                Esta cotización tiene una validez de 7 días calendario.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                {/* Términos de Pago (Izquierda) */}
                                <div className="md:col-span-7 space-y-2">
                                    <div className="font-bold text-slate-800 dark:text-slate-200">
                                        Modalidad de Pagos:
                                    </div>
                                    <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                                        <li>
                                            • <strong className="text-slate-800 dark:text-slate-100">Al contado:</strong> 1Pago anticipado 100% con beneficio de entrega acelerada.
                                        </li>
                                        <li>
                                            • <strong className="text-slate-800 dark:text-slate-100">De acuerdo a Planilla de pagos:</strong> Inicio 50% de adelanto al suscribir contrato; 50% en Primera presentación formal del anteproyecto.
                                        </li>
                                    </ul>

                                    <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                        <span className="size-2 bg-[#fbad03] inline-block rounded-xs" />
                                        <span>BIMETICA AEC-STANDARDS ISO 19650 QUALITY VERIFIED</span>
                                    </div>
                                </div>

                                {/* Firma Autorizada (Derecha) */}
                                <div className="md:col-span-5 text-center flex flex-col items-center justify-end pt-4 md:pt-0">
                                    <div className="w-44 border-t border-slate-400/80 dark:border-slate-500 mb-1" />
                                    <span className="text-[10px] uppercase tracking-widest text-slate-400">
                                        FIRMA AUTORIZADA
                                    </span>
                                    <span className="font-bold text-slate-800 dark:text-slate-100 mt-1">
                                        Asesor Comercial
                                    </span>
                                    <span className="text-xs text-slate-600 dark:text-slate-300">
                                        {userName}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#b8860b] dark:text-[#fbad03] mt-0.5">
                                        <Phone className="size-3" />
                                        Cel: 71212168
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: MOTOR DE CÁLCULO EN VIVO (4 COLUMNAS) */}
                    <div className="lg:col-span-4 space-y-4 sticky top-6 print:hidden">
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-5">
                            {/* Cabecera del Widget */}
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-[#fbad03] text-slate-950 font-black text-sm">
                                    ∑
                                </div>
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Motor de Cálculo en Vivo
                                </h2>
                            </div>

                            {/* Tarjeta de M2 Evaluado */}
                            <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 dark:bg-slate-800/60 dark:border-slate-700/60 space-y-2">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    M2 EVALUADO (PLANTAS)
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                                        {totalFloorsM2}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500">m²</span>
                                </div>
                                <span className="text-[10px] text-slate-400 block">
                                    Suma de plantas de la edificación
                                </span>

                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-500">Inversión Total:</span>
                                    <span className="font-mono font-black text-slate-900 dark:text-[#fbad03] text-sm">
                                        Bs. {totalQuoteBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* SELECT DROPDOWN DE SERVICIOS DISPONIBLES */}
                            <div className="space-y-3">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                                    <span>SERVICIOS DISPONIBLES:</span>
                                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                                        {activeServices.length} activos
                                    </span>
                                </div>

                                {/* Select Dropdown para Elegir y Agregar */}
                                <div className="relative">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            const sId = Number(e.target.value);
                                            if (sId) {
                                                addService(sId);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs hover:border-slate-400 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                                    >
                                        <option value="" disabled>
                                            {availableServicesToAdd.length > 0
                                                ? '+ Seleccionar servicio para agregar...'
                                                : '✓ Todos los servicios han sido agregados'}
                                        </option>
                                        {availableServicesToAdd.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} (Bs. {service.rate_bs} / m²)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Lista de Servicios Seleccionados */}
                                <div className="space-y-2 pt-1">
                                    {activeServices.map((service) => {
                                        const serviceM2 = serviceM2Values[service.id] ?? 0;
                                        const { rateBs, subtotal } = evaluateServiceFormula(service, serviceM2);

                                        return (
                                            <div
                                                key={service.id}
                                                className="group relative flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/80"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                                                        <Check className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                        <span className="truncate">{service.name}</span>
                                                    </div>

                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                        {service.description}
                                                    </div>

                                                    {/* Badge de m2 dinámico para este servicio */}
                                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                                                        <span>M2 servicio:</span>
                                                        <span className="font-bold">
                                                            {serviceM2} m²
                                                        </span>
                                                    </div>

                                                    <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono border-t border-slate-200/60 dark:border-slate-700/60 pt-1">
                                                        <span className="text-slate-500 text-[10px]">
                                                            Fórmula: Bs. {rateBs.toFixed(2)}/m²
                                                        </span>
                                                        <span className="font-bold text-slate-900 dark:text-[#fbad03]">
                                                            Bs. {subtotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeService(service.id)}
                                                    className="size-5 rounded flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 transition-colors"
                                                    title="Quitar servicio de la cotización"
                                                >
                                                    <Trash2 className="size-3" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {activeServices.length === 0 && (
                                        <p className="text-xs text-slate-400 text-center py-2 italic">
                                            No hay servicios agregados todavía.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="space-y-2 pt-2">
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full bg-[#00253d] hover:bg-[#003e65] text-white font-bold h-9 text-xs shadow-xs gap-2"
                                >
                                    <Save className="size-3.5" />
                                    Guardar y Sincronizar Cotización
                                </Button>

                                {savedNotification && (
                                    <div className="rounded-md bg-emerald-50 border border-emerald-200 p-2 text-center text-xs font-semibold text-emerald-800">
                                        ✓ Cotización guardada en el sistema
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleWhatsApp}
                                    className="w-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border-emerald-200/80 font-semibold h-9 text-xs gap-2"
                                >
                                    <MessageCircle className="size-3.5 text-emerald-600" />
                                    Compartir por WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER DEL SISTEMA */}
            <footer className="border-t border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 print:hidden mt-auto">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
                    <div>
                        &copy; 2026 BIMETICA ARQUITECTURA &amp; INGENIERÍA | ESTÁNDAR ISO 19650 BIM / AEC VALUATION
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
                        <Lock className="size-3" />
                        <span>Entorno Seguro Transaccional</span>
                    </div>
                </div>
            </footer>
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
