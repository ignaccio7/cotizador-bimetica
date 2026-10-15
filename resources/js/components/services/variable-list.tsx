import { Database, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface VariableMock {
    id: number;
    name: string;
    type: 'static' | 'dynamic';
    value_type: 'integer' | 'decimal' | 'string';
    default_value: string;
    options?: string[] | null;
    description?: string;
}

// Catálogo de variables base del sistema (Paso 4.1 UI)
export const MOCK_VARIABLES: VariableMock[] = [
    {
        id: 1,
        name: 'm2',
        type: 'dynamic',
        value_type: 'decimal',
        default_value: '0',
        options: null,
        description: 'Superficie en m² del piso o grupo',
    },
    {
        id: 2,
        name: 'pozos',
        type: 'dynamic',
        value_type: 'integer',
        default_value: '0',
        options: null,
        description: 'Cantidad de pozos SPT para estudio de suelos',
    },
    {
        id: 3,
        name: 'complejidad',
        type: 'dynamic',
        value_type: 'string',
        default_value: 'medio',
        options: ['bajo', 'medio', 'alto'],
        description: 'Nivel arquitectónico del proyecto',
    },
    {
        id: 4,
        name: 'cambiodolar',
        type: 'static',
        value_type: 'decimal',
        default_value: '12.11',
        options: null,
        description: 'Tipo de cambio referencial USD/BOB',
    },
];

interface VariableListProps {
    variables?: VariableMock[];
    selectedVariableNames?: string[];
    onInsertVariable?: (varName: string) => void;
}

export function VariableList({
    variables = MOCK_VARIABLES,
    selectedVariableNames = [],
    onInsertVariable,
}: VariableListProps) {
    return (
        <Card className="border shadow-xs bg-card">
            <CardHeader className="border-b bg-muted/20 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="size-4 text-primary" />
                        <div>
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                                Variables del Sistema ({variables.length})
                            </CardTitle>
                            <p className="text-[11px] text-muted-foreground">
                                Haz clic en una variable para insertarla directamente en la fórmula activa.
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">
                        Disponibles para Fórmulas
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {variables.map((v) => {
                        const isUsedInActiveFormulas = selectedVariableNames.includes(v.name);

                        return (
                            <div
                                key={v.id}
                                onClick={() => onInsertVariable?.(v.name)}
                                className={`group relative rounded-lg border p-2.5 transition-all text-xs cursor-pointer ${
                                    isUsedInActiveFormulas
                                        ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-xs'
                                        : 'border-border/70 bg-background hover:border-primary/40 hover:bg-muted/30'
                                }`}
                                title={`Haz clic para insertar "${v.name}" en la fórmula`}
                            >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <code className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-bold text-primary">
                                            {v.name}
                                        </code>
                                        <Plus className="size-3 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                    </div>

                                    {v.type === 'dynamic' ? (
                                        <Badge className="bg-emerald-600/90 text-white text-[9px] px-1 py-0 font-medium">
                                            Dinámica
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-[9px] px-1 py-0 font-medium">
                                            Estática
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-[11px] text-muted-foreground line-clamp-1">
                                    {v.description}
                                </p>

                                <div className="mt-1.5 pt-1.5 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span>Tipo: <strong className="font-mono text-foreground">{v.value_type}</strong></span>
                                    <span>Defecto: <strong className="font-mono text-foreground">{v.default_value}</strong></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
