import { MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import type { ClientData } from '@/components/quotes/quote-client-card';
import {
    calculateQuoteBreakdown,
    type ServiceBreakdownItem,
} from '@/components/quotes/quote-financial-panel';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ServiceItem } from '@/lib/quote-services';

export interface QuoteShareWhatsappButtonProps {
    quoteCode: string;
    clientData: ClientData;
    activeServices: ServiceItem[];
    serviceVariables: Record<number, Record<string, string>>;
    designParameters?: Record<string, string>;
    advisorName?: string;
    advisorPhone?: string;
    className?: string;
}

/**
 * Componente modularizado que encapsula el botón y la acción de compartir
 * la propuesta técnico-económica vía WhatsApp directamente al número
 * ingresado en el campo "Nº CELULAR:" de la ficha del cliente.
 */
export function QuoteShareWhatsappButton({
    quoteCode,
    clientData,
    activeServices,
    serviceVariables,
    designParameters = {},
    advisorName = 'Ing. Mariela Vasquez',
    advisorPhone = '71212168',
    className = '',
}: QuoteShareWhatsappButtonProps) {
    const [showMissingPhoneDialog, setShowMissingPhoneDialog] = useState(false);

    const handleShareWhatsApp = () => {
        // 1. Obtener y limpiar el teléfono ingresado por el usuario
        const rawPhone = clientData.phone?.trim() || '';
        const cleanDigits = rawPhone.replace(/\D/g, '');

        // Validación: si no hay dígitos, abrimos el modal estilizado en vez de un alert
        if (!cleanDigits) {
            setShowMissingPhoneDialog(true);
            return;
        }

        // 2. Normalización para números de Bolivia (8 dígitos reciben prefijo país 591)
        let targetPhone = cleanDigits;
        if (cleanDigits.length === 8) {
            targetPhone = `591${cleanDigits}`;
        }

        // 3. Obtener el cálculo unificado de servicios y desglose de ajustes
        const {
            serviceBreakdown,
            servicesSubtotal,
            discountAmount,
            discountLabel,
            discountPercent,
            viaticoAmount,
            viaticoLabel,
            totalAmount,
        } = calculateQuoteBreakdown(
            activeServices,
            serviceVariables,
            designParameters
        );

        const clientName = clientData.fullName?.trim() || 'Estimado/a Cliente';
        const address = clientData.address?.trim();
        const projectCategory = designParameters['project_category_label'] || '';

        // 4. Formatear la lista de servicios activos y sus subtotales
        const servicesList =
            serviceBreakdown.length > 0
                ? serviceBreakdown
                      .map(
                          (item: ServiceBreakdownItem) =>
                              `• *${item.service.name}*: Bs. ${item.subtotal.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })}`
                      )
                      .join('\n')
                : '• Sin servicios seleccionados';

        // 4.1 Formatear líneas de desglose económico (descuentos y viáticos si aplican)
        const breakdownLines: string[] = [];
        if (discountAmount > 0 || viaticoAmount > 0) {
            breakdownLines.push(
                `• *Subtotal Servicios:* Bs. ${servicesSubtotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`
            );
            if (discountAmount > 0) {
                breakdownLines.push(
                    `• *Descuento (${discountLabel || `${discountPercent}%`}):* -Bs. ${discountAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                );
            }
            if (viaticoAmount > 0) {
                breakdownLines.push(
                    `• *Viático (${viaticoLabel || 'Ciudad'}):* +Bs. ${viaticoAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`
                );
            }
        }

        const formattedTotal = totalAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // 5. Ensamblar el mensaje comercial preformateado con separadores limpios
        const separator = '----------------------------------------';

        const lines = [
            '*PROPUESTA TÉCNICO-ECONÓMICA — BIMETICA*',
            '_Diseño y Construcción_',
            separator,
            `*Cotización:* ${quoteCode}`,
            `*Cliente:* ${clientName}`,
            address ? `*Ubicación:* ${address}` : null,
            projectCategory ? `*Tipo de Proyecto:* ${projectCategory}` : null,
            separator,
            '*SERVICIOS COTIZADOS:*',
            servicesList,
            ...(breakdownLines.length > 0
                ? [separator, '*DESGLOSE ECONÓMICO:*', ...breakdownLines]
                : []),
            separator,
            `*MONTO TOTAL: Bs. ${formattedTotal}*`,
            separator,
            '*CONDICIONES COMERCIALES:*',
            '• *Modalidad:* 50% de anticipo al inicio / 50% en primera presentación',
            '• *Validez:* 7 días calendario',
            '• *Cuentas Habilitadas:* Banco Unión y BCP (Dispone de Pago QR Simple)',
            separator,
            `*Asesor Comercial:* ${advisorName} (+591 ${advisorPhone})`,
            '*Correo:* contacto@bimetica.bo',
            '*Redes:* @bimetica.bo | La Paz, Bolivia',
        ].filter((line): line is string => line !== null);

        const message = lines.join('\n');

        // 6. Abrir WhatsApp directamente con el número destinatario y mensaje codificado
        const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <button
                type="button"
                onClick={handleShareWhatsApp}
                className={`w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-9.5 text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${className}`}
                title="Compartir cotización por WhatsApp al celular del cliente"
            >
                <MessageCircle className="size-4 text-white" />
                <span>Compartir por WhatsApp</span>
            </button>

            {/* Modal de Advertencia cuando no se ingresó el teléfono */}
            <Dialog
                open={showMissingPhoneDialog}
                onOpenChange={setShowMissingPhoneDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Phone className="size-4 text-primary" />
                            </div>
                            <DialogTitle className="text-sm font-bold text-foreground">
                                Número de Celular Requerido
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                            Para compartir la propuesta técnico-económica directamente por WhatsApp, ingresa el número de celular del cliente en el campo <span className="font-semibold text-foreground">"Nº CELULAR:"</span> de la ficha superior.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            onClick={() => setShowMissingPhoneDialog(false)}
                            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs h-8.5 px-4 cursor-pointer"
                        >
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
