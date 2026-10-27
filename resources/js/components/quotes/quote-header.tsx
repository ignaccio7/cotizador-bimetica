interface QuoteHeaderProps {
    quoteCode: string;
}

export function QuoteHeader({ quoteCode }: QuoteHeaderProps) {
    return (
        <header className="space-y-4">
            {/* Cabecera de la Hoja: Logotipo y Metadatos de Expediente */}
            <div className="flex items-start justify-between gap-4 pt-1">
                {/* Logo Oficial Bimetica */}
                <div className="flex items-center">
                    <img
                        src="/bimetica_logo.png"
                        alt="Bimetica — Diseño y Construcción"
                        className="h-10 sm:h-12 w-auto object-contain dark:hidden print:block"
                    />
                    <img
                        src="/bimetica_logo_blanco.png"
                        alt="Bimetica — Diseño y Construcción"
                        className="h-10 sm:h-12 w-auto object-contain hidden dark:block print:hidden"
                    />
                </div>

                {/* Expediente y Vigencia */}
                <div className="text-right">
                    <div className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-secondary-700 dark:text-secondary">
                        EXPEDIENTE Nº {quoteCode}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                        La Paz, Bolivia · Vigencia 7 días
                    </div>
                </div>
            </div>

            {/* Título Central de la Hoja */}
            <div className="text-center py-1 sm:py-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-primary-950 dark:text-foreground">
                    COTIZACIÓN
                </h1>
            </div>
        </header>
    );
}
