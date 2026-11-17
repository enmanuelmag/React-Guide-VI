import { gsap } from 'gsap';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/sora/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';
import { sources } from './sources.js';
import { makeSteps, chapterNames, flowNames } from './scenes.js';
import { highlightLines } from './highlight.js';

const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const initialRatio = devicePixelRatio;
let index = 0, steps = makeSteps(), playing = false, timer, motion, activeFile;
const files = Object.keys(sources);
$('file').innerHTML = files.map(path => '<option value="' + path + '">' + path + '</option>').join('');

function showCode(path, markerLine) {
  if (activeFile !== path) {
    activeFile = path;
    $('code').innerHTML = highlightLines(sources[path]).map((line, i) =>
      '<span class="code-line" data-line="' + (i + 1) + '"><span class="line-number">' + (i + 1) + '</span><code>' + line + '</code></span>'
    ).join('');
    document.querySelector('.code-body').scrollTop = 0;
  }
  $('file').value = path;
  $('file-note').textContent = markerLine ? 'Código del checkpoint 09' : 'Exploración manual; avanza para retomar';
  for (const row of $('code').children) row.classList.toggle('active', Number(row.dataset.line) === markerLine);
  const row = $('code').querySelector('.active');
  const body = document.querySelector('.code-body');
  if (row && (row.offsetTop < body.scrollTop + 20 || row.offsetTop + row.offsetHeight > body.scrollTop + body.clientHeight - 20)) {
    body.scrollTop = Math.max(0, row.offsetTop - body.clientHeight * .3);
  }
}

function pageHtml(s) {
  if (s.view === 'blank') return '<p>Resolvemos la dirección…</p>';
  const back = '<button id="return-link" class="return-link" data-return>Volver a la búsqueda</button>';
  if (s.view === 'detail') {
    const input = s.input || { externalId: '438631', mediaType: 'movie' };
    return '<h3>Detalle provisional</h3><p>La ruta ya produjo un input válido. La próxima sesión consultará el detalle remoto.</p><pre>' +
      escape(JSON.stringify({ externalId: input.externalId, mediaType: input.mediaType }, null, 2)) + '</pre>' + back;
  }
  if (s.view === 'invalid') return '<div class="error-view"><h3>URL de detalle no válida</h3><p>Revisa el tipo y el identificador del medio.</p>' + back + '</div>';
  if (s.view === 'missing') return '<div class="error-view"><h3>Página no encontrada</h3><p>La URL no coincide con una página pública.</p>' + back + '</div>';
  const form = '<div class="search-form"><span class="search-field">' + (s.view === 'results' ? 'Dune' : 'Buscar título') + '</span><span>Películas</span><button data-search>Buscar</button></div>';
  if (s.view === 'empty') return form + '<p>Escribe un título y confirma la búsqueda.</p>';
  return form + '<article class="card"><div class="poster" aria-hidden="true">D</div><div><strong>Dune</strong><small>2021 / Película</small><small>movie / 438631</small></div><button id="detail-link">Ver detalle</button></article>';
}

function draw() {
  const s = steps[index];
  $('stage').dataset.step = index;
  $('stage').dataset.scenario = $('scenario').value;
  $('step-number').textContent = String(index + 1).padStart(2, '0');
  $('title').textContent = s.title;
  $('explanation').textContent = s.explanation;
  showCode(s.file, s.line);
  $('address').textContent = s.url;
  $('outlet').innerHTML = pageHtml(s);
  $('outlet').dataset.view = s.view;
  for (const id of ['address', 'outlet']) $(id).classList.toggle('react-change', s.changed === id);
  $('back').disabled = s.history.position === 0 && s.cursor !== 'back';
  $('forward').disabled = s.history.position === s.history.entries.length - 1 && s.cursor !== 'forward';
  $('flow').innerHTML = flowNames.map((name, i) => (i ? '<span class="flow-arrow" aria-hidden="true">→</span>' : '') + '<div class="flow-node ' + (i === s.phase ? 'active' : i < s.phase ? 'done' : '') + '">' + name + '</div>').join('');
  $('detail-label').textContent = s.detailLabel;
  $('detail-value').textContent = s.detailValue;
  $('history').innerHTML = s.history.entries.map((url, i) => '<span class="' + (i === s.history.position ? 'current' : '') + '" title="' + escape(url) + '">' + escape(url) + '</span>').join('');
  const main = $('scenario').value === 'main';
  $('chapters').innerHTML = main ? chapterNames.map((name, i) => '<button data-chapter="' + i + '" aria-pressed="' + (s.chapter === i) + '">' + name + '</button>').join('') : '<button aria-pressed="true">' + escape($('scenario').selectedOptions[0].text) + '</button>';
  const subset = main ? steps.filter(step => step.chapter === s.chapter) : steps;
  const spanish = ['Rutas','Router','Búsqueda','Outlet','Destino','Clic','URL','Ruta','Segmentos','Params','Tipo','ID','Contenido','Vista','Atrás','Reinicio','Adelante','Cierre'];
  $('milestones').innerHTML = subset.map(step => '<button class="milestone" data-step="' + step.index + '" aria-label="' + escape(step.title) + '" ' + (step.index === index ? 'aria-current="step"' : '') + '><span>' + String(step.index + 1).padStart(2, '0') + '</span><small>' + (main ? spanish[step.index] : ['URL','Ruta','Página','Validar','Vista'][step.index]) + '</small></button>').join('');
  $('previous').disabled = index === 0;
  $('next').disabled = index === steps.length - 1;
  $('play').textContent = playing ? 'Ⅱ Pausar' : '▶ Reproducir';
  positionCursor(s);
}

function positionCursor(s) {
  motion?.kill();
  const cursor = $('cursor');
  const target = s.cursor && $(s.cursor);
  cursor.hidden = !target;
  if (!target) return;
  const browserBounds = document.querySelector('.browser').getBoundingClientRect();
  const bounds = target.getBoundingClientRect();
  const scale = browserBounds.width / document.querySelector('.browser').offsetWidth;
  const x = (bounds.left - browserBounds.left + bounds.width * .65) / scale;
  const y = (bounds.top - browserBounds.top + bounds.height * .55) / scale;
  gsap.set(cursor, { left: 0, top: 0, x, y, scale: 1 });
  gsap.set(cursor.querySelector('span'), { opacity: s.click ? 1 : 0 });
  if (reduced.matches) return;
  motion = gsap.timeline();
  const startY = Math.min(document.querySelector('.browser').offsetHeight - 60, y + 35);
  motion.fromTo(cursor, { x: Math.max(4, x - 65), y: startY }, { x, y, duration: .65, ease: 'power2.out' });
  if (s.click) motion.to(cursor, { scale: .82, duration: .14 }).to(cursor, { scale: 1, duration: .18 });
}

function stop() { playing = false; clearTimeout(timer); $('play').textContent = '▶ Reproducir'; }
function go(target, automatic = false) {
  if (!automatic) stop();
  motion?.kill();
  index = Math.max(0, Math.min(steps.length - 1, target));
  draw();
}
function schedule() {
  clearTimeout(timer);
  if (playing) timer = setTimeout(() => {
    go(index + 1, true);
    if (index === steps.length - 1) stop();
    else schedule();
  }, Number($('speed').value));
}
function togglePlay() {
  if (playing) return stop();
  if (index === steps.length - 1) go(0);
  playing = true; $('play').textContent = 'Ⅱ Pausar'; schedule();
}
function selectScenario(value) {
  $('scenario').value = value;
  steps = makeSteps(value);
  activeFile = null;
  go(0);
}
$('previous').onclick = () => go(index - 1);
$('next').onclick = () => go(index + 1);
$('play').onclick = togglePlay;
$('restart').onclick = () => { activeFile = null; go(0); };
$('scenario').onchange = () => selectScenario($('scenario').value);
$('speed').onchange = schedule;
$('file').onchange = () => { stop(); showCode($('file').value, null); };
$('chapters').onclick = e => { const button = e.target.closest('[data-chapter]'); if (button) go(steps.findIndex(step => step.chapter === Number(button.dataset.chapter))); };
$('milestones').onclick = e => { const button = e.target.closest('[data-step]'); if (button) { go(Number(button.dataset.step)); $('milestones').querySelector('[aria-current]').focus({ preventScroll: true }); } };
$('back').onclick = () => { if ($('scenario').value === 'main') go(index === 14 ? 15 : 14); };
$('forward').onclick = () => { if ($('scenario').value === 'main') go(16); };
$('outlet').onclick = e => {
  if (e.target.closest('#detail-link')) go(index < 5 ? 5 : 6);
  if (e.target.closest('[data-return]')) {
    selectScenario('link-back');
    go(1);
  }
  if (e.target.closest('[data-search]')) { if ($('scenario').value !== 'main') selectScenario('main'); go(0); }
};
$('help').onclick = () => { stop(); $('help-panel').showModal(); };
$('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('fullscreen').title = 'Usa la pantalla completa del navegador'; } };
document.addEventListener('keydown', e => {
  if ($('help-panel').open || e.metaKey || e.ctrlKey || e.altKey || e.target.matches('select,input,textarea') || (e.key === ' ' && e.target.closest('button'))) return;
  if (!['ArrowRight','ArrowLeft','Home','End',' '].includes(e.key)) return;
  e.preventDefault();
  const milestone = e.target.closest('.milestone');
  if (e.key === 'ArrowRight') go(index + 1);
  if (e.key === 'ArrowLeft') go(index - 1);
  if (e.key === 'Home') go(0);
  if (e.key === 'End') go(steps.length - 1);
  if (e.key === ' ') togglePlay();
  if (milestone) $('milestones').querySelector('[aria-current]').focus({ preventScroll: true });
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
function fit() {
  const z = devicePixelRatio / initialRatio;
  const scale = Math.min(innerWidth * z / 1920, innerHeight * z / 1180);
  $('stage').style.transform = 'scale(' + scale + ')';
  $('stage').style.left = Math.max(0, (innerWidth - 1920 * scale) / 2) + 'px';
  $('stage').style.top = Math.max(0, (innerHeight - 1180 * scale) / 2) + 'px';
  document.body.style.width = Math.max(innerWidth, 1920 * scale) + 'px';
  document.body.style.height = Math.max(innerHeight, 1180 * scale) + 'px';
}
addEventListener('resize', () => { fit(); positionCursor(steps[index]); });
reduced.addEventListener('change', () => positionCursor(steps[index]));
fit(); go(0);
