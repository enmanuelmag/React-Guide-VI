# Sesión 11 · Formularios, Zod y modal global

> Estado: paquete textual aprobado definitivamente. Presentación 11 aprobada el 8 de octubre de 2026. Proyecto progresivo implementado hasta `session-11-end` y guía docente refinada con archivos completos y checkpoints verificables.

- **Fecha:** lunes 19 de octubre de 2026
- **Semana:** 5
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Entrada ejecutable:** `session-11-start` = `session-10-end`

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 10:

- `SearchPage` muestra resultados con `mediaType + externalId` y enlaces de detalle.
- `MediaDetailPage` conserva el `GetMediaDetailInput` validado y presenta el catálogo remoto.
- Ambas páginas son hijas de `PublicLayout`.
- Mantine Core, React Router, TanStack Query y Vitest ya funcionan.
- `MEDIA_STATUS_VALUES`, `MEDIA_PRIORITY_VALUES`, `MediaStatus` y `MediaPriority` viven en `src/types/media-api.ts`.
- No existen formulario de biblioteca, modal global, Zustand, autenticación o mutación.

## Limitación visible

Búsqueda y detalle necesitan iniciar la misma creación local, pero pertenecen a ramas distintas del layout:

```text
PublicLayout
├── SearchPage ──────── quiere abrir creación
├── MediaDetailPage ─── quiere abrir creación
└── una sola instancia del modal
```

El estado local de una página no alcanza a la otra. Zustand aparece para conservar los datos del medio elegido, no para reemplazar Query, Mantine Form o Firebase.

## Checkpoint de salida

Al terminar:

- `zustand@5.0.15`, `@mantine/form@9.4.1` y `zod@4.4.3` están instalados.
- `CreateCatalogMediaLogBody` contiene solo la rama `source: "catalog"`.
- `mediaLogFormSchema` valida estado, prioridad y notas; `MediaLogFormValues` se infiere del schema.
- `toCreateMediaLogBody()` combina el tipo y el ID ya comprobados con values y normaliza notas vacías a `null`.
- `useCreateMediaLogModalStore` conserva solo `selection`, `openCreate` y `closeCreate`.
- `opened` se deriva mediante `selection !== null`.
- `CreateMediaLogModal` se monta una vez en `PublicLayout`, junto a `Outlet`.
- `SearchPage` y `MediaDetailPage` abren la misma instancia con el tipo y el ID actuales.
- `MediaSearchResults` recibe `onCreate`; no importa el store.
- `CreateMediaLogForm` presenta estado, prioridad y notas y muestra un body local.
- Cerrar o elegir otro medio desmonta y reinicia el formulario mediante render condicional y `key`.
- La prueba dirigida y `pnpm build` terminan con código 0 en el seed ejecutable.
- Network no muestra `POST /api/v2/media/create`.

El test demuestra la transformación pura. El build demuestra tipado y empaquetado. La matriz manual demuestra el flujo observado en un navegador local. Ninguna evidencia demuestra autenticación o persistencia.

## Resultado de aprendizaje

El estudiante coordinará los datos del medio elegido entre dos páginas, administrará valores y errores con Mantine Form, validará con Zod y preparará un body de transporte sin ejecutar una mutación.

## Concepto principal

Cada herramienta conserva un estado distinto:

| Estado | Propietario |
| --- | --- |
| Medio elegido para el modal | Zustand |
| Valores y errores | Mantine Form |
| Reglas válidas | Zod |
| Body preparado | Resultado local del submit |
| DTO y caché | TanStack Query |
| Sesión futura | Firebase |

## Decisiones técnicas

### Estrategia de construcción y referencia

La sesión no intenta escribir ocho archivos desde cero en 90 minutos. El docente conserva una referencia final completa en `teacher-guide.md` y prepara scaffolds que compilan para las partes mecánicas.

| Tratamiento | Piezas |
| --- | --- |
| Preparadas para revisar y completar | `CreateCatalogMediaLogBody`, store, schema, shell del modal y puntos de integración |
| Construida en vivo | `CreateMediaLogForm`, conexión de controles, submit y recorrido hasta el preview |
| Escrita primero por la persona | `toCreateMediaLogBody` y su matriz de comportamiento |
| Delegada después de decidir comportamiento | Solo la prueba del adapter dentro de `__tests__/` |

Cada pieza nueva conserva ruta, definición, imports, consumidor y checkpoint. Una definición presente en este borrador no sustituye su explicación y referencia completa en la guía docente.

```text
src/types/media-api.ts                         CreateCatalogMediaLogBody
src/schemas/media-log.ts                       mediaLogFormSchema → MediaLogFormValues
src/adapters/media-log-form-to-create-body.ts  toCreateMediaLogBody
src/stores/create-media-log-modal-store.ts      selection + acciones
src/components/create-media-log-form.tsx        controls + submit + preview
src/components/create-media-log-modal.tsx       Modal + render condicional
src/layouts/public-layout.tsx                    instancia global
src/pages/search-page.tsx                       apertura desde búsqueda
src/pages/media-detail-page.tsx                 apertura desde detalle
```

### Store mínimo

```ts
import { create } from "zustand"

import type { GetMediaDetailInput } from "../types/media-api"

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

El store no guarda `opened`, título, DTO, values, errores, body, token o sesión. Cada consumidor usa un selector atómico.

### Contrato y schema

`CreateCatalogMediaLogBody` añade `source`, tipo, ID, estado, prioridad y notas. No contiene `userId`, título, poster, fechas, `isLogged` o `logId`.

```ts
export const mediaLogFormSchema = z.object({
  status: z.enum(MEDIA_STATUS_VALUES),
  priority: z.enum(MEDIA_PRIORITY_VALUES),
  notes: z.string().max(256, {
    error: "Las notas deben tener 256 caracteres o menos.",
  }),
})

export type MediaLogFormValues = z.infer<typeof mediaLogFormSchema>
```

El límite de 256 caracteres pertenece a la interfaz del curso. El contrato remoto solo declara `string | null`.

Esta primera aparición fija una cadena que se reutilizará desde ahora:

```text
schema Zod
→ z.infer deriva el tipo
→ parse, safeParse o schemaResolver examina un valor en runtime
→ el consumidor recibe el valor validado
```

`z.infer` evita duplicar la forma en TypeScript, pero no ejecuta validación. En este formulario, `schemaResolver(mediaLogFormSchema)` es la pieza que sí evalúa los values antes de entregarlos al submit válido. `MediaStatus` y `MediaPriority` permanecen como contratos de transporte introducidos antes de Zod; sus arrays `as const` alimentan los `z.enum` sin repetir values. `MediaType` conserva por ahora su definición anterior porque este schema no lo consume.

### Transformación

```ts
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

El adapter no lee el store, Router, Firebase o Query Client.

### Formulario y reinicio

El formulario usa:

- `mode: "uncontrolled"`;
- `schemaResolver(mediaLogFormSchema, { sync: true })`;
- `form.key()` y `form.getInputProps()`;
- status inicial `pending`;
- prioridad inicial `medium`;
- notes inicial `""`;
- `allowDeselect={false}` en ambos selects.

`CreateMediaLogModal` deriva `opened`, monta el formulario solo con selección y usa:

```tsx
key={`${selection.mediaType}:${selection.externalId}`}
```

Cerrar asigna `null` y desmonta el formulario. No se observa `opened` con un Effect.

### Dos puntos de apertura

`SearchPage` selecciona `openCreate` y lo entrega a `MediaSearchResults` como `onCreate`. El resultado llama el callback con `mediaType + externalId`.

`MediaDetailPage` selecciona la misma acción y la ejecuta con `detailInput` únicamente en la rama exitosa. El store no obliga a los componentes presentacionales a importarlo.

## Secuencia · 90 minutos

Presentación completa → editor → práctica → comprobación y cierre oral. Todas las instrucciones de edición y los archivos de soporte aparecen después del deck, dentro de su bloque de la guía docente.

| Bloque | Tiempo | Actividad | Evidencia |
| --- | ---: | --- | --- |
| S11-B01 | 0–25 | Presentación continua y preguntas sobre el mapa. | El grupo distingue responsabilidades. |
| S11-B02 | 25–35 | Dependencias, store, modal y botón temporal. | Apertura y cierre con datos visibles. |
| S11-B03 | 35–43 | Abrir desde búsqueda y detalle; retirar botón temporal. | Ambas páginas usan la misma instancia. |
| S11-B04 | 43–51 | Contrato, schema y demostración temporal con safeParse. | Tres entradas aceptadas o rechazadas. |
| S11-B05 | 51–65 | Formulario uncontrolled, errores y vista previa de valores. | Campos conectados; demostración retirada. |
| S11-B06 | 65–74 | Adapter, body y reinicio. | Vacío/espacios normalizados, preview retirado al editar. |
| S11-B07 | 74–81 | Tests con agente y lectura humana. | Cinco casos ejecutados y diff leído. |
| S11-B08 | 81–87 | Práctica con otro medio. | Recorrido y Network documentados. |
| S11-B09 | 87–90 | Comprobación y cierre oral. | Checkpoint y punto de reanudación. |

**Comprobación:** `25 + 10 + 8 + 8 + 14 + 9 + 7 + 6 + 3 = 90`. Presupuesto pendiente de contrastar con el ritmo real de aula. Imports, tipos y estructura visual se entregan como soporte dentro del coding; no se escriben todos los archivos desde cero.

## Guion de presentación

| Momento | Título provisional | Contenido | Recurso o nota |
| --- | --- | --- | --- |
| Apertura | Dos páginas, una intención | Árbol de `PublicLayout`; comparación con sesión 06. | Preguntar dónde viviría un `useState` compartido. |
| Propiedad | Global no significa todo | Zustand guarda tipo e ID; otras herramientas conservan sus estados. | Tabla de propietarios. |
| Forma válida | `null` o tipo e ID completos | Derivar `opened` evita modal abierto sin medio. | Tachado de `opened: true + selection: null`. |
| Contrato | El catálogo aporta tipo e ID; la persona completa campos | Separar campos editables de los datos del catálogo y del usuario. | Diagrama de convergencia. |
| Schema | Regla ejecutable y tipo inferido | `z.enum`, máximo de notes y `z.infer`. | Snippet breve. |
| Formulario | Values, errores y submit | Explicar `mode`, `initialValues`, `validate`, resolver y `sync`, blur y `onValuesChange`; conectar `form.key`, `getInputProps` y `onSubmit`. | Escribir → salir del campo → enviar → preparar body → editar y retirar preview. |
| Reinicio | Cerrar termina una sesión | Render condicional y key reemplazan un Effect de reset. | Árbol montar/desmontar. |
| Cierre | Body preparado, no guardado | Preview local y ausencia de POST de creación. | Network junto al JSON. |

Preguntas de cierre:

1. ¿Qué combinación inválida evita una selección nullable?
2. ¿Por qué el store no conserva values o DTO?
3. ¿Dónde cambia `""` a `null`?
4. ¿Qué evidencia falta para afirmar que el medio quedó guardado?

## Trabajo con agente

La persona escribe primero el adapter y esta matriz:

1. conserva tipo, ID, estado y prioridad;
2. añade `source: "catalog"`;
3. `""` produce `null`;
4. espacios producen `null`;
5. texto con espacios se recorta.

El agente solo puede crear:

```text
src/adapters/__tests__/media-log-form-to-create-body.test.ts
```

Todo fixture o helper exclusivo de esa suite debe vivir dentro de `src/adapters/__tests__/`. La invocación de `ahk-test` aparece en las guías.

## Dependencia siguiente

La sesión 12 aplicará el patrón de Mantine Form y Zod aprendido aquí para construir Login y Registro y conectarlos con Firebase Email/Password. Añadirá `AuthProvider`, rutas privadas y cliente autenticado.

Esta sesión no crea formularios de autenticación, variables Firebase, token, guardia, submit remoto o rutas privadas.

## Fuera de alcance

- Firebase, Login, Registro y autenticación.
- `useMutation`, POST de creación, invalidaciones y feedback remoto.
- Guardar DTO, formulario, body o `opened` en Zustand.
- Persistencia, middleware, slices, `useShallow` o Devtools de Zustand.
- Rama manual del endpoint.
- Abstracción compartida para create/edit.
- Ruta `/app/library/new`.
- Effects para abrir, cerrar, transformar o resetear.

## Cambios retrospectivos aprobados

- Todos los tests y su soporte exclusivo pasan a `__tests__/` en reglas y guías existentes.
- La sesión 10 no requiere cambios de checkpoint.
- La sesión 07 conserva sus values canónicos; el body aparece ahora con su primer consumidor.
- La frontera de la sesión 12 se aclara en `rules/course-architecture.md`.
