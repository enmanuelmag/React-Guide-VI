# Clase 04 · Eventos y estado local

- **Semana:** 2
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** catálogo estático compuesto de la clase 03, sin interacción ni estado
- **Checkpoint de salida:** `SearchInput` controlado y búsqueda local por título calculada durante el render

## Resultado de aprendizaje

Al terminar, el estudiante podrá responder al cambio de un input, conservar `query` mediante `useState`, controlar el campo desde React y calcular la colección visible sin duplicarla en estado.

## Limitación que abre la clase

El catálogo presenta correctamente una colección completa o vacía, pero el usuario no puede modificar lo que ve. Una variable local puede recibir el texto de un evento, pero React no conserva ese valor entre renders ni solicita una nueva interfaz cuando la variable cambia.

La clase añade una sola fuente de verdad para la interacción:

```text
usuario escribe
→ onChange recibe el evento
→ setQuery solicita un render
→ App recibe el nuevo snapshot de query
→ filter calcula visibleMedia
→ MediaGrid recibe la colección visible
```

## Conceptos

- Evento de usuario.
- Handler de evento.
- Hook `useState` y regla básica de invocación.
- Estado como memoria y snapshot de un render.
- Setter de estado y solicitud de un nuevo render.
- Input controlado.
- Estado mínimo necesario.
- Prop de callback.
- Propiedad del estado y única fuente de verdad.
- `filter` como cálculo derivado.
- Normalización de texto.
- Diferencia entre catálogo vacío y búsqueda sin resultados.

## Guion de presentación

### Propósito y duración

La recapitulación y apertura conceptual ocupan 30 minutos. Los primeros 10 recuperan el árbol y los casos de la clase 03. Los siguientes 20 presentan eventos, estado, input controlado y datos derivados. La clase vuelve al deck durante los últimos 8 minutos.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Un catálogo que solo responde a sus props | Recuperar `App → MediaGrid → MediaCard` y los casos de colección completa y vacía. Ningún dato cambia por una acción del usuario. | Mostrar el árbol final de la clase 03. Preguntar qué prop tendría que cambiar para mostrar menos tarjetas. |
| Problema | La primera interacción | El usuario necesita escribir un título y ver una colección distinta. El navegador produce un evento de cambio; React ejecuta el handler asociado. | Secuencia visual teclado, evento, handler. No introducir todavía `useState`. |
| Contraste | Una variable cambia, la interfaz no | Asignar texto a una variable local no solicita un render. Además, React ejecuta de nuevo la función componente en cada render y crea sus variables locales otra vez. El input nativo puede mostrar lo escrito, pero otro texto JSX seguirá con el valor anterior. | Demostración con input no controlado y un `<p>` que intenta reflejar la variable. |
| Concepto | Estado como memoria del componente | `useState("")` pide a React conservar `query` entre renders. Devuelve el snapshot actual y un setter. Llamar al setter solicita otro render; no muta el valor que ya pertenece al render actual. | Diagrama `render 1: "" → evento → render 2: "alien"`. |
| Regla | Dónde se llama un Hook | `useState` se llama en el nivel superior del componente, no dentro de condiciones, loops o handlers. React depende del mismo orden de Hooks en cada render. | Snippet correcto y contraejemplo tachado dentro de un `if`. No ampliar todavía a Hooks personalizados. |
| Concepto | Input controlado | Un input está controlado cuando React define su `value` y el handler actualiza ese valor mediante estado. Ambos lados son necesarios; pasar `value` sin actualizarlo impediría escribir. Un evento ejecuta el handler; después, `StrictMode` puede ejecutar nuevamente el cuerpo del componente durante desarrollo para revelar un render impuro. Esa comprobación no repite el evento ni afecta producción. | Mostrar el circuito `value={query}` y `onChange → setQuery`. Comparar un log dentro del handler con otro en el cuerpo de `App`. Reservar la comprobación de Effects para la clase 10. |
| Arquitectura | Quién posee `query` | `App` necesita `query` para calcular la lista y configurar `SearchInput`, por eso conserva el estado. `SearchInput` recibe `value` y `onQueryChange`; no crea una segunda copia. | Árbol con `query` en `App` y dos flechas hacia `SearchInput` y `MediaGrid`. |
| Distinción | El callback también baja como prop | `App` entrega una función. `SearchInput` la ejecuta con el string obtenido del evento DOM. El hijo comunica la intención, pero la actualización sigue definida por el padre. | Comparar `onChange` del `<input>` con `onQueryChange` del componente. No pasar el evento DOM a `App`. |
| Concepto | La lista visible se calcula | `visibleMedia` depende del fixture y de `query`. `filter` se ejecuta durante el render y devuelve un arreglo nuevo. Guardar ese resultado en otro estado duplicaría información. | Fórmula `mediaItems + query → visibleMedia`. Recordar que `filter` es JavaScript. |
| Contraste | Sin Effect y sin memoización prematura | No existe un sistema externo que sincronizar. El filtro pequeño puede calcularse en cada render sin `useEffect` ni `useMemo`. La API remota llegará en la semana 3 mediante TanStack Query. | Mostrar solo el cálculo correcto. Mencionar el antipatrón de segundo estado en la nota docente. |
| Concepto | Dos causas para una lista vacía | Fuente vacía significa que el catálogo no contiene datos; búsqueda sin resultados significa que la fuente tiene medios, pero ninguno coincide. `App` conoce la fuente, `query` y `visibleMedia`, así que elige el mensaje correcto. | Dos capturas con textos diferentes. Reutilizar `EmptyState` sin modificar `MediaGrid`. |
| Puente | Qué construiremos | Probar una variable local, introducir `query`, controlar el input, calcular la colección, distinguir “Sin resultados” y extraer `SearchInput`. | Diagrama de los seis estados del código sin entregar la solución completa. |

### Indicaciones que deben sobrevivir a la producción de slides

- Un evento describe algo que ocurrió; el handler contiene la respuesta de la aplicación.
- El handler se pasa como función. No se ejecuta durante el render con `onChange={handleChange()}`.
- Una variable local puede cambiar sin que React solicite otro render.
- Cada render recibe un snapshot de estado. `setQuery` solicita el siguiente render y no cambia el `query` que ya leyó el handler actual.
- `useState` se invoca en el nivel superior y mantiene el mismo orden entre renders.
- Un input controlado necesita `value` y un `onChange` que actualice el estado de forma síncrona.
- `App` posee `query` porque `SearchInput` lo muestra y la colección lo consume.
- `onQueryChange` baja desde `App`; `SearchInput` la invoca con un string y no expone el evento DOM al padre.
- `filter`, `trim`, `toLowerCase` e `includes` pertenecen a JavaScript.
- El fixture no cambia. `filter` devuelve una colección derivada.
- `visibleMedia`, `normalizedQuery` y `hasNoResults` no necesitan `useState`.
- No usar `useEffect` para sincronizar valores que pueden calcularse durante el render.
- `StrictMode` puede ejecutar nuevamente el cuerpo del componente durante desarrollo para revelar cálculos o mutaciones impuras.
- Esa comprobación no significa que el navegador produjo dos eventos: un log dentro del handler representa el evento; un log en el cuerpo del componente representa un render.
- Las comprobaciones adicionales de `StrictMode` no afectan el comportamiento de producción. No se debe retirar `StrictMode` para ocultar un problema que hizo visible.
- La repetición del ciclo de un Effect se reserva para la clase 10. Las comprobaciones de callbacks de refs no forman parte de esta explicación.
- El catálogo vacío y la búsqueda sin resultados necesitan mensajes distintos porque tienen causas distintas.

### Cierre conceptual

El cierre recupera la búsqueda construida y pregunta:

1. ¿Por qué una variable `let` no basta para actualizar el resto de la interfaz?
2. ¿Por qué `query` vive en `App` y no dentro de `SearchInput`?
3. ¿Qué inconsistencia podría aparecer si `visibleMedia` fuera otro estado?
4. ¿Qué nuevo criterio podría combinarse con el texto en la clase siguiente?

La cuarta respuesta abre la clase 05: añadir un filtro por tipo, combinarlo con el texto y mantener la colección y sus mensajes como cálculos derivados.

## Flujo del código

### Estado 1 · Catálogo estático

`App` importa `mediaItems` y renderiza:

```tsx
<MediaGrid items={mediaItems} />
```

`MediaGrid` conserva la colección, la key y el estado vacío. La clase no modifica esas responsabilidades.

### Estado 2 · Variable local sin sincronización

El docente añade un input no controlado y asigna su texto a una variable local. También intenta mostrar esa variable en un párrafo. El campo nativo cambia mientras el párrafo permanece igual, porque la asignación no solicita un render.

Este estado dura solo lo necesario para observar la limitación. No queda en el checkpoint.

### Estado 3 · `query` con `useState`

`App` importa `useState` y declara el Hook en el nivel superior:

```tsx
const [query, setQuery] = useState("")
```

El input usa `value={query}` y un handler que llama a `setQuery`. El docente sigue dos renders y recuerda que cada uno ve su propio snapshot.

#### Pausa de comprobación · Evento y render bajo `StrictMode`

Durante cuatro minutos, el docente coloca temporalmente un log dentro del handler y otro en el cuerpo de `App`. Después de escribir un solo carácter, el grupo identifica qué línea representa el evento y cuál representa el render.

En desarrollo, `StrictMode` puede ejecutar una vez adicional el cuerpo del componente porque esa parte debería ser pura: con las mismas props y el mismo estado no debe mutar datos externos ni producir un resultado diferente. El handler del evento no se repite por esta comprobación. Por eso pueden aparecer varios logs de render después de una sola interacción.

El docente aclara que `pnpm build` prepara la aplicación para producción y las comprobaciones adicionales de `StrictMode` dejan de ejecutarse. Aunque `<StrictMode>` permanezca escrito en `main.tsx`, no provoca el render adicional de desarrollo en producción. Los logs temporales se retiran después de comparar ambos lugares; no se elimina `StrictMode` para silenciarlos.

La clase no explica todavía la repetición del ciclo de un Effect. Esa ampliación pertenece a la clase 10. Las comprobaciones de callbacks de refs quedan fuera de este bloque porque el estudiante aún no tiene un caso de uso para ellas.

### Estado 4 · Colección derivada

`App` calcula:

```tsx
const normalizedQuery = query.trim().toLowerCase()

const visibleMedia = mediaItems.filter((media) =>
  media.title.toLowerCase().includes(normalizedQuery),
)
```

Una consulta vacía mantiene los seis medios porque todos los strings incluyen `""`. El docente puede explicitar este comportamiento o usar una condición equivalente, pero conserva una sola fuente de verdad.

`MediaGrid` cambia de `items={mediaItems}` a `items={visibleMedia}`.

### Estado 5 · Búsqueda sin resultados

`App` calcula una condición con tres datos:

```tsx
const hasNoResults =
  mediaItems.length > 0 &&
  normalizedQuery.length > 0 &&
  visibleMedia.length === 0
```

Si `hasNoResults` es verdadero, `App` reutiliza `EmptyState` con un título y descripción de búsqueda. En los demás casos entrega `visibleMedia` a `MediaGrid`. Si la fuente original está vacía, `MediaGrid` conserva el mensaje de catálogo vacío.

### Estado 6 · `SearchInput` controlado

Cuando la búsqueda ya funciona dentro de `App`, docente y estudiantes extraen:

```tsx
type SearchInputProps = {
  value: string
  onQueryChange: (value: string) => void
}

function SearchInput({ value, onQueryChange }: SearchInputProps) {
  return (
    <label>
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

`App` conserva `query` y pasa `value` y `onQueryChange`. La extracción no mueve el estado al hijo.

## Secuencia sugerida

| Tiempo | Actividad |
| --- | --- |
| 0-10 min | Recapitular el árbol y los estados visuales de la clase 03. |
| 10-30 min | Usar el deck para introducir eventos, estado como snapshot, input controlado y datos derivados. |
| 30-45 min | Demostración docente: comparar una variable local con `query` en estado usando el mismo input. |
| 45-65 min | Construcción interactiva: controlar el input con `value`, `onChange` y `setQuery`; dedicar cuatro minutos a comparar el log del handler con el log del render bajo `StrictMode`. |
| 65-85 min | Práctica guiada: normalizar `query`, calcular `visibleMedia` y entregarlo a `MediaGrid`. |
| 85-100 min | Extraer `SearchInput` con `value` y `onQueryChange` sin mover el estado fuera de `App`. |
| 100-112 min | Actividad estudiantil: completar “Sin resultados” y probar mayúsculas, espacios y consulta vacía. |
| 112-120 min | Verificar el checkpoint y responder las preguntas de cierre. |

## Actividades del docente

- Usar el input real para demostrar la diferencia entre una variable y estado.
- Seguir el ciclo `evento → setter → render → nueva interfaz`.
- Mostrar la regla de invocación de Hooks antes de escribir `useState`.
- Explicar `value` y `onChange` como dos partes del input controlado.
- Calcular `visibleMedia` directamente y explicar por qué no se guarda.
- Dibujar la propiedad de `query` antes de extraer `SearchInput`.
- Señalar la diferencia entre `onChange` del elemento nativo y `onQueryChange` del componente.
- Comparar un log dentro del handler con otro en el cuerpo de `App` para distinguir evento y render bajo `StrictMode`.
- Explicar que las comprobaciones adicionales son exclusivas del desarrollo y retirar solo los logs al cerrar la demostración, no `StrictMode`.
- Mantener `useEffect`, `useMemo` y debounce fuera del código.

## Actividades de los estudiantes

- Predecir qué partes de la interfaz cambian en la demostración con `let`.
- Declarar `query` en el nivel superior de `App`.
- Conectar `value`, el evento y `setQuery`.
- Proponer el callback semántico de `SearchInput`.
- Normalizar texto con `trim` y `toLowerCase`.
- Calcular `visibleMedia` mediante un solo `filter`.
- Comprobar coincidencia, ausencia de coincidencia, mayúsculas, espacios y consulta vacía.
- Explicar por qué el fixture y la lista visible no viven en estado.

## Evidencia de salida

- `App` contiene un solo estado: `query`.
- `SearchInput` recibe `value` y `onQueryChange` y no declara estado propio.
- El input refleja `query` y actualiza la búsqueda en cada cambio.
- `visibleMedia` se calcula con `filter` durante el render.
- La búsqueda ignora mayúsculas y espacios en los extremos.
- Una consulta vacía muestra la colección completa.
- “Sin resultados” no reemplaza el mensaje de catálogo vacío.
- El proyecto no usa Effects para filtrar y completa `pnpm build` sin errores.
- El estudiante explica quién posee `query` y por qué.

## Fuera del alcance

- Actualizadores funcionales basados en el valor anterior.
- Objetos o arreglos dentro de estado.
- Filtro por `mediaType`.
- Selección y modal.
- `useEffect`, `useMemo` y debounce.
- Persistencia local y búsqueda remota.

La clase 05 combina la consulta con un filtro por tipo, distingue las causas de una lista vacía y añade limpieza sin duplicar la colección visible en estado.

## Vocabulario

- **Evento:** información que el navegador produce cuando ocurre una interacción.
- **Handler:** función que la aplicación ejecuta como respuesta a un evento.
- **Hook:** función de React cuyo nombre comienza con `use` y permite usar capacidades como estado.
- **Estado:** memoria que React conserva para una posición del árbol entre renders.
- **Snapshot:** valores de props y estado disponibles durante un render concreto.
- **Setter:** función que solicita a React un render con un nuevo valor de estado.
- **Input controlado:** campo cuyo valor proviene de React y cuyo cambio actualiza ese valor.
- **Única fuente de verdad:** componente que posee la versión autoritativa de un dato.
- **Prop de callback:** función que un padre entrega para que un hijo comunique una acción.
- **Estado derivado:** valor calculado a partir de props o estado existente, sin almacenamiento propio.
- **Normalización:** transformación que lleva valores comparables a una forma común.
- **Sin resultados:** estado visual producido cuando una consulta válida no coincide con ningún elemento.
- **Render puro:** cálculo de interfaz que, con las mismas props y el mismo estado, no muta datos externos ni cambia su resultado por efectos secundarios.
- **`StrictMode`:** componente que activa comprobaciones adicionales durante desarrollo; puede ejecutar nuevamente el cuerpo del componente para hacer visibles renders impuros, sin repetir por ello el evento del usuario ni alterar producción.

## Referencia docente

- [Agregar interactividad](https://react.dev/learn/adding-interactivity)
- [El estado como snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Compartir estado entre componentes](https://react.dev/learn/sharing-state-between-components)
- [Input de React](https://react.dev/reference/react-dom/components/input)
- [Quizás no necesites un Effect](https://react.dev/learn/you-might-not-need-an-effect)
