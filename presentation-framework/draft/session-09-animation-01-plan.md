# Sesión 09 · Plan de Animación 01 · Router y navegación

Fecha: 7 de octubre de 2026. Estado: dirección y creación aprobadas en conversación; primera versión implementada en el recurso de la sesión 09, pendiente de revisión visual del usuario.

La implementación añade un recorrido breve «Volver con Link» para contrastar PUSH con Atrás sin mutar los snapshots del recorrido principal. Conserva el runtime local del recurso 08 (Vite, GSAP y Prism) y siete recorridos preparados.

## Objetivo y alcance

Hacer visible cómo una navegación cambia la ubicación y cómo React Router relaciona esa ubicación con componentes. Al terminar, el estudiante puede explicar el destino de un Link, la coincidencia de una Route, los parámetros que recibe la página y la región que ocupa en Outlet.

Entrada: búsqueda remota de la sesión 08 con un resultado ilustrativo Dune, movie, 438631. Referencia de código: rama session-09-end de MediaLog-Bootcamp y la guía docente 09. Salida: detalle provisional con identidad validada. No hay petición de detalle: corresponde a la sesión 10.

Nombre previsto: `course/09-react-router-declarativo/01-animacion-router-navegacion/`. Puerto previsto: 5189, verificando disponibilidad al implementar.

## Dirección elegida

Simulador determinista por hitos, como el recurso 08, con navegador simulado y código de varios archivos. Facilita pausar entre clic, ubicación, coincidencia, parámetros y UI. Los hitos separan conceptos: no representan los tiempos internos ni cada render real de Router.

Alternativas consideradas: una app Router real aporta comportamiento ejecutable pero dificulta congelar el recorrido interno; un video lineal facilita reproducir pero pierde retroceso y exploración por hitos. Se elige el simulador reversible solicitado. No se afirma que ejecute React Router ni se modifica el historial real de la página anfitriona.

Analogía oral: URL como dirección, rutas como directorio, Router como recepción que consulta ese directorio y Outlet como espacio reservado. No representar al Router como servidor, proceso paralelo, vigilante que consulta continuamente la barra o validador del dominio.

## Composición visual

- Lienzo 1920 × 1180, igual al recurso 08; zoom del navegador permitido.
- Izquierda, aproximadamente 52%: archivo activo con ruta visible, código completo, numeración fija por archivo, scroll independiente y seguimiento de la primera línea del paso. Fuentes y colores del recurso 08, JSX espaciado, comentarios breves y condiciones explícitas.
- Derecha: título corto y una frase; navegador simulado con dirección legible, Atrás/Adelante, encabezado MediaLog y área de página; debajo, diagrama compacto de cinco etapas: Navegación → URL → Ruta → Parámetros → Pantalla.
- El diagrama conserva su geometría. Una etapa pendiente se muestra neutra; los valores y flechas cambian según el hito. La validación se explica dentro de Parámetros, sin otro panel permanente.
- Historial: franja compacta con entradas y posición actual, visible durante navegación y recorrido del historial. No duplicar URL larga en todos los nodos.
- Pie: capítulos, hitos y controles anteriores/siguiente, reproducir/pausar, inicio y pantalla completa. Preguntas y explicación extensa van al README o ayuda docente.
- Cursor ilustrativo dentro del navegador: movimiento breve hacia un destino, pausa y pulso de clic; etiqueta contextual para distinguirlo del puntero real. La fuente activa se cambia después de completar el clic, nunca a la vez que otra explicación central.
- Violeta identifica la acción del usuario; azul la ruta o línea explicada; verde la actualización de la UI; rojo suave y texto explícito el rechazo. El movimiento reducido conserva foco y resultado sin desplazamientos ni pulsos.

## Archivos visibles

No existe un archivo router separado en el checkpoint: las rutas viven en `src/App.tsx`. Se respeta esa organización.

1. `src/App.tsx`: archivo inicial y mapa de rutas recurrente.
2. `src/main.tsx`: ubicación real de BrowserRouter dentro de los providers, sin enseñar configuración nueva.
3. `src/layouts/public-layout.tsx`: AppHeader, main y Outlet.
4. `src/components/media-search-results.tsx`: Anchor con component={Link}, destino construido desde item.mediaType e item.externalId. El cursor pulsa «Ver detalle», no una tarjeta que el código no haga clicable.
5. `src/pages/media-detail-page.tsx`: invocación real `toMediaDetailInput(useParams())`, retorno inválido y detalle provisional.
6. `src/adapters/media-detail-route-params-to-input.ts`: validación y construcción del input.
7. `src/pages/search-page.tsx`: inicialización local al regresar; solo se resalta lo necesario aunque el archivo completo esté disponible.
8. `src/pages/not-found-page.tsx`: salida de la ruta desconocida.

Obtener las fuentes desde session-09-end, conservar comportamiento y nombres; solo aplicar espaciado pedagógico si es necesario y documentarlo. No insertar variables en el código para descomponer useParams: los valores intermedios se muestran en el diagrama. Cambiar de archivo conserva la numeración propia y anuncia el nombre. La navegación manual entre archivos pausa reproducción; el siguiente hito recupera el archivo y foco previstos.

## Recorrido principal: 18 hitos

| Hito | Foco del código | Acción y evidencia visible |
| --- | --- | --- |
| 01 Directorio | App.tsx, Routes | /search y resultado ilustrativo ya preparado. «Cada ruta relaciona una dirección con una página». |
| 02 Coordinador | main.tsx, BrowserRouter | Resaltar el wrapper. BrowserRouter usa el historial para mantener la ubicación disponible al árbol. No tiene pantalla propia. |
| 03 Coincidencia inicial | App.tsx, search | /search selecciona SearchPage. No animar un algoritmo literal que prueba las rutas una por una. |
| 04 Espacio compartido | public-layout.tsx | Delimitar AppHeader y Outlet; el contenido de búsqueda ocupa el segundo. |
| 05 Destino del enlace | media-search-results.tsx | Mostrar movie + 438631 → /media/movie/438631. Cursor junto a Ver detalle. |
| 06 Clic | mismo archivo, Anchor/Link | Cursor pulsa. Link gestiona la navegación interna ordinaria. No disparar una recarga ficticia. |
| 07 Ubicación e historial | mismo archivo | Añadir destino al historial simulado, actualizar barra; todavía mantener UI anterior mientras se explica el siguiente paso. |
| 08 Resolver ruta | App.tsx, ruta dinámica | Relacionar URL y patrón. Directorio decide qué elemento corresponde. |
| 09 Capturar segmentos | misma ruta | mediaType = 'movie'; externalId = '438631'. Ambos son strings; no convertir el ID en número. |
| 10 Leer parámetros | media-detail-page.tsx | useParams entrega los segmentos a esta página. El hook no consulta la API. |
| 11 Validar tipo | adapter | movie supera la comprobación movie/series. |
| 12 Validar identificador | adapter | Identificador presente y no vacío; construir GetMediaDetailInput. No afirmar que valida existencia en backend ni que exige números. |
| 13 Elegir contenido | media-detail-page.tsx | detailInput no es null; preparar el detalle provisional con texto igual al código. |
| 14 Mostrar página | public-layout.tsx | Cambia el contenido de Outlet; encabezado permanece. No implica que el layout nunca vuelva a renderizar. Cero peticiones de detalle. |
| 15 Atrás | App.tsx | Cursor pulsa Atrás; mover índice del historial sin añadir entrada. URL vuelve a /search. |
| 16 Búsqueda al volver | search-page.tsx | Se monta SearchPage; draftQuery vacío y submittedSearch null. Mostrar mensaje inicial, no restaurar tarjetas automáticamente. |
| 17 Adelante | App.tsx → media-detail-page.tsx | Cursor pulsa Adelante; recuperar URL de detalle y resolver identidad de nuevo, sin añadir entrada ni solicitar detalle. |
| 18 Cierre | App.tsx | Diagrama completo. Pregunta: «¿Quién decide qué página mostrar y quién comprueba que movie sea válido?». |

La caché de Query puede seguir existiendo al volver, pero no restaura por sí sola los estados locales de SearchPage. Esta precisión se narra brevemente en 16; no se abre una explicación nueva de caché ni se añade persistencia que el checkpoint no tiene.

## Recorridos alternativos

Cada alternativa se selecciona explícitamente, reinicia sus snapshots y termina con una salida clara. No se ejecutan todas obligatoriamente durante la clase.

| Caso | Secuencia observable | Distinción |
| --- | --- | --- |
| Parámetro inválido | URL /media/anime/438631 → ruta dinámica coincide → useParams → adapter devuelve null → URL de detalle no válida | Coincidir no valida el dominio. |
| Ruta desconocida | /una-cosa → wildcard → NotFoundPage | No existe una ruta concreta para esa dirección. |
| Segmento ausente | /media/movie → wildcard → NotFoundPage | La ruta dinámica requiere ambos segmentos; no mostrar useParams del detalle ni llamar su adapter. |
| Entrada inicial | / → ruta index → Navigate replace → /search | Reemplazar evita una entrada inicial redundante. |
| Enlace directo | documento ya cargado en /media/movie/438631 → ruta → params → detalle provisional | No se requiere un clic anterior. Abrir o recargar un enlace puede solicitar HTML al hosting; el fallback de producción no se demuestra con este simulador. |

Para enseñar escritura en la barra, marcar la acción como apertura directa preparada; no equipararla a Link ni animar que editar texto sin confirmar ya navega. Una pestaña nueva no hereda la pila de historial de la anterior.

## Qué detecta el Router

Mostrar dos entradas hacia el mismo nodo Ubicación:

- Link: la persona activa el enlace; Router solicita navegación, actualiza historial y ubicación.
- Atrás/Adelante: el navegador recorre el historial; Router recibe el cambio de ubicación y resuelve las rutas otra vez.

No enseñar que pushState dispara popstate ni que la History API por sí sola renderiza React. Los nombres pushState/popstate pueden figurar en ayuda docente, sin obligar al grupo a aprenderlos. La representación divide conceptualmente actualización y render; no promete una secuencia de frames observable en la app real.

## Uso docente

Recurso opcional después del deck completo y antes del coding. Objetivo de ensayo: 4–6 minutos para el recorrido principal, sustituyendo explicación dentro del bloque 0–18 de la guía. No sumar minutos a la agenda de 90 ni afirmar que el ritmo está validado antes del ensayo. Alternativas disponibles para dudas o repaso.

Preguntas con respuesta esperada:

- Antes del clic: «¿De dónde sale la dirección?» De mediaType y externalId del resultado, usados por Link.
- Antes del adapter: «¿anime también puede ocupar ese segmento?» Sí para la coincidencia; no para nuestro dominio.
- Ante Outlet: «¿Qué parte conserva su lugar?» El layout compartido y su encabezado; cambia la página hija.
- Antes de Atrás: «¿Se añade otra dirección?» No: se recorre una entrada anterior.
- Cierre: «¿Ya consultamos el detalle?» No; solo preparamos su identidad para la sesión 10.

## Producción posterior

1. Extraer y cotejar fuentes con session-09-end; fijar textos de UI y contrato de snapshots.
2. Preparar piloto de hitos 05–14: código, cursor, barra, diagrama, params y Outlet. Usar patrón local HTML/CSS/JS, GSAP y resaltador del recurso 08 con pnpm; confirmar requisitos de runtime antes de implementar.
3. Revisar legibilidad del piloto a 1920 × 1180 y 1366 × 768, incluido zoom. Ajustar reparto antes de producir los demás recorridos.
4. Completar historial, controles y alternativas con snapshots reversibles; toda transición interrumpida debe dejar el hito seleccionado, sin callbacks tardíos.
5. Redactar README docente autosuficiente: operación, preguntas, respuestas, límites y evidencia.
6. Enlazar desde teacher-guide 09 al recurso existente, dentro del bloque conceptual; comprobar draft/index.md y registrar que no cambian agenda ni checkpoint. Este enlace se añade al implementar, no a una carpeta que todavía no existe.
7. Revisar en navegador y entregar piloto para iteración visual. No producir animación 10 en este trabajo.

## Criterios de aceptación

- Código y textos de pantalla corresponden al checkpoint; cada archivo mantiene líneas fijas y colores acordados.
- Cada hito se reconstruye al entrar directamente, avanzar, retroceder o reiniciar; cursor, scroll, historial y fuente activa corresponden a ese hito.
- PUSH añade entrada, Atrás/Adelante mueven índice y REPLACE sustituye. Nueva navegación tras retroceder elimina el futuro del historial simulado.
- El regreso a SearchPage reinicia los estados locales; no se muestran resultados restaurados sin soporte real.
- Ruta desconocida, segmento ausente y dominio inválido producen resultados distintos cuando corresponde.
- Ningún recorrido solicita backend o detalle. No se modifica la URL ni el historial reales del anfitrión.
- Zoom, teclado, scroll manual y movimiento reducido funcionan. El cursor ilustrativo no bloquea controles ni confunde foco real.
- No hay recortes horizontales, texto diminuto para encajar ni crecimiento vertical del lienzo. Auto-scroll respeta la lectura manual hasta cambiar de hito.
- Tests de snapshots e historial, build y recorridos Chromium cubren avance, retroceso, saltos, interrupción, escenarios y dimensiones. Evidencia identificada como simulador, no integración real.

## Referencias

- [Guion de la sesión 09](../../course/09-react-router-declarativo/session-draft.md).
- [Guía docente 09](../../course/09-react-router-declarativo/teacher-guide.md).
- [Frontera con la sesión 10](../../course/10-taller-detalle-publico-y-effects/session-draft.md).
- [Recurso 08](../../course/08-tanstack-query-y-busqueda-remota/01-animacion-busqueda-cache/README.md).
- [Reglas de código](../../rules/code-and-naming.md) y [presentaciones](../../rules/presentations.md).
- [BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter), [routing declarativo](https://reactrouter.com/start/declarative/routing), [useParams](https://reactrouter.com/api/hooks/useParams), contrastados mediante Context7 el 7 de octubre de 2026. El índice Mintlify no estuvo disponible. No se verificó ni cambió la versión instalada del checkpoint.
