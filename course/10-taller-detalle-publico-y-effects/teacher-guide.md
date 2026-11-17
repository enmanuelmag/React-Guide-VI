# Guía docente · Sesión 10 · Taller de detalle público y Effects

## Resultado y alcance

**Presencial · 180 minutos.** Entrada: `session-10-start`, idéntica a `session-09-end`. Salida: `session-10-end`. El estudiante abre una película o serie por URL, ve datos remotos, distingue ausencia y error, y recupera el título anterior de la pestaña al salir.

El repositorio ejecutable es `../MediaLog-Bootcamp`. Este Markdown privado contiene cada archivo que debes crear o reemplazar, repetido completo cuando cambia. No necesitas mantener abierto el código de referencia. Los archivos de soporte heredados aparecen después de las diapositivas, en el paso que los necesita. No se añaden dependencias ni estilos CSS: los nuevos estilos son las props Mantine incluidas en cada JSX.

Material público: [guía estudiantil](student-guide.md), [lectura previa](pre-class-reading.md) y [taller con rúbrica](workshop-rubric.md). La solución de integración que sigue es para el docente; no se entrega antes del taller. No compartas todas las ramas de solución en un repositorio público: una rama no es una barrera de acceso.

## Antes de la clase · preparación sin edición

1. Comprueba que el cierre 09 conserva búsqueda, enlaces de detalle, params validados y página provisional. No debe abrir un modal de detalle.
2. Comprueba disponibilidad de `https://bootcamp-medialog.cardor.dev` y un detalle de película y de serie. Los ejemplos usan `438631` y `1399`; si el servicio no los devuelve, toma identidades reales desde búsqueda. La forma de una URL no garantiza que el registro exista.
3. Ten la [presentación aprobada de 24 diapositivas](presentation/index.html) y esta guía. El flujo será **presentación completa → editor → taller → cierre oral**, sin regresar al deck.
4. Conserva el respaldo `session-10-workshop-start`. Contiene piezas aisladas, no la solución evaluada.
5. Mantén el stack y lockfile heredados. No instales paquetes ni actualices versiones durante la clase.
6. Prepara DevTools del navegador y React Query Devtools. Distingue tráfico real de cualquier simulación usada para provocar un error o un catálogo nulo.

## Ruta recuperable y tiempos

| Bloque | Minutos de clase | Medio y responsable | Salida observable |
| --- | ---: | --- | --- |
| S10-B01 | 0–18 | Presentación continua · docente y preguntas orales | Propietarios, estados y cleanup comprendidos. |
| S10-B02 | 18–30 | Editor · docente con participación | `step-01-detail-query`: input fijo o nulo y key visible. |
| S10-B03 | 30–42 | Editor · docente con matriz del grupo | `step-02-detail-model`: DTO → modelo. |
| S10-B04 | 42–54 | Editor · docente | `step-03-detail-preview`: contenido y estados con props fijas. |
| S10-B05 | 54–67 | Editor/navegador · docente | `step-04-document-title`: error visible y cleanup corregido. |
| S10-B06 | 67–75 | Editor · grupo y revisión de tests | `step-05-adapter-tests`; respaldo `workshop-start`. |
| S10-B07 | 75–105 | Descanso | Sin conceptos nuevos después. |
| S10-B08 | 105–117 | Taller · estudiante | Input real de URL; conserva orden de hooks. |
| S10-B09 | 117–135 | Taller · estudiante | `step-06-route-query`: estados y modelo real visible. |
| S10-B10 | 135–147 | Taller · estudiante | `step-07-detail-composition`: contenido, título y limpieza. |
| S10-B11 | 147–157 | Navegador · parejas | Matriz manual registrada. |
| S10-B12 | 157–165 | Terminal · estudiante | Tests, lint y build; checkpoint `session-10-end`. |
| S10-B13 | 165–180 | Revisión y cierre oral | Rúbrica y límites de evidencia; puente a 11. |

**Suma: 75 + 30 + 60 + 15 = 180 minutos.** Son tiempos de ensayo, no una medición con estudiantes. Para sostener el bloque previo, pega los archivos visuales extensos y recórrelos por secciones; escribe y razona con el grupo la key, el guard, el adapter y el cleanup. Copiar el bloque no sustituye explicar su consumidor. Si no llegas, registra el último checkpoint y retoma desde allí; no presentes el respaldo como aprendizaje completado.

Todas las referencias de la tabla llevan prefijo `session-10-`. Orden completo:

```text
session-10-start
session-10-step-01-detail-query
session-10-step-02-detail-model
session-10-step-03-detail-preview
session-10-step-04-document-title
session-10-step-05-adapter-tests
session-10-workshop-start
session-10-step-06-route-query
session-10-step-07-detail-composition
session-10-end
```

`workshop-start` tiene el código de step-05 y material público; `end` tiene el código de step-07 y material público. Los errores temporales no tienen ramas. `main` conserva la entrada vacía del curso.

## S10-B01 · Presentación continua · 0–18

Presenta las 24 diapositivas en orden antes de abrir el editor. Las diapositivas del taller anticipan el encargo y la rúbrica; las de cierre plantean preguntas que recuperarás oralmente al final. No son una segunda transición a slides.

Recupera lectura y sesión 09: la URL ya entrega identidad, pero la página aún no consulta. Clave de lectura: **1 A, 2 B, 3 C, 4 B, 5 A**. Antes de revelar respuestas pregunta quién posee cada responsabilidad:

| Pregunta | Razón de la respuesta |
| --- | --- |
| 1 · A | `enabled` evita la ejecución automática mientras falta el input. |
| 2 · B | Sin datos y deshabilitada, la query puede estar `pending/idle`. |
| 3 · C | El título de la pestaña pertenece al documento, fuera de este JSX. |
| 4 · B | Cleanup restaura lo que el setup cambió. |
| 5 · A | Strict Mode comprueba setup y cleanup con un ciclo adicional de desarrollo. |

```text
URL → params → input válido o null → Query → DTO
                                            ↓
                                     adapter → modelo → contenido
                                                        título → Effect
```

Analogía para decir: «En una biblioteca, la dirección de la ficha identifica el libro. Query administra el pedido y el archivo de respuestas. El adapter prepara la ficha para el lector. El título de la pestaña es el letrero de la sala: al entrar lo cambiamos y al salir devolvemos el anterior». Límite: el adapter no comprueba por sí solo un JSON desconocido ni inventa datos que faltan. TypeScript tampoco valida una respuesta en runtime.

Pregunta → respuesta esperada:

- ¿Una dirección con tipo desconocido debe salir a la red? → No; el input será `null`.
- ¿Dos medios de distinto tipo podrían tener el mismo id? → Sí; la key incluye tipo e id.
- ¿`pending` significa que hay petición? → No; puede estar `pending/idle`.
- ¿Dónde calculamos el modelo? → En el render desde el catálogo, sin guardarlo en estado.
- ¿Por qué un Effect para el título? → La pestaña está fuera del JSX; cleanup restaura lo que cambiamos.

Explica aquí las tres ausencias antes del taller: input `null` (no hay identidad), `data === undefined` (aún no hay respuesta, por ejemplo por conexión pausada) y `catalog === null` (sí hay respuesta, pero sin catálogo). La primera carga activa usa `isLoading`; la ausencia de respuesta no equivale a catálogo vacío. Se contempla con una guarda explícita antes de leer `.catalog`, sin casts ni `!`.

Anticipa también `refetch`: repite la consulta actual y se reservará para el extra. No sirve para cambiar de medio; eso lo expresa la identidad. Tras este bloque solo aplicamos conceptos ya explicados.

## S10-B02 · Query de detalle con input fijo · 18–30

**Entrada:** cierre 09. **Responsable:** docente, con preguntas antes de escribir. **Salida:** `session-10-step-01-detail-query`.

### Paso 1 · Abrir la copia de trabajo y comprobar el soporte

En tu copia de trabajo sin cambios pendientes, selecciona la entrada e instala lo que ya declara su lockfile. No cambies de rama encima de trabajo sin guardar. El grupo trabaja en sus propias ramas; las referencias docentes son respaldos.

```bash
git switch session-10-start
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm test
pnpm build
pnpm dev
```

Si ya existe `.env.local`, revisa su valor en lugar de sobrescribirlo. La base pública es `VITE_API_URL=https://bootcamp-medialog.cardor.dev`; no requiere secretos. Mantén la terminal de Vite abierta y usa otra para las verificaciones.

Estos contratos y funciones **ya existen**. Léelos para situar la nueva query; no los vuelvas a crear ni cambies sus responsabilidades:

**`src/types/media-item.ts` · archivo completo heredado; solo lectura:**

```ts
export type MediaType = 'movie' | 'series'

export type MediaItem = {
  id: number
  title: string
  description: string | null
  mediaType: MediaType
  releaseDate: string
  posterUrl: string | null
}
```

**`src/types/media-api.ts` · archivo completo heredado; solo lectura:**

```ts
import type { MediaType } from './media-item'

export type SearchMediaInput = {
  query: string
  mediaType: MediaType
}

export type MediaSearchItemDto = {
  externalId: string
  title: string
  releaseYear: number
  coverUrl: string | null
  mediaType: MediaType
  isLogged: boolean
}

export type GetMediaDetailInput = {
  externalId: string
  mediaType: MediaType
}

export type MediaCatalogDetailDto = {
  externalId: number
  mediaType: MediaType
  title: string
  description: string | null
  coverUrl: string | null
  releaseYear: number | null
  releaseMonth: number | null
  releaseDay: number | null
  durationMinutes: number | null
  episodesCount: number | null
  seasonsCount: number | null
  genres: string[]
  reviewScore: number | null
}

export const MEDIA_STATUS_VALUES = [
  'pending',
  'acquired',
  'watching',
  'seen',
  'dropped',
  'paused',
] as const

export type MediaStatus = (typeof MEDIA_STATUS_VALUES)[number]

export const MEDIA_PRIORITY_VALUES = ['low', 'medium', 'high'] as const

export type MediaPriority = (typeof MEDIA_PRIORITY_VALUES)[number]

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

**`src/api/media.ts` · archivo completo heredado; solo lectura:**

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  GetMediaDetailInput,
  MediaDetailDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'
import { requestJson } from './http'

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  return requestJson<MediaSearchItemDto[]>('/api/v2/media/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

}

export async function getMediaDetail(
  input: GetMediaDetailInput,
): Promise<MediaDetailDto> {
  const params = toMediaDetailSearchParams(input)
  return requestJson<MediaDetailDto>(
    `/api/v2/media/detail?${params.toString()}`,
  )
}
```

`getMediaDetail` devuelve el DTO raíz, no solo `catalog`. Su helper HTTP de 07 ya rechaza status HTTP fallidos. `entry` e `isLogged` se conservan pero no los mostraremos. El id de la ruta sigue siendo string; no lo reconstruimos desde el id numérico del catálogo.

### Paso 2 · Extender la familia de keys

Abre y reemplaza `src/hooks/media-keys.ts` por este archivo. La búsqueda conserva su normalización; solo añadimos la familia de detalle.

**`src/hooks/media-keys.ts` · archivo completo:**

```ts
import type { GetMediaDetailInput, SearchMediaInput } from '../types/media-api'

export const mediaKeys = {
  all: ['media'] as const,
  searches: () => [...mediaKeys.all, 'search'] as const,
  search: (input: SearchMediaInput) =>
    [
      ...mediaKeys.searches(),
      {
        query: input.query.trim(),
        mediaType: input.mediaType,
      },
    ] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (input: GetMediaDetailInput | null) =>
    [...mediaKeys.details(), input] as const,
}
```

Pregunta: «¿Qué ocurriría si guardáramos solo el id?». Espera: una película y una serie con el mismo id compartirían entrada. La key funciona como una etiqueta del archivador, no como una URL de red. `null` conserva el estado real sin inventar un id.

### Paso 3 · Añadir el hook, conservando búsqueda

Reemplaza `src/hooks/features/use-media.ts` completo. No borres `useMediaSearch` ni dupliques imports.

**`src/hooks/features/use-media.ts` · archivo completo:**

```ts
import { useQuery } from '@tanstack/react-query'

import { getMediaDetail, searchMedia } from '../../api/media'
import type { GetMediaDetailInput, SearchMediaInput } from '../../types/media-api'
import { mediaKeys } from '../media-keys'

const emptySearch: SearchMediaInput = {
  query: '',
  mediaType: 'movie',
}

export function useMediaSearch(input: SearchMediaInput | null) {
  const normalizedInput =
    input === null
      ? emptySearch
      : {
          query: input.query.trim(),
          mediaType: input.mediaType,
        }

  return useQuery({
    queryKey: mediaKeys.search(normalizedInput),
    queryFn: () => searchMedia(normalizedInput),
    enabled: input !== null && normalizedInput.query.length >= 2,
  })
}

export function useMediaDetail(input: GetMediaDetailInput | null) {
  return useQuery({
    queryKey: mediaKeys.detail(input),
    queryFn: () => {

      if (input === null) {
        throw new Error('Falta la identidad del medio')
      }

      return getMediaDetail(input)
    },
    enabled: input !== null,
  })
}
```

Lee `enabled` y después el `if`: el primero evita el envío automático sin identidad; el segundo estrecha el tipo y protege el fetcher si se intentara una invocación inválida. Una validación no reemplaza a la otra. `refetch` manual puede ejecutar una query deshabilitada; por eso tampoco ofreceremos reintento para input inválido.

### Paso 4 · Darle un consumidor visible

Reemplaza `src/pages/media-detail-page.tsx`. Este archivo vive en la ruta de detalle que ya declara `App`; no crees otra ruta. Es un laboratorio temporal: los botones eligen dos identidades fijas, todavía no leen la URL. El estado local existe únicamente para esta demostración y desaparecerá en el taller.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Code, Container, Group, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router'

import { useMediaDetail } from '../hooks/features/use-media'
import { mediaKeys } from '../hooks/media-keys'
import type { GetMediaDetailInput } from '../types/media-api'

export function MediaDetailPage() {
  // Demostración: todavía no usamos la identidad de la URL.
  const [demoInput, setDemoInput] = useState<GetMediaDetailInput | null>(null)
  const detailQuery = useMediaDetail(demoInput)

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <Title order={1}>Laboratorio de detalle</Title>

        <Group>
          <Button
            onClick={() => setDemoInput({ mediaType: 'movie', externalId: '438631' })}
          >
            Consultar película
          </Button>

          <Button
            onClick={() => setDemoInput({ mediaType: 'series', externalId: '1399' })}
          >
            Consultar serie
          </Button>

          <Button variant="light" onClick={() => setDemoInput(null)}>
            Sin identidad
          </Button>
        </Group>

        <Code block>{JSON.stringify(mediaKeys.detail(demoInput), null, 2)}</Code>

        <Text>
          Datos: {detailQuery.status} · Red: {detailQuery.fetchStatus}
        </Text>

        <Code block>{JSON.stringify(detailQuery.data ?? null, null, 2)}</Code>

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

1. Abre `/media/movie/438631`: muestra laboratorio, key con `null` y `pending/idle`, sin request de detalle.
2. Pulsa **Consultar película**: observa key, GET de detalle y `pending/fetching` mientras llega la primera respuesta. Después `success/idle` o `error/idle` según el servidor.
3. Pulsa **Consultar serie**: compara ambas keys en React Query Devtools. Si vuelves a película dentro del staleTime y hay datos, puede reutilizar caché; no prometas otra request.
4. Pulsa **Sin identidad**: vuelve a la key nula. Esto no prueba cancelación de una request previa; verifica la ausencia de un envío nuevo.
5. Pregunta: «La URL dice película, pero pulsamos serie: ¿es ya la página final?». Respuesta: no; falta conectar params en el taller.

**Comprobación:** `pnpm build` y `pnpm lint`. **Para retomar:** anota si viste el estado nulo y las dos keys; no basta con copiar el hook.

## S10-B03 · Modelo y adapter · 30–42

**Entrada:** step-01. **Salida:** step-02. Antes de código pide al grupo esta matriz: película conserva duración y nulls de serie; serie conserva temporadas/episodios; año nulo → `Fecha desconocida`; `coverUrl` → `posterUrl`; arrays y nulls conservados sin mutar.

### Paso 1 · Definir la forma que necesita la pantalla

Crea `src/types/media-detail-model.ts` completo. Explica `Readonly`: evita reasignar propiedades a través de este tipo; no congela el objeto en runtime ni vuelve profundamente inmutable un array.

**`src/types/media-detail-model.ts` · archivo completo:**

```ts
import type { MediaType } from './media-item'

export type MediaDetailModel = Readonly<{
  mediaType: MediaType
  title: string
  description: string | null
  posterUrl: string | null
  releaseLabel: string
  genres: string[]
  durationMinutes: number | null
  episodesCount: number | null
  seasonsCount: number | null
  reviewScore: number | null
}>
```

### Paso 2 · Traducir, sin pedir datos ni guardar estado

Crea `src/adapters/media-catalog-detail-to-model.ts`. La traducción devuelve un objeto nuevo. No ordenes `genres` in situ: pertenece al dato de Query. El array se conserva; los consumidores deben tratarlo como lectura.

**`src/adapters/media-catalog-detail-to-model.ts` · archivo completo:**

```ts
import type { MediaCatalogDetailDto } from '../types/media-api'
import type { MediaDetailModel } from '../types/media-detail-model'

export function mediaCatalogDetailToModel(
  catalog: MediaCatalogDetailDto,
): MediaDetailModel {
  const releaseLabel =
    catalog.releaseYear === null
      ? 'Fecha desconocida'
      : String(catalog.releaseYear)

  return {
    mediaType: catalog.mediaType,
    title: catalog.title,
    description: catalog.description,
    posterUrl: catalog.coverUrl,
    releaseLabel,
    genres: catalog.genres,
    durationMinutes: catalog.durationMinutes,
    episodesCount: catalog.episodesCount,
    seasonsCount: catalog.seasonsCount,
    reviewScore: catalog.reviewScore,
  }
}
```

Explica campo por campo: cambia el nombre de portada, convierte año en etiqueta y conserva los demás valores. Si el servidor cambia `coverUrl` por otro nombre, el DTO y este adapter deben revisarse; la UI puede mantener `posterUrl` si el significado no cambia. El adapter no valida ni corrige una respuesta incompatible por arte de magia.

### Paso 3 · Crear el dato temporal y usarlo

Crea `src/data/demo-media-detail.ts`. Son datos locales de enseñanza; no los presentes como respuesta real. El modelo sale del adapter, no de una segunda definición independiente.

**`src/data/demo-media-detail.ts` · archivo completo:**

```ts
import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import type { MediaCatalogDetailDto } from '../types/media-api'

// Datos locales de demostración; no son una respuesta del servidor.
export const demoCatalog: MediaCatalogDetailDto = {
  externalId: 438631,
  mediaType: 'movie',
  title: 'Dune · demostración',
  description: 'Una familia llega al planeta del que depende un imperio.',
  coverUrl: null,
  releaseYear: 2021,
  releaseMonth: null,
  releaseDay: null,
  durationMinutes: 155,
  episodesCount: null,
  seasonsCount: null,
  genres: ['Ciencia ficción', 'Aventura'],
  reviewScore: 8,
}

export const demoMediaDetail = mediaCatalogDetailToModel(demoCatalog)
```

Reemplaza la página completa para mostrar ambos objetos junto al diagnóstico anterior:

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Code, Container, Group, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router'

import { demoCatalog, demoMediaDetail } from '../data/demo-media-detail'
import { useMediaDetail } from '../hooks/features/use-media'
import { mediaKeys } from '../hooks/media-keys'
import type { GetMediaDetailInput } from '../types/media-api'

export function MediaDetailPage() {
  // Demostración: todavía no usamos la identidad de la URL.
  const [demoInput, setDemoInput] = useState<GetMediaDetailInput | null>(null)
  const detailQuery = useMediaDetail(demoInput)

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <Title order={1}>Laboratorio de detalle</Title>

        <Group>
          <Button
            onClick={() => setDemoInput({ mediaType: 'movie', externalId: '438631' })}
          >
            Consultar película
          </Button>

          <Button
            onClick={() => setDemoInput({ mediaType: 'series', externalId: '1399' })}
          >
            Consultar serie
          </Button>

          <Button variant="light" onClick={() => setDemoInput(null)}>
            Sin identidad
          </Button>
        </Group>

        <Code block>{JSON.stringify(mediaKeys.detail(demoInput), null, 2)}</Code>

        <Text>
          Datos: {detailQuery.status} · Red: {detailQuery.fetchStatus}
        </Text>

        <Code block>{JSON.stringify(detailQuery.data ?? null, null, 2)}</Code>

        <Title order={2}>Traducción con datos locales</Title>

        <Text>DTO de demostración</Text>
        <Code block>{JSON.stringify(demoCatalog, null, 2)}</Code>

        <Text>Modelo visual</Text>
        <Code block>{JSON.stringify(demoMediaDetail, null, 2)}</Code>

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

Pregunta: «¿Qué perdió el modelo y por qué?». Respuesta: no necesita el id del DTO, mes ni día; esta pantalla solo usa año como etiqueta. **Comprueba** `coverUrl` frente a `posterUrl` y `2021` frente a `"2021"` en los dos bloques. Ejecuta `pnpm build`. La página aún no adapta la respuesta remota: la integración se reserva.

## S10-B04 · Contenido y estados aislados · 42–54

**Entrada:** step-02. **Salida:** step-03. Mantén visible que probamos piezas por separado, como probar una lámpara antes de instalarla en una habitación.

### Paso 1 · Reemplazar el contenido heredado

`src/components/media-detail-content.tsx` existe desde 06, pero la ruta 09 ya no lo consume. Sustituye su contrato antiguo `media: MediaItem` por `model: MediaDetailModel`; no recuperes el modal de 06. Usa este archivo completo:

**`src/components/media-detail-content.tsx` · archivo completo:**

```tsx
import { Badge, Group, Image, Stack, Text, Title } from '@mantine/core'

import type { MediaDetailModel } from '../types/media-detail-model'

type MediaDetailContentProps = Readonly<{
  model: MediaDetailModel
}>

export function MediaDetailContent(props: MediaDetailContentProps) {
  const { model } = props
  const typeLabel = model.mediaType === 'movie' ? 'Película' : 'Serie'

  return (
    <Stack component="article" gap="md">
      <Title order={1}>{model.title}</Title>

      <Group>
        <Badge>{typeLabel}</Badge>
        <Text>{model.releaseLabel}</Text>
      </Group>

      {model.posterUrl !== null ? (
        <Image
          src={model.posterUrl}
          alt={`Portada de ${model.title}`}
          h={300}
          w="auto"
          fit="contain"
        />
      ) : null}

      <Text>{model.description ?? 'Sin descripción disponible'}</Text>

      <Group gap="xs">
        {model.genres.map((genre) => (
          <Badge key={genre} variant="light">
            {genre}
          </Badge>
        ))}
      </Group>

      {model.mediaType === 'movie' ? (
        <Text>Duración: {model.durationMinutes ?? 'No disponible'} min</Text>
      ) : (
        <Stack gap="xs">
          <Text>Temporadas: {model.seasonsCount ?? 'No disponible'}</Text>
          <Text>Episodios: {model.episodesCount ?? 'No disponible'}</Text>
        </Stack>
      )}

      {model.reviewScore !== null ? (
        <Text>Puntuación: {model.reviewScore}</Text>
      ) : null}
    </Stack>
  )
}
```

Recorre las props de estilo: `Stack` agrupa verticalmente, `gap` separa, `Group` agrupa en línea, `Image` limita alto a 300 y conserva proporción con `fit="contain"`. `Badge` muestra tipo y géneros. No hay CSS nuevo fuera de este JSX. Los estilos heredados siguen importados por `main.tsx`.

Pregunta: «¿Un score 0 debe desaparecer?». Respuesta: no; comprobamos contra `null`, no por valor verdadero/falso. La descripción nula tiene fallback; portada y score nulos se omiten. No se inventa un género si la lista está vacía. El componente conoce el modelo visual, pero no Query, Router o DTO.

### Paso 2 · Crear PageState

Crea `src/components/page-state.tsx`. La unión enumera cuatro variantes; `Record` exige un texto predeterminado para cada una. El componente presenta, pero no decide qué ocurrió en la red.

**`src/components/page-state.tsx` · archivo completo:**

```tsx
import { Alert, Button, Loader, Stack, Text } from '@mantine/core'

export type PageStateVariant =
  | 'loading'
  | 'error'
  | 'invalid'
  | 'unavailable'

type PageStateProps = Readonly<{
  variant: PageStateVariant
  title?: string
  description?: string
  onRetry?: () => void
}>

const PAGE_STATE_COPY: Record<
  PageStateVariant,
  Readonly<{ title: string; description: string; color: string }>
> = {
  loading: {
    title: 'Cargando contenido',
    description: 'Espera mientras recuperamos la información.',
    color: 'blue',
  },
  error: {
    title: 'No pudimos cargar el contenido',
    description: 'Intenta nuevamente.',
    color: 'red',
  },
  invalid: {
    title: 'Dirección no válida',
    description: 'Revisa el enlace o vuelve a la página anterior.',
    color: 'yellow',
  },
  unavailable: {
    title: 'Contenido no disponible',
    description: 'No encontramos información para mostrar.',
    color: 'gray',
  },
}

export function PageState(props: PageStateProps) {
  const { variant, title, description, onRetry } = props
  const copy = PAGE_STATE_COPY[variant]
  const resolvedTitle = title ?? copy.title
  const resolvedDescription = description ?? copy.description
  const canRetry =
    (variant === 'error' || variant === 'unavailable') &&
    onRetry !== undefined

  if (variant === 'loading') {
    return (
      <Stack align="center" gap="sm" py="xl" role="status">
        <Loader aria-label={resolvedTitle} color={copy.color} />

        <Text fw={600}>{resolvedTitle}</Text>

        <Text c="dimmed" ta="center">
          {resolvedDescription}
        </Text>
      </Stack>
    )
  }

  return (
    <Alert color={copy.color} title={resolvedTitle}>
      <Stack gap="sm">
        <Text>{resolvedDescription}</Text>

        {canRetry ? (
          <Button type="button" onClick={onRetry} variant="light">
            Reintentar
          </Button>
        ) : null}
      </Stack>
    </Alert>
  )
}
```

Lee `canRetry`: solo error o ausencia y un callback permiten botón. `title` y `description` son opcionales y reemplazan el texto predeterminado. No creamos un componente distinto por estado. `EmptyState` sigue reservado para una colección válida vacía.

### Paso 3 · Montarlos con props fijas

Reemplaza la página. El contador permite probar el callback sin conectarlo a la red ni adelantar el extra de `refetch`.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Code, Container, Group, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router'

import { MediaDetailContent } from '../components/media-detail-content'
import { PageState } from '../components/page-state'
import { demoMediaDetail } from '../data/demo-media-detail'
import { useMediaDetail } from '../hooks/features/use-media'
import { mediaKeys } from '../hooks/media-keys'
import type { GetMediaDetailInput } from '../types/media-api'

export function MediaDetailPage() {
  // Demostración: todavía no usamos la identidad de la URL.
  const [demoInput, setDemoInput] = useState<GetMediaDetailInput | null>(null)
  const detailQuery = useMediaDetail(demoInput)
  const [demoRetries, setDemoRetries] = useState(0)

  function handleDemoRetry() {
    setDemoRetries((current) => current + 1)
  }

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <Title order={1}>Laboratorio de detalle</Title>

        <Group>
          <Button
            onClick={() => setDemoInput({ mediaType: 'movie', externalId: '438631' })}
          >
            Consultar película
          </Button>

          <Button
            onClick={() => setDemoInput({ mediaType: 'series', externalId: '1399' })}
          >
            Consultar serie
          </Button>

          <Button variant="light" onClick={() => setDemoInput(null)}>
            Sin identidad
          </Button>
        </Group>

        <Code block>{JSON.stringify(mediaKeys.detail(demoInput), null, 2)}</Code>

        <Text>
          Datos: {detailQuery.status} · Red: {detailQuery.fetchStatus}
        </Text>

        <Code block>{JSON.stringify(detailQuery.data ?? null, null, 2)}</Code>

        <Title order={2}>Vista con datos locales</Title>

        <MediaDetailContent model={demoMediaDetail} />

        <Title order={2}>Estados con props fijas</Title>

        <PageState variant="loading" onRetry={handleDemoRetry} />

        <PageState variant="error" onRetry={handleDemoRetry} />

        <PageState variant="invalid" onRetry={handleDemoRetry} />

        <PageState variant="unavailable" onRetry={handleDemoRetry} />

        <Text>Reintentos de demostración: {demoRetries}</Text>

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

Comprueba: película de demostración visible y cuatro estados; solo dos botones **Reintentar**. Púlsalos y observa el contador. Aunque pasamos callback a loading e invalid, no aparece botón. **Pregunta:** «¿Quién llamará realmente a la query?». Espera: la página, a través del callback, nunca PageState.

Ejecuta `pnpm build` y `pnpm lint`. El taller tendrá que retirar esta demostración; no la confundas con las ramas finales.

## S10-B05 · Título, fallo visible y cleanup · 54–67

**Entrada:** step-03. **Salida:** step-04. Antes de mostrar código pregunta qué debería pasar con la pestaña al abandonar el detalle.

### Paso 1 · Crear la versión incompleta y montarla

Crea `src/components/media-document-title.tsx` con este archivo temporal. No tiene cleanup de forma deliberada:

```tsx
import { useEffect } from 'react'

type MediaDocumentTitleProps = Readonly<{
  title: string
}>

export function MediaDocumentTitle(props: MediaDocumentTitleProps) {
  const { title } = props

  useEffect(() => {
    document.title = `${title} | Medialog`

  }, [title])

  return null
}
```

Ahora reemplaza la página completa por esta versión. La línea `MediaDocumentTitle` es su consumidor: sin montarlo, la función nunca participa del render ni ejecuta el Effect.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Code, Container, Group, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router'

import { MediaDetailContent } from '../components/media-detail-content'
import { MediaDocumentTitle } from '../components/media-document-title'
import { PageState } from '../components/page-state'
import { demoMediaDetail } from '../data/demo-media-detail'
import { useMediaDetail } from '../hooks/features/use-media'
import { mediaKeys } from '../hooks/media-keys'
import type { GetMediaDetailInput } from '../types/media-api'

export function MediaDetailPage() {
  // Demostración: todavía no usamos la identidad de la URL.
  const [demoInput, setDemoInput] = useState<GetMediaDetailInput | null>(null)
  const detailQuery = useMediaDetail(demoInput)
  const [demoRetries, setDemoRetries] = useState(0)

  function handleDemoRetry() {
    setDemoRetries((current) => current + 1)
  }

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <Title order={1}>Laboratorio de detalle</Title>

        <Group>
          <Button
            onClick={() => setDemoInput({ mediaType: 'movie', externalId: '438631' })}
          >
            Consultar película
          </Button>

          <Button
            onClick={() => setDemoInput({ mediaType: 'series', externalId: '1399' })}
          >
            Consultar serie
          </Button>

          <Button variant="light" onClick={() => setDemoInput(null)}>
            Sin identidad
          </Button>
        </Group>

        <Code block>{JSON.stringify(mediaKeys.detail(demoInput), null, 2)}</Code>

        <Text>
          Datos: {detailQuery.status} · Red: {detailQuery.fetchStatus}
        </Text>

        <Code block>{JSON.stringify(detailQuery.data ?? null, null, 2)}</Code>

        <Title order={2}>Vista con datos locales</Title>

        <MediaDocumentTitle title={demoMediaDetail.title} />

        <MediaDetailContent model={demoMediaDetail} />

        <Title order={2}>Estados con props fijas</Title>

        <PageState variant="loading" onRetry={handleDemoRetry} />

        <PageState variant="error" onRetry={handleDemoRetry} />

        <PageState variant="invalid" onRetry={handleDemoRetry} />

        <PageState variant="unavailable" onRetry={handleDemoRetry} />

        <Text>Reintentos de demostración: {demoRetries}</Text>

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

1. Guarda ambos archivos; abre `/search` y recarga para recuperar el título base **MediaLog Bootcamp**. No entres al detalle mientras aún falte el consumidor.
2. Abre `/media/movie/438631` y observa **Dune · demostración | Medialog**.
3. Usa **Volver a la búsqueda**. El título incorrectamente permanece. Hazlo por Link, no recargando, porque recargar ocultaría la ausencia de cleanup.
4. Pregunta: «¿Desaparecer del JSX deshace automáticamente una asignación a document?». Respuesta: no.

### Paso 2 · Corregir y observar el ciclo

Reemplaza el archivo del título por esta versión temporal con logs:

```tsx
import { useEffect } from 'react'

type MediaDocumentTitleProps = Readonly<{
  title: string
}>

export function MediaDocumentTitle(props: MediaDocumentTitleProps) {
  const { title } = props

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Medialog`
    console.log('setup', title)

    return () => {
      document.title = previousTitle
      console.log('cleanup', title)
    }
  }, [title])

  return null
}
```

Abre `/search` y recarga antes de repetir: el título residual anterior no debe convertirse en el valor que ahora capturamos. Entra al detalle, sal mediante Link y verifica que vuelve **MediaLog Bootcamp**.

Para Strict Mode, limpia consola y recarga directamente el detalle. En desarrollo observarás `setup → cleanup → setup`; al salir, otro cleanup. No son dos clicks ni dos requests exigidas por este componente. Fast Refresh puede añadir ciclos; por eso se recarga para observar. Mantén StrictMode activo.

Explica cada línea: `previousTitle` captura el letrero anterior; la asignación sincroniza el actual; la función retornada restaura; `[title]` hace repetir la sincronización si cambia la prop. `return null` significa que el componente no dibuja un elemento visual, no que el Effect sea ignorado. Cleanup también ocurre antes de un nuevo setup cuando cambia la dependencia, no solo al abandonar la página.

### Paso 3 · Retirar logs y cerrar el bloque

Reemplaza el archivo por su versión final completa:

**`src/components/media-document-title.tsx` · archivo completo:**

```tsx
import { useEffect } from 'react'

type MediaDocumentTitleProps = Readonly<{
  title: string
}>

export function MediaDocumentTitle(props: MediaDocumentTitleProps) {
  const { title } = props

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Medialog`

    return () => {
      document.title = previousTitle
    }
  }, [title])

  return null
}
```

La página queda exactamente como en el paso 1 de este bloque, sin otro cambio. Ejecuta `pnpm build`. El respaldo step-04 contiene cleanup y no logs; no conserva la versión defectuosa.

## S10-B06 · Prueba del adapter y encargo · 67–75

**Entrada:** step-04. **Salida:** step-05 y respaldo `session-10-workshop-start`. La matriz humana precede al agente. Si no hay agente disponible, escribe/revisa el archivo de referencia de abajo; no se modifica producción para obtener una suite verde.

Prompt listo para copiar:

```text
Usa la skill ahk-test para crear y ejecutar pruebas Vitest puras de
mediaCatalogDetailToModel. La implementación y la matriz ya están escritas.
Matriz: película conserva duración y nulls de serie; serie conserva temporadas
y episodios; año null produce Fecha desconocida; coverUrl pasa a posterUrl;
arrays y nulls se conservan sin inventar datos ni mutar el catálogo.
Alcance único: src/adapters/__tests__/media-catalog-detail-to-model.test.ts.
Producción, rutas, hooks, componentes, dependencias y configuración son
solo lectura. Usa fixtures tipados, sin snapshots ni detalles internos.
Ejecuta pnpm exec vitest run sobre ese archivo. Entrega casos cubiertos,
diff, exit status y límites de evidencia. No implementes el taller.
```

Crea o revisa `src/adapters/__tests__/media-catalog-detail-to-model.test.ts` completo. Este es el resultado docente de referencia:

**`src/adapters/__tests__/media-catalog-detail-to-model.test.ts` · archivo completo:**

```ts
import { describe, expect, it } from 'vitest'

import type { MediaCatalogDetailDto } from '../../types/media-api'
import { mediaCatalogDetailToModel } from '../media-catalog-detail-to-model'

const movie: MediaCatalogDetailDto = {
  externalId: 438631,
  mediaType: 'movie',
  title: 'Dune',
  description: 'Una familia llega a Arrakis.',
  coverUrl: 'https://example.test/dune.jpg',
  releaseYear: 2021,
  releaseMonth: null,
  releaseDay: null,
  durationMinutes: 155,
  episodesCount: null,
  seasonsCount: null,
  genres: ['Ciencia ficción', 'Aventura'],
  reviewScore: 8,
}

describe('mediaCatalogDetailToModel', () => {
  it('presenta una película sin inventar campos de serie', () => {
    const model = mediaCatalogDetailToModel(movie)

    expect(model).toMatchObject({
      mediaType: 'movie',
      title: 'Dune',
      description: 'Una familia llega a Arrakis.',
      releaseLabel: '2021',
      durationMinutes: 155,
      episodesCount: null,
      seasonsCount: null,
      reviewScore: 8,
    })
  })

  it('conserva temporadas y episodios de una serie', () => {
    const series: MediaCatalogDetailDto = {
      ...movie,
      mediaType: 'series',
      durationMinutes: null,
      episodesCount: 73,
      seasonsCount: 8,
    }

    expect(mediaCatalogDetailToModel(series)).toMatchObject({
      mediaType: 'series',
      durationMinutes: null,
      episodesCount: 73,
      seasonsCount: 8,
    })
  })

  it('explica que una fecha nula es desconocida', () => {
    const catalog = { ...movie, releaseYear: null }

    expect(mediaCatalogDetailToModel(catalog).releaseLabel).toBe('Fecha desconocida')
  })

  it('expone la portada con el nombre que consume la UI', () => {
    expect(mediaCatalogDetailToModel(movie).posterUrl).toBe(movie.coverUrl)
  })

  it('conserva los nulls y una lista vacía sin inventar datos', () => {
    const catalog: MediaCatalogDetailDto = {
      ...movie,
      description: null,
      coverUrl: null,
      genres: [],
      durationMinutes: null,
      reviewScore: null,
    }

    expect(mediaCatalogDetailToModel(catalog)).toMatchObject({
      description: null,
      posterUrl: null,
      genres: [],
      durationMinutes: null,
      reviewScore: null,
    })
  })

  it('conserva el orden de los géneros sin modificar el catálogo', () => {
    const catalog = structuredClone(movie)
    const before = structuredClone(catalog)
    Object.freeze(catalog.genres)
    Object.freeze(catalog)

    const model = mediaCatalogDetailToModel(catalog)

    expect(model.genres).toEqual(['Ciencia ficción', 'Aventura'])
    expect(catalog).toEqual(before)
    expect(model).not.toBe(catalog)
  })
})
```

Explica `structuredClone`: crea una copia independiente para comparar antes/después; `Object.freeze` ayuda al test a detectar una escritura indebida. Es soporte de prueba, no una nueva forma de administrar estado de la app. Una prueba de película, otra de serie y casos de ausencia son más útiles que un snapshot del objeto entero.

```bash
git diff -- src/adapters/__tests__/media-catalog-detail-to-model.test.ts
git status --short
pnpm exec vitest run src/adapters/__tests__/media-catalog-detail-to-model.test.ts
pnpm test
pnpm lint
pnpm build
```

La referencia añade 6 tests a los 7 heredados: **13 tests, 3 archivos**. Verifica que el agente solo tocó la prueba. Pregunta qué falta demostrar: red, Router, DOM, título y Strict Mode no quedan cubiertos por el test puro.

Entrega ahora la [rúbrica](workshop-rubric.md): cinco criterios de 20 = 100; extra hasta 10; nota registrada `min(bruto, 100)`. El respaldo previo contiene las piezas, pero todavía tiene input fijo, demostraciones y estados simultáneos. Los estudiantes integrarán la URL y decidirán qué rama mostrar. No enseñes la solución siguiente antes de su intento.

## S10-B07 · Descanso · 75–105

No abras otro concepto al regresar. Si falta comprender un bloque previo, registra el pendiente y recupéralo antes de exigir la dependencia. El respaldo recupera archivos; no reemplaza explicación ni cambia automáticamente el calendario.

## S10-B08 y B09 · Integración evaluada · 105–135

**Responsable:** estudiantes; el docente pregunta y desbloquea. **Entrada:** workshop-start. **Salida:** step-06. La siguiente solución completa es privada, para guiar o revisar después del intento.

### Paso 1 · Recuperar el origen real de identidad

Durante los primeros 12 minutos, pide quitar la identidad fija y recuperar `useParams` → `toMediaDetailInput` → `useMediaDetail`. Los hooks van antes de cualquier retorno. Este adapter ya existe, se muestra completo para que no tengas que buscarlo:

**`src/adapters/media-detail-route-params-to-input.ts` · archivo completo heredado; no reemplazar:**

```ts
import type { GetMediaDetailInput } from '../types/media-api'

export type MediaDetailRouteParams = Readonly<{
  externalId?: string
  mediaType?: string
}>

export function toMediaDetailInput(
  params: MediaDetailRouteParams,
): GetMediaDetailInput | null {
  if (params.mediaType !== 'movie' && params.mediaType !== 'series') {
    return null
  }

  if (params.externalId === undefined || params.externalId.length === 0) {
    return null
  }

  return {
    externalId: params.externalId,
    mediaType: params.mediaType,
  }
}
```

No guardes params en estado. Pregunta ante un hook debajo de un if: «¿Se ejecutará en el mismo orden si cambia de URL inválida a válida?». Debe subirse; `enabled` controla la consulta, no la existencia del hook.

### Paso 2 · Construir las ramas y leer el catálogo

Durante los siguientes 18 minutos, pide construir ramas explícitas y derivar el modelo. Esta es la página completa que deben alcanzar. Abre `src/pages/media-detail-page.tsx` y reemplaza el laboratorio por ella cuando corresponda revisar la solución:

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Code, Container } from '@mantine/core'
import { useParams } from 'react-router'

import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'
import { PageState } from '../components/page-state'
import { useMediaDetail } from '../hooks/features/use-media'

export function MediaDetailPage() {
  const params = useParams()
  const detailInput = toMediaDetailInput(params)
  const detailQuery = useMediaDetail(detailInput)

  if (detailInput === null) {
    return <PageState variant="invalid" />
  }

  if (detailQuery.isLoading) {
    return <PageState variant="loading" />
  }

  if (detailQuery.isError) {
    return <PageState variant="error" />
  }

  if (detailQuery.data === undefined) {
    return (
      <PageState
        variant="unavailable"
        title="Esperando conexión"
        description="Aún no hay una respuesta. Revisa tu conexión."
      />
    )
  }

  if (detailQuery.data.catalog === null) {
    return <PageState variant="unavailable" />
  }

  const model = mediaCatalogDetailToModel(detailQuery.data.catalog)

  return (
    <Container py="xl" size="md">
      <Code block>{JSON.stringify(model, null, 2)}</Code>
    </Container>
  )
}
```

Recorre el orden: identidad inválida → carga activa → error → todavía sin respuesta → catálogo ausente → modelo. La guarda `data === undefined` evita asumir un dato que TypeScript no garantiza tras `isLoading`; por ejemplo, la primera petición puede estar pausada sin conexión. Reutiliza `unavailable` con un mensaje distinto y no lo confunde con `catalog: null`. No añade una variante nueva ni una petición manual.

Las cinco salidas principales del taller se conservan; la ausencia temporal de respuesta es una protección adicional dentro de la presentación compartida. El título todavía no cambia en este checkpoint: la rama exitosa muestra el modelo como JSON para verificar la traducción antes de componer la UI.

Comprueba URL inválida sin GET, dos identidades válidas, keys completas, y `pnpm build`. No uses `data!`, casts ni `useState` del DTO para evitar el error del compilador.

## S10-B10 · Contenido final y retirada de demostración · 135–147

**Entrada:** step-06. **Salida:** step-07, código del cierre base.

1. Reemplaza la página por el archivo completo siguiente. La rama de éxito monta título y contenido usando el mismo modelo real.
2. Borra `src/data/demo-media-detail.ts` completo: ninguna parte de producción debe importarlo ahora.
3. No cambies el adapter, PageState ni el Effect: ya estaban construidos y verificados antes del descanso.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Container, Stack } from '@mantine/core'
import { Link, useParams } from 'react-router'

import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'
import { MediaDetailContent } from '../components/media-detail-content'
import { MediaDocumentTitle } from '../components/media-document-title'
import { PageState } from '../components/page-state'
import { useMediaDetail } from '../hooks/features/use-media'

export function MediaDetailPage() {
  const params = useParams()
  const detailInput = toMediaDetailInput(params)
  const detailQuery = useMediaDetail(detailInput)

  if (detailInput === null) {
    return <PageState variant="invalid" />
  }

  if (detailQuery.isLoading) {
    return <PageState variant="loading" />
  }

  if (detailQuery.isError) {
    return <PageState variant="error" />
  }

  if (detailQuery.data === undefined) {
    return (
      <PageState
        variant="unavailable"
        title="Esperando conexión"
        description="Aún no hay una respuesta. Revisa tu conexión."
      />
    )
  }

  if (detailQuery.data.catalog === null) {
    return <PageState variant="unavailable" />
  }

  const model = mediaCatalogDetailToModel(detailQuery.data.catalog)

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <MediaDocumentTitle title={model.title} />

        <MediaDetailContent model={model} />

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

Comprueba película y serie. Ya no aparecen botones de identidades fijas, JSON de diagnóstico, estados simultáneos ni contador de demo. El título no se monta en carga, error, input inválido o catálogo nulo. En éxito usa el enlace de regreso. En los estados completos puedes usar Atrás del navegador; el encabezado heredado todavía no es una barra de navegación.

## S10-B11 · Matriz de navegador · 147–157

Cada pareja registra acción, resultado esperado y observado. Una casilla pendiente se declara; no se sustituye por «debería funcionar».

| Caso | Acción y evidencia esperada |
| --- | --- |
| Película | Buscar, abrir tarjeta, comprobar identidad de URL, duración y título. |
| Serie | Buscar serie, abrir tarjeta, comprobar temporadas y episodios, sin duración de película. |
| URL directa | Recargar el detalle y abrirlo en pestaña nueva; mismo medio. |
| Historial | Volver a búsqueda, Atrás y Adelante; contenido y título siguen la ruta. La búsqueda puede reiniciarse: restaurar sus filtros no es alcance de hoy. |
| Tipo inválido | Abrir `/media/anime/438631`; mensaje de dirección inválida y cero GET de detalle para ese input. |
| Carga | Con caché vacía y red lenta, observar carga antes del contenido; una entrada cacheada puede evitar el spinner. |
| Error | Provocar fallo controlado; ver error, no catálogo ausente. |
| Catálogo nulo | Con respuesta controlada `catalog: null`, ver ausencia, no error remoto. |
| Sin respuesta | Con caché vacía y navegador offline, no leer `.catalog` ni fallar; ver espera de conexión. Al volver online puede continuar la consulta. |
| Cleanup | Entrar cambia el título; salir lo restaura. Repetir después de recargar, sin Fast Refresh. |

Para reproducir error o ausencia con DevTools, explica claramente que la respuesta es local. En Chrome puedes usar Network → petición de detalle → Override content y una carpeta local de Overrides para responder `{"catalog":null,"entry":null,"isLogged":false}`; recarga con caché de Query vacía. Para error usa Request blocking sobre `/api/v2/media/detail`. Desactiva Overrides y blocking al terminar. No alteres la API pública ni consideres estas pruebas evidencia del servicio real. Si esas opciones no están disponibles, marca esos casos pendientes y usa el entorno controlado preparado por el docente.

## S10-B12 · Verificar y guardar evidencia · 157–165

```bash
pnpm exec vitest run src/adapters/__tests__/media-catalog-detail-to-model.test.ts
pnpm test
pnpm lint
pnpm build
rg 'demoMediaDetail|demoInput|demoRetries|console\.log|useEffect' src
```

Solo debe quedar `useEffect` en `MediaDocumentTitle`; no hay datos de demo ni logs. Lee los resultados antes de corregir. Guarda salidas, matriz, diff de test y último checkpoint. `session-10-end` contiene la base sin resolver el extra. Los materiales públicos del cierre están en `course/10-taller-detalle-publico-y-effects/`; nunca copies aquí esta guía docente.

## S10-B13 · Revisión y cierre oral · 165–180

Primeros 7 minutos: revisión por pares con [la tabla única](workshop-rubric.md). Cada pareja señala un criterio demostrado y uno pendiente. Siguientes 4: compara desarrollo con `pnpm preview` después de build; observa el título y el regreso. Un preview local no demuestra deploy ni configuración de deep links del hosting. Últimos 4: completa oralmente «URL posee identidad; Query, dato remoto y caché; adapter, traducción; Effect, sincronización externa».

El test demuestra transformación para sus fixtures; build, tipado y empaquetado; la matriz, el comportamiento observado en ese navegador. No se equivalen. No se añaden Zustand, Zod, formularios, auth o mutaciones. En 11 el modal global de creación podrá abrirse desde estas páginas; Query seguirá siendo dueño del detalle.

## Extra privado de referencia · Reintentar

Solo después de la base y de acuerdo con la rúbrica. Reemplaza la página por esta variante completa. `void` indica que el callback no devuelve a PageState la promesa de `refetch`; el resultado sigue administrado por Query. Los callbacks solo se entregan en error y catálogo ausente. No cambian la identidad, ni se añaden a loading, invalid o espera de conexión.

**`src/pages/media-detail-page.tsx` · archivo completo, variante extra:**

```tsx
import { Anchor, Container, Stack } from '@mantine/core'
import { Link, useParams } from 'react-router'

import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'
import { MediaDetailContent } from '../components/media-detail-content'
import { MediaDocumentTitle } from '../components/media-document-title'
import { PageState } from '../components/page-state'
import { useMediaDetail } from '../hooks/features/use-media'

export function MediaDetailPage() {
  const params = useParams()
  const detailInput = toMediaDetailInput(params)
  const detailQuery = useMediaDetail(detailInput)

  if (detailInput === null) {
    return <PageState variant="invalid" />
  }

  if (detailQuery.isLoading) {
    return <PageState variant="loading" />
  }

  if (detailQuery.isError) {
    return (
      <PageState
        variant="error"
        onRetry={() => void detailQuery.refetch()}
      />
    )
  }

  if (detailQuery.data === undefined) {
    return (
      <PageState
        variant="unavailable"
        title="Esperando conexión"
        description="Aún no hay una respuesta. Revisa tu conexión."
      />
    )
  }

  if (detailQuery.data.catalog === null) {
    return (
      <PageState
        variant="unavailable"
        onRetry={() => void detailQuery.refetch()}
      />
    )
  }

  const model = mediaCatalogDetailToModel(detailQuery.data.catalog)

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <MediaDocumentTitle title={model.title} />

        <MediaDetailContent model={model} />

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

Provoca error, luego retira el fallo y pulsa Reintentar: debe repetir la identidad actual y recuperar el contenido. Repite desde catálogo nulo. Verifica que no aparece botón en URL inválida ni carga. Ejecuta build y lint. Si vuelves a la base, reemplaza la página con el archivo completo de S10-B10; la rama `session-10-end` no incluye este extra.

## Registro para continuar sin saltos

- Último bloque comprobado: ______.
- Rama o commit de trabajo guardado: ______.
- Último resultado observable: ______.
- Primer paso pendiente y archivo: ______.
- Concepto todavía no explicado: ______.
- Caso de navegador pendiente: ______.
- Minutos reales de presentación / coding / taller: ______ / ______ / ______.

No declares terminada la integración solo porque se abrió una rama resuelta. Retoma el primer paso pendiente antes de introducir su dependencia de la sesión 11.

## Fuentes técnicas consultadas

Verificación con Context7 el 7 de octubre de 2026: [useEffect y cleanup](https://react.dev/reference/react/useEffect), [Strict Mode](https://react.dev/reference/react/StrictMode), [queries deshabilitadas](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries), [Mantine Image](https://mantine.dev/core/image/), [Stack](https://mantine.dev/core/stack/) y [Alert](https://mantine.dev/core/alert/). No se cambiaron versiones del checkpoint. El índice Mintlify no está disponible en esta sesión.
