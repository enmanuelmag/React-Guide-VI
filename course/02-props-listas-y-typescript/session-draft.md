# Sesión 02 · Props, listas y TypeScript

> Estado: paquete textual aprobado definitivamente. La presentación HTML está aprobada y el proyecto de esta sesión está implementado. Véase [el plan de producción](../../progressive-project-plan.md).

- **Fecha:** jueves 24 de septiembre de 2026
- **Semana:** 1
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)

## Punto de entrada

Cada estudiante abre el checkpoint terminado de la sesión 01. El proyecto usa Vite, React `19.2.8`, TypeScript y pnpm `11.17.0`. `App` compone `AppHeader` y una `MediaCard` cuyos datos están escritos dentro del componente.

```text
App
├── AppHeader
└── main
    └── MediaCard con datos fijos
```

La apertura comprueba tres condiciones:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

- El navegador muestra un encabezado y una tarjeta.
- React DevTools muestra `App`, `AppHeader` y `MediaCard`.
- `MediaCard` no recibe props.

Si el proyecto no alcanza ese punto, el docente entrega el checkpoint privado de la sesión 01. La sesión no repite el scaffold ni la extracción de componentes.

## Checkpoint de salida

Al terminar:

- `src/types/media-item.ts` exporta `MediaType` y `MediaItem`.
- `MediaType` admite `"movie"` o `"series"`.
- `MediaItem` declara `id`, `title`, `description`, `mediaType`, `releaseDate` y `posterUrl`.
- `description` y `posterUrl` usan `string | null`; las propiedades siguen siendo obligatorias.
- `src/data/media-items.ts` exporta `mediaItems: MediaItem[]` con seis entradas.
- El fixture incluye películas, series, un poster nulo y una descripción nula.
- `MediaCard` recibe una prop `data: MediaItem` y no conserva datos de dominio fijos.
- `App` recorre `mediaItems` con `map` y coloca `media.id` como `key` de cada `<MediaCard />`.
- El navegador muestra seis tarjetas con contenido distinto.
- Los tipos `movie` y `series` producen los textos “Película” y “Serie”.
- Un poster nulo muestra “Poster no disponible”.
- Una descripción nula muestra “Sin descripción disponible”.
- La consola no presenta el warning de key.
- `pnpm build` termina con código de salida 0.
- El estudiante explica `fixture → App → data prop → MediaCard → JSX`.

El build comprueba TypeScript y la generación de archivos de producción. No demuestra que las seis tarjetas ni los fallbacks se vean bien. Esa evidencia requiere `pnpm dev`, la consola y una comprobación visual.

## Resultado de aprendizaje

El estudiante podrá definir el contrato tipado de un medio, pasar un objeto mediante props y transformar un arreglo en elementos React con `map` y keys estables, sin introducir estado o interacción.

## Concepto principal

Una estructura de interfaz puede representar datos distintos cuando el componente recibe un contrato mediante props. `App` conserva la colección y crea una `MediaCard` por cada objeto:

```text
mediaItems: MediaItem[]
        │
        ▼
       App
        │ map + key
        ▼
MediaCard data={media}
        │
        ▼
       JSX
```

Los tipos, el fixture, `map`, `key` y los casos nulos sostienen este flujo. La sesión no los presenta como cinco temas sin relación.

## Vocabulario

- **Prop:** dato que un componente padre entrega a un componente hijo mediante JSX.
- **Contrato de props:** forma que deben cumplir las props de un componente.
- **Flujo de datos:** recorrido de un dato desde quien lo posee hasta quien lo presenta.
- **Fixture:** conjunto controlado de datos usados para desarrollar y comprobar la interfaz.
- **Alias de tipo:** nombre asignado a una forma de datos mediante `type`.
- **Unión literal:** tipo que limita un valor a opciones concretas, como `"movie" | "series"`.
- **Valor nulo:** ausencia explícita representada por `null`.
- **Arreglo tipado:** colección cuyos elementos deben cumplir un tipo, como `MediaItem[]`.
- **`map`:** método de arreglos que transforma cada elemento en un nuevo resultado.
- **`key`:** identidad estable que React usa para relacionar un elemento de una lista con su dato.
- **Renderizado condicional:** elección de una salida visual según un dato disponible.
- **Error de TypeScript:** incumplimiento del contrato detectado durante el desarrollo o build.
- **Error de runtime:** problema que aparece cuando el programa se ejecuta. TypeScript no comprueba por sí solo datos externos durante runtime.

## Estado inicial, transformación y estado final

### Estado inicial · Una tarjeta rígida

`MediaCard` presenta una película concreta:

```tsx
export function MediaCard() {
  return (
    <article className="media-card">
      <div className="media-card__poster">Poster pendiente</div>
      <div>
        <p className="media-card__meta">Película · 2016</p>
        <h3>Arrival</h3>
        <p>
          Una lingüista intenta comprender a visitantes que han llegado a
          distintos puntos del planeta.
        </p>
      </div>
    </article>
  )
}
```

Duplicar `<MediaCard />` solo repite el mismo contenido. Copiar el componente para cada título repetiría estructura y estilos.

### Transformación guiada · Del dato fijo al contrato

Antes de crear el contrato, añade `"strictNullChecks": true,` dentro de `compilerOptions` en `tsconfig.app.json`, junto a las opciones de linting. El scaffold de 01 no lo activa: esta opción distingue `null` y `undefined` de un string. Conserva el resto de opciones. Prueba temporalmente `description: undefined` en el fixture, lee el error y restaura el valor; el checkpoint debe compilar.

Primero se define el dominio mínimo en `src/types/media-item.ts`:

```ts
export type MediaType = 'movie' | 'series'

export type MediaItem = {
  id: number
  title: string
  description: string | null
  mediaType: MediaType
  releaseDate: string
  posterUrl: string | null
}
```

La clase usa `type` para nombrar tanto la unión como el objeto. No compara esta sintaxis con `interface`.

Después se crea `src/data/media-items.ts`. El docente escribe dos objetos, incorpora tres entradas preparadas y deja la sexta para la práctica individual. El archivo final exporta:

```ts
export const mediaItems: MediaItem[] = [
  // seis objetos que cumplen MediaItem
]
```

`MediaCard` reemplaza sus datos fijos por una sola prop:

```tsx
type MediaCardProps = {
  data: MediaItem
}

export function MediaCard(props: MediaCardProps) {
  const { data } = props
  // JSX derivado de data
}
```

`App` conserva la colección y el recorrido:

```tsx
<div className="media-list">
  {mediaItems.map((media) => (
    <MediaCard key={media.id} data={media} />
  ))}
</div>
```

El docente omite `key` durante menos de un minuto para que el grupo localice el warning. Después añade `media.id`. No implementa índices ni valores aleatorios como etapa intermedia.

### Estado final · Seis tarjetas configuradas por datos

```text
src/
├── components/
│   ├── app-header.tsx
│   └── media-card.tsx
├── data/
│   └── media-items.ts
├── types/
│   └── media-item.ts
├── App.tsx
├── index.css
└── main.tsx
```

`App` todavía contiene el wrapper visual, `map` y `key`. `MediaCard` todavía decide de forma inline el texto de tipo. Estas dos concentraciones abren la sesión 03.

## Fixture canónico

El fixture final usa seis casos:

| `id` | Título | Tipo | Caso que comprueba |
| ---: | --- | --- | --- |
| 1 | Arrival | `movie` | Película con datos completos |
| 2 | Severance | `series` | Serie con datos completos |
| 3 | Aftersun | `movie` | `posterUrl: null` |
| 4 | The Bear | `series` | `description: null` |
| 5 | Past Lives | `movie` | Segunda película completa |
| 6 | Blue Eye Samurai | `series` | Objeto completado por el estudiante |

El proyecto entrega SVG de prueba en `public/posters/`, con rutas locales `/posters/*.svg`. Se copian como soporte al crear el fixture. Aftersun conserva null; el fallback responde a ese valor y no a un archivo inexistente.

## Secuencia completa

| Tiempo | Responsable | Actividad | Comprobación |
| --- | --- | --- | --- |
| 0–8 min | Docente y estudiantes | Abrir el checkpoint anterior, revisar la pregunta previa con más errores y hacer visible la limitación de la tarjeta fija. | El navegador muestra una tarjeta y `MediaCard` no recibe props. |
| 8–25 min | Docente | Presentación continua de props, contrato, fixture, map, key y decisiones visuales. | El grupo identifica quién posee el dato y quién lo presenta. |
| 25–37 min | Docente y grupo | Crear `MediaType`, `MediaItem` y las primeras entradas del fixture; leer un error deliberado de TypeScript. | El fixture parcial cumple `MediaItem[]`. |
| 37–50 min | Docente y grupo | Definir `MediaCardProps`, recibir `data` y sustituir todos los datos fijos. | Una tarjeta cambia al cambiar el objeto entregado por `App`. |
| 50–63 min | Docente y grupo | Importar el arreglo, recorrerlo con `map`, observar el warning de key y corregirlo con `media.id`. | Se renderizan cinco tarjetas y la consola queda sin warning de key. |
| 63–77 min | Docente y grupo | Derivar el texto de tipo y resolver poster y descripción nulos. | Los cuatro casos visuales funcionan sin estado. |
| 77–85 min | Estudiantes | Completar el sexto objeto y explicar el error de TypeScript que aparece si omiten una propiedad o usan un tipo inválido. | Aparecen seis tarjetas y el sexto objeto cumple el contrato. |
| 85–90 min | Docente y estudiantes | Ejecutar el checkpoint final, reconstruir el flujo de datos y nombrar la responsabilidad pendiente en `App`. | `pnpm build` termina con código 0 y el grupo explica el flujo. |
| **Total** |  |  | **90 minutos** |

## Actividades del docente

- Revisar los resultados del cuestionario y recuperar solo la pregunta con mayor error.
- Comprobar el checkpoint de la sesión 01 antes de introducir contenido.
- Mostrar por qué duplicar la tarjeta fija no produce datos distintos.
- Dibujar el flujo `App --data--> MediaCard`.
- Definir `MediaType` y `MediaItem` con el grupo.
- Provocar un valor `"anime"` y pedir al grupo que lea el error antes de corregirlo.
- Construir dos objetos del fixture y pegar tres entradas preparadas.
- Convertir `MediaCard` para que reciba una sola prop `data`.
- Mostrar el warning de key durante menos de un minuto y corregirlo con un `id` estable.
- Preguntar qué casos requieren una decisión visual antes de escribir los fallbacks.
- Reservar `MediaGrid`, `MediaTypeBadge` y `EmptyState` para la sesión 03.
- Separar la evidencia de TypeScript, consola y navegador.

## Actividades de los estudiantes

- Responder el cuestionario previo.
- Ejecutar el proyecto de la sesión 01 y reconocer su limitación.
- Predecir qué datos debe recibir `MediaCard`.
- Leer los errores de TypeScript producidos por un tipo y una propiedad inválidos.
- Proponer el contrato de `MediaItem`.
- Completar imports, prop y expresiones JSX durante la construcción guiada.
- Identificar el elemento directo que devuelve `map`.
- Comprobar el warning antes y después de añadir `key`.
- Completar el sexto medio sin copiar otro componente.
- Verificar los casos nulos y ejecutar el build.
- Explicar el flujo desde el fixture hasta el JSX.

## Guion de presentación

### Presentación continua · 17 minutos, además de la recuperación inicial

Se usan las slides 1–2 durante 0–8 y 3–13 durante 8–25. Después hay una única transición al editor. La slide 14 queda como referencia docente; el cierre es oral. Se conserva el HTML aprobado; esta instrucción prevalece sobre su antigua nota de volver al deck.

| Orden | Título provisional | Contenido que debe conservarse | Recurso y nota docente |
| ---: | --- | --- | --- |
| 1 | Una tarjeta, un solo contenido | Recuperar el árbol de la sesión 01 y mostrar que dos usos de `<MediaCard />` repiten Arrival. | Captura del checkpoint y pregunta: “¿Dónde viven hoy los datos?”. |
| 2 | El padre posee, el hijo presenta | `App` elige el dato; `MediaCard` lo recibe y lo muestra. | Diagrama `App --data--> MediaCard`. No introducir estado. |
| 3 | Una prop es una entrada | La prop se escribe en JSX y se lee en el parámetro del componente. | Snippet mínimo `title="Arrival"` antes de pasar el objeto completo. |
| 4 | Props de solo lectura | El hijo usa el dato recibido; no lo modifica. El padre puede entregar otro objeto en otro render. | Contrastar lectura con una asignación tachada. No explicar snapshots de estado. |
| 5 | El contrato del medio | `MediaItem` describe qué propiedades debe declarar cada objeto. | Tabla propiedad, tipo y ejemplo. |
| 6 | Opciones cerradas y ausencia explícita | `MediaType` limita el dominio; `string | null` obliga a reconocer la ausencia. | Dos pequeñas balanzas: `movie/series` y valor/null. |
| 7 | Un fixture controlado | El arreglo permite desarrollar la interfaz con casos conocidos antes de conectar una API. | Tabla de los seis casos. Aclarar que no valida datos remotos. |
| 8 | De arreglo a elementos | `map` recibe cada medio y devuelve una `MediaCard`. | Animación o diagrama de cinco objetos convirtiéndose en cinco tarjetas. |
| 9 | La key identifica al elemento | React usa una identidad estable entre hermanos. `key` no llega como prop normal. | Mostrar el warning y resaltar `media.id`. |
| 10 | Los datos deciden la presentación | Tipo, poster y descripción cambian el JSX sin duplicar el componente. | Matriz de cuatro casos visuales. |
| 11 | Flujo final de la sesión | `fixture → App → map → MediaCard → JSX`. | Diagrama completo con los archivos responsables. |
| 12 | La siguiente limitación | `App` todavía organiza y recorre la colección; `MediaCard` todavía contiene la etiqueta inline. | Resaltar wrapper, `map` y texto de tipo, sin mostrar las extracciones futuras. |

### Puente hacia el editor

El docente cierra la apertura con esta pregunta:

> Si dos usos de `MediaCard` necesitan contenidos distintos, ¿quién debe elegir cada dato y por dónde entra al componente?

Respuesta esperada: `App` elige el dato y lo entrega a `MediaCard` mediante una prop.

### Cierre conceptual · 5 minutos

Sin volver al deck, el docente recupera el flujo sobre el código y plantea:

1. ¿Quién posee el fixture y quién presenta cada medio?
2. ¿Qué comprueba MediaItem y qué no comprueba en runtime?
3. ¿Por qué media.id sirve como key y por qué key no es una prop normal?
4. ¿Qué responsabilidad concentra todavía App?

La cuarta respuesta abre 03: App conserva wrapper, recorrido y key. No mostrar todavía las extracciones.

## Checkpoints intermedios

### Checkpoint 1 · Proyecto recuperado

- Una tarjeta fija visible.
- Sin props en `MediaCard`.
- Sin errores en terminal o consola.

### Checkpoint 2 · Contrato y fixture parcial

- `MediaType` rechaza un valor distinto de `movie` o `series`.
- `MediaItem` exige todas las propiedades.
- Cinco objetos cumplen `MediaItem[]`.

### Checkpoint 3 · Tarjeta configurable

- `MediaCard` recibe `data`.
- Cambiar el objeto entregado cambia el contenido.
- No quedan datos de una película concreta dentro del componente.

### Checkpoint 4 · Lista identificada

- `map` devuelve `<MediaCard />`.
- La key vive en el elemento directo del recorrido.
- La consola no muestra el warning de key.

### Checkpoint 5 · Seis casos visibles

- Se muestran seis tarjetas.
- Funcionan película, serie, poster nulo y descripción nula.
- `pnpm build` termina con código 0.

## Evidencia y entrega

El estudiante entrega un ZIP de `MediaLog-Bootcamp` sin `node_modules/` ni `dist/`, junto con un texto breve que incluya:

1. El flujo `fixture → App → data prop → MediaCard → JSX`.
2. El resultado observado en `pnpm build`.
3. La confirmación de que la consola no presenta warnings de key.

La entrega debe incluir `package.json`, `pnpm-lock.yaml`, `src/`, `public/` y los archivos de configuración. No incluye tokens, contraseñas o variables de entorno.

## Plan de contingencia

- **El proyecto anterior no inicia:** entregar el checkpoint privado de la sesión 01 y registrar qué archivo o comando falló. No repetir el scaffold durante esta clase.
- **Una imagen local no carga:** comprobar la ruta y la copia de `public/posters/`; el caso `posterUrl: null` debe seguir mostrando el fallback local.
- **El grupo se demora escribiendo objetos:** entregar las tres entradas preparadas. Mantener la sexta como práctica individual.
- **El warning de key no aparece:** confirmar que React ejecuta en desarrollo y localizar la key ya existente. Explicar su posición sin fabricar otro error.
- **El build falla:** leer el primer error, ubicar archivo y propiedad, y corregir el contrato incumplido. No relajar el tipo ni usar `any`.
- **La práctica individual queda incompleta:** entregar un sexto objeto con una propiedad inválida para que el estudiante lea y corrija el error. No entregar `MediaGrid` ni componentes de la siguiente sesión.

## Fuera de alcance

- `children`, props opcionales, valores por defecto y prop spreading.
- Comparación entre `type` e `interface`.
- Genéricos, enums, assertions, `as`, `any` y non-null assertion `!`.
- `filter`, `reduce`, ordenamiento o mutación del fixture.
- Índices o valores aleatorios como estrategia de key.
- `MediaGrid`, `MediaTypeBadge`, `EmptyState` y `PageContainer` como componentes.
- Eventos, inputs, `useState`, Effects o stores.
- API, DTOs, validación de runtime y estado remoto.
- Formateo de fechas y tratamiento avanzado de imágenes.

## Decisiones y simplificaciones pedagógicas

- La sesión parte de una tarjeta fija para que props resuelva un problema visible.
- `MediaCard` recibe el objeto completo mediante `data`. El componente ya nombra su responsabilidad; el padre conserva `media` como variable local del recorrido. Se evita una lista larga de props que después tendría que cambiarse.
- Los tipos compartidos viven en `src/types/`; el tipo local `MediaCardProps` permanece junto al componente.
- El fixture vive en `src/data/` y no se importa desde `MediaCard`.
- La clase usa `type` para el alias de objeto y la unión literal. No abre una comparación con `interface`.
- `description` y `posterUrl` son propiedades obligatorias que admiten `null`. El contrato distingue ausencia explícita de propiedad omitida.
- El docente muestra un error real de TypeScript y el warning real de React antes de corregirlos.
- El warning de key ocupa menos de un minuto. La clase usa directamente `media.id` y solo explica por qué índices y valores generados no son adecuados.
- El fixture final conserva seis entradas porque la sesión 03 depende de esos casos.
- El estudiante completa el sexto objeto; no escribe seis variaciones mecánicas durante la clase.
- `App` conserva el wrapper y el recorrido para que la sesión 03 tenga una responsabilidad observable que extraer.
- `MediaCard` conserva la etiqueta de tipo inline para que `MediaTypeBadge` responda a una necesidad visible en la sesión 03.
- No se crea `EmptyState`: el fixture no está vacío y ese caso forma parte del taller siguiente.
- La lectura previa cubre props y el vocabulario de TypeScript. `map` y `key` se construyen durante la sesión.
- La sesión separa errores estáticos, warnings de desarrollo, resultado visual y build.

## Fuentes verificadas el 29 de agosto de 2026

- React, [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component).
- React, [Rendering Lists](https://react.dev/learn/rendering-lists).
- TypeScript, [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

React documenta las props como entradas de solo lectura. Su guía de listas exige keys para los elementos directos creados por `map`, recomienda identidades estables derivadas de los datos y aclara que `key` no llega al componente como una prop normal. TypeScript documenta `T[]`, aliases, uniones y la comprobación de `null` con `strictNullChecks`.
