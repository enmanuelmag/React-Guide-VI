// The displayed component is a complete teaching example. The simulator does
// not execute it: each milestone owns an immutable, reproducible snapshot.
export const codeLines = [
  "import { useState } from 'react'",
  "",
  "export function Catalog() {",
  "",
  "  // Estados",
  "  const [query, setQuery] = useState('')",
  "  const [onlySeries, setOnlySeries] = useState(false)",
  "",
  "  // Evento del texto",
  "  function handleQuery(event) {",
  "    const nextQuery = event.currentTarget.value",
  "    console.log('Texto recibido:', nextQuery)",
  "    setQuery(nextQuery)",
  "  }",
  "",
  "  // Evento del checkbox",
  "  function handleSeries(event) {",
  "    const checked = event.currentTarget.checked",
  "    console.log('Solo series:', checked)",
  "    setOnlySeries(checked)",
  "    if (checked) setQuery('')",
  "  }",
  "",
  "  // Interfaz (JSX)",
  "  return (",
  "    <main>",
  "      <input value={query} onChange={handleQuery} />",
  "",
  "      <label>Solo series",
  "        <input type=\"checkbox\" checked={onlySeries}",
  "          onChange={handleSeries} />",
  "      </label>",
  "",
  "      <p>Texto sincronizado: {query}</p>",
  "      <p>Filtro: {onlySeries ? 'Solo series' : 'Todos'}</p>",
  "    </main>",
  "  )",
  "}"
];

const lineMap = {"4":[3],"5":[6],"6":[7],"7":[10],"8":[11],"9":[12],"10":[13],"11":[14],"12":[17],"13":[18],"14":[19],"15":[20],"16":[21],"17":[22],"18":[25],"19":[34],"20":[35],"21":[25],"22":[27],"23":[30],"24":[31],"25":[34],"26":[35],"27":[36],"28":[37]};

export const chapters = [
  { title: '01 · Primer render', start: 0, end: 4 },
  { title: '02 · Cambiar el texto', start: 5, end: 12 },
  { title: '03 · Dos setters juntos', start: 13, end: 21 },
];

const empty = { query: '', onlySeries: false };
const dune = { query: 'Dune', onlySeries: false };
const series = { query: '', onlySeries: true };
const textLog = { kind: 'LOG', text: 'Texto recibido: Dune' };
const seriesLog = { kind: 'LOG', text: 'Solo series: true' };
const flow = text => ({ kind: 'FLUJO', text });
const pendingText = [{ state: 'query', value: 'Dune' }];
const pendingSeries = [{ state: 'onlySeries', value: true }];
const pendingBoth = [...pendingSeries, { state: 'query', value: '' }];

function step(chapter, title, explanation, options = {}) {
  return {
    chapter, title, explanation, phase: 'RENDER', lines: [], codeMode: 'render',
    snapshot: empty, committed: null, queue: [], logs: [], render: 1,
    note: '', milestone: title, ...options,
  };
}

export const steps = [
  step(0, 'React llama al componente', 'Al abrir la app, React ejecuta Catalog para calcular qué mostrar.', { lines: [4], milestone: 'Llamada', note: 'Render = ejecutar el componente y calcular su JSX.', logs: [flow('Comienza el primer render.')] }),
  step(0, 'Dos estados, dos valores iniciales', 'En el primer montaje, useState entrega texto vacío y false.', { lines: [5, 6], milestone: 'Estados', note: 'React conserva estos estados entre renders.', logs: [flow('query = "" · onlySeries = false')] }),
  step(0, 'Preparamos los valores para la vista', 'El texto está vacío y el filtro está en Todos. El JSX utilizará esos dos estados.', { lines: [5, 6], milestone: 'Valores', note: 'Los dos controles tienen estados independientes.', logs: [flow('La vista recibirá texto vacío y filtro Todos.')] }),
  step(0, 'El JSX describe la interfaz', 'Las funciones de los handlers se definen; sus cuerpos todavía no se ejecutan.', { lines: [21, 22, 23, 24, 25, 26, 27, 28], milestone: 'JSX', sweep: true, note: 'El barrido representa el recorrido del componente.', logs: [flow('JSX calculado. Los handlers quedan conectados.')] }),
  step(0, 'La interfaz aparece', 'Commit: React aplica al DOM el resultado inicial y el navegador lo muestra.', { phase: 'COMMIT', committed: empty, milestone: 'Vista', changed: ['app'], note: 'Primero calcular; después aplicar los cambios.', logs: [flow('Commit inicial: la aplicación ya es visible.')] }),
  step(1, 'El usuario cambia el input', 'Simulamos un evento cuyo texto recibido es Dune. onChange llama a handleQuery.', { phase: 'EVENTO', lines: [22, 7], codeMode: 'text', committed: empty, nativeText: 'Dune', milestone: 'Evento', note: 'El campo DOM recibe el texto; el párrafo todavía muestra "".', logs: [flow('onChange → handleQuery(event)')] }),
  step(1, 'Leemos el texto del evento', 'event.currentTarget.value contiene Dune. Lo guardamos en nextQuery, una variable local.', { phase: 'HANDLER', lines: [8], codeMode: 'text', committed: empty, nativeText: 'Dune', milestone: 'Leer', note: 'nextQuery = "Dune" · query del render = "".', logs: [flow('nextQuery = "Dune"')] }),
  step(1, 'Se ejecuta console.log', 'La consola recibe el nuevo texto antes de llamar al setter.', { phase: 'HANDLER', lines: [9], codeMode: 'text', committed: empty, nativeText: 'Dune', milestone: 'Log', note: 'Este mensaje sí procede del console.log del ejemplo.', logs: [textLog] }),
  step(1, 'setQuery solicita un cambio', 'React recibe la actualización. query sigue siendo "" dentro de este handler.', { phase: 'HANDLER', lines: [10], codeMode: 'text', committed: empty, nativeText: 'Dune', queue: pendingText, milestone: 'Setter', note: 'Un setter solicita un nuevo render; no cambia la foto actual.', logs: [textLog, flow('Pendiente: query → "Dune"')] }),
  step(1, 'El handler termina', 'Ya no queda código del evento por ejecutar. React puede procesar la actualización.', { phase: 'FIN DEL EVENTO', lines: [11], codeMode: 'text', committed: empty, nativeText: 'Dune', queue: pendingText, milestone: 'Fin', note: 'La pausa es didáctica. El handler real no tiene esperas.', logs: [textLog, flow('handleQuery termina; comienza el siguiente render.')] }),
  step(1, 'El siguiente render recibe Dune', 'Al procesar la actualización, useState devuelve Dune; el otro estado sigue en false.', { lines: [4, 5, 6], snapshot: dune, committed: empty, nativeText: 'Dune', render: 2, milestone: 'Estado nuevo', note: 'useState(\'\') no vuelve a vaciar el estado en cada render.', logs: [textLog, flow('Render 2: query = "Dune" · onlySeries = false')] }),
  step(1, 'Volvemos a calcular el JSX', 'Se calcula el JSX con Dune. Los handlers no se ejecutan.', { lines: [18, 19, 20, 21, 22, 25, 26, 27, 28], snapshot: dune, committed: empty, nativeText: 'Dune', render: 2, milestone: 'Render', sweep: true, note: 'El siguiente JSX muestra Dune y mantiene el filtro en Todos.', logs: [textLog, flow('JSX preparado: texto Dune · filtro Todos.')] }),
  step(1, 'La vista queda sincronizada', 'Commit: el párrafo muestra Dune; el filtro continúa en Todos.', { phase: 'COMMIT', snapshot: dune, committed: dune, render: 2, milestone: 'Vista nueva', changed: ['echo'], note: 'React aplica los cambios necesarios; no reconstruye toda la página.', logs: [textLog, flow('Commit: texto sincronizado actualizado.')] }),
  step(2, 'Activamos Solo series', 'Partimos de Dune. Activar el checkbox llama a handleSeries con checked = true.', { phase: 'EVENTO', lines: [23, 24, 12], codeMode: 'series', snapshot: dune, committed: dune, nativeChecked: true, render: 2, milestone: 'Evento', note: 'Un evento nuevo; no se mezcla con el evento de texto anterior.', logs: [flow('onChange → handleSeries(event)')] }),
  step(2, 'Leemos el checkbox y escribimos el log', 'checked es true. La foto del render sigue siendo Dune y false.', { phase: 'HANDLER', lines: [13, 14], codeMode: 'series', snapshot: dune, committed: dune, nativeChecked: true, render: 2, milestone: 'Leer + log', note: 'checked es el dato del evento; onlySeries es el estado del render.', logs: [seriesLog] }),
  step(2, 'Primer setter: activar el filtro', 'setOnlySeries(true) solicita cambiar un estado. La vista aún no se confirma.', { phase: 'HANDLER', lines: [15], codeMode: 'series', snapshot: dune, committed: dune, nativeChecked: true, queue: pendingSeries, render: 2, milestone: 'Setter 1', note: 'Pendiente 1: onlySeries → true.', logs: [seriesLog, flow('Pendiente: onlySeries → true')] }),
  step(2, 'Segundo setter: limpiar el texto', 'Como checked es true, setQuery(\'\') solicita limpiar la búsqueda en el mismo evento.', { phase: 'HANDLER', lines: [16], codeMode: 'series', snapshot: dune, committed: dune, nativeChecked: true, queue: pendingBoth, render: 2, milestone: 'Setter 2', note: 'Dos actualizaciones pendientes; todavía no hay una vista intermedia.', logs: [seriesLog, flow('Pendientes: onlySeries → true · query → ""')] }),
  step(2, 'Termina el pedido completo', 'Como un mesero que anota todo el pedido antes de llevarlo a cocina, React agrupa los cambios.', { phase: 'FIN DEL EVENTO', lines: [17], codeMode: 'series', snapshot: dune, committed: dune, nativeChecked: true, queue: pendingBoth, render: 2, milestone: 'Fin', note: 'Batching = agrupar actualizaciones antes de mostrar el resultado.', logs: [seriesLog, flow('handleSeries termina. Se procesan ambas actualizaciones.')] }),
  step(2, 'El render recibe ambos valores', 'En esta siguiente pasada, useState entrega texto vacío y true. Ambos cambios pertenecen al mismo resultado.', { lines: [4, 5, 6], snapshot: series, committed: dune, nativeChecked: true, render: 3, milestone: 'Estados nuevos', note: 'Una vista coherente: filtro activado y búsqueda limpia.', logs: [seriesLog, flow('Render 3: query = "" · onlySeries = true')] }),
  step(2, 'Calculamos con los dos cambios', 'El JSX usa texto vacío y el filtro Solo series. Ambos valores ya pertenecen a esta pasada.', { lines: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], snapshot: series, committed: dune, nativeChecked: true, render: 3, milestone: 'Render', sweep: true, note: 'No ejecutamos los handlers durante este cálculo.', logs: [seriesLog, flow('JSX preparado: texto vacío · filtro Solo series.')] }),
  step(2, 'Los cambios llegan juntos a la vista', 'Commit: búsqueda vacía y filtro Solo series. Ambos cambios llegan juntos a la vista.', { phase: 'COMMIT', snapshot: series, committed: series, render: 3, milestone: 'Commit', changed: ['input', 'toggle', 'echo', 'mode'], note: 'Dos setters del mismo evento; una actualización visual agrupada.', logs: [seriesLog, flow('Commit: filtro y texto aplicados juntos.')] }),
  step(2, '¿Dos setters significan dos renders?', 'En este evento síncrono, React agrupa las actualizaciones. Pide al grupo narrar evento → setters → render → commit.', { phase: 'COMPROBACIÓN', snapshot: series, committed: series, render: 3, milestone: 'Comprobar', note: 'La foto anterior no cambia; el siguiente render recibe los nuevos valores.', logs: [seriesLog, flow('El resultado final mantiene ambos cambios.')] }),
].map((value, index) => Object.freeze({ ...value, lines: value.lines.flatMap(number => lineMap[number] ?? [number]), index }));

export function boundedStep(index) {
  return Math.max(0, Math.min(steps.length - 1, index));
}

export function visibleCode() {
  return codeLines.map((text, index) => ({ text, number: index + 1 }));
}
