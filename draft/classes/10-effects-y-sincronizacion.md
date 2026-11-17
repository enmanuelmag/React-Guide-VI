# Clase 10 · Effects y sincronización

- **Semana:** 4
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** catálogo público de la clase 09, con `selectedDetailInput`, query dependiente, `detailModel` y modal controlado
- **Checkpoint de salida:** el título de la pestaña acompaña al detalle abierto, se restaura al cerrarlo y el estudiante distingue un Effect legítimo de estado derivado o lógica de eventos

## Resultado de aprendizaje

Al terminar, el estudiante podrá explicar que un Effect sincroniza React con un sistema externo, implementar una relación simétrica entre setup y cleanup, justificar sus dependencias y retirar Effects que solo duplican valores calculables o responden a una interacción conocida.

## Limitación que abre la clase

El checkpoint 09 ya coordina selección, consulta remota y modal sin `useEffect`:

```text
clic en “Ver detalle”
→ handleSelectMedia actualiza selectedDetailInput
→ useMediaDetail observa una key habilitada
→ TanStack Query obtiene o reutiliza el DTO
→ App deriva detailModel
→ Modal representa el detalle
```

El contenido visible es correcto, pero la pestaña del navegador continúa llamándose `Medialog` aunque el usuario esté consultando un título concreto. React no controla `document.title` mediante JSX. La clase incorporará esa sincronización sin mudar a Effects las responsabilidades que ya pertenecen a handlers, cálculos puros o TanStack Query.

El cambio observable será:

```text
sin detalle abierto     → Medialog
Dune abierto            → Dune | Medialog
otro detalle abierto    → Severance | Medialog
detalle cerrado         → Medialog
```

## Conceptos

- Render como cálculo puro de JSX.
- Commit como aplicación de cambios en la interfaz.
- Evento frente a Effect.
- Sistema externo.
- Setup y cleanup.
- Dependencias reactivas.
- Montaje, actualización y desmontaje.
- Igualdad de dependencias mediante `Object.is`.
- Responsabilidad de un componente sin salida visual.
- Comprobaciones adicionales de Strict Mode en desarrollo.
- Diferencia entre servidor de desarrollo y build de producción.
- Estado derivado y fuentes de verdad duplicadas.

## Regla de decisión de la clase

Antes de escribir `useEffect`, el grupo responderá estas preguntas en orden:

1. ¿Qué sistema externo a React necesita mantenerse sincronizado?
2. ¿Qué valor reactivo describe la sincronización actual?
3. ¿Qué debe deshacer el cleanup antes de sincronizar otro valor o desmontar?
4. ¿La misma tarea podría resolverse durante el render o dentro del evento que ya conocemos?

Si no se puede nombrar un sistema externo, el Effect probablemente no corresponde.

## Guion de presentación

### Propósito y duración

El deck aparece durante 30 minutos al inicio y 8 minutos al cierre. Los primeros 10 recuperan el flujo de la clase 09 y clasifican responsabilidades existentes. Los siguientes 20 presentan render, commit, eventos, Effects, dependencias, cleanup y el papel de Strict Mode. El bloque final reconstruye el experimento y formula una regla de decisión.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | El modal ya funciona sin Effects | Reconstruir `onSelect → selectedDetailInput → useMediaDetail → detailModel → Modal`. Seleccionar y cerrar son eventos conocidos; la respuesta remota sigue perteneciendo a Query Client. | Diagrama del flujo de la clase 09. Pedir que señalen dónde vive cada responsabilidad. |
| Problema | La pantalla cambió, la pestaña no | Abrir un detalle modifica el contenido React, pero `document.title` conserva el nombre general. La pestaña pertenece al documento del navegador y no se expresa mediante el JSX de `App`. | Comparación visual de dos pestañas: `Medialog` y `Dune | Medialog`. |
| Distinción | Render calcula; commit aplica | El cuerpo del componente debe calcular JSX y valores derivados sin modificar sistemas externos. React realiza el commit y después ejecuta los Effects correspondientes. | Línea de tiempo `render → commit → Effect`. No presentar fases internas adicionales. |
| Distinción | Evento y Effect responden a causas diferentes | Un handler existe porque ocurrió una interacción concreta. Un Effect existe porque un componente quedó renderizado y necesita sincronizarse con algo externo. | Dos columnas: “el usuario hizo clic” y “este título está presente”. |
| Concepto | Un Effect mantiene una sincronización | El setup aplica la sincronización actual. El cleanup deshace la anterior antes de otra sincronización y cuando el componente deja de existir. | Diagrama `setup(A) → cleanup(A) → setup(B) → cleanup(B)`. |
| Caso real | `document.title` está fuera de React | `MediaDocumentTitle` recibe un string, sincroniza el título del documento y no produce interfaz propia. Su responsabilidad es externa y acotada. | Snippet breve de la firma y `return null`; no revelar todavía el Effect completo. |
| Dependencias | La lista se deriva del código | Cada prop, estado o variable reactiva leída dentro del Effect debe aparecer como dependencia. No se omite una dependencia para impedir una ejecución incómoda. | Resaltar `title` dentro del setup y `[title]` al final. |
| Contraste | Un objeto nuevo no equivale al mismo objeto | React compara dependencias con `Object.is`. Dos strings iguales se consideran iguales; dos objetos recién creados no comparten identidad aunque contengan los mismos campos. | Comparar `["Dune"]` con `["Dune"]` y `{ title: "Dune" }` con otro objeto equivalente. |
| Auditoría | Strict Mode no duplica cualquier cosa | En desarrollo, React vuelve a ejecutar funciones que deberían ser puras y añade un ciclo de setup y cleanup para detectar errores. Los event handlers no se ejecutan dos veces por esta comprobación. | Secuencia de consola `setup → cleanup → setup`. Evitar la frase imprecisa “React hace todo dos veces”. |
| Entornos | La auditoría no forma parte de producción | `pnpm dev` permite observar las comprobaciones adicionales. `pnpm build` y `pnpm preview` sirven para comprobar el artefacto de producción, donde ese ciclo adicional de Strict Mode no se ejecuta. | Tabla desarrollo/producción. Aclarar que el producto conserva el Effect; desaparece la comprobación adicional. |
| Contraejemplo | Derivar no es sincronizar | Una lista filtrada se calcula a partir de datos existentes. Guardarla con `setVisibleMedia` dentro de un Effect crea un render adicional y una segunda fuente de verdad. | Antes/después: `useState + useEffect` frente a `filterMedia(...)` durante render. |
| Puente | Una necesidad pública sigue pendiente | La pestaña acompaña al detalle, pero el modal todavía no produce una URL compartible, recargable ni navegable con atrás y adelante. | Mostrar `/search` sin identidad y anticipar React Router para la clase 11. |

### Indicaciones que deben sobrevivir a la producción de slides

- `useEffect` no significa “código que ocurre después”. Su propósito es sincronizar un componente con un sistema externo.
- El render debe permanecer puro. Leer props, transformar arreglos y construir JSX son cálculos; modificar `document.title` durante el render sería un side effect.
- El commit es el momento en que React aplica al DOM el resultado elegido. Para el nivel de esta clase basta la secuencia conceptual `render → commit → Effect`.
- Los event handlers se ejecutan por una interacción determinada. Los Effects se ejecutan porque el componente se renderizó y la sincronización debe reflejar ese resultado.
- `handleSelectMedia` conserva la selección y `handleCloseDetail` la elimina. Ninguno se reemplaza por un Effect.
- `useMediaDetail` y TanStack Query continúan administrando consulta, error, datos y caché. La clase no enseña fetching con Effects.
- `document.title` pertenece a una API del navegador. Esa frontera concreta justifica el Effect.
- Setup y cleanup forman un proceso simétrico: si el setup reemplaza el título anterior, el cleanup lo restaura.
- React ejecuta cleanup con los valores de la sincronización anterior antes de aplicar el setup de la nueva.
- El cleanup también se ejecuta cuando el componente se desmonta.
- Las dependencias no describen “cuándo quiero que se ejecute” el Effect. Describen los valores reactivos que su código utiliza.
- El linter no debe silenciarse para ocultar dependencias. Si una dependencia causa ejecuciones excesivas, se revisa la estructura y la identidad de los valores.
- `MediaDocumentTitle` recibe `title: string`, no `MediaDetailModel`. El Effect necesita un valor primitivo y estable, no todo el objeto creado por el adaptador.
- `MediaDocumentTitle` devuelve `null` porque coordina un sistema externo y no agrega nodos propios. Continúa siendo un componente con una responsabilidad definida.
- El componente se renderiza solamente cuando `detailModel !== null`. Así su montaje coincide con un detalle disponible y su desmontaje con el cierre o ausencia de contenido.
- Strict Mode no se elimina para “evitar duplicados”. La secuencia adicional revela una limpieza faltante o asimétrica.
- En desarrollo, Strict Mode puede volver a ejecutar el cuerpo del componente, Effects y callbacks de refs bajo reglas diferentes. No debe resumirse como “todo se renderiza dos veces”.
- Los handlers de clic no se disparan dos veces por Strict Mode.
- Las comprobaciones adicionales son exclusivas del desarrollo y no afectan el build de producción.
- `pnpm preview` sirve para revisar localmente el build ya generado. No reemplaza una prueba real de despliegue.
- Una lista filtrada, un contador y un modelo adaptado son valores derivados. Se calculan durante el render y no necesitan Effect ni estado adicional.
- Un cambio de `key` puede reiniciar deliberadamente un subárbol, pero se menciona como herramienta de identidad; no se convierte en la solución principal de esta clase.
- Cerrar un formulario conocido puede ejecutar `form.reset()` desde `onClose`. No se enseña un Effect para reaccionar a un evento que el handler ya conoce.
- No se extrae un custom hook en esta clase. Primero debe quedar visible el ciclo completo de setup, dependencia y cleanup.
- `useLayoutEffect`, `useEffectEvent`, timers, listeners, sockets y suscripciones Firebase quedan fuera del checkpoint. Firebase ofrecerá más adelante un segundo caso real de suscripción externa.

### Cierre conceptual

El cierre recupera cuatro preguntas:

1. ¿Qué sistema externo sincroniza `MediaDocumentTitle` y por qué no debe modificarse durante el render?
2. ¿Qué sucede con el cleanup cuando se cambia de una película a una serie y cuando se cierra el detalle?
3. ¿Por qué el Effect depende de `title` y no de todo `detailModel`?
4. ¿Por qué filtrar resultados o ejecutar `handleCloseDetail` no requiere un Effect?

La última conexión nombra la limitación que abre la clase 11: el detalle todavía depende de memoria local y no puede reconstruirse desde una URL.

## Flujo del código

### Estado 1 · Confirmar que el checkpoint 09 no necesita Effects

Antes de importar `useEffect`, el docente recorre el código existente:

```tsx
const [selectedDetailInput, setSelectedDetailInput] =
  useState<GetMediaDetailInput | null>(null)

const detailQuery = useMediaDetail(selectedDetailInput)
const detailModel = detailQuery.data?.catalog
  ? toMediaDetailModel(detailQuery.data.catalog)
  : null

function handleSelectMedia(input: GetMediaDetailInput) {
  setSelectedDetailInput(input)
}

function handleCloseDetail() {
  setSelectedDetailInput(null)
}
```

El grupo clasifica cada línea:

| Pieza | Responsabilidad | Por qué no usa Effect |
| --- | --- | --- |
| `handleSelectMedia` | Responder al clic conocido | El handler ya conoce el argumento y el momento de la interacción. |
| `useMediaDetail` | Observar estado remoto por key | TanStack Query administra ejecución y caché. |
| `detailModel` | Derivar un modelo visual | Puede calcularse durante el render a partir del DTO actual. |
| `handleCloseDetail` | Responder al cierre conocido | El callback de Mantine ya comunica el evento. |

Esta revisión evita presentar `useEffect` como una herramienta obligatoria para coordinar cualquier cambio de estado.

### Estado 2 · Crear un componente con una responsabilidad externa

El docente crea `src/components/media-document-title.tsx`:

```tsx
type MediaDocumentTitleProps = {
  title: string
}

export function MediaDocumentTitle({
  title,
}: MediaDocumentTitleProps) {
  return null
}
```

Aunque todavía no hace nada, su contrato ya expresa la responsabilidad: recibirá el título activo y no representará contenido visual. No recibe `MediaDetailModel`, el DTO ni setters de `App`.

El docente explica por qué el Effect no se escribe directamente en `App`: `App` ya está montado cuando todavía no existe selección. Montar `MediaDocumentTitle` junto con el detalle permite observar claramente la vida de esa sincronización y hace que el desmontaje restaure el documento.

### Estado 3 · Implementar una versión incompleta

Se importa `useEffect` y se construye primero el problema:

```tsx
import { useEffect } from "react"

type MediaDocumentTitleProps = {
  title: string
}

export function MediaDocumentTitle({
  title,
}: MediaDocumentTitleProps) {
  useEffect(() => {
    document.title = `${title} | Medialog`
  }, [title])

  return null
}
```

`App` lo monta solamente cuando existe el modelo:

```tsx
{detailModel !== null && (
  <MediaDocumentTitle title={detailModel.title} />
)}
```

El grupo prueba este recorrido:

1. Abrir un detalle y observar el título correcto.
2. Cerrar el modal.
3. Comprobar que la pestaña conserva el título del medio.

El primer éxito es incompleto: el sistema externo quedó desincronizado después de desmontar el componente.

### Estado 4 · Restaurar el estado anterior con cleanup

La solución conserva el título que existía al comenzar cada setup:

```tsx
import { useEffect } from "react"

type MediaDocumentTitleProps = {
  title: string
}

export function MediaDocumentTitle({
  title,
}: MediaDocumentTitleProps) {
  useEffect(() => {
    const previousTitle = document.title

    document.title = `${title} | Medialog`

    return () => {
      document.title = previousTitle
    }
  }, [title])

  return null
}
```

Ahora se reconstruyen tres transiciones:

```text
montaje con Dune
setup(Dune): guarda “Medialog” y escribe “Dune | Medialog”

cambio a Severance
cleanup(Dune): restaura “Medialog”
setup(Severance): guarda “Medialog” y escribe “Severance | Medialog”

desmontaje al cerrar
cleanup(Severance): restaura “Medialog”
```

El cleanup no necesita conocer `selectedDetailInput` ni llamar `handleCloseDetail`. Deshace únicamente lo que hizo su setup.

La interfaz actual permite comprobar directamente montaje y desmontaje: se abre `Dune`, se cierra y después se abre `Severance`. El cambio de una dependencia mientras la misma instancia permanece montada se explica con la secuencia intermedia; no se añade un control artificial al producto únicamente para provocar esa actualización.

### Estado 5 · Justificar la dependencia primitiva

El docente muestra una alternativa que debe evitarse:

```tsx
type MediaDocumentTitleProps = {
  media: MediaDetailModel
}

useEffect(() => {
  document.title = `${media.title} | Medialog`
}, [media])
```

El adaptador de detalle puede producir un objeto nuevo durante otro render. React compara dependencias con `Object.is`; una referencia nueva hace que `[media]` sea diferente aunque `media.title` no haya cambiado.

El contrato definitivo conserva solo el valor necesario:

```tsx
type MediaDocumentTitleProps = {
  title: string
}
```

La guía no presenta esto como una técnica para “engañar” al arreglo de dependencias. Cambia la API del componente para representar su responsabilidad real.

### Estado 6 · Observar Strict Mode en desarrollo

El docente agrega logs temporales:

```tsx
useEffect(() => {
  const previousTitle = document.title

  console.log("title setup", title)
  document.title = `${title} | Medialog`

  return () => {
    console.log("title cleanup", title)
    document.title = previousTitle
  }
}, [title])
```

Con `<StrictMode>` conservado en `src/main.tsx` y la aplicación ejecutada mediante `pnpm dev`, la primera aparición del componente permite observar:

```text
title setup Dune
title cleanup Dune
title setup Dune
```

La comprobación hace visible que el primer setup puede deshacerse correctamente antes de repetirse. El resultado final debe ser indistinguible de un único setup.

El docente señala dos límites:

- React puede volver a ejecutar el cuerpo de funciones que deberían ser puras, pero eso no equivale a volver a ejecutar un clic.
- Guardar el archivo durante desarrollo también puede producir limpiezas y ejecuciones asociadas a la recarga rápida. Para la observación se limpia la consola, se recarga la página y se realiza una sola selección.

Los logs se retiran antes del checkpoint.

### Estado 7 · Comparar con el build de producción

Después de retirar los logs definitivos, el docente puede volver a agregarlos temporalmente para la comparación y ejecuta:

```bash
pnpm build
pnpm preview
```

La aplicación de preview debe probarse en la URL que Vite reporte en la terminal; no se asume un puerto fijo. El grupo abre un detalle y contrasta:

| Evidencia | `pnpm dev` | `pnpm build` + `pnpm preview` |
| --- | --- | --- |
| Effect funcional | Cambia y restaura el título | Cambia y restaura el título |
| Ciclo adicional de Strict Mode | Observable en desarrollo | No forma parte del build |
| Propósito | Detectar problemas durante el trabajo | Comprobar el artefacto optimizado localmente |

No se elimina `<StrictMode>` para producir el build. React excluye sus comprobaciones adicionales del modo de producción.

Al terminar la comparación, el docente detiene el servidor de preview, vuelve a retirar los logs y ejecuta el build final.

### Estado 8 · Retirar un Effect innecesario

El docente presenta un fragmento aislado basado en los filtros de la semana 2:

```tsx
const [visibleMedia, setVisibleMedia] = useState<MediaItem[]>([])

useEffect(() => {
  setVisibleMedia(
    filterMedia(mediaItems, query, selectedMediaType),
  )
}, [mediaItems, query, selectedMediaType])
```

Los estudiantes identifican que no existe sistema externo. Además, el Effect produciría primero un render con el valor anterior y luego otro después de `setVisibleMedia`.

La solución elimina estado y Effect:

```tsx
const visibleMedia = filterMedia(
  mediaItems,
  query,
  selectedMediaType,
)
```

No se añade `useMemo` automáticamente. El fixture y el filtro no presentan un costo medido que justifique otra optimización.

### Estructura esperada del checkpoint

```text
src/
├── adapters/
│   ├── media-catalog-to-detail.ts
│   └── media-search-to-card.ts
├── api/
│   ├── http.ts
│   └── media.ts
├── components/
│   ├── media-detail-content.tsx
│   ├── media-document-title.tsx
│   └── media-search-results.tsx
├── hooks/
│   ├── features/
│   │   └── use-media.ts
│   └── media-keys.ts
├── types/
│   ├── media-api.ts
│   ├── media-detail.ts
│   ├── media-search-card.ts
│   └── media.ts
├── App.tsx
└── main.tsx
```

El único archivo estructural nuevo es `media-document-title.tsx`. No se crea una carpeta genérica de Effects ni un custom hook de un solo uso.

## Secuencia sugerida

| Tiempo | Responsable | Actividad y comprobación |
| --- | --- | --- |
| 0-10 min | Docente y grupo | Reconstruir el flujo de la clase 09 y clasificar selección, query, adaptación y cierre sin usar Effects. |
| 10-30 min | Docente con participación | Usar el deck para presentar render, commit, evento, sistema externo, setup, cleanup, dependencias y auditoría de Strict Mode. |
| 30-42 min | Construcción guiada | Crear `MediaDocumentTitle`, devolver `null` y conectarlo únicamente cuando `detailModel` exista. |
| 42-54 min | Docente y estudiantes | Implementar el Effect sin cleanup, abrir y cerrar el modal, y registrar el título residual como problema observable. |
| 54-68 min | Construcción interactiva | Capturar el título anterior, escribir cleanup y explicar montaje, cambio de dependencia y desmontaje. |
| 68-80 min | Práctica guiada | Comparar dependencia de objeto con dependencia de string y conservar la API mínima `title: string`. |
| 80-94 min | Docente y grupo | Añadir logs temporales, observar `setup → cleanup → setup` en `pnpm dev` y distinguir cuerpo, handler y Effect. |
| 94-104 min | Demostración docente | Ejecutar `pnpm build` y `pnpm preview`, repetir una selección y comprobar que el ciclo adicional no pertenece a producción. |
| 104-112 min | Actividad estudiantil | Refactorizar el filtro con Effect hacia un valor derivado y justificar la ausencia de sistema externo. |
| 112-120 min | Docente y grupo | Retirar logs, ejecutar el build final, volver al deck y responder las cuatro preguntas de cierre. |

La suma es de 120 minutos.

## Actividades del docente

- Recuperar el recorrido completo de selección antes de presentar el hook.
- Pedir que el grupo nombre un sistema externo antes de aceptar cualquier ejemplo de Effect.
- Crear primero el contrato de `MediaDocumentTitle` y explicar por qué devuelve `null`.
- Implementar deliberadamente el título sin cleanup y dejar que el cierre revele el defecto.
- Dibujar la simetría entre setup y cleanup con un título concreto.
- Abrir una película, cerrarla y abrir una serie; después narrar qué ocurriría si `title` cambiara mientras la misma instancia permanece montada.
- Comparar dependencia de objeto y de string sin silenciar el linter.
- Limpiar la consola antes del experimento de Strict Mode para no confundir Fast Refresh con el ciclo estudiado.
- Mantener `<StrictMode>` y diferenciar cuerpo del componente, Effect y event handler.
- Ejecutar desarrollo y preview como dos evidencias separadas.
- Presentar el filtro con Effect como diagnóstico; no introducir `useMemo` sin medición.
- Recordar que TanStack Query conserva fetching y caché fuera de esta clase.
- Retirar logs temporales y comprobar el build final.

## Actividades de los estudiantes

- Clasificar las piezas del checkpoint 09 como evento, estado local, estado remoto o valor derivado.
- Predecir qué título quedará después de cerrar la primera implementación.
- Completar la función de cleanup.
- Narrar la secuencia al cambiar de `Dune` a otro título.
- Justificar por qué `title` aparece en el arreglo de dependencias.
- Predecir qué ocurriría si el componente recibiera todo `detailModel` como dependencia.
- Registrar la secuencia de logs observada en desarrollo.
- Explicar por qué un clic no se duplica por la auditoría de Strict Mode.
- Contrastar los logs de desarrollo y preview.
- Eliminar el estado y el Effect del ejemplo de filtrado.
- Proponer un caso válido y uno inválido para `useEffect`.
- Completar la regla de decisión con sus propias palabras.

## Evidencia de salida

- Existe `MediaDocumentTitle` con una prop `title: string` y sin salida visual.
- El componente solo se monta cuando existe `detailModel`.
- El Effect modifica `document.title` después del commit.
- El cleanup restaura el título que existía antes del setup.
- Cambiar de medio limpia la sincronización anterior antes de aplicar la nueva.
- Cerrar el modal restaura `Medialog` sin añadir estado para el título.
- La dependencia es el string `title`, no todo el objeto `detailModel`.
- El linter no tiene dependencias omitidas ni comentarios para silenciarlo.
- Los logs temporales permiten observar el ciclo adicional en desarrollo y se retiran del checkpoint.
- La comprobación con preview conserva la funcionalidad sin el ciclo adicional de desarrollo.
- La búsqueda y el detalle continúan administrados por TanStack Query.
- Abrir y cerrar continúan siendo handlers; no existen Effects para responder a esos eventos.
- El ejemplo de lista filtrada termina como valor derivado, sin `useState` ni Effect.
- `<StrictMode>` permanece configurado.
- `pnpm build` termina sin errores.

## Errores frecuentes y respuesta docente

### “¿Strict Mode renderiza dos veces todos los componentes?”

En desarrollo vuelve a ejecutar ciertas funciones que deberían ser puras y realiza comprobaciones adicionales de Effects y callbacks de refs. Cada comprobación tiene un propósito concreto. No vuelve a ejecutar automáticamente los event handlers y no debe resumirse como “todo ocurre dos veces”.

### “¿Ese comportamiento también llega cuando compilamos?”

No. Las comprobaciones adicionales de Strict Mode solo ocurren en desarrollo. El Effect sigue formando parte de la aplicación de producción porque todavía debe sincronizar el título; lo que desaparece es el ciclo adicional de auditoría.

### “¿Por qué no quitamos Strict Mode para ver un solo log?”

Porque el log adicional está revelando si el cleanup deshace correctamente el setup. Quitar la auditoría ocultaría el problema en vez de corregirlo.

### “¿Por qué `MediaDocumentTitle` devuelve `null`?”

Su responsabilidad no es producir nodos visuales. Se monta junto al detalle para mantener una API del navegador sincronizada y se desmonta cuando esa sincronización deja de ser necesaria.

### “¿Por qué no colocamos el Effect directamente en `App`?”

`App` existe desde el inicio, cuando todavía no hay título seleccionado. El componente acotado hace coincidir montaje y desmontaje con la presencia del detalle, vuelve observable el ciclo de vida estudiado y evita mezclar otra responsabilidad en `App`.

### “¿Podemos pasar `detailModel` completo y usarlo como dependencia?”

El Effect solo necesita el título. Pasar un objeto mayor acopla el componente a datos innecesarios y una referencia nueva puede volver a ejecutar la sincronización aunque el string sea el mismo.

### “¿Un arreglo vacío hace que el Effect se ejecute una sola vez?”

Describe que el Effect no lee valores reactivos del componente. No es una instrucción para ejecutar una vez. En este caso el código lee `title`, por lo que `[]` sería una dependencia incompleta.

### “¿Por qué no ponemos el título en otro `useState`?”

El título ya existe en `detailModel`. Crear otro estado duplicaría el valor y obligaría a mantener ambas copias sincronizadas. El Effect usa directamente el string derivado actual.

### “¿Por qué no consultamos el detalle dentro del Effect?”

La aplicación ya posee fetchers, query keys, caché, estados y reintentos mediante TanStack Query. Repetir la petición en un Effect perdería esa estructura y crearía dos propietarios para el mismo estado remoto.

### “¿Por qué no usamos `useMemo` para el filtro?”

Primero se mantiene la solución más simple: calcular el filtro durante el render. `useMemo` se justificaría después de medir un cálculo suficientemente costoso, no por la sola presencia de un arreglo.

### “¿Preview demuestra que la aplicación ya está desplegada?”

No. `pnpm preview` sirve para inspeccionar localmente el build generado. No prueba hosting, configuración remota ni comportamiento en producción real.

## Vocabulario

- **Render:** cálculo mediante el cual React obtiene el JSX correspondiente a props y estado actuales.
- **Commit:** etapa en la que React aplica al DOM los cambios elegidos.
- **Side effect:** interacción con algo fuera del cálculo puro del render.
- **Effect:** mecanismo para sincronizar un componente renderizado con un sistema externo.
- **Sistema externo:** comportamiento no controlado por el árbol de React, como una API del navegador o una suscripción.
- **Setup:** función que establece la sincronización correspondiente a los valores actuales.
- **Cleanup:** función devuelta por el setup que deshace esa sincronización.
- **Dependencia reactiva:** prop, estado o valor declarado en el componente que el Effect utiliza.
- **Montaje:** incorporación de un componente al árbol representado.
- **Actualización:** nuevo render de un componente que ya se encontraba en el árbol.
- **Desmontaje:** retiro de un componente del árbol.
- **Identidad referencial:** condición por la que dos objetos separados no son iguales aunque contengan valores equivalentes.
- **Strict Mode:** herramienta de desarrollo que activa comprobaciones para descubrir renders impuros y limpiezas incompletas, entre otros problemas.
- **Build de producción:** artefacto optimizado generado para ejecutar la aplicación fuera del modo de desarrollo.
- **Estado derivado:** valor calculado a partir de props, estado o datos existentes sin convertirse en otra fuente de verdad.

## Fuera del alcance

- Fetching manual mediante `useEffect`.
- Copia de respuestas de TanStack Query a estado local.
- `useLayoutEffect` y diferencias de temporización visual.
- `useEffectEvent`.
- Custom hooks de sincronización.
- Listeners globales, timers, sockets y APIs de geolocalización.
- Suscripción de Firebase Auth; aparecerá cuando exista sesión.
- Reinicio completo de formularios mediante `key`.
- Optimización prematura con `useMemo` o `memo`.
- Rutas, parámetros, layouts y navegación.
- Sincronización del detalle con la URL.
- SSR, hidratación y metadata del servidor.
- Pruebas automatizadas de Effects.

## Referencias docentes

- [React · `useEffect`](https://react.dev/reference/react/useEffect)
- [React · Sincronizar con Effects](https://react.dev/learn/synchronizing-with-effects)
- [React · Quizás no necesites un Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React · `StrictMode`](https://react.dev/reference/react/StrictMode)
- [Vite · Desplegar un sitio estático](https://vite.dev/guide/static-deploy.html)
