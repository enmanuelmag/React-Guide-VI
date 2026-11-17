# Clase 08 · TanStack Query, query keys y búsqueda remota

- **Semana:** 3
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** fetchers tipados de búsqueda y detalle creados en la clase 07; el explorador local de la clase 06 todavía funciona como referencia
- **Checkpoint de salida:** búsqueda remota de películas o series con caché observable, adaptación del DTO y estados inicial, carga, error, vacío y éxito

## Resultado de aprendizaje

Al terminar, el estudiante podrá configurar TanStack Query en una aplicación React, describir una consulta mediante una query key y una query function, separar los valores que escribe de los parámetros que envía, y transformar un DTO remoto en un modelo visual sin duplicar la respuesta en estado local.

## Limitación que abre la clase

La clase 07 ya puede solicitar resultados, pero el `ApiProbe` era temporal: ejecutaba los fetchers, permitía inspeccionar Network y luego desaparecía. La aplicación aún no representa qué ocurre mientras espera, cuando falla o cuando la respuesta está vacía.

La nueva responsabilidad se incorpora sin conectar todavía el detalle:

```text
clase 07
formulario local y modal local permanecen
fetchers tipados → API → resultado observado en Network

clase 08
formulario remoto → TanStack Query → DTO en caché
                                      ↓
                                  adaptador puro
                                      ↓
                           resultados visuales de búsqueda

clase 09
resultado seleccionado → URL pública con React Router

clase 10
parámetros de URL → query de detalle → página pública
```

El modal local construido en la semana 2 no se elimina del proyecto, pero deja de formar parte del árbol activo durante este checkpoint. Cumplió su objetivo de enseñar callbacks y propiedad del estado; el detalle remoto final vivirá en una página con URL propia.

## Conceptos

- Estado local frente a estado remoto.
- Servidor como fuente de verdad del catálogo.
- Caché del cliente.
- `QueryClient` y `QueryClientProvider`.
- Query key y query function.
- Hook de feature sobre `useQuery`.
- Consulta diferida mediante `enabled`.
- Borrador frente a búsqueda enviada.
- Estados inicial, carga, error, vacío y éxito.
- Diferencia entre `status` y `fetchStatus`.
- `isLoading`, `isPending` e `isFetching` en TanStack Query v5.
- DTO, adaptador puro y modelo visual.
- Estado derivado durante el render.
- React Query Devtools como instrumento de observación.

## Precondiciones

- La rama docente permite ejecutar anónimamente `POST /api/v2/media/search`.
- `VITE_API_URL`, `requestJson<T>` y `searchMedia()` funcionan desde el checkpoint 07.
- `MediaSearchItemDto`, `SearchMediaInput` y `MediaType` ya están definidos.
- La aplicación solo admite `movie` y `series`; el formulario remoto no ofrece `all` ni `anime`.
- El proyecto se ejecuta con `pnpm`.

Antes de la clase, el docente prueba al menos una búsqueda con resultados, una sin resultados y un fallo controlado. El taller no debe depender de descubrir durante la sesión que la rama remota conserva autenticación obligatoria o que CORS bloquea el origen del curso.

## Contratos que se conectan

El fetcher de la clase 07 devuelve:

```ts
export type MediaSearchItemDto = {
  externalId: string
  title: string
  releaseYear: number
  coverUrl: string | null
  mediaType: MediaType
  isLogged: boolean
}
```

Ese DTO describe el transporte. La lista no debe fingir que recibió un `MediaItem`: el resultado no incluye `description`, su identidad es externa y algunos nombres no pertenecen al vocabulario visual.

La clase introduce un modelo específico para las tarjetas de búsqueda:

```ts
import type { MediaType } from "./media"

export type MediaSearchCardModel = {
  key: string
  externalId: string
  mediaType: MediaType
  title: string
  releaseLabel: string
  posterUrl: string | null
  isLogged: boolean
}
```

`key` se construye con `${mediaType}:${externalId}` y se usa únicamente como identidad estable de React dentro de la lista. No reemplaza la identidad pública que necesitará el endpoint de detalle.

### Tres responsabilidades diferentes

| Pieza | Describe | No debe hacer |
| --- | --- | --- |
| `MediaSearchItemDto` | La parte consumida de la respuesta HTTP | Adoptar nombres de presentación inventados por la interfaz |
| `toMediaSearchCardModel()` | La traducción explícita entre transporte y presentación | Solicitar datos, guardar estado o abrir el modal |
| `MediaSearchResults` | Cómo se representan los modelos visuales | Conocer el body HTTP ni convertir tipos mediante casts |

El adaptador no “completa” información ausente. Si búsqueda no devuelve descripción, la tarjeta remota no muestra una descripción ficticia ni reutiliza la de un fixture.

## Guion de presentación

### Propósito y duración

La recapitulación y apertura conceptual ocupan 28 minutos. Los primeros 10 recuperan el contrato HTTP y el probe de la clase 07. Los siguientes 18 presentan estado remoto, caché, query keys, consultas diferidas y adaptación. Los últimos 6 minutos regresan al deck para reconstruir el recorrido y distinguir lo que pertenece a la clase 09.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Ya sabemos pedir; todavía no sabemos representar | Recuperar `searchMedia(input) → requestJson<T> → API`. El probe comprobó el contrato, pero no dejó una experiencia de usuario. | Captura de Network de la clase 07 y captura del explorador local. Preguntar dónde mostrarían “cargando” sin implementar todavía. |
| Problema | Una petición produce más que datos | Una pantalla remota necesita conocer si nunca buscó, si espera, si falló, si obtuvo cero elementos o si obtuvo resultados. También debe evitar repetir trabajo innecesario. | Cinco cuadros de interfaz con el mismo formulario y cuerpos distintos. |
| Distinción | Estado local y estado remoto no tienen el mismo dueño | React controla el texto y el tipo que el usuario prepara. El servidor sigue siendo la fuente de verdad del catálogo; TanStack Query mantiene una caché local de esa información remota. | Tabla “borrador del usuario” frente a “respuesta del servidor”. Evitar decir que TanStack Query reemplaza todo `useState`. |
| Concepto | Una query es una descripción declarativa | La query key identifica la consulta y la query function sabe ejecutarla. Cuando cambia una variable incluida en la key, se describe otra entrada de caché. | Fórmula visual `key + function → estado de consulta`. |
| Identidad | La key incluye lo que usa la función | `query` y `mediaType` modifican el request; ambos deben aparecer en la key. Buscar `Dune` como película y como serie son consultas distintas. | Dos cajas de caché: `movie` y `series`. Mostrar la key como arreglo serializable. |
| Interacción | Escribir no significa enviar | `draftQuery` y `draftMediaType` cambian con los controles. El submit captura ambos en `submittedSearch`. La petición nace de esa descripción enviada, no de cada tecla. | Línea de tiempo escribir → elegir tipo → enviar → consultar. Contrastar con un `refetch()` imperativo en el botón. |
| Estado | `pending` no siempre significa “hay red” | En v5, una query deshabilitada y sin datos puede estar `pending` con `fetchStatus: idle`. `isLoading` representa la primera carga efectiva de una consulta diferida; `isFetching` indica que su función se está ejecutando. | Matriz pequeña de `status` y `fetchStatus`. Este contraste debe sobrevivir a las diapositivas. |
| Frontera | Si ya tenemos el DTO, ¿por qué crear otro objeto? | El DTO conserva el contrato de transporte; el modelo visual conserva el contrato que necesita la tarjeta. El adaptador cambia nombres, prepara texto y selecciona la identidad útil sin mutar el DTO. Si cambia la forma remota, esta frontera concentra el ajuste y evita repartirlo entre componentes. Su salida se deriva durante el render: no constituye otra fuente de verdad. | Diagrama `DTO en caché → toMediaSearchCardModel → CardModel → tarjeta`. Señalar `coverUrl → posterUrl` y `releaseYear → releaseLabel`. Mostrar debajo `derivar ≠ guardar`. |
| Herramienta | Devtools hace visible la caché | Cada key posee estado, datos y tiempos observables. Repetir una búsqueda permite examinar si existe una entrada previa. | Captura de React Query Devtools con dos keys. No convertir la herramienta en sustituto de Network. |
| Límite | Búsqueda no es detalle | La tarjeta conserva `externalId` y `mediaType`, pero todavía no navega. La sesión 09 introducirá la URL pública y la sesión 10 conectará la consulta de detalle. | Diagrama con ambos tramos atenuados. Recordar por qué Zustand tampoco es necesario todavía. |

### Indicaciones que deben sobrevivir a la producción de slides

- TanStack Query no es una API de React ni un reemplazo universal de `useState`. Administra trabajo asíncrono y estado remoto.
- La caché es una copia gestionada en el cliente; el servidor continúa siendo la fuente de verdad del catálogo.
- `QueryClient` contiene la caché y la configuración compartida. `QueryClientProvider` la vuelve accesible para los hooks descendientes.
- El `QueryClient` se crea fuera del componente. Crearlo dentro de `App` permitiría generar un cliente nuevo durante renders o remontajes y perder la continuidad esperada de la caché.
- La query key es un arreglo serializable. Debe incluir cada variable que consume la query function: en esta clase, texto normalizado y tipo de medio.
- La query function devuelve la Promise de `searchMedia()` y propaga el error que `requestJson<T>` lanza cuando `response.ok` es falso.
- `draftQuery` y `draftMediaType` pertenecen al formulario. `submittedSearch` representa la última intención enviada.
- El tipo elegido se captura junto con el texto. Cambiarlo después del submit no altera retroactivamente la búsqueda activa.
- `enabled` impide ejecutar una consulta cuyo texto normalizado todavía no tiene dos caracteres.
- En una query deshabilitada sin caché, `status` puede ser `pending` aunque `fetchStatus` sea `idle`. Por eso la interfaz no usa `isPending` aislado como pantalla de carga.
- `isLoading` equivale a la primera carga efectiva: se deriva de `isPending && isFetching`.
- `isFetching` también puede ser verdadero durante una actualización en segundo plano aunque ya existan datos. Ese indicador secundario se menciona, pero no se convierte en requisito del checkpoint.
- “Vacío” es una respuesta exitosa con arreglo de longitud cero; no es un error.
- Los datos permanecen como DTO dentro de la query. `data.map(toMediaSearchCardModel)` produce el modelo visual durante el render.
- Derivar no significa guardar. No se usa `setResults(data)`, `useEffect`, Zustand ni `localStorage` para copiar la respuesta.
- El adaptador es una función pura: para el mismo DTO produce el mismo modelo, sin consultar API, abrir modal ni cambiar estado.
- El modelo visual no se crea por obligación. Se justifica aquí porque la tarjeta necesita otros nombres, una etiqueta preparada, una identidad compuesta y menos campos que el contrato remoto.
- El componente depende del modelo visual. Un cambio de transporte como `coverUrl` exige revisar el DTO y el adaptador, pero no obliga a enseñar ese nombre remoto a cada tarjeta.
- `releaseYear` se convierte en una etiqueta. Si el backend entrega `0`, se muestra “Fecha desconocida”; no se inventa un año.
- `coverUrl` puede ser `null`. La tarjeta conserva un fallback visual, igual que los componentes anteriores.
- `externalId` y `mediaType` sobreviven al adaptador porque juntos formarán la URL en la sesión 09 y permitirán pedir el detalle en la sesión 10.
- `isLogged` puede ser siempre `false` antes de integrar autenticación. Se conserva porque forma parte del contrato usado y luego permitirá distinguir un medio ya guardado.
- React Query Devtools muestra la caché de TanStack Query; Network sigue mostrando los requests HTTP reales.
- La configuración `retry: false` hace predecible la demostración de errores. Es una decisión docente para esta etapa, no una regla universal de producción.
- `staleTime` de cinco minutos permite repetir una búsqueda y observar reutilización de caché sin explicar todavía cada política de actualización.
- No se llama `refetch()` desde el submit. Cambiar `submittedSearch` produce declarativamente la key que debe observar el hook.
- La clase no invalida queries: todavía no existe una mutación que vuelva obsoleta una lista.
- Zustand se reservará para el modal global de creación de la sesión 11, que podrá abrirse desde búsqueda y detalle público. La respuesta HTTP no se mudará a ese store.

### Cierre conceptual

El cierre recupera cinco preguntas:

1. ¿Qué dato pertenece a React y qué dato pertenece a TanStack Query durante la búsqueda?
2. ¿Por qué la query key incluye tanto el texto como `mediaType`?
3. ¿Por qué `isPending` aislado puede mostrar una carga que todavía no comenzó?
4. ¿Qué problema resuelve el adaptador y por qué su salida no se guarda en otro estado?
5. ¿Qué información ya conserva la tarjeta para construir después la URL y solicitar el detalle?

La última respuesta debe nombrar `externalId` y `mediaType`, no la `key` visual ni el `id` del fixture.

## Flujo del código

### Estado 1 · Instalar y proveer TanStack Query

El grupo instala las dependencias con pnpm:

```bash
pnpm add @tanstack/react-query
pnpm add @tanstack/react-query-devtools
```

En `src/main.tsx`, el cliente se crea a nivel de módulo:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

Si el checkpoint usa `MantineProvider`, se conserva dentro de `QueryClientProvider` y alrededor de `App`. El orden exacto entre providers responde a qué descendientes necesitan cada contexto; el `QueryClientProvider` debe contener cualquier componente que llame hooks de TanStack Query.

El docente reabre la explicación de `StrictMode` de la clase 04: sus comprobaciones adicionales ocurren en desarrollo. No se atribuye a TanStack Query cualquier render o request observado sin revisar primero la key, el estado y Network.

### Estado 2 · Crear una familia de query keys

El archivo `src/hooks/media-keys.ts` centraliza la identidad de las consultas:

```ts
import type { MediaType } from "../types/media"

export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  search: (query: string, mediaType: MediaType) =>
    [...mediaKeys.searches(), { query, mediaType }] as const,
}
```

La familia permite leer la jerarquía sin introducir invalidaciones antes de tiempo:

```text
["media"]
└── ["media", "search"]
    ├── ["media", "search", { query: "dune", mediaType: "movie" }]
    └── ["media", "search", { query: "dune", mediaType: "series" }]
```

`as const` conserva una tupla de literales de solo lectura. La clase no profundiza todavía en inferencia avanzada; su propósito visible es mantener precisa la forma de la key.

### Estado 3 · Encapsular `useQuery` en un hook de feature

El archivo `src/hooks/features/use-media.ts` conecta la key con el fetcher:

```ts
import { useQuery } from "@tanstack/react-query"

import { searchMedia } from "../../api/media"
import type { SearchMediaInput } from "../../types/media-api"
import { mediaKeys } from "../media-keys"

export function useMediaSearch(search: SearchMediaInput | null) {
  const query = search?.query.trim() ?? ""
  const mediaType = search?.mediaType ?? "movie"

  return useQuery({
    queryKey: mediaKeys.search(query, mediaType),
    queryFn: () => searchMedia({ query, mediaType }),
    enabled: query.length >= 2,
  })
}
```

El valor por defecto de `mediaType` solo permite construir una key válida cuando todavía no existe submit. `enabled` mantiene inactiva esa consulta vacía. El hook no recibe setters, no conoce inputs visuales y no transforma el DTO.

### Estado 4 · Separar borrador y búsqueda enviada

`App` conserva tres piezas de estado local:

```tsx
import { useState, type FormEvent } from "react"

const [draftQuery, setDraftQuery] = useState("")
const [draftMediaType, setDraftMediaType] = useState<MediaType>("movie")
const [submittedSearch, setSubmittedSearch] =
  useState<SearchMediaInput | null>(null)

const mediaSearch = useMediaSearch(submittedSearch)
```

El submit valida la precondición mínima y captura una nueva intención:

```tsx
function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const query = draftQuery.trim()

  if (query.length < 2) {
    return
  }

  setSubmittedSearch({
    query,
    mediaType: draftMediaType,
  })
}
```

El formulario reutiliza `SearchInput` si su API controlada continúa siendo adecuada. El selector anterior de filtros se ajusta o se reemplaza por `MediaTypeSelect`, limitado a película y serie:

```text
escribir “Dune”
→ draftQuery cambia
→ no hay request

elegir “Serie”
→ draftMediaType cambia
→ no hay request

enviar formulario
→ submittedSearch recibe ambos valores
→ cambia la query key observada
→ TanStack Query ejecuta searchMedia
```

No se conserva la opción `all`: el endpoint necesita decidir en qué catálogo busca. Más adelante, un filtro de una lista ya guardada sí puede volver a usar “todos”.

### Estado 5 · Definir el modelo visual y el adaptador

`src/types/media-search-card.ts` contiene `MediaSearchCardModel`. Después, `src/adapters/media-search-to-card.ts` implementa la transformación:

```ts
import type { MediaSearchItemDto } from "../types/media-api"
import type { MediaSearchCardModel } from "../types/media-search-card"

export function toMediaSearchCardModel(
  item: MediaSearchItemDto,
): MediaSearchCardModel {
  return {
    key: `${item.mediaType}:${item.externalId}`,
    externalId: item.externalId,
    mediaType: item.mediaType,
    title: item.title,
    releaseLabel:
      item.releaseYear > 0 ? String(item.releaseYear) : "Fecha desconocida",
    posterUrl: item.coverUrl,
    isLogged: item.isLogged,
  }
}
```

La función no muta `item`. Tampoco usa `as MediaItem`, no inventa `description` y no convierte `externalId` en el `id` numérico del fixture.

### Estado 6 · Representar resultados sin selección

`src/components/media-search-results.tsx` recibe únicamente modelos visuales:

```tsx
import { Badge, Card, Image, SimpleGrid, Text } from "@mantine/core"

import type { MediaSearchCardModel } from "../types/media-search-card"

type MediaSearchResultsProps = {
  items: MediaSearchCardModel[]
}

export function MediaSearchResults({ items }: MediaSearchResultsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
      {items.map((item) => (
        <Card key={item.key} withBorder>
          {item.posterUrl ? (
            <Image alt={`Portada de ${item.title}`} src={item.posterUrl} />
          ) : (
            <Text c="dimmed">Sin portada disponible</Text>
          )}
          <Text fw={600}>{item.title}</Text>
          <Text c="dimmed">{item.releaseLabel}</Text>
          <Badge variant="light">
            {item.mediaType === "movie" ? "Película" : "Serie"}
          </Badge>
          {item.isLogged && <Badge color="green">En tu lista</Badge>}
        </Card>
      ))}
    </SimpleGrid>
  )
}
```

No se añade `onSelect` ni un botón de detalle. Esa ausencia es intencional: permite que el taller 09 introduzca la selección como un nuevo flujo visible.

### Estado 7 · Derivar y representar los cinco estados

`App` transforma los datos únicamente cuando existen:

```tsx
const resultItems =
  mediaSearch.data?.map(toMediaSearchCardModel) ?? []
```

Después del formulario, la región de resultados sigue este orden:

```tsx
{submittedSearch === null && (
  <Text c="dimmed">Escribe un título y envía la búsqueda.</Text>
)}

{submittedSearch !== null && mediaSearch.isLoading && (
  <Text>Buscando en el catálogo…</Text>
)}

{submittedSearch !== null && mediaSearch.isError && (
  <Alert color="red" title="No pudimos buscar">
    {mediaSearch.error.message}
  </Alert>
)}

{submittedSearch !== null && mediaSearch.isSuccess && resultItems.length === 0 && (
  <Text>No encontramos resultados para esta búsqueda.</Text>
)}

{submittedSearch !== null && mediaSearch.isSuccess && resultItems.length > 0 && (
  <MediaSearchResults items={resultItems} />
)}
```

El orden empieza por la intención de búsqueda, no por `isPending`. Así evita mostrar “Buscando…” antes del primer submit. Para mantener el foco, el checkpoint base no agrega skeletons, retry manual ni indicador de actualización en segundo plano.

### Estado 8 · Observar la caché

Con Devtools y Network abiertos, el grupo ejecuta este experimento:

1. Buscar `Dune` como película.
2. Observar la key, el arreglo recibido y el request correspondiente.
3. Buscar `Dune` como serie.
4. Confirmar que aparece otra entrada porque cambió `mediaType`.
5. Volver a `Dune` como película y observar la entrada ya conocida durante el `staleTime` docente.

El docente distingue dos evidencias: Devtools demuestra qué mantiene TanStack Query; Network demuestra si hubo un request HTTP. No se promete “cero requests siempre”, porque políticas como stale time, foco de ventana o invalidación pueden volver a ejecutar una query en otras configuraciones.

### Estructura esperada del checkpoint

```text
src/
├── adapters/
│   └── media-search-to-card.ts
├── api/
│   ├── http.ts
│   └── media.ts
├── components/
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

Los componentes y fixtures anteriores pueden continuar en el repositorio para el taller siguiente. No deben renderizar simultáneamente una segunda fuente de resultados que haga ambiguo qué lista pertenece a la API.

## Secuencia sugerida

| Tiempo | Responsable | Actividad y comprobación |
| --- | --- | --- |
| 0-10 min | Docente y grupo | Recuperar los fetchers de la clase 07, clasificar borrador y respuesta como estado local o remoto, y formular los cinco estados visuales pendientes. |
| 10-28 min | Docente con participación | Usar el deck para explicar caché, Query Client, key, function, consulta diferida, estados v5 y frontera DTO–modelo visual. |
| 28-42 min | Construcción guiada | Instalar las dos dependencias, crear un `QueryClient` estable, envolver la aplicación y abrir Devtools. |
| 42-57 min | Docente y estudiantes | Crear `mediaKeys`, comparar película y serie, y justificar por qué todas las variables de `searchMedia` aparecen en la key. |
| 57-72 min | Práctica guiada | Implementar `useMediaSearch`, normalizar el texto y usar `enabled`; inspeccionar el estado inicial sin confundirlo con carga. |
| 72-87 min | Construcción interactiva | Separar `draftQuery`, `draftMediaType` y `submittedSearch`; conectar el submit sin `refetch()` y retirar `all` del selector remoto. |
| 87-102 min | Docente con participación | Definir `MediaSearchCardModel`, implementar el adaptador y representar estados inicial, carga, error, vacío y éxito. |
| 102-114 min | Actividad estudiantil | Ejecutar el experimento de caché con `Dune` como película y serie; registrar key, status, fetchStatus y presencia de request. |
| 114-120 min | Docente y grupo | Ejecutar `pnpm build`, volver al deck, reconstruir el flujo completo y delimitar selección y detalle para la clase 09. |

La suma es de 120 minutos.

## Actividades del docente

- Hacer visible que el probe resolvía comunicación, pero no una interfaz remota completa.
- Clasificar con el grupo qué estado pertenece al formulario y cuál describe al servidor.
- Dibujar `QueryClient → provider → hook` antes de instalar la dependencia.
- Crear el cliente una sola vez y explicar el propósito docente de `retry` y `staleTime`.
- Construir primero dos keys concretas y después presentar la familia `mediaKeys`.
- Mostrar una consulta deshabilitada para contrastar `status: pending` con `fetchStatus: idle`.
- Conectar el submit por cambio de parámetros, no mediante un botón que llame `refetch()`.
- Preguntar qué campos necesita la nueva lista antes de definir el modelo visual.
- Escribir el adaptador junto al grupo y rechazar de forma explícita `as MediaItem`.
- Provocar un resultado vacío y un error controlado para que ambos estados sean visibles.
- Guiar el experimento de caché usando Devtools y Network como evidencias distintas.
- Cerrar sin añadir navegación, detalle remoto, invalidaciones ni Zustand.

## Actividades de los estudiantes

- Reconstruir el recorrido de `searchMedia()` y señalar qué responsabilidad faltaba después del probe.
- Clasificar `draftQuery`, `submittedSearch`, `data` y `error` según su dueño.
- Predecir si dos búsquedas con igual texto y diferente tipo deben compartir caché.
- Completar una query key que incluya texto y tipo de medio.
- Explicar por qué una consulta deshabilitada no debe representarse con `isPending` aislado.
- Implementar o completar `useMediaSearch` con `enabled`.
- Conectar el formulario para que escribir no produzca requests.
- Marcar las diferencias entre `MediaSearchItemDto` y `MediaSearchCardModel`.
- Completar una parte del adaptador, incluida la etiqueta de año desconocido.
- Construir al menos uno de los estados vacío o error siguiendo el orden definido.
- Ejecutar el experimento de caché y registrar qué cambió en Devtools y Network.
- Verificar que no existe una copia de `mediaSearch.data` en otro estado.

## Evidencia de salida

- `@tanstack/react-query` y sus Devtools están instalados con pnpm.
- Existe un único `QueryClient` estable y la aplicación se encuentra dentro de `QueryClientProvider`.
- `mediaKeys.search()` incluye texto normalizado y `mediaType`.
- `useMediaSearch()` conecta esa key con `searchMedia()` y usa `enabled` para inputs insuficientes.
- El formulario separa borrador y búsqueda enviada; escribir no dispara requests.
- El selector remoto solo ofrece película y serie.
- La caché conserva `MediaSearchItemDto[]` y no una versión forzada de `MediaItem[]`.
- `toMediaSearchCardModel()` transforma nombres y presentación sin mutar ni inventar campos.
- La salida adaptada se deriva durante el render y no se copia a `useState`, Zustand ni `localStorage`.
- La interfaz distingue no enviado, carga real, error, éxito vacío y éxito con resultados.
- Devtools contiene keys distintas para la misma consulta textual como película y como serie.
- `MediaSearchResults` todavía no recibe `onSelect` y no abre detalle.
- No se usa `useEffect` para fetching, sincronizar `data` ni limpiar el formulario.
- `pnpm build` termina sin errores.

## Errores frecuentes y respuesta docente

### “Si `status` dice `pending`, ¿por qué no aparece el loading?”

Porque la consulta puede estar pendiente de tener permiso para ejecutarse y, al mismo tiempo, no estar haciendo fetching. En una consulta diferida, `isLoading` expresa la primera carga efectiva al combinar el estado pendiente con una función en ejecución.

### “¿Por qué no llamamos `refetch()` en el botón?”

El submit ya produce los parámetros que describen la consulta. Al cambiar `submittedSearch`, cambia la key observada y TanStack Query sabe qué ejecutar o reutilizar. Así la fuente de la consulta continúa siendo declarativa.

### “¿Por qué necesitamos tres estados si solo hay un input y un selector?”

El texto y el tipo son dos borradores controlados. El tercer estado captura la pareja que se envió. Sin esa separación, cada tecla o cambio de selector modificaría la consulta activa.

### “¿No podemos guardar `data` en otro `useState` para que sea más fácil?”

Eso crearía dos copias con posibles momentos distintos de actualización. TanStack Query ya conserva la respuesta; la interfaz puede derivar los modelos visuales directamente de `data`.

### “¿Por qué no renderizamos el DTO tal como llega?”

Podríamos hacerlo cuando el componente necesite exactamente la misma forma y los mismos nombres. Aquí ya existe una diferencia real: el backend entrega `coverUrl` y `releaseYear`; la tarjeta consume `posterUrl` y `releaseLabel`, además de una `key` compuesta. El adaptador concentra esa traducción y evita fingir que el DTO contiene propiedades ausentes como `description`. El resultado se calcula desde el DTO; no se guarda como otra copia.

### “¿Por qué no reutilizamos `MediaCard`?”

La tarjeta local fue diseñada alrededor de `MediaItem` y de una selección que abría un modal local. La tarjeta remota tiene menos información y todavía no selecciona. Forzar su reutilización introduciría props opcionales o casts antes de que exista una responsabilidad compartida estable.

### “¿Por qué no usamos Zustand para la búsqueda?”

El formulario pertenece a esta pantalla y TanStack Query ya administra la respuesta remota. Zustand aparecerá en la sesión 11, cuando búsqueda y detalle público necesiten abrir el mismo modal de creación; no sustituirá la caché de consultas.

### “¿Un resultado vacío significa que el endpoint falló?”

No. Un arreglo vacío es una respuesta exitosa sin coincidencias. El error representa una Promise rechazada, por ejemplo porque el fetcher recibió un status no exitoso.

### “¿Devtools reemplaza la pestaña Network?”

No. Devtools muestra consultas y caché. Network confirma el request HTTP, su payload, su status y su response.

## Vocabulario

- **Estado local:** información controlada por la interacción de esta interfaz, como el texto aún no enviado.
- **Estado remoto:** información cuya fuente de verdad vive fuera de la aplicación, como el catálogo del servidor.
- **Caché:** copia gestionada de resultados asociados a una identidad de consulta.
- **Query Client:** objeto que contiene la caché y coordina el comportamiento de las consultas.
- **Provider:** componente que ofrece un valor compartido a sus descendientes mediante contexto.
- **Query key:** arreglo serializable que identifica de forma única los datos de una consulta.
- **Query function:** función asíncrona que obtiene los datos correspondientes a una key.
- **Consulta diferida:** consulta que espera una condición antes de poder ejecutarse.
- **`enabled`:** opción que habilita o deshabilita automáticamente la ejecución de una consulta.
- **`status`:** estado lógico de los datos de una query: pendiente, error o éxito.
- **`fetchStatus`:** estado de ejecución de su función: fetching, paused o idle.
- **`isLoading`:** primera carga activa de una consulta; en v5 se deriva de pending y fetching.
- **`isFetching`:** indica que la query function se encuentra en ejecución, incluso si ya había datos.
- **Dato fresco:** resultado que no se considera obsoleto durante su `staleTime`.
- **DTO:** forma usada para transportar información entre servidor y cliente.
- **Modelo visual:** forma preparada para las necesidades concretas de presentación de un componente.
- **Adaptador:** función que traduce explícitamente una forma de datos a otra.
- **Función pura:** función sin efectos externos cuya salida depende de sus argumentos.
- **Estado derivado:** valor calculado a partir de datos existentes durante el render.

## Fuera del alcance

- Navegación desde un resultado y consulta de detalle.
- Modal global de creación y store de Zustand.
- Agregar un medio a la lista personal.
- Mutaciones, invalidaciones.
- Autenticación y `isLogged: true` real para un usuario.
- Filtro `all` dentro de la búsqueda remota.
- Sincronización del formulario con la URL.
- `useEffect` para fetching o copia de respuestas.
- `useSuspenseQuery`, Suspense, streaming y SSR.
- Prefetch, paginación, consultas infinitas y cancelación manual.
- Configuraciones completas de retry, garbage collection o actualización por foco.
- Validación runtime del response con Zod.
- Pruebas automatizadas de hooks.

## Referencias docentes

- [TanStack Query · Installation](https://tanstack.com/query/latest/docs/framework/react/installation)
- [TanStack Query · QueryClientProvider](https://tanstack.com/query/latest/docs/framework/react/reference/QueryClientProvider)
- [TanStack Query · Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query · Query Functions](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
- [TanStack Query · Disabling and Pausing Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)
- [TanStack Query · `useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [TanStack Query · Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [TanStack Query · Migrating to v5](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5)
