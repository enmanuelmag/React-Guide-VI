# Sesión 05 · Estado derivado y filtros locales

> Estado: paquete textual y presentación HTML aprobados. Proyecto progresivo implementado hasta session-05-end; guía docente autosuficiente y etapas recuperables.

- **Fecha:** jueves 1 de octubre de 2026
- **Semana:** 2
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Control de lectura:** [reading-check.md](reading-check.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Punto de entrada

La sesión parte de `session-05-start`, idéntica a `session-04-end`, en el repositorio hermano MediaLog-Bootcamp:

- `App` conserva `query` como única fuente de verdad de la búsqueda.
- `SearchInput` es controlado mediante `value` y `onQueryChange`.
- `normalizedQuery`, `visibleMedia` y `hasNoResults` se calculan durante el render.
- `MediaGrid` recibe `items={visibleMedia}`.
- “Catálogo vacío” describe una fuente sin medios y “Sin resultados” una búsqueda sin coincidencias.
- El proyecto no usa Effects, `useMemo`, debounce, stores ni almacenamiento local.

La apertura recupera ese flujo y comprueba una búsqueda, pero no reconstruye la sesión anterior.

## Checkpoint de salida

Al terminar:

- `src/components/media-type-filter.tsx` exporta `MediaTypeFilter`.
- `MediaTypeFilterValue` representa `MediaType | "all"` sin modificar el dominio.
- `App` conserva únicamente `query` y `mediaTypeFilter` como estado local.
- `MediaTypeFilter` recibe `value` y `onFilterChange`.
- El componente presenta los botones “Todos”, “Películas” y “Series”.
- Cada botón declara `type="button"`, una key estable y `aria-pressed` según la opción activa.
- Un solo `visibleMedia` combina `matchesQuery && matchesType`.
- `hasActiveFilters`, `hasNoResults` y `resultCount` se derivan durante el render.
- La interfaz muestra `Mostrando {resultCount} de {mediaItems.length}`.
- “Limpiar filtros” restablece la consulta a `""` y el tipo a `"all"`.
- El botón de limpieza queda deshabilitado cuando no existe un filtro efectivo.
- Una fuente vacía conserva “Catálogo vacío”; filtros activos sin coincidencias muestran “Sin resultados”.
- `MediaGrid` continúa recibiendo `items={visibleMedia}`.
- El código no usa `useEffect`, `useMemo`, Mantine, selección, modal ni Zustand.
- En el proyecto semilla ejecutable, `pnpm build` debe terminar con código de salida 0.

La verificación distingue instalación/build/lint de las comprobaciones de filtros, contador, limpieza y mensajes en navegador. El ritmo real de aula se registra por bloque; no se deduce del build.

## Resultado de aprendizaje

El estudiante modelará un segundo control con el estado mínimo, combinará dos criterios en una única colección derivada y explicará por qué el contador y los mensajes no necesitan estado adicional.

## Concepto principal

La interfaz distingue valores que React debe recordar de valores que JavaScript puede calcular:

```text
React recuerda
├── query
└── mediaTypeFilter

JavaScript calcula en cada render
├── normalizedQuery
├── visibleMedia
├── hasActiveFilters
├── hasNoResults
└── resultCount
```

Agregar otro criterio no requiere copiar la colección visible a estado. Requiere que ambos valores recordados lleguen al mismo cálculo.

## Vocabulario

- **Estado mínimo:** conjunto más pequeño de valores que la interfaz necesita recordar.
- **Estado redundante:** dato almacenado que puede calcularse desde props o estado existente.
- **Estado derivado:** valor calculado durante el render a partir de datos disponibles.
- **Valor de interfaz:** opción necesaria para operar un control, aunque no pertenezca al dominio persistido.
- **Predicado:** función o expresión que decide si un elemento cumple una condición.
- **Filtro combinado:** predicado que exige más de una condición.
- **Fuente de verdad:** lugar autoritativo donde se conserva un valor.
- **Componente controlado:** componente cuyo valor relevante proviene de props y comunica cambios con callbacks.
- **Estado vacío por causa:** mensaje que explica si faltan datos de origen o coincidencias.
- **`aria-pressed`:** estado accesible que comunica si un botón de alternancia está activo.

## Estado inicial, transformación y estado final

### Estado 1 · Recuperar el checkpoint de búsqueda

`App` ya posee:

```tsx
const [query, setQuery] = useState("")
const normalizedQuery = query.trim().toLowerCase()

const visibleMedia = mediaItems.filter((media) =>
  media.title.toLowerCase().includes(normalizedQuery),
)
```

El grupo prueba consulta vacía, `bear` y una consulta inexistente. La clase identifica `query` como memoria y `visibleMedia` como cálculo.

### Estado 2 · Crear el segundo control sin estado interno

La clase crea `MediaTypeFilterValue` como unión entre el tipo del dominio y la opción visual `"all"`:

```tsx
export type MediaTypeFilterValue = MediaType | "all"
```

`MediaTypeFilter` recibe el valor actual y una prop de callback. Sus opciones se recorren con `map`; la key pertenece al botón creado en ese recorrido.

```tsx
<button
  key={option.value}
  type="button"
  aria-pressed={value === option.value}
  onClick={() => onFilterChange(option.value)}
>
  {option.label}
</button>
```

El texto visible permanece estable. `aria-pressed` comunica cuál opción está activa.

### Estado 3 · App conserva el valor del filtro

`App` añade el segundo y último estado del checkpoint:

```tsx
const [mediaTypeFilter, setMediaTypeFilter] =
  useState<MediaTypeFilterValue>("all")
```

Conecta el componente:

```tsx
<MediaTypeFilter
  value={mediaTypeFilter}
  onFilterChange={setMediaTypeFilter}
/>
```

El hijo no guarda una copia de la selección. El padre es la única fuente de verdad.

### Estado 4 · Combinar texto y tipo

El cálculo existente incorpora dos condiciones:

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

No existen `filteredByQuery` y `filteredByType` guardados en estado. La colección se calcula desde el fixture y los dos controles.

### Estado 5 · Derivar filtros activos y vacío

La consulta solo está activa cuando contiene texto efectivo:

```tsx
const hasActiveFilters =
  normalizedQuery.length > 0 || mediaTypeFilter !== "all"

const hasNoResults =
  mediaItems.length > 0 &&
  hasActiveFilters &&
  visibleMedia.length === 0
```

Así, una fuente `[]` no se confunde con un catálogo existente que no coincide con los filtros.

### Estado 6 · Contar y limpiar sin duplicar estado

El contador proviene de la colección actual:

```tsx
const resultCount = visibleMedia.length
```

El evento de limpieza actualiza las dos fuentes de verdad:

```tsx
function handleClearFilters() {
  setQuery("")
  setMediaTypeFilter("all")
}
```

La interfaz presenta:

```tsx
<p>Mostrando {resultCount} de {mediaItems.length}</p>
<button
  type="button"
  onClick={handleClearFilters}
  disabled={!hasActiveFilters}
>
  Limpiar filtros
</button>
```

No se almacena `resultCount` ni se sincroniza mediante un Effect.

## Agenda de 90 minutos

| Minutos | Duración | Actividad | Evidencia observable |
| --- | ---: | --- | --- |
| 0–8 | 8 min | Recuperar checkpoint 04 y cuestionario | El grupo clasifica `query` y `visibleMedia`. |
| 8–20 | 12 min | Presentación continua: estado mínimo, redundante y controlado | Cada valor queda en “recordar” o “calcular”. |
| 20–34 | 14 min | Definir `MediaTypeFilter` y su CSS, aún sin consumidor | Archivo compilable con contrato, opciones y botones. |
| 34–46 | 12 min | Añadir `mediaTypeFilter` en `App` | El filtro cambia mediante props y callback. |
| 46–61 | 15 min | Combinar los dos predicados | Texto y tipo afectan un único `visibleMedia`. |
| 61–72 | 11 min | Recalcular activos y vacíos | Las dos causas de vacío permanecen distintas. |
| 72–82 | 10 min | Práctica individual: contador, limpieza y matriz | El estudiante completa y prueba los casos indicados. |
| 82–86 | 4 min | Evidencia técnica | Build/lint y resultados del navegador registrados. |
| 86–90 | 4 min | Cierre y puente a selección | Exit ticket distingue recordar de calcular. |

**Total:** 90 minutos. Presentación continua antes de abrir el editor; archivos completos y soporte solo en los bloques posteriores. Slides 1–14 en orden; slide 15 como referencia del cierre oral, sin regresar al deck.

## Práctica individual

El estudiante dispone de diez minutos para:

1. Derivar `resultCount` desde `visibleMedia`.
2. Mostrar `Mostrando X de 6`.
3. Crear `handleClearFilters`.
4. Deshabilitar el botón cuando no hay filtros efectivos.
5. Ejecutar la matriz de aceptación.

El docente comprueba comportamiento y explicación, no solo presencia de código.

## Matriz de aceptación

Con el fixture canónico de seis elementos:

| Consulta | Tipo | Resultado esperado |
| --- | --- | --- |
| vacía | Todos | 6 medios |
| vacía | Películas | 3 medios |
| vacía | Series | 3 medios |
| `bear` | Todos | `The Bear` |
| `bear` | Series | `The Bear` |
| `bear` | Películas | “Sin resultados” |
| `matrix` | Todos | “Sin resultados” |
| cualquier filtro | Limpiar | consulta vacía, Todos y 6 medios |
| fuente `[]` temporal | Todos | “Catálogo vacío” |

La fuente temporal se restaura antes de cerrar la sesión.

## Guion conceptual y presentación aprobada

1. **El catálogo ya busca:** recuperar el checkpoint sin reconstruirlo.
2. **¿Recordar o calcular?:** clasificar los valores actuales.
3. **Una opción visual adicional:** explicar `MediaType | "all"`.
4. **Segundo componente controlado:** contrastar props con estado interno duplicado.
5. **Botones que comunican estado:** key, `type="button"` y `aria-pressed`.
6. **Un solo predicado:** visualizar `matchesQuery && matchesType`.
7. **El vacío tiene causa:** fuente vacía frente a filtros sin coincidencias.
8. **Contar y limpiar:** derivación y actualización dentro del evento.
9. **Checkpoint:** recorrer la matriz y anticipar selección por identidad.

Las diapositivas explican decisiones y contrastes. No muestran completa la solución de la práctica individual antes de que el estudiante trabaje.

## Preguntas de comprobación

- ¿Por qué `visibleMedia` no es estado?
- ¿Por qué `"all"` pertenece al valor del control y no a `MediaType`?
- ¿Quién conserva la fuente de verdad del tipo seleccionado?
- ¿Qué condición distingue fuente vacía de filtros sin coincidencias?
- ¿Qué dos valores modifica la acción de limpiar?

## Plan de contingencia

- **Si faltan 10 minutos:** el docente entrega el marcado del contador y el estudiante conserva el cálculo y la matriz.
- **Si faltan 5 minutos:** la comprobación de fuente `[]` se demuestra en pantalla; cada estudiante completa los otros casos.
- **Si sobra tiempo:** el grupo explica por qué guardar `resultCount` introduciría una segunda fuente de verdad. No se adelanta selección.
- **Si el proyecto no compila:** se registra el error exacto, se comprueba primero contrato/importación de `MediaTypeFilterValue` y no se presenta el build como aprobado.

## Fuera de alcance

- `useEffect` y sincronización.
- `useMemo` y optimización.
- Debounce.
- Selección de medios e identidad seleccionada.
- Mantine y modales.
- Zustand o cualquier store.
- Fetching, API y estado remoto.
- Persistencia de filtros.

## Continuidad con la sesión 06

La sesión 06 debe iniciar desde este checkpoint completo. Añadirá selección por identidad, callbacks y modal sin reconstruir ni retirar búsqueda, filtro, contador o limpieza.

Al migrar esa dependencia se deben corregir dos referencias históricas:

- conservar `MediaGrid items={visibleMedia}` en lugar de la prop antigua `mediaItems`;
- conservar el tipo canónico en `src/types/media-item.ts` en lugar de `src/types/media.ts`.

La entrada vigente de 06 ya conserva ambos contratos. La producción de su seed queda para la siguiente iteración, después de revisar 05.

## Decisiones pedagógicas aprobadas

- Usar botones porque las tres opciones son visibles, comparables y accionables sin abrir otro control.
- Representar “Todos” con una unión de interfaz explícita, no con `null` ni modificando el dominio.
- Mantener dos estados independientes porque consulta y tipo cambian de forma independiente.
- Calcular todos los resultados y mensajes desde esas fuentes.
- Reservar selección y Mantine para la dificultad principal de la sesión presencial.

No surge una regla reutilizable nueva. Las reglas existentes ya exigen estado mínimo, derivación durante render y separación entre valores de interfaz y dominio.

## Fuentes docentes

- React, [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure), secciones `Principles for structuring state`, `Group related state` y `Avoid redundant state`.
- React, [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components), secciones `Controlled and uncontrolled components` y `A single source of truth for each state`.
- W3C WAI-ARIA Authoring Practices, [Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), referencia para botones de alternancia y `aria-pressed`.

Fuentes verificadas el 30 de agosto de 2026. Context7 no estuvo disponible en el entorno durante esta producción; se consultaron las fuentes oficiales como respaldo.

## Ramas de la sesión

`session-05-start` → `session-05-step-01-type-filter` → `session-05-step-02-controlled-type` → `session-05-step-03-combined-filters` → `session-05-step-04-empty-causes` → `session-05-end`.

La primera etapa define el hijo sin montarlo; la segunda muestra el control conectado sin aplicar el tipo a la colección. La cuarta precede a la práctica y no contiene contador ni limpieza. Las rutas, estilos y estructura visual heredados permanecen acumulativos.
