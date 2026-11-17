# Clase 11 · React Router declarativo

- **Semana:** 4
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** checkpoint 10 con catálogo público, detalle en modal y `MediaDocumentTitle`; la selección todavía es estado local y no puede reconstruirse desde una URL
- **Checkpoint de salida:** infraestructura de rutas públicas con búsqueda, layout compartido, detalle provisional y página no encontrada; las tarjetas todavía abren el modal

## Resultado de aprendizaje

Al terminar, el estudiante podrá integrar React Router en una aplicación existente, explicar cómo una URL selecciona una página, declarar rutas públicas anidadas y convertir parámetros dinámicos en un input de dominio validado. También podrá explicar qué responsabilidad cumple `Outlet` dentro de un layout.

## Limitación que origina la clase

El modal construido en las clases anteriores funciona para una vista rápida, pero la selección vive únicamente en la memoria de la aplicación:

- copiar `/search` no identifica qué medio está abierto;
- recargar cierra el modal;
- una persona no puede enviar un enlace que abra directamente ese detalle;
- los botones Atrás y Adelante no representan cada selección.

La clase no elimina todavía el modal. Primero construye la infraestructura y una página provisional que demuestra que la URL contiene una identidad. La clase 12 conectará las tarjetas, la consulta remota y `MediaDetailContent`.

## Compatibilidad y versión de referencia

La guía se planifica con estas versiones de referencia verificadas el 26 de agosto de 2026:

- React Router `8.3.0` en modo declarativo.
- Paquete `react-router`; los ejemplos no importan desde `react-router-dom`.
- Node.js `>=22.22.0`, requisito declarado por React Router `8.3.0`.
- React y React DOM `>=19.2.7`, peer dependencies declaradas por esa versión.

El docente comprobará `package.json`, la versión de Node y la documentación oficial antes de preparar el proyecto de la cohorte. Si cambia la versión aprobada, deberá revisar instalación, imports, requisitos de runtime y compatibilidad con el template de Vite antes de actualizar las guías o seeds.

## Conceptos

- SPA e historial del navegador.
- URL como estado navegable e identidad pública.
- Modo declarativo de React Router.
- `BrowserRouter`, `Routes` y `Route`.
- Rutas índice, segmentos estáticos, segmentos dinámicos y wildcard.
- Layout sin segmento de URL.
- `Outlet` como posición de render de la ruta hija activa.
- Navegación declarativa con `Link`.
- Redirección declarativa con `Navigate`.
- Lectura de parámetros con `useParams`.
- Diferencia entre coincidencia de ruta y validación del dominio.
- Deep link y fallback de una SPA en producción.

## Rutas al cerrar la clase

| URL | Elemento que se renderiza en `Outlet` | Propósito |
| --- | --- | --- |
| `/` | `Navigate` | Redirigir a `/search` y reemplazar la entrada temporal del historial. |
| `/search` | `SearchPage` | Conservar la búsqueda, los resultados y el modal existentes. |
| `/media/:mediaType/:externalId` | `MediaDetailPage` | Leer y validar identidad pública; todavía no consulta el detalle. |
| Cualquier otra URL | `NotFoundPage` | Informar que no existe una página para esa dirección. |

`PublicLayout` no tiene `path`, por lo que comparte estructura sin añadir un segmento a la URL.

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 20 minutos. Parte de una limitación observada en el modal y presenta solo las piezas necesarias para resolver navegación pública. La clase recupera el deck durante los últimos 8 minutos para diagnosticar el árbol final y cerrar la diferencia entre infraestructura y página conectada.

### Apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Lo que ya puede hacer el catálogo | Recuperar búsqueda remota, modal, query de detalle y `MediaDocumentTitle`. Distinguir selección local, datos remotos y sincronización con `document.title`. | Mostrar el árbol del checkpoint 10. No repasar la implementación completa de Query ni Effects. |
| Problema | Una pantalla que no se puede compartir | Abrir un medio en el modal, copiar la URL, recargar y usar Atrás. La URL continúa siendo `/search`, por lo que no expresa la selección. | Pedir al grupo que prediga qué conservará cada acción antes de probarla. |
| Concepto | La URL también puede representar estado | Una URL puede identificar qué página y qué recurso desea ver la persona. A diferencia de un `useState`, puede copiarse, guardarse y abrirse directamente. | Contrastar `selectedMedia` en memoria con `/media/movie/123`. No afirmar que todo estado de interfaz pertenece a la URL. |
| Modelo | React Router decide qué elemento mostrar | `BrowserRouter` conecta React con el historial; `Routes` busca la mejor coincidencia; cada `Route` relaciona un patrón con un elemento. | Diagrama `URL → coincidencia → elemento`. Aclarar que TanStack Query sigue administrando los datos remotos. |
| Decisión | Por qué usamos el modo declarativo | La aplicación ya posee una capa de datos con TanStack Query. El modo declarativo agrega navegación sin introducir loaders, actions ni otra estrategia de fetching. | Nombrar Data Mode y Framework Mode solo como alternativas fuera del alcance. |
| Estructura | Páginas y layouts tienen responsabilidades distintas | Una página es el elemento asociado a una ruta. Un layout comparte estructura entre varias páginas. `App` pasa de contener toda la interfaz a declarar el árbol de rutas. | Diagrama antes/después. Evitar presentar `pages/` como una exigencia propia de React. Es una convención del curso. |
| Concepto central | `Outlet` es el espacio de la ruta hija | Cuando coincide una ruta hija, React Router entrega su elemento al `Outlet` del layout padre. El layout conserva el encabezado y decide dónde aparece el contenido variable. | Usar el diagrama de marco compartido. Luego demostrar el fallo al omitir `Outlet`. |
| Contraste | Coincidir no basta si el layout no renderiza a la hija | Sin `<Outlet />`, `/search` puede coincidir y el encabezado del layout puede aparecer, pero `SearchPage` no tiene un lugar donde renderizarse. | Mostrar primero el síntoma real: URL correcta, header visible y contenido ausente. Añadir `Outlet` después de pedir una hipótesis. |
| Concepto | Segmentos dinámicos y parámetros | `:mediaType` y `:externalId` capturan texto de la URL. `useParams` los devuelve como strings posiblemente ausentes; no los convierte en tipos del dominio. | Comparar `/media/movie/123`, `/media/anime/123` y `/media/movie`. |
| Distinción | Ruta válida no significa dato válido | `/media/anime/123` coincide con el patrón, pero `anime` no pertenece al dominio del curso. `/media/movie` ni siquiera completa el patrón y termina en la ruta wildcard. | Diagrama en dos filtros: coincidencia estructural y validación del dominio. |
| Navegación | `Link`, `Navigate` y el historial | `Link` representa una acción navegable de la persona. `Navigate` realiza la redirección inicial. `replace` evita conservar `/` como paso innecesario al volver atrás. | No introducir `useNavigate`: todavía no existe una navegación imperativa que lo necesite. |
| Límite | Infraestructura hoy, detalle conectado el sábado | La clase deja una página provisional con los parámetros validados. Las tarjetas conservan el modal. El taller conectará enlace, parámetros, query, contenido y título. | Mostrar la cadena futura sin revelar su implementación: `card → URL → params → query → content`. |

### Diagrama que debe aparecer en las diapositivas

```text
PublicLayout
┌──────────────────────────────────┐
│ AppHeader                        │
├──────────────────────────────────┤
│ <Outlet />                       │
│                                  │
│ /search       → SearchPage       │
│ /media/...    → MediaDetailPage  │
│ otra ruta     → NotFoundPage     │
└──────────────────────────────────┘
```

El diagrama debe animarse o revelarse en dos pasos: primero el marco estable y luego las páginas que ocupan `Outlet`. No dibujar `Outlet` como una página adicional ni como un contenedor que modifica la URL.

### Indicaciones sobre `Outlet` que deben sobrevivir a las slides

- `Outlet` no es un portal, un wildcard, una prop ni una API del navegador.
- Es un componente de React Router que marca la posición exacta donde el layout renderiza el elemento de la ruta hija que coincidió.
- El layout puede contener encabezado, navegación y contenedores compartidos antes o alrededor de `Outlet`.
- Una ruta de layout sin `path` no añade un segmento. Agrupa rutas por estructura compartida.
- El wildcard `*` decide qué ruta coincide; `Outlet` decide dónde aparece la hija dentro del padre. Son responsabilidades distintas.
- Si el layout no incluye `Outlet`, la coincidencia puede ocurrir sin que la página hija sea visible. Ese error se demuestra antes de corregirse.
- `Outlet` no recibe manualmente `SearchPage` o `MediaDetailPage` en esta clase. El árbol de rutas determina qué elemento entrega.

### Otros contrastes que deben sobrevivir a las slides

- `BrowserRouter` no consulta la API. TanStack Query conserva esa responsabilidad.
- `Link` produce navegación dentro de la SPA y conserva la semántica de un enlace. No se reemplaza con un `div` que modifica `window.location`.
- Los parámetros llegan desde una fuente externa: la URL. Deben validarse antes de construir un tipo más estrecho.
- `externalId` permanece como string porque así se definió en el contrato del curso. No se convierte a número solo por parecer numérico.
- `NavLink` puede añadir estado activo a una navegación que lo necesite, pero no se implementa sin ese caso visible.
- Al salir de `SearchPage`, sus estados locales pueden perderse porque la página se desmonta. La caché de TanStack Query puede permanecer, pero borrador, submit y filtros todavía no viven en la URL. La clase 22 resolverá ese caso con query params.
- `pnpm preview` permite comprobar el build local. No demuestra que un hosting real esté configurado para redirigir deep links a `index.html`.

### Cierre conceptual

La última diapositiva recupera el árbol final y plantea estas preguntas:

1. ¿Qué parte conserva `PublicLayout` y qué parte cambia dentro de `Outlet`?
2. ¿Por qué `/media/anime/123` y `/media/movie` fallan por razones diferentes?
3. ¿Qué responsabilidad conserva TanStack Query después de instalar React Router?
4. ¿Qué falta para que una tarjeta abra un detalle completo mediante URL?

La cuarta respuesta abre la clase 12: conectar el enlace, los parámetros validados, `useMediaDetail`, `MediaDetailContent` y `MediaDocumentTitle`.

## Flujo del código

### Estado 1 · Confirmar el problema antes de instalar

El docente abre un detalle en el modal y ejecuta tres recorridos:

1. Copia la URL y la abre en otra pestaña.
2. Recarga la pestaña actual.
3. Selecciona dos medios y usa Atrás.

La pantalla no debe modificarse todavía. El grupo registra qué información pertenece a `selectedMedia`, cuál pertenece a la caché y cuál aparece en la URL.

### Estado 2 · Verificar la base e instalar una versión compatible

Antes de instalar, se revisan las versiones reales del proyecto:

```bash
node --version
pnpm list react react-dom
```

Con la base compatible, se instala la versión aprobada:

```bash
pnpm add react-router@8.3.0
```

El docente abre el cambio en `package.json` y `pnpm-lock.yaml`. Explica que fijar la versión en la guía vuelve reproducible el checkpoint, pero no elimina la revisión de compatibilidad previa a cada cohorte.

### Estado 3 · Conectar la aplicación con el historial

`BrowserRouter` envuelve a los componentes que usarán rutas. Se conserva el árbol de providers existente y solo se añade la nueva capacidad:

```tsx
import { BrowserRouter } from "react-router"

<StrictMode>
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</StrictMode>
```

La regla importante no es memorizar un único orden universal de providers, sino que cada consumidor quede contenido por el provider cuya capacidad utiliza.

### Estado 4 · Separar el contenido de página y la estructura compartida

El contenido específico de búsqueda se mueve sin reescribir su comportamiento. `AppHeader` no se duplica dentro de `SearchPage`: se reserva para el layout compartido que se creará en el siguiente estado.

```text
src/App.tsx
├── AppHeader
└── búsqueda + resultados + modal + MediaDocumentTitle

se convierte en

src/pages/search-page.tsx
└── búsqueda + resultados + modal + MediaDocumentTitle
```

Durante esta extracción, `App` puede renderizar temporalmente `AppHeader` seguido de `<SearchPage />`. Esta comprobación intermedia separa un error de movimiento de archivos de un error posterior de routing. En el checkpoint final, `AppHeader` vivirá una sola vez dentro de `PublicLayout`.

`SearchPage` sigue siendo propietaria del estado local de búsqueda y selección que ya existía. La clase no mueve esos valores a Zustand ni a la URL.

### Estado 5 · Crear layout y páginas provisionales

Se crean responsabilidades nuevas:

```text
src/
├── layouts/
│   └── public-layout.tsx
├── pages/
│   ├── media-detail-page.tsx
│   ├── not-found-page.tsx
│   └── search-page.tsx
├── App.tsx
└── main.tsx
```

Para hacer visible la responsabilidad de `Outlet`, la primera versión del layout lo omite de forma deliberada:

```tsx
import { AppHeader } from "../components/app-header"

export function PublicLayout() {
  return (
    <>
      <AppHeader />
      <main className="page-container" />
    </>
  )
}
```

Esta versión es un estado de demostración, no el checkpoint.

### Estado 6 · Declarar el árbol y diagnosticar la hija ausente

`App` pasa a describir las rutas:

```tsx
import { Navigate, Route, Routes } from "react-router"

import { PublicLayout } from "./layouts/public-layout"
import { MediaDetailPage } from "./pages/media-detail-page"
import { NotFoundPage } from "./pages/not-found-page"
import { SearchPage } from "./pages/search-page"

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate to="/search" replace />} />
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

export default App
```

Al visitar `/search`, el grupo observa el encabezado y la ausencia de `SearchPage`. Después de formular una explicación, se corrige el layout:

```tsx
import { Outlet } from "react-router"

import { AppHeader } from "../components/app-header"

export function PublicLayout() {
  return (
    <>
      <AppHeader />
      <main className="page-container">
        <Outlet />
      </main>
    </>
  )
}
```

La comprobación debe expresarse en una frase completa: “`/search` coincide con la ruta hija y `Outlet` indica dónde se renderiza su elemento dentro de `PublicLayout`”.

### Estado 7 · Leer y validar parámetros sin consultar todavía

`MediaDetailPage` convierte valores externos y posiblemente ausentes en un input del dominio:

```tsx
import { Link, useParams } from "react-router"

import type { GetMediaDetailInput } from "../types/media-api"

export function MediaDetailPage() {
  const { mediaType, externalId } = useParams()

  if (mediaType !== "movie" && mediaType !== "series") {
    return (
      <section>
        <h1>Tipo de medio no válido</h1>
        <Link to="/search">Volver a la búsqueda</Link>
      </section>
    )
  }

  if (externalId === undefined) {
    return (
      <section>
        <h1>Falta el identificador del medio</h1>
        <Link to="/search">Volver a la búsqueda</Link>
      </section>
    )
  }

  const detailInput: GetMediaDetailInput = {
    mediaType,
    externalId,
  }

  return (
    <section>
      <h1>Detalle provisional</h1>
      <p>Tipo: {detailInput.mediaType}</p>
      <p>Identificador: {detailInput.externalId}</p>
      <Link to="/search">Volver a la búsqueda</Link>
    </section>
  )
}
```

La página no ejecuta `useMediaDetail`. Mostrar `detailInput` hace observable que los parámetros ya fueron validados y deja una entrada concreta para el taller.

El docente contrasta estos recorridos:

| URL | Resultado esperado | Razón |
| --- | --- | --- |
| `/media/movie/123` | Detalle provisional | Coincide y el tipo pertenece al dominio. |
| `/media/series/456` | Detalle provisional | Coincide y el tipo pertenece al dominio. |
| `/media/anime/123` | Mensaje de tipo no válido | La ruta coincide, pero falla la validación del dominio. |
| `/media/movie` | `NotFoundPage` | Falta un segmento y el patrón dinámico no coincide. |
| `/ruta-inexistente` | `NotFoundPage` | Solo coincide la ruta wildcard. |

### Estado 8 · Navegación, build y límite de hosting

`NotFoundPage` ofrece una salida mediante `Link`. La raíz usa `Navigate` porque no representa una acción de la persona sino una redirección del árbol de rutas.

Se prueban `/`, `/search`, dos detalles válidos y dos URLs inválidas. Luego se valida el build:

```bash
pnpm build
pnpm preview
```

En preview, el grupo abre una URL de detalle, recarga y usa Atrás y Adelante. El docente aclara el límite de la prueba: un servidor estático de producción debe dirigir solicitudes desconocidas a `index.html` para que `BrowserRouter` pueda resolver un deep link. Esa configuración depende del hosting y no queda demostrada por el preview local.

También se observa que abandonar `SearchPage` puede desmontar su estado local. La clase no copia ese estado a Zustand ni añade un Effect para persistirlo. Mantener filtros compartibles en la URL requiere query params y pertenece a la clase 22.

### Árbol final del checkpoint

```text
main.tsx
└── BrowserRouter
    └── App
        └── Routes
            └── PublicLayout
                ├── AppHeader
                └── Outlet
                    ├── /search → SearchPage
                    ├── /media/:mediaType/:externalId → MediaDetailPage
                    └── * → NotFoundPage
```

Dentro de `SearchPage`, las tarjetas todavía abren el modal. Esta continuidad es deliberada: la clase 11 cambia la estructura de navegación; la clase 12 cambia el recorrido de la tarjeta y conecta los datos de la nueva página.

## Secuencia sugerida

| Tiempo | Actividad | Progreso observable |
| --- | --- | --- |
| 0-10 min | Recapitular y probar la limitación del modal. | El grupo distingue estado local, caché y URL. |
| 10-30 min | Presentar URL, router, páginas, layouts, `Outlet` y parámetros. | Los estudiantes pueden anticipar qué pieza resuelve cada limitación. |
| 30-42 min | Verificar compatibilidad e instalar React Router. | `package.json` y lockfile contienen la versión aprobada. |
| 42-55 min | Añadir `BrowserRouter` al árbol de providers. | La aplicación existente sigue renderizando sin rutas declaradas. |
| 55-72 min | Extraer `SearchPage` y crear `PublicLayout`. | La búsqueda conserva su comportamiento antes de configurar rutas. |
| 72-86 min | Declarar rutas, observar la hija ausente y añadir `Outlet`. | `/search` aparece dentro del layout compartido. |
| 86-101 min | Leer, estrechar y mostrar parámetros dinámicos. | Dos URLs válidas producen inputs distintos; `anime` se rechaza. |
| 101-112 min | Añadir `Link`, redirección y wildcard; probar historial. | Hay salida desde detalle y 404, y `/` termina en `/search`. |
| 112-120 min | Ejecutar build, diagnosticar el árbol y cerrar. | El checkpoint compila y el grupo explica qué completará el taller. |

Total: 120 minutos.

## Actividades del docente

- Iniciar con el fallo observable del modal, no con una lista de APIs del router.
- Revisar requisitos de runtime y peer dependencies antes de instalar.
- Mover la pantalla existente a `SearchPage` sin refactorizar Query, modal o Effects.
- Omitir `Outlet` solo durante una demostración breve y pedir una hipótesis antes de corregirlo.
- Dibujar el árbol de rutas junto al árbol visual del layout.
- Comparar coincidencia estructural y validación del dominio con URLs concretas.
- Mantener `useMediaDetail` fuera de la página provisional.
- Explicar el alcance real de `pnpm preview` y la necesidad de fallback del hosting.

## Actividades de los estudiantes

- Predecir qué ocurre al copiar, recargar y recorrer el historial con el modal actual.
- Identificar qué provider debe contener a los componentes que consumen el router.
- Verificar que la extracción a `SearchPage` no cambie el comportamiento existente.
- Diagnosticar por qué el layout aparece sin la página hija.
- Explicar con sus palabras qué elemento ocupa `Outlet` en tres URLs distintas.
- Clasificar URLs como coincidencia válida, parámetro de dominio inválido o ruta no encontrada.
- Construir un `GetMediaDetailInput` sin assertions de tipo.
- Ejecutar los recorridos de aceptación antes del cierre.

## Evidencia de salida

- `/` redirige a `/search` mediante `Navigate` con `replace`.
- `SearchPage` conserva búsqueda, resultados, modal y sincronización de título del checkpoint 10.
- `PublicLayout` mantiene `AppHeader` y renderiza páginas hijas mediante `Outlet`.
- `/media/movie/:externalId` y `/media/series/:externalId` muestran un input provisional validado.
- `/media/anime/:externalId` muestra un error de dominio sin romper la aplicación.
- Una ruta desconocida muestra `NotFoundPage` y ofrece un `Link` de regreso.
- Las tarjetas siguen abriendo el modal; no se adelantó la solución del taller 12.
- `pnpm build` finaliza correctamente.
- Los imports del router provienen de `react-router` y el proyecto no introduce TanStack Router.

## Errores frecuentes y respuesta docente

| Síntoma | Pregunta de diagnóstico | Respuesta esperada |
| --- | --- | --- |
| El header aparece, pero `/search` está vacío. | ¿Dónde puede renderizar el layout a la ruta hija? | Añadir `Outlet` dentro del contenido compartido. |
| `useParams` falla fuera de una página. | ¿El componente está contenido por `BrowserRouter` y una ruta coincidente? | Revisar el árbol de providers y rutas, no copiar parámetros a estado global. |
| TypeScript no acepta `mediaType`. | ¿La URL garantiza por sí sola `movie | series`? | Estrechar con comparaciones explícitas antes de crear `GetMediaDetailInput`. |
| `/media/movie` muestra 404. | ¿Cuántos segmentos exige el patrón? | Falta `externalId`; no es el mismo caso que un tipo inválido. |
| Al recargar un deep link desplegado, el servidor responde 404. | ¿El host devuelve `index.html` para rutas de la SPA? | Configurar fallback en el hosting; no cambiar la validación de React Router. |
| Se vuelve a consultar detalle dentro de la clase 11. | ¿Qué dificultad principal pertenece al checkpoint actual? | Volver a la página provisional y reservar la query para el taller. |
| Se propone Zustand para conservar la página. | ¿Qué sistema ya representa la identidad navegable? | La URL identifica la página; Query conserva los datos remotos. |

## Vocabulario

- **SPA:** aplicación que cambia vistas en el navegador sin solicitar un documento HTML completo en cada navegación interna.
- **Router:** herramienta que relaciona la URL actual con los elementos de interfaz que deben renderizarse.
- **Ruta:** patrón que asocia una dirección con un elemento.
- **Segmento dinámico:** parte variable de un patrón, escrita con `:` en la declaración de la ruta.
- **Parámetro de ruta:** texto capturado desde un segmento dinámico.
- **Layout:** componente que conserva estructura compartida entre rutas hijas.
- **Outlet:** posición donde un layout renderiza el elemento de la ruta hija que coincidió.
- **Ruta índice:** hija que coincide cuando se visita exactamente la URL de su padre.
- **Wildcard:** patrón `*` que captura direcciones no resueltas por rutas más específicas.
- **Deep link:** URL que abre directamente una pantalla específica de la aplicación.
- **Historial:** secuencia de direcciones que el navegador usa para Atrás y Adelante.
- **Fallback de SPA:** configuración del servidor que entrega `index.html` ante rutas que resolverá el cliente.
- **Estrechamiento de tipo:** comprobación que reduce un valor amplio, como `string | undefined`, a una variante válida del dominio.
- **Runtime:** entorno y versión con que se ejecuta una herramienta; en este proyecto, Node.js debe cumplir el mínimo declarado por sus dependencias.
- **Peer dependency:** versión de otra librería que un paquete espera encontrar en el proyecto, pero que no instala como una copia privada propia.

## Fuera del alcance

- Conectar las tarjetas con `Link`.
- Ejecutar `useMediaDetail` dentro de `MediaDetailPage`.
- Reutilizar `MediaDetailContent` en la página.
- Sincronizar `document.title` con el detalle de la URL.
- Persistir los filtros de búsqueda en query params.
- `useNavigate` y navegación imperativa.
- Implementar estado activo con `NavLink`.
- `createBrowserRouter`, loaders, actions, Data Mode o Framework Mode.
- Autenticación y rutas privadas.
- Configurar un proveedor de hosting concreto.

Los cuatro primeros puntos forman el núcleo del taller de la clase 12. Los filtros en la URL se reservan para la clase 22.

## Referencias docentes

- [Modos de React Router](https://reactrouter.com/start/modes)
- [Instalación en modo declarativo](https://reactrouter.com/start/declarative/installation)
- [Routing declarativo](https://reactrouter.com/start/declarative/routing)
- [Navegación declarativa](https://reactrouter.com/start/declarative/navigating)
- [Valores de la URL](https://reactrouter.com/start/declarative/url-values)
- [Despliegue como SPA](https://reactrouter.com/how-to/spa)
- [Manifest de `react-router`](https://github.com/remix-run/react-router/blob/main/packages/react-router/package.json)
