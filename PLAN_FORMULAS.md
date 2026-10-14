# Plan de Implementación: Motor de Fórmulas y Variables (Math.js)

Este documento detalla la hoja de ruta paso a paso para implementar el módulo de **Fórmulas y Variables** para los servicios arquitectónicos de Cotizador Bimetica, siguiendo la metodología de desarrollo incremental.

---

## 1. Visión General del Módulo
Cada servicio arquitectónico (`services`, ej. "PLANOS 2D", "ESTUDIO DE SUELOS") puede tener asociadas una o más fórmulas de cálculo (`formulas`).
Las fórmulas se evalúan en el cliente mediante **Math.js** para calcular los subtotales de inversión de forma transparente e inmediata.

### Estructura de Datos
- **`services`**: Catálogo base (`id`, `name`, `description`).
- **`variables`**:
  - `name`: Identificador único en minúsculas (ej. `m2`, `arancel`, `pozos`).
  - `type`: `static` (con `default_value` fija editable por admin) o `dynamic` (introducida por el vendedor al cotizar o proveniente de m2 de pisos).
  - `default_value`: Monto decimal nullable (ej. `56.00` para arancel).
- **`formulas`**:
  - `service_id`: FK a `services`.
  - `name`: Nombre descriptivo (ej. "Arancel con Mínimo 2D").
  - `expression`: Texto evaluable con Math.js (ej. `m2 < 30 ? 1600 : m2 * arancel`).
  - `is_visible`: Booleano (si la fórmula se detalla al cliente o solo el total).
- **`formula_variables`**: Tabla pivote N:M (`formula_id`, `variable_id`).

---

## 2. Metodología de Implementación Paso a Paso

### Paso 1: Backend Base (Modelos y Relaciones Eloquent)
1. **Completar Modelos**:
   - `app/Models/Variable.php`:
     - `$fillable = ['name', 'type', 'default_value']`.
     - Relación `formulas(): BelongsToMany` a través de `formula_variables`.
   - `app/Models/Formula.php`:
     - `$fillable = ['service_id', 'name', 'expression', 'is_visible']`.
     - `$casts = ['is_visible' => 'boolean']`.
     - Relación `service(): BelongsTo`.
     - Relación `variables(): BelongsToMany` a través de `formula_variables`.
   - `app/Models/Service.php`:
     - Agregar relación `formulas(): HasMany`.
2. **Seeders de Variables y Fórmulas Base**:
   - `database/seeders/VariableSeeder.php`:
     - `m2` (dynamic, default_value: null).
     - `arancel_2d` (static, default_value: 56.00).
     - `pozos` (dynamic, default_value: null).
     - `precio_pozo` (static, default_value: 450.00).
   - `database/seeders/FormulaSeeder.php`:
     - Vincular fórmulas de ejemplo a los servicios existentes:
       - PLANOS 2D: `m2 < 30 ? 1600 : m2 * arancel_2d` (Variables: `m2`, `arancel_2d`).
       - ESTUDIO DE SUELOS: `pozos * precio_pozo` (Variables: `pozos`, `precio_pozo`).

---

### Paso 2: Enrutamiento y Wayfinder
1. **Definir Rutas Web (`routes/web.php`)**:
   - Rutas para fórmulas asociadas al servicio:
     - `Route::post('services/{service}/formulas', [FormulaController::class, 'store'])->name('services.formulas.store');`
     - `Route::put('formulas/{formula}', [FormulaController::class, 'update'])->name('formulas.update');`
     - `Route::delete('formulas/{formula}', [FormulaController::class, 'destroy'])->name('formulas.destroy');`
   - Opcional: Endpoint/recurso para gestión del catálogo maestro de variables.
2. **Generar Wayfinder**:
   - Ejecutar: `php artisan wayfinder:generate --with-form`.

---

### Paso 3: Motor de Cálculo y Pruebas en Frontend (Math.js)
1. **Instalación de Dependencia**:
   - Instalar `mathjs` en el proyecto (`npm i mathjs` / `pnpm add mathjs`).
2. **Helper del Motor (`resources/js/lib/formula-engine.ts`)**:
   - `evaluateFormula(expression: string, scope: Record<string, number>): { result: number; error: string | null }`:
     - Compila la expresión con `math.compile(expression)`.
     - Evalúa con el objeto `scope`.
     - Aplica redondeo hacia arriba con `Math.ceil()`.
   - `extractVariables(expression: string): string[]`:
     - Analiza el AST de Math.js o regex de identificadores para sugerir automáticamente qué variables necesita la fórmula.

---

### Paso 4: FormRequests y Controladores Backend
1. **FormRequests**:
   - `app/Http/Requests/StoreFormulaRequest.php`:
     - `name`: `required|string|max:100`.
     - `expression`: `required|string`.
     - `is_visible`: `boolean`.
     - `variable_ids`: `array|exists:variables,id`.
   - `app/Http/Requests/UpdateFormulaRequest.php`.
2. **Controlador (`app/Http/Controllers/FormulaController.php`)**:
   - `store`: Crea la fórmula, sincroniza `$formula->variables()->sync($request->variable_ids)` y redirige con mensaje flash.
   - `update`: Actualiza datos y sincroniza variables.
   - `destroy`: Elimina la fórmula de forma segura.

---

### Paso 5: UI & Pestaña de Fórmulas en el Catálogo de Servicios
1. **Estructura en `service-form.tsx`**:
   - Incorporar pestañas o sección visual:
     - **Pestaña 1**: *Alcance & Entregables* (Nombre comercial y descripción numerada actual).
     - **Pestaña 2**: *Fórmulas & Cálculo* (Lista de fórmulas del servicio, creador/editor de fórmula).
2. **Sandbox de Simulación Interactivo**:
   - Al editar o escribir una expresión:
     - Muestra inputs en vivo para cada variable detectada (ej. `m2: [ 100 ]`, `arancel: [ 56 ]`).
     - Renderiza el resultado en tiempo real calculado por Math.js.
     - Indicador visual si la sintaxis es válida (verde) o si tiene error de sintaxis (rojo).

---

### Paso 6: Modularización Limpia (Sin Sobre-ingeniería)
Organizar los componentes en `resources/js/components/services/`:
- `services-list.tsx` (Catálogo actual ✅).
- `service-form.tsx` (Formulario contenedor de servicio ✅).
- `delete-service-dialog.tsx` (Modal de borrado ✅).
- `formula-list.tsx` (Lista de fórmulas asociadas al servicio seleccionado).
- `formula-editor.tsx` (Editor de expresión con Wayfinder Form).
- `formula-sandbox.tsx` (Probador de cálculo interactivo en vivo).

---

## 3. Comandos Útiles para Continuar en la Laptop
1. `git pull origin master`
2. `npm install` o `pnpm install` (si se agregaron dependencias)
3. `php artisan migrate`
4. `php artisan wayfinder:generate --with-form`
5. `composer run dev`
