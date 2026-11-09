interface BimeticaPaymentQrProps {
    size?: number;
    className?: string;
}

export function BimeticaPaymentQr({
    size = 64,
    className = '',
}: BimeticaPaymentQrProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            shapeRendering="crispEdges"
            aria-label="Código QR de Pago Simple Bimetica"
        >
            <rect width="29" height="29" fill="white" />

            {/* Localizador Superior Izquierdo */}
            <rect x="2" y="2" width="7" height="7" fill="#003e65" />
            <rect x="3" y="3" width="5" height="5" fill="white" />
            <rect x="4" y="4" width="3" height="3" fill="#003e65" />

            {/* Localizador Superior Derecho */}
            <rect x="20" y="2" width="7" height="7" fill="#003e65" />
            <rect x="21" y="3" width="5" height="5" fill="white" />
            <rect x="22" y="4" width="3" height="3" fill="#003e65" />

            {/* Localizador Inferior Izquierdo */}
            <rect x="2" y="20" width="7" height="7" fill="#003e65" />
            <rect x="3" y="21" width="5" height="5" fill="white" />
            <rect x="4" y="22" width="3" height="3" fill="#003e65" />

            {/* Guías de sincronización (Timing lines) */}
            <rect x="10" y="5" width="1" height="1" fill="#003e65" />
            <rect x="12" y="5" width="1" height="1" fill="#003e65" />
            <rect x="14" y="5" width="1" height="1" fill="#003e65" />
            <rect x="16" y="5" width="1" height="1" fill="#003e65" />
            <rect x="18" y="5" width="1" height="1" fill="#003e65" />

            <rect x="5" y="10" width="1" height="1" fill="#003e65" />
            <rect x="5" y="12" width="1" height="1" fill="#003e65" />
            <rect x="5" y="14" width="1" height="1" fill="#003e65" />
            <rect x="5" y="16" width="1" height="1" fill="#003e65" />
            <rect x="5" y="18" width="1" height="1" fill="#003e65" />

            {/* Patrón de alineación (Inferior Derecho) */}
            <rect x="18" y="18" width="5" height="5" fill="#003e65" />
            <rect x="19" y="19" width="3" height="3" fill="white" />
            <rect x="20" y="20" width="1" height="1" fill="#003e65" />

            {/* Módulos de datos densos */}
            <rect x="10" y="2" width="2" height="1" fill="#003e65" />
            <rect x="14" y="2" width="1" height="2" fill="#003e65" />
            <rect x="17" y="2" width="2" height="1" fill="#003e65" />
            <rect x="10" y="7" width="1" height="2" fill="#003e65" />
            <rect x="13" y="8" width="2" height="1" fill="#003e65" />
            <rect x="16" y="7" width="1" height="2" fill="#003e65" />

            <rect x="2" y="10" width="2" height="1" fill="#003e65" />
            <rect x="7" y="10" width="1" height="2" fill="#003e65" />
            <rect x="2" y="14" width="1" height="2" fill="#003e65" />
            <rect x="7" y="15" width="2" height="1" fill="#003e65" />
            <rect x="2" y="18" width="2" height="1" fill="#003e65" />

            {/* Matriz Central */}
            <rect x="10" y="10" width="2" height="2" fill="#003e65" />
            <rect x="13" y="10" width="1" height="3" fill="#003e65" />
            <rect x="15" y="11" width="3" height="1" fill="#003e65" />
            <rect x="10" y="13" width="2" height="1" fill="#003e65" />
            <rect x="12" y="14" width="2" height="2" fill="#003e65" />
            <rect x="15" y="13" width="2" height="2" fill="#003e65" />
            <rect x="10" y="17" width="1" height="2" fill="#003e65" />
            <rect x="13" y="16" width="3" height="1" fill="#003e65" />

            {/* Matriz Derecha */}
            <rect x="20" y="10" width="2" height="2" fill="#003e65" />
            <rect x="24" y="10" width="3" height="1" fill="#003e65" />
            <rect x="22" y="13" width="2" height="1" fill="#003e65" />
            <rect x="26" y="12" width="1" height="3" fill="#003e65" />
            <rect x="24" y="15" width="2" height="2" fill="#003e65" />
            <rect x="20" y="15" width="1" height="2" fill="#003e65" />

            {/* Matriz Inferior */}
            <rect x="10" y="21" width="3" height="1" fill="#003e65" />
            <rect x="14" y="20" width="1" height="3" fill="#003e65" />
            <rect x="16" y="21" width="2" height="2" fill="#003e65" />
            <rect x="10" y="24" width="2" height="2" fill="#003e65" />
            <rect x="13" y="25" width="3" height="1" fill="#003e65" />
            <rect x="11" y="27" width="4" height="1" fill="#003e65" />
            <rect x="17" y="26" width="2" height="1" fill="#003e65" />
            <rect x="24" y="24" width="3" height="2" fill="#003e65" />
            <rect x="25" y="21" width="2" height="2" fill="#003e65" />
            <rect x="24" y="27" width="2" height="1" fill="#003e65" />

            {/* Acento central arquitectónico (Dorado Bimetica) */}
            <rect x="14" y="14" width="1" height="1" fill="#fbad03" />
        </svg>
    );
}

