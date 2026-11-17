# Clase 09 · Query dependiente y taller de catálogo público

- **Semana:** 3
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** proyecto semilla `s03-c09-catalogo-publico-seed`, que reproduce el checkpoint remoto de la clase 08
- **Checkpoint de salida:** cada resultado remoto abre un modal que consulta y representa su detalle público mediante `externalId + mediaType`

## Resultado de aprendizaje

Al terminar, el estudiante podrá condicionar una query a una identidad seleccionada, propagar esa selección mediante un callback y representar dentro de un modal los estados carga, error, catálogo ausente y éxito sin guardar el DTO remoto en estado local.

## Limitación que abre la clase

La clase 08 ya busca películas y series. Cada tarjeta conserva `externalId` y `mediaType`, pero todavía es de solo lectura. La pantalla muestra un resumen; no puede solicitar descripción, géneros, duración ni datos propios de una serie.

La clase completa el segundo tramo del catálogo público:

```text
clase 08
formulario → useMediaSearch → resultados resumidos

clase 09
resultado elegido
→ onSelect({ externalId, mediaType })
→ App conserva la identidad mínima
→ useMediaDetail habilita la query
→ DTO de detalle permanece en caché
→ adaptador produce MediaDetailModel
→ Modal representa el estado remoto
```

La selección pertenece a la interacción de la pantalla. El detalle pertenece al servidor. `App` guarda la primera; TanStack Query conserva el segundo.

## Conceptos que se enseñan y consolidan

- Query dependiente o condicionada.
- Identidad mínima de catálogo.
- `enabled` como condición declarativa.
- Familia de keys para búsqueda y detalle.
- Propagación de `onSelect` con un objeto de identidad.
- Estado local de selección frente a estado remoto de detalle.
- DTO raíz con `catalog` nullable.
- Modelo visual de detalle y adaptador puro.
- Estados de carga, error, catálogo ausente y éxito.
- Query activa frente a query inactiva en caché.
- Modal controlado mediante `opened` y `onClose`.
- Reutilización de `MediaDetailContent` sin forzar `MediaItem`.

## Contratos que se reutilizan

La clase 07 ya definió el input que necesita el endpoint:

```ts
export type GetMediaDetailInput = {
  externalId: string
  mediaType: MediaType
}
```

Ese tipo también describe la selección mínima de esta pantalla. La guía no crea un segundo `MediaCatalogSelector` con la misma forma.

La respuesta reducida conserva un objeto raíz:

```ts
export type MediaDetailDto = {
  catalog: MediaCatalogDetailDto | null
  entry: UserMediaDataDto | null
  isLogged: boolean
}
```

`catalog` continúa siendo nullable porque así lo declara el endpoint. Una identidad proveniente de búsqueda normalmente produce catálogo, pero la interfaz no elimina un caso real mediante `!` ni `as`. `entry` también viaja en el DTO raíz: para una consulta pública anónima normalmente es `null` y este taller no la representa. La clase 19 será su primer consumidor visual.

### Lo que no debe guardarse como selección

| Candidato | Decisión | Motivo |
| --- | --- | --- |
| `MediaSearchCardModel` completo | No | Es un resumen visual y puede quedar desactualizado frente al detalle |
| `MediaDetailDto` | No | TanStack Query ya conserva la respuesta remota |
| `key` compuesta de React | No | Solo identifica un elemento durante el recorrido de la lista |
| `{ externalId, mediaType }` | Sí | Es la identidad pública mínima que exige el endpoint |

## Guion de presentación

### Propósito y duración

La presentación conceptual inicial ocupa 18 minutos. Recupera la búsqueda remota y el flujo de selección de la clase 06, presenta la query dependiente y delimita el trabajo anterior y posterior al descanso. Durante los últimos 5 minutos de revisión, el grupo vuelve al deck para explicar el recorrido completo y abrir el caso legítimo de `useEffect` de la clase 10.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | La tarjeta ya conserva la identidad | Recuperar `MediaSearchItemDto → adaptador → MediaSearchCardModel`. Señalar `externalId` y `mediaType` sin repasar toda la configuración de Query Client. | Captura del checkpoint 08. Pedir que un estudiante identifique qué dos valores enviaría al endpoint de detalle. |
| Conexión previa | Ya propagamos una selección | En la clase 06, `App` entregó `onSelect` a la grilla y la tarjeta ejecutó la referencia. Ahora el argumento deja de ser `media.id` y pasa a ser la identidad pública. | Dos recorridos en paralelo: `media.id` local y `{ externalId, mediaType }` remoto. |
| Problema | El resumen no es el detalle | Búsqueda no devuelve descripción, géneros ni información completa. Abrir el resumen dentro del modal produciría una pantalla incompleta y ocultaría la segunda operación HTTP. | Comparar los campos del card model con `MediaCatalogDetailDto`. |
| Concepto | La segunda query espera una identidad | `useMediaDetail` existe desde el primer render, pero su query function solo puede ejecutarse cuando hay selección. `enabled` expresa esa precondición. | Línea de tiempo `null → selección → fetching → success → cierre`. |
| Estado | Pendiente no significa fetching | Sin selección, la query condicionada puede estar `pending` con `fetchStatus: idle`. Al seleccionar, pasa a `fetching`. Recuperar `isLoading` de la clase 08. | Matriz pequeña de `status` y `fetchStatus`; no repetir toda la teoría de estados v5. |
| Identidad | Búsqueda y detalle tienen cachés distintas | La familia `mediaKeys` separa `searches()` de `details()`. Dos medios con distinto tipo o `externalId` producen keys diferentes. | Árbol de keys con una búsqueda y dos detalles. |
| Propiedad | React guarda la elección; Query guarda la respuesta | `selectedDetailInput` es una decisión del usuario. `detailQuery.data` pertenece a la caché. Cerrar coloca la selección en `null`; no borra el resultado remoto. | Tabla de propietarios y captura de Devtools antes y después del cierre. |
| Frontera | El DTO de detalle también necesita adaptación | `coverUrl` se vuelve `posterUrl` y el año nullable se convierte en una etiqueta. El adaptador conserva datos de película y serie sin inventar información ausente. | Diagrama `catalog DTO → toMediaDetailModel → MediaDetailContent`. |
| Nulabilidad | Éxito HTTP no garantiza contenido de catálogo | `isSuccess` describe la query raíz. `catalog: null` necesita una interfaz propia; no es loading ni un cast válido hacia catálogo. | Cuatro cuadros: loading, error, catálogo ausente y contenido. |
| Interfaz | El modal sigue siendo controlado | `opened` se deriva de la existencia de selección y `onClose` ejecuta un handler de `App`. El modal no solicita datos ni recibe setters. | Recuperar el diagrama de la clase 06. Mantener `title` para la etiqueta accesible del diálogo. |
| Taller | Conectar piezas ya construidas | Antes del descanso quedarán key, hook, adaptador y contenido verificados con una identidad fija. El taller sustituye esa identidad por el clic real y mueve los estados al modal. | Antes/después sin revelar las líneas exactas de la solución del taller. |

### Indicaciones que deben sobrevivir a la producción de slides

- La query de detalle depende de una selección, no del resultado completo de búsqueda.
- El hook se llama en cada render. `enabled` decide si TanStack Query puede ejecutar la query function; no se llama el hook dentro de un `if`.
- `GetMediaDetailInput` ya contiene la identidad mínima. Otro tipo con los mismos campos solo duplicaría vocabulario.
- El `externalId` de la tarjeta es `string`, aunque el catálogo devuelto represente su `externalId` como `number`. La key y el request conservan el string recibido por búsqueda.
- `mediaType` forma parte de la identidad. Una película y una serie no comparten detalle aunque otro valor coincida.
- La key de detalle incluye todas las variables que consume `getMediaDetail()`.
- `enabled: selectedDetailInput !== null` evita la ejecución sin selección.
- El valor fallback usado para construir la key deshabilitada no representa un medio real ni dispara HTTP.
- La query condicionada sin datos puede estar `pending` y `idle`. La interfaz usa `isLoading` cuando la primera petición está activa.
- `catalog: null` pertenece a una respuesta exitosa. La interfaz muestra “Detalle no disponible” y no intenta renderizar el componente.
- El DTO raíz contiene `catalog`, `entry` e `isLogged`; esta pantalla solo consume `catalog` y deja la rama personal nullable para el detalle privado posterior.
- `MediaSearchCardModel` no sustituye `MediaCatalogDetailDto`. El modal necesita la segunda query para obtener datos completos.
- El adaptador de detalle aparece antes del descanso porque el taller lo consumirá. No se introduce una transformación nueva durante la práctica individual.
- `MediaDetailModel` usa únicamente campos disponibles. No crea descripción, géneros, duración, temporadas ni episodios falsos.
- `MediaDetailContent` recibe un modelo visual. No ejecuta hooks, no conoce la query y no abre o cierra el modal.
- `selectedDetailInput` vive en `App`, ancestro común cercano de `MediaSearchResults` y `Modal`.
- El callback transporta identidad. No transporta el setter, la query ni un elemento mutable de caché.
- `opened={selectedDetailInput !== null}` deriva la apertura; no requiere otro booleano.
- `handleCloseDetail` responde a un evento conocido. No necesita `useEffect`.
- Cerrar vuelve inactiva la query anterior, pero no elimina su entrada. Reabrir el mismo medio durante el `staleTime` docente permite observar la caché.
- Devtools demuestra la entrada y su estado. Network demuestra si se ejecutó otro request.
- Un botón de reintento puede llamar `detailQuery.refetch()` porque repite la misma identidad después de un error. No se usa `refetch` para diseñar la selección inicial.
- Zustand sigue fuera de alcance: resultados y modal comparten `App` como propietario suficiente. El drawer futuro tendrá consumidores alejados.
- `isLogged` seguirá siendo `false` para visitantes en esta fase. La clase conserva el campo, pero no abre todavía acciones privadas.
- El detalle exitoso deja disponible un título real. La clase 10 lo sincronizará con `document.title` y explicará cleanup.

### Cierre conceptual

La revisión final vuelve al deck y plantea cuatro preguntas:

1. ¿Por qué `App` guarda `{ externalId, mediaType }` y no `detailQuery.data`?
2. ¿Qué diferencia existe entre una query `pending/idle` y una query `pending/fetching`?
3. ¿Por qué cerrar el modal no obliga a borrar la caché?
4. ¿Qué sistema externo podría sincronizarse ahora con el título del medio abierto?

La cuarta respuesta abre la clase 10: `document.title` sí requiere un Effect porque React no controla esa API del navegador.

## Proyecto semilla

### Nombre propuesto

`s03-c09-catalogo-publico-seed`

### Árbol relevante

```text
src/
├── adapters/
│   └── media-search-to-card.ts
├── api/
│   ├── http.ts
│   └── media.ts
├── components/
│   ├── media-detail-content.tsx
│   └── media-search-results.tsx
├── hooks/
│   ├── features/
│   │   └── use-media.ts
│   └── media-keys.ts
├── types/
│   ├── media-api.ts
│   ├── media-search-card.ts
│   └── media.ts
├── App.tsx
└── main.tsx
```

### Qué incluye

- Todo el checkpoint de la clase 08.
- `QueryClientProvider`, Devtools, `mediaKeys` y `useMediaSearch`.
- Formulario remoto con borrador, tipo y búsqueda enviada.
- `MediaSearchCardModel`, su adaptador y tarjetas remotas de solo lectura.
- `getMediaDetail()` y los DTO de detalle creados en la clase 07.
- `MediaDetailContent` de la semana 2 como archivo disponible; todavía recibe `MediaItem` y no forma parte del árbol activo.
- Dependencias, configuración y estilos de Mantine.
- Proyecto que inicia mediante `pnpm dev` y termina `pnpm build` sin errores.

### Qué omite

- `mediaKeys.details()` y `mediaKeys.detail()`.
- `useMediaDetail()`.
- `MediaDetailModel` y `toMediaDetailModel()`.
- Prueba del detalle mediante una identidad fija.
- Prop `onSelect` en `MediaSearchResults`.
- `selectedDetailInput` y handlers de selección o cierre.
- Modal conectado a la query remota.
- Zustand, rutas e identidad en la URL.

### Comprobación previa del docente

Antes de compartir el seed, el docente debe:

1. Instalar mediante el lockfile de la cohorte y ejecutar `pnpm dev`.
2. Buscar un título como película y como serie.
3. Confirmar que las tarjetas conservan `externalId` y `mediaType`, pero no incluyen `onSelect`.
4. Verificar `getMediaDetail({ externalId: "438631", mediaType: "movie" })` mediante un probe temporal y retirar el probe.
5. Confirmar que la rama pública devuelve `isLogged: false` sin sesión.
6. Ejecutar `pnpm build`.
7. Confirmar que el seed no contiene key, hook, adaptador ni conexión de detalle.

El docente reemplaza la identidad `438631` si la API de la cohorte no la resuelve. El valor que presente durante la clase debe haberse comprobado antes de compartir el material.

## Antes del descanso · Explicación y progreso guiado · 75 minutos

| Tiempo | Responsable | Progreso y comprobación |
| --- | --- | --- |
| 0-18 min | Docente y grupo | Usar el deck para recuperar identidad, callbacks, query keys y estados v5; introducir la query dependiente y delimitar el taller. |
| 18-32 min | Construcción interactiva | Añadir la familia de keys de detalle y justificar `externalId + mediaType` con dos ejemplos. |
| 32-45 min | Demostración docente | Implementar `useMediaDetail()` con `enabled` y observar `pending/idle` antes de proporcionar una identidad. |
| 45-60 min | Docente con participación | Definir `MediaDetailModel`, escribir el adaptador y cambiar `MediaDetailContent` para recibir el nuevo contrato visual. |
| 60-70 min | Práctica guiada | Consultar una identidad fija y representar carga, error, catálogo ausente y éxito en una sección temporal. |
| 70-75 min | Docente y estudiantes | Auditar el checkpoint previo, explicar el encargo y compartir el checkpoint alternativo. |

La suma anterior al descanso es de 75 minutos.

### Paso 1 · Ampliar la familia de query keys

La clase conserva las keys de búsqueda y añade dos miembros:

```ts
export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  search: (query: string, mediaType: MediaType) =>
    [...mediaKeys.searches(), { query, mediaType }] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (externalId: string, mediaType: MediaType) =>
    [...mediaKeys.details(), { externalId, mediaType }] as const,
}
```

El grupo compara tres identidades:

```text
["media", "search", { query: "dune", mediaType: "movie" }]
["media", "detail", { externalId: "438631", mediaType: "movie" }]
["media", "detail", { externalId: "438631", mediaType: "series" }]
```

Búsqueda y detalle no comparten prefijo específico porque representan datos distintos. Los dos detalles tampoco comparten entrada final porque `mediaType` cambia el request.

### Paso 2 · Implementar la query condicionada

`src/hooks/features/use-media.ts` conserva `useMediaSearch`. El docente añade `getMediaDetail` y `GetMediaDetailInput` a los imports existentes; `useQuery` y `mediaKeys` ya están disponibles desde la clase 08.

```ts
export function useMediaDetail(input: GetMediaDetailInput | null) {
  const externalId = input?.externalId ?? ""
  const mediaType = input?.mediaType ?? "movie"

  return useQuery({
    queryKey: mediaKeys.detail(externalId, mediaType),
    queryFn: () => getMediaDetail({ externalId, mediaType }),
    enabled: input !== null,
  })
}
```

El hook conserva la llamada incondicional de React. Cuando `input` es `null`, construye una key estable deshabilitada y no ejecuta `getMediaDetail()`. El docente muestra en Devtools:

```text
input = null
→ status: pending
→ fetchStatus: idle
→ ningún request

input = { externalId: "438631", mediaType: "movie" }
→ status: pending
→ fetchStatus: fetching
→ GET /api/v2/media/detail?externalId=438631&mediaType=movie
```

El fallback `movie` solo completa el tipo de la key deshabilitada. No representa una selección real.

### Paso 3 · Preparar el modelo visual de detalle

El docente crea `src/types/media-detail.ts`:

```ts
import type { MediaType } from "./media"

export type MediaDetailModel = {
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
}
```

Después, `src/adapters/media-catalog-to-detail.ts` transforma el catálogo:

```ts
import type { MediaCatalogDetailDto } from "../types/media-api"
import type { MediaDetailModel } from "../types/media-detail"

export function toMediaDetailModel(
  catalog: MediaCatalogDetailDto,
): MediaDetailModel {
  return {
    mediaType: catalog.mediaType,
    title: catalog.title,
    description: catalog.description,
    posterUrl: catalog.coverUrl,
    releaseLabel:
      catalog.releaseYear === null
        ? "Fecha desconocida"
        : String(catalog.releaseYear),
    genres: catalog.genres,
    durationMinutes: catalog.durationMinutes,
    episodesCount: catalog.episodesCount,
    seasonsCount: catalog.seasonsCount,
    reviewScore: catalog.reviewScore,
  }
}
```

Esta transformación repite una técnica de la clase 08. La novedad principal sigue siendo la query dependiente.

### Paso 4 · Reorientar `MediaDetailContent`

El componente deja de recibir `MediaItem` y pasa a recibir el modelo real del detalle público:

```tsx
import { Badge, Group, Image, Stack, Text, Title } from "@mantine/core"

import type { MediaDetailModel } from "../types/media-detail"

type MediaDetailContentProps = {
  media: MediaDetailModel
}

export function MediaDetailContent({ media }: MediaDetailContentProps) {
  return (
    <Stack gap="sm">
      {media.posterUrl ? (
        <Image alt={`Portada de ${media.title}`} src={media.posterUrl} />
      ) : (
        <Text c="dimmed">Sin portada disponible</Text>
      )}

      <Title order={2}>{media.title}</Title>
      <Badge>{media.mediaType === "movie" ? "Película" : "Serie"}</Badge>
      <Text>{media.description ?? "Sin descripción disponible"}</Text>
      <Text>Año: {media.releaseLabel}</Text>

      <Group gap="xs">
        {media.genres.map((genre) => (
          <Badge key={genre} variant="light">
            {genre}
          </Badge>
        ))}
      </Group>

      {media.durationMinutes !== null && (
        <Text>Duración: {media.durationMinutes} minutos</Text>
      )}
      {media.seasonsCount !== null && (
        <Text>Temporadas: {media.seasonsCount}</Text>
      )}
      {media.episodesCount !== null && (
        <Text>Episodios: {media.episodesCount}</Text>
      )}
      {media.reviewScore !== null && (
        <Text>Puntuación: {media.reviewScore}</Text>
      )}
    </Stack>
  )
}
```

La interfaz muestra únicamente datos disponibles. Una película puede tener duración sin temporadas; una serie puede tener temporadas y episodios. Los condicionales derivan presentación y no crean estado.

### Paso 5 · Verificar con una identidad fija

Durante el progreso guiado, `App` usa temporalmente:

```tsx
const demoDetailInput: GetMediaDetailInput = {
  externalId: "438631",
  mediaType: "movie",
}

const detailQuery = useMediaDetail(demoDetailInput)
const detailModel = detailQuery.data?.catalog
  ? toMediaDetailModel(detailQuery.data.catalog)
  : null
```

Una sección debajo de los resultados representa los cuatro estados:

```text
detailQuery.isLoading
→ Skeleton

detailQuery.isError
→ Alert con detailQuery.error.message

detailQuery.isSuccess y detailQuery.data.catalog === null
→ “Detalle de catálogo no disponible”

detailQuery.isSuccess y detailModel !== null
→ MediaDetailContent
```

El docente provoca carga y error mediante requests controlados. Para comprobar `catalog: null`, usa temporalmente un valor tipado `{ catalog: null, isLogged: false }` en la rama visual y lo retira después; no afirma que una búsqueda pública válida producirá ese caso en cada entorno. Luego devuelve una identidad válida y entrega el checkpoint alternativo.

### Checkpoint alternativo antes del taller

Nombre propuesto: `s03-c09-detalle-base`.

Incluye:

- `mediaKeys.details()` y `mediaKeys.detail()`.
- `useMediaDetail()` con input nullable y `enabled`.
- `MediaDetailModel`, adaptador y `MediaDetailContent` terminados.
- Sección temporal que consulta una identidad fija y representa los cuatro estados.
- Build correcto y detalle visible con al menos una película.

Omite:

- `onSelect` en las tarjetas.
- Estado local de selección.
- Modal remoto.
- Solución del taller.

## Descanso · 30 minutos

El docente no introduce código ni conceptos durante este bloque.

## Después del descanso · Taller de integración · 60 minutos

### Encargo

Reemplazar la identidad fija por la elección del usuario. Cada tarjeta debe comunicar su identidad a `App`; `App` habilitará el detalle y un modal controlado representará los mismos cuatro estados practicados antes del descanso.

### Distribución sugerida

| Tiempo | Trabajo del estudiante | Evidencia intermedia |
| --- | --- | --- |
| 0-12 min | Añadir el contrato `onSelect` a `MediaSearchResults` y ejecutar el callback desde cada tarjeta. | Un `console.log` temporal de `externalId + mediaType` coincide con la tarjeta; se retira después. |
| 12-25 min | Crear `selectedDetailInput`, `handleSelectMedia` y `handleCloseDetail` en `App`. | Seleccionar guarda la identidad; cerrar vuelve a `null`. |
| 25-40 min | Sustituir la identidad fija en `useMediaDetail()` y conectar `Modal` con los estados remotos ya construidos. | El modal abre inmediatamente y muestra skeleton hasta recibir detalle. |
| 40-50 min | Resolver error, `catalog: null`, éxito y cierre sin retirar los resultados de búsqueda. | Cada rama produce un contenido diferente y el cierre conserva la lista. |
| 50-60 min | Reabrir un medio, probar película y serie, inspeccionar Devtools y Network, retirar código temporal y ejecutar `pnpm build`. | Dos keys de detalle correctas y build sin errores. |

La suma del taller es de 60 minutos.

### Trabajo obligatorio

1. Cambiar `MediaSearchResultsProps` para recibir `onSelect: (input: GetMediaDetailInput) => void`.
2. Añadir a cada tarjeta un botón “Ver detalle”.
3. Ejecutar `onSelect({ externalId: item.externalId, mediaType: item.mediaType })` desde el clic.
4. Mantener en `App` `selectedDetailInput: GetMediaDetailInput | null`.
5. Conectar `useMediaDetail(selectedDetailInput)` sin llamar hooks condicionalmente.
6. Derivar `detailModel` desde `detailQuery.data?.catalog` mediante el adaptador.
7. Abrir el modal con `opened={selectedDetailInput !== null}`.
8. Cerrar mediante un handler que coloca la selección en `null`.
9. Representar skeleton, error, catálogo ausente y contenido dentro del modal.
10. Mantener la búsqueda visible y comprobar que cerrar no borra la caché.

### Recorrido que debe poder explicar el estudiante

```text
App crea handleSelectMedia
→ App entrega la referencia a MediaSearchResults
→ la tarjeta ejecuta onSelect con externalId y mediaType
→ handleSelectMedia actualiza selectedDetailInput
→ React vuelve a renderizar App
→ useMediaDetail observa una key habilitada
→ TanStack Query ejecuta getMediaDetail o reutiliza caché
→ App deriva detailModel
→ Modal representa el estado correspondiente
```

El callback no “sube datos”. La tarjeta ejecuta una función definida por `App` y le entrega un argumento.

### Solución de referencia para el docente

La guía del estudiante puede omitir este bloque. El docente lo usa para comprobar firmas y orden del flujo.

`MediaSearchResults` recibe y ejecuta la referencia:

```tsx
type MediaSearchResultsProps = {
  items: MediaSearchCardModel[]
  onSelect: (input: GetMediaDetailInput) => void
}

<Button
  type="button"
  onClick={() =>
    onSelect({
      externalId: item.externalId,
      mediaType: item.mediaType,
    })
  }
>
  Ver detalle
</Button>
```

`App` conserva únicamente la identidad y deriva la apertura:

```tsx
const [selectedDetailInput, setSelectedDetailInput] =
  useState<GetMediaDetailInput | null>(null)

const detailQuery = useMediaDetail(selectedDetailInput)
const detailModel = detailQuery.data?.catalog
  ? toMediaDetailModel(detailQuery.data.catalog)
  : null

function handleSelectMedia(input: GetMediaDetailInput) {
  setSelectedDetailInput(input)
}

function handleCloseDetail() {
  setSelectedDetailInput(null)
}

<MediaSearchResults items={resultItems} onSelect={handleSelectMedia} />

<Modal
  opened={selectedDetailInput !== null}
  onClose={handleCloseDetail}
  title="Detalle del catálogo"
>
  {detailQuery.isLoading && <Skeleton height={320} />}

  {detailQuery.isError && (
    <Alert color="red" title="No pudimos cargar el detalle">
      {detailQuery.error.message}
    </Alert>
  )}

  {detailQuery.isSuccess && detailQuery.data.catalog === null && (
    <Alert color="yellow">Detalle de catálogo no disponible.</Alert>
  )}

  {detailQuery.isSuccess && detailModel !== null && (
    <MediaDetailContent media={detailModel} />
  )}
</Modal>
```

El modal no recibe `selectedDetailInput` para ejecutar el request. `App` entrega el resultado visual correspondiente y conserva el recorrido completo en un solo propietario.

### Estructura esperada del checkpoint

```text
src/
├── adapters/
│   ├── media-catalog-to-detail.ts
│   └── media-search-to-card.ts
├── api/
│   ├── http.ts
│   └── media.ts
├── components/
│   ├── media-detail-content.tsx
│   └── media-search-results.tsx
├── hooks/
│   ├── features/
│   │   └── use-media.ts
│   └── media-keys.ts
├── types/
│   ├── media-api.ts
│   ├── media-detail.ts
│   ├── media-search-card.ts
│   └── media.ts
├── App.tsx
└── main.tsx
```

### Restricciones

- No llamar `fetch` ni `getMediaDetail()` desde el botón o el modal.
- No llamar `useMediaDetail()` dentro de un `if`.
- No copiar `detailQuery.data` a `useState`, Zustand o `localStorage`.
- No guardar `MediaSearchCardModel` completo como selección.
- No convertir el resumen en detalle mediante un cast.
- No usar `useEffect` para abrir, cerrar, solicitar o limpiar.
- No borrar queries al cerrar el modal.
- No introducir rutas ni sincronización con la URL.

### Actividades del docente durante el taller

- Pedir que cada pareja diga primero dónde se origina el callback y dónde se ejecuta.
- Revisar la firma de `onSelect` antes de revisar estilos.
- Solicitar una captura de Devtools cuando la query aún está deshabilitada y otra durante fetching.
- Entregar una identidad inexistente para comprobar que el error no rompe la búsqueda.
- Preguntar quién conserva selección y quién conserva detalle cuando aparezca un segundo estado remoto.
- Comparar Devtools con Network al reabrir el mismo medio.
- Evitar resolver el taller desde el proyector; usar preguntas sobre el recorrido y el tipo esperado.

### Actividades de los estudiantes durante el taller

- Propagar el mismo callback tipado hasta la tarjeta.
- Confirmar el argumento con un log temporal y retirarlo.
- Conservar la identidad mínima en `App`.
- Sustituir la constante de demostración sin duplicar el hook.
- Mover las ramas visuales ya practicadas dentro de `Modal`.
- Probar una película, una serie y una identidad inexistente.
- Cerrar y reabrir un medio mientras observan caché y requests.
- Explicar el recorrido completo a otra pareja.
- Ejecutar el build y guardar las evidencias solicitadas.

### Criterios de aceptación

- Cada tarjeta ofrece una acción “Ver detalle”.
- La selección usa `externalId: string` y `mediaType`; no usa `key`, `id` del fixture ni `logId`.
- La query permanece deshabilitada cuando la selección es `null`.
- El modal abre a partir de la selección y cierra desde un handler de `App`.
- La interfaz distingue carga, error, `catalog: null` y éxito.
- `MediaDetailContent` recibe `MediaDetailModel`, no el resumen ni el DTO raíz.
- Película y serie muestran solo los campos que poseen.
- Cerrar mantiene visibles los resultados y conserva la entrada de detalle en caché.
- Reabrir el mismo medio permite observar un acierto de caché (`cache hit`) durante el `staleTime` docente.
- No existen Effects, fetches en componentes ni copias del DTO remoto.
- `pnpm build` termina sin errores.

### Entrega

Cada estudiante o pareja entrega:

- Código del checkpoint.
- Captura de una key de búsqueda y una key de detalle en Devtools.
- Captura o grabación breve del modal en carga y éxito.
- Respuesta de tres líneas: qué guarda React, qué guarda TanStack Query y qué ocurre con la caché al cerrar.

### Reto adicional

Añadir un botón “Reintentar” dentro del estado de error que ejecute `detailQuery.refetch()`. El estudiante debe explicar por qué repetir la misma query después de un fallo no equivale a usar `refetch()` como mecanismo inicial de selección.

Si sobra tiempo, puede mostrar “Ya está en tu biblioteca” cuando `detailQuery.data.isLogged` sea verdadero. La rama pública devolverá `false` durante esta fase; el reto solo conserva la interfaz para comprobar el contrato.

## Revisión y demostración · 15 minutos

| Tiempo | Responsable | Actividad y comprobación |
| --- | --- | --- |
| 0-8 min | Parejas | Intercambiar proyectos y comprobar los criterios con una película, una serie y cierre/reapertura. |
| 8-10 min | Docente | Forzar una identidad inexistente y pedir que el grupo identifique si falló búsqueda o detalle mediante la key. |
| 10-15 min | Docente y grupo | Volver al deck, responder las cuatro preguntas de cierre y conectar el título del modal con `document.title`. |

La suma total es `75 + 30 + 60 + 15 = 180` minutos.

## Evidencia de salida de la clase

- El seed inicial coincide con el checkpoint 08 y omite la solución.
- El checkpoint alternativo compila y contiene todo lo explicado antes del descanso.
- `mediaKeys.detail()` separa detalles por `externalId` y `mediaType`.
- `useMediaDetail()` no ejecuta el fetcher con input `null`.
- El DTO de detalle continúa dentro de TanStack Query.
- El adaptador produce un modelo visual sin inventar datos.
- `MediaDetailContent` funciona dentro del modal y podrá reutilizarse en la futura página pública.
- La selección permanece como estado local mínimo de `App`.
- El estudiante distingue una query inactiva de una query eliminada.
- Devtools y Network aportan evidencias distintas de caché y requests.
- El proyecto compila y el estudiante explica el flujo con una identidad concreta.

## Errores frecuentes y respuesta docente

### “¿Por qué no guardamos la tarjeta completa para abrir el modal?”

La tarjeta solo contiene un resumen. Guardar su identidad basta para consultar el detalle y evita que `App` mantenga otra copia de información remota.

### “¿Por qué usamos `GetMediaDetailInput` como selección?”

Ese tipo ya expresa los dos valores mínimos que la interacción debe entregar al fetcher. Crear otro contrato igual añadiría un nombre sin crear una responsabilidad distinta.

### “¿Podemos llamar el hook solo cuando el modal esté abierto?”

Los hooks deben conservar el mismo orden entre renders. `App` llama siempre `useMediaDetail`; `enabled` impide ejecutar la query function cuando falta identidad.

### “La query dice pending antes del clic. ¿Está buscando?”

No. `fetchStatus: idle` confirma que la función no se ejecuta. La primera carga activa se representa con `isLoading`.

### “¿Por qué `catalog` puede ser null si la query terminó con éxito?”

El éxito pertenece al objeto raíz devuelto por el endpoint. Su contrato permite una respuesta sin catálogo. La interfaz conserva ese caso y muestra un estado específico.

### “¿Por qué el modal no usa `MediaSearchCardModel`?”

El resumen no contiene la información que promete el detalle. El modal representa el modelo derivado del DTO de detalle.

### “¿Cerrar debería eliminar el dato para liberar memoria?”

TanStack Query administra cuándo una query inactiva sale de caché. La pantalla solo elimina la selección. Borrar manualmente impediría observar reutilización y mezclaría responsabilidades.

### “¿Por qué no usamos Zustand si otra vez pasamos un callback?”

`App` sigue conteniendo resultados y modal. El drawer futuro podrá abrirse desde páginas y ramas alejadas; allí aparecerá el caso de uso del store.

### “¿El botón Reintentar contradice que evitamos `refetch()`?”

No. Reintentar repite la query actual después de un error. La selección inicial continúa siendo declarativa: cambiar la identidad habilita una key específica.

## Vocabulario

- **Query dependiente:** consulta que espera una condición o un dato previo antes de ejecutar su función.
- **Identidad mínima:** conjunto más pequeño de valores que identifica el recurso solicitado; aquí, `externalId + mediaType`.
- **Selector:** valor de interfaz que indica qué recurso eligió el usuario. En esta clase adopta la forma de `GetMediaDetailInput`.
- **Query activa:** consulta que tiene al menos un observador montado y habilitado.
- **Query inactiva:** entrada sin observadores activos que TanStack Query conserva temporalmente en caché.
- **Cache hit:** lectura que encuentra una entrada previa asociada a la misma query key.
- **DTO raíz:** objeto completo devuelto por el endpoint; contiene `catalog` e `isLogged`.
- **Catálogo ausente:** respuesta exitosa cuyo campo `catalog` es `null`.
- **Modelo visual:** forma preparada para la responsabilidad de presentación de un componente.
- **Modal controlado:** diálogo cuya apertura y cierre dependen de props entregadas por su propietario.
- **Skeleton:** representación temporal de la forma aproximada que ocupará el contenido.
- **Reintento:** nueva ejecución de la misma consulta después de un fallo.

## Fuera del alcance

- Rutas, parámetros y página pública recargable.
- Sincronización con `document.title` mediante `useEffect`.
- Autenticación, token Bearer y datos reales de una biblioteca personal.
- `logId` y detalle privado.
- Agregar, editar o eliminar medios.
- Invalidación.
- Zustand y drawer compartido.
- Guardar selección o respuestas en almacenamiento local.
- `skipToken`, Suspense, prefetch y carga de rutas.
- Adaptación de todos los campos que devuelve el backend.
- Tests automatizados del hook o del modal.

## Referencias docentes

- [TanStack Query · Dependent Queries](https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries)
- [TanStack Query · Disabling and Pausing Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)
- [TanStack Query · Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Mantine · Modal](https://mantine.dev/core/modal/)
