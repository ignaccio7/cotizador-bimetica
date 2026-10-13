# Contexto del Negocio — Cotizador Bimetica

## 1. Propósito del Sistema
Herramienta interna para empresa de arquitectura para cotizar servicios (Planos 2D, Diseño Arquitectónico, Fachadas, Estudio de Suelos, Trámites, etc.), formalizar la generacion de un Formulario Inicial, generar Designaciones técnicas y generar Contratos imprimibles.

## 2. Roles
- **Admin**: Configura servicios, fórmulas, variables, parámetros y plantillas de contrato.
- **Vendedor**: Busca/crea clientes, elabora cotizaciones, completa el Formulario Inicial, genera la Designación y finalmente el Contrato.
- *Clientes*: No tienen cuenta ni acceso al sistema; solo firman documentos físicos.

## 3. Flujo End-to-End
1. **Cliente**: Registro con código autogenerado anual `NNN/AAAA` (ej. `001/2026`).
2. **Cotización (`quotes`)**: En estado `Draft`.
3. **Grupos de Pisos (`quote_floor_groups` + `quote_floors`)**: Tablas de m2 reutilizables. Un grupo puede asignarse a múltiples servicios, o un servicio puede tener su propia tabla de pisos.
4. **Servicios Cotizados (`quote_services`)**:
   - Asocia opcionalmente un `quote_floor_group_id` (o `null` si no usa m2 como Suelos o Trámites).
   - Guarda respuestas dinámicas en `filled_variables` (jsonb, ej: `{"pozos": 4}`).
   - Calcula su subtotal evaluando la fórmula del servicio.
5. **Monto Total**: Suma de subtotales de servicios + parámetros (ej. viáticos por ciudad).
6. **Formulario Inicial (`initial_forms`)**: Dirección de obra, modalidad de pago, monto acordado y datos extra en `extra_data` (jsonb).
7. **Designación (`designations`)**: Instrucciones técnicas y fecha. El responsable es el mismo vendedor.
8. **Contrato (`contracts`)**: Fusión de plantilla HTML (`contract_templates`) con datos de la cotización.

## 4. Diccionario de Tablas (15 Tablas en Inglés)
- `users`: Administradores y vendedores.
- `clients`: Clientes (`code`, `full_name`, `ci`, `phone`, `address`, `occupation`).
- `parameters`: Configuración global clave-valor (ej. viáticos por ciudad).
- `services`: Catálogo de servicios.
- `variables`: Variables de cálculo (`static` o `dynamic`).
- `formulas`: Expresión matemática por servicio evaluable con Math.js.
- `formula_variables`: Pivote N:M entre fórmulas y variables.
- `quotes`: Cabecera de cotización (`client_id`, `seller_id`, `status`, `filled_parameters`, `total_amount`).
- `quote_floor_groups`: Grupos de tablas de superficies m2.
- `quote_floors`: Pisos individuales dentro de un grupo (`name`, `area`, `description`).
- `quote_services`: Pivote entre cotización y servicio (`filled_variables`, `subtotal`).
- `initial_forms`: Formalización de la cotización.
- `designations`: Datos técnicos para ejecución.
- `contract_templates`: Plantillas HTML con placeholders.
- `contracts`: Contrato emitido y listo para impresión.