# Guía estudiantil · Sesión 13 · Crear, listar y filtrar biblioteca

**Presencial · 180 minutos.** Seguimos desde la sesión12. Hoy el formulario guardará en el servidor y podrás consultar tu biblioteca con Todos, Películas o Series.

Materiales: [lectura previa](pre-class-reading.md), [control posterior](reading-check.md) y [taller y rúbrica](workshop-rubric.md).

## Punto de partida

Login, Registro y restauración funcionan. La ruta /app/library está protegida y todavía muestra texto provisional. El formulario prepara un body local; aún no crea registros. PageState, EmptyState, Vitest y el cliente HTTP ya existen.

La entrada `session-13-start` conserva `session-12-end` y añade contratos preparados: MEDIA_TYPE_VALUES, ListMediaLogsBody y MediaLogListItemDto. El docente explica esos datos después de la presentación. No hay dependencias nuevas ni CSS nuevo.

Usa una cuenta de prueba propia. La URL base del curso es `https://bootcamp-medialog.cardor.dev`. Nunca publiques contraseñas o tokens; VITE_API_URL es pública. El cliente HTTP añade esa base, por eso cada fetcher recibe una ruta relativa.

## Orden de la clase

Presentación continua18min → coding y consigna57 → descanso30 → taller60 → revisión15. Después de las slides trabajamos en editor/navegador y cerramos oralmente.

### 1. Preparar y comprobar la entrada

Guarda tus cambios antes de usar una rama de respaldo; no reemplaces tu trabajo sin conservarlo.

```bash
git switch session-13-start
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Comprueba búsqueda, detalle, formulario local y acceso privado. La falta de configuración Firebase debe conservar el catálogo público y explicar el problema en Login.

### 2. Dar sesión opcional a las lecturas públicas

Con el docente, añade `requestJsonWithOptionalAuth` en src/api/http.ts: sin configuración o sin usuario, delega al helper público; con usuario, al autenticado. Un token rechazado sigue siendo error.

En src/api/media.ts usa ese helper para búsqueda/detalle. En src/hooks/media-keys.ts añade authScope a sus keys y, en src/hooks/features/use-media.ts, espera a que la sesión salga de checking. Las páginas muestran esa espera explícitamente.

**Comprobación:** la misma consulta anónima y autenticada tiene keys distintas. El uid separa caché; el Bearer del request permite verificar la sesión. Copiar un uid no autoriza.

Respaldo: `session-13-step-01-optional-auth-scope`.

### 3. Conectar el guardado

Define con el docente el resultado mínimo, createMediaLog y useCreateMediaLog. La ruta es POST /api/v2/media/create y usa requestJsonWithAuth. El formulario entrega a mutate el body validado por el schema y preparado por el adapter existente.

Usa isPending para bloquear campos, Guardar y Cancelar; retira el preview y su useState. Mantén valores cuando falla y muestra errores locales para401,404,409 y caso general. No cierres con un Effect ni hagas logout automático.

El hook espera invalidaciones de búsqueda/detalle con Promise.all; después onCreated avisa al modal. El detalle muestra En tu biblioteca cuando el DTO confirma isLogged. Cerrar manualmente con X/Escape no cancela un request enviado.

**Comprobación:** un submit produce un POST; el error conserva formulario; el éxito espera los intentos de refetch activos. Si un POST201 fue aceptado pero falla una lectura posterior, no repitas a ciegas el guardado.

Respaldo: `session-13-step-02-create-mutation`.

### 4. Construir el body y la primera consulta privada

Define libraryTypeFilterSchema en src/schemas/library-filter.ts y deriva su tipo. Construye toLibraryListBody en src/adapters/library-type-filter-to-list-body.ts con el body completo.

| Selección | filters.mediaType.values |
| --- | --- |
| all | movie y series |
| movie | solo movie |
| series | solo series |

Las otras restricciones quedan vacías; viewLogType es list. Cada llamada devuelve estructuras independientes. El backend Bootcamp actual exige tipos no vacíos permitidos. No amplíes el dominio a anime.

Conecta getMediaLibrary, mediaKeys.lists/libraryList y useMediaLibrary en los archivos ya conocidos. Key y queryFn reciben el mismo body, junto con authScope en la key. La query solo se habilita autenticada.

Primero LibraryPage muestra el primer DTO o null: es un diagnóstico temporal. POST list lee datos; emplea POST porque recibe filtros estructurados.

**Comprobación:** Network muestra body y presencia de Bearer; Devtools muestra ese body y usuario. El DTO permanece en Query.

Respaldo: `session-13-step-03-library-query`.

### 5. Completar invalidación y salida

Ahora añade lists() a las familias invalidadas al crear. Conserva el Promise.all visible; las queries inactivas quedan stale hasta usarse nuevamente.

En PrivateHeader espera signOut, retira mediaKeys.all y después navega a Login. Si signOut falla, conserva sesión/caché y permite reintento. No uses clear ni limpieza en finally.

Respaldo antes del taller: `session-13-workshop-start`, igual a `session-13-step-04-consistency-logout`. Incluye toda la parte guiada y omite la solución evaluada.

## Taller · 60 minutos

La [rúbrica](workshop-rubric.md) suma100 puntos, con hasta10 extra opcionales. Aplica piezas explicadas antes del descanso.

### 1. Modelo y adapter · 15min

Extrae labels compartidos a src/constants/media-log.ts cuando aparezca el segundo consumidor; conserva los textos del formulario. Actualiza ese formulario para importarlos.

Crea LibraryMediaListItemModel en src/types/library-media-list-item.ts y toLibraryMediaListItemModel en src/adapters/media-log-to-library-list-item.ts. El modelo contiene logId, título, tipo, fecha y labels de estado/prioridad. Traduce id→logId sin mutar el DTO ni inventar una fecha ausente.

Respaldo posterior al intento: `session-13-step-05-library-model`.

### 2. Filas y estados · 12min

Crea library-media-list-item.tsx y library-media-list.tsx en src/components/. La fila recibe un modelo y la lista usa logId como key. No añadas enlaces a detalle privado.

Sustituye el diagnóstico de LibraryPage. Deriva modelos durante render y conserva el orden recibido. Representa carga/error con PageState, retry con refetch, colección válida vacía con EmptyState y éxito con la lista. No copies DTOs o modelos a otro estado.

Respaldo posterior al intento: `session-13-step-06-library-states`.

### 3. Control del filtro · 11min

En LibraryPage guarda únicamente LibraryTypeFilter, inicial all. Conecta Select con Todos/Películas/Series. Valida string|null con libraryTypeFilterSchema.safeParse antes de cambiar el estado. No uses cast.

Deriva el body desde esa selección y entrégalo al mismo hook. Comprueba cada request/key. No uses URL, Effect, Zustand, .filter o .sort sobre la respuesta.

Respaldo posterior al intento: `session-13-step-07-library-filter`.

### 4. Trabajo con agente · 9min

Antes de invocarlo, acuerda los cinco comportamientos de la matriz del body: tres selecciones, exclusión de anime e independencia de estructuras con filtros no interactivos vacíos.

```text
Usa la skill ahk-test para probar toLibraryListBody ya implementado.
Matriz humana: all produce [movie,series]; movie produce [movie];
series produce [series]; nunca anime; dos llamadas producen objetos
y arrays independientes, con los filtros no interactivos vacíos.
Puedes crear únicamente
src/adapters/__tests__/library-type-filter-to-list-body.test.ts
y soporte exclusivo dentro de src/adapters/__tests__/.
Producción, otros tests, componentes, Firebase, configuración, dependencias
y lockfile permanecen en solo lectura. No uses snapshots ni debilites
expectativas. Si el contrato contradice el código, detente y explica.
Ejecuta pnpm exec vitest run src/adapters/__tests__/library-type-filter-to-list-body.test.ts.
Entrega matriz, archivos, comando, exit status, flujo, supuestos y límites.
No afirmes haber probado UI, Firebase o el backend.
```

Lee el archivo completo, revisa su diff, explica un caso y ejecuta otra vez. Si el agente falla, conserva tu matriz y pide la referencia al docente; léela igualmente.

Respaldo posterior al intento: `session-13-step-08-filter-tests`.

### 5. Recorrido y checks · 13min

```bash
pnpm exec vitest run src/adapters/__tests__/library-type-filter-to-list-body.test.ts
pnpm test
pnpm lint
pnpm build
```

Registra resultados observados, o escribe pendiente y su causa:

| Caso | Qué debes observar |
| --- | --- |
| Recarga autenticada | Espera inicial y misma sesión restaurada. |
| Guardar película/serie | Un POST autenticado, pending y confirmación real. |
| Error de guardado | Mensaje local y valores conservados. |
| Biblioteca | Carga/error/vacío/éxito diferenciados; orden remoto. |
| Tres filtros | Body/key coherentes, sin anime. |
| Crear | Familias search/detail/list invalidadas. |
| Logout | Media retirado después de signOut correcto. |
| Otra cuenta, si disponible | Su propia key/biblioteca. |
| Test, lint y build | Comandos ejecutados y exit status anotado. |

El test solo acredita el adapter. Build acredita tipos/empaquetado. Un entorno con respuestas preparadas no demuestra aceptación del servidor real. Network/Devtools acreditan ese recorrido, no todos los entornos futuros.

## Entrega y cierre

Entrega código, salidas de checks, matriz manual, captura de key sin token, grabación breve de crear/listar/filtrar/salir y diff del test si lo redactó el agente. Explica invalidar frente a retirar caché y qué prueba no cubre Firebase.

Si falta tiempo, registra último bloque comprobado, rama guardada y primera acción pendiente. La siguiente reunión retoma allí. `session-13-end` es la referencia final; main docente sigue en el inicio sin aplicación.

Opcionales después de completar la base: contador derivado e indicador isFetching con datos visibles. No reemplazan requisitos base.

Fuera del alcance: filtros avanzados/URL, detalle por logId, PUT/DELETE, nuevas dependencias, estado duplicado, Effects para requests o cambios del backend. La siguiente sesión conecta la URL de un registro personal.
