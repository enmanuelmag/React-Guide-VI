# Guía docente · Sesión 14 · Detalle privado e identidades

## Continuidad del modelo visual

La rama `catalog` conserva la [frontera DTO → modelo → UI de 10](../10-taller-detalle-publico-y-effects/teacher-guide.md#qué-protege-esta-frontera). Reutiliza `mediaCatalogDetailToModel` para el contenido del catálogo; el selector de identidad y la entrada personal no obligan a acoplar ese componente al DTO completo.

La página reutiliza también `PageState`, definido por completo en el bloque “Contenido y estados con props” de la [sesión 10](../10-taller-detalle-publico-y-effects/teacher-guide.md). Conserva `Alert` para el fallo parcial de catálogo porque `entry` todavía aporta información útil.

## Contratos heredados disponibles

La definición canónica de `src/types/media-api.ts` está en el bloque **“Solución esperada de media-api.ts”** de la [sesión 07](../07-http-dtos-agentes-y-primer-test/teacher-guide.md). Esta sesión importa esos contratos y no los vuelve a declarar:

| Símbolo heredado | Forma relevante |
| --- | --- |
| `MediaCatalogDetailDto` | Metadata pública nullable y campos propios de película o serie. |
| `GetMediaDetailInput` | `mediaType + externalId` para la intención pública de catálogo. |
| `MediaType` | Dominio `movie | series`, ahora derivado de `MEDIA_TYPE_VALUES`. |
| `MediaStatus` | Unión derivada de `MEDIA_STATUS_VALUES`. |
| `MediaPriority` | Unión derivada de `MEDIA_PRIORITY_VALUES`. |
| `UserMediaDataDto` | `id`, `title`, `status`, `priority` y `notes`. |
| `MediaDetailDto` | `catalog`, `entry` e `isLogged`. |

Los consumidores usan `import type { MediaDetailDto, UserMediaDataDto } from "../types/media-api"` según el archivo. Si esas definiciones faltan en el seed, corrige el checkpoint de la sesión 07; no crees versiones locales.

## Archivo de hooks de esta sesión

Modifica `useMediaDetail` para aceptar el selector discriminado; conserva los demás hooks. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Objetivo

Guiar al grupo desde una biblioteca que ya conserva `logId` hasta una ruta privada recargable que consulta un registro personal, representa `entry` y conserva el detalle público sin regresiones.

La dificultad principal es modelar dos identidades válidas. La clase termina en lectura; no abras el formulario de edición.

## Preparación docente

1. Parte del checkpoint completo de la sesión 13.
2. Confirma que `PageState` permite `error` y `unavailable` con callback opcional.
3. Confirma que una película y una serie creadas por la persona aparecen en `/app/library`.
4. Conserva sus `logId` para las pruebas de navegación.
5. Comprueba que búsqueda y detalle público funcionan en estado anónimo y autenticado.
6. Verifica en `src/types/media-api.ts` las definiciones heredadas de `MediaCatalogDetailDto`, `UserMediaDataDto` y `MediaDetailDto`.
7. Prepara un fixture o respuesta controlada con `catalog: null` y `entry` válido. No necesitas crear una entrada manual durante la clase.
8. Prepara un `logId` inexistente para observar el `404` neutral.
9. Abre Query Devtools y Network antes de comenzar.
10. Confirma que `pnpm test -- library-log-param-to-detail-selector` y `pnpm build` son comandos válidos en el seed.
11. No instales dependencias nuevas.
12. No declares una segunda API de detalle, un store o un formulario.
13. Conserva un checkpoint docente de rescate con el selector, key, fetcher y hook ya adaptados. La actividad personal y el enlace deben permanecer sin resolver.

## Contrato docente verificado

El backend preparado expone:

```text
GET /api/v2/media/detail?externalId=<id>&mediaType=<movie|series>
GET /api/v2/media/detail?logId=<id>
```

La primera rama admite acceso anónimo y puede enriquecerse con Bearer. La segunda exige Bearer. Ambas devuelven el `MediaDetailDto` definido en la sesión 07:

```ts
type MediaDetailDto = {
  catalog: MediaCatalogDetailDto | null
  entry: UserMediaDataDto | null
  isLogged: boolean
}
```

El backend devuelve más campos. No amplíes el DTO mínimo para enseñar linking, entradas manuales o capacidades que la interfaz no consume.

## Clave de lectura

| Pregunta | Respuesta | Justificación breve |
| --- | --- | --- |
| 1 | B | `kind` usa valores literales distintos para separar las dos opciones. |
| 2 | Verdadero | Al comprobar `kind === "log"`, TypeScript sabe que esa opción contiene `logId`. |
| 3 | C | El objeto declara `kind: "log"`, pero entrega `externalId` en lugar del `logId` requerido. |
| 4 | B | React Router entrega los parámetros dinámicos como strings. |
| 5 | Verdadero | Los valores de la URL son entradas externas y deben validarse antes de entrar al dominio. |

Pide una justificación oral para las preguntas 2 y 5. No conviertas la revisión en una explicación completa de la solución.

## Mapa de responsabilidades

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `MediaDetailSelector` | Expresar una identidad válida | No autentica ni solicita datos |
| `mediaKeys.detail` | Identificar selector y sesión | No decide headers |
| `getMediaDetail` | Construir params y elegir helper HTTP | No representa estados visuales |
| `useMediaDetail` | Conectar selector, Auth, key y fetcher | No valida la ruta |
| `toLibraryLogDetailSelector` | Validar el parámetro externo | No ejecuta Router ni HTTP |
| `PrivateMediaDetailPage` | Clasificar estados, entregar retry a `PageState` y componer ramas del DTO | No copia la respuesta ni entrega Query al componente visual |
| `PageState` | Presentar invalidez, carga, error o ausencia desde props | No conoce Router, Query ni errores HTTP |
| `toSavedMediaDetailsModel` | Preparar labels personales | No adapta catálogo |
| `SavedMediaDetails` | Mostrar status, prioridad y notas | No consulta ni edita |
| `MediaDetailContent` | Mostrar catálogo | No conoce `entry` |
| `MediaDocumentTitle` | Sincronizar `document.title` | No vuelve a solicitar datos |

## 0–10 · Recuperar la necesidad

Abre una fila de biblioteca y un detalle público. Completa con el grupo:

| Pantalla | Identidad disponible | Pregunta |
| --- | --- | --- |
| Resultado público | `mediaType + externalId` | ¿Qué obra existe en catálogo? |
| Fila guardada | `logId` | ¿Qué guardó esta persona? |

Dibuja una sola obra conectada a dos registros personales. Cada registro puede tener status, prioridad y notas distintas.

Pregunta guía:

> Si la película ya tiene `externalId`, ¿por qué una fila de biblioteca necesita `logId`?

Respuesta esperada: el registro personal y la obra son entidades distintas. No aceptes “porque el backend lo pide” como explicación completa.

Checkpoint:

- el grupo identifica cuál id debe aparecer en cada URL;
- nadie propone guardar el DTO en Zustand o pasarlo por `location.state`.

## 10–22 · Construir estados válidos

Muestra primero el tipo ambiguo:

```ts
type AmbiguousMediaDetailInput = {
  mediaType?: MediaType
  externalId?: string
  logId?: string
}
```

Pide tres objetos problemáticos:

- `{}`;
- `{ mediaType: "movie" }`;
- `{ mediaType: "movie", externalId: "438631", logId: "cm123" }`.

`MediaType` nació en la sesión 02 y la sesión 13 ya reemplazó su unión directa por un arreglo canónico que conserva exactamente el mismo dominio. Confirma el checkpoint; no vuelvas a declararlo:

```ts
export const MEDIA_TYPE_VALUES = ["movie", "series"] as const
export type MediaType = (typeof MEDIA_TYPE_VALUES)[number]
```

Crea `src/schemas/media-detail.ts` reutilizando esos values:

```ts
import { z } from "zod/v4"

import { MEDIA_TYPE_VALUES } from "../types/media-item"

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

Desde este punto, `src/api/media.ts`, `src/hooks/media-keys.ts`, el hook y los adapters importan `MediaDetailSelector` desde `schemas/media-detail`. `src/types/media-api.ts` deja de declarar este tipo propio. El schema reutiliza los values de transporte y no crea otra lista de media types.

Demuestra narrowing sin añadir lógica del proyecto:

```ts
function describeSelector(selector: MediaDetailSelector) {
  if (selector.kind === "catalog") {
    return `${selector.mediaType}:${selector.externalId}`
  }

  return selector.logId
}
```

Verbaliza:

- `kind` pertenece al frontend y no se envía al servidor;
- cada rama contiene una identidad completa;
- TypeScript detecta accesos cruzados;
- la unión no afirma que ambas ramas tengan la misma autenticación.

Checkpoint: cada estudiante escribe un selector válido de cada rama y un objeto que TypeScript debe rechazar.

## 22–38 · Refactorizar key, fetcher y hook

### 22–27 · Key por selector y sesión

En `src/hooks/media-keys.ts`, parte del objeto completo definido en el bloque **“Conectar fetcher, key, hook y primer consumidor”** de la [sesión 13](../13-taller-crear-listar-y-filtrar-biblioteca/teacher-guide.md). Importa el selector desde el schema y sustituye la firma anterior. La referencia completa acumulada hasta esta sesión es:

```ts
import type { MediaDetailSelector } from "../schemas/media-detail"
import type {
  ListMediaLogsBody,
  SearchMediaInput,
} from "../types/media-api"

export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  search: (search: SearchMediaInput, authScope: string) =>
    [
      ...mediaKeys.searches(),
      {
        query: search.query.trim(),
        mediaType: search.mediaType,
        authScope,
      },
    ] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (selector: MediaDetailSelector, authScope: string) =>
    [...mediaKeys.details(), selector, authScope] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  libraryList: (body: ListMediaLogsBody, authScope: string) =>
    [...mediaKeys.lists(), { body, authScope }] as const,
}
```

Compara en el pizarrón:

```text
["media", "detail", { kind: "catalog", mediaType: "movie", externalId: "438631" }, "uid-a"]
["media", "detail", { kind: "log", logId: "cm123" }, "uid-a"]
```

La key contiene datos serializables. El `uid` identifica el scope local; el token no aparece.

### 27–32 · Un fetcher, dos intenciones

En `src/api/media.ts`, conserva `API_URL`, definido en ese archivo desde la sesión 07. Combina estos imports con los fetchers existentes y adapta `getMediaDetail`:

```ts
import type { MediaDetailSelector } from "../schemas/media-detail"
import type { MediaDetailDto } from "../types/media-api"
import {
  requestJsonWithAuth,
  requestJsonWithOptionalAuth,
} from "./http"

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

No preguntes si existe `auth.currentUser` para permitir una consulta de log anónima. La rama `log` expresa una intención privada y siempre usa el helper obligatorio.

### 32–38 · Hook nullable

En `src/hooks/features/use-media.ts`, conserva los demás hooks y combina estos imports con los existentes. Esta es la definición completa de la porción modificada:

```ts
import { useQuery } from "@tanstack/react-query"

import { getMediaDetail } from "../../api/media"
import { useAuth } from "../../auth/auth-provider"
import {
  mediaDetailSelectorSchema,
  type MediaDetailSelector,
} from "../../schemas/media-detail"
import { mediaKeys } from "../media-keys"

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

Aclara que el centinela es un placeholder interno para construir la key, no la identidad de un recurso real. El schema garantiza su forma y `enabled: false` impide el request. La clase no introduce `skipToken` porque el grupo ya conoce y puede explicar este patrón.

Checkpoint:

1. Devtools muestra keys diferentes para catálogo y log.
2. Ninguna key contiene credenciales.
3. La rama log no puede ejecutar mientras Auth está en `checking` o anónimo.

## 38–48 · Probar el consumidor público

No construyas todavía la página privada. Parte del bloque **“0–12 · Integrar el input real”** de la [sesión 10](../10-taller-detalle-publico-y-effects/teacher-guide.md), que define `params`, `toMediaDetailInput`, el hook y los estados de la página. Conserva esos imports y adapta la porción de identidad:

```ts
const detailInput = toMediaDetailInput(params)
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

Conserva `detailInput` para el body de creación. `CreateMediaLogForm` solo admite catálogo y no debe recibir una unión que incluya `logId`.

Prueba:

1. abre búsqueda sin sesión;
2. navega a un detalle;
3. inicia sesión y vuelve al mismo detalle;
4. abre el modal de creación sin enviar;
5. confirma que la identidad del body sigue siendo catálogo.

Si falla esta regresión, detén la ruta privada y corrige la firma compartida.

## 48–60 · Declarar ruta y validar el parámetro

Añade el import de página en `src/App.tsx` y declara la ruta dentro de la rama protegida:

```tsx
import { PrivateMediaDetailPage } from "./pages/private-media-detail-page"

<Route path="library/:logId" element={<PrivateMediaDetailPage />} />
```

La sesión 13 no anticipó esta ruta. Declárala ahora porque aparece su primer consumidor.

Construye el adapter puro y valida el parámetro externo con el schema:

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

`safeParse` rechaza `undefined`, vacío y espacios; cuando tiene éxito, `result.data.logId` ya está recortado. Un cast a `MediaDetailSelector` no haría ninguna de esas comprobaciones.

Importa `PageState` desde `../components/page-state` e integra el inicio de la página:

```tsx
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

  if (detailQuery.isLoading) {
    return (
      <PageState
        variant="loading"
        title="Cargando detalle"
        description="Espera mientras recuperamos tu registro."
      />
    )
  }

  // error y success siguen después
}
```

Usa `isLoading` para una primera carga activa. Una query deshabilitada puede estar `pending` con `fetchStatus: "idle"`; la URL inválida se decide con el selector nullable.

Checkpoint:

- el hook aparece antes de retornos condicionales;
- una URL válida produce `?logId=...` con Bearer;
- el valor no se copia a `useState`.

## 60–72 · Adaptar y componer `entry`

Define `src/types/saved-media-details.ts`:

```ts
export type SavedMediaDetailsModel = Readonly<{
  title: string
  statusLabel: string
  priorityLabel: string
  notes: string | null
}>
```

En `src/adapters/user-media-to-saved-details.ts`, adapta la rama personal usando las constantes compartidas:

```ts
import {
  MEDIA_PRIORITY_LABELS,
  MEDIA_STATUS_LABELS,
} from "../constants/media-log"
import type { UserMediaDataDto } from "../types/media-api"
import type { SavedMediaDetailsModel } from "../types/saved-media-details"

export function toSavedMediaDetailsModel(
  entry: UserMediaDataDto,
): SavedMediaDetailsModel {
  return {
    title: entry.title,
    statusLabel: MEDIA_STATUS_LABELS[entry.status],
    priorityLabel: MEDIA_PRIORITY_LABELS[entry.priority],
    notes: entry.notes,
  }
}
```

Crea `src/components/saved-media-details.tsx`. Esta es la referencia completa del componente de presentación:

```tsx
import { Stack, Text } from "@mantine/core"

import type { SavedMediaDetailsModel } from "../types/saved-media-details"

type SavedMediaDetailsProps = {
  details: SavedMediaDetailsModel
}

export function SavedMediaDetails({ details }: SavedMediaDetailsProps) {
  return (
    <Stack gap="sm">
      <Text>
        <strong>Status:</strong> {details.statusLabel}
      </Text>
      <Text>
        <strong>Prioridad:</strong> {details.priorityLabel}
      </Text>
      <Text style={{ whiteSpace: "pre-wrap" }}>
        <strong>Notas:</strong> {details.notes ?? "Sin notas"}
      </Text>
    </Stack>
  )
}
```

`SavedMediaDetails` muestra status, prioridad y notas. `whiteSpace: "pre-wrap"` conserva saltos de línea y `notes ?? "Sin notas"` cubre la nulabilidad sin inventar contenido.

Antes de usar el mensaje en la página, importa `ApiError` desde `../api/http` y define el helper local:

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

En la página, importa `mediaCatalogDetailToModel` desde `../adapters/media-catalog-detail-to-model`; conserva `model` como prop de `MediaDetailContent`, definido en 10. Después completa la página:

```tsx
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

if (!detailQuery.isSuccess) {
  return (
    <PageState
      variant="loading"
      title="Cargando detalle"
      description="Espera mientras recuperamos tu registro."
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
  ? mediaCatalogDetailToModel(detailQuery.data.catalog)
  : null
const documentTitle = catalogDetails?.title ?? savedDetails.title
```

La salida compone:

```tsx
<Stack gap="xl">
  <MediaDocumentTitle title={documentTitle} />

  {catalogDetails === null ? (
    <Alert color="gray" title="Catálogo no disponible">
      Mostramos los datos personales conservados para este registro.
    </Alert>
  ) : (
    <MediaDetailContent model={catalogDetails} />
  )}

  <SavedMediaDetails details={savedDetails} />
  <Button component={Link} to="/app/library" variant="subtle">
    Volver a la biblioteca
  </Button>
</Stack>
```

No sustituyas el `Alert` de catálogo por `PageState`: `entry` ya existe y `SavedMediaDetails` todavía contiene información útil. No inventes datos de catálogo. El recorrido normal del curso tendrá ambas ramas, pero el tipo conserva el caso nullable del contrato.

## 72–79 · Navegar y traducir errores

Añade la acción de navegación a `src/components/library-media-list-item.tsx`. La sesión 13 terminó explícitamente sin enlace, por lo que esta es una responsabilidad nueva. La referencia final del archivo es:

```tsx
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core"
import { Link } from "react-router"

import type { LibraryMediaListItemModel } from "../types/library-media-list-item"

interface LibraryMediaListItemProps {
  data: LibraryMediaListItemModel
}

export function LibraryMediaListItem({ data }: LibraryMediaListItemProps) {
  return (
    <Card component="article" withBorder>
      <Stack gap="xs">
        <Text fw={700}>{data.title}</Text>
        <Group gap="xs">
          <Badge variant="light">{data.mediaTypeLabel}</Badge>
          <Badge variant="light">{data.statusLabel}</Badge>
          <Badge variant="light">{data.priorityLabel}</Badge>
        </Group>
        <Text c="dimmed" size="sm">
          {data.releaseLabel}
        </Text>
        <Button
          component={Link}
          to={`/app/library/${data.logId}`}
          variant="subtle"
        >
          Ver detalle
        </Button>
      </Stack>
    </Card>
  )
}
```

No pases el DTO por state. Recargar la URL debe volver a consultar la fuente remota. El helper local ya definido conserva un `404` neutral; no lo describas como “registro de otra persona”.

La construcción por estados termina con esta referencia completa de `src/pages/private-media-detail-page.tsx`. Está disponible como checkpoint y no convierte todos sus imports y ramas en escritura desde cero:

```tsx
import { Alert, Button, Stack } from "@mantine/core"
import { Link, useParams } from "react-router"

import { mediaCatalogDetailToModel } from "../adapters/media-catalog-detail-to-model"
import { toLibraryLogDetailSelector } from "../adapters/library-log-param-to-detail-selector"
import { toSavedMediaDetailsModel } from "../adapters/user-media-to-saved-details"
import { ApiError } from "../api/http"
import { MediaDetailContent } from "../components/media-detail-content"
import { MediaDocumentTitle } from "../components/media-document-title"
import { PageState } from "../components/page-state"
import { SavedMediaDetails } from "../components/saved-media-details"
import { useMediaDetail } from "../hooks/features/use-media"

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

  if (!detailQuery.isSuccess) {
    return (
      <PageState
        variant="loading"
        title="Cargando detalle"
        description="Espera mientras recuperamos tu registro."
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
    ? mediaCatalogDetailToModel(detailQuery.data.catalog)
    : null
  const documentTitle = catalogDetails?.title ?? savedDetails.title

  return (
    <Stack gap="xl">
      <MediaDocumentTitle title={documentTitle} />

      {catalogDetails === null ? (
        <Alert color="gray" title="Catálogo no disponible">
          Mostramos los datos personales conservados para este registro.
        </Alert>
      ) : (
        <MediaDetailContent model={catalogDetails} />
      )}

      <SavedMediaDetails details={savedDetails} />
      <Button component={Link} to="/app/library" variant="subtle">
        Volver a la biblioteca
      </Button>
    </Stack>
  )
}
```

La rama `!detailQuery.isSuccess` presenta la primera espera y mantiene `data` definida después del guard. El retry sigue reservado para `error` y `unavailable`.

Comprueba:

- navegación desde dos filas;
- recarga directa;
- vuelta a biblioteca;
- `404` neutral;
- fixture `catalog: null`;
- logout con cleanup Media ya existente.

## 79–87 · Trabajo con agente

La persona ya debe haber escrito y explicado el adapter. Define con el grupo la matriz:

| Entrada | Salida |
| --- | --- |
| `undefined` | `null` |
| `""` | `null` |
| `"   "` | `null` |
| `" cm123 "` | `{ kind: "log", logId: "cm123" }` |

Prompt sugerido:

```text
Usa la skill ahk-test para crear y ejecutar tests Vitest del adapter puro
toLibraryLogDetailSelector con la matriz acordada.

Alcance único:
- src/adapters/__tests__/library-log-param-to-detail-selector.test.ts;
- soporte exclusivo dentro de src/adapters/__tests__/.

Producción, package.json, configuración, dependencias y otros tests permanecen
en solo lectura. No uses DOM, Router, Firebase, Query Client, mocks HTTP o
snapshots. Ejecuta pnpm test -- library-log-param-to-detail-selector y entrega
matriz, archivos, exit status y frontera de evidencia.
```

Después de recibir el cambio:

1. lee imports, descripciones, inputs y expectativas;
2. confirma que el test no reimplementa el adapter;
3. revisa `git diff --` sobre el archivo permitido;
4. ejecuta el test dirigido;
5. explica qué no demuestra.

Si el agente cambia producción o ubica soporte fuera de `__tests__/`, rechaza ese cambio y corrige el límite antes de ejecutar.

## 87–90 · Evidencia y cierre

Ejecuta:

```bash
pnpm test -- library-log-param-to-detail-selector
pnpm build
```

Registra códigos de salida completos. Después pide que una persona complete:

```text
Test puro demuestra:
Network demuestra:
Query Devtools demuestra:
Navegador demuestra:
Build demuestra:
Todavía no demostramos:
```

Respuesta esperada:

- test: transformación del parámetro;
- Network: query string y Bearer observados;
- Devtools: selector y scope en la key;
- navegador: navegación, recarga, estados y composición;
- build: tipado y empaquetado;
- pendiente: edición, PUT, eliminación, producción y otros usuarios reales.

Cierra señalando `entry` en la página. La sesión 15 convertirá ese DTO en initial values y extraerá el formulario compartido.

## Verificación guiada completa

1. Abre un detalle público sin sesión.
2. Confirma una key `catalog` con scope `anonymous`.
3. Inicia sesión y comprueba otra key para el mismo catálogo.
4. Abre la biblioteca y pulsa “Ver detalle”.
5. Confirma que la URL contiene `logId`, no `externalId`.
6. Confirma en Network `?logId=...` y Bearer.
7. Confirma en Devtools la rama `{ kind: "log", logId }` y el `uid`.
8. Observa catálogo, status, prioridad y notas.
9. Abre un registro sin notas y observa “Sin notas”.
10. Usa el fixture `catalog: null` y conserva datos personales.
11. Cambia el id por uno inexistente y observa el mensaje neutral.
12. Recarga la URL válida y confirma que vuelve a consultar.
13. Abre otro registro y confirma otra key.
14. Cierra sesión y confirma que la ruta privada deja de estar disponible.
15. Ejecuta test dirigido y build con código 0.

## Errores previsibles

| Error | Pregunta de corrección | Resultado esperado |
| --- | --- | --- |
| Selector con tres props opcionales | ¿Qué combinaciones entiende el endpoint? | Dos miembros discriminados completos |
| Catálogo y log comparten key | ¿Qué variable consume el fetcher? | Selector completo dentro de la key |
| Token dentro de la key | ¿La key identifica o autentica? | Scope en caché y Bearer en el request |
| Rama log usa optional auth | ¿El registro personal es público? | `requestJsonWithAuth` para `kind: "log"` |
| Se elimina `detailInput` público | ¿Qué identidad necesita creación? | Mantener input de catálogo para el form |
| Hook después de un retorno | ¿Se conserva el orden en cada render? | Selector nullable, hook y luego retorno |
| Se usa `logId!` | ¿Quién validó el parámetro externo? | Adapter que produce selector o `null` |
| Se usa `isPending` como spinner | ¿La query está fetching o solo pending? | `isLoading` para primera carga activa |
| DTO copiado a `useState` | ¿Quién conserva la respuesta remota? | Derivar modelos durante render |
| `MediaDetailContent` recibe `entry` | ¿Qué responsabilidad representa? | Componente personal separado |
| `catalog: null` deja pantalla vacía | ¿Sigue disponible `entry`? | Aviso y datos personales |
| `PageState` recibe `detailQuery` | ¿Qué contrato visual necesita realmente? | Pasar variante, copy y callback; conservar Query en la página |
| `404` revela pertenencia | ¿Puede el cliente demostrarla? | Mensaje neutral |
| `401` ejecuta logout | ¿Falló toda Firebase o una request? | Error inline sin destruir sesión |
| El agente crea fixture fuera de `__tests__` | ¿Ese soporte tiene otro consumidor? | Moverlo dentro de `__tests__` |
| Aparece botón y modal de edición | ¿Cuál es la dificultad de hoy? | Terminar lectura y reservar edición |

## Actividades opcionales

Solo si el checkpoint base y la evidencia están completos:

- mostrar un indicador discreto durante background refetch sin ocultar datos;
- comprobar manualmente caracteres especiales codificados en un parámetro.

No califiques estas mejoras ni permitas que sustituyan los casos base.

## Fuentes docentes

- [Zod 4 · Discriminated unions](https://zod.dev/api#discriminated-unions)
- [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [React Router 8.3.1 · `useParams`](https://reactrouter.com/api/hooks/useParams)
- [React Router 8.3.1 · `Link`](https://reactrouter.com/api/components/Link)
- [TanStack Query v5 · Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query v5 · Disabling Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)

La definición de `z.infer`, `z.discriminatedUnion`, `parse` y `safeParse` se verificó en la documentación oficial de Zod mediante Context7 el 5 de septiembre de 2026. El índice Mintlify no estuvo disponible durante esta corrección. Las demás referencias enlazan documentación oficial ya asociada al paquete.

## Fuera de alcance docente

- Formulario compartido, initial values o modal de edición.
- `PUT`, `DELETE`, invalidación de update.
- Linking de entradas manuales.
- Un segundo hook completo de detalle.
- Zustand, storage o transporte del DTO por navigation state.
- Loaders, actions, Data Mode o fetching mediante Effect.
- Cambios en `medialog-server`.
