# Diseño de presentación · Sesión 08

> Estado: narrativa y estructura aprobadas por el usuario el 8 de septiembre de 2026.

## Objetivo

Explicar la primera búsqueda remota administrada por TanStack Query siguiendo un solo caso reconocible: buscar `Dune`. La presentación debe mostrar dónde nace la intención, qué valores identifican la consulta, quién conserva la respuesta y cómo esa respuesta llega a cinco estados visibles de interfaz.

## Narrativa central

```text
borrador "Dune"
→ submit
→ query key
→ query function
→ request
→ response
→ caché
→ adapter
→ estado visible
```

El recorrido conserva `Dune` en pantalla y destaca un propietario o una conexión por vez. La animación será moderada. Las capturas y el PDF deben conservar la secuencia completa sin depender de fragments.

## Estructura de 25 diapositivas

### La necesidad

1. Portada con TanStack Query y el cambio de estado local a remoto.
2. Ruta completa que seguirá la búsqueda de `Dune`.
3. Checkpoint 07: `searchMedia()` existe, pero ningún componente administra todavía su response.
4. Pregunta: quién debe conservar los datos que llegan del servidor.
5. Propietarios: React conserva borrador y submit; TanStack Query conserva response, error y caché; el adapter deriva la forma visual.

### Identidad y ejecución

6. Anatomía de una query: `queryKey` identifica y `queryFn` obtiene.
7. Key incompleta frente a key correcta, con fondo rojo suave para la forma incorrecta.
8. `Dune/movie` y `Dune/series` como dos identidades y dos entradas de caché.
9. Query Client y QueryClientProvider, con responsabilidades y ubicación explícitas.
10. Borrador frente a búsqueda enviada.
11. Línea temporal: escribir `D`, `Du`, `Dun`, `Dune` no ejecuta requests.
12. Submit: los valores confirmados cambian la identidad remota y habilitan la consulta.
13. Snippet breve de `useMediaSearch()` con ruta de archivo, key, function y `enabled` visibles.

### Ciclo de vida y caché

14. `status` describe disponibilidad; `fetchStatus` describe ejecución.
15. Antes del submit: `pending + idle` no significa que exista un request.
16. Primera petición: `pending + fetching` produce `isLoading`.
17. Fresh frente a stale con una línea temporal de cinco minutos y la aclaración de que stale no significa borrado.
18. Experimento `Dune/movie → Dune/series → Dune/movie` con Devtools y Network.
19. Volver a una key fresh puede reutilizar la respuesta conservada sin crear otro request en la configuración docente.

### Datos en la interfaz

20. Transformación `MediaSearchItemDto → adapter → MediaSearchCardModel` con campos concretos.
21. El modelo visual se deriva durante render; no se copia `data` a otro `useState`.
22. Estados inicial, carga y error con el mismo encuadre de interfaz.
23. Estados vacío y éxito; `isFetching` aparece solo como actualización secundaria sobre datos existentes.
24. Responsabilidades visuales: Mantine presenta controles y feedback; el agente solo puede implementar el componente presentacional después de cerrar su contrato.
25. Devtools, Network y build responden preguntas diferentes. El cierre muestra la limitación siguiente: la tarjeta todavía no tiene una URL compartible.

## Reglas de contenido

- Tratar cada término como primera exposición: query, query key, query function, Query Client, Provider, caché, fresh, stale, lazy query, status y fetchStatus reciben una definición visible.
- No describir Query como magia ni como reemplazo de todo el estado de React.
- Mantener `draftQuery`, `draftMediaType` y `submittedSearch` como estado local.
- Mantener response, error, carga y caché bajo TanStack Query.
- Mostrar `isLoading = isPending && isFetching` solo después de explicar ambos ejes.
- No usar `refetch()` para pasar parámetros ni introducir `useEffect`, `skipToken`, Suspense, mutaciones o invalidaciones.
- No mostrar la solución completa de `MediaSearchResults` antes de la construcción en el editor.
- Los snippets con varios archivos deben mostrar rutas y límites explícitos.
- Las formas incorrectas usan línea roja, fondo rojo suave y explicación directa.
- Los logos oficiales de TanStack Query y Mantine se guardan como PNG locales y se registran en el manifiesto de assets.

## Movimiento

- Usar fragments únicamente para seguir el desplazamiento conceptual de `Dune` o revelar una respuesta después de una pregunta.
- Mantener un solo foco animado por slide.
- Evitar movimientos decorativos y loops.
- La vista estática debe explicar el concepto completo.

## Notas docentes

- Todas las diapositivas incluyen notas del presentador.
- Las notas aclaran preguntas esperadas, errores frecuentes y fronteras de evidencia.
- Se enfatiza que una query deshabilitada puede estar pending e idle.
- Se enfatiza que fresh depende de `staleTime` y que la demostración usa cinco minutos por decisión docente.
- Se distingue Devtools como evidencia de caché y Network como evidencia de requests observados.

## Verificación

- Confirmar 25 diapositivas y 25 bloques de notas.
- Ejecutar build, auditoría de overflow y captura FHD.
- Revisar código, tablas, conectores, logos y los cinco estados a 1920 × 1080.
- Confirmar que la presentación no introduce Router ni detalle remoto.
- Mantener el PDF definitivo diferido hasta la aprobación visual del deck.

## Fuentes técnicas

- TanStack Query v5, documentación oficial consultada mediante Context7: query keys, lazy queries, `enabled`, `isLoading`, QueryClientProvider, caché y Devtools.
- `course/08-tanstack-query-y-busqueda-remota/session-draft.md`.
- `course/08-tanstack-query-y-busqueda-remota/teacher-guide.md`.
- Checkpoint aprobado de la sesión 07 y objetivo aprobado de la sesión 09.
