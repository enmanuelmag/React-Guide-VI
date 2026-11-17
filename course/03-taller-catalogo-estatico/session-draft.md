# Sesión 03 · Composición y catálogo estático

> Estado: paquete textual aprobado definitivamente. La presentación HTML está aprobada; el proyecto progresivo y los checkpoints de esta sesión están implementados.

- **Fecha:** sábado 26 de septiembre de 2026
- **Semana:** 1
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Taller y rúbrica:** [workshop-rubric.md](workshop-rubric.md)

## Punto de entrada

El docente comparte `session-03-start`, construido desde el checkpoint canónico de la sesión 02. El proyecto usa React `19.2.8`, TypeScript `6.0.3`, Vite y pnpm `11.17.0`.

El seed incluye:

- `MediaType` y `MediaItem`.
- Un fixture de seis entradas.
- Películas y series.
- Un poster nulo y una descripción nula.
- `AppHeader` y `MediaCard` terminados.
- `App` con `.media-list`, `map` y `media.id` como key.
- La etiqueta de tipo inline dentro de `MediaCard`.
- Los fallbacks “Poster no disponible” y “Sin descripción disponible”.
- CSS para el resultado de la sesión 02 y reglas preparadas para badge y estado vacío.

El seed omite `MediaGrid`, `MediaTypeBadge`, `EmptyState`, funciones vacías y comentarios que revelen el taller.

La apertura comprueba:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

- El navegador muestra seis tarjetas.
- La consola no presenta warnings de key.
- React DevTools muestra seis instancias de `MediaCard` debajo de `App`.
- Película, serie, poster nulo y descripción nula producen el resultado esperado.

## Checkpoint de salida

Al terminar:

- `src/components/media-grid.tsx` exporta `MediaGrid`.
- `MediaGrid` recibe `items: MediaItem[]` y no importa el fixture.
- `MediaGrid` conserva `.media-list`, ejecuta `map` y coloca `media.id` como key en cada `<MediaCard />`.
- `App` elige `mediaItems` y renderiza `<MediaGrid items={mediaItems} />`.
- `src/components/empty-state.tsx` exporta `EmptyState` con props `title` y `description`.
- `MediaGrid` devuelve `EmptyState` cuando `items.length === 0`.
- `src/components/media-type-badge.tsx` exporta `MediaTypeBadge` con `mediaType: MediaType`.
- `MediaCard` delega la etiqueta de película o serie a `MediaTypeBadge`.
- El fixture completo muestra seis tarjetas.
- `[]` muestra “Catálogo vacío” y “No hay películas o series disponibles”.
- Película, serie, poster nulo y descripción nula continúan funcionando.
- La consola no presenta warnings de key.
- El código no usa estado, eventos, Effects, stores o dependencias nuevas.
- `pnpm build` termina con código de salida 0.
- El estudiante explica quién posee `items`, `map`, `key` y la decisión del estado vacío.

El build comprueba TypeScript y la generación de archivos de producción. Las comprobaciones del catálogo, el árbol y los casos visuales requieren el servidor de desarrollo, React DevTools y el navegador.

## Resultado de aprendizaje

El estudiante podrá reorganizar una colección React en componentes con responsabilidades distintas, mantener el flujo descendente de props y comprobar que una refactorización conserva los casos visuales del fixture.

## Concepto principal

La composición asigna una responsabilidad reconocible a cada componente:

```text
App                    elige la colección
└── MediaGrid          decide lista o estado vacío
    ├── EmptyState     presenta el mensaje vacío
    └── MediaCard      presenta un medio
        └── MediaTypeBadge
                       presenta el tipo
```

La sesión reorganiza un comportamiento que ya funciona. No cambia los datos ni añade interacción.

## Vocabulario

- **Composición:** construcción de una interfaz mediante componentes anidados.
- **Jerarquía de componentes:** relación padre-hijo entre los componentes renderizados.
- **Responsabilidad:** parte del comportamiento o presentación que un componente posee.
- **Límite de componente:** decisión sobre qué código pertenece a un componente y qué recibe mediante props.
- **Contrato de props:** nombre y tipo de los datos que un componente espera.
- **Flujo descendente:** recorrido de datos desde un padre hacia sus hijos mediante props.
- **Refactorización:** cambio de organización que conserva el comportamiento observable.
- **Regresión:** comportamiento que funcionaba y deja de hacerlo después de un cambio.
- **Estado vacío:** interfaz que explica que una fuente no contiene elementos.
- **Retorno temprano:** salida de una función antes del retorno principal cuando se cumple una condición.
- **Valor derivado:** valor calculado desde datos disponibles, como `items.length`.
- **Seed:** proyecto inicial preparado para que todo el grupo empiece desde el mismo checkpoint.

## Estado inicial, transformación y estado final

### Estado inicial · App concentra la colección

```tsx
<div className="media-list">
  {mediaItems.map((media) => (
    <MediaCard key={media.id} data={media} />
  ))}
</div>
```

`App` elige los datos, compone la página, contiene el wrapper y recorre la colección. `MediaCard` también decide cómo traducir `mediaType` a texto.

### Transformación guiada · Extraer MediaGrid

Antes del descanso, el docente crea `MediaGrid` con este contrato:

```tsx
type MediaGridProps = {
  items: MediaItem[]
}
```

El wrapper, `map` y key se mueven juntos:

```tsx
export function MediaGrid(props: MediaGridProps) {
  const { items } = props
  return (
    <div className="media-list">
      {items.map((media) => (
        <MediaCard key={media.id} data={media} />
      ))}
    </div>
  )
}
```

`App` conserva la fuente:

```tsx
<MediaGrid items={mediaItems} />
```

Pasar `[]` deja un espacio vacío. Ese resultado abre el taller.

### Taller · Estado vacío y etiqueta de tipo

El taller añade un retorno temprano:

```tsx
if (items.length === 0) {
  return (
    <EmptyState
      title="Catálogo vacío"
      description="No hay películas o series disponibles."
    />
  )
}
```

`EmptyState` presenta texto recibido; no inspecciona la colección. `MediaGrid` decide cuándo mostrarlo porque posee `items`.

`MediaTypeBadge` recibe `mediaType` y produce “Película” o “Serie”. `MediaCard` conserva el objeto recibido en `data` y delega esa parte visual:

```tsx
<MediaTypeBadge mediaType={data.mediaType} />
```

### Estado final · Árbol compuesto

```text
src/
├── components/
│   ├── app-header.tsx
│   ├── empty-state.tsx
│   ├── media-card.tsx
│   ├── media-grid.tsx
│   └── media-type-badge.tsx
├── data/
│   └── media-items.ts
├── types/
│   └── media-item.ts
├── App.tsx
├── index.css
└── main.tsx
```

La clase conserva `.media-list` dentro de `MediaGrid`. Renombrar la clase CSS no mejora la responsabilidad del componente y agregaría otro cambio a la refactorización.

## Proyecto semilla y checkpoint alternativo

### Seed inicial

`session-03-start` reproduce la sesión 02 y añade únicamente CSS sin uso para:

- `.empty-state`.
- `.media-type-badge`.

No incluye JSX, imports o componentes asociados a esas clases.

### Checkpoint previo al taller

El docente prepara `session-03-workshop-start` con:

- `MediaGrid` terminado.
- `App` renderizando `<MediaGrid items={mediaItems} />`.
- Wrapper, `map` y key dentro de `MediaGrid`.
- Seis tarjetas y fallbacks funcionando.
- `[]` sin error, pero sin mensaje.

El checkpoint alternativo no incluye `EmptyState`, `MediaTypeBadge`, el reto adicional o comentarios que indiquen su solución.

## Secuencia completa

| Tiempo | Responsable | Actividad | Comprobación |
| --- | --- | --- | --- |
| 0–15 min | Docente y estudiantes | Recuperar el flujo de la sesión 02, revisar el cuestionario y ejecutar la regresión inicial. | Seis medios, dos tipos y dos fallbacks funcionan. |
| 15–35 min | Docente y grupo | Presentación continua: composición, contrato, key, retorno temprano, badge y criterios del taller. | El grupo identifica responsabilidades y la decisión vacía antes del descanso. |
| 35–50 min | Docente | Crear `MediaGrid`, definir `items: MediaItem[]` y escribir el recorrido conservando el fixture fuera. | El archivo de colección queda completo para conectarse al padre. |
| 50–65 min | Docente y grupo | Mover wrapper, `map` y key; conectar `App`; probar el fixture y `[]`. | Seis tarjetas funcionan; `[]` deja un espacio vacío. |
| 65–75 min | Docente | Presentar encargo, restricciones, rúbrica y checkpoint alternativo sin mostrar la solución. | El grupo identifica los dos componentes que construirá. |
| 75–105 min |  | Descanso. | No se introduce contenido. |
| 105–125 min | Estudiantes | Crear `EmptyState` e integrarlo mediante retorno temprano. | `[]` muestra título y descripción. |
| 125–145 min | Estudiantes | Crear `MediaTypeBadge` y sustituir la etiqueta inline. | Películas y series conservan textos distintos. |
| 145–155 min | Estudiantes | Integrar clases CSS y comparar el árbol con un compañero. | Los tres límites de componente coinciden con el diseño. |
| 155–165 min | Estudiantes | Ejecutar la matriz de casos y `pnpm build`; preparar evidencia. | Casos obligatorios y build quedan registrados. |
| 165–180 min | Docente y estudiantes | Revisar dos entregas, seguir una prop y cerrar con la necesidad de interacción. | El grupo explica responsabilidades y frontera de evidencia. |
| **Total** |  |  | **180 minutos** |

## Actividades del docente

- Revisar los resultados del cuestionario antes de la clase.
- Ejecutar la matriz inicial antes de refactorizar.
- Pedir una responsabilidad antes de aceptar el nombre `MediaGrid`.
- Contrastar la extracción con un `PageContainer` que todavía no resuelve un problema.
- Dibujar el árbol actual y el propuesto.
- Definir `items: MediaItem[]` sin importar el fixture desde el grid.
- Mover `map` y key como una unidad.
- Probar `[]` para hacer visible el trabajo del taller.
- Presentar rúbrica y casos de aceptación antes del descanso.
- Durante el taller, revisar primero flujo, luego condicionales y al final estilos.
- Pedir explicaciones antes de señalar una línea concreta.
- Ejecutar los casos de regresión en la revisión final.

## Actividades de los estudiantes

- Responder el cuestionario previo.
- Reconstruir `fixture → App → map → MediaCard`.
- Proponer el contrato de la colección.
- Identificar qué líneas deben moverse juntas.
- Comprobar el resultado antes y después de la refactorización.
- Leer la rúbrica antes del descanso.
- Crear `EmptyState` y `MediaTypeBadge` sin estado.
- Integrar los componentes con las clases CSS entregadas.
- Probar colección completa, vacía, tipos y casos nulos.
- Comparar el árbol con otra persona.
- Ejecutar el build y explicar los límites de esa evidencia.

## Guion de presentación

### Presentación continua · 20 minutos

Después de recuperar el checkpoint durante 0–15, presenta las slides de forma continua durante 15–35. El retorno temprano se explica conceptualmente antes del descanso. Durante 35–65 se construye MediaGrid; 65–75 se revisa el encargo en la guía sin volver al deck. La slide de cierre se usa como referencia para las preguntas orales, sin regresar a ella.

| Orden | Título provisional | Contenido que debe conservarse | Recurso y nota docente |
| ---: | --- | --- | --- |
| 1 | Del fixture a seis tarjetas | Recuperar `fixture → App → map → MediaCard`. | Diagrama incompleto para que el grupo ubique cada responsabilidad. |
| 2 | Cuatro casos que no podemos perder | Película, serie, poster nulo y descripción nula forman la matriz inicial. | Cuatro capturas tratadas como regresión manual. |
| 3 | App concentra la colección | Resaltar wrapper, `map` y key sin usar el tamaño del archivo como argumento. | Snippet del bloque que se moverá. |
| 4 | Un componente necesita una responsabilidad | `MediaGrid` presenta cualquier colección compatible. `PageContainer` queda fuera porque solo envolvería contenido. | Árbol actual y árbol propuesto. |
| 5 | El grid recibe items | `App` elige la fuente; `MediaGrid` recibe `MediaItem[]`. | Diagrama `App --items--> MediaGrid`. |
| 6 | Map y key se mueven juntos | La key permanece en el elemento directo que devuelve el recorrido. | Animar el bloque completo desde `App` al grid. |
| 7 | Una colección puede estar vacía | `MediaGrid` conoce `items.length` y decide qué rama renderizar. | Flujo `0 → EmptyState`, `>0 → lista`. |
| 8 | Decidir no es presentar | `MediaGrid` decide; `EmptyState` presenta `title` y `description`. | Dos cajas con responsabilidades distintas. |
| 9 | Una etiqueta también tiene contrato | `MediaTypeBadge` recibe `mediaType`; `MediaCard` sigue presentando el medio. | Resaltar la etiqueta inline sin mostrar su extracción. |
| 10 | Refactorizar exige regresión | La estructura cambia y los seis casos deben conservarse. | Checklist de taller sin código resuelto. |

### Indicaciones para la producción de slides

- La refactorización conserva comportamiento observable.
- El fixture permanece en `App`.
- `MediaGrid` recibe `items`; no importa los datos.
- El componente que ejecuta `map` conserva la key en el elemento directo.
- `EmptyState` recibe texto y no conoce el arreglo.
- `items.length === 0` evita el `0` visible que puede producir una condición numérica con `&&`.
- `MediaTypeBadge` deriva texto desde props y no necesita estado.
- Ningún componente de esta sesión necesita Effects o stores.
- El deck previo al taller muestra responsabilidades y criterios, no la solución.

### Puente hacia el editor

> Si App ya elige el fixture, ¿qué bloque representa la responsabilidad de presentar una colección completa?

Respuesta esperada: el wrapper con `map`, la key y cada `MediaCard`; ese bloque formará `MediaGrid`.

### Cierre conceptual · 15 minutos

1. ¿Por qué `MediaGrid` recibe `items` en lugar de importar el fixture?
2. ¿Dónde vive la key después de mover el recorrido?
3. ¿Quién decide mostrar el estado vacío y quién presenta su texto?
4. ¿Qué dato tendría que cambiar para mostrar menos tarjetas?

La cuarta respuesta abre la sesión 04: una interacción cambiará `query`, y `App` calculará la colección visible antes de entregarla a `MediaGrid`.

## Taller calificable

### Encargo

Completar la composición de “Catálogo de la semana”. El punto de partida ya contiene `MediaGrid` con los seis medios. El taller añade una respuesta para la colección vacía y separa la etiqueta de tipo sin cambiar el fixture.

### Trabajo obligatorio

1. Crear `EmptyState` con props `title` y `description`.
2. Retornarlo desde `MediaGrid` cuando `items.length === 0`.
3. Crear `MediaTypeBadge` con `mediaType: MediaType`.
4. Reemplazar la etiqueta inline de `MediaCard`.
5. Mantener `map` y `media.id` dentro de `MediaGrid`.
6. Conectar las clases CSS provistas.
7. Ejecutar los seis casos de aceptación.
8. Mantener TypeScript y el build sin errores.

### Actividad opcional

Mostrar el total mediante `items.length` cuando la colección contenga elementos. El total se calcula durante el render y no usa estado. Otorga hasta 5 puntos extra.

### Restricciones

- No usar `useState`, Effects, stores o almacenamiento local.
- No añadir inputs, botones o eventos.
- No instalar dependencias.
- No importar el fixture desde `MediaGrid`.
- No mover la key al interior de `MediaCard`.
- No usar `children` en `EmptyState`.
- No cambiar `MediaItem` o el fixture para evitar un caso.

## Evidencia y entrega

El estudiante entrega:

- ZIP o enlace admitido por la plataforma.
- Captura del catálogo con seis medios.
- Captura del estado vacío.
- Árbol final escrito o dibujado.
- Resultado de `pnpm build`.
- Explicación de quién posee `items`, `map`, key y la decisión de vacío.

Las capturas demuestran los estados observados en ese navegador. El build demuestra tipos y producción de archivos. Ninguna evidencia prueba una API, despliegue o comportamiento en producción.

## Plan de contingencia

- **El seed no inicia:** entregar una copia verificada y registrar el primer error. No reconstruir la sesión 02 durante esta clase.
- **El bloque previo supera 75 minutos:** entregar `session-03-workshop-start`. No reducir los 60 minutos calificables.
- **Una imagen local falla:** comprobar rutas y los SVG heredados en public/posters; evaluar el caso null por separado.
- **Varios estudiantes importan el fixture desde el grid:** detener cinco minutos y reconstruir `App --items--> MediaGrid` sin escribir la solución del taller.
- **Varios estudiantes mueven la key:** volver al elemento directo producido por `map`.
- **El build falla:** registrar el primer error y evaluar por separado las evidencias que todavía puedan observarse.

## Fuera de alcance

- Inputs, botones, eventos y handlers.
- `useState`, estado derivado interactivo, Effects y stores.
- Búsqueda, filtros y estado sin resultados.
- `children` y componentes contenedores genéricos.
- Mantine, API, persistencia y dependencias nuevas.
- Tests automatizados y agentes.
- Producir la sesión 04 o añadir su interacción.

## Decisiones y simplificaciones pedagógicas

- El docente construye `MediaGrid` antes del descanso porque su contrato y el movimiento de `map` forman el concepto nuevo.
- El taller aplica decisiones ya explicadas: retorno condicional, componentes de presentación y flujo de props.
- `App` conserva la elección de la fuente.
- `MediaGrid` conserva la decisión de lista o vacío.
- `EmptyState` presenta texto y no inspecciona `items`.
- `MediaTypeBadge` recibe un valor del dominio y no importa el medio completo.
- La clase conserva `.media-list` durante la extracción para limitar el cambio a organización de componentes.
- El reto usa `items.length` como valor derivado y no añade estado.
- La rúbrica evalúa la entrega completa, pero concentra más puntos en el trabajo posterior al descanso.
- Las sesiones 01 a 06 mantienen trabajo manual.

## Fuentes verificadas el 29 de agosto de 2026

- React, [Thinking in React](https://react.dev/learn/thinking-in-react).
- React, [Conditional Rendering](https://react.dev/learn/conditional-rendering).
- React, [Rendering Lists](https://react.dev/learn/rendering-lists).
- React, [Understanding Your UI as a Tree](https://react.dev/learn/understanding-your-ui-as-a-tree).
