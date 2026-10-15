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

## 3. Motor de Cálculo y Fórmulas (Math.js)

### Variables (`variables`) — Bloques elementales de cálculo
Cada variable tiene **dos dimensiones ortogonales**:

**Dimensión 1 — `type` (quién provee el valor):**
- `static`: El valor proviene del campo `default_value` configurado por el admin. Visible en la tabla de cotización como referencia unitaria fija (ej. `cambiodolar = 12.11`).
- `dynamic`: El vendedor provee el valor al cotizar (ej. `m2`, `pozos`). Genera un input editable en la fila de cotización.

**Dimensión 2 — `value_type` (qué tipo de dato es):**
- `integer`: Número entero (ej. `pozos = 4`).
- `decimal`: Número decimal (ej. `cambiodolar = 12.11`, `m2 = 45.50`).
- `string`: Cadena con opciones predefinidas. El campo `options` (JSON) almacena los valores permitidos (ej. `complejidad` con opciones `["bajo", "medio", "alto"]`).

**Columnas de la tabla `variables`:**
| Columna | Tipo | Descripción |
|---|---|---|
| `name` | `string(50)` | Identificador único en minúsculas usado en expresiones Math.js (ej. `m2`, `pozos`). Sin campo `label`. |
| `type` | `enum('static','dynamic')` | Quién provee el valor (admin estático o vendedor dinámico) |
| `value_type` | `enum('integer','decimal','string')` | Tipo de dato del valor |
| `default_value` | `string` nullable | Valor por defecto como string para soportar integer, decimal y string |
| `options` | `json` nullable | Array de opciones válidas para `value_type = string` (ej. `["bajo","medio","alto"]`) |
| `description` | `string` nullable | Descripción legible de la variable para referencia del usuario |

**Ejemplos de variables del sistema:**
| name | type | value_type | default_value | options | description |
|---|---|---|---|---|---|
| `m2` | dynamic | decimal | `"0"` | null | Superficie total calculada de pisos |
| `pozos` | dynamic | integer | `"0"` | null | Cantidad de pozos para estudio de suelos |
| `complejidad` | dynamic | string | `"medio"` | `["bajo","medio","alto"]` | Factor de dificultad del proyecto |
| `cambiodolar` | static | decimal | `"12.11"` | null | Tipo de cambio referencial USD a BOB |

### Fórmulas (`formulas`) — Columnas calculadas en la tabla de cotización
- Vinculadas 1:N al servicio (`service_id`).
- `name`: Nombre de la columna en la tabla (ej. `"m2/Bs"`, `"Inversión"`).
- `expression`: Expresión matemática y lógica evaluable con **Math.js** usando los `name` de las variables.
- `is_visible`: Si la columna se muestra al cliente en el desglose o solo se usa internamente para el subtotal final.
- La fórmula detecta automáticamente qué variables son `dynamic` y las presenta como inputs editables al cotizar. Las `static` se muestran como valores fijos.

**Sintaxis de Expresiones Math.js:**
```javascript
m2 < 30 ? 1600 : m2 * 56
pozos * cambiodolar * 450
m2 < 50 ? 2500 : (m2 <= 150 ? m2 * 45 : m2 * 40)
```

**Pivote `formula_variables`** (`formula_id`, `variable_id`): declara exactamente qué variables intervienen en cada fórmula para indexación, integridad referencial y protección anti-borrado.

**Redondeo**: Subtotales se redondean hacia arriba (`Math.ceil`).

## 4. Metodología de Desarrollo Incremental (Regla de Oro)
Para no abrumar y asegurar que cada avance sea verificable visual y funcionalmente paso a paso:
1. **Vista & Componentes Base (UI Primero)**: Construir primero la interfaz visual interactiva en React 19 con Tailwind CSS v4 para validar la experiencia de usuario y diseño antes de tocar la base de datos.
2. **Rutas & Wayfinder**: Registrar rutas en `routes/web.php` y generar clientes TypeScript tipados con `php artisan wayfinder:generate --with-form`.
3. **Migración, Modelo & Seeder**: Crear migraciones con tipos de datos estrictos, Modelos Eloquent con `$fillable` explícito, `$casts` y relaciones tipadas (`belongsTo`, `hasMany`, `belongsToMany`), sembrando datos de prueba realistas.
4. **Controllers & FormRequests**: Mutaciones seguras con FormRequests dedicados (`authorize`, `rules`, `attributes` en español y `prepareForValidation` para sanitización) y controladores delgados con mensajes flash en sesión.
5. **Conexión, Sandbox & Refactorización**: Conectar la UI con el backend usando `<Form {...action.form()}>`, evaluadores en vivo (Math.js) y validación de tipos con `npm run build`.

## 5. Viáticos y Parámetros
- Almacenados en la tabla `parameters` (una fila por ciudad).
- El vendedor selecciona la ciudad mediante un menú desplegable; el sistema inyecta el valor en `quotes.filled_parameters`.

## 6. Identidad Visual Bimetica
- **Primary**: `#003e65` (Azul corporativo principal).
- **Secondary**: `#fbad03` (Amarillo / dorado arquitectónico).
- **Tertiary**: `#2684a8` (Azul medio / técnico).
- **Sidebar**: Fondo Navy `#071526`, compás arquitectónico (`DraftingCompass`), título "BIMETICA", subtítulo "DISEÑO Y CONSTRUCCIÓN", y módulo destacado `COMERCIAL & VENTAS` en dorado.