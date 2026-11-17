# Reglas para evaluar y aplicar cambios

## Evaluación previa

Cuando el usuario proponga una corrección:

1. Lee la guía afectada.
2. Revisa el checkpoint anterior y la clase siguiente.
3. Identifica el gap de comprensión o la contradicción.
4. Evalúa la propuesta contra las reglas pedagógicas y técnicas.
5. Explica qué aceptarías y qué cambiarías.

No aceptes una propuesta de forma automática. Tampoco conserves el texto existente por inercia.

## Aprobación

Si el usuario pide evaluar antes de editar:

- Presenta el flujo corregido.
- Nombra las decisiones que pasarían a `rules/`.
- Espera aprobación.

Después de la aprobación:

- Modifica la guía.
- Revisa y sincroniza `draft/index.md` aunque el cambio parezca interno a una sola guía. Si no requiere edición, registra la comprobación en la memoria.
- Actualiza la regla temática cuando la decisión sea reutilizable.
- Valida enlaces, tiempos y progresión.

## Control de secuencia

### Revisiones transversales con plan aprobado

Cuando el usuario apruebe una lista de correcciones para varias sesiones, enlaza su plan desde `TASKS.md`. El plan conserva identificadores, solicitud de origen, alcance, estado, criterio de cierre y siguiente paso. La memoria de cada corrección registra los archivos y la evidencia concreta; las convenciones aprobadas se promueven al archivo temático de `rules/`.

Trabaja una corrección por iteración e incluye sus consumidores posteriores antes de cerrarla. Esa propagación pertenece a la misma corrección y no equivale a iniciar otra sesión. Conserva la aprobación existente para los cambios directos; presenta las decisiones complejas pendientes antes de implementarlas. No conviertas la aprobación del plan en aprobación final de todas las guías.

Actualiza la resolución del `changes.md` de origen sin borrar el comentario del usuario. Distingue implementación y validación documental de la futura comprobación del proyecto ejecutable. Al cerrar, deja un siguiente paso explícito en el plan.

### Continuación por número de sesión

Antes de aceptar “la siguiente clase” o comenzar el análisis de una guía numerada:

1. Revisa en `rules/index.md` cuál es la primera clase pendiente de adaptación.
2. Compara ese número con la clase solicitada.
3. Si la solicitud salta una o más clases pendientes, avisa al usuario antes de analizar o editar la guía.
4. Continúa con el salto solo cuando el usuario confirme que es deliberado.

Este control evita que una guía posterior se refine desde un checkpoint que todavía no ha sido revisado. No impide regresar a una clase anterior para corregirla.

## Qué merece una regla

Registra decisiones como:

- Usar pnpm en todo el curso.
- Nombrar archivos de componentes con `kebab-case`.
- Mostrar estado inicial, transformación y checkpoint.
- Evitar una abstracción antes de presentar el problema.
- Reservar los talleres para aplicación de conceptos ya explicados.

Mantén dentro de una sola guía decisiones como:

- El título concreto de una tarjeta.
- El número de elementos de un fixture puntual.
- El texto de un mensaje usado solo en una actividad.

## Propagación retrospectiva de contratos

Durante la planeación, una clase posterior puede revelar que el tipo o fixture inicial no contiene un campo necesario. Cuando ocurra:

1. Confirma que una interfaz, contrato verificado o caso de uso real necesita el campo.
2. Añádelo al primer tipo canónico y a todas las entradas del fixture donde debió existir.
3. Propaga el cambio por guías, seeds, snippets, fallbacks, criterios y checkpoints intermedios.
4. Muestra el campo desde la primera interfaz cuando hacerlo reutilice conceptos ya disponibles y no añada otra dificultad principal.
5. Conserva la nulabilidad del contrato real cuando ya se conozca.

No agregues campos hipotéticos para preparar posibilidades sin un consumidor identificado. Si mostrar el campo adelanta un concepto todavía no enseñado, mantenlo en los datos y registra en qué clase comenzará a usarse.

## Compatibilidad transversal de herramientas

Antes de añadir o actualizar una librería, framework o herramienta del proyecto:

1. Consulta la documentación oficial actual y el manifest de la versión candidata.
2. Confirma el nombre del paquete, comando de instalación, rutas de importación y modo de uso elegido.
3. Comprueba requisitos de runtime, peer dependencies y compatibilidad con el scaffold y las librerías ya fijadas.
4. Identifica cambios de paquete, API o convención frente a versiones anteriores que puedan aparecer en ejemplos del curso.
5. Registra en la memoria de la iteración la fecha, las fuentes, la versión y la decisión aprobada.

Cuando una versión nueva exige un runtime o dependencia diferente, propaga el requisito hasta el primer prerrequisito canónico del curso. Revisa también:

- guías anteriores y posteriores;
- proyectos semilla y checkpoints;
- comandos, snippets e imports;
- `draft/index.md` y reglas técnicas relacionadas.

No mezcles de forma silenciosa paquetes o generaciones distintas de una misma herramienta. Por ejemplo, si la versión aprobada usa `react-router`, no copies imports de `react-router-dom` desde materiales antiguos sin verificar su vigencia.

Fija en la guía y el proyecto de la cohorte la versión aprobada para reproducir los checkpoints. Antes de iniciar una cohorte, vuelve a verificarla: una versión fijada conserva el plan, pero no garantiza por sí sola compatibilidad futura ni ausencia de vulnerabilidades.

## Conflictos

Si una corrección contradice una regla aprobada:

- Cita la regla afectada.
- Explica el efecto en otras clases.
- Propón conservarla, ajustarla o reemplazarla.
- Espera la decisión del usuario antes de editarla.

## Cierre

Informa qué archivos cambiaron y qué validaciones ejecutaste. No hagas commit salvo que el usuario lo pida.
