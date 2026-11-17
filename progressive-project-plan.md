# Proyecto progresivo · MediaLog-Bootcamp

## Acuerdo y alcance

El 9 de septiembre de 2026 el usuario aprobó construir el proyecto junto con la ruta docente, sesión por sesión. El repositorio vive en `../MediaLog-Bootcamp`, separado de este material privado. Su nombre en `package.json` es `medialog-bootcamp`.

El frontend usa `https://bootcamp-medialog.cardor.dev` como base canónica del backend de la cohorte. Desde `session-07-step-01-contracts`, `.env.example` declara ese valor sin slash final; los fetchers agregan sus rutas `/api/v2/...`.

Las sesiones 01–13 están implementadas. Las sesiones 14–16 y 18–19 se implementarán en orden cuando el usuario indique continuar. No se crean ramas vacías para aparentar checkpoints terminados. La siguiente sesión recibe la salida comprobada de la anterior, con preparación previa explícita cuando corresponda.

## Referencias Git

| Referencia | Significado |
| --- | --- |
| `main` | Entrada permanente, idéntica a `session-01-start`: README y .gitignore, todavía sin aplicación. El docente publica las demás ramas conforme avance el curso. |
| `session-NN-start` | Entrada de la sesión; coincide con el checkpoint anterior salvo preparación explícita y documentada. En 01 todavía no contiene aplicación. |
| `session-NN-step-XX-descripcion` | Estado compilable después de una transformación docente o guiada. `XX` indica orden dentro de la sesión. |
| `session-NN-workshop-start` | Estado anterior al taller presencial; contiene la demostración previa y omite la solución evaluada. |
| `session-NN-end` | Resultado final verificable de la sesión; el sufijo `-end` es obligatorio. |

Las ramas son referencias de consulta. El docente y los estudiantes trabajan en sus copias, sin mover las referencias originales ni cambiar de rama sobre cambios sin guardar. Un error deliberado no se conserva como checkpoint compilable.

Los commits locales del nuevo repositorio materializan estas etapas; no se crean commits en `React-Guide-VI`, remotos, pushes o tags. Los estados resueltos y las ramas docentes permanecen locales hasta preparar la distribución: una rama de un repositorio público no protege una solución privada. No se publica todo el historial docente por defecto.

## Ruta docente reutilizable

Cada bloque indica: identificador estable, estado de entrada, medio usado (presentación o entorno de desarrollo), responsable, archivos, cambio exacto, pregunta previa, respuesta esperada, comprobación y siguiente paso. Cada paso de `teacher-guide.md` incluye todo su código, tipos, configuración y estilos, con instrucciones numeradas y archivos completos. Todas las instrucciones de edición se sitúan después de la presentación continua; no se duplica la misma acción en preparación. Los archivos heredados y el soporte se muestran dentro del bloque donde se necesitan. Se repiten archivos cuando una transformación posterior exige ver su nuevo estado completo. No requiere consultar la referencia del proyecto ni buscar otra sección para completar una instrucción. El proyecto demuestra que puede ejecutarse.

Flujo final aprobado: presentación continua → coding guiado → práctica → comprobación y cierre oral. Se hace una sola transición desde las slides al entorno de desarrollo. Las preguntas y distinciones posteriores se trabajan sobre el código visible. Esta decisión reemplaza el reparto inicial de slides entre bloques de coding; las ramas y los checkpoints no cambian. Las presenciales mantienen todos los conceptos antes del descanso. Los tiempos se ajustan por sesión y se ensayan; el ejemplo de 22 minutos de presentación no es una duración obligatoria.

Si termina el tiempo, registrar último bloque comprobado, último cambio guardado, primer paso pendiente y evidencia ausente. La próxima reunión recupera ese bloque antes de introducir la dependencia siguiente. Una rama de respaldo recupera archivos; no demuestra comprensión ni reemplaza la explicación pendiente. No se modifica automáticamente el calendario institucional.

## Sesión 01 · Plan de ejecución

1. Crear la entrada sin aplicación y comprobar el generador y las versiones.
2. Conservar el scaffold instalado como `session-01-step-01-scaffold`.
3. Escribir toda la pantalla dentro de `App`: `session-01-step-02-static-screen`.
4. Extraer solo `AppHeader`: `session-01-step-03-app-header`.
5. Extraer `MediaCard` con participación del grupo y cerrar `session-01-end`.
6. Comprobar instalación con lockfile, build y lint de cada etapa ejecutable; observar la pantalla final en navegador.
7. Sincronizar guía docente, comandos estudiantiles, plan y memoria. Comprobar la entrada de 02 sin implementar props.

La actividad individual cambia textos y corrige un error JSX; no necesita otra rama canónica porque cada estudiante conserva su propia entrega. La referencia final mantiene Arrival para que 02 parta del ejemplo aprobado.

## Estado de producción

- Sesión 01: implementada y verificada. Entrada `session-01-start` → tres etapas intermedias → `session-01-end`.
- Sesión 02: implementada y verificada. Entrada idéntica a 01-end → contrato y fixture → props → lista → fallbacks → `session-02-end`.
- Sesión 03: implementada y verificada. Seed desde 02-end con CSS preparado → MediaGrid / workshop-start sin solución → EmptyState → `session-03-end` con badge.
- Sesión 04: implementada y verificada. Entrada idéntica a 03-end → input controlado → búsqueda inline → SearchInput → `session-04-end` con distinción de vacíos.
- Sesión 05: implementada y verificada. Entrada idéntica a 04-end → control definido → tipo conectado → predicado combinado → vacíos → `session-05-end` con contador y limpieza.
- Sesión 06: implementada y verificada. Soporte visual desde 05-end → Mantine → selección → modal temporal / workshop-start → contratos → tarjetas → `session-06-end` sin trigger.
- Sesión 07: implementada y verificada. Contratos → fetchers explícitos → helper genérico → primer test → harness y materiales públicos → `session-07-end`.
- Sesión 08: implementada y verificada. Provider → identidad de query → submit explícito → adapter y resultados → materiales públicos → `session-08-end`.
- Sesión 09: implementada y verificada. BrowserRouter → SearchPage → árbol público → params → enlaces y tests → materiales públicos → `session-09-end`.
- Sesión 10: implementada. Query nullable → modelo y adapter → contenido aislado → título con cleanup → tests → seed sin integración → URL real y estados → composición hasta `session-10-end`. Main permanece en session-01-start.
- Sesión 11: implementada desde 10-end, seis etapas y `session-11-end`; modal compartido, formulario validado y body local.
- Sesión 12: implementada desde 11-end, siete etapas y `session-12-end`; Firebase, formularios, guardia, helper autenticado y logout. Se conserva como entrada de 13; guía detallada disponible.
- Sesión 13: implementada desde 12-end, ocho etapas, contratos de entrada y workshop-start sin solución; creación, lista privada y filtro, 30 tests. Guía detallada disponible para revisión del usuario.
- Sesiones 14–16 y 18–19: pendientes de proyecto ejecutable; sus guías textuales siguen aprobadas.
- Presentaciones 01–13: conservadas como línea base aprobada; la ruta docente usa el deck continuo antes del editor.

### Evidencia de la primera entrega

El 9 de septiembre se extrajo cada una de las cuatro etapas ejecutables desde Git a una carpeta limpia. `pnpm install --frozen-lockfile`, `pnpm build` y `pnpm lint` terminaron con salida 0 en todas. El navegador mostró una sola tarjeta Arrival y su encabezado, sin warnings ni errores capturados. No se verificó el árbol mediante la extensión React DevTools ni se midió el ritmo de estudiantes reales.

Los comandos de creación de la guía se ejecutaron además en el scaffold temporal y produjeron el nombre y versiones esperados. Los archivos de aplicación coinciden con las referencias docentes salvo espacios; las copias de guía estudiantil y lectura previa son idénticas a su fuente curricular.

Próxima iteración, cuando el usuario lo indique: presentación 14. La sesión 13 ya conecta creación, biblioteca y filtro desde el cierre 12; no abre todavía registros por logId.

### Sesión 02 · Ruta y evidencia

Orden: `session-02-start` → `session-02-step-01-typed-fixture` → `session-02-step-02-card-props` → `session-02-step-03-keyed-list` → `session-02-step-04-null-fallbacks` → `session-02-end`.

La guía docente tiene bloques S02-B01–B08: 8 minutos de recuperación, 17 de presentación continua, 52 de coding guiado, 8 de práctica y 5 de comprobación/cierre oral: 90 minutos. El HTML aprobado se conserva; su última slide sirve de referencia docente para cerrar oralmente.

Se activa strictNullChecks al crear el contrato y se entregan SVG de prueba locales. Antes de fallbacks, el componente muestra la ruta del poster como texto temporal; no adelanta el condicional ni fuerza el tipo. El sexto objeto se incorpora solamente en la rama final.

Las etapas se comprueban desde extracciones limpias con instalación congelada, build y lint. El navegador mostró seis tarjetas, cinco imágenes cargadas y ambos fallbacks. Se provocaron y restauraron el error por anime, el error por undefined y el warning de key. Sin comprobación mediante la extensión React DevTools ni medición real de tiempos de aula. Detalle en [la memoria](memories/progressive-project-session-02.md).

### Sesión 10 · Ruta y evidencia

Orden: `session-10-start` (= 09-end) → `step-01-detail-query` → `step-02-detail-model` → `step-03-detail-preview` → `step-04-document-title` → `step-05-adapter-tests` → `session-10-workshop-start` → `step-06-route-query` → `step-07-detail-composition` → `session-10-end`. Todos los `step` llevan prefijo `session-10-`.

La guía docente contiene 19 bloques completos cotejados con Git, más los archivos completos de error temporal, logs y extra. Presentación continua 18 + coding 57 + descanso 30 + taller 60 + revisión 15 = 180 minutos. El seed conserva query con input fijo y componentes aislados; no incluye params ni composición final. El cierre retira la demo y mantiene el extra de reintento fuera de la base.

Instalación congelada al abrir la copia aislada; build, lint y tests pasan en las siete etapas de código y en el cierre. Suite final: 13 tests en 3 archivos. Navegador con respuestas controladas: película, serie, keys por identidad, URL inválida sin request, carga, HTTP 500, catálogo nulo, espera sin conexión, recarga, pestaña nueva, historial y título restaurado. La demostración reproduce el fallo sin cleanup y el ciclo de Strict Mode; el extra repite la identidad actual y se retira tras verificarlo. No se atribuye a estas pruebas disponibilidad del backend público ni ritmo validado de aula.

En el nuevo cierre y el seed se sincronizaron los materiales públicos con la fuente curricular, incluidos los controles separados de las lecturas 01–06 y los ejemplos HTTP de 07. Los checkpoints anteriores no se reescribieron. El preview local del build pasa la misma matriz controlada. `draft/index.md` conserva el objetivo y duración correctos; se comprobó sin modificar su fila. [Memoria de la iteración](memories/progressive-project-session-10.md).

## Documentación técnica consultada

### Sesión 03 · Ruta y evidencia

Orden: `session-03-start` → `session-03-step-01-media-grid` = `session-03-workshop-start` → `session-03-step-02-empty-state` → `session-03-end`. La entrada añade solo CSS y material público a 02-end; el pre-taller omite EmptyState, MediaTypeBadge y el extra.

Guía autosuficiente con archivos completos, SVG, CSS, tipos y preguntas por paso. Recuperación 15 + presentación continua 20 + coding 30 + encargo 10 + descanso 30 + taller 60 + revisión oral 15 = 180 minutos. La sintaxis del retorno temprano se explica antes del descanso; el reto del total no aparece en la demostración ni en el cierre canónico.

Las cinco referencias pasan instalación limpia, build y lint. Navegador: seis tarjetas, tres badges de cada tipo, cinco imágenes cargadas, ambos fallbacks y vacío con cero tarjetas; sin warnings/errores. El extra se comprobó con build/lint como variante temporal y se retiró. No se verificó React DevTools ni ritmo real de aula. [Memoria detallada](memories/progressive-project-session-03.md).

### Sesión 04 · Ruta y evidencia

Orden: `session-04-start` → `session-04-step-01-controlled-query` → `session-04-step-02-derived-search` → `session-04-step-03-search-input` → `session-04-end`.

Guía autosuficiente con archivos completos por paso, demostración local y logs temporales, respuestas esperadas y restauración de fixtures. Recuperación 8 + presentación continua 17 + coding 49 + práctica 10 + cierre oral 6 = 90 minutos. Incluye registro de tiempos reales y punto de pausa para retomar antes de 05.

Las cinco referencias pasan instalación limpia, build y lint. Navegador: búsqueda por título, mayúsculas, espacios, recuperación al borrar, sin resultados y fuente vacía con consulta activa. Se verificó la demostración local y la distinción evento/render. No se midió ritmo real de aula ni React DevTools. [Memoria detallada](memories/progressive-project-session-04.md).

### Sesión 05 · Ruta y evidencia

Orden: `session-05-start` → `session-05-step-01-type-filter` → `session-05-step-02-controlled-type` → `session-05-step-03-combined-filters` → `session-05-step-04-empty-causes` → `session-05-end`.

La guía incluye contratos, archivos completos y CSS en sus bloques después de la presentación continua. Conserva la etapa sin consumidor y la conexión sin filtrado por tipo. La práctica añade contador y limpieza; la referencia anterior omite su solución. Agenda 8 + 12 + 14 + 12 + 15 + 11 + 10 + 4 + 4 = 90 minutos, con registro de ritmo real pendiente.

Seis referencias verificadas mediante instalación congelada, build y lint desde extracciones limpias. Navegador: filtros por tipo y combinados, mayúsculas/espacios, mensajes por causa, contador, limpieza, teclado y foco. Fixture vacío temporal restaurado; cinco imágenes cargadas y consola sin warnings/errores. Sin prueba con lector de pantalla, React DevTools ni estudiantes. [Memoria](memories/progressive-project-session-05.md).

### Sesión 06 · Ruta y evidencia

Orden: `session-06-start` → `session-06-step-01-mantine` → `session-06-step-02-selection` → `session-06-step-03-modal-preview` = `session-06-workshop-start` → `session-06-step-04-callback-contracts` → `session-06-step-05-card-selection` → `session-06-end`.

La entrada añade MediaDetailContent y CSS a 05-end. La selección se demuestra primero con diagnóstico visible; el pre-taller contiene el modal desde Probar detalle, sin callback ni botón en tarjetas. La guía muestra 23 archivos completos, cada uno coincidente con su rama o con el extra temporal. Todo aparece después de presentación continua. Agenda: 75 antes del descanso + 30 descanso + 60 taller + 15 revisión = 180 minutos. Las slides 1–23 en 12 minutos requieren ensayo; se registra el punto de pausa sin afirmar que el ritmo esté validado.

Ocho referencias verificadas con instalación congelada, build y lint desde extracciones limpias. Navegador: diagnóstico de selección, modal previo al taller, tarjetas, contenido correcto, fallbacks, filtros heredados, tres cierres y retorno de foco; Tab/Shift+Tab permanecen dentro del modal. Extra de nombre accesible específico probado con build/lint y navegador y retirado de la referencia base. Sin prueba con lector de pantalla, React DevTools ni estudiantes. [Memoria](memories/progressive-project-session-06.md).

### Fuentes

- Context7, `/vitejs/vite`: scaffold con pnpm y scripts de Vite, consultado el 9 de septiembre de 2026.
- Manifests del registro: `create-vite@9.2.0`, `pnpm@11.17.0`, `react@19.2.8` y `vite@8.2.2` disponibles.
- El índice Mintlify no está disponible entre las herramientas de esta sesión.
- Para 06, Context7 `/websites/mantine_dev`: instalación, estilos, provider y Modal; manifests del registro para Mantine 9.4.1, PostCSS 8.5.26, preset 1.18.0 y simple-vars 7.0.1, consultados el 10 de septiembre de 2026.
- Para 02, Context7: React props y listas (`/reactjs/react.dev`), TypeScript strictNullChecks (`/microsoft/typescript-website`), consultados el 9 de septiembre de 2026.

La skill `brainstorming` se aplicó al diseño aprobado en la conversación. `writing-plans` no está instalada; este archivo conserva el plan concreto de implementación.


### Sesión 11 · Ruta y evidencia

Orden: `session-11-start` (= 10-end) → `session-11-step-01-modal-store` → `session-11-step-02-modal-entrypoints` → `session-11-step-03-form-schema` → `session-11-step-04-form-fields` → `session-11-step-05-body-preview` → `session-11-step-06-adapter-tests` → `session-11-end`.

La guía contiene 21 bloques de archivos completos cotejados con las referencias Git, incluidos package.json, configuración pública heredada, tipos, demostraciones temporales y sus reemplazos. Presentación continua 25 + coding 49 + tests con lectura 7 + práctica 6 + cierre 3 = 90 minutos. El ritmo sigue pendiente de medición en aula. Cada bloque especifica responsable, preguntas, respuestas, comprobación y reanudación.

Instalación congelada de la entrada y adición de versiones exactas sin actualizar dependencias anteriores. Las seis etapas pasan tests, lint y build; el cierre tiene 18 tests en 4 archivos. Navegador con respuestas controladas: un modal desde búsqueda y detalle, película/serie, tipo e ID, labels y valores, notas vacías/espacios/texto, límite 256/257, retirada de preview al editar, cierre/reapertura, móvil y ausencia de petición de creación. La búsqueda sigue usando POST. Sin afirmación de disponibilidad del backend público, guardado remoto o ritmo real.

Material público de 11: guía estudiantil y lectura en Markdown/HTML, control sin clave y PDF aprobado. Sin guía docente ni sesiones futuras en el frontend. Main y checkout docente anterior preservados; sin push. [Memoria de la iteración](memories/progressive-project-session-11.md).

### Sesión 12 · Ruta y evidencia

Orden: `session-12-start` (= 11-end) → `session-12-step-01-firebase-config` → `session-12-step-02-auth-provider` → `session-12-step-03-auth-forms` → `session-12-step-04-private-routes` → `session-12-step-05-authenticated-request` → `session-12-step-06-logout` → `session-12-step-07-auth-destination-tests` → `session-12-end`.

La guía contiene 33 bloques de archivos completos cotejados con las ramas exactas, incluida configuración, política local de scripts, aviso visible, proyección de sesión, formularios, destino, guardia, PageState heredado, cliente y diagnóstico temporal montado y retirado. Agenda: presentación continua 28 + coding 44 + prueba y práctica 10 + comprobación/cierre oral 8 = 90. La guía detallada queda disponible para revisión del usuario; el ritmo real de aula sigue pendiente.

Validación local: 24 tests en cinco archivos, lint y build con salida 0. Las siete etapas conservan checks locales exitosos. Navegador con SDK y respuestas controlados comprueba nueve grupos de recorridos, incluyendo configuración ausente, rutas públicas, formularios, sesión, guardia y retorno; el probe temporal compara 401/200 en ese entorno controlado. El fallo de logout se revisa en el código, no se atribuye a una ejecución real. HTTP real sin credencial devuelve 401 y OpenAPI conserva el contrato esperado; un 200 con un proyecto Firebase real, su allowlist y CORS de la cohorte permanecen pendientes.

Material público 12: guía estudiantil y lectura en Markdown/HTML, control sin clave y PDF de 28 páginas. El PDF conserva la corrección factual de la ruta `src/api/http.ts`; no cambia el concepto aprobado. Sin guía docente o sesiones futuras en el frontend; main inicial y checkout docente anterior preservados, sin push. [Memoria de la iteración](memories/progressive-project-session-12.md).

Cierre final: `session-12-end` → `1b283f9`. El commit `2b4fbeb` añade los materiales públicos; `1b283f9` actualiza solamente el PDF con su caption HTTP corregido. Las siete referencias de código siguen intactas, el worktree termina limpio y el checkout docente conserva `session-07-start`.

### Sesión 13 · Ruta y evidencia

Orden: `session-13-start` (12-end más contratos preparados) → `step-01-optional-auth-scope` → `step-02-create-mutation` → `step-03-library-query` → `step-04-consistency-logout` = `session-13-workshop-start` → `step-05-library-model` → `step-06-library-states` → `step-07-library-filter` → `step-08-filter-tests` → `session-13-end`. Todos los step llevan prefijo session-13-.

La guía conserva archivos completos por transformación, definiciones heredadas en el paso correspondiente, preguntas y respuestas, instrucciones numeradas y punto para retomar. Agenda 18 de presentación continua +57 coding/consigna +30 descanso +60 taller +15 cierre =180. Ritmo real de aula pendiente. Seed omite modelo/adapter visual, filas, estados finales, control y suite del taller.

Entrada y ocho etapas pasan tests, lint y build. Suite final:30tests/6archivos. Contrato público OpenAPI contrastado; list válido sin token devuelve401. La prueba de navegador usa SDK Firebase real con respuestas controladas y API local mediante Postman; no acredita aceptación de Firebase/backend reales ni CORS de cohorte. Main y checkout docente preservados, sin push. [Memoria de la iteración](memories/progressive-project-session-13.md).
