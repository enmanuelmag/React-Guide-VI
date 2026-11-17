# Sesión 08 · TanStack Query y búsqueda remota

> Estado: paquete textual, presentación visual y proyecto progresivo implementados.

- **Fecha:** lunes 12 de octubre de 2026
- **Semana:** 4
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Entrada ejecutable:** `session-08-start` desde `session-07-end`
- **Checkpoint ejecutable:** `session-08-end`
- **Ruta:** `session-08-start` → `session-08-step-01-query-provider` → `session-08-step-02-query-identity` → `session-08-step-03-submitted-search` → `session-08-step-04-results-adapter` → `session-08-end`

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 07:

- El explorador local conserva búsqueda, filtro, contador, selección y modal.
- `.env.example` declara `VITE_API_URL`.
- `src/api/http.ts` exporta `requestJson<T>()`.
- `src/api/media.ts` exporta `searchMedia()` y `getMediaDetail()`.
- `src/types/media-api.ts` contiene `SearchMediaInput`, `MediaSearchItemDto` y los DTO de detalle.
- `MediaType` vive únicamente en `src/types/media-item.ts`.
- Vitest `4.1.11` ejecuta el test del adapter de parámetros.
- El `ApiProbe` temporal ya no forma parte del árbol activo.

La apertura comprueba que el explorador local continúa funcionando y que `searchMedia()` existe. No reconstruye HTTP, DTO, filtros ni Mantine.

## Limitación visible

El formulario local solo filtra un fixture ya cargado. La aplicación tiene un fetcher remoto, pero todavía no sabe cuándo ejecutarlo, cómo separar respuestas diferentes ni cómo representar su ciclo de vida.

```text
checkpoint 07
fixture local → estado derivado → tarjetas → modal local

sesión 08
borrador → submit → query key → searchMedia() → DTO en caché
                                           ↓
                                  adapter puro → tarjetas remotas
```

TanStack Query aparece porque la primera respuesta remota entra en la interfaz. No se construye antes una integración provisional con `useEffect` ni se copia la response a estado local.

## Checkpoint de salida

Al terminar:

- `@tanstack/react-query@5.102.8` y `@tanstack/react-query-devtools@5.102.8` están instalados.
- `main.tsx` crea un solo `QueryClient` fuera de los componentes.
- `QueryClientProvider` envuelve la aplicación y Devtools puede inspeccionar el caché.
- La configuración docente usa `retry: false` y `staleTime: 5 * 60 * 1000`.
- `src/hooks/media-keys.ts` define una familia de keys para búsqueda.
- La key de cada búsqueda contiene el texto normalizado y `mediaType`.
- `src/hooks/features/use-media.ts` conecta `searchMedia()` con `useQuery()`.
- El archivo agrupa hooks de Media y hoy exporta solo `useMediaSearch`. Cada caso posterior añade su propia función; los componentes importan el hook y no duplican su configuración. Las keys permanecen en `src/hooks/media-keys.ts`.
- La query permanece inactiva hasta recibir una búsqueda enviada de al menos dos caracteres.
- `App` distingue `draftQuery`, `draftMediaType` y `submittedSearch`.
- Escribir no solicita datos; enviar una búsqueda válida cambia la identidad de la query.
- TanStack Query conserva `MediaSearchItemDto[]` como dato remoto.
- `toMediaSearchCardModel()` deriva el modelo visual sin assertions ni estado duplicado.
- La interfaz muestra estados inicial, carga, error, vacío y éxito.
- Los resultados preservan `externalId` y `mediaType`, pero no abren modal ni detalle.
- Devtools muestra keys distintas para `Dune/movie` y `Dune/series`.
- Volver a una key fresca reutiliza su caché durante la demostración.
- `pnpm build` termina con código de salida 0 en el seed ejecutable.

Network demuestra los requests observados. Devtools demuestra las entradas presentes en el Query Client. El build comprueba tipos y generación. Ninguna de esas evidencias demuestra disponibilidad futura del backend, rutas, detalle remoto o autenticación.

## Resultado de aprendizaje

El estudiante modelará una búsqueda remota declarativa: confirmará parámetros locales, los convertirá en identidad de caché, representará el ciclo de vida de la consulta y adaptará un DTO a un contrato visual sin crear otra fuente de verdad.

## Concepto principal

Una query describe datos remotos mediante dos piezas inseparables:

```text
queryKey
  identifica qué datos son

queryFn
  explica cómo obtenerlos
```

Si `queryFn` usa `query` y `mediaType`, ambos valores pertenecen a la key. Cambiar la key declara que la interfaz necesita otros datos; no hace falta llamar `refetch()` para pasar parámetros.

La sesión separa tres responsabilidades:

| Responsabilidad | Propietario |
| --- | --- |
| Texto y tipo mientras se edita | React local |
| Parámetros confirmados por submit | React local |
| Response, error, carga y caché | TanStack Query |
| Forma visual derivada | Adapter puro durante render |

## Vocabulario

- **Estado remoto:** datos cuyo origen y ciclo de vida dependen de otro sistema.
- **Query:** descripción declarativa de un recurso remoto.
- **Query key:** arreglo serializable que identifica una entrada de caché.
- **Query function:** función que devuelve la Promise del recurso identificado.
- **Query Client:** objeto que coordina caché y consultas.
- **Provider:** componente que vuelve disponible un servicio mediante contexto.
- **Caché:** datos conservados para reutilizarlos sin confundir identidades.
- **Fresh:** dato que todavía no se considera vencido según `staleTime`.
- **Stale:** dato que puede necesitar una actualización.
- **Lazy query:** consulta que espera una condición antes de ejecutar la primera petición.
- **`status`:** estado de disponibilidad de los datos: pending, error o success.
- **`fetchStatus`:** estado de ejecución de la query function: fetching, paused o idle.
- **Borrador:** valores que la persona todavía está editando.
- **Submit:** confirmación de parámetros que puede cambiar la query.
- **Modelo visual:** forma mínima que necesita un componente para presentar datos.
- **Derivar:** calcular un valor desde su fuente sin guardarlo otra vez.

## Decisiones técnicas cerradas

### Adopción visual

06 incorpora el modal y 07 conserva el catálogo con HTML/CSS. En 08 la nueva pantalla usa controles, feedback y primitives de Mantine: `Container`, `Stack` y `Group`. El guion compara `className` en la raíz con `classNames` para partes internas, y conserva HTML semántico. `MediaTypeBadge` permanece con el catálogo local; la nueva lista usa `Badge`. El fallback de resultados se entrega preparado y no resuelve los cinco estados de Query.

### Versiones

```bash
pnpm add @tanstack/react-query@5.102.8
pnpm add @tanstack/react-query-devtools@5.102.8
```

### Query Client

El cliente se crea una sola vez fuera de `App` y fuera de la función de render:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})
```

`retry: false` vuelve observable el primer error sin esperas docentes. Cinco minutos de frescura permiten demostrar reutilización de caché dentro de la clase. No son defaults universales del producto.

### Familia de query keys

```ts
mediaKeys.all
mediaKeys.searches()
mediaKeys.search({ query, mediaType })
```

La key final usa el texto con `trim()` y el tipo concreto. `all` no pertenece al contrato remoto.

### Consulta diferida

El hook recibe `SearchMediaInput | null`. Antes del primer submit existe una key válida pero deshabilitada. `isPending` aislado no significa que el fetch esté ocurriendo: una query sin datos puede estar pending e idle. La pantalla usa `isLoading` para la primera petición real.

### Frontera DTO → modelo visual

```text
MediaSearchItemDto
  externalId, title, releaseYear, coverUrl, mediaType, isLogged
          ↓ toMediaSearchCardModel
MediaSearchCardModel
  key, externalId, title, releaseLabel, posterUrl, mediaType, isLogged
```

El adapter justifica cada cambio de nombre o formato. No inventa `description`, no convierte el DTO con `as MediaItem` y no guarda el resultado en otro estado.

## Árbol esperado

```text
src/
├── adapters/
│   ├── media-input-to-params.ts
│   └── media-search-item-to-card-model.ts
├── api/
│   ├── http.ts
│   └── media.ts
├── components/
│   └── media-search-results.tsx
├── hooks/
│   ├── media-keys.ts
│   └── features/
│       └── use-media.ts
├── types/
│   ├── media-api.ts
│   ├── media-item.ts
│   └── media-search-card-model.ts
├── App.tsx
└── main.tsx
```

Los archivos del fixture, filtros y modal local pueden permanecer en el repositorio, pero dejan de importarse desde el árbol activo. No se borran durante la clase.

## Transformación guiada

### Estado 1 · Provider visible

La aplicación conserva Mantine y agrega Query alrededor de ella. Devtools queda dentro del provider.

### Estado 2 · Key antes del hook

El grupo escribe primero ejemplos de identidad:

```text
["media", "search", { query: "Dune", mediaType: "movie" }]
["media", "search", { query: "Dune", mediaType: "series" }]
```

Luego implementa la fábrica. La key no contiene el borrador sin enviar.

### Estado 3 · Hook de feature

`useMediaSearch()` conoce TanStack Query y el fetcher. El formulario no conoce `queryFn`, HTTP ni caché.

### Estado 4 · Borrador y submit

El grupo prueba esta secuencia:

1. Escribir `Dune` no genera request.
2. Elegir `series` tampoco genera request.
3. Enviar captura ambos valores.
4. La nueva key ejecuta la query.

### Estado 5 · Adapter puro

El DTO permanece en `mediaSearch.data`. La lista visual se calcula:

```ts
const items = (mediaSearch.data ?? []).map(toMediaSearchCardModel)
```

### Estado 6 · Cinco estados observables

El orden evita confundir el inicio con loading:

1. `submittedSearch === null` → instrucción inicial.
2. `mediaSearch.isLoading` → primera petición real.
3. `mediaSearch.isError` → mensaje recuperable.
4. `items.length === 0` → búsqueda exitosa sin coincidencias.
5. Resultado no vacío → tarjetas.

`isFetching` puede añadir un indicador pequeño sobre datos existentes, pero no reemplaza las cinco ramas.

### Estado 7 · Experimento de caché

Con Devtools y Network abiertos:

1. Buscar `Dune` como película.
2. Buscar `Dune` como serie.
3. Observar dos entradas distintas.
4. Volver a `Dune` como película antes de cinco minutos.
5. Explicar por qué una lectura de caché fresca no equivale a un request nuevo.

## Trabajo asistido acotado

Las decisiones humanas previas son:

- Contrato completo de `MediaSearchCardModel`.
- Ausencia de selección, navegación y fetching en el componente.
- Fallback de portada y labels permitidos.
- Un único archivo modificable.

El agente puede implementar `src/components/media-search-results.tsx`. No puede decidir query keys, estados, arquitectura, API ni rutas. La salida se acepta solo después de leer el archivo, revisar el diff y ejecutar `pnpm build`.

## Secuencia de 90 minutos

| Tiempo | Duración | Responsable | Actividad | Evidencia |
| --- | ---: | --- | --- | --- |
| 0–18 | 18 min | Docente | Presentación completa y continua: estado remoto, key/function, caché, submit y cinco estados. | El editor permanece cerrado y el grupo predice dos keys distintas. |
| 18–28 | 10 min | Grupo guiado | Instalar Query/Devtools y montar el provider. | Aplicación y panel de Devtools visibles. |
| 28–42 | 14 min | Grupo guiado | Crear `mediaKeys` y `useMediaSearch()`. | Hook compila y permanece idle sin submit. |
| 42–55 | 13 min | Estudiantes | Separar borrador y búsqueda enviada; conectar submit. | Escribir no solicita; enviar sí. |
| 55–68 | 13 min | Grupo y agente | Definir modelo, escribir adapter y delegar solo la lista visual. | Archivo leído, límites respetados y diff revisado. |
| 68–79 | 11 min | Grupo guiado | Conectar los cinco estados remotos. | Cada rama tiene una condición observable. |
| 79–86 | 7 min | Parejas | Ejecutar experimento de keys y caché. | Devtools y Network distinguidos oralmente. |
| 86–90 | 4 min | Grupo | Ejecutar build, responder exit ticket y abrir Router. | Checkpoint y frontera de evidencia registrados. |

Total: **90 minutos**.

## Guion de presentación

La presentación aprobada como estructura sigue una sola búsqueda de `Dune`. Incluye 25 diapositivas: portada y ruta; checkpoint y pregunta de propiedad; responsabilidades de React, Query y adapter; anatomía e identidad de una query; `QueryClientProvider`; separación entre borrador y submit; hook declarativo; contraste entre `query.status` y `query.fetchStatus`; primera carga; `staleTime`; experimento de caché; adapter visual desde `query.data`; estado derivado; cinco estados de interfaz; responsabilidades de TanStack Query y Mantine; evidencia y puente hacia Router. Antes de usar campos como `query.data`, `query.error`, `query.isLoading` o `query.isFetching`, el deck muestra que `const query = useMediaSearch(input)` recibe el objeto producido por `useQuery()`.

La dificultad central sigue siendo el estado remoto. El deck no añade una práctica de migración visual ni entrega el componente completo antes de que el grupo cierre sus contratos. Su fuente está en `presentation/index.html` y cada diapositiva incluye notas docentes.

## Verificación en el seed

```bash
pnpm build
```

Comprobaciones manuales:

- Cargar la aplicación sin enviar y observar la instrucción inicial.
- Escribir sin enviar y confirmar ausencia de request.
- Enviar una búsqueda válida de película.
- Repetir con serie y comprobar otra key.
- Probar una búsqueda sin resultados.
- Observar un error controlado preparado por el docente.
- Volver a una key fresca y distinguir caché de Network.
- Confirmar que ninguna tarjeta abre modal ni navega.

## Contingencias

- **Backend no disponible:** usar capturas preparadas de Network y Devtools; no afirmar que el flujo remoto fue ejecutado.
- **Devtools no abre:** continuar con Network y las keys escritas; el build no sustituye la inspección de caché.
- **Error inmediato de CORS o URL:** leer el mensaje, revisar `VITE_API_URL` y no cambiar el contrato improvisadamente.
- **Agente excede el archivo permitido:** rechazar el cambio, restaurar de forma selectiva y ejecutar el fallback manual descrito en la guía docente.
- **Tiempo insuficiente:** entregar el componente presentacional preparado, pero conservar construcción manual de key, hook, submit y cinco estados.

## Fronteras

Esta sesión no introduce:

- React Router, páginas, `Link`, `Outlet` ni parámetros.
- Query de detalle, selección remota o modal remoto.
- Zustand, Zod, Firebase, mutaciones o invalidaciones.
- `useEffect`, Suspense, `skipToken` o refetch imperativo.
- React Testing Library, jsdom, MSW o tests del Query Client.
- Sincronización del formulario con la URL.

## Continuidad

La sesión 09 recibe una búsqueda remota funcional cuyos resultados preservan `mediaType + externalId`. Entonces aparece una nueva limitación: la identidad pública no puede compartirse ni recuperarse al recargar. React Router moverá la búsqueda a `SearchPage`, creará URLs declarativas y mostrará una página provisional de parámetros. La query de detalle espera hasta la sesión 10.
