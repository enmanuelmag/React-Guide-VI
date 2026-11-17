# Clase 22 · Filtros en URL y primera prueba pura

- **Semana:** 8
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** checkpoint 21 con CRUD completo y una biblioteca que consulta un body fijo
- **Checkpoint de salida:** la biblioteca conserva tipo, status y prioridad en la URL, consulta el backend con un body compatible y verifica el parser mediante Vitest

## Resultado de aprendizaje

Al terminar, el estudiante podrá tratar los search params como una entrada externa, convertirlos en filtros válidos de la aplicación, traducir esos filtros al contrato de lista y comprobar esa transformación con una primera prueba automatizada que no necesita renderizar React.

## Pregunta que organiza la clase

> ¿Cómo hacemos que una vista filtrada se pueda recargar, compartir y recorrer con Atrás sin mantener otra copia de los filtros en React?

El recorrido de la clase es:

```text
URL
  → parsear y validar strings
  → obtener LibraryFilters
  → construir ListMediaLogsBody
  → consultar con useMediaLibrary(body)
  → renderizar la respuesta del servidor
```

La URL es la única fuente de verdad de los filtros. No se crea un `useState` paralelo y no se usa un Effect para sincronizar dos representaciones.

## Progresión entre clases

| Clase | Aporta | Frontera |
| --- | --- | --- |
| 21 | CRUD completo, invalidaciones por familias y navegación después de eliminar | La biblioteca todavía consulta un body fijo |
| **22** | Filtros compartibles, adaptación URL → dominio → body y primera prueba pura | No implementa pruebas de componentes |
| 24 | Drawer, carga diferida y cierre del proyecto | No debe reconstruir el sistema de filtros |

La clase 22 no vuelve a diseñar la query key. Desde la clase 18, `mediaKeys.libraryList(body, authScope)` ya incluye el body serializable. Esta clase reemplaza el body fijo que recibe el hook por el body derivado de la URL.

## Conceptos que se enseñan y consolidan

### Conceptos principales

- Search params como parte de una URL.
- URL como estado navegable y compartible.
- Parseo y validación de una entrada externa.
- Valor por defecto seguro.
- Adaptación entre una forma legible y un DTO extenso.
- Filtros ejecutados por el servidor.
- Prueba unitaria de una función pura con Vitest.
- Caso, expectativa y resultado de una prueba automatizada.

### Conceptos que se consolidan

- Tipos unión de TypeScript.
- Funciones puras y adaptadores.
- Query function y variables incluidas en la query key.
- Estado remoto administrado por TanStack Query.
- Separación entre DTO y modelo local.
- Render derivado sin copiar datos a estado.
- Verificación en Network.

### Distinciones que deben quedar explícitas

| No confundir | Distinción |
| --- | --- |
| URL con objeto ya validado | `URLSearchParams` entrega strings o `null`; el type local existe después del parser |
| Ausente con inválido | Ambos usan el mismo default visual, pero una entrada inválida no se reescribe automáticamente |
| `all` visual con `[]` remoto | Para status y prioridad, `all` produce `[]`; para tipo, produce `['movie', 'series']` |
| Filtrar la respuesta con filtrar en servidor | La página envía filtros en el body y muestra la respuesta; no ejecuta `.filter()` sobre la lista remota |
| Nueva key con usar una key preparada | La clase 18 ya incluyó el body; la clase 22 entrega un body dinámico al hook |
| Navegación con render | Cambiar search params crea una navegación; React renderiza como consecuencia de esa nueva ubicación |
| Prueba pura con prueba de componente | La primera llama funciones sin DOM; una prueba de componente necesita render, providers y un entorno de navegador simulado |
| TypeScript con validación runtime | El type ayuda al programar, pero no impide que alguien escriba `?type=anime` en la URL |

## Contrato local de filtros

La URL conserva valores cortos y comprensibles:

```text
/app/library?type=series&status=watching&priority=high
```

La ausencia de un parámetro representa “Todos”. La aplicación no serializa `type=all`, `status=all` ni `priority=all`.

```ts
// src/schemas/library-filters.ts
import { z } from "zod/v4"

import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
} from "../types/media-api"
import { MEDIA_TYPE_VALUES } from "../types/media"

export const libraryMediaTypeFilterSchema = z.union([
  z.literal("all"),
  z.enum(MEDIA_TYPE_VALUES),
])

export const libraryStatusFilterSchema = z.union([
  z.literal("all"),
  z.enum(MEDIA_STATUS_VALUES),
])

export const libraryPriorityFilterSchema = z.union([
  z.literal("all"),
  z.enum(MEDIA_PRIORITY_VALUES),
])

export const libraryFiltersSchema = z.object({
  mediaType: libraryMediaTypeFilterSchema,
  status: libraryStatusFilterSchema,
  priority: libraryPriorityFilterSchema,
})

export type LibraryFilters = z.infer<typeof libraryFiltersSchema>

export const DEFAULT_LIBRARY_FILTERS = libraryFiltersSchema.parse({
  mediaType: "all",
  status: "all",
  priority: "all",
})
```

Este schema no reemplaza al DTO del backend. Representa las decisiones de la interfaz y permite que “Todos” exista sin fingir que el servidor recibe ese mismo string. `LibraryFilters` se deriva con `z.infer`; `parse` valida el default construido y el adapter ejecutará `safeParse` sobre cada string externo.

## Contrato de URL

| Control | Search param | Valores aceptados | Ausente o desconocido |
| --- | --- | --- | --- |
| Tipo | `type` | `movie`, `series` | `all` |
| Status | `status` | values canónicos de `MediaStatus` | `all` |
| Prioridad | `priority` | values canónicos de `MediaPriority` | `all` |

Reglas aprobadas:

- `?type=anime` se interpreta como `mediaType: "all"`; anime no entra al dominio del curso.
- Un value desconocido de status o prioridad se interpreta como `all`.
- El parser no lanza un error por una URL compartida inválida.
- La clase no canonicaliza automáticamente una URL inválida. Por ejemplo, puede conservar `?type=anime` mientras la interfaz muestra “Todos”.
- Cuando la persona elige “Todos”, el handler elimina el parámetro correspondiente.
- Cada cambio de control crea una entrada navegable; el botón Atrás permite recuperar la combinación anterior.

No se usa un Effect para “limpiar” parámetros inválidos. Esa escritura automática añadiría otra decisión de navegación que no hace falta para el checkpoint.

## Traducción al contrato remoto

La clase 18 histórica definió `BASE_LIBRARY_LIST_BODY` con el dominio reducido. La sesión 13 vigente eliminó esa constante y construye el body completo directamente; este bloque se conserva solo como antecedente de la versión antigua con filtros en URL:

```ts
mediaType: {
  values: ["movie", "series"],
  matchMode: "OR",
}
```

La adaptación dinámica debe conservar esa protección:

| Filtro local | Values enviados al backend |
| --- | --- |
| `mediaType: "all"` | `['movie', 'series']` |
| `mediaType: "movie"` | `['movie']` |
| `mediaType: "series"` | `['series']` |
| `status: "all"` | `[]` |
| Un status concreto | `[status]` |
| `priority: "all"` | `[]` |
| Una prioridad concreta | `[priority]` |

Un arreglo vacío en `mediaType` significaría “sin restricción de tipo” para el endpoint y podría incluir anime. Por eso, “Todos” en la interfaz significa “todos los tipos admitidos por este curso”, no “todo lo que conoce el backend”.

El backend sigue siendo una dependencia externa entregada mediante URL. Los estudiantes no modifican endpoints, validadores, jobs ni código de servidor para implementar estos filtros.

## Decisión de arquitectura

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `library-filters.ts` | Definir la forma válida de los filtros de interfaz y sus defaults | No lee la URL ni conoce el DTO remoto |
| `toLibraryFilters` | Leer strings externos y producir `LibraryFilters` válidos | No navega ni ejecuta requests |
| `toLibraryListBody` | Traducir filtros válidos al body de lista | No conoce Router ni Query Client |
| `LibraryFilterControls` | Mostrar controles y emitir cambios tipados | No posee una copia local de los filtros |
| `LibraryPage` | Leer la ubicación, coordinar cambios y entregar el body al hook | No filtra la respuesta localmente |
| `useMediaLibrary(body)` | Consultar y cachear una variante concreta de la biblioteca | No interpreta search params |
| `mediaKeys.libraryList(body, authScope)` | Identificar la variante remota y la sesión | No se redefine en esta clase |
| Tests de adapters | Probar entradas, defaults y dominio reducido | No renderizan React ni simulan Firebase |

La dirección de dependencias queda visible:

```text
react-router
     │
     ▼
LibraryPage ──→ adapter de URL ──→ LibraryFilters
     │                                  │
     │                                  ▼
     └────────────────────────── adapter de body
                                        │
                                        ▼
                              useMediaLibrary(body)
```

## Por qué no se usa `useState` ni `useEffect`

Una versión con dos fuentes de verdad tendría este problema:

```text
search params de la URL ← sincronización → useState de filtros
```

Ahora cada cambio debe decidir cuál copia se actualiza primero, qué ocurre al recargar y cómo responder a Atrás. Un Effect no elimina el problema; solo intenta sincronizarlo después de un render.

En esta clase, el render puede derivar todo directamente:

```text
searchParams actuales
→ toLibraryFilters(searchParams)
→ toLibraryListBody(filters)
→ useMediaLibrary(body)
```

No hace falta `useMemo` para que la query key sea correcta. TanStack Query compara la estructura serializable de la key, no la identidad por referencia del objeto construido en cada render. La clase puede hablar de memoización en otro caso con un costo demostrado; aquí oscurecería el recorrido principal.

## Decisión sobre la primera prueba automatizada

La clase instala solamente Vitest:

```bash
pnpm add -D vitest@4.1.11
```

Y añade el script:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

La primera prueba se ejecuta en el entorno Node predeterminado y usa `URLSearchParams`, disponible sin montar un DOM. No se instalan todavía:

- React Testing Library.
- `user-event`.
- jsdom.
- MSW.
- Un custom render con Router, Query Client y Auth Provider.

El objetivo no es evitar las pruebas de interfaz. Es introducir primero la anatomía de un test sobre una frontera real y pequeña. Una prueba de `LibraryPage` añadiría varios providers y herramientas nuevas en la misma sesión dedicada a filtros.

Vitest 4.1.11 es compatible con Vite 6–8 y con las versiones actuales de Node admitidas por el curso. El docente debe conservar el runtime y el lockfile verificados en el proyecto semilla; no se mezclan comandos de npm.

## Guion de presentación

### Propósito y duración

La presentación inicial dura 16 minutos. Recupera el body fijo de la biblioteca, presenta una URL filtrada como problema de producto y diferencia string externo, filtro local y DTO remoto. Los últimos 4 minutos de la clase vuelven al deck para leer la evidencia y cerrar.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | El CRUD ya está completo | Recorrer crear, listar, detalle, editar y eliminar. La biblioteca consulta `BASE_LIBRARY_LIST_BODY`. | Diagrama del flujo de la clase 21 con la lista como destino. |
| Problema | La vista se pierde al recargar | Mostrar una selección de controles mantenida solo en memoria y preguntar qué URL enviaría un estudiante a otro. | Dos capturas con la misma ruta pero filtros distintos. |
| Web | Una URL también describe estado | El path identifica la biblioteca; los search params describen una variante de esa vista. | Descomponer path, `?`, keys, `=` y `&`. |
| Navegación | Compartir, recargar y usar Atrás | Si la URL es la fuente, el navegador ya conserva historial y permite copiar el estado. | Línea de historial con dos combinaciones. |
| Entrada externa | Todo search param comienza como texto | TypeScript no controla lo que alguien escribe, guarda en un marcador o recibe por chat. | `?type=anime` entrando a una frontera de validación. |
| Modelo local | Un type representa decisiones válidas | `LibraryFilters` admite solo movie, series o all; status y prioridad usan sus unions canónicas. | Tres columnas: URL, dominio local y DTO. |
| Default | Ausente o inválido no rompe la vista | Ambos se interpretan como “Todos”; la URL inválida no se reescribe automáticamente. | Tabla de ejemplos y salida esperada. |
| Adaptación | Una URL simple no debe copiar el DTO | `type=series` es legible; el adapter produce arrays y `matchMode` para el servidor. | Flecha desde una URL corta hacia un body expandido. |
| Dominio | Todos no incluye anime | El endpoint sabe más que la app. `mediaType: []` abriría el dominio; el curso envía movie y series. | Conjuntos: backend grande y app reducida. |
| Caché | La key ya estaba preparada | Desde la clase 18, la key incluye body y `authScope`. Hoy el hook deja de usar el body fijo. | Resaltar solo el argumento que cambia. |
| Servidor | La respuesta ya llega filtrada | El frontend no aplica `.filter()` ni reordena. Network permite leer el request real. | Request body junto a respuesta reducida. |
| React | No hay estado duplicado | Los controles reciben values derivados de la URL y escriben una nueva ubicación. No existe Effect de sincronización. | Tachado de `useState + useEffect`. |
| Pruebas | Empezar por una frontera pura | El parser recibe muchas entradas posibles y tiene una salida determinista. Es un buen primer test. | Given → when → then sobre `URLSearchParams`. |
| Alcance | Una herramienta nueva, un riesgo concreto | Vitest basta para el parser. DOM, providers y eventos quedan para una futura ampliación. | Capas de una prueba de página, con solo la capa pura activa. |

### Indicaciones que deben sobrevivir a la producción de slides

- Una URL no es solo texto mostrado por el navegador; identifica un recurso o una vista reproducible.
- El path `/app/library` no cambia. Los filtros aparecen después de `?`.
- `URLSearchParams.get()` devuelve `string | null`, no `MediaType` ni `MediaStatus`.
- Los search params deben tratarse como entrada externa incluso si la misma aplicación suele escribirlos.
- TypeScript no valida una URL en ejecución.
- El parser convierte una forma externa abierta en una forma local cerrada.
- “Todos” es una decisión visual; no forma parte de `MediaType`, `MediaStatus` o `MediaPriority` remotos.
- La ausencia del param es la representación canónica elegida para “Todos”.
- Una entrada desconocida usa un default seguro, pero no dispara una navegación automática de limpieza.
- La URL es la única fuente de verdad. No añadir `useState` para reflejar los mismos filtros.
- No usar un Effect para copiar URL a estado o estado a URL.
- `useSearchParams` entrega una referencia estable, pero el objeto es mutable. El setter debe clonar antes de cambiarlo.
- La forma funcional del setter recibe los parámetros anteriores. Se crea `new URLSearchParams(previous)` y se devuelve la copia.
- En esta clase, cada cambio conserva una entrada del historial para que Atrás tenga significado.
- El componente de controles es controlado: recibe los values y emite intenciones.
- El adapter de body no modifica `BASE_LIBRARY_LIST_BODY`.
- `mediaType: "all"` se traduce a movie y series; nunca a un arreglo vacío.
- Status y prioridad en “Todos” sí se traducen a arreglos vacíos.
- La query function consume `body`; ese body ya forma parte de `mediaKeys.libraryList` desde la clase 18.
- Un objeto nuevo con los mismos campos no crea por sí solo una variante diferente de caché; la key se compara de forma estructural.
- El cambio de filtros puede mostrar el estado pending de la nueva consulta. `placeholderData: keepPreviousData` no pertenece al checkpoint base.
- La lista mostrada es la respuesta del backend. No añadir `.filter()` ni `.sort()` local.
- El primer test no es decorativo: protege que una URL desconocida no amplíe accidentalmente el dominio a anime.
- Una prueba unitaria llama una unidad aislada y compara su resultado con una expectativa.
- `describe` agrupa un comportamiento, `it` nombra un caso y `expect` expresa el resultado observable.
- El nombre del caso debe explicar la regla, no repetir el nombre de la función.
- `pnpm test` ejecuta una suite finita mediante `vitest run`; no deja watch mode activo al cerrar la clase.
- React Testing Library, jsdom y mocks de red no se presentan como “malos”; simplemente resuelven otro nivel de prueba.
- El backend no se modifica. El body se adapta desde el frontend al contrato ya entregado.

### Snippets conceptuales para las slides

Mostrar la separación de formas, no la solución completa:

```text
?type=series
      ↓
{ mediaType: "series" }
      ↓
{ values: ["series"], matchMode: "OR" }
```

Mostrar que la entrada todavía no está validada:

```ts
const value = searchParams.get("type")
// string | null
```

Mostrar la intención del test:

```ts
expect(toLibraryFilters(new URLSearchParams("type=anime"))).toEqual(
  DEFAULT_LIBRARY_FILTERS,
)
```

No mostrar en la presentación inicial el adapter completo ni los tres tests resueltos. Esas piezas se construyen en el editor.

### Cierre conceptual

1. ¿Por qué `?type=anime` no puede convertirse directamente con `as MediaType`?
2. ¿Por qué “Todos” produce dos tipos en el body y no un arreglo vacío?
3. ¿Qué problema aparecería si la página conservara los mismos filtros en URL y `useState`?
4. ¿Qué demuestra el test puro y qué no demuestra sobre la interfaz?

El cierre comprueba que la familia de listas distingue las combinaciones de body y que las mutaciones invalidan las proyecciones afectadas.

## Estado inicial y transformación de archivos

### Antes de la clase

```text
src/
├── api/media.ts
├── components/media-library.tsx
├── hooks/features/use-media.ts       useMediaLibrary() usa el body base
├── hooks/media-keys.ts           libraryList(body, authScope) ya existe
├── pages/library-page.tsx
├── types/media-api.ts                 body base, status y prioridad canónicos
└── types/media.ts                     MediaType
```

### Checkpoint de salida

```text
src/
├── adapters/
│   ├── library-filters-to-list-body.ts
│   └── __tests__/
│       └── library-filters.test.ts
│   └── library-search-params-to-filters.ts
├── api/media.ts
├── components/
│   ├── library-filter-controls.tsx
│   └── media-library.tsx
├── hooks/features/use-media.ts       useMediaLibrary(body)
├── hooks/media-keys.ts           sin rediseño
├── pages/library-page.tsx            URL como fuente de verdad
├── types/
│   ├── library-filters.ts
│   ├── media-api.ts
│   └── media.ts
└── ...
```

También cambian:

```text
package.json                           script test y dependencia Vitest
pnpm-lock.yaml                         generado por pnpm
```

## Flujo de construcción

### Estado 1 · Definir el modelo local antes de leer la URL

Crear `src/schemas/library-filters.ts` con los schemas, `LibraryFilters` y `DEFAULT_LIBRARY_FILTERS`.

Preguntas para el grupo:

- ¿Por qué `all` pertenece al filtro visual y no a `MediaType`?
- ¿Qué ventaja tiene reutilizar `MediaStatus` y `MediaPriority`?
- ¿Qué combinaciones inválidas impide este type dentro de la aplicación?

El docente aclara que el type solo protege el código después de validar la entrada.

### Estado 2 · Parsear y validar search params

Crear `src/adapters/library-search-params-to-filters.ts`:

```ts
import {
  libraryFiltersSchema,
  libraryMediaTypeFilterSchema,
  libraryPriorityFilterSchema,
  libraryStatusFilterSchema,
  type LibraryFilters,
} from "../schemas/library-filters"

export function toLibraryFilters(
  searchParams: URLSearchParams,
): LibraryFilters {
  const mediaType = searchParams.get("type")
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")

  const mediaTypeResult = libraryMediaTypeFilterSchema.safeParse(mediaType)
  const statusResult = libraryStatusFilterSchema.safeParse(status)
  const priorityResult = libraryPriorityFilterSchema.safeParse(priority)

  return libraryFiltersSchema.parse({
    mediaType: mediaTypeResult.success ? mediaTypeResult.data : "all",
    status: statusResult.success ? statusResult.data : "all",
    priority: priorityResult.success ? priorityResult.data : "all",
  })
}
```

No usar:

```ts
const mediaType = searchParams.get("type") as MediaType
```

El cast silencia a TypeScript, pero acepta `anime`, errores de escritura y cualquier string externo.

Primero probar manualmente el parser desde el editor con:

- params vacíos.
- `type=series`.
- `type=anime`.
- status conocido y desconocido.

Todavía no escribir la URL desde los controles. La primera dificultad es convertir la entrada.

### Estado 3 · Leer los filtros desde `LibraryPage`

La página incorpora `useSearchParams`:

```ts
const [searchParams, setSearchParams] = useSearchParams()
const filters = toLibraryFilters(searchParams)
```

Los filtros se derivan durante cada render. No se copian a estado local:

```ts
// No crear esta segunda fuente de verdad
const [filters, setFilters] = useState(DEFAULT_LIBRARY_FILTERS)
```

En este punto, la interfaz puede mostrar temporalmente los values interpretados como texto o mediante controles todavía sin conectar. El objetivo observable es recargar distintas URLs y ver el mismo resultado del parser.

### Estado 4 · Escribir search params sin mutar la referencia recibida

Definir los nombres aceptados por los handlers:

```ts
type LibraryFilterParam = "type" | "status" | "priority"

function updateFilterParam(name: LibraryFilterParam, value: string) {
  setSearchParams((previous) => {
    const next = new URLSearchParams(previous)

    if (value === "all") {
      next.delete(name)
    } else {
      next.set(name, value)
    }

    return next
  })
}
```

La copia tiene dos propósitos didácticos:

- Evita mutar la referencia estable que React Router entregó al render actual.
- Hace explícito que se construye la siguiente ubicación desde la anterior.

No pasar `{ replace: true }` en el recorrido base. Cada cambio crea una entrada del historial para demostrar Atrás.

### Estado 5 · Construir controles administrados por la página

Crear `LibraryFilterControls` con props explícitas:

```ts
type LibraryFilterControlsProps = {
  filters: LibraryFilters
  onMediaTypeChange: (value: LibraryFilters["mediaType"]) => void
  onStatusChange: (value: LibraryFilters["status"]) => void
  onPriorityChange: (value: LibraryFilters["priority"]) => void
  onClear: () => void
}
```

El docente conecta primero el control de tipo. Status se realiza con participación guiada y prioridad queda como práctica corta del estudiante.

Cada `Select` de Mantine:

- recibe el value desde `filters`.
- usa labels legibles y values del contrato.
- mantiene una opción explícita con value `all`.
- usa `allowDeselect={false}`.
- valida el `string | null` de `onChange` antes de llamar al callback tipado.

El componente no llama a `useSearchParams`. La página sigue siendo el punto de coordinación entre navegación, filtros y query.

Limpiar todos los filtros usa una acción de la página:

```ts
function clearFilters() {
  setSearchParams(new URLSearchParams())
}
```

Si en el futuro la ruta conserva params de otras features, esta estrategia tendrá que eliminar solo las keys de filtros. En el alcance actual, son los únicos search params de `/app/library`.

### Estado 6 · Adaptar `LibraryFilters` al body remoto

Crear `src/adapters/library-filters-to-list-body.ts`:

```ts
import {
  BASE_LIBRARY_LIST_BODY,
  type ListMediaLogsBody,
} from "../types/media-api"
import type { LibraryFilters } from "../schemas/library-filters"

export function toLibraryListBody(
  filters: LibraryFilters,
): ListMediaLogsBody {
  return {
    ...BASE_LIBRARY_LIST_BODY,
    filters: {
      ...BASE_LIBRARY_LIST_BODY.filters,
      mediaType: {
        ...BASE_LIBRARY_LIST_BODY.filters.mediaType,
        values:
          filters.mediaType === "all"
            ? [...BASE_LIBRARY_LIST_BODY.filters.mediaType.values]
            : [filters.mediaType],
      },
      status: {
        ...BASE_LIBRARY_LIST_BODY.filters.status,
        values: filters.status === "all" ? [] : [filters.status],
      },
      priority: {
        ...BASE_LIBRARY_LIST_BODY.filters.priority,
        values: filters.priority === "all" ? [] : [filters.priority],
      },
    },
  }
}
```

La función crea objetos y arrays nuevos. No muta el body base, porque ese valor es una convención compartida y puede reutilizarse en otras consultas o pruebas.

Pausa de comprobación:

```ts
toLibraryListBody(DEFAULT_LIBRARY_FILTERS).filters.mediaType.values
// ["movie", "series"]
```

Si el resultado es `[]`, detener la integración: el body ampliaría el dominio y podría devolver anime.

### Estado 7 · Convertir el hook fijo en un hook parametrizado

El hook actual de la clase 18 recibe implícitamente `BASE_LIBRARY_LIST_BODY`. Cambiar su firma:

```ts
export function useMediaLibrary(body: ListMediaLogsBody) {
  const authState = useAuth()
  const authScope =
    authState.status === "authenticated"
      ? authState.user.uid
      : authState.status

  return useQuery({
    queryKey: mediaKeys.libraryList(body, authScope),
    queryFn: () => getMediaLibrary(body),
    enabled: authState.status === "authenticated",
  })
}
```

El ejemplo conserva la condición de sesión del checkpoint. No se reconstruye aquí la autenticación.

En `LibraryPage`:

```ts
const filters = toLibraryFilters(searchParams)
const body = toLibraryListBody(filters)
const libraryQuery = useMediaLibrary(body)
```

No cambiar el key builder:

```ts
libraryList: (body, authScope) => [
  ...mediaKeys.lists(),
  { body, authScope },
]
```

Ese diseño ya existe y se explica como una preparación deliberada de la clase 18. Ahora puede observarse en Devtools que dos combinaciones producen keys distintas bajo la misma familia `lists()`.

### Estado 8 · Verificar request, recarga, compartir y Atrás

Antes de instalar testing, completar una comprobación manual guiada:

1. Abrir `/app/library` y confirmar que muestra todos los tipos del curso.
2. Elegir `series` y comprobar `?type=series`.
3. Elegir un status y una prioridad.
4. Revisar en Network que el POST contiene arrays de un solo value cuando corresponde.
5. Recargar y confirmar que los controles conservan la combinación.
6. Copiar la URL en otra pestaña autenticada y comprobar la misma vista.
7. Cambiar un filtro y usar Atrás.
8. Escribir manualmente `?type=anime` y confirmar “Todos” sin resultados anime.
9. Limpiar y comprobar que la URL vuelve a `/app/library`.

“Misma vista” significa mismos filtros y un request equivalente. Los datos pueden cambiar si el backend cambió entre ambas consultas.

### Estado 9 · Instalar Vitest y explicar la anatomía mínima

Ejecutar:

```bash
pnpm add -D vitest@4.1.11
```

Añadir `"test": "vitest run"` en `package.json`.

Antes de escribir el archivo, presentar:

```text
arrange  → preparar la entrada
act      → ejecutar la función
assert   → comparar el resultado
```

Relacionar esas fases con Vitest:

- `describe` agrupa reglas relacionadas.
- `it` nombra un comportamiento concreto.
- `expect` declara qué salida debe observarse.

No convertir esta parte en un recorrido exhaustivo de una herramienta de testing. La sesión introduce lo necesario para comprobar los adapters creados hoy.

### Estado 10 · Escribir la primera suite pura

Crear `src/adapters/__tests__/library-filters.test.ts`:

```ts
import { describe, expect, it } from "vitest"

import { toLibraryListBody } from "./library-filters-to-list-body"
import { toLibraryFilters } from "./library-search-params-to-filters"

describe("library filters", () => {
  it("reads valid filters from the URL", () => {
    const searchParams = new URLSearchParams(
      "type=series&status=watching&priority=high",
    )

    expect(toLibraryFilters(searchParams)).toEqual({
      mediaType: "series",
      status: "watching",
      priority: "high",
    })
  })

  it("uses safe defaults for missing or unknown values", () => {
    const searchParams = new URLSearchParams(
      "type=anime&status=unknown&priority=urgent",
    )

    expect(toLibraryFilters(searchParams)).toEqual({
      mediaType: "all",
      status: "all",
      priority: "all",
    })
  })

  it("keeps movie and series when all types are selected", () => {
    const filters = toLibraryFilters(new URLSearchParams())
    const body = toLibraryListBody(filters)

    expect(body.filters.mediaType.values).toEqual(["movie", "series"])
    expect(body.filters.status.values).toEqual([])
    expect(body.filters.priority.values).toEqual([])
  })
})
```

Si los values reales de `MediaStatus` o `MediaPriority` usan otro literal en el contrato canónico de la clase 07, el docente sustituye los ejemplos por values existentes. No se inventa un value para hacer pasar el snippet.

La suite prueba tres riesgos distintos:

- una URL válida conserva la intención.
- una entrada desconocida no entra al dominio interno.
- “Todos” no abre la lista a anime.

No prueba que un `Select` sea accesible, que Router navegue o que el backend responda. Esas afirmaciones pertenecen a otros niveles de verificación.

## Secuencia de 120 minutos

| Tiempo | Contenido y actividad | Evidencia inmediata |
| --- | --- | --- |
| 0-16 min | Presentación: problema compartible, anatomía de URL, entrada externa, modelo local, DTO y alcance del test | El grupo puede explicar por qué URL y estado local no deben duplicarse |
| 16-34 min | Definir `LibraryFilters`; construir `toLibraryFilters` y probar valores válidos, ausentes e inválidos | `?type=anime` produce el default seguro |
| 34-50 min | Leer y escribir con `useSearchParams`; clonar dentro del setter y comprobar Atrás | La barra de direcciones conserva los cambios |
| 50-68 min | Construir `toLibraryListBody`; contrastar `all` para tipo, status y prioridad | El body default conserva movie y series |
| 68-83 min | Cambiar `useMediaLibrary(body)`, conservar la key existente y revisar Network/Devtools | Cada combinación consulta y cachea su body |
| 83-98 min | Práctica estudiantil: status, prioridad, limpiar, recargar y compartir | Tres controles reproducibles desde la URL |
| 98-116 min | Instalar Vitest; explicar arrange/act/assert y escribir los tres casos puros | La suite distingue entrada válida, inválida y dominio reducido |
| 116-120 min | Ejecutar `pnpm test` y `pnpm build`; cierre conceptual | Tests y build terminan con exit code 0 |

La suma es 120 minutos. Si la integración remota consume más tiempo, conservar los tres tests de adapters y retirar solo la demostración opcional de Devtools. No recortar la verificación de Network ni convertir el taller corto en una copia del docente.

## Actividades del docente

- Presentar una biblioteca filtrada sin cambiar el código y pedir al grupo que proponga una URL reproducible.
- Dibujar las tres formas: search params, `LibraryFilters` y `ListMediaLogsBody`.
- Recordar por qué el modelo local puede diferir del DTO sin convertirse en otra fuente remota.
- Construir el filtro de tipo completo y verbalizar cada frontera de validación.
- Mostrar por qué `as MediaType` no valida runtime.
- Mutar una instancia de `URLSearchParams` solo como contraste y luego aplicar la copia dentro del setter.
- Abrir Network y comparar el body default, tipo concreto y filtros combinados.
- Abrir Query Devtools y señalar que la familia ya incluía el body desde la clase 18.
- Conducir la integración del control de status mediante preguntas, sin entregar la prioridad resuelta.
- Instalar Vitest con pnpm y leer el cambio de `package.json` y lockfile.
- Escribir el primer caso junto al grupo y solicitar que nombren arrange, act y assert.
- Pedir predicciones antes de ejecutar cada test.
- Cerrar distinguiendo lo comprobado automáticamente de lo observado manualmente.

## Actividades de los estudiantes

Durante la parte guiada:

- Identificar path, keys y values en una URL de ejemplo.
- Proponer qué debería ocurrir con params ausentes o desconocidos.
- Predecir el body para “Todos”, movie y series.
- Explicar por qué el body forma parte de la key.
- Usar Network para comparar la predicción con el request real.

Durante la práctica de 83 a 98 minutos:

1. Conectar el control de prioridad siguiendo el patrón de tipo y status.
2. Implementar “Limpiar filtros”.
3. Seleccionar una combinación con los tres ejes.
4. Recargar la página.
5. Copiar la URL y abrirla en otra pestaña autenticada.
6. Cambiar prioridad y usar Atrás.
7. Revisar que la lista no se filtre con `.filter()` local.

Durante testing:

- Completar el caso de valores desconocidos.
- Explicar por qué `anime` aparece como entrada del test pero nunca como salida válida.
- Ejecutar la suite después de cambiar temporalmente la expectativa y observar un mensaje de fallo.
- Restaurar la expectativa correcta y confirmar exit code 0.

## Verificación guiada

### Verificación manual de comportamiento

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Sin params | Abrir `/app/library` | Controles en “Todos”; body con movie y series |
| Tipo válido | Elegir series | URL con `type=series`; body con `['series']` |
| Tres filtros | Elegir tipo, status y prioridad | URL contiene tres params; body contiene tres restricciones |
| Recarga | Recargar la combinación | Controles y request conservan la intención |
| Compartir | Abrir la URL en otra pestaña con sesión | Se reconstruye la misma combinación |
| Atrás | Cambiar un filtro y volver | Regresa la combinación anterior |
| Todos | Elegir “Todos” en un control | Desaparece ese param |
| Entrada inválida | Escribir `type=anime` | Control muestra “Todos”; body sigue limitado a movie y series |
| Caché | Alternar entre combinaciones visitadas | Devtools muestra variantes bajo `lists()` y la sesión actual |
| Servidor | Revisar la respuesta | La página no aplica `.filter()` ni `.sort()` local |

### Verificación automatizada

```bash
pnpm test
pnpm build
```

La evidencia mínima incluye:

- tres tests ejecutados.
- cero tests fallidos.
- build con exit code 0.
- ningún proceso de watch pendiente.

Un test verde no prueba por sí solo navegación, Network, Firebase o disponibilidad del backend. Esas condiciones se conservan en la verificación manual.

## Criterios de aceptación

- `/app/library` funciona sin search params.
- La URL representa tipo, status y prioridad mediante values simples.
- Los controles se derivan de la URL y no de un `useState` duplicado.
- Los handlers clonan `URLSearchParams` antes de modificarlo.
- Elegir “Todos” elimina el param correspondiente.
- Atrás recupera la combinación previa.
- Params ausentes o inválidos producen defaults seguros.
- `type=anime` nunca produce `MediaType: 'anime'` ni un body sin restricción.
- `toLibraryListBody` conserva `['movie', 'series']` para todos los tipos del curso.
- Status y prioridad en `all` producen arrays vacíos.
- `useMediaLibrary` recibe el body como argumento.
- La query key existente conserva body y `authScope`.
- La lista usa la respuesta del servidor sin `.filter()` o `.sort()` local.
- Vitest está instalado mediante pnpm y existe un script finito `test`.
- Los tests cubren entrada válida, entrada desconocida y dominio reducido.
- `pnpm test` y `pnpm build` terminan correctamente.
- No se modificó el backend.

## Errores frecuentes y preguntas de diagnóstico

| Síntoma | Posible causa | Pregunta para orientar |
| --- | --- | --- |
| Recargar pierde los filtros | Los controles poseen `useState` local | ¿De dónde lee su `value` cada control después de montar? |
| La URL cambia pero el request no | El hook todavía usa el body base | ¿Qué body consume realmente la query function? |
| Dos filtros muestran el mismo cache entry | La key concreta omitió una variable | ¿La key de clase 18 recibe exactamente el body consumido? |
| Atrás no cambia los controles | Se usó `replace: true` o hay estado duplicado | ¿Cada cambio creó una ubicación y los values vienen de ella? |
| Elegir “Todos” deja `type=all` | El handler usa `set` para todos los values | ¿Qué representación canónica se acordó para “Todos”? |
| `type=anime` aparece como válido | Se usó un cast | ¿Qué código comprueba el string durante la ejecución? |
| La lista contiene anime al limpiar | `mediaType.values` se convirtió en `[]` | ¿Todos significa todo el backend o todo el dominio del curso? |
| Cambiar status elimina el tipo | Se construyeron params desde cero | ¿El setter clonó los params anteriores antes de cambiar una key? |
| La base cambia después de filtrar | El adapter mutó arrays u objetos compartidos | ¿Cada nivel modificado crea una copia nueva? |
| La pantalla hace dos filtrados | Se conservó un `.filter()` local | ¿Qué filtrado ya realizó el endpoint? |
| El test requiere `document` | Se configuró o escribió una prueba DOM | ¿La unidad actual puede recibir `URLSearchParams` directamente? |
| Vitest queda esperando | El script usa watch mode | ¿El script ejecuta `vitest run`? |
| Un test verde pero la URL no navega | La suite solo cubre adapters | ¿Qué parte se verificó manualmente y cuál automáticamente? |
| El value de Mantine llega como `null` | `onChange` no validó su contrato | ¿El callback tipado se ejecuta solo después de reconocer el value? |

## Fuera de alcance

- Multi-select y search params repetidos.
- Filtro de texto libre.
- Rango de fechas, géneros y tags.
- Ordenamiento local o remoto configurable.
- Paginación o infinite query.
- Canonicalización automática de URLs inválidas.
- Debounce de search params.
- `placeholderData: keepPreviousData` como requisito.
- React Testing Library, `user-event`, jsdom y custom render.
- Mock Service Worker.
- Pruebas de Firebase, Router o requests reales.
- Zustand para filtros.
- Persistencia en `localStorage`.
- Cambios en `medialog-server`.
- Drawer y carga diferida.

Si sobra tiempo, el docente puede mostrar cómo aparece una segunda variante de lista en Query Devtools. No añade dependencias ni cambia el checkpoint.

## Evidencia de salida

El estudiante entrega o demuestra:

- Una URL con tipo, status y prioridad válidos.
- La misma vista después de recargar.
- El recorrido Atrás entre dos combinaciones.
- El request body observado en Network.
- La respuesta segura ante `?type=anime`.
- El archivo de tests con tres casos y salida verde de `pnpm test`.
- El build final con exit code 0.

Checkpoint observable:

> La biblioteca personal se puede filtrar por tipo, status y prioridad desde una URL compartible; cada combinación consulta el backend con el contrato correcto, excluye anime y el parser queda protegido por una suite pura de Vitest.

## Vocabulario

- **URL:** dirección que identifica un recurso o una vista y puede incluir path, query y fragment.
- **Search param:** par clave-valor ubicado después de `?` en una URL.
- **Query string:** conjunto serializado de search params, separado normalmente por `&`.
- **Parsear:** leer una representación externa y convertirla a una forma que la aplicación entiende.
- **Validar en runtime:** comprobar durante la ejecución que un value pertenece al conjunto admitido.
- **Default seguro:** value conocido que reemplaza una entrada ausente o inválida sin ampliar el dominio.
- **Fuente de verdad:** representación autoritativa desde la cual se derivan las demás.
- **Filtro de servidor:** condición enviada al backend para que este seleccione los registros de la respuesta.
- **Función pura:** función cuya salida depende de sus argumentos y que no modifica estado externo.
- **Prueba unitaria:** comprobación automatizada de una unidad pequeña y aislada.
- **Suite:** grupo de casos de prueba relacionados.
- **Caso de prueba:** ejemplo concreto con entrada, ejecución y resultado esperado.
- **Aserción:** comparación que expresa qué resultado debe cumplirse.
- **Entorno Node:** runtime de la prueba sin una página o DOM de navegador simulado.
- **Historial de navegación:** secuencia de ubicaciones que el navegador recorre con Atrás y Adelante.
- **Canonicalizar:** convertir varias representaciones equivalentes a una representación preferida.

## Referencias para preparar la clase

- [React Router · `useSearchParams`](https://reactrouter.com/api/hooks/useSearchParams)
- [React Router · Search Params](https://reactrouter.com/start/declarative/url-values#search-params)
- [TanStack Query · Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Vitest · Getting Started](https://vitest.dev/guide/)
- [Vitest · Test API](https://vitest.dev/api/)

Las referencias sirven para la preparación docente. La clase explica solo el subconjunto necesario para el checkpoint y conserva el contrato real ya documentado en las clases 18 a 21.
