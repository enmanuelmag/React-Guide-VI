# Sesión 18 · Despliegue en Cloudflare Pages

> Estado: paquete textual aprobado definitivamente. La presentación visual y el proyecto progresivo o seed ejecutable permanecen pendientes de sus frentes correspondientes.

- **Fecha:** jueves 12 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Seed propuesto:** `s08-c18-cloudflare-pages-seed`

## Fuente y posición en el curso

Esta sesión es material nuevo. Ninguna de las 23 guías históricas enseña el despliegue vigente. La clase 24 anterior aporta únicamente el criterio de cerrar con regresión y evidencia; sus features de drawer, carga diferida y calendario no se migran.

La sesión 18 recibe el producto de la sesión 16 y entrega una URL verificable a la presentación final de la sesión 19.

## Punto de entrada

El release candidate ya contiene:

- búsqueda y detalle públicos;
- rutas declarativas recargables en desarrollo;
- registro, login, sesión restaurable y rutas privadas;
- creación, biblioteca, filtro por tipo, detalle, edición y eliminación;
- tests puros ejecutables con Vitest;
- `pnpm build` y `pnpm preview` configurados por Vite;
- `packageManager: pnpm@11.17.0`;
- Node `>=22.22.0` como mínimo de la cohorte;
- `.env.example` con `VITE_API_URL=https://bootcamp-medialog.cardor.dev` y los seis nombres `VITE_FIREBASE_*` vacíos.

La sesión no comienza si el release candidate falla localmente o si el código probado no corresponde a una revisión Git limpia e identificable. El docente usa el checkpoint de rescate y registra el error del proyecto del estudiante para resolverlo fuera del bloque de despliegue. La clase no enseña commit o push.

## Prerrequisitos institucionales

Antes de clase:

- cada estudiante dispone de una cuenta Cloudflare y acceso al repositorio GitHub o GitLab que contiene el checkpoint 16;
- la rama de producción se llama `main`;
- el nombre del proyecto Pages y su origen exacto `https://<proyecto>.pages.dev` se registran mediante la logística definida por el docente;
- el backend docente autoriza esos orígenes exactos mediante su configuración CORS antes de la comprobación autenticada;
- el docente conserva un proyecto Pages de referencia con el mismo stack y un dominio autorizado;
- nadie comparte tokens de Cloudflare, credenciales Git, contraseñas o valores privados durante la sesión.

El curso no usa `*` para CORS. Si un origen todavía no está autorizado, el estudiante puede demostrar publicación y rutas estáticas, pero no se presenta la integración API como aprobada.

## Limitación visible

El checkpoint local todavía depende de la computadora que ejecuta el servidor de Vite:

```text
código fuente
  → pnpm build
  → dist local
  → pnpm preview
  → solo esta computadora y este proceso
```

La presentación final necesita otra cadena:

```text
repositorio
  → entorno de build remoto
  → dist publicado
  → URL pages.dev
  → navegador externo
  → Firebase + API docente
```

`pnpm build` demuestra que Vite puede producir artefactos. `pnpm preview` permite inspeccionarlos localmente. Ninguna de esas dos evidencias demuestra que Cloudflare publicó el sitio o que un navegador remoto puede completar el recorrido.

## Resultado de aprendizaje

El estudiante configurará y comprobará un despliegue reproducible de la SPA existente mediante la integración Git de Cloudflare Pages, distinguiendo configuración pública, runtime de build, publicación, fallback de rutas y dependencias externas.

## Checkpoint de salida

Al terminar:

- Cloudflare Pages está conectado al repositorio correcto y a `main`.
- La revisión local probada coincide con la revisión que Pages muestra como publicada.
- El build remoto ejecuta `pnpm build` y publica `dist`.
- `NODE_VERSION=22.22.0` y `PNPM_VERSION=11.17.0` fijan el entorno remoto.
- Las siete variables `VITE_*` están configuradas para producción.
- El estudiante explica que los valores `VITE_*` quedan visibles en el bundle y no contienen secretos.
- El log remoto muestra instalación, build y publicación terminados.
- La URL `https://<proyecto>.pages.dev` abre desde una ventana nueva.
- Una ruta pública anidada abre de forma directa y sobrevive una recarga.
- `/app/library` redirige a Login sin sesión.
- Login permite abrir la biblioteca cuando Firebase, CORS y backend están disponibles.
- Network muestra requests hacia la URL configurada en `VITE_API_URL`.
- El estudiante diferencia un fallo de build, un 404 de hosting, un error Firebase, un bloqueo CORS y un error HTTP de la API.
- La URL, el identificador del despliegue y las evidencias quedan registrados para la sesión 19.

Un build verde no prueba navegador. Una URL que renderiza el encabezado no prueba Auth o API. Un request exitoso no prueba que una ruta anidada sea recargable.

## Concepto principal

Un despliegue reproducible conecta una revisión del código con un entorno de build declarado, un artefacto publicado y un recorrido observable desde una URL externa.

```text
fuente identificable
  → entorno reproducible
  → build verificable
  → artefacto publicado
  → rutas servidas
  → integraciones comprobadas
```

## Vocabulario

- **Build:** transformación del código fuente en artefactos distribuibles.
- **Artefacto:** archivo producido por el build, como `dist/index.html` o un bundle JavaScript.
- **Deploy:** publicación de artefactos en un entorno accesible.
- **Producción:** entorno que sirve la rama y configuración destinadas a la entrega.
- **Preview local:** servidor temporal para inspeccionar `dist`; no es hosting de producción.
- **Build remoto:** ejecución del comando de build dentro de la infraestructura del proveedor.
- **Build log:** registro de instalación, comandos, errores y publicación.
- **Variable de build:** value disponible mientras el proveedor construye la aplicación.
- **Variable pública:** configuración incorporada al JavaScript que descarga el navegador.
- **Secreto:** credencial que no puede enviarse al bundle del cliente.
- **Origen:** combinación de esquema, host y puerto usada por CORS.
- **CORS:** política del navegador que decide si un origen puede leer una respuesta remota.
- **Fallback SPA:** entrega de la entrada raíz para que el router del cliente interprete una ruta.
- **Release candidate:** versión que ya superó las comprobaciones locales previstas y se propone para publicar.

## Decisiones técnicas

### Integración Git, no proyecto nuevo

La clase conecta el repositorio existente desde el dashboard de Cloudflare Pages. No ejecuta `create-cloudflare`, porque C3 crearía otro proyecto React y ocultaría el recorrido acumulado durante 16 sesiones.

Tampoco instala Wrangler ni añade `wrangler.jsonc`: la aplicación es una SPA estática sin Pages Functions o Workers.

### Build y salida

```text
Production branch: main
Build command: pnpm build
Build output directory: dist
```

Vite usa `index.html` como entrada y produce `dist` por defecto. El proveedor publica el contenido de esa carpeta, no `src/` ni el repositorio completo.

### Runtime reproducible

El build image de Pages no debe decidir las versiones críticas por default:

```text
NODE_VERSION=22.22.0
PNPM_VERSION=11.17.0
```

Node conserva el mínimo transversal aprobado y pnpm coincide con `packageManager` y el lockfile del curso.

### Variables públicas

Cloudflare recibe estas variables. La URL pública de la API usa la base canónica sin slash final:

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Vite sustituye esas variables durante el build. El navegador puede inspeccionar sus values dentro de los assets. La configuración web de Firebase identifica el proyecto; no equivale a una clave privada. Ninguna variable contiene contraseñas, tokens de ID, tokens de Cloudflare o cuentas de servicio.

Cambiar una variable de build requiere otro despliegue para producir un bundle nuevo.

### Fallback de React Router

Cloudflare Pages trata el proyecto como SPA cuando la salida no contiene un `404.html` superior. En el caso base no se añade `_redirects` ni un Worker. La prueba abre directamente una URL como:

```text
https://<proyecto>.pages.dev/media/movie/<externalId>
```

Después recarga la página. Cloudflare debe entregar la entrada y React Router debe interpretar los parámetros.

### CORS como dependencia externa

La URL docente del backend usa una lista de orígenes exactos. Cloudflare no puede reparar un origen ausente. El docente registra `https://<proyecto>.pages.dev` sin slash final antes de la prueba autenticada.

La guía distingue:

| Evidencia | Interpretación |
| --- | --- |
| `dist` existe | Vite produjo artefactos locales |
| Build remoto verde | Cloudflare pudo instalar y construir |
| URL muestra la SPA | Pages publicó los assets |
| Refresh anidado funciona | Hosting y Router cooperan |
| Login funciona | Firebase acepta la configuración web y el navegador completa Auth |
| Request API visible | La SPA usa `VITE_API_URL` |
| Response legible | Backend, autorización y CORS permiten completar el flujo |

## Estado inicial, transformación y estado final

### Estado inicial

```text
repositorio con checkpoint 16
├── package.json
├── pnpm-lock.yaml
├── .env.example
├── vite.config.ts
└── src/
    ├── rutas públicas y privadas
    ├── Firebase Auth
    ├── cliente HTTP
    └── CRUD completo
```

### Transformación guiada

```text
preflight local
  → identificar revisión limpia
  → audit sin editar fuente
  → conectar repositorio
  → declarar build y runtime
  → registrar VITE_*
  → desplegar
  → leer logs
  → probar rutas
  → probar Auth, API y CORS
  → registrar evidencia
```

### Estado final

```text
repositorio sin feature nueva
└── Cloudflare Pages
    ├── main conectada
    ├── pnpm build
    ├── dist
    ├── Node y pnpm fijados
    ├── variables de producción
    ├── deployment id
    └── https://<proyecto>.pages.dev
```

## Secuencia · 90 minutos

| Tiempo | Responsable | Actividad | Evidencia |
| ---: | --- | --- | --- |
| 0–10 | Docente y grupo | Recuperar checkpoint 16 y comprobar cuenta, repositorio, rama y prerregistro CORS. | Readiness clasificado por estudiante. |
| 10–22 | Presentación docente | Distinguir desarrollo, build, preview y deploy mediante sus artefactos. | El grupo asigna una evidencia a cada etapa. |
| 22–34 | Práctica guiada | Identificar una revisión limpia; ejecutar test, build y preview; inventariar variables y rutas críticas. | Release candidate local con revisión y código 0. |
| 34–43 | Trabajo asistido | Ejecutar audit sin editar fuente y contrastar el informe. | Confirmado, gap y no comprobado separados. |
| 43–58 | Demostración y réplica | Conectar repo y configurar rama, build, salida, Node, pnpm y variables. | Proyecto Pages listo para construir. |
| 58–70 | Actividad estudiantil | Iniciar despliegue y leer el build log hasta la URL publicada. | Deployment remoto terminado. |
| 70–83 | Comprobación guiada | Probar raíz, refresh anidado, guardia, Login, API, CORS, Console y Network. | Matriz de recorrido marcada con evidencia. |
| 83–90 | Docente y grupo | Registrar URL, deployment id, límites y entrega para la sesión 19. | Ficha de despliegue completa. |

**Comprobación:** `10 + 12 + 12 + 9 + 15 + 12 + 13 + 7 = 90`.

## Guion de presentación

La presentación inicial ocupa 12 minutos. La clase vuelve al deck durante los últimos 3 minutos.

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Un producto listo localmente | Recuperar test, build y regresión de la sesión 16. | Checklist con evidencias reales. |
| Problema | `localhost` no es una entrega | La presentación final necesita una URL externa. | Dos navegadores, dos computadoras. |
| Cadena | Fuente, build, artefacto y hosting | Cada etapa produce algo inspeccionable. | Pipeline horizontal. |
| Contraste | Build, preview y deploy | Los tres comandos o servicios responden preguntas distintas. | Tabla de preguntas y evidencias. |
| Entorno | El proveedor también necesita versiones | Node, pnpm y lockfile deben coincidir. | Local frente a build image. |
| Variables | Configuración pública durante el build | `VITE_*` queda en el cliente y exige redeploy. | Caja transparente, no bóveda. |
| Seguridad | Qué nunca llega al bundle | Contraseñas, tokens y cuentas de servicio quedan fuera. | Clasificación de values. |
| SPA | El servidor entrega la entrada | Pages sirve la raíz y Router interpreta la URL. | Request anidado hacia `index.html`. |
| Dependencia | CORS decide quién puede leer | El origen exacto debe estar autorizado. | Triángulo Browser, Pages y API. |
| Diagnóstico | El primer error útil está en una capa | Build log, Console y Network responden preguntas distintas. | Árbol corto de diagnóstico. |
| Evidencia | Verde no significa todo funciona | Separar artefacto, deploy, ruta y recorrido. | Matriz de pruebas. |
| Cierre | Una URL lista para defender | La sesión 19 recibe producto y evidencia, no features pendientes. | Flecha hacia presentación final. |

### Preguntas de cierre

1. ¿Qué demuestra `pnpm build` que una URL pública todavía no demuestra?
2. ¿Por qué cambiar `VITE_API_URL` exige otro build?
3. ¿Qué capa investigas si la SPA abre, pero el navegador bloquea el response de la API?
4. ¿Qué prueba debes ejecutar para afirmar que React Router funciona al recargar una URL anidada?

## Proyecto semilla

### Incluye

- Checkpoint completo y regresionado de la sesión 16.
- `package.json` con scripts `test`, `build` y `preview`.
- `packageManager: pnpm@11.17.0` y `pnpm-lock.yaml`.
- `.env.example` con la URL pública de la API y sin values propios de Firebase.
- Rutas públicas y privadas completas.
- Un registro descartable para el recorrido autenticado.

### No incluye

- Cuenta, proyecto o token Cloudflare.
- Conexión a GitHub o GitLab.
- Values de Firebase o de la API.
- `dist` versionado.
- `wrangler`, Pages Functions, Workers o custom domain.
- `_redirects` o `404.html` artificial.
- Backend modificado por estudiantes.

### Checkpoint de rescate

El docente conserva un repositorio de referencia conectado a Pages con variables de demostración, origen CORS autorizado y un despliegue anterior. No comparte sus credenciales. Si Cloudflare o el proveedor Git falla, el grupo usa ese proyecto para leer logs y comprobar rutas mientras registra la dependencia externa.

## Trabajo con agente

La persona define antes del audit:

- rama `main`;
- comando `pnpm build`;
- salida `dist`;
- Node `22.22.0` y pnpm `11.17.0`;
- siete nombres `VITE_*`;
- rutas que deben comprobarse;
- prohibición de secretos y cambios.

El agente ejecuta un audit sin editar fuente o configuración. Registra el estado Git y `HEAD`, lee configuración, corre test y build en un orden cerrado y devuelve un informe. El build puede regenerar `dist` como artefacto ignorado; el agente lo distingue de un cambio del producto. No abre servicios externos y no despliega.

El estudiante contrasta cada afirmación con los archivos y outputs. Un informe del agente no constituye evidencia de Cloudflare o navegador.

## Evidencia de salida

- Salida 0 de `pnpm test` y `pnpm build` asociada a un `HEAD` limpio.
- Coincidencia entre esa revisión local y la revisión de la rama desplegada.
- Build log remoto con comando y resultado.
- URL y deployment id.
- Captura o demostración de raíz y refresh anidado.
- Redirección de ruta privada sin sesión.
- Login y biblioteca con sesión, cuando las dependencias docentes están disponibles.
- Request y response de API inspeccionados en Network sin exponer el token.
- Clasificación de cualquier fallo por capa.

## Fuera de alcance

- Crear una aplicación nueva con C3.
- Instalar o enseñar Wrangler.
- Direct Upload como flujo base.
- Pages Functions, Workers, KV, D1 o backend serverless.
- Custom domains, DNS, analytics o reglas de caché.
- Pull requests, preview branches o diseño de CI.
- SSR, SSG o migración de arquitectura.
- Añadir service workers o soporte offline.
- Cambiar el backend durante la actividad estudiantil.
- Copiar tokens o credenciales al repositorio o a variables `VITE_*`.
- Reparar features de sesiones anteriores.
- Preparar la presentación final; pertenece a la sesión 19.

## Cambios retrospectivos

- `rules/course-architecture.md` se revisó y ya fija el contrato de despliegue, las capas de evidencia y el prerrequisito CORS exacto.
- `draft/index.md` se revisó y ya enlaza este paquete en la secuencia de 18 sesiones; no requiere cambios.
- La sesión 16 entrega el release candidate completo y regresionado que esta sesión usa como punto de entrada.
- La salida conserva URL, revisión Git, deployment id y matriz de evidencia para que la sesión 19 los reciba sin volver a enseñar publicación.
- La revisión final actualiza fuentes y versiones, añade trazabilidad entre el `HEAD` probado y la revisión publicada y aclara que el audit no edita fuente aunque el build produzca artefactos ignorados.
- La sesión no introduce tipos, funciones, componentes o hooks de la aplicación y no requiere una regla nueva.
