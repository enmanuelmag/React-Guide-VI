# Reglas del curso · React Guide VI

## Propósito

Esta carpeta conserva decisiones reutilizables sobre cómo enseñar, redactar y estructurar el curso. `AGENTS.md` obliga a consultar estas reglas antes de modificar las guías.

Los paquetes aprobados de `course/` describen las sesiones vigentes; `draft/` conserva las fuentes históricas. Los archivos de `rules/` explican criterios que deben mantenerse entre clases.

## Reglas obligatorias

| Archivo | Tema | Cuándo leerlo |
| --- | --- | --- |
| [pedagogy.md](pedagogy.md) | Progresión, explicación y comprensión | En toda creación o corrección de material docente |
| [class-guides.md](class-guides.md) | Estructura de clases, tiempos, checkpoints y talleres | Al editar una guía o el cronograma |
| [session-production-workflow.md](session-production-workflow.md) | Proceso secuencial y paquete textual completo de cada sesión | Al iniciar, continuar o cerrar la migración de una sesión |
| [course-materials.md](course-materials.md) | Carpetas por sesión, artefactos privados y distribución estudiantil | Al migrar una sesión o preparar materiales finales |
| [pre-class-reading.md](pre-class-reading.md) | Fuentes, lectura previa y control posterior | Al preparar los materiales de lectura de cualquier sesión académica |
| [workshops-and-rubrics.md](workshops-and-rubrics.md) | Talleres calificables, tabla única y excepción sin extras de la sesión 19 | Al planificar o evaluar una sesión presencial |
| [presentations.md](presentations.md) | Guion conceptual, diapositivas y colores de sintaxis en animaciones | Al planificar teoría, recapitulación, cierre o paneles de código animados |
| [task-memories.md](task-memories.md) | Memoria local por iteración y promoción de hallazgos | Antes y después de modificar cada clase |
| [code-and-naming.md](code-and-naming.md) | pnpm, naming, JSX espaciado y condiciones legibles | Al proponer archivos, comandos o código de ejemplo |
| [course-architecture.md](course-architecture.md) | Stack, propiedad del estado y alcance de la app | Al introducir librerías, capas o decisiones técnicas |
| [agent-assisted-development.md](agent-assisted-development.md) | Delegación, tests, lectura posterior y evidencia | Desde la sesión 07 o al planificar una actividad con agentes |
| [project-deliverables.md](project-deliverables.md) | Tres entregas acumulativas y AHK 3.0.0 para el proyecto | Al analizar o redactar consignas dentro de `Projects/` |
| [change-process.md](change-process.md) | Evaluación, aprobación y registro de cambios | Al recibir correcciones o nuevas decisiones |

Todos los archivos de la tabla son obligatorios para editar una clase. El agente puede centrar su revisión en las secciones relacionadas con el cambio, pero debe conocer el conjunto para detectar contradicciones.

## Cómo registrar una decisión

Una regla nueva debe indicar:

- La decisión.
- El motivo pedagógico o técnico.
- Las clases o materiales a los que aplica.
- Un ejemplo correcto cuando ayude a evitar ambigüedad.
- Una excepción, si existe.

Registra una decisión después de que el usuario la apruebe. Si todavía se está evaluando, mantenla en la conversación o en la guía afectada como propuesta.

## Jerarquía

1. La petición actual y explícita del usuario define el objetivo.
2. `AGENTS.md` define el proceso de trabajo.
3. `rules/` conserva decisiones aprobadas del curso.
4. `draft/index.md` organiza el cronograma.
5. Cada paquete en `course/` desarrolla una sesión vigente; `draft/classes/` conserva fuentes históricas.

Cuando dos niveles entren en conflicto, detén la edición y explica el conflicto. No cambies una regla aprobada de forma silenciosa.

## Estado actual

- El itinerario de 18 sesiones académicas y sus 18 paquetes textuales están aprobados definitivamente. Las guías detalladas de 23 clases se conservan como fuentes históricas de trazabilidad, no como trabajo pendiente.
- El proyecto progresivo vive en `../MediaLog-Bootcamp` con las sesiones 01–13 y sus etapas recuperables, incluidos los seeds de los talleres 03, 06, 10 y 13 sin solución de integración. Los checkpoints 14–16 y 18–19 permanecen pendientes; [el plan de producción](../progressive-project-plan.md) registra el avance real.
- La clase 01 inicia desde una carpeta de trabajo sin proyecto y crea la aplicación con Vite y pnpm.
- Las guías 01 a 22 y 24 del borrador anterior conservan el patrón de guion conceptual como referencia histórica. Su contenido útil ya fue adaptado al itinerario vigente de 18 sesiones.
- La migración conserva las fuentes en `draft/` y los paquetes aprobados dentro de `course/`. Cada sesión académica tiene lectura previa. Las presenciales 03, 06, 10 y 13 tienen una rúbrica de 100 puntos más un máximo de 10 puntos extra; la sesión 19 tiene una rúbrica cerrada de 100 puntos sin extras.
- Cada paquete aprobado contiene `session-draft.md`, `pre-class-reading.md`, `teacher-guide.md` y `student-guide.md`; las presenciales añaden `workshop-rubric.md`. El catálogo, el stack y la dirección visual Laboratorio claro están aprobados. El runtime y la galería están implementados, verificados y aprobados visualmente; las presentaciones HTML de las sesiones 01–13 forman la línea base aprobada. La guía detallada 13 se alineó con el código y queda disponible para revisión del usuario.
- La sesión 07 introduce `Trabajo con agente`, con prompts listos para copiar, lectura posterior y evidencia.
- La introducción de la sesión 07 distingue Agent Harness Kit, Context7 MCP y AutoSkills: documentación vigente, skills pertinentes y control verificable del trabajo asistido.
- Cada guía tiene su guion conceptual aprobado como fuente para producir sus diapositivas.
- Las iteraciones de clase conservan su análisis y hallazgos en `memories/`.
- Las convenciones crecerán mediante iteraciones aprobadas, sin llenar esta carpeta con decisiones hipotéticas.
