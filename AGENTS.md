# Directrices de Desarrollo — Cotizador Bimetica

Este documento contiene las reglas obligatorias para cualquier agente (Antigravity IDE, OpenCode, Codex).

## 1. Stack Tecnológico Estricto
- **Backend**: Laravel 13 (PHP 8.3/8.4), PostgreSQL.
- **Frontend**: React 19, Inertia.js v3, TypeScript, Tailwind CSS v4.
- **Enrutamiento**: Laravel Wayfinder (`@/routes/*`), sin URLs harcodeadas.
- **Autenticación**: Laravel Fortify (backend headless).
- **Iconos y UI**: `lucide-react`, componentes base de Radix UI.

## 2. Prohibiciones Estrictas (Cero Alucinaciones)
1. **NO usar Zod ni React Hook Form**: Todo formulario usa exclusivamente el componente `<Form {...action.form()}>` de Wayfinder con validación delegada a los `FormRequest` de Laravel.
2. **NO inventar roles ni usuarios**: Solo existen `admin` y `vendedor`. En la Designación, el coordinador técnico es el mismo vendedor. Los clientes no tienen login ni cuenta.
3. **NO usar `$guarded`**: Todo modelo Eloquent usa obligatoriamente `$fillable`.
4. **NO harcodear URLs**: NUNCA escribir strings como `'/api/...'` o `post('/login')` en React. Toda ruta se importa de `@/routes/*`.
5. **NO instalar paquetes adicionales**: Prohibido agregar WebSockets, Queues complejas ni Redis.
6. **NO quemar constantes rígidas para datos dinámicos**: Si una tabla o entidad almacena datos dinámicamente (`parameters`, etc.), no asumir ni hardcodear constantes o listas estáticas en PHP/TS que limiten su crecimiento.
7. **NO hacer dobles validaciones**: Si la base de datos o el `FormRequest` ya garantiza la integridad, no meter validaciones defensivas redundantes en frontend ni backend.

## 3. Idioma y Nomenclatura
- **Backend (PHP / BD)**: **Estrictamente en Inglés**.
  - Clases: `QuoteController`, `Client`, `QuoteService`.
  - Tablas: `quotes`, `quote_floor_groups`, `quote_services`, `initial_forms`.
  - Requests: `StoreQuoteRequest`, `UpdateClientRequest`.
- **Frontend (UI en React)**: **Estrictamente en Español**.
  - Botones ("Guardar Cotización"), títulos, modales, alertas y estados ("Borrador", "Formalizado", "Firmado").

## 4. Identidad Visual (Bimetica)
- **Primary**: `#003e65` (Azul corporativo principal: `bg-primary`, `text-primary`, `border-primary`).
- **Secondary**: `#fbad03` (Amarillo / dorado arquitectónico: acentos e iconos destacados).
- **Tertiary**: `#2684a8` (Azul medio / técnico: badges y subtítulos técnicos).
- **Sidebar**: Navy profundo `#071526`, cabecera con isotipo amarillo y compás arquitectónico (`DraftingCompass`), título "BIMETICA", subtítulo "DISEÑO Y CONSTRUCCIÓN", y sección comercial destacada en dorado `COMERCIAL & VENTAS`.

## 5. Flujo del Negocio
1. **Cliente**: Registro con código autogenerado correlativo anual `NNN/AAAA`.
2. **Cotización (`quotes`)**: Creación en "Borrador", asociación de grupos de pisos reutilizables y cálculo de servicios con fórmulas Math.js. Totalización con viáticos fijos por ciudad (`parameters`).
3. **Formulario Inicial (`initial_forms`)**: Formalización como pseudo-contrato (dirección de obra, modalidad de pago, monto acordado).
4. **Fase Documental Post-Formulario (Independiente / No Secuencial)**:
   - **Hoja de Designación (`designations`)**: Registro de instrucciones técnicas y fecha a cargo del mismo vendedor.
   - **Contrato (`contracts`)**: Generación del documento final mediante plantilla (`contract_templates`) y placeholders.
   - *Nota*: Ambas se desprenden del Formulario Inicial y pueden generarse en cualquier orden, sin depender una de la otra.

## 6. Estilo de Asistencia y Desarrollo
1. **Explicaciones Didácticas y con Ejemplos**: Cada avance o concepto técnico debe explicarse con claridad: qué hace, qué entra, qué sale, alternativas y ejemplos reales.
2. **Simplicidad y Código Limpio (KISS)**: Evitar sobreingeniería. Implementar únicamente lo contemplado en el plan sin inflar archivos con lógica innecesaria.
3. **Flujo de Trabajo Ligero en Dev**: No ejecutar builds pesados (`npm run build`) ni tests excesivos a menos que se solicite; priorizar sintaxis rápida (`php -l`) y validación directa en entorno de desarrollo.

## 7. Referencia de Conocimiento
- Para reglas de negocio completas, fórmulas y diccionario de tablas: Consultar [CONTEXT.md](CONTEXT.md).
- Para motor de fórmulas e identidad: Consultar `.agents/skills/bimetica-core/SKILL.md`.
- Para generar CRUDs y componentes: Consultar `.agents/skills/antigravity-crud/SKILL.md`.