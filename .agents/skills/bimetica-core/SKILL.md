---
name: bimetica-core
description: Reglas de negocio del Cotizador Bimetica, flujo de cotización, cálculo de pisos y fórmulas con Math.js, viáticos e identidad corporativa.
---

# Bimetica Core Domain Skill

## 1. Roles del Sistema
- **Admin**: Catálogo de servicios, fórmulas, variables, parámetros (viáticos por ciudad) y plantillas de contrato.
- **Vendedor**: Registro de clientes, cotizaciones, formulario inicial, designación técnica y contrato.
- **Regla Estricta**: No existen roles de Proyectista ni Coordinador. El vendedor es el mismo coordinador en la Designación. Los clientes no acceden al software.

## 2. Flujo del Negocio
1. **Cliente**: Código correlativo anual `NNN/AAAA` (ej. `001/2026`).
2. **Cotización (`quotes`)**: Creación en "Borrador".
3. **Grupos de Pisos (`quote_floor_groups` + `quote_floors`)**: Tablas de m2 reutilizables. Un grupo puede compartirse entre servicios o ser específico de uno.
4. **Servicios (`quote_services`)**: Cálculo del subtotal evaluando la fórmula del servicio en Math.js con variables dinámicas (`filled_variables`).
5. **Totalización**: Subtotales + parámetros (viáticos seleccionados por ciudad).
6. **Formulario Inicial (`initial_forms`)**: Formalización como pseudo-contrato (dirección, modalidad de pago, monto acordado).
7. **Documentación Post-Formulario (Independiente / No Secuencial)**:
   - **Hoja de Designación (`designations`)**: Instrucciones técnicas y fecha a cargo del mismo vendedor.
   - **Contrato (`contracts`)**: Generación con plantilla HTML (`contract_templates`) y placeholders.
   - *Ambos documentos derivan del Formulario Inicial y pueden elaborarse en orden indistinto.*

## 3. Motor de Cálculo y Fórmulas
- Las fórmulas se almacenan en la tabla `formulas`:
  - `service_id`: Servicio arquitectónico al que pertenece.
  - `name`: Nombre descriptivo (ej. "Cálculo Planos 2D").
  - `expression`: Cadena de texto evaluable directamente con Math.js.
  - `is_visible`: Booleano para indicar si la fórmula se muestra al cliente o solo el subtotal calculado.
- **Sintaxis de Expresiones Math.js**:
  - Operador ternario para mínimos de arancel: `m2 < 30 ? 1600 : m2 * 56`
  - Variables dinámicas de servicio: `pozos * 450`
  - Multiplicación de variables: `m2 * arancel`
  - Condiciones anidadas: `m2 < 50 ? 2500 : (m2 <= 150 ? m2 * 45 : m2 * 40)`
- **Variables (`variables`) y Pivote (`formula_variables`)**:
  - `static`: Tienen un valor por defecto fijo (`default_value`), por ejemplo aranceles vigentes.
  - `dynamic`: No tienen valor por defecto; son provistas por el vendedor al cotizar (ej. `pozos`) o calculadas automáticamente sumando las superficies del grupo de pisos asociado (`m2`).
  - Cada fórmula declara mediante la tabla pivote `formula_variables` qué variables intervienen en su expresión.
- **Redondeo**: Los montos de inversión calculados se redondean hacia arriba por defecto (`Math.ceil`).

## 4. Metodología de Desarrollo Incremental (Regla de Oro)
Para cualquier módulo nuevo o expansión compleja (ej. Fórmulas, Pisos, Cotizaciones), seguir siempre este orden estricto:
1. **Modelos & Migraciones**: Modelos Eloquent con `$fillable` explícito y relaciones (`hasMany`, `belongsTo`, `belongsToMany`).
2. **Rutas & Wayfinder**: Registro en `routes/web.php` y ejecución de `php artisan wayfinder:generate --with-form`.
3. **Lógica de Operación & Motor**: Funciones de cálculo puro (ej. `Math.js` evaluate) con validación previa de datos.
4. **Controllers & FormRequests**: Validación rigurosa en FormRequests (`authorize`, `rules`, `attributes`) y controladores limpios.
5. **Vista & Componentes Base**: UI interactiva conectada a Wayfinder sin URLs harcodeadas.
6. **Refactorización y Desacople**: Modularizar en componentes dedicados en `components/<modulo>/` sin sobre-diseño.

## 5. Viáticos y Parámetros
- Almacenados en la tabla `parameters` (una fila por ciudad).
- El vendedor selecciona la ciudad mediante un menú desplegable; el sistema inyecta el valor en `quotes.filled_parameters`.

## 6. Identidad Visual Bimetica
- **Primary**: `#003e65` (Azul corporativo principal).
- **Secondary**: `#fbad03` (Amarillo / dorado arquitectónico).
- **Tertiary**: `#2684a8` (Azul medio / técnico).
- **Sidebar**: Fondo Navy `#071526`, compás arquitectónico (`DraftingCompass`), título "BIMETICA", subtítulo "DISEÑO Y CONSTRUCCIÓN", y módulo destacado `COMERCIAL & VENTAS` en dorado.