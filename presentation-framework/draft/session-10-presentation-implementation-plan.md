# Plan de implementación · Presentación sesión 10

## Objetivo

Construir el deck Reveal.js de 27 diapositivas aprobado para la sesión 10, reutilizando el runtime y la dirección visual Laboratorio claro. La candidata debe explicar de forma progresiva cómo viaja la identidad desde la URL hasta el contenido remoto y cómo un Effect sincroniza `document.title` sin apropiarse del fetching.

## Archivos en alcance

- Crear `course/10-taller-detalle-publico-y-effects/presentation/index.html`.
- Extender `presentation-framework/approved/src/styles/components.css` únicamente con patrones reutilizables de la sesión 10.
- Actualizar `presentation-framework/approved/package.json` con `session-10:dev` y `session-10:generate`.
- Reutilizar los logos locales de React, TanStack Query y Vitest; registrar cualquier cambio requerido en `public/assets/assets.json`.
- Sincronizar `course/10-taller-detalle-publico-y-effects/session-draft.md`, la memoria de iteración, `TASKS.md` y `ROADMAP.md` con el estado de candidata.

## Construcción

### 1. Preparar la estructura del deck

1. Crear el HTML con metadata de la sesión, entrypoint compartido y 27 secciones.
2. Asignar a cada slide un `data-slide-id`, una geometría aprobada y los casos semánticos correspondientes.
3. Añadir exactamente una nota docente privada por diapositiva.
4. Mantener la slide 26 como separador y puente al taller; reservar la 27 para el cierre posterior.

### 2. Construir el recorrido visual persistente

1. Crear una línea reutilizable para `URL → input → query → DTO → modelo → interfaz → document.title`.
2. Permitir que cada slide marque una etapa activa sin ocultar las demás.
3. Usar flechas con punta y verbos concretos.
4. Conservar el estado final comprensible en la exportación PDF sin depender de fragments.

### 3. Implementar apertura y consulta dependiente

1. Recuperar el checkpoint aprobado de la sesión 09 con la URL de Dune.
2. Mostrar la limitación de la página provisional.
3. Separar propietarios mediante un diagrama plano, acompañado por logos locales cuando corresponda.
4. Construir gradualmente la familia de query keys.
5. Contrastar input válido e input nulo dentro de una sola diapositiva de `enabled`.
6. Explicar `status`, `fetchStatus` e `isLoading` desde el objeto `detailQuery` producido por `useMediaDetail()` y `useQuery()`.
7. Mostrar el orden correcto del hook antes de los retornos y un caso incorrecto sobre fondo rojo suave.

### 4. Implementar respuesta, ramas y transformación

1. Presentar un DTO completo y concreto de Dune antes de abreviar otros datos.
2. Construir el mapa de cinco ramas con condición, significado, actividad de red y resultado visible.
3. Contrastar URL inválida con `catalog: null`.
4. Contrastar error remoto con contenido ausente.
5. Mostrar pares explícitos del adapter, por ejemplo `coverUrl → posterUrl` y `releaseYear → releaseLabel`.
6. Presentar `MediaDetailContent` con contrato de props nombrado y destructuring dentro del cuerpo.
7. Presentar `PageState` como componente visual que recibe una variante y un callback opcional sin importar Query o Router.

### 5. Implementar Effect, cleanup y Strict Mode

1. Mostrar el título residual como error observable.
2. Definir `document.title` como sistema externo.
3. Presentar el Effect sin cleanup como forma incorrecta.
4. Construir la corrección en cuatro pasos: guardar, escribir, devolver cleanup y restaurar.
5. Mostrar `[title]` como dependencia reactiva usada por el Effect.
6. Explicar `setup → cleanup → setup` como comprobación exclusiva de desarrollo bajo Strict Mode.

### 6. Construir taller y cierre

1. La slide 26 debe indicar el checkpoint inicial, el trabajo estudiantil y las piezas que no se entregan resueltas.
2. La slide 27 debe contener entre dos y cuatro preguntas con respuestas completas y explícitas.
3. Separar Vitest, build, Devtools, matriz manual y preview local por sus fronteras de evidencia.
4. Cerrar con el puente hacia el modal global de la sesión 11 sin introducir Zustand o formularios.

## Reglas de código y recursos

- No mostrar campos de Query aislados antes de su invocación de origen.
- No usar tipos inline en componentes didácticos.
- Separar definición y consumo cuando pertenezcan a archivos distintos.
- Mostrar rutas de archivo y roles.
- Evitar snippets con solución completa de `MediaDetailPage`.
- Reutilizar `react-official.png`, `tanstack.png` y `vitest.png` conservando proporciones.
- No añadir dependencias visuales al runtime.
- No usar assets remotos durante presentación o exportación.

## Verificación automática

1. Ejecutar el generador completo de la sesión 10.
2. Confirmar 27 slides y 27 notas docentes.
3. Exigir 0 incidencias de auditoría, incluido overflow interno de `pre code`.
4. Verificar 27 PNG FHD y un PDF de 27 páginas.
5. Confirmar que el PDF no contiene notas docentes privadas.
6. Ejecutar `git diff --check` y buscar placeholders.

## Revisión visual manual

1. Inspeccionar las 27 rasterizaciones a tamaño consistente.
2. Revisar densidad, alineación, legibilidad y ritmo entre slides simples y densas.
3. Confirmar que las flechas conectan los nodos correctos y que sus etiquetas no se superponen.
4. Comprobar que cada estado puede identificarse sin depender solo del color.
5. Confirmar que el código no se corta y mantiene el tamaño mínimo aprobado.
6. Corregir manualmente HTML o CSS cuando una composición particular lo requiera.
7. Regenerar el deck completo después de las correcciones finales.

## Criterios de cierre de la candidata

- 27 diapositivas y 27 notas docentes.
- La identidad `movie + 123` puede seguirse de principio a fin.
- Cada etapa muestra entrada, propietario, decisión y salida.
- `detailQuery` conserva su origen explícito.
- La query deshabilitada no se confunde con una carga activa.
- Las cinco ramas tienen condiciones y resultados visibles diferentes.
- DTO, modelo y componente mantienen fronteras comprensibles.
- El Effect solo sincroniza `document.title` y muestra cleanup.
- Strict Mode se explica como comprobación de desarrollo.
- No se revela la integración final del taller.
- El PDF estudiantil no contiene notas docentes.
- La aprobación editorial queda pendiente de la revisión visual del usuario.

