import { FormulaList } from '@/components/services/formula-list';
import type { ServiceItem } from '@/components/services/services-list';
import { MOCK_VARIABLES } from '@/components/services/variable-list';

interface FormulaPanelProps {
    selectedService: ServiceItem | null;
    availableVariables?: string[];
}

export function FormulaPanel({ selectedService, availableVariables = [] }: FormulaPanelProps) {
    if (!selectedService) {
        return (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                Selecciona un servicio del catálogo para ver sus fórmulas asociadas.
            </div>
        );
    }

    const availableVariableNames =
        availableVariables.length > 0
            ? availableVariables
            : MOCK_VARIABLES.map((v) => v.name);

    return (
        <div className="space-y-2">
            {/* Fórmulas específicas de este servicio cargadas desde BD */}
            <FormulaList
                key={selectedService.id}
                serviceId={selectedService.id}
                serviceName={selectedService.name}
                formulas={selectedService.formulas ?? []}
                availableVariableNames={availableVariableNames}
            />
        </div>
    );
}
