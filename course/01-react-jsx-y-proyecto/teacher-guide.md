# Guía docente · Sesión 01 · React, Vite y JSX

> Material privado del docente. No distribuir la clave del cuestionario ni las respuestas esperadas junto con la guía estudiantil.

- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Plan aprobado:** [session-draft.md](session-draft.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Objetivo docente

Conducir al grupo desde una carpeta vacía hasta un proyecto React que compone `AppHeader` y `MediaCard`. Al cerrar, cada estudiante debe poder señalar el punto de entrada, distinguir declaración y uso de un componente y explicar por qué esas dos extracciones tienen una responsabilidad reconocible.

La sesión no enseña props, eventos o estado. El contador generado por Vite se retira como parte de la limpieza del template.

## Ruta operativa · Proyecto y presentación

Proyecto de referencia: `../../../MediaLog-Bootcamp` desde la carpeta de esta guía; repositorio hermano de `React-Guide-VI`. Carpeta: `MediaLog-Bootcamp`. Nombre del paquete: `medialog-bootcamp`. Convención completa: [plan del proyecto progresivo](../../progressive-project-plan.md).

Las ramas conservan estados de consulta. La construcción en clase ocurre en una copia de trabajo; no hagas saltar al grupo al checkpoint final para sustituir un bloque pendiente. La primera sesión estudiantil comienza en una carpeta nueva, aunque el repositorio docente conserve una entrada con README.

| Bloque | Minutos | Apoyo visual y responsable | Cambio o comprobación | Referencia después del bloque |
| --- | --- | --- | --- | --- |
| S01-B01 | 0–8 | Slides 1–2; docente y grupo | Producto de contexto, pregunta previa y versiones. No hay código React todavía. | `session-01-start` |
| S01-B02 | 8–20 | Slides 3–9; docente con predicciones | Herramientas, responsabilidad, declaración/uso y JSX. Preguntas y ejemplos en el bloque detallado inferior. | Mismo estado inicial |
| S01-B03 | 20–35 | Terminal; docente y grupo | Crear con Vite, fijar versiones, instalar y abrir el template. | `session-01-step-01-scaffold` |
| S01-B04 | 35–45 | Editor; grupo señala archivos | Seguir `index.html → main.tsx → App.tsx`; reconocer `StrictMode`. No reescribirlos. | Mismo scaffold |
| S01-B05 | 45–57 | Editor; docente escribe JSX, grupo copia CSS | Retirar el template y escribir la pantalla completa dentro de `App`. | `session-01-step-02-static-screen` |
| S01-B06 | 57–67 | Editor; demostración docente | Mover solo `header` a `app-header.tsx`, exportar, importar y usar. | `session-01-step-03-app-header` |
| S01-B07 | 67–78 | Editor; construcción con propuestas del grupo | Mover el `article` completo a `media-card.tsx`; conservar una sola tarjeta. | `session-01-end` para comparar después de construir |
| S01-B08 | 78–85 | Editor; actividad individual | Cambiar contenido fijo y provocar/reparar un error JSX. No repetir la extracción. | Copia personal; referencia canónica sin cambios |
| S01-B09 | 85–90 | Navegador, terminal y cierre oral; grupo explica | Build, árbol, resultado visual y cuatro preguntas del cierre real. | `session-01-end`, entrada de 02 |

La tabla suma 90 minutos. Las slides 1–9 se presentan en una secuencia continua antes de abrir el editor. En B02, las slides 8–9 anticipan brevemente el punto de entrada y la transformación; B04–B05 los comprueban sobre archivos reales sin regresar al deck. La slide 10 permanece como referencia de preguntas para el docente, sin proyectarla antes de construir ni volver a ella al cerrar. Los 12 minutos de B02 conservan el presupuesto de esta sesión; su suficiencia requiere ensayo. Abre [la presentación aprobada](presentation/index.html) mediante el runtime del curso; no uses el número de fila del guion provisional como número de slide.

### Pausar y retomar sin saltos

Al terminar el tiempo registra en tu bitácora: bloque comprobado, bloque en curso, archivo y último cambio guardado, primera acción pendiente y evidencia ausente. No registres únicamente la última slide.

Ejemplo de registro, no de clase ya impartida: «B05 comprobado; B06 en curso; `app-header.tsx` creado, falta importarlo y reemplazar el `header` de `App`. Retomar preguntando por la conexión; pendiente DevTools y build de la extracción».

Al retomar:

1. Abre la misma copia y comprueba qué está guardado. No sobrescribas cambios estudiantiles con la referencia.
2. Recupera la última pantalla observable y la pregunta pendiente.
3. Completa la transformación y su comprobación antes del bloque siguiente.
4. Antes de props en 02, confirma una sola tarjeta fija y ambas extracciones. Si se usa un respaldo, pide explicar su diff y registra la actividad no realizada; cargar código no equivale a completarla.

No intentes introducir props para compensar una extracción incompleta. Conserva numeración y calendario y anota el desfase real para decidir después cómo recuperar tiempo.

### Consultar las referencias sin perder trabajo

Desde una copia limpia del repositorio docente puedes inspeccionar un cambio sin cambiar de rama:

```bash
git diff session-01-step-02-static-screen session-01-step-03-app-header -- src/App.tsx src/components/app-header.tsx
git diff session-01-step-03-app-header session-01-end -- src/App.tsx src/components/media-card.tsx
```

Para ejecutar una referencia en otra carpeta, desde `MediaLog-Bootcamp`:

```bash
git worktree add --detach ../MediaLog-Bootcamp-s01-demo session-01-step-02-static-screen
cd ../MediaLog-Bootcamp-s01-demo
pnpm install --frozen-lockfile
pnpm dev
```

Esa carpeta es una copia docente separada. No ejecutes el comando si ya existe; reutiliza conscientemente esa copia o elige una carpeta nueva. Guarda sus cambios antes de retirarla. El estudiante no necesita aprender worktrees para realizar esta clase.

## Preparación antes de la clase

### Entorno del docente

Comprueba Node `>=22.22.0`, pnpm `11.17.0` y la disponibilidad de React DevTools. Ten lista una carpeta vacía para construir con el grupo. Los comandos para crear y configurar el proyecto aparecen únicamente en S01-B03, después de la presentación continua; para un ensayo privado sigue esa misma secuencia.

### Material de contingencia

Prepara un ZIP privado con el estado posterior al scaffold y la instalación, antes de limpiar `App`. Incluye el lockfile y excluye `node_modules/`. Este ZIP permite continuar si el registro falla, pero no contiene `AppHeader` ni `MediaCard`.

Prepara también un segundo checkpoint privado con el template ya limpio y toda la pantalla estática dentro de `App`. Úsalo solo si la limpieza consume el tiempo asignado. No incluyas las extracciones que el grupo debe construir.

### Resultados del cuestionario

Antes de abrir la videollamada:

1. Revisa el porcentaje de aciertos de cada pregunta.
2. Elige la pregunta con más errores.
3. Prepara una explicación de un minuto ligada al primer bloque.
4. No repases las cinco preguntas una por una.

## Resultado observable

La sesión termina cuando:

```text
App
├── AppHeader
└── main
    └── MediaCard
```

Además:

- `pnpm dev` muestra la pantalla en el navegador.
- React DevTools muestra los tres componentes.
- `pnpm build` termina con código 0.
- El estudiante explica `index.html → main.tsx → App.tsx`.
- `MediaCard` conserva datos fijos y no recibe props.

## Secuencia docente

### 0–8 min · Apertura y recuperación

Presenta Medialog como producto del módulo: búsqueda pública y biblioteca personal de películas y series. Muestra el producto durante un minuto y vuelve al alcance de hoy: una pantalla estática con un encabezado y una tarjeta.

Pide al grupo ejecutar:

```bash
node --version
pnpm --version
```

Pregunta:

> ¿Qué problema tendríamos si cada persona crea el proyecto con herramientas incompatibles?

Respuesta esperada: los mismos comandos o dependencias pueden producir estructuras, errores o lockfiles distintos. No conviertas la respuesta en una explicación de semver.

Recupera la pregunta del cuestionario con mayor error. Si la mayoría falló el template, muestra la tabla de templates de Vite. Si falló componente frente a elemento, conserva ese contraste para la diapositiva 5.

**Checkpoint intermedio:** cada estudiante muestra Node `>=22.22.0` y pnpm `11.17.0`, o informa el error exacto y pasa al plan de contingencia.

### 8–20 min · Presentación conceptual

Continúa con las slides 3–9 del HTML aprobado después de las slides 1–2 de apertura. Termina el recorrido conceptual antes de abrir el editor. Las slides 8–9 anticipan los archivos y la transformación; su construcción se explica después sobre el código, sin volver a proyectarlas.

#### React y las herramientas

Explica con una oración por herramienta:

- React describe y compone la interfaz.
- Vite crea el proyecto, sirve el entorno de desarrollo y prepara el build.
- pnpm instala dependencias y ejecuta scripts.
- TypeScript comprueba tipos durante desarrollo y build.

Pregunta:

> Cuando ejecutemos `pnpm dev`, ¿qué herramienta administra paquetes y qué herramienta sirve la aplicación?

Respuesta esperada: pnpm ejecuta el script; ese script inicia Vite.

#### Componente y elemento JSX

Muestra:

```tsx
function MediaCard() {
  return <article>Arrival</article>
}

<MediaCard />
```

Pregunta:

> ¿Qué línea declara una función y qué línea describe su uso dentro de otra interfaz?

Respuesta esperada: `function MediaCard()` declara; `<MediaCard />` usa el componente y produce un elemento JSX.

Aclara que `article` comienza en minúscula porque representa una etiqueta del navegador. `MediaCard` comienza en mayúscula porque React debe tratarla como componente.

#### Responsabilidad y composición

Marca `AppHeader` y `MediaCard` en el mockup. Conserva `main` y el título dentro de `App`.

Pregunta:

> ¿Por qué extraeremos la tarjeta completa, pero no crearemos un componente para el título “Catálogo destacado”?

Respuesta esperada: la tarjeta representa un medio y forma una unidad reconocible; el título aislado no aporta reutilización ni una responsabilidad suficiente en este checkpoint.

#### JSX

Presenta tres reglas:

1. Un componente devuelve un contenedor raíz.
2. Todas las etiquetas se cierran.
3. En JSX se usa `className`.

No introduzcas expresiones complejas, renderizado condicional o spreads.

**Transición:** “Ya podemos nombrar el árbol. Ahora veremos qué archivos crea Vite y dónde comienza ese árbol”.

### Preguntar antes de escribir

Da primero unos segundos para pensar; pide una predicción por chat o una respuesta oral antes de revelar el código completo de la sección correspondiente.

| Bloque | Pregunta o pequeño desafío | Respuesta que permite continuar |
| --- | --- | --- |
| B03 | ¿Qué archivo permitirá instalar las mismas resoluciones? | `pnpm-lock.yaml`, acompañado de `package.json`. |
| B04 | Señala dónde existe `#root` y quién usa `<App />`. | `index.html` contiene el nodo; `main.tsx` monta el árbol. |
| B05 | Si aún no extraemos nada, ¿puede funcionar toda esta pantalla dentro de `App`? | Sí; primero observamos el comportamiento y luego reorganizamos responsabilidades. |
| B06 | Declaramos y exportamos `AppHeader`. ¿Por qué todavía vemos el encabezado antiguo? | Falta importar y usar el componente en `App`, reemplazando el bloque original. |
| B07 | Marca el fragmento exacto que moverías: ¿solo `h3` o todo `article`? | Todo `article`, porque representa un medio completo. |
| B07 | Ya existe el archivo de la tarjeta. Propón las dos líneas de conexión antes de ver la solución. | `import { MediaCard } from './components/media-card'` y `<MediaCard />` dentro de `main`. |
| B08 | Si aparece Arrival dos veces, ¿qué revisarías antes de cambiar CSS? | Que no queden juntos el `article` anterior y `<MediaCard />`. |

No presentes la respuesta esperada al mismo tiempo que la pregunta. Los bloques inferiores conservan el código íntegro para que puedas comprobar la propuesta sin improvisar imports ni archivos.

### 20–35 min · Scaffold e instalación

Ejecuta un comando por vez y explica su efecto antes de continuar:

```bash
pnpm create vite@9.2.0 MediaLog-Bootcamp --template react-ts --no-interactive
cd MediaLog-Bootcamp
pnpm pkg set name=medialog-bootcamp packageManager=pnpm@11.17.0
pnpm pkg set devDependencies.typescript=6.0.3 devDependencies.vite=8.2.2
pnpm pkg set 'engines.node=>=22.22.0'
pnpm pkg set dependencies.react=19.2.8 'dependencies["react-dom"]'=19.2.8
pnpm install
pnpm dev
```

Pide verificar:

```bash
pnpm pkg get packageManager
pnpm pkg get dependencies.react 'dependencies["react-dom"]'
```

Explica:

- `create-vite@9.2.0` fija el generador de la cohorte.
- `react-ts` selecciona React con TypeScript.
- `packageManager` registra pnpm `11.17.0`.
- `name` registra `medialog-bootcamp`; la carpeta conserva `MediaLog-Bootcamp`.
- Vite `8.2.2` y TypeScript `6.0.3` fijan las herramientas del checkpoint; `engines.node` documenta el mínimo de la cohorte.
- `pnpm pkg set` reemplaza los rangos del template por las versiones exactas de React y React DOM antes de instalar.
- `pnpm-lock.yaml` registra las resoluciones completas.

No presentes el lockfile como garantía de seguridad. Solo explica que conserva las versiones resueltas para instalaciones reproducibles.

Pregunta:

> ¿Qué archivo debemos conservar si otra persona instalará el mismo proyecto?

Respuesta esperada: `pnpm-lock.yaml`, junto con `package.json`.

**Checkpoint intermedio:** el template abre en el navegador y `package.json` muestra las versiones aprobadas.

### 35–45 min · Recorrido del punto de entrada

Abre los archivos en este orden:

1. `package.json`.
2. `index.html`.
3. `src/main.tsx`.
4. `src/App.tsx`.

En `package.json`, localiza `dev` y `build`. En `index.html`, señala `<div id="root"></div>` y el módulo `/src/main.tsx`. En `main.tsx`, señala `createRoot`, `StrictMode` y `<App />`.

Explica `StrictMode` con este límite:

> Envuelve el árbol para activar comprobaciones adicionales durante desarrollo. No dibuja una sección visible y no cambia el comportamiento del build de producción.

No expliques todavía doble render, Effects o callbacks de refs.

Dibuja:

```text
index.html
└── #root
    └── main.tsx
        └── App
```

Pregunta:

> Si queremos reemplazar la pantalla demostrativa, ¿qué archivo contiene hoy esa interfaz?

Respuesta esperada: `src/App.tsx`.

**Transición:** “Primero construiremos una pantalla legible en un solo componente. Después aparecerán las dos responsabilidades que extraeremos”.

### 45–57 min · Pantalla estática dentro de App

Retira de `App.tsx`:

- `useState`;
- imports de imágenes;
- import de `App.css`;
- contador y enlaces demostrativos.

Elimina `src/App.css` y los assets generados que ya no se importan mediante el explorador del editor. Conserva `src/index.css`.

En el template comprobado, retira `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg` y `public/favicon.svg` después de quitar sus consumidores. En `index.html`, retira el `link` de favicon, cambia `lang` a `es` y el título a `MediaLog Bootcamp`. Conserva `#root` y el script de entrada. Es limpieza del template; no requiere otra explicación de React.

Escribe todo dentro de `App`:

```tsx
function App() {
  return (
    <>
      <header className="app-header">
        <p className="app-header__eyebrow">Medialog</p>
        <h1>Tu próxima historia empieza aquí</h1>
        <p>Explora películas y series y organiza tu biblioteca personal.</p>
      </header>

      <main className="page-container">
        <h2>Catálogo destacado</h2>

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
      </main>
    </>
  )
}

export default App
```

Reemplaza `src/index.css` con el bloque de soporte visual:

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

Los estudiantes copian los estilos. No expliques layout, media queries o metodología de clases CSS.

Pregunta:

> ¿Qué dos regiones de `App` podemos nombrar sin mirar sus etiquetas internas?

Respuesta esperada: el encabezado de la aplicación y la tarjeta de un medio.

### 57–67 min · Demostración: extraer AppHeader

Crea `src/components/app-header.tsx`:

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

En `App.tsx`, importa y usa:

```tsx
import { AppHeader } from './components/app-header'
```

```tsx
<AppHeader />
```

Narra cinco decisiones:

1. El archivo usa `kebab-case`.
2. La función usa `PascalCase`.
3. La función vive al nivel superior del módulo.
4. El archivo exporta la función.
5. `App` importa la función y usa un elemento JSX.

Abre React DevTools y localiza `AppHeader` debajo de `App`.

Antes de continuar, `src/App.tsx` debe quedar así. La tarjeta permanece inline; esta es la referencia intermedia, no el resultado de la práctica guiada:

```tsx
import { AppHeader } from './components/app-header'

function App() {
  return (
    <>
      <AppHeader />

      <main className="page-container">
        <h2>Catálogo destacado</h2>

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
      </main>
    </>
  )
}

export default App
```

Error controlado: cambia temporalmente `<AppHeader />` por `<appHeader />`. Pide leer el error del editor y explica que minúscula identifica una etiqueta del navegador. Corrige antes de continuar.

**Checkpoint intermedio:** `AppHeader` aparece en el navegador y en React DevTools.

### 67–78 min · Construcción guiada: extraer MediaCard

Antes de editar, pide al grupo describir el bloque que debe moverse. La respuesta debe incluir el `article` completo, no solo el título.

Crea `src/components/media-card.tsx` con las propuestas del grupo:

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

Completa en `App.tsx`:

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

Pregunta antes de cada cambio:

- ¿Qué debe exportar el archivo nuevo?
- ¿Qué ruta debe importar `App`?
- ¿En qué posición se usa `<MediaCard />`?
- ¿Qué responsabilidad conserva `App`?

Respuestas esperadas:

- La función `MediaCard`.
- `./components/media-card`.
- Dentro de `main`, después del título de sección.
- Componer la pantalla y conservar la estructura principal.

**Checkpoint intermedio:** la pantalla no cambia visualmente y React DevTools añade `MediaCard`.

### 78–85 min · Actividad individual

Pide tres acciones:

1. Cambiar el texto secundario de `AppHeader` sin modificar `App`.
2. Cambiar título, año y descripción fija de `MediaCard`.
3. Quitar el cierre de una etiqueta, leer el error y repararlo.

Después, cada estudiante escribe:

```text
App
├── AppHeader
└── main
    └── MediaCard
```

Recorre salas o pide compartir pantalla a dos estudiantes. No agregues otra extracción.

Errores frecuentes:

| Error | Intervención docente |
| --- | --- |
| El estudiante define `MediaCard` dentro de `App`. | Mueve la función al nivel superior y recuerda que el componente tiene módulo propio. |
| Falta el export o el import. | Sigue la cadena desde el archivo que declara hasta el archivo que usa. |
| El nombre comienza en minúscula. | Contrasta `<article>` con `<MediaCard />`. |
| El estudiante duplica el `article` y además usa `<MediaCard />`. | Conserva una sola fuente de la tarjeta y retira el bloque antiguo. |
| El estudiante intenta añadir props. | Registra la idea como respuesta a la limitación y resérvala para la sesión 02. |

### 85–90 min · Comprobación y cierre

Mantén `pnpm dev` en la primera terminal. Abre otra terminal en `MediaLog-Bootcamp` y ejecuta:

```bash
pnpm build
```

Pide a un estudiante compartir React DevTools y a otro explicar:

```text
index.html → main.tsx → App.tsx → AppHeader / MediaCard
```

Aclara la frontera:

- El build con código 0 comprueba TypeScript y la generación de `dist/`.
- El navegador comprueba el resultado visual del servidor de desarrollo.
- React DevTools comprueba el árbol de componentes montado.
- Ninguna evidencia demuestra todavía props, estado, API o producción desplegada.

Formula oralmente las cuatro preguntas conservadas en la slide 10, sin volver al deck:

1. ¿Cuál es la responsabilidad de App?
2. ¿Qué diferencia hay entre declarar y usar un componente?
3. ¿Cómo llega React desde #root hasta App?
4. ¿Qué limita a una tarjeta cuyos datos están escritos directamente?

Recoge respuestas breves ligadas al código construido; no añadas otro repaso completo del guion histórico. Termina con:

> Nuestra tarjeta ya tiene una responsabilidad propia, pero solo puede mostrar Arrival. La sesión 02 resolverá esa limitación sin duplicar su estructura.

## Preguntas docentes y respuestas esperadas

| Momento | Pregunta | Respuesta esperada |
| --- | --- | --- |
| Apertura | ¿Qué herramienta administra paquetes? | pnpm. |
| Presentación | ¿Qué diferencia hay entre `MediaCard` y `<MediaCard />`? | El primero nombra la función; el segundo usa el componente como elemento JSX. |
| Presentación | ¿Por qué no extraemos cada etiqueta? | Una extracción necesita una responsabilidad reconocible, reutilización o una mejora clara de lectura. |
| Scaffold | ¿Qué conserva las versiones resueltas? | `pnpm-lock.yaml`. |
| Recorrido | ¿Qué archivo monta `App` en `#root`? | `src/main.tsx`. |
| Demostración | ¿Por qué `AppHeader` comienza en mayúscula? | React distingue componentes de etiquetas HTML mediante el nombre. |
| Práctica guiada | ¿Qué conserva `App` después de extraer la tarjeta? | La composición y la estructura principal de la pantalla. |
| Cierre | ¿Qué problema tiene la tarjeta fija? | No puede representar medios diferentes sin cambiar o duplicar su implementación. |

## Clave privada del cuestionario previo

### Pregunta 1

- **Respuesta:** B.
- **Justificación:** Un componente es una función de JavaScript que devuelve la interfaz de una parte de la aplicación.
- **Fuente:** React, `Your First Component` → `Components: UI building blocks` y `Defining a component`.

### Pregunta 2

- **Respuesta:** Verdadero.
- **Justificación:** React usa la mayúscula inicial para distinguir un componente de una etiqueta HTML escrita en minúscula.
- **Fuente:** React, `Your First Component` → `Defining a component` y `What the browser sees`.

### Pregunta 3

- **Respuesta:** C.
- **Justificación:** `<Profile />` muestra el componente `Profile` dentro del JSX de otro componente.
- **Fuente:** React, `Your First Component` → `Using a component`.

### Pregunta 4

- **Respuesta:** B, `react-ts`.
- **Justificación:** Vite ofrece `react-ts` como la plantilla que combina React y TypeScript.
- **Fuente:** Vite, `Getting Started` → `Scaffolding Your First Vite Project`.

### Pregunta 5

- **Respuesta:** C.
- **Justificación:** Vite incluye un servidor de desarrollo y un comando de build. No administra autenticación ni estado remoto.
- **Fuente:** Vite, `Getting Started` → `Overview`.

## Plan de contingencia detallado

### Fallo de versión

No cambies el requisito de Node durante la clase. El estudiante registra:

- comando ejecutado;
- versión observada;
- error completo;
- sistema operativo.

Después usa el checkpoint del docente para seguir el flujo de componentes. La instalación correcta queda como requisito de recuperación.

### Fallo de red o registro

Entrega el ZIP posterior al scaffold. Pide verificar `package.json` y `pnpm-lock.yaml` antes de continuar. Informa que trabajar desde el ZIP no demuestra que esa persona ejecutó el scaffold.

### Fallo del servidor de desarrollo

Comprueba en orden:

1. La terminal está dentro de `MediaLog-Bootcamp`.
2. `pnpm install` terminó sin error.
3. El puerto mostrado por Vite coincide con la URL abierta.
4. El primer error de compilación señala un archivo concreto.

No reinstales todas las dependencias ni borres el lockfile como primera respuesta.

### Demora durante la limpieza

Entrega el checkpoint con la pantalla completa dentro de `App`. El grupo todavía debe extraer `AppHeader` y `MediaCard`; esas decisiones forman el objetivo principal.

### React DevTools ausente

Usa el código fuente para reconstruir el árbol y las herramientas del navegador para comprobar el DOM. Marca la evidencia de DevTools como no demostrada y recupera esa instalación antes de la sesión 02.

## Lista de cierre docente

- [ ] Los bloques sumaron 90 minutos.
- [ ] El grupo creó o inspeccionó el scaffold exacto.
- [ ] `packageManager` y React quedaron fijados.
- [ ] No se explicó ni conservó `useState`.
- [ ] `AppHeader` fue demostración y `MediaCard` práctica guiada.
- [ ] La actividad individual no repitió una extracción.
- [ ] React DevTools mostró el árbol o se registró su ausencia.
- [ ] `pnpm build` terminó con código 0 o se conservó el error exacto.
- [ ] El cierre nombró la necesidad de props sin implementarlas.
- [ ] La clave del cuestionario permaneció fuera del material estudiantil.
