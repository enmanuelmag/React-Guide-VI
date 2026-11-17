# Sesión 14 · Detalle privado e identidades

> Estado: paquete textual aprobado definitivamente. La presentación visual y el proyecto progresivo o seed ejecutable permanecen pendientes de sus frentes correspondientes.

- **Fecha:** lunes 26 de octubre de 2026
- **Semana:** 6
- **Modalidad:** virtual
- **Duración:** 90 minutos
- **Lectura previa:** [pre-class-reading.md](pre-class-reading.md)
- **Guía docente:** [teacher-guide.md](teacher-guide.md)
- **Guía estudiantil:** [student-guide.md](student-guide.md)
- **Seed propuesto:** `s06-c14-private-detail-identities-seed`

## Archivo de hooks de esta sesión

Modifica `useMediaDetail` para aceptar el selector discriminado; conserva los demás hooks. Todas estas funciones se definen en `src/hooks/features/use-media.ts`. Las keys y los planes de familias se mantienen en `src/hooks/media-keys.ts`, importado desde `../media-keys`. Las páginas y componentes importan los hooks desde `../hooks/features/use-media`.

## Punto de entrada

La sesión parte del checkpoint completo de la sesión 13:

- Firebase Auth restaura `checking`, `anonymous` o `authenticated`.
- `PrivateLayout` protege `/app/library`.
- `requestJsonWithOptionalAuth<T>` enriquece búsqueda y detalle cuando existe sesión.
- Las keys públicas dependientes de sesión contienen `authScope`.
- `requestJsonWithAuth<T>` obtiene el token en el momento del request privado.
- `/app/library` consulta la primera lista privada y representa carga, error, vacío y éxito.
- `LibraryMediaListItemModel` conserva `logId`, status, prioridad y fecha preparada.
- Cada fila usa `logId` como key estable, pero todavía no navega a un detalle.
- `MediaCatalogDetailDto`, `GetMediaDetailInput`, `UserMediaDataDto` y `MediaDetailDto` conservan sus definiciones completas en `src/types/media-api.ts` desde la sesión 07.
- `MediaDetailDto` ya transporta `catalog`, `entry` e `isLogged`; la interfaz pública todavía no representa `entry`.
- `CreateMediaLogForm` ya tiene props, traductor de error y consumidor completos después del ajuste retrospectivo C07-A de la sesión 13.
- Vitest funciona en Node y todos los tests y su soporte exclusivo viven dentro de `__tests__/`.

El seed no declara `/app/library/:logId`, no añade un selector discriminado y no contiene una página privada de detalle.

## Limitación visible

La biblioteca ya muestra registros personales, pero una fila no puede abrirse ni recargarse mediante una URL propia:

```text
/app/library
  → fila con logId
  → sin destino
```

Reutilizar `externalId` tampoco resuelve el problema. Ese valor identifica una obra del catálogo; `logId` identifica el registro que contiene status, prioridad y notas de una persona.

```text
/media/movie/438631
  → identidad pública: mediaType + externalId

/app/library/cm123
  → identidad privada: logId
```

Los dos recorridos consultan el mismo endpoint y reciben el mismo DTO raíz, pero expresan preguntas distintas y no comparten el mismo requisito de autenticación.

## Resultado de aprendizaje

El estudiante distinguirá identidad de catálogo e identidad de registro, modelará ambas mediante una unión discriminada y conectará una ruta privada por `logId` que componga metadata de catálogo con status, prioridad y notas sin duplicar estado remoto.

## Checkpoint de salida

Al terminar:

- `MediaDetailSelector` solo permite una rama `catalog` completa o una rama `log` completa.
- `mediaKeys.detail` incluye el selector completo y `authScope`.
- `getMediaDetail` construye query params según `selector.kind`.
- La rama `catalog` usa autenticación opcional y la rama `log` exige autenticación.
- `useMediaDetail` acepta `MediaDetailSelector | null`, conserva el orden de hooks y no solicita datos con un selector inválido.
- `MediaDetailPage` adapta su identidad pública a la nueva rama sin cambiar el body de creación.
- `/app/library/:logId` queda declarada dentro del layout privado.
- Un adapter puro convierte el parámetro externo en `MediaDetailSelector | null`.
- `PrivateMediaDetailPage` representa URL inválida, primera carga, error, `entry: null` y éxito.
- La página reutiliza `PageState` para los cuatro estados de página y conserva un `Alert` local cuando solo falta `catalog` pero existen datos personales útiles.
- `401` se muestra localmente sin logout automático.
- `404` usa un mensaje neutral para no distinguir entre un id inexistente y uno ajeno.
- `toSavedMediaDetailsModel` prepara labels de status y prioridad sin mezclar metadata de catálogo.
- `SavedMediaDetailsProps` y `SavedMediaDetails` tienen una referencia completa con imports y muestran status, prioridad y notas.
- `catalog: null` conserva los datos personales disponibles sin inventar poster, descripción o fecha.
- `MediaDetailContent` y `MediaDocumentTitle` continúan representando la rama de catálogo.
- `PrivateMediaDetailPage` conserva una referencia final con imports, helper anterior a su uso, guards, adapters y consumidores visibles.
- La fila de biblioteca añade una acción que enlaza mediante `data.logId` y no transporta el DTO mediante `location.state`.
- La página ofrece regreso explícito a `/app/library`.
- El test dirigido del adapter y `pnpm build` terminan con código 0 en el seed ejecutable.

El test demuestra únicamente la transformación pura del parámetro. Network, Query Devtools y el navegador demuestran por separado request, key, autenticación y navegación observados.

## Concepto principal

La sesión expresa dos identidades válidas con un schema y deriva el tipo que consumen key, fetcher y hook. El checkpoint de la sesión 13 ya dejó values canónicos equivalentes en `src/types/media-item.ts`:

```ts
export const MEDIA_TYPE_VALUES = ["movie", "series"] as const
export type MediaType = (typeof MEDIA_TYPE_VALUES)[number]
```

La sesión 14 los reutiliza en `src/schemas/media-detail.ts`:

```ts
import { z } from "zod/v4"

import { MEDIA_TYPE_VALUES } from "../types/media-item"

export const mediaDetailSelectorSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("catalog"),
    mediaType: z.enum(MEDIA_TYPE_VALUES),
    externalId: z.string().trim().min(1),
  }),
  z.object({
    kind: z.literal("log"),
    logId: z.string().trim().min(1),
  }),
])

export type MediaDetailSelector = z.infer<typeof mediaDetailSelectorSchema>
```

El discriminante `kind` permite hacer narrowing y evita objetos incompletos:

```text
selector catalog
  → mediaType + externalId
  → optional auth

selector log
  → logId
  → required auth
```

La ruta privada sigue el recorrido completo:

```text
URL /app/library/:logId
  → adapter de parámetro
  → selector log
  → key(selector, authScope)
  → GET detail con Bearer
  → MediaDetailDto
  ├── catalog → adapter existente → MediaDetailContent
  └── entry → adapter personal → SavedMediaDetails
```

## Vocabulario

- **Identidad de catálogo:** combinación `mediaType + externalId` que identifica una obra.
- **Identidad de registro:** `logId` que identifica una entrada personal.
- **Unión discriminada:** unión cuyos miembros comparten un campo literal que permite distinguirlos.
- **Discriminante:** campo literal, como `kind`, usado para seleccionar una rama del tipo.
- **Narrowing:** reducción de un tipo amplio después de comprobar una condición.
- **Estado imposible:** combinación que el dominio no acepta y que el tipo impide construir.
- **Selector:** valor que expresa cuál identidad debe consultar el fetcher.
- **Scope de caché:** valor que separa respuestas por sesión; no es una credencial.
- **Valor centinela:** valor interno usado para declarar una query mientras permanece deshabilitada; no representa un recurso real.
- **Fallback:** salida explícita cuando una rama nullable no está disponible.
- **Enumeración de recursos:** filtración de existencia o pertenencia causada por mensajes distintos para ids ajenos e inexistentes.

## Decisiones técnicas

### Un selector y un DTO raíz

No se crean hooks completos separados para catálogo y log. El endpoint, el DTO raíz y los estados remotos son compartidos. `kind` conserva la diferencia de identidad y autenticación.

Tampoco se usa un objeto con `externalId`, `mediaType` y `logId` opcionales. Esa forma permitiría una identidad incompleta o ambas identidades a la vez.

### Key y autenticación

La key incluye todas las variables que cambian la respuesta:

```ts
detail: (selector: MediaDetailSelector, authScope: string) =>
  [...mediaKeys.details(), selector, authScope] as const
```

`authScope` separa la caché. La rama del selector decide qué helper HTTP se usa:

```ts
return selector.kind === "log"
  ? requestJsonWithAuth<MediaDetailDto>(url)
  : requestJsonWithOptionalAuth<MediaDetailDto>(url)
```

No se coloca el token, el email ni el objeto Firebase `User` dentro de la key.

### Parámetro externo y orden de hooks

`useParams` entrega un valor externo. `toLibraryLogDetailSelector` ejecuta el schema antes de devolver una rama `log`:

```ts
import {
  mediaDetailSelectorSchema,
  type MediaDetailSelector,
} from "../schemas/media-detail"

export function toLibraryLogDetailSelector(
  logId: string | undefined,
): MediaDetailSelector | null {
  const result = mediaDetailSelectorSchema.safeParse({ kind: "log", logId })

  return result.success ? result.data : null
}
```

`safeParse` rechaza `undefined`, vacío o espacios y devuelve el id recortado cuando es válido. La página llama `useMediaDetail(selector)` antes de cualquier retorno condicional. El patrón `enabled` aprendido en la sesión 10 impide una request inválida.

### DTO y composición visual

TanStack Query conserva el `MediaDetailDto` definido en la sesión 07. La página deriva dos modelos durante el render:

```text
catalog → mediaCatalogDetailToModel → MediaDetailContent
entry   → toSavedMediaDetailsModel → SavedMediaDetails
```

`MediaDetailContent` no recibe `entry`. `SavedMediaDetails` no recibe metadata de catálogo. La página compone ambos bloques.

### Estados parciales y errores

La página distingue:

1. selector inválido;
2. primera carga real;
3. error HTTP o de red;
4. respuesta sin `entry`;
5. éxito con catálogo;
6. éxito personal con `catalog: null`.

`entry: null` no se silencia con una assertion. `catalog: null` muestra un aviso y conserva título, status, prioridad y notas desde `entry`.

`PageState` conserva la presentación compartida introducida en la sesión 10. La página sobrescribe el copy cuando necesita contexto privado y entrega `detailQuery.refetch()` en `error` o `entry: null`. Si `entry` existe y solo falta `catalog`, la página no reemplaza todo el contenido: mantiene un `Alert` junto a `SavedMediaDetails`.

Un `401` no destruye la sesión. Un `404` usa el mismo copy para un log inexistente o no visible para la persona.

## Secuencia · 90 minutos

| Tiempo | Responsable | Actividad | Evidencia |
| ---: | --- | --- | --- |
| 0–10 | Docente y grupo | Recuperar `logId`, contrastar las dos identidades y formular la pregunta de cada ruta. | El grupo clasifica ejemplos como catálogo o registro. |
| 10–22 | Construcción guiada | Crear `mediaDetailSelectorSchema`, derivar `MediaDetailSelector`, comparar estados válidos e inválidos y hacer narrowing con `kind`. | El schema acepta solo dos ramas completas y el tipo inferido habilita narrowing. |
| 22–38 | Docente con participación | Refactorizar `mediaKeys.detail`, `getMediaDetail` y `useMediaDetail`. | Devtools separa selector y scope; cada rama elige el helper correcto. |
| 38–48 | Estudiantes con guía | Adaptar `MediaDetailPage` y comprobar el recorrido público autenticado y anónimo. | Búsqueda y detalle público no presentan regresión. |
| 48–60 | Construcción interactiva | Declarar la ruta privada, crear el adapter del parámetro y ordenar `PageState` para URL inválida, carga y error. | `/app/library/:logId` produce una query privada válida y estados explícitos. |
| 60–72 | Actividad estudiantil | Crear modelo, adapter y `SavedMediaDetails`; componer `entry` y catálogo nullable. | La página muestra datos personales sin copiar el DTO. |
| 72–79 | Docente y grupo | Enlazar la fila, recargar la URL y comprobar `401`, `404` y fallback sin catálogo. | URL, Network y mensajes corresponden al mismo `logId`. |
| 79–87 | Trabajo asistido | Entregar al agente solo la suite del adapter, revisar el diff y ejecutar el test dirigido. | Todo soporte de prueba queda dentro de `__tests__/` y la suite sale verde. |
| 87–90 | Docente y grupo | Ejecutar build, registrar la frontera de evidencia y abrir la sesión 15. | Build con código 0 y edición identificada como siguiente dependencia. |

**Comprobación:** `10 + 12 + 16 + 10 + 12 + 12 + 7 + 8 + 3 = 90`.

## Guion de presentación

| Momento | Título provisional | Contenido que debe conservarse | Recurso o nota docente |
| --- | --- | --- | --- |
| Apertura | La fila ya tiene identidad | Recuperar `DTO.id → model.logId`; todavía no existe una URL propia. | Señalar una fila real del checkpoint 13. |
| Contraste | Obra y registro responden preguntas distintas | Dos personas comparten catálogo y conservan logs distintos. | Catálogo central con dos registros personales. |
| Rutas | Dos URLs, dos selectores | La pública usa `mediaType + externalId`; la privada usa `logId`. | Colorear cada identidad sin llamar `logId` id de película. |
| Schema y tipo | `kind` expresa estados válidos | Comparar el schema discriminado y su tipo inferido con tres propiedades opcionales. | Cadena schema → `z.infer` → `safeParse`; dos tarjetas válidas y tres combinaciones tachadas. |
| Caché | La key describe la consulta completa | Selector y `authScope` identifican respuestas distintas. | Árbol de keys en Query Devtools. |
| Seguridad | Scope identifica; Bearer autoriza | La rama log exige sesión aunque el endpoint también sirva catálogo público. | Dos capas: caché local y request HTTP. |
| Router | Los params son entrada externa | Normalizar, construir selector nullable y llamar el hook antes de retornar. | Recuperar el orden de hooks de la sesión 10. |
| Composición | Catálogo y datos personales tienen componentes propios | Reutilizar contenido público y añadir un bloque personal. | Diagrama de dos adapters y una página. |
| Nulabilidad | Un `200` puede contener ramas nulas | `entry: null` y `catalog: null` reciben salidas distintas. | Matriz de estados sin assertions. |
| Privacidad | El `404` no explica pertenencia | Un mensaje neutral evita enumerar registros. | Comparar copies seguros e inseguros. |
| Agente | La persona define el oráculo | El agente redacta solo el test del adapter dentro de `__tests__/`. | Caja con objetivo, límites, lectura y evidencia. |
| Cierre | Leer queda completo | La siguiente sesión reutiliza los campos y añade `PUT`. | CRUD con lectura marcada y edición atenuada. |

Preguntas de cierre:

1. ¿Qué identifica `externalId` y qué identifica `logId`?
2. ¿Qué estados inválidos elimina `kind`?
3. ¿Por qué la key necesita selector y `authScope`?
4. ¿Qué rama exige Bearer?
5. ¿Qué responsabilidad comienza en la sesión 15?

## Proyecto semilla

### Incluye

- Checkpoint completo de la sesión 13.
- Biblioteca con `logId` en el modelo visual.
- Detalle público con optional auth y `authScope`.
- `MediaDetailDto` con `catalog`, `entry` e `isLogged`.
- `CreateMediaLogForm` remoto con props, error y cierre posterior a invalidaciones explícitos.
- Labels compartidos de status y prioridad.
- `MediaDetailContent`, `MediaDocumentTitle` y adapters públicos existentes.
- `PageState` para estados completos y `EmptyState` reservado para colecciones vacías.
- Vitest, scripts y tests anteriores dentro de `__tests__/`.

### No incluye

- `MediaDetailSelector`.
- Key, fetcher o hook adaptados al selector.
- Ruta `/app/library/:logId`.
- Adapter del parámetro privado.
- `PrivateMediaDetailPage`.
- Modelo, adapter o componente de datos personales.
- Link desde la fila.
- Test nuevo.

## Trabajo con agente

La persona define e implementa `toLibraryLogDetailSelector` y acuerda estos comportamientos:

1. `undefined` produce `null`.
2. Un string vacío produce `null`.
3. Un string compuesto por espacios produce `null`.
4. Un id válido produce `{ kind: "log", logId }`.

El agente solo puede crear:

```text
src/adapters/__tests__/library-log-param-to-detail-selector.test.ts
```

Todo fixture, builder o helper exclusivo debe permanecer dentro de `src/adapters/__tests__/`. La invocación de `ahk-test` prohíbe modificar producción, configuración, dependencias u otros tests. El estudiante lee el archivo completo, revisa el diff y ejecuta la prueba.

## Fuera de alcance

- Extraer `MediaLogForm` o duplicar los campos de creación.
- Abrir un modal de edición.
- Implementar `PUT`, `DELETE`.
- Transportar DTOs mediante `location.state`.
- Guardar detalle, params o sesión en Zustand, Context o storage.
- Solicitar datos dentro de un Effect.
- Usar loaders, actions, Data Mode o TanStack Router.
- Introducir `skipToken` como concepto nuevo; se conserva el patrón `enabled` conocido.
- Construir entradas manuales, linking, drawer o cambio de backend.
- Añadir React Testing Library, jsdom, MSW o pruebas de componentes.

## Cambios retrospectivos

- `draft/index.md` se revisó: tema, actividad y checkpoint permanecen correctos, por lo que no necesita cambios.
- La sesión 13 recibe un ajuste retrospectivo mínimo: define las props y el traductor de `CreateMediaLogForm`, muestra su referencia remota final y conecta `onCreated` en el modal. La fila continúa sin enlace al cerrar esa sesión.
- La sesión 15 recibe `entry` y la página privada como punto de entrada; conserva formulario compartido y actualización como dificultad propia.
- `rules/course-architecture.md` ya contiene las decisiones reutilizables y no necesita cambios.
