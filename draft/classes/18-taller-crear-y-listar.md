# Clase 18 · Taller de crear y listar

- **Semana:** 6
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** proyecto semilla `s06-c18-crear-listar-seed` con autenticación, búsqueda, detalle y creación remota; `/app/library` todavía contiene un placeholder y no ejecuta una query
- **Checkpoint de salida:** una persona puede buscar una película o serie, agregarla, abrir su biblioteca privada y encontrar el registro dentro de una lista ordenada por fecha de lanzamiento

## Resultado de aprendizaje

Al terminar, el estudiante podrá conectar una primera query privada, adaptar sus DTO a una lista visual y explicar por qué crear invalida la biblioteca mientras cerrar sesión elimina de la caché los datos asociados a la sesión anterior.

## Pregunta que organiza la clase

> Ya podemos guardar un medio. ¿Qué lecturas quedaron desactualizadas y cómo evitamos que otra sesión encuentre datos privados en la caché del navegador?

## Progresión desde las clases anteriores

```text
clase 16
formulario → body válido, todavía local

clase 17
body → POST create → invalida búsqueda y detalle → isLogged: true

clase 18
POST create → invalida también lists()
             → POST biblioteca privada
             → DTO[] → adaptador → lista visual
             → logout elimina mediaKeys.all
```

La clase 17 no podía invalidar una familia de listas que todavía no existía. En esta clase aparece su primer consumidor real y, con él, `mediaKeys.lists()`.

## Conceptos que se enseñan y consolidan

### Concepto principal

- Primera query privada de la aplicación.
- Familia de query keys para listas.
- Diferencia entre invalidar datos desactualizados y eliminar datos de una sesión terminada.

### Conceptos que se aplican

- Contrato HTTP, body y DTO mínimo.
- `authScope` como parte de una identidad de caché dependiente del usuario.
- Estados pendiente, error, vacío y éxito administrados por TanStack Query.
- Adaptador puro entre DTO y modelo visual.
- Props, listas, `map` y `key` estable.
- Navegación elegida por la persona mediante `Link`.

### Distinciones que deben quedar explícitas

- **Catálogo público:** describe una obra mediante `mediaType + externalId`.
- **Registro personal:** describe la entrada guardada por una persona mediante `logId`.
- **`viewLogType`:** selecciona el orden que aplica el backend.
- **`filters`:** restringe qué registros personales devuelve el backend.
- **Invalidar:** conserva la query, la marca como desactualizada y puede volver a solicitarla.
- **Eliminar de caché:** retira las queries coincidentes; se usa al terminar la sesión.
- **Adaptar:** derivar otra forma desde el DTO. No significa copiar la respuesta a otro estado.

## Contrato remoto verificado

La aplicación consume el backend proporcionado por el docente. Los estudiantes no clonan, ejecutan ni modifican `medialog-server`.

```text
POST /api/v2/media/list
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

El body contiene dos decisiones:

```ts
{
  viewLogType: "list",
  filters: {
    // filtros de la biblioteca personal
  },
}
```

El contrato actual ordena `viewLogType: "list"` ascendentemente por año, mes y día de lanzamiento. La fecha de creación resuelve empates. La interfaz no vuelve a ordenar el arreglo.

El backend también soporta anime, pero el producto del curso solo incluye películas y series. Por eso el filtro base envía ambos tipos permitidos:

```ts
mediaType: {
  values: ["movie", "series"],
  matchMode: "OR",
}
```

Los demás ejes empiezan sin selección. La clase 22 convertirá parte de este body fijo en filtros controlados por la URL.

## DTO mínimo de lista

El endpoint devuelve más información. El frontend tipa los campos que consume esta lista y conserva `id` porque la clase 19 lo necesitará para abrir un registro personal:

```ts
export type MediaLogListItemDto = {
  id: string
  mediaType: MediaType
  title: string
  releaseYear: number | null
  releaseMonth: number | null
  releaseDay: number | null
  status: MediaStatus
  priority: MediaPriority
}
```

`MediaStatus` y `MediaPriority` se importan desde `types/media-api.ts`, donde se definieron con sus values de transporte en la clase 07. El schema de la clase 16 y este DTO consumen el mismo vocabulario; ninguno vuelve a declarar la unión.

No se añaden `userId`, `catalogId`, tags, duración, episodios, notas ni timestamps porque la lista base no los representa. Las notas aparecerán en el detalle privado de la clase 19.

`id` cruza la frontera HTTP con ese nombre. El modelo visual lo renombra a `logId` para indicar qué identidad posee:

```text
MediaLogListItemDto.id
        ↓ toLibraryMediaListItemModel
LibraryMediaListItemModel.logId
```

En esta clase `logId` funciona como `key` de React. La navegación hacia `/app/library/:logId` comienza en la clase 19.

## Responsabilidades

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `getMediaLibrary` | Enviar el body y devolver `Promise<MediaLogListItemDto[]>` | No lee sesión visual ni transforma filas |
| `mediaKeys.libraryList` | Identificar body y sesión que producen la respuesta | No autentica el request |
| `useMediaLibrary` | Conectar key, fetcher y condición autenticada | No crea componentes ni copia datos |
| `toLibraryMediaListItemModel` | Preparar identidad, labels y fecha visible | No ordena ni guarda estado |
| `LibraryMediaList` | Recorrer modelos visuales | No conoce DTO, body ni token |
| `LibraryPage` | Representar los estados de la query | No llama `fetch` directamente |
| `PrivateHeader` | Cerrar sesión y retirar la caché de Media | No conserva token ni DTO |

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 18 minutos dentro del bloque previo al descanso. Recupera la mutación de la clase 17, presenta la primera lectura privada y prepara dos decisiones de caché. El cierre de 15 minutos vuelve al deck para reconstruir el recorrido completo.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Crear cambió más de una pantalla | Reconstruir `submit → create → invalidate search/details → isLogged: true`. Preguntar qué pantalla todavía no puede actualizarse. | Árbol de keys de la clase 17 con la rama `lists()` punteada. No mostrar su implementación todavía. |
| Problema | Guardamos un medio, pero aún no tenemos biblioteca | `/app/library` es privada y necesita carga, error, vacío y éxito. Firebase define la sesión; el backend conserva la biblioteca; TanStack Query administra su copia remota en el cliente. | Tres cajas: sesión, servidor y caché. Pedir al grupo que asigne cada responsabilidad. |
| Contrato | Orden y filtros son decisiones diferentes | `viewLogType: "list"` pide orden por lanzamiento. `filters` limita resultados. El frontend fija películas y series porque el backend también admite anime. | Body anotado. Atenuar los filtros que se volverán interactivos en la clase 22. |
| Identidad | Una lista privada también necesita una key completa | La respuesta depende del body y del usuario. `libraryList(body, authScope)` identifica ambas dimensiones; el Bearer sigue siendo quien autentica el request. | Comparar dos keys para usuario A y usuario B. Pie: “scope identifica caché; token autentica”. |
| Recapitulación | Si ya tenemos un DTO, ¿por qué otro modelo? | Recuperar la clase 08: el DTO usa el contrato remoto y el modelo usa el vocabulario de la interfaz. En esta lista `id` se vuelve `logId` y las fechas y enums se vuelven labels. Los mapas de status y prioridad ya tienen un segundo consumidor, por lo que el taller podrá extraerlos del formulario. El modelo se deriva durante el render. | Diagrama `DTO.id → adapter → model.logId`. Nota oral: no se crea un modelo cuando ambas formas son realmente iguales; tampoco se comparte una constante antes de tener dos consumidores. |
| Consistencia | Crear vuelve obsoleta la lista | Después de un alta, `lists()` puede conservar una respuesta anterior. Se añade esa familia al conjunto de invalidaciones de creación. | Antes/después de `CREATE_MEDIA_LOG_INVALIDATION_KEYS()`. Mostrar prefijos, no cada key concreta. |
| Privacidad | Invalidar y eliminar resuelven problemas distintos | Crear invalida porque la sesión continúa y necesita datos nuevos. Logout elimina `mediaKeys.all` porque esas respuestas pertenecen a la sesión terminada. | Tabla de dos columnas con `invalidateQueries` y `removeQueries`. Evitar presentar `clear()` como solución general. |
| Puente | El docente conecta la tubería; el taller construye la experiencia | Antes del descanso quedarán fetcher, key, hook, salida diagnóstica y cleanup. El taller aplicará adaptador, componentes, estados e invalidación. | Captura del placeholder y mockup de la lista sin enseñar el JSX final. |

### Indicaciones que deben sobrevivir a la producción de slides

- La biblioteca es estado remoto. No se copia a `useState`, Zustand o `localStorage`.
- `authScope` no sustituye `Authorization`; solo evita que dos identidades compartan una entrada de caché.
- La query permanece deshabilitada si el estado no es `authenticated`, aunque la ruta privada ya ofrezca esa protección visual.
- La query key incluye el body que consume el fetcher. Cuando la clase 22 cambie filtros, cambiará también la key.
- El filtro base no está completamente vacío: conserva `movie` y `series` para respetar el dominio del curso.
- El DTO manual representa un subconjunto usado del contrato. `requestJson<T>` aporta tipado estático, no validación en runtime.
- `MediaStatus` y `MediaPriority` pertenecen al contrato API. El formulario, el DTO de lista y sus adapters reutilizan esos tipos; los labels visibles permanecen en la capa de interfaz.
- `viewLogType: "list"` entrega el orden del backend. El componente no ejecuta `.sort()`.
- La clase 08 ya justificó DTO → modelo visual. Aquí se recupera el criterio mediante `id → logId`, labels y fecha.
- Los labels de status y prioridad ya existen en el formulario. El taller aplica una extracción conocida porque ahora los necesita un segundo consumidor.
- Adaptar no significa duplicar. `data.map(toLibraryMediaListItemModel)` deriva la vista desde la caché.
- `logId` se conserva desde esta clase porque la siguiente ruta lo necesita. Todavía no se usa como enlace de detalle.
- Crear invalida `searches()`, `details()` y `lists()`. La mutación sigue esperando esas invalidaciones.
- Logout espera que `signOut` termine y luego elimina `mediaKeys.all`. Si `signOut` falla, la sesión y su caché permanecen disponibles para reintentar.
- `removeQueries` se limita a Media. `queryClient.clear()` borraría todas las cachés conectadas y escondería qué datos estamos protegiendo.
- El enlace “Ver biblioteca” aparece como elección después de guardar. La aplicación no navega automáticamente desde el detalle.
- No se introduce un sistema global de notificaciones ni un store para la lista.

### Cierre conceptual

El docente recupera estas preguntas:

1. ¿Qué dos valores distinguen la query privada de biblioteca?
2. ¿Quién decide el orden por fecha de lanzamiento?
3. ¿Por qué `dto.id` se llama `logId` después del adaptador?
4. ¿Por qué crear invalida `lists()` mientras logout elimina `mediaKeys.all`?
5. ¿Qué falta para navegar desde una fila hacia el detalle personal?

La última respuesta debe abrir la clase 19: crear una ruta y consultar el detalle mediante `logId`.

## Proyecto semilla

El docente comparte `s06-c18-crear-listar-seed`.

### Incluye

- Checkpoint completo de la clase 17.
- Búsqueda y detalle públicos con optional auth y `authScope`.
- Registro, login, rutas privadas y `PrivateHeader` con logout.
- Creación remota con estados y errores.
- `CREATE_MEDIA_LOG_INVALIDATION_KEYS()` con `searches()` y `details()`.
- Ruta `/app/library` protegida con una página placeholder.
- `MediaLogListItemDto`, tipos del body y `BASE_LIBRARY_LIST_BODY` compatibles con el contrato actual.
- Records de labels de status y prioridad todavía dentro del formulario de creación.
- Dependencias instaladas con pnpm y `pnpm-lock.yaml` coherente.

### No incluye

- `mediaKeys.lists()` ni `mediaKeys.libraryList(...)`.
- `getMediaLibrary` o `useMediaLibrary`.
- Modelo visual, adaptador o componentes de lista privada.
- Invalidación de `lists()` después de crear.
- Limpieza de caché en logout.
- Enlace desde un registro hacia `/app/library/:logId`.

### Comprobaciones antes de compartir

1. Ejecutar `pnpm install` con el lockfile aprobado.
2. Ejecutar `pnpm build`.
3. Registrar un usuario y crear una película o serie.
4. Confirmar que búsqueda y detalle muestran `isLogged: true`.
5. Abrir `/app/library` y confirmar que solo aparece el placeholder.
6. Verificar que el seed no contiene la solución del taller.

Si el grupo no completa el bloque guiado antes del descanso, el docente comparte un checkpoint alternativo con fetcher, key, hook, salida diagnóstica y cleanup terminados. Ese checkpoint tampoco incluye adaptador, lista visual ni invalidación final.

## Estado inicial y transformación de archivos

### Antes de la clase

```text
src/
├── api/
│   ├── http.ts
│   └── media.ts
├── components/
│   ├── create-media-log-form.tsx
│   └── private-header.tsx
├── hooks/
│   ├── features/
│   │   └── use-media.ts
│   └── media-keys.ts
├── pages/
│   └── library-page.tsx              placeholder
└── types/
    └── media-api.ts                  DTO y body preparados
```

### Checkpoint de salida

```text
src/
├── adapters/
│   └── media-log-to-library-list-item.ts
├── api/
│   ├── http.ts
│   └── media.ts                      añade getMediaLibrary
├── components/
│   ├── create-media-log-form.tsx     importa labels compartidos
│   ├── library-media-list.tsx
│   ├── library-media-list-item.tsx
│   └── private-header.tsx            elimina caché tras signOut
├── constants/
│   └── media-log.ts                  labels compartidos
├── hooks/
│   ├── features/
│   │   └── use-media.ts              añade query e invalidación de lists
│   └── media-keys.ts                 añade familia lists
├── pages/
│   ├── library-page.tsx              estados y lista
│   └── media-detail-page.tsx         ofrece Ver biblioteca
└── types/
    ├── library-media-list-item.ts
    └── media-api.ts
```

No se crea archivo, endpoint, configuración o actividad de backend.

## Antes del descanso · 75 minutos

| Tiempo | Responsable | Progreso observable |
| --- | --- | --- |
| 0-18 min | Docente con participación | Presentar el guion, reconstruir la mutación y distinguir orden, filtros, identidad de caché e invalidación frente a eliminación. |
| 18-31 min | Docente y grupo | Leer `BASE_LIBRARY_LIST_BODY`, comprobar que limita el dominio a película y serie y revisar el DTO mínimo. |
| 31-43 min | Docente en el editor | Implementar `getMediaLibrary(body)` con `requestJsonWithAuth`. Verificar URL, método, Bearer y respuesta en Network. |
| 43-57 min | Construcción interactiva | Crear `lists()`, `libraryList(body, authScope)` y `useMediaLibrary()`. Localizar la entrada privada en Query Devtools. |
| 57-65 min | Docente y grupo | Sustituir el placeholder por una salida diagnóstica que muestre título e `id` del primer DTO. Confirmar el orden sin construir todavía la lista visual. |
| 65-72 min | Docente en el editor | Añadir `removeQueries({ queryKey: mediaKeys.all })` al logout exitoso y comprobar que la entrada desaparece. |
| 72-75 min | Docente | Presentar el encargo, los archivos incompletos y los criterios del taller. |

### Estado 1 · Reconocer el body fijo

> Nota de migración: esta clase es una fuente histórica. La sesión 13 vigente define `ListMediaLogsBody` antes de usarlo y construye el request con `toLibraryListBody("all")`; eliminó `BASE_LIBRARY_LIST_BODY` para evitar spreads anidados. No copies la constante de este bloque al paquete actual.

El seed contiene los tipos y la constante porque el taller no debe empezar descubriendo un contrato extenso:

```ts
type MatchMode = "AND" | "OR"

type ValuesFilter<T> = {
  values: T[]
  matchMode: MatchMode
}

type MediaDate = {
  year: number
  month: number
  day: number
}

type MediaDateRange = {
  start: MediaDate | null
  end: MediaDate | null
}

export type ListMediaLogsBody = {
  viewLogType: "list"
  filters: {
    query: string | null
    status: ValuesFilter<MediaStatus>
    priority: ValuesFilter<MediaPriority>
    mediaType: ValuesFilter<MediaType>
    releaseDateRange: MediaDateRange | null
    genres: ValuesFilter<string>
    tags: ValuesFilter<string>
  }
}
```

La constante usa una forma serializable y satisface el tipo:

```ts
export const BASE_LIBRARY_LIST_BODY = {
  viewLogType: "list",
  filters: {
    query: null,
    status: { values: [], matchMode: "OR" },
    priority: { values: [], matchMode: "OR" },
    mediaType: { values: ["movie", "series"], matchMode: "OR" },
    releaseDateRange: null,
    genres: { values: [], matchMode: "OR" },
    tags: { values: [], matchMode: "OR" },
  },
} satisfies ListMediaLogsBody
```

`BASE_LIBRARY_LIST_BODY` no representa estado de formulario. Es la petición fija de esta etapa y prepara la ampliación de la clase 22 sin introducir filtros interactivos ahora.

### Estado 2 · Implementar la lectura autenticada

`src/api/media.ts` añade:

```ts
export function getMediaLibrary(
  body: ListMediaLogsBody,
): Promise<MediaLogListItemDto[]> {
  return requestJsonWithAuth<MediaLogListItemDto[]>(
    `${API_URL}/api/v2/media/list`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
}
```

Aunque la operación lee información, el contrato usa `POST` porque recibe filtros estructurados en el body. El frontend sigue el contrato entregado; los estudiantes no cambian el endpoint.

El docente comprueba en Network:

- URL y método correctos.
- Header `Authorization` presente.
- Body con `viewLogType: "list"`.
- Filtro de tipo limitado a `movie` y `series`.
- Respuesta como arreglo.

### Estado 3 · Crear la primera familia de listas

`src/hooks/media-keys.ts` amplía la familia existente:

```ts
export const mediaKeys = {
  all: ["media"] as const,
  // searches y details ya existen
  lists: () => [...mediaKeys.all, "list"] as const,
  libraryList: (body: ListMediaLogsBody, authScope: string) =>
    [...mediaKeys.lists(), { body, authScope }] as const,
}
```

La key incluye las variables que usa la query function. Dos usuarios producen dos entradas aunque envíen el mismo body. Cuando cambien los filtros, el objeto `body` describirá otra consulta.

### Estado 4 · Conectar el hook privado

`src/hooks/features/use-media.ts` añade:

```ts
export function useMediaLibrary() {
  const authState = useAuth()
  const authScope =
    authState.status === "authenticated"
      ? authState.user.uid
      : authState.status

  return useQuery({
    queryKey: mediaKeys.libraryList(BASE_LIBRARY_LIST_BODY, authScope),
    queryFn: () => getMediaLibrary(BASE_LIBRARY_LIST_BODY),
    enabled: authState.status === "authenticated",
  })
}
```

El hook no recibe `userId` desde la página. El provider ya conoce la sesión y el helper autenticado obtiene el ID token al ejecutar el request.

### Estado 5 · Comprobar la tubería con una salida diagnóstica

`LibraryPage` llama el hook y muestra únicamente una evidencia temporal:

```tsx
const libraryQuery = useMediaLibrary()

return (
  <Code block>
    {JSON.stringify(libraryQuery.data?.[0] ?? null, null, 2)}
  </Code>
)
```

Esta salida permite comprobar contrato, identidad y orden antes de mezclar la consulta con la interfaz final. Se elimina durante el taller. No es el checkpoint de la clase.

### Estado 6 · Eliminar datos al cerrar sesión

`PrivateHeader` obtiene el mismo cliente compartido:

```tsx
const queryClient = useQueryClient()
```

Después de un `signOut` exitoso:

```ts
await signOut(auth)
queryClient.removeQueries({ queryKey: mediaKeys.all })
navigate("/login", { replace: true })
```

Si `signOut` falla, la función entra al `catch`: la sesión continúa y no se elimina su caché. No se llama `clear()` porque la decisión afecta a la familia Media, no a todas las cachés conectadas al `QueryClient`.

### Checkpoint previo al taller

- Network muestra una consulta autenticada a `/api/v2/media/list`.
- Query Devtools muestra `media → list → { body, authScope }`.
- La página imprime el primer DTO o `null` como salida diagnóstica.
- Logout elimina las queries bajo `mediaKeys.all` después de cerrar la sesión.
- Todavía no existen modelo visual, adaptador, componentes de lista ni invalidación de `lists()`.

## Descanso · 30 minutos

## Después del descanso · Taller de 60 minutos

### Encargo

Completar el primer recorrido vertical de la aplicación:

```text
buscar → abrir detalle → agregar → elegir “Ver biblioteca”
       → cargar lista privada → encontrar el registro
```

La consulta ya funciona. El taller construye la experiencia visual y conecta las piezas conocidas.

### Distribución sugerida

| Tiempo | Trabajo del estudiante | Evidencia intermedia |
| --- | --- | --- |
| 0-12 min | Extraer labels compartidos, crear el modelo visual y escribir el adaptador. | Un DTO produce `logId`, labels y fecha visible. |
| 12-27 min | Crear `LibraryMediaListItem` y `LibraryMediaList`. | Un arreglo de modelos se representa como lista vertical. |
| 27-39 min | Sustituir la salida diagnóstica por pendiente, error, vacío y éxito. | La página distingue los cuatro estados sin estado local duplicado. |
| 39-47 min | Añadir `lists()` a la invalidación de creación. | La biblioteca inactiva queda stale y solicita datos nuevos cuando la persona abre la ruta. |
| 47-53 min | Añadir “Ver biblioteca” en el estado guardado del detalle. | La persona decide cuándo abandonar el detalle. |
| 53-60 min | Ejecutar el recorrido y corregir el primer criterio incumplido. | Query Devtools, Network e interfaz cuentan la misma historia. |

### Trabajo obligatorio

#### 1. Compartir labels cuando aparece el segundo consumidor

Mover los records de status y prioridad desde `create-media-log-form.tsx` hacia `src/constants/media-log.ts`. El formulario y el adaptador importan la misma traducción. La extracción ocurre ahora porque existe un segundo consumidor real.

#### 2. Definir el modelo visual

`src/types/library-media-list-item.ts`:

```ts
export type LibraryMediaListItemModel = {
  logId: string
  title: string
  mediaTypeLabel: string
  releaseLabel: string
  statusLabel: string
  priorityLabel: string
}
```

El modelo no conserva `externalId`: esta fila representa un registro personal. Tampoco añade `to` todavía; la ruta de detalle se conectará en la clase 19.

#### 3. Escribir el adaptador puro

`src/adapters/media-log-to-library-list-item.ts`:

```ts
function formatReleaseDate(item: MediaLogListItemDto): string {
  if (item.releaseYear === null) return "Fecha desconocida"
  if (item.releaseMonth === null) return String(item.releaseYear)

  const month = String(item.releaseMonth).padStart(2, "0")
  if (item.releaseDay === null) return `${month}/${item.releaseYear}`

  const day = String(item.releaseDay).padStart(2, "0")
  return `${day}/${month}/${item.releaseYear}`
}

export function toLibraryMediaListItemModel(
  item: MediaLogListItemDto,
): LibraryMediaListItemModel {
  return {
    logId: item.id,
    title: item.title,
    mediaTypeLabel: item.mediaType === "movie" ? "Película" : "Serie",
    releaseLabel: formatReleaseDate(item),
    statusLabel: MEDIA_STATUS_LABELS[item.status],
    priorityLabel: MEDIA_PRIORITY_LABELS[item.priority],
  }
}
```

La función no ejecuta `.sort()`, no muta el DTO y no guarda el resultado.

#### 4. Construir la lista

`LibraryMediaListItem` recibe un solo `LibraryMediaListItemModel`. `LibraryMediaList` recibe el arreglo y usa `item.logId` como `key`:

```tsx
<Stack gap="sm">
  {items.map((item) => (
    <LibraryMediaListItem item={item} key={item.logId} />
  ))}
</Stack>
```

Cada fila muestra:

- Título.
- Película o serie.
- Fecha de lanzamiento preparada.
- Status.
- Prioridad.

#### 5. Representar los cuatro estados

`LibraryPage` decide en este orden:

```text
isPending       → PageState variant="loading"
isError         → PageState variant="error" con refetch
data.length = 0 → EmptyState y Link a /search
data.length > 0 → adaptar y renderizar LibraryMediaList
```

`PageState` se reutiliza desde la página de detalle. `LibraryPage` entrega `onRetry={() => void libraryQuery.refetch()}` porque posee la query; el componente compartido no la inspecciona. `EmptyState` queda reservado para una colección válida sin elementos. No se usa un Effect.

#### 6. Ampliar la invalidación de creación

La constante existente queda:

```ts
export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
  mediaKeys.lists(),
]
```

No se añade una key concreta con un usuario escrito a mano. El prefijo cubre las variantes de lista y conserva la estrategia enseñada en la clase 17.

#### 7. Ofrecer navegación hacia la biblioteca

Cuando el detalle autenticado devuelve `isLogged: true`, la interfaz conserva el feedback y añade:

```tsx
<Button component={Link} to="/app/library" variant="light">
  Ver biblioteca
</Button>
```

La creación no ejecuta `navigate()` automáticamente. La persona puede revisar el detalle y elegir el siguiente paso.

### Restricciones

- No ordenar con `.sort()` en página, adaptador o componente.
- No copiar `libraryQuery.data` a `useState`, Zustand o almacenamiento local.
- No solicitar la lista mediante `useEffect`.
- No usar `queryClient.clear()` para resolver un alcance que pertenece a `mediaKeys.all`.
- No enviar `userId` desde el frontend.
- No incluir anime en la lista del curso.
- No navegar todavía a `/app/library/:logId`.
- No modificar, ejecutar o configurar el backend.
- No introducir notas, tags, paginación, calendario o filtros interactivos.

### Retos adicionales

- Mostrar un contador derivado: “2 elementos en tu biblioteca”.
- Añadir un indicador discreto mientras `isFetching` actualiza una lista que ya tiene datos.
- Mejorar el texto del error según `ApiError.status` sin cambiar el helper HTTP.

Los retos no añaden campos al DTO ni cambian el checkpoint base.

## Actividades del docente durante el taller

- Revisar primero Network y Query Devtools cuando una lista no aparezca.
- Pedir al estudiante que señale dónde se decide el orden antes de aceptar un `.sort()`.
- Preguntar por qué `id` cambia de nombre en lugar de aceptar la transformación como ceremonia.
- Comprobar que los labels extraídos tienen dos consumidores reales.
- Mostrar una invalidación activa y una lista inactiva sin reemplazar el trabajo del estudiante.
- Pedir que se pruebe logout con datos visibles antes de revisar estilos.

## Actividades de los estudiantes

- Explicar con sus palabras DTO, modelo visual y adaptador.
- Construir los componentes desde props tipadas.
- Completar cada estado antes de aplicar estilos finales.
- Agregar una película y una serie con status y prioridad diferentes.
- Verificar el orden entregado por el backend.
- Cerrar sesión, iniciar otra y confirmar que no aparece la caché visual anterior.

## Revisión y demostración · 15 minutos

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0-8 min | Una pareja ejecuta el recorrido completo con una película y una serie. | Network muestra create y list; la interfaz muestra ambos registros. |
| 8-12 min | Otra pareja explica key, invalidación y logout sobre Query Devtools. | Distingue stale/refetch de eliminación de caché. |
| 12-15 min | Exit ticket y apertura de la clase 19. | Identifica `logId` como el dato que permitirá abrir el detalle privado. |

## Recorrido de verificación

1. Iniciar sesión con una biblioteca vacía.
2. Abrir `/app/library` y observar pendiente seguido de vacío.
3. Ir a `/search` y buscar una película.
4. Abrir su detalle y agregarla con status, prioridad y notas.
5. Confirmar `isLogged: true` y elegir “Ver biblioteca”.
6. Verificar que la fila muestra título, tipo, fecha, status y prioridad.
7. Agregar una serie con otros valores.
8. Confirmar que el servidor entrega ambas por fecha de lanzamiento.
9. Intentar repetir una creación: la acción `isLogged` o el `409` impide presentar un duplicado como éxito.
10. Inspeccionar que `lists()` fue invalidada después de crear.
11. Cerrar sesión y confirmar que las queries bajo `mediaKeys.all` desaparecen.
12. Iniciar otra sesión y comprobar que obtiene su propia biblioteca.

## Criterios de aceptación

- `/app/library` solo se renderiza dentro del área autenticada.
- La query key incluye body y `authScope`.
- El request envía Bearer y limita `mediaType` a película y serie.
- La página diferencia pendiente, error, vacío y éxito.
- La lista consume modelos visuales, no DTO forzados mediante casts.
- El adaptador convierte `id` en `logId` y prepara fecha y labels.
- Cada fila usa `logId` como key estable.
- El orden recibido no se modifica en el frontend.
- Crear invalida búsquedas, detalles y listas.
- El detalle ofrece “Ver biblioteca” sin navegación automática.
- Logout elimina `mediaKeys.all` solo después de un `signOut` exitoso.
- No existen fetches en Effects ni copias del DTO en otro store.

## Errores frecuentes y preguntas de diagnóstico

| Síntoma | Pregunta docente | Corrección esperada |
| --- | --- | --- |
| La lista responde `401`. | ¿El fetcher privado usa `requestJsonWithAuth`? | Corregir la intención HTTP y revisar Bearer en Network. |
| Dos usuarios comparten la misma key. | ¿Qué dato cambia la respuesta aunque el body sea igual? | Añadir `authScope` a `libraryList`. |
| Aparecen medios fuera del curso. | ¿El filtro base limita `mediaType`? | Enviar `movie` y `series`. |
| La página muestra vacío mientras carga. | ¿Qué condición se evalúa antes? | Representar pendiente antes de inspeccionar `data`. |
| La lista usa `item.id` en todos los componentes. | ¿Qué clase de identidad representa? | Renombrar a `logId` en el modelo visual. |
| Crear no actualiza una biblioteca abierta. | ¿Qué familia falta en la invalidación? | Añadir `mediaKeys.lists()`. |
| La lista cambia de orden en el navegador. | ¿Dónde aparece `.sort()`? | Retirarlo y respetar `viewLogType: "list"`. |
| Logout deja datos en Devtools. | ¿Se eliminó el prefijo correcto después de `signOut`? | Usar `removeQueries({ queryKey: mediaKeys.all })`. |
| El estudiante usa `clear()`. | ¿Qué otras cachés elimina esa operación? | Limitar la limpieza a la familia Media. |
| El adaptador guarda modelos con `setState`. | ¿Cuál es la fuente de verdad actual? | Derivar con `data.map(...)` durante el render. |

## Fuera de alcance

- Detalle privado por `logId`; clase 19.
- Precarga de formulario y edición; clase 20.
- Eliminación; clase 21.
- Filtros interactivos y sincronización con URL; clase 22.
- Drawer y Zustand; clase 24.
- Cambios en el backend, Firebase Admin o validación multi-proyecto.

## Evidencia de salida y entrega

El estudiante entrega:

- Código del checkpoint.
- Captura de Query Devtools con una key `media → list` que incluya `authScope`.
- Grabación breve del recorrido buscar, agregar, abrir biblioteca y cerrar sesión.
- Respuesta escrita: “¿Por qué crear invalida la lista, pero logout la elimina?”.

## Vocabulario

- **Biblioteca personal:** registros que pertenecen al usuario autenticado; no es una búsqueda del catálogo público.
- **Vista de lista:** orden solicitado al backend mediante `viewLogType: "list"`.
- **Filtro base:** restricciones fijas del producto antes de introducir controles interactivos.
- **Modelo visual:** forma derivada que usa el vocabulario y las necesidades de un componente.
- **`logId`:** identidad del registro personal guardado.
- **Invalidación:** marca una query como desactualizada y puede volver a solicitar sus datos.
- **Eliminación de caché:** retiro de queries coincidentes mediante `removeQueries`.
- **Prefijo de key:** parte compartida que permite operar sobre una familia de consultas.

## Referencias para el docente

- [TanStack Query · Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [TanStack Query · Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [TanStack Query · QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- Contrato actual de `POST /api/v2/media/list` y orden `viewLogType: "list"` verificados en `medialog-server` antes de redactar la guía.
