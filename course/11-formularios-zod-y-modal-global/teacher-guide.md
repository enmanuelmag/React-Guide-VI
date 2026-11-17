# Guía docente · Sesión 11 · Formularios, Zod y modal global

## Resultado y alcance

**Virtual · 90 minutos · semana 5 · lunes 19 de octubre de 2026.** Entrada: `session-11-start`, idéntica a `session-10-end`. Salida: `session-11-end`.

Abriremos el mismo formulario desde búsqueda y detalle. La persona elegirá estado, prioridad y notas; verá errores cuando los datos no cumplan las reglas y preparará un objeto local. Todavía no guardamos nada en el servidor.

Esta guía privada incluye cada archivo que debes crear, sustituir o entregar, con sus imports, tipos, funciones y JSX. Los archivos que cambian de nuevo se repiten completos en su nuevo paso. No necesitas abrir el repositorio de referencia para reconstruir instrucciones. No añadimos CSS: los estilos nuevos están en las props de Mantine que aparecen en cada archivo. `pnpm-lock.yaml` se genera con el comando de instalación, no se transcribe.

Material estudiantil: [guía](student-guide.md), [lectura previa](pre-class-reading.md) y [control posterior](reading-check.md). La [presentación de 28 diapositivas](presentation/index.html) está aprobada. Esta iteración sincroniza el código y la guía con ella.

## Antes de la clase · comprobar sin editar

1. Comprueba que `session-10-end` busca películas y series, abre `/media/:mediaType/:externalId` y restaura el título de la pestaña al salir.
2. Confirma que `https://bootcamp-medialog.cardor.dev` responde y conserva al menos un resultado de película y uno de serie. Los datos temporales de esta guía son ejemplos locales; los botones finales usan los datos del resultado o la URL validada.
3. Ten el deck, esta guía y DevTools preparados. Presentación completa → editor → práctica → cierre oral. No volveremos a las slides durante el coding.
4. Conserva trabajo estudiantil antes de usar un respaldo. `main` del repositorio docente sigue siendo el inicio sin aplicación. Las ramas de solución se distribuyen gradualmente; no publiques todas de golpe.
5. Confirma Node >=22.22.0 y pnpm 11.17.0. Las tres dependencias nuevas se instalan después de las slides, dentro de S11-B02.
6. En Network distingue la búsqueda `POST /api/v2/media/search` de la creación `POST /api/v2/media/create`. Solo esta última debe estar ausente.

## Ruta recuperable y tiempos

| Bloque | Minutos | Medio y responsable | Salida |
| --- | ---: | --- | --- |
| S11-B01 | 0–25 | Presentación continua · docente y preguntas orales | Mapa de responsabilidades y recorrido completo. |
| S11-B02 | 25–35 | Editor · demostración con participación | `step-01-modal-store`: abrir y cerrar con botón temporal. |
| S11-B03 | 35–43 | Editor · integración guiada | `step-02-modal-entrypoints`: búsqueda y detalle abren el mismo modal. |
| S11-B04 | 43–51 | Editor · predicción y comprobación | `step-03-form-schema`: tres entradas pasan por Zod. |
| S11-B05 | 51–65 | Editor · construcción guiada | `step-04-form-fields`: campos, errores y valores válidos. |
| S11-B06 | 65–74 | Editor · práctica guiada | `step-05-body-preview`: datos del medio + campos → body. |
| S11-B07 | 74–81 | Trabajo con agente y lectura humana | `step-06-adapter-tests`: cinco casos del adapter. |
| S11-B08 | 81–87 | Actividad estudiantil | Recorrido comprobado con otro medio y notas propias. |
| S11-B09 | 87–90 | Comprobación y cierre oral | Evidencia y registro para retomar. |

**Suma: 25 + 10 + 8 + 8 + 14 + 9 + 7 + 6 + 3 = 90 minutos.** Es un presupuesto, no un ritmo ya medido con estudiantes. Copiaremos soporte mecánico y lo recorreremos; no pretendemos teclear todos los archivos desde cero. Si faltan minutos, registra el punto comprobado y continúa allí en la siguiente reunión: no adelantes Firebase para cumplir un calendario en papel.

Todas las referencias `step` llevan el prefijo `session-11-`. El cierre conserva el código de step-06 más los materiales públicos.

## Clave privada del control de lectura

| Pregunta | Respuesta | Justificación y fuente |
| ---: | :---: | --- |
| 1 | B | `create` devuelve el hook que permite leer el store. Zustand, `Returns`. |
| 2 | A | El selector escoge la parte que consume el componente. Zustand, `Returns`. |
| 3 | C | El creador recibe `set` para actualizar el estado. Zustand, `Parameters`. |
| 4 | C | Mantine 9 exporta `schemaResolver` desde `@mantine/form`. Mantine, schema validation. |
| 5 | Verdadero | `{ sync: true }` corresponde a reglas síncronas como las de hoy. Mantine, schema validation. |

## S11-B01 · Presentación continua · 0–25

**Entrada:** el catálogo y el detalle ya funcionan. **Responsable:** docente; estudiantes predicen oralmente. No abrir el editor durante este bloque.

| Slides | Qué decir y mostrar | Pregunta y respuesta esperada |
| --- | --- | --- |
| 01–06 | Queremos completar datos del mismo medio desde dos pantallas. Compara con el modal local de 06. Una ficha sobre el mostrador compartido puede leerse desde ambos lados: Zustand conserva tipo e ID; el formulario conserva lo que escribe la persona. La analogía explica coordinación, no persistencia. | «¿Guardamos toda la película en esa ficha?» No: Query ya conserva los datos remotos. |
| 07–12 | `selection` es `null` o contiene tipo e ID. `opened` se calcula. `create` crea el hook, `set` actualiza y el selector elige qué leer. El layout monta un solo modal. | «¿Puede quedar abierto sin medio si lo calculamos desde la selección?» No; evitamos guardar dos valores que podrían contradecirse. |
| 13–15 | El medio ya está elegido. La persona decide estado, prioridad y notas. Un schema es una lista de reglas que el programa puede ejecutar. Tres entradas muestran aceptación y rechazo. | «¿Escribir un tipo inspecciona los datos reales?» No; debe ejecutarse `safeParse` o el resolver. |
| 16–20 | Mantine Form conecta campos y errores. El modo uncontrolled permite escribir sin actualizar `form.values` en cada tecla. El resolver traduce las comprobaciones de Zod a errores de campo. Las etiquetas son españolas; los valores enviados conservan el contrato. | «¿Ver Por ver significa enviar Por ver?» No: el valor es `pending`. |
| 21–26 | `onSubmit` comprueba y entrega valores válidos. El adapter junta tipo e ID con esos campos, recorta notas y cambia vacío por `null`. Editar retira la vista previa anterior. Cerrar desmonta. | «¿Ver JSON significa que quedó guardado?» No: solo preparamos datos locales. |
| 27–28 | La persona decide cinco comportamientos del adapter; el agente redacta tests dentro de ese alcance. Conecta el mapa de herramientas con el resultado que construiremos. | «¿Un test del adapter prueba el modal?» No; el navegador requiere otra comprobación. |

**Fin de la presentación.** Di: «Ahora vamos a construirlo por partes. Primero veremos qué medio se eligió; después añadiremos los campos». Desde aquí permanece en editor y navegador; las preguntas de cierre están escritas al final de esta guía.

## S11-B02 · Un lugar compartido para la selección · 25–35

**Entrada:** `session-11-start`. **Responsable:** docente demuestra; grupo completa `set` y predice `opened`. **Soporte para copiar:** imports, tipos, JSX del modal y layout; se explica su conexión sin pedir memorizar props visuales.

1. Trabaja en la copia de clase desde el cierre 10. Si se necesita recuperar la entrada y el trabajo está guardado:

```bash
git switch session-11-start
pnpm install --frozen-lockfile
```

2. Instala únicamente las versiones acordadas. Core, Hooks y Form de Mantine deben quedar en 9.4.1:

```bash
pnpm add --save-exact zustand@5.0.15 @mantine/form@9.4.1 zod@4.4.3
```

El comando actualiza `package.json` y genera `pnpm-lock.yaml`. El manifest completo queda así; no dupliques dependencias a mano:

**`package.json` · resultado completo de la instalación:**

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
    "@mantine/form": "9.4.1",
    "@mantine/hooks": "9.4.1",
    "@tanstack/react-query": "5.102.8",
    "@tanstack/react-query-devtools": "5.102.8",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-router": "8.3.1",
    "zod": "4.4.3",
    "zustand": "5.0.15"
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

Si esta es una copia nueva del checkpoint y aún no tiene `.env.local`, copia `.env.example` a `.env.local` después de comprobar que no sobrescribes una configuración existente. Es configuración pública de la API; no contiene credenciales. Este archivo heredado conserva:

**`.env.example` · heredado; copiar solo si falta .env.local:**

```example
VITE_API_URL=https://bootcamp-medialog.cardor.dev
```

3. Revisa los contratos heredados siguientes; **no volver a escribir**. `GetMediaDetailInput` representa el tipo y el ID del medio. En el código llamamos `identity` a esos dos datos porque juntos permiten distinguirlo. `MediaType` solo permite película o serie; no introducimos anime.

**`src/types/media-item.ts` · heredado; no volver a escribir:**

```ts
export type MediaType = 'movie' | 'series'

export type MediaItem = {
  id: number
  title: string
  description: string | null
  mediaType: MediaType
  releaseDate: string
  posterUrl: string | null
}
```

**`src/types/media-api.ts` · heredado; no volver a escribir todavía:**

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

4. Crea `src/stores/create-media-log-modal-store.ts`. Escribe el tipo y pregunta qué dato debe conservar. Completa después las dos acciones. No agregues otro booleano para abrir.

**`src/stores/create-media-log-modal-store.ts` · archivo completo:**

```ts
import { create } from 'zustand'

import type { GetMediaDetailInput } from '../types/media-api'

type CreateMediaLogModalStore = {
  selection: GetMediaDetailInput | null
  openCreate: (selection: GetMediaDetailInput) => void
  closeCreate: () => void
}

export const useCreateMediaLogModalStore =
  create<CreateMediaLogModalStore>()((set) => ({
    selection: null,

    openCreate: (selection) => set({ selection }),

    closeCreate: () => set({ selection: null }),
  }))
```

Explica en orden: el import trae la función de Zustand; el tipo enumera datos y acciones; `null` significa «no hemos elegido»; `create<T>()` conserva el contrato TypeScript; `set({ selection })` cambia la selección; cerrar guarda `null`. `set` combina esa actualización con el store existente, por lo que no perdemos las acciones. No es el setter de un `useState` local.

**Pregunta:** «Si añadimos `opened` además de `selection`, ¿qué combinación absurda podríamos guardar?» **Respuesta:** abierto y sin medio. Lo calculamos en el componente para evitar esa contradicción.

5. Crea `src/components/create-media-log-modal.tsx`. Todavía muestra únicamente los datos elegidos. Cada selector lee una parte del store. Mantine muestra el modal cuando `opened` es verdadero y llama a `onClose` al pedir cerrar.

**`src/components/create-media-log-modal.tsx` · archivo completo:**

```tsx
import { Modal, Text } from '@mantine/core'

import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'

export function CreateMediaLogModal() {
  const selection = useCreateMediaLogModalStore((state) => state.selection)
  const closeCreate = useCreateMediaLogModalStore((state) => state.closeCreate)

  return (
    <Modal
      opened={selection !== null}
      onClose={closeCreate}
      title="Agregar a mi biblioteca"
      closeButtonProps={{ 'aria-label': 'Cerrar' }}
    >
      {selection !== null ? (
        <Text>
          Tipo: {selection.mediaType} · ID: {selection.externalId}
        </Text>
      ) : null}
    </Modal>
  )
}
```

6. Sustituye **todo** `src/layouts/public-layout.tsx`. Conserva el encabezado y `Outlet`, añade una única instancia del modal y el botón temporal de demostración. El botón permite probar el store antes de modificar dos páginas.

**`src/layouts/public-layout.tsx` · archivo completo:**

```tsx
import { Button } from '@mantine/core'
import { Outlet } from 'react-router'

import { AppHeader } from '../components/app-header'
import { CreateMediaLogModal } from '../components/create-media-log-modal'
import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'

export function PublicLayout() {
  const openCreate = useCreateMediaLogModalStore((state) => state.openCreate)

  return (
    <>
      <AppHeader />
      <Button
        onClick={() => openCreate({ mediaType: 'movie', externalId: '438631' })}
      >
        Probar apertura
      </Button>

      <main>
        <Outlet />
      </main>

      <CreateMediaLogModal />
    </>
  )
}
```

`Outlet` conserva la página activa; el modal es su hermano. El ejemplo temporal contiene tipo e ID locales y no consulta ese detalle ni guarda nada. La pantalla inicial sigue siendo la búsqueda.

7. Ejecuta `pnpm dev`. Pulsa el botón temporal; lee el tipo y el ID. Cierra con Escape y vuelve a abrir. Ejecuta `pnpm build` para comprobar este punto.

**Checkpoint:** `session-11-step-01-modal-store`. La apertura depende de selección y el cierre la vacía. **Para retomar:** conserva esta rama como referencia y empieza S11-B03 retirando el botón temporal, no creando otro store.

## S11-B03 · Abrir desde las dos pantallas · 35–43

**Entrada:** step-01. **Responsable:** integración guiada. **Pregunta previa:** «¿El botón de un resultado necesita conocer Zustand?» **Respuesta:** puede avisar mediante una prop; la página conecta esa intención con el store.

1. Revisa el modelo heredado de la tarjeta, sin modificarlo. Cada resultado ya conserva tipo e ID:

**`src/types/media-search-card-model.ts` · heredado; no volver a escribir:**

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

2. Sustituye `src/components/media-search-results.tsx` completo. Añade `onCreate` a las props, recoge la prop dentro de la función y entrega los datos del `item` al pulsar el nuevo botón. Conserva `Link` para navegar a detalle.

**`src/components/media-search-results.tsx` · archivo completo:**

```tsx
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { Link } from 'react-router'

import type { MediaSearchCardModel } from '../types/media-search-card-model'
import type { GetMediaDetailInput } from '../types/media-api'

type MediaSearchResultsProps = {
  items: MediaSearchCardModel[]
  onCreate: (identity: GetMediaDetailInput) => void
}

export function MediaSearchResults(props: MediaSearchResultsProps) {
  const { items, onCreate } = props

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
            <Anchor
              component={Link}
              to={`/media/${item.mediaType}/${item.externalId}`}
            >
              Ver detalle
            </Anchor>

            <Button
              onClick={() => onCreate({
                mediaType: item.mediaType,
                externalId: item.externalId,
              })}
            >
              Agregar a mi biblioteca
            </Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
```

El callback es una función recibida, no una petición HTTP. `onClick={() => onCreate(...)}` espera el clic; llamar `onCreate(...)` directamente al renderizar abriría el modal sin intervención de la persona. `key` continúa en el elemento que devuelve el `map`.

3. Sustituye `src/pages/search-page.tsx` completo. La página selecciona `openCreate` junto a sus hooks y lo pasa a `MediaSearchResults`. La búsqueda, su envío y sus estados anteriores se conservan:

**`src/pages/search-page.tsx` · archivo completo:**

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

import { toMediaSearchCardModel } from '../adapters/media-search-item-to-card-model'
import { MediaSearchResults } from '../components/media-search-results'
import { useMediaSearch } from '../hooks/features/use-media'
import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'
import type { SearchMediaInput } from '../types/media-api'
import type { MediaType } from '../types/media-item'

export function SearchPage() {
  const openCreate = useCreateMediaLogModalStore((state) => state.openCreate)

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

    return <MediaSearchResults items={items} onCreate={openCreate} />
  }

  return (
      <Container py="xl" size="md">
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
  )
}
```

4. Sustituye `src/pages/media-detail-page.tsx` completo. Selecciona la acción **antes** de los retornos de carga/error. El botón usa `detailInput` después de comprobarlo, no reconstruye el ID desde el título.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Container, Stack } from '@mantine/core'
import { Link, useParams } from 'react-router'

import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'
import { MediaDetailContent } from '../components/media-detail-content'
import { MediaDocumentTitle } from '../components/media-document-title'
import { PageState } from '../components/page-state'
import { useMediaDetail } from '../hooks/features/use-media'
import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'

export function MediaDetailPage() {
  const openCreate = useCreateMediaLogModalStore((state) => state.openCreate)

  const params = useParams()
  const detailInput = toMediaDetailInput(params)
  const detailQuery = useMediaDetail(detailInput)

  if (detailInput === null) {
    return <PageState variant="invalid" />
  }

  if (detailQuery.isLoading) {
    return <PageState variant="loading" />
  }

  if (detailQuery.isError) {
    return <PageState variant="error" />
  }

  if (detailQuery.data === undefined) {
    return (
      <PageState
        variant="unavailable"
        title="Esperando conexión"
        description="Aún no hay una respuesta. Revisa tu conexión."
      />
    )
  }

  if (detailQuery.data.catalog === null) {
    return <PageState variant="unavailable" />
  }

  const model = mediaCatalogDetailToModel(detailQuery.data.catalog)

  return (
    <Container py="xl" size="md">
      <Stack gap="lg">
        <MediaDocumentTitle title={model.title} />

        <MediaDetailContent model={model} />

        <Button onClick={() => openCreate(detailInput)}>
          Agregar a mi biblioteca
        </Button>

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

Recorre los guards con el grupo: URL inválida, carga, error, ausencia de respuesta y catálogo no disponible. El botón solo existe en la salida exitosa. Los hooks conservan el mismo orden entre renders.

5. Retira el botón temporal y su import del layout. Sustituye el archivo completo por este estado; conserva una sola instancia del modal:

**`src/layouts/public-layout.tsx` · archivo completo:**

```tsx
import { Outlet } from 'react-router'

import { AppHeader } from '../components/app-header'
import { CreateMediaLogModal } from '../components/create-media-log-modal'

export function PublicLayout() {
  return (
    <>
      <AppHeader />
      <main>
        <Outlet />
      </main>

      <CreateMediaLogModal />
    </>
  )
}
```

6. Busca una película, pulsa «Agregar a mi biblioteca» y comprueba su ID. Cierra, usa «Ver detalle» y abre desde allí. Repite con una serie. El enlace sigue navegando; el botón abre el formulario.

**Checkpoint:** `session-11-step-02-modal-entrypoints`. Ambas páginas abren el mismo modal con sus propios datos. **Para retomar:** S11-B04 añade reglas; no vuelvas a crear los puntos de apertura.

## S11-B04 · Reglas que se pueden ejecutar · 43–51

**Entrada:** step-02. **Responsable:** docente escribe reglas y el grupo predice tres resultados. Primero definimos qué aceptamos; después conectaremos campos.

1. Sustituye `src/types/media-api.ts` completo para añadir `CreateCatalogMediaLogBody` al contrato heredado. El body es el objeto que prepararemos para una futura petición. `source: 'catalog'` indica el origen; no añadimos título, usuario, fechas o tokens.

**`src/types/media-api.ts` · archivo completo:**

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

export type CreateCatalogMediaLogBody = {
  source: 'catalog'
  mediaType: MediaType
  externalId: string
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}

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

2. Crea `src/schemas/media-log.ts`. Importa las listas canónicas para evitar dos listas que pudieran divergir. Estado y prioridad aceptan los valores del contrato; notas es texto de hasta 256 caracteres. Ese máximo es una regla de nuestra interfaz, no una garantía del servidor.

**`src/schemas/media-log.ts` · archivo completo:**

```ts
import { z } from 'zod/v4'

import { MEDIA_PRIORITY_VALUES, MEDIA_STATUS_VALUES } from '../types/media-api'

export const mediaLogFormSchema = z.object({
  status: z.enum(MEDIA_STATUS_VALUES, {
    error: 'Selecciona un estado válido.',
  }),
  priority: z.enum(MEDIA_PRIORITY_VALUES, {
    error: 'Selecciona una prioridad válida.',
  }),
  notes: z.string().max(256, {
    error: 'Las notas deben tener 256 caracteres o menos.',
  }),
})

export type MediaLogFormValues = z.infer<typeof mediaLogFormSchema>
```

`z.object` agrupa campos; `z.enum` permite solo las opciones indicadas; `z.string().max` comprueba texto y longitud. `error` define el mensaje. `z.infer` obtiene el tipo TypeScript de esa forma; no ejecuta por sí mismo ninguna comprobación. El siguiente consumidor sí llama a `safeParse`.

3. Crea la demostración temporal `src/components/media-log-schema-probe.tsx`. El archivo completo está aquí; no es código suelto para adivinar dónde pegar. Predice antes de ejecutar: datos válidos, estado no permitido y notas de 257 caracteres.

**`src/components/media-log-schema-probe.tsx` · archivo completo:**

```tsx
import { Button } from '@mantine/core'

import { mediaLogFormSchema } from '../schemas/media-log'

export function MediaLogSchemaProbe() {
  function handleProbe() {
    const valid = mediaLogFormSchema.safeParse({
      status: 'pending',
      priority: 'medium',
      notes: '',
    })

    console.log('Valores válidos:', valid)

    const invalidStatus = mediaLogFormSchema.safeParse({
      status: 'inventado',
      priority: 'medium',
      notes: '',
    })

    console.log('Estado inválido:', invalidStatus)

    const longNotes = mediaLogFormSchema.safeParse({
      status: 'pending',
      priority: 'medium',
      notes: 'a'.repeat(257),
    })

    console.log('Notas demasiado largas:', longNotes)
  }

  return (
    <Button mt="md" onClick={handleProbe}>
      Probar validación
    </Button>
  )
}
```

4. Sustituye el modal completo para montar la demostración. Así el handler tiene un botón que lo llama y un lugar visible en la aplicación:

**`src/components/create-media-log-modal.tsx` · archivo completo:**

```tsx
import { Modal, Text } from '@mantine/core'

import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'
import { MediaLogSchemaProbe } from './media-log-schema-probe'

export function CreateMediaLogModal() {
  const selection = useCreateMediaLogModalStore((state) => state.selection)
  const closeCreate = useCreateMediaLogModalStore((state) => state.closeCreate)

  return (
    <Modal
      opened={selection !== null}
      onClose={closeCreate}
      title="Agregar a mi biblioteca"
      closeButtonProps={{ 'aria-label': 'Cerrar' }}
    >
      {selection !== null ? (
        <>
          <Text>
            Tipo: {selection.mediaType} · ID: {selection.externalId}
          </Text>

          <MediaLogSchemaProbe />
        </>
      ) : null}
    </Modal>
  )
}
```

5. Abre desde un resultado, ejecuta la comprobación y lee la consola. `safeParse` devuelve éxito o errores sin que tengamos que capturar una excepción. La persona no puede convertir un valor incorrecto en correcto mediante un cast.

**Pregunta:** «¿Por qué el tipo no bastaba?» **Respuesta:** el tipo ayuda mientras escribimos código; Zod examina el valor que realmente recibe al ejecutar la comprobación.

**Checkpoint:** `session-11-step-03-form-schema`. Los tres casos muestran aceptación o rechazo según lo acordado. **Para retomar:** S11-B05 retira este archivo temporal y lo reemplaza por campos reales.

## S11-B05 · Tres campos y sus errores · 51–65

**Entrada:** step-03. **Responsable:** construcción guiada. Copia imports, opciones y estructura visual como soporte; construye con el grupo `useForm`, conexión de controles y submit. No se pide memorizar nombres de props de estilo.

1. Crea `src/components/create-media-log-form.tsx` completo. En esta primera versión se muestran los **valores válidos**; aún no se prepara el body final.

**`src/components/create-media-log-form.tsx` · archivo completo:**

```tsx
import { Button, Code, Group, Select, Stack, Text, Textarea } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useState } from 'react'

import { mediaLogFormSchema, type MediaLogFormValues } from '../schemas/media-log'
import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
  type GetMediaDetailInput,
  type MediaPriority,
  type MediaStatus,
} from '../types/media-api'

const STATUS_LABELS: Record<MediaStatus, string> = {
  pending: 'Por ver',
  acquired: 'Adquirido',
  watching: 'Viendo',
  seen: 'Visto',
  dropped: 'Abandonado',
  paused: 'En pausa',
}

const PRIORITY_LABELS: Record<MediaPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

const STATUS_OPTIONS = MEDIA_STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}))

const PRIORITY_OPTIONS = MEDIA_PRIORITY_VALUES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}))

type CreateMediaLogFormProps = {
  identity: GetMediaDetailInput
  onCancel: () => void
}

export function CreateMediaLogForm(props: CreateMediaLogFormProps) {
  const { identity, onCancel } = props
  const [preparedValues, setPreparedValues] =
    useState<MediaLogFormValues | null>(null)

  const form = useForm<MediaLogFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      status: 'pending',
      priority: 'medium',
      notes: '',
    },
    validate: schemaResolver(mediaLogFormSchema, { sync: true }),
    validateInputOnBlur: true,
    onValuesChange: () => setPreparedValues(null),
  })

  const handleSubmit = form.onSubmit((values) => {
    setPreparedValues(values)
  })

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Tipo: {identity.mediaType} · ID: {identity.externalId}
        </Text>

        <Select
          key={form.key('status')}
          label="Estado"
          data={STATUS_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('status')}
        />

        <Select
          key={form.key('priority')}
          label="Prioridad"
          data={PRIORITY_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('priority')}
        />

        <Textarea
          key={form.key('notes')}
          label="Notas"
          placeholder="Opcional"
          autosize
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel}>
            Cancelar
          </Button>

          <Button type="submit">Comprobar valores</Button>
        </Group>

        {preparedValues !== null ? (
          <Stack gap="xs">
            <Text fw={600}>Valores comprobados</Text>

            <Code block>{JSON.stringify(preparedValues, null, 2)}</Code>
          </Stack>
        ) : null}
      </Stack>
    </form>
  )
}
```

2. Explica el archivo de arriba abajo, señalando cada grupo:

- Imports: React conserva la vista previa local; Mantine Core aporta controles y presentación; Form aporta `useForm` y `schemaResolver`; nuestro schema aporta reglas y tipo. No añadimos un paquete de resolver separado.
- Props: `identity` significa tipo e ID del medio elegido; `onCancel` avisa al padre. Declaramos el contrato antes del componente y extraemos las props dentro de la función.
- Opciones: las etiquetas son visibles para la persona; `value` conserva el valor de transporte. El recorrido con `map` obtiene las opciones desde las listas canónicas.
- `useState` conserva la última preparación local. No guarda el DTO ni duplica todos los campos mientras se escribe.
- `mode: 'uncontrolled'` deja que los controles mantengan su texto mientras Mantine registra los valores actuales. No leas `form.values` esperando verlo cambiar con cada tecla; el submit recibe los valores actuales.
- `initialValues` inicia `pending`, `medium` y notas vacías. `validate` conecta Zod mediante el resolver. `{ sync: true }` indica que estas reglas responden inmediatamente, sin esperar red.
- `validateInputOnBlur` comprueba al salir de un campo; el submit también valida. `onValuesChange` retira una vista previa que ya no corresponde a lo escrito.
- `form.onSubmit` crea el handler del formulario y solo llama nuestra preparación si los valores son válidos. No ponemos ese trabajo en el clic del botón ni en un Effect.
- `form.key('campo')` y `getInputProps('campo')` conectan cada control con Form. El spread entrega props que incluyen valor inicial, eventos y error. `allowDeselect={false}` evita borrar accidentalmente la selección; el schema sigue comprobando el dato.
- `noValidate` permite observar los mensajes de nuestra validación. Cancelar usa `type='button'`; preparar usa `type='submit'`.
- Los componentes `Stack`, `Group`, `Text` y `Code` ordenan y presentan; sus props visuales están incluidas en este archivo. `JSON.stringify(..., null, 2)` permite leer el objeto con sangría.

**Pregunta:** «¿Por qué no ponemos las notas en Zustand?» **Respuesta:** solo pertenecen a esta sesión del formulario; ninguna otra pantalla debe conservar ese borrador.

3. Sustituye `src/components/create-media-log-modal.tsx` completo. Monta el formulario solo con selección. La key combina tipo e ID; si cambian, React empieza una instancia distinta. Al cerrar, la condición retira la instancia existente.

**`src/components/create-media-log-modal.tsx` · archivo completo:**

```tsx
import { Modal } from '@mantine/core'

import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'
import { CreateMediaLogForm } from './create-media-log-form'

export function CreateMediaLogModal() {
  const selection = useCreateMediaLogModalStore((state) => state.selection)
  const closeCreate = useCreateMediaLogModalStore((state) => state.closeCreate)

  return (
    <Modal
      opened={selection !== null}
      onClose={closeCreate}
      title="Agregar a mi biblioteca"
      closeButtonProps={{ 'aria-label': 'Cerrar' }}
    >
      {selection !== null ? (
        <CreateMediaLogForm
          key={`${selection.mediaType}:${selection.externalId}`}
          identity={selection}
          onCancel={closeCreate}
        />
      ) : null}
    </Modal>
  )
}
```

4. Elimina **solo** `src/components/media-log-schema-probe.tsx`; su import y consumidor ya desaparecieron del modal anterior. No borres el schema: ahora el consumidor es el resolver de Form.

5. Abre el modal. Selecciona otro estado y prioridad, escribe notas y prepara. Comprueba los valores en la vista previa. Edita una nota: la vista previa desaparece. Escribe más de 256 caracteres y sal del campo: aparece el error y no se prepara una nueva vista previa. Reduce a 256 y repite.

Puedes obtener un texto de prueba escribiendo `'a'.repeat(257)` en la consola y copiando el resultado al campo; esa expresión no se añade al proyecto.

**Distinción:** la key del componente reinicia el formulario completo para otro medio; `form.key` pertenece a un control en modo uncontrolled. Ninguna de las dos hace una petición.

**Checkpoint:** `session-11-step-04-form-fields`. Campos y errores funcionan; todavía vemos valores del formulario, no el body. **Para retomar:** S11-B06 conectará la transformación pura.

## S11-B06 · Preparar el objeto final · 65–74

**Entrada:** step-04. **Responsable:** estudiante propone la transformación; docente la escribe y conecta. **Pregunta previa:** «Si la persona deja espacios en notas, ¿los guardamos como contenido?» **Respuesta:** para este caso representan ausencia; usaremos `null`.

1. Acuerda los cinco comportamientos: conservar tipo/ID/estado/prioridad, añadir origen de catálogo, vacío → `null`, espacios → `null`, texto → recortar extremos conservando su contenido.
2. Crea `src/adapters/media-log-form-to-create-body.ts` completo:

**`src/adapters/media-log-form-to-create-body.ts` · archivo completo:**

```ts
import type { MediaLogFormValues } from '../schemas/media-log'
import type {
  CreateCatalogMediaLogBody,
  GetMediaDetailInput,
} from '../types/media-api'

export function toCreateMediaLogBody(
  identity: GetMediaDetailInput,
  values: MediaLogFormValues,
): CreateCatalogMediaLogBody {
  const notes = values.notes.trim()

  return {
    source: 'catalog',
    mediaType: identity.mediaType,
    externalId: identity.externalId,
    status: values.status,
    priority: values.priority,
    notes: notes === '' ? null : notes,
  }
}
```

Explica las entradas por separado: `identity` llega del medio elegido; `values` llega del submit validado. `trim()` retira espacios de los extremos. La función devuelve un objeto nuevo, añade `source` y convierte vacío a `null`. No abre el modal, no lee el store y no hace fetch. Un adapter transforma; no reemplaza la validación anterior.

3. Sustituye **todo** `src/components/create-media-log-form.tsx` por esta versión. Ahora importa el adapter, tipa la vista previa como `CreateCatalogMediaLogBody | null` y prepara ese resultado en el submit. Conserva el borrado de la vista previa al editar.

**`src/components/create-media-log-form.tsx` · archivo completo:**

```tsx
import { Button, Code, Group, Select, Stack, Text, Textarea } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useState } from 'react'

import { toCreateMediaLogBody } from '../adapters/media-log-form-to-create-body'
import { mediaLogFormSchema, type MediaLogFormValues } from '../schemas/media-log'
import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
  type CreateCatalogMediaLogBody,
  type GetMediaDetailInput,
  type MediaPriority,
  type MediaStatus,
} from '../types/media-api'

const STATUS_LABELS: Record<MediaStatus, string> = {
  pending: 'Por ver',
  acquired: 'Adquirido',
  watching: 'Viendo',
  seen: 'Visto',
  dropped: 'Abandonado',
  paused: 'En pausa',
}

const PRIORITY_LABELS: Record<MediaPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

const STATUS_OPTIONS = MEDIA_STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}))

const PRIORITY_OPTIONS = MEDIA_PRIORITY_VALUES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}))

type CreateMediaLogFormProps = {
  identity: GetMediaDetailInput
  onCancel: () => void
}

export function CreateMediaLogForm(props: CreateMediaLogFormProps) {
  const { identity, onCancel } = props
  const [preparedBody, setPreparedBody] =
    useState<CreateCatalogMediaLogBody | null>(null)

  const form = useForm<MediaLogFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      status: 'pending',
      priority: 'medium',
      notes: '',
    },
    validate: schemaResolver(mediaLogFormSchema, { sync: true }),
    validateInputOnBlur: true,
    onValuesChange: () => setPreparedBody(null),
  })

  const handleSubmit = form.onSubmit((values) => {
    setPreparedBody(toCreateMediaLogBody(identity, values))
  })

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Tipo: {identity.mediaType} · ID: {identity.externalId}
        </Text>

        <Select
          key={form.key('status')}
          label="Estado"
          data={STATUS_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('status')}
        />

        <Select
          key={form.key('priority')}
          label="Prioridad"
          data={PRIORITY_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('priority')}
        />

        <Textarea
          key={form.key('notes')}
          label="Notas"
          placeholder="Opcional"
          autosize
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel}>
            Cancelar
          </Button>

          <Button type="submit">Preparar body</Button>
        </Group>

        {preparedBody !== null ? (
          <Stack gap="xs">
            <Text fw={600}>Body preparado</Text>

            <Code block>{JSON.stringify(preparedBody, null, 2)}</Code>
          </Stack>
        ) : null}
      </Stack>
    </form>
  )
}
```

4. Prepara sin notas y lee `notes: null`. Repite con espacios; después con texto rodeado de espacios. Cambia prioridad y comprueba que se retira la preparación anterior antes de volver a preparar.
5. Cierra y vuelve a abrir el mismo medio: estado Por ver, prioridad Media, notas vacías y sin vista previa. Abre otro medio desde búsqueda; comprueba su tipo e ID. Repite desde detalle.

**Pregunta:** «¿Por qué desaparece el objeto cuando edito?» **Respuesta:** representaba la preparación anterior; mantenerlo visible parecería que ya refleja la edición actual.

**Checkpoint:** `session-11-step-05-body-preview`. El objeto reúne exactamente los campos acordados. Network no muestra `/api/v2/media/create`. **Para retomar:** S11-B07 prueba la transformación sin cambiar producción.

## S11-B07 · Trabajo con agente y lectura humana · 74–81

**Entrada:** step-05; la persona ya escribió el adapter. **Objetivo único:** redactar los cinco tests acordados. El agente no decide la arquitectura ni cambia producción.

1. Entrega este prompt completo:

```text
Partimos de session-11-step-05-body-preview. Lee el adapter
src/adapters/media-log-form-to-create-body.ts, el schema media-log.ts,
los tipos media-api.ts y un test existente de adapters.

Usa la skill ahk-test para crear y ejecutar pruebas Vitest del comportamiento
público de toCreateMediaLogBody. La persona ya decidió esta matriz:
1. Conserva mediaType, externalId, status y priority.
2. Añade source: 'catalog'.
3. Notes vacías producen null.
4. Notes formadas solo por espacios producen null.
5. Notes con contenido se recortan en ambos extremos y conservan el texto interior.

Solo puedes cambiar src/adapters/__tests__/media-log-form-to-create-body.test.ts
y, si son necesarios, fixtures dentro de src/adapters/__tests__/fixtures/.
Producción, schema, tipos, componentes, store, rutas, dependencias,
configuración y otros tests son de solo lectura. No uses snapshots ni
debilites expectativas. Si un caso contradice producción, detente y explica.

Ejecuta pnpm exec vitest run src/adapters/__tests__/media-log-form-to-create-body.test.ts.
Entrega archivos, matriz de casos, resultado y exit status, flujo que se prueba,
supuestos y límites de la evidencia. No afirmes haber probado el navegador.
```

2. Lee el diff con el grupo. Cada test contiene entrada, llamada y expectativa. Pregunta qué error real detectaría y qué parte de la app queda fuera.
3. Si el agente tarda, usa esta referencia completa **después** de acordar los comportamientos. El grupo igualmente debe leerla y ejecutarla:

**`src/adapters/__tests__/media-log-form-to-create-body.test.ts` · archivo completo:**

```ts
import { describe, expect, it } from 'vitest'

import type { MediaLogFormValues } from '../../schemas/media-log'
import type { GetMediaDetailInput } from '../../types/media-api'
import { toCreateMediaLogBody } from '../media-log-form-to-create-body'

const identity: GetMediaDetailInput = {
  mediaType: 'series',
  externalId: '1399',
}

const values: MediaLogFormValues = {
  status: 'watching',
  priority: 'high',
  notes: '',
}

describe('toCreateMediaLogBody', () => {
  it('conserva el tipo, el ID, el estado y la prioridad elegidos', () => {
    const body = toCreateMediaLogBody(identity, values)

    expect(body).toMatchObject({
      mediaType: 'series',
      externalId: '1399',
      status: 'watching',
      priority: 'high',
    })
  })

  it('indica que el medio procede del catálogo', () => {
    const body = toCreateMediaLogBody(identity, values)

    expect(body.source).toBe('catalog')
  })

  it('convierte las notas vacías en null', () => {
    const body = toCreateMediaLogBody(identity, {
      ...values,
      notes: '',
    })

    expect(body.notes).toBeNull()
  })

  it('convierte las notas compuestas solo por espacios en null', () => {
    const body = toCreateMediaLogBody(identity, {
      ...values,
      notes: '   ',
    })

    expect(body.notes).toBeNull()
  })

  it('recorta los extremos y conserva los espacios del interior', () => {
    const body = toCreateMediaLogBody(identity, {
      ...values,
      notes: '  Ver con  amigos  ',
    })

    expect(body.notes).toBe('Ver con  amigos')
  })
})
```

4. Ejecuta:

```bash
pnpm exec vitest run src/adapters/__tests__/media-log-form-to-create-body.test.ts
pnpm test
pnpm lint
pnpm build
```

**Respuesta esperada:** la prueba enfocada verifica el objeto devuelto por el adapter. La suite heredada comprueba otros adapters; lint y build aportan comprobaciones distintas. Nada de eso demuestra por sí solo el modal, la API o un guardado remoto.

**Checkpoint:** `session-11-step-06-adapter-tests`. Cinco casos nuevos y comprobaciones correctas. **Para retomar:** S11-B08 hace el recorrido de navegador; no lo marques como hecho solo porque el test está verde.

## S11-B08 · Actividad estudiantil · 81–87

**Responsable:** cada estudiante. No añade otra abstracción ni repite la implementación. Debe usar un medio distinto del ejemplo docente y explicar lo observado.

1. Abre desde búsqueda y anota tipo e ID.
2. Prepara con notas vacías, con espacios y con texto. Compara los tres objetos.
3. Prueba notas de 257 y 256 caracteres. En el primer caso debe aparecer error; en el segundo debe poder prepararse.
4. Prepara, edita y comprueba que desaparece la vista previa anterior.
5. Cierra con Cancelar, vuelve a abrir y comprueba valores iniciales. Repite cierre con Escape y el botón de cierre.
6. Abre desde detalle y verifica que es el mismo formulario con los datos de ese medio.
7. En Network identifica la búsqueda y confirma ausencia de petición de creación. No hay entrada nueva en una biblioteca remota.

**Evidencia de salida:** código, salida de test/build, diff leído y registro de estos casos como comprobados o pendientes. No inventes resultados para completar la tabla. La clase virtual no añade una rúbrica de taller.

## S11-B09 · Cierre oral y continuación · 87–90

Sobre el resultado visible, sin volver a slides:

1. **¿Qué conserva Zustand y por qué basta?** Tipo e ID del medio elegido y acciones para abrir/cerrar; Query ya administra los datos remotos y Form los campos.
2. **¿Cuándo se comprueba realmente un dato?** Al ejecutar `safeParse` o el resolver, no al inferir su tipo con `z.infer`.
3. **¿Dónde se convierte vacío a `null` y por qué no en cada tecla?** En el adapter al preparar el body; durante la edición el campo mantiene texto.
4. **¿Qué falta para decir que está guardado?** Petición autenticada, respuesta del servidor y comprobación del resultado remoto. Ver el body local no basta.

Salida de referencia: `session-11-end`. No se modifica `main` del repositorio docente. La sesión 12 recibe este formulario y aplica lo aprendido a Login/Registro; Firebase todavía no está implementado.

## Si debemos detenernos antes

Registra: último bloque y paso comprobado, cambio guardado, primer paso pendiente y evidencia ausente. Ejemplo: «S11-B05 paso 4 guardado; falta probar notas largas y reinicio; luego S11-B06 adapter». En la próxima reunión recupera esa comprobación antes de avanzar. Cambiar a una rama final recupera archivos, no reemplaza el aprendizaje pendiente.

## Errores frecuentes y contingencias

| Síntoma | Qué comprobar y explicar |
| --- | --- |
| Se abre sin hacer clic | Revisa que onClick reciba una función, no el resultado de ejecutarla. |
| Falla el orden de hooks | El selector de la página debe estar antes de cualquier retorno condicional. |
| Modal abierto sin medio | No guardar opened por separado; derivarlo de selection. |
| Otro medio conserva notas | Comprobar montaje condicional y key por tipo e ID. No añadir un Effect de reset. |
| Notas cambian pero preview parece actualizado | onValuesChange debe retirar la preparación anterior. |
| Un select se vacía | allowDeselect=false más validación del schema. |
| El body lleva título o userId | El adapter solo reúne el contrato acordado; no transporta DTO completo ni usuario. |
| Hay un POST en Network | Distinguir search del endpoint create; no declarar un fallo por buscar. |
| Falla el backend público | La apertura temporal de step-01 permite practicar el bloque local sin afirmar haber probado búsqueda/detalle reales. Registra esa parte como pendiente. |
| Falla la instalación | Comprobar Node, pnpm y versiones exactas; recuperar lockfile del checkpoint de ese bloque en una copia guardada. No actualizar toda la cohorte para continuar. |
| Falta tiempo para el agente | Usar la referencia completa del test, leerla y ejecutar; no delegar más producción. |

## Fuera de alcance

Firebase, Login, Registro, rutas privadas, tokens, POST de creación, useMutation, invalidaciones, persistencia del store y formulario genérico de creación/edición. No usar Effects para abrir, cerrar, preparar o reiniciar este formulario.
