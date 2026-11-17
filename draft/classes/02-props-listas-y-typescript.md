# Clase 02 · Props, listas y TypeScript

- **Semana:** 1
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** checkpoint de la clase 01 con `AppHeader` y una `MediaCard` de datos fijos
- **Checkpoint de salida:** fixture tipado renderizado con `map`; cada entrada configura `MediaCard` mediante props y usa una identidad estable

## Resultado de aprendizaje

Al terminar, el estudiante podrá definir el contrato de un medio con TypeScript, pasar ese dato desde `App` hacia `MediaCard` y renderizar una colección mediante `map` y `key`, sin duplicar la estructura de la tarjeta.

## Limitación que abre la clase

La tarjeta de la clase 01 ya tiene una responsabilidad reconocible, pero conserva título, descripción, poster, tipo y fecha dentro del componente. Renderizar otra película obligaría a duplicar el componente o su marcado.

La clase resuelve esa limitación separando datos y estructura:

```text
fixture de medios
→ App recorre los datos
→ cada elemento configura MediaCard mediante props
→ MediaCard decide cómo presentar un medio
```

## Conceptos

- Props como entrada de un componente.
- Flujo de datos de padre a hijo.
- Objeto `props` y destructuración.
- Props de solo lectura.
- Alias con `type` y tipos de objetos.
- Unión literal `"movie" | "series"`.
- Unión `string | null` para poster y descripción que pueden no tener valor.
- Arreglos tipados.
- `map` como transformación de datos en elementos JSX.
- `key` como identidad estable entre elementos hermanos.
- Renderizado condicional para tipo y poster alternativo.
- Diferencia entre comprobación de TypeScript y validación en runtime.

## Datos de trabajo

El docente prepara `src/types/media.ts`:

```ts
export type MediaType = "movie" | "series"

export type MediaItem = {
  id: number
  title: string
  description: string | null
  mediaType: MediaType
  releaseDate: string
  posterUrl: string | null
}
```

El fixture `src/data/media-items.ts` contiene seis entradas. Incluye películas y series, fechas distintas, al menos un `posterUrl` con valor `null` y al menos una `description` con valor `null`. Todas las entradas declaran ambos campos aunque no tengan valor. Cada propiedad participa en la interfaz o en la identidad de la lista.

La clase usa `type` para el objeto y para las uniones. La comparación entre `type` e `interface` queda fuera de alcance porque no resuelve una necesidad del checkpoint.

## Guion de presentación

### Propósito y duración

La recapitulación y apertura conceptual ocupan 30 minutos. Los primeros 10 recuperan el árbol de la clase 01 y hacen visible el problema de los datos fijos. Los siguientes 20 introducen props, tipos, listas y keys. La clase vuelve al deck durante los últimos 8 minutos.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | El árbol que ya tenemos | Reconstruir `App → AppHeader / main → MediaCard`. Recordar que `MediaCard` tiene una responsabilidad clara, pero representa siempre el mismo medio. | Mostrar el árbol sin datos. Preguntar qué archivo cambiarían para modificar el título de la tarjeta. |
| Problema | Misma estructura, datos diferentes | Comparar dos tarjetas con la misma estructura y contenido distinto. Duplicar JSX mezcla datos con presentación y obliga a mantener varias copias. | Antes/después visual. No introducir todavía el arreglo. |
| Concepto | Props: entradas del componente | Explicar que un padre configura a un hijo mediante props. Relacionarlas con argumentos de una función, aclarando que React entrega un solo objeto `props`. | Diagrama `App → data → MediaCard` y snippet con una prop. |
| Código | Objeto props y destructuración | Contrastar `function MediaCard(props)` con `function MediaCard({ data })`. Ambas formas leen el mismo objeto; la segunda extrae la propiedad que usa el componente. | Snippet breve lado a lado. Señalar las llaves de destructuración y no confundirlas con las llaves de JSX. |
| Distinción | Flujo de datos y solo lectura | `App` posee el fixture y entrega un medio. `MediaCard` lo lee y decide cómo mostrarlo; no modifica el objeto recibido. Los cambios interactivos llegarán con estado en la clase 04. | Flecha en una sola dirección. Evitar presentar props como almacenamiento local. |
| Concepto | TypeScript describe el contrato | `MediaItem` exige los campos que necesita la pantalla. TypeScript detecta durante el desarrollo propiedades ausentes o valores incompatibles. No valida por sí solo un JSON que llegue en runtime. | Mostrar un objeto válido y otro sin `title`. Mantener la explicación de runtime en una nota docente. |
| Distinción | Tipos literales y valores ausentes | `MediaType` limita el tipo a `"movie"` o `"series"`; un `string` permitiría valores que el dominio no acepta. `posterUrl` y `description` usan `string | null`, por lo que la propiedad siempre existe, aunque no siempre tenga contenido. | Mostrar `"anime"` como error controlado y `null` como ausencia deliberada, no como propiedad omitida ni string vacío. |
| Concepto | Del arreglo a elementos JSX | `map` recorre cada medio y devuelve un elemento `<MediaCard />`. El arreglo contiene datos; `map` produce la colección de elementos que React renderiza. | Flujo `MediaItem[] → map → MediaCard[]`. Recordar que `map` es JavaScript, no una API exclusiva de React. |
| Concepto | `key` representa identidad | React usa `key` para relacionar cada elemento actual con el correspondiente en renders posteriores. Debe ser estable y única entre hermanos. El fixture ya contiene `id`; no se genera durante el render. | Quitar temporalmente `key` para observar el warning. Explicar por qué índice y `Math.random()` no representan la identidad del dato. |
| Contraste | `key` no llega como prop | Aunque se escribe junto a las props, React consume `key`. Si `MediaCard` necesitara el identificador, el padre tendría que pasarlo también mediante una prop normal. En esta clase la tarjeta no lo necesita. | Comparar `key={media.id}` con una prop ordinaria `media={media}`. |
| Concepto | Decisiones visuales desde datos | La tarjeta usa un condicional para mostrar “Película” o “Serie” y fallbacks para poster y descripción nulos. Cada condicional describe una diferencia de presentación; no crea estado. | Comparación con cuatro casos del fixture: película, serie, poster ausente y descripción ausente. |
| Puente | Qué construiremos hoy | Partir de una tarjeta fija, crear tipos y fixture, convertir la tarjeta a props, recorrer la colección y resolver los dos fallbacks. `App` conservará temporalmente el contenedor para que la clase 03 pueda extraer `MediaGrid` por una necesidad visible. | Diagrama de los cuatro estados del código. No mostrar la solución completa de `map`. |

### Indicaciones que deben sobrevivir a la producción de slides

- Las props transportan datos; no son un mecanismo de persistencia ni una copia automática del estado del padre.
- El flujo “padre a hijo” describe quién entrega el dato. El componente hijo puede componer otros hijos y pasarles información después.
- `props` es el objeto completo; `data` es una propiedad de ese objeto.
- La destructuración pertenece a JavaScript. React no introduce una sintaxis distinta para extraer propiedades.
- `map` devuelve un arreglo nuevo. En este caso, sus elementos son descripciones JSX de `MediaCard`.
- `key` debe ser estable y única entre hermanos. No necesita ser única en toda la aplicación.
- `key` no se lee dentro de `MediaCard`.
- TypeScript desaparece al compilar y no convierte una respuesta externa en datos confiables.
- Los fallbacks de poster y descripción, junto con la etiqueta por tipo, se derivan de props; no requieren `useState`.
- `App` mantiene la colección durante este checkpoint de forma deliberada. La clase 03 usará esa concentración de responsabilidad para motivar `MediaGrid`.

### Cierre conceptual

El cierre recupera el código construido y plantea:

1. ¿Qué dato posee `App` y qué responsabilidad conserva `MediaCard`?
2. ¿Qué diferencia existe entre `props` y la prop `data`?
3. ¿Por qué `id` funciona como key y `Math.random()` no?
4. ¿Qué problema empieza a aparecer ahora dentro de `App`?

La última respuesta abre la clase 03: extraer la organización de la colección hacia `MediaGrid` y completar la composición del catálogo.

## Flujo del código

### Estado 1 · Tarjeta con datos fijos

`App` renderiza una sola `MediaCard`. El componente contiene directamente los datos del medio. El grupo identifica qué líneas cambiarían para representar una serie distinta.

### Estado 2 · Tipos y fixture separados

El docente crea:

```text
src/
├── components/
│   ├── app-header.tsx
│   └── media-card.tsx
├── data/
│   └── media-items.ts
├── types/
│   └── media.ts
├── App.tsx
└── main.tsx
```

`media.ts` define el contrato compartido. `media-items.ts` contiene datos, pero no JSX. El docente provoca un error con `mediaType: "anime"` y otro al omitir `description`; luego los corrige leyendo el mensaje de TypeScript. El segundo error permite distinguir una propiedad obligatoria con valor nullable de una propiedad opcional.

### Estado 3 · `MediaCard` recibe un medio

El tipo de props permanece junto al componente porque solo describe su entrada:

```tsx
type MediaCardProps = {
  data: MediaItem
}

function MediaCard({ data }: MediaCardProps) {
  return (
    <article>
      <h2>{data.title}</h2>
      <p>{data.description ?? "Sin descripción disponible"}</p>
      <p>{data.releaseDate}</p>
    </article>
  )
}
```

La demostración sigue un dato desde el fixture hasta el texto visible. El docente no introduce spreads ni destructuración anidada.

### Estado 4 · `App` recorre el fixture

Docente y estudiantes construyen:

```tsx
{mediaItems.map((media) => (
  <MediaCard key={media.id} data={media} />
))}
```

Primero ejecutan el código sin `key` para leer el warning. Después identifican `id` como la identidad estable y añaden la key. No implementan una versión con índice o valor aleatorio.

### Estado 5 · Diferencias de presentación

`MediaCard` muestra una etiqueta según `mediaType`, un poster alternativo cuando `posterUrl` es `null` y “Sin descripción disponible” cuando `description` es `null`. La clase usa una expresión legible por cada diferencia y evita encadenar varios ternarios.

`App` todavía contiene el wrapper de la colección. Esa limitación queda visible para la clase 03.

## Secuencia sugerida

| Tiempo | Actividad |
| --- | --- |
| 0-10 min | Recapitular el árbol de la clase 01 y localizar la limitación de los datos fijos. |
| 10-30 min | Usar el deck para introducir props, flujo de datos, contratos de TypeScript, `map` y `key`. |
| 30-45 min | Crear `MediaType`, `MediaItem` y el fixture; provocar y corregir dos errores de tipos. |
| 45-65 min | Demostración docente: convertir `MediaCard` para recibir la prop `data` y seguir un dato hasta la interfaz. |
| 65-85 min | Construcción interactiva: recorrer el fixture con `map`, observar el warning y añadir una key estable. |
| 85-100 min | Práctica guiada: presentar película o serie y resolver poster y descripción nulos sin estado. |
| 100-112 min | Actividad estudiantil: agregar un medio, corregir un valor inválido y explicar el recorrido de sus datos. |
| 112-120 min | Verificar el checkpoint y responder las preguntas de cierre. |

## Actividades del docente

- Recuperar la última pregunta de la clase 01: cómo representar datos distintos sin duplicar la tarjeta.
- Mostrar el recorrido `fixture → App → prop data → MediaCard → JSX`.
- Explicar el tipo del dominio y el tipo local de props sin convertir su ubicación en una regla global todavía.
- Provocar errores por `description` ausente y `mediaType` inválido.
- Omitir `key` una vez para leer el warning y resolverlo con una identidad del fixture.
- Aclarar que React consume `key` y que `MediaCard` recibe `data`.
- Preguntar al grupo el siguiente paso antes de completar `map` y los condicionales.
- Mantener `MediaGrid`, `EmptyState` y `MediaTypeBadge` fuera de la implementación.

## Actividades de los estudiantes

- Reconstruir el árbol inicial y localizar dónde viven los datos fijos.
- Completar dos entradas del fixture conforme a `MediaItem`.
- Leer un error de TypeScript y señalar el campo que incumple el contrato.
- Proponer la expresión que transforma cada `media` en una `MediaCard`.
- Elegir `id` como key y explicar por qué pertenece al dato.
- Añadir una séptima entrada con poster y descripción nulos y comprobar ambos fallbacks.
- Dibujar o escribir el recorrido de un título desde el fixture hasta el `<h2>`.

## Evidencia de salida

- El fixture es la única fuente de datos de las tarjetas.
- `MediaItem` restringe `mediaType`; `posterUrl` y `description` siempre existen y representan la ausencia de contenido con `null`.
- `MediaCard` recibe `data` mediante props y no modifica el objeto.
- `App` genera las tarjetas con un solo `map`.
- Cada elemento directo del `map` usa `media.id` como key.
- Película, serie, poster ausente y descripción ausente producen las cuatro variantes esperadas.
- El proyecto compila sin errores y no usa estado.
- El estudiante explica `fixture → App → MediaCard` con un dato concreto.

## Fuera del alcance

- Comparación entre `type` e `interface`.
- `children` y composición mediante contenido anidado.
- `MediaGrid`, `MediaTypeBadge` y `EmptyState` como componentes separados.
- Filtros y estado derivado.
- Eventos y `useState`.
- API y validación de JSON en runtime.

La clase 03 comienza con la colección funcionando dentro de `App` y usa esa responsabilidad acumulada para extraer la estructura del catálogo.

## Vocabulario

- **Prop:** valor que un componente padre entrega a un componente hijo.
- **Objeto props:** único objeto que React entrega como argumento a una función componente.
- **Destructuración:** sintaxis de JavaScript para extraer propiedades de un objeto o elementos de un arreglo.
- **Alias de tipo:** nombre asignado con `type` a una descripción de TypeScript.
- **Tipo de objeto:** contrato que define propiedades y tipos esperados.
- **Unión literal:** tipo que acepta uno entre varios valores concretos.
- **`null`:** valor que representa una ausencia deliberada.
- **Fixture:** colección de datos preparada para desarrollo o pruebas.
- **`map`:** método de arreglos que transforma cada elemento y devuelve un arreglo nuevo.
- **Callback:** función que otra función recibe para ejecutarla durante una operación.
- **`key`:** identidad que React usa para relacionar elementos hermanos entre renders.
- **Fallback:** contenido alternativo mostrado cuando falta el valor principal.
- **Runtime:** momento en el que la aplicación ya se está ejecutando.

## Referencia docente

- [Pasar props a un componente](https://react.dev/learn/passing-props-to-a-component)
- [Renderizar listas](https://react.dev/learn/rendering-lists)
- [Renderizado condicional](https://react.dev/learn/conditional-rendering)
- [Tipos cotidianos en TypeScript](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Tipos de objetos en TypeScript](https://www.typescriptlang.org/docs/handbook/2/objects.html)
