# Guía docente · Sesión 04 · Eventos y `useState`

> Material privado del docente. No distribuir la clave del cuestionario ni las respuestas esperadas junto con la guía estudiantil.

- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Plan aprobado:** [session-draft.md](session-draft.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Objetivo docente

Conducir al grupo desde un catálogo que solo responde a props hasta una búsqueda local por título. Al cerrar, cada estudiante debe explicar por qué `query` necesita estado, por qué `visibleMedia` se calcula y por qué `App` posee ambos lados del flujo.

La sesión introduce una sola interacción. Mantiene fuera filtro por tipo, selección, modal, Effects y API.


## Ruta recuperable y ritmo

La guía incluye cada archivo y cambio en su paso. No necesitas consultar el proyecto de referencia. Los fragmentos breves señalan qué explicar y después se muestra el archivo completo.

| Bloque comprobado | Rama | Resultado |
| --- | --- | --- |
| S04-B01 | `session-04-start` | Exactamente session-03-end: catálogo sin input. |
| S04-B03–B04 | `session-04-step-01-controlled-query` | Consulta e input sincronizados; catálogo sin filtrar, logs retirados. |
| S04-B05 | `session-04-step-02-derived-search` | Filtro dentro de App; input inline y diagnóstico. |
| S04-B06 | `session-04-step-03-search-input` | Control extraído; práctica de mensajes pendiente. |
| S04-B07–B08 | `session-04-end` | Búsqueda y dos causas de vacío verificadas. |

Guarda cambios propios antes de consultar una rama en una copia limpia:

```bash
git switch session-04-start
pnpm install --frozen-lockfile
pnpm dev
```

Para comparar la extracción sin cambiar archivos:

```bash
git diff session-04-step-02-derived-search..session-04-step-03-search-input -- src/App.tsx src/components/search-input.tsx
```

Las ramas son referencias locales, no sustituyen el trabajo del grupo. Esta clase dura 90 minutos: recuperación 8, presentación continua 17, coding 49, práctica 10 y cierre 6.

## Preparación docente

### Paso 1 · Comprobar la entrada

Usa la copia de 03 terminada, sin la variante opcional del contador. Comprueba seis tarjetas, tres tipos de cada clase, los dos fallbacks y las imágenes locales. No repitas la extracción de componentes.

Los archivos heredados se incluyen al comienzo de S04-B03 como referencia de lectura. No escribas ni añadas CSS antes de la presentación.

### Paso 2 · Comprobar herramientas y cuestionario

React 19.2.8, TypeScript 6.0.3, pnpm 11.17.0 y Node >=22.22.0 continúan desde 03. No cambies versiones ni lockfile. Ejecuta:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm lint
```

En otra terminal inicia dev. Revisa el cuestionario antes de la reunión y elige una pregunta para recuperar; la clave está al final.

## Secuencia docente

### S04-B01 · 0–8 min · Recuperación

1. Abre el catálogo antes de iniciar slides y cuenta seis tarjetas.
2. Pide seguir `mediaItems → App → MediaGrid → MediaCard`.
3. Pregunta quién elige la colección y quién ejecuta map. Respuesta: App elige; MediaGrid recorre y conserva key.
4. Pregunta qué acción falta. Respuesta: escribir una consulta que cambie los medios visibles.
5. Recupera una sola pregunta previa. Conserva el fixture; no borres objetos para simular una búsqueda.

**Checkpoint:** catálogo de 03 funcionando. Si falla, registra el primer error y recupera la entrada antes de introducir estado.

### S04-B02 · 8–25 min · Presentación continua

Recorre las slides 1–14 en una sola pasada. La 15 queda como referencia para el cierre oral. No abras el editor durante este bloque.

Reparte los 17 minutos: evento/handler y variable local 4; estado, setter, snapshot y reglas de Hooks 5; input controlado y propietario 4; derivación y causas del vacío 4. Cada pregunta posterior se trabaja sobre el código, sin regresar al deck.

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Qué describe el evento y qué decide el handler? | El evento informa lo ocurrido; el handler contiene la respuesta de la aplicación. |
| ¿Por qué no basta una variable local? | Cambiarla no solicita un render y se recrea al ejecutar el componente. |
| ¿Qué devuelve useState? | El valor actual y una función setter que solicita una actualización. |
| ¿Dónde se declara el Hook? | En el nivel superior de App, nunca en condiciones, loops o handlers. |
| ¿Qué controla el texto visible? | value recibe query y onChange actualiza query síncronamente. |
| ¿Quién necesita query? | App, para configurar el input y calcular la lista. |
| ¿Qué se recuerda y qué se calcula? | Se recuerda query; se calculan consulta normalizada, lista y mensaje. |

Explica dos snapshots: render inicial con query vacía, evento que llama setQuery con bear, siguiente render con bear. El setter no cambia el valor del snapshot que el handler ya estaba leyendo.

**Puente:** “Probemos el mismo campo primero con una variable y después con memoria de React”. Cierra las slides y abre el editor una sola vez.

### S04-B03 · 25–38 min · Variable local frente a estado

#### Referencia de entrada · Solo comprobar, no volver a escribir

Estos son los archivos completos heredados que sostienen la sesión. Se incluyen para que puedas recuperarlos desde la guía; no se transcriben otra vez durante la apertura.

**`src/App.tsx` · archivo completo:**

```tsx
import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { mediaItems } from './data/media-items'

function App() {
  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <MediaGrid items={mediaItems} />
      </main>
    </>
  )
}

export default App
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

**`src/main.tsx` · archivo completo:**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

#### Paso 1 · Añadir los estilos y el ejemplo temporal

Ahora añade los estilos del input. Sustituye `src/index.css` por este archivo completo: conserva los estilos heredados y agrega las reglas `.search-input` al final.

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
```

Explica cada grupo:

- `.search-input` usa grid para colocar el texto sobre el campo, gap de 8 px y margen inferior de 24 px.
- El input ocupa el ancho disponible; padding separa texto y borde; border y border-radius dibujan su contorno.
- Background y color conservan la paleta del catálogo; font hereda la tipografía.
- focus-visible mantiene un contorno perceptible al navegar con teclado; outline-offset lo separa del borde.

Sustituye App por este ejemplo temporal completo. Conserva main, su clase y el h2 de 03:

**`src/App.tsx` · archivo completo:**

```tsx
import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { mediaItems } from './data/media-items'

function App() {
  let query = ''

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <label className="search-input">
          Buscar por título
          <input
            type="search"
            onChange={(event) => {
              query = event.currentTarget.value
            }}
          />
        </label>
        <p>Consulta actual: {query}</p>
        <MediaGrid items={mediaItems} />
      </main>
    </>
  )
}

export default App
```

Explica: let crea query durante esta ejecución; el handler asigna texto a esa variable; el párrafo lee el valor cuando React construye el JSX. El input no tiene value: el navegador conserva su texto.

Recarga después de guardar para comenzar sin estado residual de edición. Escribe bear. Pregunta qué cambió: el campo sí, el párrafo no, las seis tarjetas permanecen. No se pidió un render. Esta limitación es deliberada; no se entrega como checkpoint terminado.

#### Paso 2 · Sustituir variable por estado y controlar el input

Importa useState; cambia la declaración por:

```tsx
const [query, setQuery] = useState('')
```

Añade value y sustituye la asignación por el setter. Este es App completo:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <label className="search-input">
          Buscar por título
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <p>Consulta actual: {query}</p>
        <MediaGrid items={mediaItems} />
      </main>
    </>
  )
}

export default App
```

Recorre las líneas nuevas:

1. useState se importa desde React y se llama al comienzo del componente.
2. Los corchetes extraen el valor y setter del par devuelto.
3. El string vacío mantiene al input controlado desde el primer render.
4. value entrega query al campo.
5. onChange recibe una función; no se ejecuta durante render.
6. event.currentTarget es el input cuyo handler se ejecuta; value es su texto.
7. setQuery recibe ese string y solicita la actualización.
8. El párrafo de diagnóstico lee query; MediaGrid todavía recibe la fuente completa.

Recarga, escribe y borra. Campo y párrafo coinciden, pero las tarjetas todavía no se filtran.

**Checkpoint:** `session-04-step-01-controlled-query`. No adelantes visibleMedia.

### S04-B04 · 38–48 min · Evento y render

#### Paso 1 · Confirmar el circuito controlado

El grupo termina de reproducir el archivo anterior y explica la letra b: input → onChange → setQuery → render → value. Si el campo queda bloqueado, revisa el setter antes de continuar.

#### Paso 2 · Añadir logs durante cuatro minutos

Este es el archivo completo de la demostración:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')
  console.log('render de App', query)

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <label className="search-input">
          Buscar por título
          <input
            type="search"
            value={query}
            onChange={(event) => {
              console.log('evento del input', event.currentTarget.value)
              setQuery(event.currentTarget.value)
            }}
          />
        </label>
        <p>Consulta actual: {query}</p>
        <MediaGrid items={mediaItems} />
      </main>
    </>
  )
}

export default App
```

El primer log está en el cuerpo de App; el otro, dentro del handler. Recarga, distingue los logs de montaje inicial y escribe un solo carácter.

Pregunta: ¿qué log pertenece al evento? Respuesta: evento del input. ¿Por qué puede repetirse render de App? Respuesta: StrictMode comprueba funciones que deben ser puras durante desarrollo; no repite por eso el handler. No concluyas un número de eventos a partir de todos los logs acumulados.

No introduzcas comprobaciones de Effects; se explican en 10. Conserva StrictMode.

#### Paso 3 · Retirar ambos logs

Restaura App a este archivo completo antes de seguir:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <label className="search-input">
          Buscar por título
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <p>Consulta actual: {query}</p>
        <MediaGrid items={mediaItems} />
      </main>
    </>
  )
}

export default App
```

**Checkpoint:** mismo estado de la rama controlled-query, sin logs. La comprobación de consola no necesita otra rama permanente.

### S04-B05 · 48–62 min · Búsqueda derivada

#### Paso 1 · Normalizar y filtrar

Debajo de useState añade:

```tsx
const normalizedQuery = query.trim().toLowerCase()
const visibleMedia = mediaItems.filter((media) =>
  media.title.toLowerCase().includes(normalizedQuery),
)
```

Explica trim: elimina espacios exteriores. toLowerCase prepara ambos lados para comparar sin distinguir mayúsculas. filter conserva los objetos cuyo predicado devuelve true; includes busca el texto dentro del título. El arreglo original no cambia.

Pregunta por la consulta vacía. Respuesta: cada string incluye el string vacío; todos los medios pasan el filtro.

#### Paso 2 · Conectar la colección calculada

Sustituye items={mediaItems} por items={visibleMedia}. App completo:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) =>
    media.title.toLowerCase().includes(normalizedQuery),
  )

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <label className="search-input">
          Buscar por título
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <p>Consulta actual: {query}</p>
        <MediaGrid items={visibleMedia} />
      </main>
    </>
  )
}

export default App
```

Pregunta por qué visibleMedia no necesita otro useState. Respuesta: sus entradas ya están disponibles; almacenarlo duplicaría información y obligaría a mantenerla sincronizada. No uses Effect o useMemo.

#### Paso 3 · Probar el estado intermedio

Prueba bear, BEAR y espacios exteriores: solo The Bear. Borra: seis medios. Prueba matrix: el grid recibe [] y todavía dice Catálogo vacío. Reconoce esa limitación; la práctica de S04-B07 distinguirá la causa.

**Checkpoint:** `session-04-step-02-derived-search`. El control y el diagnóstico siguen dentro de App.

### S04-B06 · 62–74 min · Extraer SearchInput

#### Paso 1 · Fijar la propiedad del estado

Pregunta quién necesita query para el filtro. Respuesta: App. El control recibirá value y una función para avisar de un nuevo texto. No se mueve useState al hijo.

#### Paso 2 · Crear el componente completo

Crea `src/components/search-input.tsx`:

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

Explica cada parte: value es string; onQueryChange recibe un string y no devuelve un resultado útil (void). props recibe ambos; la destructuración los obtiene. Label hace visible el propósito del campo. El handler del hijo transforma el evento DOM en un string y llama al callback.

#### Paso 3 · Integrar y retirar el input inline

Añade el import de SearchInput. Sustituye label/input por SearchInput y elimina el párrafo de diagnóstico. App completo:

**`src/App.tsx` · archivo completo:**

```tsx
import { useState } from 'react'

import { AppHeader } from './components/app-header'
import { MediaGrid } from './components/media-grid'
import { SearchInput } from './components/search-input'
import { mediaItems } from './data/media-items'

function App() {
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleMedia = mediaItems.filter((media) =>
    media.title.toLowerCase().includes(normalizedQuery),
  )

  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>
        <SearchInput value={query} onQueryChange={setQuery} />
        <MediaGrid items={visibleMedia} />
      </main>
    </>
  )
}

export default App
```

Pregunta quién ejecuta setQuery: el hijo llama la función que recibe como onQueryChange; el estado sigue perteneciendo a App.

Prueba de nuevo bear y consulta vacía. Debe existir un solo input y un solo estado. La práctica sigue pendiente.

**Checkpoint:** `session-04-step-03-search-input`. Si no termina la extracción, conserva este bloque como punto de recuperación.

### S04-B07 · 74–84 min · Práctica individual: dos causas de vacío

#### Paso 1 · Presentar el encargo sin dar primero la solución

Pide que App muestre Sin resultados solo cuando hay fuente, consulta activa y ninguna coincidencia. En los demás casos debe usar MediaGrid. No se cambia el contrato del grid ni se le pasa query.

Usa EmptyState con título Sin resultados y descripción “No encontramos medios que coincidan con tu búsqueda.”. Da tiempo para que el estudiante escriba la condición y decida la rama.

#### Paso 2 · Revisar la solución completa

Esta es la solución docente para comparar después del intento. Añade el import de EmptyState y hasNoResults después de visibleMedia; sustituye la llamada directa al grid por el ternario:

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

Explica cada condición:

1. mediaItems.length > 0 identifica una fuente con datos.
2. normalizedQuery.length > 0 identifica una consulta efectiva.
3. visibleMedia.length === 0 identifica ausencia de coincidencias.
4. && exige que las tres sean verdaderas. Son booleanos, no longitudes renderizadas.
5. El ternario presenta EmptyState con copy de búsqueda o MediaGrid con la colección.

Pregunta qué pasa con una fuente vacía y query activa: la primera condición es falsa; sigue diciendo Catálogo vacío.

#### Paso 3 · Ejecutar la matriz

| Entrada | Resultado observable |
| --- | --- |
| Consulta vacía | Seis tarjetas. |
| bear | The Bear. |
| BEAR | The Bear. |
| Dos espacios, bear, dos espacios | The Bear. |
| Solo espacios | Seis tarjetas; consulta normalizada vacía. |
| matrix | Sin resultados, cero tarjetas. |
| Fuente vacía con consulta vacía | Catálogo vacío. |
| Fuente vacía con consulta activa | Catálogo vacío, nunca Sin resultados. |

Para la fuente vacía, guarda el archivo original y sustituye temporalmente `src/data/media-items.ts` completo por:

```ts
import type { MediaItem } from '../types/media-item'

export const mediaItems: MediaItem[] = []
```

Prueba consulta vacía y matrix. No basta con pasar [] directamente al grid, porque queremos probar la condición que App calcula desde la fuente.

Restaura este archivo completo al terminar:

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

**Checkpoint:** `session-04-end`, con los seis objetos restaurados. No dejes fixture vacío en la entrega.

### S04-B08 · 84–90 min · Comprobación y cierre oral

#### Paso 1 · Registrar evidencia

Con dev abierto, ejecuta:

```bash
pnpm build
pnpm lint
```

Comprueba input editable, búsqueda, mensajes, fallbacks, consola sin warnings y ausencia de logs temporales. El build no demuestra el comportamiento del input.

#### Paso 2 · Cerrar sin volver al deck

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Por qué una variable local no bastó? | No pidió render ni ofreció memoria entre renders. |
| ¿Por qué query vive en App? | App configura el control y calcula la colección. |
| ¿Qué problema evita calcular visibleMedia? | Evita un segundo estado que podría quedar desactualizado. |
| ¿Qué dato nuevo habrá que recordar para filtrar por tipo? | El tipo elegido; se añadirá en 05. |

No implementes ese segundo control hoy.

## Registro de ritmo y reanudación

Al impartir la sesión anota hora de inicio/fin real de cada bloque, último checkpoint logrado por el grupo, duda repetida y tiempo de ayuda. No rellenes estas observaciones con el tiempo de ejecución del agente: ese tiempo no mide el ritmo estudiantil.

| Bloque | Minutos previstos | Inicio/fin real | Resultado del grupo y ajuste observado |
| --- | ---: | --- | --- |
| S04-B01 | 8 | Por registrar en clase | Por registrar en clase |
| S04-B02 | 17 | Por registrar en clase | Por registrar en clase |
| S04-B03 | 13 | Por registrar en clase | Por registrar en clase |
| S04-B04 | 10 | Por registrar en clase | Por registrar en clase |
| S04-B05 | 14 | Por registrar en clase | Por registrar en clase |
| S04-B06 | 12 | Por registrar en clase | Por registrar en clase |
| S04-B07 | 10 | Por registrar en clase | Por registrar en clase |
| S04-B08 | 6 | Por registrar en clase | Por registrar en clase |

Si termina el tiempo, guarda bloque comprobado, archivo/cambio guardado, primer paso pendiente y evidencia ausente. Ejemplo: “S04-B05 terminado; búsqueda inline; falta crear SearchInput y practicar mensajes; build final pendiente”. Retoma ese punto tras pedir una explicación del flujo, antes de introducir el filtro por tipo de 05.

Las ramas recuperan código, no la explicación que faltó. Puedes entregar CSS o el archivo preparado del bloque actual para ahorrar transcripción; no elimines la predicción, la comparación o la práctica para afirmar que se cubrió todo.

## Errores frecuentes e intervención

### El handler se ejecuta durante el render

Síntoma:

```tsx
onChange={handleQueryChange()}
```

Intervención: pide identificar la función que React debe conservar para ejecutarla después. Retira los paréntesis.

### El Hook vive dentro del handler

Intervención: lleva `useState` al nivel superior y reconstruye el orden estable de Hooks.

### El input queda bloqueado

Intervención: comprueba que `value={query}` tenga un `onChange` que llame al setter con `event.currentTarget.value`.

### SearchInput guarda otro query

Intervención: dibuja ambos valores y pregunta cuál usa `App` para filtrar. Retira el estado del hijo.

### App recibe el evento DOM

Intervención: adapta el evento dentro del hijo y entrega un string mediante `onQueryChange`.

### visibleMedia usa useState

Intervención: escribe sus entradas `mediaItems + query`. Si ambas están disponibles durante el render, calcula la salida allí.

### Un Effect sincroniza la lista

Intervención: retíralo. El filtro no sincroniza React con un sistema externo.

### Sin resultados reemplaza catálogo vacío

Intervención: comprueba las tres condiciones de `hasNoResults`. Una longitud cero aislada no identifica la causa.

### El grupo elimina StrictMode

Intervención: restaura el wrapper y retira solo los logs. Explica que la comprobación revela renders impuros durante desarrollo.


## Contingencias concretas

- Entrada incompleta: recupera session-04-start y registra el fallo de 03.
- Retraso en S04-B03: usa controlled-query y pide explicar value/onChange antes de filtrar.
- Logs confusos: compara un evento con los renders posteriores, no toda la consola acumulada; retira ambos logs sin quitar StrictMode.
- Retraso en S04-B05: usa derived-search y explica sus dos cálculos antes de extraer el input.
- Retraso en S04-B06: utiliza el archivo SearchInput completo de ese bloque y conserva la conexión del padre como paso a comprobar.
- Imágenes ausentes: revisa public/posters y sus rutas; no cambies el filtro para compensar un archivo faltante.
- Build fallido: registra el primer error y corrígelo sin actualizar dependencias.
- No se termina S04-B07: registra la distinción de vacíos como pendiente y retómala antes de 05.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** B.
- **Justificación:** cambiar una variable local no pide otro render y la variable se crea de nuevo en el siguiente render.
- **Fuente:** `State: A Component's Memory`, sección `When a regular variable isn't enough`.

### Pregunta 2

- **Respuesta:** A.
- **Justificación:** `useState` devuelve el valor actual y una función para actualizarlo y pedir otro render.
- **Fuente:** `State: A Component's Memory`, secciones `Adding a state variable` y `Anatomy of useState`.

### Pregunta 3

- **Respuesta:** Falso.
- **Justificación:** los Hooks se declaran en el nivel superior para conservar el mismo orden entre renders.
- **Fuente:** `State: A Component's Memory`, sección `Meet your first Hook`.

### Pregunta 4

- **Respuesta:** C.
- **Justificación:** un input controlado recibe `value` y actualiza el estado durante `onChange`; sin esa actualización queda bloqueado.
- **Fuente:** `<input>`, sección `Controlling an input with a state variable`.

### Pregunta 5

- **Respuesta:** Verdadero.
- **Justificación:** un input de texto controlado debe recibir un string; `""` representa el valor inicial vacío.
- **Fuente:** `<input>`, sección `Controlling an input with a state variable`.

## Frontera de evidencia

- `pnpm build` demuestra que TypeScript y Vite producen el bundle.
- El navegador demuestra los casos observados del input y los estados vacíos.
- Los logs demuestran lo observado en ese entorno de desarrollo.
- Estas comprobaciones no prueban una API, caché remota, despliegue ni producción.

## Fuentes docentes

- React 19.2, [Responding to Events](https://react.dev/learn/responding-to-events).
- React 19.2, [State: A Component's Memory](https://react.dev/learn/state-a-components-memory).
- React 19.2, [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot).
- React 19.2, [`<input>`](https://react.dev/reference/react-dom/components/input).
- React 19.2, [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
- React 19.2, [`<StrictMode>`](https://react.dev/reference/react/StrictMode).
