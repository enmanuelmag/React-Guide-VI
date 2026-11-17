# Plan operativo de correcciones · Revisión de septiembre de 2026

## Norte y autorización

El usuario revisó hasta la sesión 13 y pidió un barrido de los 19 `changes.md` antes de editar. Aprobó el análisis y el orden de trabajo en la conversación del 5 de septiembre de 2026. Después pidió guardar el plan, mantener trazabilidad y empezar por las correcciones directas.

Objetivo: que las guías conserven contratos y convenciones consistentes y que el docente pueda seguir cada construcción desde su definición hasta su uso y resultado observable, sin reconstruir código ausente.

Unidad de trabajo: una corrección por iteración, con toda su propagación. D01–D06 y C01–C08 están cerradas. La aprobación de estas correcciones no convierte los paquetes provisionales en guías definitivas.

## Estado para retomar

- Fase directa cerrada: **D01–D06**, implementadas y validadas documentalmente el 5 de septiembre de 2026.
- C01 cerrada: **Agent Harness Kit**, implementada y validada documentalmente el 5 de septiembre de 2026.
- C02 cerrada: **estados visuales compartidos**, implementada y validada documentalmente el 5 de septiembre de 2026.
- C03 cerrada: **schemas como origen de tipos propios**, implementada y validada documentalmente el 5 de septiembre de 2026.
- C04 cerrada: **reconstrucción docente de la sesión 11**, implementada y validada documentalmente el 5 de septiembre de 2026.
- C05 cerrada: **reconstrucción docente de la sesión 12**, implementada y validada documentalmente el 5 de septiembre de 2026.
- C06 cerrada: **contrato de lista y constructor del body de la sesión 13**, implementada y validada documentalmente el 6 de septiembre de 2026.
- Última corrección cerrada: **C07 · trazabilidad de símbolos en las sesiones 14–16 y 18–19**. C07-A, C07-B, C07-C y C07-E quedaron implementadas y validadas documentalmente el 6 de septiembre de 2026.
- C08 cerrada: **`z.compile()` queda fuera del itinerario base** hasta que exista un caso repetitivo medible y un benchmark representativo.
- El barrido de correcciones de septiembre queda cerrado. No existe una C09 pendiente.
- Presentaciones, seeds ejecutables, backend, commits, ramas y tags quedan fuera de esta iteración.

Estados: **Aprobada pendiente**, **En curso**, **Implementada y validada documentalmente**, **Pendiente de diseño**. Una validación documental no acredita TypeScript, Vitest, navegador, Network, Firebase o despliegue.

## Correcciones directas aprobadas

| ID | Solicitud de origen | Trabajo y propagación | Criterio de cierre | Estado |
| --- | --- | --- | --- | --- |
| D01 | [Sesión 02](course/02-props-listas-y-typescript/changes.md) | Usar `data` para el objeto de una tarjeta; alinear definiciones, destructuración, JSX, explicaciones y consumidores posteriores. Conservar `items`, identidades y callbacks. | Ningún ejemplo activo de tarjeta conserva el contrato anterior; regla y resolución enlazan evidencia. | Implementada y validada documentalmente |
| D02 | [Sesión 07](course/07-http-dtos-agentes-y-primer-test/changes.md) | Cambiar `media-detail-input-to-search-params` por `media-input-to-params`; propagar imports, árboles, tests, comandos y prompts. | Las referencias operativas usan el nombre nuevo; las notas históricas se distinguen de las instrucciones vigentes. | Implementada y validada documentalmente |
| D03 | [Sesión 08](course/08-tanstack-query-y-busqueda-remota/changes.md) | Agrupar hooks de Media en `src/hooks/features/use-media.ts`, conservando uno por caso de uso. Explicar reutilización, consistencia y prueba separada sin afirmar que un componente no pueda probarse. | Imports relativos y árboles coherentes desde 08 hasta los últimos consumidores; no se añade infraestructura de pruebas de hooks. | Implementada y validada documentalmente |
| D04 | [Sesión 06](course/06-taller-seleccion-y-modal-local/changes.md) y [08](course/08-tanstack-query-y-busqueda-remota/changes.md) | Explicar modal acotado en 06, continuidad en 07 y adopción amplia en 08; conservar HTML/CSS, componentes del dominio, foco/cierre y responsabilidad React. Explicitar primitives, `className`/`classNames`, badge y fallback visual sin resolver Query. | Guion, guías y preparación cuentan la misma transición y conservan la dificultad principal y el taller. | Implementada y validada documentalmente |
| D05 | [Sesión 11](course/11-formularios-zod-y-modal-global/changes.md) | Explicar `mode`, `initialValues`, `validate`, resolver, `sync`, blur, cambio de values y conexión de controles/submit. | Cada opción usada tiene explicación junto al ejemplo; 12 y 15 pueden reutilizarla sin volver a introducirla. | Implementada y validada documentalmente |
| D06 | [Sesión 10](course/10-taller-detalle-publico-y-effects/changes.md) | Explicar adapter como frontera DTO → modelo → UI, con antes/después y un cambio de contrato. | La guía muestra transformación y consumo; explica que DTO/schema también pueden cambiar cuando cambia la API. | Implementada y validada documentalmente |

## Correcciones complejas, en orden

| ID | Solicitud de origen | Decisión y alcance a concretar | Criterio de cierre | Estado |
| --- | --- | --- | --- | --- |
| C01 | [Sesión 07](course/07-http-dtos-agentes-y-primer-test/changes.md) | Instalación global AHK con npm, excepción documentada a pnpm, versión fijada, configuración, PATH, materialización, presentación y `ahk-test`. Simplificar prompts posteriores sin perder alcance, lectura humana ni evidencia. Corregir preparación que pide `pnpm test` antes de incluir Vitest/script. | Recorrido reproducible documentado desde instalación hasta uso; versión y disponibilidad comprobadas; tiempo de 07 realista. | Implementada y validada documentalmente |
| C02 | [Sesión 10](course/10-taller-detalle-publico-y-effects/changes.md) | `PageState` compartido para carga, error, entrada inválida y contenido no disponible; copy predeterminado con overrides y retry opcional en `error`/`unavailable`. Páginas deciden el estado y entregan el callback. | Contrato y ejemplos completos; consumidores públicos/privados coherentes sin mezclar Router o Query en presentación. | Implementada y validada documentalmente |
| C03 | [Sesión 12](course/12-firebase-auth-y-rutas-privadas/changes.md) | Schemas como origen de tipos propios desde 11; `z.infer`, `z.discriminatedUnion`, valores canónicos y fronteras de SDK, callbacks y genéricos. | No se duplican contratos ni se promete validación sin parseo; Auth, filtro, selector 14 y tipos posteriores coherentes. | Implementada y validada documentalmente |
| C04 | Petición transversal y [sesión 11](course/11-formularios-zod-y-modal-global/changes.md) | Reconstruir store, modal, schema, body, adapter, formulario, preview y aperturas en orden docente. Recuperar fuentes históricas sin depender de ellas para impartir. | Cada pieza nueva tiene archivo, definición, import/consumo y checkpoint. | Implementada y validada documentalmente |
| C05 | [Sesión 12](course/12-firebase-auth-y-rutas-privadas/changes.md) | Login/Registro, provider/useAuth, montaje, guardia, destino `unknown` validado con schema, probe 401/200, `ApiError`, cliente y `PrivateHeader` con logout. | Recorrido docente completo y temporales identificados; contraste cast/validación explicado; carga de 90 minutos revisada. | Implementada y validada documentalmente |
| C06 | [Sesión 13](course/13-taller-crear-listar-y-filtrar-biblioteca/changes.md) | Recuperar/verificar contrato de lista y simplificar constructor del body. Mostrar filtro → body → hook/key → fetcher → representación. Eliminar la constante base y construir un body directo. | `all` limita movie/series; no hay campos ni tipos implícitos; construcción y uso claros antes del taller. | Implementada y validada documentalmente |
| C07 | Petición transversal de [sesión 13](course/13-taller-crear-listar-y-filtrar-biblioteca/changes.md) | Completar un ajuste retrospectivo mínimo en 13 y las referencias finales de 14–16: imports, props, funciones, helpers, consumidores y checkpoints. Verificar 18–19 sin añadir implementación nueva. | Ninguna dependencia docente queda sin definición local o referencia exacta y disponible; no adelantar soluciones estudiantiles ni ampliar tiempos. | Implementada y validada documentalmente |
| C08 | [Sesión 12](course/12-firebase-auth-y-rutas-privadas/changes.md) | Se verificó Zod 4.5.4 y Mantine Form 9.4.1. `z.compile()` queda fuera del itinerario base; solo se reconsidera ante un hot path medido con evaluación de bundle, CSP y sync/async. | Decisión respaldada por versión, compatibilidad, prueba aislada y frontera de evidencia; no se atribuye mejora perceptible. | Implementada y validada documentalmente |

## Observaciones del barrido que deben conservarse

- 01, 04 y 09 tienen aprobación sin solicitudes concretas; 05 expresa conformidad sin otra corrección escrita. 06 combina aprobación general con solicitudes pendientes.
- 03, 14–16 y 18–19 tienen plantillas vacías; no equivalen a aprobación ni eximen de propagación.
- En 11, algunas definiciones quedaron en `session-draft.md`; en 13, `ListMediaLogsBody` y la base completa quedaron en la clase histórica 18. Mencionar un seed todavía no implementado no resuelve esas ausencias.
- El barrido comprobó que AHK publicado `2.11.0` incluye `ahk-test`. C08 volvió a verificar el 7 de septiembre que Zod `4.5.4` expone `z.compile`, ausente en `4.4.3`, y decidió conservar `4.4.3` sin compilación por falta de un caso medible.
- Comprobar especialmente la carga de 07, 12 y 13: más snippets no demuestran que todo pueda escribirse durante la sesión. Distinguir preparación, material entregado y construcción guiada.

## Diseño aprobado de C04 · implementado

Se implementó una **referencia docente completa con construcción guiada selectiva**. La guía docente muestra el contenido final de cada archivo, sus imports y al menos un consumidor real. Durante los 90 minutos, el grupo revisa o completa scaffolds preparados para las piezas mecánicas y construye en vivo el formulario y la conexión vertical. Así se elimina el código implícito sin fingir que ocho archivos pueden escribirse desde cero durante una clase virtual.

Mapa final:

```text
src/types/media-api.ts
└── CreateCatalogMediaLogBody

src/schemas/media-log.ts
└── mediaLogFormSchema → MediaLogFormValues

src/adapters/media-log-form-to-create-body.ts
└── toCreateMediaLogBody(identity, values)

src/stores/create-media-log-modal-store.ts
└── selection + openCreate + closeCreate

src/components/create-media-log-form.tsx
└── controls + submit + preparedBody

src/components/create-media-log-modal.tsx
└── store selectors + Modal + conditional form

src/layouts/public-layout.tsx
└── one CreateMediaLogModal beside Outlet

src/pages/search-page.tsx
src/pages/media-detail-page.tsx
└── two consumers of openCreate
```

La secuencia conserva `10 + 13 + 11 + 13 + 16 + 10 + 9 + 8 = 90`:

1. **0–10:** recuperar propietarios de estado y checkpoint de 10.
2. **10–23:** completar el store preparado y comprobar apertura/cierre con una identidad real.
3. **23–34:** completar el modal, montarlo en `PublicLayout` y conectar los dos puntos de apertura.
4. **34–47:** definir el body, el schema y el tipo inferido; ejecutar tres `safeParse` temporales.
5. **47–63:** construir en vivo el formulario completo, sus props, opciones, controles y submit.
6. **63–73:** conectar el adapter, el preview y el reinicio por desmontaje/key.
7. **73–82:** delegar únicamente el test del adapter y revisar la evidencia.
8. **82–90:** ejecutar matriz manual, prueba dirigida, build y comprobación de Network.

Cambios realizados:

- `teacher-guide.md`: snippets completos y autosuficientes, con ruta, imports, definición, consumidor y checkpoint; distingue explícitamente código preparado, código completado con el grupo y código escrito en vivo.
- `student-guide.md`: scaffolds y contratos suficientes para seguir la clase sin reconstruir símbolos omitidos; conserva fuera la clave docente y cualquier solución de taller.
- `session-draft.md`: registra el mapa de archivos, la estrategia de preparación y los estados inicial, guiado y final.
- `rules/class-guides.md` y `rules/session-production-workflow.md`: contienen la regla reutilizable de trazabilidad de símbolos nuevos.
- `draft/index.md`: revisado; la fila conserva tema y checkpoint correctos, por lo que no requirió cambio.
- `course/11-formularios-zod-y-modal-global/changes.md`: resolución C04 registrada después de la validación.

Alternativas descartadas: escribir todos los archivos desde cero excede la carga realista de 90 minutos; enlazar solamente la clase histórica 16 mantiene la dependencia externa y conserva su arquitectura antigua de modal local.

## Diseño aprobado de C05 · implementado

Se implementó una **referencia completa con un solo recorrido vertical construido en vivo**. La sesión conserva Firebase, Login/Registro, restauración, guardia, cliente autenticado, probe y logout, y distingue el material preparado del trabajo construido durante la clase.

Mapa final:

```text
.env.example                              nombres de configuración pública
src/firebase/firebase.ts                  app y Auth únicos
src/schemas/auth.ts                       formularios, sesión y destino
src/auth/auth-destination.ts              unknown → destino validado
src/pages/login-page.tsx                  formulario + sign in + retorno
src/pages/register-page.tsx               formulario + create user + retorno
src/auth/auth-provider.tsx                observer + proyección + parse + useAuth
src/main.tsx                               montaje del provider
src/layouts/private-layout.tsx             guardia + PrivateHeader + Outlet
src/pages/library-page.tsx                 destino privado observable
src/App.tsx                                rutas públicas y rama /app
src/api/http.ts                            ApiError + helpers público y privado
src/api/auth.ts                            fetchers del endpoint de comprobación
src/components/private-header.tsx          identidad + logout
src/components/auth-request-probe.tsx      instrumento temporal; se retira
```

Tratamiento docente aplicado:

- **Preparado para revisar/completar:** configuración, schemas ya aprobados en C03, estructura completa de Login/Registro, página placeholder, rutas y shell del probe.
- **Construido en vivo:** proyección `User → AuthUser`, `AuthProvider`, `useAuth`, cleanup, validación del destino y ramas de `PrivateLayout`.
- **Demostrado línea por línea:** `ApiError`, `requestJsonWithAuth`, los dos requests `401/200` y el montaje temporal del probe.
- **Completado con el grupo:** handlers de Login/Registro y logout, estados pending/error y composición final de `PrivateHeader`.
- **Delegado después de decidir:** únicamente la prueba pura de `toAuthDestination`.

La secuencia conserva los nueve bloques y los 90 minutos:

1. **0–8:** recuperar fronteras Zod/Firebase/backend.
2. **8–18:** verificar preflight e inicializar Firebase desde scaffold.
3. **18–29:** completar handlers en páginas preparadas y comparar Registro con Login.
4. **29–47:** construir `AuthProvider`, `useAuth`, montaje y restauración.
5. **47–59:** construir destino, rutas y guardia.
6. **59–70:** demostrar `ApiError`, helper autenticado, fetchers y probe temporal.
7. **70–78:** completar `PrivateHeader`, logout y composición en el layout.
8. **78–84:** generar y revisar solo la prueba de destino.
9. **84–90:** recorrer sesión, `401/200`, logout, build y retirar el probe.

Cambios realizados:

- `teacher-guide.md`: contiene las referencias completas, imports, consumidores y checkpoints; define el probe y su montaje temporal.
- `student-guide.md`: conserva scaffolds recuperables y las mismas referencias finales de provider, guardia, helpers y header, sin clave docente.
- `session-draft.md`: registra el inventario de archivos y separa preparación, construcción en vivo, demostración y eliminación del temporal.
- Sesión 13: declara los imports exactos con los que consume `useAuth`, `ApiError` y `requestJsonWithAuth` sin reconstruir esos contratos.
- `draft/index.md`: revisado; la fila ya describe Firebase, estado discriminado, guardia y cliente autenticado, por lo que no requirió cambios.
- `course/12-firebase-auth-y-rutas-privadas/changes.md`: resolución C05 registrada después de validar.

Alternativas: mover el cliente autenticado a la sesión 13 reduce la amplitud de 12, pero rompe el punto de entrada del taller siguiente; conservar los fragmentos actuales mantiene el problema reportado. La preparación selectiva preserva la progresión y hace creíble el tiempo disponible.

## Diseño aprobado de C06 · implementado

Se eliminó `BASE_LIBRARY_LIST_BODY`. La constante obligaba a copiar cuatro niveles de objetos para cambiar un único filtro y no tenía otro consumidor necesario en el itinerario actual. `toLibraryListBody` ahora construye el body final de forma directa y visible.

Contrato definido en `src/types/media-api.ts` antes de su primer uso:

```text
MatchMode
└── ValuesFilter<T>

MediaDate
└── MediaDateRange

ListMediaLogsBody
├── viewLogType: "list"
└── filters
    ├── query
    ├── status
    ├── priority
    ├── mediaType
    ├── releaseDateRange
    ├── genres
    └── tags

MediaLogListItemDto
└── subconjunto de la respuesta que consume la lista
```

El backend y las declaraciones generadas confirman esa forma para `POST /api/v2/media/list`; `order` es opcional y permanece fuera del alcance. Los DTOs externos conservan TypeScript según la frontera aprobada en C03.

El adapter tiene una estructura directa:

```text
LibraryTypeFilter
→ elegir [movie, series] o un único tipo
→ devolver { viewLogType, filters }
→ completar explícitamente todos los filtros no interactivos
```

No usa spreads anidados ni un helper genérico. `MEDIA_TYPE_VALUES` nace en 13 y la sesión 14 lo reutiliza, en vez de declararlo tarde.

Orden docente aplicado:

1. **40–51:** abrir el contrato completo, definir el schema del filtro y construir `toLibraryListBody`.
2. **51–63:** usar `toLibraryListBody("all")` en el fetcher, la key, el hook y la salida diagnóstica.
3. **63–70:** completar invalidación de listas y cleanup de logout.
4. **Taller:** reemplazar `"all"` por el estado validado del `Select` y completar la representación.

La duración total permanece en `75 + 30 + 60 + 15 = 180` minutos.

Cambios realizados:

- `session-draft.md`: registra el contrato, el orden de construcción y el mapa vertical completos.
- `teacher-guide.md`: define tipos, values, schema, adapter, fetcher, keys, hook y consumidores con archivos e imports antes de su uso; incluye el body directo y una referencia integrada de `LibraryPage`.
- `student-guide.md`: conserva los mismos contratos recuperables sin clave docente.
- `workshop-rubric.md` y prompt del agente: comprueban bodies completos e independencia entre llamadas, sin evaluar una constante base.
- `rules/course-architecture.md`: exige construir un body nuevo y completo de forma directa.
- sesión 14: hereda `MEDIA_TYPE_VALUES` desde 13.
- fuentes históricas 18/22: marcan el patrón anterior como antecedente que no debe copiarse al paquete vigente.
- `draft/index.md`: revisado; el tema, seed y checkpoint ya describen la progresión correcta, por lo que no requirió cambios.

Alternativas descartadas: conservar la base y ocultar el merge en un helper mantiene una abstracción sin necesidad visible; importar tipos generados de otro proyecto añade una infraestructura que este curso no ha introducido.

## Diseño de C07 · ejecución por tramos

El barrido confirmó ausencias concentradas en 14–16 y ninguna definición de aplicación nueva en 18–19. La corrección propuesta usa una referencia final completa junto a fragmentos guiados: cada archivo nuevo o sustancialmente modificado muestra imports, contrato y export completos; cada símbolo heredado conserva una referencia exacta a su definición previa.

Secuencia propuesta:

1. **C07-A:** completar en 13 las props y el traductor de error de creación que necesita el checkpoint; en 14, referenciar los DTOs de 07, cerrar key/fetcher/hook, implementar `SavedMediaDetails`, consolidar la página privada y añadir la acción de navegación a la fila.
2. **C07-B:** en 15, completar `MediaLogForm`, props de creación/edición, traductores, adapters, PUT, hook e integración del modal.
3. **C07-C:** en 16, mostrar la migración efectiva de create/update al helper, completar `DeleteMediaDialog`, propagar `onDelete` y consolidar la página.
4. **C07-E:** comprobar que 18 recibe el checkpoint regresionado y 19 recibe URL/evidencia, sin insertar código que esas sesiones no enseñan.

Los bloques completos reemplazarán fragmentos o se identificarán como referencia preparada. No se agregan minutos de live coding y se conservan las dificultades principales. La memoria [C07](memories/review-c07-sessions-14-19-symbol-traceability.md) contiene el inventario por sesión, las alternativas y la frontera de validación.

Estado de ejecución:

- **C07-A · implementada y validada documentalmente:** checkpoint remoto de creación en 13; contratos, key, fetcher, hook, presentación personal, página privada y navegación en 14.
- **C07-B · implementada y validada documentalmente:** sesión 15, formulario compartido, wrappers, traductores, adapters, PUT, hook e integración.
- **C07-C · implementada y validada documentalmente:** sesión 16, migración real de invalidaciones, diálogo completo, props de lectura y página integrada.
- **C07-E · implementada y validada documentalmente:** sesiones 18–19, herencia 16 → 18 → 19, enlaces, checkpoints, tiempos y evidencia verificados sin implementación nueva.
- **C07 cerrada:** los cuatro tramos cuentan con definición, consumo o referencia local verificable y la propagación termina en el cierre del curso.

## Diseño aprobado de C08 · `z.compile()` fuera del itinerario base

Zod `4.5.4` expone `z.compile()` como API pública y la copia compilada conserva la interfaz Standard Schema que consume Mantine Form `9.4.1`. La prueba aislada confirmó compatibilidad con schemas simples, refinements y transforms síncronos; un refinement asíncrono hizo fallback y produjo `ZodCompileAsyncError` bajo `strict`.

No se adopta en los formularios del curso: tienen dos o tres campos, los fallos necesitan el parser normal para producir errores, el compilador añade coste de bundle y generación dinámica de funciones, y no existe seed o benchmark de navegador que demuestre una mejora perceptible. El curso conserva `zod@4.4.3`, `parse`, `safeParse` y `schemaResolver`.

La decisión puede reabrirse fuera del itinerario base ante un hot path real, preferentemente validación repetitiva de lotes o payloads grandes en servidor. La medición deberá separar coste de compilación y ejecución, reutilizar el schema, incluir inputs válidos e inválidos y comprobar sync/async, CSP y bundle cuando corresponda.

## Protocolo de ejecución y evidencia

1. Leer las reglas obligatorias y el estado de este plan; revisar la aprobación ya registrada.
2. Abrir una memoria de la corrección, registrar reglas, origen, consumidores y límite con las sesiones vecinas antes de editar.
3. Aplicar el cambio en su primera definición y propagar por el paquete y las referencias operativas afectadas. Conservar comentarios originales e historia de decisiones.
4. Promover la convención aprobada a su regla temática. Sincronizar `draft/index.md` o registrar por qué no requiere cambios.
5. Validar enlaces, fences, tiempos, checkpoints, progresión y ausencia de referencias obsoletas. Revisar lecturas, claves y rúbricas si cambian sus contenidos. Comprobar que no se filtra una solución docente al taller estudiantil.
6. Registrar comandos/resultados y límites. Actualizar la resolución del comentario de origen y el estado aquí; reportar el siguiente paso.

Las tareas pendientes no bloquean una corrección independiente ya aprobada. Un hallazgo de otra tarea se registra allí sin ampliar silenciosamente la iteración actual.

## Registro de iteraciones

| Corrección | Memoria y evidencia | Resultado |
| --- | --- | --- |
| D01 | [Prop `data`](memories/review-d01-card-data-prop.md) | 02/03/06 y fuentes operativas corregidas; 25 usos y 10 contratos de tarjeta con `data`; sin referencias anteriores; tiempos 90/180/180; sin evidencia de runtime. |
| D02 | [Nombre del adapter](memories/review-d02-adapter-name.md) | Nombre corto propagado por 07/08 y fuente histórica; import del test corregido; cero referencias operativas anteriores. |
| D03 | [Hooks de Media](memories/review-d03-media-hooks.md) | Módulo por entidad y hooks por caso de uso propagados hasta 16; keys alineadas; sin infraestructura nueva de tests. |
| D04 | [Adopción de Mantine](memories/review-d04-mantine-progression.md) | Transición 06–08 explicada; HTML/CSS y componentes de dominio conservados; fallback docente y estudiantil idénticos. |
| D05 | [Opciones de formulario](memories/review-d05-form-options.md) | Opciones y consumo de `useForm` explicados en 11; referencias de reutilización añadidas en 12/15. |
| D06 | [Frontera del adapter](memories/review-d06-adapter-boundary.md) | Antes/después, consumo y cambio hipotético de API explicados en 10; nombres y prop alineados en 14. |
| C01 | [Onboarding de AHK](memories/review-c01-ahk-onboarding.md) | AHK 2.11.0, CLI global, init local, PATH, health y presentación propagados; `ahk-test` simplificado en 07 y 09–16; 90 minutos, enlaces y fences validados. |
| C02 | [Estado visual compartido](memories/review-c02-page-state.md) | `PageState` definido en 10 y reutilizado en 13/14; retry condicionado a `error`/`unavailable`; `EmptyState` y alertas parciales conservan sus responsabilidades. |
| C03 | [Zod como origen de tipos propios](memories/review-c03-zod-source-types.md) | Cadena schema → tipo → validación explícita en 11; Auth y destino en 12; filtro en 13; selector y ruta en 14; continuidad 15–16 y fuentes históricas 14/19/22 alineadas. |
| C04 | [Reconstrucción docente de la sesión 11](memories/review-c04-session-11-teacher-reconstruction.md) | Store, body, schema, adapter, form, modal y aperturas tienen referencia completa; scaffolds y construcción en vivo distinguidos; 90 minutos, links y fences validados. |
| C05 | [Reconstrucción docente de la sesión 12](memories/review-c05-session-12-teacher-reconstruction.md) | Login/Registro, provider, guardia, rutas, cliente, probe y logout tienen referencias completas; sesión 13 consume los contratos exactos; 90 minutos, links y fences validados. |
| C06 | [Contrato de lista y constructor del body](memories/review-c06-session-13-list-body.md) | Contrato real verificado; definición, builder directo, key, hook y consumidores completos; sesiones 13/14, regla, rúbrica y fuentes históricas sincronizadas. |
| C07 | [Trazabilidad de símbolos](memories/review-c07-sessions-14-19-symbol-traceability.md) | Definiciones y consumidores cerrados en 13–16; sesiones 18–19 reciben checkpoints y evidencia sin inventar implementación. |
| C08 | [Evaluación de `z.compile`](memories/review-c08-zod-compile.md) | Zod 4.5.4 y Mantine Form 9.4.1 verificados; compilación descartada del itinerario base; guías, tiempos y checkpoints permanecen sin cambios. |

## Validación de cierre de la fase directa

- 188 archivos Markdown revisados; 280 enlaces internos apuntan a rutas existentes.
- Ningún bloque fenced queda abierto y `git diff --check` termina sin errores.
- No quedan referencias operativas a los nombres anteriores del adapter, hooks o query keys.
- El fallback de `MediaSearchResults` es idéntico en las guías docente y estudiantil de 08.
- Los marcadores de tiempo de las guías no cambiaron frente al inicio de esta fase; 06, 08, 10 y 11 conservan 180, 90, 180 y 90 minutos.
- La comprobación es documental. No existe un proyecto semilla ejecutable en este repositorio, por lo que no acredita TypeScript, Vitest, navegador, Network ni comportamiento real de Mantine o Query.
