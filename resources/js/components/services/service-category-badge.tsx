interface ServiceCategoryBadgeProps {
    category?: 'design' | 'construction';
    className?: string;
}

/**
 * Badge visual unificado para la categoría de un servicio (Diseño vs Construcción).
 * Centraliza los colores institucionales y el texto en español en un solo lugar.
 */
export function ServiceCategoryBadge({
    category = 'design',
    className = '',
}: ServiceCategoryBadgeProps) {
    const isConstruction = category === 'construction';

    return (
        <span
            className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                isConstruction
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                    : 'text-[#2684a8] bg-[#2684a8]/10'
            } ${className}`}
        >
            {isConstruction ? 'Construcción' : 'Diseño'}
        </span>
    );
}

