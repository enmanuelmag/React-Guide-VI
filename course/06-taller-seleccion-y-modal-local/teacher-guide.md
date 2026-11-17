# Guía docente · Sesión 06 · Taller de selección y modal local

Material privado. **Presencial · 180 minutos:** 75 antes del descanso, 30 de descanso, 60 de taller y 15 de revisión.

- **Semana:** 2.
- [Lectura previa](pre-class-reading.md)
- [Control de lectura](reading-check.md)
- [Guía estudiantil](student-guide.md)
- [Rúbrica](workshop-rubric.md)
- [Plan de sesión](session-draft.md)

## Objetivo y ruta recuperable

Recordar una identidad en App, calcular el objeto desde el fixture y llevar el callback hasta la tarjeta que origina el click. Mantine presenta el diálogo; React decide su contenido y apertura.

| Bloque | Referencia | Estado |
| --- | --- | --- |
| B01 | session-06-start | 05-end más detalle visual y CSS de soporte; sin Mantine ni selección |
| B03 | session-06-step-01-mantine | Dependencias, configuración y provider |
| B04 | session-06-step-02-selection | Id, objeto y apertura comprobables con diagnóstico temporal |
| B05–B06 | session-06-step-03-modal-preview = session-06-workshop-start | Modal desde trigger; sin callbacks ni botones en tarjetas |
| B08 | session-06-step-04-callback-contracts | Contratos conectados, tarjeta aún no ejecuta |
| B09 | session-06-step-05-card-selection | Tarjetas seleccionan; trigger todavía presente |
| B10–B15 | session-06-end | Trigger retirado; flujo completo |

Trabaja en una copia propia; guarda cambios antes de consultar ramas. La entrada no es idéntica a 05-end: añade solo MediaDetailContent y CSS preparado. El taller recibe el modal temporal y omite la solución de callbacks. Las referencias resueltas permanecen privadas.

## Preparación antes de clase

1. Comprueba el checkpoint 05: seis tarjetas, filtros, contador, limpieza y vacíos.
2. Ten disponible session-06-start y el respaldo session-06-workshop-start sin distribuir soluciones.
3. Confirma Node >=22.22.0 y pnpm 11.17.0; no actualices versiones durante la clase.
4. Revisa el cuestionario y elige una pregunta para recuperar.
5. Abre la presentación aprobada y publica el encargo. Todas las instrucciones de archivos aparecen después de la presentación continua.

## Antes del descanso · 75 minutos

### S06-B01 · 0–12 min · Recuperar el catálogo

1. Busca bear con Series y confirma The Bear.
2. Cambia a Películas: Sin resultados.
3. Limpia: seis tarjetas y botón deshabilitado.
4. Pregunta por qué el conteo no necesita estado. Respuesta: se obtiene de visibleMedia.length.
5. Recupera una pregunta previa; no reconstruyas 05.

**Puente:** ya decidimos qué mostrar en la lista; ahora falta recordar qué medio abrir.

### S06-B02 · 12–24 min · Presentación continua

Recorre slides 1–23 una sola vez. Usa portada y agenda como transición breve; la 24 anuncia el descanso futuro y puede quedar sin proyectar; la 25 es referencia para cierre oral. No abras el editor. Las slides del taller describen lo que habrá al llegar a ese momento, no código ya implementado.

Distribuye 12 minutos: necesidad/id/objeto 3; ancestro común 2; Mantine y cierre 2; referencias/callback/closure 4; encargo 1. Este bloque es denso: el tiempo es una hipótesis de ensayo, no evidencia de aula. Las preguntas profundas sobre código continúan en el editor, sin volver al deck.

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Qué no dice un booleano de apertura? | Qué medio eligió la persona. |
| ¿Qué basta para encontrarlo? | Su id estable. |
| ¿Por qué no guardar otra copia del objeto? | Ya está en mediaItems; la copia podría quedar desactualizada. |
| ¿Quién contiene tarjeta y modal? | App es su ancestro común cercano. |
| ¿Qué recibe Grid? | Una referencia de función; la reenvía. |
| ¿Qué añade Card al ejecutar? | Su data.id. |
| ¿Qué gestiona Mantine? | Presentación del diálogo, foco y solicitudes de cierre. |

Define closure como una función que conserva acceso a valores de su entorno; el handler de una tarjeta puede leer su data.id cuando ocurra el click. Define nombre accesible como el texto que identifica un control para tecnologías de asistencia; el extra reutilizará este concepto.

**Transición:** cierra las slides, abre el editor y continúa con los archivos de abajo.

### S06-B03 · 24–38 min · Preparar soporte y configurar Mantine

#### Referencia de entrada · No volver a escribir

Estos archivos conservan 05. Solo comprueba o recupera una pieza; no se transcriben durante la apertura.

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

#### Paso 1 · Comprobar el detalle visual y CSS del seed

session-06-start ya contiene ambos archivos siguientes. Si continúas directamente desde tu copia de 05-end, incorpóralos ahora; no añadas dos veces el CSS.

**`src/components/media-detail-content.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'

import { MediaTypeBadge } from './media-type-badge'

type MediaDetailContentProps = {
  media: MediaItem
}

export function MediaDetailContent(props: MediaDetailContentProps) {
  const { media } = props

  return (
    <article className="media-detail-content">
      {media.posterUrl !== null ? (
        <img src={media.posterUrl} alt="" />
      ) : (
        <p>Poster no disponible</p>
      )}
      <MediaTypeBadge mediaType={media.mediaType} />
      <p>{media.releaseDate}</p>
      <p>{media.description ?? 'Sin descripción disponible'}</p>
    </article>
  )
}
```


Explica el soporte: import type reutiliza MediaItem; MediaTypeBadge conserva el label aprendido; el contrato pide un objeto; props se desestructura dentro del cuerpo. El ternario muestra imagen o alternativa. alt vacío evita repetir el título que dará el modal. Se muestran tipo, fecha y descripción con el mismo reemplazo de null. Este componente no guarda estado, no abre el modal y no decide selección.

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

.media-detail-content img {
  display: block;
  width: 160px;
  max-width: 100%;
  height: auto;
  margin-bottom: 16px;
  border-radius: 10px;
}

.detail-button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.detail-button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.selection-preview {
  margin-bottom: 24px;
}
```


El CSS conserva todos los estilos de 05. Las reglas nuevas limitan la imagen del detalle a 160px, con max-width 100%, altura proporcional, margen inferior 16px y radio 10px. detail-button define padding 10px 16px, borde 1px, radio, paleta, fuente heredada y cursor. focus-visible dibuja contorno de 2px y separación de 2px. selection-preview separa el trigger temporal 24px; puede permanecer sin consumidor después de retirarlo.

#### Paso 2 · Instalar las versiones fijadas

Desde MediaLog-Bootcamp ejecuta:

```bash
pnpm add --save-exact @mantine/core@9.4.1 @mantine/hooks@9.4.1
pnpm add --save-exact -D postcss@8.5.26 postcss-preset-mantine@1.18.0 postcss-simple-vars@7.0.1
```

core ofrece Modal y provider; hooks es su dependencia par, aunque no usamos useDisclosure. -D marca herramientas de desarrollo. --save-exact evita rangos en el manifest. pnpm actualiza el lockfile; no lo escribas manualmente.

El manifest completo después de instalar es:

**`package.json` · archivo completo:**

```json
{
  "name": "medialog-bootcamp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "packageManager": "pnpm@11.17.0",
  "engines": {
    "node": ">=22.22.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mantine/core": "9.4.1",
    "@mantine/hooks": "9.4.1",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "postcss": "8.5.26",
    "postcss-preset-mantine": "1.18.0",
    "postcss-simple-vars": "7.0.1",
    "typescript": "6.0.3",
    "vite": "8.2.2"
  }
}
```

#### Paso 3 · Configurar PostCSS y la raíz

Crea postcss.config.cjs. .cjs permite module.exports; plugins declara el preset y simple-vars; variables fija los cinco breakpoints de la configuración de Mantine. Son soporte de estilos, no lógica de selección.

**`postcss.config.cjs` · archivo completo:**

```js
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
}
```


Sustituye main.tsx completo:

**`src/main.tsx` · archivo completo:**

```tsx
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
)
```


Lee cada conexión: import del provider y CSS de Mantine; StrictMode y createRoot heredados; App conserva su export default; index.css se importa después de los estilos de librería. getElementById encuentra el root del HTML y el ! ya existe desde el scaffold. render monta StrictMode → MantineProvider → App.

defaultColorScheme="dark" establece la apariencia inicial del toolkit para conservar el catálogo oscuro; no se crea un theme ni un selector de apariencia. No introduzcas ColorSchemeScript, Context API ni useDisclosure.

#### Paso 4 · Comprobar configuración aislada

Ejecuta pnpm build y pnpm lint. Deben funcionar filtros y seis tarjetas; no hay modal ni selección. Referencia session-06-step-01-mantine. Si falla, resuelve imports/dependencias antes del estado.

### S06-B04 · 38–51 min · Selección mínima comprobable

#### Paso 1 · Añadir estado, derivados y handlers

Sustituye App completo. Esta etapa utiliza un trigger y un diagnóstico temporal para que cada valor tenga un consumidor visible antes de montar Modal.

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

  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null)

  const selectedMedia =
    mediaItems.find((media) => media.id === selectedMediaId) ?? null
  const isDetailOpened = selectedMedia !== null
  const previewMedia = mediaItems[0] ?? null

  function handleSelectMedia(mediaId: number) {
    setSelectedMediaId(mediaId)
  }

  function handleCloseDetail() {
    setSelectedMediaId(null)
  }

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
        {previewMedia !== null ? (
          <div className="selection-preview">
            <button
              className="detail-button"
              type="button"
              onClick={() => handleSelectMedia(previewMedia.id)}
            >
              Probar detalle
            </button>
          </div>
        ) : null}
        <p>
          Selección: {selectedMedia?.title ?? 'Ninguna'} · Apertura: {String(isDetailOpened)}
        </p>
        <button className="detail-button" type="button" onClick={handleCloseDetail}>
          Limpiar selección
        </button>
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


Explica las líneas nuevas:

1. useState<number | null>(null) acepta identidad numérica o ausencia. Se recuerda solo selectedMediaId.
2. find busca en mediaItems completo; la arrow compara id. Si no hay coincidencia devuelve undefined; ?? null normaliza ausencia.
3. isDetailOpened compara el objeto con null; no requiere otro estado.
4. previewMedia toma el primer elemento o null para que el trigger no suponga una fuente no vacía.
5. handleSelectMedia recibe un number y llama al setter. handleCloseDetail asigna null.
6. El trigger solo existe si previewMedia no es null. onClick recibe una arrow que enviará su id cuando haya click.
7. El diagnóstico muestra título o Ninguna; String convierte el booleano a texto observable. El segundo botón permite comprobar cierre antes del modal.
8. Los controles, cálculo de filtros, contador, limpieza y vacíos siguen completos debajo.

#### Paso 2 · Predecir y comprobar

| Id | Objeto derivado | Apertura |
| --- | --- | --- |
| null | null | false |
| id existente | objeto | true |
| id inexistente | null | false |

Pulsa Probar detalle: Arrival y true. Pulsa Limpiar selección: Ninguna y false. Pregunta qué ocurriría con un id inexistente; recorre find y ?? sin añadir estado auxiliar. Referencia session-06-step-02-selection.

### S06-B05 · 51–64 min · Conectar el modal temporal

#### Paso 1 · Sustituir el diagnóstico por Modal

Sustituye App completo. Se retiran el párrafo y Limpiar selección; se conserva Probar detalle.

**`src/App.tsx` · archivo completo:**

```tsx
import { Modal } from '@mantine/core'
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaDetailContent } from './components/media-detail-content'
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

  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null)

  const selectedMedia =
    mediaItems.find((media) => media.id === selectedMediaId) ?? null
  const isDetailOpened = selectedMedia !== null
  const previewMedia = mediaItems[0] ?? null

  function handleSelectMedia(mediaId: number) {
    setSelectedMediaId(mediaId)
  }

  function handleCloseDetail() {
    setSelectedMediaId(null)
  }

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
        {previewMedia !== null ? (
          <div className="selection-preview">
            <button
              className="detail-button"
              type="button"
              onClick={() => handleSelectMedia(previewMedia.id)}
            >
              Probar detalle
            </button>
          </div>
        ) : null}
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tus filtros."
          />
        ) : (
          <MediaGrid items={visibleMedia} />
        )}
      </main>
      <Modal
        opened={isDetailOpened}
        onClose={handleCloseDetail}
        title={selectedMedia?.title ?? 'Detalle'}
        closeButtonProps={{ 'aria-label': 'Cerrar detalle' }}
        centered
      >
        {selectedMedia !== null ? (
          <MediaDetailContent media={selectedMedia} />
        ) : null}
      </Modal>
    </>
  )
}

export default App
```


Explica cada línea nueva: Modal se importa de core; MediaDetailContent es el componente preparado. Modal es hermano del main dentro del fragmento. opened recibe el cálculo; onClose recibe la función sin ejecutarla; title usa el objeto o Detalle. closeButtonProps entrega aria-label Cerrar detalle al control superior. centered centra el diálogo. El hijo se renderiza solo cuando selectedMedia existe, por eso su prop media nunca es null.

La librería emite onClose por control, Escape y overlay; App limpia la identidad. No desactives trapFocus, returnFocus, closeOnEscape ni closeOnClickOutside.

#### Paso 2 · Probar antes del taller

Abre Arrival; cierra por control; abre y pulsa Escape; abre y pulsa fuera. Comprueba que el foco regresa al trigger y Tab permanece dentro mientras está abierto. Pide explicar por qué volverá a abrir el mismo medio después de cerrar.

La prueba de la descripción nula se realizará al abrir la tarjeta de The Bear en el taller; ahora se conserva el primer medio como trigger de demostración.

**Checkpoint:** session-06-step-03-modal-preview y session-06-workshop-start apuntan al mismo estado. Grid/Card todavía no reciben onSelect ni muestran Ver detalle.

### S06-B06 · 64–75 min · Contratos y encargo

Antes del descanso, lee estas tres firmas:

| Capa | Nombre | Firma |
| --- | --- | --- |
| App | handleSelectMedia | (mediaId: number) => void |
| Grid | onSelect | (mediaId: number) => void |
| Card | onSelect | (mediaId: number) => void |

Pregunta qué diferencia hay entre pasar la referencia, crear una closure y ejecutarla durante render:

```tsx
onSelect={onSelect}
onClick={() => onSelect(data.id)}
onClick={onSelect(data.id)}
```

Las dos primeras son referencias entregadas; la tercera ejecuta ahora y entrega void al evento. Son comparaciones conceptuales, no tres líneas para pegar juntas.

No muestres las soluciones completas del taller. Todos los conceptos, incluyendo nombre accesible, ya se explicaron. Presenta ahora el encargo y la rúbrica siguientes; conserva 60 minutos calificables después del descanso.

#### Encargo y rúbrica · Copia para conducir la clase

##### Escenario

El modal solo puede abrirse desde un botón temporal de `App`. Las personas necesitan consultar cualquier tarjeta visible. Lleva la misma intención de selección hasta cada tarjeta sin mover el estado ni copiar el objeto.

##### Trabajo obligatorio

1. Añadir `onSelect: (mediaId: number) => void` a `MediaGrid`.
2. Pasar `handleSelectMedia` desde `App`.
3. Reenviar la referencia a cada `MediaCard`.
4. Añadir la misma firma a `MediaCard`.
5. Crear “Ver detalle” con `type="button"`.
6. Ejecutar `onSelect(data.id)` dentro del click.
7. Retirar `previewMedia` y “Probar detalle”.
8. Conservar el id como único estado de selección.
9. Mantener objeto y apertura como cálculos.
10. Comprobar película, serie, descripción nula y tres mecanismos de cierre.
11. Ejecutar regresión de filtros y `pnpm build`.
12. Explicar el recorrido completo de la acción.

##### Restricciones

- Conserva `MediaGrid items={visibleMedia}`.
- Conserva el tipo en `src/types/media-item.ts`.
- No uses Zustand, Context API ni otro store.
- No pases el setter a los hijos.
- No guardes una copia del objeto seleccionado.
- No añadas un booleano de apertura en estado.
- No busques la selección en `visibleMedia`.
- No uses `useEffect`, `useMemo` o `useDisclosure`.
- No añadas API, Router, TanStack Query o persistencia.
- No retires ninguna capacidad de la sesión 05.

##### Casos de aceptación

El docente comprobará:

1. `bear` con Series conserva The Bear y permite abrirlo.
2. Cerrar y abrir una película reemplaza el contenido anterior.
3. La entrada con descripción nula muestra el fallback.
4. Control superior, Escape y overlay cierran y limpian la selección.
5. React DevTools muestra estado en `App` y props en Grid y Card.
6. El texto “Probar detalle” y `previewMedia` ya no existen.
7. `pnpm build` termina con código de salida 0.
8. El estudiante explica `App define → props bajan → Card ejecuta → App actualiza → React calcula`.

##### Evidencia requerida

Entrega:

- código del checkpoint final;
- demostración de hasta 90 segundos con filtros, dos selecciones y cierre;
- comando `pnpm build` y su resultado;
- explicación breve del propietario del estado y del recorrido de `onSelect`.

El build no demuestra comportamiento de navegador. La grabación no demuestra por sí sola que TypeScript compile. El docente evalúa ambas evidencias por separado.

##### Actividad opcional

Después de completar la base, añade un nombre accesible específico a cada botón “Ver detalle” mediante el título del medio y compruébalo en el árbol de accesibilidad. Esta actividad no reemplaza un criterio obligatorio.

##### Tabla única de evaluación

| Tipo | Criterio o actividad | Qué se evalúa | Escala de asignación | Máximo | Obtenido |
| --- | --- | --- | --- | ---: | ---: |
| Base | Contratos y recorrido de `onSelect` | `App`, `MediaGrid` y `MediaCard` comparten `(mediaId: number) => void`; Grid reenvía la referencia y Card la ejecuta con su id dentro del click. | Completo: 25 · Parcial: 13 si el contrato llega a las tres capas pero una tarjeta no comunica correctamente su id, o si el recorrido funciona con una adaptación innecesaria · No demostrado: 0 si no existe un recorrido reproducible | 25 | ___ |
| Base | Identidad mínima y cálculos | `selectedMediaId` es el único estado de selección; objeto y apertura se derivan desde `mediaItems`; cerrar asigna `null`. | Completo: 20 · Parcial: 10 si la selección abre pero existe una duplicación o un cálculo usa la colección filtrada · No demostrado: 0 si no se puede identificar la selección activa | 20 | ___ |
| Base | Modal, contenido y cierre | Cada tarjeta abre su propio contenido, cambia de identidad, presenta el fallback y cierra por control, Escape y overlay. | Completo: 25 · Parcial: 13 si abre el modal pero falla el cambio de identidad, el fallback o uno de los mecanismos de cierre · No demostrado: 0 si no abre desde las tarjetas | 25 | ___ |
| Base | Regresión y restricciones | Filtros, contador, limpieza y vacíos permanecen funcionales; no quedan trigger temporal, store, Effect ni estado adicional prohibido. | Completo: 15 · Parcial: 8 si la selección funciona pero existe una regresión localizada o una referencia temporal restante · No demostrado: 0 si el cambio reemplaza el checkpoint anterior o depende de un patrón fuera de alcance | 15 | ___ |
| Base | Verificación y explicación | El proyecto se entrega, `pnpm build` termina correctamente, la matriz se recorre y el estudiante explica propietario, referencia, closure y límite de evidencia. | Completo: 15 · Parcial: 8 si existe evidencia parcial o la explicación omite una parte del flujo · No demostrado: 0 si no hay evidencia reproducible ni explicación del recorrido | 15 | ___ |
| Total | Total base | Suma de los cinco criterios obligatorios. | Suma de filas base | 100 | ___ |
| Extra | Nombre accesible específico | Cada botón expone `Ver detalle de {título}` y el estudiante demuestra el nombre en el árbol de accesibilidad después de completar el flujo base. | Cumple ambas condiciones: +10 · No cumple o reemplaza un requisito base: 0 | +10 | ___ |
| Total | Total extra | Suma de actividades opcionales válidas. | Máximo adicional permitido | +10 | ___ |
| Total | Puntaje bruto | Total base más total extra. | Máximo antes del límite institucional | 110 | ___ |
| Registro | Nota en plataforma | Puntaje bruto limitado al máximo institucional. | `min(puntaje bruto, 100)` | 100 | ___ |

##### Entrega

Sube los archivos o el enlace solicitado por el docente junto con la demostración y la evidencia de build. Si un caso queda pendiente, nombra la acción, el resultado actual y la causa que identificaste.

### S06-B07 · 75–105 min · Descanso

Al volver, recupera session-06-workshop-start: trigger funcional; sin solución en tarjetas. No vuelvas a las slides.

## Taller calificable · 60 minutos

Los archivos siguientes son referencia privada para intervenir y revisar. El estudiante intenta el encargo antes de recibir una solución. Ofrece una pista cada vez: propietario → firma → reenvío → id → momento de ejecución.

### S06-B08 · 105–117 min · Conectar los contratos

#### Paso 1 · Añadir el contrato a Card sin ejecutar aún

Para mantener un checkpoint compilable, declara primero la prop requerida en Card. Todavía no la desestructures ni dibujes el botón:

**`src/components/media-card.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { MediaTypeBadge } from './media-type-badge'

type MediaCardProps = {
  data: MediaItem
  onSelect: (mediaId: number) => void
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


Esta prop tiene la misma firma que el handler; no es el setter. Durante la edición parcial TypeScript avisará que el consumidor aún no la entrega. Completa Grid y App antes de ejecutar build.

#### Paso 2 · Reenviar en Grid

**`src/components/media-grid.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { EmptyState } from './empty-state'
import { MediaCard } from './media-card'

type MediaGridProps = {
  items: MediaItem[]
  onSelect: (mediaId: number) => void
}

export function MediaGrid(props: MediaGridProps) {
  const { items, onSelect } = props
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
        <MediaCard key={media.id} data={media} onSelect={onSelect} />
      ))}
    </div>
  )
}
```


Lee el contrato items/onSelect; la destructuración recibe ambos; el vacío se conserva; el map mantiene key y data y añade onSelect={onSelect}. Grid no conoce el id elegido y no necesita envolver la referencia.

#### Paso 3 · Conectar el padre completo

**`src/App.tsx` · archivo completo:**

```tsx
import { Modal } from '@mantine/core'
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaDetailContent } from './components/media-detail-content'
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

  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null)

  const selectedMedia =
    mediaItems.find((media) => media.id === selectedMediaId) ?? null
  const isDetailOpened = selectedMedia !== null
  const previewMedia = mediaItems[0] ?? null

  function handleSelectMedia(mediaId: number) {
    setSelectedMediaId(mediaId)
  }

  function handleCloseDetail() {
    setSelectedMediaId(null)
  }

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
        {previewMedia !== null ? (
          <div className="selection-preview">
            <button
              className="detail-button"
              type="button"
              onClick={() => handleSelectMedia(previewMedia.id)}
            >
              Probar detalle
            </button>
          </div>
        ) : null}
        {hasNoResults ? (
          <EmptyState
            title="Sin resultados"
            description="No encontramos medios que coincidan con tus filtros."
          />
        ) : (
          <MediaGrid items={visibleMedia} onSelect={handleSelectMedia} />
        )}
      </main>
      <Modal
        opened={isDetailOpened}
        onClose={handleCloseDetail}
        title={selectedMedia?.title ?? 'Detalle'}
        closeButtonProps={{ 'aria-label': 'Cerrar detalle' }}
        centered
      >
        {selectedMedia !== null ? (
          <MediaDetailContent media={selectedMedia} />
        ) : null}
      </Modal>
    </>
  )
}

export default App
```


El único cambio de App es onSelect={handleSelectMedia} en MediaGrid, junto a items={visibleMedia}. Ejecuta build/lint tras completar los tres archivos. Referencia session-06-step-04-callback-contracts: el trigger funciona, pero aún no hay click en tarjetas.

### S06-B09 · 117–132 min · Ejecutar desde cada tarjeta

#### Paso 1 · Completar la tarjeta con su botón

**`src/components/media-card.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { MediaTypeBadge } from './media-type-badge'

type MediaCardProps = {
  data: MediaItem
  onSelect: (mediaId: number) => void
}

export function MediaCard(props: MediaCardProps) {
  const { data, onSelect } = props
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
      <button
        className="detail-button"
        type="button"
        onClick={() => onSelect(data.id)}
      >
        Ver detalle
      </button>
    </article>
  )
}
```


Ahora la destructuración incluye onSelect. El botón reutiliza detail-button, declara type y entrega una función a onClick. Esa closure conoce data.id y lo envía al handler recibido. El label base es Ver detalle; no se incluye aún el extra.

#### Paso 2 · Comprobar identidad

Abre una película, cierra y abre una serie. El título debe corresponder. Pregunta: “¿Por qué no pasamos un id fijo desde Grid?”. Respuesta: cada Card ya conoce su objeto y ejecuta el callback con su propia identidad. Referencia session-06-step-05-card-selection; el trigger sigue presente deliberadamente.

### S06-B10 · 132–142 min · Retirar la demostración temporal

#### Paso 1 · Sustituir App final

**`src/App.tsx` · archivo completo:**

```tsx
import { Modal } from '@mantine/core'
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { EmptyState } from './components/empty-state'
import { MediaDetailContent } from './components/media-detail-content'
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

  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null)

  const selectedMedia =
    mediaItems.find((media) => media.id === selectedMediaId) ?? null
  const isDetailOpened = selectedMedia !== null

  function handleSelectMedia(mediaId: number) {
    setSelectedMediaId(mediaId)
  }

  function handleCloseDetail() {
    setSelectedMediaId(null)
  }

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
          <MediaGrid items={visibleMedia} onSelect={handleSelectMedia} />
        )}
      </main>
      <Modal
        opened={isDetailOpened}
        onClose={handleCloseDetail}
        title={selectedMedia?.title ?? 'Detalle'}
        closeButtonProps={{ 'aria-label': 'Cerrar detalle' }}
        centered
      >
        {selectedMedia !== null ? (
          <MediaDetailContent media={selectedMedia} />
        ) : null}
      </Modal>
    </>
  )
}

export default App
```


Se eliminan previewMedia y el bloque Probar detalle; no se tocan selección, handlers, filtros ni Modal. Busca ambos nombres y confirma cero usos en src. Referencia session-06-end.

### S06-B11 · 142–152 min · Contenido, cierres y foco

1. bear + Series: abre The Bear y comprueba descripción alternativa.
2. Cierra, limpia y abre Arrival: comprueba nuevo título y contenido.
3. Abre Aftersun: Poster no disponible.
4. Prueba cierre superior, Escape y overlay.
5. Comprueba Tab y Shift+Tab dentro del modal y retorno de foco a la tarjeta al cerrar.
6. Distingue observación de UI de comprobación del id en React DevTools.

### S06-B12 · 152–160 min · Regresión y explicación

1. Prueba Películas (3), Series (3), bear/Series (1), bear/Películas (0), matrix (0), limpiar (6).
2. Comprueba contador, botón deshabilitado sin filtros y mensajes por causa.
3. En React DevTools localiza selectedMediaId en App y onSelect en Grid/Card. Si la extensión no está disponible, registra esa evidencia pendiente.
4. Pregunta por qué find usa mediaItems completo: seleccionar no debe depender del subconjunto visible.

### S06-B13 · 160–165 min · Entrega técnica

```bash
pnpm build
pnpm lint
```

Registra salida, casos de navegador y explicación. Entrega código y demostración de hasta 90 segundos según la rúbrica. Un build no acredita cierre ni foco.

## Revisión y cierre · 15 minutos

### S06-B14 · 165–174 min · Demostraciones

Revisa dos recorridos y un caso pendiente. No edites en vivo ni añadas conceptos. Evalúa los cinco criterios por separado.

### S06-B15 · 174–180 min · Cierre oral

Sin volver a las slides:

- ¿Por qué id es estado y objeto es cálculo? Id recuerda una acción; find obtiene el objeto existente.
- ¿Quién define el handler? App, propietario del estado.
- ¿Qué hace Grid? Reenvía la misma referencia.
- ¿Cuándo llama Card? Durante el click, con data.id.
- ¿Qué título no podemos encontrar? Uno ausente de los seis objetos; HTTP será la siguiente necesidad.

## Extra privado · Solo después de cumplir la base

El concepto nombre accesible se explicó antes del descanso. Para revisar el extra, Card completo queda así:

**`src/components/media-card.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { MediaTypeBadge } from './media-type-badge'

type MediaCardProps = {
  data: MediaItem
  onSelect: (mediaId: number) => void
}

export function MediaCard(props: MediaCardProps) {
  const { data, onSelect } = props
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
      <button
        className="detail-button"
        type="button"
        aria-label={`Ver detalle de ${data.title}`}
        onClick={() => onSelect(data.id)}
      >
        Ver detalle
      </button>
    </article>
  )
}
```


La única línea extra es aria-label: concatena el título mediante template literal. Comprueba “Ver detalle de Arrival”, “Ver detalle de The Bear” y los demás nombres en el árbol de accesibilidad. No cambia la lógica ni el estado. Esta variante no forma parte del cierre canónico; la rúbrica permite hasta +10.

## Registro de ritmo y continuidad

| Bloque | Minutos previstos | Tiempo real | Paso pendiente |
| --- | ---: | --- | --- |
| B01 | 12 | Por registrar | Por registrar |
| B02 | 12 | Por registrar | Por registrar |
| B03 | 14 | Por registrar | Por registrar |
| B04 | 13 | Por registrar | Por registrar |
| B05 | 13 | Por registrar | Por registrar |
| B06 | 11 | Por registrar | Por registrar |
| B07 | 30 | Por registrar | Por registrar |
| B08 | 12 | Por registrar | Por registrar |
| B09 | 15 | Por registrar | Por registrar |
| B10 | 10 | Por registrar | Por registrar |
| B11 | 10 | Por registrar | Por registrar |
| B12 | 8 | Por registrar | Por registrar |
| B13 | 5 | Por registrar | Por registrar |
| B14 | 9 | Por registrar | Por registrar |
| B15 | 6 | Por registrar | Por registrar |

Si falta tiempo, anota último bloque comprobado, cambio guardado, primera acción pendiente y evidencia ausente. Ejemplo: B09 completo, tarjetas seleccionan; pendiente retirar trigger y comprobar overlay/foco. Retoma eso antes de HTTP en 07. No reduzcas silenciosamente el taller ni introduzcas conceptos nuevos después del descanso.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** A.
- **Justificación:** copiar el objeto seleccionado duplica los datos y permite que ambas copias terminen con valores diferentes.
- **Fuente:** React, `Choosing the State Structure`, `Avoid duplication in state`.

### Pregunta 2

- **Respuesta:** B.
- **Justificación:** el id estable basta para localizar el elemento y evita copiar su contenido.
- **Fuente:** React, `Choosing the State Structure`, `Avoid duplication in state`.

### Pregunta 3

- **Respuesta:** Verdadero.
- **Justificación:** `find` puede calcular el objeto desde la lista y el id durante cada render.
- **Fuente:** React, `Choosing the State Structure`, `Avoid duplication in state`.

### Pregunta 4

- **Respuesta:** B.
- **Justificación:** el padre común más cercano puede compartir el mismo estado con ambos componentes hijos.
- **Fuente:** React, `Sharing State Between Components`, `Lifting state up by example`.

### Pregunta 5

- **Respuesta:** Verdadero.
- **Justificación:** el hijo ejecuta la función recibida por props y el padre actualiza su propio estado.
- **Fuente:** React, `Sharing State Between Components`, `A single source of truth for each state`.

## Errores previsibles e intervención

| Error | Diagnóstico | Intervención |
| --- | --- | --- |
| Guardar `MediaItem` seleccionado | Duplica la fuente. | Pedir el dato mínimo que permite ejecutar `find`. |
| Añadir `isModalOpened` en estado | Crea dos valores que pueden contradecirse. | Derivar apertura desde `selectedMedia`. |
| Buscar en `visibleMedia` | La selección depende del filtro. | Volver a la fuente completa `mediaItems`. |
| Usar `mediaItems` como prop de Grid | Copia un nombre histórico obsoleto. | Conservar el contrato canónico `items`. |
| Pasar el setter a Card | Expone implementación del propietario. | Restaurar el contrato de intención `onSelect`. |
| Adaptar callback en Grid | Añade una función sin nueva información. | Reenviar la misma referencia. |
| `onClick={onSelect(data.id)}` | Ejecuta durante render. | Envolver la llamada en un handler. |
| Añadir estado a Grid o Card | Duplica la selección. | Señalar el ancestro común. |
| Usar `useDisclosure` | Introduce otro estado de apertura. | Conectar `opened` con la selección existente. |
| Cerrar sin limpiar id | Modal y selección se contradicen. | Ejecutar `setSelectedMediaId(null)`. |
| Romper filtros | El cambio reemplazó el checkpoint. | Recuperar `items={visibleMedia}` y ejecutar regresión. |
| Desactivar Escape u overlay | Reduce comportamiento accesible sin necesidad. | Mantener defaults de Mantine. |

## Preguntas durante la clase

- ¿Qué información recuerda `selectedMediaId` que no puede calcularse sin una acción previa?
- ¿Por qué `selectedMedia` puede cambiar sin tener setter propio?
- ¿Quién define `handleSelectMedia`?
- ¿Qué sabe `MediaGrid` sobre la tarjeta pulsada?
- ¿Qué dato conoce `MediaCard` que el Grid no necesita adaptar?
- ¿Cuándo se ejecuta la closure del click?
- ¿Qué parte controla React y qué parte ofrece Mantine?
- ¿Qué evidencia demuestra el build y qué sigue pendiente en navegador?

## Revisión de la rúbrica

Evalúa los cinco criterios por separado. Una falla de build no convierte toda la entrega en cero si todavía puedes comprobar contratos o explicación. Un modal que siempre muestra el primer elemento recibe parcial en comportamiento y puede conservar puntos de estructura cuando el flujo tipado existe.

El extra solo cuenta si la base correspondiente funciona y el estudiante muestra el nombre específico en el árbol de accesibilidad.

## Plan de contingencia

### Mantine no instala

Entrega `session-06-workshop-start`. Pide que el estudiante identifique provider, estilos y versiones antes de continuar. No uses otro modal ni cambies de gestor.

### Build inicial falla

Detén selección. Registra el error exacto y revisa:

1. versiones instaladas;
2. import de estilos;
3. import de `MantineProvider`;
4. estructura de `main.tsx`;
5. configuración PostCSS.

### Falta tiempo antes del descanso

Entrega el modal conectado desde el trigger temporal. Conserva los once minutos de contratos; el taller depende de esa explicación.

### Estudiante bloqueado

Entrega el checkpoint alternativo. Debe implementar el recorrido de callback y no recibir los archivos finales.

### Build final falla

Registra la salida. Evalúa por separado los comportamientos que todavía puedan reproducirse, los contratos estáticos y la explicación.

## Cierre conceptual

Reconstruye:

```text
App define
→ props bajan
→ MediaCard ejecuta
→ App actualiza
→ React calcula
→ Modal presenta
```

Preguntas:

1. ¿Por qué el id es estado y el objeto es cálculo?
2. ¿Por qué `handleSelectMedia` nace en `App`?
3. ¿Qué diferencia existe entre pasar y ejecutar una función?
4. ¿Qué medio no puede encontrar todavía la aplicación?

La cuarta pregunta abre la sesión 07: el explorador local solo conoce seis medios y necesita una frontera HTTP para consultar otros.

## Frontera de evidencia

- `pnpm build` demuestra que TypeScript y Vite producen el bundle.
- La matriz manual demuestra el comportamiento observado en ese navegador.
- React DevTools permite observar estado y props durante el recorrido.
- Ninguna de esas comprobaciones demuestra HTTP, backend, Router, estado remoto o compatibilidad futura de dependencias.

El proyecto ejecutable vive en el repositorio hermano MediaLog-Bootcamp. Registra comprobaciones reales; build, navegador, React DevTools y lector de pantalla son evidencias distintas. El ritmo con estudiantes requiere observación de aula.

## Fuentes

- React, [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure).
- React, [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components).
- Mantine, [Usage with Vite](https://mantine.dev/guides/vite/).
- Mantine, [Modal](https://mantine.dev/core/modal/).

Instalación y Modal contrastados el 10 de septiembre de 2026 mediante Context7 y metadatos del registro. Mintlify no está disponible.
