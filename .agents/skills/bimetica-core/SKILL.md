---
name: bimetica-core
description: Reglas de negocio del Cotizador Bimetica, flujo de 8 pasos, cálculo de pisos y fórmulas con Math.js, parámetros de viáticos y roles estrictos.
---

# Reglas de Negocio y Dominio — Cotizador Bimetica

## 1. Visión General del Negocio
Sistema interno para empresa de arquitectura (Bimetica) para cotizar servicios (Planos 2D, Diseño Arquitectónico, Interiores, Fachadas, Suelos, Estructuras, Instalaciones, Cómputos, Trámites), formalizar la venta mediante Formulario Inicial, generar el Contrato final y registrar la Designación técnica.

## 2. Roles de Usuario (Estricto)
Solo existen **dos roles** con acceso al sistema:
1. **Admin**: Configuración global del catálogo:
   - Servicios y fórmulas evaluables en Math.js.
   - Variables dinámicas y estáticas.
   - Parámetros globales (tipo de cambio, viáticos fijos por ciudad).
   - Plantillas de contrato con placeholders.
   - Gestión de usuarios y supervisión de cotizaciones.
2. **Vendedor ("Ejecutivo Comercial")**:
   - Gestiona el ciclo completo de la venta: busca/crea clientes, arma cotizaciones con grupos de pisos, llena el Formulario Inicial, registra la Designación y genera el Contrato.
   - **Nota clave**: NO existen roles separados de "Proyectista" ni "Coordinador" dentro del sistema. En la Designación, el coordinador es siempre el mismo vendedor.
   - Los clientes NO tienen login en el sistema (solo firman documentos físicos).

## 3. Flujo de Negocio End-to-End (8 Pasos)
1. **Cliente**: Registro con código autogenerado correlativo anual `NNN/AAAA` (ej: `014/2026`).
2. **Cotización (`quotes`)**: Estado inicial "Borrador".
3. **Grupos de Pisos (`quote_floor_groups` + `quote_floors`)**: Tablas de m2 reutilizables que pueden asociarse a múltiples servicios o ser exclusivas de uno.
4. **Servicios (`quote_services`)**: Servicios seleccionados con variables dinámicas llenadas en jsonb (`variables_llenadas`) y subtotal evaluado mediante su fórmula.
5. **Monto Total**: Suma de subtotales de servicios + parámetros (viáticos por ciudad).
6. **Formulario Inicial (`initial_forms`)**: Formalización como pseudo-contrato con dirección, modalidad de pago acordada y datos extra.
7. **Contrato (`contracts`)**: Generado a partir de la plantilla única (`contract_templates`) inyectando datos del cliente y cotización.
8. **Designación (`designations`)**: Registro de instrucciones técnicas y fecha a cargo del mismo ejecutivo comercial.

## 4. Reglas de Negocio Clave
- **Fórmulas y Expresiones**: Evaluadas con Math.js. Los condicionales (ej. montos mínimos por superficie tipo AF) viven directamente dentro de `formulas.expresion` (ej: `m2 < 30 ? 1600 : m2 * 56`).
- **Viáticos por Ciudad**: Predefinidos en `parameters` (una fila por ciudad); el vendedor solo selecciona la ciudad en un selector desplegable.
- **Redondeo**: Los montos de inversión se redondean hacia arriba por defecto.
- **Descuentos**: No habilitados por ahora.
- **Contrato**: Plantilla global única (`contract_templates`) con placeholders sustituidos (`{{cliente_nombre}}`, etc.).

## 5. Identidad Visual Bimetica
- **Primary**: `#003e65` (Azul corporativo).
- **Secondary**: `#fbad03` (Amarillo / dorado arquitectónico).
- **Tertiary**: `#2684a8` (Azul medio técnico).
- **Header del Sidebar**: Navy oscuro `#071526`, isotipo amarillo con compás arquitectónico (`DraftingCompass`), título `BIMETICA` y subtítulo `DISEÑO Y CONSTRUCCIÓN`.
- **Sección Comercial**: Etiqueta destacada en color dorado `COMERCIAL & VENTAS`.

## 6. Convenciones Técnicas
- **Backend (PHP)**: Modelos, controladores, migraciones, FormRequests y rutas en **Inglés**.
- **Frontend (React + TSX)**: Vistas, botones, modales, alertas y textos en **Español**.
- **Modelos Eloquent**: Usar exclusivamente `$fillable` tipado explícito. Prohibido `$guarded`.
- **Rutas en React**: Utilizar siempre Laravel Wayfinder importado desde `@/routes/*`. Nunca URLs hardcodeadas.
- **Formularios en React**: Usar `<Form {...action.form()}>` con captura nativa de errores de validación de Laravel.
