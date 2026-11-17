# Guía docente · Sesión 03 · Composición y catálogo estático

> Material privado del docente. No distribuir la clave del cuestionario, la solución ni los checkpoints privados junto con la guía estudiantil.

- **Modalidad:** presencial
- **Duración:** 180 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Plan aprobado:** [session-draft.md](session-draft.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Taller y rúbrica:** [workshop-rubric.md](workshop-rubric.md)

## Objetivo docente

Conducir al grupo desde un `App` que contiene la colección hasta un árbol con `MediaGrid`, `EmptyState` y `MediaTypeBadge`. El bloque previo al descanso cierra la decisión estructural. El taller aplica esa decisión mediante dos componentes de presentación y una matriz de regresión.

La sesión no introduce estado, eventos o dependencias. Al cerrar, cada estudiante debe explicar por qué `App` elige los datos, `MediaGrid` decide lista o vacío, y la key permanece junto al `map`.

## Ruta de trabajo y recuperación

Esta guía contiene el código completo en el paso donde se necesita. El docente puede avanzar sin abrir el repositorio de referencia. La solución privada del taller aparece en sus bloques para revisar e intervenir; no se proyecta ni se entrega antes de la práctica.

| Bloque | Rama | Estado observable |
| --- | --- | --- |
| S03-B01 | `session-03-start` | Seis tarjetas de 02; solo CSS preparado añadido. |
| S03-B04 | `session-03-step-01-media-grid` | Grid extraído; colección vacía sin mensaje. |
| S03-B05 | `session-03-workshop-start` | Misma referencia que el paso anterior; entrada al taller sin solución. |
| S03-B07 | `session-03-step-02-empty-state` | Vacío resuelto; tipo todavía inline. |
| S03-B08–B11 | `session-03-end` | Badge extraído y seis casos comprobados. |

Guarda el trabajo propio antes de consultar una rama. En una copia limpia:

```bash
git switch session-03-start
pnpm install --frozen-lockfile
pnpm dev
```

Para comparar la extracción, sin cambiar archivos:

```bash
git diff session-03-start..session-03-workshop-start -- src/App.tsx src/components/media-grid.tsx
```

El proyecto conserva Node >=22.22.0, React 19.2.8, TypeScript 6.0.3 y pnpm 11.17.0. No se instalan dependencias nuevas. Los commits y ramas de soluciones son referencias locales del docente; no distribuyas su historial completo como seed.

## Preparación antes de clase

Comprueba la rama `session-03-start`: incluye el progreso de 02, los posters y el CSS preparado. Antes de las slides solo verifica la entrada; los archivos completos y cualquier restauración aparecen al comenzar S03-B03, después de la presentación.

### Verificar y preparar distribución

En la copia inicial ejecuta:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm lint
```

En el navegador comprueba seis tarjetas, película, serie, Aftersun sin poster y The Bear sin descripción. Conserva una copia de entrada sin `node_modules/`, `dist/` ni `.git/`; incluye `src/`, `public/`, configuración y lockfile. Distribuye solo lectura, guía estudiantil y rúbrica de 03. No entregues teacher-guide ni las ramas de soluciones.

Revisa el cuestionario antes de clase y elige una pregunta para la recuperación. La clave permanece al final de esta guía.

## Antes del descanso · 75 minutos

### S03-B01 · 0–15 min · Recuperación y regresión inicial

1. Pide ejecutar el proyecto antes de iniciar las slides.
2. Cuenta seis tarjetas. Señala los dos tipos y ambos fallbacks.
3. Recupera la pregunta previa con más errores.
4. Pregunta: ¿qué debe seguir funcionando después de reorganizar componentes? Respuesta: los casos actuales, el build y la lista sin warnings.
5. Define regresión: algo que funcionaba deja de funcionar tras un cambio. Hoy se comprueba manualmente, sin tests automatizados.

**Checkpoint:** entrada comprobada. Si está rota, recupera el seed y anota el error antes de explicar composición.

### S03-B02 · 15–35 min · Presentación continua

Presenta las slides 1–16 en orden; portada y separadores requieren solo una transición breve. Usa 5 minutos para recordar flujo y casos, 6 para responsabilidad/contrato, 6 para key y decisión vacía, y 3 para badge y encargo. La slide 17 queda como referencia del cierre oral: no se vuelve al deck después del coding.

Preguntas y respuestas para acompañar la presentación:

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Qué conserva App? | La elección del fixture y la composición de la página. |
| ¿Qué bloque representa una colección? | Wrapper, map y cada tarjeta con su key. |
| ¿Qué recibe MediaGrid? | items: MediaItem[]. |
| ¿Quién conoce si hay cero elementos? | MediaGrid, porque recibe items. |
| ¿Qué recibe EmptyState? | title y description; no necesita el arreglo. |
| ¿Qué recibe el badge? | mediaType; no necesita un MediaItem completo. |

Explica antes del descanso: `items.length === 0` produce un booleano; un retorno dentro de un if termina esa ejecución de la función. Una condición numérica con `&&` puede dibujar 0, por lo que aquí se usa comparación explícita. No se necesita estado: la decisión usa las props.

**Puente:** “App conserva el fixture. Vamos a mover el bloque de colección y comprobar que sigue mostrando lo mismo”. Cierra las slides una vez; continúa en el editor y no regreses a ellas.

### S03-B03 · 35–50 min · Crear el contrato y la colección

#### Referencia de entrada · Archivos heredados de 02

El checkpoint inicial parte de `session-02-end`. No rehagas estos archivos durante clase; se incluyen completos para recuperar el punto de entrada desde este documento.

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

**`src/components/media-card.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'

type MediaCardProps = {
  data: MediaItem
}

export function MediaCard(props: MediaCardProps) {
  const { data } = props
  const mediaTypeLabel = data.mediaType === 'movie' ? 'Película' : 'Serie'

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
          {mediaTypeLabel} · {data.releaseDate}
        </p>
        <h3>{data.title}</h3>
        <p>{data.description ?? 'Sin descripción disponible'}</p>
      </div>
    </article>
  )
}
```

**`src/App.tsx` · archivo completo:**

```tsx
import { AppHeader } from './components/app-header'
import { MediaCard } from './components/media-card'
import { mediaItems } from './data/media-items'

function App() {
  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>

        <div className="media-list">
          {mediaItems.map((media) => (
            <MediaCard key={media.id} data={media} />
          ))}
        </div>
      </main>
    </>
  )
}

export default App
```

#### Soporte del bloque · CSS incluido en la entrada

La rama `session-03-start` ya contiene estas reglas. Comprueba su presencia; no las vuelvas a añadir. Si continúas directamente desde tu copia de `session-02-end`, incorpóralas ahora, después de las slides, usando el archivo completo de abajo. Todavía no añadas componentes ni imports para utilizarlas:

```css
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
```

Explica su función cuando se integren los componentes:

- `.empty-state`: padding deja 48 px verticales y 24 px horizontales; border dibuja una línea discontinua; border-radius redondea 16 px; text-align centra el texto; color fija el tono de la descripción.
- `.empty-state h3`: margin-top elimina el margen superior del título y color lo distingue del cuerpo.
- `.media-type-badge`: inline-flex conserva el badge en la línea de metadatos; padding deja aire interior; border usa el color del texto; border-radius da forma redondeada.

El archivo completo que recibe el grupo es:

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
```

#### Soporte heredado · Conservar los cinco posters locales

Estos SVG ya existen desde 02. Confirma que siguen en `public/posters/`. Si preparas la copia desde esta guía, sus contenidos exactos son:

**`public/posters/arrival.svg` · archivo completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#263238"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Arrival</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/severance.svg` · archivo completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#37474f"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Severance</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/the-bear.svg` · archivo completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#455a64"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">The Bear</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/past-lives.svg` · archivo completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#546e7a"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Past Lives</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/blue-eye-samurai.svg` · archivo completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#607d8b"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Blue Eye Samurai</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

#### Paso 1 · Aclarar retorno temprano antes de la práctica

En una pestaña de texto sin guardar del editor muestra este ejemplo completo. No lo añadas al proyecto ni al seed:

```ts
function describeCollection(total: number) {
  if (total === 0) {
    return 'Colección vacía'
  }

  return 'Colección con elementos'
}

describeCollection(0)
describeCollection(6)
```

Pide recorrer ambas llamadas: con 0 termina en el primer return; con 6 llega al segundo. Conecta la misma sintaxis con devolver JSX desde un componente. Cierra la pestaña sin guardar. Esta explicación termina antes del descanso; durante el taller solo se aplica.

#### Paso 2 · Identificar exactamente qué se mueve

En App se conserva el import del fixture, AppHeader, main y el título. Este es el bloque que trasladaremos:

```tsx
    <div className="media-list">
      {mediaItems.map((media) => (
        <MediaCard key={media.id} data={media} />
      ))}
    </div>
```

Pregunta: ¿por qué viaja la key? Respuesta: identifica el elemento directo del recorrido, así que permanece junto a map.

#### Paso 3 · Crear el archivo completo

Crea `src/components/media-grid.tsx`:

**`src/components/media-grid.tsx` · archivo completo:**

```tsx
import type { MediaItem } from '../types/media-item'
import { MediaCard } from './media-card'

type MediaGridProps = {
  items: MediaItem[]
}

export function MediaGrid(props: MediaGridProps) {
  const { items } = props
  return (
    <div className="media-list">
      {items.map((media) => (
        <MediaCard key={media.id} data={media} />
      ))}
    </div>
  )
}
```

Explica cada grupo en orden:

1. Importa MediaItem solo como tipo y MediaCard como componente ejecutable.
2. MediaGridProps declara items como arreglo de MediaItem.
3. La función recibe props; la destructuración extrae items.
4. El return conserva el wrapper y su clase CSS.
5. items.map entrega un objeto a la variable media; los paréntesis devuelven el JSX.
6. key usa media.id y data entrega el objeto entero.
7. Las llaves cierran la expresión JavaScript; luego se cierran wrapper, return y función.

Pregunta: ¿por qué no importa mediaItems? Respuesta: debe representar la colección que el padre elija.

**Estado intermedio:** el archivo existe, pero App todavía usa su propio recorrido. Aún no afirmes que el componente nuevo está montado. El siguiente bloque conecta ambos archivos.

### S03-B04 · 50–65 min · Conectar y comprobar

#### Paso 1 · Sustituir App completo

Quita el import de MediaCard; añade MediaGrid. Sustituye wrapper y map por una sola llamada a MediaGrid:

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

Señala `items={mediaItems}`: items es el nombre de la prop y mediaItems es el arreglo importado. Solo queda un map, dentro de MediaGrid. El CSS continúa exactamente como el comprobado al comenzar S03-B03; no se modifica durante la extracción.

#### Paso 2 · Comprobar la regresión

Cuenta seis tarjetas, ambos tipos y fallbacks. Abre consola: no debe aparecer warning de key. Pregunta dónde vive ahora el recorrido y pide señalar su archivo.

#### Paso 3 · Probar vacío y restaurar

Cambia únicamente la llamada debajo del título de App:

```tsx
<MediaGrid items={[]} />
```

Observa: no hay tarjetas ni mensaje. Pregunta: ¿qué falta? Respuesta: presentar una explicación cuando la colección sea vacía. No borres el fixture. Restaura:
Mientras pruebas `[]`, el import de mediaItems puede quedar marcado como no usado. Es temporal: restaura la llamada antes de ejecutar build; no elimines el fixture ni cambies la configuración.


```tsx
<MediaGrid items={mediaItems} />
```

El archivo completo vuelve al mostrado en el paso 1. Ejecuta:

```bash
pnpm build
pnpm lint
```

**Checkpoint:** `session-03-step-01-media-grid`, idéntico a `session-03-workshop-start`. No existen EmptyState ni MediaTypeBadge.

### S03-B05 · 65–75 min · Encargo antes del descanso

1. Explica que el taller empieza desde el grid construido, no desde una solución.
2. El grupo construirá EmptyState(title, description), el retorno temprano dentro del grid y MediaTypeBadge(mediaType).
3. Se conservan fixture, fallbacks, key y todas las restricciones de la rúbrica.
4. Revisa los criterios y evidencias incluidos a continuación. El material público contiene la misma rúbrica.
5. Pregunta quién decide el vacío y quién presenta texto. Respuesta: MediaGrid decide; EmptyState presenta.
6. Resuelve dudas de sintaxis ahora. No muestres los archivos resueltos del taller.


### Rúbrica y encargo publicados · copia para conducir la clase

#### Escenario

“Catálogo de la semana” debe explicar cuando no recibe medios y debe presentar el tipo de cada medio mediante un componente específico. Reorganiza estas responsabilidades sin cambiar el fixture ni añadir interacción.

#### Trabajo obligatorio

1. Crear `EmptyState` con props `title` y `description`.
2. Hacer que `MediaGrid` muestre ese componente cuando `items.length === 0`.
3. Usar “Catálogo vacío” y “No hay películas o series disponibles”.
4. Crear `MediaTypeBadge` con `mediaType: MediaType`.
5. Mostrar “Película” para `movie` y “Serie” para `series`.
6. Reemplazar la etiqueta inline de `MediaCard` por `MediaTypeBadge`.
7. Conservar `map` y `media.id` como key dentro de `MediaGrid`.
8. Integrar las clases `.empty-state` y `.media-type-badge` provistas.
9. Ejecutar los casos de aceptación y `pnpm build`.

#### Restricciones

- No usar `useState`, Effects, stores o almacenamiento local.
- No añadir inputs, botones o eventos.
- No instalar dependencias.
- No importar `mediaItems` desde `MediaGrid`.
- No mover la key dentro de `MediaCard`.
- No usar `children` en `EmptyState`.
- No cambiar `MediaItem` o el fixture para evitar un caso.
- No eliminar los fallbacks existentes.

#### Casos de aceptación

El docente comprobará:

1. `mediaItems` muestra seis tarjetas.
2. `[]` muestra el título y la descripción del estado vacío.
3. Una película muestra “Película”.
4. Una serie muestra “Serie”.
5. Aftersun conserva “Poster no disponible”.
6. The Bear conserva “Sin descripción disponible”.
7. La consola no presenta warnings de key.
8. `pnpm build` termina con código de salida 0.
9. Puedes explicar quién posee `items`, `map`, key y la decisión vacía.

#### Evidencias requeridas

- Captura del catálogo con seis medios.
- Captura del estado vacío.
- Árbol final escrito o dibujado.
- Resultado de `pnpm build`.
- Proyecto reproducible mediante ZIP o enlace admitido.
- Explicación breve del flujo de props.

Una captura demuestra lo observado en ese navegador. El build demuestra tipos y producción de archivos. Ninguna de estas evidencias prueba una API, despliegue o producción.

#### Actividad opcional

Después de cumplir los requisitos base, muestra el total de medios con `items.length` cuando la colección no está vacía. El valor se calcula durante el render y no usa estado.

#### Evaluación

| Tipo | Criterio o actividad | Qué se evalúa | Escala de asignación | Máximo | Obtenido |
| --- | --- | --- | --- | ---: | ---: |
| Base | Estado vacío | `EmptyState` recibe `title` y `description`; `MediaGrid` lo muestra con los textos aprobados cuando `items.length === 0`; no aparece `0`. | Completo: 25 · Parcial: 13 si el mensaje aparece pero el contrato, los textos o la condición no cumplen por completo · No demostrado: 0 | 25 | ___ |
| Base | Etiqueta de tipo | `MediaTypeBadge` recibe `mediaType: MediaType`, muestra los dos labels y sustituye la decisión inline de `MediaCard`. | Completo: 20 · Parcial: 10 si existe el componente pero un label, el contrato o la integración es incorrecto · No demostrado: 0 | 20 | ___ |
| Base | Composición y flujo | `App` elige la fuente; `MediaGrid` recibe `items`, contiene un solo `map` y coloca `media.id` como key en cada `MediaCard`; los componentes no importan datos que no poseen. | Completo: 20 · Parcial: 10 si el catálogo funciona pero duplica el recorrido, importa el fixture desde el grid o ubica mal una responsabilidad · No demostrado: 0 | 20 | ___ |
| Base | Regresión y restricciones | Funcionan colección completa, vacío, película, serie y los dos fallbacks; no se añaden estado, Effects, stores, eventos, dependencias o cambios al fixture. | Completo: 20 · Parcial: 10 si funcionan al menos cuatro casos y no se añade una herramienta fuera de alcance · No demostrado: 0 | 20 | ___ |
| Base | Verificación, entrega y explicación | `pnpm build` termina con código 0; se entregan las dos capturas, el árbol y el proyecto; el estudiante explica propiedad de `items`, decisión vacía y límite del build. | Completo: 15 · Parcial: 8 si el proyecto y parte de la evidencia pueden revisarse, pero falta una captura, el build o una parte de la explicación · No demostrado: 0 | 15 | ___ |
| Total | Total base | Suma de los cinco criterios obligatorios. | Suma de filas base | 100 | ___ |
| Extra | Total derivado | Con los requisitos base relacionados cumplidos, `MediaGrid` muestra `items.length` solo para una colección no vacía y no usa estado. | Cumple todas las condiciones: +5 · No cumple: 0 | +5 | ___ |
| Total | Total extra | Suma de actividades opcionales válidas. | Máximo adicional disponible | +5 | ___ |
| Total | Puntaje bruto | Total base más total extra. | Máximo antes del límite institucional | 105 | ___ |
| Registro | Nota en plataforma | Puntaje bruto limitado al máximo admitido. | `min(puntaje bruto, 100)` | 100 | ___ |

#### Entrega

Entrega el proyecto, las capturas, el árbol y el resultado del build en la plataforma indicada. Excluye `node_modules/`, `dist/`, tokens, contraseñas y variables de entorno.

La actividad opcional se identifica por separado. No reemplaza un requisito obligatorio ni corrige una responsabilidad base incompleta.

## Descanso · 30 minutos

### S03-B06 · 75–105 min

No se introduce contenido ni se muestra código resuelto.

## Taller calificable · 60 minutos

Los siguientes bloques contienen la solución privada para el docente. El estudiante intenta resolver el encargo; usa las preguntas antes de señalar código. No dictes estos archivos al grupo. Son aplicación de conceptos ya explicados.

### S03-B07 · 105–125 min · Estado vacío

#### Paso 1 · Revisar el contrato y el componente

Pregunta: ¿EmptyState necesita el arreglo? Respuesta: no, solo título y descripción. El estudiante crea `src/components/empty-state.tsx`. Esta es la solución completa para revisar:

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

Explica si hace falta: el tipo declara dos strings; props los recibe; la destructuración los extrae; section usa el estilo preparado; h3 y p presentan los textos. No hay inspección de items ni children.

#### Paso 2 · Integrar la decisión dentro del grid

Importa EmptyState junto a MediaCard. Después de extraer items y antes del return de la lista, comprueba la longitud y devuelve el componente vacío. El archivo completo queda así:

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

Pregunta: ¿se ejecuta el segundo return cuando hay cero elementos? Respuesta: no; el primero ya terminó esa ejecución. La condición pertenece al componente que recibe items.

#### Paso 3 · Probar y restaurar

En App sustituye solo la llamada:

```tsx
<MediaGrid items={[]} />
```

Debe aparecer “Catálogo vacío” y “No hay películas o series disponibles.”, sin tarjetas ni un 0. Restaura:

```tsx
<MediaGrid items={mediaItems} />
```

**Checkpoint:** mensaje vacío y seis tarjetas en estados separados; ambos fallbacks se conservan. Rama `session-03-step-02-empty-state`.

### S03-B08 · 125–145 min · Etiqueta de tipo

#### Paso 1 · Localizar el comportamiento existente

Dentro de MediaCard identifica:

```tsx
const mediaTypeLabel = data.mediaType === 'movie' ? 'Película' : 'Serie'
```

Pregunta qué dato utiliza: solo mediaType. El estudiante crea `src/components/media-type-badge.tsx` con esta solución:

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

El import comparte la unión existente; el contrato pide solo ese valor; la destructuración lo obtiene; el ternario calcula label; span muestra el resultado con la clase preparada. No copies el tipo MediaItem ni instales librerías.

#### Paso 2 · Conectar la tarjeta completa

Añade el import de MediaTypeBadge. Retira la constante mediaTypeLabel. Sustituye su uso por el badge y conserva la fecha. El archivo completo queda así:

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

Pregunta: ¿qué cambió en poster y descripción? Respuesta: nada; se conserva su JSX. Señala data.mediaType entrando en la prop mediaType, y label saliendo como texto del span.

**Checkpoint:** tres badges Película y tres Serie, ambos fallbacks conservados. No se instala estado ni interacción.

### S03-B09 · 145–155 min · Integración y revisión entre pares

#### Paso 1 · Revisar CSS completo

No se añaden estilos durante el taller; se conectan las clases entregadas. Para recuperar una regla perdida sin abrir otro documento, el CSS completo debe seguir así:

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
```

#### Paso 2 · Revisar el árbol y responsabilidades


```text
App
├── AppHeader
└── main
    └── MediaGrid
        ├── EmptyState (solo con cero elementos)
        └── MediaCard × 6 (con el fixture)
            └── MediaTypeBadge
```

Cada estudiante explica a otro quién recibe items, quién decide el vacío y por qué el badge no recibe el medio completo. Revisa un solo map y key en el grid. No califiques el tamaño del archivo como criterio.

### S03-B10 · 155–165 min · Matriz y entrega

#### Paso 1 · Comprobar catálogo completo

El App final es:

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

Cuenta seis tarjetas, tres tipos Película y tres Serie. Aftersun conserva el poster alternativo; The Bear conserva la descripción alternativa. Las cinco imágenes locales deben cargar.

#### Paso 2 · Comprobar vacío sin borrar datos

Sustituye únicamente:

```tsx
<MediaGrid items={[]} />
```

Observa el título y descripción, cero tarjetas y ningún 0 aislado. Captura la evidencia. Después restaura:

```tsx
<MediaGrid items={mediaItems} />
```

#### Paso 3 · Registrar evidencia

Con dev abierto, ejecuta en otra terminal:

```bash
pnpm build
pnpm lint
```

Registra salida y primer error si existe. Pide proyecto con src, public, configuración, package.json y pnpm-lock.yaml; excluye node_modules, dist y secretos. Capturas, árbol y explicación completan la entrega según la rúbrica. No conviertas build correcto en prueba del navegador.

## Revisión y cierre · 15 minutos

### S03-B11 · 165–180 min

Revisa dos entregas, una base y otra con extra si existe. Recorre items desde App, mediaType desde la tarjeta y los estados completo/vacío. El cierre es oral sobre el código; no se reabre el deck.

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Por qué el grid recibe items y no importa el fixture? | El padre elige la fuente; el grid presenta cualquier colección compatible. |
| ¿Dónde vive la key después de mover el recorrido? | En MediaCard, elemento directo producido por map dentro de MediaGrid. |
| ¿Quién decide el vacío y quién presenta su texto? | MediaGrid decide; EmptyState presenta title y description. |
| ¿Qué dato cambiaría para mostrar menos tarjetas? | La colección que App entrega como items. |

No implementes aún búsqueda. La sesión 04 añadirá interacción en App.

## Variante privada del extra · Después de cumplir la base

El reto no forma parte de session-03-end ni se muestra antes de la práctica. Para revisar una solución válida, el grid completo puede quedar así:

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
      <p>{items.length} medios</p>
      {items.map((media) => (
        <MediaCard key={media.id} data={media} />
      ))}
    </div>
  )
}
```

El párrafo queda después del retorno temprano, así que solo aparece cuando la colección tiene elementos. Deriva el total con items.length; no introduce estado. Usa estilos heredados, sin una clase nueva. Para la referencia canónica conserva la versión base de S03-B07; los estudiantes pueden conservar su extra y declararlo en la entrega.

## Si la clase no alcanza a terminar

Registra bloque comprobado, archivo y cambio guardado, primer paso pendiente y evidencia ausente. Ejemplo: “S03-B07 completo; grid devuelve EmptyState; falta S03-B08, crear badge; pendiente matriz final”. Al retomar, ejecuta ese estado, pide explicarlo y continúa con el paso pendiente.

Si falla la extracción previa, usa session-03-workshop-start y recupera la explicación pendiente antes de evaluar el taller. No reduzcas automáticamente los 60 minutos calificables ni declares aprendida una parte por entregar una rama. Si los conceptos previos no quedaron claros, registra la necesidad de recuperación; no introduzcas conceptos nuevos después del descanso.

## Errores frecuentes y cómo intervenir

### MediaGrid importa el fixture

Retira el import y vuelve a `items`. `App` elige la fuente; `MediaGrid` presenta cualquier colección compatible.

### Se duplica el map

Debe existir un solo recorrido. Retira el bloque antiguo de `App` después de conectar `MediaGrid`.

### La key permanece en App

La key acompaña al elemento directo creado por `map`. Si `MediaGrid` ejecuta el recorrido, la key vive allí.

### La key aparece dentro de MediaCard

Muévela a `<MediaCard />` en `MediaGrid`. Un elemento interno no identifica a los hermanos creados por el recorrido.

### EmptyState recibe items

Pregunta qué propiedades lee. Si solo presenta título y descripción, limita el contrato a esos strings.

### EmptyState usa children

Vuelve al contrato publicado. `children` queda fuera de alcance para mantener una sola dificultad.

### La condición usa `items.length && ...`

Con cero elementos, una expresión numérica con `&&` puede producir `0`. Usa `items.length === 0` con retorno temprano.

### MediaTypeBadge recibe MediaItem

Reduce el contrato a `mediaType: MediaType`. El badge no necesita título, poster o descripción.

### Se pierde el fallback

Compara `MediaCard` con el seed. La extracción de la etiqueta solo reemplaza el texto de tipo; no cambia poster o descripción.

### Se modifica el fixture para probar vacío

Pasa `[]` temporalmente desde `App`. No borres los seis objetos ni cambies el contrato.

### Se añade useState

Retíralo. `items`, `items.length` y el texto del badge proceden de props y no cambian por interacción.

### Se crea PageContainer

Pregunta qué contrato o decisión posee. Si solo envuelve `main`, conserva ese marcado en `App`.

### Una imagen local no carga

Comprueba public/posters y la ruta exacta del fixture. El caso null es independiente de un archivo ausente.

## Plan de contingencia

- **El seed falla:** entregar la copia verificada y registrar el primer error.
- **La regresión inicial falla:** corregir solo el checkpoint de entrada o entregar el seed limpio. No enseñar composición sobre un estado roto.
- **MediaGrid no termina al minuto 65:** entregar session-03-workshop-start y registrar la explicación pendiente.
- **El grupo no entiende el vacío:** reconstruir la decisión `items.length === 0` antes del descanso, sin escribir `EmptyState`.
- **Varias entregas repiten el mismo error:** hacer una pausa de cinco minutos con un diagrama, sin proyectar la solución completa.
- **El build falla al cerrar:** evaluar por separado estructura, casos visuales y explicación. No asignar cero automático a toda la entrega.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** A.
- **Justificación:** conviene separar una parte cuando cumple una responsabilidad clara; no basta contar líneas o etiquetas.
- **Fuente:** `Thinking in React`, `Step 1`.

### Pregunta 2

- **Respuesta:** Verdadero.
- **Justificación:** una versión estática recibe datos mediante props y no necesita estado porque ninguna interacción cambia esos datos.
- **Fuente:** `Thinking in React`, `Step 2`.

### Pregunta 3

- **Respuesta:** B.
- **Justificación:** en la versión estática, los datos pasan de los componentes padres a los hijos.
- **Fuente:** `Thinking in React`, `Step 2`.

### Pregunta 4

- **Respuesta:** B, una condición `if` de JavaScript.
- **Justificación:** React usa el control de flujo de JavaScript para decidir qué JSX devuelve un componente.
- **Fuente:** `Conditional Rendering`, `Conditionally returning JSX`.

### Pregunta 5

- **Respuesta:** Verdadero.
- **Justificación:** el renderizado condicional permite que los datos recibidos produzcan hijos distintos en el árbol renderizado.
- **Fuente:** `Conditional Rendering` y `Understanding Your UI as a Tree`.

## Criterios privados de corrección

Usa la misma [rúbrica publicada](workshop-rubric.md). No añadas criterios ocultos.

- La versión completa debe cumplir el contrato exacto de cada componente.
- Un resultado visual correcto con responsabilidades mezcladas recibe el nivel parcial del criterio de composición.
- Un build fallido no borra evidencia estructural o explicaciones que todavía puedan revisarse.
- Una imagen local ausente no reduce la nota por sí sola; evalúa las evidencias y los criterios publicados sin inventar penalizaciones.
- La actividad opcional solo puntúa después de cumplir los requisitos base relacionados con la colección.

## Frontera de evidencia

| Comprobación | Demuestra | No demuestra |
| --- | --- | --- |
| `pnpm build` | TypeScript y Vite produjeron el build. | Resultado visual, React DevTools o disponibilidad de imágenes. |
| Seis tarjetas visibles | El fixture completo se transforma en seis componentes. | Que el caso vacío funcione. |
| `items={[]}` | La rama vacía produce el mensaje esperado. | Que una búsqueda futura distinga otra causa de vacío. |
| Consola sin warning de key | El recorrido montado declara keys. | Que todas las identidades futuras sean correctas. |
| Árbol en React DevTools | Los componentes se montaron con la jerarquía observada. | Que sus responsabilidades internas sean óptimas. |
| Explicación del estudiante | Puede seguir el flujo del checkpoint. | Ejecución en otros navegadores o producción. |

## Preparación de la sesión 04

El checkpoint siguiente debe conservar:

- `App` eligiendo `mediaItems`.
- `MediaGrid` con `items`, `map`, key y estado vacío.
- `MediaCard` con los fallbacks.
- `MediaTypeBadge` con ambos labels.
- Cero estado e interacción.

La sesión 04 añadirá `query` en `App`, calculará `visibleMedia` y reutilizará `EmptyState` para “Sin resultados”. No muevas estado a `MediaGrid` ni añadas un input durante esta sesión.
