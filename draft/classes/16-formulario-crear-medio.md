# Clase 16 · Formulario local para agregar un medio

- **Semana:** 6
- **Modalidad:** virtual
- **Duración:** 120 minutos
- **Punto de entrada:** checkpoint de la clase 15 con detalle público por URL, sesión Firebase, retorno al destino, cliente HTTP autenticado y shell privado; todavía no existe un formulario de biblioteca ni se llama al endpoint de creación
- **Checkpoint de salida:** una persona autenticada abre desde el detalle un formulario con `status`, `priority` y `notes`; el frontend combina esos valores con `mediaType + externalId` y muestra un body válido sin enviarlo al servidor

## Resultado de aprendizaje

El estudiante podrá separar la identidad y los metadatos del catálogo de los datos que decide el usuario, representar valores cerrados con tipos y controles compatibles, y transformar una sesión de formulario en el body exacto de la rama `catalog`.

## Limitación que abre la clase

El detalle público ya conoce el medio correcto y la sesión ya puede autenticarse ante el backend. Sin embargo, la aplicación aún no sabe qué decisiones quiere guardar la persona:

```text
detalle público
├── mediaType
├── externalId
├── title
├── poster
└── metadatos del catálogo

faltan decisiones del usuario
├── status
├── priority
└── notes
```

Pedir de nuevo título, poster, fechas o `userId` permitiría editar datos que no pertenecen a este formulario. El backend resuelve los metadatos mediante `mediaType + externalId`; Firebase determina al usuario autenticado.

La clase termina antes del request. La clase 17 sustituirá la vista temporal del body por `createMediaLog` y `useMutation`.

## Contrato de creación que usa el curso

El endpoint real recibe una unión entre una entrada de catálogo y una entrada manual. El proyecto reducido implementa únicamente la rama `catalog`:

```ts
export type CreateCatalogMediaLogBody = {
  source: "catalog"
  mediaType: "movie" | "series"
  externalId: string
  status: "pending" | "acquired" | "watching" | "seen" | "dropped" | "paused"
  priority: "low" | "medium" | "high"
  notes: string | null
}
```

`source: "catalog"` es un literal que permite al backend elegir la rama correcta. La clase no declara una unión frontend con `manual`, porque no existe un formulario manual ni un consumidor para esa variante.

El body no contiene:

- `userId`: el backend lo obtiene del token verificado.
- `title`, poster, géneros o fechas: el backend resuelve el catálogo.
- `isLogged`: pertenece a respuestas de búsqueda y detalle.
- `logId`: todavía no existe; el servidor lo genera al crear.
- `anime`: el dominio de la cohorte solo permite `movie | series`.

Aunque el DTO de detalle devuelve `externalId` numérico dentro de `catalog`, la URL y `GetMediaDetailInput` ya conservan ese identificador como `string`. El adaptador usa ese input existente y no cambia `MediaDetailModel` ni añade otro tipo de selección con la misma forma.

## Regla de notas del frontend

El backend actual exige `notes: string | null` y no declara un máximo. Para ofrecer validación visible y conservar el comportamiento reducido de Medialog Web, el curso limita el textarea a 256 caracteres.

Esta diferencia debe nombrarse en clase:

```text
contrato del backend → string | null
regla de esta interfaz → máximo 256 caracteres
```

La regla visual puede ser más estricta que el contrato de transporte, pero nunca debe presentarse como una restricción que el servidor no posee. Un texto vacío o compuesto solo por espacios se convierte en `null` en la frontera del body.

## Conceptos que se enseñan y consolidan

- Datos del catálogo frente a datos del usuario.
- Valores del formulario frente a body de transporte.
- Valores cerrados mediante `z.enum` y uniones literales.
- `string` vacío frente a `null` de transporte.
- Literal `source: "catalog"` como selector de contrato.
- `Select` con etiquetas visibles y valores exactos de API.
- `allowDeselect={false}` para conservar una selección válida.
- Mantine Form en modo uncontrolled, `form.key` y `getInputProps`.
- Adaptador puro para una transformación de frontera.
- Estado local de apertura y sesión de formulario.
- Desmontaje condicional y `key` como mecanismos de reinicio.
- Retorno al detalle después de autenticarse.

## Mapa de responsabilidades

| Pieza | Responsabilidad al cerrar la clase | Lo que no hace |
| --- | --- | --- |
| `MediaDetailPage` | Validar la URL, consultar el detalle, decidir la acción según sesión y abrir el modal. | No construye el body campo por campo ni ejecuta una mutación. |
| `CreateMediaLogForm` | Administrar valores, errores y preview de una sesión local de creación. | No consulta catálogo, no obtiene token y no llama a la API. |
| `mediaLogFormSchema` | Validar los valores que la interfaz permite editar. | No representa todo el DTO del backend. |
| `toCreateMediaLogBody` | Combinar `GetMediaDetailInput` con valores válidos y normalizar notas. | No cambia estado, no abre el modal y no hace `fetch`. |
| `AuthProvider` | Indicar `checking`, `anonymous` o `authenticated`. | No conserva el formulario. |
| Clase 17 | Consumir el body mediante una mutación autenticada. | No volverá a definir campos, schema o transformación. |

## Guion de presentación

### Propósito y duración

La apertura conceptual ocupa 15 minutos. Recupera los dos recorridos de la clase 15 y presenta una tercera frontera: los datos que vienen del catálogo no deben convertirse en campos editables. El deck vuelve al final para comprobar quién aporta cada dato y anticipar la mutación.

### Recapitulación y apertura conceptual

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Recapitulación | La sesión y el request ya están conectados | Recuperar `AuthProvider → PrivateLayout` y `requestJsonWithAuth → Bearer`. Ninguna de esas piezas sabe qué status o prioridad quiere guardar la persona. | Pedir que dos estudiantes reconstruyan los diagramas de sesión y request de la clase 15. |
| Problema | El catálogo describe; el usuario decide | Título, poster, tipo y fechas llegan del catálogo. Status, prioridad y notas pertenecen a la biblioteca personal. | Tabla con dos colores. Preguntar qué ocurriría si el formulario permitiera cambiar el título. |
| Contrato | El body combina dos orígenes | `mediaType + externalId` vienen de la URL validada; los tres valores editables vienen del formulario; `source` lo fija el adaptador. | Diagrama de convergencia hacia `CreateCatalogMediaLogBody`. |
| Distinción | Form values y DTO no tienen la misma nulabilidad | El textarea trabaja bien con `""`; el endpoint exige que “sin notas” sea `null`. La conversión ocurre en una frontera, no en cada control. | Comparación `{ notes: "" } → { notes: null }`. |
| Valores cerrados | La etiqueta puede cambiar; el value no | La interfaz muestra “Por ver” y envía `pending`. `z.enum` y los tipos literales impiden inventar valores como `later`. | Dos columnas `label` y `value`; mostrar un value inválido tachado. |
| Select | Una opción requerida no debe desaparecer | Mantine Select permite deseleccionar por defecto. `allowDeselect={false}` conserva status y prioridad como strings válidos. | Demostración corta con y sin la prop. No introducir Combobox. |
| Diseño | Validar no equivale a enviar | Mantine y Zod aceptan o rechazan valores locales. El adaptador produce el body. La mutación aún no existe. | Línea `input → schema → submit local → adaptador → preview`; endpoint atenuado. |
| Reinicio | Cerrar termina esta sesión de edición | El formulario se monta solo cuando el modal está abierto. Cerrar lo desmonta; cambiar `mediaType + externalId` cambia su `key`. | Árbol antes/después. Contrastar con un Effect que observa `opened` para llamar reset. |
| Autenticación | El detalle sigue siendo público | Una sesión anónima ve “Inicia sesión para agregar”. El Link conserva `from`; Login o Registro devuelven al mismo detalle. | Recorrido `/media/... → /login → /media/...`. Aclarar que `state` no aparece en la URL. |
| Límite | El botón todavía no guarda | El checkpoint muestra un body local. `useMutation`, pending remoto, `409` e invalidación empiezan en la clase 17. | Mostrar el contrato de salida, no el hook futuro. |

### Diagrama principal para las diapositivas

```text
GetMediaDetailInput                 MediaLogFormValues
├── mediaType                      ├── status
└── externalId                     ├── priority
                                   └── notes: string
          │                              │
          └──────────────┬───────────────┘
                         ▼
              toCreateMediaLogBody
                         │
                         ▼
            CreateCatalogMediaLogBody
            ├── source: "catalog"
            ├── mediaType
            ├── externalId
            ├── status
            ├── priority
            └── notes: string | null
```

El diagrama debe mostrar que el formulario no posee toda la información y que el detalle tampoco posee las decisiones del usuario.

### Contrastes y notas docentes que deben sobrevivir a las slides

- El backend acepta una rama manual, pero el curso no la implementa. No crear controles invisibles ni tipos para una feature excluida.
- `source` no es una opción del formulario. El caso de uso ya sabe que la persona agrega desde catálogo.
- `externalId` no es un input oculto editable. `GetMediaDetailInput` ya lo obtuvo de una URL validada.
- El título aparece como contexto del modal, pero no entra en el body.
- Status y prioridad usan labels en español y values en inglés. El servidor recibe values.
- Los values cerrados y sus tipos ya pertenecen al contrato API definido en la clase 07. El schema los importa para validar el formulario; no los redefine ni invierte la dependencia haciendo que el contrato dependa de la interfaz.
- `z.enum` debe recibir los values como tuple literal o arreglo `as const` para conservar la unión precisa.
- `allowDeselect={false}` evita que Select produzca `null`; el schema sigue validando porque el navegador y el código también pueden entregar datos inválidos.
- El máximo de 256 caracteres pertenece a esta interfaz. El schema del backend solo exige `string | null`.
- `notes.trim()` sirve para decidir si existe contenido. La transformación ocurre en `toCreateMediaLogBody`, no mediante un Effect ni al pulsar cada tecla.
- `form.reset()` es válido ante un evento, pero este flujo no lo necesita para cerrar: el render condicional desmonta la sesión completa.
- La `key` de `form.key("status")` pertenece al modo uncontrolled. La `key` de `CreateMediaLogForm` identifica otro medio. Deben explicarse como dos usos distintos del mismo mecanismo de React.
- El preview del body es temporal y local. No representa éxito remoto, no marca `isLogged` y no invalida queries.
- La persona anónima conserva solo el path de regreso. `location.state` no contiene DTO, formulario, token ni credenciales.
- No introducir un `useCreateMediaLog`, un servicio de API ni notificaciones en esta clase.

### Snippets conceptuales para las slides

Valores cerrados:

```ts
import { MEDIA_STATUS_VALUES } from "../types/media-api"

const statusSchema = z.enum(MEDIA_STATUS_VALUES)
```

Transformación de nulabilidad:

```ts
const notes = values.notes.trim()

return {
  notes: notes === "" ? null : notes,
}
```

Retorno al detalle:

```tsx
<Link state={{ from: location.pathname }} to="/login">
  Inicia sesión para agregar
</Link>
```

Los snippets muestran una sola decisión. El schema, adaptador y componente completos se construyen en el editor.

### Cierre conceptual

El cierre recupera estas preguntas:

1. ¿Qué campos aporta el catálogo y cuáles puede decidir la persona?
2. ¿Por qué `notes` usa `""` en el formulario y `null` en el body?
3. ¿Por qué `source` y `externalId` no aparecen como controles?
4. ¿Qué reinicia el formulario al cerrar el modal o cambiar de medio?
5. ¿Qué falta para que el body llegue al backend?

## Estado inicial y transformación de archivos

El checkpoint 15 ya contiene `media-detail-page.tsx`, `types/media-api.ts`, el provider y los formularios de autenticación. La clase agrega responsabilidades concretas:

```text
src/
├── adapters/
│   └── media-log-form-to-create-body.ts   nuevo
├── components/
│   └── create-media-log-form.tsx          nuevo
├── schemas/
│   └── media-log.ts                       nuevo
├── types/
│   └── media-api.ts                       se amplía
└── pages/
    └── media-detail-page.tsx              integra sesión, CTA y modal
```

No se crea `api/create-media.ts`, un hook de mutación o una ruta nueva.

## Flujo del código

### Estado 1 · Auditar quién aporta cada campo

El docente abre el DTO de detalle, `GetMediaDetailInput` y el contrato de creación. El grupo completa esta tabla antes de escribir código:

| Campo | Origen | ¿Control visible? |
| --- | --- | --- |
| `source` | Caso de uso “agregar desde catálogo” | No. |
| `mediaType` | URL validada | No. Se muestra como contexto si ayuda. |
| `externalId` | URL validada | No. |
| `status` | Persona | Sí. |
| `priority` | Persona | Sí. |
| `notes` | Persona | Sí, opcional. |
| `userId` | Token verificado por backend | No y no forma parte del body. |
| título, poster, fechas | Catálogo resuelto por backend | No. |

El docente muestra un formulario incorrecto con título y `userId`. El grupo debe retirarlos y justificar la decisión.

### Estado 2 · Reutilizar los values del contrato en el schema

Se crea `src/schemas/media-log.ts`:

```ts
import { z } from "zod/v4"

import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
} from "../types/media-api"

export const mediaLogFormSchema = z.object({
  status: z.enum(MEDIA_STATUS_VALUES, {
    error: "Selecciona un status válido.",
  }),
  priority: z.enum(MEDIA_PRIORITY_VALUES, {
    error: "Selecciona una prioridad válida.",
  }),
  notes: z.string().max(256, {
    error: "Las notas deben tener 256 caracteres o menos.",
  }),
})

export type MediaLogFormValues = z.infer<typeof mediaLogFormSchema>
```

Los arreglos `as const` y los tipos `MediaStatus` y `MediaPriority` existen desde la clase 07 junto al contrato HTTP. Zod consume esos mismos values y `MediaLogFormValues` se infiere del schema. Así, el contrato no depende de una carpeta de formularios y tampoco existe una segunda lista que pueda separarse de los values reales.

### Estado 3 · Ampliar el tipo de transporte mínimo

`src/types/media-api.ts` añade solamente la rama que el frontend enviará:

```ts
import type { MediaType } from "./media"

export type CreateCatalogMediaLogBody = {
  source: "catalog"
  mediaType: MediaType
  externalId: string
  status: MediaStatus
  priority: MediaPriority
  notes: string | null
}
```

`MediaType` ya excluye anime en el dominio del curso. Si una guía anterior hubiera permitido `anime`, se corrige en el primer tipo canónico y se propaga; esta clase no oculta la incompatibilidad mediante un cast.

El body es un tipo de transporte, no un modelo visual. No incluye labels en español ni estado del modal.

### Estado 4 · Construir la transformación de frontera

Se crea `src/adapters/media-log-form-to-create-body.ts`:

```ts
import type { MediaLogFormValues } from "../schemas/media-log"
import type { CreateCatalogMediaLogBody, GetMediaDetailInput } from "../types/media-api"

export function toCreateMediaLogBody(
  identity: GetMediaDetailInput,
  values: MediaLogFormValues,
): CreateCatalogMediaLogBody {
  const notes = values.notes.trim()

  return {
    source: "catalog",
    mediaType: identity.mediaType,
    externalId: identity.externalId,
    status: values.status,
    priority: values.priority,
    notes: notes === "" ? null : notes,
  }
}
```

El docente prueba tres casos sin abrir todavía el modal:

| Entrada relevante | Salida esperada |
| --- | --- |
| `notes: ""` | `notes: null` |
| `notes: "   "` | `notes: null` |
| `notes: "  Ver con subtítulos  "` | `notes: "Ver con subtítulos"` |

La función es pura: la misma identidad y los mismos values producen el mismo body. No accede a Firebase, `location`, un store o Query Client.

### Estado 5 · Construir `CreateMediaLogForm`

Las etiquetas visuales viven junto al componente que las usa. Los values y tipos exactos siguen viniendo del contrato API; el schema se limita a validar los valores del formulario:

```tsx
import { useState } from "react"
import { Button, Code, Group, Select, Stack, Text, Textarea } from "@mantine/core"
import { schemaResolver, useForm } from "@mantine/form"

import { toCreateMediaLogBody } from "../adapters/media-log-form-to-create-body"
import {
  mediaLogFormSchema,
  type MediaLogFormValues,
} from "../schemas/media-log"
import {
  MEDIA_PRIORITY_VALUES,
  MEDIA_STATUS_VALUES,
  type CreateCatalogMediaLogBody,
  type GetMediaDetailInput,
  type MediaPriority,
  type MediaStatus,
} from "../types/media-api"

const STATUS_LABELS: Record<MediaStatus, string> = {
  pending: "Por ver",
  acquired: "Adquirida",
  watching: "Viendo",
  seen: "Vista",
  dropped: "Abandonada",
  paused: "Pausada",
}

const PRIORITY_LABELS: Record<MediaPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
}

const STATUS_OPTIONS = MEDIA_STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}))

const PRIORITY_OPTIONS = MEDIA_PRIORITY_VALUES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}))

interface CreateMediaLogFormProps {
  identity: GetMediaDetailInput
  title: string
  onCancel: () => void
}

export function CreateMediaLogForm({
  identity,
  title,
  onCancel,
}: CreateMediaLogFormProps) {
  const [preparedBody, setPreparedBody] =
    useState<CreateCatalogMediaLogBody | null>(null)

  const form = useForm<MediaLogFormValues>({
    mode: "uncontrolled",
    initialValues: {
      status: "pending",
      priority: "medium",
      notes: "",
    },
    validate: schemaResolver(mediaLogFormSchema, { sync: true }),
    validateInputOnBlur: true,
    onValuesChange: () => setPreparedBody(null),
  })

  function handleSubmit(values: MediaLogFormValues) {
    setPreparedBody(toCreateMediaLogBody(identity, values))
  }

  return (
    <Stack gap="md">
      <Text size="sm">Configura “{title}” para tu biblioteca.</Text>

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            allowDeselect={false}
            data={STATUS_OPTIONS}
            key={form.key("status")}
            label="Status"
            {...form.getInputProps("status")}
          />

          <Select
            allowDeselect={false}
            data={PRIORITY_OPTIONS}
            key={form.key("priority")}
            label="Prioridad"
            {...form.getInputProps("priority")}
          />

          <Textarea
            autosize
            key={form.key("notes")}
            label="Notas"
            minRows={3}
            placeholder="Opcional"
            {...form.getInputProps("notes")}
          />

          <Group justify="flex-end">
            <Button onClick={onCancel} type="button" variant="default">
              Cancelar
            </Button>
            <Button type="submit">Preparar body</Button>
          </Group>
        </Stack>
      </form>

      {preparedBody !== null && (
        <Stack gap="xs">
          <Text fw={600} size="sm">Body preparado</Text>
          <Code block>{JSON.stringify(preparedBody, null, 2)}</Code>
        </Stack>
      )}
    </Stack>
  )
}
```

`preparedBody` no copia una respuesta remota. Conserva el resultado local del último submit para que el estudiante pueda compararlo con el contrato. `onValuesChange` lo elimina cuando los controles cambian; no usa un Effect.

El botón dice “Preparar body”, no “Guardar”. La interfaz todavía no debe prometer una operación que no existe.

### Estado 6 · Integrar sesión, retorno y modal en el detalle

`MediaDetailPage` ya llama sus hooks antes de cualquier retorno. Los nuevos hooks se declaran junto a los existentes:

```tsx
const authState = useAuth()
const location = useLocation()
const [isCreateOpen, setIsCreateOpen] = useState(false)
```

La página representa una acción por estado de sesión:

```tsx
{authState.status === "checking" && (
  <Button disabled>Comprobando sesión</Button>
)}

{authState.status === "anonymous" && (
  <Button
    component={Link}
    state={{ from: location.pathname }}
    to="/login"
  >
    Inicia sesión para agregar
  </Button>
)}

{authState.status === "authenticated" && (
  <Button onClick={() => setIsCreateOpen(true)}>
    Agregar a mi biblioteca
  </Button>
)}
```

`location.state.from` conserva el path para el siguiente submit de Login o Registro. No convierte el detalle en una ruta privada y no envía el DTO mediante navegación.

El modal se compone en la misma página, después de los estados del detalle:

```tsx
<Modal
  opened={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  title="Agregar a mi biblioteca"
>
  {isCreateOpen && detailInput !== null && detailModel !== null && (
    <CreateMediaLogForm
      identity={detailInput}
      key={`${detailInput.mediaType}:${detailInput.externalId}`}
      onCancel={() => setIsCreateOpen(false)}
      title={detailModel.title}
    />
  )}
</Modal>
```

El render condicional garantiza que cerrar el modal desmonte `CreateMediaLogForm`. Reabrir crea una sesión con valores iniciales. Si React Router conserva la misma página al cambiar los parámetros, la `key` cambia y reinicia el formulario para el nuevo medio.

La guía debe distinguir esta `key` de las keys internas de Mantine:

```text
form.key("status")
→ Mantine actualiza un input uncontrolled

key={`${mediaType}:${externalId}`}
→ React identifica otra instancia del formulario
```

Ninguna exige un Effect.

### Estado 7 · Conservar el destino entre Login y Registro

La clase 14 ya calcula `destination`. Para que una persona sin cuenta no pierda el detalle al cambiar entre formularios, ambos enlaces de autenticación transmiten ese mismo destino:

```tsx
// Dentro de LoginPage
<Link state={{ from: destination }} to="/register">
  Regístrate
</Link>

// Dentro de RegisterPage
<Link state={{ from: destination }} to="/login">
  Inicia sesión
</Link>
```

Este ajuste se propaga retrospectivamente a la guía 14. La clase 16 lo recupera mediante un recorrido, pero no vuelve a enseñar `useLocation` ni `useNavigate`.

### Estado 8 · Comprobar el checkpoint sin llamar al endpoint

El grupo prueba estos recorridos:

1. Abrir un detalle sin sesión: aparece el Link de login y no el formulario.
2. Iniciar sesión desde ese Link: la aplicación regresa al mismo path de detalle.
3. Abrir el modal autenticado: aparecen exactamente tres controles.
4. Enviar valores iniciales: el preview contiene `pending`, `medium` y `notes: null`.
5. Escribir notas con espacios en los extremos: el body las normaliza.
6. Superar 256 caracteres: el schema bloquea el submit y asocia el error al textarea.
7. Cambiar labels: el body conserva values del contrato en inglés.
8. Cerrar y reabrir: vuelven los valores iniciales y desaparece el preview.
9. Abrir una película y una serie: cambian `mediaType + externalId` y el formulario no conserva datos del medio anterior.
10. Inspeccionar Network: no aparece `POST /api/v2/media/create`.

La última comprobación forma parte del checkpoint. Un body correcto no equivale todavía a un registro creado.

## Secuencia sugerida

| Tiempo | Responsable | Actividad y progreso observable |
| --- | --- | --- |
| 0-15 min | Docente y grupo | Usar el deck para recuperar sesión/request, separar catálogo de datos personales y leer el body objetivo. |
| 15-32 min | Docente con participación | Auditar el contrato real, descartar campos incorrectos y añadir `CreateCatalogMediaLogBody`. |
| 32-52 min | Construcción interactiva | Localizar los values canónicos de la clase 07, conectarlos a `z.enum`, añadir la regla de notas y observar el tipo inferido del formulario. |
| 52-75 min | Docente y estudiantes | Construir `CreateMediaLogForm` con selects, textarea, labels, values y validación uncontrolled. |
| 75-92 min | Práctica guiada | Crear `toCreateMediaLogBody`, probar nulabilidad y representar el preview local. |
| 92-108 min | Docente con participación | Integrar estados de sesión, retorno al detalle, modal, desmontaje condicional y key por identidad. |
| 108-115 min | Actividad estudiantil | Completar y explicar los recorridos de cancelación, reapertura, película, serie y límite de notas. |
| 115-120 min | Docente y grupo | Ejecutar `pnpm build`, recuperar el deck y delimitar la mutación de la clase 17. |

La suma de los bloques es de 120 minutos.

## Actividades del docente

- Abrir el contrato real antes de dibujar controles.
- Pedir que el grupo clasifique cada campo por propietario.
- Mostrar por qué la rama manual del backend no justifica una feature manual en el frontend.
- Recuperar por qué los values del contrato usan `as const` y comprobar que `z.enum` conserva esa unión al inferir el formulario.
- Demostrar `allowDeselect` antes de fijarlo en ambos selects.
- Mantener labels visibles separados de los values de transporte.
- Construir la transformación con datos concretos y probar `""`, espacios y texto.
- Señalar la diferencia entre `form.key` y la key de instancia del componente.
- Probar el retorno Login/Registro sin reconstruir autenticación.
- Inspeccionar Network para demostrar la ausencia del POST.
- Rechazar `userId`, título editable, token, `fetch`, `useMutation` y Effect de reset.

## Actividades de los estudiantes

- Clasificar campos del catálogo, usuario, sesión y servidor.
- Importar los arrays canónicos de status y prioridad sin duplicarlos dentro del schema.
- Crear el schema y explicar el límite de notas como regla del frontend.
- Mapear cada value a su label en español.
- Construir los tres controles con `form.key` y `getInputProps`.
- Completar el adaptador con campos explícitos y normalización a `null`.
- Probar la acción como sesión anónima y autenticada.
- Verificar reinicio por cierre y cambio de identidad.
- Comparar el preview con el tipo de transporte.
- Ejecutar build y demostrar que no hubo request de creación.

## Evidencia de salida

- Una persona anónima ve “Inicia sesión para agregar” y vuelve al mismo detalle después de Login o Registro.
- Una persona autenticada abre un modal con solo `status`, `priority` y `notes`.
- Los selects no pueden quedar deseleccionados y envían values válidos del contrato.
- El textarea muestra un error cuando supera 256 caracteres.
- `MediaLogFormValues` se infiere del schema; no existe una interfaz manual duplicada.
- Status y prioridad tienen un solo vocabulario de transporte en `media-api.ts`; el schema y la interfaz lo consumen.
- `CreateCatalogMediaLogBody` contiene solo la rama `catalog` usada por el producto.
- `toCreateMediaLogBody` recibe identidad y values sin leer estado externo.
- Notas vacías o con solo espacios producen `null`.
- El título se muestra como contexto, pero no aparece en el body.
- Cerrar y reabrir reinicia la sesión sin `useEffect`.
- Cambiar de película a serie cambia la identidad y no conserva valores anteriores.
- El preview permite inspeccionar el body y Network confirma que no se ejecuta el endpoint.
- `pnpm build` finaliza correctamente.

## Errores frecuentes y respuesta docente

| Síntoma | Pregunta de diagnóstico | Respuesta esperada |
| --- | --- | --- |
| El formulario pide título o poster. | ¿Quién ya posee y resuelve esos metadatos? | Retirar los controles; catálogo y backend son responsables. |
| El body incluye `userId`. | ¿De dónde obtiene identidad el endpoint protegido? | Del token verificado; el cliente no elige otro usuario. |
| `externalId` se obtiene del DTO numérico con un cast. | ¿Qué tipo ya construyó la página desde la URL? | Reutilizar `GetMediaDetailInput.externalId: string`. |
| El tipo incluye una rama manual sin interfaz. | ¿Qué caso de uso del curso la consume? | Conservar solo `CreateCatalogMediaLogBody`. |
| Select produce `null`. | ¿La opción puede deseleccionarse al pulsarla de nuevo? | Añadir `allowDeselect={false}` y conservar el schema. |
| La interfaz muestra values en inglés como labels. | ¿Puede separar texto visible y valor transportado? | Construir opciones `{ value, label }`. |
| Espacios producen una nota aparentemente vacía. | ¿La frontera normalizó el texto? | Aplicar `trim` en el adaptador y enviar `null` si queda vacío. |
| El máximo de 256 se atribuye al servidor. | ¿Qué declara el schema del endpoint? | Explicar que el servidor acepta `string | null`; 256 es una regla del frontend. |
| Un Effect llama `form.reset()` cuando se cierra el modal. | ¿Qué evento y condición ya conocen el cierre? | Desmontar mediante render condicional o resetear desde el evento; no observarlo. |
| El preview sigue visible después de editar. | ¿Qué callback ofrece el formulario para cambios conocidos? | Limpiarlo mediante `onValuesChange`. |
| El botón dice “Guardar” y solo muestra JSON. | ¿Ocurrió alguna mutación remota? | Usar “Preparar body” hasta la clase 17. |
| Se añade loading remoto. | ¿Existe una promesa de servidor en este checkpoint? | No. Reservar pending y errores de API para `useMutation`. |

## Vocabulario

- **Datos de catálogo:** información descriptiva obtenida de una fuente externa, como título, poster y fecha.
- **Datos del usuario:** decisiones personales asociadas a su biblioteca, como status, prioridad y notas.
- **Valor cerrado:** dato que solo admite miembros de un conjunto conocido.
- **Label:** texto visible que explica una opción en la interfaz.
- **Value:** valor estable que el código y la API usan para identificar esa opción.
- **Literal:** tipo que representa un valor exacto, como `"catalog"`, en lugar de cualquier string.
- **Normalización:** conversión de representaciones equivalentes a una forma acordada, como espacios vacíos a `null`.
- **Body de transporte:** objeto que el cliente preparará para enviar en el cuerpo de un request.
- **Remount:** creación de una instancia nueva de un componente después de desmontarlo o cambiar su `key`.
- **Regla de producto:** restricción decidida por la interfaz aunque el contrato remoto permita un conjunto más amplio.

## Fuera de alcance

- Ejecutar `POST /api/v2/media/create`.
- Crear `createMediaLog`, `useCreateMediaLog` o cualquier mutación.
- Mostrar pending remoto, notificación de éxito, `401`, `404` o `409`.
- Invalidar búsqueda, detalle o biblioteca.
- Marcar `isLogged` manualmente o copiar DTOs a estado local.
- Crear entradas manuales, incluir anime o pedir metadatos del catálogo.
- Extraer un formulario configurable para create/edit; se evalúa en la clase 20.
- Crear una ruta `/app/library/new`.
- Usar Zustand para el modal o el formulario.
- Usar `useEffect` para abrir, cerrar, resetear, transformar o preparar el body.
- Modificar o ejecutar el backend.

## Referencias docentes

- [Mantine Form: schema validation](https://mantine.dev/form/schema-validation/)
- [Mantine Form: uncontrolled mode](https://mantine.dev/form/uncontrolled/)
- [Mantine Form: `useForm`](https://mantine.dev/form/use-form/)
- [Mantine Select: `allowDeselect` y formatos de `data`](https://mantine.dev/core/select/)
- [Zod: enums y tipos nullable](https://zod.dev/api)
- Contrato local: `medialog-server/apps/api/src/interfaces/http/schemas/media-v2.schema.ts`.
