import {
    CheckCircle2,
    FileCheck,
    Lock,
    MapPin,
    MessageCircle,
    Save,
    ShieldCheck,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { CityItem } from '@/types/quotes';
import type { ServiceItem } from '@/types/services';

interface QuoteSummarySidebarProps {
    activeServices: ServiceItem[];
    serviceSubtotals: Record<number, number>;
    cities: CityItem[];
    selectedCityId: number;
    onChangeCity: (cityId: number) => void;
    totalServicesBs: number;
    viaticoBs: number;
    grandTotalBs: number;
    onSave: () => void;
    isSaving: boolean;
    savedSuccess: boolean;
    onWhatsApp: () => void;
}

export function QuoteSummarySidebar({
    activeServices,
    serviceSubtotals,
    cities,
    selectedCityId,
    onChangeCity,
    totalServicesBs,
    viaticoBs,
    grandTotalBs,
    onSave,
    isSaving,
    savedSuccess,
    onWhatsApp,
}: QuoteSummarySidebarProps) {
    const selectedCity = cities.find((c) => c.id === selectedCityId);

    return (
        <div className="space-y-4 lg:sticky lg:top-4">
            <Card className="border-slate-200/90 shadow-md dark:border-slate-800 overflow-hidden">
                <CardHeader className="bg-[#003e65] text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="size-4.5 text-[#fbad03]" />
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">
                                Resumen Comercial
                            </CardTitle>
                        </div>
                        <Badge className="bg-[#fbad03] text-slate-900 font-extrabold text-[10px]">
                            {activeServices.length} {activeServices.length === 1 ? 'Servicio' : 'Servicios'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    {/* Desglose de Servicios */}
                    <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Desglose de Servicios
                        </div>

                        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                            {activeServices.map((service) => {
                                const sub = serviceSubtotals[service.id] || 0;
                                return (
                                    <div
                                        key={service.id}
                                        className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                    >
                                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]" title={service.name}>
                                            {service.name}
                                        </span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                                            Bs. {sub.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                );
                            })}

                            {activeServices.length === 0 && (
                                <p className="text-xs text-slate-400 italic text-center py-2">
                                    No hay servicios seleccionados.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Selector de Ciudad (Viáticos de Parámetros) */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <MapPin className="size-3.5 text-[#2684a8]" />
                            <Label htmlFor="city-select" className="text-xs">
                                Ciudad / Desplazamiento
                            </Label>
                        </div>

                        <select
                            id="city-select"
                            value={selectedCityId}
                            onChange={(e) => onChangeCity(Number(e.target.value))}
                            className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-[#003e65] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name} {city.viatico > 0 ? `(+Bs. ${city.viatico.toFixed(2)})` : '(Sin recargo)'}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span>Viático fijado por parámetro:</span>
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                Bs. {viaticoBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Totalización */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 space-y-2 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>Subtotal Servicios:</span>
                            <span className="font-mono font-semibold">
                                Bs. {totalServicesBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <span>Viáticos de Viaje:</span>
                            <span className="font-mono font-semibold">
                                Bs. {viaticoBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-baseline justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#003e65] dark:text-[#fbad03] block">
                                    Inversión Total:
                                </span>
                                <span className="text-[10px] text-slate-500">Moneda nacional (BOB)</span>
                            </div>
                            <span className="font-mono text-xl font-extrabold text-[#003e65] dark:text-[#fbad03]">
                                Bs. {grandTotalBs.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="space-y-2 pt-1">
                        <Button
                            type="button"
                            onClick={onSave}
                            disabled={isSaving || activeServices.length === 0}
                            className="w-full bg-[#003e65] hover:bg-[#002f4d] text-white font-bold h-9.5 text-xs shadow-xs gap-2"
                        >
                            <Save className="size-4 text-[#fbad03]" />
                            <span>{isSaving ? 'Guardando...' : 'Guardar Cotización'}</span>
                        </Button>

                        {savedSuccess && (
                            <div className="flex items-center justify-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 p-2 text-center text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                <span>Cotización registrada en el sistema</span>
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={onWhatsApp}
                            disabled={activeServices.length === 0}
                            className="w-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border-emerald-200/90 font-semibold h-9 text-xs gap-2 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300"
                        >
                            <MessageCircle className="size-4 text-emerald-600" />
                            <span>Compartir por WhatsApp</span>
                        </Button>
                    </div>

                    {/* Sello de Confianza / Normativa */}
                    <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-slate-400 text-center">
                        <ShieldCheck className="size-3 text-[#2684a8]" />
                        <span>ESTÁNDAR BIMETICA ISO 19650 BIM / AEC VALUATION</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
