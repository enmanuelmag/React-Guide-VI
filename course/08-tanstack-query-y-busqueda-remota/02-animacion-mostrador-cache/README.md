# Animación 02 · El mostrador de consultas

Recurso de apoyo de la sesión 08, aprobado por el usuario el 15 de octubre de 2026 después de ajustar el archivador y las figuras. Complementa [la animación con código](../01-animacion-busqueda-cache/README.md).

## Qué muestra

Una persona pide información de Dune. El encargado del mostrador (Query Client) revisa el archivador local (caché). Si falta una respuesta, consulta al archivo central (servidor), conserva una copia y la muestra.

El dibujo es SVG vectorial 2D con personajes, mostrador, fichas y archivador. Conserva la paleta del curso, formas simples y una escena estable; no contiene código ni recursos remotos.

El archivador empieza vacío, sin entradas de películas o series preparadas. Cada caja etiquetada aparece solo cuando se almacena su respuesta y desaparece al retirar esa entrada. Las personas usan pictogramas sin rasgos faciales, con cabeza circular y hombros redondeados; referencia visual: [User Round de Lucide](https://lucide.dev/icons/user-round). Las figuras de esta escena son dibujos propios, no una dependencia de iconos.

## Ejecutar

Desde esta carpeta:

```bash
pnpm install --frozen-lockfile
pnpm dev --port 5198
```

Abre http://127.0.0.1:5198/. Para generar y comprobar:

```bash
pnpm build
pnpm test
pnpm test:browser
```

La prueba de navegador necesita el servidor de desarrollo en 5198. ANALOGY_URL permite indicar otra URL local. Los tests y su soporte viven en src/__tests__/.

## Controles

- Flechas izquierda/derecha: paso anterior/siguiente.
- Inicio/Fin: extremos del recorrido.
- Espacio: reproducir o pausar.
- Fases e hitos: saltar a un momento.
- Ritmo: 3, 5 u 8 segundos por paso.
- Extra: añade tres pasos sobre retirada por desuso.
- Guía de uso: vocabulario, límites y controles.
- Ampliar: pantalla completa.

Retroceder restaura fichas, resultados, reloj y contador; no conserva efectos del futuro. El zoom del navegador no está interceptado. En tamaños pequeños o con zoom se permite desplazamiento. Se respeta movimiento reducido.

## Recorrido principal · 23 pasos

| Pasos visibles | Qué explicar | Pregunta |
| --- | --- | --- |
| 01–03 | Título y tipo forman la etiqueta; revisamos el cajón correspondiente. | ¿La etiqueta por sí sola contiene resultados? |
| 04–08 | Petición, espera, respuesta, copia en caché y vista. | ¿Mostrar datos vacía el archivador? |
| 09–10 | Volver a una respuesta reciente conserva una sola petición. | ¿Por qué el contador no aumenta? |
| 11–16 | Series tiene otra etiqueta; las dos copias permanecen separadas. | ¿Podemos responder series con películas? |
| 17–18 | Dejamos películas inactiva y avanzamos el reloj; necesita revisión, pero no se borra. | ¿Qué cambió sin que aumentaran las peticiones? |
| 19–23 | Volver a montar la consulta muestra datos anteriores y hace un refetch en segundo plano. | ¿Podemos tener datos y estar consultando al mismo tiempo? |

Respuestas: no; no, mostrar no consume la copia; se reutiliza una respuesta reciente; no, los parámetros identifican resultados distintos; cambió la frescura; sí, existen datos mientras se comprueba una versión reciente.

## Dos tiempos diferentes

Se conserva staleTime de cinco minutos, como en la sesión 08. El reloj está preparado por pasos, no utiliza el tiempo real.

- Películas llega en 00:20.
- Series llega en 01:10.
- En 05:21, películas necesita revisión y series todavía está reciente.
- Nadie dejó películas inactiva durante cinco minutos: al volver en 05:21 su copia sigue disponible.
- El refetch se explica mediante un disparador explícito: volver a montar una consulta habilitada con datos stale y refetchOnMount permitido. En la animación se expresa como volver a usar la consulta. No se atribuye una petición automática al vencimiento del reloj.
- La respuesta nueva podría ser igual; aquí un ejemplo preparado añade Dune: Parte dos para hacer visible el cambio.

## Extra opcional · pasos 24–26

Explica gcTime por separado. Ambas consultas quedan sin consumidores; después de más de cinco minutos de desuso se retiran sus copias. Esto no borra datos del servidor. No se presenta gcTime como configuración ya añadida al código del curso.

El estado de espera, marcado como stale o fresco, es independiente de conservar la entrada. Un dato puede seguir en caché después de dejar de considerarse reciente.

## Uso docente

Puede sustituir parte de la explicación dentro de los 18 minutos conceptuales existentes, después del deck y antes del coding. No añade otro bloque de tiempo. Elegir esta analogía o un tramo de la animación técnica según la necesidad; recorrer ambas completas y el extra no es un requisito ni un ritmo ensayado.

El recurso y su estilo están aprobados. Por indicación expresa del usuario, no se añade al teacher guide. La guía docente y la presentación 08 permanecen sin cambios.

## Evidencia y límites

Ocho tests verifican las fotografías de la historia: almacenamiento tras respuesta, reutilización, separación de etiquetas, stale sin petición, refetch con datos y retirada por desuso. Playwright comprueba navegación, reversibilidad, estados, zoom, movimiento reducido, viajes y autoplay. Las capturas se generan en artifacts/, excluido de Git.

Estas pruebas verifican el simulador. No prueban React Query real, Firebase ni el backend. No se utiliza React, red real, persistencia de caché, credenciales o datos personales. Solo el flujo y la analogía son parte de la explicación.

Fuentes consultadas mediante Context7 el 15 de octubre de 2026:
- [Caching](https://tanstack.com/query/latest/docs/framework/react/guides/caching).
- [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults).
- [useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery).

