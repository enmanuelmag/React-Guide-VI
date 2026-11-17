# Sesión 08 · Animación 02 · Mostrador y caché

Fecha: 15 de octubre de 2026. Animación y estilo aprobados por el usuario después de ajustar el archivador y las figuras. Por petición expresa, no se incorpora al teacher guide.

## Diseño y alcance

Dibujo vectorial 2D de manual: persona, encargado, mostrador, fichas, archivador y archivo central. Escena estable, tipografía local y paleta del curso. Se recomienda este estilo por claridad y porque cada objeto mantiene una función reconocible.

Se reutiliza Vite + GSAP de las animaciones existentes por la petición de funcionar como las anteriores. Se consultaron la entrada HyperFrames y su dominio de movimiento, aplicando timeline pausada, coordenadas calculadas y estado reversible. No se añade otro runtime ni se produce un vídeo.

23 pasos principales y 3 opcionales de retirada. Flechas, fases, hitos, reproducción, pausa, ritmo, ayuda y pantalla completa. El reloj avanza por pasos; no espera cinco minutos reales.

## Secuencia

Consulta → cajón sin respuesta → petición → respuesta → almacenar → mostrar → reutilizar → otra etiqueta → otra respuesta → stale sin borrar → volver a montar → mostrar y refetch → renovar.

El extra distingue inactividad y gcTime. Nunca representa staleTime como borrado ni como petición automática por el mero vencimiento.

## Producción y revisión

Implementación en course/08-tanstack-query-y-busqueda-remota/02-animacion-mostrador-cache. Archivos separados para historia, dibujo, estilo, controles y pruebas. Todo soporte exclusivo en src/__tests__.

No se cambian el frontend progresivo, la guía docente o el deck aprobado de 08. El README ubica el recurso dentro del tiempo conceptual existente, como apoyo alternativo, sin asegurar ritmo de aula.

Comprobar build, estados puros, recorrido completo, viaje real, navegación inversa, selección de fases, epílogo, viewport de proyección, portátil, zoom y movimiento reducido.

