# Guía docente · Sesión 09 · React Router declarativo

## Objetivo docente

Conducir al grupo desde una búsqueda remota sin destino hasta un árbol de rutas públicas que conserva esa búsqueda, comparte layout y produce una página provisional desde parámetros validados. Al cerrar, cada estudiante debe poder explicar qué resuelve Router, dónde renderiza `Outlet` y por qué `useParams()` no devuelve un tipo del dominio.

### Analogía pedagógica que debes usar

Presenta la URL como una dirección y el Router como el mapa que decide qué pantalla corresponde. En `/media/movie/438631`, `media` es una calle fija y los segmentos dinámicos se parecen a datos escritos en la dirección. `Outlet` es el espacio reservado dentro de un edificio compartido donde se instala la oficina correspondiente a la ruta hija.

Aclara el límite: que una dirección tenga la forma correcta no prueba que sus datos pertenezcan al dominio. `/media/anime/438631` coincide con el patrón de segmentos, pero el adapter debe rechazar `anime` porque MediaLog solo acepta `movie` o `series`.

## Resultado observable

El seed final permite:

- abrir `/` y llegar a `/search` sin conservar una entrada redundante en el historial;
- buscar y usar `Ver detalle` desde una tarjeta;
- abrir `/media/movie/<id>` o `/media/series/<id>` en otra pestaña;
- rechazar `/media/anime/<id>` como identidad de dominio inválida;
- mostrar `NotFoundPage` para `/media/movie` y paths desconocidos;
- volver a búsqueda mediante `Link`;
- ejecutar tests puros del adapter y un build exitoso.

La página todavía no solicita datos de detalle.

## Preparación docente

### Revisa el checkpoint 08

Antes de la clase, abre el seed y confirma:

- `main.tsx` conserva `StrictMode`, `QueryClientProvider`, Mantine y Devtools;
- `QueryClient` se crea fuera de los componentes;
- `App` contiene la pantalla remota completa;
- `MediaSearchResults` recibe `MediaSearchCardModel[]`;
- cada item conserva `mediaType` y `externalId`;
- no existe `onSelect`, modal remoto ni query de detalle activa;
- `GetMediaDetailInput` ya está definido;
- `AppHeader` continúa en `src/components/app-header.tsx` aunque la pantalla remota no lo use;
- `pnpm test` y `pnpm build` terminan en 0.

No impartas la clase desde un checkpoint que aún abra un modal remoto. Ese estado pertenece a la fuente histórica y contradice la sesión 08 migrada.

### Verifica compatibilidad

La referencia de esta guía es:

```bash
node --version
pnpm --version
pnpm view react-router@8.3.1 version engines peerDependencies
```

Espera:

- React Router `8.3.1`;
- Node `>=22.22.0`;
- React y React DOM `>=19.2.7`;
- React `19.2.8` en el checkpoint del curso.

Si el manifiesto o la documentación cambiaron, no actualices versiones durante la clase. Prepara el ajuste y sus consumidores antes de distribuir el seed.

### Fuentes docentes

- [Picking a Mode](https://reactrouter.com/start/modes)
- [Declarative Installation](https://reactrouter.com/start/declarative/installation)
- [Routing](https://reactrouter.com/start/declarative/routing)
- [Navigating](https://reactrouter.com/start/declarative/navigating)
- [URL Values](https://reactrouter.com/start/declarative/url-values)
- [Single Page App](https://reactrouter.com/how-to/spa)
- [Changelog](https://reactrouter.com/start/start/changelog)

Verificación documental: 31 de agosto de 2026. Context7 MCP y el índice Mintlify no estuvieron disponibles durante la producción de esta guía; se usaron documentación oficial y el manifiesto npm como fallback.

### Prepara estados de respaldo

Conserva dos ZIP privados, sin `node_modules` ni `.env.local`:

1. checkpoint 08 listo para iniciar;
2. checkpoint 09 terminado.

Prepara también una response de búsqueda conocida o una captura del resultado. El Router puede enseñarse aunque el backend esté caído, pero el grupo necesita ver un item con `mediaType + externalId` para comprender el `Link`.

### Prepara el uso del agente

La tarea delegada solo crea:

```text
src/adapters/__tests__/media-detail-route-params-to-input.test.ts
```

Comprueba antes que tu agente puede limitarse a un archivo. Conserva el fallback manual de tests. La clase no espera a una herramienta bloqueada.

## Frontera pedagógica

La dificultad central es navegación declarativa. Mantén fuera:

- fetching de detalle;
- adaptación y presentación de `MediaDetailDto`;
- `document.title` y Effects;
- loaders, actions y Data Mode;
- persistencia del formulario en query params;
- guardias y autenticación;
- tests de componentes o Router.

La sesión 10 recibirá `GetMediaDetailInput | null` y conectará el recurso remoto. No muestres ese hook como avance.

## Mapa conceptual para la pizarra

```text
React Router
  URL → página

TanStack Query
  query key → datos remotos

adapter
  string | undefined → GetMediaDetailInput | null
```

Pregunta durante toda la sesión: “¿Quién es propietario de esta decisión?”. Si alguien propone un loader, devuelve la pregunta a la tabla.

## Secuencia detallada

### 0–18 min · Presentación continua

Proyecta todas las diapositivas antes de abrir el editor. La recuperación, la analogía de direcciones y el modo declarativo se explican en este recorrido único. No instales Router ni cambies archivos durante la presentación.

**Apoyo visual opcional, después del deck y antes del coding:** [Animación 01 · Router y navegación](01-animacion-router-navegacion/README.md). Sustituye parte de la explicación dentro de estos 18 minutos. En 05–07 sigue el enlace hasta la URL; en 08–14 relaciona patrón, parámetros, adapter y Outlet; en 15–17 contrasta Atrás/Adelante con un nuevo Link. Al volver, SearchPage se monta con sus estados locales vacíos: Router no restaura el formulario. Pregunta si `anime` puede coincidir con el patrón: sí, pero falla la validación del dominio. El README incluye respuestas y casos alternativos. Es un simulador reversible, sin ejecutar Router ni solicitar detalle remoto. Después continúa con el coding, sin volver al deck.

#### Recuperar la necesidad

Abre `/search`, envía una búsqueda válida y elige una tarjeta.

Pregunta:

> ¿Qué URL puedo copiar para que otra persona abra este resultado?

Respuesta esperada: ninguna. La tarjeta muestra identidad, pero todavía no declara un destino.

Prueba que `mediaType` y `externalId` sí están disponibles en React DevTools o en el modelo visual. No abras el panel Network para explicar Router; esa evidencia pertenece a la query anterior.

Escribe el cambio del día:

```text
antes: resultado visible
después: resultado navegable mediante URL
```

Transición: la identidad ya existe. Falta relacionarla con una pantalla.

#### Teoría: URL, ruta y modo declarativo

Define SPA sin entrar en servidores:

> Una SPA puede cambiar la pantalla desde JavaScript y conservar el documento actual. El Router observa la ubicación y decide qué elemento corresponde.

Dibuja:

```text
/search                         → SearchPage
/media/movie/123                → MediaDetailPage
/media/series/456               → MediaDetailPage
/algo-que-no-existe             → NotFoundPage
```

Explica los tres modos de React Router:

| Modo | Aporte relevante | Decisión del curso |
| --- | --- | --- |
| Declarative | Matching, navegación, params e historial | Sí |
| Data | Loaders, actions y estados de datos | No |
| Framework | Convenciones y tooling de framework | No |

Pregunta:

> Si TanStack Query ya administra búsqueda, errores y caché, ¿qué problema debe resolver Router?

Respuesta esperada: relacionar URL, historial y página. No repetir fetching.

Presenta segmentos fijos y dinámicos:

```text
/media/:mediaType/:externalId
```

- `media` es fijo;
- `:mediaType` captura texto;
- `:externalId` captura texto.

Aclara que `useParams()` produce strings posiblemente ausentes. La coincidencia sintáctica no valida el dominio: `/media/anime/123` coincide con el patrón, pero `anime` no pertenece a `MediaType`.

### 18–28 min · Instalar y colocar `BrowserRouter`

Ejecuta con el grupo:

```bash
pnpm add react-router@8.3.1
```

Abre `src/main.tsx`. Añade:

```tsx
import { BrowserRouter } from "react-router"
```

Conserva los providers y envuelve solo `App`:

```tsx
<QueryClientProvider client={queryClient}>
  <MantineProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

Narra dos decisiones:

1. `BrowserRouter` necesita abarcar los componentes que usan rutas y navegación.
2. El cambio no recrea `QueryClient` ni mueve Devtools dentro de una página.

Ejecuta la aplicación y comprueba que la búsqueda todavía aparece. No declares rutas aún; este checkpoint separa un error de provider de un error de árbol.

Pregunta:

> ¿Instalamos `react-router-dom`?

Respuesta esperada: no. La versión fijada expone estas APIs desde `react-router`.

### 28–38 min · Extraer `SearchPage`

Crea `src/pages/search-page.tsx`. Mueve desde `App`:

- imports de React y Mantine usados por la pantalla;
- `draftQuery`, `draftMediaType` y `submittedSearch`;
- `useMediaSearch()` y el adapter visual;
- `handleSubmit()`;
- la función local que representa estados de búsqueda, si existe;
- el JSX completo del contenedor.

Renombra la función:

```tsx
export function SearchPage() {
  // contenido que antes pertenecía a App
}
```

Durante este estado intermedio, reduce `App` a:

```tsx
import { SearchPage } from "./pages/search-page"

export default function App() {
  return <SearchPage />
}
```

Comprueba:

- input y select conservan valores controlados;
- un submit válido ejecuta la misma query;
- los cinco estados remotos siguen representados;
- no apareció un segundo estado ni otro provider.

Pregunta:

> ¿Por qué movemos antes de declarar rutas?

Respuesta esperada: para comprobar la extracción sin mezclarla con matching o layouts.

Transición: ya existe una página concreta que el Router puede seleccionar.

### 38–51 min · Layout y error controlado de `Outlet`

Crea `src/layouts/public-layout.tsx` sin `Outlet` durante la primera ejecución:

```tsx
import { AppHeader } from "../components/app-header"

export function PublicLayout() {
  return (
    <>
      <AppHeader />
      <main />
    </>
  )
}
```

Declara temporalmente en `App`:

```tsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route path="search" element={<SearchPage />} />
  </Route>
</Routes>
```

Visita `/search`. El encabezado aparece y la página hija no.

Pregunta:

> ¿Falló la coincidencia o falta un lugar para renderizar la hija?

Respuesta esperada: la ruta padre coincidió; el layout no incluyó `Outlet`.

Corrige:

```tsx
import { Outlet } from "react-router"
import { AppHeader } from "../components/app-header"

export function PublicLayout() {
  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </>
  )
}
```

Aclara:

- `Outlet` no es wildcard;
- `Outlet` no recibe la página como prop;
- `Outlet` no abre un portal;
- el árbol de rutas determina qué hija coloca allí.

Checkpoint intermedio: `AppHeader` y `SearchPage` aparecen una vez.

### 51–63 min · Completar el árbol

Crea `src/pages/not-found-page.tsx`:

```tsx
import { Anchor, Container, Stack, Text, Title } from "@mantine/core"
import { Link } from "react-router"

export function NotFoundPage() {
  return (
    <Container py="xl" size="sm">
      <Stack>
        <Title order={1}>Página no encontrada</Title>
        <Text>La URL no coincide con una página pública.</Text>
        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

Crea primero una página provisional mínima para poder importarla:

```tsx
export function MediaDetailPage() {
  return <h1>Detalle provisional</h1>
}
```

Completa `src/App.tsx`:

```tsx
import { Navigate, Route, Routes } from "react-router"

import { PublicLayout } from "./layouts/public-layout"
import { MediaDetailPage } from "./pages/media-detail-page"
import { NotFoundPage } from "./pages/not-found-page"
import { SearchPage } from "./pages/search-page"

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate replace to="/search" />} />
        <Route path="search" element={<SearchPage />} />
        <Route
          path="media/:mediaType/:externalId"
          element={<MediaDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

Explica `replace`: entrar a `/` reemplaza esa entrada por `/search`, por lo que Atrás no alterna entre una raíz vacía y la búsqueda.

Prueba:

| URL | Resultado actual |
| --- | --- |
| `/` | Redirección a `/search` |
| `/search` | Búsqueda |
| `/media/movie/123` | Detalle provisional mínimo |
| `/media/movie` | Not found |
| `/otra` | Not found |

### 63–76 min · Params, adapter y `Link`

Entrega la matriz antes de escribir código:

| `mediaType` | `externalId` | Resultado |
| --- | --- | --- |
| `movie` | `123` | input movie |
| `series` | `456` | input series |
| `anime` | `123` | `null` |
| `movie` | ausente | `null` |
| ausente | `123` | `null` |

Crea manualmente `src/adapters/media-detail-route-params-to-input.ts`:

```ts
import type { GetMediaDetailInput } from "../types/media-api"

export type MediaDetailRouteParams = Readonly<{
  externalId?: string
  mediaType?: string
}>

export function toMediaDetailInput(
  params: MediaDetailRouteParams,
): GetMediaDetailInput | null {
  if (params.mediaType !== "movie" && params.mediaType !== "series") {
    return null
  }

  if (params.externalId === undefined) {
    return null
  }

  return {
    externalId: params.externalId,
    mediaType: params.mediaType,
  }
}
```

En `MediaDetailPage`, usa el adapter:

```tsx
import { Anchor, Container, Stack, Text, Title } from "@mantine/core"
import { Link, useParams } from "react-router"

import { toMediaDetailInput } from "../adapters/media-detail-route-params-to-input"

export function MediaDetailPage() {
  const detailInput = toMediaDetailInput(useParams())

  if (detailInput === null) {
    return (
      <Container py="xl" size="sm">
        <Stack>
          <Title order={1}>URL de detalle no válida</Title>
          <Text>Revisa el tipo y el identificador del medio.</Text>
          <Anchor component={Link} to="/search">
            Volver a la búsqueda
          </Anchor>
        </Stack>
      </Container>
    )
  }

  return (
    <Container py="xl" size="sm">
      <Stack>
        <Title order={1}>Detalle provisional</Title>
        <Text>Tipo: {detailInput.mediaType}</Text>
        <Text>Identificador: {detailInput.externalId}</Text>
        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

No llames todavía `useMediaDetail`. El input visible es el checkpoint.

Abre `MediaSearchResults` y añade imports:

```tsx
import { Button } from "@mantine/core"
import { Link } from "react-router"
```

Dentro de la tarjeta agrega:

```tsx
<Button
  component={Link}
  to={`/media/${item.mediaType}/${item.externalId}`}
  variant="light"
>
  Ver detalle
</Button>
```

Pide abrir el destino con click normal y en otra pestaña. Contrasta `Link` con `window.location`: `Link` integra la navegación de la aplicación y conserva la semántica de enlace; no necesitamos un handler para asignar la URL.

Checkpoint intermedio: un resultado real abre su página provisional y muestra la misma identidad.

### 76–86 min · Agente acotado y navegación manual

Las decisiones ya están cerradas. Entrega este prompt:

```text
Usa la skill ahk-test para crear y ejecutar los tests unitarios del adapter puro toMediaDetailInput.

Matriz acordada:
- la implementación vive en src/adapters/media-detail-route-params-to-input.ts
- movie con externalId devuelve el mismo GetMediaDetailInput
- series con externalId devuelve el mismo GetMediaDetailInput
- mediaType distinto de movie o series devuelve null
- externalId ausente devuelve null
- mediaType ausente devuelve null

Alcance:
- crear únicamente src/adapters/__tests__/media-detail-route-params-to-input.test.ts
- no modificar el adapter ni ningún otro archivo
- no cambiar package.json, scripts, dependencias o configuración
- no añadir React Testing Library, jsdom, mocks de Router ni tests de componentes
- no crear helpers o snapshots

Ejecuta pnpm test. Si un import o contrato no coincide, detente antes de escribir. Entrega matriz, archivo modificado, resultado con exit status y frontera de evidencia.
```

Revisión obligatoria:

```bash
git diff -- src/adapters/__tests__/media-detail-route-params-to-input.test.ts
git status --short
pnpm test
```

Cada estudiante lee el archivo completo y asigna un caso de la matriz a cada test. Si el agente tocó otro archivo, revierte solo su cambio autorizado con un método seguro o restaura el checkpoint de respaldo; no aceptes una expansión silenciosa.

Mientras termina el test, comprueba manualmente:

1. `/search` → detalle por click.
2. Atrás → vuelve a búsqueda.
3. Adelante → vuelve al detalle.
4. Abrir el enlace en otra pestaña conserva el pathname.
5. `/media/anime/123` muestra URL inválida.
6. `/media/movie` muestra Not found.

La prueba pura no demuestra esos seis recorridos. Registra ambos tipos de evidencia por separado.

### 86–90 min · Cierre y build

Ejecuta:

```bash
pnpm build
```

Si usas preview para observar una recarga local:

```bash
pnpm preview
```

Aclara que preview no demuestra el fallback de un hosting estático. En producción, una solicitud directa a `/media/movie/123` necesita llegar al documento de la SPA; la sesión 18 configurará y verificará ese comportamiento.

Pregunta de cierre:

> ¿Qué tiene que estar listo antes de pedir el detalle remoto?

Respuesta esperada: una URL coincidente y un `GetMediaDetailInput` válido o `null`.

Escribe el puente:

```text
sesión 09: URL → input válido
sesión 10: input válido → query → contenido → document.title
```

## Preguntas durante la clase

| Momento | Pregunta | Respuesta esperada |
| --- | --- | --- |
| Apertura | ¿Qué identidad ya conserva una tarjeta? | `mediaType + externalId`. |
| Teoría | ¿Router debe reemplazar `useMediaSearch`? | No; Router elige página y Query administra datos. |
| Provider | ¿Qué componentes deben vivir bajo `BrowserRouter`? | Los que usan rutas, navegación o valores de URL. |
| Extracción | ¿Mover código a `SearchPage` cambia su propietario? | No; solo crea una frontera de página. |
| Layout | ¿Quién entrega el elemento que aparece en `Outlet`? | El árbol de rutas según la coincidencia actual. |
| Params | ¿Por qué no usar `as MediaType`? | La URL puede contener cualquier string; hace falta validación runtime. |
| Navegación | ¿Por qué `Link` en lugar de un botón con `window.location`? | Declara un destino navegable y conserva capacidades del enlace. |
| Evidencia | ¿Qué demuestra Vitest? | Solo la traducción pura de params. |
| Cierre | ¿Qué queda para la sesión 10? | Query, estados, contenido y Effect del título. |

## Errores frecuentes e intervención

| Síntoma | Diagnóstico | Intervención |
| --- | --- | --- |
| La pantalla queda vacía en `/search` | Falta `Outlet` | Mostrar que el layout sí coincide y ubicar la región hija. |
| `useParams` devuelve `undefined` | El patrón no contiene o no recibió el segmento | Comparar pathname y path de la ruta. |
| Se acepta `anime` mediante assertion | Se trató un string externo como tipo confiable | Volver a la matriz y ejecutar el adapter. |
| Aparece otra definición de `MediaType` | Se duplicó el dominio | Importar `GetMediaDetailInput` y conservar la fuente original. |
| La raíz acumula `/` y `/search` | Falta `replace` | Revisar la intención del redirect inicial. |
| El encabezado aparece dos veces | `SearchPage` conservó `AppHeader` | Dejar estructura compartida solo en `PublicLayout`. |
| La búsqueda dejó de funcionar tras moverla | Extracción incompleta | Comparar el estado intermedio antes de añadir rutas. |
| Se crea un loader | Se mezcló Data Mode con el modo elegido | Retirar el loader; Query seguirá siendo propietario del dato. |
| Se usa `useNavigate` para la tarjeta | Se modeló un enlace como evento | Usar `Link` con un destino visible. |
| El agente modifica el adapter | Prompt o cumplimiento fuera de alcance | Detener la aceptación y conservar la implementación humana. |
| Una recarga en hosting devuelve 404 | Falta fallback de SPA | Registrar la limitación; resolverla en despliegue, no con otro Router. |

## Plan de contingencia

### npm no responde

Usa el ZIP con la dependencia ya instalada y muestra el comando que se ejecutó. No cambies a npm o yarn y no retires el lockfile.

### El backend no responde

Usa un checkpoint con una búsqueda ya observada, una response preparada o navega con `/media/movie/123`. Explica que Router no depende de una nueva request de detalle en esta sesión.

### El agente no está disponible

Escribe manualmente el archivo de tests con la matriz ya aprobada. La herramienta no es objetivo de aprendizaje de Router.

### La extracción consume demasiado tiempo

Entrega `SearchPage` ya extraída y pide al grupo comparar el diff. Conserva la demostración de `Outlet`, la validación y el `Link`; son los conceptos de la sesión.

### El preview local no acepta deep links

Comprueba primero navegación desde `/search`. Registra el límite del servidor local. No cambies a hash routing ni añadas configuración de despliegue durante la clase.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** C. Declarative Mode.
- **Justificación:** Declarative Mode ofrece rutas, enlaces y parámetros sin introducir loaders ni actions.
- **Fuente:** React Router, Picking a Mode, sección Declarative.

### Pregunta 2

- **Respuesta:** Verdadero.
- **Justificación:** una layout route puede aportar estructura sin añadir un segmento al pathname.
- **Fuente:** React Router, Routing, sección Layout Routes.

### Pregunta 3

- **Respuesta:** B. `Outlet`.
- **Justificación:** `Outlet` indica el lugar donde se muestra la ruta hija activa.
- **Fuente:** React Router, Routing, sección Nested Routes.

### Pregunta 4

- **Respuesta:** C. Un segmento dinámico.
- **Justificación:** el prefijo `:` nombra una parte del path que se captura como parámetro.
- **Fuente:** React Router, Routing, sección Dynamic Segments.

### Pregunta 5

- **Respuesta:** Verdadero.
- **Justificación:** `Link` declara el destino de navegación dentro de la aplicación.
- **Fuente:** React Router, Routing, sección Linking.

## Evidencia de salida

Solicita:

1. captura o demostración de `/search` con un resultado;
2. captura o demostración de una URL válida de detalle provisional;
3. captura o demostración de `/media/anime/123` rechazada;
4. salida de `pnpm test` con exit 0;
5. salida de `pnpm build` con exit 0;
6. explicación oral de la diferencia entre `Outlet` y `*`.

No pidas `.env.local`, contenido del backend ni un ZIP con `node_modules`.

## Lista de cierre docente

- [ ] Los bloques sumaron 90 minutos.
- [ ] El checkpoint 08 se conservó antes de integrar Router.
- [ ] `AppHeader` aparece una vez.
- [ ] `App` solo declara rutas.
- [ ] `SearchPage` conserva la query anterior.
- [ ] `Link` y params se enseñaron en esta sesión.
- [ ] El adapter devuelve `GetMediaDetailInput | null` sin assertions.
- [ ] El agente solo redactó tests.
- [ ] Se ejecutaron test y build.
- [ ] Se diferenciaron evidencia pura, navegación local y hosting.
- [ ] No se mostró la solución de la sesión 10.


## Ruta ejecutable y referencia autosuficiente

Esta es la secuencia real de ramas del proyecto progresivo:

`session-09-start` → `session-09-step-01-browser-router` → `session-09-step-02-search-page` → `session-09-step-03-public-routes` → `session-09-step-04-route-params` → `session-09-end`

La rama `session-09-end` es el checkpoint completo. Cada rama intermedia compila y permite retomar la demostración desde una transformación concreta. Los archivos que no aparecen aquí se conservan sin cambios desde la sesión anterior.

Ejecuta la instalación de esta sesión exactamente así:

```bash
pnpm add --save-exact react-router@8.3.1
```

El lockfile lo genera pnpm. No lo escribas a mano. A continuación están **completos** todos los archivos que el docente o el estudiante debe crear o reemplazar durante la sesión; no hace falta abrir el repositorio de referencia en otra ventana.

### `package.json` · archivo completo

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
    "test": "vitest run",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mantine/core": "9.4.1",
    "@mantine/hooks": "9.4.1",
    "@tanstack/react-query": "5.102.8",
    "@tanstack/react-query-devtools": "5.102.8",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-router": "8.3.1"
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
    "vite": "8.2.2",
    "vitest": "4.1.11"
  }
}
```

### `src/main.tsx` · archivo completo

```tsx
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

### `src/App.tsx` · archivo completo

```tsx
import { Navigate, Route, Routes } from 'react-router'

import { PublicLayout } from './layouts/public-layout'
import { MediaDetailPage } from './pages/media-detail-page'
import { NotFoundPage } from './pages/not-found-page'
import { SearchPage } from './pages/search-page'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate replace to="/search" />} />
        <Route path="search" element={<SearchPage />} />
        <Route
          path="media/:mediaType/:externalId"
          element={<MediaDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

### `src/layouts/public-layout.tsx` · archivo completo

```tsx
import { Outlet } from 'react-router'

import { AppHeader } from '../components/app-header'

export function PublicLayout() {
  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </>
  )
}
```

### `src/pages/search-page.tsx` · archivo completo

```tsx
import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useState, type FormEvent } from 'react'

import { toMediaSearchCardModel } from '../adapters/media-search-item-to-card-model'
import { MediaSearchResults } from '../components/media-search-results'
import { useMediaSearch } from '../hooks/features/use-media'
import type { SearchMediaInput } from '../types/media-api'
import type { MediaType } from '../types/media-item'

export function SearchPage() {
  const [draftQuery, setDraftQuery] = useState('')
  const [draftMediaType, setDraftMediaType] =
    useState<MediaType>('movie')
  const [submittedSearch, setSubmittedSearch] =
    useState<SearchMediaInput | null>(null)

  const mediaSearch = useMediaSearch(submittedSearch)
  const items = (mediaSearch.data ?? []).map(toMediaSearchCardModel)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const query = draftQuery.trim()

    if (query.length < 2) {
      return
    }

    setSubmittedSearch({
      query,
      mediaType: draftMediaType,
    })
  }

  function renderSearchContent() {
    if (submittedSearch === null) {
      return <Text>Escribe un título y confirma la búsqueda.</Text>
    }

    if (mediaSearch.isLoading) {
      return <Loader aria-label="Buscando títulos" />
    }

    if (mediaSearch.isError) {
      const message =
        mediaSearch.error instanceof Error
          ? mediaSearch.error.message
          : 'No se pudo completar la búsqueda.'

      return <Alert color="red">{message}</Alert>
    }

    if (items.length === 0) {
      return <Text>No encontramos resultados para esta búsqueda.</Text>
    }

    return <MediaSearchResults items={items} />
  }

  return (
      <Container py="xl" size="md">
        <Stack gap="xl">
          <div>
            <Title order={2}>Busca en el catálogo remoto</Title>
            <Text c="dimmed">
              Confirma un título y un tipo para consultar la API.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Título"
                minLength={2}
                onChange={(event) =>
                  setDraftQuery(event.currentTarget.value)
                }
                placeholder="Dune"
                value={draftQuery}
              />

              <Select
                allowDeselect={false}
                data={[
                  { label: 'Película', value: 'movie' },
                  { label: 'Serie', value: 'series' },
                ]}
                label="Tipo"
                onChange={(value) => {
                  if (value === 'movie' || value === 'series') {
                    setDraftMediaType(value)
                  }
                }}
                value={draftMediaType}
              />

              <Group justify="flex-end">
                <Button
                  disabled={draftQuery.trim().length < 2}
                  type="submit"
                >
                  Buscar
                </Button>
              </Group>
            </Stack>
          </form>

          {mediaSearch.isFetching && !mediaSearch.isLoading ? (
            <Text size="sm">Actualizando resultados…</Text>
          ) : null}

          {renderSearchContent()}
        </Stack>
      </Container>
  )
}
```

### `src/pages/media-detail-page.tsx` · archivo completo

```tsx
import { Anchor, Code, Container, Stack, Text, Title } from '@mantine/core'
import { Link, useParams } from 'react-router'

import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'

export function MediaDetailPage() {
  const detailInput = toMediaDetailInput(useParams())

  if (detailInput === null) {
    return (
      <Container py="xl" size="sm">
        <Stack>
          <Title order={1}>URL de detalle no válida</Title>
          <Text>Revisa el tipo y el identificador del medio.</Text>
          <Anchor component={Link} to="/search">
            Volver a la búsqueda
          </Anchor>
        </Stack>
      </Container>
    )
  }

  return (
    <Container py="xl" size="sm">
      <Stack>
        <Title order={1}>Detalle provisional</Title>
        <Text>
          La ruta ya produjo un input válido. La próxima sesión consultará el
          detalle remoto.
        </Text>
        <Code block>
          {JSON.stringify(detailInput, null, 2)}
        </Code>
        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

### `src/pages/not-found-page.tsx` · archivo completo

```tsx
import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <Container py="xl" size="sm">
      <Stack>
        <Title order={1}>Página no encontrada</Title>
        <Text>La URL no coincide con una página pública.</Text>
        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

### `src/adapters/media-detail-route-params-to-input.ts` · archivo completo

```ts
import type { GetMediaDetailInput } from '../types/media-api'

export type MediaDetailRouteParams = Readonly<{
  externalId?: string
  mediaType?: string
}>

export function toMediaDetailInput(
  params: MediaDetailRouteParams,
): GetMediaDetailInput | null {
  if (params.mediaType !== 'movie' && params.mediaType !== 'series') {
    return null
  }

  if (params.externalId === undefined || params.externalId.length === 0) {
    return null
  }

  return {
    externalId: params.externalId,
    mediaType: params.mediaType,
  }
}
```

### `src/components/media-search-results.tsx` · archivo completo

```tsx
import {
  Anchor,
  Badge,
  Box,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { Link } from 'react-router'

import type { MediaSearchCardModel } from '../types/media-search-card-model'

type MediaSearchResultsProps = {
  items: MediaSearchCardModel[]
}

export function MediaSearchResults(props: MediaSearchResultsProps) {
  const { items } = props

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {items.map((item) => (
        <Card key={item.key} padding="lg" radius="md" withBorder>
          <Card.Section>
            {item.posterUrl === null ? (
              <Box
                aria-label={`Sin portada para ${item.title}`}
                bg="gray.9"
                h={240}
              >
                <Text pt="xl" ta="center">
                  Sin portada
                </Text>
              </Box>
            ) : (
              <Image
                alt={`Portada de ${item.title}`}
                h={240}
                src={item.posterUrl}
              />
            )}
          </Card.Section>

          <Stack gap="xs" mt="md">
            <Text fw={700}>{item.title}</Text>
            <Group gap="xs">
              <Badge variant="light">
                {item.mediaType === 'movie' ? 'Película' : 'Serie'}
              </Badge>
              <Text c="dimmed" size="sm">
                {item.releaseLabel}
              </Text>
              {item.isLogged ? (
                <Badge color="green">En biblioteca</Badge>
              ) : null}
            </Group>
            <Anchor
              component={Link}
              to={`/media/${item.mediaType}/${item.externalId}`}
            >
              Ver detalle
            </Anchor>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
```

### `src/adapters/__tests__/media-detail-route-params-to-input.test.ts` · archivo completo

```ts
import { describe, expect, it } from 'vitest'

import { toMediaDetailInput } from '../media-detail-route-params-to-input'

describe('toMediaDetailInput', () => {
  it('construye el input de una película', () => {
    expect(
      toMediaDetailInput({ mediaType: 'movie', externalId: '438631' }),
    ).toEqual({ mediaType: 'movie', externalId: '438631' })
  })

  it('construye el input de una serie', () => {
    expect(
      toMediaDetailInput({ mediaType: 'series', externalId: '1399' }),
    ).toEqual({ mediaType: 'series', externalId: '1399' })
  })

  it('rechaza un tipo que no pertenece al dominio', () => {
    expect(
      toMediaDetailInput({ mediaType: 'anime', externalId: '438631' }),
    ).toBeNull()
  })

  it('rechaza una ruta sin identificador', () => {
    expect(toMediaDetailInput({ mediaType: 'movie' })).toBeNull()
  })

  it('rechaza una ruta sin tipo', () => {
    expect(toMediaDetailInput({ externalId: '438631' })).toBeNull()
  })
})
```

### Comprobación del checkpoint

```bash
pnpm test
pnpm build
pnpm lint
```

Lee la salida completa. Un código de salida 0 comprueba tests, tipos, generación y lint del estado local; no demuestra por sí solo que el backend publicado esté disponible ni que la navegación se haya probado en un navegador.
