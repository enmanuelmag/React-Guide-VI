# Plan de implementación · Presentación sesión 09

## Objetivo

Construir el deck Reveal.js de 24 diapositivas aprobado para la sesión 09, reutilizando el runtime y la dirección visual Laboratorio claro.

## Trabajo

1. Incorporar el PNG oficial de React Router a los assets locales y registrar su origen.
2. Crear `course/09-react-router-declarativo/presentation/index.html` con 24 slides, metadata, notas privadas y el entrypoint compartido.
3. Añadir a `components.css` únicamente los componentes visuales reutilizables que necesita la identidad viajera, la anatomía de URL, el árbol de rutas y los estados de validación.
4. Añadir los comandos parametrizados `session-09:dev` y `session-09:generate` al runtime.
5. Sincronizar el guion de `session-draft.md`, la memoria de iteración, `TASKS.md` y `ROADMAP.md` con el estado candidato, sin marcar la presentación como aprobada.
6. Ejecutar generación completa: build, auditoría, 24 PNG FHD, PDF y verificación.
7. Inspeccionar visualmente las 24 capturas y corregir overflow, conexiones, densidad y ambigüedad pedagógica.
8. Servir el deck en un puerto local y abrirlo para revisión del usuario.

## Criterios de cierre de la candidata

- 24 slides y 24 notas.
- Ningún asset remoto ni faltante.
- Ningún `pre code` recortado.
- El recorrido `movie + 123` puede reconstruirse sin depender de animación o color.
- `useParams()` aparece con su invocación antes de sus campos.
- El deck distingue patrón, URL real, coincidencia de ruta y validación de dominio.
- No aparecen `useMediaDetail()`, query de detalle ni `document.title`.
- El PDF estudiantil no contiene notas docentes.
- La aprobación editorial queda pendiente de la revisión visual del usuario.
