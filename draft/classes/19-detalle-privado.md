# Clase 19 · Detalle privado e identidades

- **Semana:** 7
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** biblioteca privada de la clase 18 y ruta provisional `/app/library/:logId`
- **Checkpoint de salida:** la biblioteca navega por `logId` hacia una página privada que combina catálogo y datos personales

## Resultado de aprendizaje

Al terminar, el estudiante podrá distinguir la identidad pública de una obra de la identidad de un registro personal, modelar ambas mediante una unión discriminada y consultar el detalle correcto sin duplicar fetchers, mezclar credenciales ni confundir sus query keys.

## Pregunta guía

> Si una película ya tiene `externalId`, ¿por qué la biblioteca necesita otro identificador para abrir su detalle?

La respuesta debe quedar observable en dos recorridos:

```text
/media/:mediaType/:externalId
        │ identidad de catálogo
        ▼
detalle público u opcionalmente enriquecido

/app/library/:logId
        │ identidad del registro personal
        ▼
detalle privado del usuario autenticado
```

Los dos recorridos consultan el mismo endpoint y reciben el mismo objeto raíz, pero no expresan la misma pregunta ni tienen el mismo requisito de autenticación.

## Progresión entre clases

| Clase | Aporta | No resuelve todavía |
| --- | --- | --- |
| 18 | Lista privada, `MediaLogListItemDto.id → model.logId` y ruta placeholder | No enlaza ni consulta un registro individual |
| **19** | Selector discriminado, detalle por `logId`, datos personales y navegación desde la lista | No abre ni envía un formulario de edición |
| 20 | Valores iniciales, formulario reutilizable y `PUT` pesimista | No vuelve a diseñar la lectura ni la identidad |

Esta clase termina con una pantalla de lectura. Un botón de edición puede aparecer después como punto de extensión, pero no se construye modal, schema, payload ni mutación de actualización.

## Conceptos de la clase

- Identidad de catálogo: `mediaType + externalId`.
- Identidad de registro personal: `logId`.
- Unión discriminada y narrowing mediante `kind`.
- Estados válidos frente a propiedades opcionales ambiguas.
- Query key formada por selector y `authScope`.
- Autenticación opcional para catálogo y obligatoria para log.
- Validación de `useParams` antes de construir un selector.
- DTO raíz con `catalog`, `entry` e `isLogged`.
- Adaptación separada de metadata de catálogo y datos personales.
- Manejo local y neutral de `401`, `404`, `entry: null` y `catalog: null`.
- Reutilización de `MediaDetailContent` y `MediaDocumentTitle`.

## Decisión central · Un selector, un fetcher y un hook

El endpoint admite dos formas válidas de consulta:

```text
GET /api/v2/media/detail?externalId=438631&mediaType=movie
GET /api/v2/media/detail?logId=cm...
```

`MediaType` nació antes de Zod. Cuando aparece su primer consumidor runtime, `src/types/media.ts` conserva el mismo dominio mediante values canónicos:

```ts
export const MEDIA_TYPE_VALUES = ["movie", "series"] as const
export type MediaType = (typeof MEDIA_TYPE_VALUES)[number]
```

El frontend representa ambas identidades en `src/schemas/media-detail.ts`:

```ts
import { z } from "zod/v4"

import { MEDIA_TYPE_VALUES } from "../types/media"

export const mediaDetailSelectorSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("catalog"),
    mediaType: z.enum(MEDIA_TYPE_VALUES),
    externalId: z.string().trim().min(1),
  }),
  z.object({
    kind: z.literal("log"),
    logId: z.string().trim().min(1),
  }),
])

export type MediaDetailSelector = z.infer<typeof mediaDetailSelectorSchema>
```

`kind` permite que TypeScript conozca qué campos existen en cada rama:

```ts
if (selector.kind === "catalog") {
  selector.externalId
  selector.mediaType
} else {
  selector.logId
}
```

No se usa esta forma:

```ts
type AmbiguousMediaDetailInput = {
  externalId?: string
  mediaType?: MediaType
  logId?: string
}
```

El objeto opcional permite estados sin identidad, con media type incompleto o con las dos identidades a la vez. La unión solo permite los dos estados que entiende el endpoint.

### Alternativas descartadas

| Alternativa | Problema en este proyecto |
| --- | --- |
| `useCatalogDetail` y `useLogDetail` completos | Duplican endpoint, respuesta, adaptación y estados de lectura |
| Un input con tres propiedades opcionales | Permite combinaciones inválidas y obliga a resolver precedencias |
| Guardar el DTO seleccionado en Zustand | Copia estado remoto y no resuelve la identidad navegable |

No se introduce Zustand. La URL ya conserva el `logId` y TanStack Query administra la respuesta. El store se reserva para un drawer que pueda abrirse desde ramas distantes en la etapa de mejoras.

## Contrato mínimo que llega a esta clase

La clase 07 ya propagó la rama personal en el primer tipo canónico:

```ts
export type UserMediaDataDto = {
  id: string
  title: string
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}

export type MediaDetailDto = {
  catalog: MediaCatalogDetailDto | null
  entry: UserMediaDataDto | null
  isLogged: boolean
}
```

El backend devuelve más campos. La pantalla tipa únicamente los que consume. `entry.id` es el mismo registro personal identificado por `logId`; `catalog.externalId` continúa identificando la obra en el catálogo.

| Rama | Qué representa | Nulabilidad relevante |
| --- | --- | --- |
| `catalog` | Metadata de la película o serie | Puede ser `null`; el contrato también admite entradas sin catálogo |
| `entry` | Status, prioridad y notas del usuario | Puede ser `null`; una pantalla privada debe representarlo sin assertion |
| `isLogged` | Si existe una entrada para la identidad consultada | Ayuda en el flujo público; no sustituye `entry` en la página privada |

El curso crea medios desde catálogo, por lo que el recorrido normal tendrá ambas ramas. Aun así, la interfaz conserva un fallback para `catalog: null` y no inventa metadata.

## Mapa de responsabilidades

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `MediaDetailSelector` | Expresar una identidad válida | No autentica ni solicita datos |
| `mediaKeys.detail` | Identificar selector y sesión de la respuesta | No decide headers |
| `getMediaDetail` | Construir parámetros y elegir helper HTTP | No representa loading o errores |
| `useMediaDetail` | Conectar selector, sesión, key y fetcher | No valida rutas ni copia el DTO |
| `PrivateMediaDetailPage` | Validar `logId` y componer estados | No llama `fetch` directamente |
| `toSavedMediaDetailsModel` | Preparar labels personales | No adapta el catálogo |
| `SavedMediaDetails` | Mostrar status, prioridad y notas | No consulta, edita ni conserva estado |
| `MediaDetailContent` | Mostrar metadata de catálogo | No conoce `entry` o `logId` |
| `MediaDocumentTitle` | Sincronizar el título del documento | No duplica el DTO ni navega |

## Guion de presentación

### Propósito y duración

La apertura conceptual dura 18 minutos. Recupera la biblioteca de la clase 18, hace visible la coexistencia de dos identidades y explica la unión discriminada antes de editar el hook. Los últimos 7 minutos vuelven al deck para reconstruir el flujo y delimitar la edición de la clase 20.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | La lista ya guarda un `logId` | Recuperar `DTO.id → adaptador → model.logId`. Hasta ahora el valor solo sirve como key de React. | Captura del checkpoint 18 y una fila señalada. Preguntar qué URL debería abrir. |
| Problema | Una obra y mi registro no son lo mismo | La obra tiene identidad de catálogo; el registro contiene decisiones personales. Dos usuarios pueden guardar la misma obra y obtener logs distintos. | Diagrama con un catálogo central y dos registros personales. |
| Contraste | Dos URLs hacen dos preguntas | `/media/movie/438631` pregunta por catálogo. `/app/library/cm...` pregunta por un registro del usuario actual. | Colorear `externalId` y `logId`; no describir `logId` como id de la película. |
| Contrato | Un endpoint acepta dos selectores | Mostrar las dos query strings y el mismo objeto raíz `{ catalog, entry, isLogged }`. El selector por log exige Bearer. | Request/response simplificados. No convertir la clase en explicación del backend. |
| TypeScript | El discriminante elimina estados imposibles | Comparar la unión con un objeto de propiedades opcionales. `kind` habilita narrowing y obliga a construir una rama completa. | Tres tarjetas inválidas tachadas y dos ramas válidas. |
| Caché | La identidad completa también vive en la key | La key incluye selector y `authScope`. Catálogo y log no deben compartir una entrada aunque apunten a la misma obra. | Árbol de keys con una rama `catalog` y otra `log`. |
| Seguridad | Scope de caché no es autenticación | `authScope` separa respuestas locales; Bearer permite consultar el registro. La rama `log` usa siempre `requestJsonWithAuth`. | Dos capas: “identificar caché” y “autorizar request”. |
| Router | `useParams` entrega texto externo | `logId` puede faltar o llegar vacío. La página deriva `MediaDetailSelector | null`, llama el hook y después representa la URL inválida. | Recuperar el contraste de orden de hooks de la clase 12. |
| Composición | Catálogo y entrada tienen componentes distintos | Se reutiliza `MediaDetailContent` para catálogo y se crea `SavedMediaDetails` para datos personales. La página compone ambas responsabilidades. | Dos bloques visuales unidos por la página, no por un DTO forzado. |
| Nulabilidad | Una respuesta exitosa también puede ser parcial | `entry: null` y `catalog: null` no son loading. Cada caso recibe un mensaje y solo se muestra la información disponible. | Matriz de estados; evitar `!` y valores inventados. |
| Frontera | Leer hoy, editar después | La clase termina mostrando status, prioridad y notas. La clase 20 extraerá campos compartidos, inicializará el formulario y enviará `PUT`. | Botón de edición atenuado como siguiente checkpoint. |

### Indicaciones que deben sobrevivir a la producción de slides

- `externalId` identifica una obra dentro de un `mediaType`; `logId` identifica el registro personal de una persona.
- Dos personas pueden compartir `mediaType + externalId` y tener distintos `logId`, status, prioridad y notas.
- `kind` no se envía al backend. Es un discriminante del frontend para construir un request válido.
- Una unión discriminada enseña estados válidos; propiedades opcionales trasladan combinaciones inválidas al runtime.
- La query key debe incluir el selector completo porque la query function lo consume.
- `authScope` continúa separando caché por sesión. No es secreto, no se envía como credencial y no reemplaza el Bearer.
- La rama `catalog` usa autenticación opcional para conservar `isLogged`; la rama `log` usa autenticación obligatoria.
- El mismo hook puede servir a ambas páginas porque recibe un selector explícito. No decide qué ruta está montada.
- El detalle público debe adaptarse a la firma nueva creando `{ kind: "catalog", ...detailInput }`; conserva `detailInput` para el body de creación.
- `useParams` puede entregar `undefined`. La página normaliza y valida antes de construir `{ kind: "log", logId }`.
- El hook se llama antes de cualquier retorno condicional. Un selector `null` mantiene la query deshabilitada.
- El fallback interno de una query deshabilitada nunca representa un log real y no debe ejecutar HTTP.
- `entry: null` no se arregla con `!`. La página muestra un estado de contrato y ofrece volver a la biblioteca.
- `catalog: null` no bloquea los datos personales disponibles. Se muestra un aviso neutral y luego status, prioridad y notas.
- Un `404` usa el mismo mensaje para un id inexistente o ajeno; la interfaz no revela cuál de los dos casos ocurrió.
- Un `401` se representa inline. No se fuerza logout porque una respuesta aislada no demuestra por sí sola que toda la sesión de Firebase deba destruirse.
- `MediaDetailContent` conserva su contrato visual y no recibe `entry` solo para evitar crear otro componente.
- `MediaDocumentTitle` recibe el título de catálogo o, si falta, el de la entrada. Su Effect no se duplica en la página.
- No se introduce formulario, `PUT`, drawer, Zustand ni cambio de backend.

### Snippets conceptuales para las slides

Estados válidos:

```ts
const result = mediaDetailSelectorSchema.safeParse({ kind: "log", logId })
```

Narrowing:

```ts
const params =
  selector.kind === "catalog"
    ? { externalId: selector.externalId, mediaType: selector.mediaType }
    : { logId: selector.logId }
```

Identidad de caché:

```ts
["media", "detail", { kind: "log", logId: "cm..." }, "firebase-uid"]
```

Los snippets muestran una decisión por slide. La implementación completa se construye en el editor.

### Cierre conceptual

El cierre responde estas preguntas:

1. ¿Qué identifica `externalId` y qué identifica `logId`?
2. ¿Qué combinaciones inválidas impide `kind`?
3. ¿Por qué la key necesita selector y `authScope`?
4. ¿Qué rama exige Bearer y cuál admite un request anónimo?
5. ¿Qué parte de la pantalla pertenece todavía a la clase 20?

## Estado inicial y transformación de archivos

El checkpoint 18 ya tiene la biblioteca, la ruta privada placeholder y la infraestructura de sesión. La clase modifica responsabilidades existentes y agrega solo la presentación personal:

```text
src/
├── adapters/
│   └── user-media-to-saved-details.ts    nuevo
├── api/
│   └── media.ts                          adapta getMediaDetail
├── components/
│   ├── library-media-list-item.tsx       añade Link
│   └── saved-media-details.tsx           nuevo
├── hooks/
│   ├── media-keys.ts                     key por selector
│   └── features/
│       └── use-media.ts                  hook unificado
├── pages/
│   ├── media-detail-page.tsx             adapta selector público
│   └── private-media-detail-page.tsx     reemplaza placeholder
├── types/
│   ├── media-api.ts                      añade selector; entry ya existe
│   └── saved-media-details.ts            nuevo
└── App.tsx                               conserva la ruta declarada
```

No se crea una segunda API, un store, un formulario o un cambio de backend.

## Flujo de construcción

### Estado 1 · Seguir ambas identidades antes de editar

El docente abre una fila de biblioteca y un resultado de búsqueda. El grupo completa esta tabla:

| Pantalla | Identidad disponible | Próxima ruta | Consulta |
| --- | --- | --- | --- |
| Resultado público | `mediaType + externalId` | `/media/:mediaType/:externalId` | Selector `catalog` |
| Fila guardada | `logId` | `/app/library/:logId` | Selector `log` |

La actividad evita una sustitución mecánica de nombres. `logId` no reemplaza a `externalId`; cada valor responde otra pregunta.

### Estado 2 · Añadir el selector y la key sin colisiones

`mediaKeys.detail` deja de recibir dos campos sueltos y recibe el selector completo:

```ts
export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (selector: MediaDetailSelector, authScope: string) =>
    [...mediaKeys.details(), selector, authScope] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  // search y libraryList conservan sus firmas del checkpoint 18
}
```

Dos consultas para la misma obra siguen siendo diferentes:

```text
["media", "detail", { kind: "catalog", mediaType: "movie", externalId: "438631" }, "uid-a"]
["media", "detail", { kind: "log", logId: "cm123" }, "uid-a"]
```

TanStack Query serializa keys de manera determinista, pero el grupo mantiene una forma estable y serializable. No coloca funciones, tokens ni el objeto Firebase `User` dentro de la key.

### Estado 3 · Elegir autenticación desde el selector

`src/api/media.ts` conserva un solo fetcher:

```ts
export function getMediaDetail(
  selector: MediaDetailSelector,
): Promise<MediaDetailDto> {
  const params = new URLSearchParams()

  if (selector.kind === "catalog") {
    params.set("externalId", selector.externalId)
    params.set("mediaType", selector.mediaType)
  } else {
    params.set("logId", selector.logId)
  }

  const url = `${API_URL}/api/v2/media/detail?${params.toString()}`

  return selector.kind === "log"
    ? requestJsonWithAuth<MediaDetailDto>(url)
    : requestJsonWithOptionalAuth<MediaDetailDto>(url)
}
```

La rama no pregunta “¿hay usuario?” para decidir si un log puede ser público. La intención `log` exige autenticación; si no hay sesión, el helper autenticado rechaza y el layout privado abandona esa pantalla.

### Estado 4 · Adaptar `useMediaDetail` sin romper el orden de hooks

El hook recibe `MediaDetailSelector | null`. El sentinel solo permite construir una key válida mientras `enabled` impide ejecutar la query:

```ts
const DISABLED_DETAIL_SELECTOR = mediaDetailSelectorSchema.parse({
  kind: "log",
  logId: "__disabled__",
})

export function useMediaDetail(selector: MediaDetailSelector | null) {
  const authState = useAuth()
  const authScope =
    authState.status === "authenticated"
      ? authState.user.uid
      : authState.status
  const querySelector = selector ?? DISABLED_DETAIL_SELECTOR
  const canQuery =
    selector !== null &&
    authState.status !== "checking" &&
    (selector.kind === "catalog" || authState.status === "authenticated")

  return useQuery({
    queryKey: mediaKeys.detail(querySelector, authScope),
    queryFn: () => getMediaDetail(querySelector),
    enabled: canQuery,
  })
}
```

El sentinel es un placeholder interno para la key, no la identidad de un recurso real. El schema garantiza su forma y, con `enabled: false`, `getMediaDetail` no se ejecuta. No se usa `selector!` para silenciar el caso nullable.

### Estado 5 · Mantener funcionando el detalle público

`MediaDetailPage` conserva el input validado que usa al crear un registro, pero deriva el nuevo selector para la lectura:

```ts
const detailInput: GetMediaDetailInput | null =
  (mediaType === "movie" || mediaType === "series") &&
  externalId !== undefined
    ? { mediaType, externalId }
    : null
const detailSelector: MediaDetailSelector | null =
  detailInput === null
    ? null
    : {
        kind: "catalog",
        mediaType: detailInput.mediaType,
        externalId: detailInput.externalId,
      }

const detailQuery = useMediaDetail(detailSelector)
```

`detailInput` continúa alimentando `toCreateMediaLogBody`; `detailSelector` identifica la lectura. La clase no fuerza al formulario a aceptar una unión que incluye `logId` cuando creación solo admite catálogo.

Antes de continuar, el grupo abre `/search`, navega a un detalle público y comprueba que no hubo regresión.

### Estado 6 · Validar `logId` y llamar el hook antes de retornar

La ruta ya existe desde la clase 14:

```tsx
<Route path="library/:logId" element={<PrivateMediaDetailPage />} />
```

La página deriva su selector mediante el adapter puro antes de representar estados:

```tsx
import { toLibraryLogDetailSelector } from "../adapters/library-log-param-to-detail-selector"

export function PrivateMediaDetailPage() {
  const { logId } = useParams<"logId">()
  const detailSelector = toLibraryLogDetailSelector(logId)

  const detailQuery = useMediaDetail(detailSelector)

  if (detailSelector === null) {
    return (
      <PageState
        variant="invalid"
        description="La URL no contiene un registro válido."
      />
    )
  }

  // loading, error y success continúan aquí
}
```

El adapter usa la misma frontera aprobada:

```ts
import {
  mediaDetailSelectorSchema,
  type MediaDetailSelector,
} from "../schemas/media-detail"

export function toLibraryLogDetailSelector(
  logId: string | undefined,
): MediaDetailSelector | null {
  const result = mediaDetailSelectorSchema.safeParse({ kind: "log", logId })

  return result.success ? result.data : null
}
```

`safeParse` rechaza `undefined`, vacío y espacios y devuelve un `logId` recortado cuando tiene éxito. Un cast solo cambiaría el tipo estático y no inspeccionaría la URL.

Aunque la ruta habitual no entrega un segmento vacío, `useParams` sigue siendo una frontera externa y su tipo admite ausencia. El hook permanece antes del retorno para conservar el mismo orden en cada render.

### Estado 7 · Adaptar la rama personal

`src/types/saved-media-details.ts` define una forma visual pequeña:

```ts
export type SavedMediaDetailsModel = {
  logId: string
  title: string
  statusLabel: string
  priorityLabel: string
  notes: string | null
}
```

`src/adapters/user-media-to-saved-details.ts` reutiliza las traducciones extraídas en la clase 18:

```ts
export function toSavedMediaDetailsModel(
  entry: UserMediaDataDto,
): SavedMediaDetailsModel {
  return {
    logId: entry.id,
    title: entry.title,
    statusLabel: MEDIA_STATUS_LABELS[entry.status],
    priorityLabel: MEDIA_PRIORITY_LABELS[entry.priority],
    notes: entry.notes,
  }
}
```

El adaptador no crea poster, descripción o fecha. Esos datos pertenecen a `catalog` y ya tienen `toMediaDetailModel`.

### Estado 8 · Construir `SavedMediaDetails`

El nuevo componente recibe un modelo y representa solamente datos personales:

```tsx
type SavedMediaDetailsProps = {
  details: SavedMediaDetailsModel
}

export function SavedMediaDetails({ details }: SavedMediaDetailsProps) {
  return (
    <Stack gap="sm">
      <Text><strong>Status:</strong> {details.statusLabel}</Text>
      <Text><strong>Prioridad:</strong> {details.priorityLabel}</Text>
      <Text style={{ whiteSpace: "pre-wrap" }}>
        <strong>Notas:</strong> {details.notes ?? "Sin notas"}
      </Text>
    </Stack>
  )
}
```

No recibe callbacks de edición. El componente será reutilizable por lectura y por la pantalla que rodee el formulario en la clase 20.

### Estado 9 · Componer todos los estados de la página

La página representa los casos en este orden:

1. Selector inválido.
2. Primera carga activa.
3. Error HTTP o de red.
4. Respuesta sin `entry`.
5. Éxito con datos personales y catálogo disponible o ausente.

La derivación ocurre durante el render:

Importa `PageState` desde `../components/page-state`. El `Alert` de esta página se conserva para el aviso parcial de catálogo.

```tsx
if (detailQuery.isLoading) {
  return (
    <PageState
      variant="loading"
      title="Cargando detalle"
      description="Espera mientras recuperamos tu registro."
    />
  )
}

if (detailQuery.isError) {
  return (
    <PageState
      variant="error"
      title="No pudimos cargar el detalle"
      description={getPrivateDetailErrorMessage(detailQuery.error)}
      onRetry={() => void detailQuery.refetch()}
    />
  )
}

if (detailQuery.data.entry === null) {
  return (
    <PageState
      variant="unavailable"
      title="Registro no disponible"
      description="No pudimos leer los datos guardados. Vuelve a tu biblioteca."
      onRetry={() => void detailQuery.refetch()}
    />
  )
}

const savedDetails = toSavedMediaDetailsModel(detailQuery.data.entry)
const catalogDetails = detailQuery.data.catalog
  ? toMediaDetailModel(detailQuery.data.catalog)
  : null
const documentTitle = catalogDetails?.title ?? savedDetails.title
```

La salida de éxito compone responsabilidades existentes:

```tsx
<Stack gap="xl">
  <MediaDocumentTitle title={documentTitle} />

  {catalogDetails === null ? (
    <Alert color="gray" title="Catálogo no disponible">
      Mostramos los datos personales conservados para este registro.
    </Alert>
  ) : (
    <MediaDetailContent media={catalogDetails} />
  )}

  <SavedMediaDetails details={savedDetails} />
  <Button component={Link} to="/app/library" variant="subtle">
    Volver a la biblioteca
  </Button>
</Stack>
```

`PageState` cubre estados completos y recibe `refetch` desde la página. Si falta catálogo, el título de `entry` mantiene contexto y el `Alert` parcial conserva visibles los datos personales. La interfaz no construye el flujo manual ni intenta enlazar datos por su cuenta.

### Estado 10 · Traducir errores sin destruir la sesión

Una función local `getPrivateDetailErrorMessage` puede usar `ApiError.status`; no necesita guardar otro estado ni convertirse todavía en un sistema global de errores:

```ts
function getPrivateDetailErrorMessage(error: Error): string {
  if (!(error instanceof ApiError)) {
    return "No pudimos cargar el detalle. Intenta nuevamente."
  }

  if (error.status === 401) {
    return "No pudimos autorizar esta consulta."
  }

  if (error.status === 404) {
    return "No encontramos ese registro en tu biblioteca."
  }

  return "No pudimos cargar el detalle. Intenta nuevamente."
}
```

| Caso | Mensaje visible | Acción |
| --- | --- | --- |
| `401` | “No pudimos autorizar esta consulta.” | Reintentar o volver a la biblioteca; no ejecutar logout automático |
| `404` | “No encontramos ese registro en tu biblioteca.” | Volver a la biblioteca |
| Red o `5xx` | “No pudimos cargar el detalle.” | Reintentar o volver |

El `404` no diferencia registro inexistente de registro ajeno. Esta neutralidad evita revelar si otro usuario posee un id determinado.

### Estado 11 · Convertir la fila en navegación

La fila ya recibe `item.logId`. Ahora su acción usa `Link`:

```tsx
<Button
  component={Link}
  to={`/app/library/${item.logId}`}
  variant="subtle"
>
  Ver detalle
</Button>
```

No se vuelve a consultar catálogo desde la fila ni se transporta el DTO mediante `location.state`. La URL conserva identidad; el servidor sigue siendo la fuente de verdad al abrir o recargar.

## Secuencia sugerida

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0-18 min | Docente y grupo | Recapitular la lista, contrastar identidades y presentar selector, autenticación y objeto raíz. |
| 18-32 min | Construcción interactiva | Añadir `mediaDetailSelectorSchema`, derivar `MediaDetailSelector`, comparar con propiedades opcionales y probar narrowing. |
| 32-47 min | Docente con participación | Refactorizar `mediaKeys.detail` para incluir selector y `authScope`; observar dos keys distintas. |
| 47-64 min | Docente y estudiantes | Adaptar `getMediaDetail` y `useMediaDetail`; explicar helper obligatorio, opcional y sentinel deshabilitado. |
| 64-80 min | Construcción guiada | Validar `logId`, crear `PrivateMediaDetailPage` y ordenar URL inválida, loading y error. |
| 80-95 min | Actividad estudiantil | Crear modelo, adaptador y `SavedMediaDetails` para status, prioridad y notas. |
| 95-105 min | Docente con participación | Componer `entry`, catálogo nullable, contenido reutilizado y `MediaDocumentTitle`. |
| 105-113 min | Actividad estudiantil | Convertir la acción de la biblioteca en `Link` y probar recarga directa. |
| 113-120 min | Docente y grupo | Probar errores, ejecutar build, volver al deck y delimitar la edición de la clase 20. |

La suma de los bloques es de 120 minutos.

## Actividades del docente

- Dibujar dos registros personales que apuntan a una misma identidad de catálogo.
- Pedir ejemplos de estados inválidos antes de mostrar la unión discriminada.
- Provocar una key ambigua sin `kind` y comparar sus entradas en Query Devtools.
- Señalar que `authScope` identifica una respuesta local mientras Bearer autoriza el request.
- Refactorizar primero el consumidor público y comprobarlo antes de construir la página privada.
- Recuperar la regla de orden de hooks de la clase 12 con el nuevo parámetro `logId`.
- Separar adaptación de catálogo y adaptación personal en el pizarrón.
- Forzar `catalog: null` con un fixture o respuesta interceptada solo para observar el fallback visual.
- Probar `404` sin explicar si el id era ajeno o inexistente.
- Rechazar formularios, mutaciones, `useEffect` de fetching, copias de DTO y cambios de backend.

## Actividades de los estudiantes

- Explicar con sus palabras qué identifica cada ruta.
- Convertir ejemplos válidos e inválidos al tipo `MediaDetailSelector`.
- Refactorizar la key y comprobar sus valores en Query Devtools.
- Completar las dos ramas de `getMediaDetail` sin duplicar el fetcher.
- Derivar el selector nullable desde `useParams` y conservar el orden de hooks.
- Crear el modelo y adaptador personal usando labels compartidos.
- Construir `SavedMediaDetails` sin mezclar metadata de catálogo.
- Conectar `MediaDetailContent` y `MediaDocumentTitle` ya existentes.
- Enlazar una fila y recargar directamente `/app/library/:logId`.
- Explicar por qué un `404` usa un mensaje neutral y por qué un `401` no fuerza logout.

## Verificación guiada

1. Sin sesión, abrir `/media/movie/<externalId>`: el detalle público continúa funcionando.
2. Iniciar sesión, guardar un medio y abrir “Ver biblioteca”.
3. Pulsar “Ver detalle” en una fila: la URL contiene `logId`, no `externalId`.
4. Inspeccionar Network: el request privado usa `?logId=...` y envía Bearer.
5. Inspeccionar Query Devtools: la key contiene `{ kind: "log", logId }` y el scope de la sesión.
6. Confirmar que la página muestra catálogo, status, prioridad y notas.
7. Guardar o usar un caso sin notas: la interfaz muestra “Sin notas”.
8. Probar el fixture de `catalog: null`: permanecen título y datos personales, sin metadata inventada.
9. Cambiar el `logId` por uno inexistente: aparece el mensaje neutral y no se filtra información.
10. Volver a la biblioteca, abrir otro registro y comprobar que cambia la key.
11. Cerrar sesión desde el flujo ya existente: la ruta privada deja de ser visible y la caché Media se retira según la clase 18.
12. Ejecutar `pnpm build` y corregir errores de tipos o imports.

## Evidencia de salida

- La búsqueda pública sigue navegando mediante `mediaType + externalId`.
- La biblioteca navega mediante `logId` y no transporta el DTO en state.
- `MediaDetailSelector` solo admite ramas completas de catálogo o log.
- `mediaKeys.detail` incluye selector y `authScope`.
- El selector de catálogo usa autenticación opcional; el selector de log usa autenticación obligatoria.
- El hook se llama antes de los retornos condicionales y no solicita datos con selector `null`.
- La página privada muestra status, prioridad y notas desde `entry`.
- El catálogo continúa pasando por `toMediaDetailModel` y `MediaDetailContent`.
- `catalog: null` y `entry: null` tienen salidas explícitas sin assertions.
- `MediaDocumentTitle` se reutiliza y restaura el título al abandonar la página.
- `401` y `404` se representan localmente; no hay logout automático ni distinción entre log ajeno e inexistente.
- No existe formulario de edición, mutación, Zustand, Effect de fetching o cambio del backend.

## Errores previsibles y preguntas de corrección

| Error observado | Pregunta docente | Corrección esperada |
| --- | --- | --- |
| El selector permite `logId` junto con `externalId`. | ¿Qué estados entiende realmente el endpoint? | Usar dos miembros discriminados completos. |
| Catálogo y log comparten una key. | ¿La key describe todas las variables del fetcher? | Incluir el selector con su `kind`. |
| La rama log usa optional auth. | ¿Este registro es público para una persona anónima? | Usar `requestJsonWithAuth` cuando `kind === "log"`. |
| `authScope` se envía como header de seguridad. | ¿Qué valor verifica el servidor? | Mantener scope en la key y Bearer en Authorization. |
| El hook está después de `if (!logId) return`. | ¿Se conserva el orden de hooks en todos los renders? | Derivar selector nullable, llamar hook y luego retornar. |
| Se usa `logId!`. | ¿Qué evidencia elimina la nulabilidad de `useParams`? | Normalizar y construir `MediaDetailSelector | null`. |
| La página copia `detailQuery.data` a `useState`. | ¿Quién ya conserva la respuesta remota? | Derivar modelos directamente desde la caché. |
| `MediaDetailContent` recibe `entry`. | ¿Ese componente representa catálogo o datos personales? | Crear `SavedMediaDetails` con responsabilidad propia. |
| `catalog: null` produce pantalla en blanco. | ¿La entrada personal sigue disponible? | Mostrar aviso y datos personales sin inventar catálogo. |
| Un `404` dice “este registro pertenece a otra persona”. | ¿El cliente puede demostrarlo sin filtrar existencia? | Usar el mismo mensaje neutral. |
| Un `401` ejecuta logout inmediato. | ¿Falló toda la sesión Firebase o un request concreto? | Representar el error local y dejar la decisión de sesión fuera del helper. |
| Aparece un modal de edición. | ¿Cuál es el checkpoint observable de esta clase? | Terminar la lectura y reservar formulario/PUT para la clase 20. |

## Fuera de alcance

- Modificar endpoints, middleware, CORS, jobs o configuración del backend.
- Construir el flujo de entradas manuales o linking.
- Precargar o enviar un formulario de edición.
- Implementar `PUT`, `DELETE`.
- Guardar el detalle en Zustand, Context, `localStorage` o un segundo `useState`.
- Solicitar datos dentro de `useEffect`.
- Navegar transportando el DTO completo mediante `location.state`.
- Añadir drawer, calendario, notificaciones globales o filtros de biblioteca.

## Vocabulario

- **Identidad de catálogo:** combinación `mediaType + externalId` que identifica una obra en la fuente externa.
- **Identidad de registro:** `logId` que identifica una entrada personal guardada.
- **Unión discriminada:** unión cuyos miembros tienen un campo literal común, como `kind`, que permite distinguirlos con seguridad.
- **Discriminante:** campo literal usado por TypeScript para hacer narrowing entre miembros de una unión.
- **Narrowing:** reducción de un tipo amplio a una rama más específica después de comprobar una condición.
- **Estado imposible:** combinación que el dominio no acepta y que el tipo debería impedir construir.
- **Valor centinela:** valor interno usado para completar una estructura mientras una operación permanece deshabilitada; no representa una entidad real.
- **Scope de caché:** valor que separa respuestas por contexto de sesión; no es una credencial.
- **Fallback:** representación alternativa cuando una parte nullable del contrato no está disponible.
- **Enumeración de recursos:** filtración de existencia o pertenencia causada por mensajes distintos para ids ajenos e inexistentes.

## Referencias para preparar la clase

- [React Router · `useParams`](https://reactrouter.com/api/hooks/useParams)
- [React Router · `Link`](https://reactrouter.com/api/components/Link)
- [TanStack Query · Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- Contrato docente de `GET /api/v2/media/detail` preparado antes de la cohorte.
- Checkpoints 18 y 20 para comprobar las fronteras de lista, lectura y edición.

Las referencias del backend sirven al docente para confirmar el contrato. Los estudiantes reciben la URL y trabajan exclusivamente en el frontend.
