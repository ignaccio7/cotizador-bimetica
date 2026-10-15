import { Sparkles } from 'lucide-react';
import { FormulaList, MOCK_FORMULAS } from '@/components/services/formula-list';
import type { ServiceItem } from '@/components/services/services-list';
import { MOCK_VARIABLES } from '@/components/services/variable-list';

interface FormulaPanelProps {
    selectedService: ServiceItem | null;
}

export function FormulaPanel({ selectedService }: FormulaPanelProps) {
    if (!selectedService) {
        return (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                Selecciona un servicio del catálogo para ver sus fórmulas asociadas.
            </div>
        );
    }

    const availableVariableNames = MOCK_VARIABLES.map((v) => v.name);

    return (
        <div className="space-y-4">
            {/* Banner Informativo Superior */}
            <div className="flex items-start justify-between gap-3 rounded-lg border border-secondary-500/30 bg-secondary-50/40 p-3 text-xs text-foreground dark:border-secondary-500/20 dark:bg-secondary-950/20">
                <div className="flex items-start gap-2.5">
                    <Sparkles className="size-4 shrink-0 text-secondary-600 dark:text-secondary-400 mt-0.5" />
                    <div className="space-y-0.5">
                        <p className="font-semibold text-secondary-950 dark:text-secondary-100">
                            Fórmulas y Columnas de Cotización — {selectedService.name}
                        </p>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                            Define las fórmulas que calculan los montos de este servicio. Al crear o editar una fórmula, puedes insertar variables globales haciendo clic en los botones del asistente.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fórmulas específicas de este servicio */}
            <FormulaList
                formulas={MOCK_FORMULAS}
                serviceName={selectedService.name}
                availableVariableNames={availableVariableNames}
            />
        </div>
    );
}
