import type { ParameterItem } from '@/lib/quote-services';

export interface ClientData {
    fullName: string;
    phone: string;
    ci: string;
    address: string;
}

interface QuoteClientCardProps {
    clientData: ClientData;
    onChange: (field: keyof ClientData, value: string) => void;
    projectCategoryParameters?: ParameterItem[];
    selectedProjectCategoryId?: string;
    onProjectCategoryChange?: (id: string, value: string, label: string) => void;
    errors?: Record<string, string>;
}

export function QuoteClientCard({
    clientData,
    onChange,
    projectCategoryParameters = [],
    selectedProjectCategoryId = '',
    onProjectCategoryChange,
    errors,
}: QuoteClientCardProps) {
    const hasProjectCategory = projectCategoryParameters.length > 0;
    const groupLabel = projectCategoryParameters[0]?.group_label ?? '';
    const fullNameError = errors?.['client.full_name'];

    return (
        <section aria-label="Ficha del Cliente" className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* PROPIETARIO/S */}
            <div
                className={`rounded-lg p-2.5 transition-all ${
                    fullNameError
                        ? 'bg-red-50/50 dark:bg-red-950/20 border border-red-500 ring-1 ring-red-500/30'
                        : 'bg-muted/50 border border-border focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20'
                }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <label
                        className={`block text-[10px] font-bold uppercase tracking-wider ${
                            fullNameError ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                        }`}
                    >
                        PROPIETARIO/S: *
                    </label>
                    {fullNameError && (
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold truncate">
                            {fullNameError}
                        </span>
                    )}
                </div>
                <input
                    type="text"
                    value={clientData.fullName}
                    onChange={(e) => onChange('fullName', e.target.value)}
                    placeholder="Nombre del comitente o propietario"
                    className="mt-1 w-full bg-transparent font-bold text-foreground text-xs border-none p-0 focus:outline-hidden"
                />
            </div>

            {/* Nº CELULAR */}
            <div className="rounded-lg bg-muted/50 border border-border p-2.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Nº CELULAR:
                </label>
                <input
                    type="text"
                    value={clientData.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                    placeholder="Número de celular / WhatsApp"
                    className="mt-1 w-full bg-transparent font-bold text-foreground text-xs border-none p-0 focus:outline-hidden"
                />
            </div>

            {/* DIRECCIÓN */}
            <div
                className={`rounded-lg bg-muted/50 border border-border p-2.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20 transition-all ${
                    !hasProjectCategory ? 'sm:col-span-2' : ''
                }`}
            >
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    DIRECCIÓN:
                </label>
                <input
                    type="text"
                    value={clientData.address}
                    onChange={(e) => onChange('address', e.target.value)}
                    placeholder="Ubicación o dirección de obra"
                    className="mt-1 w-full bg-transparent font-bold text-foreground text-xs border-none p-0 focus:outline-hidden"
                />
            </div>

            {/* CATEGORÍA DEL PROYECTO (DINÁMICO DESDE LA BD) */}
            {hasProjectCategory && (
                <div className="rounded-lg bg-muted/50 border border-border p-2.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <label
                        htmlFor="project-category-select"
                        className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                        {groupLabel ? `${groupLabel.toUpperCase()}:` : ''}
                    </label>
                    <select
                        id="project-category-select"
                        value={selectedProjectCategoryId}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedItem = projectCategoryParameters.find(
                                (item) => String(item.id) === selectedId
                            );
                            if (selectedItem) {
                                onProjectCategoryChange?.(
                                    String(selectedItem.id),
                                    String(selectedItem.value),
                                    selectedItem.name
                                );
                            } else {
                                onProjectCategoryChange?.('', '', '');
                            }
                        }}
                        className="mt-1 w-full bg-transparent font-bold text-foreground text-xs border-none p-0 focus:outline-hidden cursor-pointer"
                    >
                        <option value="" className="bg-card text-muted-foreground">
                            Seleccionar...
                        </option>
                        {projectCategoryParameters.map((item) => (
                            <option
                                key={item.id}
                                value={String(item.id)}
                                className="bg-card text-foreground"
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </section>
    );
}
