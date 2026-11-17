# Clase 03 · Taller de catálogo estático

- **Semana:** 1
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** proyecto semilla `s01-c03-catalogo-estatico-seed`
- **Checkpoint de salida:** catálogo estático compuesto con `MediaGrid`, `EmptyState` y `MediaTypeBadge`, sin interacción

## Resultado de aprendizaje

Al terminar, el estudiante podrá reorganizar una colección React en componentes con responsabilidades distintas, conservar el flujo de props y comprobar los casos visuales definidos por el fixture. El taller no usa inputs, eventos, estado, modal ni API.

## Limitación que abre la clase

El checkpoint de la clase 02 ya muestra seis tarjetas, pero `App` importa los datos, recorre el arreglo, asigna keys y contiene el wrapper visual de la colección. `MediaCard` también conserva dentro de su marcado la decisión visual del tipo.

Además, pasar `[]` produce un espacio vacío sin explicación. La clase reorganiza esas responsabilidades sin cambiar los datos ni añadir interacción.

## Conceptos que se consolidan

- Componentes y props.
- Listas, `map` y `key`.
- Renderizado condicional.
- Composición y responsabilidad de componentes.
- Contrato de props para una colección.
- Ubicación de una decisión visual.
- Estado vacío frente a una lista con elementos.

## Guion de presentación

### Propósito y duración

La presentación conceptual ocupa los primeros 15 minutos. Recupera el flujo de la clase 02 y presenta las decisiones de composición que el docente aplicará antes del descanso. La clase vuelve al deck durante los 15 minutos de revisión final.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Del fixture a seis tarjetas | Recuperar `fixture → App → map → MediaCard`. Pedir al grupo que ubique quién posee el arreglo, quién crea la colección de elementos y quién presenta un medio. | Diagrama incompleto para que los estudiantes coloquen `App`, `map` y `MediaCard`. |
| Comprobación | Cuatro casos que ya funcionan | El checkpoint muestra películas, series, poster ausente y descripción ausente. La refactorización debe conservar esos comportamientos. | Capturas de los cuatro casos. Presentarlas como pruebas de regresión manual. |
| Problema | `App` concentra la colección | `App` compone la página, pero también contiene el wrapper, el `map` y la key. Esa concentración permite nombrar una nueva responsabilidad: presentar una colección de medios. | Resaltar solo el bloque que se moverá. No usar el tamaño del archivo como única justificación. |
| Concepto | Composición por responsabilidad | `App` elige qué colección mostrar; `MediaGrid` organiza y recorre esa colección; `MediaCard` presenta un medio. Cada componente recibe los datos que necesita mediante props. | Árbol actual frente al árbol propuesto. |
| Contraste | Extraer una responsabilidad, no cada wrapper | `MediaGrid` tiene un contrato y una tarea visibles. Un `PageContainer` que solo envuelve el contenido no aporta todavía una responsabilidad propia y queda fuera de la clase. | Comparar una extracción justificada con una carpeta llena de wrappers nominales. |
| Contrato | `MediaGrid` recibe `items` | El grid recibe `MediaItem[]` en lugar de importar el fixture. Así puede representar cualquier colección compatible, incluido un arreglo vacío. `App` conserva la elección de la fuente. | Diagrama `App --items--> MediaGrid`. Preguntar qué se perdería si el grid importara el fixture directamente. |
| Distinción | `map` y `key` se mueven juntos | `MediaGrid` pasa a ser el dueño del recorrido. La key permanece en `<MediaCard />`, el elemento directo que devuelve `map`. No se coloca dentro de `MediaCard`. | Animar el bloque `map` desde `App` hacia `MediaGrid` sin separar la key. |
| Concepto | Quién decide el estado vacío | `MediaGrid` conoce `items.length` y decide si muestra una colección o `EmptyState`. `EmptyState` solo presenta `title` y `description`; no necesita conocer el arreglo. | Diagrama de decisión. Usar un `if` con retorno temprano; evitar `items.length && ...`, que podría renderizar `0`. |
| Concepto | Extraer la etiqueta de tipo | `MediaCard` conoce el medio, pero la etiqueta tiene una presentación y un contrato propios. `MediaTypeBadge` recibe `mediaType` y traduce `movie` o `series` a texto visible. | Mostrar el condicional inline actual y señalar el bloque que el taller extraerá, sin escribir la solución. |
| Puente | Qué queda antes y después del descanso | Antes del descanso, el docente extrae `MediaGrid` y mueve `map` con su key. Después, el taller construye `EmptyState`, extrae `MediaTypeBadge` y verifica todos los casos. | Árbol final con los tres componentes nuevos. Mantener el código del taller oculto. |

### Indicaciones que deben sobrevivir a la producción de slides

- Una refactorización cambia la organización y debe conservar los comportamientos que ya funcionaban.
- `App` sigue siendo responsable de elegir los datos y componer la pantalla.
- `MediaGrid` recibe la colección mediante props; no importa el fixture.
- El componente que ejecuta `map` coloca la key en el elemento JSX que devuelve directamente.
- `key` no se mueve al interior de `MediaCard`.
- `MediaGrid` decide entre lista y estado vacío porque posee la prop `items`.
- `EmptyState` presenta un mensaje; no inspecciona la colección.
- Un catálogo vacío significa que la fuente no tiene medios. La clase 04 distinguirá ese caso de una búsqueda sin coincidencias.
- `items.length === 0` expresa la condición con claridad. Un número a la izquierda de `&&` puede producir un `0` visible.
- `MediaTypeBadge` deriva su texto de una prop y no necesita estado.
- Ninguna extracción justifica introducir `useState`, Effects o un store.

### Cierre conceptual

La revisión final vuelve al árbol construido y plantea:

1. ¿Por qué `MediaGrid` recibe `items` en lugar de importar el fixture?
2. ¿Dónde debe vivir la key después de mover el `map`?
3. ¿Quién decide mostrar `EmptyState` y quién define su contenido visual?
4. ¿Qué dato deberá cambiar cuando agreguemos una búsqueda en la clase 04?

La cuarta pregunta abre la semana 2: una interacción modificará el texto de búsqueda y React deberá recordar ese valor entre renders.

## Proyecto semilla

El docente compartirá `s01-c03-catalogo-estatico-seed`, construido desde el checkpoint canónico de la clase 02. El seed:

- Incluye Vite, React, TypeScript, `pnpm-lock.yaml` y estilos base.
- Incluye `MediaItem`, `MediaType` y un fixture de seis entradas; todas declaran `description` y una usa `null`.
- Incluye `AppHeader` y `MediaCard` terminados.
- Proporciona las reglas CSS de grid, badge y estado vacío sin incluir el JSX que las utiliza.
- Mantiene en `App` el wrapper, el `map`, `media.id` como key y la prop `data`.
- Conserva la etiqueta inline de película o serie y el fallback del poster.
- Inicia con `pnpm dev` y completa `pnpm build` sin errores.

El seed no incluye `PageContainer`, `MediaGrid`, `MediaTypeBadge` ni `EmptyState`. Tampoco contiene funciones vacías, comentarios que revelen la solución o dependencias nuevas.

### Comprobación inicial del seed

Antes de enseñar contenido, el grupo debe comprobar:

- Se muestran los seis medios.
- Películas y series tienen textos distintos.
- El poster nulo activa el fallback.
- La descripción nula activa “Sin descripción disponible”.
- No hay warnings de key.
- TypeScript y el build permanecen verdes.

## Antes del descanso · 75 minutos

| Tiempo | Contenido y progreso guiado |
| --- | --- |
| 0-15 min | Usar el deck para recuperar el flujo de datos, comprobar el seed y presentar el árbol objetivo. |
| 15-30 min | Analizar `App`, marcar el wrapper, el `map` y la key, y asignar responsabilidades con el grupo. |
| 30-50 min | Demostración docente: crear `MediaGrid`, definir la prop `items: MediaItem[]` y renderizar primero una colección recibida. |
| 50-65 min | Construcción interactiva: mover el `map` y `media.id` como key; comprobar seis elementos y observar que `[]` todavía deja un espacio vacío. |
| 65-75 min | Presentar el encargo, los criterios, las restricciones y el checkpoint alternativo; resolver preguntas sin implementar el taller. |

### Actividades del docente antes del descanso

- Ejecutar la matriz inicial de cuatro casos antes de refactorizar.
- Pedir al grupo que nombre la responsabilidad antes de crear `media-grid.tsx`.
- Mostrar el contrato `items: MediaItem[]` y conservar el fixture fuera del componente.
- Preguntar dónde debe quedar la key al mover `map`.
- Probar `[]` para hacer visible el trabajo pendiente sin crear todavía `EmptyState`.
- Presentar la solución visual esperada del taller sin mostrar su código.

### Actividades de los estudiantes antes del descanso

- Reconstruir el flujo `fixture → App → MediaCard`.
- Marcar qué líneas pertenecen a la responsabilidad de la colección.
- Proponer el nombre `items` y su tipo.
- Indicar el archivo y componente que deberían contener `map` y `key`.
- Comprobar los seis medios y el arreglo vacío después de la extracción.

### Checkpoint previo al taller

Antes del descanso, `App` pasa el fixture a `MediaGrid`; `MediaGrid` recorre los seis elementos y coloca `media.id` como key. Los fallbacks de poster y descripción, junto con la etiqueta inline, siguen funcionando. Pasar `[]` no produce errores, pero todavía no muestra un mensaje.

El docente puede compartir `s01-c03-pre-taller-checkpoint` con ese estado exacto. No debe incluir `EmptyState`, `MediaTypeBadge` ni la solución del reto adicional.

## Descanso · 30 minutos

No se introduce contenido durante el descanso.

## Después del descanso · Taller de 60 minutos

### Encargo

Completar la composición de “Catálogo de la semana”. El punto de partida ya contiene `MediaGrid` funcional con los seis medios. El taller añade una respuesta visual para la colección vacía y separa la etiqueta de tipo sin alterar el fixture.

### Trabajo obligatorio

1. Crear `EmptyState` con props `title` y `description`.
2. Hacer que `MediaGrid` devuelva `EmptyState` cuando `items.length === 0`.
3. Extraer `MediaTypeBadge` con una prop `mediaType: MediaType`.
4. Reemplazar la etiqueta inline de `MediaCard` por `MediaTypeBadge`.
5. Mantener `map` y `media.id` como key dentro de `MediaGrid`.
6. Conectar los componentes con las clases CSS provistas para grid, badge y estado vacío.
7. Probar fixture completo, arreglo vacío, poster nulo, descripción nula, película y serie.
8. Mantener TypeScript y `pnpm build` sin errores.

### Reto adicional

Mostrar el total mediante `items.length` cuando la colección contenga elementos. El total se calcula durante el render y no se guarda en estado.

### Restricciones

- No usar `useState`.
- No agregar inputs o botones.
- No usar `useEffect`, Zustand o almacenamiento local.
- No instalar librerías nuevas.
- No importar el fixture dentro de `MediaGrid`.
- No mover la key al interior de `MediaCard`.
- No usar `children` en `EmptyState`.
- No cambiar la forma de `MediaItem` ni los datos del fixture para evitar un caso.

## Actividades del docente durante el taller

- Revisar primero el flujo de props, luego los condicionales y al final los estilos.
- Pedir al estudiante que nombre el componente que posee `items` antes de señalar dónde escribir el `if`.
- Pedir que siga `mediaType` desde `MediaCard` hasta `MediaTypeBadge` cuando aparezca un error de tipos.
- Recordar el checkpoint alternativo a quien no completó el bloque previo.
- Hacer una pausa breve si varias personas colocan la key dentro de `MediaCard` o importan el fixture desde el grid.

## Actividades de los estudiantes durante el taller

- Trabajar primero en la versión obligatoria.
- Ejecutar cada caso de prueba después de integrar un componente.
- Comparar el árbol de componentes con un compañero antes de entregar.
- Explicar a su compañero por qué `EmptyState` no recibe `items`.
- Intentar el reto solo después de cumplir los ocho puntos obligatorios.

## Revisión · 15 minutos

- Dos estudiantes muestran su árbol y siguen una prop de extremo a extremo.
- El docente ejecuta los seis casos: colección completa, vacía, poster nulo, descripción nula, película y serie.
- El grupo responde las cuatro preguntas del cierre conceptual.
- El docente conecta el catálogo estático con la búsqueda local de la clase 04.

## Criterios de aceptación

- `App` entrega la colección a `MediaGrid` mediante la prop `items`.
- `MediaGrid` acepta el arreglo mediante props.
- `MediaGrid` contiene un solo `map` y cada `<MediaCard />` devuelta directamente usa `media.id` como key.
- `EmptyState` aparece con título y descripción cuando `items` está vacío.
- `MediaCard` delega la etiqueta a `MediaTypeBadge`.
- Películas y series presentan textos distintos.
- El fallback del poster continúa funcionando.
- El fallback de descripción continúa funcionando.
- El fixture completo muestra seis medios sin duplicar JSX.
- El proyecto no usa estado y `pnpm build` termina sin errores.

## Evidencia de salida

- Captura del catálogo con seis medios.
- Captura del estado vacío.
- Árbol de componentes escrito en texto o dibujado.
- Explicación breve de quién posee `items`, `map`, `key` y la decisión del estado vacío.

## Entrega

El estudiante entrega el enlace del repositorio o un archivo comprimido, las dos capturas y el árbol. El reto adicional se identifica por separado y no reemplaza ningún criterio obligatorio.

## Fuera del alcance

- Inputs, botones y eventos.
- `useState` y estado derivado interactivo.
- Filtros, búsqueda y estado sin resultados.
- `children` y componentes contenedores genéricos.
- Mantine, API y persistencia.

La clase 04 parte del catálogo completo y añade la primera interacción: un input controlado que filtra por título sin modificar el fixture.

## Vocabulario

- **Seed:** proyecto inicial preparado para que todo el grupo parta del mismo checkpoint.
- **Checkpoint:** estado verificable que puede usarse como cierre o nuevo punto de partida.
- **Composición:** construcción de una interfaz combinando componentes con responsabilidades distintas.
- **Contrato de props:** nombre y tipo de los valores que un componente espera recibir.
- **Límite de componente:** decisión sobre qué responsabilidad queda dentro de un componente y cuál pertenece a otro.
- **Retorno temprano:** salida de una función antes del retorno principal cuando se cumple una condición.
- **Estado vacío:** interfaz que explica que la fuente de una colección no contiene elementos.
- **Valor derivado:** valor calculado desde datos disponibles, como `items.length`, sin almacenamiento adicional.

## Referencia docente

- [Pensar en React](https://react.dev/learn/thinking-in-react)
- [Renderizar listas](https://react.dev/learn/rendering-lists)
- [Renderizado condicional](https://react.dev/learn/conditional-rendering)
- [Entender la interfaz como un árbol](https://react.dev/learn/understanding-your-ui-as-a-tree)
