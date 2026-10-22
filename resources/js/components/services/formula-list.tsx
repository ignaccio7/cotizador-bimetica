import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Calculator, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import formulasRoute from '@/routes/services/formulas';
import { FormulaForm } from './formulas/formula-form';
import { FormulaCard } from './formulas/formula-item';
import { FormulaSandboxModal } from './formulas/formula-sandbox-modal';
import type { FormulaItem } from './formulas/formula-types';

export type { FormulaItem };

interface FormulaListProps {
    serviceId: number;
    formulas?: FormulaItem[];
    serviceName?: string;
    availableVariableNames?: string[];
}

export function FormulaList({
    serviceId,
    formulas = [],
    serviceName = 'Servicio',
    availableVariableNames = ['m2', 'pozos', 'complejidad', 'cambiodolar'],
}: FormulaListProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFormula, setEditingFormula] = useState<FormulaItem | null>(null);
    const [testingFormula, setTestingFormula] = useState<FormulaItem | null>(null);

    const handleStartCreate = () => {
        setEditingFormula(null);
        setIsFormOpen(true);
    };

    const handleStartEdit = (formula: FormulaItem) => {
        setEditingFormula(formula);
        setIsFormOpen(true);
    };

    const handleCancelForm = () => {
        setIsFormOpen(false);
        setEditingFormula(null);
    };

    const handleDeleteFormula = (formulaId: number) => {
        router.delete(
            formulasRoute.destroy({ service: serviceId, formula: formulaId }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (editingFormula?.id === formulaId) {
                        handleCancelForm();
                    }
                },
            }
        );
    };

    return (
        <Card className="border shadow-xs bg-card">
            <CardHeader className="border-b bg-muted/20 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Calculator className="size-4 text-primary" />
                        <div>
                            <CardTitle className="text-xs font-bold tracking-wider text-foreground">
                                Fórmulas del Servicio: {serviceName} ({formulas.length})
                            </CardTitle>
                            <p className="text-[11px] text-muted-foreground">
                                Cada fórmula calcula un valor del servicio. Las visibles se muestran como columnas en la cotización.
                            </p>
                        </div>
                    </div>

                    {!isFormOpen && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleStartCreate}
                            className="bg-primary text-primary-foreground font-semibold text-xs h-8 shadow-xs hover:bg-primary/90 cursor-pointer"
                        >
                            <Plus className="mr-1.5 size-3.5" />
                            Nueva Fórmula
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
                {/* Formulario Modular de Creación / Edición conectado con Wayfinder */}
                {isFormOpen && (
                    <FormulaForm
                        serviceId={serviceId}
                        initialFormula={editingFormula}
                        availableVariableNames={availableVariableNames}
                        previousFormulaCodes={formulas
                            .filter((f) => !editingFormula || f.id !== editingFormula.id)
                            .map((f) => f.code)
                            .filter(Boolean)}
                        onSuccess={handleCancelForm}
                        onCancel={handleCancelForm}
                    />
                )}

                {/* Lista de Fórmulas Existentes de la BD para este Servicio */}
                {formulas.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                        No hay fórmulas configuradas para este servicio. Haz clic en "Nueva Fórmula" para crear la primera.
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {formulas.map((formula, index) => (
                            <FormulaCard
                                key={formula.id}
                                formula={formula}
                                index={index}
                                onEdit={handleStartEdit}
                                onDelete={handleDeleteFormula}
                                onTest={(f) => setTestingFormula(f)}
                            />
                        ))}
                    </div>
                )}

                {/* Modal de Prueba / Simulador de Cálculo (Sandbox) */}
                <FormulaSandboxModal
                    formula={testingFormula}
                    allFormulas={formulas}
                    open={Boolean(testingFormula)}
                    onOpenChange={(open) => !open && setTestingFormula(null)}
                />
            </CardContent>
        </Card>
    );
}
