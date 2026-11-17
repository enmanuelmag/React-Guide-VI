# Guía docente · Sesión 13 · Crear, listar y filtrar biblioteca

## Resultado y alcance

**Presencial · 180 minutos · semana 5.** Entrada: `session-13-start`, cierre 12 con contratos preparados. Salida: `session-13-end`. La presentación de **19 diapositivas está aprobada**.

El formulario deja de mostrar un objeto local y guarda un registro en el servidor. Después consultamos la biblioteca de esa persona, representamos sus estados y conectamos Todos/Películas/Series. El taller termina con una biblioteca que conserva el orden remoto; abrir un registro por logId corresponde a la sesión 14.

Esta guía privada contiene cada línea de los archivos que cambian y del soporte que se consulta. Todos los cambios, referencias heredadas y comandos de instalación aparecen después de la presentación continua. Los archivos completos se repiten cuando cambian de nuevo: puedes seguir el Markdown en orden sin abrir el repositorio de referencia. No se agrega CSS ni dependencias. Las props de Mantine incluyen cada estilo nuevo. El lockfile se conserva; no se transcribe.

Material público: [guía estudiantil](student-guide.md), [lectura previa](pre-class-reading.md), [control posterior](reading-check.md) y [taller y rúbrica](workshop-rubric.md).

## Antes de la clase · comprobar sin editar

1. Comprueba búsqueda, detalle, apertura del formulario local, Login/Registro, restauración y acceso privado en el cierre 12.
2. Prepara una cuenta de prueba propia con Firebase configurado y aceptado por el backend. No muestres contraseñas, tokens o datos personales en proyección.
3. La URL base es `https://bootcamp-medialog.cardor.dev`. El cliente HTTP la añade: los fetchers entregan rutas relativas. Comprueba fuera de clase que el origen y proyecto Firebase de la cohorte estén permitidos.
4. Prepara una película y una serie para guardar en esa cuenta. Una creación real modifica su biblioteca: no uses datos ajenos ni ids de registros prestados.
5. Conserva editor, navegador, guía y deck listos. Presentación completa → editor y navegador → taller → cierre oral. main docente sigue vacío; publica ramas gradualmente.
6. Los checks locales y una simulación no demuestran aceptación real de Firebase, CORS o disponibilidad del servidor. Registra por separado lo que se haya ejecutado.

## Ruta recuperable y tiempos

| Bloque | Minutos | Responsable y medio | Resultado |
| --- | --- | --- | --- |
| S13-B01 | 0–18 | Docente · presentación continua y predicciones orales | Leer/escribir, sesión, caché y encargo explicados. |
| S13-B02 | 18–22 | Docente · soporte después de las slides | Contratos y entrada comprobados. |
| S13-B03 | 22–31 | Docente y grupo · editor | Optional auth y caché por sesión. |
| S13-B04 | 31–47 | Docente y grupo · editor/Network | Crear, errores y espera del refetch. |
| S13-B05 | 47–60 | Docente y grupo · editor | Body y primera query privada diagnóstica. |
| S13-B06 | 60–68 | Práctica guiada · editor | Invalidación de listas y limpieza al salir. |
| S13-B07 | 68–75 | Docente · código visible y consigna | Predecir modelo, estados y filtro; fijar encargo. |
| Descanso | 75–105 | Todos | 30 minutos. |
| S13-B08 | 105–120 | Estudiantes · taller | Modelo, adapter y labels compartidos. |
| S13-B09 | 120–132 | Estudiantes · taller | Filas, lista y cuatro estados. |
| S13-B10 | 132–143 | Estudiantes · taller | Filtro local validado y consulta remota. |
| S13-B11 | 143–152 | Estudiantes y agente limitado | Matriz, lectura y test del body. |
| S13-B12 | 152–165 | Estudiantes · comprobación | Recorrido, test, lint y build. |
| S13-B13 | 165–180 | Docente y grupo · cierre oral | Demostración, explicación y punto para retomar. |

**Suma:** 18 + 57 de coding/consigna + 30 + 60 + 15 = 180 minutos. Los archivos mecánicos se entregan como soporte dentro de cada paso; no se pretende teclear todos desde cero. El tiempo es un presupuesto pendiente de medición en aula. No se resta tiempo al descanso o al taller si el grupo se retrasa: registra el punto exacto y retoma allí.

## Clave privada del control de lectura

| Pregunta | Respuesta | Justificación |
| ---: | :---: | --- |
| 1 | B | useMutation representa una operación que cambia datos remotos. |
| 2 | A | El argumento de mutate llega a mutationFn. |
| 3 | Verdadero | isPending señala la mutación en curso. |
| 4 | A | invalidateQueries marca las consultas como desactualizadas. |
| 5 | Verdadero | La promesa devuelta por onSuccess prolonga isPending. |

Fuentes: TanStack Query, [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) e [Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations).

## S13-B01 · Presentación continua · 0–18

No abrir el editor durante este bloque. Recupera el preview local de 11 con la imagen del deck y pregunta qué falta para que ese objeto exista en la biblioteca del servidor.

| Slides | Explicación oral | Pregunta y respuesta esperada |
| --- | --- | --- |
| 01–04 | Portada, antes/después, Query lee y mutation cambia; los campos locales pertenecen a Form. | «¿POST siempre significa escribir?» No: list usa POST para enviar filtros, pero sigue leyendo. |
| 05–06 | El token permite comprobar quién solicita; authScope separa respuestas locales. checking todavía espera sesión. | «¿Poner un uid en la key autoriza?» No: el servidor comprueba el token. |
| 07–09 | mutate recibe body; pending bloquea; error conserva datos y permite reintento. | «¿Cerramos antes del resultado?» No. El éxito confirma escritura y termina la espera de invalidación. |
| 10–12 | Crear deja antiguas tres familias. Invalidar marca stale y normalmente vuelve a consultar las activas habilitadas. | «¿Todas generan un request inmediato?» No: las inactivas esperan un consumidor. |
| 13–16 | Biblioteca privada: body+usuario en key, DTO→adapter→fila, cuatro estados y filtro remoto. | «¿Todos es un array vacío?» No: enviamos movie y series explícitamente. |
| 17–19 | Logout retira caché tras éxito; la persona define tests; encargo del taller. | «¿El test puro prueba Firebase?» No: solo la transformación del body. |

Analogía oral: el mostrador conserva una lista impresa de tu biblioteca. Guardar un nuevo registro deja esa impresión antigua: invalidar indica «hay que revisarla». Si alguien está usando esa lista, solicita una versión actual. Cerrar sesión retira las copias de esa persona. La analogía no convierte el papel en una credencial: el token sigue siendo lo que el servidor comprueba.

**Fin de la presentación.** Di: «Ahora conectaremos las piezas en ese orden. Primero las lecturas necesitan conocer la sesión; después guardamos y consultamos la biblioteca». Permanece en editor/navegador hasta el cierre.

## S13-B02 · Entrada y contratos de soporte · 18–22

**Entrada:** `session-12-end`. **Salida:** `session-13-start`.

**Responsable:** docente entrega los contratos extensos y lee sus campos; el grupo identifica cuáles ya conoce.

1. Guarda el trabajo individual antes de usar respaldos. Instala la entrada con `pnpm install --frozen-lockfile`; no actualices versiones. Esta rama conserva el cierre 12 más los dos contratos preparados de abajo. Si continúas desde 12-end, sustituye esos dos archivos; no añadas todavía lógica de biblioteca.
2. Comprueba el soporte heredado completo situado después de esos archivos: Firebase, sesión y adapter/schema del formulario. No volver a escribir los archivos rotulados heredados.
3. Conserva .env.local individual y no lo entregues. .env.example continúa con la base pública; no hay nuevos nombres de configuración.

```bash
git switch session-13-start
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

### Archivo 1 · src/types/media-item.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-start`.

MEDIA_TYPE_VALUES conserva los dos tipos del curso; typeof y [number] derivan la unión desde sus elementos. MediaItem conserva el catálogo estático heredado. No cambia su uso anterior.

**`src/types/media-item.ts` · archivo completo:**

```ts
export const MEDIA_TYPE_VALUES = ['movie', 'series'] as const

export type MediaType = (typeof MEDIA_TYPE_VALUES)[number]

export type MediaItem = {
  id: number
  title: string
  description: string | null
  mediaType: MediaType
  releaseDate: string
  posterUrl: string | null
}
```

### Archivo 2 · src/types/media-api.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-start`.

Los contratos previos permanecen completos. ListMediaLogsBody añade la forma del request de biblioteca: vista y filtros. MediaLogListItemDto conserva el subconjunto de la respuesta que la futura lista necesita. En ambos se conserva el id remoto del registro. Son soporte preparado; un type no inspecciona el JSON recibido. El resultado de creación se añadirá en B04, donde se usa por primera vez.

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

type MatchMode = 'AND' | 'OR'

type ValuesFilter<T> = {
  values: T[]
  matchMode: MatchMode
}

type MediaDate = {
  year: number
  month: number
  day: number
}

type MediaDateRange = {
  start: MediaDate | null
  end: MediaDate | null
}

export type ListMediaLogsBody = {
  viewLogType: 'list'
  filters: {
    query: string | null
    status: ValuesFilter<MediaStatus>
    priority: ValuesFilter<MediaPriority>
    mediaType: ValuesFilter<MediaType>
    releaseDateRange: MediaDateRange | null
    genres: ValuesFilter<string>
    tags: ValuesFilter<string>
  }
}

export type MediaLogListItemDto = {
  id: string
  mediaType: MediaType
  title: string
  releaseYear: number | null
  releaseMonth: number | null
  releaseDay: number | null
  status: MediaStatus
  priority: MediaPriority
}
```

### Archivo 3 · src/firebase/firebase.ts

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-start`.

Referencia heredada: initializeApp/getAuth se ejecutan solo con configuración completa. auth:null es ausencia de configuración, no una cuenta rechazada. No volver a escribir el archivo ni copiar credenciales.

**`src/firebase/firebase.ts` · archivo completo:**

```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === 'string' && value.trim() !== '',
)

export const auth = isFirebaseConfigured
  ? getAuth(initializeApp(firebaseConfig))
  : null
```

### Archivo 4 · src/schemas/auth.ts

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-start`.

Referencia heredada: el schema discrimina los estados de sesión y valida la pequeña proyección que compartimos. No guarda tokens ni sustituye autorización del servidor.

**`src/schemas/auth.ts` · archivo completo:**

```ts
import { z } from 'zod/v4'

export const authUserSchema = z.object({
  uid: z.string().min(1),
  email: z.email().nullable(),
})

export const authStateSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('checking') }),
  z.object({ status: z.literal('anonymous') }),
  z.object({
    status: z.literal('authenticated'),
    user: authUserSchema,
  }),
])

export type AuthUser = z.infer<typeof authUserSchema>
export type AuthState = z.infer<typeof authStateSchema>

const emailSchema = z.email({ error: 'Ingresa un correo válido.' })
const passwordSchema = z.string().min(6, {
  error: 'Usa al menos 6 caracteres.',
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, {
    error: 'Confirma tu contraseña.',
  }),
}).refine((values) => values.password === values.confirmPassword, {
  error: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const authDestinationSchema = z.object({
  from: z.string().trim().min(1),
})

export type AuthDestination = z.infer<typeof authDestinationSchema>
```

### Archivo 5 · src/auth/auth-provider.tsx

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-start`.

Referencia heredada: un único observer de Firebase actualiza una proyección pequeña de sesión y se desuscribe con cleanup. useAuth exige un consumidor dentro del provider. No volver a escribir este archivo.

**`src/auth/auth-provider.tsx` · archivo completo:**

```tsx
import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { auth } from '../firebase/firebase'
import { authStateSchema, type AuthState, type AuthUser } from '../schemas/auth'

const AuthContext = createContext<AuthState | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

function toAuthUser(user: User): AuthUser {
  return { uid: user.uid, email: user.email }
}

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props
  const [authState, setAuthState] = useState<AuthState>(
    auth === null ? { status: 'anonymous' } : { status: 'checking' },
  )

  useEffect(() => {

    if (auth === null) {
      return
    }

    return onAuthStateChanged(auth, (user) => {
      const nextState = user === null
        ? { status: 'anonymous' }
        : { status: 'authenticated', user: toAuthUser(user) }

      setAuthState(authStateSchema.parse(nextState))
    })
  }, [])

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const authState = useContext(AuthContext)

  if (authState === null) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }

  return authState
}
```

### Archivo 6 · src/schemas/media-log.ts

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-start`.

Referencia heredada: campos cerrados de estado/prioridad y notas con límite local. Mantine valida estos valores antes de llamar al handler. No valida tokens ni la respuesta del servidor.

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

### Archivo 7 · src/adapters/media-log-form-to-create-body.ts

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-start`.

Referencia heredada: combina tipo/ID elegidos con valores de formulario. Recorta notes y convierte vacío a null. source:catalog pide al servidor resolver metadata; no enviamos un título inventado.

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

**Pregunta:** «¿Un type garantiza que el servidor responderá así?» **Respuesta esperada:** No. Documenta la forma que esperamos; el runtime puede recibir otra cosa.

**Comprueba:** Catálogo y formulario siguen funcionando. Biblioteca todavía provisional.

**Para retomar:** registra este bloque, la rama guardada y qué observación faltó. Continúa solo cuando su salida esté comprobada.

## S13-B03 · Sesión opcional y caché separada · 22–31

**Entrada:** `session-13-start`. **Salida:** `session-13-step-01-optional-auth-scope`.

**Responsable:** construcción guiada. **Dificultad principal:** separar permiso remoto y copia local.

1. Añade la función opcional al cliente HTTP completo. Predice las dos situaciones sin usuario: configuración ausente y sesión anónima. Ambas delegan a público.
2. Sustituye media.ts para que búsqueda/detalle usen ese helper. No cambies método o body de search.
3. Sustituye keys y hooks completos: incorpora authScope y conserva los guards previos de enabled. La key de detalle sigue admitiendo null.
4. Sustituye las páginas públicas completas para que checking tenga un mensaje propio. Invoca hooks antes de los retornos.
5. En Devtools compara la misma consulta anónima y autenticada. Durante recarga autenticada, comprueba que no se envía una consulta anónima antes de resolver checking.

### Archivo 1 · src/api/http.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-01-optional-auth-scope`.

requestJson añade la URL base una sola vez, comprueba response.ok y conserva el status con ApiError. requestJsonWithAuth obtiene el token al solicitar y combina headers mediante Headers. La función opcional decide si delega al request público o al autenticado: auth puede ser null cuando falta configuración. Un token rechazado sigue siendo un error; no reintentamos anónimamente.

**`src/api/http.ts` · archivo completo:**

```ts
import { getIdToken } from 'firebase/auth'

import { auth } from '../firebase/firebase'

const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)

  if (!response.ok) {
    throw new ApiError(
      `La API respondió con status ${response.status}`,
      response.status,
    )
  }

  return (await response.json()) as T
}

export async function requestJsonWithAuth<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {

  if (auth === null) {
    throw new Error('Falta configurar Firebase para este request.')
  }

  const user = auth.currentUser

  if (user === null) {
    throw new Error('No hay una sesión disponible para este request.')
  }

  const token = await getIdToken(user)
  const headers = new Headers(init?.headers)
  headers.set('Authorization', `Bearer ${token}`)

  return requestJson<T>(path, {
    ...init,
    headers,
  })
}

export function requestJsonWithOptionalAuth<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {

  if (auth === null || auth.currentUser === null) {
    return requestJson<T>(path, init)
  }

  return requestJsonWithAuth<T>(path, init)
}
```

### Archivo 2 · src/api/media.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-01-optional-auth-scope`.

Búsqueda y detalle ahora delegan a requestJsonWithOptionalAuth: siguen siendo endpoints públicos y agregan credencial si hay usuario. Conservamos método, params y body anteriores. El fetcher entrega paths relativos porque http.ts añade la base. Todavía no hay creación ni lista en este archivo.

**`src/api/media.ts` · archivo completo:**

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  GetMediaDetailInput,
  MediaDetailDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'
import { requestJsonWithOptionalAuth } from './http'

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  return requestJsonWithOptionalAuth<MediaSearchItemDto[]>('/api/v2/media/search', {
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
  return requestJsonWithOptionalAuth<MediaDetailDto>(
    `/api/v2/media/detail?${params.toString()}`,
  )
}
```

### Archivo 3 · src/hooks/media-keys.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-01-optional-auth-scope`.

all agrupa Media; searches/details/lists seleccionan familias. Las keys concretas guardan los parámetros consumidos por el fetcher y authScope. El uid separa copias de caché; no permite autenticarse. CREATE_MEDIA_LOG_INVALIDATION_KEYS enumera lecturas que quedaron antiguas tras crear. lists aparece únicamente cuando ya existe su consumidor.

**`src/hooks/media-keys.ts` · archivo completo:**

```ts
import type { GetMediaDetailInput, SearchMediaInput } from '../types/media-api'

export const mediaKeys = {
  all: ['media'] as const,
  searches: () => [...mediaKeys.all, 'search'] as const,
  search: (input: SearchMediaInput, authScope: string) =>
    [
      ...mediaKeys.searches(),
      {
        query: input.query.trim(),
        mediaType: input.mediaType,
        authScope,
      },
    ] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (input: GetMediaDetailInput | null, authScope: string) =>
    [...mediaKeys.details(), { input, authScope }] as const,
}
```

### Archivo 4 · src/hooks/features/use-media.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-01-optional-auth-scope`.

useAuth entrega checking, anonymous o authenticated. Mientras checking, enabled impide consultas dependientes de sesión. Cada query devuelve el objeto de useQuery, con data/error/isLoading/refetch; no copiamos data. mutationFn recibe el body de mutate. onSuccess del hook espera Promise.all de invalidaciones: isPending sigue true hasta que terminan los intentos de refetch activos. Después corre onSuccess de la llamada montada, que avisa a la interfaz.

**`src/hooks/features/use-media.ts` · archivo completo:**

```ts
import { useQuery } from '@tanstack/react-query'

import { getMediaDetail, searchMedia } from '../../api/media'
import { useAuth } from '../../auth/auth-provider'
import type { GetMediaDetailInput, SearchMediaInput } from '../../types/media-api'
import { mediaKeys } from '../media-keys'

const emptySearch: SearchMediaInput = {
  query: '',
  mediaType: 'movie',
}

export function useMediaSearch(input: SearchMediaInput | null) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status
  const authReady = authState.status !== 'checking'

  const normalizedInput =
    input === null
      ? emptySearch
      : {
          query: input.query.trim(),
          mediaType: input.mediaType,
        }

  return useQuery({
    queryKey: mediaKeys.search(normalizedInput, authScope),
    queryFn: () => searchMedia(normalizedInput),
    enabled: authReady && input !== null && normalizedInput.query.length >= 2,
  })
}

export function useMediaDetail(input: GetMediaDetailInput | null) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status
  const authReady = authState.status !== 'checking'

  return useQuery({
    queryKey: mediaKeys.detail(input, authScope),
    queryFn: () => {

      if (input === null) {
        throw new Error('Falta la identidad del medio')
      }

      return getMediaDetail(input)
    },
    enabled: authReady && input !== null,
  })
}
```

### Archivo 5 · src/pages/search-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-01-optional-auth-scope`.

Los hooks se invocan antes de cualquier retorno. La espera de sesión se representa explícitamente, sin confundir enabled:false con una petición activa o un resultado vacío. Borrador y búsqueda enviada conservan su responsabilidad anterior; los resultados siguen perteneciendo a Query.

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
import { useAuth } from '../auth/auth-provider'
import { MediaSearchResults } from '../components/media-search-results'
import { useMediaSearch } from '../hooks/features/use-media'
import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'
import type { SearchMediaInput } from '../types/media-api'
import type { MediaType } from '../types/media-item'

export function SearchPage() {
  const authState = useAuth()
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

    if (authState.status === 'checking') {
      return <Text role="status">Comprobando sesión…</Text>
    }

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

### Archivo 6 · src/pages/media-detail-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-01-optional-auth-scope`.

Primero obtiene params, los valida y llama hooks en orden estable. La espera de sesión, URL inválida, carga, error y falta de catálogo tienen salidas propias. El DTO confirmado isLogged controla el texto y disponibilidad de Agregar; no fingimos éxito con un booleano local. El botón entrega el tipo e ID al modal existente.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Container, Stack } from '@mantine/core'
import { Link, useParams } from 'react-router'

import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'
import { useAuth } from '../auth/auth-provider'
import { MediaDetailContent } from '../components/media-detail-content'
import { MediaDocumentTitle } from '../components/media-document-title'
import { PageState } from '../components/page-state'
import { useMediaDetail } from '../hooks/features/use-media'
import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'

export function MediaDetailPage() {
  const authState = useAuth()
  const openCreate = useCreateMediaLogModalStore((state) => state.openCreate)

  const params = useParams()
  const detailInput = toMediaDetailInput(params)
  const detailQuery = useMediaDetail(detailInput)

  if (detailInput === null) {
    return <PageState variant="invalid" />
  }

  if (authState.status === 'checking') {
    return <PageState variant="loading" title="Comprobando sesión" />
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

### Archivo 7 · src/components/page-state.tsx

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-step-01-optional-auth-scope`.

Referencia heredada: presenta estados de página con copy y color por variante. Loader señala espera; Alert señala problema; onRetry conecta el botón con refetch que proporciona la página. No realiza requests por sí mismo.

**`src/components/page-state.tsx` · archivo completo:**

```tsx
import { Alert, Button, Loader, Stack, Text } from '@mantine/core'

export type PageStateVariant =
  | 'loading'
  | 'error'
  | 'invalid'
  | 'unavailable'

type PageStateProps = Readonly<{
  variant: PageStateVariant
  title?: string
  description?: string
  onRetry?: () => void
}>

const PAGE_STATE_COPY: Record<
  PageStateVariant,
  Readonly<{ title: string; description: string; color: string }>
> = {
  loading: {
    title: 'Cargando contenido',
    description: 'Espera mientras recuperamos la información.',
    color: 'blue',
  },
  error: {
    title: 'No pudimos cargar el contenido',
    description: 'Intenta nuevamente.',
    color: 'red',
  },
  invalid: {
    title: 'Dirección no válida',
    description: 'Revisa el enlace o vuelve a la página anterior.',
    color: 'yellow',
  },
  unavailable: {
    title: 'Contenido no disponible',
    description: 'No encontramos información para mostrar.',
    color: 'gray',
  },
}

export function PageState(props: PageStateProps) {
  const { variant, title, description, onRetry } = props
  const copy = PAGE_STATE_COPY[variant]
  const resolvedTitle = title ?? copy.title
  const resolvedDescription = description ?? copy.description
  const canRetry =
    (variant === 'error' || variant === 'unavailable') &&
    onRetry !== undefined

  if (variant === 'loading') {
    return (
      <Stack align="center" gap="sm" py="xl" role="status">
        <Loader aria-label={resolvedTitle} color={copy.color} />

        <Text fw={600}>{resolvedTitle}</Text>

        <Text c="dimmed" ta="center">
          {resolvedDescription}
        </Text>
      </Stack>
    )
  }

  return (
    <Alert color={copy.color} title={resolvedTitle}>
      <Stack gap="sm">
        <Text>{resolvedDescription}</Text>

        {canRetry ? (
          <Button type="button" onClick={onRetry} variant="light">
            Reintentar
          </Button>
        ) : null}
      </Stack>
    </Alert>
  )
}
```

**Pregunta:** «¿Puede otra persona autenticarse copiando nuestro authScope?» **Respuesta esperada:** No. La key organiza caché; Authorization transporta la credencial que verifica el servidor.

**Comprueba:** Keys distintas por sesión y ningún request durante checking. Si falta Firebase, el catálogo público continúa.

**Para retomar:** registra este bloque, la rama guardada y qué observación faltó. Continúa solo cuando su salida esté comprobada.

## S13-B04 · Guardado remoto y espera de consistencia · 31–47

**Entrada:** `session-13-step-01-optional-auth-scope`. **Salida:** `session-13-step-02-create-mutation`.

**Responsable:** docente entrega el JSX mecánico y construye handler, mutationFn, invalidaciones y callbacks con el grupo.

1. Sustituye el archivo de tipos completo para añadir el resultado de creación. El servidor devuelve más datos; aquí consumimos solamente id.
2. Añade el fetcher y la mutación mediante los archivos completos de abajo. Enumera primero búsquedas y detalles afectados; todavía no declares lists().
3. Sustituye el formulario completo. Elimina preview, preparedBody, su useState y onValuesChange asociado. Conserva initialValues, schema y modo uncontrolled. El handler entrega el body al hook; el hook representa pending/error/success.
4. Conecta onCreated en el modal completo. No lo invoques al hacer clic ni en finally. El callback corre tras el onSuccess esperado del hook.
5. Sustituye MediaDetailPage completo: isLogged recibido después del refetch produce «En tu biblioteca». No añadas un booleano para fingir que guardó.
6. Comprueba un POST por submit y un error conservando campos. Durante pending, Guardar/Cancelar/campos están bloqueados. El cierre manual del modal no cancela una petición; no enseñamos aquí un bloqueo global de todos los cierres.

### Archivo 1 · src/types/media-api.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

Cada propiedad describe datos de transporte. CreatedMediaLogDto conserva el id devuelto al crear; no renombra el catálogo. ListMediaLogsBody describe todos los filtros que enviamos. Los arrays vacíos dejan esos filtros sin restricción; mediaType siempre lleva movie/series. MediaLogListItemDto conserva solo los campos consumidos por esta vista. Un type no inspecciona el JSON recibido.

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

export type CreatedMediaLogDto = {
  id: string
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

type MatchMode = 'AND' | 'OR'

type ValuesFilter<T> = {
  values: T[]
  matchMode: MatchMode
}

type MediaDate = {
  year: number
  month: number
  day: number
}

type MediaDateRange = {
  start: MediaDate | null
  end: MediaDate | null
}

export type ListMediaLogsBody = {
  viewLogType: 'list'
  filters: {
    query: string | null
    status: ValuesFilter<MediaStatus>
    priority: ValuesFilter<MediaPriority>
    mediaType: ValuesFilter<MediaType>
    releaseDateRange: MediaDateRange | null
    genres: ValuesFilter<string>
    tags: ValuesFilter<string>
  }
}

export type MediaLogListItemDto = {
  id: string
  mediaType: MediaType
  title: string
  releaseYear: number | null
  releaseMonth: number | null
  releaseDay: number | null
  status: MediaStatus
  priority: MediaPriority
}
```

### Archivo 2 · src/api/media.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

Los fetchers reciben datos, eligen método y ruta, serializan el body y devuelven DTOs. Entregan paths relativos: el cliente ya añade VITE_API_URL. Búsqueda y detalle admiten sesión opcional; creación y lista la exigen. POST list es lectura aunque use POST: su body lleva filtros estructurados.

**`src/api/media.ts` · archivo completo:**

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  CreateCatalogMediaLogBody,
  CreatedMediaLogDto,
  GetMediaDetailInput,
  MediaDetailDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'
import { requestJsonWithAuth, requestJsonWithOptionalAuth } from './http'

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  return requestJsonWithOptionalAuth<MediaSearchItemDto[]>('/api/v2/media/search', {
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
  return requestJsonWithOptionalAuth<MediaDetailDto>(
    `/api/v2/media/detail?${params.toString()}`,
  )
}

export function createMediaLog(
  body: CreateCatalogMediaLogBody,
): Promise<CreatedMediaLogDto> {
  return requestJsonWithAuth<CreatedMediaLogDto>('/api/v2/media/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
```

### Archivo 3 · src/hooks/media-keys.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

all agrupa Media; searches/details/lists seleccionan familias. Las keys concretas guardan los parámetros consumidos por el fetcher y authScope. El uid separa copias de caché; no permite autenticarse. CREATE_MEDIA_LOG_INVALIDATION_KEYS enumera lecturas que quedaron antiguas tras crear. lists aparece únicamente cuando ya existe su consumidor.

**`src/hooks/media-keys.ts` · archivo completo:**

```ts
import type { GetMediaDetailInput, SearchMediaInput } from '../types/media-api'

export const mediaKeys = {
  all: ['media'] as const,
  searches: () => [...mediaKeys.all, 'search'] as const,
  search: (input: SearchMediaInput, authScope: string) =>
    [
      ...mediaKeys.searches(),
      {
        query: input.query.trim(),
        mediaType: input.mediaType,
        authScope,
      },
    ] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (input: GetMediaDetailInput | null, authScope: string) =>
    [...mediaKeys.details(), { input, authScope }] as const,
}

export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
]
```

### Archivo 4 · src/hooks/features/use-media.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

useAuth entrega checking, anonymous o authenticated. Mientras checking, enabled impide consultas dependientes de sesión. Cada query devuelve el objeto de useQuery, con data/error/isLoading/refetch; no copiamos data. mutationFn recibe el body de mutate. onSuccess del hook espera Promise.all de invalidaciones: isPending sigue true hasta que terminan los intentos de refetch activos. Después corre onSuccess de la llamada montada, que avisa a la interfaz.

**`src/hooks/features/use-media.ts` · archivo completo:**

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createMediaLog, getMediaDetail, searchMedia } from '../../api/media'
import { useAuth } from '../../auth/auth-provider'
import type { GetMediaDetailInput, SearchMediaInput } from '../../types/media-api'
import { CREATE_MEDIA_LOG_INVALIDATION_KEYS, mediaKeys } from '../media-keys'

const emptySearch: SearchMediaInput = {
  query: '',
  mediaType: 'movie',
}

export function useMediaSearch(input: SearchMediaInput | null) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status
  const authReady = authState.status !== 'checking'

  const normalizedInput =
    input === null
      ? emptySearch
      : {
          query: input.query.trim(),
          mediaType: input.mediaType,
        }

  return useQuery({
    queryKey: mediaKeys.search(normalizedInput, authScope),
    queryFn: () => searchMedia(normalizedInput),
    enabled: authReady && input !== null && normalizedInput.query.length >= 2,
  })
}

export function useMediaDetail(input: GetMediaDetailInput | null) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status
  const authReady = authState.status !== 'checking'

  return useQuery({
    queryKey: mediaKeys.detail(input, authScope),
    queryFn: () => {

      if (input === null) {
        throw new Error('Falta la identidad del medio')
      }

      return getMediaDetail(input)
    },
    enabled: authReady && input !== null,
  })
}

export function useCreateMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMediaLog,
    onSuccess: async () => {
      await Promise.all(
        CREATE_MEDIA_LOG_INVALIDATION_KEYS().map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      )
    },
  })
}
```

### Archivo 5 · src/components/create-media-log-form.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

Props separa datos del medio y callbacks. useForm conserva campos uncontrolled y valida con el schema ya conocido. El handler convierte values a body y lo entrega a mutate; no conserva preview ni un segundo pending. isPending bloquea campos, Guardar y Cancelar. El Alert traduce ApiError.status localmente, conserva valores tras fallo y permite reintentar. onCreated se ejecuta después del éxito y las invalidaciones. No se observa isSuccess con un Effect.

**`src/components/create-media-log-form.tsx` · archivo completo:**

```tsx
import { Alert, Button, Group, Select, Stack, Text, Textarea } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'

import { toCreateMediaLogBody } from '../adapters/media-log-form-to-create-body'
import { ApiError } from '../api/http'
import { useCreateMediaLog } from '../hooks/features/use-media'
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
  onCreated: () => void
  onCancel: () => void
}

function getCreateMediaLogErrorMessage(error: unknown): string {

  if (!(error instanceof ApiError)) {
    return 'Ocurrió un error inesperado. Intenta nuevamente.'
  }

  switch (error.status) {
    case 401:
      return 'Tu sesión no pudo usarse para guardar. Vuelve a iniciar sesión.'
    case 404:
      return 'Este medio ya no está disponible en el catálogo.'
    case 409:
      return 'Este medio ya está en tu biblioteca.'
    default:
      return 'El servidor no pudo guardar el medio. Intenta nuevamente.'
  }
}

export function CreateMediaLogForm(props: CreateMediaLogFormProps) {
  const { identity, onCreated, onCancel } = props
  const createMutation = useCreateMediaLog()

  const form = useForm<MediaLogFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      status: 'pending',
      priority: 'medium',
      notes: '',
    },
    validate: schemaResolver(mediaLogFormSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  function handleSubmit(values: MediaLogFormValues) {

    if (createMutation.isPending) {
      return
    }

    const body = toCreateMediaLogBody(identity, values)

    createMutation.mutate(body, {
      onSuccess: onCreated,
    })
  }

  return (
    <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Tipo: {identity.mediaType} · ID: {identity.externalId}
        </Text>

        <Select
          disabled={createMutation.isPending}
          key={form.key('status')}
          label="Estado"
          data={STATUS_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('status')}
        />

        <Select
          disabled={createMutation.isPending}
          key={form.key('priority')}
          label="Prioridad"
          data={PRIORITY_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('priority')}
        />

        <Textarea
          disabled={createMutation.isPending}
          key={form.key('notes')}
          label="Notas"
          placeholder="Opcional"
          autosize
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end">
          <Button
            disabled={createMutation.isPending}
            type="button"
            variant="default"
            onClick={onCancel}
          >
            Cancelar
          </Button>

          <Button
            disabled={createMutation.isPending}
            loading={createMutation.isPending}
            type="submit"
          >
            Guardar
          </Button>
        </Group>

        {createMutation.isError ? (
          <Alert color="red" title="No pudimos guardar">
            {getCreateMediaLogErrorMessage(createMutation.error)}
          </Alert>
        ) : null}
      </Stack>
    </form>
  )
}
```

### Archivo 6 · src/components/create-media-log-modal.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

El store sigue conservando únicamente la selección. El modal monta el formulario al abrir; la key distingue tipo e ID. onCancel y onCreated comunican cierre por motivos diferentes. El cierre manual por X, Escape u overlay abandona el formulario, pero no cancela una petición enviada. Las invalidaciones definidas en el hook continúan aunque el formulario se desmonte.

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
          onCreated={closeCreate}
        />
      ) : null}
    </Modal>
  )
}
```

### Archivo 7 · src/pages/media-detail-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-02-create-mutation`.

Primero obtiene params, los valida y llama hooks en orden estable. La espera de sesión, URL inválida, carga, error y falta de catálogo tienen salidas propias. El DTO confirmado isLogged controla el texto y disponibilidad de Agregar; no fingimos éxito con un booleano local. El botón entrega el tipo e ID al modal existente.

**`src/pages/media-detail-page.tsx` · archivo completo:**

```tsx
import { Anchor, Button, Container, Stack } from '@mantine/core'
import { Link, useParams } from 'react-router'

import { mediaCatalogDetailToModel } from '../adapters/media-catalog-detail-to-model'
import { toMediaDetailInput } from '../adapters/media-detail-route-params-to-input'
import { useAuth } from '../auth/auth-provider'
import { MediaDetailContent } from '../components/media-detail-content'
import { MediaDocumentTitle } from '../components/media-document-title'
import { PageState } from '../components/page-state'
import { useMediaDetail } from '../hooks/features/use-media'
import { useCreateMediaLogModalStore } from '../stores/create-media-log-modal-store'

export function MediaDetailPage() {
  const authState = useAuth()
  const openCreate = useCreateMediaLogModalStore((state) => state.openCreate)

  const params = useParams()
  const detailInput = toMediaDetailInput(params)
  const detailQuery = useMediaDetail(detailInput)

  if (detailInput === null) {
    return <PageState variant="invalid" />
  }

  if (authState.status === 'checking') {
    return <PageState variant="loading" title="Comprobando sesión" />
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

        <Button
          disabled={detailQuery.data.isLogged}
          onClick={() => openCreate(detailInput)}
        >
          {detailQuery.data.isLogged ? 'En tu biblioteca' : 'Agregar a mi biblioteca'}
        </Button>

        <Anchor component={Link} to="/search">
          Volver a la búsqueda
        </Anchor>
      </Stack>
    </Container>
  )
}
```

### Archivo 8 · src/schemas/media-log.ts

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-step-02-create-mutation`.

Referencia heredada: campos cerrados de estado/prioridad y notas con límite local. Mantine valida estos valores antes de llamar al handler. No valida tokens ni la respuesta del servidor.

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

### Archivo 9 · src/adapters/media-log-form-to-create-body.ts

**Acción:** Comprueba la referencia heredada; no volver a escribir. **Referencia:** `session-13-step-02-create-mutation`.

Referencia heredada: combina tipo/ID elegidos con valores de formulario. Recorta notes y convierte vacío a null. source:catalog pide al servidor resolver metadata; no enviamos un título inventado.

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

**Pregunta:** «¿El modal o el hook decide qué consultas quedaron antiguas?» **Respuesta esperada:** El hook decide las familias; el formulario comunica éxito visual con onCreated después de esa espera.

**Comprueba:** Guardado pendiente visible, error recuperable, éxito con modal cerrado y isLogged confirmado. Si falla un refetch después del 201, eso no deshace el registro aceptado; inspecciona la query y reintenta su lectura, no repitas a ciegas el POST.

**Para retomar:** registra este bloque, la rama guardada y qué observación faltó. Continúa solo cuando su salida esté comprobada.

## S13-B05 · Body completo y consulta privada · 47–60

**Entrada:** `session-13-step-02-create-mutation`. **Salida:** `session-13-step-03-library-query`.

**Responsable:** grupo decide la traducción del filtro; docente entrega soporte del objeto completo y conecta la consulta.

1. Crea el schema del filtro antes de importar su tipo. Completa oralmente la matriz all→movie/series, movie→movie, series→series.
2. Crea el adapter del body completo. No uses una constante base mutable ni merges anidados. Los demás filtros quedan vacíos y las fechas null.
3. Añade getMediaLibrary al fetcher completo; después lists/libraryList a keys y useMediaLibrary al archivo de hooks completo. La key y queryFn reciben el mismo body.
4. Sustituye LibraryPage por el diagnóstico completo de abajo: muestra el primer DTO o null. No es la solución del taller; sirve para ver Network antes de diseñar las filas.
5. Comprueba POST list, body, presencia de Bearer y scope. Consulta una biblioteca vacía y otra con datos si tu entorno lo permite.

### Archivo 1 · src/schemas/library-filter.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-03-library-query`.

El schema admite all y los dos valores canónicos. z.infer deriva LibraryTypeFilter, sin mantener una unión paralela. Más adelante safeParse revisará el string o null recibido desde Select; no valida la respuesta del backend.

**`src/schemas/library-filter.ts` · archivo completo:**

```ts
import { z } from 'zod/v4'

import { MEDIA_TYPE_VALUES } from '../types/media-item'

export const libraryTypeFilterSchema = z.enum(['all', ...MEDIA_TYPE_VALUES])

export type LibraryTypeFilter = z.infer<typeof libraryTypeFilterSchema>
```

### Archivo 2 · src/adapters/library-type-filter-to-list-body.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-03-library-query`.

La entrada es una selección local, la salida el request completo. all produce ambos tipos; una opción concreta produce un array de un elemento. Cada llamada construye objetos y arrays nuevos. No filtra resultados ni ordena; el servidor recibe la restricción. Mantiene desactivados los filtros fuera del alcance.

**`src/adapters/library-type-filter-to-list-body.ts` · archivo completo:**

```ts
import type { LibraryTypeFilter } from '../schemas/library-filter'
import type { ListMediaLogsBody } from '../types/media-api'
import { MEDIA_TYPE_VALUES } from '../types/media-item'

export function toLibraryListBody(
  mediaType: LibraryTypeFilter,
): ListMediaLogsBody {
  const mediaTypeValues = mediaType === 'all'
    ? [...MEDIA_TYPE_VALUES]
    : [mediaType]

  return {
    viewLogType: 'list',
    filters: {
      query: null,
      status: { values: [], matchMode: 'OR' },
      priority: { values: [], matchMode: 'OR' },
      mediaType: { values: mediaTypeValues, matchMode: 'OR' },
      releaseDateRange: null,
      genres: { values: [], matchMode: 'OR' },
      tags: { values: [], matchMode: 'OR' },
    },
  }
}
```

### Archivo 3 · src/api/media.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-03-library-query`.

Los fetchers reciben datos, eligen método y ruta, serializan el body y devuelven DTOs. Entregan paths relativos: el cliente ya añade VITE_API_URL. Búsqueda y detalle admiten sesión opcional; creación y lista la exigen. POST list es lectura aunque use POST: su body lleva filtros estructurados.

**`src/api/media.ts` · archivo completo:**

```ts
import { toMediaDetailSearchParams } from '../adapters/media-input-to-params'
import type {
  CreateCatalogMediaLogBody,
  CreatedMediaLogDto,
  GetMediaDetailInput,
  ListMediaLogsBody,
  MediaDetailDto,
  MediaLogListItemDto,
  MediaSearchItemDto,
  SearchMediaInput,
} from '../types/media-api'
import { requestJsonWithAuth, requestJsonWithOptionalAuth } from './http'

export async function searchMedia(
  input: SearchMediaInput,
): Promise<MediaSearchItemDto[]> {
  return requestJsonWithOptionalAuth<MediaSearchItemDto[]>('/api/v2/media/search', {
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
  return requestJsonWithOptionalAuth<MediaDetailDto>(
    `/api/v2/media/detail?${params.toString()}`,
  )
}

export function createMediaLog(
  body: CreateCatalogMediaLogBody,
): Promise<CreatedMediaLogDto> {
  return requestJsonWithAuth<CreatedMediaLogDto>('/api/v2/media/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export function getMediaLibrary(
  body: ListMediaLogsBody,
): Promise<MediaLogListItemDto[]> {
  return requestJsonWithAuth<MediaLogListItemDto[]>('/api/v2/media/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
```

### Archivo 4 · src/hooks/media-keys.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-03-library-query`.

all agrupa Media; searches/details/lists seleccionan familias. Las keys concretas guardan los parámetros consumidos por el fetcher y authScope. El uid separa copias de caché; no permite autenticarse. CREATE_MEDIA_LOG_INVALIDATION_KEYS enumera lecturas que quedaron antiguas tras crear. lists aparece únicamente cuando ya existe su consumidor.

**`src/hooks/media-keys.ts` · archivo completo:**

```ts
import type {
  GetMediaDetailInput,
  ListMediaLogsBody,
  SearchMediaInput,
} from '../types/media-api'

export const mediaKeys = {
  all: ['media'] as const,
  searches: () => [...mediaKeys.all, 'search'] as const,
  search: (input: SearchMediaInput, authScope: string) =>
    [
      ...mediaKeys.searches(),
      {
        query: input.query.trim(),
        mediaType: input.mediaType,
        authScope,
      },
    ] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (input: GetMediaDetailInput | null, authScope: string) =>
    [...mediaKeys.details(), { input, authScope }] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  libraryList: (body: ListMediaLogsBody, authScope: string) =>
    [...mediaKeys.lists(), { body, authScope }] as const,
}

export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
]
```

### Archivo 5 · src/hooks/features/use-media.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-03-library-query`.

useAuth entrega checking, anonymous o authenticated. Mientras checking, enabled impide consultas dependientes de sesión. Cada query devuelve el objeto de useQuery, con data/error/isLoading/refetch; no copiamos data. mutationFn recibe el body de mutate. onSuccess del hook espera Promise.all de invalidaciones: isPending sigue true hasta que terminan los intentos de refetch activos. Después corre onSuccess de la llamada montada, que avisa a la interfaz.

**`src/hooks/features/use-media.ts` · archivo completo:**

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createMediaLog,
  getMediaDetail,
  getMediaLibrary,
  searchMedia,
} from '../../api/media'
import { useAuth } from '../../auth/auth-provider'
import type {
  GetMediaDetailInput,
  ListMediaLogsBody,
  SearchMediaInput,
} from '../../types/media-api'
import { CREATE_MEDIA_LOG_INVALIDATION_KEYS, mediaKeys } from '../media-keys'

const emptySearch: SearchMediaInput = {
  query: '',
  mediaType: 'movie',
}

export function useMediaSearch(input: SearchMediaInput | null) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status
  const authReady = authState.status !== 'checking'

  const normalizedInput =
    input === null
      ? emptySearch
      : {
          query: input.query.trim(),
          mediaType: input.mediaType,
        }

  return useQuery({
    queryKey: mediaKeys.search(normalizedInput, authScope),
    queryFn: () => searchMedia(normalizedInput),
    enabled: authReady && input !== null && normalizedInput.query.length >= 2,
  })
}

export function useMediaDetail(input: GetMediaDetailInput | null) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status
  const authReady = authState.status !== 'checking'

  return useQuery({
    queryKey: mediaKeys.detail(input, authScope),
    queryFn: () => {

      if (input === null) {
        throw new Error('Falta la identidad del medio')
      }

      return getMediaDetail(input)
    },
    enabled: authReady && input !== null,
  })
}

export function useCreateMediaLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMediaLog,
    onSuccess: async () => {
      await Promise.all(
        CREATE_MEDIA_LOG_INVALIDATION_KEYS().map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      )
    },
  })
}

export function useMediaLibrary(body: ListMediaLogsBody) {
  const authState = useAuth()
  const authScope = authState.status === 'authenticated'
    ? authState.user.uid
    : authState.status

  return useQuery({
    queryKey: mediaKeys.libraryList(body, authScope),
    queryFn: () => getMediaLibrary(body),
    enabled: authState.status === 'authenticated',
  })
}
```

### Archivo 6 · src/pages/library-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-03-library-query`.

La primera versión es diagnóstica y usa all fijo. En el taller, la página conserva solo el filtro local; deriva body, DTOs adaptados y modelos durante el render. useMediaLibrary recibe el mismo body usado en su key. PageState representa carga/error y reintento; EmptyState representa una colección válida vacía. La respuesta mantiene el orden remoto. El Select valida su entrada antes de actualizar el filtro.

**`src/pages/library-page.tsx` · archivo completo:**

```tsx
import { Code, Container, Title } from '@mantine/core'

import { toLibraryListBody } from '../adapters/library-type-filter-to-list-body'
import { useMediaLibrary } from '../hooks/features/use-media'

export function LibraryPage() {
  const body = toLibraryListBody('all')
  const libraryQuery = useMediaLibrary(body)

  return (
    <Container py="xl">
      <Title order={1}>Mi biblioteca</Title>

      <Code block>
        {JSON.stringify(libraryQuery.data?.[0] ?? null, null, 2)}
      </Code>
    </Container>
  )
}
```

**Pregunta:** «¿Por qué all lleva dos tipos explícitos?» **Respuesta esperada:** Porque el curso cubre películas y series. El backend Bootcamp actual exige tipos permitidos no vacíos; el modelo general del servicio también conoce anime. Expresar ambos evita ambigüedad.

**Comprueba:** La consulta devuelve DTO[] en Query y el diagnóstico muestra un DTO o null. Ninguna fila visual, control o test del taller está resuelto.

**Para retomar:** registra este bloque, la rama guardada y qué observación faltó. Continúa solo cuando su salida esté comprobada.

## S13-B06 · Listas coherentes y salida segura · 60–68

**Entrada:** `session-13-step-03-library-query`. **Salida:** `session-13-step-04-consistency-logout`.

**Responsable:** práctica guiada.

1. Amplía el plan de invalidación con lists() ahora que existe su consumidor. No extraigas todavía un helper genérico: Promise.all sigue visible en el hook heredado de B05.
2. Sustituye PrivateHeader completo. Añade useQueryClient y mediaKeys; espera signOut antes de retirar queries y navegar.
3. Crea desde detalle y revisa una lista ya consultada que quedó inactiva: stale no significa un request inmediato. Al volver, su consumidor obtiene datos actuales.
4. Cierra sesión; comprueba retirada de la familia Media. Si signOut rechaza, no retires caché ni navegues como si funcionara.

### Archivo 1 · src/hooks/media-keys.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-04-consistency-logout`.

all agrupa Media; searches/details/lists seleccionan familias. Las keys concretas guardan los parámetros consumidos por el fetcher y authScope. El uid separa copias de caché; no permite autenticarse. CREATE_MEDIA_LOG_INVALIDATION_KEYS enumera lecturas que quedaron antiguas tras crear. lists aparece únicamente cuando ya existe su consumidor.

**`src/hooks/media-keys.ts` · archivo completo:**

```ts
import type {
  GetMediaDetailInput,
  ListMediaLogsBody,
  SearchMediaInput,
} from '../types/media-api'

export const mediaKeys = {
  all: ['media'] as const,
  searches: () => [...mediaKeys.all, 'search'] as const,
  search: (input: SearchMediaInput, authScope: string) =>
    [
      ...mediaKeys.searches(),
      {
        query: input.query.trim(),
        mediaType: input.mediaType,
        authScope,
      },
    ] as const,
  details: () => [...mediaKeys.all, 'detail'] as const,
  detail: (input: GetMediaDetailInput | null, authScope: string) =>
    [...mediaKeys.details(), { input, authScope }] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  libraryList: (body: ListMediaLogsBody, authScope: string) =>
    [...mediaKeys.lists(), { body, authScope }] as const,
}

export const CREATE_MEDIA_LOG_INVALIDATION_KEYS = () => [
  mediaKeys.searches(),
  mediaKeys.details(),
  mediaKeys.lists(),
]
```

### Archivo 2 · src/components/private-header.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-04-consistency-logout`.

useQueryClient obtiene el cliente existente. handleLogout conserva su protección contra repetición. Solo después de await signOut retira mediaKeys.all y navega. Un rechazo conserva la caché y muestra el error. finally no es adecuado para eliminar datos porque también se ejecutaría tras fallo; clear eliminaría familias ajenas.

**`src/components/private-header.tsx` · archivo completo:**

```tsx
import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { auth } from '../firebase/firebase'
import { mediaKeys } from '../hooks/media-keys'

type PrivateHeaderProps = {
  email: string | null
}

export function PrivateHeader(props: PrivateHeaderProps) {
  const { email } = props
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {

    if (isLoggingOut || auth === null) {
      return
    }

    setIsLoggingOut(true)
    setLogoutError(null)

    try {
      await signOut(auth)
      queryClient.removeQueries({ queryKey: mediaKeys.all })
      navigate('/login', { replace: true })
    } catch {
      setLogoutError('No pudimos cerrar la sesión. Intenta nuevamente.')
      setIsLoggingOut(false)
    }
  }

  return (
    <Stack component="header" gap="xs" p="md">
      <Group justify="space-between">
        <Group component="nav">
          <Link to="/search">Buscar</Link>

          <Link to="/app/library">Mi biblioteca</Link>
        </Group>

        <Group>
          <Text size="sm">{email ?? 'Sesión activa'}</Text>

          <Button
            disabled={isLoggingOut}
            loading={isLoggingOut}
            onClick={handleLogout}
            type="button"
            variant="subtle"
          >
            Cerrar sesión
          </Button>
        </Group>
      </Group>

      {logoutError !== null ? <Alert color="red">{logoutError}</Alert> : null}
    </Stack>
  )
}
```

**Pregunta:** «¿Por qué crear invalida y salir elimina?» **Respuesta esperada:** La sesión sigue usando datos después de crear, por eso los actualizamos. Al salir retiramos las copias de esa sesión.

**Comprueba:** Respaldo session-13-workshop-start = este paso. Contiene todo lo guiado y el diagnóstico; omite modelo, adapter visual, filas, cuatro estados finales, filtro interactivo y test nuevo.

**Para retomar:** registra este bloque, la rama guardada y qué observación faltó. Continúa solo cuando su salida esté comprobada.

## S13-B07 · Encargo y predicción antes del descanso · 68–75

1. Sobre el diagnóstico visible, pregunta qué textos debe recibir una fila y quién traducirá id a logId. Explica el ejemplo DTO→modelo→fila sin escribir todavía su solución.
2. Recupera retornos de PageState/EmptyState y pregunta qué estado corresponde a request fallido frente a arreglo vacío. Explica que retry recibe refetch desde la página.
3. Recupera el Select controlado y safeParse conocidos: valor externo → validar → estado → body → query. Recorre oralmente los tres casos; el taller conecta esas piezas.
4. Lee la rúbrica: 20+25+20+20+15=100; extras conocidos máximo10. El contador es derivado y el indicador usa isFetching; no son requisitos base.
5. Comparte session-13-workshop-start solo si se requiere respaldo. No entrega ninguna solución posterior. Evalúa el trabajo observado, no la velocidad al copiar soporte.

**Comprueba:** un equipo explica el orden modelo → estados → control → prueba → recorrido. Todos los conceptos quedaron antes del descanso; después se aplican.

## Descanso · 75–105

30 minutos completos.

## S13-B08 · Modelo y adapter de fila · 105–120

**Entrada:** `session-13-step-04-consistency-logout`. **Salida:** `session-13-step-05-library-model`.

**Responsable:** estudiantes. Esta referencia es privada: no la proyectes ni entregues como seed antes del intento.

1. Extraigan los labels a constants porque ya hay dos consumidores: formulario y filas. Conserven los textos conocidos.
2. Definan el modelo visual y su adapter. Ejemplo de entrada: id `log-demo`, título `Dune`, tipo movie, año 2021, mes/día null, estado pending, prioridad medium. Salida: logId `log-demo`, tipo Película, fecha 2021 y labels legibles. El registro no se transforma en el ID público de Dune.
3. Actualicen el formulario para importar labels y retiren sus copias locales. No se agregan nuevos campos ni un segundo useForm.

### Archivo 1 · src/constants/media-log.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-05-library-model`.

Extraemos labels cuando formulario y filas los necesitan. Record exige un texto por cada valor permitido; se conservan los labels anteriores. Los valores enviados siguen en media-api.ts; estas constantes solo deciden cómo se leen.

**`src/constants/media-log.ts` · archivo completo:**

```ts
import type { MediaPriority, MediaStatus } from '../types/media-api'

export const MEDIA_STATUS_LABELS: Record<MediaStatus, string> = {
  pending: 'Por ver',
  acquired: 'Adquirido',
  watching: 'Viendo',
  seen: 'Visto',
  dropped: 'Abandonado',
  paused: 'En pausa',
}

export const MEDIA_PRIORITY_LABELS: Record<MediaPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}
```

### Archivo 2 · src/types/library-media-list-item.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-05-library-model`.

Este modelo concentra lo que dibuja una fila: logId, título, tipo, fecha, estado y prioridad preparados. logId nombra el registro de la persona, distinto del ID público de la película. No guarda otra copia de estado.

**`src/types/library-media-list-item.ts` · archivo completo:**

```ts
export type LibraryMediaListItemModel = {
  logId: string
  title: string
  mediaTypeLabel: string
  releaseLabel: string
  statusLabel: string
  priorityLabel: string
}
```

### Archivo 3 · src/adapters/media-log-to-library-list-item.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-05-library-model`.

Entrada: un DTO con id y campos remotos. Salida: un modelo con logId y textos legibles. Se renombra el id, se traducen labels y se prepara la fecha sin inventar día o mes ausentes. El adapter es puro: no solicita, modifica el DTO, filtra ni ordena.

**`src/adapters/media-log-to-library-list-item.ts` · archivo completo:**

```ts
import {
  MEDIA_PRIORITY_LABELS,
  MEDIA_STATUS_LABELS,
} from '../constants/media-log'
import type { LibraryMediaListItemModel } from '../types/library-media-list-item'
import type { MediaLogListItemDto } from '../types/media-api'

export function toLibraryMediaListItemModel(
  dto: MediaLogListItemDto,
): LibraryMediaListItemModel {
  const releaseLabel = dto.releaseYear === null
    ? 'Fecha desconocida'
    : String(dto.releaseYear)

  return {
    logId: dto.id,
    title: dto.title,
    mediaTypeLabel: dto.mediaType === 'movie' ? 'Película' : 'Serie',
    releaseLabel,
    statusLabel: MEDIA_STATUS_LABELS[dto.status],
    priorityLabel: MEDIA_PRIORITY_LABELS[dto.priority],
  }
}
```

### Archivo 4 · src/components/create-media-log-form.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-05-library-model`.

Props separa datos del medio y callbacks. useForm conserva campos uncontrolled y valida con el schema ya conocido. El handler convierte values a body y lo entrega a mutate; no conserva preview ni un segundo pending. isPending bloquea campos, Guardar y Cancelar. El Alert traduce ApiError.status localmente, conserva valores tras fallo y permite reintentar. onCreated se ejecuta después del éxito y las invalidaciones. No se observa isSuccess con un Effect.

**`src/components/create-media-log-form.tsx` · archivo completo:**

```tsx
import { Alert, Button, Group, Select, Stack, Text, Textarea } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'

import { toCreateMediaLogBody } from '../adapters/media-log-form-to-create-body'
import { ApiError } from '../api/http'
import {
  MEDIA_PRIORITY_LABELS,
  MEDIA_STATUS_LABELS,
} from '../constants/media-log'
import { useCreateMediaLog } from '../hooks/features/use-media'
import { mediaLogFormSchema, type MediaLogFormValues } from '../schemas/media-log'
import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
  type GetMediaDetailInput,
} from '../types/media-api'

const STATUS_OPTIONS = MEDIA_STATUS_VALUES.map((value) => ({
  value,
  label: MEDIA_STATUS_LABELS[value],
}))

const PRIORITY_OPTIONS = MEDIA_PRIORITY_VALUES.map((value) => ({
  value,
  label: MEDIA_PRIORITY_LABELS[value],
}))

type CreateMediaLogFormProps = {
  identity: GetMediaDetailInput
  onCreated: () => void
  onCancel: () => void
}

function getCreateMediaLogErrorMessage(error: unknown): string {

  if (!(error instanceof ApiError)) {
    return 'Ocurrió un error inesperado. Intenta nuevamente.'
  }

  switch (error.status) {
    case 401:
      return 'Tu sesión no pudo usarse para guardar. Vuelve a iniciar sesión.'
    case 404:
      return 'Este medio ya no está disponible en el catálogo.'
    case 409:
      return 'Este medio ya está en tu biblioteca.'
    default:
      return 'El servidor no pudo guardar el medio. Intenta nuevamente.'
  }
}

export function CreateMediaLogForm(props: CreateMediaLogFormProps) {
  const { identity, onCreated, onCancel } = props
  const createMutation = useCreateMediaLog()

  const form = useForm<MediaLogFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      status: 'pending',
      priority: 'medium',
      notes: '',
    },
    validate: schemaResolver(mediaLogFormSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  function handleSubmit(values: MediaLogFormValues) {

    if (createMutation.isPending) {
      return
    }

    const body = toCreateMediaLogBody(identity, values)

    createMutation.mutate(body, {
      onSuccess: onCreated,
    })
  }

  return (
    <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Tipo: {identity.mediaType} · ID: {identity.externalId}
        </Text>

        <Select
          disabled={createMutation.isPending}
          key={form.key('status')}
          label="Estado"
          data={STATUS_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('status')}
        />

        <Select
          disabled={createMutation.isPending}
          key={form.key('priority')}
          label="Prioridad"
          data={PRIORITY_OPTIONS}
          allowDeselect={false}
          {...form.getInputProps('priority')}
        />

        <Textarea
          disabled={createMutation.isPending}
          key={form.key('notes')}
          label="Notas"
          placeholder="Opcional"
          autosize
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end">
          <Button
            disabled={createMutation.isPending}
            type="button"
            variant="default"
            onClick={onCancel}
          >
            Cancelar
          </Button>

          <Button
            disabled={createMutation.isPending}
            loading={createMutation.isPending}
            type="submit"
          >
            Guardar
          </Button>
        </Group>

        {createMutation.isError ? (
          <Alert color="red" title="No pudimos guardar">
            {getCreateMediaLogErrorMessage(createMutation.error)}
          </Alert>
        ) : null}
      </Stack>
    </form>
  )
}
```

**Pregunta:** «¿Por qué lo llamamos logId?» **Respuesta esperada:** Identifica el registro de esta persona; no el medio compartido del catálogo.

**Comprueba:** Un DTO produce un modelo legible sin mutarlo; formulario conserva labels y guardado.

**Para retomar:** guarda este paso y el primer comportamiento pendiente antes de pasar al siguiente.

## S13-B09 · Filas y cuatro estados · 120–132

**Entrada:** `session-13-step-05-library-model`. **Salida:** `session-13-step-06-library-states`.

**Responsable:** estudiantes, con preguntas del docente. Las props, map, retornos y componentes de estado ya se explicaron antes del descanso.

1. Construyan una fila que reciba el modelo y una lista que lo distribuya con key=logId. No conecten todavía una ruta privada por id.
2. Sustituyan el diagnóstico de LibraryPage; adapten DTOs durante render. Primero mantengan all fijo.
3. Separen carga, error con reintento, colección vacía y éxito. No presenten un error como vacío. Revisen también ausencia de respuesta por conexión antes de asumir un éxito.
4. Usen los componentes heredados completos que aparecen al final de este bloque. No volver a escribir PageState, EmptyState o CSS; están disponibles en el seed.

### Archivo 1 · src/components/library-media-list-item.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-06-library-states`.

La fila recibe un modelo visual por props y dibuja sus textos con Mantine. Su estilo está en las props visibles de este archivo. No conoce fetchers, DTOs ni Query y todavía no enlaza un detalle privado.

**`src/components/library-media-list-item.tsx` · archivo completo:**

```tsx
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'

import type { LibraryMediaListItemModel } from '../types/library-media-list-item'

type LibraryMediaListItemProps = {
  data: LibraryMediaListItemModel
}

export function LibraryMediaListItem(props: LibraryMediaListItemProps) {
  const { data } = props

  return (
    <Card component="li" padding="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={2} size="h3">{data.title}</Title>

          <Badge variant="light">{data.mediaTypeLabel}</Badge>
        </Group>

        <Text size="sm" c="dimmed">{data.releaseLabel}</Text>

        <Group gap="xs">
          <Text size="sm">Estado: {data.statusLabel}</Text>

          <Text size="sm">Prioridad: {data.priorityLabel}</Text>
        </Group>
      </Stack>
    </Card>
  )
}
```

### Archivo 2 · src/components/library-media-list.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-06-library-states`.

La lista recibe modelos; map conserva su orden y entrega cada uno a la fila. key usa logId, estable aunque cambie la posición. No usamos índices ni ordenamiento local.

**`src/components/library-media-list.tsx` · archivo completo:**

```tsx
import { Stack } from '@mantine/core'

import type { LibraryMediaListItemModel } from '../types/library-media-list-item'
import { LibraryMediaListItem } from './library-media-list-item'

type LibraryMediaListProps = {
  items: LibraryMediaListItemModel[]
}

export function LibraryMediaList(props: LibraryMediaListProps) {
  const { items } = props

  return (
    <Stack component="ul" gap="sm" p={0} m={0} style={{ listStyle: 'none' }}>
      {items.map((item) => (
        <LibraryMediaListItem
          key={item.logId}
          data={item}
        />
      ))}
    </Stack>
  )
}
```

### Archivo 3 · src/pages/library-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-06-library-states`.

La primera versión es diagnóstica y usa all fijo. En el taller, la página conserva solo el filtro local; deriva body, DTOs adaptados y modelos durante el render. useMediaLibrary recibe el mismo body usado en su key. PageState representa carga/error y reintento; EmptyState representa una colección válida vacía. La respuesta mantiene el orden remoto. El Select valida su entrada antes de actualizar el filtro.

**`src/pages/library-page.tsx` · archivo completo:**

```tsx
import { Container, Stack, Title } from '@mantine/core'

import { toLibraryListBody } from '../adapters/library-type-filter-to-list-body'
import { toLibraryMediaListItemModel } from '../adapters/media-log-to-library-list-item'
import { EmptyState } from '../components/empty-state'
import { LibraryMediaList } from '../components/library-media-list'
import { PageState } from '../components/page-state'
import { useMediaLibrary } from '../hooks/features/use-media'

export function LibraryPage() {
  const body = toLibraryListBody('all')
  const libraryQuery = useMediaLibrary(body)
  const items = (libraryQuery.data ?? []).map(toLibraryMediaListItemModel)

  function renderLibraryContent() {

    if (libraryQuery.isLoading) {
      return <PageState variant="loading" title="Cargando biblioteca" />
    }

    if (libraryQuery.isError) {
      return (
        <PageState
          variant="error"
          title="No pudimos cargar tu biblioteca"
          onRetry={() => void libraryQuery.refetch()}
        />
      )
    }

    if (libraryQuery.data === undefined) {
      return (
        <PageState
          variant="unavailable"
          title="Esperando conexión"
          description="Aún no hay una respuesta. Revisa tu conexión."
          onRetry={() => void libraryQuery.refetch()}
        />
      )
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="Tu biblioteca está vacía"
          description="Busca una película o serie y agrégala a tu biblioteca."
        />
      )
    }

    return <LibraryMediaList items={items} />
  }

  return (
    <Container py="xl">
      <Stack gap="lg">
        <Title order={1}>Mi biblioteca</Title>

        {renderLibraryContent()}
      </Stack>
    </Container>
  )
}
```

### Archivo 4 · src/components/page-state.tsx

**Acción:** Comprueba soporte heredado; no volver a escribir. **Referencia:** `session-13-step-06-library-states`.

Referencia heredada: presenta estados de página con copy y color por variante. Loader señala espera; Alert señala problema; onRetry conecta el botón con refetch que proporciona la página. No realiza requests por sí mismo.

**`src/components/page-state.tsx` · archivo completo:**

```tsx
import { Alert, Button, Loader, Stack, Text } from '@mantine/core'

export type PageStateVariant =
  | 'loading'
  | 'error'
  | 'invalid'
  | 'unavailable'

type PageStateProps = Readonly<{
  variant: PageStateVariant
  title?: string
  description?: string
  onRetry?: () => void
}>

const PAGE_STATE_COPY: Record<
  PageStateVariant,
  Readonly<{ title: string; description: string; color: string }>
> = {
  loading: {
    title: 'Cargando contenido',
    description: 'Espera mientras recuperamos la información.',
    color: 'blue',
  },
  error: {
    title: 'No pudimos cargar el contenido',
    description: 'Intenta nuevamente.',
    color: 'red',
  },
  invalid: {
    title: 'Dirección no válida',
    description: 'Revisa el enlace o vuelve a la página anterior.',
    color: 'yellow',
  },
  unavailable: {
    title: 'Contenido no disponible',
    description: 'No encontramos información para mostrar.',
    color: 'gray',
  },
}

export function PageState(props: PageStateProps) {
  const { variant, title, description, onRetry } = props
  const copy = PAGE_STATE_COPY[variant]
  const resolvedTitle = title ?? copy.title
  const resolvedDescription = description ?? copy.description
  const canRetry =
    (variant === 'error' || variant === 'unavailable') &&
    onRetry !== undefined

  if (variant === 'loading') {
    return (
      <Stack align="center" gap="sm" py="xl" role="status">
        <Loader aria-label={resolvedTitle} color={copy.color} />

        <Text fw={600}>{resolvedTitle}</Text>

        <Text c="dimmed" ta="center">
          {resolvedDescription}
        </Text>
      </Stack>
    )
  }

  return (
    <Alert color={copy.color} title={resolvedTitle}>
      <Stack gap="sm">
        <Text>{resolvedDescription}</Text>

        {canRetry ? (
          <Button type="button" onClick={onRetry} variant="light">
            Reintentar
          </Button>
        ) : null}
      </Stack>
    </Alert>
  )
}
```

### Archivo 5 · src/components/empty-state.tsx

**Acción:** Comprueba soporte heredado; no volver a escribir. **Referencia:** `session-13-step-06-library-states`.

Referencia heredada: muestra título y descripción cuando la consulta produjo cero elementos. Su clase CSS ya existe; no sustituye un error de red.

**`src/components/empty-state.tsx` · archivo completo:**

```tsx
type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState(props: EmptyStateProps) {
  const { title, description } = props
  return (
    <section className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  )
}
```

### Archivo 6 · src/index.css

**Acción:** Comprueba soporte heredado; no volver a escribir. **Referencia:** `session-13-step-06-library-states`.

Soporte visual heredado, no volver a escribir. Su contenido completo permite comprobar también .empty-state sin abrir otro archivo de referencia. No se agregan estilos nuevos en esta sesión: Mantine recibe las props visuales incluidas en cada componente.

**`src/index.css` · archivo completo:**

```css
:root {
  font-family: Inter, system-ui, sans-serif;
  color: #f5f1e8;
  background: #141412;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

.app-header,
.page-container {
  width: min(960px, calc(100% - 32px));
  margin: 0 auto;
}

.app-header {
  padding: 64px 0 32px;
  border-bottom: 1px solid #3b3a34;
}

.app-header__eyebrow,
.media-card__meta {
  color: #d2a84a;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-container {
  padding: 32px 0 64px;
}

.media-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 24px;
  padding: 24px;
  border: 1px solid #3b3a34;
  border-radius: 16px;
  background: #1d1d1a;
}

.media-card__poster {
  display: grid;
  min-height: 220px;
  place-items: center;
  border-radius: 10px;
  color: #a9a59a;
  background: #2a2924;
}

@media (max-width: 600px) {
  .media-card {
    grid-template-columns: 1fr;
  }
}
.media-list {
  display: grid;
  gap: 24px;
}
.media-card__poster-image {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  object-fit: cover;
}

.empty-state {
  padding: 48px 24px;
  border: 1px dashed #565349;
  border-radius: 16px;
  text-align: center;
  color: #a9a59a;
}

.empty-state h3 {
  margin-top: 0;
  color: #f5f1e8;
}

.media-type-badge {
  display: inline-flex;
  padding: 2px 8px;
  border: 1px solid currentColor;
  border-radius: 999px;
}

.search-input {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
}

.search-input input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
}

.search-input input:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.media-type-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.media-type-filter button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.media-type-filter button[aria-pressed='true'] {
  border-color: #d9be74;
  background: #d9be74;
  color: #141412;
}

.media-type-filter button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.filter-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-summary p {
  margin: 0;
}

.filter-summary button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.filter-summary button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-summary button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.media-detail-content img {
  display: block;
  width: 160px;
  max-width: 100%;
  height: auto;
  margin-bottom: 16px;
  border-radius: 10px;
}

.detail-button {
  padding: 10px 16px;
  border: 1px solid #565349;
  border-radius: 10px;
  background: #20201b;
  color: #f5f1e8;
  font: inherit;
  cursor: pointer;
}

.detail-button:focus-visible {
  outline: 2px solid #d9be74;
  outline-offset: 2px;
}

.selection-preview {
  margin-bottom: 24px;
}
```

**Pregunta:** «¿Dónde conservamos las filas adaptadas?» **Respuesta esperada:** Se derivan durante render; Query conserva el DTO y no añadimos useState para copiarlo.

**Comprueba:** Biblioteca muestra filas en el orden remoto y salidas distintas ante carga, error y vacío.

**Para retomar:** guarda este paso y el primer comportamiento pendiente antes de pasar al siguiente.

## S13-B10 · Control de tipo validado · 132–143

**Entrada:** `session-13-step-06-library-states`. **Salida:** `session-13-step-07-library-filter`.

**Responsable:** estudiantes.

1. Agreguen un único estado LibraryTypeFilter inicial all a la página.
2. Conecten Select con Todos/Películas/Series. En su handler, safeParse revisa string|null; un valor inválido no cambia la selección. No usen un cast.
3. Deriven toLibraryListBody desde el filtro y pásenlo al mismo hook. No añadan Effects, URL o Zustand.
4. Comprueben cada body en Network y cada key en Devtools. La página no filtra ni ordena la respuesta localmente.

### Archivo 1 · src/pages/library-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-07-library-filter`.

La primera versión es diagnóstica y usa all fijo. En el taller, la página conserva solo el filtro local; deriva body, DTOs adaptados y modelos durante el render. useMediaLibrary recibe el mismo body usado en su key. PageState representa carga/error y reintento; EmptyState representa una colección válida vacía. La respuesta mantiene el orden remoto. El Select valida su entrada antes de actualizar el filtro.

**`src/pages/library-page.tsx` · archivo completo:**

```tsx
import { Container, Select, Stack, Title } from '@mantine/core'
import { useState } from 'react'

import { toLibraryListBody } from '../adapters/library-type-filter-to-list-body'
import { toLibraryMediaListItemModel } from '../adapters/media-log-to-library-list-item'
import { EmptyState } from '../components/empty-state'
import { LibraryMediaList } from '../components/library-media-list'
import { PageState } from '../components/page-state'
import { useMediaLibrary } from '../hooks/features/use-media'
import {
  libraryTypeFilterSchema,
  type LibraryTypeFilter,
} from '../schemas/library-filter'

export function LibraryPage() {
  const [typeFilter, setTypeFilter] = useState<LibraryTypeFilter>('all')
  const body = toLibraryListBody(typeFilter)
  const libraryQuery = useMediaLibrary(body)
  const items = (libraryQuery.data ?? []).map(toLibraryMediaListItemModel)

  function handleTypeChange(value: string | null) {
    const result = libraryTypeFilterSchema.safeParse(value)

    if (!result.success) {
      return
    }

    setTypeFilter(result.data)
  }

  function renderLibraryContent() {

    if (libraryQuery.isLoading) {
      return <PageState variant="loading" title="Cargando biblioteca" />
    }

    if (libraryQuery.isError) {
      return (
        <PageState
          variant="error"
          title="No pudimos cargar tu biblioteca"
          onRetry={() => void libraryQuery.refetch()}
        />
      )
    }

    if (libraryQuery.data === undefined) {
      return (
        <PageState
          variant="unavailable"
          title="Esperando conexión"
          description="Aún no hay una respuesta. Revisa tu conexión."
          onRetry={() => void libraryQuery.refetch()}
        />
      )
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="No hay registros para este tipo"
          description="Cambia el filtro o agrega una película o serie desde la búsqueda."
        />
      )
    }

    return <LibraryMediaList items={items} />
  }

  return (
    <Container py="xl">
      <Stack gap="lg">
        <Title order={1}>Mi biblioteca</Title>

        <Select
          label="Tipo de medio"
          allowDeselect={false}
          data={[
            { value: 'all', label: 'Todos' },
            { value: 'movie', label: 'Películas' },
            { value: 'series', label: 'Series' },
          ]}
          value={typeFilter}
          onChange={handleTypeChange}
        />

        {renderLibraryContent()}
      </Stack>
    </Container>
  )
}
```

**Pregunta:** «¿Cambiar el Select filtra los resultados por sí mismo?» **Respuesta esperada:** No. Cambia el estado local; de él se deriva un body nuevo que Query usa para pedir otra lista.

**Comprueba:** Tres selecciones, tres bodies coherentes y ninguna petición que incluya anime.

**Para retomar:** guarda este paso y el primer comportamiento pendiente antes de pasar al siguiente.

## S13-B11 · Trabajo con agente: test del body · 143–152

**Entrada:** `session-13-step-07-library-filter`. **Salida:** `session-13-step-08-filter-tests`.

**Responsable:** persona define matriz; agente solo redacta prueba; persona lee y ejecuta.

1. Antes de invocar al agente, acuerden los cinco comportamientos: all produce movie/series; movie produce movie; series produce series; ninguna salida incluye anime; cada llamada conserva estructuras independientes y filtros no interactivos vacíos.
2. Usa este prompt completo:

```text
Usa la skill ahk-test. Parte del adapter implementado
src/adapters/library-type-filter-to-list-body.ts.
Objetivo único: probar toLibraryListBody con Vitest, con esta matriz humana:
all => [movie, series]; movie => [movie]; series => [series];
ninguna salida contiene anime; dos llamadas devuelven objetos y arrays
independientes y conservan vacíos los filtros no interactivos.
Puedes crear únicamente:
src/adapters/__tests__/library-type-filter-to-list-body.test.ts
y soporte exclusivo dentro de src/adapters/__tests__/.
Producción, hooks, componentes, Firebase, configuración, dependencias,
otros tests y lockfile son solo lectura. No uses snapshots ni debilites
expectativas. Si contradice el contrato, detente y explica el problema.
Ejecuta pnpm exec vitest run src/adapters/__tests__/library-type-filter-to-list-body.test.ts.
Entrega matriz, archivos, comando, exit status, entradas/salidas,
supuestos y qué no acredita. No afirmes haber probado UI o backend.
```

3. Lee cada expectativa y el diff; explica una entrada y su salida. Ejecuta el test otra vez. Si el agente no responde, el docente entrega la referencia de abajo después de acordar la matriz; se lee igual antes de ejecutarla.

### Archivo 1 · src/adapters/__tests__/library-type-filter-to-list-body.test.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-13-step-08-filter-tests`.

Cada caso llama al adapter real y compara el body observable. La matriz humana decide all/movie/series, exclusión de anime, filtros desactivados y estructuras independientes. Mutar una salida de prueba no debe modificar otra. Estos tests no montan Select, Query ni Firebase.

**`src/adapters/__tests__/library-type-filter-to-list-body.test.ts` · archivo completo:**

```ts
import { describe, expect, it } from 'vitest'

import { toLibraryListBody } from '../library-type-filter-to-list-body'

describe('toLibraryListBody', () => {
  it('Todos pide películas y series', () => {
    expect(toLibraryListBody('all').filters.mediaType.values).toEqual([
      'movie',
      'series',
    ])
  })

  it('Películas pide solo movie', () => {
    expect(toLibraryListBody('movie').filters.mediaType.values).toEqual(['movie'])
  })

  it('Series pide solo series', () => {
    expect(toLibraryListBody('series').filters.mediaType.values).toEqual(['series'])
  })

  it('ninguna opción amplía el dominio a anime', () => {
    const filters = ['all', 'movie', 'series'] as const

    for (const filter of filters) {
      const values = toLibraryListBody(filter).filters.mediaType.values

      expect(values).not.toContain('anime')
      expect(values.length).toBeGreaterThan(0)
    }
  })

  it('conserva la vista y los filtros no interactivos vacíos', () => {
    expect(toLibraryListBody('all')).toEqual({
      viewLogType: 'list',
      filters: {
        query: null,
        status: { values: [], matchMode: 'OR' },
        priority: { values: [], matchMode: 'OR' },
        mediaType: { values: ['movie', 'series'], matchMode: 'OR' },
        releaseDateRange: null,
        genres: { values: [], matchMode: 'OR' },
        tags: { values: [], matchMode: 'OR' },
      },
    })
  })

  it('crea estructuras independientes entre llamadas', () => {
    const first = toLibraryListBody('all')
    const second = toLibraryListBody('all')

    expect(first).not.toBe(second)
    expect(first.filters).not.toBe(second.filters)

    const filterNames = ['status', 'priority', 'mediaType', 'genres', 'tags'] as const

    for (const name of filterNames) {
      expect(first.filters[name]).not.toBe(second.filters[name])
      expect(first.filters[name].values).not.toBe(second.filters[name].values)
    }

    first.filters.mediaType.values.pop()
    first.filters.tags.values.push('temporal')

    expect(second.filters.mediaType.values).toEqual(['movie', 'series'])
    expect(second.filters.tags.values).toEqual([])
  })
})
```

**Pregunta:** «¿La suite prueba que Select envió un Bearer?» **Respuesta esperada:** No. Solo invoca una función pura; control, cliente y sesión necesitan comprobación independiente.

**Comprueba:** Prueba dirigida ejecutada y leída, sin cambios de producción por el agente.

**Para retomar:** guarda este paso y el primer comportamiento pendiente antes de pasar al siguiente.

## S13-B12 · Comprobar el recorrido · 152–165

1. Ejecuta los checks locales y conserva sus salidas reales:

```bash
pnpm exec vitest run src/adapters/__tests__/library-type-filter-to-list-body.test.ts
pnpm test
pnpm lint
pnpm build
```

2. En una cuenta de prueba, abre detalle y guarda película/serie. Comprueba un POST, espera visible y cambio confirmado de isLogged. Revisa biblioteca, filtro y logout.
3. Simula errores solo con un entorno controlado o datos propios; registra qué entorno respondió. Un 401 conserva el formulario y no dispara logout global; 404/409 tienen copy local; un fallo general conserva values. No provoques errores cambiando datos ajenos.
4. Comprueba las tres selecciones y orden recibido; sin .filter/.sort. Recarga biblioteca autenticada y compara una segunda cuenta si está disponible: body igual, scope distinto.
5. En Devtools confirma invalidez de familias después de crear y retirada Media tras logout. No proyectes valores Authorization.

| Caso | Resultado esperado |
| --- | --- |
| Firebase ausente | Catálogo público disponible; aviso de configuración en acceso. |
| checking | Espera de sesión explícita y ninguna consulta dependiente prematura. |
| Anonymous/autenticado | Keys separadas; token solo en request autenticado. |
| Guardar pendiente | Campos y acciones bloqueados; un POST por intención. |
| 401/404/409/general | Mensaje local, values conservados, posibilidad de reintentar. |
| 201 y refetch | La mutación espera intentos activos; después cierra y muestra dato confirmado. |
| Refetch falla después de 201 | Error de lectura no equivale a creación fallida ni deshace el registro. |
| Biblioteca carga/error/vacío/éxito | Mensajes distinguibles; retry para error; lista en orden remoto. |
| Todos/Películas/Series | Body y key concuerdan, dominio movie/series. |
| Logout correcto | Media retirado y navegación a Login. |
| Logout rechazado | Sesión/caché conservadas y reintento disponible. |

Los extras se realizan solamente tras la base: contador con models.length y aviso isFetching sin ocultar datos presentes. No forman parte de session-13-end; no hay nuevos conceptos o archivos obligatorios para obtener puntos extra.

### Referencia privada opcional · contador e indicador

Solo tras completar la base. No entregues esta variante como seed ni como requisito. Usa las mismas piezas conocidas: items.length deriva la cantidad y isFetching informa actualización; data !== undefined evita presentar una primera carga como actualización de datos presentes. No añade estado o query.

1. Para el contador (+5), añade Text al import y la línea que usa items.length.
2. Para el indicador (+5), conserva también el condicional de actualización. Puedes aplicar ambas mejoras o solo una; cada una se evalúa separadamente.
3. La variante completa de LibraryPage con ambas mejoras se muestra debajo. Para regresar al cierre base, retira esos dos bloques y Text del import; la referencia base completa ya figura en S13-B10.

**`src/pages/library-page.tsx` · variante opcional completa, fuera de la rama canónica:**

```tsx
import { Container, Select, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'

import { toLibraryListBody } from '../adapters/library-type-filter-to-list-body'
import { toLibraryMediaListItemModel } from '../adapters/media-log-to-library-list-item'
import { EmptyState } from '../components/empty-state'
import { LibraryMediaList } from '../components/library-media-list'
import { PageState } from '../components/page-state'
import { useMediaLibrary } from '../hooks/features/use-media'
import {
  libraryTypeFilterSchema,
  type LibraryTypeFilter,
} from '../schemas/library-filter'

export function LibraryPage() {
  const [typeFilter, setTypeFilter] = useState<LibraryTypeFilter>('all')
  const body = toLibraryListBody(typeFilter)
  const libraryQuery = useMediaLibrary(body)
  const items = (libraryQuery.data ?? []).map(toLibraryMediaListItemModel)

  function handleTypeChange(value: string | null) {
    const result = libraryTypeFilterSchema.safeParse(value)

    if (!result.success) {
      return
    }

    setTypeFilter(result.data)
  }

  function renderLibraryContent() {

    if (libraryQuery.isLoading) {
      return <PageState variant="loading" title="Cargando biblioteca" />
    }

    if (libraryQuery.isError) {
      return (
        <PageState
          variant="error"
          title="No pudimos cargar tu biblioteca"
          onRetry={() => void libraryQuery.refetch()}
        />
      )
    }

    if (libraryQuery.data === undefined) {
      return (
        <PageState
          variant="unavailable"
          title="Esperando conexión"
          description="Aún no hay una respuesta. Revisa tu conexión."
          onRetry={() => void libraryQuery.refetch()}
        />
      )
    }

    if (items.length === 0) {
      return (
        <EmptyState
          title="No hay registros para este tipo"
          description="Cambia el filtro o agrega una película o serie desde la búsqueda."
        />
      )
    }

    return <LibraryMediaList items={items} />
  }

  return (
    <Container py="xl">
      <Stack gap="lg">
        <Title order={1}>Mi biblioteca</Title>

        <Select
          label="Tipo de medio"
          allowDeselect={false}
          data={[
            { value: 'all', label: 'Todos' },
            { value: 'movie', label: 'Películas' },
            { value: 'series', label: 'Series' },
          ]}
          value={typeFilter}
          onChange={handleTypeChange}
        />

        <Text size="sm">{items.length} registros en esta vista</Text>

        {libraryQuery.isFetching && libraryQuery.data !== undefined ? (
          <Text role="status" size="sm" c="dimmed">
            Actualizando biblioteca…
          </Text>
        ) : null}

        {renderLibraryContent()}
      </Stack>
    </Container>
  )
}
```

## S13-B13 · Demostración y cierre oral · 165–180

1. **165–173:** un equipo demuestra crear, biblioteca, filtro y salida. Otro señala qué capa prueba cada evidencia.
2. **173–177:** formula las preguntas siguientes sin volver al deck.
3. **177–180:** registra el checkpoint o la pausa y anticipa únicamente el problema que resolverá 14.

- **¿Por qué invalidar no basta si el detalle continúa anónimo?** El servidor no puede calcular el isLogged de la persona sin credencial; la key también debe separar esa respuesta.
- **¿Qué cambia con el filtro?** Estado local → body → key y queryFn. El servidor produce la colección; React no filtra otra copia.
- **¿Por qué esperar Promise.all?** Para que la mutación permanezca pendiente durante los refetch activos antes de avisar éxito visual. No garantiza que cada refetch termine con datos válidos; su error sigue en Query.
- **¿Por qué salir retira caché después de signOut?** No debemos borrar datos de una sesión que no logró cerrarse.
- **¿Qué identifica logId?** Un registro personal. La sesión14 le dará una URL; hoy ninguna fila navega por él.

```text
Sesión: 13
Último bloque y paso comprobado:
Rama o commit guardado:
Comportamiento observado:
Primer paso pendiente:
Tests/build pendientes:
Recorrido real Firebase/backend pendiente:
```

Un respaldo recupera archivos; no acredita comprensión. La próxima reunión comienza por ese punto y no por contenido nuevo dependiente.

## Errores frecuentes y contingencia

| Hallazgo | Intervención |
| --- | --- |
| Base URL duplicada | Fetcher entrega path relativo; http.ts añade la base. |
| auth.currentUser rompe catálogo | Revisar auth:null antes de leer currentUser. |
| Vacío durante checking | Mostrar espera de sesión; enabled:false no significa petición en curso. |
| isLogged no cambia | Revisar Bearer, scope e invalidación; no sustituir DTO por estado local. |
| Modal se cerró manualmente durante request | Explicar que cierre no cancela; invalidaciones del hook siguen. No atribuir callback visual a un componente desmontado. |
| Se repite create porque falla refetch | Inspeccionar POST201 y query fallida; no repetir escritura aceptada. |
| Lista error parece vacía | Reservar EmptyState para una colección válida; usar PageState para error. |
| Filtro usa cast, Effect o .filter | safeParse del control, estado local y body remoto. |
| Caché desaparece tras fallo de logout | Retirar removeQueries de finally; esperar signOut correcto. |
| No hay backend/Firebase | Construir adapters y vista con respuestas controladas declaradas; dejar autorización y recorrido real pendientes. |
| No alcanza tiempo | Entregar soporte del bloque actual, verificar su decisión y registrar pausa. No acortar descanso/taller ni empezar14. |
| Agente falla | Conservar matriz humana y leer la referencia privada antes de ejecutarla. |

## Fronteras de evidencia y siguiente dependencia

Test puro demuestra la transformación del body. Build comprueba tipos y empaquetado. Una simulación HTTP con SDK real comprueba la integración contra respuestas preparadas, no la aceptación de credenciales por Firebase o el servidor público. Network/Devtools/manual prueban solo ese recorrido observado. No afirmar CORS, allowlist o éxito autenticado real sin ejecutarlos.

La salida13 conserva logId y labels para14. No añade /app/library/:logId, selector discriminado, PUT, DELETE, filtros avanzados, URL, otro propietario del DTO o dependencias de prueba.

## Fuentes verificadas

26 de octubre de 2026: contrato público `/openapi` de bootcamp-medialog.cardor.dev; create201 y list200 documentados, ambos Bearer. El body válido sin token recibió401; eso no comprueba una operación autenticada real. El contrato Bootcamp actual rechaza mediaType vacío; se mantienen movie/series explícitos.

Context7, con versiones instaladas de cohorte: TanStack Query5.102.8 y Mantine9.4.1; documentación vigente para mutation/callbacks, invalidación/removal y formulario uncontrolled. No se actualizan dependencias. Mintlify no estuvo disponible.

- [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations).
- [Invalidaciones desde mutaciones](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations).
- [QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient).
- [Mantine: modo uncontrolled](https://mantine.dev/form/uncontrolled/).
