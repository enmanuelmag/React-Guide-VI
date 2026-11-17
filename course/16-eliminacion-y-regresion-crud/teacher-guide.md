# Guía docente · Sesión 16 · Eliminación y regresión CRUD

- **Semana:** 7
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)

## Archivo de hooks de esta sesión

Añade `useDeleteMediaLog`; reutiliza el helper de `src/hooks/invalidation-utils.ts` desde `../invalidation-utils`. Los hooks de Media se definen en `src/hooks/features/use-media.ts`; el helper permanece en su archivo propio. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Contratos heredados disponibles

Parte de las referencias finales de la [sesión 15](../15-edicion-y-reutilizacion/teacher-guide.md):

- **“26–36 · Reconstruir creación”** deja `CreateMediaLogForm` como wrapper completo;
- **“48–62 · Conectar PUT e invalidaciones”** define `UPDATE_MEDIA_LOG_INVALIDATION_KEYS`, `updateMediaLog` y `useUpdateMediaLog`;
- **“62–76 · Montar edición”** deja `EditMediaLogForm` y `PrivateMediaDetailPage` completos;
- la sesión 13 ya había ampliado `CREATE_MEDIA_LOG_INVALIDATION_KEYS()` con `searches()`, `details()` y `lists()`.

`ApiError` y `requestJsonWithAuth` continúan en `src/api/http.ts`. Esta sesión reutiliza esos contratos y muestra la transformación final de las mutaciones; no crea copias locales.

## Objetivo

Guiar al grupo desde Create, Read y Update completos hasta una eliminación pesimista que confirme la identidad, espere la consistencia de caché y abandone el detalle destruido sin provocar un `404` transitorio.

La dificultad principal es coordinar el recorrido destructivo. Mantén la escritura manual de caché fuera de esta sesión.

## Preparación docente

1. Parte del checkpoint completo de la sesión 15.
2. Crea con tu cuenta una película y una serie descartables.
3. Comprueba crear, listar, abrir detalle y editar antes de comenzar.
4. Confirma que `entry.id` está disponible como `logId` en el detalle privado.
5. Confirma que el selector del detalle continúa derivado de `mediaDetailSelectorSchema`; esta clase no lo redeclara.
6. Abre Query Devtools y Network.
7. Prepara una forma segura de provocar un error de red sin exponer tokens.
8. Confirma que `pnpm test -- delete-media-log-error-message` y `pnpm build` son comandos válidos en el futuro seed.
9. Conserva un checkpoint de rescate con DTO, fetcher, helper y plan terminados; no incluyas diálogo ni integración de página.
10. Verifica que el seed no contiene ids fijos, credenciales o registros de otra persona.
11. No instales dependencias ni modifiques el backend durante la clase.

## Fuentes y versiones verificadas

- TanStack Query `5.102.8`: `invalidateQueries`, `refetchType` y callbacks de mutación que esperan promesas.
- React Router `8.3.1`: `useNavigate` y `replace: true` en modo declarativo.
- Mantine Core `9.4.1`: Modal controlado y opciones de cierre.
- Backend docente: `DELETE /api/v2/media/:id`, Bearer, sin body y respuesta `{ message: "entry deleted" }`.

Context7 se consultó de nuevo el 7 de septiembre de 2026 empezando por `resolve-library-id`. Confirmó que `invalidateQueries` acepta `refetchType: "active" | "none"`, que su Promise espera el refetch seleccionado, que `navigate(path, { replace: true })` reemplaza la entrada actual y que Mantine Modal permite controlar Escape, click exterior y botón de cierre. Los paquetes publicados confirmaron TanStack Query `5.102.8`, React Router `8.3.1` y los props usados por Mantine Core `9.4.1`; la documentación web vigente de Mantine corresponde a `9.6.0`, pero el curso conserva `9.4.1`. El índice Mintlify no expuso una herramienta invocable durante esta revisión. El seed futuro sigue siendo necesario para acreditar la integración exacta.

## Contrato docente

```text
DELETE /api/v2/media/:id
Authorization: Bearer <Firebase ID token>
```

El path recibe el `logId` personal. El request no envía body, `userId` ni un token construido manualmente.

```ts
export type DeleteMediaLogResponseDto = {
  message: "entry deleted"
}
```

El backend limita la eliminación a una entrada activa de la sesión autenticada. Una entrada inexistente, ajena o ya eliminada produce `404`. El producto del curso no implementa restauración.

## Clave de lectura previa

| Pregunta | Respuesta | Justificación breve | Fuente |
| ---: | --- | --- | --- |
| 1 | B | `invalidateQueries` marca como desactualizadas las queries que coinciden. | TanStack Query, `QueryClient.invalidateQueries` |
| 2 | A | `refetchType: "none"` las marca como desactualizadas sin volver a pedir sus datos. | TanStack Query, `refetchType` |
| 3 | B | Por defecto, la invalidación vuelve a consultar las queries activas que coinciden. | TanStack Query, `invalidateQueries` |
| 4 | Verdadero | `useNavigate` devuelve una función para navegar desde el código. | React Router, `useNavigate` |
| 5 | C | `replace: true` reemplaza la entrada actual del historial por la nueva ruta. | React Router, opción `replace` |

Recupera primero las preguntas 2 y 5. Pide que el estudiante relacione cada respuesta con la ruta privada abierta, sin mostrar todavía el handler final.

## Mapa de responsabilidades

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `DeleteMediaDialog` | Presentar advertencia, error y acciones | No conoce `logId` ni hooks de datos |
| `SavedMediaDetails` | Exponer la intención `onDelete` | No ejecuta la mutación |
| `PrivateMediaDetailPage` | Poseer apertura, `entry`, mutación y navegación | No crea headers ni invalida directamente |
| `deleteMediaLog` | Ejecutar DELETE autenticado | No cambia UI ni caché |
| `useDeleteMediaLog` | Aplicar mutación y plan de invalidación | No decide la ruta siguiente |
| `invalidateQueriesByKeys` | Ejecutar la misma mecánica para varias keys | No conoce familias Media |
| `getDeleteMediaLogErrorMessage` | Traducir status a mensajes locales | No navega ni cierra sesión |

## Secuencia docente · 90 minutos

### 0–10 · Recuperar C, R y U

Abre búsqueda, biblioteca, detalle privado y edición. Pide al grupo que complete:

| Operación | Identidad | Método |
| --- | --- | --- |
| Crear desde catálogo | `mediaType + externalId` | POST |
| Leer registro privado | `logId` | GET |
| Editar registro privado | `logId` | PUT |
| Eliminar registro privado | `logId` | DELETE |

Preguntas:

- ¿Qué dato reconoce la persona dentro de una confirmación?
  - Respuesta esperada: el título.
- ¿Qué dato exige el endpoint?
  - Respuesta esperada: `entry.id` como `logId`.
- ¿Qué aporta Firebase?
  - Respuesta esperada: la identidad autenticada mediante el ID token.

Checkpoint: el grupo no propone `externalId`, título o `userId` como path de DELETE.

### 10–22 · Definir el recorrido destructivo

Presenta estas dos secuencias:

```text
incorrecta
clic → DELETE → quizá preguntar después

aprobada
clic → diálogo → cancelar o confirmar → DELETE
```

Aclara que la confirmación reduce errores accidentales. El servidor sigue siendo responsable de autenticar y autorizar.

Dibuja el estado de la pantalla:

```text
detalle privado activo
  ├── entry.id para transporte
  ├── catalog.title para mensaje
  └── query de detalle con observer activo
```

Pregunta:

> Si DELETE responde `200`, ¿qué ocurriría si la query activa solicita otra vez el mismo `logId` antes de navegar?

Respuesta esperada: el servidor respondería `404` porque el registro ya no está activo.

Checkpoint: el grupo formula el problema de caché antes de ver `refetchType: "none"`.

### 22–36 · Construir contrato, fetcher y errores

#### 22–27 · Tipo y fetcher

Añade a `src/types/media-api.ts`:

```ts
export type DeleteMediaLogResponseDto = {
  message: "entry deleted"
}
```

Añade a `src/api/media.ts`. Combina estos imports con los fetchers existentes y conserva `API_URL`, definido en ese archivo desde la sesión 07:

```ts
import type { DeleteMediaLogResponseDto } from "../types/media-api"
import { requestJsonWithAuth } from "./http"

export function deleteMediaLog(
  logId: string,
): Promise<DeleteMediaLogResponseDto> {
  return requestJsonWithAuth<DeleteMediaLogResponseDto>(
    `${API_URL}/api/v2/media/${encodeURIComponent(logId)}`,
    { method: "DELETE" },
  )
}
```

Pregunta qué opciones no aparecen. Respuestas esperadas: no hay body, `Content-Type`, `userId` ni header Bearer manual. `requestJsonWithAuth` obtiene el token en el momento del request.

No ejecutes el fetcher con un id escrito a mano.

#### 27–32 · Traductor de errores

Crea `src/lib/delete-media-log-error-message.ts`:

```ts
import { ApiError } from "../api/http"

export function getDeleteMediaLogErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return "Tu sesión no pudo autorizar la eliminación. Vuelve a iniciar sesión."
  }

  if (error instanceof ApiError && error.status === 404) {
    return "Este registro ya no existe o no está disponible para tu sesión."
  }

  return "No pudimos eliminar el registro. Revisa tu conexión e inténtalo otra vez."
}
```

El mensaje `404` no afirma cuál de las causas ocurrió. El servidor puede ocultar si el registro pertenece a otra persona.

#### 32–36 · Hook inicial

Crea el esqueleto de `useDeleteMediaLog` con `mutationFn: deleteMediaLog`. Todavía no agregues `onSuccess`.

Checkpoint:

- TypeScript reconoce el input `string`.
- El hook expone `isPending`, `isError`, `error`, `reset` y `mutate`.
- No existe un `useState` paralelo para loading.

### 36–48 · Extraer el helper y decidir la caché

#### 36–41 · Observar la tercera repetición

Coloca juntos los `onSuccess` de create y update. Pide al grupo que marque:

- mecánica repetida: `Promise.all`, recorrido y `invalidateQueries`;
- decisión variable: las familias seleccionadas.

Crea `src/hooks/invalidation-utils.ts`:

```ts
import type { QueryClient } from "@tanstack/react-query"

type QueryKeyGroup = readonly (readonly unknown[])[]
type RefetchMode = "active" | "none"

export async function invalidateQueriesByKeys(
  queryClient: QueryClient,
  queryKeys: QueryKeyGroup,
  refetchType: RefetchMode = "active",
): Promise<void> {
  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey, refetchType }),
    ),
  )
}
```

Migra create y update al helper. Conserva sus constantes y familias. La referencia acumulada de las tres mutaciones aparece después de definir el plan de DELETE; no dejes esta migración solo como instrucción verbal. Ejecuta una regresión breve o usa el checkpoint docente si el tiempo no permite Network real.

#### 41–45 · Clasificar familias

Completa con el grupo:

| Familia | Consecuencia de DELETE |
| --- | --- |
| `lists()` | El registro debe desaparecer de la biblioteca |
| `searches()` | `isLogged` debe volver a `false` |
| `details()` | El detalle privado activo deja de existir |

Declara:

```ts
export const DELETE_MEDIA_LOG_INVALIDATION_PLAN = () => ({
  refetch: [mediaKeys.lists(), mediaKeys.searches()],
  staleOnly: [mediaKeys.details()],
})
```

Aclara que el grupo `refetch` usa comportamiento normal. Las queries inactivas quedan stale; TanStack Query no ejecuta un request solo por el nombre de la propiedad.

#### 45–48 · Completar el hook

La porción final de mutaciones en `src/hooks/features/use-media.ts` muestra la propagación real. Combina estos imports con los hooks de lectura existentes:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createMediaLog,
  deleteMediaLog,
  updateMediaLog,
} from "../../api/media"
import { invalidateQueriesByKeys } from "../invalidation-utils"
import { mediaKeys } from "../media-keys"

export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
  mediaKeys.lists(),
]

export const UPDATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.lists(),
  mediaKeys.details(),
]

export const DELETE_MEDIA_LOG_INVALIDATION_PLAN = () => ({
  refetch: [mediaKeys.lists(), mediaKeys.searches()],
  staleOnly: [mediaKeys.details()],
})

export function useCreateMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMediaLog,
    onSuccess: () =>
      invalidateQueriesByKeys(
        queryClient,
        CREATE_MEDIA_LOG_INVALIDATION_KEYS(),
      ),
  })
}

export function useUpdateMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMediaLog,
    onSuccess: () =>
      invalidateQueriesByKeys(
        queryClient,
        UPDATE_MEDIA_LOG_INVALIDATION_KEYS(),
      ),
  })
}

export function useDeleteMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMediaLog,
    onSuccess: async () => {
      const plan = DELETE_MEDIA_LOG_INVALIDATION_PLAN()

      await Promise.all([
        invalidateQueriesByKeys(queryClient, plan.refetch),
        invalidateQueriesByKeys(queryClient, plan.staleOnly, "none"),
      ])
    },
  })
}
```

Create y update conservan exactamente sus familias. El helper reemplaza solo `Promise.all + map + invalidateQueries`; cada mutación sigue decidiendo qué datos cambian.

Pregunta por qué el hook no navega. Respuesta esperada: administra consistencia remota; la página decide la consecuencia visual.

### 48–61 · Construir el diálogo controlado

Crea `src/components/delete-media-dialog.tsx`. La referencia completa define imports, props, función exportada y la guardia de cierre antes de usar sus valores:

```tsx
import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core"

type DeleteMediaDialogProps = {
  opened: boolean
  mediaTitle: string
  isPending: boolean
  errorMessage: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteMediaDialog({
  opened,
  mediaTitle,
  isPending,
  errorMessage,
  onCancel,
  onConfirm,
}: DeleteMediaDialogProps) {
  function handleClose() {
    if (!isPending) onCancel()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Eliminar de mi biblioteca"
      closeOnClickOutside={!isPending}
      closeOnEscape={!isPending}
      withCloseButton={!isPending}
    >
      <Stack gap="md">
        <Text>
          “{mediaTitle}” se eliminará de tu biblioteca. La aplicación no
          permite deshacer esta acción.
        </Text>

        {errorMessage !== null ? (
          <Alert color="red">{errorMessage}</Alert>
        ) : null}

        <Group justify="flex-end">
          <Button
            type="button"
            variant="default"
            disabled={isPending}
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            color="red"
            loading={isPending}
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
```

Preguntas:

- ¿Por qué el diálogo recibe el título y no el DTO completo?
  - Respuesta: solo necesita una identidad visible.
- ¿Por qué `onCancel` mantiene una guardia en la página si el Modal ya bloquea cierres comunes?
  - Respuesta: el propietario del estado también protege su transición.

Checkpoint: el diálogo no importa API, Query, Router, Firebase o store.

### 61–75 · Integrar la página

#### 61–65 · Exponer la intención

En `src/components/saved-media-details.tsx`, amplía el contrato heredado con `onDelete`. La referencia final conserva la lectura y añade un consumidor visible del callback:

```tsx
import { Button, Stack, Text } from "@mantine/core"

import type { SavedMediaDetailsModel } from "../types/saved-media-details"

type SavedMediaDetailsProps = {
  details: SavedMediaDetailsModel
  onDelete: () => void
}

export function SavedMediaDetails({
  details,
  onDelete,
}: SavedMediaDetailsProps) {
  return (
    <Stack gap="sm">
      <Text>
        <strong>Status:</strong> {details.statusLabel}
      </Text>
      <Text>
        <strong>Prioridad:</strong> {details.priorityLabel}
      </Text>
      <Text style={{ whiteSpace: "pre-wrap" }}>
        <strong>Notas:</strong> {details.notes ?? "Sin notas"}
      </Text>
      <Button color="red" onClick={onDelete} type="button" variant="subtle">
        Eliminar de mi biblioteca
      </Button>
    </Stack>
  )
}
```

El botón emite la intención. `SavedMediaDetails` no recibe `logId`, Query Client o mutation object.

#### 65–69 · Abrir una sesión limpia

```ts
const [isDeleteOpen, setIsDeleteOpen] = useState(false)
const deleteMutation = useDeleteMediaLog()

function handleOpenDelete() {
  deleteMutation.reset()
  setIsDeleteOpen(true)
}

function handleCancelDelete() {
  if (deleteMutation.isPending) return
  setIsDeleteOpen(false)
}
```

`reset()` limpia el estado de la mutación. No restaura datos del servidor.

#### 69–72 · Confirmar y navegar

```ts
const navigate = useNavigate()

function handleConfirmDelete() {
  if (entry === null || deleteMutation.isPending) return

  deleteMutation.mutate(entry.id, {
    onSuccess: () => {
      navigate("/app/library", { replace: true })
    },
  })
}
```

TanStack Query ejecuta primero el `onSuccess` del hook y espera su promesa. Luego ejecuta el callback específico de `mutate`.

No llames `setIsDeleteOpen(false)` en éxito. La navegación desmonta la página.

#### 72–75 · Integrar error y props

```tsx
<DeleteMediaDialog
  opened={isDeleteOpen}
  mediaTitle={mediaTitle}
  isPending={deleteMutation.isPending}
  errorMessage={
    deleteMutation.isError
      ? getDeleteMediaLogErrorMessage(deleteMutation.error)
      : null
  }
  onCancel={handleCancelDelete}
  onConfirm={handleConfirmDelete}
/>
```

La transformación termina con esta referencia completa de `src/pages/private-media-detail-page.tsx`. Mantiene edición, estados y retries; además muestra de dónde salen `entry`, `mediaTitle`, la mutación y la navegación:

```tsx
import { useState } from "react"
import { Alert, Button, Group, Modal, Stack } from "@mantine/core"
import { Link, useNavigate, useParams } from "react-router"

import { mediaCatalogDetailToModel } from "../adapters/media-catalog-detail-to-model"
import { toLibraryLogDetailSelector } from "../adapters/library-log-param-to-detail-selector"
import { toSavedMediaDetailsModel } from "../adapters/user-media-to-saved-details"
import { ApiError } from "../api/http"
import { DeleteMediaDialog } from "../components/delete-media-dialog"
import { EditMediaLogForm } from "../components/edit-media-log-form"
import { MediaDetailContent } from "../components/media-detail-content"
import { MediaDocumentTitle } from "../components/media-document-title"
import { PageState } from "../components/page-state"
import { SavedMediaDetails } from "../components/saved-media-details"
import {
  useDeleteMediaLog,
  useMediaDetail,
} from "../hooks/features/use-media"
import { getDeleteMediaLogErrorMessage } from "../lib/delete-media-log-error-message"

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
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const detailSelector = toLibraryLogDetailSelector(logId)
  const detailQuery = useMediaDetail(detailSelector)
  const deleteMutation = useDeleteMediaLog()

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
  const mediaTitle = catalogDetails?.title ?? savedDetails.title
  const deleteErrorMessage = deleteMutation.isError
    ? getDeleteMediaLogErrorMessage(deleteMutation.error)
    : null

  function closeEdit() {
    setIsEditOpen(false)
  }

  function handleOpenDelete() {
    deleteMutation.reset()
    setIsDeleteOpen(true)
  }

  function handleCancelDelete() {
    if (deleteMutation.isPending) return
    setIsDeleteOpen(false)
  }

  function handleConfirmDelete() {
    if (deleteMutation.isPending) return

    deleteMutation.mutate(entry.id, {
      onSuccess: () => {
        navigate("/app/library", { replace: true })
      },
    })
  }

  return (
    <Stack gap="xl">
      <MediaDocumentTitle title={mediaTitle} />

      {catalogDetails === null ? (
        <Alert color="gray" title="Catálogo no disponible">
          Mostramos los datos personales conservados para este registro.
        </Alert>
      ) : (
        <MediaDetailContent model={catalogDetails} />
      )}

      <SavedMediaDetails
        details={savedDetails}
        onDelete={handleOpenDelete}
      />

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

      <DeleteMediaDialog
        opened={isDeleteOpen}
        mediaTitle={mediaTitle}
        isPending={deleteMutation.isPending}
        errorMessage={deleteErrorMessage}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  )
}
```

Los hooks se ejecutan antes de los returns condicionales. Después del guard, `entry` ya no es nullable; por eso el handler final solo protege el doble envío. El diálogo conserva el retry natural: tras un error permanece abierto y el botón Eliminar puede ejecutar otra mutación.

Checkpoint:

- Cancelar no ejecuta request.
- Confirmar usa el `entry.id` real.
- Error conserva diálogo y ruta.
- Éxito navega después del plan de caché.

### 75–83 · Trabajo con agente

#### Decisiones humanas previas

El grupo ya implementó el traductor y fijó tres comportamientos. El agente no decide copy, status o estructura de producción.

La documentación de las librerías ya se consultó. Revisa que `ahk-test` continúe materializada antes de delegar. AutoSkills solo se previsualiza si falta una skill pertinente y el docente reservó tiempo para revisar procedencia y alcance; no instales una sugerencia durante esta actividad breve.

#### Prompt listo para copiar

```text
Usa la skill ahk-test.

Punto de entrada: lee src/lib/delete-media-log-error-message.ts,
src/api/http.ts y los tests Vitest más cercanos dentro de __tests__ antes de
proponer casos.

Objetivo único: crear y ejecutar una suite enfocada de
getDeleteMediaLogErrorMessage(error: unknown).

Fuente del comportamiento: usa exclusivamente esta matriz decidida por el
grupo:
1. ApiError con status 401 produce el mensaje de autorización definido en el
   helper.
2. ApiError con status 404 produce el mensaje de registro no disponible
   definido en el helper.
3. Otro ApiError y un Error normal producen el fallback definido en el helper.

Archivo permitido:
- src/lib/__tests__/delete-media-log-error-message.test.ts

Cambios prohibidos: producción, mensajes, package.json, configuración,
dependencias y otros tests permanecen en solo lectura. No uses DOM, Mantine,
Router, Query Client, Firebase, mocks HTTP o snapshots.

Criterios observables: cada branch de la matriz tiene una expectativa directa,
los casos usan la API pública de ApiError y ningún archivo fuera del alcance
cambia.

Ejecuta: pnpm test -- delete-media-log-error-message

Detente y pregunta si ApiError no puede construirse desde su API pública, si el
helper contradice la matriz o si necesitas modificar otro archivo.

Entrega: matriz propuesta, archivo cambiado, flujo de cada caso, decisiones,
supuestos, límites, comando ejecutado y exit status.
```

#### Revisión humana

El estudiante abre el test y explica:

1. cómo construye cada error;
2. qué branch del helper cubre;
3. por qué el fallback recibe más de un tipo de error;
4. una cosa que la suite no demuestra.

Después ejecuta:

```bash
pnpm test -- delete-media-log-error-message
```

Si el agente tarda o falla, entrega el archivo docente de rescate para el test. El estudiante debe leerlo y ejecutarlo; no recibe crédito de evidencia por copiarlo sin revisión.

### 83–90 · Verificar y cerrar

Ejecuta:

```bash
pnpm test -- delete-media-log-error-message
pnpm build
```

Después recorre con un registro propio:

1. crear;
2. listar;
3. abrir detalle;
4. editar;
5. abrir y cancelar eliminación;
6. reabrir y provocar error;
7. reintentar y confirmar;
8. observar DELETE en Network;
9. comprobar caché y navegación;
10. volver a buscar el catálogo.

Vuelve al deck y responde las cuatro preguntas de cierre de `session-draft.md`.

## Errores frecuentes e intervención

| Error observado | Pregunta docente | Corrección esperada |
| --- | --- | --- |
| El botón ejecuta DELETE | ¿Dónde puede cancelar la persona? | Abrir primero el diálogo |
| El mensaje muestra `entry.id` | ¿Qué identidad reconoce la persona? | Mostrar el título |
| DELETE usa `externalId` | ¿Qué recurso se elimina? | Usar `entry.id` como `logId` |
| El request envía body o `userId` | ¿Qué datos exige el contrato? | Mantener path, método y Bearer |
| Reabrir muestra un error anterior | ¿Cuándo comienza otra confirmación? | Llamar `mutation.reset()` al abrir |
| Existe loading duplicado en `useState` | ¿Qué estado ya entrega la mutación? | Consumir `isPending` |
| Escape cierra durante pending | ¿Dónde verá el resultado? | Bloquear cierre y conservar guardia |
| Se navega al pulsar Confirmar | ¿Existe ya un `200`? | Navegar desde `onSuccess` |
| Se navega desde un Effect | ¿Qué callback conoce esa ejecución? | Usar el callback de `mutate` |
| `details()` se invalida normal | ¿Qué query está activa? | Usar `refetchType: "none"` |
| Se usa `removeQueries` | ¿Qué verá el observer antes de navegar? | Mantener detalle stale hasta desmontar |
| Se usa `queryClient.clear()` | ¿DELETE afecta toda la app? | Invalidar solo las familias requeridas |
| El hook navega | ¿Quién conoce el destino visual? | Dejar navegación en la página |
| Éxito cierra y navega | ¿Qué desmonta la ruta nueva? | Eliminar el cierre redundante |
| Atrás vuelve al detalle eliminado | ¿Se sustituyó la entrada actual? | Usar `replace: true` |
| La búsqueda conserva `isLogged: true` | ¿Qué proyección cambió? | Incluir `searches()` |
| El estudiante retira la fila antes del `200` | ¿El servidor confirmó la eliminación? | Esperar la respuesta antes de actualizar la interfaz |

## Plan de contingencia

### Backend no disponible

- No simules un DELETE exitoso como evidencia remota.
- Recorre código, props, plan de invalidación y orden de callbacks.
- Ejecuta Vitest y build si el proyecto local lo permite.
- Usa una grabación docente previa para mostrar Network y Query Devtools.
- Registra que el recorrido real queda pendiente antes de considerar completo el checkpoint.

### Firebase no autoriza

- Comprueba que la sesión actual funciona con GET y PUT antes de culpar a DELETE.
- No expongas ni copies el token.
- Conserva la respuesta `401` como evidencia del límite, no como éxito.

### El agente no está disponible

- Usa la suite de rescate preparada por el docente.
- Exige lectura y ejecución humana.
- No cambies la matriz de comportamientos ni agregues un test artificial de UI.

### El grupo se retrasa

- Entrega el checkpoint de rescate con DTO, fetcher, helper y plan.
- Conserva para estudiantes el diálogo y la integración de página.
- Retira la delegación si quedan menos de diez minutos y revisa el test después; no sacrifiques el recorrido destructivo.

## Fronteras de evidencia

| Evidencia | Demuestra | No demuestra |
| --- | --- | --- |
| Test del traductor | Mapping de `401`, `404` y fallback | UI, request o caché |
| `pnpm build` | TypeScript y bundling del proyecto | Comportamiento del navegador |
| Network | Método, path, headers, body y respuesta observada | Política completa de caché |
| Query Devtools | Estado de las queries en esa ejecución | Backend futuro o todos los usuarios |
| Recorrido manual | Confirmación, pending, error, navegación e historial observados | Ausencia total de fallas no recorridas |

## Solución docente resumida

```text
SavedMediaDetails.onDelete
  → handleOpenDelete
  → mutation.reset + opened=true
  → DeleteMediaDialog
  → handleConfirmDelete
  → mutate(entry.id)
  → DELETE 200
  → hook invalida lists/searches
  → hook marca details stale sin refetch
  → callback de página navega con replace
  → unmount limpia estado local
```

La solución no usa Effect, store, id fijo, token manual o cambio de backend.
