# Animación 01 · Renders y estados

Material de apoyo independiente para la sesión 05. El docente conduce 22 hitos con código completo a la izquierda. La columna derecha contiene explicación del hito, vista de MediaLog, estados, actualizaciones pendientes, consola y navegación. La línea de tiempo permite repetir cualquier paso.

## Iniciar

Desde esta carpeta, con Node >=22.22.0 y pnpm 11.17.0:

```sh
pnpm install --frozen-lockfile
pnpm dev --port 5185
```

Abre `http://127.0.0.1:5185/`. Las fuentes y dependencias se sirven localmente; después de instalar, la demostración no consulta servicios externos. No abras `index.html` directamente: sus módulos necesitan el servidor. `pnpm build` genera `dist/`; `pnpm preview --port 5185` permite comprobar esa compilación.

## Conducir la demostración

| Control | Acción |
| --- | --- |
| ← / → | Retroceder / avanzar un hito |
| Inicio / Fin | Primer / último hito |
| Espacio | Reproducir o pausar, con el foco fuera de controles nativos |
| Reproducir / Pausar | Avance automático con pausas entre hitos |
| Ritmo | Pausado, normal o ágil; ajusta pausa y barrido |
| Capítulo | Saltar a una de las tres situaciones |
| Hito numerado | Recuperar exactamente ese estado, cola, vista y consola |
| Escribir Dune | Iniciar el evento preparado del input |
| Checkbox Solo series | Iniciar el evento preparado de los dos setters |
| Pantalla completa | Ampliar el lienzo para proyectar |

El lienzo lógico es 1920 × 1180, ligeramente menos alto que 16:10, y se adapta al espacio disponible conservando su proporción. La vista de la app dispone de 100 px adicionales de altura respecto al diseño anterior. Command + / Ctrl + amplía el contenido sin que el ajuste del lienzo anule ese zoom; cuando ya no cabe, puedes desplazarte por la página. Command 0 / Ctrl 0 recupera el zoom normal. Las 38 líneas del ejemplo permanecen completas y visibles a la vez, sin desplazamiento interno del código. En una pantalla pequeña, usa pantalla completa. Las flechas no interfieren con selectores ni inputs; devuelve el foco al título o a un botón de navegación para continuar. Las preferencias de movimiento reducido desactivan el barrido.

El input tiene texto preparado, no escritura libre: así el docente puede detener un evento a mitad de su explicación y recuperar cualquier hito. El checkbox también actúa como disparador de un recorrido preparado. Las funciones del ejemplo real son síncronas; las pausas son del simulador.

## Uso en sesión 05

Es un recurso conceptual opcional para el bloque de presentación continua S05-B02, antes de abrir el editor. Úsalo en lugar de una explicación equivalente dentro del tiempo de ese bloque; no añade minutos ni una tarea nueva. También sirve para una recuperación en otra reunión. No obliga a alternar presentación y coding.

| Hitos | Explicación del docente | Pregunta y respuesta esperada |
| --- | --- | --- |
| 01–05 | React llama a Catalog, obtiene estados iniciales, calcula JSX, y confirma la vista. Definir render como calcular la interfaz y commit como aplicar cambios al DOM. | ¿Definir handleQuery ejecuta su cuerpo? No: el evento lo llamará después. |
| 06–10 | El navegador recibe Dune; el evento llama al handler, leemos su value, escribimos el log y solicitamos el cambio. | Tras setQuery, ¿qué contiene query en este handler? Sigue siendo el texto del render anterior. |
| 11–13 | El siguiente render recibe Dune, recalcula JSX y confirma la vista. | ¿useState('') vuelve a vaciar el texto? No; React conserva el estado durante este montaje. |
| 14–18 | El checkbox entrega true. Registramos el log y dos cambios: activar el filtro y limpiar el texto. Termina el handler. | ¿Cuántas actualizaciones quedan pendientes? Dos. ¿Ya mostramos un resultado intermedio? No. |
| 19–21 | El siguiente render recibe ambos valores. Calcula el texto y el filtro confirmado, y aplica juntos los cambios. | ¿Qué cambia en esta pasada? query queda vacío y onlySeries queda en true. |
| 22 | Pide narrar evento → setters → render → commit. | ¿Dos setters del mismo evento significan dos vistas intermedias? No en este ejemplo síncrono: React agrupa las actualizaciones. |

Analogía: el mesero anota varias partes de un pedido antes de llevarlo a cocina. Cada setter agrega una solicitud; no se sirve una mitad del pedido por cada línea. La analogía explica la agrupación, no pretende describir todos los detalles internos de React.

Puedes detenerte en cualquier hito. Registra «Animación 01, hito NN, pregunta pendiente» y retoma desde ese número. La demostración no modifica MediaLog-Bootcamp ni cambia su checkpoint.

## Código completo del ejemplo explicado

La pantalla mantiene siempre el mismo archivo completo, con números de línea y posiciones fijos, líneas en blanco y comentarios breves. Solo cambia el resaltado: no hay scroll interno ni líneas que aparezcan o desaparezcan. Aquí está el mismo ejemplo completo; no es una instrucción para copiarlo al proyecto progresivo.

**`Catalog.jsx` · componente independiente:**

```jsx
import { useState } from 'react'

export function Catalog() {

  // Estados
  const [query, setQuery] = useState('')
  const [onlySeries, setOnlySeries] = useState(false)

  // Evento del texto
  function handleQuery(event) {
    const nextQuery = event.currentTarget.value
    console.log('Texto recibido:', nextQuery)
    setQuery(nextQuery)
  }

  // Evento del checkbox
  function handleSeries(event) {
    const checked = event.currentTarget.checked
    console.log('Solo series:', checked)
    setOnlySeries(checked)
    if (checked) setQuery('')
  }

  // Interfaz (JSX)
  return (
    <main>
      <input value={query} onChange={handleQuery} />

      <label>Solo series
        <input type="checkbox" checked={onlySeries}
          onChange={handleSeries} />
      </label>

      <p>Texto sincronizado: {query}</p>
      <p>Filtro: {onlySeries ? 'Solo series' : 'Todos'}</p>
    </main>
  )
}
```

- **Imports y sección Estados:** importar useState; definir el componente y dos estados independientes. La «foto» representa los valores de una pasada del componente.
- **Sección Evento del texto:** el handler del texto lee el value del input, registra el valor recibido y solicita actualizar query. `nextQuery` es una variable local, no un tercer estado.
- **Sección Evento del checkbox:** el handler del checkbox lee checked como booleano. La condición utiliza ese dato del evento, no onlySeries, porque el estado del render actual conserva su valor anterior. Al activar, solicita true y texto vacío; al desactivar solo solicita false.
- **Sección Interfaz (JSX):** el JSX conecta value, checked y onChange. El primer párrafo usa el mismo query que el input. El segundo muestra Solo series si onlySeries es true y Todos si es false. Esa expresión condicional se vuelve a calcular en cada render; no crea otro estado.

Usamos JSX con JavaScript en este ejemplo independiente para concentrar la lectura en eventos, estados y actualización visual. No cambia los types ni el proyecto TypeScript del bootcamp. La vista de la derecha añade rótulos y estilos didácticos alrededor del resultado de este ejemplo. Sus botones para activar recorridos son controles del simulador; no pertenecen al componente mostrado.

## Precisiones técnicas

Los halos distinguen el origen del cambio visible: violeta para escribir o activar el checkbox en el evento del usuario; verde para el resultado que React confirma en el commit. Pulsan tres veces y se detienen. El cálculo del JSX no marca todavía un cambio aplicado al DOM. La leyenda conserva las etiquetas «Usuario · evento» y «React · commit»; con movimiento reducido permanecen los colores y contornos sin pulsación.

- La app de apoyo es un simulador de estados explícitos hecho con JavaScript, Vite y GSAP. No ejecuta React ni inspecciona su reconciliador.
- El barrido azul recorre el código: render significa calcular JSX. Verde señala el resultado confirmado. React aplica al DOM los cambios necesarios; el navegador pinta después. No animamos una reconstrucción literal de toda la página.
- Un input o checkbox nativo puede mostrar el dato del evento antes del commit. Se distingue ese valor del texto sincronizado y del filtro confirmado, que conservan la vista anterior hasta confirmarse.
- La bandeja común de pendientes agrupa visualmente las solicitudes. No es una representación literal de la estructura interna de las colas de React.
- Al comenzar el siguiente render, los hooks reciben los valores procesados. No se enseña una fase externa que muta las variables del handler terminado.
- Los logs verdes rotulados LOG proceden de los console.log mostrados. FLUJO son explicaciones del simulador. La consola reinicia al entrar en otro capítulo y se restaura al navegar.
- Agrupar en este evento síncrono no significa agrupar acciones distintas del usuario. No introducimos flushSync, Effects, transiciones ni concurrencia.
- Los números de render son pasadas conceptuales. StrictMode puede volver a llamar al componente en desarrollo para comprobar pureza; no duplica por ello el evento del usuario.

Fuentes: [Estado como una instantánea](https://react.dev/learn/state-as-a-snapshot), [Agrupar actualizaciones](https://react.dev/learn/queueing-a-series-of-state-updates), [Render y commit](https://react.dev/learn/render-and-commit), [Timeline.seek de GSAP](https://gsap.com/docs/v3/GSAP/Timeline/seek()/).

## Verificar y mantener

```sh
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

El test de navegador necesita el servidor en el puerto 5185; `ANIMATION_URL` permite otro origen. Comprueba todos los hitos, límites de teclado, restauración, dos actualizaciones sin commit intermedio, interrupción de animaciones, reproducción y pausa, tamaño portátil y movimiento reducido. Guarda capturas locales en `artifacts/` (ignorado por Git).

`src/scenes.js` conserva el código mostrado y los snapshots; `src/main.js` restaura cada hito y registra el timeline pausado de movimiento. La navegación controla ese timeline; el estado pedagógico nunca depende de callbacks de una animación. `src/style.css` define el lienzo y su adaptación. Los timers solo avanzan la reproducción didáctica: no existen en el ejemplo React.
