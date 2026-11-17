# Reglas para materiales por sesión

## Propósito

Cada sesión tendrá una carpeta canónica que reúna planeación, preparación previa, guía docente, guía estudiantil y presentación. Esta estructura evita buscar partes de una clase en ubicaciones distintas y permite publicar únicamente los artefactos que corresponden a los estudiantes.

## Migración desde `draft/`

`draft/` conserva las guías provisionales de la planeación anterior. Durante la migración a 18 sesiones:

- No elimines, muevas ni renombres los archivos existentes de `draft/`.
- Copia y adapta el contenido necesario dentro de `course/`.
- Trata la guía nueva como una migración, no como una duplicación literal: debe respetar el calendario vigente, las reglas actuales y los checkpoints vecinos.
- Conserva `draft/index.md` como índice histórico hasta que el usuario apruebe retirar esa fuente.
- No presentes `course/` como material definitivo mientras sus guías sigan marcadas como borrador.

## Carpeta canónica

Usa un número de dos dígitos y un slug en `kebab-case`. Este ejemplo corresponde a una sesión presencial:

```text
course/
└── 03-taller-catalogo-estatico/
    ├── session-draft.md
    ├── pre-class-reading.md
    ├── pre-class-reading.html
    ├── reading-check.md
    ├── workshop-rubric.md
    ├── teacher-guide.md
    ├── student-guide.md
    └── presentation/
        ├── index.html
        ├── assets/
        └── presentation.pdf
```

No todas las piezas nacen al mismo tiempo:

- `session-draft.md` se crea durante la migración inicial y conserva el plan que todavía se está refinando.
- `pre-class-reading.md` existe en todas las sesiones académicas de React.
- `workshop-rubric.md` existe únicamente en las sesiones presenciales calificadas: 03, 06, 10, 13 y 19.
- `teacher-guide.md` y `student-guide.md` se producen en la misma iteración después de aprobar el plan de la sesión.
- `presentation/` se produce en una etapa posterior aprobada por el usuario.
- Una jornada institucional sin horas de contenido no recibe materiales React ni consume un número de sesión.

No crees archivos vacíos para completar el árbol. Añade cada artefacto cuando empiece su etapa de trabajo.

La creación y sincronización de este paquete siguen [session-production-workflow.md](session-production-workflow.md).

## Responsabilidad de cada archivo

### `session-draft.md`

Conserva la planeación provisional:

- Punto de entrada y checkpoint.
- Resultado de aprendizaje.
- Conceptos y progresión.
- Secuencia con tiempos.
- Actividades del docente y de los estudiantes.
- Plan del taller cuando corresponda.
- Guion de presentación.
- Decisiones pendientes y fuera de alcance.

No debe convertirse por acumulación en la guía docente final. Cuando la sesión se apruebe, su contenido se distribuye entre los artefactos finales y el borrador permanece como registro de planeación.

### `pre-class-reading.md`

Es la fuente Markdown editable de la preparación previa. Incluye fuentes concretas, instrucciones de lectura y vocabulario. Sigue [pre-class-reading.md](pre-class-reading.md).

### `pre-class-reading.html`

Es la versión distribuible de la lectura previa. Se genera desde `pre-class-reading.md` con `pnpm readings:generate` en `presentation-framework/approved/`; incorpora sus estilos y no depende de rutas o recursos locales, por lo que se puede cargar como archivo en Aula Virtual.

### `reading-check.md`

Contiene únicamente las cuatro a seis preguntas cerradas del control de lectura posterior. No incluye respuestas correctas, instrucciones de entrega ni la clave docente.

### `workshop-rubric.md`

Describe el taller calificable posterior al descanso o, en la sesión 19, la presentación final. Incluye objetivo, punto de partida, encargo, restricciones, evidencias, entrega y la única tabla de evaluación. Sigue [workshops-and-rubrics.md](workshops-and-rubrics.md).

### `teacher-guide.md`

Es material privado del docente. Conserva:

- Narrativa y secuencia detallada de la sesión.
- Preguntas que el docente hará durante la explicación.
- Respuestas esperadas y errores frecuentes.
- Clave del control de lectura con una justificación breve por respuesta.
- Solución o checkpoint docente del taller.
- Prompts para agentes, condiciones de parada y evidencia, cuando correspondan.
- Plan de contingencia si una API, herramienta o agente no está disponible.

No se copia al repositorio progresivo de los estudiantes.

### `student-guide.md`

Contiene solo lo que el estudiante necesita para seguir y comprobar la sesión:

- Objetivo en lenguaje directo.
- Punto de partida.
- Actividades y checkpoints visibles.
- Comandos permitidos.
- Vocabulario necesario.
- Evidencia y forma de entrega.
- Rúbrica estudiantil cuando exista taller.

No incluye claves, soluciones, notas privadas, respuestas esperadas ni contenido de sesiones futuras.

### `presentation/`

- `index.html` es la fuente editable de las diapositivas.
- `assets/` contiene recursos locales requeridos por esa presentación.
- `presentation.pdf` es el artefacto distribuible.

La producción y verificación visual siguen [presentations.md](presentations.md). No edites el PDF como fuente primaria cuando exista el HTML.

## Fuente privada y distribución estudiantil

`React-Guide-VI` es la fuente de verdad de los materiales. El repositorio progresivo de la aplicación recibe únicamente artefactos estudiantiles aprobados.

En la rama de una sesión, conserva el material de esa sesión y de todas las anteriores:

```text
course/
├── 01-react-jsx-y-proyecto/
│   ├── student-guide.md
│   └── presentation.pdf
└── 02-props-listas-y-typescript/
    ├── student-guide.md
    └── presentation.pdf
```

Cada rama añade la carpeta de la sesión actual. No copies de nuevo todas las carpetas anteriores mediante un proceso manual si ya forman parte de la historia de la rama.

No publiques en el repositorio progresivo:

- `teacher-guide.md`.
- Claves de cuestionarios.
- Soluciones de talleres.
- Presentaciones o guías de sesiones futuras.
- Variables de entorno, tokens o credenciales.

## Verificación al cerrar una sesión

- Los nombres y enlaces internos usan la carpeta canónica.
- La guía estudiantil y el PDF corresponden a la misma versión de la sesión.
- La clave docente no aparece en los artefactos públicos.
- La rúbrica publicada coincide con la usada para calificar.
- La rama progresiva contiene las sesiones anteriores y la actual, pero no adelanta soluciones futuras.
- `draft/` permanece intacto mientras siga siendo fuente de migración.
