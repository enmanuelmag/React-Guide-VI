# Clase 17 · Mutaciones e invalidación

- **Semana:** 6
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** `CreateMediaLogForm`, `CreateCatalogMediaLogBody` y `toCreateMediaLogBody` comprobados localmente en la clase 16; sesión Firebase, `ApiError` y `requestJsonWithAuth<T>` disponibles desde las clases 14 y 15
- **Checkpoint de salida:** una persona autenticada crea una película o serie una sola vez; el formulario representa pendiente y errores, y las queries de búsqueda y detalle se actualizan hasta reflejar `isLogged: true`

## Resultado de aprendizaje

El estudiante podrá distinguir una lectura de una escritura remota, ejecutar una mutación con variables tipadas y mantener coherentes las queries afectadas mediante invalidación. También podrá explicar por qué una respuesta pública que cambia según la sesión necesita autenticación opcional y una query key aislada por usuario.

## Limitación que abre la clase

La clase 16 ya produce el body correcto, pero el submit termina dentro del navegador:

```text
formulario
→ validación
→ toCreateMediaLogBody
→ preview local
→ fin
```

Todavía faltan cinco comportamientos observables:

1. Enviar el body con el Firebase ID token.
2. Impedir que varios clics creen requests simultáneos.
3. Mantener el formulario abierto cuando el servidor rechaza la operación.
4. Cerrar el modal solamente después de un éxito confirmado.
5. Actualizar las respuestas en caché que todavía dicen `isLogged: false`.

Esta clase sustituye el preview; no vuelve a definir campos, schema, valores iniciales ni transformación de notas.

## Contrato remoto confirmado

```text
POST /api/v2/media/create
Authorization: Bearer <Firebase ID token>
Content-Type: application/json
```

El request usa el `CreateCatalogMediaLogBody` construido en la clase anterior. Una respuesta exitosa usa status `201` y devuelve el registro creado. El backend entrega más campos, pero esta clase solo necesita conservar el identificador generado:

```ts
export type CreatedMediaLogDto = {
  id: string
}
```

TypeScript permite describir el subconjunto que el frontend utiliza. El servidor no elimina los demás campos; simplemente no se convierten todavía en dependencias de esta pantalla.

Los errores relevantes para el caso son:

| Status | Interpretación en esta pantalla |
| --- | --- |
| `401` | El backend no aceptó una identidad autenticada para el request. |
| `404` | El catálogo ya no pudo resolver el medio solicitado. |
| `409` | La persona ya tiene ese medio en su biblioteca. |
| Otro o sin status | No existe información suficiente para dar un mensaje específico. |

Un `401` no cierra sesión automáticamente. `ApiError` conserva el status y este caso de uso decide el mensaje.

### Prerrequisito del entorno docente

Antes de impartir la clase, el docente comprueba en la rama `bootcamp` que:

- búsqueda y detalle aceptan llamadas anónimas;
- si reciben un Bearer válido, calculan `isLogged` para esa identidad;
- creación continúa exigiendo Bearer y responde `201`, `401`, `404` o `409` según el caso;
- CORS permite `Authorization` desde el origen del proyecto estudiantil.

Esta preparación ocurre fuera de la sesión. Los estudiantes no cambian middleware, rutas, variables, jobs o código del backend; solo consumen la URL entregada.

## Gap necesario: público no significa siempre anónimo

Búsqueda y detalle son rutas públicas: una persona sin sesión debe poder consultarlas. Sin embargo, ambas respuestas contienen `isLogged`, cuyo valor cambia cuando el request identifica a un usuario.

```text
mismo detalle de catálogo

request anónimo                 request con Bearer
→ isLogged: false               → isLogged: true o false para ese usuario
```

Si la invalidación repite siempre un request anónimo, `isLogged` continuará en `false` después de crear. La clase introduce una tercera intención HTTP:

| Helper | Sesión requerida | Comportamiento |
| --- | --- | --- |
| `requestJson<T>` | No | Nunca añade Bearer. |
| `requestJsonWithOptionalAuth<T>` | No | Añade Bearer si Firebase tiene usuario; de lo contrario conserva el request público. |
| `requestJsonWithAuth<T>` | Sí | Exige usuario y añade Bearer; se usa para crear y listar. |

La autenticación opcional no vuelve privada la ruta. Permite enriquecer una respuesta pública con información del usuario cuando existe una identidad verificada.

## La sesión también forma parte de la identidad de caché

Una query key describe la respuesta que se guarda. Si el mismo request puede devolver otro `isLogged` según la sesión, la sesión debe distinguir sus entradas:

```text
["media", "detail", { externalId: "438631", mediaType: "movie", authScope: "anonymous" }]
["media", "detail", { externalId: "438631", mediaType: "movie", authScope: "firebase-uid" }]
```

`authScope` no se envía al backend y no reemplaza el token. Solo evita que TanStack Query trate la respuesta anónima y la respuesta de una persona como si fueran el mismo dato.

Durante `checking`, las queries permanecen deshabilitadas. Así la restauración de Firebase decide primero si la key será anónima o pertenecerá al `uid` autenticado.

## Conceptos que se enseñan y consolidan

- Query frente a mutación.
- Fuente de verdad remota.
- Variables de una mutación.
- Estados `idle`, `pending`, `error` y `success`.
- `mutate` y callbacks por ejecución.
- Bloqueo de doble envío mediante `isPending`.
- Endpoint público con autenticación opcional.
- Scope de sesión dentro de una query key.
- Invalidación por prefijo de query key.
- Query activa frente a query inactiva.
- `onSuccess` asíncrono y espera de invalidaciones.
- Traducción de `ApiError.status` a feedback de interfaz.
- Éxito pesimista: la interfaz espera confirmación del servidor.

## Mapa de responsabilidades

| Pieza | Responsabilidad al cerrar la clase | Lo que no hace |
| --- | --- | --- |
| `requestJsonWithOptionalAuth<T>` | Enviar Bearer cuando existe sesión sin impedir el acceso anónimo. | No guarda tokens ni decide query keys. |
| `searchMedia` y `getMediaDetail` | Consultar endpoints públicos con autenticación opcional. | No leen Context ni administran caché. |
| `mediaKeys` | Separar búsqueda y detalle por inputs y `authScope`. | No obtiene el token ni invalida por sí sola. |
| `createMediaLog` | Ejecutar el `POST` autenticado y devolver el resultado mínimo. | No muestra errores ni toca la caché. |
| `useCreateMediaLog` | Ejecutar la mutación e invalidar las familias afectadas después del éxito. | No abre o cierra el modal. |
| `CreateMediaLogForm` | Convertir values a body, disparar la mutación y representar pending/error. | No obtiene el token ni conoce Query Client. |
| `MediaDetailPage` | Abrir el modal, cerrarlo tras el éxito y mostrar la acción según `isLogged`. | No construye el body ni llama `fetch`. |
| Clase 18 | Crear la primera query privada de lista y ampliar la invalidación. | No se adelanta en esta clase. |

## Guion de presentación

### Propósito y duración

La presentación inicial ocupa 18 minutos. Recupera el body local, introduce la diferencia entre leer y escribir y hace visible el problema de una caché que conserva `isLogged: false`. El cierre vuelve al deck para reconstruir el recorrido completo.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Tenemos una intención, no un registro | Recuperar `values → schema → adaptador → body`. El preview demuestra forma, pero no persistencia. | Mostrar el Network vacío de la clase 16 y preguntar dónde vive la fuente de verdad. |
| Distinción | Una query lee; una mutación cambia | `useQuery` representa una lectura repetible identificada por una key. `useMutation` ejecuta una operación cuando ocurre un evento. | Dos carriles: `render necesita datos` y `persona pulsa Guardar`. Evitar definir mutación como “cualquier POST”; importa que cambia estado remoto. |
| Ciclo | La escritura también tiene estados | Antes de ejecutar está idle; durante el request está pending; después termina en error o success. | Máquina de cuatro estados. Relacionar `isPending` con el botón, no con un boolean manual. |
| Variables | El body viaja como variable | `mutate(body)` entrega a `mutationFn` exactamente el objeto validado. No se vuelve a leer el formulario dentro del fetcher. | Flecha `MediaLogFormValues → body → mutate(body) → createMediaLog(body)`. |
| Riesgo | Dos clics pueden ser dos requests | Las mutaciones pueden ejecutarse en paralelo. El botón debe bloquearse mientras `isPending` sea verdadero. El `409` sigue siendo una defensa del servidor, no la estrategia normal de UI. | Timeline con dos clics. No introducir `scope` serial ni debounce. |
| Gap | Invalidar no cambia la identidad del request | Si detalle refetchea sin Bearer, vuelve a recibir `isLogged: false`. Primero se corrige cómo consulta una sesión autenticada. | Comparar el mismo endpoint anónimo y autenticado. No mostrar ni copiar el token. |
| Caché | La sesión distingue respuestas | Texto, tipo e identidad de catálogo no bastan cuando `isLogged` depende del usuario. `authScope` separa anónimo, usuario A y usuario B. | Árbol de keys. Aclarar que el `uid` identifica caché; Bearer autentica el request. |
| Contrato raíz | La respuesta puede incluir una entrada personal | `MediaDetailDto` conserva `catalog`, `entry` e `isLogged`. El detalle público todavía representa catálogo e `isLogged`; `entry` permanece nullable hasta que la ruta privada la consuma en la clase 19. | Objeto raíz con la rama `entry` atenuada. No adelantar status, prioridad o notas. |
| Consistencia | Una creación afecta más de una lectura | Crear cambia el detalle actual y cualquier búsqueda que contenga ese resultado. Invalidar sus prefijos marca todas las variantes como stale. | Árbol `mediaKeys.searches()` y `mediaKeys.details()`. La biblioteca se muestra atenuada como “clase 18”. |
| Activa/inactiva | No todo refetch ocurre ahora | El detalle montado está activo y refetchea. La búsqueda anterior está inactiva: queda stale y se actualizará cuando vuelva a montarse. | Captura de Query Devtools antes y después. No afirmar que todos los requests se repiten de inmediato. |
| Espera | El éxito visual necesita datos coherentes | `onSuccess` retorna la promesa de `Promise.all`. `isPending` continúa hasta terminar las invalidaciones activas; después se cierra el modal. | Línea temporal `201 → invalidate → refetch detail → pending false → onCreated`. |
| Errores | Un status permite mensajes distintos | `401`, `404` y `409` tienen recuperaciones diferentes. Un error desconocido conserva un mensaje neutral. | Tabla status/mensaje. No usar el texto del servidor como única lógica de decisión. |
| Límite | Todavía no existe una biblioteca consultada | No crear `mediaKeys.lists()`, lista, navegación automática ni Zustand. La clase 18 introduce la lectura privada. | Puente explícito al taller presencial. |

### Diagrama principal para las diapositivas

```text
CreateMediaLogForm
      │ values válidos
      ▼
toCreateMediaLogBody
      │ CreateCatalogMediaLogBody
      ▼
mutation.mutate(body)
      │
      ▼
useCreateMediaLog
      │ mutationFn
      ▼
createMediaLog ──→ requestJsonWithAuth ──→ POST /api/v2/media/create
                                                     │
                                                   201
                                                     │
                                                     ▼
                                      CREATE_MEDIA_LOG_INVALIDATION_KEYS
                                      ├── mediaKeys.searches()
                                      └── mediaKeys.details()
                                                     │
                                                     ▼
                                    detalle activo refetchea con Bearer
                                                     │
                                                     ▼
                                              isLogged: true
```

### Contrastes y notas docentes que deben sobrevivir a las slides

- Una mutación no es estado local del formulario. Representa una operación cuya fuente de verdad vive en el servidor.
- `mutate` recibe el body como variable; no recibe el evento del formulario ni vuelve a consultar inputs.
- `isPending` proviene de TanStack Query. No crear un segundo `isSubmitting` con `useState` para la misma operación.
- El botón bloqueado reduce duplicados, pero el backend conserva su restricción y puede responder `409`.
- `requestJsonWithOptionalAuth` se usa solo en endpoints que admiten anonimato y enriquecen la respuesta con sesión. No reemplaza todos los helpers.
- `authScope` no es una credencial. Puede aparecer en Devtools; el token no.
- La key usa `uid`, no email, porque el correo puede ser nullable, cambiar y mostrarse en UI; el `uid` es la identidad estable entregada por Firebase para este contexto.
- Durante `checking`, no ejecutar una query pública dependiente de sesión. Esperar evita una entrada anónima transitoria y un request innecesario.
- Invalidar una key de prefijo no elimina la caché. La marca stale y, por defecto, las queries activas coincidentes pueden refetchear.
- El detalle actual está activo. La búsqueda desde la que se navegó normalmente está inactiva, por lo que no debe esperarse otro request de búsqueda inmediato.
- `CREATE_MEDIA_LOG_INVALIDATION_KEYS` enumera efectos conocidos del caso de uso; no es una query key nueva.
- `mediaKeys.lists()` no existe aún. Se añade cuando la clase 18 construya la primera lista y entonces se amplía esta constante.
- Esperar `Promise.all` conserva `isPending` hasta completar el refetch activo. Si no se retorna la promesa, el modal podría cerrar antes de que el detalle se actualice.
- El callback `onCreated` pertenece al componente y cierra el modal. La invalidación pertenece al hook y debe ocurrir aunque otro consumidor use la misma mutación en el futuro.
- `409` no se trata como éxito silencioso. El formulario permanece abierto y explica que el medio ya existe.
- No se usa `useEffect` para observar `isSuccess`, cerrar el modal o invalidar. Todos son efectos de una operación conocida y caben en callbacks de la mutación.
- La clase espera `201` y el refetch antes de mostrar el resultado confirmado.
- No se instala un sistema de notificaciones. El error vive junto al submit y el éxito se comprueba mediante el cambio real de `isLogged`.

### Snippets conceptuales para las slides

Variable de mutación:

```ts
mutation.mutate(body)
```

Identidad de caché dependiente de sesión:

```ts
const authScope =
  authState.status === "authenticated" ? authState.user.uid : authState.status
```

Invalidación esperada:

```ts
onSuccess: async () => {
  await Promise.all(
    CREATE_MEDIA_LOG_INVALIDATION_KEYS().map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    ),
  )
}
```

Los snippets muestran una decisión por slide. El helper, los hooks y el formulario completos se construyen en el editor.

### Cierre conceptual

El cierre recupera estas preguntas:

1. ¿Por qué el preview de la clase 16 no equivale a una mutación exitosa?
2. ¿Qué objeto recibe `mutate` y quién lo construye?
3. ¿Por qué búsqueda y detalle necesitan Bearer opcional y `authScope`?
4. ¿Qué diferencia existe entre invalidar una query activa y una inactiva?
5. ¿Por qué el modal cierra después de esperar las invalidaciones?
6. ¿Qué nueva familia de keys aparecerá recién en la clase 18?

## Estado inicial y transformación de archivos

El checkpoint 16 ya contiene formulario, schema, adaptador, cliente HTTP y queries públicas. La clase modifica responsabilidades existentes y agrega un solo fetcher remoto:

```text
src/
├── api/
│   ├── http.ts                           añade optional auth
│   └── media.ts                          añade createMediaLog y cambia lecturas públicas
├── components/
│   └── create-media-log-form.tsx         reemplaza preview por mutación
├── hooks/
│   ├── features/
│   │   └── use-media.ts                  añade scope y useCreateMediaLog
│   └── media-keys.ts                     añade authScope a keys concretas
├── pages/
│   └── media-detail-page.tsx             representa isLogged y cierre exitoso
└── types/
    └── media-api.ts                      añade CreatedMediaLogDto
```

No se crea una ruta, página de lista, store, Effect ni archivo de backend.

## Flujo del código

### Estado 1 · Reproducir el problema antes de abstraer

El docente conserva temporalmente el preview y dibuja el comportamiento esperado. Después ejecuta un detalle autenticado con el fetcher público existente y comprueba que el request no contiene `Authorization`.

La pregunta no es “¿funciona el endpoint?”, sino:

> Si el servidor no sabe quién consulta, ¿cómo podría devolver el `isLogged` de esa persona?

La demostración evita prometer que una invalidación corrige por sí sola un request construido con identidad incorrecta.

### Estado 2 · Añadir autenticación opcional sin duplicar Bearer

`src/api/http.ts` conserva los dos helpers de la clase 15 y añade:

```ts
export function requestJsonWithOptionalAuth<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  return auth.currentUser === null
    ? requestJson<T>(url, init)
    : requestJsonWithAuth<T>(url, init)
}
```

El helper no llama otra vez a `getIdToken` ni reconstruye headers. Cuando existe usuario delega en la ruta autenticada ya comprobada; cuando no existe conserva el request público.

Una salida de sesión que ocurra exactamente entre ambas comprobaciones puede hacer que `requestJsonWithAuth` rechace por falta de usuario. Es preferible a enviar una identidad incompleta: el cambio de `authScope` desmontará ese consumidor y la nueva query anónima podrá ejecutarse con su propia key.

`searchMedia` y `getMediaDetail` sustituyen solo el helper final:

```ts
return requestJsonWithOptionalAuth<MediaSearchItemDto[]>(url, init)
```

```ts
return requestJsonWithOptionalAuth<MediaDetailDto>(url)
```

El `POST /api/v2/media/create` no usa optional auth. Crear exige sesión y conservará `requestJsonWithAuth`.

### Estado 3 · Aislar las queries por sesión

Las familias de prefijo permanecen estables; cambian las keys concretas:

```ts
export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  search: (query: string, mediaType: MediaType, authScope: string) =>
    [...mediaKeys.searches(), { query, mediaType, authScope }] as const,
  details: () => [...mediaKeys.all, "detail"] as const,
  detail: (
    externalId: string,
    mediaType: MediaType,
    authScope: string,
  ) =>
    [...mediaKeys.details(), { externalId, mediaType, authScope }] as const,
}
```

`useMediaSearch` y `useMediaDetail` consumen la sesión desde el único `AuthProvider` existente:

```ts
const authState = useAuth()
const authScope =
  authState.status === "authenticated" ? authState.user.uid : authState.status
const authReady = authState.status !== "checking"
```

Cada hook añade `authScope` a su key y combina su condición anterior con `authReady`. En detalle:

```ts
export function useMediaDetail(input: GetMediaDetailInput | null) {
  const authState = useAuth()
  const authScope =
    authState.status === "authenticated" ? authState.user.uid : authState.status
  const externalId = input?.externalId ?? ""
  const mediaType = input?.mediaType ?? "movie"

  return useQuery({
    queryKey: mediaKeys.detail(externalId, mediaType, authScope),
    queryFn: () => getMediaDetail({ externalId, mediaType }),
    enabled: authState.status !== "checking" && input !== null,
  })
}
```

El hook continúa llamándose incondicionalmente desde la página. `enabled` expresa ahora dos precondiciones: URL válida y restauración de sesión terminada.

En `useMediaSearch` se conserva además la condición de query confirmada con al menos dos caracteres. La clase no recupera el flujo completo de búsqueda; solo propaga la nueva dimensión de identidad.

### Estado 4 · Crear el fetcher autenticado

`src/types/media-api.ts` añade el resultado mínimo:

```ts
export type CreatedMediaLogDto = {
  id: string
}
```

`src/api/media.ts` ya contiene búsqueda y detalle. Se añade:

```ts
export function createMediaLog(
  body: CreateCatalogMediaLogBody,
): Promise<CreatedMediaLogDto> {
  return requestJsonWithAuth<CreatedMediaLogDto>(
    `${API_URL}/api/v2/media/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
}
```

El fetcher recibe el body ya válido. No conoce Mantine Form, no normaliza notas, no lee la URL y no obtiene `userId`.

Antes de crear el hook, el docente puede ejecutar un único probe controlado con una identidad no guardada. Debe retirarlo inmediatamente: el request real se disparará desde el formulario y no desde un botón de diagnóstico permanente.

### Estado 5 · Construir la mutación y observar sus estados

`src/hooks/features/use-media.ts` amplía sus imports con `useMutation` y `useQueryClient`. Primero se implementa el hook con una sola invalidación explícita de detalle para que el grupo observe el efecto. Después aparece la necesidad de agrupar todas las lecturas afectadas:

```ts
export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
]

export function useCreateMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMediaLog,
    onSuccess: async () => {
      await Promise.all(
        CREATE_MEDIA_LOG_INVALIDATION_KEYS().map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      )
    },
  })
}
```

La constante vive junto al hook de la entidad porque documenta qué lecturas quedan desactualizadas después de crear. `mediaKeys` continúa siendo el único lugar que construye las keys.

No se extrae todavía `invalidateQueriesByKeys`. Existe una sola mutación en el curso y el `Promise.all` es parte del concepto que se desea mostrar. Cuando edición y eliminación repitan el patrón, una clase posterior podrá justificar el helper.

El docente inspecciona:

```text
antes de mutate → isIdle: true
durante POST     → isPending: true
error HTTP       → isError: true + error
201 + refetch    → isSuccess: true + data.id
```

### Estado 6 · Sustituir el preview por la operación remota

`CreateMediaLogForm` elimina `useState`, `Code`, `preparedBody`, `setPreparedBody` y `onValuesChange`. Su contrato añade un evento de dominio:

```ts
interface CreateMediaLogFormProps {
  identity: GetMediaDetailInput
  title: string
  onCancel: () => void
  onCreated: () => void
}
```

Dentro del componente:

```tsx
const createMutation = useCreateMediaLog()

function handleSubmit(values: MediaLogFormValues) {
  const body = toCreateMediaLogBody(identity, values)

  createMutation.mutate(body, {
    onSuccess: onCreated,
  })
}
```

El `onSuccess` definido dentro de `useCreateMediaLog` espera la invalidación. El callback específico pasado a `mutate` se ejecuta después y cierra esta interfaz concreta. Así el hook conserva consistencia remota y el componente conserva interacción visual.

El final del formulario representa el error y las acciones:

```tsx
{createMutation.isError && (
  <Alert color="red" title="No se pudo agregar">
    {getCreateMediaLogErrorMessage(createMutation.error)}
  </Alert>
)}

<Group justify="flex-end">
  <Button
    disabled={createMutation.isPending}
    onClick={onCancel}
    type="button"
    variant="default"
  >
    Cancelar
  </Button>
  <Button loading={createMutation.isPending} type="submit">
    Guardar
  </Button>
</Group>
```

`loading` comunica la operación y bloquea el submit. `disabled` en Cancelar evita iniciar esa acción desde el botón durante la comprobación. No se presenta como cancelación del request ni se introduce `AbortController`.

El botón cambia de “Preparar body” a “Guardar” porque ahora sí existe una operación remota.

### Estado 7 · Traducir errores sin mezclar capas

El formulario mantiene una función local porque es el único consumidor de estos mensajes:

```ts
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
```

La función decide copy de interfaz; `ApiError` conserva información de transporte. No se mueve el mensaje visual al helper HTTP ni se compara el texto exacto entregado por el backend.

Ante error, el modal permanece abierto y conserva los values. Corregir notas o volver a enviar responde a un evento; no se usa un Effect para resetear la mutación.

### Estado 8 · Cerrar después de coherencia y mostrar el éxito real

`MediaDetailPage` conecta ambos callbacks:

```tsx
<CreateMediaLogForm
  identity={detailInput}
  key={`${detailInput.mediaType}:${detailInput.externalId}`}
  onCancel={() => setIsCreateOpen(false)}
  onCreated={() => setIsCreateOpen(false)}
  title={detailModel.title}
/>
```

La acción autenticada usa el DTO raíz, no un estado manual:

```tsx
{authState.status === "authenticated" && detailQuery.data.isLogged && (
  <Button disabled>Ya está en tu biblioteca</Button>
)}

{authState.status === "authenticated" && !detailQuery.data.isLogged && (
  <Button onClick={() => setIsCreateOpen(true)}>
    Agregar a mi biblioteca
  </Button>
)}
```

La secuencia observable es:

```text
submit
→ isPending bloquea el formulario
→ servidor responde 201
→ onSuccess invalida search y detail
→ detalle activo refetchea con optional auth
→ isLogged pasa a true
→ termina isPending
→ onCreated cierra el modal
→ la página muestra “Ya está en tu biblioteca”
```

No se navega automáticamente a `/app/library`. La clase 18 necesita ese destino para completar el recorrido buscar, agregar y listar.

## Secuencia de 120 minutos

| Tiempo | Responsable | Progreso observable |
| --- | --- | --- |
| 0-18 min | Docente con participación | Presentar el guion, comparar query/mutación y detectar por qué un refetch anónimo no puede actualizar `isLogged`. |
| 18-35 min | Docente en el editor | Añadir `requestJsonWithOptionalAuth`, `authScope` y la condición `authReady`; observar keys distintas en Devtools. |
| 35-52 min | Docente y estudiantes | Declarar `CreatedMediaLogDto`, implementar `createMediaLog` y comprobar método, body, Content-Type y Bearer sin exponer el token. |
| 52-70 min | Docente con preguntas al grupo | Crear `useCreateMediaLog`, ejecutar una mutación y leer sus estados antes de añadir invalidaciones. |
| 70-90 min | Docente y estudiantes | Sustituir preview por `mutate(body)`, conectar pending, bloquear acciones y cerrar mediante `onCreated`. |
| 90-108 min | Docente en el editor | Demostrar el dato stale, invalidar detalle y búsqueda mediante el grupo de keys y esperar `Promise.all`. |
| 108-115 min | Práctica estudiantil | Probar éxito, doble clic y feedback de `409`, `401`, `404` o error controlado disponible. |
| 115-120 min | Docente y grupo | Reconstruir el recorrido, verificar Network/Devtools y ejecutar `pnpm build`. |

La suma es de 120 minutos.

## Actividades del docente

- Comparar el Network vacío del preview con el request real de creación.
- Pedir al grupo que prediga `isLogged` antes de mostrar el problema del request anónimo.
- Mostrar `authScope` en Query Devtools sin abrir o copiar el token.
- Construir primero una mutación sin invalidación para que el dato stale sea visible.
- Preguntar qué pantallas contienen información afectada antes de escribir la constante.
- Diferenciar una query activa de la búsqueda inactiva que quedó detrás de la ruta actual.
- Mantener `Promise.all` visible y explicar por qué `onSuccess` retorna su promesa.
- Provocar un `409` solo con una identidad de prueba segura; no modificar datos de otros estudiantes ni el backend compartido.
- Detener intentos de añadir lista, navegación automática, Effect o Zustand.

## Actividades de los estudiantes

- Clasificar búsqueda, detalle y creación como lecturas o escritura.
- Explicar qué cambia en una respuesta pública cuando existe sesión.
- Propagar `authScope` por las keys concretas sin cambiar los prefijos.
- Implementar `createMediaLog` usando el helper autenticado existente.
- Entregar el body mediante `mutate`, no el evento del formulario.
- Asociar `isPending` con loading y bloqueo de un segundo submit.
- Predecir qué queries quedarán stale y cuáles refetchearán inmediatamente.
- Mantener values y modal ante un error corregible.
- Comprobar que el éxito proviene de `detailQuery.data.isLogged`, no de un boolean escrito manualmente.

## Comprobación del checkpoint

El grupo ejecuta estos recorridos:

1. Abrir el detalle sin sesión: funciona y usa una key con `authScope: "anonymous"`.
2. Iniciar sesión y regresar: el mismo detalle usa otra key con el `uid` y el request puede incluir Bearer.
3. Abrir el formulario y guardar una película: aparece un solo `POST`, status `201` y body con los seis campos de catálogo.
4. Pulsar varias veces durante pending: no aparece un segundo request desde la interfaz.
5. Observar Devtools: detalle se invalida y refetchea; búsqueda queda stale si está inactiva.
6. Confirmar que el modal cierra después de la actualización y la página muestra “Ya está en tu biblioteca”.
7. Volver a búsqueda: el resultado guardado refleja `isLogged: true` después de su refetch.
8. Intentar agregar el mismo medio desde un estado desactualizado controlado: `409` produce un mensaje específico y no se presenta como éxito.
9. Probar una película y una serie: ambas conservan su `mediaType` correcto.
10. Ejecutar `pnpm build`.

La comprobación no requiere modificar, reiniciar o inspeccionar internamente el backend. Los estudiantes consumen la URL entregada.

## Errores previsibles y preguntas de recuperación

| Síntoma | Pregunta docente | Recuperación esperada |
| --- | --- | --- |
| Crear funciona, pero `isLogged` continúa en false. | ¿El refetch de detalle envió identidad o volvió a ser anónimo? | Usar optional auth y comprobar el scope de la query. |
| Usuario B ve un valor cacheado de usuario A. | ¿La key describe todas las variables que cambian la respuesta? | Añadir `authScope` y deshabilitar durante `checking`. |
| El token aparece en un store o prop. | ¿Qué helper ya sabe obtenerlo cuando inicia el request? | Eliminar la copia y delegar en `requestJsonWithAuth`. |
| El form llama `fetch` directamente. | ¿Dónde viven los demás fetchers y quién administra pending/error? | Mover el POST a `createMediaLog` y consumirlo desde `useMutation`. |
| Hay dos flags de pending. | ¿Qué estado ya expone la mutación? | Retirar el `useState` duplicado y usar `createMutation.isPending`. |
| El modal cierra antes del refetch. | ¿`onSuccess` retorna o espera la promesa de invalidación? | Retornar `Promise.all` y cerrar desde el callback posterior. |
| Solo se invalida una búsqueda exacta. | ¿Cuántas combinaciones cacheadas pueden contener el mismo medio? | Invalidar el prefijo `mediaKeys.searches()`. |
| Se invalida `lists()` aunque no existe. | ¿Qué consumidor de esa familia está construido en este checkpoint? | Retirar la key y reservarla para la clase 18. |
| Un `401` ejecuta logout global. | ¿Firebase confirmó que la sesión terminó? | Mostrar el error local; no convertir un status en política global. |
| Un Effect observa `isSuccess`. | ¿Qué callback conoce exactamente el éxito de esta mutación? | Usar `onSuccess` del hook y el callback de `mutate`. |

## Evidencia de salida

- Un submit válido produce un único `POST /api/v2/media/create` autenticado.
- El body conserva exactamente `source`, `mediaType`, `externalId`, `status`, `priority` y `notes`.
- `isPending` comunica progreso y bloquea acciones duplicadas.
- Búsqueda y detalle tienen keys distintas para anónimo y usuario autenticado.
- La invalidación usa los prefijos existentes y espera su promesa.
- El detalle activo termina con `isLogged: true`; la búsqueda inactiva queda stale.
- El modal cierra solo después del éxito y permanece abierto ante error.
- `401`, `404`, `409` y error desconocido producen mensajes diferenciados.
- No se almacena token, DTO remoto o `isLogged` en estado local o Zustand.

## Criterios de aceptación

- `requestJsonWithOptionalAuth<T>` delega en los helpers existentes y no duplica la construcción de Bearer.
- `searchMedia` y `getMediaDetail` conservan acceso anónimo y pueden enviar identidad cuando existe sesión.
- `mediaKeys.search()` y `mediaKeys.detail()` incluyen `authScope` además de sus inputs anteriores.
- Las queries no ejecutan su fetcher durante `authState.status === "checking"`.
- `CreatedMediaLogDto` modela solo el `id` consumido del resultado de creación.
- `createMediaLog` usa `requestJsonWithAuth`, `POST`, JSON y el body tipado existente.
- `useCreateMediaLog` concentra mutación e invalidaciones de búsqueda y detalle.
- `CreateMediaLogForm` elimina el preview y no vuelve a declarar schema o transformación.
- La acción visual depende de `detailQuery.data.isLogged`; no existe un boolean manual de éxito.
- No existe `mediaKeys.lists()`, query de biblioteca, navegación automática, Effect, notificación global o cambio de backend en este checkpoint.
- `pnpm build` termina correctamente.

## Entrega

El estudiante entrega:

- Código del checkpoint.
- Grabación breve de una creación, cambio de `isLogged` y regreso a búsqueda.
- Explicación de tres frases: qué representa `authScope`, qué invalida la mutación y por qué el modal no cierra al recibir un error.

La grabación no abre el valor del header `Authorization`, no muestra contraseñas y oculta correos personales.

## Vocabulario

- **Mutación:** operación iniciada explícitamente que cambia estado en el servidor.
- **Variable de mutación:** valor entregado a `mutate` y recibido por `mutationFn`; aquí es `CreateCatalogMediaLogBody`.
- **Autenticación opcional:** capacidad de aceptar una llamada anónima y enriquecerla cuando existe una identidad válida.
- **Auth scope:** valor estable usado para separar en caché respuestas dependientes de la sesión.
- **Invalidación:** acción que marca queries coincidentes como desactualizadas.
- **Prefijo de key:** parte inicial compartida que permite seleccionar una familia de queries.
- **Query activa:** query que tiene un consumidor montado en ese momento.
- **Query inactiva:** dato conservado en caché sin un consumidor montado.
- **Stale:** estado que indica que el dato puede estar desactualizado y debe volver a consultarse cuando corresponda.
- **Refetch:** nueva ejecución de una query existente.
- **Conflicto:** respuesta `409` que indica que el estado actual impide repetir la creación.
- **Éxito pesimista:** actualización visual que espera confirmación del servidor antes de presentar el cambio como real.

## Fuera de alcance

- Modificar, ejecutar o configurar `medialog-server`.
- Crear la biblioteca o `mediaKeys.lists()`; pertenecen a la clase 18.
- Navegar automáticamente a `/app/library`; el taller 18 completa ese recorrido.
- Limpiar caché al hacer logout; se incorpora con la primera query privada en la clase 18.
- Consultar detalle por `logId`; pertenece a la clase 19.
- Editar, eliminar o reutilizar el formulario; clases 20 y 21.
- Notificaciones globales, interceptores, retries, logout por `401` o helper genérico de mutaciones.
- Zustand, drawer, calendario y Effects.

## Referencias docentes

- [TanStack Query: Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [TanStack Query: Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [TanStack Query: Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
