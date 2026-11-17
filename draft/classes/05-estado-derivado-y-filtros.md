# Clase 05 · Estado derivado y filtros combinados

- **Semana:** 2
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** búsqueda local de la clase 04 con `query`, `SearchInput` controlado y `visibleMedia` derivado por título
- **Checkpoint de salida:** `s02-c05-filtros-combinados`, con texto y tipo combinados, mensajes vacíos correctos, contador y limpieza de filtros

## Resultado de aprendizaje

Al terminar, el estudiante podrá añadir un segundo control sin duplicar la colección, combinar criterios durante el render y distinguir qué valores React debe recordar de aquellos que puede recalcular.

## Limitación que abre la clase

El explorador filtra por título, pero no permite mostrar solo películas o solo series. El mensaje “Sin resultados” depende únicamente del texto y no existe una acción para regresar al catálogo completo.

La clase añadirá una decisión del usuario:

```text
tipo elegido
→ setMediaTypeFilter
→ App vuelve a renderizar
→ visibleMedia evalúa texto y tipo
```

El checkpoint conservará dos estados en `App`:

```text
query
mediaTypeFilter
```

React calculará durante cada render:

```text
normalizedQuery
visibleMedia
hasActiveFilters
hasNoResults
resultCount
```

La selección de una tarjeta y el modal de detalle todavía no forman parte de esta clase.

## Conceptos

- Estado mínimo necesario.
- Estado redundante.
- Segundo componente controlado.
- Unión de tipos para una opción de interfaz.
- Combinación de criterios con `filter`.
- Booleanos calculados dentro de un recorrido.
- Estado vacío según su causa.
- Evento que actualiza dos estados conocidos.
- Conteo derivado mediante `length`.
- Atributo `aria-pressed` en un grupo de botones.

## Decisiones didácticas

- `MediaTypeFilter` usa botones HTML. Mantine se configurará en la clase 06, cuando el modal presente una necesidad concreta.
- `mediaTypeFilter` vive en `App` porque el componente padre calcula y renderiza la colección visible.
- El valor `"all"` pertenece al control de interfaz; no se añade al dominio `MediaType`.
- `visibleMedia` combina ambas condiciones en un solo `filter`.
- `hasActiveFilters`, `hasNoResults` y `resultCount` se calculan. Ninguno usa `useState`.
- “Limpiar filtros” ejecuta dos setters dentro de un evento conocido. No requiere `useEffect`.
- `MediaGrid` conserva “Catálogo vacío” para una fuente sin entradas. `App` decide cuándo mostrar “Sin resultados”.
- La clase no instala Mantine ni introduce selección, `find`, callback `onSelect` o modal.

## Guion de presentación

### Propósito y duración

La recapitulación y apertura conceptual ocupan 25 minutos. Los primeros 10 recuperan el checkpoint de la clase 04. Los siguientes 15 presentan el segundo filtro, la diferencia entre estado y cálculo, y las dos causas de una colección vacía. La clase vuelve al deck durante los últimos 6 minutos.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Una acción y tres cálculos | `query` cambia cuando el usuario escribe. `normalizedQuery`, `visibleMedia` y `hasNoResults` se recalculan. Pedir al grupo que clasifique cada valor. | Tabla con “React recuerda” y “React calcula”. Recuperar una explicación, no toda la clase 04. |
| Problema | El texto no responde todas las preguntas | Una consulta puede encontrar títulos, pero el usuario también necesita limitar el catálogo a películas o series. | Captura del checkpoint con tres botones de tipo todavía ausentes. |
| Decisión | El tipo elegido sí necesita estado | `mediaTypeFilter` cambia por una acción y debe conservarse entre renders. Su valor inicial es `"all"`. | Secuencia `clic → setter → render`. Comparar con el input controlado ya conocido. |
| Distinción | Valor de interfaz y valor de dominio | `MediaType` acepta `"movie" | "series"`. `"all"` significa “no limitar por tipo” y pertenece a `MediaTypeFilterValue`. | Dos conjuntos visuales. Evitar afirmar que “Todos” es otro tipo de medio. |
| Concepto | Un componente controlado más | `MediaTypeFilter` recibe `value` y `onFilterChange`. El hijo muestra el valor y comunica la opción; `App` conserva el estado. | Comparación de contratos `SearchInput` y `MediaTypeFilter`. |
| Cálculo | Una colección, dos condiciones | Cada entrada debe cumplir `matchesQuery && matchesType`. Guardar listas separadas permitiría resultados desactualizados. | Fórmula `mediaItems + query + mediaTypeFilter → visibleMedia`. |
| Distinción | Dos listas vacías, dos causas | Una fuente sin datos representa “Catálogo vacío”. Una fuente con datos y filtros sin coincidencias representa “Sin resultados”. | Dos capturas con cero tarjetas y mensajes diferentes. |
| Evento | Volver al estado inicial | “Limpiar filtros” conoce los valores destino: `""` y `"all"`. El handler actualiza ambos directamente. | Snippet corto del handler. Marcar que no existe sincronización externa. |
| Puente | Qué construiremos | Crear el control de tipo, combinar condiciones, recalcular mensajes, mostrar el contador y limpiar filtros. | Secuencia de cinco estados del código. No mostrar los archivos completos. |

### Indicaciones que deben sobrevivir a la producción de slides

- El segundo filtro reutiliza el modelo de componente controlado de `SearchInput`.
- `mediaTypeFilter` necesita estado porque una acción del usuario cambia su valor y React debe recordarlo.
- `"all"` controla la interfaz; `MediaType` sigue representando únicamente películas y series.
- `matchesQuery` y `matchesType` nombran condiciones diferentes dentro del mismo recorrido.
- `visibleMedia` se calcula una sola vez. La clase no mantiene una lista por cada control.
- `hasActiveFilters` contempla texto normalizado no vacío o un tipo distinto de `"all"`.
- `hasNoResults` requiere una fuente no vacía, filtros activos y ninguna coincidencia.
- `resultCount` es otro nombre para `visibleMedia.length`, no otra fuente de verdad.
- Un clic en “Limpiar filtros” conoce el resultado esperado. El handler llama a ambos setters sin un Effect.
- Mantine se nombra solo como herramienta de la clase siguiente. No se instala ni se muestra su API.
- La selección y el modal quedan fuera para que la clase mantenga una sola dificultad principal.

### Cierre conceptual

El cierre plantea cuatro preguntas:

1. ¿Por qué `mediaTypeFilter` necesita `useState` y `visibleMedia` no?
2. ¿Por qué `"all"` no debe agregarse a `MediaType`?
3. ¿Qué información necesita `App` para distinguir “Catálogo vacío” de “Sin resultados”?
4. ¿Qué dato tendría que recordar React si el usuario quisiera elegir una tarjeta y mantener esa elección?

La cuarta respuesta abre la clase 06. El grupo puede proponer “la tarjeta” o “su id”; la siguiente clase comparará ambas opciones antes de decidir.

## Flujo del código

### Estado 1 · Checkpoint de búsqueda por título

`App` contiene:

```tsx
const [query, setQuery] = useState("")

const normalizedQuery = query.trim().toLowerCase()

const visibleMedia = mediaItems.filter((media) =>
  media.title.toLowerCase().includes(normalizedQuery),
)
```

`SearchInput` recibe `value={query}` y `onQueryChange={setQuery}`. `MediaGrid` recibe `visibleMedia`. La fuente y la colección visible no viven en estado.

### Estado 2 · `MediaTypeFilter` controlado

La clase crea `src/components/media-type-filter.tsx`:

```ts
type MediaTypeFilterValue = MediaType | "all"

type MediaTypeFilterProps = {
  value: MediaTypeFilterValue
  onFilterChange: (value: MediaTypeFilterValue) => void
}
```

`MediaTypeFilterValue` se exporta porque `App` necesita el mismo contrato. Esta decisión no fija todavía una convención global sobre exports.

El componente recorre tres opciones: Todos, Películas y Series. Cada botón:

- Declara `type="button"`.
- Declara `aria-pressed={value === option.value}`.
- Ejecuta `onFilterChange(option.value)`.
- No crea estado propio.

`App` añade:

```tsx
const [mediaTypeFilter, setMediaTypeFilter] =
  useState<MediaTypeFilterValue>("all")
```

```tsx
<MediaTypeFilter
  value={mediaTypeFilter}
  onFilterChange={setMediaTypeFilter}
/>
```

El grupo comprueba primero que el botón activo cambia. La colección seguirá igual hasta que el cálculo consuma `mediaTypeFilter`.

### Estado 3 · Texto y tipo en un cálculo

`App` reemplaza el recorrido anterior:

```tsx
const visibleMedia = mediaItems.filter((media) => {
  const matchesQuery = media.title
    .toLowerCase()
    .includes(normalizedQuery)

  const matchesType =
    mediaTypeFilter === "all" ||
    media.mediaType === mediaTypeFilter

  return matchesQuery && matchesType
})
```

El docente pide que el grupo prediga cuatro combinaciones antes de ejecutar:

| Texto | Tipo | Resultado esperado |
| --- | --- | --- |
| Vacío | Todos | Catálogo completo |
| Coincidencia de película | Películas | Película visible |
| Coincidencia de película | Series | Sin resultados |
| Texto inexistente | Todos | Sin resultados |

### Estado 4 · Mensaje según la causa

```tsx
const hasActiveFilters =
  normalizedQuery.length > 0 || mediaTypeFilter !== "all"

const hasNoResults =
  mediaItems.length > 0 &&
  hasActiveFilters &&
  visibleMedia.length === 0
```

`App` conoce la fuente, los controles y la colección resultante. Por eso decide si debe renderizar `EmptyState` con contenido de “Sin resultados”. `MediaGrid` conserva el mensaje “Catálogo vacío” cuando recibe una fuente realmente vacía.

La guía no oculta la fuente con `visibleMedia` antes de decidir la causa. Una longitud cero aislada no contiene suficiente información.

### Estado 5 · Contador y limpieza de filtros

El contador se calcula mediante:

```tsx
const resultCount = visibleMedia.length
```

El handler vuelve a los dos valores iniciales:

```tsx
function handleClearFilters() {
  setQuery("")
  setMediaTypeFilter("all")
}
```

El botón usa `disabled={!hasActiveFilters}`. El handler responde al clic y no espera otra condición. El siguiente render usa `query === ""` y `mediaTypeFilter === "all"`.

## Secuencia sugerida

| Tiempo | Actividad |
| --- | --- |
| 0-10 min | Recuperar `query`, `normalizedQuery`, `visibleMedia` y `hasNoResults` del checkpoint anterior. |
| 10-25 min | Usar el deck para presentar el segundo filtro, el valor `"all"`, el cálculo combinado y las dos causas de una lista vacía. |
| 25-43 min | Construcción interactiva: crear `MediaTypeFilter`, tipar sus props y comprobar `aria-pressed`. |
| 43-61 min | Práctica guiada: añadir `mediaTypeFilter` en `App` y conectar `value` con `onFilterChange`. |
| 61-78 min | Construcción interactiva: combinar `matchesQuery` y `matchesType` dentro de `visibleMedia`. |
| 78-94 min | Demostración docente: recalcular `hasActiveFilters`, `hasNoResults` y diferenciar ambos estados vacíos. |
| 94-108 min | Actividad estudiantil: añadir contador y “Limpiar filtros”; comprobar la matriz de combinaciones. |
| 108-114 min | Revisar el estado con React DevTools y ejecutar `pnpm build`. |
| 114-120 min | Volver al deck, responder el cierre y plantear la selección de una tarjeta. |

## Actividades del docente

- Recuperar el mapa de estado antes de declarar otro `useState`.
- Comparar los contratos controlados de `SearchInput` y `MediaTypeFilter`.
- Separar el valor `"all"` del dominio `MediaType`.
- Pedir los nombres `matchesQuery` y `matchesType` antes de escribir la condición final.
- Probar cada condición por separado antes de combinarlas.
- Mostrar por qué `visibleMedia`, `hasActiveFilters`, `hasNoResults` y `resultCount` pueden recalcularse.
- Ejecutar el handler de limpieza y revisar ambos estados en React DevTools.
- Mantener Mantine, selección y modal fuera del editor.

## Actividades de los estudiantes

- Clasificar cada valor como estado, prop, fuente o cálculo.
- Completar el contrato de `MediaTypeFilter`.
- Explicar por qué el componente hijo no guarda la opción activa.
- Predecir resultados para texto, tipo y ambas condiciones.
- Escribir una combinación que produzca “Sin resultados”.
- Implementar el contador sin crear estado.
- Implementar “Limpiar filtros” sin usar `useEffect`.
- Explicar qué valores cambian y cuáles se recalculan después del clic.

## Evidencia de salida

- `pnpm build` termina sin errores.
- `App` guarda `query` y `mediaTypeFilter`; no guarda colecciones ni contadores.
- `SearchInput` y `MediaTypeFilter` reciben valor y callback desde `App`.
- Texto y tipo funcionan por separado y juntos.
- `"all"` no forma parte de `MediaType`.
- `visibleMedia` combina ambos criterios en un solo `filter`.
- “Catálogo vacío” y “Sin resultados” representan causas distintas.
- El contador coincide con `visibleMedia.length`.
- “Limpiar filtros” restaura `""` y `"all"` mediante un evento.
- El proyecto no usa `useEffect`, Mantine, selección ni modal.
- El estudiante puede explicar `controles → estado → render → cálculos → interfaz`.

## Fuera del alcance

- Selección de una tarjeta.
- `selectedMediaId` y `find`.
- Callbacks a través de `MediaGrid` y `MediaCard`.
- Mantine, `MantineProvider` y `Modal`.
- `useDisclosure`, `useEffect` y `useMemo`.
- Búsqueda o detalle remoto.
- React Router y URLs de detalle.
- Zustand y cualquier store compartido.

La clase 06 parte de este checkpoint sin retirar código. Añadirá selección y modal sobre los filtros que ya funcionan.

## Vocabulario

- **Criterio:** condición que una entrada debe cumplir para permanecer en una colección filtrada.
- **Estado redundante:** valor almacenado que puede calcularse desde props o estado existente.
- **Componente controlado:** componente cuyo valor visible y callback de cambio llegan mediante props.
- **Valor de interfaz:** opción que controla una vista sin formar parte del dominio, como `"all"`.
- **Condición compuesta:** expresión que combina dos o más condiciones booleanas.
- **Estado vacío por fuente:** interfaz mostrada cuando la colección original no contiene entradas.
- **Estado vacío por filtro:** interfaz mostrada cuando existen entradas, pero ninguna cumple los criterios activos.
- **Conteo derivado:** cantidad calculada desde la colección visible.

## Referencia docente

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)

La documentación oficial consultada muestra React 19.2. Al implementar el checkpoint, el docente debe verificar las versiones resueltas por el proyecto de la cohorte y conservar `pnpm-lock.yaml`.
