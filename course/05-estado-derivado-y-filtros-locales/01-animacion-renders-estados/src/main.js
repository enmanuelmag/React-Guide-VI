import { gsap } from 'gsap';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/sora/600.css';
import '@fontsource/jetbrains-mono/400.css';
import './style.css';
import { steps, chapters, visibleCode, boundedStep } from './scenes.js';

const $ = id => document.getElementById(id);
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const literal = value => typeof value === 'string' ? JSON.stringify(value) : String(value);
let index = 0;
let playing = false;
let timer;
let transition;
let savedFocus;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const initialPixelRatio = window.devicePixelRatio;

// One paused, registered timeline owns the code sweep. Navigation seeks it;
// snapshot data, not animation callbacks, owns all educational state.
const timeline = gsap.timeline({ paused: true });
for (const step of steps) {
  timeline.addLabel(`step-${step.index}`, step.index);
  timeline.set('#sweep', { opacity: 0, yPercent: 0 }, step.index);
  if (step.sweep) {
    timeline.fromTo('#sweep', { yPercent: 0, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.08, immediateRender: false }, step.index + 0.01);
    timeline.to('#sweep', { yPercent: 900, duration: 0.65, ease: 'none' }, step.index + 0.1);
    timeline.to('#sweep', { opacity: 0, duration: 0.1 }, step.index + 0.76);
  }
}
timeline.set('#sweep', { opacity: 0 }, steps.length);
window.__timelines = { 'renders-estados': timeline };

$('chapters').innerHTML = chapters.map((chapter, number) => `<button data-chapter="${number}">${chapter.title}</button>`).join('');

function highlightCode(text) {
  if (text.trimStart().startsWith('//')) return `<span class="comment">${escape(text)}</span>`;
  // Tokenize before escaping; replacements never rewrite previously injected HTML.
  return text.split(/('(?:[^']*)'|"(?:[^"]*)"|\b(?:const|function|return|if|export|import|from|false|true|type)\b|\b(?:useState|setQuery|setOnlySeries|handleQuery|handleSeries)\b)/g).map(token => {
    const kind = /^['"]/.test(token) ? 'string' : /^(const|function|return|if|export|import|from|false|true|type)$/.test(token) ? 'keyword' : /^(useState|setQuery|setOnlySeries|handleQuery|handleSeries)$/.test(token) ? 'symbol' : '';
    return kind ? `<span class="${kind}">${escape(token)}</span>` : escape(token);
  }).join('');
}

// Mount the complete file once. Milestones never add, remove or renumber lines.
$('code').innerHTML = visibleCode().map(line => `<span data-line="${line.number}" class="code-line"><span class="line-number">${line.number}</span><code>${highlightCode(line.text)}</code></span>`).join('');

function draw() {
  const step = steps[index];
  const chapter = chapters[step.chapter];
  $('stage').dataset.step = String(index);
  $('stage').dataset.phase = step.phase;
  $('step-index').textContent = String(index + 1).padStart(2, '0');
  $('phase').textContent = `${chapter.title} / ${step.phase}`;
  $('title').textContent = step.title;
  $('explanation').textContent = step.explanation;
  $('code-label').textContent = 'Catalog.jsx · archivo completo';
  for (const line of $('code').children) line.classList.toggle('active', step.lines.includes(Number(line.dataset.line)));
  $('state-label').textContent = `VALORES DEL RENDER ${step.render} · FOTO DE ESTA PASADA`;
  $('state-query').textContent = literal(step.snapshot.query);
  $('state-series').textContent = literal(step.snapshot.onlySeries);
  $('queue-count').textContent = `(${step.queue.length})`;
  $('queue').innerHTML = step.queue.length ? step.queue.map((update, position) => `<span class="pending"><b>${position + 1}</b><code>${update.state} → ${escape(literal(update.value))}</code></span>`).join('') : '<span class="no-pending">Sin cambios pendientes</span>';
  $('engine-note').textContent = step.note;
  $('render-badge').textContent = step.committed ? step.phase === 'COMMIT' || step.phase === 'COMPROBACIÓN' ? `Vista confirmada · render ${step.render}` : 'Vista anterior · esperando commit' : 'Sin commit';
  $('app-preview').hidden = !step.committed;
  $('empty-preview').hidden = Boolean(step.committed);
  const view = step.committed;
  if (view) {
    $('query-input').value = step.nativeText ?? view.query;
    $('only-series').checked = step.nativeChecked ?? view.onlySeries;
    $('echo-value').textContent = literal(view.query);
    $('view-series').textContent = view.onlySeries ? 'Solo series' : 'Todos';
  }
  for (const [name, element] of [['app', $('app-preview')], ['input', $('query-input')], ['toggle', $('only-series')], ['echo', $('echo')], ['mode', $('mode')]]) {
    element.classList.toggle('changed', step.changed?.includes(name) ?? false);
    const userChange = step.phase === 'EVENTO' && ((name === 'input' && step.nativeText !== undefined) || (name === 'toggle' && step.nativeChecked !== undefined));
    element.classList.toggle('user-halo', userChange);
    element.classList.toggle('react-halo', step.changed?.includes(name) ?? false);
    if (userChange) element.dataset.changeOrigin = 'usuario';
    else if (step.changed?.includes(name)) element.dataset.changeOrigin = 'react';
    else delete element.dataset.changeOrigin;
  }
  $('console').innerHTML = step.logs.map(log => `<div class="console-line"><span class="log-kind ${log.kind.toLowerCase()}">${log.kind}</span><code>${escape(log.text)}</code></div>`).join('');
  $('milestones').innerHTML = steps.filter(item => item.chapter === step.chapter).map(item => `<button data-step="${item.index}" class="milestone ${item.index === index ? 'current' : item.index < index ? 'visited' : ''}" ${item.index === index ? 'aria-current="step"' : ''}><span>${String(item.index + 1).padStart(2, '0')}</span><small>${item.milestone}</small></button>`).join('');
  for (const button of $('chapters').children) {
    button.setAttribute('aria-pressed', String(Number(button.dataset.chapter) === step.chapter));
  }
  $('previous').disabled = index === 0;
  $('next').disabled = index === steps.length - 1;
  $('play').textContent = playing ? 'Ⅱ Pausar' : '▶ Reproducir';
}

function stop() {
  playing = false;
  clearTimeout(timer);
  $('play').textContent = '▶ Reproducir';
}

function go(target, automatic = false) {
  if (!automatic) stop();
  transition?.kill();
  index = boundedStep(target);
  draw();
  const step = steps[index];
  timeline.seek(index + 0.001);
  if (step.sweep && !reducedMotion.matches) {
    transition = timeline.tweenTo(index + 0.9, { duration: Number($('speed').value) * 0.42, ease: 'none' });
  } else timeline.seek(index + 0.9);
  // Replacing milestone buttons must not strand keyboard focus in the page.
  if (document.activeElement === document.body && savedFocus === 'milestone') {
    $('milestones').querySelector('[aria-current]')?.focus({ preventScroll: true });
  }
  savedFocus = null;
}

function schedule() {
  clearTimeout(timer);
  if (!playing) return;
  timer = setTimeout(() => {
    if (index === steps.length - 1) return stop();
    go(index + 1, true);
    if (index === steps.length - 1) stop();
    else schedule();
  }, Number($('speed').value) * 1000);
}

function togglePlay() {
  if (playing) return stop();
  if (index === steps.length - 1) go(0);
  playing = true;
  $('play').textContent = 'Ⅱ Pausar';
  schedule();
}

function setHelp(open) {
  stop();
  $('help-panel').hidden = !open;
  $('help').setAttribute('aria-expanded', String(open));
  if (open) $('close-help').focus();
  else $('help').focus();
}

$('previous').addEventListener('click', () => go(index - 1));
$('next').addEventListener('click', () => go(index + 1));
$('restart').addEventListener('click', () => go(0));
$('play').addEventListener('click', togglePlay);
$('speed').addEventListener('change', () => { go(index, playing); schedule(); });
$('chapters').addEventListener('click', event => { const button = event.target.closest('[data-chapter]'); if (button) go(chapters[Number(button.dataset.chapter)].start); });
$('milestones').addEventListener('click', event => { const button = event.target.closest('[data-step]'); if (button) { savedFocus = 'milestone'; go(Number(button.dataset.step)); } });
$('type-demo').addEventListener('click', () => go(5));
$('only-series').addEventListener('change', () => go(13));
$('help').addEventListener('click', () => setHelp($('help-panel').hidden));
$('close-help').addEventListener('click', () => setHelp(false));
$('fullscreen').addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { $('fullscreen').textContent = 'Usa pantalla completa del navegador'; }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('help-panel').hidden) return setHelp(false);
  if (!$('help-panel').hidden || event.ctrlKey || event.metaKey || event.altKey || event.target.matches('input, select, textarea, [contenteditable]')) return;
  if (event.key === ' ' && event.target.closest('button')) return;
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End', ' '].includes(event.key)) return;
  event.preventDefault();
  if (event.target.closest('.milestone')) savedFocus = 'milestone';
  if (event.key === 'ArrowRight') go(index + 1);
  if (event.key === 'ArrowLeft') go(index - 1);
  if (event.key === 'Home') go(0);
  if (event.key === 'End') go(steps.length - 1);
  if (event.key === ' ') togglePlay();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
function fit() {
  // Browser zoom changes DPR and CSS viewport together. Keep the base fitting
  // scale rather than shrinking the canvas again to cancel the user's zoom.
  const zoom = window.devicePixelRatio / initialPixelRatio;
  const width = Number($('stage').dataset.width);
  const height = Number($('stage').dataset.height);
  const scale = Math.min(innerWidth * zoom / width, innerHeight * zoom / height);
  $('stage').style.transform = `scale(${scale})`;
  $('stage').style.left = `${Math.max(0, (innerWidth - width * scale) / 2)}px`;
  $('stage').style.top = `${Math.max(0, (innerHeight - height * scale) / 2)}px`;
  document.body.style.width = `${Math.max(innerWidth, width * scale)}px`;
  document.body.style.height = `${Math.max(innerHeight, height * scale)}px`;
}
addEventListener('resize', fit);
fit();
go(0);
