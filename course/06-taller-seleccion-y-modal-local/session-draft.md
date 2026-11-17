# Sesión 06 · Taller de selección y modal local

> Estado: paquete textual y presentación HTML aprobados. Proyecto progresivo implementado hasta session-06-end; PDF bajo demanda.

- **Fecha:** sábado 3 de octubre de 2026
- **Semana:** 2
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Control de lectura:** [reading-check.md](reading-check.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Taller y rúbrica:** [workshop-rubric.md](workshop-rubric.md)
- **Seed propuesto:** `session-06-start`
- **Checkpoint alternativo previo al taller:** `session-06-workshop-start`

## Punto de entrada

El seed parte del checkpoint canónico de la sesión 05:

- `App` conserva `query` y `mediaTypeFilter` como estado local.
- `SearchInput` y `MediaTypeFilter` son componentes controlados.
- `normalizedQuery`, `visibleMedia`, `hasActiveFilters`, `hasNoResults` y `resultCount` se calculan durante el render.
- `MediaGrid` recibe `items={visibleMedia}`.
- La interfaz muestra contador, limpieza y vacíos según su causa.
- El tipo canónico vive en `src/types/media-item.ts`.
- El fixture contiene seis medios, tres películas, tres series y una descripción nula.

El docente añade al seed `MediaDetailContent`, un componente presentacional que recibe `media: MediaItem` y muestra poster, tipo, fecha y descripción o el fallback “Sin descripción disponible”. No contiene estado, modal, fetching ni callback.

El seed no instala Mantine y no contiene selección. La apertura comprueba el filtro, el contador y la limpieza, pero no reconstruye la sesión anterior.

## Limitación visible

La aplicación decide qué tarjetas mostrar, pero ninguna tarjeta permite consultar su detalle. El modal necesita responder una pregunta que un booleano no resuelve:

```text
¿qué medio eligió la persona?
```

La clase conserva una identidad mínima, deriva el objeto y pasa una función desde el propietario del estado hasta el componente que origina la acción.

## Checkpoint de salida

Al terminar:

- El proyecto usa `@mantine/core@9.4.1` y `@mantine/hooks@9.4.1`.
- PostCSS queda configurado con las versiones fijadas para el seed.
- `main.tsx` importa los estilos de Mantine y renderiza `App` dentro de `MantineProvider` y `StrictMode`.
- `App` declara `selectedMediaId: number | null` con valor inicial `null`.
- `selectedMedia` se calcula con `find` desde el fixture completo `mediaItems`.
- `isDetailOpened` se calcula mediante `selectedMedia !== null`.
- `App` define `handleSelectMedia(mediaId: number)` y `handleCloseDetail()`.
- `MediaGrid` conserva la prop `items: MediaItem[]` y añade `onSelect: (mediaId: number) => void`.
- `MediaGrid` reenvía la misma referencia a cada `MediaCard`.
- `MediaCard` recibe la misma firma y ejecuta `onSelect(data.id)` dentro de un handler de click.
- Cada tarjeta incluye un botón “Ver detalle” con `type="button"`.
- `Modal` recibe `opened`, `onClose`, título y contenido desde `App`.
- El control de cierre tiene un nombre accesible en español.
- Cerrar por botón, Escape u overlay asigna `selectedMediaId` a `null`.
- Cambiar de película a serie reemplaza el contenido anterior.
- Una descripción nula muestra “Sin descripción disponible”.
- El disparador temporal “Probar detalle” y `previewMedia` ya no existen.
- Los filtros, contador, limpieza y mensajes de la sesión 05 siguen funcionando.
- No se guardan el objeto seleccionado ni otro booleano de apertura.
- El código no usa Zustand, Context API, `useEffect`, `useMemo`, `useDisclosure`, API, Router ni persistencia.
- En el seed ejecutable, `pnpm build` termina con código de salida 0.

El build comprueba tipos y generación. En la referencia de esta iteración también se verificaron en navegador cierre, contenido, foco, filtros y callbacks; cada entrega estudiantil necesita su propia comprobación.

## Resultado de aprendizaje

El estudiante conservará una selección mediante su identidad, ubicará ese estado en el ancestro común y seguirá una función desde su definición en `App` hasta su ejecución en `MediaCard`.

## Concepto principal

```text
App define handleSelectMedia
→ App entrega la referencia a MediaGrid
→ MediaGrid reenvía la misma referencia
→ MediaCard crea un handler con acceso a data.id
→ el click ejecuta onSelect(data.id)
→ handleSelectMedia actualiza selectedMediaId
→ React renderiza App
→ find calcula selectedMedia
→ Modal recibe opened={true}
```

La función no sube desde la tarjeta. `App` la crea y pasa su referencia mediante props. La tarjeta ejecuta esa función con la identidad que conoce.

## Vocabulario

- **Selección:** identidad que representa el elemento elegido por la persona.
- **Identidad mínima:** dato suficiente para localizar una entidad sin copiar el objeto completo.
- **Ancestro común:** componente más cercano que contiene las ramas que producen y consumen un estado.
- **Callback:** función que otro componente puede ejecutar para comunicar una acción.
- **Referencia de función:** valor que permite pasar una función sin ejecutarla todavía.
- **Firma de función:** tipos de sus parámetros y del valor que devuelve.
- **Closure:** función que conserva acceso a valores del lugar donde fue creada; el handler conserva `data.id`.
- **Prop drilling:** paso explícito de props a través de componentes intermedios.
- **Modal controlado:** diálogo cuya apertura y cierre dependen de props administradas por otro componente.
- **Provider:** componente que suministra configuración o contexto de una librería a un subárbol.
- **Foco:** elemento que recibe la interacción del teclado en un momento concreto.
- **Nombre accesible:** texto que las tecnologías de asistencia usan para identificar un control.

## Estado inicial, transformación y estado final

### Estado 1 · El catálogo filtra, pero no selecciona

`App` termina la sesión 05 con:

```tsx
<MediaGrid items={visibleMedia} />
```

`MediaGrid` recorre los items y cada `MediaCard` solo presenta información. La clase comprueba búsqueda, tipo, limpieza y ambos mensajes vacíos.

### Estado 2 · Configurar Mantine antes de usar el modal

Mantine entra aquí para resolver el diálogo: presentación, foco y solicitudes de cierre. React decide qué medio está seleccionado y si el modal está abierto. El catálogo conserva su HTML, CSS y componentes propios; composición, clases y semántica siguen siendo necesarias. En 07 se mantiene esta base y en 08 se usan más componentes de Mantine al construir la búsqueda remota.

El grupo instala versiones fijadas:

```bash
pnpm add --save-exact @mantine/core@9.4.1 @mantine/hooks@9.4.1
pnpm add --save-exact -D postcss@8.5.26 postcss-preset-mantine@1.18.0 postcss-simple-vars@7.0.1
```

Crea `postcss.config.cjs`, importa `@mantine/core/styles.css` y coloca `MantineProvider` en la raíz. La clase no configura theme ni explica Context API.

El primer `pnpm build` separa problemas de instalación de los cambios posteriores de selección.

### Estado 3 · Guardar id y calcular objeto

`App` añade:

```tsx
const [selectedMediaId, setSelectedMediaId] =
  useState<number | null>(null)

const selectedMedia =
  mediaItems.find((media) => media.id === selectedMediaId) ?? null

const isDetailOpened = selectedMedia !== null
```

`selectedMediaId` representa una decisión de la persona. El objeto y el booleano se obtienen durante el render.

Los handlers permanecen junto al estado:

```tsx
function handleSelectMedia(mediaId: number) {
  setSelectedMediaId(mediaId)
}

function handleCloseDetail() {
  setSelectedMediaId(null)
}
```

### Estado 4 · Comprobar la arquitectura con un disparador temporal

Antes de distribuir el callback, `App` usa temporalmente el primer medio disponible:

```tsx
const previewMedia = mediaItems[0] ?? null
```

El botón “Probar detalle” ejecuta `handleSelectMedia(previewMedia.id)`. El modal ya consume la selección real:

```tsx
<Modal
  opened={isDetailOpened}
  onClose={handleCloseDetail}
  title={selectedMedia?.title ?? "Detalle"}
  closeButtonProps={{ "aria-label": "Cerrar detalle" }}
  centered
>
  {selectedMedia !== null ? (
    <MediaDetailContent media={selectedMedia} />
  ) : null}
</Modal>
```

Este estado permite comprobar apertura, contenido y cierre sin entregar la solución del taller.

El docente explica que `closeButtonProps` aporta el nombre accesible “Cerrar detalle”. El reto opcional reutilizará el mismo concepto en los botones repetidos de las tarjetas.

### Estado 5 · Estudiar el contrato antes del descanso

Las tres capas usan la misma firma:

```ts
(mediaId: number) => void
```

`App` pasa una referencia:

```tsx
<MediaGrid
  items={visibleMedia}
  onSelect={handleSelectMedia}
/>
```

`MediaGrid` la reenvía sin adaptarla:

```tsx
<MediaCard
  key={media.id}
  data={media}
  onSelect={onSelect}
/>
```

`MediaCard` conoce el id y crea el handler:

```tsx
<button
  type="button"
  onClick={() => onSelect(data.id)}
>
  Ver detalle
</button>
```

La clase contrasta ese código con `onClick={onSelect(data.id)}`, que intentaría ejecutar la función durante el render.

### Estado 6 · El taller conecta todas las tarjetas

Después del descanso, el estudiante:

1. Añade la prop en `MediaGrid`.
2. Añade la prop en `MediaCard`.
3. Reenvía la referencia.
4. Ejecuta el callback dentro del click.
5. Conecta `handleSelectMedia` desde `App`.
6. Retira `previewMedia` y “Probar detalle”.
7. Ejecuta la matriz completa.

No aparece un concepto nuevo después del descanso; el taller aplica contratos y flujo ya explicados.

## Secuencia de 180 minutos

### Antes del descanso · 75 minutos

| Minutos | Duración | Actividad | Evidencia observable |
| --- | ---: | --- | --- |
| 0–12 | 12 min | Recuperar checkpoint 05 y revisar el cuestionario | Filtros, contador, limpieza y vacíos funcionan. |
| 12–24 | 12 min | Presentación continua: identidad, ancestro común, Modal y callbacks | El grupo ubica selección en `App` y dibuja el flujo. |
| 24–38 | 14 min | Instalar y configurar Mantine | Provider, estilos y primer build quedan comprobados. |
| 38–51 | 13 min | Crear selección y cálculos con diagnóstico y botones temporales | Seleccionar/limpiar tiene un resultado visible antes de Modal. |
| 51–64 | 13 min | Conectar modal con disparador temporal | El primer medio abre y cierra correctamente. |
| 64–75 | 11 min | Recorrer firmas y presentar el taller | Las tres capas comparten contrato; tarjetas aún no seleccionan. |

**Subtotal antes del descanso:** 75 minutos.

### Descanso · 30 minutos

### Taller calificable · 60 minutos

| Minutos | Duración | Actividad | Evidencia observable |
| --- | ---: | --- | --- |
| 0–12 | 12 min | Declarar contrato de Card, reenviar en Grid y conectar App | Los tres archivos compilan; Card aún no ejecuta. |
| 12–27 | 15 min | Añadir prop y botón en `MediaCard` | Cada tarjeta ejecuta su propio id dentro del click. |
| 27–37 | 10 min | Retirar el disparador temporal y resolver contratos | No quedan `previewMedia` ni “Probar detalle”. |
| 37–47 | 10 min | Probar contenido y mecanismos de cierre | Película, serie, null y cierre producen el estado esperado. |
| 47–55 | 8 min | Regresión y React DevTools | El estudiante ubica estado y props sin romper filtros. |
| 55–60 | 5 min | Build y evidencia | Se registra salida del comando y matriz manual. |

**Subtotal del taller:** 60 minutos.

### Revisión y cierre · 15 minutos

| Minutos | Duración | Actividad | Evidencia observable |
| --- | ---: | --- | --- |
| 0–9 | 9 min | Demostraciones de estudiantes y casos pendientes | Dos recorridos completos se muestran al grupo. |
| 9–15 | 6 min | Reconstruir el flujo y abrir la sesión 07 | El grupo explica callbacks y limita la evidencia. |

**Total:** 75 + 30 + 60 + 15 = 180 minutos.

## Checkpoint alternativo previo al taller

`session-06-workshop-start` incluye:

- Todo el checkpoint de la sesión 05.
- Mantine, PostCSS, estilos y provider configurados.
- `MediaDetailContent` preparado.
- `selectedMediaId`, `selectedMedia` e `isDetailOpened` en `App`.
- Handlers de selección y cierre.
- Modal funcional desde “Probar detalle”.
- Build comprobado por el docente.

Omite:

- `onSelect` en `MediaGrid` y `MediaCard`.
- Botones “Ver detalle” en las tarjetas.
- Conexión del handler desde `App` hasta cada tarjeta.
- Solución del taller.

## Taller

El encargo consiste en llevar el origen de la acción desde el botón temporal de `App` hasta cada tarjeta sin mover el estado.

### Trabajo obligatorio

1. Conservar la firma `(mediaId: number) => void` en las tres capas.
2. Pasar `handleSelectMedia` desde `App`.
3. Reenviar `onSelect` desde `MediaGrid`.
4. Ejecutar `onSelect(data.id)` desde `MediaCard`.
5. Retirar el disparador temporal.
6. Comprobar contenido, cambio de identidad y cierre.
7. Ejecutar la regresión de filtros.
8. Ejecutar `pnpm build`.
9. Explicar el flujo y la frontera de evidencia.

### Reto opcional

Añadir a cada botón un nombre accesible específico:

```tsx
aria-label={`Ver detalle de ${data.title}`}
```

El estudiante debe comprobar ese nombre en el árbol de accesibilidad. El reto no reemplaza un requisito base ni añade estado.

## Matriz de aceptación

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Regresión | Buscar y elegir tipo | La sesión 05 permanece funcional. |
| Película | Abrir una película | El modal presenta esa película. |
| Serie | Cerrar y abrir una serie | El contenido cambia sin conservar el anterior. |
| Descripción nula | Abrir la entrada preparada | Aparece “Sin descripción disponible”. |
| Cierre superior | Pulsar el control de cierre | `selectedMediaId` vuelve a `null`. |
| Escape | Pulsar Escape | El modal cierra y devuelve el foco. |
| Overlay | Pulsar fuera del contenido | El modal cierra. |
| Flujo | Revisar React DevTools | Estado en `App`; props en Grid y Card. |
| Build | Ejecutar `pnpm build` | TypeScript y Vite terminan sin errores. |

## Guion de presentación futura

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Filtros completos | Dos estados y cinco cálculos permanecen intactos. | Mapa del checkpoint 05. |
| Problema | ¿Qué medio está abierto? | Un booleano no identifica la selección. | Comparar “abierto” con “qué medio”. |
| Estado | Guardar id | `selectedMediaId` evita duplicar el objeto. | Id y objeto lado a lado. |
| Cálculo | Recuperar con find | El objeto se deriva desde la fuente completa. | Snippet corto y flecha. |
| Arquitectura | Ancestro común | `App` contiene tarjetas y modal. | Árbol de componentes. |
| Flujo | La referencia baja | `App` define; hijos reciben y ejecutan. | Flechas con nombres de props. |
| Firma | Un contrato común | Tres capas usan `(number) => void`. | Tabla de archivos. |
| Distinción | Pasar o ejecutar | Referencia, closure y ejecución durante render. | Tres snippets comparados. |
| Librería | React decide, Mantine presenta | 06 incorpora el modal; 07 conserva HTML/CSS; 08 amplía el toolkit. React posee selección; Mantine presenta diálogo y foco. | Comparar responsabilidades sin reescribir el catálogo. |
| Arquitectura | Estado local suficiente | El ancestro común está cerca; Zustand no resuelve una necesidad actual. | Árbol actual. |
| Futuro | Modal global | La sesión 11 tendrá dos páginas que abren la misma creación. | Árbol futuro sin código de store. |
| Puente | Taller | Modal funciona desde trigger temporal; faltan las tarjetas. | No mostrar la solución completa. |

El cierre recupera entre dos y cuatro preguntas:

1. ¿Dónde se origina `handleSelectMedia` y por qué?
2. ¿Qué ocurre desde el click hasta que el modal recibe `opened={true}`?
3. ¿Por qué guardar el objeto introduciría duplicación?
4. ¿Qué limitación del fixture abre la frontera HTTP de la sesión 07?

## Rúbrica prevista

La tabla única de [workshop-rubric.md](workshop-rubric.md) usa:

- 25 puntos para contratos y recorrido de `onSelect`.
- 20 puntos para identidad mínima y cálculos derivados.
- 25 puntos para modal, contenido y cierre.
- 15 puntos para regresión y restricciones.
- 15 puntos para evidencia y explicación.
- 10 puntos extra opcionales para nombre accesible específico y su comprobación.

La base suma 100, el bruto puede llegar a 110 y la nota institucional se limita a 100.

## Plan de contingencia

- **Falla la instalación:** entregar `session-06-workshop-start` y conservar la explicación de provider, versiones y evidencia. El taller no se cancela.
- **Falla el build inicial:** registrar el error exacto y revisar imports, versiones y provider antes de añadir selección.
- **Faltan 15 minutos antes del descanso:** entregar el modal conectado y usar el tiempo restante para recorrer las tres firmas; no mover esa explicación después del descanso.
- **Un estudiante no llega al checkpoint previo:** compartir el checkpoint alternativo sin `onSelect` en tarjetas.
- **Falla el build final:** evaluar por separado contratos, estado, comportamiento que todavía pueda mostrarse y explicación. No asignar cero automático a toda la entrega.

## Fuera de alcance

- Agentes o generación asistida.
- Zustand, API de stores y selectors.
- Context API como contenido docente.
- HTTP, DTO, `fetch` y respuestas remotas.
- TanStack Query.
- Identidad pública `mediaType + externalId`.
- React Router y URL de detalle.
- `useEffect`, `useMemo` y `useDisclosure`.
- Formularios dentro del modal.
- Persistencia local.
- Pruebas automatizadas.

## Continuidad con la sesión 07

La sesión 07 recibe el explorador local con filtros, selección y modal. Mantiene esa interfaz mientras crea types, adapters y fetchers fuera de los componentes. No copia respuestas remotas a estado local.

Durante su migración deberá conservar `src/types/media-item.ts`; la fuente histórica todavía usa `src/types/media.ts` en algunos árboles y snippets.

## Decisiones aprobadas

- Usar un disparador temporal antes del descanso para aislar configuración, estado y modal.
- Reservar la propagación completa de `onSelect` para el taller.
- Guardar `selectedMediaId`, no el objeto seleccionado.
- Buscar en `mediaItems`, no en `visibleMedia`.
- Mantener una firma común en las tres capas.
- Usar estado local porque `App` es el ancestro común cercano.
- Reservar Zustand para el modal global de creación de la sesión 11.
- Fijar versiones de Mantine y PostCSS para un seed reproducible.

No surge una regla nueva. Estas decisiones ya están cubiertas por las reglas de arquitectura, estado mínimo, talleres y compatibilidad de herramientas.

## Fuentes docentes

- React, [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure), sección `Avoid duplication in state`.
- React, [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components), secciones `Lifting state up by example` y `A single source of truth for each state`.
- Mantine, [Usage with Vite](https://mantine.dev/guides/vite/).
- Mantine, [Modal](https://mantine.dev/core/modal/), secciones `Control behavior` y `Accessibility`.

Fuentes verificadas el 30 de agosto de 2026. Context7 y el índice Mintlify no estuvieron disponibles en el entorno; se consultaron las fuentes oficiales y el registro de paquetes como respaldo.

## Ruta ejecutable y presentación continua

`session-06-start` → `session-06-step-01-mantine` → `session-06-step-02-selection` → `session-06-step-03-modal-preview` = `session-06-workshop-start` → `session-06-step-04-callback-contracts` → `session-06-step-05-card-selection` → `session-06-end`.

La entrada añade detalle visual y CSS a 05-end. Toda instrucción de edición y soporte figura después de la presentación continua en la guía docente. Slides 1–23 en una pasada; separador 24 como referencia y 25 para cierre oral, sin volver al deck. Los 12 minutos conceptuales requieren ensayo y registro del desfase real; no prueban ritmo de aula.

La etapa de selección usa un diagnóstico de título/apertura y Limpiar selección; ambos se retiran al montar Modal. El trigger Probar detalle se retira después de conectar las tarjetas. MantineProvider conserva defaultColorScheme dark como apariencia inicial sin theme personalizado. La solución opcional de aria-label no forma parte de session-06-end.
