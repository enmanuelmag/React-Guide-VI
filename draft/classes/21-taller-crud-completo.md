# Clase 21 · Taller de eliminación y CRUD completo

- **Semana:** 7
- **Modalidad:** presencial
- **Duración:** 180 minutos, incluido un descanso de 30 minutos
- **Punto de entrada:** checkpoint 20 con creación, biblioteca, detalle privado y edición pesimista funcionales
- **Proyecto semilla:** `s07-c21-crud-seed`
- **Checkpoint de salida:** un registro creado por el estudiante se puede consultar, editar y eliminar mediante confirmación; biblioteca, búsqueda y navegación quedan coherentes

## Resultado de aprendizaje

Al terminar, el estudiante podrá integrar una operación destructiva mediante confirmación explícita, ejecutar un DELETE autenticado y coordinar caché y navegación después de confirmar el éxito para que una eliminación exitosa no produzca un error transitorio en la pantalla activa.

## Pregunta que organiza la clase

> Si la página que estoy mirando representa el registro que acabo de eliminar, ¿qué datos deben quedar stale y a qué pantalla puede continuar la persona?

La clase no se limita a añadir un botón. Cierra este recorrido:

```text
abrir confirmación
→ confirmar una identidad visible
→ DELETE por logId
→ mantener la pantalla mientras está pending
→ actualizar el estado conocido de la caché
→ navegar después del éxito
```

## Progresión entre clases

| Clase | Aporta | No resuelve todavía |
| --- | --- | --- |
| 20 | Formulario compartido, PUT e invalidación pesimista | No elimina ni abandona un detalle destruido |
| **21** | Confirmación, DELETE, tercer consumidor de invalidaciones y navegación posterior | No añade filtros ni pruebas |
| 22 | Filtros compartibles en URL y primera prueba pura de los adapters | No vuelve a implementar el CRUD ni prueba componentes |

## Conceptos que se enseñan y consolidan

### Conceptos principales

- Operación destructiva y confirmación explícita.
- Eliminación pesimista mediante `DELETE /api/v2/media/:id`.
- Distinción entre invalidar con refetch y marcar stale sin refetch.
- Navegación programática después de una mutación exitosa.
- Sustitución de la entrada del historial mediante `replace: true`.

### Conceptos que se consolidan

- `logId` como identidad del registro personal.
- `requestJsonWithAuth` y Bearer.
- `useMutation`, `isPending`, `isError`, `reset` y callbacks por ejecución.
- Familias de query keys e invalidación por prefijo.
- Modal controlado mediante estado local.
- Mensajes locales derivados de `ApiError.status`.
- Desmontaje como cierre natural de estado local al cambiar de página.

### Distinciones que deben quedar explícitas

| No confundir | Distinción |
| --- | --- |
| Cancelar con eliminar | Cancelar cambia únicamente estado local; no ejecuta el fetcher |
| `externalId` con `logId` | DELETE recibe la identidad del registro personal, no la del catálogo |
| Invalidar con eliminar caché | Invalidar conserva la query y la marca stale; `removeQueries` retira entradas de la caché |
| Request exitoso con interfaz coherente | El `200` confirma el servidor; todavía deben coordinarse las lecturas afectadas y la ruta activa |
| Cerrar el diálogo con navegar | En éxito, la navegación desmonta toda la página; no hace falta duplicar un cierre local |
| Solicitud pendiente frente a éxito confirmado | La UI espera el `200`; no retira el registro antes de la respuesta |

## Contrato remoto verificado

El backend preparado por el docente expone:

```text
DELETE /api/v2/media/:id
Authorization: Bearer <Firebase ID token>
```

No recibe body. El parámetro `:id` es el `logId` del registro personal.

La respuesta exitosa es:

```json
{
  "message": "entry deleted"
}
```

El curso declara únicamente la forma que consume:

```ts
export type DeleteMediaLogResponseDto = {
  message: "entry deleted"
}
```

El contrato puede responder:

| Status | Interpretación en esta interfaz |
| --- | --- |
| `200` | El registro dejó de estar activo para la sesión actual |
| `400` | Request inválido; se usa el mensaje general porque la UI no construye un body editable |
| `401` | El servidor no pudo autorizar el token actual |
| `404` | El registro no existe, ya fue eliminado o no pertenece a la sesión |
| `500` | El servidor no pudo completar la operación |

El contrato limita la operación al registro de la sesión autenticada. Para la aplicación, la acción no puede deshacerse porque el curso no implementa restauración. La estrategia interna de persistencia queda fuera de alcance: los estudiantes reciben una URL funcional y no inspeccionan el servidor.

## Decisión de caché después de eliminar

Eliminar afecta tres familias existentes:

| Familia | Qué cambió | Tratamiento |
| --- | --- | --- |
| `lists()` | La biblioteca ya no debe incluir el registro | Invalidar con comportamiento normal |
| `searches()` | El catálogo debe volver a mostrar `isLogged: false` | Invalidar con comportamiento normal |
| `details()` | El detalle público cambia y el detalle privado deja de existir | Marcar stale sin refetchear mientras la página eliminada siga activa |

Una invalidación normal refetchea las queries activas. En esta pantalla, el detalle privado está activo y su recurso acaba de desaparecer. Refetchearlo antes de navegar produciría un `404` previsible después de un DELETE exitoso.

Por eso, la secuencia aprobada es:

```text
DELETE 200
   │
   ├── lists()    → stale; refetch cuando vuelva a montarse la biblioteca
   ├── searches() → stale; refetch cuando vuelva a consumirse la búsqueda
   └── details()  → stale sin refetch inmediato
                           │
                           ▼
             navigate("/app/library", { replace: true })
```

No se usa `removeQueries` para el detalle activo. Retirarlo mientras todavía tiene un observer puede forzar un estado de carga brusco antes de que React procese la navegación. Marcarlo stale conserva una transición estable y garantiza un request nuevo si alguien intenta abrir esa URL posteriormente.

## Decisión de arquitectura

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `DeleteMediaDialog` | Presentar alcance, error y acciones; bloquear cierres durante pending | No conoce `logId`, Router, Query Client o Firebase |
| `PrivateMediaDetailPage` | Poseer apertura, registro actual, mutación y destino de navegación | No construye headers ni invalida directamente |
| `deleteMediaLog` | Ejecutar DELETE autenticado por `logId` | No abre diálogos ni navega |
| `useDeleteMediaLog` | Ejecutar la mutación y aplicar el plan de invalidación | No decide qué ruta mostrar después |
| `invalidateQueriesByKeys` | Repetir de forma consistente una invalidación por cada key recibida | No decide qué familias afecta un caso de uso |
| `getDeleteMediaLogErrorMessage` | Traducir status técnicos a copy local | No cierra sesión automáticamente |

El helper aparece ahora porque crear, actualizar y eliminar ya repiten el mismo `Promise.all + map + invalidateQueries`. La abstracción elimina mecánica repetida, pero cada mutación sigue declarando sus familias de negocio.

## Guion de presentación

### Propósito y duración

La presentación inicial dura 18 minutos. Recupera el checkpoint 20, define la eliminación como flujo y no como botón, y presenta el problema del detalle activo antes de abrir el editor. El cierre de 5 minutos vuelve al deck durante la revisión para reconstruir el recorrido completo.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | C, R y U ya funcionan | Pedir que el grupo ubique crear, lista, detalle y edición. Recuperar `externalId` frente a `logId`. | CRUD con tres letras completas y D atenuada. |
| Problema | El registro abierto va a desaparecer | La ruta `/app/library/:logId` representa un recurso personal. Después del DELETE esa ruta ya no tiene una lectura válida. | Antes/después de la pantalla con URL visible. |
| Riesgo | Un botón destructivo necesita una pausa | La confirmación debe nombrar qué se elimina y permitir cancelar sin request. No usar el id técnico como mensaje principal. | Mockup del diálogo con título del medio resaltado. |
| Contrato | DELETE usa `logId` y no recibe body | El token identifica al usuario; el path identifica el registro. `externalId` no participa. | Diagrama token + path; tachar body y `userId`. |
| Estado | Pending bloquea una segunda decisión | Mientras el request está en curso se deshabilitan confirmar, cancelar, Escape, overlay y cierre superior. | Línea temporal con doble clic rechazado. |
| Error | Fallar no destruye la pantalla | `401`, `404` y error general conservan diálogo y ruta para explicar y reintentar. No navegar en `onSettled`. | Comparación éxito/error. |
| Repetición | Tercera mutación, misma mecánica | Crear y actualizar ya recorren arrays de keys. Ahora existe evidencia para extraer `invalidateQueriesByKeys`. | Tres bloques con la misma región resaltada. |
| Límite del helper | La función no conoce el negocio | El helper recibe keys; `useDeleteMediaLog` decide listas, búsquedas y detalles. | Caja mecánica debajo de tres planes distintos. |
| Caché | Stale no siempre significa refetch inmediato | `invalidateQueries` refetchea queries activas por defecto. En el detalle eliminado eso produciría un `404` transitorio. | Árbol de queries con `details()` activo. |
| Solución | El detalle queda stale sin refetch | Usar `refetchType: "none"` solo para `details()` durante DELETE. Lista y búsqueda quedan stale normalmente. | Diagrama de tres ramas con tratamientos distintos. |
| Navegación | El éxito cambia el destino | `useNavigate` responde al resultado de una interacción asíncrona. `replace: true` evita volver directamente a la ruta eliminada. | Historial antes/después; eliminar la entrada del detalle. |
| React | Navegar también desmonta | Al salir de la página, React desmonta el diálogo y su estado local. No hace falta llamar además a `setIsDeleteOpen(false)` en éxito. | Árbol de componentes que desaparece al cambiar de ruta. |
| Taller | Integrar piezas conocidas | El seed previo contiene fetcher, hook, helper y diálogo. El estudiante conecta identidad, callbacks y recorrido de aceptación. | Checklist sin mostrar el handler resuelto. |

### Indicaciones que deben sobrevivir a la producción de slides

- La confirmación no autentica ni autoriza: solo reduce una acción accidental.
- DELETE recibe `logId`. El título se muestra a la persona, pero no sustituye la identidad técnica.
- Cancelar no llama al fetcher y no invalida ninguna query.
- `isPending` proviene de la mutación; no se duplica mediante `useState`.
- `mutation.reset()` se ejecuta al abrir una nueva sesión del diálogo para no mostrar un error anterior.
- No usar un Effect para observar `isSuccess`, cerrar o navegar. La operación ya posee un callback de éxito.
- El helper compartido aparece después de observar tres repeticiones reales.
- `DELETE_MEDIA_LOG_INVALIDATION_PLAN` conserva la decisión del caso de uso; el helper no contiene nombres de Media.
- `lists()` y `searches()` suelen estar inactivas mientras se muestra el detalle. Invalidarlas las deja stale y se consultan cuando vuelven a montarse.
- `details()` contiene también la query privada activa. `refetchType: "none"` evita solicitar inmediatamente el recurso destruido.
- Stale no significa eliminado de caché. Significa que la próxima oportunidad de uso debe recuperar datos actuales.
- No usar `queryClient.clear()` ni `removeQueries(mediaKeys.all)`; esas operaciones pertenecen a otros alcances.
- Navegar ocurre solo después del `200` y del plan de consistencia.
- `replace: true` sustituye la entrada del detalle; no borra todo el historial.
- El éxito no ejecuta un cierre local adicional: la ruta nueva desmonta la página y el diálogo.
- Un `404` de DELETE se presenta como estado recuperable; no se convierte en logout automático.
- El taller usa un registro creado durante la sesión. No incluye ids fijos ni elimina datos ajenos.
- El borrado espera la confirmación del servidor antes de navegar a la biblioteca.
- El calendario no existe todavía como query del proyecto y no se añade a las invalidaciones por anticipación.

### Snippets conceptuales para las slides

```ts
deleteMediaLog(entry.id) // logId, no catalog.externalId
```

```ts
invalidateQueries({ queryKey: mediaKeys.lists() })
invalidateQueries({
  queryKey: mediaKeys.details(),
  refetchType: "none",
})
```

```ts
navigate("/app/library", { replace: true })
```

No mostrar en la presentación inicial el handler completo del taller.

### Cierre conceptual

1. ¿Por qué cancelar no necesita invalidar ninguna query?
2. ¿Por qué `details()` no debe refetchearse antes de abandonar la página eliminada?
3. ¿Qué problema evita `replace: true` en este recorrido?
4. ¿Qué parte del flujo pertenece al hook y qué parte pertenece a la página?

El cierre conecta las respuestas con el CRUD completo y anticipa que la clase 22 añadirá filtros compartibles y una primera prueba pura de los adapters, no otra operación de escritura.

## Proyecto semilla

### Incluye

- Checkpoint completo de la clase 20.
- Creación, biblioteca, detalle privado y edición funcionales.
- `MediaLogForm`, `CreateMediaLogForm` y `EditMediaLogForm` sin regresiones.
- Botón visual “Eliminar de mi biblioteca” en `SavedMediaDetails`.
- `DeleteMediaDialog` con estructura Mantine y props presentacionales definidas.
- Query keys e invalidaciones explícitas de creación y actualización.
- Configuración de Firebase y `VITE_API_URL` mediante variables del estudiante.

### No incluye

- `DeleteMediaLogResponseDto`, fetcher o hook DELETE.
- Helper `invalidateQueriesByKeys`.
- Plan de invalidación de DELETE.
- Estado que abre el diálogo desde el detalle.
- Handler de confirmación o traducción de errores.
- Navegación posterior al éxito.

### Comprobaciones antes de compartir

- `pnpm install` usa únicamente `pnpm-lock.yaml`.
- `pnpm build` termina correctamente.
- Crear, listar, consultar y editar funcionan contra la URL docente.
- El botón de eliminación no ejecuta requests.
- El diálogo presentacional compila aunque todavía no tenga integración.
- No existe un id fijo, token, credencial o solución del taller.

## Estado inicial y transformación de archivos

### Antes de la clase

```text
src/
├── api/media.ts                         create, list, detail y update
├── components/
│   ├── delete-media-dialog.tsx          presentación preparada
│   └── saved-media-details.tsx          botón sin handler real
├── hooks/
│   ├── media-keys.ts
│   └── features/use-media.ts            create, list, detail y update
├── pages/private-media-detail-page.tsx
└── types/media-api.ts
```

### Checkpoint previo al taller

```text
src/
├── api/media.ts                         añade deleteMediaLog
├── hooks/
│   ├── invalidation-utils.ts            nuevo helper mecánico
│   └── features/use-media.ts            añade plan y useDeleteMediaLog
└── types/media-api.ts                   añade respuesta DELETE mínima
```

El checkpoint alternativo compila y contiene todo concepto nuevo explicado antes del descanso. Todavía omite la integración que resuelve el taller.

### Checkpoint de salida

```text
src/
├── api/media.ts                         DELETE autenticado por logId
├── components/
│   ├── delete-media-dialog.tsx          confirmación, pending y error
│   └── saved-media-details.tsx          expone onDelete
├── hooks/
│   ├── invalidation-utils.ts
│   └── features/use-media.ts            create, update y delete usan helper
├── pages/private-media-detail-page.tsx  abre, confirma y navega
└── types/media-api.ts
```

## Antes del descanso · 75 minutos

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0–18 min | Docente y grupo | Usar el deck para recuperar C/R/U, leer el problema destructivo y predecir las familias afectadas. |
| 18–35 min | Construcción guiada | Añadir el DTO mínimo, `deleteMediaLog(logId)` y `useDeleteMediaLog`; comprobar método, path, Bearer y ausencia de body. |
| 35–50 min | Docente con participación | Detectar la tercera repetición, extraer `invalidateQueriesByKeys` y migrar crear y actualizar sin cambiar sus familias. |
| 50–63 min | Grupo y docente | Comparar invalidación normal con stale sin refetch; definir el plan de DELETE y justificar `refetchType: "none"` para detalles. |
| 63–70 min | Construcción interactiva | Recorrer el contrato de `DeleteMediaDialog`, pending, error y `reset`; reconstruir `useNavigate(..., { replace: true })` sin resolver el handler. |
| 70–75 min | Docente | Entregar el checkpoint alternativo, explicar criterios, registro descartable y restricciones del taller. |

### Estado 1 · Añadir la respuesta y el fetcher DELETE

`src/types/media-api.ts` incorpora:

```ts
export type DeleteMediaLogResponseDto = {
  message: "entry deleted"
}
```

`src/api/media.ts` añade:

```ts
export function deleteMediaLog(
  logId: string,
): Promise<DeleteMediaLogResponseDto> {
  return requestJsonWithAuth<DeleteMediaLogResponseDto>(
    `${API_URL}/api/v2/media/${logId}`,
    { method: "DELETE" },
  )
}
```

El path recibe `logId`; el request no envía `Content-Type` ni body. `requestJsonWithAuth` obtiene el token en el momento del request y el frontend no envía `userId`.

No se ejecuta el fetcher con un id escrito a mano. La verificación real usará un registro creado por el estudiante durante el taller.

### Estado 2 · Extraer el helper después de observar la repetición

Antes de extraer, el docente coloca juntos los bloques de crear y actualizar. El grupo identifica qué se repite y qué cambia.

`src/hooks/invalidation-utils.ts`:

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

La firma está deliberadamente limitada a los dos modos que usa el curso. No intenta envolver toda la API de Query Client.

Crear y actualizar sustituyen únicamente su bloque mecánico:

```ts
await invalidateQueriesByKeys(
  queryClient,
  CREATE_MEDIA_LOG_INVALIDATION_KEYS(),
)
```

```ts
await invalidateQueriesByKeys(
  queryClient,
  UPDATE_MEDIA_LOG_INVALIDATION_KEYS(),
)
```

Las constantes de cada caso de uso permanecen visibles. Después del refactor se ejecutan creación y edición para comprobar que el helper no introdujo una regresión.

### Estado 3 · Definir el plan de invalidación de DELETE

`src/hooks/features/use-media.ts` documenta dos tratamientos:

```ts
export const DELETE_MEDIA_LOG_INVALIDATION_PLAN = () => ({
  refetch: [mediaKeys.lists(), mediaKeys.searches()],
  staleOnly: [mediaKeys.details()],
})
```

`refetch` no significa que todas esas queries necesariamente ejecuten un request en ese instante. TanStack Query refetchea las activas; las inactivas quedan stale. El nombre distingue este grupo del que explícitamente usa `refetchType: "none"`.

### Estado 4 · Construir la mutación

```ts
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

La mutación permanece pending hasta que termina el plan. El hook no navega porque no conoce qué interfaz está consumiendo la operación.

### Estado 5 · Recorrer el contrato del diálogo

El seed ya incluye su presentación. Antes del taller se explican sus props:

```ts
type DeleteMediaDialogProps = {
  opened: boolean
  mediaTitle: string
  isPending: boolean
  errorMessage: string | null
  onCancel: () => void
  onConfirm: () => void
}
```

Reglas del componente:

```tsx
<Modal
  opened={opened}
  onClose={onCancel}
  title="Eliminar de mi biblioteca"
  closeOnClickOutside={!isPending}
  closeOnEscape={!isPending}
  withCloseButton={!isPending}
>
  <Text>
    “{mediaTitle}” se eliminará de tu biblioteca. Esta acción no se puede
    deshacer desde la aplicación.
  </Text>

  {errorMessage !== null && <Alert color="red">{errorMessage}</Alert>}

  <Group justify="flex-end" mt="lg">
    <Button variant="default" disabled={isPending} onClick={onCancel}>
      Cancelar
    </Button>
    <Button color="red" loading={isPending} onClick={onConfirm}>
      Eliminar
    </Button>
  </Group>
</Modal>
```

El componente no llama hooks de datos. Recibe el estado de la operación y emite intenciones.

### Checkpoint previo al taller

- DELETE, tipo de respuesta y mutación compilan.
- Crear y actualizar usan `invalidateQueriesByKeys` y conservan su comportamiento.
- El plan separa lista/búsqueda de detalle activo.
- El diálogo explica la identidad visible y bloquea cierres durante pending.
- El botón todavía no abre el diálogo real.
- No existe handler de confirmación, navegación ni id fijo.
- `pnpm build` termina correctamente.

El docente puede compartir este checkpoint si una pareja no terminó la construcción previa. Compartirlo no resuelve el taller: faltan propiedad del estado, integración, errores y navegación.

## Descanso · 30 minutos

No se introduce contenido durante el descanso.

## Después del descanso · Taller de 60 minutos

### Encargo

Completar el CRUD de la biblioteca. Cada pareja debe crear un registro descartable, editarlo, eliminarlo desde su detalle privado y demostrar que búsqueda, biblioteca, ruta y mensajes quedan coherentes.

### Distribución sugerida

| Tiempo | Progreso esperado |
| --- | --- |
| 0–10 min | Abrir y cancelar el diálogo desde el detalle usando título y callbacks reales. |
| 10–25 min | Conectar `logId`, mutación, pending, error y `mutation.reset()`. |
| 25–38 min | Navegar con `replace: true` únicamente desde el callback de éxito. |
| 38–50 min | Forzar error, reintentar y revisar queries y requests en Devtools/Network. |
| 50–60 min | Ejecutar C/R/U/D completo y preparar la aplicación para la pareja revisora. |

### Trabajo obligatorio

#### 1. Exponer la intención desde el detalle

`SavedMediaDetails` recibe una prop obligatoria:

```ts
type SavedMediaDetailsProps = {
  // props existentes
  onDelete: () => void
}
```

El botón llama `onDelete`. No recibe `logId` ni importa la mutación.

#### 2. Abrir una sesión limpia de confirmación

```ts
const [isDeleteOpen, setIsDeleteOpen] = useState(false)

function handleOpenDelete() {
  deleteMutation.reset()
  setIsDeleteOpen(true)
}
```

`reset()` limpia error y estado de una ejecución anterior. No recupera datos ni revierte el servidor.

#### 3. Cancelar sin request

```ts
function handleCancelDelete() {
  if (deleteMutation.isPending) return
  setIsDeleteOpen(false)
}
```

Cancelar no llama `mutate`, no invalida y no navega.

#### 4. Traducir errores

```ts
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

La función puede vivir junto al diálogo o en el mismo archivo de mensajes locales aprobado por el proyecto. No provoca logout.

#### 5. Confirmar mediante el `logId` real

La solución de referencia para el docente es:

```tsx
const navigate = useNavigate()
const deleteMutation = useDeleteMediaLog()
const entry = detailQuery.data?.entry ?? null

function handleConfirmDelete() {
  if (entry === null || deleteMutation.isPending) return

  deleteMutation.mutate(entry.id, {
    onSuccess: () => {
      navigate("/app/library", { replace: true })
    },
  })
}
```

El callback por ejecución decide la consecuencia visual. El `onSuccess` definido dentro del hook mantiene la consistencia remota antes de que se ejecute esta navegación.

#### 6. Integrar el diálogo

```tsx
<DeleteMediaDialog
  opened={isDeleteOpen}
  mediaTitle={documentTitle}
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

En éxito no se llama `setIsDeleteOpen(false)`: navegar desmonta `PrivateMediaDetailPage` y toda la sesión del diálogo.

#### 7. Ejecutar el recorrido completo

Cada pareja debe buscar un catálogo no guardado, agregarlo, abrir su detalle privado, editar los tres campos, cancelar una eliminación y después confirmarla. Al final comprueba la biblioteca y busca el mismo catálogo para observar `isLogged: false` después del refetch.

### Restricciones

- No usar ids fijos o registros de otra persona.
- No ejecutar DELETE al abrir el diálogo.
- No usar `externalId` como path de eliminación.
- No enviar body, `userId` o token manual.
- No retirar la tarjeta o modificar caché antes del `200`.
- No navegar desde `onSettled`, un Effect o un render condicional.
- No cerrar el diálogo mientras la mutación está pending.
- No usar `queryClient.clear()` ni limpiar toda la familia Media.
- No modificar, ejecutar o configurar el backend.
- No añadir filtros, pruebas automatizadas, Zustand, drawer o notificaciones globales.

### Retos adicionales

- Restaurar el foco en el botón “Eliminar de mi biblioteca” al cancelar y explicar por qué mejora la navegación por teclado.
- Añadir una segunda confirmación escrita con el título únicamente como ejercicio; no forma parte del checkpoint base.
- Mostrar un aviso de éxito en la biblioteca solo si la pareja termina el recorrido obligatorio. No introducir una librería nueva de notificaciones.

## Actividades del docente durante el taller

- Exigir que cada pareja cree un registro descartable antes de probar DELETE.
- Preguntar qué componente posee `isDeleteOpen` y por qué no pertenece a Zustand.
- Revisar Network para confirmar método, path, Bearer y ausencia de body.
- Pedir que se fuerce al menos un error antes de aceptar el recorrido.
- Verificar por separado cancelación, pending, error, invalidación y navegación.
- Preguntar por qué `details()` usa stale sin refetch.
- Evitar entregar el handler completo antes de que la pareja dibuje su recorrido.
- Rechazar soluciones que cambien el backend o simulen éxito local.

## Actividades de los estudiantes

- Identificar el `logId` proveniente de `entry`.
- Propagar `onDelete` sin pasar DTOs innecesarios al botón.
- Abrir y cancelar el diálogo mediante eventos conocidos.
- Limpiar un error anterior al comenzar otra confirmación.
- Conectar `isPending` y evitar doble envío.
- Traducir errores sin cerrar sesión automáticamente.
- Navegar únicamente después del éxito.
- Observar en Query Devtools qué familias quedan stale.
- Ejecutar el CRUD con un registro propio.
- Revisar la aplicación de otra pareja mediante criterios observables.

## Revisión y demostración · 15 minutos

| Tiempo | Actividad |
| --- | --- |
| 0–8 min | Una pareja revisora ejecuta cancelar, error y éxito sin instrucciones verbales del equipo autor. |
| 8–12 min | El equipo muestra Network y Query Devtools y explica el tratamiento diferente de `details()`. |
| 12–15 min | El grupo vuelve al deck, reconstruye el CRUD y anticipa filtros compartibles de la clase 22. |

## Recorrido de verificación

1. Ejecutar `pnpm build`.
2. Iniciar sesión y crear un registro descartable desde catálogo.
3. Confirmar que aparece en la biblioteca.
4. Abrir `/app/library/:logId` y editar status, prioridad y notas.
5. Pulsar “Eliminar de mi biblioteca”.
6. Confirmar que el diálogo muestra el título y no el id.
7. Cancelar y comprobar que Network no registra DELETE.
8. Reabrir, activar temporalmente el modo Offline de Network y provocar un error controlado; el diálogo permanece abierto.
9. Confirmar que los botones y cierres están bloqueados durante pending.
10. Reintentar con conectividad y sesión válidas.
11. Inspeccionar DELETE: path con `logId`, Bearer, sin body.
12. Confirmar respuesta `200` y ausencia de doble request.
13. Observar `lists()` y `searches()` stale.
14. Confirmar que el detalle activo no ejecutó un refetch 404 antes de navegar.
15. Confirmar navegación a `/app/library` con reemplazo de historial.
16. Confirmar que el registro no aparece en la biblioteca refrescada.
17. Pulsar Atrás y comprobar que no regresa directamente al detalle eliminado.
18. Buscar el mismo medio y comprobar `isLogged: false`.
19. Crear y editar otro registro para descartar regresiones.

## Criterios de aceptación

- El diálogo nombra el medio mediante su título.
- Cancelar no ejecuta DELETE, invalidación ni navegación.
- Confirmar usa el `logId` real de `entry`.
- El request usa Bearer y no envía body o `userId`.
- Pending impide doble submit y cierre accidental.
- Un error conserva ruta, diálogo y posibilidad de reintento.
- `401`, `404` y error general producen mensajes diferentes cuando corresponde.
- Una respuesta exitosa invalida biblioteca y búsqueda.
- La familia de detalles queda stale sin refetch inmediato.
- La navegación ocurre después del éxito y usa `replace: true`.
- La biblioteca deja de mostrar el registro.
- La búsqueda vuelve a mostrarlo como no guardado.
- Crear, leer y actualizar siguen funcionando.
- No existe Effect, id fijo o cambio de backend.

## Errores frecuentes y preguntas de diagnóstico

| Error observado | Pregunta docente | Corrección esperada |
| --- | --- | --- |
| El botón llama DELETE directamente. | ¿Dónde puede la persona revisar y cancelar la acción? | Abrir primero el diálogo controlado. |
| Se muestra `entry.id` como mensaje principal. | ¿Qué identidad reconoce una persona? | Mostrar el título; conservar el id solo para transporte. |
| DELETE usa `externalId`. | ¿Qué recurso se está eliminando: catálogo o registro personal? | Usar `entry.id` como `logId`. |
| El request envía `{ userId }`. | ¿Qué dato aporta el token verificado? | Retirar `userId` del body. |
| Reabrir muestra un error anterior. | ¿Cuándo comienza una sesión nueva de confirmación? | Llamar `reset()` en el evento de apertura. |
| Se usa un `useState` adicional para loading. | ¿Qué estado ya expone la mutación? | Consumir `isPending`. |
| Escape cierra durante pending. | ¿Dónde verá la persona el resultado? | Bloquear mecanismos de cierre mientras se ejecuta. |
| Se navega al confirmar. | ¿Existe ya un `200`? | Navegar únicamente desde éxito. |
| Se navega desde un Effect de `isSuccess`. | ¿Qué callback conoce exactamente la operación completada? | Usar el callback de `mutate`. |
| Se invalida `details()` normalmente. | ¿Qué query está activa y qué responderá ahora? | Usar stale sin refetch para esa familia. |
| Se elimina la query de detalle activa. | ¿Qué ve el observer antes de navegar? | Conservarla stale hasta el desmontaje. |
| Se usa `queryClient.clear()`. | ¿La mutación volvió inválidas todas las features? | Invalidar solo familias Media afectadas. |
| Se cierra y además se navega en éxito. | ¿Qué le ocurre al estado local al desmontar la página? | Dejar que la navegación destruya el diálogo. |
| Atrás vuelve al recurso eliminado. | ¿Se conservó la entrada anterior del historial? | Navegar con `replace: true`. |
| La búsqueda conserva `isLogged: true`. | ¿Qué proyección cambió después de DELETE? | Añadir `searches()` al plan. |

## Fuera de alcance

- Modificar rutas, autenticación, jobs o persistencia del backend.
- Restaurar un registro eliminado.
- Borrado masivo, papelera, período de gracia o undo.
- Confirmación global mediante un store.
- Filtros de biblioteca y search params.
- Pruebas automatizadas; comienzan en la clase 22.
- Calendario e invalidaciones de una query que todavía no existe.
- Zustand, drawer, carga diferida o notificaciones globales.
- Abstracción universal para todas las opciones de Query Client.

## Evidencia de salida y entrega

La pareja entrega código que compila, checklist ejecutado por otra pareja, una captura o grabación corta del CRUD y una captura de Network sin exponer el token. También explica por qué el detalle queda stale sin refetch y por qué la navegación usa `replace`.

El checkpoint observable es:

> Un estudiante crea un registro propio, lo abre por `logId`, modifica sus datos y lo elimina mediante un diálogo controlado. Durante pending no puede duplicar ni ocultar la operación; un error permite reintentar. Después del `200`, la aplicación no refetchea el detalle destruido, navega reemplazando la ruta, refresca la biblioteca y permite volver a agregar el catálogo desde búsqueda.

## Vocabulario

- **CRUD:** conjunto de operaciones para crear, leer, actualizar y eliminar un recurso.
- **Operación destructiva:** acción que retira datos o hace difícil recuperarlos desde el producto.
- **Confirmación explícita:** interacción separada que identifica la acción y permite cancelarla antes del request.
- **Stale:** estado de una query cuyos datos ya no deben considerarse actuales.
- **Refetch:** nueva ejecución de una query para recuperar datos actuales.
- **Query activa:** query que tiene al menos un consumidor montado en la interfaz.
- **Navegación programática:** cambio de ruta iniciado por código después de una interacción o resultado conocido.
- **Reemplazo de historial:** navegación que sustituye la entrada actual en lugar de añadir otra encima.
- **Doble envío:** ejecución repetida de una operación mientras la primera sigue pendiente.
- **Recorrido de aceptación:** secuencia observable usada para comprobar un comportamiento acordado.

## Referencias para preparar la clase

- [TanStack Query · Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [TanStack Query · QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)
- [React Router · useNavigate](https://reactrouter.com/api/hooks/useNavigate)
- [Mantine · Modal](https://mantine.dev/core/modal/)
- Contrato docente de `DELETE /api/v2/media/:id` preparado antes de la cohorte.
- Checkpoints 20 y 22 para proteger las fronteras con edición, filtros y pruebas.

Las referencias del backend sirven al docente para confirmar el contrato. Los estudiantes reciben una URL funcional y desarrollan únicamente el frontend.
