# Guía docente · Sesión 02 · Props, listas y TypeScript

> Material privado del docente. No distribuir la clave del cuestionario ni las respuestas esperadas junto con la guía estudiantil.

- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Plan aprobado:** [session-draft.md](session-draft.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Objetivo docente

Conducir al grupo desde una `MediaCard` fija hasta seis tarjetas configuradas por un fixture tipado. Al cerrar, cada estudiante debe poder seguir el dato desde `mediaItems` hasta el JSX, explicar la función de la prop `data` y justificar `media.id` como key estable.

La sesión no introduce estado, eventos o componentes de colección. `App` conserva el wrapper, `map` y `key`; `MediaCard` conserva la etiqueta de tipo inline.

## Ruta recuperable del proyecto

Repositorio hermano: `../MediaLog-Bootcamp`. `session-02-start` coincide exactamente con `session-01-end`. No se repite scaffold.

| Bloque comprobado | Rama de consulta | Resultado y siguiente paso |
| --- | --- | --- |
| S02-B01 | `session-02-start` | Una tarjeta fija; presentar conceptos. |
| S02-B03 | `session-02-step-01-typed-fixture` | Cinco objetos y null checks; conectar props. |
| S02-B04 | `session-02-step-02-card-props` | Una tarjeta recibe data; transformar la colección. |
| S02-B05 | `session-02-step-03-keyed-list` | Cinco tarjetas con key; resolver ausencias. |
| S02-B06 | `session-02-step-04-null-fallbacks` | Cinco tarjetas completas; entregar práctica del sexto objeto. |
| S02-B07–B08 | `session-02-end` | Seis tarjetas verificadas; entrada de 03. |

El docente escribe el contrato, dos objetos y los cambios estructurales; el grupo predice propiedades, lee errores y completa expresiones. Las otras tres entradas y los SVG son soporte preparado. El sexto objeto lo resuelve cada estudiante. El README de cada rama describe su estado.

Para consultar una etapa, guarda primero tus cambios en tu propia copia. En una copia limpia puedes usar `git switch session-02-step-02-card-props`; no muevas las referencias de consulta. Para comparar: `git diff session-02-step-02-card-props..session-02-step-03-keyed-list -- src/App.tsx src/index.css`.

### Si termina el tiempo

Registra último bloque comprobado, archivo y último cambio guardado, primer paso pendiente y evidencia ausente. Ejemplo: “S02-B05; App tiene map y key; falta S02-B06, sustituir ruta de poster por imagen/alternativa; falta build final”. Al retomar, ejecuta el estado guardado, pide explicar data y key, y continúa ese primer paso. No declares 02 terminada ni comiences las extracciones de 03 hasta comprobar seis tarjetas y los casos nulos. Una rama de respaldo recupera archivos, no sustituye la explicación pendiente.

## Preparación antes de la clase

### Checkpoint de entrada

Prepara una copia privada del proyecto final de la sesión 01. Comprueba:

```bash
pnpm install --frozen-lockfile
pnpm build
```

Después inicia:

```bash
pnpm dev
```

Verifica:

- React y React DOM `19.2.8`.
- TypeScript `6.0.3`.
- pnpm `11.17.0`.
- `AppHeader` y `MediaCard` visibles en React DevTools.
- Una sola tarjeta con datos fijos.
- Build con código de salida 0.

Conserva este checkpoint como ZIP privado sin `node_modules/` ni `dist/`. Úsalo si un estudiante no recupera la sesión 01 en los primeros ocho minutos.

### Checkpoints de contingencia

Prepara dos copias privadas adicionales:

1. **Contrato y cinco datos:** incluye `MediaItem`, `MediaType` y las primeras cinco entradas, pero conserva `MediaCard` fija.
2. **Lista antes de fallbacks:** incluye `MediaCardProps`, el `map` y la key; deja pendiente resolver tipo, poster y descripción nulos.

Estos checkpoints permiten recuperar tiempo sin revelar `MediaGrid`, `MediaTypeBadge` o `EmptyState`.

### Resultados del cuestionario

Antes de la videollamada:

1. Revisa el porcentaje de aciertos.
2. Selecciona la pregunta con más errores.
3. Relaciónala con el bloque donde se usará el concepto.
4. Dedica un máximo de dos minutos a recuperarla.

No conviertas la apertura en una corrección completa del cuestionario.

## Resultado observable

La sesión termina con este flujo:

```text
src/data/media-items.ts
        │ MediaItem[]
        ▼
      App.tsx
        │ map + media.id
        ▼
<MediaCard data={media} />
        │
        ▼
     JSX visible
```

Además:

- El navegador muestra seis tarjetas.
- Existen textos para película y serie.
- Funcionan los fallbacks de poster y descripción.
- La consola no muestra el warning de key.
- `pnpm build` termina con código 0.
- El código nuevo no introduce `any`, assertions o estado. El `!` de `main.tsx` procede del scaffold anterior.

## Secuencia docente

### S02-B01 · 0–8 min · Recuperación

Comprueba la aplicación antes de iniciar la presentación. Recupera una pregunta previa y muestra portada y tarjeta fija (slides 1–2). Pregunta dónde viven los datos y por qué dos usos repetirían Arrival. Respuesta: están dentro de MediaCard. La duplicación ejecutable se hace al comenzar S02-B03; no abras el editor entre diapositivas.

### S02-B02 · 8–25 min · Presentación continua

Recorre las slides 3–13 del HTML aprobado: padre e hijo, objeto props y destructuración dentro de la función, solo lectura, contrato, unión y null, fixture, map, key, decisiones visuales, flujo y responsabilidad pendiente. Usa 5 minutos para props, 5 para contrato/fixture, 4 para map/key y 3 para casos/puente. Las preguntas se responden mirando snippets y diagramas; nadie copia todavía el proyecto.

En la slide de solo lectura aclara que reasignar una variable local no actualiza al padre y que modificar `props.data.title` mutaría el objeto recibido, lo que debemos evitar. No confundas el error de reasignar un `const` con la regla de React.

En la slide de key, el objeto está abreviado: faltan campos del contrato y no se copia como fixture ejecutable. El bloque completo está abajo. La slide 14 queda como referencia docente para las cuatro preguntas del cierre oral; no se vuelve al deck.

Pregunta de transición: ¿quién elige cada dato y por dónde entra? Respuesta: App elige; data lo entrega a MediaCard. Cierra la presentación una sola vez y abre el editor.

### S02-B03 · 25–37 min · Contrato y fixture tipado

**Entrada:** tarjeta fija. **Responsable:** docente escribe; grupo predice y lee errores. **Salida:** cinco objetos, todavía sin conectar a la pantalla.

#### Referencia de entrada · Solo comprobar, no volver a escribir

Ya existen desde 01; no se vuelven a escribir en clase. Se incluyen aquí para comprobar la entrada sin abrir el proyecto de referencia.

**`src/App.tsx` · archivo completo:**

```tsx
import { AppHeader } from './components/app-header'
import { MediaCard } from './components/media-card'

function App() {
  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>

        <MediaCard />
      </main>
    </>
  )
}

export default App
```

**`src/components/media-card.tsx` · archivo completo:**

```tsx
export function MediaCard() {
  return (
    <article className="media-card">
      <div className="media-card__poster">Poster pendiente</div>
      <div>
        <p className="media-card__meta">Película · 2016</p>
        <h3>Arrival</h3>
        <p>
          Una lingüista intenta comprender a visitantes que han llegado a
          distintos puntos del planeta.
        </p>
      </div>
    </article>
  )
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
```

#### Soporte del bloque · Incorporar los cinco posters

Al comenzar el coding, incorpora `public/posters/` con estos cinco archivos completos. Puedes copiarlos como soporte; no se transcriben línea a línea durante la explicación de React. Si ya vienen en tu copia, comprueba su presencia y no los dupliques. Aftersun conserva `posterUrl: null`.

**`public/posters/arrival.svg` · contenido completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#263238"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Arrival</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/severance.svg` · contenido completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#37474f"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Severance</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/the-bear.svg` · contenido completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#455a64"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">The Bear</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/past-lives.svg` · contenido completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#546e7a"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Past Lives</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

**`public/posters/blue-eye-samurai.svg` · contenido completo:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="480" viewBox="0 0 320 480"><rect width="320" height="480" fill="#607d8b"/><text x="160" y="230" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="26">Blue Eye Samurai</text><text x="160" y="266" text-anchor="middle" fill="#f5f1e8" font-family="sans-serif" font-size="14">MediaLog · Imagen de prueba</text></svg>
```

#### Paso 1 · Duplicar y restaurar la tarjeta

En `src/App.tsx`, debajo del título, sustituye el uso único por estas dos líneas:

```tsx
<MediaCard />
<MediaCard />
```

Pregunta: ¿por qué ambas muestran Arrival? Respuesta: ejecutan el mismo componente con datos fijos. Retira la segunda línea; conserva:

```tsx
<MediaCard />
```
#### Paso 2 · Configurar los valores nulos

Abre `tsconfig.app.json` y añade `"strictNullChecks": true,` debajo del comentario de linting. No modifiques las demás opciones. El archivo completo queda así:

**`tsconfig.app.json` · archivo completo:**

```jsonc
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Explica: esta opción distingue null y undefined de un string. El scaffold de 01 no la activaba.

#### Paso 3 · Escribir todos los tipos

Crea `src/types/media-item.ts`. Escribe primero la unión:

```ts
export type MediaType = 'movie' | 'series'
```

Pregunta: ¿acepta cualquier string? Respuesta: solo movie o series. Añade debajo el alias del objeto; este es el archivo completo:

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

Explica las líneas en orden:

1. `export` permite importar el tipo y `type` nombra una forma de datos.
2. La barra de `MediaType` une dos valores permitidos.
3. `id: number` identifica el medio; después servirá como key.
4. `title: string` contiene el título que verá el usuario.
5. `description: string | null` exige la propiedad y admite ausencia explícita.
6. `mediaType: MediaType` reutiliza la unión, sin repetir sus valores.
7. `releaseDate: string` conserva la fecha como texto; no se formatea hoy.
8. `posterUrl: string | null` contiene una ruta o declara su ausencia.
9. Las llaves delimitan el objeto; el alias no crea datos durante ejecución.

Pregunta: ¿por qué no `description?: string`? Respuesta: todos los objetos deben declarar la propiedad; The Bear declarará null.

#### Paso 4 · Escribir dos objetos completos

Crea `src/data/media-items.ts` con Arrival y Severance:

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
]
```

Explica: `import type` importa la definición; `MediaItem[]` comprueba cada entrada. Los corchetes contienen el arreglo, las llaves contienen cada objeto y las comas separan elementos y propiedades.

Entrega los SVG preparados y cópialos a `public/posters/`. `/posters/arrival.svg` apunta a `public/posters/arrival.svg`; el valor de la ruta no incluye public.

#### Paso 5 · Provocar y corregir el error de dominio

En Severance sustituye solo la línea de mediaType por:

```ts
mediaType: 'anime',
```

Pide leer el error: el valor no pertenece a MediaType. Restaura exactamente:

```ts
mediaType: 'series',
```

No amplíes el tipo para ocultar el error.

#### Paso 6 · Incorporar las otras tres entradas

Añade Aftersun, The Bear y Past Lives después de Severance, antes del corchete final. Este es el archivo completo que debes dejar:

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
]
```

Señala el poster nulo de Aftersun y la descripción nula de The Bear. La sexta entrada todavía no se añade.

#### Paso 7 · Comprobar ausencia explícita

En The Bear cambia temporalmente la descripción por:

```ts
description: undefined,
```

Pregunta: ¿por qué lo rechaza? Respuesta: el contrato permite string o null, no undefined. Restaura:

```ts
description: null,
```

Pregunta: ¿esto valida una respuesta HTTP futura? Respuesta: no; comprueba los datos escritos en el proyecto.

**Checkpoint:** cinco objetos sin errores del editor y dos casos nulos. La pantalla sigue fija porque App todavía no importa el fixture. Rama `session-02-step-01-typed-fixture`; continúa con props.

### S02-B04 · 37–50 min · MediaCard configurable

#### Paso 1 · Declarar la entrada de la tarjeta

Abre `src/components/media-card.tsx`. Añade:

```tsx
import type { MediaItem } from '../types/media-item'

type MediaCardProps = {
  data: MediaItem
}
```

Cambia la firma:

```tsx
export function MediaCard(props: MediaCardProps) {
  const { data } = props
```

Primero señala `props.data`; después escribe `const { data } = props`, que extrae esa propiedad. Este es el componente intermedio completo. La ruta del poster se muestra como texto de diagnóstico; `null` no dibuja texto. Todavía no insertamos `<img>` ni fallback:

```tsx
import type { MediaItem } from '../types/media-item'

type MediaCardProps = {
  data: MediaItem
}

export function MediaCard(props: MediaCardProps) {
  const { data } = props

  return (
    <article className="media-card">
      <div className="media-card__poster">{data.posterUrl}</div>
      <div>
        <p className="media-card__meta">{data.mediaType} · {data.releaseDate}</p>
        <h3>{data.title}</h3>
        <p>{data.description}</p>
      </div>
    </article>
  )
}
```

#### Paso 2 · Conectar el padre

Reemplaza `src/App.tsx` por esta conexión completa:

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

        <MediaCard data={mediaItems[0]} />
      </main>
    </>
  )
}

export default App
```

Remarca la conexión:

```tsx
<MediaCard data={mediaItems[0]} />
```

Pregunta antes de cada cambio:

> ¿Qué propiedad del contrato reemplaza este texto fijo?

Respuesta esperada según el lugar: `title`, `description`, `mediaType`, `releaseDate` o `posterUrl`.

La configuración verificada no activa `noUncheckedIndexedAccess` y el fixture tiene cinco entradas; este acceso compila. Si otra copia activa esa opción, comprueba que el primer objeto exista con un condicional antes de renderizar. No uses `!` ni cambies la configuración para ocultar el error.

#### Paso 3 · Comparar dos datos y restaurar una tarjeta

Debajo del título de App, sustituye temporalmente la tarjeta única por estas dos líneas:

```tsx
<MediaCard data={mediaItems[0]} />
<MediaCard data={mediaItems[1]} />
```

Se deben ver contenidos diferentes. Retira solo el segundo uso y recupera una tarjeta antes del siguiente bloque.

**Checkpoint intermedio:** `MediaCard` no contiene Arrival ni otro dato de dominio fijo.

### S02-B05 · 50–63 min · `map` y key estable

#### Paso 1 · Crear el recorrido y observar el warning

Pregunta:

> Si ya tenemos un arreglo, ¿qué debe producir la transformación para cada elemento?

Respuesta esperada: una `MediaCard` configurada con ese medio.

Escribe dentro de `App`:

```tsx
<div className="media-list">
  {mediaItems.map((media) => (
    <MediaCard data={media} />
  ))}
</div>
```

Comprueba cinco tarjetas. Abre la consola y localiza el warning de key. No dediques tiempo a traducir cada línea del stack.

Pregunta:

> ¿Qué dato del fixture identifica cada medio de forma estable?

Respuesta esperada: `id`.

#### Paso 2 · Corregir la identidad y consolidar App

En el elemento que devuelve map, sustituye la línea sin key por:

```tsx
<MediaCard key={media.id} data={media} />
```

Aclara:

- `data` es el nombre de la prop; `media` es la variable local del recorrido. Dentro de `MediaCard`, la destructuración permite leer `data.title` y `data.id`.
- La key vive en el elemento JSX devuelto directamente por `map`.
- React la usa para asociar el elemento con su dato.
- `MediaCard` no recibe `key` dentro de `MediaCardProps`.
- Los hermanos necesitan keys únicas y estables.

Menciona índices y `Math.random()` solo como decisiones que no se usarán: el fixture ya contiene una identidad.

El archivo completo de App, con la key corregida, queda así:

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

#### Paso 3 · Añadir el espacio entre tarjetas

Añade al principio de `src/index.css`:

```css
.media-list {
  display: grid;
  gap: 24px;
}
```

`display: grid` organiza las tarjetas y `gap` deja 24 px entre ellas. Conserva todas las reglas heredadas. Este es el CSS completo:

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
```


Actualiza el navegador y confirma que el warning desapareció. Si queda otro warning, léelo antes de atribuirlo a la key.

**Checkpoint intermedio:** cinco tarjetas visibles y consola sin warning de key.

### S02-B06 · 63–77 min · Casos de presentación

Construye las decisiones desde los datos ya presentes.

#### Paso 1 · Traducir el tipo

En `src/components/media-card.tsx`, debajo de `const { data } = props`, añade:

```tsx
const mediaTypeLabel = data.mediaType === 'movie' ? 'Película' : 'Serie'
```

El ternario comprueba movie: la rama verdadera produce Película y la otra, Serie. Sustituye el párrafo de metadatos por:

```tsx
<p className="media-card__meta">
  {mediaTypeLabel} · {data.releaseDate}
</p>
```

Mantenlo dentro de `MediaCard`. No extraigas `MediaTypeBadge`.

#### Paso 2 · Sustituir la ruta textual por imagen o alternativa

Dentro del article, reemplaza por completo `<div className="media-card__poster">{data.posterUrl}</div>` con:

```tsx
{data.posterUrl ? (
  <img
    className="media-card__poster-image"
    src={data.posterUrl}
    alt={`Poster de ${data.title}`}
  />
) : (
  <div className="media-card__poster">Poster no disponible</div>
)}
```

Aclara que este condicional responde al contrato `string | null`. No transforma una URL rota en fallback; ese caso exigiría otra decisión y queda fuera de alcance.

#### Paso 3 · Sustituir la descripción nula

Reemplaza `<p>{data.description}</p>` por:

```tsx
<p>{data.description ?? 'Sin descripción disponible'}</p>
```

Explica `??` con el límite necesario: usa el texto alternativo cuando el valor es `null` o `undefined`. El contrato de hoy contempla `null`.

Tras los tres cambios, la tarjeta completa queda así:

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

#### Paso 4 · Estilar la imagen

Añade al principio de `src/index.css`:

```css
.media-card__poster-image {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  object-fit: cover;
}
```

Explica: width ocupa el ancho de la columna; height fija 220 px; border-radius redondea 10 px; object-fit llena el área manteniendo proporción y puede recortar la imagen. El archivo completo queda así:

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
```

Comprueba:

- una película;
- una serie;
- Aftersun sin poster;
- The Bear sin descripción.

**Transición:** “El componente ya representa todos nuestros casos. Falta comprobar que otra persona puede extender los datos sin tocar la estructura”.

### S02-B07 · 77–85 min · Práctica individual

#### Paso 1 · Entregar el objeto para completar

En `src/data/media-items.ts`, indica que se añade después del objeto 5 y antes del corchete final. Entrega este objeto incompleto:

```ts
{
  id: 6,
  title: 'Blue Eye Samurai',
  description:
    'Una guerrera persigue una venganza en el Japón del periodo Edo.',
  mediaType: '',
  releaseDate: '2023-11-03',
  posterUrl:
    '/posters/blue-eye-samurai.svg',
},
```

Pide completar `mediaType` sin copiar ni modificar `MediaCard`. Después solicita una comprobación por parejas:

1. Contar seis tarjetas.
2. Señalar la sexta entrada en el fixture.
3. Explicar por qué TypeScript rechazaba el string vacío.
4. Cambiar temporalmente `series` por `anime`, leer el error y restaurar `series`.

Si una persona termina antes, pídele localizar dónde viven `map`, `key` y el wrapper. No adelantes la extracción de `MediaGrid`.

#### Paso 2 · Revisar la solución y consolidar el fixture

**Solución docente, después de la práctica:** corrige mediaType del objeto 6 a esta línea:

```ts
mediaType: 'series',
```

El fixture completo de salida queda así:

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

**Checkpoint intermedio:** seis tarjetas y fixture sin errores. App, MediaCard y CSS conservan el resultado comprobado de S02-B06.

### S02-B08 · 85–90 min · Comprobación y cierre

#### Paso 1 · Ejecutar la comprobación

Conserva `pnpm dev` y abre otra terminal:

```bash
pnpm build
```

Pide al grupo comprobar:

- seis tarjetas visibles;
- película y serie;
- poster y descripción nulos;
- consola sin warning de key;
- build con código 0.

Recorre el diagrama:

```text
fixture → App → map → data prop → MediaCard → JSX
```

#### Paso 2 · Cerrar oralmente

Formula estas preguntas sobre el código o navegador, sin abrir otro Markdown ni regresar a las slides:

| Pregunta | Respuesta esperada |
| --- | --- |
| ¿Quién posee el fixture y quién presenta cada medio? | App elige la colección y MediaCard presenta data. |
| ¿Qué comprueba MediaItem y qué no comprueba en runtime? | Comprueba los objetos durante desarrollo/build; no valida automáticamente una respuesta HTTP. |
| ¿Por qué media.id sirve como key y por qué key no es una prop normal? | Es estable entre hermanos; React consume key y la tarjeta recibe data. |
| ¿Qué responsabilidad concentra todavía App? | El wrapper de la colección, map y key. |

 Termina señalando el wrapper, `map` y `key` que todavía viven en `App`; la sesión 03 reorganizará esa responsabilidad sin cambiar los datos.

## Preguntas y respuestas esperadas

| Pregunta | Respuesta esperada | Intervención si falta precisión |
| --- | --- | --- |
| ¿Quién posee `mediaItems`? | `App` lo importa y decide usar esa colección. | Diferenciar elegir la fuente de presentar un item. |
| ¿Qué recibe `MediaCard`? | Una prop `data` que cumple `MediaItem`. | Pedir que señalen el JSX y el parámetro. |
| ¿Puede `MediaCard` cambiar su prop? | No; la trata como entrada de solo lectura. | Recordar que el padre entrega un dato distinto. |
| ¿Qué permite `MediaType`? | Solo `movie` o `series`. | Mostrar el error con `anime`. |
| ¿Qué diferencia hay entre `string | null` y `prop?: string`? | La primera exige la propiedad y admite ausencia explícita; la segunda permite omitirla. | Señalar el objeto de The Bear. |
| ¿Qué devuelve `map`? | Un elemento `<MediaCard />` por cada medio. | Dibujar un objeto entrando y una tarjeta saliendo. |
| ¿Dónde vive `key`? | En `<MediaCard />`, elemento directo devuelto por `map`. | No añadirla dentro del componente. |
| ¿Por qué usar `media.id`? | Es una identidad estable del dato y única entre los hermanos. | Contrastar con la posición sin implementar índices. |
| ¿Llega `key` dentro de props? | No; React la consume. | Señalar que `MediaCardProps` solo declara `data`. |
| ¿Qué prueba el build? | Tipos y generación de archivos de producción. | Pedir otra evidencia para el resultado visual. |

## Errores frecuentes y cómo intervenir

### El estudiante copia `MediaItem` dentro de varios archivos

Conserva el tipo compartido en `src/types/media-item.ts`. `MediaCardProps` sí permanece junto a `MediaCard` porque solo describe la entrada de ese componente.

### Usa `interface` porque aparece en otro ejemplo

No presentes una comparación. Pide volver al alias aprobado con `type`; la clase necesita una sola sintaxis para el objeto y la unión literal.

### Declara `description?: string`

Pregunta si The Bear omite la propiedad o declara que no tiene descripción. El fixture usa `description: null`, por lo que el tipo correcto es `string | null`.

### Escribe `MediaItem` como valor

Aclara que el alias existe para TypeScript y no crea un objeto durante runtime. El fixture todavía necesita literales `{ ... }`.

### Importa el fixture desde `MediaCard`

Retira ese import. `App` elige la colección; `MediaCard` recibe un medio. Esta frontera prepara la composición posterior.

### Desestructura seis props separadas

Agrupa el contrato en `data: MediaItem`. La aplicación trata esos campos como una unidad de dominio y la sesión 03 necesita propagar ese objeto.

### Usa llaves pero olvida `return` en `map`

Contrasta:

```tsx
mediaItems.map((media) => (
  <MediaCard key={media.id} data={media} />
))
```

con una función de bloque que requeriría `return`. Conserva la forma con paréntesis en esta sesión.

### Coloca `key` dentro de `MediaCard`

Mueve la key al elemento directo creado por `map`. Un elemento dentro de `MediaCard` no identifica a los hermanos que `App` creó.

### Añade `key` a `MediaCardProps`

Retírala. React consume `key`; si el componente necesita el `id`, ya lo obtiene desde `data.id`.

### Usa el índice o `Math.random()`

Pide localizar `id` en el contrato. El fixture ya ofrece una identidad estable; no hace falta generar otra.

### Usa `any` para corregir un error

Rechaza el atajo y lee el primer error. Corrige la propiedad, el import o el valor incompatible sin debilitar el contrato.

### Usa `data.posterUrl!`

Retira la assertion. El caso nulo es real y la interfaz debe representarlo mediante el condicional.

### Usa `||` para la descripción

Acepta que funcionaría con los datos actuales, pero conserva `??` porque el contrato distingue `null`. Evita abrir un bloque sobre todos los valores falsy.

### Una URL de poster falla

Confirma que el valor no sea `null` y prueba la URL en otra pestaña. Registra el problema de red aparte; el fallback de esta clase responde a ausencia de URL, no a errores de descarga.

### El navegador muestra cinco tarjetas

Comprueba que el sexto objeto esté dentro del arreglo y que la coma y las llaves cierren correctamente. No dupliques `<MediaCard />` en `App`.

## Plan de contingencia

- Si falla el checkpoint anterior, entrega la copia de entrada y continúa desde la limitación visible.
- Si el bloque de tipos supera 12 minutos, entrega el archivo con cinco objetos y conserva la lectura del error de `mediaType`.
- Si la conversión de `MediaCard` supera 13 minutos, recupera `session-02-step-02-card-props` y verifica la conexión antes de explicar map; no saltes a una lista resuelta.
- Si falta un poster, comprueba la ruta y la copia de `public/posters/`; no conviertas una ruta incorrecta en null.
- Si no queda tiempo para la práctica por parejas, cada estudiante completa el sexto objeto y entrega la explicación escrita.
- Si `pnpm build` no termina antes del minuto 90, registra el primer error y no declares el checkpoint completo. El estudiante entrega la corrección después de la clase.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** B.
- **Justificación:** el padre envía la prop escribiéndola en el elemento JSX del hijo.
- **Fuente:** React, `Passing props to the child component`.

### Pregunta 2

- **Respuesta:** Verdadero.
- **Justificación:** las props son datos de solo lectura; el componente hijo no debe modificarlas.
- **Fuente:** React, `How props change over time` y `Recap`.

### Pregunta 3

- **Respuesta:** A, `MediaItem[]`.
- **Justificación:** TypeScript usa `T[]` para declarar un arreglo de elementos de tipo `T`.
- **Fuente:** TypeScript, `Arrays`.

### Pregunta 4

- **Respuesta:** C, solo `movie` o `series`.
- **Justificación:** una unión de strings literales limita el valor a los miembros declarados.
- **Fuente:** TypeScript, `Union Types` y `Literal Types`.

### Pregunta 5

- **Respuesta:** A, string o `null`.
- **Justificación:** con `strictNullChecks`, TypeScript obliga a reconocer el miembro nulo antes de usar el valor como string.
- **Fuente:** TypeScript, `null and undefined`.

## Frontera de evidencia

| Comprobación | Demuestra | No demuestra |
| --- | --- | --- |
| Error del editor o `pnpm build` | El código local cumple los tipos configurados. | Que una respuesta remota futura cumpla `MediaItem`. |
| Consola sin warning de key | La lista montada no reporta la falta de key en ese recorrido. | Que toda key de una aplicación futura sea correcta. |
| Seis tarjetas en `pnpm dev` | El fixture local produce seis elementos visibles. | Que el layout responda bien en todos los dispositivos. |
| Casos nulos visibles | El JSX actual representa los `null` del fixture. | Que una URL no nula cargue en todas las redes. |
| `pnpm build` con código 0 | TypeScript y el build de producción terminaron. | Que la aplicación esté desplegada o probada en producción. |

## Preparación de la sesión 03

El checkpoint que se use como seed debe conservar:

- seis objetos;
- `MediaItem` y `MediaType`;
- `MediaCard` terminada;
- `App` con wrapper, `map` y key;
- etiqueta de tipo inline;
- fallbacks de poster y descripción.

No añadas `MediaGrid`, `MediaTypeBadge`, `EmptyState` o funciones vacías. La siguiente sesión necesita construir esas responsabilidades desde el estado observable que deja esta clase.
