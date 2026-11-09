import { BimeticaPaymentQr } from '@/components/quotes/bimetica-payment-qr';

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
        <footer className="mt-8 pt-4 border-t border-border space-y-6 text-xs text-foreground print-break-inside-avoid">
            {/* Fila Superior: Modalidad de Pagos (Izq) + Cuentas Habilitadas (Centro) + QR y Asesor (Der) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* 1. Bloque Izquierdo: Condiciones Comerciales (5 cols) */}
                <div className="md:col-span-5 space-y-1">
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

                {/* 2. Bloque Central: Cuentas Habilitadas (4 cols - Texto limpio sin diseño de tarjeta) */}
                <div className="md:col-span-4 space-y-1">
                    <p className="font-bold text-primary text-xs tracking-tight">
                        Cuentas Habilitadas:
                    </p>
                    <div className="text-[11px] text-muted-foreground space-y-0.5 leading-relaxed">
                        <p>
                            <span className="font-semibold text-foreground">Banco Unión (Bs.):</span>{' '}
                            <span className="font-mono text-foreground font-medium">100000458921</span>{' '}
                            <span className="text-[10px] text-muted-foreground">(Cta. Cte.)</span>
                        </p>
                        <p>
                            <span className="font-semibold text-foreground">Banco BCP (Bs.):</span>{' '}
                            <span className="font-mono text-foreground font-medium">201-5098234-3-12</span>{' '}
                            <span className="text-[10px] text-muted-foreground">(Cta. Ahorros)</span>
                        </p>
                        <p className="text-[10.5px]">
                            Titular: <span className="font-semibold text-foreground">BIMETICA S.R.L.</span>
                        </p>
                    </div>
                </div>

                {/* 3. Bloque Derecho: Pago QR Simple y Asesor Comercial (3 cols) */}
                <div className="md:col-span-3 flex flex-col md:items-end gap-2.5 text-left md:text-right">
                    <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg border border-border shadow-2xs self-start md:self-end">
                        <BimeticaPaymentQr size={46} />
                        <div className="text-left text-[10px] space-y-0.5">
                            <span className="inline-block px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase">
                                QR Simple
                            </span>
                            <p className="font-bold text-foreground leading-none">Bimetica S.R.L.</p>
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-xs uppercase tracking-wide">
                            Asesor Comercial
                        </p>
                        <p className="text-[11px] italic text-muted-foreground">
                            {advisorName} - <span className="text-primary font-semibold not-italic">Cel: {advisorPhone}</span>
                        </p>
                    </div>
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
        </footer>
    );
}
