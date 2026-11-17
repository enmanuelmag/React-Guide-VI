# Guía docente · Sesión 08 · TanStack Query y búsqueda remota

- **Semana:** 4.
- **Modalidad:** virtual.
- **Duración:** 90 minutos.
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md).
- **Punto de entrada y checkpoint completo:** [session-draft.md](session-draft.md).

## Propósito de la guía

Conducir una sesión virtual de 90 minutos que integra por primera vez una response remota en la interfaz. El grupo construye Query Client, query keys, hook y formulario; el agente solo puede producir el componente presentacional una vez cerrado su contrato.

No conviertas esta clase en una panorámica completa de TanStack Query. La dificultad es una búsqueda declarativa con identidad y estados observables.

### Analogía pedagógica que debes usar

Compara la caché con una mesa de estudio en una biblioteca. La biblioteca remota conserva los libros; la mesa guarda temporalmente las copias que ya pediste. La **query key** funciona como la signatura completa: “Dune/película” y “Dune/serie” ocupan lugares distintos. La **query function** es el procedimiento para solicitar el material cuando no está disponible o debe actualizarse. `staleTime` es el tiempo durante el cual aceptas la copia de la mesa como suficientemente reciente.

Marca el límite: la caché no es una base de datos permanente y “stale” no significa “incorrecto”. Significa que la librería puede volver a comprobar el origen según sus reglas.

## Preparación docente

Antes de la clase:

- Parte del checkpoint exacto de la sesión 07.
- Comprueba Node `>=22.22.0` y pnpm `11.17.0`.
- Comprueba que `searchMedia()` acepta `SearchMediaInput` y devuelve `Promise<MediaSearchItemDto[]>`.
- Comprueba que `MediaType` se importa desde `src/types/media-item.ts`.
- Confirma que el `ApiProbe` temporal no está montado.
- Confirma `VITE_API_URL=https://bootcamp-medialog.cardor.dev` en `.env.local`; esta URL pública no es un secreto.
- Prepara una búsqueda con resultados, una vacía y una forma controlada de observar error.
- Abre Network y deja disponible React DevTools.
- Ten capturas de respaldo de Network y Query Devtools.
- Comprueba que el agente puede limitarse a un archivo; prepara el fallback manual de `MediaSearchResults`.
- No adelantes Router, detalle remoto, Zustand, Zod ni autenticación.

Versiones fijadas:

```text
@tanstack/react-query              5.102.8
@tanstack/react-query-devtools     5.102.8
```

Estas versiones fueron verificadas el 31 de agosto de 2026. Antes de otra cohorte, vuelve a comprobar compatibilidad y propaga cualquier cambio de forma coordinada.

## Respuestas de la lectura previa

1. **B.** El texto y el tipo cambian el resultado de la búsqueda, por eso ambos deben formar parte de la key. Fuente: `Query Keys`, sección sobre variables usadas por la función.
2. **Falso.** Película y serie representan recursos diferentes. Fuente: `Query Keys`, secciones sobre variables y keys únicas.
3. **A.** Una query sin datos y todavía deshabilitada puede estar pending e idle. Fuente: `Disabling/Pausing Queries`, estado inicial deshabilitado.
4. **C.** En una lazy query, `isLoading` indica que la primera petición está en curso. Fuente: `Disabling/Pausing Queries`, sección `isLoading`.
5. **Verdadero.** Los valores que cambian el resultado deben formar parte de la key; al cambiarla, la query usa los nuevos parámetros de forma declarativa. Fuente: `Query Keys`, sección sobre variables usadas por la función.

Pregunta de recuperación:

> Si `queryFn` cambia su resultado cuando cambia una variable, ¿dónde debe aparecer esa variable?

Respuesta esperada: en la query key.

## Resultado observable

La clase termina solo si el grupo puede demostrar:

1. Inicio sin request.
2. Escritura sin request.
3. Submit válido con request.
4. Keys distintas por texto y tipo.
5. Estado de carga real, error, vacío y éxito.
6. DTO conservado en Query y modelo visual derivado.
7. Reutilización de una key fresca.
8. Ausencia de selección, modal remoto y Router.

## Mapa de responsabilidades

Mantén visible esta tabla durante la construcción:

| Dato o decisión | Propietario |
| --- | --- |
| `draftQuery` | React local |
| `draftMediaType` | React local |
| `submittedSearch` | React local |
| response, error y caché | TanStack Query |
| request HTTP | `searchMedia()` |
| traducción DTO → tarjeta | Adapter puro |
| lista visual | Componente presentacional |
| URL pública | Sesión 09 |
| detalle remoto | Sesión 10 |

## Agenda exacta

| Tiempo | Minutos | Actividad | Condición de avance |
| --- | ---: | --- | --- |
| 0–18 | 18 | Presentación continua: estado remoto, Query Client, key/function, caché y estados | Conceptos conectados sin abrir el editor. |
| 18–28 | 10 | Instalación, client y provider | Devtools observa el client. |
| 28–42 | 14 | Keys y hook | Query idle antes del submit. |
| 42–55 | 13 | Borrador y submit | Escribir no ejecuta; enviar sí. |
| 55–68 | 13 | Modelo, adapter y agente | Un archivo presentacional revisado. |
| 68–79 | 11 | Cinco estados | Ramas visibles y ordenadas. |
| 79–86 | 7 | Experimento de caché | Network y caché diferenciados. |
| 86–90 | 4 | Build y cierre | Exit ticket respondido. |

Total: **90 minutos**.

## Bloque 1 · Presentación continua · 0–18

Presenta el deck completo antes de abrir el editor. La recuperación y la teoría de los dos apartados siguientes son notas para narrar las diapositivas, no pausas para alternar con código.

**Apoyo visual opcional, después del deck y antes del coding:** [Animación 01 · Búsqueda y caché](01-animacion-busqueda-cache/README.md). Sustituye parte de la explicación dentro de estos 18 minutos; no suma otro bloque. Usa el recorrido «Resultados» como base. En el hito 03 muestra que escribir no genera POST; en 15 contrasta borrador series con pedido y tarjetas movie; en 19 comprueba dos entradas frescas y solo dos peticiones. Pregunta qué cambió al escribir, por qué el tipo pertenece a la key y quién conserva los DTO. Respuestas: borrador local, identidad de resultados distintos y TanStack Query. Vacío y error son recorridos alternativos. El recurso es una simulación reversible, no evidencia de React Query ni del backend real. Conserva el editor para el bloque siguiente.

### Apertura observable

Pide a una persona que:

1. Busque un título del fixture local.
2. Abra y cierre el modal local.
3. Muestre `searchMedia()` sin ejecutarlo desde un componente.

Di:

> Tenemos interfaz local y transporte remoto, pero todavía no tenemos una política para poseer la response. Hoy resolvemos esa frontera.

No abras la clase instalando una librería. Primero muestra la necesidad.

### Recuperación de la lectura

Escribe:

```text
Dune + movie
Dune + series
```

Pregunta:

- ¿Devuelven necesariamente los mismos datos?
- ¿Qué variable cambia?
- ¿Qué daño causaría guardarlos bajo la misma identidad?

Luego dibuja:

```text
borrador local → submit local → identidad remota → response remota
```

### Checkpoint intermedio

El grupo debe colocar `draftQuery`, `draftMediaType` y `submittedSearch` en React; response, error y caché en TanStack Query.

## Notas de presentación · teoría mínima

### Explicación oral

Define una query como una descripción declarativa de datos remotos. Evita decir que Query “hace fetch mágicamente”. La query function sigue siendo una función asíncrona normal; Query coordina cuándo la ejecuta y cómo identifica el resultado.

Presenta la pareja:

```text
queryKey: ["media", "search", { query: "Dune", mediaType: "movie" }]
queryFn:  () => searchMedia({ query: "Dune", mediaType: "movie" })
```

Contraste incorrecto:

```text
queryKey: ["media", "search"]
queryFn:  () => searchMedia({ query, mediaType })
```

Pregunta qué variables faltan en la identidad. No menciones invalidaciones.

### `status` frente a `fetchStatus`

Usa una matriz reducida:

| Situación | `status` | `fetchStatus` | UI principal |
| --- | --- | --- | --- |
| Sin submit ni datos | pending | idle | Instrucción inicial |
| Primera petición | pending | fetching | Loading |
| Error | error | idle | Error |
| Datos disponibles | success | idle o fetching | Resultado |

Explica:

```text
isLoading = isPending && isFetching
```

Por eso `isPending` aislado no controla el spinner de una lazy query.

### Fresh frente a stale

`staleTime` no significa “borrar después”. Durante cinco minutos, la entrada se considera fresca y puede reutilizarse sin una petición automática en el experimento. No enseñes `gcTime` en esta sesión.

### Checkpoint intermedio

Pregunta: “¿Puede una query estar pending sin estar fetching?”. La respuesta debe ser sí, cuando todavía no tiene datos y permanece deshabilitada.

## Bloque 2 · Instalación y provider · 18–28

### Instalar versiones exactas

```bash
pnpm add @tanstack/react-query@5.102.8
pnpm add @tanstack/react-query-devtools@5.102.8
```

No uses `latest` en la guía ni instales Devtools globalmente.

### Editar `src/main.tsx`

Adapta los imports existentes sin retirar `StrictMode`, Mantine ni estilos:

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import App from "./App"

import "@mantine/core/styles.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <App />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

Si el seed ya tiene otro orden de estilos o configuración de tema, consérvalo. La responsabilidad nueva es un client estable fuera del render.

### Error intencional breve

Pregunta qué pasaría si `new QueryClient()` estuviera dentro de `App`: un render podría reemplazar el client y perder la continuidad esperada de la caché. No ejecutes el error si consume tiempo.

### Evidencia

- La aplicación monta.
- El botón de Devtools aparece.
- Abrir el panel no muestra todavía una búsqueda ejecutada.

## Bloque 3 · Query keys y hook · 28–42

### Crear `src/hooks/media-keys.ts`

```ts
import type { SearchMediaInput } from "../types/media-api"

export const mediaKeys = {
  all: ["media"] as const,
  searches: () => [...mediaKeys.all, "search"] as const,
  search: (search: SearchMediaInput) =>
    [
      ...mediaKeys.searches(),
      {
        query: search.query.trim(),
        mediaType: search.mediaType,
      },
    ] as const,
}
```

Haz que el grupo lea la salida antes de crear el hook. `trim()` estabiliza espacios externos; no agregues lowercase porque eso cambiaría un parámetro que el endpoint todavía recibe con su capitalización original.

### Crear `src/hooks/features/use-media.ts`

Explica la decisión antes de escribir: `useMediaSearch` representa el caso de uso de buscar. La pantalla entrega los parámetros y recibe la query; no repite en su JSX la configuración de key, fetcher y `enabled`.

El archivo agrupa los hooks de la entidad Media. Hoy solo exporta `useMediaSearch`; las sesiones siguientes añadirán sus propios casos cuando se necesiten. Tener un archivo común no significa crear un único hook con modos ni compartir automáticamente el estado entre llamadas: la caché compartida depende de Query Client y de las keys.

La extracción permite reutilizar el contrato y probar el hook separadamente con su entorno de Query. Si la lógica estuviera dentro de un componente, también podría probarse mediante ese componente. Esta sesión no instala herramientas de testing de hooks.

Referencia docente: React, [reutilizar lógica con hooks](https://react.dev/learn/reusing-logic-with-custom-hooks), consultada mediante Context7 el 5 de septiembre de 2026.

```ts
import { useQuery } from "@tanstack/react-query"

import { searchMedia } from "../../api/media"
import type { SearchMediaInput } from "../../types/media-api"
import { mediaKeys } from "../media-keys"

export function useMediaSearch(search: SearchMediaInput | null) {
  const normalizedSearch: SearchMediaInput = {
    query: search?.query.trim() ?? "",
    mediaType: search?.mediaType ?? "movie",
  }

  return useQuery({
    queryKey: mediaKeys.search(normalizedSearch),
    queryFn: () => searchMedia(normalizedSearch),
    enabled: normalizedSearch.query.length >= 2,
  })
}
```

### Preguntas de control

- ¿Por qué existe un input normalizado incluso antes del submit?
- ¿Por qué la query function recibe exactamente los valores de la key?
- ¿Qué condición visible habilita la query?
- ¿Por qué no usamos `refetch()`?

Respuesta clave: el submit cambiará `search`; Query observará una nueva identidad habilitada.

### Evidencia

Monta temporalmente el hook con `null` desde `App` solo si hace falta inspeccionarlo. Devtools puede mostrar una query idle; Network no debe mostrar request.

## Bloque 4 · Borrador y submit · 42–55

### Estado local mínimo

En `App.tsx`, conserva la estructura visual necesaria y agrega:

```tsx
import { useState, type FormEvent } from "react"

import type { SearchMediaInput } from "./types/media-api"
import type { MediaType } from "./types/media-item"

const [draftQuery, setDraftQuery] = useState("")
const [draftMediaType, setDraftMediaType] =
  useState<MediaType>("movie")
const [submittedSearch, setSubmittedSearch] =
  useState<SearchMediaInput | null>(null)

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const query = draftQuery.trim()

  if (query.length < 2) {
    return
  }

  setSubmittedSearch({
    query,
    mediaType: draftMediaType,
  })
}
```

### Transición visual desde el catálogo local

En 06 usamos Mantine para el modal; en 07 conservamos esa interfaz. Ahora la nueva búsqueda incorpora controles, distribución y feedback del toolkit. El provider y los estilos ya están instalados: no se repite su configuración ni se rediseña el catálogo anterior.

Una primitive es una pieza básica de composición: `Container` limita el ancho, `Stack` distribuye verticalmente y `Group` agrupa horizontalmente. `TextInput`, `Select` y `Button` presentan controles; React conserva borrador y submit, y Query conserva el estado remoto. El elemento HTML `<form>` mantiene la semántica y el envío. `Card` y `Badge` presentan los resultados; `Loader` y `Alert` comunican carga y error. Desde esta sesión, las pantallas nuevas priorizan Mantine cuando ofrece una pieza apropiada, conservando HTML semántico y componentes propios con una responsabilidad útil.

| Necesidad | Herramienta |
| --- | --- |
| Semántica del documento | HTML, como `<form>` y encabezados. |
| Diseño propio de un componente | CSS y `className`, aplicado a su raíz. |
| Estilizar una parte interna de Mantine | `classNames`, mapa de selectores de su Styles API a clases CSS. |
| Distribución habitual | `Container`, `Stack` y `Group`, según los ejemplos de esta guía. |

Por ejemplo, `className="search-field"` identifica la raíz de un `TextInput`; `classNames={{ input: "search-field-input" }}` aplica una clase al input interno. Son alternativas para una necesidad de estilo, no archivos CSS nuevos que debas añadir al checkpoint. HTML/CSS siguen siendo útiles para semántica y personalización.

El `MediaTypeBadge` anterior se conserva con el catálogo local. La nueva lista usa `Badge` para mostrar tipo y pertenencia a biblioteca. No añadimos una migración del wrapper al ejercicio de Query: si luego se reutiliza ese componente de dominio, su implementación visual puede cambiar conservando su contrato.

El fallback manual es material preparado para leer y usar si falla el agente. No requiere otra actividad de maquetación ni resuelve consultas, estados remotos o navegación.

Referencia docente: [Mantine Styles API](https://mantine.dev/styles/styles-api/), consultada el 5 de septiembre de 2026.

### Formulario

Presenta los controles de Mantine al leer este formulario; conserva sus responsabilidades de React:

```tsx
<form onSubmit={handleSubmit}>
  <TextInput
    label="Título"
    minLength={2}
    onChange={(event) => setDraftQuery(event.currentTarget.value)}
    placeholder="Dune"
    value={draftQuery}
  />

  <Select
    allowDeselect={false}
    data={[
      { label: "Película", value: "movie" },
      { label: "Serie", value: "series" },
    ]}
    label="Tipo"
    onChange={(value) => {
      if (value === "movie" || value === "series") {
        setDraftMediaType(value)
      }
    }}
    value={draftMediaType}
  />

  <Button disabled={draftQuery.trim().length < 2} type="submit">
    Buscar
  </Button>
</form>
```

No añadas `all`: no pertenece a `MediaType` ni al endpoint.

### Conectar el hook

```tsx
const mediaSearch = useMediaSearch(submittedSearch)
```

### Prueba guiada

1. Abre Network y limpia la lista.
2. Escribe `Dune` lentamente.
3. Cambia a serie.
4. Confirma cero requests.
5. Envía.
6. Identifica la key y el request.

Si aparece un request al escribir, busca una query dependiente del borrador o un Effect. No lo maquilles con debounce; corrige el propietario.

## Bloque 5 · Modelo, adapter y agente · 55–68

### Decisión humana: contrato visual

Crea `src/types/media-search-card-model.ts` manualmente:

```ts
import type { MediaType } from "./media-item"

export type MediaSearchCardModel = {
  key: string
  externalId: string
  mediaType: MediaType
  title: string
  releaseLabel: string
  posterUrl: string | null
  isLogged: boolean
}
```

Explica que `key` es identidad de React para esta lista. La identidad pública sigue siendo la pareja `mediaType + externalId`.

### Implementar el adapter manualmente

Crea `src/adapters/media-search-item-to-card-model.ts`:

```ts
import type { MediaSearchItemDto } from "../types/media-api"
import type { MediaSearchCardModel } from "../types/media-search-card-model"

export function toMediaSearchCardModel(
  dto: MediaSearchItemDto,
): MediaSearchCardModel {
  return {
    key: `${dto.mediaType}:${dto.externalId}`,
    externalId: dto.externalId,
    mediaType: dto.mediaType,
    title: dto.title,
    releaseLabel:
      dto.releaseYear > 0 ? String(dto.releaseYear) : "Fecha desconocida",
    posterUrl: dto.coverUrl,
    isLogged: dto.isLogged,
  }
}
```

No delegues este adapter: materializa la frontera conceptual de la clase.

### Rutina asistida

1. Intenta consultar Context7 solo si necesitas confirmar una API externa.
2. Revisa skills disponibles y `skills-lock.json`.
3. Usa AutoSkills únicamente si falta una skill pertinente; no es una dependencia React.
4. Ejecuta la tarea dentro de Agent Harness Kit con un archivo permitido.
5. Lee el archivo, revisa el diff y ejecuta evidencia.

### Prompt completo

```text
Objetivo: implementar únicamente el componente presentacional de resultados remotos.

Archivo permitido:
- src/components/media-search-results.tsx

Contrato ya decidido:
- exporta MediaSearchResults
- recibe props { items: MediaSearchCardModel[] }
- renderiza una tarjeta por item
- usa item.key como React key
- muestra title, releaseLabel y un label para movie o series
- muestra la portada cuando posterUrl no es null
- muestra un fallback textual accesible cuando posterUrl es null
- puede mostrar un badge si isLogged es true

Cambios prohibidos:
- no modificar ningún otro archivo
- no añadir fetch, useQuery, query keys, Effects ni estado
- no añadir selección, onSelect, botones de detalle, modal o navegación
- no cambiar tipos, dependencias ni estilos globales
- no usar externalId aislado como key

Salida esperada:
- un componente tipado que solo presenta items
- imports compatibles con los componentes Mantine ya instalados
- pnpm build ejecutado al finalizar

Condición de parada:
- detente después de informar el archivo modificado, el resultado de pnpm build y cualquier limitación; no intentes corregir otros archivos.
```

### Revisión obligatoria

Pide al grupo localizar:

- el tipo de props;
- el `map`;
- la key;
- el fallback sin portada;
- la ausencia de hooks, estado y navegación.

Ejecuta:

```bash
git diff -- src/components/media-search-results.tsx
pnpm build
```

El build solo comprueba el estado actual. Después de conectar los cinco estados habrá que repetirlo.

### Fallback manual

Si no puedes usar el agente, crea `src/components/media-search-results.tsx` manualmente:

```tsx
import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core"

import type { MediaSearchCardModel } from "../types/media-search-card-model"

type MediaSearchResultsProps = {
  items: MediaSearchCardModel[]
}

export function MediaSearchResults({
  items,
}: MediaSearchResultsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {items.map((item) => (
        <Card key={item.key} padding="lg" radius="md" withBorder>
          <Card.Section>
            {item.posterUrl === null ? (
              <Box
                aria-label={`Sin portada para ${item.title}`}
                bg="gray.1"
                h={240}
              >
                <Text ta="center" pt="xl">
                  Sin portada
                </Text>
              </Box>
            ) : (
              <Image
                alt={`Portada de ${item.title}`}
                h={240}
                src={item.posterUrl}
              />
            )}
          </Card.Section>

          <Stack gap="xs" mt="md">
            <Text fw={700}>{item.title}</Text>
            <Group gap="xs">
              <Badge variant="light">
                {item.mediaType === "movie" ? "Película" : "Serie"}
              </Badge>
              <Text c="dimmed" size="sm">
                {item.releaseLabel}
              </Text>
              {item.isLogged ? <Badge color="green">En biblioteca</Badge> : null}
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
```

El fallback es una implementación completa, no una segunda tarea adicional.

## Bloque 6 · Cinco estados · 68–79

### Derivar la lista

```tsx
const items = (mediaSearch.data ?? []).map(toMediaSearchCardModel)
```

Pregunta por qué no existe `setItems`. Respuesta: los items se calculan desde el DTO que Query ya conserva.

### Componente de estado

Puedes mantener la lógica en `App` para que Router justifique extraer `SearchPage` en la sesión 09:

```tsx
function renderSearchContent() {
  if (submittedSearch === null) {
    return <Text>Escribe un título y confirma la búsqueda.</Text>
  }

  if (mediaSearch.isLoading) {
    return <Loader aria-label="Buscando títulos" />
  }

  if (mediaSearch.isError) {
    const message =
      mediaSearch.error instanceof Error
        ? mediaSearch.error.message
        : "No se pudo completar la búsqueda."

    return <Alert color="red">{message}</Alert>
  }

  if (items.length === 0) {
    return <Text>No encontramos resultados para esta búsqueda.</Text>
  }

  return <MediaSearchResults items={items} />
}
```

No uses `isPending` para loading. No uses un Effect para transformar `data`.

Puede añadirse un indicador secundario:

```tsx
{mediaSearch.isFetching && !mediaSearch.isLoading ? (
  <Text size="sm">Actualizando resultados…</Text>
) : null}
```

No es una sexta pantalla; acompaña datos existentes durante una actualización.

### Comprobaciones

- Sin submit: instrucción.
- Request pendiente: loader.
- Error preparado: alert.
- Response `[]`: vacío.
- Response con elementos: lista.

Si no es viable provocar error o vacío en vivo, usa fixtures de respuesta o capturas preparadas y declara que esa rama no se ejecutó contra el backend.

## Bloque 7 · Experimento de caché · 79–86

Trabajen en parejas:

1. Limpien Network.
2. Busquen `Dune` como película.
3. Anoten la key y el request.
4. Busquen `Dune` como serie.
5. Anoten la segunda key y request.
6. Vuelvan a `Dune` como película antes de cinco minutos.
7. Comparen Devtools y Network.

Preguntas:

- ¿Cuántas entradas de búsqueda existen?
- ¿Qué parte de la key las separa?
- ¿Hubo un nuevo request al volver?
- ¿Qué demuestra Devtools que Network no demuestra?

No garantices “cero requests” si la entrada ya es stale, fue removida o la configuración cambió. En el checkpoint preparado, `staleTime` de cinco minutos vuelve predecible el experimento.

## Bloque 8 · Build y cierre · 86–90

Ejecuta:

```bash
pnpm build
```

El docente registra código de salida y cualquier error exacto. No digas que el build pasó si la salida quedó truncada o el proceso no terminó.

### Exit ticket

Cada estudiante responde:

1. ¿Qué valores locales forman la búsqueda confirmada?
2. ¿Qué variables forman la query key?
3. ¿Quién conserva el DTO remoto?
4. ¿Por qué `isPending` no controla por sí solo el spinner inicial?
5. ¿Qué evidencia distingue caché de request?

### Puente

Di:

> Ya podemos obtener y reutilizar resultados remotos, pero una tarjeta todavía no tiene una dirección compartible. La siguiente sesión hará visible esa necesidad con URLs y páginas. El detalle remoto esperará hasta que la ruta exista.

## Errores frecuentes y respuesta docente

| Síntoma | Causa probable | Intervención |
| --- | --- | --- |
| Se consulta al escribir | El hook recibe el borrador | Pasar `submittedSearch` al hook. |
| Película y serie comparten datos | Falta `mediaType` en la key | Incluir todas las variables de `queryFn`. |
| Spinner antes del submit | Se usa `isPending` aislado | Usar rama inicial y después `isLoading`. |
| Se llama `refetch(search)` | Modelo imperativo | Cambiar `submittedSearch`; `refetch` no recibe esos parámetros. |
| La opción `all` llega al fetcher | Contrato local filtrado reutilizado | Limitar el formulario remoto a `MediaType`. |
| Se guarda `data` en estado | Fuente de verdad duplicada | Derivar con `map` durante render. |
| Se usa `as MediaItem` | Se ocultó una incompatibilidad | Definir modelo visual y adapter explícito. |
| Query Client se recrea | Está dentro de un componente | Moverlo al ámbito del módulo. |
| El agente añade navegación | Alcance insuficiente | Rechazar cambios fuera del archivo/contrato. |
| Volver siempre solicita | Entrada stale o key distinta | Revisar key, `staleTime` y tiempo transcurrido. |

## Plan de contingencia temporal

Si faltan 10 minutos al llegar al adapter:

- Conserva construcción manual de key, hook, borrador y submit.
- Entrega el archivo presentacional de respaldo.
- Conecta al menos inicio, loading, error y éxito.
- Explica vacío con una response `[]` preparada.
- Conserva tres minutos para build y frontera de evidencia.

No recortes la distinción `isPending`/`isLoading`, la identidad por tipo ni el puente hacia Router.

## Guion de presentación futura

### 1. Del fixture al estado remoto

- **Visual:** flujo antes/después.
- **Pregunta:** “¿Dónde viviría una response si no queremos copiarla?”
- **Puente:** introducir Query por necesidad.

### 2. Propietarios distintos

- **Visual:** tabla React/Query/adapter.
- **Contraste:** borrador local frente a response remota.
- **Nota:** Query no reemplaza todo el estado de React.

### 3. Key y function

- **Visual:** dos bloques conectados.
- **Error frecuente:** function usa variables ausentes en la key.
- **Puente:** escribir la familia `mediaKeys`.

### 4. Dos tipos, dos entradas

- **Visual:** keys de Dune película y serie.
- **Pregunta:** “¿Qué dato separa las respuestas?”

### Adopción visual gradual

Contrasta el modal de 06, la continuidad de 07 y el toolkit de 08. Muestra HTML/CSS, primitives y clases como herramientas complementarias. Lee el fallback preparado sin convertirlo en un segundo taller.

### 5. Borrador y submit

- **Visual:** línea temporal de escritura y confirmación.
- **Contraste:** declarativo frente a `refetch()` con parámetros imaginarios.

### 6. Pending e idle

- **Visual:** matriz de estados.
- **Simplificación:** enseñar solo combinaciones necesarias para esta UI.

### 7. DTO → modelo visual

- **Visual:** transformación de nombres y formato.
- **Pregunta:** “¿Por qué este modelo no es otra fuente de verdad?”

### 8. Cinco estados

- **Visual:** cinco wireframes pequeños.
- **Nota:** no mostrar el código final antes de construir las condiciones.

### 9. Devtools y Network

- **Visual:** dos columnas de evidencia.
- **Contraste:** caché presente no implica request nuevo.

### 10. La próxima necesidad

- **Visual:** tarjeta sin URL frente a URL compartible.
- **Límite:** no mostrar implementación de Router ni detalle.

## Fuentes docentes

Verificadas el 31 de agosto de 2026 para TanStack Query v5 React:

- [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys): arrays, variables, hashing e identidad.
- [Disabling/Pausing Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries): lazy queries, `enabled` e `isLoading`.
- [useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery): opciones y estados de retorno.
- [Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools): paquete separado y montaje dentro del provider.

## Checklist docente final

- [ ] Los bloques sumaron 90 minutos.
- [ ] Se recuperó el checkpoint 07 sin reconstruirlo.
- [ ] Query y Devtools usan `5.102.8`.
- [ ] El Query Client es estable y único.
- [ ] Texto y tipo forman la query key.
- [ ] El hook recibe `submittedSearch`, no el borrador.
- [ ] La carga usa `isLoading`.
- [ ] El DTO permanece en Query.
- [ ] El modelo visual se deriva sin estado duplicado.
- [ ] El agente tocó solo el componente permitido.
- [ ] Se leyó el código antes de aceptar el build.
- [ ] Se observaron o delimitaron los cinco estados.
- [ ] Devtools y Network no se presentaron como evidencia equivalente.
- [ ] No aparecieron Router, detalle, modal remoto, Zustand o mutaciones.
- [ ] El build final terminó con salida explícita.


## Ruta ejecutable y referencia autosuficiente

Esta es la secuencia real de ramas del proyecto progresivo:

`session-08-start` → `session-08-step-01-query-provider` → `session-08-step-02-query-identity` → `session-08-step-03-submitted-search` → `session-08-step-04-results-adapter` → `session-08-end`

La rama `session-08-end` es el checkpoint completo. Cada rama intermedia compila y permite retomar la demostración desde una transformación concreta. Los archivos que no aparecen aquí se conservan sin cambios desde la sesión anterior.

Ejecuta la instalación de esta sesión exactamente así:

```bash
pnpm add --save-exact @tanstack/react-query@5.102.8 @tanstack/react-query-devtools@5.102.8
```

El lockfile lo genera pnpm. No lo escribas a mano. A continuación están **completos** todos los archivos que el docente o el estudiante debe crear o reemplazar durante la sesión; no hace falta abrir el repositorio de referencia en otra ventana.

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
    "@tanstack/react-query": "5.102.8",
    "@tanstack/react-query-devtools": "5.102.8",
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

### `src/main.tsx` · archivo completo

```tsx
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider defaultColorScheme="dark">
        <App />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

### `src/hooks/media-keys.ts` · archivo completo

```ts
import type { SearchMediaInput } from '../types/media-api'

export const mediaKeys = {
  all: ['media'] as const,
  searches: () => [...mediaKeys.all, 'search'] as const,
  search: (input: SearchMediaInput) =>
    [
      ...mediaKeys.searches(),
      {
        query: input.query.trim(),
        mediaType: input.mediaType,
      },
    ] as const,
}
```

### `src/hooks/features/use-media.ts` · archivo completo

```ts
import { useQuery } from '@tanstack/react-query'

import { searchMedia } from '../../api/media'
import type { SearchMediaInput } from '../../types/media-api'
import { mediaKeys } from '../media-keys'

const emptySearch: SearchMediaInput = {
  query: '',
  mediaType: 'movie',
}

export function useMediaSearch(input: SearchMediaInput | null) {
  const normalizedInput =
    input === null
      ? emptySearch
      : {
          query: input.query.trim(),
          mediaType: input.mediaType,
        }

  return useQuery({
    queryKey: mediaKeys.search(normalizedInput),
    queryFn: () => searchMedia(normalizedInput),
    enabled: input !== null && normalizedInput.query.length >= 2,
  })
}
```

### `src/types/media-search-card-model.ts` · archivo completo

```ts
import type { MediaType } from './media-item'

export type MediaSearchCardModel = {
  key: string
  externalId: string
  mediaType: MediaType
  title: string
  releaseLabel: string
  posterUrl: string | null
  isLogged: boolean
}
```

### `src/adapters/media-search-item-to-card-model.ts` · archivo completo

```ts
import type { MediaSearchItemDto } from '../types/media-api'
import type { MediaSearchCardModel } from '../types/media-search-card-model'

export function toMediaSearchCardModel(
  dto: MediaSearchItemDto,
): MediaSearchCardModel {
  return {
    key: `${dto.mediaType}:${dto.externalId}`,
    externalId: dto.externalId,
    mediaType: dto.mediaType,
    title: dto.title,
    releaseLabel:
      dto.releaseYear > 0 ? String(dto.releaseYear) : 'Fecha desconocida',
    posterUrl: dto.coverUrl,
    isLogged: dto.isLogged,
  }
}
```

### `src/components/media-search-results.tsx` · archivo completo

```tsx
import {
  Badge,
  Box,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'

import type { MediaSearchCardModel } from '../types/media-search-card-model'

type MediaSearchResultsProps = {
  items: MediaSearchCardModel[]
}

export function MediaSearchResults(props: MediaSearchResultsProps) {
  const { items } = props

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {items.map((item) => (
        <Card key={item.key} padding="lg" radius="md" withBorder>
          <Card.Section>
            {item.posterUrl === null ? (
              <Box
                aria-label={`Sin portada para ${item.title}`}
                bg="gray.9"
                h={240}
              >
                <Text pt="xl" ta="center">
                  Sin portada
                </Text>
              </Box>
            ) : (
              <Image
                alt={`Portada de ${item.title}`}
                h={240}
                src={item.posterUrl}
              />
            )}
          </Card.Section>

          <Stack gap="xs" mt="md">
            <Text fw={700}>{item.title}</Text>
            <Group gap="xs">
              <Badge variant="light">
                {item.mediaType === 'movie' ? 'Película' : 'Serie'}
              </Badge>
              <Text c="dimmed" size="sm">
                {item.releaseLabel}
              </Text>
              {item.isLogged ? (
                <Badge color="green">En biblioteca</Badge>
              ) : null}
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
```

### `src/App.tsx` · archivo completo

```tsx
import {
  Alert,
  Button,
  Container,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useState, type FormEvent } from 'react'

import { toMediaSearchCardModel } from './adapters/media-search-item-to-card-model'
import { AppHeader } from './components/app-header'
import { MediaSearchResults } from './components/media-search-results'
import { useMediaSearch } from './hooks/features/use-media'
import type { SearchMediaInput } from './types/media-api'
import type { MediaType } from './types/media-item'

function App() {
  const [draftQuery, setDraftQuery] = useState('')
  const [draftMediaType, setDraftMediaType] =
    useState<MediaType>('movie')
  const [submittedSearch, setSubmittedSearch] =
    useState<SearchMediaInput | null>(null)

  const mediaSearch = useMediaSearch(submittedSearch)
  const items = (mediaSearch.data ?? []).map(toMediaSearchCardModel)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const query = draftQuery.trim()

    if (query.length < 2) {
      return
    }

    setSubmittedSearch({
      query,
      mediaType: draftMediaType,
    })
  }

  function renderSearchContent() {
    if (submittedSearch === null) {
      return <Text>Escribe un título y confirma la búsqueda.</Text>
    }

    if (mediaSearch.isLoading) {
      return <Loader aria-label="Buscando títulos" />
    }

    if (mediaSearch.isError) {
      const message =
        mediaSearch.error instanceof Error
          ? mediaSearch.error.message
          : 'No se pudo completar la búsqueda.'

      return <Alert color="red">{message}</Alert>
    }

    if (items.length === 0) {
      return <Text>No encontramos resultados para esta búsqueda.</Text>
    }

    return <MediaSearchResults items={items} />
  }

  return (
    <>
      <AppHeader />

      <Container component="main" py="xl" size="md">
        <Stack gap="xl">
          <div>
            <Title order={2}>Busca en el catálogo remoto</Title>
            <Text c="dimmed">
              Confirma un título y un tipo para consultar la API.
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Título"
                minLength={2}
                onChange={(event) =>
                  setDraftQuery(event.currentTarget.value)
                }
                placeholder="Dune"
                value={draftQuery}
              />

              <Select
                allowDeselect={false}
                data={[
                  { label: 'Película', value: 'movie' },
                  { label: 'Serie', value: 'series' },
                ]}
                label="Tipo"
                onChange={(value) => {
                  if (value === 'movie' || value === 'series') {
                    setDraftMediaType(value)
                  }
                }}
                value={draftMediaType}
              />

              <Group justify="flex-end">
                <Button
                  disabled={draftQuery.trim().length < 2}
                  type="submit"
                >
                  Buscar
                </Button>
              </Group>
            </Stack>
          </form>

          {mediaSearch.isFetching && !mediaSearch.isLoading ? (
            <Text size="sm">Actualizando resultados…</Text>
          ) : null}

          {renderSearchContent()}
        </Stack>
      </Container>
    </>
  )
}

export default App
```

### Comprobación del checkpoint

```bash
pnpm test
pnpm build
pnpm lint
```

Lee la salida completa. Un código de salida 0 comprueba tests, tipos, generación y lint del estado local; no demuestra por sí solo que el backend publicado esté disponible ni que la navegación se haya probado en un navegador.
