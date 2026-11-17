# React Guide VI

Material de trabajo para un curso de React de 18 sesiones. El curso acompaña a la cohorte desde JSX y componentes hasta una biblioteca personal con búsqueda remota, autenticación, CRUD, pruebas y despliegue.

El producto de aprendizaje es una versión reducida de Medialog: permite buscar películas y series, ver su detalle y administrar una biblioteca con estado, prioridad y notas. Este repositorio conserva la planificación y los materiales de clase. La aplicación ejecutable y sus checkpoints viven en el repositorio hermano [`../MediaLog-Bootcamp`](../MediaLog-Bootcamp).

## Antes de cambiar algo

Lee [AGENTS.md](AGENTS.md) y [rules/index.md](rules/index.md). Las reglas explican el proceso de cambio, los límites pedagógicos y qué archivos deben mantenerse sincronizados.

Trabaja con `pnpm` cuando un material incluya comandos. No publiques guías docentes, claves de cuestionarios, soluciones de talleres ni materiales de sesiones futuras en el repositorio progresivo de estudiantes.

## Preparar borradores en Canvas

El script [`scripts/canvas_publish.py`](scripts/canvas_publish.py) crea módulos de Canvas no publicados. Usa únicamente Python estándar, solicita el token de forma oculta y nunca lo guarda.

```powershell
# Vista previa local: no pide token ni contacta Canvas.
python scripts/canvas_publish.py

# Lista cursos docentes; copia solamente el ID del curso elegido.
python scripts/canvas_publish.py --list-courses

# Prueba primero la sesión 01: crea materiales y el control de lectura en borrador.
python scripts/canvas_publish.py --course-id 12345 --session 1 --with-quizzes --apply
```

El script crea los subtítulos `Previo a la clase`, `Durante la clase` y `Posterior a la clase`. Sube `pre-class-reading.html`, `student-guide.html` y, cuando exista, el PDF estudiantil de diapositivas. Con `--with-quizzes`, crea un cuestionario de práctica autocorregible de un intento: cinco minutos totales, una pregunta por pantalla, sin volver a preguntas respondidas, opciones mezcladas y un punto por pregunta. Usa la clave privada local sin subirla y no establece fechas. No crea tareas, guías docentes ni publicaciones visibles para estudiantes.

Para evitar pegar el token en cada ejecución, crea `.env` en la raíz del repositorio a partir de [`.env.example`](.env.example) y escribe `CANVAS_TOKEN=...`. `.env` está ignorado por Git; no lo compartas ni lo subas al repositorio.

Si una carga anterior reutilizó archivos equivocados, usa `--replace-materials` junto con `--apply`. El script reemplaza las lecturas, guías y PDFs del alcance elegido con nombres remotos únicos por sesión; no modifica los controles de lectura.

## Mapa del repositorio

```text
React-Guide-VI/
├── course/                   18 paquetes de sesión vigentes
├── draft/                    fuentes históricas de la planificación anterior
├── rules/                    reglas aprobadas para crear y revisar material
├── presentation-framework/   runtime y decisiones para las diapositivas
├── memories/                 contexto y validaciones de iteraciones anteriores
├── docs/                     especificaciones de diseño de trabajo
├── progressive-project-plan.md  ruta y checkpoints del proyecto ejecutable externo
├── ROADMAP.md                frentes de producción y su estado
├── TASKS.md                  plan activo y siguiente trabajo pendiente
├── corrections-plan.md       trazabilidad de correcciones curriculares
├── change-template.md        plantilla para revisar una sesión
├── dashboard.html            tablero local de seguimiento
└── AGENTS.md                 instrucciones para quien edita el repositorio
```

| Ubicación | Contiene | Úsala para |
| --- | --- | --- |
| [`course/`](course/) | Una carpeta por cada sesión académica | Preparar, impartir o revisar una clase vigente. |
| [`draft/`](draft/) | Índice y 23 guías de la planificación anterior | Consultar trazabilidad o recuperar una decisión que se migró a las 18 sesiones. No es el cronograma vigente. |
| [`rules/`](rules/) | Reglas pedagógicas, de producción, materiales, presentaciones y cambios | Decidir cómo actualizar una guía sin romper acuerdos del curso. |
| [`presentation-framework/`](presentation-framework/) | Runtime compartido, catálogo visual, dirección visual y propuestas en revisión | Crear o revisar diapositivas. |
| [`memories/`](memories/) | Hallazgos, decisiones locales y validaciones por iteración | Retomar una revisión sin perder contexto. Una memoria no reemplaza una regla aprobada. |
| [`docs/`](docs/) | Especificaciones de diseño producidas durante trabajo aprobado | Consultar el porqué y el alcance de cambios que requirieron diseño. |
| [`progressive-project-plan.md`](progressive-project-plan.md) | Ramas, seeds, checkpoints y evidencia del proyecto progresivo | Saber desde qué estado parte una sesión y qué progreso ejecutable existe. |
| [`ROADMAP.md`](ROADMAP.md) | Frentes de trabajo y estado de producción | Entender qué está aprobado, implementado o pendiente. |
| [`TASKS.md`](TASKS.md) | Plan corto de la tarea transversal activa | Retomar una revisión que cruza varias sesiones. |
| [`corrections-plan.md`](corrections-plan.md) | Correcciones ya aprobadas y su evidencia documental | Ver qué ajuste se hizo y qué no demuestra esa validación. |
| [`change-template.md`](change-template.md) | Plantilla de revisión interna | Registrar una corrección antes de aplicarla. |
| [`dashboard.html`](dashboard.html) | Tablero local | Consultar el seguimiento visual del curso. |

Las carpetas ocultas `.playwright-mcp/`, `.superpowers/` y `graphify-out/` apoyan el trabajo de herramientas locales. No son materiales para la cohorte ni una fuente de reglas curriculares.

## El curso y sus sesiones

[`draft/index.md`](draft/index.md) conserva el calendario, las fechas, la modalidad y el checkpoint de las 18 sesiones. Las sesiones virtuales duran 90 minutos. Las sesiones presenciales duran 180 minutos: 75 minutos antes del descanso, 30 minutos de descanso, 60 minutos de taller y 15 minutos de revisión o cierre.

El curso sigue una progresión acumulativa. Cada sesión parte de un checkpoint observable de la anterior. Desde la sesión 07, el curso incorpora trabajo asistido por agentes con límites, lectura humana posterior y evidencia ejecutada.

### Dónde está una sesión

Cada sesión vive en una carpeta con número de dos dígitos y tema en `kebab-case`:

```text
course/
└── 03-taller-catalogo-estatico/
    ├── session-draft.md
    ├── pre-class-reading.md
    ├── teacher-guide.md
    ├── student-guide.md
    ├── workshop-rubric.md
    ├── changes.md
    └── presentation/          solo si el deck ya llegó a producción visual
```

Las 18 carpetas de [`course/`](course/) contienen el paquete textual vigente. Las sesiones 03, 06, 10, 13 y 19 agregan `workshop-rubric.md` porque incluyen evaluación presencial. Una carpeta solo incluye `presentation/` cuando su presentación ya entró a producción visual; al momento de escribir este README existen decks de las sesiones 01 a 10.

| Archivo o carpeta | Lector principal | Contenido y propósito |
| --- | --- | --- |
| `session-draft.md` | Equipo que diseña la sesión | Plan de la clase: entrada, checkpoint, objetivos, secuencia, tiempos, conceptos, taller y guion de presentación. Conserva decisiones de planeación. |
| `pre-class-reading.md` | Equipo del curso | Fuente Markdown editable de la lectura previa. |
| `pre-class-reading.html` | Estudiante, antes de la sesión | Versión HTML autónoma de la lectura previa, lista para cargar en Aula Virtual. |
| `reading-check.md` | Estudiante, después de la sesión | Preguntas cerradas para el control de lectura; no muestra respuestas correctas ni instrucciones de entrega. |
| `teacher-guide.md` | Docente | Narrativa completa, pasos de coding, preguntas, respuestas esperadas, errores frecuentes, contingencias, clave del control de lectura y soluciones privadas. |
| `student-guide.md` | Estudiante | Objetivo, punto de partida, actividades, comandos, checkpoints, vocabulario y evidencia de entrega. Excluye soluciones y notas privadas. |
| `workshop-rubric.md` | Estudiante y docente | Encargo evaluable, restricciones, evidencia, entrega y criterios de calificación. Solo aparece en 03, 06, 10, 13 y 19. |
| `changes.md` | Revisor del currículo | Solicitudes de corrección, decisiones aplicadas y trazabilidad de la revisión de esa sesión. |
| `presentation/` | Docente y autor del deck | Fuente HTML, recursos locales y artefactos generados de las diapositivas de esa sesión. |

No todos los artefactos nacen a la vez. Primero se aprueba el paquete textual. La producción de diapositivas llega después y no se adelanta con carpetas vacías.

## Cómo funciona una clase

El material separa lo que se planifica, lo que usa el docente y lo que recibe el estudiante. Esa separación evita entregar claves o soluciones por error y permite que la guía docente sea detallada sin sobrecargar la guía estudiantil.

La secuencia didáctica es:

```text
presentación conceptual
→ demostración docente
→ construcción guiada con el grupo
→ actividad estudiantil
→ comprobación del checkpoint
→ cierre oral sobre lo construido
```

En las presenciales, la explicación y el coding guiado ocurren antes del descanso. El taller posterior aplica lo que el grupo ya vio; no introduce una API, hook, librería o patrón nuevo.

[`rules/course-materials.md`](rules/course-materials.md) define qué se publica y qué queda privado. [`rules/session-production-workflow.md`](rules/session-production-workflow.md) define el orden para producir y comprobar una sesión. [`rules/pedagogy.md`](rules/pedagogy.md), [`rules/class-guides.md`](rules/class-guides.md) y las demás reglas de [`rules/`](rules/) explican los criterios que deben mantenerse entre sesiones.

## Diapositivas y presentaciones

Las diapositivas no sustituyen la guía docente. Cada `session-draft.md` y `teacher-guide.md` incluye un **guion de presentación**: qué debe explicarse, en qué orden, qué contraste evita un error frecuente, qué recurso usar y cuál es el puente hacia el editor. El guion guarda la intención pedagógica aunque todavía no exista un deck.

La clase usa una sola transición: presentación continua, coding guiado, práctica, comprobación y cierre oral. Tras pasar al editor, el docente trabaja sobre el código visible y no necesita volver a las diapositivas para cerrar la sesión.

```text
Guion en session-draft.md y teacher-guide.md
                ↓
Decisiones visuales aprobadas en presentation-framework/approved/
                ↓
Deck de una sesión en course/<sesión>/presentation/
                ↓
HTML editable + assets locales → PNG de revisión + PDF distribuible
```

### Qué contiene el framework

| Ubicación | Estado | Para qué sirve |
| --- | --- | --- |
| [`presentation-framework/approved/`](presentation-framework/approved/) | Aprobado | Runtime compartido, catálogo de layouts, dirección visual y scripts de desarrollo, auditoría, captura y exportación. Todos los decks finales usan esta base. |
| [`presentation-framework/draft/`](presentation-framework/draft/) | En revisión | Propuestas, comparaciones y planes visuales que todavía pueden cambiar. Una decisión pasa a `approved/` cuando el usuario la aprueba. |
| [`course/<sesión>/presentation/`](course/01-react-jsx-y-proyecto/presentation/) | Por sesión | `index.html` como fuente editable y los recursos propios del deck. La carpeta solo existe para sesiones con producción visual realizada. |

El stack aprobado usa HTML, CSS, JavaScript, Reveal.js, Vite, Tailwind compilado localmente y `pnpm`. Cada deck usa un lienzo 16:9 y carga el runtime común. El HTML y los recursos locales son la fuente: no edites un PDF para cambiar una diapositiva.

Desde [`presentation-framework/approved/`](presentation-framework/approved/), el flujo es:

```bash
pnpm deck:dev -- --deck <ruta-del-deck>
pnpm deck:generate -- --deck <ruta-del-deck>
```

`deck:dev` abre el deck para iterar. `deck:generate` construye, audita las slides, captura PNG, exporta el PDF y comprueba sus páginas. Los archivos generados viven en `presentation/artifacts/`; se pueden regenerar y no reemplazan la fuente editorial. Consulta los comandos y límites en [`presentation-framework/approved/USAGE.md`](presentation-framework/approved/USAGE.md) y las reglas completas en [`rules/presentations.md`](rules/presentations.md).

## Proyecto progresivo y checkpoints

El material curricular no contiene la aplicación React que se ejecuta durante el curso. Esa aplicación vive en `../MediaLog-Bootcamp`, un repositorio hermano con etapas por sesión:

```text
session-NN-start
→ session-NN-step-XX-descripcion
→ session-NN-workshop-start     solo en presenciales
→ session-NN-end
```

Una rama o checkpoint permite recuperar un estado de trabajo. No demuestra que una persona haya comprendido el tema. La evidencia de build, lint, navegador, backend o aula tiene límites distintos y el plan los registra por separado.

Consulta [`progressive-project-plan.md`](progressive-project-plan.md) antes de cambiar una guía que afecte la entrada, la salida o el seed de una sesión. El proyecto implementó las sesiones 01 a 06; las sesiones 07 a 16 y 18 a 19 conservan sus guías textuales aprobadas, pero el proyecto ejecutable de esas etapas sigue pendiente.

## Rutas rápidas

| Si necesitas… | Empieza por… |
| --- | --- |
| Conocer la secuencia, fechas y temas | [`draft/index.md`](draft/index.md) y luego la carpeta de la sesión en [`course/`](course/). |
| Preparar una clase | `teacher-guide.md`, `student-guide.md`, `pre-class-reading.md` y el checkpoint anterior indicado en [`progressive-project-plan.md`](progressive-project-plan.md). |
| Revisar el material que recibirá el estudiante | `student-guide.md`, `pre-class-reading.md`, `workshop-rubric.md` cuando exista y el PDF del deck cuando se haya generado. |
| Corregir una sesión | [AGENTS.md](AGENTS.md), [`rules/index.md`](rules/index.md), su `changes.md`, la memoria relacionada y las sesiones vecinas. |
| Crear o revisar un deck | [`rules/presentations.md`](rules/presentations.md), las decisiones de [`presentation-framework/approved/`](presentation-framework/approved/) y el guion de presentación de la sesión. |
| Retomar una revisión transversal | [`TASKS.md`](TASKS.md), [`corrections-plan.md`](corrections-plan.md) y [`memories/`](memories/). |
| Saber qué queda por producir | [`ROADMAP.md`](ROADMAP.md) y [`progressive-project-plan.md`](progressive-project-plan.md). |

## Límites importantes

- `course/` conserva los paquetes vigentes. `draft/` conserva la historia de la migración y no se mueve ni se elimina durante ese proceso.
- Las guías docentes, claves y soluciones permanecen privadas. El repositorio progresivo recibe solo artefactos estudiantiles aprobados de la sesión actual y anteriores.
- Una presentación aprobada es una línea base. Los ajustes nacidos en el aula requieren una nueva iteración con su evidencia, no cambios hipotéticos.
- Una validación documental confirma enlaces, consistencia y trazabilidad. No prueba por sí sola que la aplicación compile, funcione en navegador, consuma el backend o se haya probado con estudiantes.
- No crees commits, ramas o tags en este repositorio salvo que el usuario lo pida de forma explícita.
