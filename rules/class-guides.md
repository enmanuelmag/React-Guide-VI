# Reglas para las guías de clase

## Secciones mínimas

Cada guía debe indicar:

- Número, semana, modalidad y duración.
- Punto de entrada.
- Checkpoint de salida.
- Resultado de aprendizaje.
- Conceptos.
- Guion de presentación conceptual.
- Secuencia con tiempos.
- Actividades del docente.
- Actividades de los estudiantes.
- Evidencia de salida.
- Vocabulario.
- Fuera de alcance cuando ayude a proteger la progresión.

Además, cada sesión académica debe enlazar su `pre-class-reading.md` y `reading-check.md`. Las presenciales 03, 06, 10, 13 y 19 también deben enlazar `workshop-rubric.md`. La ubicación y responsabilidad de estos archivos se define en [course-materials.md](course-materials.md).

## Preparación previa

Todas las sesiones académicas de React incluyen una lectura de 15 a 25 minutos y un control de lectura cerrado de cuatro a seis preguntas. El docente publica el control después de la clase y usa los resultados para planificar recuperación o retroalimentación posterior.

La guía no duplica las fuentes o preguntas: enlaza `pre-class-reading.md` y `reading-check.md`. Consulta [pre-class-reading.md](pre-class-reading.md) para selección de fuentes, formato de preguntas y separación de la clave docente.

## Clases virtuales

Una clase virtual dura 90 minutos. La suma de los bloques debe coincidir con esa duración.

La secuencia puede variar, pero debe reservar tiempo para:

- Recuperar el checkpoint anterior.
- Explicar el concepto.
- Construir un cambio observable.
- Permitir práctica estudiantil.
- Comprobar la salida.

La guía debe nombrar el código inicial y final cuando exista una transformación estructural.

Cuando una clase introduce un símbolo de código que no existe en el checkpoint anterior, la guía docente debe permitir seguirlo sin reconstruir partes ausentes. Incluye:

- ruta exacta del archivo;
- definición completa en el paso donde se utiliza, también cuando procede de una sesión anterior;
- imports necesarios;
- al menos un consumidor visible;
- checkpoint que demuestre su efecto.

Si la construcción ocurre por etapas, muestra el scaffold inicial y consolida el archivo final. `session-draft.md`, una clase histórica o un seed futuro no sustituyen esta referencia docente.

La presentación conceptual ocurre de forma continua al inicio, con preguntas y snippets sin abrir el editor. Después se pasa al coding guiado, práctica, comprobación y cierre oral, sin alternar entre slides y código. La guía conserva las preguntas de cierre y las vincula al resultado construido. Aplica [la regla de presentación continua](presentations.md#presentación-continua-antes-del-coding).

### Ruta docente vinculada al proyecto progresivo

Desde la producción de `MediaLog-Bootcamp`, cada bloque conserva un identificador estable `SNN-BXX`, independiente de la fecha real de ejecución. La guía indica estado de entrada, archivos, código que se inserta o sustituye, responsable, pregunta de predicción, respuesta esperada, comprobación y siguiente acción. Muestra el código completo en el propio paso aunque ya exista en otra sección: el docente debe poder avanzar leyendo un solo documento en orden.

### Guía docente autosuficiente · Decisión del 9 de septiembre de 2026

Cada teacher-guide debe contener cada línea necesaria para impartir la sesión: imports, tipos, datos, JSX, funciones, configuración y estilos. El repositorio comprueba que el código funciona; no sustituye el contenido del Markdown. Aplica a la corrección de 02 y a toda futura creación o refinamiento de guías virtuales y presenciales.

- Numera las acciones dentro de cada bloque. Indica archivo, ubicación y qué insertar, reemplazar o retirar.
- Incluye el cambio exacto y el archivo completo al terminar cada transformación. Repite el código donde se necesita para evitar volver atrás o abrir otra referencia.
- No uses instrucciones operativas como “completa el tipo”, “añade los estilos de referencia” o “el resto igual” sin mostrar allí todo el contenido. No omitas líneas con puntos suspensivos o placeholders en código para copiar.
- Incluye soporte textual (CSS, fixtures, SVG y configuración), con ruta y momento de entrega dentro del bloque de coding correspondiente, después de la presentación continua. Identifica qué se copia como soporte y qué se construye con el grupo para conservar el tiempo de práctica.
- Muestra ubicación, código y corrección de cada error deliberado. Conserva los estados intermedios anteriores a la solución.
- Explica las líneas o grupos inseparables de líneas nuevas junto al código; incluye preguntas, respuestas esperadas, comprobación y paso para retomar.
- Escribe las preguntas y respuestas de cierre en la propia guía. Los enlaces sirven para ampliar o verificar; no son requisitos para conducir el paso actual.

La repetición entre transformaciones distintas es intencional: permite impartir la clase con la guía y el editor del ejercicio sin consultar un proyecto de referencia. Evita duplicar una misma instrucción en preparación y coding. Los lockfiles generados y los binarios no se transcriben: incluye su comando o procedencia, ruta y comprobación. Todo archivo textual que se escriba, explique, modifique o entregue sí debe figurar completo.

### Orden de lectura después de la presentación · Corrección aprobada

Aplica a las guías 01–04 y a futuras iteraciones. Antes de la presentación continua conserva únicamente orientación, logística, versiones, cuestionario y comprobación observable del checkpoint. Sitúa todas las instrucciones de crear, añadir, sustituir o restaurar archivos después del final de ese bloque, dentro del paso de coding que las necesita. Incluye allí también los archivos heredados como referencia, rotulados «no volver a escribir».

Ejemplo: el CSS del input de 04 se añade una sola vez en S04-B03, con el archivo completo y su explicación; no se adelanta una segunda copia en preparación. Si un seed ya contiene soporte, como el CSS de 03, indica que se comprueba y no se duplica. Su contenido completo y la alternativa para continuar desde la sesión anterior aparecen después de las slides. Los snippets conceptuales de la presentación siguen siendo explicativos y no instrucciones de edición.

Una extracción se enseña desde el código repetido o concentrado hasta la versión final. Los checkpoints intermedios conservan esas transformaciones: no parten de la solución que el grupo todavía debe descubrir. Los estilos u otros archivos entregados como soporte se identifican al comenzar el bloque de coding correspondiente y no cuentan como construcción estudiantil.

Por ejemplo, la sesión 07 conserva ambos fetchers antes de preguntar qué repiten y extraer el helper genérico. Esa explicación ocurre sobre el código visible, sin volver a las slides ni anticipar la abstracción antes del problema. Cada iteración sincroniza recorrido docente, estados ejecutables y alcance conceptual de la presentación.

Al detener una clase, registrar último bloque comprobado, cambio guardado, primer paso pendiente y evidencia ausente. La siguiente reunión recupera ese estado antes de abrir contenido dependiente. Usar un respaldo recupera archivos, pero no acredita la explicación o actividad pendiente. No renumerar sesiones ni cambiar el calendario automáticamente por un retraso.

La convención de ramas y el estado real de implementación se conservan en [el plan del proyecto progresivo](../progressive-project-plan.md).

Las ramas finales usan siempre `session-NN-end`, por ejemplo `session-01-end`. Las entradas usan `session-NN-start`; los pasos conservan `session-NN-step-XX-descripcion`. La siguiente sesión parte de la rama `-end` anterior. En el repositorio docente MediaLog-Bootcamp, `main` permanece en `session-01-start`, antes de crear la aplicación. No se mueve al terminar sesiones: el docente publica las ramas de forma gradual. Esta decisión reemplaza la convención anterior de apuntar al último cierre y no restringe la rama de trabajo de los estudiantes.

## Calendario institucional

El itinerario contiene 18 sesiones académicas:

- Trece clases virtuales de 90 minutos.
- Cinco clases presenciales de 180 minutos.
La suma del módulo es `13 × 90 + 5 × 180 = 2070` minutos, equivalentes a 34,5 horas. Una jornada institucional sin horas de contenido interrumpe el calendario, pero no consume un número ni cambia el checkpoint entre sesiones académicas.

## Clases presenciales

Una clase presencial dura 180 minutos e incluye 30 minutos de descanso.

- 75 minutos antes del descanso.
- 30 minutos de descanso.
- 60 minutos de taller.
- 15 minutos de revisión o demostración.

La guía debe separar estos bloques mediante encabezados.

## Proyecto semilla

Cada presencial debe especificar:

- Nombre propuesto del seed.
- Funcionalidad incluida.
- Archivos o partes incompletas.
- Comprobación de que el seed compila.
- Checkpoint alternativo que el docente puede compartir antes del taller.

El seed contiene el progreso necesario y omite la solución del taller.

## Taller posterior al descanso

El taller aplica conceptos que el profesor ya explicó. Debe contener:

- Encargo con contexto.
- Trabajo obligatorio.
- Restricciones.
- Actividades del docente.
- Actividades de los estudiantes.
- Criterios de aceptación.
- Entrega.
- Reto adicional separado del alcance base en las sesiones 03, 06, 10 y 13; la sesión 19 no incluye extras.

El taller es un entregable calificable. Su rúbrica base suma 100 puntos. Las sesiones 03, 06, 10 y 13 incluyen al menos una actividad opcional y permiten hasta 10 puntos extra; la sesión 19 cierra en 100 puntos sin extras. Criterios, extras cuando existan y totales aparecen en una sola tabla Markdown sin celdas combinadas. Consulta [workshops-and-rubrics.md](workshops-and-rubrics.md) para el contrato completo.

El profesor no introduce una API, hook o patrón nuevo después del descanso.

## Checkpoints

Un checkpoint describe un estado verificable del proyecto. Evita frases como “comprender componentes”. Prefiere:

> `App` renderiza `AppHeader` y `MediaCard`; ambos aparecen en React DevTools y la aplicación inicia con `pnpm dev`.

## Coherencia entre clases

Antes de cerrar un cambio:

- Comprueba que el checkpoint anterior contiene el punto de entrada.
- Comprueba que la clase siguiente no vuelve a ejecutar la misma actividad.
- Mueve el concepto si depende de una herramienta que todavía no se presentó.
- Revisa y sincroniza `draft/index.md` en cada refinamiento de clase. Si tema, actividad o checkpoint no cambian, registra en la memoria que la fila ya era coherente.
