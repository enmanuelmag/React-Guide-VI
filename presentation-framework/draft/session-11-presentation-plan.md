# Sesión 11 · Plan de presentación aprobado

## Alcance autorizado

Crear HTML y PDF sobre el paquete conceptual aprobado de formularios, Zod y modal global. La condición de aprobación visual se cumplió el 8 de octubre de 2026: el usuario aprobó la presentación y pidió continuar MediaLog-Bootcamp y su teacher-guide. La dirección visual aprobada se reutiliza: Reveal.js, Laboratorio claro, 1920 × 1080, fuentes y assets locales.

## Narrativa

Caso conductor: seleccionar Dune desde búsqueda o detalle, abrir el mismo modal, completar estado/prioridad/notas y preparar un body válido. Un selector de Zustand lee una parte del store; Mantine Form administra campos y errores; Zod ejecuta las reglas; el adapter une identidad y valores sin acceder a otras capas.

Recorrido persistente: Elegir → Abrir → Completar → Validar → Preparar. Cada flecha de los diagramas explicita la acción. Se muestran entradas y salidas, un contraste correcto/incorrecto y los reinicios observables. Las preguntas se resuelven dentro del bloque conceptual, sin abrir el editor.

Revisión del usuario: la diapositiva 2 presenta ahora un mapa completo de las tres herramientas, el resolver y el adapter. La validación regresa a Form; identidad y valores válidos convergen en el body. El deck queda en 28 slides tras añadir este mapa y conservar la eliminación anterior de tres diapositivas.

## Ritmo propuesto

Reservar unos 25 minutos para la presentación continua: problema y responsables (4), store/modal (6), schema/formulario (9), body/reset/evidencia (6). Es una estimación para ensayar, no una deducción a partir del número de slides. La guía posterior deberá distribuir los 65 minutos restantes entre construcción, práctica y cierre, con checkpoints recuperables. Si el ensayo no cabe, condensar antes de aprobar la ruta de coding.

## Criterios de producción

- Un concepto principal por diapositiva; snippets con contexto de archivo y sin scroll.
- Sintaxis legible, JSX espaciado, condiciones con llaves, ningún ternario encadenado.
- Diferenciar el tipo inferido de la validación ejecutada, labels de values, configuración de useForm de su objeto devuelto y las dos responsabilidades de key.
- Un solo modal bajo PublicLayout; Query y Router conservan sus responsabilidades.
- Final: body preparado, no petición de creación. Trabajo con agente limitado a tests del adapter ya escrito.
- Notas privadas con pregunta, respuesta esperada y advertencias; no distribuir teacher-guide.

## Evidencia requerida

Build, auditoría FHD, PNG de cada slide, inspección visual de todas las slides, PDF con igual número de páginas y sin notas docentes. La aprobación final sigue pendiente del usuario.
