# Guía estudiantil · Sesión 14 · Detalle privado e identidades

## Contratos heredados

Reutiliza `MediaCatalogDetailDto`, `GetMediaDetailInput`, `MediaType`, `MediaStatus`, `MediaPriority`, `UserMediaDataDto` y `MediaDetailDto` desde el checkpoint. Se construyeron en la [sesión 07](../07-http-dtos-agentes-y-primer-test/student-guide.md); `MEDIA_TYPE_VALUES` reemplazó después la unión directa sin ampliar su dominio. Esta sesión los importa y no crea versiones locales.

`MediaDetailDto` conserva esta raíz:

```ts
type MediaDetailDto = {
  catalog: MediaCatalogDetailDto | null
  entry: UserMediaDataDto | null
  isLogged: boolean
}
```

## Archivo de hooks de esta sesión

Modifica `useMediaDetail` para aceptar el selector discriminado; conserva los demás hooks. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Objetivo

Conectar una fila de biblioteca con una URL privada por `logId`, consultar el registro correcto y mostrar sus datos personales junto a la metadata de catálogo.

Al terminar podrás explicar por qué una obra y tu registro usan identidades distintas.

## Punto de partida

Comienza desde el checkpoint completo de la sesión 13:

- puedes iniciar y cerrar sesión;
- `/app/library` muestra tu biblioteca;
- cada modelo de fila conserva `logId`;
- búsqueda y detalle público usan `authScope` y autenticación opcional;
- `MediaDetailDto` contiene `catalog`, `entry` e `isLogged`;
- `PageState` presenta estados completos de página y admite retry opcional en error o ausencia;
- el formulario de creación funciona y no cambia en esta sesión;
- Vitest ya está configurado y los tests viven dentro de `__tests__/`.

Antes de editar, comprueba un detalle público y abre la biblioteca. Conserva una película y una serie para el recorrido final.

## Resultado observable

Desde `/app/library` podrás abrir:

```text
/app/library/:logId
```

La página consultará ese registro con Bearer y mostrará:

- detalle de catálogo cuando exista;
- status;
- prioridad;
- notas o “Sin notas”.

Una recarga directa debe conservar el recorrido. La aplicación no transportará el DTO desde la lista.

## Mapa del trabajo

```text
1. Distinguir identidades
2. Crear selector discriminado
3. Adaptar key, fetcher y hook
4. Comprobar detalle público
5. Validar logId y declarar ruta
6. Representar entry
7. Enlazar la biblioteca
8. Probar adapter y recorrido
```

## 1. Distingue las identidades

Completa antes de escribir código:

| Dato | Identifica | Ruta |
| --- | --- | --- |
| `mediaType + externalId` | Una obra de catálogo | `/media/:mediaType/:externalId` |
| `logId` | Tu registro personal | `/app/library/:logId` |

Dos personas pueden guardar la misma película. Compartirán `mediaType + externalId`, pero tendrán `logId`, status, prioridad y notas distintos.

No reemplaces una identidad por la otra.

## 2. Crea un selector discriminado

La sesión 13 ya dejó values canónicos equivalentes en `src/types/media-item.ts`. Confirma el checkpoint y no vuelvas a declararlos:

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

Importa el tipo desde este schema en `src/api/media.ts`, keys, hook y adapters. No conserves otra declaración de `MediaDetailSelector` en `src/types/media-api.ts`.

Comprueba el narrowing:

```ts
if (selector.kind === "catalog") {
  selector.mediaType
  selector.externalId
} else {
  selector.logId
}
```

Checkpoint:

- puedes construir una rama completa de cada tipo;
- TypeScript rechaza `{ kind: "log", externalId: "438631" }`;
- el tipo no contiene tres propiedades opcionales.

## 3. Adapta la query de detalle

### 3.1 Key

Parte del objeto completo de `mediaKeys` entregado en la [sesión 13](../13-taller-crear-listar-y-filtrar-biblioteca/student-guide.md). En `src/hooks/media-keys.ts`, importa `MediaDetailSelector` desde `../schemas/media-detail` y sustituye la firma anterior:

```ts
detail: (selector: MediaDetailSelector, authScope: string) =>
  [...mediaKeys.details(), selector, authScope] as const
```

La key debe describir todas las variables que cambian la respuesta. No coloques el token, el email ni el objeto Firebase `User` en ella.

### 3.2 Fetcher

En `src/api/media.ts`, conserva `API_URL`, definido en ese archivo desde la sesión 07. Combina estos imports con los fetchers existentes y haz que `getMediaDetail` construya params según `selector.kind`:

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

```text
catalog → externalId + mediaType → optional auth
log     → logId                  → required auth
```

Conserva un solo fetcher y el mismo `MediaDetailDto`. `kind` no se envía al backend.

### 3.3 Hook

En `src/hooks/features/use-media.ts`, combina estos imports con los hooks existentes y adapta `useMediaDetail` para recibir `MediaDetailSelector | null`:

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

Debe:

- derivar `authScope` desde Auth;
- permanecer deshabilitado durante `checking`;
- permitir catálogo en estado anónimo;
- permitir log solo con estado `authenticated`;
- conservar una key válida mediante el centinela interno conocido;
- impedir que el fetcher ejecute cuando el selector sea `null`.

No uses un hook condicional ni introduzcas `skipToken` en este checkpoint.

Checkpoint en Query Devtools:

```text
catalog + anonymous
catalog + user.uid
log + user.uid
```

Cada combinación debe tener una key propia.

## 4. Comprueba el detalle público

Antes de crear la página privada, parte de la integración construida en la [sesión 10](../10-taller-detalle-publico-y-effects/student-guide.md) y adapta `MediaDetailPage`.

Conserva dos valores con responsabilidades distintas:

- `detailInput`: identidad pública que ya usa el formulario de creación;
- `detailSelector`: identidad que usa la query.

Deriva la rama `catalog` desde el input validado y llama `useMediaDetail(detailSelector)`.

Comprueba:

1. búsqueda sin sesión;
2. navegación a detalle;
3. detalle después de iniciar sesión;
4. apertura del modal de creación;
5. body de creación con `mediaType + externalId`.

No continúes si aparece una regresión pública.

## 5. Convierte `logId` en selector

En `src/App.tsx`, importa la página y declara la ruta dentro del layout privado:

```tsx
import { PrivateMediaDetailPage } from "./pages/private-media-detail-page"

<Route path="library/:logId" element={<PrivateMediaDetailPage />} />
```

Crea `src/adapters/library-log-param-to-detail-selector.ts` con una función pura:

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

Comportamientos acordados:

| Entrada | Resultado |
| --- | --- |
| `undefined` | `null` |
| `""` | `null` |
| espacios | `null` |
| id válido | rama `{ kind: "log", logId }` normalizada |

La función no importa Router, Firebase o TanStack Query. `safeParse` rechaza los casos inválidos y entrega el `logId` recortado. No uses un cast: no comprobaría el parámetro externo.

En `PrivateMediaDetailPage`:

1. lee `logId` con `useParams`;
2. llama el adapter;
3. llama `useMediaDetail(selector)`;
4. después representa una URL inválida.

Este orden mantiene los hooks en la misma posición durante cada render.

Para la primera carga activa usa `detailQuery.isLoading`. Una query deshabilitada puede estar `pending` sin ejecutar un fetch.

Importa `PageState` desde `../components/page-state` y representa los dos primeros casos:

```tsx
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
```

## 6. Representa los datos personales

Crea `src/types/saved-media-details.ts`:

```ts
export type SavedMediaDetailsModel = Readonly<{
  title: string
  statusLabel: string
  priorityLabel: string
  notes: string | null
}>
```

Implementa `src/adapters/user-media-to-saved-details.ts` reutilizando los labels compartidos de status y prioridad:

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

El adapter:

- conserva el título personal;
- traduce status y prioridad;
- conserva `notes` nullable;
- no inventa poster, descripción, géneros o fecha.

Crea `src/components/saved-media-details.tsx`:

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

El componente muestra los tres campos personales. Usa “Sin notas” cuando el valor sea `null` y conserva saltos de línea.

No añadas controles editables.

## 7. Compón los estados de la página

Representa los casos en este orden:

1. selector inválido;
2. primera carga activa;
3. error HTTP o de red;
4. respuesta con `entry: null`;
5. éxito con catálogo;
6. éxito personal con `catalog: null`.

Antes de representar el error, importa `ApiError` desde `../api/http` y define:

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

Después de invalidez y carga, completa error y ausencia del registro:

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
```

La página conserva `detailQuery`; `PageState` recibe únicamente la variante, el copy y el callback. **Reintentar** aparece en `error` y `unavailable`, no en `loading` o `invalid`.

Durante el éxito:

```text
entry
  → toSavedMediaDetailsModel
  → SavedMediaDetails

catalog disponible
  → mediaCatalogDetailToModel
  → MediaDetailContent
```

Si `entry` existe pero `catalog` es `null`, conserva un `Alert` dentro del contenido y muestra `SavedMediaDetails`. Ese caso es parcial: todavía existe información útil y no debe reemplazarse toda la página con `PageState`.

Reutiliza `MediaDocumentTitle`. Usa el título del catálogo o, si falta, el título de `entry`.

Si `catalog` es `null`, muestra un aviso neutral y conserva los datos personales. No uses una assertion ni inventes metadata.

Traduce errores localmente:

| Caso | Mensaje esperado |
| --- | --- |
| `401` | No pudimos autorizar esta consulta. |
| `404` | No encontramos ese registro en tu biblioteca. |
| Red o `5xx` | No pudimos cargar el detalle. Intenta nuevamente. |

No ejecutes logout ante `401`. No digas que el id pertenece a otra persona cuando recibas `404`.

La referencia final de `src/pages/private-media-detail-page.tsx` reúne los imports, el traductor, los estados y los dos consumidores visuales:

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

El guard `!detailQuery.isSuccess` deja `detailQuery.data` definida en las ramas siguientes. La página conserva la query y entrega únicamente `onRetry` a `PageState`.

## 8. Enlaza la biblioteca

Añade una acción a la fila de la sesión 13. En `src/components/library-media-list-item.tsx`, importa `Button` desde Mantine y `Link` desde React Router; dentro del `Stack` usa la prop existente `data`:

```tsx
<Button
  component={Link}
  to={`/app/library/${data.logId}`}
  variant="subtle"
>
  Ver detalle
</Button>
```

La fila entrega identidad. La página consulta la fuente remota.

No uses:

- `location.state` para transportar el DTO;
- `useNavigate` dentro de un Effect;
- Zustand para conservar la fila;
- una segunda query de catálogo construida desde datos parciales de la lista.

Checkpoint:

1. abre un registro desde la lista;
2. observa `logId` en la URL;
3. recarga;
4. vuelve a la biblioteca;
5. abre otro registro;
6. confirma que cambia la key.

## Trabajo con agente

Entrega el trabajo al agente solo después de implementar y explicar `toLibraryLogDetailSelector`.

Prompt:

```text
Usa la skill ahk-test para crear y ejecutar tests Vitest del adapter puro
toLibraryLogDetailSelector según estos comportamientos:
- undefined produce null;
- string vacío produce null;
- espacios producen null;
- un id válido se recorta y produce un selector log.

Alcance único: src/adapters/__tests__/library-log-param-to-detail-selector.test.ts
y soporte exclusivo dentro de src/adapters/__tests__/. Producción, package.json,
configuración, dependencias y otros tests permanecen en solo lectura. No uses
DOM, Router, Firebase, Query Client, mocks HTTP o snapshots. Ejecuta pnpm test
-- library-log-param-to-detail-selector y entrega matriz, archivos, exit status
y frontera de evidencia.
```

Después:

1. lee el test completo;
2. confirma que las expectativas corresponden a la matriz humana;
3. confirma que no reimplementa la función;
4. revisa el diff;
5. ejecuta:

```bash
pnpm test -- library-log-param-to-detail-selector
```

El test no demuestra navegación, autenticación, query keys, requests o interfaz.

## Verificación

### Tipos y test puro

```bash
pnpm test -- library-log-param-to-detail-selector
pnpm build
```

Registra los códigos de salida. Un output truncado no demuestra que el comando terminó bien.

### Network

Comprueba:

- detalle público por `externalId + mediaType`;
- detalle privado por `logId`;
- Bearer presente en la consulta privada;
- ausencia de una consulta de log durante `checking`.

No copies ni publiques el token.

### Query Devtools

Comprueba:

- selector completo en la key;
- `authScope` correspondiente;
- keys separadas para catálogo y log;
- otra key al abrir otro registro.

### Navegador

Comprueba:

- Link desde la biblioteca;
- recarga directa;
- status, prioridad y notas;
- “Sin notas”;
- fallback de `catalog: null` mediante el caso preparado;
- `404` neutral;
- regreso a biblioteca;
- protección de ruta después de logout.

## Evidencia de salida

Entrega:

- código del checkpoint;
- captura de la URL privada sin exponer token;
- captura de la key con selector y scope;
- captura de la página con catálogo y datos personales;
- salida completa del test dirigido;
- salida completa de `pnpm build`;
- explicación breve de lo que demuestra cada evidencia.

Completa:

```text
Test puro demuestra:
Network demuestra:
Query Devtools demuestra:
Navegador demuestra:
Build demuestra:
Todavía no demostramos:
```

## Errores que debes corregir

- Un selector con campos opcionales permite estados inválidos.
- Una key sin `kind` puede mezclar preguntas distintas.
- Un token en la key expone una credencial y no mejora la identidad de caché.
- Optional auth no satisface la intención privada de `logId`.
- Un hook después de un retorno rompe el orden esperado.
- `logId!` oculta una entrada externa sin validarla.
- Copiar el DTO a `useState` crea otra fuente de datos.
- Añadir `entry` a `MediaDetailContent` mezcla responsabilidades.
- Tratar `catalog: null` como loading confunde estados remotos.
- Reemplazar los datos personales con `PageState` cuando solo falta catálogo oculta información útil.
- Un `404` que revela pertenencia facilita enumerar recursos.
- Un test fuera de `__tests__/` contradice la estructura del proyecto.

## Actividades opcionales

Cuando termines el checkpoint base:

- muestra background refetch sin ocultar los datos existentes;
- prueba un parámetro codificado y explica qué recibe `useParams`.

## Fuera de alcance

- `MediaLogForm`, initial values y modal de edición.
- `PUT`, `DELETE`.
- Entradas manuales o linking.
- Loaders, actions y Data Mode.
- Fetching mediante Effect.
- DTOs en Zustand, storage o navigation state.
- React Testing Library, jsdom, MSW o tests de componentes.
- Cambios en el backend.

La sesión 15 comenzará desde `entry` ya cargado y visible. Allí aparecerán el segundo consumidor del formulario y la actualización pesimista.
