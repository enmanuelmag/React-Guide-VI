# Animación 01 · Router y navegación

Apoyo docente de la sesión 09. Recorrido principal de 18 hitos y seis alternativas: tipo inválido, ruta desconocida, segmento ausente, redirección inicial, enlace directo y regreso con Link.

## Abrir

```sh
pnpm install --frozen-lockfile
pnpm dev --port 5189
```

Abre http://127.0.0.1:5189/. Flechas para avanzar y retroceder, Home/End para inicio y cierre, Espacio para reproducir o pausar. Los hitos y capítulos permiten saltar. El selector Recorrido inicia cada caso desde un estado preparado.

La columna izquierda permite scroll y selección manual de archivo. Al avanzar se recuperan el archivo y la línea del paso. Command/Ctrl + amplía la página; el lienzo conserva 1920 × 1180. Guía de uso abre una ayuda con teclado y límites.

## Qué estamos viendo

El navegador, el cursor y el historial son simulados. No se ejecuta React Router ni se modifica el historial real del navegador anfitrión. Tampoco hay peticiones al backend. Dune es un resultado ilustrativo preparado antes del recorrido.

Los ocho archivos visibles se extrajeron de la rama session-09-end de MediaLog-Bootcamp. Conservan los nombres, componentes, imports y comportamiento del checkpoint. Se dividieron imports, una condición y un texto JSX largos para evitar scroll horizontal; el código completo permanece disponible. Las rutas están en src/App.tsx, no en un archivo router inventado. Ver detalle corresponde al Anchor con component={Link}; la tarjeta completa no es un enlace.

Los hitos separan ubicación, coincidencia, parámetros y UI para explicarlos. No representan el número de renders reales ni la duración de los pasos internos. La interfaz puede conservar la pantalla anterior mientras se explica el contenido siguiente.

## Recorrido docente

Después del deck completo y antes del coding, sustituye parte de la explicación del bloque 0–18 min por este recurso. Ensaya el recorrido principal en 4–6 minutos; esa estimación no está validada en aula. La agenda sigue siendo de 90 minutos. Las alternativas sirven para dudas, no es obligatorio recorrerlas todas.

### Orientarse · 01–04

Empieza en App.tsx con el directorio de rutas. BrowserRouter envuelve la aplicación y conecta la ubicación con el árbol. /search corresponde a SearchPage. PublicLayout conserva AppHeader y reserva Outlet para la página hija.

Analogía: la URL es una dirección, las rutas son el directorio del edificio y Router coordina qué oficina corresponde. Outlet es el espacio reservado. Router no valida que el identificador exista en el servidor.

Pregunta: «¿Dónde está dibujado BrowserRouter en la app?». Respuesta: no tiene una pantalla propia; coordina la navegación.

### Navegar · 05–07

Señala cómo item.mediaType e item.externalId forman /media/movie/438631. El cursor pulsa Ver detalle. Link gestiona la navegación interna y añade el destino al historial; cambia la ubicación.

Pregunta: «¿La tarjeta le pasa un objeto completo al detalle?». Respuesta: este enlace lleva tipo e identificador en la URL; no envía la tarjeta como objeto.

### Resolver · 08–14

Compara el patrón con los segmentos reales. useParams entrega strings y toMediaDetailInput los comprueba. El adapter acepta movie/series y un ID presente, no verifica existencia remota ni exige un ID numérico.

En el código real la llamada está compuesta: toMediaDetailInput(useParams()). El diagrama separa ambos resultados para explicarlos; no es código adicional que se deba copiar.

Pregunta antes del adapter: «¿anime puede encajar en la URL?». Sí: encaja en el patrón, pero el dominio lo rechaza.

En 14 cambia el contenido de Outlet. El layout conserva su estructura; eso no garantiza que nunca vuelva a renderizar. La página muestra Detalle provisional e identidad: el fetching de detalle se implementará en la sesión 10.

### Volver · 15–18

Atrás mueve la posición del historial; no añade una entrada. Router recibe la ubicación recuperada y resuelve SearchPage otra vez. Al montarse, sus estados locales empiezan vacíos: submittedSearch es null. La caché de Query no reconstruye el formulario.

Adelante recupera la URL del detalle sin una entrada nueva. Pregunta: «¿Quién elige la página y quién valida movie?». Router elige; el adapter valida el dominio.

Los botones del navegador son controles del recorrido preparado. Ver detalle lleva al clic; Atrás y Adelante llevan a sus hitos. Volver a la búsqueda, dentro de la página, demuestra un Link con PUSH; añade /search, distinto de Atrás. Buscar reinicia la demostración preparada, no realiza una consulta.

## Alternativas

| Caso | Resultado |
| --- | --- |
| /media/anime/438631 | Coincide la ruta dinámica; adapter devuelve null; URL de detalle no válida. |
| /una-cosa | Wildcard; Página no encontrada. |
| /media/movie | Falta externalId; wildcard. No se monta MediaDetailPage ni se ejecuta su adapter. |
| / | Navigate replace sustituye la entrada por /search. |
| Enlace directo de Dune | Partimos del documento cargado en esa dirección; no requiere un clic anterior. |
| Volver con Link | Añade /search al historial con PUSH; no equivale a Atrás. |

Abrir o recargar una URL puede solicitar un documento al hosting. Este simulador no demuestra configuración de fallback de producción. Una pestaña nueva tiene su propio historial.

No afirmes que pushState dispara popstate. El Link solicita navegación y Router actualiza su ubicación; Atrás/Adelante recorren el historial y comunican un cambio. Ninguno de esos mecanismos valida por sí solo los parámetros del dominio.

## Comprobar

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

El test de navegador necesita Vite en 5189. Comprueba fuentes completas, marcadores, URL, historial, escenarios, regreso con estado vacío, reproducción, interrupción, scroll, viewport portátil y movimiento reducido. Capturas en artifacts, excluidas de Git. Verifica el simulador, no Router real ni disponibilidad del backend.

## Referencias

- [Guía docente](../teacher-guide.md).
- [Plan de diseño](../../../presentation-framework/draft/session-09-animation-01-plan.md).
- [Routing declarativo](https://reactrouter.com/start/declarative/routing).
- [BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter).
- [useParams](https://reactrouter.com/api/hooks/useParams).
