# Guía docente · Sesión 12 · Firebase Auth y rutas privadas

## Resultado y alcance

**Virtual · 90 minutos · semana 5 · jueves 22 de octubre de 2026.** Entrada: `session-12-start`, idéntica a `session-11-end`. Salida: `session-12-end`.

Conectaremos Login y Registro con Firebase. React conocerá la sesión al recargar, decidirá si muestra la rama privada y podrá construir una petición con un ID token. `/app/library` conserva texto provisional: no creamos registros ni consultamos una biblioteca personal.

Esta guía privada incluye cada archivo que se escribe, cambia o entrega, con imports, tipos, funciones y JSX. Repite el archivo completo en cada transformación. Copia el soporte mecánico dentro del paso correspondiente y construye con el grupo las decisiones señaladas. No añadimos CSS: las props de Mantine de cada archivo conservan sus estilos y el CSS heredado permanece sin cambios. `pnpm-lock.yaml` se genera con pnpm; no se transcribe. No necesitas abrir otro repositorio para reconstruir instrucciones.

Material público: [guía estudiantil](student-guide.md), [lectura previa](pre-class-reading.md) y [control posterior](reading-check.md). La [presentación de 28 diapositivas](presentation/index.html) está aprobada.

## Antes de la clase · comprobar sin editar

1. Comprueba búsqueda, detalle y formulario local de creación en el cierre 11. El formulario prepara un objeto; no envía creación al servidor.
2. Confirma el preflight individual: proyecto Firebase propio, Web app registrada y Email/Password habilitado. Una cuenta de prueba evita mezclar datos personales con la demostración.
3. Confirma Node >=22.22.0 y pnpm 11.17.0. Firebase 12.16.0 se instala después de las diapositivas.
4. Revisa fuera de clase el origen autorizado y la aceptación del proyecto Firebase por el servidor. Un token emitido correctamente puede ser rechazado si ese servidor no admite el proyecto.
5. El 8 de octubre de 2026 se comprobó rechazo HTTP 401 sin credencial en el endpoint público. Eso no demuestra aceptación de un token, funcionamiento de Firebase ni CORS desde el navegador.
6. Ten preparados deck, esta guía, editor y DevTools. Presentación completa → editor/navegador → práctica → cierre oral. No alternar medios.
7. Conserva cambios estudiantiles antes de compartir respaldos. `main` del repositorio docente sigue siendo el inicio sin aplicación; las soluciones se publican gradualmente.
8. La ausencia de configuración Firebase debe mostrar un aviso claro y conservar el catálogo público disponible. No la confundas con «contraseña incorrecta». Copia y reinicio de configuración ocurren únicamente en S12-B02.

## Ruta recuperable y tiempos

| Bloque | Minutos | Medio y responsable | Salida |
| --- | ---: | --- | --- |
| S12-B01 | 0–28 | Presentación continua · docente y preguntas orales | Formulario, sesión, pantalla y servidor diferenciados. |
| S12-B02 | 28–34 | Editor · soporte explicado | step-01-firebase-config: configuración válida o ausencia explícita. |
| S12-B03 | 34–43 | Editor · construcción interactiva | step-02-auth-provider: una escucha y datos de sesión compartidos. |
| S12-B04 | 43–53 | Editor · patrones preparados y handlers guiados | step-03-auth-forms: Login y Registro, errores y destino provisional. |
| S12-B05 | 53–61 | Editor · predicción y construcción | step-04-private-routes: destino normalizado y guardia. |
| S12-B06 | 61–67 | Editor y Network · demostración | step-05-authenticated-request: comparación temporal del request. |
| S12-B07 | 67–72 | Editor · práctica guiada | step-06-logout: salida y retirada del diagnóstico. |
| S12-B08 | 72–82 | Agente y actividad estudiantil | step-07-auth-destination-tests: matriz leída y prueba ejecutada. |
| S12-B09 | 82–90 | Comprobación y cierre oral | Evidencia y registro para continuar. |

**Suma: 28 + 6 + 9 + 10 + 8 + 6 + 5 + 10 + 8 = 90 minutos.** La construcción suma 44. Es un presupuesto pendiente de ensayo; no pretende teclear todos los archivos desde cero. Si no alcanza, registra el último paso comprobado y retoma allí sin adelantar la sesión 13.

Todos los nombres `step` llevan el prefijo `session-12-`. La salida añade los materiales públicos actuales al último paso de código.

## Clave privada del control de lectura

| Pregunta | Respuesta | Justificación y fuente |
| ---: | :---: | --- |
| 1 | B | Email/Password debe estar habilitado. Firebase Password Authentication, Before you begin. |
| 2 | A | Crear la cuenta también inicia sesión. Password Authentication, Create a password-based account. |
| 3 | C | El observer comunica el usuario después de la inicialización. Manage Users, Get the currently signed-in user. |
| 4 | Falso | currentUser puede ser null durante la inicialización; aislado no distingue espera de ausencia de sesión. Manage Users, nota de inicialización. |
| 5 | A | signOut cierra la sesión. Password Authentication, Next steps. |

## S12-B01 · Presentación continua · 0–28

**Entrada:** cierre 11 reconocible. **Responsable:** docente; el grupo predice oralmente. No abrir el editor.

| Slides | Explicación oral | Pregunta y respuesta esperada |
| --- | --- | --- |
| 01–05 | Una ficha correctamente completada no crea una cuenta. Zod revisa la ficha; Firebase comprueba el acceso; el servidor decide lo permitido. El mapa separa pantalla de petición. | «¿Un formulario válido demuestra que el servidor nos reconoce?» No: falta autenticar y enviar una credencial aceptada. |
| 06–10 | Configuración web pública y proyecto propio. Login y Registro reutilizan Form; formato y fallo remoto producen mensajes diferentes. Crear una cuenta también inicia sesión. | «¿Enviamos confirmPassword?» No: solo sirve para comparar localmente. |
| 11–16 | Firebase tarda en recuperar la sesión. Primero checking; después anonymous o authenticated. Una escucha entrega una proyección pequeña y validada mediante Context. | «¿null al abrir significa necesariamente estar fuera?» No: puede estar inicializando. |
| 17–21 | La guardia espera, redirige o muestra Outlet. El destino viaja a Login y Registro. El submit navega al conocer éxito. | «¿Dónde navegamos después de entrar?» En el handler, después de await; no en un Effect. |
| 22–25 | Mostrar biblioteca no cambia fetch. El helper pide un ID token y lo añade a Authorization. El servidor puede rechazarlo. | «¿Un header Bearer garantiza un 200?» No: el servidor verifica la credencial y decide. |
| 26–28 | Logout es un evento; el observer actualiza sesión. Distinguir prueba pura, build, navegador y servidor. La biblioteca sigue provisional. | «¿Qué demuestra el test del destino?» Solo la transformación de entradas; no Firebase, Router ni backend. |

**Fin de la presentación.** Di: «Ahora construiremos las piezas en ese orden. Primero preparamos Firebase; después escuchamos la sesión, conectamos formularios y protegemos la pantalla». Permanece en editor y navegador hasta el cierre; todas las preguntas finales están al final de esta guía.

## S12-B02 · Configuración y aviso visible · 28–34

**Entrada:** session-12-start. **Responsable:** docente entrega soporte y explica; cada estudiante coloca su configuración individual. **Dificultad principal:** distinguir configuración ausente de intento de acceso fallido.

1. Después de guardar trabajo, usa la entrada recuperable e instala sus dependencias:

```bash
git switch session-12-start
pnpm install --frozen-lockfile
```

Antes de añadir Firebase, entrega el pnpm-workspace.yaml completo que aparece debajo: declara false para los dos scripts revisados. @firebase/util intentaría generar configuración automática; usamos initializeApp explícito. protobufjs muestra avisos de versiones. Ninguno es necesario para este flujo. Esto no aprueba scripts de otros paquetes. El comando de instalación aparece inmediatamente después del YAML completo, dentro de este bloque.

El comando modifica package.json y genera pnpm-lock.yaml. No edites el lockfile a mano. El manifest completo se muestra debajo. Si ejecutaste add antes de entregar la política y apareció ERR_PNPM_IGNORED_BUILDS, revisa y conserva los cambios de manifest/lockfile, entrega el YAML y vuelve a ejecutar la instalación congelada.
2. Actualiza .env.example y comprueba el contenido completo de .gitignore. Si .env.local ya existe, conserva su URL API y sus otros valores. Si falta, copia los nombres desde el ejemplo. Coloca allí la configuración web de TU Web app, nunca cuentas de servicio ni tokens. No entregamos valores inventados como si fueran válidos.
3. Reinicia Vite después de guardar los seis valores:

```bash
pnpm dev
```

4. Entrega el módulo Firebase y su aviso preparados. Lee la comprobación de todos los campos antes de initializeApp: solo se crea Auth con configuración completa. auth:null significa que no podemos iniciar operaciones; el aviso se utilizará en los formularios de B04. Esta etapa añade /login como consumidor provisional del aviso y un enlace en AppHeader; sustituye App y el encabezado completos. Todavía no hay formulario, registro ni guardia.

### Archivo 1 · pnpm-workspace.yaml

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. allowBuilds declara la decisión para dos scripts revisados. false impide ejecutarlos; no es un permiso global ni sustituye la comprobación del proyecto. @firebase/util no necesita generar defaults porque damos firebaseConfig explícito; protobufjs no necesita su aviso de versiones para este flujo.

**`pnpm-workspace.yaml` · archivo completo:**

```yaml
allowBuilds:
  '@firebase/util': false
  protobufjs: false
```

Con el YAML guardado y revisado, instala y comprueba:

```bash
pnpm add --save-exact firebase@12.16.0
pnpm install --frozen-lockfile
```

### Archivo 2 · package.json

**Acción:** Comprueba el resultado generado. **Referencia:** `session-12-step-01-firebase-config`. El único paquete de runtime nuevo es firebase 12.16.0; conservamos Core, Hooks y Form en la misma versión y pnpm en packageManager. Los scripts dev, build, lint y test mantienen sus responsabilidades. El lockfile generado fija la resolución de esa instalación.

**`package.json` · archivo completo:**

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
    "firebase": "12.16.0",
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

### Archivo 3 · .env.example

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. API conserva la base sin /api ni slash final. Cada clave VITE_FIREBASE_ corresponde a un campo de la configuración web. Los valores vacíos son nombres para configurar cada máquina, no valores Firebase válidos.

**`.env.example` · archivo completo:**

```dotenv
VITE_API_URL=https://bootcamp-medialog.cardor.dev
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Archivo 4 · .gitignore

**Acción:** Revisa; no volver a escribir. **Referencia:** `session-12-step-01-firebase-config`. La regla *.local excluye .env.local. El archivo generado o privado no se entrega al repositorio. Ignorarlo evita mezclar configuraciones, pero no transforma la configuración web en un secreto que el navegador no pueda ver.

**`.gitignore` · archivo completo; heredado:**

```text
node_modules/
dist/
*.local
.env
.env.*
!.env.example
.DS_Store
*.log
# agent-harness-kit
.harness/harness.db
.harness/harness.db-shm
.harness/harness.db-wal
```

### Archivo 5 · src/firebase/firebase.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. Los imports son modulares: initializeApp crea la app y getAuth obtiene Auth. firebaseConfig lee seis campos públicos. Object.values(...).every(...) exige que todos sean strings no vacíos; no acredita que el proyecto exista o tenga Email/Password habilitado. El ternario simple devuelve Auth o null. El módulo se evalúa una vez; el resto de archivos importa esa instancia.

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

### Archivo 6 · src/components/firebase-setup-notice.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. Container fija ancho y padding; Alert distingue preparación pendiente de error remoto. Text explica la acción concreta y el reinicio de Vite. No ejecuta requests, crea sesiones ni lee contraseñas.

**`src/components/firebase-setup-notice.tsx` · archivo completo:**

```tsx
import { Alert, Container, Text } from '@mantine/core'

export function FirebaseSetupNotice() {
  return (
    <Container py="xl" size="sm">
      <Alert color="yellow" title="Falta configurar Firebase">
        <Text>
          Completa las seis variables VITE_FIREBASE_ de .env.local con la
          configuración web de tu proyecto y reinicia pnpm dev.
        </Text>
      </Alert>
    </Container>
  )
}
```

### Archivo 7 · src/pages/login-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. useLocation entrega state y useNavigate la acción. Los hooks se ejecutan antes del retorno por configuración ausente. El formulario uncontrolled reutiliza reglas, blur y conexión de campos; noValidate permite mostrar los errores de Form. El handler corta si ya envía o Auth no existe, limpia el error, espera signInWithEmailAndPassword, navega al destino y recupera pending en finally. El Alert general no revela si existe una cuenta. El botón disabled/loading muestra y bloquea el intento. Link preserva el destino hacia Registro. Las props maw/mx/py/px limitan ancho, centran y dan espacio; no añadimos CSS externo.

**`src/pages/login-page.tsx` · archivo completo:**

```tsx
import { Container, Text, Title } from '@mantine/core'

import { FirebaseSetupNotice } from '../components/firebase-setup-notice'
import { auth } from '../firebase/firebase'

export function LoginPage() {

  if (auth === null) {
    return <FirebaseSetupNotice />
  }

  return (
    <Container py="xl" size="sm">
      <Title order={1}>Iniciar sesión</Title>

      <Text>Firebase está configurado. El siguiente paso añadirá el formulario.</Text>
    </Container>
  )
}
```

### Archivo 8 · src/components/app-header.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. El encabezado conserva el contenido y CSS anterior. Link añade una entrada visible a /login sin recargar la página mediante un ancla externa. App declara la ruta que recibirá ese destino.

**`src/components/app-header.tsx` · archivo completo:**

```tsx
import { Link } from 'react-router'

export function AppHeader() {
  return (
    <header className="app-header">
      <p className="app-header__eyebrow">Medialog</p>
      <h1>Tu próxima historia empieza aquí</h1>
      <p>Explora películas y series y organiza tu biblioteca personal.</p>

      <Link to="/login">Iniciar sesión</Link>
    </header>
  )
}
```

### Archivo 9 · src/App.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-01-firebase-config`. Routes compara la ubicación con las rutas declaradas. PublicLayout conserva estructura pública y Outlet; el index redirige a /search. Los imports conectan cada elemento con su página. Antes de B05 biblioteca es una ruta provisional directa; después vive como hija de PrivateLayout. La ruta pública * sigue representando destinos no encontrados.

**`src/App.tsx` · archivo completo:**

```tsx
import { Navigate, Route, Routes } from 'react-router'

import { PublicLayout } from './layouts/public-layout'
import { LoginPage } from './pages/login-page'
import { MediaDetailPage } from './pages/media-detail-page'
import { NotFoundPage } from './pages/not-found-page'
import { SearchPage } from './pages/search-page'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate replace to="/search" />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="media/:mediaType/:externalId"
          element={<MediaDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
```

**Pregunta:** «¿Podemos ocultar una contraseña administrativa poniéndole VITE_?» **Respuesta:** no: ese prefijo incorpora el valor al cliente. La configuración Web de Firebase es pública; una credencial administrativa no pertenece aquí.

**Comprueba:** la búsqueda y detalle anteriores funcionan. Los archivos nuevos no exigen publicar valores reales ni ejecutar Firebase durante el build. **Para retomar:** confirma configuración y pasa a S12-B03; un respaldo de esta etapa no incluye la sesión observada.

**Respaldo:** `session-12-step-01-firebase-config`.

## S12-B03 · Una escucha para el árbol · 34–43

**Entrada:** configuración preparada. **Responsable:** docente construye schema y observer con preguntas; imports y composición visual se copian como soporte.

1. Crea el schema de datos propios. uid es el identificador de la cuenta y email admite null; no validamos ni almacenamos todo User de Firebase.
2. Crea el Context y el provider. Props y callbacks siguen tipados con TypeScript; los datos propios derivan del schema. Recorre estado inicial → suscripción → proyección → parse → setAuthState.
3. Devuelve la función unsubscribe como cleanup. No invoca logout: cancela solamente la escucha. Strict Mode puede mostrar el ciclo adicional en desarrollo; conservamos su comprobación.
4. Conserva useAuth en el mismo archivo auth-provider.tsx. Un consumidor fuera del provider produce un error explícito en vez de un null silencioso.
5. Sustituye main.tsx completo, conservando el orden y los providers heredados. AuthProvider rodea a quienes necesitan sesión; no reemplaza QueryClientProvider ni BrowserRouter. Si falta configuración, representa ausencia disponible para la interfaz y evita una espera eterna. El aviso de B04 explicará por qué no es posible entrar.

### Archivo 1 · src/schemas/auth.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-02-auth-provider`. authUserSchema exige uid y admite email null. discriminatedUnion usa status para distinguir espera, ausencia y sesión con user; z.infer deriva el tipo. Las ampliaciones conservan estas ramas y añaden login/register y destino. email y contraseña comparten reglas; confirmPassword existe solo para comparar y refine coloca el error en ese campo. El destino usa trim y min(1): comprueba un string no vacío, no constituye una política de autorización ni un verificador del servidor.

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
```

### Archivo 2 · src/auth/auth-provider.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-02-auth-provider`. AuthContext empieza en null para detectar un consumidor fuera del provider. AuthProviderProps entrega children; destructuring ocurre dentro de la función. El estado de datos empieza checking con Auth disponible o anonymous sin configuración. toAuthUser proyecta uid/email. El único Effect registra onAuthStateChanged; su retorno cancela la escucha. La notificación propone un estado, parse inspecciona la proyección y setAuthState la expone. useAuth lee Context y produce un error explícito fuera del árbol. No guarda tokens ni decide permisos de servidor.

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

### Archivo 3 · src/main.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-02-auth-provider`. Se conservan StrictMode, QueryClient, sus opciones, Devtools y MantineProvider oscuro. AuthProvider rodea BrowserRouter y App: las páginas y layouts pueden leer sesión. Los estilos y createRoot permanecen; el signo ! de root conserva la entrada Vite existente. QueryClient no cambia quién administra la sesión.

**`src/main.tsx` · archivo completo:**

```tsx
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import App from './App'
import { AuthProvider } from './auth/auth-provider'
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
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

**Pregunta:** «¿Por qué no guardamos userCredential.user al terminar Login?» **Respuesta:** el submit conoce ese intento; Firebase y el observer siguen conociendo la sesión después de recargar o salir.

**Comprueba:** selecciona AuthProvider en React DevTools y observa el estado de su hook: con configuración válida inicia comprobando y recibe el estado de Firebase; con configuración ausente queda anonymous y el aviso seguirá explicándolo. Todavía no hay una guardia visible: se construye en B05. Comprueba que no creamos una escucha en cada página, no copiamos tokens a Context y el catálogo público sigue funcionando. **Para retomar:** conserva esta suscripción y pasa a los formularios en S12-B04.

**Respaldo:** `session-12-step-02-auth-provider`.

## S12-B04 · Login y Registro · 43–53

**Entrada:** provider montado. **Responsable:** docente entrega campos y estilos; grupo completa handlers y predice errores.

1. Amplía el schema completo con correo, contraseña y confirmación. refine compara ambos valores y path coloca el error en confirmPassword. z.infer obtiene los tipos; schemaResolver ejecuta las reglas cuando se envía o sale del campo.
2. Crea auth-destination.ts completo: el submit necesita un destino desde esta etapa. safeParse inspecciona state y conserva un string normalizado o /app/library. Los Links preservan ese dato al cambiar de formulario. No añadimos todavía la guardia.
3. Copia la estructura completa de Login y Registro; identifica la llamada form.onSubmit(handleSubmit), cada form.key y cada getInputProps. El patrón viene de 11, pero aquí no necesitamos onValuesChange para limpiar un preview.
4. Construye cada handleSubmit con la clase: guardas defensivas → pending y error limpio → await Firebase → navigate → catch → finally. La falta de configuración se detiene antes de invocar el SDK. La confirmación no se envía a Firebase.
5. Entrega LibraryPage como página provisional y sustituye App completo. En esta etapa /app/library es solo el destino para observar éxito: **todavía no tiene guardia**. Explica este estado intermedio antes de abrirla sin sesión; la protección se construye en el paso siguiente.
6. Señala dónde se muestra el aviso Firebase y dónde el error remoto. Ni un fallo de configuración ni un rechazo de acceso debe esconder los errores locales del formulario.

### Archivo 1 · src/schemas/auth.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-03-auth-forms`. authUserSchema exige uid y admite email null. discriminatedUnion usa status para distinguir espera, ausencia y sesión con user; z.infer deriva el tipo. Las ampliaciones conservan estas ramas y añaden login/register y destino. email y contraseña comparten reglas; confirmPassword existe solo para comparar y refine coloca el error en ese campo. El destino usa trim y min(1): comprueba un string no vacío, no constituye una política de autorización ni un verificador del servidor.

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

### Archivo 2 · src/auth/auth-destination.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-03-auth-forms`. El import une schema y tipo. DEFAULT_PRIVATE_DESTINATION conserva un objeto tipado. safeParse recibe state desconocido; el if devuelve un from validado y normalizado. Cuando falla devuelve la biblioteca. Esta función no lee Firebase, no navega y no transporta otros datos.

**`src/auth/auth-destination.ts` · archivo completo:**

```ts
import { authDestinationSchema, type AuthDestination } from '../schemas/auth'

const DEFAULT_PRIVATE_DESTINATION: AuthDestination = {
  from: '/app/library',
}

export function toAuthDestination(state: unknown): string {
  const result = authDestinationSchema.safeParse(state)

  if (result.success) {
    return result.data.from
  }

  return DEFAULT_PRIVATE_DESTINATION.from
}
```

### Archivo 3 · src/pages/login-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-03-auth-forms`. useLocation entrega state y useNavigate la acción. Los hooks se ejecutan antes del retorno por configuración ausente. El formulario uncontrolled reutiliza reglas, blur y conexión de campos; noValidate permite mostrar los errores de Form. El handler corta si ya envía o Auth no existe, limpia el error, espera signInWithEmailAndPassword, navega al destino y recupera pending en finally. El Alert general no revela si existe una cuenta. El botón disabled/loading muestra y bloquea el intento. Link preserva el destino hacia Registro. Las props maw/mx/py/px limitan ancho, centran y dan espacio; no añadimos CSS externo.

**`src/pages/login-page.tsx` · archivo completo:**

```tsx
import { Alert, Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { toAuthDestination } from '../auth/auth-destination'
import { FirebaseSetupNotice } from '../components/firebase-setup-notice'
import { auth } from '../firebase/firebase'
import { loginSchema, type LoginFormValues } from '../schemas/auth'

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const destination = toAuthDestination(location.state)

  const form = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: schemaResolver(loginSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  async function handleSubmit(values: LoginFormValues) {

    if (isSubmitting || auth === null) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      navigate(destination, { replace: true })
    } catch {
      setSubmitError('No pudimos iniciar sesión. Revisa los datos e inténtalo otra vez.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (auth === null) {
    return <FirebaseSetupNotice />
  }

  return (
    <Stack maw={420} mx="auto" py="xl" px="md">
      <Title order={1}>Iniciar sesión</Title>

      {submitError !== null ? <Alert color="red">{submitError}</Alert> : null}

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            key={form.key('email')}
            autoComplete="email"
            label="Correo"
            type="email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            key={form.key('password')}
            autoComplete="current-password"
            label="Contraseña"
            {...form.getInputProps('password')}
          />

          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            Iniciar sesión
          </Button>
        </Stack>
      </form>

      <Link state={{ from: destination }} to="/register">
        Crear una cuenta
      </Link>
    </Stack>
  )
}
```

### Archivo 4 · src/pages/register-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-03-auth-forms`. Mantiene el mismo flujo de hooks, pendiente y error del intento; sus valores añaden confirmPassword. PasswordInput usa new-password en ambos campos. El schema compara, pero createUserWithEmailAndPassword recibe únicamente email y password. Firebase crea e inicia sesión; el observer actualizará Context. Finalmente el Link vuelve a Login conservando from. El markup espaciado separa cada control y la acción.

**`src/pages/register-page.tsx` · archivo completo:**

```tsx
import { Alert, Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { toAuthDestination } from '../auth/auth-destination'
import { FirebaseSetupNotice } from '../components/firebase-setup-notice'
import { auth } from '../firebase/firebase'
import { registerSchema, type RegisterFormValues } from '../schemas/auth'

export function RegisterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const destination = toAuthDestination(location.state)

  const form = useForm<RegisterFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: schemaResolver(registerSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  async function handleSubmit(values: RegisterFormValues) {

    if (isSubmitting || auth === null) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      navigate(destination, { replace: true })
    } catch {
      setSubmitError('No pudimos crear la cuenta. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (auth === null) {
    return <FirebaseSetupNotice />
  }

  return (
    <Stack maw={420} mx="auto" py="xl" px="md">
      <Title order={1}>Crear una cuenta</Title>

      {submitError !== null ? <Alert color="red">{submitError}</Alert> : null}

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            key={form.key('email')}
            autoComplete="email"
            label="Correo"
            type="email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            key={form.key('password')}
            autoComplete="new-password"
            label="Contraseña"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            key={form.key('confirmPassword')}
            autoComplete="new-password"
            label="Confirmar contraseña"
            {...form.getInputProps('confirmPassword')}
          />

          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            Crear cuenta
          </Button>
        </Stack>
      </form>

      <Link state={{ from: destination }} to="/login">
        Ya tengo una cuenta
      </Link>
    </Stack>
  )
}
```

### Archivo 5 · src/pages/library-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-03-auth-forms`. Container aporta espacio y el Title/Text hacen observable el destino privado. En B06 se añade el import y <AuthRequestProbe /> debajo del texto. En B07 se retiran ambos; permanece solamente el contenido provisional, sin consulta ni creación remota.

**`src/pages/library-page.tsx` · archivo completo:**

```tsx
import { Container, Text, Title } from '@mantine/core'

export function LibraryPage() {
  return (
    <Container py="xl">
      <Title order={1}>Mi biblioteca</Title>

      <Text>La biblioteca privada se construirá en la siguiente sesión.</Text>
    </Container>
  )
}
```

### Archivo 6 · src/App.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-03-auth-forms`. Routes compara la ubicación con las rutas declaradas. PublicLayout conserva estructura pública y Outlet; el index redirige a /search. Los imports conectan cada elemento con su página. Antes de B05 biblioteca es una ruta provisional directa; después vive como hija de PrivateLayout. La ruta pública * sigue representando destinos no encontrados.

**`src/App.tsx` · archivo completo:**

```tsx
import { Navigate, Route, Routes } from 'react-router'

import { PublicLayout } from './layouts/public-layout'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { LibraryPage } from './pages/library-page'
import { MediaDetailPage } from './pages/media-detail-page'
import { NotFoundPage } from './pages/not-found-page'
import { SearchPage } from './pages/search-page'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate replace to="/search" />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="media/:mediaType/:externalId"
          element={<MediaDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="app/library" element={<LibraryPage />} />
    </Routes>
  )
}
```

**Pregunta:** «¿Un correo con formato correcto garantiza que la cuenta existe?» **Respuesta:** no. Zod revisa formato; Firebase comprueba la cuenta y la contraseña.

**Comprueba:** correo inválido o confirmación distinta impiden el envío; un intento válido bloquea otro submit. Una operación fallida deja mensaje general y permite reintentar. En un proyecto configurado, Registro crea la cuenta e inicia sesión. **Para retomar:** guarda esta etapa y pasa a S12-B05 para proteger el destino provisional.

**Respaldo:** `session-12-step-03-auth-forms`.

## S12-B05 · La guardia y el destino · 53–61

**Entrada:** formularios y página provisional. **Responsable:** construcción interactiva; grupo predice cada una de las tres ramas.

1. Revisa schemas/auth.ts y auth-destination.ts completos, heredados de B04; no volver a escribir. unknown exige comprobar el valor real; safeParse devuelve el destino normalizado o /app/library. No contiene usuarios, contraseñas, tokens ni resultados API.
2. Revisa Login y Registro completos, heredados de B04; no volver a escribir. Sus enlaces conservan state={{ from: destination }}: cambiar de formulario no pierde la página solicitada.
3. Revisa PageState completo, heredado de 10; no volver a escribir. Crea PrivateLayout. Primero checking muestra carga; después anonymous devuelve Navigate con el destino; solo authenticated permite Outlet. Explica narrowing: haber descartado otras ramas permite leer user sin inventar propiedades opcionales.
4. Sustituye App completo: mueve library bajo la rama privada y conserva públicas búsqueda, detalle, Login, Registro y páginas heredadas.
5. Recorre /app/library sin sesión → Login → Registro → acceso exitoso → biblioteca. Las páginas no ejecutan un Effect para navegar; lo hace el evento exitoso.

### Archivo 1 · src/schemas/auth.ts

**Acción:** Revisa; no volver a escribir. **Referencia:** `session-12-step-04-private-routes`. authUserSchema exige uid y admite email null. discriminatedUnion usa status para distinguir espera, ausencia y sesión con user; z.infer deriva el tipo. Las ampliaciones conservan estas ramas y añaden login/register y destino. email y contraseña comparten reglas; confirmPassword existe solo para comparar y refine coloca el error en ese campo. El destino usa trim y min(1): comprueba un string no vacío, no constituye una política de autorización ni un verificador del servidor.

**`src/schemas/auth.ts` · archivo completo; heredado:**

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

### Archivo 2 · src/auth/auth-destination.ts

**Acción:** Revisa; no volver a escribir. **Referencia:** `session-12-step-04-private-routes`. El import une schema y tipo. DEFAULT_PRIVATE_DESTINATION conserva un objeto tipado. safeParse recibe state desconocido; el if devuelve un from validado y normalizado. Cuando falla devuelve la biblioteca. Esta función no lee Firebase, no navega y no transporta otros datos.

**`src/auth/auth-destination.ts` · archivo completo; heredado:**

```ts
import { authDestinationSchema, type AuthDestination } from '../schemas/auth'

const DEFAULT_PRIVATE_DESTINATION: AuthDestination = {
  from: '/app/library',
}

export function toAuthDestination(state: unknown): string {
  const result = authDestinationSchema.safeParse(state)

  if (result.success) {
    return result.data.from
  }

  return DEFAULT_PRIVATE_DESTINATION.from
}
```

### Archivo 3 · src/pages/login-page.tsx

**Acción:** Revisa; no volver a escribir. **Referencia:** `session-12-step-04-private-routes`. useLocation entrega state y useNavigate la acción. Los hooks se ejecutan antes del retorno por configuración ausente. El formulario uncontrolled reutiliza reglas, blur y conexión de campos; noValidate permite mostrar los errores de Form. El handler corta si ya envía o Auth no existe, limpia el error, espera signInWithEmailAndPassword, navega al destino y recupera pending en finally. El Alert general no revela si existe una cuenta. El botón disabled/loading muestra y bloquea el intento. Link preserva el destino hacia Registro. Las props maw/mx/py/px limitan ancho, centran y dan espacio; no añadimos CSS externo.

**`src/pages/login-page.tsx` · archivo completo; heredado:**

```tsx
import { Alert, Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { toAuthDestination } from '../auth/auth-destination'
import { FirebaseSetupNotice } from '../components/firebase-setup-notice'
import { auth } from '../firebase/firebase'
import { loginSchema, type LoginFormValues } from '../schemas/auth'

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const destination = toAuthDestination(location.state)

  const form = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: schemaResolver(loginSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  async function handleSubmit(values: LoginFormValues) {

    if (isSubmitting || auth === null) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      navigate(destination, { replace: true })
    } catch {
      setSubmitError('No pudimos iniciar sesión. Revisa los datos e inténtalo otra vez.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (auth === null) {
    return <FirebaseSetupNotice />
  }

  return (
    <Stack maw={420} mx="auto" py="xl" px="md">
      <Title order={1}>Iniciar sesión</Title>

      {submitError !== null ? <Alert color="red">{submitError}</Alert> : null}

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            key={form.key('email')}
            autoComplete="email"
            label="Correo"
            type="email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            key={form.key('password')}
            autoComplete="current-password"
            label="Contraseña"
            {...form.getInputProps('password')}
          />

          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            Iniciar sesión
          </Button>
        </Stack>
      </form>

      <Link state={{ from: destination }} to="/register">
        Crear una cuenta
      </Link>
    </Stack>
  )
}
```

### Archivo 4 · src/pages/register-page.tsx

**Acción:** Revisa; no volver a escribir. **Referencia:** `session-12-step-04-private-routes`. Mantiene el mismo flujo de hooks, pendiente y error del intento; sus valores añaden confirmPassword. PasswordInput usa new-password en ambos campos. El schema compara, pero createUserWithEmailAndPassword recibe únicamente email y password. Firebase crea e inicia sesión; el observer actualizará Context. Finalmente el Link vuelve a Login conservando from. El markup espaciado separa cada control y la acción.

**`src/pages/register-page.tsx` · archivo completo; heredado:**

```tsx
import { Alert, Button, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'

import { toAuthDestination } from '../auth/auth-destination'
import { FirebaseSetupNotice } from '../components/firebase-setup-notice'
import { auth } from '../firebase/firebase'
import { registerSchema, type RegisterFormValues } from '../schemas/auth'

export function RegisterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const destination = toAuthDestination(location.state)

  const form = useForm<RegisterFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: schemaResolver(registerSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  async function handleSubmit(values: RegisterFormValues) {

    if (isSubmitting || auth === null) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      navigate(destination, { replace: true })
    } catch {
      setSubmitError('No pudimos crear la cuenta. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (auth === null) {
    return <FirebaseSetupNotice />
  }

  return (
    <Stack maw={420} mx="auto" py="xl" px="md">
      <Title order={1}>Crear una cuenta</Title>

      {submitError !== null ? <Alert color="red">{submitError}</Alert> : null}

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            key={form.key('email')}
            autoComplete="email"
            label="Correo"
            type="email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            key={form.key('password')}
            autoComplete="new-password"
            label="Contraseña"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            key={form.key('confirmPassword')}
            autoComplete="new-password"
            label="Confirmar contraseña"
            {...form.getInputProps('confirmPassword')}
          />

          <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
            Crear cuenta
          </Button>
        </Stack>
      </form>

      <Link state={{ from: destination }} to="/login">
        Ya tengo una cuenta
      </Link>
    </Stack>
  )
}
```

### Archivo 5 · src/components/page-state.tsx

**Acción:** Revisa; no volver a escribir. **Referencia:** `session-12-step-04-private-routes`. Referencia heredada, no volver a escribir. El componente presenta estados completos sin importar Firebase o Router. PrivateLayout entrega variant loading y textos propios; la decisión checking pertenece al layout. Las otras variantes, props y estilos permanecen para consumidores anteriores.

**`src/components/page-state.tsx` · archivo completo; heredado:**

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

### Archivo 6 · src/layouts/private-layout.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-04-private-routes`. Todos los hooks se invocan antes de retornos. checking utiliza PageState; anonymous devuelve Navigate replace con from:location.pathname. Solo tras descartar esas situaciones permite Outlet y, en B07, accede a user.email para el header. Outlet es el lugar donde aparece LibraryPage. replace evita conservar la redirección como una visita adicional; no convierte la guardia en seguridad del backend.

**`src/layouts/private-layout.tsx` · archivo completo:**

```tsx
import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '../auth/auth-provider'
import { PageState } from '../components/page-state'

export function PrivateLayout() {
  const authState = useAuth()
  const location = useLocation()

  if (authState.status === 'checking') {
    return (
      <PageState
        variant="loading"
        title="Comprobando sesión"
        description="Espera mientras Firebase recupera tu sesión."
      />
    )
  }

  if (authState.status === 'anonymous') {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/login"
      />
    )
  }

  return <Outlet />
}
```

### Archivo 7 · src/App.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-04-private-routes`. Routes compara la ubicación con las rutas declaradas. PublicLayout conserva estructura pública y Outlet; el index redirige a /search. Los imports conectan cada elemento con su página. Antes de B05 biblioteca es una ruta provisional directa; después vive como hija de PrivateLayout. La ruta pública * sigue representando destinos no encontrados.

**`src/App.tsx` · archivo completo:**

```tsx
import { Navigate, Route, Routes } from 'react-router'

import { PublicLayout } from './layouts/public-layout'
import { PrivateLayout } from './layouts/private-layout'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { LibraryPage } from './pages/library-page'
import { MediaDetailPage } from './pages/media-detail-page'
import { NotFoundPage } from './pages/not-found-page'
import { SearchPage } from './pages/search-page'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Navigate replace to="/search" />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="media/:mediaType/:externalId"
          element={<MediaDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="app" element={<PrivateLayout />}>
        <Route path="library" element={<LibraryPage />} />
      </Route>
    </Routes>
  )
}
```

**Pregunta:** «¿La guardia protege una petición hecha desde fuera de nuestra app?» **Respuesta:** no. Decide qué mostrar en React; el servidor sigue verificando sus propias peticiones.

**Comprueba:** no se muestra la biblioteca durante checking ni sin sesión; después del acceso se conserva el destino. Recargar con sesión restaurable mantiene acceso. **Para retomar:** la guardia queda funcionando antes de S12-B06; todavía no existe credencial HTTP en el helper.

**Respaldo:** `session-12-step-04-private-routes`.

## S12-B06 · Del usuario al request · 61–67

**Entrada:** pantalla privada protegida. **Responsable:** demostración docente; grupo predice el status de cada botón.

1. Sustituye src/api/http.ts completo. Conserva la base API heredada: el argumento path es una ruta, no otro dominio. ApiError añade status al error común.
2. Construye requestJsonWithAuth: comprueba Auth disponible y usuario actual, pide getIdToken, copia headers, añade Bearer y delega. El token existe solo durante esa operación; no lo mostramos, almacenamos ni forzamos su refresh.
3. Entrega el fetcher temporal de comprobación. El schema comprueba authenticated:true sobre el JSON real; el tipo se deriva con z.infer y el fetcher ejecuta parse. Ambos métodos reciben /api/v2/auth/check, pues requestJson ya antepone VITE_API_URL.
4. Crea el probe completo y sustituye LibraryPage completa para montarlo debajo del texto. Lee cada onClick, su callback y el manejo de error. El resultado solo se registra como booleano o status; no se copia a estado de sesión.
5. Abre Console y Network. Con una sesión activa, ejecuta primero sin credencial y después con credencial. Observa status y resultado sin expandir, copiar, imprimir ni capturar el token. Un 200 depende de un proyecto admitido por el servidor y del origen autorizado.

Prueba sencilla sin credencial, opcional en la terminal de clase:

```bash
curl --include https://bootcamp-medialog.cardor.dev/api/v2/auth/check
```

La [URL pública de comprobación](https://bootcamp-medialog.cardor.dev/api/v2/auth/check) puede abrirse en el navegador sin token. El resultado esperado es 401; abrirla no prueba aceptación autenticada. No pegamos tokens en comandos de aula.

### Archivo 1 · src/api/http.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-05-authenticated-request`. ApiError extiende Error, conserva name y status con una propiedad readonly explícita. requestJson conserva fetch(API_URL + path), comprueba response.ok y devuelve el JSON declarado. El cast no valida el JSON recibido: el fetcher de diagnóstico ejecuta parse. requestJsonWithAuth rechaza configuración ausente o usuario null, solicita getIdToken sin refresh forzado, copia headers y establece Authorization. El spread conserva las demás opciones y delega status/JSON al helper común. No añade logout ni retry ante 401.

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
```

### Archivo 2 · src/api/auth.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-05-authenticated-request`. Diagnóstico temporal. authCheckSchema comprueba el subconjunto que consumimos, authenticated:true; el contrato público también incluye uid y puede incluir projectId, que aquí no mostramos. z.object admite campos extra y prepara solo el dato utilizado. Ambos fetchers reciben unknown y ejecutan parse; difieren únicamente en el helper público o privado. AUTH_CHECK_PATH no duplica la base del cliente.

**`src/api/auth.ts` · archivo completo:**

```ts
import { z } from 'zod/v4'

import { requestJson, requestJsonWithAuth } from './http'

const authCheckSchema = z.object({
  authenticated: z.literal(true),
})

export type AuthCheckDto = z.infer<typeof authCheckSchema>

const AUTH_CHECK_PATH = '/api/v2/auth/check'

export async function checkRequestWithoutAuth(): Promise<AuthCheckDto> {
  const json = await requestJson<unknown>(AUTH_CHECK_PATH)

  return authCheckSchema.parse(json)
}

export async function checkAuthenticatedRequest(): Promise<AuthCheckDto> {
  const json = await requestJsonWithAuth<unknown>(AUTH_CHECK_PATH)

  return authCheckSchema.parse(json)
}
```

### Archivo 3 · src/components/auth-request-probe.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-05-authenticated-request`. AuthCheckRequest describe una función que devuelve la promesa del DTO. runProbe espera la operación y registra solo authenticated; en catch muestra status si es ApiError o desconocido para otro fallo. Cada onClick entrega una función, no ejecuta el request durante render. void declara que el callback no devuelve una promesa a la UI; runProbe ya captura rechazo. Group y mt aportan espacio. No contiene token, credencial o una copia de respuesta en React.

**`src/components/auth-request-probe.tsx` · archivo completo:**

```tsx
import { Button, Group } from '@mantine/core'

import {
  checkAuthenticatedRequest,
  checkRequestWithoutAuth,
  type AuthCheckDto,
} from '../api/auth'
import { ApiError } from '../api/http'

type AuthCheckRequest = () => Promise<AuthCheckDto>

async function runProbe(label: string, request: AuthCheckRequest) {
  try {
    const result = await request()
    console.info(label, result.authenticated)
  } catch (error) {
    console.info(
      label,
      error instanceof ApiError ? error.status : 'desconocido',
    )
  }
}

export function AuthRequestProbe() {
  return (
    <Group mt="md">
      <Button
        onClick={() => void runProbe('Sin credencial', checkRequestWithoutAuth)}
        type="button"
      >
        Probar sin credencial
      </Button>

      <Button
        onClick={() => void runProbe('Con credencial', checkAuthenticatedRequest)}
        type="button"
      >
        Probar con credencial
      </Button>
    </Group>
  )
}
```

### Archivo 4 · src/pages/library-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-05-authenticated-request`. Container aporta espacio y el Title/Text hacen observable el destino privado. En B06 se añade el import y <AuthRequestProbe /> debajo del texto. En B07 se retiran ambos; permanece solamente el contenido provisional, sin consulta ni creación remota.

**`src/pages/library-page.tsx` · archivo completo:**

```tsx
import { Container, Text, Title } from '@mantine/core'

import { AuthRequestProbe } from '../components/auth-request-probe'

export function LibraryPage() {
  return (
    <Container py="xl">
      <Title order={1}>Mi biblioteca</Title>

      <Text>La biblioteca privada se construirá en la siguiente sesión.</Text>

      <AuthRequestProbe />
    </Container>
  )
}
```

**Pregunta:** «Si puedo ver biblioteca, ¿por qué el primer botón recibe 401?» **Respuesta:** el helper público no añade la credencial; guardia y request son recorridos distintos.

**Comprueba:** anota 401 anónimo y, solo cuando ocurra, 200 autenticado. Si el token no fue aceptado o CORS bloquea, registra esa evidencia ausente; no conviertas el build en prueba del backend. **Para retomar:** conserva la etapa con probe solo mientras falte explicar o comprobar este contraste. Se retira en S12-B07.

**Respaldo:** `session-12-step-05-authenticated-request`.

## S12-B07 · Salir y retirar el diagnóstico · 67–72

**Entrada:** probe explicado. **Responsable:** docente y grupo completan logout; retiramos soporte temporal.

1. Crea PrivateHeader completo. Su prop email admite null y muestra un texto neutral en ese caso. Construye el handler desde el botón: bloquear repetición, limpiar error, esperar signOut y navegar solo tras éxito. Ante fallo restablece pending y conserva sesión para reintentar.
2. Sustituye PrivateLayout completo para montar el header antes de main/Outlet. Solo lee authState.user después de resolver checking y anonymous.
3. Sustituye LibraryPage completa con su texto provisional. Retira el import y JSX del probe; elimina src/components/auth-request-probe.tsx y src/api/auth.ts, que eran exclusivamente diagnóstico.
4. Conserva src/api/http.ts con ApiError y requestJsonWithAuth. La siguiente sesión sí tendrá un consumidor privado real; no añadimos todavía requestJsonWithOptionalAuth ni queries personales.

### Archivo 1 · src/components/private-header.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-06-logout`. PrivateHeaderProps define email nullable y el destructuring ocurre dentro. useNavigate conoce el destino, mientras isLoggingOut/logoutError pertenecen al botón. El handler corta doble intento o Auth ausente, espera signOut y navega solo tras éxito; si falla muestra error y libera pending. Tras éxito el header se desmonta: no necesita liberar pending. Link conserva navegación pública/privada, ?? muestra Sesión activa si falta correo, loading/disabled bloquean el botón. Stack/Group organizan navegación y acciones mediante las props visibles.

**`src/components/private-header.tsx` · archivo completo:**

```tsx
import { Alert, Button, Group, Stack, Text } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { auth } from '../firebase/firebase'

type PrivateHeaderProps = {
  email: string | null
}

export function PrivateHeader(props: PrivateHeaderProps) {
  const { email } = props
  const navigate = useNavigate()
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

### Archivo 2 · src/layouts/private-layout.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-06-logout`. Todos los hooks se invocan antes de retornos. checking utiliza PageState; anonymous devuelve Navigate replace con from:location.pathname. Solo tras descartar esas situaciones permite Outlet y, en B07, accede a user.email para el header. Outlet es el lugar donde aparece LibraryPage. replace evita conservar la redirección como una visita adicional; no convierte la guardia en seguridad del backend.

**`src/layouts/private-layout.tsx` · archivo completo:**

```tsx
import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '../auth/auth-provider'
import { PageState } from '../components/page-state'
import { PrivateHeader } from '../components/private-header'

export function PrivateLayout() {
  const authState = useAuth()
  const location = useLocation()

  if (authState.status === 'checking') {
    return (
      <PageState
        variant="loading"
        title="Comprobando sesión"
        description="Espera mientras Firebase recupera tu sesión."
      />
    )
  }

  if (authState.status === 'anonymous') {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/login"
      />
    )
  }

  return (
    <>
      <PrivateHeader email={authState.user.email} />

      <main>
        <Outlet />
      </main>
    </>
  )
}
```

### Archivo 3 · src/pages/library-page.tsx

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-06-logout`. Container aporta espacio y el Title/Text hacen observable el destino privado. En B06 se añade el import y <AuthRequestProbe /> debajo del texto. En B07 se retiran ambos; permanece solamente el contenido provisional, sin consulta ni creación remota.

**`src/pages/library-page.tsx` · archivo completo:**

```tsx
import { Container, Text, Title } from '@mantine/core'

export function LibraryPage() {
  return (
    <Container py="xl">
      <Title order={1}>Mi biblioteca</Title>

      <Text>La biblioteca privada se construirá en la siguiente sesión.</Text>

    </Container>
  )
}
```

**Retirada exacta:** elimina `src/components/auth-request-probe.tsx` y `src/api/auth.ts`. El archivo completo de LibraryPage anterior ya retiró su import y consumidor. No elimines `src/api/http.ts`.

**Pregunta:** «¿Si signOut falla borramos igualmente pantalla y caché?» **Respuesta:** no. Conservamos la sesión visible y permitimos reintentar. La limpieza de queries personales se enseña cuando exista la primera biblioteca remota.

**Comprueba:** salir lleva a Login; volver a biblioteca activa la guardia. El catálogo sigue público y no hay archivos ni botones del probe. **Para retomar:** inicia S12-B08 con este código sin diagnóstico temporal.

**Respaldo:** `session-12-step-06-logout`.

## S12-B08 · Trabajo con agente y práctica · 72–82

**Entrada:** destino y guardia escritos por la persona. **Responsable:** estudiantes definen la matriz; el agente redacta únicamente tests; una persona los lee y ejecuta.

1. Acuerda seis comportamientos: string conservado, espacios exteriores recortados, undefined, null, from no string y texto vacío. El fallback siempre es /app/library.
2. Usa el prompt siguiente. Si no está disponible ahk-test, conserva el mismo alcance y revisa manualmente la referencia completa del test después de decidir la matriz:

```text
Lee src/auth/auth-destination.ts, src/schemas/auth.ts y un test puro cercano.
Usa la skill ahk-test para proponer, redactar y ejecutar pruebas Vitest:
1. Conserva un from string.
2. Recorta espacios exteriores.
3. State undefined usa /app/library.
4. State null usa /app/library.
5. From no string usa /app/library.
6. From vacío o de solo espacios usa /app/library.

Solo puedes modificar src/auth/__tests__/auth-destination.test.ts
y soporte exclusivo dentro de src/auth/__tests__/fixtures/.
Producción, Firebase, provider, páginas, rutas, cliente HTTP, configuración,
dependencias y otros tests permanecen en solo lectura.
No uses snapshots ni debilites expectativas. Si aparece una contradicción,
detente y explícala antes de cambiar código.

Ejecuta pnpm exec vitest run src/auth/__tests__/auth-destination.test.ts.
Entrega matriz, archivos, resultado y exit status; explica entradas,
salidas, supuestos y límites. No afirmes haber probado Firebase o el navegador.
```

3. Lee el archivo completo, cada entrada y expectativa y el diff. Ejecuta la prueba enfocada:

```bash
pnpm exec vitest run src/auth/__tests__/auth-destination.test.ts
```

4. Mientras se completa la comprobación, los estudiantes recorren Login/Registro y el retorno desde biblioteca con una cuenta de prueba propia. Si Firebase no está disponible, explica tres ramas de PrivateLayout sobre el código y marca el recorrido real pendiente; no inventes un acceso exitoso.

### Archivo 1 · src/auth/__tests__/auth-destination.test.ts

**Acción:** Crea o sustituye el archivo entero. **Referencia:** `session-12-step-07-auth-destination-tests`. Cada caso entrega una entrada a la función real y compara su salida observable. Las entradas inválidas no se convierten por cast. Los tests no crean Firebase, no montan componentes ni simulan Router. Su resultado solo acredita la matriz pura de normalización; las pruebas de integración se hacen aparte.

**`src/auth/__tests__/auth-destination.test.ts` · archivo completo:**

```ts
import { describe, expect, it } from 'vitest'

import { toAuthDestination } from '../auth-destination'

describe('toAuthDestination', () => {
  it('conserva el destino solicitado', () => {
    expect(toAuthDestination({ from: '/app/library' })).toBe('/app/library')
    expect(toAuthDestination({ from: '/search' })).toBe('/search')
  })

  it('elimina los espacios exteriores del destino', () => {
    expect(toAuthDestination({ from: '  /search  ' })).toBe('/search')
  })

  it('usa la biblioteca cuando state es undefined', () => {
    expect(toAuthDestination(undefined)).toBe('/app/library')
  })

  it('usa la biblioteca cuando state es null', () => {
    expect(toAuthDestination(null)).toBe('/app/library')
  })

  it('usa la biblioteca cuando from no es un string', () => {
    expect(toAuthDestination({ from: 123 })).toBe('/app/library')
  })

  it('usa la biblioteca cuando el destino está vacío o solo contiene espacios', () => {
    expect(toAuthDestination({ from: '' })).toBe('/app/library')
    expect(toAuthDestination({ from: '   ' })).toBe('/app/library')
  })
})
```

**Pregunta:** «¿Qué caso del test demuestra que el token funciona?» **Respuesta:** ninguno. Es una prueba pura del destino, sin SDK, Router, navegador o backend.

**Comprueba:** cada estudiante puede explicar al menos un caso y su límite. **Para retomar:** conserva el diff leído y la salida enfocada; pasa a S12-B09 para comprobar la integración por separado.

**Respaldo:** `session-12-step-07-auth-destination-tests`.

## S12-B09 · Comprobar y cerrar oralmente · 82–90

1. Ejecuta las comprobaciones locales sobre el último paso:

```bash
pnpm exec vitest run src/auth/__tests__/auth-destination.test.ts
pnpm test
pnpm lint
pnpm build
```

2. Recoge los resultados observados en navegador sin mezclarlos con los comandos:

| Caso | Resultado observable | Qué acredita |
| --- | --- | --- |
| Firebase sin configurar | Aviso claro en Login y catálogo público disponible | Contingencia local, sin sesión real. |
| Formato inválido | Error en el campo antes de Firebase | Reglas y conexión del formulario. |
| Rechazo remoto | Mensaje general, valores conservados y otro intento disponible | Manejo del intento fallido observado. |
| Registro y Login correctos | Sesión y destino visible | Solo cuando se ejecutaron contra Firebase real. |
| Biblioteca sin sesión | Redirección a Login con destino | Guardia de interfaz observada. |
| Recarga autenticada | Comprobación inicial y sesión restaurada | Restauración observada en ese navegador. |
| Logout | Vuelve a Login y biblioteca vuelve a bloquearse | Evento y guardia observados. |
| Probe durante B06 | Status anónimo y autenticado anotados | Solo una aceptación real acredita el servidor. |
| Cierre | Sin componente, fetchers o botón de diagnóstico | Retirada del soporte temporal. |
| Búsqueda, detalle y formulario local | Conservan comportamiento de 11 | Regresión pública observada. |

3. Formula estas preguntas sin volver a las diapositivas:

- **¿Por qué checking existe?** Firebase todavía puede estar recuperando una sesión; decidir antes puede mandar a Login a una persona que ya estaba dentro.
- **¿Qué conserva el formulario y qué conserva el provider?** El formulario conserva campos y el intento actual. El provider expone datos de sesión comunicados por Firebase.
- **¿Por qué guardar solo uid/email?** Son los campos que nuestra interfaz necesita; no duplicamos el objeto externo ni el token.
- **¿Qué hace el destino?** Permite volver a la página solicitada después del acceso; su test no prueba que Router navegó.
- **¿Por qué la guardia no basta para un request?** La guardia decide pantalla; el helper añade credencial y el servidor la verifica.
- **¿Qué ocurre si signOut falla?** Conservamos sesión visible y posibilidad de reintentar; no navegamos como si hubiera funcionado.
- **¿Qué falta para guardar un medio?** Conectar creación y biblioteca remotas en 13; el formulario actual sigue preparando datos locales.

4. Registra el cierre o la pausa. Usa esta ficha, con datos de lo que realmente ocurrió:

```text
Sesión: 12
Último bloque y paso comprobado:
Rama o commit del trabajo guardado:
Comportamiento observado:
Primera acción pendiente:
Evidencia local pendiente:
Recorrido de navegador pendiente:
Aceptación Firebase/servidor pendiente:
```

Un respaldo recupera archivos; no acredita comprensión ni explicación pendiente. La siguiente reunión comienza comprobando ese punto antes de introducir una dependencia.

## Errores frecuentes y contingencias

| Hallazgo | Intervención |
| --- | --- |
| Se intenta compilar con variables vacías y falla todo el catálogo | Revisar la condición del módulo Firebase y conservar auth:null con aviso. |
| Pnpm rechaza scripts ignorados | Entregar la política de dos scripts revisados y ejecutar instalación congelada; no aprobar todos. |
| Se usa currentUser:null como prueba inmediata de ausencia | Esperar el observer; mantener checking mientras restaura. |
| Se instala un listener en cada página | Mantener únicamente la suscripción de AuthProvider con cleanup. |
| useAuth fuera del árbol | Comprobar el montaje completo en main, sin eliminar el error defensivo. |
| Login copia usuario a Zustand | Mantener Firebase como propietario y observer como fuente del Context. |
| Registro envía confirmPassword | Enviar solo los dos argumentos del SDK; confirmación es local. |
| Hooks después de un retorno por configuración | Invocar hooks en el mismo orden antes de la condición. |
| Un Effect intenta navegar o cerrar sesión | Trasladar al handler que conoce el evento y su resultado. |
| ApiError pierde status | Revisar constructor y propiedad readonly; no convertir todo a un booleano. |
| URL API duplicada | El helper antepone la base; el fetcher entrega una ruta relativa. |
| Bearer sustituye otros headers | Usar new Headers(init?.headers), establecer Authorization y delegar. |
| Token copiado a consola o estado | Retirar esa copia; conservar solo el token local al request. |
| Proyecto Firebase no aceptado o CORS bloqueado | Registrar dependencia externa para resolver fuera de clase; no reescribir Login ni declarar éxito. |
| Agente tarda o falla | Conservar la matriz humana, entregar test completo y leerlo antes de ejecutar. |
| Falta tiempo | Copiar soporte del bloque, comprobar la decisión central y registrar la pausa; no adelantar mutaciones. |

La configuración vacía permite revisar el árbol y ejecutar checks locales; no demuestra Firebase. Una respuesta controlada sirve para explorar comportamiento, pero no se presenta como aceptación del servicio público. Si falta configuración individual o backend, separa la parte completada de la evidencia pendiente.

## Fuera de alcance y dependencia siguiente

No añadimos Firestore, proveedores sociales, recuperación de contraseña, persistencia propia del token, refresh forzado, retry global o logout automático ante 401. No usamos Effects para submit, navegación o requests. No se implementan query privada, POST de creación, optional auth, authScope o limpieza de datos personales.

La sesión 13 recibe AuthProvider, guardia, formularios, logout, ApiError, requestJsonWithAuth y el formulario local de 11. Allí aparece el primer uso real de creación y biblioteca, con caché separada por usuario. La salida de 12 conserva solo la página provisional.

## Fuentes verificadas

Firebase 12.16.0, Router 8.3.1 y Mantine 9.4.1 corresponden al stack fijado de la cohorte. Documentación consultada mediante Context7 y fuentes oficiales; Mintlify no estuvo disponible. Fecha: 8 de octubre de 2026.

- [Firebase: acceso con correo y contraseña](https://firebase.google.com/docs/auth/web/password-auth).
- [Firebase: observer e inicialización del usuario](https://firebase.google.com/docs/auth/web/manage-users).
- [Firebase: getIdToken](https://firebase.google.com/docs/reference/js/auth#getidtoken).
- [Firebase: verificación de tokens en servidor](https://firebase.google.com/docs/auth/admin/verify-id-tokens).
- [Router: rutas y Outlet](https://reactrouter.com/start/declarative/routing).
- [Router: navegación](https://reactrouter.com/start/declarative/navigating).

La lectura del contrato del servidor y un 401 anónimo no reemplazan ejecutar un 200 con la configuración de la cohorte.
