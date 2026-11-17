# Guía docente · Sesión 05 · Estado derivado y filtros locales

- **Semana:** 2.
- **Modalidad:** virtual · 90 minutos.
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md).
- **Control de lectura:** [reading-check.md](reading-check.md).
- **Plan y alcance:** [session-draft.md](session-draft.md).
- **Material público:** [student-guide.md](student-guide.md).
- **Apoyo visual opcional:** [Animación 01 · Renders y estados](01-animacion-renders-estados/README.md).

## Propósito docente

Conducir desde una búsqueda controlada hasta dos filtros combinados sin almacenar resultados redundantes. React recuerda query y mediaTypeFilter; JavaScript calcula lista, conteo y mensajes. La sesión 06 recibirá este catálogo completo para añadir selección.

## Ruta recuperable

Proyecto: repositorio hermano MediaLog-Bootcamp. Trabaja en una copia propia; las ramas son referencias. Guarda cambios antes de consultar otra etapa.

| Bloque | Rama | Estado observable |
| --- | --- | --- |
| B01 | session-05-start | Idéntica a session-04-end; búsqueda por título |
| B03 | session-05-step-01-type-filter | Archivo del control y CSS; aún no se renderiza |
| B04 | session-05-step-02-controlled-type | Cambia el botón activo; lista aún filtrada solo por texto |
| B05 | session-05-step-03-combined-filters | Texto y tipo afectan juntos la lista |
| B06 | session-05-step-04-empty-causes | Vacíos por causa; práctica sin resolver |
| B07–B09 | session-05-end | Contador y limpieza; checkpoint completo |

## Preparación antes de clase

1. Comprueba una copia de session-05-start con seis medios, tres películas, tres series y ambos fallbacks.
2. Confirma Node >=22.22.0, pnpm 11.17.0, React 19.2.8 y TypeScript 6.0.3; conserva configuración y lockfile.
3. Comprueba que la aplicación inicia y reserva las búsquedas bear y matrix.
4. Revisa el cuestionario y elige una pregunta con errores.
5. Ten disponible la presentación aprobada. Toda edición y todo archivo completo aparecen después de la presentación continua.

## Secuencia docente

### S05-B01 · 0–8 min · Recuperar la búsqueda

1. Muestra seis medios con consulta vacía.
2. Prueba bear: The Bear. Prueba matrix: Sin resultados. Borra para recuperar seis.
3. Pregunta: “¿Qué recuerda React y qué puede volver a calcular?”. Respuesta: query se recuerda; normalizedQuery y visibleMedia se calculan.
4. Recupera una pregunta previa. No reconstruyas SearchInput ni introduzcas el segundo control todavía.

**Checkpoint:** búsqueda de 04 recuperada. Si falla, registra el error y recupera la entrada antes de añadir cambios.

### S05-B02 · 8–20 min · Presentación continua

Recorre las slides 1–14 en una sola pasada. La 15 es referencia docente para el cierre oral. No abras el editor ni pidas copiar código durante este bloque.

Distribuye los 12 minutos: checkpoint y nueva necesidad 2; recordar/calcular 3; contrato y control 3; predicado y predicciones 2; vacíos, contador y limpieza 2. Es una estimación para ensayar; si el grupo necesita más explicación, registra el desfase y el paso que queda pendiente.

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Qué ocurre si guardamos el conteo y olvidamos actualizarlo? | Puede contradecir la lista; se calcula desde su longitud. |
| ¿Puede cambiar el texto sin cambiar el tipo? | Sí; son dos decisiones independientes. |
| ¿Existe un medio cuyo tipo sea all? | No; all pertenece al control y permite cualquier tipo del dominio. |
| ¿Quién decide qué botón está activo? | App guarda el valor; el hijo lo recibe por props. |
| ¿Basta coincidir en título o tipo? | Debe cumplir ambos: AND. |
| ¿Un arreglo vacío siempre tiene la misma causa? | No; puede faltar fuente o faltar coincidencia. |

Define estado redundante como un dato guardado que ya se puede calcular. No uses un objeto de estado solo por agrupar dos controles. El contador y la limpieza se presentan como comportamiento; la solución completa se reserva para después de la práctica.

**Apoyo visual opcional, antes del coding:** [Animación 01 · Renders y estados](01-animacion-renders-estados/README.md) ofrece 22 hitos navegables con ← y →: primer render, cambio del texto y dos setters en un checkbox. Úsala como parte del mismo bloque conceptual, sustituyendo una explicación equivalente dentro de sus 12 minutos; no exige copiar código ni modifica el checkpoint. Haz una pausa en el hito 09 para preguntar qué contiene `query` después del setter, y en el 17 para contar las dos solicitudes pendientes. Confirma en el 21 que ambas llegan juntas a la vista. El barrido representa calcular JSX; verde señala cambios aplicados al DOM. El ejemplo `onlySeries` es independiente del control `mediaTypeFilter` que construiremos. El README contiene instrucciones de uso, código completo, respuestas esperadas y precisiones sobre la simulación. Si interrumpes la explicación, registra «Animación 01, hito NN, pregunta pendiente».

**Puente:** “Ya sabemos qué recordar. Construyamos el segundo control y conectémoslo paso a paso”. Cierra las slides y abre el editor una sola vez.

### S05-B03 · 20–34 min · Definir el segundo control

**Responsable:** docente escribe, grupo predice. **Entrada:** búsqueda de 04. **Salida:** control definido, todavía sin consumidor.

#### Referencia de entrada · No volver a escribir

Estos archivos ya existen. Úsalos para localizar o recuperar una pieza; no los transcribas como actividad. El CSS heredado se conserva íntegro en el archivo completo del paso 2.

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaGrid } from './components/media-grid'
import { SearchInput } from './components/search-input'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) =>
    media.title.toLowerCase().includes(normalizedQuery),
  )

  const hasNoResults =
    mediaItems.length > 0 &&
    normalizedQuery.length > 0 &&
    visibleMedia.length === 0

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <SearchInput value={query} onQueryChange={setQuery} />
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tu búsqueda."
          />
        ) : (
          <MediaGrid items={visibleMedia} />
        )}
      </main>
    </>
  )
}

export default App
```

**`src/components/app-header.tsx` · archivo completo:**

```tsx
export function AppHeader() {
  return (
    <header className="app-header">
      <p className="app-header__eyebrow">Medialog</p>
      <h1>Tu próxima historia empieza aquí</h1>
      <p>Explora películas y series y organiza tu biblioteca personal.</p>
    </header>
  )
}
```

**`src/components/search-input.tsx` · archivo completo:**

```tsx
type SearchInputProps = {
  value: string
  onQueryChange: (value: string) => void
}

export function SearchInput(props: SearchInputProps) {
  const { value, onQueryChange } = props

  return (
    <label className="search-input">
      Buscar por título
      <input
        type="search"
        value={value}
        onChange={(event) => onQueryChange(event.currentTarget.value)}
      />
    </label>
  )
}
```

**`src/components/media-grid.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { EmptyState } from './empty-state'
import { MediaCard } from './media-card'

type MediaGridProps = {
  items: MediaItem[]
}

export function MediaGrid(props: MediaGridProps) {
  const { items } = props
  if (items.length === 0) {
    return (
      <EmptyState
        title="Catálogo vacío"
        description="No hay películas o series disponibles."
      />
    )
  }

  return (
    <div className="media-list">
      {items.map((media) => (
        <MediaCard key={media.id} data={media} />
      ))}
    </div>
  )
}
```

**`src/components/media-card.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { MediaTypeBadge } from './media-type-badge'

type MediaCardProps = {
  data: MediaItem
}

export function MediaCard(props: MediaCardProps) {
  const { data } = props
  return (
    <article className="media-card">
      {data.posterUrl ? (
        <img
          className="media-card__poster-image"
          src={data.posterUrl}
          alt={`Poster de ${data.title}`}
        />
      ) : (
        <div className="media-card__poster">Poster no disponible</div>
      )}

      <div>
        <p className="media-card__meta">
          <MediaTypeBadge mediaType={data.mediaType} /> · {data.releaseDate}
        </p>
        <h3>{data.title}</h3>
        <p>{data.description ?? 'Sin descripción disponible'}</p>
      </div>
    </article>
  )
}
```

**`src/components/media-type-badge.tsx` · archivo completo:**

```tsx
import type { MediaType } from '../types/media-item'

type MediaTypeBadgeProps = {
  mediaType: MediaType
}

export function MediaTypeBadge(props: MediaTypeBadgeProps) {
  const { mediaType } = props
  const label = mediaType === 'movie' ? 'Película' : 'Serie'

  return <span className="media-type-badge">{label}</span>
}
```

**`src/components/empty-state.tsx` · archivo completo:**

```tsx
type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState(props: EmptyStateProps) {
  const { title, description } = props
  return (
    <section className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  )
}
```

**`src/types/media-item.ts` · archivo completo:**

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

**`src/data/media-items.ts` · archivo completo:**

```ts
import type { MediaItem } from '../types/media-item'

export const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: 'Arrival',
    description:
      'Una lingüista intenta comunicarse con visitantes extraterrestres.',
    mediaType: 'movie',
    releaseDate: '2016-11-11',
    posterUrl: '/posters/arrival.svg',
  },
  {
    id: 2,
    title: 'Severance',
    description:
      'Un grupo de empleados separa sus recuerdos laborales y personales.',
    mediaType: 'series',
    releaseDate: '2022-02-18',
    posterUrl: '/posters/severance.svg',
  },
  {
    id: 3,
    title: 'Aftersun',
    description:
      'Una hija reconstruye los recuerdos de unas vacaciones con su padre.',
    mediaType: 'movie',
    releaseDate: '2022-10-21',
    posterUrl: null,
  },
  {
    id: 4,
    title: 'The Bear',
    description: null,
    mediaType: 'series',
    releaseDate: '2022-06-23',
    posterUrl: '/posters/the-bear.svg',
  },
  {
    id: 5,
    title: 'Past Lives',
    description:
      'Dos amigos de la infancia se reencuentran años después en Nueva York.',
    mediaType: 'movie',
    releaseDate: '2023-06-02',
    posterUrl: '/posters/past-lives.svg',
  },
  {
    id: 6,
    title: 'Blue Eye Samurai',
    description:
      'Una guerrera persigue una venganza en el Japón del periodo Edo.',
    mediaType: 'series',
    releaseDate: '2023-11-03',
    posterUrl:
      '/posters/blue-eye-samurai.svg',
  },
]
```

#### Paso 1 · Crear MediaTypeFilter

Pregunta antes: “¿Debemos añadir all al tipo de una película?”. Respuesta: no, ampliamos solo el valor aceptado por el control. Crea el archivo:

**`src/components/media-type-filter.tsx` · archivo completo:**

```tsx
import type { MediaType } from '../types/media-item'

export type MediaTypeFilterValue = MediaType | 'all'

type MediaTypeFilterProps = {
  value: MediaTypeFilterValue
  onFilterChange: (value: MediaTypeFilterValue) => void
}

const mediaTypeOptions: {
  value: MediaTypeFilterValue
  label: string
}[] = [
  { value: 'all', label: 'Todos' },
  { value: 'movie', label: 'Películas' },
  { value: 'series', label: 'Series' },
]

export function MediaTypeFilter(props: MediaTypeFilterProps) {
  const { value, onFilterChange } = props

  return (
    <div className="media-type-filter">
      {mediaTypeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
```

Explica las líneas en este orden:

1. El import type reutiliza MediaType sin crear otro dominio. La unión exportada acepta movie, series o all; App importará ese tipo.
2. MediaTypeFilterProps exige un value y un callback. El callback recibe un valor permitido y no necesita devolver un resultado: void.
3. mediaTypeOptions es un arreglo de objetos con value tipado y label visible. Las tres entradas separan el dato interno de su texto en español.
4. La función recibe props con su contrato; la siguiente línea extrae value y onFilterChange dentro del cuerpo.
5. El div agrupa opciones y conecta el CSS mediante className. map entrega un botón por opción; los paréntesis de la arrow devuelven JSX.
6. key usa option.value porque identifica cada opción. type="button" evita envío implícito dentro de un formulario.
7. aria-pressed compara la prop con esa opción; la etiqueta permanece estable. No es otra variable de estado.
8. onClick recibe una función pendiente; solo cuando ocurre el click llama al callback con option.value. No escribas onClick={onFilterChange(option.value)}.
9. option.label es el contenido visible. Las llaves insertan el valor dentro del JSX; los cierres terminan botón, map, div, return y función.

**Pregunta:** “¿Por qué no lo vemos todavía?”. **Respuesta:** definir/exportar un componente no lo monta; falta importarlo y usarlo en App. No inventes un callback vacío para adelantar la conexión.

#### Paso 2 · Añadir el soporte visual del control

Sustituye src/index.css por el archivo completo. Se conservan los estilos de 04 y se añaden únicamente los del filtro por tipo al final. Se puede copiar CSS como soporte; el grupo explica cómo el atributo activa su apariencia.

**`src/index.css` · archivo completo:**

```css
:root {
  font-family: Inter, system-ui, sans-serif;
  color: #f5f1e8;
  background: #141412;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.app-header,
.page-container {
  width: min(960px, calc(100% - 32px));
  margin: 0 auto;
}

.app-header {
  padding: 64px 0 32px;
  border-bottom: 1px solid #3b3a34;
}

.app-header__eyebrow,
.media-card__meta {
  color: #d2a84a;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-container {
  padding: 32px 0 64px;
}

.media-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 24px;
  padding: 24px;
  border: 1px solid #3b3a34;
  border-radius: 16px;
  background: #1d1d1a;
}

.media-card__poster {
  display: grid;
  min-height: 220px;
  place-items: center;
  border-radius: 10px;
  color: #a9a59a;
  background: #2a2924;
}

@media (max-width: 600px) {
  .media-card {
    grid-template-columns: 1fr;
  }
}
.media-list {
  display: grid;
  gap: 24px;
}
.media-card__poster-image {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  object-fit: cover;
}

.empty-state {
  padding: 48px 24px;
  border: 1px dashed #565349;
  border-radius: 16px;
  text-align: center;
  color: #a9a59a;
}

.empty-state h3 {
  margin-top: 0;
  color: #f5f1e8;
}

.media-type-badge {
  display: inline-flex;
  padding: 2px 8px;
  border: 1px solid currentColor;
  border-radius: 999px;
}

.search-input {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
}

.search-input input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
}

.search-input input:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.media-type-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.media-type-filter button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.media-type-filter button[aria-pressed='true'] {
  border-color: #d9be74;
  background: #d9be74;
  color: #141412;
}

.media-type-filter button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}
```

Las reglas nuevas hacen lo siguiente:

- .media-type-filter usa flex; flex-wrap permite varias filas; gap separa botones 8 px y margin-bottom deja 24 px antes del catálogo.
- El botón recibe padding 10px 16px, borde de 1px, radio 10px, fondo y texto de la paleta existente. font hereda la tipografía y cursor indica que es accionable.
- El selector [aria-pressed='true'] aplica borde y fondo dorados y texto oscuro solo a la opción activa. No necesita otra clase ni estado.
- focus-visible dibuja un contorno de 2px con separación de 2px para navegación por teclado.

#### Paso 3 · Comprobar el archivo antes de conectarlo

Ejecuta pnpm build y pnpm lint. El catálogo sigue igual; no aparecen botones todavía. Referencia: session-05-step-01-type-filter. El siguiente bloque conectará la prop real.

### S05-B04 · 34–46 min · App conserva la fuente de verdad

#### Paso 1 · Añadir estado y conectar el control

Antes de escribir pregunta: “¿Quién necesita este valor para decidir la lista?”. Respuesta: App, ancestro del input, filtro y grid. Sustituye App completo:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaGrid } from './components/media-grid'
import {
  MediaTypeFilter,
  type MediaTypeFilterValue,
} from './components/media-type-filter'
import { SearchInput } from './components/search-input'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')
  const [mediaTypeFilter, setMediaTypeFilter] =
    useState<MediaTypeFilterValue>('all')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) =>
    media.title.toLowerCase().includes(normalizedQuery),
  )

  const hasNoResults =
    mediaItems.length > 0 &&
    normalizedQuery.length > 0 &&
    visibleMedia.length === 0

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <SearchInput value={query} onQueryChange={setQuery} />
        <MediaTypeFilter
          value={mediaTypeFilter}
          onFilterChange={setMediaTypeFilter}
        />
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tu búsqueda."
          />
        ) : (
          <MediaGrid items={visibleMedia} />
        )}
      </main>
    </>
  )
}

export default App
```

Lee las líneas nuevas:

1. El import trae el componente como valor y MediaTypeFilterValue solo como tipo.
2. useState<MediaTypeFilterValue>('all') declara qué valores puede recordar el estado. Los ángulos especifican el tipo; no crean una función genérica propia. 'all' es el valor inicial.
3. mediaTypeFilter es el valor de este render; setMediaTypeFilter solicita otro valor para el siguiente.
4. MediaTypeFilter recibe value y onFilterChange; el setter satisface el callback esperado.
5. AppHeader, SearchInput, page-container, h2, MediaGrid y export default se conservan. El filtro de texto y el mensaje siguen como en 04.

#### Paso 2 · Verificar la etapa incompleta de forma deliberada

Pulsa Películas, luego Series. Solo un botón comunica aria-pressed=true. Con consulta vacía continúan seis tarjetas: aún no usamos el tipo en el cálculo. Pide narrar “click → callback del hijo → setter del padre → render → prop nueva”. Si alguien añade estado al hijo, pregunta qué pasaría al limpiar desde App.

**Checkpoint:** session-05-step-02-controlled-type. No presentes el filtro por tipo como terminado.

### S05-B05 · 46–61 min · Combinar texto y tipo

#### Paso 1 · Predecir dos condiciones

Pregunta por The Bear: con bear y Series pasa ambas; con bear y Películas falla el tipo. Explica OR dentro de matchesType: Todos permite cualquier tipo, o debe coincidir el tipo concreto. Explica AND entre criterios: ambas pruebas deben resultar verdaderas.

#### Paso 2 · Sustituir App con el predicado completo

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaGrid } from './components/media-grid'
import {
  MediaTypeFilter,
  type MediaTypeFilterValue,
} from './components/media-type-filter'
import { SearchInput } from './components/search-input'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')
  const [mediaTypeFilter, setMediaTypeFilter] =
    useState<MediaTypeFilterValue>('all')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) => {
    const matchesQuery = media.title.toLowerCase().includes(normalizedQuery)
    const matchesType =
      mediaTypeFilter === 'all' || media.mediaType === mediaTypeFilter

    return matchesQuery && matchesType
  })

  const hasNoResults =
    mediaItems.length > 0 &&
    normalizedQuery.length > 0 &&
    visibleMedia.length === 0

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <SearchInput value={query} onQueryChange={setQuery} />
        <MediaTypeFilter
          value={mediaTypeFilter}
          onFilterChange={setMediaTypeFilter}
        />
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tu búsqueda."
          />
        ) : (
          <MediaGrid items={visibleMedia} />
        )}
      </main>
    </>
  )
}

export default App
```

Explica el cambio línea por línea:

1. filter sigue recorriendo mediaItems sin modificarlo; media es el objeto evaluado.
2. El cuerpo ahora usa llaves para declarar dos constantes; por eso necesita return explícito.
3. matchesQuery compara el título en minúsculas con normalizedQuery.
4. matchesType es verdadero cuando el control está en all o coincide con media.mediaType.
5. return matchesQuery && matchesType conserva solo quien cumple ambas pruebas.
6. visibleMedia sigue siendo un cálculo de este render y alimenta el mismo MediaGrid. No crees colecciones en useState.

#### Paso 3 · Probar y discutir una alternativa incorrecta

Prueba consulta vacía/Películas: 3; vacía/Series: 3; bear/Series: 1; bear/Películas: 0. Pregunta, sin editar: “¿Qué mostraría OR entre las dos condiciones?”. Respuesta: admitiría películas que no coinciden con bear y también The Bear aunque no sea película.

El mensaje todavía dice “búsqueda”, heredado de 04. El siguiente bloque ampliará el significado y la condición de filtros activos. Referencia: session-05-step-03-combined-filters.

### S05-B06 · 61–72 min · Mantener la causa del vacío

#### Paso 1 · Ampliar los derivados y el mensaje

Sustituye App completo:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaGrid } from './components/media-grid'
import {
  MediaTypeFilter,
  type MediaTypeFilterValue,
} from './components/media-type-filter'
import { SearchInput } from './components/search-input'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')
  const [mediaTypeFilter, setMediaTypeFilter] =
    useState<MediaTypeFilterValue>('all')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) => {
    const matchesQuery = media.title.toLowerCase().includes(normalizedQuery)
    const matchesType =
      mediaTypeFilter === 'all' || media.mediaType === mediaTypeFilter

    return matchesQuery && matchesType
  })

  const hasActiveFilters =
    normalizedQuery.length > 0 || mediaTypeFilter !== 'all'

  const hasNoResults =
    mediaItems.length > 0 &&
    hasActiveFilters &&
    visibleMedia.length === 0

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <SearchInput value={query} onQueryChange={setQuery} />
        <MediaTypeFilter
          value={mediaTypeFilter}
          onFilterChange={setMediaTypeFilter}
        />
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tus filtros."
          />
        ) : (
          <MediaGrid items={visibleMedia} />
        )}
      </main>
    </>
  )
}

export default App
```

Explica:

1. hasActiveFilters usa texto normalizado, no la cadena cruda: espacios solos no activan un filtro.
2. El OR permite que el tipo concreto active filtros aunque no exista texto.
3. hasNoResults exige fuente con elementos, filtros efectivos y cero coincidencias.
4. El mensaje ahora habla de filtros, porque cualquiera de los dos puede restringir.
5. En la otra rama MediaGrid recibe visibleMedia. Si la fuente está vacía, mantiene “Catálogo vacío”.

Pregunta: “¿Qué valor debe pasar a MediaGrid?”. Respuesta: visibleMedia; volver a pasar mediaItems anularía el filtro. No cambies ese componente.

#### Paso 2 · Probar fuente vacía y restaurarla

Guarda tu fixture y sustitúyelo temporalmente por este archivo:

**`src/data/media-items.ts` · archivo completo:**

```ts
import type { MediaItem } from '../types/media-item'

export const mediaItems: MediaItem[] = []
```

Con consulta vacía/Todos y con bear/Películas debe decir Catálogo vacío. Esta prueba no pide borrar objetos uno por uno. Antes de continuar restaura el archivo completo:

**`src/data/media-items.ts` · archivo completo:**

```ts
import type { MediaItem } from '../types/media-item'

export const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: 'Arrival',
    description:
      'Una lingüista intenta comunicarse con visitantes extraterrestres.',
    mediaType: 'movie',
    releaseDate: '2016-11-11',
    posterUrl: '/posters/arrival.svg',
  },
  {
    id: 2,
    title: 'Severance',
    description:
      'Un grupo de empleados separa sus recuerdos laborales y personales.',
    mediaType: 'series',
    releaseDate: '2022-02-18',
    posterUrl: '/posters/severance.svg',
  },
  {
    id: 3,
    title: 'Aftersun',
    description:
      'Una hija reconstruye los recuerdos de unas vacaciones con su padre.',
    mediaType: 'movie',
    releaseDate: '2022-10-21',
    posterUrl: null,
  },
  {
    id: 4,
    title: 'The Bear',
    description: null,
    mediaType: 'series',
    releaseDate: '2022-06-23',
    posterUrl: '/posters/the-bear.svg',
  },
  {
    id: 5,
    title: 'Past Lives',
    description:
      'Dos amigos de la infancia se reencuentran años después en Nueva York.',
    mediaType: 'movie',
    releaseDate: '2023-06-02',
    posterUrl: '/posters/past-lives.svg',
  },
  {
    id: 6,
    title: 'Blue Eye Samurai',
    description:
      'Una guerrera persigue una venganza en el Japón del periodo Edo.',
    mediaType: 'series',
    releaseDate: '2023-11-03',
    posterUrl:
      '/posters/blue-eye-samurai.svg',
  },
]
```

Borra la consulta y elige Todos: seis medios. Ejecuta build. Referencia: session-05-step-04-empty-causes. Aún no contiene solución del contador ni de la limpieza.

### S05-B07 · 72–82 min · Práctica individual: contar y limpiar

#### Paso 1 · Entregar el comportamiento

Reserva siete minutos de intento y tres de revisión. Pide: derivar resultCount, mostrar visibles y total, limpiar ambos controles mediante un handler y deshabilitar la limpieza sin filtros efectivos. No proyectes aún la solución completa.

Pistas en orden: “¿Qué arreglo conoce el conteo?”, “¿Qué setters cambian las decisiones?”, “¿Qué booleano ya indica si hay algo que limpiar?”. Respuestas: visibleMedia.length; setQuery/setMediaTypeFilter; hasActiveFilters.

#### Paso 2 · Revisar la solución completa de App

Después del intento, compara con este archivo:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaGrid } from './components/media-grid'
import {
  MediaTypeFilter,
  type MediaTypeFilterValue,
} from './components/media-type-filter'
import { SearchInput } from './components/search-input'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')
  const [mediaTypeFilter, setMediaTypeFilter] =
    useState<MediaTypeFilterValue>('all')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) => {
    const matchesQuery = media.title.toLowerCase().includes(normalizedQuery)
    const matchesType =
      mediaTypeFilter === 'all' || media.mediaType === mediaTypeFilter

    return matchesQuery && matchesType
  })

  const hasActiveFilters =
    normalizedQuery.length > 0 || mediaTypeFilter !== 'all'

  const hasNoResults =
    mediaItems.length > 0 &&
    hasActiveFilters &&
    visibleMedia.length === 0

  const resultCount = visibleMedia.length

  function handleClearFilters() {
    setQuery('')
    setMediaTypeFilter('all')
  }

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <SearchInput value={query} onQueryChange={setQuery} />
        <MediaTypeFilter
          value={mediaTypeFilter}
          onFilterChange={setMediaTypeFilter}
        />
        <div className="filter-summary">
          <p>Mostrando {resultCount} de {mediaItems.length}</p>
          <button
            type="button"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            Limpiar filtros
          </button>
        </div>
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tus filtros."
          />
        ) : (
          <MediaGrid items={visibleMedia} />
        )}
      </main>
    </>
  )
}

export default App
```

Lee las líneas nuevas:

1. resultCount toma visibleMedia.length. No necesita un setter.
2. handleClearFilters agrupa dos actualizaciones del evento: cadena vacía y all.
3. El div filter-summary reúne texto y acción. El párrafo interpola la longitud filtrada y el total del fixture; no fija el número 6 en JSX.
4. type="button" conserva acción normal; onClick recibe la función sin ejecutarla durante render.
5. disabled={!hasActiveFilters} invierte la condición: sin filtros efectivos no existe trabajo de limpieza.
6. La rama de vacíos se conserva debajo del resumen. Una fuente vacía puede mostrar 0 de 0.
7. Con espacios solos y Todos el botón queda deshabilitado aunque el input muestre espacios: no hay filtro efectivo. Con un tipo concreto sí se habilita, y limpiar también borra esos espacios.

#### Paso 3 · Incorporar el CSS del resumen

Se copia como soporte durante la revisión; no consume el intento de lógica. Sustituye el archivo completo:

**`src/index.css` · archivo completo:**

```css
:root {
  font-family: Inter, system-ui, sans-serif;
  color: #f5f1e8;
  background: #141412;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.app-header,
.page-container {
  width: min(960px, calc(100% - 32px));
  margin: 0 auto;
}

.app-header {
  padding: 64px 0 32px;
  border-bottom: 1px solid #3b3a34;
}

.app-header__eyebrow,
.media-card__meta {
  color: #d2a84a;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-container {
  padding: 32px 0 64px;
}

.media-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 24px;
  padding: 24px;
  border: 1px solid #3b3a34;
  border-radius: 16px;
  background: #1d1d1a;
}

.media-card__poster {
  display: grid;
  min-height: 220px;
  place-items: center;
  border-radius: 10px;
  color: #a9a59a;
  background: #2a2924;
}

@media (max-width: 600px) {
  .media-card {
    grid-template-columns: 1fr;
  }
}
.media-list {
  display: grid;
  gap: 24px;
}
.media-card__poster-image {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  object-fit: cover;
}

.empty-state {
  padding: 48px 24px;
  border: 1px dashed #565349;
  border-radius: 16px;
  text-align: center;
  color: #a9a59a;
}

.empty-state h3 {
  margin-top: 0;
  color: #f5f1e8;
}

.media-type-badge {
  display: inline-flex;
  padding: 2px 8px;
  border: 1px solid currentColor;
  border-radius: 999px;
}

.search-input {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
}

.search-input input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
}

.search-input input:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.media-type-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.media-type-filter button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.media-type-filter button[aria-pressed='true'] {
  border-color: #d9be74;
  background: #d9be74;
  color: #141412;
}

.media-type-filter button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.filter-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-summary p {
  margin: 0;
}

.filter-summary button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.filter-summary button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-summary button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}
```

Las reglas nuevas de .filter-summary colocan texto y botón en flex, permiten salto de fila, centran verticalmente y los separan a ambos extremos. gap deja 12px entre elementos; margin-bottom separa el catálogo 24px. El párrafo pierde su margen por defecto.

El botón conserva padding, borde, radio, paleta y fuente del filtro. :disabled reduce opacidad a 0.5 y cambia cursor; el atributo disabled del JSX es quien impide la acción. :focus-visible conserva contorno y separación de teclado. Las reglas del control por tipo permanecen intactas.

**Checkpoint:** session-05-end. El estudiante debe explicar la solución; cargar la rama no demuestra haber realizado la práctica.

### S05-B08 · 82–86 min · Registrar evidencia

1. Ejecuta los comandos desde MediaLog-Bootcamp:

```bash
pnpm build
pnpm lint
```

2. Registra código de salida. Revisa la matriz durante los bloques donde se construye cada comportamiento; aquí cierra lo pendiente.
3. Prueba los botones también con Tab y Enter o Espacio. Comprueba una sola opción activa y ausencia de warnings/errores.
4. Si repites la fuente vacía, restaura los seis objetos antes de entregar. La restauración íntegra está en B06.

| Caso | Consulta | Tipo | Resultado esperado |
| --- | --- | --- | --- |
| Inicial | vacía | Todos | 6; limpiar deshabilitado |
| Películas | vacía | Películas | 3: Arrival, Aftersun, Past Lives |
| Series | vacía | Series | 3: Severance, The Bear, Blue Eye Samurai |
| Texto | bear | Todos | 1: The Bear |
| Combinación | bear | Series | 1: The Bear |
| Sin coincidencia | bear | Películas | 0; Sin resultados |
| Texto inexistente | matrix | Todos | 0; Sin resultados |
| Normalización | dos espacios + BEAR + dos espacios | Series | 1; texto escrito se conserva |
| Espacios solos | tres espacios | Todos | 6; limpiar deshabilitado |
| Espacios y tipo | tres espacios | Películas | 3; limpiar habilitado |
| Limpiar | cualquier consulta y tipo | click Limpiar filtros | consulta vacía, Todos, 6 y botón deshabilitado |
| Fuente vacía | vacía | Todos | 0 de 0; Catálogo vacío |
| Fuente vacía filtrada | bear | Películas | 0 de 0; Catálogo vacío; limpiar habilitado |

El build no prueba clicks, teclado ni lector de pantalla. La inspección del atributo no acredita una prueba con tecnologías de asistencia. Conserva cada evidencia por separado.

### S05-B09 · 86–90 min · Cierre oral

Sin regresar a la presentación, pregunta:

1. “¿Qué recuerda React?”. Respuesta: query y mediaTypeFilter.
2. “¿Por qué no guardar resultCount?”. Respuesta: se deriva de la lista actual; otra copia puede quedar desactualizada.
3. “¿Quién decide el botón activo?”. Respuesta: App mediante value; el hijo comunica cambios mediante callback.
4. “¿Qué distingue las dos causas de vacío?”. Respuesta: si existen datos en la fuente antes de filtrar.

Puente: en 06 una identidad seleccionada responderá qué medio abrir. No añadas todavía selección, modal ni Mantine.

## Registro de ritmo y reanudación

| Bloque | Minutos previstos | Minutos reales | Pendiente observado |
| --- | ---: | --- | --- |
| S05-B01 | 8 | Por registrar en clase | Por registrar en clase |
| S05-B02 | 12 | Por registrar en clase | Por registrar en clase |
| S05-B03 | 14 | Por registrar en clase | Por registrar en clase |
| S05-B04 | 12 | Por registrar en clase | Por registrar en clase |
| S05-B05 | 15 | Por registrar en clase | Por registrar en clase |
| S05-B06 | 11 | Por registrar en clase | Por registrar en clase |
| S05-B07 | 10 | Por registrar en clase | Por registrar en clase |
| S05-B08 | 4 | Por registrar en clase | Por registrar en clase |
| S05-B09 | 4 | Por registrar en clase | Por registrar en clase |

Total 90 minutos. Si termina la clase, registra último bloque comprobado, archivo/cambio guardado, primer paso pendiente y evidencia ausente. Ejemplo: “B05 comprobado; App combina criterios; falta ampliar vacíos y practicar contador/limpieza; build final pendiente”.

Al retomar, abre la copia guardada y pide explicar su flujo. Completa el paso pendiente antes de introducir selección de 06. Una referencia Git recupera archivos, no comprensión.

## Contingencias

- Control sin aparecer: comprueba si sigues en B03; falta la conexión de B04. Allí está App completo.
- Retraso en CSS: copia el archivo completo del bloque; conserva el tiempo para explicar contrato y flujo.
- Retraso en predicado: usa la etapa combinada para recuperar el archivo, pero pide explicar AND y OR antes de continuar.
- Práctica incompleta: registra contador o limpieza como pendiente. No adelantes 06 ni declares el checkpoint cumplido por cargar la solución.
- Fuente vacía accidental: restaura el fixture completo de B06 antes del build.
- No hay navegador o DevTools: registra qué comprobación falta; no la sustituyas por un build.

## Respuestas del cuestionario previo

1. **B.** `visibleMedia` se calcula durante cada render a partir de los tres datos existentes; no necesita otro estado. Fuente: React, `You Might Not Need an Effect` → `Updating state based on props or state`.
2. **Verdadero.** Los controles pueden cambiar de forma independiente. Fuente: React, `Choosing the State Structure` → `Group related state`.
3. **A.** Un componente controlado recibe su valor actual mediante props. Fuente: React, `Sharing State Between Components` → `Controlled and uncontrolled components`.
4. **Verdadero.** Un solo componente guarda el valor principal de cada estado. Fuente: React, `Sharing State Between Components` → `A single source of truth for each state`.
5. **A.** `resultCount` se calcula con `visibleMedia.length`. Fuente: React, `You Might Not Need an Effect` → `Updating state based on props or state`.

## Errores previsibles e intervención

| Error | Diagnóstico | Intervención breve |
| --- | --- | --- |
| Guardar `visibleMedia` en estado | Confusión entre memoria y cálculo. | Pedir que enumere todas las entradas suficientes para recalcularlo. |
| Guardar `resultCount` | Duplicación del arreglo en otro valor. | Preguntar qué ocurre si cambia el filtro y se olvida el setter del conteo. |
| Añadir `"all"` a `MediaType` | Mezcla interfaz con dominio. | Comparar un medio real con una opción del control. |
| Estado dentro de `MediaTypeFilter` | Dos fuentes de verdad. | Trazar prop, callback y setter del padre. |
| Usar `||` entre coincidencias | Acepta cumplir solo uno de los filtros. | Leer en voz alta la regla: título y tipo deben coincidir. |
| Key por índice | Identidad ligada a posición. | Usar `option.value`, que ya es estable y único. |
| Etiqueta cambia a “Activado” | El nombre de la acción deja de ser estable. | Mantener el texto y comunicar estado con `aria-pressed`. |
| “Sin resultados” para fuente `[]` | Se perdió la causa del vacío. | Revisar primero `mediaItems.length > 0`. |
| Limpiar solo un control | Handler incompleto. | Enumerar las dos fuentes de verdad activas. |
| Botón siempre habilitado | No usa el derivado existente. | Conectar `disabled={!hasActiveFilters}`. |

## Preguntas socráticas

- ¿Puede cambiar la consulta sin cambiar el tipo?
- ¿Puede obtenerse el conteo sin recordar otro dato?
- ¿Existe un medio cuyo tipo real sea `"all"`?
- ¿Qué recibe el hijo para saber qué botón está activo?
- ¿Qué información pierde la interfaz si todos los arreglos vacíos producen el mismo mensaje?

## Criterio de cierre

La sesión está lista para avanzar cuando:

- el estudiante puede explicar el flujo de ambos controles;
- la matriz produce los resultados previstos;
- solo existen dos estados en `App`;
- el botón de limpieza refleja si existe un filtro efectivo;
- se conserva `MediaGrid items={visibleMedia}`;
- el build del seed termina correctamente y el navegador aporta evidencia separada.

No presentar como cumplidos los dos últimos tipos de evidencia si el seed o el navegador no estuvieron disponibles.

## Fuentes

- React, [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure).
- React, [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).
- W3C WAI-ARIA Authoring Practices, [Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

Contenido técnico contrastado el 10 de septiembre de 2026 con Context7 (React, derivación durante render) y W3C APG (botones y aria-pressed).
