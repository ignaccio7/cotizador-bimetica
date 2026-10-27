export interface ClientData {
    fullName: string;
    phone: string;
    ci: string;
    address: string;
    occupation?: string;
}

interface QuoteClientCardProps {
    clientData: ClientData;
    onChange: (field: keyof ClientData, value: string) => void;
}

export function QuoteClientCard({ clientData, onChange }: QuoteClientCardProps) {
    return (
        <section aria-label="Ficha del Cliente" className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* PROPIETARIO/S */}
            <div className="rounded-lg bg-muted/50 border border-border p-2.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    PROPIETARIO/S:
                </label>
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
            <div className="rounded-lg bg-muted/50 border border-border p-2.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20 transition-all">
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

            {/* OCUPACIÓN */}
            <div className="rounded-lg bg-muted/50 border border-border p-2.5 focus-within:border-primary focus-within:bg-card focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    OCUPACIÓN:
                </label>
                <input
                    type="text"
                    value={clientData.occupation || clientData.ci || ''}
                    onChange={(e) => onChange('occupation', e.target.value)}
                    placeholder="Ocupación / Profesión o C.I."
                    className="mt-1 w-full bg-transparent font-bold text-foreground text-xs border-none p-0 focus:outline-hidden"
                />
            </div>
        </section>
    );
}

