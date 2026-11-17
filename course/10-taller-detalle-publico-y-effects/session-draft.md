# Sesión 10 · Taller de detalle público y Effects

> Estado: paquete textual y presentación visual aprobados definitivamente. La presentación tiene 24 diapositivas tras retirar las antiguas 20 y 21 por petición del usuario el 22 de octubre de 2026. El proyecto progresivo llega a `session-10-end`; el respaldo `session-10-workshop-start` omite la integración evaluada.

- **Fecha:** sábado 17 de octubre de 2026
- **Semana:** 4
- **Modalidad:** presencial
- **Duración:** 180 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Taller y rúbrica:** [workshop-rubric.md](workshop-rubric.md)
- **Entrada ejecutable:** `session-10-start` = `session-09-end`
- **Checkpoint previo al taller:** `session-10-workshop-start`

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 09:

- `BrowserRouter` convive con los providers existentes y `App` declara el árbol público.
- `/search` renderiza `SearchPage` y cada resultado enlaza a `/media/:mediaType/:externalId`.
- `MediaDetailPage` usa `useParams()` y `toMediaDetailInput()` para obtener `GetMediaDetailInput | null`.
- `movie` y `series` son tipos válidos; parámetros ausentes o desconocidos producen `null`.
- La página muestra una identidad válida de forma provisional, pero aún no solicita el detalle.
- `getMediaDetail(input)` y los DTO de detalle existen desde la sesión 07.
- TanStack Query, sus Devtools y `mediaKeys` existen desde la sesión 08.
- Atrás, Adelante, recarga y apertura en otra pestaña ya fueron comprobados con la página provisional.

La sesión no reconstruye navegación, HTTP ni búsqueda. Tampoco recupera el modal local de la sesión 06.

## Limitación visible

La URL ya conserva la identidad, pero la pantalla de detalle todavía no presenta información remota y el título de la pestaña no refleja el medio abierto.

```text
checkpoint 09
Link → URL → params → GetMediaDetailInput | null → página provisional

sesión 10
URL → input nullable → query de detalle → DTO → adapter → modelo visual
                                                      ↓
                                  contenido + título del documento
```

TanStack Query sincroniza y cachea el estado remoto. Un Effect queda reservado para sincronizar React con `document.title`, un sistema externo al árbol de componentes.

## Checkpoint de salida

Al terminar:

- `mediaKeys` contiene una familia estable para detalle y una key por `mediaType + externalId`.
- `useMediaDetail(input)` acepta `GetMediaDetailInput | null` y usa `enabled` para impedir requests sin identidad válida.
- La llamada al hook ocurre antes de cualquier retorno condicional de `MediaDetailPage`.
- La página distingue URL inválida, carga, error remoto, respuesta sin catálogo y contenido disponible.
- `PageState` define y presenta las cuatro ramas sin conocer Router ni TanStack Query; la página conserva la decisión y el `refetch` opcional.
- `MediaCatalogDetailDto` se transforma en `MediaDetailModel` mediante un adapter puro.
- `MediaDetailContent` recibe el modelo y no conoce Router, Query ni DTO.
- `MediaDocumentTitle` sincroniza `document.title`, declara `[title]` y restaura el título anterior mediante cleanup.
- `StrictMode` permanece activo; no se oculta su ciclo adicional de desarrollo.
- El scaffold temporal de detalle se elimina.
- La prueba del adapter y `pnpm build` terminan con código de salida 0 en el proyecto ejecutable.
- Una comprobación manual cubre película, serie, URL inválida, recarga, pestaña nueva, Atrás y Adelante.

La prueba unitaria demuestra solo la transformación pura. El build demuestra tipado y empaquetado. La comprobación manual demuestra el comportamiento observado en el navegador local; ninguna evidencia demuestra despliegue o disponibilidad futura del backend.

## Resultado de aprendizaje

El estudiante integrará una consulta dependiente de una identidad nullable, compondrá estados remotos en una página pública y usará un Effect con cleanup solo para sincronizar el título del documento.

## Concepto principal

Cada estado tiene un propietario distinto:

| Estado o cambio | Propietario |
| --- | --- |
| Identidad visible | URL + React Router |
| Datos remotos, caché y reintentos | TanStack Query |
| Traducción de DTO a interfaz | Adapter puro |
| Presentación del detalle | Componente presentacional |
| Título de la pestaña | Effect que sincroniza con `document` |

No se usa un Effect para copiar parámetros, iniciar fetching, derivar el modelo ni responder a eventos.

## Vocabulario

- **Consulta dependiente:** query que solo puede ejecutarse cuando existe un input válido.
- **Query key:** identidad serializable de una entrada de caché.
- **`enabled`:** opción que permite mantener una query declarada sin ejecutarla todavía.
- **`status`:** estado de los datos de la query, por ejemplo `pending`, `error` o `success`.
- **`fetchStatus`:** estado de la actividad de red, por ejemplo `idle` o `fetching`.
- **DTO:** estructura recibida desde una frontera remota.
- **Modelo visual:** estructura preparada para las necesidades de render de la interfaz.
- **Sistema externo:** estado fuera del control declarativo de React, como `document.title`.
- **Effect:** sincronización causada por el render con un sistema externo.
- **Cleanup:** función que deshace o restaura la sincronización antes de repetirla o desmontarla.
- **Strict Mode:** comprobación de desarrollo que ejecuta ciclos adicionales para revelar efectos incompletos.

## Decisiones técnicas cerradas

### Familia de query keys

La key incluye toda la identidad que cambia la respuesta:

```ts
import type { GetMediaDetailInput, SearchMediaInput } from "../types/media-api"

export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  search: (input: SearchMediaInput) =>
    [...mediaKeys.searches(), { query: input.query.trim(), mediaType: input.mediaType }] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (input: GetMediaDetailInput | null) =>
    [...mediaKeys.details(), input] as const,
}
```

`mediaType` y `externalId` permanecen juntos. No se reutiliza la key de búsqueda y no se llama `refetch()` para comunicar una nueva identidad.

### Query nullable y orden de hooks

Añade `useMediaDetail` al módulo existente `src/hooks/features/use-media.ts`, conservando `useMediaSearch`. Importa fetchers/tipos desde `../../api` y `../../types`, y las keys desde `../media-keys`.

El hook recibe el mismo resultado nullable que entrega el adapter de la ruta:

```ts
export function useMediaDetail(input: GetMediaDetailInput | null) {
  return useQuery({
    queryKey: mediaKeys.detail(input),
    queryFn: () => {
      if (input === null) {
        throw new Error("Falta la identidad del medio")
      }

      return getMediaDetail(input)
    },
    enabled: input !== null,
  })
}
```

La key conserva el `input` real, incluido `null` mientras la URL no produce una identidad válida. `enabled: false` impide ejecutar la consulta inválida. La comprobación dentro de `queryFn` permite que TypeScript descarte `null` antes de llamar a `getMediaDetail`; no crea una identidad temporal ni envía una petición.

En la página, el hook se llama antes de decidir qué rama renderizar:

```tsx
const params = useParams()
const detailInput = toMediaDetailInput(params)
const detailQuery = useMediaDetail(detailInput)

if (detailInput === null) {
  return <PageState variant="invalid" />
}
```

No se coloca el hook dentro de un `if` ni después de un retorno temprano.

### Estados remotos distintos

La página compone las ramas en este orden:

1. URL inválida: no existe input y la query queda deshabilitada.
2. Carga: existe input y la consulta todavía no tiene datos.
3. Error remoto: la request falló.
4. Respuesta válida sin catálogo: `data.catalog === null`.
5. Éxito con catálogo: se adapta y se presenta el detalle.

Una query deshabilitada sin caché puede estar `pending` y a la vez tener `fetchStatus: "idle"`. `isLoading` significa primera carga real porque combina ausencia de datos con fetching activo. La URL inválida se decide con `detailInput === null`, no con un spinner. Antes de leer `data.catalog`, una guarda `data === undefined` representa espera de conexión con `PageState` y texto contextual; aún no hay respuesta y no equivale a catálogo nulo. `isLoading` false no estrecha por sí solo el tipo de `data`.

Las cuatro ramas comparten presentación mediante `src/components/page-state.tsx`. Su contrato usa una unión explícita y conserva copy predeterminado con overrides contextuales:

```ts
export type PageStateVariant =
  | "loading"
  | "error"
  | "invalid"
  | "unavailable"

type PageStateProps = Readonly<{
  variant: PageStateVariant
  title?: string
  description?: string
  onRetry?: () => void
}>
```

`PageState` decide título, descripción, color e indicador visual. El botón **Reintentar** aparece únicamente si la variante es `error` o `unavailable` y existe `onRetry`. El componente no ejecuta una query ni interpreta errores: la página conoce `detailQuery.refetch()` y decide si entrega el callback.

### Frontera entre DTO y modelo visual

En el bloque de modelo y adapter, el guion muestra antes/después (`coverUrl` → `posterUrl`, año → label) y un cambio hipotético de API. El DTO/schema y el adapter pueden cambiar aunque el modelo y su consumidor se conserven. El bloque siguiente demuestra el consumo aislado; la integración de la query con la página real permanece en el taller. El adapter no inventa información que el servidor dejó de ofrecer.

```ts
import type { MediaType } from "./media-item"

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

El adapter recibe `MediaCatalogDetailDto`, cambia `coverUrl` por `posterUrl`, construye `releaseLabel` y conserva arrays y nulls:

```ts
export function mediaCatalogDetailToModel(
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

El adapter no convierte `externalId` numérico en el input string, no inventa géneros ni reemplaza nulls que el componente debe tratar.

### Componentes presentacionales

`MediaDetailContent` recibe `model: MediaDetailModel`. Puede escoger etiquetas distintas para película y serie, presentar fallbacks y omitir datos no disponibles. No importa `useParams`, `useQuery`, `getMediaDetail` ni los DTO.

`PageState` recibe únicamente props visuales. No importa Router, Query, fetchers, DTO o modelos del dominio. `EmptyState` conserva otra responsabilidad: representa una colección válida sin elementos, no una página inválida, en carga o fallida.

El DTO raíz también contiene `entry` e `isLogged`. Se conservan en la respuesta, pero no se presentan en esta sesión porque la experiencia autenticada comienza después.

### Effect con cleanup

La demostración comienza asignando el título sin cleanup. Al volver a búsqueda, la pestaña conserva el título del medio y hace visible la sincronización incompleta. Luego se corrige:

```tsx
import { useEffect } from "react"

type MediaDocumentTitleProps = Readonly<{
  title: string
}>

export function MediaDocumentTitle({ title }: MediaDocumentTitleProps) {
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

En desarrollo, Strict Mode puede mostrar `setup → cleanup → setup`. Ese ciclo es una comprobación, no dos interacciones de la persona. Los logs temporales se retiran del checkpoint final.

## Secuencia de 180 minutos

### Antes del descanso · 75 minutos

| Minutos | Bloque | Evidencia observable |
| ---: | --- | --- |
| 0–18 | Presentación continua completa y recuperación de lectura | El grupo asigna propietario a URL, query, adapter, contenido y título. |
| 18–30 | `mediaKeys.detail` y `useMediaDetail` con input fijo | Devtools muestra la key; el grupo distingue `pending/idle` de una primera carga activa. |
| 30–42 | `MediaDetailModel`, adapter y matriz humana | Una película y una serie producen modelos tipados sin casts. |
| 42–54 | `MediaDetailContent` y `PageState` con datos temporales | Ambos componentes renderizan con props y sin Router, Query ni DTO. |
| 54–67 | `MediaDocumentTitle`, error sin cleanup y corrección | Volver a búsqueda primero deja un título residual y luego restaura el anterior. |
| 67–75 | Revisión del agente, checkpoint y rúbrica | Se limita la tarea del agente a un único archivo de pruebas y se confirma el punto de partida del taller. |

### Descanso · 30 minutos

No se introduce ningún concepto nuevo después del descanso.

### Taller calificable · 60 minutos

| Minutos | Bloque | Evidencia observable |
| ---: | --- | --- |
| 0–12 | Reemplazar input fijo por `detailInput` | El hook queda antes del retorno de URL inválida y no ocurre una request inválida. |
| 12–30 | Componer cinco ramas con `PageState` | Se distinguen URL inválida, carga, error, catálogo ausente y éxito. |
| 30–42 | Integrar modelo, contenido y título | El título solo se monta con un modelo exitoso y el scaffold temporal desaparece. |
| 42–52 | Recorrer matriz de navegador | Película, serie, recarga, pestaña nueva, Atrás, Adelante y URL inválida tienen resultado registrado. |
| 52–60 | Ejecutar prueba, build y limpieza | Los comandos finalizan, no quedan logs ni datos temporales y se reúne la evidencia. |

### Revisión · 15 minutos

| Minutos | Bloque | Evidencia observable |
| ---: | --- | --- |
| 0–7 | Revisión por pares con la rúbrica | Cada pareja registra un criterio demostrado y uno pendiente. |
| 7–11 | Contraste docente entre desarrollo y preview | Se separa el ciclo de Strict Mode de la ejecución local del build. |
| 11–15 | Cierre y puente a la sesión 11 | El grupo explica por qué el detalle estable puede abrir después un flujo global de creación sin mover la query. |

**Comprobación:** `75 + 30 + 60 + 15 = 180` minutos.

## Preparación del taller

El checkpoint alternativo `session-10-workshop-start` contiene:

- familia de keys y hook probado con identidad fija;
- modelo, adapter, `MediaDetailContent` y `PageState` presentacionales;
- `MediaDocumentTitle` con cleanup;
- modelo temporal visible;
- prueba del adapter y build funcional.

Omite deliberadamente:

- la integración final con `detailInput`;
- la composición completa de estados en `MediaDetailPage`;
- la eliminación del modelo temporal;
- cualquier solución del taller.

## Uso acotado del agente

La persona escribe el adapter y define primero su matriz. Después puede pedir a un agente que cree únicamente:

```text
src/adapters/__tests__/media-catalog-detail-to-model.test.ts
```

Casos mínimos:

1. película conserva duración y nulls de serie;
2. serie conserva temporadas y episodios;
3. año nulo produce `Fecha desconocida`;
4. `coverUrl` se expone como `posterUrl`;
5. arrays y nulls se conservan.

La invocación de `ahk-test` y sus límites aparecen en las guías. La persona debe leer el diff, ejecutar la prueba dirigida y explicar qué demuestra. El agente no puede editar implementación, rutas, hooks, componentes, dependencias ni configuración.

## Dependencia siguiente

La sesión 11 añadirá un modal global de creación que puede abrirse desde `SearchPage` y `MediaDetailPage`. Usará un store mínimo de Zustand para conservar solo la identidad seleccionada y montará el modal una vez en `PublicLayout`.

Esta sesión deja ambas páginas navegables y el detalle identificado, pero no introduce botones de creación, formularios, Zustand, Zod, autenticación ni mutaciones.

## Fuera de alcance

- loaders, actions, Data Mode o Framework Mode de React Router;
- fetching dentro de `useEffect`;
- copiar params o DTO a estado local;
- `useMemo`, `useLayoutEffect`, `useEffectEvent` o un hook personalizado para el título;
- modal remoto, selección global o segundo detalle superpuesto;
- formulario de creación, Zustand, Zod, Firebase o autenticación;
- presentar `entry` o `isLogged`;
- restaurar la búsqueda al volver desde detalle;
- deploy, configuración de fallback del hosting o pruebas de producción.

## Riesgos que la guía debe hacer visibles

- Colocar el hook después de un retorno temprano rompe el orden estable de hooks.
- Confundir `pending` con una request activa muestra un spinner para una query deshabilitada.
- Omitir identidad en la key mezcla entradas de caché.
- Tratar `catalog: null` como error de red oculta una respuesta válida del servidor.
- Convertir el adapter en Effect duplica estado y sincronización.
- Omitir cleanup deja el título residual al cambiar de página.
- Interpretar Fast Refresh como evidencia de Strict Mode puede producir conclusiones falsas; se limpia la consola y se recarga antes de observar.
- Un preview local no demuestra que el sitio esté desplegado ni que el servidor acepte deep links.
