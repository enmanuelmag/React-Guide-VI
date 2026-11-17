# Catálogo aprobado de diapositivas y stack del framework

> Estado: catálogo, geometrías, estructura, stack, dirección visual, runtime, galería y piloto de la sesión 01 aprobados por el usuario el 7 de septiembre de 2026.

## 1. Tipos de diapositivas necesarios

### 1.1 Criterio de organización

El framework debe separar dos conceptos:

- **Caso semántico:** qué función cumple la diapositiva dentro de la explicación, por ejemplo comparar, predecir, recorrer un flujo o revisar evidencia.
- **Geometría:** cómo se distribuyen los contenedores, por ejemplo escenario único, dos columnas, matriz, timeline o bloque de código.

Una comparación y una explicación de responsabilidades pueden compartir la misma geometría de dos columnas sin convertirse en el mismo componente semántico. Esta separación evita crear una plantilla nueva por cada contenido y permite que todas las presentaciones conserven estructura sin verse repetitivas.

PowerPoint y Google Slides aplican una idea equivalente: un tema contiene layouts reutilizables y cada layout contiene posiciones previstas para títulos, texto, imágenes, tablas u otros recursos. Microsoft recomienda, además, varias alternativas realmente distintas para los casos frecuentes, no variaciones casi idénticas que no se distinguen al verlas como miniaturas.

Referencias:

- [Microsoft · What is a slide layout?](https://support.microsoft.com/en-us/PowerPoint/what-is-a-slide-layout)
- [Microsoft · Creating custom templates that work well with Designer](https://support.microsoft.com/en-us/powerpoint/creating-custom-templates-that-work-well-with-designer-in-powerpoint)
- [Google Slides · Theme, background and layout](https://support.google.com/docs/answer/1705254)

### 1.2 Geometrías base

Estas son las distribuciones estructurales que debe ofrecer la galería. No definen todavía estilo visual.

| ID | Geometría | Distribución de alto nivel | Usos principales |
| --- | --- | --- | --- |
| G01 | Centro único | Un mensaje o título dominante, con apoyo opcional breve | Portada, pregunta, frase clave, cierre |
| G02 | Centro + visual | Título o mensaje y una imagen, ilustración o símbolo dominante | Portada visual, analogía, separador |
| G03 | Encabezado + escenario | Título estable arriba y un área principal amplia | Código, diagrama, captura, tabla |
| G04 | Texto + visual 40/60 | Texto breve en un lado y recurso dominante en el otro | Concepto con imagen, definición con ejemplo |
| G05 | Visual + texto 60/40 | Recurso primero y explicación o conclusión al lado | Captura anotada, mockup, evidencia |
| G06 | Dos columnas simétricas | Dos áreas equivalentes con encabezados propios | Comparación, antes/después, correcto/incorrecto |
| G07 | Tres columnas | Tres áreas equivalentes o progresivas | CSR/SSR/SSG, herramienta/responsabilidad, tres estados |
| G08 | Cuadrícula | Cuatro o más casos breves en una matriz visual | Galería de estados, regresión, casos de prueba |
| G09 | Tabla o matriz | Filas y columnas con encabezados legibles | Contratos, compatibilidad, criterios, estados |
| G10 | Flujo horizontal | Nodos conectados de izquierda a derecha | Request/response, pipeline, transformación |
| G11 | Flujo vertical o árbol | Jerarquía o composición de arriba hacia abajo | Componentes, rutas, providers, archivos |
| G12 | Capas | Bandas o contenedores apilados | Browser/red/servidor, UI/estado/API, seguridad |
| G13 | Timeline | Secuencia temporal con hitos y cambios de estado | Eventos, caché, mutación, build/deploy |
| G14 | Ramas o estados | Punto de decisión y salidas diferenciadas | Carga/error/vacío/éxito, URL válida/inválida |
| G15 | Escenario de código | Código como contenido dominante | Snippet único, lectura guiada, comando |
| G16 | Código + apoyo | Código junto a explicación, diagrama o resultado | Anotación, contrato, efecto observable |
| G17 | Escenario visual completo | Imagen, captura o diagrama ocupa casi todo el lienzo | Mockup, inspección, analogía, mapa técnico |
| G18 | Instrucción o checklist | Acción, restricciones, tiempo y evidencia | Práctica, taller, demo, cierre verificable |

Las geometrías deben aceptar variaciones controladas de alineación y proporción. No deben permitir posicionamiento libre como mecanismo habitual, porque eso volvería a introducir decisiones improvisadas en cada sesión.

### 1.3 Catálogo semántico

#### A. Navegación y ritmo

| ID | Caso | Contenido mínimo | Forma de mostrarlo | Sesiones donde aparece |
| --- | --- | --- | --- | --- |
| S01 | Portada tipográfica | Nombre de sesión, tema y contexto mínimo | Mensaje dominante centrado; sin resumen del contenido | Todas |
| S02 | Portada con visual | Título más una imagen o diagrama que represente el problema | Composición G02; el visual no repite literalmente el título | 01, 06, 08, 09, 18, 19 |
| S03 | Mapa o agenda | Entre tres y seis bloques de la sesión | Lista numerada o recorrido; muestra secuencia, no detalle | Todas; especialmente presenciales |
| S04 | Separador de bloque | Nombre de una fase y transición breve | Centro único o centro + visual | 03, 06, 10, 13, 19 |
| S05 | Recapitulación de checkpoint | Qué ya funciona y qué limitación sigue visible | Captura, árbol o flujo del estado anterior con una pregunta | Todas desde 02 |
| S06 | Objetivo y transformación | Punto de partida, cambio de hoy y resultado observable | Antes → hoy → checkpoint, sin enumerar todo el stack | Todas |
| S07 | Puente al editor | Pregunta concreta que termina en una ruta, símbolo o acción | Pregunta dominante y una referencia mínima | Todas |
| S08 | Transición a demo en vivo | Qué se observará y qué no demuestra la demo | Título, recorrido breve y condición de retorno | 07–16 y 18–19 |
| S09 | Descanso y retorno | Momento de pausa, hora o condición de regreso y siguiente actividad | Separador limpio, sin contenido conceptual nuevo | 03, 06, 10, 13, 19 |
| S10 | Cierre y siguiente necesidad | Resultado logrado, límite actual y pregunta que abre la siguiente sesión | Checkpoint + flecha o contraste atenuado | 01–18 |
| S11 | Cierre final | Síntesis y acción de salida | Mensaje dominante con evidencia o preguntas finales | Todas; variante final en 19 |

#### B. Conceptos, definiciones y preguntas

| ID | Caso | Contenido mínimo | Forma de mostrarlo | Sesiones donde aparece |
| --- | --- | --- | --- | --- |
| S12 | Una idea central | Una afirmación verificable y una línea de apoyo opcional | Centro único; sin bullets secundarios | Todas |
| S13 | Definición + ejemplo | Término, definición situada y ejemplo del curso | Texto breve junto a snippet, UI o diagrama | Todas |
| S14 | Pregunta de predicción | Pregunta, contexto mínimo y opciones o casos si hacen falta | La pregunta domina; la respuesta no aparece todavía | 01–16 y 18–19 |
| S15 | Revelación de respuesta | Respuesta, por qué y vínculo con el siguiente paso | Misma estructura de la pregunta para conservar continuidad | 01–16 y 18–19 |
| S16 | Principios o reglas cortas | Máximo cuatro reglas relacionadas | Lista breve con jerarquía clara; no párrafos | 01, 03, 04, 07, 11, 12, 16, 18 |
| S17 | Vocabulario o glosario | Términos que el grupo necesita distinguir | Pares término/definición o tabla breve | 01–16 y 18–19; cierre transversal en 19 |
| S18 | Analogía | Una situación conocida y la relación que se observará | Visual dominante; todavía sin sustituir vocabulario técnico | 19; posible apoyo puntual en otras sesiones |
| S19 | Analogía → modelo técnico | Correspondencia explícita y posterior retiro de la analogía | Dos slides emparejadas o dos columnas con límites claros | 19 |

#### C. Comparación, clasificación y transformación

| ID | Caso | Contenido mínimo | Forma de mostrarlo | Sesiones donde aparece |
| --- | --- | --- | --- | --- |
| S20 | Comparación de dos opciones | Criterios comunes y diferencia relevante | Dos columnas simétricas; mismas filas o preguntas | 01, 04, 06, 07, 11–16, 18 |
| S21 | Comparación de tres opciones | Tres alternativas bajo criterios comunes | Tres columnas o matriz; no tres textos independientes | 09 y 19; reutilizable para herramientas |
| S22 | Correcto / incorrecto | Dos ejemplos y la razón concreta de la diferencia | Código, UI o frase lado a lado; evitar depender solo de color | 01–18 |
| S23 | Antes / después | Estado inicial, cambio visible y estado final | Misma escala y encuadre para facilitar comparación | 01–18 |
| S24 | Clasificación | Elementos distribuidos entre propietarios, capas o categorías | Tabla, carriles o zonas etiquetadas | 04, 08, 11–14, 18 |
| S25 | Matriz de casos | Dos dimensiones y resultados observables | Tabla o cuadrícula; resaltar relación, no decorar cada celda | 02–08, 10, 13–18 |
| S26 | Tabla de contrato | Campo, tipo, origen, nulabilidad, consumidor o ejemplo | Tabla legible con pocas columnas por slide | 02, 06, 07, 11–16 |
| S27 | Transformación de formas | Entrada → adapter/cálculo → salida | Flujo con campos que cambian y campos que se conservan | 02, 04, 07, 08, 10, 13–15 |

#### D. Relaciones, arquitectura y tiempo

| ID | Caso | Contenido mínimo | Forma de mostrarlo | Sesiones donde aparece |
| --- | --- | --- | --- | --- |
| S28 | Flujo lineal | Origen, pasos y resultado | Nodos horizontales con verbos en las conexiones | 01–16 y 18–19 |
| S29 | Árbol de componentes | Componentes, propiedad y relaciones padre/hijo | Árbol vertical; props y callbacks se distinguen por dirección | 01–06, 09–15 |
| S30 | Árbol de archivos o rutas | Rutas de archivo y correspondencia con UI o URL | Árbol monospace junto a destinos o responsabilidades | 01, 07, 09, 11, 12, 15 |
| S31 | Mapa de propietarios | Dato o responsabilidad y su dueño | Carriles React/Query/Router/Firebase/API, según el caso | 04–18 |
| S32 | Arquitectura por capas | Componentes o servicios y frontera entre ellos | Capas apiladas; conexiones ortogonales y etiquetas cercanas | 07–16 y 18–19 |
| S33 | Secuencia request/response | Actor, request, espera, response y actualización | Flujo o secuencia simple; no necesita notación UML completa | 07, 08, 10, 12–18 |
| S34 | Timeline o ciclo de vida | Estados y momento exacto de cada transición | Línea temporal con causa y evidencia observable | 04, 07, 08, 10, 12, 13, 15–19 |
| S35 | Decisión y ramas | Condición válida y salidas posibles | Árbol corto o galería conectada | 03–05, 08–16 |
| S36 | Progresión del curso | Checkpoints o responsabilidades que se acumulan | Línea de sesiones, mapa de CRUD o capas activadas | 06–19 |

#### E. Código, comandos y archivos

| ID | Caso | Contenido mínimo | Forma de mostrarlo | Sesiones donde aparece |
| --- | --- | --- | --- | --- |
| S37 | Snippet único | Código mínimo completo para explicar una idea | Escenario de código; título afirma qué se debe observar | 01–18 |
| S38 | Snippet anotado | Código y de una a cuatro anotaciones ligadas a líneas | Código dominante; llamadas laterales sin taparlo | 01–18 |
| S39 | Código antes / después | Dos versiones comparables y cambio resaltado | Dos columnas o alternancia sobre el mismo escenario | 01–18 |
| S40 | Código progresivo | Un mismo snippet con focos sucesivos | Pasos o highlights de líneas; el PDF debe mostrar una versión comprensible | 01–18 |
| S41 | Dos snippets en contraste | Referencia/ejecución, loader/query, key/form key u otras parejas | Dos bloques equivalentes con una pregunta común | 01, 04, 06, 09, 12, 15–16 |
| S42 | Schema, tipo y uso | Definición runtime, tipo derivado y consumidor | Tres pasos conectados; cada símbolo conserva su ruta | 11–15 |
| S43 | Árbol + snippet | Ubicación del archivo y fragmento que se trabaja | Árbol estrecho y código dominante | 01–18 |
| S44 | Terminal o comando | Comando, contexto de ejecución y resultado esperado | Terminal legible; una ejecución por slide cuando el output sea relevante | 01, 06–09, 12, 18–19 |
| S45 | Error y corrección | Mensaje o comportamiento, causa y cambio mínimo | Error real junto a la línea o estado que lo explica | 01–18 |

#### F. Interfaz, evidencia y práctica

| ID | Caso | Contenido mínimo | Forma de mostrarlo | Sesiones donde aparece |
| --- | --- | --- | --- | --- |
| S46 | Mockup de interfaz | Estado visual que todavía no requiere aplicación ejecutable | Escenario visual completo con etiquetas mínimas | 01–06, 08, 09, 11, 16 |
| S47 | Galería de estados de UI | Inicio, carga, error, vacío y éxito u otra familia acotada | Cuadrícula con el mismo encuadre en todos los casos | 03–05, 08, 10, 14 |
| S48 | Captura de aplicación | Pantalla real y punto concreto que se debe observar | Captura grande; recorte fiel y pie de evidencia | 01–16 y 18–19 |
| S49 | Captura anotada | Captura con dos a cuatro señales, rutas o zonas | Etiquetas pegadas a su evidencia; no tapar el dato observado | 06–19 |
| S50 | Devtools / Network | Key, request, status, body o timing relevante | Captura grande o comparación en dos columnas | 07, 08, 10, 12–18 |
| S51 | Anatomía de URL | Segmentos fijos, params y significado | URL dominante con anotaciones por segmento | 09, 10, 14, 16, 18 |
| S52 | Matriz de evidencia | Comprobación, qué demuestra y qué no demuestra | Tabla o carriles Vitest/build/Network/navegador/deploy | 07–16 y 18–19 |
| S53 | Checklist de checkpoint | Recorrido o condiciones observables de salida | Checklist corto con evidencia, no lista de implementación | Todas |
| S54 | Instrucción de práctica | Encargo, archivos permitidos, tiempo y condición de parada | Layout de instrucción; una acción principal | Todas |
| S55 | Trabajo con agente | Decisiones humanas, prompt, límites, lectura y evidencia | Cinco bloques en orden; prompt completo se entrega fuera de la slide si no cabe | 07–16 y 18–19 |
| S56 | Taller | Objetivo, punto de partida, restricciones, evidencia y entrega | Una o varias slides de instrucción, separadas de la rúbrica | 03, 06, 10, 13, 19 |
| S57 | Rúbrica resumida | Criterios, puntos y evidencia esperada | Tabla legible; la rúbrica completa permanece en su documento | 03, 06, 10, 13, 19 |
| S58 | Plan de contingencia | Falla posible, fallback y frontera de evidencia | Dos o tres escenarios prioritarios; no toda la guía docente | 07–16 y 18–19 |
| S59 | Preguntas de cierre | Entre tres y cinco preguntas que recuperan decisiones | Una pregunta por slide o una lista final si son muy breves | Todas |

### 1.4 Variantes que debe mostrar la galería

La futura galería de referencia debe demostrar, al menos, estas variaciones sin convertirlas en layouts independientes:

- con título visible y con título visualmente oculto pero conservado para navegación y accesibilidad;
- sin subtítulo y con subtítulo breve;
- texto solo, visual solo y texto + visual;
- imagen horizontal, vertical y captura de navegador;
- código corto, mediano y dividido en dos slides;
- comparación 50/50 y comparación con un lado dominante;
- tabla breve y tabla dividida cuando una sola slide no sea legible;
- diagrama lineal, árbol, capas, ramas y timeline;
- estado estático y revelado progresivo;
- versión de pantalla y versión exportada a PDF;
- slide docente con notas privadas y PDF estudiantil sin esas notas;
- slide virtual y separadores específicos de una presencial: explicación, descanso, taller y revisión.

### 1.5 Reglas de contenido que el template debe proteger

- Una slide tiene una idea principal identificable.
- El título afirma el punto de la slide; no funciona como etiqueta genérica del tema.
- La explicación oral y las respuestas docentes viven en notas, no como párrafos dentro del lienzo.
- El código, las capturas y los diagramas deben poder leerse proyectados; si no caben, el contenido se divide.
- Una tabla se usa solo cuando filas y columnas expresan una relación real.
- Una captura no se usa como decoración: debe incluir el dato que se pide observar.
- Los diagramas usan conectores ortogonales cuando sea posible y colocan las etiquetas cerca de lo que describen.
- El color nunca es el único medio para distinguir correcto/incorrecto, estados o rutas.
- Los fragments o revelados deben seguir siendo comprensibles al exportar a PDF.
- Cuando una slide presente campos devueltos por un hook, debe mostrar la invocación que produce el objeto y conservar su prefijo al nombrarlos; por ejemplo, `const query = useMediaSearch(input)` seguido de `query.data` o `query.isFetching`.
- La galería incluye contenido de muestra realista de React Guide VI, pero no adelanta soluciones completas de talleres.
- Una variante solo entra al catálogo si resuelve una necesidad detectada en los guiones o una limitación de legibilidad; no se añade para aumentar la cantidad.

### 1.6 Cobertura encontrada en las 18 sesiones

El inventario de guiones muestra que los recursos más repetidos son:

- flujos de datos, requests y transformaciones;
- árboles de componentes, rutas, providers y archivos;
- comparaciones de responsabilidades o mecanismos;
- tablas de contratos, estados y evidencias;
- snippets únicos, anotados, progresivos y comparados;
- timelines de eventos, caché, mutaciones, Actions, build y deployment;
- mockups y galerías de estados de interfaz;
- capturas de aplicación, Network y Query Devtools;
- preguntas de predicción, puentes al editor y cierres;
- checkpoints, prácticas, talleres, trabajo con agentes y fronteras de evidencia.

La referencia existente del webinar de TanStack ya demuestra algunas familias útiles: portada, agenda, separador, concepto + código, dos columnas, tabla comparativa, pregunta, demo, glosario y cierre. También evidencia dos riesgos que el framework debe evitar: slides con demasiado contenido para el tamaño proyectado y composiciones donde texto, código e imagen compiten por el mismo espacio. Los HTML `restaurant-rendering.html` y `rendering-modes.html` son referencias de visual interactivo, no layouts que deban copiarse literalmente a todas las sesiones.

## 2. Stack técnico aprobado

### 2.0 Modelo de autoría

La producción usa un modelo híbrido:

- los datos recurrentes de una slide pueden declararse de forma parametrizable: metadata, títulos, bloques de contenido, imágenes, logos, captions y notas;
- el resultado continúa siendo HTML semántico editable;
- las geometrías especiales admiten edición manual cuando el contenido real no encaja limpiamente en una abstracción compartida;
- no se crea un único componente configurable con decenas de opciones para representar todo el catálogo;
- una solución manual se convierte en primitive compartida solo cuando vuelve a aparecer o resuelve un problema transversal.

Este modelo reduce repetición sin impedir que el diseño se ajuste al contenido concreto de cada sesión.

### 2.1 Espacios de trabajo

Estructura aprobada por etapas:

```text
presentation-framework/
├── draft/
│   ├── README.md
│   ├── decisions/
│   └── gallery/
└── approved/
    ├── README.md
    ├── slide-catalog-and-stack.md
    ├── visual-direction.md
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src/
    │   ├── framework/
    │   ├── layouts/
    │   ├── components/
    │   ├── examples/
    │   └── styles/
    ├── public/
    │   └── assets/
    └── scripts/
```

Reglas para esos espacios:

- `draft/` contiene propuestas, comparaciones, pruebas y resultados de revisión que todavía pueden cambiar.
- `approved/` contiene decisiones ya aprobadas y puede crecer por etapas. Una decisión pendiente no invalida las secciones aprobadas, pero tampoco se trata como resuelta.
- El runtime y la galería implementada no entran en `approved/` hasta construir y comprobar el piloto correspondiente.
- La galería aprobada funciona como el equivalente al “Slide Master”: demuestra cada geometría y caso soportado con contenido de muestra.
- Cada sesión continúa usando `course/<sesión>/presentation/` para su fuente y PDF final.
- Las presentaciones de sesión consumen una versión identificable del framework aprobado; no copian manualmente CSS y JavaScript divergentes.
- Los artefactos generados no son fuente primaria. HTML, CSS, JavaScript, assets y notas permanecen editables; PNG y PDF se regeneran.

En esta iteración se promueve este documento a `approved/`. El runtime, la galería y sus carpetas de implementación todavía no se crean.

### 2.2 Alternativas evaluadas y decisión

#### Alternativa A · HTML + JavaScript + Tailwind Play CDN

Ventajas:

- inicio inmediato;
- no requiere build de CSS;
- sirve para probar una idea aislada.

Problemas:

- depende de red para abrir o exportar correctamente;
- la versión puede cambiar fuera del lockfile;
- compila estilos en el navegador;
- dificulta garantizar que HTML, PNG y PDF usen exactamente el mismo CSS;
- Tailwind declara expresamente que Play CDN es solo para desarrollo y no está pensado para producción.

Conclusión: útil únicamente para un experimento desechable. No es apropiada como base de 18 presentaciones reproducibles.

Referencia: [Tailwind CSS · Play CDN](https://tailwindcss.com/docs/installation/play-cdn).

#### Alternativa B · HTML semántico + Reveal.js + Tailwind compilado + Vite

Ventajas:

- conserva HTML, CSS y JavaScript como fuentes editables;
- Reveal.js resuelve navegación, escalado, fragments, notas docentes, código resaltado y exportación a PDF;
- permite un lienzo 16:9 explícito y conserva la proporción al proyectar;
- Tailwind se genera como CSS local y versionado, sin dependencia de CDN;
- Vite ofrece servidor local, módulos y manejo reproducible de assets;
- el stack se instala con pnpm y queda fijado por lockfile;
- Playwright o Chromium pueden automatizar screenshots y exportación.

Costes:

- añade una dependencia de runtime para la presentación y un build local;
- Reveal.js necesita una capa de tema propia para que sus estilos base no dicten la identidad del curso;
- fragments, escalado automático y exportación requieren reglas estrictas para que el PDF no diverja del modo presentación.

Conclusión: **aprobada**. El framework usará HTML semántico, Reveal.js, Tailwind compilado y Vite con pnpm. Esta combinación resuelve infraestructura repetitiva sin ocultar el HTML y deja el esfuerzo del curso en layouts, componentes y contenido.

Referencias:

- [Reveal.js · Markup](https://revealjs.com/markup/)
- [Reveal.js · Presentation size](https://revealjs.com/presentation-size/)
- [Reveal.js · PDF export](https://revealjs.com/pdf-export/)
- [Reveal.js · Speaker view](https://revealjs.com/speaker-view/)
- [Reveal.js · Presenting code](https://revealjs.com/code/)
- [Tailwind CSS · CLI en v4](https://tailwindcss.com/docs/upgrade-guide)

#### Alternativa C · Slidev

Ventajas:

- autoría rápida desde Markdown;
- Vite, navegación, código y exportación ya integrados;
- componentes reutilizables mediante Vue.

Problemas:

- introduce Vue y convenciones específicas de Slidev en un curso cuyo material gira alrededor de React;
- aleja la fuente principal del HTML solicitado;
- hace más difícil revisar el DOM final y reutilizar los HTML interactivos existentes sin una capa adicional;
- aumenta la cantidad de conceptos de framework que el equipo debe mantener.

Conclusión: no recomendada para este proyecto. Su velocidad de autoría no compensa cambiar el modelo técnico acordado.

### 2.3 Stack aprobado

| Capa | Elección inicial | Responsabilidad |
| --- | --- | --- |
| Gestor | pnpm | Instalación reproducible y lockfile único |
| Servidor y build | Vite | Preview local, módulos, assets y build estático |
| Runtime de slides | Reveal.js | Navegación, tamaño, notas, fragments y modo presentación |
| Marcado | HTML semántico | Fuente explícita y control completo de estructura |
| Estilos | CSS propio + Tailwind CSS v4 compilado | Tokens, geometrías y utilidades locales sin CDN |
| Código | Reveal Highlight / highlight.js | Sintaxis, números y énfasis de líneas sin otra librería inicial |
| Diagramas | HTML y SVG reutilizables | Flujos, árboles, capas, timelines y anotaciones controlables |
| Iconos | SVG locales seleccionados | Apoyo semántico sin depender de servicios remotos |
| Interactividad | JavaScript ES modules | Visuales interactivos específicos y controles propios mínimos |
| Capturas | Playwright con Chromium | PNG por slide y revisión a resolución fija |
| PDF | Chromium/Reveal como ruta principal | PDF con texto seleccionable cuando el navegador lo conserve |
| QA documental | Poppler y scripts locales | Page count, metadatos, rasterización y comparación visual |

### 2.4 Decisiones técnicas aprobadas

- No usar Tailwind por CDN en la versión aprobada.
- Usar Tailwind como ayuda de composición, no como contrato público del template. Las geometrías y componentes deben tener clases semánticas propias además de utilidades.
- Fijar dependencias y versiones mediante `package.json` y `pnpm-lock.yaml` cuando comience la implementación.
- Mantener todos los assets necesarios de forma local para que preview, screenshots y PDF funcionen sin red.
- Usar fuentes locales o fallbacks métricamente compatibles; una descarga tardía no debe cambiar saltos de línea durante la exportación.
- Configurar un lienzo 16:9 fijo. La resolución exacta se decidirá junto con tipografía y pruebas de proyección.
- Evitar slides verticales anidadas de Reveal.js en el curso base; complican orden, numeración y exportación sin aportar al flujo lineal de una clase.
- Usar fragments solo cuando la secuencia de revelado sea pedagógica. El PDF debe consolidarlos o exportarlos mediante una política única y explícita.
- Mantener notas docentes en `aside.notes` o un mecanismo equivalente y excluirlas del PDF estudiantil.
- Generar PNG por slide para la revisión visual, pero no componer el PDF desde PNG como ruta principal: eso rasteriza texto y código. Conservar esa composición como fallback que se comparará durante el piloto.
- No añadir inicialmente Mermaid, GSAP, una librería de charts o una segunda librería de resaltado. HTML/SVG y Reveal Highlight cubren las necesidades detectadas; una dependencia adicional debe resolver un caso que el piloto no pueda cubrir bien.
- Reutilizar los dos HTML interactivos del webinar solo como referencia o assets adaptados para sesiones concretas. No convertir cada slide en una miniaplicación.

### 2.5 Contrato mínimo del framework futuro

El framework aprobado deberá ofrecer:

1. un shell de deck con navegación, progreso, notas y exportación;
2. las 18 geometrías base documentadas;
3. componentes para título, texto, código, imagen, caption, tabla, diagrama, anotación, pregunta, checkpoint e instrucción;
4. una galería navegable con al menos un ejemplo realista por caso semántico;
5. validación de overflow, assets ausentes y elementos fuera del lienzo;
6. captura automática de todas las slides en PNG;
7. exportación reproducible a PDF;
8. separación entre notas docentes y artefacto estudiantil;
9. una forma explícita de registrar qué geometrías utiliza cada presentación;
10. documentación para crear una sesión nueva sin copiar ni alterar internals del framework.

### 2.6 Orden de las siguientes revisiones

1. Preparar el plan de implementación del runtime y la galería a partir de [la dirección visual aprobada](visual-direction.md).
2. Construir una galería pequeña con los casos más exigentes antes de producir el catálogo completo.
3. Revisar el piloto en navegador, PNG y PDF y corregir el framework.
4. Validar una sesión virtual y luego una presencial antes de comenzar la producción de las 18 presentaciones.

La implementación del framework comenzará después de preparar y revisar su plan de trabajo.
