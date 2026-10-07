# Reglas y Contexto del Proyecto: Cotizador Bimetica

Este documento es el Knowledge Item (KI) principal del proyecto. Define la arquitectura, reglas de negocio, directrices de diseño y convenciones de código para el desarrollo del **Sistema Cotizador para Empresa de Arquitectura (Bimetica)**.

---

## 1. Stack Tecnológico & Arquitectura
- **Backend**: Laravel 13 (API / Routing / Eloquent / FormRequests).
- **Frontend**: React 19 + Inertia.js v3 + TypeScript + Tailwind CSS v4.
- **Enrutamiento Frontend**: Laravel Wayfinder (`@/routes/*`), sin URLs harcodeadas.
- **Base de Datos**: PostgreSQL (migraciones y modelos tipados estrictos).
- **Iconografía**: `lucide-react`.
- **Componentes UI base**: Radix UI / Shadcn UI adaptados.

---

## 2. Nomenclatura e Idioma
- **Backend (PHP / Laravel)**: **Estrictamente en Inglés**
  - Modelos (`Quote`, `QuoteFloorGroup`, `InitialForm`, `Contract`, `Designation`, `Service`, `Formula`, `Variable`, `Parameter`, `Client`, `User`).
  - Controladores (`QuoteController`, `ClientController`, etc.).
  - Tablas y columnas en BD (`quote_floor_groups`, `quote_services`, `monto_total`, etc. respetando esquema existente).
  - FormRequests (`StoreQuoteRequest`, `UpdateInitialFormRequest`).
  - Nombres de rutas (`quotes.index`, `quotes.create`, `admin.services.index`).
- **Frontend (UI / React / TSX)**: **Estrictamente en Español**
  - Textos visibles, títulos, botones, modales, alertas, tooltips, estados (`Borrador`, `Formalizado`, `Firmado`).

---

## 3. Identidad Visual y Paleta de Colores (Bimetica)
Los colores están centralizados en `resources/css/app.css` con variables CSS:
- **PRIMARY (Azul Corporativo)**:
  - Base: `#003e65` (`bg-primary`, `text-primary`, `border-primary`).
  - Header Navbar / Sidebar: Navy profundo `#071526` / `#00253d`.
- **SECONDARY (Amarillo / Dorado Arquitectura)**:
  - Base: `#fbad03` (`bg-secondary`, `text-secondary`, acentos, iconos destacados).
- **TERTIARY (Azul Medio / Técnico)**:
  - Base: `#2684a8` (`bg-tertiary`, `text-tertiary`, badges, subtítulos técnicos).
- **Estilo de Menú Lateral (Sidebar)**:
  - Cabecera con fondo navy oscuro, isotipo amarillo con icono de compás arquitectónico (`DraftingCompass`), título "BIMETICA" y subtítulo "DISEÑO Y CONSTRUCCIÓN", badge verificado.
  - Secciones visuales destacadas:
    - `COMERCIAL & VENTAS` en color dorado/amarillo (`text-secondary-600` / `#fbad03`).
    - `ADMINISTRACIÓN & CATÁLOGO` para configuración del sistema.

---

## 4. Roles y Control de Acceso
Solo existen **dos roles con acceso al sistema**:
1. **Admin**: Configuración global del catálogo:
   - Servicios y fórmulas evaluables en Math.js.
   - Variables estáticas y dinámicas.
   - Parámetros globales (tipo de cambio, viáticos fijos por ciudad).
   - Plantillas de contrato con placeholders.
   - Gestión de usuarios y supervisión de cotizaciones.
2. **Vendedor ("Ejecutivo Comercial")**:
   - Gestiona el ciclo completo: crea o busca clientes, arma cotizaciones con grupos de pisos, llena el Formulario Inicial, registra la Designación y genera el Contrato.
   - **Nota clave**: NO existen roles separados de "Proyectista" ni "Coordinador" dentro del sistema. En la Designación, el coordinador es siempre el mismo vendedor.

*Los clientes NO tienen acceso al sistema, solo son registros en `clients` que firman documentos impresos.*

---

## 5. Flujo de Negocio End-to-End
1. **Cliente**: Registro con código autogenerado correlativo anual `NNN/AAAA` (ej: `014/2026`).
2. **Cotización (`quotes`)**: Estado inicial "Borrador".
3. **Grupos de Pisos (`quote_floor_groups` + `quote_floors`)**: Tablas de m2 reutilizables que pueden asociarse a múltiples servicios o ser exclusivas de uno.
4. **Servicios (`quote_services`)**: Servicios seleccionados con variables dinámicas llenadas en jsonb (`variables_llenadas`) y subtotal evaluado mediante su fórmula.
5. **Monto Total**: Suma de subtotales de servicios + parámetros (viáticos por ciudad).
6. **Formulario Inicial (`initial_forms`)**: Formalización como pseudo-contrato con dirección, modalidad de pago acordada y datos extra.
7. **Contrato (`contracts`)**: Generado a partir de la plantilla única (`contract_templates`) inyectando datos del cliente y cotización.
8. **Designación (`designations`)**: Registro de instrucciones técnicas y fecha a cargo del mismo ejecutivo comercial.

---

## 6. Reglas Estrictas de Backend y Frontend
- **Modelos**: Usar siempre `#[Fillable([...])]` o `$fillable` explícito. **Prohibido usar `$guarded`**.
- **Mutaciones**: Todo `store` / `update` pasa por un `FormRequest` dedicado.
- **Rutas en React**: Utilizar siempre Laravel Wayfinder importado desde `@/routes/*`.
- **Formularios en React**: Usar `<Form {...action.form()}>` con captura nativa de errores de validación de Laravel.
- **Consistencia UI**: No romper la paleta corporativa y asegurar modo oscuro compatible.
