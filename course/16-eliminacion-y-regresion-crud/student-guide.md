# Guía estudiantil · Sesión 16 · Eliminación y regresión CRUD

- **Semana:** 7
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)

## Archivo de hooks de esta sesión

Añade `useDeleteMediaLog`; reutiliza el helper de `src/hooks/invalidation-utils.ts` desde `../invalidation-utils`. Los hooks de Media se definen en `src/hooks/features/use-media.ts`; el helper permanece en su archivo propio. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Contratos heredados disponibles

La [sesión 15](../15-edicion-y-reutilizacion/student-guide.md) deja definidos `MediaLogForm`, ambos wrappers, `updateMediaLog`, `useUpdateMediaLog` y la página privada completa. `CREATE_MEDIA_LOG_INVALIDATION_KEYS()` conserva `searches()`, `details()` y `lists()` desde la sesión 13. `ApiError` y `requestJsonWithAuth` viven en `src/api/http.ts`.

Esta sesión modifica esos archivos. Reutiliza sus contratos y sigue las referencias completas; no declares copias locales.

## Objetivo

Completar el CRUD de tu biblioteca. Añadirás una confirmación de eliminación, ejecutarás DELETE con el `logId` real y coordinarás la caché y la navegación después del éxito.

## Punto de partida

Comienza desde el checkpoint completo de la sesión 15:

- crear desde búsqueda y detalle público funciona;
- `/app/library` lista tus entradas;
- `/app/library/:logId` muestra el detalle privado;
- el selector del detalle continúa derivado de `mediaDetailSelectorSchema` y no se redeclara;
- editar status, prioridad y notas funciona;
- `entry.id` conserva el `logId` personal;
- create y update invalidan familias de query keys;
- `ApiError`, TanStack Query, Router, Mantine y Vitest ya están configurados.

Antes de editar, crea un registro descartable con tu cuenta. Abre su detalle privado y anota el título que muestra la pantalla.

## Resultado observable

```text
abrir diálogo
→ cancelar sin request
→ reabrir y confirmar
→ DELETE por logId
→ actualizar estado de caché
→ navegar a la biblioteca
```

Si falla DELETE, el diálogo permanece abierto y permite reintentar. Después del éxito, Atrás no debe regresar directamente al detalle eliminado.

## Mapa del trabajo

```text
1. Confirmar identidades y contrato
2. Crear respuesta y fetcher DELETE
3. Extraer el helper de invalidación
4. Definir el plan y la mutación
5. Crear el traductor de errores
6. Construir el diálogo
7. Integrar la página y navegar
8. Probar el traductor y recorrer regresión
```

## 1. Confirma identidades y contrato

Completa antes de escribir:

| Dato | Uso |
| --- | --- |
| Título | Mensaje que reconoce la persona |
| `entry.id` | `logId` del path DELETE |
| `catalog.externalId` | Identidad pública; no participa en DELETE |
| Firebase ID token | Identidad autenticada; el cliente la obtiene al ejecutar el request |

Contrato:

```text
DELETE /api/v2/media/:logId
Authorization: Bearer <token actual>
sin body
```

No ejecutes DELETE con un id escrito a mano. Usarás el registro descartable que creaste.

## 2. Crea la respuesta y el fetcher

Añade a `src/types/media-api.ts`:

```ts
export type DeleteMediaLogResponseDto = {
  message: "entry deleted"
}
```

Implementa `deleteMediaLog(logId)` en `src/api/media.ts`. Combina estos imports con los fetchers existentes y conserva `API_URL`:

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

Debe:

- codificar el `logId` antes de colocarlo en la URL;
- usar `requestJsonWithAuth`;
- enviar `method: "DELETE"`;
- devolver `Promise<DeleteMediaLogResponseDto>`.

No debe:

- enviar body;
- declarar `Content-Type` sin contenido;
- enviar `userId`;
- recibir el token como argumento;
- abrir UI o invalidar caché.

Checkpoint: puedes señalar método, path, autenticación y respuesta sin ejecutar todavía la operación destructiva.

## 3. Extrae la mecánica de invalidación

Compara los bloques de éxito de create y update. Ambos recorren varias query keys y esperan `invalidateQueries`.

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

El valor predeterminado será `"active"`.

El helper repite la mecánica. No importa `mediaKeys` y no elige familias.

Después sustituye el bloque repetido de create y update. Conserva:

- `CREATE_MEDIA_LOG_INVALIDATION_KEYS()`;
- `UPDATE_MEDIA_LOG_INVALIDATION_KEYS()`;
- las mismas familias que cada mutación ya usaba.

Checkpoint de regresión:

- crear sigue actualizando sus proyecciones;
- editar sigue refrescando lista y detalles;
- el helper no conoce nombres de features.

## 4. Define el plan de DELETE

Declara un plan con dos grupos:

```ts
export const DELETE_MEDIA_LOG_INVALIDATION_PLAN = () => ({
  refetch: [mediaKeys.lists(), mediaKeys.searches()],
  staleOnly: [mediaKeys.details()],
})
```

Razona cada familia:

| Familia | Estado después de eliminar |
| --- | --- |
| `lists()` | La biblioteca no debe incluir el registro |
| `searches()` | El catálogo debe recuperar `isLogged: false` |
| `details()` | El detalle privado abierto ya no existe |

La invalidación normal refetchea queries activas. El detalle privado está activo y el recurso acaba de desaparecer. Marca la familia `details()` stale con `refetchType: "none"` para evitar un request `404` antes de navegar.

No uses `removeQueries`, `queryClient.clear()` ni una limpieza global.

## 5. Crea la mutación DELETE

Añade `useDeleteMediaLog` al archivo de hooks de Media.

Debe:

1. usar `deleteMediaLog` como `mutationFn`;
2. obtener Query Client;
3. leer el plan en `onSuccess`;
4. invalidar `refetch` con el modo normal;
5. invalidar `staleOnly` con `"none"`;
6. esperar ambas ramas con `Promise.all`.

El hook no navega ni cierra componentes. Su responsabilidad termina cuando la caché queda en el estado acordado.

Checkpoint: `isPending` permanece activo mientras TanStack Query espera el `onSuccess` asíncrono.

La porción final de mutaciones de `src/hooks/features/use-media.ts` muestra la migración completa de create y update y el nuevo hook DELETE:

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

Las familias no cambian al migrar create y update. Solo reemplazas su mecánica repetida.

## 6. Traduce los errores

Crea:

```text
src/lib/delete-media-log-error-message.ts
```

Implementa el archivo completo:

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

Matriz acordada:

| Entrada | Mensaje |
| --- | --- |
| `ApiError` `401` | La sesión no pudo autorizar la eliminación |
| `ApiError` `404` | El registro ya no existe o no está disponible para la sesión |
| Cualquier otro error | No se pudo eliminar; revisar conexión y reintentar |

El traductor no ejecuta logout, navegación, reset o invalidación.

## 7. Construye `DeleteMediaDialog`

Crea `src/components/delete-media-dialog.tsx` con esta referencia completa:

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

El contenido debe:

- usar el título “Eliminar de mi biblioteca”;
- nombrar `mediaTitle` dentro de la advertencia;
- explicar que la app no permite deshacer la acción;
- mostrar el error cuando existe;
- ofrecer Cancelar y Eliminar.

Mientras `isPending` sea `true`:

- Cancelar queda disabled;
- Eliminar muestra loading;
- Escape y click exterior no cierran;
- el botón superior no aparece.

Checkpoint: el componente no importa API, hooks de Query, Router, Firebase, store o DTOs completos.

## 8. Expón la intención desde el detalle

En `src/components/saved-media-details.tsx`, amplía el contrato y muestra el consumidor del callback:

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

El botón “Eliminar de mi biblioteca” llama `onDelete`.

`SavedMediaDetails` no recibe `logId`, Query Client o mutation object. Solo comunica una intención.

## 9. Integra la confirmación en la página

`PrivateMediaDetailPage` posee la interacción porque ya tiene:

- el `entry` privado;
- el título visible;
- la ruta actual;
- acceso a los hooks de datos.

Añade estado local para abrir el diálogo. No uses Zustand o Context.

Al abrir:

1. llama `deleteMutation.reset()`;
2. abre el diálogo.

Al cancelar:

1. comprueba `isPending`;
2. si no hay request en curso, cierra;
3. no llama `mutate`, no invalida y no navega.

Al confirmar:

1. comprueba que `entry` existe;
2. bloquea un segundo submit durante pending;
3. entrega `entry.id` a `mutate`;
4. navega a `/app/library` desde el callback de éxito de esa ejecución;
5. usa `{ replace: true }`.

El `onSuccess` del hook termina antes del callback específico de `mutate`. No navegues desde un Effect u `onSettled`.

En éxito no cierres además el diálogo. La navegación desmonta la página y su estado local.

La referencia final de `src/pages/private-media-detail-page.tsx` conserva lectura, edición, retries y regreso a la biblioteca, y añade el flujo DELETE completo:

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
            onCancel={closeEdit}
            onUpdated={closeEdit}
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

Los hooks se ejecutan antes de los returns condicionales. Después del guard, `entry` no es nullable. Tras un error, el diálogo permanece abierto y el botón Eliminar funciona como reintento.

## Trabajo con agente

Delega la suite solo después de implementar y explicar el traductor.

Prompt:

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

Después:

1. abre el test;
2. revisa imports y construcción de `ApiError`;
3. relaciona cada caso con una rama del helper;
4. confirma que solo cambió el archivo permitido;
5. ejecuta:

```bash
pnpm test -- delete-media-log-error-message
```

La suite demuestra el mapping de errores. No demuestra el diálogo ni el flujo DELETE.

## 10. Recorre el CRUD completo

Ejecuta:

```bash
pnpm test -- delete-media-log-error-message
pnpm build
pnpm dev
```

Usa un registro creado por ti:

1. crea el registro desde catálogo;
2. confirma que aparece en la biblioteca;
3. abre `/app/library/:logId`;
4. edita status, prioridad y notas;
5. abre la confirmación;
6. verifica que muestra el título;
7. cancela y confirma que Network no registra DELETE;
8. reabre y provoca un error controlado;
9. confirma que diálogo y ruta permanecen;
10. reintenta con conexión y sesión válidas;
11. inspecciona DELETE en Network;
12. confirma path con `logId`, Bearer y ausencia de body;
13. observa el plan en Query Devtools;
14. confirma que no apareció un refetch `404` del detalle antes de navegar;
15. confirma `/app/library` y prueba Atrás;
16. busca el mismo catálogo y comprueba `isLogged: false` después del refetch;
17. crea y edita otro registro para revisar regresiones.

## Checkpoint final

- Cancelar no ejecuta efectos remotos.
- Confirmar usa `entry.id`.
- Pending impide doble submit y cierre accidental.
- Un error permite reintentar.
- Listas y búsquedas quedan stale con el modo normal.
- Detalles quedan stale sin refetch inmediato.
- La navegación ocurre después del éxito y reemplaza el historial.
- Crear, leer y actualizar siguen funcionando.

## Evidencia y entrega

Entrega según la plataforma definida por el docente:

- código del checkpoint;
- salida del test enfocado;
- salida de `pnpm build`;
- captura de Network sin mostrar el valor del token;
- demostración o grabación corta de Cancelar, error y éxito;
- explicación breve de por qué `details()` usa `refetchType: "none"`.

Un test verde no demuestra el navegador. Un build exitoso no demuestra DELETE. Una captura de Network no demuestra toda la política de caché.

## Vocabulario

- **Operación destructiva:** acción que retira datos o dificulta recuperarlos.
- **Confirmación explícita:** paso que permite revisar y cancelar antes del request.
- **Stale:** datos que TanStack Query ya no considera actuales.
- **Refetch:** request nuevo para recuperar datos actuales.
- **Query activa:** query con un consumidor montado.
- **Navegación programática:** cambio de ruta iniciado desde código.
- **Replace:** reemplazo de la entrada actual del historial.
- **Regresión:** comportamiento anterior que deja de funcionar tras un cambio.

## Fuera de alcance

- Deshacer, restaurar, papelera o borrado masivo.
- Zustand o Context para la confirmación.
- Navegación mediante Effect.
- Limpiar toda la caché o retirar el detalle activo.
- Tests de UI, Router o Query Client.
- Cambios o ejecución del backend por estudiantes.
