COTIZACIÓN COMERCIAL
SISTEMA COTIZADOR BIMETICA
Fecha: 8 de noviembre de 2026
Cliente: BIMETICA
	El sistema Cotizador Bimetica es una plataforma web integral para
	empresas de arquitectura que transforma el proceso de cotización de
	servicios (planos 2D, diseño arquitectónico, fachadas, estudio de suelos,
	estructuras, instalaciones, cómputos y trámites). La propuesta incluye
	todas las funcionalidades del sistema, el servidor virtual necesario para
	su puesta en marcha y la configuración inicial según el flujo de negocio
	establecido.

## MÓDULOS INCLUIDOS

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | Módulo de Catálogo de Servicios | Administración y catálogo de servicios arquitectónicos (6 servicios base). Cada servicio incluye fórmulas Math.js, variables dinámicas/estáticas y categorías. El vendedor puede seleccionar servicios y asignar grupos de pisos opcionales. |
| 2 | Motor de Cálculo con Math.js | Motor de evaluación de fórmulas matemáticas para cálculo automático de subtotales. Las variables `dynamic` se presentan como inputs editables al momento de cotizar; las `static` se muestran como valores fijos. Ejemplos de expresiones: `m2 < 30 ? 1600 : m2 * 56`, conteo de pozos, multiplicación por complejidad. |
| 3 | Gestión de Variables del Sistema | Configuración de variables con dos dimensiones: `type` (static/dynamic) y `value_type` (integer/decimal/string). Las variables dinámicas tienen inputs editables por el vendedor. Variables base: `m2` (decimal), `pozos` (integer), `complejidad` (string con opciones [bajo, medio, alto]), `cambiodolar` (decimal 12.11). |
| 4 | Sistema de Cotizaciones (Quotes) | Creación de cotizaciones en estado `Draft` (Borrador) con código correlativo anual `COT-NNN/AAAA`. Cada cotización tiene: total_amount calculado automáticamente, parámetros llenos (viáticos por ciudad), y asociación con cliente y vendedor. |
| 5 | Grupos y Pisos de Superficie | Módulo de tablas de superficies m² reutilizables. `quote_floor_groups` agrupa pisos individuales (`quote_floors`) con nombre, área y descripción. Los servicios pueden asignar opcionalmente un grupo de pisos o quedarse sin superficie (suelos, trámites). |
| 6 | Totalización con Viáticos por Ciudad | Suma de subtotales de todos los servicios + parámetros adicionales. Los viáticos por ciudad están configurados en la tabla `parameters` (fila por ciudad). El vendedor selecciona la ciudad en selector; el sistema suma automáticamente los montos fijos. |
| 7 | Formulario Inicial (`initial_forms`) | Formalización comercial como pseudo-contrato. Captura: dirección de obra, modalidad de pago, monto acordado y datos complementarios en `extra_data` (jsonb). Este formulario es el precursor de contratos y designaciones. |
| 8 | Hoja de Designación (`designations`) | Registro de instrucciones técnicas y fecha de inicio de obra. El responsable técnico/coordinador es el mismo vendedor. Generado post-formulario inicial de forma independiente. |
| 9 | Generación de Contratos (`contracts`) | Generación de documento final mediante plantilla `contract_templates` fusionando placeholders de cliente y cotización. Placeholders ejemplo: `{{cliente_nombre}}`, `{{total}}`, `{{direccion_obra}}`, `{{modalidad_pago}}`. |
| 10 | Códigos Correlativos Anuales | Sistema autogenerado de códigos cliente `NNN/AAAA` (ej. `001/2026`) y códigos de cotización `COT-NNN/AAAA`. Unicidad garantizada por año calendario. |
| 11 | Control de Roles y Permisos | Dos roles en el sistema: **Admin** (configuración de servicios, fórmulas, variables, parámetros, plantillas de contrato) y **Vendedor** (gestión de clientes, elabora cotizaciones, completa formulario inicial, genera designación y contrato). |
| 12 | Panel de Administración Completo | Interfaz web para administración: CRUD de servicios, fórmulas, variables, parámetros (viáticos), plantillas de contrato, gestión de usuarios. Todas las rutas bajo prefijo `/` con Wayfinder y componentes React 19. |
| 13 | Puesta en Marcha en Servidor Virtual | Servidor virtual con configuración para publicar y utilizar el sistema en línea. Incluye verificación de recepción de mensajes, entrega de accesos de administración y configuración inicial. |

## DETALLE DE INVERSIÓN

| # | Descripción | Costo (Bs) |
|---|-------------|------------|
| 1 | Conexión y configuración del sistema WhatsApp (opcional integración) | 200,00 |
| 2 | Protección de conexión y controles preventivos | 150,00 |
| 3 | Procesamiento en cola de solicitudes entrantes | 150,00 |
| 4 | Sesión de WhatsApp (mantenimiento de vínculo de cuenta) | 150,00 |
| 5 | Control del tráfico de mensajes y archivos | 300,00 |
| 6 | Inicio de sesión seguro (credenciales autorizadas) | 200,00 |
| 7 | Gestión de usuarios (crear, actualizar, administrar cuentas) | 150,00 |
| 8 | Roles y permisos (definir funciones y información accesible) | 150,00 |
| 9 | Embudos comerciales (organizar oportunidades por etapas) | 500,00 |
| 10 | Bandeja de conversaciones (centralizar chats capturados) | 450,00 |
| 11 | Configuración de mensajes (textos y mensajes automáticos) | 200,00 |
| 12 | Diseño y estructura de base de datos (usuarios, conversaciones, etapas) | 250,00 |
| 13 | Puesta en marcha en servidor virtual (servidor y configuración) | 150,00 |
| | **SUBTOTAL SERVICIOS BASE** | **2.800,00** |
| | **IMPUESTOS (13%)** | **364,00** |
| | **INVERSIÓN TOTAL** | **3.164,00** |

## CONDICIONES DE ENTREGA

- ✅ **Entrega y puesta en marcha**: Se contempla la publicación del sistema, verificación de recepción de mensajes y entrega de accesos de administración.
- ✅ **Alojamiento del sistema por 1 año**: El costo del servicio incluye el alojamiento del sistema por 12 meses en el servidor virtual.
- ✅ **Migración de datos**: Si existe información previa (clientes, servicios), se contempla importar y estructurar en el nuevo sistema.
- ✅ **Capacitación básica**: Sesión de capacitación para el administrador y vendedor sobre el uso del panel, creación de cotizaciones, generación de contratos y designaciones.

## FORMA DE PAGO PROPUESTA

| Plazo | Porcentaje | Bs | Descripción |
|-------|------------|----|-------------|
| 1️⃣ | 30 % | 949,20 | A la aceptación de la propuesta y reserva del desarrollo. |
| 2️⃣ | 40 % | 1.265,60 | Al validar el funcionamiento del sistema en entorno de pruebas (staging). |
| 3️⃣ | 30 % | 949,20 | Durante la puesta en marcha y entrega de accesos al servidor productivo. |

## MANTENIMIENTO Y SOPORTE TÉCNICO

| Servicio | Descripción | Costo |
|----------|-------------|-------|
| Corrección de errores del sistema | Solución de fallas de programación atribuibles al desarrollo original, dentro de las funcionalidades entregadas. | Gratuito durante 90 días |
| Incorporación de nuevas funcionalidades | Desarrollo e implementación de herramientas, módulos o características adicionales no contempladas en la presente cotización. | Cotización adicional según requerimiento |
| Modificación de funcionalidades existentes | Ajustes en comportamiento de módulos, procesos, formularios, reportes o herramientas solicitados post-entrega. | Costo adicional según complejidad |
| Modificaciones visuales y de diseño | Cambios en colores, distribución de elementos, interfaces, formularios o presentación visual. | Costo adicional según alcance |
| Actualizaciones y mantenimiento preventivo | Revisión y actualización de componentes tecnológicos para mejorar estabilidad, seguridad y rendimiento. | Según evaluación técnica |
| Soporte técnico y asesoramiento | Orientación sobre uso de funcionalidades implementadas y resolución de consultas relacionadas con el funcionamiento. | Gratuito durante el período de garantía, dentro del alcance configurado |
| Configuración y administración del servidor | Modificaciones en configuración del servidor, ampliación de recursos, migraciones o renovaciones del servicio de alojamiento. | Costo adicional según requerimiento |
| Cambios externos en WhatsApp | Adaptaciones necesarias debido a modificaciones, restricciones o actualizaciones de WhatsApp que afecten la integración. | Sujeto a evaluación y cotización |
| Capacitación adicional | Sesiones complementarias de capacitación para nuevos usuarios, administradores o personal de la empresa. | Costo adicional por sesión |
| Respaldos y recuperación de información | Configuración de respaldos adicionales, recuperación de información y restauración del sistema ante incidentes externos. | Según alcance del servicio |

## NOTAS ADICIONALES

1. **Alcance del proyecto**: El sistema está diseñado según el flujo de negocio de Bimetica con 2 fases secuenciales: (Fase 1) Cotización y Formalización, y (Fase 2) Documentación Post-Formulario (Designación y Contrato, independientes y no secuenciales).

2. **Roles del sistema**: Solo existen 2 roles - Admin y Vendedor. Los clientes no tienen login ni cuenta en el sistema; solo firman documentos impresos generados por el sistema.

3. **Códigos correlativos**: El sistema autogenera códigos anuales `NNN/AAAA` para clientes y `COT-NNN/AAAA` para cotizaciones. El conteo reinicia cada año calendario.

4. **Fórmulas Math.js**: Las expresiones de fórmula son dinámicas y pueden ser modificadas por el admin. El sistema detecta automáticamente las variables `dynamic` y las presenta como inputs en la UI de cotización.

5. **Viáticos por ciudad**: Configurados en tabla `parameters` una sola vez por el admin. Al cotizar, el vendedor selecciona la ciudad y el sistema suma los montos fijos automáticamente.

6. **Plantillas de contrato**: Una plantilla HTML única con placeholders configurables por el admin. La generación de contrato fusiona datos del cliente y de la cotización completada.

7. **Entrega**: El sistema será entregado con el servidor virtual configurado, base de datos migrada, cuentas de admin y vendedor creadas, y primera cotización de ejemplo generada.

---

**Autorizado por:** _________________________  
**Fecha:** _________________________  

**Bimetica Software Solutions** - Desarrollo a medida de sistemas de cotización y gestión para arquitectura.