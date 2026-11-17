# Sesión 12 · Firebase Auth y rutas privadas

> Estado: paquete textual y presentación de 28 diapositivas aprobados. Proyecto progresivo implementado hasta `session-12-end`; guía docente detallada alineada y disponible para revisión del usuario.

- **Fecha:** jueves 22 de octubre de 2026
- **Semana:** 5
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Entrada progresiva:** `session-12-start`, idéntica a `session-11-end`.
- **Salida progresiva:** `session-12-end`.

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 11:

- Mantine Form y Zod ya validan una sesión de formulario uncontrolled.
- El grupo conoce `schemaResolver`, `form.key`, `getInputProps` y `z.infer`.
- `PublicLayout` contiene búsqueda, detalle y el modal global de creación.
- React Router, TanStack Query, Zustand y Vitest funcionan.
- `requestJson<T>` consume búsqueda y detalle sin autenticación.
- `/login`, `/register`, Firebase y la rama privada todavía no existen.
- El formulario de creación solo prepara un body local; no ejecuta un POST.

## Limitación visible

Validar valores no crea una cuenta ni permite que el servidor reconozca una petición:

```text
schema acepta correo y contraseña
→ todavía no existe cuenta o sesión

Firebase restaura una sesión
→ React puede decidir qué ruta mostrar

ID token dentro de Authorization
→ el servidor puede comprobar la sesión de quien envía la petición
```

La sesión conecta esos tres recorridos sin guardar contraseñas o tokens en estado propio.

## Resultado de aprendizaje

El estudiante conectará formularios validados con Firebase Email/Password, modelará la restauración de sesión mediante un provider, protegerá una rama de React Router y preparará un cliente HTTP que obtiene el ID token bajo demanda.

## Checkpoint de salida

Al terminar:

- `firebase@12.16.0` está instalado e inicializado una sola vez.
- `.env.example` conserva `VITE_API_URL=https://bootcamp-medialog.cardor.dev`, añade vacíos los seis nombres `VITE_FIREBASE_*` y `.env.local` permanece ignorado.
- `/login` y `/register` aplican el patrón de Mantine Form y Zod aprendido.
- Login y Registro muestran pending y un error remoto general sin revelar códigos sensibles.
- `authStateSchema` modela `checking`, `anonymous` y `authenticated`; `AuthState` se deriva y el observer valida una proyección `{ uid, email }` antes de actualizar Context.
- `PrivateLayout` muestra carga, redirige o renderiza `Outlet` según esa unión.
- La guardia conserva un destino normalizado y Login/Registro regresan a él después del éxito.
- `/app/library` muestra un placeholder privado; no consulta la biblioteca.
- `PrivateHeader` muestra el correo o un fallback y ejecuta logout desde el evento.
- `ApiError` conserva el status HTTP.
- `requestJsonWithAuth<T>` obtiene el ID token vigente, conserva headers previos y agrega `Authorization: Bearer`.
- Un probe temporal compara `401` sin credencial y `200` con una sesión aceptada; se registra lo observado y se retiran el componente y sus fetchers de diagnóstico.
- La prueba dirigida de destino y `pnpm build` terminan con código 0 en el seed ejecutable.

La prueba demuestra una normalización pura. El build demuestra tipado y empaquetado. Los recorridos manuales demuestran el comportamiento observado en un navegador. Solo el probe contra el entorno docente aporta evidencia de que ese backend aceptó el token.

## Concepto principal

La sesión actual tiene dos recorridos conectados, con propietarios distintos:

```text
Firebase Auth
→ onAuthStateChanged
→ AuthProvider
→ checking | anonymous | authenticated
→ PrivateLayout

request privado
→ requestJsonWithAuth
→ getIdToken
→ Authorization: Bearer …
→ backend
```

`AuthProvider` decide qué representa la interfaz. El cliente HTTP construye la credencial de cada request. Ninguna pieza copia el token.

## Estrategia de construcción y referencia

La sesión conserva el recorrido completo, pero no presenta quince archivos como escritura desde cero. `teacher-guide.md` contiene la referencia final de cada símbolo y el docente entrega scaffolds que compilan para las partes mecánicas.

| Tratamiento | Piezas |
| --- | --- |
| Preparadas para revisar y completar | `.env.example`, inicialización, schemas, Login/Registro, rutas, placeholder y shell del probe |
| Construidas en vivo | `toAuthUser`, `AuthProvider`, `useAuth`, cleanup, destino y guardia |
| Demostradas línea por línea | `ApiError`, `requestJsonWithAuth`, fetchers y requests `401/200` |
| Completadas con el grupo | handlers de Login/Registro, `PrivateHeader`, pending/error y logout |
| Delegada después de decidir comportamiento | Solo la prueba de `toAuthDestination` dentro de `__tests__/` |

Cada símbolo nuevo tiene archivo, imports, definición, consumidor y checkpoint. El probe también tiene una ubicación temporal explícita y una instrucción de eliminación.

```text
.env.example                              configuración pública
src/firebase/firebase.ts                  app y Auth únicos
src/schemas/auth.ts                       formularios, sesión y destino
src/auth/auth-destination.ts              state unknown → destino
src/auth/auth-provider.tsx                observer + Context + useAuth
src/pages/login-page.tsx                  sign in + retorno
src/pages/register-page.tsx               create user + retorno
src/pages/library-page.tsx                placeholder privado
src/layouts/private-layout.tsx             guardia + header + Outlet
src/components/private-header.tsx          identidad + logout
src/components/auth-request-probe.tsx      diagnóstico temporal
src/api/http.ts                            error + helpers HTTP
src/api/auth.ts                            fetchers de comprobación
src/main.tsx                               montaje de AuthProvider
src/App.tsx                                rutas públicas y privadas
```

## Decisiones técnicas

### Configuración e inicialización

Cada estudiante usa su proyecto Firebase y habilita Email/Password. El curso instala la API modular:

```bash
pnpm add firebase@12.16.0
```

`src/firebase/firebase.ts` llama `initializeApp` una vez cuando están completas las seis variables. Exporta `auth`; si falta configuración, conserva `null` y muestra un aviso explícito antes de ejecutar operaciones Firebase. Así el catálogo público continúa disponible y el build no exige valores reales. La configuración web identifica el proyecto y llega al bundle; no contiene cuentas de servicio, claves privadas, contraseñas o tokens.

### Formularios separados

`src/schemas/auth.ts` define los schemas de formulario, sesión y destino. Cada tipo propio se deriva desde su schema con `z.infer`. Ambos formularios comparten las reglas de correo y contraseña; Registro añade `confirmPassword` y coloca el error de coincidencia en ese campo.

```ts
import { z } from "zod/v4"

const emailSchema = z.email({ error: "Ingresa un correo válido." })
const passwordSchema = z.string().min(6, {
  error: "Usa al menos 6 caracteres.",
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, {
      error: "Confirma tu contraseña.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
```

`LoginPage` y `RegisterPage` permanecen separadas. Cada página conserva `isSubmitting` y `submitError` porque esos estados describen su intento actual. El provider conserva la sesión transversal.

### Estado de sesión

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

El objeto `User` de Firebase pertenece al SDK. El provider proyecta solo `uid` y `email`, ejecuta `authStateSchema.parse(nextState)` y conserva ese dato propio validado. No usa `z.custom<User>()`, no guarda el objeto completo del SDK y no usa `auth.currentUser` para saltarse el estado de inicialización. `AuthProvider` instala una única suscripción `onAuthStateChanged` dentro de un Effect y devuelve la función de cancelación como cleanup.

### Guardia y destino

`PrivateLayout` resuelve primero `checking`, después `anonymous` y finalmente la rama autenticada. La guardia usa `Navigate`; los submits usan `useNavigate` después de una promesa exitosa.

`authDestinationSchema` modela `{ from: string }` y deriva `AuthDestination`; el fallback usa ese tipo. `toAuthDestination(state: unknown)` ejecuta `safeParse`, devuelve el string normalizado o `/app/library`. `unknown` obliga a validar el valor externo de Router; un cast solo cambiaría lo que TypeScript cree y no examinaría el dato recibido. Login y Registro conservan el destino validado en sus enlaces mutuos.

### Cliente autenticado

`requestJson<T>` sigue disponible para endpoints públicos. `requestJsonWithAuth<T>`:

1. lee `auth.currentUser`;
2. detiene el request si no hay sesión;
3. solicita `getIdToken(user)`;
4. crea `new Headers(init?.headers)`;
5. agrega Bearer;
6. delega en `requestJson<T>`.

No fuerza refresh, no reintenta y no cierra sesión ante cualquier `401`.

### Logout

`PrivateHeader` recibe `email: string | null`. Su handler espera `signOut(auth)` y navega a `/login` solo después del éxito. Si Firebase rechaza, conserva la sesión visible y permite reintentar.

La limpieza de queries privadas queda para la sesión 13, cuando exista la primera respuesta personal en caché.

## Secuencia · 90 minutos

| Tiempo | Responsable | Actividad | Evidencia |
| ---: | --- | --- | --- |
| 0–28 | Docente y preguntas orales | Presentación continua de 28 slides: Entrar → Comprobar → Abrir → Pedir → Salir. | El grupo distingue formulario, sesión, pantalla y servidor sin abrir el editor. |
| 28–34 | Docente con participación | Instalar Firebase, entregar configuración y comprobar su aviso. | Configuración local o ausencia explicada; catálogo disponible. |
| 34–43 | Construcción guiada | Proyección, `AuthProvider`, `useAuth`, observer, cleanup y montaje. | Sesión observada sin duplicar tokens o usuarios completos. |
| 43–53 | Construcción guiada | Schemas y handlers de Login/Registro con interfaz preparada y destino provisional. | Cuenta y acceso sin doble submit; errores locales y remotos separados. |
| 53–61 | Construcción interactiva | Normalizar destino y proteger la rama privada. | Persona anónima vuelve a Login; acceso correcto vuelve a la página solicitada. |
| 61–67 | Demostración docente | `ApiError`, cliente autenticado y probe montado explícitamente. | Se registran status observados sin mostrar el token. |
| 67–72 | Práctica guiada | Header privado, logout y retirada del diagnóstico temporal. | Salir vuelve a bloquear biblioteca; sin probe en el cierre. |
| 72–82 | Agente y estudiantes | Matriz humana, prueba pura del destino, lectura del diff y actividad de recuperación. | Test enfocado ejecutado y explicación de sus límites. |
| 82–90 | Docente y estudiantes | Recorrido, lint, tests, build y cierre oral sin regresar al deck. | Evidencia local, visual y externa diferenciada; registro para retomar. |

**Comprobación:** `28 + 6 + 9 + 10 + 8 + 6 + 5 + 10 + 8 = 90`. Los seis bloques de coding suman 44 minutos. Se entrega markup, configuración y soporte repetitivo; la escritura visible se concentra en las decisiones. Es un presupuesto pendiente de ensayo con estudiantes, no prueba de ritmo real.

## Guion de presentación

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Apertura | El schema conoce la forma | Zod puede aceptar un correo; Firebase decide si existe una identidad. | Tabla Zod, Firebase y backend. |
| Configuración | Configuración web visible | `VITE_` llega al navegador; una cuenta de servicio no pertenece allí. | Comparación `.env.example` y `.env.local`. |
| Restauración | La app todavía está comprobando | `authStateSchema` define las tres ramas; `checking` evita redirigir antes de que Firebase comunique la sesión. | Diagrama de schema → tipo → parse → Context. |
| Provider | Una suscripción, muchos consumidores | Firebase emite; el provider expone; la guardia decide. | Árbol provider → layout → outlet. |
| Navegación | Guardia declarativa, éxito imperativo | `Navigate` protege; el submit usa `useNavigate`. | Dos snippets breves. |
| Request | Ver una página no autentica fetch | El ID token debe cruzar la red mediante Bearer. | Diagrama interfaz/request. |
| Seguridad | Obtener no significa almacenar | Firebase mantiene el token; el helper lo solicita cuando lo necesita. | Lista de ubicaciones prohibidas. |
| Cierre | Sesión lista, biblioteca pendiente | La infraestructura queda preparada; sesión 13 conecta mutación y lista. | Ruta `/app/library` con placeholder. |

Preguntas de cierre:

1. ¿Por qué el estado inicial no puede ser solo `user: null`?
2. ¿Qué estado pertenece al provider y cuál pertenece al submit?
3. ¿Por qué la guardia usa `Navigate` y el submit `useNavigate`?
4. ¿Por qué acceder a `/app/library` no demuestra que el backend aceptará el request?

## Trabajo con agente

La persona escribe `toAuthDestination` y define esta matriz:

1. conserva un `from` string;
2. usa `/app/library` si no existe state;
3. usa el fallback si `from` no es string;
4. no transporta usuario, contraseña, token o DTO.

El agente solo puede crear:

```text
src/auth/__tests__/auth-destination.test.ts
```

Todo soporte exclusivo vive en `src/auth/__tests__/fixtures/`. El agente no toca Firebase, páginas, provider, Router, cliente HTTP, configuración o producción.

## Dependencia siguiente

La sesión 13 recibe sesión restaurable, guardia, logout, `ApiError`, `requestJsonWithAuth<T>` y el formulario local de creación. Allí aparecen autenticación opcional, `authScope`, mutación, invalidación, lista privada y filtro por tipo.

La sesión 12 no crea `requestJsonWithOptionalAuth`, query keys dependientes del usuario, mutaciones, DTO de lista o limpieza de caché.

## Fuera de alcance

- Firestore, Analytics, Firebase CLI, Emulators y proveedores sociales.
- Recuperación de contraseña, verificación de correo, MFA o perfil.
- Política de contraseña distinta del mínimo de seis caracteres del curso.
- Guardar, registrar, copiar, decodificar o forzar refresh del token.
- Interceptores, retries o logout automático ante `401`.
- `useEffect` para navegar, enviar formularios, hacer logout o ejecutar requests.
- `useMutation`, POST de creación, invalidación o biblioteca.
- `requestJsonWithOptionalAuth` y `authScope`.
- Cambios en `medialog-server`.

## Cambios retrospectivos

- La sesión 11 ya entrega el patrón de formulario y no requiere cambios.
- `rules/course-architecture.md` ya conserva las decisiones de Firebase, guardia y cliente autenticado.
- `draft/index.md` enlaza esta migración sin cambiar el tema o checkpoint institucional.
