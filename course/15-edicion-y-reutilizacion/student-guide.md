# Guía estudiantil · Sesión 15 · Edición y reutilización

## Archivo de hooks de esta sesión

Reutiliza las [opciones y conexiones de Mantine Form explicadas en 11](../11-formularios-zod-y-modal-global/student-guide.md#qué-hace-cada-opción): uncontrolled, valores iniciales, resolver síncrono, blur, `form.key`, `getInputProps` y `onSubmit`. Revisa qué callbacks necesita este caso; limpiar el preview con `onValuesChange` pertenecía al body local de 11, no es obligatorio en todos los formularios.

Añade `useUpdateMediaLog`; conserva `useCreateMediaLog` y los hooks de lectura. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Contratos heredados disponibles

- La [sesión 11](../11-formularios-zod-y-modal-global/student-guide.md) define `mediaLogFormSchema`, `MediaLogFormValues` y `toCreateMediaLogBody`.
- La [sesión 13](../13-taller-crear-listar-y-filtrar-biblioteca/student-guide.md) deja `CreateMediaLogForm`, sus props, su traductor de errores y `useCreateMediaLog` completos.
- La [sesión 14](../14-detalle-privado-e-identidades/student-guide.md) deja `UserMediaDataDto`, `SavedMediaDetails` y `PrivateMediaDetailPage` completos.

Importa esos símbolos desde sus archivos. Si falta alguno en el seed, corrige el checkpoint que lo introdujo en lugar de crear una copia.

## Objetivo

Reutilizar status, prioridad y notas entre creación y edición, sin mezclar identidades ni duplicar el formulario. Después conectarás un PUT pesimista que cierra el editor cuando lista y detalle ya reflejan el servidor.

## Punto de partida

Comienza desde el checkpoint completo de la sesión 14:

- crear desde búsqueda y detalle público funciona;
- `CreateMediaLogForm` contiene Mantine Form, schema, campos y mutación;
- `/app/library/:logId` carga una entrada privada;
- `MediaDetailSelector` se deriva en `src/schemas/media-detail.ts` y el adapter ya validó `logId`;
- `entry` contiene `id`, `status`, `priority` y `notes`;
- lista y detalle tienen familias de query keys;
- Vitest está configurado y los tests viven dentro de `__tests__/`.

Antes de editar, crea un medio y abre su detalle privado. Conserva otro registro con values distintos.

## Resultado observable

Desde el detalle privado podrás abrir “Editar mis datos”, modificar status, prioridad y notas, restablecer el snapshot inicial y guardar.

```text
entry
  → initial values
  → MediaLogForm
  → update body
  → PUT autenticado
  → invalidate lista + detalle
  → cerrar
```

Si falla el PUT, el modal permanece abierto y conserva tu trabajo.

## Mapa del trabajo

```text
1. Clasificar responsabilidades
2. Extraer MediaLogForm
3. Recuperar CreateMediaLogForm
4. Crear adapters de edición
5. Conectar PUT e invalidaciones
6. Crear EditMediaLogForm
7. Montar modal y verificar estados
8. Probar adapters y recorrido
```

## 1. Clasifica responsabilidades

Completa antes de mover código:

| Pieza | Identidad | Request | Campos |
| --- | --- | --- | --- |
| Crear | `mediaType + externalId` | POST | Status, prioridad y notas |
| Compartido | Ninguna | Ninguno | Status, prioridad y notas |
| Editar | `logId` | PUT | Status, prioridad y notas |

Comparte únicamente el mecanismo repetido. No diseñes un formulario con `mode`, `entry?` e `identity?`.

## 2. Extrae `MediaLogForm`

Crea `src/components/media-log-form.tsx`. Esta es la referencia completa del componente compartido:

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
          <Button loading={isPending} type="submit">
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
```

Mueve desde creación:

- `useForm` en modo uncontrolled;
- resolver del schema;
- status, prioridad y notas;
- validación;
- error visible;
- Restablecer, Cancelar y submit.

Cada input conserva conexiones equivalentes a:

```tsx
key={form.key("status")}
{...form.getInputProps("status")}
```

La key de Mantine pertenece al input uncontrolled. No recibe `entry.id`.

No muevas:

- identidad de catálogo;
- adapter de creación;
- mutación POST;
- copy específico de error;
- cierre del modal global.

Checkpoint: `MediaLogForm` no importa API, Query, Firebase, Router, store o DTOs.

## 3. Recupera `CreateMediaLogForm`

En `src/components/create-media-log-form.tsx`, declara los defaults con nombre:

```ts
export const CREATE_MEDIA_LOG_INITIAL_VALUES: MediaLogFormValues = {
  status: "pending",
  priority: "medium",
  notes: "",
}
```

Convierte creación en un wrapper que:

1. recibe identidad de catálogo;
2. ejecuta `toCreateMediaLogBody(identity, values)`;
3. llama `useCreateMediaLog`;
4. traduce sus errores;
5. entrega props completas a `MediaLogForm`.

La referencia final de `src/components/create-media-log-form.tsx` es:

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

Prueba antes de continuar:

1. abre desde búsqueda;
2. cambia values;
3. pulsa Restablecer;
4. guarda y observa POST;
5. repite desde detalle público;
6. cancela y abre otra identidad.

No añadas edición mientras exista una regresión de creación.

## 4. Crea adapters de edición

### 4.1 DTO a values

Crea `src/adapters/user-media-to-form-values.ts`:

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

El resultado es el snapshot inicial de esa instancia. No lo guardes en `useState` y no lo sincronices mediante Effect.

### 4.2 Values a body

En `src/types/media-api.ts`, declara el body remoto:

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

Checkpoint:

- el body contiene exactamente tres campos;
- título, fechas, catálogo, userId y logId quedan fuera;
- notas vacías o con espacios producen `null`.

## 5. Distingue reset, cierre y cambio de registro

Usarás tres operaciones:

| Acción | Instancia | Resultado |
| --- | --- | --- |
| `form.reset()` | Se conserva | Vuelve a initial values y limpia errores |
| Cancelar | Se desmonta | Termina esa sesión de edición |
| Cambiar `entry.id` | Se reemplaza | Monta un editor con otro snapshot |

En el modal usarás:

```tsx
<EditMediaLogForm key={entry.id} entry={entry} />
```

No confundas esa key con:

```tsx
<Textarea key={form.key("notes")} />
```

La primera representa el registro. La segunda permite a Mantine actualizar un input uncontrolled.

## 6. Conecta PUT e invalidaciones

En el mismo `src/types/media-api.ts`, añade el input y el resultado consumido:

```ts
export type UpdateMediaLogInput = {
  logId: string
  body: UpdateMediaLogBody
}

export type UpdatedMediaLogDto = {
  id: string
}
```

Implementa `updateMediaLog` con:

```text
PUT /api/v2/media/:logId
Bearer obligatorio
Content-Type: application/json
body mínimo
```

Codifica `logId` antes de colocarlo en la URL.

En `src/api/media.ts`, combina estos imports con los fetchers existentes. `API_URL` ya existe en ese archivo desde la sesión 07:

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

Crea la selección de familias y el hook en `src/hooks/features/use-media.ts`. Combina sus imports con los hooks existentes:

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

No invalides búsquedas públicas. Status, prioridad y notas no cambian catálogo.

No extraigas todavía un helper genérico. DELETE será el tercer consumidor en la sesión 16.

Lista y detalle quedan stale. Por defecto, TanStack Query vuelve a consultar de inmediato solo las queries activas. En la ruta de detalle, el detalle hace refetch antes de cerrar; la lista normalmente está inactiva y hará refetch al regresar a `/app/library`.

## 7. Crea `EditMediaLogForm`

El wrapper recibe:

```ts
type EditMediaLogFormProps = {
  entry: UserMediaDataDto
  onCancel: () => void
  onUpdated: () => void
}
```

Debe:

1. derivar `initialValues` con `toMediaLogFormValues(entry)`;
2. crear la mutación de update;
3. convertir values con `toUpdateMediaLogBody`;
4. usar `entry.id` como `logId` del input remoto;
5. traducir errores;
6. entregar props a `MediaLogForm`.

Define primero el traductor de errores de edición en `src/lib/media-log-errors.ts`:

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

La referencia completa de `src/components/edit-media-log-form.tsx` define las props e importa el traductor antes de usarlo:

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
      errorMessage={errorMessage}
      initialValues={initialValues}
      isPending={updateMutation.isPending}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Guardar cambios"
    />
  )
}
```

No copies `entry` a estado local. Mantine Form conserva los values actuales después del montaje.

El traductor produce estos mensajes:

| Caso | Mensaje |
| ---: | --- |
| `400` | Revisa los valores antes de guardar. |
| `401` | La sesión no pudo autorizar la actualización. |
| `404` | No encontramos ese registro en tu biblioteca. |
| Otro | No pudimos guardar los cambios. Intenta nuevamente. |

Ante error, no ejecutes reset, close o navegación.

## 8. Monta el modal privado

`PrivateMediaDetailPage` es el único punto de apertura, por lo que usa estado local:

```ts
const [isEditOpen, setIsEditOpen] = useState(false)
```

Añade el botón “Editar mis datos” y un `Modal` de Mantine.

Monta el editor solo cuando el modal está abierto y existe `entry`:

```tsx
{isEditOpen && entry !== null ? (
  <EditMediaLogForm
    key={entry.id}
    entry={entry}
    onCancel={() => setIsEditOpen(false)}
    onUpdated={() => setIsEditOpen(false)}
  />
) : null}
```

La referencia final de `src/pages/private-media-detail-page.tsx` conserva todos los estados heredados y añade el consumidor del editor:

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
            onCancel={closeEdit}
            onUpdated={closeEdit}
          />
        ) : null}
      </Modal>
    </Stack>
  )
}
```

Después del guard, `entry` tiene una definición no nullable. El modal conserva `key={entry.id}` y los retries de `error` y `unavailable` siguen disponibles.

No abras el modal antes de la rama exitosa. No pases el DTO por Zustand y no uses un Effect para observar `isSuccess`.

Secuencia de éxito:

```text
submit
→ PUT
→ 200
→ lista y detalle quedan stale
→ refetch del detalle activo
→ termina pending
→ onUpdated
→ cerrar
→ al volver a la biblioteca, refetch de la lista stale
```

## Trabajo con agente

Entrega la suite al agente solo después de implementar y explicar ambos adapters.

Prompt:

```text
Punto de entrada: toMediaLogFormValues y toUpdateMediaLogBody ya están
implementados y la persona definió esta matriz:

Comprueba:
- notes null produce string vacío en form values;
- status y prioridad se preservan;
- notas con contenido se recortan;
- notas vacías o con espacios producen null;
- el body contiene exactamente status, priority y notes.

Usa la skill ahk-test. La fuente del comportamiento esperado son los adapters y
la matriz anterior.

Único archivo que puedes crear o modificar:
- src/adapters/__tests__/media-log-form-edit-adapters.test.ts

Mantén producción, package.json, configuración, dependencias y cualquier otro
archivo en solo lectura. No crees fixtures, builders, helpers ni otros archivos.
No uses DOM, Mantine, Firebase, Query Client, mocks HTTP o snapshots. No cambies
ni debilites una expectativa para obtener verde.

Ejecuta pnpm test -- media-log-form-edit-adapters. Detente y pregunta si el
comportamiento real contradice la matriz, si el comando no existe o si necesitas
tocar otro archivo.

Entrega la matriz cubierta, el archivo modificado, el exit status completo y una
lectura posterior con imports, flujo, decisiones, supuestos y frontera de evidencia.
```

Después:

1. lee el test completo;
2. confirma que las expectativas corresponden a tu matriz;
3. revisa el diff;
4. ejecuta:

```bash
pnpm test -- media-log-form-edit-adapters
```

El test no demuestra formulario, modal, autenticación, invalidación o request.

## Verificación

### Tipos y test puro

```bash
pnpm test -- media-log-form-edit-adapters
pnpm build
```

Registra los códigos de salida. Un output truncado no demuestra éxito.

### Network

Comprueba:

- un solo PUT por submit;
- URL construida con `logId`;
- Bearer presente;
- JSON con solo status, prioridad y notas;
- `notes: null` cuando el textarea queda vacío.

No copies ni publiques el token.

### Query Devtools

Comprueba:

- lista y detalle invalidados;
- refetch del detalle activo;
- cierre después del refetch;
- refetch de la lista stale al volver a `/app/library`;
- búsqueda pública sin invalidación nueva.

### Navegador

Comprueba:

- creación después del refactor;
- values iniciales desde `entry`;
- reset del snapshot;
- cancelar y reabrir;
- pending visible;
- error con values conservados;
- detalle actualizado después de éxito;
- labels nuevos al volver a biblioteca;
- otro snapshot al abrir otro `logId`.

## Evidencia de salida

Entrega:

- código del checkpoint;
- captura del modal con initial values;
- captura de Network sin exponer token;
- captura de lista y detalle en Devtools;
- salida completa del test dirigido;
- salida completa de `pnpm build`;
- explicación de lo que prueba cada evidencia.

Completa:

```text
Test puro demuestra:
Network demuestra:
Query Devtools demuestra:
Navegador demuestra:
Build demuestra:
Todavía no demostramos:
```

## Errores que debes corregir

- Un formulario con `mode` permite combinaciones ambiguas.
- Una mutation dentro de `MediaLogForm` mezcla mecanismo y caso de uso.
- Copiar `entry` mediante Effect crea dos fuentes de verdad.
- Usar `form.key(entry.id)` confunde input y registro.
- Reset y cancelar no representan la misma intención.
- Reenviar el DTO completo amplía el body sin necesidad.
- Notas vacías como `""` contradicen la ausencia remota acordada.
- Optional auth no autoriza una entrada privada.
- Invalidar búsqueda repite requests que no dependen del cambio.
- Cerrar antes del refetch activo puede mostrar el detalle antiguo; la lista stale se actualiza al regresar.
- Reset automático ante error borra trabajo local.
- Un test fuera de `__tests__/` contradice la estructura del proyecto.

## Actividades opcionales

Cuando termines el checkpoint base:

- añade un contador derivado de caracteres para notas;
- muestra background refetch sin ocultar el detalle;
- compara dos `entry.id` en React DevTools.

## Fuera de alcance

- DELETE y confirmación destructiva.
- Navegación después de eliminar.
- Helper genérico de invalidaciones.
- Edición de título, fechas o catálogo.
- Store global para edición.
- React Testing Library, jsdom, MSW o tests de componentes.
- Cambios en el backend.

La sesión 16 comenzará con C, R y U completos. Allí implementarás DELETE y comprobarás el recorrido CRUD antes de extraer una política compartida de invalidación.
