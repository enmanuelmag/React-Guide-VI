# Guía docente · Sesión 15 · Edición y reutilización

## Archivo de hooks de esta sesión

Reutiliza las [opciones y conexiones de Mantine Form explicadas en 11](../11-formularios-zod-y-modal-global/teacher-guide.md#qué-hace-cada-opción): uncontrolled, valores iniciales, resolver síncrono, blur, `form.key`, `getInputProps` y `onSubmit`. Revisa qué callbacks necesita este caso; limpiar el preview con `onValuesChange` pertenecía al body local de 11, no es obligatorio en todos los formularios.

Añade `useUpdateMediaLog`; conserva `useCreateMediaLog` y los hooks de lectura. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Contratos heredados disponibles

No reconstruyas estos símbolos de memoria:

- La sesión 11 define `mediaLogFormSchema`, `MediaLogFormValues` y `toCreateMediaLogBody` en el bloque **“63–73 · Adapter, preview y remount”** de su [guía docente](../11-formularios-zod-y-modal-global/teacher-guide.md).
- La sesión 13 deja la referencia completa de `CreateMediaLogForm`, `CreateMediaLogFormProps`, `getCreateMediaLogErrorMessage`, `useCreateMediaLog` y las opciones derivadas de los values canónicos en **“0–15 · Modelo y adapter visual”** de su [guía docente](../13-taller-crear-listar-y-filtrar-biblioteca/teacher-guide.md).
- La sesión 14 deja `UserMediaDataDto`, `SavedMediaDetails` y la referencia completa de `PrivateMediaDetailPage` en **“Contratos heredados disponibles”** y **“72–79 · Navegar y traducir errores”** de su [guía docente](../14-detalle-privado-e-identidades/teacher-guide.md).

Esta sesión mueve código existente y añade edición. Si un símbolo heredado falta en el seed, corrige el checkpoint que lo introdujo; no declares una copia local.

## Objetivo

Guiar al grupo desde un formulario de creación y un detalle privado de solo lectura hasta un componente compartido con wrappers explícitos y una actualización pesimista.

La dificultad principal es separar mecanismo e identidad. No abras DELETE ni un helper genérico de invalidaciones.

## Preparación docente

1. Parte del checkpoint completo de la sesión 14.
2. Conserva una película y una serie en la biblioteca con status, prioridad y notas diferentes.
3. Comprueba creación desde búsqueda y detalle público antes de comenzar.
4. Abre `/app/library/:logId` y confirma que `entry` está disponible antes de renderizar éxito.
5. Confirma que `MediaDetailSelector` se importa desde `src/schemas/media-detail.ts` y que el adapter de ruta usa `safeParse`.
6. Prepara una respuesta controlada con `notes: null`.
7. Prepara errores `400`, `401` y `404` para la mutación de actualización.
8. Abre Query Devtools y Network.
9. Confirma que el seed fija `@mantine/form@9.4.1` y conserva `mode: "uncontrolled"`.
10. Confirma que `pnpm test -- media-log-form-edit-adapters` y `pnpm build` son comandos válidos.
11. No instales dependencias nuevas.
12. No cambies el contrato remoto ni edites título o fechas.
13. Conserva un checkpoint de rescate con la extracción y regresión de creación terminadas. PUT, modal y test deben permanecer sin resolver.

## Contrato docente verificado

El backend preparado expone:

```text
PUT /api/v2/media/:id
Authorization: Bearer <token>
Content-Type: application/json
```

El curso enviará:

```ts
type UpdateMediaLogBody = {
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}
```

El backend admite más campos y devuelve un DTO completo. El frontend declara solamente el resultado consumido:

```ts
type UpdatedMediaLogDto = {
  id: string
}
```

No presentes el tipo mínimo como descripción exhaustiva del servidor. Es el subconjunto que esta interfaz usa.

## Clave de lectura

| Pregunta | Respuesta | Justificación breve |
| --- | --- | --- |
| 1 | B | `form.reset()` restaura los `initialValues` de esa instancia. |
| 2 | Verdadero | Mantine documenta que `reset` también limpia los errores. |
| 3 | B | Al cambiar la key, React crea otra instancia y reinicia su estado. |
| 4 | Verdadero | Keys diferentes permiten que React trate los componentes como instancias distintas. |
| 5 | B | `key={entry.id}` cambia cuando el editor recibe otro registro. |

Pide una justificación oral para las preguntas 2 y 5. No enseñes todavía la solución completa del modal.

## Mapa de responsabilidades

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `MediaLogForm` | Values, schema, inputs y acciones | No conoce identidad ni HTTP |
| `CreateMediaLogForm` | Catálogo, body de creación y POST | No contiene inputs propios |
| `EditMediaLogForm` | Entry, body de update y PUT | No obtiene la entrada |
| `toMediaLogFormValues` | Convertir entry en snapshot inicial | No administra el form |
| `toUpdateMediaLogBody` | Convertir values en body mínimo | No añade identidad al JSON |
| `updateMediaLog` | Ejecutar PUT autenticado | No invalida caché |
| `useUpdateMediaLog` | Mutación e invalidaciones | No abre ni cierra modal |
| `PrivateMediaDetailPage` | Montar modal cuando existe entry | No copia values ni ejecuta PUT |

## 0–10 · Recuperar la necesidad

Abre creación y detalle privado. Completa con el grupo:

| Campo | Crear | Leer | Editar |
| --- | --- | --- | --- |
| Status | Input | Label | Input |
| Prioridad | Input | Label | Input |
| Notas | Textarea | Texto | Textarea |

Pregunta:

> ¿Qué parte se repetiría si hoy copiamos `CreateMediaLogForm`?

Clasifica las respuestas:

```text
compartido
  → form, schema, inputs, validación, reset y botones

propio de crear
  → identidad de catálogo, POST y errores de creación

propio de editar
  → entry/logId, PUT y errores de actualización
```

Checkpoint: nadie propone mover identity, mutation object o Query Client al formulario compartido.

## 10–26 · Extraer `MediaLogForm`

### 10–14 · Diseñar la interfaz

Escribe primero el contrato:

```ts
export type MediaLogFormProps = {
  initialValues: MediaLogFormValues
  submitLabel: string
  isPending: boolean
  errorMessage: string | null
  onSubmit: (values: MediaLogFormValues) => void
  onCancel: () => void
}
```

Contrasta con la alternativa rechazada:

```ts
type AmbiguousProps = {
  mode: "create" | "edit"
  catalogIdentity?: GetMediaDetailInput
  entry?: UserMediaDataDto
  logId?: string
}
```

Pide tres combinaciones inválidas que ese tipo permitiría.

### 14–26 · Mover la mecánica

Crea `src/components/media-log-form.tsx`. Mueve sin cambiar todavía:

- `useForm<MediaLogFormValues>`;
- `mode: "uncontrolled"`;
- `schemaResolver(mediaLogFormSchema, { sync: true })`;
- dos `Select` y un `Textarea`;
- `form.key(field)` y `getInputProps(field)`;
- reset, cancelar y submit;
- pending y presentación del mensaje recibido.

La referencia completa del archivo extraído es:

```tsx
import { Alert, Button, Group, Select, Stack, Textarea } from "@mantine/core"
import { schemaResolver, useForm } from "@mantine/form"

import {
  MEDIA_PRIORITY_LABELS,
  MEDIA_STATUS_LABELS,
} from "../constants/media-log"
import {
  mediaLogFormSchema,
  type MediaLogFormValues,
} from "../schemas/media-log"
import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
} from "../types/media-api"

const STATUS_OPTIONS = MEDIA_STATUS_VALUES.map((value) => ({
  value,
  label: MEDIA_STATUS_LABELS[value],
}))

const PRIORITY_OPTIONS = MEDIA_PRIORITY_VALUES.map((value) => ({
  value,
  label: MEDIA_PRIORITY_LABELS[value],
}))

export type MediaLogFormProps = {
  initialValues: MediaLogFormValues
  submitLabel: string
  isPending: boolean
  errorMessage: string | null
  onSubmit: (values: MediaLogFormValues) => void
  onCancel: () => void
}

export function MediaLogForm({
  initialValues,
  submitLabel,
  isPending,
  errorMessage,
  onSubmit,
  onCancel,
}: MediaLogFormProps) {
  const form = useForm<MediaLogFormValues>({
    mode: "uncontrolled",
    initialValues,
    validate: schemaResolver(mediaLogFormSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  return (
    <form noValidate onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        {errorMessage ? <Alert color="red">{errorMessage}</Alert> : null}

        <Select
          allowDeselect={false}
          data={STATUS_OPTIONS}
          disabled={isPending}
          key={form.key("status")}
          label="Status"
          {...form.getInputProps("status")}
        />

        <Select
          allowDeselect={false}
          data={PRIORITY_OPTIONS}
          disabled={isPending}
          key={form.key("priority")}
          label="Prioridad"
          {...form.getInputProps("priority")}
        />

        <Textarea
          autosize
          disabled={isPending}
          key={form.key("notes")}
          label="Notas"
          minRows={3}
          placeholder="Opcional"
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end">
          <Button
            disabled={isPending}
            onClick={() => form.reset()}
            type="button"
            variant="default"
          >
            Restablecer
          </Button>
          <Button
            disabled={isPending}
            onClick={onCancel}
            type="button"
            variant="subtle"
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isPending}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
```

No añadas `useEffect`, mutation hooks, props de identidad o un segundo schema.

Checkpoint:

- el componente compila de forma aislada;
- todos los inputs siguen asociados a Mantine Form;
- el error llega como string ya traducido;
- reset y cancelar siguen siendo acciones diferentes.

## 26–36 · Reconstruir creación y probar regresión

Declara defaults con nombre:

```ts
export const CREATE_MEDIA_LOG_INITIAL_VALUES: MediaLogFormValues = {
  status: "pending",
  priority: "medium",
  notes: "",
}
```

Convierte `CreateMediaLogForm` en wrapper. La referencia final de `src/components/create-media-log-form.tsx` conserva la identidad visible, el adapter, el POST y su traductor de errores:

```tsx
import { Stack, Text } from "@mantine/core"

import { toCreateMediaLogBody } from "../adapters/media-log-form-to-create-body"
import { ApiError } from "../api/http"
import { useCreateMediaLog } from "../hooks/features/use-media"
import type { MediaLogFormValues } from "../schemas/media-log"
import type { GetMediaDetailInput } from "../types/media-api"
import { MediaLogForm } from "./media-log-form"

export const CREATE_MEDIA_LOG_INITIAL_VALUES: MediaLogFormValues = {
  status: "pending",
  priority: "medium",
  notes: "",
}

type CreateMediaLogFormProps = {
  identity: GetMediaDetailInput
  onCreated: () => void
  onCancel: () => void
}

function getCreateMediaLogErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Ocurrió un error inesperado. Intenta nuevamente."
  }

  switch (error.status) {
    case 401:
      return "Tu sesión no pudo usarse para guardar. Vuelve a iniciar sesión."
    case 404:
      return "Este medio ya no está disponible en el catálogo."
    case 409:
      return "Este medio ya está en tu biblioteca."
    default:
      return "El servidor no pudo guardar el medio. Intenta nuevamente."
  }
}

export function CreateMediaLogForm({
  identity,
  onCreated,
  onCancel,
}: CreateMediaLogFormProps) {
  const createMutation = useCreateMediaLog()

  function handleSubmit(values: MediaLogFormValues) {
    createMutation.mutate(toCreateMediaLogBody(identity, values), {
      onSuccess: onCreated,
    })
  }

  const errorMessage = createMutation.isError
    ? getCreateMediaLogErrorMessage(createMutation.error)
    : null

  return (
    <Stack gap="md">
      <Text size="sm">
        {identity.mediaType} · {identity.externalId}
      </Text>

      <MediaLogForm
        errorMessage={errorMessage}
        initialValues={CREATE_MEDIA_LOG_INITIAL_VALUES}
        isPending={createMutation.isPending}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitLabel="Guardar en biblioteca"
      />
    </Stack>
  )
}
```

Conserva la key del modal de creación basada en `mediaType + externalId`. No uses `CREATE_MEDIA_LOG_INITIAL_VALUES` como objeto mutable; el formulario administra sus propios values.

Prueba antes de continuar:

1. abre desde búsqueda;
2. cambia los tres campos;
3. usa reset;
4. guarda y observa un POST;
5. abre desde detalle público;
6. cancela y reabre otra identidad.

Si falla creación, corrige la extracción antes de añadir edición.

## 36–48 · Adapters y semántica de identidad

### 36–42 · Entrada y salida

Crea `src/adapters/user-media-to-form-values.ts` con su dependencia de entrada y su tipo de salida visibles:

```ts
import type { MediaLogFormValues } from "../schemas/media-log"
import type { UserMediaDataDto } from "../types/media-api"

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

En `src/types/media-api.ts`, define primero el body remoto que producirá el adapter:

```ts
export type UpdateMediaLogBody = {
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}
```

Crea `src/adapters/media-log-form-to-update-body.ts`:

```ts
import type { MediaLogFormValues } from "../schemas/media-log"
import type { UpdateMediaLogBody } from "../types/media-api"

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

Verifica que el body no contiene `id`, título, fechas o catálogo.

### 42–48 · Tres operaciones distintas

Dibuja:

```text
form.reset()
  → misma instancia
  → vuelve al snapshot inicial

cancelar
  → cierra modal
  → desmonta la instancia

entry.id cambia
  → key cambia
  → nueva instancia y nuevo snapshot
```

Contrasta:

```tsx
key={entry.id}           // identidad del editor completo
key={form.key("notes")} // identidad del input uncontrolled
```

No enseñes `form.initialize` en esta sesión. `entry` ya existe antes de montar el wrapper.

## 48–62 · Conectar PUT e invalidaciones

### 48–54 · Tipos y fetcher

En `src/types/media-api.ts`, junto a los contratos remotos definidos desde la sesión 07, añade los tipos mínimos:

```ts
export type UpdateMediaLogInput = {
  logId: string
  body: UpdateMediaLogBody
}

export type UpdatedMediaLogDto = {
  id: string
}
```

En `src/api/media.ts`, combina estos imports con los fetchers existentes y añade `updateMediaLog`. `API_URL` permanece definido en ese archivo desde la sesión 07:

```ts
import type {
  UpdatedMediaLogDto,
  UpdateMediaLogInput,
} from "../types/media-api"
import { requestJsonWithAuth } from "./http"

export function updateMediaLog({
  logId,
  body,
}: UpdateMediaLogInput): Promise<UpdatedMediaLogDto> {
  return requestJsonWithAuth<UpdatedMediaLogDto>(
    `${API_URL}/api/v2/media/${encodeURIComponent(logId)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
}
```

### 54–62 · Mutación y coherencia

Pregunta qué lecturas contienen los valores modificados. Respuesta: lista y detalle privado.

Ambas familias quedan stale. `invalidateQueries` vuelve a consultar de inmediato solo las coincidencias activas por defecto. Mientras la persona está en `/app/library/:logId`, el detalle está activo; la lista normalmente está inactiva y hará refetch cuando vuelva a montarse al regresar a `/app/library`.

En `src/hooks/features/use-media.ts`, conserva los hooks existentes y combina los imports requeridos por esta porción:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateMediaLog } from "../../api/media"
import { mediaKeys } from "../media-keys"

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

No añadas `mediaKeys.searches()`: la actualización no cambia catálogo ni `isLogged`. No extraigas un helper genérico con solo POST y PUT como consumidores.

Verbaliza el timeline:

```text
submit
  → PUT pending
  → 200
  → marcar list + detail como stale
  → esperar refetch del detail activo
  → onSuccess del wrapper
  → cerrar modal
  → al volver a library, refetch de la lista stale
```

## 62–76 · Montar edición y representar estados

### 62–69 · Wrapper

Crea primero `src/lib/media-log-errors.ts`. El editor importa este traductor para mostrar los errores de actualización:

```ts
import { ApiError } from "../api/http"

export function getUpdateMediaLogErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Ocurrió un error inesperado. Intenta nuevamente."
  }

  switch (error.status) {
    case 400:
      return "Revisa los valores antes de guardar."
    case 401:
      return "La sesión no pudo autorizar la actualización."
    case 404:
      return "No encontramos ese registro en tu biblioteca."
    default:
      return "No pudimos guardar los cambios. Intenta nuevamente."
  }
}
```

Crea `src/components/edit-media-log-form.tsx`. Define las props antes del componente e importa el traductor compartido:

```tsx
import { toUpdateMediaLogBody } from "../adapters/media-log-form-to-update-body"
import { toMediaLogFormValues } from "../adapters/user-media-to-form-values"
import { useUpdateMediaLog } from "../hooks/features/use-media"
import { getUpdateMediaLogErrorMessage } from "../lib/media-log-errors"
import type { MediaLogFormValues } from "../schemas/media-log"
import type { UserMediaDataDto } from "../types/media-api"
import { MediaLogForm } from "./media-log-form"

type EditMediaLogFormProps = {
  entry: UserMediaDataDto
  onUpdated: () => void
  onCancel: () => void
}

export function EditMediaLogForm({
  entry,
  onUpdated,
  onCancel,
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
      initialValues={initialValues}
      submitLabel="Guardar cambios"
      isPending={updateMutation.isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  )
}
```

El traductor anterior aplica:

| Caso | Mensaje |
| ---: | --- |
| `400` | Revisa los valores antes de guardar. |
| `401` | La sesión no pudo autorizar la actualización. |
| `404` | No encontramos ese registro en tu biblioteca. |
| Otro | No pudimos guardar los cambios. Intenta nuevamente. |

No cierres el modal en `onError` y no llames `reset()` automáticamente.

### 69–76 · Modal privado

En `PrivateMediaDetailPage`, añade estado local:

```ts
const [isEditOpen, setIsEditOpen] = useState(false)
```

El estado es local porque solo esta página abre este editor. No amplíes Zustand.

Monta:

```tsx
<Button onClick={() => setIsEditOpen(true)}>Editar</Button>

<Modal
  opened={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  title="Editar entrada"
>
  {isEditOpen && entry ? (
    <EditMediaLogForm
      key={entry.id}
      entry={entry}
      onUpdated={() => setIsEditOpen(false)}
      onCancel={() => setIsEditOpen(false)}
    />
  ) : null}
</Modal>
```

El botón Cancelar del formulario permanece deshabilitado durante pending. No eleves ni dupliques mutation state en la página solo para configurar el modal.

La transformación termina con esta referencia completa de `src/pages/private-media-detail-page.tsx`. Conserva los guards y retries de la sesión 14, define `entry` después de comprobar que existe y muestra el consumidor real de `EditMediaLogForm`:

```tsx
import { useState } from "react"
import { Alert, Button, Group, Modal, Stack } from "@mantine/core"
import { Link, useParams } from "react-router"

import { mediaCatalogDetailToModel } from "../adapters/media-catalog-detail-to-model"
import { toLibraryLogDetailSelector } from "../adapters/library-log-param-to-detail-selector"
import { toSavedMediaDetailsModel } from "../adapters/user-media-to-saved-details"
import { ApiError } from "../api/http"
import { EditMediaLogForm } from "../components/edit-media-log-form"
import { MediaDetailContent } from "../components/media-detail-content"
import { MediaDocumentTitle } from "../components/media-document-title"
import { PageState } from "../components/page-state"
import { SavedMediaDetails } from "../components/saved-media-details"
import { useMediaDetail } from "../hooks/features/use-media"

function getPrivateDetailErrorMessage(error: Error): string {
  if (!(error instanceof ApiError)) {
    return "No pudimos cargar el detalle. Intenta nuevamente."
  }

  if (error.status === 401) {
    return "No pudimos autorizar esta consulta."
  }

  if (error.status === 404) {
    return "No encontramos ese registro en tu biblioteca."
  }

  return "No pudimos cargar el detalle. Intenta nuevamente."
}

export function PrivateMediaDetailPage() {
  const { logId } = useParams<"logId">()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const detailSelector = toLibraryLogDetailSelector(logId)
  const detailQuery = useMediaDetail(detailSelector)

  if (detailSelector === null) {
    return (
      <PageState
        variant="invalid"
        description="La URL no contiene un registro válido."
      />
    )
  }

  if (detailQuery.isError) {
    return (
      <PageState
        variant="error"
        title="No pudimos cargar el detalle"
        description={getPrivateDetailErrorMessage(detailQuery.error)}
        onRetry={() => void detailQuery.refetch()}
      />
    )
  }

  if (!detailQuery.isSuccess) {
    return (
      <PageState
        variant="loading"
        title="Cargando detalle"
        description="Espera mientras recuperamos tu registro."
      />
    )
  }

  if (detailQuery.data.entry === null) {
    return (
      <PageState
        variant="unavailable"
        title="Registro no disponible"
        description="No pudimos leer los datos guardados. Vuelve a tu biblioteca."
        onRetry={() => void detailQuery.refetch()}
      />
    )
  }

  const entry = detailQuery.data.entry
  const savedDetails = toSavedMediaDetailsModel(entry)
  const catalogDetails = detailQuery.data.catalog
    ? mediaCatalogDetailToModel(detailQuery.data.catalog)
    : null
  const documentTitle = catalogDetails?.title ?? savedDetails.title

  function closeEdit() {
    setIsEditOpen(false)
  }

  return (
    <Stack gap="xl">
      <MediaDocumentTitle title={documentTitle} />

      {catalogDetails === null ? (
        <Alert color="gray" title="Catálogo no disponible">
          Mostramos los datos personales conservados para este registro.
        </Alert>
      ) : (
        <MediaDetailContent model={catalogDetails} />
      )}

      <SavedMediaDetails details={savedDetails} />

      <Group>
        <Button onClick={() => setIsEditOpen(true)}>
          Editar mis datos
        </Button>
        <Button component={Link} to="/app/library" variant="subtle">
          Volver a la biblioteca
        </Button>
      </Group>

      <Modal
        opened={isEditOpen}
        onClose={closeEdit}
        title="Editar entrada"
      >
        {isEditOpen ? (
          <EditMediaLogForm
            key={entry.id}
            entry={entry}
            onUpdated={closeEdit}
            onCancel={closeEdit}
          />
        ) : null}
      </Modal>
    </Stack>
  )
}
```

`entry` ya no es nullable después del guard. La `key` identifica la instancia completa del editor y `form.key(field)` continúa encapsulada dentro de `MediaLogForm`.

Comprueba:

1. abre y observa los values de `entry`;
2. cambia status y notas;
3. reset vuelve al snapshot;
4. guarda y observa PUT;
5. modal permanece durante invalidación y refetch del detalle activo;
6. detalle refleja el servidor y la lista queda stale hasta regresar;
7. fuerza error y conserva values;
8. cancela y reabre para obtener el snapshot vigente.

## 76–84 · Trabajo con agente

La persona ya debe haber implementado y explicado ambos adapters. Define la matriz:

| Caso | Resultado |
| --- | --- |
| entry con `notes: null` | values con `notes: ""` |
| entry con notas | values conservados |
| values con `"  pendiente  "` | body con `"pendiente"` |
| values con `"   "` | body con `null` |
| values normales | body exacto de tres campos |

Prompt:

```text
Punto de entrada: toMediaLogFormValues y toUpdateMediaLogBody ya están
implementados y la persona definió la matriz de casos mostrada arriba.

Usa la skill ahk-test. Crea y ejecuta tests Vitest que comprueben únicamente
esa matriz. La fuente del comportamiento esperado son los dos adapters y la
matriz aprobada por la persona.

Único archivo que puedes crear o modificar:
- src/adapters/__tests__/media-log-form-edit-adapters.test.ts

Mantén producción, package.json, configuración, dependencias y cualquier otro
archivo en solo lectura. No crees fixtures, builders, helpers ni otros archivos.
No uses DOM, Mantine, Firebase, Query Client, mocks HTTP o snapshots. No cambies
ni debilites una expectativa para obtener verde.

Ejecuta pnpm test -- media-log-form-edit-adapters. Detente y pregunta si el
comportamiento real contradice la matriz, si el comando no existe o si necesitas
tocar otro archivo.

Entrega: matriz cubierta, archivo modificado, exit status completo y una lectura
posterior con imports, flujo, decisiones, supuestos y frontera de evidencia.
```

Después:

1. lee imports, casos y expectativas;
2. confirma que no reimplementa los adapters;
3. revisa el diff del único archivo permitido;
4. ejecuta el test dirigido;
5. explica su frontera de evidencia.

Si aparece soporte fuera de `__tests__/`, rechaza ese cambio.

Si el agente tarda o falla, continúa con el archivo de test preparado en el checkpoint de rescate, léelo con el grupo y ejecuta el mismo comando. No presentes una suite no ejecutada como evidencia ni permitas que la contingencia decida otra matriz.

## 84–90 · Evidencia y cierre

Ejecuta:

```bash
pnpm test -- media-log-form-edit-adapters
pnpm build
```

Exige códigos de salida completos. Después completa:

```text
Test puro demuestra:
Network demuestra:
Query Devtools demuestra:
Navegador demuestra:
Build demuestra:
Todavía no demostramos:
```

Respuesta esperada:

- test: transformaciones puras entre DTO, values y body;
- Network: PUT, body mínimo y Bearer observados;
- Devtools: lista y detalle stale, refetch inmediato del detalle activo y refetch de la lista al volver a montarla;
- navegador: snapshot, reset, error, pending y cierre;
- build: tipado y empaquetado;
- pendiente: DELETE, producción y concurrencia real.

Cierra con C, R y U marcados. La sesión 16 añadirá DELETE y recién entonces evaluará extraer la política de invalidaciones.

## Verificación guiada completa

1. Ejecuta creación desde búsqueda después del refactor.
2. Ejecuta creación desde detalle público.
3. Abre un registro con notas y comprueba initial values.
4. Abre un registro sin notas y observa textarea vacío.
5. Cambia los tres campos y usa reset.
6. Cancela, reabre y confirma el snapshot vigente.
7. Guarda y observa un único PUT con Bearer.
8. Confirma que el JSON contiene solo status, prioridad y notas.
9. Guarda notas vacías y observa `null`.
10. Observa `isPending` y cierre bloqueado.
11. Confirma invalidación de lista y detalle, no búsqueda.
12. Confirma que el modal cierra después del refetch del detalle activo.
13. Vuelve a biblioteca, observa el refetch de la lista stale y confirma los nuevos labels.
14. Fuerza `400`, `401`, `404` y error general.
15. Confirma que cada error conserva modal y values.
16. Cambia a otro `logId` y observa otro snapshot.
17. Ejecuta test dirigido y build con código 0.

## Errores previsibles

| Error | Pregunta de corrección | Resultado esperado |
| --- | --- | --- |
| Duplicar el formulario | ¿Qué mecanismo ya tiene dos consumidores? | Extraer campos y form una vez |
| `mode` con props opcionales | ¿Qué combinaciones puede construir el tipo? | Wrappers con props completas |
| Mutation dentro del form común | ¿POST y PUT tienen la misma identidad? | Side effects en wrappers |
| Effect copia `entry` | ¿Cuándo existe el snapshot? | Montaje condicional e initial values |
| `form.key` recibe `entry.id` | ¿La key pertenece a input o registro? | `form.key(field)` y `key={entry.id}` separados |
| Reset cierra modal | ¿Restaurar y terminar son lo mismo? | Reset local; cancelar desmonta |
| Body reenvía el DTO | ¿Qué campos puede editar esta pantalla? | Tres campos personales |
| Notas vacías quedan `""` | ¿Cómo expresa ausencia el API? | `null` en el adapter |
| PUT usa optional auth | ¿El registro es privado? | Helper con Bearer obligatorio |
| Se invalida búsqueda | ¿Cambió catálogo o `isLogged`? | Solo lista y detalle |
| Modal cierra al recibir 200 | ¿Terminó la lectura activa? | Esperar ambas invalidaciones y el refetch del detalle activo |
| Error ejecuta reset | ¿Debe perderse el trabajo local? | Conservar values |
| Helper genérico inmediato | ¿Existe un tercer consumidor? | Bloque explícito hasta DELETE |
| Test fuera de `__tests__` | ¿El soporte tiene otro consumidor? | Mover todo a `__tests__/` |

## Actividades opcionales

Solo si el checkpoint base está completo:

- añadir un contador derivado de caracteres para notas;
- mostrar un texto discreto durante refetch posterior al PUT;
- cambiar entre dos registros y explicar el remount en React DevTools.

No califiques estas mejoras ni permitas que sustituyan los casos base.

## Fuentes docentes

- [Mantine Form · Values](https://mantine.dev/form/values/)
- [Mantine Form · Uncontrolled mode](https://mantine.dev/form/uncontrolled/)
- [React · Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [TanStack Query v5 · `useMutation`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
- [TanStack Query v5 · Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)

Context7 MCP se consultó de nuevo el 7 de septiembre de 2026 empezando por `resolve-library-id`. Confirmó `form.key(field)` en modo uncontrolled, `schemaResolver(schema, { sync: true })`, el reset a `initialValues` con limpieza de errores, el reinicio de estado al cambiar la key y el orden de callbacks de mutación. TanStack Query espera la Promise del `onSuccess` del hook antes del callback específico de `mutate`; `isPending` permanece activo durante esa espera. El paquete publicado de `@mantine/form@9.4.1` confirma el resolver, la key de campo y el reset con React `^19.2.0`. La documentación web vigente corresponde a Mantine Form `9.6.0`; el curso conserva `9.4.1`. El índice Mintlify no expuso una herramienta invocable durante esta revisión. El seed futuro sigue siendo necesario para acreditar ejecución integrada.

## Fuera de alcance docente

- DELETE, confirmación y navegación posterior.
- Helper genérico de invalidaciones.
- Edición de título o metadata.
- Store global para el editor.
- Tests de componentes o red.
- Cambios en el backend.
