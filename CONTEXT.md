# Reglas Globales del Proyecto
Siempre que generes código, lee y respeta la arquitectura definida a continuación:

# Contexto del Proyecto — Cotizador para Empresa de Arquitectura

## 1. Qué es el sistema

Sistema interno para una empresa de arquitectura que ofrece servicios como Planos 2D, Diseño
Arquitectónico, Diseño de Interiores, Diseño de Fachada, Estudio de Suelos, Cálculo Estructural,
Planos Eléctricos, Planos Hidrosanitarios, Cómputo y Presupuesto de Obra, y Trámites.

El sistema permite cotizar uno o varios de estos servicios para un cliente, formalizar esa
cotización en un "Formulario Inicial" (una especie de pseudo-contrato firmado por el vendedor y
el cliente), generar un Contrato final a partir de una plantilla configurada por el admin, y
registrar una Designación que deja constancia de los datos técnicos para ejecutar el trabajo.

**Stack:** Laravel (API/backend) + React (frontend). Base de datos PostgreSQL ya diseñada
(ver sección 5).

## 2. Roles del sistema

Solo existen **dos roles con acceso al sistema**:

- **Admin**: configura todo el catálogo — servicios, parámetros, variables, fórmulas, grupos de
  pisos reutilizables, descuentos permitidos, plantillas de contrato.
- **Vendedor** (= "Ejecutivo Comercial"): hace las cotizaciones, llena el Formulario Inicial,
  gestiona la Designación y genera el Contrato. Es la misma persona de principio a fin: **no hay
  un rol "Proyectista" ni "Coordinador" que use el sistema.** La tabla `users.rol` conserva la
  opción `proyectista` en el CHECK por si se usa a futuro, pero hoy no se crean usuarios con ese
  rol.

**Los clientes no tienen acceso al sistema.** Solo quedan registrados como datos (tabla
`clients`) y firman documentos impresos (Formulario Inicial, Contrato).

## 3. Flujo de negocio (end to end)

1. El vendedor busca o crea un **cliente** (se le asigna un `codigo` autogenerado tipo
   `NNN/AAAA`, correlativo por año).
2. Crea una **cotización** (`quotes`, estado inicial "Borrador").
3. Arma uno o más **grupos de pisos** (`quote_floor_groups`) con sus filas (`quote_floors`:
   nombre de planta, descripción, m2). Estos grupos son reutilizables: un mismo grupo puede
   asociarse a varios servicios de la cotización si comparten los mismos m2, o un servicio
   puede tener su propio grupo si necesita una tabla distinta (ej. Planos 2D pide Subsuelo
   1/2 que Obra Fina no pide).
4. Agrega uno o más **servicios a la cotización** (`quote_services`), cada uno:
   - opcionalmente referencia un `quote_floor_group_id` (puede ser `NULL`, ej. para Trámites
     que no usan m2),
   - guarda en `variables_llenadas` (jsonb) los valores dinámicos que el vendedor ingresó
     (ej. `{"m2": 300}`, `{"pozos": 4}`),
   - calcula su propio `subtotal` evaluando la fórmula del servicio.
5. El `monto_total` de la cotización es la suma de los `subtotal` de todos sus `quote_services`.
6. Cuando la cotización está calculada, el vendedor completa el **Formulario Inicial**
   (`initial_forms`): dirección del proyecto, modalidad de pago, descuento aplicado, monto
   acordado, y cualquier otro dato variable en `datos_extra` (jsonb) — ej. publicidad, tipo de
   atención.
7. A partir del Formulario Inicial se genera el **Contrato** (`contracts`), tomando una
   `contract_templates` configurada por el admin y combinándola con los datos del cliente y
   servicios (`contenido_final_html`).
8. También desde el Formulario Inicial se registra la **Designación** (`designations`):
   instrucciones técnicas y fecha — hecha por el mismo vendedor, sin un segundo responsable.

## 4. Reglas de negocio clave

- **Código de cliente**: autogenerado, formato `NNN/AAAA` (correlativo del año actual).
- **Multi-servicio**: una cotización puede tener varios servicios; cada uno se calcula por
  separado y se suman al final.
- **Grupos de pisos reutilizables**: no es "una tabla global" ni "una tabla por servicio" de
  forma rígida — es un catálogo de grupos por cotización que cualquier servicio puede referenciar
  o no. Esto cubre tanto el caso "mismo m2 para varios servicios" como "este servicio necesita su
  propia tabla distinta".
- **Variables y fórmulas**: el admin define `variables` (estáticas con `valor_defecto`, o
  dinámicas que llena el vendedor) y las asocia a una `formula` por servicio mediante
  `formula_variables`. **Toda la lógica de rangos/condicionales (incluyendo el caso de monto
  fijo tipo "AF") vive directamente dentro del texto de `formulas.expresion`** — no hay una
  tabla de rangos separada; el admin escribe la condición completa (ej. algo equivalente a
  `m2 < 30 ? 1600 : m2 * 56`) usando las variables disponibles.
- **Descuentos**: por ahora **no se va a implementar** esta función. No hay tabla de descuentos
  ni se prevé el campo en el Formulario Inicial todavía.
- **Viáticos por ciudad**: se definen como valores predefinidos dentro de `parameters` (una fila
  por ciudad); el vendedor solo selecciona la ciudad que corresponde, no escribe el monto.
- **Redondeo**: los montos de inversión se redondean hacia arriba por defecto, pero debe ser
  configurable por fórmula.
- **Contrato**: plantilla global única (`contract_templates`) con placeholders que se rellenan
  con datos del cliente y de los servicios contratados; el vendedor no edita las cláusulas, solo
  los datos específicos del cliente.
- **"Coordinador" en la Designación**: no existe una lista de coordinadores. El valor de
  coordinador en el formulario de designación es siempre el mismo vendedor que hizo la
  cotización — por eso `designations` no tiene `coordinador_id`.

## 5. Diccionario de tablas (según el esquema actual)

| Tabla | Propósito |
|---|---|
| `users` | Admin y Vendedor (login real). El valor `proyectista` en el CHECK no se usa hoy. |
| `clients` | Clientes: código autogenerado, nombre, CI, celular, dirección. Sin acceso al sistema. |
| `parameters` | Parámetros globales clave-valor (ej. `tipo_cambio`). |
| `services` | Catálogo de servicios ofrecidos (nombre, descripción). |
| `variables` | Variables definidas por el admin, estáticas o dinámicas, usadas en fórmulas. |
| `formulas` | Una fórmula por servicio, como expresión evaluable (Math.js). |
| `formula_variables` | Pivote N a M entre `formulas` y `variables`. |
| `quotes` | Cotización: cliente, vendedor, estado, parámetros globales elegidos, monto total. |
| `quote_floor_groups` | Grupos de tablas de pisos reutilizables dentro de una cotización. |
| `quote_floors` | Filas de cada grupo (planta, descripción, m2). |
| `quote_services` | Servicios incluidos en una cotización, con sus variables llenadas y subtotal. |
| `initial_forms` | Formulario Inicial: dirección, modalidad de pago, descuento, monto acordado, datos extra. |
| `designations` | Designación: instrucciones técnicas y fecha, a cargo del mismo vendedor. |
| `contract_templates` | Plantillas de contrato configuradas por el admin (HTML). |
| `contracts` | Contrato final generado a partir de una plantilla + un Formulario Inicial. |
