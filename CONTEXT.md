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
- **Variables (`variables`)**: Tienen **dos dimensiones**:
  - `type` (`static` / `dynamic`): Quién provee el valor. Las `static` tienen un valor configurado por el admin. Las `dynamic` generan un input editable para el vendedor al cotizar.
  - `value_type` (`integer` / `decimal` / `string`): Qué tipo de dato es. Las de tipo `string` almacenan opciones válidas en el campo `options` (JSON). El campo `default_value` es siempre `string` nullable para soportar los tres tipos.
  - Ejemplos: `m2` (dynamic, decimal, default `"0"`), `pozos` (dynamic, integer, default `"0"`), `complejidad` (dynamic, string, default `"medio"`, options `["bajo","medio","alto"]`), `cambiodolar` (static, decimal, default `"12.11"`).
- **Fórmulas (`formulas`)**: Son las **columnas calculadas** en la tabla de cotización. Expresión evaluable con Math.js vinculada 1:N al servicio. El sistema detecta automáticamente las variables `dynamic` de la expresión y las presenta como inputs; las `static` se muestran como valores fijos de referencia.
- **Expresiones**: Operadores ternarios de Math.js (ej: `m2 < 30 ? 1600 : m2 * 56`). No existen tablas de rangos separadas.
- **Viáticos por Ciudad**: Fila por ciudad configurada en `parameters`. El vendedor selecciona la ciudad en un selector; no introduce montos manuales.
- **Redondeo**: Los montos de inversión se redondean hacia arriba por defecto (`Math.ceil`).
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
| `variables` | Bloques elementales con `name` (identificador único), `type` (static/dynamic), `value_type` (integer/decimal/string), `default_value` (string), `options` (json nullable), `description` (string nullable). Sin campo `label`. |
| `formulas` | Columnas calculadas en cotización: `service_id`, `name`, `expression` (Math.js), `is_visible`. |
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
- ✅ **Módulo 1: Catálogo de Servicios y Alcance (`/services`)**:
  - Migración y Modelo `Service` con `$fillable`.
  - Seeder con 6 servicios reales de Bimetica y entregables numerados.
  - FormRequests (`StoreServiceRequest`, `UpdateServiceRequest`) en inglés con mensajes y atributos en español.
  - `ServiceController` CRUD completo (`index`, `store`, `update`, `destroy`) con mensajes flash compartidos en Inertia.
  - UI interactiva React 19 + Wayfinder: vista maestro-detalle, componentes modulares en `resources/js/components/services/` (`ServicesList`, `ServiceForm`, `DeleteServiceDialog`), soporte móvil con scroll acotado, selección automática al crear servicio.
- ✅ **Módulo 2A: CRUD Maestro de Variables del Sistema (`/variables`)**:
  - Migración corregida de `variables` con tipos estrictos (enums `type`, `value_type`, `default_value` string, `options` json, `description`).
  - Modelo `Variable` con `$fillable`, cast de `options` a array y relación `formulas(): BelongsToMany` vía `formula_variables`.
  - `VariableSeeder` con las 4 variables base (`m2`, `pozos`, `complejidad`, `cambiodolar`).
  - FormRequests (`StoreVariableRequest`, `UpdateVariableRequest`) con sanitización de identificadores y mensajes en español.
  - `VariableController` CRUD completo con protección anti-eliminación si la variable está en uso por fórmulas.
  - Vista completa `resources/js/pages/variables/index.tsx` con buscador en tiempo real, filtros por tipo (Todas / Dinámicas / Estáticas), modal de creación/edición con Wayfinder `<Form>` y confirmación de borrado.
  - Enlace en Sidebar: **Variables del Sistema** (icono `Sliders`).
- ✅ **Módulo 2B: Fórmulas de Cotización por Servicio (`/services` - Pestaña Fórmulas)**:
  - Modelo `Formula` con `$fillable`, relación `service()` y pivote `formula_variables` con `Variable`.
  - Seeder oficial `FormulaSeeder` con fórmulas reales encadenadas para Planos 2D, Diseño 3D, Estructuras, Suelos y Trámites.
  - Ruta y Wayfinder: `Route::put('services/{service}/formulas', [ServiceFormulaController::class, 'update'])->name('services.formulas.update')`.
  - `UpdateServiceFormulasRequest` con validación estricta y atributos en español.
  - `ServiceFormulaController` con persistencia atómica en transacción y sincronización de variables vinculadas.
  - Evaluador matemático seguro (`evaluateFormula`) con soporte de condicionales ternarios, redondeo (`ceil`, `floor`, `round`) y slugging en cascada.
  - Componente `FormulaList` con botonera asistente `[+ m2]`, `[+ pozos]`, `[+ complejidad]`, `[+ cambiodolar]`, alternancia de variables vinculadas y conmutador de visibilidad (Visible en cotización vs Interno).
  - Simulador en vivo en tiempo real (Sandbox) con inputs de prueba y cálculo reactivo en cascada con identidad Bimetica.