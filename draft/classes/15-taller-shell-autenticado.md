# Clase 15 · Cliente HTTP autenticado y taller de shell privado

- **Semana:** 5
- **Modalidad:** presencial
- **Duración:** 180 minutos: 75 de progreso guiado, 30 de descanso, 60 de taller y 15 de revisión
- **Punto de entrada:** checkpoint de la clase 14 con Firebase Email/Password, `AuthProvider`, sesión restaurable, `PrivateLayout` y rutas privadas provisionales
- **Checkpoint de salida:** cliente HTTP capaz de enviar el Firebase ID token sin almacenarlo y shell privado con navegación, identidad y logout

## Resultado de aprendizaje

El estudiante podrá distinguir una sesión visible en React de un request aceptado por el backend, centralizar el header `Authorization: Bearer`, conservar el status de una respuesta fallida y completar un layout privado sin duplicar la sesión ni guardar el token manualmente.

## Limitación que abre la clase

La clase 14 ya permite entrar a `/app/library`, pero esa protección solo decide qué componente representa el navegador. El backend todavía no recibe ninguna prueba de identidad:

```text
Firebase reconoce al usuario
→ AuthProvider expone authenticated
→ PrivateLayout representa Outlet
→ la interfaz privada aparece

pero

requestJson público
→ no envía Authorization
→ el backend responde 401 en un endpoint protegido
```

Ocultar una ruta no protege datos remotos. Esta clase conecta ambos recorridos sin convertir el token en estado de React, sin guardarlo en Zustand y sin copiarlo a `localStorage`.

La clase 16 recibirá este shell ya resuelto y se concentrará únicamente en los valores y el payload del formulario. La clase 17 consumirá el cliente autenticado desde una mutación real; no volverá a construir el header.

## Prerrequisito docente del backend

Antes de iniciar la cohorte, el docente deja disponible en la rama externa `bootcamp` un endpoint mínimo protegido:

```text
GET /api/v2/auth/check
Authorization: Bearer <Firebase ID token>
```

Respuesta esperada con un token válido de un proyecto permitido:

```json
{
  "authenticated": true
}
```

Sin un token aceptado, el servicio responde `401`. Este endpoint permite comprobar autenticación sin adelantar los filtros y DTO de la biblioteca personal que pertenecen a la clase 18.

El docente entrega `VITE_API_URL` ya funcional. Los estudiantes no clonan, ejecutan, configuran ni modifican `medialog-server`; tampoco implementan CORS, validación de tokens, allowlist de proyectos, jobs o pollers. Todo ese trabajo ocurre fuera del curso.

## Conceptos que se enseñan y consolidan

- Sesión de interfaz frente a autenticación de un request.
- Firebase ID token y obtención bajo demanda mediante `getIdToken`.
- Header `Authorization` y esquema `Bearer`.
- Composición de `Headers` sin perder headers previos.
- Cliente HTTP público frente a cliente HTTP autenticado.
- Error genérico frente a `ApiError` con status HTTP.
- Diferencia conceptual entre `401 Unauthorized` y `403 Forbidden`.
- Evento de logout frente a sincronización con un sistema externo.
- Responsabilidad de `PrivateHeader`, `PrivateLayout` y `AuthProvider`.
- Datos que no deben almacenarse ni mostrarse.

## Mapa de responsabilidades

| Pieza | Responsabilidad al cerrar la clase | Lo que no hace |
| --- | --- | --- |
| `AuthProvider` | Observar Firebase y exponer `checking`, `anonymous` o `authenticated`. | No obtiene un token para cada request ni conoce el backend. |
| `PrivateLayout` | Resolver la guardia y componer `PrivateHeader` con el `Outlet` privado. | No implementa el formulario de biblioteca ni consulta registros. |
| `PrivateHeader` | Mostrar navegación privada, correo disponible y acción de logout. | No conserva una segunda copia del usuario ni del token. |
| `requestJson<T>` | Ejecutar requests comunes y convertir respuestas HTTP fallidas en `ApiError`. | No agrega autenticación por defecto a endpoints públicos. |
| `requestJsonWithAuth<T>` | Obtener el token vigente en el momento del request, combinar headers y delegar en `requestJson<T>`. | No guarda el token, no reintenta y no cierra sesión automáticamente. |
| `checkAuthenticatedRequest` | Comprobar temporalmente que el backend acepta el request autenticado. | No representa estado remoto permanente en la interfaz. |

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 18 minutos. Recupera el estado de sesión de la clase 14, hace visible la diferencia entre una ruta privada y un endpoint protegido, y presenta el recorrido del ID token. La demostración en el editor construye después cada pieza. Las diapositivas no deben entregar la solución completa del taller.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | React ya conoce la sesión | Recuperar `checking → anonymous | authenticated`, la guardia de `PrivateLayout` y el lugar que ocupa `Outlet`. | Mostrar el diagrama de la clase 14 y pedir que identifiquen qué pieza conoce al usuario. No reconstruir Firebase. |
| Problema | El servidor no puede ver ese estado | Una condición de render protege la experiencia de navegación, pero no añade identidad a un request. | Diagrama dividido: árbol React a la izquierda y request HTTP a la derecha. Preguntar qué información cruza realmente la red. |
| Distinción | Usuario, sesión y token no son sinónimos | El objeto `User` describe al usuario en el cliente; Firebase mantiene la sesión; el ID token es la credencial temporal que el backend puede verificar. | No llamar al ID token “token de Google” ni “contraseña”. Un login Email/Password también produce un Firebase ID token. |
| Flujo | Obtener, enviar y verificar | El cliente pide el token vigente a Firebase, lo coloca en `Authorization`, y el backend verifica firma, proyecto y claims antes de aceptar identidad. | Flechas `evento/query → helper auth → Firebase → header → backend`. Aclarar que la mera presencia del header no autentica. |
| Sintaxis | Bearer es el esquema del header | La forma es `Authorization: Bearer <token>`. `Bearer` describe cómo se presenta la credencial; no es el tipo de dato ni un store. | Mostrar un token sustituido por `<ID token>`. Nunca proyectar el valor real. |
| Diseño | Dos helpers, dos intenciones | Búsqueda y detalle públicos continúan con `requestJson`. Las operaciones privadas eligen `requestJsonWithAuth`; así el contrato queda visible en cada fetcher. | Contrastar firmas, no duplicar dos implementaciones completas de `fetch`. |
| Necesidad | Ahora sí importa el status | El `Error` de la clase 07 podía mostrar un mensaje, pero no permitía distinguir `401` de `409`. `ApiError` conserva `status` cuando la respuesta HTTP falla. | Secuencia pedagógica: primero aparece una decisión por status; después se extrae el tipo. No presentar una jerarquía de errores. |
| Contraste | 401 no significa lo mismo que 403 | `401` indica que el servidor no aceptó una identidad válida para el request. `403` indica que reconoció la identidad, pero no permite esa acción. | En esta clase se observa `401`; `403` se define para evitar mensajes incorrectos. |
| Seguridad | El token se solicita; no se colecciona | Firebase administra el ciclo del token. El cliente lo obtiene cuando necesita enviarlo y no lo copia a estado, Context, Zustand, variables de módulo o almacenamiento persistente. | Tabla “sí: memoria interna de Firebase / no: nuestros stores”. Evitar enseñar decodificación del JWT. |
| Evento | Logout ocurre por una acción conocida | El botón ejecuta `signOut`, espera su promesa y navega después del éxito. El observer ya existente actualiza el provider. No hace falta observar otro estado con un Effect. | Contrastar `onClick → handleLogout` con un Effect que intenta descubrir que el clic ya ocurrió. |
| Límite | Todavía no creamos un registro | El request de comprobación demuestra la infraestructura. `status`, `priority`, `notes`, `useMutation` e invalidación empiezan en las clases 16 y 17. | Mostrar una línea de continuidad, no el body ni el hook futuro. |

### Diagrama principal para las diapositivas

```text
acción que necesita datos privados
              │
              ▼
 requestJsonWithAuth<T>
              │
              ├── auth.currentUser
              ├── getIdToken(user)
              └── Headers + Authorization: Bearer …
                              │
                              ▼
                       requestJson<T>
                              │
                              ▼
                 backend verifica el token
                      │               │
                      ▼               ▼
                    200        ApiError(401)
```

El diagrama no debe sugerir que React valida el token. React inicia el recorrido; Firebase lo emite y el backend decide si lo acepta.

### Contrastes y notas docentes que deben sobrevivir a las slides

- `authState.status === "authenticated"` permite representar la rama privada, pero no modifica `fetch`.
- `getIdToken(user)` devuelve un Firebase ID token. No es una contraseña, una API key ni el access token de un proveedor social.
- La configuración `VITE_FIREBASE_*` identifica el proyecto. No sustituye el ID token del usuario y no se envía como un header adicional diseñado por el curso.
- `auth.currentUser` se usa dentro del helper para obtener la credencial actual; la interfaz sigue usando `AuthProvider` como fuente de verdad para decidir qué renderizar.
- El helper crea `new Headers(init?.headers)` antes de escribir `Authorization`; así conserva, por ejemplo, un futuro `Content-Type` ya entregado por el fetcher.
- `requestJsonWithAuth` delega el manejo de `response.ok` y JSON a `requestJson`; no duplica esa lógica.
- Un usuario ausente antes de construir el request es un problema local de sesión. Un `401` recibido después de enviar el request es una respuesta del servidor. No presentarlos como el mismo evento.
- No forzar refresh con `getIdToken(user, true)` en cada request. Firebase devuelve el token vigente y lo renueva cuando corresponde.
- No cerrar sesión automáticamente ante cualquier `401`: también puede existir una configuración de proyecto no permitida o un error de entorno. El helper conserva el status y cada caso de uso decide qué comunicar.
- El correo de Firebase es nullable. El header debe ofrecer un texto neutral como “Sesión activa” cuando no exista.
- Logout pertenece al handler del botón. `onAuthStateChanged` sigue siendo el único Effect porque sincroniza React con Firebase.
- La limpieza de queries privadas al cerrar sesión se incorpora en la clase 18, cuando exista la primera respuesta personal en caché. En esta clase la caché contiene datos públicos.
- No usar Zustand para la sesión ni para abrir este header. Zustand aparecerá cuando el drawer de mejoras tenga disparadores distantes y guardará solo su identidad mínima.

### Snippets conceptuales para las slides

La firma del error conserva el dato que ahora necesita un consumidor:

```ts
class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}
```

El recorrido de autenticación se muestra sin exponer el archivo completo:

```ts
const token = await getIdToken(user)
const headers = new Headers(init?.headers)

headers.set("Authorization", `Bearer ${token}`)
```

Logout responde a un evento conocido:

```tsx
async function handleLogout() {
  await signOut(auth)
  navigate("/login", { replace: true })
}
```

Las diapositivas sustituyen siempre el valor real del token por `…` o `<ID token>`. La implementación completa se construye en el editor.

### Cierre conceptual

Antes de abrir el editor, el grupo responde:

1. ¿Por qué ver `/app/library` no prueba que el backend reconocerá al usuario?
2. ¿Qué diferencia existe entre la sesión que observa `AuthProvider` y el token que viaja en un request?
3. ¿Por qué se conserva `requestJson` además de crear un helper autenticado?
4. ¿Qué dato aporta `ApiError` que no aportaba el `Error` anterior?
5. ¿Por qué logout es un handler y no un Effect?

## Proyecto semilla

### Nombre propuesto

`s05-c15-auth-shell-seed`

### Qué incluye

- El checkpoint comprobado de la clase 14.
- Firebase `12.16.0` y Email/Password configurables mediante `.env.local`.
- `AuthProvider`, `useAuth` y la unión `checking | anonymous | authenticated`.
- Login y registro reales con regreso al destino privado.
- `PrivateLayout` que representa solamente `Outlet` después de autorizar la rama.
- Placeholders compilables en `/app/library` y `/app/library/:logId`.
- `requestJson<T>` de la clase 07 para búsqueda y detalle públicos.
- `VITE_API_URL` declarada en `.env.example`; el docente entrega el valor funcional por el canal acordado.
- Búsqueda y detalle público de las clases anteriores sin regresiones.

### Qué omite

- `ApiError` con status.
- `requestJsonWithAuth<T>` y cualquier llamada a `getIdToken`.
- `checkAuthenticatedRequest` y el probe temporal.
- `PrivateHeader`, correo de sesión y logout.
- Interceptores, refresh forzado, retries o cierre global ante `401`.
- Formularios y payload de biblioteca de la clase 16.
- Mutaciones, invalidación y lista personal de las clases 17 y 18.

El seed no contiene funciones vacías ni comentarios que revelen la solución. El espacio del taller está representado por piezas ausentes, no por código roto.

### Comprobación previa del docente

Antes de compartirlo, el docente:

1. Instala con `pnpm install --frozen-lockfile` y ejecuta `pnpm build`.
2. Configura un proyecto Firebase de prueba permitido por el backend de la cohorte.
3. Confirma que registro, login, recarga privada y retorno al destino funcionan.
4. Confirma que búsqueda y detalle público siguen consultando sin `Authorization` añadido globalmente.
5. Comprueba `GET /api/v2/auth/check` desde la URL entregada: sin token responde `401` y con un ID token válido responde `200`.
6. Revisa CORS fuera del tiempo de clase y confirma que el frontend puede enviar `Authorization`.
7. Elimina cuentas, correos, tokens y valores personales antes de publicar el checkpoint.

Si el endpoint o la allowlist no están listos, la sesión no debe simular un éxito con un header inventado. El docente corrige la dependencia externa antes de impartir la clase.

## Antes del descanso · Explicación y progreso guiado · 75 minutos

| Tiempo | Responsable | Progreso observable |
| --- | --- | --- |
| 0-18 min | Docente con participación del grupo | Presentar el guion, separar ruta privada de endpoint protegido y reconstruir el flujo del token. |
| 18-32 min | Docente en el editor | Reemplazar el error HTTP genérico por `ApiError` y confirmar que búsqueda pública conserva su comportamiento. |
| 32-50 min | Docente con preguntas al grupo | Implementar `requestJsonWithAuth<T>`, conservar headers previos y explicar por qué el token no se almacena. |
| 50-62 min | Docente y estudiantes | Crear el fetcher de comprobación, observar `401` sin credencial y `200` con credencial desde Network, sin mostrar el token. |
| 62-70 min | Docente en el editor | Mostrar el contrato de `PrivateHeader`, el handler de `signOut` y su composición futura en `PrivateLayout`. |
| 70-75 min | Docente | Presentar el encargo, criterios, restricciones y checkpoint alternativo. |

La suma del bloque guiado es de 75 minutos.

### Paso 1 · Hacer visible la necesidad de un status HTTP

El helper heredado de la clase 07 lanza un `Error` cuando `response.ok` es falso. El docente intenta decidir si una respuesta es `401` y pregunta qué dato falta. Solo después introduce `ApiError`:

```ts
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new ApiError(
      `La API respondió con status ${response.status}`,
      response.status,
    )
  }

  return (await response.json()) as T
}
```

El grupo vuelve a ejecutar una búsqueda pública correcta y una petición fallida. La mejora no cambia la firma de éxito ni obliga a los componentes a conocer `Response`.

Esta es una evolución intencional, no un error de la clase 07: allí todavía no existía una decisión de interfaz basada en un status concreto.

### Paso 2 · Construir el cliente autenticado

En `src/api/http.ts` se añade una segunda función que expresa la intención privada:

```ts
import { getIdToken } from "firebase/auth"

import { auth } from "../firebase/firebase"

export async function requestJsonWithAuth<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const user = auth.currentUser

  if (user === null) {
    throw new Error("No hay una sesión disponible para este request.")
  }

  const token = await getIdToken(user)
  const headers = new Headers(init?.headers)

  headers.set("Authorization", `Bearer ${token}`)

  return requestJson<T>(url, {
    ...init,
    headers,
  })
}
```

El orden se explica línea por línea:

```text
1. leer al usuario actual administrado por Firebase
2. detener el recorrido si no existe sesión
3. solicitar el ID token vigente
4. copiar los headers recibidos
5. establecer Authorization
6. delegar fetch, response.ok y JSON al helper común
```

La comprobación local de `user === null` es defensiva. Los fetchers privados se ejecutarán desde una rama que `PrivateLayout` solo representa después de `authenticated`; no se crea otro estado global para coordinar ambas piezas.

### Paso 3 · Definir el fetcher mínimo de comprobación

Se crea `src/api/auth.ts`. Como este endpoint tiene una sola respuesta mínima, el DTO puede vivir junto al fetcher; todavía no justifica un archivo de tipos compartidos:

```ts
import { requestJsonWithAuth } from "./http"

interface AuthCheckDto {
  authenticated: true
}

const API_URL = import.meta.env.VITE_API_URL

export function checkAuthenticatedRequest() {
  return requestJsonWithAuth<AuthCheckDto>(
    `${API_URL}/api/v2/auth/check`,
  )
}
```

El nombre describe qué comprueba y evita prometer que descarga un perfil o restaura la sesión. Firebase ya es responsable de restaurarla.

### Paso 4 · Probar `401` y `200` sin crear estado remoto paralelo

El docente conecta temporalmente `checkAuthenticatedRequest` a un botón de diagnóstico. El handler usa `try/catch`, escribe únicamente `authenticated` o el `status` y nunca registra el token:

```tsx
async function handleCheckAuthenticatedRequest() {
  try {
    const result = await checkAuthenticatedRequest()
    console.info("Request autenticado:", result.authenticated)
  } catch (error) {
    console.info(
      "Status recibido:",
      error instanceof ApiError ? error.status : "desconocido",
    )
  }
}
```

Primero se demuestra el `401` llamando temporalmente al endpoint con `requestJson`, que no agrega credencial. Después se restaura `requestJsonWithAuth` y se observa `200`.

El probe no copia la respuesta a `useState`, Zustand ni Context. Es un instrumento temporal para inspeccionar un intercambio HTTP, como los probes de la clase 07. Se elimina al finalizar el taller; no se convierte en una tarjeta de “estado de autenticación”.

En Network se comprueba que existe el header sin expandir, copiar, proyectar ni capturar su valor. La evidencia es el status y la respuesta, no el token.

### Paso 5 · Delimitar el shell que completará el taller

El docente muestra el contrato, no la implementación terminada:

```tsx
interface PrivateHeaderProps {
  email: string | null
}

export function PrivateHeader({ email }: PrivateHeaderProps) {
  // La estructura, el feedback y logout se completan en el taller.
}
```

Durante la explicación se escribe y ejecuta un handler aislado de `signOut` para que la API y el manejo de su promesa sean conocidos antes del descanso. Luego se retira esa demostración. El grupo identifica que:

- `PrivateLayout` posee acceso al `user` autenticado y entrega `user.email` al header.
- `PrivateHeader` posee el estado puntual de su botón de logout.
- `AuthProvider` sigue poseyendo la sesión transversal.
- `Outlet` sigue indicando dónde aparece la página privada hija.

No se construye el header final antes del taller y no se añade una segunda suscripción Firebase.

### Checkpoint alternativo antes del taller

El docente prepara `s05-c15-auth-shell-workshop-checkpoint` para estudiantes que no completen el bloque guiado. Debe compilar e incluir:

- `ApiError` integrado en `requestJson<T>`.
- `requestJsonWithAuth<T>` completo.
- `checkAuthenticatedRequest` completo.
- El probe temporal conectado y comprobable.
- `PrivateLayout` todavía sin `PrivateHeader`.
- Ningún botón de logout resuelto.

Antes de continuar, el estudiante demuestra una búsqueda pública exitosa, un `401` sin helper autenticado y un `200` con el helper autenticado. Después puede partir de este checkpoint para realizar el mismo taller que el resto.

## Descanso · 30 minutos

## Después del descanso · Taller de shell privado · 60 minutos

### Encargo

Completar el shell de `/app` para que una sesión autenticada tenga navegación compartida, identidad visible y una salida controlada. El taller consume el provider, el cliente HTTP y la API `signOut` presentados antes del descanso; no introduce otro modelo de estado ni un endpoint nuevo.

### Distribución sugerida

| Tiempo | Trabajo del estudiante | Evidencia intermedia |
| --- | --- | --- |
| 0-12 min | Crear `PrivateHeader` con navegación hacia búsqueda y biblioteca. | Los enlaces funcionan desde `/app/library`. |
| 12-27 min | Recibir `email: string | null` y mostrar identidad o fallback neutral. | Una cuenta con correo muestra su valor; el caso nullable no rompe el componente. |
| 27-45 min | Implementar `handleLogout` con pendiente, error y navegación después de `signOut`. | Un clic produce una sola salida; el botón se desactiva y un error no desaparece silenciosamente. |
| 45-53 min | Componer `PrivateHeader` y `Outlet` dentro de `PrivateLayout`. | El header aparece en ambas rutas privadas y nunca en `/login`, `/register` o `/search`. |
| 53-60 min | Ejecutar el recorrido de sesión, retirar el probe temporal y correr `pnpm build`. | Recarga, request autenticado, logout, guardia y build quedan comprobados. |

La suma del taller es de 60 minutos.

### Trabajo obligatorio

1. Crear `src/components/private-header.tsx` con una responsabilidad visible: navegación e interacción de sesión compartidas por el área privada.
2. Añadir enlaces con `Link` a `/search` y `/app/library`.
3. Declarar `email: string | null` y mostrar “Sesión activa” cuando no exista correo.
4. Mantener `isLoggingOut` y `logoutError` como estado local de `PrivateHeader`.
5. Ejecutar `signOut(auth)` dentro de `handleLogout`, no dentro de un Effect.
6. Desactivar el botón mientras la promesa está pendiente y evitar envíos repetidos.
7. Navegar a `/login` con `replace: true` después del éxito.
8. Conservar el header visible si `signOut` falla y mostrar un mensaje comprensible.
9. Renderizar `PrivateHeader email={authState.user.email}` antes de `<Outlet />` en la rama autenticada de `PrivateLayout`.
10. Ejecutar el probe autenticado una vez, comprobar `200` y retirarlo del checkpoint final.
11. Probar logout, recarga, acceso directo a una ruta privada y retorno mediante login.
12. Ejecutar `pnpm build` sin errores.

### Recorridos que debe poder explicar el estudiante

```text
PrivateLayout consume useAuth
→ checking muestra carga
→ anonymous redirige a /login
→ authenticated entrega user.email a PrivateHeader
→ PrivateHeader representa navegación + Outlet representa la página hija

clic en Cerrar sesión
→ handleLogout activa pendiente
→ signOut(auth) resuelve
→ onAuthStateChanged actualiza AuthProvider
→ navigate reemplaza la URL por /login
→ la rama privada deja de representarse
```

Para un request protegido, el recorrido es independiente:

```text
fetcher privado
→ requestJsonWithAuth
→ getIdToken(auth.currentUser)
→ Authorization: Bearer …
→ requestJson
→ backend responde o ApiError conserva el status
```

Logout modifica la sesión mediante una acción. El helper obtiene una credencial cuando un request privado la necesita. No se combinan ambos recorridos en un Effect.

### Solución de referencia para el docente

La guía del estudiante puede omitir esta sección. El docente la usa para revisar responsabilidad, nulabilidad y manejo del evento.

```tsx
import { Alert, Button, Group, Stack, Text } from "@mantine/core"
import { signOut } from "firebase/auth"
import { useState } from "react"
import { Link, useNavigate } from "react-router"

import { auth } from "../firebase/firebase"

interface PrivateHeaderProps {
  email: string | null
}

export function PrivateHeader({ email }: PrivateHeaderProps) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    setLogoutError(null)

    try {
      await signOut(auth)
      navigate("/login", { replace: true })
    } catch {
      setLogoutError("No pudimos cerrar la sesión. Intenta nuevamente.")
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
          <Text size="sm">{email ?? "Sesión activa"}</Text>
          <Button
            loading={isLoggingOut}
            onClick={handleLogout}
            variant="subtle"
          >
            Cerrar sesión
          </Button>
        </Group>
      </Group>

      {logoutError !== null && <Alert color="red">{logoutError}</Alert>}
    </Stack>
  )
}
```

Tras un éxito no hace falta volver `isLoggingOut` a `false`: la navegación desmonta el header. Ante error sí se restablece para permitir otro intento.

`PrivateLayout` conserva primero la guardia y solo accede a `user` en la rama discriminada como autenticada:

```tsx
if (authState.status === "anonymous") {
  return <Navigate replace state={{ from: location.pathname }} to="/login" />
}

return (
  <>
    <PrivateHeader email={authState.user.email} />
    <main>
      <Outlet />
    </main>
  </>
)
```

No se usa una aserción para leer `user`: TypeScript lo conoce después de resolver `checking` y `anonymous`.

### Estructura esperada del checkpoint

```text
src/
├── api/
│   ├── auth.ts
│   ├── http.ts
│   └── media.ts
├── auth/
│   └── auth-provider.tsx
├── components/
│   ├── app-header.tsx
│   └── private-header.tsx
├── firebase/
│   └── firebase.ts
├── layouts/
│   ├── private-layout.tsx
│   └── public-layout.tsx
├── pages/
│   ├── library-detail-placeholder-page.tsx
│   ├── library-page.tsx
│   ├── login-page.tsx
│   ├── register-page.tsx
│   └── search-page.tsx
├── App.tsx
└── main.tsx
```

El probe temporal puede vivir durante la práctica en un archivo separado, pero no aparece en esta estructura final.

### Restricciones

- No guardar el ID token en `useState`, Context, Zustand, `localStorage`, `sessionStorage` ni una variable de módulo.
- No añadir `Authorization` globalmente a búsqueda y detalle público.
- No pasar el token como prop entre componentes.
- No proyectar, copiar, decodificar ni incluir el token en capturas o entregas.
- No forzar refresh del token en cada request.
- No implementar retries ni logout automático ante cualquier `401`.
- No añadir otra suscripción `onAuthStateChanged`.
- No usar `useEffect` para logout, navegación o requests.
- No copiar respuestas remotas a estado local para convertir el probe en una pantalla permanente.
- No limpiar todavía la caché pública al cerrar sesión.
- No introducir Zustand, un drawer, `AppShell`, loaders de React Router o un segundo cliente HTTP externo.
- No crear el formulario, el payload ni la mutación de biblioteca.
- No modificar el backend ni pedir a los estudiantes que lo ejecuten.

### Actividades del docente durante el taller

- Pedir que cada pareja identifique al propietario de `user`, `isLoggingOut` y token antes de escribir estado.
- Revisar que `PrivateHeader` reciba un correo nullable y no el objeto `User` completo.
- Verificar que el handler espere `signOut` y que el botón no pueda iniciar otra salida mientras está pendiente.
- Inspeccionar Network de forma individual sin revelar el valor de `Authorization` en el proyector.
- Provocar un error controlado solo si el entorno lo permite sin cambiar el backend compartido; de lo contrario, revisar la rama `catch` mediante lectura guiada.
- Recordar que el probe se elimina y que el helper queda preparado para la mutación de la clase 17.
- Detener cualquier intento de adelantar `status`, `priority`, `notes`, `useMutation` o la lista personal.

### Actividades de los estudiantes durante el taller

- Construir el header a partir del contrato presentado antes del descanso.
- Explicar por qué el correo puede ser `null` y elegir un fallback que no invente identidad.
- Implementar y probar el handler de logout.
- Integrar el header una sola vez en el layout, no en cada página.
- Comprobar que las páginas públicas no reciben el shell privado.
- Ejecutar el request de comprobación autenticado y retirar el probe.
- Recorrer sesión, recarga, logout y guardia desde una pestaña limpia.
- Ejecutar el build y corregir imports o tipos sin eliminar las guardias.

## Revisión y cierre · 15 minutos

| Tiempo | Actividad | Evidencia |
| --- | --- | --- |
| 0-8 min | Una pareja ejecuta login, request de comprobación, recarga privada, navegación interna y logout. | El grupo observa el shell solo en `/app`, status `200` sin revelar token y redirección posterior al logout. |
| 8-12 min | Otra pareja explica los dos recorridos: sesión/render y token/request. | Puede asignar `AuthProvider`, `PrivateHeader`, `requestJsonWithAuth` y backend a responsabilidades distintas. |
| 12-15 min | Cierre docente y puente a la clase 16. | Queda explícito que la próxima clase crea valores y payload local, no vuelve a tocar autenticación. |

La suma de revisión es de 15 minutos. Con el descanso, la sesión completa suma 180 minutos.

## Errores previsibles y preguntas de recuperación

| Síntoma | Pregunta docente | Recuperación esperada |
| --- | --- | --- |
| La ruta privada carga, pero el probe responde `401`. | ¿El request tiene header y el proyecto Firebase está permitido por el entorno docente? | Separar guardia de frontend, construcción del request y configuración externa; no reescribir login. |
| El token se guarda en un store. | ¿Qué consumidor necesita leerlo después de que termine este request? | Eliminar la copia y obtenerlo mediante Firebase dentro del helper. |
| `Content-Type` desaparece al usar el helper auth. | ¿Se reemplazaron los headers o se partió de `init.headers`? | Crear `new Headers(init?.headers)` y luego establecer `Authorization`. |
| Logout se ejecuta desde un Effect. | ¿Qué evento conoce exactamente el momento de iniciar la salida? | Mover `signOut` al handler del botón. |
| El header aparece en login. | ¿Está compuesto por `App` o por la rama privada? | Renderizarlo dentro de `PrivateLayout` antes del `Outlet`. |
| Se lee `user.email` antes de resolver el estado. | ¿Qué variantes de la unión contienen `user`? | Resolver `checking` y `anonymous`; acceder a `user` solo en `authenticated`. |
| Cualquier `401` cierra la sesión. | ¿El status prueba por sí solo que Firebase dejó de tener usuario? | Conservar el status y dejar que el caso de uso decida; no añadir política global. |
| El probe permanece como estado de UI. | ¿Es una capacidad del producto o un instrumento de diagnóstico? | Conservar el fetcher, retirar el componente temporal y dejar la respuesta fuera de estado persistente. |

## Criterios de aceptación

- `requestJson<T>` conserva su uso público y lanza `ApiError` con el status de una respuesta HTTP fallida.
- `requestJsonWithAuth<T>` obtiene el token bajo demanda, conserva headers existentes y delega en el helper común.
- Ningún token se guarda, registra, decodifica ni entrega.
- El endpoint de comprobación responde `401` sin credencial y `200` con una sesión válida del entorno permitido.
- El probe temporal se elimina del checkpoint final.
- `PrivateHeader` aparece una sola vez en las rutas privadas y no aparece en las públicas.
- El correo nullable tiene fallback y no se duplica el objeto `User` en estado local.
- Logout se ejecuta desde el evento, comunica pendiente y error, y evita clics duplicados.
- Después de logout, una URL privada vuelve a ser rechazada por la guardia.
- Una recarga con sesión válida conserva el acceso y vuelve a mostrar el shell.
- Búsqueda y detalle público continúan funcionando sin recibir `Authorization` automáticamente.
- No existen cambios en el backend, formularios de biblioteca, mutaciones, invalidaciones ni Zustand.
- `pnpm build` termina correctamente.

## Entrega

El estudiante entrega:

- El código del checkpoint final.
- Una grabación breve de login, recarga privada, navegación del header, logout e intento de volver a la ruta privada.
- Una explicación corta de dónde se obtiene el token, dónde se agrega el header y por qué no se guarda.

La grabación no abre el valor de `Authorization`, no muestra contraseñas y oculta correos personales. No se exige una captura de DevTools con el token visible.

## Vocabulario

- **Firebase ID token:** JWT temporal emitido por Firebase que identifica al usuario ante un backend capaz de verificarlo.
- **Bearer:** esquema del header `Authorization` que presenta una credencial al servidor.
- **Header HTTP:** metadato enviado junto a un request o response; no forma parte del body.
- **`401 Unauthorized`:** respuesta que indica que el request no presentó una identidad que el servidor acepte como autenticada.
- **`403 Forbidden`:** respuesta que indica que la identidad fue reconocida, pero no tiene permiso para la acción solicitada.
- **`ApiError`:** error de la aplicación que conserva información HTTP necesaria para tomar una decisión posterior.
- **Shell privado:** estructura compartida de navegación y sesión que envuelve las páginas privadas.
- **Obtención bajo demanda:** lectura de un valor cuando una operación lo necesita, sin mantener una copia propia entre operaciones.
- **Allowlist:** lista de proyectos o identidades que un entorno acepta. La administra el docente en el backend externo.
- **Probe:** pieza temporal de diagnóstico utilizada para comprobar un contrato antes de integrarlo en una interfaz real.

## Fuera de alcance

- Modificar, ejecutar o desplegar el backend.
- Crear o administrar la allowlist desde el frontend.
- Verificar firmas JWT en el navegador.
- Decodificar tokens o enseñar sus claims.
- Refresh forzado, interceptores, retries y política global de `401`.
- Limpiar queries privadas al hacer logout; se añadirá cuando existan en la clase 18.
- Formulario de creación, `status`, `priority`, `notes` y payload; pertenecen a la clase 16.
- `useMutation`, `409` aplicado a creación e invalidaciones; pertenecen a la clase 17.
- Lista y primera query privada; pertenecen a la clase 18.
- Drawer y Zustand; pertenecen a la etapa de mejoras.

## Referencias docentes

- [Firebase Auth: `getIdToken`](https://firebase.google.com/docs/reference/js/auth.user.md#usergetidtoken)
- [Firebase Auth: `signOut`](https://firebase.google.com/docs/reference/js/auth.md#signout)
- [Firebase: verificar ID tokens en un servidor](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [MDN: `Authorization`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization)
- [MDN: `401 Unauthorized`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401)
- [MDN: `403 Forbidden`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403)
- [MDN: `Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
