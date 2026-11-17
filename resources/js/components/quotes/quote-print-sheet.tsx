import { BimeticaPaymentQr } from '@/components/quotes/bimetica-payment-qr';
import type { ClientData } from '@/components/quotes/quote-client-card';
import { calculateQuoteBreakdown } from '@/components/quotes/quote-financial-panel';
import type { FloorGroupItem } from '@/components/quotes/quote-floor-table';
import { evaluateFormulaChain } from '@/lib/formula-engine';
import {
    resolveFormulaDependencies,
    type FormulaDependencyItem,
} from '@/lib/formula-validator';
import type {
    FormulaItem,
    ParameterItem,
    ServiceItem,
    VariableItem,
} from '@/lib/quote-services';

export type DesignParameters = Record<string, string>;

interface QuotePrintSheetProps {
    quoteCode: string;
    clientData: ClientData;
    floorGroups: FloorGroupItem[];
    activeServices: ServiceItem[];
    serviceVariables?: Record<number, Record<string, string>>;
    designParameters?: DesignParameters;
    availableParameters?: ParameterItem[];
    advisorName?: string;
    advisorPhone?: string;
    quoteDate?: string;
    savedTotalAmount?: number;
    beforeFooterSlot?: React.ReactNode;
}

type BlockColumn =
    | {
        kind: 'variable';
        variable: VariableItem;
    }
    | {
        kind: 'parameter';
        group: string;
        label: string;
        items: ParameterItem[];
    }
    | {
        kind: 'formula';
        formula: FormulaItem;
    };

// ── COMPONENTE AUXILIAR: BLOQUE DE SERVICIO IMPRESO ──
function PrintServiceBlock({
    service,
    serviceVariables,
    designParameters = {},
    availableParameters = [],
}: {
    service: ServiceItem;
    serviceVariables: Record<number, Record<string, string>>;
    designParameters?: DesignParameters;
    availableParameters?: ParameterItem[];
}) {
    const varValues = serviceVariables[service.id] || {};
    const values: Record<string, number | string> = {};

    // 1. Identificar parámetros de servicio (scope === 'service') referenciados en las fórmulas
    const allExpressions = (service.formulas || []).map((f) => f.expression).join(' ');
    const serviceParams = availableParameters.filter((p) => p.scope === 'service');

    const serviceParamGroupsMap = new Map<string, { group: string; label: string; items: ParameterItem[] }>();
    serviceParams.forEach((p) => {
        if (!serviceParamGroupsMap.has(p.group)) {
            serviceParamGroupsMap.set(p.group, {
                group: p.group,
                label: p.group_label || p.group,
                items: [],
            });
        }
        serviceParamGroupsMap.get(p.group)!.items.push(p);
    });

    const referencedServiceParamGroups = Array.from(serviceParamGroupsMap.values()).filter((pg) => {
        const regex = new RegExp(`\\b${pg.group}\\b`, 'i');
        return regex.test(allExpressions);
    });

    service.formulas?.forEach((f) => {
        f.variables?.forEach((v) => {
            if (v.type === 'dynamic') {
                const userVal = varValues[v.name];
                if (v.value_type === 'string') {
                    values[v.name] = userVal !== undefined && userVal !== ''
                        ? userVal
                        : (v.default_value ?? '');
                } else {
                    values[v.name] =
                        userVal !== undefined && userVal !== ''
                            ? Number(userVal) || 0
                            : Number(v.default_value) || 0;
                }
            } else {
                values[v.name] = v.value_type === 'string'
                    ? (v.default_value ?? '')
                    : Number(v.default_value) || 0;
            }
        });
    });

    // Inyectar el valor numérico del parámetro de servicio al scope de Math.js
    referencedServiceParamGroups.forEach((pg) => {
        const userVal = varValues[pg.group];
        const defaultVal = pg.items[0]?.value ?? 0;
        values[pg.group] = userVal !== undefined && userVal !== ''
            ? Number(userVal) || 0
            : Number(defaultVal) || 0;
    });

    if (designParameters) {
        Object.entries(designParameters).forEach(([k, val]) => {
            if (val !== undefined && val !== '' && !k.endsWith('_label') && !k.endsWith('_id')) {
                values[k] = Number(val) || 0;
            }
        });
    }

    const allDependencyFormulas: FormulaDependencyItem[] = (service.formulas || []).map((f) => ({
        id: f.id ?? f.name,
        code: f.code ?? '',
        expression: f.expression,
        name: f.name,
        variables: f.variables,
    }));

    const columns: BlockColumn[] = [];
    const seenVarNames = new Set<string>();
    const seenParamGroups = new Set<string>();

    service.formulas?.forEach((formula) => {
        // 1. Variables dinámicas
        formula.variables
            ?.filter((v) => v.type === 'dynamic')
            .forEach((v) => {
                if (!seenVarNames.has(v.name)) {
                    seenVarNames.add(v.name);
                    columns.push({ kind: 'variable', variable: v });
                }
            });

        // 2. Parámetros de servicio
        referencedServiceParamGroups.forEach((pg) => {
            const regex = new RegExp(`\\b${pg.group}\\b`, 'i');
            if (regex.test(formula.expression) && !seenParamGroups.has(pg.group)) {
                seenParamGroups.add(pg.group);
                columns.push({
                    kind: 'parameter',
                    group: pg.group,
                    label: pg.label,
                    items: pg.items,
                });
            }
        });

        // 3. Fórmula
        if (formula.is_visible !== false) {
            columns.push({ kind: 'formula', formula });
        }
    });

    const totalCols = Math.max(1, columns.length);

    return (
        <div className="border border-gray-400 overflow-hidden break-inside-avoid mb-2.5">
            {/* Cabecera del Servicio */}
            <div className="grid grid-cols-12 border-b border-gray-400">
                {/* Título Dorado del Servicio (Mitad Izquierda) */}
                <div className="col-span-6 bg-[#fbad03] text-black px-3 py-1.5 font-black text-[11px] uppercase tracking-wider flex items-center">
                    {service.name}
                </div>

                {/* Columnas de Variables y Fórmulas (Mitad Derecha) */}
                <div
                    className="col-span-6 grid divide-x divide-gray-400"
                    style={{
                        gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
                    }}
                >
                    {columns.map((col) => {
                        if (col.kind === 'variable') {
                            return (
                                <div
                                    key={`prt-hdr-var-${col.variable.name}`}
                                    className="bg-gray-200 text-black px-1 py-1.5 text-center font-black text-[10px] uppercase tracking-wide flex items-center justify-center"
                                >
                                    {col.variable.name}
                                </div>
                            );
                        }

                        if (col.kind === 'parameter') {
                            return (
                                <div
                                    key={`prt-hdr-param-${col.group}`}
                                    className="bg-[#2684a8]/20 text-[#003e65] px-1 py-1.5 text-center font-black text-[10px] uppercase tracking-wide flex items-center justify-center"
                                    title={col.label.toUpperCase()}
                                >
                                    <span className="line-clamp-2">{col.label}</span>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={`prt-hdr-form-${col.formula.name}`}
                                className="bg-[#003e65] text-white px-1 py-1.5 text-center font-black text-[10px] uppercase tracking-tight flex items-center justify-center"
                            >
                                <span className="line-clamp-2">
                                    {col.formula.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Fila de Datos del Servicio */}
            <div className="grid grid-cols-12 divide-x divide-gray-400 min-h-[46px] text-[10.5px]">
                {/* Descripción Técnica */}
                <div className="col-span-6 p-2 text-gray-700 leading-tight flex items-center text-[10px]">
                    {service.description || 'Sin descripción.'}
                </div>

                {/* Valores de Variables y Fórmulas */}
                <div
                    className="col-span-6 grid divide-x divide-gray-400"
                    style={{
                        gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))`,
                    }}
                >
                    {columns.map((col) => {
                        if (col.kind === 'variable') {
                            const v = col.variable;
                            const val = varValues[v.name] ?? v.default_value ?? (v.value_type === 'string' ? '' : '0');

                            return (
                                <div
                                    key={`prt-cell-var-${v.name}`}
                                    className="p-2 flex items-center justify-center font-mono font-bold text-black text-center"
                                >
                                    {val || (v.value_type === 'string' ? '-' : '0')}
                                </div>
                            );
                        }

                        if (col.kind === 'parameter') {
                            const selectedVal = varValues[col.group] !== undefined && varValues[col.group] !== ''
                                ? String(varValues[col.group])
                                : String(col.items[0]?.value ?? '0');
                            const selectedOpt = col.items.find((item) => String(item.value) === String(selectedVal)) ?? col.items[0];

                            return (
                                <div
                                    key={`prt-cell-param-${col.group}`}
                                    className="p-1.5 flex items-center justify-center font-mono font-bold text-black text-center text-[9.5px]"
                                >
                                    {selectedOpt ? selectedOpt.name : '—'}
                                </div>
                            );
                        }

                        const f = col.formula;
                        const currentDep =
                            allDependencyFormulas.find((df) => df.id === (f.id ?? f.name)) ?? {
                                id: f.id ?? f.name,
                                code: f.code ?? '',
                                expression: f.expression,
                            };
                        const { orderedFormulas } = resolveFormulaDependencies(
                            currentDep,
                            allDependencyFormulas
                        );
                        const evaluation = evaluateFormulaChain(
                            f.expression,
                            orderedFormulas,
                            values
                        );

                        return (
                            <div
                                key={`prt-cell-form-${f.name}`}
                                className="p-2 flex items-center justify-center font-mono font-bold text-black text-center"
                            >
                                {evaluation.success
                                    ? evaluation.isNumeric !== false && typeof evaluation.result === 'number'
                                        ? `Bs. ${evaluation.result.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}`
                                        : String(evaluation.result)
                                    : 'Bs. —'}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── COMPONENTE AUXILIAR: TABLA DE PLANTAS ASOCIADA A UN GRUPO ──
function PrintFloorTable({ group }: { group: FloorGroupItem }) {
    const activeFloors = group.floors.filter((f) => f.isActive);
    const totalArea = activeFloors.reduce(
        (sum, f) => sum + (parseFloat(String(f.area)) || 0),
        0
    );

    return (
        <div className="mb-3.5 border border-gray-400 overflow-hidden break-inside-avoid">
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="bg-[#fbad03] text-black border-b border-gray-400">
                        <th className="px-3 py-1 font-black text-left uppercase w-32 tracking-wider">
                            PLANTAS: {group.table_name}
                        </th>
                        <th className="px-3 py-1 font-black text-left uppercase tracking-wider">
                            DESCRIPCIÓN
                        </th>
                        <th className="px-3 py-1 font-black text-center uppercase w-20 tracking-wider">
                            M2
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {activeFloors.length > 0 ? (
                        activeFloors.map((floor) => (
                            <tr
                                key={floor.id}
                                className="border-b border-gray-300 hover:bg-gray-50/50"
                            >
                                <td className="border-r border-gray-300 px-3 py-1 font-bold text-gray-800 uppercase whitespace-nowrap">
                                    {floor.name}
                                </td>
                                <td className="border-r border-gray-300 px-3 py-1 text-gray-700 uppercase">
                                    {floor.description || '—'}
                                </td>
                                <td className="px-3 py-1 text-center font-bold font-mono text-black">
                                    {floor.area ? Number(floor.area).toLocaleString('es-BO') : '0'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-b border-gray-300">
                            <td
                                colSpan={3}
                                className="px-3 py-1.5 text-center text-gray-500 italic"
                            >
                                Sin niveles configurados
                            </td>
                        </tr>
                    )}
                    {/* Fila Total M2 */}
                    <tr className="bg-gray-100 font-bold border-t border-gray-400">
                        <td
                            colSpan={2}
                            className="px-3 py-1 text-right font-black uppercase tracking-wider text-gray-900 border-r border-gray-400"
                        >
                            TOTAL M2 ({group.table_name})
                        </td>
                        <td className="px-3 py-1 text-center font-black font-mono text-black">
                            {totalArea.toLocaleString('es-BO')}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export function QuotePrintSheet({
    quoteCode,
    clientData,
    floorGroups,
    activeServices,
    serviceVariables = {},
    designParameters = {},
    availableParameters = [],
    advisorName = 'Ing. Mariela Vasquez',
    advisorPhone = '71212168',
    quoteDate,
    savedTotalAmount,
    beforeFooterSlot,
}: QuotePrintSheetProps) {
    const displayDate =
        quoteDate ||
        new Date().toLocaleDateString('es-BO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    // ── PARÁMETROS DE DISEÑO DINÁMICOS MEDIANTE MAP (EXCLUYENDO CATEGORÍA DEL PROYECTO QUE YA ESTÁ EN LA CABECERA) ──
    const projectCategoryParam = (availableParameters || []).find((p) => p.group === 'project_category');
    const hasProjectCategory = Boolean(projectCategoryParam);
    const projectCategoryHeaderLabel = projectCategoryParam?.group_label?.toUpperCase() ?? '';

    const groupsMap = new Map<string, { group: string; group_label: string }>();
    (availableParameters || []).forEach((param) => {
        // En la tabla de Parámetros de Diseño solo se muestran parámetros de ámbito global que no estén ya en la ficha del cliente
        if (param.scope === 'global' && param.group !== 'project_category' && !groupsMap.has(param.group)) {
            groupsMap.set(param.group, {
                group: param.group,
                group_label: param.group_label ?? param.group,
            });
        }
    });
    const printParamGroups = Array.from(groupsMap.values());

    const {
        servicesSubtotal,
        discountAmount,
        discountLabel,
        discountPercent,
        viaticoAmount,
        viaticoLabel,
        totalAmount: calculatedTotalAmount,
    } = calculateQuoteBreakdown(
        activeServices,
        serviceVariables,
        designParameters
    );
    const totalAmount = savedTotalAmount !== undefined ? savedTotalAmount : calculatedTotalAmount;

    // ── SECUENCIA RELACIONAL: ASOCIAR CADA TABLA A SUS SERVICIOS CORRESPONDIENTES ──
    const printedServiceIds = new Set<number>();

    // Mapear cada grupo de plantas con sus servicios activos asociados
    const groupBlocks = floorGroups.map((group) => {
        const associatedServices = activeServices.filter(
            (s) => (group.assigned_service_ids || []).includes(s.id) && !printedServiceIds.has(s.id)
        );
        associatedServices.forEach((s) => printedServiceIds.add(s.id));

        return {
            group,
            services: associatedServices,
        };
    });

    // Servicios activos restantes (que no tienen tabla de pisos asignada, ej. Estudio de Suelos)
    const unassignedServices = activeServices.filter((s) => !printedServiceIds.has(s.id));

    return (
        <div className="quote-print-sheet w-full print:max-w-[215mm] mx-auto bg-white text-black font-sans text-xs leading-normal">
            {/* ── 1. CABECERA INSTITUCIONAL: LOGO A LA IZQUIERDA Y EXPEDIENTE A LA DERECHA (IDÉNTICO AL COTIZADOR) ── */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-300 pb-3 mb-2">
                {/* Logo Oficial Bimetica a la Izquierda */}
                <div className="flex items-center">
                    <img
                        src="/bimetica_logo.png"
                        alt="Bimetica — Diseño y Construcción"
                        className="h-12 w-auto object-contain"
                    />
                </div>

                {/* Metadatos de Expediente y Cotización a la Derecha */}
                <div className="text-right">
                    <div className="text-sm font-black uppercase tracking-wider text-[#003e65] font-mono">
                        EXPEDIENTE Nº {quoteCode}
                    </div>
                    <div className="text-[11px] text-gray-700 font-bold">
                        La Paz, Bolivia · Fecha: {displayDate}
                    </div>
                    <div className="text-[10px] text-gray-500 font-medium">
                        Vigencia: 7 días calendario
                    </div>
                </div>
            </div>

            {/* Título Central de la Hoja */}
            <div className="text-center py-1 mb-3">
                <h1 className="text-2xl font-black tracking-widest text-[#003e65] uppercase">
                    COTIZACIÓN
                </h1>
            </div>

            {/* ── 2. DATOS DEL CLIENTE (FORMATO 2x2 CON LÍNEAS SUBRAYADAS) ── */}
            <div className="grid grid-cols-12 gap-x-6 gap-y-2 mb-4 text-[11px]">
                {/* Fila 1: Propietario (Izq) + Celular (Der) */}
                <div className="col-span-7 flex items-end">
                    <span className="font-bold text-gray-800 shrink-0 mr-2 uppercase tracking-tight">
                        PROPIETARIO/S:
                    </span>
                    <span className="flex-1 font-bold border-b border-gray-600 pb-0.5 px-1 truncate uppercase">
                        {clientData.fullName || '—'}
                    </span>
                </div>
                <div className="col-span-5 flex items-end">
                    <span className="font-bold text-gray-800 shrink-0 mr-2 uppercase tracking-tight">
                        Nº CELULAR:
                    </span>
                    <span className="flex-1 font-bold border-b border-gray-600 pb-0.5 px-1 truncate">
                        {clientData.phone || '—'}
                    </span>
                </div>

                {/* Fila 2: Dirección (Izq) + Categoría de Proyecto si existe (Der) */}
                <div className={`${hasProjectCategory ? 'col-span-7' : 'col-span-12'} flex items-end`}>
                    <span className="font-bold text-gray-800 shrink-0 mr-2 uppercase tracking-tight">
                        DIRECCIÓN:
                    </span>
                    <span className="flex-1 font-bold border-b border-gray-600 pb-0.5 px-1 truncate uppercase">
                        {clientData.address || '—'}
                    </span>
                </div>
                {hasProjectCategory && (
                    <div className="col-span-5 flex items-end">
                        <span className="font-bold text-gray-800 shrink-0 mr-2 uppercase tracking-tight">
                            {projectCategoryHeaderLabel}:
                        </span>
                        <span className="flex-1 font-bold border-b border-gray-600 pb-0.5 px-1 truncate uppercase">
                            {designParameters.project_category_label || '—'}
                        </span>
                    </div>
                )}
            </div>

            {/* ── 3. PARÁMETROS DE DISEÑO (DINÁMICOS DESDE LA BD) ── */}
            {printParamGroups.length > 0 && (
                <div className="mb-4">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                        PARAMETROS DE DISEÑO
                    </div>
                    <table className="w-full max-w-2xl print:max-w-md border-collapse border border-gray-400 text-center text-[10.5px]">
                        <tbody>
                            {printParamGroups.map((group, idx) => {
                                const isLast = idx === printParamGroups.length - 1;
                                const label = designParameters[`${group.group}_label`];
                                const rawVal = designParameters[group.group];
                                const displayVal = label || rawVal || '—';

                                return (
                                    <tr
                                        key={group.group}
                                        className={!isLast ? 'border-b border-gray-300' : ''}
                                    >
                                        <td className="border-r border-gray-400 px-3 py-1 font-bold text-gray-800 bg-gray-50/50 w-2/3 uppercase text-center">
                                            {group.group_label}
                                        </td>
                                        <td className="px-3 py-1 font-bold text-black font-mono w-1/3">
                                            {displayVal}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── 4. SEPARADOR INSTITUCIONAL EN CURSIVA ── */}
            <div className="text-center text-[10px] italic text-gray-600 font-serif my-3 px-2 leading-relaxed">
                La empresa BIMETICA, ofrece sus servicios en:{' '}
                {activeServices.map((s) => s.name).join(' - ')}.
            </div>

            {/* ── 5. SECUENCIA RELACIONAL: SERVICIOS + TABLA DE PLANTAS ASOCIADA DEBAJO ── */}
            <div className="space-y-4 mb-4">
                {groupBlocks.map(({ group, services }) => (
                    <div key={group.id} className="break-inside-avoid space-y-2">
                        {/* A. Servicios asociados a esta tabla específica */}
                        {services.map((service) => (
                            <PrintServiceBlock
                                key={service.id}
                                service={service}
                                serviceVariables={serviceVariables}
                                designParameters={designParameters}
                                availableParameters={availableParameters}
                            />
                        ))}

                        {/* B. Tabla de plantas asociada justo debajo de sus servicios */}
                        <PrintFloorTable group={group} />
                    </div>
                ))}

                {/* C. Servicios activos independientes (no tienen tabla asignada) */}
                {unassignedServices.length > 0 && (
                    <div className="break-inside-avoid space-y-2 pt-1">
                        {unassignedServices.map((service) => (
                            <PrintServiceBlock
                                key={service.id}
                                service={service}
                                serviceVariables={serviceVariables}
                                designParameters={designParameters}
                                availableParameters={availableParameters}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── 5.1 MONTO TOTAL EN IMPRESIÓN (CON DESGLOSE DE AJUSTES CUANDO APLICA) ── */}
            {totalAmount > 0 && (
                <div className="flex justify-end mb-3 break-inside-avoid">
                    <div className="border border-black bg-gray-50/70 px-4 py-2 text-right rounded min-w-[220px]">
                        {(discountAmount > 0 || viaticoAmount > 0) && (
                            <div className="space-y-1 mb-1.5 pb-1.5 border-b border-gray-300 text-[10px]">
                                <div className="flex justify-between gap-4 text-gray-700">
                                    <span>Subtotal Servicios:</span>
                                    <span className="font-mono font-semibold">
                                        Bs.{' '}
                                        {servicesSubtotal.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between gap-4 text-rose-700 font-semibold">
                                        <span>Descuento ({discountLabel || `${discountPercent}%`}):</span>
                                        <span className="font-mono">
                                            - Bs.{' '}
                                            {discountAmount.toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                )}
                                {viaticoAmount > 0 && (
                                    <div className="flex justify-between gap-4 text-gray-800 font-semibold">
                                        <span>Viático ({viaticoLabel || 'Ciudad'}):</span>
                                        <span className="font-mono">
                                            + Bs.{' '}
                                            {viaticoAmount.toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800">
                                Monto Total:
                            </span>
                            <span className="font-mono font-black text-black text-xs">
                                Bs.{' '}
                                {totalAmount.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Slot opcional para Desglose de la Propuesta justo encima del Footer */}
            {beforeFooterSlot}

            {/* ── 6. PIE DE PÁGINA INSTITUCIONAL ── */}
            <div className="mt-4 pt-3 border-t border-gray-400 text-[10px] break-inside-avoid">
                <div className="grid grid-cols-12 gap-3 items-start mb-3">
                    {/* Términos y Modalidad de Pagos (5 cols) */}
                    <div className="col-span-5 space-y-0.5">
                        <p className="italic text-gray-600 font-serif">
                            Esta cotización tiene una validez de 7 días calendario.
                        </p>
                        <p className="font-bold text-[#003e65] text-[10.5px]">
                            Modalidad de Pagos:
                        </p>
                        <ol className="text-gray-700 space-y-0.5 pl-1 leading-snug">
                            <li>
                                <span className="font-bold text-black">1.</span> Al contado (Pago
                                anticipado 100%)
                            </li>
                            <li>
                                <span className="font-bold text-black">2.</span> De acuerdo a
                                Planilla de pagos (Inicio 50% de adelanto; 50% en Primera
                                presentación).
                            </li>
                        </ol>
                    </div>

                    {/* Cuentas Habilitadas (4 cols - Texto limpio sin tarjeta) */}
                    <div className="col-span-4 space-y-0.5">
                        <p className="font-bold text-[#003e65] text-[10.5px]">
                            Cuentas Habilitadas:
                        </p>
                        <div className="text-gray-700 space-y-0.5 leading-snug text-[9.5px]">
                            <p>
                                <span className="font-semibold text-black">Banco Unión (Bs.):</span>{' '}
                                <span className="font-mono">100000458921</span> (Cta. Cte.)
                            </p>
                            <p>
                                <span className="font-semibold text-black">Banco BCP (Bs.):</span>{' '}
                                <span className="font-mono">201-5098234-3-12</span> (Cta. Ahorros)
                            </p>
                            <p className="text-[9px]">
                                Titular: <span className="font-bold text-black">BIMETICA S.R.L.</span>
                            </p>
                        </div>
                    </div>

                    {/* QR Simple y Asesor Comercial (3 cols) */}
                    <div className="col-span-3 flex flex-col items-end gap-1.5 text-right">
                        <div className="flex items-center gap-1.5 border border-gray-300 rounded p-1 bg-white">
                            <BimeticaPaymentQr size={44} />
                            <div className="text-left text-[8.5px] leading-tight">
                                <span className="font-bold text-[#003e65] block">QR SIMPLE</span>
                                <span className="text-gray-600 block">Bimetica S.R.L.</span>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <p className="font-bold text-black text-[10px] uppercase">
                                Asesor Comercial
                            </p>
                            <p className="italic text-gray-700 text-[9.5px]">
                                {advisorName} - Cel: {advisorPhone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cintillo con Emojis y Contacto */}
                <div className="pt-2 border-t border-gray-300 flex items-center justify-between text-[10px] text-gray-700">
                    <span>{displayDate}</span>
                    <span>
                        📌 Av. 16 de Julio (el prado), Edicio San Pablo # 1479, piso 5, Of. 506 -
                        La Paz , 📱 +591-{advisorPhone}
                    </span>
                </div>
            </div>
        </div>
    );
}
