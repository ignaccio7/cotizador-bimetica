import { FormulaList } from '@/components/services/formula-list';
import type { ServiceItem, VariableItem } from '@/types';

interface FormulaPanelProps {
    selectedService: ServiceItem | null;
    availableVariables?: VariableItem[];
}

export function FormulaPanel({ selectedService, availableVariables = [] }: FormulaPanelProps) {
    if (!selectedService) {
        return (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                Selecciona un servicio del catálogo para ver sus fórmulas asociadas.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <FormulaList
                service={selectedService}
                availableVariables={availableVariables}
            />
        </div>
    );
}
