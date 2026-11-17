// Fotografías completas: volver atrás no depende de lo que ya se reprodujo.
export const chapters = [
  'El pedido', 'La primera consulta', 'Reutilizar', 'Otra etiqueta',
  'Pasa el tiempo', 'Actualizar', 'Extra · retirar',
]

const base = {
  chapter: 0, title: '', description: '', takeaway: '',
  request: 'Sin consulta', active: null, movie: 'empty', series: 'empty',
  movieVersion: 1, served: 'none', servedVersion: 1,
  requests: 0, fetching: false, clock: '00:00', effect: 'none',
  focus: 'visitor', detail: '', optional: false,
}

const beats = [
  { title: 'Un mostrador para nuestras consultas',
    description: 'Pides información. El encargado busca primero entre las respuestas que ya tiene.',
    takeaway: 'La caché guarda respuestas para reutilizarlas.', detail: 'Una ficha representa datos, no una película prestada.' },
  { title: '«Quiero buscar Dune · películas»', request: 'Dune · películas', effect: 'user',
    description: 'Entregamos el título y el tipo. Juntos forman la etiqueta de la consulta.',
    takeaway: 'La etiqueta permite reconocer exactamente qué estamos buscando.', detail: 'Dune + movie → una query key' },
  { title: 'Abrimos el cajón correcto', active: 'movie', focus: 'movie', effect: 'drawer',
    description: 'El encargado revisa Dune · películas. Todavía no hay una respuesta.',
    takeaway: 'Cajón vacío: no tenemos datos para mostrar.', detail: 'La etiqueta no contiene una respuesta por sí sola.' },
  { chapter: 1, title: 'Enviamos la primera petición', requests: 1, fetching: true, effect: 'request', focus: 'server',
    description: 'Como no tenemos datos guardados, pedimos la información al archivo central.',
    takeaway: 'Aquí sí hay una petición al servidor.', detail: 'Petición 1 · Dune / movie' },
  { title: 'Esperamos la primera respuesta', served: 'loading', effect: 'wait',
    description: 'Todavía no podemos mostrar resultados: la respuesta está de camino.',
    takeaway: 'Primera carga: esperando datos y consultando a la vez.', detail: 'Sin datos + petición en curso' },
  { title: 'La respuesta vuelve al mostrador', effect: 'response',
    description: 'El archivo central entrega una ficha con los resultados de películas.',
    takeaway: 'La respuesta pertenece a la etiqueta que la pidió.', detail: 'Ejemplo preparado: Dune · 2021' },
  { title: 'Guardamos una copia en el cajón', movie: 'fresh', fetching: false, served: 'movie', clock: '00:20', effect: 'store', focus: 'movie',
    description: 'Conservamos la respuesta y anotamos cuándo llegó. Ahora está reciente.',
    takeaway: 'La caché conserva los datos; no necesita consultarlos de nuevo de inmediato.', detail: 'Reciente durante 5 minutos · staleTime' },
  { title: 'Mostramos los resultados', served: 'movie', servedVersion: 1, focus: 'visitor', effect: 'serve',
    description: 'La persona recibe la información. La copia permanece en el archivador.',
    takeaway: 'Mostrar una ficha no consume ni vacía la caché.', detail: 'Dune · 2021' },
  { chapter: 2, title: 'Otra vez: Dune · películas', clock: '00:40', focus: 'movie', effect: 'user',
    description: 'Volvemos a pedir lo mismo antes de que pasen cinco minutos.',
    takeaway: 'Misma etiqueta: revisamos la respuesta que ya guardamos.', detail: 'La ficha sigue reciente.' },
  { title: 'Reutilizamos la ficha reciente', effect: 'serve', focus: 'visitor',
    description: 'Entregamos los datos guardados sin hacer otra petición.',
    takeaway: 'El contador de peticiones sigue en 1.', detail: 'Camino al servidor quieto: no hay viaje nuevo.' },
  { chapter: 3, title: 'Ahora pedimos Dune · series', request: 'Dune · series', active: 'series', served: 'none', focus: 'series', effect: 'user',
    description: 'El título coincide, pero el tipo cambió. Necesitamos otra respuesta.',
    takeaway: 'Películas y series tienen cajones distintos.', detail: 'Dune + series → otra query key' },
  { title: 'El cajón de series está vacío', served: 'none', effect: 'drawer',
    description: 'La ficha de películas sigue guardada. No sirve como respuesta de series.',
    takeaway: 'Tener una respuesta de otra etiqueta no llena este cajón.', detail: 'Sin placeholderData ni datos de otra consulta.' },
  { title: 'Hacemos la segunda petición', requests: 2, fetching: true, served: 'loading', focus: 'server', effect: 'request',
    description: 'Pedimos al archivo central los resultados de Dune · series.',
    takeaway: 'Otra etiqueta sin datos necesita otra petición.', detail: 'Petición 2 · Dune / series' },
  { title: 'Vuelve la respuesta de series', effect: 'response',
    description: 'Recibimos la ficha de la miniserie. No sustituye a las películas.',
    takeaway: 'Cada respuesta vuelve al cajón que le corresponde.', detail: 'Ejemplo preparado: Dune · miniserie · 2000' },
  { title: 'Dos etiquetas, dos respuestas', series: 'fresh', fetching: false, served: 'series', clock: '01:10', effect: 'store', focus: 'series',
    description: 'Guardamos series y la mostramos. La ficha de películas permanece intacta.',
    takeaway: 'El archivador conserva ambas respuestas por separado.', detail: 'Peticiones realizadas: 2' },
  { title: 'Volvemos a las películas', request: 'Dune · películas', active: 'movie', served: 'movie', servedVersion: 1, clock: '01:30', focus: 'visitor', effect: 'serve',
    description: 'Todavía están recientes. Podemos mostrarlas sin una tercera petición.',
    takeaway: 'Cambiar de consulta no borra las otras respuestas.', detail: 'Peticiones realizadas: 2' },
  { chapter: 4, title: 'Dejamos de consultar películas', request: 'Dune · series', active: 'series', served: 'series', clock: '01:40', focus: 'series', effect: 'serve',
    description: 'Mostramos series. Nadie está usando la consulta de películas en este ejemplo.',
    takeaway: 'La ficha de películas queda guardada, pero su consulta está inactiva.', detail: 'Inactiva = sin una pantalla que utilice esa consulta.' },
  { title: 'Pasan cinco minutos desde la respuesta', movie: 'stale', clock: '05:21', focus: 'movie', effect: 'clock',
    description: 'La ficha de películas pasa a «Necesita revisión». Sigue en su cajón.',
    takeaway: 'El reloj no borra los datos ni envía una petición por sí solo.', detail: 'Series aún está reciente: su respuesta llegó después.' },
  { chapter: 5, title: 'Volvemos a usar la consulta de películas', request: 'Dune · películas', active: 'movie', served: 'movie', servedVersion: 1, requests: 3, fetching: true, focus: 'visitor', effect: 'request',
    description: 'Al volver a montar esta consulta, mostramos la copia y pedimos una versión reciente.',
    takeaway: 'La copia anterior sigue visible mientras consultamos de nuevo.', detail: 'El disparador es volver a usar la consulta; no solo el reloj.' },
  { title: 'Hay datos y una petición en curso', effect: 'wait',
    description: 'La persona sigue viendo Dune. El encargado está comprobando la información.',
    takeaway: 'Mostrar datos y actualizar en segundo plano pueden ocurrir a la vez.', detail: 'Con datos + petición en curso' },
  { title: 'Llega la versión revisada', effect: 'response', focus: 'server',
    description: 'El servidor devuelve su respuesta actual. Podría coincidir con la anterior.',
    takeaway: 'Consultar de nuevo no garantiza que el contenido haya cambiado.', detail: 'En este ejemplo la respuesta incluye otra película.' },
  { title: 'Renovamos la ficha y la vista', movie: 'fresh', movieVersion: 2, servedVersion: 2, fetching: false, clock: '05:40', focus: 'visitor', effect: 'store',
    description: 'Guardamos la respuesta reciente y mostramos los resultados actualizados.',
    takeaway: 'Se renueva la información bajo la misma etiqueta.', detail: 'Ejemplo: Dune · 2021 + Dune: Parte dos · 2024' },
  { title: 'Desactualizado no significa eliminado', effect: 'none', focus: 'movie',
    description: 'Vacío: consultar. Reciente: reutilizar. Necesita revisión: mostrar y comprobar al reactivarse.',
    takeaway: 'La caché ayuda a responder rápido sin confundir consultas distintas.', detail: 'Fin del recorrido principal. El extra explica cuándo se retiran fichas.' },
  { chapter: 6, optional: true, title: 'Extra: nadie usa estas consultas', active: null, request: 'Sin consulta activa', served: 'none', focus: 'movie', effect: 'none',
    description: 'Cerramos la vista. Ahora ninguna pantalla usa películas ni series.',
    takeaway: 'El tiempo de retirada cuenta cuando la consulta queda inactiva.', detail: 'gcTime = cuánto conservar una consulta sin uso.' },
  { title: 'Extra: pasa el tiempo sin volver', movie: 'stale', series: 'stale', clock: '10:41', effect: 'clock',
    description: 'Transcurren más de cinco minutos sin consumidores de ninguna consulta.',
    takeaway: 'Este reloj de desuso es distinto del reloj de frescura.', detail: 'Ejemplo: gcTime de 5 minutos. No es staleTime.' },
  { title: 'Extra: retiramos las fichas sin uso', movie: 'empty', series: 'empty', effect: 'remove', focus: 'movie',
    description: 'La caché puede retirar ambas entradas. No cambia el archivo central.',
    takeaway: 'Eliminar una copia local no elimina los datos del servidor.', detail: 'Sin datos guardados, la próxima consulta necesitará otra petición.' },
]

export function makeStory(includeExtra = false) {
  let snapshot = { ...base }

  return beats.map((beat, index) => {
    snapshot = { ...snapshot, ...beat, id: index }
    return Object.freeze({ ...snapshot })
  }).filter((step) => includeExtra || !step.optional)
}

export function dataFor(type, version = 1) {
  if (type === 'movie') {
    if (version === 2) {
      return ['Dune · 2021', 'Dune: Parte dos · 2024']
    }

    return ['Dune · 2021']
  }

  if (type === 'series') {
    return ['Dune · miniserie · 2000']
  }

  return []
}

