# Sesión 07 · HTTP, DTOs, agentes y primer test

> Estado: paquete textual, presentación HTML y proyecto progresivo implementados. El PDF definitivo se generará bajo demanda.

- **Fecha:** lunes 5 de octubre de 2026
- **Semana:** 3
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Entrada ejecutable:** `session-07-start` desde `session-06-end`
- **Checkpoint ejecutable:** `session-07-end`
- **Ruta:** `session-07-start` → `session-07-step-01-contracts` → `session-07-step-02-fetchers` → `session-07-step-03-request-json` → `session-07-step-04-first-test` → `session-07-end`

## Punto de entrada

La interfaz mantiene el checkpoint 06: modal de Mantine y catálogo con HTML/CSS propios. Hoy no se migran controles ni tarjetas; la adopción más amplia acompaña la búsqueda remota de 08.

La sesión parte del checkpoint completo de la sesión 06:

- El explorador local conserva búsqueda, filtro por tipo, contador, limpieza y vacíos por causa.
- `MediaGrid` recibe `items={visibleMedia}`.
- `App` guarda `selectedMediaId: number | null`.
- `selectedMedia` se deriva con `find` desde el fixture completo.
- `isDetailOpened` se deriva mediante `selectedMedia !== null`.
- `onSelect: (mediaId: number) => void` recorre `App`, `MediaGrid` y `MediaCard`.
- El modal de Mantine muestra el medio seleccionado y permite cerrarlo.
- `MediaType` y `MediaItem` viven en `src/types/media-item.ts`.
- Node cumple `>=22.22.0`; el proyecto todavía no contiene configuración local de Agent Harness Kit.

La apertura prueba una búsqueda local y un modal. No reconstruye filtros, selección ni Mantine.

## Limitación visible

El explorador solo conoce los seis objetos del fixture. Buscar un título ausente no consulta otro sistema. Para ampliar el catálogo, el frontend necesita leer un contrato, construir un request y esperar una response.

```text
checkpoint 06
fixture → App → MediaGrid → MediaCard → modal local

sesión 07
interfaz local permanece
          +
funciones TypeScript → HTTP → API de Medialog
          +
test de una transformación pura
```

La sesión 08 conectará `searchMedia()` con la interfaz mediante TanStack Query. Esta sesión no conserva responses en React, Zustand ni `localStorage`.

## Checkpoint de salida

Al terminar:

- El explorador local de la sesión 06 sigue funcionando.
- `.env.example` declara `VITE_API_URL=https://bootcamp-medialog.cardor.dev` sin tokens, contraseñas ni claves privadas.
- `src/types/media-api.ts` contiene los types mínimos de búsqueda y detalle.
- `MediaType` se importa desde `src/types/media-item.ts`; no se declara otra unión.
- `MediaSearchItemDto` conserva `externalId`, `coverUrl`, `releaseYear` e `isLogged` con la forma del transporte.
- `MediaDetailDto` conserva las ramas `catalog`, `entry` e `isLogged`.
- `src/adapters/media-input-to-params.ts` convierte `GetMediaDetailInput` en `URLSearchParams`.
- `src/api/media.ts` exporta `searchMedia()` y `getMediaDetail()`.
- `src/api/http.ts` exporta `requestJson<T>()` después de que el grupo observa repetición entre ambos fetchers.
- `vitest@4.1.11` está configurado con el script `"test": "vitest run"`.
- El CLI global de Agent Harness Kit responde con `2.11.0` y el proyecto contiene la configuración, los roles y las skills materializadas por `ahk init`.
- `health.sh` ejecuta `pnpm test` y `pnpm build`; `ahk doctor` y `ahk health` terminan correctamente en el seed ejecutable.
- Dos casos enfocados comprueban que el adapter conserva la identidad de una película y una serie.
- Un `ApiProbe` temporal permite inspeccionar ambos requests en Network y se elimina antes del checkpoint.
- `pnpm build` y el test enfocado terminan con código de salida 0 en el seed ejecutable.
- El estudiante puede explicar qué decidió, qué delegó, qué leyó y qué demuestra cada comprobación.

El test demuestra la transformación de inputs a parámetros. Network demuestra método, URL, payload, status y response de los requests observados. El build comprueba tipos y generación. Ninguna de esas evidencias demuestra TanStack Query, autenticación o disponibilidad futura del backend.

## Resultado de aprendizaje

El estudiante leerá dos contratos HTTP, decidirá qué campos representa el frontend, implementará funciones asíncronas fuera de los componentes y aplicará una rutina asistida que exige límites, lectura del código y evidencia ejecutada.

## Concepto principal

La frontera HTTP separa responsabilidades:

```text
componente
  no conoce método, headers ni serialización

fetcher de endpoint
  decide ruta, método, body o parámetros y tipo de retorno

requestJson<T>
  ejecuta fetch, comprueba response.ok y lee JSON

API externa
  conserva el contrato y los datos remotos
```

La sesión separa tres dificultades:

1. Comprender request, response, Promise, DTO y error HTTP.
2. Delegar trabajo mecánico después de cerrar el contrato.
3. Escribir y ejecutar un test sobre una función pura.

La instalación ocupa un bloque propio: npm instala únicamente el CLI global y pnpm continúa administrando las dependencias del frontend. `ahk init` materializa el harness local; ambas acciones se explican como alcances diferentes.

El docente implementa el primer fetcher. El agente no decide qué significa la API. Vitest no sustituye Network.

## Vocabulario

- **Cliente:** programa que inicia un request; aquí, la aplicación del navegador.
- **Servidor:** sistema que recibe el request y produce una response.
- **API:** contrato mediante el cual otro programa solicita una operación.
- **Endpoint:** combinación de método HTTP y ruta.
- **Request:** solicitud enviada al servidor.
- **Response:** respuesta con status, headers y body.
- **Query string:** parámetros escritos después de `?` en una URL.
- **Serialización:** conversión de un valor a un formato transportable.
- **Promise:** objeto que representa un resultado disponible después.
- **DTO:** estructura que cruza la frontera entre cliente y servidor.
- **Adapter:** función que traduce una representación a otra.
- **Fetcher:** función que construye y ejecuta un request para un caso concreto.
- **Runtime:** momento en que JavaScript se ejecuta.
- **Harness:** estructura que limita roles, tareas, memoria y evidencia.
- **Skill:** instrucciones reutilizables para una tarea delimitada.
- **Matriz de tests:** lista de comportamientos, entradas y resultados esperados.
- **Frontera de evidencia:** aquello que una comprobación todavía no demuestra.

## Contrato reducido

### Búsqueda

```text
POST /api/v2/media/search
Content-Type: application/json

{
  "query": "Dune",
  "mediaType": "movie"
}
```

`query` contiene al menos dos caracteres. La respuesta exitosa es un arreglo.

| Type | Campo | Tipo | Uso identificado |
| --- | --- | --- | --- |
| `SearchMediaInput` | `query` | `string` | Texto enviado |
| `SearchMediaInput` | `mediaType` | `MediaType` | Catálogo elegido |
| `MediaSearchItemDto` | `externalId` | `string` | Identidad pública |
| `MediaSearchItemDto` | `title` | `string` | Título visible después |
| `MediaSearchItemDto` | `releaseYear` | `number` | Año transportado |
| `MediaSearchItemDto` | `coverUrl` | `string | null` | Portada opcional |
| `MediaSearchItemDto` | `mediaType` | `MediaType` | Tipo transportado |
| `MediaSearchItemDto` | `isLogged` | `boolean` | Estado de catálogo |

### Detalle público

```text
GET /api/v2/media/detail?externalId=438631&mediaType=movie
```

El detalle devuelve una raíz con `catalog`, `entry` e `isLogged`. La sesión conserva la nulabilidad aunque la interfaz privada aparezca después.

| Type | Responsabilidad |
| --- | --- |
| `GetMediaDetailInput` | Identidad pública que construye el request |
| `MediaCatalogDetailDto` | Datos del catálogo remoto |
| `UserMediaDataDto` | Registro personal nullable |
| `MediaDetailDto` | Raíz completa de la response |

Status y prioridad se definen junto al contrato API porque formularios y DTO privados reutilizarán esos values:

```ts
export const MEDIA_STATUS_VALUES = [
  "pending",
  "acquired",
  "watching",
  "seen",
  "dropped",
  "paused",
] as const

export type MediaStatus = (typeof MEDIA_STATUS_VALUES)[number]

export const MEDIA_PRIORITY_VALUES = ["low", "medium", "high"] as const

export type MediaPriority = (typeof MEDIA_PRIORITY_VALUES)[number]
```

### Formas que no se deben mezclar

| Forma | Identidad y nombres |
| --- | --- |
| `MediaItem` local | `id: number`, `posterUrl`, `releaseDate`, `description` |
| `MediaSearchItemDto` | `externalId: string`, `coverUrl`, `releaseYear`; no incluye `description` |
| `MediaCatalogDetailDto` | `externalId: number`, `coverUrl`, fecha separada en año, mes y día |

Un cast a `MediaItem` no transforma nombres, no agrega campos y no valida JSON. El modelo visual para resultados remotos pertenece a la sesión 08.

## Transformación guiada

### Estado 0 · Instalar el CLI y materializar el harness

El seed comienza sin configuración de AHK. Desde la raíz, la clase ejecuta:

```bash
node --version
npm --version
npm install --global @cardor/agent-harness-kit@2.11.0
command -v ahk
ahk --version
ahk init
```

La instalación global expone el comando; `ahk init` crea la configuración, las instrucciones, los roles, las skills y `health.sh` dentro del proyecto. La clase elige el provider institucional, usa almacenamiento local y no crea una primera tarea. Primero configura `health.sh` con `pnpm build`; después de instalar Vitest lo amplía con `pnpm test` seguido de `pnpm build`.

### Estado 1 · Definir types y adapter

Después de que el grupo cierra la tabla del contrato, el agente puede crear:

```text
src/
├── adapters/
│   └── media-input-to-params.ts
├── types/
│   ├── media-api.ts
│   └── media-item.ts
└── resto del checkpoint 06
```

El adapter tiene una responsabilidad:

```ts
import type { GetMediaDetailInput } from "../types/media-api"

export function toMediaDetailSearchParams(
  input: GetMediaDetailInput,
): URLSearchParams {
  return new URLSearchParams({
    externalId: input.externalId,
    mediaType: input.mediaType,
  })
}
```

No solicita datos, no cambia estado y no valida runtime. Traduce un input tipado a la representación de la URL.

### Estado 2 · Escribir el primer fetcher con el docente

El docente implementa `searchMedia()`:

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

El grupo identifica input, tipo de retorno, serialización y comprobación del status. También explica que el cast final expresa confianza estática y no inspecciona el JSON.

### Estado 3 · Completar el segundo fetcher

El grupo implementa `getMediaDetail()` siguiendo el primer patrón:

```ts
import { toMediaDetailSearchParams } from "../adapters/media-input-to-params"
import type { GetMediaDetailInput, MediaDetailDto } from "../types/media-api"

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

Antes del refactor, los estudiantes marcan las líneas repetidas entre los fetchers.

### Estado 4 · Extraer requestJson después de ver repetición

El agente mueve solo la mecánica compartida:

```ts
export async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(`La API respondió con status ${response.status}`)
  }

  return (await response.json()) as T
}
```

`searchMedia()` conserva POST, headers y body. `getMediaDetail()` conserva la construcción de parámetros. `requestJson<T>()` no decide el contrato de ningún endpoint.

### Estado 5 · Instalar Vitest y probar una transformación pura

El grupo instala la versión fijada y registra el script finito:

```bash
pnpm add -D vitest@4.1.11
pnpm pkg set scripts.test="vitest run"
```

El test vive junto al adapter:

```text
src/adapters/
├── media-input-to-params.ts
└── __tests__/
    └── media-input-to-params.test.ts
```

La matriz humana contiene dos comportamientos:

| Caso | Entrada | Resultado esperado |
| --- | --- | --- |
| Película | `externalId: "438631"`, `mediaType: "movie"` | Ambos parámetros conservan sus values |
| Serie | `externalId: "1399"`, `mediaType: "series"` | Ambos parámetros conservan sus values |

El grupo invoca la skill `ahk-test` con la matriz, el archivo permitido y las prohibiciones concretas. La skill redacta el archivo sin snapshots ni mocks. El grupo lo lee y ejecuta:

```bash
pnpm exec vitest run src/adapters/__tests__/media-input-to-params.test.ts
```

Después actualiza `health.sh` para ejecutar `pnpm test` y `pnpm build`. El test enfocado conserva evidencia específica; `ahk health` ejecuta el conjunto de checks acordado por el proyecto.

### Estado 6 · Comprobar requests y limpiar el checkpoint

Un `ApiProbe` temporal ejecuta:

```text
searchMedia({ query: "Dune", mediaType: "movie" })
→ tomar el primer resultado
→ getMediaDetail({ externalId, mediaType })
→ inspeccionar los dos requests en Network
```

El probe usa un handler `async` con `try/catch`. No usa `useState` ni `useEffect`. Después de inspeccionar método, URL, payload, status y response, el grupo elimina el componente, su import y su render.

## Trabajo con agentes

### Rutina común

```text
Context7: consultar documentación vigente
→ revisar las skills disponibles
→ AutoSkills: previsualizar propuestas solo si falta una skill pertinente
→ Agent Harness Kit: limitar y ejecutar la tarea
→ estudiante: leer el código y ejecutar evidencia
```

Context7 aporta documentación; una skill conserva instrucciones; AutoSkills propone skills; el harness organiza el trabajo. Ninguna pieza garantiza que el resultado sea correcto.

Antes de aplicar esta rutina, la clase instala `@cardor/agent-harness-kit@2.11.0` globalmente con npm, comprueba PATH y versión, ejecuta `ahk init` en la raíz y revisa lo materializado. La excepción global no cambia el gestor del proyecto ni crea `package-lock.json`.

El docente muestra primero:

```bash
pnpm dlx autoskills@0.3.6 --dry-run
```

El grupo no instala una propuesta sin revisar procedencia, alcance, archivos y `SKILL.md`. Si aprueba una instalación, ejecuta después el comando sin `--dry-run` y revisa `skills-lock.json`. AutoSkills no se añade a `package.json`.

### Interacción 1 · Explorar sin editar

El grupo ya definió la librería, versión y concepto que necesita consultar. Usa Context7 para recuperar documentación de Vitest 4 sobre un test básico y su ejecución finita. Después revisa las skills materializadas y usa `ahk-ask` para localizar `MediaType`, types y adapters existentes.

Condición de parada: si Context7, el provider o el harness no responde, el docente usa la fuente oficial y el checkpoint preparado. El grupo conserva la lectura del código real.

### Interacción 2 · Crear types y adapter

Decisiones humanas previas:

- Tabla de campos y nulabilidad cerrada.
- `MediaType` se importa desde `src/types/media-item.ts`.
- El adapter solo construye parámetros.
- No se crean fetchers, componentes, hooks ni estado.

El prompt completo y su lectura posterior viven en las guías docente y estudiantil. Solo puede crear `src/types/media-api.ts` y `src/adapters/media-input-to-params.ts`.

### Interacción 3 · Extraer repetición

La delegación ocurre después de implementar dos fetchers y marcar `fetch`, `response.ok`, `response.status` y `response.json()` como repetición. Solo puede crear `src/api/http.ts` y modificar `src/api/media.ts`.

El agente se detiene si falta uno de los fetchers o si el refactor exige cambiar firmas públicas.

### Interacción 4 · Redactar el primer test

El grupo define primero los dos casos e invoca `ahk-test`, materializada por Agent Harness Kit `2.11.0`. El prompt breve conserva matriz, ruta permitida, prohibiciones y comando enfocado. El agente solo puede crear `src/adapters/__tests__/media-input-to-params.test.ts`.

El estudiante identifica Arrange, Act y Assert, ejecuta el test y explica por qué no necesita DOM, mocks ni backend.

## Agenda de 90 minutos

| Minutos | Duración | Actividad | Evidencia observable |
| --- | ---: | --- | --- |
| 0–18 | 18 min | Presentación completa y continua: límite del fixture, HTTP, asincronía, DTO, adapter, agentes y evidencia | El editor permanece cerrado y el grupo distingue los conceptos antes de programar. |
| 18–30 | 12 min | Instalar e inicializar AHK; revisar health, Context7, skills y AutoSkills | CLI y harness local quedan diferenciados; la exploración no edita. |
| 30–40 | 10 min | Cerrar contrato y crear types y adapter | Dos archivos respetan tabla, nulabilidad y type canónico. |
| 40–51 | 11 min | Implementar `searchMedia()` con el docente | POST, JSON, status y Promise quedan explicados. |
| 51–59 | 8 min | Completar `getMediaDetail()` | GET y query string funcionan según el mismo patrón. |
| 59–65 | 6 min | Extraer `requestJson<T>()` | El refactor conserva firmas y responsabilidades. |
| 65–76 | 11 min | Instalar Vitest, definir matriz e invocar `ahk-test` | Dos casos pasan con exit status 0. |
| 76–85 | 9 min | Usar `ApiProbe`, revisar Network y retirarlo | Ambos requests se observan y el código temporal desaparece. |
| 85–90 | 5 min | `ahk health`, cierre y puente a Query | Test y build terminan; el grupo limita la evidencia y nombra la responsabilidad pendiente. |

**Total:** 90 minutos.

## Matriz de aceptación

| Caso | Acción | Resultado esperado |
| --- | --- | --- |
| Regresión local | Buscar, filtrar y abrir modal | El checkpoint 06 permanece funcional. |
| Contrato | Revisar `media-api.ts` | Nombres, tipos y nulabilidad coinciden con la tabla. |
| Dominio | Revisar imports | Existe una sola definición de `MediaType`. |
| Búsqueda | Buscar `Dune` como película | Network muestra POST y body JSON. |
| Detalle | Usar el primer resultado | Network muestra GET con ambos parámetros. |
| Error HTTP | Observar un status no exitoso preparado | `requestJson<T>` lanza `Error` con el status. |
| Adapter | Ejecutar los dos tests | Película y serie conservan `externalId` y `mediaType`. |
| Limpieza | Buscar `ApiProbe` | No quedan componente, import ni render temporal. |
| Build | Ejecutar `pnpm build` | TypeScript y Vite terminan con exit status 0. |
| Explicación | Presentar evidencia | El estudiante nombra un límite de Vitest, build y Network. |

## Guion para la presentación futura

| Momento | Título provisional | Contenido que debe conservarse | Recurso docente |
| --- | --- | --- | --- |
| Recapitulación | Todo funciona con seis medios | El filtro y el modal recorren objetos cargados. | Captura del checkpoint 06. |
| Problema | Los datos viven en otro sistema | El navegador solicita información y espera. | Diagrama navegador, request, servidor y response. |
| Contrato | API y endpoint | Un endpoint combina método y ruta. | Resaltar `POST + /api/v2/media/search`. |
| Request | Qué enviamos | Búsqueda usa body; detalle usa query string. | Dos requests separados por partes. |
| Response | Qué recibimos | Status, headers y body; `ok` cubre 200–299. | Comparar `200` y `404`. |
| Asincronía | La respuesta llega después | `fetch` devuelve una Promise. | Línea de tiempo iniciar, esperar y continuar. |
| Error | HTTP fallido y red ausente | Un `404` contiene response; un fallo de red no. | Dos ramas después de `fetch`. |
| Tipo | JSON y DTO | TypeScript expresa el contrato esperado, sin validar runtime. | Compilador frente a navegador. |
| Frontera | DTO y modelo visual | Un cast no transforma campos. | Tabla de tres formas. |
| Instalación | CLI global y harness local | npm expone `ahk`; `ahk init` materializa límites dentro del proyecto. | Diagrama de dos alcances y verificación de versión. |
| Materialización | Qué impide dejar libre al agente | Configuración, instrucciones, roles, skills y health hacen visibles sus límites. | Árbol generado y lectura de dos `SKILL.md`. |
| Documentación | Context7 | Se consulta versión y concepto antes de generar código. | Consulta breve de Vitest. |
| Skills | Revisar antes de instalar | AutoSkills propone material y `--dry-run` permite inspeccionarlo. | Árbol de archivos propuestos. |
| Harness | Limitar la tarea | Objetivo, archivos, prohibiciones y evidencia. | Prompt abierto frente a prompt acotado. |
| Evidencia | Generado, leído y ejecutado | Diff, Vitest, build y Network prueban cosas distintas. | Matriz de fronteras. |
| Puente | El estado remoto viene después | La sesión 08 representará carga, error, vacío y caché. | Diagrama 07 → 08. |

El cierre usa cuatro preguntas:

1. ¿Por qué el grupo decide los campos antes de pedir types al agente?
2. ¿Qué diferencia existe entre recibir `404` y no recibir una response?
3. ¿Qué demuestra el test de `URLSearchParams` y qué debe comprobar Network?
4. ¿Qué responsabilidad queda pendiente aunque los fetchers funcionen?

La cuarta respuesta abre TanStack Query en la sesión 08.

## Plan de contingencia

- **Context7 no responde:** usar las secciones oficiales de Vitest verificadas por el docente y registrar el fallback.
- **AutoSkills propone material irrelevante:** no instalar y explicar por qué la skill disponible ya cubre la tarea.
- **`ahk` no aparece en PATH:** consultar `npm prefix -g`, comprobar el Node activo, reabrir la terminal y repetir la verificación sin usar `sudo`.
- **`health.sh` conserva el placeholder:** reemplazarlo por los checks conocidos antes de interpretar `ahk health`.
- **Provider o harness falla:** entregar `s03-c07-http-types-base`; conservar tabla, lectura y explicación humana.
- **El backend no responde:** usar una captura preparada de Network para enseñar el contrato y registrar que no existe evidencia en vivo.
- **Faltan diez minutos:** entregar el helper ya extraído, conservar la lectura del diff y priorizar test, limpieza del probe y cierre.
- **Vitest falla por configuración:** registrar el error exacto; no modificar producción para obtener verde.
- **El build falla:** separar error de tipos, configuración o dependencia antes de afirmar que el checkpoint está completo.

## Fuera de alcance

- TanStack Query, query keys y caché.
- `MediaSearchCardModel` y `toMediaSearchCardModel()`.
- Reemplazar el fixture por responses remotas.
- Estados visuales de carga, error, vacío y éxito remoto.
- `useEffect` para fetching.
- Guardar responses en React, Zustand o `localStorage`.
- Autenticación y token Bearer.
- Validación runtime del JSON con Zod.
- `HttpError`, retry, timeout, cancelación y `AbortSignal`.
- React Testing Library, `user-event`, jsdom y MSW.
- Tests de componentes, hooks o requests.
- Router, filtros URL y detalle remoto en pantalla.
- Backlog, dashboard, base de datos y flujo completo de roles del harness.
- Swagger, OpenAPI generado y cambios de backend realizados por estudiantes.

## Decisiones pedagógicas

- El problema visible del fixture introduce HTTP.
- El docente implementa el primer fetcher para enseñar el concepto nuevo.
- El grupo completa el segundo fetcher antes de abstraer.
- El agente recibe decisiones cerradas y trabajo mecánico.
- El primer test protege una función pura sin DOM ni backend.
- El probe se retira para que el checkpoint no conserve una integración temporal.
- La respuesta remota entra en la interfaz en la sesión 08 mediante TanStack Query.

## Continuidad con la sesión 08

La sesión 08 recibe `searchMedia()`, `getMediaDetail()`, `requestJson<T>()`, los types de transporte y Vitest. Instala TanStack Query, separa borrador de búsqueda enviada y representa estados inicial, carga, error, vacío y éxito.

La caché conservará `MediaSearchItemDto[]`. Un adapter visual posterior traducirá `coverUrl` a `posterUrl` y `releaseYear` a una etiqueta. No usará `as MediaItem` ni copiará el DTO a otro estado.

## Fuentes docentes

- [MDN · `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
- [MDN · `Response.ok`](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
- [Vite · Variables de entorno y modos](https://vite.dev/guide/env-and-mode)
- [TypeScript · Type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Vitest · Getting Started](https://vitest.dev/guide/)
- [Agent Harness Kit · paquete npm](https://www.npmjs.com/package/@cardor/agent-harness-kit)
- [Agent Harness Kit · repositorio oficial](https://github.com/enmanuelmag/agent-harness-kit)
- [AutoSkills · repositorio oficial](https://github.com/midudev/autoskills)

Fuentes HTTP y Vitest verificadas el 31 de agosto de 2026. Agent Harness Kit `2.11.0` se verificó el 5 de septiembre de 2026 mediante el registro npm, el paquete publicado y el repositorio oficial. Context7 no devolvió un identificador exacto para AHK y el índice Mintlify no estuvo disponible; se usaron esas fuentes oficiales como respaldo.
