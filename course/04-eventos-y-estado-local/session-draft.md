# Sesión 04 · Eventos y `useState`

> Estado: paquete textual aprobado definitivamente. La presentación HTML está aprobada; la implementación progresiva y sus checkpoints están completos.

- **Fecha:** lunes 28 de septiembre de 2026
- **Semana:** 2
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Punto de entrada

La entrada `session-04-start` coincide exactamente con `session-03-end`. La salida es `session-04-end`; sus pasos son controlled-query, derived-search y search-input. La sesión parte del checkpoint canónico de la sesión 03. El proyecto usa React `19.2.8`, TypeScript `6.0.3`, Vite y pnpm `11.17.0`.

El proyecto contiene:

- `App`, que elige el fixture `mediaItems`.
- `MediaGrid`, que recibe `items: MediaItem[]`, conserva `map` y coloca `media.id` como key.
- `EmptyState`, que recibe `title` y `description`.
- `MediaCard` y `MediaTypeBadge`.
- Seis medios, incluidos películas, series y casos nulos.
- El mensaje “Catálogo vacío” cuando `MediaGrid` recibe `[]`.

No existe estado ni interacción. `App` renderiza:

```tsx
<MediaGrid items={mediaItems} />
```

La apertura comprueba el catálogo en el navegador y ejecuta una regresión corta de la sesión 03. El docente no reconstruye el taller anterior.

## Checkpoint de salida

Al terminar:

- `App` declara `const [query, setQuery] = useState("")`.
- `src/components/search-input.tsx` exporta un `SearchInput` controlado.
- `SearchInput` recibe `value: string` y `onQueryChange: (value: string) => void`.
- El input usa `type="search"`, una etiqueta visible, `value` y `onChange`.
- El hijo convierte `event.currentTarget.value` en un string y ejecuta `onQueryChange`.
- `App` conserva la única fuente de verdad de `query`.
- `normalizedQuery`, `visibleMedia` y `hasNoResults` se calculan durante el render.
- La búsqueda compara títulos sin distinguir mayúsculas y elimina espacios en los extremos de la consulta.
- Una consulta vacía muestra los seis medios.
- Una consulta sin coincidencias muestra “Sin resultados”.
- Una fuente vacía conserva “Catálogo vacío”.
- `MediaGrid` recibe `visibleMedia`; no importa el fixture ni declara estado.
- El proyecto conserva `<StrictMode>` y elimina los logs temporales de la demostración.
- El código no usa `useEffect`, `useMemo`, debounce, stores ni almacenamiento local.
- `pnpm build` termina con código de salida 0.
- El estudiante explica `evento → setter → render → cálculo → interfaz`.

El build comprueba TypeScript y la generación de archivos de producción. Los cambios al escribir, los mensajes vacíos y los logs de desarrollo requieren comprobación en el navegador.

## Resultado de aprendizaje

El estudiante responderá al cambio de un input, conservará la consulta con `useState`, controlará el campo desde React y calculará la colección visible sin duplicarla en estado.

## Concepto principal

El input introduce la primera interacción del producto:

```text
usuario escribe
→ onChange recibe el evento
→ el handler obtiene un string
→ setQuery solicita otro render
→ App recibe el nuevo snapshot de query
→ visibleMedia se calcula
→ MediaGrid presenta la colección resultante
```

React recuerda `query`. JavaScript calcula la colección visible a partir del fixture y del snapshot actual.

## Vocabulario

- **Evento:** información que el navegador produce cuando ocurre una interacción.
- **Handler:** función que la aplicación ejecuta como respuesta a un evento.
- **Hook:** función de React cuyo nombre comienza con `use` y permite usar capacidades como estado.
- **Estado:** memoria que React conserva para una posición del árbol entre renders.
- **Snapshot:** valores de props y estado disponibles durante un render concreto.
- **Setter:** función que solicita un render con un nuevo valor de estado.
- **Input controlado:** campo cuyo valor proviene de React y cuyo cambio actualiza ese valor.
- **Única fuente de verdad:** componente que conserva la versión autoritativa de un dato.
- **Prop de callback:** función que un padre entrega para que un hijo comunique una acción.
- **Estado derivado:** valor que se calcula desde props o estado disponible y no requiere almacenamiento propio.
- **Normalización:** transformación que lleva textos comparables a una forma común.
- **Render puro:** cálculo de interfaz que no muta datos externos y entrega el mismo resultado para las mismas entradas.
- **`StrictMode`:** componente que activa comprobaciones adicionales durante desarrollo.

## Estado inicial, transformación y estado final

### Estado 1 · Catálogo compuesto y estático

`App` conserva la fuente:

```tsx
<MediaGrid items={mediaItems} />
```

`MediaGrid` mantiene el recorrido, la key y el vacío de fuente. La sesión no mueve esas responsabilidades.

### Estado 2 · Una variable local no actualiza la interfaz

El docente añade de forma temporal un input no controlado y un párrafo. El handler asigna el texto a una variable local:

```tsx
let query = ""

<input
  onChange={(event) => {
    query = event.currentTarget.value
  }}
/>
```

El navegador actualiza el campo nativo, pero React no actualiza el párrafo ni la colección. Cambiar la variable no solicita otro render y el siguiente render volvería a crearla.

Este estado solo demuestra la limitación. No queda en el checkpoint.

### Estado 3 · `query` como memoria de App

`App` importa y declara el Hook en el nivel superior:

```tsx
import { useState } from "react"

const [query, setQuery] = useState("")
```

El primer input controlado se construye dentro de `App`:

```tsx
<input
  type="search"
  value={query}
  onChange={(event) => setQuery(event.currentTarget.value)}
/>
```

`value` muestra el snapshot actual. `onChange` obtiene el texto y el setter solicita el siguiente render. El Hook no se coloca dentro del handler, una condición o un recorrido.

#### Pausa de comprobación · Evento y render bajo `StrictMode`

Durante cuatro minutos, el docente añade un log dentro del handler y otro en el cuerpo de `App`. El grupo escribe un carácter y distingue:

- El log del handler representa el evento del navegador.
- El log del cuerpo representa la ejecución del componente.
- `StrictMode` puede ejecutar otra vez el cuerpo durante desarrollo para revelar renders impuros.
- Esa comprobación no repite el evento ni se ejecuta en la aplicación de producción.

El docente retira los logs y conserva `<StrictMode>`. La repetición del ciclo de un Effect queda para la sesión 10.

### Estado 4 · La colección visible se calcula

`App` normaliza la consulta y filtra durante el render:

```tsx
const normalizedQuery = query.trim().toLowerCase()

const visibleMedia = mediaItems.filter((media) =>
  media.title.toLowerCase().includes(normalizedQuery),
)
```

Una consulta vacía conserva el catálogo porque cualquier título incluye `""`. El grupo comprueba ese comportamiento antes de continuar.

`App` entrega el resultado:

```tsx
<MediaGrid items={visibleMedia} />
```

El fixture no cambia. `filter` devuelve otro arreglo para el render actual. La clase no guarda `visibleMedia` ni usa un Effect para sincronizarlo.

### Estado 5 · Extraer SearchInput sin mover el estado

La clase crea `src/components/search-input.tsx`:

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
        onChange={(event) =>
          onQueryChange(event.currentTarget.value)
        }
      />
    </label>
  )
}
```

`App` usa:

```tsx
<SearchInput
  value={query}
  onQueryChange={setQuery}
/>
```

El hijo adapta el evento DOM. El padre conserva estado y cálculo. La extracción crea un contrato reconocible sin duplicar `query`.

### Estado 6 · Vacío según la causa

`App` calcula:

```tsx
const hasNoResults =
  mediaItems.length > 0 &&
  normalizedQuery.length > 0 &&
  visibleMedia.length === 0
```

Después elige la rama:

```tsx
{hasNoResults ? (
  <EmptyState
    title="Sin resultados"
    description="No encontramos medios que coincidan con tu búsqueda."
  />
) : (
  <MediaGrid items={visibleMedia} />
)}
```

`App` conoce fuente, consulta y resultado. `MediaGrid` conserva la decisión de “Catálogo vacío” cuando la fuente original no contiene entradas.

## Secuencia completa

| Tiempo | Responsable | Actividad | Comprobación |
| --- | --- | --- | --- |
| 0–8 min | Docente y estudiantes | Recuperar `App → MediaGrid`, probar seis medios y revisar la pregunta previa con más errores. | El grupo identifica la fuente y la prop que recibe el grid. |
| 8–25 min | Docente | Presentar evento, handler, variable local, estado, setter, snapshot e input controlado. | El grupo clasifica `query` como memoria y `visibleMedia` como cálculo. |
| 25–38 min | Docente y grupo | Comparar el mismo input con una variable local y con `useState`. | El párrafo solo responde después de usar el setter. |
| 38–48 min | Docente y estudiantes | Conectar `value`, `onChange` y `setQuery`; dedicar cuatro minutos a logs de evento y render. | El input refleja `query`; el grupo distingue handler y cuerpo de `App`. |
| 48–62 min | Docente y grupo | Normalizar `query`, calcular `visibleMedia` y conectarlo a `MediaGrid`. | Vacío muestra seis; coincidencia reduce la colección. |
| 62–74 min | Docente y estudiantes | Extraer `SearchInput` con `value` y `onQueryChange`. | `query` permanece en `App`; el hijo no declara estado. |
| 74–84 min | Estudiantes | Implementar “Sin resultados” y ejecutar la matriz manual. | Las dos causas de vacío muestran mensajes distintos. |
| 84–90 min | Docente y estudiantes | Ejecutar `pnpm build`, revisar el checkpoint y responder el cierre. | Se registra el resultado del build y se explica el flujo completo. |
| **Total** |  |  | **90 minutos** |

## Actividades del docente

- Recuperar el árbol de la sesión 03 sin reconstruir sus componentes.
- Usar el input real para contrastar una variable local y estado.
- Presentar la regla básica de Hooks antes de escribir `useState`.
- Seguir dos snapshots de `query` en el diagrama y en el editor.
- Mostrar `value` y `onChange` como partes del mismo contrato controlado.
- Comparar logs de handler y render sin retirar `StrictMode`.
- Pedir la ubicación de `query` antes de extraer `SearchInput`.
- Calcular la colección durante el render y explicar la duplicación que evitaría otro estado.
- Probar cada causa de vacío con un cambio temporal y restaurarlo.
- Separar build, navegador y comportamiento de producción en el cierre.

## Actividades de los estudiantes

- Reconstruir `mediaItems → App → MediaGrid`.
- Predecir el resultado de cambiar una variable local.
- Declarar `query` en el nivel superior de `App`.
- Conectar `value`, el evento y `setQuery`.
- Identificar qué log corresponde al evento y cuál al render.
- Normalizar la consulta y calcular `visibleMedia`.
- Extraer `SearchInput` sin mover el estado.
- Completar la condición de “Sin resultados”.
- Probar consulta vacía, coincidencias, mayúsculas, espacios, ausencia de coincidencia y fuente vacía.
- Ejecutar el build y explicar su frontera.

## Guion de presentación

### Presentación continua · 17 minutos

Se presentan las slides 1–14 durante 8–25; la 15 sirve como referencia del cierre oral. Después se pasa una sola vez al editor. Se conserva el encabezado y page-container de 03 y se añade CSS del input al construirlo; no hay cambios de layout ajenos a la interacción.

| Orden | Título provisional | Contenido que debe conservarse | Recurso y nota docente |
| ---: | --- | --- | --- |
| 1 | Un catálogo que solo recibe props | Recuperar `App → MediaGrid` y los casos de colección completa y vacía. | Árbol de la sesión 03. Preguntar qué dato tendría que cambiar para mostrar menos tarjetas. |
| 2 | Escribir produce un evento | El navegador produce `onChange`; React ejecuta la función entregada como handler. | Secuencia teclado, evento, handler. |
| 3 | Una variable cambia fuera de la interfaz | Una asignación local no solicita render ni persiste entre renders. | Antes y después del input con un párrafo inmóvil. |
| 4 | Estado: memoria para otra interfaz | `useState` entrega un snapshot y un setter. El setter solicita otro render. | Línea de tiempo `"" → "arrival"`. |
| 5 | Los Hooks conservan su orden | `useState` se declara en el nivel superior del componente. | Snippet correcto y contraejemplo dentro de un `if`. |
| 6 | Un input controlado cierra el circuito | `value` viene de estado y `onChange` actualiza ese estado de forma síncrona. | Diagrama circular input, handler, setter, render. |
| 7 | App posee query | `App` necesita la consulta para el input y para la colección. | Árbol con `query` en `App` y dos consumidores. |
| 8 | React recuerda; JavaScript calcula | `mediaItems + query → visibleMedia`. Guardar el resultado duplicaría información. | Tabla con “estado” y “cálculo”. |
| 9 | Dos listas vacías, dos causas | Fuente vacía y búsqueda sin coincidencias requieren mensajes distintos. | Dos capturas con copy diferente. |
| 10 | Trabajo de la sesión | Variable local, estado, filtro, extracción y comprobación. | Secuencia de estados sin mostrar la solución completa. |

### Indicaciones para producir las diapositivas

- El evento describe lo ocurrido; el handler contiene la respuesta de la aplicación.
- Un handler se pasa como función. `onChange={handleChange()}` lo ejecutaría durante el render.
- Una variable local no persiste ni solicita render.
- Cada render recibe su snapshot. `setQuery` prepara el siguiente render.
- `useState` se declara en el nivel superior y conserva el orden de Hooks.
- Un input controlado necesita `value` y un `onChange` que actualice el valor.
- `App` posee `query`; `SearchInput` recibe valor y callback.
- El componente hijo entrega un string, no el evento DOM.
- `filter`, `trim`, `toLowerCase` e `includes` pertenecen a JavaScript.
- `visibleMedia` y `hasNoResults` se calculan sin estado ni Effect.
- `StrictMode` puede ejecutar otra vez el cuerpo del componente durante desarrollo. No repite por ello el evento.
- La clase 10 explicará las comprobaciones adicionales sobre Effects.
- Una longitud cero no identifica por sí sola la causa del vacío.

### Puente hacia el editor

> Si el usuario escribe un título, ¿qué dato debe recordar React y qué colección puede calcular App?

Respuesta esperada: React recuerda `query`; `App` calcula `visibleMedia` desde la consulta y el fixture.

### Cierre conceptual oral · 6 minutos

No se vuelve al deck; las preguntas se realizan sobre el código o navegador.

1. ¿Por qué cambiar una variable local no actualiza el resto de la interfaz?
2. ¿Por qué `query` vive en `App` y no dentro de `SearchInput`?
3. ¿Qué inconsistencia podría aparecer si `visibleMedia` fuera otro estado?
4. ¿Qué dato nuevo tendría que recordar React para filtrar también por película o serie?

La cuarta pregunta abre la sesión 05. El grupo nombra el tipo elegido; todavía no implementa ese control.

## Matriz de comprobación

| Caso | Preparación | Resultado esperado |
| --- | --- | --- |
| Consulta vacía | `query === ""` | Se muestran los seis medios. |
| Coincidencia parcial | Escribir `bear` | Se muestra The Bear. |
| Mayúsculas | Escribir `BEAR` | Se muestra The Bear. |
| Espacios exteriores | Escribir `  bear  ` | Se muestra The Bear. |
| Sin coincidencias | Escribir `matrix` | Aparece “Sin resultados”. |
| Fuente vacía | Usar temporalmente `[]` como fuente y dejar la consulta vacía | Aparece “Catálogo vacío”. |

El docente restaura `mediaItems` después de la última prueba.

## Plan de contingencia

- **El checkpoint anterior no inicia:** entregar una copia privada verificada de la sesión 03 y registrar el primer error. No reconstruir el taller.
- **La teoría supera 17 minutos:** conservar estado, input controlado y estado derivado. Mover preguntas secundarias al cierre.
- **El grupo no llega al filtro en 48 minutos:** entregar un checkpoint con `query` controlado dentro de `App`; el grupo construye el cálculo.
- **El grupo no llega a la extracción en 62 minutos:** entregar `search-input.tsx` sin integrarlo. El grupo debe decidir dónde permanece `query`.
- **Los logs confunden evento y render:** retirar ambos, dibujar un evento y dos ejecuciones del cuerpo, y repetir con nombres distintos.
- **El build falla:** leer el primer error y corregirlo antes de cambiar otra parte. Evaluar aparte los casos ya observados en el navegador.

## Fuera de alcance

- Actualizadores funcionales basados en el valor anterior.
- Objetos o arreglos dentro de estado.
- Filtro por `mediaType`, contador y limpieza de filtros.
- Selección, `selectedMediaId`, callbacks a través del grid y modal.
- `useEffect`, `useMemo` y debounce.
- Mantine, API, persistencia, React Router y TanStack Query.
- Tests automatizados y agentes.
- Producción de las sesiones 05 y 06 en esta iteración.

## Decisiones y simplificaciones pedagógicas

- El input de búsqueda sustituye ejemplos auxiliares de interacción.
- La clase demuestra primero la limitación y después introduce `useState`.
- `App` conserva `query` porque configura el input y calcula la colección.
- `SearchInput` adapta el evento DOM a un callback semántico.
- La clase extrae el componente después de lograr el comportamiento dentro de `App`.
- El fixture permanece fuera del estado.
- Los cálculos se ejecutan durante el render.
- `App` decide “Sin resultados”; `MediaGrid` conserva “Catálogo vacío”.
- La explicación de `StrictMode` se limita a evento frente a cuerpo del componente.
- Las sesiones 01 a 06 mantienen trabajo manual.

## Fuentes verificadas el 29 de agosto de 2026

- React 19.2, [Responding to Events](https://react.dev/learn/responding-to-events).
- React 19.2, [State: A Component's Memory](https://react.dev/learn/state-a-components-memory).
- React 19.2, [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot).
- React 19.2, [`<input>`](https://react.dev/reference/react-dom/components/input).
- React 19.2, [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
- React 19.2, [`<StrictMode>`](https://react.dev/reference/react/StrictMode).
