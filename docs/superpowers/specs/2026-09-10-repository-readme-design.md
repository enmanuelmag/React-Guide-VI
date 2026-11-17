# Diseño · README del repositorio

## Objetivo

Crear un `README.md` raíz en español que permita ubicar y entender los materiales de React Guide VI sin conocer antes su historia. Debe servir también como índice de trabajo para quien ya prepara o revisa sesiones.

## Lectores

- Docente o revisor que necesita localizar el paquete y la regla aplicable.
- Persona nueva que necesita entender el curso, sus fuentes y sus límites de edición.

## Contenido

El README incluirá:

1. El propósito del curso, el producto progresivo y el alcance del repositorio.
2. Un árbol breve de las carpetas raíz y una explicación de su responsabilidad.
3. La anatomía de `course/<NN>-<tema>/`, con el lector, contenido y propósito de cada archivo.
4. El ciclo de una sesión: planeación, preparación, guía docente, guía estudiantil, taller y cambios registrados.
5. El sistema de presentaciones: guion pedagógico, `presentation-framework/approved/`, `presentation-framework/draft/`, decks por sesión y artefactos HTML, assets y PDF.
6. La relación con el proyecto progresivo externo `../MediaLog-Bootcamp` y sus checkpoints.
7. Una ruta de navegación para preparar una sesión, editar un material o trabajar un deck.
8. Límites que evitan errores de publicación y trazabilidad: `course/` aprobado, `draft/` histórico, reglas obligatorias, separación docente-estudiante y uso de pnpm.

## Decisiones de redacción

- Usar español directo, enlaces internos y tablas solo donde faciliten localizar archivos.
- Describir el estado observado: 18 paquetes de sesión y rúbricas solo en 03, 06, 10, 13 y 19.
- No presentar los materiales como una guía para ejecutar el backend ni como la ubicación del proyecto React ejecutable.
- No duplicar las reglas completas; el README enlazará a la fuente canónica.

## Validación

- Comprobar enlaces Markdown locales.
- Comparar el árbol y los nombres documentados con las carpetas reales.
- Buscar referencias a artefactos inexistentes, placeholders y contradicciones con las reglas de materiales y presentaciones.
- Ejecutar `git diff --check`.
