import { sources } from './sources.js';

export const paths = {
  app: 'src/App.tsx',
  main: 'src/main.tsx',
  layout: 'src/layouts/public-layout.tsx',
  card: 'src/components/media-search-results.tsx',
  detail: 'src/pages/media-detail-page.tsx',
  adapter: 'src/adapters/media-detail-route-params-to-input.ts',
  search: 'src/pages/search-page.tsx',
  missing: 'src/pages/not-found-page.tsx',
};
export const destination = '/media/movie/438631';
export const chapterNames = ['Orientarse', 'Navegar', 'Resolver', 'Volver'];
export const flowNames = ['Navegación', 'URL', 'Ruta', 'Parámetros', 'Pantalla'];

export function moveHistory(history, action, url) {
  const { entries, position } = history;
  if (action === 'PUSH') {
    return { entries: [...entries.slice(0, position + 1), url], position: position + 1 };
  }
  if (action === 'REPLACE') {
    return { entries: entries.map((entry, i) => i === position ? url : entry), position };
  }
  const direction = action === 'BACK' ? -1 : action === 'FORWARD' ? 1 : 0;
  return { entries: [...entries], position: Math.max(0, Math.min(entries.length - 1, position + direction)) };
}

export function resolvePath(url) {
  if (url === '/') return { route: 'index', view: 'redirect', params: null };
  if (url === '/search') return { route: 'search', view: 'empty', params: null };
  const match = url.match(/^\/media\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return { route: '*', view: 'missing', params: null };
  const params = { mediaType: match[1], externalId: match[2] };
  return { route: 'media/:mediaType/:externalId', view: ['movie', 'series'].includes(params.mediaType) ? 'detail' : 'invalid', params };
}

const initialHistory = { entries: ['/search'], position: 0 };
const detailHistory = moveHistory(initialHistory, 'PUSH', destination);
function frame(title, explanation, file, marker, changes = {}) {
  return {
    title, explanation, file: paths[file], marker,
    chapter: 0, phase: 2, url: '/search', view: 'results', route: 'search',
    history: initialHistory, params: null, input: null,
    detailLabel: 'Ruta elegida', detailValue: '/search → SearchPage',
    cursor: null, click: false, changed: null,
    ...changes,
  };
}
function finish(steps) {
  return steps.map((step, index) => {
    const lines = sources[step.file].split('\n');
    const line = lines.findIndex(text => text.includes(step.marker)) + 1;
    if (!line) throw new Error('Marcador ausente: ' + step.file + ' ' + step.marker);
    return { ...step, index, line };
  });
}
const matched = {
  url: destination, history: detailHistory, route: 'media/:mediaType/:externalId',
};
const params = { mediaType: 'movie', externalId: '438631' };

export function makeSteps(scenario = 'main') {
  if (scenario !== 'main') return alternative(scenario);
  return finish([
    frame('El directorio de páginas', 'Cada Route relaciona una dirección con una página.', 'app', '<Routes>'),
    frame('Quién coordina la ubicación', 'BrowserRouter conecta la aplicación con el historial del navegador.', 'main', '<BrowserRouter>', { phase: 0, detailLabel: 'Coordinador', detailValue: 'BrowserRouter → ubicación disponible' }),
    frame('Estamos en búsqueda', '/search coincide con la ruta que muestra SearchPage.', 'app', 'path="search"'),
    frame('Un espacio para cada página', 'El encabezado pertenece al layout. La página hija ocupa Outlet.', 'layout', '<Outlet', { phase: 4, changed: 'outlet', detailLabel: 'Layout compartido', detailValue: 'AppHeader + Outlet(SearchPage)' }),
    frame('El enlace tiene una dirección', 'El resultado aporta movie y 438631 para construir el destino.', 'card', 'to={', { chapter: 1, phase: 0, cursor: 'detail-link', detailLabel: 'Destino del Link', detailValue: destination }),
    frame('La persona pulsa el enlace', 'Link gestiona este clic como una navegación interna.', 'card', 'component={Link}', { chapter: 1, phase: 0, cursor: 'detail-link', click: true, detailLabel: 'Acción', detailValue: 'Link → solicitar navegación' }),
    frame('Cambia la ubicación', 'Añadimos una entrada al historial. Ahora resolvemos esa dirección.', 'card', 'to={', { ...matched, route: null, chapter: 1, phase: 1, changed: 'address', detailLabel: 'Historial', detailValue: 'PUSH → nueva entrada' }),
    frame('La ruta coincide', 'Los segmentos encajan con el patrón de la página de detalle.', 'app', 'path="media/', { ...matched, chapter: 2, phase: 2, detailLabel: 'Patrón', detailValue: '/media/:mediaType/:externalId' }),
    frame('Cada segmento tiene nombre', 'movie corresponde a mediaType; 438631 corresponde a externalId.', 'app', 'path="media/', { ...matched, chapter: 2, phase: 3, params, detailLabel: 'Segmentos capturados', detailValue: "mediaType: 'movie'  →  externalId: '438631'" }),
    frame('La página lee los parámetros', 'useParams entrega estos textos al adapter. Todavía no consultamos datos.', 'detail', 'toMediaDetailInput(useParams())', { ...matched, chapter: 2, phase: 3, params, detailLabel: 'useParams()', detailValue: "{ mediaType: 'movie', externalId: '438631' }" }),
    frame('Comprobamos el tipo', 'Nuestro dominio acepta movie y series. movie pasa esta comprobación.', 'adapter', "params.mediaType !==", { ...matched, chapter: 2, phase: 3, params, detailLabel: 'Validación', detailValue: "movie → tipo permitido" }),
    frame('Construimos la identidad', 'El ID está presente. Eso no demuestra que exista en el servidor.', 'adapter', 'params.externalId ===', { ...matched, chapter: 2, phase: 3, params, input: params, detailLabel: 'Input válido', detailValue: "{ externalId: '438631', mediaType: 'movie' }" }),
    frame('Preparamos el contenido', 'La página elige el detalle provisional porque el input es válido.', 'detail', '<Title order={1}>Detalle provisional', { ...matched, chapter: 2, phase: 4, params, input: params, detailLabel: 'Página elegida', detailValue: 'MediaDetailPage → detalle provisional' }),
    frame('La página ocupa Outlet', 'Cambia el contenido central. El encabezado conserva su lugar.', 'layout', '<Outlet', { ...matched, chapter: 2, phase: 4, params, input: params, view: 'detail', changed: 'outlet', detailLabel: 'Vista confirmada', detailValue: 'Outlet(MediaDetailPage)' }),
    frame('Atrás recorre el historial', 'El navegador vuelve a /search y Router resuelve esa ubicación.', 'app', 'path="search"', { chapter: 3, phase: 1, history: moveHistory(detailHistory, 'BACK'), view: 'detail', cursor: 'back', click: true, detailLabel: 'Historial', detailValue: 'POP → entrada anterior; sin añadir otra' }),
    frame('La búsqueda se monta de nuevo', 'Sus estados locales empiezan vacíos. La URL no guardaba el formulario.', 'search', "useState('')", { chapter: 3, phase: 4, history: moveHistory(detailHistory, 'BACK'), view: 'empty', changed: 'outlet', detailLabel: 'Estado local', detailValue: "draftQuery: ''   submittedSearch: null" }),
    frame('Adelante recupera la dirección', 'Recorremos la entrada siguiente y volvemos al detalle provisional.', 'detail', 'toMediaDetailInput(useParams())', { ...matched, chapter: 3, phase: 4, params, input: params, view: 'detail', cursor: 'forward', click: true, changed: 'outlet', detailLabel: 'Historial', detailValue: 'POP → entrada siguiente; sin añadir otra' }),
    frame('De la dirección a la página', 'Router elige la página. El adapter valida la identidad. El detalle remoto viene en la sesión 10.', 'app', 'path="media/', { ...matched, chapter: 3, phase: 4, params, input: params, view: 'detail', detailLabel: 'Responsabilidades', detailValue: 'Router → página   /   adapter → input válido' }),
  ]);
}

function alternative(scenario) {
  if (scenario === 'link-back') {
    const history = moveHistory(detailHistory, 'PUSH', '/search');
    return finish([
      frame('Volver también puede ser un enlace', 'Este enlace pide /search; no recorre una entrada anterior.', 'detail', 'to="/search"', { ...matched, view: 'detail', input: params, cursor: 'return-link', detailLabel: 'Destino del Link', detailValue: '/search' }),
      frame('El enlace añade una entrada', 'PUSH añade /search después del detalle. Atrás conserva otra función.', 'detail', 'to="/search"', { url: '/search', history, view: 'detail', phase: 1, cursor: 'return-link', click: true, detailLabel: 'Historial', detailValue: 'PUSH → nueva entrada /search', changed: 'address' }),
      frame('Una nueva búsqueda', 'SearchPage se monta con sus estados locales vacíos.', 'search', "useState('')", { history, view: 'empty', phase: 4, changed: 'outlet', detailLabel: 'Estado local', detailValue: "draftQuery: ''   submittedSearch: null" }),
    ]);
  }
  if (scenario === 'redirect') {
    const root = { entries: ['/'], position: 0 };
    return finish([
      frame('Entramos por la raíz', 'La aplicación ya está cargada en /. Coincide la ruta index.', 'app', 'Route index', { url: '/', history: root, route: 'index', view: 'blank', detailValue: '/ → index' }),
      frame('Redirigir y reemplazar', 'Navigate replace sustituye la entrada actual por /search.', 'app', '<Navigate replace', { url: '/search', history: moveHistory(root, 'REPLACE', '/search'), view: 'empty', phase: 1, detailLabel: 'Historial', detailValue: 'REPLACE → una sola entrada', changed: 'address' }),
      frame('La búsqueda está lista', 'Atrás no vuelve a una raíz redundante creada por esta redirección.', 'search', "useState('')", { history: moveHistory(root, 'REPLACE', '/search'), view: 'empty', phase: 4, changed: 'outlet', detailValue: '/search → SearchPage' }),
    ]);
  }
  const urls = { invalid: '/media/anime/438631', unknown: '/una-cosa', missing: '/media/movie', direct: destination };
  const url = urls[scenario];
  if (!url) throw new Error('Escenario desconocido');
  const resolved = resolvePath(url);
  const common = { url, history: { entries: [url], position: 0 }, route: resolved.route, view: 'blank' };
  const noMatch = resolved.route === '*';
  const intro = frame('Abrimos esta dirección', 'Partimos del documento ya cargado en esta URL; no hace falta un clic previo.', 'app', '<Routes>', { ...common, phase: 1, detailLabel: 'Entrada directa', detailValue: url, changed: 'address' });
  const match = frame(noMatch ? 'No coincide una ruta concreta' : 'El patrón sí coincide', noMatch ? 'La ruta comodín muestra Página no encontrada.' : 'Capturamos los segmentos. Coincidir todavía no valida el dominio.', 'app', noMatch ? 'path="*"' : 'path="media/', { ...common, params: resolved.params, detailLabel: 'Ruta elegida', detailValue: noMatch ? '* → NotFoundPage' : '/media/:mediaType/:externalId' });
  if (noMatch) return finish([intro, match,
    frame('Página no encontrada', scenario === 'missing' ? 'Falta el segmento externalId. MediaDetailPage no llega a montarse.' : 'La dirección no tiene una página pública concreta.', 'missing', '<Title', { ...common, view: 'missing', phase: 4, changed: 'outlet', detailValue: '* → NotFoundPage' }),
  ]);
  const valid = scenario === 'direct';
  return finish([intro, match,
    frame('Leemos los textos de la URL', 'useParams entrega los segmentos a la página.', 'detail', 'toMediaDetailInput(useParams())', { ...common, params: resolved.params, phase: 3, detailLabel: 'useParams()', detailValue: JSON.stringify(resolved.params) }),
    frame(valid ? 'Identidad válida' : 'El dominio rechaza anime', valid ? 'movie e identificador presente permiten construir el input.' : 'anime cabe en la dirección, pero no pertenece a movie o series.', 'adapter', 'params.mediaType !==', { ...common, params: resolved.params, phase: 3, input: valid ? resolved.params : null, detailLabel: 'Resultado del adapter', detailValue: valid ? JSON.stringify(resolved.params) : 'null' }),
    frame(valid ? 'Detalle provisional' : 'URL de detalle no válida', valid ? 'Abrir directamente identifica el medio; todavía no solicita el detalle.' : 'La propia página muestra el error y ofrece volver a búsqueda.', 'detail', valid ? '<Title order={1}>Detalle provisional' : 'if (detailInput === null)', { ...common, view: valid ? 'detail' : 'invalid', params: resolved.params, input: valid ? resolved.params : null, phase: 4, changed: 'outlet', detailLabel: 'Resultado', detailValue: valid ? 'Identidad preparada; 0 peticiones de detalle' : 'Ruta encontrada / identidad rechazada' }),
  ]);
}
