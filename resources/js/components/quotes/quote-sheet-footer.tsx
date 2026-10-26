interface QuoteSheetFooterProps {
    validityDays?: number;
    advisorName?: string;
    advisorPhone?: string;
    dateText?: string;
}

export function QuoteSheetFooter({
    validityDays = 7,
    advisorName = 'Ing. Mariela Vasquez',
    advisorPhone = '71212168',
    dateText,
}: QuoteSheetFooterProps) {
    const today =
        dateText ||
        new Date().toLocaleDateString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    return (
        <div className="mt-8 pt-4 border-t border-border space-y-6 text-xs text-foreground print-break-inside-avoid">
            {/* Fila Superior: Modalidad de Pagos (Izq) + Asesor Comercial (Der) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                {/* Bloque Izquierdo: Condiciones Comerciales */}
                <div className="sm:col-span-7 space-y-1">
                    <p className="text-[11px] italic text-muted-foreground font-serif">
                        Esta cotización tiene una validez de {validityDays} días calendario.
                    </p>
                    <p className="font-bold text-primary text-xs tracking-tight">
                        Modalidad de Pagos:
                    </p>
                    <ol className="text-[11px] text-muted-foreground space-y-0.5 leading-relaxed pl-1">
                        <li>
                            <span className="font-semibold text-foreground">1.</span> Al contado (Pago anticipado 100%)
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">2.</span> De acuerdo a Planilla de pagos (Inicio 50% de adelanto; 50% en Primera presentación).
                        </li>
                    </ol>
                </div>

                {/* Bloque Derecho: Asesor Comercial */}
                <div className="sm:col-span-5 text-left sm:text-center space-y-1">
                    <p className="font-bold text-foreground text-xs uppercase tracking-wide">
                        Asesor Comercial
                    </p>
                    <p className="text-[11px] italic text-muted-foreground">
                        {advisorName} - <span className="text-primary font-semibold not-italic">Cel: {advisorPhone}</span>
                    </p>
                </div>
            </div>

            {/* Cintillo Inferior Oficial con Fecha y Ubicación */}
            <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11.5px] text-foreground font-medium">
                <div>
                    <span>{today}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1 text-center sm:text-right">
                    <span>📌 Av. 16 de Julio (el prado), Edicio San Pablo # 1479, piso 5, Of. 506 - La Paz ,</span>
                    <span className="font-semibold text-primary">📱 +591-{advisorPhone}</span>
                </div>
            </div>
        </div>
    );
}
