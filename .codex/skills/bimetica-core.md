---
name: bimetica-core
description: Reglas de negocio del Cotizador Bimetica, flujo de cotización de arquitectura, diseño de interfaz y convenciones técnicas.
---

# Bimetica Core Knowledge Item

## 1. Reglas de Negocio Clave
- **Código de Cliente**: Autogenerado, formato `NNN/AAAA` (ej. `001/2026`).
- **Grupos de Pisos**: Se definen a nivel cotización y los servicios pueden reutilizarlos o definir grupos específicos.
- **Fórmulas y Variables**: Evaluadas con Math.js. Los condicionales (ej. montos mínimos por superficie) se escriben directamente dentro de `formulas.expresion` (ej: `m2 < 30 ? 1600 : m2 * 56`).
- **Viáticos por Ciudad**: Predefinidos en `parameters`, el vendedor solo selecciona la ciudad en un selector desplegable.
- **Coordinador y Vendedor**: Son la misma persona; no hay rol proyectista ni coordinador separado en el sistema.
- **Formulario Inicial**: Pseudo-contrato para formalizar la cotización previa al contrato final.

## 2. Sistema de Diseño (Bimetica)
- **Primary**: `#003e65` (Azul corporativo).
- **Secondary**: `#fbad03` (Amarillo / dorado arquitectónico).
- **Tertiary**: `#2684a8` (Azul medio).
- **Header del Sidebar**: Navy oscuro `#071526`, logo amarillo con compás arquitectónico (`DraftingCompass`), título `BIMETICA` y subtítulo `DISEÑO Y CONSTRUCCIÓN`.
- **Sección de Ventas**: Etiqueta destacada en color dorado `COMERCIAL & VENTAS`.

## 3. Convenciones Técnicas
- Backend (PHP): Clases, métodos, tablas y rutas en inglés.
- Frontend (React + TypeScript): Interfaz, etiquetas, modales y mensajes en español.
- Rutas: Laravel Wayfinder importadas desde `@/routes/*`.
- Modelos: Exclusivamente `$fillable` tipado, nunca `$guarded`.
