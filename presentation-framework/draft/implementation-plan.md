# Plan de implementación del framework de presentaciones

> Estado: plan ejecutado y aprobado. La galería y el piloto de la sesión 01 superaron la revisión visual; el runtime fue promovido a `presentation-framework/approved/` y el deck a su carpeta canónica. La regeneración final de PNG y PDF queda bajo demanda mediante un solo comando.

## 1. Objetivo de esta iteración

Construir y comprobar el sistema mínimo que permita producir las 18 presentaciones sin copiar CSS o JavaScript entre sesiones.

La iteración termina cuando existan estas evidencias:

- una galería corta que demuestre las geometrías con mayor riesgo visual;
- una presentación completa de la sesión 01, usada también como piloto operativo y basada en su guion aprobado;
- preview local, PNG FHD por slide y PDF estudiantil reproducibles;
- notas docentes visibles en Presenter View y ausentes del PDF estudiantil;
- auditorías automáticas de overflow, assets, metadatos y límites del lienzo;
- revisión humana del navegador, los PNG y el PDF;
- una decisión explícita de promover o corregir el runtime candidato.

El plan no incluye todavía la producción de las otras 18 presentaciones ni la implementación completa de los 59 casos semánticos.

## 2. Decisión de arquitectura

### 2.1 Un solo proyecto de herramientas

El framework tendrá una sola instalación de dependencias, un solo `package.json` y un solo `pnpm-lock.yaml`. Los comandos recibirán la ruta del deck que deben servir, construir, capturar o exportar.

Cada presentación definitiva conservará su fuente en:

```text
course/<sesión>/presentation/
├── index.html
├── assets/
├── presentation.pdf
└── review/
    ├── audit.json
    └── slides/
```

`index.html`, los assets y las notas son fuente editable. `presentation.pdf`, `audit.json` y los PNG son artefactos regenerables. Los PNG de revisión no sustituyen al PDF ni convierten el contenido en imágenes.

Durante el piloto, el código candidato vivirá en `presentation-framework/draft/`. Solo se moverá a `presentation-framework/approved/` después de la revisión visual y la aprobación del usuario.

### 2.2 Consumo del framework

Cada deck usará HTML semántico de Reveal.js y cargará un único entrypoint del framework. Cuando el runtime quede aprobado, esa importación apuntará a `presentation-framework/approved/src/framework/deck.js`.

Los scripts usarán la API programática de Vite para tomar como `root` el directorio de la presentación solicitada, permitir el acceso al framework compartido y generar una salida independiente. Este diseño conserva la fuente junto a la sesión y evita crear 19 instalaciones o copiar estilos.

La implementación comprobará esta hipótesis en la galería antes de fijarla como contrato. Si Vite no conserva rutas y assets de forma portable, el fallback será empaquetar el runtime como un paquete local de pnpm. No se abrirá un workspace monorepo salvo que la prueba lo exija.

### 2.3 Contrato de autoría

Cada `<section>` declarará:

- un `data-slide-id` único;
- una geometría `G01`–`G18`;
- uno o más casos semánticos `S01`–`S59`;
- un título accesible, visible o disponible para lectores de pantalla;
- notas docentes opcionales dentro de `aside.notes`.

El HTML usará clases semánticas estables como `slide-title`, `split`, `code-panel`, `flow`, `comparison`, `evidence-caption` y `checkpoint`. Las presentaciones no dependerán de combinaciones libres de utilities de Tailwind. Tailwind compilará tokens, primitives y componentes del framework; el autor trabajará con el vocabulario del catálogo.

Esta decisión reduce variaciones accidentales y permite que la auditoría relacione cada slide con el catálogo aprobado.

## 3. Estructura candidata

```text
presentation-framework/
├── draft/
│   ├── implementation-plan.md
│   ├── decisions/
│   ├── gallery/
│   │   ├── index.html
│   │   └── artifacts/
│   ├── pilot-session-01/
│   │   ├── index.html
│   │   ├── assets/
│   │   └── artifacts/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── vite.config.js
│   ├── src/
│   │   ├── framework/
│   │   ├── layouts/
│   │   ├── components/
│   │   ├── examples/
│   │   └── styles/
│   ├── public/
│   │   └── assets/
│   └── scripts/
└── approved/
    └── ...
```

La implementación creará solo las carpetas que reciban archivos reales. Después de aprobar el piloto, `package.json`, el lockfile, la configuración, `src/`, `public/` y `scripts/` pasarán a `approved/`. La galería aprobada se conservará como referencia ejecutable. El piloto pasará a `course/01-react-jsx-y-proyecto/presentation/`.

## 4. Dependencias candidatas

Snapshot consultado en el registro de pnpm el 7 de septiembre de 2026:

| Paquete | Versión candidata | Función |
| --- | ---: | --- |
| `reveal.js` | `6.0.1` | Navegación, escala, fragments, notas y print view |
| `vite` | `8.2.2` | Servidor local y build por ruta |
| `tailwindcss` | `4.3.3` | Tokens y generación de CSS local |
| `@tailwindcss/vite` | `4.3.3` | Integración de Tailwind con Vite |
| `playwright` | `1.63.0` | Auditoría, capturas FHD y exportación PDF |
| `@fontsource/sora` | `5.3.0` | Tipografía display local |
| `@fontsource/ibm-plex-sans` | `5.3.0` | Tipografía de lectura local |
| `@fontsource/jetbrains-mono` | `5.3.0` | Tipografía de código local |

La implementación volverá a consultar las versiones antes de instalar y fijará versiones exactas. Vite 8 y Playwright requieren Node 20 o superior; el curso ya exige Node `>=22.22.0`, por lo que no se añade otra versión de Node.

No se añadirán Mermaid, GSAP, librerías de charts, React ni otro resaltador durante el piloto.

## 5. Fases de implementación

### Fase 0 · Guardrails y baseline

Archivos afectados:

- `presentation-framework/draft/implementation-plan.md`
- `presentation-framework/draft/README.md`
- `memories/presentation-framework-implementation.md`

Acciones:

1. Registrar las reglas y especificaciones consultadas.
2. Confirmar el estado del worktree y preservar cambios ajenos.
3. Verificar Node, pnpm, Chromium y Poppler sin instalar ni actualizar herramientas globales.
4. Registrar el snapshot de dependencias y los comandos exactos usados.
5. Definir los directorios generados que deben ignorarse y cuáles artefactos finales sí se conservarán.

Gate: no comenzar el scaffold si falta Node compatible, Chromium o una ruta de salida escribible. Poppler puede quedar como dependencia del entorno documentada, pero el PDF no se considera verificado sin `pdfinfo`, `pdftotext` y rasterización.

### Fase 1 · Scaffold reproducible

Archivos previstos:

- `presentation-framework/draft/package.json`
- `presentation-framework/draft/pnpm-lock.yaml`
- `presentation-framework/draft/vite.config.js`
- `presentation-framework/draft/src/framework/deck.js`
- `presentation-framework/draft/src/framework/options.js`
- `presentation-framework/draft/src/styles/main.css`

Acciones:

1. Inicializar el proyecto privado con pnpm y fijar las dependencias exactas.
2. Configurar Reveal.js con lienzo lógico `1920 × 1080`, hash, navegación, progreso, Highlight y Notes.
3. Configurar Vite para servir la galería y, mediante los scripts, cualquier deck pasado por ruta.
4. Definir una política única de fragments para PDF: mostrar el estado final en una sola página por slide con `pdfSeparateFragments: false`.
5. Mantener `showNotes: false` en la exportación estudiantil.

Comprobaciones:

```bash
pnpm install --frozen-lockfile
pnpm gallery:dev
pnpm gallery:build
```

Gate: una slide de smoke test debe abrir mediante Vite, navegar con teclado y generar un build sin requests externos. La fase 4 reemplazará esa prueba mínima con la galería revisable.

### Fase 2 · Tokens y primitives visuales

Archivos previstos:

- `src/styles/fonts.css`
- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/layouts.css`
- `src/styles/components.css`
- `src/styles/code.css`
- `src/styles/print.css`
- `src/layouts/layout-registry.js`
- `src/components/slide-chrome.js`

Acciones:

1. Cargar Sora, IBM Plex Sans y JetBrains Mono desde archivos locales.
2. Traducir la dirección Laboratorio claro a tokens CSS: fondos, azul `#223B8F`, tinta, grises, estados, escala de 8 px, zonas seguras y tipografía.
3. Implementar primero las geometrías necesarias para la galería mínima y reservar G11 para el árbol de la sesión 01.
4. Crear primitives para título, kicker, texto, código, imagen, caption, tabla, flujo, anotación, pregunta y checkpoint.
5. Construir diagramas con HTML y SVG plano.
6. Separar estilos de pantalla y print sin alterar la jerarquía del contenido.

La primera pasada no intentará implementar las 18 geometrías. La galería cubre G01, G02, G03, G04, G06, G08, G09, G10, G13, G15, G16, G17 y G18; el piloto 01 añadirá G11 para el árbol de componentes. Las geometrías restantes se completarán cuando una presentación detecte su necesidad.

Gate: cada primitive debe conservar contraste, zona segura y tamaño legible en una captura FHD sin zoom manual.

### Fase 3 · Assets y logos

Archivos previstos:

- `public/assets/brand/`
- `public/assets/logos/`
- `public/assets/assets.json`

Acciones:

1. Comparar el azul muestreado con cualquier archivo oficial disponible de ESPOL Bootcamp.
2. Guardar localmente el logo de marca y los logos oficiales de las tecnologías usadas en la galería y el piloto.
3. Preferir PNG transparente con resolución mínima de dos veces su tamaño renderizado.
4. Registrar para cada asset: nombre, fuente oficial, URL de origen, fecha de consulta, licencia o términos disponibles y uso previsto.
5. No cargar imágenes desde CDN durante preview, captura o PDF.

Para la sesión 01 se conservarán localmente, como mínimo, los logos oficiales de React, Vite, pnpm y TypeScript porque las cuatro tecnologías forman parte del contenido conceptual. Reveal.js y Tailwind pueden aparecer en la galería técnica, no dentro del contenido pedagógico de la sesión.

Gate: la auditoría debe detectar rutas rotas, dimensiones naturales iguales a cero, `alt` ausente y requests HTTP externos.

### Fase 4 · Galería mínima

Archivo principal:

- `presentation-framework/draft/gallery/index.html`

La galería tendrá entre ocho y diez slides. Usará contenido realista del curso y cubrirá:

1. portada con marca y logo oficial;
2. concepto con texto + visual;
3. comparación 50/50 y correcto/incorrecto sin depender del color;
4. tabla o matriz con densidad límite;
5. flujo horizontal con campos y verbos;
6. snippet breve en superficie clara;
7. código dominante en azul tinta con anotaciones;
8. galería de cinco estados de interfaz;
9. captura o mockup anotado con caption de evidencia;
10. pregunta con fragment y notas docentes.

Cada slide incluirá IDs de geometría y caso semántico. La galería probará título visible y oculto, imagen horizontal y vertical, tabla dividida, código corto y mediano, y la misma salida en pantalla y PDF.

Gate de revisión humana:

- lectura a pantalla completa;
- miniaturas distinguibles;
- jerarquía consistente;
- densidad baja o media;
- ningún logo ornamental;
- fragments comprensibles en PDF;
- notas privadas fuera del PDF.

### Fase 5 · Automatización de QA y exportación

Archivos previstos:

- `scripts/deck-context.mjs`
- `scripts/serve-deck.mjs`
- `scripts/build-deck.mjs`
- `scripts/audit-deck.mjs`
- `scripts/capture-deck.mjs`
- `scripts/export-pdf.mjs`

Contrato de comandos:

```bash
pnpm deck:dev -- --deck <ruta>
pnpm deck:build -- --deck <ruta>
pnpm deck:audit -- --deck <ruta>
pnpm deck:capture -- --deck <ruta>
pnpm deck:pdf -- --deck <ruta>
pnpm deck:verify -- --deck <ruta>
```

`deck:verify` ejecutará build, auditoría, capturas y PDF en ese orden. Cada script fallará con código distinto de cero y un mensaje que identifique slide y selector cuando encuentre un problema.

La auditoría comprobará:

- IDs únicos y geometrías/casos conocidos;
- dimensiones y overflow de cada slide, incluido el contenido interno de cada snippet después de activar la diapositiva;
- elementos fuera de las zonas seguras;
- imágenes completas, locales, con `alt` y resolución suficiente;
- fuentes cargadas mediante `document.fonts.ready`;
- tamaño mínimo de texto y código definido en la especificación;
- títulos accesibles;
- enlaces o requests externos inesperados;
- notas presentes en Presenter View y ocultas en la salida estudiantil.

La captura navegará a cada slide con la API de Reveal.js, esperará fuentes e imágenes y guardará un PNG de `1920 × 1080`.

La exportación abrirá `?print-pdf`, esperará a que Reveal construya todas las páginas de impresión, usará Chromium con fondos impresos y conservará una página por slide. La verificación posterior ejecutará:

```bash
pdfinfo presentation.pdf
pdftotext presentation.pdf -
pdftoppm -png -r 150 presentation.pdf review/pdf/page
```

Gate: el número de páginas debe coincidir con el número esperado de slides, el texto clave debe poder extraerse y la rasterización no debe mostrar recortes.

### Fase 6 · Presentación oficial y piloto operativo de la sesión 01

Fuentes obligatorias:

- `course/01-react-jsx-y-proyecto/session-draft.md`;
- `course/01-react-jsx-y-proyecto/teacher-guide.md`;
- punto de entrada de la sesión 01: carpeta de trabajo sin proyecto React;
- checkpoint de salida de la sesión 01 y punto de entrada de la sesión 02;
- reglas y especificaciones aprobadas del framework.

Archivo definitivo después de la aprobación:

- `course/01-react-jsx-y-proyecto/presentation/index.html`

El piloto tendrá una portada, las ocho slides de apertura aprobadas y un cierre conceptual:

| Slide | Contenido | Geometría/caso inicial |
| --- | --- | --- |
| 00 | Portada de la sesión | G02 · S02 |
| 01 | Medialog empieza con una tarjeta | G04 · S06/S46 |
| 02 | Cuatro herramientas, cuatro tareas | G08 · S17/S24 |
| 03 | Un componente representa una pieza | G05 · S13/S46 |
| 04 | Responsabilidad no significa fragmentar todo | G06 · S20/S22 |
| 05 | Declarar y usar no son la misma acción | G16 · S13/S41 |
| 06 | JSX tiene reglas concretas | G03 · S16/S45 |
| 07 | Del HTML raíz al árbol de React | G11 · S28/S30 |
| 08 | Transformación que haremos | G10 · S06/S23 |
| 09 | Checkpoint y límite de los datos fijos | G18 · S10/S53/S59 |

Cada slide cerrará con una pregunta o puente al editor. El deck podrá mostrar snippets breves y relaciones entre archivos, pero no entregará la implementación completa que el docente construirá. Props aparecerá solo como la necesidad que abre la sesión 02.

La apertura usará el mockup de Medialog como referencia conceptual, claramente rotulado como ilustración mientras no exista una captura ejecutada del checkpoint. Los logos de las cuatro herramientas serán assets locales con procedencia registrada.

Gate: revisar el deck completo en modo audiencia y Presenter View; después revisar los diez PNG y el PDF de diez páginas.

### Fase 7 · Corrección y promoción

Acciones:

1. Registrar cada hallazgo como defecto de contenido, layout, token, exportación o herramienta.
2. Corregir valores técnicos demostrados por la prueba, como line-height, tamaño mínimo de código o margen de impresión.
3. Solicitar nueva aprobación si el cambio afecta identidad, tipografía o color de marca.
4. Repetir `deck:verify` después de cada corrección material.
5. Presentar la galería y el piloto al usuario.
6. Promover el runtime solo después de su aprobación.
7. Mover el piloto aprobado a `course/01-react-jsx-y-proyecto/presentation/`; regenerar sus artefactos desde la ruta canónica cuando se necesiten con `pnpm session-01:generate`.
8. Actualizar `rules/presentations.md`, `ROADMAP.md`, `TASKS.md`, los README y la memoria de la iteración.

Gate final: el runtime aprobado debe reproducir el deck de la sesión 01 desde una instalación limpia con `pnpm install --frozen-lockfile` y los comandos documentados.

## 6. Orden de revisión con el usuario

La revisión se dividirá en tres entregas manejables:

1. **Galería mínima:** revisar sistema visual, código, diagramas, tablas, logos y notas.
2. **Sesión 01 en navegador:** revisar ritmo, cantidad de contenido y puentes al editor como piloto operativo.
3. **Artefactos:** revisar PNG y PDF, corregir divergencias y decidir la promoción.

No se completarán las geometrías restantes ni se iniciará otra sesión antes de cerrar esas tres entregas.

## 7. Criterios de aceptación

- Un solo lockfile reproduce herramientas y estilos.
- La galería y el piloto funcionan sin conexión después de instalar dependencias.
- Cada slide declara geometría y caso semántico.
- El lienzo lógico y cada PNG miden `1920 × 1080`.
- Ningún elemento sale de la zona segura o produce overflow.
- El PDF tiene una página por slide y conserva texto seleccionable cuando Chromium lo permite.
- El PDF estudiantil no contiene notas docentes.
- Presenter View muestra slide actual, siguiente, notas y reloj.
- Los logos provienen de fuentes oficiales, viven localmente y tienen procedencia registrada.
- La sesión 01 conserva sus ocho puntos de apertura, su frontera conceptual y la transición hacia props en la sesión 02.
- Una persona puede crear otra presentación leyendo la documentación, sin editar internals del framework.

## 8. Riesgos controlados

| Riesgo | Mitigación |
| --- | --- |
| Vite no empaqueta bien un deck externo | Probarlo antes de crear el piloto; usar paquete local pnpm como fallback |
| Tailwind elimina clases de sesiones externas | Usar clases semánticas compiladas en el framework; evitar utilities dinámicas en decks |
| Pantalla y PDF divergen | Estilos print explícitos, política única de fragments y revisión rasterizada |
| Fuentes o logos dependen de red | Assets locales y auditoría de requests externos |
| Un PNG se ve bien pero el PDF pierde texto o recorta | Verificar `pdfinfo`, `pdftotext`, rasterización y revisión humana |
| La galería crece antes de validar el sistema | Limitarla a los casos de mayor riesgo y completar el catálogo tras el piloto |
| El piloto adelanta la práctica | Derivar cada slide del guion 01 y conservar el código completo en las guías |

## 9. Fuentes técnicas verificadas

- Reveal.js: imports ES modules, plugins Notes/Highlight, lienzo configurable y print view mediante `?print-pdf`.
- Reveal.js: el motor de print emite `pdf-ready`, admite `showNotes` y controla fragments con `pdfSeparateFragments`.
- Vite 8: la API programática admite `root`, `base`, `outDir` e inputs HTML; `server.fs.allow` permite servir archivos compartidos fuera del root.
- Tailwind CSS 4: integración mediante `@tailwindcss/vite` y `@import "tailwindcss"`.
- Playwright: Chromium permite viewport fijo, screenshots y `page.pdf()`; la captura debe esperar `document.fonts.ready`.

Context7 se usó como fuente de documentación oficial. El índice Mintlify requerido por las reglas del repositorio no estuvo disponible en las herramientas de esta sesión; esta limitación debe permanecer registrada hasta que pueda repetirse la consulta.
