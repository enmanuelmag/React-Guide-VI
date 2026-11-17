# Sesión 16 · Eliminación y regresión CRUD

> Estado: paquete textual aprobado definitivamente. La presentación visual y el proyecto progresivo o seed ejecutable permanecen pendientes de sus frentes correspondientes.

- **Fecha:** jueves 5 de noviembre de 2026
- **Semana:** 7
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Seed propuesto:** `s07-c16-delete-regression-seed`

## Archivo de hooks de esta sesión

Añade `useDeleteMediaLog`; reutiliza el helper de `src/hooks/invalidation-utils.ts` desde `../invalidation-utils`. Los hooks de Media se definen en `src/hooks/features/use-media.ts`; el helper permanece en su archivo propio. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 15:

- Crear un registro desde búsqueda o detalle público funciona.
- `/app/library` lista las entradas privadas y enlaza cada `logId`.
- `/app/library/:logId` consulta el detalle privado con Bearer.
- El selector de lectura conserva `mediaDetailSelectorSchema` como fuente y llega validado desde el adapter de ruta de la sesión 14.
- `entry.id` identifica el registro personal; `catalog.externalId` identifica el catálogo.
- `MediaLogForm` comparte status, prioridad, notas, validación y acciones.
- `EditMediaLogForm` actualiza mediante `PUT /api/v2/media/:logId`.
- Crear y actualizar son mutaciones pesimistas.
- `CREATE_MEDIA_LOG_INVALIDATION_KEYS()` y `UPDATE_MEDIA_LOG_INVALIDATION_KEYS()` declaran las familias afectadas por cada mutación.
- Ambas mutaciones repiten `Promise.all + map + queryClient.invalidateQueries`.
- `ApiError` conserva el status HTTP y Vitest funciona en Node.

El seed no contiene botón de eliminación, diálogo, fetcher DELETE, hook, helper de invalidación, traductor de errores ni navegación posterior.

## Limitación visible

La persona puede crear, consultar y editar una entrada, pero no puede retirarla de su biblioteca. Añadir un botón resuelve solo la primera parte. La ruta activa representa el recurso que desaparecerá y la caché conserva otras proyecciones del mismo dato.

```text
detalle privado activo
  → la persona confirma
  → DELETE elimina el registro
  → el detalle actual deja de existir
  → lista y búsqueda conservan proyecciones antiguas
```

La sesión debe responder dos preguntas:

1. ¿Qué puede cancelar la persona antes de enviar una operación destructiva?
2. ¿Qué datos quedan stale y a qué ruta debe continuar después del éxito?

## Resultado de aprendizaje

El estudiante integrará una eliminación pesimista mediante confirmación explícita y coordinará el request, el estado pending, las familias de caché y la navegación para cerrar el CRUD sin mostrar un error transitorio después del éxito.

## Checkpoint de salida

Al terminar:

- `DeleteMediaDialog` muestra el título del medio y explica el alcance de la acción.
- `DeleteMediaDialog` recibe estado y callbacks; no conoce `logId`, Router, Query Client o Firebase.
- `DeleteMediaDialogProps` y `DeleteMediaDialog` tienen una referencia completa con imports, función exportada y guardia de cierre.
- `PrivateMediaDetailPage` posee la apertura, el registro actual, la mutación y el destino de navegación.
- Cancelar no ejecuta DELETE, invalidación ni navegación.
- Abrir una nueva confirmación llama `deleteMutation.reset()` y no conserva un error anterior.
- `isPending` bloquea confirmar otra vez, cancelar, Escape, click exterior y botón superior.
- `deleteMediaLog(logId)` envía `DELETE /api/v2/media/:logId` con Bearer y sin body.
- El path usa `entry.id` como `logId`; nunca usa `catalog.externalId`.
- El frontend no envía `userId` ni copia el token a estado.
- `invalidateQueriesByKeys` recibe Query Client, keys y el modo reducido `"active" | "none"`.
- Crear y actualizar usan el helper sin cambiar sus familias de negocio.
- La guía muestra el resultado final de `useCreateMediaLog` y `useUpdateMediaLog` después de migrarlos al helper.
- `DELETE_MEDIA_LOG_INVALIDATION_PLAN()` separa `refetch` y `staleOnly`.
- `mediaKeys.lists()` y `mediaKeys.searches()` se invalidan con comportamiento normal.
- `mediaKeys.details()` queda stale con `refetchType: "none"`.
- El `onSuccess` del hook espera el plan de caché.
- El callback específico de `mutate` navega después a `/app/library` con `{ replace: true }`.
- El éxito no llama además `setIsDeleteOpen(false)`; la navegación desmonta la página y el diálogo.
- Un error conserva la ruta, el diálogo y la opción de reintentar.
- `SavedMediaDetailsProps` incluye `onDelete` y el componente contiene el botón que emite esa intención.
- La referencia final de `PrivateMediaDetailPage` muestra el origen de `entry` y `mediaTitle`, conserva edición y retries, y conecta el diálogo completo.
- `401`, `404` y fallback tienen mensajes distintos.
- El test dirigido del traductor de errores y `pnpm build` terminan con código 0 en el futuro seed ejecutable.
- El recorrido manual confirma Cancelar, pending, error, éxito, Network, caché e historial.

El test puro no demuestra Modal, Router, Query Client, Firebase, Network o backend. El build tampoco demuestra el comportamiento del navegador.

## Concepto principal

Una eliminación destructiva es un recorrido coordinado, no un botón aislado.

```text
persona
  → abre confirmación
  → reconoce el título
  → confirma
  → DELETE por logId
  → hook espera consistencia de caché
  → página navega con replace
```

### Responsabilidades

| Pieza | Responsabilidad | No hace |
| --- | --- | --- |
| `DeleteMediaDialog` | Presentar título, advertencia, error y acciones | No conoce identidad técnica ni hooks de datos |
| `PrivateMediaDetailPage` | Poseer apertura, `entry`, mutación y navegación | No construye headers ni invalida directamente |
| `deleteMediaLog` | Ejecutar DELETE autenticado por `logId` | No abre UI ni decide rutas |
| `useDeleteMediaLog` | Ejecutar la mutación y aplicar el plan de caché | No navega |
| `invalidateQueriesByKeys` | Repetir una invalidación para cada key | No elige familias de negocio |
| `getDeleteMediaLogErrorMessage` | Traducir errores técnicos a copy local | No cierra sesión ni cambia caché |

## Vocabulario

- **CRUD:** crear, leer, actualizar y eliminar un recurso.
- **Operación destructiva:** acción que retira datos o dificulta recuperarlos desde el producto.
- **Confirmación explícita:** paso separado que identifica la acción y permite cancelarla antes del request.
- **Identidad visible:** dato que una persona reconoce, como el título.
- **Identidad de transporte:** dato que el cliente usa en el contrato HTTP, como `logId`.
- **Stale:** estado de una query cuyos datos ya no deben considerarse actuales.
- **Refetch:** nueva ejecución de una query para recuperar datos actuales.
- **Query activa:** query que tiene un consumidor montado.
- **Navegación programática:** cambio de ruta iniciado por código después de un resultado conocido.
- **Reemplazo de historial:** navegación que sustituye la entrada actual.
- **Doble envío:** segunda ejecución mientras la primera sigue pending.
- **Regresión:** comportamiento anterior que deja de funcionar después de un cambio.

## Decisiones técnicas

### Contrato DELETE

El backend docente expone:

```text
DELETE /api/v2/media/:id
Authorization: Bearer <Firebase ID token>
```

No recibe body. El parámetro `:id` es el `logId` personal.

```ts
export type DeleteMediaLogResponseDto = {
  message: "entry deleted"
}

export function deleteMediaLog(
  logId: string,
): Promise<DeleteMediaLogResponseDto> {
  return requestJsonWithAuth<DeleteMediaLogResponseDto>(
    `${API_URL}/api/v2/media/${encodeURIComponent(logId)}`,
    { method: "DELETE" },
  )
}
```

El frontend declara la forma que consume. No presenta ese type como una descripción exhaustiva del servidor.

### Confirmación y pending

El diálogo recibe props completas:

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

Mientras `isPending` sea `true`:

- el botón Confirmar muestra loading;
- Cancelar queda disabled;
- `closeOnEscape` y `closeOnClickOutside` valen `false`;
- `withCloseButton` vale `false`;
- `onCancel` mantiene una guardia para cualquier cierre restante.

El diálogo permanece montado para mostrar el resultado. No duplica pending con `useState`.

### Tercer consumidor de invalidación

Crear y actualizar ya repiten una operación mecánica. DELETE se convierte en el tercer consumidor y justifica la extracción:

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

El helper no importa `mediaKeys` y no decide qué familias cambian.

### Plan de caché

```ts
export const DELETE_MEDIA_LOG_INVALIDATION_PLAN = () => ({
  refetch: [mediaKeys.lists(), mediaKeys.searches()],
  staleOnly: [mediaKeys.details()],
})
```

| Familia | Cambio observado | Tratamiento |
| --- | --- | --- |
| `lists()` | La biblioteca ya no debe incluir el registro | Invalidación normal |
| `searches()` | El catálogo debe volver a mostrar `isLogged: false` | Invalidación normal |
| `details()` | El detalle privado activo ya no existe | Stale sin refetch inmediato |

TanStack Query marca stale las coincidencias. Con el modo normal, refetchea las activas. La página actual consume un detalle que acaba de desaparecer; refetchearlo antes de navegar produciría un `404` previsible.

No se usa `removeQueries` sobre el detalle activo. El observer podría mostrar loading antes de que React procese la navegación.

### Orden entre hook y página

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

TanStack Query espera el `onSuccess` del hook antes de ejecutar el callback específico pasado a `mutate`.

```ts
deleteMutation.mutate(entry.id, {
  onSuccess: () => {
    navigate("/app/library", { replace: true })
  },
})
```

La mutación mantiene la consistencia remota. La página decide la consecuencia visual.

## Estado inicial, transformación y estado final

### Estado inicial

```text
src/
├── api/
│   ├── http.ts                          conserva ApiError y auth
│   └── media.ts                         create, list, detail y update
├── components/
│   ├── edit-media-log-form.tsx
│   ├── media-log-form.tsx
│   └── saved-media-details.tsx
├── hooks/
│   ├── media-keys.ts
│   └── features/use-media.ts            create y update
├── pages/private-media-detail-page.tsx
└── types/media-api.ts
```

### Transformación guiada

```text
1. Declarar respuesta y fetcher DELETE
2. Extraer invalidateQueriesByKeys
3. Migrar create y update al helper
4. Definir plan y hook DELETE
5. Crear traductor de errores
6. Crear DeleteMediaDialog
7. Integrar estado local, logId y navegación
8. Probar traductor y recorrer regresión
```

### Estado final

```text
src/
├── api/media.ts                         añade deleteMediaLog
├── components/
│   ├── delete-media-dialog.tsx
│   └── saved-media-details.tsx          expone onDelete
├── hooks/
│   ├── invalidation-utils.ts
│   ├── media-keys.ts
│   └── features/use-media.ts            create, update y delete usan helper
├── lib/
│   ├── delete-media-log-error-message.ts
│   └── __tests__/
│       └── delete-media-log-error-message.test.ts
├── pages/private-media-detail-page.tsx  confirma y navega
└── types/media-api.ts
```

## Secuencia · 90 minutos

| Tiempo | Responsable | Actividad | Evidencia |
| ---: | --- | --- | --- |
| 0–10 | Docente y grupo | Recuperar C/R/U, `logId` y preguntas con mayor error. | El grupo identifica el recurso que desaparecerá. |
| 10–22 | Docente y grupo | Contrastar identidad visible, identidad de transporte, confirmación y contrato DELETE. | Título para la persona; `logId` para el path. |
| 22–36 | Construcción guiada | Añadir DTO, fetcher, hook inicial y traductor de errores. | El request previsto usa DELETE, Bearer y ningún body. |
| 36–48 | Docente con participación | Detectar la tercera repetición, extraer el helper y definir el plan de caché. | Listas y búsquedas usan modo normal; detalles usan `none`. |
| 48–61 | Construcción interactiva | Crear el diálogo controlado y representar pending y error. | Cancelar y mecanismos de cierre respetan pending. |
| 61–75 | Estudiantes con guía | Integrar apertura, `mutation.reset()`, confirmación, error y navegación. | Éxito navega; error conserva diálogo y ruta. |
| 75–83 | Trabajo asistido | Entregar al agente la suite del traductor, revisar el diff y ejecutar Vitest. | Solo cambia el test permitido dentro de `__tests__/`. |
| 83–90 | Docente y grupo | Ejecutar build, recorrer C/R/U/D y fijar fronteras de evidencia. | Checkpoint documentado y listo para desplegar. |

**Comprobación:** `10 + 12 + 14 + 12 + 13 + 14 + 8 + 7 = 90`.

## Guion de presentación

El bloque conceptual inicial ocupa 12 minutos. La clase vuelve al deck durante los últimos 3 minutos.

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | C, R y U ya funcionan | Ubicar creación, lista, detalle y edición. Recuperar `externalId` frente a `logId`. | CRUD con D pendiente. |
| Problema | La ruta abierta va a desaparecer | `/app/library/:logId` representa el recurso que DELETE retira. | Pantalla con URL visible antes y después. |
| Confirmación | Una pausa antes del request | Mostrar título y permitir cancelar. La confirmación no autoriza la operación. | Mockup del diálogo. |
| Contrato | DELETE usa `logId` | Token identifica sesión; path identifica registro; no existe body. | Diagrama token + path. |
| Pending | Una operación en curso | Bloquear doble envío y cierre accidental. | Timeline de dos clics. |
| Repetición | El tercer consumidor | Crear, actualizar y eliminar repiten la misma mecánica de invalidación. | Tres fragmentos con el bloque repetido. |
| Límite del helper | Las keys conservan el negocio | El helper repite; cada mutación elige familias. | Caja mecánica bajo tres planes. |
| Caché | Stale puede evitar un refetch | El detalle activo respondería `404` después del DELETE. | Árbol de queries con detalle activo. |
| Navegación | Éxito y destino | El hook espera la caché; la página navega con `replace`. | Historial antes y después. |
| Evidencia | Cada check prueba una parte | Vitest, build, Network y navegador tienen fronteras distintas. | Cuatro cajas de evidencia. |
| Cierre | CRUD completo | La sesión 18 publicará el producto comprobado. | CRUD completo y checklist de despliegue. |

### Preguntas de cierre

1. ¿Por qué Cancelar no invalida ninguna query?
2. ¿Qué respondería el detalle privado si se refetchea después del DELETE y antes de navegar?
3. ¿Qué responsabilidad conserva el hook y cuál conserva la página?
4. ¿Qué evita `replace: true` en el historial?

## Proyecto semilla

### Incluye

- Checkpoint completo de la sesión 15.
- Creación, biblioteca, detalle y edición funcionales.
- `MediaLogForm`, `CreateMediaLogForm` y `EditMediaLogForm`.
- Query keys e invalidaciones explícitas de create y update.
- Cliente HTTP autenticado, `ApiError`, Router, Query Devtools y Vitest.
- Un registro descartable que el docente puede crear con su propia cuenta durante la preparación.

### No incluye

- Botón o diálogo de eliminación.
- DTO, fetcher o hook DELETE.
- `invalidateQueriesByKeys`.
- Plan de invalidación de DELETE.
- Traductor de errores y su test.
- Estado de apertura o navegación posterior.
- Ids, tokens, credenciales o datos de otra persona.

### Checkpoint de rescate

El docente conserva una versión con DTO, fetcher, helper y plan de caché terminados. Esa versión no incluye el diálogo ni la integración de página. Se comparte solo si una falla de herramienta impide llegar a la práctica estudiantil.

## Trabajo con agente

La persona define e implementa primero `getDeleteMediaLogErrorMessage` con tres comportamientos:

1. `ApiError` con status `401` produce el mensaje de autorización.
2. `ApiError` con status `404` produce el mensaje de registro no disponible.
3. Cualquier otro error produce el fallback recuperable.

La clase invoca `ahk-test`. El prompt parte del helper y de la API pública de `ApiError`, usa la matriz decidida por el grupo como fuente del comportamiento y permite crear únicamente:

```text
src/lib/__tests__/delete-media-log-error-message.test.ts
```

No modifica producción, configuración, dependencias u otros tests. La salida identifica archivo, flujo de cada caso, decisiones, supuestos, límites, comando y exit status. Antes de aceptar el archivo, el estudiante revisa imports, casos y expectativas. Después ejecuta el test enfocado.

La suite demuestra el mapping del traductor. No demuestra Modal, pending, Router, Query Client, Firebase, Network o backend.

## Evidencia de salida

- `pnpm test -- delete-media-log-error-message` termina con código 0.
- `pnpm build` termina con código 0.
- Cancelar no produce DELETE en Network.
- Pending impide doble envío y cierre accidental.
- Un error conserva diálogo y ruta.
- El éxito usa `logId`, Bearer y ningún body.
- Query Devtools muestra detalles stale sin refetch inmediato.
- La app navega a `/app/library` y Atrás no vuelve directamente al recurso eliminado.
- La biblioteca omite el registro y la búsqueda vuelve a mostrar `isLogged: false` después de recuperar datos actuales.
- Crear y editar otro registro descartan regresiones.

## Fuera de alcance

- Restaurar o deshacer una eliminación.
- Papelera, período de gracia o borrado masivo.
- Zustand, Context o persistencia para la confirmación.
- Navegar mediante Effect, `onSettled` o render condicional.
- `queryClient.clear()`, limpieza global o `removeQueries` sobre el detalle activo.
- React Testing Library, jsdom, MSW o tests de componentes.
- Notificaciones globales o una librería nueva de toast.
- Cambios, configuración o ejecución de `medialog-server` por estudiantes.
- Contenido React durante la jornada institucional sin horas del sábado 7 de noviembre.

## Cambios retrospectivos

- `draft/index.md` se revisó: la fila de la sesión 16 ya conserva tema, actividad y checkpoint correctos, por lo que no necesita cambios.
- `pre-class-reading.md` continúa alineado con invalidación, `refetchType`, navegación y confirmación; su revisión final actualizó fecha, título, organización, URL y versión de cada fuente.
- La sesión 15 recibió en C07-B las referencias completas de create, update y la página privada que esta sesión transforma.
- La sesión 18 recibe el CRUD completo, `invalidateQueriesByKeys` y una página privada integrada para comprobar y publicar el producto.
- Las reglas se revisaron sin cambio: C04 ya cubre la trazabilidad de símbolos y la revisión final aplicó los contratos existentes de lectura previa, metadatos de guía y trabajo con agente.
