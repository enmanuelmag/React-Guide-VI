# Sesión 09 · React Router declarativo

> Estado: paquete textual, presentación visual y proyecto progresivo implementados.

- **Fecha:** jueves 15 de octubre de 2026
- **Semana:** 4
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Entrada ejecutable:** `session-09-start` desde `session-08-end`
- **Checkpoint ejecutable:** `session-09-end`
- **Ruta:** `session-09-start` → `session-09-step-01-browser-router` → `session-09-step-02-search-page` → `session-09-step-03-public-routes` → `session-09-step-04-route-params` → `session-09-end`

## Punto de entrada

La búsqueda ya usa Mantine desde 08. Router reorganiza esa pantalla en páginas y enlaces conservando controles, estilos y responsabilidades; no requiere otra migración visual.

La sesión parte del checkpoint completo de la sesión 08:

- `QueryClientProvider`, Mantine y React Query Devtools envuelven `App`.
- `App` conserva `draftQuery`, `draftMediaType` y `submittedSearch`.
- `useMediaSearch()` administra la búsqueda remota con una key que incluye texto y tipo.
- `MediaSearchResults` presenta `MediaSearchCardModel[]`.
- Cada resultado conserva `mediaType + externalId`.
- Los resultados no abren un modal, no solicitan detalle y no navegan.
- `GetMediaDetailInput` ya existe en `src/types/media-api.ts`.
- Vitest `4.1.11` ejecuta pruebas puras en Node.

Los componentes y fixtures locales de sesiones anteriores pueden permanecer en el repositorio aunque ya no formen parte del árbol activo. La sesión no reconstruye HTTP, DTO, TanStack Query, Mantine ni el formulario remoto.

## Limitación visible

Una búsqueda exitosa muestra medios, pero una tarjeta no conduce a otra pantalla. La persona tampoco puede copiar, recargar o abrir en otra pestaña la identidad de un resultado.

```text
checkpoint 08
búsqueda enviada → query key → resultados remotos
                                   ↓
                              no hay destino

sesión 09
resultado → Link → URL → Route → params validados → página provisional
```

React Router aparece cuando la identidad pública necesita una URL. No asume la propiedad del fetching: TanStack Query continúa administrando los datos remotos.

## Checkpoint de salida

Al terminar:

- `react-router@8.3.1` está instalado desde el paquete `react-router`.
- `BrowserRouter` envuelve `App` dentro de los providers existentes.
- `App` declara `Routes` y `Route`; no conserva estado de búsqueda.
- El contenido actual de búsqueda vive en `src/pages/search-page.tsx` sin cambios de comportamiento.
- `src/layouts/public-layout.tsx` reutiliza `AppHeader` y ubica `Outlet` dentro de `<main>`.
- `/` redirige a `/search` mediante `Navigate replace`.
- `/search` renderiza `SearchPage`.
- `/media/:mediaType/:externalId` renderiza `MediaDetailPage`.
- Cada resultado ofrece un `Link` hacia su URL de detalle.
- `toMediaDetailInput()` convierte route params en `GetMediaDetailInput | null`.
- `movie` y `series` son tipos válidos; un tipo desconocido o un parámetro ausente no entra al dominio.
- La página de detalle muestra un input válido de forma provisional y no ejecuta `getMediaDetail()` ni `useMediaDetail()`.
- Una URL desconocida renderiza `NotFoundPage` con una salida hacia búsqueda.
- Atrás, Adelante y apertura en otra pestaña conservan la URL esperada.
- El test del adapter y `pnpm build` terminan con código de salida 0 en el seed ejecutable.

El test demuestra la traducción pura de parámetros. La comprobación manual demuestra el comportamiento observado del Router local. Ninguna de las dos pruebas demuestra requests de detalle, configuración del hosting o disponibilidad futura del backend.

## Resultado de aprendizaje

El estudiante modelará navegación pública con un árbol de rutas declarativo: moverá una pantalla existente a una página, compartirá estructura mediante un layout, conectará resultados con `Link` y validará parámetros externos antes de construir un input del dominio.

## Concepto principal

Una ruta relaciona un patrón de URL con el elemento que React debe renderizar.

```text
acción de la persona
→ Link
→ URL
→ coincidencia de Route
→ useParams()
→ adapter de validación
→ página
```

La sesión separa cuatro responsabilidades:

| Responsabilidad | Propietario |
| --- | --- |
| Historial y coincidencia de URL | React Router |
| Estructura compartida entre páginas | Layout + `Outlet` |
| Validación de strings externos | Adapter puro |
| Búsqueda y caché remotos | TanStack Query |

## Vocabulario

- **SPA:** aplicación que cambia la interfaz en el navegador sin solicitar un documento HTML completo por cada pantalla.
- **Router:** componente que observa la ubicación y permite resolver rutas dentro de la aplicación.
- **Ruta:** relación entre un patrón de URL y un elemento.
- **Segmento:** parte de un pathname separada por `/`.
- **Segmento dinámico:** segmento nombrado con `:` que captura texto de la URL.
- **Route params:** objeto de strings posiblemente ausentes capturados desde segmentos dinámicos.
- **Layout route:** ruta que comparte estructura con rutas hijas sin añadir por sí sola un segmento.
- **Ruta hija:** ruta declarada dentro de otra ruta.
- **`Outlet`:** región donde React Router coloca el elemento de la ruta hija coincidente.
- **`Link`:** navegación declarativa iniciada por la persona.
- **`Navigate`:** redirección declarativa renderizada por el árbol de rutas.
- **Wildcard:** patrón `*` que captura una URL sin otra coincidencia.
- **Deep link:** URL que abre directamente una pantalla interna.

## Decisiones técnicas cerradas

### Versión y modo

```bash
pnpm add react-router@8.3.1
```

La sesión usa modo declarativo e imports desde `react-router`. Node debe cumplir `>=22.22.0` y React/React DOM deben cumplir `>=19.2.7`; el curso ya fija React `19.2.8`.

No se usan `react-router-dom`, `createBrowserRouter`, loaders, actions, route modules, Data Mode ni Framework Mode.

### Lugar de `BrowserRouter`

El checkpoint 08 ya tiene providers funcionales. Se agrega `BrowserRouter` alrededor de `App` sin recrear `QueryClient` ni cambiar Mantine:

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

### Árbol de rutas

`App` contiene solo infraestructura de navegación:

```tsx
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
```

La ruta padre no añade un segmento. Su elemento comparte `AppHeader` y la región principal.

### `Outlet` como región del layout

```tsx
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

La demostración omite `Outlet` durante un momento. La URL coincide y `PublicLayout` aparece, pero la página hija no tiene una región donde renderizarse. El grupo corrige el layout antes de avanzar.

### Validación de parámetros

Los valores de `useParams()` provienen de la URL. El adapter recibe strings posiblemente ausentes y construye el tipo del dominio solo cuando ambos valores son válidos:

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

No se redefine `MediaType` ni se fuerza el valor con `as`. El mismo `GetMediaDetailInput | null` alimentará `useMediaDetail()` en la sesión 10.

### Navegación desde resultados

La acción se incorpora manualmente al componente ya existente:

```tsx
<Button
  component={Link}
  to={`/media/${item.mediaType}/${item.externalId}`}
  variant="light"
>
  Ver detalle
</Button>
```

`Link` conserva las capacidades del navegador para historial, pestaña nueva y copia del destino. No se usa un `onClick` con `window.location`.

## Estado inicial, cambio guiado y estado final

### Estado inicial

```text
main.tsx
└── providers
    └── App
        ├── formulario remoto
        └── MediaSearchResults
            └── tarjetas sin destino
```

### Cambio guiado

1. Verificar compatibilidad e instalar Router.
2. Insertar `BrowserRouter` sin alterar los providers existentes.
3. Mover el contenido de `App` a `SearchPage` y comprobar la búsqueda.
4. Crear `PublicLayout` y observar el fallo controlado sin `Outlet`.
5. Declarar redirección, búsqueda y wildcard.
6. Crear la ruta dinámica.
7. Definir la matriz de parámetros y escribir el adapter.
8. Conectar las tarjetas con `Link`.
9. Delegar solo los tests del adapter.
10. Comprobar rutas, historial y build.

### Estado final

```text
main.tsx
└── QueryClientProvider
    └── MantineProvider
        └── BrowserRouter
            └── App
                └── PublicLayout
                    ├── AppHeader
                    └── Outlet
                        ├── SearchPage
                        ├── MediaDetailPage
                        └── NotFoundPage
```

## Secuencia de 90 minutos

| Minutos | Responsable | Actividad | Evidencia observable |
| --- | --- | --- | --- |
| 0–18 | Docente y grupo | Presentación completa y continua: necesidad, SPA, direcciones, modo declarativo, matching, layout y params. | El editor permanece cerrado y el grupo asigna responsabilidades. |
| 18–28 | Docente + grupo | Verificar requisitos, instalar `react-router@8.3.1` e insertar `BrowserRouter`. | La búsqueda existente sigue renderizando bajo el provider. |
| 28–38 | Docente + grupo | Extraer el contenido de `App` a `SearchPage` sin reescribirlo. | Formulario, estados remotos y caché conservan su comportamiento. |
| 38–51 | Grupo | Crear `PublicLayout`, observar la ausencia de la hija sin `Outlet` y corregirla. | Encabezado y `SearchPage` aparecen una sola vez. |
| 51–63 | Grupo | Declarar redirect, `/search`, ruta dinámica y wildcard. | `/`, `/search` y una URL desconocida muestran el resultado acordado. |
| 63–76 | Estudiantes | Definir la matriz, crear el adapter, la página provisional y el `Link`. | Movie y series producen input; anime se rechaza; la tarjeta navega. |
| 76–86 | Estudiantes + agente acotado | Generar y revisar tests puros; comprobar Atrás, Adelante y pestaña nueva. | Vitest termina en 0 y el historial observado coincide con la URL. |
| 86–90 | Grupo | Ejecutar build, revisar el checkpoint y delimitar la sesión 10. | Build en 0 y lista de trabajo reservado verbalizada. |

Total: **90 minutos**.

## Actividad estudiantil principal

Cada pareja recibe esta matriz antes de escribir el adapter:

| Parámetros | Resultado esperado |
| --- | --- |
| `{ mediaType: "movie", externalId: "123" }` | `{ mediaType: "movie", externalId: "123" }` |
| `{ mediaType: "series", externalId: "456" }` | `{ mediaType: "series", externalId: "456" }` |
| `{ mediaType: "anime", externalId: "123" }` | `null` |
| `{ mediaType: "movie" }` | `null` |
| `{ externalId: "123" }` | `null` |

Después conecta un resultado con `Link`, visita una ruta válida y explica por qué el adapter recibe `string | undefined` en lugar de `MediaType`.

## Trabajo con agentes

Las decisiones centrales permanecen humanas:

- paquete y modo de Router;
- árbol de rutas;
- lugar de `Outlet`;
- forma de la URL;
- contrato y matriz del adapter;
- uso de `Link`.

Después de escribir `toMediaDetailInput()`, el agente puede modificar únicamente:

```text
src/adapters/__tests__/media-detail-route-params-to-input.test.ts
```

La invocación de `ahk-test` aparece en las guías docente y estudiantil. El estudiante lee el archivo completo, compara cada test con la matriz y ejecuta:

```bash
pnpm test
pnpm build
```

El agente no puede modificar implementación, rutas, componentes, dependencias, scripts ni otros tests. Si necesita un cambio fuera del archivo permitido, se detiene y lo informa.

## Guion implementado en la presentación candidata

La candidata HTML desarrolla este recorrido en 24 diapositivas conceptuales, antes de abrir el editor. Su fuente vive en `presentation/index.html` y conserva notas docentes privadas:

| Bloque | Concepto | Recurso | Nota docente |
| --- | --- | --- | --- |
| 1 | Del resultado a una URL | Mockup de tarjeta sin y con destino | Abrir con la limitación del checkpoint 08. |
| 2 | Qué resuelve un Router | Flujo acción → URL → página | Separar navegación de fetching. |
| 3 | Modos de React Router | Tabla Declarative/Data/Framework | Justificar Declarative porque Query ya administra datos. |
| 4 | Anatomía de una URL | `/media/:mediaType/:externalId` coloreada | Distinguir segmentos fijos y dinámicos. |
| 5 | Árbol de rutas | Diagrama padre/hijas | Preparar layout routes. |
| 6 | `Outlet` | Marco vacío y contenido hijo | Mostrar el fallo sin `Outlet`. |
| 7 | `Link` y `Navigate` | Dos recorridos | Persona versus redirección del árbol. |
| 8 | Params externos | Tabla válida/inválida | Evitar assertions y duplicación de `MediaType`. |
| 9 | Checkpoint | Árbol final | Identificar qué ya funciona. |
| 10 | Puente a sesión 10 | URL → input validado → futura query | No mostrar la solución del detalle. |

La expansión incluye portada, ruta de aprendizaje, preguntas con respuesta explícita, responsabilidades de React Router y TanStack Query, instalación, `BrowserRouter`, patrones, árbol público, layout route, fallo sin `Outlet`, snippets con rutas de archivo, `Link`, `Navigate`, matching, origen de `useParams()`, validación de parámetros, assertion incorrecta, checkpoint provisional y cierre verificable.

## Lectura previa

La lectura dura 20 minutos y usa dos fuentes oficiales verificadas el 31 de agosto de 2026:

1. React Router, **Picking a Mode**, para comparar Declarative, Data y Framework.
2. React Router, **Routing**, para rutas anidadas, layout routes, segmentos dinámicos y enlaces.

Las cinco preguntas cerradas comprueban reconocimiento de responsabilidades, `Outlet`, segmentos dinámicos, `Link` y modo declarativo.

## Frontera con sesiones vecinas

### Sesión 08

La sesión 08 termina con búsqueda remota y tarjetas sin acción. La sesión 09 reutiliza esa pantalla y su identidad pública; no cambia query keys, fetchers, DTOs, adapters visuales ni estados remotos.

### Sesión 10

La sesión 10 recibe rutas, enlaces y `GetMediaDetailInput | null` terminados. Antes del descanso construirá `useMediaDetail`, adaptación de DTO, contenido y `MediaDocumentTitle` con cleanup. El taller posterior integrará estados remotos y comprobará una URL de detalle recargable; no volverá a enseñar `Link` ni validación de params.

## Fuera de alcance

- Query de detalle y su query key.
- `MediaDetailContent` o adaptación del DTO de detalle.
- `document.title`, Effects, cleanup y Strict Mode.
- `createBrowserRouter`, loaders, actions y route modules.
- `useSearchParams`, filtros persistidos o restauración del formulario.
- `useNavigate` en la implementación.
- `NavLink` en la implementación.
- Rutas privadas, guardias y Firebase.
- Configuración del fallback SPA en producción.
- React Testing Library, jsdom, MSW o tests de Router.

## Simplificaciones pedagógicas

- El detalle provisional muestra tipo e identificador para volver observable el resultado de la validación.
- Un solo layout público basta para enseñar anidamiento y `Outlet`.
- `NotFoundPage` cubre tanto patrones incompletos como paths desconocidos; el tipo inválido se distingue porque la ruta dinámica sí coincide.
- La sesión acepta que el estado local de `SearchPage` se reinicie al desmontarse. La caché de Query Client y el estado del formulario son responsabilidades diferentes.
- `pnpm preview` permite una observación local, pero no prueba la configuración del hosting. La sesión 18 resolverá ese despliegue.

## Verificación docente prevista

- Confirmar Node, React y versión de Router antes de preparar el seed.
- Ejecutar `pnpm test` y `pnpm build`.
- Visitar `/`, `/search`, dos detalles válidos, un tipo inválido, un patrón incompleto y una ruta desconocida.
- Probar click, Atrás, Adelante, copiar enlace y abrir en pestaña nueva.
- Comprobar que no existe fetching de detalle.
- Revisar que `AppHeader` aparece una sola vez.
- Revisar que no se duplicó `MediaType`.
- Explicar que el preview local no demuestra fallback SPA en producción.
