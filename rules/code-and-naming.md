# Reglas de código y naming

## Gestor de paquetes

La cohorte usa pnpm `11.17.0` en comandos, ejemplos y proyectos semilla.

```bash
pnpm install
pnpm dev
pnpm build
```

- No mezcles npm, Yarn o Bun dentro del mismo proyecto.
- Conserva `pnpm-lock.yaml`.
- Fija `"packageManager": "pnpm@11.17.0"` cuando se cree el repositorio del proyecto.
- Explica que pnpm ofrece instalaciones estrictas y control de scripts; no lo presentes como garantía total de seguridad.
- El docente revisará las dependencias que soliciten ejecutar scripts de instalación antes de aprobarlas.
- Antes de otra cohorte, el docente vuelve a verificar la versión estable, su compatibilidad con Node y los cambios de lockfile. No actualiza el gestor durante una cohorte iniciada sin propagar y comprobar el cambio en todos los checkpoints.

La única excepción aprobada es la instalación global del CLI de Agent Harness Kit:

```bash
npm install --global @cardor/agent-harness-kit@2.11.0
```

Ese ejemplo corresponde a la sesión 07. Para las consignas de `Projects/`, la misma excepción global usa `@cardor/agent-harness-kit@3.0.0`, según [project-deliverables.md](project-deliverables.md); no cambia el gestor ni el lockfile del frontend.

`npm` se usa aquí porque el binario `ahk` pertenece al entorno de desarrollo global. No se ejecuta `npm install` dentro del proyecto, no se crea `package-lock.json` y las dependencias del frontend continúan administradas con pnpm. Después de instalar, las guías invocan `ahk` directamente y comprueban `command -v ahk` y `ahk --version`; en PowerShell usan `Get-Command ahk`.

## Legibilidad del código didáctico

Decisión aprobada el 3 de octubre de 2026. Aplica a nuevos ejemplos y futuras revisiones de guías, presentaciones y animaciones:

- Separa las acciones y bloques de una función con una línea en blanco. Deja espacio antes de un `if` y entre la validación y la acción siguiente.
- Usa llaves y cuerpos en varias líneas para condiciones; evita comprimir `if (...) return ...` en una sola línea.
- Evita ternarios anidados o encadenados. Cuando hay varias condiciones, declara una función con ramas explícitas `if / else if / else`, o con retornos tempranos separados. Un ternario simple y `??` siguen siendo válidos cuando facilitan la lectura.
- Expande el JSX: atributos largos en líneas propias, apertura y cierre claros, y líneas en blanco entre grupos de elementos hermanos. Despliega `map` y el elemento que devuelve en varias líneas.
- Conserva comentarios cortos de sección; no sustituyas el espaciado por más comentarios.

Ejemplo:

```jsx
function getMessage() {

  if (query.isLoading) {
    return 'Cargando'
  }

  if (query.isError) {
    return 'No pudimos buscar'
  }

  return 'Resultados'
}
```

En animaciones que muestran archivos completos, usa scroll dentro del panel si el código espaciado supera su altura. Conserva la fuente y la altura del lienzo; lleva las líneas del paso a la vista sin impedir el desplazamiento manual. Esta excepción no cambia la regla de snippets breves sin scroll en diapositivas.

## Archivos y carpetas

- Usa `kebab-case` para archivos y carpetas creados por el curso.
- Usa extensión `.tsx` cuando el archivo contenga JSX.
- Usa extensión `.ts` para tipos, adaptadores y funciones sin JSX.
- Mantén nombres que describan una responsabilidad visible.

Ejemplos:

```text
src/
├── adapters/
│   ├── media-catalog-to-detail.ts
│   └── media-search-to-card.ts
├── components/
│   ├── app-header.tsx
│   ├── media-card.tsx
│   └── media-grid.tsx
├── api/
│   └── media.ts
├── hooks/
│   ├── media-keys.ts
│   └── features/
│       └── use-media.ts
├── layouts/
│   └── public-layout.tsx
├── pages/
│   ├── media-detail-page.tsx
│   ├── not-found-page.tsx
│   └── search-page.tsx
├── stores/
│   └── create-media-log-modal-store.ts
├── types/
│   ├── media-api.ts
│   ├── media-detail.ts
│   ├── media-search-card.ts
│   └── media.ts
├── App.tsx
└── main.tsx
```

`App.tsx` y `main.tsx` conservan los nombres generados por Vite mientras el curso use esa plantilla.

### Páginas y layouts

Cuando React Router aparezca:

- Una **página** es el componente asociado a una ruta. Compone componentes de la feature, representa estados propios de esa pantalla y vive en `src/pages/`.
- Un **layout** conserva estructura compartida entre rutas hijas. Vive en `src/layouts/` y renderiza `Outlet` en la posición donde debe aparecer la hija activa.
- `App.tsx` declara el árbol de rutas y evita recuperar dentro de sí toda la implementación visual que ya pertenece a una página.

Usa archivos en `kebab-case` y componentes en `PascalCase`: `search-page.tsx` exporta `SearchPage` y `public-layout.tsx` exporta `PublicLayout`.

Estas carpetas son una convención pedagógica del proyecto, no un requisito de React. No conviertas cada componente grande en página ni uses una página como componente visual reutilizable solo por su ubicación.

### Estados visuales compartidos

Desde la sesión 10, `src/components/page-state.tsx` exporta `PageState` para estados completos de página. Su prop `variant` acepta `loading`, `error`, `invalid` o `unavailable` y aporta copy visual predeterminado. `title` y `description` permiten precisar el contexto sin crear otro componente.

La página o layout conserva la decisión sobre qué estado existe. También conserva la query o acción y puede entregar `onRetry: () => void`. `PageState` muestra **Reintentar** únicamente para `error` o `unavailable` cuando recibe ese callback; no importa Router, TanStack Query, fetchers, DTOs o modelos del dominio.

`EmptyState` continúa representando una colección válida sin elementos. Un `Alert` local continúa siendo adecuado cuando falla solo una parte y todavía existe contenido útil, por ejemplo datos personales disponibles aunque falte catálogo. No reemplaces toda la pantalla con `PageState` en ese caso.

## Identificadores

- Componentes: `PascalCase`, por ejemplo `AppHeader`.
- Hooks: prefijo `use`, por ejemplo `useMediaSearch`.
- Tipos: `PascalCase`, por ejemplo `MediaSearchItemDto`.
- Funciones y variables: `camelCase`.
- Constantes compartidas: `SCREAMING_SNAKE_CASE` cuando representan una configuración fija.
- Adaptadores: nombre `origen-to-destino.ts` para el archivo y verbo `to` en la función, por ejemplo `media-search-to-card.ts` y `toMediaSearchCardModel`.

Usa nombres cortos que conserven la transformación reconocible. El adapter de identidad de catálogo a parámetros URL se llama `media-input-to-params.ts`; exporta `toMediaDetailSearchParams`. Su test vive en `__tests__/media-input-to-params.test.ts` e importa la función desde `../media-input-to-params`.

Los sufijos también comunican fronteras:

- `Dto` para una forma de transporte conservada desde la API.
- `Model` para una forma preparada para una responsabilidad de la aplicación.

No uses esos sufijos para ocultar la misma forma duplicada. Crea un modelo visual cuando exista una diferencia real de nombres, nulabilidad, contenido o responsabilidad.

Cuando una unión cerrada represente values transportados por la API y también alimente un schema, declara su arreglo `as const` y su tipo derivado junto al contrato de transporte. El schema importa esos values; el archivo de tipos API no depende de una carpeta de formularios. Conserva los labels traducidos en constantes de interfaz separadas.

Desde la sesión 11, una forma de datos propia que cruce una frontera o represente un conjunto cerrado se declara primero como schema Zod y deriva su tipo con `z.infer`. Muestra siempre la cadena completa: definición del schema, tipo inferido y consumidor. Solo atribuye validación runtime cuando el flujo ejecuta `parse`, `safeParse` o un resolver que evalúa el schema.

Esta regla no convierte contratos de comportamiento en schemas. Props, callbacks, funciones genéricas, `RequestInit` y objetos externos de un SDK permanecen tipados con TypeScript. Cuando la aplicación necesita parte de un objeto externo, proyecta los campos propios que consume y valida esa proyección. No uses un cast como sustituto de validación ni `z.custom<T>()` sin un predicado que compruebe realmente `T`.

Los tipos de transporte introducidos antes de Zod conservan su ubicación. Cuando uno de sus conjuntos cerrados necesite alimentar un schema, sustituye una unión literal directa por values `as const` equivalentes en el archivo canónico y deriva allí el tipo; el schema importa esos values sin abrir otra lista.

### Hooks por entidad y caso de uso

Desde la sesión 08, los hooks de Media se exportan desde `src/hooks/features/use-media.ts`. Cada función representa un caso de uso: buscar, consultar detalle, listar, crear, editar o eliminar. Se añade cada función cuando aparece su necesidad en el curso; no se prepara un hook universal con modos ni se declaran funciones vacías para sesiones futuras.


`src/hooks/media-keys.ts` conserva las keys y los planes de familias asociados a Media. Los fetchers permanecen en `src/api/media.ts`. El helper transversal de invalidación que aparece en la sesión 16 conserva `src/hooks/invalidation-utils.ts`.

Desde `features/use-media.ts`, los imports de API y tipos usan `../../api/` y `../../types/`; las keys usan `../media-keys`. Una página o componente bajo `src/pages/` o `src/components/` importa los hooks desde `../hooks/features/use-media`.

La agrupación por entidad es una convención del curso, no un requisito de React. Un hook por caso de uso concentra parámetros, key, fetcher y condiciones; el componente lo invoca y representa el resultado. Puede probarse separadamente con el entorno necesario, pero extraerlo no demuestra que esté probado ni impide probar la lógica a través del componente. El curso conserva sus tests puros y comprobaciones manuales mientras no apruebe otra infraestructura.

### Objeto de datos de una tarjeta

Desde la sesión 02, una tarjeta que recibe el objeto completo que representa usa la prop `data`. El nombre del componente ya identifica su responsabilidad; el contrato tipado describe la forma del dato.

```tsx
type MediaCardProps = {
  data: MediaItem
}

function MediaCard({ data }: MediaCardProps) {
  return <article>{data.title}</article>
}

// Dentro del recorrido del padre, media es la variable local del map.
items.map((media) => <MediaCard key={media.id} data={media} />)
```

Propaga el nombre por la definición, destructuración, accesos internos, JSX y explicaciones. Dentro de la tarjeta se usa `data.id`; el padre puede conservar `media.id` como key. La convención no renombra colecciones (`items`), identidades (`identity`), campos individuales (`title`, `mediaType`) ni callbacks (`onSelect`). Tampoco cambia automáticamente el contrato de un componente de detalle o de un formulario.

### Stores de Zustand

Nombra el store por la responsabilidad concreta y no por una categoría genérica. `create-media-log-modal-store.ts` exporta `useCreateMediaLogModalStore`; evita nombres como `ui-store.ts` o `global-store.ts` que no explican qué coordinan.

El nombre no amplía el alcance del store. En esta cohorte, `useCreateMediaLogModalStore` conserva solo selección y acciones de apertura y cierre. Los valores del formulario, DTOs, sesión y estado remoto pertenecen a otras capas.

### Tests

Los tests viven dentro de una carpeta `__tests__/` ubicada junto al archivo o grupo pequeño que verifican. Ningún archivo `.test.ts`, `.test.tsx`, `.spec.ts` o `.spec.tsx` queda suelto entre archivos de producción.

```text
src/adapters/media-search-to-card.ts
src/adapters/__tests__/media-search-to-card.test.ts
```

Los fixtures, builders, factories, mocks, stubs, snapshots y helpers que existen únicamente para pruebas viven también dentro del árbol `__tests__/`. Cuando varios tests del mismo módulo los comparten, usa una subcarpeta descriptiva:

```text
src/adapters/
├── media-search-to-card.ts
└── __tests__/
    ├── media-search-to-card.test.ts
    └── fixtures/
        └── media-search-items.ts
```

No muevas a `__tests__/` fixtures que forman parte de la aplicación, una demostración o un seed visible; esta regla cubre solo soporte exclusivo de pruebas. El nombre del caso describe comportamiento observable. La ubicación y el sufijo no cambian cuando el test fue redactado con ayuda de un agente.

## Abstracciones

Extrae un componente cuando tenga una responsabilidad reconocible, se reutilice o reduzca una sección que impida leer al componente padre.

No extraigas un elemento pequeño solo para practicar creación de archivos. La clase 01 no crea `SectionTitle` ni un `PageContainer` con `children`; esos componentes no resuelven una necesidad del checkpoint.

### Recorridos y keys

El componente que ejecuta un `map` conserva la key en el elemento JSX que ese recorrido devuelve directamente. Si la responsabilidad del recorrido se mueve a otro componente, el `map` y la key se mueven juntos.

```tsx
items.map((item) => <MediaCard key={item.id} data={item} />)
```

No coloques la key dentro de `MediaCard` ni la declares como una prop normal del componente. React la consume para identificar elementos hermanos. Usa una identidad estable del dato cuando el contrato ya la proporciona; no generes una key durante el render.

## Decisiones todavía no generales

El curso no ha fijado una regla global sobre exports por defecto frente a exports nombrados. Evalúa esa convención cuando aparezca un caso suficiente y regístrala después de aprobación.
