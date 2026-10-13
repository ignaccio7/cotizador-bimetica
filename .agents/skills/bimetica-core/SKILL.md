---
name: bimetica-core
description: Reglas de negocio del Cotizador Bimetica, evaluación de fórmulas con Math.js, grupos de pisos reutilizables y parámetros.
---

# Bimetica Core Domain Skill

## 1. Motor de Fórmulas
- Las fórmulas se almacenan en `formulas.expression` como texto.
- **Sintaxis de Fórmulas**: Compatible con Math.js usando condicionales ternarios:
  - Ejemplo con mínimo: `m2 < 30 ? 1600 : m2 * 56`
  - Ejemplo con pozos: `pozos * 450`
  - Ejemplo simple: `m2 * arancel`
- **Variables**:
  - Estáticas: El valor sale de `variables.default_value`.
  - Dinámicas: Salen de `quote_services.filled_variables` (llenadas por el vendedor) o del total de m2 del `quote_floor_groups` asignado.

## 2. Grupos de Pisos
- Un servicio de planos puede apuntar a un grupo con pisos del 1 al 4.
- Un servicio de fachada puede apuntar a otro grupo que solo incluya planta baja.
- Servicios como "Trámites" o "Estudio de Suelos" dejan `quote_floor_group_id` en `null`.

## 3. Viáticos y Parámetros
- Los viáticos por ciudad se registran en la tabla `parameters`.
- El vendedor selecciona la ciudad desde un selector en la cotización; el sistema toma el valor predeterminado y lo guarda en `quotes.filled_parameters`.