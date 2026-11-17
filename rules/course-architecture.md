# Reglas de arquitectura del curso

## Producto

Los estudiantes construirán una versión reducida de Medialog para películas y series. El proyecto excluye anime.

La aplicación permite:

- Buscar catálogo.
- Consultar un detalle público.
- Autenticarse.
- Agregar un medio con status, prioridad y notas.
- Listar la biblioteca personal por fecha de lanzamiento.
- Consultar, editar y eliminar un registro.

## Backend como dependencia externa

El docente entrega desde el primer día el backend preparado para la cohorte en `https://bootcamp-medialog.cardor.dev`. Los estudiantes trabajan solo en el frontend: no clonan, ejecutan, configuran ni modifican `medialog-server` durante las clases, talleres, proyectos semilla o entregas.

Antes de iniciar la cohorte, el docente prepara fuera del curso la rama `bootcamp`, los endpoints disponibles, CORS, autenticación multi-proyecto, allowlist de proyectos Firebase y cualquier endpoint de comprobación que requiera el plan. También desactiva los jobs, pollers y capacidades que no pertenezcan al proyecto reducido.

Las guías pueden documentar un contrato o prerrequisito del backend para planificar la clase. Ese trabajo nunca aparece como actividad estudiantil ni como cambio que deba realizarse durante la sesión. El frontend usa `VITE_API_URL=https://bootcamp-medialog.cardor.dev`, define los tipos mínimos, envía requests y comprueba las respuestas del servicio entregado. La variable conserva la base sin slash final y sin `/api`; cada fetcher añade la ruta completa de su endpoint. La URL de la API es configuración pública y puede vivir en `.env.example`; tokens, contraseñas, claves privadas y cuentas de servicio no.

## Stack aprobado

- React `19.2.8` y React DOM `19.2.8`, con TypeScript y Vite.
- pnpm `11.17.0` como gestor de paquetes.
- Mantine `9.4.1` para componentes visuales y formularios.
- Zod `4.4.3` para validación.
- TanStack Query `5.102.8` para estado remoto y `@tanstack/react-query-devtools` `5.102.8` para inspección durante desarrollo.
- React Router `8.3.1` en modo declarativo, instalado desde `react-router`.
- Firebase Authentication `12.16.0` para sesión, mediante los imports modulares `firebase/app` y `firebase/auth`.
- Vitest `4.1.11` desde la sesión 07 para pruebas puras en entorno Node.
- Zustand `5.0.15` para la identidad mínima del modal global de creación desde la sesión 11.
- Agent Harness Kit `2.11.0` como versión de referencia para introducir trabajo asistido desde la sesión 07. Se instala globalmente con npm como excepción documentada al gestor del proyecto; la versión se vuelve a verificar antes de preparar el seed.
- Context7 MCP como fuente documental durante actividades asistidas desde la sesión 07; no forma parte del runtime de React.
- AutoSkills como herramienta condicional para descubrir y materializar skills cuando el agente no tenga una pertinente; no forma parte de las dependencias de la aplicación.

La versión verificada `autoskills@0.3.6` exige Node `>=22.6.0`. La clase 01 y el proyecto semilla deben comprobar ese mínimo antes de que la sesión 07 ejecute AutoSkills. Antes de iniciar otra cohorte, vuelve a verificar versión, requisito de Node, licencia y comportamiento del CLI.

El curso no usa Firestore, TanStack Router, Redux ni una persistencia temporal con `localStorage`.

La matriz se fija para que los checkpoints sean reproducibles: `@mantine/core`, `@mantine/hooks` y `@mantine/form` deben conservar la misma versión `9.4.1`. Los schemas de Zod se importan desde `zod/v4` y se conectan a Mantine 9 mediante `schemaResolver` de `@mantine/form`; no se añade `mantine-form-zod-resolver`. Desde la sesión 11, los datos propios en fronteras y conjuntos cerrados nacen del schema y derivan su tipo con `z.infer`; definir o inferir no acredita validación hasta ejecutar `parse`, `safeParse` o el resolver. Antes de iniciar una cohorte, el docente vuelve a verificar compatibilidad y propaga cualquier cambio a la clase 01, la instalación de Mantine de la clase 06 y los formularios posteriores.

El itinerario base no adopta `z.compile()`. Los schemas actuales son pequeños, no existe un hot path medido y añadir el compilador al cliente introduciría coste de bundle y restricciones de CSP sin evidencia de una mejora perceptible. Solo se reconsidera ante una validación repetitiva identificada —preferentemente un lote o payload grande en servidor— con un benchmark representativo que incluya coste de compilación, reutilización, inputs válidos e inválidos, compatibilidad síncrona/asíncrona y entorno de ejecución.

La sesión 07 instala Vitest con `pnpm add -D vitest@4.1.11` y usa `vitest run`. Su primera suite prueba un adapter puro de DTO en el entorno Node predeterminado. Las sesiones posteriores añaden tests para schemas, validadores, constructores de body y updaters puros cuando exista un comportamiento observable. El checkpoint base no instala React Testing Library, `user-event`, jsdom, MSW ni un custom render. Esas herramientas solo se añadirían si una prueba de interfaz justificara Router, Query Client, sesión y DOM simulados. Antes de la cohorte, el docente confirma que Vite y Node permanecen dentro de los rangos admitidos por la versión fijada de Vitest. El `health.sh` materializado por AHK se configura primero con `pnpm build`; `pnpm test` se añade únicamente después de que Vitest y el script existan.

Los tests pueden redactarse con ayuda de un agente, pero la persona define el comportamiento, revisa el archivo y ejecuta la evidencia. Consulta `agent-assisted-development.md` para la rutina obligatoria y los límites de delegación.

La guía de la sesión 07 fija una versión verificada de AutoSkills, ejecuta primero `--dry-run` y revisa las propuestas antes de instalar. Context7, AutoSkills y Agent Harness Kit cumplen responsabilidades distintas; ninguna de estas herramientas reemplaza la lectura del código ni las comprobaciones del proyecto.

## Sesión Firebase y rutas privadas

La sesión 12 aplica el patrón local de Mantine Form y Zod aprendido en la sesión 11 para construir Login y Registro y conectarlos con Firebase Email/Password. Cada estudiante configura su propio proyecto Firebase y registra una aplicación web. La configuración del SDK identifica el proyecto y es pública en el cliente; se conserva en `.env.local` por separación de configuraciones, no como mecanismo para ocultar secretos. `.env.example` conserva el value público de `VITE_API_URL` y declara vacíos los seis nombres `VITE_FIREBASE_*`. Ninguna clave privada, cuenta de servicio, contraseña o token se coloca en variables `VITE_`.

`AuthProvider` es el único observador de `onAuthStateChanged`. `authStateSchema` expone una unión discriminada con `checking`, `anonymous` y `authenticated`; su tipo se deriva con `z.infer`. El observer proyecta el `User` externo a `{ uid, email }`, valida la proyección con `parse` y entonces actualiza Context. `PrivateLayout` consume ese estado y muestra `Outlet` solamente para una sesión autenticada. El cleanup del observer pertenece al Effect del provider. Los formularios mantienen únicamente el estado de su submit actual, no una copia global de `User`.

Login y registro navegan desde el handler que completó su operación Firebase. La guardia usa `Navigate` para redirigir una sesión anónima y guarda la ruta solicitada en `location.state`; no se usa un Effect para navegar. Logout, obtención del token de ID, Bearer y `401` se presentan en la misma sesión después de que la guardia ya funciona.

Login y Registro pasan `location.state` como `unknown` a `toAuthDestination`. La función usa `authDestinationSchema.safeParse` para normalizar `from` a un string no vacío o al fallback `/app/library`; un cast no reemplaza esa inspección runtime. Sus enlaces mutuos conservan `state={{ from: destination }}` para no perder el recorrido cuando una persona cambia de formulario. Una acción pública que requiere sesión puede enviar su propio `location.pathname` a Login y regresar después del éxito; ese state no transporta DTOs, formularios, tokens ni credenciales.

La sesión 12 conserva dos intenciones explícitas: `requestJson<T>` para requests anónimos y `requestJsonWithAuth<T>` para endpoints que exigen sesión. El segundo obtiene el Firebase ID token en el momento del request, combina `Authorization` con los headers recibidos y delega el manejo HTTP al helper común. El token no se copia a React, Context, Zustand, `localStorage`, `sessionStorage` ni variables de módulo.

La sesión 13 introduce `requestJsonWithOptionalAuth<T>` cuando `isLogged` hace visible una tercera intención: búsqueda y detalle admiten acceso anónimo, pero enriquecen su respuesta cuando existe una sesión. El helper delega en `requestJson<T>` sin usuario y en `requestJsonWithAuth<T>` con usuario; no vuelve a implementar `getIdToken`, Bearer o manejo HTTP.

Toda query cuya respuesta cambie según la persona incluye un `authScope` en su key. Para búsqueda y detalle, el scope es `checking`, `anonymous` o `user.uid`; la query permanece deshabilitada durante `checking`. El scope separa respuestas en caché, pero no autentica el request y nunca reemplaza el token.

`ApiError` aparece cuando un consumidor necesita conservar el status HTTP. Un `401` no provoca logout, refresh forzado o retry global: el helper expone el status y cada caso de uso decide el mensaje.

La sesión 13 aísla mediante `authScope` las proyecciones públicas que ya contienen `isLogged`; cambiar de usuario selecciona otra key y evita reutilizar su respuesta. Cuando aparece la primera lista privada, la limpieza explícita al cerrar sesión retira bajo `mediaKeys.all` tanto la biblioteca como las proyecciones asociadas a la sesión anterior.

La sesión 13 ejecuta primero `signOut(auth)`. Después de un cierre exitoso usa `queryClient.removeQueries({ queryKey: mediaKeys.all })` y navega a Login. Si `signOut` falla, conserva sesión y caché para permitir otro intento. No usa `queryClient.clear()`: la limpieza pertenece a la familia Media y no a todas las cachés del cliente.

El endpoint docente `GET /api/v2/auth/check` solo comprueba el contrato autenticado antes de que existan DTOs privados de biblioteca. Se consume mediante un probe temporal que no copia la respuesta a estado de interfaz y se elimina del checkpoint final.

En la rama `bootcamp` del backend, el navegador enviará únicamente `Authorization: Bearer <Firebase ID token>`. El servidor deberá identificar primero un proyecto permitido y luego verificar firma y claims antes de autorizar; la mera presencia del header no autentica. Esta implementación de servidor no se enseña como práctica de la sesión 12.

## Navegación pública

React Router aparece cuando una tarjeta remota conserva la identidad pública, pero todavía no ofrece un destino compartible, recargable y navegable. La cohorte usa el modo declarativo porque la aplicación ya administra los datos remotos con TanStack Query.

- `BrowserRouter` conecta el árbol con el historial del navegador.
- `App` declara `Routes` y `Route`.
- Los layouts comparten estructura y colocan `Outlet` donde debe renderizarse la ruta hija.
- `Link` representa navegación iniciada por la persona; `Navigate` se usa para la redirección declarativa de `/` a `/search`.
- Los parámetros de `useParams` se consideran valores externos y se validan antes de construir un tipo de dominio.

No introduzcas `createBrowserRouter`, loaders, actions, Data Mode o Framework Mode en esta progresión. React Router decide qué página mostrar; TanStack Query sigue siendo propietario de búsqueda, detalle y biblioteca.

La sesión 09 crea la infraestructura, conecta cada resultado mediante `Link`, valida los parámetros y muestra una página de detalle provisional desde `GetMediaDetailInput | null`. La sesión 10 conecta `useMediaDetail`, estados remotos, `MediaDetailContent` y `MediaDocumentTitle`; en esa misma sesión el título del documento sirve como caso auténtico de Effect con cleanup.

Al añadir la query en `MediaDetailPage`, la página reutiliza el `GetMediaDetailInput | null` derivado desde los parámetros y llama `useMediaDetail(detailInput)` antes de cualquier retorno condicional. Una URL inválida produce `null`; el hook conserva su orden y mantiene la query deshabilitada. El checkpoint base conserva el enlace como acción principal de cada resultado y no reintroduce selección o modal remoto.

## Propiedad del estado

| Dato | Propietario |
| --- | --- |
| Texto de un input y modal local de selección | Estado local de React |
| Valores y errores de formulario | Mantine Form |
| Búsqueda, detalle y biblioteca | TanStack Query |
| Filtro privado básico | Estado local de React |
| Identidad del modal global de creación | Zustand |
| Sesión actual | Firebase Auth expuesto por el provider |

No copies DTOs remotos a Zustand o a un `useState`.

## Progresión de estado local a Zustand

La clase 06 mantiene `selectedMediaId` en `App`. En ese checkpoint, `App` es el ancestro común cercano de `MediaGrid`, `MediaCard` y `Modal`. Pasar `onSelect` por esas capas permite enseñar quién posee el estado, cómo bajan las props y cómo un hijo ejecuta una función definida por el padre.

No instales Zustand para evitar este recorrido. Un store añadiría otro modelo de estado antes de que la interfaz presente una necesidad compartida.

Zustand aparece en la sesión 11 cuando el mismo modal de creación debe abrirse desde `SearchPage` y `MediaDetailPage`, ramas distintas de `PublicLayout`. El store guarda únicamente `selection: GetMediaDetailInput | null`, `openCreate(selection)` y `closeCreate()`. `opened` se deriva mediante `selection !== null`; no se conserva como otra fuente de verdad.

`CreateMediaLogModal` se monta una sola vez en `PublicLayout`, junto a `Outlet`. Las páginas consumen únicamente `openCreate` y entregan `mediaType + externalId`. El formulario recibe la selección validada. Mantine Form conserva values y errores; TanStack Query conserva mutaciones y datos remotos; Firebase conserva la sesión.

La sesión 11 no añade persistencia, slices, middleware, `useShallow`, sesión, form values o DTOs al store. Cerrar asigna `selection: null`. El montaje condicional y `key={mediaType + externalId}` reinician el formulario sin un Effect.

El guion de presentación de la clase 06 debe comparar ambos árboles y responder:

- Por qué `App` basta para el modal local.
- Qué complejidad añadiría un store en ese momento.
- Qué cambia cuando dos páginas distintas abren el mismo modal de creación.

## Mejoras fuera del alcance base

El drawer compartido, `lazy`/`Suspense`, el calendario y los filtros persistidos en URL no forman parte de las 18 sesiones. Pueden convertirse en material posterior si existe tiempo, pero ninguna guía base, seed o checkpoint depende de ellos.

Retirar estas mejoras no retira Zustand: su caso de uso aprobado es el modal global de creación. Tampoco retira la explicación de carga, error y caché de TanStack Query ni el despliegue de la sesión 18.

## Effects

Usa `useEffect` para sincronizar React con un sistema externo, como `document.title` o `onAuthStateChanged`.

No uses Effects para:

- Filtrar arreglos.
- Calcular valores derivados.
- Responder a un clic conocido.
- Consultar datos administrados por TanStack Query.
- Copiar una respuesta remota a otro estado.

## Frontera HTTP y estado remoto

La sesión 07 enseña el contrato HTTP, verifica fetchers de búsqueda y detalle mediante Network e introduce Vitest con un adapter puro. La comprobación temporal del request no convierte la respuesta en estado de la interfaz y se retira antes del checkpoint.

TanStack Query aparece en la sesión 08, cuando la búsqueda remota se integra por primera vez en la pantalla y necesita carga, error, vacío, éxito y caché. No construyas entre ambas clases una versión provisional con `useEffect`, `useState`, Zustand o `localStorage`.

## Adopción visual de Mantine

La sesión 06 incorpora Mantine para el modal; React conserva selección y apertura. La sesión 07 mantiene el catálogo con HTML/CSS propios. La sesión 08 amplía el toolkit en la nueva búsqueda sin convertir la migración del catálogo previo en otra actividad. Explica primitives, HTML semántico, `className` de raíz y `classNames` para selectores internos con un caso concreto. Conserva componentes de dominio cuando su responsabilidad siga siendo útil. Un fallback visual preparado debe tener definición completa, coincidir con su contrato y omitir la lógica central que se está enseñando.

## DTO, adaptador y modelo visual

TanStack Query conserva el DTO devuelto por el fetcher. Cuando la interfaz necesita otros nombres, texto preparado o una forma más pequeña, usa un adaptador puro y explícito:

```text
DTO en caché → adaptador puro → modelo visual → componente
```

- No conviertas un DTO a un tipo visual mediante `as` si sus campos no coinciden.
- No inventes campos ausentes para forzar la reutilización de un componente anterior.
- Conserva en el modelo visual la identidad pública necesaria para acciones posteriores.
- Deriva la salida del adaptador durante el render; no la copies a `useState`, Zustand ni `localStorage`.
- El adaptador no solicita datos, no abre interfaces y no cambia estado.
- No crees un modelo visual por costumbre. Si el componente necesita exactamente los mismos campos, nombres y nulabilidad del DTO, puede consumirlo directamente. Introduce el modelo cuando exista una diferencia visible de responsabilidad.
- Cuando el modelo sí se justifique, explica que no añade otra fuente de verdad: concentra nombres, formatos e identidad de interfaz y limita cuántos componentes conocen la forma de transporte.

La primera explicación de cada adapter justificado muestra entrada, salida y consumidor: qué renombra, qué calcula y qué conserva. Ilustra un cambio de API y sus límites: DTO/schema y adapter pueden cambiar sin modificar el componente si el modelo conserva su significado; no prometas independencia absoluta ni inventes información ausente.

`MediaDetailDto` conserva desde la sesión 07 las ramas raíz `catalog`, `entry` e `isLogged`. Las páginas públicas consumen `catalog` y dejan `entry` nullable; la sesión 14 es el primer consumidor visual de esa entrada personal. Cuando un campo nuevo del contrato aparece y ya existe un consumidor posterior identificado, corrige el primer tipo canónico y propaga la compatibilidad por los checkpoints intermedios.

Los values cerrados de `MediaStatus` y `MediaPriority` viven junto a los tipos del contrato API. El schema Zod, los DTO privados y los componentes importan esa única definición. Los labels traducidos son responsabilidad visual y permanecen separados de los values enviados al servidor.

Antes de integrar rutas, una búsqueda enviada puede mantener en React el borrador y los parámetros confirmados. La respuesta, sus errores y su caché pertenecen a TanStack Query. Si el endpoint exige un tipo concreto, el formulario remoto no introduce una opción `all` que la API no pueda representar.

Las query keys incluyen todas las variables que consume su query function. En la búsqueda pública de esta cohorte son el texto normalizado y `mediaType`.

## Identidades

- Catálogo público: `mediaType + externalId`.
- Registro personal: `logId`.

No intercambies ambos identificadores en rutas, query keys o stores.

Cuando un mismo endpoint acepte ambas identidades, usa un schema discriminado con estados válidos explícitos y deriva el tipo. La sesión 14 crea `mediaDetailSelectorSchema` con `kind: "catalog" | "log"`; no usa un objeto con `externalId`, `mediaType` y `logId` opcionales que permita combinaciones ambiguas. El adapter de `useParams` ejecuta `safeParse` antes de devolver el selector. La query key incluye el selector completo y `authScope`. Catálogo conserva autenticación opcional; `logId` exige sesión autenticada.

Antes de integrar rutas, `App` conserva únicamente el borrador de búsqueda y los parámetros enviados. Los resultados remotos preservan `externalId + mediaType`, pero no abren una query ni un modal de detalle intermedio.

React Router aparece en la sesión 09 porque la identidad pública necesita una URL compartible y recargable. Esa sesión conecta los resultados con una ruta y deriva un input validado sin solicitar todavía el recurso; la sesión 10 conecta ese input con la query de detalle. No construyas una selección remota temporal que deba retirarse una clase después.

## Explicación de Mantine Form

En el primer formulario, explica junto al ejemplo cada opción utilizada: `mode`, `initialValues`, `validate`, resolver, `sync`, blur y `onValuesChange`. Conecta controles y submit con `getInputProps`, `form.key` y `form.onSubmit`; muestra un recorrido observable. `sync: true` solo corresponde a un schema síncrono y no sincroniza estado. Las sesiones posteriores reutilizan esta explicación y justifican sus diferencias; no copian callbacks específicos del preview cuando ese caso ya no existe.

## Formularios de biblioteca

El usuario introduce:

- `status`.
- `priority`.
- `notes`.

La selección de catálogo aporta título, poster, tipo, fecha y `externalId`. Firebase aporta la identidad del usuario.

La sesión 11 implementa solamente la forma local de creación desde catálogo. `CreateMediaLogForm` recibe la identidad ya validada mediante `GetMediaDetailInput`, captura los tres campos y produce `CreateCatalogMediaLogBody` con `source: "catalog"`. No añade la rama manual del backend ni extrae todavía una API configurable para edición; la sesión 15 realiza esa extracción cuando aparece el segundo caso.

Status y prioridad usan labels visuales separados de sus values de transporte y `allowDeselect={false}`. Notes mantiene `""` dentro del formulario y `toCreateMediaLogBody` convierte texto vacío o compuesto solo por espacios a `null`. El máximo de 256 caracteres es una regla del frontend del curso, no una restricción del schema remoto actual.

El formulario se monta solo mientras el modal está abierto y recibe una `key` formada por `mediaType + externalId`. Cierre y cambio de identidad reinician la sesión mediante eventos, desmontaje y remount; no se usa un Effect para resetear. La sesión 11 muestra un body local y la sesión 13 reemplaza ese preview por la mutación autenticada.

La sesión 15 introduce el segundo consumidor y extrae `MediaLogForm`. El componente compartido posee `useForm`, schema, status, prioridad, notas, validación y acciones. `CreateMediaLogForm` y `EditMediaLogForm` permanecen como wrappers: cada uno conserva su identidad, adapter, mutation y copy de error. No se usa un prop `mode` acompañado por datos opcionales de catálogo y log.

El editor se monta después de que la página privada ya tiene `entry`. `toMediaLogFormValues` produce initial values y no se usa un Effect para copiar el DTO o responder a refetches. `form.reset()` restaura el snapshot de la sesión abierta; cancelar cierra y desmonta; `key={entry.id}` separa otra identidad de registro. `form.key("campo")` sigue perteneciendo al modo uncontrolled de Mantine y no sustituye la key del componente completo.

## Mutaciones e invalidaciones

La sesión 13 usa `useMutation` para crear desde catálogo. `CreateMediaLogForm` entrega a `mutate` el `CreateCatalogMediaLogBody` ya validado; `createMediaLog` consume `requestJsonWithAuth<T>` y el hook `useCreateMediaLog` administra consistencia remota. El formulario usa `isPending` en lugar de duplicar el estado con `useState`, mantiene sus valores ante error y cierra mediante un callback de éxito, no mediante un Effect.

Las invalidaciones se expresan como familias existentes:

```ts
export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
]
```

El `onSuccess` del hook espera `Promise.all` para que la mutación continúe pendiente hasta completar los refetch activos. El detalle activo actualiza `isLogged`; una búsqueda inactiva queda stale hasta volver a tener un consumidor. La interfaz permanece en el detalle y usa el cambio real de `isLogged` como feedback de éxito.

No se declara `mediaKeys.lists()` por anticipado. La sesión 13 crea esa familia después de conectar la mutación y entonces amplía `CREATE_MEDIA_LOG_INVALIDATION_KEYS()` para incluirla. Un helper genérico de invalidación se evalúa cuando varias mutaciones repitan el patrón; la primera mutación mantiene visible el `Promise.all` que se está enseñando.

La primera lista privada usa `POST /api/v2/media/list` con `viewLogType: "list"`. La key concreta incluye el body serializable y `authScope`. `ListMediaLogsBody` se define por completo antes de su primer uso. `toLibraryListBody` construye directamente un body nuevo: conserva vacíos los filtros no interactivos y restringe `mediaType` a `movie` y `series`. La interfaz respeta el orden de lanzamiento entregado por el backend y no ejecuta `.sort()`.

El DTO mínimo de lista conserva el `id` remoto porque existe un consumidor identificado en la sesión 14. El adaptador lo renombra a `logId`, lo usa como key estable de React y prepara labels y fecha. La sesión 13 no enlaza todavía `/app/library/:logId`; esa navegación pertenece al detalle privado.

Los errores `401`, `404` y `409` se traducen localmente mediante `ApiError.status`. No provocan logout, retry global o éxito silencioso. La creación espera la confirmación del servidor y las invalidaciones.

La sesión 15 usa `PUT /api/v2/media/:id` para actualizar solo status, prioridad y notas. Aunque el endpoint admita más campos opcionales, la interfaz de catálogo no muestra ni envía título, fechas o metadata bloqueada. Guardar notas vacías envía `null`; el form usa `""` durante la edición.

`UPDATE_MEDIA_LOG_INVALIDATION_KEYS()` incluye `mediaKeys.lists()` y `mediaKeys.details()`. Status, prioridad y notas cambian esas proyecciones; búsqueda conserva el mismo `isLogged`. El hook espera el `Promise.all` antes de ejecutar el callback visual que cierra el modal. La sesión mantiene el bloque explícito y reserva un helper genérico para cuando eliminación cree otro consumidor en la sesión 16.

La sesión 16 introduce `DELETE /api/v2/media/:id` con `logId`, sin body y mediante el cliente autenticado existente. La práctica elimina un registro creado por el estudiante durante esa sesión; no usa ids fijos. La confirmación muestra el título como identidad visible, mantiene el id como dato de transporte y bloquea cancelación, Escape, overlay, cierre superior y doble submit durante `isPending`.

Eliminar crea el tercer consumidor de la mecánica `Promise.all + invalidateQueries`. En ese momento se extrae `invalidateQueriesByKeys`; crear y actualizar adoptan el helper sin cambiar sus conjuntos de negocio. El helper recibe keys y un modo reducido de refetch, pero no decide qué familias afecta una mutación.

El plan de DELETE trata las familias según la pantalla activa:

- `lists()` y `searches()` se invalidan normalmente.
- `details()` se marca stale con `refetchType: "none"` para evitar que el detalle privado activo solicite inmediatamente el recurso que acaba de desaparecer.

El hook espera este plan antes de ejecutar el callback visual pasado a `mutate`. La página navega entonces a `/app/library` mediante `useNavigate` y `{ replace: true }`; no usa un Effect ni navega desde `onSettled`. La navegación desmonta la página y el diálogo, por lo que el éxito no duplica un cierre mediante `setIsDeleteOpen(false)`. Un error conserva diálogo y ruta y no provoca logout automático.

No se usa `removeQueries` sobre el detalle todavía activo: retirarlo delante de su observer puede producir un estado de carga intermedio. Tampoco se anticipan calendario, filtros, pruebas o invalidaciones de features que todavía no existen.

## Filtro básico de biblioteca

La sesión 13 añade un filtro privado por tipo con tres valores locales: `all`, `movie` y `series`. `LibraryPage` conserva la selección en `useState`; no la copia a Zustand, no usa un Effect y no la persiste en la URL.

`toLibraryListBody` traduce el valor al contrato remoto:

- `all` produce `values: ["movie", "series"]`; un arreglo vacío ampliaría el endpoint a anime.
- `movie` o `series` produce un arreglo de un elemento.
- Status y prioridad permanecen con `values: []` en el alcance base.

El adapter devuelve objetos y arrays nuevos en cada llamada; no depende de una constante base ni de spreads anidados. La lista conserva el filtrado y el orden del backend; no aplica `.filter()` o `.sort()` local. La query key incluye el body que consume la query function.

El agente puede redactar tests del adapter después de que el estudiante defina los tres comportamientos. La suite demuestra el body producido y la exclusión de anime; no afirma haber probado el control, Firebase, Network o el backend.

Los filtros completos de status y prioridad, junto con su persistencia en URL, quedan como extensión futura.

## Despliegue estático

La sesión 18 publica el checkpoint completo mediante la integración Git de Cloudflare Pages. No crea otra aplicación con C3, no instala Wrangler y no añade Pages Functions, Workers o un custom domain.

La configuración reproducible usa el repositorio de trabajo del estudiante. Su rama main contiene su aplicación; no se refiere a main del repositorio docente MediaLog-Bootcamp, que permanece en la entrada inicial:

```text
Production branch: main
Build command: pnpm build
Build output directory: dist
NODE_VERSION: 22.22.0
PNPM_VERSION: 11.17.0
```

Pages recibe durante el build `VITE_API_URL` y las seis variables `VITE_FIREBASE_*` ya declaradas en `.env.example`. Vite incorpora sus values al bundle del cliente. La configuración web de Firebase y la URL pública de la API pueden exponerse; contraseñas, tokens, claves privadas y cuentas de servicio nunca usan el prefijo `VITE_` ni llegan al repositorio.

El caso base no añade `404.html`, `_redirects` o configuración de Worker. Cloudflare Pages trata la salida como SPA cuando no existe un `404.html` superior. La clase comprueba ese comportamiento abriendo y recargando una ruta pública anidada; no lo considera demostrado por configuración.

El backend docente autoriza antes de la comprobación autenticada cada origen estudiantil exacto `https://<proyecto>.pages.dev`. Los estudiantes no modifican CORS o el backend y el curso no usa `*`. Un bloqueo CORS se registra como dependencia externa y no se corrige cambiando React, Firebase o el cliente HTTP.

La evidencia se conserva por capas:

- test y build local para el release candidate;
- build log remoto para instalación y artefactos;
- URL externa para publicación;
- recarga anidada para fallback SPA y Router;
- Login para Firebase en el origen publicado;
- Network para API, autorización y CORS.

Ninguna capa reemplaza las demás. La sesión 19 recibe la URL, la revisión, el deployment id y la matriz de evidencia; no vuelve a enseñar el despliegue.

La sesión 19 presenta primero dos recorridos visuales y formaliza después CSR, SSR, SSG e hidratación. Este mapa no se implementa ni se califica. Medialog permanece como SPA CSR: Vite publica un shell estático y `createRoot` construye el contenido React en el navegador. Servir ese shell desde un CDN no equivale a prerenderizar el árbol React.

La presentación final demuestra una ruta pública recargable, protección privada, login y una operación personal. Cada unidad explica una decisión técnica y separa test, build, deployment y navegador. La rúbrica suma 100 puntos sin extras y no califica decoración o cantidad de slides.

## Progresión técnica

```text
React y JSX
→ props y listas
→ estado local
→ API y TanStack Query
→ React Router
→ Effects
→ formularios y modal global con Zustand
→ Firebase Auth
→ crear, filtrar y listar
→ detalle, editar y eliminar
→ despliegue y presentación
```

Una clase puede preparar el vocabulario del siguiente paso, pero no debe implementar una herramienta antes de que exista su caso de uso.
