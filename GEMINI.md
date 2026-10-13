# Contexto y Reglas del Proyecto: Cotizador Bimetica

Documento de contexto maestro para Gemini CLI.

## Stack y Restricciones
- **Backend**: Laravel 13, PostgreSQL, Laravel Fortify, FormRequests dedicados.
- **Frontend**: React 19, Inertia.js v3, TypeScript, Tailwind CSS v4.
- **Enrutamiento**: Laravel Wayfinder (`@/routes/*`). Prohibido escribir URLs manuales.
- **Formularios**: Componente `<Form {...action.form()}>` de Wayfinder. Prohibido instalar o usar Zod / React Hook Form.
- **Modelos Eloquent**: Obligatorio `$fillable`. Prohibido `$guarded`.

## Idioma
- Backend (clases, tablas, métodos, migraciones): **Inglés**.
- Frontend (vistas, textos, etiquetas, modales): **Español**.

## Roles de Acceso
- **Admin**: Configuración de servicios, fórmulas, variables, parámetros (viáticos) y plantillas de contrato.
- **Vendedor**: Gestión integral del cliente, cotización, formulario inicial, designación y contrato.
- *Nota*: No existen roles de Proyectista ni Coordinador. El vendedor es el coordinador técnico. Los clientes no acceden al software.

## Flujo del Negocio
1. **Cliente**: Registro con código anual `NNN/AAAA`.
2. **Cotización (`quotes`)**: Borrador con grupos de pisos reutilizables y servicios calculados con Math.js. Total con viáticos.
3. **Formulario Inicial (`initial_forms`)**: Formalización comercial y técnica previa.
4. **Fase Documental Post-Formulario (No Secuencial)**:
   - **Hoja de Designación (`designations`)**: A cargo del mismo vendedor.
   - **Contrato (`contracts`)**: Generación con plantilla HTML y placeholders.
   - *Ambos documentos derivan del Formulario Inicial y pueden elaborarse en orden indistinto.*

## Identidad Visual Corporativa
- Primary: `#003e65` | Secondary: `#fbad03` | Tertiary: `#2684a8`.
- Sidebar: Navy `#071526`, icono `DraftingCompass`, módulo comercial destacado en dorado `COMERCIAL & VENTAS`.

## Referencia de Conocimiento
- Para reglas de negocio y cálculo exhaustivo: Ver [CONTEXT.md](CONTEXT.md).
