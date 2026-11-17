# Clase 20 · Edición y formularios reutilizables

- **Semana:** 7
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** página privada de la clase 19 con `entry`, `logId`, status, prioridad y notas visibles
- **Checkpoint de salida:** crear y editar comparten los mismos campos; la edición actualiza status, prioridad y notas y refresca detalle y biblioteca antes de cerrar

## Resultado de aprendizaje

Al terminar, el estudiante podrá extraer un formulario compartido cuando aparece un segundo consumidor real, inicializar una sesión de edición desde datos remotos ya cargados y ejecutar una actualización pesimista sin mezclar interfaz, transporte o caché.

## Pregunta guía

> Crear y editar muestran los mismos tres controles. ¿Qué código comparten y qué responsabilidades deben permanecer separadas?

La clase responde con esta estructura:

```text
                    MediaLogForm
         campos + schema + useForm + acciones
                   ▲             ▲
                   │             │
      CreateMediaLogForm      EditMediaLogForm
      identidad catálogo      entry + logId
      create mutation         update mutation
      create body             update body
```

Reutilizar los controles no significa combinar ambos casos de uso dentro de un componente lleno de props opcionales.

## Progresión entre clases

| Clase | Aporta | No resuelve todavía |
| --- | --- | --- |
| 19 | Lectura privada por `logId` y adaptación de `entry` | No permite cambiar datos |
| **20** | Formulario compartido, initial values, `PUT` e invalidación pesimista | No elimina ni navega después de una operación destructiva |
| 21 | Confirmación y eliminación, más recorrido CRUD completo | No vuelve a diseñar la edición |

La clase 21 recibirá creación, lectura y edición terminadas. Su operación nueva será eliminar.

## Conceptos de la clase

- Reutilización motivada por un segundo consumidor.
- Componente compartido frente a wrapper de caso de uso.
- `initialValues` como snapshot de una sesión de formulario.
- DTO remoto frente a values del formulario y body de actualización.
- Actualización parcial del recurso y alcance reducido del frontend.
- `PUT /api/v2/media/:id` con Bearer.
- Mutación pesimista y conservación de valores ante error.
- Invalidación de biblioteca y detalles.
- Diferencia entre `form.reset()`, desmontaje y `key` de React.
- Ausencia deliberada de un Effect para copiar props al formulario.

## Contrato real y alcance del curso

El backend ofrece:

```text
PUT /api/v2/media/:id
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

Su body permite omitir campos. El servidor deja sin cambios cualquier campo ausente. El frontend del curso usa un caso más estrecho y envía siempre los tres datos que la persona puede editar:

```ts
export type UpdateMediaLogBody = {
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}

export type UpdateMediaLogInput = {
  logId: string
  body: UpdateMediaLogBody
}

export type UpdatedMediaLogDto = {
  id: string
}
```

El endpoint también admite título y fechas para otros recorridos. Los registros creados desde catálogo tienen metadata administrada por el servidor. La interfaz no muestra esos campos y el body reducido no permite enviarlos.

### Nulabilidad de notas

| Valor del formulario | Body enviado | Resultado |
| --- | --- | --- |
| `"Volver a verla"` | `"Volver a verla"` | Sustituye las notas |
| `""` o espacios | `null` | Limpia las notas |
| Campo omitido | No ocurre en este formulario | El endpoint conservaría el valor anterior |

El estudiante debe distinguir `null` de ausencia. En este caso de uso, guardar un textarea vacío expresa la intención de eliminar las notas.

## Decisión de arquitectura

### Opción aprobada

`MediaLogForm` posee Mantine Form y la presentación común. Los wrappers poseen cada caso de uso:

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `MediaLogForm` | Crear la sesión Mantine, validar y mostrar campos y acciones | No conoce catálogo, `logId`, fetchers o Query Client |
| `CreateMediaLogForm` | Combinar values con identidad de catálogo y ejecutar creación | No vuelve a declarar inputs o schema |
| `EditMediaLogForm` | Convertir `entry` a initial values y ejecutar actualización por `logId` | No edita metadata de catálogo |
| `toMediaLogFormValues` | Convertir el DTO personal en values compatibles con inputs | No cambia el DTO ni administra estado |
| `toUpdateMediaLogBody` | Normalizar values hacia transporte | No solicita datos ni conoce el formulario visual |
| `useUpdateMediaLog` | Ejecutar mutación e invalidar lecturas afectadas | No abre o cierra el modal |
| `PrivateMediaDetailPage` | Abrir el editor y cerrarlo después del éxito | No construye el body ni llama `fetch` |

### Alternativas descartadas

| Alternativa | Motivo para descartarla |
| --- | --- |
| Compartir solo `MediaLogFields` y pasar `UseFormReturnType` | Expone un tipo genérico de Mantine y duplica setup, validación, errores y acciones |
| Un formulario con `mode: "create" | "edit"` y props opcionales | Mezcla dos identidades, dos adapters y dos mutaciones dentro del mismo componente |
| Copiar `CreateMediaLogForm` y cambiar el submit | Duplica los mismos inputs y permite que sus validaciones diverjan |

La extracción ocurre ahora porque existe un segundo consumidor. La clase 16 no necesitaba esta abstracción.

## Modelo de sesión de formulario

`initialValues` representa un snapshot tomado cuando se monta el editor:

```text
entry cargado por TanStack Query
          │
          ▼
toMediaLogFormValues(entry)
          │
          ▼
initialValues de una nueva sesión
          │
          ├── cambios locales sin guardar
          ├── reset → snapshot inicial
          └── submit → UpdateMediaLogBody
```

La clase separa tres mecanismos:

| Mecanismo | Cuándo se usa | Qué ocurre |
| --- | --- | --- |
| `form.reset()` | La persona pulsa “Restablecer” | Vuelve al snapshot inicial y limpia errores de validación |
| Desmontaje | La persona cancela y se cierra el modal | React destruye la sesión local completa |
| `key={entry.id}` | Cambia la identidad del registro en la misma posición | React monta otra instancia con otros initial values |

`form.key("status")` conserva otra responsabilidad: Mantine lo usa para actualizar un input en modo uncontrolled. No identifica el registro completo.

## Por qué no se usa `useEffect`

La página ya tiene `entry` antes de permitir “Editar”. El editor puede montarse con initial values completos:

```tsx
{isEditOpen && entry !== null && (
  <EditMediaLogForm entry={entry} key={entry.id} />
)}
```

No hace falta montar con valores vacíos y copiar el DTO después. Un Effect dependiente de `entry` también podría reescribir cambios locales si una invalidación o refetch actualiza la prop mientras la persona edita.

Si una aplicación necesitara montar el formulario antes de recibir datos, Mantine ofrece `form.initialize`. Ese no es el flujo de este checkpoint y solo se nombra como alternativa de otro diseño.

## Guion de presentación

### Propósito y duración

La presentación inicial dura 18 minutos. Recupera la lectura privada de la clase 19, muestra el segundo consumidor de los campos y establece la diferencia entre compartir interfaz y mezclar casos de uso. Los últimos 7 minutos vuelven al deck para reconstruir el recorrido y abrir la eliminación de la clase 21.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | `entry` ya llega hasta la pantalla | Recuperar `logId`, `UserMediaDataDto` y `SavedMediaDetails`. Pedir qué tres campos pertenecen a la persona. | Captura del checkpoint 19 y recorrido `URL → query → entry → modelo`. |
| Problema | Los mismos controles aparecen por segunda vez | Crear ya usa status, prioridad y notas. Copiarlos para editar duplicaría schema, labels y JSX. | Dos mockups con los tres campos resaltados; atenuar identidad y submit diferentes. |
| Criterio | Compartir una responsabilidad estable | `MediaLogForm` comparte sesión, validación y presentación. Los wrappers conservan identidad, adapter, mutation y copy de error. | Diagrama de componentes con frontera central. |
| Contraste | Reutilización no es un modo gigante | Comparar wrappers pequeños con un formulario que recibe catálogo, log y callbacks opcionales. | Tabla de props válidas e inválidas. Evitar presentar menos archivos como meta. |
| Datos | DTO, form values y body cumplen trabajos distintos | `entry.notes` usa `string | null`; el textarea necesita `string`; el body vuelve a `string | null`. Dos adapters hacen visibles esas fronteras. | Recorrido `null → "" → null` con nombres de tipos. |
| Sesión | Initial values son un snapshot | El editor parte de los datos guardados. Los cambios posteriores viven en Mantine Form hasta guardar, restablecer o desmontar. | Línea temporal de una sesión. No decir que props e inputs se sincronizan solos. |
| React | Reset, unmount y key no son sinónimos | Reset conserva la instancia; cerrar la destruye; otra key crea otra identidad. `form.key` pertenece al input uncontrolled. | Cuatro tarjetas con cada mecanismo y su propietario. |
| Effect | Los datos ya existen antes del montaje | Query carga `entry`; el clic monta el editor. Copiar props mediante Effect añade una sincronización innecesaria y puede borrar cambios durante un refetch. | Antes/después con la secuencia de montaje. |
| API | El frontend edita una parte del recurso | El endpoint acepta un patch amplio. El producto envía status, prioridad y notas; título y fechas quedan fuera. | Body permitido por el curso junto a campos bloqueados. |
| Mutación | Guardar espera confirmación | La interfaz conserva valores mientras el PUT está pendiente o falla. El éxito invalida lista y detalle antes de cerrar. | Línea temporal `submit → PUT → invalidate → refetch → close`. |
| Caché | Cambiar datos personales afecta dos familias | La biblioteca muestra status/prioridad y el detalle muestra los tres campos. Búsqueda mantiene el mismo `isLogged`. | Árbol de keys con `lists()` y `details()` resaltados. |
| Frontera | Editar queda completo; eliminar comienza después | La siguiente clase añadirá confirmación, DELETE y navegación. No aparecen hoy. | CRUD con C, R y U completos; D atenuada. |

### Indicaciones que deben sobrevivir a la producción de slides

- La extracción ocurre en la clase 20 porque crear y editar son dos consumidores reales.
- Compartir campos no obliga a compartir el caso de uso completo.
- `MediaLogForm` no recibe `logId`, `externalId`, DTOs ni mutaciones.
- Los wrappers no vuelven a declarar Select, Textarea o schema.
- `entry` continúa siendo DTO remoto. `toMediaLogFormValues` produce values para una sesión local; no crea otra fuente de verdad remota.
- `notes: null` se convierte en `notes: ""` porque un textarea trabaja con texto.
- Guardar texto vacío envía `notes: null`; no omite el campo porque la intención es limpiarlo.
- El endpoint acepta una actualización parcial, pero el formulario envía los tres campos editables completos.
- El título no se deshabilita dentro del formulario: no existe como control.
- `initialValues` son el punto de partida de una sesión, no una suscripción continua a `entry`.
- `form.reset()` restaura valores iniciales y limpia errores de validación dentro de la misma instancia.
- Cancelar cierra y desmonta. No necesita ejecutar un Effect ni copiar valores vacíos.
- `key={entry.id}` identifica el formulario completo; `form.key("notes")` ayuda a Mantine con un input uncontrolled.
- Un refetch no debe sobreescribir cambios sin guardar. Por eso no existe un Effect que ejecute `form.setValues(entry)`.
- La mutación es pesimista: la vista de lectura cambia después del `200` y las invalidaciones.
- El error mantiene el modal abierto y los valores editables.
- `UPDATE_MEDIA_LOG_INVALIDATION_KEYS` contiene `lists()` y `details()`. Búsqueda no cambia su proyección.
- Se conserva el `Promise.all` explícito. La clase 21 podrá evaluar un helper cuando eliminación produzca el tercer consumidor.
- No se muestra una notificación de éxito escrita a mano; el detalle refetcheado demuestra el cambio.
- No se añade DELETE, drawer, Zustand o cambio de backend.

### Snippets conceptuales para las slides

Responsabilidades compartidas:

```ts
type MediaLogFormProps = {
  initialValues: MediaLogFormValues
  onSubmit: (values: MediaLogFormValues) => void
}
```

Snapshot del DTO:

```ts
notes: entry.notes ?? ""
```

Reset por identidad:

```tsx
<EditMediaLogForm entry={entry} key={entry.id} />
```

El deck no muestra la implementación completa. El editor se usa para construir props, adapters y mutación.

### Cierre conceptual

El cierre responde:

1. ¿Qué comparte `MediaLogForm` y qué conserva cada wrapper?
2. ¿Por qué `entry.notes` y `form.values.notes` no tienen la misma nulabilidad?
3. ¿Qué diferencia existe entre resetear, desmontar y cambiar una key?
4. ¿Por qué actualización invalida listas y detalles, pero no búsquedas?

## Estado inicial y transformación de archivos

El checkpoint 19 ya incluye el formulario de creación, el detalle privado y los labels compartidos:

```text
src/
├── adapters/
│   └── media-log-form-to-create-body.ts
├── components/
│   ├── create-media-log-form.tsx
│   └── saved-media-details.tsx
├── constants/
│   └── media-log.ts
├── hooks/features/
│   └── use-media.ts
├── pages/
│   └── private-media-detail-page.tsx
├── schemas/
│   └── media-log.ts
└── types/
    └── media-api.ts
```

La clase produce:

```text
src/
├── adapters/
│   ├── media-log-form-to-create-body.ts  conserva creación
│   ├── media-log-form-to-update-body.ts  nuevo
│   └── user-media-to-form-values.ts      nuevo
├── api/
│   └── media.ts                          añade updateMediaLog
├── components/
│   ├── media-log-form.tsx                nuevo formulario compartido
│   ├── create-media-log-form.tsx         se convierte en wrapper
│   └── edit-media-log-form.tsx           nuevo wrapper
├── hooks/features/
│   └── use-media.ts                      añade useUpdateMediaLog
├── pages/
│   └── private-media-detail-page.tsx     integra acción y modal
└── types/
    └── media-api.ts                      añade tipos de actualización
```

No se modifica el backend ni se crea una ruta nueva.

## Flujo de construcción

### Estado 1 · Auditar el formulario existente

El grupo abre `CreateMediaLogForm` y clasifica su código:

| Fragmento actual | Destino |
| --- | --- |
| `useForm`, schema, initial values recibidos y tres inputs | `MediaLogForm` |
| Opciones y labels visuales | `MediaLogForm`, importados desde constantes y contrato |
| Error, pending y botones | Presentación configurable de `MediaLogForm` |
| `identity` y `toCreateMediaLogBody` | Permanecen en `CreateMediaLogForm` |
| `useCreateMediaLog` | Permanece en `CreateMediaLogForm` |
| `onCreated` | Permanece en el wrapper de creación |

El docente no empieza creando un archivo vacío. Primero muestra la segunda interfaz y pide qué líneas cambiarían juntas si se añadiera un nuevo campo personal.

### Estado 2 · Definir el contrato de `MediaLogForm`

`src/components/media-log-form.tsx` recibe solo datos y eventos de formulario:

```ts
type MediaLogFormProps = {
  initialValues: MediaLogFormValues
  submitLabel: string
  isSubmitting: boolean
  errorMessage: string | null
  onCancel: () => void
  onSubmit: (values: MediaLogFormValues) => void
}
```

Dentro del componente:

```tsx
const form = useForm<MediaLogFormValues>({
  mode: "uncontrolled",
  initialValues,
  validate: schemaResolver(mediaLogFormSchema, { sync: true }),
  validateInputOnBlur: true,
})
```

El JSX conserva los tres controles existentes y añade una acción explícita de reset:

```tsx
{errorMessage !== null && (
  <Alert color="red" title="No pudimos guardar">
    {errorMessage}
  </Alert>
)}

<Group justify="flex-end">
  <Button
    disabled={isSubmitting}
    onClick={onCancel}
    type="button"
    variant="default"
  >
    Cancelar
  </Button>

  <Button
    disabled={isSubmitting}
    onClick={() => form.reset()}
    type="button"
    variant="light"
  >
    Restablecer
  </Button>

  <Button loading={isSubmitting} type="submit">
    {submitLabel}
  </Button>
</Group>
```

`MediaLogForm` no convierte notes a `null`. Esa decisión pertenece al adapter de transporte.

### Estado 3 · Refactorizar creación y comprobar regresiones

La creación define su snapshot inicial:

```ts
const CREATE_MEDIA_LOG_INITIAL_VALUES: MediaLogFormValues = {
  status: "pending",
  priority: "medium",
  notes: "",
}
```

`CreateMediaLogForm` mantiene su mutación y compone el formulario compartido:

```tsx
const createMutation = useCreateMediaLog()
const errorMessage = createMutation.isError
  ? getCreateMediaLogErrorMessage(createMutation.error)
  : null

function handleSubmit(values: MediaLogFormValues) {
  createMutation.mutate(toCreateMediaLogBody(identity, values), {
    onSuccess: onCreated,
  })
}

return (
  <MediaLogForm
    errorMessage={errorMessage}
    initialValues={CREATE_MEDIA_LOG_INITIAL_VALUES}
    isSubmitting={createMutation.isPending}
    onCancel={onCancel}
    onSubmit={handleSubmit}
    submitLabel="Guardar"
  />
)
```

El grupo ejecuta búsqueda, detalle y creación antes de continuar. Una extracción no está terminada si rompe el consumidor anterior.

### Estado 4 · Transformar `entry` en initial values

`src/adapters/user-media-to-form-values.ts`:

```ts
export function toMediaLogFormValues(
  entry: UserMediaDataDto,
): MediaLogFormValues {
  return {
    status: entry.status,
    priority: entry.priority,
    notes: entry.notes ?? "",
  }
}
```

La función no guarda el resultado. `EditMediaLogForm` lo deriva cuando empieza su sesión.

El grupo prueba:

| `entry.notes` | `initialValues.notes` |
| --- | --- |
| `null` | `""` |
| `"Ver con subtítulos"` | `"Ver con subtítulos"` |

### Estado 5 · Construir el body de actualización

`src/adapters/media-log-form-to-update-body.ts`:

```ts
export function toUpdateMediaLogBody(
  values: MediaLogFormValues,
): UpdateMediaLogBody {
  const notes = values.notes.trim()

  return {
    status: values.status,
    priority: values.priority,
    notes: notes === "" ? null : notes,
  }
}
```

Crear y editar mantienen adapters separados porque producen contratos distintos. La repetición de tres asignaciones permanece visible; la clase no introduce un builder genérico antes de tener más variantes.

### Estado 6 · Crear el fetcher autenticado

`src/api/media.ts` añade:

```ts
export function updateMediaLog({
  logId,
  body,
}: UpdateMediaLogInput): Promise<UpdatedMediaLogDto> {
  return requestJsonWithAuth<UpdatedMediaLogDto>(
    `${API_URL}/api/v2/media/${logId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
}
```

El path recibe `logId`. El body recibe únicamente los campos personales. `userId` continúa viniendo del token verificado por el servidor.

### Estado 7 · Crear la mutación y razonar invalidaciones

Antes del código, el grupo completa:

| Familia | ¿Cambió? | Decisión |
| --- | --- | --- |
| `lists()` | Sí. Muestra status y prioridad | Invalidar |
| `details()` | Sí. Muestra status, prioridad y notas | Invalidar |
| `searches()` | No. El medio continúa guardado | No invalidar |

`src/hooks/features/use-media.ts` añade:

```ts
export const UPDATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.lists(),
  mediaKeys.details(),
]

export function useUpdateMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMediaLog,
    onSuccess: async () => {
      await Promise.all(
        UPDATE_MEDIA_LOG_INVALIDATION_KEYS().map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      )
    },
  })
}
```

El `onSuccess` retorna una Promise. La mutación permanece pending mientras las queries activas terminan su refetch. El helper genérico de invalidación continúa fuera de alcance hasta que la eliminación produzca otro consumidor.

### Estado 8 · Construir `EditMediaLogForm`

`src/components/edit-media-log-form.tsx` conserva el caso de uso:

```tsx
type EditMediaLogFormProps = {
  entry: UserMediaDataDto
  onCancel: () => void
  onUpdated: () => void
}

export function EditMediaLogForm({
  entry,
  onCancel,
  onUpdated,
}: EditMediaLogFormProps) {
  const updateMutation = useUpdateMediaLog()
  const initialValues = toMediaLogFormValues(entry)
  const errorMessage = updateMutation.isError
    ? getUpdateMediaLogErrorMessage(updateMutation.error)
    : null

  function handleSubmit(values: MediaLogFormValues) {
    updateMutation.mutate(
      {
        logId: entry.id,
        body: toUpdateMediaLogBody(values),
      },
      { onSuccess: onUpdated },
    )
  }

  return (
    <MediaLogForm
      errorMessage={errorMessage}
      initialValues={initialValues}
      isSubmitting={updateMutation.isPending}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar cambios"
    />
  )
}
```

El wrapper no usa `useState` para copiar `entry`. Tampoco llama `form.setValues` desde un Effect.

### Estado 9 · Traducir errores de actualización

La función local conserva copy específico:

```ts
function getUpdateMediaLogErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Ocurrió un error inesperado. Intenta nuevamente."
  }

  switch (error.status) {
    case 400:
      return "El servidor no pudo validar estos cambios."
    case 401:
      return "Tu sesión no pudo usarse para editar."
    case 404:
      return "No encontramos este registro en tu biblioteca."
    default:
      return "No pudimos actualizar el medio. Intenta nuevamente."
  }
}
```

Ante error, la mutación termina pending, el formulario permanece montado y Mantine conserva los values. No se ejecuta reset, close o navegación.

### Estado 10 · Integrar el modal en el detalle privado

`PrivateMediaDetailPage` añade estado local de interfaz:

```tsx
const [isEditOpen, setIsEditOpen] = useState(false)
```

La acción aparece junto a los datos personales:

```tsx
<Button onClick={() => setIsEditOpen(true)}>
  Editar mis datos
</Button>
```

La página monta el editor solo cuando existe una entrada y el modal está abierto:

```tsx
<Modal
  opened={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  title="Editar medio"
>
  {isEditOpen && detailQuery.data.entry !== null && (
    <EditMediaLogForm
      entry={detailQuery.data.entry}
      key={detailQuery.data.entry.id}
      onCancel={() => setIsEditOpen(false)}
      onUpdated={() => setIsEditOpen(false)}
    />
  )}
</Modal>
```

La secuencia de éxito es:

```text
submit
→ PUT autenticado
→ 200
→ invalidate lists y details
→ el detalle activo refetchea entry
→ termina pending
→ onUpdated cierra
→ SavedMediaDetails muestra el valor confirmado
```

La página no modifica `SavedMediaDetails` de forma manual. El nuevo DTO llega mediante la query invalidada.

## Secuencia de 120 minutos

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0-18 min | Docente y grupo | Usar el deck para recuperar `entry`, presentar el segundo consumidor y separar formulario compartido de wrappers. |
| 18-35 min | Construcción interactiva | Auditar `CreateMediaLogForm`, clasificar responsabilidades y diseñar las props de `MediaLogForm`. |
| 35-53 min | Docente con participación | Extraer schema, sesión, inputs, error y acciones hacia `MediaLogForm`; demostrar reset explícito. |
| 53-68 min | Actividad estudiantil | Convertir `CreateMediaLogForm` en wrapper y ejecutar el recorrido de creación para detectar regresiones. |
| 68-84 min | Docente y estudiantes | Crear adapters de initial values y update body; probar `null`, texto y espacios. |
| 84-101 min | Construcción guiada | Añadir tipos, fetcher, mutación e invalidaciones de `lists()` y `details()`. |
| 101-113 min | Actividad estudiantil | Construir `EditMediaLogForm`, conectarlo al modal y probar reset, cancelación, error y éxito. |
| 113-120 min | Docente y grupo | Ejecutar `pnpm build`, volver al deck y delimitar la eliminación de la clase 21. |

La suma de los bloques es de 120 minutos.

## Actividades del docente

- Mostrar la segunda interfaz antes de proponer una extracción.
- Pedir que el grupo clasifique líneas del formulario existente por responsabilidad.
- Comparar wrappers con un componente único lleno de props opcionales.
- Dibujar el recorrido `entry → form values → update body` con sus nulabilidades.
- Demostrar `form.reset()`, desmontaje y key como mecanismos distintos.
- Mostrar un Effect incorrecto que sobrescribe notas durante un refetch y retirarlo.
- Leer el contrato real de actualización y tachar título, fechas y `userId` de la UI.
- Pedir una predicción de familias afectadas antes de escribir invalidaciones.
- Forzar un error y comprobar que los values continúan en los inputs.
- Verificar creación después de refactorizar y edición antes de cerrar la clase.
- Rechazar DELETE, navegación automática y cambios de backend.

## Actividades de los estudiantes

- Identificar qué código comparten crear y editar.
- Proponer props para el formulario sin incluir DTOs o mutaciones.
- Refactorizar creación y demostrar que el flujo anterior sigue funcionando.
- Escribir y probar los dos adapters de edición.
- Explicar por qué notas cambia entre `null` y `""`.
- Construir el fetcher autenticado sin añadir `userId`.
- Seleccionar las familias que quedaron stale después del PUT.
- Integrar el wrapper de edición y su error local.
- Restablecer cambios sin cerrar el modal.
- Cancelar, reabrir y comprobar los initial values.
- Guardar, volver a la biblioteca y comprobar la fila actualizada.

## Verificación guiada

1. Buscar y crear un medio después del refactor: el flujo anterior continúa funcionando.
2. Abrir su detalle privado y pulsar “Editar mis datos”.
3. Confirmar que status, prioridad y notas coinciden con `entry`.
4. Cambiar los tres campos y pulsar “Restablecer”: vuelven al snapshot inicial.
5. Cambiar notas, cancelar y reabrir: el borrador cancelado no permanece.
6. Guardar notas vacías: Network muestra `notes: null`.
7. Inspeccionar el request: usa `PUT`, contiene el `logId` en el path y envía Bearer.
8. Confirmar que el body no contiene título, fechas, metadata, `userId` o token.
9. Inspeccionar Query Devtools: `lists()` y `details()` quedan invalidadas; búsquedas no.
10. Confirmar que el modal cierra después de actualizar el detalle activo.
11. Volver a la biblioteca: status y prioridad reflejan el cambio.
12. Forzar un `404` o error de red: el modal permanece abierto y conserva los values.
13. Reintentar después del error: una respuesta exitosa completa el recorrido.
14. Ejecutar `pnpm build`.

## Evidencia de salida

- `MediaLogForm` contiene los tres campos, schema, reset y acciones comunes.
- `CreateMediaLogForm` continúa creando sin duplicar el JSX de los campos.
- `EditMediaLogForm` recibe `entry` y usa `entry.id` como `logId`.
- Los initial values representan status, prioridad y notas guardados.
- `notes: null` llega al textarea como `""`; guardar vacío vuelve a enviar `null`.
- El body de actualización contiene solo status, prioridad y notas.
- El request usa `PUT /api/v2/media/:id` y autenticación existente.
- La mutación invalida listas y detalles y espera las queries activas.
- Un error conserva la sesión editable y permite reintentar.
- Restablecer, cancelar y cambiar de key producen comportamientos distintos y explicables.
- No existe un Effect de sincronización entre `entry` y form values.
- No existe DELETE, navegación posterior a eliminación o cambio del backend.

## Errores previsibles y preguntas de corrección

| Error observado | Pregunta docente | Corrección esperada |
| --- | --- | --- |
| `MediaLogForm` importa `useCreateMediaLog` y `useUpdateMediaLog`. | ¿Sigue siendo un formulario compartido o ya decide el caso de uso? | Mover mutaciones a wrappers. |
| El componente tiene props opcionales para `identity`, `entry` y `logId`. | ¿Qué combinaciones inválidas permite ese contrato? | Mantener wrappers con props obligatorias propias. |
| Editar copia y modifica `CreateMediaLogForm`. | ¿Qué ocurrirá cuando cambie el schema? | Extraer inputs y sesión común. |
| El textarea recibe `null`. | ¿Qué tipo espera el control? | Adaptar a `""` en initial values. |
| Guardar vacío envía `""`. | ¿Cómo expresa el contrato limpiar notas? | Normalizar a `null` en el adapter. |
| El formulario incluye título deshabilitado. | ¿Ese dato forma parte del caso de uso? | No crear el control. Mostrar título fuera si aporta contexto. |
| Un Effect llama `form.setValues(entry)` en cada refetch. | ¿Qué ocurre con un borrador local? | Montar con initial values y eliminar la sincronización. |
| Cancelar llama reset y deja el editor montado sin necesidad. | ¿La interfaz se desmonta al cerrar? | Usar el evento de cierre y render condicional. |
| Se confunden `form.key("status")` y `key={entry.id}`. | ¿Qué identidad representa cada key? | Separar input uncontrolled e instancia completa. |
| Update invalida búsquedas. | ¿Cambió `isLogged`? | Invalidar solo listas y detalles. |
| Update no invalida el detalle activo. | ¿Qué query conserva las notas anteriores? | Añadir `mediaKeys.details()`. |
| El modal cierra al iniciar el request. | ¿Existe confirmación del servidor? | Cerrar desde `onUpdated` después del éxito. |
| Un error borra los campos. | ¿Quién solicitó una nueva sesión? | Mantener el formulario montado y no resetear. |

## Fuera de alcance

- Modificar rutas, schemas o casos de uso del backend.
- Editar título, tipo, poster, fechas, géneros o metadata de catálogo.
- Actualizar tags o calendario.
- Enviar solo campos dirty o construir un diff de values.
- Usar `useEffect` para inicializar o resetear este formulario.
- Eliminar registros o abrir un diálogo destructivo.
- Navegar automáticamente después de editar.
- Crear un helper genérico de invalidación antes del tercer consumidor.
- Introducir Zustand, drawer o notificaciones globales.

## Vocabulario

- **Wrapper de caso de uso:** componente pequeño que conecta una interfaz compartida con identidad, adapter y operación concreta.
- **Initial values:** valores con los que comienza una sesión de formulario.
- **Snapshot inicial:** copia de referencia usada por reset y comparación de cambios durante esa sesión.
- **Actualización parcial:** operación que cambia algunos campos del recurso y deja intactos los demás.
- **Metadata bloqueada:** datos administrados por catálogo que la persona no puede modificar desde este formulario.
- **Regresión:** comportamiento anterior que deja de funcionar después de un cambio nuevo.
- **Actualización pesimista:** flujo que espera la confirmación del servidor antes de representar el nuevo estado remoto.
- **Remount:** desmontaje y nuevo montaje de un componente cuando cambia su identidad, por ejemplo una `key`.

## Referencias para preparar la clase

- [React · Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [Mantine Form · use-form](https://mantine.dev/form/use-form/)
- [Mantine Form · Form values](https://mantine.dev/form/values/)
- [Mantine Form · Uncontrolled mode](https://mantine.dev/form/uncontrolled/)
- [TanStack Query · useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
- Contrato docente de `PUT /api/v2/media/:id` preparado antes de la cohorte.
- Checkpoints 19 y 21 para comprobar las fronteras de lectura, edición y eliminación.

Las referencias del backend sirven al docente para confirmar el contrato. Los estudiantes reciben una URL funcional y trabajan solo en el frontend.
