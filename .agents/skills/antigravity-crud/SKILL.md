---
name: antigravity-crud
description: Scaffolding estricto de Modelos, FormRequests, Controladores y Vistas React + Inertia usando Laravel Wayfinder.
---

# Antigravity CRUD Scaffolder

## 1. Nomenclatura e Idioma
- **Backend (PHP / BD)**: Estrictamente en **Inglés** (Clases, Modelos, Métodos, Tablas, Columnas, Rutas).
- **Frontend (React / TSX)**: Estrictamente en **Español** (Textos, Botones, Títulos, Modales, Alertas, Estados).

## 2. Backend (Laravel 13)
- **Modelos (`app/Models/`)**:
  - Declarar siempre `$fillable` explícito con todos los campos permitidos. **Prohibido usar `$guarded`**.
  - Declarar `$casts` para columnas JSONB (`'array'`) y booleanos (`'boolean'`).
  - Métodos de relación estrictamente tipados (`belongsTo`, `hasMany`, `belongsToMany`).
- **FormRequests (`app/Http/Requests/`)**:
  - Toda mutación (`store`, `update`) DEBE tener una clase `FormRequest` dedicada.
  - Prohibido llamar `$request->validate()` dentro de métodos del Controlador.
- **Controladores (`app/Http/Controllers/`)**:
  - Métodos limpios y delgados.
  - Vistas: `return Inertia::render('Folder/Page', [...]);`.
  - Mutaciones: Usar `$request->validated()` y retornar redirecciones a rutas de Laravel: `return redirect()->route('model.index');` o `return to_route('model.index');`.

## 3. Frontend (React 19 + Inertia.js v3 + Wayfinder)
- **Enrutamiento**:
  - NUNCA escribir strings de URLs a mano (ej. `'/api/quotes'`).
  - Importar las rutas tipadas desde `@/routes/nombreModelo`.
- **Formularios con Wayfinder**:
  - Usar el componente `<Form>` inyectando la configuración de Wayfinder.
  - Para creación (POST):
  ```tsx
  import { Form } from '@inertiajs/react';
  import { store } from '@/routes/quotes';

  export default function CreateQuote() {
      return (
          <Form {...store.form()}>
              {({ errors, processing }) => (
                  <div>
                      {/* Inputs nativos y componentes Radix UI */}
                  </div>
              )}
          </Form>
      );
  }
  ```
  - Para actualización (PUT): `<Form {...update.form({ id: model.id })}>`.
  - **Prohibición Estricta**: NO usar `zod` ni `react-hook-form`. Todo formulario delega su validación al `FormRequest` de Laravel a través de Inertia.
- **Componentes UI**:
  - Reutilizar componentes base existentes en `resources/js/components/ui/`.
  - Usar iconos de `lucide-react`.
  - Respetar la paleta corporativa Bimetica (`primary: #003e65`, `secondary: #fbad03`, `tertiary: #2684a8`).