# Guía docente · Sesión 07 · HTTP, DTOs, agentes y primer test

> Material privado del docente. No distribuir la clave del cuestionario ni los checkpoints resueltos.

## Propósito docente

La interfaz mantiene el checkpoint 06: modal de Mantine y catálogo con HTML/CSS propios. Hoy no se migran controles ni tarjetas; la adopción más amplia acompaña la búsqueda remota de 08.

Conducir al grupo desde un explorador local hasta una frontera HTTP tipada. El estudiante debe comprender el primer fetcher, completar el segundo, revisar el trabajo mecánico delegado y distinguir las evidencias de build, Vitest y Network.

### Analogía pedagógica que debes usar

Presenta HTTP como un restaurante. El navegador es quien hace el pedido; el **request** es la comanda con plato y opciones; el servidor es la cocina; la **response** es lo que la cocina devuelve junto con un estado. El DTO se parece al formato fijo de la comanda: cocina y mesero deben entender los mismos campos. Una `Promise` se parece al número de turno: confirma que hay un resultado pendiente, pero todavía no contiene el plato.

Aclara el límite de la analogía: `fetch` intercambia datos, no objetos físicos, y un status de error también es una response válida de HTTP. Un corte de red es diferente: no llega una response utilizable.

## Preparación antes de clase

### Proyecto semilla

Abre `session-07-start`, que apunta al checkpoint final de la sesión 06. Confirma:

- Filtros, contador, limpieza, vacíos y modal local funcionan.
- `MediaGrid` conserva `items={visibleMedia}`.
- `MediaType` y `MediaItem` viven en `src/types/media-item.ts`.
- Mantine y PostCSS conservan las versiones del checkpoint 06.
- Node cumple `>=22.22.0`, el mínimo fijado para toda la cohorte.
- El proyecto usa pnpm `11.17.0`.
- `.env.local` contiene `VITE_API_URL=https://bootcamp-medialog.cardor.dev`.
- `.env.example` todavía no existe; se crea en `session-07-step-01-contracts`.
- `pnpm build` se ejecutó sobre el seed antes de añadir Vitest.

El seed omite:

- `src/types/media-api.ts`.
- `src/api/media.ts` y `src/api/http.ts`.
- El adapter y su test.
- Vitest y el script `test`.
- La configuración local de Agent Harness Kit; se materializa en vivo con `ahk init`.
- `ApiProbe`.
- TanStack Query, Router y autenticación.

El seed ejecutable vive en el repositorio hermano `MediaLog-Bootcamp`. `session-07-end` contiene contratos, fetchers, helper, test y harness materializado. La guía curricular explica la ruta; la evidencia ejecutada debe provenir del checkout usado en clase.

### Backend externo

La base canónica del backend de la cohorte es `https://bootcamp-medialog.cardor.dev`, sin slash final. Los fetchers añaden las rutas `/api/v2/...`; no agregues `/api` dentro de `VITE_API_URL`.

Prueba antes de la clase:

```text
POST /api/v2/media/search
GET  /api/v2/media/detail?externalId=...&mediaType=...
```

La rama docente debe permitir búsqueda anónima y devolver `isLogged: false` sin usuario. Verifica:

- Una búsqueda de película con resultados.
- Una búsqueda de serie con resultados.
- Una búsqueda sin resultados.
- Un status no exitoso controlado.
- CORS desde el origen del seed.

Los estudiantes no abren Swagger, no generan OpenAPI y no modifican el backend.

### Herramientas asistidas

Prepara:

- Una consulta de Context7 para Vitest 4 sobre `test`, `expect` y `vitest run`.
- La misma sección abierta en la documentación oficial como contingencia.
- La lista de skills que ya contiene el provider.
- Una ejecución conocida de `pnpm dlx autoskills@0.3.6 --dry-run`.
- Una copia resuelta donde `ahk init`, `ahk doctor` y `ahk health` ya funcionen con el provider institucional.
- Las skills `ahk-ask` y `ahk-test` materializadas en esa copia.
- Los cuatro prompts de esta guía en archivos de texto listos para copiar.

Context7 y AutoSkills no son dependencias del frontend. Si AutoSkills propone una skill, no la instales durante la demostración base. Revisa primero origen, alcance, archivos y `SKILL.md`. La clase solo instala una propuesta cuando falta una skill pertinente y el docente aprueba su procedencia.

### Capturas de contingencia

Conserva:

- POST de búsqueda con body JSON y response exitosa.
- GET de detalle con query string y response exitosa.
- `pnpm exec vitest run ...` con exit status 0 en una copia resuelta.
- `pnpm build` con exit status 0.
- `ahk doctor` reconociendo configuración y skills.
- `ahk health` ejecutando `pnpm test` y `pnpm build` en la copia resuelta.

Una captura preparada permite explicar la interfaz de la herramienta. No cuenta como evidencia ejecutada por el estudiante.

## Resultado observable

Al cerrar, cada estudiante debe poder señalar:

- el contrato de búsqueda y detalle;
- la única definición de `MediaType`;
- la responsabilidad de cada fetcher y del helper común;
- la diferencia entre error HTTP y error de red;
- el adapter puro y los dos comportamientos probados;
- la diferencia entre instalar el CLI global e inicializar el harness dentro del proyecto;
- una decisión humana previa a cada delegación;
- un límite de Context7, AutoSkills, harness, Vitest, build y Network.

## Agenda detallada

| Minutos | Duración | Acción docente | Acción estudiantil | Comprobación |
| --- | ---: | --- | --- | --- |
| 0–18 | 18 min | Presentar las diapositivas completas y sin abrir el editor: límite del fixture, HTTP, Promise, DTO, adapter, agente y evidencia. | Responder las preguntas conceptuales desde la presentación. | Distinguen request/response, DTO/modelo visual y herramienta/evidencia. |
| 18–30 | 12 min | Instalar e inicializar AHK; mostrar archivos, health, Context7, skills y AutoSkills. | Verificar CLI, materializar el harness y ejecutar una exploración de solo lectura. | Distinguen CLI global de harness local y ninguna herramienta se presenta como garantía. |
| 30–40 | 10 min | Cerrar la tabla y crear types y adapter. | Auditar imports, nombres, nulabilidad y build. | `MediaType` proviene de `media-item.ts`; solo cambian dos archivos. |
| 40–51 | 11 min | Implementar `searchMedia()` y verbalizar cada línea. | Predecir request, retorno y rama de error. | El POST conserva body JSON y Promise tipada. |
| 51–59 | 8 min | Consolidar `src/api/media.ts` completo con `getMediaDetail()`. | Completar parámetros, GET y retorno dentro del archivo visible. | Los dos fetchers compilan antes de abstraer. |
| 59–65 | 6 min | Marcar repetición y ejecutar el prompt de refactor. | Seguir ambos recorridos hasta `requestJson<T>()`. | Método y contrato permanecen en los fetchers. |
| 65–76 | 11 min | Instalar Vitest, cerrar la matriz e invocar `ahk-test`. | Leer casos, identificar AAA y ejecutar Vitest. | Dos casos pasan; no se modifica producción. |
| 76–85 | 9 min | Conectar `ApiProbe` temporal y abrir Network. | Ejecutar búsqueda y detalle; retirar el probe. | Se observan ambos requests y no queda integración temporal. |
| 85–90 | 5 min | Ejecutar `ahk health`, recoger exit ticket y abrir la sesión 08. | Registrar resultados y explicar límites. | Test y build terminan; la responsabilidad de Query queda pendiente. |

**Total:** 90 minutos.

## Desarrollo de la clase

### S07-B01 · 0–18 min · Presentación continua

Proyecta todas las diapositivas antes de abrir el editor. La recuperación del checkpoint y la frontera HTTP que siguen son notas orales de ese mismo recorrido. No ejecutes comandos ni escribas código durante estas diapositivas.

**Apoyo visual opcional:** al terminar las diapositivas y antes del coding, muestra la [Animación 01 · Peticiones HTTPS](01-animacion-peticiones-https/README.md). Sustituye parte de la explicación oral dentro de estos 18 minutos. Avanza con las flechas; pausa en el hito 08 y pulsa el contador para mostrar que otro evento puede atenderse mientras la petición espera. Pregunta qué función quedó suspendida. Después distingue recibir una Response y leer su body. El README incluye los pasos, preguntas y rutas de error. Es una simulación: no ejecuta el componente React ni consulta la API real. La integración remota del proyecto comienza en la sesión 08.

#### Recuperar el límite del fixture

Solicita tres acciones:

1. Buscar `bear` y comprobar el filtro local.
2. Abrir el detalle local de una serie.
3. Buscar `Dune`, que no pertenece al fixture preparado.

Pregunta: “¿Qué archivo tendríamos que editar para que aparezca Dune?”. La respuesta debe nombrar el fixture. Después pregunta: “¿Qué cambia si los datos viven en otro sistema?”.

Recupera la pregunta previa con mayor error. No dediques este bloque a reconstruir selección o Mantine.

#### Enseñar la frontera HTTP

Dibuja:

```text
navegador
  └── request: método + URL + headers + body
          ↓
        servidor
          ↓
  ┌── response: status + headers + body
navegador
```

Presenta los endpoints lado a lado:

```text
POST /api/v2/media/search
body: { query, mediaType }

GET /api/v2/media/detail?externalId=...&mediaType=...
body: ninguno
```

Pide que el grupo ubique cada dato. Corrige estas confusiones:

- La API es el contrato; el servidor lo implementa.
- El endpoint incluye método y ruta.
- `await` pausa la continuación de esa función, no toda la página.
- `fetch()` puede resolver con una response `404`.
- `response.ok` representa status entre 200 y 299.
- `response.json()` también devuelve una Promise.
- TypeScript no valida el JSON recibido.

Muestra las tres formas de Media. Pregunta qué pasaría con `as MediaItem`. La respuesta esperada: el cast ocultaría diferencias de identidad, nombres y campos ausentes.

### S07-B02 · 18–30 min · Instalar, materializar y presentar Agent Harness Kit

#### Paso 1 · Instalar el CLI global y comprobar el entorno

Explica dos alcances distintos antes de ejecutar comandos:

```text
instalación global de npm
  └── expone el comando ahk en la terminal

ahk init dentro de Medialog
  └── crea configuración, instrucciones, skills y estado local del harness
```

El proyecto conserva pnpm. `npm` aparece solo en esta instalación global y no crea `package-lock.json`:

```bash
node --version
npm --version
npm install --global @cardor/agent-harness-kit@2.11.0
command -v ahk
ahk --version
```

El resultado esperado de la última línea es `2.11.0`. En PowerShell reemplaza `command -v ahk` por `Get-Command ahk`. Si no se encuentra el binario, no uses `sudo`: ejecuta `npm prefix -g`, confirma qué instalación de Node está activa, vuelve a abrir la terminal si cambió PATH y repite las dos comprobaciones.

#### Paso 2 · Inicializar el harness dentro del proyecto

Desde la raíz del seed ejecuta:

```bash
ahk init
```

Proyecta las respuestas antes de comenzar el asistente:

| Pregunta | Respuesta de la clase |
| --- | --- |
| Project name | `medialog-bootcamp` |
| Short description | `React frontend for exploring movies and series` |
| AI provider | Provider institucional anunciado por el docente |
| Modelos del provider | Configuración institucional preparada por el docente |
| Docs folder path | `docs` |
| Storage scope | `Local` |
| Add your first task now? | `No` |

No crear la primera tarea mantiene esta introducción dentro del recorrido ligero. El backlog, dashboard, base de datos y flujo completo de roles se reservan para una práctica posterior si el curso los necesita.

Abre en pantalla:

- `agent-harness-kit.config.json`, generado cuando el CLI está instalado solo de forma global;
- `health.sh`;
- el archivo principal de instrucciones del provider;
- la carpeta de agentes del provider;
- las carpetas `ahk-ask` y `ahk-test` dentro de las skills materializadas.

Explica el motivo de cada pieza: la configuración da contexto; las instrucciones y roles acotan responsabilidades; las skills conservan rutinas; `health.sh` convierte checks conocidos en una puerta verificable. El harness reduce libertad mediante reglas explícitas y evidencia, pero no vuelve correcto un resultado por sí solo.

El `health.sh` recién creado es un placeholder. Sustitúyelo por este primer check mientras Vitest todavía no existe:

```bash
#!/usr/bin/env bash
set -euo pipefail

pnpm build
```

Después ejecuta:

```bash
ahk doctor
ahk health
```

`ahk doctor` comprueba configuración y materialización. `ahk health` ejecuta únicamente el build declarado en este momento.

#### Paso 3 · Consultar documentación

Formula una necesidad precisa:

```text
Librería: Vitest
Versión: 4.1.11
Concepto: escribir dos tests en entorno Node y ejecutar una suite finita
```

En Context7:

1. Resuelve el identificador de Vitest con la necesidad anterior.
2. Elige la fuente oficial o de mayor reputación que corresponda a Vitest.
3. Consulta un solo concepto: `test` o `it`, `expect` y ejecución con `vitest run`.
4. Lee el fragmento recuperado antes de pedir código.

Si Context7 no responde, abre `https://vitest.dev/guide/` y registra el fallback. No digas que se usó Context7 cuando no ocurrió.

#### Paso 4 · Revisar skills

Abre la lista materializada por el provider. Identifica `ahk-ask` y `ahk-test`; lee el `SKILL.md` de la primera antes de usarla. Pregunta:

- ¿Qué tarea permite?
- ¿Qué escritura prohíbe?
- ¿Qué resultado devuelve?

#### Paso 5 · AutoSkills solo si falta una skill

Muestra:

```bash
pnpm dlx autoskills@0.3.6 --dry-run
```

Lee las propuestas. Explica que el modo base no instala nada porque `ahk-ask` ya cubre la exploración. Si en otro caso faltara una skill pertinente, el grupo revisaría procedencia, archivos, `SKILL.md` y `skills-lock.json` antes de aprobarla.

#### Interacción 1 · Prompt de exploración

```text
Usa la skill ahk-ask para responder esta pregunta de solo lectura:

En este proyecto React con TypeScript, localiza dónde se definen y exportan MediaType y MediaItem, cómo se organizan los types y adapters existentes y qué imports relativos debería usar un nuevo archivo src/types/media-api.ts.

No crees tareas, no modifiques archivos y no propongas todavía la implementación. Devuelve únicamente:
1. archivos relevantes;
2. convenciones encontradas;
3. riesgos de duplicar MediaType o cambiar sus values;
4. evidencia textual de que el archivo canónico es src/types/media-item.ts.

Si encuentras más de una definición de MediaType o una ruta distinta, detente y reporta la contradicción.
```

Abre cada archivo citado. La actividad termina cuando una persona confirma la ruta y la unión `"movie" | "series"`.

### S07-B03 · 30–40 min · Configurar la API, cerrar el contrato y delegar el adapter

#### Paso 1 · Crear la configuración pública de la API

Crea `.env.example` en la raíz del proyecto. Este archivo sí se versiona y deja visible cuál es la configuración que necesita la aplicación:

**`.env.example` · archivo completo:**

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
```

Crea también `.env.local` en la raíz con el mismo contenido para ejecutar la demostración. `.env.local` ya está ignorado por Git y no se añade al commit:

**`.env.local` · archivo local completo:**

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
```

Explica cada parte antes de continuar:

1. `VITE_` permite que Vite exponga la variable al código del navegador.
2. `API_URL` describe que el value es la base de la API.
3. La base no termina en slash y no contiene `/api`; cada fetcher añadirá la ruta de su endpoint.
4. Esta URL es pública. Tokens, contraseñas, claves privadas y cuentas de servicio no se colocan aquí.

Ejecuta `pnpm build`. En este punto la variable todavía no tiene consumidor; el build solo comprueba que la configuración nueva no rompió el proyecto.

#### Paso 2 · Cerrar el contrato antes de delegar

Entrega la hoja reducida. El grupo debe aprobar cada fila antes del prompt. No permitas que el agente elija campos o nulabilidad.

#### Paso 3 · Interacción 2 · Prompt de types y adapter

```text
Trabaja en este proyecto React con TypeScript y pnpm.

Punto de entrada verificable:
- MediaType ya existe en src/types/media-item.ts y solo admite "movie" | "series".
- El grupo revisó POST /api/v2/media/search y GET /api/v2/media/detail.

Objetivo único:
Crear los types manuales reducidos de esos endpoints y el adapter puro que convierte GetMediaDetailInput a URLSearchParams.

Fuente del contrato:
- SearchMediaInput: query string y mediaType MediaType.
- MediaSearchItemDto: externalId string, title string, releaseYear number, coverUrl string | null, mediaType MediaType, isLogged boolean.
- GetMediaDetailInput: externalId string y mediaType MediaType.
- MediaCatalogDetailDto: externalId number, mediaType MediaType, title string, description string | null, coverUrl string | null, releaseYear number | null, releaseMonth number | null, releaseDay number | null, durationMinutes number | null, episodesCount number | null, seasonsCount number | null, genres string[], reviewScore number | null.
- MEDIA_STATUS_VALUES: pending, acquired, watching, seen, dropped y paused, con type derivado MediaStatus.
- MEDIA_PRIORITY_VALUES: low, medium y high, con type derivado MediaPriority.
- UserMediaDataDto: id string, title string, status MediaStatus, priority MediaPriority, notes string | null.
- MediaDetailDto: catalog MediaCatalogDetailDto | null, entry UserMediaDataDto | null, isLogged boolean.
- toMediaDetailSearchParams(input): conserva externalId y mediaType dentro de URLSearchParams.

Archivos permitidos:
- crear src/types/media-api.ts;
- crear src/adapters/media-input-to-params.ts.

Cambios prohibidos:
- no declares MediaType otra vez;
- no uses api.d.ts, OpenAPI generado, any, unknown ni casts a MediaItem;
- no crees fetchers, componentes, hooks, estado ni dependencias;
- no añadas campos fuera del contrato;
- no modifiques otros archivos.

Criterios observables:
- media-api.ts importa MediaType desde ./media-item;
- los campos conservan nombres, tipos y nulabilidad;
- el adapter no ejecuta fetch ni cambia estado;
- solo cambian los dos archivos permitidos.

Comprobación:
- ejecuta pnpm build;
- si el contrato contradice un type existente, detente antes de editar y explica la diferencia.

Al terminar, devuelve:
1. archivos cambiados;
2. mapa de imports;
3. diferencia entre DTO y modelo visual;
4. supuestos realizados;
5. comando, resultado y exit status del build;
6. qué no demuestra ese build.
```

#### Paso 4 · Revisar `src/types/media-api.ts` completo

```ts
import type { MediaType } from './media-item'

export type SearchMediaInput = {
  query: string
  mediaType: MediaType
}

export type MediaSearchItemDto = {
  externalId: string
  title: string
  releaseYear: number
  coverUrl: string | null
  mediaType: MediaType
  isLogged: boolean
}

export type GetMediaDetailInput = {
  externalId: string
  mediaType: MediaType
}

export type MediaCatalogDetailDto = {
  externalId: number
  mediaType: MediaType
  title: string
  description: string | null
  coverUrl: string | null
  releaseYear: number | null
  releaseMonth: number | null
  releaseDay: number | null
  durationMinutes: number | null
  episodesCount: number | null
  seasonsCount: number | null
  genres: string[]
  reviewScore: number | null
}

export const MEDIA_STATUS_VALUES = [
  'pending',
  'acquired',
  'watching',
  'seen',
  'dropped',
  'paused',
] as const

export type MediaStatus = (typeof MEDIA_STATUS_VALUES)[number]

export const MEDIA_PRIORITY_VALUES = ['low', 'medium', 'high'] as const

export type MediaPriority = (typeof MEDIA_PRIORITY_VALUES)[number]

export type UserMediaDataDto = {
  id: string
  title: string
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}

export type MediaDetailDto = {
  catalog: MediaCatalogDetailDto | null
  entry: UserMediaDataDto | null
  isLogged: boolean
}
```

Audita cinco puntos en pantalla:

1. Import único de `MediaType`.
2. `externalId` conserva formas distintas en búsqueda y catálogo de detalle.
3. `catalog` y `entry` siguen nullable.
4. Los values cerrados producen sus unions.
5. No aparece `MediaItem` dentro de un DTO.

#### Paso 5 · Revisar `src/adapters/media-input-to-params.ts` completo

El segundo archivo creado por el agente debe quedar exactamente así:

```ts
import type { GetMediaDetailInput } from '../types/media-api'

export function toMediaDetailSearchParams(
  input: GetMediaDetailInput,
): URLSearchParams {
  return new URLSearchParams({
    externalId: input.externalId,
    mediaType: input.mediaType,
  })
}
```

Explica cada grupo:

1. El import es `type` porque desaparece del JavaScript generado.
2. La función recibe la identidad mínima del detalle.
3. `URLSearchParams` representa pares aptos para una query string.
4. Las propiedades no se renombran: `externalId` y `mediaType` conservan el contrato.
5. La función no conoce el dominio, el método HTTP ni `fetch`; solo transforma datos.

Ejecuta `pnpm build` y revisa `git diff -- src/types/media-api.ts src/adapters/media-input-to-params.ts`. El checkpoint de `session-07-step-01-contracts` requiere esos dos archivos, `.env.example` y ningún fetcher todavía.

### S07-B04 · 40–51 min · Construir el primer fetcher completo

#### Paso 1 · Crear `src/api/media.ts`

Crea `src/api/media.ts`. Escribe una parte y detente para que el grupo prediga la siguiente. Al terminar este bloque, el archivo completo debe ser:

```ts
import type {
  MediaSearchItemDto,
  SearchMediaInput,
} from "../types/media-api"

const API_URL = import.meta.env.VITE_API_URL

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  const response = await fetch(`${API_URL}/api/v2/media/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`La API respondió con status ${response.status}`)
  }

  return (await response.json()) as MediaSearchItemDto[]
}
```

#### Paso 2 · Explicar cada grupo de líneas

1. Los imports traen únicamente los contratos de búsqueda.
2. `API_URL` lee la base definida en `.env.local` mediante `import.meta.env`.
3. `async` hace que la función siempre devuelva una Promise.
4. La firma promete un arreglo de DTOs de búsqueda cuando la operación termina correctamente.
5. `fetch` combina la base y la ruta exacta del endpoint.
6. `method`, `headers` y `body` describen el request POST.
7. `JSON.stringify(input)` convierte el objeto TypeScript en texto JSON para el body.
8. `response.ok` separa los status 2xx de los demás status HTTP.
9. `response.json()` lee el body asíncronamente.
10. El cast expresa lo que el frontend espera, pero no valida el JSON en runtime.

Preguntas de predicción:

- ¿Por qué el body necesita `JSON.stringify`?
- ¿Por qué la firma devuelve `Promise<MediaSearchItemDto[]>`?
- ¿Qué sucede con una response 404?
- ¿Qué confía el cast final?

#### Paso 3 · Comprobar y detenerse

Ejecuta `pnpm build`. El archivo compila, pero todavía no se llama desde React y el build no demuestra que el servidor responda. No extraigas todavía `requestJson<T>()`: necesitamos ver dos fetchers concretos antes de reconocer la repetición.

**Punto para retomar:** `src/api/media.ts` contiene solamente `searchMedia()`. El siguiente bloque añade `getMediaDetail()` en el mismo archivo.

### S07-B05 · 51–59 min · Completar el segundo fetcher

#### Paso 1 · Sustituir `src/api/media.ts` por el estado con dos fetchers

Conserva `searchMedia()` y añade los imports y la función de detalle. No pegues solamente el cuerpo de la función: al terminar, `src/api/media.ts` completo debe quedar así:

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  GetMediaDetailInput,
  MediaDetailDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'

const API_URL = import.meta.env.VITE_API_URL

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  const response = await fetch(`${API_URL}/api/v2/media/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`La API respondió con status ${response.status}`)
  }

  return (await response.json()) as MediaSearchItemDto[]
}

export async function getMediaDetail(
  input: GetMediaDetailInput,
): Promise<MediaDetailDto> {
  const params = toMediaDetailSearchParams(input)
  const response = await fetch(
    `${API_URL}/api/v2/media/detail?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error(`La API respondió con status ${response.status}`)
  }

  return (await response.json()) as MediaDetailDto
}
```

#### Paso 2 · Explicar la diferencia con el primer request

1. El adapter construye `externalId=...&mediaType=...` sin conocer la URL base.
2. `getMediaDetail()` añade esa query string a la ruta del detalle.
3. No se declara `method` porque `fetch` usa GET por defecto.
4. No existe body en este request.
5. El chequeo de `response.ok` y la lectura del JSON repiten la misma mecánica de búsqueda.

Pregunta: “¿Qué partes cambian porque los endpoints son distintos y qué partes se repiten sin aportar significado nuevo?”. Espera que nombren método, ruta, headers, body y params como decisiones del endpoint; `fetch`, `ok`, `status` y `json` como repetición.

#### Paso 3 · Comprobar antes de abstraer

Ejecuta `pnpm build`. Si falla, resuelve imports o tipos en este estado concreto. No extraigas el helper sobre código que todavía no compila.

**Checkpoint `session-07-step-02-fetchers`:** ambos fetchers existen explícitamente y todavía contienen la repetición visible.

### S07-B06 · 59–65 min · Extraer `requestJson<T>()`

#### Paso 1 · Marcar la repetición antes del prompt

Pide que los estudiantes marquen exactamente:

- `fetch(url, init)`.
- `response.ok`.
- `response.status`.
- `response.json()`.

No aceptes método, ruta, body o parámetros como responsabilidad del helper.

#### Paso 2 · Interacción 3 · Prompt de refactor

```text
Lee src/api/media.ts completo antes de editar.

Punto de entrada verificable:
- searchMedia y getMediaDetail ya existen y pasan pnpm build.
- ambos repiten fetch, response.ok, response.status y response.json().

Objetivo único:
Extraer esa mecánica repetida a requestJson<T> dentro de src/api/http.ts.

Fuente del comportamiento:
- un response no exitoso lanza Error con el mismo mensaje y status;
- un response exitoso devuelve el JSON con el tipo genérico solicitado.

Archivos permitidos:
- crear src/api/http.ts;
- modificar src/api/media.ts.

Cambios prohibidos:
- no cambies types, componentes, hooks, variables de entorno ni mensajes;
- no añadas HttpError, retry, timeout, AbortSignal o validación Zod;
- no edites otros archivos.

Criterios observables:
- searchMedia conserva ruta POST, Content-Type y body JSON;
- getMediaDetail conserva toMediaDetailSearchParams;
- ambos conservan inputs y Promise de retorno;
- requestJson<T> contiene solo la mecánica común.

Comprobación:
- ejecuta pnpm build;
- si falta un fetcher o no existe la repetición descrita, detente sin editar.

Al terminar, devuelve:
1. diff conceptual antes y después;
2. responsabilidad de cada fetcher;
3. responsabilidad de requestJson<T>;
4. comando, resultado y exit status del build;
5. límites de la verificación.
```

#### Paso 3 · Revisar `src/api/http.ts` completo

El archivo nuevo debe quedar así:

```ts
const API_URL = import.meta.env.VITE_API_URL

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(`La API respondió con status ${response.status}`)
  }

  return (await response.json()) as T
}
```

Explica cada grupo:

1. La base vive en un solo archivo después del refactor.
2. `path` conserva la ruta elegida por cada fetcher.
3. `init` es opcional porque GET no necesita configuración adicional.
4. `RequestInit` es el type del navegador para método, headers, body y otras opciones de `fetch`.
5. `<T>` permite que el llamador indique el tipo de retorno esperado.
6. El helper maneja mecánica HTTP compartida; no decide endpoints ni valida el body recibido.

#### Paso 4 · Revisar `src/api/media.ts` completo después del refactor

El consumidor debe quedar así, sin la línea `API_URL` ni llamadas directas a `fetch`:

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  GetMediaDetailInput,
  MediaDetailDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'
import { requestJson } from './http'

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  return requestJson<MediaSearchItemDto[]>('/api/v2/media/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

export async function getMediaDetail(
  input: GetMediaDetailInput,
): Promise<MediaDetailDto> {
  const params = toMediaDetailSearchParams(input)
  return requestJson<MediaDetailDto>(
    `/api/v2/media/detail?${params.toString()}`,
  )
}
```

Sigue ambos recorridos en el editor. Pregunta qué representa `T`. Respuesta esperada: el tipo que el llamador espera recibir; no valida el JSON.

#### Paso 5 · Comprobar responsabilidades

Ejecuta `pnpm build` y busca `fetch(` dentro de `src/api/`. Debe aparecer en `http.ts`, no en `media.ts`. Comprueba además que `media.ts` todavía contiene POST, header, body y query params.

**Checkpoint `session-07-step-03-request-json`:** el helper concentra la mecánica común y los fetchers conservan las decisiones de cada endpoint.

### S07-B07 · 65–76 min · Instalar Vitest y generar el primer test

#### Paso 1 · Instalar la versión fijada y crear el script

Instala la versión fijada y añade el script:

```bash
pnpm add -D vitest@4.1.11
pnpm pkg set scripts.test="vitest run"
```

Abre `package.json` y confirma ambos cambios antes de pedir el test. Esta instalación ocurre una vez; el prompt posterior no puede modificar dependencias ni configuración. Después de los comandos, el archivo completo debe ser:

```json
{
  "name": "medialog-bootcamp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "packageManager": "pnpm@11.17.0",
  "engines": {
    "node": ">=22.22.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "test": "vitest run",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mantine/core": "9.4.1",
    "@mantine/hooks": "9.4.1",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "postcss": "8.5.26",
    "postcss-preset-mantine": "1.18.0",
    "postcss-simple-vars": "7.0.1",
    "typescript": "6.0.3",
    "vite": "8.2.2",
    "vitest": "4.1.11"
  }
}
```

`pnpm-lock.yaml` cambia como resultado de la instalación. No lo escribas ni lo copies desde la guía.

#### Paso 2 · Cerrar la matriz humana

Escribe la matriz antes del prompt:

| Caso | Entrada | Expectativas |
| --- | --- | --- |
| Película | `438631`, `movie` | `externalId` y `mediaType` se conservan |
| Serie | `1399`, `series` | `externalId` y `mediaType` se conservan |

Abre la skill materializada y destaca tres límites: solo escribe tests, no modifica producción y no crea tareas del harness. La matriz humana continúa siendo el oráculo.

#### Paso 3 · Interacción 4 · Invocar `ahk-test`

```text
Usa la skill ahk-test para crear y ejecutar tests de comportamiento de toMediaDetailSearchParams.

Matriz acordada por el grupo:
1. { externalId: "438631", mediaType: "movie" } conserva ambos parámetros.
2. { externalId: "1399", mediaType: "series" } conserva ambos parámetros.

Alcance único:
- crear src/adapters/__tests__/media-input-to-params.test.ts;
- producción, package.json, configuración y dependencias permanecen en solo lectura;
- no usar snapshots, mocks, .only, .skip o .todo.

Ejecuta pnpm exec vitest run src/adapters/__tests__/media-input-to-params.test.ts. Si la firma, la matriz o la configuración contradicen el repositorio, detente antes de escribir. Entrega la matriz implementada, archivos cambiados, comando con exit status y frontera de evidencia.
```

#### Paso 4 · Revisar el test completo

```ts
import { describe, expect, it } from 'vitest'

import { toMediaDetailSearchParams } from '../media-input-to-params'

describe('toMediaDetailSearchParams', () => {
  it('conserva la identidad de una película', () => {
    const params = toMediaDetailSearchParams({
      externalId: '438631',
      mediaType: 'movie',
    })

    expect(params.toString()).toBe('externalId=438631&mediaType=movie')
  })

  it('conserva la identidad de una serie', () => {
    const params = toMediaDetailSearchParams({
      externalId: '1399',
      mediaType: 'series',
    })

    expect(params.toString()).toBe('externalId=1399&mediaType=series')
  })
})
```

Pide que una persona identifique preparación, acción y expectativas sin agregar comentarios AAA. El test usa `URLSearchParams` disponible en el entorno Node admitido y no necesita DOM.

#### Paso 5 · Actualizar `health.sh` completo

Ahora actualiza `health.sh` porque el proyecto ya tiene Vitest y un script `test`:

```bash
#!/usr/bin/env bash
set -euo pipefail

pnpm test
pnpm build
```

Ejecuta primero el test enfocado y reserva `ahk health` para el cierre. El check del harness no reemplaza la evidencia específica del archivo recién creado.

**Checkpoint `session-07-step-04-first-test`:** el test enfocado termina con exit status 0, el script `test` existe y el build sigue pasando.

### S07-B08 · 76–85 min · Montar, ejecutar y retirar `ApiProbe`

El probe existe únicamente para provocar los dos requests y observarlos en Network. No forma parte de la interfaz final. En este bloque se crea, se monta mediante JSX, se ejecuta con un click y se elimina.

#### Paso 1 · Crear `src/components/api-probe.tsx` completo

Crea el archivo:

```tsx
import { getMediaDetail, searchMedia } from '../api/media'

export function ApiProbe() {
  async function handleProbe() {
    try {
      const results = await searchMedia({
        query: 'Dune',
        mediaType: 'movie',
      })
      const firstResult = results[0]

      if (firstResult === undefined) {
        return
      }

      await getMediaDetail({
        externalId: firstResult.externalId,
        mediaType: firstResult.mediaType,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button type="button" onClick={handleProbe}>
      Probar búsqueda y detalle
    </button>
  )
}
```

Explica exactamente dónde se llama `handleProbe`: React recibe la función en `onClick={handleProbe}`. No se escriben paréntesis porque no queremos ejecutarla durante el render; React la invoca cuando la persona pulsa el botón.

Recorre el handler en orden:

1. `searchMedia()` ejecuta el POST de Dune.
2. `await` conserva el arreglo devuelto en `results`.
3. `results[0]` selecciona el primer resultado remoto.
4. Si no existe un primer resultado, `return` termina el handler y no inventa una identidad para detalle.
5. Si existe, `getMediaDetail()` usa su `externalId` y `mediaType` para ejecutar el GET.
6. El `catch` deja visible un fallo temporal en Console; se elimina junto con todo el componente.

No uses `useState` ni `useEffect`: no estamos integrando datos remotos en la pantalla, solo disparando una observación controlada.

#### Paso 2 · Montar temporalmente el componente en `src/main.tsx`

Sustituye `src/main.tsx` completo por este estado temporal:

```tsx
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { ApiProbe } from './components/api-probe'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ApiProbe />
      <App />
    </MantineProvider>
  </StrictMode>,
)
```

El import hace disponible el componente. `<ApiProbe />` es su consumidor visible y coloca el botón antes de `App`. No cambies `App.tsx`: el explorador local permanece debajo del probe.

Ejecuta `pnpm build` antes de abrir el navegador. El build demuestra que el componente, el import y el JSX están conectados; todavía no demuestra que los requests funcionen.

#### Paso 3 · Ejecutar el probe una sola vez

1. Ejecuta `pnpm dev` y abre la URL local de Vite.
2. Abre DevTools y selecciona **Network**.
3. Activa **Preserve log** solo si necesitas conservar la lista durante la explicación.
4. Limpia Network para comenzar con una tabla vacía.
5. Pulsa **Probar búsqueda y detalle** una sola vez.
6. No vuelvas a pulsar mientras el primer recorrido siga pendiente.

Registra lo observado:

| Request | Método | URL | Payload | Status | Response |
| --- | --- | --- | --- | --- | --- |
| Búsqueda | POST | `/api/v2/media/search` | `query`, `mediaType` | observado | arreglo observado |
| Detalle | GET | `/api/v2/media/detail?...` | ninguno | observado | raíz observada |

Si la búsqueda devuelve un arreglo vacío, solo aparecerá el POST. Explica que el retorno temprano protegió el segundo request y usa la captura de contingencia para mostrar el GET. No reemplaces el resultado remoto con un ID escrito a mano.

#### Apoyo opcional · Mostrar la respuesta del backend sin cambiar archivos

Usa estos accesos como apoyo dentro de S07-B08 (76–85 min), después del recorrido de slides. Sustituyen parte de la explicación del request; no añaden otro bloque ni exigen que el grupo instale un cliente HTTP. Puedes verificarlos por tu cuenta antes de la clase.

**Detalle: enlaces que sí puedes abrir en una pestaña.** El navegador realiza un GET:

- [Dune (2021) · película](https://bootcamp-medialog.cardor.dev/api/v2/media/detail?externalId=438631&mediaType=movie).
- [Breaking Bad · serie](https://bootcamp-medialog.cardor.dev/api/v2/media/detail?externalId=1396&mediaType=series).

Abre uno y localiza `catalog.title`, `catalog.mediaType`, `entry` e `isLogged`. En la comprobación anónima del 3 de octubre de 2026 ambos enlaces respondieron HTTP 200; `entry` fue `null` e `isLogged` fue `false`. Son respuestas observadas en esa fecha, no un fixture garantizado.

**Búsqueda: usa `/api/v2/media/search` con POST y body JSON.** No basta con abrirla en una pestaña: eso envía GET. La búsqueda GET con query string devolvió 404 en la comprobación, porque no es la ruta definida para este caso.

En Terminal de macOS/Linux ejecuta:

```sh
curl -i -X POST 'https://bootcamp-medialog.cardor.dev/api/v2/media/search' \
  -H 'Content-Type: application/json' \
  --data '{"query":"Dune","mediaType":"movie"}'
```

Para buscar series, conserva endpoint, método y header; cambia el body. Ejemplo completo:

```sh
curl -i -X POST 'https://bootcamp-medialog.cardor.dev/api/v2/media/search' \
  -H 'Content-Type: application/json' \
  --data '{"query":"Breaking Bad","mediaType":"series"}'
```

Si usas Postman u otro cliente HTTP, copia la URL, selecciona **POST**, añade `Content-Type: application/json` y pega el JSON en el body. No hace falta iniciar sesión para estos ejemplos públicos.

`-i` muestra el status y los headers antes del JSON; `-X POST` elige el método; `-H` declara el formato del body; `--data` envía los parámetros. La terminal devuelve el JSON como texto: no agrega tarjetas ni estado a React.

Busca un resultado y señala `externalId`, `title`, `releaseYear`, `coverUrl` y `mediaType`. La búsqueda devuelve un **arreglo**; el detalle devuelve un **objeto** con `catalog`, `entry` e `isLogged`. La API puede incluir campos adicionales que no necesitamos modelar todavía.

Los IDs de los enlaces son accesos rápidos de inspección. En el `ApiProbe`, sigue usando `externalId` y `mediaType` del resultado real de búsqueda. La terminal demuestra una respuesta HTTP; para comprobar el request desde la app y CORS conserva el recorrido de Network de este paso.

**Conduce la lectura de la respuesta:**

1. Abre el detalle de Dune y pregunta: “¿El JSON ya es una tarjeta de React?”. Respuesta: no; es un dato que el navegador está mostrando como texto.
2. Ejecuta la búsqueda POST y pregunta: “¿Qué enviamos y qué recibimos?”. Respuesta: enviamos texto y tipo; recibimos un arreglo de resultados.
3. Señala un `externalId` del arreglo y explica que, junto a `mediaType`, permite solicitar el detalle. Los enlaces fijos solo ahorran tiempo en esta inspección.
4. Contrasta `coverUrl` y `releaseYear` con los nombres del modelo local. El DTO conserva la forma recibida; un type de TypeScript no renombra el JSON.
5. Recupera la comprobación de Network del probe. Un curl exitoso no acredita CORS ni la ejecución del fetcher en el navegador. Retira el probe como indica el siguiente paso.

#### Paso 4 · Retirar el probe y restaurar `src/main.tsx`

Elimina por completo `src/components/api-probe.tsx`. Después sustituye `src/main.tsx` por su estado final:

```tsx
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
)
```

Comprueba los cuatro retiros de forma explícita:

1. El archivo `src/components/api-probe.tsx` ya no existe.
2. `src/main.tsx` ya no importa `ApiProbe`.
3. El JSX ya no contiene `<ApiProbe />`.
4. La búsqueda `rg -n "ApiProbe|handleProbe|console\.error" src` no devuelve restos del probe.

Ejecuta `pnpm build`, recarga el navegador y prueba una búsqueda local y el modal de detalle del checkpoint 06. El botón temporal ya no debe aparecer.

**Checkpoint final del bloque:** Network aportó evidencia de la ejecución temporal, pero `session-07-end` conserva únicamente contratos, fetchers, helper, test y harness. No conserva el probe.

### S07-B09 · 85–90 min · Evidencia y cierre

Ejecuta:

```bash
pnpm exec vitest run src/adapters/__tests__/media-input-to-params.test.ts
ahk health
```

Completa en pantalla:

| Evidencia | Demuestra | No demuestra |
| --- | --- | --- |
| Lectura del diff | Alcance y forma del cambio | Comportamiento ejecutado |
| Vitest | Dos comportamientos del adapter | Fetch, React o backend |
| `ahk health` | El script `test` y el build definidos en `health.sh` | Response real o UX |
| Network | Requests observados en esa ejecución | Caché, autenticación o disponibilidad futura |
| `ahk doctor` | Configuración y skills materializadas | Calidad del código |

Exit ticket:

1. Una decisión que tomó el grupo.
2. Un cambio que redactó el agente.
3. Un archivo que leyó el estudiante.
4. Un límite de la evidencia ejecutada.

Conecta con la sesión 08: los fetchers ya obtienen datos, pero la pantalla todavía no representa no enviado, carga, error, vacío, éxito ni caché.

## Errores frecuentes e intervención

| Síntoma | Causa probable | Intervención |
| --- | --- | --- |
| Se importa `MediaType` desde `media.ts` | Se copió la fuente histórica | Corregir a `media-item.ts` y buscar duplicados. |
| El agente elige campos | La tabla no se cerró | Detener la escritura y volver al contrato reducido. |
| `fetch` entra al flujo exitoso con 404 | No se revisa `response.ok` | Leer status antes de llamar `response.json()`. |
| Se usa `as MediaItem` | Se confunde tipo con transformación | Comparar identidad, nombres y campos ausentes. |
| `requestJson` decide rutas | El helper absorbió responsabilidades del endpoint | Devolver método, body y params a los fetchers. |
| El test llama al backend | Se eligió otra unidad | Volver al adapter puro y a la matriz humana. |
| Se instala jsdom o Testing Library | Se anticipó una prueba de componente | Retirar dependencias; el test usa Node. |
| `ApiProbe` guarda datos | Se intenta integrar la interfaz | Usar un handler temporal y eliminarlo después de Network. |
| Se afirma que el build valida JSON | Se amplía la evidencia | Explicar que el cast no inspecciona runtime. |
| AutoSkills instala sin revisión | Se trató la propuesta como aprobación | Recuperar `--dry-run`, procedencia y `SKILL.md`. |
| `ahk` no aparece después de instalar | La terminal no resuelve el prefijo global activo | Ejecutar `npm prefix -g`, comprobar el Node activo, reabrir la terminal y repetir `command -v ahk`. |
| `ahk health` termina con el mensaje del placeholder | `health.sh` no se personalizó | Definir los checks conocidos; no presentar el placeholder como fallo del frontend. |

## Plan de contingencia

- **Context7 falla:** usar la documentación oficial de Vitest y registrar el fallback.
- **AutoSkills falla o propone contenido irrelevante:** omitir instalación; la rutina continúa con skills existentes.
- **AHK no se instala o materializa:** usar el checkpoint preparado y los prompts de esta guía en el provider institucional; registrar que el harness no produjo evidencia en vivo.
- **Backend o CORS falla:** enseñar con la captura preparada y registrar que Network en vivo queda pendiente.
- **El grupo se retrasa después de types:** entregar `media-api.ts` y el adapter del checkpoint base; conservar la auditoría humana.
- **Faltan diez minutos:** entregar `requestJson<T>()` resuelto, invocar `ahk-test`, retirar probe y cerrar fronteras.
- **Vitest falla:** conservar el error exacto; no cambiar producción durante un prompt limitado a tests.
- **Build falla:** separar errores de import, type y configuración. No afirmar checkpoint completo.

## Clave del cuestionario previo

### Pregunta 1

- **Respuesta:** A. Una Promise que luego entrega una `Response`.
- **Justificación:** `fetch()` inicia la petición y devuelve una Promise; la `Response` llega cuando esa Promise se resuelve.
- **Fuente:** MDN, resumen y `Return value`.

### Pregunta 2

- **Respuesta:** Falso.
- **Justificación:** Una response HTTP con status de error puede resolver la Promise. El código debe consultar `ok` o `status`.
- **Fuente:** MDN, resumen de `fetch()`.

### Pregunta 3

- **Respuesta:** A. `response.ok`.
- **Justificación:** `ok` es verdadero para status entre 200 y 299.
- **Fuente:** MDN, ejemplo de `fetch()` y referencia de `Response.ok`.

### Pregunta 4

- **Respuesta:** Verdadero.
- **Justificación:** El archivo expresa una expectativa; la evidencia aparece cuando el runner ejecuta el caso y entrega un resultado.
- **Fuente:** Vitest, `Writing Tests` y `Test Scripts`.

### Pregunta 5

- **Respuesta:** A. La comprobación escrita con `expect`.
- **Justificación:** `expect` compara el valor obtenido con el resultado esperado.
- **Fuente:** Vitest, `Writing Tests`.

## Lista de cierre docente

- [ ] El explorador local funciona después de retirar el probe.
- [ ] `command -v ahk` resuelve un binario y `ahk --version` muestra `2.11.0`.
- [ ] `ahk doctor` reconoce la configuración y las skills materializadas.
- [ ] `health.sh` ejecuta test y build; `ahk health` termina con exit status 0.
- [ ] Existe una sola definición de `MediaType`.
- [ ] Los DTO conservan nombres y nulabilidad.
- [ ] `requestJson<T>()` apareció después de dos fetchers concretos.
- [ ] El test enfocado terminó con exit status 0.
- [ ] El build terminó con exit status 0.
- [ ] Network mostró POST y GET.
- [ ] No quedan `ApiProbe`, imports o renders temporales.
- [ ] El grupo explicó una frontera de cada evidencia.
- [ ] No se introdujeron Query, Router, auth, Zod runtime ni tests DOM.

## Fuentes

- [MDN · `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
- [MDN · `Response.ok`](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
- [Vite · Variables de entorno y modos](https://vite.dev/guide/env-and-mode)
- [TypeScript · Type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Vitest · Getting Started](https://vitest.dev/guide/)
- [Agent Harness Kit · paquete npm](https://www.npmjs.com/package/@cardor/agent-harness-kit)
- [Agent Harness Kit](https://github.com/enmanuelmag/agent-harness-kit)
- [AutoSkills](https://github.com/midudev/autoskills)

Fuentes HTTP y Vitest verificadas el 31 de agosto de 2026. Agent Harness Kit `2.11.0` se verificó el 5 de septiembre de 2026 mediante el registro npm, el paquete publicado y el repositorio oficial. Context7 no devolvió un identificador exacto para AHK y el índice Mintlify no estuvo disponible; se usaron esas fuentes oficiales como respaldo.


## Ruta ejecutable y referencia autosuficiente

Esta es la secuencia real de ramas del proyecto progresivo:

`session-07-start` → `session-07-step-01-contracts` → `session-07-step-02-fetchers` → `session-07-step-03-request-json` → `session-07-step-04-first-test` → `session-07-end`

La rama `session-07-end` es el checkpoint completo. Cada rama intermedia compila y permite retomar la demostración desde una transformación concreta. Los archivos que no aparecen aquí se conservan sin cambios desde la sesión anterior.

Ejecuta la instalación de esta sesión exactamente así:

```bash
pnpm add --save-dev --save-exact vitest@4.1.11
```

El lockfile lo genera pnpm. No lo escribas a mano. A continuación están **completos** todos los archivos que el docente o el estudiante debe crear o reemplazar durante la sesión; no hace falta abrir el repositorio de referencia en otra ventana.

### `.env.example` · archivo completo

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
```

### `package.json` · archivo completo

```json
{
  "name": "medialog-bootcamp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "packageManager": "pnpm@11.17.0",
  "engines": {
    "node": ">=22.22.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "test": "vitest run",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mantine/core": "9.4.1",
    "@mantine/hooks": "9.4.1",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "postcss": "8.5.26",
    "postcss-preset-mantine": "1.18.0",
    "postcss-simple-vars": "7.0.1",
    "typescript": "6.0.3",
    "vite": "8.2.2",
    "vitest": "4.1.11"
  }
}
```

### `src/types/media-api.ts` · archivo completo

```ts
import type { MediaType } from './media-item'

export type SearchMediaInput = {
  query: string
  mediaType: MediaType
}

export type MediaSearchItemDto = {
  externalId: string
  title: string
  releaseYear: number
  coverUrl: string | null
  mediaType: MediaType
  isLogged: boolean
}

export type GetMediaDetailInput = {
  externalId: string
  mediaType: MediaType
}

export type MediaCatalogDetailDto = {
  externalId: number
  mediaType: MediaType
  title: string
  description: string | null
  coverUrl: string | null
  releaseYear: number | null
  releaseMonth: number | null
  releaseDay: number | null
  durationMinutes: number | null
  episodesCount: number | null
  seasonsCount: number | null
  genres: string[]
  reviewScore: number | null
}

export const MEDIA_STATUS_VALUES = [
  'pending',
  'acquired',
  'watching',
  'seen',
  'dropped',
  'paused',
] as const

export type MediaStatus = (typeof MEDIA_STATUS_VALUES)[number]

export const MEDIA_PRIORITY_VALUES = ['low', 'medium', 'high'] as const

export type MediaPriority = (typeof MEDIA_PRIORITY_VALUES)[number]

export type UserMediaDataDto = {
  id: string
  title: string
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}

export type MediaDetailDto = {
  catalog: MediaCatalogDetailDto | null
  entry: UserMediaDataDto | null
  isLogged: boolean
}
```

### `src/adapters/media-input-to-params.ts` · archivo completo

```ts
import type { GetMediaDetailInput } from '../types/media-api'

export function toMediaDetailSearchParams(
  input: GetMediaDetailInput,
): URLSearchParams {
  return new URLSearchParams({
    externalId: input.externalId,
    mediaType: input.mediaType,
  })
}
```

### `src/api/http.ts` · archivo completo

```ts
const API_URL = import.meta.env.VITE_API_URL

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(`La API respondió con status ${response.status}`)
  }

  return (await response.json()) as T
}
```

### `src/api/media.ts` · archivo completo

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  GetMediaDetailInput,
  MediaDetailDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'
import { requestJson } from './http'

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  return requestJson<MediaSearchItemDto[]>('/api/v2/media/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

export async function getMediaDetail(
  input: GetMediaDetailInput,
): Promise<MediaDetailDto> {
  const params = toMediaDetailSearchParams(input)
  return requestJson<MediaDetailDto>(
    `/api/v2/media/detail?${params.toString()}`,
  )
}
```

### `src/adapters/__tests__/media-input-to-params.test.ts` · archivo completo

```ts
import { describe, expect, it } from 'vitest'

import { toMediaDetailSearchParams } from '../media-input-to-params'

describe('toMediaDetailSearchParams', () => {
  it('conserva la identidad de una película', () => {
    const params = toMediaDetailSearchParams({
      externalId: '438631',
      mediaType: 'movie',
    })

    expect(params.toString()).toBe('externalId=438631&mediaType=movie')
  })

  it('conserva la identidad de una serie', () => {
    const params = toMediaDetailSearchParams({
      externalId: '1399',
      mediaType: 'series',
    })

    expect(params.toString()).toBe('externalId=1399&mediaType=series')
  })
})
```

### Comprobación del checkpoint

```bash
pnpm test
pnpm build
pnpm lint
```

Lee la salida completa. Un código de salida 0 comprueba tests, tipos, generación y lint del estado local; no demuestra por sí solo que el backend publicado esté disponible ni que la navegación se haya probado en un navegador.
