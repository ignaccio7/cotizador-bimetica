---
name: bimetica-core
description: Reglas de negocio del Cotizador Bimetica, flujo de cotización, cálculo de pisos y fórmulas con Math.js, viáticos e identidad corporativa.
---

# Bimetica Core Knowledge Item

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
- Las fórmulas se almacenan en `formulas.expression` como texto evaluable con Math.js.
- **Sintaxis con condicionales ternarios**:
  - Mínimos de arancel: `m2 < 30 ? 1600 : m2 * 56`
  - Variables dinámicas: `pozos * 450`
  - Superficie directa: `m2 * arancel`
- **Variables**:
  - Estáticas: Valor de `variables.default_value`.
  - Dinámicas: Obtenidas de `quote_services.filled_variables` o de la sumatoria de m2 del `quote_floor_groups` vinculado.
- **Redondeo**: Los montos de inversión se redondean hacia arriba por defecto.

## 4. Viáticos y Parámetros
- Almacenados en la tabla `parameters` (una fila por ciudad).
- El vendedor selecciona la ciudad mediante un menú desplegable; el sistema inyecta el valor en `quotes.filled_parameters`.

## 5. Identidad Visual Bimetica
- **Primary**: `#003e65` (Azul corporativo principal).
- **Secondary**: `#fbad03` (Amarillo / dorado arquitectónico).
- **Tertiary**: `#2684a8` (Azul medio / técnico).
- **Sidebar**: Fondo Navy `#071526`, compás arquitectónico (`DraftingCompass`), título "BIMETICA", subtítulo "DISEÑO Y CONSTRUCCIÓN", y módulo destacado `COMERCIAL & VENTAS` en dorado.
