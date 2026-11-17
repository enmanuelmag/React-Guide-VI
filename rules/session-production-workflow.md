# Flujo para producir cada sesión

## Propósito

Esta regla permite migrar y refinar el curso una sesión a la vez sin reconstruir las instrucciones en cada conversación. El usuario puede pedir `inicia la sesión 01` o `continúa con la siguiente sesión`; el agente aplica este flujo completo y se detiene en los puntos de aprobación definidos.

Las reglas temáticas siguen siendo obligatorias. Este archivo organiza cuándo leerlas, qué artefactos crear y cómo comprobar que permanecen sincronizados.

## Unidad de trabajo

Trabaja una sola sesión por iteración.

- Comienza por la primera sesión pendiente del itinerario vigente.
- No avances a otra sesión hasta que el usuario lo indique.
- Si el usuario solicita un número que salta una sesión pendiente, aplica el control de secuencia de [change-process.md](change-process.md).
- Las jornadas sin horas de contenido interrumpen el calendario, pero no consumen un número de sesión.

## Preparación obligatoria

Antes de analizar una sesión:

1. Lee `AGENTS.md`.
2. Lee [rules/index.md](index.md) completo y abre todos los archivos obligatorios.
3. Abre o crea la memoria específica de la iteración según [task-memories.md](task-memories.md).
4. Lee `draft/index.md` para confirmar el itinerario vigente.
5. Lee las fuentes antiguas de `draft/classes/` que alimentan la sesión nueva.
6. Lee el checkpoint anterior y el objetivo de la sesión siguiente.
7. Revisa la carpeta de la sesión si ya existe dentro de `course/`.
8. Registra cambios de librerías, fuentes o contratos que necesiten verificación actual.

No interpretes la guía antigua como una plantilla literal. Migra sus decisiones útiles hacia la duración, secuencia y alcance del itinerario de 18 sesiones.

## Primera fase: análisis sin edición

La primera respuesta de cada sesión presenta una propuesta y no modifica archivos de clase. Incluye:

1. Número, modalidad y duración.
2. Fuentes antiguas que se migrarán.
3. Punto de entrada disponible.
4. Checkpoint observable propuesto.
5. Límite con la sesión anterior y la siguiente.
6. Gaps, contradicciones o retrabajo detectado.
7. Concepto principal y contenido fuera de alcance.
8. Nombre recomendado para la carpeta.
9. Secuencia completa con tiempos.
10. Contenido previsto para cada artefacto textual.
11. Fuentes propuestas para la lectura previa.
12. Taller y criterios de evaluación cuando sea presencial.
13. Trabajo con agentes cuando corresponda.
14. Cambios retrospectivos necesarios en sesiones ya migradas.
15. Recomendación y alternativas cuando exista una decisión pedagógica real.

Espera la aprobación del usuario antes de crear o modificar el paquete de la sesión.

## Segunda fase: paquete textual completo

Después de la aprobación, crea todos los artefactos textuales que correspondan dentro de la misma iteración.

### Sesión virtual

```text
course/
└── <numero-slug>/
    ├── session-draft.md
    ├── pre-class-reading.md
    ├── pre-class-reading.html
    ├── reading-check.md
    ├── teacher-guide.md
    └── student-guide.md
```

### Sesión presencial

```text
course/
└── <numero-slug>/
    ├── session-draft.md
    ├── pre-class-reading.md
    ├── pre-class-reading.html
    ├── reading-check.md
    ├── teacher-guide.md
    ├── student-guide.md
    └── workshop-rubric.md
```

Las sesiones presenciales calificadas son 03, 06, 10, 13 y 19. No crees `workshop-rubric.md` en una sesión virtual.

No crees archivos o carpetas vacíos. No generes todavía `presentation/`, HTML, assets, PNG o PDF. La producción visual comenzará en una etapa posterior aprobada por el usuario.

## Orden de producción

Escribe y sincroniza los archivos en este orden:

```text
session-draft.md
→ pre-class-reading.md
→ pre-class-reading.html
→ reading-check.md
→ teacher-guide.md
→ student-guide.md
→ workshop-rubric.md, solo en presenciales
→ validación transversal
```

`session-draft.md` conserva el plan aprobado. Los demás artefactos derivan de ese plan, pero cada uno responde a un lector distinto. No copies párrafos completos entre archivos cuando cambie su propósito.

Si una corrección posterior cambia tiempos, conceptos, actividades, checkpoint, lectura, preguntas o evaluación, propaga el cambio a todos los consumidores afectados durante la misma iteración.

## Responsabilidad de los artefactos

### `session-draft.md`

Conserva:

- Identificación, modalidad y duración.
- Punto de entrada y checkpoint.
- Resultado de aprendizaje.
- Conceptos y vocabulario.
- Estado inicial, transformación guiada y estado final.
- Secuencia con tiempos.
- Actividades del docente y de los estudiantes.
- Guion de presentación.
- Plan del taller cuando corresponda.
- Fuera de alcance.
- Decisiones y simplificaciones pedagógicas.

El borrador registra el diseño de la sesión; no sustituye la narrativa docente ni la guía estudiantil.

### `pre-class-reading.md`

Aplica [pre-class-reading.md](pre-class-reading.md). Incluye:

- Propósito y tiempo estimado de 15 a 25 minutos.
- Una fuente oficial principal.
- Como máximo una fuente secundaria cuando aporte algo necesario.
- Secciones exactas, versión y fecha de verificación.
- Vocabulario previo.

### `reading-check.md`

Aplica [pre-class-reading.md](pre-class-reading.md). Contiene únicamente cuatro a seis preguntas cerradas listas para trasladar a la plataforma después de la clase. Las preguntas admiten opción múltiple con una sola respuesta correcta o verdadero/falso. No contienen respuestas abiertas, selección múltiple, alternativas ambiguas, `todas las anteriores` o `ninguna de las anteriores`. El archivo no marca la respuesta correcta.

Genera `pre-class-reading.html` con `pnpm readings:generate` antes de publicar. Conserva el Markdown como fuente y entrega el HTML autónomo al estudiante.

### `teacher-guide.md`

Contiene la narrativa que permitirá impartir la clase:

- Objetivo y preparación docente.
- Recapitulación inicial.
- Explicación teórica con ejemplos y contrastes.
- Demostración en el editor.
- Construcción interactiva con el grupo.
- Actividad estudiantil.
- Preguntas que hará el docente y respuestas esperadas.
- Errores frecuentes y cómo intervenir.
- Transiciones entre bloques.
- Checkpoints intermedios.
- Cierre conceptual.
- Plan de contingencia.
- Clave del control de lectura con respuesta, justificación y fuente.
- Solución o criterios privados del taller cuando corresponda.
- Prompts y lectura posterior para agentes cuando corresponda.

La suma de sus bloques coincide con la duración institucional.

Antes de cerrar `teacher-guide.md`, inventaría los símbolos que la sesión introduce. Cada uno debe tener ruta, definición completa o referencia previa exacta, imports, consumidor y checkpoint. Cuando el tiempo no permita escribir todos los archivos desde cero, identifica cuáles entrega preparados el docente, cuáles completa el grupo y cuáles se construyen en vivo; la guía conserva igualmente la referencia final completa.

### `student-guide.md`

Entrega al estudiante únicamente lo que necesita para seguir, practicar y comprobar:

- Objetivo de la sesión.
- Conocimientos previos.
- Punto de partida.
- Actividades en orden.
- Comandos permitidos.
- Checkpoints observables.
- Vocabulario necesario.
- Evidencia y forma de entrega.
- Enlace o referencia a la rúbrica cuando exista taller.

No incluye clave del cuestionario, respuestas docentes, solución del taller, notas privadas o contenido de sesiones futuras.

### `workshop-rubric.md`

Existe solo en las sesiones 03, 06, 10, 13 y 19. Aplica [workshops-and-rubrics.md](workshops-and-rubrics.md).

- Los criterios base suman 100 puntos.
- Las sesiones 03, 06, 10 y 13 incluyen al menos una actividad opcional; el extra suma como máximo 10 puntos y el puntaje bruto puede llegar a 110.
- La sesión 19 es una excepción aprobada: contiene 100 puntos base y no incluye actividades ni puntaje extra.
- Cuando existen extras, la nota registrada se limita a 100 cuando la plataforma no admite más.
- Criterios base, extras cuando existan, totales y nota aparecen en una sola tabla Markdown.
- No usa tablas separadas, HTML, `rowspan`, `colspan` o celdas combinadas.
- Cada criterio define evidencia observable y puntos exactos para cumplimiento completo, parcial y no demostrado.
- Cuando existe, el extra no reemplaza requisitos base ni exige un concepto nuevo.

Las sesiones 03, 06, 10 y 13 califican una aplicación práctica. La sesión 19 califica presentación, demostración y explicación; no introduce una implementación nueva.

## Duraciones

### Virtual

Una sesión virtual dura 90 minutos. La secuencia reserva tiempo para:

- Recuperar el checkpoint anterior.
- Presentar teoría.
- Demostrar un cambio.
- Construir con participación del grupo.
- Permitir práctica estudiantil.
- Comprobar y cerrar.

### Presencial

Una sesión presencial dura 180 minutos:

```text
75 minutos de explicación y práctica guiada
30 minutos de descanso
60 minutos de taller calificable
15 minutos de revisión o demostración
```

Después del descanso no introduzcas una API, hook, librería o patrón nuevo.

## Guion de presentación sin producir diapositivas

Cada `session-draft.md` y `teacher-guide.md` conserva el plan necesario para crear las diapositivas después:

- Orden y título provisional.
- Concepto de cada diapositiva.
- Conexión con conocimientos previos.
- Contrastes y errores frecuentes.
- Recurso recomendado: diagrama, mockup, snippet o pregunta.
- Nota docente y explicación oral.
- Puente hacia el editor.
- Preguntas de cierre.

No crees `presentation/` ni exportes archivos durante esta fase.

## Trabajo con agentes

Las sesiones 01 a 06 conservan trabajo manual. Desde la sesión 07 aplica [agent-assisted-development.md](agent-assisted-development.md).

Cada uso de agente incluye:

- Decisiones humanas previas.
- Prompt completo listo para copiar.
- Archivos permitidos y cambios prohibidos.
- Rutas dentro de `__tests__/` para todo test y soporte exclusivo de pruebas.
- Salida esperada y condición de parada.
- Lectura posterior obligatoria.
- Comandos de comprobación.
- Frontera de la evidencia.

La primera introducción distingue Context7 MCP, AutoSkills y Agent Harness Kit. Los tests redactados por un agente no cuentan como evidencia hasta que el estudiante los lee y ejecuta.

## Fronteras técnicas

- El backend es una URL externa preparada por el docente.
- Los estudiantes no clonan, ejecutan, configuran ni modifican `medialog-server`.
- El curso usa pnpm.
- Conserva nombres de archivos y carpetas en `kebab-case`.
- No introduzcas una herramienta antes de que exista un problema visible que resuelva.
- No uses Effects para fetching de TanStack Query, filtros, eventos o estado derivado.
- Propaga retrospectivamente un contrato nuevo cuando una sesión posterior revele un consumidor real.
- Conserva los cambios existentes del usuario.
- No elimines ni muevas `draft/`.
- No hagas commits, ramas o tags salvo petición explícita.

## Tercera fase: validación transversal

Antes de cerrar la sesión:

1. Comprueba todos los enlaces Markdown locales.
2. Confirma que los tiempos sumen 90 o 180 minutos.
3. Confirma que el checkpoint sea observable.
4. Revisa la frontera con las sesiones vecinas.
5. Busca `TODO`, `TBD`, placeholders y actividades duplicadas.
6. Confirma que la lectura use fuentes vigentes y secciones exactas.
7. Confirma que `reading-check.md` contenga entre cuatro y seis preguntas cerradas con una sola respuesta correcta.
8. Comprueba que la clave exista en `teacher-guide.md` y no aparezca en archivos estudiantiles.
9. Si existe rúbrica, comprueba mediante una suma que la base sea 100; en las sesiones 03, 06, 10 y 13 el extra no excede 10, y en la sesión 19 no existe extra.
10. Comprueba que la rúbrica completa use una sola tabla.
11. Confirma que `teacher-guide.md`, `student-guide.md` y `session-draft.md` describan el mismo flujo.
12. Revisa y sincroniza `draft/index.md`. Si no necesita cambios, registra la comprobación en la memoria.
13. Actualiza la memoria de la iteración y `memories/index.md` cuando corresponda.
14. Ejecuta `git diff --check`.
15. Comprueba que ningún símbolo nuevo dependa de una definición presente solo en `session-draft.md`, una clase histórica o un seed todavía inexistente.

Distingue validación documental de ejecución. No afirmes que un proyecto compila, funciona en navegador o consume el backend cuando solo revisaste Markdown.

## Cierre y continuación

La respuesta final de cada iteración informa:

- Carpeta y archivos creados o modificados.
- Resultado de aprendizaje y checkpoint.
- Fuentes verificadas.
- Preguntas y rúbrica comprobadas.
- Cambios retrospectivos realizados.
- Validaciones ejecutadas y sus límites.
- Decisiones que requieren atención en la siguiente sesión.

Después se detiene. Cuando el usuario escriba `continúa con la siguiente sesión`, identifica la primera pendiente y repite este flujo desde la preparación obligatoria.

## Mensaje mínimo para iniciar

```text
Lee `AGENTS.md` y aplica completo `rules/session-production-workflow.md`. Comienza con la sesión 01. En tu primera respuesta presenta el análisis y la propuesta de migración; no edites los archivos de la sesión hasta que yo apruebe el diseño.
```

Para continuar después de cerrar una sesión:

```text
Continúa con la siguiente sesión aplicando completo `rules/session-production-workflow.md`. Revisa la memoria, el checkpoint anterior y la siguiente dependencia antes de presentar tu propuesta.
```
