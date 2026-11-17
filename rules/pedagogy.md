# Reglas pedagógicas

## Partir del conocimiento disponible

Cada clase debe comenzar desde un checkpoint que los estudiantes puedan reconocer. La guía debe nombrar:

- Qué código ya existe.
- Qué comportamiento ya funciona.
- Qué limitación motiva el concepto nuevo.
- Qué comportamiento funcionará al terminar.

No adelantes una abstracción para “preparar el futuro” si el estudiante todavía no puede observar el problema que resuelve.

## Mostrar la transformación

Una explicación técnica debe presentar tres momentos cuando el cambio altere la estructura del proyecto:

1. Estado inicial del código.
2. Cambio guiado y motivo.
3. Estado final o checkpoint.

Usa árboles de archivos, fragmentos cortos o recorridos de datos. Evita instrucciones como “separar componentes” sin indicar qué JSX existe antes, quién realiza la extracción y cómo queda `App` después.

## Mantener una dificultad principal

El estudiante debe reconocer el concepto central del bloque. Si una actividad requiere props, `children`, estado, routing y estilos nuevos, divídela.

Ejemplo aprobado para la semana 1:

- Clase 01: componentes estáticos, JSX, imports y exports.
- Clase 02: props, tipos, listas y `key`.
- Clase 03: composición de esos conceptos en un taller sin estado.

## Introducir conceptos por necesidad

- Las props aparecen cuando `MediaCard` necesita representar datos diferentes.
- `useState` aparece cuando el usuario modifica la interfaz.
- TanStack Query aparece cuando una respuesta de la API se integra por primera vez como estado remoto de la interfaz. Una clase anterior puede aislar y verificar los fetchers si no copia sus respuestas a estado local ni construye una integración visual temporal.
- React Router aparece cuando compartir, recargar y navegar una URL se vuelve necesario.
- Zustand aparece cuando el mismo modal de creación debe abrirse desde páginas distintas y el estado local deja de tener un ancestro común conveniente.

No inventes un componente, hook o store solo para aumentar la cantidad de ejemplos.

## Separar demostración, práctica guiada y trabajo individual

La guía debe identificar al responsable de cada cambio:

- **Demostración docente:** el profesor escribe y explica una técnica nueva.
- **Práctica guiada:** el grupo replica o completa un cambio con apoyo.
- **Actividad estudiantil:** el estudiante aplica lo visto sin repetir la misma instrucción.

No presentes la misma extracción como demostración y como ejercicio individual.

## Comprobar comprensión

Cada clase debe incluir evidencia observable. Combina una comprobación de ejecución con una explicación breve del estudiante.

Ejemplos:

- La aplicación inicia con `pnpm dev`.
- El estudiante señala la cadena `index.html → main.tsx → App.tsx`.
- Query Devtools muestra keys distintas para película y serie.
- Una URL de detalle abre en una pestaña nueva.

## Vocabulario

Prefiere palabras directas en títulos, flechas y explicaciones, también cuando un término técnico parezca sencillo. Por ejemplo, usa «entrega datos» o «datos del medio elegido» en lugar de «entrega identidad». Cuando la precisión lo requiera, concreta «tipo e ID del medio». Conserva los identificadores reales del código, como `identity`, y explica su significado al primer uso visible. Si un término técnico es necesario, añade una aclaración breve en la misma diapositiva; no la dejes solo en las notas privadas.

Define una palabra cuando el estudiante la necesite para seguir la explicación. Usa definiciones ligadas al ejercicio. Evita glosarios con términos que la clase no utiliza.

## Alcance explícito

Incluye una sección de fuera de alcance cuando una clase esté cerca de conceptos que se estudiarán después. Esto evita que el profesor improvise una explicación prematura y que el estudiante confunda el checkpoint.

## Explicaciones por capas

Un concepto transversal puede ampliarse cuando aparezcan nuevos prerrequisitos, pero cada mención debe cerrar la duda observable de esa clase.

Para `StrictMode`, el curso mantiene esta progresión:

- Clase 01: identificar el wrapper del template, su propósito de desarrollo y que no produce interfaz ni comprobaciones adicionales en producción.
- Clase 04: distinguir evento y render. Un handler no se repite por `StrictMode`, aunque el cuerpo del componente pueda ejecutarse nuevamente en desarrollo para revelar un render impuro.
- Clase 10: observar el ciclo adicional de un Effect, con énfasis en cleanup. Las comprobaciones de callbacks de refs se explicarán únicamente si una clase posterior introduce ese caso de uso.

No retires `StrictMode` para silenciar logs o esconder un problema. Limita cada explicación al comportamiento que el estudiante ya puede observar.
