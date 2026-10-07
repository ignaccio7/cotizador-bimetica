---
name: antigravity-crud
description: Crea Modelos, Controladores, FormRequests y páginas React + Inertia usando Laravel Wayfinder y tipado estricto.
---

# Laravel Antigravity Scaffolder (React + Inertia + Wayfinder)

## Summary
Usa esta skill para generar código backend y frontend respetando la arquitectura estricta de Laravel 13, React, Inertia y el enrutamiento autogenerado de Laravel Wayfinder.

## Nomenclatura e Idioma
- Backend (Modelos, Controladores, Requests, Tablas de BD, Rutas): **Estrictamente en Inglés**.
- Frontend (Textos de la UI en React, tooltips, alertas): **Estrictamente en Español**.

## Backend (Laravel)

1. **Modelos (`app/Models/`)**:
   - Definir relaciones con funciones tipadas.
   - Usar estrictamente `$fillable` (Lista blanca de campos permitidos). ¡Nunca usar `$guarded`!
   - Usar `protected $casts = [...]` para columnas JSONB (convertir a `array`) o booleanos.

2. **Migraciones (`database/migrations/`)**:
   - Usar relaciones foráneas modernas y seguras: `$table->foreignId('model_id')->constrained()->cascadeOnDelete();`.
   - Utilizar `jsonb` para campos de parámetros o variables dinámicas.

3. **Controladores (`app/Http/Controllers/`)**:
   - Mantener los métodos limpios. La validación **NO** va aquí.
   - Retornar vistas de Inertia: `return Inertia::render('Folder/Page', ['data' => $data]);`.
   - Mutaciones (`store`, `update`, `destroy`) deben retornar Redirects a rutas de Laravel: `return redirect()->route('model.index');`.

4. **FormRequests (`app/Http/Requests/`)**:
   - Toda mutación (`store` o `update`) DEBE tener un FormRequest dedicado.
   - Centralizar la validación de los campos y retornar errores estructurados a Inertia.

## Frontend (React + Inertia)

1. **Componentización**:
   - Reutilizar componentes UI existentes (ej: `<TextInput>`, `<InputLabel>`, `<PrimaryButton>`).
   - Evitar clases largas de Tailwind repetidas si el componente ya existe.

2. **Enrutamiento y Formularios (Laravel Wayfinder)**:
   - NUNCA escribir strings de URLs a mano (ej: `'/api/users'`).
   - Importar las rutas desde `@/routes/nombreModelo`.
   - Para formularios, usar el componente Wrapper `<Form>` inyectando la configuración autogenerada de Wayfinder.
   - *Ejemplo POST*: `<Form {...store.form()}>`
   - *Ejemplo PUT*: `<Form {...update.form({ id: model.id })}>`.
   - NO usar `zod` ni `react-hook-form` a menos que el usuario lo solicite para un caso específico. Usar el flujo nativo del `<Form>` actual que captura los errores del `FormRequest` de Laravel.
