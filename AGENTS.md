# Directrices de Desarrollo — Cotizador Bimetica

Este documento contiene las reglas obligatorias para cualquier agente (OpenCode, Codex, Antigravity).

## 1. Stack Tecnológico Estricto
- **Backend**: Laravel 13 (PHP 8.3/8.4), PostgreSQL.
- **Frontend**: React 19, Inertia.js v3, TypeScript, Tailwind CSS v4.
- **Enrutamiento**: Laravel Wayfinder (`@/routes/*`).
- **Autenticación**: Laravel Fortify (backend headless).
- **Iconos y UI**: `lucide-react`, componentes base de Radix UI / Shadcn.

## 2. Prohibiciones Estrictas (Evitar Alucinaciones)
1. **NO usar Zod ni React Hook Form**: Todo formulario usa el componente `<Form {...store.form()}>` de Wayfinder con validación delegada a los `FormRequest` de Laravel.
2. **NO inventar roles**: Solo existen `admin` y `vendedor`. En la Designación, el coordinador es el mismo vendedor.
3. **NO usar `$guarded`**: Todo modelo Eloquent usa obligatoriamente `$fillable`.
4. **NO harcodear URLs**: NUNCA escribir `/api/...` o `post('/login')` en React. Toda ruta se importa de `@/routes/*`.
5. **NO instalar paquetes adicionales**: No agregar WebSockets, Queues complejas ni Redis salvo indicación explícita.

## 3. Idioma y Nomenclatura
- **Backend (PHP / BD)**: **Estrictamente en Inglés**.
  - Clases: `QuoteController`, `Client`, `QuoteService`.
  - Tablas: `quotes`, `quote_floor_groups`, `quote_services`.
  - Requests: `StoreQuoteRequest`, `UpdateClientRequest`.
- **Frontend (UI en React)**: **Estrictamente en Español**.
  - Botones ("Guardar Cotización"), títulos, modales, alertas y estados ("Borrador", "Cerrada").

## 4. Referencia de Conocimiento
- Para reglas de negocio, tablas de BD y cálculo de pisos: Consultar `CONTEXT.md` y la skill `bimetica-core`.
- Para generar CRUDs y componentes: Consultar la skill `antigravity-crud`.