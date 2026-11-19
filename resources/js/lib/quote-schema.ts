import { z } from 'zod';

/**
 * Esquema Zod de Validación en Cliente para Cotizaciones
 * Proporciona validación instantánea en el frontend sin depender de la latencia del servidor.
 */

export const quoteClientSchema = z.object({
    full_name: z
        .string()
        .trim()
        .min(1, 'El nombre del cliente es obligatorio.'),
    phone: z.string().trim().nullable().optional(),
    address: z.string().trim().nullable().optional(),
    ci: z.string().trim().nullable().optional(),
});

export const quoteFloorItemSchema = z.object({
    name: z.string().trim().min(1, 'Cada nivel debe tener un nombre asignado.'),
    area: z.number().min(0, 'El área no puede ser negativa.'),
    description: z.string().nullable().optional(),
});

export const quoteFloorGroupSchema = z.object({
    id: z.union([z.string(), z.number()]),
    table_name: z
        .string()
        .trim()
        .min(1, 'El nombre de la tabla de plantas es obligatorio.'),
    total_area: z.number().min(0).optional(),
    floors: z.array(quoteFloorItemSchema).optional(),
});

export const quoteServiceSchema = z.object({
    service_id: z.number(),
    quote_floor_group_id: z.union([z.string(), z.number()]).nullable().optional(),
    subtotal: z.number().min(0, 'El subtotal del servicio no puede ser negativo.'),
    filled_variables: z.record(z.string(), z.any()).optional(),
});

export const quoteSchema = z.object({
    client: quoteClientSchema,
    total_amount: z.number().min(0, 'El monto total acordado no puede ser negativo.'),
    filled_parameters: z.record(z.string(), z.any()).optional(),
    filled_settings: z.record(z.string(), z.any()).optional(),
    floor_groups: z
        .array(quoteFloorGroupSchema)
        .min(1, 'Debe incluir al menos una tabla de plantas en la cotización.'),
    services: z
        .array(quoteServiceSchema)
        .min(1, 'Debe seleccionar al menos un servicio para la cotización.'),
    status: z.enum(['draft', 'formalized', 'signed', 'cancelled']).optional(),
});

export type QuotePayload = z.infer<typeof quoteSchema>;

export interface QuoteValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    data?: QuotePayload;
}

/**
 * Validador Zod: transforma los fallos en un diccionario clave-valor amigable
 * Ejemplo: { 'client.full_name': 'El nombre del cliente es obligatorio.' }
 */
export function validateQuoteWithZod(payload: unknown): QuoteValidationResult {
    const result = quoteSchema.safeParse(payload);

    if (result.success) {
        return {
            isValid: true,
            errors: {},
            data: result.data,
        };
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    }

    return {
        isValid: false,
        errors,
    };
}
