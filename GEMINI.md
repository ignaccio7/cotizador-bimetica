# Contexto y Reglas del Proyecto: Cotizador Bimetica

Documento de contexto maestro para Gemini CLI.

## Stack y Restricciones
- **Backend**: Laravel 13, PostgreSQL, Laravel Fortify, FormRequests dedicados.
- **Frontend**: React 19, Inertia.js v3, TypeScript, Tailwind CSS v4.
- **Enrutamiento**: Laravel Wayfinder (`@/routes/*`). Prohibido escribir URLs manuales.
- **Formularios**: Componente `<Form {...action.form()}>` de Wayfinder. Prohibido instalar o usar Zod / React Hook Form.
- **Modelos Eloquent**: Obligatorio `$fillable`. Prohibido `$guarded`.
- **Datos Dinámicos**: Prohibido quemar o asumir constantes rígidas (`const GROUPS`) si la base de datos es la fuente dinámica de verdad.
- **Integridad**: Prohibido hacer dobles validaciones o código defensivo redundante si las reglas de validación o la BD ya garantizan el estado.

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

## Estilo de Desarrollo y Asistencia
- **Explicación con Ejemplos**: Explicar siempre el funcionamiento interno, qué entra, qué sale y alternativas con ejemplos didácticos claros.
- **Simplicidad Estricta**: No asumir requerimientos no contemplados ni inflar archivos con lógica innecesaria.
- **Flujo Ligero en Dev**: No correr builds completos (`npm run build`) ni suites pesadas salvo solicitud expresa; validar con sintaxis rápida (`php -l`) y confirmar en desarrollo en vivo.

## Referencia de Conocimiento
- Para reglas de negocio y cálculo exhaustivo: Ver [CONTEXT.md](CONTEXT.md).
