# Sesión 15 · Edición y reutilización

> Estado: paquete textual aprobado definitivamente. La presentación visual y el proyecto progresivo o seed ejecutable permanecen pendientes de sus frentes correspondientes.

- **Fecha:** jueves 29 de octubre de 2026
- **Semana:** 6
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Seed propuesto:** `s06-c15-edit-reuse-seed`

## Archivo de hooks de esta sesión

Añade `useUpdateMediaLog`; conserva `useCreateMediaLog` y los hooks de lectura. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 14:

- `/app/library/:logId` obtiene una entrada privada por `logId` con Bearer.
- `mediaDetailSelectorSchema` valida las identidades externas y `MediaDetailSelector` se importa desde `src/schemas/media-detail.ts`; no se redeclara en el checkpoint.
- `PrivateMediaDetailPage` representa URL inválida, carga, error, `entry: null` y éxito.
- `entry` contiene `id`, `status`, `priority` y `notes`.
- `SavedMediaDetails` muestra esos campos como lectura.
- `CreateMediaLogForm` crea desde una identidad de catálogo y ya maneja pending, error y cierre exitoso.
- `mediaLogFormSchema`, `MediaLogFormValues` y `toCreateMediaLogBody` existen desde la sesión 11.
- `mediaKeys.lists()` y `mediaKeys.details()` identifican las familias privadas afectadas por una actualización.
- Vitest funciona en Node y todos los tests y su soporte exclusivo viven dentro de `__tests__/`.

El seed todavía duplica cero campos de edición: no existe `MediaLogForm`, `EditMediaLogForm`, `toMediaLogFormValues`, `PUT` ni modal de edición.

## Limitación visible

Los mismos tres valores personales aparecen en dos intenciones:

```text
crear desde catálogo
  → status + priority + notes

editar un registro existente
  → status + priority + notes
```

Copiar el formulario completo resolvería el caso inmediato, pero dejaría dos schemas visuales, dos grupos de inputs y dos reglas de reset. Un único componente con `mode` también mezclaría identidades incompatibles.

La extracción se justifica recién ahora: edición es el segundo consumidor real.

## Resultado de aprendizaje

El estudiante separará la mecánica compartida de un formulario de las identidades y mutaciones que pertenecen a cada caso de uso, inicializará edición desde un snapshot remoto sin Effects y conectará una actualización pesimista que cierre solo después de invalidar las lecturas afectadas y esperar el refetch activo.

## Checkpoint de salida

Al terminar:

- `MediaLogForm` es dueño de `useForm`, schema, campos, validación y acciones.
- `MediaLogFormProps` y `MediaLogForm` tienen una referencia completa con imports, opciones, controles y acciones.
- `CreateMediaLogForm` conserva identidad de catálogo, adapter, mutación y copy de creación.
- `CreateMediaLogFormProps`, `getCreateMediaLogErrorMessage` y el wrapper refactorizado aparecen definidos antes de sus consumidores.
- `EditMediaLogForm` conserva `entry`, adapter, mutación y copy de edición.
- `getUpdateMediaLogErrorMessage` vive en `src/lib/media-log-errors.ts`; `EditMediaLogFormProps` y el wrapper tienen referencias completas e importan ese helper.
- No existe un prop `mode` acompañado de identidades opcionales.
- `CREATE_MEDIA_LOG_INITIAL_VALUES` conserva los defaults de creación.
- Crear desde búsqueda y detalle público funciona después del refactor.
- `toMediaLogFormValues(entry)` convierte el DTO en snapshot inicial y transforma `notes: null` en `""`.
- `toUpdateMediaLogBody(values)` produce únicamente `status`, `priority` y `notes`; notas vacías o con espacios producen `null`.
- El editor se monta solo cuando existe `entry` y usa `key={entry.id}`.
- No existe un Effect que copie `entry` al formulario.
- Reset restaura el snapshot inicial; cancelar cierra y desmonta; cambiar de `entry.id` crea otra instancia.
- `form.key(field)` continúa siendo la key de cada input uncontrolled, no la identidad del registro.
- `updateMediaLog` envía `PUT /api/v2/media/:logId` con Bearer.
- Los adapters, `updateMediaLog` y `useUpdateMediaLog` muestran sus imports y archivos de destino.
- `UPDATE_MEDIA_LOG_INVALIDATION_KEYS()` contiene `mediaKeys.lists()` y `mediaKeys.details()`.
- `useUpdateMediaLog` espera ambas invalidaciones mediante un bloque explícito; por defecto, solo las queries activas hacen refetch inmediato.
- La búsqueda pública no se invalida porque status, prioridad y notas no cambian catálogo.
- El modal conserva valores y permanece abierto ante error.
- El modal cierra solo después del éxito confirmado y del refetch activo del detalle; la lista queda stale y vuelve a consultarse al regresar a la biblioteca.
- La referencia final de `PrivateMediaDetailPage` conserva los retries de `error` y `unavailable`, refina `entry` antes de usarlo y muestra el consumidor completo del editor.
- El test dirigido de los adapters y `pnpm build` terminan con código 0 en el seed ejecutable.

El test puro no demuestra Mantine, modal, Firebase, Query, Network o backend. Esas fronteras requieren evidencia separada.

## Concepto principal

La reutilización separa mecanismo estable y contexto variable:

```text
CreateMediaLogForm                 EditMediaLogForm
identity + POST                    entry/logId + PUT
create adapter                     edit adapters
create errors                      update errors
          \                         /
           MediaLogForm
           useForm + schema
           status + priority + notes
           reset + submit + cancel
```

El componente compartido recibe values y callbacks completos:

```ts
type MediaLogFormProps = {
  initialValues: MediaLogFormValues
  submitLabel: string
  isPending: boolean
  errorMessage: string | null
  onSubmit: (values: MediaLogFormValues) => void
  onCancel: () => void
}
```

No recibe catálogo, `entry`, mutation objects, Query Client, token o un `mode`.

## Vocabulario

- **Consumidor:** componente que utiliza un contrato compartido.
- **Extracción:** mover comportamiento repetido detrás de una interfaz común.
- **Wrapper:** componente delgado que aporta identidad, side effects y copy a una pieza compartida.
- **Snapshot inicial:** values que representan el registro al montar una instancia del formulario.
- **Actualización pesimista:** interfaz que espera confirmación remota antes de mostrar el cambio como guardado.
- **Remount:** desmontaje de una instancia y montaje de otra por cambio de posición o `key`.
- **Identidad de componente:** combinación de posición y key con la que React preserva o reinicia estado.
- **Key de input:** valor que Mantine usa para actualizar un input uncontrolled cuando cambian sus values.
- **Invalidación:** marca una query relacionada como stale y puede provocar su refetch.
- **Coherencia observada:** momento en que las lecturas visibles ya reflejan la escritura confirmada.

## Decisiones técnicas

### Compartir la mecánica, no las identidades

`MediaLogForm` contiene únicamente lo que creación y edición hacen igual. Los wrappers conservan las diferencias:

| Responsabilidad | Crear | Compartido | Editar |
| --- | --- | --- | --- |
| Identidad | Catálogo | — | `logId` |
| Values y schema | — | Sí | — |
| Inputs y validación | — | Sí | — |
| Body | `toCreateMediaLogBody` | — | `toUpdateMediaLogBody` |
| Request | POST | — | PUT |
| Errores | Crear | Presentar mensaje | Actualizar |

### Snapshot sin Effect

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

El modal monta el wrapper solo cuando hay datos:

```tsx
{isEditOpen && entry ? (
  <EditMediaLogForm
    key={entry.id}
    entry={entry}
    onUpdated={closeEdit}
    onCancel={closeEdit}
  />
) : null}
```

`key={entry.id}` expresa que otro registro es otra instancia. No se usa `useEffect(() => form.setValues(...), [entry])`.

### Reset, cancelar y cambiar de registro

- `form.reset()` vuelve a los `initialValues` de la instancia y limpia errores.
- Cancelar llama al wrapper y desmonta el formulario al cerrar el modal.
- Cambiar `entry.id` remonta el árbol y crea otro snapshot.
- `form.key("status")` pertenece al `Select` uncontrolled; no sustituye `key={entry.id}`.

### Body mínimo

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
```

El adapter no envía título, fechas, `userId`, catálogo o `logId` dentro del body.

### Mutación pesimista

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

El bloque permanece explícito. El tercer consumidor aparecerá con DELETE en la sesión 16 y allí se evaluará una extracción.

## Secuencia · 90 minutos

| Tiempo | Responsable | Actividad | Evidencia |
| ---: | --- | --- | --- |
| 0–10 | Docente y grupo | Recuperar creación y detalle privado; localizar el segundo consumidor. | El grupo separa campos compartidos de identidades y side effects. |
| 10–26 | Construcción guiada | Diseñar props y extraer `MediaLogForm`. | El componente compartido no conoce catálogo, entry ni mutations. |
| 26–36 | Docente con participación | Reconstruir `CreateMediaLogForm` como wrapper y probar regresión. | Crear desde búsqueda y detalle sigue produciendo un POST válido. |
| 36–48 | Construcción interactiva | Crear adapters y contrastar reset, desmontaje, key de componente y key de input. | Un snapshot inicial se restaura sin Effect. |
| 48–62 | Docente y grupo | Declarar tipos, fetcher y mutación PUT con invalidaciones explícitas. | Network y Devtools muestran PUT, ambas familias stale y refetch inmediato del detalle activo. |
| 62–76 | Estudiantes con guía | Montar `EditMediaLogForm`, modal, pending, éxito y errores. | El modal conserva values al fallar y cierra después de coherencia. |
| 76–84 | Trabajo asistido | Entregar al agente solo la suite de adapters, revisar diff y ejecutar test. | Test y soporte quedan dentro de `__tests__/`. |
| 84–90 | Docente y grupo | Ejecutar build, recorrer evidencia y fijar frontera con DELETE. | Checkpoint documentado y eliminación reservada. |

**Comprobación:** `10 + 16 + 10 + 12 + 14 + 14 + 8 + 6 = 90`.

## Guion de presentación

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Apertura | La segunda copia todavía no existe | Mostrar creación y campos de lectura; preguntar qué se repetiría. | Dos recorridos convergen en tres campos. |
| Evidencia | Dos consumidores justifican extraer | Contrastar abstracción anticipada con duplicación real. | Marcar sesión 11 y sesión 15 en una línea temporal. |
| Responsabilidades | Centro estable, bordes distintos | Formulario compartido frente a wrappers. | Diagrama de tres cajas. |
| Props | Estados válidos completos | Evitar `mode` e identidades opcionales. | Tabla crear/compartido/editar. |
| Regresión | Reutilizar no debe romper crear | Refactorizar creación antes de añadir PUT. | POST observable como red de seguridad. |
| Snapshot | El DTO inicia; el form continúa | Derivar initial values una vez, sin Effect. | Flecha `entry → adapter → initialValues`. |
| Identidad | Dos keys, dos trabajos | `key={entry.id}` frente a `form.key(field)`. | Árbol de componente y tres inputs. |
| Reset | Volver, cerrar y cambiar no son iguales | Reset local, desmontaje y remount. | Tres acciones con tres resultados. |
| Contrato | Editar no reenvía todo el DTO | Body mínimo y `notes: null`. | DTO grande frente a body pequeño. |
| Consistencia | Invalidar no siempre significa refetch inmediato | PUT, ambas familias stale, refetch activo y cierre. | Timeline pesimista con lista inactiva. |
| Error | Fallar no borra el trabajo | Modal abierto y values conservados. | Network fallido junto al formulario. |
| Agente | La matriz humana es el oráculo | Suite pura dentro de `__tests__/`. | Caja de archivos permitidos. |
| Cierre | C, R y U completos | DELETE aparece en la siguiente sesión. | CRUD con D atenuada. |

## Proyecto semilla

### Incluye

- Checkpoint completo de la sesión 14.
- `CreateMediaLogForm`, schema, values y adapter de creación.
- Mutación POST y estados de creación.
- Ruta privada con `entry` cargado y visible.
- `mediaKeys.lists()` y `mediaKeys.details()`.
- Cliente HTTP autenticado y `ApiError`.
- Mantine Form uncontrolled, Vitest y tests anteriores en `__tests__/`.

### No incluye

- `MediaLogForm` compartido.
- Wrappers refactorizados.
- Adapters de values o body de edición.
- Tipos, fetcher o hook de actualización.
- Modal o botón de edición.
- Test nuevo.
- DELETE, confirmación, navegación posterior.

## Trabajo con agente

La persona define e implementa ambos adapters y acuerda:

1. `notes: null` produce `notes: ""` en values.
2. Status y prioridad se preservan.
3. Notas con contenido se recortan al crear el body.
4. Notas vacías o con espacios producen `null`.
5. El body contiene solamente status, prioridad y notas.

El agente solo puede crear:

```text
src/adapters/__tests__/media-log-form-edit-adapters.test.ts
```

Esta delegación no necesita fixtures, builders, helpers ni archivos adicionales. La invocación de `ahk-test` prohíbe modificar producción, configuración, dependencias u otros tests y se detiene si requiere ampliar el alcance.

## Fuera de alcance

- `DELETE`, confirmación destructiva o navegación después de eliminar.
- Helper genérico de invalidaciones.
- Editar título, poster, fechas, catálogo, `userId` o identidad.
- Un formulario con `mode` y props opcionales.
- Copiar `entry` a values mediante Effect.
- Guardar values, entry o mutation state en Zustand.
- Invalidar búsquedas públicas por cambios personales.
- Loaders, actions, Data Mode o fetching mediante Effect.
- React Testing Library, jsdom, MSW o tests de componentes.
- Cambios en `medialog-server`.

## Cambios retrospectivos

- `draft/index.md` se revisó: la fila de la sesión 15 ya conserva tema, actividad y checkpoint correctos, por lo que no necesita cambios.
- La sesión 13 recibió en C07-A el contrato y la referencia completa de creación; la sesión 14 recibió los contratos y la página privada completos. Esta sesión puede referenciarlos sin redeclarar versiones locales.
- `pre-class-reading.md` conserva snapshot, reset, remount y keys; la revisión final añadió organización, versión y fecha de verificación a sus fuentes.
- La sesión 16 recibe C, R y U completos y conserva DELETE como dificultad propia.
- `getUpdateMediaLogErrorMessage` vive en `src/lib/media-log-errors.ts`; edición importa el traductor y conserva los mensajes locales.
- `rules/course-architecture.md`, `rules/code-and-naming.md` y `rules/agent-assisted-development.md` ya contienen las decisiones reutilizables y no necesitan otra edición.
