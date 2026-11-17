# Clase 13 · Formularios y validación

- **Semana:** 5
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** checkpoint 12 con búsqueda y detalle público navegables mediante URL
- **Checkpoint de salida:** rutas públicas `/login` y `/register` con formularios validados localmente y preparados para recibir Firebase en la clase 14

## Resultado de aprendizaje

El estudiante podrá definir un schema que describe valores válidos, conectar ese schema a una sesión de formulario de Mantine y entregar datos tipados a un submit temporal sin iniciar todavía una sesión ni consultar Firebase.

## Limitación que abre la clase

La aplicación ya tiene rutas públicas para buscar y ver detalle, pero no tiene un lugar donde la persona pueda introducir credenciales de forma estructurada. Un par de inputs sueltos no resuelve el problema completo:

```text
input aislado
→ cada campo necesita valor, error, foco y submit propios
→ el código repite reglas y el formulario no sabe cuándo puede avanzar
```

La clase crea una sesión de formulario para login y registro:

```text
schema Zod
→ tipo inferido
→ useForm de Mantine
→ getInputProps
→ input, foco y error
→ submit válido
→ handler temporal
```

El submit temporal confirma que el formato es válido. No crea cuentas, no inicia sesión y no afirma que el correo o la contraseña existan. Firebase será la fuente de esa respuesta en la clase 14.

## Conceptos que se enseñan

- Elemento HTML `form` y submit semántico.
- Valores iniciales y sesión de formulario.
- Validación de cliente.
- Schema Zod como contrato ejecutable.
- Inferencia de `LoginFormValues` y `RegisterFormValues` desde el schema.
- Modo uncontrolled de Mantine Form.
- `schemaResolver`, `getInputProps`, `form.key` y `form.onSubmit`.
- Validación al perder foco y validación al enviar.
- Error de campo frente a confirmación local de submit válido.
- Refinamiento para comparar contraseña y confirmación.
- Labels, tipo de input, `autoComplete` y `noValidate`.

## Compatibilidad y versión de referencia

La cohorte fija esta matriz para que los checkpoints se reproduzcan:

| Paquete | Versión fijada | Motivo |
| --- | --- | --- |
| `react` y `react-dom` | `19.2.8` | Base verificada desde el template de la clase 01 y compatible con los paquetes posteriores. |
| `@mantine/core`, `@mantine/hooks` y `@mantine/form` | `9.4.1` | Los paquetes Mantine deben compartir versión; Form 9 usa Standard Schema. |
| `zod` | `4.4.3` | Implementa Standard Schema y permite importar `zod/v4`. |

Mantine 9 usa `schemaResolver` desde `@mantine/form` con schemas Standard Schema. La guía no instala ni importa `mantine-form-zod-resolver` ni el antiguo `zodResolver`.

La contraseña del curso tiene mínimo seis caracteres. Firebase admite ese mínimo como valor predeterminado; la clase no configura una política adicional en Firebase Console.

## Guion de presentación

### Propósito y duración

La presentación inicial ocupa aproximadamente 15 minutos. Recupera las rutas públicas de la clase 12, explica la frontera entre validar formato y autenticar identidad, y prepara el vocabulario que aparecerá en el editor.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | Una URL abre una pantalla pública | Recuperar `/search` y `/media/:mediaType/:externalId`. Preguntar qué necesita ahora una persona que quiere guardar una película. | Árbol de rutas de la clase 12 con `/login` y `/register` aún vacíos. |
| Problema | Tres campos no son una sesión de formulario | Cada campo necesita valor, error y reglas; el formulario decide cuándo invoca el submit válido. | Comparar inputs sueltos con un diagrama `schema → form → inputs`. |
| Distinción | Validar formato no autentica | El cliente puede comprobar correo, longitud y coincidencia. Firebase decidirá después si una cuenta puede registrarse o iniciar sesión. | Tabla con validación local, error Firebase y error HTTP. Desarrollar solo la primera columna hoy. |
| Contrato | Un schema describe datos válidos | `loginSchema` y `registerSchema` reúnen reglas y generan tipos con `z.infer`. Los tipos no ejecutan validación en el navegador. | Snippet corto con `z.email()` y `z.infer`. |
| Herramienta | Mantine conserva la sesión del formulario | En modo uncontrolled, Mantine administra los valores fuera del render de React y entrega props mediante `getInputProps`. | Diagrama de `useForm → getInputProps → TextInput`. Mostrar que `form.values` no representa cambios recientes durante render. |
| Regla | Un input necesita semántica y feedback | `label`, `type`, `autoComplete`, `noValidate`, error junto al campo y botón submit trabajan juntos. | Comparar un password input correcto con uno sin label ni autocomplete. |
| Puente | Dos formularios, una sola dificultad principal | Login se construye guiado. Registro aplica el mismo patrón y añade un refinamiento para confirmar contraseña. Firebase, pending y errores de credenciales quedan fuera. | Checklist de trabajo estudiantil sin mostrar el archivo terminado. |

### Indicaciones que deben sobrevivir a la producción de slides

- La validación de cliente mejora feedback y evita submits con formato incorrecto. No protege endpoints, no verifica una contraseña real y no sustituye validación del servidor.
- Un schema contiene reglas ejecutables; `z.infer` extrae un tipo de TypeScript. El tipo ayuda al editor, pero por sí solo no rechaza datos al ejecutar la aplicación.
- `z.email()` corresponde a Zod 4. No copiar `z.string().email()` ni imports de Zod 3 desde ejemplos antiguos.
- `schemaResolver(schema, { sync: true })` conecta schemas síncronos de Zod 4. No añadir un paquete resolver extra.
- Modo uncontrolled no significa que React pierda control del formulario. Mantine conserva los valores y los entrega al submit; `form.key(field)` permite actualizar un input si el formulario cambia su valor programáticamente.
- El grupo no debe leer `form.values` para representar texto actual en modo uncontrolled. Para responder a cambios se usa `onValuesChange`; para leer el valor actual fuera del submit se usa `form.getValues()`.
- `validateInputOnBlur` muestra errores al abandonar un campo. `form.onSubmit` vuelve a validar todos los campos al enviar.
- `noValidate` desactiva los mensajes nativos del navegador para que Zod sea la fuente visible de los mensajes. `type="email"` y `autoComplete` se mantienen por semántica y ayuda al navegador.
- La confirmación de contraseña es una regla entre campos. El `path: ["confirmPassword"]` coloca el error junto al campo que la persona debe corregir.
- No simular errores de credenciales, loading ni doble envío. La clase 14 tendrá una operación Firebase que produzca esos estados.
- El feedback temporal de submit válido no imprime ni conserva la contraseña.

### Snippets conceptuales para las slides

Schema y tipo:

```ts
export const loginSchema = z.object({
  email: z.email({ error: "Ingresa un correo válido." }),
  password: z.string().min(6, {
    error: "Usa al menos 6 caracteres.",
  }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

Regla entre campos:

```ts
.refine((values) => values.password === values.confirmPassword, {
  error: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
})
```

No mostrar la página completa en las diapositivas. El grupo completa el flujo con el editor.

### Cierre conceptual

El cierre recupera estas preguntas:

1. ¿Qué puede asegurar `loginSchema` y qué debe comprobar Firebase?
2. ¿Por qué `RegisterFormValues` se infiere del schema en vez de duplicar una interfaz manual?
3. ¿Qué diferencia existe entre un error de `confirmPassword` y un error general de credenciales?
4. ¿Por qué la página no usa un Effect para leer cada cambio de input?

Las respuestas abren la clase 14: los formularios ya entregan datos válidos; ahora Firebase debe crear o identificar una sesión y comunicar estados remotos.

## Flujo del código

### Estado 1 · Extender las rutas públicas sin cambiar búsqueda ni detalle

`App.tsx` conserva `PublicLayout`, `/search`, el detalle y el wildcard. Se añaden dos páginas públicas:

```tsx
import { LoginPage } from "./pages/login-page"
import { RegisterPage } from "./pages/register-page"

<Route element={<PublicLayout />}>
  <Route index element={<Navigate to="/search" replace />} />
  <Route path="search" element={<SearchPage />} />
  <Route path="media/:mediaType/:externalId" element={<MediaDetailPage />} />
  <Route path="login" element={<LoginPage />} />
  <Route path="register" element={<RegisterPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>
```

`PublicLayout` conserva `AppHeader` y el `Outlet`; login y registro no crean otro layout ni una rama privada. Cada página incluye un enlace hacia la otra para practicar rutas públicas sin añadir navegación imperativa.

### Estado 2 · Instalar las dependencias que faltan

Mantine Core y Hooks ya se instalaron en la clase 06. La clase conserva la misma versión y añade Form y Zod:

```bash
pnpm add @mantine/form@9.4.1 zod@4.4.3
```

El docente abre `package.json` y `pnpm-lock.yaml` para comprobar que `@mantine/core`, `@mantine/hooks` y `@mantine/form` quedaron en `9.4.1`. Después ejecuta:

```bash
pnpm build
```

Este build ocurre antes de crear schemas. Distingue un problema de instalación de un error en la lógica del formulario.

### Estado 3 · Declarar los schemas y los tipos canónicos

El docente crea `src/schemas/auth.ts`. Los schemas son el contrato único para validar e inferir valores de formulario:

```ts
import { z } from "zod/v4"

const emailSchema = z.email({
  error: "Ingresa un correo válido.",
})

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

Las reglas de correo y contraseña se reutilizan porque ambos formularios las necesitan. La guía no crea un schema configurable por modo ni un formulario que cambie de estructura mediante props.

El docente prueba cuatro entradas y pide al grupo que prediga dónde aparece el error:

| Valores | Resultado esperado |
| --- | --- |
| correo vacío y contraseña corta | Error de correo y contraseña. |
| correo válido y contraseña de cinco caracteres | Error junto a contraseña. |
| registro con contraseñas distintas de seis caracteres | Error junto a confirmación. |
| registro con valores válidos | El schema permite el submit temporal. |

### Estado 4 · Construir el formulario de login guiado

`LoginPage` tiene una sola responsabilidad: representar el formulario de esa ruta y entregar sus valores válidos a un handler temporal. No necesita extraer un componente hijo todavía.

```tsx
import { useState } from "react"
import { Alert, Button, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { schemaResolver, useForm } from "@mantine/form"
import { Link } from "react-router"

import { loginSchema, type LoginFormValues } from "../schemas/auth"

export function LoginPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: schemaResolver(loginSchema, { sync: true }),
    validateInputOnBlur: true,
    onValuesChange: () => setSubmittedEmail(null),
  })

  function handleSubmit(values: LoginFormValues) {
    setSubmittedEmail(values.email)
  }

  return (
    <Stack component="section" gap="md">
      <Title order={1}>Iniciar sesión</Title>

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            autoComplete="email"
            key={form.key("email")}
            label="Correo"
            placeholder="tu@correo.com"
            type="email"
            withAsterisk
            {...form.getInputProps("email")}
          />

          <PasswordInput
            autoComplete="current-password"
            key={form.key("password")}
            label="Contraseña"
            withAsterisk
            {...form.getInputProps("password")}
          />

          <Button type="submit">Continuar</Button>
        </Stack>
      </form>

      {submittedEmail !== null && (
        <Alert color="green" role="status">
          El formato de {submittedEmail} es válido. Firebase se conectará en la próxima clase.
        </Alert>
      )}

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </Stack>
  )
}
```

`submittedEmail` solo representa una confirmación local y se limpia cuando cambian valores. No guarda ni muestra la contraseña. Mantine mantiene los valores del formulario; `submittedEmail` no es una copia de esos valores.

### Estado 5 · Comprobar submit, foco y accesibilidad

El docente ejecuta estos recorridos antes de construir registro:

1. Enfocar y abandonar correo vacío: aparece el error del schema.
2. Escribir un correo válido y una contraseña corta: el error queda junto a contraseña.
3. Enviar ambos campos vacíos: `form.onSubmit` no llama `handleSubmit`.
4. Enviar ambos valores válidos: aparece la confirmación temporal sin mostrar contraseña.
5. Cambiar el correo después de una confirmación: el mensaje se limpia mediante `onValuesChange`.

El grupo identifica el recorrido concreto:

```text
TextInput
→ props de getInputProps
→ Mantine actualiza la sesión
→ blur o submit ejecuta schemaResolver
→ Mantine coloca el error en el campo
→ submit válido llama handleSubmit con LoginFormValues
```

No se agrega `useEffect` para observar valores. Mantine expone `onValuesChange` para esa reacción local y `form.onSubmit` entrega los valores actuales.

### Estado 6 · Aplicar el patrón al registro

El docente muestra el cambio de estructura antes de la práctica:

```text
LoginPage
├── correo
└── contraseña

RegisterPage
├── correo
├── contraseña nueva
└── confirmar contraseña
```

`RegisterPage` usa `RegisterFormValues`, `registerSchema` y tres campos. Cambia solamente lo necesario:

- `PasswordInput` de contraseña usa `autoComplete="new-password"`.
- El segundo password input usa `confirmPassword` y también `autoComplete="new-password"`.
- El botón dice “Crear cuenta”.
- El enlace final vuelve a `/login`.
- El handler temporal confirma solo el correo validado.

La clase no convierte Login y Register en un único `AuthForm`. La diferencia de un campo y un schema no justifica aún una API con `mode`, ramas condicionales y props opcionales. En la clase 20 se evaluará reutilización de formularios cuando editar y crear compartan un problema visible.

## Secuencia sugerida

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0-15 min | Docente y grupo | Usar el deck para recuperar rutas públicas y separar validación local de autenticación. |
| 15-28 min | Docente | Declarar `/login` y `/register`, crear páginas estáticas y comprobar que `PublicLayout` sigue mostrando el header. |
| 28-45 min | Docente con participación | Instalar paquetes, crear `auth.ts`, explicar schemas, `z.infer` y mínimo de seis caracteres. |
| 45-60 min | Construcción interactiva | Construir `LoginPage` con `useForm`, `schemaResolver`, modo uncontrolled y props de Mantine. |
| 60-72 min | Docente y estudiantes | Probar blur, submit inválido y submit válido; distinguir campo, confirmación temporal y error remoto futuro. |
| 72-87 min | Demostración docente | Explicar `registerSchema`, el refinamiento de contraseñas y la semántica específica de password inputs. |
| 87-105 min | Actividad estudiantil | Completar `RegisterPage` sin duplicar interfaces ni crear una abstracción configurable. |
| 105-115 min | Parejas y docente | Revisar enlaces entre páginas, labels, autocomplete, `noValidate` y cuatro recorridos de aceptación. |
| 115-120 min | Docente y grupo | Ejecutar build, recuperar el cierre en el deck y nombrar la frontera con Firebase. |

La suma de los bloques es de 120 minutos.

## Actividades del docente

- Empezar con las rutas públicas existentes, no con una lista de validadores.
- Dibujar qué conserva Zod, qué conserva Mantine y qué aún no conserva Firebase.
- Instalar `@mantine/form` y Zod con las versiones fijadas y revisar el lockfile antes de construir el formulario.
- Escribir el schema de login y demostrar que `z.infer` evita una segunda interfaz manual.
- Construir login con el grupo y detenerse en `form.key`, `getInputProps` y `noValidate`.
- Mostrar el refinamiento de registro antes de pedir la práctica independiente.
- Revisar el submit sin imprimir contraseñas, tokens ni correos personales en una proyección.
- Rechazar soluciones que simulen `isPending`, credenciales inválidas o llamadas Firebase en esta clase.

## Actividades de los estudiantes

- Clasificar ejemplos como formato inválido, confirmación diferente o credenciales que solo Firebase podrá evaluar.
- Inferir valores desde el schema y conectar `LoginPage` con el resolver correcto.
- Probar errores por blur y por submit.
- Completar `RegisterPage` usando el schema ya explicado.
- Verificar que el error de coincidencia aparezca junto a confirmación y no en una alerta general.
- Navegar entre `/login` y `/register` con `Link`.
- Comprobar que un submit válido no muestra ni persiste contraseñas.
- Ejecutar `pnpm build` y explicar qué cambiará al conectar Firebase.

## Evidencia de salida

- `/login` y `/register` renderizan dentro de `PublicLayout` y mantienen enlaces entre sí.
- Ambos formularios usan `useForm` en modo uncontrolled con `form.key` y `getInputProps`.
- `loginSchema` y `registerSchema` generan sus tipos de valores mediante `z.infer`.
- El mínimo de contraseña es seis caracteres en ambos schemas.
- Los errores de formato aparecen junto al campo después de blur o submit.
- Una confirmación distinta muestra su error en `confirmPassword`.
- Un submit válido alcanza solo el handler temporal y no crea sesión, request ni cuenta.
- El feedback temporal no muestra contraseña.
- `pnpm build` finaliza correctamente.

## Errores frecuentes y respuesta docente

| Síntoma | Pregunta de diagnóstico | Respuesta esperada |
| --- | --- | --- |
| El ejemplo importa `zodResolver`. | ¿El proyecto usa Mantine 9 y Zod 4? | Importar `schemaResolver` desde `@mantine/form`; no instalar un resolver adicional. |
| El registro muestra el error de coincidencia en una alerta general. | ¿El refinamiento indica dónde debe aparecer su issue? | Añadir `path: ["confirmPassword"]`. |
| El componente lee `form.values.email` para pintar el correo actual. | ¿El modo uncontrolled actualiza `form.values` por cada pulsación? | Usar los valores del submit, `form.getValues()` o `onValuesChange` según la necesidad. |
| El input no refleja un valor que cambió con el formulario. | ¿El input recibió la key de Mantine? | Añadir `key={form.key("campo")}`. |
| El navegador muestra un tooltip nativo distinto al mensaje del schema. | ¿El formulario incluye `noValidate`? | Mantener `type="email"` y añadir `noValidate`. |
| Un estudiante trata correo válido como login correcto. | ¿Algún servicio comprobó la cuenta o la contraseña? | No. El schema solo validó forma; Firebase responde en la clase 14. |
| Se añade `useEffect` para detectar cada pulsación. | ¿Mantine ya expone un callback de cambios? | Usar `onValuesChange` si existe una reacción local necesaria; no crear un Effect. |
| El botón se desactiva o muestra loading sin request. | ¿Qué operación remota existe en este checkpoint? | Ninguna. Dejar pending y errores generales para Firebase. |
| Login y registro se convierten en un componente con `mode`. | ¿La abstracción elimina un problema visible hoy? | Mantener dos páginas; compartir reglas de campo en el schema basta. |

## Vocabulario

- **Formulario:** elemento HTML que agrupa controles y representa una acción de envío.
- **Sesión de formulario:** valores, errores, foco y reglas que pertenecen a una interacción de edición concreta.
- **Schema:** definición ejecutable de la forma y reglas válidas de un dato.
- **Inferencia de tipo:** obtención de un tipo de TypeScript a partir de otra declaración, como un schema.
- **Validación de cliente:** comprobación realizada en el navegador antes de invocar un servicio remoto.
- **Refinamiento:** regla que evalúa una relación entre valores ya definidos, como dos contraseñas.
- **Error de campo:** mensaje asociado al control que la persona debe corregir.
- **Modo uncontrolled:** modo donde Mantine conserva valores actuales sin volver a renderizar React por cada cambio de input.
- **Autocomplete:** pista semántica que permite al navegador y gestores de contraseñas identificar el propósito de un campo.

## Fuera del alcance

- Inicializar Firebase o incluir variables de entorno de Firebase.
- Crear cuenta, iniciar sesión, cerrar sesión o persistir una sesión.
- Estados `isPending`, errores de credenciales, error general o prevención de doble submit causada por una request.
- `AuthProvider`, `onAuthStateChanged`, token y rutas privadas.
- Validar si un correo ya tiene cuenta.
- Políticas de contraseña adicionales a seis caracteres.
- `useEffect` para inputs, schemas o submit.
- Extraer un `AuthForm` configurable o componentes de campo genéricos.
- Guardar contraseñas, formularios o tokens en Zustand o `localStorage`.

## Referencias docentes

- [Mantine Form schema validation](https://mantine.dev/form/schema-validation/)
- [Mantine uncontrolled mode](https://mantine.dev/form/uncontrolled/)
- [Mantine form validation](https://mantine.dev/form/validation/)
- [Zod: defining schemas and refinements](https://zod.dev/api?id=sets)
- [Firebase password-based authentication](https://firebase.google.com/docs/auth/web/password-auth)
