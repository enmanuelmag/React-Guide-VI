# Clase 06 · Taller de selección y modal de detalle

- **Semana:** 2
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** proyecto semilla `s02-c06-seleccion-modal-seed`, basado en `s02-c05-filtros-combinados`
- **Checkpoint alternativo antes del taller:** `s02-c06-seleccion-base`
- **Checkpoint de salida:** explorador local filtrable donde cada tarjeta abre su detalle en un `Modal` controlado

## Resultado de aprendizaje

Al terminar, el estudiante podrá guardar una selección mediante su identidad, ubicar ese estado en el ancestro común y seguir una función desde su definición en `App` hasta su ejecución en `MediaCard`.

## Propósito de la clase

La clase 05 terminó con filtros combinados. La colección cambia, pero ninguna tarjeta permite consultar su detalle. Esta presencial añade un recorrido nuevo sin retirar el checkpoint anterior:

```text
clic en MediaCard
→ onSelect(data.id)
→ handleSelectMedia(mediaId)
→ setSelectedMediaId(mediaId)
→ App renderiza de nuevo
→ selectedMedia se calcula con find
→ Modal recibe opened={selectedMedia !== null}
```

Antes del descanso, el grupo configura Mantine y construye una selección base mediante un disparador temporal en `App`. También estudia la firma de `onSelect` en los tres componentes. Después del descanso, cada estudiante conecta el mismo handler con todas las tarjetas y elimina el disparador temporal.

## Conceptos que se introducen antes del descanso

- Selección por identidad.
- Estado mínimo mediante `number | null`.
- `find` como cálculo derivado.
- Ancestro común para compartir estado.
- Función callback pasada como prop.
- Referencia de función frente a ejecución de función.
- Handler que conserva `data.id` mediante una closure.
- Firma `(mediaId: number) => void`.
- Modal controlado mediante `opened` y `onClose`.
- Provider de una librería de componentes.
- Límite entre estado local y store compartido.

## Conceptos que se aplican durante el taller

- Props tipadas en `MediaGrid` y `MediaCard`.
- Reenvío de una referencia sin cambiar su firma.
- Closure del handler de `onClick` para entregar `data.id`.
- Renderizado condicional del contenido seleccionado.
- Cierre mediante actualización directa del estado.
- Verificación del flujo con React DevTools.

## Decisiones didácticas

- La clase parte del checkpoint real de la clase 05. No desconecta ni reconstruye los filtros.
- El seed aporta `MediaDetailContent` como componente de presentación, pero no instala Mantine ni contiene selección.
- Antes del descanso, `App` define `handleSelectMedia(mediaId: number)` y posee `selectedMediaId`.
- `MediaGrid` y `MediaCard` reciben la misma firma: `(mediaId: number) => void`.
- `MediaGrid` reenvía `onSelect` sin adaptarlo. `MediaCard` conoce `data.id` y ejecuta `onSelect(data.id)`.
- El grupo usa un botón temporal en `App` para comprobar selección, modal y cierre antes de distribuir el callback.
- El taller elimina ese botón cuando cada tarjeta ya puede originar la acción.
- `selectedMedia` se busca en el fixture completo, no en `visibleMedia`.
- `isDetailOpened` se deriva desde `selectedMedia !== null`; no existe otro booleano de apertura.
- La clase usa `Modal` de Mantine sin `useDisclosure`.
- Zustand queda reservado para el modal global de creación de la sesión 11. `App` ya es el ancestro común cercano y no necesita un store.

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 15 minutos. Recupera los dos estados de filtros, presenta la selección por identidad y dibuja el recorrido completo de `onSelect`. La explicación sobre Zustand aparece aquí como decisión de arquitectura, no como tutorial de la librería. Los 15 minutos finales regresan al deck para reconstruir el flujo y anticipar la API de la clase 07.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Lo que ya funciona | `query` y `mediaTypeFilter` viven en `App`; `visibleMedia`, los mensajes y el contador se calculan. Los filtros no se reconstruirán en esta clase. | Captura del checkpoint 05 y mapa “estado → cálculo → interfaz”. |
| Problema | Elegir una tarjeta | El modal necesita saber qué medio debe mostrar. Un booleano solo respondería si está abierto; no respondería cuál es la selección. | Dos preguntas: “¿está abierto?” y “¿qué medio está abierto?”. |
| Decisión | Guardar identidad, calcular objeto | `selectedMediaId: number | null` conserva la decisión. `find` recupera el objeto desde `mediaItems`. | Comparación entre guardar el objeto y guardar el id. Marcar la duplicación del primer caso. |
| Estado | `null` representa ausencia | `null` significa que no hay selección; un número identifica un elemento. `selectedMedia !== null` determina la apertura. | Diagrama con dos estados válidos. No usar un booleano adicional. |
| Arquitectura | El origen está en `App` | `App` contiene el estado, define `handleSelectMedia` y renderiza el modal. Por eso la función que actualiza la selección nace allí. | Árbol `App → MediaGrid → MediaCard` junto a la rama `App → Modal`. |
| Flujo | Una referencia baja por el árbol | `App` pasa `handleSelectMedia` como `onSelect`. `MediaGrid` reenvía la misma referencia. `MediaCard` la ejecuta con `data.id`. La función no sube desde la tarjeta. | Flechas con el nombre que recibe la prop en cada nivel. Mantener visible la firma común. |
| Firma | Un contrato en tres componentes | `handleSelectMedia`, `MediaGridProps.onSelect` y `MediaCardProps.onSelect` usan `(mediaId: number) => void`. El estudiante puede seguir el mismo dato sin una adaptación intermedia. | Tabla de archivo, nombre y firma. |
| Distinción | Pasar no es ejecutar | `onSelect={onSelect}` pasa una referencia. `onClick={() => onSelect(data.id)}` crea un handler que conserva acceso a `data.id`; esa función es una closure. `onClick={onSelect(data.id)}` ejecutaría la función durante el render. | Comparación de tres snippets. Pedir que predigan cuándo corre cada uno. Definir closure en un pie breve. |
| Herramienta | React decide, Mantine presenta | Mantine aporta el diálogo y sus mecanismos de cierre. `App` decide el medio, `opened`, `title`, contenido y respuesta a `onClose`. | Dos columnas: responsabilidad de React y responsabilidad de Mantine. |
| Arquitectura | Por qué todavía no usamos Zustand | `App` es el ancestro común cercano y pasar el callback por un componente intermedio sigue siendo explícito. Un store ocultaría el flujo que el grupo necesita practicar. | Árbol actual con solo dos niveles. Nota: Zustand sería posible, pero no resolvería una necesidad presente. |
| Futuro | Cuándo sí aparecerá Zustand | El modal de creación podrá abrirse desde búsqueda y detalle público, dos páginas diferentes. Allí un store de identidad evita trasladar la apertura por rutas y layouts. Guardará `mediaType + externalId`; TanStack Query conservará el DTO remoto. | Comparación visual “modal local ahora” frente a “modal global en la sesión 11”. |
| Puente | Qué queda listo antes del taller | Mantine configurado, selección derivada y modal funcional desde un botón temporal de `App`. El taller llevará el origen del evento a cada tarjeta. | Checkpoint `s02-c06-seleccion-base`. No mostrar los cuerpos completos de `MediaGrid` y `MediaCard`. |

### Indicaciones que deben sobrevivir a la producción de slides

- Los filtros de la clase 05 permanecen terminados. La clase 06 añade selección y detalle.
- `selectedMediaId` representa una decisión del usuario; `selectedMedia` representa un cálculo.
- El fixture conserva el objeto completo. Guardar otra copia en estado permitiría que ambas versiones se separen.
- `App` es el origen de `handleSelectMedia` porque allí vive `selectedMediaId`.
- `App` pasa la referencia de `handleSelectMedia` hacia abajo. `MediaCard` no obtiene acceso directo a `setSelectedMediaId`.
- `MediaGrid` funciona como intermediario explícito y no crea estado ni otra función.
- Las tres capas usan `(mediaId: number) => void` para reducir transformaciones durante el primer recorrido de callbacks.
- `MediaCard` ejecuta `onSelect(data.id)` dentro de una función de `onClick`.
- El clic no transporta el estado hacia arriba. Ejecuta una referencia creada por `App`; esa función actualiza el estado donde fue definida.
- React ejecuta otro render después de `setSelectedMediaId`; entonces `find` calcula `selectedMedia` con el nuevo id.
- `selectedMedia` se busca en `mediaItems`. Los filtros deciden qué tarjetas se ven, pero no se convierten en la fuente de identidad.
- `opened={selectedMedia !== null}` evita coordinar selección y booleano.
- `onClose` responde a un evento conocido y ejecuta `setSelectedMediaId(null)` sin Effect.
- Mantine no posee la selección del producto. Recibe props controladas desde `App`.
- Zustand puede usarse técnicamente, pero esta pantalla no lo necesita. El deck debe justificar la decisión mediante el árbol actual.
- El modal global posterior sí tendrá disparadores en búsqueda y detalle público. Zustand guardará una identidad mínima para coordinarlo.
- Zustand no almacenará respuestas de búsqueda, detalle o biblioteca. TanStack Query seguirá siendo el propietario del estado remoto.
- La presentación nombra la sesión 11 como destino de Zustand, pero no muestra todavía `create`, selectors ni código del store.

### Cierre conceptual

El cierre plantea cuatro preguntas:

1. ¿Dónde se define `handleSelectMedia` y por qué ese componente es su origen?
2. ¿Qué ocurre desde el clic hasta que `Modal` recibe `opened={true}`?
3. ¿Por qué Zustand añadiría complejidad sin resolver un problema actual?
4. ¿Qué diferencia futura hará que el modal de creación sí necesite una identidad compartida?

La revisión termina con otra limitación: el modal solo conoce los medios incluidos en el fixture. La clase 07 presentará cómo solicitar búsqueda y detalle a un servidor.

## Proyecto semilla

### Nombre propuesto

`s02-c06-seleccion-modal-seed`

### Árbol relevante

```text
src/
├── components/
│   ├── app-header.tsx
│   ├── empty-state.tsx
│   ├── media-card.tsx
│   ├── media-detail-content.tsx
│   ├── media-grid.tsx
│   ├── media-type-badge.tsx
│   ├── media-type-filter.tsx
│   └── search-input.tsx
├── data/
│   └── media-items.ts
├── types/
│   └── media.ts
├── App.tsx
├── index.css
└── main.tsx

package.json
pnpm-lock.yaml
```

### Qué incluye

- Todo el checkpoint `s02-c05-filtros-combinados`.
- `query` y `mediaTypeFilter` controlados desde `App`.
- `visibleMedia`, `hasActiveFilters`, `hasNoResults` y `resultCount` derivados.
- Contador, limpieza de filtros y mensajes vacíos correctos.
- `MediaItem` con `description: string | null` y un fixture con al menos una descripción nula.
- `MediaDetailContent` preparado por el docente. Recibe un `MediaItem` y presenta poster, tipo, fecha y descripción o fallback.
- Proyecto que inicia mediante `pnpm dev` y termina `pnpm build` sin errores.

`MediaDetailContent` funciona como material proporcionado porque la dificultad principal del taller es el flujo de estado. El componente no contiene estado, fetching, modal ni callback de cierre.

### Qué omite

- Dependencias y configuración de Mantine.
- `MantineProvider` y estilos de Mantine.
- `selectedMediaId`, `selectedMedia` e `isDetailOpened`.
- Funciones `handleSelectMedia` y `handleCloseDetail`.
- Prop `onSelect` en `MediaGrid` y `MediaCard`.
- Botón “Ver detalle” en las tarjetas.
- `Modal` conectado a la selección.
- Zustand y cualquier store compartido.

### Comprobación previa del docente

Antes de compartir el seed, el docente debe:

1. Ejecutar `pnpm install` con el lockfile de la cohorte.
2. Comprobar texto, tipo, filtros combinados y limpieza.
3. Probar “Catálogo vacío” y “Sin resultados”.
4. Revisar la entrada con `description: null` dentro de `MediaDetailContent` mediante una prueba temporal y retirar esa prueba.
5. Ejecutar `pnpm build`.
6. Confirmar que no existen Mantine, selección, `onSelect` ni modal en el código entregado.

El seed no usa callbacks vacíos, comentarios pendientes ni errores de TypeScript para representar el trabajo del estudiante.

## Antes del descanso · Explicación y progreso guiado · 75 minutos

| Tiempo | Responsable | Progreso y comprobación |
| --- | --- | --- |
| 0-15 min | Docente y grupo | Usar el deck para recuperar los filtros, comparar id frente a objeto y dibujar el flujo completo de `onSelect`. Incluir el recordatorio sobre Zustand. |
| 15-28 min | Docente con participación | Instalar Mantine con pnpm, configurar PostCSS, estilos y `MantineProvider`, y ejecutar desarrollo y build. |
| 28-40 min | Construcción interactiva | Crear `selectedMediaId`, derivar `selectedMedia` e `isDetailOpened`, y definir handlers de selección y cierre en `App`. |
| 40-52 min | Demostración docente | Conectar `Modal` y `MediaDetailContent`; usar un botón temporal de `App` para abrir el primer medio y comprobar el cierre. |
| 52-65 min | Docente y grupo | Recorrer las firmas de `onSelect` en `App`, `MediaGrid` y `MediaCard`; contrastar referencia y ejecución sin implementar todavía el recorrido completo. |
| 65-75 min | Docente y estudiantes | Auditar el checkpoint, explicar el taller, formar parejas de revisión y compartir el checkpoint alternativo. |

### Flujo guiado antes del descanso

#### Paso 1 · Configuración mínima de Mantine

El docente guía la instalación con pnpm:

```bash
pnpm add @mantine/core@9.4.1 @mantine/hooks@9.4.1
pnpm add --save-dev postcss postcss-preset-mantine postcss-simple-vars
```

El proyecto crea `postcss.config.cjs` con la configuración recomendada por Mantine para Vite. `main.tsx` importa los estilos y coloca el provider alrededor de `App`:

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"

import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
)
```

La clase no configura theme ni explica Context API. El grupo ejecuta `pnpm build` antes de añadir selección para separar problemas de instalación de los cambios de React.

#### Paso 2 · El estado y sus cálculos viven en `App`

```tsx
const [selectedMediaId, setSelectedMediaId] =
  useState<number | null>(null)

const selectedMedia =
  mediaItems.find((media) => media.id === selectedMediaId) ?? null

const isDetailOpened = selectedMedia !== null
```

`selectedMediaId` cambia por una acción del usuario. `selectedMedia` e `isDetailOpened` se recalculan. El objeto se busca en `mediaItems`, que conserva la fuente completa.

`App` define las funciones que actualizan su estado:

```tsx
function handleSelectMedia(mediaId: number) {
  setSelectedMediaId(mediaId)
}

function handleCloseDetail() {
  setSelectedMediaId(null)
}
```

La firma de selección empieza aquí:

```ts
(mediaId: number) => void
```

#### Paso 3 · Comprobar el modal con un disparador temporal

El grupo no pasa todavía la función por las tarjetas. `App` usa la primera entrada solo para comprobar la arquitectura vertical:

```tsx
const previewMedia = mediaItems[0] ?? null

{previewMedia !== null ? (
  <button
    type="button"
    onClick={() => handleSelectMedia(previewMedia.id)}
  >
    Probar detalle
  </button>
) : null}
```

El modal consume la selección real, no un booleano temporal:

```tsx
<Modal
  opened={isDetailOpened}
  onClose={handleCloseDetail}
  title={selectedMedia?.title ?? "Detalle"}
  centered
>
  {selectedMedia !== null ? (
    <MediaDetailContent media={selectedMedia} />
  ) : null}
</Modal>
```

Escape, overlay y control de cierre llaman `onClose`. `App` responde limpiando la identidad.

#### Paso 4 · Explicar el recorrido de `onSelect`

El docente presenta los tres contratos antes del taller.

En `App` vive la función original:

```tsx
function handleSelectMedia(mediaId: number) {
  setSelectedMediaId(mediaId)
}

<MediaGrid
  mediaItems={visibleMedia}
  onSelect={handleSelectMedia}
/>
```

`MediaGrid` recibe y reenvía la misma referencia:

```tsx
type MediaGridProps = {
  mediaItems: MediaItem[]
  onSelect: (mediaId: number) => void
}

<MediaCard
  key={media.id}
  data={media}
  onSelect={onSelect}
/>
```

`MediaCard` conoce la identidad de su elemento y ejecuta la función durante el clic:

```tsx
type MediaCardProps = {
  data: MediaItem
  onSelect: (mediaId: number) => void
}

<button
  type="button"
  onClick={() => onSelect(data.id)}
>
  Ver detalle
</button>
```

El docente debe verbalizar el recorrido sin decir que la función “sube”:

```text
App crea handleSelectMedia
→ App entrega su referencia a MediaGrid
→ MediaGrid entrega la misma referencia a MediaCard
→ MediaCard ejecuta la referencia con data.id
→ handleSelectMedia actualiza el estado de App
→ React renderiza App y recalcula selectedMedia
```

La tarjeta comunica una acción. No recibe el setter ni conoce el modal.

### Recordatorio de arquitectura · Estado local ahora, Zustand después

El docente dibuja el árbol actual:

```text
App
├── MediaGrid
│   └── MediaCard
└── Modal
```

`App` contiene las ramas que producen y consumen la selección. Dos niveles de props permiten observar el flujo completo. Añadir Zustand ahora exigiría instalar una dependencia, crear un store y enseñar selectors sin eliminar una dificultad real.

La sesión 11 presentará otro árbol:

```text
PublicLayout
├── SearchPage
├── MediaDetailPage
└── CreateMediaLogModal
```

Dos páginas podrán abrir el mismo modal de creación. Allí Zustand guardará `mediaType + externalId` y acciones para abrir o cerrar. El modal consultará el detalle con TanStack Query. El store no copiará el DTO, los valores del formulario ni el estado de sesión.

Esta comparación debe aparecer en las futuras diapositivas. La clase 06 solo explica la decisión; la sesión 11 enseñará la API de Zustand.

### Checkpoint previo al taller

El docente puede compartir `s02-c06-seleccion-base` si un estudiante no termina el bloque guiado. Debe cumplir estas condiciones:

- Los filtros, contador, limpieza y mensajes de la clase 05 continúan funcionando.
- Mantine, PostCSS, estilos y `MantineProvider` están configurados.
- `App` contiene `selectedMediaId`, `selectedMedia`, `isDetailOpened`, `handleSelectMedia` y `handleCloseDetail`.
- El botón temporal “Probar detalle” abre el primer medio mediante `handleSelectMedia(previewMedia.id)`.
- El modal muestra `MediaDetailContent` y cierra al limpiar `selectedMediaId`.
- `MediaGrid` y `MediaCard` todavía no reciben `onSelect`.
- Las tarjetas todavía no contienen “Ver detalle”.
- Zustand no está instalado.
- `pnpm build` termina sin errores.

El checkpoint demuestra todos los conceptos necesarios y omite la conexión que el taller debe resolver.

## Descanso · 30 minutos

## Después del descanso · Taller · 60 minutos

### Encargo

El modal funciona desde un botón temporal de `App`. Lleva el origen de la interacción a cada tarjeta sin mover el estado. Todas las tarjetas deben ejecutar la misma función definida en `App` y entregar su propio `data.id`.

### Ruta de trabajo sugerida

| Tiempo | Objetivo | Evidencia antes de continuar |
| --- | --- | --- |
| 0-10 min | Añadir `onSelect: (mediaId: number) => void` al contrato de `MediaGrid`. | TypeScript señala que `App` debe entregar la nueva prop. |
| 10-25 min | Añadir la misma firma a `MediaCard`, reenviar la referencia desde el `map` y crear el botón “Ver detalle”. | Cada botón ejecuta `onSelect(data.id)` dentro de su `onClick`. |
| 25-35 min | Pasar `handleSelectMedia` desde `App` y retirar “Probar detalle” y `previewMedia`. | La aplicación compila y no quedan referencias al disparador temporal. |
| 35-45 min | Abrir película, serie y descripción nula; comprobar título, contenido y cierre. | Cada tarjeta presenta su propio objeto y cerrar devuelve el id a `null`. |
| 45-52 min | Auditar estado, cálculos y props con React DevTools; explicar por qué no se usó Zustand. | El estudiante identifica el origen de la función y los consumidores del estado. |
| 52-60 min | Ejecutar la matriz de recorridos y `pnpm build`. | Los casos base pasan o el estudiante registra el caso pendiente y su causa. |

### Trabajo obligatorio

1. Añadir `onSelect: (mediaId: number) => void` a `MediaGridProps`.
2. Pasar `onSelect={handleSelectMedia}` desde `App`.
3. Reenviar `onSelect` sin modificarlo desde `MediaGrid` hasta cada `MediaCard`.
4. Añadir la misma firma a `MediaCardProps`.
5. Crear un botón “Ver detalle” con `type="button"`.
6. Ejecutar `onSelect(data.id)` dentro del handler de `onClick`.
7. Retirar el botón “Probar detalle” y la variable `previewMedia`.
8. Conservar `selectedMediaId` como único estado de selección.
9. Mantener `selectedMedia` e `isDetailOpened` como cálculos.
10. Comprobar cierre mediante control, Escape y overlay.
11. Probar el fallback “Sin descripción disponible”.
12. Explicar el recorrido completo sin afirmar que la función se mueve hacia arriba.

### Restricciones

- No usar Zustand, Context API ni otro store.
- No mover `selectedMediaId` fuera de `App`.
- No pasar `setSelectedMediaId` directamente a los hijos.
- No guardar una copia del objeto `MediaItem` seleccionado.
- No crear un booleano de apertura.
- No cambiar la firma de `onSelect` entre `App`, `MediaGrid` y `MediaCard`.
- No ejecutar `onSelect(data.id)` durante el render.
- No buscar `selectedMedia` en `visibleMedia`.
- No usar `useEffect`, `useMemo` ni `useDisclosure`.
- No introducir API, TanStack Query, React Router o persistencia local.

### Ayudas graduadas

El docente entrega una ayuda a la vez:

1. **Origen:** busca el componente que contiene `setSelectedMediaId`.
2. **Firma:** escribe `(mediaId: number) => void` junto a las tres capas del árbol.
3. **Reenvío:** `MediaGrid` no conoce qué tarjeta fue pulsada; puede pasar la misma referencia.
4. **Ejecución:** `MediaCard` conoce `data.id` y lo entrega dentro de `() => ...`.
5. **Render:** revisa qué calcula `App` después de actualizar el id.

La ayuda no entrega archivos completos ni propone un store para evitar el recorrido.

### Actividades del docente durante el taller

- Revisar primero la firma y el origen de la función.
- Pedir al estudiante que señale dónde vive el estado antes de corregir props.
- Comparar `onSelect={onSelect}` con `onClick={() => onSelect(data.id)}`.
- Mostrar el error de ejecutar una función durante el render solo mediante un snippet, sin romper el checkpoint compartido.
- Seguir un id con React DevTools y un log temporal dentro de `handleSelectMedia`.
- Retirar el log después de comprobar el flujo.
- Pedir la justificación de estado local antes de hablar del modal global futuro.

### Actividades de los estudiantes durante el taller

- Dibujar el árbol y escribir la firma junto a cada componente.
- Actualizar un contrato por vez y leer el siguiente error de TypeScript.
- Probar una tarjeta después de completar el primer recorrido.
- Intercambiar la aplicación para abrir tres elementos diferentes.
- Explicar a un compañero la diferencia entre pasar y ejecutar una función.
- Identificar qué parte cambiaría si el modal dejara de vivir bajo `App`.
- Preparar la explicación breve de salida.

### Reto adicional · Nombre accesible por tarjeta

Después de cumplir el alcance base, añadir un nombre accesible que identifique el medio:

```tsx
aria-label={`Ver detalle de ${data.title}`}
```

El texto visible puede conservar “Ver detalle”. El reto no añade estado ni cambia el callback.

## Revisión y cierre · 15 minutos

### Matriz de recorridos

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Filtros conservados | Buscar y elegir un tipo | El comportamiento de la clase 05 sigue funcionando. |
| Primera selección | Abrir una película | `selectedMediaId` recibe su id y el modal muestra esa película. |
| Segunda selección | Cerrar y abrir una serie | El contenido corresponde a la serie, no a la selección anterior. |
| Descripción nula | Abrir la entrada preparada | Aparece “Sin descripción disponible”. |
| Cierre | Usar control, Escape y overlay | `selectedMediaId` vuelve a `null`. |
| Flujo | Seguir una tarjeta con React DevTools | El estudiante ubica estado en `App` y props en los hijos. |
| Build | Ejecutar `pnpm build` | TypeScript y Vite terminan sin errores. |

El docente ejecuta dos casos frente al grupo. Las parejas comprueban los demás y luego responden las preguntas del cierre conceptual.

## Criterios de aceptación

- El checkpoint de filtros de la clase 05 permanece funcional.
- Mantine está configurado y `pnpm build` termina sin errores.
- `App` posee `selectedMediaId` y define `handleSelectMedia`.
- `selectedMedia` se calcula con `find` desde `mediaItems`.
- `isDetailOpened` se calcula desde la presencia de `selectedMedia`.
- `MediaGridProps` y `MediaCardProps` usan `(mediaId: number) => void`.
- `MediaGrid` reenvía la misma referencia recibida.
- `MediaCard` ejecuta `onSelect(data.id)` dentro del clic.
- Cada tarjeta abre su propio detalle.
- El modal cierra mediante `setSelectedMediaId(null)`.
- `MediaDetailContent` muestra descripción o fallback.
- No quedan “Probar detalle” ni `previewMedia`.
- No se usan Zustand, Effect, objeto seleccionado en estado ni booleano de apertura.
- El estudiante puede explicar `App define → props bajan → MediaCard ejecuta → App actualiza → React calcula`.
- El estudiante puede justificar por qué el modal global posterior sí tendrá un caso para Zustand.

## Entrega

El estudiante entrega:

- El código del checkpoint final.
- Una grabación de hasta 90 segundos que muestre filtros, apertura de dos medios y cierre.
- Una respuesta breve: “¿Dónde se origina `onSelect` y por qué todavía no usamos Zustand?”.

El reto de nombre accesible no forma parte de la entrega base.

## Fuera del alcance

- API de Zustand, creación de stores y selectors.
- Modal global de creación y su store compartido.
- HTTP, JSON remoto, DTO y `fetch`.
- TanStack Query y estados de carga o error remoto.
- Identidad pública `mediaType + externalId`.
- React Router y una URL de detalle.
- `useEffect`, `useMemo` y `useDisclosure`.
- Formularios dentro del modal.
- Persistencia en `localStorage`.
- Pruebas automatizadas; la clase usa una matriz manual de recorridos.

## Vocabulario

- **Selección:** identidad que representa el elemento elegido por el usuario.
- **Identidad mínima:** dato suficiente para localizar una entidad sin copiar el objeto completo.
- **Ancestro común:** componente más cercano que contiene las ramas que producen y consumen un estado compartido.
- **Callback:** función entregada a otro componente para que pueda comunicar una acción.
- **Referencia de función:** valor que permite entregar una función sin ejecutarla en ese momento.
- **Firma de función:** descripción de los argumentos que recibe una función y del valor que devuelve.
- **Closure:** función que conserva acceso a valores del contexto donde se creó; el handler usa `media.id` cuando ocurre el clic.
- **Prop drilling:** paso explícito de props por componentes intermedios.
- **Modal controlado:** diálogo cuya apertura y cierre dependen de props administradas por un componente padre.
- **Store compartido:** contenedor de estado al que pueden suscribirse componentes de ramas diferentes.

## Referencia docente

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Mantine with Vite](https://mantine.dev/guides/vite/)
- [Mantine Modal](https://mantine.dev/core/modal/)
- [Zustand introduction](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)

La cohorte fija React/React DOM `19.2.8` y Mantine `9.4.1`. Al implementar el seed, el docente comprueba esas versiones en `package.json` y `pnpm-lock.yaml` antes de continuar con las clases que añaden Form y Router.
