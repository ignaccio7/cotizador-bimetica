# Contexto del Negocio — Cotizador Bimetica

## 1. Propósito del Sistema
Herramienta interna para empresa de arquitectura para cotizar servicios (Planos 2D, Diseño Arquitectónico, Fachadas, Estudio de Suelos, Estructuras, Instalaciones, Cómputos, Trámites, etc.), formalizar la venta mediante un Formulario Inicial, generar la Hoja de Designación técnica y emitir Contratos imprimibles.

## 2. Roles del Sistema
Solo existen **dos roles** con acceso:
- **Admin**: Configuración de servicios, fórmulas, variables, parámetros (viáticos por ciudad) y plantillas de contrato.
- **Vendedor ("Ejecutivo Comercial")**: Gestiona clientes, elabora cotizaciones, completa el Formulario Inicial, genera la Designación técnica y el Contrato.
- **Aclaración de Roles**: No existen roles de "Proyectista" ni "Coordinador" dentro del sistema. En la Designación, el coordinador técnico es siempre el mismo vendedor. Los clientes no tienen cuenta ni acceso al sistema; solo firman documentos impresos.

## 3. Flujo del Negocio
El flujo consta de una fase secuencial comercial seguida de una fase de generación documental no secuencial:

### Fase 1: Cotización y Formalización (Secuencial)
1. **Cliente**: Registro o búsqueda con código autogenerado correlativo anual `NNN/AAAA` (ej. `001/2026`).
2. **Cotización (`quotes`)**: Creación en estado inicial `Draft` (Borrador) asociada al cliente y vendedor.
3. **Grupos de Pisos (`quote_floor_groups` + `quote_floors`)**: Tablas de m2 reutilizables. Un grupo puede compartirse entre varios servicios o asignarse de forma exclusiva a uno.
4. **Servicios Cotizados (`quote_services`)**:
   - Selección de servicios del catálogo.
   - Asignación opcional de grupo de pisos (`quote_floor_group_id` puede ser `null` en servicios que no usan superficie, como Suelos o Trámites).
   - Llenado de variables dinámicas en `filled_variables` (jsonb, ej: `{"pozos": 4}`).
   - Cálculo automático del subtotal evaluando la fórmula del servicio con Math.js.
5. **Totalización**: Suma de subtotales de servicios + parámetros adicionales seleccionados (ej. viáticos fijos por ciudad elegidos desde `parameters`).
6. **Formulario Inicial (`initial_forms`)**: Formalización comercial (pseudo-contrato) con dirección de obra, modalidad de pago, monto acordado y datos complementarios en `extra_data` (jsonb).

### Fase 2: Documentación Post-Formulario (Independiente / No Secuencial)
Una vez registrado el **Formulario Inicial**, se habilitan dos acciones independientes. El vendedor puede generar **cualquiera de las dos en orden indistinto** (ninguna bloquea a la otra):
- **Hoja de Designación (`designations`)**: Registro de instrucciones técnicas y fecha de inicio de obra/proyecto. El responsable técnico/coordinador es el mismo vendedor.
- **Contrato (`contracts`)**: Generación del documento final fusionando la plantilla activa (`contract_templates`) con los placeholders de datos del cliente y de la cotización.

---

## 4. Reglas de Negocio Clave
- **Código de Cliente**: Autogenerado, formato `NNN/AAAA` (correlativo único por año).
- **Fórmulas y Expresiones**: Evaluadas con Math.js. Los condicionales y mínimos de arancel viven directamente en el texto de `formulas.expression` mediante operadores ternarios (ej: `m2 < 30 ? 1600 : m2 * 56`). No existen tablas de rangos separadas.
- **Variables**:
  - `static`: Tienen un `default_value` numérico fijo (ej. aranceles o tarifas estándar por m2).
  - `dynamic`: No tienen valor por defecto fijo; su valor lo introduce el vendedor en la cotización (ej. número de pozos) o proviene de la sumatoria de m2 del grupo de pisos asociado (`m2`).
- **Viáticos por Ciudad**: Fila por ciudad configurada en `parameters`. El vendedor selecciona la ciudad en un selector; no introduce montos manuales.
- **Redondeo**: Los montos de inversión se redondean hacia arriba por defecto (`Math.ceil` o redondeo superior).
- **Descuentos**: No implementados en esta etapa.
- **Contrato**: Plantilla HTML única con placeholders (`{{cliente_nombre}}`, `{{total}}`, etc.) configurada por el admin.

---

## 5. Diccionario de Tablas (15 Tablas en Inglés)
| Tabla | Propósito |
|---|---|
| `users` | Usuarios del sistema (`admin` y `vendedor`). |
| `clients` | Clientes (`code`, `full_name`, `ci`, `phone`, `address`, etc.). |
| `parameters` | Configuración global clave-valor (ej. viáticos por ciudad, tipo de cambio). |
| `services` | Catálogo de servicios de arquitectura (`name`, `description`). |
| `variables` | Variables estáticas (`default_value`) o dinámicas (ingresadas por el vendedor o m2 de pisos). |
| `formulas` | Expresión matemática por servicio evaluable con Math.js (`service_id`, `name`, `expression`, `is_visible`). |
| `formula_variables` | Pivote N:M entre fórmulas y variables (`formula_id`, `variable_id`). |
| `quotes` | Cabecera de cotización (`client_id`, `user_id`, `status`, `filled_parameters`, `total_amount`). |
| `quote_floor_groups` | Grupos de tablas de superficies m2 reutilizables. |
| `quote_floors` | Pisos individuales dentro de un grupo (`floor_name`, `area`, `description`). |
| `quote_services` | Servicios en la cotización con `filled_variables` y `subtotal`. |
| `initial_forms` | Formalización técnica y comercial previa a contratos/designación. |
| `designations` | Instrucciones técnicas a cargo del mismo vendedor. |
| `contract_templates` | Plantillas de contrato con placeholders configuradas por el admin. |
| `contracts` | Contrato emitido y listo para impresión/firma. |

---

## 6. Estado del Proyecto y Hoja de Ruta
- ✅ **Módulo 1: Catálogo de Servicios y Alcance**:
  - Migración y Modelo `Service` con `$fillable`.
  - Seeder con 6 servicios reales de Bimetica y entregables numerados.
  - FormRequests (`StoreServiceRequest`, `UpdateServiceRequest`) en inglés con mensajes y atributos en español.
  - `ServiceController` CRUD completo (`index`, `store`, `update`, `destroy`) con mensajes flash compartidos en Inertia.
  - UI interactiva React 19 + Wayfinder: vista maestro-detalle, componentes modulares en `resources/js/components/services/` (`ServicesList`, `ServiceForm`, `DeleteServiceDialog`), soporte móvil con scroll acotado y auto-scroll, selección automática al crear servicio.
- ⏳ **Módulo 2: Fórmulas y Variables (Math.js)** (Siguiente sesión):
  - Modelos `Formula` y `Variable` con `$fillable` y relación `belongsToMany` vía `formula_variables`.
  - Instalación y helper de Math.js para evaluación en cliente.
  - CRUD de fórmulas asociadas a cada servicio con editor de expresión y sandbox de prueba interactivo.
  - Consulta detallada en [PLAN_FORMULAS.md](PLAN_FORMULAS.md).