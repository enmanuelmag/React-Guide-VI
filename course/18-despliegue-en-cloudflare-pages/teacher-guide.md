# Guía docente · Sesión 18 · Despliegue en Cloudflare Pages

> Estado: paquete textual aprobado. La presentación visual y el seed ejecutable permanecen pendientes de sus etapas correspondientes.

- **Fecha:** jueves 12 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Borrador de sesión:** [session-draft.md](session-draft.md)
- **Seed propuesto:** `s08-c18-cloudflare-pages-seed`

## Objetivo docente

Guiar al grupo desde un release candidate local hasta una URL externa comprobada. La dificultad principal es reconocer la cadena completa y localizar un fallo en su capa: fuente, entorno, build, hosting, Router, Firebase, CORS o API.

La clase no añade features, no crea otro proyecto React y no enseña infraestructura serverless.

## Preparación docente

Completar al menos 24 horas antes:

1. Confirmar que el checkpoint de la sesión 16 tiene un worktree limpio y termina `pnpm test` y `pnpm build` con código 0 sobre la revisión que se publicará.
2. Confirmar el procedimiento institucional para que cada estudiante tenga cuenta Cloudflare y acceso al repositorio remoto.
3. Recopilar o validar los nombres de proyectos Pages y los orígenes exactos `https://<proyecto>.pages.dev`.
4. Autorizar los orígenes exactos en el backend docente, sin slash final y sin usar `*`.
5. Probar Login y una lectura privada desde el origen Pages de referencia.
6. Confirmar que el repositorio de referencia usa `main`, `pnpm-lock.yaml` y `packageManager: pnpm@11.17.0`.
7. Preparar los siete values públicos para demostración sin mostrarlos en pantalla completa.
8. Confirmar que ninguna variable contiene tokens de ID, tokens de Cloudflare, contraseñas, claves privadas o cuentas de servicio.
9. Abrir un despliegue exitoso y conservar un log fallido preparado para la comparación.
10. Preparar el checkpoint de rescate: proyecto Pages de referencia, URL autorizada y build anterior.

No proyectar pantallas que contengan credenciales del proveedor Git o Cloudflare. Ocultar la columna de values cuando se revise el inventario de variables.

## Configuración aprobada

| Campo | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| `NODE_VERSION` | `22.22.0` |
| `PNPM_VERSION` | `11.17.0` |

Variables públicas requeridas. `VITE_API_URL` usa la base canónica sin slash final:

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Fuentes verificadas

Revisión realizada el 7 de septiembre de 2026:

- [Cloudflare Pages · React](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Cloudflare Pages · Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare Pages · Build image](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare Pages · Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Vite · Building for Production](https://vite.dev/guide/build.html)
- [Vite · Deploying a Static Site](https://vite.dev/guide/static-deploy.html)
- [Vite · Env Variables and Modes](https://vite.dev/guide/env-and-mode.html)

Versiones del curso relevantes:

- Vite `8.2.2`.
- Node `>=22.22.0`.
- pnpm `11.17.0`.

Context7 se consultó empezando por `resolve-library-id` para Cloudflare Pages y Vite. La imagen de build vigente publica Node `22.16.0` y pnpm `10.11.1` como defaults, pero admite fijar cualquier versión mediante `NODE_VERSION` y `PNPM_VERSION`; el curso conserva `22.22.0` y `11.17.0`. El registro npm mantiene Vite `8.2.2`, compatible con Node `^20.19.0 || >=22.12.0`, y pnpm `11.17.0`, compatible con Node `>=22.13`. El índice Mintlify no expuso una herramienta invocable durante esta revisión. Las comprobaciones del seed futuro siguen siendo necesarias.

## Clave de la lectura previa

| Pregunta | Respuesta | Justificación | Fuente |
| --- | --- | --- | --- |
| 1 | C | Vite genera `dist`; esa es la carpeta que Pages debe publicar. | Cloudflare React, `Deploy via the Cloudflare dashboard`. |
| 2 | A | Pages instala las dependencias, ejecuta el build y publica su salida. | Cloudflare React, `Deploy via the Cloudflare dashboard`. |
| 3 | Verdadero | Sin un `404.html` superior, Pages puede enviar las rutas de una SPA al archivo raíz. | Cloudflare Serving Pages, `Single-page application rendering`. |
| 4 | Verdadero | Vite incluye los valores `VITE_*` usados por el código en el JavaScript del cliente. | Vite, `Env Variables`. |
| 5 | C | Una cuenta de servicio contiene credenciales privadas y nunca debe llegar al bundle del navegador. | Vite, advertencia de seguridad de `Env Variables`. |

Si fallan las preguntas 1 o 2, recuperar la cadena antes de abrir Cloudflare. Si falla la 4 o 5, detener la copia de variables y reconstruir la clasificación público/secreto.

## Modelo de evidencia

| Capa | Pregunta | Evidencia principal |
| --- | --- | --- |
| Fuente | ¿Qué revisión se publicó? | `HEAD` local limpio y revisión mostrada por Pages. |
| Local | ¿Esa revisión construye? | Código 0 de test y build asociado al `HEAD` registrado. |
| Entorno | ¿Qué versiones usó el proveedor? | Variables y build log. |
| Build remoto | ¿Pages produjo artefactos? | Log remoto verde. |
| Hosting | ¿Los assets están publicados? | URL externa y Network. |
| Router | ¿Una URL anidada es recargable? | Apertura directa y refresh. |
| Firebase | ¿La sesión funciona en el origen publicado? | Login o restauración observable. |
| API y CORS | ¿El navegador puede leer la respuesta? | Request, status y headers en Network. |

## Trabajo con agente

El audit ocurre entre el preflight local y la configuración de Cloudflare. La persona decide primero el contrato de despliegue; el agente contrasta archivos y ejecuta comprobaciones sin editar fuente o configuración. `pnpm build` puede regenerar `dist` como artefacto ignorado. La salida esperada contiene `Confirmado`, `Gaps` y `No comprobado`, y se detiene ante el primer comando fallido sin corregirlo.

La secuencia incluye el prompt completo, la lectura posterior y la frontera de evidencia.

## Secuencia detallada

### 0–10 min · Readiness y checkpoint anterior

1. Revisar las preguntas con mayor error.
2. Pedir al grupo que nombre la evidencia final de la sesión 16.
3. Confirmar cuenta Cloudflare, acceso al repo, `main`, worktree limpio, revisión local identificada y origen prerregistrado.
4. Mostrar el semáforo de readiness:

```text
verde: repo + cuenta + revisión publicable + origen autorizado
amarillo: falta permiso del proveedor; usa referencia y registra dependencia
rojo: release candidate falla localmente; usa checkpoint de rescate
```

Pregunta: “¿Cuál es el artefacto que Pages debe servir?”. Respuesta esperada: el contenido de `dist`, no el código de `src`.

### 10–22 min · Build, preview y deploy

Dibujar:

```text
pnpm dev      → servidor y transformación de desarrollo
pnpm build    → dist local
pnpm preview  → inspección local de dist
Cloudflare    → build remoto + publicación + URL
```

Pedir un límite por evidencia:

- build local no prueba proveedor;
- preview no es servidor de producción;
- URL raíz no prueba rutas anidadas;
- login visible no prueba API privada;
- build log no prueba navegador.

Transición: “Ya sabemos qué produjo cada etapa. Ahora fijaremos qué revisión merece llegar al proveedor”.

### 22–34 min · Release candidate local

Ejecutar:

```bash
git status --short
git rev-parse HEAD
pnpm test
pnpm build
pnpm preview
```

No llamar deploy a `pnpm preview`. Con el preview abierto:

1. comprobar `/search`;
2. abrir un detalle público;
3. recargar la URL anidada;
4. abrir `/app/library` sin sesión;
5. cerrar preview después de registrar el resultado.

El primer comando debe quedar vacío. Registrar el hash de `HEAD` antes de test y build; si existen cambios de fuente sin registrar, detener el despliegue y usar el checkpoint acordado en lugar de atribuir esas pruebas a una revisión distinta. La sesión no enseña commit o push.

Revisar `.env.example` por nombres, no `.env.local` por values. Confirmar `packageManager` y que `dist` no se versiona.

Checkpoint intermedio: revisión local identificada, test y build verdes sobre esa revisión, rutas críticas enumeradas y siete nombres `VITE_*` confirmados.

### 34–43 min · Audit asistido sin editar fuente

La persona ya definió el contrato. Copiar este prompt completo:

```text
Punto de entrada verificable:
- El proyecto es una SPA React construida con Vite.
- package.json debe declarar pnpm@11.17.0 y scripts test, build y preview.
- pnpm-lock.yaml es el único lockfile permitido.
- .env.example debe fijar `VITE_API_URL=https://bootcamp-medialog.cardor.dev` y enumerar seis variables `VITE_FIREBASE_*` sin values reales.
- Las rutas públicas y privadas ya existen.

Objetivo único:
Audita sin editar fuente o configuración si el repositorio está preparado para un build estático en Cloudflare Pages. Devuelve confirmado, gaps y aspectos no comprobados.

Fuente del comportamiento esperado:
- Production branch: main.
- Build command: pnpm build.
- Output directory: dist.
- Runtime remoto: Node 22.22.0 y pnpm 11.17.0.
- La SPA no necesita 404.html, _redirects, Wrangler, Pages Functions o Workers en el caso base.
- La revisión probada debe quedar identificada para compararla después con la revisión publicada por Pages.

Archivos que puedes leer:
- package.json
- pnpm-lock.yaml
- .env.example
- vite.config.ts
- .gitignore
- src/App.tsx y los módulos de rutas importados por ese archivo

Cambios permitidos:
- Ningún cambio de fuente o configuración. pnpm test y pnpm build pueden crear cachés o artefactos ignorados; repórtalos por separado y no los presentes como cambios del producto.

Cambios y acciones prohibidas:
- No leas .env, .env.local o archivos que contengan values reales.
- No muestres credenciales, tokens o configuración privada.
- No instales dependencias.
- No ejecutes login, deploy, Wrangler, Cloudflare, Git push, commit, checkout o reset.
- No corrijas errores ni modifiques tests para obtener verde.

Criterios observables:
- Identifica packageManager, scripts, lockfile, output esperado y nombres de variables.
- Enumera una ruta raíz, una pública anidada y una privada para comprobación posterior.
- Señala cualquier 404.html, _redirects o configuración Cloudflare inesperada.
- Registra el hash de HEAD y exige un estado Git limpio antes de atribuir test y build a esa revisión.
- Separa hechos leídos, resultados ejecutados y aspectos que requieren navegador o proveedor.

Ejecuta estos comandos en orden:
1. git status --short
2. git rev-parse HEAD
3. pnpm pkg get packageManager
4. pnpm test
5. pnpm build
6. git diff --check
7. git status --short

Condición de parada:
Si el primer git status no está vacío, si un comando falla o si el estado final contiene cambios nuevos, detente después de registrar el primer dato útil. No lo corrijas. Si falta un archivo esperado, repórtalo como gap sin inventar su contenido.

Formato de lectura posterior:
Resume archivos leídos, hash de HEAD, estados Git inicial y final, cadena de build, rutas elegidas, decisiones confirmadas, artefactos ignorados, supuestos y límites. Termina con tres secciones: Confirmado, Gaps y No comprobado.
```

El estudiante abre cada archivo citado y contrasta el informe. Un audit que dice “listo para producción” sin nombrar sus límites se rechaza.

### 43–58 min · Configurar Cloudflare Pages

Demostrar desde el proyecto de referencia y luego permitir réplica:

1. Abrir `Workers & Pages`.
2. Crear o seleccionar una aplicación Pages mediante importación del repositorio Git.
3. Confirmar repositorio y rama `main`.
4. Configurar `pnpm build`.
5. Configurar `dist`.
6. Registrar `NODE_VERSION=22.22.0`.
7. Registrar `PNPM_VERSION=11.17.0`.
8. Registrar las siete variables `VITE_*` en producción.
9. Revisar los nombres antes de guardar.

No dictar values en voz alta. Quien no tenga un value consulta su configuración privada de la sesión 12 o solicita apoyo individual sin compartir pantalla completa.

Pregunta: “¿Por qué `VITE_API_URL` exige un nuevo despliegue si cambia?”. Respuesta esperada: Vite sustituye el value durante el build y genera otro bundle.

### 58–70 min · Primer despliegue y lectura del log

Cada estudiante inicia el despliegue y localiza en el log:

- revisión y rama, y confirma que la revisión coincide con el `HEAD` probado localmente;
- instalación con pnpm;
- comando `pnpm build`;
- finalización del build;
- publicación de `dist`;
- URL y deployment id.

No corregir varios síntomas a la vez. Si falla:

1. leer el primer error útil;
2. clasificar instalación, runtime, variables o build;
3. comparar con el build local;
4. cambiar solo la configuración que explica el error;
5. volver a desplegar.

El agente no corrige esta fase. La lectura del log es parte del resultado de aprendizaje.

### 70–83 min · Comprobación externa

Usar una ventana privada o un navegador que no dependa del servidor local:

1. Abrir la raíz `pages.dev`.
2. Abrir `/search` directamente.
3. Abrir un detalle público real y recargar.
4. Abrir `/app/library` sin sesión y observar la guardia.
5. Iniciar sesión.
6. Abrir biblioteca y un detalle privado.
7. Editar un registro con el formulario existente o ejecutar una lectura privada acordada.
8. Inspeccionar Console y Network.

Para API, registrar:

- URL solicitada;
- método;
- status;
- presencia del header CORS de respuesta cuando corresponda;
- resultado visible.

No copiar ni capturar el Bearer token.

Si la SPA abre y Network informa un bloqueo CORS, confirmar el origen exacto y escalar al prerrequisito docente. No modificar React, Firebase o el cliente HTTP para ocultarlo.

### 83–90 min · Ficha y cierre

Cada estudiante completa:

```text
Rama de producción:
Revisión local comprobada:
Revisión publicada:
URL de Pages:
Deployment id:
Test local:
Build local:
Build remoto:
Ruta pública recargada:
Guardia privada:
Login:
API y CORS:
Gap conocido:
```

Esta ficha es el entregable que la sesión 19 recibe para identificar el producto y defender cada afirmación con su evidencia y su límite.

Cerrar con cuatro preguntas:

1. ¿Qué evidencia identifica la revisión publicada?
2. ¿Por qué `VITE_*` no funciona como bóveda de secretos?
3. ¿Dónde investigas una SPA visible con API bloqueada?
4. ¿Qué evidencia llevarás a una demostración externa?

## Diagnóstico por síntomas

| Síntoma | Primera capa | Comprobación | Acción acotada |
| --- | --- | --- | --- |
| Pages no instala | Runtime o gestor | Versión y primera línea útil del log | Revisar `NODE_VERSION`, `PNPM_VERSION` y lockfile. |
| Build remoto falla, local pasa | Diferencia de entorno o variables | Comparar versiones y nombres disponibles | Corregir una configuración y redeploy. |
| URL responde 404 en raíz | Salida equivocada | Build output y contenido de `dist` | Configurar `dist`. |
| Raíz abre, refresh anidado falla | Hosting SPA o `404.html` inesperado | Request document y salida publicada | Retirar configuración inesperada o revisar el proyecto correcto. |
| Pantalla queda vacía | Bundle o variable ausente | Console y requests JS | Identificar el primer error; no cambiar Router por intuición. |
| Firebase rechaza | Configuración Firebase | Código de error y nombres `VITE_FIREBASE_*` | Corregir el value privado y redeploy. |
| API funciona local, falla en Pages | URL o CORS | Request, origin y response headers | Comparar `VITE_API_URL` y allowlist docente. |
| API devuelve 401 | Auth o token | Status y flujo de sesión, sin exponer token | Separar CORS de autorización y revisar sesión. |

## Contingencias

- **Cloudflare no responde:** usar el proyecto de referencia para leer logs y ejecutar la matriz. Registrar que no existe despliegue individual todavía.
- **Proveedor Git rechaza permisos:** no enseñar OAuth o llaves SSH. Usar referencia y resolver permisos fuera de clase.
- **CORS docente incompleto:** demostrar publicación y rutas; marcar API como bloqueada por origen externo. El docente corrige la allowlist fuera de la actividad estudiantil.
- **Firebase o backend caído:** demostrar hosting y Router, conservar Network como evidencia del bloqueo y repetir el recorrido cuando vuelva el servicio.
- **Release candidate falla localmente:** entregar checkpoint 16 de rescate. No usar el bloque de despliegue para reparar features.
- **Grupo retrasado al minuto 58:** configurar primero Node, pnpm, `VITE_API_URL` y Firebase; usar el proyecto de referencia para la lectura del log.

El resultado normal sigue siendo una URL individual con recorrido completo. Las contingencias documentan una dependencia; no permiten declarar aprobado un comportamiento que no se observó.

## Frontera de evidencia

| Evidencia | Demuestra | No demuestra |
| --- | --- | --- |
| `pnpm test` | Suites automatizadas del proyecto | Build, proveedor o navegador |
| `pnpm build` | Bundle local producido | Publicación remota |
| `pnpm preview` | Inspección local de `dist` | Hosting de producción |
| Build log remoto | Instalación y build en Pages | Flujo funcional en navegador |
| URL raíz | Assets publicados | Refresh anidado, Auth o API |
| Refresh anidado | Fallback SPA y Router para esa ruta | Resto de rutas |
| Login | Firebase en ese origen | API privada |
| Network API | Request, status y headers | Regresión completa del producto |

## Fuera de alcance

- C3, Wrangler, Direct Upload como flujo base o Pages Functions.
- Custom domains, DNS, analytics, cache rules o preview branches.
- SSR, SSG, Workers, KV o D1.
- Cambios del backend por estudiantes.
- Reparación del CRUD, Router.
- Presentación final o una feature nueva.
