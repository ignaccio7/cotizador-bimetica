import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import quotesRoute from '@/routes/quotes';
import { validateQuoteWithZod, type QuotePayload } from '@/lib/quote-schema';

interface QuoteSaveButtonProps {
    buildPayload: () => QuotePayload;
    errors: Record<string, string>;
    setErrors: (errors: Record<string, string>) => void;
    hasAttemptedSubmit: boolean;
    setHasAttemptedSubmit: (val: boolean) => void;
    onSuccess?: () => void;
}

export function QuoteSaveButton({
    buildPayload,
    errors,
    setErrors,
    hasAttemptedSubmit,
    setHasAttemptedSubmit,
    onSuccess,
}: QuoteSaveButtonProps) {
    const [processing, setProcessing] = useState(false);

    const handleSave = () => {
        // 1. Activar el estado de intento de envío para que el feedback reactivo se active
        setHasAttemptedSubmit(true);

        // 2. Construir el payload con los datos actuales del cotizador
        const payload = buildPayload();

        // 3. Validación instantánea en cliente con Zod
        const validation = validateQuoteWithZod(payload);

        if (!validation.isValid) {
            // Detener el envío: no hace petición de red innecesaria
            setErrors(validation.errors);
            return;
        }

        // 4. Si Zod valida con éxito, limpiar errores previos y enviar al backend
        setErrors({});
        setProcessing(true);

        // Envío programático tipado con Wayfinder (como Ziggy pero 100% type-safe)
        router.post(quotesRoute.store.url(), payload, {
            onFinish: () => setProcessing(false),
            onError: (backendErrors) => {
                // Si el FormRequest de Laravel detecta algo adicional
                setErrors(backendErrors);
            },
            onSuccess: () => {
                setHasAttemptedSubmit(false);
                setErrors({});
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={handleSave}
                disabled={processing}
                className="w-full bg-primary hover:bg-[#002b47] text-white font-bold h-10 text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                title="Guardar cotización como borrador oficial en la base de datos"
            >
                {processing ? (
                    <>
                        <Loader2 className="size-4 animate-spin text-secondary" />
                        <span>Guardando Cotización...</span>
                    </>
                ) : (
                    <>
                        <Save className="size-4 text-secondary" />
                        <span>Guardar Cotización (Borrador)</span>
                    </>
                )}
            </button>

            {/* Resumen de errores detectados por Zod o Laravel al intentar guardar */}
            {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
                <div className="p-2.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="size-3.5 text-red-600 dark:text-red-400 shrink-0" />
                        <span>Por favor revise los siguientes datos:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5">
                        {Object.entries(errors).map(([key, msg]) => (
                            <li key={key}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
