# Clase 14 · Firebase Auth y rutas privadas

- **Semana:** 5
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** checkpoint de la clase 13: `/login` y `/register` validan formato localmente con Mantine Form y Zod, pero su submit no crea cuenta, no inicia sesión y no consulta Firebase
- **Checkpoint de salida:** cada estudiante puede crear cuenta o iniciar sesión con su proyecto Firebase; la sesión se restaura al recargar y `/app/library` solo se representa para una sesión autenticada

## Resultado de aprendizaje

El estudiante podrá conectar Firebase Authentication a formularios ya validados, separar el estado global de sesión del estado local de una operación de formulario y proteger una rama de React Router sin usar un Effect para navegar.

## Limitación que abre la clase

La clase 13 ya puede responder si una entrada tiene formato válido. No puede saber si esa cuenta existe, si la contraseña es correcta ni conservar una sesión después de recargar. El submit temporal termina aquí:

```text
formulario válido
→ handler temporal
→ mensaje local
```

Firebase agrega una fuente externa que mantiene identidad y sesión. La aplicación necesita observarla una sola vez y decidir qué mostrar mientras termina de restaurarse:

```text
Firebase Auth
→ onAuthStateChanged
→ AuthProvider
→ checking | anonymous | authenticated
→ PrivateLayout
→ Outlet o Navigate
```

El token de ID y los requests autenticados no forman parte de esta clase. La clase 15 usará la sesión ya expuesta para construir el cliente HTTP centralizado.

## Compatibilidad y configuración de referencia

La guía usa Firebase JavaScript SDK `12.16.0`, verificado el 27 de agosto de 2026 contra el manifest instalado de `medialogfy-web` y contra la documentación oficial. El curso usa la API **modular**:

```bash
pnpm add firebase@12.16.0
```

El docente revisa `package.json`, `pnpm-lock.yaml` y ejecuta `pnpm build` antes de comenzar a conectar los formularios. Antes de una cohorte debe volver a comprobar la versión, los imports `firebase/app` y `firebase/auth`, y la compatibilidad con React, Vite y las versiones ya fijadas.

Cada estudiante crea o usa su propio proyecto Firebase, registra una app web y habilita **Authentication → Sign-in method → Email/Password**. La configuración entregada por Firebase identifica la app y el proyecto; no es una cuenta de servicio ni un secreto. Aun así, se guarda fuera del repositorio para que cada copia del proyecto use su propia configuración.

```text
.env.example  → nombres vacíos que sí se versionan
.env.local    → configuración de una persona, ignorada por Git
```

Las variables con prefijo `VITE_` llegan al bundle del navegador. Por eso una contraseña, un token de ID, una clave privada o una cuenta de servicio nunca deben aparecer allí.

## Conceptos

- Validación local frente a autenticación remota.
- Firebase config pública frente a secreto.
- Usuario, sesión y token de ID.
- API modular de Firebase.
- Suscripción `onAuthStateChanged` y cleanup.
- Estados `checking`, `anonymous` y `authenticated`.
- Context provider y hook consumidor.
- Layout privado, `Outlet`, `Navigate`, `useLocation` y `useNavigate`.
- Retorno a la ruta solicitada.
- Estado de submit local frente a estado de sesión transversal.

## Rutas al cerrar la clase

| URL | Acceso | Elemento | Propósito |
| --- | --- | --- | --- |
| `/login` | Público | `LoginPage` | Iniciar sesión y regresar al destino privado solicitado cuando exista. |
| `/register` | Público | `RegisterPage` | Crear una cuenta y continuar al destino privado o biblioteca. |
| `/app/library` | Privado | `LibraryPage` provisional | Confirmar que la guardia permite una sesión restaurada. |
| `/app/library/:logId` | Privado | `LibraryDetailPlaceholderPage` | Reservar la identidad del registro personal para la clase 19. |

`PublicLayout` conserva el encabezado de las páginas públicas. `PrivateLayout` todavía no construye navegación ni logout: su única responsabilidad en esta clase es decidir si la hija puede aparecer. El shell con encabezado privado y logout es trabajo de la clase 15.

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 20 minutos. Recupera el submit local de la clase 13 y presenta Firebase como el sistema externo que ahora debe responder. El cierre usa 6 minutos para distinguir sesión, token y request autenticado sin adelantar la implementación del cliente HTTP.

### Apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | El formulario ya sabe una cosa | Recuperar que Zod comprobó formato, longitud y coincidencia; no comprobó una cuenta ni creó una sesión. | Preguntar: “¿un correo válido prueba que la cuenta existe?”. Mostrar el handler temporal de la clase 13, no el formulario completo. |
| Problema | La identidad vive fuera de React | Firebase crea o reconoce una identidad y recuerda la sesión entre cargas. React no debe adivinarla leyendo una variable inicial. | Diagrama `formulario → Firebase → cambio de sesión → interfaz`. |
| Distinción | Autenticar no es autorizar | Autenticación responde quién es la persona. Autorización responde qué puede hacer en un servidor. Ocultar una página no protege un endpoint. | Tabla de tres columnas: Zod, Firebase Auth y backend. Nombrar autorización; no implementar el backend todavía. |
| Configuración | Configuración pública no significa secreto | El objeto de Firebase asocia la app con un proyecto; `VITE_` lo expone al navegador. Una cuenta de servicio, contraseña y token no pertenecen al cliente. | Comparar `.env.example` con `.env.local`. Pie: “un archivo no convierte un dato público en secreto”. |
| Flujo | La sesión tiene un momento de espera | Al cargar, no se sabe aún si Firebase restaurará una sesión. `checking` evita redirigir antes de tener respuesta; después solo quedan `anonymous` o `authenticated`. | Diagrama de estados, no un booleano `isLoggedIn`. Preguntar qué ocurriría si `checking` se tratara como anónimo. |
| Concepto | Un provider escucha; sus consumidores deciden | `AuthProvider` instala una única suscripción y ofrece el resultado por Context. `PrivateLayout` consume ese valor; los formularios solo ejecutan su operación puntual. | Árbol `Firebase → provider → useAuth → PrivateLayout`. Aclarar que Context no guarda datos remotos de la API ni reemplaza TanStack Query. |
| Effect auténtico | Suscribirse y cancelar | `onAuthStateChanged` registra una función fuera de React y devuelve otra que la cancela. El cleanup devuelve esa función al desmontar el provider. | Contrastar con un Effect que navega o lee un input: esos casos no se implementan. Recordar el ciclo adicional de desarrollo visto en clase 10. |
| Guard | La ruta privada decide antes de renderizar | `PrivateLayout` muestra carga, redirige o entrega el lugar al `Outlet`. Conserva el destino solicitado en `location.state`. | Diagrama `URL privada → PrivateLayout → checking / Navigate / Outlet`. Recordar que `Outlet` es el lugar de la hija, no la guardia. |
| Navegación | El submit conoce su éxito | Login y registro usan `useNavigate` después de que Firebase resuelve. No esperan un Effect que observe un cambio de usuario. | Snippet corto con `await signIn...` y `navigate(destination, { replace: true })`. |
| Límite | La sesión no es aún un request autenticado | Firebase emitirá un token de ID; en la próxima clase se obtendrá desde el usuario actual y se colocará una sola vez en el cliente HTTP. | Mostrar una flecha futura, sin revelar `getIdToken` ni un fetcher. |

### Diagrama de estados para las diapositivas

```text
inicio de la app
      │
      ▼
  checking
      │ onAuthStateChanged
      ├───────────────────────┐
      ▼                       ▼
 anonymous              authenticated
      │                       │
 Navigate /login          <Outlet />
```

No presentar `checking` como un error ni como un cuarto tipo de usuario. Es el estado de la interfaz mientras la suscripción de Firebase todavía no comunica la sesión.

### Contrastes y notas docentes que deben sobrevivir a las slides

- `auth.currentUser === null` no prueba por sí solo que no exista sesión: Firebase puede seguir inicializando. El observer es la fuente de verdad de la interfaz.
- `isSubmitting` pertenece a Login o Register porque representa una operación puntual. `checking` pertenece al provider porque toda la rama privada depende de él.
- Una cuenta creada correctamente inicia sesión en Firebase. El observer actualiza el provider; la página no debe duplicar ese usuario en otro `useState`.
- `onAuthStateChanged` justifica un Effect porque sincroniza con Firebase. `navigate` dentro del submit responde a un éxito conocido y no necesita un Effect.
- `Navigate` expresa la redirección declarada por la guardia. `useNavigate` responde a la acción exitosa de la persona. `Link` sigue siendo la navegación normal entre páginas públicas.
- `location.state` sirve solo para el regreso inmediato dentro de la SPA. No sustituye una URL ni una persistencia; si no existe, el fallback es `/app/library`. Los enlaces entre Login y Registro deben reenviar el mismo `destination` para que cambiar de formulario no lo pierda.
- Firebase config no concede privilegios administrativos. El servidor deberá verificar el token antes de autorizar operaciones privadas. La rama `bootcamp` aceptará solo `Authorization: Bearer <ID token>`; el estudiante no enviará un header adicional de proyecto.
- No enseñar Firebase CLI, Firestore, proveedores sociales, recuperación de contraseña, refresh manual de token ni reglas del backend en esta clase.

### Snippets conceptuales para las slides

Observer y cleanup:

```tsx
useEffect(() => {
  return onAuthStateChanged(auth, (user) => {
    const nextState =
      user === null
        ? { status: "anonymous" }
        : {
            status: "authenticated",
            user: { uid: user.uid, email: user.email },
          }

    setAuthState(authStateSchema.parse(nextState))
  })
}, [])
```

Guardia:

```tsx
if (authState.status === "checking") return <Loader />

if (authState.status === "anonymous") {
  return <Navigate replace state={{ from: location.pathname }} to="/login" />
}

return <Outlet />
```

No mostrar los archivos completos en las diapositivas. La relación entre provider, formulario y layout se construye y verifica en el editor.

### Cierre conceptual

El cierre recupera estas preguntas:

1. ¿Por qué el estado inicial de sesión no puede ser simplemente `user: null`?
2. ¿Qué valor ofrece el provider y qué estado conserva solamente `LoginPage`?
3. ¿Por qué `PrivateLayout` usa `Navigate`, pero el submit usa `useNavigate`?
4. ¿Qué falta todavía antes de que una petición a la biblioteca llegue autenticada al backend?

La cuarta respuesta abre la clase 15: obtener el token de ID, centralizar el header Bearer, entender un `401` y completar el shell privado.

## Flujo del código

### Estado 1 · Confirmar la frontera de la clase 13

El docente abre `/login` y envía valores válidos. El mensaje de la clase anterior confirma solamente formato. Después abre Firebase Console y muestra que no existe una cuenta creada por ese submit.

El grupo clasifica cada responsabilidad:

| Pregunta | Responsable |
| --- | --- |
| ¿El correo tiene formato válido? | Zod y Mantine Form. |
| ¿Las contraseñas de registro coinciden? | Zod y Mantine Form. |
| ¿La cuenta puede crearse o la contraseña es correcta? | Firebase Authentication. |
| ¿La persona puede crear un registro de biblioteca? | Backend, en una clase posterior. |

Este estado inicial no modifica código. Hace visible por qué agregar Firebase no es “otra validación” del mismo formulario.

### Estado 2 · Preparar el proyecto Firebase y la configuración local

Cada estudiante realiza estos pasos con su propia cuenta de Firebase:

1. Crear un proyecto Firebase o abrir uno vacío destinado al curso.
2. Registrar una **Web app** y copiar el objeto de configuración proporcionado por Firebase.
3. En **Authentication → Sign-in method**, habilitar **Email/Password** y guardar.
4. Crear `.env.local` a partir de `.env.example` sin compartir ese archivo en una entrega pública.

El docente añade el ejemplo versionable:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`storageBucket` y `messagingSenderId` se conservan porque forman parte del objeto entregado por Firebase, aunque la clase no use Storage ni Messaging. No añadir `measurementId`: el curso no inicializa Analytics.

La configuración individual queda en `.env.local` con los valores proporcionados. El docente verifica que `.gitignore` ya excluya `.env.local`; si no, lo añade antes de continuar. Cada cambio de variable exige reiniciar `pnpm dev`.

Después se instala Firebase y se comprueba el proyecto antes de escribir lógica:

```bash
pnpm add firebase@12.16.0
pnpm build
```

### Estado 3 · Inicializar Firebase una vez

Se crea `src/firebase/firebase.ts`. Este archivo tiene una responsabilidad concreta: inicializar la app web configurada y exportar el servicio de autenticación.

```ts
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
```

El docente no crea una segunda app, no llama `getAuth()` desde cada página y no añade Firestore. Si aparece un error de configuración, se vuelve al objeto copiado desde Firebase Console en vez de inventar valores.

### Estado 4 · Convertir los handlers temporales en operaciones reales

Los schemas y `useForm` de la clase 13 no cambian. Añade a `src/schemas/auth.ts` el contrato del destino y deriva su tipo si otro consumidor lo necesita:

```ts
export const authDestinationSchema = z.object({
  from: z.string().trim().min(1),
})

export type AuthDestination = z.infer<typeof authDestinationSchema>
```

Crea `src/auth/auth-destination.ts`:

```ts
import {
  authDestinationSchema,
  type AuthDestination,
} from "../schemas/auth"

const DEFAULT_PRIVATE_DESTINATION: AuthDestination = {
  from: "/app/library",
}

export function toAuthDestination(state: unknown): string {
  const result = authDestinationSchema.safeParse(state)

  return result.success
    ? result.data.from
    : DEFAULT_PRIVATE_DESTINATION.from
}
```

`unknown` conserva la frontera real de `location.state`. Un cast no revisaría que `from` exista, sea string y contenga un destino no vacío. `LoginPage` reemplaza su confirmación temporal por una operación Firebase y dos estados que pertenecen al intento actual:

```tsx
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useLocation, useNavigate } from "react-router"

import { auth } from "../firebase/firebase"
import { toAuthDestination } from "../auth/auth-destination"

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  // El useForm de la clase 13 permanece aquí.

  const destination = toAuthDestination(location.state)

  async function handleSubmit(values: LoginFormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      navigate(destination, { replace: true })
    } catch {
      setSubmitError("No pudimos iniciar sesión. Revisa los datos e inténtalo otra vez.")
    } finally {
      setIsSubmitting(false)
    }
  }
}
```

El botón recibe `loading={isSubmitting}` y `disabled={isSubmitting}` mientras exista una request. La página muestra `submitError` en un `Alert` general, separado de los errores junto a cada campo. La clase no muestra códigos internos de Firebase ni diferencia si falló el correo o la contraseña.

El grupo sigue el recorrido:

```text
submit válido
→ signInWithEmailAndPassword
→ Firebase resuelve o rechaza
→ error general local o navigate(destino)
→ onAuthStateChanged actualiza el provider
```

`RegisterPage` aplica el mismo flujo, pero importa `createUserWithEmailAndPassword` y recibe `RegisterFormValues`. Usa solamente `values.email` y `values.password`; `confirmPassword` cumplió su responsabilidad local y no se envía al servicio.

```tsx
await createUserWithEmailAndPassword(auth, values.email, values.password)
navigate(destination, { replace: true })
```

Los enlaces entre ambas páginas conservan el mismo destino. Esta decisión permite que una persona redirigida a Login pase a Registro y vuelva después al path que inició el recorrido:

```tsx
// LoginPage
<Link state={{ from: destination }} to="/register">
  Regístrate
</Link>

// RegisterPage
<Link state={{ from: destination }} to="/login">
  Inicia sesión
</Link>
```

No se pasa `location.state` completo sin revisarlo. Ambas páginas ya normalizaron `destination` como string o fallback antes de construir el Link.

No extraer un `useAuthMutation`, un servicio de formularios ni un `AuthForm` configurable. Los formularios todavía difieren poco y su operación visible se explica mejor dentro de cada página.

### Estado 5 · Observar la sesión mediante un provider

La promesa de login confirma una operación, pero no debe convertirse en la fuente global de la sesión. Añade a `src/schemas/auth.ts` un estado propio validable. El objeto completo `User` pertenece al SDK y no se guarda en Context:

```ts
export const authUserSchema = z.object({
  uid: z.string().min(1),
  email: z.email().nullable(),
})

export const authStateSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("checking") }),
  z.object({ status: z.literal("anonymous") }),
  z.object({
    status: z.literal("authenticated"),
    user: authUserSchema,
  }),
])

export type AuthUser = z.infer<typeof authUserSchema>
export type AuthState = z.infer<typeof authStateSchema>
```

Se crea `src/auth/auth-provider.tsx` para observar Firebase una sola vez y entregar ese estado explícito.

```tsx
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"

import { auth } from "../firebase/firebase"
import {
  authStateSchema,
  type AuthState,
  type AuthUser,
} from "../schemas/auth"

const AuthContext = createContext<AuthState | null>(null)

function toAuthUser(user: User): AuthUser {
  return { uid: user.uid, email: user.email }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState<AuthState>({ status: "checking" })

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const nextState =
        user === null
          ? { status: "anonymous" }
          : { status: "authenticated", user: toAuthUser(user) }

      setAuthState(authStateSchema.parse(nextState))
    })
  }, [])

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const authState = useContext(AuthContext)

  if (authState === null) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.")
  }

  return authState
}
```

El `return` del Effect es la función que Firebase entrega para cancelar la suscripción. `parse` valida la proyección propia antes de actualizar Context; `z.infer` por sí solo no lo haría. No se usa `z.custom<User>()`, `auth.currentUser` como estado inicial, un listener por página ni se borra `StrictMode` para ocultar su comportamiento de desarrollo.

`main.tsx` agrega el provider alrededor de los componentes que consumen sesión:

```tsx
<StrictMode>
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
</StrictMode>
```

La comprobación intermedia es recargar la aplicación: el provider comienza en `checking` y Firebase publica después la sesión correcta. El docente pide al grupo identificar dónde vive cada estado antes de construir la guardia.

### Estado 6 · Declarar una rama privada y protegerla

`App.tsx` conserva las rutas públicas existentes y añade una rama `app`:

```tsx
import { Route, Routes } from "react-router"

import { PrivateLayout } from "./layouts/private-layout"
import { LibraryDetailPlaceholderPage } from "./pages/library-detail-placeholder-page"
import { LibraryPage } from "./pages/library-page"

<Routes>
  <Route element={<PublicLayout />}>
    <Route index element={<Navigate replace to="/search" />} />
    <Route path="search" element={<SearchPage />} />
    <Route path="media/:mediaType/:externalId" element={<MediaDetailPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>

  <Route path="app" element={<PrivateLayout />}>
    <Route path="library" element={<LibraryPage />} />
    <Route path="library/:logId" element={<LibraryDetailPlaceholderPage />} />
  </Route>
</Routes>
```

`LibraryPage` y `LibraryDetailPlaceholderPage` solo representan título y texto de contexto. No hacen fetch, no leen un token y no intentan validar aún `logId` como el detalle real de la clase 19.

El layout privado consume el estado del provider:

```tsx
import { Center, Loader } from "@mantine/core"
import { Navigate, Outlet, useLocation } from "react-router"

import { useAuth } from "../auth/auth-provider"

export function PrivateLayout() {
  const authState = useAuth()
  const location = useLocation()

  if (authState.status === "checking") {
    return (
      <Center mih="100vh">
        <Loader aria-label="Comprobando sesión" />
      </Center>
    )
  }

  if (authState.status === "anonymous") {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  return <Outlet />
}
```

El orden es importante: `checking` se resuelve antes de decidir que alguien es anónimo. `Outlet` conserva el significado ya enseñado en la clase 11: muestra la ruta hija activa solo después de que el layout permitió continuar.

### Estado 7 · Probar los recorridos completos

El docente guía los siguientes recorridos, sin proyectar contraseñas ni tokens:

1. Abrir `/app/library` sin sesión: aparece una carga breve y luego login.
2. Enviar login con formato inválido: Mantine muestra errores de campo y Firebase no recibe una llamada.
3. Enviar login válido con credenciales inexistentes: aparece el error general de Firebase.
4. Crear una cuenta válida desde `/register`: Firebase inicia sesión y la aplicación llega a biblioteca.
5. Recargar `/app/library`: aparece `checking`; luego la biblioteca vuelve a mostrarse sin pasar por login.
6. Abrir `/app/library` en un perfil o ventana sin sesión: se redirige a login; al acceder, regresa a biblioteca.
7. Desde esa redirección, cambiar de Login a Registro, crear la cuenta y comprobar que el destino sigue siendo `/app/library`.

La evidencia incluye Network y Firebase Console solo cuando ayuden a diagnosticar. El grupo no copia un token de consola, no lo pega en la entrega y no convierte la inspección de Network en una captura con datos personales.

## Secuencia sugerida

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0-15 min | Docente y grupo | Usar el deck para recuperar la validación local y clasificar validación, autenticación y autorización. Confirmar que la clase 13 no creó cuentas. |
| 15-33 min | Docente con práctica guiada | Crear o revisar el proyecto Firebase, registrar la app web, habilitar Email/Password, preparar `.env.example` y `.env.local`, instalar Firebase y ejecutar `pnpm build`. |
| 33-48 min | Demostración docente | Crear `firebase.ts`, conectar `LoginPage` y mostrar pending, error general y navegación después del éxito. |
| 48-62 min | Construcción interactiva | Aplicar el flujo a `RegisterPage`; identificar que `confirmPassword` no viaja a Firebase. |
| 62-82 min | Docente y grupo | Construir `AuthProvider`, modelar los tres estados, registrar el observer y comprobar cleanup y restauración tras recarga. |
| 82-100 min | Demostración con participación | Declarar la rama privada, crear `PrivateLayout`, conservar el destino y probar `checking`, `Navigate` y `Outlet`. |
| 100-114 min | Actividad estudiantil | Repetir los siete recorridos de aceptación con una cuenta de prueba y explicar el propietario de cada estado. |
| 114-120 min | Docente y grupo | Ejecutar `pnpm build`, volver al deck y conectar la sesión con el token HTTP de la clase 15. |

La suma de los bloques es de 120 minutos.

## Actividades del docente

- Mostrar primero el límite del submit temporal y no empezar por la consola de Firebase.
- Guiar la habilitación de Email/Password sin pedir que el grupo comparta pantallas con correos o contraseñas personales.
- Explicar que `.env.local` organiza configuraciones individuales, pero `VITE_` no protege secretos.
- Instalar la versión fijada, revisar el lockfile y construir antes de escribir Firebase.
- Mantener `LoginPage` y `RegisterPage` como dueñas de submit, pending y error general.
- Dibujar el flujo desde Firebase hasta `PrivateLayout` antes de escribir Context.
- Mostrar por qué `checking` precede a la redirección y devolver la cancelación de `onAuthStateChanged` como cleanup.
- Usar `Navigate` para la guardia y `useNavigate` para el submit exitoso; rechazar un Effect que navega por cambio de sesión.
- Conservar `destination` al navegar entre Login y Registro; no reenviar state desconocido sin normalizarlo.
- Reservar logout, token de ID, Bearer, `401` y cliente HTTP para la clase 15.

## Actividades de los estudiantes

- Identificar qué comprobaciones siguen siendo locales y cuáles requieren Firebase.
- Configurar Email/Password y completar sus propias variables locales sin subirlas al repositorio.
- Sustituir el handler temporal de login por una operación asíncrona con estados locales visibles.
- Adaptar el submit de registro sin enviar `confirmPassword` al servicio.
- Pasar el destino normalizado entre los enlaces de Login y Registro.
- Explicar la transición de `checking` a `anonymous` o `authenticated`.
- Implementar o completar `PrivateLayout` y comprobar que `Outlet` solo aparece con sesión.
- Probar la ruta privada desde una sesión vacía, un registro nuevo y una recarga.
- Ejecutar `pnpm build` y explicar qué responsabilidad conserva pendiente la clase 15.

## Evidencia de salida

- `firebase@12.16.0` está fijado en `package.json` y `pnpm build` finaliza correctamente.
- `.env.example` contiene solo nombres de configuración; `.env.local` no está versionado ni se proyectan valores sensibles.
- Email/Password está habilitado en el proyecto Firebase del estudiante.
- Login y registro validan localmente antes de invocar Firebase, muestran pending durante la operación y un error general cuando Firebase rechaza.
- `AuthProvider` inicia en `checking`, se suscribe una sola vez con cleanup y expone `anonymous` o `authenticated`.
- Abrir `/app/library` sin sesión redirige a `/login` solo después de terminar `checking`.
- Crear cuenta o iniciar sesión desde una redirección devuelve al path solicitado mediante `replace`, incluso después de cambiar entre Login y Registro.
- Una recarga autenticada en `/app/library` restaura la sesión y vuelve a representar la ruta privada.
- Ningún formulario, provider o layout guarda contraseña o token en Zustand o `localStorage`.

## Errores frecuentes y respuesta docente

| Síntoma | Pregunta de diagnóstico | Respuesta esperada |
| --- | --- | --- |
| La aplicación redirige a login y luego reaparece la biblioteca. | ¿La guardia decidió antes de que Firebase terminara de inicializar? | Mantener `checking` y mostrar carga antes de tratar la sesión como anónima. |
| Cada página usa `onAuthStateChanged`. | ¿Quién necesita observar la fuente externa y quién solo necesita leer su resultado? | Dejar una suscripción en `AuthProvider` y consumir `useAuth`. |
| El login guarda `userCredential.user` en su propio estado global. | ¿Qué componente es la fuente de verdad tras recargar? | Firebase y el provider; el formulario solo conserva pending y error del intento. |
| Un Effect llama `navigate` cuando cambia `authState`. | ¿El éxito ya ocurrió dentro de un submit concreto? | Navegar en ese handler después de `await`; el Effect se reserva para la suscripción. |
| El redirect siempre vuelve a biblioteca aunque venía de otra ruta. | ¿Qué ruta guardó la guardia antes de redirigir? | Pasar `state={{ from: location.pathname }}` y leer el fallback en login o registro. |
| Cambiar de Login a Registro pierde el destino. | ¿El Link conservó el string ya normalizado? | Enviar `state={{ from: destination }}` entre ambas páginas. |
| Se incluye la clave de una cuenta de servicio en `.env.local`. | ¿Ese dato puede vivir en el navegador? | No. El cliente solo usa la configuración web proporcionada por Firebase. |
| La persona entrega una captura con token o contraseña. | ¿La evidencia exige exponer esa credencial? | No. Repetir la prueba sin valores sensibles y ocultar datos personales. |
| El error de Firebase reemplaza los errores de formato. | ¿Firebase se llamó después de que Mantine validó? | Mantener errores de campo para formato y `Alert` general solo para la operación remota. |
| Se añade Firestore “para guardar la sesión”. | ¿Quién ya conserva la sesión de autenticación? | Firebase Authentication; Firestore no pertenece al alcance del curso. |

## Vocabulario

- **Autenticación:** comprobación de que una persona controla una identidad, por ejemplo correo y contraseña.
- **Autorización:** decisión del servidor sobre qué operaciones puede realizar una identidad autenticada.
- **Sesión:** estado que permite a Firebase reconocer nuevamente a una persona entre cargas de la aplicación.
- **Token de ID:** credencial firmada que representa una sesión y que el cliente enviará al backend en la clase siguiente.
- **Configuración web:** identificadores con los que el SDK asocia una aplicación del navegador a un proyecto Firebase; no equivale a una credencial administrativa.
- **Suscripción:** registro de una función que recibe cambios hasta que se cancela.
- **Cleanup:** acción que React ejecuta para desmontar una conexión externa creada por un Effect.
- **Provider:** componente que ofrece un valor compartido a una rama del árbol React.
- **Guardia de ruta:** componente que decide si una ruta hija puede representarse según una condición.
- **Estado de submit:** información temporal de una operación iniciada por un formulario, como pending o error general.

## Fuera del alcance

- Firestore, Analytics, Firebase CLI, Emulators y proveedores sociales.
- Recuperación de contraseña, verificación de correo, perfil, MFA y políticas de contraseña distintas al mínimo de seis caracteres ya fijado.
- Logout, encabezado privado y mostrar correo de la sesión; se integrarán durante el shell de la clase 15.
- Obtener, refrescar, inspeccionar o persistir manualmente el token de ID.
- Cliente HTTP autenticado, header Bearer, `401`, backend bootcamp y verificación del token en servidor.
- Dar permisos de biblioteca solo por ocultar una pantalla.
- `useEffect` para navegar, observar inputs, copiar usuario a estado local o consultar la API.
- Guardar contraseñas, tokens o sesión en `localStorage` o Zustand.
- Abstraer login y registro en un formulario configurable, un hook de mutación o un servicio genérico.

## Referencias docentes

- [Firebase: Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup)
- [Firebase: Password-based accounts](https://firebase.google.com/docs/auth/web/password-auth)
- [Firebase: Manage users](https://firebase.google.com/docs/auth/web/manage-users)
- [Firebase: Understand Firebase for web](https://firebase.google.com/docs/web/learn-more)
- [React Router: Picking a mode](https://reactrouter.com/start/modes)
- [React Router: useNavigate](https://api.reactrouter.com/v8/functions/react-router.useNavigate.html)
