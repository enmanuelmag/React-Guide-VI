# Guía estudiantil · Sesión 18 · Despliegue en Cloudflare Pages

> Paquete textual aprobado. Trabaja sobre el seed indicado por el docente cuando esté disponible.

- **Fecha:** jueves 12 de noviembre de 2026
- **Semana:** 8
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Seed propuesto:** `s08-c18-cloudflare-pages-seed`

## Objetivo

Publicar la SPA existente mediante la integración Git de Cloudflare Pages y demostrar, con evidencias separadas, que el build remoto, las rutas, Firebase y la API funcionan desde una URL externa.

No crearás otro proyecto React ni añadirás una feature. Desplegarás el checkpoint completo de la sesión 16.

## Punto de partida

Antes de configurar Cloudflare, confirma:

- acceso a tu cuenta Cloudflare;
- acceso al repositorio GitHub o GitLab;
- rama de producción `main`;
- worktree limpio y revisión local identificable;
- origen `https://<proyecto>.pages.dev` registrado según la logística docente;
- checkpoint 16 completo;
- `.env.example` con la URL pública de la API y sin values propios de Firebase;
- ningún token o archivo privado dentro del repositorio.

Si falta un permiso externo, informa el error exacto. No copies credenciales al chat, a una captura o al repositorio.

## Mapa de la sesión

```text
release candidate local
  → audit de configuración
  → repo conectado
  → build remoto
  → dist publicado
  → rutas recargables
  → Firebase + API + CORS
  → evidencia registrada
```

## Paso 1 · Comprueba el release candidate

Ejecuta:

```bash
git status --short
git rev-parse HEAD
pnpm test
pnpm build
pnpm preview
```

Con preview abierto:

1. abre `/search`;
2. abre un detalle público real;
3. recarga esa ruta;
4. abre `/app/library` sin sesión;
5. detén preview después de registrar el resultado.

`git status --short` debe quedar vacío. Conserva el hash de `HEAD`: test y build respaldan esa revisión, no cambios locales que Pages todavía no puede recibir. Si hay cambios sin registrar, detente y usa el checkpoint indicado por el docente; esta sesión no enseña commit o push.

`pnpm build` produce `dist`. `pnpm preview` sirve esa carpeta de forma local para inspección. Ninguno publica el sitio en Cloudflare.

No añadas `dist` al repositorio.

## Paso 2 · Inventaría la configuración sin mostrar values

Tu `.env.example` debe conservar la URL pública de la API y dejar vacíos los values específicos de Firebase:

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Estos values llegan al bundle del navegador durante el build. No coloques en variables `VITE_*`:

- contraseñas;
- Firebase ID tokens;
- tokens de Cloudflare;
- claves privadas;
- cuentas de servicio.

Consulta tus values desde el lugar privado definido en la sesión 12. No los dictes ni compartas la pantalla completa mientras estén visibles.

## Trabajo con agente · Paso 3 · Ejecuta el audit asistido

Antes de conectar el proveedor, entrega al agente este encargo sin ampliarlo:

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

Abre cada archivo citado por el informe. Confirma que el agente no cambió nada y revisa:

```bash
git diff --check
git status --short
```

El audit no demuestra Cloudflare, Firebase, CORS, API o navegador.

## Paso 4 · Conecta el repositorio

En el dashboard de Cloudflare:

1. entra a `Workers & Pages`;
2. selecciona la creación o configuración de una aplicación Pages desde un repositorio Git;
3. autoriza únicamente el repositorio del curso;
4. confirma la rama `main`;
5. comprueba que el proyecto seleccionado contiene el checkpoint actual.

No ejecutes C3. C3 crearía una aplicación nueva. Tampoco instales Wrangler.

## Paso 5 · Configura el build remoto

Registra:

```text
Build command: pnpm build
Build output directory: dist
NODE_VERSION: 22.22.0
PNPM_VERSION: 11.17.0
```

Después agrega los siete nombres `VITE_*` con tus values de producción.

Comprueba cada nombre. Un typo puede permitir que el build termine y producir una aplicación que falla al ejecutar.

Cambiar una variable `VITE_*` exige otro despliegue porque Vite la sustituye durante el build.

## Paso 6 · Lee el despliegue

Inicia el despliegue y localiza:

- rama y revisión;
- coincidencia entre la revisión publicada y el `HEAD` probado localmente;
- instalación con pnpm;
- ejecución de `pnpm build`;
- finalización del build;
- publicación de `dist`;
- URL y deployment id.

Si falla, conserva el primer error útil. Clasifícalo antes de cambiar algo:

| Capa | Ejemplos |
| --- | --- |
| Instalación | lockfile, pnpm o dependencia |
| Runtime | versión de Node o pnpm |
| Configuración | nombre de variable ausente |
| Build | TypeScript, Vite o import |
| Salida | directorio distinto de `dist` |

Cambia una sola configuración relacionada con el error y vuelve a desplegar. No elimines tests, types o dependencias para obtener verde.

## Paso 7 · Comprueba la URL externa

Usa una ventana privada o un navegador que no dependa de tu servidor local.

### Hosting y Router

- Abre la raíz `https://<proyecto>.pages.dev`.
- Abre `/search` directamente.
- Abre una URL real `/media/:mediaType/:externalId`.
- Recarga esa URL.

El caso base no añade `_redirects` o `404.html`. Sin un `404.html` superior, Cloudflare Pages aplica su comportamiento SPA y entrega la entrada para que React Router interprete la ruta.

### Guardia y Firebase

- Abre `/app/library` sin sesión.
- Confirma la redirección a Login.
- Inicia sesión.
- Comprueba que la biblioteca abre.

### API y CORS

En Network, selecciona un request hacia `VITE_API_URL` y registra:

- URL y método;
- status;
- resultado visible;
- si el navegador permitió leer el response.

No copies el header `Authorization` ni captures el token.

Si la SPA abre pero el navegador informa CORS, registra el origen exacto `https://<proyecto>.pages.dev` y entrégalo al docente. No cambies React, Firebase o el cliente HTTP para esconder el bloqueo.

## Paso 8 · Clasifica antes de corregir

| Síntoma | Revisa primero |
| --- | --- |
| Pages no instala | Node, pnpm, lockfile y primera línea útil del log |
| Local pasa y remoto falla | Diferencias de runtime o variables |
| Raíz responde 404 | Directorio de salida |
| Raíz abre y ruta recargada falla | Request del documento, `404.html` y proyecto correcto |
| Pantalla queda vacía | Console y carga de bundles |
| Firebase rechaza | Código de error y variables Firebase |
| API funciona local y falla publicada | `VITE_API_URL`, origin y CORS |
| API responde 401 | Sesión y autorización, no CORS |

No describas todo fallo de red como CORS. Network distingue un response HTTP de un response que el navegador no permite leer.

## Evidencia de entrega

Completa sin incluir credenciales:

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

Conserva esta ficha: es el punto de entrada de la sesión 19 para identificar tu producto y preparar su defensa técnica.

La evidencia queda completa cuando puedes explicar:

- qué revisión se publicó;
- qué comando produjo `dist`;
- qué versiones usó Pages;
- por qué `VITE_*` es público;
- cómo comprobaste una ruta anidada;
- qué demuestran Console, Network y el build log;
- qué dependencia externa sigue pendiente, si existe.

## Frontera de la evidencia

- Test y build local no prueban Cloudflare.
- Build remoto no prueba navegador.
- Raíz visible no prueba React Router, Firebase o API.
- Login no prueba la biblioteca privada.
- Un request API no prueba la regresión completa.
- Un informe del agente no prueba ningún servicio externo.

## Fuera de alcance

- C3, Wrangler, Pages Functions, Workers, KV o D1.
- Direct Upload como procedimiento base.
- Custom domains, DNS, analytics o reglas de caché.
- SSR, SSG o cambios de arquitectura.
- Modificaciones del backend.
- Reparación de features anteriores.
- Preparación de la presentación final.
