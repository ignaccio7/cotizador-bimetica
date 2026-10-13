---
name: antigravity-crud
description: Generación estricta de Modelos, FormRequests, Controladores y Vistas React + Inertia usando Laravel Wayfinder.
---

# Antigravity CRUD Scaffolder

## 1. Modelos Eloquent (`app/Models/`)
- Declarar siempre `$fillable` explícito con todos los campos editables.
- Prohibido terminantemente usar `$guarded`.
- Usar `$casts`:
  - Columnas JSONB: `'array'` (ej. `'filled_parameters' => 'array'`, `'filled_variables' => 'array'`).
  - Booleanos: `'boolean'`.
- Declarar relaciones tipadas (`belongsTo`, `hasMany`, `belongsToMany`).

## 2. FormRequests (`app/Http/Requests/`)
- Toda mutación (`store`, `update`) tiene su propia clase `FormRequest`.
- Prohibido usar `$request->validate()` dentro de métodos del Controlador.
- La validación del backend es la única fuente de verdad para la seguridad.

## 3. Controladores (`app/Http/Controllers/`)
- Métodos limpios y delgados (Skinny Controllers).
- Las vistas retornan `Inertia::render('Entidad/Index', [...])`.
- Las mutaciones guardan con `$request->validated()` y retornan `to_route('entidad.index')`.

## 4. Frontend (React 19 + TypeScript + Wayfinder)
- Importar endpoints desde `@/routes/nombreControlador`.
- Formularios:
  ```tsx
  import { Form } from '@inertiajs/react';
  import { store } from '@/routes/quotes';

  export default function CreateQuote() {
      return (
          <Form {...store.form()}>
              {({ errors, processing }) => (
                  <div>
                      {/* Inputs reutilizando componentes de UI existentes */}
                  </div>
              )}
          </Form>
      );
  }