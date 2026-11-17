# Animación 01 · Peticiones HTTPS

Material de apoyo de la sesión 07. Código completo a la izquierda; petición, app, consola y navegación a la derecha. Canvas de 1920 × 1180, líneas fijas, comentarios cortos y zoom del navegador.

La app se muestra dentro de una ventana de navegador simulada, con pestaña y barra de dirección. Debajo está el inspector acoplado con Console seleccionada, barra de filtro y prompt visual. Elements, Network, la dirección y el filtro son referencias visuales; los controles interactivos son los de la app y la línea de tiempo. La consola distingue los logs del ejemplo de las anotaciones FLUJO del simulador.

## Abrir

Desde esta carpeta:

```sh
pnpm install --frozen-lockfile
pnpm dev --port 5187
```

Abre http://127.0.0.1:5187/. Usa ← y → para retroceder y avanzar, Home para volver al inicio, End para ir al cierre y Espacio para reproducir o pausar. También puedes pulsar los hitos, cambiar de capítulo, seleccionar respuesta, ritmo y pantalla completa. Command/Ctrl + permite ampliar; si el contenido supera la ventana, desplázate por la página.

## Qué estás mostrando

Es una **simulación controlada**: no ejecuta el componente React mostrado ni hace peticiones al backend. La interacción del contador es real dentro del simulador; representa el comportamiento explicado, pero no constituye una prueba de React ni de la API. Los pasos reconstruyen estados preparados para poder repetirlos y retroceder. Al cambiar de hito se restauran los clics del recorrido preparado.

El ejemplo muestra un POST a `https://bootcamp-medialog.cardor.dev/api/v2/media/search` con `{ query: 'Dune', mediaType: 'movie' }`. Los resultados y tiempos son ilustrativos. El código mostrado vive completo en `src/scenes.js`; la interfaz que mueve la explicación vive en `src/main.js`. El spinner circular pertenece a la decoración del simulador: el JSX de ejemplo muestra el texto Cargando.

Azul significa línea ejecutada en el paso. Ámbar señala una función suspendida en await, sin afirmar que esté ejecutándose continuamente. Los halos violetas indican un evento del usuario; los verdes, un cambio visible confirmado por React. Pulsan un número limitado de veces. Con movimiento reducido conservamos las indicaciones sin animar el recorrido ni el spinner.

## Recorrido docente

Utilízalo al cerrar el bloque conceptual de presentación continua, antes de abrir el editor. Sustituye parte de la explicación oral; no añade otro bloque a los 90 minutos. No alternes esta animación con escritura de código.

1. **01–03 · Evento y solicitudes.** Pulsa Consultar. Pregunta: “¿Ya cambió la pantalla cuando llamamos al setter?”. Distingue solicitar un cambio y verlo confirmado.
2. **04–06 · fetch y await.** Sigue el paquete hasta el navegador y el servidor. Define Promise como una forma de representar un resultado que todavía no está listo. await suspende esta función; no obliga a detener toda la app.
3. **07–12 · Esperar sin bloquear.** Pausa en 08 y pulsa Sumar un clic. El contador cambia y el indicador de carga permanece. Pregunta: “¿Cuál función espera? ¿Cuál puede atender este clic?”. El recorrido preparado también desglosa el handler y el commit del contador en 09 y 10.
4. **13–15 · Response y body.** El servidor responde, el navegador recibe y el handler continúa. Una Response contiene información de la respuesta; eso no significa que ya hayamos leído el body completo. response.json() tiene su propia espera.
5. **16–19 · Finalizar y mostrar.** El log de data ocurre después de leer el cuerpo. Los setters solicitan el mensaje y retirar la carga; finalmente distinguimos cálculo del JSX y commit.
6. **20 · Comprobar.** Pregunta: “¿Qué siguió funcionando durante la petición?”. Esperamos que expliquen que la función de la petición estaba suspendida mientras otro evento podía atenderse.

Analogía: haces un pedido en una cafetería, recibes una ficha y mientras lo preparan puedes conversar. La ficha representa un resultado pendiente; conversar representa otra actividad que puede avanzar durante esa espera. La analogía no describe los hilos reales del navegador.

## Concurrencia y límites

Aquí concurrencia significa que varias actividades progresan dentro del mismo intervalo: la petición está pendiente y JS puede atender otros eventos. Los fragmentos de JavaScript del hilo principal se ejecutan por turnos; no mostramos dos handlers ejecutándose simultáneamente en ese hilo.

El navegador, la red y el servidor pueden usar paralelismo internamente. No enseñes que todo el sistema es exclusivamente concurrente ni que await garantiza una UI fluida: un cálculo síncrono largo puede bloquear el hilo principal.

Un spinner CSS no necesita que React vuelva a renderizar en cada giro. Por sí solo no demuestra que el hilo de JS esté disponible; por eso incluimos el contador.

Los pasos separan eventos para explicarlos. No son un cronograma real ni garantizan que una pantalla de carga llegue a pintarse en todas las peticiones rápidas. No representamos TCP, TLS, DNS, preflight CORS, microtareas ni el reparto exacto de hilos. HTTPS cifra el transporte; no convierte un fallo HTTP en un fallo de red.

## Dos rutas de error

En el selector Respuesta elige:

- **HTTP 500:** fetch recibe una Response. response.ok es false y el código lanza el error hacia catch.
- **Fallo de red:** fetch rechaza la Promise; no existe una Response de la cual leer status.

En ambas rutas finally solicita retirar la carga. Cambiar el escenario reinicia el recorrido. Pregunta antes de avanzar: “¿Un 500 significa que fetch rechazó automáticamente?”. La respuesta es no.

## Verificar

```sh
pnpm test
pnpm build
pnpm test:browser
```

La prueba de navegador requiere el servidor en el puerto 5187 y Chromium disponible para Playwright. Recorre 60 snapshots, verifica código completo fijo, contador pendiente, halos, navegación inversa, autoplay y movimiento reducido. Capturas locales en artifacts, excluidas de Git.

## Referencias

Conceptos contrastados con documentación de MDN mediante Context7 en la preparación:

- [Uso de Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Response.json()](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)
- [Modelo de ejecución de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

No modifica el checkpoint de la sesión 07. La integración remota de la aplicación progresiva sigue perteneciendo a la sesión 08.
