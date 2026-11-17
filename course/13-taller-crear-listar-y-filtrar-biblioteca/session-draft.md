# Sesión 13 · Taller de crear, listar y filtrar biblioteca

> Estado: paquete textual y presentación de 19 diapositivas aprobados. Proyecto progresivo 13 implementado; guía docente detallada alineada y disponible para revisión. La evidencia ejecutada y sus límites están en la memoria de la iteración.

- **Fecha:** sábado 24 de octubre de 2026
- **Semana:** 5
- **Modalidad:** presencial
- **Duración:** 180 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Taller y rúbrica:** [workshop-rubric.md](workshop-rubric.md)
- **Seed propuesto:** `s05-c13-create-list-filter-seed`

## Archivo de hooks de esta sesión

Añade `useCreateMediaLog` y `useMediaLibrary`; conserva los hooks de búsqueda y detalle y amplía sus condiciones de sesión. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 12 y recupera el formulario local de la sesión 11:

- Firebase Auth restaura una sesión mediante `checking`, `anonymous` o `authenticated`.
- `PrivateLayout` protege `/app/library`, que todavía muestra un placeholder.
- `requestJson<T>` y `requestJsonWithAuth<T>` representan requests públicos y privados.
- `ApiError` conserva el status HTTP.
- `PrivateHeader` ejecuta `signOut(auth)`, pero todavía no limpia Query Client.
- Búsqueda y detalle usan TanStack Query y responden con `isLogged`, pero sus requests siguen siendo anónimos.
- `PageState` existe desde la sesión 10 para estados completos de página y `EmptyState` desde la sesión 03 para colecciones válidas sin elementos.
- `CreateMediaLogForm` produce un `CreateCatalogMediaLogBody` válido y solo muestra un preview local.
- Vitest ya funciona en entorno Node y todos los tests viven dentro de `__tests__/`.

La rama session-13-start añade únicamente los contratos extensos que no constituyen el concepto principal del taller:

- `MediaLogListItemDto` con el subconjunto que consumirá la lista y su `id` remoto;
- `ListMediaLogsBody` con todos los filtros que envía el cliente;
- `MEDIA_TYPE_VALUES`, que conserva el dominio del curso en `movie` y `series`.

No incluye optional auth, `authScope`, mutación, query privada, modelo visual, filtro interactivo, invalidación de listas o limpieza de caché.

## Limitación visible

El proyecto conoce la intención de guardar, pero todavía no existe un registro remoto ni una biblioteca consultada:

```text
formulario
→ body válido
→ preview local
→ fin

/app/library
→ placeholder
```

Al conectar la escritura aparece otra limitación: búsqueda y detalle contienen `isLogged`. Un refetch anónimo no puede calcular ese valor para la persona autenticada.

```text
sesión autenticada
→ POST create con Bearer
→ invalidar detalle
→ refetch anónimo
→ isLogged continúa sin identidad
```

La sesión corrige primero la identidad de esas lecturas. Después conecta creación, lista privada, filtro y limpieza de caché.

## Resultado de aprendizaje

El estudiante conectará una mutación autenticada con las lecturas que deja obsoletas, construirá la primera query privada de la aplicación y aplicará un filtro local por tipo que modifica el body remoto sin duplicar la respuesta en estado local.

## Checkpoint de salida

Al terminar:

- `requestJsonWithOptionalAuth<T>` delega en los helpers existentes.
- Búsqueda y detalle incluyen `authScope` en sus keys y esperan que Auth salga de `checking`.
- `createMediaLog` envía el body validado mediante `POST /api/v2/media/create`.
- `useCreateMediaLog` representa pending, error y éxito mediante `useMutation`.
- `CreateMediaLogFormProps` define `identity`, `onCreated` y `onCancel`; el modal consume los tres valores.
- `getCreateMediaLogErrorMessage` traduce localmente `401`, `404`, `409` y fallback antes de su uso.
- El formulario remoto conserva una referencia final con imports, props, helper, mutación, controles y callbacks; bloquea doble submit, conserva values ante error y cierra después de invalidar.
- `CREATE_MEDIA_LOG_INVALIDATION_KEYS()` incluye búsquedas, detalles y listas.
- `/app/library` ejecuta `POST /api/v2/media/list` con Bearer.
- La key privada contiene body serializable y `authScope`.
- La página diferencia carga, error, vacío y éxito.
- Carga y error reutilizan `PageState` de la sesión 10; una biblioteca vacía conserva `EmptyState` porque la consulta sí produjo una colección válida.
- Un adapter convierte `MediaLogListItemDto.id` en `LibraryMediaListItemModel.logId` y prepara labels y fecha.
- La lista conserva el orden entregado por `viewLogType: "list"`.
- `LibraryPage` conserva `all | movie | series` en `useState` y deriva el body mediante `toLibraryListBody`.
- `all` envía `movie` y `series`; nunca amplía el dominio a anime.
- Logout espera `signOut`, elimina `mediaKeys.all` y navega a Login.
- El test dirigido del adapter y `pnpm build` terminan con código 0 en el seed ejecutable.

El test solo demuestra la transformación pura. Network y Query Devtools demuestran el request y la caché observados. El build demuestra tipado y empaquetado, no autenticación, backend o comportamiento visual.

## Concepto principal

La sesión sigue una escritura hasta todas sus consecuencias conocidas:

```text
CreateMediaLogForm
  → mutate(body)
  → createMediaLog
  → POST autenticado
  → 201
  → invalidate searches + details + lists
  → refetch de consumidores activos
  → onCreated
  → cerrar el modal
```

La biblioteca agrega un segundo recorrido:

```text
LibraryPage
  → filtro local
  → toLibraryListBody
  → useMediaLibrary(body)
  → key(body, authScope)
  → POST privado
  → DTO[]
  → adapter
  → modelos visuales
  → lista
```

## Vocabulario

- **Mutación:** operación iniciada por una acción que cambia estado remoto.
- **Variable de mutación:** objeto entregado a `mutate` y recibido por `mutationFn`.
- **Autenticación opcional:** request público que añade Bearer cuando existe una sesión.
- **Auth scope:** valor de una query key que separa respuestas por sesión; no es una credencial.
- **Invalidación:** marca queries como stale y puede refetchear las que tienen consumidores activos.
- **Eliminación de caché:** retira queries coincidentes mediante `removeQueries`.
- **Query activa:** query con al menos un consumidor montado.
- **Query inactiva:** dato conservado en caché sin un consumidor montado.
- **Filtro de servidor:** restricción enviada en el request para que el backend produzca la respuesta.
- **Modelo visual:** forma derivada para los componentes; no reemplaza el DTO como fuente remota.
- **`logId`:** identidad del registro personal, distinta de `mediaType + externalId`.

## Decisiones técnicas

### Autenticación opcional y scope

`requestJsonWithOptionalAuth<T>` usa `requestJson<T>` sin usuario y `requestJsonWithAuth<T>` cuando Firebase tiene una sesión. No vuelve a implementar `getIdToken`, Bearer o errores HTTP.

Las keys concretas de búsqueda y detalle incluyen:

```ts
const authScope =
  authState.status === "authenticated"
    ? authState.user.uid
    : authState.status
```

Durante `checking`, las queries permanecen deshabilitadas. `authScope` identifica caché; `Authorization` autentica el request.

### Mutación pesimista

El formulario entrega el body construido al hook:

```ts
createMutation.mutate(body, { onSuccess: onCreated })
```

`isPending` administra loading y bloqueo. Un error mantiene el formulario abierto. La interfaz espera `201` y las invalidaciones antes de mostrar el resultado confirmado.

### Invalidaciones explícitas

La primera mutación conserva visible el conjunto de lecturas afectadas:

```ts
export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
  mediaKeys.lists(),
]
```

`onSuccess` espera `Promise.all`. No se crea un helper genérico antes de que edición y eliminación repitan el patrón.

### Lista privada

La aplicación sigue el contrato docente:

```text
POST /api/v2/media/list
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

`viewLogType: "list"` conserva el orden ascendente por fecha de lanzamiento que entrega el backend. Aunque el contrato actual admite un campo `order` opcional para otras vistas, esta sesión no lo envía ni introduce ordenamiento configurable.

`ListMediaLogsBody` se define por completo antes de su primer uso. Incluye `query`, `status`, `priority`, `mediaType`, `releaseDateRange`, `genres` y `tags`. El adapter construye ese objeto directamente; no depende de una constante base ni de merges implícitos.

La respuesta real contiene más campos. `MediaLogListItemDto` conserva solo los consumidos por la lista:

- `id`;
- `mediaType`;
- `title`;
- fecha separada;
- `status`;
- `priority`.

El adapter cambia `id` a `logId`. La sesión 14 usará esa identidad para navegar; la sesión 13 solo la usa como key estable.

### Filtro básico

`src/schemas/library-filter.ts` define el conjunto cerrado y deriva su tipo:

```ts
import { z } from "zod/v4"

import { MEDIA_TYPE_VALUES } from "../types/media-item"

export const libraryTypeFilterSchema = z.enum(["all", ...MEDIA_TYPE_VALUES])

export type LibraryTypeFilter = z.infer<typeof libraryTypeFilterSchema>
```

`LibraryPage` conserva un solo `LibraryTypeFilter`. El `Select` entrega `string | null`; su handler ejecuta `safeParse` y solo actualiza el estado cuando el value pertenece al conjunto permitido. Así el schema es la fuente del tipo y también valida la frontera del control.

`toLibraryListBody` crea el body completo y estructuras nuevas en cada llamada:

| Filtro | `mediaType.values` |
| --- | --- |
| `all` | `["movie", "series"]` |
| `movie` | `["movie"]` |
| `series` | `["series"]` |

Status y prioridad permanecen vacíos. La página no usa URL, Zustand, Effect, `.filter()` o `.sort()`.

### Logout

Después de un `signOut` exitoso:

```ts
queryClient.removeQueries({ queryKey: mediaKeys.all })
```

Si Firebase rechaza el logout, la sesión y la caché permanecen disponibles para reintentar. La aplicación no usa `queryClient.clear()`.

## Secuencia · 180 minutos

| Bloque | Minutos | Responsable y medio | Resultado |
| --- | --- | --- | --- |
| S13-B01 | 0–18 | Docente · presentación continua y predicciones orales | Leer/escribir, sesión, caché y encargo explicados. |
| S13-B02 | 18–22 | Docente · soporte después de las slides | Contratos y entrada comprobados. |
| S13-B03 | 22–31 | Docente y grupo · editor | Optional auth y caché por sesión. |
| S13-B04 | 31–47 | Docente y grupo · editor/Network | Crear, errores y espera del refetch. |
| S13-B05 | 47–60 | Docente y grupo · editor | Body y primera query privada diagnóstica. |
| S13-B06 | 60–68 | Práctica guiada · editor | Invalidación de listas y limpieza al salir. |
| S13-B07 | 68–75 | Docente · código visible y consigna | Predecir modelo, estados y filtro; fijar encargo. |
| Descanso | 75–105 | Todos | 30 minutos. |
| S13-B08 | 105–120 | Estudiantes · taller | Modelo, adapter y labels compartidos. |
| S13-B09 | 120–132 | Estudiantes · taller | Filas, lista y cuatro estados. |
| S13-B10 | 132–143 | Estudiantes · taller | Filtro local validado y consulta remota. |
| S13-B11 | 143–152 | Estudiantes y agente limitado | Matriz, lectura y test del body. |
| S13-B12 | 152–165 | Estudiantes · comprobación | Recorrido, test, lint y build. |
| S13-B13 | 165–180 | Docente y grupo · cierre oral | Demostración, explicación y punto para retomar. |

**Suma:** 18 + 57 de coding/consigna + 30 + 60 + 15 = 180 minutos. Los archivos mecánicos se entregan como soporte dentro de cada paso; no se pretende teclear todos desde cero. El tiempo es un presupuesto pendiente de medición en aula. No se resta tiempo al descanso o al taller si el grupo se retrasa: registra el punto exacto y retoma allí.

Los conceptos y el encargo se explican antes del descanso. Las filas, estados y control se implementan durante el taller; el respaldo `session-13-workshop-start` conserva el diagnóstico sin esa solución.

## Guion de presentación

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Apertura | El body todavía no guarda | Recuperar `values → schema → body`; el preview no cambia el servidor. | Comparar preview con Network sin POST. |
| Distinción | Leer y escribir tienen ciclos distintos | Query responde a una necesidad de datos; mutación responde a una acción y cambia estado remoto. | Dos carriles y cuatro estados de mutación. |
| Sesión | Público puede depender del usuario | Búsqueda y detalle admiten anónimo, pero `isLogged` cambia con una identidad. | Mismo recurso con respuesta anónima y autenticada. |
| Caché | Scope identifica; Bearer autentica | `authScope` separa respuestas; el token viaja solo en el request. | Árbol de keys sin mostrar credenciales. |
| Consistencia | Crear vuelve obsoletas tres familias | Búsqueda, detalle y biblioteca pueden contener información anterior. | Árbol `searches`, `details`, `lists`. |
| Espera | El éxito visual llega después de la coherencia | La promesa de invalidación mantiene `isPending` hasta completar los refetch activos. | Timeline `201 → invalidate → refetch → close`. |
| Biblioteca | Una lectura privada también necesita identidad | Body y `uid` forman la key; Bearer autoriza. | Comparar dos usuarios con el mismo body. |
| Contrato | Orden y filtro son decisiones distintas | `viewLogType` determina el orden; `filters.mediaType` restringe resultados. | Body anotado; `order` fuera del alcance. |
| Modelo | `id` remoto se vuelve `logId` visual | La fila representa un registro personal, no una obra del catálogo. | Flecha DTO → adapter → model. |
| Filtro | Todos significa el dominio del curso | `all` envía movie y series; el endpoint Bootcamp exige tipos permitidos no vacíos. | Diagrama de conjuntos. |
| Privacidad | Crear invalida; logout elimina | La sesión continúa después de crear; termina después de logout. | Tabla `invalidateQueries` frente a `removeQueries`. |
| Agente | La persona define el oráculo | El grupo decide los casos; el agente redacta solo el test dentro de `__tests__/`. | Caja con objetivo, límites, lectura y evidencia. |
| Cierre | Tenemos registros; falta abrir uno | `logId` ya existe como identidad estable, pero todavía no tiene ruta conectada. | Fila con acción futura atenuada. |

Preguntas de cierre:

1. ¿Por qué invalidar el detalle no basta si el refetch continúa anónimo?
2. ¿Qué variables debe incluir la key de biblioteca?
3. ¿Por qué `all` no puede convertirse en un arreglo vacío de tipos?
4. ¿Por qué crear invalida mientras logout elimina?
5. ¿Qué identidad necesita la próxima ruta privada?

## Proyecto semilla

### Incluye

- Checkpoint completo de la sesión 12.
- `PageState` y `EmptyState` disponibles para componer estados sin duplicar presentación.
- Formulario local y body de la sesión 11.
- `MediaLogListItemDto`, `ListMediaLogsBody` y `MEDIA_TYPE_VALUES` verificados.
- Ruta protegida `/app/library` con placeholder.
- Vitest y scripts existentes.
- Tests previos y su soporte dentro de `__tests__/`.

### No incluye

- `requestJsonWithOptionalAuth` o `authScope`.
- `createMediaLog` o `useCreateMediaLog`.
- `mediaKeys.lists()`, `getMediaLibrary` o `useMediaLibrary`.
- Modelo, adapter o componentes de biblioteca.
- Filtro interactivo o `toLibraryListBody`.
- Invalidación de listas o cleanup de caché.
- Tests del taller.

### Checkpoint docente de rescate

Si el bloque guiado se retrasa, el docente comparte una versión con optional auth, mutación, query privada, adapter de body, invalidación y logout terminados. Conserva fuera del checkpoint:

- modelo y adapter visual;
- componentes y composición de los cuatro estados con `PageState`/`EmptyState`;
- control de filtro;
- suite del adapter;
- recorrido final.

## Trabajo con agente

La persona define e implementa `toLibraryListBody` y acuerda cinco comportamientos:

1. `all` produce `movie` y `series`.
2. `movie` produce solo `movie`.
3. `series` produce solo `series`.
4. Ninguna salida contiene anime.
5. Dos llamadas producen bodies y arrays independientes y conservan vacíos los filtros no interactivos.

El agente solo puede crear:

```text
src/adapters/__tests__/library-type-filter-to-list-body.test.ts
```

Todo fixture, builder o helper exclusivo debe quedar dentro de `src/adapters/__tests__/`. La invocación de `ahk-test` prohíbe modificar producción, configuración, dependencias u otros tests. El estudiante lee el archivo, revisa el diff, ejecuta la prueba y explica qué no cubre.

## Taller y evaluación

La [rúbrica](workshop-rubric.md) evalúa:

- creación autenticada y estados;
- query privada, estados, modelo e identidad;
- filtro por tipo y contrato remoto;
- invalidación y limpieza de caché;
- tests, build, recorrido y explicación.

La base suma 100 puntos. Dos mejoras ya conocidas permiten hasta 10 puntos extra: contador derivado e indicador de `isFetching` con datos visibles.

## Fuera de alcance

- Filtros de status, prioridad, texto, fechas, géneros o tags.
- Search params o filtros persistidos en URL.
- `keepPreviousData` como requisito.
- Navegación a `/app/library/:logId`.
- Detalle privado, edición, eliminación.
- Orden configurable o `.sort()` local.
- Copiar DTOs a React, Zustand o storage.
- Effects para fetching, filtro, cierre o invalidación.
- Interceptores, retry global o logout automático ante `401`.
- React Testing Library, jsdom, MSW o pruebas de componentes.
- Cambios en `medialog-server`.

## Cambios retrospectivos

- `draft/index.md` debe describir el seed como checkpoint 12 con contratos preparados; la mutación se construye antes del descanso.
- Las sesiones 11 y 12 no requieren cambios.
- `rules/course-architecture.md`, `rules/code-and-naming.md` y `rules/agent-assisted-development.md` ya contienen las decisiones reutilizables; no necesitan otra edición.

## Referencias ejecutables y alineación

Entrada `session-13-start` desde `session-12-end`, ocho pasos y `session-13-end`. La guía detallada muestra cada archivo completo por transformación, después de las 19 slides continuas. El bloque guiado termina en `session-13-workshop-start`; el cierre conserva logId sin navegación privada. Consulta [el plan progresivo](../../progressive-project-plan.md) para orden y evidencia.
