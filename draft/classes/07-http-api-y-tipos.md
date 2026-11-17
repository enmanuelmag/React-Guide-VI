# Sesión 07 · HTTP, DTOs, agentes y primer test

- **Semana:** 3
- **Fecha:** lunes 5 de octubre de 2026
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Punto de entrada:** explorador local de la sesión 06, con filtros, selección por identidad y modal controlado
- **Checkpoint de salida:** explorador local intacto, fetchers tipados de búsqueda y detalle, adapter de parámetros verificado con Vitest y primera rutina de agente documentada

## Resultado de aprendizaje

Al terminar, el estudiante podrá leer dos contratos HTTP, decidir qué campos debe representar el frontend, implementar funciones asíncronas fuera de los componentes y explicar qué parte del trabajo delegó al agente, qué revisó y qué evidencia ejecutó.

## Limitación que abre la sesión

La sesión 06 permite buscar, filtrar y abrir el detalle de los medios incluidos en un fixture. La interacción funciona, pero la aplicación no puede encontrar un título ausente de ese archivo.

La nueva frontera es externa:

```text
sesión 06
fixture → App → MediaGrid → MediaCard → Modal

sesión 07
interfaz local permanece
          +
funciones TypeScript → HTTP → API de Medialog
          +
tests de una transformación pura
```

La sesión 08 conectará `searchMedia()` con la interfaz mediante TanStack Query. Esta sesión no copia responses a `useState`, Zustand o `localStorage`.

## Concepto central y dificultades separadas

El concepto central es la frontera HTTP. La sesión separa tres bloques para no mezclar dificultades:

1. El grupo aprende request, response, Promise, DTO y error HTTP.
2. El grupo usa un agente para trabajo mecánico después de cerrar el contrato.
3. El grupo escribe y ejecuta un test sobre una función pura.

El agente no decide qué significa la API ni implementa el primer fetcher. Vitest no sustituye la comprobación de Network.

## Conceptos

### HTTP y transporte

- Cliente, servidor y API.
- Endpoint como método más ruta.
- URL, query string, headers y body.
- Request y response.
- JSON y serialización.
- Promise, `async` y `await`.
- `fetch`, `response.ok` y `response.status`.
- Error HTTP frente a error de red.
- DTO frente a modelo visual.
- `Promise<T>` y helper genérico después de una repetición visible.
- Variable pública `VITE_API_URL`.
- TypeScript como ayuda estática, no como validación runtime del JSON.

### Trabajo con agentes

- Harness como conjunto de límites, roles, memoria y evidencia.
- Skill como rutina reutilizable.
- Prompt limitado por objetivo, archivos y cambios prohibidos.
- Decisión humana antes de delegación.
- Lectura posterior del diff y de la explicación generada.
- Diferencia entre salida del agente y evidencia ejecutada.

### Testing

- Comportamiento observable.
- Matriz de tests.
- Arrange, Act, Assert.
- Un comportamiento por caso.
- Test enfocado mediante Vitest.
- Frontera entre test unitario, build y request real.

## Preparación docente

### Backend

La guía usa:

```text
POST /api/v2/media/search
GET  /api/v2/media/detail?externalId=...&mediaType=...
```

La rama docente debe permitir búsqueda anónima y responder `isLogged: false` sin usuario. El frontend solo envía `movie` o `series`. El backend puede reconocer otros tipos, pero el curso excluye anime.

El docente entrega una hoja reducida con método, ruta, entrada, respuesta y errores. Los estudiantes no usan Swagger, OpenAPI generado ni `api.d.ts` en esta sesión.

### Runtime y herramientas

El entorno de la clase fija:

- `@cardor/agent-harness-kit@2.11.0`, instalado globalmente con npm.
- `vitest@4.1.11`.
- Un runtime compatible con Vitest 4 y con los requisitos publicados del kit.
- Node `>=22.22.0` y pnpm `11.17.0`.
- Script `"test": "vitest run"` en `package.json`.
- `health.sh` configurado primero con build y después con test más build.

El docente prepara una copia resuelta, pero el seed estudiantil no incluye el harness local. La clase instala el CLI, verifica PATH y versión y recorre `ahk init` con respuestas compartidas. Después observa configuración, instrucciones, roles, `health.sh`, `ahk-ask` y `ahk-test`.

```bash
npm install --global @cardor/agent-harness-kit@2.11.0
command -v ahk
ahk --version
ahk init
ahk doctor
ahk health
```

La instalación global expone el comando y `ahk init` materializa el harness dentro del proyecto. `ahk doctor` comprueba configuración y materialización; `ahk health` solo ejecuta los checks escritos en `health.sh`.

### Contingencia

El docente conserva una copia de contingencia de `s03-c07-http-types-base` con AHK inicializado y otra copia resuelta con Vitest. El seed principal omite configuración local del harness, Vitest, fetchers, helper HTTP y test resuelto.

Si el provider Cloud tarda o falla, el estudiante recibe ese checkpoint para continuar. El grupo conserva la tabla de campos y la lectura del código; la contingencia no elimina la decisión humana previa.

## Contrato reducido del curso

### Búsqueda

```text
POST /api/v2/media/search
Content-Type: application/json

{
  "query": "Dune",
  "mediaType": "movie"
}
```

`query` requiere al menos dos caracteres. La respuesta exitosa es un arreglo.

| Type | Campo | Tipo | Uso identificado |
| --- | --- | --- | --- |
| `SearchMediaInput` | `query` | `string` | Texto enviado |
| `SearchMediaInput` | `mediaType` | `MediaType` | Catálogo elegido |
| `MediaSearchItemDto` | `externalId` | `string` | Identidad pública |
| `MediaSearchItemDto` | `title` | `string` | Título de tarjeta |
| `MediaSearchItemDto` | `releaseYear` | `number` | Año visible |
| `MediaSearchItemDto` | `coverUrl` | `string | null` | Portada opcional |
| `MediaSearchItemDto` | `mediaType` | `MediaType` | Tipo transportado |
| `MediaSearchItemDto` | `isLogged` | `boolean` | Estado de catálogo |

### Detalle público

```text
GET /api/v2/media/detail?externalId=438631&mediaType=movie
```

El detalle devuelve una raíz con `catalog`, `entry` e `isLogged`. La sesión conserva la nulabilidad del contrato aunque la interfaz privada aparezca después.

| Type | Responsabilidad |
| --- | --- |
| `GetMediaDetailInput` | `externalId: string` y `mediaType: MediaType` para construir el request |
| `MediaCatalogDetailDto` | Catálogo remoto, descripción, portada, fecha, duración, episodios, temporadas, géneros y score |
| `UserMediaDataDto` | `id`, título y los datos personales `status`, `priority`, `notes` |
| `MediaDetailDto` | Raíz con `catalog`, `entry` e `isLogged` |

Status y prioridad se definen desde el primer contrato porque formularios y DTO privados los reutilizarán:

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

### Contraste que debe quedar visible

| Forma | Identidad y nombres |
| --- | --- |
| `MediaItem` local | `id: number`, `posterUrl`, `releaseDate`, `description` |
| `MediaSearchItemDto` | `externalId: string`, `coverUrl`, `releaseYear`; no contiene `description` |
| `MediaCatalogDetailDto` | `externalId: number`, `coverUrl`, fecha separada en año, mes y día |

El grupo no usa `as MediaItem`. La sesión 08 introducirá el adapter visual cuando conecte la búsqueda remota con una tarjeta.

## Guion de presentación

### Propósito y duración

El deck inicial ocupa 20 minutos. Los primeros 7 recuperan el checkpoint local. Los siguientes 8 presentan HTTP y asincronía. Los últimos 5 introducen la rutina de agente sin explicar todavía backlog, base de datos o dashboard.

La clase vuelve al deck durante 5 minutos de cierre.

### Secuencia conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Todo funciona con seis medios | El filtro y el modal recorren objetos ya cargados. Un título ausente exige modificar el fixture. | Captura del checkpoint 06 y búsqueda fallida. |
| Problema | Los datos viven en otro sistema | El navegador necesita solicitar información y esperar. React no define el contrato remoto. | Diagrama navegador, request, servidor y response. |
| Contrato | API y endpoint | La API expresa operaciones y formas. Un endpoint concreto combina método y ruta. | Resaltar `POST + /api/v2/media/search`. |
| Request | Qué enviamos | Búsqueda usa body JSON; detalle usa query string. Método, ruta, headers y body cumplen funciones distintas. | Dos requests coloreados por partes. |
| Response | Qué recibimos | Status, headers y body. `response.ok` representa status entre 200 y 299. | Comparación de `200` y `404`. |
| Asincronía | La respuesta llega después | `fetch` devuelve una Promise. `await` pausa la continuación de la función, no toda la página. | Línea de tiempo iniciar, esperar y continuar. |
| Error | HTTP fallido y red ausente | Un `404` contiene response. Un fallo de red impide recibirla. `fetch` no rechaza solo por status no exitoso. | Dos ramas posteriores a `fetch`. |
| Tipo | JSON y DTO | TypeScript expresa el contrato esperado, pero no inspecciona el JSON durante runtime. | “El compilador confía” frente a “el navegador recibe”. |
| Límite | DTO no es modelo visual | Transporte e interfaz usan nombres y responsabilidades distintas. Un cast no transforma datos. | Tabla de las tres formas. |
| Instalación | CLI global y harness local | npm expone `ahk`; `ahk init` materializa límites dentro de Medialog. | Diagrama de los dos alcances y salida de versión. |
| Materialización | Por qué no dejamos libre al agente | Configuración, instrucciones, roles, skills y health hacen visibles sus límites. | Árbol generado y lectura de `ahk-ask` y `ahk-test`. |
| Agente | Primero decidimos, luego delegamos | El grupo selecciona campos y nulabilidad. El agente escribe la parte repetitiva dentro de archivos permitidos. | Tabla “decisión humana / trabajo mecánico”. |
| Harness | Una skill conserva una rutina | `ahk-ask` investiga sin escribir. Un prompt de implementación limita objetivo, archivos y evidencia. | Comparar pregunta abierta con petición limitada. |
| Evidencia | Generado, leído y ejecutado | Un diff generado no demuestra build, test o request. Cada evidencia tiene un alcance. | Tres columnas: diff, Vitest, Network. |
| Puente | El estado remoto viene después | Esta sesión deja fetchers. La sesión 08 representará carga, error, vacío y caché con TanStack Query. | Diagrama del checkpoint 07 al 08. |

### Indicaciones para las futuras diapositivas

- HTTP no pertenece a React. La aplicación usa APIs del navegador para comunicarse.
- API y servidor no son sinónimos. La API es el contrato que el servidor expone.
- Endpoint significa método más ruta.
- `JSON.stringify` serializa el body de búsqueda.
- `URLSearchParams` construye la query string del detalle.
- Una función `async` devuelve una Promise.
- `response.json()` también devuelve una Promise.
- `fetch` puede resolver con `404` o `500`; el código debe consultar `response.ok`.
- Un cast TypeScript no valida ni transforma un response.
- Los types manuales conservan nombres, tipos y nulabilidad de los campos elegidos.
- El backend puede devolver más información que el frontend no consume.
- El estudiante define la tabla de campos antes de pedir código al agente.
- `ahk-ask` sirve para explorar. No crea types ni modifica archivos.
- El primer prompt de implementación permite dos archivos y prohíbe tocar componentes.
- `ahk-test` reduce el prompt repetitivo, pero recibe una matriz humana, rutas permitidas y evidencia enfocada.
- Vitest demuestra la transformación de inputs a parámetros. Network demuestra el request real.
- `pnpm build` demuestra que TypeScript y Vite producen el bundle; no demuestra disponibilidad del backend.

### Cierre conceptual

1. ¿Por qué el grupo debe decidir los campos antes de pedir types al agente?
2. ¿Qué diferencia existe entre recibir `404` y no recibir una response?
3. ¿Qué demuestra el test de `URLSearchParams` y qué debe comprobar Network?
4. ¿Qué responsabilidad queda pendiente aunque los fetchers ya funcionen?

La cuarta respuesta abre TanStack Query en la sesión 08.

## Flujo del código

### Estado inicial

El explorador local continúa activo. La sesión no reemplaza `mediaItems`, no retira el modal y no integra datos remotos en `App`.

### Estado 1 · Types y adapter de transporte

El grupo cierra la tabla del contrato. Después, el agente puede crear:

```text
src/
├── adapters/
│   └── media-input-to-params.ts
├── types/
│   ├── media-api.ts
│   └── media.ts
└── resto del checkpoint 06
```

El adapter conserva una responsabilidad:

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

No solicita datos, no cambia estado y no valida runtime. Traduce un input ya tipado a la representación que necesita la URL.

### Estado 2 · Primer fetcher escrito por el docente

El docente implementa `searchMedia()` en `src/api/media.ts`:

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

El docente explica input, Promise, serialización, `response.ok` y cast final. El grupo identifica que el cast no valida.

### Estado 3 · Segundo fetcher como práctica guiada

El grupo completa `getMediaDetail()` usando el adapter ya revisado:

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

Los estudiantes señalan las líneas repetidas entre ambos fetchers antes de delegar la extracción.

### Estado 4 · Helper extraído después de la repetición

El agente mueve a `src/api/http.ts` únicamente la mecánica compartida:

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

`searchMedia` conserva método, headers y body. `getMediaDetail` conserva la construcción de parámetros. El helper no decide el contrato de cada endpoint.

### Estado 5 · Test enfocado

El test vive junto al adapter:

```text
src/adapters/
├── media-input-to-params.ts
└── __tests__/
    └── media-input-to-params.test.ts
```

La matriz humana contiene dos comportamientos:

| Comportamiento | Entrada | Resultado esperado | Fuente |
| --- | --- | --- | --- |
| Conserva identidad de película | `externalId: "438631"`, `mediaType: "movie"` | Ambos parámetros mantienen sus values | Contrato de detalle |
| Conserva identidad de serie | `externalId: "1399"`, `mediaType: "series"` | Ambos parámetros mantienen sus values | Contrato de detalle |

El agente redacta casos sin snapshots ni mocks. El grupo ejecuta:

```bash
pnpm exec vitest run src/adapters/__tests__/media-input-to-params.test.ts
```

### Estado 6 · Probe temporal y checkpoint limpio

Un `ApiProbe` temporal ejecuta:

```text
searchMedia({ query: "Dune", mediaType: "movie" })
→ tomar el primer resultado
→ getMediaDetail({ externalId, mediaType })
→ inspeccionar los dos requests en Network
```

El probe usa `try/catch`, pero no `useState` ni `useEffect`. Después de revisar método, URL, payload, status y response, el grupo elimina el componente, su import y su render.

## Trabajo con agente

### Interacción 1 · Explorar antes de escribir

#### Momento y motivo

Ocurre después del deck y antes de crear types. `ahk-ask` permite comprobar dónde vive `MediaType` y qué convenciones siguen los archivos sin permitir escritura.

#### Decisiones humanas previas

- El grupo ya completó la tabla de campos.
- `MediaType` permanece como `movie | series`.
- Los types nuevos vivirán en `src/types/media-api.ts`.
- El adapter de transporte vivirá en `src/adapters/media-input-to-params.ts`.

#### Prompt listo para copiar

```text
Usa la skill ahk-ask para responder esta pregunta de solo lectura:

En este proyecto React con TypeScript, localiza dónde se define y exporta MediaType, cómo se organizan los types y adapters existentes y qué imports relativos debería usar un nuevo archivo src/types/media-api.ts.

No crees tareas, no modifiques archivos y no propongas todavía la implementación. Devuelve únicamente:
1. archivos relevantes;
2. convenciones encontradas;
3. riesgos de duplicar MediaType o cambiar sus values.
```

#### Salida esperada y condición de parada

La respuesta contiene archivos, convenciones y riesgos, sin diff. Si no encuentra `MediaType` o detecta definiciones incompatibles, se detiene y presenta la evidencia en vez de inventar una ruta.

#### Lectura posterior

Los estudiantes abren los archivos citados y confirman cada afirmación. También explican por qué reutilizar el type evita dos contratos locales para la misma identidad.

#### Evidencia y frontera

Abrir los archivos citados permite contrastar la respuesta del agente. Esta exploración no demuestra que el proyecto compile ni que el contrato remoto sea correcto.

### Interacción 2 · Crear trabajo mecánico después de decidir el contrato

#### Momento y motivo

Ocurre cuando la tabla de campos ya está cerrada. El agente escribe definiciones repetitivas y un adapter pequeño. No decide campos ni modifica la interfaz.

#### Decisiones humanas previas

- La tabla fija nombres, tipos, nulabilidad y campos excluidos.
- `MediaType` se reutiliza y conserva únicamente `movie | series`.
- El grupo distingue DTO de modelo visual y acepta que el adapter solo construya parámetros.

#### Prompt listo para copiar

```text
Trabaja en este proyecto React con TypeScript y pnpm.

Punto de entrada:
- MediaType ya existe en src/types/media.ts y solo admite "movie" | "series".
- El grupo ya revisó el contrato de POST /api/v2/media/search y GET /api/v2/media/detail.

Objetivo único:
Crear los types manuales reducidos de esos dos endpoints y el adapter puro que convierte GetMediaDetailInput a URLSearchParams.

Archivos permitidos:
- crear o modificar src/types/media-api.ts;
- crear src/adapters/media-input-to-params.ts.

Contrato obligatorio:
- SearchMediaInput: query string y mediaType MediaType.
- MediaSearchItemDto: externalId string, title string, releaseYear number, coverUrl string | null, mediaType MediaType, isLogged boolean.
- GetMediaDetailInput: externalId string y mediaType MediaType.
- MediaCatalogDetailDto: externalId number, mediaType MediaType, title string, description string | null, coverUrl string | null, releaseYear number | null, releaseMonth number | null, releaseDay number | null, durationMinutes number | null, episodesCount number | null, seasonsCount number | null, genres string[], reviewScore number | null.
- MEDIA_STATUS_VALUES: pending, acquired, watching, seen, dropped y paused, con type derivado MediaStatus.
- MEDIA_PRIORITY_VALUES: low, medium y high, con type derivado MediaPriority.
- UserMediaDataDto: id string, title string, status MediaStatus, priority MediaPriority, notes string | null.
- MediaDetailDto: catalog MediaCatalogDetailDto | null, entry UserMediaDataDto | null, isLogged boolean.
- toMediaDetailSearchParams(input): URLSearchParams debe conservar externalId y mediaType.

Restricciones:
- importa MediaType; no lo declares otra vez;
- no uses api.d.ts, OpenAPI generado, any, unknown o casts a MediaItem;
- no crees fetchers, componentes, hooks, estado ni dependencias;
- no añadas campos que no aparecen en el contrato anterior;
- no modifiques archivos fuera de la lista permitida.

Comprobación:
- ejecuta pnpm build;
- si el contrato contradice un type existente, detente y explica la contradicción antes de editar.

Al terminar, devuelve:
1. archivos cambiados;
2. mapa de imports;
3. explicación de la diferencia entre DTO y modelo visual;
4. supuestos realizados;
5. resultado y exit status de pnpm build;
6. qué no demuestra ese build.
```

#### Salida esperada y condición de parada

Solo cambian los dos archivos permitidos. Si `MediaType` contiene values distintos o un type canónico ya existe, el agente se detiene.

#### Lectura posterior

Cada estudiante debe:

- Señalar el import único de `MediaType`.
- Elegir tres campos y contrastarlos con la hoja del endpoint.
- Explicar por qué `catalog` y `entry` son nullable.
- Explicar por qué `toMediaDetailSearchParams` no solicita datos.
- Confirmar que no existe `MediaItem` dentro de los DTO.

#### Evidencia y frontera

`pnpm build` comprueba TypeScript y el build de Vite. No comprueba la forma real del response ni los endpoints.

### Interacción 3 · Extraer una repetición visible

#### Momento y motivo

Ocurre después de que docente y estudiantes hayan implementado dos fetchers y marcado las líneas repetidas. El agente realiza un refactor mecánico.

#### Decisiones humanas previas

- Los dos fetchers ya funcionan por separado.
- El grupo marcó como repetición únicamente `fetch`, `response.ok`, `response.status` y `response.json()`.
- Método, ruta, body y parámetros permanecen bajo la responsabilidad de cada fetcher.

#### Prompt listo para copiar

```text
Lee src/api/media.ts completo antes de editar.

Objetivo único:
Extraer la mecánica repetida de fetch, response.ok, response.status y response.json a requestJson<T> dentro de src/api/http.ts.

Archivos permitidos:
- crear src/api/http.ts;
- modificar src/api/media.ts.

Comportamiento que debe conservarse:
- searchMedia sigue decidiendo la ruta POST, Content-Type y body JSON;
- getMediaDetail sigue construyendo los parámetros con toMediaDetailSearchParams;
- ambos conservan sus inputs y Promise de retorno actuales;
- un response no exitoso sigue lanzando Error con el status.

Restricciones:
- no cambies types, componentes, hooks, variables de entorno o mensajes;
- no añadas una clase HttpError, retry, timeout, AbortSignal o validación Zod;
- no edites otros archivos;
- si solo existe un fetcher o las implementaciones no repiten la misma mecánica, detente sin editar.

Comprobación:
- ejecuta pnpm build.

Al terminar, devuelve:
1. diff conceptual antes y después;
2. responsabilidad que permanece en cada fetcher;
3. responsabilidad que pasó a requestJson<T>;
4. resultado y exit status del build;
5. límites de la verificación.
```

#### Salida esperada y condición de parada

Solo cambian `src/api/http.ts` y `src/api/media.ts`, sin alterar las firmas públicas. Si la repetición no existe o exige cambiar el contrato, el agente se detiene sin editar.

#### Lectura posterior

El estudiante sigue ambos recorridos hasta `requestJson<T>` y explica qué representa `T`. También confirma que `T` expresa confianza estática y no valida JSON.

#### Evidencia y frontera

`pnpm build` comprueba el refactor contra TypeScript y Vite. No demuestra que los endpoints respondan ni que el JSON coincida con los DTO.

### Interacción 4 · Generar el primer test

#### Estado de la skill

Agent Harness Kit `2.11.0` materializa `ahk-test`. La clase lee la skill antes de invocarla y conserva como decisiones humanas la matriz y el alcance.

#### Momento y motivo

Ocurre después de revisar el adapter y antes del probe real. El agente escribe la carpintería del test a partir de una matriz que el grupo ya decidió.

#### Decisiones humanas previas

- El comportamiento público consiste en conservar `externalId` y `mediaType`.
- La matriz contiene un caso de película y uno de serie.
- El test es unitario, no usa backend y no autoriza cambios de producción.

#### Prompt listo para copiar

```text
Usa la skill ahk-test para crear y ejecutar tests de comportamiento de toMediaDetailSearchParams.

Matriz acordada:
1. { externalId: "438631", mediaType: "movie" } conserva ambos parámetros.
2. { externalId: "1399", mediaType: "series" } conserva ambos parámetros.

Alcance único:
- crear src/adapters/__tests__/media-input-to-params.test.ts;
- producción, package.json, configuración y dependencias permanecen en solo lectura;
- no usar snapshots, mocks, .only, .skip o .todo.

Ejecuta pnpm exec vitest run src/adapters/__tests__/media-input-to-params.test.ts. Si la firma, la matriz o la configuración contradicen el repositorio, detente antes de escribir. Entrega matriz, archivos, comando con exit status y frontera de evidencia.
```

#### Salida esperada y condición de parada

Solo se crea el archivo de test permitido. Si la firma real no coincide con la matriz o Vitest no está configurado, el agente se detiene y reporta la diferencia sin modificar producción ni configuración.

#### Lectura posterior

El estudiante identifica Arrange, Act y Assert sin exigir comentarios con esos nombres. Debe explicar por qué el test no necesita mocks y por qué no prueba `fetch`.

#### Evidencia y frontera

- Vitest verde demuestra los dos comportamientos del adapter.
- `pnpm build` demuestra compatibilidad estática y build.
- Network demuestra método, URL, payload, status y response de los requests reales.
- Ninguna de estas comprobaciones demuestra autenticación o estado remoto en la interfaz.

## Secuencia de 90 minutos

| Tiempo | Responsable | Actividad y comprobación |
| --- | --- | --- |
| 0-7 min | Docente y grupo | Recuperar el flujo local, buscar un título ausente y formular la limitación del fixture. |
| 7-18 min | Docente | Usar el deck para explicar API, endpoint, request, response, Promise, errores y DTO frente a modelo visual. |
| 18-33 min | Docente y estudiantes | Instalar e inicializar AHK, revisar materialización y health, y ejecutar la interacción 1 con `ahk-ask`. |
| 33-41 min | Grupo y agente | Cerrar la tabla de campos, ejecutar la interacción 2 y auditar types, adapter y build. |
| 41-51 min | Docente con participación | Implementar `searchMedia()` y recorrer body, `await`, `response.ok` y tipo de retorno. |
| 51-59 min | Práctica guiada | Completar `getMediaDetail()` con el adapter de parámetros y marcar la repetición. |
| 59-65 min | Grupo y agente | Ejecutar la interacción 3, revisar el refactor a `requestJson<T>` y confirmar el build. |
| 65-76 min | Estudiantes y agente | Cerrar la matriz, invocar `ahk-test`, leer el test y correr Vitest enfocado. |
| 76-85 min | Estudiantes | Ejecutar `ApiProbe`, inspeccionar ambos requests en Network y retirar el código temporal. |
| 85-90 min | Docente y grupo | Volver al deck, ejecutar el cierre conceptual y conectar el checkpoint con TanStack Query. |

La suma es de 90 minutos.

## Actividades del docente

- Preparar provider, respuestas de `ahk init`, versiones y contingencia antes de la sesión.
- Entregar un contrato reducido compatible con el backend y excluir anime.
- Separar decisión humana de escritura mecánica en la tabla de campos.
- Explicar el primer fetcher completo en lugar de delegar el concepto nuevo.
- Preguntar qué se repite antes de permitir la extracción del helper.
- Revisar el diff producido por el agente en pantalla.
- Pedir que el grupo prediga los tests antes de invocar `ahk-test`.
- Inspeccionar Network y distinguir esa evidencia del test unitario.
- Retirar `ApiProbe` y comprobar que la interfaz local continúa funcionando.

## Actividades de los estudiantes

- Reconstruir el recorrido local y señalar la limitación del fixture.
- Completar la tabla de campos desde el contrato.
- Verificar la salida de `ahk-ask` en los archivos reales.
- Leer los types generados y contrastar nombres y nulabilidad.
- Completar `getMediaDetail()` siguiendo el primer fetcher.
- Marcar la repetición antes del refactor asistido.
- Leer `requestJson<T>` y explicar qué no valida.
- Definir la matriz del adapter antes de generar tests.
- Ejecutar Vitest, build y probe en Network.
- Explicar una cosa que cada comprobación no demuestra.

## Evidencia de salida

- `ahk doctor` reconoce la configuración y las skills materializadas del provider elegido.
- `ahk health` ejecuta `pnpm test` y `pnpm build` con exit status 0.
- `.env.example` declara `VITE_API_URL` sin secretos.
- `MediaType` continúa restringido a `movie | series`.
- `media-api.ts` conserva nombres, tipos y nulabilidad de los campos acordados.
- `searchMedia()` envía POST con body JSON.
- `getMediaDetail()` envía GET con `externalId` y `mediaType`.
- `toMediaDetailSearchParams()` conserva ambos valores y no solicita datos.
- `requestJson<T>` aparece después de dos implementaciones concretas.
- El test enfocado termina con exit status 0.
- Network muestra ambos requests reales.
- `ApiProbe` fue retirado.
- El explorador local sigue funcionando.
- `pnpm build` termina con exit status 0.
- El estudiante puede explicar qué decidió, qué delegó, qué leyó y qué verificó.

## Errores frecuentes y respuesta docente

### “¿El agente puede elegir los campos por nosotros?”

No en esta actividad. Elegir campos exige comprender qué devuelve la API y qué consumirá la aplicación. El agente recibe esa decisión y escribe la parte repetitiva.

### “¿El build verde significa que el JSON coincide?”

No. TypeScript comprueba el código local. El cast final no inspecciona el response durante runtime.

### “¿Por qué `fetch` no entra al catch con un 404?”

El navegador sí recibió una response. El código consulta `response.ok` para decidir si el status representa éxito.

### “¿Por qué el test no llama al backend?”

El caso protege una transformación pura. Network cubre el request real y la sesión 08 cubrirá la integración con estado remoto.

### “¿Por qué el prompt de `ahk-test` todavía incluye límites?”

La skill conserva una rutina, pero no conoce el oráculo ni el alcance particular de esta clase. El grupo aporta la matriz, el archivo permitido y la comprobación enfocada.

### “¿Por qué no guardamos el resultado en `useState`?”

La sesión 08 introduce TanStack Query cuando la response entra a la interfaz y necesita carga, error, vacío y caché.

## Vocabulario

- **Cliente:** programa que inicia un request; aquí es la aplicación del navegador.
- **Servidor:** sistema que recibe el request y produce una response.
- **API:** contrato mediante el cual otro programa solicita una operación.
- **Endpoint:** combinación de método y ruta.
- **Request:** solicitud enviada al servidor.
- **Response:** respuesta HTTP con status, headers y body.
- **Query string:** parámetros escritos después de `?` en una URL.
- **Serialización:** conversión de un valor a un formato transportable.
- **Promise:** objeto que representa un resultado disponible después.
- **DTO:** estructura que cruza la frontera entre cliente y servidor.
- **Adapter:** función que traduce una representación a otra.
- **Runtime:** momento en que JavaScript se ejecuta.
- **Harness:** estructura que limita roles, herramientas, memoria y evidencia.
- **Skill:** instrucción reutilizable para una tarea concreta.
- **Matriz de tests:** lista de comportamientos, entradas y resultados esperados.
- **Evidencia:** resultado ejecutado que respalda una afirmación limitada.
- **Frontera de evidencia:** aquello que una comprobación todavía no demuestra.

## Fuera del alcance

- TanStack Query, query keys y caché.
- `MediaSearchCardModel` y `toMediaSearchCardModel()`.
- Reemplazar el fixture por responses remotas.
- Estados visuales de carga, error, vacío y éxito remoto.
- `useEffect` para fetching.
- Guardar responses en React, Zustand o `localStorage`.
- Autenticación y token Bearer.
- Validación runtime del JSON con Zod.
- `HttpError`, retry, timeout, cancelación y `AbortSignal`.
- Tests de componentes, hooks o requests.
- Backlog, dashboard, base de datos y flujo completo de cinco roles del harness.
- Swagger, OpenAPI generado y `api.d.ts` como material estudiantil.
- Cambios de backend realizados por estudiantes.

## Referencias docentes

- [Agent Harness Kit · paquete npm](https://www.npmjs.com/package/@cardor/agent-harness-kit)
- [Agent Harness Kit · repositorio oficial](https://github.com/enmanuelmag/agent-harness-kit)
- [Vitest · Testing in Practice](https://vitest.dev/guide/learn/testing-in-practice)
- [Vitest · Writing Tests with AI](https://main.vitest.dev/guide/learn/writing-tests-with-ai)
- [MDN · `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
- [MDN · `Response.ok`](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
- [Vite · Variables de entorno y modos](https://vite.dev/guide/env-and-mode)
- [TypeScript · Type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

Fuentes HTTP y Vitest verificadas el 31 de agosto de 2026. Agent Harness Kit `2.11.0` se verificó el 5 de septiembre de 2026 mediante el registro npm, el paquete publicado y el repositorio oficial. Context7 no devolvió un identificador exacto para AHK y el índice Mintlify no estuvo disponible; se usaron esas fuentes oficiales como respaldo.
