# Clase 24 · Drawer compartido, carga diferida y cierre

- **Semana:** 8
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** proyecto semilla `s08-c24-mejoras-seed`, construido desde el checkpoint 22 con CRUD y filtros en URL funcionales
- **Checkpoint de salida:** biblioteca con vista rápida en un drawer compartido, página privada cargada de forma diferida y recorrido final de regresión aprobado

## Resultado de aprendizaje

Al terminar, el estudiante podrá decidir qué dato mínimo pertenece a un store de interfaz, abrir un drawer desde una rama distinta del layout, reutilizar una query sin copiar su DTO y comprobar una carga diferida sin confundirla con el fetching remoto.

## Pregunta que organiza la clase

> Si la biblioteca y otro punto de entrada necesitan abrir el mismo panel, ¿qué debe recordar la aplicación y qué datos continúan perteneciendo al servidor?

La clase construye este recorrido:

```text
acción secundaria de una fila
→ openDetail(logId)
→ Zustand conserva logId
→ MediaDetailDrawer deriva opened y el selector log
→ useMediaDetail consulta o reutiliza la key existente
→ Query entrega pending, error o DTO
→ el drawer compone catálogo y datos personales
→ cerrar asigna logId = null
```

La página `/app/library/:logId` permanece disponible. El drawer añade una vista rápida; no sustituye la ruta completa ni absorbe las mutaciones de la página.

## Progresión y cierre del curso

| Clase | Aporta | Frontera |
| --- | --- | --- |
| 22 | Filtros como URL, bodies dinámicos y pruebas puras | No añade estado global de interfaz |
| **24** | Identidad compartida del drawer, composición del detalle y carga diferida | No convierte Zustand en caché remota ni construye un calendario desde cero |

La clase 24 recibe el CRUD terminado. Durante la regresión usa crear, editar, eliminar y cambiar status, pero no vuelve a enseñar esas operaciones.

## Conceptos que se enseñan y consolidan

### Conceptos principales

- Store externo de interfaz.
- Selector de Zustand.
- Identidad nullable como estado completo del drawer.
- Estado remoto frente a estado de interfaz.
- Montaje compartido en un layout.
- Carga diferida con `lazy`.
- Límite de `Suspense` en este proyecto.

### Conceptos que se consolidan

- `logId` como identidad de un registro personal.
- Query dependiente mediante input nullable.
- Query key y reutilización de caché.
- Props de callback y responsabilidad del componente.
- `Outlet` y layouts privados.
- Composición de `MediaDetailContent` y `SavedMediaDetails`.
- Navegación con `Link`.
- Estados pending, error y éxito.
- Regresión y evidencia observable.

### Distinciones que deben quedar explícitas

| No confundir | Distinción |
| --- | --- |
| Zustand con TanStack Query | Zustand conserva qué drawer abrir; Query conserva el DTO, la caché y sus estados remotos |
| `logId` con un DTO | La identidad permite solicitar un registro; no contiene título, status o notas |
| `opened` con otra fuente de verdad | `logId !== null` permite derivar si el drawer está abierto |
| Store global con acceso indiscriminado | Solo los componentes coordinadores leen acciones o valores del store; las filas siguen recibiendo props |
| Drawer con página | El drawer ofrece consulta rápida; la página mantiene la URL y las acciones completas |
| `lazy` con fetching | `lazy` difiere código JavaScript; `useMediaDetail` administra datos remotos |
| Fallback de `Suspense` con `isPending` | El primero espera un módulo; el segundo espera la respuesta de la query |
| Carga diferida con mejora garantizada | El build prueba separación de chunks; una afirmación de rendimiento exige medición |
| Cerrar con borrar caché | Cerrar cambia la identidad visual; Query decide cuánto conserva el DTO |
| Punto extra con tema nuevo | La extensión entrega calendario y query preparados; el estudiante solo reutiliza `openDetail` |

## Decisión de estado

### Estado mínimo aprobado

`src/stores/media-detail-drawer-store.ts` define:

```ts
import { create } from "zustand"

type MediaDetailDrawerStore = {
  logId: string | null
  openDetail: (logId: string) => void
  closeDetail: () => void
}

export const useMediaDetailDrawerStore =
  create<MediaDetailDrawerStore>()((set) => ({
    logId: null,
    openDetail: (logId) => set({ logId }),
    closeDetail: () => set({ logId: null }),
  }))
```

El store no guarda `opened`. También evita un objeto `{ kind: "log", logId }`: esta interfaz solo admite registros personales, así que una segunda forma no añade información.

Cada consumidor selecciona una porción atómica:

```ts
const logId = useMediaDetailDrawerStore((state) => state.logId)
const closeDetail = useMediaDetailDrawerStore(
  (state) => state.closeDetail,
)
```

No se introduce `useShallow`, middleware, persistencia, slices o Devtools de Zustand. El store tiene un value y dos acciones.

### Estados válidos

| `logId` | Estado visual | Query |
| --- | --- | --- |
| `null` | Drawer cerrado | Input `null`; query deshabilitada |
| string | Drawer abierto para ese registro | Selector `{ kind: "log", logId }` |

Guardar `opened: true` con `logId: null` permitiría un panel sin identidad. La forma nullable elimina esa combinación.

## Decisión de arquitectura

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `useMediaDetailDrawerStore` | Conservar `logId` y exponer apertura y cierre | No consulta, adapta ni persiste DTOs |
| `PrivateLayout` | Montar una sola instancia de `MediaDetailDrawer` junto a `Outlet` | No recibe callbacks desde cada página hija |
| `MediaDetailDrawer` | Leer identidad, ejecutar la query y representar sus estados | No edita, elimina ni cambia status |
| `LibraryPage` | Leer `openDetail` y entregarlo como `onPreview` | No guarda otra selección local |
| `LibraryMediaList` | Propagar `onPreview` a cada fila | No importa Zustand |
| `LibraryMediaListItem` | Emitir `onPreview(item.logId)` desde una acción secundaria | No conoce Query, Firebase o el layout |
| `MediaDetailContent` | Mostrar catálogo | No muestra status, prioridad o notas |
| `SavedMediaDetails` | Mostrar datos personales | No consulta ni abre el drawer |
| `LazyPrivateMediaDetailPage` | Diferir el módulo de la página privada | No cambia cómo se consultan sus datos |

`PrivateLayout` conserva la estructura:

```tsx
<>
  <PrivateHeader email={authState.user.email} />
  <Outlet />
  <MediaDetailDrawer />
</>
```

El layout monta el panel. `MediaDetailDrawer` encapsula el store y la query para que el layout no conozca estados remotos.

## Flujo del drawer

### Input nullable y query

Dentro de `MediaDetailDrawer`:

```ts
const logId = useMediaDetailDrawerStore((state) => state.logId)
const closeDetail = useMediaDetailDrawerStore(
  (state) => state.closeDetail,
)

const detailInput =
  logId === null
    ? null
    : { kind: "log" as const, logId }

const detailQuery = useMediaDetail(detailInput)
const opened = logId !== null
```

El hook ya acepta un input nullable desde la clase 19. Cerrar no necesita un Effect: `closeDetail()` cambia el input a `null` y el hook conserva el orden de llamadas.

### Estados remotos

El drawer decide en este orden:

```text
logId === null            → panel cerrado
detailQuery.isPending     → Loader y mensaje con contexto
detailQuery.isError       → Alert, Reintentar y Cerrar
entry ausente             → registro personal no disponible
data válida               → catálogo + datos personales + enlace completo
```

Al cambiar de fila, `logId` cambia la query key. El componente no presenta el DTO de la identidad anterior como si perteneciera a la nueva. Si la nueva key no tiene caché, muestra pending; si ya existe, Query puede reutilizar su dato válido.

El botón “Reintentar” ejecuta `detailQuery.refetch()` como respuesta a una acción. Un `401` o `404` muestra copy local y permite cerrar; no fuerza logout.

### Contenido reutilizado

Cuando la respuesta contiene `entry`, el drawer deriva durante el render. `catalog` conserva la nulabilidad definida en la clase 19:

```ts
const savedDetails = toSavedMediaDetailsModel(detailQuery.data.entry)
const catalogDetails = detailQuery.data.catalog
  ? toMediaDetailModel(detailQuery.data.catalog)
  : null
```

Después compone el catálogo cuando existe y conserva siempre los datos personales:

```tsx
{catalogDetails === null ? (
  <Alert color="gray">Catálogo no disponible</Alert>
) : (
  <MediaDetailContent media={catalogDetails} />
)}
<SavedMediaDetails details={savedDetails} />
```

No copia esos modelos a Zustand o `useState`. La página privada y el drawer pueden consultar la misma key; Query Client decide si reutiliza el DTO o ejecuta un request.

## Apertura desde la biblioteca

`LibraryPage` consume una acción del store:

```ts
const openDetail = useMediaDetailDrawerStore(
  (state) => state.openDetail,
)
```

La página entrega una intención de interfaz:

```tsx
<LibraryMediaList
  items={items}
  onPreview={openDetail}
/>
```

La firma se propaga sin cambiar:

```ts
type LibraryMediaListProps = {
  items: LibraryMediaListItemModel[]
  onPreview: (logId: string) => void
}
```

```ts
type LibraryMediaListItemProps = {
  item: LibraryMediaListItemModel
  onPreview: (logId: string) => void
}
```

La fila ejecuta:

```tsx
<Button
  onClick={() => onPreview(item.logId)}
  variant="light"
>
  Vista rápida
</Button>
```

La acción “Ver detalle” conserva su `Link` hacia `/app/library/:logId`. El store resuelve coordinación entre ramas distantes, pero la lista permanece presentacional y comprobable mediante props.

## Carga diferida

La clase elige la página privada de detalle porque una persona puede usar búsqueda y biblioteca sin abrirla durante la sesión.

`App.tsx` declara el componente en scope de módulo:

```tsx
const LazyPrivateMediaDetailPage = lazy(() =>
  import("./pages/private-media-detail-page").then((module) => ({
    default: module.PrivateMediaDetailPage,
  })),
)
```

La adaptación a `default` mantiene el export nombrado existente. Esta clase no convierte esa decisión local en una convención global de exports.

La ruta usa:

```tsx
<Suspense fallback={<Loader aria-label="Cargando pantalla" />}>
  <LazyPrivateMediaDetailPage />
</Suspense>
```

`lazy` debe permanecer fuera de `App`; declararlo dentro crearía un tipo de componente nuevo durante renders posteriores y podría reiniciar estado.

### Evidencia de separación de código

El docente ejecuta:

```bash
pnpm build
pnpm preview
```

La comprobación busca:

1. Un chunk separado relacionado con la página privada en `dist/assets`.
2. Una petición JavaScript al navegar por primera vez hacia `/app/library/:logId`.
3. El fallback bajo throttling y caché deshabilitada, si la descarga dura lo suficiente.
4. Los estados de TanStack Query después de que el módulo ya cargó.

La evidencia prueba carga diferida del módulo. No prueba por sí sola que la aplicación sea más rápida para cada usuario.

## Guion de presentación

### Propósito y duración

La presentación inicial dura 18 minutos. Recupera el checkpoint de filtros, ubica cinco propietarios de estado y justifica Zustand mediante la distancia entre `LibraryPage` y `PrivateLayout`. El cierre de 6 minutos vuelve al deck después de las demostraciones para reconstruir el proyecto completo.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Query ya posee el dato remoto | Recuperar el CRUD y los filtros de la clase 22. El DTO permanece en Query Client; ninguna mejora visual cambia ese propietario. | Mostrar una key de detalle y preguntar quién consulta y conserva el DTO. |
| Inventario | Cinco estados, cinco propietarios | Input local en React, formulario en Mantine, filtros en URL, sesión en Firebase y DTO en Query. Falta una identidad visual compartida. | Tabla de propietarios; dejar el drawer como casilla vacía. |
| Problema | Una página abre un panel montado en otra rama | `LibraryPage` emite la intención y `PrivateLayout` conserva una instancia del drawer. Pasar props mediante `Outlet` no representa bien esa coordinación. | Árbol de rutas con página y drawer como ramas hermanas. |
| Contraste | En la clase 06 el ancestro estaba cerca | `App` poseía el modal y pasaba `onSelect`. Ahora el punto de apertura y el panel pertenecen a ramas distintas y habrá un segundo origen opcional. | Dos árboles lado a lado: modal local y drawer compartido. |
| Decisión | Guardar una identidad, no una respuesta | Zustand conserva `logId`; Query recibe el selector y conserva el DTO. | Diagrama `logId → query key → DTO`. |
| Estado válido | `null` también describe una interfaz | `null` significa cerrado; un string significa abierto para ese registro. `opened` se deriva y no puede contradecir la identidad. | Dos tarjetas de estado; tachar `opened: true + logId: null`. |
| API de Zustand | Store, acciones y selectores | `create<State>()`, `set` y selectores atómicos. Cada componente lee solo el value o acción que necesita. | Snippet del store sin middleware. |
| Arquitectura | Una instancia junto a `Outlet` | `PrivateLayout` monta el drawer una sola vez. La navegación cambia la hija del `Outlet`; el panel sigue disponible en el shell autenticado. | Árbol con `PrivateHeader`, `Outlet` y `MediaDetailDrawer`. |
| Flujo | La fila emite `onPreview(logId)` | `LibraryPage` obtiene `openDetail`, pero lista y fila reciben callbacks. Importar el store en la página no obliga a hacerlo en cada hijo. | Flechas desde página a lista y fila, luego al store. |
| Query | Cerrar cambia el input, no la caché | `logId: null` deshabilita la query. Abrir otra identidad produce otra key. No usar Effect para copiar o limpiar datos. | Línea temporal abrir A, cerrar, abrir B. |
| Reutilización | La vista rápida compone dos lecturas existentes | `MediaDetailContent` muestra catálogo y `SavedMediaDetails` muestra información personal. El drawer no copia la página completa. | Mockup del drawer con dos regiones etiquetadas. |
| React | Código y datos tienen esperas diferentes | `lazy` difiere el módulo y `Suspense` muestra su fallback. TanStack Query conserva pending y error del request. | Dos líneas temporales paralelas: chunk y HTTP. |
| Evidencia | Un chunk separado se comprueba | Build, preview y Network permiten observar el request del módulo. No concluir rendimiento sin una comparación medida. | Captura de `dist/assets` y Network. |
| Taller | Propagar, comprobar y demostrar | El checkpoint previo contiene todas las APIs nuevas. El taller conecta cada fila, completa navegación y ejecuta regresión. | Checklist sin mostrar el `LibraryMediaListItem` resuelto. |

### Indicaciones que deben sobrevivir a la producción de slides

- Recuperar la clase 06 antes de justificar Zustand. Allí el estado local era suficiente porque `App` era el ancestro común cercano.
- Zustand resuelve la identidad compartida del drawer; no reemplaza toda la gestión de estado del proyecto.
- `logId` es un value de interfaz y transporte. Título, poster, status, prioridad y notas permanecen fuera del store.
- `opened` se calcula con `logId !== null`. No guardarlo como boolean separado.
- Los selectores de Zustand son funciones que eligen qué parte del store consume un componente.
- `LibraryPage` puede consumir `openDetail` y seguir pasando `onPreview` a componentes presentacionales.
- Montar el drawer en `PrivateLayout` no significa que el layout deba conocer el DTO.
- `useMediaDetail(null)` conserva el orden de hooks y deshabilita la query existente.
- Cerrar el drawer no elimina la respuesta de Query Client.
- Cambiar de A a B debe mostrar B, el pending de B o la caché válida de B. Nunca debe rotular el DTO de A como B.
- El drawer conserva Escape, overlay, focus trap y retorno de foco de Mantine. No desactivar accesibilidad para simplificar.
- La vista rápida no incluye edición ni eliminación. Esas acciones permanecen en la página completa.
- `lazy` se declara en scope de módulo.
- La adaptación `{ default: module.PrivateMediaDetailPage }` resuelve el requisito local de `lazy` sin fijar una regla global de exports.
- El fallback de `Suspense` pertenece a la descarga del módulo. No llamar “fetching de la película” a ese momento.
- El proyecto no configura TanStack Query en modo Suspense durante esta clase.
- Un chunk separado demuestra que Vite dividió el código. La latencia y el beneficio real requieren medición.
- El calendario opcional llega en otro seed con dependencias, query y presentación terminadas.
- Ningún estudiante modifica el backend. El calendario opcional consume otra capacidad de la URL docente preparada.

### Snippets conceptuales para las slides

```ts
logId: null // cerrado
logId: "cm..." // abierto para un registro
```

```text
Zustand: logId
Query: DTO + pending + error + caché
```

```tsx
onPreview(item.logId)
```

```text
Suspense fallback → espera código
Query isPending   → espera datos
```

No mostrar en la presentación inicial la cadena completa de props resuelta en los tres componentes del taller.

### Cierre conceptual

1. ¿Qué estado inválido evitamos al derivar `opened` desde `logId`?
2. ¿Por qué el drawer puede consultar el mismo detalle sin copiarlo a Zustand?
3. ¿Por qué `LibraryMediaListItem` recibe `onPreview` aunque la página use un store?
4. ¿Qué evidencia distingue la carga de un chunk del pending de una query?

El cierre conecta las respuestas con el checkpoint final. Como no existe una clase 25, el docente termina con límites explícitos y posibles extensiones, no con una herramienta nueva.

## Proyecto semilla

### Seed base `s08-c24-mejoras-seed`

Incluye:

- CRUD, filtros en URL y pruebas puras.
- `MediaDetailContent`, `SavedMediaDetails` y sus adaptadores.
- `LibraryPage`, `LibraryMediaList` y `LibraryMediaListItem` con navegación a la página completa.
- `PrivateLayout` con `Outlet` y shell autenticado.
- `zustand@5.0.15` fijado en `package.json` y `pnpm-lock.yaml`.
- `MediaDetailDrawer` como shell visual compilable con props controladas, sin store ni query.
- Una página privada candidata para carga diferida.

No incluye:

- `media-detail-drawer-store.ts`.
- Montaje del drawer dentro de `PrivateLayout`.
- Query o estados remotos dentro del drawer.
- Acción “Vista rápida” en cada fila.
- Props `onPreview` en lista y fila.
- Configuración de `lazy` y `Suspense`.
- Dependencias, endpoint o UI de calendario.

### Comprobaciones antes de compartir

- `pnpm install` usa únicamente `pnpm-lock.yaml`.
- `pnpm build` y `pnpm test` terminan con exit code 0.
- Crear, listar, filtrar, consultar, editar, eliminar y cambiar status funcionan contra la URL docente.
- El shell del drawer no ejecuta una query.
- No existe un `logId` fijo, token, credencial o solución de `onPreview`.
- El backend no forma parte del seed.

### Seed opcional `s08-c24-calendar-extension`

Este seed se entrega solo a quien apruebe primero el encargo base. Incluye:

- Encargo base de la clase 24 ya resuelto; se entrega solo después de que el estudiante demuestre su propia solución.
- `@mantine/dates@9.4.1` y `dayjs@1.11.23` fijados.
- Estilos requeridos por Mantine Dates.
- DTO mínimo, fetcher, query key y hook del endpoint docente de calendario.
- Adaptador de la respuesta a eventos con `logId`.
- Vista mensual renderizada con estados pending, error, vacío y éxito.
- Prop `onEventPreview: (logId: string) => void` todavía sin conectar.

El estudiante no instala paquetes, diseña el contrato remoto ni aprende `Calendar` durante el reto. Solo conecta una intención ya enseñada.

## Estado inicial y transformación de archivos

### Antes de la clase

```text
src/
├── components/
│   ├── library-media-list.tsx          navegación completa
│   ├── library-media-list-item.tsx     sin vista rápida
│   └── media-detail-drawer.tsx         shell sin datos
├── layouts/private-layout.tsx          header + Outlet
├── pages/
│   ├── library-page.tsx
│   └── private-media-detail-page.tsx
└── App.tsx                              imports estáticos
```

### Checkpoint previo al taller

```text
src/
├── components/
│   └── media-detail-drawer.tsx         store, query y contenido
├── layouts/private-layout.tsx          monta una instancia
├── pages/
│   ├── library-page.tsx                botón temporal con primer resultado real
│   └── private-media-detail-page.tsx
├── stores/
│   └── media-detail-drawer-store.ts    logId nullable y dos acciones
└── App.tsx                              lazy + Suspense
```

El botón temporal usa `items[0]?.logId`; no contiene una identidad escrita a mano. Permite comprobar el store y la query antes de que el estudiante propague `onPreview`.

El docente puede compartir este checkpoint alternativo al terminar los 75 minutos. Contiene todas las APIs nuevas y omite la solución del taller.

### Checkpoint de salida

```text
src/
├── components/
│   ├── library-media-list.tsx          propaga onPreview
│   ├── library-media-list-item.tsx     acción secundaria por logId
│   └── media-detail-drawer.tsx         detalle rápido completo
├── layouts/private-layout.tsx          Outlet + drawer compartido
├── pages/
│   ├── library-page.tsx                conecta openDetail
│   └── private-media-detail-page.tsx   conserva acciones completas
├── stores/
│   └── media-detail-drawer-store.ts
└── App.tsx                              ruta privada diferida
```

## Antes del descanso · 75 minutos

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0–18 min | Docente y grupo | Usar el deck para recuperar propietarios de estado, comparar el modal de la clase 06 con el drawer y decidir la identidad mínima. |
| 18–33 min | Construcción guiada | Inspeccionar `zustand@5.0.15`, crear el store nullable y consumir selectores atómicos; comprobar apertura y cierre mediante la UI. |
| 33–50 min | Docente con participación | Montar `MediaDetailDrawer` en `PrivateLayout`, derivar el selector log y conectar `useMediaDetail` sin copiar el DTO. |
| 50–62 min | Construcción interactiva | Representar pending, error, entrada ausente y éxito; componer los dos componentes de lectura y preparar el destino de página completa. |
| 62–69 min | Demostración docente | Convertir la página privada en un módulo lazy, añadir `Suspense` y distinguir el fallback del pending remoto. |
| 69–75 min | Docente | Compartir el checkpoint alternativo, retirar dudas del encargo y explicar la puerta de acceso al seed opcional. |

### Estado 1 · Crear un store con una sola verdad

El docente muestra primero la forma descartada:

```ts
type DrawerState = {
  opened: boolean
  logId: string | null
}
```

El grupo enumera combinaciones posibles y encuentra `opened: true` con `logId: null`. Después construye el store aprobado con un `logId` nullable.

El seed ya contiene la dependencia. El comando de reproducción para crear otro checkpoint es:

```bash
pnpm add zustand@5.0.15
```

No se ejecuta `pnpm add` si el paquete ya figura en `package.json` y el lockfile.

### Estado 2 · Montar el drawer en el shell privado

`PrivateLayout` coloca una sola instancia después de `Outlet`. El docente abre React DevTools y comprueba que cambiar entre rutas privadas sustituye la página hija, mientras el drawer continúa en el shell.

`MediaDetailDrawer` transforma el `logId` nullable en `GetMediaDetailInput | null` y llama `useMediaDetail` sin retornos anteriores al hook.

### Estado 3 · Componer la respuesta

El grupo recupera el orden de estados de las clases 09, 12 y 19. La rama de éxito exige `entry`; después deriva los dos modelos existentes durante el render.

La comprobación usa un botón temporal en `LibraryPage`:

```tsx
const firstItem = items[0]

<Button
  disabled={firstItem === undefined}
  onClick={() => {
    if (firstItem !== undefined) openDetail(firstItem.logId)
  }}
>
  Probar primer resultado
</Button>
```

El botón prueba una identidad real de la respuesta y se elimina durante el taller.

### Estado 4 · Separar carga de código y carga de datos

El docente realiza el cambio de import estático a `lazy`, agrega la adaptación del export nombrado y coloca `Suspense` alrededor del elemento de ruta.

Primero ejecuta `pnpm build`. Después usa `pnpm preview`, deshabilita caché en Network y navega desde la biblioteca hacia un detalle. Si el fallback desaparece muy rápido, puede usar throttling del navegador; no añade un `setTimeout` al código del proyecto.

## Descanso · 30 minutos

No se introduce contenido nuevo después del descanso.

## Después del descanso · Taller de 60 minutos

### Encargo base

Convertir cada fila de la biblioteca en un punto de entrada al drawer compartido, conservar la navegación hacia la página completa y demostrar que la mejora no rompe el proyecto construido durante el curso.

### Trabajo obligatorio

#### 1. Propagar la intención de vista rápida · 15 minutos

- Leer `openDetail` una sola vez en `LibraryPage`.
- Añadir `onPreview: (logId: string) => void` a `LibraryMediaList`.
- Pasar la misma función a cada `LibraryMediaListItem`.
- Ejecutar `onPreview(item.logId)` desde “Vista rápida”.

Al terminar, eliminar el botón temporal “Probar primer resultado”.

#### 2. Comprobar identidades y estados · 15 minutos

- Abrir un registro y cerrarlo con el botón superior.
- Abrir un segundo registro sin abandonar la biblioteca.
- Usar Escape y clic en overlay.
- Forzar Offline, abrir un detalle sin caché y comprobar el error local.
- Volver Online y ejecutar “Reintentar”.

La revisión debe mirar título e identidad. Un Loader sin comprobar qué registro termina apareciendo no basta.

#### 3. Conservar la página completa · 12 minutos

- Mantener “Ver detalle” como acción principal de la fila.
- Añadir en el drawer un `Link` a `/app/library/${logId}`.
- Ejecutar `closeDetail()` desde el clic antes de navegar.
- Volver a la biblioteca y comprobar que la URL filtrada continúa siendo la fuente de filtros.

La página completa conserva edición y eliminación. El drawer no duplica esas acciones.

#### 4. Ejecutar regresión · 10 minutos

Completar este recorrido con datos propios:

```text
login
→ filtrar biblioteca
→ abrir vista rápida
→ ir a página completa
→ cambiar status
→ editar prioridad o notas
→ volver a biblioteca
→ reabrir vista rápida y confirmar dato actual
→ crear un registro descartable
→ eliminarlo
```

Registrar el primer fallo observado y corregirlo antes de intentar el reto adicional.

#### 5. Corregir o conectar el punto extra · 8 minutos

- Si falla un criterio base, usar los ocho minutos para corregirlo.
- Si todos los criterios base pasan, abrir `s08-c24-calendar-extension`.
- Conectar `onEventPreview` con la misma acción `openDetail`.
- Abrir dos eventos distintos y comprobar título, cierre y retorno de foco.

### Restricciones

- No guardar DTOs, modelos visuales, pending o errores en Zustand.
- No añadir `opened` al store.
- No crear otro store para la biblioteca.
- No copiar la respuesta a `useState`.
- No usar un Effect para abrir, cerrar, limpiar o consultar.
- No importar el store dentro de cada fila.
- No retirar el `Link` hacia la página completa.
- No duplicar edición ni eliminación dentro del drawer.
- No desactivar Escape, overlay, focus trap o retorno de foco.
- No cambiar query keys o contratos del backend.
- No modificar, ejecutar o configurar `medialog-server`.
- No construir el calendario, su query o su DTO durante el taller.

### Reto adicional con puntaje extra

Conectar los eventos ya renderizados por `s08-c24-calendar-extension` con el drawer compartido.

El reto se aprueba cuando:

- Un evento entrega su `logId` a `onEventPreview`.
- El mismo `openDetail` abre el drawer.
- Dos eventos muestran registros correctos.
- Cerrar devuelve el foco al evento que inició la interacción.

No se evalúan drag and drop, edición, vistas semanales, creación de eventos o diseño del endpoint.

## Actividades del docente durante el taller

- Revisar primero que el store contenga solo `logId` y acciones.
- Pedir al estudiante que señale quién conserva la identidad y quién conserva el DTO.
- Seguir la firma de `onPreview` desde página, lista y fila antes de depurar la query.
- Pedir apertura A, cambio a B, cierre y reapertura de A.
- Comprobar error sin caché; Offline sobre una key cacheada puede seguir mostrando datos válidos.
- Exigir la regresión base antes de entregar el seed opcional.
- Evitar explicar Mantine Dates durante el taller; el seed adicional debe ser legible con conceptos ya vistos.
- Registrar fallos del contrato docente sin convertirlos en tareas de backend para los estudiantes.

## Actividades de los estudiantes durante el taller

- Dibujar la cadena `LibraryPage → LibraryMediaList → LibraryMediaListItem` antes de editar props.
- Mantener la firma `(logId: string) => void` en toda la cadena.
- Eliminar el botón temporal después de conectar cada fila.
- Verificar tres identidades y un error recuperable.
- Ejecutar el recorrido de regresión y anotar evidencia.
- Preparar una demostración de hasta tres minutos.
- Explicar una decisión técnica que conservarían y una que revisarían en una segunda versión.

## Revisión y demostraciones · 15 minutos

| Tiempo | Actividad |
| --- | --- |
| 0–9 min | Revisión por parejas: una persona ejecuta el recorrido y otra marca criterios con evidencia. Después intercambian una explicación técnica. |
| 9–15 min | Dos demostraciones breves y cierre conceptual con el deck. El grupo distingue identidad, DTO, chunk y request. |

La revisión no intenta repetir las 23 clases. El recorrido muestra una búsqueda o filtro, una lectura rápida, la página completa y una mutación ya construida.

## Criterios de aceptación

- Zustand conserva `logId: string | null`, `openDetail` y `closeDetail`; no conserva DTOs.
- `opened` se deriva desde `logId`.
- `PrivateLayout` monta una sola instancia de `MediaDetailDrawer` junto a `Outlet`.
- `LibraryPage` consume `openDetail`; lista y fila reciben `onPreview` por props.
- La acción secundaria abre el registro correcto sin cambiar la URL.
- La acción principal conserva `/app/library/:logId`.
- El drawer representa pending, error, entrada ausente y éxito.
- Cambiar entre tres registros no presenta una identidad anterior como actual.
- Cerrar deshabilita la query mediante input `null` y no borra la caché.
- El drawer reutiliza `MediaDetailContent` y `SavedMediaDetails`.
- Editar o cambiar status en la página completa se refleja al volver a consultar el drawer.
- La página privada se carga mediante `lazy` declarado en scope de módulo.
- `Suspense` se usa para el chunk y Query conserva los estados de datos.
- `pnpm test` y `pnpm build` terminan con exit code 0.
- El recorrido CRUD principal continúa funcionando.

## Entrega y evidencia de salida

El estudiante entrega:

- Código del checkpoint final.
- Grabación de hasta tres minutos.
- Captura o registro de Network que diferencie el chunk del request de detalle.
- Resultado de `pnpm test` y `pnpm build`.
- Checklist de regresión con el primer fallo encontrado o la indicación “sin fallos observados en este recorrido”.
- Una decisión técnica que mantendría y otra que revisaría.

Checkpoint observable:

> Una acción secundaria de cualquier fila abre el registro correcto en un drawer montado en el layout; Zustand conserva solo `logId`, TanStack Query conserva el DTO y la página privada permanece disponible en un chunk diferido. El recorrido de regresión termina sin romper el CRUD obligatorio.

## Fuera de alcance

- Guardar datos remotos o sesión en Zustand.
- Persistir el drawer entre recargas.
- Sincronizar el drawer con query params o rutas modales.
- Habilitar Suspense para TanStack Query.
- Medir Core Web Vitals o afirmar una ganancia de rendimiento general.
- Añadir React Testing Library, jsdom o pruebas del drawer con DOM.
- Editar o eliminar desde el drawer.
- Construir calendario, drag and drop o vistas semanales durante el taller.
- Cambiar endpoints, auth middleware, jobs o configuración del backend.

## Vocabulario

- **Store externo:** contenedor de estado que componentes distintos pueden consultar mediante una API compartida.
- **Selector de Zustand:** función que devuelve la parte del store que un componente necesita.
- **Identidad nullable:** value que usa `null` para representar ausencia y un identificador para representar selección.
- **Estado de interfaz:** dato que describe una interacción visual, como qué registro abre el drawer.
- **Estado remoto:** dato cuya fuente de verdad se encuentra en el backend y que TanStack Query conserva en caché.
- **Drawer:** panel superpuesto que presenta información sin abandonar la pantalla actual.
- **Focus trap:** comportamiento que mantiene la navegación por teclado dentro de un overlay abierto.
- **Retorno de foco:** devolución del foco al control que abrió un overlay después de cerrarlo.
- **Carga diferida:** descarga de un módulo cuando React intenta renderizarlo por primera vez.
- **Chunk:** archivo JavaScript generado por el bundler como unidad de descarga.
- **Fallback:** interfaz temporal que `Suspense` muestra mientras espera contenido suspendido.
- **Regresión:** comportamiento existente que deja de funcionar después de un cambio.
- **Throttling:** limitación simulada de red usada para observar una descarga.

## Referencias para preparar la clase

- [Zustand · README y API básica](https://github.com/pmndrs/zustand)
- [React · `lazy`](https://react.dev/reference/react/lazy)
- [React · `Suspense`](https://react.dev/reference/react/Suspense)
- [Mantine · Drawer](https://mantine.dev/core/drawer/)
- [Mantine · Calendar](https://mantine.dev/dates/calendar/)
- [Mantine Dates · instalación](https://mantine.dev/dates/getting-started/)

La cohorte fija Zustand `5.0.15`. El docente vuelve a verificar la versión, sus peer dependencies y las versiones de Mantine Dates y Day.js antes de publicar los seeds. La API de calendario pertenece al material opcional preparado y no a la construcción base de la clase.
