import {
    Building,
    FileSpreadsheet,
    MapPin,
    Phone,
    Printer,
    User,
    UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ClientItem } from '@/types/quotes';

interface QuoteClientHeaderProps {
    quoteCode: string;
    clientData: ClientItem;
    clientsList: ClientItem[];
    onSelectClient: (client: ClientItem) => void;
    terrainArea: number;
    onChangeTerrainArea: (val: number) => void;
    projectType: string;
    onChangeProjectType: (val: string) => void;
    onPrint: () => void;
}

export function QuoteClientHeader({
    quoteCode,
    clientData,
    clientsList,
    onSelectClient,
    terrainArea,
    onChangeTerrainArea,
    projectType,
    onChangeProjectType,
    onPrint,
}: QuoteClientHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Barra superior con metadatos de cotización */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5 rounded-lg bg-[#003e65] px-3 py-1.5 text-white shadow-xs">
                        <FileSpreadsheet className="size-4 text-[#fbad03]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                            COTIZACIÓN
                        </span>
                        <span className="font-mono text-xs font-extrabold text-[#fbad03]">
                            {quoteCode}
                        </span>
                    </div>

                    <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                        ● Borrador Comercial
                    </Badge>

                    <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Building className="size-3.5 text-slate-400" />
                        <span>Sede Central — La Paz</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onPrint}
                        className="h-8 gap-1.5 text-xs text-slate-700 hover:text-slate-900 dark:text-slate-300"
                    >
                        <Printer className="size-3.5" />
                        <span className="hidden sm:inline">Imprimir / Vista Previa</span>
                    </Button>
                </div>
            </div>

            {/* Tarjeta de Datos del Cliente y Expediente */}
            <Card className="border-slate-200/80 shadow-xs dark:border-slate-800">
                <CardContent className="p-4 sm:p-5">
                    <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-md bg-[#003e65]/10 text-[#003e65] dark:bg-[#003e65]/30 dark:text-[#fbad03]">
                                <User className="size-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-[#003e65] dark:text-[#fbad03]">
                                    Expediente del Cliente
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Información del comitente y características preliminares del predio
                                </p>
                            </div>
                        </div>

                        {/* Selector rápido si hay clientes preexistentes */}
                        {clientsList.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Label htmlFor="select-client" className="hidden sm:inline text-[11px] text-slate-500">
                                    Cargar cliente:
                                </Label>
                                <select
                                    id="select-client"
                                    value={clientData.id}
                                    onChange={(e) => {
                                        const found = clientsList.find((c) => c.id === Number(e.target.value));
                                        if (found) onSelectClient(found);
                                    }}
                                    className="h-7 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-xs focus:border-[#003e65] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                    {clientsList.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.code} — {c.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Cliente / Comitente
                            </Label>
                            <div className="relative mt-1">
                                <UserCheck className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                                <Input
                                    type="text"
                                    value={clientData.full_name}
                                    readOnly
                                    className="h-8.5 bg-slate-50/70 pl-8 font-semibold text-xs text-slate-800 dark:bg-slate-800/70 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Cédula / Teléfono
                            </Label>
                            <div className="relative mt-1">
                                <Phone className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                                <Input
                                    type="text"
                                    value={`${clientData.ci || 'Sin CI'} | Cel: ${clientData.phone || 'S/N'}`}
                                    readOnly
                                    className="h-8.5 bg-slate-50/70 pl-8 text-xs text-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                Ubicación del Proyecto / Predio
                            </Label>
                            <div className="relative mt-1">
                                <MapPin className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                                <Input
                                    type="text"
                                    value={clientData.address || 'La Paz, Bolivia'}
                                    readOnly
                                    className="h-8.5 bg-slate-50/70 pl-8 text-xs text-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Sup. Terreno (m²)
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={terrainArea}
                                    onChange={(e) => onChangeTerrainArea(Number(e.target.value) || 0)}
                                    className="mt-1 h-8.5 font-mono text-xs font-semibold"
                                />
                            </div>
                            <div>
                                <Label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                                    Tipología
                                </Label>
                                <Input
                                    type="text"
                                    value={projectType}
                                    onChange={(e) => onChangeProjectType(e.target.value)}
                                    placeholder="Vivienda Unifamiliar"
                                    className="mt-1 h-8.5 text-xs truncate"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
