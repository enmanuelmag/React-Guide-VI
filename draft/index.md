# Plan de clases · React Guide VI

> Estado: arquitectura y 18 paquetes textuales aprobados definitivamente. Las 23 clases históricas se conservan temporalmente como fuentes de trazabilidad; ya no representan trabajo pendiente de revisión.

## Propósito del módulo

Los estudiantes construirán una versión reducida de Medialog. La aplicación permitirá buscar películas y series, consultar su detalle y administrar una biblioteca personal con `status`, `priority` y `notes`.

El curso comienza con React, componentes y estado local. Después incorpora API, TanStack Query, navegación, formularios, autenticación y CRUD. Desde la sesión 07, los estudiantes usan agentes para trabajo repetitivo bajo una rutina de límites, lectura y evidencia; los conceptos centrales siguen construyéndose y justificándose en clase.

## Calendario y horas

- 18 sesiones académicas entre el 21 de septiembre y el 14 de noviembre de 2026.
- Trece clases virtuales de 90 minutos.
- Cinco clases presenciales de 180 minutos, con 30 minutos de descanso.
- 34,5 horas académicas: `13 × 1.5 + 5 × 3 = 34.5`.
- La jornada institucional de empleabilidad del sábado 7 de noviembre interrumpe el calendario, pero no consume un número de sesión.
- Los feriados del 8, 10 y 31 de octubre y del 2 y 3 de noviembre no contienen clase de React.

## Acuerdos técnicos del borrador

- React y React DOM `19.2.8`, con TypeScript y Vite.
- pnpm `11.17.0` como gestor de las dependencias del proyecto; npm se usa únicamente para instalar globalmente el CLI de AHK.
- Mantine `9.4.1` para componentes visuales y formularios.
- Zod `4.4.3` para validación.
- TanStack Query para estado remoto.
- React Router `8.3.1` desde `react-router`, en modo declarativo.
- Firebase Authentication `12.16.0` para sesión. Cada estudiante configura su proyecto; la app no usa Firestore.
- Vitest `4.1.11` desde la sesión 07 para comportamientos puros.
- Zustand `5.0.15` para la identidad del modal global de creación, abierto desde búsqueda o detalle público.
- Agent Harness Kit `2.11.0`, instalado globalmente con npm e inicializado dentro del proyecto durante la sesión 07.
- El dominio incluye `movie` y `series`; excluye `anime`.
- El docente entrega `https://bootcamp-medialog.cardor.dev` como URL base del backend preparado. Los estudiantes no ejecutan ni modifican `medialog-server`.

## Alcance retirado

No forman parte de las 18 sesiones base:

- Drawer compartido.
- `lazy` y `Suspense`.
- Calendario.
- Filtros privados completos o persistidos en URL.

La biblioteca conserva un filtro básico por tipo con estado local.

## Rutina de agentes

Las consignas del proyecto se preparan por separado, en tres fases acumulativas y con AHK 3.0.0, según [sus reglas específicas](../rules/project-deliverables.md). La [primera](../Projects/01-definicion-funcional.md), la [segunda](../Projects/02-procesos-y-reglas.md) y la [tercera](../Projects/03-diseno-tecnico.md) están aprobadas y exportadas a PDF. No sustituyen el calendario, los checkpoints ni la evaluación vigente de Medialog. Las versiones de las sesiones indicadas a continuación conservan su alcance.

PDF distribuibles: [fase 1](../output/pdf/01-definicion-funcional.pdf), [fase 2](../output/pdf/02-procesos-y-reglas.pdf) y [fase 3](../output/pdf/03-diseno-tecnico.pdf). La [verificación](../output/pdf/verification.md) documenta extracción, copia y revisión visual.

Las sesiones 01 a 06 priorizan escritura manual. Desde la sesión 07, cada uso de agente declara:

1. Objetivo y comportamiento esperado.
2. Archivos y cambios permitidos.
3. Trabajo que la persona debe leer después.
4. Comandos y evidencia que deben ejecutarse.

Los tests pueden ser redactados por el agente después de que la persona defina la matriz de comportamientos. Un test sin ejecutar no constituye evidencia. La política completa vive en [desarrollo asistido por agentes](../rules/agent-assisted-development.md).

El diseño que condujo a la skill genérica está documentado en [`ahk-test`](agent-harness-kit-testing-skill-proposal.md). La versión fijada ya la materializa; el curso la invoca con una matriz humana, límites de archivos y evidencia enfocada.

## Rutas previstas

```text
/search
/media/:mediaType/:externalId
/login
/register
/app/library
/app/library/:logId
```

## Itinerario de 18 sesiones

| Sesión | Fecha | Modalidad | Tema | Sinopsis y progreso observable |
| --- | --- | --- | --- | --- |
| [01](../course/01-react-jsx-y-proyecto/session-draft.md) | Lun 21-sep | Virtual · 90 min | React, Vite y JSX | Crear el proyecto con pnpm, explicar el modelo de componentes y renderizar encabezado y tarjeta estática. |
| [02](../course/02-props-listas-y-typescript/session-draft.md) | Jue 24-sep | Virtual · 90 min | Props, listas y TypeScript | Convertir la `MediaCard` fija en configurable, tipar su contrato y renderizar un fixture con `map` y keys estables. |
| [03](../course/03-taller-catalogo-estatico/session-draft.md) | Sáb 26-sep | Presencial · 180 min | Composición y catálogo estático | Componer `MediaGrid`, estados vacíos y badges; completar después del descanso un catálogo estático reutilizable. |
| [04](../course/04-eventos-y-estado-local/session-draft.md) | Lun 28-sep | Virtual · 90 min | Eventos y `useState` | Crear un input controlado, manejar eventos y producir una búsqueda local por título. |
| [05](../course/05-estado-derivado-y-filtros-locales/session-draft.md) | Jue 01-oct | Virtual · 90 min | Estado derivado y filtros locales | Combinar texto y tipo sin copiar resultados a otro estado; mostrar contador, limpieza y vacíos por causa. |
| [06](../course/06-taller-seleccion-y-modal-local/session-draft.md) | Sáb 03-oct | Presencial · 180 min | Callbacks, selección y modal local | Elevar la identidad seleccionada a `App`, propagar `onSelect` y abrir un modal de Mantine desde cada tarjeta, conservando HTML/CSS del catálogo. |
| [07](../course/07-http-dtos-agentes-y-primer-test/session-draft.md) | Lun 05-oct | Virtual · 90 min | HTTP, DTOs, adapters y primer test | Instalar e inicializar Agent Harness Kit, leer el contrato real, crear fetchers y types mínimos y ejecutar con `ahk-test` el primer test Vitest de un adapter puro. |
| [08](../course/08-tanstack-query-y-busqueda-remota/session-draft.md) | Lun 12-oct | Virtual · 90 min | TanStack Query y búsqueda remota | Separar borrador y submit, agrupar hooks de Media, definir query keys y construir la búsqueda con Mantine y estados remotos de carga, error, vacío y éxito. |
| [09](../course/09-react-router-declarativo/session-draft.md) | Jue 15-oct | Virtual · 90 min | React Router declarativo | Introducir `BrowserRouter`, rutas, layouts, `Outlet`, enlaces y parámetros validados sin loaders ni Data Mode. |
| [10](../course/10-taller-detalle-publico-y-effects/session-draft.md) | Sáb 17-oct | Presencial · 180 min | Detalle público y Effects | Conectar la URL con la query de detalle, compartir estados completos mediante `PageState` y usar `document.title` como sincronización auténtica con cleanup y Strict Mode. |
| [11](../course/11-formularios-zod-y-modal-global/session-draft.md) | Lun 19-oct | Virtual · 90 min | Formularios, Zod y modal global | Validar status, prioridad y notas; derivar el tipo desde el schema y mostrar dónde se ejecuta la validación; introducir Zustand para la instancia global de creación. |
| [12](../course/12-firebase-auth-y-rutas-privadas/session-draft.md) | Jue 22-oct | Virtual · 90 min | Firebase Auth y rutas privadas | Configurar Email/Password, modelar y validar una proyección discriminada de la sesión, proteger `/app` y preparar el cliente HTTP autenticado. |
| [13](../course/13-taller-crear-listar-y-filtrar-biblioteca/session-draft.md) | Sáb 24-oct | Presencial · 180 min | Crear, listar y filtrar biblioteca | Conectar la mutación, invalidar familias, construir la primera lista privada y validar con Zod un filtro básico no persistido por tipo. |
| [14](../course/14-detalle-privado-e-identidades/session-draft.md) | Lun 26-oct | Virtual · 90 min | Detalle privado e identidades | Diferenciar `mediaType + externalId` de `logId`, derivar el selector desde un schema, validar el parámetro y componer catálogo nullable con datos personales. |
| [15](../course/15-edicion-y-reutilizacion/session-draft.md) | Jue 29-oct | Virtual · 90 min | Edición y reutilización | Extraer `MediaLogForm`, iniciar desde `entry` y actualizar status, prioridad y notas con invalidación pesimista. |
| [16](../course/16-eliminacion-y-regresion-crud/session-draft.md) | Jue 05-nov | Virtual · 90 min | Eliminación y regresión CRUD | Confirmar una acción destructiva, eliminar por `logId`, navegar después del éxito y comprobar el flujo CRUD completo. |
| [18](../course/18-despliegue-en-cloudflare-pages/session-draft.md) | Jue 12-nov | Virtual · 90 min | Despliegue en Cloudflare Pages | Distinguir build y despliegue, configurar variables, publicar la SPA y comprobar rutas recargables. |
| [19](../course/19-presentaciones-y-cierre/session-draft.md) | Sáb 14-nov | Presencial · 180 min | Presentaciones y cierre | Presentar el producto y su evidencia. Como mapa de continuidad no evaluado, observar y luego ubicar CSR, SSR y SSG sin añadir implementación. |

## Fronteras que evitan retrabajo

- La sesión 07 no muestra una integración remota provisional con `useEffect`; la interfaz remota comienza con TanStack Query en la sesión 08.
- El detalle remoto ya no pasa por un segundo modal intermedio. La sesión 09 prepara la URL y la presencial 10 integra la página final.
- El formulario de creación nace con `status`, `priority` y `notes`; los campos no aparecen tarde en el contrato.
- Zustand se introduce directamente con el modal que necesitan dos páginas. El modal local de la sesión 06 se conserva porque enseña callbacks y propiedad de estado.
- La primera biblioteca ya recibe su filtro básico. No se construye una fase posterior de sincronización con URL.
- Crear, editar y eliminar esperan la confirmación del servidor; la caché se actualiza mediante invalidación.
- El despliegue ocurre antes de la presentación final. La sesión 19 no contiene una feature nueva que ponga en riesgo la entrega.

## Talleres presenciales

| Sesión | Progreso antes del descanso | Taller posterior al descanso |
| --- | --- | --- |
| 03 | `MediaGrid`, composición y contrato del encargo ya explicados | Completar estados vacío, badges y composición del catálogo estático |
| 06 | Estado de selección, firma de `onSelect` y modal controlado ya demostrados | Propagar el callback desde `App` hasta cada tarjeta y comprobar cambio, cierre y reapertura |
| 10 | Router, enlaces e input nullable ya construidos; query de detalle y Effect con cleanup explicados antes del descanso | Integrar estados remotos, contenido y título; comprobar una URL de detalle recargable |
| 13 | Auth, cliente, formulario y contratos preparados en el seed; mutación, query privada, filtro de body y política de caché construidos y explicados antes del descanso | Construir la representación de biblioteca, conectar el control local por tipo, probar el adapter y demostrar el recorrido completo |
| 19 | Orden, tiempos y rúbrica de presentación definidos | Presentar, responder preguntas y entregar evidencia final; no se implementa contenido nuevo |

## Mapa de migración desde las 23 guías

Las guías existentes no se renombran todavía. Funcionan como material fuente y no como cronograma vigente.

| Nueva sesión | Fuentes principales del borrador anterior | Cambio de frontera |
| --- | --- | --- |
| 01–06 | [01](classes/01-react-jsx-y-proyecto.md), [02](classes/02-props-listas-y-typescript.md), [03](classes/03-taller-catalogo-estatico.md), [04](classes/04-eventos-y-estado-local.md), [05](classes/05-estado-derivado-y-filtros.md), [06](classes/06-taller-seleccion-y-modal.md) | Reducir virtuales de 120 a 90 minutos sin retirar sus conceptos base |
| 07 | [07](classes/07-http-api-y-tipos.md) y la parte de tests puros de [22](classes/22-filtros-url-y-pruebas.md) | Introducir harness, rutina de agentes y Vitest con adapters |
| 08 | [08](classes/08-query-keys-y-busqueda.md) | Mantener búsqueda remota; comprimir práctica repetitiva con el agente |
| 09 | [11](classes/11-react-router-declarativo.md) | Adelantar Router para evitar otro detalle remoto dentro de un modal |
| 10 | [09](classes/09-taller-catalogo-publico.md), [10](classes/10-effects-y-sincronizacion.md) y [12](classes/12-taller-navegacion-publica.md) | Integrar directamente la página pública y usar el título como Effect auténtico |
| 11 | [13](classes/13-formularios-y-validacion.md), [16](classes/16-formulario-crear-medio.md) y la discusión de estado de [24](classes/24-taller-mejoras-y-cierre.md) | Usar Zustand para un modal global de creación, no para drawer |
| 12 | [14](classes/14-firebase-auth-y-rutas-privadas.md) y [15](classes/15-taller-shell-autenticado.md) | Unir sesión, guardia y base del cliente autenticado en una virtual preparada |
| 13 | [17](classes/17-mutaciones-e-invalidacion.md), [18](classes/18-taller-crear-y-listar.md) y una versión reducida de [22](classes/22-filtros-url-y-pruebas.md) | Crear y listar en la misma presencial; filtro solo por tipo y sin URL |
| 14–16 | [19](classes/19-detalle-privado.md), [20](classes/20-edicion-y-reutilizacion.md) y [21](classes/21-taller-crud-completo.md) | Mantener detalle, edición y eliminación en tres virtuales de 90 minutos |
| 18 | Material nuevo | Despliegue en Cloudflare Pages |
| 19 | Cierre de [24](classes/24-taller-mejoras-y-cierre.md), sin sus features | Presentaciones y orientación conceptual no evaluada |

## Criterio aplicado al migrar las guías

Los 18 paquetes aprobados se produjeron con estos criterios:

- Leer las fuentes indicadas en el mapa.
- Definir un punto de entrada compatible con la sesión anterior.
- Ajustar la secuencia a 90 o 180 minutos.
- Indicar trabajo humano, trabajo delegado, lectura posterior y evidencia desde la sesión 07.
- Mantener los conceptos centrales fuera de la delegación mecánica.
- Actualizar este índice si cambia tema, actividad principal o checkpoint.

## Vocabulario transversal

- **Estado local:** información que pertenece a una interacción o componente, como el texto de un input.
- **Estado remoto:** información cuya fuente de verdad vive en un servidor.
- **DTO:** forma de los datos que una API recibe o devuelve.
- **Adapter:** función que traduce una forma de datos a otra sin solicitar datos ni cambiar estado.
- **Query key:** identificador estable que TanStack Query usa para separar resultados en caché.
- **Invalidación:** acción que marca datos en caché como desactualizados.
- **Harness:** estructura que limita roles, herramientas, memoria y evidencia de un flujo con agentes.
- **Skill:** instrucción reutilizable que conserva una forma de realizar una tarea.
- **Oráculo de test:** fuente que define cuál es el resultado correcto esperado.
- **Checkpoint:** versión comprobada del proyecto que sirve como inicio o cierre de una clase.
- **Frontera de evidencia:** límite exacto de lo que una comprobación demuestra y de lo que todavía no prueba.
