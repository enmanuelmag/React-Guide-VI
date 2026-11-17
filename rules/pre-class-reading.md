# Reglas para lectura previa y control de lectura posterior

## Propósito

Cada sesión académica de React comienza antes del encuentro. La lectura previa entrega el vocabulario mínimo y una primera imagen del problema para que la clase pueda dedicar más tiempo a explicar, construir y comprobar.

El control de lectura confirma que el estudiante recorrió el material. Se responde después de la clase; no reemplaza la explicación docente ni adelanta la solución de la práctica.

## Alcance

- Todas las sesiones virtuales y presenciales de React incluyen `pre-class-reading.md`.
- Una jornada institucional sin horas de contenido queda fuera de esta regla y no consume un número de sesión.
- La sesión 19 puede asignar una lectura conceptual breve sobre despliegue, presentación técnica o modelos de renderizado, pero no exige una implementación nueva.

## Carga de lectura

Diseña una preparación de 15 a 25 minutos. Si una fuente completa excede ese tiempo, señala capítulos, encabezados o fragmentos exactos; no asignes una portada de documentación esperando que el estudiante decida qué leer.

Usa por defecto:

- Una fuente principal oficial y actual.
- Como máximo una fuente secundaria cuando aporte una explicación, visual o contraste que la documentación principal no cubra con claridad.

Una fuente secundaria debe pertenecer a una organización o autor con trayectoria verificable. No uses contenido sin fecha, artículos de agregadores, respuestas aisladas de foros o publicaciones generadas que no indiquen sus fuentes.

## Verificación de fuentes

Antes de publicar el material:

- Abre cada enlace y confirma que sigue disponible.
- Registra título, organización o autor, URL y fecha de verificación.
- Indica la versión cuando la página dependa de una versión del framework o la librería.
- Señala exactamente qué secciones debe leer el estudiante.
- Comprueba que el texto coincide con el stack fijado para la cohorte.
- Sustituye una fuente si exige conocimientos todavía no enseñados o resuelve por completo el taller posterior.

Vuelve a verificar los enlaces antes de iniciar cada cohorte. Un enlace guardado durante la planeación no garantiza que el contenido siga vigente.

## Estructura de `pre-class-reading.md`

El archivo incluye, en este orden:

1. Sesión y tema.
2. Propósito de la preparación.
3. Tiempo estimado total.
4. Conocimientos previos necesarios.
5. Fuentes con secciones exactas y motivo de lectura.
6. Instrucciones breves para recorrer el material.
7. Vocabulario que el estudiante debe poder reconocer, sin convertirlo en una clase completa.
8. Una referencia a `reading-check.md` cuando sea útil orientar al estudiante hacia el control posterior.

## Control de lectura posterior

Cada sesión incluye `reading-check.md` con entre cuatro y seis preguntas para trasladar a la plataforma institucional después de la clase. Solo admite:

- Opción múltiple con tres o cuatro alternativas y una sola respuesta correcta.
- Verdadero o falso con una sola respuesta correcta.

No uses:

- Respuestas abiertas.
- Selección de varias respuestas.
- “Todas las anteriores” o “Ninguna de las anteriores”.
- Negaciones dobles.
- Preguntas capciosas o dependientes de un detalle irrelevante.
- Dos alternativas que puedan defenderse con la lectura.
- Código cuya respuesta requiera ejecutar algo no incluido en el material.

Las preguntas deben medir reconocimiento, comprensión o una predicción directa. Todas las respuestas se obtienen de las fuentes asignadas; no requieren buscar material adicional.

Redacta cada pregunta con lenguaje directo y una sola idea principal:

- Nombra la acción o la decisión concreta que debe reconocer el estudiante: `¿cómo se calcula?`, `¿qué dato se guarda?` o `¿qué ocurre al ejecutar...?`.
- Evita metáforas o ubicaciones abstractas como `¿dónde vive?` cuando la respuesta realmente describe cómo se calcula, se guarda o se comparte un dato.
- Usa solo vocabulario presentado en la lectura y explica el contexto necesario dentro de la pregunta.
- Escribe alternativas breves, paralelas y completas. La opción correcta debe responder exactamente lo preguntado y las incorrectas deben ser claramente distintas.

## Formato de `reading-check.md`

En `reading-check.md`, usa un formato listo para trasladar a la plataforma y no marques la respuesta:

```md
### Pregunta 1 · Opción múltiple

¿Qué responsabilidad cumple una prop en el ejemplo de la lectura?

- A. ...
- B. ...
- C. ...
- D. ...
```

```md
### Pregunta 2 · Verdadero o falso

React modifica directamente el componente hijo cuando cambia una prop.

- Verdadero
- Falso
```

La clave privada dentro de `teacher-guide.md` repite el número, indica la respuesta correcta y justifica en una o dos frases por qué es correcta. También identifica la fuente o sección que la respalda.

Mientras todavía no exista `teacher-guide.md`, conserva la clave dentro de `session-draft.md` bajo un encabezado explícito de material privado. Nunca la agregues como comentario HTML, bloque colapsable o texto oculto dentro del archivo estudiantil: el repositorio continúa permitiendo leer su fuente.

## Uso del control

- El docente copia las preguntas de `reading-check.md` a la plataforma institucional.
- El control se asigna después de la clase y comprueba la lectura junto con los conceptos explicados.
- La plataforma puede mostrar el porcentaje de aciertos, pero el cuestionario no usa la rúbrica de 100 puntos reservada para talleres presenciales.
- El docente usa los resultados para planificar recuperación o retroalimentación de la sesión siguiente.

## Control de calidad

Antes de cerrar el archivo:

- El tiempo estimado corresponde a las secciones realmente asignadas.
- Cada pregunta tiene exactamente una respuesta correcta.
- La clave docente coincide con las opciones publicadas.
- Las cuatro a seis preguntas corresponden a la lectura y al alcance ya trabajado en la clase.
- El control no entrega la solución del taller.
- Los enlaces, versiones y fecha de verificación están registrados.
