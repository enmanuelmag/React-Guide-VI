# Clase 12 · Taller de navegación pública

- **Semana:** 4
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** proyecto semilla `s04-c12-navegacion-publica-seed`, construido desde el checkpoint exacto de la clase 11
- **Checkpoint de salida:** cada tarjeta navega a una URL pública que reconstruye el detalle remoto sin depender de una selección anterior

## Resultado de aprendizaje

El estudiante podrá migrar el detalle basado en estado local hacia una página identificada por la URL, conectar esa identidad con una query dependiente y reutilizar la presentación existente sin duplicar el DTO ni el JSX del detalle.

## Limitación que abre la clase

El checkpoint 11 ya reconoce direcciones como `/media/movie/438631`, pero `MediaDetailPage` solo muestra los parámetros validados. La experiencia completa continúa dentro del modal de `SearchPage`:

```text
tarjeta
→ onSelect({ externalId, mediaType })
→ selectedDetailInput
→ useMediaDetail
→ modal
```

Ese recorrido funciona mientras `SearchPage` permanece montada, pero la selección no forma parte de la dirección. Copiar la URL, abrir otra pestaña o recargar no reconstruye el mismo detalle.

La clase reemplaza la identidad local del recorrido principal por esta cadena:

```text
Link de la tarjeta
→ /media/:mediaType/:externalId
→ useParams
→ GetMediaDetailInput | null
→ useMediaDetail
→ DTO en caché
→ adaptador
→ MediaDetailContent + MediaDocumentTitle
```

La URL contiene identidad, no contiene el DTO. Una pestaña nueva puede empezar con la caché vacía y consultar nuevamente el servidor; aun así, dispone de los datos mínimos para reconstruir la pantalla.

## Conceptos que se consolidan

- URL como identidad pública y navegable.
- `Link` como enlace semántico dentro de la SPA.
- Parámetros de ruta como valores externos que deben validarse.
- Llamadas incondicionales de hooks antes de retornos tempranos.
- Query dependiente mediante `GetMediaDetailInput | null`.
- Separación entre navegación, estado remoto y presentación.
- Adaptación del DTO durante el render.
- Reutilización de `MediaDetailContent` en contextos distintos.
- Sincronización y cleanup de `document.title` en una página.
- Verificación mediante deep link, recarga e historial.

## Mapa de responsabilidades

| Pieza | Responsabilidad al cerrar la clase | Lo que no conserva |
| --- | --- | --- |
| React Router | Relacionar la URL con `MediaDetailPage` y entregar parámetros | DTO, caché o selección del modal |
| `MediaDetailPage` | Validar parámetros, componer estados y elegir qué representar | Una copia de la respuesta en `useState` |
| TanStack Query | Consultar y conservar el DTO remoto por query key | La ruta actual o el modal abierto |
| Adaptador | Convertir el DTO disponible en `MediaDetailModel` | Estado o efectos |
| `MediaDetailContent` | Renderizar un `MediaDetailModel` | Parámetros, fetchers o query keys |
| `MediaDocumentTitle` | Sincronizar y restaurar `document.title` | El DTO completo o la navegación |

La clase no introduce Zustand. La URL ya resuelve la identidad pública y TanStack Query conserva los datos remotos. Zustand se reservará para el drawer compartido que podrá abrirse desde ramas distantes en la etapa de mejoras.

## Guion de presentación

### Propósito y duración

El bloque conceptual dura aproximadamente 18 minutos. Recupera las piezas creadas en las clases 09, 10 y 11, muestra el problema de integración y prepara el vocabulario del taller sin revelar la solución completa.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Tres checkpoints, una página incompleta | Clase 09: query dependiente y modal. Clase 10: título con cleanup. Clase 11: URL y página provisional. | Mostrar tres capturas pequeñas y pedir qué identidad usa cada una. |
| Problema | La URL existe, pero aún no reconstruye el detalle | La ruta entrega `mediaType` y `externalId`; todavía no ejecuta la query ni muestra el contenido remoto. | Abrir un deep link en otra pestaña y comparar con el modal. |
| Contraste | Selección local frente a identidad navegable | `selectedDetailInput` describe una interacción local; la ruta describe una pantalla que puede copiarse y recargarse. | Diagrama antes/después. No presentar una como reemplazo universal de todo estado local. |
| Propiedad | Router, Query y React no compiten | Router elige la página; Query administra el DTO; React compone estados y presentación. | Tabla de tres columnas. Preguntar dónde vivirían el título, la caché y el input. |
| Validación | Los parámetros siguen siendo datos externos | `useParams` entrega texto posiblemente ausente. Solo después de comprobar tipo e identificador se construye `GetMediaDetailInput`. | Comparar `/media/movie/438631`, `/media/anime/438631` y `/media/movie`. |
| Regla de React | El hook no puede quedar después de un retorno condicional | La página deriva `GetMediaDetailInput | null`, llama siempre `useMediaDetail` y después representa el error de URL. `null` mantiene la query deshabilitada. | Snippet incorrecto/correcto de cinco líneas. Aclarar que no se llama al fetcher para una URL inválida. |
| Reutilización | Mismo contenido, propietarios distintos | `MediaDetailContent` acepta un modelo visual. Por eso puede vivir dentro de un modal o una página sin conocer ninguno de los dos contenedores. | Diagrama `DTO → adaptador → modelo → contenido`. |
| Puente | Qué queda preparado y qué pertenece al taller | Antes del descanso habrá input nullable y contenido fijo. El taller conectará enlace, query, estados, título y limpieza del flujo anterior. | Checklist sin código de solución. |

### Indicaciones que deben sobrevivir a la producción de slides

- Mostrar el árbol final de la clase 11 y resaltar únicamente `SearchPage`, `MediaDetailPage` y la ruta dinámica.
- La URL no transporta `MediaCatalogDetailDto`. Transporta `mediaType + externalId`; el servidor continúa siendo la fuente del detalle.
- La respuesta raíz continúa transportando `catalog`, `entry` e `isLogged`. La página pública adapta únicamente `catalog`; no copia ni representa la rama personal nullable, cuyo consumidor aparecerá en la clase 19.
- Abrir una pestaña nueva puede producir un request aunque el medio ya se consultó en otra pestaña. La URL hace reconstruible la pantalla; no comparte automáticamente la memoria de TanStack Query entre documentos.
- `Link` sustituye la acción principal “Ver detalle” porque representa navegación iniciada por la persona. No debe presentarse `useNavigate` como una versión más avanzada o preferible.
- No colocar `useMediaDetail` después de `if (...) return`. La llamada debe conservar el mismo orden en todos los renders de `MediaDetailPage`.
- El input `null` no significa película. El fallback interno usado por la query key deshabilitada no representa una selección y no debe generar un request.
- URL inválida y error remoto son estados distintos. El primero falla antes de consultar; el segundo ocurre después de construir un input válido.
- `MediaDetailContent` no se reutiliza porque “todo debe ser componente”, sino porque ya expresa una responsabilidad visual independiente del modal.
- `MediaDocumentTitle` se mueve conceptualmente con el detalle cargado. No se duplica su Effect dentro de la página.
- El recorrido obligatorio elimina el modal y la cadena de selección que queden sin uso. El modal de vista rápida solo puede reaparecer como reto secundario y explícito.
- Volver a `/search` puede crear una nueva instancia de `SearchPage` y reiniciar sus controles locales. Resolverlo con query params pertenece a la clase 22; no se agrega Zustand, persistencia ni Effect.
- `pnpm preview` permite comprobar el build local, pero no demuestra que un hosting de producción tenga configurado el fallback hacia `index.html`.

### Snippets conceptuales para las slides

Versión incorrecta:

```tsx
if (detailInput === null) return <InvalidRoute />

const detailQuery = useMediaDetail(detailInput)
```

Versión que conserva el orden de hooks:

```tsx
const detailQuery = useMediaDetail(detailInput)

if (detailInput === null) return <InvalidRoute />
```

El snippet solo enseña orden. La composición completa de la página se construye en el editor y durante el taller.

### Cierre conceptual

La clase vuelve al deck durante la revisión y responde:

1. ¿Qué información necesita la URL para reconstruir un detalle y qué información sigue viniendo del servidor?
2. ¿Por qué `useMediaDetail(null)` es preferible a llamar el hook únicamente dentro de la rama válida?
3. ¿Qué pieza conserva el DTO y cuál decide que `MediaDetailPage` debe estar visible?
4. ¿Por qué regresar a `/search` puede reiniciar el formulario aunque la query de detalle continúe en caché?

El cierre conecta el checkpoint con la clase 13: las páginas públicas ya existen; el siguiente problema será capturar y validar credenciales antes de conectar autenticación.

## Proyecto semilla

### Nombre propuesto

`s04-c12-navegacion-publica-seed`

### Qué incluye

- Checkpoint exacto de la clase 11.
- Búsqueda pública con estados completos y tarjetas remotas.
- Query dependiente, adaptador, `MediaDetailContent` y modal remoto de la clase 09.
- `MediaDocumentTitle` conectado al detalle del modal, con cleanup.
- `BrowserRouter`, `PublicLayout`, `Outlet` y árbol declarativo.
- `/search`, `/media/:mediaType/:externalId` y wildcard.
- `MediaDetailPage` provisional que valida parámetros y muestra un `GetMediaDetailInput`.
- `NotFoundPage` con salida hacia `/search`.
- Proyecto que inicia con `pnpm dev` y termina `pnpm build` sin errores.

### Qué omite

- `Link` desde las tarjetas hacia el detalle.
- Input nullable preparado para mantener incondicional `useMediaDetail` en la página.
- Query remota dentro de `MediaDetailPage`.
- Estados remotos de la página.
- `MediaDetailContent` conectado al resultado de esa query.
- `MediaDocumentTitle` conectado al detalle de la URL.
- Limpieza de `selectedDetailInput`, callbacks y modal del recorrido anterior.
- Persistencia de filtros en query params, Zustand y autenticación.

### Comprobación previa del docente

Antes de compartir el seed, el docente debe:

1. Instalar desde el lockfile de la cohorte y ejecutar `pnpm dev`.
2. Buscar una película y una serie.
3. Confirmar que “Ver detalle” todavía abre el modal y cambia el título del documento.
4. Abrir `/media/movie/:externalId` y `/media/series/:externalId` con identidades verificadas; ambas deben mostrar el input provisional.
5. Comprobar que `/media/anime/:externalId` muestra el error de dominio y que `/media/movie` llega al wildcard.
6. Ejecutar `pnpm build` y `pnpm preview`.
7. Confirmar que la página todavía no importa `useMediaDetail`, el adaptador ni `MediaDocumentTitle`.

Las identidades usadas durante la clase deben verificarse contra la API pública de la cohorte antes de publicar el seed. No se fija en la guía un identificador que pueda dejar de existir.

## Antes del descanso · Explicación y progreso guiado · 75 minutos

| Tiempo | Responsable | Progreso y comprobación |
| --- | --- | --- |
| 0-18 min | Docente y grupo | Usar el deck para reconstruir los checkpoints 09-11, separar responsabilidades y presentar la regla de hooks que afectará a la página. |
| 18-32 min | Construcción interactiva | Auditar en paralelo el flujo del modal y la página provisional; marcar qué piezas se trasladan, se reutilizan o se retirarán. |
| 32-47 min | Docente con participación | Derivar `GetMediaDetailInput | null` desde los parámetros sin assertions y comprobar tres URLs. |
| 47-62 min | Práctica guiada | Renderizar `MediaDetailContent` en la página con un `MediaDetailModel` temporal y comprobar que el componente no depende del modal. |
| 62-70 min | Docente y estudiantes | Ensayar el orden correcto de `useMediaDetail(detailInput)` y el retorno inválido sin conectar todavía la query real. |
| 70-75 min | Docente | Auditar el checkpoint previo, presentar los hitos y compartir el checkpoint alternativo. |

La suma anterior al descanso es de 75 minutos.

### Paso 1 · Auditar los dos recorridos existentes

El grupo abre `search-page.tsx` y `media-detail-page.tsx` lado a lado. No modifica código durante los primeros minutos. Clasifica las piezas:

| Pieza actual | Decisión para el checkpoint 12 | Motivo |
| --- | --- | --- |
| `selectedDetailInput` | Retirar del recorrido base | La ruta pasa a conservar la identidad pública. |
| `useMediaDetail` | Mover su consumo a `MediaDetailPage` | La página dispone del input reconstruido desde la URL. |
| `MediaDetailContent` | Reutilizar | Ya recibe un modelo visual independiente del contenedor. |
| `MediaDocumentTitle` | Montar junto al éxito de la página | El título debe seguir al detalle visible. |
| `onSelect` de la tarjeta | Sustituir por `Link` | La acción principal ahora es navegar. |
| Búsqueda y resultados | Conservar en `SearchPage` | No cambia la responsabilidad de la pantalla. |

La auditoría evita editar por tanteo. Cada eliminación ocurrirá después de que exista el enlace que reemplaza su comportamiento.

### Paso 2 · Derivar un input nullable

La clase 11 validaba con retornos tempranos porque todavía no había hooks de datos en la página. Ahora se prepara un valor que representa ambos resultados de la validación:

```tsx
import { useParams } from "react-router"

import type { GetMediaDetailInput } from "../types/media-api"

const { mediaType, externalId } = useParams()

const detailInput: GetMediaDetailInput | null =
  (mediaType === "movie" || mediaType === "series") &&
  externalId !== undefined
    ? { mediaType, externalId }
    : null
```

No se usa `as MediaType`. La comprobación produce el estrechamiento y `null` conserva explícitamente el caso inválido.

Se prueban antes de continuar:

| URL | `detailInput` esperado |
| --- | --- |
| `/media/movie/438631` | `{ mediaType: "movie", externalId: "438631" }` |
| `/media/series/93405` | `{ mediaType: "series", externalId: "93405" }` |
| `/media/anime/438631` | `null` |

`/media/movie` no monta esta página porque el patrón exige otro segmento; lo resuelve la ruta wildcard.

### Paso 3 · Comprobar la reutilización con un modelo temporal

Para no conectar la solución remota antes del taller, el docente crea un fixture provisional y tipado:

```ts
import type { MediaDetailModel } from "../types/media-detail"

export const demoMediaDetail: MediaDetailModel = {
  mediaType: "movie",
  title: "Detalle de demostración",
  description: "Contenido temporal para comprobar la composición de la página.",
  posterUrl: null,
  releaseLabel: "2024",
  genres: ["Drama"],
  durationMinutes: 120,
  episodesCount: null,
  seasonsCount: null,
  reviewScore: 8.1,
}
```

`MediaDetailPage` lo usa solo cuando el input es válido:

```tsx
if (detailInput === null) {
  return (
    <section>
      <h1>No pudimos interpretar esta dirección</h1>
      <Link to="/search">Volver a la búsqueda</Link>
    </section>
  )
}

return (
  <section>
    <Link to="/search">Volver a la búsqueda</Link>
    <MediaDetailContent media={demoMediaDetail} />
  </section>
)
```

El medio fijo prueba el contrato visual, no prueba el recorrido remoto. Debe desaparecer durante el taller.

### Paso 4 · Preparar el orden de hooks sin resolver la query

El docente muestra por qué esta ampliación sería incorrecta:

```tsx
if (detailInput === null) return <InvalidRoute />

const detailQuery = useMediaDetail(detailInput)
```

Si el router cambia los parámetros mientras conserva la misma instancia de página, el componente podría ejecutar una cantidad u orden distinto de hooks. El grupo corrige el orden en una pizarra o snippet temporal:

```tsx
const detailQuery = useMediaDetail(detailInput)

if (detailInput === null) return <InvalidRoute />
```

No se guarda todavía esa llamada en el checkpoint previo. El taller la conectará con estados observables. La regla y el lugar exacto ya fueron explicados antes del descanso.

### Checkpoint alternativo antes del taller

Nombre propuesto: `s04-c12-detalle-ruta-base`.

Incluye:

- Rutas y layout del checkpoint 11.
- `GetMediaDetailInput | null` derivado sin assertions.
- Mensaje y salida para una URL de dominio inválida.
- `MediaDetailContent` visible con `demoMediaDetail` en una ruta válida.
- Modal remoto anterior todavía funcional desde las tarjetas.
- `pnpm build` correcto.

Omite:

- Enlaces desde las tarjetas.
- `useMediaDetail` dentro de la página.
- Estados remotos de la página.
- Adaptación del DTO en la página.
- Título conectado al detalle de la URL.
- Eliminación del fixture, modal y callbacks anteriores.

El docente puede compartir este checkpoint al terminar el bloque guiado. No comparte el checkpoint final ni corrige el taller desde el proyector.

## Descanso · 30 minutos

El docente no introduce conceptos, código ni instrucciones nuevas durante este bloque.

## Después del descanso · Taller de integración · 60 minutos

### Encargo

Completar el recorrido público para que “Ver detalle” navegue a una URL capaz de consultar y representar el medio correcto aunque se abra desde una pestaña nueva. Al terminar, el flujo principal ya no dependerá del modal ni de `selectedDetailInput`.

### Distribución sugerida

| Tiempo | Trabajo del estudiante | Evidencia intermedia |
| --- | --- | --- |
| 0-18 min | Reemplazar la acción principal de la tarjeta por `Link`, comprobar la ruta y retirar después la cadena `onSelect` que quedó sin uso. | Cada tarjeta produce un path con su propio `mediaType + externalId`; la búsqueda sigue funcionando sin modal. |
| 18-40 min | Conectar `useMediaDetail(detailInput)` antes del retorno inválido, adaptar el DTO y representar carga, error, catálogo ausente y éxito. | Una película y una serie ejecutan keys distintas; `anime` no produce request de detalle. |
| 40-52 min | Montar `MediaDocumentTitle`, retirar el fixture temporal y completar el enlace de regreso. | El título cambia al cargar y se restaura al salir; no queda contenido fijo. |
| 52-60 min | Probar pestaña nueva, recarga, Atrás y Adelante; retirar código muerto y ejecutar `pnpm build`. | Dos paths verificables, Network sin request inválido y build correcto. |

La suma del taller es de 60 minutos.

### Trabajo obligatorio

1. Renderizar un `Link` “Ver detalle” por tarjeta con el path `/media/${mediaType}/${externalId}`.
2. Comprobar el nuevo enlace antes de retirar el callback anterior.
3. Eliminar del recorrido base `onSelect`, `selectedDetailInput`, handlers, modal y imports que hayan quedado sin uso.
4. Conservar en `MediaDetailPage` el `GetMediaDetailInput | null` preparado antes del descanso.
5. Ejecutar `useMediaDetail(detailInput)` de forma incondicional y antes de cualquier retorno por URL inválida.
6. Derivar `MediaDetailModel` desde `detailQuery.data?.catalog` mediante `toMediaDetailModel` durante el render.
7. Representar por separado URL inválida, carga, error remoto, catálogo ausente y éxito.
8. Reutilizar `MediaDetailContent` para el éxito y retirar `demoMediaDetail`.
9. Montar `MediaDocumentTitle` únicamente cuando exista el modelo visual.
10. Conservar un `Link` de regreso a `/search`.
11. Verificar película, serie, tipo inválido, ruta incompleta, recarga e historial.
12. Ejecutar `pnpm build` sin errores.

### Recorrido que debe poder explicar el estudiante

```text
MediaCard recibe un MediaSearchCardModel
→ Link construye el path con mediaType + externalId
→ React Router muestra MediaDetailPage
→ useParams recupera ambos segmentos
→ la página deriva GetMediaDetailInput | null
→ useMediaDetail observa una key habilitada o deshabilitada
→ TanStack Query consulta o reutiliza el DTO
→ toMediaDetailModel deriva la forma visual
→ MediaDetailContent representa el detalle
→ MediaDocumentTitle sincroniza el documento
```

La tarjeta ya no ejecuta una función definida por `SearchPage` para elegir el detalle principal. Ahora entrega al navegador una dirección. Este cambio no vuelve innecesarios los callbacks: siguen siendo apropiados para interacciones locales que no son navegación.

### Solución de referencia para el docente

La guía del estudiante puede omitir esta sección. El docente la usa para revisar contratos, orden de hooks y limpieza del flujo anterior.

La acción de la tarjeta usa un enlace real:

```tsx
import { Link } from "react-router"

<Link to={`/media/${media.mediaType}/${media.externalId}`}>
  Ver detalle
</Link>
```

No se envía el DTO mediante `state` ni se llama al fetcher desde el clic.

La página conserva el hook antes de sus retornos condicionales:

```tsx
import { Stack } from "@mantine/core"
import { Link, useParams } from "react-router"

import { toMediaDetailModel } from "../adapters/media-catalog-to-detail"
import { MediaDetailContent } from "../components/media-detail-content"
import { MediaDocumentTitle } from "../components/media-document-title"
import { PageState } from "../components/page-state"
import { useMediaDetail } from "../hooks/features/use-media"
import type { GetMediaDetailInput } from "../types/media-api"

export function MediaDetailPage() {
  const { mediaType, externalId } = useParams()

  const detailInput: GetMediaDetailInput | null =
    (mediaType === "movie" || mediaType === "series") &&
    externalId !== undefined
      ? { mediaType, externalId }
      : null

  const detailQuery = useMediaDetail(detailInput)
  const detailModel = detailQuery.data?.catalog
    ? toMediaDetailModel(detailQuery.data.catalog)
    : null

  if (detailInput === null) {
    return (
      <Stack component="section" gap="md">
        <PageState
          variant="invalid"
          title="No pudimos interpretar esta dirección"
        />
        <Link to="/search">Volver a la búsqueda</Link>
      </Stack>
    )
  }

  return (
    <Stack component="section" gap="md">
      <Link to="/search">Volver a la búsqueda</Link>

      {detailQuery.isLoading && <PageState variant="loading" />}

      {detailQuery.isError && (
        <PageState
          variant="error"
          title="No pudimos cargar el detalle"
          description={detailQuery.error.message}
          onRetry={() => void detailQuery.refetch()}
        />
      )}

      {detailQuery.isSuccess && detailQuery.data.catalog === null && (
        <PageState
          variant="unavailable"
          title="Detalle de catálogo no disponible"
          onRetry={() => void detailQuery.refetch()}
        />
      )}

      {detailModel !== null && (
        <>
          <MediaDocumentTitle title={detailModel.title} />
          <MediaDetailContent media={detailModel} />
        </>
      )}
    </Stack>
  )
}
```

La solución reutiliza `PageState` para los estados completos y conserva `MediaDetailContent` para éxito. La página clasifica cada caso y entrega `refetch`; el componente visual no conoce Query. No añade otro hook, otro adaptador ni un segundo componente de contenido para la página.

### Limpieza esperada en `SearchPage`

Después de comprobar los enlaces, se retiran las piezas que solo servían al detalle principal en modal:

- `selectedDetailInput`.
- `handleSelectMedia` y `handleCloseDetail`.
- `useMediaDetail` y `toMediaDetailModel` usados por el modal.
- `Modal`, estados del detalle y `MediaDocumentTitle` del recorrido anterior.
- Prop `onSelect` de `MediaSearchResults` y `MediaCard`.
- Imports que hayan quedado sin consumidor.

No se elimina el estado local del formulario de búsqueda ni la query de resultados. La limpieza se hace por responsabilidad, no borrando todo lo que use `useState`.

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
│   ├── app-header.tsx
│   ├── media-card.tsx
│   ├── media-detail-content.tsx
│   ├── media-document-title.tsx
│   └── media-search-results.tsx
├── hooks/
│   ├── features/
│   │   └── use-media.ts
│   └── media-keys.ts
├── layouts/
│   └── public-layout.tsx
├── pages/
│   ├── media-detail-page.tsx
│   ├── not-found-page.tsx
│   └── search-page.tsx
├── types/
│   ├── media-api.ts
│   ├── media-detail.ts
│   ├── media-search-card.ts
│   └── media.ts
├── App.tsx
└── main.tsx
```

El fixture `demo-media-detail.ts` no pertenece a la estructura final.

### Restricciones

- No llamar `useMediaDetail` después de un retorno condicional.
- No ejecutar `getMediaDetail` o `fetch` desde el `Link`.
- No pasar el DTO completo mediante `Link state` para evitar reconstruirlo.
- No copiar la respuesta a `useState`, Zustand o `localStorage`.
- No duplicar el JSX de `MediaDetailContent` dentro de la página.
- No crear otro adaptador con la misma entrada y salida.
- No usar `useEffect` para responder al cambio de parámetros o ejecutar la query.
- No conservar código muerto del modal en el checkpoint base.
- No persistir todavía filtros o resultados de búsqueda en la URL.
- No introducir `useNavigate`, loaders, actions o un segundo modo de React Router.

### Actividades del docente durante el taller

- Pedir que cada pareja diga qué comportamiento reemplazará antes de borrar el modal.
- Revisar primero el path producido por una tarjeta y el `detailInput` derivado.
- Buscar llamadas a hooks después de retornos tempranos antes de revisar estilos.
- Usar Network para distinguir URL inválida de error remoto.
- Preguntar quién conserva la URL, quién conserva el DTO y quién transforma el modelo.
- Abrir un path en una pestaña nueva para detectar dependencias de `selectedDetailInput` o `Link state`.
- Pedir que retiren el fixture y los imports muertos antes de ejecutar el build.
- Evitar escribir la solución completa desde el proyector; orientar mediante el flujo y las evidencias intermedias.

### Actividades de los estudiantes durante el taller

- Construir el enlace con la identidad que ya conserva cada tarjeta.
- Probar el enlace antes de retirar el callback anterior.
- Conectar el input nullable con el hook existente.
- Reutilizar las ramas de estado practicadas en la clase 09.
- Derivar el modelo visual sin crear estado adicional.
- Mover la sincronización del título al éxito de la página.
- Copiar dos paths y pedir a otra pareja que los abra.
- Probar Atrás y Adelante y describir qué estado de búsqueda se conserva o se reinicia.
- Revisar Network con un tipo inválido.
- Ejecutar el build y completar la matriz de aceptación.

### Matriz de aceptación

| Recorrido | Resultado esperado | Evidencia |
| --- | --- | --- |
| Clic en una película | Navega a `/media/movie/:externalId` y carga su detalle | URL, contenido y key de Query Devtools coinciden. |
| Clic en una serie | Navega a `/media/series/:externalId` y carga su detalle | El tipo y la identidad difieren de la película. |
| Abrir un path en otra pestaña | La página reconstruye el detalle sin selección previa | Aparecen carga y éxito después del request. |
| Recargar un detalle | La misma URL vuelve a consultar y representar el medio | No depende de `Link state` ni del modal. |
| `/media/anime/:externalId` | Muestra error de URL | Network no registra request de detalle. |
| `/media/movie` | Muestra `NotFoundPage` | El patrón dinámico no coincide. |
| Error remoto controlado | La página muestra `Alert` y conserva salida a búsqueda | La aplicación no queda en blanco. |
| Catálogo ausente | Muestra el mensaje específico | No se confunde con error de red. |
| Salir del detalle | Restaura el título anterior | `MediaDocumentTitle` ejecuta cleanup. |
| Atrás y Adelante | El navegador recorre las páginas visitadas | No se llama manualmente a `history`. |

### Reto adicional

Conservar una “Vista rápida” mediante un botón secundario distinto de “Ver detalle”. Puede reutilizar el modal anterior y `MediaDetailContent`, pero debe cumplir estas condiciones:

- El enlace sigue siendo la acción principal y el checkpoint funciona sin la vista rápida.
- El modal conserva solo identidad mínima en estado local.
- El DTO permanece en TanStack Query.
- No se intercepta el clic del enlace para abrir el modal.

El reto no se revisa hasta que la matriz obligatoria esté completa. El drawer global y Zustand permanecen reservados para la clase 24.

## Revisión y demostración · 15 minutos

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0-5 min | Intercambio entre parejas | Cada pareja abre una película y una serie recibidas como paths, sin ejecutar antes una búsqueda. |
| 5-10 min | Diagnóstico público | Dos estudiantes explican `Link → params → input → query → modelo → contenido` y muestran una URL inválida sin request. |
| 10-15 min | Cierre con el deck | El grupo responde las preguntas conceptuales, confirma el build y conecta el resultado con los formularios de la clase 13. |

## Criterios de aceptación del checkpoint

- Cada resultado ofrece un `Link` con `mediaType + externalId` correctos.
- La URL basta para reconstruir la página de detalle.
- `useMediaDetail` se llama antes de retornos condicionales y recibe `null` para parámetros inválidos.
- La URL inválida no ejecuta el request de detalle.
- La página diferencia carga, error remoto, catálogo ausente y éxito.
- El DTO se adapta durante el render y `MediaDetailContent` no se duplica.
- `MediaDocumentTitle` cambia el título y lo restaura al salir.
- El recorrido base ya no depende de `selectedDetailInput`, `onSelect` ni el modal anterior.
- Atrás, Adelante y recarga producen recorridos explicables.
- `pnpm build` finaliza correctamente.

## Entrega

El estudiante entrega:

- Código del checkpoint.
- Un path de película y uno de serie verificados.
- Matriz de aceptación marcada con resultado real.
- Confirmación del build final.

No se exige una captura por cada fila. Una captura de Network para la URL inválida y una explicación breve de la pestaña nueva bastan como evidencia complementaria.

## Errores frecuentes y respuesta docente

| Síntoma | Pregunta de diagnóstico | Respuesta esperada |
| --- | --- | --- |
| React o ESLint señala cambio en el orden de hooks. | ¿La query se llama después de un retorno por URL inválida? | Derivar input nullable, llamar el hook y representar después la rama inválida. |
| `/media/anime/123` solicita una película. | ¿El fallback de la key deshabilitada está ejecutando el fetcher? | Confirmar `enabled: input !== null`; el fallback no es una selección. |
| La nueva pestaña queda vacía. | ¿La página reconstruye el input desde `useParams` o espera estado previo? | Eliminar dependencia de `selectedDetailInput` o `Link state`. |
| La tarjeta cambia de pantalla mediante `onClick`. | ¿La acción es navegación que debería poder abrirse en otra pestaña? | Usar `Link` con un `to` válido. |
| El detalle muestra datos del resumen. | ¿Se reutilizó el modelo de tarjeta como si fuera el DTO de detalle? | Consultar `useMediaDetail` y adaptar `catalog`. |
| Modal y página tienen JSX casi idéntico. | ¿Qué componente ya expresa la presentación del modelo? | Reutilizar `MediaDetailContent`. |
| El título permanece al volver. | ¿La página duplicó el Effect o montó `MediaDocumentTitle` con el éxito? | Reutilizar el componente con cleanup de la clase 10. |
| La búsqueda aparece limpia al regresar. | ¿Se prometió conservar estado local entre páginas? | Reconocer el desmontaje y reservar query params para la clase 22. |
| El build falla por imports sin uso. | ¿Qué piezas del modal ya no tienen consumidor? | Retirar estado, handlers, componentes e imports de forma dirigida. |
| Un deep link falla solo en el hosting. | ¿El servidor entrega `index.html` para rutas de la SPA? | Configurar fallback en el host; el preview local no lo demuestra. |

## Vocabulario

- **Identidad navegable:** conjunto mínimo de valores incluidos en la URL que permite reconstruir una pantalla.
- **Deep link:** dirección que abre directamente una pantalla específica sin recorrer primero otras páginas.
- **Input nullable:** contrato que representa una entrada válida o la ausencia explícita de una entrada utilizable.
- **Hook incondicional:** hook llamado en el mismo nivel y orden en cada render del componente.
- **Estado de navegación:** dato temporal asociado a una transición; no reemplaza la identidad que debe sobrevivir a una recarga.
- **Código muerto:** código que permanece en el proyecto pero ya no puede ejecutarse ni tiene un consumidor real.
- **Ruta canónica:** dirección estable escogida para representar una pantalla concreta del producto.
- **Error de dominio:** valor que cumple la forma de una ruta, pero no pertenece a las variantes permitidas por la aplicación.
- **Error remoto:** fallo ocurrido al consultar el servidor después de construir una entrada válida.

## Fuera del alcance

- Conservar búsqueda y filtros mediante query params; se trabaja en la clase 22.
- Usar Zustand para la identidad del detalle público.
- Convertir el modal opcional en drawer global; se reserva para la clase 24.
- `useNavigate` y navegación imperativa.
- `NavLink` y estados activos.
- `createBrowserRouter`, loaders, actions, Data Mode o Framework Mode.
- Prefetch de rutas o datos.
- Suspense y error boundaries del router.
- Configurar un proveedor de hosting concreto.
- Formularios, autenticación y rutas privadas.

## Referencias docentes

- [Reglas de Hooks de React](https://react.dev/reference/rules/rules-of-hooks)
- [Modos de React Router](https://reactrouter.com/start/modes)
- [`Link` en React Router](https://reactrouter.com/api/components/Link)
- [`useParams` en React Router 8](https://api.reactrouter.com/v8/functions/react-router.useParams.html)
- [Valores de URL en modo declarativo](https://reactrouter.com/start/declarative/url-values)
- [Despliegue de una SPA con React Router](https://reactrouter.com/how-to/spa)
